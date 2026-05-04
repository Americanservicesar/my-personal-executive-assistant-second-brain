---
name: Agent Performance
description: All 12 agents — current workflow IDs, SM sizes, tools, trigger types, status as of 2026-04-22
last_updated: 2026-04-22
type: memory
---
# Agent Performance — Current State

## All 12 Agents — Status

| # | Agent | Role | Standalone ID | Orchestrator | SM Chars | Tools | Status |
|---|-------|------|--------------|-------------|---------|-------|--------|
| 01 | Vizzy | CEO EA / Orchestrator | N/A (IS the orchestrator) | JAYrzGWR8A0tCBzB | 8,672 | 24 | LIVE |
| 02 | Milli | Sales Manager | BJ8RLrbjuZ8pSmAL | JAYrzGWR8A0tCBzB | 12,243 | 16 | LIVE |
| 03 | Penn | Copywriter | cwyGNdgiCABHwVa3 | JAYrzGWR8A0tCBzB | 8,322 | 16 | LIVE |
| 04 | Emmie | Email Marketing | Cxb4JDBsMF8fvRqP | JAYrzGWR8A0tCBzB | 7,200 | 14 | LIVE |
| 05 | Soshie | Social Media | W3aE7gdjj2CTapyG | JAYrzGWR8A0tCBzB | 6,900 | 12 | LIVE |
| 06 | Buddy | Business Dev | Qa4j2OFzxmbPMpug | JAYrzGWR8A0tCBzB | 7,100 | 16 | LIVE |
| 07 | Cassie | Customer Support | X9OndKjPk1rspj5l | JAYrzGWR8A0tCBzB | 7,424 | 16 | LIVE |
| 08 | Seomi | SEO Specialist | nygXpDVV5Lmn77hX | JAYrzGWR8A0tCBzB | 6,509 | 16 | LIVE |
| 09 | Scouty | Recruiter | KYkM8ymQybnit3Gb | JAYrzGWR8A0tCBzB | 5,645 | 12 | LIVE |
| 10 | Gigi | Personal Growth | TKCDLwYceeA0tCix | JAYrzGWR8A0tCBzB | 6,807 | 15 | LIVE |
| 11 | Commet | eCommerce Manager | 8v3B7RqpkH9ltMvm | JAYrzGWR8A0tCBzB | 7,947 | 12 | LIVE |
| 12 | Dexter | Financial Analyst | bT5En2FMmvXhIiDl | JAYrzGWR8A0tCBzB | 7,674 | 17 | LIVE |

## Autonomous Triggers Per Agent

| Agent | Trigger | Workflow ID | Schedule |
|-------|---------|------------|---------|
| Dexter | Daily 6AM Briefing | 3a8Wv9UQjSWgZ8Pn | 6AM CDT daily |
| Buddy | Weekly Bid Check | mF1Amt2LXGMWkfwt | Mon+Thu 8AM CDT |
| Milli | Gmail Monitor sales@ | mqSWSLhNl3Qy0Nyy | Every new email |
| Cassie | Gmail Monitor office@ | L4xHG4YQcEeTHwei | Every new email |
| Buddy | Gmail Monitor asons@ | kO8GSRkAnYKVOp0X | Every new email |
| Soshie | Monday Batch | ibcZUQdHjcT81HTV | Mon 7AM CDT |
| Commet | Weekly + Monthly | X9CJeuwPHXFTF2ta | Mon 9AM CDT |
| Seomi | Daily GSC Check | 9AdSMJNMkym65Y5V | Daily 9AM CDT |
| Seomi | Weekly Rank Tracker | e6PnFg6YZpagNq7j | Mon 8AM CDT |
| Gigi | Daily Health Pull | (see n8n) | Daily |
| Emmie | Monthly Ad Report | (see n8n) | Monthly |

## Handoff Graph (which agent calls which)

