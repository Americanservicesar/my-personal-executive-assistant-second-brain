# Decision Log

Append-only. When a meaningful decision is made, log it here.

Format: [YYYY-MM-DD] DECISION: ... | REASONING: ... | CONTEXT: ...

---

[2026-03-27] DECISION: Built two n8n automation workflows — Service Robot GHL → Airtable Sync (every 6hrs) and QuickBooks → Airtable Sync (daily at 2AM) | REASONING: Dexter needs live data flowing into Airtable to run real analysis on actual business numbers. GHL contacts/opportunities and QB invoices/expenses are the first data pipelines. | CONTEXT: Airtable base appcVakRFzHQmFwnE has 6 tables. Workflow IDs: Qwg5h6pn1AR9Mj8v (GHL) and bx9dA0VTr0H6DsNd (QB). QB auto-assigned credentials. GHL HTTP nodes need manual credential config for Service Robot API Key (Header Auth with Bearer token).

[2026-04-01] DECISION: Consolidated GHL + QB sync into single ASAR Master Data Sync (no1R0fVxStQuJxNT) with true parallel branches. Archived old separate workflows. | REASONING: Both syncs feed same Airtable base, sequential wiring in old workflows meant failures blocked downstream syncs. Single workflow = easier monitoring + Error Handler catches one context. | CONTEXT: Daily 2AM CT. 4 parallel branches: GHL Contacts, GHL Opportunities, QB Invoices, QB Expenses. Future: Payroll + Jobs branches.

[2026-04-01] DECISION: Built 3 enhancement sub-workflows for Agent Team Handler instead of modifying 54-node production workflow directly. | REASONING: Agent Team Handler is active with 54 nodes — too risky to rebuild via SDK. Sub-workflows connect via toolWorkflow nodes, keeping master workflow stable. | CONTEXT: (1) ASAR Browser Research Agent (P39lwRvWKkdGRYgA) — Airtop browser tools for Scouty/Buddy. (2) ASAR Content Safety Check (dAuGDwWvEBRTQeWa) — PII/secret key sanitization for Emmie/Cassie. (3) ASAR Workflow Builder (cxLuwTE6YpNRiMXB) — Dexter can create n8n workflows from natural language.

[2026-04-01] DECISION: Stick with Airtable over n8n Data Tables for business data. | REASONING: Airtable has relational data, views, team access (Robbie can see it), API access. Data Tables are only useful for workflow-internal scratch data. | CONTEXT: 8 Nate Herk template workflows reviewed — kept as reference patterns, not activated. ZEP persistent memory deferred (needs API key).
