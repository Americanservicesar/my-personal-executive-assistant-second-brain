# SOP: Syncing the Second Brain

> How to keep GitHub (central brain), local .claude/, and Google Drive in sync.

---

## Architecture

| Location | Path | Role |
|----------|------|------|
| **GitHub** | `Americanservicesar/my-personal-executive-assistant-second-brain` | Central brain — source of truth |
| **Local** | `C:\Users\sales\.claude\` | Active working directory |
| **Google Drive** | OPERATIONS shared drive + Agent Reference Docs folder | Human-readable copies |

---

## How to Sync (after any session)

Run the sync script from Claude terminal:

```bash
cd C:\Users\sales\.claude\
python3 scripts/sync_to_github.py
```

This pushes all of the following to GitHub automatically:
- `claude-memory/` — all 35 memory .md files
- `references/agents/` — all 12 agent docs
- `scripts/agents/` — all Python build scripts
- `scripts/n8n-workflows/` — all workflow JSONs
- `scripts/n8n-js/` — all JS scripts
- `logs/n8n-executions/` — execution logs (learn from mistakes)
- `logs/api-calls/` — all API call history by category
- `data/seo/` — keyword master, content matrix
- `data/hcp/` — HousecallPro job data

---

## Folder Map: What Lives Where

### Always synced by script
- `claude-memory/` ← `memory/*.md` (all Claude memory files)
- `references/agents/` ← `memory/agents/*.md`
- `scripts/` ← all build scripts and workflows
- `logs/` ← all execution and API logs
- `data/` ← SEO and HCP data

### Manually maintained on GitHub
- `context/` — priorities, goals, team info
- `memory/` — business performance snapshots (clients, financials, sales-playbook)
- `decisions/log.md` — key business decisions
- `references/sops/` — standard operating procedures
- `projects/*/` — per-project notes and files

---

## When to Run Sync
- End of every Claude Code session
- After any agent is updated in n8n
- After any new memory file is created
- Before starting a new session (to confirm GitHub is current)

---

## Checking Sync Status

Compare local memory file count vs GitHub:
```bash
ls C:\Users\sales\.claude\projects\C--Users-sales--claude\memory\ | wc -l
# Then check claude-memory/ count on GitHub
```
