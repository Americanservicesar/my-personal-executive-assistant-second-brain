---
name: customer-followup
description: >
  Manages post-job customer follow-ups, complaint resolution, review requests,
  and client retention for American Services AR. Use this skill whenever Anthony
  needs to follow up with a customer, handle a complaint, request a review, check
  on client satisfaction, or retain at-risk accounts. Trigger for "follow up with
  this client", "handle this complaint", "ask for a review", "check on customer
  satisfaction", "who needs a follow-up", "retention check", "this customer is
  unhappy", "send a thank you", or any variation involving post-sale customer
  communication, complaint handling, or review generation.
---

# Customer Follow-Up (Cassie)

Handles all post-sale customer communication — follow-ups, complaint resolution,
review requests, satisfaction tracking, and retention for ASAR, Apex Shield, and
Legendary Home Services.

---

## Tools

| Tool | Purpose |
|------|---------|
| Service Robot (GHL) | Automated follow-ups, review requests, conversation tracking |
| Gmail (office@) | Direct customer communication |
| Housecall Pro | Job completion data, customer history |

---

## Workflow

### Step 1 — Identify the Interaction Type

| Type | Priority | Response Time |
|------|----------|--------------|
| Complaint / unhappy customer | Urgent | Within 2 hours |
| Job completion follow-up | Standard | Within 24 hours |
| Review request | Standard | 24-48 hours after job |
| Retention check-in | Proactive | Before contract renewal |
| Win-back (lost client) | Scheduled | Per campaign cadence |

### Step 2 — Check Client History

Before any outreach:
1. Check `memory/clients.md` for client history and past interactions
2. Check `memory/clients.md` → Client Satisfaction Log for previous scores
3. Check Housecall Pro for job details, dates, and amounts
4. Check Service Robot (GHL) for conversation history

### Step 3 — Execute by Type

**Complaint Resolution:**
1. Acknowledge the issue immediately — empathetic, professional
2. Investigate: What happened? Check job notes, crew, timeline
3. Propose solution: redo, discount, credit, or explanation
4. Follow up within 24 hours to confirm resolution
5. If resolved well: ask for review (satisfied complaints = strongest reviews)

**Post-Job Follow-Up (within 24 hrs):**
> "Hi [Name], this is Anthony with American Services AR. Just checking in — how did everything look after our team finished up at [property]? Want to make sure you're 100% satisfied."

**Review Request (24-48 hrs after job):**
> "Glad to hear everything went well! If you have 30 seconds, a Google review would mean the world to us: [link]. We really appreciate your business."

Send via Service Robot (GHL) automated workflow or direct text/email.

**Retention Check-In (before contract renewal):**
> "[Name], your [service] contract is coming up for renewal on [date]. Everything going well? We'd love to keep serving [property]. Any changes or additions you'd like for the next term?"

**Win-Back (lost client):**
> "Hi [Name], it's been a while since we worked together at [property]. We've upgraded our [relevant service] capabilities and would love the chance to earn your business again. Can I swing by for a quick look?"

### Step 4 — Log Everything

After every interaction:
1. Update `memory/clients.md` → Client Satisfaction Log
2. Log to `memory/feedback-loops.md` with interaction type and outcome
3. Update `memory/agent-performance.md` under Cassie

### Step 5 — Churn Detection

Flag at-risk clients when:
- No booking in 90+ days for recurring clients
- Satisfaction score below 3
- Complaint unresolved for 48+ hours
- Client didn't respond to last 2 follow-ups
- Contract renewal within 30 days with no check-in

Route churn risks to Milli for save attempt or Buddy for relationship repair.

---

## Example Trigger Phrases
- "Follow up with the apartment complex from last week"
- "This customer is unhappy — handle it"
- "Ask for reviews from this month's completed jobs"
- "Who needs a follow-up?"
- "Check on our recurring clients"
- "This client hasn't booked in a while"

---

## Learning Protocol

1. **Before outreach:** Check `memory/clients.md` for full client history — never contact blind
2. **After interaction:** Update `memory/clients.md` → Client Satisfaction Log immediately
3. **After review received:** Log to `memory/agent-performance.md` under Cassie (reviews requested vs received)
4. **When complaint resolved:** Log resolution method to `memory/feedback-loops.md` — learn what works
5. **When client churns:** Log to `memory/clients.md` → Past Clients with reason lost and win-back potential
6. **Monthly:** Review satisfaction patterns — identify systemic issues to prevent complaints
7. **If complaint pattern emerges:** Log to `memory/mistakes-and-fixes.md` — route to operations for process fix
