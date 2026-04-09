import json, os, uuid

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

# Fetch current
os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:\\Users\\sales\\.claude\\current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Fetched: {len(data['nodes'])} nodes, active={data['active']}")

# ============================================================
# 1. UPDATE MILLI'S SYSTEM MESSAGE + DESCRIPTION
# ============================================================

MILLI_SYSTEM_MESSAGE = """You are Milli, Sales Manager for American Services AR (ASAR), Apex Shield Coatings, and Legendary Exterior Solutions.

## MISSION
Close commercial and residential deals. Manage the full sales pipeline from lead qualification through close. Own follow-up cadences, objection handling, and revenue generation.

## BRANDS & SERVICES
- **ASAR**: Commercial pressure washing ($0.08-0.15/sqft), fleet washing ($75-150/vehicle), parking lot maintenance, gutter installation/cleaning, construction cleanup
- **Apex Shield**: Premium coating applications (roof, deck, driveway sealant)
- **Legendary**: High-end exterior restoration and specialty services

## CALL SCRIPTS BY SEGMENT
**Property Managers**: "We handle commercial pressure washing, gutters, parking lots — the exterior maintenance stuff that keeps your properties looking sharp. Most PMs save 20-30% by bundling services with one vendor. Can I swing by one of your properties for 5 minutes?"
**Fleet Companies**: "We do mobile fleet washing — we come to your yard, wash your trucks on-site. No downtime, no drivers going off-route. What does your current wash schedule look like?"
**Construction GCs**: "We handle post-construction pressure washing and final exterior cleanup. Most GCs bring us in 2-3 weeks before CO to knock out the exterior. Are you at that stage yet?"
**Apartment Complexes**: "Your complex would be a great fit for our quarterly maintenance program. We handle pressure washing, parking lot, gutters — the whole exterior."

## OBJECTION HANDLING
| Objection | Response |
|-----------|----------|
| Too expensive | "What's the cost of NOT doing it? Deferred maintenance compounds — one deep clean now prevents three emergency calls later." |
| Already have someone | "On a scale of 1-10, how happy are you? I'll do a free demo wash on one section so you can compare." |
| Not in budget | "We can phase the work — start with the highest-impact areas this quarter, tackle the rest next." |
| Send me info | "I'd rather show you — 5 minutes at your property is worth more than any PDF." |
| Handle it in-house | "What's your fully-loaded cost per hour including equipment, chemicals, insurance, and workers comp?" |
| Need to think about it | "Totally fair. What specifically would you need to see to feel confident moving forward?" |

## LEAD QUALIFICATION
| Factor | Hot | Warm | Cold |
|--------|-----|------|------|
| Budget | Confirmed/implied | Unknown | "No budget" |
| Timeline | This month | This quarter | "Someday" |
| Decision maker | Talking to them | Know who | Unknown |
| Need | Expressed pain point | General interest | Just browsing |

## FOLLOW-UP CADENCE
Day 0: Initial call/visit (Phone)
Day 1: Follow-up email with proposal (Email via sales@)
Day 3: Second call if no response (Phone)
Day 7: Value-add email — tip or case study (Email)
Day 14: Final direct ask (Phone/text)
Day 30: Hand to Emmie for long-term nurture sequence

## LEAD PLATFORM RESPONSE SLAs
HomeAdvisor: <30 min | Thumbtack: <1 hr | Angi: <1 hr | Nextdoor: <2 hr (via Soshie)

## TOOLS AVAILABLE
- Gmail (sales@americanservicesar.com) — follow-up emails, proposals
- Google Calendar — schedule site visits, demos
- Google Sheets — price sheet reference, pipeline tracking
- Google Drive — sales PDF, proposals, templates
- QuickBooks — READ ONLY estimates (do NOT send through QB)
- Airtable — lead/contact database
- Slack — report ALL actions to #agent-activity
- SerpApi — lead hunting, competitor research
- Web Search — research prospects

## COLLABORATION
- **Buddy** hunts leads → passes to you for closing
- **Penn** writes proposal copy → you create estimate in Housecall Pro and send
- **Emmie** warms cold leads → hands off when qualified for call/quote
- **Cassie** handles post-job follow-up after you close
- **Dexter** audits pricing and provides financial data

## CLOSE & LOG PROTOCOL
**After winning**: Move deal to "Won" in pipeline → Schedule job → Update client records → Route to Cassie for post-job setup
**After losing**: Move to "Lost" → Log reason and competitor price if known → Route to Emmie for long-term nurture

## UNIFIED LEAD TAGGING (apply to all leads)
5 dimensions: Vertical (V-property-mgmt, V-fleet, V-construction, V-apartment, V-retail, V-government, V-HOA), Tier (Tier1/Tier2), Service (S-pressure-wash, S-fleet-wash, S-gutters, S-parking, S-construction), Source (L-homeadvisor, L-thumbtack, L-nextdoor, L-referral, L-cold-outreach, L-website), Temperature (T-hot, T-warm, T-cold)

## RULES
- Log EVERY action to Slack #agent-activity
- Never send estimates through QuickBooks — Housecall Pro is PRIMARY for estimates/invoices
- Always check for existing client history before first contact
- RoofSnap measurements required before sending gutter/roof quotes
- NO REFUNDS — credit toward next service only (Anthony approves all credits)
- When in doubt, escalate to Vizzy"""

