"""
Update Seomi's Google API tools to use Service Account credential
instead of the $fromAI('access_token') hack.

- Google Search Console → service account auth
- Google Analytics 4 → service account auth + hardcoded Property ID 315915509
- Google Business Profile → service account auth (pending access)
"""

import json, os, uuid, base64

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

# Step 1: Fetch current workflow
os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:/Users/sales/.claude/current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Fetched: {len(data['nodes'])} nodes")

GA4_PROPERTY_ID = "315915509"

# Updated tool definitions — using n8n's built-in httpRequestTool with
# predefined credential type for Google Service Account
# The service account credential handles token generation automatically.

updates = {
    'HTTP - Google Search Console (Seomi)': {
        "parameters": {
            "toolDescription": f"""Google Search Console API — Real search performance data for americanservicesar.com.
USE FOR: clicks, impressions, CTR, average position by query/page/date. Index coverage. URL inspection. Sitemap status.
Authentication is automatic via service account.

KEY ENDPOINTS:
- POST https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Famericanservicesar.com/searchAnalytics/query
  Body: {{"startDate":"2026-03-01","endDate":"2026-04-01","dimensions":["query","page"],"rowLimit":100}}
  Dimensions: query, page, country, device, date, searchAppearance
  Metrics returned: clicks, impressions, ctr, position

- GET https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Famericanservicesar.com/sitemaps
  Returns list of submitted sitemaps with status

- POST https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Famericanservicesar.com/urlInspection/index:inspect
  Body: {{"inspectionUrl":"https://americanservicesar.com/page-slug/","siteUrl":"https://americanservicesar.com/"}}
  Returns index status, crawl info, mobile usability

TIPS: Use startRow for pagination. Max rowLimit is 25000. Sort by clicks desc for top queries.""",
            "method": "={{ $fromAI('method', 'HTTP method: POST for searchAnalytics/query and urlInspection, GET for sitemaps', 'string') }}",
            "url": "={{ $fromAI('url', 'Google Search Console API URL. Site property is https://americanservicesar.com (URL-encoded: https%3A%2F%2Famericanservicesar.com). Base: https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Famericanservicesar.com/', 'string') }}",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Content-Type", "value": "application/json"}
            ]},
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": "={{ $fromAI('body', 'JSON request body. For searchAnalytics: {\"startDate\":\"YYYY-MM-DD\",\"endDate\":\"YYYY-MM-DD\",\"dimensions\":[\"query\"],\"rowLimit\":100}. For urlInspection: {\"inspectionUrl\":\"URL\",\"siteUrl\":\"https://americanservicesar.com/\"}. For GET requests use empty object {}.', 'string') }}",
            "options": {},
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "googleApi"
        },
        "type": "n8n-nodes-base.httpRequestTool", "typeVersion": 4.4,
        "credentials": {
            "googleApi": {"id": "nWnxAUry9O6tRyTm", "name": "Google Service Account account"}
        }
    },
    'HTTP - Google Analytics 4 (Seomi)': {
        "parameters": {
            "toolDescription": f"""Google Analytics 4 Data API — Traffic and behavior data for americanservicesar.com.
GA4 Property ID: {GA4_PROPERTY_ID} (already configured in the URL below — do NOT change it).
Authentication is automatic via service account.

ENDPOINT: POST https://analyticsdata.googleapis.com/v1beta/properties/{GA4_PROPERTY_ID}:runReport

EXAMPLE BODIES:
1. Top pages by sessions (last 30 days):
   {{"dateRanges":[{{"startDate":"30daysAgo","endDate":"today"}}],"dimensions":[{{"name":"pagePath"}}],"metrics":[{{"name":"sessions"}},{{"name":"screenPageViews"}},{{"name":"bounceRate"}},{{"name":"averageSessionDuration"}}],"limit":50,"orderBys":[{{"metric":{{"metricName":"sessions"}},"desc":true}}]}}

2. Traffic sources:
   {{"dateRanges":[{{"startDate":"30daysAgo","endDate":"today"}}],"dimensions":[{{"name":"sessionSource"}},{{"name":"sessionMedium"}}],"metrics":[{{"name":"sessions"}},{{"name":"totalUsers"}},{{"name":"conversions"}}],"limit":25}}

3. Daily trend:
   {{"dateRanges":[{{"startDate":"30daysAgo","endDate":"today"}}],"dimensions":[{{"name":"date"}}],"metrics":[{{"name":"sessions"}},{{"name":"totalUsers"}}]}}

4. Device breakdown:
   {{"dateRanges":[{{"startDate":"30daysAgo","endDate":"today"}}],"dimensions":[{{"name":"deviceCategory"}}],"metrics":[{{"name":"sessions"}},{{"name":"bounceRate"}}]}}

5. City-level traffic (for local SEO):
   {{"dateRanges":[{{"startDate":"30daysAgo","endDate":"today"}}],"dimensions":[{{"name":"city"}}],"metrics":[{{"name":"sessions"}},{{"name":"totalUsers"}}],"limit":30}}

DIMENSIONS: pagePath, pageTitle, sessionSource, sessionMedium, city, region, deviceCategory, date, landingPage, sessionDefaultChannelGroup
METRICS: sessions, totalUsers, newUsers, bounceRate, averageSessionDuration, screenPageViews, conversions, engagementRate, engagedSessions
DATE RANGES: Use relative (7daysAgo, 30daysAgo, 90daysAgo, today) or absolute (YYYY-MM-DD)""",
            "method": "POST",
            "url": f"https://analyticsdata.googleapis.com/v1beta/properties/{GA4_PROPERTY_ID}:runReport",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Content-Type", "value": "application/json"}
            ]},
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": "={{ $fromAI('body', 'GA4 report request body JSON. Must include dateRanges, dimensions, and metrics arrays. Example: {\"dateRanges\":[{\"startDate\":\"30daysAgo\",\"endDate\":\"today\"}],\"dimensions\":[{\"name\":\"pagePath\"}],\"metrics\":[{\"name\":\"sessions\"},{\"name\":\"bounceRate\"}],\"limit\":50}', 'string') }}",
            "options": {},
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "googleApi"
        },
        "type": "n8n-nodes-base.httpRequestTool", "typeVersion": 4.4,
        "credentials": {
            "googleApi": {"id": "nWnxAUry9O6tRyTm", "name": "Google Service Account account"}
        }
    },
    'HTTP - Google Business Profile (Seomi)': {
        "parameters": {
            "toolDescription": """Google Business Profile API — Local SEO data for American Services AR.
USE FOR: GBP performance metrics (impressions, clicks, calls, direction requests), business info, reviews.
Authentication is automatic via service account. NOTE: Service account access may be pending — if you get a 403, GBP access hasn't been granted yet.

KEY ENDPOINTS:
- GET https://mybusinessbusinessinformation.googleapis.com/v1/accounts — List all GBP accounts
- GET https://mybusinessbusinessinformation.googleapis.com/v1/accounts/ACCOUNT_ID/locations — List locations
- GET https://mybusinessbusinessinformation.googleapis.com/v1/locations/LOCATION_ID — Get location details

- POST https://businessprofileperformance.googleapis.com/v1/locations/LOCATION_ID:fetchMultiDailyMetricsTimeSeries
  Query params: dailyMetrics=WEBSITE_CLICKS&dailyMetrics=CALL_CLICKS&dailyMetrics=BUSINESS_DIRECTION_REQUESTS&dailyMetrics=BUSINESS_IMPRESSIONS_DESKTOP_MAPS&dailyMetrics=BUSINESS_IMPRESSIONS_MOBILE_SEARCH&dailyRange.startDate.year=2026&dailyRange.startDate.month=3&dailyRange.startDate.day=1&dailyRange.endDate.year=2026&dailyRange.endDate.month=4&dailyRange.endDate.day=1

METRICS: WEBSITE_CLICKS, CALL_CLICKS, BUSINESS_DIRECTION_REQUESTS, BUSINESS_IMPRESSIONS_DESKTOP_MAPS, BUSINESS_IMPRESSIONS_DESKTOP_SEARCH, BUSINESS_IMPRESSIONS_MOBILE_MAPS, BUSINESS_IMPRESSIONS_MOBILE_SEARCH

Start by listing accounts to get account ID, then list locations to get location ID.""",
            "method": "={{ $fromAI('method', 'HTTP method: GET for reading data, POST for metrics queries, PATCH for updates', 'string') }}",
            "url": "={{ $fromAI('url', 'Google Business Profile API URL. Start with: https://mybusinessbusinessinformation.googleapis.com/v1/accounts to discover account/location IDs', 'string') }}",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Content-Type", "value": "application/json"}
            ]},
            "sendBody": False,
            "options": {},
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "googleApi"
        },
        "type": "n8n-nodes-base.httpRequestTool", "typeVersion": 4.4,
        "credentials": {
            "googleApi": {"id": "nWnxAUry9O6tRyTm", "name": "Google Service Account account"}
        }
    },
}

