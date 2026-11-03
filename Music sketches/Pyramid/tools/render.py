import json, math, random, struct, array, sys
sc=json.load(open('score.json')); BPM=sc['bpm']; PPQ=sc['ppq']; SR=48000
tick2s=lambda t: t/PPQ*60/BPM
total=0
notes=[]
for name,evs in sc['tracks'].items():
    on={}
    for t,ch,st,p,v in sorted(evs):
        if st==0x90: on[(ch,p)]=(t,v)
        else:
            if (ch,p) in on: s,v=on.pop((ch,p)); notes.append((name,ch,tick2s(s),tick2s(t)-tick2s(s),p,v))
total=max(s+d for _,_,s,d,_,_ in notes)+2.0
N=int(total*SR); bufL=[0.0]*N; bufR=[0.0]*N; PAN={0:-0.25,1:0.25,2:0.0,3:0.0,9:0.0}
f=lambda p: 440*2**((p-69)/12)
def add(start,samples,gain,pan=0.0):
    i0=int(start*SR); gl=gain*(1-pan)/1.0; gr=gain*(1+pan)/1.0
    for i,x in enumerate(samples):
        j=i0+i
        if j<N: bufL[j]+=x*gl; bufR[j]+=x*gr
def env(n,a,d,s,r,hold):
    out=[]
    for i in range(n):
        t=i/SR
        if t<a: e=t/a
        elif t<a+d: e=1-(1-s)*(t-a)/d
        elif t<hold: e=s
        else: e=s*max(0,1-(t-hold)/r)
        out.append(e)
    return out
def osc(kind,freq,n,detune=0.0):
    out=[]; ph=0.0; inc=freq*(1+detune)/SR
    for i in range(n):
        ph=(ph+inc)%1.0
        if kind=='sq': x=1.0 if ph<0.5 else -1.0
        elif kind=='saw': x=2*ph-1
        elif kind=='tri': x=4*abs(ph-0.5)-1
        else: x=math.sin(2*math.pi*ph)
        out.append(x)
    return out
def lp(sig,cut):   # one-pole lowpass
    a=math.exp(-2*math.pi*cut/SR); y=0.0; out=[]
    for x in sig: y=a*y+(1-a)*x; out.append(y)
    return out
random.seed(1)
for name,ch,s,d,p,v in notes:
    g=v/127
    if ch==9:
        if p==36:   # kick
            n=int(0.25*SR); out=[]; ph=0
            for i in range(n):
                t=i/SR; fr=50+150*math.exp(-t*30); ph+=fr/SR; out.append(math.sin(2*math.pi*ph)*math.exp(-t*12))
            add(s,out,0.9*g)
        elif p==38:  # snare
            n=int(0.18*SR); out=[(random.uniform(-1,1)*math.exp(-i/SR*28)+0.5*math.sin(2*math.pi*190*i/SR)*math.exp(-i/SR*40)) for i in range(n)]
            add(s,out,0.5*g)
        elif p in (42,46):
            n=int((0.05 if p==42 else 0.3)*SR); hp=[]; prev=0
            for i in range(n):
                x=random.uniform(-1,1); hp.append(x-prev); prev=x
            out=[x*math.exp(-i/SR*(60 if p==42 else 10)) for i,x in enumerate(hp)]
            add(s,out,0.25*g)
        elif p==49:
            n=int(1.2*SR); hp=[]; prev=0
            for i in range(n):
                x=random.uniform(-1,1); hp.append(x-prev); prev=x
            out=[x*math.exp(-i/SR*3) for i,x in enumerate(hp)]; add(s,out,0.25*g)
        elif p==65:  # timbale: bright tone + noise
            n=int(0.15*SR); out=[(0.7*math.sin(2*math.pi*(330*i/SR))+0.5*random.uniform(-1,1))*math.exp(-i/SR*25) for i in range(n)]; add(s,out,0.5*g)
        elif p in (60,61):  # bongo
            fr=420 if p==60 else 300
            n=int(0.12*SR); out=[math.sin(2*math.pi*(fr*i/SR)*(1+0.3*math.exp(-i/SR*60)))*math.exp(-i/SR*35) for i in range(n)]; add(s,out,0.6*g)
        continue
    hold=d; rel=0.05 if ch in (0,1,2) else 0.6
    n=int((hold+rel)*SR)
    if ch==0:   # square lead
        sig=osc('sq',f(p),n); e=env(n,0.004,0.05,0.8,rel,hold); out=[x*y for x,y in zip(lp(sig,4500),e)]; add(s,out,0.16*g,-0.25)
    elif ch==1: # saw lead
        a=osc('saw',f(p),n); b=osc('saw',f(p),n,0.006); e=env(n,0.004,0.05,0.8,rel,hold); out=[(x+y)*z*0.5 for x,y,z in zip(lp(a,3500),lp(b,3500),e)]; add(s,out,0.18*g,0.25)
    elif ch==2: # bass
        sig=lp(osc('saw',f(p),n),900); sub=osc('sin',f(p)/2,n); e=env(n,0.003,0.08,0.7,rel,hold); out=[(x+0.6*y)*z for x,y,z in zip(sig,sub,e)]; add(s,out,0.30*g)
    elif ch==3: # pad
        a=osc('saw',f(p),n,-0.004); b=osc('saw',f(p),n,0.004); c=osc('tri',f(p),n); e=env(n,0.35,0.3,0.85,rel,hold)
        out=[(x+y+0.8*w)*z/2.8 for x,y,w,z in zip(lp(a,1800),lp(b,1800),c,e)]; add(s,out,0.14*g)
# soft clip + write
peak=max(max(abs(x) for x in bufL),max(abs(x) for x in bufR)); print('peak',peak)
pcm=array.array('h')
for l,r in zip(bufL,bufR): pcm.append(int(32000*math.tanh(l/peak*1.6))); pcm.append(int(32000*math.tanh(r/peak*1.6)))
with open(sys.argv[1],'wb') as w:
    w.write(b'RIFF'+struct.pack('<I',36+len(pcm)*2)+b'WAVEfmt '+struct.pack('<IHHIIHH',16,1,2,SR,SR*4,4,16)+b'data'+struct.pack('<I',len(pcm)*2)); pcm.tofile(w)
print('wrote',sys.argv[1],total)
