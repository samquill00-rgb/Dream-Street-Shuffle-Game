"""compose_bed.py <preset> <out.mid> <out.wav>: the gap-filling beds of the 2026-11-05 nightwork, one preset each, all Burial-shaped
(crackle, sub, the vocal pad, 2-step ghosts), no rain anywhere but 'pillars-rain' (Sam's rule). Venue beds are 'through the wall':
a hard lowpass lid and a lot of hall, meant to sit under Sam's real recordings. Seamless loops."""
import sys
from beatkit import *
name=sys.argv[1]
def am(): return [(57,[57,60,64,67]),(57,[57,60,64,67]),(53,[53,57,60,65]),(52,[52,56,59,64])]
PRE={
 'night-ahead': dict(bpm=138.0,bars=64,swing=0.6,jit=8,crackle=0.5,lid=8000,wow=0.003,drive=1.3,verb=('snare_dusty','padvox','rhodes','bell','rim')),
 'street':      dict(bpm=138.0,bars=64,swing=0.62,jit=8,crackle=0.45,lid=7000,wow=0.0025,drive=1.3,verb=('snare_dusty','padvox','bell','rim','wood')),
 'pillars-rain':dict(bpm=120.0,bars=16,swing=0,jit=0,crackle=0.15,lid=None,wow=0,drive=1.0,verb=()),
 'portal':      dict(bpm=120.0,bars=24,swing=0,jit=0,crackle=0.3,lid=9000,wow=0.004,drive=1.2,verb=('bell','padvox','glass')),
 'maltese':     dict(bpm=140.0,bars=24,swing=0.55,jit=6,crackle=0.4,lid=6000,wow=0.002,drive=1.4,verb=('rim','padvox','stab')),
 'cecil':       dict(bpm=96.0,bars=24,swing=0.6,jit=10,crackle=0.5,lid=7000,wow=0.004,drive=1.2,verb=('bell','rhodes','padvox','rim')),
 'french':      dict(bpm=100.0,bars=24,swing=0.66,jit=10,crackle=0.4,lid=1700,wow=0.004,drive=1.2,verb=('rhodes','padvox','rim','snare_dusty')),
 'pillars':     dict(bpm=132.0,bars=24,swing=0.62,jit=8,crackle=0.4,lid=1500,wow=0.003,drive=1.3,verb=('snare_dusty','padvox','rim')),
 'coach':       dict(bpm=96.0,bars=24,swing=0.68,jit=12,crackle=0.4,lid=1800,wow=0.004,drive=1.2,verb=('rhodes','rim','ride')),
 'trishas':     dict(bpm=84.0,bars=24,swing=0.6,jit=10,crackle=0.45,lid=1600,wow=0.004,drive=1.2,verb=('rhodes','padvox','bell')),
 'colony':      dict(bpm=136.0,bars=24,swing=0.62,jit=8,crackle=0.45,lid=1300,wow=0.003,drive=1.4,verb=('snare_dusty','padvox','rim')),
 'cellar':      dict(bpm=70.0,bars=16,swing=0,jit=0,crackle=0.35,lid=2500,wow=0.002,drive=1.3,verb=('padvox','bell','rim')),
 'chippy':      dict(bpm=120.0,bars=24,swing=0.3,jit=4,crackle=0.3,lid=2600,wow=0.003,drive=1.3,verb=('snare','glass','clap')),
 'bookshop':    dict(bpm=72.0,bars=16,swing=0.5,jit=8,crackle=0.5,lid=4000,wow=0.004,drive=1.1,verb=('rhodes','bell')),
}[name]
s=Song(PRE['bpm'],4,swing=PRE['swing'],jitter_ms=PRE['jit'],title=name); B=PRE['bars']; rain=0.0
TH=[(0,67,4.75),(6,65,0.64),(6.66,67,0.57),(7.66,64,5.77),(14,62,0.72),(14.67,64,0.82),(15.66,60,4.48),(20,59,2),(23,56,1.02),(24,57,5.49)]  # Sam's theme, beats at 120
def theme(voice,b0,oct=0,vel=70,stretch=2.0,pan=0.2):
    for bt,p,d in TH:
        bb=bt*stretch; s.note(voice,b0+int(bb//4),bb%4,pitch=p+oct,dur=d*stretch*0.9,vel=vel,pan=pan,jitter=False)
def ghost2step(bar,kick=True,v=1.0):
    if kick: s.note('kick',bar,0,vel=int(84*v)); s.note('kick',bar,1.5,vel=int(70*v))
    s.note('snare_dusty',bar,1,vel=int(70*v)); s.note('rim',bar,3,vel=int(72*v)); s.note('rim',bar,2.5,vel=int(44*v))
    for k in range(8): s.note('shaker',bar,k*0.5+0.25,vel=int(32*v),pan=0.2*((k%2)-0.5))
    if bar%8==7: s.note('hat_open',bar,3.5,vel=int(48*v))
def subline(bar,root,v=100): s.note('sub',bar,0,pitch=root-24,dur=1.8,vel=v); s.note('sub',bar,2.5,pitch=root-24,dur=1.2,vel=v-12)
CH=am()
if name=='night-ahead':
    # 64 bars, a slow build and fall (2026-11-05 04:15): I 1-16 sub + pad + the theme as the vocal; II 17-32 rims then the 2-step without
    # a kick; III 33-48 the full 2-step, the theme an octave up with a Rhodes shadow; IV 49-64 the drums thin out again so the loop breathes.
    for bar in range(1,B+1):
        root,vo=CH[((bar-1)//4)%4]
        subline(bar,root,96 if bar<=32 else 102)
        if bar%2==1:
            for p in vo[:3]: s.note('paddark',bar,0,pitch=p,dur=8,vel=52 if bar<=32 else 58)
        if bar<=16: s.note('rim',bar,3,vel=50)
        elif bar<=24: s.note('rim',bar,1,vel=56); s.note('rim',bar,3,vel=60); [s.note('shaker',bar,k*0.5+0.25,vel=30) for k in range(8)]
        elif bar<=32: ghost2step(bar,kick=False,v=0.8)
        elif bar<=48: ghost2step(bar,kick=True,v=0.9)
        elif bar<=56: ghost2step(bar,kick=(bar%2==1),v=0.75)
        else: s.note('rim',bar,1,vel=50); s.note('rim',bar,3,vel=54); [s.note('shaker',bar,k*0.5+0.25,vel=26) for k in range(8)]
        if bar%8==5:
            for k,p in enumerate((79,77,76)): s.note('bell',bar,k*0.75,pitch=p+(12 if bar>32 else 0),dur=1.5,vel=44,pan=0.4-0.4*k)
        if bar in (32,48): s.note('riser',bar,0,pitch=60,dur=4,vel=60)
    theme('padvox',1,0,78); theme('padvox',17,0,70); theme('padvox',33,12,70); theme('rhodes',33,0,40,2.0,-0.3); theme('padvox',49,0,62); theme('padvox',49,-12,40)
elif name=='street':
    # 64 bars (04:15): the street comes and goes; kick only in bars 17-32 and 49-60, the vocal smear every eighth bar, a long sub elsewhere.
    for bar in range(1,B+1):
        root,vo=CH[((bar-1)//4)%4]
        subline(bar,root,98)
        if 17<=bar<=32 or 49<=bar<=60: ghost2step(bar,kick=True,v=0.75)
        elif 9<=bar<=16 or 33<=bar<=44: ghost2step(bar,kick=False,v=0.7)
        else: s.note('rim',bar,3,vel=48); [s.note('shaker',bar,k*0.5+0.25,vel=26) for k in range(8)]
        if bar%2==1:
            for p in vo[:3]: s.note('paddark',bar,0,pitch=p,dur=8,vel=48)
        if bar%8==2: s.note('padvox',bar,0,pitch=vo[1]+12,dur=5,vel=44,pan=0.3)
        if bar%8==6: s.note('wood',bar,2.75,pitch=84,vel=40); s.note('bell',bar,1,pitch=vo[3]+12,dur=1.2,vel=36)
        if bar%16==12: s.note('padvox',bar,0,pitch=vo[0]+12,dur=7,vel=38,pan=-0.3)
elif name=='pillars-rain':
    rain=0.9; s.note('paddark',1,0,pitch=40,dur=4,vel=8)
elif name=='portal':
    for bar in range(1,B+1):
        s.note('paddark',bar,0,pitch=33,dur=4,vel=56) if bar%4==1 else None
        if bar%4==1:
            for p in (45,52,57): s.note('paddark',bar,0,pitch=p,dur=16,vel=46)
        if bar%3==0: s.note('sub',bar,0,pitch=33,dur=3,vel=96)
        if bar%2==0: s.note('bell',bar,1.5,pitch=[76,79,81,83,84][bar%5]+12,dur=2,vel=44,pan=0.5-0.25*(bar%4))
        if bar%6==1: s.note('glass',bar,0,pitch=69,dur=3,vel=40,pan=-0.3)
    theme('padvox',5,-12,58,3.0,0.2)
elif name=='maltese':
    for bar in range(1,B+1):
        root=45 if bar%8<6 else 44
        s.note('sub',bar,0,pitch=root-24,dur=2.4,vel=104); s.note('growl',bar,2.5,pitch=root-12,dur=1.2,vel=70)
        s.note('rim',bar,1,vel=60); s.note('rim',bar,3,vel=64); s.note('kick',bar,0,vel=76) if bar>8 else None
        for k in range(8): s.note('shaker',bar,k*0.5+0.25,vel=30)
        if bar%4==3:
            for k,p in enumerate((57,56,52)): s.note('stab',bar,2+k*0.5,pitch=p,dur=0.4,vel=70)
        if bar%2==1:
            for p in (45,48,52): s.note('paddark',bar,0,pitch=p+12,dur=8,vel=46)
        if bar%8==4: s.note('padvox',bar,0,pitch=64,dur=6,vel=40,pan=0.3)
elif name=='cecil':
    CHS=[(50,[62,65,69,72]),(43,[59,62,65,67]),(48,[60,64,67,71]),(45,[57,60,64,67])]
    for bar in range(1,B+1):
        root,vo=CHS[((bar-1)//2)%4]
        s.note('sub',bar,0,pitch=root-12,dur=3,vel=88)
        for i,p in enumerate(vo): s.note('rhodes',bar,0.5 if bar%2 else 0,pitch=p,dur=1.6,vel=62-i*3,pan=-0.2)
        s.note('rim',bar,2,vel=50); s.note('rim',bar,3.5,vel=36)
        for k in range(4): s.note('hat',bar,k+0.5,vel=30)
        if bar%4==1: s.note('bell',bar,2,pitch=vo[2]+24,dur=1.5,vel=42,pan=0.4)
        if bar%8==5: s.note('padvox',bar,0,pitch=vo[1]+12,dur=6,vel=40,pan=0.25)
else:   # the venues, through the wall
    V={'french':dict(ch=[(50,[53,57,60,65]),(43,[47,50,53,59]),(48,[52,55,60,64]),(45,[48,52,55,60])],kick=False,rh=True,vox=True),
       'pillars':dict(ch=am(),kick=True,rh=False,vox=True),
       'coach':dict(ch=[(43,[47,50,53,57]),(48,[52,55,59,62]),(41,[45,48,52,57]),(43,[47,50,53,57])],kick=False,rh=True,vox=False),
       'trishas':dict(ch=[(45,[48,52,55,59]),(41,[45,48,52,57]),(43,[47,50,53,59]),(45,[48,52,55,59])],kick=False,rh=True,vox=True),
       'colony':dict(ch=am(),kick=True,rh=False,vox=True),
       'cellar':dict(ch=[(33,[45,48,52]),(33,[45,48,52]),(32,[44,47,51]),(33,[45,48,52])],kick=False,rh=False,vox=True),
       'chippy':dict(ch=[(48,[60,64,67,72]),(43,[59,62,67,71]),(45,[57,60,64,69]),(41,[57,60,65,69])],kick=True,rh=False,vox=False),
       'bookshop':dict(ch=[(45,[57,60,64,67]),(41,[53,57,60,65]),(43,[55,59,62,67]),(45,[57,60,64,67])],kick=False,rh=True,vox=False)}[name]
    for bar in range(1,B+1):
        # 04:30: a B section (bars 9-16 of each 24) runs the chords backwards and drops the kick, so a wall bed is not one phrase on repeat
        bsec = 9 <= ((bar-1) % 24) + 1 <= 16
        root,vo=V['ch'][(3-((bar-1)//2)%4) if bsec else ((bar-1)//2)%4]
        s.note('sub',bar,0,pitch=root-12,dur=2.4,vel=92)
        if name=='cellar':
            s.note('sub',bar,2,pitch=root-12,dur=1.8,vel=84); s.note('growl',bar,1.5,pitch=root,dur=1.5,vel=56) if bar%4==0 else None
            for p in vo: s.note('paddark',bar,0,pitch=p,dur=4,vel=50)
            if bar%4==2: s.note('bell',bar,1,pitch=vo[0]+24,dur=2,vel=36,pan=0.4)
            if bar%8==5: s.note('padvox',bar,0,pitch=vo[1]+12,dur=6,vel=42)
            s.note('rim',bar,3,vel=40) if bar%2 else None
            continue
        if V['kick']: ghost2step(bar,kick=not bsec,v=0.85)
        else:
            s.note('rim',bar,1,vel=52); s.note('rim',bar,3,vel=56)
            for k in range(8): s.note('shaker' if name!='coach' else 'ride',bar,k*0.5+(0.25 if k%2 else 0),vel=28 if k%2 else 36)
            if name=='coach': s.note('snare_dusty',bar,1,vel=44); s.note('snare_dusty',bar,3,vel=48)
        if V['rh']:
            for i,p in enumerate(vo): s.note('rhodes',bar,0.5 if bar%2 else 0,pitch=p+12,dur=1.5,vel=66-i*3,pan=-0.2)
            if name in ('french','trishas') and bar%2==0: s.note('rhodes',bar,2.5,pitch=vo[2]+24,dur=0.8,vel=56,pan=0.2)
        else:
            for p in vo[:3]: s.note('paddark',bar,0,pitch=p,dur=4,vel=50)
            if name=='chippy':
                for k in range(8): s.note('pluck',bar,k*0.5,pitch=vo[k%4]+12,vel=60 if k%2==0 else 46,pan=0.2); 
                s.note('glass',bar,1.5,pitch=vo[3]+12,dur=0.5,vel=58,pan=-0.3) if bar%2 else None
        if V['vox'] and bar%4==1: s.note('padvox',bar,0,pitch=vo[1]+12,dur=7,vel=44,pan=0.25)
        if name=='bookshop' and bar%4==3: s.note('bell',bar,2,pitch=vo[2]+24,dur=2,vel=34,pan=0.4)
# 04:20: the open-air beds were 80-90% sub energy (inaudible on a laptop, which is where Sam plays): sub pulled 6 dB on the beds
# that are not 'through a wall', so the pads, vocal and crackle carry them.
if name in ('night-ahead','street','portal','maltese','cecil'): s.ev=[(v,t,d,pp,vel*0.5 if v=='sub' else vel,pan) for (v,t,d,pp,vel,pan) in s.ev]
s.write_midi(sys.argv[2]); loop=B*4*60/PRE['bpm']
tot=s.render(sys.argv[3],total=loop+3.0,loop_seconds=loop,crackle=PRE['crackle'],rain=rain,lowpass=PRE['lid'],warble=PRE['wow'],
             verb_mix_voices=set(PRE['verb']),duck={'paddark','padvox'} if name not in ('pillars-rain','portal','cellar') else (),master_drive=PRE['drive'])
print(name,'loop %.3f'%loop)
