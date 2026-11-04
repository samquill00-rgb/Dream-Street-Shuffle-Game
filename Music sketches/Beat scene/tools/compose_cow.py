"""Ride Jeffrey Bernard's cow: Flying Lotus wonky. 96 bpm, 12 bars = 30.0 s (the game plays it once, then again 6% faster each
time, so a short one). Off-grid drums (swing 0.7, 14 ms jitter), Rhodes sevenths stumbling, a sub that lurches, bitty hats, claps.
Usage: python3 compose_cow.py "<out.mid>" "<out.wav>" """
import sys
from beatkit import *
BPM=135000/1406   # 96.02: 12 bars = 1406 x 1024 samples
s=Song(BPM,4,swing=0.7,jitter_ms=14,title='The cow (wonky)')
CH=[(40,[52,55,59,62]),(45,[52,57,60,64]),(38,[50,53,57,60]),(43,[50,55,59,62])]   # Em7 Am7 Dm7 G
for bar in range(1,13):
    root,vo=CH[(bar-1)%4]
    s.note('kick',bar,0,vel=108); s.note('kick',bar,1.75,vel=92); s.note('kick',bar,2.5 if bar%2 else 2.75,vel=100)
    s.note('snare',bar,1,vel=100); s.note('clap',bar,1,vel=70); s.note('snare',bar,3.25 if bar%3==0 else 3,vel=104)
    for k in range(16):
        bt=k*0.25
        if k%3==0 or k%4==2: s.note('hat',bar,bt,vel=44+(20 if k%4==0 else 0),pan=0.3*((k%4)-1.5))
    if bar%4==0: s.note('hat_open',bar,3.5,vel=60)
    s.note('sub',bar,0,pitch=root-24,dur=1.2,vel=108); s.note('sub',bar,1.75,pitch=root-24,dur=0.6,vel=92); s.note('sub',bar,2.5,pitch=root-24+(5 if bar%2 else 7),dur=1.1,vel=96)
    for i,p in enumerate(vo): s.note('rhodes',bar,0.25 if bar%2 else 0,pitch=p+12,dur=1.5,vel=80-i*4,pan=-0.2); s.note('rhodes',bar,2.75,pitch=p+12,dur=0.8,vel=66,pan=0.2)
    if bar%2==0: s.note('glass',bar,1.5,pitch=vo[3]+12,dur=0.4,vel=78,pan=0.3); s.note('glass',bar,2.25,pitch=vo[2]+12,dur=0.6,vel=72,pan=0.3)
    for p in vo[:2]: s.note('paddark',bar,0,pitch=p,dur=4,vel=44)
    if bar in (8,12): s.note('bell',bar,2,pitch=vo[1]+24,dur=1,vel=48)
s.write_midi(sys.argv[1]); loop=12*4*60/BPM
tot=s.render(sys.argv[2],total=loop+3.0,loop_seconds=loop,crackle=0.35,rain=0.0,lowpass=9000,warble=0.003,
             verb_mix_voices={'snare','clap','rhodes','glass','bell'},duck={'paddark'},master_drive=1.6)
print('loop',loop,'rendered',tot)
