---
name: Shared Drive File Organization Rule
description: Always save files to the correct Shared Drive using gdrive.py CLI — never use Google Workspace MCP for Drive/Shared Drive operations (it fails on shared drives)
type: feedback
originSessionId: 28538f79-b607-429a-8177-d3fcdd418bfb
---

## PRIMARY RULE — USE gdrive.py FOR ALL DRIVE OPERATIONS

**Always use `gdrive.py` CLI, never the google-workspace MCP, for any Google Drive or Shared Drive action.**

Script: `C:\Users\sales\OneDrive\Documents\CLAUDE\gdrive.py`
Auth: `gcloud auth print-access-token` (sales@ account — already configured)
Use `python` (not `python3`) on Windows.

Common commands:
- `python gdrive.py list-drives` — list all 5 shared drives
- `python gdrive.py list SALES` — list SALES drive root
- `python gdrive.py move <file_id> <folder_id>` — move file to shared drive folder
- `python gdrive.py mkdir "Name" SALES` — create folder in SALES drive
- `python gdrive.py find "query" --drive SALES` — search by name
- `python gdrive.py info <file_id>` — get file details

**Why:** Google Workspace MCP `renameFile`/`moveFile`/`createSpreadsheet` with shared drive parent IDs all fail with "File not found" or permissions errors — MCP doesn't pass `supportsAllDrives=True`. gdrive.py uses gcloud auth which has full access.

**Workflow for creating files in shared drives:**
1. Create doc/sheet via Google Workspace MCP (creates in My Drive — that works fine)
2. Immediately move it to the correct shared drive folder using `python gdrive.py move <id> <folder_id>`

---
When saving files, documents, or pictures to Google Drive, always save to one of the 5 Shared Drives based on business relevance:

- **MARKETING** — Ad assets, social media content, brand materials, SEO docs, email templates, content calendars, logos, campaign reports
- **OFFICE** — Administrative docs, contracts, legal, insurance, licensing, credentials/login sheets, company policies, HR docs
- **SALES** — Proposals, estimates, price sheets, lead lists, pipeline reports, call scripts, sales PDFs, customer quotes
- **OPERATIONS** — SOPs, scheduling, crew docs, equipment, job records, workflow documentation, n8n configs, process maps
- **TECHS** — Technical docs, field manuals, safety procedures, training materials, equipment specs, measurement data (RoofSnap/GutterGlove)

**Why:** Anthony wants organized business file storage across shared drives, not scattered in personal Drive. Makes files accessible to the right teams and agents.

**How to apply:** Before any Google Drive save/upload, decide which business area the file belongs to and target that Shared Drive. Use your judgment — if it spans multiple areas, pick the primary one.

---

## Google Shared Drive — MCP Limitation & CLI Workaround (2026-04-16)

**Problem:** The `google-workspace` MCP cannot write to or move files into Shared Drives. `createDocument`, `createSpreadsheet`, and `moveFile` all return "folder not found" when a Shared Drive ID is used as `parentFolderId` or `newParentId`. This is because the MCP does not pass `supportsAllDrives=True` in its API calls.

**Solution — use the service account + Python Drive API:**

```python
# Step 1: Create folder/files in Shared Drive using SERVICE ACCOUNT
from google.oauth2 import service_account
from googleapiclient.discovery import build
import google.auth.transport.requests

SA_FILE = r'C:\Users\sales\.claude\creds\n8n-service-account.json'
SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
creds = service_account.Credentials.from_service_account_file(SA_FILE, scopes=SCOPES)
creds.refresh(google.auth.transport.requests.Request())
drive = build('drive', 'v3', credentials=creds)

# Create folder in shared drive
folder = drive.files().create(
    body={'name': 'My Folder', 'mimeType': 'application/vnd.google-apps.folder', 'parents': [SHARED_DRIVE_ID]},
    supportsAllDrives=True, fields='id,name,webViewLink'
).execute()

# Step 2: Move existing My Drive files to Shared Drive using SALES ACCOUNT OAuth token
import json
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

with open(r'C:\Users\sales\.google-mcp\tokens\sales.json') as f:
    tok = json.load(f)

sales_creds = Credentials(
    token=None, refresh_token=tok['refresh_token'],
    client_id=tok['client_id'], client_secret=tok['client_secret'],
    token_uri='https://oauth2.googleapis.com/token'
)
sales_creds.refresh(Request())
drive_sales = build('drive', 'v3', credentials=sales_creds)

# Move file
f = drive_sales.files().get(fileId=FILE_ID, fields='parents', supportsAllDrives=True).execute()
drive_sales.files().update(
    fileId=FILE_ID,
    addParents=TARGET_FOLDER_ID,
    removeParents=','.join(f.get('parents', [])),
    supportsAllDrives=True, fields='id,name'
).execute()
```

**Sheets API:** Use `requests` library directly with access token — NOT `build('sheets', ...)` via httplib2 (DNS fails). Pattern:
```python
import requests
headers = {'Authorization': f'Bearer {creds.token}', 'Content-Type': 'application/json'}
resp = requests.put(f'https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/A1?valueInputOption=RAW', json={'values': rows}, headers=headers)
```

**Key constraints:**
- Cannot move FOLDERS into shared drives (only files) — `teamDrivesFolderMoveInNotSupported`
- Service account (`claude-code@famous-cache-375522.iam.gserviceaccount.com`) has full access to all 5 shared drives
- Sales account token: `C:\Users\sales\.google-mcp\tokens\sales.json`
- Service account key: `C:\Users\sales\.claude\creds\n8n-service-account.json`
- Use `python` (not `python3`) — libraries installed on Python 3.14 at `C:\Python314\`
