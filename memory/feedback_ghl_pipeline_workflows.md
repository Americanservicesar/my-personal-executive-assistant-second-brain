---
name: GHL Pipeline Workflow Design Intent
description: How RMP stage workflows should behave — published always, backfill contacts suppressed via tag filter, not by drafting workflows
type: feedback
originSessionId: c198d29b-c00c-41d1-ad87-0677e73fc7e3
---
Keep ALL RMP stage workflows (1–9) PUBLISHED at all times. Never draft them to stop messages.

**Why:** Drafting workflows breaks the pipeline for real customers. Stages and pipelines should always be live. The fix for backfill contacts is a TAG FILTER inside each workflow, not workflow status.

**How to apply:** When hcp-backfill contacts are synced into GHL pipeline stages, they should NOT trigger SMS/email sequences. The correct approach is one of:
1. Add a condition at the start of each RMP workflow: IF contact has tag `hcp-backfill` → Stop workflow (skip all actions)
2. DND is already set on 482 hcp-backfill contacts — this blocks delivery even if workflow fires (acceptable short-term fix)
3. When a backfill contact becomes a real active customer (new job booked), remove the `hcp-backfill` tag and/or DND so they re-enter sequences naturally

Natural stage movement (real customer progressing through pipeline) should ALWAYS trigger the full sequence regardless of this.
