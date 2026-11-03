import sys, random
from smf import Score
random.seed(11)
BPM=84; PPQ=480; Q=PPQ; E=Q//2; S=Q//4; BAR=4*Q
sc=Score(BPM,PPQ,'Nazca pampa (chill) 84')
def bar(n): return (n-1)*BAR
PAN1='Zampona 1 (pan pipes, ira)'; PAN2='Zampona 2 (pan pipes, arca)'; QUENA='Quena (Andean flute)'; GTR='Nylon guitar (fingerpicked)'; CHAR='Charango (soft arpeggio)'; BASS='Bass (acoustic)'; PAD='Pampa air (pad)'; PERC='Percussion (ch 10): cajon, bombo, shaker'
sc.track(PAN1,0,75); sc.track(PAN2,1,75); sc.track(QUENA,2,73); sc.track(GTR,3,24); sc.track(CHAR,4,24); sc.track(BASS,5,32); sc.track(PAD,6,89); sc.track(PERC,9)
N=lambda tr,ch,t,p,v,l: sc.note(tr,ch,t,p,v,l)
E3,G3,A3,B3,D4,E4,G4,A4,B4,D5,E5,G5,A5,B5,D6=52,55,57,59,62,64,67,69,71,74,76,79,81,83,86
CHORDS={'Em':[40,47,52,55,59],'D':[38,45,50,54,57],'C':[36,43,48,52,55],'Bm':[35,42,47,50,54],'G':[43,47,50,55,59]}
PROG=['Em','Em','D','D','C','C','Bm','Bm']
BASSROOT={'Em':(40,47),'D':(38,45),'C':(36,43),'Bm':(35,42),'G':(43,50)}

def pick_bar(b,chord,v=78,pattern=None):
    """fingerpicking, playable: thumb on the bass string, i-m-a on the top three; eighths with a lift on the 'and' of 2 and 4"""
    c=CHORDS[chord]; bass,low,mid,hi,top=c[0],c[1],c[2],c[3],c[4]
    pattern=pattern or [bass,mid,hi,top,low,hi,top,hi]     # 8 eighths
    t=bar(b)
    for k,p in enumerate(pattern):
        vel=v+(8 if k==0 else 0)-(10 if k%2 else 0)+random.randint(-4,3)
        N(GTR,3,t+k*E+random.randint(0,12),p,vel,int(E*1.6) if k in (0,4) else int(E*1.2))
def bass_bar(b,chord,v=84):
    t=bar(b); r,f=BASSROOT[chord]
    N(BASS,5,t,r,v,Q*1.8); N(BASS,5,t+2*Q,f if b%2 else r,v-12,Q*1.4); N(BASS,5,t+3*Q+E,r,v-20,E)
