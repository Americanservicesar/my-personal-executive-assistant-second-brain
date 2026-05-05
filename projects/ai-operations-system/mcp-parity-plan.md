# MCP Parity: Claude Code Desktop vs n8n Sessions

**Goal:** Everything Anthony can do in Claude Code Desktop, Vizzy (and all agents) can do via Telegram/Slack in n8n.

---

## What Claude Code Desktop Has (Right Now)

| MCP Server | What It Does | Status |
|---|---|---|
| Gmail | Read/search/draft all 4 accounts | LIVE |
| Google Calendar | Read/create/update events | LIVE |
| Airtable | Read/write any base | LIVE |
| Slack | Send/read/search channels, DMs | LIVE |
| GitHub | Read/write repo, PRs, files | LIVE |
| QuickBooks | P&L, invoices, cash flow | LIVE |
| DocuSign | Envelopes, agreements, signing | LIVE |
| Canva | Design create/export | LIVE |
| Clay | Prospect enrichment, company data | LIVE |

Claude Code can query GHL and HCP live via these + HTTP calls.

---

## What n8n Agents Have Right Now

| Tool | n8n Credential | Status |
|---|---|---|
| GHL API | `xthsN1QtUv1W9Vtr` | HTTP node only — no structured tool |
| Gmail (4 accounts) | Per-account OAuth2 | Read/monitor only (inbox triggers) |
| Google Calendar | `qOq56coC8TDB9EuE` | Available but limited tool config |
| Google Sheets | `Tpo5kkkuG9qiBBvf` | Available |
| Google Drive | `Hu80FNVrNnpo62Fj` | Available |
| Slack | `6yUg4MuD1ruBxZQY` | Post/read available |
| Airtable | `flYD85xUURg7jDi7` | Available |
| SerpApi | `W674ZSbrWCALEVEp` | Available |

**What's missing in n8n agents:** Gmail send/draft, live GHL contact/pipeline pull, HCP job data, QuickBooks, DocuSign, Canva, Clay.

---

## Why the Gap Exists

The MCP servers connected to Claude Code are **cloud-hosted MCP endpoints** managed by each tool's vendor (Google, Slack, Airtable, etc.) and configured in `~/.claude/` settings. n8n Cloud can't access them directly because:

1. n8n doesn't auto-detect Claude Code's MCP config
2. n8n AI Agent uses **n8n tool nodes**, not MCP protocol — different architecture
3. n8n Cloud is at `americanservicesar.app.n8n.cloud` — needs HTTP/SSE endpoints to reach any MCP server

---

## Solution: Three-Layer Fix

### Layer 1 — n8n MCP Client Tool (Fastest for cloud-hosted MCPs)

n8n has a native **MCP Client Tool** node (as of n8n v1.50+). It connects to any MCP server that exposes an HTTP/SSE endpoint.

For each cloud-hosted MCP server that has an HTTP endpoint (most vendor MCPs do):
1. Add an **MCP Client Tool** node to Vizzy's orchestrator workflow
2. Point it at the MCP server's HTTP/SSE URL
3. Authenticate with API key or OAuth
4. The AI Agent can now call any tool that MCP server exposes

**Which MCP servers support this:**
- Slack MCP → HTTP endpoint ✓
- Google MCP (Gmail + Calendar) → HTTP endpoint ✓
- Airtable MCP → HTTP endpoint ✓
- GitHub MCP → HTTP endpoint ✓
- QuickBooks MCP → depends on which MCP server is configured
- Canva MCP → HTTP endpoint ✓

**Action:** In each cloud MCP server's config, find the HTTP/SSE base URL and add it as an MCP Client Tool in n8n. Same creds, same tools, same behavior.

---

### Layer 2 — HTTP Request Tool Nodes for GHL and HCP (Already Have Creds)

These don't have MCP servers — they use direct API calls. Add as **HTTP Request Tool** nodes in Vizzy's orchestrator so the AI agent can call them on demand.

**GHL Tools to wire up:**

