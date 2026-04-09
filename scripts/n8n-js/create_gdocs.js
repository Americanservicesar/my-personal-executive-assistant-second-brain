const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// We'll use the Google Workspace MCP's createDocument indirectly through a sequential approach
// But since MCP calls aren't available from Node, we'll prepare the content for batch creation

const agentsDir = path.join(process.env.HOME, '.claude/projects/C--Users-sales--claude/memory/agents');
const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md')).sort();

// Output a JSON manifest for the MCP batch
const manifest = [];
for (const file of files) {
  const content = fs.readFileSync(path.join(agentsDir, file), 'utf8');
  // Strip frontmatter
  const stripped = content.replace(/^---[\s\S]*?---\n\n?/, '');
  // Extract title from first heading
  const titleMatch = stripped.match(/^# (.+)/m);
  const title = titleMatch ? 'ASAR Agent - ' + titleMatch[1].split('—')[0].trim() : file;

  manifest.push({
    file: file,
    title: title,
    contentLength: stripped.length,
    contentPreview: stripped.substring(0, 100)
  });
}

console.log('Prepared', manifest.length, 'docs for creation:\n');
manifest.forEach((m, i) => console.log((i+1) + '.', m.title, '(' + m.contentLength + ' chars)'));

// Save manifest
fs.writeFileSync(process.env.HOME + '/gdoc_manifest.json', JSON.stringify(manifest, null, 2));
console.log('\nManifest saved. Use MCP createDocument for each.');
