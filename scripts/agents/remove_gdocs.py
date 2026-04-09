import json

with open(r'C:\Users\sales\.claude\vizzy_api_payload.json') as f:
    data = json.load(f)

# Remove Google Docs node
data['nodes'] = [n for n in data['nodes'] if n['name'] != 'Google Docs - Vizzy']
data['connections'].pop('Google Docs - Vizzy', None)

print(f'Nodes: {len(data["nodes"])}, Connections: {len(data["connections"])}')

with open(r'C:\Users\sales\.claude\vizzy_api_payload.json', 'w') as f:
    json.dump(data, f)
print('Saved without Google Docs node')
