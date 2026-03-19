---
name: version
description: >
  Displays the current version of the Executive Assistant Second Brain system,
  including version number, last updated dates for key context files, active
  skills, and a quick system health summary. Use this skill when Anthony wants
  to know the system version, check what's been updated, or get a snapshot of
  the brain's current state. Trigger for requests like "what version is this",
  "show version", "system info", "what version am I on", or "/version".
---

# Version

Displays the current system version and a snapshot of the brain's state.

---

## Workflow

### Step 1 — Read Version File

Read `VERSION` from the project root to get the current version number.

### Step 2 — Check Last-Modified Dates

Report the last-updated timestamp for each key context file:
- `context/me.md`
- `context/work.md`
- `context/team.md`
- `context/current-priorities.md`
- `context/goals.md`

Use the `Last updated:` line inside the file if present, otherwise note "no date recorded."

### Step 3 — List Active Skills

List all skills found in `.claude/skills/` (one per line).

### Step 4 — Output the Version Report

Deliver in this exact format:

---

## System Version

**Brain Version:** [version from VERSION file]
**Report Generated:** [today's date, CT]

---

### Context Files

| File | Last Updated |
|---|---|
| me.md | [date or "no date recorded"] |
| work.md | [date or "no date recorded"] |
| team.md | [date or "no date recorded"] |
| current-priorities.md | [date or "no date recorded"] |
| goals.md | [date or "no date recorded"] |

---

### Active Skills

[List each skill name, one per line, prefixed with `•`]

---

### Notes

- To update the version number, edit the `VERSION` file in the project root.
- To update context, edit the relevant file in `context/`.
- Skills live in `.claude/skills/` — one folder per skill with a `SKILL.md` inside.

---

## Example Trigger Phrases
- "/version"
- "What version is this?"
- "Show me the system version"
- "System info"
- "What version am I on?"
