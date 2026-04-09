---
name: Agent Optimization Issues Checklist
description: Running checklist of issues found during 12-agent optimization — fix after all agents are done
type: project
---

## Agent Optimization — Issues to Fix After All Agents Complete

### CREDENTIALS NEEDED
- [ ] **HighLevel OAuth2** — Create `highLevelOAuth2Api` credential in n8n UI (OAuth2 app in GHL Settings → Integrations). Needed by Vizzy + any other agents that need GHL access.
- [ ] **Gmail account separation** — All 4 Vizzy Gmail nodes share one OAuth2 credential (`BzBgoySpZrWPcE09`). If each email (sales@, office@, asons@, sonsfamily2012@) needs its own credential, create 3 more Gmail OAuth2 creds in n8n.

### VIZZY (Agent 1) — Deployed, 9/12 tools live
- [ ] Add HighLevel - Contacts (Vizzy) node — waiting on `highLevelOAuth2Api` credential
- [ ] Add HighLevel - Opportunities (Vizzy) node — same
- [ ] Add HighLevel - Tasks (Vizzy) node — same
- [x] Gmail (sales@) — live
- [x] Gmail (office@) — live
- [x] Gmail (asons@) — live
- [x] Gmail (sonsfamily@) — live
- [x] SerpApi — live
- [x] Google Sheets — live
- [x] Google Drive — live
- [x] Google Docs — live (credential fixed by Anthony)
- [x] Slack Tool — live
- [x] System message updated (5,277 chars)
- [x] Test passed — correct identity, tools, agent team listed

### WORKFLOW-LEVEL ISSUES
- [ ] **Telegram→Chat path conflict** — Send Telegram Reply, Slack Telegram Log, and Slack Agent Activity nodes reference `$("Format for Vizzy")` which only exists on Telegram path. When triggered via Chat/MCP, these error out. Non-blocking but noisy. Fix: wrap expressions in `$if($("Format for Vizzy").isExecuted, ...)`.
- [ ] **Settings reset on PUT** — REST API PUT resets `availableInMCP` to false. The n8n REST API schema does NOT accept `availableInMCP` in settings — it must be re-enabled in the n8n UI after every API push. **ACTION: Re-enable availableInMCP in n8n UI now.**
- [ ] **Settings also reset** `binaryMode`, `timeSavedMode`, `callerPolicy`, `errorWorkflow` — these get dropped to defaults on PUT. Non-critical but worth re-setting in UI.

