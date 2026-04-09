---
name: vendor-pricing-tracker
description: >
  Processes receipts, invoices, and bills from vendors into a live Master Material
  Price List. Tracks line-item pricing by vendor over time, flags price changes,
  identifies the cheapest vendor per material, and feeds pricing intelligence back
  into estimates and proposals. Use this skill whenever Anthony uploads a receipt,
  asks about vendor pricing, wants to check the price of a material, needs to know
  the cheapest vendor for a supply, wants a material price history, or requests a
  vendor pricing report. Trigger for "upload this receipt", "log this invoice",
  "what did we pay for X", "cheapest vendor for Y", "price history on Z", "vendor
  price report", "flag price changes", "track this material". Owned by Dexter.
---

# Vendor Pricing Tracker (Dexter)

Turns every vendor receipt into **live pricing intelligence** for American Services
AR. The goal is not bookkeeping — it's **margin protection**. Every material we
buy gets tracked by vendor, unit price, and date, so we catch price hikes
instantly, always know the cheapest source, and feed accurate cost data into
estimates and proposals.

---

## Why This Exists

- Vendor prices drift quietly — we pay more without noticing
- Anthony has no live view of "what's the cheapest vendor for SH right now?"
- Estimates get built on stale cost assumptions → margin erosion
- Multi-brand operations (ASAR + Apex Shield + Legendary) buy similar materials —
  consolidation opportunities get missed
- Construction site cleanup + fleet washing are high-volume material jobs —
  pennies per unit compound

**Outcome:** Tighter estimates → better margins → faster pricing decisions.

---

## Data Flow (High Level)

```
RECEIPT CAPTURE                    PROCESSING                    OUTPUT
───────────────                    ──────────                    ──────
Anthony snaps pic      ┐
or forwards email      ├──►  n8n triggered
or drops PDF in Drive  ┘          │
                                  ▼
                           Claude Vision (OCR)
                                  │
                                  ▼
                         Structured JSON extracted
                         (vendor, date, line items)
                                  │
                                  ▼
                        Fuzzy-match each line item
                        to Master Material List
                                  │
                        ┌─────────┴─────────┐
                        ▼                   ▼
                 Matched items        New/ambiguous items
                        │                   │
                        ▼                   ▼
              Append to Price History   Needs Review tab
                        │                   │
                        ▼                   ▼
            Recalculate best price   Anthony confirms weekly
            + best vendor + deltas
                        │
                        ▼
              Alert if price change >10%
              or best vendor changes
                        │
                        ▼                                ▼
                 Slack #dexter-data              Optionally push
                 + memory/financials.md          to QBO as expense
```

---

## Capture Methods (All 3 Supported)

| Method | How Anthony Triggers It | Best For |
|--------|------------------------|----------|
| **Mobile snap** | Photo → share to Gmail `receipts@americanservicesar.com` (or office@ with subject "RECEIPT") | In-store supply runs |
| **Email forward** | Vendor emails invoice → Anthony forwards to same address | Digital vendor invoices |
| **Drive drop** | PDF/image dropped into Google Drive → `Receipts/Inbox` folder | Batch processing |

All 3 methods funnel into the same n8n workflow. Anthony never has to decide
where to send it.

---

## Google Sheet Structure — Master Material List

**File:** `ASAR — Master Material Price List`
**Owner:** Dexter
**Access:** Anthony (edit), Robbie (view)
**Location:** Google Drive → `Finance/Pricing Intelligence/`

### Tab 1 — Master Materials (Single source of truth)

| Col | Field | Type | Notes |
|-----|-------|------|-------|
| A | Material ID | Text | `MAT-0001` (auto-incrementing) |
| B | Material Name | Text | Standardized name (e.g., "Sodium Hypochlorite 12.5%") |
| C | Category | Dropdown | See Category List below |
| D | Unit | Text | gal, ea, lb, ft, box, case |
| E | Current Best Price | Currency | Lowest verified price, any vendor, last 90 days |
| F | Current Best Vendor | Text | Who has the best price right now |
| G | Last Price Paid | Currency | Most recent purchase, any vendor |
| H | Last Vendor | Text | Who we last bought from |
| I | Last Purchase Date | Date | Most recent receipt date |
| J | 30-Day Change % | Formula | Price delta over 30 days |
| K | 90-Day Change % | Formula | Price delta over 90 days |
| L | YTD Change % | Formula | Price delta since Jan 1 |
| M | Purchases YTD | Formula | Count of transactions this year |
| N | Total Spend YTD | Formula | Sum spend this year |
| O | Alert Status | Formula | 🟢 stable / 🟡 watch / 🔴 alert |
| P | Aliases | Text | Alternate names for fuzzy matching (pipe-separated) |
| Q | Notes | Text | Manual notes |

