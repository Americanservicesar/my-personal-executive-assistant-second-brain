---
name: Master Commands — Trigger Phrases
description: When Anthony says these exact phrases, Claude executes the full defined workflow automatically. No clarification needed.
type: reference
last_updated: 2026-05-06
originSessionId: 0fd81466-46ae-41e4-807f-72687c16e397
---
## TRIGGER: "master save"

When Anthony types "master save", execute ALL of the following in order:

1. **Write new feedback files** for any bugs fixed or lessons learned this session
   - Filename: `feedback_[topic].md` in `C:\Users\sales\.claude\projects\C--Users-sales--claude\memory\`
   - Include: what broke, why, exact fix, lesson for future sessions

2. **Update changed reference/project files** — any `reference_*.md` or `project_*.md` that reflects new state

3. **Update MEMORY.md index** — add entries for any new files, update existing entries with new status

4. **Push ALL changed files to GitHub Brain**
   - Repo: `Americanservicesar/my-personal-executive-assistant-second-brain`
   - PAT: in `C:\Users\sales\OneDrive\Documents\CLAUDE\push_brain.py`
   - Use the `push_file()` function from that script
   - Push: all new/changed memory files + updated MEMORY.md

5. **Upload new docs/plans to Google Shared Drive**
   - Use gcloud REST API (NOT Google Workspace MCP, NOT gdrive.py — it has no upload command)
   - Upload pattern: `gcloud.cmd auth print-access-token` + multipart/related POST to Drive API
   - Route to correct drive: MARKETING (ads/brand/SEO), OPERATIONS (SOPs/workflows), SALES (leads/proposals), OFFICE (admin/legal), TECHS (field/equipment)
   - MARKETING/Meta Ads folder ID: `1pnkZR_SRROHCnqBM5bmbLSRE95k4Y6dD`
   - OPERATIONS/Agent Game Plans folder ID: `1N-UtY-LhVUBq26fguBxqVJcBv_0gu49U`

6. **Confirm each location** with a checkmark summary when done

---

## TRIGGER: "master sync"

When Anthony types "master sync", execute ALL of the following in order:

1. **Pull latest from GitHub Brain**
   - Fetch `memory/MEMORY.md` from `Americanservicesar/my-personal-executive-assistant-second-brain`
   - Read any reference files relevant to current work

2. **Verify actual system state** (don't trust memory alone — check live):
   - Meta: check audience sizes + campaign status via API
   - n8n: check workflow active/inactive status via n8n API
   - WordPress: check UptimeRobot monitor status
   - GHL: check any pending pipeline items if relevant

3. **Identify drift** — anything in memory that doesn't match live state → flag it

4. **Run master save** (steps 1-6 above) to push any corrections back out

5. **Report**: what was in sync, what was stale, what was corrected

---

## TRIGGER: "push to brain"

Push only to GitHub Brain — skip Drive upload. Useful for quick memory updates mid-session.

---

## TRIGGER: "save to drive"

Upload current session's output files to the appropriate Google Shared Drive folder only.

---

## Drive Upload Code Pattern (copy-paste ready)

```python
import subprocess, urllib.request, json

token = subprocess.check_output(['gcloud.cmd', 'auth', 'print-access-token'], text=True).strip()
FOLDER_ID = 'TARGET_FOLDER_ID'
upload_url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true'

with open(r'LOCAL_FILE_PATH', 'rb') as f:
    content = f.read()

boundary = b'----UploadBoundary'
metadata = json.dumps({'name': 'DRIVE_FILE_NAME', 'parents': [FOLDER_ID], 'mimeType': 'text/plain'}).encode()
body = (b'--' + boundary + b'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' +
        metadata + b'\r\n--' + boundary + b'\r\nContent-Type: text/plain\r\n\r\n' +
        content + b'\r\n--' + boundary + b'--')
req = urllib.request.Request(upload_url, data=body, method='POST',
    headers={'Authorization': f'Bearer {token}',
             'Content-Type': f'multipart/related; boundary={boundary.decode()}'})
result = json.loads(urllib.request.urlopen(req).read())
print(f'https://drive.google.com/file/d/{result[\"id\"]}/view')
```

---

## GitHub Brain Push Code Pattern (copy-paste ready)

```python
import urllib.request, json, base64

PAT = 'SEE_MASTER_CREDENTIALS_SHEET'
REPO = 'Americanservicesar/my-personal-executive-assistant-second-brain'
BASE = f'https://api.github.com/repos/{REPO}/contents'

def get_sha(path):
    req = urllib.request.Request(f'{BASE}/{path}',
        headers={'Authorization': f'token {PAT}', 'Accept': 'application/vnd.github.v3+json'})
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read().decode()).get('sha')
    except: return None

def push_file(path, content, msg='sync'):
    sha = get_sha(path)
    payload = {'message': msg, 'content': base64.b64encode(content.encode('utf-8')).decode('ascii')}
    if sha: payload['sha'] = sha
    req = urllib.request.Request(f'{BASE}/{path}', data=json.dumps(payload).encode(), method='PUT',
        headers={'Authorization': f'token {PAT}', 'Accept': 'application/vnd.github.v3+json',
                 'Content-Type': 'application/json'})
    try:
        urllib.request.urlopen(req)
        print(f'  PUSHED: {path}')
    except urllib.error.HTTPError as e:
        print(f'  ERROR: {path} — {e.read().decode()[:150]}')
```
