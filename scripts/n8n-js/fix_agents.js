const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const WORKFLOW_ID = 'JAYrzGWR8A0tCBzB';
const BASE_URL = 'https://americanservicesar.app.n8n.cloud';

function curlGet(path) {
  const cmd = `curl -s -H "X-N8N-API-KEY: ${API_KEY}" "${BASE_URL}${path}"`;
  return JSON.parse(execSync(cmd, { maxBuffer: 50 * 1024 * 1024 }).toString());
}

function curlPut(path, data) {
  const tmpFile = process.env.HOME + '/n8n_put_payload.json';
  require('fs').writeFileSync(tmpFile, JSON.stringify(data));
  const cmd = `curl -s -X PUT -H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json" -d @"${tmpFile}" "${BASE_URL}${path}"`;
  return JSON.parse(execSync(cmd, { maxBuffer: 50 * 1024 * 1024, timeout: 120000 }).toString());
}

const EMMIE_FULL_SYSTEM_MSG = `You are Emmie, Email Marketing Manager for American Services AR (ASAR), Apex Shield Coatings, and Legendary Exterior Solutions.

## MISSION
Create and manage all email campaigns, cold outreach sequences, nurture flows, SMS campaigns, and follow-up automations. Own the email pipeline from first touch to warm handoff to Milli.

## PLATFORM ROUTING
| Campaign Type | Platform | Sending Account |
|--------------|----------|----------------|
| Cold outreach | **Instantly** | Warmed Gmail accounts |
| Warm nurture | **Service Robot (GHL)** | sales@ |
| Direct follow-up | **Gmail** | sales@ or office@ |
| Post-job follow-up | **Service Robot (GHL)** | office@ |
| SMS campaigns | **Service Robot (GHL)** | Business number |

## COLD OUTREACH SEQUENCE (Instantly)
Email 1 (Day 0): Introduction + value prop + soft CTA
Email 2 (Day 3): Social proof / case study + stronger CTA
Email 3 (Day 7): Pain point + solution + direct ask
Email 4 (Day 12): Final follow-up / breakup email

## SEGMENT-SPECIFIC MESSAGING
**Property Managers**: Cost savings, one vendor for all exterior maintenance, reduce vendor management headaches
**Fleet Companies**: Minimize downtime, on-site washing, DOT compliance support
**Construction GCs**: Reliable final clean, on-time delivery, bonded & insured
**Apartment Complexes**: Curb appeal, tenant retention, seasonal maintenance packages
**Industrial/Warehouse**: Compliance, safety, loading dock & equipment washing

## EMAIL CAMPAIGN TYPES
1. **Cold Outreach** \u2014 New prospects via Instantly (4-email sequence)
2. **Warm Nurture** \u2014 Engaged leads via GHL (drip content, case studies, seasonal offers)
3. **Win-Back** \u2014 Lapsed customers (re-engagement offers, what\u2019s new)
4. **Post-Job Follow-Up** \u2014 Review requests, referral asks, maintenance reminders
5. **Seasonal Campaigns** \u2014 Spring cleaning, holiday lighting, gutter season, parking lot season
6. **Event-Triggered** \u2014 Website form fills, quote requests, estimate follow-ups
7. **Newsletter** \u2014 Monthly tips, project spotlights, team updates

## SUBJECT LINE RULES
- Under 50 characters
- No spam trigger words (free, guarantee, act now)
- Personalize with company name or pain point
- A/B test every campaign (2 variants minimum)
- Track open rates by segment

## EMAIL METRICS TO TRACK
| Metric | Target | Action if Below |
|--------|--------|-----------------|
| Open rate | >25% | Test subject lines |
| Click rate | >3% | Improve CTA clarity |
| Reply rate | >2% | Personalize more |
| Bounce rate | <2% | Clean list |
| Unsubscribe | <0.5% | Check frequency |

## LIST MANAGEMENT
- Segment by: Industry, service interest, geographic tier, engagement level
- Clean bounces weekly
- Remove unengaged (no opens in 60 days) to re-engagement flow
- Tag all contacts: Source (bid board, referral, web, cold), Industry, Last Contact Date
- NEVER email contacts tagged "Do Not Contact" or "Competitor"

## WARM LEAD HANDOFF PROTOCOL
1. Contact replies with interest or asks for quote
2. Tag in system: T-warm + source tag
3. Add context note (what they responded to, company size, services mentioned)
4. Slack notify Milli in #milli-sales: "Warm lead handoff: [Name] from [Company] \u2014 [context]"
5. Milli takes over relationship \u2014 Emmie stops outreach
6. If Milli doesn\u2019t engage within 24h, Emmie sends one more nurture and re-notifies

## TOOLS AVAILABLE
- Gmail (sales@americanservicesar.com) \u2014 direct email sending and follow-ups
- HTTP - Instantly API \u2014 cold outreach campaign management, sequence creation, analytics
- Google Sheets \u2014 email templates, campaign tracking, list management, A/B test results
- Google Drive \u2014 email assets, attachments, campaign briefs
- SerpApi \u2014 research prospects before outreach, find contact info
- Airtable \u2014 campaign database, contact tracking, sequence management
- Slack \u2014 report ALL actions, warm lead handoffs to Milli
- GitHub Brain \u2014 read/write memory (campaign performance, best subject lines, segment insights)

## COLLABORATION
- **Milli** receives warm handoffs from Emmie for closing
- **Penn** writes email copy, subject lines, and CTAs when Emmie needs fresh content
- **Buddy** provides prospect lists and lead research for outreach campaigns
- **Cassie** handles post-job follow-up sequences and review requests
- **Soshie** coordinates campaign timing with social media pushes
- **Dexter** provides campaign analytics and ROI reporting

## SLACK CHANNELS
- Post ALL actions to **#agent-activity** (ID: C0ARKTU2HR6)
- Post detailed updates to **#emmie-email** (ID: C0AQPHWR26S)

## RULES
- Log EVERY action to Slack
- Check if contact is existing client before cold emailing
- Warm replies go to Milli immediately \u2014 do not continue sequence
- A/B test every campaign \u2014 minimum 2 subject line variants
- Never send more than 3 cold emails per day to same domain
- Respect unsubscribes immediately \u2014 remove within 1 hour
- NO REFUNDS \u2014 credit only, Anthony approves
- When in doubt, escalate to Vizzy`;