### Tab 2 — Price History (append-only ledger)

| Col | Field | Type | Notes |
|-----|-------|------|-------|
| A | Transaction ID | Text | `TXN-YYYYMMDD-NNNN` |
| B | Date | Date | Receipt date |
| C | Material ID | Text | Links to Tab 1 |
| D | Material Name | Text | As it appeared on receipt (raw) |
| E | Vendor | Text | Vendor name |
| F | Unit Price | Currency | Price per unit |
| G | Qty | Number | Quantity purchased |
| H | Total | Currency | Line total (before tax) |
| I | Unit | Text | gal, ea, etc. |
| J | Receipt ID | Text | Links to Tab 6 |
| K | Brand | Dropdown | ASAR / Apex Shield / Legendary |
| L | Job Code | Text | Optional — ties purchase to a specific job |
| M | Notes | Text | Notes (e.g., "bulk discount") |

### Tab 3 — Vendors

| Col | Field | Type | Notes |
|-----|-------|------|-------|
| A | Vendor ID | Text | `VND-001` |
| B | Vendor Name | Text | Standardized |
| C | Address | Text | Physical location |
| D | Phone | Text | Main number |
| E | Account # | Text | Our account with them |
| F | Payment Terms | Text | Net 30, COD, etc. |
| G | Categories Supplied | Text | Comma-separated |
| H | # Transactions YTD | Formula | Count from Tab 2 |
| I | Total Spend YTD | Formula | Sum from Tab 2 |
| J | Avg Price Rank | Formula | 1 = cheapest overall, based on matched items |
| K | Reliability Rating | 1–5 | Manual, updated by Anthony |
| L | Preferred? | Yes/No | Mark preferred suppliers |
| M | Notes | Text | Delivery, quality, rep name, etc. |

### Tab 4 — Needs Review (Anthony's weekly 5-min task)

Every new material OR ambiguous fuzzy match lands here for Anthony to confirm.

| Col | Field | Type | Notes |
|-----|-------|------|-------|
| A | Date | Date | When flagged |
| B | Raw Item Name | Text | Exactly as extracted from receipt |
| C | Vendor | Text | |
| D | Qty | Number | |
| E | Unit Price | Currency | |
| F | Total | Currency | |
| G | Suggested Match | Text | Best fuzzy match from Master list |
| H | Match Confidence | % | Fuzzy match score |
| I | Action | Dropdown | Confirm Match / Create New / Ignore / Merge |
| J | New Material ID | Text | Filled if "Create New" |
| K | Status | Dropdown | Pending / Resolved |

### Tab 5 — Alerts Log

| Col | Field | Type |
|-----|-------|------|
| A | Date | Date |
| B | Alert Type | 🔴 Price spike / 🟡 Price change / ℹ️ Vendor change / ➕ New material |
| C | Material | Text |
| D | Vendor | Text |
| E | Old Value | Text |
| F | New Value | Text |
| G | Change % | % |
| H | Action Taken | Text |
| I | Reviewed By | Text |

### Tab 6 — Receipts Log (file index)

| Col | Field | Type |
|-----|-------|------|
| A | Receipt ID | `RCPT-YYYYMMDD-NNN` |
| B | Date | Date |
| C | Vendor | Text |
| D | Subtotal | Currency |
| E | Tax | Currency |
| F | Total | Currency |
| G | # Line Items | Number |
| H | Image URL | Google Drive link |
| I | QBO Pushed? | Yes/No |
| J | QBO Txn ID | Text |
| K | Processing Status | Extracted / Matched / Flagged / Complete |
| L | Brand | ASAR / Apex Shield / Legendary |

---

## Category List (Seed)

| Category | Sub-examples |
|----------|-------------|
| **Pressure Washing Chemicals** | Sodium hypochlorite, surfactants, degreasers, rust removers, wood restorers, efflorescence removers, soft wash mix |
| **Pressure Washing Equipment & Parts** | Pumps, hoses, tips, wands, guns, unloaders, surface cleaners, fittings, QCs |
| **Fuel & Gas** | Gasoline, diesel, propane, kerosene (for hot water) |
| **Gutter Materials** | Aluminum coil (.027, .032), downspouts, elbows, hangers, screws, sealant, gutter guards, end caps |
| **Fleet Wash Supplies** | Heavy degreasers, brushes, brighteners, aluminum brightener |
| **Construction Cleanup Supplies** | Trash bags, tarps, brooms, squeegees, dust control, shop vacs |
| **PPE & Safety** | Gloves, goggles, respirators, hi-vis, steel toe, first aid, hearing protection |
| **Truck & Trailer** | Tires, oil, filters, brake parts, straps, hitch hardware |
| **Uniforms & Apparel** | Shirts, hats, branded gear |
| **Office Supplies** | Paper, ink, printer parts, misc |
| **Capital Equipment** | Pressure washers, hot water units, tanks, trailers, generators, buffers (> $500 purchases) |
| **Marketing Materials** | Yard signs, cards, magnets, brochures, flags, vehicle wraps |
| **Tools & Hardware** | Hand tools, power tools, ladders, extension cords |
| **Misc / Uncategorized** | Catch-all — review weekly |

