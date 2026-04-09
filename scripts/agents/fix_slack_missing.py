import json, os, uuid

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:/Users/sales/.claude/current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Fetched: {len(data['nodes'])} nodes")

# Check if Slack nodes already exist (avoid duplicates)
existing_names = {n['name'] for n in data['nodes']}

missing_slack = {
    'Slack - Emmie': {
        "agent": "Emmie - Email Agent",
        "desc": "Post email campaign updates, warm lead handoffs, and activity logs to Slack",
        "pos": [1580, 920]
    },
    'Slack - Scouty': {
        "agent": "Scouty - Competitive Analysis Agent",
        "desc": "Post hiring updates, capacity alerts, and recruiting pipeline status to Slack",
        "pos": [2820, 1520]
    },
}

added = 0
for name, info in missing_slack.items():
    if name in existing_names:
        print(f"  SKIP {name} - already exists")
        continue

    node = {
        "parameters": {
            "descriptionType": "manual",
            "toolDescription": info["desc"],
            "authentication": "oAuth2",
            "select": "channel",
            "channelId": {"__rl": True, "mode": "id", "value": "={{ $fromAI('channel', 'Slack channel ID', 'string') }}"},
            "text": "={{ $fromAI('message', 'Message to post', 'string') }}",
            "otherOptions": {}
        },
        "id": str(uuid.uuid4()),
        "name": name,
        "type": "n8n-nodes-base.slackTool",
        "typeVersion": 2.4,
        "position": info["pos"],
        "credentials": {"slackOAuth2Api": {"id": "lopIua3GVl7ESuOs", "name": "Slack OAuth2 API"}}
    }
    data['nodes'].append(node)
    data['connections'][name] = {"ai_tool": [[{"node": info["agent"], "type": "ai_tool", "index": 0}]]}
    print(f"  Added: {name} -> {info['agent']}")
    added += 1

print(f"\nAdded {added} Slack nodes")

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

with open('C:/Users/sales/.claude/slack_fix_payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f)

os.system(f'curl -s -X PUT "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d @"C:/Users/sales/.claude/slack_fix_payload.json" -o "C:/Users/sales/.claude/slack_fix_response.json"')

with open('C:/Users/sales/.claude/slack_fix_response.json', encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    print(f"\nSUCCESS! Nodes: {len(resp['nodes'])}")
    # Verify all agents now have Slack
    agents = {}
    for n in resp['nodes']:
        if n['type'] in ['@n8n/n8n-nodes-langchain.agentTool', '@n8n/n8n-nodes-langchain.agent']:
            agents[n['name']] = False
    for nn, nc in resp['connections'].items():
        if 'slack' in nn.lower():
            for ct, cl in nc.items():
                if ct == 'ai_tool':
                    for g in cl:
                        for c in g:
                            if c.get('node') in agents:
                                agents[c['node']] = True
    print("\nSlack status (all agents):")
    for a, has in sorted(agents.items()):
        print(f"  [{'YES' if has else 'NO'}] {a}")
else:
    print(f"ERROR: {resp.get('message', 'unknown')[:300]}")
