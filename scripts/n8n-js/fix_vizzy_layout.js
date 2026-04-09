const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_layout.json';

function api(method, path, bodyFile) {
  const h = `-H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json"`;
  const d = bodyFile ? `-d @"${bodyFile}"` : '';
  return JSON.parse(execSync(`curl -s -X ${method} "${BASE}${path}" ${h} ${d}`, { maxBuffer: 10*1024*1024, timeout: 60000 }).toString());
}

console.log('Fetching Vizzy workflow...');
const wf = api('GET', '/workflows/JAYrzGWR8A0tCBzB');
console.log('Nodes:', wf.nodes.length);

// Remove ALL existing sticky notes (rebuild from scratch)
wf.nodes = wf.nodes.filter(n => n.type !== 'n8n-nodes-base.stickyNote');
console.log('After removing stickies:', wf.nodes.length);

// List current nodes for debugging
wf.nodes.forEach(n => console.log('  ' + n.name + ' | ' + n.type.split('.').pop() + ' | ' + JSON.stringify(n.position)));

// === AGENT DEFINITIONS ===
const agents = [
  { toolName: 'Milli - Sales Manager', color: 4, label: 'Milli\nSales Manager', model: 'GPT 4.1 Mini' },
  { toolName: 'Penn - Copywriter', color: 5, label: 'Penn\nCopywriter', model: 'Claude Sonnet 4.6' },
  { toolName: 'Emmie - Email Marketing', color: 6, label: 'Emmie\nEmail Marketing', model: 'GPT 4.1 Mini' },
  { toolName: 'Soshie - Social Media', color: 1, label: 'Soshie\nSocial Media', model: 'GPT 4.1 Mini' },
  { toolName: 'Buddy - Business Development', color: 2, label: 'Buddy\nBusiness Dev', model: 'Claude Sonnet 4.6' },
  { toolName: 'Cassie - Customer Support', color: 3, label: 'Cassie\nCustomer Support', model: 'GPT 4.1 Mini' },
  { toolName: 'Seomi - SEO Specialist', color: 4, label: 'Seomi\nSEO Specialist', model: 'Claude Sonnet 4.6' },
  { toolName: 'Scouty - Competitive Analysis', color: 5, label: 'Scouty\nCompetitive Analysis', model: 'GPT 4.1 Mini' },
  { toolName: 'Gigi - Google Workspace', color: 6, label: 'Gigi\nGoogle Workspace', model: 'GPT 4.1 Mini' },
  { toolName: 'Commet - Data Analysis', color: 1, label: 'Commet\nData Analysis', model: 'Claude Sonnet 4.6' },
  { toolName: 'Dexter - Technical', color: 7, label: 'Dexter\nTechnical', model: 'Claude Sonnet 4.6' }
];

// === LAYOUT ===
// Vizzy Direct Tools row
const VIZ_Y = -660;
const vizzyToolNames = [
  'Gmail - Vizzy (sales@)', 'Gmail - Vizzy (office@)',
  'Gmail - Vizzy (asons@)', 'Gmail - Vizzy (sonsfamily@)',
  'Google Sheets - Vizzy', 'Google Drive - Vizzy',
  'Slack Tool - Vizzy', 'SerpApi - Vizzy', 'Google Docs - Vizzy'
];

// Brain/Tools
const brainNames = ['Vizzy Claude Model', 'Team Conversation Memory', 'Google Calendar Tool'];

// Parent Agent area
const PARENT_Y = -200;
const AGENT_ROW_Y = 200;

// Agent boxes
const BOX_W = 300;
const BOX_H = 240;
const BOX_GAP = 20;
const BOX_STEP = BOX_W + BOX_GAP;
const FIRST_BOX_X = 200;
const BOX_Y = 440;

// Telegram flow
const TG_Y = BOX_Y + BOX_H + 140;

// Position helper
function pos(name, x, y) {
  const n = wf.nodes.find(nd => nd.name === name);
  if (n) { n.position = [x, y]; return true; }
  console.log('  WARN: ' + name + ' not found');
  return false;
}

// === 1. BRAIN / TOOLS ===
pos('Vizzy Claude Model', 40, 100);
pos('Team Conversation Memory', 240, 100);
pos('Google Calendar Tool', 40, 260);

// === 2. VIZZY DIRECT TOOLS ===
const VDX = 800;
vizzyToolNames.forEach((name, i) => {
  const row = i < 5 ? 0 : 1;
  const col = i < 5 ? i : i - 5;
  pos(name, VDX + col * 240, VIZ_Y + row * 160);
});

// === 3. PARENT AGENT ===
pos('Chat Interface', 200, PARENT_Y);
pos('Vizzy - Supervisor Agent', 600, PARENT_Y);

