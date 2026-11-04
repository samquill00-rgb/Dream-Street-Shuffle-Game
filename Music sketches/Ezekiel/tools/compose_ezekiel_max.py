"""Ezekiel: Sam's Dream Street theme, stated five times, each bigger and more glittering than the last
(2026-11-04, Sam: "develop it beyond the loop though, make it increasingly maximalist and glittery... Rustie").
Material: the 21-note theme at half speed with its own timings (from 'Ezekiel theme variation.mid', Sam's Logic export),
the organ foundation's chord cycle per statement (Am x8 bars, F x2, E x2, Am x4), the wheel bell cycles (G F E / C B G# A E).
120 bpm, 4/4, one statement = 16 bars = 32 s. Intro 2 bars, statements 1-5 (bars 3-82), tail. Game loop: statements 4-5
(bars 51-82 = 100 s to 164 s), so the player sits in the maximal glitter however long they stay.
Rebuild: python3 compose_ezekiel_max.py "../Ezekiel (max).mid" """
import sys, random, mido
from smf import Score
random.seed(93)
BPM=120; PPQ=480; Q=PPQ; E=Q//2; S=Q//4; T=Q//8; BAR=4*Q
sc=Score(BPM,PPQ,'Ezekiel: the theme, five times')
def bar(n): return (n-1)*BAR
ORG='Organ foundation'; THEME='Theme: organ'; BELL='Wheels: metallic bells'; BRASS='Vision: low brass'; SUB='Sub bass'; SAW='Supersaw chords'; GLIT='Glitter arp'; LEAD='Lead: FM glass (theme up)'; FX='Risers / sweeps'; GROWL='Growl bass (wobble)'; DR='Drums (ch 10)'
for name,ch,prog in [(ORG,0,19),(THEME,1,19),(BELL,2,14),(BRASS,3,61),(SUB,4,38),(SAW,5,90),(GLIT,6,98),(LEAD,7,88),(FX,8,102),(GROWL,10,87)]: sc.track(name,ch,prog)
sc.track(DR,9)
N=lambda tr,ch,t,p,v,l: sc.note(tr,ch,t,p,v,l)
# ---- Sam's theme, lifted from his export (track 'Dream Street theme - organ', first statement, times relative to its entry) ----
m=mido.MidiFile(sys.argv[2]); tpb=m.ticks_per_beat
THEME_EV=[]
for t in m.tracks:
    if 'theme' not in t.name.lower(): continue
    tick=0; on={}
    for x in t:
        tick+=x.time
        if x.type=='note_on' and x.velocity>0: on[x.note]=tick
        elif x.type in ('note_off','note_on') and x.note in on: s=on.pop(x.note); THEME_EV.append((s,x.note,tick-s))
THEME_EV.sort(); t0=THEME_EV[0][0]
ST1=[(s-t0,p,d) for s,p,d in THEME_EV if s-t0 < 16*BAR]          # the first statement (11 notes)
assert len(ST1)==11, len(ST1)
# chord cycle under one statement (bars 1-16 of the statement): root, triad
CYC=[('Am',57,[57,60,64])]*8+[('F',53,[53,57,60])]*2+[('E',52,[52,56,59])]*2+[('Am',57,[57,60,64])]*4
KICK,SNARE,CLAP,HH,OH,CRASH,RIDE,BOOM=36,38,39,42,46,49,51,35
def theme(tr,ch,b0,v=96,oct=0,dbl=None):
    for s,p,d in ST1:
        N(tr,ch,bar(b0)+s,p+oct,v+random.randint(-3,3),int(d*0.96))
        if dbl is not None: N(tr,ch,bar(b0)+s,p+dbl,v-10,int(d*0.96))
def foundation(b0,v=70,hi=False):
    for i,(nm,r,tri) in enumerate(CYC):
        if i>0 and CYC[i-1][0]==nm: continue
        n=1
        while i+n<16 and CYC[i+n][0]==nm: n+=1
        for p in (r-12,r-5): N(ORG,0,bar(b0+i),p,v,n*BAR-E)
        if hi:
            for p in tri: N(ORG,0,bar(b0+i),p,v-16,n*BAR-E)
def wheels(b0,density=1,v=72,oct=0):
    """cycle one G F E every 0.75 s from bar 9; cycle two C B G# A E every 1.25 s from bar 13; density doubles them"""
    c1=[79,77,76]; c2=[72,71,68,69,76]
    t=bar(b0+8); i=0
    while t<bar(b0+16):
        N(BELL,2,t,c1[i%3]+oct,v+random.randint(-6,2),int(0.75*2*Q*0.9)); t+=int(0.75*2*Q/density); i+=1
    t=bar(b0+12); i=0
    while t<bar(b0+16):
        N(BELL,2,t,c2[i%5]+oct,v-4+random.randint(-6,2),int(1.25*2*Q*0.9)); t+=int(1.25*2*Q/density); i+=1
def brass(b0,v=84):
    for i,(s,p,d) in enumerate(ST1):
        if d>=2*Q: N(BRASS,3,bar(b0)+s,p-12 if p>=60 else p-12,v,int(d*0.95))
