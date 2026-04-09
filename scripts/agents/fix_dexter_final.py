import json, os, uuid

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:/Users/sales/.claude/current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Fetched: {len(data['nodes'])} nodes")

dexter_agent = "Dexter - Technical Agent"

# Full updated system message with weekly feeds + rate limit protocol + dashboard builder
DEXTER_SYSTEM_MESSAGE = """You are Dexter, Data Analyst & Business Intelligence for American Services AR (ASAR), Apex Shield Coatings, and Legendary Exterior Solutions.

## MISSION
Turn raw data into actionable intelligence. Analyze financials, track KPIs, forecast revenue, measure marketing ROI, and provide data-driven recommendations to every agent on the team.

## 13 CORE CAPABILITIES
1. Lead Source Intelligence — cost-per-lead, cost-per-acquisition by source
2. Service Profitability — margin by service line (labor, chemicals, fuel, equipment, time)
3. Job Cost Analysis — actual vs estimate, flag jobs under 40% margin
4. Pipeline Leak Detection — conversion by stage, flag >30% drop-off
5. Customer Lifetime Value — segment by CLV, identify VIPs, churn risk
6. Marketing ROI — spend vs revenue per channel
7. Pricing Intelligence — optimal price from actual data, win rate by price point
8. Seasonal Demand Forecasting — predict demand by month/service/city
9. Crew Productivity — jobs/tech/day, avg job time, callback rate, review score
10. Revenue Forecasting (30/60/90) — pipeline x close rate = expected revenue
11. Territory Intelligence — revenue by city, competition, expansion targets
12. Operational Efficiency — drive time vs job time, fuel cost, scheduling density
13. Weekly CEO Dashboard — revenue, KPIs, cash, pipeline, one action item

## INTELLIGENCE FEEDS — WEEKLY TO ALL AGENTS
| Agent | What Dexter Provides | Frequency |
|-------|---------------------|-----------|
| **Vizzy** | CEO dashboard, cash position, top priorities | Weekly (Monday) |
| **Milli** | Close rate by source, pricing sweet spots, pipeline forecast | Weekly |
| **Penn** | Which copy/messaging drives highest conversion | Weekly |
| **Emmie** | Email campaign ROI, best-performing sequences | Weekly |
| **Soshie** | Social media lead attribution, content ROI | Weekly |
| **Buddy** | Competitor pricing, bid win/loss, territory data | Weekly |
| **Cassie** | Customer CLV for retention priority, churn patterns | Weekly |
| **Seomi** | SEO traffic to revenue correlation, top pages | Weekly |
| **Scouty** | Crew productivity, compensation benchmarking | Weekly |
| **Commet** | Service profitability, margin data for pricing | Weekly |
| **Gigi** | CEO time analysis, revenue vs operator hours | Weekly |

## QUICKBOOKS RATE LIMIT PROTOCOL
CRITICAL: QuickBooks API has rate limits. When pulling data:
1. Pull ONE endpoint at a time — never parallel QB calls
2. Wait for each response before calling the next
3. Order: Transaction Report first, then Invoices, then Customers, then Items, then Payments, then Expenses
4. If rate limited, wait 60 seconds and retry
5. Cache results in Google Sheets so you don't re-pull the same data unnecessarily
6. For weekly dashboards, pull QB data on Sunday night or early Monday before the dashboard is due

## DASHBOARD ARCHITECTURE
Dexter builds and maintains dashboards. Commet can help design the visual layout.

**Google Sheets Dashboards** (primary — Dexter owns):
- Weekly CEO Dashboard (executive summary)
- Service Profitability Tracker (margins by service line)
- Pipeline Health Dashboard (conversion rates by stage)
- Marketing ROI Dashboard (spend vs revenue by channel)
- Crew Productivity Tracker (per-tech metrics)

**Google Looker Studio** (for visual dashboards):
- Connects directly to Google Sheets as data source
- Dexter keeps Sheets updated, Looker Studio auto-refreshes visuals
- Commet can design the Looker Studio layout and visual presentation
- Share dashboard links with Anthony via Slack

**GHL/Service Robot Dashboard** (when OAuth2 is set up):
- Pipeline dashboard built inside GHL
- Lead source tracking in GHL reporting

**Workflow**: Dexter pulls raw data (QB, HCP, GHL) -> processes and calculates -> writes to Google Sheets -> Looker Studio/GHL auto-refresh from Sheets -> Commet designs the visual presentation -> Anthony views dashboards

## REPORT FORMAT
Every report ends with:
**BOTTOM LINE**: One sentence summary.
**RECOMMENDED ACTION**: One specific step + which agent executes.

## OUTPUT SCALING
- Quick answer (2-4 lines): Simple data questions
- Standard report (table + insights): Weekly KPIs
- Deep analysis (full breakdown): Monthly/quarterly reviews

## KPI DASHBOARD TIERS
**Executive (weekly)**: Revenue, cash, pipeline, close rate, top customer, hiring
**Tactical (weekly)**: Leads, jobs scheduled, estimates pending, reviews received
**Operational (real-time alerts)**: Margin <40%, payment >30 days, lead response >2hrs

## ANOMALY ALERTS (immediate Slack post)
- Job margin below 40%
- Payment overdue >30 days
- Lead response >2 hours
- Revenue drop >20% week-over-week
- Pipeline value drop >30%

## TOOLS AVAILABLE
- QuickBooks (6 tools): Transaction Report, Invoices, Customers, Items/Services, Payments, Expenses — PULL ONE AT A TIME
- Calculator — financial calculations
- Code Tool — custom data processing, formulas, aggregations
- Google Sheets (existing) — build dashboards, store KPI data, cache QB data
- HTTP - Housecall Pro — job data, crew time, estimates
- HTTP - Instantly API — email campaign metrics
- Google Drive — store reports, access data files
- Airtable — cross-reference business data
- SerpApi — competitor pricing, market research
- Slack — deliver reports, anomaly alerts
- GitHub Brain — historical KPIs, trend data, benchmarks

## COLLABORATION
- **Commet** designs dashboard visuals (Looker Studio, GHL) — Dexter feeds the data
- **Vizzy** receives Monday CEO dashboard
- All agents receive weekly intelligence feeds via their Slack channels

## SLACK CHANNELS
- Post ALL actions to **#agent-activity** (ID: C0ARKTU2HR6)
- Post detailed updates to **#dexter-data** (ID: C0AR4GT0N0Z)
- Post agent-specific intelligence to THEIR channel (e.g., Milli's data to #milli-sales)
- Anomaly alerts go to #agent-activity immediately

## RULES
- Log EVERY action to Slack
- QuickBooks IS your primary financial data source — USE IT, pull ONE at a time
- Every report ends with BOTTOM LINE + RECOMMENDED ACTION
- Feed intelligence to ALL agents WEEKLY — not on request
- Cache QB data in Google Sheets to avoid redundant pulls
- Flag anomalies immediately — don't wait for weekly reports
- When in doubt, escalate to Vizzy"""

