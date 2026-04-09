import json, os, uuid

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:/Users/sales/.claude/current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Fetched: {len(data['nodes'])} nodes")

seomi_agent = "Seomi - SEO Agent"
base_x = 2920
base_y = 600

BING_API_KEY = "2caa0cb7527543f8b6a2d79182075df8"
MOZ_AUTH = "bW96c2NhcGUtYTlyMFVsdVh1dTp3MVFiQ0QwME1OTlJnenV0TUtSOHVoWkJLVlozd2xZTQ=="

new_nodes = {
    'HTTP - Bing Webmaster (Seomi)': {
        "parameters": {
            "toolDescription": "Bing Webmaster Tools API (FREE) — Check Bing rankings, submit URLs for indexing, get backlink data, crawl stats. Use for: URL submission (POST /webmaster/api.svc/json/SubmitUrl), get backlinks (GET /webmaster/api.svc/json/GetLinkCounts), keyword data, crawl stats. Base URL: https://ssl.bing.com/webmaster/api.svc/json/",
            "method": "={{ $fromAI('method', 'HTTP method: GET for data retrieval, POST for URL submission', 'string') }}",
            "url": "={{ $fromAI('url', 'Bing Webmaster API URL. Base: https://ssl.bing.com/webmaster/api.svc/json/. Endpoints: GetLinkCounts?siteUrl=https://americanservicesar.com, SubmitUrl, GetCrawlStats?siteUrl=https://americanservicesar.com, GetQueryStats?siteUrl=https://americanservicesar.com', 'string') }}",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Content-Type", "value": "application/json"}
            ]},
            "sendQuery": True,
            "queryParameters": {"parameters": [
                {"name": "apikey", "value": BING_API_KEY}
            ]},
            "sendBody": False,
            "options": {}
        },
        "type": "n8n-nodes-base.httpRequestTool", "typeVersion": 4.4,
        "position": [base_x, base_y], "credentials": {}
    },
    'HTTP - Moz API (Seomi)': {
        "parameters": {
            "toolDescription": "Moz Links API (FREE tier — 50 requests/month) — Check Domain Authority (DA), Page Authority (PA), backlink counts, spam score for any URL. Use for: competitor DA comparison, backlink analysis, finding link building opportunities. Endpoint: POST https://lsapi.seomoz.com/v2/url_metrics",
            "method": "POST",
            "url": "https://lsapi.seomoz.com/v2/url_metrics",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Authorization", "value": f"Basic {MOZ_AUTH}"},
                {"name": "Content-Type", "value": "application/json"}
            ]},
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": "={{ $fromAI('body', 'JSON body for Moz API. Example: {\"targets\": [\"americanservicesar.com\"]} to check DA/PA. Can check up to 50 URLs per request. Response includes domain_authority, page_authority, spam_score, links_external, links_root_domains.', 'string') }}",
            "options": {}
        },
        "type": "n8n-nodes-base.httpRequestTool", "typeVersion": 4.4,
        "position": [base_x, base_y + 160], "credentials": {}
    },
    'HTTP - Broken Link Checker (Seomi)': {
        "parameters": {
            "toolDescription": "Internal link checker — Use to check if any URL on americanservicesar.com returns a 404/broken link. Send a GET request to any page URL and check the HTTP status code. Use this to crawl your own site for broken links by checking each page's internal links.",
            "method": "GET",
            "url": "={{ $fromAI('url', 'The full URL to check for broken links, e.g. https://americanservicesar.com/some-page/', 'string') }}",
            "sendHeaders": False,
            "sendBody": False,
            "options": {"redirect": {"redirect": {"followRedirects": True, "maxRedirects": 5}}, "timeout": 10000}
        },
        "type": "n8n-nodes-base.httpRequestTool", "typeVersion": 4.4,
        "position": [base_x, base_y + 320], "credentials": {}
    },
}

for name, defn in new_nodes.items():
    node = {"id": str(uuid.uuid4()), "name": name}
    node.update(defn)
    data['nodes'].append(node)
    print(f"Added: {name}")

conns = data['connections']
for name in new_nodes:
    conns[name] = {"ai_tool": [[{"node": seomi_agent, "type": "ai_tool", "index": 0}]]}

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

api_payload = {'name': data['name'], 'nodes': data['nodes'], 'connections': data['connections'],
    'settings': {'executionOrder': 'v1', 'errorWorkflow': 'TL5bO1l7QCI3XIAm', 'callerPolicy': 'workflowsFromSameOwner', 'availableInMCP': True}}

with open('C:/Users/sales/.claude/seomi_tools_payload.json', 'w', encoding='utf-8') as f:
    json.dump(api_payload, f)

print(f"\nPushing {len(data['nodes'])} nodes...")
os.system(f'curl -s -X PUT "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d @"C:/Users/sales/.claude/seomi_tools_payload.json" -o "C:/Users/sales/.claude/seomi_tools_response.json"')

with open('C:/Users/sales/.claude/seomi_tools_response.json', encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    print(f"\nSUCCESS!")
    print(f"  Nodes: {len(resp['nodes'])}")
    tools = []
    for nn, nc in resp['connections'].items():
        for ct, cl in nc.items():
            if ct == 'ai_tool':
                for g in cl:
                    for c in g:
                        if c.get('node') == seomi_agent: tools.append(nn)
    print(f"  Seomi tools ({len(tools)}): {tools}")
else:
    print(f"\nERROR: {resp.get('message', 'unknown')[:500]}")
