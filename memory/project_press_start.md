---
name: PRESS START — Make All Agents Autonomous
description: Master boot sequence to pull GitHub Brain context and activate all 12 agents as a fully autonomous, collaborating company growth system
type: project
last_updated: 2026-04-19
status: SYSTEM EXISTS — optimization 60% complete (agents 1-6 done, 7-12 pending)
originSessionId: 3a35798e-ae9f-458e-b25d-bfb6e27f5a38
---
## THE VISION

One command → all 12 agents wake up, know their jobs, collaborate autonomously, and grow American Services AR without Anthony touching anything day-to-day.

---

## SESSION START PROMPT (paste this to begin any new session)

```
Pull memory from GitHub Brain repo: Americanservicesar/my-personal-executive-assistant-second-brain

I want to make all my agents completely autonomous and collaborative so they grow my company without me. Tell me the current status of each agent and what's left to make each one fully operational. Then let's knock out whatever's incomplete, starting with the highest-impact gaps.

Press Start.
```

---

## THE SYSTEM AT A GLANCE

**GitHub Brain:** `Americanservicesar/my-personal-executive-assistant-second-brain`  
Path to agent docs: `references/agents/`  
PAT: in Master Credentials Sheet (sales@ Google account)

**Orchestrator (Telegram/Chat trigger):** workflow `JAYrzGWR8A0tCBzB`  
**12 agents + their standalone workflow IDs:**

| # | Agent | Role | Workflow ID | Status |
|---|-------|------|-------------|--------|
| 1 | Vizzy | Supervisor / Orchestrator | orchestrator only | ✅ Done |
| 2 | Milli | Sales Manager | `BJ8RLrbjuZ8pSmAL` | ✅ Done |
| 3 | Penn | Copywriter | `cwyGNdgiCABHwVa3` | ✅ Done |
| 4 | Emmie | Email Marketing | `Cxb4JDBsMF8fvRqP` | ✅ Done |
| 5 | Soshie | Social Media | `W3aE7gdjj2CTapyG` | ✅ Done (Mon batch live) |
| 6 | Buddy | Business Development | `Qa4j2OFzxmbPMpug` | ✅ Done |
| 7 | Cassie | Customer Support | `X9OndKjPk1rspj5l` | 🟡 Partial — game plan doc ID not in SM, e2e test pending |
| 8 | Seomi | SEO Specialist | `nygXpDVV5Lmn77hX` | 🟡 Partial — game plan doc ID not in SM |
| 9 | Scouty | Recruiter & HR | `KYkM8ymQybnit3Gb` | 🟡 Partial — game plan doc ID not in SM |
| 10 | Gigi | Personal Growth Coach | `TKCDLwYceeA0tCix` | 🟡 Partial — game plan doc ID not in SM |
| 11 | Commet | eCommerce Manager | `8v3B7RqpkH9ltMvm` | 🟡 Partial — game plan doc ID not in SM |
| 12 | Dexter | Data Analyst | `bT5En2FMmvXhIiDl` | 🟡 Partial — game plan doc ID not in SM |

---

## WHAT "FULLY AUTONOMOUS" MEANS FOR EACH

- **Vizzy** — Routes all Telegram/Chat requests to the right agent, no manual direction needed
- **Milli** — Finds leads in GHL, qualifies them, hands off to Penn/Emmie, logs to BizDev Tracker
- **Penn** — Writes sales copy, email sequences, social captions on-demand from Milli/Buddy/Soshie
- **Emmie** — Manages Instantly campaigns (1 vertical/day), reports on ad spend (Google + FB)
- **Soshie** — Posts Mon/Wed/Fri to Facebook autonomously; weekly calendar every Monday 7am
- **Buddy** — Scouts bids, builds proposals, tracks Commercial pipeline in GHL
- **Cassie** — Handles customer support emails, logs complaints to Sheets, routes to Milli if sales opportunity
- **Seomi** — Monitors keyword rankings (weekly), GSC daily, reports SEO wins/gaps to Slack
- **Scouty** — Manages hiring pipeline, screens candidates, posts to job boards
- **Gigi** — Weekly check-ins with Anthony on personal/business goals, tracks progress
- **Commet** — Manages pricing, tracks service performance vs competitors
- **Dexter** — Weekly P&L reports from QuickBooks, flags anomalies, feeds data to other agents