MILLI_DESCRIPTION = "Sales Manager. Closes deals, manages pipeline, handles objections, runs follow-up cadences for ASAR/Apex Shield/Legendary. Owns lead qualification, call scripts for Property Managers/Fleet/Construction/Apartments, and all sales email via sales@americanservicesar.com. Collaborates with Buddy (lead hunting), Penn (proposals), Emmie (nurture handoff), Cassie (post-job). Tools: Gmail, Calendar, Sheets, Drive, QuickBooks (read-only), Airtable, Slack, SerpApi, Web Search."

# Find and update Milli node
for node in data['nodes']:
    if node['name'] == 'Milli - Marketing Agent':
        node['parameters']['toolDescription'] = MILLI_DESCRIPTION
        node['parameters']['options']['systemMessage'] = MILLI_SYSTEM_MESSAGE
        print(f"Updated Milli system message: {len(MILLI_SYSTEM_MESSAGE)} chars")
        print(f"Updated Milli description: {len(MILLI_DESCRIPTION)} chars")
        break

# ============================================================
# 2. ADD NEW TOOL NODES FOR MILLI
# ============================================================

# Base position for new Milli tools (below existing ones at y=608)
base_x = 768
base_y = 780

new_nodes = []

# Google Calendar - Milli (matching existing Google Calendar Tool)
new_nodes.append({
    "parameters": {
        "operation": "getAll",
        "calendar": {"__rl": True, "mode": "id", "value": "={{ $fromAI('calendarId', 'The calendar ID, use primary for main calendar', 'string') }}"},
        "options": {}
    },
    "id": str(uuid.uuid4()),
    "name": "Google Calendar - Milli",
    "type": "n8n-nodes-base.googleCalendarTool",
    "typeVersion": 1.3,
    "position": [base_x, base_y],
    "credentials": {
        "googleCalendarOAuth2Api": {"id": "qOq56coC8TDB9EuE", "name": "Google Calendar account"}
    }
})

# Google Sheets - Milli (matching Google Sheets - Vizzy)
new_nodes.append({
    "parameters": {
        "documentId": {"__rl": True, "mode": "id", "value": "={{ $fromAI('spreadsheetId', 'The Google Sheets spreadsheet ID', 'string') }}"},
        "sheetName": {"__rl": True, "mode": "name", "value": "={{ $fromAI('sheetName', 'The sheet tab name', 'string') }}"},
        "options": {}
    },
    "id": str(uuid.uuid4()),
    "name": "Google Sheets - Milli",
    "type": "n8n-nodes-base.googleSheetsTool",
    "typeVersion": 4.7,
    "position": [base_x, base_y + 160],
    "credentials": {
        "googleSheetsOAuth2Api": {"id": "Tpo5kkkuG9qiBBvf", "name": "Google Sheets OAuth2 API"}
    }
})

# Google Drive - Milli (matching Google Drive - Vizzy)
new_nodes.append({
    "parameters": {
        "descriptionType": "manual",
        "toolDescription": "Search and access files in Google Drive — sales PDFs, proposals, templates",
        "resource": "fileFolder",
        "operation": "search",
        "searchMethod": "name",
        "queryString": "={{ $fromAI('searchQuery', 'File or folder name to search for', 'string') }}",
        "returnAll": True,
        "filter": {},
        "options": {}
    },
    "id": str(uuid.uuid4()),
    "name": "Google Drive - Milli",
    "type": "n8n-nodes-base.googleDriveTool",
    "typeVersion": 3,
    "position": [base_x, base_y + 320],
    "credentials": {
        "googleDriveOAuth2Api": {"id": "Hu80FNVrNnpo62Fj", "name": "Google Drive account"}
    }
})