BOMBO,CJBASS,CJSLAP,CJGHOST,SHAKER=41,64,63,62,82
def perc_bar(b,level=1.0,bombo=True):
    t=bar(b)
    if bombo: N(PERC,9,t,BOMBO,int(96*level),E); N(PERC,9,t+2*Q+E,BOMBO,int(78*level),E)
    N(PERC,9,t,CJBASS,int(84*level),S); N(PERC,9,t+2*Q,CJBASS,int(70*level),S)
    N(PERC,9,t+Q,CJSLAP,int(66*level),S); N(PERC,9,t+3*Q,CJSLAP,int(72*level),S)
    for k in (3,7,11,13):
        if random.random()<0.6: N(PERC,9,t+k*S,CJGHOST,int(34*level)+random.randint(0,12),S//2)
    for k in range(8): N(PERC,9,t+k*E,SHAKER,int((62 if k%2==0 else 44)*level),S)
def mel(tr,ch,b,events,v=90,oct=0):
    for pos,p,l in events:
        N(tr,ch,bar(b)+int(pos*E),p+oct,v+random.randint(-5,3)+(5 if pos%2==0 else 0),int(l*E*0.95))
PH_A=[ [(0,E5,2),(2,G5,1),(3,A5,1),(4,G5,2),(6,E5,2)],
       [(0,D5,3),(3,E5,1),(4,D5,2),(6,B4,2)],
       [(0,A4,2),(2,B4,1),(3,D5,1),(4,E5,3),(7,D5,1)],
       [(0,B4,5),(6,A4,1),(7,B4,1)],
       [(0,E5,2),(2,G5,1),(3,B5,1),(4,A5,2),(6,G5,2)],
       [(0,E5,2),(2,D5,1),(3,E5,1),(4,D5,2),(6,B4,2)],
       [(0,A4,1),(1,B4,1),(2,D5,2),(4,B4,2),(6,A4,2)],
       [(0,E5,6)] ]
RUN=[E5,G5,A5,G5,E5,D5,E5,G5, A5,B5,A5,G5,E5,D5,B4,D5, E5,G5,A5,B5,D6,B5,A5,G5, E5,D5,E5,G5,A5,G5,E5,D5,
     B4,D5,E5,G5,A5,G5,E5,D5, E5,G5,A5,B5,A5,G5,E5,D5, B4,D5,E5,D5,B4,A4,B4,D5, E5,E5,E5,E5,G5,E5,D5,E5]
def hocket(b_start,nbars,v=80):
    for i in range(nbars*8):
        p=RUN[i%len(RUN)]; t=bar(b_start)+i*E; tr,ch=(PAN1,0) if i%2==0 else (PAN2,1)
        N(tr,ch,t,p,v+random.randint(-5,4)+(4 if i%4==0 else 0),int(E*0.9))
def flutter(tr,ch,t,p1,p2,n=6,v=78):
    for i in range(n): N(tr,ch,t+i*(S//2),p1 if i%2==0 else p2,v-i*3,S//2)
def char_arp(b,chord,v=52,beats=(0,2)):
    top=[p+24 for p in CHORDS[chord][-3:]]
    for q in beats:
        for k,p in enumerate(top+[top[1]]): N(CHAR,4,bar(b)+q*Q+k*S,p,v+random.randint(-4,4),int(S*1.5))
def pad_hold(b,nbars,ps,v=46):
    for p in ps: N(PAD,6,bar(b),p,v,nbars*BAR-E)

# ================= FORM: 36 bars at 84 = 103 s =================
sc.marker(bar(1),'INTRO: pampa air, the guitar alone, a quena call')
pad_hold(1,4,[40,47,52],40)
for b in (1,2,3,4): pick_bar(b,'Em',70); 
bass_bar(3,'Em',70); bass_bar(4,'Em',74)
mel(QUENA,2,2,[(4,E5,3),(7,G5,1)],80); mel(QUENA,2,3,[(0,A5,4),(4,G5,2),(6,E5,2)],84)
mel(QUENA,2,4,[(0,D5,3),(3,E5,1),(4,B4,4)],80)
for k in range(8): N(PERC,9,bar(4)+k*E,SHAKER,40 if k%2==0 else 30,S)
sc.marker(bar(5),'A: the walk (zampona tune, fingerpicked guitar)')
for i,b in enumerate(range(5,13)):
    ch=PROG[i]; pick_bar(b,ch,80); bass_bar(b,ch); perc_bar(b,0.85)
    pad_hold(b,1,[CHORDS[ch][0]+12,CHORDS[ch][2]+12],32)
for i,ph in enumerate(PH_A): mel(PAN1,0,5+i,ph,90)
sc.marker(bar(13),'B: the hummingbird (two pipes in hocket, soft)')
hocket(13,8,76)
for i,b in enumerate(range(13,21)):
    ch=PROG[i]; pick_bar(b,ch,76); bass_bar(b,ch,80); perc_bar(b,0.75,bombo=(i%2==0)); char_arp(b,ch,50,(1,3))
    pad_hold(b,1,[CHORDS[ch][0]+12,CHORDS[ch][2]+12],30)
flutter(QUENA,2,bar(16)+2*Q,B5,A5,6,72); mel(QUENA,2,17,[(0,E5,4),(4,D5,4)],76); mel(QUENA,2,18,[(0,B4,8)],72)
sc.marker(bar(21),'A2: the tune again, quena an octave under, charango arpeggios')
for i,b in enumerate(range(21,29)):
    ch=PROG[i]; pick_bar(b,ch,84); bass_bar(b,ch,88); perc_bar(b,0.95); char_arp(b,ch,54,(0,2))
    pad_hold(b,1,[CHORDS[ch][0]+12,CHORDS[ch][2]+12],34)
for i,ph in enumerate(PH_A): mel(PAN1,0,21+i,ph,94); mel(QUENA,2,21+i,ph,66,-12)
mel(PAN2,1,28,[(2,G5,1),(3,A5,1),(4,B5,4)],80)
sc.marker(bar(29),'C: the ridge (hocket and quena together, gently)')
hocket(29,4,78)
for i,b in enumerate(range(29,33)):
    ch=['Em','Em','C','Bm'][i]; pick_bar(b,ch,84); bass_bar(b,ch,90); perc_bar(b,1.0); char_arp(b,ch,54,(1,3))
mel(QUENA,2,29,[(0,E5,2),(2,G5,2),(4,A5,4)],84); mel(QUENA,2,30,[(0,B5,4),(4,A5,2),(6,G5,2)],84)
mel(QUENA,2,31,[(0,E5,3),(3,D5,1),(4,E5,4)],82); mel(QUENA,2,32,[(0,B4,8)],80)
sc.marker(bar(33),'OUTRO: the pampa settles, guitar alone')
for b in (33,34): pick_bar(b,'Em',74); bass_bar(b,'Em',78)
perc_bar(33,0.6,bombo=False)
pad_hold(33,4,[40,47,52],44)
mel(PAN1,0,33,[(0,E5,2),(2,G5,1),(3,A5,1),(4,G5,2),(6,E5,2)],84); mel(PAN1,0,34,[(0,D5,4),(4,E5,4)],82)
pick_bar(35,'Em',72,[40,52,59,64,59,52,47,40]); pick_bar(36,'Em',60,[40,55,59,64,0,0,0,0][:4]+[64,59,55,52])
N(BASS,5,bar(35),40,86,4*Q); N(PERC,9,bar(35),BOMBO,80,Q)
N(PAN1,0,bar(35),E5,84,5*Q); N(PAN2,1,bar(35),B4,70,5*Q); N(QUENA,2,bar(35)+2*Q,E4,62,3*Q)
print('bytes',sc.write(sys.argv[1]),'seconds',36*4*60/BPM)
