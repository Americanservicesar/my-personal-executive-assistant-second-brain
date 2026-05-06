---
name: Meta Ads — Audience Wiring + Lookalike Bugs Fixed
description: Mistakes made and fixes applied during Meta ads audience setup session 2026-05-06
type: feedback
last_updated: 2026-05-06
originSessionId: 0fd81466-46ae-41e4-807f-72687c16e397
---

## BUG 1 — Ad Sets Built With Empty Audience Targeting

**What happened:**
All 5 ad sets (C1–C5) were built while Custom Audiences TOS was pending. The `custom_audiences` and `excluded_custom_audiences` fields were empty on all ad sets — no audience was actually attached.

**Why it mattered:**
- C1 would have run broad instead of targeting the 1,397 HCP past customers
- C5 would have had no exclusions, wasting budget on existing customers
- Lookalikes not wired = cold campaigns running raw interest targeting only

**Fix:**
After TOS was accepted, updated each ad set via Meta Marketing API v21.0:
```python
requests.post(f'{BASE}/{adset_id}', data={
    'access_token': TOKEN,
    'targeting': json.dumps({
        'custom_audiences': [{'id': audience_id}],
        'excluded_custom_audiences': [{'id': excl_id}]
    })
})
```

**Lesson:**
Always verify `custom_audiences` field via API AFTER TOS is accepted. When TOS is pending during ad set creation, audience assignments silently fail — the ad set saves but audience is dropped. Run a post-build audit: `GET /{adset_id}?fields=targeting` and confirm `custom_audiences` is not empty.

---

## BUG 2 — 2%/3% HCP Lookalikes Blocked by Meta Dedup Cache

**What happened:**
Tried to create 2%/3% lookalike audiences from the HCP Customer List. Meta returned error:
`(#2654) Can't Create a Duplicate Lookalike: You've already created a lookalike audience with the same source, country and size.`

But when fetching all audiences in the account, only 2 lookalikes existed (both 1%). The 2%/3% from HCP were NOT in the account — they had been created and deleted in a prior session.

**Why it happened:**
Meta's dedup system caches lookalike parameters even after deletion. The cache persists for an unknown period (days to weeks). Creating a new audience with the same source+country+ratio hits the cache and fails, even though no active audience with those params exists.

**Also failed:** Creating 2%/3% from Website 60d — same dedup error.

**Workaround:**
Created from alternative, previously unused sources:
- `ASAR 2pct Lookalike - Website Visitors 90d USA` → ID `120246250261560723` (wired to C4)
- `ASAR 3pct Lookalike - Website Visitors 30d USA` → ID `120246250278550723` (for scale)

**Lesson:**
Never delete a lookalike audience unless you're certain you won't need to recreate the same parameters. Meta dedup cache blocks recreation indefinitely (or for a very long time). When you need to swap a lookalike, rename and update it — don't delete and recreate. Once the HCP Customer List grows to 5,000+ records post QB merge, create new HCP-seeded 2%/3% lookalikes from the LARGER list — this counts as a different source (different audience size = different parameters in Meta's system).

---

## BUG 3 — Access Token Typo in Bash Script

**What happened:**
When typing the Meta API token manually in a bash python -c command, the token was corrupted:
- Correct: `...MCpLeJVCDrIaDlTyvXJp5woPmblZ...`
- Typed:   `...MCpLeJVCDlyvXJp5woPmblZ...`  (missing `rIaDlT`)

Meta returned: `Malformed access token` error.

**Fix:**
Read the token directly from `build_ads.py` using `Read` tool, then copy exactly. Never type long tokens manually.

**Lesson:**
For any script using the Meta API token, always import it from the canonical file (`build_ads.py`) or use a dedicated credentials reference. Never type/retype a 197-character token by hand. Pattern to use in future scripts:
```python
# At top of any new script
import sys
sys.path.insert(0, r'C:\Users\sales\OneDrive\Documents\CLAUDE\meta_adsets')
from build_ads import TOKEN  # single source of truth
```

---

## BUG 4 — gdrive.py Has No Upload Command

**What happened:**
Tried to use `python gdrive.py upload ...` to save files to MARKETING Shared Drive. Command didn't exist — gdrive.py only supports: `list-drives, list, mkdir, move, info, find, rename`.

**Fix:**
Used Google Drive REST API directly with gcloud auth:
```python
import subprocess, urllib.request, json

token = subprocess.check_output(['gcloud.cmd', 'auth', 'print-access-token'], text=True).strip()

# Multipart upload
upload_url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true'
boundary = b'----UploadBoundary'
body = (
    b'--' + boundary + b'\r\n'
    b'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    json.dumps({'name': filename, 'parents': [folder_id], 'mimeType': 'text/plain'}).encode() + b'\r\n'
    b'--' + boundary + b'\r\n'
    b'Content-Type: text/plain\r\n\r\n' +
    file_content + b'\r\n'
    b'--' + boundary + b'--'
)
req = urllib.request.Request(upload_url, data=body, method='POST',
    headers={'Authorization': f'Bearer {token}',
             'Content-Type': f'multipart/related; boundary={boundary.decode()}'})
urllib.request.urlopen(req)
```

**Lesson:**
gdrive.py is CLI-only for navigation/organization ops. For file uploads, always use the Drive REST API directly with gcloud auth. Consider adding an `upload` command to gdrive.py to simplify future uploads.

---

## WHAT WAS VERIFIED CLEAN

- 5/5 Campaigns confirmed PAUSED READY with correct budgets and OUTCOME_LEADS objective
- 5/5 Ad sets confirmed with correct geo (2 coordinate-based locations = Conway + Little Rock area), ages 25-65, 1 flexible_spec block each
- 5/5 Custom conversions confirmed live: Lead/Schedule/Contact/ViewContent all firing
- 5/5 Creatives confirmed on Meta servers (IDs in LAUNCH_CHECKLIST.md)
- Pixel ID 754902199616286 confirmed on all website audiences
- All audience exclusions confirmed applied: C3 excludes HCP list, C5 excludes HCP list + Website 7d

## AUDIENCES WIRED TO AD SETS (post-fix state)

| Ad Set | Include | Exclude |
|---|---|---|
| C1 | HCP Customer List (120246249754120723) | — |
| C2 | Website 30d, 60d, Service Page 30d, Booking 30d, Landing 30d | — |
| C3 | 1% HCP Lookalike (120246249877030723) | HCP Customer List |
| C4 | 2% Web 90d Lookalike (120246250261560723) | — |
| C5 | 1% HCP Lookalike + 1% Web 60d Lookalike | HCP Customer List + Website 7d |
