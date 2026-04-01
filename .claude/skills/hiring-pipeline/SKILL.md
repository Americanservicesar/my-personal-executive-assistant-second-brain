---
name: hiring-pipeline
description: >
  Manages crew recruitment for American Services AR — job posts, screening,
  onboarding, and seasonal crew planning. Use this skill whenever Anthony needs
  to hire, post a job, screen applicants, onboard a new hire, plan crew capacity,
  or manage subcontractors. Trigger for "I need to hire", "post a job", "write a
  job listing", "onboard this new guy", "how many people do I need", "Scouty find
  me workers", "crew planning", or any variation involving hiring, recruiting,
  onboarding, or workforce management.
---

# Hiring Pipeline (Scouty)

Manages crew recruitment, job posts, screening, onboarding, and seasonal
capacity planning for ASAR, Apex Shield, and Legendary Home Services.

---

## Workflow

### Step 1 — Clarify the Hiring Need

Confirm:
- **Role:** Pressure wash tech, gutter installer, field lead, driver, general labor?
- **Skills required:** What certifications, experience, or abilities?
- **Start date:** Immediate or planned?
- **Pay range:** Hourly rate or salary?
- **Duration:** Full-time, seasonal, or project-based?

### Step 2 — Check Operations Memory

Before posting:
1. Check `memory/operations.md` → Crew Skills Matrix for current gaps
2. Check `memory/operations.md` → Hiring Log for past hire performance by source
3. Check `memory/operations.md` → Subcontractor Database for overflow options first

### Step 3 — Generate Job Post

**Platform-ready posts for:**
- Indeed
- Facebook Jobs / Marketplace
- Craigslist
- Nextdoor (via Soshie)

**Job Post Template:**
```
[BRAND NAME] is Hiring: [Role Title]
Location: [City], Arkansas
Pay: $[range]/hour

We're a growing commercial services company in Central Arkansas looking for
[role description]. If you have experience with [key skills] and want steady
work with a company that's scaling fast, we want to hear from you.

What You'll Do:
- [Responsibility 1]
- [Responsibility 2]
- [Responsibility 3]

What We're Looking For:
- [Requirement 1]
- [Requirement 2]
- Valid driver's license (required for most roles)
- Reliable transportation

What We Offer:
- Competitive pay ($[range]/hr)
- Consistent work year-round
- Growth opportunity as we scale
- Small crew = direct access to ownership

Apply: [method — call, text, email, link]
```

### Step 4 — Screening Questions by Role

**Pressure Wash Technician:**
1. Have you operated commercial pressure washing equipment before?
2. Can you lift 50+ lbs regularly?
3. Do you have a valid driver's license?
4. Are you comfortable working outdoors in all weather?
5. Can you pass a background check?

**Gutter Installer (Apex Shield):**
1. Do you have experience with seamless gutter installation?
2. Are you comfortable working on ladders/roofs?
3. Do you have your own basic tools?
4. Any experience with gutter guard installation?

**Field Lead / Supervisor:**
1. How many people have you supervised on a job site?
2. Can you manage a crew schedule and ensure quality?
3. Are you comfortable communicating with clients on-site?
4. Do you have experience with commercial job sites?

### Step 5 — Onboarding Checklist

**Day 1:**
- [ ] Sign employment paperwork
- [ ] Safety briefing and PPE issued
- [ ] Equipment training (role-specific)
- [ ] Meet the crew
- [ ] First job ride-along with experienced tech
- [ ] Housecall Pro account setup (if applicable)
- [ ] Emergency contacts collected

**Week 1:**
- [ ] Supervised solo work on simple jobs
- [ ] Quality check by field lead
- [ ] Anthony check-in: how's it going?
- [ ] Address any equipment or skill gaps

### Step 6 — Update Operations

After hire:
1. Update `memory/operations.md` → Crew with new member
2. Update `memory/operations.md` → Crew Skills Matrix
3. Update `memory/operations.md` → Hiring Log with source, role, date
4. Update `memory/agent-performance.md` under Scouty

---

## Seasonal Crew Forecasting

| Month | Expected Demand | Crew Needed | Action |
|-------|----------------|-------------|--------|
| Jan-Feb | Low (winter) | Core team only | Plan spring hires |
| Mar-Apr | Rising (spring) | Core + 1-2 seasonal | Post jobs by Feb 15 |
| May-Aug | Peak (summer) | Full crew + subs | All hands, sub overflow |
| Sep-Oct | Moderate (fall) | Core + 1 seasonal | Gutter season ramp |
| Nov-Dec | Low (winter) | Core team only | Evaluate retention |

---

## Example Trigger Phrases
- "I need a pressure wash tech"
- "Post a job for a gutter installer"
- "Onboard this new hire"
- "How many people do I need for spring?"
- "Find me a subcontractor for this overflow job"
- "Screen this applicant"

---

## Learning Protocol

1. **Before posting:** Check `memory/operations.md` → Hiring Log for which sources produce quality hires
2. **After hire:** Log to `memory/operations.md` → Hiring Log immediately
3. **At 30 days:** Check retention — still employed? Update hiring log
4. **At 90 days:** Final retention check — calculate source quality
5. **When someone quits:** Log departure reason to hiring log — identify patterns
6. **Quarterly:** Review hire source ROI: which platforms produce people who stay?
7. **If bad hire pattern emerges:** Log to `memory/mistakes-and-fixes.md` — adjust screening questions
