const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_rebuild.json';
const VIZZY_ID = 'JAYrzGWR8A0tCBzB';

function api(method, path, bodyFile) {
  const h = `-H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json"`;
  const d = bodyFile ? `-d @"${bodyFile}"` : '';
  return JSON.parse(execSync(`curl -s -X ${method} "${BASE}${path}" ${h} ${d}`, { maxBuffer: 10*1024*1024, timeout: 60000 }).toString());
}

const COL = 200;
const ROW = 160;
const AGENT_BOX_W = 900; // 4*COL + margins
const AGENT_GAP = 40;
const AGENT_STEP = AGENT_BOX_W + AGENT_GAP;

// Agent standalone workflow IDs + metadata
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

// ========== Step 1: Fetch main workflow ==========
console.log('Fetching Vizzy main workflow...');
const vizzy = api('GET', '/workflows/' + VIZZY_ID);
console.log('Current nodes:', vizzy.nodes.length);

// Collect toolWorkflow descriptions before removing
const toolDescriptions = {};
vizzy.nodes.forEach(n => {
  if (n.type === '@n8n/n8n-nodes-langchain.toolWorkflow' && n.parameters.description) {
    toolDescriptions[n.name] = n.parameters.description;
  }
});

// Keep only: non-agent nodes (Vizzy core, telegram, vizzy direct tools, brain, stickies stripped)
const keepTypes = new Set([
  'chatTrigger', 'agent', 'lmChatAnthropic', 'memoryBufferWindow',
  'googleCalendarTool', 'airtableTool', 'httpRequestTool', 'toolWorkflow',
  'telegramTrigger', 'set', 'if', 'telegram', 'openAi', 'merge', 'slack',
  'gmailTool', 'googleSheetsTool', 'googleDriveTool', 'slackTool', 'toolSerpApi', 'googleDocsTool'
]);

// Remove stickies and all agent toolWorkflow nodes
const agentToolWorkflowNames = agentDefs.map(a => {
  const n = vizzy.nodes.find(nd => nd.type === '@n8n/n8n-nodes-langchain.toolWorkflow' && nd.name.startsWith(a.key));
  return n ? n.name : null;
}).filter(Boolean);

vizzy.nodes = vizzy.nodes.filter(n =>
  n.type !== 'n8n-nodes-base.stickyNote' && !agentToolWorkflowNames.includes(n.name)
);

// Also clean connections for removed nodes
agentToolWorkflowNames.forEach(name => delete vizzy.connections[name]);

console.log('Core nodes kept:', vizzy.nodes.length);

// ========== Step 2: Fetch each standalone workflow and build inline agents ==========
let sid = 0;
function sticky(content, x, y, w, h, color) {
  sid++;
  vizzy.nodes.push({
    parameters: { content, height: h, width: w, color },
    type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
    position: [x, y], id: 'sticky-' + sid, name: 'Sticky Note ' + sid
  });
}

// Position core nodes first
function pos(name, x, y) {
  const n = vizzy.nodes.find(nd => nd.name === name);
  if (n) n.position = [x, y];
}

// --- Vizzy Direct Tools ---
const VT_Y = -660;
const VT_X = 600;
const vizzyTools = [
  'Gmail - Vizzy (sales@)', 'Gmail - Vizzy (office@)',
  'Gmail - Vizzy (asons@)', 'Gmail - Vizzy (sonsfamily@)',
  'Google Sheets - Vizzy', 'Google Drive - Vizzy',
  'Slack Tool - Vizzy', 'SerpApi - Vizzy', 'Google Docs - Vizzy'
];
vizzyTools.forEach((name, i) => {
  pos(name, VT_X + (i % 5) * 230, VT_Y + Math.floor(i / 5) * 160);
});
sticky('## Vizzy Direct Tools\nGmail (4) + Sheets + Drive + Docs + Slack + SerpApi',
  VT_X - 60, VT_Y - 60, 5 * 230 + 80, 380, 3);

// --- Brain / Tools ---
pos('Vizzy Claude Model', 40, 100);
pos('Team Conversation Memory', 240, 100);
pos('Google Calendar Tool', 40, 260);
sticky('## Brain / Tools\nClaude Model + Memory + Calendar', 0, 40, 460, 300, 7);

// --- Parent Agent ---
pos('Chat Interface', 500, -100);
pos('Vizzy - Supervisor Agent', 900, -100);
pos('Airtable Tool', 1300, -100);
pos('HTTP Request Tool', 1500, -100);
pos('Workflow Tool', 1700, -100);
sticky('# Parent Agent \u2014 Vizzy Supervisor',
  440, -180, 1500, 240, 2);

// --- Agent boxes start ---
const AGENT_Y = 500;
const AGENT_X_START = 100;

