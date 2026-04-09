const fs = require('fs');
const { execSync } = require('child_process');
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const WF_ID = 'nZzcSNgSDxUengxX';
const BASE = 'https://americanservicesar.app.n8n.cloud';

const wf = JSON.parse(execSync(`curl -s -H "X-N8N-API-KEY: ${API_KEY}" "${BASE}/api/v1/workflows/${WF_ID}"`, { maxBuffer: 50*1024*1024 }).toString());

// The code for the Process Health Data node — careful with $input
const codeStr = [
  'const items = $input.all();',
  '',
  'const sleepItem = items[0]?.json || {};',
  'const hrItem = items[1]?.json || {};',
  'const exerciseItem = items[2]?.json || {};',
  '',
  'const now = new Date();',
  'const y = new Date(now);',
  'y.setDate(y.getDate() - 1);',
  'const dateStr = y.toISOString().split("T")[0];',
  'const dayStr = y.toLocaleDateString("en-US", { weekday: "long" });',
  '',
  'let sleepHours = "—";',
  'let sleepQuality = "—";',
  'try {',
  '  const sessions = sleepItem.session || [];',
  '  let totalMs = 0;',
  '  for (const s of sessions) {',
  '    if (s.activityType === 72) {',
  '      totalMs += parseInt(s.endTimeMillis) - parseInt(s.startTimeMillis);',
  '    }',
  '  }',
  '  if (totalMs > 0) {',
  '    sleepHours = (totalMs / 3600000).toFixed(1);',
  '    const hrs = parseFloat(sleepHours);',
  '    if (hrs >= 7.5) sleepQuality = "8";',
  '    else if (hrs >= 7) sleepQuality = "7";',
  '    else if (hrs >= 6) sleepQuality = "6";',
  '    else if (hrs >= 5) sleepQuality = "4";',
  '    else sleepQuality = "2";',
  '  }',
  '} catch(e) {}',
  '',
  'let avgHR = "—";',
  'let restingHR = "—";',
  'try {',
  '  const buckets = hrItem.bucket || [];',
  '  if (buckets.length > 0) {',
  '    const dataset = buckets[0]?.dataset?.[0];',
  '    if (dataset?.point?.length > 0) {',
  '      let sum = 0, count = 0, min = 999;',
  '      for (const p of dataset.point) {',
  '        for (const v of p.value) {',
  '          if (v.fpVal) { sum += v.fpVal; count++; if (v.fpVal < min) min = v.fpVal; }',
  '        }',
  '      }',
  '      avgHR = count > 0 ? Math.round(sum / count).toString() : "—";',
  '      restingHR = min < 999 ? Math.round(min).toString() : "—";',
  '    }',
  '  }',
  '} catch(e) {}',
  '',
  'let exercise = "None";',
  'try {',
  '  const sessions = exerciseItem.session || [];',
  '  const workouts = sessions.filter(s => s.activityType !== 72 && s.activityType !== 0);',
  '  if (workouts.length > 0) {',
  '    exercise = workouts.map(w => {',
  '      const mins = Math.round((parseInt(w.endTimeMillis) - parseInt(w.startTimeMillis)) / 60000);',
  '      return mins + "min " + (w.name || "workout");',
  '    }).join(", ");',
  '  }',
  '} catch(e) {}',
  '',
  'let energy = "—";',
  'if (sleepHours !== "—") {',
  '  const hrs = parseFloat(sleepHours);',
  '  let score = 5;',
  '  if (hrs >= 7) score += 2; else if (hrs >= 6) score += 1; else score -= 1;',
  '  if (restingHR !== "—") {',
  '    const rhr = parseInt(restingHR);',
  '    if (rhr < 60) score += 1; else if (rhr > 80) score -= 1;',
  '  }',
  '  energy = Math.min(10, Math.max(1, score)).toString();',
  '}',
  '',
  'return [{',
  '  json: {',
  '    Date: dateStr,',
  '    Day: dayStr,',
  '    "Energy (1-10)": energy,',
  '    "Sleep Quality (1-10)": sleepQuality,',
  '    "Sleep Hours": sleepHours,',
  '    "CEO Time %": "—",',
  '    "Operator Time %": "—",',
  '    "Top 3 Priorities": "—",',
  '    Wins: "—",',
  '    Blockers: "—",',
  '    Mood: "—",',
  '    Exercise: exercise,',
  '    "Meals Quality (1-10)": "—",',
  '    "Coaching Notes": "Auto: Avg HR " + avgHR + ", Resting HR " + restingHR + ", Sleep " + sleepHours + "hrs",',
  '    "Action Items": "—"',
  '  }',
  '}];'
].join('\n');

for (let i = 0; i < wf.nodes.length; i++) {
  if (wf.nodes[i].name === 'Process Health Data') {
    wf.nodes[i].parameters = { jsCode: codeStr };
    console.log('Fixed Process Health Data code (' + codeStr.length + ' chars)');
    // Verify $input is intact
    console.log('First line:', codeStr.split('\n')[0]);
    break;
  }
}

// Re-apply creds
const credMap = {
  'googleOAuth2Api': { id: 'dMFkHV4KEbioauC6', name: 'Google account' },
  'googleSheetsOAuth2Api': { id: 'Tpo5kkkuG9qiBBvf', name: 'Google Sheets OAuth2 API' }
};
for (const n of wf.nodes) {
  if (n.credentials) {
    for (const [type] of Object.entries(n.credentials)) {
      if (credMap[type]) n.credentials[type] = credMap[type];
    }
  }
}

const payload = { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: { executionOrder: 'v1' } };
fs.writeFileSync(process.env.HOME + '/health_wf_fix3.json', JSON.stringify(payload));
const result = JSON.parse(execSync(`curl -s -X PUT -H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json" -d @"${process.env.HOME}/health_wf_fix3.json" "${BASE}/api/v1/workflows/${WF_ID}"`, { maxBuffer: 50*1024*1024, timeout: 30000 }).toString());

if (result.id) console.log('SUCCESS! Nodes:', result.nodes?.length);
else console.log('ERROR:', JSON.stringify(result).substring(0, 500));
