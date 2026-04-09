---
name: Pricebook Unification Status
description: Current state of HCP/QB pricebook project — what's done, what's next, key file links
type: project
---

## Status: COMPLETE — Comprehensive tiered pricebook built, sheet written, HCP CSV ready

### Key Files
- **Services Pricebook**: https://docs.google.com/spreadsheets/d/1WpXVLiDzfRfE4OyVm8wBBwoZf5xTKy6Bdp8ONIosw0w/edit (Sheet1 = services, "Materials Pricebook" tab = materials)
- **HCP Import CSV**: `C:\Users\sales\Downloads\AmericanServicesAR_Pricebook_HCP_Import_2026-04-09.csv` (549 services)
- **Pricebook Builder Script**: `C:\Users\sales\Downloads\build_pricebook.py`
- **Sheet Writer Script**: `C:\Users\sales\Downloads\write_sheet.py`
- **HCP Data Pull**: https://docs.google.com/spreadsheets/d/1i8fRWY9X00OW9NlxWD65BPj54j7IBunw8xSTSTJO2FY/edit
- **Profitability Analysis**: https://docs.google.com/spreadsheets/d/1aOHSSJn7eRpOWwuHQCFhxjUcheQ92Z1Wz8wHl0zz7m8/edit
- **Master TODO Doc**: https://docs.google.com/document/d/1fxSbD1nbnrfAU2DuD96dgxmqYgTJBec97nd9L54Ohlk/edit
- **QB Export**: G:\Shared drives\SALES\Pricebook\Quickbooks services export 1-21-26.csv

### What's Done (as of 2026-04-09)
- **Sheet1**: 614 rows total (32 service sections + section headers + blanks), written via Sheets API
- **HCP CSV**: 549 services exported (no header row bugs, correct 12-column format)
- Comprehensive tiered pricing for all service lines, scalable to $2M–$5M

### Service Sections Built (32 categories)
1. GROUNDS — MOWING (8 tiers: res small/med/large/XL + comm small/med/large/XL)
2. GROUNDS — SHRUBS (5 tiers: small/med/large/XL/reclaim)
3. GROUNDS — MULCH & BEDS (11 services: mulch 2-5yd+/yd, leaf removal, bed spray, edging, fall cleanup)
4. GROUNDS — FERTILIZATION (5 per-round tiers + 5 annual 7-round programs + 3 core aeration + top dress + tree/shrub fert)
5. EXTERIOR CLEANING — HOUSE SOFTWASH (9 tiers 1-story + 7 tiers 2-story + 3 commercial)
6. EXTERIOR CLEANING — ROOF WASH (7 tiers by sqft: ≤1K to 5K+)
7. EXTERIOR CLEANING — DRIVEWAY & CONCRETE (4 driveway tiers + pool deck + breezeway + commercial + dumpster pad)
8. EXTERIOR CLEANING — DECK & FENCE (deck wash 3 tiers, deck stain 4 tiers, fence wash per LF, fence stain privacy/picket per LF)
9. WINDOWS (4: res/comm + solar film)
10. GUTTERS — CLEANING (6 tiers 1-story + 6 tiers 2-story + 2 commercial) — QB-verified sqft pricing
11. GUTTERS — RGCP (7 annual tiers + 3 semi-annual) — Residential Gutter Care Program (renamed from AMP), QB prices
12. GUTTERS — COMMERCIAL GUTTER MAINTENANCE PROGRAM (6 services)
13. GUTTERS — GUARD INSTALL (per LF: LB5"=$4.75, LB6"=$5.75/LF, Rx5"=TBD)
14. GUTTERS — INSTALL (13 services: K-style/half-round/fascia/soffit/drip edge/downspout/caulk)
15. GUTTERS — REPAIR (2 services)
16. DRYER VENT (1: Dryer Vent Inspection $150)
17. PARKING LOT (sealcoating 6 tiers + striping + arrows + ADA + stops + PW + pre-treat + repair)
18. CHRISTMAS LIGHTING (per LF + 5 packages + takedown/storage)
19. FLEET WASHING — GENERAL (14 vehicle types + fuel surcharges)
20. FLEET — CONWAY CORP (219 unit IDs, CC prefix, $25 ea, CC2103=$23)
21. FLEET — HUG & HALL (33 units, HH prefix, $25–$62.50)
22. FLEET — LUCAS/FEDEX (53 units, LM prefix, $40 ea)
23. FLEET — MOBILE MINI (10 units, MM prefix, $25/$62.50)
24. FLEET — SOUTHERN FLUID SOLUTIONS (22 units, SFS prefix, $50/$58)
25. GROUNDS MAINTENANCE PROGRAMS (6 tiers: res small/med/large + comm small/med/large)
26. IRRIGATION (8 services: startup/winterize/head install/repair/controller/smart controller/sprinkler line/drainage per LF)
27. TREE SERVICES (6: limbing small/med/large + removal small/med/large with real prices)
28. HANDYMAN (2)
29. SNOW REMOVAL (4 tiers)
30. CONTRACTOR / CONSTRUCTION WORK (5: concrete/landscaping/demo/fence/lift rental)
31. SITE WORK (2: land clearing + French drain per LF)
32. BUNDLES (7: Curb Appeal, Spring Ready, Commercial Refresh, Property Manager, Move-In/Out, Seasonal, Grounds+Exterior)

### Fleet Unit Counts
- Conway Corp: 219 units (CC prefix)
- Hug & Hall: 33 units (HH prefix, includes 1 LM unit filed under HH)
- Lucas/FedEx: 53 units (LM prefix, deduplicated from 2 QB spellings)
- Mobile Mini: 10 units (MM prefix)
- Southern Fluid Solutions: 22 units (SFS prefix)
- **Total fleet line items: 337**

### Key Pricing Decisions Made
- Gutter cleaning: QB-verified sqft tiers 1-story: ≤1500=$189, 1500-2000=$209, 2000-2500=$289, 2500-3000=$389, 3000-3500=$499, 3500+=$649
- RGCP (renamed from AMP): annual tiers ≤1500=$209 to 4000=$749; semi-annual also available
- Gutter guards: per linear foot (LB5"=$4.75/LF, LB6"=$5.75/LF)
- Window cleaning: add-on only, $300 min standalone
- Dryer vent: 1 service "Dryer Vent Inspection" $150
- Gutter guard install: cleaning baked into price, NOT taxable (contractor)
- "Labor" renamed to "Contractor Work" — NOT taxable under GR-21
- $2K/day target = $500-700 avg ticket with upsells
- Upsell prompts (⭐ ASK: ...) embedded in every service description

### Internal Cost Formula
`Mat + (Price - Mat) × 25%` — stored in col E (Internal Cost)

### Performance Pay
- Lead 15% / Helper 10% of gross profit, $12/hr floor

### Next Session Priorities
1. **Import CSV to HousecallPro**: Settings → Pricebook → Import → select `AmericanServicesAR_Pricebook_HCP_Import_2026-04-09.csv`
2. Configure online booking for key services in HCP
3. Build receipt upload workflow in n8n
4. Price LeafBlaster 6" install and Gutter Rx 5" when Central Aluminum pricing confirmed
5. Add LESCO fertilizers + irrigation materials to Materials Pricebook tab