### MILLI (Agent 2) — Deployed, 12/12 core tools live
- [ ] Add HighLevel - Contacts (Milli) node — waiting on `highLevelOAuth2Api` credential
- [ ] Add HighLevel - Opportunities (Milli) node — same
- [ ] Add HighLevel - Tasks (Milli) node — same
- [ ] Add HighLevel - Calendar (Milli) node — same
- [ ] Add HTTP - GHL Conversations (Milli) node — needs GHL OAuth2
- [ ] Add HTTP - GHL Call Recordings (Milli) node — needs GHL OAuth2
- [x] Gmail (sales@) — live
- [x] Web Search — live
- [x] Google Calendar — live
- [x] Google Sheets — live
- [x] Google Drive — live
- [x] QuickBooks (read-only estimates) — live
- [x] Airtable — live
- [x] Slack — live
- [x] SerpApi — live
- [x] HTTP - Housecall Pro (Milli) — live (API key: 13317c...)
- [x] HTTP - GutterGlove (Milli) — live (https://measure.gutterglove.com/)
- [x] GitHub Brain - Milli — live (PAT: github_pat_11BWYCT3Y...)
- [x] System message updated (4,876 chars)
- [x] Description updated (470 chars)
- [x] Test passed — correct identity, tools, collaboration rules listed
### PENN (Agent 3) — Deployed, 8/8 core tools live
- [ ] Add HighLevel - Contacts (Penn) node — waiting on `highLevelOAuth2Api` credential (for customer context in personalized copy)
- [x] Gmail — live
- [x] SerpApi — live
- [x] Google Drive — live
- [x] Google Docs — live
- [x] Google Sheets — live
- [x] Slack — live
- [x] Web Search — live (RESTORED 2026-04-04 — node was missing, re-added via API)
- [x] GitHub Brain — live
- [x] System message updated (4,897 chars)
- [x] Description updated (527 chars)
- [x] Test passed — correct identity, tools, collaboration rules, A/B variant rule
### EMMIE (Agent 4) — Deployed, 8/8 core tools live
- [ ] Add HighLevel - Contacts (Emmie) node — waiting on `highLevelOAuth2Api` credential
- [ ] Add HighLevel - Tasks (Emmie) node — same
- [ ] Add HTTP - GHL Conversations (Emmie) node — needs GHL OAuth2
- [x] Gmail (sales@) — live (existing)
- [x] HTTP - Instantly API — live (API key configured)
- [x] Google Sheets — live
- [x] Google Drive — live
- [x] SerpApi — live
- [x] Airtable — live
- [x] Slack — live
- [x] GitHub Brain — live
- [x] System message updated (4,936 chars — RESTORED 2026-04-04, was truncated to 2,016 chars)
- [x] Description updated (530 chars)
- [x] Test passed — correct identity, 8 tools, collaboration rules, platform routing
### SOSHIE (Agent 5) — Deployed, 7/7 core tools live + Facebook posting
- [ ] Add HighLevel - Contacts (Soshie) node — waiting on `highLevelOAuth2Api` credential
- [x] Workflow - Ultimate Media Agent — LIVE (ID: Jy6BKTAMXyTyRokO, 64 nodes)
  - Sub-workflows: Create Image (vaOMFyrzhissdhO7), Edit Image (jcpaAH5PZiwy2cbA), Create Video (EZtbnyp1CXFdsTst), Image to Video (evLJ07WjsmQLjJYC), Create Doc (J6A0PBJSzM7p9HX0)
  - Facebook Post added natively (Meta Graph API)
  - Blotato nodes removed (IG/X/TikTok) — replaced with native when ready
  - [ ] Set up httpHeaderAuth 'OpenAI' credential in n8n for image generation
  - [ ] Set up httpHeaderAuth 'Fal' credential in n8n for video generation
  - [ ] Set up httpQueryAuth 'IMGBB' credential in n8n for image hosting
- [ ] Connect Instagram Business Account to FB Business Page (not personal) → then add IG posting node
- [ ] Add TikTok posting API — needs TikTok for Business API
- [ ] Add LinkedIn posting API — needs LinkedIn OAuth app
- [ ] Add YouTube posting — already have Google OAuth
- [x] HTTP - Facebook Post (Soshie) — LIVE, tested, post confirmed on page
- [x] Slack — live (existing)
- [x] Gmail — live (existing)
- [x] Google Sheets — live
- [x] Google Drive — live
- [x] SerpApi — live
- [x] GitHub Brain — live
- [x] System message updated (5,118 chars)
- [x] Description updated (565 chars)
- [x] Test passed — correct identity, 6 tools, 9 platforms, lead platform SLAs, collaborations
### BUDDY (Agent 6) — Deployed, 10/10 core tools live
- [ ] Add HighLevel - Contacts (Buddy) node — waiting on `highLevelOAuth2Api` credential
- [ ] Add HighLevel - Opportunities (Buddy) node — same
- [ ] Add Workflow - Browser Research Agent (P39lwRvWKkdGRYgA) — needs verification
- [x] Gmail (asons@) — live (existing)
- [x] Web Search — live (existing)
- [x] SerpApi — live
- [x] Google Calendar — live
- [x] Google Sheets — live
- [x] Google Drive — live
- [x] Google Docs — live
- [x] Airtable — live
- [x] Slack — live
- [x] GitHub Brain — live
- [x] System message updated (4,788 chars)
- [x] Description updated (591 chars)
- [x] Test passed — correct identity, 9 tools, bid boards, partnerships, lead handoff to Milli
### CASSIE (Agent 7) — Deployed, 8/8 core tools live
- [ ] Add HighLevel - Contacts (Cassie) node — waiting on `highLevelOAuth2Api` credential
- [ ] Add HighLevel - Tasks (Cassie) node — same
- [ ] Add HTTP - GHL Conversations (Cassie) node — needs GHL OAuth2
- [x] Gmail (office@) — live (existing)
- [x] Web Search — live (existing)
- [x] Airtable — live (existing)
- [x] HTTP - Housecall Pro — live
- [x] Google Sheets — live
- [x] Google Drive — live
- [x] Slack — live
- [x] GitHub Brain — live
- [x] System message updated (5,791 chars)
- [x] Description updated (633 chars)
- [x] Test passed — correct identity, 8 tools, complaint SOP, severity classification, churn detection
### SEOMI (Agent 8) — Deployed, 8/8 core tools live
- [ ] Add WordPress tool node — needs WordPress Application Password credential in n8n
- [ ] Add HTTP - Google Search Console node — needs GSC API credential
- [ ] Add HTTP - Bing Webmaster node — needs Bing API key
- [ ] Add Google Analytics tool — needs GA4 credential in n8n
- [ ] Add Workflow - Browser Agent connection — for competitor research, directory submissions
- [x] Web Search — live (existing)
- [x] SerpApi — live
- [x] Google Sheets — live
- [x] Google Drive — live
- [x] Google Docs — live
- [x] Airtable — live
- [x] Slack — live
- [x] GitHub Brain — live
- [x] System message updated (4,903 chars)
- [x] Description updated (605 chars)
- [x] Test passed — correct identity, 8 tools, AI Brand Mention Optimization, site audit focus
### SCOUTY (Agent 9) — Deployed, 10/10 core tools live
- [ ] Add HighLevel - Contacts (Scouty) node — waiting on `highLevelOAuth2Api` credential
- [x] Web Search — live
- [x] SerpApi — live
- [x] Google Calendar — live
- [x] Google Sheets — live
- [x] Google Drive — live
- [x] Google Docs — live
- [x] Airtable — live
- [x] Slack — live
- [x] GitHub Brain — live
- [x] HTTP - Housecall Pro — live
- [x] System message updated (4,009 chars)
### GIGI (Agent 10) — Deployed, 7/7 core tools live
- [x] Gmail — live
- [x] Google Sheets — live
- [x] Google Drive — live
- [x] Google Docs — live
- [x] SerpApi — live
- [x] Slack — live
- [x] GitHub Brain — live
- [x] System message updated (5,164 chars)
### COMMET (Agent 11) — Deployed, 9/9 core tools live
- [x] Web Search — live
- [x] Google Sheets — live
- [x] Google Drive — live
- [x] Google Docs — live
- [x] Airtable — live
- [x] Slack — live
- [x] GitHub Brain — live
- [x] HTTP - Housecall Pro — live
- [x] HTTP - WordPress — live
- [x] System message updated (6,108 chars)
### DEXTER (Agent 12) — Deployed, 16/16 core tools live
- [x] SerpApi — live
- [x] Google Drive — live
- [x] Google Docs — live
- [x] Airtable — live
- [x] Slack — live
- [x] GitHub Brain — live
- [x] HTTP - Housecall Pro — live
- [x] HTTP - Instantly API — live
- [x] Calculator — live
- [x] Code Tool — live
- [x] QB: Transaction Report — live
- [x] QB: Invoices — live
- [x] QB: Customers — live
- [x] QB: Items/Services — live
- [x] QB: Payments — live
- [x] QB: Expenses/Purchases — live
- [x] System message updated (6,215 chars)
