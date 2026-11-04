"""beatkit: the shared score + numpy renderer for the 2026-11-04 beat-scene pass (Burial at the centre; Kode9, Actress,
Flying Lotus, Hudson Mohawke, Rustie as the other colours). A Song holds events in bars/beats with swing and timing jitter,
writes a MIDI for Sam (smf.Score) and renders a stereo 48 kHz wav with the palette below. Voices are named, not GM channels."""
import math, json, struct, numpy as np
from smf import Score
SR=48000
rng=np.random.default_rng(2026)
f=lambda p: 440*2**((p-69)/12)
# ---------------------------------------------------------------- helpers
def env(n,a,d,s,r,hold):
    t=np.arange(n)/SR; e=np.where(t<a,t/max(a,1e-4),np.where(t<a+d,1-(1-s)*(t-a)/max(d,1e-4),s))
    return np.where(t<hold,e,s*np.clip(1-(t-hold)/max(r,1e-4),0,1))
def lp(sig,cut):
    from scipy.signal import lfilter
    a=math.exp(-2*math.pi*min(cut,SR*0.45)/SR); return lfilter([1-a],[1,-a],sig)
def hp(sig,cut):
    from scipy.signal import lfilter
    a=math.exp(-2*math.pi*min(cut,SR*0.45)/SR); return lfilter([a,-a],[1,-a],sig)
def bp(sig,lo,hi): return hp(lp(sig,hi),lo)
def saw(fr,n,det=0.0): return 2*(np.cumsum(np.full(n,fr*(1+det)/SR))%1.0)-1
def sq(fr,n,pw=0.5): return np.where(np.cumsum(np.full(n,fr/SR))%1.0<pw,1.0,-1.0)
def tri(fr,n): return 4*np.abs(np.cumsum(np.full(n,fr/SR))%1.0-0.5)-1
def sine(fr,n,ph0=0.0): return np.sin(2*np.pi*fr*np.arange(n)/SR+ph0)
def noise(n): return rng.uniform(-1,1,n)
def wobble(sig,depth=0.003,rate=0.4):
    """tape warble: resample along a slow sinusoidal time warp (whole-mix pitch drift, Burial's wow)"""
    n=len(sig); t=np.arange(n); warp=t+depth*SR/(2*np.pi*rate)*np.sin(2*np.pi*rate*t/SR)
    return np.interp(np.clip(warp,0,n-1),t,sig)
def verb(buf,stages=((0.071,0.6,0.35),(0.089,0.6,0.35),(0.173,0.5,0.25),(0.151,0.5,0.25)),predelay=0.0):
    out=buf.copy()
    if predelay: pd=int(predelay*SR); out=np.concatenate((np.zeros(pd),out[:-pd]))
    for sec,fb,mix in stages:
        d=int(sec*SR); y=out.copy()
        for i in range(d,len(y),d):
            m=min(d,len(y)-i); y[i:i+m]+=y[i-d:i-d+m]*fb*mix
        out=y
    return out
# ---------------------------------------------------------------- voices (each returns a mono float array)
def v_kick(g,p=None,long=False,hard=1.6):
    n=int((0.5 if long else 0.3)*SR); t=np.arange(n)/SR; ph=np.cumsum((46+170*np.exp(-t*(20 if long else 30)))/SR)
    out=np.sin(2*np.pi*ph)*np.exp(-t*(5.5 if long else 9))+0.45*noise(n)*np.exp(-t*170); return np.tanh(hard*out)*g
def v_808(g,p=None):
    n=int(1.6*SR); t=np.arange(n)/SR; fr=f(p) if p else 41.2; ph=np.cumsum((fr*(1+1.8*np.exp(-t*22)))/SR)
    return np.tanh(2.2*np.sin(2*np.pi*ph))*np.exp(-t*1.9)*g
def v_snare(g,p=None,dusty=False):
    n=int((0.5 if dusty else 0.24)*SR); t=np.arange(n)/SR; nz=noise(n); nz=nz-np.concatenate(([0],nz[:-1]))*0.4
    body=0.8*np.sin(2*np.pi*(175 if dusty else 195)*t)*np.exp(-t*30)+0.4*np.sin(2*np.pi*330*t)*np.exp(-t*55)
    out=(nz*np.exp(-t*(9 if dusty else 20))*(0.9 if dusty else 1.0)+body)
    if dusty: out=bp(out,250,5200)
    return np.tanh(1.5*out)*g
