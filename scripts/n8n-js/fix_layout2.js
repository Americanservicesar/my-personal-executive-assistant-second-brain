const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_layout2.json';

function api(method, path, bodyFile) {
  const h = `-H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json"`;
  const d = bodyFile ? `-d @"${bodyFile}"` : '';
  return JSON.parse(execSync(`curl -s -X ${method} "${BASE}${path}" ${h} ${d}`, { maxBuffer: 10*1024*1024, timeout: 60000 }).toString());
}

console.log('Fetching Vizzy workflow...');
const wf = api('GET', '/workflows/JAYrzGWR8A0tCBzB');

// Strip all stickies
wf.nodes = wf.nodes.filter(n => n.type !== 'n8n-nodes-base.stickyNote');
console.log('Functional nodes:', wf.nodes.length);

// === AGENT DEFS ===
const agents = [
  { toolName: 'Milli - Sales Manager', color: 4, label: 'Milli', sub: 'Sales Manager', model: 'GPT 4.1 Mini' },
  { toolName: 'Penn - Copywriter', color: 5, label: 'Penn', sub: 'Copywriter', model: 'Claude Sonnet 4.6' },
  { toolName: 'Emmie - Email Marketing', color: 6, label: 'Emmie', sub: 'Email Marketing', model: 'GPT 4.1 Mini' },
  { toolName: 'Soshie - Social Media', color: 1, label: 'Soshie', sub: 'Social Media', model: 'GPT 4.1 Mini' },
  { toolName: 'Buddy - Business Development', color: 2, label: 'Buddy', sub: 'Business Dev', model: 'Claude Sonnet 4.6' },
  { toolName: 'Cassie - Customer Support', color: 3, label: 'Cassie', sub: 'Customer Support', model: 'GPT 4.1 Mini' },
  { toolName: 'Seomi - SEO Specialist', color: 4, label: 'Seomi', sub: 'SEO Specialist', model: 'Claude Sonnet 4.6' },
  { toolName: 'Scouty - Competitive Analysis', color: 5, label: 'Scouty', sub: 'Competitive Analysis', model: 'GPT 4.1 Mini' },
  { toolName: 'Gigi - Google Workspace', color: 6, label: 'Gigi', sub: 'Google Workspace', model: 'GPT 4.1 Mini' },
  { toolName: 'Commet - Data Analysis', color: 1, label: 'Commet', sub: 'Data Analysis', model: 'Claude Sonnet 4.6' },
  { toolName: 'Dexter - Technical', color: 7, label: 'Dexter', sub: 'Technical', model: 'Claude Sonnet 4.6' }
];

