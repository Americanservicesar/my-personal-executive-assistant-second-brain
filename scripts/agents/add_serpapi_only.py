import json, uuid

# Re-fetch current live state
import subprocess
result = subprocess.run([
    'curl', '-s',
    'https://americanservicesar.app.n8n.cloud/api/v1/workflows/JAYrzGWR8A0tCBzB',
    '-H', 'X-N8N-API-KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8'
], capture_output=True, text=True)
data = json.loads(result.stdout)

print(f"Current state: {len(data['nodes'])} nodes")

# Credential mapping for existing nodes (re-apply since GET strips them)
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

# Re-apply credentials to all existing nodes
for node in data['nodes']:
    ntype = node['type']
    if ntype in node_cred_types:
        cred_type = node_cred_types[ntype]
        cred = cred_map.get(cred_type)
        if cred:
            node['credentials'] = {cred_type: cred}

# Add SerpApi node
serpapi_node = {
    "parameters": {
        "options": {}
    },
    "id": str(uuid.uuid4()),
    "name": "SerpApi - Vizzy",
    "type": "@n8n/n8n-nodes-langchain.toolSerpApi",
    "typeVersion": 1,
    "position": [2064 - 800, -650],
    "credentials": {
        "serpApi": {"id": "W674ZSbrWCALEVEp", "name": "SerpAPI account"}
    }
}

data['nodes'].append(serpapi_node)
data['connections']['SerpApi - Vizzy'] = {
    "ai_tool": [[{
        "node": "Vizzy - Supervisor Agent",
        "type": "ai_tool",
        "index": 0
    }]]
}

# Build payload
api_payload = {
    'name': data['name'],
    'nodes': data['nodes'],
    'connections': data['connections'],
    'settings': {'executionOrder': 'v1'}
}

with open(r'C:\Users\sales\.claude\vizzy_api_payload.json', 'w') as f:
    json.dump(api_payload, f)

print(f"Payload: {len(api_payload['nodes'])} nodes, {len(api_payload['connections'])} connections")
print("+ SerpApi - Vizzy added")