def v_rim(g,p=None):
    n=int(0.08*SR); t=np.arange(n)/SR; out=(np.sin(2*np.pi*1180*t)*0.6+np.sin(2*np.pi*2300*t)*0.3+0.5*noise(n))*np.exp(-t*70); return hp(out,700)*g
def v_clap(g,p=None):
    n=int(0.22*SR); t=np.arange(n)/SR; out=np.zeros(n)
    for k in range(4): o=int(k*0.009*SR); out[o:]+=noise(n-o)*np.exp(-np.arange(n-o)/SR*35)
    return bp(out*np.exp(-t*7),600,7000)*g
def v_hat(g,p=None,open_=False):
    n=int((0.35 if open_ else 0.05)*SR); nz=noise(n); nz=nz-np.concatenate(([0],nz[:-1]))
    return hp(nz*np.exp(-np.arange(n)/SR*(8 if open_ else 65)),5500)*g
def v_shaker(g,p=None):
    n=int(0.09*SR); t=np.arange(n)/SR; out=noise(n)*np.minimum(1,t/0.02)*np.exp(-t*40); return bp(out,3500,9000)*g
def v_wood(g,p=None):
    n=int(0.07*SR); t=np.arange(n)/SR; fr=f(p) if p else 1400; return (np.sin(2*np.pi*fr*t)+0.3*np.sin(2*np.pi*fr*2.4*t))*np.exp(-t*55)*g
def v_ride(g,p=None):
    n=int(0.9*SR); t=np.arange(n)/SR; out=sum(np.sin(2*np.pi*fr*t)*np.exp(-t*(2+k)) for k,fr in enumerate((3100,4350,5800,7700)))*0.25+0.4*hp(noise(n),6000)*np.exp(-t*12)
    return out*g
def v_crash(g,p=None):
    n=int(1.8*SR); nz=noise(n); nz=nz-np.concatenate(([0],nz[:-1])); return hp(nz*np.exp(-np.arange(n)/SR*2.2),3000)*g
def v_sub(g,p,dur,glide=0.15):
    n=int((dur+0.15)*SR); t=np.arange(n)/SR; fr=f(p); fe=fr*(1-glide*np.exp(-t*35)); ph=np.cumsum(fe/SR)
    return np.tanh(1.6*(np.sin(2*np.pi*ph)+0.2*np.sin(4*np.pi*ph)))*env(n,0.006,0.05,0.9,0.15,dur)*g
def v_growl(g,p,dur,rate=4.0):
    n=int((dur+0.15)*SR); t=np.arange(n)/SR; fr=f(p); raw=0.6*saw(fr,n)+0.4*sq(fr,n)+0.5*sine(fr/2,n)
    cut=220+2400*(0.5+0.5*np.sin(2*np.pi*rate*t-np.pi/2))**2; out=np.zeros(n); seg=1024
    for i in range(0,n,seg): out[i:i+seg]=lp(raw[i:i+seg],float(cut[min(i,n-1)]))
    return np.tanh(3.5*out)*env(n,0.01,0.05,0.9,0.15,dur)*g
def v_padvox(g,p,dur,vowel=(700,1200,2600)):
    """the pitched-vocal pad: a bright saw through three fixed formant bands, slow vibrato and breath; reads as a sampled voice"""
    n=int((dur+1.4)*SR); t=np.arange(n)/SR; fr=f(p)*(1+0.006*np.sin(2*np.pi*4.8*t)*np.minimum(1,t/0.5))
    src=2*(np.cumsum(fr/SR)%1.0)-1+0.08*noise(n)
    out=sum(bp(src,fc*0.8,fc*1.25)*w for fc,w in zip(vowel,(1.0,0.6,0.25)))
    return out*env(n,0.12,0.4,0.85,1.4,dur)*g
def v_paddark(g,p,dur):
    n=int((dur+2.0)*SR); fr=f(p); out=(saw(fr,n,-0.006)+saw(fr,n,0.006)+0.7*tri(fr,n))/2.7
    t=np.arange(n)/SR; cut=500+700*(0.5+0.5*np.sin(2*np.pi*0.11*t+1.0)); y=np.zeros(n); seg=4096
    for i in range(0,n,seg): y[i:i+seg]=lp(out[i:i+seg],float(cut[min(i,n-1)]))
    return y*env(n,0.9,0.5,0.85,2.0,dur)*g
