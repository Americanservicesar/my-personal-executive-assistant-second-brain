const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const WORKFLOW_ID = 'JAYrzGWR8A0tCBzB';
const BASE_URL = 'https://americanservicesar.app.n8n.cloud';

// The permanent doc for Gigi's daily briefs
const GIGI_DOC_ID = '1vylAehFJJXj1IPtdpxh_alMPTPi-DkcsmU4tp3oWodE';

console.log('Fetching workflow...');
const wf = JSON.parse(execSync(`curl -s -H "X-N8N-API-KEY: ${API_KEY}" "${BASE_URL}/api/v1/workflows/${WORKFLOW_ID}"`, { maxBuffer: 50*1024*1024 }).toString());
console.log('Nodes:', wf.nodes.length);

// Find and replace Google Docs - Gigi node
let oldNodeIndex = -1;
let oldNode = null;
for (let i = 0; i < wf.nodes.length; i++) {
  if (wf.nodes[i].name === 'Google Docs - Gigi') {
    oldNodeIndex = i;
    oldNode = wf.nodes[i];
    break;
  }
}

if (!oldNode) {
  console.log('ERROR: Google Docs - Gigi node not found');
  process.exit(1);
}

console.log('Found Google Docs - Gigi at index', oldNodeIndex, 'id:', oldNode.id);

// Replace with an HTTP Request Tool that appends to the existing doc
// Uses Google Docs API batchUpdate to insert text at end of document
const newNode = {
  parameters: {
    toolDescription: "Append a new daily entry to Anthony's Performance Brief Google Doc. Use this to log daily check-ins, energy levels, habits, goals progress, and coaching notes. Each entry is prepended with the date. The document is a running log — never create a new doc, always append here.",
    method: "POST",
    url: "https://docs.googleapis.com/v1/documents/" + GIGI_DOC_ID + ":batchUpdate",
    authentication: "predefinedCredentialType",
    nodeCredentialType: "googleDocsOAuth2Api",
    sendBody: true,
    specifyBody: "json",
    jsonBody: "={{ JSON.stringify({ requests: [{ insertText: { location: { index: 1 }, text: '\\n\\n---\\n## ' + new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) + '\\n\\n' + $fromAI('content', 'The full daily brief content including energy level, habits, goals, coaching notes, and action items', 'string') + '\\n' } }] }) }}",
    options: {}
  },
  id: oldNode.id,
  name: "Google Docs - Gigi",
  type: "n8n-nodes-base.httpRequestTool",
  typeVersion: 4.4,
  position: oldNode.position,
  credentials: {
    googleDocsOAuth2Api: {
      id: "Wr90fsShYFRj1K5Q",
      name: "Google Docs account"
    }
  }
};

wf.nodes[oldNodeIndex] = newNode;
console.log('Replaced Google Docs - Gigi: googleDocsTool -> httpRequestTool (append mode)');

// Update Gigi's system message to reference the permanent doc
for (const n of wf.nodes) {
  if (n.name === 'Gigi - Personal Growth Coach') {
    let sys = (n.parameters.options || {}).systemMessage || '';

    // Add the doc reference to the system message
    const docInstruction = `

## DAILY PERFORMANCE BRIEF
You maintain a SINGLE running Google Doc for Anthony's daily performance briefs.
- Document: "Anthony's Daily Performance Brief" (ID: ${GIGI_DOC_ID})
- URL: https://docs.google.com/document/d/${GIGI_DOC_ID}/edit
- NEVER create new documents — always append to this one using the Google Docs tool
- Each entry should include: date, energy level (1-10), sleep quality, top 3 priorities, CEO vs Operator time, wins, blockers, coaching note
- Prepend new entries at the top so the most recent is always first`;

    // Check if instruction already exists
    if (!sys.includes('DAILY PERFORMANCE BRIEF')) {
      // Insert before the RULES section if it exists, otherwise append
      if (sys.includes('## RULES')) {
        sys = sys.replace('## RULES', docInstruction + '\n\n## RULES');
      } else {
        sys += docInstruction;
      }
      n.parameters.options.systemMessage = sys;
      console.log('Updated Gigi system message:', sys.length, 'chars (added daily brief instructions)');
    } else {
      console.log('Gigi system message already has daily brief instructions');
    }
    break;
  }
}

// Re-apply all credentials
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
  'googleDocsOAuth2Api': { id: 'Wr90fsShYFRj1K5Q', name: 'Google Docs account' },
  'googleOAuth2Api': { id: 'dMFkHV4KEbioauC6', name: 'Google account' }
};

let credsApplied = 0;
for (const n of wf.nodes) {
  if (n.credentials) {
    for (const [type] of Object.entries(n.credentials)) {
      if (credMap[type]) {
        n.credentials[type] = credMap[type];
        credsApplied++;
      }
    }
  }
}
console.log('Re-applied', credsApplied, 'credentials');

// Push
const payload = {
  name: wf.name,
  nodes: wf.nodes,
  connections: wf.connections,
  settings: { executionOrder: 'v1' },
  staticData: wf.staticData
};

const tmpFile = process.env.HOME + '/n8n_put_payload.json';
fs.writeFileSync(tmpFile, JSON.stringify(payload));
console.log('\nPushing...');
const result = JSON.parse(execSync(`curl -s -X PUT -H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json" -d @"${tmpFile}" "${BASE_URL}/api/v1/workflows/${WORKFLOW_ID}"`, { maxBuffer: 50*1024*1024, timeout: 120000 }).toString());

if (result.id) {
  console.log('SUCCESS! Nodes:', result.nodes ? result.nodes.length : '?');
  // Verify the node
  for (const n of (result.nodes || [])) {
    if (n.name === 'Google Docs - Gigi') {
      console.log('\nVerify Google Docs - Gigi:');
      console.log('  Type:', n.type);
      console.log('  Creds:', JSON.stringify(n.credentials));
      console.log('  URL:', (n.parameters || {}).url || 'N/A');
    }
  }
} else {
  console.log('ERROR:', JSON.stringify(result).substring(0, 500));
}
