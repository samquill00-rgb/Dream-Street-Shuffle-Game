"""The Reclamation (the Easter Island shoot), take 2 (2026-11-04, Sam: "There is no main melody... Make the focal point
rhythmic and harmonic"). Built from Sam's 'Easter island atmosphere' form: the stone fifths E2 B2 as the floor; the breath-horn
call E B E F E B as the CHORD CYCLE (Em Bm Em F: the F the menace); his thumb-piano figure as the rhythmic engine; the night
harmonics E G A B as chord colour; his Dreamscape cluster (B C# D# E) as a pad wash, never a tune. No lead melody: the square
and saw play chord arpeggios and off-beat stabs. 150 bpm, 4/4, 36 bars + a hit = 59 s. Intro 1-4 once, loop bars 5-36.
Rebuild: python3 compose_reclaim.py "../Reclamation.mid" """
import sys, random
from smf import Score
random.seed(11)
BPM=150; PPQ=480; Q=PPQ; E=Q//2; S=Q//4; BAR=4*Q
sc=Score(BPM,PPQ,'The Reclamation 150 (take 2)')
def bar(n): return (n-1)*BAR
ARP='Arp: square (chord 16ths)'; STAB='Stabs: saw (off-beat chords)'; BASS='Bass: synth'; PAD='Pad: stone fifths / cluster'; PLUCK='Thumb piano: chip pluck'; BELL='Harmonics: chip bell'; DR='Drums (ch 10)'
sc.track(ARP,0,80); sc.track(STAB,1,81); sc.track(BASS,2,38); sc.track(PAD,3,89); sc.track(PLUCK,4,108); sc.track(BELL,5,92); sc.track(DR,9)
N=lambda tr,ch,t,p,v,l: sc.note(tr,ch,t,p,v,l)
# ---- Sam's material ----
THUMB=[64,71,67,74,69,71,64,67,71,69,74,64]    # his thumb-piano figure (E B G D A B E G B A D E)
HARM=[76,79,81,83]                             # the night harmonics E G A B
CLUSTER=[71,73,75,76]                          # his Dreamscape gesture B C# D# E, as a wash
E2,B2,F2,G2,A2,E3=40,47,41,43,45,52
# chords: root, voicing (for stabs/arps), bass root; the horn call E B E F gives the cycle
CH={'Em':(40,[64,67,71,76]),'Bm':(47,[62,66,71,74]),'F':(41,[65,69,72,77]),'G':(43,[67,71,74,79]),'Am':(45,[64,69,72,76]),'E5':(40,[64,71,76,83])}
KICK,SNARE,HH,OH,CRASH,TIMB=36,38,42,46,49,65
# ---- parts ----
def drums(b,style='drive',crash=False,fill=False):
    t=bar(b)
    if style=='drive':      # kick on 1, the 'and' of 2, 3; snare 2 and 4; 16th hats accented on the 8ths
        for q in (0,2): N(DR,9,t+q*Q,KICK,110,S)
        N(DR,9,t+int(1.5*Q),KICK,98,S); N(DR,9,t+int(3.5*Q),KICK,90,S)
        for q in (1,3): N(DR,9,t+q*Q,SNARE,104,S)
        for k in range(16): N(DR,9,t+k*S,OH if k==14 else HH,(84 if k%4==0 else 66 if k%2==0 else 52),S)
    elif style=='four':
        for q in range(4): N(DR,9,t+q*Q,KICK,108,S)
        for q in (1,3): N(DR,9,t+q*Q,SNARE,100,S)
        for k in range(8): N(DR,9,t+k*E,HH,64 if k%2 else 80,S)
        N(DR,9,t+7*E,OH,78,E)
    elif style=='half':
        N(DR,9,t,KICK,104,S); N(DR,9,t+2*Q,SNARE,98,S); N(DR,9,t+int(2.5*Q),KICK,88,S); N(DR,9,t+int(3.5*Q),KICK,80,S)
        for k in range(16): N(DR,9,t+k*S,HH,(70 if k%4==0 else 48),S)
    elif style=='hats':
        for k in range(8): N(DR,9,t+k*E,HH,60 if k%2 else 76,S)
    if crash: N(DR,9,t,CRASH,100,Q)
    if fill:
        for k,v in enumerate((80,88,96,110)): N(DR,9,t+3*Q+k*S,SNARE,v,S)
        N(DR,9,t+3*Q+S,TIMB,90,S); N(DR,9,t+3*Q+3*S,TIMB,100,S)
