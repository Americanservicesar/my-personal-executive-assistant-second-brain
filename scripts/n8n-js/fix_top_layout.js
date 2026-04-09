const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE = 'https://americanservicesar.app.n8n.cloud/api/v1';
const HOME = process.env.HOME || process.env.USERPROFILE;
const TMP = HOME + '/n8n_tmp_top.json';
const VIZZY_ID = 'JAYrzGWR8A0tCBzB';

function api(method, path, bodyFile) {
  const h = `-H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json"`;
  const d = bodyFile ? `-d @"${bodyFile}"` : '';
  return JSON.parse(execSync(`curl -s -X ${method} "${BASE}${path}" ${h} ${d}`, { maxBuffer: 10*1024*1024, timeout: 60000 }).toString());
}

console.log('Fetching Vizzy...');
const wf = api('GET', '/workflows/' + VIZZY_ID);

// Only remove stickies for the TOP zones (not agent boxes)
// Find and remove: Vizzy Direct Tools, Brain / Tools, Parent Agent, Telegram stickies
const topStickyLabels = ['Vizzy Direct', 'Brain / Tools', 'Parent Agent', 'Telegram'];
wf.nodes = wf.nodes.filter(n => {
  if (n.type !== 'n8n-nodes-base.stickyNote') return true;
  const c = n.parameters.content || '';
  return !topStickyLabels.some(l => c.includes(l));
});
console.log('Nodes after removing top stickies:', wf.nodes.length);

function pos(name, x, y) {
  const n = wf.nodes.find(nd => nd.name === name);
  if (n) n.position = [x, y];
  else console.log('WARN: ' + name);
}

let sid = 100; // offset to avoid ID conflicts with agent stickies
function sticky(content, x, y, w, h, color) {
  sid++;
  wf.nodes.push({
    parameters: { content, height: h, width: w, color },
    type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
    position: [x, y], id: 'top-sticky-' + sid, name: 'Top Sticky ' + sid
  });
}

// =====================================================
// NEW TOP LAYOUT
// =====================================================
// Zone 1: y = -680 to -180  → Brain & Direct Tools (combined)
// Zone 2: y = -100 to  320  → Parent Agent (Telegram flow + Vizzy Supervisor)
//                              Matches reference "Parent Agent" box pattern
// Zone 3: y = 380+          → Agent boxes (unchanged)
// =====================================================

// === ZONE 1: Combined Brain & Direct Tools ===
// Row 1: Claude Model, Memory, Calendar
// Row 2: Gmail x4, Google Sheets
// Row 3: Google Drive, Google Docs, Slack, SerpApi
const BDX = 100, BDY = -640;

pos('Vizzy Claude Model',       BDX + 40,  BDY + 60);
pos('Team Conversation Memory',  BDX + 240, BDY + 60);
pos('Google Calendar Tool',      BDX + 440, BDY + 60);

pos('Gmail - Vizzy (sales@)',    BDX + 40,  BDY + 220);
pos('Gmail - Vizzy (office@)',   BDX + 240, BDY + 220);
pos('Gmail - Vizzy (asons@)',    BDX + 440, BDY + 220);
pos('Gmail - Vizzy (sonsfamily@)', BDX + 640, BDY + 220);
pos('Google Sheets - Vizzy',     BDX + 840, BDY + 220);

pos('Google Drive - Vizzy',      BDX + 40,  BDY + 380);
pos('Google Docs - Vizzy',       BDX + 240, BDY + 380);
pos('Slack Tool - Vizzy',        BDX + 440, BDY + 380);
pos('SerpApi - Vizzy',           BDX + 640, BDY + 380);

sticky('## Brain & Direct Tools\nClaude Model + Memory + Calendar + Gmail (4) + Sheets + Drive + Docs + Slack + SerpApi',
  BDX, BDY, 1060, 480, 7);

// === ZONE 2: Parent Agent (like reference) ===
// Contains: Chat Interface, Telegram flow, Vizzy Supervisor, Response, Slack logs
// Layout: horizontal flow, voice branch above, Vizzy in the middle
const PAX = 100, PAY = -100;

// Row 1 (main flow): Telegram → Extract → IsVoice → Merge → Format → Vizzy → Reply → SlackActivity
pos('Chat Interface',            PAX + 40,   PAY + 40);
pos('Telegram Trigger',          PAX + 40,   PAY + 200);
pos('Extract Telegram Input',    PAX + 320,  PAY + 200);
pos('Is Voice Message?',         PAX + 600,  PAY + 200);
pos('Merge Telegram Input',      PAX + 1160, PAY + 200);
pos('Format for Vizzy',          PAX + 1440, PAY + 200);
pos('Vizzy - Supervisor Agent',  PAX + 1720, PAY + 120);
pos('Send Telegram Reply',       PAX + 2000, PAY + 200);
pos('Slack Agent Activity',      PAX + 2280, PAY + 200);

// Row 0 (voice branch): Get Voice → Transcribe → Set Text
pos('Get Voice File',            PAX + 600,  PAY + 40);
pos('Transcribe Voice',          PAX + 880,  PAY + 40);
pos('Set Transcribed Text',      PAX + 1160, PAY + 40);

// Row 2 (logs)
pos('Slack Telegram Log',        PAX + 2000, PAY + 360);

// Extra tools near Vizzy
pos('Airtable Tool',             PAX + 2000, PAY + 40);
pos('HTTP Request Tool',         PAX + 2200, PAY + 40);
pos('Workflow Tool',             PAX + 2400, PAY + 40);

sticky('# Parent Agent\nTelegram \u2192 Extract \u2192 Voice/Text \u2192 Vizzy Supervisor \u2192 Reply',
  PAX, PAY - 20, 2620, 440, 2);

// === Verify zone gaps ===
const zone1_bottom = BDY + 480;      // -640 + 480 = -160
const zone2_top = PAY - 20;           // -120
const gap1 = zone2_top - zone1_bottom;

// Agent boxes start at y=360 (from previous layout)
const zone2_bottom = PAY - 20 + 440; // -120 + 440 = 320
const zone3_top = 360;               // agent boxes
const gap2 = zone3_top - zone2_bottom;

console.log('Zone 1 (Brain+Tools): y=' + BDY + ' to ' + zone1_bottom);
console.log('Zone 2 (Parent Agent): y=' + (PAY-20) + ' to ' + zone2_bottom);
console.log('Gap zone1→zone2:', gap1 + 'px');
console.log('Gap zone2→agents:', gap2 + 'px');

// ========== Push ==========
console.log('\nTotal nodes:', wf.nodes.length);
fs.writeFileSync(TMP, JSON.stringify({
  name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: { executionOrder: 'v1' }
}));
const result = api('PUT', '/workflows/' + VIZZY_ID, TMP);
if (result.id) {
  console.log('SUCCESS! Nodes:', result.nodes.length);
  // Verify top stickies
  result.nodes.filter(n => n.type === 'n8n-nodes-base.stickyNote' && n.id && n.id.startsWith('top-')).forEach(s => {
    const c = s.parameters.content.split('\n')[0];
    console.log('  ' + c.padEnd(35) + '[' + s.position + '] ' + s.parameters.width + 'x' + s.parameters.height);
  });
} else {
  console.log('FAILED:', JSON.stringify(result).substring(0, 500));
}
try { fs.unlinkSync(TMP); } catch(e) {}
