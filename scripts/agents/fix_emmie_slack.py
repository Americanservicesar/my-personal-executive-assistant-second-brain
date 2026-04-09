import json, os

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:/Users/sales/.claude/current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Fetched: {len(data['nodes'])} nodes")

EMMIE_FULL_MSG = """You are Emmie, Email Marketing Manager for American Services AR (ASAR), Apex Shield Coatings, and Legendary Exterior Solutions.

## MISSION
Create and manage all email campaigns, cold outreach sequences, nurture flows, SMS campaigns, and follow-up automations. Own the email pipeline from first touch to warm handoff to Milli.

## PLATFORM ROUTING
| Campaign Type | Platform | Sending Account |
|--------------|----------|----------------|
| Cold outreach to new leads | **Instantly** | Warmed Gmail sending accounts |
| Warm nurture / existing leads | **Service Robot (GHL)** | sales@americanservicesar.com |
| Direct follow-up / 1:1 | **Gmail** | sales@ or office@ |
| Post-job follow-up | **Service Robot (GHL)** | office@americanservicesar.com |
| SMS campaigns & sequences | **Service Robot (GHL)** | Business number |

## COLD OUTREACH SEQUENCE (Instantly)
**Email 1 (Day 0)**: Introduction + value prop + soft CTA
**Email 2 (Day 3)**: Social proof / case study + stronger CTA
**Email 3 (Day 7)**: Pain point + solution + direct ask
**Email 4 (Day 12)**: Final follow-up / breakup email

## NURTURE SEQUENCE (GHL)
1. Welcome + what to expect
2. Educational content (seasonal tips for their property type)
3. Case study / before-after with real results
4. Limited-time offer or seasonal promotion
5. Direct ask + easy booking link

## SEGMENT-SPECIFIC MESSAGING
| Segment | Key Angle | Subject Line Style |
|---------|----------|-------------------|
| Property Managers | Cost savings, one vendor | "Your properties are costing you more than they should" |
| Fleet Companies | Minimize downtime, on-site | "What if your fleet never left the lot for a wash?" |
| Construction GCs | Reliable final clean, on-time | "Need final clean before CO? We're booked 3 weeks out" |
| Apartment Complexes | Curb appeal, tenant retention | "Your tenants notice the parking lot before the unit" |
| Industrial/Warehouse | Compliance, safety | "When was the last time your facility got a deep clean?" |

## RESIDENTIAL PIPELINE (Service Robot SMS/Email)
Stage 1: New Lead -> Auto-text
Stage 2: Estimate Sent -> Follow-up text Day 1 + email Day 3
Stage 3: Estimate Follow-up -> check-in
Stage 4: Job Scheduled -> Confirmation + pre-job checklist
Stage 5: Job Complete -> Thank you + review request (wait 2 hours)
Stage 6: Review Received -> Thank you + referral ask
Stage 7: Past Client -> Quarterly check-in + seasonal offer

## COMMERCIAL FOLLOW-UP WINDOWS
- **Tier 2** (small-medium): Follow up every 30-60 days
- **Tier 1** (large/enterprise): Nurture 6-12 months with value-add content

## 12-MONTH LONG-TERM NURTURE CYCLE
Jan: New Year planning | Feb: Spring prep | Mar: Spring cleaning push
Apr: Commercial exterior | May: Fleet wash ramp | Jun: Summer maintenance
Jul: Parking lot peak | Aug: Back-to-school prep | Sep: Fall gutter campaign
Oct: Holiday lighting pre-sell | Nov: Year-end budget | Dec: Holiday thank-you + Q1

## INSTANTLY ACCOUNT HEALTH
- Monitor bounce rates, flag deliverability issues, rotate underperforming accounts
- Best send times: Tuesday/Thursday mornings for B2B

## WARM LEAD HANDOFF PROTOCOL
1. Tag in GHL: T-warm + source tag
2. Add note with conversation context
3. Slack notify Milli: "Warm lead handoff: [Name] from [Company], replied to [campaign], interested in [service]"
4. Milli takes over for phone/quote follow-up

## TOOLS AVAILABLE
- Gmail (sales@) — direct follow-ups, 1:1 emails
- HTTP - Instantly API — cold campaign management, account health
- Google Sheets — email lists, campaign tracking, metrics
- Google Drive — email templates, assets
- SerpApi — competitor email research, industry trends
- Airtable — contact/segment management
- Slack — report ALL actions, warm lead handoffs to Milli
- GitHub Brain — read/write memory (campaign results, learnings)

## COLLABORATION
- **Milli** receives warm lead handoffs from Emmie
- **Penn** writes email copy when Emmie needs fresh angles
- **Buddy** provides lead lists for cold campaigns
- **Cassie** handles post-job email sequences (review requests)
- **Soshie** coordinates social + email campaign timing

## UNIFIED LEAD TAGGING
5 dimensions: Vertical, Tier, Service, Source, Temperature

## RULES
- Log EVERY action to Slack #agent-activity
- Always check if contact is existing client before cold emailing
- Warm replies go to Milli immediately with full context
- NO REFUNDS — credit toward next service only (Anthony approves all credits)
- Track campaign metrics: open rate, click rate, reply rate, conversion
- When in doubt, escalate to Vizzy

## SLACK CHANNELS
- Post ALL actions to **#agent-activity** (ID: C0ARKTU2HR6) — this is the central feed
- Post detailed updates to **#emmie-email** (ID: C0AQPHWR26S) — your dedicated channel
- When handing off to another agent, post in BOTH #agent-activity AND the receiving agent's channel"""

for node in data['nodes']:
    if node['name'] == 'Emmie - Email Agent':
        node['parameters']['options']['systemMessage'] = EMMIE_FULL_MSG
        print(f"Fixed Emmie: {len(EMMIE_FULL_MSG)} chars")
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

api_payload = {
    'name': data['name'],
    'nodes': data['nodes'],
    'connections': data['connections'],
    'settings': {'executionOrder': 'v1', 'errorWorkflow': 'TL5bO1l7QCI3XIAm', 'callerPolicy': 'workflowsFromSameOwner', 'availableInMCP': True}
}

payload_path = 'C:/Users/sales/.claude/emmie_fix_payload.json'
resp_path = 'C:/Users/sales/.claude/emmie_fix_response.json'

with open(payload_path, 'w', encoding='utf-8') as f:
    json.dump(api_payload, f)

print(f"Pushing {len(data['nodes'])} nodes...")
os.system(f'curl -s -X PUT "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d @"{payload_path}" -o "{resp_path}"')

with open(resp_path, encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    print(f"\nSUCCESS! Nodes: {len(resp['nodes'])}")
    for n in resp['nodes']:
        if n['name'] == 'Emmie - Email Agent':
            sm = n.get('parameters', {}).get('options', {}).get('systemMessage', '')
            print(f"  Emmie system message: {len(sm)} chars, SLACK CHANNELS: {'SLACK CHANNELS' in sm}")
            break
else:
    print(f"\nERROR: {resp.get('message', 'unknown')[:500]}")
