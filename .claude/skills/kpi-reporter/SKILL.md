---
name: kpi-reporter
description: >
  Builds KPI reports, dashboards, and performance summaries for American Services AR.
  Use this skill whenever Anthony needs business metrics, agent performance scores,
  revenue reports, pipeline analysis, or any data-driven insight. Trigger for requests
  like "give me a KPI report", "how are we doing this month", "show me the numbers",
  "what's our close rate", "revenue by service", "how's Milli performing", "weekly
  report", "dashboard update", or any variation asking for business performance data,
  agent metrics, or financial summaries. Also trigger when Dexter needs to update
  agent-performance.md or financials.md with fresh data.
---

# KPI Reporter (Dexter)

Builds weekly/monthly KPI reports, agent performance scorecards, and financial
summaries by pulling data from connected business tools.

---

## Data Sources

| Source | What It Provides | How to Access |
|--------|-----------------|---------------|
| QuickBooks Online | Revenue, expenses, cash flow, P&L | QB API / manual review |
| Housecall Pro | Jobs completed, invoice amounts, scheduling data | HCP dashboard |
| Service Robot (GHL) | Pipeline stages, lead counts, conversation metrics | GHL API / dashboard |
| Google Analytics | Website traffic, lead form submissions | GA dashboard |
| Memory files | Historical patterns, agent metrics, pricing actuals | `memory/` directory |

---

## Workflow

### Step 1 — Clarify the Report

Confirm:
- **Type:** Weekly summary, monthly deep-dive, or specific metric?
- **Focus:** Whole business, specific agent, specific service line?
- **Timeframe:** This week, this month, quarter-to-date?

Default: Weekly business summary with agent scorecards.

### Step 2 — Gather Data

Pull from available sources:
1. Check `memory/financials.md` for revenue trends
2. Check `memory/agent-performance.md` for current agent metrics
3. Check `memory/pricing-actuals.md` for deal data
4. Check `memory/feedback-loops.md` for recent outcomes
5. Check `memory/clients.md` for pipeline and conversion data
6. Pull from connected tools if available (QB, HCP, GHL)

### Step 3 — Build the Report

#### Weekly Business Summary

**Revenue & Pipeline**
| Metric | This Week | Last Week | Change | Notes |
|--------|----------|----------|--------|-------|

**Jobs & Operations**
| Metric | This Week | Last Week | Change | Notes |
|--------|----------|----------|--------|-------|

**Sales Pipeline**
| Stage | Count | Value | Avg Age | Notes |
|-------|-------|-------|---------|-------|

**Agent Scorecards** (pull from `memory/agent-performance.md`)
- Top performing agent this week
- Agent needing attention
- Stalled handoffs or metrics

**Anomalies & Flags**
- Revenue drops > 15%
- Lead volume spikes or drops
- Margin compression
- Overdue follow-ups

### Step 4 — Recommendations

Always end with 3 actionable recommendations:
1. What to double down on (working)
2. What to fix (broken or stalled)
3. What to watch (emerging trend)

### Step 5 — Update Memory

After generating report:
- Update `memory/agent-performance.md` with latest metrics
- Update `memory/financials.md` with revenue data
- Flag any anomalies in `memory/feedback-loops.md`

---

## KPI Definitions by Agent

| Agent | Primary KPI | Secondary KPIs |
|-------|-----------|----------------|
| Milli | Close rate | Leads contacted, avg deal size, pipeline value |
| Emmie | Reply rate | Open rate, click rate, warm leads generated |
| Soshie | Leads from social | Engagement rate, posts published, platform growth |
| Buddy | Bid win rate | Bids submitted, avg bid value, partnerships initiated |
| Cassie | Review count | Satisfaction score, complaints resolved, churn risks |
| Seomi | Rankings improved | Pages published, organic traffic, keyword positions |
| Scouty | Days to fill | Retention rate, applications per post |
| Gigi | Delegation % | Energy score, CEO time split, field hours |
| Commet | Recurring contracts | Package sales, online bookings, avg package value |

---

## Example Trigger Phrases
- "Give me a weekly report"
- "How are we doing this month?"
- "What's our close rate?"
- "Revenue breakdown by service"
- "How's Milli performing?"
- "Show me the agent scorecards"
- "Dashboard update"
- "What KPIs should I be watching?"

---

## Learning Protocol

1. **Before reporting:** Pull latest data from all memory files — never report stale numbers
2. **After reporting:** Update `memory/agent-performance.md` and `memory/financials.md` with fresh data
3. **When anomaly detected:** Log to `memory/feedback-loops.md` with context
4. **Monthly:** Compare KPI trends — identify which agents are improving vs declining
5. **Quarterly:** Recalculate benchmarks ("good" thresholds) based on actual performance data
