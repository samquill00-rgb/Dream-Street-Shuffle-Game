import sys, random
from smf import Score
random.seed(21)
BPM=138; PPQ=480; Q=PPQ; E=Q//2; S=Q//4; BAR=4*Q
sc=Score(BPM,PPQ,'Nazca Race 138')
def bar(n): return (n-1)*BAR
PAN1='Zampona 1 (pan pipes, ira)'; PAN2='Zampona 2 (pan pipes, arca)'; SAX='Tenor sax'; EGTR='Electric guitar (driving eighths)'; PIANO='Piano (pumping eighths)'; ORGAN='Organ (held)'; GLOCK='Glockenspiel (tune, octave up)'; EBASS='Electric bass (eighths)'; DR='Drums (ch 10)'
sc.track(PAN1,0,75); sc.track(PAN2,1,75); sc.track(SAX,2,66); sc.track(EGTR,3,29); sc.track(PIANO,4,0); sc.track(ORGAN,5,16); sc.track(GLOCK,6,9); sc.track(EBASS,7,33); sc.track(DR,9)
N=lambda tr,ch,t,p,v,l: sc.note(tr,ch,t,p,v,l)
E3,G3,A3,B3,D4,E4,G4,A4,B4,D5,E5,G5,A5,B5,D6=52,55,57,59,62,64,67,69,71,74,76,79,81,83,86
# Springsteen turn: the verse stays Em D C Bm (the pampa), the chorus opens out to G D Em C
CH={'Em':[40,47,52,55,59],'D':[38,45,50,54,57],'C':[36,43,48,52,55],'Bm':[35,42,47,50,54],'G':[43,47,50,55,59]}
PIANOV={'Em':[52,55,59,64],'D':[50,54,57,62],'C':[48,52,55,60],'Bm':[47,50,54,59],'G':[50,55,59,62]}
ROOT={'Em':40,'D':38,'C':36,'Bm':35,'G':43}
VERSE=['Em','Em','D','D','C','C','Bm','Bm']; CHORUS=['G','G','D','D','Em','Em','C','C']
def drums(b,crash=False,fill=False,half=False):
    t=bar(b)
    if half:
        N(DR,9,t,36,110,S); N(DR,9,t+2*Q,38,104,S); N(DR,9,t+2*Q+E,36,90,S)
        for k in range(8): N(DR,9,t+k*E,42,60 if k%2 else 78,S)
    else:
        for q in (0,2): N(DR,9,t+q*Q,36,112,S)
        N(DR,9,t+Q+E,36,92,S); N(DR,9,t+3*Q+E,36,96,S)
        for q in (1,3): N(DR,9,t+q*Q,38,110,S); N(DR,9,t+q*Q,54,86,S)   # snare + tambourine
        for k in range(8): N(DR,9,t+k*E,42,66 if k%2 else 84,S)
    if crash: N(DR,9,t,49,104,Q)
    if fill:
        for k,v in enumerate((84,92,100,108)): N(DR,9,t+3*Q+k*S,38 if k<3 else 45,v,S)
        N(DR,9,t+3*Q+2*S,47,96,S)
def bass(b,chord,v=104,walk=None):
    t=bar(b); r=ROOT[chord]
    for k in range(8):
        p=r
        if walk and k>=6: p=walk[k-6]
        elif k==7 and b%2==0: p=r+7
        N(EBASS,7,t+k*E,p,v-(10 if k%2 else 0)+random.randint(-3,3),int(E*0.85))
def guitar(b,chord,v=98,chug=True):
    t=bar(b); r=ROOT[chord]
    for k in range(8):   # power chord eighths, palm-muted on the offbeats
        for i,p in enumerate((r+12,r+19,r+24)):
            N(EGTR,3,t+k*E+i*6,p,v-(18 if k%2 else 0)-i*6,int(E*0.9 if k%2==0 else E*0.5))
def piano(b,chord,v=92,hits=range(8)):
    t=bar(b)
    for k in hits:
        for i,p in enumerate(PIANOV[chord]+[PIANOV[chord][0]+12]):
            N(PIANO,4,t+k*E+i*4,p,v-(14 if k%2 else 0)-(4 if i==4 else 0),int(E*0.8))
def organ(b,chord,v=70):
    for p in PIANOV[chord]: N(ORGAN,5,bar(b),p+12,v,BAR-S)