def v_padsaw(g,p,dur):
    n=int((dur+0.5)*SR); fr=f(p); out=sum(saw(fr,n,d) for d in (-0.012,-0.007,-0.003,0,0.003,0.007,0.012))/7
    return np.tanh(2.0*lp(out,2600))*env(n,0.03,0.1,0.9,0.5,dur)*g
def v_rhodes(g,p,dur):
    n=int((dur+1.2)*SR); t=np.arange(n)/SR; fr=f(p); idx=(1.6+0.9*(p-60)/24)*np.exp(-t*3.2)
    out=np.sin(2*np.pi*fr*t+idx*np.sin(2*np.pi*fr*7*t)+0.3*np.sin(2*np.pi*fr*2*t))+0.2*np.sin(2*np.pi*fr*2*t)*np.exp(-t*4)
    return out*env(n,0.004,0.6,0.5,1.2,dur)*np.exp(-t*0.8)*g
def v_stab(g,p,dur):
    n=int((dur+0.3)*SR); fr=f(p); out=(saw(fr,n,-0.004)+saw(fr,n,0.004)+sq(fr,n,0.3)*0.5)/2.5
    t=np.arange(n)/SR; cut=400+3200*np.exp(-t*6); y=np.zeros(n); seg=512
    for i in range(0,n,seg): y[i:i+seg]=lp(out[i:i+seg],float(cut[min(i,n-1)]))
    return y*env(n,0.004,0.12,0.6,0.3,dur)*g
def v_bell(g,p,dur):
    n=int(min(3.0,dur+2.0)*SR); t=np.arange(n)/SR; fr=f(p)
    out=np.sin(2*np.pi*fr*t)*np.exp(-t*1.4)+0.5*np.sin(2*np.pi*fr*2.76*t)*np.exp(-t*3.5)+0.25*np.sin(2*np.pi*fr*5.4*t)*np.exp(-t*6)
    return out*np.minimum(1,t/0.005)*g
def v_glass(g,p,dur):
    n=int((dur+0.6)*SR); t=np.arange(n)/SR; fr=f(p); vib=1+0.004*np.sin(2*np.pi*5.5*t)*np.minimum(1,t/0.3); idx=2.2*np.exp(-t*2)+0.6
    return np.sin(2*np.pi*fr*vib*t+idx*np.sin(2*np.pi*fr*2*vib*t)+0.5*idx*np.sin(2*np.pi*fr*3.5*t))*env(n,0.01,0.2,0.8,0.6,dur)*g
def v_brass(g,p,dur):
    n=int((dur+0.4)*SR); fr=f(p); out=sum(saw(fr,n,d) for d in (-0.009,-0.003,0.003,0.009))/4+0.3*sq(fr/2,n)
    t=np.arange(n)/SR; cut=600+2600*np.minimum(1,t/0.12)*np.exp(-t*1.5)+400; y=np.zeros(n); seg=512
    for i in range(0,n,seg): y[i:i+seg]=lp(out[i:i+seg],float(cut[min(i,n-1)]))
    return np.tanh(2.2*y)*env(n,0.02,0.15,0.8,0.4,dur)*g
def v_glitter(g,p,dur):
    n=int(0.35*SR); t=np.arange(n)/SR; fr=f(p); return (sq(fr,n)*0.6+0.4*sine(fr*2,n))*np.exp(-t*9)*np.minimum(1,t/0.002)*g
def v_organ(g,p,dur):
    n=int((dur+0.8)*SR); t=np.arange(n)/SR; fr=f(p); out=sum(a*np.sin(2*np.pi*fr*k*t) for k,a in ((1,1),(2,.55),(3,.3),(4,.18),(5,.08)))
    return out*env(n,0.15,0.3,0.85,0.8,dur)*g
def v_pluck(g,p,dur):
    n=int(0.6*SR); t=np.arange(n)/SR; fr=f(p); out=lp(sq(fr,n,0.35)*0.5+0.5*tri(fr,n),3500+2500*np.exp(-t*8).mean()); return out*np.exp(-t*6)*g
def v_riser(g,p,dur):
    n=int(dur*SR); t=np.arange(n)/SR; nz=noise(n); out=np.zeros(n); seg=2048
    for i in range(0,n,seg): out[i:i+seg]=lp(nz[i:i+seg],float(300+6000*(t[min(i,n-1)]/dur)**2))
    return out*(t/dur)*2.5*np.minimum(1,t/0.1)*g
