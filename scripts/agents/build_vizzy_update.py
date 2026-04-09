import json, uuid, copy

with open(r'C:\Users\sales\.claude\projects\C--Users-sales--claude\fe6489a2-8c99-4aff-b53d-fb7f9abef3af\tool-results\workflow_raw.json') as f:
    wf = json.load(f)

# ============================================================
# 1. UPDATE VIZZY'S SYSTEM MESSAGE
# ============================================================
vizzy_system_message = """You are Vizzy, the AI Operations Manager and Supervisor Agent for American Services AR (ASAR). You report directly to Anthony Sons, the owner.

## MISSION
Run daily operations, coordinate the AI agent team, manage all 4 email inboxes, organize Google Drive, handle travel planning, and ensure nothing falls through the cracks. You are the central nervous system — every task either gets handled by you directly or routed to the right agent.

## BRANDS
- **American Services AR (ASAR)** — Core brand (pressure washing, gutter cleaning, window cleaning, soft washing, holiday lighting)
- **Apex Shield Construction** — Roofing & gutters
- **Legendary Home Services** — Handyman / general maintenance

## AI AGENT TEAM — ROUTING TABLE
| Agent | Domain | Route When... |
|-------|--------|---------------|
| **Milli** | Sales Manager | Leads, pipeline, follow-up, closing, cold calls/emails, objection handling |
| **Penn** | Copywriter | Ad copy, website copy, landing pages, blog posts, sales scripts, proposals |
| **Emmie** | Email Marketing | Email campaigns, nurture sequences, cold outreach, win-back flows, review requests |
| **Soshie** | Social Media | Content calendar, platform posting, trends, hashtags, repurposing content |
| **Buddy** | Business Development | Partnerships, bids, RFPs, proposals, competitor analysis, market research |
| **Cassie** | Customer Support | Customer complaints, questions, follow-ups, review management, service issues |
| **Seomi** | SEO Specialist | Blog SEO, keyword research, meta tags, on-page audits, WordPress changes (7 sites) |
| **Scouty** | Recruiter | Job descriptions, candidate screening, interview scheduling, onboarding, crew planning |
| **Gigi** | Personal Growth Coach | Anthony's routines, health, fitness, meal planning, family events, study schedules |
| **Commet** | eCommerce Manager | Online store, service packages, pricing tiers, seasonal offers, booking pages |
| **Dexter** | Data Analyst | KPIs, reports, QuickBooks data, dashboards, job profitability, revenue forecasting |

## EMAIL ACCOUNT ROUTING
| Account | Primary Agent | Secondary |
|---------|--------------|-----------|
| sales@americanservicesar.com | Milli (leads), Emmie (campaign replies) | Vizzy (monitoring) |
| office@americanservicesar.com | Cassie (support) | Vizzy (operations) |
| asons@americanservicesar.com | Buddy (partnerships) | Vizzy (executive) |
| sonsfamily2012@gmail.com | Gigi (family events) | Vizzy (family calendar) |
| Instantly sending accounts | Emmie | Milli (warm replies) |

## INBOX MANAGEMENT PROTOCOL
For each email account, you can: read, send, reply, label, delete, mark read/unread, manage drafts.
- **Delegation-first policy**: Route emails to the right agent before acting yourself
- Label system: Red=Needs Action, Yellow=Review, White=Noise/Archive
- Auto-skip: Amazon shipping, promotional, automated receipts
- Unsubscribe from persistent spam/marketing when Anthony approves

## DAILY BRIEFING FORMAT
When Anthony asks for a briefing (or first thing in morning):
1. **Schedule** — Today's events from Google Calendar
2. **Email — Needs Action** — Red items with sender, subject, summary, suggested action + agent route
3. **Email — Worth Reviewing** — Yellow items (brief list only)
4. **Today's Focus** — Top 3 priorities connected to standing goals
5. **Agent Actions** — Tasks to route to agents today
6. **On the Radar** — Next 48-72 hours preview

Keep under 300 words. No bullet padding. If nothing urgent, say so clearly.

## STANDING PRIORITIES (frame Today's Focus around these)
1. Scale commercial & industrial work — $5K-$50K projects
2. Build AI-first operations system — n8n agents
3. Local SEO domination — 7 AR websites
4. Automate lead generation — always-on pipeline
5. Financial optimization — cash flow + owner pay

## TRAVEL PLANNING
When Anthony needs travel arranged:
- **Airlines**: Southwest (primary), Delta, American, Hawaiian, United, Allegiant
- **Hotels**: Marriott Bonvoy (primary), Hilton, Choice Hotels
- **Car Rental**: Enterprise
- **Rideshare**: Uber
- **Food Delivery**: DoorDash
Use SerpApi to search for flights, hotels, and options. Present comparison tables.

## GOOGLE DRIVE MANAGEMENT
- Organize files into proper folder structure
- Clean up duplicates and orphaned files
- Maintain folder hierarchy for each brand
- Search and retrieve documents as needed

## SERVICE ROBOT / HIGHLEVEL (Read Access)
- Look up contacts, opportunities, tasks, and calendar
- Check pipeline status and lead information
- Do NOT make direct edits — route edit requests to the appropriate agent

## ORCHESTRATION RULES
1. **Delegate parallel** — Launch multiple agents simultaneously when tasks are independent
2. **Track handoffs** — Log when one agent passes work to another
3. **Flag stalls** — Leads/tasks older than 7 days with no activity — alert Anthony
4. **Escalate** — Priorities unaddressed for 3+ days get flagged immediately
5. **Synthesize** — Always provide actionable summaries, not raw data dumps
6. **Slack reporting** — Log all significant actions and agent coordination to Slack

## TONE
Direct, strategic, efficient. Anthony's trusted operations partner. No fluff, no filler — every word earns its place."""

