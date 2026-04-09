import json, os, uuid

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Starting: {len(data['nodes'])} nodes")

# New Penn tool names
new_penn_tools = {'SerpApi - Penn', 'Google Drive - Penn', 'Google Docs - Penn', 'Google Sheets - Penn', 'Slack - Penn'}

# Remove all orphans from failed push
clean_nodes = [n for n in data['nodes'] if n['name'] not in new_penn_tools]
print(f"Removed {len(data['nodes']) - len(clean_nodes)} orphans")
data['nodes'] = clean_nodes

# Correct params/versions for new nodes
new_nodes_def = {
    'SerpApi - Penn': {
        "parameters": {"options": {}},
        "type": "@n8n/n8n-nodes-langchain.toolSerpApi",
        "typeVersion": 1,
        "position": [1100, 600],
        "credentials": {"serpApi": {"id": "W674ZSbrWCALEVEp", "name": "SerpAPI account"}}
    },
    'Google Drive - Penn': {
        "parameters": {
            "descriptionType": "manual",
            "toolDescription": "Search and access brand assets, sales PDFs, templates, and logo files in Google Drive",
            "resource": "fileFolder", "operation": "search", "searchMethod": "name",
            "queryString": "={{ $fromAI('searchQuery', 'File or folder name to search for', 'string') }}",
            "returnAll": True, "filter": {}, "options": {}
        },
        "type": "n8n-nodes-base.googleDriveTool",
        "typeVersion": 3,
        "position": [1100, 760],
        "credentials": {"googleDriveOAuth2Api": {"id": "Hu80FNVrNnpo62Fj", "name": "Google Drive account"}}
    },
    'Google Docs - Penn': {
        "parameters": {
            "folderId": "root",
            "title": "={{ $fromAI('title', 'Document title', 'string') }}"
        },
        "type": "n8n-nodes-base.googleDocsTool",
        "typeVersion": 2,
        "position": [1300, 600],
        "credentials": {"googleDocsOAuth2Api": {"id": "dMFkHV4KEbioauC6", "name": "Google account"}}
    },
    'Google Sheets - Penn': {
        "parameters": {
            "documentId": {"__rl": True, "mode": "id", "value": "={{ $fromAI('spreadsheetId', 'The Google Sheets spreadsheet ID', 'string') }}"},
            "sheetName": {"__rl": True, "mode": "name", "value": "={{ $fromAI('sheetName', 'The sheet tab name', 'string') }}"},
            "options": {}
        },
        "type": "n8n-nodes-base.googleSheetsTool",
        "typeVersion": 4.7,
        "position": [1300, 760],
        "credentials": {"googleSheetsOAuth2Api": {"id": "Tpo5kkkuG9qiBBvf", "name": "Google Sheets OAuth2 API"}}
    },
    'Slack - Penn': {
        "parameters": {
            "descriptionType": "manual",
            "toolDescription": "Post copy deliverables and activity updates to Slack channels",
            "authentication": "oAuth2", "select": "channel",
            "channelId": {"__rl": True, "mode": "id", "value": "={{ $fromAI('channel', 'Slack channel ID to post to', 'string') }}"},
            "text": "={{ $fromAI('message', 'Message to post to Slack', 'string') }}",
            "otherOptions": {}
        },
        "type": "n8n-nodes-base.slackTool",
        "typeVersion": 2.4,
        "position": [1500, 600],
        "credentials": {"slackOAuth2Api": {"id": "lopIua3GVl7ESuOs", "name": "Slack OAuth2 API"}}
    },
}

# Add fresh nodes
for name, defn in new_nodes_def.items():
    node = {"id": str(uuid.uuid4()), "name": name}
    node.update(defn)
    data['nodes'].append(node)
    print(f"Added: {name}")

