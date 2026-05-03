# Cassie Email Restriction — No Job Scheduled / Booking Confirmation Emails

## Problem (2026-05-03)
Cassie sent a "job scheduled" booking confirmation email from office@americanservicesar.com to a customer (lane pruitt). GHL workflows already send all job scheduled / booking confirmation / appointment reminder notifications automatically. Cassie duplicating those emails confuses customers and looks unprofessional.

## Fix
Added an explicit prohibition block to Cassie's system message in n8n workflow `X9OndKjPk1rspj5l` (Cassie - Customer Support):

```
## EMAIL — WHAT CASSIE MUST NEVER SEND
⛔ NEVER send job scheduled, booking confirmation, appointment reminder, or "your job is booked" emails. GHL workflows send all of those automatically.
⛔ NEVER send estimate confirmation or price quote emails unprompted.
⛔ NEVER send any email to a customer unless it falls into these approved categories:
  - Complaint acknowledgment / resolution follow-up
  - Post-job satisfaction check-in (24+ hours AFTER job complete in HCP)
  - Review request (only after job confirmed complete)
  - Direct reply to a customer email at office@
  - Retention / win-back per Anthony's request
If unsure — DON'T send. Post to #cassie-support and wait for direction.
```

## Root Cause
Cassie's system message had no explicit prohibition against transactional emails. With access to the `Send Email - Cassie` gmailTool, the AI made its own judgment to send confirmations.

## Rule for All Agents
GHL is the single source of truth for all transactional customer notifications:
- Job scheduled → GHL sends confirmation
- Estimate created → HCP emails customer + GHL follow-up
- Appointment reminder → GHL sends
- Invoice sent → HCP handles

Agents with Gmail tools (Cassie, Emmie, Milli) must SUPPLEMENT GHL communications only — never duplicate what GHL already sends automatically.
