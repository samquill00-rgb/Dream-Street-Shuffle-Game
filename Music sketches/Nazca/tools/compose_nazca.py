import sys, random
from smf import Score
random.seed(7)
BPM=108; PPQ=480; Q=PPQ; E=Q//2; S=Q//4; BAR=4*Q
sc=Score(BPM,PPQ,'Nazca pampa 108')
def bar(n): return (n-1)*BAR
PAN1='Zampona 1 (pan pipes, ira)'; PAN2='Zampona 2 (pan pipes, arca)'; QUENA='Quena (Andean flute)'; GTR='Nylon guitar (rumba strum)'; CHAR='Charango (tremolo)'; BASS='Bass (acoustic)'; PAD='Pampa air (pad)'; PERC='Percussion (ch 10): bombo, cajon, claves, shaker'
sc.track(PAN1,0,75); sc.track(PAN2,1,75); sc.track(QUENA,2,73); sc.track(GTR,3,24); sc.track(CHAR,4,24); sc.track(BASS,5,32); sc.track(PAD,6,89); sc.track(PERC,9)
N=lambda tr,ch,t,p,v,l: sc.note(tr,ch,t,p,v,l)
# E minor pentatonic + Andean colour
E3,G3,A3,B3,D4,E4,G4,A4,B4,D5,E5,G5,A5,B5,D6,E6=52,55,57,59,62,64,67,69,71,74,76,79,81,83,86,88
F4,C5,FS4=65,72,66
# chords (two bars each): Em D C Bm
CHORDS={'Em':[40,47,52,55,59],'D':[38,45,50,54,57],'C':[36,43,48,52,55],'Bm':[35,42,47,50,54],'G':[43,47,50,55,59]}
PROG=['Em','Em','D','D','C','C','Bm','Bm']   # one entry per bar
BASSROOT={'Em':(40,47),'D':(38,45),'C':(36,43),'Bm':(35,42),'G':(43,50)}

