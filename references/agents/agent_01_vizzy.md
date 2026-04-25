---
name: Agent 01 - Vizzy
role: CEO Executive Assistant & Operations Orchestrator
standalone_workflow_id: IRW7bAYVlhIa3WDi
orchestrator_workflow_id: JAYrzGWR8A0tCBzB
model: claude-sonnet-4-6
system_message_chars: 9999
standalone_tool_count: 0
orchestrator_tool_count: 24
handoff_targets: all_agents
game_plan_doc_id: 1x8t9RCkjcDIg2wn2Y3OocZjV-5JDBvFxrxtVs5Om7WU
last_synced: 2026-04-24
originSessionId: 4544c810-b712-4482-b270-31711374cf0c
---
# Vizzy — CEO Executive Assistant & Operations Orchestrator

**Agent #01** in the ASAR Autonomous Agent Team
**Orchestrator Workflow**: JAYrzGWR8A0tCBzB (Autonomous Agent Team Task Handler)
**Standalone Workflow**: IRW7bAYVlhIa3WDi (Vizzy standalone — MCP path)
**Model**: claude-sonnet-4-6
**Game Plan (WHO/WHAT/WHERE/WHEN/HOW)**: https://docs.google.com/document/d/1x8t9RCkjcDIg2wn2Y3OocZjV-5JDBvFxrxtVs5Om7WU/edit

## Brands Vizzy Manages
- **American Services AR (ASAR)** — Core brand (pressure washing, gutter cleaning, window cleaning, soft washing, holiday lighting)
- **Apex Shield Construction** — Roofing & gutters
- **Legendary Home Services** — Handyman / general maintenance

## Handoff Graph
Vizzy → ALL 11 agents (routes based on task type)

**Routing triggers:**
- Leads / closing / proposals → Milli
- Copy / content creation → Penn
- Email campaigns / Instantly → Emmie
- Social media → Soshie
- Bids / RFPs / partnerships → Buddy
- Customer complaints / follow-up → Cassie
- SEO / blog / rankings → Seomi
- Hiring / crew → Scouty
- Anthony's health / personal → Gigi
- eCommerce / packages → Commet
- Reports / dashboards / QB → Dexter

## Autonomous Operation
- **Orchestrator/Telegram path**: Routes tasks via agent tool nodes in n8n, responds in Telegram/Chat
- **Standalone/MCP path**: Direct invocation via Claude MCP — `IRW7bAYVlhIa3WDi`
- **Slack visibility**: Every action logged to #agent-activity (C0ARKTU2HR6). Planning in #vizzy-command (C0AQPHWL7V4)

## Email Inbox Routing (4 accounts — per-account Gmail OAuth2 credentials)
| Account | n8n Credential ID | Primary Agent |
|---------|------------------|---------------|
| sales@americanservicesar.com | BzBgoySpZrWPcE09 | Milli |
| office@americanservicesar.com | lNp29NoMUGUSPSt1 | Cassie |
| asons@americanservicesar.com | HxTcQpOYcTO7tvAe | Buddy |
| sonsfamily2012@gmail.com | 4v4ouylgr4wKQRRo | Gigi |

## Cold Outreach Pipeline (Instantly)
- Reply intake webhook: n8n workflow `x0Ir8Oq39MLnHYta`
- Webhook URL: `https://americanservicesar.app.n8n.cloud/webhook/instantly-reply`
- Flow: Instantly reply → GHL upsert → tags (instantly-reply, V-[vertical], T-warm) → #buddy-bizdev alert
- Campaigns: ASAR-01-Apartments (created, draft) through ASAR-12 (pending)
- Active sending account: cleanmycommercialproperty@gmail.com (40/day)

