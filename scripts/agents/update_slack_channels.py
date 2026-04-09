import json, os

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:/Users/sales/.claude/current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Fetched: {len(data['nodes'])} nodes")

# Channel mapping: agent node name -> (own channel name, own channel ID)
AGENT_CHANNELS = {
    'Vizzy - Supervisor Agent': ('#vizzy-command', 'C0AQPHWL7V4'),
    'Milli - Marketing Agent': ('#milli-sales', 'C0AQN7QDEP7'),
    'Penn - Writing Agent': ('#penn-copy', 'C0AQPHX6FGW'),
    'Emmie - Email Agent': ('#emmie-email', 'C0AQPHWR26S'),
    'Soshie - Social Media Agent': ('#soshie-social', 'C0AQPHWS094'),
    'Buddy - Research Agent': ('#buddy-bizdev', 'C0AR4GT2WRX'),
}

ACTIVITY_CHANNEL = 'C0ARKTU2HR6'  # #agent-activity

# Slack channel instructions to append to each agent's system message
SLACK_ADDENDUM_TEMPLATE = """

## SLACK CHANNELS
- Post ALL actions to **#agent-activity** (ID: C0ARKTU2HR6) — this is the central feed
- Post detailed updates to **{channel_name}** (ID: {channel_id}) — your dedicated channel
- When handing off to another agent, post in BOTH #agent-activity AND the receiving agent's channel"""

updated = 0
for node in data['nodes']:
    if node['name'] in AGENT_CHANNELS:
        channel_name, channel_id = AGENT_CHANNELS[node['name']]
        sys_msg = node.get('parameters', {}).get('options', {}).get('systemMessage', '')

        # Check if we already added channel info
        if 'SLACK CHANNELS' in sys_msg:
            print(f"  SKIP {node['name']} — already has SLACK CHANNELS section")
            continue

        if not sys_msg:
            # Vizzy is a top-level agent, system message is in a different location
            sys_msg = node.get('parameters', {}).get('options', {}).get('systemMessage', '')

        addendum = SLACK_ADDENDUM_TEMPLATE.format(
            channel_name=channel_name,
            channel_id=channel_id
        )

        new_sys_msg = sys_msg + addendum
        node['parameters']['options']['systemMessage'] = new_sys_msg
        print(f"  UPDATED {node['name']}: +{len(addendum)} chars -> {len(new_sys_msg)} total")
        updated += 1

print(f"\nUpdated {updated} agents")

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
    'settings': {'executionOrder': 'v1', 'errorWorkflow': 'TL5bO1l7QCI3XIAm', 'callerPolicy': 'workflowsFromSameOwner', 'availableInMCP': True}
}

payload_path = 'C:/Users/sales/.claude/slack_channels_payload.json'
resp_path = 'C:/Users/sales/.claude/slack_channels_response.json'

with open(payload_path, 'w', encoding='utf-8') as f:
    json.dump(api_payload, f)

print(f"Pushing {len(data['nodes'])} nodes...")

os.system(f'curl -s -X PUT "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d @"{payload_path}" -o "{resp_path}"')

with open(resp_path, encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    print(f"\nSUCCESS! Nodes: {len(resp['nodes'])}, Active: {resp['active']}")
    # Verify each agent's system message now has SLACK CHANNELS
    for n in resp['nodes']:
        if n['name'] in AGENT_CHANNELS:
            sm = n.get('parameters', {}).get('options', {}).get('systemMessage', '')
            has_slack = 'SLACK CHANNELS' in sm
            print(f"  {n['name']}: {len(sm)} chars, SLACK CHANNELS: {has_slack}")
else:
    print(f"\nERROR: {resp.get('message', 'unknown')[:500]}")
