"""
Add Google Search Console, GA4, and Google Business Profile API tools to Seomi.
Also updates Seomi's system message to reflect full auditor capabilities.

PREREQUISITE: Google Cloud project must have these APIs enabled:
  - Search Console API (searchconsole.googleapis.com)
  - Google Analytics Data API (analyticsdata.googleapis.com)
  - Google My Business API (mybusinessbusinessinformation.googleapis.com)

OAuth2 tokens are obtained via the existing Google OAuth2 credential in n8n.
These tools use the n8n Google OAuth2 credential to get access tokens at runtime.

NOTE: The HTTP Request tools use $fromAI() for dynamic URL/body construction.
The Google APIs require Bearer token auth — we use the n8n Google Sheets OAuth2
credential (which already has broad Google scopes) to pass the access token.
If scopes are insufficient, the user will need to re-authorize with additional scopes.

ALTERNATIVE APPROACH: Since n8n's built-in Google OAuth2 credentials may not have
the right scopes for Search Console / GA4 / GBP, we configure these as HTTP tools
that accept an access token parameter. Seomi will be instructed to use the Google
Sheets credential's token for auth, OR we set up dedicated OAuth2 credentials.

FOR NOW: We'll set these up using API key / service account patterns where possible,
and flag what needs OAuth2 re-authorization.
"""

import json, os, uuid, base64

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

# Step 1: Fetch current workflow
os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:/Users/sales/.claude/current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Fetched: {len(data['nodes'])} nodes")

seomi_agent = "Seomi - SEO Specialist"
base_x = 3120
base_y = 600

# WordPress auth (already configured, needed for system message reference)
WP_USER = "Asons"
WP_APP_PASS = "qWzH 9qXZ z3L4 US1p cQyV GXwk"
WP_AUTH = base64.b64encode(f"{WP_USER}:{WP_APP_PASS}".encode()).decode()

# ============================================================
# NEW TOOLS: Google Search Console, GA4, Google Business Profile
# ============================================================
# These use Google OAuth2. In n8n, we'll use a Generic OAuth2 credential
# or pass the bearer token from the existing google credential.
# For initial setup, we configure them to accept the token dynamically.
# The system message will instruct Seomi on how to use these.

