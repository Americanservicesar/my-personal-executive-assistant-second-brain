---
name: Job Photos & Videos Drive Structure
description: Google Drive folder IDs for ASAR job photos in MARKETING shared drive, plus n8n auto-process workflow
type: reference
originSessionId: ccb3e528-01da-49dc-b07e-762b0b0108ff
---
## Main Folder
- **Job Photos & Videos** — ID: `1AgXMJgHSN4T2ULexdLB2RrqePMWPFTtc`
- Location: MARKETING shared drive
- URL: https://drive.google.com/drive/folders/1AgXMJgHSN4T2ULexdLB2RrqePMWPFTtc

## Inbox (Drop Photos Here)
- **00 - Upload Here (Inbox)** — ID: `1HecajEMFBloiIJwHRPBeteczQOQYme8m`
- URL: https://drive.google.com/drive/folders/1HecajEMFBloiIJwHRPBeteczQOQYme8m

## Service Subfolders
| Service | Folder ID |
|---------|-----------|
| House Washing | `1PlLGpLH_8Sp0KvcYgbR11p0zQskC8YXe` |
| Pressure Washing | `1qtfJye9rJLPl1UkhYLYFEEtZyx7Axhmn` |
| Soft Washing | `1pYjrU7QbtiiqVgUugVXNHfwuSRkR1vT6` |
| Roof Cleaning | `19iCVOsiti_1Ey6ylNUeOaboz2dxamc-f` |
| Window Cleaning | `1jLoSz140qxeCjKHAM75hCawMxuOeo7T4` |
| Concrete Cleaning | `13SiREtZGPOaDVU9JYxh0jMVkDZsnipnz` |
| Deck & Fence Cleaning | `1aLTflcCsNb_XKy1jY9_MB02J-iL8zEh7` |
| Gutter Cleaning | `1Xl1Fzx7xwr7i1zpwe52Qlr1n8XWklprs` |
| Gutter Guards | `1A37OpFa0dnKPA4xeXwihiX-coAJW_AOS` |
| Gutter Installation | `1FhKyvdS3q40xle-dB6wznXBskWX1yONN` |
| Fleet Washing | `1iOQytdKzafUUoB_K1zdx_hj5GlGWlrYT` |
| Parking Lot Maintenance | `11K9gUfhF2mIUB4D9DNxud61Za1xmosUR` |
| Holiday Lighting | `1n1IudBbN7cqyEuIfYazgmGX5IH6cQYJH` |
| Commercial Maintenance | `1IsiYfTpBpE9rKpN2qRHjzfohH7zytyQG` |
| Residential Maintenance | `10X-sl3ZZ-Bh_BImmqjiD6haEmDUCebBC` |
| Construction Cleanup | `1lzvK1YlMmZZ9zvmkOP1PwSrIBS9Zl_IS` |
| Uncategorized | `1JVG-ik6A5ZN7OwC8QXr5NnIuTwriQdUO` |

## n8n Workflow
- **Name:** ASAR Job Photos — Auto-Rename & Organize
- **Workflow ID:** `6PScfCFdHU6gKlQA`
- **Status:** Active (but Claude Vision still broken — see IN PROGRESS below)

## ⚠️ IN PROGRESS — Workflow Fix (resume next session)
Script: `C:\Users\sales\AppData\Local\Temp\fix_job_photos_workflow.py`

**Root cause chain discovered:**
1. n8n Task Runner sandboxes Code nodes — `fs` blocked, binary is filesystem-v2 ref
2. `moveBinaryData` node (Extract Base64) DOES convert binary → `$json.data` (4.8MB base64 string) ✓
3. HTTP Request `contentType:"raw"` `body` param does NOT evaluate `{{ }}` templates or `=expr` 
4. Code node cannot return 4.8MB strings — "json isn't an object" Task Runner size error
5. **Next fix to try**: Use IIFE in `={{ }}` expression on HTTP Request body to avoid `}}` scanner issue

**Current workflow nodes (deployed):**
Trigger → Download File → Extract Base64 (moveBinaryData) → Build Claude Body (Code) → Claude Vision (HTTP Request) → Parse AI Response (Code) → Rename+Move (HTTP Request) → Slack

**Next step — implement IIFE approach:**
Replace the `Build Claude Body` Code node with no node. Put this directly as the Claude Vision HTTP Request body:
```
={{ (function(){var src={type:'base64',media_type:$json.mimeType,data:$json.data};var img={type:'image',source:src};var txt={type:'text',text:'PROMPT'};var msg={role:'user',content:[img,txt]};var bdy={model:'claude-haiku-4-5-20251001',max_tokens:400,messages:[msg]};return JSON.stringify(bdy);})() }}
```
- `$json.data` = 4.8MB base64 from Extract Base64 output
- `$json.mimeType` = "image/jpeg" from file metadata
- No `}}` inside IIFE → n8n template scanner won't close prematurely
- No Code node → no Task Runner size limit
- Drive PATCH body: same IIFE approach with `$json.seoFilename`, `$json.description` etc.

**Inbox cleanup needed:** ~20 test copies of photos in inbox (IDs from test1-test5 drops)
**Uncategorized cleanup:** `2026-04-17_Uncategorized_Conway-AR_Job.jpg` needs reprocessing

## How It Works (intended, once fixed)
1. Drop any photo into **00 - Upload Here (Inbox)**
2. Workflow triggers within 1 minute
3. Claude Vision AI analyzes photo — detects service type, phase, property type
4. Renames to SEO format: `YYYY-MM-DD_[Service]_Conway-AR_[Phase].jpg`
5. Adds Drive metadata: description, keywords, GPS coords (35.0887, -92.4421), copyright
6. Moves to matching service subfolder
7. Posts confirmation to #agent-activity Slack channel

## Service Account Used
- `claude-code@famous-cache-375522.iam.gserviceaccount.com`
- Key: `C:\Users\sales\.claude\creds\n8n-service-account.json`