for (let ai = 0; ai < agentDefs.length; ai++) {
  const def = agentDefs[ai];
  console.log('\nProcessing ' + def.key + '...');

  // Fetch standalone workflow
  const swf = api('GET', '/workflows/' + def.wfId);
  const swfNodes = swf.nodes.filter(n => n.type !== 'n8n-nodes-base.stickyNote');

  // Find agent node and extract system prompt
  const agentNode = swfNodes.find(n => n.name === def.key + ' Agent');
  const systemMessage = agentNode ? agentNode.parameters.options.systemMessage : '';

  // Find description from the old toolWorkflow node
  const twName = agentToolWorkflowNames.find(n => n.startsWith(def.key));
  const toolDesc = toolDescriptions[twName] || def.key + ' agent';

  // Find model node
  const modelNode = swfNodes.find(n =>
    n.type.includes('lmChat') && n.name.includes(def.key)
  );

  // Find all tool nodes (not trigger, not agent, not model)
  const toolNodes = swfNodes.filter(n =>
    n.name !== 'When Executed by Another Workflow' &&
    n.name !== (def.key + ' Agent') &&
    (!modelNode || n.name !== modelNode.name)
  );

  // Separate gmail tools and other tools
  const gmailTools = toolNodes.filter(n => n.type === 'n8n-nodes-base.gmailTool');
  const otherTools = toolNodes.filter(n => n.type !== 'n8n-nodes-base.gmailTool');

  console.log('  System prompt: ' + systemMessage.length + ' chars');
  console.log('  Model: ' + (modelNode ? modelNode.name : 'NONE'));
  console.log('  Gmail tools: ' + gmailTools.length);
  console.log('  Other tools: ' + otherTools.length);

  // Box position
  const boxX = AGENT_X_START + ai * AGENT_STEP;
  const boxInnerX = boxX + 60;

  // --- Create agentTool node ---
  const agentToolNode = {
    parameters: {
      toolDescription: toolDesc,
      text: "={{ $fromAI('task', 'The task to complete') }}",
      options: { systemMessage }
    },
    id: def.key.toLowerCase() + '-at-' + Date.now(),
    name: def.key + ' - ' + def.sub,
    type: '@n8n/n8n-nodes-langchain.agentTool',
    typeVersion: 3,
    position: [boxInnerX, AGENT_Y + 60]
  };
  vizzy.nodes.push(agentToolNode);

  // --- Add model node ---
  let modelName = '';
  if (modelNode) {
    const mc = JSON.parse(JSON.stringify(modelNode));
    mc.position = [boxInnerX + 300, AGENT_Y + 60];
    mc.id = def.key.toLowerCase() + '-model-' + Date.now();
    vizzy.nodes.push(mc);
    modelName = mc.name;
  }

  // --- Add Gmail tools ---
  let nextY = AGENT_Y + 280;
  gmailTools.forEach((t, i) => {
    const tc = JSON.parse(JSON.stringify(t));
    tc.position = [boxInnerX + (i % 4) * COL, nextY + Math.floor(i / 4) * ROW];
    tc.id = def.key.toLowerCase() + '-gmail-' + i + '-' + Date.now();
    vizzy.nodes.push(tc);
  });
  const gmailRows = Math.ceil(gmailTools.length / 4);
  if (gmailTools.length > 0) {
    sticky('## Gmail Tools', boxInnerX - 20, nextY - 60, 4 * COL + 40, gmailRows * ROW + 80, 6);
    nextY += gmailRows * ROW + 100;
  }

  // --- Add Other tools ---
  otherTools.forEach((t, i) => {
    const tc = JSON.parse(JSON.stringify(t));
    tc.position = [boxInnerX + (i % 4) * COL, nextY + Math.floor(i / 4) * ROW];
    tc.id = def.key.toLowerCase() + '-tool-' + i + '-' + Date.now();
    vizzy.nodes.push(tc);
  });
  const otherRows = Math.ceil(otherTools.length / 4);
  sticky('## Other Tools', boxInnerX - 20, nextY - 60, 4 * COL + 40, otherRows * ROW + 80, 3);
  nextY += otherRows * ROW + 60;

  // --- Brain box ---
  sticky('## Brain', boxInnerX - 20, AGENT_Y + 200, 300, 130, 7);

  // --- Outer agent box ---
  const boxH = nextY - AGENT_Y + 20;
  sticky('# ' + def.key + ' \u2014 ' + def.sub,
    boxX, AGENT_Y - 20, AGENT_BOX_W, boxH, def.color);

  // --- Connections ---
  // agentTool → Vizzy Supervisor
  vizzy.connections[agentToolNode.name] = {
    ai_tool: [[{ node: 'Vizzy - Supervisor Agent', type: 'ai_tool', index: 0 }]]
  };

  // model → agentTool
  if (modelName) {
    vizzy.connections[modelName] = {
      ai_languageModel: [[{ node: agentToolNode.name, type: 'ai_languageModel', index: 0 }]]
    };
  }

  // each tool → agentTool
  gmailTools.forEach(t => {
    vizzy.connections[t.name] = {
      ai_tool: [[{ node: agentToolNode.name, type: 'ai_tool', index: 0 }]]
    };
  });
  otherTools.forEach(t => {
    vizzy.connections[t.name] = {
      ai_tool: [[{ node: agentToolNode.name, type: 'ai_tool', index: 0 }]]
    };
  });

  console.log('  Box: [' + boxX + ',' + (AGENT_Y-20) + '] ' + AGENT_BOX_W + 'x' + boxH);
}

// --- Telegram flow ---
const TG_Y = AGENT_Y + 2200; // well below the tallest agent box
const TG_X = AGENT_X_START;
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

// ========== Step 3: Push ==========
console.log('\n=== Final ===');
console.log('Total nodes:', vizzy.nodes.length);
const stickies = vizzy.nodes.filter(n => n.type === 'n8n-nodes-base.stickyNote');
console.log('Sticky notes:', stickies.length);

fs.writeFileSync(TMP, JSON.stringify({
  name: vizzy.name, nodes: vizzy.nodes, connections: vizzy.connections, settings: { executionOrder: 'v1' }
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