def sub(b0,v=104,pattern='pulse'):
    for i,(nm,r,tri) in enumerate(CYC):
        t=bar(b0+i); root=r-24
        if pattern=='pulse':      # 1 and the 'and' of 3, long
            N(SUB,4,t,root,v,int(2.4*Q)); N(SUB,4,t+int(2.5*Q),root,v-8,int(1.4*Q))
        elif pattern=='halftime': # with the kick: 1, 'and' of 2, 'and' of 3 glide note
            N(SUB,4,t,root,v,int(1.4*Q)); N(SUB,4,t+int(1.5*Q),root,v-6,E); N(SUB,4,t+int(2.5*Q),root+ (12 if i%4==3 else 0),v-4,int(1.4*Q))
        elif pattern=='octaves':
            for k in range(8): N(SUB,4,t+k*E,root+(12 if k in (3,7) else 0),v-(10 if k%2 else 0),int(E*0.9))
def growl(b0,v=100,mode='answer'):
    """2026-11-04 (Sam: "heavier"): a wobble bass on the roots. 'answer': the 'and' of 3 and beat 4 each bar; 'wall': eighths, with the octave
    on the last; a long held growl across bars 15-16 of the statement"""
    for i,(nm,r,tri) in enumerate(CYC):
        t=bar(b0+i); root=r-24
        if i>=14: 
            if i==14: N(GROWL,10,t,root,v+4,2*BAR-E)
            continue
        if mode=='answer': N(GROWL,10,t+int(2.5*Q),root,v,E); N(GROWL,10,t+3*Q,root+(12 if i%2 else 0),v-6,int(0.9*Q))
        else:
            for k in range(8): N(GROWL,10,t+k*E,root+(12 if k==7 else (7 if k==5 else 0)),v-(8 if k%2 else 0),int(E*0.95))
def supersaw(b0,v=78,stab=False):
    for i,(nm,r,tri) in enumerate(CYC):
        t=bar(b0+i); vo=[r,r+7,r+12]+[p+12 for p in tri]
        if not stab:
            for p in vo: N(SAW,5,t,p,v-(8 if p>70 else 0),BAR-S)
        else:                      # sidechained stabs: 1, 'and' of 2, 4
            for pos in (0,1.5,3):
                for p in vo: N(SAW,5,t+int(pos*Q),p,v-(8 if p>70 else 0),int(0.9*Q if pos==3 else 0.6*Q))
def glitter(b0,rate=S,v=82,span=2,start_bar=1,end_bar=17):
    """chord tones climbing through 'span' octaves in fast notes, falling back, the 'glass' arp"""
    for i,(nm,r,tri) in enumerate(CYC):
        if i+1<start_bar or i+1>=end_bar: continue
        t=bar(b0+i); tones=[p+12 for p in tri]; seq=[]
        for o in range(span): seq+=[p+12*o for p in tones]
        seq=seq+seq[-2:0:-1]
        k=0
        while k*rate<BAR:
            p=seq[k%len(seq)]; N(GLIT,6,t+k*rate,p,v-(14 if k%2 else 0)+random.randint(-4,3),int(rate*0.8)); k+=1
def lead(b0,v=100,oct=12,unison=True):
    for s,p,d in ST1:
        N(LEAD,7,bar(b0)+s,p+oct,v+random.randint(-3,3),int(d*0.94))
        if unison: N(LEAD,7,bar(b0)+s,p+oct+12,v-18,int(d*0.9))
def drums_half(b0,bars=range(16),hats='8',rolls=True,crash_first=True,clap=False,v=1.0,heavy=False):
    for i in bars:
        t=bar(b0+i)
        N(DR,9,t,KICK,int(112*v),S); N(DR,9,t+int(1.5*Q),KICK,int(96*v),S)
        N(DR,9,t+2*Q,SNARE,int(110*v),S)
        if clap: N(DR,9,t+2*Q,CLAP,int(100*v),S)
        if i%4==3: N(DR,9,t+int(3.5*Q),KICK,int(92*v),S)
        if heavy:
            if i%4==0: N(DR,9,t,BOOM,int(110*v),Q)
            N(DR,9,t+int(3.5*Q),KICK,int(96*v),S); N(DR,9,t+2*Q+T,SNARE,int(80*v),S)   # a flam under the snare
        if hats=='8':
            for k in range(8): N(DR,9,t+k*E,HH,int((80 if k%2==0 else 58)*v),S)
        else:
            for k in range(16):
                if rolls and i%2==1 and k>=12: continue
                N(DR,9,t+k*S,HH,int((82 if k%4==0 else 62 if k%2==0 else 48)*v),S)
            if rolls and i%2==1:
                for k in range(8): N(DR,9,t+3*Q+k*T,HH,int((60+k*5)*v),T)   # 32nd roll on beat 4
        if i%4==3: N(DR,9,t+3*Q+E,OH,int(84*v),E)
        if crash_first and i==0: N(DR,9,t,CRASH,110,Q)
        if i in (7,15):
            for k,vv in enumerate((86,92,100,110)): N(DR,9,t+3*Q+k*S,SNARE,int(vv*v),S)
