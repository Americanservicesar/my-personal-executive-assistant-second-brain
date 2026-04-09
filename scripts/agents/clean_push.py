import json, os

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

# Fetch current via curl writing to file
os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:\\Users\\sales\\.claude\\current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Current: {len(data['nodes'])} nodes")

# Remove problematic nodes that can't get credentials via API
remove_names = {
    'HighLevel - Contacts (Vizzy)',
    'HighLevel - Opportunities (Vizzy)',
    'HighLevel - Tasks (Vizzy)',
    'Google Docs - Vizzy',
}

# Also remove any duplicate SerpApi
seen_serpapi = False
filtered_nodes = []
for n in data['nodes']:
    if n['name'] in remove_names:
        print(f"  Removing: {n['name']}")
        continue
    if n['name'] == 'SerpApi - Vizzy':
        if seen_serpapi:
            print(f"  Removing duplicate: SerpApi - Vizzy")
            continue
        seen_serpapi = True
    filtered_nodes.append(n)

# If no SerpApi exists, add it
if not seen_serpapi:
    import uuid
    filtered_nodes.append({
        "parameters": {"options": {}},
        "id": str(uuid.uuid4()),
        "name": "SerpApi - Vizzy",
        "type": "@n8n/n8n-nodes-langchain.toolSerpApi",
        "typeVersion": 1,
        "position": [1264, -650]
    })
    print("  Added: SerpApi - Vizzy")

data['nodes'] = filtered_nodes

# Remove connections for removed nodes
for name in remove_names:
    data['connections'].pop(name, None)

# Ensure SerpApi connection exists
if 'SerpApi - Vizzy' not in data['connections']:
    data['connections']['SerpApi - Vizzy'] = {
        "ai_tool": [[{"node": "Vizzy - Supervisor Agent", "type": "ai_tool", "index": 0}]]
    }

# Apply ALL credentials
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
}

assigned = 0
for node in data['nodes']:
    ntype = node['type']
    if ntype in node_cred_types:
        cred_type = node_cred_types[ntype]
        cred = cred_map.get(cred_type)
        if cred:
            node['credentials'] = {cred_type: cred}
            assigned += 1

print(f"\nCredentials assigned to {assigned} nodes")

# Build clean payload
api_payload = {
    'name': data['name'],
    'nodes': data['nodes'],
    'connections': data['connections'],
    'settings': {'executionOrder': 'v1'}
}

with open(r'C:\Users\sales\.claude\vizzy_api_payload.json', 'w', encoding='utf-8') as f:
    json.dump(api_payload, f)

print(f"Final: {len(api_payload['nodes'])} nodes, {len(api_payload['connections'])} connections")
