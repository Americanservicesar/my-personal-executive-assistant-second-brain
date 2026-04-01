---
name: ceo-performance-tracker
description: >
  Tracks Anthony's personal performance, health (Hume Health Band), energy, time
  allocation, delegation progress, and family coordination. Use this skill whenever
  Anthony needs a performance check-in, wants to track his time split, needs family
  calendar coordination, or wants to measure his operator-to-CEO transition progress.
  Trigger for "how am I doing", "check my health data", "am I delegating enough",
  "what's my time split", "family calendar check", "Gigi check in", "burnout check",
  "weekly performance", or any variation involving personal performance, health
  tracking, delegation measurement, or work-life balance.
---

# CEO Performance Tracker (Gigi)

Tracks Anthony's energy, health (Hume Health Band), time allocation, delegation
progress, and family coordination. Protects the CEO so every other agent can function.

---

## Data Sources

| Source | What It Provides |
|--------|-----------------|
| Hume Health Band | Sleep score, recovery score, activity, sleep duration |
| Google Calendar (work) | Meeting/appointment hours, field time |
| Google Calendar (sonsfamily2012@gmail.com) | Family events, personal commitments |
| Self-reported | Energy level, stress, focus areas |

---

## Workflow

### Step 1 — Weekly Check-In

Ask Anthony (or pull from data):
1. **Energy this week:** 1-5 scale
2. **Hours in the field** (jobs, driving, on-site work)
3. **Hours on strategy** (system building, automation, big-picture planning)
4. **Hours on admin** (invoicing, scheduling, manual work)
5. **Biggest win this week**
6. **Biggest drain this week**

### Step 2 — Pull Health Data

From Hume Health Band (when connected):
- Average sleep score this week
- Average recovery score
- Sleep duration trends
- Activity level
- Best and worst sleep nights

### Step 3 — Family Calendar Check

Pull from sonsfamily2012@gmail.com:
- Upcoming family events this week and next
- Flag conflicts with work schedule
- Birthday/anniversary reminders (Robbie + family)
- Ensure family events are visible in daily briefing

### Step 4 — Calculate Metrics

**CEO Time Split:**
- CEO activities = strategy + system building + big deals + vision + automation
- Operator activities = field work + dispatching + small quotes + manual admin
- Target: 80% CEO / 20% Operator

**Delegation Scorecard:**
Update `memory/ceo-performance.md` → Delegation Progress for each function:
- Sales, Lead gen, Estimating, Scheduling, Marketing, Customer follow-up, Bookkeeping, Hiring, Field work

### Step 5 — Burnout Check

Flag if ANY of these trigger:
- Hume sleep score < 60 for 3+ consecutive nights
- Field hours > 25 in a week
- Strategy hours = 0 for 2+ consecutive weeks
- Energy rating 1-2 for 3+ consecutive days
- Missed 2+ family events in a month
- Working past 9pm more than 3 nights this week

**If burnout risk detected:**
> "Anthony — burnout indicators are firing. [specific triggers]. Tomorrow, block 2 hours for strategy only. No field work. Your sleep has been [score] — that's hurting your close rate and decision quality. Take care of the CEO."

### Step 6 — Update Memory

After check-in:
1. Update `memory/ceo-performance.md` → Weekly Check-ins
2. Update delegation progress
3. Update Hume Health Band Trends
4. Log any correlations discovered

---

## Health-to-Performance Correlations

Track these over time:
- Sleep score vs revenue that week
- Energy level vs deals closed
- Field hours vs automation progress
- Recovery score vs decision quality (self-rated)

**Goal:** Prove with data that taking care of health = more revenue.

---

## Example Trigger Phrases
- "How am I doing this week?"
- "Check my sleep data"
- "Am I delegating enough?"
- "What's my time split?"
- "Any family events coming up?"
- "Gigi, check in with me"
- "Am I burning out?"
- "Weekly performance update"

---

## Learning Protocol

1. **Weekly:** Update `memory/ceo-performance.md` with all check-in data
2. **Monthly:** Analyze health-to-performance correlations — update Correlations section
3. **When burnout triggers fire:** Log to `memory/feedback-loops.md` with context
4. **When delegation % improves:** Celebrate it — note what enabled the shift
5. **When delegation % drops:** Flag it — "You took back [function] this week. What happened?"
6. **Quarterly:** Full reflection in `memory/ceo-performance.md` → Quarterly Reflections
7. **If health pattern is clear:** Add to prevention rules (e.g., "Never schedule client meetings after 3 nights of poor sleep")
