---
name: Agent Handoff Architecture
description: Autonomous agent-to-agent collaboration system — how agents invoke each other, handoff graph, and protocol differences by execution path
type: project
originSessionId: ce710de3-e886-4e71-a38a-930cd012c211
---

## Architecture (built 2026-04-19)

Every standalone agent workflow has `executeWorkflowTrigger` already wired. Agents call each other using `toolWorkflow` (Call Agent) tool nodes pre-configured with each target's workflow ID. The calling agent passes `{ "query": "full task + context" }` as input.

**Two execution paths — different handoff mechanisms:**

### Standalone / MCP path
Each agent has dedicated "Call [Agent]" toolWorkflow nodes. Agent picks the tool, passes the task, the target workflow fires autonomously, returns result.

### Orchestrator / Telegram path
Agents run as `agentTool` sub-nodes inside Vizzy. They CANNOT call each other directly. Instead, they append a `HANDOFF REQUEST → [Agent]` block to their response. Vizzy reads it and routes to the next agent automatically.

---

## Handoff Graph (who can call whom)

| Agent | Can call (standalone tools) |
|---|---|
| Milli | Penn, Emmie, Dexter, Cassie |
| Penn | Emmie, Milli |
| Emmie | Milli, Cassie |
| Soshie | Penn, Emmie |
| Buddy | Milli, Penn |
| Cassie | Milli, Dexter |
| Seomi | Penn, Soshie |
| Scouty | Cassie, Dexter |
| Gigi | Dexter, Milli |
| Commet | Emmie, Soshie, Penn |
| Dexter | Milli |

---

## Handoff Format (Orchestrator path)
Agents append this to their response when a follow-on agent is needed:
```
HANDOFF REQUEST → [Agent Name]
Task: [specific task]
Context: [all relevant details — prospect, service, deal size, prior conversation]
Priority: HIGH / MEDIUM / LOW
```

## Handoff Format (Standalone path)
Agent uses the `Call [Agent] - [Role]` tool node. Passes:
```json
{ "query": "complete task description with all context" }
```

---

## Slack Channels for Handoff Visibility
- `#agent-activity` (C0ARKTU2HR6) — all agents post handoff notices here
- `#milli-sales` (C0AQN7QDEP7) — Milli's dedicated output channel
- Other agent-specific channels: only #milli-sales exists; others use #agent-activity

---

## Status (2026-04-19)
- Standalone Call Agent tools: DEPLOYED to all 11 standalone workflows
- Standalone SM handoff protocol: ADDED to all 11 standalone workflows
- Orchestrator agentTool SM handoff protocol: ADDED to all agents
- Slack trigger autonomous path: NOT needed — executeWorkflowTrigger handles it natively

**Why:** User wants agents to collaborate autonomously to scale the company without manual task routing.
**How to apply:** When building or updating any agent, add their Call Agent tools per the handoff graph above and include the HANDOFF PROTOCOL SM block for their path.
