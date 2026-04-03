# n8n Automation Pipelines

**Description:** Building automation workflows in n8n to eliminate manual tasks across lead gen, CRM, and reporting.

**Status:** Active

## Pipelines to Build
- Lead scraping → CRM entry
- Bid board monitoring → alert notification
- Construction permit detection → opportunity flag
- SEO rank tracking → weekly report
- Task assignment automation
- Email outreach sequencing

## Built Workflows

### Vizzy Command Bot - Telegram Interface
- **File:** `vizzy-command-bot-telegram.json` (importable n8n workflow)
- **Purpose:** Routes Telegram messages from @Vizzycommandbot through the Vizzy autonomous agent
- **Flow:** Telegram Trigger → Extract Message → POST to Vizzy Agent webhook → Send reply back via Telegram
- **Credential needed:** "Vizzy Telegram Bot" (Telegram Bot API)
- **Status:** Ready to import and activate

## Integration
americanservicesar.app.n8n.cloud → GoHighLevel, Google Sheets, Gmail, Housecall Pro, Telegram