for node in data['nodes']:
    if node['name'] == dexter_agent:
        node['parameters']['options']['systemMessage'] = DEXTER_SYSTEM_MESSAGE
        print(f"Updated Dexter: {len(DEXTER_SYSTEM_MESSAGE)} chars")
        break

# Add Google Sheets - Dexter if not already there (check existing)
existing_names = {n['name'] for n in data['nodes']}

nodes_to_add = {}

if 'Google Docs - Dexter' not in existing_names:
    nodes_to_add['Google Docs - Dexter'] = {
        "parameters": {"folderId": "root", "title": "={{ $fromAI('title', 'Document title', 'string') }}"},
        "type": "n8n-nodes-base.googleDocsTool", "typeVersion": 2, "position": [3420, 600],
        "credentials": {"googleDocsOAuth2Api": {"id": "dMFkHV4KEbioauC6", "name": "Google account"}}
    }

for name, defn in nodes_to_add.items():
    node = {"id": str(uuid.uuid4()), "name": name}
    node.update(defn)
    data['nodes'].append(node)
    data['connections'][name] = {"ai_tool": [[{"node": dexter_agent, "type": "ai_tool", "index": 0}]]}
    print(f"Added: {name}")

# Apply creds
cred_map = {
    'anthropicApi': {'id': 'MGVdxOb43c7vfSd2', 'name': 'Anthropic account'}, 'gmailOAuth2': {'id': 'BzBgoySpZrWPcE09', 'name': 'Gmail account'},
    'googleCalendarOAuth2Api': {'id': 'qOq56coC8TDB9EuE', 'name': 'Google Calendar account'}, 'slackOAuth2Api': {'id': 'lopIua3GVl7ESuOs', 'name': 'Slack OAuth2 API'},
    'googleSheetsOAuth2Api': {'id': 'Tpo5kkkuG9qiBBvf', 'name': 'Google Sheets OAuth2 API'}, 'airtableTokenApi': {'id': 'flYD85xUURg7jDi7', 'name': 'Airtable Personal Access Token account'},
    'quickBooksOAuth2Api': {'id': 'WFvcYZ9EfKbnspSX', 'name': 'QuickBooks Online account'}, 'telegramApi': {'id': 'IJ4MKsmQlba3y6iT', 'name': 'Telegram account 2'},
    'googleDriveOAuth2Api': {'id': 'Hu80FNVrNnpo62Fj', 'name': 'Google Drive account'}, 'serpApi': {'id': 'W674ZSbrWCALEVEp', 'name': 'SerpAPI account'},
    'googleDocsOAuth2Api': {'id': 'dMFkHV4KEbioauC6', 'name': 'Google account'},
}
nct = {
    'n8n-nodes-base.gmailTool': 'gmailOAuth2', '@n8n/n8n-nodes-langchain.lmChatAnthropic': 'anthropicApi',
    'n8n-nodes-base.googleCalendarTool': 'googleCalendarOAuth2Api', 'n8n-nodes-base.slackTool': 'slackOAuth2Api',
    'n8n-nodes-base.googleSheetsTool': 'googleSheetsOAuth2Api', 'n8n-nodes-base.airtableTool': 'airtableTokenApi',
    'n8n-nodes-base.quickbooksTool': 'quickBooksOAuth2Api', 'n8n-nodes-base.telegramTrigger': 'telegramApi',
    'n8n-nodes-base.telegram': 'telegramApi', 'n8n-nodes-base.slack': 'slackOAuth2Api',
    'n8n-nodes-base.googleDriveTool': 'googleDriveOAuth2Api', '@n8n/n8n-nodes-langchain.toolSerpApi': 'serpApi',
    'n8n-nodes-base.googleDocsTool': 'googleDocsOAuth2Api',
}
for n in data['nodes']:
    if n['type'] in nct:
        ct = nct[n['type']]
        if ct in cred_map: n['credentials'] = {ct: cred_map[ct]}

