const fs = require('fs');
const wf = JSON.parse(fs.readFileSync(process.env.HOME + '/n8n_workflow.json', 'utf8'));

// Remove any existing sticky notes
wf.nodes = wf.nodes.filter(n => n.type !== 'n8n-nodes-base.stickyNote');
console.log('Nodes after removing stickies:', wf.nodes.length);

// === LAYOUT CONSTANTS ===
const BOX_W = 540;
const BOX_GAP = 40;
const BOX_STEP = BOX_W + BOX_GAP;
const FIRST_X = 500;
const AGENT_BOX_Y = 480;
const TOOL_COLS = [30, 210, 390];
const TOOL_ROW0 = 80;
const TOOL_ROW_H = 160;

// === AGENT DEFINITIONS ===
const agents = [
  { key: 'Milli', label: 'Marketing Agent', color: 4, at: 'Milli - Marketing Agent',
    tools: ['Milli Claude Model','Gmail Tool - Milli','Web Search - Milli','Google Calendar - Milli','Google Sheets - Milli','Google Drive - Milli','QuickBooks - Milli','Airtable - Milli','Slack - Milli','SerpApi - Milli','HTTP - Housecall Pro (Milli)','HTTP - GutterGlove (Milli)','GitHub Brain - Milli'] },
  { key: 'Penn', label: 'Writing Agent', color: 5, at: 'Penn - Writing Agent',
    tools: ['Penn Claude Model','Gmail Tool - Penn','Web Search - Penn','SerpApi - Penn','Google Drive - Penn','Google Docs - Penn','Google Sheets - Penn','Slack - Penn','GitHub Brain - Penn'] },
  { key: 'Emmie', label: 'Email Agent', color: 6, at: 'Emmie - Email Agent',
    tools: ['Emmie Claude Model','Gmail Tool - Emmie','HTTP - Instantly API (Emmie)','Google Sheets - Emmie','Google Drive - Emmie','SerpApi - Emmie','Airtable - Emmie','Slack - Emmie','GitHub Brain - Emmie'] },
  { key: 'Soshie', label: 'Social Media Agent', color: 1, at: 'Soshie - Social Media Agent',
    tools: ['Soshie Claude Model','Slack Tool - Soshie','Gmail Tool - Soshie','Google Sheets - Soshie','Google Drive - Soshie','SerpApi - Soshie','GitHub Brain - Soshie','HTTP - Facebook Post (Soshie)'] },
  { key: 'Buddy', label: 'Research Agent', color: 2, at: 'Buddy - Research Agent',
    tools: ['Buddy Claude Model','Web Search - Buddy','Google Calendar - Buddy','Google Sheets - Buddy','Google Drive - Buddy','Google Docs - Buddy','Airtable - Buddy','Slack - Buddy','GitHub Brain - Buddy','SerpApi - Buddy'] },
  { key: 'Cassie', label: 'Customer Service Agent', color: 3, at: 'Cassie - Customer Service Agent',
    tools: ['Cassie Claude Model','Gmail Tool - Cassie','Web Search - Cassie','HTTP - Housecall Pro (Cassie)','Google Sheets - Cassie','Google Drive - Cassie','Airtable - Cassie','Slack - Cassie','GitHub Brain - Cassie'] },
  { key: 'Seomi', label: 'SEO Agent', color: 4, at: 'Seomi - SEO Agent',
    tools: ['Seomi Claude Model','Web Search - Seomi','SerpApi - Seomi','Google Sheets - Seomi','Google Drive - Seomi','Google Docs - Seomi','Airtable - Seomi','Slack - Seomi','GitHub Brain - Seomi','HTTP - Bing Webmaster (Seomi)','HTTP - Moz API (Seomi)','HTTP - Broken Link Checker (Seomi)','HTTP - WordPress (Seomi)','HTTP - PageSpeed Insights (Seomi)','HTTP - RankMath API (Seomi)'] },
  { key: 'Scouty', label: 'Competitive Analysis', color: 5, at: 'Scouty - Competitive Analysis Agent',
    tools: ['Scouty Claude Model','Web Search - Scouty','Google Calendar - Scouty','Google Sheets - Scouty','Google Drive - Scouty','Google Docs - Scouty','SerpApi - Scouty','Airtable - Scouty','Slack - Scouty','GitHub Brain - Scouty','HTTP - Housecall Pro (Scouty)'] },
  { key: 'Gigi', label: 'Google Workspace Agent', color: 6, at: 'Gigi - Google Workspace Agent',
    tools: ['Gigi Claude Model','Google Sheets - Gigi','Gmail Tool - Gigi','Google Drive - Gigi','Google Docs - Gigi','SerpApi - Gigi','Slack - Gigi','GitHub Brain - Gigi'] },
  { key: 'Commet', label: 'Data Analysis Agent', color: 1, at: 'Commet - Data Analysis Agent',
    tools: ['Commet Claude Model','Google Sheets - Commet','Web Search - Commet','Google Drive - Commet','Google Docs - Commet','HTTP - Housecall Pro (Commet)','Airtable - Commet','Slack - Commet','GitHub Brain - Commet','HTTP - WordPress (Commet)'] },
  { key: 'Dexter', label: 'Technical Agent', color: 7, at: 'Dexter - Technical Agent',
    tools: ['Dexter Claude Model','Calculator - Dexter','Code Tool - Dexter','QB: Transaction Report - Dexter','QB: Invoices - Dexter','QB: Customers - Dexter','QB: Items/Services - Dexter','QB: Payments - Dexter','QB: Expenses/Purchases - Dexter','HTTP - Housecall Pro (Dexter)','HTTP - Instantly API (Dexter)','Google Drive - Dexter','Airtable - Dexter','SerpApi - Dexter','Slack - Dexter','GitHub Brain - Dexter','Google Docs - Dexter'] }
];

