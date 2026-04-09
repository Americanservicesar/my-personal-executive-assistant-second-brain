import json, os, subprocess

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

# Credential remapping: original -> Anthony's
CRED_REMAP = {
    # Google Drive
    'googleDriveOAuth2Api': {'id': 'Hu80FNVrNnpo62Fj', 'name': 'Google Drive account'},
    # Telegram
    'telegramApi': {'id': 'IJ4MKsmQlba3y6iT', 'name': 'Telegram account 2'},
    # Google Docs
    'googleDocsOAuth2Api': {'id': 'dMFkHV4KEbioauC6', 'name': 'Google account'},
    # Gmail
    'gmailOAuth2': {'id': 'BzBgoySpZrWPcE09', 'name': 'Gmail account'},
    # Google Calendar
    'googleCalendarOAuth2Api': {'id': 'qOq56coC8TDB9EuE', 'name': 'Google Calendar account'},
    # Google Sheets
    'googleSheetsOAuth2Api': {'id': 'Tpo5kkkuG9qiBBvf', 'name': 'Google Sheets OAuth2 API'},
    # Airtable
    'airtableTokenApi': {'id': 'flYD85xUURg7jDi7', 'name': 'Airtable Personal Access Token account'},
    # OpenRouter
    'openRouterApi': {'id': '14JGEZJmNaJqzW3L', 'name': 'OpenRouter account'},
    # Tavily
    'tavilyApi': {'id': 'jS4w95Juoky6kKXs', 'name': 'Tavily account'},
}

# These credentials don't exist yet - we'll leave them as-is and flag them
MISSING_CREDS = {'httpHeaderAuth', 'httpQueryAuth', 'openAiApi', 'perplexityApi', 'openWeatherMapApi', 'apifyApi', 'blotatoApi'}

def remap_credentials(data):
    """Remap all credentials in a workflow to Anthony's"""
    for node in data.get('nodes', []):
        if 'credentials' in node:
            new_creds = {}
            for cred_type, cred_val in node['credentials'].items():
                if cred_type in CRED_REMAP:
                    new_creds[cred_type] = CRED_REMAP[cred_type]
                elif cred_type in MISSING_CREDS:
                    # Keep original - will need to be set up manually
                    new_creds[cred_type] = cred_val
                else:
                    new_creds[cred_type] = cred_val
            node['credentials'] = new_creds
    return data

def import_workflow(filepath, name_prefix="ASAR - "):
    """Import a workflow JSON into n8n"""
    with open(filepath, encoding='utf-8') as f:
        data = json.load(f)
    if isinstance(data, list):
        data = data[0]

    # Remap credentials
    data = remap_credentials(data)

    # Build create payload
    wf_name = name_prefix + data.get('name', os.path.basename(filepath).replace('.json', ''))
    payload = {
        'name': wf_name,
        'nodes': data.get('nodes', []),
        'connections': data.get('connections', {}),
        'settings': data.get('settings', {'executionOrder': 'v1'})
    }

    # Write payload
    payload_path = 'C:/Users/sales/.claude/uma_import_payload.json'
    with open(payload_path, 'w', encoding='utf-8') as f:
        json.dump(payload, f)

    # POST to create workflow
    resp_path = 'C:/Users/sales/.claude/uma_import_response.json'
    os.system(
        f'curl -s -X POST "{BASE}/workflows" '
        f'-H "X-N8N-API-KEY: {API_KEY}" '
        f'-H "Content-Type: application/json" '
        f'-d @"{payload_path}" '
        f'-o "{resp_path}"'
    )

    with open(resp_path, encoding='utf-8') as f:
        resp = json.load(f)

    if 'id' in resp:
        print(f"  IMPORTED: {wf_name} -> ID: {resp['id']} ({len(resp['nodes'])} nodes)")
        return resp['id']
    else:
        print(f"  ERROR: {wf_name} -> {resp.get('message', 'unknown')[:300]}")
        return None

# ============================================================
# STEP 1: Import sub-workflows
# ============================================================
print("=== Importing Sub-Workflows ===\n")

