"""Cecil Court Waltz: Burial / Actress in three. 90 bpm, 3/4, EXACTLY 16 bars = 32.000 s (the game is beat-locked: BAR_MS 2000,
audioBase = floor(t/2)*2), downbeat at sample 0, seamless. Kick on 1, a dusty snare and rims on 2 and 3, shaker, sub on the root,
the vocal pad and a Rhodes carrying a minor waltz (Am Dm E Am | F Dm E Am), bells, heavy crackle and the Cecil Court fog as rain.
Usage: python3 compose_waltz.py "<out.mid>" "<out.wav>" """
import sys
from beatkit import *
BPM=90.0
s=Song(BPM,3,swing=0.5,jitter_ms=6,title='Cecil Court Waltz (Burial)')
PROG=[(57,[57,60,64]),(50,[50,53,57]),(52,[52,56,59]),(57,[57,60,64]),(53,[53,57,60]),(50,[50,53,57]),(52,[52,56,59,62]),(57,[57,60,64])]
MEL=[[(0,76,2),(2,74,1)],[(0,72,1.5),(1.5,74,0.5),(2,72,1)],[(0,71,2),(2,68,1)],[(0,69,3)],
     [(0,72,2),(2,74,1)],[(0,77,1.5),(1.5,76,0.5),(2,74,1)],[(0,71,1),(1,72,1),(2,71,1)],[(0,69,3)]]
for bar in range(1,17):
    root,tri=PROG[(bar-1)%8]
    s.note('kick',bar,0,vel=104); s.note('sub',bar,0,pitch=root-24,dur=2.6,vel=104)
    s.note('snare_dusty',bar,1,vel=78); s.note('rim',bar,2,vel=70); s.note('rim',bar,1.5,vel=40)
    if bar%4==0: s.note('snare_dusty',bar,2.5,vel=72)
    for k in range(6): s.note('shaker',bar,k*0.5+0.25,vel=38,pan=0.2*((k%2)-0.5)); s.note('hat',bar,k*0.5,vel=30 if k else 46)
    for p in tri: s.note('paddark',bar,0,pitch=p,dur=3,vel=54,pan=0.1)
    s.note('rhodes',bar,1,pitch=tri[1]+12,dur=0.8,vel=60,pan=-0.3); s.note('rhodes',bar,2,pitch=tri[0]+12,dur=0.8,vel=56,pan=-0.3)
    for pos,p,d in MEL[(bar-1)%8]: s.note('padvox',bar,pos,pitch=p-12 if bar<=8 else p,dur=d*0.9,vel=72 if bar<=8 else 66,pan=0.2)
    if bar in (4,12): s.note('bell',bar,2,pitch=tri[0]+24,dur=1.5,vel=48,pan=0.4)
    if bar==16: s.note('bell',bar,0,pitch=81,dur=2,vel=50,pan=0.4); s.note('bell',bar,1,pitch=76,dur=2,vel=46,pan=-0.4)
s.write_midi(sys.argv[1]); loop=16*3*60/BPM
tot=s.render(sys.argv[2],total=loop+3.0,loop_seconds=loop,crackle=0.6,rain=0.4,lowpass=8500,warble=0.003,
             verb_mix_voices={'snare_dusty','padvox','rhodes','bell','rim'},duck={'paddark'},master_drive=1.4)
print('loop',loop,'rendered',tot)
