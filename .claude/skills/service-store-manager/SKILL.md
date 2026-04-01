---
name: service-store-manager
description: >
  Creates and manages productized service packages, pricing tiers, seasonal offers,
  and online booking for American Services AR. Use this skill whenever Anthony needs
  to create service packages, set up online booking, build pricing tiers, create
  seasonal promotions, or manage the service catalog. Trigger for "create a service
  package", "set up online booking", "build pricing tiers", "seasonal promotion",
  "maintenance contract template", "Commet build packages", "what packages should
  we offer", or any variation involving productized services, packages, or eCommerce.
---

# Service Store Manager (Commet)

Creates productized service packages, pricing tiers, seasonal offers, and
online booking for ASAR, Apex Shield, and Legendary Home Services.

---

## Tools

| Tool | Purpose |
|------|---------|
| Housecall Pro | Pricebook entries, online booking setup |
| Service Robot (GHL) | Landing pages, funnels, payment collection |

---

## Workflow

### Step 1 — Identify Packageable Services

Services that work best as packages:
- Standard scope (predictable work)
- Predictable pricing (minimal variables)
- Recurring potential (monthly/quarterly/annual)
- Common request (doesn't need custom quoting every time)

### Step 2 — Build the Package

**Package Structure:**

| Element | Details |
|---------|---------|
| Package name | Clear, benefit-oriented |
| Services included | Specific list |
| Pricing tier | Good / Better / Best |
| Frequency | One-time, monthly, quarterly, annual |
| Target customer | Apartments, commercial, fleet, residential |
| Brand | ASAR / Apex Shield / Legendary |

**Good / Better / Best Framework:**

| Tier | Strategy | Margin |
|------|---------|--------|
| Good | Basic service, entry price, gets them in the door | Standard |
| Better | Most popular — includes extras, best value positioning | Higher |
| Best | Premium — everything included, VIP treatment | Highest |

### Step 3 — Package Templates

**Monthly Maintenance Contract (Commercial):**
- Good: Monthly pressure wash of high-traffic areas
- Better: + parking lot + sidewalks + quarterly deep clean
- Best: + gutter maintenance + window exterior + emergency response

**Property Manager Annual Plan:**
- Good: Quarterly pressure wash + annual gutter clean (per property)
- Better: + monthly parking lot + bi-annual deep clean + gutter guards
- Best: + snow/ice management + emergency response + priority scheduling

**Fleet Washing Program:**
- Good: Weekly wash for fleet of 10-25 units
- Better: + monthly detail + equipment wash
- Best: + on-demand emergency wash + dedicated schedule slot

**Seasonal Packages:**
- Spring Cleanup: pressure wash + gutter clean + parking lot sweep
- Summer Maintenance: monthly exterior wash + quarterly deep clean
- Fall Prep: gutter clean + gutter guard install + leaf removal
- Winter Ready: gutter clean + snow/ice contract setup

### Step 4 — Set Up in Tools

**Housecall Pro:**
1. Add package to pricebook with all line items
2. Set up online booking page for standard packages
3. Configure recurring scheduling for maintenance contracts

**Service Robot (GHL):**
1. Create package landing page / funnel
2. Set up payment collection (deposit or full)
3. Create follow-up automation after purchase
4. Tag contacts for package type

### Step 5 — Launch & Track

1. Coordinate with Emmie: email past clients about new packages
2. Coordinate with Soshie: social media promotion
3. Coordinate with Penn: package descriptions and sales copy
4. Track: sales, conversion rate, tier selection, seasonal demand

---

## Pricing Guidelines

Reference `memory/pricing-actuals.md` for real pricing data.
Reference `proposal-builder` skill for baseline rates.

**Package Discount Structure:**
- Monthly contract: 15-25% off one-time rates
- Annual prepay: additional 5-10% off monthly rate
- Multi-property: additional 10-15% per property after first
- Bundle discount (2+ services): 10-15% off combined

---

## Example Trigger Phrases
- "Create a maintenance package for apartment complexes"
- "Build pricing tiers for fleet washing"
- "Set up online booking for pressure washing"
- "What seasonal package should we launch?"
- "Build a property manager annual plan"
- "Commet, what packages should we offer?"

---

## Learning Protocol

1. **Before building:** Check `memory/pricing-actuals.md` for real pricing data
2. **Before building:** Check `memory/financials.md` for margin targets
3. **After launch:** Log package to `memory/financials.md` → Package Performance
4. **Monthly:** Track sales per package — which sell, which sit?
5. **Track tier selection:** Which tier do customers pick most? (Usually Better)
6. **If package doesn't sell in 60 days:** Review pricing, positioning — retire or repackage
7. **When recurring contract signed:** Update `memory/clients.md` → Key Accounts
8. **Quarterly:** Review seasonal package timing — did we launch at the right time?
