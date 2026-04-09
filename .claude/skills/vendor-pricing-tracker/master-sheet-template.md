# Master Material Price List — Google Sheet Template

Copy-paste-ready instructions for building the Google Sheet.

**File Name:** `ASAR — Master Material Price List`
**Location:** Google Drive → `Finance/Pricing Intelligence/`
**Sharing:** Anthony (edit), Robbie (view), Dexter service account (edit)

---

## Tab 1 — Master Materials

**Header Row (Row 1):**

```
Material ID | Material Name | Category | Unit | Current Best Price | Current Best Vendor | Last Price Paid | Last Vendor | Last Purchase Date | 30-Day Change % | 90-Day Change % | YTD Change % | Purchases YTD | Total Spend YTD | Alert Status | Aliases | Notes
```

**Column Formulas (starting row 2, fill down):**

| Col | Formula |
|-----|---------|
| E (Current Best Price) | `=IFERROR(MINIFS('Price History'!F:F, 'Price History'!C:C, A2, 'Price History'!B:B, ">="&(TODAY()-90)), "")` |
| F (Current Best Vendor) | `=IFERROR(INDEX('Price History'!E:E, MATCH(1, ('Price History'!C:C=A2)*('Price History'!F:F=E2)*('Price History'!B:B>=(TODAY()-90)), 0)), "")` (array formula — Ctrl+Shift+Enter) |
| G (Last Price Paid) | `=IFERROR(INDEX('Price History'!F:F, MATCH(1, ('Price History'!C:C=A2)*('Price History'!B:B=MAXIFS('Price History'!B:B, 'Price History'!C:C, A2)), 0)), "")` |
| H (Last Vendor) | `=IFERROR(INDEX('Price History'!E:E, MATCH(1, ('Price History'!C:C=A2)*('Price History'!B:B=MAXIFS('Price History'!B:B, 'Price History'!C:C, A2)), 0)), "")` |
| I (Last Purchase Date) | `=IFERROR(MAXIFS('Price History'!B:B, 'Price History'!C:C, A2), "")` |
| J (30-Day Change %) | `=IFERROR((G2 - AVERAGEIFS('Price History'!F:F, 'Price History'!C:C, A2, 'Price History'!B:B, ">="&(TODAY()-30), 'Price History'!B:B, "<"&(TODAY()-1))) / AVERAGEIFS('Price History'!F:F, 'Price History'!C:C, A2, 'Price History'!B:B, ">="&(TODAY()-30), 'Price History'!B:B, "<"&(TODAY()-1)), "")` |
| K (90-Day Change %) | `=IFERROR((G2 - AVERAGEIFS('Price History'!F:F, 'Price History'!C:C, A2, 'Price History'!B:B, ">="&(TODAY()-90), 'Price History'!B:B, "<"&(TODAY()-30))) / AVERAGEIFS('Price History'!F:F, 'Price History'!C:C, A2, 'Price History'!B:B, ">="&(TODAY()-90), 'Price History'!B:B, "<"&(TODAY()-30)), "")` |
| L (YTD Change %) | `=IFERROR((G2 - AVERAGEIFS('Price History'!F:F, 'Price History'!C:C, A2, 'Price History'!B:B, ">="&DATE(YEAR(TODAY()),1,1), 'Price History'!B:B, "<"&(TODAY()-30))) / AVERAGEIFS('Price History'!F:F, 'Price History'!C:C, A2, 'Price History'!B:B, ">="&DATE(YEAR(TODAY()),1,1), 'Price History'!B:B, "<"&(TODAY()-30)), "")` |
| M (Purchases YTD) | `=COUNTIFS('Price History'!C:C, A2, 'Price History'!B:B, ">="&DATE(YEAR(TODAY()),1,1))` |
| N (Total Spend YTD) | `=SUMIFS('Price History'!H:H, 'Price History'!C:C, A2, 'Price History'!B:B, ">="&DATE(YEAR(TODAY()),1,1))` |
| O (Alert Status) | `=IF(J2="","🟢",IF(J2>=0.20,"🔴",IF(J2>=0.10,"🟡","🟢")))` |

