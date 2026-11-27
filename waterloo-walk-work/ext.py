import json, math
LAT0,LON0=51.5060,-0.1200
def xy(p): return (round((p['lon']-LON0)*111320*math.cos(math.radians(LAT0)),1), round((p['lat']-LAT0)*110574,1))
W=json.load(open('ways.json'))['elements']; B=json.load(open('built.json'))['elements']
for w in W:
    t=w.get('tags',{})
    if 'Jubilee' in t.get('name','') or 'Hungerford' in t.get('name',''):
        g=[xy(p) for p in w['geometry']]; print('WAY',w['id'],t.get('name'),t.get('highway'),t.get('bridge'),t.get('layer'),len(g),g[0],g[-1])
import collections
c=collections.Counter()
for e in B:
    t=e.get('tags',{})
    k='building' if 'building' in t else 'railway='+t.get('railway','') if 'railway' in t else 'water' if t.get('natural')=='water' else 'bridge:'+t.get('man_made',t.get('highway','?'))
    c[k]+=1
    n=t.get('name','')
    if any(s in n for s in('Festival Hall','Hungerford','Charing Cross','London Eye','Shell','Waterloo','Embankment','Whitehall Court','Elizabeth Hall','County Hall')) and e['type']=='way':
        g=[xy(p) for p in e['geometry']]; xs=[p[0] for p in g]; ys=[p[1] for p in g]
        print(e['type'],e['id'],n,'|',k,t.get('height'),t.get('building:levels'),'bbox',min(xs),min(ys),max(xs),max(ys),len(g))
    if e['type']=='relation' and (n or t.get('natural')): print('REL',e['id'],n,k,t.get('height'),[ (m.get('role'),len(m.get('geometry',[]))) for m in e.get('members',[])][:6])
print(c)