def mel(tr,ch,b,events,v=100,oct=0,glock=False):
    for pos,p,l in events:
        vel=v+random.randint(-5,3)+(6 if pos%2==0 else 0)
        N(tr,ch,bar(b)+int(pos*E),p+oct,vel,int(l*E*0.9))
        if glock: N(GLOCK,6,bar(b)+int(pos*E),p+12,vel-10,int(l*E*0.6))
# Sam's tune (Nazca Atmosphere.mid, 2026-11-03): bars 5-11, the B4 at bar 11 held through bar 12
PH_A=[ [(0,E5,2),(2,G5,1),(3,A5,1),(4,B5,2),(6,G5,2)],
       [(0,D5,3),(3,E5,1),(4,B4,2),(6,D5,2)],
       [(0,A4,2),(2,B4,1),(3,D5,1),(4,A5,3),(7,E5,1)],
       [(0,B4,5),(6,A4,1),(7,B4,1)],
       [(0,E5,2),(2,G5,1),(3,D6,1),(4,B5,2),(6,A5,2)],
       [(0,E5,2),(2,D5,1),(3,E5,1),(4,B4,2),(6,D5,2)],
       [(0,A4,1),(1,B4,1),(2,D5,2),(4,B4,12)],
       [] ]
# chorus hook over G D Em C: broader, anthemic, lands on the hummingbird run
PH_C=[ [(0,G5,3),(3,A5,1),(4,B5,3),(7,A5,1)],
       [(0,G5,2),(2,A5,2),(4,D5,4)],
       [(0,E5,3),(3,G5,1),(4,A5,2),(6,B5,2)],
       [(0,A5,2),(2,G5,2),(4,E5,4)],
       [(0,G5,3),(3,A5,1),(4,B5,3),(7,D6,1)],
       [(0,B5,2),(2,A5,2),(4,G5,2),(6,A5,2)],
       [(0,E5,2),(2,G5,1),(3,E5,1),(4,D5,2),(6,B4,2)],
       [(0,E5,8)] ]
RUN=[E5,G5,A5,G5,E5,D5,E5,G5, A5,B5,A5,G5,E5,D5,B4,D5, E5,G5,A5,B5,D6,B5,A5,G5, E5,D5,E5,G5,A5,G5,E5,D5,
     B4,D5,E5,G5,A5,G5,E5,D5, E5,G5,A5,B5,A5,G5,E5,D5, B4,D5,E5,D5,B4,A4,B4,D5, E5,E5,E5,E5,G5,E5,D5,E5]
