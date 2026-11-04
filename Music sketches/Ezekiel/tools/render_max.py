"""numpy synth render of the Ezekiel max score (reads <mid>.json from smf.Score). Rustie-ish palette: organ, FM glass lead,
supersaw (7 detuned saws) sidechained to the kick, glitter arp (bright square, fast decay), sub sine, bells, brass, risers,
halftime kit with trap hats. Usage: python3 render_max.py "<mid>" "<out.wav>" """
import json,math,sys,numpy as np
sc=json.load(open(sys.argv[1]+'.json')); BPM=sc['bpm']; PPQ=sc['ppq']; SR=48000
t2s=lambda t: t/PPQ*60/BPM
notes=[]
for name,evs in sc['tracks'].items():
    on={}
    for t,ch,st,p,v in sorted(evs):
        if st==0x90: on[(ch,p)]=(t,v)
        elif (ch,p) in on: s,v=on.pop((ch,p)); notes.append((ch,t2s(s),t2s(t)-t2s(s),p,v))
total=max(s+d for _,s,d,_,_ in notes)+3.0; N=int(total*SR); L=np.zeros(N); R=np.zeros(N)
f=lambda p: 440*2**((p-69)/12)
rng=np.random.default_rng(4)
def add(start,sig,gain,pan=0.0,bus=None):
    i0=int(start*SR); n=min(len(sig),N-i0)
    if n<=0: return
    gl=gain*(1-pan); gr=gain*(1+pan)
    (bus or (L,R))[0][i0:i0+n]+=sig[:n]*gl; (bus or (L,R))[1][i0:i0+n]+=sig[:n]*gr
def env(n,a,d,s,r,hold):
    t=np.arange(n)/SR; e=np.where(t<a,t/max(a,1e-4),np.where(t<a+d,1-(1-s)*(t-a)/max(d,1e-4),s))
    return np.where(t<hold,e,s*np.clip(1-(t-hold)/max(r,1e-4),0,1))
def lp(sig,cut):
    a=math.exp(-2*math.pi*cut/SR); out=np.empty_like(sig); y=0.0
    for i in range(len(sig)): y=a*y+(1-a)*sig[i]; out[i]=y
    return out
def lp_fast(sig,cut):   # vectorised one-pole via lfilter-like recursion in chunks
    from numpy import cumsum
    a=math.exp(-2*math.pi*cut/SR); n=len(sig)
    if n<4096: return lp(sig,cut)
    # exact recursion with numpy: y[n]=a*y[n-1]+(1-a)x[n]  -> use scipy if present
    try:
        from scipy.signal import lfilter; return lfilter([1-a],[1,-a],sig)
    except Exception: return lp(sig,cut)
