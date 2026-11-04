"""House of Cards (the jazz mini, Ronnie's): Actress. Hazy, dusty, filtered: detuned Rhodes sevenths over a broken kick, soft hats,
a sub that barely moves, the vocal pad as a smear, heavy crackle, everything under a 5 kHz lid and tape drift. 118 bpm, 32 bars.
Usage: python3 compose_cards.py "<out.mid>" "<out.wav>" """
import sys
from beatkit import *
BPM=118.0
s=Song(BPM,4,swing=0.66,jitter_ms=12,title='House of Cards (Actress)')
CH=[(50,[53,57,60,64]),(50,[53,57,60,64]),(43,[47,50,53,57]),(45,[48,52,55,59]),(50,[53,57,60,64]),(46,[50,53,57,60]),(43,[47,50,53,57]),(45,[48,52,55,59])]  # Dm7 Dm7 Gm7 Am7 Dm7 Bb Gm7 Am7
for bar in range(1,33):
    root,vo=CH[(bar-1)%8]
    s.note('kick',bar,0,vel=92); s.note('kick',bar,2.25 if bar%2 else 2.5,vel=78)
    if bar%4==3: s.note('kick',bar,3.75,vel=70)
    s.note('snare_dusty',bar,1,vel=72); s.note('rim',bar,3,vel=74); s.note('rim',bar,3.5,vel=40)
    for k in range(8): s.note('hat',bar,k*0.5+0.25,vel=36+(8 if k%2 else 0),pan=0.2*((k%2)-0.5))
    if bar%8==7: s.note('hat_open',bar,3.5,vel=46)
    s.note('sub',bar,0,pitch=root-24,dur=2.8,vel=96); 
    if bar%2==0: s.note('sub',bar,3,pitch=root-24,dur=0.8,vel=80)
    pos=(0,1.75,2.5) if bar%2 else (0.5,2,3.25)
    for i,p in enumerate(vo): s.note('rhodes',bar,pos[0],pitch=p+12,dur=1.4,vel=74-i*3,pan=-0.2); s.note('rhodes',bar,pos[1],pitch=p+12,dur=0.6,vel=60,pan=0.2)
    if bar%4==2: s.note('rhodes',bar,pos[2],pitch=vo[2]+24,dur=0.5,vel=66,pan=0.3)
    for p in vo[:3]: s.note('paddark',bar,0,pitch=p,dur=4,vel=48)
    if 9<=bar<=16 or 25<=bar<=32: s.note('padvox',bar,0,pitch=vo[1]+12,dur=3.5,vel=40,pan=0.3)
    if bar%8==5: 
        for k,p in enumerate((vo[3]+12,vo[2]+12,vo[1]+12)): s.note('bell',bar,1+k*0.75,pitch=p,dur=1,vel=42,pan=-0.4+0.4*k)
    if 17<=bar<=20: s.note('vinylstop',bar,3.5,pitch=220,dur=0.5,vel=30) if bar==20 else None
s.write_midi(sys.argv[1]); loop=32*4*60/BPM
tot=s.render(sys.argv[2],total=loop+3.0,loop_seconds=loop,crackle=0.8,rain=0.15,lowpass=5200,warble=0.004,
             verb_mix_voices={'snare_dusty','rhodes','padvox','bell','rim'},duck={'paddark'},master_drive=1.3)
print('loop',loop,'rendered',tot)
