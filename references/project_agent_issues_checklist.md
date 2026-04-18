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
  - [x] HTTP - Facebook Ads (emmie-facebook-ads) — node live, AUTH PENDING
- [ ] **Google Ads auth**: Need Manager (MCC) account → apply for developer token at ads.google.com/aw/apicenter → add to emmie-google-ads node header
- [ ] **Facebook Ads auth**: Need Meta Business Manager → System Users → generate access_token + find ad_account_id (format: act_XXXXXXXXXX) → add to emmie-facebook-ads node

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
- [ ] End-to-end test pending: complaint → Cassie invoked → Sheets write → Slack post (Telegram forum topic events = empty — send plain text to bot)
- [ ] Game plan doc ID added to n8n system message
- [ ] Full optimization session (remaining capabilities) — pending

### SEOMI (Agent 8) — PENDING FULL SESSION
- [x] System message updated (4,903 chars)
- [x] 8/8 tools live
- [x] Test passed
- [x] Operational Game Plan Doc: 1ISFb5BQtaKvymizuFGom6DP-bUMnsPLvr2Jm43O16fk
- [ ] Game plan doc ID added to n8n system message
- [ ] Full optimization session pending

### SCOUTY (Agent 9) — PENDING FULL SESSION
- [x] System message updated (4,009 chars)
- [x] 10/10 tools live
- [x] Operational Game Plan Doc: 1AW13Y-C6Qbzek7wUMMX3-c2PD96QxcImU1SunB8o98A
- [ ] Game plan doc ID added to n8n system message
- [ ] Full optimization session pending

### GIGI (Agent 10) — PENDING FULL SESSION
- [x] System message updated (5,164 chars)
- [x] 7/7 tools live
- [x] Operational Game Plan Doc: 14yJ6T9ZDZzLY9OUyvIyVpC-bj-Dt3JYilI75O-ibiHQ
- [ ] Game plan doc ID added to n8n system message
- [ ] Full optimization session pending

### COMMET (Agent 11) — PENDING FULL SESSION
- [x] System message updated (6,108 chars)
- [x] 9/9 tools live
- [x] Operational Game Plan Doc: 1tKG29CZ7vCjsf4DVTX5nsoamTLqY-q7tXU-Ib1wy3DQ
- [ ] Game plan doc ID added to n8n system message
- [ ] Full optimization session pending

### DEXTER (Agent 12) — PENDING FULL SESSION
- [x] System message updated (6,215 chars)
- [x] 16/16 tools live
- [x] Operational Game Plan Doc: 1rfvDSxUgisDWKIslBacVMbsx0UV4rK4zEsR36JWdlUs
- [ ] Game plan doc ID added to n8n system message
- [ ] Full optimization session pending
