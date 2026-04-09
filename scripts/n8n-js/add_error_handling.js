const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_errors.json';

function api(method, path, bodyFile) {
  const h = `-H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json"`;
  const d = bodyFile ? `-d @"${bodyFile}"` : '';
  return JSON.parse(execSync(`curl -s -X ${method} "${BASE}${path}" ${h} ${d}`, { maxBuffer: 10*1024*1024, timeout: 60000 }).toString());
}

console.log('Fetching Vizzy...');
const wf = JSON.parse(fs.readFileSync(HOME + '/n8n_vizzy_agents.json', 'utf8'));
console.log('Nodes:', wf.nodes.length);

// 1. Add onError: "continueErrorOutput" to all 12 agent nodes
let count = 0;
wf.nodes.forEach(n => {
  if (n.type === '@n8n/n8n-nodes-langchain.agentTool' || n.type === '@n8n/n8n-nodes-langchain.agent') {
    n.onError = 'continueErrorOutput';
    count++;
    console.log('  Set onError on: ' + n.name);
  }
});
console.log('Updated ' + count + ' agent nodes');

// 2. Add an "Error Reply" Telegram node for when Vizzy Supervisor errors
// Get Telegram credentials from Send Telegram Reply
const sendReply = wf.nodes.find(n => n.name === 'Send Telegram Reply');
const vizzyNode = wf.nodes.find(n => n.name === 'Vizzy - Supervisor Agent');

const errorReplyNode = {
  parameters: {
    chatId: "={{ $('Format for Vizzy').item.json.chatId }}",
    text: "=\u26A0\uFE0F *Vizzy Error*\n\nSomething went wrong while processing your request.\n\n*Error:* {{ $json.error?.message || $json.error || 'Unknown error' }}\n\nI'll try again or escalate to Anthony.",
    additionalFields: {
      appendAttribution: false,
      parse_mode: "Markdown"
    }
  },
  id: 'vizzy-error-reply',
  name: 'Error Reply',
  type: 'n8n-nodes-base.telegram',
  typeVersion: 1.2,
  position: [vizzyNode.position[0] + 280, vizzyNode.position[1] + 160],
  credentials: sendReply.credentials
};
wf.nodes.push(errorReplyNode);

// 3. Add a "Slack Error Log" node to post errors to Slack
const slackLog = wf.nodes.find(n => n.name === 'Slack Agent Activity');
const slackErrorNode = {
  parameters: {
    channel: { __rl: true, value: 'C0ARKTU2HR6', mode: 'id' },
    text: "=\u26A0\uFE0F *Vizzy Error Report*\n\n*Error:* {{ $json.error?.message || $json.error || 'Unknown error' }}\n*User Request:* {{ $('Format for Vizzy').item.json.chatInput || 'N/A' }}\n*Timestamp:* {{ $now.toISO() }}",
    otherOptions: {}
  },
  id: 'vizzy-error-slack',
  name: 'Slack Error Log',
  type: 'n8n-nodes-base.slack',
  typeVersion: 2.4,
  position: [vizzyNode.position[0] + 280, vizzyNode.position[1] + 320],
  credentials: slackLog.credentials
};
wf.nodes.push(slackErrorNode);

// 4. Wire Vizzy Supervisor error output (output index 1) to Error Reply and Slack Error Log
// Current Vizzy connections have output 0 (success) going to Send Reply + Slack logs
// Need to add output 1 (error) going to Error Reply + Slack Error Log
const vizzyConns = wf.connections['Vizzy - Supervisor Agent'];
if (vizzyConns && vizzyConns.main) {
  // Output 0 already exists (success path)
  // Add output 1 (error path)
  vizzyConns.main[1] = [
    { node: 'Error Reply', type: 'main', index: 0 },
    { node: 'Slack Error Log', type: 'main', index: 0 }
  ];
  console.log('\nVizzy connections:');
  console.log('  Output 0 (success):', JSON.stringify(vizzyConns.main[0]));
  console.log('  Output 1 (error):', JSON.stringify(vizzyConns.main[1]));
}

// Push
console.log('\nTotal nodes:', wf.nodes.length);
fs.writeFileSync(TMP, JSON.stringify({
  name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: { executionOrder: 'v1' }
}));
const result = api('PUT', '/workflows/JAYrzGWR8A0tCBzB', TMP);
if (result.id) {
  console.log('SUCCESS! Nodes:', result.nodes.length);

  // Verify all agents have onError
  const agents = result.nodes.filter(n =>
    n.type === '@n8n/n8n-nodes-langchain.agentTool' ||
    n.type === '@n8n/n8n-nodes-langchain.agent'
  );
  const allSet = agents.every(a => a.onError === 'continueErrorOutput');
  console.log('All agents have onError:', allSet);

  // Verify error nodes exist
  const errReply = result.nodes.find(n => n.name === 'Error Reply');
  const errSlack = result.nodes.find(n => n.name === 'Slack Error Log');
  console.log('Error Reply node:', errReply ? 'YES' : 'NO');
  console.log('Slack Error Log node:', errSlack ? 'YES' : 'NO');
} else {
  console.log('FAILED:', JSON.stringify(result).substring(0, 500));
}
try { fs.unlinkSync(TMP); } catch(e) {}