# the bass riff: the rhythm is the hook. x.xx.x.x | pattern in 8ths, with the octave on the pickups
RIFF_R=[(0,0,1),(1.5,0,0.5),(2,0,1),(3,12,0.5),(3.5,0,0.5),(4,0,1),(5.5,12,0.5),(6,0,1),(7,7,0.5),(7.5,0,0.5)]
def bass_riff(b,root,v=106):
    t=bar(b)
    for pos,o,l in RIFF_R: N(BASS,2,t+int(pos*E),root+o,v-(10 if pos%1 else 0)+random.randint(-3,2),int(l*E*0.9))
def bass8(b,root,v=104,bounce=True):
    t=bar(b)
    for k in range(8): N(BASS,2,t+k*E,root+(12 if (bounce and k in (2,6)) else 0),v-(12 if k%2 else 0),int(E*0.9))
def pad(b,nbars,notes,v=64):
    for p in notes: N(PAD,3,bar(b),p,v,nbars*BAR-E)
def arp16(b,chord,v=92,order=(0,1,2,3,2,1),oct=0):
    """square lead: chord tones as running 16ths (the chiptune engine), no tune in it"""
    vo=CH[chord][1]; t=bar(b)
    for k in range(16):
        p=vo[order[k%len(order)]]+oct; N(ARP,0,t+k*S,p,v-(18 if k%2 else (6 if k%4 else 0))+random.randint(-3,2),int(S*0.85))
def stabs(b,chord,v=100,pattern=(1.5,3.5,6)):
    """saw: chord hits on the off-beats (the 'and' of 1, the 'and' of 2, beat 4)"""
    vo=CH[chord][1]; t=bar(b)
    for pos in pattern:
        for i,p in enumerate(vo[:3]): N(STAB,1,t+int(pos*E),p-12,v-i*5,int(E*0.8))
def thumb16(b,nbars,v=86,chord=None,start=0):
    """Sam's thumb-piano figure as running 16ths; over F every note up a semitone (the menace)"""
    i=start; shift=1 if chord=='F' else 0
    for k in range(nbars*16):
        p=THUMB[i%len(THUMB)]+shift; N(PLUCK,4,bar(b)+k*S,p,v-(16 if k%2 else 0)+random.randint(-4,2),int(S*0.9)); i+=1
    return i
def harm_bells(b,nbars,v=74):
    """the night harmonics as a slow chord bell, one per half bar"""
    for k in range(nbars*2): N(BELL,5,bar(b)+k*2*Q,HARM[k%4],v,int(2*Q*0.95))
# ================= FORM =================
A=['Em','Em','Bm','Bm','Em','Em','F','F']          # the horn call: E B E F
B=['G','G','Am','Am','Em','Em','F','Em']           # the harmonics' colours (G, A) then back to the call
sc.marker(bar(1),'INTRO (once): the stone fifths wake, the bass riff finds its feet')
pad(1,4,(E2,B2),60)
for b in (1,2): drums(b,'hats'); N(DR,9,bar(b),KICK,100,S); N(DR,9,bar(b)+2*Q,KICK,100,S)
bass_riff(3,E2,98); bass_riff(4,E2,102); drums(3,'half'); drums(4,'half',fill=True)
pos=thumb16(4,1,78,'Em')
sc.marker(bar(5),'LOOP START / A: the riff on the horn-call cycle Em Bm Em F, square arps, off-beat stabs')
pad(5,8,(E2,B2),56)
for i,b in enumerate(range(5,13)):
    c=A[i]; bass_riff(b,CH[c][0]); drums(b,'drive',crash=(i==0),fill=(i in (3,7))); arp16(b,c,90); stabs(b,c,96)
