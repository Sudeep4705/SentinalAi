const express = require("express")
const router = express.Router()


const tools = {
   checkRepeatedEvents : (events)=>{
  const count = {};
  events.forEach(e => {
    count[e.type] = (count[e.type] || 0) +1
  });
  return count
},

findNightEvent :(events)=>{
  return events.filter(e=>{
    const hour = new Date(e.timestamp).getHours()
    return hour >=0 && hour < 6;
  });
}
}



const Groq = require("groq-sdk");
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/ai-summary", async (req, res) => {
  try {
    const { events } = req.body;   
    
    const formattedEvents =  events.map((e=> `${e.type} at ${new Date(e.timestamp).toLocaleString()}`)).join("\n")
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
`;
  const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [ 
        { role: "user", content: prompt }
      ]
    });

    // console.log(response);
    res.json({summary:response.choices[0].message.content})

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router
