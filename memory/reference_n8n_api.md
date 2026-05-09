---
name: n8n API Access
description: REST API key location and workflow update pattern for americanservicesar.app.n8n.cloud
type: reference
originSessionId: 47fc01bc-562d-4761-a9d3-352fa34638e2
---
- n8n instance: `americanservicesar.app.n8n.cloud`
## API Keys (both active as of 2026-05-06)
| Name | Key | Use |
|------|-----|-----|
| claude-code | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMDgzZjI4OWQtYTVjYi00YjQzLWIxNDAtNGU1MmY5YzNiNTAyIiwiaWF0IjoxNzc4MDk0NzU5fQ.knlgc5iiSPGLOwChHYr3IxACso0ldkgdEnI_d58zIgc` | General read/query — workflow status, active count |
| claude-workflow-save | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMmIxYmFiMTYtODExMC00YzA1LTg0NDgtNDg5MDQxMmE2MDJhIiwiaWF0IjoxNzc4MDk0ODExfQ.4jQvTQN2llKDDXqEbPwha9wfZ1Xm8XCJ3n-QzRxxGvA` | Workflow create/update (PUT/POST) |

- API key location: `C:\Users\sales\OneDrive\Documents\n8n-env-template.txt` (line 43) — update this file with new keys above
- Main workflow ID: `JAYrzGWR8A0tCBzB` (Autonomous Agent Team Task Handler)
- Update pattern: GET current state → modify nodes/connections in Python → re-apply all credentials → PUT via REST API
- PUT requires `settings.executionOrder: 'v1'` and all nodes must have valid credentials assigned
- GET responses strip credential bindings — must re-apply from known credential IDs on every PUT
- n8n MCP SDK code tools (`validate_workflow`, `update_workflow`) are broken as of 2026-04 — use REST API instead
- **API call method**: Use **PowerShell `Invoke-RestMethod`** for ALL external API calls (n8n, Meta Graph, GHL REST). Bash has DNS resolution failures on this machine. Chrome JS fetch was a workaround — PowerShell is the correct approach. GHL MCP tools preferred for GHL operations.

