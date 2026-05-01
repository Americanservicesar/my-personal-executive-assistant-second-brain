---
name: Vizzy Orchestrator — "Has Input?" Node Broken Expression
description: Bug fix for n8n Has Input? IF node that was crashing every Telegram execution
type: feedback
date: 2026-05-01
---
The "Has Input?" IF node (id: `has-input-guard-001`) in the Vizzy orchestrator (`JAYrzGWR8A0tCBzB`) had an invalid expression `={{ .chatInput.trim() }}` — missing `$json.` prefix. This caused every single Telegram message to error immediately before Vizzy ever ran.

**Fix applied 2026-05-01:** Changed `leftValue` to `={{ $json.chatInput.trim() }}` and set `looseTypeValidation: true`. Pushed via n8n REST API PUT.

**Why:** n8n expression syntax requires `$json.fieldName` — bare `.fieldName` is invalid in IF node conditions. The error was `invalid syntax` at the renderExpression step.

**How to apply:** Any time you edit the orchestrator workflow's IF/Switch nodes, always use `$json.` prefix for field references. Never use bare `.fieldName` shorthand in condition `leftValue` fields.
