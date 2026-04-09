const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const VIZZY_WF_ID = 'JAYrzGWR8A0tCBzB';
const HOME = process.env.HOME || process.env.USERPROFILE;

function curlGet(path) {
  const out = execSync(`curl -s "${BASE}${path}" -H "X-N8N-API-KEY: ${API_KEY}"`, { maxBuffer: 10*1024*1024 });
  return JSON.parse(out.toString());
}

function curlPost(path, bodyFile) {
  const out = execSync(`curl -s -X POST "${BASE}${path}" -H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json" -d @"${bodyFile}"`, { maxBuffer: 10*1024*1024, timeout: 30000 });
  return JSON.parse(out.toString());
}

function curlPut(path, bodyFile) {
  const out = execSync(`curl -s -X PUT "${BASE}${path}" -H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json" -d @"${bodyFile}"`, { maxBuffer: 10*1024*1024, timeout: 30000 });
  return JSON.parse(out.toString());
}

// ========== STEP 1: Fetch current Vizzy workflow ==========
console.log('Fetching Vizzy workflow...');
const vizzy = curlGet('/workflows/' + VIZZY_WF_ID);
console.log('Got ' + vizzy.nodes.length + ' nodes');

// ========== STEP 2: Extract Milli config ==========
const milliAT = vizzy.nodes.find(n => n.name === 'Milli - Marketing Agent');
const milliToolNames = [
  'Milli Claude Model', 'Gmail Tool - Milli', 'Web Search - Milli',
  'Google Calendar - Milli', 'Google Sheets - Milli', 'Google Drive - Milli',
  'QuickBooks - Milli', 'Airtable - Milli', 'Slack - Milli',
  'SerpApi - Milli', 'HTTP - Housecall Pro (Milli)',
  'HTTP - GutterGlove (Milli)', 'GitHub Brain - Milli'
];

const milliToolNodes = [];
for (const name of milliToolNames) {
  const n = vizzy.nodes.find(nd => nd.name === name);
  if (n) milliToolNodes.push(JSON.parse(JSON.stringify(n)));
  else console.log('WARNING: not found: ' + name);
}
console.log('Extracted ' + milliToolNodes.length + ' Milli tool nodes');

// ========== STEP 3: Build standalone Milli workflow ==========
const triggerNode = {
  parameters: {},
  id: 'milli-trigger-001',
  name: 'When Executed by Another Workflow',
  type: 'n8n-nodes-base.executeWorkflowTrigger',
  typeVersion: 1.1,
  position: [0, 0]
};

const agentNode = {
  parameters: {
    promptType: 'define',
    text: '={{ $json.query }}',
    options: {
      systemMessage: milliAT.parameters.options.systemMessage
    }
  },
  id: 'milli-agent-001',
  name: 'Milli Agent',
  type: '@n8n/n8n-nodes-langchain.agent',
  typeVersion: 1.7,
  position: [400, 0],
  onError: 'continueErrorOutput'
};

// Reposition tools cleanly
const modelNode = milliToolNodes.find(n => n.name === 'Milli Claude Model');
const toolsOnly = milliToolNodes.filter(n => n.name !== 'Milli Claude Model');

if (modelNode) modelNode.position = [200, 200];
toolsOnly.forEach((t, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  t.position = [40 + col * 200, 400 + row * 160];
});

const allNodes = [triggerNode, agentNode, ...milliToolNodes];

// Sticky notes
allNodes.push({
  parameters: { content: '# Milli \u2014 Sales Manager\nStandalone agent called by Vizzy', height: 200, width: 620, color: 4 },
  type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
  position: [-40, -140], id: 'milli-sticky-001', name: 'Sticky Note'
});
allNodes.push({
  parameters: { content: '## Tools', height: Math.ceil(toolsOnly.length / 3) * 160 + 80, width: 620, color: 4 },
  type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
  position: [0, 340], id: 'milli-tools-sticky-001', name: 'Sticky Note Tools'
});

