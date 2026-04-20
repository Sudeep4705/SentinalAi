const express = require("express")
const router = express.Router()


function checkRepeatedEvents(events){
  const count = {};
  events.forEach(e => {
    count[e.type] = (count[e.type]| 0) +1
  });
  return count
}






const Groq = require("groq-sdk");
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});
router.post("/ai-summary", async (req, res) => {
  try {
    const { events } = req.body;
    const formattedevents =  events.map((e=> `${e.type} at ${new Date(e.timestamp).toLocaleString()}`)).join("\n")


    const prompt = `You are a security analyst for an industrial site.
    Analyze the following overnight events and provide:

   1. What happened
   2. Whether it is suspicious or normal
   3. What needs attention or action
   Events:
   ${formattedevents}
    `;

  const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [ 
        { role: "user", content: prompt }
      ]
    });

    console.log(response);
    res.json({summary:response.choices[0].message.content})

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router
