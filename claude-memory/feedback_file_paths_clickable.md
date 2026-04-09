---
name: File Paths Must Be Clickable Links
description: Always format local file paths as clickable file:/// links so user can navigate directly to the folder
type: feedback
---

When showing any local file path, always format it as a clickable markdown link using the file:/// URL scheme.

**Why:** User wants to click the path and have Windows open the folder directly — saves time hunting for files.

**How to apply:**
- Files: `[filename.ext](file:///C:/Users/sales/path/to/filename.ext)`
- Folders: `[folder name](file:///C:/Users/sales/path/to/folder/)`
- Always use forward slashes in the URL (not backslashes)
- Apply to every file or folder path mentioned in any response
