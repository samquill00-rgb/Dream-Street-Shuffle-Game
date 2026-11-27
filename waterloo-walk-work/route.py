import json, math, heapq, collections
W=json.load(open('ways.json'))['elements']
LAT0,LON0=51.5078,-0.1225
def xy(lat,lon): return ((lon-LON0)*111320*math.cos(math.radians(LAT0)), (lat-LAT0)*110574)
G=collections.defaultdict(list); pos={}
bad={'motorway','trunk_link','construction','proposed'}
for w in W:
    t=w.get('tags',{}); h=t.get('highway')
    if h in bad or t.get('access') in('private','no') or t.get('foot')=='no': continue
    if t.get('indoor') or t.get('level') not in (None,'0') and h in('corridor',): continue
    if h=='corridor': continue
    g=w['geometry']; ids=w.get('nodes') or [None]*len(g)
    pts=[(round(p['lat'],7),round(p['lon'],7)) for p in g]
    for a,b in zip(pts,pts[1:]):
        ax,ay=xy(*a); bx,by=xy(*b); d=math.hypot(ax-bx,ay-by)
        pen=1.0 if h in('footway','pedestrian','path','steps','living_street','residential','tertiary','unclassified','service','cycleway') or t.get('sidewalk') not in(None,'no') else 1.15
        nm=t.get('name') or t.get('bridge:name') or ('('+h+')')
        G[a].append((b,d*pen,nm)); G[b].append((a,d*pen,nm))
def near(lat,lon): return min(G,key=lambda n:(n[0]-lat)**2+((n[1]-lon)*0.62)**2)
S=near(51.51330,-0.13225)   # Dean Street by the French House
T=near(51.50330,-0.11330)   # Waterloo Station, Victory Arch
dist={S:0}; prev={}; pq=[(0,S)]
while pq:
    d,u=heapq.heappop(pq)
    if u==T: break
    if d>dist.get(u,1e18): continue
    for v,w_,nm in G[u]:
        nd=d+w_
        if nd<dist.get(v,1e18): dist[v]=nd; prev[v]=(u,nm); heapq.heappush(pq,(nd,v))
path=[T]; names=[]
while path[-1]!=S:
    u,nm=prev[path[-1]]; names.append(nm); path.append(u)
path.reverse(); names.reverse()
print('total m',round(dist[T]))
run=None; acc=0; out=[]
for (a,b),nm in zip(zip(path,path[1:]),names):
    d=math.hypot(*(p-q for p,q in zip(xy(*a),xy(*b))))
    if nm!=run:
        if run: out.append((run,round(acc)))
        run=nm; acc=0
    acc+=d
out.append((run,round(acc)))
for n,d in out: print(d,n)
json.dump({'path':path,'names':names},open('route.json','w'))
