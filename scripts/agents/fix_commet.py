import json, os, uuid, base64

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:/Users/sales/.claude/current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Fetched: {len(data['nodes'])} nodes")

WP_AUTH = base64.b64encode(b"Asons:qWzH 9qXZ z3L4 US1p cQyV GXwk").decode()
commet_agent = "Commet - Data Analysis Agent"

# Add WordPress node
wp_node = {
    "parameters": {
        "toolDescription": "WordPress REST API for americanservicesar.com. Embed HCP booking widgets, update service/package pages.",
        "method": "={{ $fromAI('method', 'GET/POST/PUT', 'string') }}",
        "url": "={{ $fromAI('url', 'WordPress API: https://americanservicesar.com/wp-json/wp/v2/', 'string') }}",
        "sendHeaders": True,
        "headerParameters": {"parameters": [
            {"name": "Authorization", "value": "Basic " + WP_AUTH},
            {"name": "Content-Type", "value": "application/json"}
        ]},
        "sendBody": False, "options": {}
    },
    "type": "n8n-nodes-base.httpRequestTool", "typeVersion": 4.4,
    "position": [3220, 1760], "credentials": {},
    "id": str(uuid.uuid4()), "name": "HTTP - WordPress (Commet)"
}
data['nodes'].append(wp_node)
data['connections']['HTTP - WordPress (Commet)'] = {"ai_tool": [[{"node": commet_agent, "type": "ai_tool", "index": 0}]]}
print("Added: HTTP - WordPress (Commet)")

# Update system message
additions = """

## PRICING STATUS: TBD
All pricing is PRELIMINARY. Before finalizing:
1. Dexter must analyze all past job data from Housecall Pro (costs, margins, profitability)
2. Dexter must research competitor pricing and seasonal trends
3. Pull current HCP pricebook as baseline
4. Present options to Anthony for approval
DO NOT publish any pricing until Dexter completes analysis and Anthony approves.

## ASK ANTHONY PROTOCOL
When you need information or decisions, post to #commet-ecommerce:
"Anthony - Commet needs your input:"
- What specific information you need
- Why (what decision it drives)
- Options you recommend
- When you need the answer
Give Anthony clear options, not open-ended questions.

## HOUSECALL PRO BOOKING
- HCP has embeddable booking widget (script tag for website)
- HCP booking is ALREADY live on GBP
- HCP pricebook = source of truth for all service pricing
- Pull current pricebook via API before any pricing decisions

## WORDPRESS ACCESS
Full admin access to americanservicesar.com via REST API.
Use for: embedding HCP booking widget, creating package pages, updating pricing display."""

for node in data['nodes']:
    if node['name'] == commet_agent:
        sm = node['parameters']['options']['systemMessage']
        if 'PRICING STATUS: TBD' not in sm:
            sm = sm.replace('## SLACK CHANNELS', additions + '\n\n## SLACK CHANNELS')
            node['parameters']['options']['systemMessage'] = sm
            print(f"Updated Commet: {len(sm)} chars")
        break

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

with open('C:/Users/sales/.claude/commet_fix_payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f)

os.system(f'curl -s -X PUT "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d @"C:/Users/sales/.claude/commet_fix_payload.json" -o "C:/Users/sales/.claude/commet_fix_response.json"')

with open('C:/Users/sales/.claude/commet_fix_response.json', encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    print(f"\nSUCCESS! Nodes: {len(resp['nodes'])}")
    tools = []
    for nn, nc in resp['connections'].items():
        for ct, cl in nc.items():
            if ct == 'ai_tool':
                for g in cl:
                    for c in g:
                        if c.get('node') == commet_agent: tools.append(nn)
    print(f"Commet tools ({len(tools)}): {tools}")
    for n in resp['nodes']:
        if n['name'] == commet_agent:
            sm = n.get('parameters',{}).get('options',{}).get('systemMessage','')
            print(f"System message: {len(sm)} chars, TBD: {'TBD' in sm}, Ask Anthony: {'ASK ANTHONY' in sm}")
            break
else:
    print(f"ERROR: {resp.get('message', 'unknown')[:300]}")