# Update Penn system message + description
PENN_SYSTEM_MESSAGE = """You are Penn, the Copywriter for American Services AR (ASAR), Apex Shield Coatings, and Legendary Exterior Solutions.

## MISSION
Write all external-facing copy — ads, website pages, proposals, email copy, social posts, and marketing messaging. Maintain brand voice across all three brands. Always deliver primary + A/B variant.

## BRAND VOICE
| Brand | Tone | Key Phrases | Avoid |
|-------|------|-------------|-------|
| **ASAR** | Professional, confident, commercial-grade | "One call handles everything", "Commercial-grade results" | Salesy, residential-sounding |
| **Apex Shield** | Premium, authoritative, construction expertise | "Built to protect", "Premium exterior solutions" | Cheap-sounding, DIY language |
| **Legendary** | Friendly, reliable, neighborhood trust | "Your home, our priority" | Corporate, industrial tone |

**NOTE**: ALL routes through American Services AR for now. Apex Shield and Legendary branding TBD later.

## CHANNEL FORMATS
**Google Ads (Search)**:
- Headline 1 (30 chars): Service + Location
- Headline 2 (30 chars): Value prop or differentiator
- Headline 3 (30 chars): CTA
- Description 1 (90 chars): What we do + why choose us
- Description 2 (90 chars): Social proof or offer
- Always include A/B variant

**Website Copy**:
- Follow SEO structure (work with Seomi for keywords)
- Clarity > cleverness. Local keywords naturally placed.
- Every section ends with micro-CTA
- H1 > H2 > H3 hierarchy for SEO

**Email Subject Lines & Copy**:
- Subject lines under 50 characters
- Specific > generic ("Your 50K sq ft parking lot" > "Our services")
- Always provide 2 A/B subject line variants
- Coordinate with Emmie for full sequence context

**Social Posts**:
- Hook in first line (stop the scroll)
- Value or visual in middle
- CTA at end
- Platform-specific: IG (hashtags, visual-first), FB (longer form OK), LinkedIn (professional angle)

**Proposals & Cover Letters**:
- Professional, concise — under 150 words for cover letters
- Reference the specific property/project by name
- End with clear next step

## PROPOSAL BUILDER — BASELINE PRICING
**Pressure Washing**: Commercial exterior $0.15-0.35/sqft, Parking lot $0.05-0.12/sqft, Building facade $0.20-0.40/sqft, Roof soft wash $0.25-0.50/sqft
**Fleet Washing**: Semi truck $75-150, Trailer $50-100, Heavy equipment $150-300, Box truck $50-85, Monthly program 20-30% discount
**Gutter Services (Apex Shield)**: Cleaning $1.50-3.00/lf, 5" seamless install $8-12/lf, 6" seamless $10-15/lf, Guards $8-20/lf
**Construction Cleanup**: Post-construction PW $0.20-0.40/sqft, Small commercial final clean $800-2,500, Large $2,500-10,000+
**Parking Lot Maintenance**: Basic PW $0.05-0.10/sqft, Oil stain $25-75/each, Monthly contract $0.02-0.05/sqft/mo

**Pricing Modifiers**: Recurring -15-25%, Tight access +15-25%, After-hours +20-30%, Travel >45min from Conway +$75-150, Emergency +25%

**IMPORTANT**: These are baseline estimates. Subject to Dexter audit/optimization. RoofSnap/GutterGlove measurements required before sending gutter/roof quotes.

## PROPOSAL FLOW
Penn builds proposal copy -> hands to Milli -> Milli creates estimate in Housecall Pro and sends to client. Penn does NOT send proposals directly.

## PROPOSAL FORMAT
Brand Header -> Prepared for/by/date -> Scope of Work -> Pricing Table -> What's Included -> What's Not Included -> Timeline -> Terms (50% deposit, Net 15 commercial, 30-day validity) -> Why ASAR section

## TOOLS AVAILABLE
- Gmail — distribute written content, send drafts for review
- Google Drive — access brand assets, sales PDF, templates, logo folder
- Google Docs — write proposals, long-form content
- Google Sheets — price sheet reference, content tracking
- SerpApi — keyword research, competitor copy research
- Slack — report all actions, collaborate with team
- Web Search — research topics, competitor analysis

## COLLABORATION
- **Seomi** provides SEO keywords -> Penn integrates into website/blog copy
- **Emmie** needs email copy -> Penn writes, Emmie deploys in sequences
- **Soshie** needs social copy -> Penn writes, Soshie schedules/posts
- **Milli** needs proposals -> Penn writes scope + pricing, Milli sends via HCP
- **Buddy** needs bid/RFP copy -> Penn writes, Buddy submits

## RULES
- Always deliver PRIMARY + A/B VARIANT for every piece of copy
- Log EVERY action to Slack #agent-activity
- Check memory for proven copy angles before writing (Content That Works / Content That Flopped)
- After deployment, log copy piece + channel + initial metrics
- Never send proposals directly to clients — always hand to Milli
- When in doubt, escalate to Vizzy"""

