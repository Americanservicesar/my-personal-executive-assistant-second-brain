const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_milli.json';

function api(method, path, bodyFile) {
  const h = `-H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json"`;
  const d = bodyFile ? `-d @"${bodyFile}"` : '';
  return JSON.parse(execSync(`curl -s -X ${method} "${BASE}${path}" ${h} ${d}`, { maxBuffer: 10*1024*1024, timeout: 60000 }).toString());
}

const WF_ID = 'BJ8RLrbjuZ8pSmAL';
console.log('Fetching Milli workflow...');
const wf = api('GET', '/workflows/' + WF_ID);

// Strip all stickies
wf.nodes = wf.nodes.filter(n => n.type !== 'n8n-nodes-base.stickyNote');
console.log('Functional nodes:', wf.nodes.length);

function pos(name, x, y) {
  const n = wf.nodes.find(nd => nd.name === name);
  if (n) { n.position = [x, y]; return true; }
  console.log('WARN: ' + name + ' not found');
  return false;
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
// LAYOUT — matching multi-agent reference pattern
// =====================================================
//
//  ┌─ Milli — Sales Manager (red box) ──────────────────────────────┐
//  │                                                                │
//  │  [Execute Trigger] ──→ [Milli Agent]                          │
//  │                                                                │
//  │  ┌─ Brain (purple) ──┐                                        │
//  │  │ [GPT 4.1 Mini]   │                                        │
//  │  └───────────────────┘                                        │
//  │                                                                │
//  │  ┌─ Gmail Tools ─────────────────────────────────────┐        │
//  │  │ [Send Email] [Get Emails] [Create Draft] [Reply]  │        │
//  │  │ [Get Labels] [Label Emails] [Mark Unread]         │        │
//  │  └───────────────────────────────────────────────────┘        │
//  │                                                                │
//  │  ┌─ Other Tools ─────────────────────────────────────┐        │
//  │  │ [Web Search]  [Calendar]  [Sheets]  [Drive]       │        │
//  │  │ [QuickBooks]  [Airtable]  [Slack]   [SerpApi]     │        │
//  │  │ [Housecall]   [GutterGlove] [GitHub Brain]        │        │
//  │  └───────────────────────────────────────────────────┘        │
//  └────────────────────────────────────────────────────────────────┘

// Column spacing
const COL = 200;
const ROW = 160;

// --- Main flow ---
pos('When Executed by Another Workflow', 80, 80);
pos('Milli Agent', 480, 80);

// --- Brain ---
pos('Milli GPT 4.1 Mini', 80, 300);

// --- Gmail Tools (7) ---
const GMAIL_Y = 500;
pos('Send Email - Milli',    80,         GMAIL_Y);
pos('Get Emails - Milli',    80 + COL,   GMAIL_Y);
pos('Create Draft - Milli',  80 + COL*2, GMAIL_Y);
pos('Email Reply - Milli',   80 + COL*3, GMAIL_Y);
pos('Get Labels - Milli',    80,         GMAIL_Y + ROW);
pos('Label Emails - Milli',  80 + COL,   GMAIL_Y + ROW);
pos('Mark Unread - Milli',   80 + COL*2, GMAIL_Y + ROW);

// --- Other Tools (12) ---
const OTHER_Y = GMAIL_Y + ROW * 2 + 60;
const otherTools = [
  'Web Search - Milli', 'Google Calendar - Milli', 'Google Sheets - Milli', 'Google Drive - Milli',
  'QuickBooks - Milli', 'Airtable - Milli', 'Slack - Milli', 'SerpApi - Milli',
  'HTTP - Housecall Pro (Milli)', 'HTTP - GutterGlove (Milli)', 'GitHub Brain - Milli'
];
otherTools.forEach((name, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  pos(name, 80 + col * COL, OTHER_Y + row * ROW);
});

// --- Sticky Notes ---

// Outer box — Milli agent
const OUTER_W = 4 * COL + 100;
const OUTER_H = OTHER_Y + Math.ceil(otherTools.length / 4) * ROW + 60;
sticky('# Milli \u2014 Sales Manager\nGPT 4.1 Mini \u00B7 Standalone agent workflow',
  20, 10, OUTER_W, OUTER_H, 4);

// Brain box
sticky('## Brain', 40, 240, 300, 160, 7);

// Gmail box
sticky('## Gmail Tools',
  40, GMAIL_Y - 60, 4 * COL + 40, ROW * 2 + 80, 6);

// Other Tools box
sticky('## Other Tools',
  40, OTHER_Y - 60, 4 * COL + 40, Math.ceil(otherTools.length / 4) * ROW + 80, 3);

// === PUSH ===
console.log('Total nodes:', wf.nodes.length);
fs.writeFileSync(TMP, JSON.stringify({
  name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: { executionOrder: 'v1' }
}));
const result = api('PUT', '/workflows/' + WF_ID, TMP);
if (result.id) {
  console.log('SUCCESS! Nodes:', result.nodes.length);
  const stickies = result.nodes.filter(n => n.type === 'n8n-nodes-base.stickyNote');
  console.log('Sticky notes:', stickies.length);
  stickies.forEach(s => console.log('  [color ' + s.parameters.color + '] ' + s.parameters.content.split('\\n')[0] + ' ' + s.parameters.width + 'x' + s.parameters.height));

  // Verify all nodes positioned
  const nonSticky = result.nodes.filter(n => n.type !== 'n8n-nodes-base.stickyNote');
  console.log('\nNode positions:');
  nonSticky.forEach(n => console.log('  ' + n.name.padEnd(40) + JSON.stringify(n.position)));
} else {
  console.log('FAILED:', JSON.stringify(result).substring(0, 500));
}
try { fs.unlinkSync(TMP); } catch(e) {}
