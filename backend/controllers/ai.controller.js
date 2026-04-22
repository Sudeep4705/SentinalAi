const tools = {
  checkRepeatedEvents: (events) => {
    const count = {};
    events.forEach((e) => { count[e.type] = (count[e.type] || 0) + 1; });
    return count;
  },
  findNightEvents: (events) => {
  return events.filter((e) => {
    const hour = new Date(e.timestamp).getHours();
    return hour >= 22 || hour < 6; 
  });
},
  getEventByZone: (events, zone) => events.filter((e) => e.zone === zone),

  flagForEscalation: (events) => {
    const risky = events.filter(e => ["TRESSPASSING","FENCE_ALERT","BADGE_FAIL"].includes(e.type));
    return { shouldEscalate: risky.length >= 2, count: risky.length };
  },
  
  getFailedBadgeSwipes: (events) => events.filter(e => e.type === "BADGE_FAIL"),
};

const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports.Aiprompt = async (req, res) => {
  try {
    const { events } = req.body;

    const messages = [
   {
  role: "system",
  content: `You are a security analyst investigating overnight events at an industrial site.

You have these tools:
- checkRepeatedEvents → counts how many times each event type occurred
- findNightEvents → finds events that happened between 12AM and 6AM
- getEventByZone → filters events by zone
- flagForEscalation → checks if situation needs escalation
- getFailedBadgeSwipes → returns all failed badge swipe attempts

To use a tool write exactly:
TOOL: toolName

Rules:
- Always start by calling checkRepeatedEvents to understand what happened
- Then call flagForEscalation to check severity
- After using tools, give your final answer

Final answer must be ONLY this JSON with detailed sentences:
{
  "whatHappened": "Write 2-3 sentences describing what happened overnight in detail",
  "isSuspicious": "yes, because [explain clearly why] OR no, because [explain clearly why]",
  "actionNeeded": "Write exactly what should be done next",
  "needsEscalation": true or false,
  "confidence": "high or medium or low"
}`
},
      {
        role: "user",
        content: `Investigate: ${JSON.stringify(events)}`
      }
    ];

    let result = null;

    for (let i = 0; i < 5; i++) {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages
      });

      const aiText = response.choices[0].message.content.trim();
      messages.push({ role: "assistant", content: aiText });

      if (aiText.startsWith("TOOL:")) {
        const toolName = aiText.replace("TOOL:", "").trim();
        const toolResult = tools[toolName] ? tools[toolName](events) : { error: "tool not found" };
        messages.push({ role: "user", content: `Result: ${JSON.stringify(toolResult)}. Continue or give final JSON.` });
      } else {
        try {
          result = JSON.parse(aiText.replace(/```json|```/g, "").trim());
          break;
        } catch {
          messages.push({ role: "user", content: "Return ONLY valid JSON, nothing else." });
        }
      }
    }
    res.json({ message: result || { whatHappened: "Could not complete", isSuspicious: "unknown", actionNeeded: "Manual review" } });

  } catch (err) {
    console.log(err);
    
    res.status(500).json({ error: err.message });
  }
};