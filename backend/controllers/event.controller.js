
const Event = require("../model/event")


function generateEvents() {
  const dayTypes = ["BADGE_SWIPE", "DOOR_OPEN"];
  const nightTypes = ["BADGE_SWIPE", "DOOR_OPEN", "FENCE_ALERT", "TRESSPASSING"];
  const events = [];
  const base = new Date();
  base.setDate(base.getDate() - 1);
  for (let i = 0; i < 2; i++) {
    const t = new Date(base);
    t.setUTCHours(12, 30 + i * 60, 0, 0); 
    events.push({
      type: dayTypes[Math.floor(Math.random() * dayTypes.length)],
      timestamp: t,
      isNight: false,
      location: { lat: 12.97 + Math.random() * 0.01, lng: 77.59 + Math.random() * 0.01 }
    });
  }
  for (let i = 0; i < 8; i++) {
    const t = new Date(base);
    t.setUTCHours(17, 30 + i * 45, 0, 0); 
    events.push({
      type: nightTypes[Math.floor(Math.random() * nightTypes.length)],
      timestamp: t,
      isNight: true,
      location: { lat: 12.97 + Math.random() * 0.01, lng: 77.59 + Math.random() * 0.01 }
    });
  }

  return events;
}


module.exports.event = async(req,res)=>{
    try{
        const events = generateEvents()
        res.json(events)
    }catch(error){
        res.status(500).json({error:error.message})
    }
}