import json, uuid, os

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

# Step 1: Refresh credentials list to find the new Google Docs OAuth2 credential
os.system(f'curl -s "{BASE}/credentials" -H "X-N8N-API-KEY: {API_KEY}" -o "C:\\Users\\sales\\.claude\\creds.json"')

with open(r'C:\Users\sales\.claude\creds.json', encoding='utf-8') as f:
    creds_data = json.load(f)

creds_list = creds_data.get('data', creds_data) if isinstance(creds_data, dict) else creds_data
print("=== Current Credentials ===")
gdocs_cred = None
for c in creds_list:
    print(f"  {c['id']:>20}  {c['type']:<35}  {c['name']}")
    if 'googleDocs' in c['type'].lower() or 'googledocs' in c['type'].lower():
        gdocs_cred = c
    # Also catch generic google oauth that might be for docs
    if c['type'] == 'googleDocsOAuth2Api':
        gdocs_cred = c

if gdocs_cred:
    print(f"\nFound Google Docs credential: {gdocs_cred['id']} ({gdocs_cred['type']})")
else:
    print("\nNo googleDocsOAuth2Api credential found yet. Checking for alternatives...")
    # Try googleOAuth2Api as fallback
    for c in creds_list:
        if c['type'] == 'googleOAuth2Api':
            gdocs_cred = {'id': c['id'], 'name': c['name'], 'type': 'googleDocsOAuth2Api'}
            print(f"  Using googleOAuth2Api as fallback: {c['id']}")
            break

if not gdocs_cred:
    print("ERROR: No suitable credential found for Google Docs")
    exit(1)

# Step 2: Fetch current workflow
os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:\\Users\\sales\\.claude\\current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"\nCurrent workflow: {len(data['nodes'])} nodes")

# Check if Google Docs node already exists
gdocs_exists = any(n['name'] == 'Google Docs - Vizzy' for n in data['nodes'])
if gdocs_exists:
    print("Google Docs - Vizzy already exists, skipping add")
else:
    # Add Google Docs node
    gdocs_node = {
        "parameters": {
            "resource": "document",
            "operation": "create",
            "title": "={{ $fromAI('title', 'Document title', 'string') }}",
            "folderId": "root"
        },
        "id": str(uuid.uuid4()),
        "name": "Google Docs - Vizzy",
        "type": "n8n-nodes-base.googleDocsTool",
        "typeVersion": 2,
        "position": [1264 + 250 * 4, -650],
        "credentials": {
            "googleDocsOAuth2Api": {"id": gdocs_cred['id'], "name": gdocs_cred['name']}
        }
    }
    data['nodes'].append(gdocs_node)
    data['connections']['Google Docs - Vizzy'] = {
        "ai_tool": [[{"node": "Vizzy - Supervisor Agent", "type": "ai_tool", "index": 0}]]
    }
    print(f"Added Google Docs - Vizzy with credential {gdocs_cred['id']}")

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
    'googleDocsOAuth2Api': {'id': gdocs_cred['id'], 'name': gdocs_cred['name']},
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

api_payload = {
    'name': data['name'],
    'nodes': data['nodes'],
    'connections': data['connections'],
    'settings': {'executionOrder': 'v1'}
}

with open(r'C:\Users\sales\.claude\vizzy_api_payload.json', 'w', encoding='utf-8') as f:
    json.dump(api_payload, f)

print(f"Payload ready: {len(api_payload['nodes'])} nodes")