# QuickBooks - Milli (READ ONLY — matching QB: Invoices - Dexter)
new_nodes.append({
    "parameters": {
        "resource": "estimate",
        "operation": "get"
    },
    "id": str(uuid.uuid4()),
    "name": "QuickBooks - Milli",
    "type": "n8n-nodes-base.quickbooksTool",
    "typeVersion": 1,
    "position": [base_x + 200, base_y],
    "credentials": {
        "quickBooksOAuth2Api": {"id": "WFvcYZ9EfKbnspSX", "name": "QuickBooks Online account"}
    }
})

# Airtable - Milli (matching Airtable - Cassie)
new_nodes.append({
    "parameters": {
        "descriptionType": "manual",
        "toolDescription": "Search leads, contacts, and prospect records in Airtable for sales pipeline management.",
        "operation": "search",
        "base": {"__rl": True, "mode": "id", "value": "={{ $fromAI('baseId', 'The Airtable base ID to search', 'string') }}"},
        "table": {"__rl": True, "mode": "id", "value": "={{ $fromAI('tableId', 'The Airtable table ID to search', 'string') }}"},
        "options": {}
    },
    "id": str(uuid.uuid4()),
    "name": "Airtable - Milli",
    "type": "n8n-nodes-base.airtableTool",
    "typeVersion": 2.1,
    "position": [base_x + 200, base_y + 160],
    "credentials": {
        "airtableTokenApi": {"id": "flYD85xUURg7jDi7", "name": "Airtable Personal Access Token account"}
    }
})

# Slack - Milli (matching Slack Tool - Vizzy)
new_nodes.append({
    "parameters": {
        "descriptionType": "manual",
        "toolDescription": "Post sales activity updates and action logs to Slack channels",
        "authentication": "oAuth2",
        "select": "channel",
        "channelId": {"__rl": True, "mode": "id", "value": "={{ $fromAI('channel', 'Slack channel ID to post to', 'string') }}"},
        "text": "={{ $fromAI('message', 'Message to post to Slack', 'string') }}",
        "otherOptions": {}
    },
    "id": str(uuid.uuid4()),
    "name": "Slack - Milli",
    "type": "n8n-nodes-base.slackTool",
    "typeVersion": 2.4,
    "position": [base_x + 200, base_y + 320],
    "credentials": {
        "slackOAuth2Api": {"id": "lopIua3GVl7ESuOs", "name": "Slack OAuth2 API"}
    }
})

# SerpApi - Milli (matching SerpApi - Vizzy)
new_nodes.append({
    "parameters": {
        "options": {}
    },
    "id": str(uuid.uuid4()),
    "name": "SerpApi - Milli",
    "type": "@n8n/n8n-nodes-langchain.toolSerpApi",
    "typeVersion": 1,
    "position": [base_x + 400, base_y],
    "credentials": {
        "serpApi": {"id": "W674ZSbrWCALEVEp", "name": "SerpAPI account"}
    }
})

# Add all new nodes
for node in new_nodes:
    data['nodes'].append(node)
    print(f"Added node: {node['name']}")

# ============================================================
# 3. ADD CONNECTIONS FROM NEW TOOLS TO MILLI
# ============================================================

milli_agent_name = "Milli - Marketing Agent"
conns = data['connections']

for node in new_nodes:
    conns[node['name']] = {
        "ai_tool": [[{"node": milli_agent_name, "type": "ai_tool", "index": 0}]]
    }

print(f"\nConnected {len(new_nodes)} new tools to Milli")

# ============================================================
# 4. APPLY CREDENTIALS TO ALL NODES
# ============================================================