new_nodes = {
    'HTTP - Google Search Console (Seomi)': {
        "parameters": {
            "toolDescription": """Google Search Console API — Real search performance data for americanservicesar.com.
USE FOR: clicks, impressions, CTR, average position by query/page/date. Index coverage status. URL inspection. Sitemap status.
IMPORTANT: This requires OAuth2 Bearer token. Use the access token from Google Sheets credential.
KEY ENDPOINTS:
- POST https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Famericanservicesar.com/searchAnalytics/query — Search analytics (clicks, impressions, CTR, position)
  Body example: {"startDate":"2026-03-01","endDate":"2026-04-01","dimensions":["query","page"],"rowLimit":100}
- GET https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Famericanservicesar.com/sitemaps — List sitemaps
- POST https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Famericanservicesar.com/urlInspection/index:inspect — Inspect URL index status
  Body: {"inspectionUrl":"https://americanservicesar.com/page/","siteUrl":"https://americanservicesar.com/"}
DIMENSIONS: query, page, country, device, date, searchAppearance
METRICS: clicks, impressions, ctr, position""",
            "method": "={{ $fromAI('method', 'HTTP method: POST for searchAnalytics/query and urlInspection, GET for sitemaps and site info', 'string') }}",
            "url": "={{ $fromAI('url', 'Google Search Console API URL. Site is https://americanservicesar.com (URL-encode as https%3A%2F%2Famericanservicesar.com). Base: https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Famericanservicesar.com/', 'string') }}",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Authorization", "value": "Bearer {{ $fromAI('access_token', 'Google OAuth2 access token for Search Console API access', 'string') }}"},
                {"name": "Content-Type", "value": "application/json"}
            ]},
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": "={{ $fromAI('body', 'JSON request body. For searchAnalytics: {\"startDate\":\"YYYY-MM-DD\",\"endDate\":\"YYYY-MM-DD\",\"dimensions\":[\"query\"],\"rowLimit\":100}. For urlInspection: {\"inspectionUrl\":\"URL\",\"siteUrl\":\"https://americanservicesar.com/\"}. Leave empty {} for GET requests.', 'string') }}",
            "options": {}
        },
        "type": "n8n-nodes-base.httpRequestTool", "typeVersion": 4.4,
        "position": [base_x, base_y], "credentials": {}
    },
    'HTTP - Google Analytics 4 (Seomi)': {
        "parameters": {
            "toolDescription": """Google Analytics 4 Data API — Traffic and behavior data for americanservicesar.com.
USE FOR: pageviews, sessions, bounce rate, avg session duration, conversions, traffic sources, landing page performance, user demographics.
IMPORTANT: This requires OAuth2 Bearer token and GA4 Property ID.
KEY ENDPOINT:
- POST https://analyticsdata.googleapis.com/v1beta/properties/PROPERTY_ID:runReport
  Body example: {"dateRanges":[{"startDate":"30daysAgo","endDate":"today"}],"dimensions":[{"name":"pagePath"}],"metrics":[{"name":"sessions"},{"name":"bounceRate"},{"name":"averageSessionDuration"}],"limit":50}
COMMON DIMENSIONS: pagePath, sessionSource, sessionMedium, city, deviceCategory, date, landingPage
COMMON METRICS: sessions, totalUsers, newUsers, bounceRate, averageSessionDuration, screenPageViews, conversions, engagementRate
DATE RANGES: Use relative (7daysAgo, 30daysAgo, 90daysAgo, today) or absolute (YYYY-MM-DD)
NOTE: GA4 Property ID must be provided. Check Google Analytics admin for the property ID.""",
            "method": "POST",
            "url": "={{ $fromAI('url', 'GA4 Data API URL. Format: https://analyticsdata.googleapis.com/v1beta/properties/PROPERTY_ID:runReport — Replace PROPERTY_ID with the GA4 property number', 'string') }}",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Authorization", "value": "Bearer {{ $fromAI('access_token', 'Google OAuth2 access token for GA4 API access', 'string') }}"},
                {"name": "Content-Type", "value": "application/json"}
            ]},
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": "={{ $fromAI('body', 'GA4 report request body. Example: {\"dateRanges\":[{\"startDate\":\"30daysAgo\",\"endDate\":\"today\"}],\"dimensions\":[{\"name\":\"pagePath\"}],\"metrics\":[{\"name\":\"sessions\"},{\"name\":\"bounceRate\"}],\"limit\":50}', 'string') }}",
            "options": {}
        },
        "type": "n8n-nodes-base.httpRequestTool", "typeVersion": 4.4,
        "position": [base_x, base_y + 160], "credentials": {}
    },
    'HTTP - Google Business Profile (Seomi)': {
        "parameters": {
            "toolDescription": """Google Business Profile API — Local SEO data for American Services AR GBP listing.
USE FOR: GBP insights (search queries, views, actions), reviews, Q&A, posts, business info verification.
IMPORTANT: This requires OAuth2 Bearer token.
KEY ENDPOINTS:
- GET https://mybusinessbusinessinformation.googleapis.com/v1/accounts — List accounts
- GET https://mybusinessbusinessinformation.googleapis.com/v1/accounts/ACCOUNT_ID/locations — List locations
- GET https://businessprofileperformance.googleapis.com/v1/locations/LOCATION_ID:fetchMultiDailyMetricsTimeSeries — Performance metrics
  Params: dailyMetrics=WEBSITE_CLICKS,CALL_CLICKS,BUSINESS_DIRECTION_REQUESTS,BUSINESS_IMPRESSIONS_DESKTOP_MAPS&dailyRange.startDate.year=2026&dailyRange.startDate.month=3&dailyRange.startDate.day=1&dailyRange.endDate.year=2026&dailyRange.endDate.month=4&dailyRange.endDate.day=1
- GET https://mybusiness.googleapis.com/v4/accounts/ACCOUNT_ID/locations/LOCATION_ID/reviews — Reviews
METRICS: WEBSITE_CLICKS, CALL_CLICKS, BUSINESS_DIRECTION_REQUESTS, BUSINESS_IMPRESSIONS_DESKTOP_MAPS, BUSINESS_IMPRESSIONS_DESKTOP_SEARCH, BUSINESS_IMPRESSIONS_MOBILE_MAPS, BUSINESS_IMPRESSIONS_MOBILE_SEARCH""",
            "method": "={{ $fromAI('method', 'HTTP method: GET for reading data, POST/PATCH for updates', 'string') }}",
            "url": "={{ $fromAI('url', 'Google Business Profile API URL. Start with accounts endpoint to discover account/location IDs: https://mybusinessbusinessinformation.googleapis.com/v1/accounts', 'string') }}",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Authorization", "value": "Bearer {{ $fromAI('access_token', 'Google OAuth2 access token for GBP API access', 'string') }}"},
                {"name": "Content-Type", "value": "application/json"}
            ]},
            "sendBody": False,
            "options": {}
        },
        "type": "n8n-nodes-base.httpRequestTool", "typeVersion": 4.4,
        "position": [base_x, base_y + 320], "credentials": {}
    },
    'HTTP - Site Crawler (Seomi)': {
        "parameters": {
            "toolDescription": """Full site crawler for americanservicesar.com — Fetches a page's HTML to extract all internal links, meta tags, headings, schema markup, images, and content.
USE FOR: Crawling the entire site page by page. Start at the homepage, extract all internal links, then crawl each one.
WORKFLOW:
1. GET https://americanservicesar.com/ → parse HTML for all <a href> links
2. For each internal link (same domain), GET that page → extract: title, meta description, H1-H6, images (check alt text), internal links, schema markup, word count
3. Build a complete site map with issues per page
This tool fetches raw HTML. You must parse it to extract SEO elements.
Returns full HTML response — look for <title>, <meta name="description">, <h1>-<h6>, <img alt="">, <script type="application/ld+json">, <a href="">.""",
            "method": "GET",
            "url": "={{ $fromAI('url', 'Full URL to crawl on americanservicesar.com. Start with https://americanservicesar.com/ then follow internal links found in the HTML', 'string') }}",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "User-Agent", "value": "SeomiBot/1.0 (ASAR SEO Auditor)"}
            ]},
            "sendBody": False,
            "options": {"redirect": {"redirect": {"followRedirects": True, "maxRedirects": 5}}, "timeout": 15000}
        },
        "type": "n8n-nodes-base.httpRequestTool", "typeVersion": 4.4,
        "position": [base_x, base_y + 480], "credentials": {}
    },
}

