const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const WORKFLOW_ID = 'JAYrzGWR8A0tCBzB';
const BASE_URL = 'https://americanservicesar.app.n8n.cloud';

// Fetch fresh
console.log('Fetching workflow...');
const wf = JSON.parse(execSync(`curl -s -H "X-N8N-API-KEY: ${API_KEY}" "${BASE_URL}/api/v1/workflows/${WORKFLOW_ID}"`, { maxBuffer: 50*1024*1024 }).toString());
console.log('Nodes:', wf.nodes.length);

// Correct credential map — using ACTUAL credential types from n8n
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
  // FIXED: Google Docs uses the dedicated googleDocsOAuth2Api credential
  'googleDocsOAuth2Api': { id: 'Wr90fsShYFRj1K5Q', name: 'Google Docs account' },
  // The generic Google OAuth (was incorrectly assigned to Docs nodes before)
  'googleOAuth2Api': { id: 'dMFkHV4KEbioauC6', name: 'Google account' }
};

let fixed = 0;
let total = 0;
for (const n of wf.nodes) {
  if (n.credentials) {
    for (const [type, cred] of Object.entries(n.credentials)) {
      total++;
      if (credMap[type]) {
        const before = cred.id;
        n.credentials[type] = credMap[type];
        if (before !== credMap[type].id) {
          console.log('FIXED:', n.name, '|', type, '| was:', before, '-> now:', credMap[type].id);
          fixed++;
        }
      }
    }
  }
}
console.log('\nFixed', fixed, 'credentials out of', total, 'total bindings');

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
  // Verify Docs creds
  for (const n of (result.nodes || [])) {
    if (n.credentials && n.credentials.googleDocsOAuth2Api) {
      console.log('Verify:', n.name, '| cred:', n.credentials.googleDocsOAuth2Api.id);
    }
  }
} else {
  console.log('ERROR:', JSON.stringify(result).substring(0, 500));
}