def snare_build(b,bars=2):
    for j in range(bars):
        t=bar(b+j); div=S if j<bars-1 else T
        k=0
        while k*div<BAR: N(DR,9,t+k*div,SNARE,70+int(50*(j*BAR+k*div)/(bars*BAR)),div); k+=1
def riser(b,bars=2,v=90): N(FX,8,bar(b),60,v,bars*BAR)
def sweep_down(b,v=80): N(FX,8,bar(b),48,v,BAR)
# ================= FORM =================
sc.marker(bar(1),'INTRO: the foundation wakes (4 s)')
for p in (45,52): N(ORG,0,bar(1),p,66,2*BAR-E)
# ---- statement 1 (bars 3-18): as Sam heard it, organ alone, wheels from bar 11 ----
sc.marker(bar(3),'I: the theme on organ, the wheels begin')
foundation(3,70); theme(THEME,1,3,96); wheels(3,1,70)
# ---- statement 2 (bars 19-34): brass under, sub pulse, bells doubled, the first glitter at the end ----
sc.marker(bar(19),'II: brass, sub pulse, the bells doubled')
foundation(19,72); theme(THEME,1,19,100); wheels(19,2,76); brass(19,84); sub(19,100,'pulse')
for i in range(16):
    t=bar(19+i)
    for k in range(8): N(DR,9,t+k*E,HH,56 if k%2 else 70,S)
    if i>=8: N(DR,9,t,KICK,96,S); N(DR,9,t+2*Q,KICK,84,S)
glitter(19,S,74,1,13,17); riser(33,2,80); snare_build(33,2)
# ---- statement 3 (bars 35-50): halftime drums, supersaw pads, the theme on FM glass an octave up ----
sc.marker(bar(35),'III: halftime drums, supersaw, the theme on glass')
foundation(35,74,hi=True); theme(THEME,1,35,100); lead(35,98,12,False); wheels(35,2,80); brass(35,92)
sub(35,106,'halftime'); supersaw(35,76); drums_half(35,range(16),'8',False,True)
for i in range(8,14): N(GROWL,10,bar(35+i)+int(2.5*Q),CYC[i][1]-24,92,E)
glitter(35,S,80,2,1,17); riser(49,2,88); snare_build(49,2); sweep_down(50)
# ---- statement 4 (bars 51-66): LOOP START. everything, 16th hats with rolls, stabs, glitter in 32nds ----
sc.marker(bar(51),'LOOP START / IV: maximal (stabs, rolls, glitter 32nds, lead in octaves)')
foundation(51,78,hi=True); theme(THEME,1,51,104,dbl=12); lead(51,104,12,True); wheels(51,4,84); wheels(51,2,80,12); brass(51,98)
sub(51,110,'halftime'); supersaw(51,84,stab=True); drums_half(51,range(16),'16',True,True,clap=True,heavy=True); growl(51,102,'answer')
glitter(51,T,86,2,1,9); glitter(51,S,86,3,9,17); riser(65,2,96); snare_build(65,2)
# ---- statement 5 (bars 67-82): the top. lead in octaves, bells cascading, octave sub, both glitters ----
sc.marker(bar(67),'V: the top (octave sub, both glitters, bell cascades)')
foundation(67,80,hi=True); theme(THEME,1,67,106,dbl=12); lead(67,108,12,True); lead(67,90,24,False); wheels(67,4,88); wheels(67,4,84,12); brass(67,104)
sub(67,112,'octaves'); supersaw(67,88,stab=True); drums_half(67,range(16),'16',True,True,clap=True,v=1.05,heavy=True); growl(67,106,'wall')
glitter(67,T,90,3,1,17); glitter(67,S,78,2,1,17)
for i in range(16):   # bell cascades on every bar: a run down the Am tones from high
    t=bar(67+i)
    for k,p in enumerate([93,88,84,81,76,72]): N(BELL,2,t+2*Q+k*T,p,84-k*4,int(Q))
riser(81,2,100); snare_build(81,2); sweep_down(82)
sc.marker(bar(83),'LOOP END (back to bar 51)')
# tail hit (the file as a piece)
for p in (33,45,52,57,60,64,69,72,76): N(SAW,5,bar(83),p,96,2*BAR)
for p in (45,52,57): N(ORG,0,bar(83),p,90,2*BAR)
N(SUB,4,bar(83),33,112,2*BAR); N(GROWL,10,bar(83),33,110,2*BAR); N(DR,9,bar(83),BOOM,112,Q); N(DR,9,bar(83),KICK,112,S); N(DR,9,bar(83),CRASH,112,Q); N(LEAD,7,bar(83),81,104,2*BAR); N(BELL,2,bar(83),93,90,BAR)
print('bytes',sc.write(sys.argv[1]),'seconds',84*4*60/BPM,'loop',50*4*60/BPM,'to',82*4*60/BPM)
