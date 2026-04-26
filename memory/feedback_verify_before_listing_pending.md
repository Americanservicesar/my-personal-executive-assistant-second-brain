---
name: Always Verify Before Listing Pending Items
description: Never list tasks as pending without first checking current state — user may have completed them in another session
type: feedback
---

Always verify the actual current state of any "pending" task before reporting it as pending. Check n8n credentials, workflow nodes, GHL settings, HCP config, etc. before telling Anthony something is still to-do.

**Why:** Anthony often completes tasks between sessions. Listing already-done items as pending wastes time and is inaccurate.

**How to apply:**
- Before summarizing pending work, run verification checks (API calls, credential lookups, workflow node inspection)
- Only mark something pending after confirming it is actually not done
- Same rule applies at session start when resuming — verify state, don't assume it matches last session's notes