---

## AGENT COLLABORATION NETWORK

Agents hand off to each other autonomously via two paths:

**Telegram/Chat → Vizzy orchestrates:**  
Anthony sends one message → Vizzy routes to the right agent(s) → agents append `HANDOFF REQUEST → [Agent]` when they need help → Vizzy chains the handoffs

**MCP / standalone → direct calls:**  
Each agent has "Call [Agent]" tools wired. They invoke each other directly without going through Vizzy.

**Handoff graph (who calls whom):**  
Milli → Penn, Emmie, Dexter, Cassie | Penn → Emmie, Milli | Emmie → Milli, Cassie  
Soshie → Penn, Emmie | Buddy → Milli, Penn | Cassie → Milli, Dexter  
Seomi → Penn, Soshie | Scouty → Cassie, Dexter | Gigi → Dexter, Milli | Commet → Emmie, Soshie, Penn

---

## WHAT'S REMAINING TO REACH FULL AUTONOMY

### High impact — do these first:
1. **Agents 7-12**: Add game plan doc ID to each SM (so they know their objectives + KPIs)
2. **Instantly → GHL webhook**: Replies from cold outreach auto-create GHL contacts + notify Buddy
3. **HighLevel OAuth2 credential**: Create in n8n UI (blocks some GHL write operations)
4. **Cassie e2e test**: Complaint → Sheets write → Slack post (Telegram forum topic fix needed)
5. **Launch ASAR-01-Apartments Instantly campaign** (Emmie + Buddy)

### Already running autonomously:
- ✅ Soshie posts M/W/F to Facebook (no manual input)
- ✅ Weekly rank tracker (Seomi, every Monday 8am)
- ✅ Daily GSC check (Seomi, every day 9am)
- ✅ ASAR Review Engine (24h+72h SMS after every completed job)
- ✅ HCP Webhook Router (GHL stage updates on job events)
- ✅ Vizzy 6AM Daily Briefing → Dexter (built 2026-04-22)
- ✅ Buddy Weekly Bid Check Mon+Thu 8AM CDT (built 2026-04-22)
- ✅ Milli Daily Follow-Up Mon-Fri 9AM CDT (built 2026-04-24)
- ✅ Cassie Daily Bookings Check 8AM CDT (built 2026-04-24)
- ✅ Scouty Monday Hiring Pipeline 9AM CDT (built 2026-04-24)
- ✅ Emmie Weekly Campaign Performance Monday 9AM CDT (built 2026-04-24)
- ✅ Gigi Daily Morning Check-In 7AM CDT (built 2026-04-24)
- ✅ Commet Weekly Monitoring Monday 9AM CDT (pre-existing)
- ✅ Gmail Monitors: sales@→Milli, office@→Cassie, asons@→Buddy (built 2026-04-22)

---

## DUAL SM RULE (CRITICAL)

Every agent has TWO system messages — one in the orchestrator (`JAYrzGWR8A0tCBzB`) and one in the standalone workflow. BOTH must be updated on every SM change or the Telegram path runs old logic while MCP runs new logic.

---

## KEY REFERENCE IDs

- Master Credentials Sheet: `17Waiy2_1t0JJ3B0KgHPde-ZJRweg27WexyTp2l3i4tI`
- GHL Location: `PQp7xlYjxZKsi0CWsSA7`
- GHL PIT Token: `pit-9f981ca1-b6b2-4e1c-a9b0-2f39a4a81fb9`
- n8n API Key: in `reference_n8n_api.md`
- WP Auth: `Asons / qWzH 9qXZ z3L4 US1p cQyV GXwk`
