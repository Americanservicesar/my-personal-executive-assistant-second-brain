---
name: Google Shared Drive IDs
description: Folder IDs for the 5 business Shared Drives — OFFICE, MARKETING, OPERATIONS, SALES, TECHS — used for all file saves
type: reference
originSessionId: aeaa9595-141f-444b-a626-c80290562542
---
## Google Drive CLI (gdrive.py)
- **Script**: `C:\Users\sales\OneDrive\Documents\CLAUDE\gdrive.py`
- **Auth**: `gcloud auth print-access-token` (sales@americanservicesar.com — already configured)
- **Supports**: Shared Drives, My Drive, create folders, move files, rename, list, search, info — `supportsAllDrives=true` on all calls
- **Usage** (use `python` on Windows, not `python3`):
  - `python gdrive.py list-drives` — list all 5 shared drives
  - `python gdrive.py list SALES` — list root of SALES drive (use drive name OR folder ID)
  - `python gdrive.py mkdir "Folder Name" SALES` — create folder in SALES drive root
  - `python gdrive.py move <file_id> <folder_id>` — move file (removes from all current parents)
  - `python gdrive.py find "query" --drive SALES` — search by name
  - `python gdrive.py info <file_id>` — get file details (parents, mimeType, link)
  - `python gdrive.py rename <file_id> "New Name"` — rename any file or Google Doc by ID
- **Unicode/em dash tip**: Pass names via Python subprocess for proper encoding: `python -c "import subprocess; subprocess.run(['python','gdrive.py','rename','<id>','My Name \u2014 Subtitle'])"` 
- **OR use curl directly**: `TOKEN=$(gcloud auth print-access-token)` then `curl -H "Authorization: Bearer $TOKEN" "https://www.googleapis.com/drive/v3/..."` with `?supportsAllDrives=true&includeItemsFromAllDrives=true`
- **ALWAYS use gdrive.py for ALL Google Drive operations** — rename, move, create, list, search. Google Workspace MCP `renameFile`/`moveFile` fails with "File not found" due to ownership/permissions issues even on files you own. gdrive.py uses gcloud account auth which has full access.

---

All files, documents, and images should be saved to the appropriate Shared Drive based on business context.

| Drive | Folder ID | URL | What Goes Here |
|-------|-----------|-----|----------------|
| **OFFICE** | `0ABL9AE3k6__lUk9PVA` | https://drive.google.com/drive/folders/0ABL9AE3k6__lUk9PVA | Admin, credentials, contracts, legal, HR, policies, insurance, company docs |
| **MARKETING** | `0ABjZGQ1R4kxpUk9PVA` | https://drive.google.com/drive/folders/0ABjZGQ1R4kxpUk9PVA | Ad assets, social content, brand materials, SEO, email templates, campaigns |
| **OPERATIONS** | `0AFIDD8jENIweUk9PVA` | https://drive.google.com/drive/folders/0AFIDD8jENIweUk9PVA | SOPs, scheduling, crew docs, workflow docs, n8n configs, process maps |
| **SALES** | `0AAFM2b9wv0C5Uk9PVA` | https://drive.google.com/drive/folders/0AAFM2b9wv0C5Uk9PVA | Proposals, estimates, price sheets, lead lists, pipeline reports, sales PDFs |
| **TECHS** | `0AGFsGbvfW_LAUk9PVA` | https://drive.google.com/drive/folders/0AGFsGbvfW_LAUk9PVA | Field manuals, safety, training, equipment specs, measurements (RoofSnap/GutterGlove) |

## Known Subfolders

| Drive | Folder | ID | Contents |
|-------|--------|----|----------|
| OFFICE | Cassie Customer Support | `1ezQigrIx3dJbQqN_LT_6atEzi-K39hnd` | Complaint Log, Satisfaction Tracker, Churn Risk Log sheets + agent reference doc |
| OPERATIONS | Agent Game Plans | `1N-UtY-LhVUBq26fguBxqVJcBv_0gu49U` | Game plan docs for all 12 agents (confirmed — Emmie doc is here) |
| OPERATIONS | Agent Game Plans (alt) | `1bGwJ_yW8mjdEqhW5eE0zBfEF4yjvz81E` | Second folder with same name — may be duplicate |
| SALES | Instantly Lead Lists | `1uvXIp_hzLbhhE1LR0fleVLmA8REoD2KF` | All Instantly lead lists — download BEFORE and AFTER every campaign |
| SALES | Instantly Lead Lists/Commercial Washing Pros | `1_hncjxfv_2x6mtJl0dEDlmcPBZJycDLs` | CSV exports from Commercial Washing Pros campaign |
| SALES | Instantly Lead Lists/Clean Property Experts | `1uuN-_goF-GuA0Z8Cdy1DrQE2bL_1JmeR` | CSV exports from Clean Property Experts campaign |
| SALES | Instantly Lead Lists/Commercial Washing | `11oE0ZQ1VaUWTTalwOJZs6uGfqfIUd7ir` | CSV exports from Commercial Washing campaign |
| SALES | Instantly Lead Lists/ASAR-01-Apartments | `1SE32Vd0zEvSBMrFTnmgAiIKh561t7C52` | CSV exports from ASAR-01-Apartments campaign |
| SALES | Instantly Lead Lists/Drafts | `1usr9BtxXs4fAZ0p8zaX_QS8NYAsfdA4M` | Draft campaign lead lists |

## Instantly Lead List Protocol (MANDATORY)
Every time a lead list is pulled (via SuperSearch or any source) for an Instantly campaign:
1. **Download CSV first** — before uploading to Instantly
2. **Save to SALES/Instantly Lead Lists/[Campaign Name]/** using gdrive.py upload
3. **Naming convention:** `YYYY-MM-DD_[Campaign-Name]_leads.csv`
4. **Then upload to Instantly campaign** — Leads tab → Import
5. **After campaign runs:** Download analytics CSV from Instantly → save same folder as `YYYY-MM-DD_[Campaign-Name]_analytics.csv`
This ensures all lead data is preserved if Instantly subscription ends.
