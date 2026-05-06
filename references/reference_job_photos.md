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
- **Status:** Active (n8n workflow still has Claude Vision issues)

## Manual Pipeline Script (WORKING — use this)
- **Script:** `C:\Users\sales\Downloads\run_photo_pipeline_test.py`
- **Tested:** 2026-04-28 — 10/10 cities uploaded successfully
- **What it does:**
  1. Reads photo bytes from local file
  2. Injects GPS EXIF for each of 10 cities (pure Python binary TIFF struct)
  3. Uploads to WP Media Library ×10 cities with SEO alt/title/caption/description/slug
  4. Renames Drive file via gdrive.py CLI
  5. Moves to correct service folder via gdrive.py CLI
- **Drive ops:** Always via `python gdrive.py` — NEVER Google Workspace MCP
- **Inbox cleanup needed:** ~20 test copies of photos in inbox (IDs from test1-test5 drops)
- **Uncategorized cleanup:** `2026-04-17_Uncategorized_Conway-AR_Job.jpg` needs reprocessing

## Test Results (2026-04-28)
- Photo: `20260408_135711.jpg` → `2026-04-08_Fleet-Washing_Conway-AR_Before.jpg`
- Drive: moved to `MARKETING/Job Photos & Videos/Fleet Washing/` (ID: `1iOQytdKzafUUoB_K1zdx_hj5GlGWlrYT`)
- WP Media IDs: Conway=9929, LR=9930, NLR=9931, Maumelle=9932, Sherwood=9933, Benton=9934, Bryant=9935, Cabot=9936, Jacksonville=9937, Greenbrier=9938

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
