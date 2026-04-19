---
name: Agent 01 - Vizzy
role: Operations Manager
standalone_workflow_id: IRW7bAYVlhIa3WDi
orchestrator_workflow_id: JAYrzGWR8A0tCBzB
model: claude-sonnet-4-6
system_message_chars: 0
standalone_tool_count: 0
handoff_targets: none
game_plan_doc_id: 1x8t9RCkjcDIg2wn2Y3OocZjV-5JDBvFxrxtVs5Om7WU
last_synced: 2026-04-19
---
# Vizzy — Operations Manager

**Agent #01** in the ASAR Autonomous Agent Team
**Standalone Workflow**: IRW7bAYVlhIa3WDi
**Orchestrator**: JAYrzGWR8A0tCBzB
**Model**: claude-sonnet-4-6
**Game Plan (WHO/WHAT/WHERE/WHEN/HOW)**: https://docs.google.com/document/d/1x8t9RCkjcDIg2wn2Y3OocZjV-5JDBvFxrxtVs5Om7WU/edit

## Handoff Graph
Vizzy only — routes to all agents

**Handoff triggers**: Routes to all agents

## Autonomous Operation
- **Standalone/MCP path**: Uses `Call [Agent]` toolWorkflow nodes — direct invocation
- **Orchestrator/Telegram path**: Appends `HANDOFF REQUEST -> [Agent]` block, Vizzy routes
- **Slack visibility**: Posts to #agent-activity after every task

## System Message (0 chars)

```

```
