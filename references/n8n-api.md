---
name: n8n API Access
description: REST API key location and workflow update pattern for americanservicesar.app.n8n.cloud
type: reference
originSessionId: 47fc01bc-562d-4761-a9d3-352fa34638e2
---
- n8n instance: `americanservicesar.app.n8n.cloud`
- API key location: `C:\Users\sales\OneDrive\Documents\n8n-env-template.txt` (line 43)
- Main workflow ID: `JAYrzGWR8A0tCBzB` (Autonomous Agent Team Task Handler)
- Update pattern: GET current state → modify nodes/connections in Python → re-apply all credentials → PUT via REST API
- PUT requires `settings.executionOrder: 'v1'` and all nodes must have valid credentials assigned
- GET responses strip credential bindings — must re-apply from known credential IDs on every PUT
- n8n MCP SDK code tools (`validate_workflow`, `update_workflow`) are broken as of 2026-04 — use REST API instead

## Key Autonomous Workflows (Scheduled)
| Workflow ID | Name | Schedule | Status |
|-------------|------|----------|--------|
| `e6PnFg6YZpagNq7j` | ASAR Weekly Rank Tracker | Mon 8AM CDT (`0 13 * * 1`) | ACTIVE |
| `9AdSMJNMkym65Y5V` | ASAR Daily GSC Check | Daily 9AM CDT | ACTIVE |
| `ibcZUQdHjcT81HTV` | Soshie — Monday Weekly Batch | Mon 7AM CDT (`0 12 * * 1`) | ACTIVE |
| `X9CJeuwPHXFTF2ta` | Commet — Weekly & Monthly Monitoring | Mon 9AM CDT (`0 14 * * 1`) | ACTIVE |
| `OhcsTjpdQ83Zwv9R` | Instantly Reply → GHL Contact Update | Webhook `/webhook/instantly-replies` | ACTIVE |
| `kAyZtGcsJ9biWh6I` | Commet <-> Dexter: Agent Request Router | Webhook `/webhook/commet-dexter-request` | ACTIVE (webhook needs UI toggle to register) |
| `3a8Wv9UQjSWgZ8Pn` | Vizzy 6AM Daily Briefing | Daily 6AM CDT (`0 11 * * *`) → Dexter | ACTIVE — built 2026-04-22 |
| `JjZNWiBLGWkNVwUn` | Buddy — Weekly Bid Check | Mon+Thu 8AM CDT (`0 13 * * 1,4`) → Buddy | ACTIVE — built 2026-04-22 |

## Gmail Monitor Workflows (Autonomous Email Processing)
| Workflow ID | Name | Trigger | Routes To | Status |
|-------------|------|---------|-----------|--------|
| `n4BTLoY1O23Z5pfR` | Gmail Monitor — sales@ -> Milli | Gmail sales@ (everyMinute) | Milli standalone `BJ8RLrbjuZ8pSmAL` | ACTIVE — built 2026-04-22 |
| `c4nyYUqWEJPBfwMS` | Gmail Monitor — office@ -> Cassie | Gmail office@ (everyMinute) | Cassie standalone `X9OndKjPk1rspj5l` | ACTIVE — built 2026-04-22 |
| `WSNA0uSazWbvIEDt` | Gmail Monitor — asons@ -> Buddy | Gmail asons@ (everyMinute) | Buddy standalone `Qa4j2OFzxmbPMpug` | ACTIVE — built 2026-04-22 |

## Soshie Standalone Workflow
- ID: `W3aE7gdjj2CTapyG`
- Trigger type: `executeWorkflowTrigger` (called by other workflows)
- Tools: Slack, Google Sheets, Google Drive, SerpApi, GitHub Brain, Facebook Graph API, Gmail (6 tools)
- LLM: GPT-4.1 Mini
- Monday batch caller: `ibcZUQdHjcT81HTV`

## Ultimate Media Agent (UMA)
- ID: `Jy6BKTAMXyTyRokO`
- Triggers: Telegram Trigger (bot: Telegram account 2) + `Called by Soshie` executeWorkflowTrigger
- Called by Monday batch after Soshie fires (both fire-and-forget/async)
- Receives `{"query": "..."}` via executeWorkflowTrigger → Set Soshie Input (sets `message.text`) → UMA agent
- Credentials fixed 2026-04-19: OpenWeather `8jvjqvepP7jrIHc3`, OpenAI `fMfNln3kzNasVG9K`, OpenAI Research httpHeaderAuth `NHzAC3yseorZ1mjL`, Apify httpQueryAuth `3s7O91ONyIQ8UfhM`
- NOTE: UMA shares Telegram bot with Vizzy — needs own bot token (pending from Anthony)
