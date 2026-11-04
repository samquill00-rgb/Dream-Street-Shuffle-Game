"""PP Pong (Percy's): Hudson Mohawke bounce. The game plays the file at 1.12x, so this is 125 bpm to land at 140: big synth-brass stabs,
808 drops, trap hats, a glass lead poking at the theme's G F G E, claps, sidechained supersaw. 16 bars seamless.
Usage: python3 compose_pong.py "<out.mid>" "<out.wav>" """
import sys
from beatkit import *
BPM=125.0
s=Song(BPM,4,swing=0.3,jitter_ms=2,title='PP Pong (HudMo)')
CH=[(45,[57,61,64,69]),(45,[57,61,64,69]),(41,[53,57,60,65]),(43,[55,59,62,67]),(45,[57,61,64,69]),(50,[62,65,69,74]),(41,[53,57,60,65]),(43,[55,59,62,67])]   # A F G A D F G: HudMo's major-ish lift
LEAD=[(0,79,0.75),(1,77,0.5),(1.5,79,0.5),(2,76,1.5)]
for bar in range(1,17):
    root,vo=CH[(bar-1)%8]
    s.note('808',bar,0,pitch=root-12,vel=118); s.note('kick',bar,0,vel=110); s.note('kick',bar,1.75,vel=96); s.note('kick',bar,2.5,vel=100)
    if bar%2==0: s.note('808',bar,2.5,pitch=root-12,vel=100)
    s.note('snare',bar,1,vel=108); s.note('clap',bar,1,vel=96); s.note('snare',bar,3,vel=110); s.note('clap',bar,3,vel=100)
    for k in range(16):
        bt=k*0.25
        if bar%4==3 and k>=12: s.note('hat',bar,3+(k-12)*0.125,vel=58+(k-12)*6); s.note('hat',bar,3+(k-12)*0.125+0.0625,vel=50)
        else: s.note('hat',bar,bt,vel=(72 if k%4==0 else 46 if k%2 else 58),pan=0.15*((k%4)-1.5))
    if bar%4==0: s.note('hat_open',bar,3.5,vel=70)
    for pos in (0,1.5,3):
        for i,p in enumerate(vo): s.note('brass',bar,pos,pitch=p-12,dur=0.6 if pos<3 else 0.9,vel=104-i*4,pan=0.1)
    for p in vo: s.note('padsaw',bar,0,pitch=p,dur=4,vel=62)
    if bar%2==1:
        for pos,p,d in LEAD: s.note('glass',bar,pos,pitch=p+(0 if bar<9 else 12),dur=d,vel=92,pan=-0.3)
    else:
        s.note('glass',bar,0.5,pitch=74,dur=0.5,vel=84,pan=-0.3); s.note('glass',bar,1.5,pitch=76,dur=0.5,vel=84,pan=-0.3); s.note('glass',bar,2.5,pitch=79,dur=1.2,vel=88,pan=-0.3)
    if bar>=9:
        for k in range(8): s.note('glitter',bar,k*0.5+0.25,pitch=vo[k%4]+24,vel=66,pan=0.4)
    if bar==16: s.note('riser',bar,0,pitch=60,dur=4,vel=76)
s.write_midi(sys.argv[1]); loop=16*4*60/BPM
tot=s.render(sys.argv[2],total=loop+3.0,loop_seconds=loop,crackle=0.12,rain=0.0,lowpass=None,warble=0.0,
             verb_mix_voices={'snare','clap','glass','glitter'},duck={'padsaw','brass'},master_drive=1.8)
print('loop',loop,'rendered',tot)
