import json

with open(r'C:\Users\sales\.claude\vizzy_api_payload.json') as f:
    data = json.load(f)

for n in data['nodes']:
    if n['name'] == 'Google Docs - Vizzy':
        n['parameters'] = {
            'resource': 'document',
            'operation': 'create',
            'title': "={{ $fromAI('title', 'Document title', 'string') }}"
        }
        print('Fixed Google Docs params:', json.dumps(n['parameters'], indent=2))
        break

with open(r'C:\Users\sales\.claude\vizzy_api_payload.json', 'w') as f:
    json.dump(data, f)
print('Saved')
