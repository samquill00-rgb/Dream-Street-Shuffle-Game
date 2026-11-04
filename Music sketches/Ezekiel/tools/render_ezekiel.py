"""Synth preview of the Ezekiel variation: organ (drawbar sines), soft organ theme, metallic bells, low brass. 48 kHz stereo.
Usage: python3 render_ezekiel.py "<mid>" "<out.wav>" """
import sys,math,random,struct,array,mido
m=mido.MidiFile(sys.argv[1]); tpb=m.ticks_per_beat; SR=48000
tempo=500000
for t in m.tracks:
    for x in t:
        if x.type=='set_tempo': tempo=x.tempo; break
t2s=lambda tk: tk*tempo/1e6/tpb
notes=[]
for t in m.tracks:
    tick=0; on={}
    for x in t:
        tick+=x.time
        if x.type=='note_on' and x.velocity>0: on[(x.channel,x.note)]=(tick,x.velocity)
        elif x.type in('note_off','note_on') and (x.channel,x.note) in on: s,v=on.pop((x.channel,x.note)); notes.append((x.channel,t2s(s),t2s(tick)-t2s(s),x.note,v))
total=max(s+d for _,s,d,_,_ in notes)+4.0; N=int(total*SR); L=[0.0]*N; R=[0.0]*N
f=lambda p: 440*2**((p-69)/12)
def add(start,sig,gain,pan=0.0):
    i0=int(start*SR); gl=gain*(1-pan); gr=gain*(1+pan)
    for i,x in enumerate(sig):
        j=i0+i
        if j<N: L[j]+=x*gl; R[j]+=x*gr
def lp(sig,cut):
    a=math.exp(-2*math.pi*cut/SR); y=0.0; out=[]
    for x in sig: y=a*y+(1-a)*x; out.append(y)
    return out
def adsr(n,a,d,s,r,hold):
    out=[]
    for i in range(n):
        t=i/SR
        if t<a: e=t/a
        elif t<a+d: e=1-(1-s)*(t-a)/d
        elif t<hold: e=s
        else: e=s*max(0,1-(t-hold)/r)
        out.append(e)
    return out
random.seed(3)
for ch,s,d,p,v in notes:
    g=v/127; fr=f(p)
    if ch==0:   # foundation: low flute stop, slow attack
        n=int((d+2.5)*SR); e=adsr(n,1.5,0.5,0.9,2.5,d); out=[(math.sin(2*math.pi*fr*i/SR)+0.5*math.sin(2*math.pi*fr*2*i/SR)+0.15*math.sin(2*math.pi*fr*3*i/SR))*e[i] for i in range(n)]
        add(s,lp(out,1200),0.11*g)
    elif ch==1: # theme: principal/flute blend with a little reed
        n=int((d+0.9)*SR); e=adsr(n,0.18,0.3,0.85,0.9,d); out=[]
        for i in range(n):
            t=i/SR; x=math.sin(2*math.pi*fr*t)+0.55*math.sin(2*math.pi*fr*2*t)+0.3*math.sin(2*math.pi*fr*3*t)+0.18*math.sin(2*math.pi*fr*4*t)+0.08*math.sin(2*math.pi*fr*5*t)
            out.append(x*e[i])
        add(s,lp(out,3200),0.13*g,0.1)
    elif ch==2: # wheels: softened tubular bell, inharmonic partials, slow drift of pan
        n=int(3.0*SR); pan=0.35*math.sin(s*0.6); out=[(math.sin(2*math.pi*fr*i/SR)*math.exp(-i/SR*1.4)+0.5*math.sin(2*math.pi*fr*2.76*i/SR)*math.exp(-i/SR*3.5)+0.25*math.sin(2*math.pi*fr*5.4*i/SR)*math.exp(-i/SR*6)) for i in range(n)]
        add(s,[x*min(1,i/(0.008*SR)) for i,x in enumerate(out)],0.07*g,pan)
    elif ch==3: # vision: low brass, saw lowpassed, slow swell
        n=int((d+1.2)*SR); e=adsr(n,0.7,0.4,0.9,1.2,d); ph=0.0; out=[]
        for i in range(n):
            ph=(ph+fr/SR)%1.0; x=(2*ph-1)*0.6+0.4*math.sin(2*math.pi*ph); out.append(math.tanh(1.6*x)*e[i]*(0.7+0.3*min(1,i/SR/max(0.1,d))))
        add(s,lp(out,900),0.12*g,-0.1)
# a simple hall: two feedback delays
def verb(buf,sec,fb,mix):
    d=int(sec*SR); out=buf[:]
    for i in range(d,len(buf)): out[i]+=out[i-d]*fb*mix
    return out
L=verb(L,0.071,0.55,0.35); R=verb(R,0.089,0.55,0.35); L=verb(L,0.173,0.45,0.25); R=verb(R,0.151,0.45,0.25)
peak=max(max(abs(x) for x in L),max(abs(x) for x in R)); print('peak',peak)
pcm=array.array('h')
for l,r in zip(L,R): pcm.append(int(32000*math.tanh(l/peak*1.4))); pcm.append(int(32000*math.tanh(r/peak*1.4)))
with open(sys.argv[2],'wb') as w:
    w.write(b'RIFF'+struct.pack('<I',36+len(pcm)*2)+b'WAVEfmt '+struct.pack('<IHHIIHH',16,1,2,SR,SR*4,4,16)+b'data'+struct.pack('<I',len(pcm)*2)); pcm.tofile(w)
print('wrote',sys.argv[2],round(total,1))
