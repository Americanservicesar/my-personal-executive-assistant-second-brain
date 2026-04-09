const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_gmail.json';

function api(method, path, bodyFile) {
  const h = `-H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json"`;
  const d = bodyFile ? `-d @"${bodyFile}"` : '';
  return JSON.parse(execSync(`curl -s -X ${method} "${BASE}${path}" ${h} ${d}`, { maxBuffer: 10*1024*1024, timeout: 60000 }).toString());
}

// ========== PART 1: Swap Scouty to GPT 4.1 Mini ==========
console.log('=== Swapping Scouty model ===');
const scoutyWf = api('GET', '/workflows/KYkM8ymQybnit3Gb');
const scoutyModelIdx = scoutyWf.nodes.findIndex(n => n.name === 'Scouty Claude Model');
if (scoutyModelIdx >= 0) {
  const old = scoutyWf.nodes[scoutyModelIdx];
  const newName = 'Scouty GPT 4.1 Mini';
  scoutyWf.nodes[scoutyModelIdx] = {
    parameters: { model: { __rl: true, value: 'gpt-4.1-mini', mode: 'list', cachedResultName: 'gpt-4.1-mini' }, options: {} },
    id: old.id, name: newName,
    type: '@n8n/n8n-nodes-langchain.lmChatOpenAi', typeVersion: 1.2,
    position: old.position,
    credentials: { openAiApi: { id: 'fMfNln3kzNasVG9K', name: 'OpenAi account' } }
  };
  if (scoutyWf.connections['Scouty Claude Model']) {
    scoutyWf.connections[newName] = scoutyWf.connections['Scouty Claude Model'];
    delete scoutyWf.connections['Scouty Claude Model'];
  }
  fs.writeFileSync(TMP, JSON.stringify({ name: scoutyWf.name, nodes: scoutyWf.nodes, connections: scoutyWf.connections, settings: { executionOrder: 'v1' } }));
  const r = api('PUT', '/workflows/KYkM8ymQybnit3Gb', TMP);
  console.log(r.id ? '  SUCCESS: Scouty now on GPT 4.1 Mini' : '  FAILED: ' + JSON.stringify(r).substring(0,300));
}

// ========== PART 2: Break out Gmail tools ==========
// Agents with Gmail and their workflow IDs
const gmailAgents = [
  { name: 'Milli', wfId: 'BJ8RLrbjuZ8pSmAL', gmailNode: 'Gmail Tool - Milli', agentNode: 'Milli Agent' },
  { name: 'Penn', wfId: 'cwyGNdgiCABHwVa3', gmailNode: 'Gmail Tool - Penn', agentNode: 'Penn Agent' },
  { name: 'Emmie', wfId: 'Cxb4JDBsMF8fvRqP', gmailNode: 'Gmail Tool - Emmie', agentNode: 'Emmie Agent' },
  { name: 'Soshie', wfId: 'W3aE7gdjj2CTapyG', gmailNode: 'Gmail Tool - Soshie', agentNode: 'Soshie Agent' },
  { name: 'Cassie', wfId: 'X9OndKjPk1rspj5l', gmailNode: 'Gmail Tool - Cassie', agentNode: 'Cassie Agent' },
  { name: 'Gigi', wfId: 'TKCDLwYceeA0tCix', gmailNode: 'Gmail Tool - Gigi', agentNode: 'Gigi Agent' }
];

