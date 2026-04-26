---
name: Agent Optimization Issues Checklist
description: Running checklist of issues found during 12-agent optimization — fix after all agents are done
type: project
originSessionId: 28538f79-b607-429a-8177-d3fcdd418bfb
---
## Agent Optimization — Issues to Fix After All Agents Complete

### CREDENTIALS NEEDED
- [x] **HighLevel OAuth2** — RESOLVED via workaround. GHL OAuth2 app not available. All agents use PIT token (`pit-9f981ca1-b6b2-4e1c-a9b0-2f39a4a81fb9`) via HTTP Request nodes (credential `I99pH7lTosyVqinb`). HL Tool v2 nodes not used.
- [ ] **Gmail account separation** — All 4 Vizzy Gmail nodes share one OAuth2 credential (`BzBgoySpZrWPcE09`). If each email (sales@, office@, asons@, sonsfamily2012@) needs its own credential, create 3 more Gmail OAuth2 creds in n8n.

### WORKFLOW-LEVEL ISSUES
- [x] **Telegram→Chat path conflict** — FIXED 2026-04-21. Slack Error Log node updated with `$if($('Format for Vizzy').isExecuted, ...)` check. Orchestrator versionId: c857ede6. All 5 nodes confirmed safe.
- [x] **Settings reset on PUT** — RESOLVED: All 10 standalones verified MCP=True. No resets occurred.

### OUTREACH SYSTEM
- [x] **Instantly → GHL webhook** — BUILT + ACTIVE 2026-04-21. Workflow ID: OhcsTjpdQ83Zwv9R. Path: /webhook/instantly-replies. Auto-creates/updates GHL contacts with tags: instantly-reply, V-[vertical], T-warm. Notifies #buddy-bizdev and #agent-activity.
- [ ] **Configure Instantly settings** — Anthony: Go to Instantly.ai → Settings → Webhooks → add `https://americanservicesar.app.n8n.cloud/webhook/instantly-replies` for Reply event
- [ ] **Launch first Instantly campaign** — ASAR-01-Apartments — verify end-to-end with Buddy before launching ASAR-02

### VIZZY (Agent 1) — DONE
- [x] System message updated (5,277 chars)
- [x] Test passed

### MILLI (Agent 2) — DONE
- [x] System message updated (4,876 chars)
- [x] 12/12 tools live
- [x] Test passed

### PENN (Agent 3) — UPDATED 2026-04-16
- [x] System message updated (6,052 chars — added segment copy section)
- [x] Segment copy guidelines added: Doc ID 1CVvusd-EqxhgiDmO0Zp-LZdxjB-xBKd2TCCCYYYOKME
- [x] 8/8 tools live
- [x] Operational Game Plan Doc: 1CnajAoSMTJwtPNHou1iYucsJrQNyyOXqBo6Lv3bbNFI
- [x] Game plan Doc ID added to Penn's n8n system message (6,277 chars)
- [x] GitHub Brain pushed and verified

### EMMIE (Agent 4) — FULLY VERIFIED + AUTONOMOUS 2026-04-19
- [x] SM: 6,994 chars — single game plan doc, 9 campaign types, 8 routing rows, full GHL tags, Commet handoff, schedule
- [x] Instantly API tool — Bearer raw base64 (NOT decoded UUID)
- [x] Airtable REMOVED from both standalone + orchestrator
- [x] **Single game plan doc**: `1wAiQHn3VRHDrfj8tVXucRmDmqxfIjRne_UtB43ToPrU` — "EMMIE — Email Marketing Manager | Who What Where When How"
- [x] Email Standards doc eliminated — merged into single game plan doc
- [x] Campaign Tracker Sheet: 1H7-E8eUju_rOYEgcCTVeSOwKT9xLzX9wezk6ffTjpwo (6 tabs incl. Ad Spend Log)
- [x] **Google Docs tool** (Wr90fsShYFRj1K5Q) — Emmie reads her own game plan on every task
- [x] **GHL API tool** (PIT hardcoded) — contact tagging, sequence enrollment, SMS all live
- [x] **LLM**: GPT-4.1 on both standalone + orchestrator (was Mini/Nano)
- [x] Standalone versionId: 4f59cedb | Orchestrator versionId: 26d1c627 | both active
- [x] Ad spend: GHL Max Mktg + Google Ads (OAuth2 mvzr4UfAOA9u679W) + Facebook Ads all LIVE
- [x] Autonomous Ad Spend WF `t2Lne2UMjeJ2cB46` — cron 0 13 1-7 * 1, posts to #dexter-data
- [x] build_emmie_update.py updated to canonical state
- [x] GitHub Brain synced
- [ ] Manual: rename game plan doc title in Drive to end with "Who What Where When How"

### SOSHIE (Agent 5) — DONE
- [x] System message updated (5,118 chars)
- [x] 7/7 tools live + Facebook posting
- [x] Test passed

### BUDDY (Agent 6) — FULLY COMPLETE 2026-04-16
- [x] n8n SM updated (4,460 chars) — Airtable removed, game plan doc + sheet IDs + GHL pipeline added
- [x] Operational Game Plan Doc: 1h70FPIJkQN84rbVzHx1cFWMo033TlkBbEG2N8_bYnho (5 sections complete)
- [x] BizDev Tracker Sheet: 18xx0fWnJ3HafsGz6k6lqcZblxLS2tj2WzkElEXPfsc8 (4 tabs, backfilled Apr 1)
- [x] GHL Commercial Pipeline verified: OyuNwhoc79Lb8YS7h3kg (12 stages)
- [x] Slack channels verified: #buddy-bizdev C0AR4GT2WRX, #agent-activity C0ARKTU2HR6
- [x] Collaboration channels verified: #milli-sales C0AQN7QDEP7, #penn-copy C0AQPHX6FGW, #emmie-email C0AQPHWR26S, #dexter-data C0AR4GT0N0Z
- [x] Local memory updated and synced
- [x] GitHub Brain pushed and verified (7/7 checks PASS)
- [x] Master Segment Service Map created: 1CVvusd-EqxhgiDmO0Zp-LZdxjB-xBKd2TCCCYYYOKME