# Add nodes
for name, defn in new_nodes.items():
    # Remove existing node with same name (to update it)
    data['nodes'] = [n for n in data['nodes'] if n['name'] != name]
    node = {"id": str(uuid.uuid4()), "name": name}
    node.update(defn)
    data['nodes'].append(node)
    print(f"Added: {name}")

# Wire connections to Seomi agent
conns = data['connections']
for name in new_nodes:
    conns[name] = {"ai_tool": [[{"node": seomi_agent, "type": "ai_tool", "index": 0}]]}

# ============================================================
# UPDATE SEOMI SYSTEM MESSAGE
# ============================================================
for node in data['nodes']:
    if node['name'] == seomi_agent:
        # Replace entire system message with upgraded version
        new_system_message = """You are Seomi, Full-Stack SEO Auditor & Executor for American Services AR (ASAR), Apex Shield Coatings, and Legendary Exterior Solutions.

## MISSION
Dominate local search across Central Arkansas. You don't just advise — you AUDIT, DIAGNOSE, and EXECUTE fixes directly.

## EXECUTION MINDSET
When you find an SEO problem, FIX IT immediately using your tools:
- Missing meta description → Write it → push via RankMath API
- Title tag too long → Rewrite → push via RankMath API
- Missing H1 → Update page content via WordPress API
- No FAQ schema → Add FAQ + FAQPage schema via RankMath
- Thin content → Expand → update via WordPress API
- Broken link → Find correct URL → update in page content
- Missing service+city page → Write full page → publish via WordPress + set all RankMath fields
For bulk changes (5+ pages), list what you'll change and ask for approval first.

## PRIORITY ORDER
1. Full audit americanservicesar.com — technical, on-page, content, local
2. Execute fixes for everything found in audit
3. Multi-source keyword research — SerpApi, Bing, People Also Ask, Search Console, competitors
4. Content creation — service+city pages, blog posts, schema markup
5. Rank tracking — monitor all 143 service+city keyword combos

## WEBSITE PROPERTIES
| Domain | Focus | Access |
|--------|-------|--------|
| **americanservicesar.com** | All services | FULL CONTROL — create/edit/delete pages, posts, media, SEO meta |
| conwaygutter.com | Gutters | Monitor only |
| littlerockgutter.com | Gutters | Monitor only |
| bentongutter.com | Gutters | Monitor only |
| bryantgutter.com | Gutters | Monitor only |
| northlittlerockgutters.com | Gutters | Monitor only |
| sherwoodgutters.com | Gutters | Monitor only |

## FULL SITE AUDIT CHECKLIST
When asked to audit, run ALL of these:

### Technical SEO
- PageSpeed Insights: homepage + top 5 service pages (mobile + desktop)
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Crawl site: use Site Crawler tool starting at homepage, follow all internal links
- Check robots.txt and XML sitemap via WordPress API
- Broken Link Checker: crawl all internal links for 404s
- Check redirect chains (flag 2+ hops)
- SSL/HTTPS verification

### On-Page SEO (every page)
- Title tag exists, <60 chars, contains target keyword
- Meta description exists, 150-160 chars, compelling
- H1 tag present, matches page intent
- H2 hierarchy logical
- Focus keyword set in RankMath
- Image alt text present on all images
- 3-5+ internal links per page
- Clean URL structure

### Content SEO
- Word count: service pages need 1,000+ words
- Flag thin content (< 300 words)
- Check for keyword cannibalization
- Content freshness (flag if not updated in 6 months)
- FAQ sections on all service pages

### Local SEO
- NAP consistency: American Services AR, correct phone, correct address
- LocalBusiness schema on location pages
- Service schema on service pages
- FAQPage schema on FAQ sections
- BreadcrumbList schema on all pages
- GBP insights via Google Business Profile API

### Content Gap Analysis
- 13 services × 11 cities = 143 required pages
- Cross-reference what exists vs what's missing
- Check competitor rankings for missing combos via SerpApi
- Prioritize by estimated search volume

## PAGE STRUCTURE (for every new page)
Title Tag (<60 chars): [Service] in [City], AR | American Services AR
H1: [Service] in [City], Arkansas
Intro (100-150 words): What we do, who we serve, why choose us
H2: Our [Service] Services in [City] — bullet list of specifics
H2: Why Choose ASAR — experience, equipment, licensing, local presence
H2: Service Area — cities covered, neighborhoods, map
H2: Get a Free Estimate — CTA with phone + form link
H2: FAQ — 3-5 questions with FAQPage schema markup

## SEMANTIC KEYWORD COVERAGE
13 services: Pressure Washing, Fleet Washing, Parking Lot Maintenance, Gutter Cleaning, Gutter Installation, Gutter Guards, Construction Cleanup, Soft Washing, Window Cleaning, Roof Cleaning, Holiday Lighting, Commercial Maintenance, Residential Maintenance
× 11 cities: Conway, Little Rock, NLR, Sherwood, Maumelle, Benton, Bryant, Cabot, Jacksonville, Vilonia, Greenbrier

## AI BRAND MENTION OPTIMIZATION
Ensure ASAR appears in AI-generated answers (ChatGPT, Claude, Gemini):
- Schema markup on EVERY page: LocalBusiness, Service, FAQ, Review, AggregateRating
- Entity establishment: Consistent NAP everywhere
- Topical authority: Deep content clusters per service
- Question-based content: Target "People Also Ask" and conversational queries
- Test quarterly: search AI models for services in Central AR cities

## TOOLS AVAILABLE (18 total)
- **WordPress REST API** — create/edit pages, posts, media (FULL ADMIN)
- **RankMath API** — SEO titles, meta descriptions, focus keywords, schema
- **PageSpeed Insights** — Core Web Vitals, performance scores
- **Broken Link Checker** — check any URL for 404s/redirects
- **Site Crawler** — fetch page HTML, extract links/meta/headings/schema
- **Google Search Console** — real clicks, impressions, CTR, position, index status
- **Google Analytics 4** — traffic, bounce rate, conversions, user behavior
- **Google Business Profile** — GBP insights, reviews, local search visibility
- **SerpApi** — Google SERP data, rankings, People Also Ask
- **Web Search** — competitor research, SERP review
- **Bing Webmaster** — Bing rankings, backlinks, crawl stats
- **Moz API** — Domain Authority, Page Authority, spam score
- **Google Sheets** — content matrix, keyword tracking, ranking reports
- **Google Drive** — templates, research docs, audit reports
- **Google Docs** — long-form content drafting
- **Airtable** — content pipeline tracking
- **Slack** — report all actions
- **GitHub Brain** — persistent memory for audit findings

## COLLABORATION
- **Penn** writes polished copy and ad copy
- **Soshie** manages GBP posts + reviews (Seomi provides keyword guidance)
- **Emmie** coordinates email content reinforcing SEO topics
- **Buddy** provides competitor intel
- **Dexter** provides analytics data and conversion tracking

## SLACK CHANNELS
- Post ALL actions to **#agent-activity** (ID: C0ARKTU2HR6)
- Post detailed updates to **#seomi-seo** (ID: C0AQV7SAXB6)

## RULES
- Log EVERY action to Slack
- EXECUTE fixes, don't just recommend them
- Never publish content without schema markup
- Always include FAQ with FAQPage schema on service pages
- Check for duplicate content before publishing
- Update content matrix after every page publish
- For bulk changes (5+ pages), show preview and ask approval
- When in doubt, escalate to Vizzy"""

        node['parameters']['options']['systemMessage'] = new_system_message
        print(f"Updated Seomi system message: {len(new_system_message)} chars")
        break

