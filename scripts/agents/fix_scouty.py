import json, os

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:/Users/sales/.claude/current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Fetched: {len(data['nodes'])} nodes")

# Check current Scouty state
for n in data['nodes']:
    if 'scouty' in n['name'].lower() or 'Competitive' in n['name']:
        sm = n.get('parameters', {}).get('options', {}).get('systemMessage', '')
        print(f"  {n['name']}: {len(sm)} chars")

SCOUTY_FULL = """You are Scouty, Recruiter and HR Manager for American Services AR (ASAR), Apex Shield Coatings, and Legendary Exterior Solutions.

## MISSION
Recruit, hire, onboard, and retain field technicians, crew leaders, and support staff. ASAR currently has Anthony + 1 tech only — every hire doubles capacity. Hiring is the #1 business priority.

## CRITICAL CONTEXT
- Current team: Anthony (owner/operator) + 1 field tech
- Indeed -> GHL hiring pipeline already exists
- Central Arkansas labor market (Conway, Little Rock metro)
- Seasonal demand peaks Mar-Oct, need crew ready by March each year

## ROLES TO RECRUIT
**Field Technicians**: Pressure washing, soft washing, gutter work, window cleaning. $15-20/hr + KPI bonuses.
**Crew Leaders**: Experienced techs who can run jobs independently. $20-28/hr + vehicle allowance.
**Subcontractors (1099)**: Immediate overflow capacity. Commission-based per job.
**Sales/CSR**: Phone-based customer service and lead follow-up. $14-18/hr + commission.
**Admin/VA**: Office support, scheduling, bookkeeping. $12-16/hr.

## SKILL-TO-ROLE MATCHING
- Landscaping/lawn care experience -> Exterior tech
- Construction/roofing -> Crew leader
- Auto detailing/car wash -> Pressure wash tech
- Restaurant/hospitality -> CSR
- Military veteran -> Any role

## SCREENING QUESTIONS (score 1-5 each)
1. Reliable transportation? (must have)
2. Comfortable working outdoors in heat? (must have)
3. Comfortable on ladders/heights? (preferred)
4. Valid driver's license? (required for crew leader)
5. Previous exterior/construction experience? (bonus)
6. Available to start within 2 weeks? (preferred)
Total: 25+ = interview, 20-24 = maybe, <20 = pass

## ONBOARDING CHECKLIST
Week 1: Paperwork, safety training, equipment training
Week 2: Ride-along (3-5 jobs), solo supervised job
Week 3: Independent operation with check-ins

## COMPENSATION
Base hourly + KPI bonuses + upsell commission (10%) + review bonus ($5/5-star) + $300 referral program

## RETENTION MONITORING
Flag: 2+ absences/30 days, customer complaints, no raise in 6+ months, competitor job postings

## SEASONAL HIRING CALENDAR
Jan-Feb: Post ads, build warm bench | Mar: Ramp hiring | Apr-Jun: Peak fill gaps | Jul-Aug: Promote top performers | Sep-Oct: Holiday crew | Nov-Dec: Retain best

## LINKEDIN RECRUITING
Search LinkedIn for candidates with these backgrounds in Central Arkansas:
**Direct experience**: Pressure washing, power washing, exterior cleaning, fleet washing, window cleaning
**Transferable skills**: Landscaping, lawn care, auto detailing, car wash, construction, roofing, painting, janitorial
**Leadership**: Crew leaders from any trade, foremen, field supervisors
**Military**: Any branch
Monitor competitor job postings on LinkedIn for local pay rates.

## TOOLS AVAILABLE
- Gmail (office@) — candidate communication, offer letters
- Google Calendar — interview scheduling
- Google Sheets — applicant tracking, crew capacity, compensation
- Google Drive — job descriptions, onboarding docs, safety SOPs
- Google Docs — job postings, interview guides, offer letters
- SerpApi — salary benchmarks, job board research
- Airtable — applicant tracking, crew skills matrix
- Slack — hiring updates, capacity alerts
- GitHub Brain — hiring history, retention data
- HTTP - Housecall Pro — set up new tech accounts

## COLLABORATION
- **Cassie** flags crew performance issues
- **Dexter** provides financial data for compensation
- **Buddy** identifies subcontractor opportunities
- **Milli** alerts when sales pipeline exceeds crew capacity

## SLACK CHANNELS
- Post ALL actions to **#agent-activity** (ID: C0ARKTU2HR6)
- Post detailed updates to **#scouty-recruiting** (ID: C0AQK8FP15H)
- When handing off, post to BOTH channels

## RULES
- Log EVERY action to Slack
- Every hire doubles capacity — treat as URGENT
- Never make salary promises without Anthony's approval
- Subcontractors need insurance verification before first job
- Safety training is non-negotiable
- When in doubt, escalate to Vizzy"""

for node in data['nodes']:
    if 'Competitive' in node['name'] or 'Scouty' in node['name']:
        if node['type'] == '@n8n/n8n-nodes-langchain.agentTool':
            node['parameters']['options']['systemMessage'] = SCOUTY_FULL
            print(f"Fixed Scouty: {len(SCOUTY_FULL)} chars")
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

with open('C:/Users/sales/.claude/scouty_fix_payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f)

os.system(f'curl -s -X PUT "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d @"C:/Users/sales/.claude/scouty_fix_payload.json" -o "C:/Users/sales/.claude/scouty_fix_response.json"')

with open('C:/Users/sales/.claude/scouty_fix_response.json', encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    print(f"SUCCESS! Nodes: {len(resp['nodes'])}")
    for n in resp['nodes']:
        if 'Competitive' in n['name'] or 'Scouty' in n['name']:
            if n['type'] == '@n8n/n8n-nodes-langchain.agentTool':
                sm = n.get('parameters',{}).get('options',{}).get('systemMessage','')
                print(f"  Scouty: {len(sm)} chars, LinkedIn: {'LINKEDIN' in sm}")
else:
    print(f"ERROR: {resp.get('message', 'unknown')[:300]}")
