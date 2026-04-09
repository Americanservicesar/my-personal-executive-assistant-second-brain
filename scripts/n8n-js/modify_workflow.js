const fs = require('fs');
const wf = JSON.parse(fs.readFileSync(process.env.HOME + '/n8n_workflow.json', 'utf8'));

// ========== 1. Replace Transcribe Voice ==========
const tvIdx = wf.nodes.findIndex(n => n.name === 'Transcribe Voice');
if (tvIdx >= 0) {
  const old = wf.nodes[tvIdx];
  wf.nodes[tvIdx] = {
    parameters: {
      resource: "audio",
      operation: "transcribe",
      options: {}
    },
    id: old.id,
    name: "Transcribe Voice",
    type: "@n8n/n8n-nodes-langchain.openAi",
    typeVersion: 1.6,
    position: old.position,
    credentials: {
      openAi: {
        id: "gSobsSdPmjOQnEBr",
        name: "OpenAi account"
      }
    }
  };
  console.log('Replaced Transcribe Voice with OpenAI node');
} else {
  console.log('WARNING: Transcribe Voice node not found');
}

// ========== 2. Add Sticky Notes ==========
const stickies = [
  // --- Brain/Tools ---
  {
    parameters: { content: "## Brain / Tools\nClaude Model, Conversation Memory, Google Calendar", height: 340, width: 580, color: 7 },
    type: "n8n-nodes-base.stickyNote", typeVersion: 1,
    position: [148, 148], id: "sticky-brain-tools", name: "Sticky Note - Brain Tools"
  },
  // --- Parent Agent ---
  {
    parameters: { content: "# Parent Agent — Vizzy Supervisor\nRoutes tasks to specialized sub-agents", height: 340, width: 3800, color: 2 },
    type: "n8n-nodes-base.stickyNote", typeVersion: 1,
    position: [540, -80], id: "sticky-parent-agent", name: "Sticky Note - Parent Agent"
  },
  // --- Vizzy Direct Tools ---
  {
    parameters: { content: "## Vizzy Direct Tools\nGmail (4 accts), Google Sheets, Drive, Docs, Slack, SerpApi", height: 440, width: 3100, color: 3 },
    type: "n8n-nodes-base.stickyNote", typeVersion: 1,
    position: [1180, -740], id: "sticky-vizzy-tools", name: "Sticky Note - Vizzy Tools"
  },
  // --- Telegram Input Flow ---
  {
    parameters: { content: "## Telegram Input Flow\nTrigger → Extract → Voice/Text Switch → Transcribe → Merge → Format → Reply", height: 500, width: 2900, color: 3 },
    type: "n8n-nodes-base.stickyNote", typeVersion: 1,
    position: [360, 1200], id: "sticky-telegram", name: "Sticky Note - Telegram Flow"
  },

  // === Individual Agent Tool Boxes ===

  // Milli - Marketing (red/pink = 4)
  {
    parameters: { content: "# Milli\nMarketing Agent", height: 980, width: 720, color: 4 },
    type: "n8n-nodes-base.stickyNote", typeVersion: 1,
    position: [560, 360], id: "sticky-milli", name: "Sticky Note - Milli"
  },
  // Penn - Writing (orange = 5)
  {
    parameters: { content: "# Penn\nWriting Agent", height: 520, width: 640, color: 5 },
    type: "n8n-nodes-base.stickyNote", typeVersion: 1,
    position: [900, 360], id: "sticky-penn", name: "Sticky Note - Penn"
  },
  // Emmie - Email (purple = 6)
  {
    parameters: { content: "# Emmie\nEmail Agent", height: 700, width: 780, color: 6 },
    type: "n8n-nodes-base.stickyNote", typeVersion: 1,
    position: [1120, 360], id: "sticky-emmie", name: "Sticky Note - Emmie"
  },
  // Soshie - Social Media (yellow = 1)
  {
    parameters: { content: "# Soshie\nSocial Media Agent", height: 700, width: 520, color: 1 },
    type: "n8n-nodes-base.stickyNote", typeVersion: 1,
    position: [1400, 360], id: "sticky-soshie", name: "Sticky Note - Soshie"
  },
  // Buddy - Research (green = 2)
  {
    parameters: { content: "# Buddy\nResearch Agent", height: 700, width: 580, color: 2 },
    type: "n8n-nodes-base.stickyNote", typeVersion: 1,
    position: [1700, 360], id: "sticky-buddy", name: "Sticky Note - Buddy"
  },
  // Cassie - Customer Service (blue = 3)
  {
    parameters: { content: "# Cassie\nCustomer Service Agent", height: 700, width: 560, color: 3 },
    type: "n8n-nodes-base.stickyNote", typeVersion: 1,
    position: [1980, 360], id: "sticky-cassie", name: "Sticky Note - Cassie"
  },
  // Seomi - SEO (red/pink = 4)
  {
    parameters: { content: "# Seomi\nSEO Agent", height: 700, width: 760, color: 4 },
    type: "n8n-nodes-base.stickyNote", typeVersion: 1,
    position: [2260, 360], id: "sticky-seomi", name: "Sticky Note - Seomi"
  },
  // Scouty - Competitive Analysis (orange = 5)
  {
    parameters: { content: "# Scouty\nCompetitive Analysis Agent", height: 1260, width: 580, color: 5 },
    type: "n8n-nodes-base.stickyNote", typeVersion: 1,
    position: [2560, 360], id: "sticky-scouty", name: "Sticky Note - Scouty"
  },
  // Gigi - Google Workspace (purple = 6)
  {
    parameters: { content: "# Gigi\nGoogle Workspace Agent", height: 500, width: 540, color: 6 },
    type: "n8n-nodes-base.stickyNote", typeVersion: 1,
    position: [2768, 1520], id: "sticky-gigi", name: "Sticky Note - Gigi"
  },
  // Commet - Data Analysis (yellow = 1)
  {
    parameters: { content: "# Commet\nData Analysis Agent", height: 500, width: 540, color: 1 },
    type: "n8n-nodes-base.stickyNote", typeVersion: 1,
    position: [2960, 1520], id: "sticky-commet", name: "Sticky Note - Commet"
  },
  // Dexter - Technical (dark purple = 7)
  {
    parameters: { content: "# Dexter\nTechnical Agent", height: 700, width: 1680, color: 7 },
    type: "n8n-nodes-base.stickyNote", typeVersion: 1,
    position: [3160, 360], id: "sticky-dexter", name: "Sticky Note - Dexter"
  }
];

wf.nodes.push(...stickies);
console.log('Added ' + stickies.length + ' sticky notes');
console.log('Total nodes: ' + wf.nodes.length);

// ========== 3. Write modified workflow ==========
// Build the PUT body
const putBody = {
  nodes: wf.nodes,
  connections: wf.connections,
  settings: wf.settings
};

fs.writeFileSync(process.env.HOME + '/n8n_workflow_modified.json', JSON.stringify(putBody));
console.log('Wrote modified workflow to n8n_workflow_modified.json');
console.log('File size: ' + (fs.statSync(process.env.HOME + '/n8n_workflow_modified.json').size / 1024).toFixed(1) + ' KB');
