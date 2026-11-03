import struct, json
PPQ=480; BPM=160
Q=PPQ; E=PPQ//2; S=PPQ//4; BAR=4*Q
# ---- Sam's material (Egypt atmosphere game.mid) ----
# Running pulse (marimba, bars 25-31): dotted-eighth cycle, four 4-note groups
GROUPS=[[62,69,74,69],[63,69,74,69],[62,69,74,78],[65,69,74,69]]   # D4 A4 D5 A4 | D#4 .. | D4 A4 D5 F#5 | F4 A4 D5 A4
ROOTS=[62,63,62,65]                                                 # the Searching-hum motif D D# D F sits in the group roots
# Start of the final chord (bar 31): drone D2 D3 A3, then chamber glass D4 F#4 A4 D5 entering one after another
FINAL_STACK=[62,66,69,74]
DRONE=[38,50,57]
# Studio bongo heartbeat at the final chord (C#4 in the kit): Sam's onset gaps (quarters) and velocities, first 20 hits
BONGO=[(0.00,77),(0.41,74),(0.79,68),(1.17,68),(1.58,68),(1.99,65),(2.40,68),(2.80,61),(3.20,65),(3.60,59),(3.96,69),(4.35,68),(4.74,68),(5.14,70),(5.52,72),(5.89,72),(6.34,77),(6.88,63),(7.53,68),(8.18,56)]
# Studio timbale flam-roll (bar 14): five hits ~0.18 q apart
TIMB=[(0.00,79),(0.20,82),(0.37,114),(0.53,82),(0.71,98)]

tracks={}  # name -> list of (tick, ch, status, d1, d2)
def note(tr,ch,t,p,v,l):
    tracks.setdefault(tr,[]).append((t,ch,0x90,p,v)); tracks[tr].append((t+l,ch,0x80,p,0))
def prog(tr,ch,p): tracks.setdefault(tr,[]).insert(0,(0,ch,0xc0,p,None))
markers=[]
def bar(n): return (n-1)*BAR   # 1-based bars

# ---- channels / sounds (GM fallbacks; see directions) ----
LEAD='Lead: square (arpeggio)'; LEAD2='Lead 2: saw (cross-rhythm arpeggio)'; BASS='Bass: synth'; PAD='Pad: the final chord'; DR='Drums (ch 10)'; PERC='Percussion (ch 10): timbale + bongo'
prog(LEAD,0,80); prog(LEAD2,1,81); prog(BASS,2,38); prog(PAD,3,62)

def arp_straight(start_bar,nbars,vel=(100,84),tr=LEAD,ch=0,vscale=1.0):
    """Sam's four groups as straight eighths: one group per two beats, full cycle every two bars."""
    t=bar(start_bar); end=t+nbars*BAR; g=0
    while t<end:
        grp=GROUPS[g%4]
        for k,p in enumerate(grp):
            v=int((vel[0] if k==0 else vel[1])*vscale)
            note(tr,ch,t+k*E,p,v,int(E*0.8))
        t+=2*Q; g+=1
