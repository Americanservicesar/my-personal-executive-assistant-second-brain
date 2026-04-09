import json, os, uuid

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

SLACK_BOT_CRED = {"id": "6yUg4MuD1ruBxZQY", "name": "Slack account"}

os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:/Users/sales/.claude/current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Fetched: {len(data['nodes'])} nodes")

existing_names = {n['name'] for n in data['nodes']}

if 'Slack Trigger - Vizzy' not in existing_names:
    # 1. Slack Trigger
    data['nodes'].append({
        "parameters": {
            "trigger": "message",
            "channelId": ["C0AQPHWL7V4"],
            "options": {}
        },
        "id": str(uuid.uuid4()),
        "name": "Slack Trigger - Vizzy",
        "type": "n8n-nodes-base.slackTrigger",
        "typeVersion": 1,
        "position": [1200, 1800],
        "credentials": {"slackApi": SLACK_BOT_CRED}
    })
    print("Added: Slack Trigger - Vizzy")

    # 2. Format Slack Input
    data['nodes'].append({
        "parameters": {
            "mode": "manual",
            "duplicateItem": False,
            "assignments": {"assignments": [
                {"id": str(uuid.uuid4()), "name": "chatInput", "value": "={{ $json.text }}", "type": "string"},
                {"id": str(uuid.uuid4()), "name": "slackUser", "value": "={{ $json.user }}", "type": "string"},
                {"id": str(uuid.uuid4()), "name": "slackChannel", "value": "={{ $json.channel }}", "type": "string"},
                {"id": str(uuid.uuid4()), "name": "slackTs", "value": "={{ $json.ts }}", "type": "string"}
            ]}
        },
        "id": str(uuid.uuid4()),
        "name": "Format Slack for Vizzy",
        "type": "n8n-nodes-base.set",
        "typeVersion": 3.4,
        "position": [1400, 1800]
    })
    print("Added: Format Slack for Vizzy")

    # 3. Reply in Slack (thread reply)
    data['nodes'].append({
        "parameters": {
            "authentication": "oAuth2",
            "resource": "message",
            "operation": "post",
            "select": "channel",
            "channelId": {"__rl": True, "mode": "id", "value": "={{ $('Format Slack for Vizzy').item.json.slackChannel }}"},
            "messageType": "text",
            "text": "={{ $json.output }}",
            "otherOptions": {
                "thread_ts": "={{ $('Format Slack for Vizzy').item.json.slackTs }}"
            }
        },
        "id": str(uuid.uuid4()),
        "name": "Reply in Slack",
        "type": "n8n-nodes-base.slack",
        "typeVersion": 2.3,
        "position": [2400, 1800],
        "credentials": {"slackOAuth2Api": {"id": "lopIua3GVl7ESuOs", "name": "Slack OAuth2 API"}}
    })
    print("Added: Reply in Slack")

    # Connect the flow
    conns = data['connections']
    conns['Slack Trigger - Vizzy'] = {"main": [[{"node": "Format Slack for Vizzy", "type": "main", "index": 0}]]}
    conns['Format Slack for Vizzy'] = {"main": [[{"node": "Vizzy - Supervisor Agent", "type": "main", "index": 0}]]}

    # Add Reply to Vizzy's outputs
    if 'Vizzy - Supervisor Agent' in conns and 'main' in conns['Vizzy - Supervisor Agent']:
        conns['Vizzy - Supervisor Agent']['main'][0].append({"node": "Reply in Slack", "type": "main", "index": 0})

    print("Connected: Slack Trigger -> Format -> Vizzy -> Reply in Slack")

# Apply credentials
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

with open('C:/Users/sales/.claude/slack_trigger_final.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f)

print(f"\nPushing {len(data['nodes'])} nodes...")
os.system(f'curl -s -X PUT "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d @"C:/Users/sales/.claude/slack_trigger_final.json" -o "C:/Users/sales/.claude/slack_trigger_final_resp.json"')

with open('C:/Users/sales/.claude/slack_trigger_final_resp.json', encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    print(f"\nSUCCESS! Nodes: {len(resp['nodes'])}, Active: {resp['active']}")
    for n in resp['nodes']:
        if 'Slack Trigger' in n['name'] or 'Format Slack' in n['name'] or 'Reply in Slack' in n['name']:
            print(f"  {n['name']} ({n['type']})")
else:
    print(f"\nERROR: {resp.get('message', 'unknown')[:500]}")