---

## OCR Extraction — Claude Vision Prompt

When n8n sends a receipt image to Claude for OCR, use this extraction prompt:

```
You are a receipt data extractor for a commercial services business.
Extract the following from this receipt image into valid JSON:

{
  "vendor_name": "string — standardized (no 'INC', 'LLC', no caps unless brand)",
  "vendor_address": "string or null",
  "receipt_date": "YYYY-MM-DD",
  "receipt_number": "string or null",
  "payment_method": "cash|credit|check|ach|unknown",
  "subtotal": number,
  "tax": number,
  "total": number,
  "line_items": [
    {
      "raw_name": "exactly as printed on receipt",
      "sku": "string or null (if visible)",
      "qty": number,
      "unit": "gal|ea|lb|ft|box|case|oz|unknown",
      "unit_price": number,
      "line_total": number,
      "category_guess": "one of: Pressure Washing Chemicals, Pressure Washing Equipment & Parts, Fuel & Gas, Gutter Materials, Fleet Wash Supplies, Construction Cleanup Supplies, PPE & Safety, Truck & Trailer, Uniforms & Apparel, Office Supplies, Capital Equipment, Marketing Materials, Tools & Hardware, Misc / Uncategorized"
    }
  ],
  "confidence": "high|medium|low",
  "notes": "any anomalies, unreadable sections, or flags for human review"
}

Rules:
- If a field is unclear, use null — do not guess
- Normalize units: "GAL" → "gal", "EA" → "ea"
- Strip vendor legal suffixes (INC, LLC, CORP) from vendor_name
- Preserve raw_name exactly as printed for fuzzy matching
- Return ONLY the JSON — no commentary
```

---

## Fuzzy Matching Logic (For n8n Code Node)

For each line item, match `raw_name` against `Master Materials.Material Name` + `Aliases`:

1. **Exact match** on Material Name → confidence 100%, auto-match
2. **Exact match** on any alias → confidence 95%, auto-match
3. **Levenshtein ratio ≥ 0.85** → confidence = ratio × 100, auto-match
4. **Levenshtein ratio 0.65–0.84** → confidence = ratio × 100, send to Needs Review
5. **Below 0.65** → flag as "New Material Candidate", send to Needs Review

**Auto-match threshold:** 85% confidence or higher
**Review threshold:** 65–84% confidence
**Create-new threshold:** below 65%

---

## Alert Rules

| Trigger | Alert Level | Slack Channel | Action |
|---------|------------|--------------|--------|
| Material price ↑ > 10% vs last purchase | 🟡 Watch | #dexter-data | Log + notify |
| Material price ↑ > 20% vs last purchase | 🔴 Alert | #dexter-data + #agent-activity | Log + notify Anthony directly |
| Material price ↑ > 15% vs 90-day avg | 🟡 Watch | #dexter-data | Trend alert |
| Best vendor changed for a material | ℹ️ Info | #dexter-data | Notify, update Commet for re-pricing |
| New material detected | ➕ New | #dexter-data | Add to Needs Review |
| Vendor total spend ↑ > 15% vs rolling 90 | 🟡 Watch | #dexter-data | Strategic review |
| Same material bought at 2+ vendors at different prices | 💡 Opportunity | #dexter-data | Consolidation alert |
| Receipt total > $1000 | ℹ️ Info | #agent-activity | Large purchase flag for CFO review |
| Unreadable receipt (OCR confidence low) | ⚠️ Review | #dexter-data | Anthony manually reviews |

---

## Workflow — Step by Step (What Dexter Does)

### When a new receipt arrives:

1. **Receive** the image/PDF from n8n (email attachment, Drive folder, or Gmail forward)
2. **Generate** a `Receipt ID` (`RCPT-YYYYMMDD-NNN`)
3. **Send** image to Claude Vision with the extraction prompt above
4. **Parse** the returned JSON
5. **Validate** — if total doesn't match sum of line items within $0.02, flag for review
6. **Archive** original image to Google Drive: `Finance/Receipts/Processed/{Vendor}/{YYYY-MM}/RCPT-...`
7. **Insert** row into Tab 6 (Receipts Log)
8. **For each line item:**
   a. Run fuzzy match against Master Materials (Tab 1)
   b. If auto-match → write to Price History (Tab 2) with Material ID
   c. If review needed → write to Needs Review (Tab 4)
   d. If new → write to Needs Review with "Create New" action