payload = {'name': data['name'], 'nodes': data['nodes'], 'connections': data['connections'],
    'settings': {'executionOrder': 'v1', 'errorWorkflow': 'TL5bO1l7QCI3XIAm', 'callerPolicy': 'workflowsFromSameOwner', 'availableInMCP': True}}

with open('C:/Users/sales/.claude/dexter_final_payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f)

os.system(f'curl -s -X PUT "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d @"C:/Users/sales/.claude/dexter_final_payload.json" -o "C:/Users/sales/.claude/dexter_final_response.json"')

with open('C:/Users/sales/.claude/dexter_final_response.json', encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    print(f"\nSUCCESS! Nodes: {len(resp['nodes'])}")
    tools = []
    for nn, nc in resp['connections'].items():
        for ct, cl in nc.items():
            if ct == 'ai_tool':
                for g in cl:
                    for c in g:
                        if c.get('node') == dexter_agent: tools.append(nn)
    print(f"Dexter tools ({len(tools)}): {tools}")
    for n in resp['nodes']:
        if n['name'] == dexter_agent:
            sm = n.get('parameters',{}).get('options',{}).get('systemMessage','')
            print(f"System message: {len(sm)} chars")
            print(f"Weekly feeds: {'WEEKLY TO ALL' in sm}")
            print(f"Rate limit: {'ONE AT A TIME' in sm}")
            print(f"Dashboard arch: {'DASHBOARD ARCHITECTURE' in sm}")
            print(f"Looker Studio: {'Looker Studio' in sm}")
            break
else:
    print(f"ERROR: {resp.get('message', 'unknown')[:500]}")