# Find Vizzy node and update
for n in wf['nodes']:
    if n['name'] == 'Vizzy - Supervisor Agent':
        n['parameters']['options']['systemMessage'] = vizzy_system_message
        print(f"Updated Vizzy system message: {len(vizzy_system_message)} chars")
        break

# ============================================================
# 2. ADD NEW TOOL NODES FOR VIZZY
# ============================================================

base_x = 2064  # Vizzy's x position
base_y = -400  # Above Vizzy
x_spacing = 250

new_nodes = []

# --- Gmail Tools (4 accounts) ---
gmail_accounts = [
    ("Gmail - Vizzy (sales@)", "Send and manage emails via sales@americanservicesar.com for operations coordination"),
    ("Gmail - Vizzy (office@)", "Send and manage emails via office@americanservicesar.com for business operations"),
    ("Gmail - Vizzy (asons@)", "Send and manage emails via asons@americanservicesar.com for executive communications"),
    ("Gmail - Vizzy (sonsfamily@)", "Send and manage emails via sonsfamily2012@gmail.com for family coordination"),
]

for i, (name, desc) in enumerate(gmail_accounts):
    new_nodes.append({
        "parameters": {
            "descriptionType": "manual",
            "toolDescription": desc,
            "sendTo": "={{ $fromAI('to', 'Email recipient address', 'string') }}",
            "subject": "={{ $fromAI('subject', 'Email subject line', 'string') }}",
            "message": "={{ $fromAI('message', 'Email message body', 'string') }}",
            "options": {}
        },
        "id": str(uuid.uuid4()),
        "name": name,
        "type": "n8n-nodes-base.gmailTool",
        "typeVersion": 2.2,
        "position": [base_x - 800 + (i * x_spacing), base_y]
    })

# --- SerpApi Tool ---
new_nodes.append({
    "parameters": {
        "options": {}
    },
    "id": str(uuid.uuid4()),
    "name": "SerpApi - Vizzy",
    "type": "@n8n/n8n-nodes-langchain.toolSerpApi",
    "typeVersion": 1,
    "position": [base_x - 800 + (4 * x_spacing), base_y]
})

# --- HighLevel Tools (3: contacts, opportunities, tasks) ---
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
        "position": [base_x - 800 + ((5 + i) * x_spacing), base_y]
    })

