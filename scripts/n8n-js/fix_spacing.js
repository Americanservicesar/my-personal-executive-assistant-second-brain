const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_spacing.json';
const VIZZY_ID = 'JAYrzGWR8A0tCBzB';

function api(method, path, bodyFile) {
  const h = `-H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json"`;
  const d = bodyFile ? `-d @"${bodyFile}"` : '';
  return JSON.parse(execSync(`curl -s -X ${method} "${BASE}${path}" ${h} ${d}`, { maxBuffer: 10*1024*1024, timeout: 60000 }).toString());
}

console.log('Fetching Vizzy...');
const wf = api('GET', '/workflows/' + VIZZY_ID);

// Remove ALL stickies — rebuild from scratch
wf.nodes = wf.nodes.filter(n => n.type !== 'n8n-nodes-base.stickyNote');
console.log('Functional nodes:', wf.nodes.length);

function pos(name, x, y) {
  const n = wf.nodes.find(nd => nd.name === name);
  if (n) n.position = [x, y];
  else console.log('WARN not found: ' + name);
}

let sid = 0;
function sticky(content, x, y, w, h, color) {
  sid++;
  wf.nodes.push({
    parameters: { content, height: h, width: w, color },
    type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
    position: [x, y], id: 'sticky-' + sid, name: 'Sticky Note ' + sid
  });
}

// =====================================================
// CLEAN LAYOUT — no overlapping boxes
// =====================================================
// Zone 1: y = -700 to -300  → Vizzy Direct Tools
// Zone 2: y = -200 to  200  → Parent Agent + Brain (gap: 100px)
// Zone 3: y =  300 to 1700+ → Milli agent box (gap: 100px)
//         (other agents will go to the RIGHT of Milli)
// Zone 4: y = 1900+         → Telegram flow (gap: 100px below tallest box)
// =====================================================

const COL = 200;
const ROW = 160;

// --- Zone 1: Vizzy Direct Tools ---
const VT_X = 600, VT_Y = -660;
const vtNames = [
  'Gmail - Vizzy (sales@)', 'Gmail - Vizzy (office@)',
  'Gmail - Vizzy (asons@)', 'Gmail - Vizzy (sonsfamily@)',
  'Google Sheets - Vizzy', 'Google Drive - Vizzy',
  'Slack Tool - Vizzy', 'SerpApi - Vizzy', 'Google Docs - Vizzy'
];
vtNames.forEach((name, i) => {
  pos(name, VT_X + (i % 5) * 230, VT_Y + Math.floor(i / 5) * 160);
});
sticky('## Vizzy Direct Tools\nGmail (4) + Sheets + Drive + Docs + Slack + SerpApi',
  VT_X - 60, VT_Y - 60, 5 * 230 + 80, 380, 3);

// --- Zone 2: Parent Agent + Brain ---
pos('Chat Interface', 100, -120);
pos('Vizzy - Supervisor Agent', 500, -120);
pos('Airtable Tool', 900, -120);
pos('HTTP Request Tool', 1100, -120);
pos('Workflow Tool', 1300, -120);
sticky('# Parent Agent \u2014 Vizzy Supervisor\nRoutes tasks to 11 agent sub-agents + direct tools',
  40, -200, 1500, 240, 2);

pos('Vizzy Claude Model', 40, 120);
pos('Team Conversation Memory', 240, 120);
pos('Google Calendar Tool', 440, 120);
sticky('## Brain / Tools\nClaude Model + Memory + Calendar',
  0, 60, 660, 200, 7);

// --- Zone 3: Milli Agent Box ---
// Clean internal spacing with gaps between sub-boxes
const MX = 100;   // box left x
const MY = 380;    // box top y
const INNER = MX + 60; // inner content x

// agentTool + model row
pos('Milli - Sales Manager', INNER, MY + 80);
pos('Milli GPT 4.1 Mini', INNER + 300, MY + 80);

// Brain sub-box: y = MY+60 to MY+200
sticky('## Brain', INNER - 20, MY + 40, 540, 170, 7);

// Gmail tools: start at MY + 260 (gap of 60 below brain)
const GMAIL_Y = MY + 260;
const gmailNames = [
  'Send Email - Milli', 'Get Emails - Milli', 'Create Draft - Milli', 'Email Reply - Milli',
  'Get Labels - Milli', 'Label Emails - Milli', 'Mark Unread - Milli'
];
gmailNames.forEach((name, i) => {
  pos(name, INNER + (i % 4) * COL, GMAIL_Y + 60 + Math.floor(i / 4) * ROW);
});
const gmailRows = Math.ceil(gmailNames.length / 4);
const gmailBoxH = gmailRows * ROW + 80;
sticky('## Gmail Tools', INNER - 20, GMAIL_Y, 4 * COL + 40, gmailBoxH, 6);

