---
name: Gmail Inbox Cleanup
description: Inbox zero + label system for all 4 Gmail accounts. asons@ done. sales@ still pending.
type: project
status: IN PROGRESS — sales@ pending
last_updated: 2026-04-26
originSessionId: 0a48a353-6237-4cd8-8a18-1312f0ecf31a
---
## Account Status

| Account | Status | Labels Applied | Notes |
|---------|--------|---------------|-------|
| asons@americanservicesar.com | ✅ DONE 2026-04-26 | 9 labels | Inbox zeroed |
| sales@americanservicesar.com | ⏳ PENDING | None yet | Needs same sweep |
| office@americanservicesar.com | Not started | — | Lower priority |
| sonsfamily@... | Not started | — | Personal, lowest priority |

## asons@ Labels Applied (2026-04-26)

9 labels created and applied:
1. RPM — Ram Pro Master van docs/receipts
2. F450 — Ford F450 truck docs/receipts
3. EJ — Edward Jones investment/retirement
4. AAA — AAA membership
5. BioClean — BioClean medical billing
6. Medical — personal medical
7. Legal — legal correspondence
8. Personal — personal/misc
9. Finance — financial statements, bank, CC

## sales@ Label Plan (next session)

Use the same pattern as asons@. Recommended labels:
- Clients — customer emails
- Estimates — estimate requests/approvals
- Invoices — billing/AR
- Vendors — supplier/vendor correspondence
- Marketing — campaign replies, leads
- Admin — platform notifications, tools
- Urgent — needs Anthony action
- Archive — done/informational

## How to Run (Gmail MCP)

Account: sales@americanservicesar.com
Connected via: google-workspace MCP (see [reference_gmail_accounts.md](reference_gmail_accounts.md))

Steps:
1. `listGmailLabels` — see existing labels
2. `createGmailLabel` — create each new label
3. `searchGmail` — find emails by sender/keyword
4. `batchAddGmailLabels` — apply labels in bulk
5. `markAsRead` — clear unread count
6. Archive everything older than 30 days
