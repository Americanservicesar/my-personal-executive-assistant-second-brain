---
name: GC Bid Template — General Construction
description: Google Sheets bid estimating template for ASAR general construction (concrete, dirt work, flatwork). Calibrated to FL market rates. Includes production rates, markup structure, and auto-populated BID summary tab.
type: reference
last_updated: 2026-04-16
---

## Spreadsheet

- **Name:** ASAR — GC Bid Template v2 (Optimized)
- **ID:** `1REbRYVuLqjz0_p2IcpQiFTzrptvH75N9xOyhasvK_N8`
- **URL:** https://docs.google.com/spreadsheets/d/1REbRYVuLqjz0_p2IcpQiFTzrptvH75N9xOyhasvK_N8/edit?authuser=sales
- **Account:** sales@americanservicesar.com

---

## Markup Structure (ALL JOBS)

| Layer | Rate | Applied To |
|-------|------|------------|
| Overhead | 15% | × Direct Cost |
| Profit | 22% | × Direct Cost |
| Contingency | 12% | × Direct Cost |
| Bond | 2% | × (Direct + OH + Profit + Contingency) |
| **Effective multiplier** | **1.5198×** | Direct → Final |

Formula: `Direct × 1.49 × 1.02 = Direct × 1.5198`

---

## Tab Structure

| Tab | Purpose |
|-----|---------|
| **BID** | Master summary — auto-pulls trade totals, calculates markup, shows GRAND TOTAL |
| **DIRT WORK** | Excavation, grading, sub-base, compaction |
| **CONCRETE - PAVING** | Flatwork slabs, parking lots, driveways |
| **SIDEWALK AND CURB** | Sidewalks, curbs, retaining walls |
| **REGIONAL PRICING** | FL/AR/TX regional multipliers |
| **RSMEANS REFERENCE** | RS Means 2025-2026 unit cost data |
| **PRODUCTION RATES** | Crew sizes, output rates, labor day calcs |

---

## BID Tab Logic

### Trade Auto-Links
- `BID!B11` = `='DIRT WORK'!E73` (dirt direct cost)
- `BID!B12` = `='CONCRETE - PAVING'!E76` (paving direct cost)
- `BID!B13` = `='SIDEWALK AND CURB'!E57` (sidewalk/curb direct cost)

### Markup Columns (per trade row)
- C = `=B*0.15` (OH)
- D = `=B*0.22` (Profit)
- E = `=B*0.12` (Contingency)
- F = `=(B+C+D+E)*0.02` (Bond)
- G = `=SUM(B:F)` (Trade Total)

### Key Summary Rows
- `G17` = `=SUM(G11:G13)` → TOTAL BASE BID
- `G31` = GRAND TOTAL BID (= G17 + any flat adjustment if needed)

### OUT OF TOWN COSTS Section (rows 23–29)
Reference only — hotel/per diem/MOB are already embedded in trade tab indirect costs. Do NOT add I29 to grand total (double-count).
- `B25` (rooms): `=MAX('CONCRETE - PAVING'!B41,'SIDEWALK AND CURB'!B26)+1`
- `C25` (nights): auto-calc from labor day cells across trade tabs
- Travel totals visible for documentation but labeled "reference — already included in trade costs"

---

## Zone Structure (Each Trade Tab)

| Zone | Content |
|------|---------|
| Zone 1 | Project header, SF/LF input cell (F3) |
| Zone 2 | Materials — item, UOM, qty, unit price, extended |
| Zone 3 | Labor — crew type, size, days, daily rate, extended |
| Zone 4 | Equipment — type, days, rate, extended |
| Zone 5 | Indirect — mob, testing, permits, tools, fuel, cleanup |
| Zone 6 | Summary — Direct Total, then OH/Profit/Contingency/Bond/TOTAL BID |

---

## Calibration Reference — Apalachee Self Storage (Tallahassee, FL)

**Scope:**
- Phase 1: 5.5" concrete slab, 31,350 SF
- Phase 2: Retaining walls, 724 LF (18" footer + 6' wall, 5.5" thick, monolithic 24hr pour, 9'2" total height)

| | Amount |
|---|---|
| Falcon Construction (winning bid) | $569,748 |
| ASAR Grand Total | $579,748 |
| Delta | +$10,000 (+1.76%) |
| Phase 1 direct (CONCRETE - PAVING) | ~$220,700 |
| Phase 2 direct (SIDEWALK AND CURB) | ~$157,200 |
| Combined direct | ~$377,962 |
| After 1.5198× markup | $574,427 |
| + Bid adjustment (flat) | +$5,321 |
| **Grand Total** | **$579,748** |

**Key unit rates (FL market, calibrated 2026):**
- Concrete 3000 PSI: $222/CY (slab), $230/CY (footer), $235/CY (wall)
- Metal grid: $0.65/SF
- Rebar (#3): $1.05/LF, (#6): $2.50/LF
- Boom pump: $1,200/day
- Concrete finishers: $550/day crew rate
- Form setters: $525/day crew rate

---

## RS Means / Gordian Reference

Pricing calibrated to Florida market using RS Means 2025-2026 and Gordian data. Regional multiplier applied for Tallahassee, FL. Template can be re-calibrated for AR or TX by adjusting REGIONAL PRICING tab.

---

## Notes for Future Jobs

1. For jobs with no dirt work, leave DIRT WORK tab blank — BID tab auto-zeros.
2. Travel section auto-calculates but is already in trade tab indirects — keep G31 = G17 only (or G17 + small flat adj).
3. Phase 2 retaining wall price per LF benchmarks: Falcon bid $291K / 724 LF = ~$402/LF all-in. ASAR Phase 2 = $239K direct → $364K all-in = ~$503/LF. Scope/spec differences likely account for gap (Falcon may have heavier footer spec or double-curtain rebar).
4. Florida Building Code 8th Edition compliance adds ~1-2% to overhead on structural concrete.
5. For jobs requiring bond: confirm bond rate 2% is in price before submitting — it is built into this template.
