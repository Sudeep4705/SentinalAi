import { useEffect } from "react"
import { useState } from "react"
import axios from "axios"
import Mapview from "./Mapview"



export default function Events(){

    const [events,setevents]=useState([])
    const [summary,setsummary] = useState({})

useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:8333/event/events", {
        withCredentials: true
      });
      setevents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchEvents();
}, []);  

    const generateSummary = async()=>{
      let res = await axios.post("http://localhost:8333/ai/ai-summary",{events},{withCredentials:true})
      setsummary(res.data.summary)
    }
  return (  
    <>
    <div>Overnight Events</div>
      {events.map((event,key)=>(
        <div className="events" key={key}>
            <p>type: {event.type}</p>
            <p>time: {event.timestamp}</p>
            <p>location: {event.location.lat},{event.location.lng}</p>
        </div>
      ))}
      <Mapview events={events}/>
      {summary}
      <button onClick={generateSummary} className="bg-amber-200">getSummary</button>
    </>
  )
}
