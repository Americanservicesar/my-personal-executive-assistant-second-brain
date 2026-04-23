---
name: Feedback Loops
description: Learnings, corrections, and process improvements from real sessions — what worked, what failed, what changed
last_updated: 2026-04-22
type: memory
---
# Feedback Loops — Real Session Learnings

## 2026-04-22 — Gmail monitors + Cron build session

### What worked
- cron_agent_workflow() and gmail_agent_workflow() helper functions — clean pattern, reusable
- All 5 workflows built and activated in one Python script run
- Gmail trigger type confirmed as gmailOAuth2 (not googleOAuth2Api)
- typeVersion for scheduleTrigger: 1.2, set: 3.4, executeWorkflow: 1.1

### What failed
- Emoji characters in Python print() on Windows — UnicodeEncodeError (cp1252 codec)
  Fix: strip all non-ASCII before running, or set PYTHONIOENCODING=utf-8
- Script ran twice due to encode error midway — created duplicate workflows
  Fix: always check for duplicates before activating. Delete dupes immediately.
- curl with -s -X DELETE returns workflow JSON on success (not empty 200)
  The && pattern works correctly — if JSON returned, delete succeeded

### Key discovery
First partial run actually created ALL workflows (not just the 2 before the crash).
The crash was on the print() statement BEFORE the API calls for WF3-5.
But because the file I wrote had the em-dash/arrow chars in the workflow NAMES (passed to API),
those chars made it through correctly. The crash was only on Python's console output.
Result: Two sets of identical workflows. Delete the second set (the ? versions).

---

## 2026-04-22 — Autonomous workflow audit

### Discovered autonomy gaps (now fixed)
- Vizzy 6AM briefing was an empty shell (0 nodes)
- No Gmail monitoring on sales@, office@, asons@
- Buddy had no scheduled bid check (reactive only)
- ASAR Master Data Sync: 8 nodes broken, cannot activate

### Now fixed
- Vizzy 6AM Daily Briefing: fires daily → calls Dexter for morning report
- Buddy Weekly Bid Check: Mon+Thu 8AM → Buddy scans AR procurement portals
- Gmail Monitor sales@: every new email → Milli agent
- Gmail Monitor office@: every new email → Cassie agent
- Gmail Monitor asons@: every new email → Buddy agent

---

## 2026-04-22 — Penn SM sync

### What happened
Penn's orchestrator system message was truncated to 6,592 chars.
Root cause: regex hit inner ``` in the HANDOFF format example inside the SM.
Fix: pull SM from standalone (source of truth) via n8n API, PUT to orchestrator.
Both now 8,322 chars. Never use regex to parse SM from markdown files.

---

## 2026-04-22 — GitHub Brain population

### 10 files populated with real ASAR data
- context/current-priorities.md
- decisions/log.md
- memory/financials.md (YTD $68,142, 71% GM, 25.6% NM)
- memory/marketing.md
- memory/operations.md
- memory/clients.md
- memory/ceo-performance.md
- memory/agent-performance.md
- memory/feedback-loops.md
- memory/emmie/segment-insights.md (all 12 ASAR segments)

### Sales playbook completed
- 17,902 chars
- NEPQ framework (Jeremy Miner 7th Level — 85% engagement/10% presentation/5% close)
- 7 winning pitch angles by segment
- 8 qualifying questions
- 11 objections with full NEPQ response scripts
- 9 proposal rules
- Full G/B/B pricing intelligence table
- HCP actuals (798 jobs, 92% win rate)
- Data gaps clearly flagged (live close rates, proposal win/loss not yet tracked)

---

## 2026-04-21 — G/B/B Premium Pricing

### Anthony approved 2026-04-21
13 services x 3 tiers (Good/Better/Best)
$300 absolute minimum on every job
Always quote BETTER or BEST first
ASAR prices ABOVE market high (verified by Dexter competitor research Apr 2026)
92% estimate-to-job conversion rate (798 jobs, 870 estimates)

### Key pricing rules for agents
1. Always quote BETTER or BEST first
2. Never quote below GOOD without Anthony approval
3. $300 minimum — bundle or decline if below
4. Commercial: package pricing only, never per-sqft
5. Fleet contracts: quote per-visit, then offer monthly at 15-20% discount to close
6. Gutter/roof: RoofSnap or GutterGlove measurements required before ANY quote

---

## 2026-04-19 — Agent handoff architecture

### Dual SM rule
Every agent has TWO system messages:
1. Standalone SM (in the agent's standalone n8n workflow)
2. Orchestrator SM (in the Vizzy orchestrator node for that agent)
Both must be kept in sync. When updating an agent's instructions, update BOTH.

### Standalone vs orchestrator paths
Standalone path (Claude MCP or direct call): executeWorkflow -> agent standalone
Orchestrator path (Telegram/Chat): Vizzy routes based on HANDOFF REQUEST block in response

### HANDOFF REQUEST format (orchestrator path)
HANDOFF REQUEST -> [Agent Name]
Task: [specific task]
Context: [all context the receiving agent needs]
Priority: HIGH / MEDIUM / LOW

---

## 2026-04-17 — QB fixed

### QuickBooks root cause
Intuit Developer app "ClaudeCode" was in Development mode.
Dev apps = sandbox only. Cannot connect to real QB company in dev mode.
Fix: Intuit Go Live compliance -> Production mode -> update redirect URI -> re-auth n8n credential.
QB is now permanently fixed (tokens auto-refresh, no manual reconnect needed).

---

## 2026-04-10 — GHL workflow audit

### 79 workflows audited
9-stage RMP (Revenue Management Pipeline) mapped
Key active workflows: HCP Webhook Router, Review Engine, Estimate Engine, New Lead Greeting
GHL MCP confirmed: PIT token pit-9f981ca1-b6b2-4e1c-a9b0-2f39a4a81fb9
GHL n8n credential: xthsN1QtUv1W9Vtr (httpHeaderAuth)

---

## Recurring patterns

### Always check memory before asking Anthony
Memory + master credentials sheet has all API keys, tokens, and workflow IDs.
Never ask Anthony for a credential that may already be documented.

### Verify before reporting as pending
Tasks completed between sessions get re-reported as pending.
Always check actual API state before listing something as "still needs to be done".
QB, sending accounts, ASAR-01 campaign — all were "pending" in notes but already live.

### Update memory immediately when something completes
Don't let completed steps stay as "pending" in memory.
Wrong: "QB needs reconnecting" (stale, was fixed 2026-04-17)
Right: "QB resolved 2026-04-17, credential T1Uyc7utOiuqYJWO connected to realmId 123146373988304"