cred_map = {
    'anthropicApi': {'id': 'MGVdxOb43c7vfSd2', 'name': 'Anthropic account'},
    'gmailOAuth2': {'id': 'BzBgoySpZrWPcE09', 'name': 'Gmail account'},
    'googleCalendarOAuth2Api': {'id': 'qOq56coC8TDB9EuE', 'name': 'Google Calendar account'},
    'slackOAuth2Api': {'id': 'lopIua3GVl7ESuOs', 'name': 'Slack OAuth2 API'},
    'googleSheetsOAuth2Api': {'id': 'Tpo5kkkuG9qiBBvf', 'name': 'Google Sheets OAuth2 API'},
    'airtableTokenApi': {'id': 'flYD85xUURg7jDi7', 'name': 'Airtable Personal Access Token account'},
    'quickBooksOAuth2Api': {'id': 'WFvcYZ9EfKbnspSX', 'name': 'QuickBooks Online account'},
    'telegramApi': {'id': 'IJ4MKsmQlba3y6iT', 'name': 'Telegram account 2'},
    'googleDriveOAuth2Api': {'id': 'Hu80FNVrNnpo62Fj', 'name': 'Google Drive account'},
    'serpApi': {'id': 'W674ZSbrWCALEVEp', 'name': 'SerpAPI account'},
    'googleDocsOAuth2Api': {'id': 'dMFkHV4KEbioauC6', 'name': 'Google account'},
    'googleOAuth2Api': {'id': 'dMFkHV4KEbioauC6', 'name': 'Google account'},
}

node_cred_types = {
    'n8n-nodes-base.gmailTool': 'gmailOAuth2',
    '@n8n/n8n-nodes-langchain.lmChatAnthropic': 'anthropicApi',
    'n8n-nodes-base.googleCalendarTool': 'googleCalendarOAuth2Api',
    'n8n-nodes-base.slackTool': 'slackOAuth2Api',
    'n8n-nodes-base.googleSheetsTool': 'googleSheetsOAuth2Api',
    'n8n-nodes-base.airtableTool': 'airtableTokenApi',
    'n8n-nodes-base.quickbooksTool': 'quickBooksOAuth2Api',
    'n8n-nodes-base.telegramTrigger': 'telegramApi',
    'n8n-nodes-base.telegram': 'telegramApi',
    'n8n-nodes-base.slack': 'slackOAuth2Api',
    'n8n-nodes-base.googleDriveTool': 'googleDriveOAuth2Api',
    '@n8n/n8n-nodes-langchain.toolSerpApi': 'serpApi',
    'n8n-nodes-base.googleDocsTool': 'googleDocsOAuth2Api',
}

cred_applied = 0
for node in data['nodes']:
    ntype = node['type']
    if ntype in node_cred_types:
        cred_type = node_cred_types[ntype]
        cred = cred_map.get(cred_type)
        if cred:
            node['credentials'] = {cred_type: cred}
            cred_applied += 1

print(f"Applied credentials to {cred_applied} nodes")

# ============================================================
# 5. BUILD PAYLOAD AND PUSH
# ============================================================

api_payload = {
    'name': data['name'],
    'nodes': data['nodes'],
    'connections': data['connections'],
    'settings': {
        'executionOrder': 'v1',
        'errorWorkflow': 'TL5bO1l7QCI3XIAm',
        'callerPolicy': 'workflowsFromSameOwner',
        'availableInMCP': True
    }
}

payload_path = r'C:\Users\sales\.claude\milli_api_payload.json'
resp_path = r'C:\Users\sales\.claude\milli_put_response.json'

with open(payload_path, 'w', encoding='utf-8') as f:
    json.dump(api_payload, f)

print(f"\nPayload: {len(data['nodes'])} nodes, pushing...")

os.system(
    f'curl -s -X PUT "{BASE}/workflows/JAYrzGWR8A0tCBzB" '
    f'-H "X-N8N-API-KEY: {API_KEY}" '
    f'-H "Content-Type: application/json" '
    f'-d @"{payload_path}" '
    f'-o "{resp_path}"'
)

with open(resp_path, encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    print(f"\nSUCCESS!")
    print(f"  Nodes: {len(resp['nodes'])}")
    print(f"  Active: {resp['active']}")
    print(f"  availableInMCP: {resp.get('settings', {}).get('availableInMCP')}")
    # Verify Milli's new tools
    milli_tools = []
    for node_name, node_conns in resp['connections'].items():
        for conn_type, conn_list in node_conns.items():
            if conn_type == 'ai_tool':
                for group in conn_list:
                    for conn in group:
                        if conn.get('node') == 'Milli - Marketing Agent':
                            milli_tools.append(node_name)
    print(f"  Milli tools ({len(milli_tools)}): {milli_tools}")
    # Check Milli system message
    for n in resp['nodes']:
        if n['name'] == 'Milli - Marketing Agent':
            sm = n.get('parameters', {}).get('options', {}).get('systemMessage', '')
            print(f"  System message: {len(sm)} chars")
            break
else:
    print(f"\nERROR: {resp.get('message', 'unknown')[:500]}")
