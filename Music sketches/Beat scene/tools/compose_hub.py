"""Dean Street hub loop, Burial (2026-11-04, Sam: "I want this whole game to have the aesthetic vibe of burial. Including the
introductory passages music"). Sam's Dream Street theme (his Logic export, 'Bluebird' lead, 21 notes) as the pitched vocal, at half
speed over a 2-step at 138, over Am / F / E; crackle, rain, tape wow, sub slides, a dusty snare, ghost rims, the wheel bells G F E.
32 bars, seamless (the hub player loops sample-level). Usage: python3 compose_hub.py "<experiment.mid>" "<out.mid>" "<out.wav>" """
import sys, mido
from beatkit import *
BPM=360000/2608          # 138.04: 32 bars = exactly 2608 x 1024 samples at 48 kHz (AAC loop alignment)
s=Song(BPM,4,swing=0.62,jitter_ms=7,title='Dean Street (Burial)')
BARS=32
# ---- Sam's theme ----
m=mido.MidiFile(sys.argv[1]); tpb=m.ticks_per_beat
lead=None
for t in m.tracks:
    n=[x for x in t if x.type=='note_on' and x.velocity>0]
    if len(n)==21: lead=t
tick=0; on={}; TH=[]
for x in lead:
    tick+=x.time
    if x.type=='note_on' and x.velocity>0: on[x.note]=tick
    elif x.type in ('note_off','note_on') and x.note in on: st=on.pop(x.note); TH.append((st/tpb,x.note,(tick-st)/tpb))
TH.sort(); ST1=[e for e in TH if e[0]<32]   # the first statement: 11 notes over 32 beats of 120
def vox(b0,oct=0,vel=84,voice='padvox',half=2.0,vowel=None):
    for bt,p,d in ST1:
        bb=bt*half; bar=b0+int(bb//4); beat=bb%4
        s.note(voice,bar,beat,pitch=p+oct,dur=d*half*0.92,vel=vel,jitter=False)
CYC=[(57,[57,60,64,67])]*8+[(53,[53,57,60,65])]*2+[(52,[52,56,59,64])]*2+[(57,[57,60,64,67])]*4   # Am7 x8, F x2, E x2, Am7 x4 (per 16 bars)
def chord_at(bar): return CYC[(bar-1)%16]
# ---- drums: 2-step ----
def twostep(bar,ghost=True,open_=False,v=1.0):
    s.note('kick',bar,0,vel=int(108*v)); s.note('kick',bar,1.5,vel=int(94*v))
    if bar%4==2: s.note('kick',bar,2.75,vel=int(84*v))
    s.note('snare_dusty',bar,1,vel=int(100*v)); s.note('snare_dusty',bar,3,vel=int(104*v))
    if ghost: s.note('rim',bar,2.5,vel=52); s.note('rim',bar,3.75,vel=46); s.note('wood',bar,0.75,pitch=84,vel=40)
    for k in range(16):
        bt=k*0.25
        if bt in (1.0,3.0): continue
        s.note('shaker' if k%2 else 'hat',bar,bt,vel=(46 if k%4==2 else 34) if k%2==0 else 40,pan=0.25*((k%4)-1.5))
    if open_ or bar%8==7: s.note('hat_open',bar,3.5,vel=58)
# ---- sub: slides on the roots, Burial's long notes ----
def sub(bar,v=108):
    r,_=chord_at(bar); s.note('sub',bar,0,pitch=r-24,dur=1.4,vel=v); s.note('sub',bar,1.5,pitch=r-24,dur=0.9,vel=v-10)
    if bar%2==0: s.note('sub',bar,3,pitch=r-24+(7 if bar%4==0 else 12),dur=0.9,vel=v-14)
# ================= form (32 bars) =================
s.marker(1,'A: crackle, the 2-step, the theme pitched down, bars 1-16')
for bar in range(1,33):
    r,tri=chord_at(bar)
    if 9<=bar<=12 or 25<=bar<=27:            # breakdowns: drums drop to rims and shaker, the sub and pad hold
        s.note('rim',bar,1,vel=70); s.note('rim',bar,3,vel=66)
        for k in range(8): s.note('shaker',bar,k*0.5+0.25,vel=36)
        if bar in (12,27): s.note('snare_dusty',bar,3.5,vel=90); s.note('snare_dusty',bar,3.75,vel=96)
    else: twostep(bar,v=1.0 if bar>16 else 0.92)
    sub(bar)
    if bar%2==1: 
        for p in tri[:3]: s.note('paddark',bar,0,pitch=p,dur=8,vel=58,pan=0.1)
    if bar%4==3: s.note('rhodes',bar,2.5,pitch=tri[1]+12,dur=1.2,vel=62,pan=-0.3); s.note('rhodes',bar,2.5,pitch=tri[3]+12,dur=1.2,vel=58,pan=-0.3)
# the theme: statement 1 (bars 1-16) as the vocal pad at pitch; statement 2 (17-32) an octave up with a fifth-down echo, as if a second sample
vox(1,0,86,'padvox'); vox(17,12,80,'padvox',vowel=None); vox(17,-5+0,54,'padvox')
# the wheel bells G F E, far back, every 8 bars
for b0 in (5,13,21,29):
    for k,p in enumerate((79,77,76)): s.note('bell',b0,k*0.75*1.0,pitch=p,dur=1.5,vel=46,pan=0.4-0.4*k)
s.write_midi(sys.argv[2])
loop=BARS*4*60/BPM
tot=s.render(sys.argv[3],total=loop+3.0,loop_seconds=loop,crackle=0.55,rain=0.35,lowpass=9500,warble=0.0025,
             verb_mix_voices={'snare_dusty','padvox','rhodes','bell','rim','wood'},duck={'paddark','padvox'},master_drive=1.4)
print('loop seconds',loop,'rendered',tot)