## Agent Slack Channels
| Agent | Channel | ID |
|-------|---------|-----|
| Vizzy activity | #agent-activity | C0ARKTU2HR6 |
| Vizzy planning | #vizzy-command | C0AQPHWL7V4 |
| Milli | #milli-sales | C0AQN7QDEP7 |
| Penn | #penn-copy | C0AQPHX6FGW |
| Emmie | #emmie-email | C0AQPHWR26S |
| Soshie | #soshie-social | C0AQPHWS094 |
| Buddy | #buddy-bizdev | C0AR4GT2WRX |
| Cassie | #cassie-support | C0ARKTTF0AU |
| Seomi | #seomi-seo | C0AQV7SAXB6 |
| Scouty | #scouty-recruiting | C0AQK8FP15H |
| Gigi | #gigi-personal | C0AQV7RN4QL |
| Commet | #commet-ecommerce | C0AQRKQ6HJN |
| Dexter | #dexter-data | C0AR4GT0N0Z |

## n8n Credential IDs Used
| Service | ID | Type |
|---------|-----|------|
| OpenAI (Vizzy model) | fMfNln3kzNasVG9K | openAiApi |
| GoHighLevel | xthsN1QtUv1W9Vtr | httpHeaderAuth |
| Slack | 6yUg4MuD1ruBxZQY | slackApi |
| Google Calendar | qOq56coC8TDB9EuE | googleCalendarOAuth2Api |
| Google Sheets | Tpo5kkkuG9qiBBvf | googleSheetsOAuth2Api |
| Google Drive | Hu80FNVrNnpo62Fj | googleDriveOAuth2Api |
| Google Docs | Wr90fsShYFRj1K5Q | googleDocsOAuth2Api |
| SerpApi | W674ZSbrWCALEVEp | serpApi |
| Airtable | flYD85xUURg7jDi7 | airtableTokenApi |
| Telegram | IJ4MKsmQlba3y6iT | telegramApi |

## Key n8n Workflow Fixes Applied
- 2026-04-21: `Slack Error Log` node — fixed unguarded `$('Format for Vizzy').item.json.chatInput` reference (was crashing on Chat/MCP triggers)
- 2026-04-19: All 4 Gmail inbox nodes given per-account OAuth2 credentials
- 2026-04-20: SM updated to 8,672 chars with all 12 agent game plan doc IDs

## System Message Summary (8,672 chars)
Covers: routing table (all 11 agents), email account routing, inbox management protocol, daily briefing format, standing priorities, travel planning, Google Drive management, GHL read access, orchestration rules, Slack channels, game plan doc reference, all 12 agent doc IDs.

## Agent Game Plan Doc IDs
| Agent | Doc ID |
|-------|--------|
| Vizzy | 1x8t9RCkjcDIg2wn2Y3OocZjV-5JDBvFxrxtVs5Om7WU |
| Milli | 1tRCsQ010R5sbXFUbl976UNnAF5FNtI4nTILtOceJkTw |
| Penn | 1CnajAoSMTJwtPNHou1iYucsJrQNyyOXqBo6Lv3bbNFI |
| Emmie | 1wAiQHn3VRHDrfj8tVXucRmDmqxfIjRne_UtB43ToPrU |
| Soshie | 1hj8pv0SlWselnOM8NU3gEH4OMBhBOeD1sqQq-cXGc4w |
| Buddy | 1h70FPIJkQN84rbVzHx1cFWMo033TlkBbEG2N8_bYnho |
| Cassie | 156btjIM4GUkP5tvmrgVhXlPLQfDhHD-l40YfKAWk6Xw |
| Seomi | 1ISFb5BQtaKvymizuFGom6DP-bUMnsPLvr2Jm43O16fk |
| Scouty | 1AW13Y-C6Qbzek7wUMMX3-c2PD96QxcImU1SunB8o98A |
| Gigi | 14yJ6T9ZDZzLY9OUyvIyVpC-bj-Dt3JYilI75O-ibiHQ |
| Commet | 1tKG29CZ7vCjsf4DVTX5nsoamTLqY-q7tXU-Ib1wy3DQ |
| Dexter | 1rfvDSxUgisDWKIslBacVMbsx0UV4rK4zEsR36JWdlUs |
