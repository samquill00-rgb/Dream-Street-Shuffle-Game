"""Nazca Race, Burial pass: Hudson Mohawke / Rustie trap-rave at 140. The pampa tune (Sam's, from the race sketch) on an FM glass
lead with synth-brass answers, the hummingbird beat-line as glitter, 808s under the roots (Em D C Bm / G D Em C), trap hats with
rolls, claps, supersaw lifts in the chorus. Intro 4 bars once, loop bars 5-36.
Usage: python3 compose_race2.py "<out.mid>" "<out.wav>" """
import sys
from beatkit import *
BPM=140.0
s=Song(BPM,4,swing=0.25,jitter_ms=2,title='Nazca Race (HudMo)')
E3,G3,A3,B3,D4,E4,G4,A4,B4,D5,E5,G5,A5,B5,D6=52,55,57,59,62,64,67,69,71,74,76,79,81,83,86
PH_A=[ [(0,E5,2),(2,G5,1),(3,A5,1),(4,B5,2),(6,G5,2)],[(0,D5,3),(3,E5,1),(4,B4,2),(6,D5,2)],[(0,A4,2),(2,B4,1),(3,D5,1),(4,A5,3),(7,E5,1)],[(0,B4,5),(6,A4,1),(7,B4,1)],
       [(0,E5,2),(2,G5,1),(3,D6,1),(4,B5,2),(6,A5,2)],[(0,E5,2),(2,D5,1),(3,E5,1),(4,B4,2),(6,D5,2)],[(0,A4,1),(1,B4,1),(2,D5,2),(4,B4,12)],[] ]
PH_C=[ [(0,G5,3),(3,A5,1),(4,B5,3),(7,A5,1)],[(0,G5,2),(2,A5,2),(4,D5,4)],[(0,E5,3),(3,G5,1),(4,A5,2),(6,B5,2)],[(0,A5,2),(2,G5,2),(4,E5,4)],
       [(0,G5,3),(3,A5,1),(4,B5,3),(7,D6,1)],[(0,B5,2),(2,A5,2),(4,G5,2),(6,A5,2)],[(0,E5,2),(2,G5,1),(3,E5,1),(4,D5,2),(6,B4,2)],[(0,E5,8)] ]
BEATLINE=[E5,A5,E5,E5, A5,A5,E5,B4, E5,A5,D6,A5, E5,E5,A5,E5, B4,E5,A5,E5, E5,A5,A5,E5, B4,E5,B4,B4, E5,E5,G5,D5]
CH={'Em':(40,[52,55,59,64]),'D':(38,[50,54,57,62]),'C':(36,[48,52,55,60]),'Bm':(35,[47,50,54,59]),'G':(43,[50,55,59,62])}
VERSE=['Em','Em','D','D','C','C','Bm','Bm']; CHORUS=['G','G','D','D','Em','Em','C','C']
def trap(bar,v=1.0,rolls=True):
    s.note('kick',bar,0,vel=int(112*v)); s.note('kick',bar,1.75,vel=int(94*v)); s.note('kick',bar,2.5,vel=int(104*v))
    s.note('snare',bar,2,vel=int(112*v)); s.note('clap',bar,2,vel=int(84*v))
    for k in range(16):
        bt=k*0.25
        if rolls and bar%2==0 and k>=12: s.note('hat',bar,3+(k-12)*0.125,vel=56+(k-12)*5); s.note('hat',bar,3+(k-12)*0.125+0.0625,vel=48)
        else: s.note('hat',bar,bt,vel=(70 if k%4==0 else 44 if k%2 else 56),pan=0.15*((k%4)-1.5))
    if bar%4==3: s.note('hat_open',bar,3.5,vel=66)
def mel(voice,bar,events,v=96,oct=0,pan=-0.3):
    for pos,p,l in events: s.note(voice,bar,pos*0.5,pitch=p+oct,dur=l*0.5*0.9,vel=v,pan=pan)
for bar in range(1,37):
    if bar<=4:  # intro: 808 and the beat-line glitter, hats building
        root=CH['Em'][0]; s.note('808',bar,0,pitch=root,vel=110)
        for k in range(8): s.note('glitter',bar,k*0.5,pitch=BEATLINE[(bar-1)*8+k],vel=70,pan=0.3)
        for k in range(16): s.note('hat',bar,k*0.25,vel=40+bar*6,pan=0.15*((k%4)-1.5))
        if bar==4: s.note('riser',bar,0,pitch=60,dur=4,vel=84); 
        for k,vv in enumerate((70,80,92,108)): 
            if bar==4: s.note('snare',bar,3+k*0.25,vel=vv)
        continue
    i=bar-5; sect='verse' if i<8 or 16<=i<24 else 'chorus'
    chord=(VERSE if sect=='verse' else CHORUS)[i%8]; root,vo=CH[chord]
    trap(bar,v=1.0 if sect=='chorus' else 0.95)
    s.note('808',bar,0,pitch=root,vel=118); s.note('808',bar,2.5,pitch=root,vel=100)
    if bar%2==0: s.note('808',bar,3.5,pitch=root+(7 if sect=='chorus' else 12),vel=92)
    for pos in (1.5,3.5): 
        for j,p in enumerate(vo): s.note('brass',bar,pos,pitch=p,dur=0.45,vel=98-j*4,pan=0.1)
    if sect=='chorus':
        for p in vo: s.note('padsaw',bar,0,pitch=p+12,dur=4,vel=66)
        mel('glass',bar,PH_C[i%8],100,0); mel('brass',bar,PH_C[i%8],80,-12,0.2)
    else:
        mel('glass',bar,PH_A[i%8],96,0)
        for k in range(8): s.note('glitter',bar,k*0.5+0.25,pitch=BEATLINE[(i*8+k)%32],vel=62,pan=0.35)
    if i>=24:
        for k in range(16): s.note('glitter',bar,k*0.25,pitch=BEATLINE[(i*16+k)%32]+12,vel=58,pan=0.4)
    if i in (7,15,23,31): s.note('riser',bar,0,pitch=60,dur=4,vel=70); s.note('crash',bar+1 if bar<36 else 36,0,vel=90)
s.marker(5,'LOOP START'); s.marker(37,'LOOP END')
s.write_midi(sys.argv[1]); tot=s.render(sys.argv[2],crackle=0.1,rain=0.0,lowpass=None,warble=0.0,
             verb_mix_voices={'snare','clap','glass','glitter'},duck={'padsaw','brass'},master_drive=1.8)
print('loop',4*4*60/BPM,'to',36*4*60/BPM,'rendered',tot)
