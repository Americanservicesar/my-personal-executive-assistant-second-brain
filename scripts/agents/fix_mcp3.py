import json, os

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

with open(r'C:\Users\sales\.claude\vizzy_api_payload.json', encoding='utf-8') as f:
    data = json.load(f)

data['settings'] = {
    'executionOrder': 'v1',
    'errorWorkflow': 'TL5bO1l7QCI3XIAm',
    'callerPolicy': 'workflowsFromSameOwner',
    'availableInMCP': True
}

with open(r'C:\Users\sales\.claude\vizzy_api_payload.json', 'w', encoding='utf-8') as f:
    json.dump(data, f)

payload_path = r"C:\Users\sales\.claude\vizzy_api_payload.json"
resp_path = r"C:\Users\sales\.claude\put_response.json"

cmd = (
    f'curl -s -X PUT "{BASE}/workflows/JAYrzGWR8A0tCBzB" '
    f'-H "X-N8N-API-KEY: {API_KEY}" '
    f'-H "Content-Type: application/json" '
    f'-d @"{payload_path}" '
    f'-o "{resp_path}"'
)
os.system(cmd)

with open(resp_path, encoding='utf-8') as f:
    resp = json.load(f)

if 'id' in resp:
    print(f"SUCCESS - availableInMCP: {resp.get('settings', {}).get('availableInMCP')}")
    print(f"Nodes: {len(resp['nodes'])}, Active: {resp['active']}")
else:
    print(f"ERROR: {resp.get('message', '')[:300]}")
