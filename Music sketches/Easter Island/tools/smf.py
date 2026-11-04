"""tiny SMF writer shared by the sketches"""
import struct, json
class Score:
    def __init__(s,bpm,ppq=480,title=''):
        s.bpm=bpm; s.ppq=ppq; s.tracks={}; s.order=[]; s.markers=[]; s.title=title; s.progs={}
    def track(s,name,ch,prog=None):
        if name not in s.tracks: s.tracks[name]=[]; s.order.append(name)
        if prog is not None: s.progs[name]=(ch,prog)
    def note(s,tr,ch,t,p,v,l):
        v=max(1,min(127,int(v))); s.tracks[tr].append((int(t),ch,0x90,p,v)); s.tracks[tr].append((int(t+l),ch,0x80,p,0))
    def marker(s,t,txt): s.markers.append((int(t),txt))
    def write(s,path):
        def vlq(n):
            b=[n&0x7f]; n>>=7
            while n: b.append(0x80|(n&0x7f)); n>>=7
            return bytes(reversed(b))
        def enc(evs,name=None,prog=None):
            evs=sorted(evs,key=lambda e:(e[0],0 if e[2]==0xff else (1 if e[2]==0x80 else 2)))
            out=b''; last=0
            if name: out+=b'\x00\xff\x03'+vlq(len(name))+name.encode()
            if prog: out+=b'\x00'+bytes([0xc0|prog[0],prog[1]])
            for t,ch,st,a,b in evs:
                out+=vlq(t-last); last=t
                if st==0xff: out+=bytes([0xff,a])+vlq(len(b))+b
                else: out+=bytes([st|ch,a,b])
            return out+b'\x00\xff\x2f\x00'
        tempo=[(0,-1,0xff,0x51,(60000000//s.bpm).to_bytes(3,'big')),(0,-1,0xff,0x58,bytes([4,2,24,8]))]
        if s.title: tempo.append((0,-1,0xff,0x03,s.title.encode()))
        for t,m in s.markers: tempo.append((t,-1,0xff,0x06,m.encode()))
        chunks=[enc(tempo)]+[enc(s.tracks[n],n,s.progs.get(n)) for n in s.order]
        smf=b'MThd'+struct.pack('>IHHH',6,1,len(chunks),s.ppq)+b''.join(b'MTrk'+struct.pack('>I',len(c))+c for c in chunks)
        open(path,'wb').write(smf)
        json.dump({'bpm':s.bpm,'ppq':s.ppq,'tracks':{k:v for k,v in s.tracks.items()}},open(path+'.json','w'))
        return len(smf)
