---
name: n8n Email Routing Bug — Use Contact Email, Not Notification Sender
description: n8n Gmail Monitor workflows were emailing notification sender addresses instead of the GHL contact's actual email. Fix and full context documented here.
type: feedback
date_discovered: 2026-04-26
originSessionId: 9c87e560-6e4c-4040-b404-ffc68cc83431
---
## The Bug

n8n Gmail Monitor workflows (e.g., `mqSWSLhNl3Qy0Nyy` — sales@ → Milli) were firing outbound emails to the **notification email's From/Reply-To address** instead of the **GHL contact's actual email field**.

**Why it happened:** Lead notification emails (from Zapier/Max Marketing/HCP) arrive at sales@ with a platform sender like `maxmarketingbenton@example.com` or `carolyn.kennedy@example.com` as the From/To. The workflow was extracting the email address from the notification headers and using it as the reply-to target — instead of looking up the contact in GHL by name/phone and using their stored email.

**Result:** Dozens of bounced emails every time a lead notification came in. Sales@ inbox flooded with Mailer Daemon delivery failures.

**Why:** `example.com` is a reserved domain that deliberately rejects all email. These are placeholder addresses used by lead gen platforms in their notification templates — they are NOT the prospect's email.

## What Was Confirmed

- **Rebecca Bennett** — GHL had correct email `rbennett@cityofbryant.com`. n8n sent to `maxmarketingbenton@example.com` (the notification sender). GHL already correct, no contact update needed.
- **Carolyn Kennedy** — GHL had correct email `carolynkennedy2007@gmail.com`. n8n sent to `carolyn.kennedy@example.com`. GHL already correct, no contact update needed.
- **Kristen Williams** — Not in GHL. Real email `kwilliams@readyconstruction.com` found in BuildingConnected notification body. Contact created in GHL 2026-04-26.
- **Ty Dotson** — Not in GHL. `tydotson@email.com` bounced. No original lead form found. Anthony to resolve manually.

## The Fix

In every n8n email-sending node that replies to inbound leads:

**WRONG pattern:**
```
toEmail = {{ $json["from"] }}   // uses notification sender
toEmail = {{ $json["replyTo"] }} // uses platform reply-to
```

**CORRECT pattern:**
```
1. Extract contact name/phone from notification body
2. GET /contacts/ from GHL with name or phone search
3. Use {{ contact.email }} from GHL lookup result
```

**Why:** The notification email's From address belongs to the LEAD PLATFORM (Max Marketing, HCP, BuildingConnected), not the prospect. The prospect's email is always in:
- The notification email BODY (as "Email: xxx@xxx.com")
- The GHL contact record (populated when the lead was created via Zapier/webhook)

Always pull from GHL contact record first. Parse body as fallback if contact not found yet.

## How to Apply

- Any new Gmail Monitor workflow: never use `$json.from` or `$json.replyTo` as the outbound email address
- Always do a GHL contact lookup (by phone or name from the notification body) before sending
- Add email validation: skip send if address contains `@example.com`, `@email.com`, or other placeholder domains
- Internal agent addresses (`cassie@americanservicesar.com`, `emmie_diag@americanservicesar.com`) do NOT exist as real mailboxes — route internal alerts to `sales@americanservicesar.com` or `office@americanservicesar.com`
