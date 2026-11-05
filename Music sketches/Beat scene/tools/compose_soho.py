"""compose_soho.py <variant> <out.mid> <out.wav>: THE ONE SOHO BED (2026-11-05 afternoon, Sam: "the music jumps about ... the dean street
theme stands out as being unlike the others ... simplify the background stuff in the soho world"; "Yes, one Soho bed").
Built from his Dean Street theme (Music sketches/Dream Street Shuffle experiment.mid: A minor, 120, the Bluebird melody G E C B G# A over a
walking bass): the melody at half speed as the vocal pad, organ chords under it (Am7 Fmaj7 Dm7 E7 Am), the sub on the roots, bells and a
Rhodes shadow on later statements. No drums: crackle and night air. 64 bars at 120 = a 128 s seamless loop; four statements of the theme.
Variants, one song: 'street' (outdoors), 'wall' (the same, heard through a pub wall: lid 1500 Hz, more hall), 'rain' (street + the Pillars' rain)."""
import sys
from beatkit import *
variant=sys.argv[1]
s=Song(120.0,4,swing=0.0,jitter_ms=6,title='soho-'+variant); B=64
TH=[(0,67,4.75),(6,65,0.64),(6.66,67,0.57),(7.66,64,5.77),(14,62,0.72),(14.67,64,0.82),(15.66,60,4.48),(20,59,2),(23,56,1.02),(24,57,5.49)]
LONG=[(0,67,4.75),(7.66,64,5.77),(15.66,60,4.48),(24,57,5.49)]
def theme(voice,b0,oct=0,vel=70,stretch=2.0,pan=0.2,notes=TH,dmul=0.9):
    for bt,p,d in notes:
        bb=bt*stretch; s.note(voice,b0+int(bb//4),bb%4,pitch=p+oct,dur=d*stretch*dmul,vel=vel,pan=pan,jitter=False)
# chords per bar of a 16-bar statement (the theme stretched x2): Am7 x4, Fmaj7 x4, Dm7 x2, E7 x2, Am x4
CH=[(45,[45,52,55,60])]*4+[(41,[41,48,52,57])]*4+[(38,[38,45,48,53])]*2+[(40,[40,47,50,56])]*2+[(45,[45,52,57,60])]*4
for bar in range(1,B+1):
    st=(bar-1)//16; k=(bar-1)%16; root,vo=CH[k]
    newchord = k in (0,4,8,10,12)
    if newchord:
        length=4 if k in (0,4,12) else 2
        v=38 if st in (0,3) else 44
        for i,p in enumerate(vo): s.note('organ',bar,0,pitch=p,dur=length*4-0.3,vel=v-(4 if i==0 else 0),pan=(-0.25,0.1,-0.1,0.25)[i],jitter=False)
        s.note('sub',bar,0,pitch=root-12,dur=length*4-0.5,vel=60 if st<3 else 52)  # 2026-11-05: sub held down (was 84/74: half the energy below 80 Hz, a laptop hears none of it and the pad paid for the headroom)
    if st>=1 and k in (2,6,14): s.note('bell',bar,2,pitch=vo[2]+24,dur=2.5,vel=30 if st==3 else 36,pan=0.45-0.3*(k%3))
    if st==2 and k in (9,11): s.note('glass',bar,1,pitch=vo[1]+24,dur=2.5,vel=30,pan=-0.4)
# the theme: I the pad alone; II the pad with its long notes doubled in bells; III an octave up with a Rhodes shadow; IV low and distant
theme('padvox',1,0,64,2.0,0.15)
theme('padvox',17,0,62,2.0,0.15); theme('bell',17,12,34,2.0,-0.3,LONG,0.5)
theme('padvox',33,12,54,2.0,0.2); theme('rhodes',33,0,36,2.0,-0.3)
theme('padvox',49,-12,50,2.0,0.1); theme('padvox',49,0,40,2.0,-0.1)
s.write_midi(sys.argv[2])
if variant=='street': s.render(sys.argv[3],total=130,crackle=0.45,rain=0.0,lowpass=7000,warble=0.0025,verb_mix_voices=('padvox','bell','rhodes','glass'),master_drive=1.25,loop_seconds=128)
elif variant=='wall': s.render(sys.argv[3],total=130,crackle=0.3,rain=0.0,lowpass=1500,warble=0.004,verb_mix_voices=('padvox','bell','rhodes','glass','organ'),verb_stages=((0.071,0.7,0.5),(0.089,0.7,0.5),(0.173,0.6,0.4),(0.151,0.6,0.4),(0.233,0.55,0.3),(0.251,0.55,0.3)),master_drive=1.2,loop_seconds=128)
elif variant=='rain': s.render(sys.argv[3],total=130,crackle=0.3,rain=0.9,lowpass=7000,warble=0.0025,verb_mix_voices=('padvox','bell','rhodes','glass'),master_drive=1.25,loop_seconds=128)
print('rendered',variant)
