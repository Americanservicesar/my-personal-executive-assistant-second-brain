const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const VIZZY_ID = 'JAYrzGWR8A0tCBzB';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_body.json';

function api(method, path, bodyFile) {
  const h = `-H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json"`;
  const d = bodyFile ? `-d @"${bodyFile}"` : '';
  const cmd = `curl -s -X ${method} "${BASE}${path}" ${h} ${d}`;
  return JSON.parse(execSync(cmd, { maxBuffer: 10*1024*1024, timeout: 60000 }).toString());
}

// Agent definitions: [atName, emoji+label, toolNames[]]
const AGENTS = [
  ['Penn - Writing Agent', 'Penn - Copywriter', [
    'Penn Claude Model','Gmail Tool - Penn','Web Search - Penn','SerpApi - Penn',
    'Google Drive - Penn','Google Docs - Penn','Google Sheets - Penn','Slack - Penn','GitHub Brain - Penn']],
  ['Emmie - Email Agent', 'Emmie - Email Marketing', [
    'Emmie Claude Model','Gmail Tool - Emmie','HTTP - Instantly API (Emmie)',
    'Google Sheets - Emmie','Google Drive - Emmie','SerpApi - Emmie',
    'Airtable - Emmie','Slack - Emmie','GitHub Brain - Emmie']],
  ['Soshie - Social Media Agent', 'Soshie - Social Media', [
    'Soshie Claude Model','Slack Tool - Soshie','Gmail Tool - Soshie',
    'Google Sheets - Soshie','Google Drive - Soshie','SerpApi - Soshie',
    'GitHub Brain - Soshie','HTTP - Facebook Post (Soshie)']],
  ['Buddy - Research Agent', 'Buddy - Business Development', [
    'Buddy Claude Model','Web Search - Buddy','Google Calendar - Buddy',
    'Google Sheets - Buddy','Google Drive - Buddy','Google Docs - Buddy',
    'Airtable - Buddy','Slack - Buddy','GitHub Brain - Buddy','SerpApi - Buddy']],
  ['Cassie - Customer Service Agent', 'Cassie - Customer Support', [
    'Cassie Claude Model','Gmail Tool - Cassie','Web Search - Cassie',
    'HTTP - Housecall Pro (Cassie)','Google Sheets - Cassie','Google Drive - Cassie',
    'Airtable - Cassie','Slack - Cassie','GitHub Brain - Cassie']],
  ['Seomi - SEO Agent', 'Seomi - SEO Specialist', [
    'Seomi Claude Model','Web Search - Seomi','SerpApi - Seomi',
    'Google Sheets - Seomi','Google Drive - Seomi','Google Docs - Seomi',
    'Airtable - Seomi','Slack - Seomi','GitHub Brain - Seomi',
    'HTTP - Bing Webmaster (Seomi)','HTTP - Moz API (Seomi)',
    'HTTP - Broken Link Checker (Seomi)','HTTP - WordPress (Seomi)',
    'HTTP - PageSpeed Insights (Seomi)','HTTP - RankMath API (Seomi)']],
  ['Scouty - Competitive Analysis Agent', 'Scouty - Competitive Analysis', [
    'Scouty Claude Model','Web Search - Scouty','Google Calendar - Scouty',
    'Google Sheets - Scouty','Google Drive - Scouty','Google Docs - Scouty',
    'SerpApi - Scouty','Airtable - Scouty','Slack - Scouty',
    'GitHub Brain - Scouty','HTTP - Housecall Pro (Scouty)']],
  ['Gigi - Google Workspace Agent', 'Gigi - Google Workspace', [
    'Gigi Claude Model','Google Sheets - Gigi','Gmail Tool - Gigi',
    'Google Drive - Gigi','Google Docs - Gigi','SerpApi - Gigi',
    'Slack - Gigi','GitHub Brain - Gigi']],
  ['Commet - Data Analysis Agent', 'Commet - Data Analysis', [
    'Commet Claude Model','Google Sheets - Commet','Web Search - Commet',
    'Google Drive - Commet','Google Docs - Commet','HTTP - Housecall Pro (Commet)',
    'Airtable - Commet','Slack - Commet','GitHub Brain - Commet','HTTP - WordPress (Commet)']],
  ['Dexter - Technical Agent', 'Dexter - Technical', [
    'Dexter Claude Model','Calculator - Dexter','Code Tool - Dexter',
    'QB: Transaction Report - Dexter','QB: Invoices - Dexter',
    'QB: Customers - Dexter','QB: Items/Services - Dexter',
    'QB: Payments - Dexter','QB: Expenses/Purchases - Dexter',
    'HTTP - Housecall Pro (Dexter)','HTTP - Instantly API (Dexter)',
    'Google Drive - Dexter','Airtable - Dexter','SerpApi - Dexter',
    'Slack - Dexter','GitHub Brain - Dexter','Google Docs - Dexter']]
];

