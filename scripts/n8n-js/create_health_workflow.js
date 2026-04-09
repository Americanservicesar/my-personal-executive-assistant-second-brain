const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzYxYWZiNS1kZjFkLTQyZmItOWZjYi04MWI3NjEyODE3ZDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzI5Y2YzNjctOGQ1ZC00YTY3LWJjNzQtOWFhYjgzNDQzYjVlIiwiaWF0IjoxNzc0MjgxOTc0fQ.iwaNzR5zdjY81m6lS35p-Fm8SB0fluFv4-geWCK2jI8';
const BASE_URL = 'https://americanservicesar.app.n8n.cloud';

const GIGI_SHEET_ID = '1Ew8CQib5kEVPB9CTAgjuJpjMJtW9xtvNTF-URS2ez6c';

// Build the workflow JSON
const workflow = {
  name: "ASAR - Gigi Daily Health Pull",
  nodes: [
    // 1. Schedule Trigger — 6 AM daily
    {
      parameters: {
        rule: {
          interval: [
            {
              triggerAtHour: 6,
              triggerAtMinute: 0
            }
          ]
        }
      },
      id: "health-trigger-1",
      name: "Daily 6AM Trigger",
      type: "n8n-nodes-base.scheduleTrigger",
      typeVersion: 1.2,
      position: [200, 300]
    },

    // 2. Code node — calculate yesterday's time range
    {
      parameters: {
        jsCode: `// Calculate yesterday midnight-to-midnight in millis
const now = new Date();
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(0, 0, 0, 0);

const endOfYesterday = new Date(yesterday);
endOfYesterday.setHours(23, 59, 59, 999);

const startMillis = yesterday.getTime();
const endMillis = endOfYesterday.getTime();

// Format date strings
const dateStr = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD
const dayStr = yesterday.toLocaleDateString('en-US', { weekday: 'long' });

return [{
  json: {
    startMillis: startMillis.toString(),
    endMillis: endMillis.toString(),
    startNanos: (startMillis * 1000000).toString(),
    endNanos: (endMillis * 1000000).toString(),
    dateStr,
    dayStr
  }
}];`
      },
      id: "health-calc-dates",
      name: "Calculate Date Range",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [420, 300]
    },

    // 3. HTTP Request — Pull Sleep Data
    {
      parameters: {
        method: "POST",
        url: "https://www.googleapis.com/fitness/v1/users/me/sessions",
        authentication: "predefinedCredentialType",
        nodeCredentialType: "googleOAuth2Api",
        sendBody: false,
        options: {},
        // Actually use GET with query params for sessions
        // Sessions endpoint is GET, not POST
      },
      id: "health-sleep-raw",
      name: "Get Sleep Sessions",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [660, 160]
    },

    // 4. HTTP Request — Pull Heart Rate (aggregate)
    {
      parameters: {
        method: "POST",
        url: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        authentication: "predefinedCredentialType",
        nodeCredentialType: "googleOAuth2Api",
        sendBody: true,
        specifyBody: "json",
        jsonBody: `={{{ JSON.stringify({
  aggregateBy: [
    { dataTypeName: "com.google.heart_rate.bpm" }
  ],
  bucketByTime: { durationMillis: 86400000 },
  startTimeMillis: parseInt($json.startMillis),
  endTimeMillis: parseInt($json.endMillis)
}) }}}`,
        options: {}
      },
      id: "health-hr-raw",
      name: "Get Heart Rate",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [660, 440]
    },

    // Let me simplify - do it all in one Code node using fetch
    // Actually n8n HTTP nodes handle OAuth nicely.
    // Better approach: use 3 parallel HTTP calls then merge
  ],
  connections: {},
  settings: {
    executionOrder: "v1"
  }
};

// Actually, let me build this properly with the right node patterns
// The cleanest approach: one Code node that makes all the API calls,
// then a Sheets node to append

