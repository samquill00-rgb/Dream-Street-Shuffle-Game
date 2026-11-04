"""The cellar fight (bed 'minigame-retro', tag minigame on Fight starts): Kode9 / Burial dark halftime dubstep at 140.
Kick on 1, snare on 3, a wobbling sub on A with the theme's tail (C B G# A) as the dread motif, detuned minor pads, a ghost of the
vocal pad, rims and shaker in the gaps, no rain (the cellar has its own drips). 32 bars seamless.
Usage: python3 compose_fight.py "<out.mid>" "<out.wav>" """
import sys
from beatkit import *
BPM=360000/2571   # 140.02: 32 bars = 2571 x 1024 samples
s=Song(BPM,4,swing=0.58,jitter_ms=5,title='The Fight (halftime)')
A1,C2,E2,F2,G2s=33,36,40,41,44
TAIL=[48,47,44,45]   # C B G# A (the theme's end), as a bass/dread motif
def half(bar,v=1.0,fill=False):
    s.note('kick_long',bar,0,vel=int(116*v)); s.note('snare_dusty',bar,2,vel=int(112*v)); s.note('clap',bar,2,vel=int(70*v))
    if bar%2==0: s.note('kick',bar,2.75,vel=int(88*v))
    if bar%4==3: s.note('kick',bar,3.5,vel=int(84*v))
    for k in range(16):
        bt=k*0.25
        if k%2==0: s.note('hat',bar,bt,vel=(62 if k%4==0 else 40),pan=0.2*((k%4)-1.5))
        elif k in (3,7,11,15): s.note('shaker',bar,bt,vel=44)
    s.note('rim',bar,1.5,vel=48); s.note('rim',bar,3.25,vel=44)
    if fill:
        for k,vv in enumerate((70,80,92,108)): s.note('snare_dusty',bar,3+k*0.25,vel=vv)
def sub_wob(bar,root,v=112):
    s.note('growl',bar,0,pitch=root,dur=1.5,vel=v-10); s.note('sub',bar,0,pitch=root,dur=1.9,vel=v)
    s.note('sub',bar,2,pitch=root,dur=0.9,vel=v-8); s.note('growl',bar,2.5,pitch=root,dur=1.4,vel=v-6)
for bar in range(1,33):
    root=A1 if (bar-1)%8<6 else (F2 if (bar-1)%8==6 else E2)
    if 13<=bar<=16: # breakdown: no kick, the motif alone on the sub, rims
        s.note('rim',bar,1,vel=66); s.note('rim',bar,2,vel=70); s.note('rim',bar,3.5,vel=60)
        for k in range(8): s.note('shaker',bar,k*0.5+0.25,vel=34)
        s.note('sub',bar,0,pitch=TAIL[(bar-13)]-24,dur=3.6,vel=104)
        if bar==16: s.note('riser',bar,0,pitch=60,dur=4,vel=80); s.note('snare_dusty',bar,3,vel=90); s.note('snare_dusty',bar,3.5,vel=100)
        continue
    half(bar,v=0.94 if bar<=8 else 1.0,fill=(bar%8==0))
    sub_wob(bar,root-12 if root>36 else root)
    if bar%2==1:
        chord=[57,60,64] if root==A1 else ([53,57,60] if root==F2 else [52,56,59])
        for p in chord: s.note('paddark',bar,0,pitch=p,dur=8,vel=56,pan=0.15)
        if bar>=17: s.note('padvox',bar,0,pitch=chord[0]+12,dur=6,vel=48,pan=-0.25)
    if bar%8 in (5,6): 
        for k,p in enumerate(TAIL): s.note('stab',bar,k*0.75+0.5,pitch=p,dur=0.5,vel=84,pan=0.3)
    if bar%8==7: 
        for k,p in enumerate(TAIL): s.note('bell',bar,k*0.5,pitch=p+24,dur=1.0,vel=50,pan=-0.4)
s.write_midi(sys.argv[1]); loop=32*4*60/BPM
tot=s.render(sys.argv[2],total=loop+3.0,loop_seconds=loop,crackle=0.3,rain=0.0,lowpass=8000,warble=0.002,
             verb_mix_voices={'snare_dusty','clap','padvox','bell','rim','stab'},duck={'paddark','padvox'},master_drive=1.7)
print('loop',loop,'rendered',tot)