sub_workflows = {}
sub_files = {
    'Create Image': r'G:\Shared drives\MARKETING\N8N\Ultimate Ai Media\Create Image Tool.json',
    'Edit Image': r'G:\Shared drives\MARKETING\N8N\Ultimate Ai Media\Edit Image Tool.json',
    'Create Video': r'G:\Shared drives\MARKETING\N8N\Ultimate Ai Media\Create Video Tool.json',
    'Image to Video': r'G:\Shared drives\MARKETING\N8N\Ultimate Ai Media\Image to Video Tool.json',
    'Create Doc': r'G:\Shared drives\MARKETING\N8N\Ultimate Ai Media\Create Doc Tool.json',
}

for name, path in sub_files.items():
    wf_id = import_workflow(path, "ASAR Media - ")
    if wf_id:
        sub_workflows[name] = wf_id

print(f"\nImported {len(sub_workflows)}/{len(sub_files)} sub-workflows")
print(f"IDs: {json.dumps(sub_workflows, indent=2)}")

# ============================================================
# STEP 2: Import Instagram Post as native Meta Graph API
# ============================================================
print("\n=== Creating Native Instagram Post Sub-Workflow ===\n")

# We'll create this later once IG Business Account is linked
# For now, create a placeholder
print("  SKIPPED: Instagram Post — waiting for IG Business Account link")

# ============================================================
# STEP 3: Import UMA main workflow with updated sub-workflow IDs
# ============================================================
print("\n=== Importing Ultimate Media Agent (Main) ===\n")

with open(r'G:\Shared drives\MARKETING\N8N\Ultimate Ai Media\Ultimate Media Agent.json', encoding='utf-8') as f:
    uma_data = json.load(f)
if isinstance(uma_data, list):
    uma_data = uma_data[0]

# Remap credentials
uma_data = remap_credentials(uma_data)

# Update toolWorkflow nodes to point to new sub-workflow IDs
tool_workflow_map = {
    'Create Image': 'Create Image',
    'Edit Image': 'Edit Image',
    'Create Video': 'Create Video',
    'Image to Video': 'Image to Video',
    'Create Doc': 'Create Doc',
}

for node in uma_data.get('nodes', []):
    if node['type'] == '@n8n/n8n-nodes-langchain.toolWorkflow':
        node_name = node['name']
        for key, sub_name in tool_workflow_map.items():
            if key in node_name and sub_name in sub_workflows:
                # Update the workflowId parameter
                if 'workflowId' in node.get('parameters', {}):
                    old_id = node['parameters']['workflowId'].get('value', 'unknown')
                    node['parameters']['workflowId']['value'] = sub_workflows[sub_name]
                    print(f"  Remapped {node_name}: {old_id} -> {sub_workflows[sub_name]}")
                break

# Remove Blotato-dependent nodes (Instagram Post, X Post, TikTok Post toolWorkflow nodes)
# We'll replace these with native API calls later
blotato_nodes = set()
nodes_to_keep = []
for node in uma_data['nodes']:
    if node['type'] == '@n8n/n8n-nodes-langchain.toolWorkflow':
        # Check if this calls a Blotato sub-workflow
        if node['name'] in ['Instagram Post', 'X Post', 'TikTok Post']:
            blotato_nodes.add(node['name'])
            print(f"  Removed Blotato node: {node['name']}")
            continue
    nodes_to_keep.append(node)

uma_data['nodes'] = nodes_to_keep

# Clean connections referencing removed nodes
existing_names = {n['name'] for n in uma_data['nodes']}
clean_conns = {}
for src, src_conns in uma_data.get('connections', {}).items():
    if src not in existing_names:
        continue
    clean_src = {}
    for ct, cl in src_conns.items():
        clean_groups = []
        for group in cl:
            clean_group = [c for c in group if c.get('node') in existing_names]
            clean_groups.append(clean_group)
        clean_src[ct] = clean_groups
    clean_conns[src] = clean_src
uma_data['connections'] = clean_conns

