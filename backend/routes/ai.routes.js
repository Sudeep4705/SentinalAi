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
    const repeated = tools["checkRepeatedEvents"](events)
    // console.log(repeated)

    const nightEvents = tools["findNightEvent"](events)
    // console.log(nightEvents);
    
    const formattedEvents =  events.map((e=> `${e.type} at ${new Date(e.timestamp).toLocaleString()}`)).join("\n")
  
    
  console.log(Object.values(repeated));
    const isSuspicious = Object.values(repeated).some(count=>count > 3) || nightEvents.length>0
    // console.log(isSuspicious);
    


const normalPrompt = `
You are a security analyst.
Events:
${formattedEvents}

This looks like normal activity.

Give a short explanation.
`;

const suspiciousPrompt  = `You are a security analyst for an industrial site.
    Analyze the following overnight events and provide:

   

   1. What happened
   2. Whether it is suspicious or normal
   3. What needs attention or action

   Events:
   ${formattedEvents}

   Events Counts:${JSON.stringify(repeated)} 

   Night Events:
   ${JSON.stringify(nightEvents)}
    `;
const prompt = isSuspicious ? suspiciousPrompt : normalPrompt
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
