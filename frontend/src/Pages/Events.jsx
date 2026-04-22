import { useEffect, useState } from "react";
import axios from "axios";
import Mapview from "./Mapview";
import { Drone } from "lucide-react";
import { motion } from "motion/react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

export default function Events() {
  const [events, setevents] = useState([]);
  const [summary, setsummary] = useState({});
  const [decision, setdecision] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("https://sentinalai-kcx4.onrender.com/event/events", {
          withCredentials: true,
        });
        setevents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const generateSummary = async (eventsData) => {
    try {
      const res = await axios.post(
        "https://sentinalai-kcx4.onrender.com/ai/ai-summary",
        { events: eventsData },
        { withCredentials: true }
      );
      setsummary(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (events.length > 0) generateSummary(events);
  }, [events]);

  const isSuspicious = summary?.isSuspicious?.toLowerCase().includes("yes");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f0]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#4a7c59] border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] text-[#888]">Loading overnight report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1a1a1a]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-8 py-4 bg-white border-b border-[#e5e0d8]"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-[#4a7c59] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="3" fill="white" />
              <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="1.2" fill="none" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[#1a1a1a]">SentinalAi</span>
        </div>

        <div className="flex items-center gap-6 text-[13px] text-[#888]">
          <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a7c59] inline-block" />
            {events.length} events logged
          </span>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-8 py-8 flex flex-col gap-8">

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <p className="text-[12px] uppercase tracking-widest text-[#a0997e] font-medium mb-1">Overnight Report</p>
          <h1 className="text-[26px] font-semibold tracking-tight text-[#1a1a1a] leading-tight">
            Field Activity Summary
          </h1>
        </motion.div>

        {/* Escalation Banner */}
        {summary?.needsEscalation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-4 bg-red-50 border border-red-200 rounded-xl px-5 py-4"
          >
            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
              <span className="text-red-500 text-lg">🚨</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-red-500">Escalation Required</p>
              <p className="text-[12px] text-red-400 mt-0.5">This incident needs immediate attention</p>
            </div>
          </motion.div>
        )}

        {/* Drone Alert */}
        {isSuspicious && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-4 bg-[#fff8ed] border border-[#f5c97a] rounded-xl px-5 py-4"
          >
            <div className="w-9 h-9 rounded-lg bg-[#f5c97a]/30 flex items-center justify-center">
              <Drone size={18} className="text-[#c47f00]" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#c47f00]">Drone Patrol Dispatched</p>
              <p className="text-[12px] text-[#a07820] mt-0.5">Suspicious activity detected — aerial scan initiated</p>
            </div>
          </motion.div>
        )}

        {/* Events */}
        <div>
          <p className="text-[12px] uppercase tracking-widest text-[#a0997e] font-medium mb-3">Events</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {events.map((event, key) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: key * 0.04, duration: 0.3 }}
                className="bg-white border border-[#ece8e0] rounded-xl p-4 hover:shadow-md hover:border-[#c8d8be] transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start justify-between mb-3">
  <div className="flex items-center gap-2">
    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4a7c59] bg-[#eef5eb] px-2 py-0.5 rounded-full">
      {event.type}
    </span>
    {event.isNight && (
      <span className="text-[10px] font-semibold text-red-400 bg-red-50 px-2 py-0.5 rounded-full">
        🌙 Night
      </span>
    )}
  </div>
  <span className="text-[11px] text-[#bbb]">#{String(key + 1).padStart(2, "0")}</span>
</div>
                </div>
               <p className="text-[13px] text-[#555] mb-1">
  {new Date(event.timestamp).toLocaleString()}
</p>
                {event.zone && (
                  <p className="text-[12px] text-[#4a7c59] font-medium mb-1">📍 {event.zone}</p>
                )}
                <p className="text-[12px] text-[#aaa] font-mono">
                  {event.location?.lat}, {event.location?.lng}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="rounded-xl overflow-hidden border border-[#ece8e0] shadow-sm">
          <Mapview events={events} isSuspicious={summary?.isSuspicious} />
        </div>

        {/* AI Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white border border-[#ece8e0] rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0ece4]">
            <p className="text-[13px] font-semibold text-[#1a1a1a]">AI Analysis</p>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              isSuspicious ? "bg-red-50 text-red-500" : "bg-[#eef5eb] text-[#4a7c59]"
            }`}>
              {isSuspicious ? "⚠ Suspicious" : "✓ Normal"}
            </span>
          </div>

          <div className="px-6 py-5 flex flex-col gap-5">

            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#a0997e] font-medium mb-1.5">What Happened</p>
              <p className="text-[14px] text-[#444] leading-relaxed">{summary.whatHappened}</p>
            </div>

            <div className="border-t border-[#f0ece4]" />

            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#a0997e] font-medium mb-1.5">Suspicious or Normal</p>
              <p className={`text-[14px] font-semibold leading-relaxed ${isSuspicious ? "text-red-500" : "text-[#4a7c59]"}`}>
                {summary?.isSuspicious}
              </p>
            </div>

            <div className="border-t border-[#f0ece4]" />

            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#a0997e] font-medium mb-1.5">Action Needed</p>
              <p className="text-[14px] text-[#444] leading-relaxed">{summary.actionNeeded}</p>
            </div>

            <div className="border-t border-[#f0ece4]" />

            {/* Confidence */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#a0997e] font-medium mb-1.5">Confidence</p>
              <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${
                summary.confidence === "high" ? "bg-[#eef5eb] text-[#4a7c59]" :
                summary.confidence === "medium" ? "bg-[#fff8ed] text-[#c47f00]" :
                "bg-red-50 text-red-400"
              }`}>
                {summary.confidence || "unknown"}
              </span>
            </div>

            {/* Unclear Points */}
            {summary?.unclearPoints?.length > 0 && (
              <>
                <div className="border-t border-[#f0ece4]" />
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#a0997e] font-medium mb-1.5">Unclear Points</p>
                  {summary.unclearPoints.map((point, i) => (
                    <p key={i} className="text-[13px] text-[#888] mb-1">• {point}</p>
                  ))}
                </div>
              </>
            )}

          </div>

          <div className="flex items-center gap-3 px-6 py-4 bg-[#faf8f5] border-t border-[#f0ece4]">
            <button
              onClick={() => setdecision("Approved")}
              className={`text-[13px] font-medium px-4 py-2 rounded-lg transition-all duration-150 cursor-pointer ${
                decision === "Approved" ? "bg-[#4a7c59] text-white" : "bg-[#eef5eb] text-[#4a7c59] hover:bg-[#ddeedd]"
              }`}
            >
              Approve
            </button>
            <button
              onClick={() => setdecision("Rejected")}
              className={`text-[13px] font-medium px-4 py-2 rounded-lg transition-all duration-150 cursor-pointer ${
                decision === "Rejected" ? "bg-red-500 text-white" : "bg-red-50 text-red-400 hover:bg-red-100"
              }`}
            >
              Reject
            </button>
            {decision && (
              <span className="text-[13px] text-[#888] ml-1">
                Marked as <span className="font-semibold text-[#1a1a1a]">{decision}</span>
              </span>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}