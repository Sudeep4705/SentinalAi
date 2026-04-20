const express = require("express")
const router = express.Router()
const Event = require("../model/event")

router.get("/events",async(req,res)=>{
    try{
        const events = await Event.find().sort({timestamp:-1})
        res.json(events)
    }catch(error){
        res.status(500).json({error:error.message})
    }
})



router.get("/add-test", async (req, res) => {
  const event = await Event.create({
    type: "badge_swipe",
    location: { lat: 12.97, lng: 77.59 },
    metadata: { success: false }
  });
  res.json(event);
});


module.exports = router