"""The Reclamation, Burial pass: Kode9. Dark 2-step at 140 from Sam's Easter form: the horn call E B E F as the chord cycle
(Em Bm Em F), his thumb-piano figure as a glass arpeggio, the stone fifths E2 B2 as a dark pad, the Dreamscape cluster as a vocal
wash, a wobbling sub, no rain (the shore has its sea). Intro 4 bars once (bars 1-4), loop bars 5-36.
Usage: python3 compose_reclaim2.py "<out.mid>" "<out.wav>" """
import sys
from beatkit import *
BPM=140.0
s=Song(BPM,4,swing=0.6,jitter_ms=6,title='The Reclamation (Kode9)')
THUMB=[64,71,67,74,69,71,64,67,71,69,74,64]; CLUSTER=[71,73,75,76]
CYC=[('Em',40,[64,67,71,76])]*2+[('Bm',47,[62,66,71,74])]*2+[('Em',40,[64,67,71,76])]*2+[('F',41,[65,69,72,77])]*2
def twostep(bar,v=1.0,heavy=False):
    s.note('kick_long' if heavy else 'kick',bar,0,vel=int(112*v)); s.note('kick',bar,1.5,vel=int(96*v))
    if bar%2==0: s.note('kick',bar,2.75,vel=int(86*v))
    s.note('snare_dusty',bar,1,vel=int(104*v)); s.note('snare_dusty',bar,3,vel=int(108*v))
    if heavy: s.note('clap',bar,3,vel=int(72*v))
    s.note('rim',bar,2.5,vel=50); s.note('wood',bar,0.75,pitch=84,vel=38)
    for k in range(16):
        bt=k*0.25
        if bt in (1.0,3.0): continue
        s.note('shaker' if k%2 else 'hat',bar,bt,vel=(48 if k%4==2 else 36) if k%2==0 else 40,pan=0.25*((k%4)-1.5))
    if bar%8==7: s.note('hat_open',bar,3.5,vel=60)
pos=0
for bar in range(1,37):
    nm,root,vo=CYC[(bar-1)%8]
    if bar<=4:   # intro once: the sea, the stone fifths, rims, the sub arriving
        for p in (40,47): s.note('paddark',bar,0,pitch=p+12,dur=4,vel=52)
        s.note('rim',bar,1,vel=60); s.note('rim',bar,3,vel=62); 
        for k in range(8): s.note('shaker',bar,k*0.5+0.25,vel=34)
        if bar>=3: s.note('sub',bar,0,pitch=28,dur=3.5,vel=100)
        if bar==4: s.note('riser',bar,0,pitch=60,dur=4,vel=84); s.note('snare_dusty',bar,3,vel=92); s.note('snare_dusty',bar,3.5,vel=100)
        continue
    i=bar-5
    if 16<=i<=19:   # breakdown: the thumb piano alone over the cluster wash
        s.note('rim',bar,1,vel=64); s.note('rim',bar,3,vel=66)
        for k in range(8): s.note('shaker',bar,k*0.5+0.25,vel=34)
        s.note('sub',bar,0,pitch=root-12,dur=3.6,vel=100)
        for p in CLUSTER: s.note('padvox',bar,0,pitch=p,dur=4,vel=44,pan=0.2)
        for k in range(8): s.note('glass',bar,k*0.5,pitch=THUMB[pos%12],dur=0.4,vel=70,pan=-0.3); pos+=1
        if i==19: s.note('riser',bar,0,pitch=60,dur=4,vel=84); s.note('snare_dusty',bar,3,vel=90); s.note('snare_dusty',bar,3.5,vel=100)
        continue
    twostep(bar,v=0.95 if i<8 else 1.0,heavy=(i>=20))
    s.note('sub',bar,0,pitch=root-12,dur=1.4,vel=110); s.note('growl',bar,1.5,pitch=root-12,dur=1.0,vel=92); s.note('sub',bar,2.5,pitch=root-12,dur=1.2,vel=102)
    if i>=20 and bar%2==0: s.note('growl',bar,3,pitch=root,dur=0.9,vel=96)
    if bar%2==1:
        for p in (40,47): s.note('paddark',bar,0,pitch=p+12,dur=8,vel=50)
        for p in vo[:3]: s.note('paddark',bar,0,pitch=p,dur=8,vel=42,pan=0.15)
    if i>=8:
        for k in range(16): s.note('glass' if k%2==0 else 'glitter',bar,k*0.25,pitch=THUMB[pos%12]+(1 if nm=='F' else 0),dur=0.22,vel=(72 if k%4==0 else 56),pan=-0.3+0.6*((k//4)%2)); pos+=1
    if i>=24 and bar%4==1:
        for p in CLUSTER: s.note('padvox',bar,0,pitch=p,dur=4,vel=40,pan=0.25)
    if bar%8==4:
        for k,p in enumerate((76,79,81,83)): s.note('bell',bar,k*0.75,pitch=p,dur=1.2,vel=46,pan=0.4-0.25*k)
s.marker(5,'LOOP START'); s.marker(37,'LOOP END')
s.write_midi(sys.argv[1]); tot=s.render(sys.argv[2],crackle=0.35,rain=0.0,lowpass=9000,warble=0.002,
             verb_mix_voices={'snare_dusty','clap','padvox','glass','bell','rim'},duck={'paddark','padvox'},master_drive=1.6)
print('loop',4*4*60/BPM,'to',36*4*60/BPM,'rendered',tot)
