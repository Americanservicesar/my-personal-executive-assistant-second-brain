---
name: QB Data Persistence — Always Save to Master Sheet
description: Every QB data pull must be appended to a master sheet so other agents don't re-pull live data
type: feedback
originSessionId: c9247327-3286-4c3e-b098-877979335ec0
---
Always append QB data to a master Google Sheet when pulling from QBO, so other agents can read cached data instead of re-pulling live.

**Why:** Live QB pulls are slow and hit rate limits. All 12 agents need financial data access. Central sheet = single source of truth across agent ecosystem.

**How to apply:**
- Every time QB data is pulled (via webhook, n8n, or MCP), append a row to the QB Data Log sheet with the pull date and key figures
- Structure: date_pulled, period, total_income, gross_profit, net_income, open_ar, overdue_ar, total_assets, total_liabilities, equity
- Other agents read from this sheet rather than calling QB directly
- QB Data Log lives in the Dexter Google Sheet (ID: `1i8fRWY9X00OW9NlxWD65BPj54j7IBunw8xSTSTJO2FY`) on a tab called "QB Data Log"
