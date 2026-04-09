const fs = require('fs');
const { execSync } = require('child_process');
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const WF_ID = 'Q17xBd9qC1w4l1zV';
const BASE = 'https://americanservicesar.app.n8n.cloud';

const wf = JSON.parse(execSync(`curl -s -H "X-N8N-API-KEY: ${API_KEY}" "${BASE}/api/v1/workflows/${WF_ID}"`, { maxBuffer: 50*1024*1024 }).toString());

// Fix the Move node — $json.fileId expression
for (const n of wf.nodes) {
  if (n.name === 'Move to OFFICE Drive') {
    n.parameters.fileId = {
      __rl: true,
      mode: "id",
      value: "={{ $json.fileId }}"
    };
    console.log('Fixed fileId expression');
    console.log('Value is now:', JSON.stringify(n.parameters.fileId.value));
    // Verify the $ is present
    if (n.parameters.fileId.value.includes('$json')) {
      console.log('OK: $json is present');
    } else {
      console.log('PROBLEM: $json missing!');
    }
  }
}

// Re-apply creds
for (const n of wf.nodes) {
  if (n.credentials && n.credentials.googleDriveOAuth2Api) {
    n.credentials.googleDriveOAuth2Api = { id: 'Hu80FNVrNnpo62Fj', name: 'Google Drive account' };
  }
}

const payload = {
  name: wf.name,
  nodes: wf.nodes,
  connections: wf.connections,
  settings: { executionOrder: 'v1' }
};

// Write and verify the JSON before pushing
const payloadStr = JSON.stringify(payload);
// Check that $json.fileId is in the output
if (payloadStr.includes('$json.fileId')) {
  console.log('Payload contains $json.fileId — good');
} else {
  console.log('WARNING: $json.fileId not found in payload!');
  // Find what's there instead
  const match = payloadStr.match(/fileId.*?value.*?"/);
  console.log('Found:', match ? match[0] : 'nothing');
}

fs.writeFileSync(process.env.HOME + '/mover_fix.json', payloadStr);
const result = JSON.parse(execSync(`curl -s -X PUT -H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json" -d @"${process.env.HOME}/mover_fix.json" "${BASE}/api/v1/workflows/${WF_ID}"`, { maxBuffer: 50*1024*1024, timeout: 30000 }).toString());

if (result.id) {
  console.log('SUCCESS!');
  // Verify the expression in the response
  for (const n of (result.nodes || [])) {
    if (n.name === 'Move to OFFICE Drive') {
      console.log('Response fileId value:', n.parameters?.fileId?.value);
    }
  }
} else {
  console.log('ERROR:', JSON.stringify(result).substring(0, 500));
}
