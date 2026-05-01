---
name: HCP Webhook Router — estimate.option.created Must Not Trigger Stage Change
description: Bug where G/B/B estimate creation moved GHL contacts to "Estimate Sent" prematurely
type: feedback
last_updated: 2026-05-01
---
`estimate.option.created` must be mapped to `null` (no stage change) in the HCP Webhook Router EVENT_STAGE_MAP. It was previously mapped to `'estimate_sent'`, causing GHL contacts to jump to "Estimate Sent" the moment HCP options were created — before Anthony ever reviewed or sent the estimate.

**Why:** HCP fires `estimate.option.created` once per option when an estimate is built. A G/B/B estimate fires it 3 times. Each fire was triggering a GHL pipeline stage move. The correct trigger for "Estimate Sent" is only `estimate.sent` — when Anthony physically clicks Send in HCP.

**Correct EVENT_STAGE_MAP entries (4XY3iZmgB6jm4YlD — Parse HCP Event node):**
- `estimate.created` -> `estimate_scheduled`
- `estimate.option.created` -> `null` (no stage change)
- `estimate.sent` -> `estimate_sent`
- `estimate.option.approval_status_changed` (approved) -> `estimate_approved`
- `estimate.copy_to_job` -> `job_scheduled`

**How to apply:** Any time the HCP Webhook Router is edited, never map option-creation events to pipeline stages. Only `estimate.sent` should move the stage to Estimate Sent.
