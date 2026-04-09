---
name: n8n API Access
description: REST API key location and workflow update pattern for americanservicesar.app.n8n.cloud
type: reference
---

- n8n instance: `americanservicesar.app.n8n.cloud`
- API key location: `C:\Users\sales\OneDrive\Documents\n8n-env-template.txt` (line 43)
- Main workflow ID: `JAYrzGWR8A0tCBzB` (Autonomous Agent Team Task Handler)
- Update pattern: GET current state → modify nodes/connections in Python → re-apply all credentials → PUT via REST API
- PUT requires `settings.executionOrder: 'v1'` and all nodes must have valid credentials assigned
- GET responses strip credential bindings — must re-apply from known credential IDs on every PUT
- n8n MCP SDK code tools (`validate_workflow`, `update_workflow`) are broken as of 2026-04 — use REST API instead