sc.marker(bar(13),'B: the thumb piano runs, G Am Em F, four on the floor')
pad(13,8,(E2,B2),52)
for i,b in enumerate(range(13,21)):
    c=B[i]; bass8(b,CH[c][0],104,bounce=(i%2==0)); drums(b,'four',crash=(i==0),fill=(i==7)); stabs(b,c,94,(1,3,5,7)); pos=thumb16(b,1,86,c,pos)
    if i>=4: arp16(b,c,80,(0,2,1,3),12)
sc.marker(bar(21),'C: half-time, the cluster wash and the harmonics bells, then the drive back on the call')
pad(21,4,(E2,B2,E3),66); pad(21,4,CLUSTER,46)          # his B C# D# E gesture as a wash, not a tune
pad(25,4,(E2,B2),60); pad(25,4,[p+12 for p in CLUSTER],40)
harm_bells(21,8,76)
for i,b in enumerate(range(21,29)):
    c=A[i]; drums(b,'half' if i<4 else 'drive',crash=(i in (0,4)),fill=(i==7))
    if i<4: bass8(b,CH[c][0],96,False); stabs(b,c,84,(0,4))
    else: bass_riff(b,CH[c][0]); arp16(b,c,88); stabs(b,c,96)
sc.marker(bar(29),'BREAK: bass and drums on the horn call, thumb piano alone, bar 32 on F')
for i,b in enumerate(range(29,33)):
    r=[E2,B2-12,E2,F2][i]; N(BASS,2,bar(b),r,104,int(1.5*Q)); N(BASS,2,bar(b)+int(1.5*Q),r,92,E); N(BASS,2,bar(b)+2*Q,r,100,Q); N(BASS,2,bar(b)+3*Q,r+12,96,E); N(BASS,2,bar(b)+int(3.5*Q),r,90,E)
    N(DR,9,bar(b),KICK,104,S); N(DR,9,bar(b)+int(1.5*Q),KICK,96,S); N(DR,9,bar(b)+2*Q,KICK,100,S); N(DR,9,bar(b)+Q,TIMB,80,S); N(DR,9,bar(b)+3*Q,TIMB,86,S)
    for k in range(8): N(DR,9,bar(b)+k*E,HH,56 if k%2 else 70,S)
    pos=thumb16(b,1,82,'F' if i==3 else 'Em',pos)
pad(29,3,(E2,B2),56); pad(32,1,(F2,48),70)
sc.marker(bar(33),'BUILD: arps climbing through the chord, snare build, everything on F then E')
pad(33,4,(E2,B2),62)
for i,b in enumerate(range(33,37)):
    c=['Em','Em','F','F'][i]; bass_riff(b,CH[c][0],108); drums(b,'drive',crash=(i==0)); arp16(b,c,94,(0,1,2,3),12 if i>=2 else 0); stabs(b,c,100,(0,1.5,3,4,5.5,7))
for k in range(16): N(DR,9,bar(35)+k*S,SNARE,70+k*2,S)
for k in range(16): N(DR,9,bar(36)+k*S,SNARE,88+k*2,S)
N(DR,9,bar(36)+3*Q,TIMB,100,S); N(DR,9,bar(36)+3*Q+2*S,TIMB,110,S)
sc.marker(bar(37),'LOOP END (back to bar 5)')
for p in (E2,B2,E3): N(PAD,3,bar(37),p,96,2*Q)
for p in CH['E5'][1]: N(ARP,0,bar(37),p,108,2*Q); N(STAB,1,bar(37),p-12,100,2*Q)
N(BASS,2,bar(37),E2,112,2*Q); N(DR,9,bar(37),KICK,112,S); N(DR,9,bar(37),CRASH,110,Q); N(BELL,5,bar(37),88,80,2*Q)
print('bytes',sc.write(sys.argv[1]),'seconds',37*4*60/BPM,'loop',4*4*60/BPM,'to',36*4*60/BPM)
