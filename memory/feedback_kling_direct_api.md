---
name: Kling AI — Direct API Calling Pattern
description: How to call Kling API directly from this machine (DNS quirks, auth, base64 images)
type: feedback
date: 2026-05-09
originSessionId: cf8d72a1-5ff6-48f5-8bb3-727e81ac9946
---

## Problem
Needed to call Kling AI API directly from Claude Code (not via n8n) to generate a video preview before posting.

## DNS Quirks — Which Tools Can Reach klingai.com

| Tool | Can Reach klingai.com? | Notes |
|------|----------------------|-------|
| Windows Python (C:\Python314) | ❌ NO | Errno 11001 — getaddrinfo failed |
| PowerShell Invoke-RestMethod | ❌ NO | Same DNS failure |
| Bash curl (Git Bash) | ✅ YES | Resolves 23.55.178.13 / 23.55.178.150 |
| n8n cloud workflows | ✅ YES | Cloud server, no local DNS issue |

Note: n8n.cloud also fails DNS from PowerShell sometimes — use PowerShell for n8n when it works, fall back to verifying via Bash curl if needed.

## Kling API — Key Facts
- Accepts **base64 image data** directly in the `image` field — no public URL required
- Do NOT upload to WordPress or any other host just to get a URL — waste of effort
- JWT must be generated fresh each call (exp = now+1800, nbf = now-5)
- Model: `kling-v1-6`, mode: `std`, duration: `5`
- Image2Video endpoint: `POST https://api.klingai.com/v1/videos/image2video`
- Poll endpoint: `GET https://api.klingai.com/v1/videos/image2video/{task_id}`
- Done when `data.task_status == "succeed"` → `data.task_result.videos[0].url`

## JWT Generation in Bash (openssl — works on this machine)

```bash
AK="ArAYLA4dMBBR9fk3LyGhCNPEQpgCNbtP"
SK="yCtJ9eaBy49tANJegCPGFRgLLefNNThe"
NOW=$(date +%s); EXP=$((NOW+1800)); NBF=$((NOW-5))
HEADER=$(printf '{"alg":"HS256","typ":"JWT"}' | base64 -w0 | tr '+/' '-_' | tr -d '=')
PAYLOAD=$(printf '{"iss":"%s","exp":%d,"nbf":%d}' "$AK" "$EXP" "$NBF" | base64 -w0 | tr '+/' '-_' | tr -d '=')
MSG="${HEADER}.${PAYLOAD}"
SIG=$(printf '%s' "$MSG" | openssl dgst -sha256 -hmac "$SK" -binary | base64 -w0 | tr '+/' '-_' | tr -d '=')
JWT="${MSG}.${SIG}"
```

## Full curl Submit Pattern (Bash)

```bash
# Download from Drive first (needs gcloud token):
TOKEN=$(gcloud auth print-access-token)
curl -s -o /tmp/image.jpg -H "Authorization: Bearer $TOKEN" \
  "https://www.googleapis.com/drive/v3/files/DRIVE_FILE_ID?alt=media"

# Build JSON body with base64 image:
B64=$(base64 -w0 /tmp/image.jpg)
# Write to file to avoid shell escaping issues:
printf '{"model":"kling-v1-6","image":"%s","prompt":"%s","negative_prompt":"blurry,watermark","cfg_scale":0.5,"mode":"std","duration":"5"}' \
  "$B64" "YOUR PROMPT HERE" > /tmp/body.json

# Submit:
RESP=$(curl -s -X POST "https://api.klingai.com/v1/videos/image2video" \
  -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" --data @/tmp/body.json)
TASK_ID=$(echo "$RESP" | grep -o '"task_id":"[^"]*"' | cut -d'"' -f4)

# Poll until done:
while true; do
  POLL=$(curl -s "https://api.klingai.com/v1/videos/image2video/$TASK_ID" \
    -H "Authorization: Bearer $JWT")
  STATUS=$(echo "$POLL" | grep -o '"task_status":"[^"]*"' | cut -d'"' -f4)
  if [ "$STATUS" = "succeed" ]; then
    VIDEO_URL=$(echo "$POLL" | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "VIDEO: $VIDEO_URL"
    break
  elif [ "$STATUS" = "failed" ]; then echo "FAILED"; break; fi
  sleep 30
done
```

## File Path Note — Bash /tmp vs Windows
- Bash /tmp = `C:\Users\sales\AppData\Local\Temp` (confirmed via `cygpath -w /tmp`)
- Windows Python can read from this path: `C:\Users\sales\AppData\Local\Temp\filename`
- Git Bash can download Drive files to /tmp but Windows Python can't write there

## GHL Social Planner — GBP + YouTube Never Expire
- GBP and YouTube do NOT use OAuth tokens — they never expire in GHL Social Planner
- Only FB, IG, LinkedIn, TikTok, Pinterest have expiry dates
- Do NOT show "EXPIRED" for GBP or YouTube in any dashboard/sheet

## WordPress Admin Credentials
- Username: `asons`
- App Password: TBD — Anthony to create in WP Admin → Users → asons → Application Passwords → add "claude"
- Do NOT attempt WP REST API uploads without a proper application password
- Bash curl works for americanservicesar.com (DNS OK in Git Bash)
