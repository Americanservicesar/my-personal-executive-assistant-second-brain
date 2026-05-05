# Cassie — Layne Smith Re-Engagement (GHL Workflow Path)

> **CORRECTION (2026-05-04):** Earlier draft assumed Cassie sends from sales@. That's wrong. Per Anthony: **all estimate and job follow-ups (email + SMS) go through GHL workflows.** sales@ and office@ are not used for outbound — only inbound monitoring. Cold outreach goes through Instantly, not Gmail.

## What Cassie Actually Does for Layne

Cassie does **not** send a direct Gmail. Cassie's job is to make sure Layne is in the correct GHL follow-up workflow — and if he's not, enroll him.

---

## Verification Steps (Required)

- [ ] Open Layne Smith's GHL contact and confirm current pipeline stage
- [ ] Check **GHL Workflow History** on the contact: which estimate-follow-up workflow is he enrolled in? When was the last automated touch?
- [ ] Confirm the actual service quoted (clients.md shows TBD)
- [ ] Confirm HCP estimate is still active
- [ ] Confirm verified email + phone on contact record

---

## Decision Tree

| GHL Workflow Status | Action |
|---|---|
| Already enrolled in active estimate follow-up sequence | Do nothing automated — let it run. If 11 days have passed and no engagement, escalate to **Milli for a personal call** |
| Enrolled but workflow ended (no recent touches) | Re-enroll via GHL Workflow Enrollment API (`POST /contacts/{id}/workflow/{workflowId}`) — see mistakes-and-fixes.md 2026-04-15 |
| Never enrolled | Enroll in the correct estimate-follow-up workflow now |
| Stage already moved to Lost | Do not re-engage automated. Add to Emmie's 90-day nurture if approved |

**Reference (mistakes-and-fixes.md 2026-04-15):** GHL "Tag Added" trigger does NOT fire from API. Always use the Workflow Enrollment API directly: `POST /contacts/{id}/workflow/{workflowId}`.

---

## Escalation Path (Phone, Not Email)

If automated workflow has run its course and Layne hasn't responded, the **next touch is a phone call from Milli** — not another email.

| Who | What | When |
|---|---|---|
| Milli | Call Layne at the phone on file. Use NEPQ "I need to think about it" follow-up: *"Totally makes sense. What specifically would you want to think through?"* | Today / this week |
| Cassie | Log call outcome in GHL contact note | After Milli's call |
| Cassie | If Layne is unreachable after call attempt → confirm GHL workflow is still enrolled and let it continue. Do not double-touch via email | Same day |

---

## If Anthony Wants a One-Off Personal Nudge

If Anthony specifically wants a personal "Hey Layne" touch outside the automated GHL workflow — that goes through **GHL Conversations** (which sends from sales@ via the GHL SMTP integration), not through direct Gmail send.

That keeps:
- All conversation history attached to the GHL contact record
- Open/click/reply tracking accurate
- The contact's workflow position consistent

---

## Update Logs

- [ ] GHL contact note: "Verified workflow enrollment — [status]. Next action: [Milli call / let workflow run / re-enroll]"
- [ ] memory/clients.md → Hot Prospects table (update Last Touch + Next Action)
- [ ] memory/sales-playbook.md → Proposal Win/Loss Log (when outcome known)

---

## Why the Earlier Draft Was Wrong

The first version of this file had Cassie drafting two Gmail emails to send from sales@. That violates the email architecture:

- **sales@ and office@:** Inbound monitoring only. Triggers Milli/Cassie via n8n Gmail monitor workflows. Not used for outbound.
- **Outbound to existing contacts (estimates, jobs):** GHL workflows handle everything — email + SMS — automatically based on pipeline stage.
- **Outbound cold to new prospects:** Instantly campaigns, not Gmail.
- **Outbound personal one-offs to existing contacts:** GHL Conversations (still sends from sales@, but routed through GHL so it's tracked).

This rule is now logged in memory/operations.md so it doesn't get violated again.