// Extra tools in parent area
pos('Airtable Tool', 1000, PARENT_Y);
pos('HTTP Request Tool', 1200, PARENT_Y);
pos('Workflow Tool', 1400, PARENT_Y);

// === 4. AGENT toolWorkflow NODES — inside their boxes ===
agents.forEach((agent, i) => {
  const boxX = FIRST_BOX_X + i * BOX_STEP;
  const n = wf.nodes.find(nd => nd.name === agent.toolName);
  if (n) {
    n.position = [boxX + 50, BOX_Y + 60];
  } else {
    console.log('  WARN: toolWorkflow not found: ' + agent.toolName);
  }
});

// === 5. TELEGRAM FLOW ===
const telegramNodes = [
  ['Telegram Trigger', 0, 0],
  ['Extract Telegram Input', 280, 0],
  ['Is Voice Message?', 560, 0],
  ['Get Voice File', 840, -120],
  ['Transcribe Voice', 1120, -120],
  ['Set Transcribed Text', 1400, -120],
  ['Merge Telegram Input', 1680, 0],
  ['Format for Vizzy', 1960, 0],
  ['Send Telegram Reply', 2240, 0],
  ['Slack Agent Activity', 2520, 0]
];
telegramNodes.forEach(([name, dx, dy]) => pos(name, FIRST_BOX_X + dx, TG_Y + dy));
pos('Slack Telegram Log', FIRST_BOX_X + 2240, TG_Y + 200);

// === 6. STICKY NOTES ===
let sid = 0;
function sticky(content, x, y, w, h, color) {
  sid++;
  wf.nodes.push({
    parameters: { content, height: h, width: w, color },
    type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
    position: [x, y], id: 'sticky-' + sid, name: 'Sticky Note ' + sid
  });
}

// Brain/Tools box
sticky('## Brain / Tools\nClaude Model + Memory + Calendar', 0, 40, 460, 300, 7);

// Vizzy Direct Tools box
sticky('## Vizzy Direct Tools\nGmail (4) + Sheets + Drive + Docs + Slack + SerpApi',
  VDX - 60, VIZ_Y - 60, 5 * 240 + 100, 380, 3);

// Parent Agent box
sticky('# Parent Agent \u2014 Vizzy Supervisor\nRoutes to 11 agent workflows + direct tools',
  140, PARENT_Y - 80, 1500, 280, 2);

// Individual agent boxes with toolWorkflow inside
agents.forEach((agent, i) => {
  const boxX = FIRST_BOX_X + i * BOX_STEP;
  sticky('# ' + agent.label + '\n\u2192 ' + agent.model,
    boxX, BOX_Y, BOX_W, BOX_H, agent.color);
});

// Telegram flow box
sticky('## Telegram Input Flow\nTrigger \u2192 Extract \u2192 Voice/Text \u2192 Transcribe \u2192 Format \u2192 Reply',
  FIRST_BOX_X - 60, TG_Y - 200, 2820, 520, 3);

// === 7. CHECK UNPOSITIONED ===
const allNamed = new Set([
  ...brainNames, ...vizzyToolNames,
  'Chat Interface', 'Vizzy - Supervisor Agent', 'Airtable Tool', 'HTTP Request Tool', 'Workflow Tool',
  ...agents.map(a => a.toolName),
  ...telegramNodes.map(t => t[0]), 'Slack Telegram Log'
]);
const unpos = wf.nodes.filter(n => n.type !== 'n8n-nodes-base.stickyNote' && !allNamed.has(n.name));
if (unpos.length > 0) {
  console.log('\nUnpositioned:');
  unpos.forEach(n => console.log('  ' + n.name));
}

console.log('\nTotal nodes:', wf.nodes.length);

// === 8. PUSH ===
fs.writeFileSync(TMP, JSON.stringify({
  name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: { executionOrder: 'v1' }
}));
const result = api('PUT', '/workflows/JAYrzGWR8A0tCBzB', TMP);
if (result.id) {
  console.log('SUCCESS! Nodes:', result.nodes.length);
  const twNodes = result.nodes.filter(n => n.type === '@n8n/n8n-nodes-langchain.toolWorkflow' && n.name !== 'Workflow Tool');
  console.log('Agent workflow tools:', twNodes.length);
  twNodes.forEach(t => console.log('  ' + t.name + ' @ ' + JSON.stringify(t.position)));
  const stickies = result.nodes.filter(n => n.type === 'n8n-nodes-base.stickyNote');
  console.log('Sticky notes:', stickies.length);
} else {
  console.log('FAILED:', JSON.stringify(result).substring(0, 500));
}

try { fs.unlinkSync(TMP); } catch(e) {}
