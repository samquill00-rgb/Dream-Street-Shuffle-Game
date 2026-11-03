import json, math, random, struct, array, sys
sc=json.load(open(sys.argv[1]+'.json')); BPM=sc['bpm']; PPQ=sc['ppq']; SR=48000
t2s=lambda t: t/PPQ*60/BPM
notes=[]
for name,evs in sc['tracks'].items():
    on={}
    for t,ch,st,p,v in sorted(evs):
        if st==0x90: on[(ch,p)]=(t,v)
        elif (ch,p) in on: s,v=on.pop((ch,p)); notes.append((ch,t2s(s),t2s(t)-t2s(s),p,v))
total=max(s+d for _,s,d,_,_ in notes)+2.5; N=int(total*SR); L=[0.0]*N; R=[0.0]*N
f=lambda p: 440*2**((p-69)/12)
def add(start,sig,gain,pan=0.0):
    i0=int(start*SR); gl=gain*(1-pan); gr=gain*(1+pan)
    for i,x in enumerate(sig):
        j=i0+i
        if j<N: L[j]+=x*gl; R[j]+=x*gr
def lp(sig,cut):
    a=math.exp(-2*math.pi*cut/SR); y=0.0; out=[]
    for x in sig: y=a*y+(1-a)*x; out.append(y)
    return out
def hp(sig,cut):
    a=math.exp(-2*math.pi*cut/SR); y=0.0; px=0.0; out=[]
    for x in sig: y=a*(y+x-px); px=x; out.append(y)
    return out
def noise(n): return [random.uniform(-1,1) for _ in range(n)]
def adsr(n,a,d,s,r,hold):
    out=[]
    for i in range(n):
        t=i/SR
        if t<a: e=t/a
        elif t<a+d: e=1-(1-s)*(t-a)/d
        elif t<hold: e=s
        else: e=s*max(0,1-(t-hold)/r)
        out.append(e)
    return out
def saw(freq,n,det=0.0):
    ph=0.0; inc=freq*(1+det)/SR; out=[]
    for i in range(n): ph=(ph+inc)%1.0; out.append(2*ph-1)
    return out
def pluck(freq,n,bright,decay):
    ph=0.0; inc=freq/SR; out=[]; y=0.0
    for i in range(n):
        ph=(ph+inc)%1.0; x=0.6*(2*ph-1)+0.4*(4*abs(ph-0.5)-1)
        env=math.exp(-i/SR*decay); cut=bright*env+150; a=math.exp(-2*math.pi*cut/SR); y=a*y+(1-a)*x
        out.append(y*env)
    return out
def pipe(freq,n,hold,breath):
    out=[]; ph=0.0; e=adsr(n,0.03,0.08,0.85,0.1,hold); nz=lp(noise(n),2500)
    for i in range(n):
        t=i/SR; vd=0.004*min(1,max(0,(t-0.2)/0.3)); fr=freq*(1+vd*math.sin(2*math.pi*5.5*t)); ph=(ph+fr/SR)%1.0
        x=math.sin(2*math.pi*ph)+0.35*math.sin(4*math.pi*ph)+0.12*math.sin(6*math.pi*ph); out.append((x+breath*nz[i])*e[i])
    return out