def v_vinylstop(g,p,dur):
    n=int(dur*SR); t=np.arange(n)/SR; fr=f(p) if p else 220; ph=np.cumsum(fr*(1-t/dur)**1.5/SR); return (np.sin(2*np.pi*ph)*0.5+0.2*noise(n))*(1-t/dur)*g
VOICES={'kick':lambda g,p,d: v_kick(g),'kick_long':lambda g,p,d: v_kick(g,long=True),'808':lambda g,p,d: v_808(g,p),'snare':lambda g,p,d: v_snare(g),
 'snare_dusty':lambda g,p,d: v_snare(g,dusty=True),'rim':lambda g,p,d: v_rim(g),'clap':lambda g,p,d: v_clap(g),'hat':lambda g,p,d: v_hat(g),'hat_open':lambda g,p,d: v_hat(g,open_=True),
 'shaker':lambda g,p,d: v_shaker(g),'wood':lambda g,p,d: v_wood(g,p),'ride':lambda g,p,d: v_ride(g),'crash':lambda g,p,d: v_crash(g),
 'sub':v_sub,'growl':v_growl,'padvox':v_padvox,'paddark':v_paddark,'padsaw':v_padsaw,'rhodes':v_rhodes,'stab':v_stab,'bell':v_bell,'glass':v_glass,
 'brass':v_brass,'glitter':v_glitter,'organ':v_organ,'pluck':v_pluck,'riser':v_riser,'vinylstop':v_vinylstop}
GM={'kick':(9,36),'kick_long':(9,36),'808':(9,35),'snare':(9,38),'snare_dusty':(9,38),'rim':(9,37),'clap':(9,39),'hat':(9,42),'hat_open':(9,46),'shaker':(9,70),'wood':(9,76),'ride':(9,51),'crash':(9,49),
 'sub':(0,38),'growl':(1,87),'padvox':(2,53),'paddark':(3,89),'padsaw':(4,90),'rhodes':(5,4),'stab':(6,81),'bell':(7,14),'glass':(8,88),'brass':(10,62),'glitter':(11,98),'organ':(12,19),'pluck':(13,108),'riser':(14,102),'vinylstop':(15,102)}
