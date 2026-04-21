
const Event = require("../model/event")


function generateEvents() {
  const types = ["badge_swipe", "door_open", "fence_alert","tresspassing"];
  return Array.from({ length: 10 }, (_, i) => ({
    type: types[Math.floor(Math.random() * types.length)],
    timestamp: new Date(Date.now() - i * 60000),
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