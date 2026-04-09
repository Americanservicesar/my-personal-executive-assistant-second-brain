---
name: Next Session Resume Point
description: Everything needed to continue from where we left off
type: project
last_updated: 2026-04-04
---

## SESSION SUMMARY (2026-04-04)
All 12 agents built and deployed. 140 nodes. But some agents lost tools during pushes.

## CRITICAL FIXES NEEDED FIRST
1. **Emmie** — System message wiped to 613 chars (should be ~4,840). Only 2 tools (should be 9). Need full rebuild of Emmie's tools: Instantly API, Sheets, Drive, SerpApi, Airtable, GitHub Brain
2. **Scouty** — Only 2 tools (should be 10). Need: Calendar, Sheets, Drive, Docs, SerpApi, Airtable, HCP, GitHub Brain
3. **Seomi** — Missing WordPress, PageSpeed, RankMath nodes (added then lost)
4. **All agents** — Do a FULL AUDIT of tool connections vs what should be there

## ROOT CAUSE
When fetching workflow state before a push, sometimes the GET returns a version before the previous push was fully saved (eventual consistency). The new push then overwrites with the stale state, deleting recently-added nodes.

## FIX APPROACH
Build ONE comprehensive script that:
1. Fetches current state
2. Checks every agent has all expected tools
3. Adds any missing tools
4. Pushes ONCE
This avoids the sequential push problem.

## BUILD THESE NEW ITEMS
1. **Slack trigger workflow** — Listen to #vizzy-command, forward to Vizzy, reply in Slack
2. **Scheduled automation workflows**:
   - Daily Briefing (7AM → Vizzy → Slack)
   - Daily Market Pulse (6AM → OpenAI → Buddy → Slack)
   - Weekly SEO Audit (Sunday → Seomi → Slack)
   - Weekly CEO Dashboard (Monday → Dexter → Slack)
3. **Agent detail docs in Google Drive** — one doc per agent for Anthony to edit
4. **GitHub backup** of all agent configs
5. **Google Doc checklist** of incomplete items per agent

## PENDING CREDENTIALS
- GHL OAuth2 (blocks 8 agents)
- Google Search Console API (may be enabled, needs OAuth node or sub-workflow)
- Google Analytics 4 API (needs enabling + connection)
- Instagram Business Account (link to FB page)
- Fal.ai API key (for UMA creative tools)
- IMGBB API key (for UMA image hosting)
- Copyscape Premium ($5 deposit)

## REFERENCE FILES
- Agent checklist: project_agent_issues_checklist.md
- SEO audit: project_seo_audit_results.md
- SEO silo: reference_seo_silo_structure.md (71,000 chars)
- SEO knowledge base: reference_seo_knowledge_base.md
- SEO tools: reference_seo_tools.md
- Bid boards: reference_arkansas_bid_boards.md
- Slack channels: reference_slack_channels.md
- Shared drives: reference_shared_drives.md
- Master credentials: https://docs.google.com/spreadsheets/d/17Waiy2_1t0JJ3B0KgHPde-ZJRweg27WexyTp2l3i4tI
- Keyword research: https://docs.google.com/spreadsheets/d/1pNyOkUIXnFtU4F7oS05KrqWMHtp0536cVfVsv1ODHYA
- Bid board master list: https://docs.google.com/spreadsheets/d/1XILoVv9zbEvjrb7hch9J7vZ5lo3u9_LxWgK5MBWw31A
- Agent checklist doc: https://docs.google.com/document/d/1UDDgfWHxeQfMUl_g4LcCZC0tpUktJLTbhtlVI8U0C2k
- SEO knowledge base doc: https://docs.google.com/document/d/1EewYGbo8o7J0wfZTyhUxzyTpvk-zkUFJkwLEEWox9qI
- SEO silo doc: https://docs.google.com/document/d/1J6VOWvzdwH_I5SeHTIiJFP3kWf6EJcIlg0fEmpK_YYg
- UMA workflow ID: Jy6BKTAMXyTyRokO
- Main workflow ID: JAYrzGWR8A0tCBzB