random.seed(5)
for ch,s,d,p,v in notes:
    g=v/127; hold=d
    if ch==9:
        if p==36:
            n=int(0.3*SR); out=[]; ph=0
            for i in range(n):
                t=i/SR; fr=48+140*math.exp(-t*32); ph+=fr/SR; out.append((math.sin(2*math.pi*ph)+0.3*random.uniform(-1,1)*math.exp(-t*120))*math.exp(-t*11))
            add(s,out,1.0*g)
        elif p==38:
            n=int(0.22*SR); nz=hp(noise(n),900); out=[(nz[i]*math.exp(-i/SR*22)+0.6*math.sin(2*math.pi*185*i/SR)*math.exp(-i/SR*30)) for i in range(n)]; add(s,out,0.6*g)
        elif p==42:
            n=int(0.05*SR); out=[x*math.exp(-i/SR*70) for i,x in enumerate(hp(noise(n),6000))]; add(s,out,0.28*g,0.2)
        elif p==49:
            n=int(1.5*SR); out=[x*math.exp(-i/SR*2.5) for i,x in enumerate(hp(noise(n),3000))]; add(s,out,0.22*g,-0.2)
        elif p==54:  # tambourine: a few jingle ticks
            n=int(0.15*SR); out=[0.0]*n
            for k in range(5):
                o=int(k*0.012*SR)
                for i in range(o,n): out[i]+=random.uniform(-1,1)*math.exp(-(i-o)/SR*60)*0.5
            add(s,hp(out,5000),0.3*g,0.3)
        elif p in (41,45,47):
            fr={41:80,45:110,47:140}[p]; n=int(0.35*SR); ph=0; out=[]
            for i in range(n):
                t=i/SR; ph+=(fr*(1+0.5*math.exp(-t*30)))/SR; out.append(math.sin(2*math.pi*ph)*math.exp(-t*9)+0.15*random.uniform(-1,1)*math.exp(-t*60))
            add(s,out,0.8*g,-0.15 if p==41 else 0.15)
        continue
    if ch in (0,1):
        n=int((hold+0.15)*SR); add(s,pipe(f(p),n,hold,0.22),0.13*g,-0.3 if ch==0 else 0.3)
    elif ch==2:   # tenor sax: bright saw, vibrato, lowpass, growl
        n=int((hold+0.2)*SR); e=adsr(n,0.04,0.1,0.85,0.15,hold); ph=0.0; out=[]
        for i in range(n):
            t=i/SR; vd=0.006*min(1,max(0,(t-0.15)/0.25)); fr=f(p)*(1+vd*math.sin(2*math.pi*5.8*t)); ph=(ph+fr/SR)%1.0
            x=(2*ph-1)*0.7+0.3*math.sin(2*math.pi*ph); out.append(math.tanh(2.2*x)*e[i])
        add(s,lp(out,2600),0.17*g,0.1)
    elif ch==3:   # overdriven guitar: two detuned saws, soft clip, lowpass
        n=int((hold+0.08)*SR); a=saw(f(p),n,-0.002); b=saw(f(p),n,0.002); e=adsr(n,0.004,0.05,0.9,0.06,hold)
        out=[math.tanh(3.0*(x+y))*z for x,y,z in zip(a,b,e)]; add(s,lp(out,3200),0.07*g,-0.35)
    elif ch==4:   # piano
        n=int(min(hold+0.6,2.5)*SR); out=pluck(f(p),n,4000,2.2); s2=[math.sin(2*math.pi*f(p)*i/SR)*math.exp(-i/SR*1.5) for i in range(n)]
        out=[a+0.5*b for a,b in zip(out,s2)]; add(s,out,0.11*g,0.2)
    elif ch==5:   # organ: drawbar sines
        n=int((hold+0.05)*SR); e=adsr(n,0.01,0.0,1.0,0.04,hold); out=[]
        for i in range(n):
            t=i/SR; out.append((math.sin(2*math.pi*f(p)*t)+0.6*math.sin(2*math.pi*f(p)*2*t)+0.4*math.sin(2*math.pi*f(p)*3*t)+0.25*math.sin(2*math.pi*f(p)*4*t))*e[i])
        add(s,out,0.045*g,0.0)
    elif ch==6:   # glockenspiel
        n=int(1.2*SR); out=[(math.sin(2*math.pi*f(p)*i/SR)+0.4*math.sin(2*math.pi*f(p)*2.76*i/SR)*math.exp(-i/SR*8))*math.exp(-i/SR*4) for i in range(n)]; add(s,out,0.07*g,0.35)
    elif ch==7:   # electric bass
        n=int((hold+0.1)*SR); out=pluck(f(p),n,900,3.0); sub=[math.sin(2*math.pi*f(p)*i/SR)*math.exp(-i/SR*3) for i in range(n)]
        out=[math.tanh(1.5*(a+0.8*b)) for a,b in zip(out,sub)]; add(s,out,0.30*g)
peak=max(max(abs(x) for x in L),max(abs(x) for x in R)); print('peak',peak)
pcm=array.array('h')
for l,r in zip(L,R): pcm.append(int(32000*math.tanh(l/peak*1.6))); pcm.append(int(32000*math.tanh(r/peak*1.6)))
with open(sys.argv[2],'wb') as w:
    w.write(b'RIFF'+struct.pack('<I',36+len(pcm)*2)+b'WAVEfmt '+struct.pack('<IHHIIHH',16,1,2,SR,SR*4,4,16)+b'data'+struct.pack('<I',len(pcm)*2)); pcm.tofile(w)
print('wrote',sys.argv[2],round(total,1))
