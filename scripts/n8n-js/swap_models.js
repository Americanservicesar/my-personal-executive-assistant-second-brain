const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_swap.json';

function api(method, path, bodyFile) {
  const h = `-H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json"`;
  const d = bodyFile ? `-d @"${bodyFile}"` : '';
  return JSON.parse(execSync(`curl -s -X ${method} "${BASE}${path}" ${h} ${d}`, { maxBuffer: 10*1024*1024, timeout: 60000 }).toString());
}

// First, get the OpenAI credential ID
console.log('Fetching credentials...');
const creds = api('GET', '/credentials');
const openaiCred = creds.data.find(c => c.type === 'openAiApi');
console.log('OpenAI credential:', openaiCred.id, openaiCred.name);

// Agents to swap to GPT 4.1 Mini
const swapAgents = [
  { name: 'Milli', wfId: 'BJ8RLrbjuZ8pSmAL', modelNode: 'Milli Claude Model' },
  { name: 'Emmie', wfId: 'Cxb4JDBsMF8fvRqP', modelNode: 'Emmie Claude Model' },
  { name: 'Soshie', wfId: 'W3aE7gdjj2CTapyG', modelNode: 'Soshie Claude Model' },
  { name: 'Cassie', wfId: 'X9OndKjPk1rspj5l', modelNode: 'Cassie Claude Model' },
  { name: 'Gigi', wfId: 'TKCDLwYceeA0tCix', modelNode: 'Gigi Claude Model' }
];

for (const agent of swapAgents) {
  console.log('\n=== ' + agent.name + ' ===');

  // Fetch workflow
  const wf = api('GET', '/workflows/' + agent.wfId);
  console.log('  Fetched: ' + wf.nodes.length + ' nodes');

  // Find old model node
  const oldModelIdx = wf.nodes.findIndex(n => n.name === agent.modelNode);
  if (oldModelIdx < 0) { console.log('  SKIP: model node not found'); continue; }

  const oldModel = wf.nodes[oldModelIdx];
  console.log('  Old model: ' + oldModel.type + ' (' + (oldModel.parameters.model ? oldModel.parameters.model.value : 'unknown') + ')');

  // Replace with OpenAI GPT 4.1 Mini node
  const newModelName = agent.name + ' GPT 4.1 Mini';
  wf.nodes[oldModelIdx] = {
    parameters: {
      model: { __rl: true, value: 'gpt-4.1-mini', mode: 'list', cachedResultName: 'gpt-4.1-mini' },
      options: {}
    },
    id: oldModel.id,
    name: newModelName,
    type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
    typeVersion: 1.2,
    position: oldModel.position,
    credentials: {
      openAiApi: { id: openaiCred.id, name: openaiCred.name }
    }
  };

  // Fix connections: old model name -> new model name
  if (wf.connections[agent.modelNode]) {
    wf.connections[newModelName] = wf.connections[agent.modelNode];
    delete wf.connections[agent.modelNode];
  }

  console.log('  New model: lmChatOpenAi (gpt-4.1-mini)');

  // Push update
  const putBody = {
    name: wf.name,
    nodes: wf.nodes,
    connections: wf.connections,
    settings: { executionOrder: 'v1' }
  };
  fs.writeFileSync(TMP, JSON.stringify(putBody));
  const result = api('PUT', '/workflows/' + agent.wfId, TMP);

  if (result.id) {
    const newModel = result.nodes.find(n => n.name === newModelName);
    console.log('  SUCCESS! Model: ' + (newModel ? newModel.type.split('.').pop() : '?'));
  } else {
    console.log('  FAILED: ' + JSON.stringify(result).substring(0, 300));
  }
}

// Cleanup
try { fs.unlinkSync(TMP); } catch(e) {}

console.log('\n=== FINAL STATE ===');
console.log('Tier 1 (Claude Sonnet 4.6): Vizzy, Penn, Buddy, Seomi, Scouty, Commet, Dexter');
console.log('Tier 2 (GPT 4.1 Mini):      Milli, Emmie, Soshie, Cassie, Gigi');