def strum(t,chord,v,down=True,l=E,stagger=14,muted=False):
    notes=CHORDS[chord] if down else list(reversed(CHORDS[chord]))
    for i,p in enumerate(notes):
        N(GTR,3,t+i*stagger,p+12 if False else p,(v*0.35 if muted else v)-i*3,(S//2 if muted else l))
def rumba_bar(b,chord,v=92):
    """rumba-flamenca feel: 1 down, 1-and-a up, 2 chuck, 2-and down-up, 3 down, 3-and-a up, 4 chuck, 4-and up"""
    t=bar(b)
    strum(t,chord,v,True,Q); strum(t+3*S,chord,v-22,False,S)
    strum(t+Q,chord,v,True,S,muted=True); strum(t+Q+2*S,chord,v-10,True,S); strum(t+Q+3*S,chord,v-24,False,S)
    strum(t+2*Q,chord,v-4,True,Q); strum(t+2*Q+3*S,chord,v-22,False,S)
    strum(t+3*Q,chord,v,True,S,muted=True); strum(t+3*Q+2*S,chord,v-14,False,S); strum(t+3*Q+3*S,chord,v-20,False,S)
def bass_bar(b,chord,v=96):
    t=bar(b); r,f=BASSROOT[chord]
    N(BASS,5,t,r,v,Q*0.9); N(BASS,5,t+Q+E,f,v-16,E*0.9); N(BASS,5,t+2*Q,r,v-6,Q*0.9); N(BASS,5,t+3*Q+E,f if b%2 else r+12,v-14,E*0.9)
BOMBO,CJBASS,CJSLAP,CJGHOST,CLAVE,SHAKER,CABASA,WOOD=41,64,63,62,75,82,69,76
def perc_bar(b,full=True,clave=True,shaker=True,fill=False):
    t=bar(b); odd=(b%2==1)
    if full:
        N(PERC,9,t,BOMBO,112,E); N(PERC,9,t+2*Q,BOMBO,100,E)
        if not odd: N(PERC,9,t+3*Q+E,BOMBO,90,E)
        N(PERC,9,t,CJBASS,100,S); N(PERC,9,t+Q+E,CJBASS,88,S); N(PERC,9,t+2*Q+E,CJBASS,80,S)
        N(PERC,9,t+Q,CJSLAP,104,S); N(PERC,9,t+3*Q,CJSLAP,108,S)
        for k in range(16):
            if k%4 in (1,3) and random.random()<0.7: N(PERC,9,t+k*S,CJGHOST,40+random.randint(0,18),S//2)
    if clave:
        hits=[0,1.5,3] if odd else [1,2]        # son clave 3-2
        for h in hits: N(PERC,9,t+int(h*Q),CLAVE,96,S)
    if shaker:
        for k in range(16): N(PERC,9,t+k*S,SHAKER,(78 if k%2==0 else 52)+(10 if k%4==0 else 0),S//2)
    if fill:
        for k,v in enumerate((70,80,90,100)): N(PERC,9,t+3*Q+k*S,CJSLAP if k%2 else CJBASS,v,S)
def mel(tr,ch,b,events,v=100,oct=0,pan_breath=True):
    """events: (eighth position, pitch, length in eighths)"""
    for pos,p,l in events:
        vel=v+random.randint(-6,4)+(6 if pos%2==0 else 0)
        N(tr,ch,bar(b)+int(pos*E),p+oct,vel,int(l*E*0.92))
# ---- phrases ----
PH_A=[ [(0,E5,2),(2,G5,1),(3,A5,1),(4,G5,2),(6,E5,2)],
       [(0,D5,3),(3,E5,1),(4,D5,2),(6,B4,2)],
       [(0,A4,2),(2,B4,1),(3,D5,1),(4,E5,3),(7,D5,1)],
       [(0,B4,5),(6,A4,1),(7,B4,1)],
       [(0,E5,2),(2,G5,1),(3,B5,1),(4,A5,2),(6,G5,2)],
       [(0,E5,2),(2,D5,1),(3,E5,1),(4,D5,2),(6,B4,2)],
       [(0,A4,1),(1,B4,1),(2,D5,2),(4,B4,2),(6,A4,2)],
       [(0,E5,6)] ]
# the hummingbird: a running line split between two pipes (ira/arca hocket), sikuri style
RUN=[E5,G5,A5,G5,E5,D5,E5,G5, A5,B5,A5,G5,E5,D5,B4,D5, E5,G5,A5,B5,D6,B5,A5,G5, E5,D5,E5,G5,A5,G5,E5,D5,
     B4,D5,E5,G5,A5,G5,E5,D5, E5,G5,A5,B5,A5,G5,E5,D5, B4,D5,E5,D5,B4,A4,B4,D5, E5,E5,E5,E5,G5,E5,D5,E5]
def hocket(b_start,nbars,v=96):
    for i in range(nbars*8):
        p=RUN[i%len(RUN)]; t=bar(b_start)+i*E
        tr,ch=(PAN1,0) if i%2==0 else (PAN2,1)
        N(tr,ch,t,p,v+random.randint(-5,5)+(5 if i%4==0 else 0),int(E*0.85))
def flutter(tr,ch,t,p1,p2,n=6,v=90):
    for i in range(n): N(tr,ch,t+i*(S//2),p1 if i%2==0 else p2,v-i*4,S//2)
def charango_trem(b,chord,v=70,beats=(0,1,2,3)):
    top=[p+24 for p in CHORDS[chord][-3:]]
    for q in beats:
        for k in range(4):
            for p in top: N(CHAR,4,bar(b)+q*Q+k*S+random.randint(0,8),p,v-(k%2)*12+random.randint(-4,4),S)
def pad_hold(b,nbars,ps,v=48):
    for p in ps: N(PAD,6,bar(b),p,v,nbars*BAR-E)

# ================= FORM: 36 bars at 108 = 80 s =================
sc.marker(bar(1),'INTRO: the pampa, a quena call')
pad_hold(1,4,[40,47,52],40)
mel(QUENA,2,1,[(0,E5,3),(4,G5,2),(6,A5,2)],88); mel(QUENA,2,2,[(0,B5,4),(5,A5,1),(6,G5,2)],90)
mel(QUENA,2,3,[(0,E5,2),(2,D5,1),(3,E5,1),(4,B4,4)],86); flutter(QUENA,2,bar(4),A5,B5,8,84); mel(QUENA,2,4,[(4,E5,4)],92)
for b in (3,4): perc_bar(b,full=False,clave=False,shaker=True)
N(PERC,9,bar(4)+3*Q,BOMBO,100,E); N(PERC,9,bar(4)+3*Q+E,BOMBO,110,E)
sc.marker(bar(5),'A: the walk (zampona tune over the rumba)')
for i,b in enumerate(range(5,13)):
    ch=PROG[i]; rumba_bar(b,ch); bass_bar(b,ch); perc_bar(b,fill=(b==12))
    pad_hold(b,1,[CHORDS[ch][0]+12,CHORDS[ch][2]+12],34)
for i,ph in enumerate(PH_A): mel(PAN1,0,5+i,ph,98)
sc.marker(bar(13),'B: the hummingbird (two pipes in hocket)')
hocket(13,8)
for i,b in enumerate(range(13,21)):
    ch=PROG[i]; rumba_bar(b,ch,86); bass_bar(b,ch); perc_bar(b,fill=(b==20))
    if i%2==1: charango_trem(b,ch,66,(2,3))
flutter(QUENA,2,bar(16)+2*Q,B5,A5,8,80); mel(QUENA,2,17,[(0,E5,4),(4,D5,4)],84); mel(QUENA,2,18,[(0,B4,6)],82)
flutter(QUENA,2,bar(20)+2*Q,B5,D6,8,86)
sc.marker(bar(21),'A2: the tune again, quena an octave under, charango in')
for i,b in enumerate(range(21,29)):
    ch=PROG[i]; rumba_bar(b,ch,96); bass_bar(b,ch,100); perc_bar(b,fill=(b==28)); charango_trem(b,ch,64)
    pad_hold(b,1,[CHORDS[ch][0]+12,CHORDS[ch][2]+12],34)
for i,ph in enumerate(PH_A): mel(PAN1,0,21+i,ph,104); mel(QUENA,2,21+i,ph,78,-12)
mel(PAN2,1,28,[(2,G5,1),(3,A5,1),(4,B5,4)],92)
sc.marker(bar(29),'C: the ridge (hocket + tune together)')
hocket(29,4,90)
for i,b in enumerate(range(29,33)):
    ch=['Em','Em','C','Bm'][i]; rumba_bar(b,ch,100); bass_bar(b,ch,104); perc_bar(b,fill=(b==32)); charango_trem(b,ch,70)
mel(QUENA,2,29,[(0,E5,2),(2,G5,2),(4,A5,4)],96); mel(QUENA,2,30,[(0,B5,4),(4,A5,2),(6,G5,2)],96)
mel(QUENA,2,31,[(0,E5,3),(3,D5,1),(4,E5,4)],94); mel(QUENA,2,32,[(0,B4,8)],92)
sc.marker(bar(33),'OUTRO: the pampa settles')
for b in (33,34): rumba_bar(b,'Em',80); bass_bar(b,'Em',88); perc_bar(b,full=(b==33),clave=True,shaker=True)
pad_hold(33,4,[40,47,52],44)
mel(PAN1,0,33,[(0,E5,2),(2,G5,1),(3,A5,1),(4,G5,2),(6,E5,2)],92); mel(PAN1,0,34,[(0,D5,4),(4,E5,4)],90)
for p in CHORDS['Em']: N(GTR,3,bar(35)+CHORDS['Em'].index(p)*20,p,92,2*Q)
N(BASS,5,bar(35),40,100,2*Q); N(PERC,9,bar(35),BOMBO,110,Q); N(PERC,9,bar(35),CJBASS,100,S)
N(PAN1,0,bar(35),E5,96,3*Q); N(PAN2,1,bar(35),B4,80,3*Q); N(QUENA,2,bar(35),E4,72,3*Q)
print('bytes',sc.write(sys.argv[1]),'seconds',36*4*60/BPM)