# Add a Facebook Post HTTP node to the Posting Agent inside UMA
FB_PAGE_TOKEN = "EAAbwr76nwXUBRLIfXiXVAg9ZAKOUwVn9oZADWEao1HW0Umv1lMtm5yHstpdd0rB5KzrPf3NE2lMxM2fCRZC6CZBXAP32sncwcGW5aXjZCsRDpzUyR0fRPapZBLD0DAj5uSqgMNM5OZAs7P8AfzIObYNZCwxlDWZCnfowLTj2GFtcud5QgKZBJYPZBFhiHjrEiGoa6jxMjf1K8YQ0SWv1ZCr8um2tHgZDZD"
FB_PAGE_ID = "293488501278927"

import uuid
fb_node = {
    "parameters": {
        "toolDescription": f"Post to American Services AR Facebook Page. Use POST https://graph.facebook.com/v19.0/{FB_PAGE_ID}/feed for text posts. Include access_token in the JSON body.",
        "method": "POST",
        "url": f"https://graph.facebook.com/v19.0/{FB_PAGE_ID}/feed",
        "sendHeaders": True,
        "headerParameters": {"parameters": [{"name": "Content-Type", "value": "application/json"}]},
        "sendBody": True,
        "specifyBody": "json",
        "jsonBody": f"={{{{ $fromAI('body', 'JSON body with message and access_token. Example: {{\"message\": \"Your post\", \"access_token\": \"{FB_PAGE_TOKEN}\"}}', 'string') }}}}",
        "options": {}
    },
    "id": str(uuid.uuid4()),
    "name": "Facebook Post",
    "type": "n8n-nodes-base.httpRequestTool",
    "typeVersion": 4.4,
    "position": [1200, 800],
    "credentials": {}
}
uma_data['nodes'].append(fb_node)

# Connect Facebook Post to Posting Agent
if 'Posting Agent' in uma_data.get('connections', {}):
    pass  # Posting Agent connects TO UMA, not the other way
# Facebook Post should connect to Posting Agent as ai_tool
uma_data['connections']['Facebook Post'] = {
    "ai_tool": [[{"node": "Posting Agent", "type": "ai_tool", "index": 0}]]
}
print(f"  Added Facebook Post node to Posting Agent")

# Now import
wf_name = "ASAR - Ultimate Media Agent"
payload = {
    'name': wf_name,
    'nodes': uma_data['nodes'],
    'connections': uma_data['connections'],
    'settings': {'executionOrder': 'v1'}
}

payload_path = r'C:\Users\sales\.claude\uma_main_payload.json'
resp_path = r'C:\Users\sales\.claude\uma_main_response.json'

with open(payload_path, 'w', encoding='utf-8') as f:
    json.dump(payload, f)

os.system(
    f'curl -s -X POST "{BASE}/workflows" '
    f'-H "X-N8N-API-KEY: {API_KEY}" '
    f'-H "Content-Type: application/json" '
    f'-d @"{payload_path}" '
    f'-o "{resp_path}"'
)

with open(resp_path, encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    uma_id = resp['id']
    print(f"\n  IMPORTED: {wf_name} -> ID: {uma_id} ({len(resp['nodes'])} nodes)")
else:
    uma_id = None
    print(f"\n  ERROR: {resp.get('message', 'unknown')[:500]}")

# ============================================================
# SUMMARY
# ============================================================
print("\n=== IMPORT SUMMARY ===")
print(f"Sub-workflows imported: {len(sub_workflows)}")
for name, wid in sub_workflows.items():
    print(f"  {name}: {wid}")
print(f"UMA Main: {uma_id}")
print(f"\nBlotato nodes removed: {blotato_nodes}")
print(f"Facebook Post: Added natively")
print(f"\nMissing credentials to set up in n8n UI:")
print(f"  - httpHeaderAuth 'OpenAI' (for Create Image / Edit Image)")
print(f"  - httpHeaderAuth 'Fal' (for Create Video / Image to Video)")
print(f"  - httpQueryAuth 'IMGBB' (for Image to Video image hosting)")
print(f"\nNext step: Add toolWorkflow node to Soshie pointing to UMA ID: {uma_id}")
