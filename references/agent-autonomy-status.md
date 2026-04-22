---
name: Agent Autonomy Status
description: Full autonomous coverage status as of 2026-04-22
last_updated: 2026-04-22
status: SUBSTANTIALLY COMPLETE
---
# ASAR Agent Autonomy Status

## Autonomous Triggers ACTIVE (40 total workflows)

### Scheduled Crons (10)
| Workflow ID | Name | Schedule | Agent |
|-------------|------|----------|-------|
| 3a8Wv9UQjSWgZ8Pn | Vizzy 6AM Daily Briefing | Daily 6AM CDT | Dexter |
| mF1Amt2LXGMWkfwt | Buddy Weekly Bid Check | Mon+Thu 8AM CDT | Buddy |
| ibcZUQdHjcT81HTV | Soshie Monday Weekly Batch | Mon 7AM CDT | Soshie+UMA |
| X9CJeuwPHXFTF2ta | Commet Weekly+Monthly Monitoring | Mon 9AM CDT | Commet |
| e6PnFg6YZpagNq7j | ASAR Weekly Rank Tracker | Mon 8AM CDT | Seomi |
| 9AdSMJNMkym65Y5V | ASAR Daily GSC Check | Daily 9AM CDT | Seomi |
| (various) | Gigi Daily Health Pull | Daily | Gigi |
| (various) | Emmie Monthly Ad Spend | Monthly | Emmie |
| (various) | Commercial Appointment Handler | Triggered | GHL |
| (various) | Commercial Stalled Deal Alert | Scheduled | GHL |

### Gmail Monitors (3) — Built 2026-04-22
| Workflow ID | Email Account | Routes To |
|-------------|--------------|-----------|
| mqSWSLhNl3Qy0Nyy | sales@americanservicesar.com | Milli (BJ8RLrbjuZ8pSmAL) |
| L4xHG4YQcEeTHwei | office@americanservicesar.com | Cassie (X9OndKjPk1rspj5l) |
| kO8GSRkAnYKVOp0X | asons@americanservicesar.com | Buddy (Qa4j2OFzxmbPMpug) |

### Standalone Agent Workflows (11 — all active)
Milli (BJ8RLrbjuZ8pSmAL), Penn (cwyGNdgiCABHwVa3), Emmie (Cxb4JDBsMF8fvRqP),
Soshie (W3aE7gdjj2CTapyG), Buddy (Qa4j2OFzxmbPMpug), Cassie (X9OndKjPk1rspj5l),
Seomi (nygXpDVV5Lmn77hX), Scouty (KYkM8ymQybnit3Gb), Gigi (TKCDLwYceeA0tCix),
Commet (8v3B7RqpkH9ltMvm), Dexter (bT5En2FMmvXhIiDl)

### Orchestrator (always live)
| Workflow | Triggers |
|----------|----------|
| JAYrzGWR8A0tCBzB | Telegram bot + Chat Interface + Slack (ASAR-Slack-to-Vizzy) |

## Remaining Manual Items (Anthony action required)

1. **QuickBooks reconnect** (~15 min) — n8n QB credential stuck on sandbox. Credentials > QuickBooks > re-auth with prod. realmId: 123146373988304. Unlocks Dexter financial reporting.
2. **Instantly webhook** — Instantly.ai > Settings > Webhooks > add URL: https://americanservicesar.app.n8n.cloud/webhook/instantly-replies for Reply event.
3. **Upload leads to Instantly** — ASAR-01-Apartments campaign drafted, needs lead CSV uploaded.
4. **LinkedIn reconnect in GHL** — Expires May 12. Reconnect ~May 5 to avoid blackout.
5. **Add 2 Instantly sending accounts** — commercialwashingpros@ and cleanpropertyexperts@ to scale from 40/day to 100/day.

## Cannot Activate (broken config)
- **ASAR Master Data Sync** (no1R0fVxStQuJxNT) — 8 nodes with missing params. Needs manual rebuild in n8n UI before activation.
