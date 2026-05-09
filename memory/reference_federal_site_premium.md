---
name: Federal / Military Site Premium — Markup Guide
description: Research-backed markup ranges and cost factors for working on federal properties and military bases. Use to set the Federal Site Premium % on any GC bid.
type: reference
last_updated: 2026-05-09
originSessionId: cd616327-9aea-40e8-9fa5-2ee6a9479132
---
## Premium Scale (add on top of normal OH + Profit + Contingency + Bond)

| Site Type | Premium % | Primary Drivers |
|---|---|---|
| Federal Civilian (GSA, courthouse, post office, historic) | 5–10% | Badging, background checks, tool inspection, certified payroll admin |
| Active Military Base (non-classified) | 10–15% | Gate delays, vehicle inspection, escort zones, drill stoppages, restricted labor pool |
| High-Security / SCIF / Naval Shipyard / Nuclear | 15–25% | 100% escort required, no phones/cameras, classified vetting, tool certs, extreme restrictions |

## Things That Eat Your Money on Federal Jobs

| Cost Factor | Est. Impact | Notes |
|---|---|---|
| Gate / entry checkpoint delays (30 min × crew/day) | $87–$130/day | Budget daily; request early-arrival auth |
| Vehicle & tool inspection at gate | $22/day | No way around it — just price it |
| Background check processing | $100/person one-time | Submit 3-4 weeks early or start date slides |
| OPSEC / site security briefings | $1,040 one-time (4 crew × 4 hrs) | Build into mobilization day cost |
| Certified payroll (Davis-Bacon) | $200/week admin | Use Procore/Sage; add to PM overhead |
| Unplanned stoppages (drills, lockdowns) | $520/event × 2-3 events | Zero notice, zero GC comp — always price in |
| Parking distance / site walk-in | $87/day | Can't park at the door |
| Material re-inspection at gate | $65/delivery | Minimize gate entries with bulk deliveries |
| Communication restrictions (no phones) | $65/day | Provide walkie-talkies |
| Escort required for restricted zones | $520/day if triggered | Confirm access level before bid |
| Tool/material certification requirements | $250 one-time | Verify in SOW specs |

**Estimated total friction cost (4-crew, 15-day federal job): ~$8,000–$12,000**
That's 12-18% of a $68K direct cost job — 7% premium is conservative for civilian federal.

## Davis-Bacon Impact (Warren County MS — MRC Vicksburg reference)

| Trade | DB Total/hr | Market Rate/hr | Premium/Day (8hr) |
|---|---|---|---|
| Laborer | $25.00 | $14.00 | +$88 |
| Cement Mason | $31.50 | $18.00 | +$108 |
| Carpenter | $33.00 | $20.00 | +$104 |
| Ironworker | $34.00 | $20.00 | +$112 |
| Operating Engineer | $39.00 | $24.00 | +$120 |
| Truck Driver | $27.50 | $16.00 | +$92 |

DB fringe benefits include: health insurance, pension, vacation, apprenticeship fund.
Template rates ($520/man-day crew, $650 foreman) already baked for DB compliance.
**Always verify WD number at SAM.gov before final submission.**

## How to Apply in Bid Sheet

1. Add `FEDERAL SITE PREMIUM` tab (see MRC Vicksburg sheet as template)
2. Put editable % in cell **B5** (e.g. `7%`)
3. BID tab formula: `=G15 * VALUE(SUBSTITUTE('FEDERAL SITE PREMIUM'!B5,"%",""))/100`
4. Grand Total: `=Subtotal + Travel + Premium`

## Sources

- UFC 3-740-05 DoD Construction Cost Estimating: https://www.wbdg.org/FFC/DOD/UFC/ufc_3_740_05_2022.pdf
- TEAM Survey — Site Access Delays: https://www.citybiz.co/article/838214/site-access-delays-are-costing-contractors-time-before-work-even-begins-team-survey-finds/
- Gordian — Mark It Up: https://www.gordian.com/resources/mark-it-up-getting-to-a-realistic-bottom-line-whe/
- Davis-Bacon Act DOL: https://www.dol.gov/agencies/whd/government-contracts/construction
- USACE Area Cost Factors: https://www.govinfo.gov/content/pkg/GOVPUB-C13-86e36f431fe11e25a4278a749276c3d2/pdf/GOVPUB-C13-86e36f431fe11e25a4278a749276c3d2.pdf
- SAM.gov Wage Determinations: https://sam.gov/content/wage-determinations
