const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_milli_inline.json';
const VIZZY_ID = 'JAYrzGWR8A0tCBzB';
const MILLI_ID = 'BJ8RLrbjuZ8pSmAL';

function api(method, path, bodyFile) {
  const h = `-H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json"`;
  const d = bodyFile ? `-d @"${bodyFile}"` : '';
  return JSON.parse(execSync(`curl -s -X ${method} "${BASE}${path}" ${h} ${d}`, { maxBuffer: 10*1024*1024, timeout: 60000 }).toString());
}

const COL = 200;
const ROW = 160;

// ========== Fetch both workflows ==========
console.log('Fetching Vizzy...');
const vizzy = api('GET', '/workflows/' + VIZZY_ID);
console.log('Vizzy nodes:', vizzy.nodes.length);

console.log('Fetching Milli standalone...');
const milli = api('GET', '/workflows/' + MILLI_ID);
const milliNodes = milli.nodes.filter(n => n.type !== 'n8n-nodes-base.stickyNote');
console.log('Milli functional nodes:', milliNodes.length);

// ========== Get Milli's data from standalone ==========
const milliAgent = milliNodes.find(n => n.name === 'Milli Agent');
const milliModel = milliNodes.find(n => n.name.includes('GPT 4.1'));
const systemMessage = milliAgent.parameters.options.systemMessage;

// Get tool description from the current toolWorkflow node in Vizzy
const milliTW = vizzy.nodes.find(n => n.name === 'Milli - Sales Manager' && n.type === '@n8n/n8n-nodes-langchain.toolWorkflow');
const toolDescription = milliTW ? milliTW.parameters.description : '';
console.log('Tool description:', toolDescription.substring(0, 80) + '...');
console.log('System prompt:', systemMessage.length, 'chars');

// Get all tool nodes (not trigger, not agent, not model)
const milliTools = milliNodes.filter(n =>
  n.name !== 'When Executed by Another Workflow' &&
  n.name !== 'Milli Agent' &&
  n.name !== milliModel.name
);
const gmailTools = milliTools.filter(n => n.type === 'n8n-nodes-base.gmailTool');
const otherTools = milliTools.filter(n => n.type !== 'n8n-nodes-base.gmailTool');
console.log('Gmail tools:', gmailTools.length, 'Other tools:', otherTools.length);

// ========== Remove old Milli toolWorkflow from Vizzy ==========
const milliTWIdx = vizzy.nodes.findIndex(n => n.name === 'Milli - Sales Manager');
const milliTWPos = vizzy.nodes[milliTWIdx].position; // remember position
vizzy.nodes.splice(milliTWIdx, 1);
delete vizzy.connections['Milli - Sales Manager'];
console.log('Removed Milli toolWorkflow node');

// ========== Compute box position ==========
// Place Milli as the first agent box. Use the same x as the old toolWorkflow position.
// The agent boxes are below the parent agent area.
const BOX_X = 100;
const BOX_Y = 500;
const BOX_INNER_X = BOX_X + 60;

// ========== Create agentTool node ==========
const atNode = {
  parameters: {
    toolDescription: toolDescription,
    text: "={{ $fromAI('task', 'The sales task to complete') }}",
    options: { systemMessage }
  },
  id: 'milli-agentTool-inline',
  name: 'Milli - Sales Manager',
  type: '@n8n/n8n-nodes-langchain.agentTool',
  typeVersion: 3,
  position: [BOX_INNER_X, BOX_Y + 60]
};
vizzy.nodes.push(atNode);

// ========== Add model node ==========
const modelCopy = JSON.parse(JSON.stringify(milliModel));
modelCopy.id = 'milli-model-inline';
modelCopy.position = [BOX_INNER_X + 300, BOX_Y + 60];
vizzy.nodes.push(modelCopy);

