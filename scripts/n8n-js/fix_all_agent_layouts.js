const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_agent.json';

function api(method, path, bodyFile) {
  const h = `-H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json"`;
  const d = bodyFile ? `-d @"${bodyFile}"` : '';
  return JSON.parse(execSync(`curl -s -X ${method} "${BASE}${path}" ${h} ${d}`, { maxBuffer: 10*1024*1024, timeout: 60000 }).toString());
}

const COL = 200;
const ROW = 160;

const agents = [
  { wfId: 'cwyGNdgiCABHwVa3', name: 'Penn', sub: 'Copywriter', model: 'Claude Sonnet 4.6', outerColor: 5,
    agentNode: 'Penn Agent', modelNode: 'Penn Claude Model',
    gmailTools: ['Send Email - Penn','Get Emails - Penn','Create Draft - Penn','Email Reply - Penn','Get Labels - Penn','Label Emails - Penn','Mark Unread - Penn'],
    otherTools: ['Web Search - Penn','SerpApi - Penn','Google Drive - Penn','Google Docs - Penn','Google Sheets - Penn','Slack - Penn','GitHub Brain - Penn'] },

  { wfId: 'Cxb4JDBsMF8fvRqP', name: 'Emmie', sub: 'Email Marketing', model: 'GPT 4.1 Mini', outerColor: 6,
    agentNode: 'Emmie Agent', modelNode: 'Emmie GPT 4.1 Mini',
    gmailTools: ['Send Email - Emmie','Get Emails - Emmie','Create Draft - Emmie','Email Reply - Emmie','Get Labels - Emmie','Label Emails - Emmie','Mark Unread - Emmie'],
    otherTools: ['HTTP - Instantly API (Emmie)','Google Sheets - Emmie','Google Drive - Emmie','SerpApi - Emmie','Airtable - Emmie','Slack - Emmie','GitHub Brain - Emmie'] },

  { wfId: 'W3aE7gdjj2CTapyG', name: 'Soshie', sub: 'Social Media', model: 'GPT 4.1 Mini', outerColor: 1,
    agentNode: 'Soshie Agent', modelNode: 'Soshie GPT 4.1 Mini',
    gmailTools: ['Send Email - Soshie','Get Emails - Soshie','Create Draft - Soshie','Email Reply - Soshie','Get Labels - Soshie','Label Emails - Soshie','Mark Unread - Soshie'],
    otherTools: ['Slack Tool - Soshie','Google Sheets - Soshie','Google Drive - Soshie','SerpApi - Soshie','GitHub Brain - Soshie','HTTP - Facebook Post (Soshie)'] },

  { wfId: 'Qa4j2OFzxmbPMpug', name: 'Buddy', sub: 'Business Development', model: 'Claude Sonnet 4.6', outerColor: 2,
    agentNode: 'Buddy Agent', modelNode: 'Buddy Claude Model',
    gmailTools: [],
    otherTools: ['Web Search - Buddy','Google Calendar - Buddy','Google Sheets - Buddy','Google Drive - Buddy','Google Docs - Buddy','Airtable - Buddy','Slack - Buddy','GitHub Brain - Buddy','SerpApi - Buddy'] },

  { wfId: 'X9OndKjPk1rspj5l', name: 'Cassie', sub: 'Customer Support', model: 'GPT 4.1 Mini', outerColor: 3,
    agentNode: 'Cassie Agent', modelNode: 'Cassie GPT 4.1 Mini',
    gmailTools: ['Send Email - Cassie','Get Emails - Cassie','Create Draft - Cassie','Email Reply - Cassie','Get Labels - Cassie','Label Emails - Cassie','Mark Unread - Cassie'],
    otherTools: ['Web Search - Cassie','HTTP - Housecall Pro (Cassie)','Google Sheets - Cassie','Google Drive - Cassie','Airtable - Cassie','Slack - Cassie','GitHub Brain - Cassie'] },

  { wfId: 'nygXpDVV5Lmn77hX', name: 'Seomi', sub: 'SEO Specialist', model: 'Claude Sonnet 4.6', outerColor: 4,
    agentNode: 'Seomi Agent', modelNode: 'Seomi Claude Model',
    gmailTools: [],
    otherTools: ['Web Search - Seomi','SerpApi - Seomi','Google Sheets - Seomi','Google Drive - Seomi','Google Docs - Seomi','Airtable - Seomi','Slack - Seomi','GitHub Brain - Seomi','HTTP - Bing Webmaster (Seomi)','HTTP - Moz API (Seomi)','HTTP - Broken Link Checker (Seomi)','HTTP - WordPress (Seomi)','HTTP - PageSpeed Insights (Seomi)','HTTP - RankMath API (Seomi)'] },

  { wfId: 'KYkM8ymQybnit3Gb', name: 'Scouty', sub: 'Competitive Analysis', model: 'GPT 4.1 Mini', outerColor: 5,
    agentNode: 'Scouty Agent', modelNode: 'Scouty GPT 4.1 Mini',
    gmailTools: [],
    otherTools: ['Web Search - Scouty','Google Calendar - Scouty','Google Sheets - Scouty','Google Drive - Scouty','Google Docs - Scouty','SerpApi - Scouty','Airtable - Scouty','Slack - Scouty','GitHub Brain - Scouty','HTTP - Housecall Pro (Scouty)'] },

  { wfId: 'TKCDLwYceeA0tCix', name: 'Gigi', sub: 'Google Workspace', model: 'GPT 4.1 Mini', outerColor: 6,
    agentNode: 'Gigi Agent', modelNode: 'Gigi GPT 4.1 Mini',
    gmailTools: ['Send Email - Gigi','Get Emails - Gigi','Create Draft - Gigi','Email Reply - Gigi','Get Labels - Gigi','Label Emails - Gigi','Mark Unread - Gigi'],
    otherTools: ['Google Sheets - Gigi','Google Drive - Gigi','Google Docs - Gigi','SerpApi - Gigi','Slack - Gigi','GitHub Brain - Gigi'] },

  { wfId: '8v3B7RqpkH9ltMvm', name: 'Commet', sub: 'Data Analysis', model: 'Claude Sonnet 4.6', outerColor: 1,
    agentNode: 'Commet Agent', modelNode: 'Commet Claude Model',
    gmailTools: [],
    otherTools: ['Google Sheets - Commet','Web Search - Commet','Google Drive - Commet','Google Docs - Commet','HTTP - Housecall Pro (Commet)','Airtable - Commet','Slack - Commet','GitHub Brain - Commet','HTTP - WordPress (Commet)'] },

  { wfId: 'bT5En2FMmvXhIiDl', name: 'Dexter', sub: 'Technical', model: 'Claude Sonnet 4.6', outerColor: 7,
    agentNode: 'Dexter Agent', modelNode: 'Dexter Claude Model',
    gmailTools: [],
    otherTools: ['Calculator - Dexter','Code Tool - Dexter','QB: Transaction Report - Dexter','QB: Invoices - Dexter','QB: Customers - Dexter','QB: Items/Services - Dexter','QB: Payments - Dexter','QB: Expenses/Purchases - Dexter','HTTP - Housecall Pro (Dexter)','HTTP - Instantly API (Dexter)','Google Drive - Dexter','Airtable - Dexter','SerpApi - Dexter','Slack - Dexter','GitHub Brain - Dexter','Google Docs - Dexter'] }
];

