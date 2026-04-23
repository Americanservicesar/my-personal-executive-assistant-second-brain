# Mistakes & Fixes Log

> Every time Claude gets something wrong or finds a better way, it logs it here.
> This is how Claude "learns" across sessions — by never making the same mistake twice.

---

## Format

- **Date:** When it happened
- **Agent:** Which agent made the mistake (Vizzy, Milli, Penn, Emmie, Soshie, Buddy, Cassie, Seomi, Scouty, Gigi, Commet, Dexter, or Claude/general)
- **What went wrong:** Description of the mistake
- **Root cause:** Why it happened
- **Fix applied:** What was changed
- **Prevention rule:** How to avoid it next time

---

## Log

### 2026-04-20 — Outbound pipeline fired on bad/stale lists, customers calling to opt out
- **Agent:** Unknown (suspects: Cassie review automation, Emmie Instantly campaign, HCP post-job automation, or a GHL workflow loop)
- **What went wrong:** Automated SMS review requests, emails, and messages went out from a prior session's pipeline. Enough customers received unwanted messages that they called in to opt out.
- **Root cause:** Not yet confirmed. Likely one of: (a) Cassie review automation hit a stale contact list, (b) HCP post-job SMS/email fired against old jobs, (c) GHL workflow looped on a tag change, (d) Emmie Instantly campaign sent to an uncleaned list, (e) scheduled n8n workflow fired without DNC gating.
- **Fix applied:**
  - Kill sequence executed manually by Anthony on n8n, HCP, GHL/Service Robot, and Instantly (all automations paused).
  - Kill-switch n8n workflow drafted at `scripts/n8n-workflows/kill_switch_deactivate_all.json` for one-button future shutdown.
- **Prevention rules:**
  - NEVER enable a scheduled/webhook-triggered outbound workflow without first verifying the contact list is scrubbed against the DNC/suppression list.
  - Every outbound automation (SMS, email, review request) MUST check a `DNC-OPTOUT` tag in GHL before firing.
  - HCP review automation stays OFF unless explicitly re-enabled per job type — do NOT run globally.
  - Before launching any Instantly campaign, run list through the Instantly blocklist + GHL `DNC-OPTOUT` tag filter.
  - Keep the kill-switch workflow deployed and pinned — one click deactivates every active workflow in n8n.
  - Root cause analysis REQUIRED before Press Start — check n8n Executions (last 24h), HCP message log, GHL conversation log for the spike source.
  - Scrub inbound opt-out callers into `DNC-OPTOUT` on every platform BEFORE re-enabling anything.

### 2026-03-31 — Gave instructions instead of executing
- **Agent:** Claude/general
- **What went wrong:** Anthony asked to fix Claude Desktop. Claude gave him a list of PowerShell commands instead of executing them directly.
- **Root cause:** Defaulted to advisory mode instead of action mode.
- **Fix applied:** None — Claude Cowork can't access the Windows file system directly.
- **Prevention rule:** Always check if Claude can execute directly before giving manual instructions. If execution isn't possible, explain WHY and offer the closest alternative. Anthony wants action, not homework.

### 2026-03-31 — Created duplicate files instead of reading existing repo first
- **Agent:** Claude/general
- **What went wrong:** Built a full new repo structure (CLAUDE.md, memory files, etc.) without first checking that Anthony already had a well-structured second-brain repo on GitHub.
- **Root cause:** Didn't ask or check for existing infrastructure before building.
- **Fix applied:** Read the existing repo via Chrome, analyzed the structure, and built complementary files that slot into the existing layout.
- **Prevention rule:** ALWAYS check what already exists before creating anything new. Search GitHub, Google Drive, and connected platforms first. Build on what's there — don't duplicate.

---

<!-- New entries go above this line, newest first -->
