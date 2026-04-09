import json, os, uuid

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

# Create a standalone workflow: Slack -> Vizzy -> Reply
workflow = {
    "name": "ASAR - Slack to Vizzy",
    "nodes": [
        {
            "parameters": {
                "trigger": "message",
                "channelId": ["C0AQPHWL7V4"],
                "options": {}
            },
            "id": str(uuid.uuid4()),
            "name": "Slack Trigger",
            "type": "n8n-nodes-base.slackTrigger",
            "typeVersion": 1,
            "position": [250, 300],
            "credentials": {
                "slackApi": {"id": "6yUg4MuD1ruBxZQY", "name": "Slack account"}
            }
        },
        {
            "parameters": {
                "method": "POST",
                "url": "https://americanservicesar.app.n8n.cloud/webhook/vizzy-from-slack",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        {"name": "Content-Type", "value": "application/json"}
                    ]
                },
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": "={{ JSON.stringify({\"chatInput\": $json.text, \"slackUser\": $json.user, \"slackChannel\": $json.channel, \"slackTs\": $json.ts}) }}",
                "options": {}
            },
            "id": str(uuid.uuid4()),
            "name": "Call Vizzy Webhook",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.2,
            "position": [450, 300]
        },
        {
            "parameters": {
                "authentication": "oAuth2",
                "resource": "message",
                "operation": "post",
                "select": "channel",
                "channelId": {"__rl": True, "mode": "id", "value": "={{ $('Slack Trigger').item.json.channel }}"},
                "messageType": "text",
                "text": "={{ $json.output || $json.body?.output || 'Processing your request...' }}",
                "otherOptions": {
                    "thread_ts": "={{ $('Slack Trigger').item.json.ts }}"
                }
            },
            "id": str(uuid.uuid4()),
            "name": "Reply in Slack",
            "type": "n8n-nodes-base.slack",
            "typeVersion": 2.3,
            "position": [650, 300],
            "credentials": {
                "slackOAuth2Api": {"id": "lopIua3GVl7ESuOs", "name": "Slack OAuth2 API"}
            }
        }
    ],
    "connections": {
        "Slack Trigger": {
            "main": [[{"node": "Call Vizzy Webhook", "type": "main", "index": 0}]]
        },
        "Call Vizzy Webhook": {
            "main": [[{"node": "Reply in Slack", "type": "main", "index": 0}]]
        }
    },
    "settings": {
        "executionOrder": "v1"
    }
}

payload_path = 'C:/Users/sales/.claude/slack_vizzy_wf.json'
resp_path = 'C:/Users/sales/.claude/slack_vizzy_wf_resp.json'

with open(payload_path, 'w', encoding='utf-8') as f:
    json.dump(workflow, f)

print("Creating standalone Slack->Vizzy workflow...")
os.system(f'curl -s -X POST "{BASE}/workflows" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d @"{payload_path}" -o "{resp_path}"')

with open(resp_path, encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    wf_id = resp['id']
    print(f"Created: {resp['name']} (ID: {wf_id})")
    print(f"Nodes: {len(resp['nodes'])}")
    print(f"\nNow go to n8n UI and:")
    print(f"1. Open workflow: https://americanservicesar.app.n8n.cloud/workflow/{wf_id}")
    print(f"2. Open the Slack Trigger node")
    print(f"3. Verify credential is 'Slack account' and trigger is 'On New Message'")
    print(f"4. Verify channel is #vizzy-command")
    print(f"5. ACTIVATE the workflow (toggle ON)")
    print(f"6. Test by messaging in #vizzy-command")
else:
    print(f"ERROR: {resp.get('message', 'unknown')[:500]}")

# Also remove the Slack Trigger nodes from the main workflow to avoid conflicts
print("\nRemoving Slack Trigger from main workflow...")
os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:/Users/sales/.claude/current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

remove = {'Slack Trigger - Vizzy', 'Format Slack for Vizzy', 'Reply in Slack'}
before = len(data['nodes'])
data['nodes'] = [n for n in data['nodes'] if n['name'] not in remove]
after = len(data['nodes'])
print(f"Removed {before - after} nodes from main workflow")

# Clean connections
existing_names = {n['name'] for n in data['nodes']}
clean_conns = {}
for nn, nc in data['connections'].items():
    if nn not in existing_names:
        continue
    clean_nc = {}
    for ct, cl in nc.items():
        clean_groups = []
        for g in cl:
            clean_g = [c for c in g if c.get('node') in existing_names]
            clean_groups.append(clean_g)
        clean_nc[ct] = clean_groups
    clean_conns[nn] = clean_nc
data['connections'] = clean_conns

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

with open('C:/Users/sales/.claude/main_clean.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f)

os.system(f'curl -s -X PUT "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d @"C:/Users/sales/.claude/main_clean.json" -o "C:/Users/sales/.claude/main_clean_resp.json"')

with open('C:/Users/sales/.claude/main_clean_resp.json', encoding='utf-8') as f:
    resp2 = json.load(f)

if 'id' in resp2:
    print(f"Main workflow cleaned: {len(resp2['nodes'])} nodes, Active: {resp2['active']}")
else:
    print(f"Main workflow error: {resp2.get('message', 'unknown')[:300]}")
