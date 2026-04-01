# Mistakes & Fixes Log

> Every time Claude gets something wrong or finds a better way, it logs it here.
> This is how Claude "learns" across sessions — by never making the same mistake twice.

---

## Format

- **Date:** When it happened
- **Agent:** Which agent made the mistake (Vizzy, Milli, Penn, Emmie, Soshie, Buddy, Cassie, Seomi, Scouty, Gigi, Commet, Dexter, or Claude/general)
- **What went wrong:** Description of the mistake
- **Root cause:** Why it happened
- **Fix applied:** What was changed
- **Prevention rule:** How to avoid it next time

---

## Log

### 2026-03-31 — Gave instructions instead of executing
- **Agent:** Claude/general
- **What went wrong:** Anthony asked to fix Claude Desktop. Claude gave him a list of PowerShell commands instead of executing them directly.
- **Root cause:** Defaulted to advisory mode instead of action mode.
- **Fix applied:** None — Claude Cowork can't access the Windows file system directly.
- **Prevention rule:** Always check if Claude can execute directly before giving manual instructions. If execution isn't possible, explain WHY and offer the closest alternative. Anthony wants action, not homework.

### 2026-03-31 — Created duplicate files instead of reading existing repo first
- **Agent:** Claude/general
- **What went wrong:** Built a full new repo structure (CLAUDE.md, memory files, etc.) without first checking that Anthony already had a well-structured second-brain repo on GitHub.
- **Root cause:** Didn't ask or check for existing infrastructure before building.
- **Fix applied:** Read the existing repo via Chrome, analyzed the structure, and built complementary files that slot into the existing layout.
- **Prevention rule:** ALWAYS check what already exists before creating anything new. Search GitHub, Google Drive, and connected platforms first. Build on what's there — don't duplicate.

---

<!-- New entries go above this line, newest first -->
