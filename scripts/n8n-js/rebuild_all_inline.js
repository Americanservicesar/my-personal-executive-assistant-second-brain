const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_all.json';
const VIZZY_ID = 'JAYrzGWR8A0tCBzB';

function api(method, path, bodyFile) {
  const h = `-H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json"`;
  const d = bodyFile ? `-d @"${bodyFile}"` : '';
  return JSON.parse(execSync(`curl -s -X ${method} "${BASE}${path}" ${h} ${d}`, { maxBuffer: 10*1024*1024, timeout: 60000 }).toString());
}

const COL = 200;
const ROW = 160;
const AGENT_BOX_W = 4 * COL + 180; // 980
const AGENT_GAP = 60;
const AGENT_STEP = AGENT_BOX_W + AGENT_GAP; // 1040

const agentDefs = [
  { wfId: 'BJ8RLrbjuZ8pSmAL', key: 'Milli', sub: 'Sales Manager', color: 4 },
  { wfId: 'cwyGNdgiCABHwVa3', key: 'Penn', sub: 'Copywriter', color: 5 },
  { wfId: 'Cxb4JDBsMF8fvRqP', key: 'Emmie', sub: 'Email Marketing', color: 6 },
  { wfId: 'W3aE7gdjj2CTapyG', key: 'Soshie', sub: 'Social Media', color: 1 },
  { wfId: 'Qa4j2OFzxmbPMpug', key: 'Buddy', sub: 'Business Dev', color: 2 },
  { wfId: 'X9OndKjPk1rspj5l', key: 'Cassie', sub: 'Customer Support', color: 3 },
  { wfId: 'nygXpDVV5Lmn77hX', key: 'Seomi', sub: 'SEO Specialist', color: 4 },
  { wfId: 'KYkM8ymQybnit3Gb', key: 'Scouty', sub: 'Competitive Analysis', color: 5 },
  { wfId: 'TKCDLwYceeA0tCix', key: 'Gigi', sub: 'Google Workspace', color: 6 },
  { wfId: '8v3B7RqpkH9ltMvm', key: 'Commet', sub: 'Data Analysis', color: 1 },
  { wfId: 'bT5En2FMmvXhIiDl', key: 'Dexter', sub: 'Technical', color: 7 }
];

// ========== Fetch main workflow ==========
console.log('Fetching Vizzy...');
const wf = api('GET', '/workflows/' + VIZZY_ID);

// Save toolWorkflow descriptions before removing
const twDescs = {};
wf.nodes.forEach(n => {
  if (n.type === '@n8n/n8n-nodes-langchain.toolWorkflow' && n.parameters.description) {
    twDescs[n.name] = n.parameters.description;
  }
  if (n.type === '@n8n/n8n-nodes-langchain.agentTool' && n.parameters.toolDescription) {
    twDescs[n.name] = n.parameters.toolDescription;
  }
});

// Strip ALL stickies + ALL agent-related nodes (agentTool, toolWorkflow for agents, and their tools)
// Keep only: core Vizzy nodes (supervisor, brain, vizzy direct tools, telegram flow)
const coreNames = new Set([
  'Chat Interface', 'Vizzy - Supervisor Agent', 'Vizzy Claude Model',
  'Team Conversation Memory', 'Google Calendar Tool',
  'Airtable Tool', 'HTTP Request Tool', 'Workflow Tool',
  'Gmail - Vizzy (sales@)', 'Gmail - Vizzy (office@)',
  'Gmail - Vizzy (asons@)', 'Gmail - Vizzy (sonsfamily@)',
  'Google Sheets - Vizzy', 'Google Drive - Vizzy',
  'Slack Tool - Vizzy', 'SerpApi - Vizzy', 'Google Docs - Vizzy',
  'Telegram Trigger', 'Extract Telegram Input', 'Is Voice Message?',
  'Get Voice File', 'Transcribe Voice', 'Set Transcribed Text',
  'Merge Telegram Input', 'Format for Vizzy', 'Send Telegram Reply',
  'Slack Telegram Log', 'Slack Agent Activity'
]);

wf.nodes = wf.nodes.filter(n => coreNames.has(n.name));
console.log('Core nodes kept:', wf.nodes.length);

