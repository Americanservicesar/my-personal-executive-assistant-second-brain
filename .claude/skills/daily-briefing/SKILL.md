---
name: daily-briefing
description: >
  Delivers a structured daily operations briefing for Anthony by pulling live data
  from Google Calendar and Gmail, then combining it with current priorities and
  agent routing. Use this skill whenever Anthony wants a morning briefing, daily
  summary, or overview of what's on his plate. Trigger for requests like "give me
  my briefing", "what does my day look like", "morning briefing", "what's on my
  calendar today", "what do I need to focus on today", "catch me up", "what's
  happening today", "run my briefing", "daily update", or any variation asking
  for a combined view of schedule, email, and priorities. Also trigger first thing
  in the morning when Anthony opens a new session — proactively run the briefing
  without being asked if no prior context exists in the conversation.
---

# Daily Briefing

Pulls live data from Google Calendar and Gmail, then delivers a crisp daily
operations briefing covering schedule, email priorities, focus for the day,
and any agent actions needed.

---

## Workflow

### Step 1 — Pull Live Data (run all three in parallel)

**Calendar — Today's events:**
```
gcal_list_events(
  timeMin = today 00:00:00 CT,
  timeMax = today 23:59:59 CT,
  timeZone = America/Chicago
)
```

**Calendar — Tomorrow preview:**
```
gcal_list_events(
  timeMin = tomorrow 00:00:00 CT,
  timeMax = tomorrow 23:59:59 CT,
  timeZone = America/Chicago
)
```

**Gmail — Unread priority emails (check ALL business accounts):**
```
# Check sales@americanservicesar.com
gmail_search_messages(
  q = "is:unread -category:promotions -from:amazon.com -from:paddle.com to:sales@americanservicesar.com",
  maxResults = 10
)

# Check office@americanservicesar.com
gmail_search_messages(
  q = "is:unread -category:promotions -from:amazon.com to:office@americanservicesar.com",
  maxResults = 10
)

# Check asons@americanservicesar.com
gmail_search_messages(
  q = "is:unread -category:promotions -from:amazon.com to:asons@americanservicesar.com",
  maxResults = 10
)

# Check sonsfamily2012@gmail.com (family — flag events and personal items)
gmail_search_messages(
  q = "is:unread -category:promotions to:sonsfamily2012@gmail.com",
  maxResults = 5
)
```

**Family Calendar — Check for upcoming events:**
```
gcal_list_events(
  calendarId = "sonsfamily2012@gmail.com",
  timeMin = today 00:00:00 CT,
  timeMax = today+7 23:59:59 CT,
  timeZone = America/Chicago
)
```

---

### Step 2 — Classify Email

Sort unread emails into three buckets:

**🔴 Needs Action** — Leads, customer replies, bids, invoices, anything requiring a response
**🟡 Review** — Newsletters, digests, order updates worth scanning
**⚪ Noise** — Promotions, automated receipts, marketing — skip entirely

Rules:
- Amazon shipping confirmations → skip (noise)
- Promotional emails → skip (noise)
- Anything from a real person or company → flag
- Bid alerts, RFP notices → 🔴 immediately
- Customer or lead messages → 🔴 immediately
- Tool receipts / subscription notices → 🟡 only if amount is unexpected

---

### Step 3 — Build the Briefing

Deliver in this exact format:

---

## 🌅 Daily Briefing — [Day], [Date]
*Generated [time] CT*

### 📅 Today's Schedule
[List each event with time and any prep note if relevant]
→ If calendar is clear: "No scheduled events — open day, good for deep work."

### 📬 Email — Needs Action ([count])
[For each 🔴 email: Sender | Subject | One-line summary | Suggested action]
→ Route to agent if applicable (Cassie for customer, Milli for leads, etc.)

### 📬 Email — Worth Reviewing ([count])
[Brief list only — sender and subject, no detail]

### 🎯 Today's Focus
Based on current priorities, the top 3 things to move forward today:
1. [Most critical item from current-priorities.md]
2. [Second priority]
3. [Third — often a quick win or scheduled task]

### ⚡ Agent Actions
Any tasks that should be routed today:
- **→ [Agent]**: [Task]

### 📌 On the Radar
Upcoming items in the next 48–72 hours worth knowing about now.

---

### Step 4 — Tone & Length Rules

- Total briefing: under 300 words
- No bullet padding — every line earns its place
- If nothing urgent in email: say so clearly, don't list noise
- If calendar is empty: say so, suggest what to use the open time for
- Never list Amazon shipping emails or promotional emails in the briefing
- Flag anything business-critical immediately at the top with 🚨

---

## Priority Context

Anthony's standing priorities (from context/current-priorities.md):
1. Scale commercial & industrial work → $5K–$50K projects
2. Build AI-first operations system → n8n agents
3. Local SEO domination → 7 AR websites
4. Automate lead generation → always-on pipeline
5. Financial optimization → cash flow + owner pay

Use these to frame "Today's Focus" — connect the open day to what moves the needle.

---

## Agent Routing for Email Actions

| Email Type | Route To |
|---|---|
| Customer complaint / question | → Cassie |
| New lead inquiry | → Milli |
| Marketing / campaign task | → Emmie or Soshie |
| Bid / RFP opportunity | → Buddy + Penn |
| SEO / website task | → Seomi |
| Data / reporting question | → Dexter |
| Recruiting / hiring | → Scouty |
| Family event / personal | → Gigi |
| HomeAdvisor/Thumbtack/Nextdoor lead | → Milli + Soshie |

## Email Account Routing

| Account | Route Priority |
|---------|---------------|
| sales@ | Milli (leads), Emmie (campaign replies) |
| office@ | Cassie (support), Vizzy (operations) |
| asons@ | Buddy (partnerships), Vizzy (executive) |
| sonsfamily2012@ | Gigi (family events), add to family calendar |
| Instantly replies | Emmie monitors → warm leads to Milli |

---

## Example Trigger Phrases
- "Morning briefing"
- "What does my day look like?"
- "Catch me up"
- "Run my daily update"
- "What's on my plate today?"
- "Give me a briefing"

---

## Learning Protocol

1. **Before briefing:** Check `memory/feedback-loops.md` for any unresolved items from yesterday
2. **Before briefing:** Check `memory/agent-performance.md` for any stalled metrics to flag
3. **During briefing:** If the same priority appears unaddressed for 3+ days, escalate it with a warning
4. **After briefing:** Log what was planned in today's briefing to `memory/feedback-loops.md`
5. **End of day (if triggered):** Compare planned vs accomplished; log patterns to `memory/ceo-performance.md`
6. **Weekly:** Flag if any email account consistently has unread items piling up — suggests a routing gap
