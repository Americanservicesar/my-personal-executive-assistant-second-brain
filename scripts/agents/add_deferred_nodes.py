import json, uuid

# Fetch current workflow state
with open(r'C:\Users\sales\.claude\vizzy_api_payload.json') as f:
    data = json.load(f)

base_x = 2064
base_y = -650  # Row above the first batch
x_spacing = 250

new_nodes = []

# --- SerpApi ---
new_nodes.append({
    "parameters": {
        "options": {}
    },
    "id": str(uuid.uuid4()),
    "name": "SerpApi - Vizzy",
    "type": "@n8n/n8n-nodes-langchain.toolSerpApi",
    "typeVersion": 1,
    "position": [base_x - 800, base_y],
    "credentials": {
        "serpApi": {"id": "W674ZSbrWCALEVEp", "name": "SerpAPI account"}
    }
})

# --- HighLevel Tools (3) using highLevelApi type ---
hl_configs = [
    ("HighLevel - Contacts (Vizzy)", "contact", "getAll", "Search and retrieve contacts from Service Robot/HighLevel CRM"),
    ("HighLevel - Opportunities (Vizzy)", "opportunity", "getAll", "Search and retrieve pipeline opportunities from Service Robot/HighLevel"),
    ("HighLevel - Tasks (Vizzy)", "task", "getAll", "Search and retrieve tasks from Service Robot/HighLevel"),
]

for i, (name, resource, operation, desc) in enumerate(hl_configs):
    node_params = {
        "descriptionType": "manual",
        "toolDescription": desc,
        "resource": resource,
        "operation": operation,
        "returnAll": True,
        "options": {}
    }
    if resource == "task":
        node_params["contactId"] = "={{ $fromAI('contactId', 'Contact ID to get tasks for', 'string') }}"

    new_nodes.append({
        "parameters": node_params,
        "id": str(uuid.uuid4()),
        "name": name,
        "type": "n8n-nodes-base.highLevelTool",
        "typeVersion": 2,
        "position": [base_x - 800 + ((1 + i) * x_spacing), base_y],
        "credentials": {
            "highLevelApi": {"id": "I99pH7lTosyVqinb", "name": "HighLevel account"}
        }
    })

# --- Google Docs ---
new_nodes.append({
    "parameters": {
        "resource": "document",
        "operation": "create",
        "title": "={{ $fromAI('title', 'Document title', 'string') }}"
    },
    "id": str(uuid.uuid4()),
    "name": "Google Docs - Vizzy",
    "type": "n8n-nodes-base.googleDocsTool",
    "typeVersion": 2,
    "position": [base_x - 800 + (4 * x_spacing), base_y],
    "credentials": {
        "googleDocsOAuth2Api": {"id": "dMFkHV4KEbioauC6", "name": "Google account"}
    }
})

# Add to workflow
data['nodes'].extend(new_nodes)

# Add connections
vizzy_name = "Vizzy - Supervisor Agent"
for nn in new_nodes:
    data['connections'][nn['name']] = {
        "ai_tool": [
            [
                {
                    "node": vizzy_name,
                    "type": "ai_tool",
                    "index": 0
                }
            ]
        ]
    }

print(f"Added {len(new_nodes)} nodes")
print(f"Total nodes: {len(data['nodes'])}")
print(f"Total connections: {len(data['connections'])}")

for nn in new_nodes:
    creds = nn.get('credentials', {})
    print(f"  + {nn['name']}: creds={list(creds.keys())}")

with open(r'C:\Users\sales\.claude\vizzy_api_payload.json', 'w') as f:
    json.dump(data, f)
print("Saved")
