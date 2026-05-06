---
name: Dual SM Architecture — Orchestrator vs Standalone
description: Every agent has TWO system messages — one in the orchestrator (Telegram/Chat path) and one in the standalone workflow (MCP path). Both must be updated on every SM change.
type: feedback
originSessionId: ce710de3-e886-4e71-a38a-930cd012c211
---
Every n8n agent has two separate system messages:

1. **Orchestrator SM** (workflow `JAYrzGWR8A0tCBzB`) — inline agent nodes like "Milli - Sales Manager", "Penn - Copywriter", etc. This is what runs when Anthony triggers via **Telegram or the n8n Chat Interface**.

2. **Standalone SM** (each agent's own workflow, e.g. BJ8RLrbjuZ8pSmAL for Milli) — the "Milli Agent" node. This is what runs when invoked via **MCP tools**.

**Why:** Discovered 2026-04-19 when Milli's orchestrator SM was 6,354 chars (old) while the standalone had been updated to 12,243 chars. Chat test showed no Slack output because the old SM didn't have the game plan doc reference or Slack logging rule.

**How to apply:** Whenever you update any agent SM:
1. Update the standalone workflow's agent node
2. ALSO update the matching node in the orchestrator (`JAYrzGWR8A0tCBzB`)
3. Take the longer of the two SMs when syncing
4. Use `sync_all_agents.py` pattern in AppData/Local/Temp to bulk sync

**Orchestrator node names → standalone workflow IDs:**
- Vizzy - Supervisor Agent → orchestrator only (no standalone found)
- Milli - Sales Manager → BJ8RLrbjuZ8pSmAL
- Penn - Copywriter → cwyGNdgiCABHwVa3
- Emmie - Email Marketing → Cxb4JDBsMF8fvRqP
- Soshie - Social Media → W3aE7gdjj2CTapyG
- Buddy - Business Dev → Qa4j2OFzxmbPMpug
- Cassie - Customer Support → X9OndKjPk1rspj5l
- Seomi - SEO Specialist → nygXpDVV5Lmn77hX
- Scouty - Competitive Analysis → KYkM8ymQybnit3Gb
- Gigi - Personal Growth Coach → TKCDLwYceeA0tCix
- Commet - eCommerce Manager → 8v3B7RqpkH9ltMvm
- Dexter - Financial Analyst → bT5En2FMmvXhIiDl
