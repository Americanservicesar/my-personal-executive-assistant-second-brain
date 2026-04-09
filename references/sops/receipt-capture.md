# SOP — Receipt Capture

**Who:** Anthony (and eventually field crew leads)
**When:** Every time a vendor purchase happens
**Goal:** Get every receipt into the Vendor Pricing Tracker in under 10 seconds

---

## The 3 Ways to Capture

### Method 1 — Mobile Snap (Primary, for in-store purchases)

1. Pay at the counter, get the paper receipt
2. Open phone camera
3. Snap a clear photo — entire receipt, flat, no glare
4. Tap Share → Email → `receipts@americanservicesar.com`
5. Subject: `RECEIPT {Vendor Name}` (optional — auto-detected)
6. Send

**Done.** Dexter takes over. You get a Slack confirmation in #dexter-data within 30 seconds.

### Method 2 — Email Forward (for vendor invoices received via email)

1. When a vendor emails an invoice/bill
2. Forward the email to `receipts@americanservicesar.com`
3. Don't edit — just forward with attachment intact

### Method 3 — Drive Drop (for batch processing)

1. Save PDF/image to your phone or computer
2. Upload to Google Drive → `Finance/Pricing Intelligence/Receipts - Inbox`
3. Dexter picks it up automatically

---

## iOS Shortcut (Optional One-Tap Setup)

Create an iOS Shortcut named "Receipt":
1. Take Photo → Front of receipt
2. Send via Email → To: `receipts@americanservicesar.com`, Subject: "RECEIPT"
3. Add to Home Screen

Now receipt capture = tap icon → snap → send. 5 seconds.

---

## Photo Quality Rules

- **Flat** — no creases or folds covering text
- **Full receipt** — include top (vendor name) and bottom (total)
- **Good light** — no shadows across line items
- **Close enough** — line items readable
- **One receipt per photo** — don't stack receipts in one image

If the photo is bad, Dexter will flag it in `#dexter-data` and ask for a re-snap.

---

## What Happens Next (Invisible to You)

1. Dexter OCRs the image via Claude Vision
2. Extracts vendor, date, line items, prices
3. Matches each line item to Master Material List
4. Updates price history
5. Flags any price increases > 10%
6. Archives the image in Drive by vendor/month
7. Optionally pushes to QuickBooks as an expense
8. Posts summary to Slack #dexter-data

You do nothing after snapping. Weekly, you spend 5 minutes on Monday clearing the "Needs Review" tab for anything Dexter couldn't auto-match.

---

## Crew Lead Instructions (When Delegating)

When a crew lead buys supplies on a company card:

1. Same 5-second workflow: snap → email to `receipts@americanservicesar.com`
2. In the email body, write: `JOB: {job code or customer name}` — this ties the purchase to a specific job for cost tracking
3. Done

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Didn't get a Slack confirmation | Check spam in `office@` inbox; confirm n8n workflow is running |
| Dexter flagged "OCR low confidence" | Re-snap in better light |
| Line item didn't match correctly | Go to Master Material List → Needs Review tab, confirm or create new |
| Wrong vendor name detected | Fix in Price History row, add alias in Vendors tab to prevent next time |
| Receipt is too long for one photo | Take multiple photos, attach all to one email |

---

## Related

- `.claude/skills/vendor-pricing-tracker/SKILL.md` — Full skill spec
- `.claude/skills/vendor-pricing-tracker/n8n-workflow-spec.md` — Workflow build
- `memory/financials.md` — Vendor Pricing Intelligence section
