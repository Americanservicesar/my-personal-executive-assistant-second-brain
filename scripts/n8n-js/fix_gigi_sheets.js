const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const WORKFLOW_ID = 'JAYrzGWR8A0tCBzB';
const BASE_URL = 'https://americanservicesar.app.n8n.cloud';

const GIGI_SHEET_ID = '1Ew8CQib5kEVPB9CTAgjuJpjMJtW9xtvNTF-URS2ez6c';

console.log('Fetching workflow...');
const wf = JSON.parse(execSync(`curl -s -H "X-N8N-API-KEY: ${API_KEY}" "${BASE_URL}/api/v1/workflows/${WORKFLOW_ID}"`, { maxBuffer: 50*1024*1024 }).toString());
console.log('Nodes:', wf.nodes.length);

// 1. Find and replace Google Docs - Gigi (currently httpRequestTool) with a googleSheetsTool
let oldIdx = -1;
let oldNode = null;
for (let i = 0; i < wf.nodes.length; i++) {
  if (wf.nodes[i].name === 'Google Docs - Gigi') {
    oldIdx = i;
    oldNode = wf.nodes[i];
    break;
  }
}

if (!oldNode) {
  console.log('ERROR: Google Docs - Gigi not found');
  process.exit(1);
}

// Replace with a googleSheetsTool — hardcoded to the daily brief sheet, auto mode
const newNode = {
  parameters: {
    descriptionType: "manual",
    toolDescription: "Append a new daily entry to Anthony's Daily Performance Brief spreadsheet. Use this tool every time Gigi does a daily check-in with Anthony. Columns: Date, Day, Energy (1-10), Sleep Quality (1-10), Sleep Hours, CEO Time %, Operator Time %, Top 3 Priorities, Wins, Blockers, Mood, Exercise, Meals Quality (1-10), Coaching Notes, Action Items. Always append — never overwrite existing rows.",
    documentId: {
      __rl: true,
      mode: "id",
      value: GIGI_SHEET_ID
    },
    sheetName: {
      __rl: true,
      mode: "name",
      value: "Sheet1"
    },
    options: {}
  },
  id: oldNode.id,
  name: "Daily Brief Sheet - Gigi",
  type: "n8n-nodes-base.googleSheetsTool",
  typeVersion: 4.5,
  position: oldNode.position,
  credentials: {
    googleSheetsOAuth2Api: {
      id: "Tpo5kkkuG9qiBBvf",
      name: "Google Sheets OAuth2 API"
    }
  }
};

wf.nodes[oldIdx] = newNode;
console.log('Replaced Google Docs - Gigi (httpRequestTool) -> Daily Brief Sheet - Gigi (googleSheetsTool)');

// 2. Update connections — old name was "Google Docs - Gigi", new name is "Daily Brief Sheet - Gigi"
const newConns = {};
for (const [srcName, connData] of Object.entries(wf.connections)) {
  const newSrc = (srcName === 'Google Docs - Gigi') ? 'Daily Brief Sheet - Gigi' : srcName;
  const newConnData = JSON.parse(JSON.stringify(connData));
  for (const connType of Object.keys(newConnData)) {
    for (const outputList of newConnData[connType]) {
      for (const conn of outputList) {
        if (conn.node === 'Google Docs - Gigi') {
          conn.node = 'Daily Brief Sheet - Gigi';
        }
      }
    }
  }
  newConns[newSrc] = newConnData;
}
wf.connections = newConns;
console.log('Updated all connection references');

// 3. Update Gigi's system message — replace the doc instruction with sheet instruction
for (const n of wf.nodes) {
  if (n.name === 'Gigi - Personal Growth Coach') {
    let sys = (n.parameters.options || {}).systemMessage || '';

    // Remove old doc instruction if present
    const oldBlock = sys.match(/\n## DAILY PERFORMANCE BRIEF[\s\S]*?(?=\n## |$)/);
    if (oldBlock) {
      sys = sys.replace(oldBlock[0], '');
      console.log('Removed old DAILY PERFORMANCE BRIEF section');
    }

    const sheetInstruction = `

## DAILY PERFORMANCE BRIEF
You maintain a Google Sheet for Anthony's daily performance tracking.
- Spreadsheet: "Gigi — Anthony's Daily Performance Brief"
- Spreadsheet ID: ${GIGI_SHEET_ID}
- URL: https://docs.google.com/spreadsheets/d/${GIGI_SHEET_ID}/edit
- Sheet tab: Sheet1
- Columns: Date | Day | Energy (1-10) | Sleep Quality (1-10) | Sleep Hours | CEO Time % | Operator Time % | Top 3 Priorities | Wins | Blockers | Mood | Exercise | Meals Quality (1-10) | Coaching Notes | Action Items
- ALWAYS append a new row — never overwrite existing data
- Ask Anthony for his numbers if he doesn't provide them
- If he says "check in" or "brief me", ask for: energy, sleep, priorities, wins, blockers
- Use the "Daily Brief Sheet - Gigi" tool to append the row`;

    // Insert before RULES section
    if (sys.includes('## RULES')) {
      sys = sys.replace('## RULES', sheetInstruction + '\n\n## RULES');
    } else {
      sys += sheetInstruction;
    }

    n.parameters.options.systemMessage = sys;
    console.log('Updated Gigi system message:', sys.length, 'chars');
    break;
  }
}

// 4. Re-apply credentials
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

// 5. Push
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
  for (const n of (result.nodes || [])) {
    if (n.name === 'Daily Brief Sheet - Gigi') {
      console.log('\nVerify Daily Brief Sheet - Gigi:');
      console.log('  Type:', n.type);
      console.log('  Creds:', JSON.stringify(n.credentials));
      console.log('  SheetId:', n.parameters?.documentId?.value || 'N/A');
    }
  }
} else {
  console.log('ERROR:', JSON.stringify(result).substring(0, 500));
}