# ============================================================
# APPLY CREDENTIALS
# ============================================================
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
# Special handling: Vizzy Slack uses slackApi, all others use slackOAuth2Api
for n in data['nodes']:
    if n['type'] in nct:
        ct = nct[n['type']]
        if ct in cred_map:
            n['credentials'] = {ct: cred_map[ct]}
    # Handle slackTool nodes individually — Vizzy uses different credential
    if n['type'] == 'n8n-nodes-base.slackTool':
        if n['name'] == 'Slack Tool - Vizzy':
            n['credentials'] = {'slackApi': {'id': '6yUg4MuD1ruBxZQY', 'name': 'Slack account'}}
        else:
            n['credentials'] = {'slackOAuth2Api': cred_map['slackOAuth2Api']}

# ============================================================
# PUSH TO n8n
# ============================================================
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

with open('C:/Users/sales/.claude/seomi_google_payload.json', 'w', encoding='utf-8') as f:
    json.dump(api_payload, f)

print(f"\nPushing {len(data['nodes'])} nodes...")
os.system(f'curl -s -X PUT "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d @"C:/Users/sales/.claude/seomi_google_payload.json" -o "C:/Users/sales/.claude/seomi_google_response.json"')

with open('C:/Users/sales/.claude/seomi_google_response.json', encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    print(f"\nSUCCESS!")
    print(f"  Total nodes: {len(resp['nodes'])}")
    tools = []
    for nn, nc in resp['connections'].items():
        for ct, cl in nc.items():
            if ct == 'ai_tool':
                for g in cl:
                    for c in g:
                        if c.get('node') == seomi_agent:
                            tools.append(nn)
    print(f"  Seomi tools ({len(tools)}): {', '.join(tools)}")
    for n in resp['nodes']:
        if n['name'] == seomi_agent:
            sm = n.get('parameters', {}).get('options', {}).get('systemMessage', '')
            print(f"  System message: {len(sm)} chars")
            break
else:
    print(f"\nERROR: {resp.get('message', 'unknown')[:500]}")