# ---------------------------------------------------------------- the song
class Song:
    def __init__(s,bpm,beats_per_bar=4,swing=0.0,jitter_ms=0.0,title=''):
        s.bpm=bpm; s.bpb=beats_per_bar; s.swing=swing; s.jit=jitter_ms; s.ev=[]; s.title=title; s.markers=[]; s.pan={}; s.bus={}
    def beat_s(s): return 60.0/s.bpm
    def t(s,bar,beat):
        """bar (1-based), beat (0-based, fractional). Swing delays the off-eighth 16ths (x.25/x.75) by swing*(16th)."""
        frac=beat-math.floor(beat); off=0.0
        if abs(frac-0.25)<1e-6 or abs(frac-0.75)<1e-6: off=s.swing*0.25
        if abs(frac-0.5)<1e-6: off=s.swing*0.5*0.35   # a little on the 8ths too
        return ((bar-1)*s.bpb+beat+off)*s.beat_s()
    def note(s,voice,bar,beat,pitch=None,dur=0.25,vel=100,pan=0.0,jitter=True):
        t0=s.t(bar,beat)+(rng.normal(0,s.jit/1000) if (jitter and s.jit) else 0)
        s.ev.append((voice,max(0,t0),dur*s.beat_s(),pitch,vel,pan))
    def marker(s,bar,txt): s.markers.append((bar,txt))
    def length(s): return max(t+d for _,t,d,_,_,_ in s.ev)
    # ---- MIDI for Sam
    def write_midi(s,path):
        sc=Score(s.bpm,480,s.title); ppq=480
        for v,(ch,prog) in GM.items():
            if any(e[0]==v for e in s.ev): sc.track(v,ch,None if ch==9 else prog)
        for v,t0,d,p,vel,pan in s.ev:
            ch,prog=GM[v]; pitch=p if (p is not None and ch!=9) else (prog if ch==9 else 60)
            sc.note(v,ch,int(t0/s.beat_s()*ppq),pitch,vel,max(1,int(d/s.beat_s()*ppq)))
        for b,txt in s.markers: sc.marker(int((b-1)*s.bpb*ppq),txt)
        return sc.write(path)
    # ---- render
    def render(s,path,total=None,crackle=0.0,rain=0.0,lowpass=None,warble=0.0,verb_stages=None,verb_mix_voices=None,duck=(),master_drive=1.5,seed=7,loop_seconds=None):
        global rng; rng=np.random.default_rng(seed)
        total=total or (s.length()+2.5); N=int(total*SR); L=np.zeros(N); R=np.zeros(N); WETL=np.zeros(N); WETR=np.zeros(N); kicks=[]
        DUCKL=np.zeros(N); DUCKR=np.zeros(N)
        for v,t0,d,p,vel,pan in s.ev:
            g=vel/127.0; sig=VOICES[v](g,p,d)
            i0=int(t0*SR); n=min(len(sig),N-i0)
            if n<=0: continue
            tgtL,tgtR=(DUCKL,DUCKR) if v in duck else ((WETL,WETR) if (verb_mix_voices and v in verb_mix_voices) else (L,R))
            tgtL[i0:i0+n]+=sig[:n]*(1-pan); tgtR[i0:i0+n]+=sig[:n]*(1+pan)
            if v in ('kick','kick_long','808'): kicks.append(t0)
        if duck:
            dk=np.ones(N)
            for k in kicks:
                i0=int(k*SR); n=min(int(0.3*SR),N-i0); t=np.arange(n)/SR; dk[i0:i0+n]=np.minimum(dk[i0:i0+n],0.2+0.8*np.minimum(1,(t/0.3)**1.5))
            L+=DUCKL*dk; R+=DUCKR*dk
        if verb_mix_voices:
            st=verb_stages or ((0.071,0.6,0.4),(0.089,0.6,0.4),(0.173,0.5,0.3),(0.151,0.5,0.3),(0.233,0.45,0.22),(0.251,0.45,0.22))
            L+=verb(WETL,st); R+=verb(WETR,st)
        if crackle:
            n=N; cr=np.zeros(n); idx=rng.integers(0,n,int(n/SR*55)); amp=rng.uniform(0.2,1.0,len(idx))**3
            for i,a in zip(idx,amp):
                m=min(int(0.004*SR),n-i); cr[i:i+m]+=a*np.exp(-np.arange(m)/SR*1800)*rng.choice((-1,1))
            cr=hp(cr,1800)+0.06*lp(noise(n),900)*np.maximum(0,np.sin(2*np.pi*0.3*np.arange(n)/SR))
            dust=bp(noise(n),400,3000)*0.012
            L+=(cr+dust)*crackle; R+=(np.roll(cr,int(0.0007*SR))+dust*0.9)*crackle
        if rain:
            n=N; rn=bp(noise(n),1200,9000)*0.06*(0.8+0.2*lp(noise(n),0.4))
            idx=rng.integers(0,n,int(n/SR*18))
            for i in idx:
                m=min(int(0.02*SR),n-i); rn[i:i+m]+=0.4*np.sin(2*np.pi*rng.uniform(2500,6000)*np.arange(m)/SR)*np.exp(-np.arange(m)/SR*400)
            L+=rn*rain; R+=np.roll(rn,int(0.011*SR))*rain
        if loop_seconds:   # seamless loop: fold everything past the loop point back onto the start, then cut
            n=int(round(loop_seconds*SR)); n=(n//1024)*1024
            if N>n: L[:N-n]+=L[n:]; R[:N-n]+=R[n:]
            L=L[:n]; R=R[:n]; N=n
        if lowpass: L=lp(L,lowpass); R=lp(R,lowpass)
        if warble: L=wobble(L,warble,0.37); R=wobble(R,warble,0.41)
        peak=max(np.abs(L).max(),np.abs(R).max()) or 1.0
        pcm=np.empty(2*N,dtype=np.int16); pcm[0::2]=(32000*np.tanh(L/peak*master_drive)).astype(np.int16); pcm[1::2]=(32000*np.tanh(R/peak*master_drive)).astype(np.int16)
        with open(path,'wb') as w:
            w.write(b'RIFF'+struct.pack('<I',36+len(pcm)*2)+b'WAVEfmt '+struct.pack('<IHHIIHH',16,1,2,SR,SR*4,4,16)+b'data'+struct.pack('<I',len(pcm)*2)); w.write(pcm.tobytes())
        return total