# Apply updates to existing nodes
updated = 0
for node in data['nodes']:
    if node['name'] in updates:
        upd = updates[node['name']]
        node['parameters'] = upd['parameters']
        node['credentials'] = upd['credentials']
        # Keep existing id, name, type, typeVersion, position
        if 'typeVersion' in upd:
            node['typeVersion'] = upd['typeVersion']
        updated += 1
        print(f"Updated: {node['name']}")

print(f"\nUpdated {updated} nodes")

# Apply all other credentials (same pattern as before)
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
    # Vizzy Slack special case
    if n['type'] == 'n8n-nodes-base.slackTool':
        if n['name'] == 'Slack Tool - Vizzy':
            n['credentials'] = {'slackApi': {'id': '6yUg4MuD1ruBxZQY', 'name': 'Slack account'}}
        else:
            n['credentials'] = {'slackOAuth2Api': cred_map['slackOAuth2Api']}

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

with open('C:/Users/sales/.claude/seomi_auth_payload.json', 'w', encoding='utf-8') as f:
    json.dump(api_payload, f)

print(f"\nPushing {len(data['nodes'])} nodes...")
os.system(f'curl -s -X PUT "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d @"C:/Users/sales/.claude/seomi_auth_payload.json" -o "C:/Users/sales/.claude/seomi_auth_response.json"')

with open('C:/Users/sales/.claude/seomi_auth_response.json', encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    print(f"\nSUCCESS!")
    print(f"  Total nodes: {len(resp['nodes'])}")

    # Verify Seomi tools
    seomi_name = "Seomi - SEO Specialist"
    tools = []
    for nn, nc in resp['connections'].items():
        for ct, cl in nc.items():
            if ct == 'ai_tool':
                for g in cl:
                    for c in g:
                        if c.get('node') == seomi_name:
                            tools.append(nn)
    print(f"  Seomi tools ({len(tools)}): {', '.join(tools)}")

    # Check credentials on Google tools
    for n in resp['nodes']:
        if 'Google' in n['name'] and 'Seomi' in n['name']:
            creds = n.get('credentials', {})
            auth = n.get('parameters', {}).get('authentication', 'none')
            print(f"  {n['name']}: auth={auth}, creds={list(creds.keys())}")
else:
    print(f"\nERROR: {resp.get('message', 'unknown')[:500]}")