| Tool Name | Endpoint | Method |
|---|---|---|
| `ghl_get_contact` | `GET /contacts/{id}` | Lookup by phone/email |
| `ghl_search_contacts` | `GET /contacts/search?query=` | Find contacts |
| `ghl_get_pipeline` | `GET /opportunities?pipelineId=OyuNwhoc79Lb8YS7h3kg` | Pull open deals |
| `ghl_get_opportunity` | `GET /opportunities/{id}` | Single deal detail |
| `ghl_update_opportunity` | `PUT /opportunities/{id}` | Move stage |
| `ghl_add_note` | `POST /contacts/{id}/notes` | Log activity |
| `ghl_send_email` | `POST /conversations/messages` | Send from any account |

All use: `Authorization: Bearer {GHL API Key}` (credential `xthsN1QtUv1W9Vtr` already in n8n)

**HCP Tools to wire up:**

| Tool Name | Endpoint | Method |
|---|---|---|
| `hcp_get_jobs` | `GET /jobs` | List jobs |
| `hcp_get_estimates` | `GET /estimates` | List estimates |
| `hcp_get_customer` | `GET /customers/{id}` | Customer detail |
| `hcp_get_job_by_id` | `GET /jobs/{id}` | Single job |

All use HCP API key (need to store in n8n credentials if not already there).

---

### Layer 3 — Email Architecture (NO Gmail Send Tool — by design)

**Confirmed by Anthony (2026-05-04):** Agents do NOT send email from sales@ or office@.

| Email Channel | Purpose | Who Sends |
|---|---|---|
| sales@ Gmail | Inbound only — triggers Milli via n8n monitor | Inbound only |
| office@ Gmail | Inbound only — triggers Cassie via n8n monitor | Inbound only |
| asons@ Gmail | Inbound only — triggers Buddy via n8n monitor | Inbound only |
| **GHL workflows** | All estimate + job follow-ups (email + SMS) | Automated, triggered by pipeline stage |
| **GHL Conversations** | One-off personal touches to existing contacts | Routed through GHL — keeps history attached |
| **Instantly** | Cold outreach to new prospects | Emmie campaigns only |

**What this means for the orchestrator:**

- ❌ Do NOT add a Gmail Send/Draft tool to n8n agents
- ✅ Add a **GHL Workflow Enrollment** tool: `POST /contacts/{id}/workflow/{workflowId}` (per mistakes-and-fixes.md 2026-04-15 — tag triggers don't fire from API)
- ✅ Add a **GHL Conversations Send Message** tool for one-off personal touches: `POST /conversations/messages`
- ✅ Add an **Instantly Add to Campaign** tool for cold outreach: Emmie's existing Instantly API

---

## Priority Order to Close the Gap

| Priority | Fix | Effort | Impact |
|---|---|---|---|
| 1 | GHL HTTP Request tools (contacts, pipeline, opportunities, workflow enrollment, conversations send) | 3–4 hrs | Unblocks live pipeline queries + correct outbound architecture |
| 2 | HCP HTTP Request tools (jobs, estimates, customers) | 1–2 hrs | Unblocks job status checks from Telegram |
| 3 | Instantly tools (add to campaign, get campaign status) for Emmie | 1 hr | Cold outreach controllable from Telegram |
| 4 | MCP Client Tool nodes for Slack, Airtable, Google Calendar/Drive/Docs | 2–3 hrs | Closes remaining parity gap |
| 5 | QuickBooks + DocuSign MCP Client tools | 1–2 hrs | Dexter can pull live financials, Buddy can trigger docs |

---

## What This Looks Like When Done

**Current Telegram experience:**
> Anthony: "Where is Layne Smith in the pipeline?"
> Vizzy: "I don't have direct GHL access — checking memory..."

**After fix:**
> Anthony: "Where is Layne Smith in the pipeline?"
> Vizzy: [calls `ghl_search_contacts` → gets live stage, last touch, workflow enrollment]
> Vizzy: "Layne is in Estimate Sent at $4,599. GHL estimate-follow-up workflow ran 4 touches, last on 2026-05-02 — no engagement. Recommend Milli call him today. Want me to assign?"

That's Claude Code Desktop parity inside Telegram — and it respects the email architecture (GHL handles automated touches, humans handle phone, no Gmail outbound).

---

## Which to Build First

Start with **Layer 2 — GHL + HCP tools** because:
- Creds already exist in n8n
- These are the most-used live data sources
- Removes the #1 gap: agents can't verify job/pipeline status without memory

Do you want the n8n workflow JSON for the GHL tool nodes built out now?
