const fs = require('fs');
const https = require('https');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const HOST = 'americanservicesar.app.n8n.cloud';
const VIZZY_WF_ID = 'JAYrzGWR8A0tCBzB';

function apiCall(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST, path, method,
      headers: { 'X-N8N-API-KEY': API_KEY, 'Content-Type': 'application/json', 'Accept': 'application/json' }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { resolve(data); } });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  // ========== STEP 1: Fetch current Vizzy workflow ==========
  console.log('Fetching Vizzy workflow...');
  const vizzy = await apiCall('GET', '/api/v1/workflows/' + VIZZY_WF_ID);
  if (!vizzy.nodes) { console.error('Failed to fetch:', JSON.stringify(vizzy).substring(0,300)); return; }
  console.log('Got ' + vizzy.nodes.length + ' nodes');

  // ========== STEP 2: Extract Milli's config ==========
  const milliAT = vizzy.nodes.find(n => n.name === 'Milli - Marketing Agent');
  const milliToolNames = [
    'Milli Claude Model', 'Gmail Tool - Milli', 'Web Search - Milli',
    'Google Calendar - Milli', 'Google Sheets - Milli', 'Google Drive - Milli',
    'QuickBooks - Milli', 'Airtable - Milli', 'Slack - Milli',
    'SerpApi - Milli', 'HTTP - Housecall Pro (Milli)',
    'HTTP - GutterGlove (Milli)', 'GitHub Brain - Milli'
  ];

  // Get full node objects for all Milli tools
  const milliToolNodes = [];
  for (const name of milliToolNames) {
    const n = vizzy.nodes.find(nd => nd.name === name);
    if (n) milliToolNodes.push(JSON.parse(JSON.stringify(n))); // deep copy
    else console.log('WARNING: tool not found: ' + name);
  }
  console.log('Extracted ' + milliToolNodes.length + ' Milli tool nodes');

  // ========== STEP 3: Build standalone Milli workflow ==========
  // Layout: Trigger at [0,0] → Agent at [400,0], tools below
  const triggerNode = {
    parameters: {},
    id: 'milli-trigger',
    name: 'When Executed by Another Workflow',
    type: 'n8n-nodes-base.executeWorkflowTrigger',
    typeVersion: 1.1,
    position: [0, 0]
  };

  // Agent node with Milli's system prompt
  const agentNode = {
    parameters: {
      promptType: 'define',
      text: '={{ $json.query }}',
      options: {
        systemMessage: milliAT.parameters.options.systemMessage
      }
    },
    id: 'milli-agent',
    name: 'Milli Agent',
    type: '@n8n/n8n-nodes-langchain.agent',
    typeVersion: 1.7,
    position: [400, 0],
    onError: 'continueErrorOutput'
  };

  // Reposition tool nodes in a clean grid inside the new workflow
  const modelNode = milliToolNodes.find(n => n.name === 'Milli Claude Model');
  const tools = milliToolNodes.filter(n => n.name !== 'Milli Claude Model');

  // Model below agent
  if (modelNode) modelNode.position = [200, 200];

  // Tools in 3 columns
  tools.forEach((t, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    t.position = [40 + col * 200, 400 + row * 160];
  });

  const allNodes = [triggerNode, agentNode, ...milliToolNodes];

  // Build connections
  const connections = {
    'When Executed by Another Workflow': {
      main: [[{ node: 'Milli Agent', type: 'main', index: 0 }]]
    }
  };

  // Model → Agent (ai_languageModel)
  if (modelNode) {
    connections['Milli Claude Model'] = {
      ai_languageModel: [[{ node: 'Milli Agent', type: 'ai_languageModel', index: 0 }]]
    };
  }

  // Each tool → Agent (ai_tool)
  for (const tool of tools) {
    connections[tool.name] = {
      ai_tool: [[{ node: 'Milli Agent', type: 'ai_tool', index: 0 }]]
    };
  }

  // Add sticky notes
  allNodes.push({
    parameters: { content: '# Milli \u2014 Sales Manager\nStandalone agent workflow called by Vizzy Supervisor', height: 200, width: 600, color: 4 },
    type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
    position: [-40, -120], id: 'milli-sticky', name: 'Sticky Note'
  });
  allNodes.push({
    parameters: { content: '## Tools', height: Math.ceil(tools.length / 3) * 160 + 80, width: 620, color: 4 },
    type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
    position: [0, 340], id: 'milli-tools-sticky', name: 'Sticky Note Tools'
  });

  const milliWorkflow = {
    name: '\uD83E\uDD16 Milli - Sales Manager',
    nodes: allNodes,
    connections: connections,
    settings: { executionOrder: 'v1' }
  };

  // ========== STEP 4: Create the standalone workflow ==========
  console.log('Creating standalone Milli workflow...');
  const created = await apiCall('POST', '/api/v1/workflows', milliWorkflow);
  if (!created.id) {
    console.error('Failed to create workflow:', JSON.stringify(created).substring(0, 1000));
    return;
  }
  console.log('Created workflow: ' + created.id + ' (' + created.name + ')');
  console.log('Nodes in new workflow: ' + created.nodes.length);

  // ========== STEP 5: Update Vizzy workflow ==========
  console.log('\nUpdating Vizzy workflow...');

  // Remove Milli agentTool + all her tool nodes
  const removeNames = new Set(['Milli - Marketing Agent', ...milliToolNames]);
  vizzy.nodes = vizzy.nodes.filter(n => !removeNames.has(n.name));
  console.log('Removed ' + removeNames.size + ' Milli nodes. Remaining: ' + vizzy.nodes.length);

  // Add toolWorkflow node for Milli
  const milliWorkflowTool = {
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
    id: milliAT.id, // reuse ID to preserve any UI state
    name: 'Milli - Sales Manager',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2,
    position: milliAT.position // keep same position in layout
  };
  vizzy.nodes.push(milliWorkflowTool);

  // Fix connections: remove all old Milli tool connections, add new one
  // Remove connections FROM Milli tools to Milli agentTool
  for (const toolName of milliToolNames) {
    delete vizzy.connections[toolName];
  }
  // Remove connection FROM Milli agentTool to Vizzy
  delete vizzy.connections['Milli - Marketing Agent'];

  // Add connection FROM new Milli toolWorkflow to Vizzy
  vizzy.connections['Milli - Sales Manager'] = {
    ai_tool: [[{ node: 'Vizzy - Supervisor Agent', type: 'ai_tool', index: 0 }]]
  };

  // Update sticky note for Milli (if exists, resize since it's now just 1 node)
  const milliSticky = vizzy.nodes.find(n => n.type === 'n8n-nodes-base.stickyNote' && n.parameters.content.includes('Milli'));
  if (milliSticky) {
    milliSticky.parameters.content = '# Milli\nSales Manager\n\u2192 Separate workflow';
    milliSticky.parameters.height = 200;
  }

  // Push update
  const putBody = {
    name: vizzy.name,
    nodes: vizzy.nodes,
    connections: vizzy.connections,
    settings: { executionOrder: 'v1' }
  };

  const result = await apiCall('PUT', '/api/v1/workflows/' + VIZZY_WF_ID, putBody);
  if (result.id) {
    console.log('SUCCESS! Vizzy workflow updated.');
    console.log('Total nodes: ' + result.nodes.length);
    const mwt = result.nodes.find(n => n.name === 'Milli - Sales Manager');
    if (mwt) console.log('Milli toolWorkflow: type=' + mwt.type + ' workflow=' + mwt.parameters.workflowId.value);

    // Verify no orphaned Milli nodes
    const milliLeftover = result.nodes.filter(n => n.name.includes('Milli') && n.name !== 'Milli - Sales Manager' && !n.name.includes('Sticky'));
    if (milliLeftover.length > 0) {
      console.log('WARNING: leftover Milli nodes:');
      milliLeftover.forEach(n => console.log('  ' + n.name));
    } else {
      console.log('All Milli inline nodes removed successfully');
    }
  } else {
    console.error('Update failed:', JSON.stringify(result).substring(0, 1000));
  }
}

main().catch(console.error);
