import json, os

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

# Try PATCH approach - just update settings
# n8n Cloud API might support PATCH
payload = json.dumps({
    "settings": {
        "executionOrder": "v1",
        "errorWorkflow": "TL5bO1l7QCI3XIAm",
        "callerPolicy": "workflowsFromSameOwner",
        "availableInMCP": True
    }
})

# Try with PATCH first
os.system(f'''curl -s -w "\\nHTTP:%{{http_code}}" -X PATCH "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -H "Content-Type: application/json" -d '{payload}' -o "C:\\Users\\sales\\.claude\\patch_resp.json"''')

with open(r'C:\Users\sales\.claude\patch_resp.json', encoding='utf-8') as f:
    content = f.read()

print(f"PATCH response: {content[:500]}")
