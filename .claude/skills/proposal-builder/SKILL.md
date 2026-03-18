---
name: proposal-builder
description: >
  Builds professional commercial estimates and proposals for American Services AR.
  Use this skill whenever Anthony needs to write a bid, estimate, scope of work,
  or proposal for any service — pressure washing, fleet washing, parking lot
  maintenance, gutter installation, construction cleanup, or commercial property
  maintenance. Trigger for requests like "write me a proposal", "build an estimate
  for this job", "create a scope of work", "how much should I bid this", "put
  together a quote for this apartment complex", "write a bid for this RFP",
  "help me price this job", or any variation involving quoting, estimating, or
  proposing services to a commercial or residential client. Also trigger when
  Anthony describes a job and asks what to charge — this skill prices it, scopes
  it, and writes the full deliverable-ready proposal.
---

# Proposal Builder

Generates professional, ready-to-send commercial estimates and proposals for
American Services AR, Apex Shield Construction, and Legendary Home Services.

---

## Workflow

### Step 1 — Gather Job Info

Before writing anything, confirm these details. Pull from context if already
provided; only ask for what's missing:

**Required:**
- Client name / company
- Property address or description
- Service(s) requested
- Property size (sq ft, linear ft, # of units, # of trucks — whatever applies)

**Helpful (ask if not provided):**
- Any special conditions (oil stains, heavy debris, access restrictions)
- Deadline or preferred service date
- Is this a one-time job or recurring contract?
- Did client mention a budget or competing bids?

If Anthony gives a quick job description, extract what you can and proceed with
smart assumptions. Flag assumptions clearly at the bottom.

---

### Step 2 — Price the Job

Use these baseline rates to build the estimate. Adjust up for complexity,
access difficulty, or urgency.

#### Pressure Washing
| Surface | Rate |
|---|---|
| Commercial exterior (per sq ft) | $0.15–$0.35 |
| Parking lot (per sq ft) | $0.05–$0.12 |
| Driveway / flatwork (per sq ft) | $0.10–$0.20 |
| Building facade (per sq ft) | $0.20–$0.40 |
| Roof soft wash (per sq ft) | $0.25–$0.50 |
| Sidewalks / walkways (per lin ft) | $1.50–$3.00 |

#### Fleet & Equipment Washing
| Vehicle Type | Per Unit Rate |
|---|---|
| Semi truck / tractor | $75–$150 |
| Trailer (flatbed or dry van) | $50–$100 |
| Heavy equipment (excavator, dozer) | $150–$300 |
| Box trucks / work vans | $50–$85 |
| Monthly program (per unit) | 20–30% discount off one-time rate |

#### Gutter Services (Apex Shield)
| Service | Rate |
|---|---|
| Gutter cleaning (per lin ft) | $1.50–$3.00 |
| 5" seamless gutter install (per lin ft) | $8–$12 |
| 6" seamless gutter install (per lin ft) | $10–$15 |
| Commercial / oversized (per lin ft) | $15–$25 |
| Gutter guards (per lin ft) | $8–$20 |
| Downspout install (each) | $75–$150 |

#### Construction Cleanup
| Service | Rate |
|---|---|
| Post-construction pressure wash (per sq ft) | $0.20–$0.40 |
| Final clean package (small commercial) | $800–$2,500 |
| Final clean package (large commercial) | $2,500–$10,000+ |

#### Parking Lot Maintenance
| Service | Rate |
|---|---|
| Basic pressure wash (per sq ft) | $0.05–$0.10 |
| Oil stain treatment (per stain) | $25–$75 |
| Gum removal (per 1,000 sq ft) | $50–$100 |
| Monthly contract (per sq ft/mo) | $0.02–$0.05 |

**Pricing Modifiers:**
- Recurring monthly contract: subtract 15–25%
- Tight access / equipment difficulty: add 15–25%
- After-hours or weekend: add 20–30%
- Travel > 45 min from Conway: add $75–$150 mobilization fee
- Emergency / same-week scheduling: add 25%

---

### Step 3 — Build the Proposal Document

Output a complete, client-ready proposal in this format:

---

**[BRAND NAME]**
[Address if applicable] | [Phone] | [Email] | [Website]

---

# COMMERCIAL SERVICE PROPOSAL

**Prepared for:** [Client Name / Company]
**Property:** [Address]
**Prepared by:** Anthony Sons, Owner
**Date:** [Today's date]
**Valid for:** 30 days

---

## Scope of Work

[Clear description of exactly what will be done. One paragraph per service line.
Be specific — surfaces, sq footage, equipment, method, number of passes.]

---

## Pricing

| Service | Qty / Size | Unit Rate | Total |
|---|---|---|---|
| [Service 1] | [size] | $[rate] | $[subtotal] |
| [Service 2] | [size] | $[rate] | $[subtotal] |

**Subtotal:** $[X]
**Tax (if applicable):** $[X]
**TOTAL:** $[X]

*[If recurring: Monthly Rate: $X | Annual Value: $X]*

---

## What's Included

- [Bullet list of deliverables — equipment, materials, crew, cleanup]

## What's Not Included

- [Anything explicitly excluded — repairs, permits, haul-away if not included]

---

## Timeline

**Estimated Start:** [Date or "Upon signed agreement"]
**Estimated Completion:** [X hours / X days]

---

## Terms

- 50% deposit required to schedule. Balance due upon completion.
- Net 15 for approved commercial accounts.
- Cancellations within 48 hours of scheduled date subject to 25% cancellation fee.
- Quote valid for 30 days from date above.

---

## Why American Services AR

- Licensed, insured, and operating in Central Arkansas since [year]
- Commercial-grade equipment and experienced crews
- Fully equipped for large-scale commercial and industrial projects
- References available upon request

---

**To Accept This Proposal:**
Sign below and return with 50% deposit to reserve your date.

Client Signature: _________________________ Date: __________

Printed Name: ___________________________ Title: __________

---

*Thank you for considering American Services AR. We look forward to earning your business.*

---

### Step 4 — Output Options

After building the proposal, offer:
1. **Ready to send** — paste into email or PDF
2. **Adjustments** — change scope, pricing, or terms
3. **Email draft** — write the cover email to send with it (→ Penn for polish)
4. **GHL entry** — remind Anthony to log as opportunity in CRM pipeline

---

### Step 5 — Pricing Confidence Rating

After every estimate, output a quick confidence note:

> **Pricing confidence:** 🟢 High / 🟡 Medium / 🔴 Low
> *Reason: [e.g., "Standard surface area pricing — solid. No site visit done — verify sq footage before sending."]*

---

## Brand Routing

| Job Type | Brand to Use |
|---|---|
| Pressure washing, fleet, parking lot | **American Services AR** |
| Gutters, roofing, exterior construction | **Apex Shield Construction** |
| Handyman, small repairs, environmental | **Legendary Home Services** |

---

## Example Trigger Phrases
- "Write me a proposal for the Conway apartment complex"
- "Estimate a fleet washing program for 40 trucks"
- "Build a bid for this construction cleanup job"
- "How much should I charge to pressure wash a 50,000 sq ft parking lot?"
- "Put together a gutter install quote for this commercial building"
- "I need a scope of work and price for this RFP"
- "Help me price this job"
