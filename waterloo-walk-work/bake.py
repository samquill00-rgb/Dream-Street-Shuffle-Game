import json, math
LAT0,LON0=51.5060,-0.1200
K=111320*math.cos(math.radians(LAT0))
def xz(p): return [round((p['lon']-LON0)*K,1), round(-(p['lat']-LAT0)*110574,1)]
W=json.load(open('ways.json'))['elements']; B=json.load(open('built.json'))['elements']
C=json.load(open('coast.json'))['elements']; R=json.load(open('water.json'))['elements']
out={'origin':[LAT0,LON0]}
def flat(g): return [v for p in g for v in xz(p)]
blds=[]; special={5987419:'rfh',27038418:'chx',4245075:'waterloo',46250966:'shell'}
for e in B:
    t=e.get('tags',{})
    if e['type']!='way' or 'building' not in t or e['id']==204068874: continue
    h=0
    try: h=float(str(t.get('height','0')).replace('m','').strip())
    except: h=0
    if not h:
        try: h=float(t.get('building:levels',0))*3.4
        except: h=0
    g=e['geometry']
    if len(g)<4: continue
    blds.append([round(h,1), special.get(e['id'],0), flat(g[:-1] if g[0]==g[-1] else g)])
out['buildings']=blds
out['foot']={str(w['id']):flat(w['geometry']) for w in W if w['id'] in (4254120,4254123)}
out['bridges']=[[e['tags'].get('name',''),flat(e['geometry'])] for e in C if e['tags'].get('man_made')=='bridge']
out['rails']=[flat(e['geometry']) for e in B if e.get('tags',{}).get('railway')=='rail' and e['type']=='way']
# river: chain the outer ways of the river relation into bank lines
segs=[]
for r in R:
    if r['id']!=28934: continue
    for m in r['members']:
        g=m.get('geometry') or []
        g=[xz(p) for p in g if p]
        if len(g)>1: segs.append(g)
def d(a,b): return math.hypot(a[0]-b[0],a[1]-b[1])
chains=[]
while segs:
    c=segs.pop()
    grew=True
    while grew:
        grew=False
        for i,s in enumerate(segs):
            if d(c[-1],s[0])<2: c=c+s[1:]
            elif d(c[-1],s[-1])<2: c=c+s[::-1][1:]
            elif d(c[0],s[-1])<2: c=s+c[1:]
            elif d(c[0],s[0])<2: c=s[::-1]+c[1:]
            else: continue
            segs.pop(i); grew=True; break
    chains.append(c)
chains.sort(key=len,reverse=True)
print('chains',[(len(c),c[0],c[-1]) for c in chains])
out['banks']=[[v for p in c for v in p] for c in chains]
s=json.dumps(out,separators=(',',':'))
HEADER='/* Map data (c) OpenStreetMap contributors, https://www.openstreetmap.org/copyright. This file is an extract of the OpenStreetMap database (Soho to Waterloo, fetched 2026-11-26) and is made available under the Open Database License (ODbL) 1.0, https://opendatacommons.org/licenses/odbl/1-0/. The licence covers this data file only. */\n'
open('../waterloo-walk-data.js','w').write(HEADER+'window.WW_DATA='+s+';')
print(len(s),len(blds))
