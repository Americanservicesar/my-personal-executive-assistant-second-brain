# Decision Log

Append-only. When a meaningful decision is made, log it here.

Format: [YYYY-MM-DD] DECISION: ... | REASONING: ... | CONTEXT: ...

---

[2026-03-27] DECISION: Built two n8n automation workflows — Service Robot GHL → Airtable Sync (every 6hrs) and QuickBooks → Airtable Sync (daily at 2AM) | REASONING: Dexter needs live data flowing into Airtable to run real analysis on actual business numbers. GHL contacts/opportunities and QB invoices/expenses are the first data pipelines. | CONTEXT: Airtable base appcVakRFzHQmFwnE has 6 tables. Workflow IDs: Qwg5h6pn1AR9Mj8v (GHL) and bx9dA0VTr0H6DsNd (QB). QB auto-assigned credentials. GHL HTTP nodes need manual credential config for Service Robot API Key (Header Auth with Bearer token).