def saw(fr,n,det=0.0): ph=np.cumsum(np.full(n,fr*(1+det)/SR))%1.0; return 2*ph-1
def sq(fr,n): ph=np.cumsum(np.full(n,fr/SR))%1.0; return np.where(ph<0.5,1.0,-1.0)
def sine(fr,n): return np.sin(2*np.pi*fr*np.arange(n)/SR)
SAWBUS=(np.zeros(N),np.zeros(N)); GLITBUS=(np.zeros(N),np.zeros(N))
kicks=[]
for ch,s,d,p,v in notes:
    g=v/127; fr=f(p)
    if ch==9:
        if p==36:
            n=int(0.42*SR); t=np.arange(n)/SR; ph=np.cumsum((44+190*np.exp(-t*24))/SR); out=np.sin(2*np.pi*ph)*np.exp(-t*6.5)+0.5*rng.uniform(-1,1,n)*np.exp(-t*160)
            add(s,np.tanh(2.6*out),1.15*g); kicks.append(s)   # heavier: longer, more sub, harder clip
        elif p==38:
            n=int(0.26*SR); t=np.arange(n)/SR; nz=rng.uniform(-1,1,n); nz=nz-np.concatenate(([0],nz[:-1]))*0.5
            out=nz*np.exp(-t*16)+0.9*np.sin(2*np.pi*165*t)*np.exp(-t*28)+0.4*np.sin(2*np.pi*330*t)*np.exp(-t*50)+0.5*np.sin(2*np.pi*90*t)*np.exp(-t*20); add(s,np.tanh(1.8*out),0.8*g)   # heavier: lower body, more noise, clipped
        elif p==35:   # boom: an 808-style sub drop
            n=int(1.4*SR); t=np.arange(n)/SR; ph=np.cumsum((38+120*np.exp(-t*18))/SR); out=np.tanh(2.2*np.sin(2*np.pi*ph))*np.exp(-t*2.2); add(s,out,1.0*g); kicks.append(s)
        elif p==39:   # clap: three noise bursts
            n=int(0.2*SR); t=np.arange(n)/SR; out=np.zeros(n)
            for k in range(3): o=int(k*0.011*SR); out[o:]+=rng.uniform(-1,1,n-o)*np.exp(-np.arange(n-o)/SR*40)
            add(s,out*np.exp(-t*8),0.4*g,0.15)
        elif p in (42,46):
            n=int((0.045 if p==42 else 0.32)*SR); nz=rng.uniform(-1,1,n); nz=nz-np.concatenate(([0],nz[:-1]))
            out=nz*np.exp(-np.arange(n)/SR*(70 if p==42 else 9)); add(s,out,0.22*g,0.25)
        elif p==49:
            n=int(1.8*SR); nz=rng.uniform(-1,1,n); nz=nz-np.concatenate(([0],nz[:-1])); add(s,nz*np.exp(-np.arange(n)/SR*2.2),0.22*g,-0.2)
        continue
    hold=d
    if ch==0:   # organ foundation
        n=int((hold+2.0)*SR); t=np.arange(n)/SR; out=(np.sin(2*np.pi*fr*t)+0.5*np.sin(4*np.pi*fr*t)+0.15*np.sin(6*np.pi*fr*t))*env(n,1.2,0.4,0.9,2.0,hold); add(s,out,0.09*g)
    elif ch==1: # theme organ
        n=int((hold+0.8)*SR); t=np.arange(n)/SR; out=sum(a*np.sin(2*np.pi*fr*k*t) for k,a in ((1,1),(2,.55),(3,.3),(4,.18),(5,.08)))*env(n,0.15,0.3,0.85,0.8,hold); add(s,out,0.11*g,0.1)
    elif ch==2: # bells
        n=int(min(2.8,hold+2.0)*SR); t=np.arange(n)/SR; out=(np.sin(2*np.pi*fr*t)*np.exp(-t*1.5)+0.5*np.sin(2*np.pi*fr*2.76*t)*np.exp(-t*3.5)+0.25*np.sin(2*np.pi*fr*5.4*t)*np.exp(-t*6))*np.minimum(1,t/0.006)
        add(s,out,0.075*g,0.35*math.sin(s*0.7))
    elif ch==3: # brass
        n=int((hold+1.0)*SR); out=np.tanh(1.6*(0.6*saw(fr,n)+0.4*sine(fr,n)))*env(n,0.5,0.4,0.9,1.0,hold); add(s,lp_fast(out,900),0.11*g,-0.1)
    elif ch==4: # sub: sine + a little 2nd, short glide in
        n=int((hold+0.12)*SR); t=np.arange(n)/SR; fe=fr*(1-0.15*np.exp(-t*40)); ph=np.cumsum(fe/SR); out=(np.sin(2*np.pi*ph)+0.25*np.sin(4*np.pi*ph))*env(n,0.004,0.05,0.9,0.12,hold); add(s,np.tanh(1.8*out),0.72*g)   # heavier sub
    elif ch==5: # supersaw: 7 detuned saws, lowpassed, into the sidechain bus
        n=int((hold+0.25)*SR); out=np.zeros(n)
        for det in (-0.012,-0.007,-0.003,0,0.003,0.007,0.012): out+=saw(fr,n,det)
        out=np.tanh(2.4*lp_fast(out/7,2600))*env(n,0.02,0.1,0.9,0.25,hold); add(s,out,0.17*g,0.0,SAWBUS)   # driven
    elif ch==6: # glitter: bright square, fast decay, into its own bus (sidechained lighter)
        n=int(0.35*SR); t=np.arange(n)/SR; out=(sq(fr,n)*0.6+0.4*sine(fr*2,n))*np.exp(-t*9)*np.minimum(1,t/0.002); add(s,out,0.09*g,0.3*math.sin(s*3.1),GLITBUS)
    elif ch==7: # FM glass lead: carrier + modulator at 2x and 3.5x, bright, slight vibrato
        n=int((hold+0.5)*SR); t=np.arange(n)/SR; vib=1+0.004*np.sin(2*np.pi*5.5*t)*np.minimum(1,t/0.3); idx=2.2*np.exp(-t*2)+0.6
        mod=idx*np.sin(2*np.pi*fr*2*vib*t)+0.5*idx*np.sin(2*np.pi*fr*3.5*t); out=np.sin(2*np.pi*fr*vib*t+mod)*env(n,0.01,0.2,0.8,0.5,hold); add(s,out,0.14*g,0.15)
    elif ch==10: # growl bass: saw+square through a wobbling lowpass (LFO at an eighth, faster on long notes), distorted
        n=int((hold+0.15)*SR); t=np.arange(n)/SR; rate=4.0 if hold<1.0 else 6.0
        raw=0.6*saw(fr,n)+0.4*sq(fr,n)+0.5*sine(fr/2,n); cut=250+2200*(0.5+0.5*np.sin(2*np.pi*rate*t-np.pi/2))**2
        out=np.zeros(n); seg=1024
        for i in range(0,n,seg): c=float(cut[min(i,n-1)]); out[i:i+seg]=lp_fast(raw[i:i+seg],c)
        out=np.tanh(3.5*out)*env(n,0.01,0.05,0.9,0.15,hold); add(s,out,0.26*g,0.0,SAWBUS)
    elif ch==8: # risers (p 60) and sweep down (p 48): filtered noise sweep
        n=int(hold*SR); t=np.arange(n)/SR; nz=rng.uniform(-1,1,n)
        up=(p==60); cut=np.where(up,300+6000*(t/hold)**2,6000-5700*(t/hold))
        # cheap variable filter: resonant-ish via two one-poles at a moving cutoff, approximated by segments
        out=np.zeros(n); seg=2048
        for i in range(0,n,seg):
            c=float(cut[min(i,n-1)]); out[i:i+seg]=lp(nz[i:i+seg],c) if seg<4096 else lp_fast(nz[i:i+seg],c)
        out=out*np.minimum(1,t/0.1)*(t/hold if up else (1-t/hold))*2.5; add(s,out,0.11*g,0.0)
