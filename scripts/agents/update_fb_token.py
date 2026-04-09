import json, os, uuid

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:\\Users\\sales\\.claude\\current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Fetched: {len(data['nodes'])} nodes")

NEW_PAGE_TOKEN = "EAAbwr76nwXUBRLIfXiXVAg9ZAKOUwVn9oZADWEao1HW0Umv1lMtm5yHstpdd0rB5KzrPf3NE2lMxM2fCRZC6CZBXAP32sncwcGW5aXjZCsRDpzUyR0fRPapZBLD0DAj5uSqgMNM5OZAs7P8AfzIObYNZCwxlDWZCnfowLTj2GFtcud5QgKZBJYPZBFhiHjrEiGoa6jxMjf1K8YQ0SWv1ZCr8um2tHgZDZD"
FB_PAGE_ID = "293488501278927"

# Find and update the Facebook node
for node in data['nodes']:
    if node['name'] == 'HTTP - Facebook Post (Soshie)':
        node['parameters'] = {
            "toolDescription": f"Facebook Graph API — Post to American Services AR Facebook Page (ID: {FB_PAGE_ID}). Use POST /{FB_PAGE_ID}/feed for text/link posts, POST /{FB_PAGE_ID}/photos for photo posts. Access token is included automatically.",
            "method": "POST",
            "url": f"={{{{ $fromAI('url', 'Facebook Graph API URL. For text posts: https://graph.facebook.com/v19.0/{FB_PAGE_ID}/feed. For photo posts: https://graph.facebook.com/v19.0/{FB_PAGE_ID}/photos', 'string') }}}}",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Content-Type", "value": "application/json"}
            ]},
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": f"={{{{ $fromAI('body', 'JSON body. For text post: {{\"message\": \"Your post text\", \"access_token\": \"{NEW_PAGE_TOKEN}\"}}. For photo post: {{\"url\": \"image_url\", \"message\": \"caption\", \"access_token\": \"{NEW_PAGE_TOKEN}\"}}. For link post: {{\"message\": \"text\", \"link\": \"url\", \"access_token\": \"{NEW_PAGE_TOKEN}\"}}', 'string') }}}}",
            "options": {}
        }
        print(f"Updated FB node with new token")
        break

# Apply credentials
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
for n in data['nodes']:
    ntype = n['type']
    if ntype in node_cred_types:
        cred_type = node_cred_types[ntype]
        cred = cred_map.get(cred_type)
        if cred:
            n['credentials'] = {cred_type: cred}

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

payload_path = r'C:\Users\sales\.claude\fb_token_payload.json'
resp_path = r'C:\Users\sales\.claude\fb_token_response.json'

with open(payload_path, 'w', encoding='utf-8') as f:
    json.dump(api_payload, f)

print(f"Pushing {len(data['nodes'])} nodes...")

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
    print(f"\nSUCCESS! Nodes: {len(resp['nodes'])}, Active: {resp['active']}")
else:
    print(f"\nERROR: {resp.get('message', 'unknown')[:500]}")