9. **Recalculate** for each matched material:
   - New "Current Best Price" (min across last 90 days)
   - New "Current Best Vendor"
   - 30-day, 90-day, YTD change %
   - Alert Status (🟢/🟡/🔴)
10. **Compare** new price to previous price → trigger alerts per Alert Rules
11. **Post** to Slack #dexter-data:
    - Summary: "Receipt from {Vendor}, ${total}, {N} items processed. Matches: {X}. Review: {Y}. Alerts: {Z}."
    - Any 🔴 alerts posted as separate urgent messages
12. **Update** `memory/financials.md` "Vendor Pricing Intelligence" section if significant change
13. **Optional** — Push to QBO as Expense/Bill via QB Expenses tool (if flag enabled)

### Weekly Review (Monday, 5 min for Anthony):

1. Dexter posts "Weekly Pricing Intelligence Digest" to Slack
2. Link to the "Needs Review" tab — Anthony clears the queue (confirm/create/merge)
3. Summary of top 5 price movements
4. Summary of vendor consolidation opportunities
5. Summary of the week's total material spend by category

### Monthly Review (First of month):

1. Dexter runs full "Price Movement Report"
2. Identifies biggest cost increases by material and by vendor
3. Recommends actions:
   - Renegotiate with vendor X
   - Switch to vendor Y for material Z
   - Buy in bulk before next price hike
4. Feeds updated costs to Commet for repricing service packages
5. Feeds cost trends to Milli/Buddy for proposal pricing adjustments

---

## Integration with Other Agents

| Agent | What They Get from This Skill |
|-------|------------------------------|
| **Commet** | Updated material costs → auto-adjust package pricing |
| **Milli** | Current cost data for estimate accuracy |
| **Buddy** | Cost data for bid/proposal margin calculations |
| **Dexter (KPI)** | Material cost % of revenue, trend data for weekly dashboard |
| **Vizzy** | 🔴 alerts forwarded in daily briefing if any hit threshold |
| **Cassie** | Nothing directly, but informed of cost pressure on jobs |

---

## Memory Updates

After every significant pricing event, update `memory/financials.md` → Vendor Pricing Intelligence section:

- New best-vendor switches
- Materials showing consistent inflation trends
- Vendors showing consistent price discipline (good)
- Consolidation opportunities identified
- Quarterly pricing pattern summary

---

## Example Trigger Phrases

- "Upload this receipt" (with image attached)
- "Log this invoice from Sherwin"
- "What did we pay for SH last month?"
- "Cheapest vendor for aluminum coil right now?"
- "Price history on surfactant"
- "Which vendor has the best prices this quarter?"
- "Flag any price hikes this month"
- "Vendor spend report for Q1"
- "Am I paying too much for anything?"
- "Show me material costs by category"

---

## Success Metrics (How We Know This Skill Works)

| Metric | Target | Measure |
|--------|--------|---------|
| Receipts processed touchless | > 85% auto-match rate | Tab 4 size / Tab 2 size |
| Price hikes caught within 1 week | 100% of >10% increases | Alert log |
| Vendor consolidation savings | > $500/mo identified | Monthly review |
| Estimate accuracy improvement | Material cost variance < 5% of actual | Dexter KPI report |
| Anthony weekly review time | < 10 min | Self-reported |

---

## Learning Protocol

1. **Before processing:** Always check for existing Material ID and Vendor ID — never duplicate
2. **After every receipt:** Update last-purchase fields and recalculate deltas
3. **When a material price moves > 20%:** Log to `memory/mistakes-and-fixes.md` if it was missed
4. **Monthly:** Review fuzzy-match failures and add aliases to improve auto-match rate
5. **Quarterly:** Audit category assignments — recategorize anything in "Misc" that has repeat buys
6. **Annually:** Archive Price History rows > 24 months old to a separate sheet for long-term trending

---

## Related Files

- `references/sops/receipt-capture.md` — Field SOP for how Anthony/crew snap receipts (to be created)
- `.claude/skills/vendor-pricing-tracker/n8n-workflow-spec.md` — Full n8n workflow build spec
- `.claude/skills/vendor-pricing-tracker/master-sheet-template.md` — Sheet column formulas
- `memory/financials.md` — Vendor Pricing Intelligence section
- `references/agents/agent_12_dexter.md` — Dexter's agent profile