// 7 individual Gmail tool definitions (matching reference workflow pattern)
function makeGmailTools(prefix, creds, startPos) {
  const tools = [
    {
      name: 'Send Email - ' + prefix,
      params: {
        sendTo: "={{ $fromAI('emailAddress', 'Recipient email address', 'string') }}",
        subject: "={{ $fromAI('subject', 'Email subject line', 'string') }}",
        message: "={{ $fromAI('emailBody', 'Email body in HTML format', 'string') }}",
        options: { appendAttribution: false }
      }
    },
    {
      name: 'Get Emails - ' + prefix,
      params: {
        operation: 'getAll',
        limit: "={{ $fromAI('limit', 'How many emails to retrieve', 'number') }}",
        simple: false,
        filters: { sender: "={{ $fromAI('sender', 'Filter by sender email address', 'string') }}" },
        options: {}
      }
    },
    {
      name: 'Create Draft - ' + prefix,
      params: {
        resource: 'draft',
        subject: "={{ $fromAI('subject', 'Email subject line', 'string') }}",
        emailType: 'html',
        message: "={{ $fromAI('emailBody', 'Email body in HTML format', 'string') }}",
        options: {
          sendTo: "={{ $fromAI('emailAddress', 'Recipient email address', 'string') }}"
        }
      }
    },
    {
      name: 'Email Reply - ' + prefix,
      params: {
        operation: 'reply',
        messageId: "={{ $fromAI('messageId', 'The ID of the message to reply to', 'string') }}",
        message: "={{ $fromAI('emailBody', 'Reply body in HTML format', 'string') }}",
        options: { appendAttribution: false }
      }
    },
    {
      name: 'Get Labels - ' + prefix,
      params: {
        resource: 'label',
        returnAll: true
      }
    },
    {
      name: 'Label Emails - ' + prefix,
      params: {
        operation: 'addLabels',
        messageId: "={{ $fromAI('messageId', 'The ID of the message to label', 'string') }}",
        labelIds: "={{ $fromAI('labelId', 'The label ID to apply', 'string') }}"
      }
    },
    {
      name: 'Mark Unread - ' + prefix,
      params: {
        operation: 'markAsUnread',
        messageId: "={{ $fromAI('messageId', 'The ID of the message to mark unread', 'string') }}"
      }
    }
  ];

  return tools.map((t, i) => ({
    parameters: t.params,
    id: prefix.toLowerCase().replace(/\s/g,'') + '-gmail-' + i,
    name: t.name,
    type: 'n8n-nodes-base.gmailTool',
    typeVersion: 2.1,
    position: [startPos[0] + (i % 4) * 190, startPos[1] + Math.floor(i / 4) * 160],
    credentials: creds
  }));
}

for (const agent of gmailAgents) {
  console.log('\n=== ' + agent.name + ' Gmail breakout ===');

  const wf = api('GET', '/workflows/' + agent.wfId);
  console.log('  Fetched: ' + wf.nodes.length + ' nodes');

  // Find existing Gmail tool and its credentials
  const gmailIdx = wf.nodes.findIndex(n => n.name === agent.gmailNode);
  if (gmailIdx < 0) { console.log('  SKIP: Gmail tool not found'); continue; }

  const oldGmail = wf.nodes[gmailIdx];
  const gmailCreds = oldGmail.credentials;
  const oldPos = oldGmail.position;
  console.log('  Found: ' + oldGmail.name + ' creds: ' + JSON.stringify(gmailCreds));

  // Remove old Gmail tool
  wf.nodes.splice(gmailIdx, 1);
  delete wf.connections[agent.gmailNode];

  // Create 7 individual Gmail tools
  const newTools = makeGmailTools(agent.name, gmailCreds, [oldPos[0] - 90, oldPos[1]]);
  wf.nodes.push(...newTools);

  // Connect each new tool to agent node
  for (const tool of newTools) {
    wf.connections[tool.name] = {
      ai_tool: [[{ node: agent.agentNode, type: 'ai_tool', index: 0 }]]
    };
  }

  console.log('  Added ' + newTools.length + ' Gmail tools: ' + newTools.map(t => t.name.split(' - ')[0]).join(', '));

  // Update sticky note height if exists (more tools now)
  const toolsSticky = wf.nodes.find(n => n.type === 'n8n-nodes-base.stickyNote' && n.parameters.content === '## Tools');
  if (toolsSticky) {
    const nonStickyTools = wf.nodes.filter(n =>
      n.type !== 'n8n-nodes-base.stickyNote' &&
      n.name !== 'When Executed by Another Workflow' &&
      n.name !== agent.agentNode &&
      !n.name.includes('GPT 4.1') &&
      !n.name.includes('Claude Model')
    );
    toolsSticky.parameters.height = Math.ceil(nonStickyTools.length / 3) * 160 + 80;
  }

  // Push update
  fs.writeFileSync(TMP, JSON.stringify({ name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: { executionOrder: 'v1' } }));
  const result = api('PUT', '/workflows/' + agent.wfId, TMP);

  if (result.id) {
    const gmailTools = result.nodes.filter(n => n.type === 'n8n-nodes-base.gmailTool');
    console.log('  SUCCESS! Gmail tools: ' + gmailTools.length + ', total nodes: ' + result.nodes.length);
  } else {
    console.log('  FAILED: ' + JSON.stringify(result).substring(0, 500));
  }
}

try { fs.unlinkSync(TMP); } catch(e) {}

console.log('\n=== COMPLETE ===');
console.log('Scouty: swapped to GPT 4.1 Mini');
console.log('Gmail breakout: Milli, Penn, Emmie, Soshie, Cassie, Gigi');
console.log('Each now has: Send Email, Get Emails, Create Draft, Email Reply, Get Labels, Label Emails, Mark Unread');
