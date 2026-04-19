---
name: Agent 8 - Seomi
role: Full-Stack SEO Auditor & Executor
node_name: Seomi - SEO Specialist
node_type: '@n8n/n8n-nodes-langchain.agentTool'
node_id: e997ed62-61d7-46de-994f-f0e7793e32dd
workflow_id: JAYrzGWR8A0tCBzB
model: claude-sonnet-4-6 (via Anthropic, credential: MGVdxOb43c7vfSd2)
tool_count: 14
game_plan_doc: 1ISFb5BQtaKvymizuFGom6DP-bUMnsPLvr2Jm43O16fk
last_synced: 2026-04-17
originSessionId: ccb3e528-01da-49dc-b07e-762b0b0108ff
---
# Seomi — Full-Stack SEO Auditor & Executor

**Agent #8** in the ASAR Autonomous Agent Team
**Workflow**: ASAR - Autonomous Agent Team Task Handler (JAYrzGWR8A0tCBzB)
**Node ID**: e997ed62-61d7-46de-994f-f0e7793e32dd

## Operational Game Plan (Living Instructions)
- **Google Doc**: https://docs.google.com/document/d/1ISFb5BQtaKvymizuFGom6DP-bUMnsPLvr2Jm43O16fk/edit
- **Doc ID**: `1ISFb5BQtaKvymizuFGom6DP-bUMnsPLvr2Jm43O16fk`
- **Location**: Agent Reference Docs > Seomi — SEO Specialist (folder: `1G_7_qqKaiO-j6Ip_vPcQuISc4mopmoel`)
- Seomi reads this doc at the start of each task run
- Edit the Google Doc to change Seomi's behavior — do NOT rely only on the n8n system message

## Drive Folders
- **Agent Reference Docs/Seomi — SEO Specialist**: `1G_7_qqKaiO-j6Ip_vPcQuISc4mopmoel` — game plan doc, agent reference
- **MARKETING/SEO — Seomi**: `188PlmDSNX89nNH4w-HUB8zpwzYOzBz0E` — SEO content, audits, drafts, GBP docs

## n8n System Message Status
- **Current**: 4751 chars — UPDATED 2026-04-17
- **Key change**: Leads with "read game plan Google Doc before ANY task" instruction
- **Doc ID referenced**: `1ISFb5BQtaKvymizuFGom6DP-bUMnsPLvr2Jm43O16fk`
- **Status**: COMPLETE ✅

## Tool Description (what Vizzy sees)
Full-Stack SEO Auditor & Executor. Manages americanservicesar.com (full admin control) + monitors 6 gutter sites. Runs automated full-site audits (technical, on-page, content, local SEO). EXECUTES fixes directly — doesn't just recommend. Builds service+city pages (13 services x 11 cities = 143 page matrix). Tracks rankings via SerpApi, monitors Core Web Vitals via PageSpeed, checks Google Search Console data, GA4 analytics, GBP insights. Crawls entire site for broken links, missing meta, thin content. AI Brand Mention Optimization. Tools: WordPress API, RankMath API, PageSpeed, Site Crawler, Search Console, GA4, GBP, SerpApi, Bing Webmaster, Moz, Broken Link Checker, Web Search, Sheets, Drive, Docs, Airtable, Slack, GitHub Brain.

## Connected Tools (14)

| # | Tool Name | Type | Node ID | Credentials |
|---|-----------|------|---------|-------------|
| 1 | Web Search - Seomi | httpRequestTool | 9ce17e77-42e... | Tavily API key in params |
| 2 | SerpApi - Seomi | toolSerpApi | d210600d-f47... | serpApi: W674ZSbrWCALEVEp |
| 3 | Google Sheets - Seomi | googleSheetsTool | 775a51c8-888... | googleSheetsOAuth2Api: Tpo5kkkuG9qiBBvf |
| 4 | Google Drive - Seomi | googleDriveTool | e2ef3c33-aaa... | googleDriveOAuth2Api: Hu80FNVrNnpo62Fj |
| 5 | Google Docs - Seomi | googleDocsTool | b8cd634f-b9d... | googleDocsOAuth2Api: dMFkHV4KEbioauC6 |
| 6 | Airtable - Seomi | airtableTool | a351703b-009... | airtableTokenApi: flYD85xUURg7jDi7 |
| 7 | Slack - Seomi | slackTool | c762265b-9ed... | slackOAuth2Api: lopIua3GVl7ESuOs |
| 8 | GitHub Brain - Seomi | httpRequestTool | 5e5b1f5f-b92... | GitHub API token in params |
| 9 | HTTP - Bing Webmaster (Seomi) | httpRequestTool | adea4f9b-1ad... | Bing API key in params |
| 10 | HTTP - Moz API (Seomi) | httpRequestTool | 0b121eea-f49... | Moz Basic Auth in params |
| 11 | HTTP - Broken Link Checker (Seomi) | httpRequestTool | 70813160-087... | no credential |
| 12 | HTTP - WordPress (Seomi) | httpRequestTool | 57ed76ac-958... | WP Application Password in params |
| 13 | HTTP - PageSpeed Insights (Seomi) | httpRequestTool | 23811a44-824... | no credential (free API) |
| 14 | HTTP - RankMath API (Seomi) | httpRequestTool | 4b2feade-e34... | WP Application Password in params |

Note: GSC, GA4, and GBP tools exist as HTTP request tools but OAuth2 tokens still need to be confirmed working (see feedback_seomi_setup.md).

## Credentials Used

| Credential Type | ID | Name |
|----------------|-----|------|
| serpApi | W674ZSbrWCALEVEp | SerpAPI account |
| googleSheetsOAuth2Api | Tpo5kkkuG9qiBBvf | Google Sheets OAuth2 API |
| googleDriveOAuth2Api | Hu80FNVrNnpo62Fj | Google Drive account |
| googleDocsOAuth2Api | dMFkHV4KEbioauC6 | Google account |
| airtableTokenApi | flYD85xUURg7jDi7 | Airtable Personal Access Token account |
| slackOAuth2Api | lopIua3GVl7ESuOs | Slack OAuth2 API |
| anthropicApi | MGVdxOb43c7vfSd2 | Anthropic account |

## Slack Channels
- #agent-activity (C0ARKTU2HR6) — log ALL actions
- #seomi-seo (C0AQV7SAXB6) — detailed SEO updates
- #penn-copy (C0AQPHX6FGW) — content requests to Penn
- #soshie-social (C0AQPHWS094) — GBP keyword coordination
- #buddy-bizdev (C0AR4GT2WRX) — competitor intel requests
- #emmie-email (C0AQPHWR26S) — blog to email coordination

## Position in Canvas
x: 2336, y: 224