# --- Google Sheets Tool ---
new_nodes.append({
    "parameters": {
        "documentId": {
            "__rl": True,
            "mode": "id",
            "value": "={{ $fromAI('spreadsheetId', 'The Google Sheets spreadsheet ID', 'string') }}"
        },
        "sheetName": {
            "__rl": True,
            "mode": "name",
            "value": "={{ $fromAI('sheetName', 'The sheet tab name', 'string') }}"
        },
        "options": {}
    },
    "id": str(uuid.uuid4()),
    "name": "Google Sheets - Vizzy",
    "type": "n8n-nodes-base.googleSheetsTool",
    "typeVersion": 4.7,
    "position": [base_x - 800 + (8 * x_spacing), base_y]
})

# --- Google Drive Tool (search files/folders) ---
new_nodes.append({
    "parameters": {
        "descriptionType": "manual",
        "toolDescription": "Search, list, and manage files and folders in Google Drive",
        "resource": "fileFolder",
        "operation": "search",
        "searchMethod": "name",
        "queryString": "={{ $fromAI('searchQuery', 'File or folder name to search for', 'string') }}",
        "returnAll": True,
        "filter": {},
        "options": {}
    },
    "id": str(uuid.uuid4()),
    "name": "Google Drive - Vizzy",
    "type": "n8n-nodes-base.googleDriveTool",
    "typeVersion": 3,
    "position": [base_x - 800 + (9 * x_spacing), base_y]
})

# --- Google Docs Tool ---
new_nodes.append({
    "parameters": {
        "descriptionType": "manual",
        "toolDescription": "Create, read, and update Google Docs documents",
        "resource": "document",
        "operation": "create",
        "title": "={{ $fromAI('title', 'Document title', 'string') }}"
    },
    "id": str(uuid.uuid4()),
    "name": "Google Docs - Vizzy",
    "type": "n8n-nodes-base.googleDocsTool",
    "typeVersion": 2,
    "position": [base_x - 800 + (10 * x_spacing), base_y]
})

# --- Slack Tool ---
new_nodes.append({
    "parameters": {
        "descriptionType": "manual",
        "toolDescription": "Post messages to Slack channels for team communication and activity logging",
        "authentication": "oAuth2",
        "select": "channel",
        "channelId": {
            "__rl": True,
            "mode": "id",
            "value": "={{ $fromAI('channel', 'Slack channel ID to post to', 'string') }}"
        },
        "text": "={{ $fromAI('message', 'Message to post to Slack', 'string') }}",
        "otherOptions": {}
    },
    "id": str(uuid.uuid4()),
    "name": "Slack Tool - Vizzy",
    "type": "n8n-nodes-base.slackTool",
    "typeVersion": 2.4,
    "position": [base_x - 800 + (11 * x_spacing), base_y]
})

# Add new nodes to workflow
wf['nodes'].extend(new_nodes)
print(f"Added {len(new_nodes)} new tool nodes")

# ============================================================
# 3. ADD CONNECTIONS (new tools -> Vizzy)
# ============================================================
vizzy_name = "Vizzy - Supervisor Agent"

for nn in new_nodes:
    wf['connections'][nn['name']] = {
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

print(f"Added {len(new_nodes)} new connections")

# ============================================================
# 4. SAVE THE MODIFIED WORKFLOW
# ============================================================
output = {
    "name": wf['name'],
    "nodes": wf['nodes'],
    "connections": wf['connections'],
    "settings": wf['settings'],
    "meta": wf.get('meta', {}),
    "tags": wf.get('tags', [])
}

output_path = r'C:\Users\sales\.claude\vizzy_updated_workflow.json'
with open(output_path, 'w') as f:
    json.dump(output, f, indent=2)

print(f"\nSaved updated workflow to: {output_path}")
print(f"Total nodes: {len(wf['nodes'])}")
print(f"Total connections: {len(wf['connections'])}")

print("\nNew nodes added:")
for nn in new_nodes:
    print(f"  - {nn['name']} ({nn['type']})")
