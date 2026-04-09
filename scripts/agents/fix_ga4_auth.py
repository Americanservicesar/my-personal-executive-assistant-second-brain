"""
Fix GA4 tool auth — switch from googleApi (service account) to googleOAuth2Api (user OAuth2).
The service account doesn't have the right scopes for GA4.
The user OAuth2 credential (dMFkHV4KEbioauC6) should work since it's the account owner.

Also try switching GBP to googleOAuth2Api since service account invite is pending.
Keep Search Console on googleApi since that one worked.
"""

import json, os

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:/Users/sales/.claude/current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Fetched: {len(data['nodes'])} nodes")

# Switch GA4 and GBP to use googleOAuth2Api
for node in data['nodes']:
    if node['name'] == 'HTTP - Google Analytics 4 (Seomi)':
        node['parameters']['nodeCredentialType'] = 'googleOAuth2Api'
        node['credentials'] = {
            'googleOAuth2Api': {'id': 'dMFkHV4KEbioauC6', 'name': 'Google account'}
        }
        print(f"Fixed: {node['name']} -> googleOAuth2Api")

    elif node['name'] == 'HTTP - Google Business Profile (Seomi)':
        node['parameters']['nodeCredentialType'] = 'googleOAuth2Api'
        node['credentials'] = {
            'googleOAuth2Api': {'id': 'dMFkHV4KEbioauC6', 'name': 'Google account'}
        }
        print(f"Fixed: {node['name']} -> googleOAuth2Api")

# Apply all other credentials
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
nct = {
    'n8n-nodes-base.gmailTool': 'gmailOAuth2',
    '@n8n/n8n-nodes-langchain.lmChatAnthropic': 'anthropicApi',
    'n8n-nodes-base.googleCalendarTool': 'googleCalendarOAuth2Api',
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
    if n['type'] in nct:
        ct = nct[n['type']]
        if ct in cred_map:
            n['credentials'] = {ct: cred_map[ct]}
    if n['type'] == 'n8n-nodes-base.slackTool':
        if n['name'] == 'Slack Tool - Vizzy':
            n['credentials'] = {'slackApi': {'id': '6yUg4MuD1ruBxZQY', 'name': 'Slack account'}}
        else:
            n['credentials'] = {'slackOAuth2Api': cred_map['slackOAuth2Api']}

api_payload = {
    'name': data['name'],
    'nodes': data['nodes'],
    'connections': data['connections'],
    'settings': {'executionOrder': 'v1', 'errorWorkflow': 'TL5bO1l7QCI3XIAm', 'callerPolicy': 'workflowsFromSameOwner', 'availableInMCP': True}
}

with open('C:/Users/sales/.claude/ga4_fix_payload.json', 'w', encoding='utf-8') as f:
    json.dump(api_payload, f)

print(f"\nPushing {len(data['nodes'])} nodes...")
os.system(f'curl -s -X PUT "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d @"C:/Users/sales/.claude/ga4_fix_payload.json" -o "C:/Users/sales/.claude/ga4_fix_response.json"')

with open('C:/Users/sales/.claude/ga4_fix_response.json', encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    print(f"\nSUCCESS! Nodes: {len(resp['nodes'])}")
    # Verify the auth config on Google tools
    for n in resp['nodes']:
        if 'Google' in n['name'] and 'Seomi' in n['name'] and 'HTTP' in n['name']:
            auth = n.get('parameters', {}).get('nodeCredentialType', 'none')
            creds = list(n.get('credentials', {}).keys())
            print(f"  {n['name']}: credType={auth}, creds={creds}")
else:
    print(f"\nERROR: {resp.get('message', 'unknown')[:500]}")