// Connections
const connections = {};
connections['When Executed by Another Workflow'] = {
  main: [[{ node: 'Milli Agent', type: 'main', index: 0 }]]
};
if (modelNode) {
  connections['Milli Claude Model'] = {
    ai_languageModel: [[{ node: 'Milli Agent', type: 'ai_languageModel', index: 0 }]]
  };
}
for (const tool of toolsOnly) {
  connections[tool.name] = {
    ai_tool: [[{ node: 'Milli Agent', type: 'ai_tool', index: 0 }]]
  };
}

const milliWorkflow = {
  name: '\uD83E\uDD16 Milli - Sales Manager',
  nodes: allNodes,
  connections: connections,
  settings: { executionOrder: 'v1' }
};

// ========== STEP 4: Create standalone workflow ==========
console.log('Creating standalone Milli workflow...');
const milliFile = HOME + '/n8n_milli_standalone.json';
fs.writeFileSync(milliFile, JSON.stringify(milliWorkflow));
const created = curlPost('/workflows', milliFile);
if (!created.id) {
  console.error('Failed to create:', JSON.stringify(created).substring(0, 1000));
  process.exit(1);
}
console.log('Created: ' + created.id + ' (' + created.name + ') with ' + created.nodes.length + ' nodes');

// ========== STEP 5: Update Vizzy workflow ==========
console.log('\nUpdating Vizzy workflow...');

// Remove Milli inline nodes
const removeNames = new Set(['Milli - Marketing Agent', ...milliToolNames]);
vizzy.nodes = vizzy.nodes.filter(n => !removeNames.has(n.name));
console.log('Removed ' + removeNames.size + ' Milli nodes. Remaining: ' + vizzy.nodes.length);

// Add toolWorkflow node
vizzy.nodes.push({
  parameters: {
    name: 'Milli',
    description: milliAT.parameters.toolDescription,
    workflowId: {
      __rl: true,
      value: created.id,
      mode: 'list',
      cachedResultName: created.name
    },
    workflowInputs: {
      mappingMode: 'defineBelow',
      value: {},
      matchingColumns: [],
      schema: [],
      attemptToConvertTypes: false,
      convertFieldsToString: false
    }
  },
  id: milliAT.id,
  name: 'Milli - Sales Manager',
  type: '@n8n/n8n-nodes-langchain.toolWorkflow',
  typeVersion: 2,
  position: milliAT.position
});

// Fix connections
for (const toolName of milliToolNames) {
  delete vizzy.connections[toolName];
}
delete vizzy.connections['Milli - Marketing Agent'];
vizzy.connections['Milli - Sales Manager'] = {
  ai_tool: [[{ node: 'Vizzy - Supervisor Agent', type: 'ai_tool', index: 0 }]]
};

// Update Milli sticky note
const milliSticky = vizzy.nodes.find(n =>
  n.type === 'n8n-nodes-base.stickyNote' && n.parameters.content && n.parameters.content.includes('Milli')
);
if (milliSticky) {
  milliSticky.parameters.content = '# Milli\nSales Manager\n\u2192 Separate workflow';
  milliSticky.parameters.height = 200;
}

// Write and push
const putBody = {
  name: vizzy.name,
  nodes: vizzy.nodes,
  connections: vizzy.connections,
  settings: { executionOrder: 'v1' }
};
const vizzyFile = HOME + '/n8n_vizzy_updated.json';
fs.writeFileSync(vizzyFile, JSON.stringify(putBody));

const result = curlPut('/workflows/' + VIZZY_WF_ID, vizzyFile);
if (result.id) {
  console.log('SUCCESS! Vizzy updated. Nodes: ' + result.nodes.length);
  const mwt = result.nodes.find(n => n.name === 'Milli - Sales Manager');
  if (mwt) console.log('Milli toolWorkflow type: ' + mwt.type + ', calls workflow: ' + mwt.parameters.workflowId.value);

  // Check for leftover Milli nodes
  const leftover = result.nodes.filter(n => milliToolNames.includes(n.name));
  if (leftover.length > 0) {
    console.log('WARNING: leftover Milli tool nodes:');
    leftover.forEach(n => console.log('  ' + n.name));
  } else {
    console.log('All Milli inline nodes removed cleanly');
  }
} else {
  console.error('Update failed:', JSON.stringify(result).substring(0, 1000));
}
