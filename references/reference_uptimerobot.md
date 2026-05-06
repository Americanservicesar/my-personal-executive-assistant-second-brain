---
name: UptimeRobot — API Key + Monitor
description: UptimeRobot API key, monitor ID for americanservicesar.com, and MCP configuration details
type: reference
originSessionId: 022c526e-77b1-4867-8d43-ff7cfe6756ff
---
## Credentials

| Field | Value |
|---|---|
| Account email | asons@americanservicesar.com |
| API Key (Main) | `u3484410-fb9298cd9291f9f7663d70be` |
| Dashboard | https://dashboard.uptimerobot.com |
| Integrations/API | https://dashboard.uptimerobot.com/integrations |

## Monitor — americanservicesar.com

| Field | Value |
|---|---|
| Monitor ID | `803003902` |
| URL | https://americanservicesar.com |
| Type | HTTP |
| Interval | 5 minutes |
| Status as of 2026-05-06 | UP |

## MCP Configuration (added to .mcp.json 2026-05-06)

```json
"uptimerobot": {
  "command": "npx",
  "args": [
    "-y", "mcp-remote",
    "https://mcp.uptimerobot.com/mcp",
    "--header", "Authorization: Bearer u3484410-fb9298cd9291f9f7663d70be",
    "--header", "X-MCP-Content-Format: true"
  ]
}
```

## Usage

- Check if site is down: "Show me all monitors that are currently down"
- Check uptime stats: "What's the availability of americanservicesar.com this month?"
- List recent incidents: "What incidents occurred in the last 24 hours?"
- Monitor ID for direct queries: `803003902`

## Notes

- API key added to Master Credentials Sheet (Sheet1 rows 6-7) on 2026-05-06
- Alert contacts: confirm email alerts are configured in dashboard
