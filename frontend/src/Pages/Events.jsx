import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Mapview from "./Mapview";
import { Drone } from "lucide-react";
import { motion, scale } from "motion/react";
export default function Events() {
  const [events, setevents] = useState([]);
  const [summary, setsummary] = useState("");
  const [decision, setdecision] = useState("");
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8333/event/events", {
          withCredentials: true,
        });
        setevents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);
  const generateSummary = async () => {
    let res = await axios.post(
      "http://localhost:8333/ai/ai-summary",
      { events },
      { withCredentials: true },
    );
    console.log(res.data.message);
    
    setsummary(res.data.message);
  };

  useEffect(() => {
    if (events.length > 0) {
      generateSummary();
    }
  }, [events]);

  return (
    <>
      <div className="w-full">
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
          className="text-xl font-bold p-2"
        >
          Overnight Events
        </motion.div>
        <div className="w-full flex flex-wrap gap-2 p-2">
              {events.map((event, key) => (
          
            <div className="events border w-md border-black rounded-md p-2 " key={key}>
              <p>type: {event.type}</p>
              <p>time: {event.timestamp}</p>
              <p>
                location: {event.location.lat},{event.location.lng}
              </p>
            </div>
        ))}
        </div>
      
        {summary?.isSuspicious?.toLowerCase().includes("yes") && (
          <p className="text-red-600 font-semibold flex items-center text-2xl mt-2">
            <Drone size={40} /> Drone Patrol Activated
          </p>
        )}
        <Mapview events={events} isSuspicious={summary?.isSuspicious} />
        <div className="bg-white p-4 rounded shadow mt-4 max-w-2xl">
          <h2 className="font-bold text-lg mb-2">AI Analysis</h2>
          <pre className="whitespace-pre-wrap text-sm">
            <div className="mb-3">
              <h3 className="font-semibold">What happened</h3>
              <p className="text-sm">{summary.whatHappened}</p>
            </div>
            <div className="mb-3">
              <h3 className="font-semibold">Suspicious or Normal</h3>
              <p
                className={`text-sm font-medium ${
                  summary?.isSuspicious?.toLowerCase().includes("yes")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {summary?.isSuspicious}
              </p>
            </div>
            <div className="mb-3">
              <h3 className="font-semibold">Action Needed</h3>
              <p className="text-sm">{summary.actionNeeded}</p>
            </div>
          </pre>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setdecision("Approved")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => setdecision("Rejected")}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>

          {decision && (
            <p className="mt-2 font-semibold">Decision: {decision}</p>
          )}
        </div>
      </div>
    </>
  );
}
