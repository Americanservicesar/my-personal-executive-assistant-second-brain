# n8n Workflow Spec — Vendor Pricing Tracker

**Workflow Name:** `ASAR — Vendor Pricing Intelligence`
**Owner:** Dexter (Agent 12)
**Purpose:** Ingest receipts/bills → OCR → match → update Master Material List → alert

---

## Triggers (3 entry points, 1 workflow)

### Trigger 1 — Gmail Watch
- **Node:** Gmail Trigger (IMAP or Gmail API)
- **Account:** `office@americanservicesar.com`
- **Filter:** Subject contains "RECEIPT" OR "INVOICE" OR "BILL"
- **Also:** Any email with attachment sent to `receipts@americanservicesar.com` (alias)
- **Extract:** Attachment (image or PDF)

### Trigger 2 — Google Drive Watch
- **Node:** Google Drive Trigger
- **Folder:** `Finance/Pricing Intelligence/Receipts - Inbox`
- **Event:** File Created
- **Extract:** File content (image or PDF)

### Trigger 3 — Manual Webhook (for mobile shortcut)
- **Node:** Webhook
- **Method:** POST
- **URL:** `/webhook/vendor-receipt`
- **Body:** base64 image + metadata
- **Use case:** iOS Shortcut / Android Tasker for one-tap upload

All 3 triggers route into the same processing chain below.

---

## Processing Chain

### Step 1 — Normalize Input
- **Node:** Function (Code)
- **Job:** Convert PDF to image if needed (first page only for multi-page PDFs), ensure image is base64-encoded, attach metadata (source, timestamp, sender)

### Step 2 — Generate Receipt ID
- **Node:** Function (Code)
- **Job:** Create `RCPT-YYYYMMDD-NNN` where NNN is a daily counter pulled from Receipts Log tab

### Step 3 — Claude Vision OCR
- **Node:** HTTP Request → Anthropic API
- **Endpoint:** `https://api.anthropic.com/v1/messages`
- **Model:** `claude-sonnet-4-6` (or `claude-opus-4-6` for higher-accuracy mode on low-confidence retries)
- **Headers:**
  - `x-api-key: {{ANTHROPIC_API_KEY}}`
  - `anthropic-version: 2023-06-01`
  - `content-type: application/json`
- **Body:**
  ```json
  {
    "model": "claude-sonnet-4-6",
    "max_tokens": 4096,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "image",
            "source": {
              "type": "base64",
              "media_type": "image/jpeg",
              "data": "{{$json.image_base64}}"
            }
          },
          {
            "type": "text",
            "text": "{{EXTRACTION_PROMPT}}"
          }
        ]
      }
    ]
  }
  ```
- **EXTRACTION_PROMPT:** (see SKILL.md → OCR Extraction — Claude Vision Prompt)

### Step 4 — Parse JSON
- **Node:** Function (Code)
- **Job:** Parse Claude's response, validate JSON structure, extract `line_items[]`, compute checksum (sum of line_total vs subtotal — tolerance $0.02)
- **On failure:** Flag for manual review, post warning to #dexter-data

### Step 5 — Save Image to Drive
- **Node:** Google Drive
- **Operation:** Upload
- **Path:** `Finance/Receipts/Processed/{vendor_name}/{YYYY-MM}/{Receipt ID}.{ext}`
- **Returns:** File URL (save for Receipts Log)

### Step 6 — Write to Receipts Log (Tab 6)
- **Node:** Google Sheets
- **Operation:** Append Row
- **Sheet:** Master Material Price List → Receipts Log
- **Data:**
  - Receipt ID, Date, Vendor, Subtotal, Tax, Total, #Line Items, Image URL, QBO Pushed (No initially), Status: "Extracted"

### Step 7 — Loop Line Items
- **Node:** Split In Batches (1 at a time)
- For each line item, run the Match & Write subflow below.

### Step 7a — Fuzzy Match Line Item
- **Node:** Function (Code) — calls into Master Materials tab
- **Job:** Pull Master Materials sheet as lookup table. Compute Levenshtein ratio for raw_name vs Material Name and Aliases. Return best match + confidence.
- **Decision:**
  - ≥ 85% → auto-match, proceed to 7b
  - 65–84% → send to Needs Review (Tab 4)
  - < 65% → send to Needs Review with "Create New" flag

### Step 7b — Write to Price History (Tab 2)
- **Node:** Google Sheets
- **Operation:** Append Row
- **Sheet:** Master Material Price List → Price History
- **Data:** Transaction ID, Date, Material ID, Raw Name, Vendor, Unit Price, Qty, Total, Unit, Receipt ID, Brand, Job Code (empty), Notes

