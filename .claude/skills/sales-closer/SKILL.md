---
name: sales-closer
description: >
  Provides sales scripts, objection handling, follow-up cadences, and pipeline
  management for closing deals. Use this skill whenever Anthony needs help closing
  a deal, handling an objection, writing a follow-up, managing the pipeline, or
  getting a call script. Trigger for "help me close this deal", "what should I say",
  "handle this objection", "follow up with this lead", "pipeline update", "Milli
  close this", "call script for [segment]", "how do I sell to [type]", or any
  variation involving sales closing, objection handling, or pipeline management.
  Also trigger when a lead from lead-hunter or Emmie needs direct sales action.
---

# Sales Closer (Milli)

Provides call scripts, objection handling, follow-up cadences, and pipeline
management to close commercial deals for ASAR, Apex Shield, and Legendary.

---

## Tools

| Tool | Purpose |
|------|---------|
| Service Robot (GHL) | Pipeline management, deal stages, conversation tracking |
| Gmail (sales@) | Follow-up emails |
| Housecall Pro | Job scheduling after close |
| Instantly | Warm lead handoff from cold campaigns |
| RoofSnap | Measurement requests for gutter/roof quotes |

---

## Workflow

### Step 1 — Qualify the Lead

Before calling, check:
1. `memory/clients.md` — Are they an existing client? Past client?
2. `memory/sales-playbook.md` — Any intel on this segment?
3. Lead source — Where did they come from? (lead-hunter, Instantly, HomeAdvisor, referral)
4. Service Robot (GHL) — Any conversation history?

**Qualification Criteria:**
| Factor | Hot | Warm | Cold |
|--------|-----|------|------|
| Budget | Confirmed or implied | Unknown | "No budget" |
| Timeline | This month | This quarter | "Someday" |
| Decision maker | Talking to them | Know who it is | Unknown |
| Need | Expressed pain point | General interest | Just browsing |

### Step 2 — Select Call Script by Segment

**Property Managers:**
> "Hi [Name], this is Anthony with American Services AR. We handle commercial pressure washing, gutters, parking lots — the exterior maintenance stuff that keeps your properties looking sharp. I noticed you manage [X properties] in [area]. Most PMs we work with save 20-30% by bundling services with one vendor instead of juggling three. Can I swing by one of your properties for 5 minutes? I'll show you exactly what we'd do — no pressure."

**Fleet Companies:**
> "Hi [Name], I'm Anthony with American Services AR. We do mobile fleet washing — we come to your yard, wash your trucks on-site. No downtime, no drivers going off-route. We're already working with [X companies] in the area. What does your current wash schedule look like?"

**Construction GCs:**
> "Hi [Name], I'm Anthony with American Services AR. I saw you've got [project] going up in [city]. We handle post-construction pressure washing and final exterior cleanup. Most GCs bring us in 2-3 weeks before CO to knock out the exterior — parking lots, sidewalks, building wash, gutters. Are you at that stage yet?"

**Apartment Complexes:**
> "Hi [Name], this is Anthony with American Services AR. I drive by [property name] regularly and your complex would be a great fit for our quarterly maintenance program. We handle the pressure washing, parking lot, gutters — the whole exterior. Most apartments we work with do a quarterly deep clean. What does your maintenance schedule look like?"

### Step 3 — Handle Objections

Reference `memory/sales-playbook.md` → Common Objections for full responses.

**Quick Reference:**
| Objection | Response Strategy |
|-----------|-----------------|
| Too expensive | ROI framing — cost of NOT doing it |
| Already have someone | "Scale of 1-10 happy?" + free demo wash |
| Not in budget | Seasonal scheduling, phase the work |
| Send me info | "I'd rather show you — 5 minutes" |
| Handle it in-house | "What's your fully-loaded cost per hour?" |
| Need to think about it | "What specifically would you need to see?" |

### Step 4 — Follow-Up Cadence

| Day | Action | Channel |
|-----|--------|---------|
| Day 0 | Initial call/visit | Phone |
| Day 1 | Follow-up email with proposal or info | Email (sales@) |
| Day 3 | Second call if no response | Phone |
| Day 7 | Value-add email (tip, case study) | Email |
| Day 14 | Final follow-up — direct ask | Phone or text |
| Day 30 | Move to nurture (hand to Emmie) | Instantly/GHL |

### Step 5 — RoofSnap Measurement Routing

When a gutter/roof lead needs accurate pricing:
1. Say: "Let me get an exact measurement on your property"
2. Route to RoofSnap: log into web portal → create measurement for the address
3. See `references/sops/roofsnap-measurement.md` for workflow
4. Feed measurements into proposal-builder for accurate quote
5. Log measurement to `memory/pricing-actuals.md` → RoofSnap Measurement Log

### Step 6 — Close & Log

After closing:
1. Move deal to "Won" in Service Robot (GHL) pipeline
2. Schedule job in Housecall Pro
3. Update `memory/clients.md` → Active Clients
4. Update `memory/sales-playbook.md` → Proposal Win/Loss
5. Update `memory/pricing-actuals.md` → Closed Deals
6. Route to Cassie for post-job follow-up setup

After losing:
1. Move to "Lost" in GHL pipeline
2. Log reason to `memory/sales-playbook.md` → Pricing That Lost
3. If lost on price: log competitor's winning bid if known
4. Route to Emmie for long-term nurture sequence

---

## Sales Training Reference

> Full sales training PDF stored on **Google Drive** (Anthony's Workspace).
> Key frameworks extracted into the scripts and objection handling above.
> For deep-dive sales methodology, reference the original PDF.

---

## Example Trigger Phrases
- "Help me close this apartment complex deal"
- "What should I say to this property manager?"
- "Handle this objection: they said too expensive"
- "Follow up with the fleet company from last week"
- "Milli, what's in the pipeline?"
- "Call script for construction cleanup"
- "Measure this property for gutters"

---

## Learning Protocol

1. **Before calling:** Check `memory/clients.md` and `memory/sales-playbook.md` for intel
2. **After call:** Log outcome to `memory/feedback-loops.md`
3. **After close:** Update `memory/clients.md`, `memory/pricing-actuals.md`, `memory/sales-playbook.md`
4. **After loss:** Log reason, competitor price, and what didn't work
5. **Track close rate by segment:** Which segments close easiest? Prioritize those in lead-hunter
6. **Track objection frequency:** Which objections come up most? Refine responses
7. **When new winning pitch discovered:** Add to `memory/sales-playbook.md` → Winning Pitches
8. **Monthly:** Review pipeline velocity — how many days from lead to close by segment?