### CASSIE (Agent 7) — BUG FIXES APPLIED 2026-04-17
- [x] System message updated (13,014 chars — Gmail rules + Sheets ref + column docs added)
- [x] 8/8 tools live
- [x] Test passed
- [x] Operational Game Plan Doc: 156btjIM4GUkP5tvmrgVhXlPLQfDhHD-l40YfKAWk6Xw
- [x] Gmail internal email bug fixed (CRITICAL COMMUNICATION RULES block)
- [x] Vizzy routing fixed (MANDATORY DELEGATION RULES in Vizzy SM)
- [x] Sheets node changed read→appendOrUpdate (7-col schema: Date, Customer Name, Contact, Service, Details, Level, Notes)
- [x] Sheet headers added to all 3 Shared Drive sheets
- [x] SM verified 7,424 chars / 16 tools (2026-04-19)
- [ ] Confirm with Anthony: any remaining items?

### SEOMI (Agent 8) — FULLY COMPLETE 2026-04-19
- [x] SM verified 6,983 chars / 16 tools (2026-04-19)
- [x] Game plan doc renamed: Seomi_SEOSpecialist_GamePlan_WHO-WHAT-WHERE-WHEN-HOW
- [x] WHO section added to game plan doc (Section 0: identity, mission, ownership, collaborators)
- [x] Game plan doc ID in standalone SM (1ISFb5BQtaKvymizuFGom6DP-bUMnsPLvr2Jm43O16fk)
- [x] agent_08_seomi.md pushed to GitHub Brain (SHA: d68242a76b58094f82af01e1c00969bcd1137f72)

### SCOUTY (Agent 9) — UPDATED 2026-04-21
- [x] SM verified 5,645 chars / 12 tools (was)
- [x] **GHL HTTP tool added 2026-04-21** — "HTTP - GHL API (Scouty)" with PIT token. Now 13 tools. SM updated with GHL location ID (vQdpSFX4H6nRoRPh2g4Z) and endpoint guide. Fixes CRM 404 error.
- [x] **Orchestrator agentTool SM updated** — GHL Hiring Pipeline section added (versionId: ae23526d)
- [x] Game plan doc: 1AW13Y-C6Qbzek7wUMMX3-c2PD96QxcImU1SunB8o98A (WHO/WHAT/WHERE/WHEN/HOW)
- [x] Synced to GitHub Brain + skill SKILL.md

### GIGI (Agent 10) — FULLY COMPLETE 2026-04-19
- [x] SM verified 6,807 chars / 15 tools
- [x] Game plan doc: 14yJ6T9ZDZzLY9OUyvIyVpC-bj-Dt3JYilI75O-ibiHQ (WHO/WHAT/WHERE/WHEN/HOW)
- [x] Synced to GitHub Brain + skill SKILL.md

### COMMET (Agent 11) — UPDATED 2026-04-21
- [x] SM verified 7,947 chars / 12 tools
- [x] Standalone workflow: 8v3B7RqpkH9ltMvm (Commet - Data Analysis) ACTIVE
- [x] **Section 3B monitoring cron** — BUILT + ACTIVE 2026-04-21. WF: X9CJeuwPHXFTF2ta. Mon 9AM CDT: weekly store review every week + monthly report on first Monday of month.
- [x] **Commet↔Dexter Agent Request Router** — WF: kAyZtGcsJ9biWh6I ACTIVE. Webhook: /webhook/commet-dexter-request → calls Dexter standalone. NOTE: Webhook not registered (API-created). Anthony must toggle in n8n UI.
- [x] Game plan doc: 1tKG29CZ7vCjsf4DVTX5nsoamTLqY-q7tXU-Ib1wy3DQ (WHO/WHAT/WHERE/WHEN/HOW)
- [x] Synced to GitHub Brain + skill SKILL.md

### DEXTER (Agent 12) — FULLY COMPLETE 2026-04-19
- [x] SM verified 7,887 chars / 17 tools
- [x] Game plan doc: 1rfvDSxUgisDWKIslBacVMbsx0UV4rK4zEsR36JWdlUs (WHO/WHAT/WHERE/WHEN/HOW)
- [x] Synced to GitHub Brain + skill SKILL.md

### ALL 12 AGENTS — AUTONOMOUS UPGRADE COMPLETE 2026-04-19
- [x] All 12 game plan docs consolidated to OPERATIONS/Agent Game Plans folder
- [x] All 12 renamed to standard: "[Agent] -- Operational Game Plan (WHO / WHAT / WHERE / WHEN / HOW)"
- [x] All 12 have WHO section (identity, role, collaborators, handoff triggers, workflow IDs)
- [x] All 12 standalone n8n workflows have OPERATIONAL GAME PLAN doc reference
- [x] All 12 agent .md files + MEMORY.md pushed to GitHub Brain references/agents/
- [x] Handoff architecture: standalone Call Agent tools + orchestrator HANDOFF REQUEST blocks
- [x] PRESS START READY — all prerequisites met