// Clean connections — remove any that reference removed nodes
const validNames = new Set(wf.nodes.map(n => n.name));
for (const key of Object.keys(wf.connections)) {
  if (!validNames.has(key)) delete wf.connections[key];
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

function pos(name, x, y) {
  const n = wf.nodes.find(nd => nd.name === name);
  if (n) n.position = [x, y];
}

// =====================================================
// ZONE 1: Vizzy Direct Tools  y = -720 to -340
// ZONE 2: Parent + Brain      y = -200 to 260
// ZONE 3: Agent boxes         y = 380+ (side by side)
// ZONE 4: Telegram flow       y = below tallest box + 280
// =====================================================

// --- Zone 1 ---
const VT_X = 600, VT_Y = -660;
['Gmail - Vizzy (sales@)','Gmail - Vizzy (office@)','Gmail - Vizzy (asons@)',
 'Gmail - Vizzy (sonsfamily@)','Google Sheets - Vizzy','Google Drive - Vizzy',
 'Slack Tool - Vizzy','SerpApi - Vizzy','Google Docs - Vizzy'].forEach((name, i) => {
  pos(name, VT_X + (i % 5) * 230, VT_Y + Math.floor(i / 5) * 160);
});
sticky('## Vizzy Direct Tools\nGmail (4) + Sheets + Drive + Docs + Slack + SerpApi',
  VT_X - 60, VT_Y - 60, 5 * 230 + 80, 380, 3);

// --- Zone 2 ---
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

// --- Zone 3: Build each agent inline ---
const AGENT_Y = 380;
let maxAgentBottom = 0;

for (let ai = 0; ai < agentDefs.length; ai++) {
  const def = agentDefs[ai];
  console.log('Processing ' + def.key + '...');

  const swf = api('GET', '/workflows/' + def.wfId);
  const swfNodes = swf.nodes.filter(n => n.type !== 'n8n-nodes-base.stickyNote');

  const agentNode = swfNodes.find(n => n.name === def.key + ' Agent');
  const systemMessage = agentNode ? agentNode.parameters.options.systemMessage : '';
  const modelNode = swfNodes.find(n => n.type.includes('lmChat') && n.name.includes(def.key));
  const modelType = modelNode ? (modelNode.type.includes('OpenAi') ? 'GPT 4.1 Mini' : 'Claude Sonnet 4.6') : '?';

  const toolNodes = swfNodes.filter(n =>
    n.name !== 'When Executed by Another Workflow' &&
    n.name !== (def.key + ' Agent') &&
    (!modelNode || n.name !== modelNode.name)
  );
  const gmailTools = toolNodes.filter(n => n.type === 'n8n-nodes-base.gmailTool');
  const otherTools = toolNodes.filter(n => n.type !== 'n8n-nodes-base.gmailTool');

  // Find description
  let toolDesc = '';
  for (const [k, v] of Object.entries(twDescs)) {
    if (k.startsWith(def.key)) { toolDesc = v; break; }
  }

  // Box position
  const boxX = 100 + ai * AGENT_STEP;
  const innerX = boxX + 60;

  // Create agentTool
  const atName = def.key + ' - ' + def.sub;
  wf.nodes.push({
    parameters: {
      toolDescription: toolDesc,
      text: "={{ $fromAI('task', 'The task to complete') }}",
      options: { systemMessage }
    },
    id: def.key.toLowerCase() + '-at',
    name: atName,
    type: '@n8n/n8n-nodes-langchain.agentTool',
    typeVersion: 3,
    position: [innerX, AGENT_Y + 80]
  });

  // Add model
  let modelName = '';
  if (modelNode) {
    const mc = JSON.parse(JSON.stringify(modelNode));
    mc.id = def.key.toLowerCase() + '-mdl';
    mc.position = [innerX + 300, AGENT_Y + 80];
    wf.nodes.push(mc);
    modelName = mc.name;
  }

  // Brain sub-box
  sticky('## Brain', innerX - 20, AGENT_Y + 40, 540, 170, 7);

  // Gmail tools
  let nextY = AGENT_Y + 260;
  if (gmailTools.length > 0) {
    gmailTools.forEach((t, i) => {
      const tc = JSON.parse(JSON.stringify(t));
      tc.id = def.key.toLowerCase() + '-gm' + i;
      tc.position = [innerX + (i % 4) * COL, nextY + 60 + Math.floor(i / 4) * ROW];
      wf.nodes.push(tc);
    });
    const gmailRows = Math.ceil(gmailTools.length / 4);
    const gmailH = gmailRows * ROW + 80;
    sticky('## Gmail Tools', innerX - 20, nextY, 4 * COL + 40, gmailH, 6);
    nextY += gmailH + 40;
  }

  // Other tools
  otherTools.forEach((t, i) => {
    const tc = JSON.parse(JSON.stringify(t));
    tc.id = def.key.toLowerCase() + '-tl' + i;
    tc.position = [innerX + (i % 4) * COL, nextY + 60 + Math.floor(i / 4) * ROW];
    wf.nodes.push(tc);
  });
  const otherRows = Math.ceil(otherTools.length / 4);
  const otherH = otherRows * ROW + 80;
  sticky('## Other Tools', innerX - 20, nextY, 4 * COL + 40, otherH, 3);
  nextY += otherH + 40;

  // Outer box
  const boxH = nextY - AGENT_Y + 20;
  sticky('# ' + def.key + ' \u2014 ' + def.sub + '\n' + modelType,
    boxX, AGENT_Y - 20, AGENT_BOX_W, boxH, def.color);

  if (AGENT_Y + boxH > maxAgentBottom) maxAgentBottom = AGENT_Y + boxH;

  // Connections
  wf.connections[atName] = {
    ai_tool: [[{ node: 'Vizzy - Supervisor Agent', type: 'ai_tool', index: 0 }]]
  };
  if (modelName) {
    wf.connections[modelName] = {
      ai_languageModel: [[{ node: atName, type: 'ai_languageModel', index: 0 }]]
    };
  }
  gmailTools.forEach(t => {
    wf.connections[t.name] = {
      ai_tool: [[{ node: atName, type: 'ai_tool', index: 0 }]]
    };
  });
  otherTools.forEach(t => {
    wf.connections[t.name] = {
      ai_tool: [[{ node: atName, type: 'ai_tool', index: 0 }]]
    };
  });

  console.log('  ' + def.key + ': box [' + boxX + ',' + (AGENT_Y-20) + '] ' + AGENT_BOX_W + 'x' + boxH + ' gmail:' + gmailTools.length + ' other:' + otherTools.length);
}

// --- Zone 4: Telegram flow ---
const TG_Y = maxAgentBottom + 280;
const TG_X = 100;
[['Telegram Trigger',0,0],['Extract Telegram Input',280,0],['Is Voice Message?',560,0],
 ['Get Voice File',840,-120],['Transcribe Voice',1120,-120],['Set Transcribed Text',1400,-120],
 ['Merge Telegram Input',1680,0],['Format for Vizzy',1960,0],
 ['Send Telegram Reply',2240,0],['Slack Agent Activity',2520,0]
].forEach(([name,dx,dy]) => pos(name, TG_X+dx, TG_Y+dy));
pos('Slack Telegram Log', TG_X + 2240, TG_Y + 200);
sticky('## Telegram Input Flow\nTrigger \u2192 Extract \u2192 Voice/Text \u2192 Transcribe \u2192 Format \u2192 Reply',
  TG_X - 60, TG_Y - 180, 2820, 500, 3);

// === Verify boxes ===
console.log('\n=== Box bounds ===');
const boxes = wf.nodes.filter(n => n.type === 'n8n-nodes-base.stickyNote').map(s => ({
  label: s.parameters.content.split('\n')[0],
  x1: s.position[0], y1: s.position[1],
  x2: s.position[0] + s.parameters.width, y2: s.position[1] + s.parameters.height,
  color: s.parameters.color
}));

// Check overlaps between outer boxes (same hierarchy level)
const outerBoxes = boxes.filter(b => b.label.startsWith('#') && !b.label.startsWith('##'));
for (let i = 0; i < outerBoxes.length; i++) {
  for (let j = i + 1; j < outerBoxes.length; j++) {
    const a = outerBoxes[i], b = outerBoxes[j];
    if (a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1) {
      console.log('  OVERLAP: ' + a.label + ' <-> ' + b.label);
    }
  }
}

outerBoxes.forEach(b => console.log('  ' + b.label.padEnd(40) + 'x:' + b.x1 + '-' + b.x2 + ' y:' + b.y1 + '-' + b.y2));

// ========== Push ==========
console.log('\nTotal nodes:', wf.nodes.length);
fs.writeFileSync(TMP, JSON.stringify({
  name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: { executionOrder: 'v1' }
}));
const result = api('PUT', '/workflows/' + VIZZY_ID, TMP);
if (result.id) {
  console.log('SUCCESS! Nodes:', result.nodes.length);
  const ats = result.nodes.filter(n => n.type === '@n8n/n8n-nodes-langchain.agentTool');
  console.log('agentTool nodes:', ats.length);
  ats.forEach(a => console.log('  ' + a.name));
} else {
  console.log('FAILED:', JSON.stringify(result).substring(0, 1000));
}
try { fs.unlinkSync(TMP); } catch(e) {}