# Sam's hummingbird (2026-11-03): pipe 1 plays one note per beat, pipe 2 keeps the off-beat eighths of the old running line
BEATLINE=[E5,A5,E5,E5, A5,A5,E5,B4, E5,A5,D6,A5, E5,E5,A5,E5, B4,E5,A5,E5, E5,A5,A5,E5, B4,E5,B4,B4, E5,E5,G5,D5]
def hocket(b_start,nbars,v=100):
    for i in range(nbars*8):
        t=bar(b_start)+i*E
        if i%2==0:
            p=BEATLINE[(i//2)%len(BEATLINE)]
            N(PAN1,0,t,p,v+random.randint(-5,4)+(5 if i%4==0 else 0),int(Q*0.45))
            N(GLOCK,6,t,p+12,v-18,int(E*0.5))
        else:
            p=RUN[i%len(RUN)]
            N(PAN2,1,t,p,v-6+random.randint(-5,4),int(E*0.85))
def sax_line(b,events,v=104): mel(SAX,2,b,events,v)

# ================= FORM: 44 bars at 138 = 76.5 s; loop bars 5-44 =================
sc.marker(bar(1),'INTRO (once): the engine turns over')
for b in (1,2): bass(b,'Em',96); guitar(b,'Em',88); N(DR,9,bar(b),36,100,S); N(DR,9,bar(b)+2*Q,36,100,S)
for k in range(8): N(DR,9,bar(2)+k*E,42,70,S)
for b in (3,4): bass(b,'Em',100); guitar(b,'Em',94); piano(b,'Em',86,(0,2,4,6)); drums(b,fill=(b==4),half=True)
mel(PAN1,0,3,[(0,E5,2),(2,G5,1),(3,A5,1),(4,B5,2),(6,G5,2)],96,glock=True); mel(PAN1,0,4,[(0,D5,3),(3,E5,1),(4,B4,4)],96,glock=True)
sc.marker(bar(5),'LOOP START / VERSE: the pampa at speed (zampona tune, piano eighths)')
for i,b in enumerate(range(5,13)):
    ch=VERSE[i]; bass(b,ch); guitar(b,ch); piano(b,ch); organ(b,ch,62); drums(b,crash=(i==0),fill=(i==7))
for i,ph in enumerate(PH_A): mel(PAN1,0,5+i,ph,102,glock=True)
sc.marker(bar(13),'CHORUS: opens to G D Em C, sax takes the hook')
for i,b in enumerate(range(13,21)):
    ch=CHORUS[i]; bass(b,ch,108,walk=([ROOT[CHORUS[(i+1)%8]]-2,ROOT[CHORUS[(i+1)%8]]-1] if i%2==1 else None)); guitar(b,ch,104); piano(b,ch,98); organ(b,ch,74); drums(b,crash=(i==0),fill=(i==7))
for i,ph in enumerate(PH_C): sax_line(13+i,ph,106); mel(GLOCK,6,13+i,ph,80,12)
sc.marker(bar(21),'VERSE 2: the hummingbird in hocket over the drive')
hocket(21,8,98)
for i,b in enumerate(range(21,29)):
    ch=VERSE[i]; bass(b,ch); guitar(b,ch); piano(b,ch,88,(0,2,4,6) if i<4 else range(8)); organ(b,ch,62); drums(b,crash=(i==0),fill=(i==7))
sax_line(25,[(0,E5,4),(4,D5,4)],92); sax_line(26,[(0,B4,6)],90); sax_line(27,[(0,A4,2),(2,B4,2),(4,D5,4)],94); sax_line(28,[(0,E5,6)],96)
sc.marker(bar(29),'CHORUS 2: everything, pipes and sax together')
for i,b in enumerate(range(29,37)):
    ch=CHORUS[i]; bass(b,ch,110,walk=([ROOT[CHORUS[(i+1)%8]]-2,ROOT[CHORUS[(i+1)%8]]-1] if i%2==1 else None)); guitar(b,ch,108); piano(b,ch,102); organ(b,ch,78); drums(b,crash=(i==0),fill=(i==7))
for i,ph in enumerate(PH_C): sax_line(29+i,ph,108); mel(PAN1,0,29+i,ph,96); mel(GLOCK,6,29+i,ph,84,12)
sc.marker(bar(37),'BREAK: drums and bass drop to the floor tom, pipes alone, then the build')
for i,b in enumerate(range(37,41)):
    t=bar(b)
    for q in range(4): N(DR,9,t+q*Q,41,100 if q in (0,2) else 84,E); N(DR,9,t+q*Q+E,41,70,E)
    N(DR,9,t+Q,54,80,S); N(DR,9,t+3*Q,54,80,S)
    bass(b,'Em',96); organ(b,'Em',56)
hocket(37,4,96)
for i,b in enumerate(range(41,45)):
    ch=['C','C','D','D'][i]; bass(b,ch,108); guitar(b,ch,104); piano(b,ch,100); organ(b,ch,76); drums(b,crash=(i==0),fill=(i==3))
mel(PAN1,0,41,[(0,A5,2),(2,G5,2),(4,E5,4)],104,glock=True); mel(PAN1,0,42,[(0,G5,3),(3,A5,1),(4,B5,4)],104,glock=True)
mel(PAN1,0,43,[(0,A5,2),(2,B5,2),(4,D6,4)],106,glock=True); sax_line(43,[(0,A4,2),(2,B4,2),(4,D5,4)],100)
mel(PAN1,0,44,[(0,B5,2),(2,A5,1),(3,G5,1),(4,A5,2),(6,B5,2)],106,glock=True); sax_line(44,[(0,D5,4),(4,B4,2),(6,D5,2)],100)
sc.marker(bar(45),'LOOP END (back to bar 5)')
# tail hit so the file plays as a piece
for p in CH['Em']: N(EGTR,3,bar(45),p+12,110,2*Q)
for p in PIANOV['Em']: N(PIANO,4,bar(45),p,110,2*Q); N(ORGAN,5,bar(45),p+12,90,2*Q)
N(EBASS,7,bar(45),40,112,2*Q); N(DR,9,bar(45),36,112,S); N(DR,9,bar(45),49,110,Q); N(PAN1,0,bar(45),E5,110,2*Q); N(SAX,2,bar(45),E4,100,2*Q); N(GLOCK,6,bar(45),88,96,Q)
print('bytes',sc.write(sys.argv[1]),'seconds',46*4*60/BPM)