// ========== Add Gmail tools ==========
let nextY = BOX_Y + 280;
gmailTools.forEach((t, i) => {
  const tc = JSON.parse(JSON.stringify(t));
  tc.id = 'milli-gmail-' + i;
  tc.position = [BOX_INNER_X + (i % 4) * COL, nextY + Math.floor(i / 4) * ROW];
  vizzy.nodes.push(tc);
});
const gmailRows = Math.ceil(gmailTools.length / 4);

// ========== Add Other tools ==========
const otherY = nextY + gmailRows * ROW + 100;
otherTools.forEach((t, i) => {
  const tc = JSON.parse(JSON.stringify(t));
  tc.id = 'milli-tool-' + i;
  tc.position = [BOX_INNER_X + (i % 4) * COL, otherY + Math.floor(i / 4) * ROW];
  vizzy.nodes.push(tc);
});
const otherRows = Math.ceil(otherTools.length / 4);
const boxEndY = otherY + otherRows * ROW + 60;

// ========== Add sticky notes ==========
let sid = 0;
function sticky(content, x, y, w, h, color) {
  sid++;
  vizzy.nodes.push({
    parameters: { content, height: h, width: w, color },
    type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
    position: [x, y], id: 'milli-sticky-' + sid, name: 'Milli Box ' + sid
  });
}

// Outer box
sticky('# Milli \u2014 Sales Manager\nGPT 4.1 Mini \u00B7 Inline agent',
  BOX_X, BOX_Y - 20, 4 * COL + 180, boxEndY - BOX_Y + 40, 4);

// Brain box
sticky('## Brain', BOX_INNER_X - 20, BOX_Y + 180, 540, 130, 7);

// Gmail box
sticky('## Gmail Tools',
  BOX_INNER_X - 20, nextY - 60, 4 * COL + 40, gmailRows * ROW + 80, 6);

// Other tools box
sticky('## Other Tools',
  BOX_INNER_X - 20, otherY - 60, 4 * COL + 40, otherRows * ROW + 80, 3);

// ========== Connections ==========
// agentTool → Vizzy
vizzy.connections['Milli - Sales Manager'] = {
  ai_tool: [[{ node: 'Vizzy - Supervisor Agent', type: 'ai_tool', index: 0 }]]
};

// model → agentTool
vizzy.connections[modelCopy.name] = {
  ai_languageModel: [[{ node: 'Milli - Sales Manager', type: 'ai_languageModel', index: 0 }]]
};

// tools → agentTool
gmailTools.forEach(t => {
  vizzy.connections[t.name] = {
    ai_tool: [[{ node: 'Milli - Sales Manager', type: 'ai_tool', index: 0 }]]
  };
});
otherTools.forEach(t => {
  vizzy.connections[t.name] = {
    ai_tool: [[{ node: 'Milli - Sales Manager', type: 'ai_tool', index: 0 }]]
  };
});

// ========== Push ==========
console.log('\nTotal nodes:', vizzy.nodes.length);
fs.writeFileSync(TMP, JSON.stringify({
  name: vizzy.name, nodes: vizzy.nodes, connections: vizzy.connections, settings: { executionOrder: 'v1' }
}));
const result = api('PUT', '/workflows/' + VIZZY_ID, TMP);
if (result.id) {
  console.log('SUCCESS! Nodes:', result.nodes.length);
  const milliAT = result.nodes.find(n => n.name === 'Milli - Sales Manager');
  console.log('Milli type:', milliAT ? milliAT.type : 'NOT FOUND');
  console.log('Milli position:', milliAT ? JSON.stringify(milliAT.position) : '?');

  // Count tools connected to Milli
  let milliToolCount = 0;
  for (const [from, conns] of Object.entries(result.connections || vizzy.connections)) {
    for (const [type, outputs] of Object.entries(conns)) {
      for (const arr of outputs) for (const c of arr) {
        if (c.node === 'Milli - Sales Manager' && type === 'ai_tool') milliToolCount++;
      }
    }
  }
  console.log('Tools connected to Milli:', milliToolCount);
} else {
  console.log('FAILED:', JSON.stringify(result).substring(0, 1000));
}
try { fs.unlinkSync(TMP); } catch(e) {}