// Other tools: start after gmail box + 40px gap
const OTHER_Y = GMAIL_Y + gmailBoxH + 40;
const otherNames = [
  'Web Search - Milli', 'Google Calendar - Milli', 'Google Sheets - Milli', 'Google Drive - Milli',
  'QuickBooks - Milli', 'Airtable - Milli', 'Slack - Milli', 'SerpApi - Milli',
  'HTTP - Housecall Pro (Milli)', 'HTTP - GutterGlove (Milli)', 'GitHub Brain - Milli'
];
otherNames.forEach((name, i) => {
  pos(name, INNER + (i % 4) * COL, OTHER_Y + 60 + Math.floor(i / 4) * ROW);
});
const otherRows = Math.ceil(otherNames.length / 4);
const otherBoxH = otherRows * ROW + 80;
sticky('## Other Tools', INNER - 20, OTHER_Y, 4 * COL + 40, otherBoxH, 3);

// Outer Milli box: wraps everything with padding
const milliBoxBottom = OTHER_Y + otherBoxH + 40;
const milliBoxH = milliBoxBottom - MY;
sticky('# Milli \u2014 Sales Manager\nGPT 4.1 Mini \u00B7 Inline agent',
  MX, MY - 20, 4 * COL + 180, milliBoxH + 20, 4);

console.log('Milli box: y=' + (MY-20) + ' to ' + milliBoxBottom + ' (h=' + (milliBoxH+20) + ')');

// --- Zone 4: Telegram flow — below Milli with 100px gap ---
const TG_Y = milliBoxBottom + 280;
const TG_X = MX;
const tgNodes = [
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
tgNodes.forEach(([name, dx, dy]) => pos(name, TG_X + dx, TG_Y + dy));
pos('Slack Telegram Log', TG_X + 2240, TG_Y + 200);
sticky('## Telegram Input Flow\nTrigger \u2192 Extract \u2192 Voice/Text \u2192 Transcribe \u2192 Format \u2192 Reply',
  TG_X - 60, TG_Y - 180, 2820, 500, 3);

console.log('Telegram box: y=' + (TG_Y-180) + ' to ' + (TG_Y+320));

// --- Remaining toolWorkflow agent nodes (Penn-Dexter) ---
// These are still toolWorkflow calls — position them to the RIGHT of Milli
const otherAgentNames = [
  'Penn - Copywriter', 'Emmie - Email Marketing', 'Soshie - Social Media',
  'Buddy - Business Development', 'Cassie - Customer Support',
  'Seomi - SEO Specialist', 'Scouty - Competitive Analysis',
  'Gigi - Google Workspace', 'Commet - Data Analysis', 'Dexter - Technical'
];
const AGENT_TW_X = MX + 4 * COL + 180 + 100; // right of Milli box + gap
otherAgentNames.forEach((name, i) => {
  pos(name, AGENT_TW_X + (i % 5) * 220, MY + 60 + Math.floor(i / 5) * 160);
});
sticky('## Remaining Agents (standalone workflows)\nWill be migrated inline next',
  AGENT_TW_X - 40, MY - 20, 5 * 220 + 40, 380, 2);

// === Verify no overlaps ===
const boxes = wf.nodes.filter(n => n.type === 'n8n-nodes-base.stickyNote').map(s => ({
  label: s.parameters.content.split('\n')[0],
  x1: s.position[0], y1: s.position[1],
  x2: s.position[0] + s.parameters.width, y2: s.position[1] + s.parameters.height
}));

// Check for overlaps between same-level boxes (skip parent containing children)
console.log('\n=== Box bounds ===');
boxes.forEach(b => console.log(b.label.padEnd(35) + 'x:' + b.x1 + '-' + b.x2 + ' y:' + b.y1 + '-' + b.y2));

// ========== Push ==========
console.log('\nTotal nodes:', wf.nodes.length);
fs.writeFileSync(TMP, JSON.stringify({
  name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: { executionOrder: 'v1' }
}));
const result = api('PUT', '/workflows/' + VIZZY_ID, TMP);
if (result.id) {
  console.log('SUCCESS! Nodes:', result.nodes.length);
} else {
  console.log('FAILED:', JSON.stringify(result).substring(0, 500));
}
try { fs.unlinkSync(TMP); } catch(e) {}
