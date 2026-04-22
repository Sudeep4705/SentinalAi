# SentinalAI

An AI-first overnight security review tool for industrial sites.

## Live Demo


---

## Approach

The goal was to build an AI-first overnight security review tool for an industrial site. Instead of a basic dashboard that just shows logs, I wanted the AI to actually investigate the events before the operator sees anything — so Maya walks in to a pre-analyzed report, not raw data.

The core flow is:

```
Events come in → AI agent investigates using tools → structured summary is shown → Maya approves or rejects
```

## Agent Design

The agent runs in a loop (max 5 iterations). Each iteration it either calls a tool or gives a final answer. This means it can chain multiple tools — for example, first checking repeated events, then checking for escalation, then concluding.

```
Events → AI decides which tool to call → tool runs → result fed back → AI decides next step → final JSON answer
```

This is closer to how a real analyst thinks — gather one piece of evidence, then another, then conclude — rather than just summarizing everything at once.

## Tool-Calling Design

6 tools are available to the agent on the backend:

| Tool | What it does |
|---|---|
| `checkRepeatedEvents` | Counts how many times each event type occurred |
| `findNightEvents` | Filters events between 12AM and 6AM |
| `getEventByZone` | Filters events by site zone |
| `correlateEventsByTime` | Finds events clustered within a time window |
| `flagForEscalation` | Checks if high-risk event count warrants escalation |
| `getFailedBadgeSwipes` | Returns all failed badge swipe events |

The AI is given tool names and descriptions in the system prompt. It responds with `TOOL: toolName` when it wants to call one. The backend parses this, runs the tool, and feeds the result back into the conversation.

## Tradeoffs

**Groq over OpenAI** — Used Groq with Llama 3.3 70B for speed. The agent loop can take multiple API calls so latency matters. Groq is significantly faster.

**Text-based tool calling over function calling** — Instead of using the model's native function calling, I used a simple `TOOL: toolName` text format. This is easier to debug and works across any model, but is less reliable than structured function calling.

**Seeded data** — Events are seeded in the database rather than coming from real sensors. This keeps the demo reliable and lets me control the narrative (e.g. multiple trespassing events near the same zone to trigger escalation).

**Single agent, no sub-agents** — Kept it to one agent loop rather than multiple specialized agents. Simpler to build and debug for this scope.

## How I Used AI Tools During Development

- Used **Claude** to review agent loop logic, debug the tool-calling prompt format, and improve frontend component structure
- Used Claude to identify bugs like the `isSuspicious` yes/no check failing and the Leaflet marker icon issue in production
- Wrote seeded event data with AI help to create a realistic overnight narrative (fence alert → vehicle → badge failures → door open without badge)
- Used AI to iterate on the system prompt to make the agent more reliable at returning valid JSON

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS, Leaflet, Framer Motion |
| Backend | Node.js, Express |
| AI | Groq (Llama 3.3 70B) |
| Database | MongoDB |
| Hosting | Render/Netlify |

## Running Locally

```bash
# Backend
cd backend
npm install
nodemon server.js

# Frontend
cd frontend
npm install
npm run dev
```



