"""Pyramid Run, Burial pass: Rustie glitter-trap at 160 on Sam's material: his four arpeggio groups (D A D A | D# A D A | D A D F# | F A D A,
the Searching-hum motif in the roots) as glitter 16ths, his final chord D F# A D stacking as supersaw, 808s on the roots, trap hats with
rolls, an FM glass lead on the group tops. Intro 4 bars once, loop bars 5-36.
Usage: python3 compose_run2.py "<out.mid>" "<out.wav>" """
import sys
from beatkit import *
BPM=160.0
s=Song(BPM,4,swing=0.2,jitter_ms=2,title='Pyramid Run (Rustie)')
GROUPS=[[62,69,74,69],[63,69,74,69],[62,69,74,78],[65,69,74,69]]; ROOTS=[62,63,62,65]; FINAL=[62,66,69,74]
def trap(bar,v=1.0):
    s.note('kick',bar,0,vel=int(112*v)); s.note('kick',bar,1.5,vel=int(96*v)); s.note('kick',bar,2.75,vel=int(100*v))
    s.note('snare',bar,2,vel=int(112*v)); s.note('clap',bar,2,vel=int(80*v))
    for k in range(16):
        bt=k*0.25
        if bar%4==0 and k>=12: s.note('hat',bar,3+(k-12)*0.125,vel=56+(k-12)*5); s.note('hat',bar,3+(k-12)*0.125+0.0625,vel=46)
        else: s.note('hat',bar,bt,vel=(68 if k%4==0 else 42 if k%2 else 54),pan=0.15*((k%4)-1.5))
    if bar%2==1: s.note('hat_open',bar,3.5,vel=62)
g=0
for bar in range(1,37):
    grp=GROUPS[g%4]; root=ROOTS[g%4]-24
    if bar<=4:
        s.note('808',bar,0,pitch=root,vel=108)
        for k in range(16): s.note('hat',bar,k*0.25,vel=36+bar*8,pan=0.15*((k%4)-1.5))
        if bar>=3:
            for k in range(8): s.note('glitter',bar,k*0.5,pitch=grp[k%4]+12,vel=70,pan=0.3)
        if bar==4:
            s.note('riser',bar,0,pitch=60,dur=4,vel=84)
            for k,vv in enumerate((70,80,92,108)): s.note('snare',bar,3+k*0.25,vel=vv)
        g+=1 if bar%2==0 else 0; continue
    i=bar-5
    trap(bar,v=0.95 if i<8 else 1.0)
    s.note('808',bar,0,pitch=root,vel=118); s.note('808',bar,2.75,pitch=root,vel=98)
    if i%2==1: s.note('808',bar,3.5,pitch=root+12,vel=88)
    for k in range(16): s.note('glitter',bar,k*0.25,pitch=grp[k%4]+(12 if k<8 else 24),vel=(76 if k%4==0 else 58),pan=-0.35+0.7*((k//4)%2))
    if 8<=i<16 or i>=24:
        for j,p in enumerate(FINAL): s.note('padsaw',bar,0,pitch=p,dur=4,vel=64-j*2)
        for pos in (1.5,3.5):
            for j,p in enumerate(FINAL): s.note('brass',bar,pos,pitch=p-12,dur=0.45,vel=96-j*4,pan=0.1)
    if i>=16:
        s.note('glass',bar,0,pitch=grp[2]+12,dur=0.9,vel=98,pan=-0.3); s.note('glass',bar,1.5,pitch=grp[3]+12,dur=0.4,vel=90,pan=-0.3); s.note('glass',bar,2.5,pitch=grp[0]+12,dur=1.2,vel=96,pan=-0.3)
    if i>=24: s.note('growl',bar,1.5,pitch=root+12,dur=0.9,vel=94); s.note('growl',bar,3,pitch=root+12,dur=0.9,vel=90)
    if i in (7,15,23,31): s.note('riser',bar,0,pitch=60,dur=4,vel=72); s.note('crash',min(36,bar+1),0,vel=92)
    if bar%2==0: g+=1
s.marker(5,'LOOP START'); s.marker(37,'LOOP END')
s.write_midi(sys.argv[1]); tot=s.render(sys.argv[2],crackle=0.08,rain=0.0,lowpass=None,warble=0.0,
             verb_mix_voices={'snare','clap','glass','glitter'},duck={'padsaw','brass','growl'},master_drive=1.8)
print('loop',4*4*60/BPM,'to',36*4*60/BPM,'rendered',tot)