// Helper to move a node
const positioned = new Set();
function pos(name, x, y) {
  const n = wf.nodes.find(nd => nd.name === name);
  if (n) {
    n.position = [x, y];
    positioned.add(name);
  } else {
    console.log('  WARNING: not found: ' + name);
  }
}

// ========== 1. BRAIN / TOOLS ==========
pos('Vizzy Claude Model', 40, 200);
pos('Team Conversation Memory', 240, 200);
pos('Google Calendar Tool', 40, 360);
console.log('Positioned Brain/Tools');

// ========== 2. VIZZY DIRECT TOOLS ==========
const vizzyTools = [
  'Gmail - Vizzy (sales@)', 'Gmail - Vizzy (office@)',
  'Gmail - Vizzy (asons@)', 'Gmail - Vizzy (sonsfamily@)',
  'Google Sheets - Vizzy', 'Google Drive - Vizzy',
  'Slack Tool - Vizzy', 'SerpApi - Vizzy', 'Google Docs - Vizzy'
];
const VDX = 1400;
for (let i = 0; i < vizzyTools.length; i++) {
  const row = i < 5 ? 0 : 1;
  const col = i < 5 ? i : i - 5;
  pos(vizzyTools[i], VDX + col * 240, -660 + row * 160);
}
console.log('Positioned Vizzy Direct Tools');

// ========== 3. PARENT AGENT ==========
pos('Chat Interface', FIRST_X, -40);
pos('Vizzy - Supervisor Agent', FIRST_X + 400, -40);

agents.forEach(function(a, i) {
  var boxX = FIRST_X + i * BOX_STEP;
  pos(a.at, boxX + 170, 200);
});

var extraStart = FIRST_X + agents.length * BOX_STEP;
pos('Airtable Tool', extraStart, 200);
pos('HTTP Request Tool', extraStart + 200, 200);
pos('Workflow Tool', extraStart + 400, 200);
console.log('Positioned Parent Agent');

