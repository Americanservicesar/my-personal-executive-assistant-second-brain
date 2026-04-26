---
name: New GC Bid — Session Starter Prompt
description: Copy-paste this prompt to start a new GC bid/takeoff session from scratch
type: prompt
last_updated: 2026-04-24
originSessionId: 47f14857-e37c-4b6b-b5e5-49e61d4b8a76
---
## COPY THIS INTO A NEW SESSION:

---

I need to run a new GC bid/takeoff. Here's what I need you to do:

**STEP 1 — Read memory first:**
Read `C:\Users\sales\.claude\projects\C--Users-sales--claude\memory\reference_gc_bid_template.md` before doing anything. That has the master template sheet ID, markup structure, tab structure, zone layout, BID tab formulas, and lessons learned from prior bids.

**STEP 2 — Copy the master template:**
- Master template: `1REbRYVuLqjz0_p2IcpQiFTzrptvH75N9xOyhasvK_N8`
- Use the service account Python pattern (SA file: `C:/Users/sales/.claude/creds/n8n-service-account.json`, impersonate `sales@americanservicesar.com`)
- Copy via Drive API with `supportsAllDrives=true` — MCP copyFile will fail on shared drives
- Name the copy: `[CLIENT] — [ADDRESS].Project`
- Move copy to SALES shared drive (`0AAFM2b9wv0C5Uk9PVA`) using same service account

**STEP 3 — Load the drawings/plans:**
- I'll attach a PDF or provide scope details
- Extract: total SF/LF per trade, pavement thicknesses, soil conditions, project location (for regional pricing), prevailing wage requirements, bond requirements, bid due date
- If PDF is CAD vector (hard to read), derive quantities from title blocks, legends, parking tables, and notes

**STEP 4 — Populate the trade tabs:**
For each trade in scope (DIRT WORK / CONCRETE - PAVING / SIDEWALK AND CURB / ASPHALT PAVING):
- Zone 1: Header + total SF/LF in F3
- Zone 2: Materials with correct regional unit prices
- Zone 3: Labor (crew size × days × daily rate)
- Zone 4: Equipment (days × rate, extended in column D)
- Zone 5: Indirect costs (mob, testing, permits, fuel, cleanup, winter if applicable)
- Zone 6: Summary with TOTAL DIRECT → markup rows → TOTAL BID

**STEP 5 — BID tab:**
- Verify auto-links to each trade tab's TOTAL DIRECT row
- If adding a new trade tab beyond the 3 standard ones, add row in BID!A14:H14 with correct formula
- Update BID!G17 SUM range to include all trade rows
- BID!G31 = `=G17` (no flat adj unless calibrating to a known competitor bid)
- Fill in COST SANITY CHECK: enter total SF in B21 to get $/SF direct and $/SF all-in

**STEP 6 — Calibration (if competitor bid is known):**
- Adjust flat amount in BID!G31 = `=G17 + [adj]` to land at target price
- Note: ASAR strategy = within 1-5% of competitor or slightly above with better scope coverage

**MARKUP STRUCTURE (all jobs — do not change):**
- Overhead: 15% × Direct
- Profit: 22% × Direct  
- Contingency: 12% × Direct
- Bond: 2% × (Direct + OH + Profit + Contingency)
- Effective multiplier: 1.5198× Direct → Final

**REGIONAL PRICING NOTES:**
- Florida: 3,000 PSI concrete, 4-6" base, no freeze-thaw spec
- Ohio: 4,000 PSI air-entrained, ODOT #304 base 8-10", prevailing wages, winter protection
- Arkansas: Standard specs, check REGIONAL PRICING tab for multiplier
- Texas: Check REGIONAL PRICING tab

**JOB INFO:**
[Fill in before starting]
- Client/Owner: _______________
- Job address: _______________
- Scope summary: _______________
- Total SF (concrete paving): _______________
- Total SF (asphalt): _______________
- Total LF (curb/sidewalk): _______________
- Dirt work: Yes / No
- Prevailing wage: Yes / No
- Bond required: Yes / No
- Competitor bid to beat: $_______________ (or unknown)
- Bid due date: _______________
- Plans attached: Yes / No — [filename]

---
