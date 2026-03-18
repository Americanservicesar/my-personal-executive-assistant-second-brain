---
name: daily-briefing
description: >
  Delivers Anthony's complete daily operations briefing by pulling live data from
  Google Calendar and Gmail, then formatting it into a structured morning command
  center. Use this skill whenever Anthony wants to start his day, check what's
  on his plate, get a morning summary, or needs a snapshot of the day ahead.
  Trigger for requests like "good morning", "what's my day look like", "morning
  briefing", "what do I have today", "run my briefing", "what's on the calendar",
  "check my emails", "what's going on today", "give me a rundown", "what should
  I focus on today", or any variation of starting the day or getting a daily
  summary. Also trigger automatically when Anthony opens a new session in the
  morning without a specific task — this is the default morning behavior.
---

# Daily Briefing

Pulls live data from Google Calendar and Gmail, then delivers a complete
morning command center for Anthony to start each day with full clarity.

---

## Execution Workflow

### Step 1 — Pull Calendar Data

Use **Google Calendar MCP** to fetch:
- All events for TODAY (full day — 12:00 AM to 11:59 PM Central)
- Any events for TOMORROW that affect today's planning (early starts, prep needed)
- Any events marked as "all day" (deadlines, reminders)

**Calendar tool calls:**
```
gcal_list_events:
  - time_min: [today 00:00 CT]
  - time_max: [today 23:59 CT]
  - calendar_id: primary
```

If calendar is empty or returns no events — note "No scheduled events" and continue.

---

### Step 2 — Pull Email Data

Use **Gmail MCP** to fetch:
- Unread emails from the last 24 hours
- Any emails flagged or starred
- Subject lines + sender names only (no need to read full body unless flagging)

**Gmail tool calls:**
```
gmail_search_messages:
  - query: "is:unread newer_than:1d"
  - max_results: 20
```

Triage each email into:
- 🔴 **Urgent** — customer issue, payment, time-sensitive bid, crew problem
- 🟡 **Action needed** — estimate follow-up, vendor reply, scheduling request
- 🟢 **FYI** — receipts, confirmations, reports, newsletters

---

### Step 3 — Determine Top 3 Priorities

Based on calendar + email data, plus knowledge of Anthony's current priorities
from context (commercial scaling, AI systems, SEO, lead gen, financial optimization):

1. Surface anything time-sensitive from calendar or email
2. Add the highest-impact business task if no urgent items exist
3. Add one forward-momentum item (something that moves a project forward)

---

### Step 4 — Deliver the Briefing

Use this exact format — no deviations:

```
☀️ GOOD MORNING, ANTHONY — [Full Day, Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 TODAY'S SCHEDULE
  [Time CT] — [Event Title] | [Location or "Virtual"]
  [Time CT] — [Event Title]
  [All day]  — [All-day event or deadline]
  (If empty: No scheduled events — wide open day.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📬 INBOX — [X] unread in last 24 hrs

  🔴 Urgent (handle today):
    → [Sender] — "[Subject]" — [1-line action]

  🟡 Action needed:
    → [Sender] — "[Subject]" — [route to agent or action]

  🟢 FYI:
    → [X] reports/receipts/confirmations — no action needed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 TOP 3 PRIORITIES TODAY
  1. [Most urgent or high-impact task]
  2. [Second priority — moves a project forward]
  3. [Third — quick win or open loop to close]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 OPEN LOOPS — NEEDS YOUR ATTENTION
  → [Item from email or context needing a decision]
  → [Stalled task or pending approval]
  → [Opportunity with a clock on it]
  (If none: All clear — no blockers identified.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤝 AGENT ROUTING — tasks identified today
  → [Agent]: [Task to route based on email/calendar intel]
  → [Agent]: [Task to route]
  (If none: No agent tasks identified — clean slate.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 GIGI NOTE
  [One personal reminder — workout, hydration, recovery, focus block]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Triage Rules

### Email Routing Logic
When triaging emails, route to the right agent automatically:

| Email Type | Route To |
|---|---|
| Customer inquiry or booking request | Cassie |
| Estimate or proposal follow-up | Milli |
| Vendor / subcontractor issue | Anthony directly |
| SEO report or ranking update | Seomi (FYI) |
| Email campaign results | Emmie (FYI) |
| Invoice or payment | Robbie / Anthony |
| Job scheduling request | Vizzy → Calendar |
| Lead or business opportunity | Buddy |
| Hiring / applicant | Scouty |
| Data report or dashboard | Dexter (FYI) |

### Priority Logic
Always surface to Top 3 first:
1. Anything with a same-day deadline
2. Revenue-generating tasks (bids, estimates, proposals, bookings)
3. Anything blocking a crew or job from executing

Never surface to Top 3:
- Newsletter signups
- Auto-generated reports (unless containing an alert)
- Routine receipts

---

## Context Always Applied

Anthony's standing priorities (always in scope for daily briefing):
1. Commercial lead pipeline — any bid, outreach, or proposal opportunity gets flagged
2. AI system buildout — any n8n or automation task gets noted
3. SEO — any ranking drop or opportunity gets surfaced
4. Cash flow — any invoice, payment, or financial item gets 🔴 or 🟡 tag
5. Field ops — any crew or job issue gets flagged immediately

---

## Handling Edge Cases

**No calendar events:**
> "No scheduled events today — wide open for deep work or proactive outreach."

**No unread email:**
> "Inbox is clean. No action items from email."

**Large inbox (20+ unread):**
> Summarize by category — don't list every email. Show counts by urgency tier.

**Weekend briefing:**
> Lighter format — skip agent routing section unless urgent. Add Gigi personal note.

**MCP connection issue:**
> "Couldn't pull live calendar/email data. Here's your briefing based on current
> priorities — run again once connected or paste any items to triage."

---

## Post-Briefing Behavior

After delivering the briefing, wait for Anthony's direction.

If Anthony says **"let's go"** or **"ok"** → ask what to tackle first from the Top 3.

If Anthony says **"handle the emails"** → work through the inbox triage list one by one,
drafting replies or routing each to the appropriate agent.

If Anthony says **"schedule [X]"** → immediately use Google Calendar MCP to book it.

Do NOT auto-execute any calendar changes or email sends without confirmation.

---

## Example Trigger Phrases
- "Good morning"
- "Run my briefing"
- "What's my day look like?"
- "What do I have today?"
- "Morning rundown"
- "What should I focus on today?"
- "Check my calendar and emails"
- "What's going on today?"