Vizzy -> ALL (orchestrator routes everything)
Milli -> Penn (proposals), Emmie (sequences), Dexter (financial check), Cassie (handoff after close)
Penn -> Emmie (deploy copy), Milli (warm reply)
Emmie -> Milli (hot lead), Cassie (complaint)
Soshie -> Penn (copy), Emmie (deploy)
Buddy -> Milli (qualified lead), Penn (bid copy)
Cassie -> Milli (upsell after support), Dexter (billing)
Seomi -> Penn (content), Soshie (social SEO)
Scouty -> Cassie (hiring onboard), Dexter (payroll check)
Gigi -> Dexter (financials), Milli (personal deal)
Commet -> Penn (package copy), Emmie (deploy), Soshie (promote)
Dexter -> Milli (flag hot leads by revenue)

## KPI Targets Per Agent

| Agent | Primary KPI | Current (May 2026) | Target |
|-------|------------|-------------------|--------|
| Milli | Pipeline closed/month | $68,142 YTD (thru Apr) | $166K/mo |
| Buddy | Qualified bids/week | Live — 20 companies + 14 vendor signups fired | 5 bids/week |
| Emmie | Email open rate | ASAR-01 loaded (1,251 leads) — campaign pending launch | >40% |
| Soshie | Posts/week | Mon/Wed/Fri Facebook direct + 7-day calendar weekly | 14/week |
| Seomi | Pages live | 143 pages live, RankMath set, DA 9 | Conway #1 on 10 keywords |
| Dexter | Daily briefings delivered | Active — 6AM CDT daily | 5 reports/week |
| Cassie | Review request automation | Review Engine LIVE (ciBlDuYcknxv9dES) — 24h+72h SMS | 100% <1hr response |
| Penn | Copy pieces on demand | Active — segment copy, bids, proposals | 10/week |
| Commet | Recurring contracts | 89 AMP programs active (~$45K/mo potential) | $200K/yr eComm |
| Scouty | Hiring pipeline | GHL pipeline active — 0 active candidates | 2 hires/quarter |
| Gigi | Weekly CEO check-in | Framework live | Weekly log |
| Vizzy | Handoffs routed/week | Orchestrator active — Telegram + Chat | 100% tasks routed |

## Known Wins (As of 2026-05-03)

| Date | Agent | Action | Outcome |
|------|-------|--------|---------|
| 2026-04-27 | Seomi | 143 city×service pages published | Phase 2 complete, sitemap 143/143 |
| 2026-04-21 | Dexter | G/B/B pricing research + competitor benchmark | Anthony approved — all agents now quoting premium |
| 2026-04-21 | Emmie | ASAR-01 apartments campaign built | 1,251 leads enriched, ready to launch |
| 2026-04-21 | Buddy | Instantly→GHL webhook built | Live — replies auto-route to GHL + #buddy-bizdev |
| 2026-04-19 | All | PRESS START — all 12 agents deployed | Full autonomous network live |
| 2026-04-22 | Milli | Review Engine activated | 24h+72h SMS review requests post-job |
| 2026-05-01 | Vizzy | Telegram chatInput bug fixed | Orchestrator stable — no more crashes |
| 2026-05-01 | Buddy | Vendor pipeline live | Daily 6AM pulse + webhook intake active |
| 2026-04-17 | Dexter | QB reconnected to production | Live financial data — realmId 123146373988304 |

## Agent System — Key Architecture Notes

1. ALL standalones use $json.query as input field (not chatInput)
2. Orchestrator JAYrzGWR8A0tCBzB = Telegram + Chat Interface ONLY (no executeWorkflowTrigger)
3. Vizzy has no separate standalone — it IS the orchestrator
4. Dual SM rule: always update BOTH standalone + orchestrator when changing agent instructions
5. Slack: every agent posts to #agent-activity (C0ARKTU2HR6) + their own channel
6. All external comms: say "American Services AR" never "ASAR"
