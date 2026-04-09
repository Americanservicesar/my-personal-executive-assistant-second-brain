const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync(process.env.HOME + '/workflow.json', 'utf8'));

// Extract FULL details for every agent
const agents = {};

// 1. Get Vizzy (main agent)
for (const n of data.nodes) {
  if (n.name === 'Vizzy - Supervisor Agent') {
    agents['Vizzy'] = {
      nodeName: n.name,
      nodeType: n.type,
      nodeId: n.id,
      role: 'Supervisor Agent & AI Operations Orchestrator',
      systemMessage: (n.parameters.options || {}).systemMessage || n.parameters.text || '',
      description: n.parameters.description || '',
      toolDescription: n.parameters.toolDescription || '',
      tools: [],
      credentials: n.credentials || {},
      position: n.position
    };
  }
}

// 2. Get all sub-agents
for (const n of data.nodes) {
  if (n.type === '@n8n/n8n-nodes-langchain.agentTool') {
    const p = n.parameters || {};
    const shortName = n.name.split(' - ')[0].trim();
    agents[shortName] = {
      nodeName: n.name,
      nodeType: n.type,
      nodeId: n.id,
      role: n.name.split(' - ')[1] || '',
      systemMessage: (p.options || {}).systemMessage || '',
      description: p.description || '',
      toolDescription: p.toolDescription || '',
      text: p.text || '',
      tools: [],
      credentials: n.credentials || {},
      position: n.position
    };
  }
}

// 3. Map tool connections
const conns = data.connections || {};
for (const [src, connData] of Object.entries(conns)) {
  if (connData && connData.ai_tool) {
    for (const outputList of connData.ai_tool) {
      for (const c of outputList) {
        for (const [agentKey, agentData] of Object.entries(agents)) {
          if (agentData.nodeName === c.node) {
            const srcNode = data.nodes.find(n => n.name === src);
            if (srcNode) {
              agents[agentKey].tools.push({
                name: src,
                type: srcNode.type,
                id: srcNode.id,
                credentials: srcNode.credentials || {},
                toolDescription: (srcNode.parameters || {}).toolDescription || '',
                url: (srcNode.parameters || {}).url || ''
              });
            }
          }
        }
      }
    }
  }
}

// 4. Get model nodes
for (const [src, connData] of Object.entries(conns)) {
  if (connData && connData.ai_languageModel) {
    for (const outputList of connData.ai_languageModel) {
      for (const c of outputList) {
        for (const [agentKey, agentData] of Object.entries(agents)) {
          if (agentData.nodeName === c.node) {
            const srcNode = data.nodes.find(n => n.name === src);
            if (srcNode) {
              const rawModel = (srcNode.parameters || {}).model || 'unknown';
              const modelStr = (typeof rawModel === 'object' && rawModel.value) ? rawModel.value : String(rawModel);
              agents[agentKey].model = {
                name: src,
                modelId: modelStr,
                credentials: srcNode.credentials || {}
              };
            }
          }
        }
      }
    }
  }
}

// Generate markdown for each agent
const outputDir = process.env.HOME + '/.claude/projects/C--Users-sales--claude/memory/agents';
try { fs.mkdirSync(outputDir, { recursive: true }); } catch(e) {}

const agentOrder = ['Vizzy','Milli','Penn','Emmie','Soshie','Buddy','Cassie','Seomi','Scouty','Gigi','Commet','Dexter'];
const agentNumbers = {'Vizzy':1,'Milli':2,'Penn':3,'Emmie':4,'Soshie':5,'Buddy':6,'Cassie':7,'Seomi':8,'Scouty':9,'Gigi':10,'Commet':11,'Dexter':12};

for (const name of agentOrder) {
  const a = agents[name];
  if (!a) { console.log('SKIP:', name); continue; }

  // Build tool list
  const toolLines = a.tools.map(t => {
    const credKeys = Object.keys(t.credentials || {});
    const credInfo = credKeys.length > 0
      ? credKeys.map(k => `${k}: ${t.credentials[k].id}`).join(', ')
      : 'no credential (API key in params)';
    return `| ${t.name} | ${t.type.split('.').pop()} | ${t.id.substring(0,12)}... | ${credInfo} |`;
  });

  // Build credential summary
  const allCreds = {};
  for (const t of a.tools) {
    if (t.credentials) {
      for (const [type, cred] of Object.entries(t.credentials)) {
        allCreds[type] = cred;
      }
    }
  }
  if (a.model && a.model.credentials) {
    for (const [type, cred] of Object.entries(a.model.credentials)) {
      allCreds[type] = cred;
    }
  }

  const credLines = Object.entries(allCreds).map(([type, cred]) =>
    `| ${type} | ${cred.id} | ${cred.name} |`
  );

  const md = `---
name: Agent ${agentNumbers[name]} - ${name}
role: ${a.role}
node_name: ${a.nodeName}
node_type: ${a.nodeType}
node_id: ${a.nodeId}
workflow_id: JAYrzGWR8A0tCBzB
model: ${a.model ? a.model.modelId : 'inherited from parent'}
tool_count: ${a.tools.length}
system_message_chars: ${a.systemMessage.length}
last_synced: 2026-04-05
---

# ${name} — ${a.role}

**Agent #${agentNumbers[name]}** in the ASAR Autonomous Agent Team
**Workflow**: ASAR - Autonomous Agent Team Task Handler (JAYrzGWR8A0tCBzB)
**Model**: ${a.model ? a.model.modelId + ' (' + a.model.name + ')' : 'Claude (inherited)'}
**Node ID**: ${a.nodeId}

## Tool Description (what Vizzy sees)
${a.toolDescription || 'N/A — this is the supervisor agent'}

## System Message (${a.systemMessage.length} chars)

\`\`\`
${a.systemMessage}
\`\`\`

## Connected Tools (${a.tools.length})

| Tool Name | Type | Node ID | Credentials |
|-----------|------|---------|-------------|
${toolLines.join('\n')}

## Credentials Used

| Credential Type | ID | Name |
|----------------|-----|------|
${credLines.join('\n')}

## Position in Canvas
x: ${a.position ? a.position[0] : 'N/A'}, y: ${a.position ? a.position[1] : 'N/A'}
`;

  const filename = `agent_${String(agentNumbers[name]).padStart(2,'0')}_${name.toLowerCase()}.md`;
  fs.writeFileSync(path.join(outputDir, filename), md);
  console.log('Created:', filename, '(' + md.length + ' chars)');
}

// Also save the raw JSON
fs.writeFileSync(process.env.HOME + '/agent_details.json', JSON.stringify(agents, null, 2));
console.log('\nAll agent files created in:', outputDir);
console.log('Raw JSON saved to:', process.env.HOME + '/agent_details.json');
