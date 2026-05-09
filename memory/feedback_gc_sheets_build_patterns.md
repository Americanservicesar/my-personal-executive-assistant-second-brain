---
name: GC Bid Sheets — Build Patterns & Pitfalls
description: Lessons from building the MRC Vicksburg GC bid sheet in Google Sheets via MCP. Range sizing, network limits, formula references, and split-write strategy.
type: feedback
last_updated: 2026-05-09
originSessionId: cd616327-9aea-40e8-9fa5-2ee6a9479132
---
## Rule: writeSpreadsheet range must EXACTLY match row count in values array

Off by even 1 row causes: `Failed to write range: tried writing to row [N+1]`

**How to apply:** Count array rows before specifying range. If array has 46 rows, range must be A1:FX46 (not A1:FX45). When unsure, split into two writes at a safe boundary (~40 rows each).

**Why:** The MCP tool validates range bounds against array dimensions strictly — no padding, no truncation.

---

## Rule: Bash tool has no outbound network access — use Google Workspace MCP directly

Python scripts via Bash fail with `socket.gaierror: [Errno 11001] getaddrinfo failed` when trying to call Google Sheets API.

**How to apply:** Always use `mcp__google-workspace__writeSpreadsheet` (and related tools) for all Google Sheets operations. Never route through Python/Bash for API calls in this environment.

**Why:** The Bash sandbox blocks all outbound DNS/HTTP. MCP tools bypass this since they run server-side.

---

## Rule: Split large tab writes at ~40 rows max

Writing 50+ rows in a single call risks:
- Row count mismatch errors
- JSON parsing failures on long strings (URLs, special chars in values)

**How to apply:** Break large tab populations into 2-3 writes. Write header + zones separately. Example:
- Write 1: A1:F33 (header, zone 1)
- Write 2: A34:F46 (zone 2 + subtotals)
- Write 3: A48:F53 (sub bid input section)

---

## Rule: Trailing `]]]` in values parameter causes MCP validation error

Error: `values: Expected array, received string`

This fires when JSON has a malformed trailing bracket (e.g., `]]]` instead of `]]`), or when a string value inside the array contains unescaped characters that confuse the JSON parser.

**How to apply:** Keep individual cell strings short. Long URLs, special chars, or em-dashes in cell values should be tested. If an array fails, split it in half and identify the bad row.

---

## Rule: Formula row references must match actual sheet row, not array index

If write starts at row 34 and array index [5] is row 39, formula must be `=C39*D39` not `=C5*D5`.

**How to apply:** Always calculate actual sheet row = start row + array index. Double-check formulas in cost factor tables, subtotal rows, and cross-tab references.

---

## Rule: Tab names with special chars in range notation need single quotes

Tab name `STRIPING, SIGNS & CURB STOPS` must be referenced as `'STRIPING, SIGNS & CURB STOPS'!A1` in range parameter.

**How to apply:** Any tab name with spaces, commas, ampersands, or apostrophes requires single-quote wrapping in A1 notation.

---

## Tab Structure That Works for Federal/Commercial Bids

Standard zone layout proven on MRC Vicksburg (2026-05-09):

```
Zone 1: Header (project, location, SF/LF)
Zone 2: Materials (Item | UOM | Qty | Unit Rate | Total | RS Means Benchmark)
Zone 3: Labor (Role | # Men | # Days | Rate/Man/Day | Total | RS Means)
Zone 4: Equipment (Equipment | # Days | Rate/Day | Total | | RS Means)
Zone 5: Indirect/Travel (Item | # People | # Nights | Rate | Total)
Bottom: TOTAL DIRECT COST = Zone 2 + Zone 3 + Zone 4 + Zone 5
```

**For subcontractor scopes** (striping, signs, etc.):
- Use same zone layout for quantity/RFQ reference
- Add SUB BID INPUT section at bottom
- Formula: `BILLED TO GC = Sub Bid + (Sub Bid × markup%)`
- BID tab references `'TAB NAME'!BILLED_CELL` directly

---

## Federal Site Premium — Recommended Structure

Always add a FEDERAL SITE PREMIUM tab on any federal/military job with:
- **Cell B5:** editable premium % (e.g. `7%`)
- BID tab row: `=G15 * VALUE(SUBSTITUTE('FEDERAL SITE PREMIUM'!B5,"%",""))/100`
- Grand Total: `=G15 + E22 + G23` (subtotal + travel + premium)

Scale reference baked into tab:
- Federal Civilian (GSA/courthouse): 5-10%
- Military Base (non-classified): 10-15%
- SCIF/Shipyard/Nuclear: 15-25%
