# AI Operations System

## Status: LIVE — All 12 agents running in n8n

## Agents
1. Vizzy — Supervisor (routes all incoming Slack messages)
2. Milli — Sales Manager
3. Penn — Copywriter
4. Emmie — Email Marketing
5. Soshie — Social Media (Facebook live, UMA content pipeline)
6. Buddy — Business Development (86 bid boards monitored)
7. Cassie — Customer Support
8. Seomi — SEO Specialist (WordPress, Bing, Moz, PageSpeed, RankMath)
9. Scouty — Recruiter & HR
10. Gigi — Personal Growth Coach
11. Commet — eCommerce Manager
12. Dexter — Data Analyst & BI

## Infrastructure
- Platform: n8n (americanservicesar.app.n8n.cloud)
- 157 total nodes across 12 workflows
- All agents have Slack integration
- Vizzy has sub-agent routing to all 11 agents

## Next Steps
- Fix Slack trigger reply (Vizzy sends but doesnt post back to thread)
- HighLevel OAuth2 integration for Vizzy
- Gmail account separation per agent

## Key Files
- scripts/agents/ — build scripts for all 12 agents
- references/agents/ — full system messages and tool configs
- logs/api-calls/agents/ — build history

