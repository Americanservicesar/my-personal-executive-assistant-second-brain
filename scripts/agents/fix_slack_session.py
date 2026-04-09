import json, os, uuid

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

os.system(f'curl -s "{BASE}/workflows/LOt2w8e9eXvHMi5T" -H "X-N8N-API-KEY: {API_KEY}" -o "C:/Users/sales/.claude/slack_wf_current.json"')

with open(r'C:\Users\sales\.claude\slack_wf_current.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Current nodes: {len(data['nodes'])}")
for n in data['nodes']:
    print(f"  {n['name']} ({n['type']})")

# Rebuild the workflow properly:
# Slack Trigger -> Set (add sessionId + chatInput) -> Execute Main Workflow -> Reply
# The key insight: we need to use the n8n execute_workflow with proper input mapping

# Keep Slack Trigger as-is
slack_trigger = None
reply_node = None
for n in data['nodes']:
    if n['name'] == 'Slack Trigger':
        slack_trigger = n
    elif n['name'] == 'Reply in Slack':
        reply_node = n

# Build new Set node that formats data with sessionId
format_node = {
    "parameters": {
        "mode": "manual",
        "duplicateItem": False,
        "assignments": {
            "assignments": [
                {"id": str(uuid.uuid4()), "name": "sessionId", "value": "={{ 'slack-session-' + $json.user }}", "type": "string"},
                {"id": str(uuid.uuid4()), "name": "action", "value": "sendMessage", "type": "string"},
                {"id": str(uuid.uuid4()), "name": "chatInput", "value": "={{ $json.text }}", "type": "string"},
                {"id": str(uuid.uuid4()), "name": "slackChannel", "value": "={{ $json.channel }}", "type": "string"},
                {"id": str(uuid.uuid4()), "name": "slackTs", "value": "={{ $json.ts }}", "type": "string"},
                {"id": str(uuid.uuid4()), "name": "slackUser", "value": "={{ $json.user }}", "type": "string"}
            ]
        }
    },
    "id": str(uuid.uuid4()),
    "name": "Add Session ID",
    "type": "n8n-nodes-base.set",
    "typeVersion": 3.4,
    "position": [450, 300]
}

# Execute the main workflow with the formatted data
exec_node = {
    "parameters": {
        "workflowId": {"__rl": True, "mode": "id", "value": "JAYrzGWR8A0tCBzB"},
        "options": {}
    },
    "id": str(uuid.uuid4()),
    "name": "Run Vizzy Agent",
    "type": "n8n-nodes-base.executeWorkflow",
    "typeVersion": 1.2,
    "position": [650, 300]
}

# Update Reply node position
if reply_node:
    reply_node['position'] = [850, 300]
    reply_node['parameters']['text'] = '={{ $json.output || "I processed your request but had trouble formatting the response. Please try again." }}'
    reply_node['parameters']['channelId'] = {"__rl": True, "mode": "id", "value": "={{ $('Add Session ID').item.json.slackChannel }}"}
    reply_node['parameters']['otherOptions'] = {"thread_ts": "={{ $('Add Session ID').item.json.slackTs }}"}

# Rebuild nodes list
data['nodes'] = [slack_trigger, format_node, exec_node, reply_node]

# Rebuild connections
data['connections'] = {
    "Slack Trigger": {"main": [[{"node": "Add Session ID", "type": "main", "index": 0}]]},
    "Add Session ID": {"main": [[{"node": "Run Vizzy Agent", "type": "main", "index": 0}]]},
    "Run Vizzy Agent": {"main": [[{"node": "Reply in Slack", "type": "main", "index": 0}]]}
}

payload = {'name': data['name'], 'nodes': data['nodes'], 'connections': data['connections'],
    'settings': {'executionOrder': 'v1'}}

with open('C:/Users/sales/.claude/slack_session_fix.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f)

print(f"\nPushing {len(data['nodes'])} nodes...")
os.system(f'curl -s -X PUT "{BASE}/workflows/LOt2w8e9eXvHMi5T" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d @"C:/Users/sales/.claude/slack_session_fix.json" -o "C:/Users/sales/.claude/slack_session_resp.json"')

with open('C:/Users/sales/.claude/slack_session_resp.json', encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    print(f"SUCCESS! Nodes: {len(resp['nodes'])}")
    for n in resp['nodes']:
        print(f"  {n['name']} ({n['type']})")
    print(f"\nNow toggle the workflow OFF then ON in n8n UI!")
    print(f"https://americanservicesar.app.n8n.cloud/workflow/LOt2w8e9eXvHMi5T")
else:
    print(f"ERROR: {resp.get('message', 'unknown')[:500]}")