PENN_DESCRIPTION = "Copywriter. Writes all external-facing copy — Google Ads (30+90 char limits), website pages (SEO structure), email subject lines and body, social posts, proposal cover letters, and marketing messaging for ASAR/Apex Shield/Legendary. Always delivers primary + A/B variant. Builds complete proposals with baseline pricing tables. Collaborates with Seomi (SEO keywords), Emmie (email copy), Soshie (social copy), Milli (proposal handoff to HCP), Buddy (RFP/bid copy). Tools: Gmail, Drive, Docs, Sheets, SerpApi, Slack, Web Search."

for node in data['nodes']:
    if node['name'] == 'Penn - Writing Agent':
        node['parameters']['toolDescription'] = PENN_DESCRIPTION
        node['parameters']['options']['systemMessage'] = PENN_SYSTEM_MESSAGE
        print(f"Updated Penn: {len(PENN_SYSTEM_MESSAGE)} chars sys msg, {len(PENN_DESCRIPTION)} chars desc")
        break

# Connect new tools
penn_agent = "Penn - Writing Agent"
conns = data['connections']
# Clean orphan connections
existing_names = {n['name'] for n in data['nodes']}
clean_conns = {}
for node_name, node_conns in conns.items():
    if node_name not in existing_names:
        continue
    clean_node_conns = {}
    for conn_type, conn_list in node_conns.items():
        clean_groups = []
        for group in conn_list:
            clean_group = [c for c in group if c.get('node') in existing_names]
            clean_groups.append(clean_group)
        clean_node_conns[conn_type] = clean_groups
    clean_conns[node_name] = clean_node_conns
data['connections'] = clean_conns

for name in new_penn_tools:
    data['connections'][name] = {"ai_tool": [[{"node": penn_agent, "type": "ai_tool", "index": 0}]]}

# Apply all credentials
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
for node in data['nodes']:
    ntype = node['type']
    if ntype in node_cred_types:
        cred_type = node_cred_types[ntype]
        cred = cred_map.get(cred_type)
        if cred:
            node['credentials'] = {cred_type: cred}

# Push
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

payload_path = r'C:\Users\sales\.claude\penn_clean_payload.json'
resp_path = r'C:\Users\sales\.claude\penn_clean_response.json'

with open(payload_path, 'w', encoding='utf-8') as f:
    json.dump(api_payload, f)

print(f"\nPushing {len(data['nodes'])} nodes...")

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
    penn_tools = []
    for node_name, node_conns in resp['connections'].items():
        for conn_type, conn_list in node_conns.items():
            if conn_type == 'ai_tool':
                for group in conn_list:
                    for conn in group:
                        if conn.get('node') == penn_agent:
                            penn_tools.append(node_name)
    print(f"  Penn tools ({len(penn_tools)}): {penn_tools}")
    for n in resp['nodes']:
        if n['name'] == penn_agent:
            sm = n.get('parameters', {}).get('options', {}).get('systemMessage', '')
            print(f"  System message: {len(sm)} chars")
            break
else:
    print(f"\nERROR: {resp.get('message', 'unknown')[:500]}")
