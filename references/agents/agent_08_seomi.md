---
name: Agent 8 - Seomi
role: Full-Stack SEO Auditor & Executor
node_name: Seomi - SEO Specialist
node_type: '@n8n/n8n-nodes-langchain.agentTool'
node_id: seomi-at
workflow_id: JAYrzGWR8A0tCBzB
model: gpt-4.1-mini (via OpenAI node seomi-mdl)
tool_count: 18
system_message_chars: 6558
last_synced: 2026-04-05
---

# Seomi — Full-Stack SEO Auditor & Executor

**Agent #8** in the ASAR Autonomous Agent Team
**Workflow**: ASAR - Autonomous Agent Team Task Handler (JAYrzGWR8A0tCBzB)
**Model**: GPT-4.1 Mini (Seomi GPT 4.1 Mini, node ID: seomi-mdl)
**Node ID**: seomi-at

## Tool Description (what Vizzy sees)
Full-Stack SEO Auditor & Executor. Manages americanservicesar.com (full admin control) + monitors 6 gutter sites. Runs automated full-site audits (technical, on-page, content, local SEO). EXECUTES fixes directly — doesn't just recommend. Builds service+city pages (13 services × 11 cities = 143 page matrix). Tracks rankings via SerpApi, monitors Core Web Vitals via PageSpeed, checks Google Search Console data, GA4 analytics, GBP insights. Crawls entire site for broken links, missing meta, thin content. AI Brand Mention Optimization. Tools: WordPress API, RankMath API, PageSpeed, Site Crawler, Search Console, GA4, GBP, SerpApi, Bing Webmaster, Moz, Broken Link Checker, Web Search, Sheets, Drive, Docs, Airtable, Slack, GitHub Brain.

## System Message (6558 chars)
Full execution-focused system message including:
- EXECUTION MINDSET: Fix problems immediately, don't just report
- Full site audit checklist (Technical, On-Page, Content, Local SEO)
- Page structure template for service+city pages
- 13 services × 11 cities keyword matrix
- AI Brand Mention Optimization strategy
- 18 tool descriptions
- Collaboration matrix (Penn, Soshie, Emmie, Buddy, Dexter)
- Slack channels: #agent-activity (C0ARKTU2HR6), #seomi-seo (C0AQV7SAXB6)

## Connected Tools (18)

| # | Tool Name | Type | Node ID | Credentials |
|---|-----------|------|---------|-------------|
| 1 | Web Search - Seomi | httpRequestTool | seomi-tl0 | Tavily API key in params |
| 2 | SerpApi - Seomi | toolSerpApi | seomi-tl1 | serpApi: W674ZSbrWCALEVEp |
| 3 | Google Sheets - Seomi | googleSheetsTool | seomi-tl2 | googleSheetsOAuth2Api: Tpo5kkkuG9qiBBvf |
| 4 | Google Drive - Seomi | googleDriveTool | seomi-tl3 | googleDriveOAuth2Api: Hu80FNVrNnpo62Fj |
| 5 | Google Docs - Seomi | googleDocsTool | seomi-tl4 | googleDocsOAuth2Api: dMFkHV4KEbioauC6 |
| 6 | Airtable - Seomi | airtableTool | seomi-tl5 | airtableTokenApi: flYD85xUURg7jDi7 |
| 7 | Slack - Seomi | slackTool | seomi-tl6 | slackOAuth2Api: lopIua3GVl7ESuOs |
| 8 | HTTP - Bing Webmaster (Seomi) | httpRequestTool | seomi-tl8 | Bing API key in params |
| 9 | HTTP - Moz API (Seomi) | httpRequestTool | seomi-tl9 | Moz Basic Auth in headers |
| 10 | HTTP - Broken Link Checker (Seomi) | httpRequestTool | seomi-tl10 | no credential |
| 11 | HTTP - WordPress (Seomi) | httpRequestTool | seomi-tl11 | WP Application Password in headers |
| 12 | HTTP - PageSpeed Insights (Seomi) | httpRequestTool | seomi-tl12 | no credential (free API) |
| 13 | HTTP - RankMath API (Seomi) | httpRequestTool | seomi-tl13 | WP Application Password in headers |
| 14 | GitHub Brain - Seomi | httpRequestTool | seomi-github-brain | GitHub API token in params |
| 15 | HTTP - Google Search Console (Seomi) | httpRequestTool | (uuid) | Requires OAuth2 Bearer token |
| 16 | HTTP - Google Analytics 4 (Seomi) | httpRequestTool | (uuid) | Requires OAuth2 Bearer token |
| 17 | HTTP - Google Business Profile (Seomi) | httpRequestTool | (uuid) | Requires OAuth2 Bearer token |
| 18 | HTTP - Site Crawler (Seomi) | httpRequestTool | (uuid) | no credential |

## Credentials Used

| Credential Type | ID | Name |
|----------------|-----|------|
| serpApi | W674ZSbrWCALEVEp | SerpAPI account |
| googleSheetsOAuth2Api | Tpo5kkkuG9qiBBvf | Google Sheets OAuth2 API |
| googleDriveOAuth2Api | Hu80FNVrNnpo62Fj | Google Drive account |
| googleDocsOAuth2Api | dMFkHV4KEbioauC6 | Google account |
| airtableTokenApi | flYD85xUURg7jDi7 | Airtable Personal Access Token account |
| slackOAuth2Api | lopIua3GVl7ESuOs | Slack OAuth2 API |

## OAuth2 Setup Required

The Google Search Console, GA4, and GBP tools require OAuth2 Bearer tokens. Options:
1. **Add scopes to existing Google OAuth2 credential** in n8n — add `https://www.googleapis.com/auth/webmasters.readonly`, `https://www.googleapis.com/auth/analytics.readonly`, `https://www.googleapis.com/auth/business.manage`
2. **Create dedicated OAuth2 credential** in n8n for Google Search APIs
3. **Use service account** with JSON key for server-to-server access

APIs must be enabled in Google Cloud Console:
- Search Console API (searchconsole.googleapis.com)
- Google Analytics Data API (analyticsdata.googleapis.com)
- My Business Business Information API (mybusinessbusinessinformation.googleapis.com)
- Business Profile Performance API (businessprofileperformance.googleapis.com)

## Capabilities Summary

### Executes Directly
- Create/edit WordPress pages and posts
- Update SEO meta (title, description, focus keyword) via RankMath
- Add/update schema markup (LocalBusiness, Service, FAQ, BreadcrumbList)
- Fix broken internal links
- Expand thin content
- Publish new service+city pages
- Set categories, tags, slugs

### Audits Automatically
- Full technical SEO (PageSpeed, Core Web Vitals, crawl errors)
- On-page SEO (meta tags, headings, images, internal links)
- Content quality (word count, freshness, duplication)
- Local SEO (NAP, schema, GBP)
- Content gap analysis (143-page matrix)
- Rank tracking (SerpApi + Bing)
- Backlink/DA analysis (Moz + Bing Webmaster)

### Reports To
- #seomi-seo Slack channel — detailed SEO updates
- #agent-activity — all actions logged
- Google Sheets — content matrix tracking
- GitHub Brain — persistent audit findings

## Position in Canvas
x: 2336, y: 224