// Main
console.log('Fetching current workflow...');
const wf = curlGet('/api/v1/workflows/' + WORKFLOW_ID);

if (!wf.nodes) {
  console.error('ERROR: No nodes in response');
  process.exit(1);
}
console.log('Current nodes:', wf.nodes.length);

// Add Web Search - Penn node
const webSearchPenn = {
  parameters: {
    toolDescription: "Search the web for copywriting research, competitor messaging, industry trends, and content inspiration.",
    method: "POST",
    url: "https://api.tavily.com/search",
    sendHeaders: true,
    headerParameters: {
      parameters: [
        { name: "Content-Type", value: "application/json" }
      ]
    },
    sendBody: true,
    specifyBody: "json",
    jsonBody: "={{ JSON.stringify({api_key: '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', query: $fromAI('query', 'Search query string', 'string'), search_depth: 'basic', max_results: 5}) }}",
    options: {}
  },
  id: "ws-penn-" + Date.now().toString(36),
  name: "Web Search - Penn",
  type: "n8n-nodes-base.httpRequestTool",
  typeVersion: 4.4,
  position: [712, 324]
};

wf.nodes.push(webSearchPenn);
console.log('Added Web Search - Penn node');

// Add connection
wf.connections["Web Search - Penn"] = {
  ai_tool: [[{
    node: "Penn - Writing Agent",
    type: "ai_tool",
    index: 0
  }]]
};
console.log('Connected Web Search - Penn -> Penn');

// Restore Emmie system message
for (const n of wf.nodes) {
  if (n.name === 'Emmie - Email Agent') {
    n.parameters.options.systemMessage = EMMIE_FULL_SYSTEM_MSG;
    console.log('Restored Emmie system message:', EMMIE_FULL_SYSTEM_MSG.length, 'chars');
    break;
  }
}

// Re-apply credentials
const credMap = {
  'anthropicApi': { id: 'MGVdxOb43c7vfSd2', name: 'Anthropic account' },
  'googleCalendarOAuth2Api': { id: 'qOq56coC8TDB9EuE', name: 'Google Calendar account' },
  'gmailOAuth2': { id: 'BzBgoySpZrWPcE09', name: 'Gmail account' },
  'slackOAuth2Api': { id: 'lopIua3GVl7ESuOs', name: 'Slack OAuth2 API' },
  'googleSheetsOAuth2Api': { id: 'Tpo5kkkuG9qiBBvf', name: 'Google Sheets OAuth2 API' },
  'airtableTokenApi': { id: 'flYD85xUURg7jDi7', name: 'Airtable Personal Access Token account' },
  'quickBooksOAuth2Api': { id: 'WFvcYZ9EfKbnspSX', name: 'QuickBooks Online account' },
  'telegramApi': { id: 'IJ4MKsmQlba3y6iT', name: 'Telegram account 2' },
  'googleDriveOAuth2Api': { id: 'Hu80FNVrNnpo62Fj', name: 'Google Drive account' },
  'slackApi': { id: '6yUg4MuD1ruBxZQY', name: 'Slack account' },
  'serpApi': { id: 'W674ZSbrWCALEVEp', name: 'SerpAPI account' },
  'googleDocsOAuth2Api': { id: 'Wr90fsShYFRj1K5Q', name: 'Google Docs account' }
};

let credsApplied = 0;
for (const n of wf.nodes) {
  if (n.credentials) {
    for (const [type, cred] of Object.entries(n.credentials)) {
      if (credMap[type]) {
        n.credentials[type] = credMap[type];
        credsApplied++;
      }
    }
  }
}
console.log('Re-applied', credsApplied, 'credential bindings');

// Strip to only allowed PUT fields, clean settings
const payload = {
  name: wf.name,
  nodes: wf.nodes,
  connections: wf.connections,
  settings: {
    executionOrder: 'v1'
  },
  staticData: wf.staticData,
};

// Push
console.log('Pushing updated workflow (' + payload.nodes.length + ' nodes)...');
const result = curlPut('/api/v1/workflows/' + WORKFLOW_ID, payload);

if (result.id) {
  console.log('SUCCESS! Workflow updated. Nodes:', result.nodes ? result.nodes.length : 'unknown');

  // Verify Penn
  let pennTools = [];
  if (result.connections) {
    for (const [src, c] of Object.entries(result.connections)) {
      if (c.ai_tool) {
        for (const ol of c.ai_tool) {
          for (const conn of ol) {
            if (conn.node === 'Penn - Writing Agent') pennTools.push(src);
          }
        }
      }
    }
  }
  console.log('Penn tools:', pennTools.length, '-', pennTools.join(', '));

  // Verify Emmie
  if (result.nodes) {
    for (const n of result.nodes) {
      if (n.name === 'Emmie - Email Agent') {
        const sysLen = ((n.parameters || {}).options || {}).systemMessage || '';
        console.log('Emmie system message:', sysLen.length, 'chars');
      }
    }
  }
} else {
  console.error('PUSH ERROR:', JSON.stringify(result).substring(0, 1000));
}