const cleanWorkflow = {
  name: "ASAR - Gigi Daily Health Pull",
  nodes: [
    // 1. Schedule Trigger — 6 AM daily Central Time
    {
      parameters: {
        rule: {
          interval: [
            {
              triggerAtHour: 6,
              triggerAtMinute: 0
            }
          ]
        }
      },
      id: "gigi-health-trigger",
      name: "Daily 6AM Trigger",
      type: "n8n-nodes-base.scheduleTrigger",
      typeVersion: 1.2,
      position: [200, 300]
    },

    // 2. Set node — Calculate yesterday's date range
    {
      parameters: {
        mode: "raw",
        jsonOutput: `={{{
const now = new Date();
const y = new Date(now);
y.setDate(y.getDate() - 1);
y.setHours(0,0,0,0);
const e = new Date(y);
e.setHours(23,59,59,999);
return JSON.stringify({
  startMillis: y.getTime(),
  endMillis: e.getTime(),
  dateStr: y.toISOString().split('T')[0],
  dayStr: y.toLocaleDateString('en-US',{weekday:'long'})
});
}}}`,
        options: {}
      },
      id: "gigi-health-dates",
      name: "Yesterday Date Range",
      type: "n8n-nodes-base.set",
      typeVersion: 3.4,
      position: [420, 300]
    },

    // 3. HTTP Request — Get Sleep Sessions
    {
      parameters: {
        method: "GET",
        url: "=https://www.googleapis.com/fitness/v1/users/me/sessions?startTime={{ new Date(parseInt($json.startMillis)).toISOString() }}&endTime={{ new Date(parseInt($json.endMillis)).toISOString() }}&activityType=72",
        authentication: "predefinedCredentialType",
        nodeCredentialType: "googleOAuth2Api",
        options: {}
      },
      id: "gigi-health-sleep",
      name: "Get Sleep Data",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [660, 160],
      credentials: {
        googleOAuth2Api: {
          id: "dMFkHV4KEbioauC6",
          name: "Google account"
        }
      }
    },

    // 4. HTTP Request — Get Heart Rate Aggregate
    {
      parameters: {
        method: "POST",
        url: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        authentication: "predefinedCredentialType",
        nodeCredentialType: "googleOAuth2Api",
        sendBody: true,
        specifyBody: "json",
        jsonBody: "={{ JSON.stringify({ aggregateBy: [{ dataTypeName: 'com.google.heart_rate.bpm' }], bucketByTime: { durationMillis: 86400000 }, startTimeMillis: parseInt($json.startMillis), endTimeMillis: parseInt($json.endMillis) }) }}",
        options: {}
      },
      id: "gigi-health-hr",
      name: "Get Heart Rate",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [660, 300],
      credentials: {
        googleOAuth2Api: {
          id: "dMFkHV4KEbioauC6",
          name: "Google account"
        }
      }
    },

    // 5. HTTP Request — Get Exercise Sessions
    {
      parameters: {
        method: "GET",
        url: "=https://www.googleapis.com/fitness/v1/users/me/sessions?startTime={{ new Date(parseInt($json.startMillis)).toISOString() }}&endTime={{ new Date(parseInt($json.endMillis)).toISOString() }}",
        authentication: "predefinedCredentialType",
        nodeCredentialType: "googleOAuth2Api",
        options: {}
      },
      id: "gigi-health-exercise",
      name: "Get Exercise Sessions",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [660, 440],
      credentials: {
        googleOAuth2Api: {
          id: "dMFkHV4KEbioauC6",
          name: "Google account"
        }
      }
    },

    // 6. Merge — combine all 3 results
    {
      parameters: {
        mode: "combine",
        combinationMode: "mergeByPosition"
      },
      id: "gigi-health-merge",
      name: "Merge Health Data",
      type: "n8n-nodes-base.merge",
      typeVersion: 3,
      position: [900, 300]
    },

    // 7. Code node — Process all health data into sheet row
    {
      parameters: {
        jsCode: `// Get data from the 3 API calls
const items = $input.all();

// Helper: get yesterday's date info from first item
const dateStr = items[0]?.json?.dateStr || new Date().toISOString().split('T')[0];
const dayStr = items[0]?.json?.dayStr || '';

// Parse sleep data
let sleepHours = '—';
let sleepQuality = '—';
try {
  const sleepSessions = items[0]?.json?.session || [];
  if (sleepSessions.length > 0) {
    let totalSleepMs = 0;
    for (const s of sleepSessions) {
      if (s.activityType === 72) { // 72 = sleep
        totalSleepMs += parseInt(s.endTimeMillis) - parseInt(s.startTimeMillis);
      }
    }
    sleepHours = (totalSleepMs / 3600000).toFixed(1);
    // Quality estimate: 7+ hrs = 8, 6-7 = 6, 5-6 = 4, <5 = 2
    const hrs = parseFloat(sleepHours);
    if (hrs >= 7.5) sleepQuality = '8';
    else if (hrs >= 7) sleepQuality = '7';
    else if (hrs >= 6) sleepQuality = '6';
    else if (hrs >= 5) sleepQuality = '4';
    else sleepQuality = '2';
  }
} catch(e) { /* no sleep data */ }

// Parse heart rate
let avgHR = '—';
let restingHR = '—';
try {
  const hrBuckets = items[1]?.json?.bucket || [];
  if (hrBuckets.length > 0) {
    const dataset = hrBuckets[0]?.dataset?.[0];
    if (dataset?.point?.length > 0) {
      let sum = 0, count = 0, min = 999;
      for (const p of dataset.point) {
        for (const v of p.value) {
          if (v.fpVal) {
            sum += v.fpVal;
            count++;
            if (v.fpVal < min) min = v.fpVal;
          }
        }
      }
      avgHR = count > 0 ? Math.round(sum / count).toString() : '—';
      restingHR = min < 999 ? Math.round(min).toString() : '—';
    }
  }
} catch(e) { /* no HR data */ }

// Parse exercise
let exercise = 'None';
try {
  const sessions = items[2]?.json?.session || [];
  const workouts = sessions.filter(s => s.activityType !== 72 && s.activityType !== 0);
  if (workouts.length > 0) {
    const summaries = workouts.map(w => {
      const mins = Math.round((parseInt(w.endTimeMillis) - parseInt(w.startTimeMillis)) / 60000);
      return mins + 'min ' + (w.name || 'workout');
    });
    exercise = summaries.join(', ');
  }
} catch(e) { /* no exercise data */ }

// Derive energy estimate from sleep + resting HR
let energyEstimate = '—';
if (sleepHours !== '—' && restingHR !== '—') {
  const hrs = parseFloat(sleepHours);
  const rhr = parseInt(restingHR);
  // Simple heuristic: good sleep + low resting HR = high energy
  let score = 5;
  if (hrs >= 7) score += 2; else if (hrs >= 6) score += 1; else score -= 1;
  if (rhr < 60) score += 1; else if (rhr > 80) score -= 1;
  energyEstimate = Math.min(10, Math.max(1, score)).toString();
}

return [{
  json: {
    Date: dateStr,
    Day: dayStr,
    'Energy (1-10)': energyEstimate,
    'Sleep Quality (1-10)': sleepQuality,
    'Sleep Hours': sleepHours,
    'CEO Time %': '—',
    'Operator Time %': '—',
    'Top 3 Priorities': '—',
    Wins: '—',
    Blockers: '—',
    Mood: '—',
    Exercise: exercise,
    'Meals Quality (1-10)': '—',
    'Coaching Notes': 'Auto-filled by health pull. Avg HR: ' + avgHR + ', Resting HR: ' + restingHR,
    'Action Items': '—'
  }
}];`
      },
      id: "gigi-health-process",
      name: "Process Health Data",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [1140, 300]
    },

    // 8. Google Sheets — Append row to Gigi's daily brief
    {
      parameters: {
        operation: "append",
        documentId: {
          __rl: true,
          mode: "id",
          value: GIGI_SHEET_ID
        },
        sheetName: {
          __rl: true,
          mode: "name",
          value: "Sheet1"
        },
        columns: {
          mappingMode: "autoMapInputData",
          value: {}
        },
        options: {}
      },
      id: "gigi-health-sheet",
      name: "Append to Daily Brief",
      type: "n8n-nodes-base.googleSheets",
      typeVersion: 4.5,
      position: [1380, 300],
      credentials: {
        googleSheetsOAuth2Api: {
          id: "Tpo5kkkuG9qiBBvf",
          name: "Google Sheets OAuth2 API"
        }
      }
    }
  ],

  connections: {
    "Daily 6AM Trigger": {
      main: [[{ node: "Yesterday Date Range", type: "main", index: 0 }]]
    },
    "Yesterday Date Range": {
      main: [
        [
          { node: "Get Sleep Data", type: "main", index: 0 },
          { node: "Get Heart Rate", type: "main", index: 0 },
          { node: "Get Exercise Sessions", type: "main", index: 0 }
        ]
      ]
    },
    "Get Sleep Data": {
      main: [[{ node: "Merge Health Data", type: "main", index: 0 }]]
    },
    "Get Heart Rate": {
      main: [[{ node: "Merge Health Data", type: "main", index: 1 }]]
    },
    "Get Exercise Sessions": {
      main: [[{ node: "Merge Health Data", type: "main", index: 2 }]]
    },
    "Merge Health Data": {
      main: [[{ node: "Process Health Data", type: "main", index: 0 }]]
    },
    "Process Health Data": {
      main: [[{ node: "Append to Daily Brief", type: "main", index: 0 }]]
    }
  },

  settings: {
    executionOrder: "v1"
  }
};

// POST to create the workflow
const tmpFile = process.env.HOME + '/health_workflow_payload.json';
fs.writeFileSync(tmpFile, JSON.stringify(cleanWorkflow));

console.log('Creating Gigi Daily Health Pull workflow...');
const result = JSON.parse(execSync(
  `curl -s -X POST -H "X-N8N-API-KEY: ${API_KEY}" -H "Content-Type: application/json" -d @"${tmpFile}" "${BASE_URL}/api/v1/workflows"`,
  { maxBuffer: 50*1024*1024, timeout: 30000 }
).toString());

if (result.id) {
  console.log('SUCCESS!');
  console.log('Workflow ID:', result.id);
  console.log('Name:', result.name);
  console.log('Nodes:', result.nodes ? result.nodes.length : '?');
  console.log('URL:', BASE_URL + '/workflow/' + result.id);
} else {
  console.log('ERROR:', JSON.stringify(result).substring(0, 1000));
}
