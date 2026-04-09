const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_confirm.json';

function api(method, path, bodyFile) {
  const h = `-H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json"`;
  const d = bodyFile ? `-d @"${bodyFile}"` : '';
  return JSON.parse(execSync(`curl -s -X ${method} "${BASE}${path}" ${h} ${d}`, { maxBuffer: 10*1024*1024, timeout: 60000 }).toString());
}

console.log('Fetching Vizzy...');
const wf = api('GET', '/workflows/JAYrzGWR8A0tCBzB');
console.log('Nodes:', wf.nodes.length);

// Find the Telegram Trigger to get credential info
const tgTrigger = wf.nodes.find(n => n.name === 'Telegram Trigger');
const tgCreds = tgTrigger.credentials;
console.log('Telegram creds:', JSON.stringify(tgCreds));

// Find Send Telegram Reply to match config
const sendReply = wf.nodes.find(n => n.name === 'Send Telegram Reply');
console.log('Send Reply creds:', JSON.stringify(sendReply.credentials));

// Add a "Received" confirmation node right after Extract Telegram Input
// This sends a quick "Got it, working on it..." before processing starts
const confirmNode = {
  parameters: {
    chatId: "={{ $json.chatId }}",
    text: "\u2705 Got it! Working on your request...",
    additionalFields: { appendAttribution: false }
  },
  id: 'telegram-confirm-001',
  name: 'Confirm Received',
  type: 'n8n-nodes-base.telegram',
  typeVersion: 1.2,
  position: [
    // Position it between Extract and Is Voice — slightly offset below
    wf.nodes.find(n => n.name === 'Extract Telegram Input').position[0],
    wf.nodes.find(n => n.name === 'Extract Telegram Input').position[1] + 160
  ],
  credentials: sendReply.credentials
};
wf.nodes.push(confirmNode);

// Connect: Extract Telegram Input → Confirm Received AND Is Voice Message?
// Currently: Extract → Is Voice Message?
// New: Extract → Confirm Received (parallel, doesn't block)
//      Extract → Is Voice Message? (unchanged)

// Add Confirm Received to Extract's connections (as a second output path)
// n8n runs parallel connections, so both will fire
const extractConns = wf.connections['Extract Telegram Input'];
if (extractConns && extractConns.main && extractConns.main[0]) {
  extractConns.main[0].push({ node: 'Confirm Received', type: 'main', index: 0 });
}

console.log('Added Confirm Received node');
console.log('Extract connections:', JSON.stringify(wf.connections['Extract Telegram Input']));

// Also fix Airtable Tool credential issue — remove it from Vizzy's direct tools
// since it's causing errors and agents have their own Airtable tools
const airtableIdx = wf.nodes.findIndex(n => n.name === 'Airtable Tool');
if (airtableIdx >= 0) {
  console.log('\nAirtable Tool credentials:', JSON.stringify(wf.nodes[airtableIdx].credentials));
}

// Push
fs.writeFileSync(TMP, JSON.stringify({
  name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: { executionOrder: 'v1' }
}));
const result = api('PUT', '/workflows/JAYrzGWR8A0tCBzB', TMP);
if (result.id) {
  console.log('\nSUCCESS! Nodes:', result.nodes.length);
  const confirm = result.nodes.find(n => n.name === 'Confirm Received');
  console.log('Confirm Received:', confirm ? 'added at ' + JSON.stringify(confirm.position) : 'NOT FOUND');
} else {
  console.log('FAILED:', JSON.stringify(result).substring(0, 500));
}
try { fs.unlinkSync(TMP); } catch(e) {}
