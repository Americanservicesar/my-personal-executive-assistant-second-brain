---
name: Agent Optimization Issues Checklist
description: Running checklist of issues found during 12-agent optimization — fix after all agents are done
type: project
originSessionId: 28538f79-b607-429a-8177-d3fcdd418bfb
---
## Agent Optimization — Issues to Fix After All Agents Complete

### CREDENTIALS NEEDED
- [ ] **HighLevel OAuth2** — Create `highLevelOAuth2Api` credential in n8n UI (OAuth2 app in GHL Settings → Integrations). Needed by Vizzy + any other agents that need GHL access.
- [ ] **Gmail account separation** — All 4 Vizzy Gmail nodes share one OAuth2 credential (`BzBgoySpZrWPcE09`). If each email (sales@, office@, asons@, sonsfamily2012@) needs its own credential, create 3 more Gmail OAuth2 creds in n8n.

### WORKFLOW-LEVEL ISSUES
- [ ] **Telegram→Chat path conflict** — Send Telegram Reply, Slack Telegram Log, and Slack Agent Activity nodes reference `$("Format for Vizzy")` which only exists on Telegram path. When triggered via Chat/MCP, these error out. Non-blocking but noisy. Fix: wrap expressions in `$if($("Format for Vizzy").isExecuted, ...)`.
- [ ] **Settings reset on PUT** — REST API PUT resets `availableInMCP` to false. Must re-enable in n8n UI after every API push.

### OUTREACH SYSTEM — NEW (2026-04-16)
- [ ] **Instantly → GHL webhook** — Configure Instantly reply webhook to POST to n8n webhook URL → create/update GHL contact with tags: instantly-reply, V-[vertical], T-warm → notify Buddy in #buddy-bizdev
- [ ] **Launch first Instantly campaign** — ASAR-01-Apartments — verify end-to-end before launching ASAR-02

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

### EMMIE (Agent 4) — UPDATED 2026-04-17
- [x] System message updated (6,415 chars — 1-vertical/day rule, 12 campaign names, reply routing, Airtable removed)
- [x] Instantly API tool live (emmie-tl0) — Bearer = raw base64 string (NOT decoded UUID)
- [x] Instantly API key updated: YzI3YTdhODUtMGMxNy00ZTNkLWE1ZTktYzA0NDI1OGNlMjM5OkZSVEV2Y3JCd0daWQ== (verified 200)
- [x] Airtable REMOVED from SM
- [x] Operational Game Plan Doc: 10uejj6E6R4zz82QVbU7R21PVMvD35UUQtZ1LT1jfmXU
- [x] Email Standards & Lifecycle Doc: 1wAiQHn3VRHDrfj8tVXucRmDmqxfIjRne_UtB43ToPrU (all 5 sections complete)
- [x] Campaign Tracker Sheet: 1H7-E8eUju_rOYEgcCTVeSOwKT9xLzX9wezk6ffTjpwo (5 tabs live)
- [x] Both doc IDs referenced in live n8n SM (6,415 chars verified)
- [x] Local memory updated + GitHub Brain pushed and verified (2026-04-16)
- [x] Ad spend nodes added 2026-04-17 (12 tools now live, versionId: 5bff0930):
  - [x] HTTP - GHL Max Marketing Tags (emmie-ghl-maxmktg) — LIVE, uses PIT token
  - [x] HTTP - Google Ads (emmie-google-ads) — node live, AUTH PENDING
  - [x] HTTP - Facebook Ads (emmie-facebook-ads) — LIVE 2026-04-18, system user ASAR Emmie, never-expiring token, act_756247089484122
- [x] **Google Ads auth**: LIVE 2026-04-18 — dev token `dQ5rLVzw3dgLkDFJk-xLPA`, OAuth2 cred `mvzr4UfAOA9u679W` authorized, MCC = N8N Emmie (957-821-7886). Fix: redirect URI had typo `/oauth/callback` → `/oauth2/callback`

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

### SCOUTY (Agent 9) — FULLY COMPLETE 2026-04-19
- [x] SM verified 5,645 chars / 12 tools
- [x] Game plan doc: 1AW13Y-C6Qbzek7wUMMX3-c2PD96QxcImU1SunB8o98A (WHO/WHAT/WHERE/WHEN/HOW)
- [x] Synced to GitHub Brain + skill SKILL.md

### GIGI (Agent 10) — FULLY COMPLETE 2026-04-19
- [x] SM verified 6,807 chars / 15 tools
- [x] Game plan doc: 14yJ6T9ZDZzLY9OUyvIyVpC-bj-Dt3JYilI75O-ibiHQ (WHO/WHAT/WHERE/WHEN/HOW)
- [x] Synced to GitHub Brain + skill SKILL.md

### COMMET (Agent 11) — FULLY COMPLETE 2026-04-19
- [x] SM verified 7,947 chars / 12 tools
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
