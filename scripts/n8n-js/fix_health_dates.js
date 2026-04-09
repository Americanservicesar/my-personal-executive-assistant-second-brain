const fs = require('fs');
const { execSync } = require('child_process');
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const WF_ID = 'nZzcSNgSDxUengxX';
const BASE = 'https://americanservicesar.app.n8n.cloud';

const wf = JSON.parse(execSync(`curl -s -H "X-N8N-API-KEY: ${API_KEY}" "${BASE}/api/v1/workflows/${WF_ID}"`, { maxBuffer: 50*1024*1024 }).toString());

// Fix 1: Change date range to last 48 hours (catches today + yesterday)
for (const n of wf.nodes) {
  if (n.name === 'Yesterday Date Range') {
    n.parameters.jsCode = [
      'const now = new Date();',
      '// Go back 48 hours to catch both yesterday and today data',
      'const start = new Date(now);',
      'start.setDate(start.getDate() - 2);',
      'start.setHours(0, 0, 0, 0);',
      'const end = new Date(now);',
      '// Label as today',
      'const today = new Date(now);',
      'const dateStr = today.toISOString().split("T")[0];',
      'const dayStr = today.toLocaleDateString("en-US", { weekday: "long" });',
      'return [{',
      '  json: {',
      '    startMillis: start.getTime().toString(),',
      '    endMillis: end.getTime().toString(),',
      '    dateStr: dateStr,',
      '    dayStr: dayStr',
      '  }',
      '}];'
    ].join('\n');
    console.log('Fixed date range: last 48 hours');
  }
}

// Fix 2: Remove activityType=72 filter from sleep URL — get ALL sessions
for (const n of wf.nodes) {
  if (n.name === 'Get Sleep Data') {
    n.parameters.url = '=https://www.googleapis.com/fitness/v1/users/me/sessions?startTime={{ new Date(parseInt($json.startMillis)).toISOString() }}&endTime={{ new Date(parseInt($json.endMillis)).toISOString() }}';
    console.log('Fixed sleep URL: removed activityType filter');
  }
}

// Fix 3: Also add a 4th API call for sleep segments via aggregate
// Actually, let's change the sleep call to use aggregate API instead of sessions
// The aggregate API is more reliable for Hume data
for (const n of wf.nodes) {
  if (n.name === 'Get Sleep Data') {
    // Switch from GET sessions to POST aggregate for sleep
    n.parameters.method = 'POST';
    n.parameters.url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';
    n.parameters.sendBody = true;
    n.parameters.specifyBody = 'json';
    n.parameters.jsonBody = "={{ JSON.stringify({ aggregateBy: [{ dataTypeName: 'com.google.sleep.segment' }], bucketByTime: { durationMillis: 172800000 }, startTimeMillis: parseInt($json.startMillis), endTimeMillis: parseInt($json.endMillis) }) }}";
    console.log('Changed sleep to aggregate API');
  }
}

// Fix 4: Update the Code node to handle aggregate sleep format
for (const n of wf.nodes) {
  if (n.name === 'Process Health Data') {
    n.parameters.jsCode = [
      'const items = $input.all();',
      '',
      'const sleepItem = items[0]?.json || {};',
      'const hrItem = items[1]?.json || {};',
      'const exerciseItem = items[2]?.json || {};',
      '',
      'const now = new Date();',
      'const dateStr = now.toISOString().split("T")[0];',
      'const dayStr = now.toLocaleDateString("en-US", { weekday: "long" });',
      '',
      '// Parse sleep from aggregate API',
      'let sleepHours = "—";',
      'let sleepQuality = "—";',
      'try {',
      '  const buckets = sleepItem.bucket || [];',
      '  let totalSleepMs = 0;',
      '  let deepMs = 0;',
      '  let remMs = 0;',
      '  for (const b of buckets) {',
      '    for (const ds of (b.dataset || [])) {',
      '      for (const p of (ds.point || [])) {',
      '        const startMs = parseInt(p.startTimeNanos) / 1000000;',
      '        const endMs = parseInt(p.endTimeNanos) / 1000000;',
      '        const duration = endMs - startMs;',
      '        const sleepType = p.value?.[0]?.intVal;',
      '        // Google Fit sleep types: 1=awake, 2=sleep, 3=out-of-bed, 4=light, 5=deep, 6=REM',
      '        if (sleepType === 2 || sleepType === 4 || sleepType === 5 || sleepType === 6) {',
      '          totalSleepMs += duration;',
      '        }',
      '        if (sleepType === 5) deepMs += duration;',
      '        if (sleepType === 6) remMs += duration;',
      '      }',
      '    }',
      '  }',
      '  if (totalSleepMs > 0) {',
      '    sleepHours = (totalSleepMs / 3600000).toFixed(1);',
      '    // Quality based on deep+REM ratio',
      '    const deepRemRatio = (deepMs + remMs) / totalSleepMs;',
      '    const hrs = parseFloat(sleepHours);',
      '    let q = 5;',
      '    if (hrs >= 7) q += 1;',
      '    if (hrs >= 8) q += 1;',
      '    if (hrs < 6) q -= 2;',
      '    if (deepRemRatio > 0.4) q += 1;',
      '    if (deepRemRatio < 0.2) q -= 1;',
      '    sleepQuality = Math.min(10, Math.max(1, q)).toString();',
      '  }',
      '} catch(e) {}',
      '',
      '// Parse heart rate',
      'let avgHR = "—";',
      'let restingHR = "—";',
      'try {',
      '  const buckets = hrItem.bucket || [];',
      '  for (const b of buckets) {',
      '    const dataset = b.dataset?.[0];',
      '    if (dataset?.point?.length > 0) {',
      '      let sum = 0, count = 0, min = 999;',
      '      for (const p of dataset.point) {',
      '        for (const v of p.value) {',
      '          if (v.fpVal) { sum += v.fpVal; count++; if (v.fpVal < min) min = v.fpVal; }',
      '        }',
      '      }',
      '      if (count > 0) avgHR = Math.round(sum / count).toString();',
      '      if (min < 999) restingHR = Math.round(min).toString();',
      '    }',
      '  }',
      '} catch(e) {}',
      '',
      '// Parse exercise',
      'let exercise = "None";',
      'try {',
      '  const sessions = exerciseItem.session || [];',
      '  const workouts = sessions.filter(s => s.activityType !== 72 && s.activityType !== 0 && s.activityType !== 109);',
      '  if (workouts.length > 0) {',
      '    exercise = workouts.map(w => {',
      '      const mins = Math.round((parseInt(w.endTimeMillis) - parseInt(w.startTimeMillis)) / 60000);',
      '      return mins + "min " + (w.name || "workout");',
      '    }).join(", ");',
      '  }',
      '} catch(e) {}',
      '',
      '// Energy estimate',
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
    console.log('Updated Process Health Data code');
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
fs.writeFileSync(process.env.HOME + '/health_dates_fix.json', JSON.stringify(payload));
const result = JSON.parse(execSync(`curl -s -X PUT -H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json" -d @"${process.env.HOME}/health_dates_fix.json" "${BASE}/api/v1/workflows/${WF_ID}"`, { maxBuffer: 50*1024*1024, timeout: 30000 }).toString());

if (result.id) console.log('SUCCESS! Nodes:', result.nodes?.length);
else console.log('ERROR:', JSON.stringify(result).substring(0, 500));
