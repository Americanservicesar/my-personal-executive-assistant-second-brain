# Agent Routing Rules

When a task clearly belongs to a specialized agent, route it or flag it.
For multi-agent tasks, Vizzy orchestrates handoffs between agents.

---

## Routing Map

| Task Type | Route To | Skill |
|-----------|---------|-------|
| Sales calls, closing, pipeline, lead follow-up | **Milli** | `sales-closer`, `commercial-lead-hunter` |
| Ad copy, website copy, messaging, brand voice | **Penn** | `copy-engine` |
| Email campaigns, cold outreach, nurture flows | **Emmie** | `email-outreach` |
| Social media, content calendar, platform posting | **Soshie** | `social-content`, `lead-platform-manager` |
| Partnerships, bids, RFPs, proposals | **Buddy** | `bid-monitor`, `proposal-builder`, `partnership-builder` |
| Customer replies, complaints, follow-ups, reviews | **Cassie** | `customer-followup` |
| SEO, blog posts, WordPress pages, rankings | **Seomi** | `seo-page-builder` |
| Hiring, job posts, onboarding, crew planning | **Scouty** | `hiring-pipeline` |
| Personal performance, health, routines, family | **Gigi** | `ceo-performance-tracker` |
| Service packages, online store, pricing tiers | **Commet** | `service-store-manager` |
| Data, reports, KPIs, dashboards, analytics | **Dexter** | `kpi-reporter` |
| Orchestration, briefings, multi-agent coordination | **Vizzy** | `daily-briefing` |

---

## Tool & Platform Access Per Agent

| Agent | Tools & Platforms |
|-------|------------------|
| **Vizzy** | Google Calendar, Gmail (all 4 accounts), Housecall Pro, QuickBooks, n8n |
| **Milli** | Gmail (sales@), Service Robot/GHL, Housecall Pro, Instantly, RoofSnap |
| **Penn** | WordPress, Canva/AI Image Gen |
| **Emmie** | Instantly, Gmail (sales@), Service Robot/GHL |
| **Soshie** | Service Robot/GHL (social scheduler), Google Business Profile, Canva, HomeAdvisor, Nextdoor, Thumbtack |
| **Buddy** | Gmail (asons@), Service Robot/GHL, RoofSnap |
| **Cassie** | Gmail (office@), Service Robot/GHL, Housecall Pro |
| **Seomi** | WordPress (all 7 sites), Google Business Profile |
| **Scouty** | Housecall Pro (crew management) |
| **Gigi** | Hume Health Band, Google Calendar, Gmail (sonsfamily2012@) |
| **Commet** | Housecall Pro (pricebook + booking), Service Robot/GHL (funnels + payments) |
| **Dexter** | QuickBooks, Housecall Pro, Service Robot/GHL, Google Analytics, n8n |

---

## Email Account Routing

| Email | Primary Agent | Secondary |
|-------|--------------|-----------|
| sales@americanservicesar.com | Milli, Emmie | Vizzy (monitoring) |
| office@americanservicesar.com | Cassie | Vizzy (monitoring) |
| asons@americanservicesar.com | Buddy | Vizzy (monitoring) |
| sonsfamily2012@gmail.com | Gigi | Vizzy (family calendar) |
| Instantly sending accounts | Emmie | Milli (warm replies) |

---

## Service Robot / GHL Data Access

> Service Robot = white-labeled GoHighLevel. Same platform, one integration.

| Agent | Can See | Can Edit |
|-------|---------|----------|
| **Milli** | Contacts, Pipeline, Conversations | Move deals, add notes, update contact fields |
| **Emmie** | Contacts, Email campaigns, Tags | Create/send campaigns, update tags |
| **Cassie** | Contacts, Conversations, Reviews | Reply to conversations, request reviews, update notes |
| **Buddy** | Contacts, Pipeline, Opportunities | Create opportunities, add partners |
| **Soshie** | Social planner, Posts | Schedule/publish social posts |
| **Dexter** | All data (read-only dashboards) | Update custom fields for reporting |
| **Commet** | Products, Funnels, Payments | Create/edit packages, funnels, booking pages |
| **Vizzy** | Everything (orchestrator) | Route, assign, flag — no direct edits unless coordinating |

---

## Learning Responsibilities

Each agent updates specific memory files after measurable actions:

| Agent | Updates These Memory Files |
|-------|--------------------------|
| **Milli** | `clients.md` (conversion funnel), `sales-playbook.md` (win/loss), `feedback-loops.md` |
| **Penn** | `marketing.md` (content performance), `feedback-loops.md` |
| **Emmie** | `marketing.md` (email results), `feedback-loops.md` |
| **Soshie** | `marketing.md` (social + lead platform performance), `feedback-loops.md` |
| **Buddy** | `sales-playbook.md` (bid history), `clients.md` (partnerships), `feedback-loops.md` |
| **Cassie** | `clients.md` (satisfaction log), `feedback-loops.md` |
| **Seomi** | `marketing.md` (SEO rankings), `feedback-loops.md` |
| **Scouty** | `operations.md` (hiring log, crew matrix), `feedback-loops.md` |
| **Gigi** | `ceo-performance.md` (weekly check-ins, health), `feedback-loops.md` |
| **Commet** | `financials.md` (package performance), `feedback-loops.md` |
| **Dexter** | `financials.md`, `agent-performance.md`, `pricing-actuals.md` |
| **Vizzy** | `feedback-loops.md` (handoff tracking), `agent-performance.md` (orchestration metrics) |
| **All agents** | `mistakes-and-fixes.md` (when something goes wrong — include agent name) |

---

## RoofSnap Measurement Routing

When Anthony says "measure [address] for gutters/roof":
1. Vizzy receives → routes to **Buddy** (if bid) or **Milli** (if direct sale)
2. Agent logs into RoofSnap web portal → creates measurement
3. Measurement data feeds into **proposal-builder** for accurate pricing
4. See `references/sops/roofsnap-measurement.md` for full workflow

---

## Vizzy Orchestration Rules

1. **Daily briefing** — Check all 4 email accounts + family calendar
2. **Track handoffs** — When one agent passes work to another, log it
3. **Flag stalls** — Leads older than 7 days with no contact → alert Anthony
4. **Trigger agents** — "Emmie: these leads haven't been emailed yet"
5. **Weekly digest** — Summary of all agent activity, outcomes, and learnings