### Step 7c — Recalculate Master Materials Row
- **Node:** Function (Code)
- **Job:** For this Material ID:
  - Update Last Price Paid, Last Vendor, Last Purchase Date
  - Find min(unit_price) over last 90 days → update Current Best Price + Current Best Vendor
  - Compute 30d/90d/YTD change %
  - Set Alert Status based on thresholds
- **Node:** Google Sheets → Update Row

### Step 7d — Alert Check
- **Node:** Function (Code) — returns alert list
- **Rules:** See SKILL.md → Alert Rules table
- **If any alert fires:** Write to Alerts Log (Tab 5) + queue Slack message

### Step 8 — Post Summary to Slack
- **Node:** Slack
- **Channel:** `#dexter-data`
- **Message:**
  ```
  📥 Receipt processed — {vendor_name}
  Date: {receipt_date}  |  Total: ${total}
  Items: {n_matched} auto-matched, {n_review} need review, {n_new} new

  {alert_summary — if any}

  Receipt: {drive_url}
  Sheet: {sheet_url}
  ```

### Step 9 — Urgent Alerts (Conditional)
- **Node:** IF → any 🔴 alerts?
- **If yes:** Post to `#agent-activity` with 🔴 prefix + @Anthony mention

### Step 10 — QBO Push (Optional, flag-controlled)
- **Node:** QuickBooks → Expenses/Purchases
- **Operation:** Create Expense
- **Data:** Mapped from receipt (Vendor, Date, Total, Tax, Line items as journal lines)
- **Skip if:** Brand not ASAR (Apex Shield/Legendary use separate QBO files)
- **Update:** Receipts Log → QBO Pushed = Yes, QBO Txn ID filled

### Step 11 — Mark Complete
- **Node:** Google Sheets → Update Row (Receipts Log)
- **Update:** Status = "Complete"

---

## Weekly Digest Sub-workflow

**Schedule:** Every Monday 7:00 AM CT

1. Pull all rows from Needs Review (Tab 4) where Status = Pending
2. Pull top 5 price movements from past 7 days
3. Pull vendor spend summary for past 7 days
4. Pull consolidation opportunities (same material, different vendors)
5. Compose Slack message to `#dexter-data` with:
   - Count of items needing Anthony's review (link to tab)
   - Top 5 movements
   - Vendor spend snapshot
   - 1 recommended action
6. Tag @Anthony if Needs Review count > 10

---

## Monthly Report Sub-workflow

**Schedule:** 1st of month, 8:00 AM CT

1. Full price movement report for prior month
2. Vendor performance rankings
3. Category spend breakdown
4. Auto-match accuracy rate (% of line items auto-matched vs reviewed)
5. Write report to Google Docs: `Finance/Pricing Intelligence/Monthly Reports/{YYYY-MM}.gdoc`
6. Post summary + link to `#agent-activity`

---

## Error Handling

| Error | Response |
|-------|----------|
| OCR failed / low confidence | Retry with `claude-opus-4-6`; if still fails → human review queue |
| Sheet write failed | Retry 3x with exponential backoff; if fails → write to backup sheet + Slack alert |
| Fuzzy match ambiguous | Send to Needs Review, don't block workflow |
| Duplicate receipt detected | Check by vendor + date + total; skip if match found in last 48h |
| QBO API rate limit | Queue for retry; workflow continues (QBO is optional) |

---

## Credentials Required

| Service | Credential | Already Exists? |
|---------|-----------|-----------------|
| Anthropic API | `anthropicApi` | ✅ `MGVdxOb43c7vfSd2` |
| Google Sheets | `googleSheetsOAuth2` | Check — may need to add |
| Google Drive | `googleDriveOAuth2Api` | ✅ `Hu80FNVrNnpo62Fj` |
| Gmail | `gmailOAuth2` | Check Vizzy's credential |
| QuickBooks | `quickBooksOAuth2Api` | ✅ `WFvcYZ9EfKbnspSX` |
| Slack | `slackOAuth2Api` | ✅ `lopIua3GVl7ESuOs` |

---

## Build Checklist

- [ ] Create Google Sheet from template (`master-sheet-template.md`)
- [ ] Seed Master Materials tab with top 30 most common materials
- [ ] Seed Vendors tab with current known vendors
- [ ] Create Drive folders: `Finance/Pricing Intelligence/Receipts - Inbox` and `Receipts/Processed/`
- [ ] Create Gmail alias `receipts@americanservicesar.com` (or use subject filter)
- [ ] Build n8n workflow following steps above
- [ ] Test with 5 sample receipts (different vendors, formats)
- [ ] Verify fuzzy matching accuracy (> 85% auto-match target)
- [ ] Verify alerts fire correctly (test with planted price change)
- [ ] Verify Slack messages format correctly
- [ ] Enable weekly digest schedule
- [ ] Enable monthly report schedule
- [ ] Document the workflow in Dexter's agent file
- [ ] Run in parallel with manual tracking for 2 weeks (safety net)
- [ ] Go live
