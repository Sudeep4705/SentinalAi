const tools = {
  checkRepeatedEvents: (events) => {
    const count = {};
    events.forEach((e) => { count[e.type] = (count[e.type] || 0) + 1; });
    return count;
  },
  findNightEvents: (events) => {
    return events.filter((e) => new Date(e.timestamp).getHours() < 6);
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
        content: `You are a security analyst. You have these tools:
- checkRepeatedEvents
- findNightEvents  
- getEventByZone
- flagForEscalation
- getFailedBadgeSwipes

To use a tool write: TOOL: toolName
When done write ONLY JSON: { "whatHappened":"...", "isSuspicious":"yes/no because...", "actionNeeded":"...", "needsEscalation": true/false }`
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
    res.status(500).json({ error: err.message });
  }
};