// ========== 4. AGENT TOOL BOXES ==========
var maxBoxBottom = 0;

agents.forEach(function(agent, i) {
  var boxX = FIRST_X + i * BOX_STEP;
  agent.tools.forEach(function(toolName, ti) {
    var col = ti % 3;
    var row = Math.floor(ti / 3);
    var tx = boxX + TOOL_COLS[col];
    var ty = AGENT_BOX_Y + TOOL_ROW0 + row * TOOL_ROW_H;
    pos(toolName, tx, ty);
    if (ty + 120 > maxBoxBottom) maxBoxBottom = ty + 120;
  });
});
console.log('Positioned agent tools. Max bottom: ' + maxBoxBottom);

// ========== 5. TELEGRAM FLOW ==========
var TG_Y = maxBoxBottom + 200;
var telegramNodes = [
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
telegramNodes.forEach(function(item) {
  pos(item[0], FIRST_X + item[1], TG_Y + item[2]);
});
pos('Slack Telegram Log', FIRST_X + 2240, TG_Y + 200);
console.log('Positioned Telegram Flow at y=' + TG_Y);

// ========== 6. CHECK UNPOSITIONED ==========
var unpositioned = wf.nodes.filter(function(n) { return !positioned.has(n.name); });
if (unpositioned.length > 0) {
  console.log('\nUNPOSITIONED (' + unpositioned.length + '):');
  unpositioned.forEach(function(n) {
    console.log('  ' + n.name + ' [' + n.position + '] ' + n.type);
  });
}

// ========== 7. STICKY NOTES ==========
var stickyId = 0;
function addSticky(content, x, y, w, h, color) {
  stickyId++;
  wf.nodes.push({
    parameters: { content: content, height: h, width: w, color: color },
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: [x, y],
    id: 'sticky-' + stickyId,
    name: 'Sticky Note ' + stickyId
  });
}

// Brain/Tools
addSticky('## Brain / Tools\nClaude Model + Memory + Calendar', 0, 140, 460, 300, 7);

// Vizzy Direct Tools
addSticky('## Vizzy Direct Tools\nGmail (4 accts) + Sheets + Drive + Docs + Slack + SerpApi',
  VDX - 60, -720, 5 * 240 + 100, 380, 3);

// Parent Agent
var parentW = extraStart + 600 - FIRST_X + 120;
addSticky('# Parent Agent \u2014 Vizzy Supervisor\nRoutes tasks to 11 specialized sub-agents',
  FIRST_X - 60, -120, parentW, 420, 2);

// Individual agent boxes
agents.forEach(function(agent, i) {
  var boxX = FIRST_X + i * BOX_STEP;
  var rows = Math.ceil(agent.tools.length / 3);
  var boxH = TOOL_ROW0 + rows * TOOL_ROW_H + 40;
  addSticky('# ' + agent.key + '\n' + agent.label,
    boxX - 10, AGENT_BOX_Y - 20, BOX_W + 20, boxH, agent.color);
});

// Telegram Flow
addSticky('## Telegram Input Flow\nTrigger \u2192 Extract \u2192 Voice/Text \u2192 Transcribe \u2192 Format \u2192 Reply',
  FIRST_X - 60, TG_Y - 200, 2820, 520, 3);

console.log('\nAdded ' + stickyId + ' sticky notes');
console.log('Total nodes: ' + wf.nodes.length);

// ========== 8. WRITE OUTPUT ==========
var putBody = {
  name: 'Autonomous Agent Team Task Handler',
  nodes: wf.nodes,
  connections: wf.connections,
  settings: { executionOrder: 'v1' }
};
fs.writeFileSync(process.env.HOME + '/n8n_workflow_final.json', JSON.stringify(putBody));
console.log('Wrote n8n_workflow_final.json (' + (fs.statSync(process.env.HOME + '/n8n_workflow_final.json').size / 1024).toFixed(1) + ' KB)');
