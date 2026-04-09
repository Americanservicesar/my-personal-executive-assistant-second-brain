const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_merge.json';

function api(method, path, bodyFile) {
  const h = `-H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json"`;
  const d = bodyFile ? `-d @"${bodyFile}"` : '';
  return JSON.parse(execSync(`curl -s -X ${method} "${BASE}${path}" ${h} ${d}`, { maxBuffer: 10*1024*1024, timeout: 60000 }).toString());
}

console.log('Fetching Vizzy...');
const wf = api('GET', '/workflows/JAYrzGWR8A0tCBzB');
console.log('Nodes:', wf.nodes.length);

// Remove the Merge node
const mergeIdx = wf.nodes.findIndex(n => n.name === 'Merge Telegram Input');
if (mergeIdx >= 0) {
  wf.nodes.splice(mergeIdx, 1);
  console.log('Removed Merge Telegram Input node');
}

// Remove old connections FROM and TO Merge
delete wf.connections['Merge Telegram Input'];

// Fix "Is Voice Message?" connections:
// Output 0 (true/voice) → Get Voice File (keep)
// Output 1 (false/text) → was going to Merge, now goes to Format for Vizzy
wf.connections['Is Voice Message?'] = {
  main: [
    [{ node: 'Get Voice File', type: 'main', index: 0 }],
    [{ node: 'Format for Vizzy', type: 'main', index: 0 }]
  ]
};

// Fix "Set Transcribed Text" → was going to Merge index 0, now goes to Format for Vizzy
wf.connections['Set Transcribed Text'] = {
  main: [[{ node: 'Format for Vizzy', type: 'main', index: 0 }]]
};

// Verify the full chain
console.log('\n=== NEW CONNECTION CHAIN ===');
console.log('Extract Telegram Input --> Is Voice Message?');
console.log('Is Voice Message? (voice) --> Get Voice File --> Transcribe Voice --> Set Transcribed Text --> Format for Vizzy');
console.log('Is Voice Message? (text) --> Format for Vizzy');
console.log('Format for Vizzy --> Vizzy Supervisor --> Send Telegram Reply + Slack');

// Push
fs.writeFileSync(TMP, JSON.stringify({
  name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: { executionOrder: 'v1' }
}));
const result = api('PUT', '/workflows/JAYrzGWR8A0tCBzB', TMP);
if (result.id) {
  console.log('\nSUCCESS! Nodes:', result.nodes.length);
  // Verify Merge is gone
  const mergeNode = result.nodes.find(n => n.name === 'Merge Telegram Input');
  console.log('Merge node exists:', !!mergeNode);
  // Verify connections
  const isVoiceConns = result.connections || wf.connections;
  console.log('Is Voice? connections:', JSON.stringify(isVoiceConns['Is Voice Message?']));
  console.log('Set Transcribed connections:', JSON.stringify(isVoiceConns['Set Transcribed Text']));
} else {
  console.log('FAILED:', JSON.stringify(result).substring(0, 500));
}
try { fs.unlinkSync(TMP); } catch(e) {}
