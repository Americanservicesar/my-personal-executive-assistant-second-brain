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
| `mF1Amt2LXGMWkfwt` | Buddy — Weekly Bid Check | Mon+Thu 8AM CDT (`0 13 * * 1,4`) → Buddy | ACTIVE — built 2026-04-22 |
| `3p01LRSvx10aXRXN` | Milli — Daily Follow-Up Cadence | Mon-Fri 9AM CDT (`0 14 * * 1-5`) → Milli | ACTIVE — built 2026-04-24 |
| `IRQrEGXQmKZVpsrt` | Cassie — Daily Bookings & Inquiry Check | Daily 8AM CDT (`0 13 * * *`) → Cassie | ACTIVE — built 2026-04-24 |
| `kYoHWjauNEMqMcPe` | Scouty — Monday Hiring Pipeline Check | Mon 9AM CDT (`0 14 * * 1`) → Scouty | ACTIVE — built 2026-04-24 |
| `VGleuqFdJF7KOPU6` | Emmie — Weekly Campaign Performance | Mon 9AM CDT (`0 14 * * 1`) → Emmie | ACTIVE — built 2026-04-24 |
| `dXJ2yOXqHCVmlvHu` | Gigi — Daily Morning Check-In | Daily 7AM CDT (`0 12 * * *`) → Gigi | ACTIVE — built 2026-04-24 |

## Gmail Monitor Workflows (Autonomous Email Processing)
| Workflow ID | Name | Trigger | Routes To | Status |
|-------------|------|---------|-----------|--------|
| `mqSWSLhNl3Qy0Nyy` | Gmail Monitor — sales@ → Milli | Gmail sales@ (everyMinute) | Milli standalone `BJ8RLrbjuZ8pSmAL` | ACTIVE — built 2026-04-22 |
| `L4xHG4YQcEeTHwei` | Gmail Monitor — office@ → Cassie | Gmail office@ (everyMinute) | Cassie standalone `X9OndKjPk1rspj5l` | ACTIVE — built 2026-04-22 |
| `kO8GSRkAnYKVOp0X` | Gmail Monitor — asons@ → Buddy | Gmail asons@ (everyMinute) | Buddy standalone `Qa4j2OFzxmbPMpug` | ACTIVE — built 2026-04-22 |

## Soshie Standalone Workflow
- ID: `W3aE7gdjj2CTapyG`
- Trigger type: `executeWorkflowTrigger` (called by other workflows)
- Tools: Slack, Google Sheets, Google Drive, SerpApi, GitHub Brain, Facebook Graph API, Gmail (6 tools)
- LLM: GPT-4.1 Mini
- Monday batch caller: `ibcZUQdHjcT81HTV`

## Ultimate Media Agent (UMA)
- ID: `Jy6BKTAMXyTyRokO`
- Triggers: Telegram Trigger (bot: **ARMEDIABOT** @ARMEDIABOT) + `Called by Soshie` executeWorkflowTrigger
- Called by Monday batch after Soshie fires (both fire-and-forget/async)
- Receives `{"query": "..."}` via executeWorkflowTrigger → Set Soshie Input (sets `message.text`) → UMA agent
- Credentials fixed 2026-04-19: OpenWeather `8jvjqvepP7jrIHc3`, OpenAI `fMfNln3kzNasVG9K`, OpenAI Research httpHeaderAuth `NHzAC3yseorZ1mjL`, Apify httpQueryAuth `3s7O91ONyIQ8UfhM`
- **Telegram bot fixed 2026-04-22**: Now uses dedicated ARMEDIABOT (token: `8746336665:AAHZcSe-9rR1WnwF-iVJk6dIc8glY01fPQ4`, n8n cred ID: `JYZeUkvmUt7Ydjn3`). No longer conflicts with Vizzy.

### UMA Tools (68 nodes total)
- **Creative Agent** — orchestrates all content creation
  - **Create Image** → sub-workflow `vaOMFyrzhissdhO7` ("ASAR Media - Create Image Tool") — text prompt → image
  - **Edit Image** → sub-workflow `jcpaAH5PZiwy2cbA` ("Edit Image Tool") — edit existing image
  - **Create Video** → sub-workflow `EZtbnyp1CXFdsTst` ("Create Video Tool") — text prompt → video (16:9, 9:16, 1:1)
  - **Image to Video** → sub-workflow `evLJ07WjsmQLjJYC` ("Image to Video Tool") — Drive image → video
- **Social Media Agent** — scrapes Instagram/TikTok/YouTube via Apify for trends
- **Posting Agent** — posts images to social platforms
- **Web Agent** — Tavily + OpenAI Research for deep research
- **Google Drive Agent** — save/search/share files
- **Email Agent**, **Calendar Agent**, **Contact Agent** (Airtable)

### Monday Batch UMA Task (updated 2026-04-19)
UMA now runs 5-part weekly creative workflow every Monday:
1. **Trend research** — Instagram/TikTok/YouTube top formats + hashtags
2. **Meme image creation** — 3 memes via Creative Agent (service humor, before/after, Arkansas weather)
   Saves to: MARKETING/Soshie Social Media/Weekly Batches (`1ah7I6QBEoBm_Gb3wSbBG3Dl6gsJRpsq5`)
3. **Service video** — 1 video via Create Video (9:16, pressure washing, cinematic)
4. **Post all content** — Posting Agent posts memes + captions to Facebook + Instagram
5. **Slack report** — full summary to #soshie-social
