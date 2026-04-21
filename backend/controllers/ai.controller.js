const tools = {
  checkRepeatedEvents: (events) => {
    const count = {};
    events.forEach((e) => {
      count[e.type] = (count[e.type] || 0) + 1;
    });
    return count;
  },

  findNightEvents: (events) => {
    return events.filter((e) => {
      const hour = new Date(e.timestamp).getHours();
      return hour >= 0 && hour < 6;
    });
  },
};

const Groq = require("groq-sdk");
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

module.exports.Aiprompt = async (req, res) => {
  try {
    const { events } = req.body;
    const formattedEvents = events
      .map((e) => `${e.type} at ${new Date(e.timestamp).toLocaleString()}`)
      .join("\n");
    const prompt = `
You are an AI security analyst.

You have access to these tools:
- checkRepeatedEvents → counts repeated event types
- findNightEvents → finds events between 12 AM and 6 AM

Instructions:
- First decide if you need a tool
- If needed, respond ONLY like this:

TOOL: tool_name

- If no tool is needed, give final answer directly

Events:
${formattedEvents}

IMPORTANT:
- If events look repeated, you MUST call checkRepeatedEvents
- Do NOT manually count events from text
- Use tools for accuracy
`;
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });
    const airesponse = response.choices[0].message.content;
    if (airesponse.startsWith("TOOL:")) {
      const toolname = airesponse.split("TOOL:")[1].trim();
      const toolResult = tools[toolname](events);
      const secondResponse = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "user", content: prompt },
          { role: "assistant", content: airesponse },
          {
            role: "user",
            content: `
You MUST use this tool result strictly.

Tool Result:
${JSON.stringify(toolResult)}

Instructions:
- Do NOT assume anything outside this data
- Explain WHY it is suspicious or normal
- Give a short reasoning sentence (not yes/no)

Return ONLY JSON:

{
  "whatHappened": "...",
  "isSuspicious":"yes or no, followed by a brief reason. Must start with 'yes' or 'no'.",
  "actionNeeded": "..."
}
`,
          },
        ],
      });
      const content = secondResponse.choices[0].message.content;

      let result;
      try {
        result = JSON.parse(content);
      } catch {
        result = {
          whatHappened: content,
          isSuspicious: "Unknown",
          actionNeeded: "Manual review required",
        };
      }
      res.json({ message: result });
    } else {
      res.json({
        message: {
          whatHappened: airesponse,
          isSuspicious: "Unknown",
          actionNeeded: "No tool used",
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
