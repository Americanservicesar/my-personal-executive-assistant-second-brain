# n8n Automation Pipelines

**Status:** Active
**Instance:** americanservicesar.app.n8n.cloud

## Production Workflows

| Workflow | ID | Status | Schedule | Purpose |
|---|---|---|---|---|
| Autonomous Agent Team Task Handler | JAYrzGWR8A0tCBzB | **Active** | Chat trigger | Master workflow — 12 AI agents (Vizzy + team) |
| Error Handler - Self Healing AI | TL5bO1l7QCI3XIAm | **Active** | Error trigger | Auto-repairs failing workflows |
| ASAR Master Data Sync | no1R0fVxStQuJxNT | Inactive | Daily 2AM CT | GHL + QB → Airtable (parallel branches) |
| ASAR Browser Research Agent | P39lwRvWKkdGRYgA | Inactive | Sub-workflow | Airtop browser tools for Scouty/Buddy |
| ASAR Content Safety Check | dAuGDwWvEBRTQeWa | Inactive | Sub-workflow | PII/secret key sanitization for Emmie/Cassie |
| ASAR Workflow Builder | cxLuwTE6YpNRiMXB | Inactive | Sub-workflow | Dexter creates workflows from natural language |
| Vizzy 6AM Daily Briefing | 3a8Wv9UQjSWgZ8Pn | Inactive | 6AM CT | Not yet built — needs Google OAuth in n8n |
| TEST - Intentional Bug | gafLswJn5R6uokwh | Inactive | Manual | Error Handler testing tool |

## Archived Workflows
- Service Robot GHL → Airtable Sync (Qwg5h6pn1AR9Mj8v) — replaced by Master Data Sync
- QuickBooks → Airtable Sync (bx9dA0VTr0H6DsNd) — replaced by Master Data Sync

## Template/Reference Workflows (Nate Herk)
Not configured for ASAR — kept as reference patterns only.
- Agent Swarm, Multi Agent System Benefits, Guardrails, Ultimate Browser Agent
- ZEP Memory, Data Tables, 17 Nodes to Master, n8n Developer Agent

## Credentials Status

| Credential | Status | Used By |
|---|---|---|
| Anthropic API | Working | Agent Team Handler, Error Handler, sub-workflows |
| QuickBooks OAuth2 | Auto-assigned | Master Data Sync |
| GHL Service Robot API Key | **NEEDS MANUAL CONFIG** | Master Data Sync (HTTP Header Auth) |
| Airtable API | Needs verification | Master Data Sync, Agent Team Handler |
| n8n API Key | **HARDCODED in Error Handler — needs fix** | Error Handler, Workflow Builder |
| Airtop API | **NEEDS SETUP** | Browser Research Agent |
| ZEP API | **DEFERRED** | Future: Vizzy persistent memory |

## Airtable Base: appcVakRFzHQmFwnE

| Table | ID | Fed By |
|---|---|---|
| Customers | tblIMPgjh7rFiYxPD | GHL Contacts sync |
| Leads | tbl5OlPzMf1TVCKm4 | GHL Opportunities sync |
| Invoices | tblQeNwY0XIz9kLh9 | QB Invoices sync |
| Expenses | tblizHVE0wh0ECZPJ | QB Expenses sync |
| Payroll | tblzIeMFiKFWLODT1 | Not yet connected |
| Jobs | tbl5st1Pyc3ExzBAH | Waiting on HousecallPro API |

## Next Steps
1. Configure GHL credential → activate Master Data Sync
2. Set up Airtop API key → activate Browser Research Agent
3. Connect sub-workflows to Agent Team Handler via toolWorkflow nodes
4. Build Vizzy Daily Briefing (needs Google OAuth in n8n)
5. Add Payroll + Jobs branches to Master Data Sync
