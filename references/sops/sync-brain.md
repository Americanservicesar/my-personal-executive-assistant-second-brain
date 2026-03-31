# SOP: Syncing the Second Brain

> How to keep the GitHub repo in sync across all Claude interfaces.

---

## After Every Meaningful Session (Desktop)

```powershell
cd C:\Users\YourUsername\Documents\my-personal-executive-assistant-second-brain
git pull
git add -A
git commit -m "session update %date%"
git push
```

Or save this as `sync-brain.bat` on your desktop and double-click it:

```batch
@echo off
cd /d C:\Users\YourUsername\Documents\my-personal-executive-assistant-second-brain
git pull
git add -A
git commit -m "session update %date% %time%"
git push
echo Brain synced!
pause
```

## Updating Claude Web Project

1. Go to claude.ai > Projects > ASAR Brain
2. Under Project Knowledge, re-upload any changed files from the repo
3. Key files to keep current:
   - CLAUDE.md
   - memory/clients.md
   - memory/sales-playbook.md
   - memory/mistakes-and-fixes.md

## Quick Reference

| Interface | How It Reads the Brain | How to Sync |
|-----------|----------------------|-------------|
| Claude Desktop | Reads directly from local clone | git pull before session, git push after |
| Claude Web | Project Knowledge uploads | Re-upload changed files periodically |
| Claude Mobile | Paste key context | Copy from CLAUDE.md as needed |
| Cowork | Reads from mounted folder | Files update live during session |
