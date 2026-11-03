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
def pluck(freq,n,bright,decay):
    """karplus-ish: saw+tri through a decaying lowpass"""
    ph=0.0; inc=freq/SR; out=[]; y=0.0
    for i in range(n):
        ph=(ph+inc)%1.0; x=0.6*(2*ph-1)+0.4*(4*abs(ph-0.5)-1)
        env=math.exp(-i/SR*decay); cut=bright*env+150; a=math.exp(-2*math.pi*cut/SR); y=a*y+(1-a)*x
        out.append(y*env)
    return out
def pipe(freq,n,hold,breath,v):
    out=[]; ph=0.0; vib=0.0
    e=adsr(n,0.035,0.08,0.85,0.12,hold); nz=lp(noise(n),2500)
    for i in range(n):
        t=i/SR; vdepth=0.004*min(1,max(0,(t-0.25)/0.3)); fr=freq*(1+vdepth*math.sin(2*math.pi*5.2*t))
        ph=(ph+fr/SR)%1.0
        x=math.sin(2*math.pi*ph)+0.35*math.sin(4*math.pi*ph)+0.12*math.sin(6*math.pi*ph)
        out.append((x+breath*nz[i])*e[i])
    return out
random.seed(3)
for ch,s,d,p,v in notes:
    g=v/127
    if ch==9:
        if p==41:   # bombo
            n=int(0.35*SR); out=[]; ph=0
            for i in range(n):
                t=i/SR; fr=55+60*math.exp(-t*25); ph+=fr/SR; out.append((math.sin(2*math.pi*ph)+0.2*random.uniform(-1,1)*math.exp(-t*80))*math.exp(-t*9))
            add(s,out,0.9*g)
        elif p==64:  # cajon bass tone
            n=int(0.2*SR); ph=0; out=[]
            for i in range(n):
                t=i/SR; fr=95+80*math.exp(-t*40); ph+=fr/SR; out.append((math.sin(2*math.pi*ph)*math.exp(-t*18)+0.5*random.uniform(-1,1)*math.exp(-t*90)))
            add(s,out,0.7*g,-0.1)
        elif p==63:  # cajon slap
            n=int(0.12*SR); out=[x*math.exp(-i/SR*45) for i,x in enumerate(hp(noise(n),1200))]
            out=[o+0.3*math.sin(2*math.pi*700*i/SR)*math.exp(-i/SR*70) for i,o in enumerate(out)]; add(s,out,0.55*g,-0.1)
        elif p==62:  # ghost
            n=int(0.05*SR); out=[x*math.exp(-i/SR*90) for i,x in enumerate(hp(noise(n),1500))]; add(s,out,0.35*g,-0.1)
        elif p==75:  # claves
            n=int(0.08*SR); out=[math.sin(2*math.pi*2400*i/SR)*math.exp(-i/SR*80) for i in range(n)]; add(s,out,0.35*g,0.3)
        elif p==82:  # shaker
            n=int(0.06*SR); out=[x*math.exp(-i/SR*70)*min(1,i/(0.004*SR)) for i,x in enumerate(hp(noise(n),5000))]; add(s,out,0.22*g,0.35)
        continue
    hold=d
    if ch in (0,1):      # pan pipes
        n=int((hold+0.15)*SR); out=pipe(f(p),n,hold,0.25,v); add(s,out,0.14*g,-0.3 if ch==0 else 0.3)
    elif ch==2:          # quena: reedier
        n=int((hold+0.2)*SR); out=pipe(f(p),n,hold,0.12,v); out=[o+0.15*(2*((i*f(p)/SR)%1)-1)*adsr(1,0,0,1,1,1)[0] for i,o in enumerate(out)]; add(s,out,0.12*g,0.05)
    elif ch==3:          # nylon guitar
        n=int(min(hold+0.4,1.6)*SR); out=pluck(f(p),n,2600,3.5); add(s,out,0.16*g,-0.15)
    elif ch==4:          # charango: bright, short, doubled octave string flavour
        n=int(min(hold+0.25,0.6)*SR); out=pluck(f(p),n,5000,9); out2=pluck(f(p)*2.003,n,5000,11); out=[a+0.4*b for a,b in zip(out,out2)]; add(s,out,0.07*g,0.25)
    elif ch==5:          # bass
        n=int((hold+0.1)*SR); out=pluck(f(p),n,700,2.5); sub=[math.sin(2*math.pi*f(p)*i/SR)*math.exp(-i/SR*2) for i in range(n)]; out=[a+0.7*b for a,b in zip(out,sub)]; add(s,out,0.30*g)
    elif ch==6:          # pad
        n=int((hold+1.0)*SR); ph1=ph2=0.0; e=adsr(n,0.8,0.5,0.8,1.0,hold); out=[]
        for i in range(n):
            ph1=(ph1+f(p)*0.997/SR)%1; ph2=(ph2+f(p)*1.003/SR)%1; out.append(((2*ph1-1)+(2*ph2-1))*0.5*e[i])
        add(s,lp(out,900),0.10*g)
peak=max(max(abs(x) for x in L),max(abs(x) for x in R)); print('peak',peak)
pcm=array.array('h')
for l,r in zip(L,R): pcm.append(int(32000*math.tanh(l/peak*1.5))); pcm.append(int(32000*math.tanh(r/peak*1.5)))
with open(sys.argv[2],'wb') as w:
    w.write(b'RIFF'+struct.pack('<I',36+len(pcm)*2)+b'WAVEfmt '+struct.pack('<IHHIIHH',16,1,2,SR,SR*4,4,16)+b'data'+struct.pack('<I',len(pcm)*2)); pcm.tofile(w)
print('wrote',sys.argv[2],round(total,1))
