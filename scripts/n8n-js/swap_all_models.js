const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_models.json';
const OPENAI_CRED = { openAiApi: { id: 'fMfNln3kzNasVG9K', name: 'OpenAi account' } };

console.log('Fetching Vizzy...');
const wf = JSON.parse(execSync(`curl -s --max-time 30 "${BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: ${API_KEY}"`, { maxBuffer: 10*1024*1024 }).toString());
console.log('Nodes:', wf.nodes.length);

// Model assignments
// Tier 1: GPT 4.1 — Vizzy (already done), Penn
// Tier 2: GPT 4.1 Mini — Seomi, Buddy, Commet, Dexter, Milli (already), Scouty (already)
// Tier 3: GPT 4.1 Nano — Emmie, Soshie, Cassie, Gigi

const swaps = [
  // Tier 1: GPT 4.1
  { find: 'Penn Claude Model', newName: 'Penn GPT 4.1', model: 'gpt-4.1' },
  // Tier 2: GPT 4.1 Mini (swap the remaining Anthropic ones)
  { find: 'Seomi Claude Model', newName: 'Seomi GPT 4.1 Mini', model: 'gpt-4.1-mini' },
  { find: 'Buddy Claude Model', newName: 'Buddy GPT 4.1 Mini', model: 'gpt-4.1-mini' },
  { find: 'Commet Claude Model', newName: 'Commet GPT 4.1 Mini', model: 'gpt-4.1-mini' },
  { find: 'Dexter Claude Model', newName: 'Dexter GPT 4.1 Mini', model: 'gpt-4.1-mini' },
  // Tier 3: GPT 4.1 Nano (swap from 4.1 Mini)
  { find: 'Emmie GPT 4.1 Mini', newName: 'Emmie GPT 4.1 Nano', model: 'gpt-4.1-nano' },
  { find: 'Soshie GPT 4.1 Mini', newName: 'Soshie GPT 4.1 Nano', model: 'gpt-4.1-nano' },
  { find: 'Cassie GPT 4.1 Mini', newName: 'Cassie GPT 4.1 Nano', model: 'gpt-4.1-nano' },
  { find: 'Gigi GPT 4.1 Mini', newName: 'Gigi GPT 4.1 Nano', model: 'gpt-4.1-nano' }
];

for (const swap of swaps) {
  const idx = wf.nodes.findIndex(n => n.name === swap.find);
  if (idx < 0) {
    console.log('SKIP: ' + swap.find + ' not found');
    continue;
  }
  const old = wf.nodes[idx];
  wf.nodes[idx] = {
    parameters: {
      model: { __rl: true, value: swap.model, mode: 'list', cachedResultName: swap.model },
      options: {}
    },
    id: old.id,
    name: swap.newName,
    type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
    typeVersion: 1.2,
    position: old.position,
    credentials: OPENAI_CRED
  };

  // Fix connections
  if (wf.connections[swap.find]) {
    wf.connections[swap.newName] = wf.connections[swap.find];
    delete wf.connections[swap.find];
  }

  console.log(swap.find.padEnd(30) + ' -> ' + swap.newName.padEnd(25) + ' (' + swap.model + ')');
}

// Push
fs.writeFileSync(TMP, JSON.stringify({
  name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: { executionOrder: 'v1' }
}));
const result = JSON.parse(execSync(`curl -s --max-time 30 -X PUT "${BASE}/workflows/JAYrzGWR8A0tCBzB" -H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json" -d @"${TMP}"`, { maxBuffer: 10*1024*1024 }).toString());

if (result.id) {
  console.log('\nSUCCESS! Nodes:', result.nodes.length);
  console.log('\n=== FINAL MODEL ASSIGNMENTS ===');
  const models = result.nodes.filter(n => n.type.includes('lmChat'));
  models.forEach(m => {
    const model = m.parameters.model ? m.parameters.model.value : '?';
    const tier = model === 'gpt-4.1' ? 'TIER 1' : model === 'gpt-4.1-mini' ? 'TIER 2' : model === 'gpt-4.1-nano' ? 'TIER 3' : '?';
    console.log('  ' + tier.padEnd(8) + m.name.padEnd(30) + model);
  });
} else {
  console.log('FAILED:', JSON.stringify(result).substring(0, 500));
}
try { fs.unlinkSync(TMP); } catch(e) {}