// Fetch Vizzy once
console.log('Fetching Vizzy workflow...');
let vizzy = api('GET', '/workflows/' + VIZZY_ID);
console.log('Starting with ' + vizzy.nodes.length + ' nodes\n');

const results = [];

for (const [atName, label, toolNames] of AGENTS) {
  const shortName = label.split(' - ')[0]; // e.g. "Penn"
  console.log('=== ' + shortName + ' ===');

  // Find the agentTool node
  const agentTool = vizzy.nodes.find(n => n.name === atName);
  if (!agentTool) { console.log('  SKIP: agentTool not found'); continue; }

  // Extract tool nodes
  const toolNodes = [];
  for (const tn of toolNames) {
    const n = vizzy.nodes.find(nd => nd.name === tn);
    if (n) toolNodes.push(JSON.parse(JSON.stringify(n)));
    else console.log('  WARNING: ' + tn + ' not found');
  }

  // Build standalone workflow
  const modelName = shortName + ' Claude Model';
  const modelNode = toolNodes.find(n => n.name === modelName);
  const tools = toolNodes.filter(n => n.name !== modelName);

  const agentNodeName = shortName + ' Agent';
  const triggerName = 'When Executed by Another Workflow';

  // Position nodes
  if (modelNode) modelNode.position = [200, 200];
  tools.forEach((t, i) => {
    t.position = [40 + (i % 3) * 200, 400 + Math.floor(i / 3) * 160];
  });

  const nodes = [
    { parameters: {}, id: shortName.toLowerCase() + '-trigger', name: triggerName,
      type: 'n8n-nodes-base.executeWorkflowTrigger', typeVersion: 1.1, position: [0, 0] },
    { parameters: { promptType: 'define', text: '={{ $json.query }}',
        options: { systemMessage: agentTool.parameters.options.systemMessage } },
      id: shortName.toLowerCase() + '-agent', name: agentNodeName,
      type: '@n8n/n8n-nodes-langchain.agent', typeVersion: 1.7,
      position: [400, 0], onError: 'continueErrorOutput' },
    ...toolNodes,
    { parameters: { content: '# ' + label.replace(' - ', ' \u2014 ') + '\nStandalone agent called by Vizzy',
        height: 200, width: 620, color: 4 },
      type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
      position: [-40, -140], id: shortName.toLowerCase() + '-s1', name: 'Sticky Note' },
    { parameters: { content: '## Tools', height: Math.ceil(tools.length / 3) * 160 + 80, width: 620, color: 4 },
      type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
      position: [0, 340], id: shortName.toLowerCase() + '-s2', name: 'Sticky Note Tools' }
  ];

  const connections = {};
  connections[triggerName] = { main: [[{ node: agentNodeName, type: 'main', index: 0 }]] };
  if (modelNode) {
    connections[modelName] = { ai_languageModel: [[{ node: agentNodeName, type: 'ai_languageModel', index: 0 }]] };
  }
  for (const t of tools) {
    connections[t.name] = { ai_tool: [[{ node: agentNodeName, type: 'ai_tool', index: 0 }]] };
  }

  const wfBody = {
    name: '\uD83E\uDD16 ' + label,
    nodes: nodes,
    connections: connections,
    settings: { executionOrder: 'v1' }
  };

  // Create standalone workflow
  fs.writeFileSync(TMP, JSON.stringify(wfBody));
  const created = api('POST', '/workflows', TMP);
  if (!created.id) {
    console.log('  FAILED to create: ' + JSON.stringify(created).substring(0, 200));
    continue;
  }
  console.log('  Created: ' + created.id + ' (' + created.nodes.length + ' nodes)');

  // Remove old nodes from Vizzy
  const removeSet = new Set([atName, ...toolNames]);
  vizzy.nodes = vizzy.nodes.filter(n => !removeSet.has(n.name));

  // Add toolWorkflow node
  const newToolName = shortName + ' - ' + label.split(' - ')[1];
  vizzy.nodes.push({
    parameters: {
      name: shortName,
      description: agentTool.parameters.toolDescription,
      workflowId: { __rl: true, value: created.id, mode: 'list', cachedResultName: created.name },
      workflowInputs: { mappingMode: 'defineBelow', value: {}, matchingColumns: [], schema: [],
        attemptToConvertTypes: false, convertFieldsToString: false }
    },
    id: agentTool.id,
    name: newToolName,
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2,
    position: agentTool.position
  });

  // Fix connections
  for (const tn of toolNames) delete vizzy.connections[tn];
  delete vizzy.connections[atName];
  vizzy.connections[newToolName] = {
    ai_tool: [[{ node: 'Vizzy - Supervisor Agent', type: 'ai_tool', index: 0 }]]
  };

  // Update sticky note if exists
  const sticky = vizzy.nodes.find(n =>
    n.type === 'n8n-nodes-base.stickyNote' && n.parameters.content && n.parameters.content.includes(shortName)
  );
  if (sticky) {
    sticky.parameters.content = '# ' + shortName + '\n' + label.split(' - ')[1] + '\n\u2192 Separate workflow';
    sticky.parameters.height = 200;
  }

  results.push({ name: shortName, wfId: created.id, nodes: created.nodes.length, toolName: newToolName });
  console.log('  Vizzy nodes remaining: ' + vizzy.nodes.length);
}

