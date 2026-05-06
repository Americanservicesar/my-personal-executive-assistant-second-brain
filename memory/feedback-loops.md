# Feedback Loops

> Append-only log tracking agent actions and outcomes.
> NEVER delete entries -- append only.
> Format: [DATE] AGENT: | ACTION: | RESULT: | LEARNED:

---

[2026-04-22] AGENT: Claude Code | ACTION: Full GitHub Brain audit -- 115 .md files reviewed, 10 empty files populated | RESULT: financials, clients, marketing, operations, ceo-performance, agent-performance, feedback-loops, emmie/segment-insights, decisions/log, current-priorities all filled with real ASAR data | LEARNED: Brain had correct structure from day 1. Pre-populating from HCP actuals + QB data gives agents real context immediately. Ongoing data population requires live agent activity.

[2026-04-22] AGENT: Penn | ACTION: SM updated with premium G/B/B pricing -- both standalone (cwyGNdgiCABHwVa3) and orchestrator | RESULT: Both SMs at 8,322 chars with full pricing table verified | LEARNED: n8n PUT to orchestrator requires stripping settings to executionOrder only. Extra fields (binaryMode, timeSavedMode, callerPolicy) cause 400 errors even though GET returns them.

[2026-04-22] AGENT: Claude Code | ACTION: Penn orchestrator SM accidentally got 6,592 chars (regex truncated at inner code block) | RESULT: Fixed by reading SM directly from Penn standalone (source of truth) | LEARNED: When .md files have nested code blocks inside SM block, regex extraction truncates at first closing backtick. Always get SM from n8n API directly.

[2026-04-21] AGENT: Vizzy | ACTION: Slack Error Log node -- fixed unguarded $('Format for Vizzy') reference | RESULT: No more crashes on Chat/MCP triggers | LEARNED: In n8n, always guard node references with $if when they depend on a specific trigger type.

[2026-04-21] AGENT: All agents | ACTION: PRESS START -- all 12 agents deployed with full SMs, tools, game plan doc references | RESULT: 12/12 active, orchestrator + all standalones live | LEARNED: Verifying SM char counts via API is faster and more reliable than n8n UI.

[2026-04-21] AGENT: Scouty | ACTION: GHL HTTP tool added -- was getting 404 on all CRM API calls | RESULT: 13 tools, CRM integration functional | LEARNED: Each agent needs its own dedicated GHL HTTP Request node with PIT token.

[2026-04-21] AGENT: Commet | ACTION: Commet-to-Dexter webhook (kAyZtGcsJ9biWh6I) deployed via API | RESULT: Webhook URL active but needs manual toggle in n8n UI | LEARNED: API-created webhooks don't auto-register -- Anthony must toggle active in UI.

[2026-04-19] AGENT: Emmie | ACTION: Instantly-to-GHL webhook (OhcsTjpdQ83Zwv9R) built | RESULT: Instantly replies auto-create GHL contacts with tags, Slack alerts | LEARNED: Instantly API Bearer token = raw base64 string, NOT decoded UUID:secret. Different from every other API convention.

[2026-04-19] AGENT: All agents | ACTION: Autonomous upgrade -- 12 game plan docs consolidated, WHO sections added | RESULT: All 12 agents have WHO/WHAT/WHERE/WHEN/HOW context on every task | LEARNED: Agents perform better when they read their game plan doc at task start -- reduces hallucination, improves tool selection.
