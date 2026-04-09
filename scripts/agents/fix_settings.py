import json, os

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8"
BASE = "https://americanservicesar.app.n8n.cloud/api/v1"

# Fetch current
os.system(f'curl -s "{BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: {API_KEY}" -o "C:\\Users\\sales\\.claude\\current_wf.json"')

with open(r'C:\Users\sales\.claude\current_wf.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Current settings: {json.dumps(data.get('settings', {}), indent=2)}")

# Check if availableInMCP is already set
settings = data.get('settings', {})
if settings.get('availableInMCP'):
    print("availableInMCP already True, no fix needed")
else:
    print("availableInMCP is missing or False, needs fixing")
    # We need to restore the original settings
    # The original had: executionOrder, binaryMode, availableInMCP, timeSavedMode, callerPolicy, errorWorkflow, timeSavedPerExecution
    # But PUT rejects some of those. Let me try adding just availableInMCP