**Conditional Formatting:**
- Column O: 🔴 = red background, 🟡 = yellow, 🟢 = green
- Column J, K, L: red if > 10%, green if < -5%

**Data Validation:**
- Column C (Category): Dropdown with category list (see SKILL.md)
- Column D (Unit): Dropdown — gal, ea, lb, ft, box, case, oz

---

## Tab 2 — Price History (append-only ledger)

**Header Row:**

```
Transaction ID | Date | Material ID | Material Name (Raw) | Vendor | Unit Price | Qty | Total | Unit | Receipt ID | Brand | Job Code | Notes
```

**Freeze row 1. No formulas — n8n appends rows directly.**

**Sort:** Descending by Date (manual weekly or auto via Apps Script trigger)

---

## Tab 3 — Vendors

**Header Row:**

```
Vendor ID | Vendor Name | Address | Phone | Account # | Payment Terms | Categories Supplied | # Transactions YTD | Total Spend YTD | Avg Price Rank | Reliability | Preferred? | Notes
```

**Column Formulas:**

| Col | Formula |
|-----|---------|
| H (# Transactions YTD) | `=COUNTIFS('Price History'!E:E, B2, 'Price History'!B:B, ">="&DATE(YEAR(TODAY()),1,1))` |
| I (Total Spend YTD) | `=SUMIFS('Price History'!H:H, 'Price History'!E:E, B2, 'Price History'!B:B, ">="&DATE(YEAR(TODAY()),1,1))` |
| J (Avg Price Rank) | Computed weekly by Dexter via Code Tool (complex ranking across shared materials) |

**Data Validation:**
- Column K (Reliability): 1-5 dropdown
- Column L (Preferred?): Yes/No dropdown

---

## Tab 4 — Needs Review

**Header Row:**

```
Date | Raw Item Name | Vendor | Qty | Unit Price | Total | Suggested Match | Match Confidence | Action | New Material ID | Status
```

**Data Validation:**
- Column I (Action): Dropdown — Confirm Match / Create New / Ignore / Merge
- Column K (Status): Dropdown — Pending / Resolved

**Conditional Formatting:**
- Column H (Confidence): color gradient red (0%) → yellow (70%) → green (100%)
- Rows where Status = "Resolved" → gray background

**Apps Script Hook:** When Action column changes and Status = Resolved, trigger the Material creation / confirmation flow.

---

## Tab 5 — Alerts Log

**Header Row:**

```
Date | Alert Type | Material | Vendor | Old Value | New Value | Change % | Action Taken | Reviewed By
```

**Conditional Formatting:**
- Column B: 🔴 = red, 🟡 = yellow, ℹ️ = blue, ➕ = green

---

## Tab 6 — Receipts Log

**Header Row:**

```
Receipt ID | Date | Vendor | Subtotal | Tax | Total | # Line Items | Image URL | QBO Pushed? | QBO Txn ID | Processing Status | Brand
```

**Data Validation:**
- Column I (QBO Pushed?): Yes/No
- Column K (Processing Status): Extracted / Matched / Flagged / Complete
- Column L (Brand): ASAR / Apex Shield / Legendary

---

## Seed Data — Top 30 Common Materials (starter rows for Tab 1)

| Material ID | Material Name | Category | Unit | Aliases |
|-------------|--------------|---------|------|---------|
| MAT-0001 | Sodium Hypochlorite 12.5% | Pressure Washing Chemicals | gal | SH\|bleach\|sod hypo\|12.5\|pool chlorine |
| MAT-0002 | Surfactant (Elemonator / Gutter Zap) | Pressure Washing Chemicals | gal | elemonator\|gutter zap\|surfactant\|soap |
| MAT-0003 | Sodium Hydroxide (Caustic) | Pressure Washing Chemicals | gal | caustic\|lye\|hot mix |
| MAT-0004 | F9 BARC Rust Remover | Pressure Washing Chemicals | gal | f9\|barc\|rust remover |
| MAT-0005 | F9 Efflorescence Remover | Pressure Washing Chemicals | gal | f9 efflo\|efflorescence |
| MAT-0006 | Heavy Duty Degreaser | Pressure Washing Chemicals | gal | degreaser\|HD degreaser |
| MAT-0007 | Wood Restorer / Brightener | Pressure Washing Chemicals | gal | wood brightener\|oxalic |
| MAT-0008 | Aluminum Brightener | Fleet Wash Supplies | gal | alum brightener\|aluminum brite |
| MAT-0009 | Truck Wash Soap | Fleet Wash Supplies | gal | truck wash\|fleet soap |
| MAT-0010 | Pressure Washer Pump Oil | Pressure Washing Equipment & Parts | qt | pump oil |
| MAT-0011 | 1/4" Pressure Hose (ft) | Pressure Washing Equipment & Parts | ft | 1/4 hose |
| MAT-0012 | 3/8" Pressure Hose (ft) | Pressure Washing Equipment & Parts | ft | 3/8 hose |
| MAT-0013 | Spray Tip — 15° | Pressure Washing Equipment & Parts | ea | 15 tip\|nozzle 15 |
| MAT-0014 | Spray Tip — 25° | Pressure Washing Equipment & Parts | ea | 25 tip\|nozzle 25 |
| MAT-0015 | Spray Tip — 40° | Pressure Washing Equipment & Parts | ea | 40 tip\|nozzle 40 |
| MAT-0016 | Surface Cleaner Swivel | Pressure Washing Equipment & Parts | ea | swivel |
| MAT-0017 | Gasoline (87 regular) | Fuel & Gas | gal | gas\|regular\|unleaded |
| MAT-0018 | Diesel | Fuel & Gas | gal | diesel\|dsl |
| MAT-0019 | Aluminum Coil .027 White | Gutter Materials | ft | coil\|.027\|white coil |
| MAT-0020 | Aluminum Coil .032 White | Gutter Materials | ft | .032\|heavy coil |
| MAT-0021 | 3"x4" Downspout (10 ft) | Gutter Materials | ea | 3x4 downspout\|ds 3x4 |
| MAT-0022 | 2"x3" Downspout (10 ft) | Gutter Materials | ea | 2x3 downspout\|ds 2x3 |
| MAT-0023 | Hidden Hangers (box) | Gutter Materials | box | hangers\|hh |
| MAT-0024 | Gutter Sealant (tube) | Gutter Materials | ea | sealant\|seal\|goop |
| MAT-0025 | Gutter Screws (box) | Gutter Materials | box | gutter screws |
| MAT-0026 | Contractor Trash Bags (box) | Construction Cleanup Supplies | box | trash bags\|contractor bags |
| MAT-0027 | Nitrile Gloves (box) | PPE & Safety | box | gloves\|nitrile |
| MAT-0028 | Safety Glasses | PPE & Safety | ea | glasses\|goggles |
| MAT-0029 | Contractor Broom | Construction Cleanup Supplies | ea | broom |
| MAT-0030 | Motor Oil 5W-30 (qt) | Truck & Trailer | qt | motor oil\|5w30 |

---

## Apps Script Triggers (Optional Enhancements)

### Auto-sort Price History on edit
```javascript
function onEdit(e) {
  const sheet = e.source.getSheetByName('Price History');
  if (e.range.getSheet().getName() === 'Price History') {
    const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
    range.sort({column: 2, ascending: false}); // Sort by Date desc
  }
}
```

### Auto-process Needs Review confirmations
When Action column on Tab 4 = "Confirm Match" and Status = "Resolved":
1. Copy row to Price History with suggested Material ID
2. Update Master Materials row

When Action = "Create New":
1. Generate new Material ID (MAT-NNNN)
2. Create row in Master Materials
3. Copy to Price History with new ID

---

## Build Order

1. Create the sheet file with all 6 tabs
2. Paste headers + formulas
3. Seed Master Materials with the 30 rows above
4. Add conditional formatting
5. Add data validation dropdowns
6. Set up Drive folder structure
7. Share with Dexter service account
8. Test with one manual row entry end-to-end
9. Connect n8n workflow