# sidechain: duck the saw and glitter buses after every kick
duck=np.ones(N)
for k in kicks:
    i0=int(k*SR); n=int(0.32*SR); t=np.arange(n)/SR; d=0.15+0.85*np.minimum(1,(t/0.32)**1.6); duck[i0:i0+n]=np.minimum(duck[i0:i0+n],d)
L+=SAWBUS[0]*duck+GLITBUS[0]*(0.5+0.5*duck); R+=SAWBUS[1]*duck+GLITBUS[1]*(0.5+0.5*duck)
# hall
def verb(buf,sec,fb,mix):
    d=int(sec*SR); out=buf.copy()
    for i in range(d,len(buf),d):   # block recursion
        m=min(d,len(buf)-i); out[i:i+m]+=out[i-d:i-d+m]*fb*mix
    return out
# 2026-11-04 (Sam: "Add some more reverb"): a bigger hall: four comb stages each side, longer tails, more mix, plus a late diffuse tail
L=verb(L,0.071,0.62,0.42); R=verb(R,0.089,0.62,0.42); L=verb(L,0.173,0.55,0.34); R=verb(R,0.151,0.55,0.34)
L=verb(L,0.233,0.5,0.26); R=verb(R,0.251,0.5,0.26); L=verb(L,0.331,0.45,0.2); R=verb(R,0.307,0.45,0.2)
peak=max(np.abs(L).max(),np.abs(R).max()); print('peak',peak)
pcm=np.empty(2*N,dtype=np.int16); pcm[0::2]=(32000*np.tanh(L/peak*2.0)).astype(np.int16); pcm[1::2]=(32000*np.tanh(R/peak*2.0)).astype(np.int16)   # heavier master drive
import struct
with open(sys.argv[2],'wb') as w:
    w.write(b'RIFF'+struct.pack('<I',36+len(pcm)*2)+b'WAVEfmt '+struct.pack('<IHHIIHH',16,1,2,SR,SR*4,4,16)+b'data'+struct.pack('<I',len(pcm)*2)); w.write(pcm.tobytes())
print('wrote',sys.argv[2],round(total,1))