def arp_dotted(start_bar,nbars,tr=LEAD2,ch=1,vscale=1.0):
    """Sam's exact dotted-eighth spacing (0.75 q per note): a 3-bar cycle of 16 notes, riding across the 4/4 beat."""
    t=bar(start_bar); end=t+nbars*BAR; i=0
    while t<end:
        grp=GROUPS[(i//4)%4]; p=grp[i%4]
        v=int((100 if i%4==0 else 84)*vscale)
        note(tr,ch,t,p,v,int(Q*0.75*0.8)); t+=int(Q*0.75); i+=1
def bass_groups(start_bar,nbars,vel=100,oct_bounce=True):
    t=bar(start_bar); end=t+nbars*BAR; g=0
    while t<end:
        r=ROOTS[g%4]-24   # D2 D#2 D2 F2
        pat=[r,r,r+12,r] if oct_bounce else [r,r,r,r]
        for k,p in enumerate(pat): note(BASS,2,t+k*E,p,vel-(0 if k%2==0 else 12),int(E*0.9))
        t+=2*Q; g+=1
def bass_pedal(start_bar,nbars,root=38,vel=100,pattern=None):
    pattern=pattern or [0,0,12,0,0,0,12,7]
    t=bar(start_bar); end=t+nbars*BAR
    while t<end:
        for k,o in enumerate(pattern): note(BASS,2,t+k*E,root+o,vel-(0 if k%2==0 else 12),int(E*0.9))
        t+=BAR
KICK,SNARE,HH,OH,CRASH,HTIMB,LBONGO,HBONGO=36,38,42,46,49,65,61,60
def drums(start_bar,nbars,style='drive',crash_first=False):
    for b in range(nbars):
        t=bar(start_bar)+b*BAR
        if style=='drive':
            for q in (0,2): note(DR,9,t+q*Q,KICK,110,S)
            note(DR,9,t+int(1.5*Q),KICK,96,S)
            for q in (1,3): note(DR,9,t+q*Q,SNARE,104,S)
            for e in range(8):
                if e==7: note(DR,9,t+e*E,OH,80,E)
                else: note(DR,9,t+e*E,HH,70 if e%2 else 84,S)
        elif style=='four':
            for q in range(4): note(DR,9,t+q*Q,KICK,108,S)
            for q in (1,3): note(DR,9,t+q*Q,SNARE,100,S)
            for e in range(8): note(DR,9,t+e*E,HH,64 if e%2 else 80,S)
            note(DR,9,t+7*E,OH,78,E)
        elif style=='half':
            note(DR,9,t,KICK,104,S); note(DR,9,t+2*Q,SNARE,98,S); note(DR,9,t+int(2.5*Q),KICK,88,S)
            for e in range(8): note(DR,9,t+e*E,HH,56 if e%2 else 72,S)
        if crash_first and b==0: note(DR,9,t,CRASH,100,Q)
def drum_fill(b):   # last beat of bar b: snare 16ths rising
    t=bar(b)+3*Q
    for k,v in enumerate((80,88,96,110)): note(DR,9,t+k*S,SNARE,v,S)
def timbale_roll(b,beat):
    t=bar(b)+int(beat*Q)
    for off,v in TIMB: note(PERC,9,t+int(off*Q),HTIMB,v,S)
def bongo_heart(start_bar,scale=1.0):
    t=bar(start_bar)
    for off,v in BONGO: note(PERC,9,t+int(off*Q*scale),LBONGO,v,S)

# ================= FORM (160 bpm, bar = 1.5 s) =================
# INTRO bars 1-4: torchlight. Bass pedal D + hats; the arpeggio lights up from bar 3.
markers.append((bar(1),'INTRO (once)'))
bass_pedal(1,4,38,96,[0,0,12,0,0,0,12,0])
for b in range(1,5):
    t=bar(b)
    for e in range(8): note(DR,9,t+e*E,HH,60 if e%2 else 76,S)
    note(DR,9,t,KICK,100,S); note(DR,9,t+2*Q,KICK,100,S)
arp_straight(3,2,vscale=0.85)
drum_fill(4)
# A bars 5-12: the run. Straight-eighth arpeggio, bass follows the group roots, driving beat.
markers.append((bar(5),'LOOP START / A: the run'))
arp_straight(5,8); bass_groups(5,8); drums(5,8,'drive',crash_first=True)
timbale_roll(8,3.0); timbale_roll(12,2.5); drum_fill(12)
# B bars 13-20: the cross-rhythm. Sam's own dotted-eighth spacing on the saw lead (two full 3-bar cycles = bars 13-18),
#   four-on-the-floor kick holding the 4/4 against it; bars 19-20 break: bass alone states the roots, timbale roll.
markers.append((bar(13),'B: cross-rhythm (Sam\'s dotted eighths)'))
arp_dotted(13,6); bass_pedal(13,6,38,100,[0,0,12,0,0,12,0,0]); drums(13,6,'four')
# break
for g,r in enumerate(ROOTS):   # bars 19-20: D D# D F as half-bar bass stabs with the straight arp answering
    t=bar(19)+g*2*Q
    note(BASS,2,t,r-24,110,Q); note(BASS,2,t+Q,r-24,90,E)
    note(DR,9,t,KICK,108,S); note(DR,9,t+Q,SNARE,96,S)
    for e in range(4): note(DR,9,t+e*E,HH,60 if e%2 else 76,S)
timbale_roll(20,3.0); drum_fill(20)
# C bars 21-28: the final chord, built the way Sam builds it: D4, then F#4, A4, D5 stacking in over the drone,
#   half-time drums under the stack, the arpeggio at half volume; bars 25-28 everything in, bongo heartbeat, then a fill back to A.
markers.append((bar(21),'C: the final chord'))
for k,p in enumerate(FINAL_STACK):
    note(PAD,3,bar(21+k),p,int(72+k*8),bar(29)-bar(21+k)-E)
for p in DRONE: note(PAD,3,bar(21),p,70,8*BAR-E)
arp_straight(21,4,vscale=0.6); bass_pedal(21,4,38,96,[0,0,0,0,12,0,0,0]); drums(21,4,'half',crash_first=True)
arp_straight(25,4,vscale=1.0); bass_pedal(25,4,38,104,[0,0,12,0,0,0,12,7]); drums(25,4,'drive',crash_first=True)
bongo_heart(25,scale=1.0)   # Sam's bongo gaps (8.2 q of hits ≈ two bars)
timbale_roll(28,2.5); drum_fill(28)
markers.append((bar(29),'LOOP END (back to bar 5)'))
# a 2-bar tail so the file also plays as a piece: final D chord hit, everything stops on bar 29 beat 1
for p in [38,50,57,62,66,69,74]: note(PAD,3,bar(29),p,100,2*Q)
for p in [62,69,74,81]: note(LEAD,0,bar(29),p,110,2*Q)
note(BASS,2,bar(29),38,110,2*Q); note(DR,9,bar(29),KICK,112,S); note(DR,9,bar(29),CRASH,110,Q)

# ================= write SMF format 1 =================
def vlq(n):
    b=[n&0x7f]; n>>=7
    while n: b.append(0x80|(n&0x7f)); n>>=7
    return bytes(reversed(b))
def meta(t,typ,data): return (t,-1,0xff,typ,data)
chunks=[]
tempo=[(0,-1,0xff,0x51,(60000000//BPM).to_bytes(3,'big')),(0,-1,0xff,0x58,bytes([4,2,24,8])),(0,-1,0xff,0x03,b'Pyramid Run 160')]
for t,name in markers: tempo.append((t,-1,0xff,0x06,name.encode()))
def encode(evs,name=None):
    evs=sorted(evs,key=lambda e:(e[0], 0 if e[2]==0xff else (1 if e[2]==0xc0 else (2 if e[2]==0x80 else 3))))
    out=b''; last=0
    if name: out+=b'\x00\xff\x03'+vlq(len(name))+name.encode()
    for t,ch,st,a,b in evs:
        out+=vlq(t-last); last=t
        if st==0xff: out+=bytes([0xff,a])+vlq(len(b))+b
        elif st==0xc0: out+=bytes([0xc0|ch,a])
        else: out+=bytes([st|ch,a,b])
    return out+b'\x00\xff\x2f\x00'
chunks.append(encode(tempo))
for name in [LEAD,LEAD2,BASS,PAD,DR,PERC]: chunks.append(encode(tracks[name],name))
smf=b'MThd'+struct.pack('>IHHH',6,1,len(chunks),PPQ)+b''.join(b'MTrk'+struct.pack('>I',len(c))+c for c in chunks)
import sys
open(sys.argv[1],'wb').write(smf)
print('bars',30,'seconds',30*4*60/BPM,'bytes',len(smf))
# dump for the renderer
json.dump({'bpm':BPM,'ppq':PPQ,'tracks':{k:[e for e in v if e[2] in (0x90,0x80)] for k,v in tracks.items()}},open('score.json','w'))