for (const agent of agents) {
  console.log('\n=== ' + agent.name + ' ===');

  const wf = api('GET', '/workflows/' + agent.wfId);
  wf.nodes = wf.nodes.filter(n => n.type !== 'n8n-nodes-base.stickyNote');
  console.log('  Functional nodes:', wf.nodes.length);

  function pos(name, x, y) {
    const n = wf.nodes.find(nd => nd.name === name);
    if (n) { n.position = [x, y]; return true; }
    console.log('  WARN: ' + name + ' not found');
    return false;
  }

  let sid = 0;
  function sticky(content, x, y, w, h, color) {
    sid++;
    wf.nodes.push({
      parameters: { content, height: h, width: w, color },
      type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
      position: [x, y], id: agent.name.toLowerCase() + '-s' + sid, name: 'Sticky Note ' + sid
    });
  }

  // --- Main flow ---
  pos('When Executed by Another Workflow', 80, 80);
  pos(agent.agentNode, 480, 80);

  // --- Brain ---
  pos(agent.modelNode, 80, 300);

  // --- Gmail Tools ---
  let nextY = 500;
  if (agent.gmailTools.length > 0) {
    agent.gmailTools.forEach((name, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      pos(name, 80 + col * COL, nextY + row * ROW);
    });
    const gmailRows = Math.ceil(agent.gmailTools.length / 4);
    sticky('## Gmail Tools', 40, nextY - 60, 4 * COL + 40, gmailRows * ROW + 80, 6);
    nextY += gmailRows * ROW + 100;
  }

  // --- Other Tools ---
  agent.otherTools.forEach((name, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    pos(name, 80 + col * COL, nextY + row * ROW);
  });
  const otherRows = Math.ceil(agent.otherTools.length / 4);
  sticky('## Other Tools', 40, nextY - 60, 4 * COL + 40, otherRows * ROW + 80, 3);
  nextY += otherRows * ROW + 60;

  // --- Brain box ---
  sticky('## Brain', 40, 240, 300, 160, 7);

  // --- Outer box ---
  sticky('# ' + agent.name + ' \u2014 ' + agent.sub + '\n' + agent.model + ' \u00B7 Standalone agent workflow',
    20, 10, 4 * COL + 100, nextY, agent.outerColor);

  // --- Push ---
  fs.writeFileSync(TMP, JSON.stringify({
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: { executionOrder: 'v1' }
  }));
  const result = api('PUT', '/workflows/' + agent.wfId, TMP);
  if (result.id) {
    const stickies = result.nodes.filter(n => n.type === 'n8n-nodes-base.stickyNote');
    console.log('  SUCCESS! Nodes:', result.nodes.length, 'Stickies:', stickies.length);
  } else {
    console.log('  FAILED:', JSON.stringify(result).substring(0, 500));
  }
}

try { fs.unlinkSync(TMP); } catch(e) {}
console.log('\n=== ALL 10 AGENTS DONE ===');
