---
name: Save Mistakes and Fixes to Memory — Always
description: Every bug fix, workflow change, or agent correction must be saved to memory immediately so all agents and future sessions can learn from it
type: feedback
originSessionId: 82a28ede-7bd6-4bb7-a292-2c623a220dad
---
After every bug fix, workflow change, API error resolution, or agent behavior correction — save it to memory immediately. Do not wait to be asked.

**Why:** Anthony is building a living AI system with 12 agents that need to learn and improve continuously. If fixes aren't recorded, the same mistakes recur across sessions and agents. Every correction is a training data point for the entire team.

**How to apply:**
- When any n8n workflow is modified: save what was broken, what was changed, and why
- When any API call fails and is fixed: save the error, the root cause, and the correct pattern
- When an agent hallucinates or routes incorrectly: save the behavior and the fix applied
- When Anthony corrects a response or approach: save that as a feedback memory
- Save BEFORE moving to the next task — not at the end of the session
- Format: lead with the rule/fix, then **Why:** and **How to apply:** lines
- Group related bugs in one file (e.g., all HCP API patterns together)
- Update existing memory files rather than creating duplicates

**Scope — save after any of these:**
- n8n system prompt change (Vizzy, Milli, Cassie, any agent)
- HCP / GHL / Slack / Gmail API fix
- Workflow routing correction
- Agent delegation failure diagnosed and fixed
- New API field discovered (required vs optional, valid values)
- Silent failure pattern identified (API returns 200 but wrong data)
