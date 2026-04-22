
const Event = require("../model/event")


function generateEvents() {
  const types = ["BADGE_SWIPE", "DOOR_OPEN", "FENCE_ALERT", "TRESSPASSING"];
  const lastNight = new Date();
  lastNight.setDate(lastNight.getDate() - 1); 
  lastNight.setHours(2, 0, 0, 0); 

  return Array.from({ length: 10 }, (_, i) => ({
    type: types[Math.floor(Math.random() * types.length)],
    timestamp: new Date(lastNight.getTime() + i * 60000), 
    location: {
      lat: 12.97 + Math.random() * 0.01,
      lng: 77.59 + Math.random() * 0.01
    }
  }));
}


module.exports.event = async(req,res)=>{
    try{
        const events = generateEvents()
        res.json(events)
    }catch(error){
        res.status(500).json({error:error.message})
    }
}