function pos(name, x, y) {
  const n = wf.nodes.find(nd => nd.name === name);
  if (n) n.position = [x, y];
  else console.log('WARN: ' + name + ' not found');
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
// LAYOUT — matches multi-agent reference pattern
// =====================================================
//
// Row 1: Vizzy Direct Tools (y = -600)
// Row 2: Parent Agent box containing:
//           - Vizzy Supervisor Agent (y = 0)
//           - Brain: Claude Model, Memory, Calendar (y = 200)
//           - Extra tools: Airtable, HTTP, Workflow (y = 200)
//           - 11 agent toolWorkflow nodes (y = 400)
//         ...all inside one big green Parent Agent box
// Row 3: 11 colored agent boxes (y = 340), each wrapping its toolWorkflow node
// Row 4: Telegram flow (y = 700)
// =====================================================

// --- Agent box dimensions ---
const BOX_W = 280;
const BOX_GAP = 30;
const BOX_STEP = BOX_W + BOX_GAP;  // 310
const AGENT_ROW_X = 100;
const AGENT_BOX_Y = 340;
const AGENT_BOX_H = 260;

// --- Row 1: Vizzy Direct Tools ---
const vizzyTools = [
  'Gmail - Vizzy (sales@)', 'Gmail - Vizzy (office@)',
  'Gmail - Vizzy (asons@)', 'Gmail - Vizzy (sonsfamily@)',
  'Google Sheets - Vizzy', 'Google Drive - Vizzy',
  'Slack Tool - Vizzy', 'SerpApi - Vizzy', 'Google Docs - Vizzy'
];
const VT_X = 600;
const VT_Y = -600;
vizzyTools.forEach((name, i) => {
  const row = i < 5 ? 0 : 1;
  const col = i < 5 ? i : i - 5;
  pos(name, VT_X + col * 230, VT_Y + row * 160);
});
sticky('## Vizzy Direct Tools\nGmail (4 accts) + Sheets + Drive + Docs + Slack + SerpApi',
  VT_X - 60, VT_Y - 60, 5 * 230 + 80, 380, 3);

// --- Row 2: Parent Agent ---
// Vizzy Supervisor centered above agent boxes
const VIZZY_X = AGENT_ROW_X + Math.floor(agents.length / 2) * BOX_STEP;
pos('Chat Interface', VIZZY_X - 400, 0);
pos('Vizzy - Supervisor Agent', VIZZY_X, 0);

// Brain/Tools to the left of Vizzy
pos('Vizzy Claude Model', AGENT_ROW_X, 180);
pos('Team Conversation Memory', AGENT_ROW_X + 200, 180);
pos('Google Calendar Tool', AGENT_ROW_X + 400, 180);

// Extra direct tools to the right
pos('Airtable Tool', VIZZY_X + 400, 180);
pos('HTTP Request Tool', VIZZY_X + 600, 180);
pos('Workflow Tool', VIZZY_X + 800, 180);

// Brain/Tools box
sticky('## Brain / Tools\nClaude Model + Memory + Calendar',
  AGENT_ROW_X - 40, 120, 640, 180, 7);

// Parent Agent box — big green box encompassing Vizzy + brain + agent boxes
const parentLeft = AGENT_ROW_X - 60;
const parentRight = AGENT_ROW_X + agents.length * BOX_STEP + 60;
const parentTop = -80;
const parentBottom = AGENT_BOX_Y + AGENT_BOX_H + 40;
sticky('# Parent Agent \u2014 Vizzy Supervisor\nRoutes tasks to 11 specialized agent workflows',
  parentLeft, parentTop, parentRight - parentLeft, parentBottom - parentTop, 2);

// --- Row 3: Agent colored boxes with toolWorkflow nodes inside ---
agents.forEach((agent, i) => {
  const boxX = AGENT_ROW_X + i * BOX_STEP;

  // Position toolWorkflow node inside the box
  pos(agent.toolName, boxX + 40, AGENT_BOX_Y + 80);

  // Colored box
  sticky('# ' + agent.label + '\n' + agent.sub + '\n_' + agent.model + '_',
    boxX, AGENT_BOX_Y, BOX_W, AGENT_BOX_H, agent.color);
});

// --- Row 4: Telegram Flow ---
const TG_Y = AGENT_BOX_Y + AGENT_BOX_H + 160;
const TG_X = AGENT_ROW_X;
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

// === PUSH ===
console.log('Total nodes:', wf.nodes.length);
fs.writeFileSync(TMP, JSON.stringify({
  name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: { executionOrder: 'v1' }
}));
const result = api('PUT', '/workflows/JAYrzGWR8A0tCBzB', TMP);
if (result.id) {
  console.log('SUCCESS! Nodes:', result.nodes.length);
  // Verify each toolWorkflow is inside its box
  agents.forEach((agent, i) => {
    const boxX = AGENT_ROW_X + i * BOX_STEP;
    const n = result.nodes.find(nd => nd.name === agent.toolName);
    if (n) {
      const inside = n.position[0] >= boxX && n.position[0] <= boxX + BOX_W &&
                     n.position[1] >= AGENT_BOX_Y && n.position[1] <= AGENT_BOX_Y + AGENT_BOX_H;
      console.log('  ' + agent.label.padEnd(8) + (inside ? 'IN BOX' : 'OUT!') + ' @ ' + JSON.stringify(n.position));
    }
  });
} else {
  console.log('FAILED:', JSON.stringify(result).substring(0, 500));
}
try { fs.unlinkSync(TMP); } catch(e) {}
