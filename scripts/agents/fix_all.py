import json, subprocess, uuid

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

# Step 1: Try to create HighLevel OAuth2 credential using the private integration token
print("=== Step 1: Create HighLevel OAuth2 credential ===")
hl_cred_payload = json.dumps({
    "name": "HighLevel Private Integration",
    "type": "highLevelOAuth2Api",
    "data": {
        "oauthTokenData": {
            "access_token": "pit-9f981ca1-b6b2-4e1c-a9b0-2f39a4a81fb9",
            "token_type": "Bearer"
        }
    }
})

result = subprocess.run([
    'curl', '-s', '-X', 'POST', f'{BASE}/credentials',
    '-H', f'X-N8N-API-KEY: {API_KEY}',
    '-H', 'Content-Type: application/json',
    '-d', hl_cred_payload
], capture_output=True, text=True)
print(f"Create HL cred response: {result.stdout[:500]}")

hl_cred_id = None
try:
    resp = json.loads(result.stdout)
    if 'id' in resp:
        hl_cred_id = resp['id']
        print(f"Created HighLevel credential: {hl_cred_id}")
    else:
        print(f"Failed to create: {resp.get('message', 'unknown error')}")
except:
    print(f"Parse error: {result.stdout[:200]}")

# Step 2: Fetch current workflow
print("\n=== Step 2: Fetch current workflow ===")
result = subprocess.run([
    'curl', '-s', f'{BASE}/workflows/JAYrzGWR8A0tCBzB',
    '-H', f'X-N8N-API-KEY: {API_KEY}'
], capture_output=True, text=True)
data = json.loads(result.stdout)
print(f"Current nodes: {len(data['nodes'])}")

# Step 3: Remove duplicate SerpApi if exists
node_names = [n['name'] for n in data['nodes']]
serpapi_count = node_names.count('SerpApi - Vizzy')
print(f"SerpApi - Vizzy instances: {serpapi_count}")
if serpapi_count > 1:
    # Keep only the first one
    seen = False
    filtered = []
    for n in data['nodes']:
        if n['name'] == 'SerpApi - Vizzy':
            if not seen:
                seen = True
                filtered.append(n)
            else:
                print(f"  Removing duplicate SerpApi node {n['id']}")
        else:
            filtered.append(n)
    data['nodes'] = filtered

# Step 4: Apply all credentials
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

if hl_cred_id:
    cred_map['highLevelOAuth2Api'] = {'id': hl_cred_id, 'name': 'HighLevel Private Integration'}

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
    'n8n-nodes-base.highLevelTool': 'highLevelOAuth2Api',
    'n8n-nodes-base.googleDocsTool': 'googleDocsOAuth2Api',
}

# Google Docs uses the generic Google OAuth2
cred_map['googleDocsOAuth2Api'] = {'id': 'dMFkHV4KEbioauC6', 'name': 'Google account'}

missing = []
for node in data['nodes']:
    ntype = node['type']
    if ntype in node_cred_types:
        cred_type = node_cred_types[ntype]
        cred = cred_map.get(cred_type)
        if cred:
            node['credentials'] = {cred_type: cred}
        else:
            missing.append(f"{node['name']} needs {cred_type}")

if missing:
    print(f"\nStill missing credentials:")
    for m in missing:
        print(f"  - {m}")

# Step 5: Fix Google Docs parameters - try with folderId added
for n in data['nodes']:
    if n['name'] == 'Google Docs - Vizzy':
        n['parameters'] = {
            'resource': 'document',
            'operation': 'create',
            'title': "={{ $fromAI('title', 'Document title', 'string') }}",
            'folderId': 'root'
        }
        print(f"\nFixed Google Docs params: {json.dumps(n['parameters'])}")

# Step 6: Save and report
api_payload = {
    'name': data['name'],
    'nodes': data['nodes'],
    'connections': data['connections'],
    'settings': {'executionOrder': 'v1'}
}

with open(r'C:\Users\sales\.claude\vizzy_api_payload.json', 'w') as f:
    json.dump(api_payload, f)

print(f"\nFinal payload: {len(api_payload['nodes'])} nodes")
