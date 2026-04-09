import json, os, uuid, base64

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:/Users/sales/.claude/current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Fetched: {len(data['nodes'])} nodes")

# WordPress auth header (Basic Auth with Application Password)
WP_USER = "Asons"
WP_APP_PASS = "qWzH 9qXZ z3L4 US1p cQyV GXwk"
WP_AUTH = base64.b64encode(f"{WP_USER}:{WP_APP_PASS}".encode()).decode()

seomi_agent = "Seomi - SEO Agent"
base_x = 2720
base_y = 600

new_nodes = {
    'HTTP - WordPress (Seomi)': {
        "parameters": {
            "toolDescription": "WordPress REST API for americanservicesar.com — Create/edit pages, posts, manage media, update SEO meta via RankMath. Site has 80 published pages, Elementor, RankMath SEO PRO, Search Atlas SEO, Ahrefs SEO, WP Rocket, Imagify. Endpoints: GET/POST /wp-json/wp/v2/pages, /wp-json/wp/v2/posts, /wp-json/wp/v2/media, /wp-json/rankmath/v1/. Always use https://americanservicesar.com as base URL.",
            "method": "={{ $fromAI('method', 'HTTP method: GET to read, POST to create, PUT/PATCH to update, DELETE to remove', 'string') }}",
            "url": "={{ $fromAI('url', 'WordPress REST API URL. Base: https://americanservicesar.com/wp-json/wp/v2/. Examples: .../pages (list/create pages), .../posts (list/create posts), .../media (upload images), .../pages/ID (get/update specific page)', 'string') }}",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Authorization", "value": f"Basic {WP_AUTH}"},
                {"name": "Content-Type", "value": "application/json"}
            ]},
            "sendBody": False,
            "options": {}
        },
        "type": "n8n-nodes-base.httpRequestTool", "typeVersion": 4.4,
        "position": [base_x, base_y], "credentials": {}
    },
    'HTTP - PageSpeed Insights (Seomi)': {
        "parameters": {
            "toolDescription": "Google PageSpeed Insights API (FREE) — Check page speed, Core Web Vitals, mobile/desktop scores. No API key needed. Returns performance score, FCP, LCP, CLS, TBT metrics.",
            "method": "GET",
            "url": "={{ $fromAI('url', 'PageSpeed API URL. Format: https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=ENCODED_URL&strategy=mobile (or desktop)', 'string') }}",
            "sendHeaders": False,
            "sendBody": False,
            "options": {}
        },
        "type": "n8n-nodes-base.httpRequestTool", "typeVersion": 4.4,
        "position": [base_x, base_y + 160], "credentials": {}
    },
    'HTTP - RankMath API (Seomi)': {
        "parameters": {
            "toolDescription": "RankMath SEO REST API — Read and update SEO meta (title, description, focus keyword, schema) for pages/posts on americanservicesar.com. Endpoints: GET/POST /wp-json/rankmath/v1/. RankMath PRO is installed and active.",
            "method": "={{ $fromAI('method', 'HTTP method: GET to read SEO data, POST/PUT to update', 'string') }}",
            "url": "={{ $fromAI('url', 'RankMath API URL on americanservicesar.com. Base: https://americanservicesar.com/wp-json/rankmath/v1/', 'string') }}",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Authorization", "value": f"Basic {WP_AUTH}"},
                {"name": "Content-Type", "value": "application/json"}
            ]},
            "sendBody": False,
            "options": {}
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

# Also update Seomi's system message to include WordPress details
for node in data['nodes']:
    if node['name'] == seomi_agent:
        sm = node['parameters']['options']['systemMessage']
        if 'WORDPRESS ADMIN ACCESS' not in sm:
            wp_addendum = """

## WORDPRESS ADMIN ACCESS
You have full REST API access to americanservicesar.com:
- **80 published pages** currently live
- **Plugins installed**: RankMath SEO PRO, Search Atlas SEO, Ahrefs SEO, Elementor + Pro, WP Rocket (caching), Imagify (image optimization), Gravity Forms, Business Reviews Bundle, LeadConnector (GHL)
- **Use WordPress HTTP tool** for: creating/editing pages, publishing posts, uploading media
- **Use RankMath API tool** for: updating SEO titles, meta descriptions, focus keywords, schema markup
- **Use PageSpeed Insights tool** for: checking Core Web Vitals, page speed scores, mobile/desktop performance
- Current pages include city pages (Little Rock, NLR, Sherwood, Maumelle, etc.) + service pages (Pressure Washing, Soft Washing, Window Cleaning, etc.) + blog posts
- **GAP**: Need service+city combination pages (e.g., "Gutter Cleaning Conway AR") — use content matrix to track what's missing"""
            sm = sm.replace('## SLACK CHANNELS', wp_addendum + '\n\n## SLACK CHANNELS')
            node['parameters']['options']['systemMessage'] = sm
            print(f"Updated Seomi system message: {len(sm)} chars")
        break

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

with open('C:/Users/sales/.claude/seomi_wp_payload.json', 'w', encoding='utf-8') as f:
    json.dump(api_payload, f)

print(f"Pushing {len(data['nodes'])} nodes...")
os.system(f'curl -s -X PUT "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d @"C:/Users/sales/.claude/seomi_wp_payload.json" -o "C:/Users/sales/.claude/seomi_wp_response.json"')

with open('C:/Users/sales/.claude/seomi_wp_response.json', encoding='utf-8') as f:
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
    for n in resp['nodes']:
        if n['name'] == seomi_agent:
            sm = n.get('parameters',{}).get('options',{}).get('systemMessage','')
            print(f"  System message: {len(sm)} chars")
            break
else:
    print(f"\nERROR: {resp.get('message', 'unknown')[:500]}")
