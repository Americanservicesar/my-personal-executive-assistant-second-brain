---
name: GoHighLevel MCP (Service Robot)
description: GHL MCP server config for Claude direct access — endpoint, auth, location
type: reference
---

## GHL MCP Config
- **File**: `C:\Users\sales\.claude\.mcp.json`
- **Server name**: `gohighlevel`
- **Endpoint**: `https://services.leadconnectorhq.com/mcp/`
- **Auth**: Bearer `pit-9f981ca1-b6b2-4e1c-a9b0-2f39a4a81fb9`
- **Version header**: `2021-07-28`
- **Location ID**: `PQp7xlYjxZKsi0CWsSA7`

## What Claude Can Do via GHL MCP
- Contacts (create/search/update/tasks/notes)
- Conversations (SMS, email, call recordings)
- Opportunities & Pipelines
- Calendar & Appointments
- Social Media (FB, IG, LinkedIn, TikTok)
- Workflows
- Agent Studio API (build/deploy GHL voice & text agents)
- 250+ tools

## n8n Access (separate)
- All 9 agents have HTTP Request tool nodes in n8n workflow `JAYrzGWR8A0tCBzB`
- Same PIT token used as credential
- See agent_XX_*.md files for per-agent GHL scope
