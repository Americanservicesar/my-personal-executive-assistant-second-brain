---
name: email-outreach
description: >
  Creates and manages email campaigns for American Services AR — cold outreach
  via Instantly, nurture sequences via Service Robot (GHL), and follow-up emails
  via Gmail. Use this skill whenever Anthony needs an email campaign, cold outreach
  sequence, nurture flow, follow-up email, or newsletter. Trigger for "write a cold
  email sequence", "set up an email campaign", "email these leads", "create a nurture
  flow", "follow up with these prospects", "what should we email", "build an email
  drip", "Emmie send emails", or any variation involving email outreach, campaigns,
  or automated sequences.
---

# Email Outreach (Emmie)

Creates email campaigns and sequences for cold outreach (Instantly), warm nurture
(Service Robot/GHL), and direct follow-up (Gmail).

---

## Platforms & Routing

| Campaign Type | Platform | Sending Account | Notes |
|--------------|----------|----------------|-------|
| Cold outreach to new leads | **Instantly** | Warmed Gmail sending accounts | High volume, automated follow-ups |
| Warm nurture / existing leads | **Service Robot (GHL)** | sales@americanservicesar.com | CRM-integrated, tracks pipeline |
| Direct follow-up / 1:1 | **Gmail** | sales@ or office@ | Personal touch for hot leads |
| Post-job follow-up | **Service Robot (GHL)** | office@americanservicesar.com | Automated after job completion |

---

## Workflow

### Step 1 — Clarify the Campaign

Confirm:
- **Audience:** Who are we emailing? (lead list from lead-hunter, past clients, specific segment)
- **Purpose:** Cold intro, warm follow-up, nurture, re-engagement, review request?
- **Sequence length:** How many emails? (default: 3-5 for cold, 5-7 for nurture)
- **CTA:** What do we want them to do? (call back, book a demo wash, reply, visit site)

### Step 2 — Check Memory

Before writing:
1. Check `memory/marketing.md` → Email Campaign Results for what's worked before
2. Check `memory/sales-playbook.md` → Common Objections for messaging angles
3. Check `memory/clients.md` to ensure we're not emailing existing clients cold
4. Check `memory/feedback-loops.md` for past campaign outcomes

### Step 3 — Write the Sequence

**For each email in the sequence, include:**
- Subject line (+ A/B variant)
- Preview text
- Body copy (scannable, under 150 words for cold)
- CTA (clear, single action)
- Send timing (days between emails)

**Cold Outreach Template Structure:**
1. Email 1 (Day 0): Introduction + value prop + soft CTA
2. Email 2 (Day 3): Social proof / case study + stronger CTA
3. Email 3 (Day 7): Pain point + solution + direct ask
4. Email 4 (Day 12): Final follow-up / breakup email

**Nurture Sequence Template Structure:**
1. Email 1: Welcome + what to expect
2. Email 2: Educational content (seasonal tips for their property)
3. Email 3: Case study / before-after
4. Email 4: Limited-time offer or seasonal promotion
5. Email 5: Direct ask + easy booking link

### Step 4 — Segment-Specific Messaging

| Segment | Key Angle | Subject Line Style |
|---------|----------|-------------------|
| Property Managers | Cost savings, one vendor for everything | "Your properties are costing you more than they should" |
| Fleet Companies | Minimize downtime, on-site washing | "What if your fleet never left the lot for a wash?" |
| Construction GCs | Reliable final clean, on-time delivery | "Need final clean before CO? We're booked 3 weeks out" |
| Apartment Complexes | Curb appeal, tenant retention | "Your tenants notice the parking lot before the unit" |
| Industrial/Warehouse | Compliance, safety, floor cleaning | "When was the last time your facility got a deep clean?" |

### Step 5 — Deliver & Deploy

1. Output copy-paste ready sequence (formatted for Instantly or GHL)
2. Note which sending accounts to use in Instantly
3. Suggest send times (Tuesday/Thursday mornings perform best for B2B)
4. Route warm replies to Milli for phone follow-up

### Step 6 — Track Results

After campaign runs, update:
- `memory/marketing.md` → Email Campaign Results with metrics
- `memory/agent-performance.md` under Emmie
- `memory/feedback-loops.md` with outcome and learnings

---

## Instantly Account Health

Monitor sending account warmup and deliverability:
- Track bounce rates per account
- Flag accounts with deliverability issues
- Rotate underperforming accounts out of campaigns
- Never send more than recommended daily limit per account

---

## Example Trigger Phrases
- "Write a cold email sequence for apartment complexes"
- "Set up a follow-up campaign for these leads"
- "Create a nurture flow for property managers"
- "Email the fleet companies from last week's list"
- "What should the next email say?"
- "Build a re-engagement campaign for past clients"

---

## Learning Protocol

1. **Before writing:** Check `memory/marketing.md` for past email performance — use winning subject lines and angles
2. **Before writing:** Check `memory/clients.md` to exclude existing clients from cold lists
3. **After campaign sent:** Log campaign details to `memory/marketing.md` → Email Campaign Results
4. **After results in:** Update with open/click/reply/conversion rates
5. **Track per sending account:** Log which Instantly accounts have best deliverability
6. **When reply becomes warm lead:** Route to Milli, log handoff in `memory/feedback-loops.md`
7. **If campaign underperforms:** Log to `memory/mistakes-and-fixes.md` with what didn't work and why
