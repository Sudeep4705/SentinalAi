
const Event = require("../model/event")


function generateEvents() {
  const dayTypes = ["BADGE_SWIPE", "DOOR_OPEN"]; // normal day events
  const nightTypes = ["BADGE_SWIPE", "DOOR_OPEN", "FENCE_ALERT", "TRESSPASSING"]; // risky night events

  const base = new Date();
  base.setDate(base.getDate() - 1);
  base.setUTCHours(8, 30, 0, 0); 

  return Array.from({ length: 10 }, (_, i) => {
    const timestamp = new Date(base.getTime() + i * 3600000); 
    const hour = timestamp.getHours();
    const isNight = hour >= 22 || hour < 6; 

    return {
      type: isNight
        ? nightTypes[Math.floor(Math.random() * nightTypes.length)]
        : dayTypes[Math.floor(Math.random() * dayTypes.length)],
      timestamp,
      isNight, 
      location: {
        lat: 12.97 + Math.random() * 0.01,
        lng: 77.59 + Math.random() * 0.01
      }
    };
  });
}


module.exports.event = async(req,res)=>{
    try{
        const events = generateEvents()
        res.json(events)
    }catch(error){
        res.status(500).json({error:error.message})
    }
}