## Key Autonomous Workflows (Scheduled)
| Workflow ID | Name | Schedule | Status |
|-------------|------|----------|--------|
| `e6PnFg6YZpagNq7j` | ASAR Weekly Rank Tracker | Mon 8AM CDT (`0 13 * * 1`) | ACTIVE |
| `9AdSMJNMkym65Y5V` | ASAR Daily GSC Check | Daily 9AM CDT | ACTIVE |
| `ibcZUQdHjcT81HTV` | Soshie — Daily Post + Video Wednesday | Daily 7AM CDT (`0 12 * * *`) | ACTIVE — updated 2026-05-08: day-of-week content calendar (Mon=before/after, Tue=service, Wed=tip+UMA Reel, Thu=local, Fri=meme, Sat=BTS, Sun=tip/testimonial). UMA task updated to animate Drive After photo to 9:16 Reel every Wednesday via Image-to-Video tool (`evLJ07WjsmQLjJYC`). |
| `Pzq9vmQCyYx5JH1I` | Seomi — Daily GBP Review Response | Daily 8AM CDT (`0 13 * * *`) | ACTIVE — built 2026-04-28 |
| `n7auzFXPu9Ywt7UY` | Seomi — Daily Backlink & Citation Builder | Daily 10AM CDT (`0 15 * * *`) | ACTIVE — built 2026-04-28 |
| `X9CJeuwPHXFTF2ta` | Commet — Weekly & Monthly Monitoring | Mon 9AM CDT (`0 14 * * 1`) | ACTIVE |
| `OhcsTjpdQ83Zwv9R` | Instantly Reply → GHL Contact Update | Webhook `/webhook/instantly-replies` | ACTIVE — URL mismatch fixed 2026-05-05 (was /instantly-reply singular). Now also auto-triggers Buddy standalone Qa4j2OFzxmbPMpug on every reply. |
| `mie1LQGw8YytjQPf` | Emmie — Hourly ASAR-01 Campaign Monitor | Every hour cron → #emmie-email C0AQPHWR26S | ACTIVE — built 2026-05-05 |
| `kAyZtGcsJ9biWh6I` | Commet <-> Dexter: Agent Request Router | Webhook `/webhook/commet-dexter-request` | ACTIVE (webhook needs UI toggle to register) |
| `3a8Wv9UQjSWgZ8Pn` | Vizzy 6AM Daily Briefing | Daily 6AM CDT (`0 11 * * *`) → Dexter | ACTIVE — built 2026-04-22 |
| `mF1Amt2LXGMWkfwt` | Buddy — Weekly Bid Check | Mon+Thu 8AM CDT (`0 13 * * 1,4`) → Buddy | ACTIVE — built 2026-04-22 |
| `3p01LRSvx10aXRXN` | Milli — Daily Follow-Up Cadence | Mon-Fri 9AM CDT (`0 14 * * 1-5`) → Milli | ACTIVE — built 2026-04-24 |
| `IRQrEGXQmKZVpsrt` | Cassie — Daily Bookings & Inquiry Check | Daily 8AM CDT (`0 13 * * *`) → Cassie | ACTIVE — built 2026-04-24 |
| `kYoHWjauNEMqMcPe` | Scouty — Monday Hiring Pipeline Check | Mon 9AM CDT (`0 14 * * 1`) → Scouty | ACTIVE — built 2026-04-24 |
| `VGleuqFdJF7KOPU6` | Emmie — Weekly Campaign Performance | Mon 9AM CDT (`0 14 * * 1`) → Emmie | ACTIVE — built 2026-04-24 |
| `dXJ2yOXqHCVmlvHu` | Gigi — Daily Morning Check-In | Daily 7AM CDT (`0 12 * * *`) → Gigi | ACTIVE — built 2026-04-24 |
| `lgI2T4IEPzvNzKNB` | Seomi — Monthly SEO KW Research & Gap Analysis | 1st of month 8AM CDT (`0 13 1 * *`) → Seomi standalone | ACTIVE — built 2026-04-26 |
| `Pzq9vmQCyYx5JH1I` | Seomi — Daily GBP Review Response | Daily 8AM CDT (`0 13 * * *`) → Seomi standalone | ACTIVE — built 2026-04-28 |
| `n7auzFXPu9Ywt7UY` | Seomi — Daily Backlink & Citation Builder | Daily 10AM CDT (`0 15 * * *`) → Seomi standalone | ACTIVE — built 2026-04-28 |
| `eYwG3UNsCnZcs86D` | Gigi — Sunday CEO Check-In (Slack) | Sunday 9AM CDT (`0 14 * * 0`) → #gigi-personal Slack + #agent-activity | ACTIVE — rebuilt 2026-05-03 (replaced deleted Telegram version `mhNPBKaaUzAsVlfI`) |
| `zOtcjEC8obKtzzCs` | Gigi — CEO Check-In Reply Handler | Slack Trigger on #gigi-personal → logs to ceo-performance.md via Gigi standalone + #agent-activity | ACTIVE — built 2026-05-03 |
| `WJJpJT1AhHrx7WIG` | Dexter — Monthly Agent Scorecard | 1st of month 8AM CDT (`0 13 1 * *`) → Dexter standalone `bT5En2FMmvXhIiDl` + #agent-activity | ACTIVE — built 2026-05-03 |
| `vrlc0Up4HTsBbfdq` | Milli — Inbound SMS Auto-Responder | Every 1 min cron → polls GHL conversations → Milli standalone `BJ8RLrbjuZ8pSmAL` | ACTIVE — built 2026-05-05. Filters: lastMessageDirection=inbound + TYPE_SMS + within last 2 min. Sends SMS reply via GHL API. GHL Conversation AI bot (Home Services Chat Agent) removed from SMS channels same date. |
| `9pyPeDS3BOM2e0on` | PW LP Form Intake | Webhook `/webhook/pw-lp-form` | Upserts GHL contact, creates Residential opportunity, triggers Address Processor | ACTIVE — built 2026-05-05 |
| `4jtIAZZR9QFz7Nx2` | Milli — Inbound SMS Handler (webhook) | Webhook `/webhook/milli-inbound-sms` | Calls Milli standalone — reserved for future GHL workflow trigger | ACTIVE — built 2026-05-05 |
| `NbZ9wg3fmwITp5xl` | ASAR — Photo Inbox Processor (11 PM Daily) | `0 4 * * *` (11 PM CDT) | Lists Drive inbox, Claude Vision classifies, GPS-injects 10 cities, uploads to WP Media ×10, renames+moves in Drive, logs to Photo Queue sheet, posts After photos to GBP+FB+IG via GHL | ACTIVE — built 2026-05-07 |
| `toq0WTdUfq1ijMyY` | ASAR — Reels Pipeline | Webhook `/webhook/reels-pipeline` | Receives fileID+caption+service+location → builds UMA task → calls UMA to create 9:16 video via Image-to-Video tool → UMA posts to IG Reels+TikTok+FB Reels+YouTube Shorts → reports to #soshie-social | ACTIVE — built 2026-05-08 |
| `WtrrOiTTIWur4O57` | ASAR — Photo After: GBP + Social Auto-Post | Webhook `/webhook/photo-after-post` | Posts After job photos to GBP + Facebook + Instagram via GHL Social API | ACTIVE — built 2026-05-07 |
| `FL3Hs3YbQcS37phK` | GA4 — Phone Call Click (GHL Call → GA4 MP) | Webhook `/webhook/ga4-phone-call-click` | GHL call event → GA4 Measurement Protocol `phone_call_click` | ACTIVE — built 2026-05-08 |
| `QoFk1aADtzgjI5Vd` | GA4 — Book Online Click (HCP Job → GA4 MP) | Webhook `/webhook/ga4-book-online-click` | HCP job created → GA4 Measurement Protocol `book_online_click` | ACTIVE — built 2026-05-08 |
| `KHDpIeICyERLW5Ni` | Emmie — Daily Google Ads Monitor | Daily 9AM CDT (`0 14 * * *`) → Emmie standalone `Cxb4JDBsMF8fvRqP` | Pulls ad metrics via Google Ads API v20, flags issues, logs to Ad Performance Log sheet, posts to #agent-activity | ACTIVE — built 2026-05-08 |
| `zS76iCXSaG9tLaeR` | Milli — Inbound FB/IG DM Auto-Responder | Every 1 min cron → polls GHL conversations → Milli standalone `BJ8RLrbjuZ8pSmAL` | ACTIVE — built 2026-05-08. Filters: lastMessageDirection=inbound + TYPE_FACEBOOK or TYPE_INSTAGRAM + within last 2 min. Replies via GHL conversations API with type=Facebook or type=Instagram. |
| `toq0WTdUfq1ijMyY` | ASAR — Reels Pipeline | Webhook `/webhook/reels-pipeline` (POST: fileID, service, location, caption) | Receives params → builds UMA query → calls UMA Image-to-Video (`evLJ07WjsmQLjJYC`) → posts to IG+FB Reels | ACTIVE — built 2026-05-08 |

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
  - **Create Video** → sub-workflow `EZtbnyp1CXFdsTst` ("ASAR Media - Create Video Tool") — text prompt → video via **Kling AI** (updated 2026-05-09 from Fal/Veo3). Model: kling-v1-6, 5s, std mode. JWT via Code node "Kling JWT T2V".
  - **Image to Video** → sub-workflow `evLJ07WjsmQLjJYC` ("ASAR Media - Image to Video Tool") — Drive image → 9:16 video via **Kling AI** (updated 2026-05-09 from Fal/Veo3). Auth: JWT generated by Code node using Access Key + Secret Key from reference_master_credentials.md. API: `api.klingai.com/v1/videos/image2video`, model: `kling-v1-6`.
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