// Push final Vizzy update
console.log('\n=== Updating Vizzy workflow ===');
const putBody = {
  name: vizzy.name,
  nodes: vizzy.nodes,
  connections: vizzy.connections,
  settings: { executionOrder: 'v1' }
};
fs.writeFileSync(TMP, JSON.stringify(putBody));
const result = api('PUT', '/workflows/' + VIZZY_ID, TMP);

if (result.id) {
  console.log('SUCCESS! Vizzy updated. Final nodes: ' + result.nodes.length);
  console.log('\n=== SUMMARY ===');
  console.log('Agent'.padEnd(12) + 'Workflow ID'.padEnd(20) + 'Nodes');
  for (const r of results) {
    console.log(r.name.padEnd(12) + r.wfId.padEnd(20) + r.nodes);
  }

  // Verify all toolWorkflow connections
  const twTools = result.nodes.filter(n => n.type === '@n8n/n8n-nodes-langchain.toolWorkflow');
  console.log('\ntoolWorkflow nodes in Vizzy: ' + twTools.length);
  twTools.forEach(t => console.log('  ' + t.name + ' -> ' + t.parameters.workflowId.value));

  // Check for any leftover agentTool nodes
  const leftoverAT = result.nodes.filter(n => n.type === '@n8n/n8n-nodes-langchain.agentTool');
  if (leftoverAT.length > 0) {
    console.log('\nWARNING: leftover agentTool nodes:');
    leftoverAT.forEach(n => console.log('  ' + n.name));
  } else {
    console.log('\nAll agents migrated to standalone workflows!');
  }
} else {
  console.error('FAILED:', JSON.stringify(result).substring(0, 1000));
}

// Cleanup
try { fs.unlinkSync(TMP); } catch(e) {}
