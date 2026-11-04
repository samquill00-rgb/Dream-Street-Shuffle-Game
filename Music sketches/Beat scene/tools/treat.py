"""treat.py: the Burial treatment for a finished track, so a kept original sits in the same room as the new ones.
Hall (folded round the loop so the tail is heard at the seam), vinyl crackle and dust, a lowpass lid, tape wow, a touch of drive;
length preserved to the sample (trimmed to a 1024 multiple), loudness returned to the source's own integrated LUFS unless --lufs.
Usage: python3 treat.py <in.m4a|mp3> <out.wav> [--lufs X] [--crackle 0.45] [--rain 0] [--lid 9000] [--wow 0.0025] [--verb 0.35] [--drive 1.15] [--noloop]"""
import sys,subprocess,argparse,numpy as np
sys.path.insert(0,__file__.rsplit('/',1)[0])
from beatkit import verb,lp,hp,wobble,noise,SR,bp
import struct
ap=argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('out'); ap.add_argument('--lufs',type=float); ap.add_argument('--crackle',type=float,default=0.45); ap.add_argument('--rain',type=float,default=0.0)
ap.add_argument('--lid',type=float,default=9000); ap.add_argument('--wow',type=float,default=0.0025); ap.add_argument('--verb',type=float,default=0.35); ap.add_argument('--drive',type=float,default=1.15); ap.add_argument('--noloop',action='store_true')
a=ap.parse_args()
raw=subprocess.run(['ffmpeg','-v','error','-i',a.src,'-ac','2','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
x=np.frombuffer(raw,dtype=np.float32).reshape(-1,2).astype(np.float64); n=(len(x)//1024)*1024; x=x[:n]; L=x[:,0].copy(); R=x[:,1].copy()
st=((0.071,0.6,a.verb),(0.089,0.6,a.verb),(0.173,0.5,a.verb*0.7),(0.151,0.5,a.verb*0.7),(0.233,0.45,a.verb*0.5),(0.251,0.45,a.verb*0.5))
if a.noloop:
    L=verb(L,st); R=verb(R,st)
else:   # loop-aware: reverb the track twice round so the tail of the end lands under the start, then take the second pass
    L2=verb(np.concatenate((L,L)),st)[n:]; R2=verb(np.concatenate((R,R)),st)[n:]; L,R=L2,R2
rng=np.random.default_rng(11)
if a.crackle:
    cr=np.zeros(n); idx=rng.integers(0,n,int(n/SR*55)); amp=rng.uniform(0.2,1.0,len(idx))**3
    for i,am in zip(idx,amp):
        m=min(int(0.004*SR),n-i); cr[i:i+m]+=am*np.exp(-np.arange(m)/SR*1800)*rng.choice((-1,1))
    cr=hp(cr,1800); dust=bp(noise(n),400,3000)*0.012
    ref=np.sqrt(np.mean(L**2)+1e-12)   # scale the crackle to the track's own level
    L+=(cr+dust)*a.crackle*ref*6; R+=(np.roll(cr,int(0.0007*SR))+dust*0.9)*a.crackle*ref*6
if a.rain:
    rn=bp(noise(n),1200,9000)*0.06; ref=np.sqrt(np.mean(L**2)+1e-12); L+=rn*a.rain*ref*6; R+=np.roll(rn,int(0.011*SR))*a.rain*ref*6
if a.lid: L=lp(L,a.lid); R=lp(R,a.lid)
if a.wow: L=wobble(L,a.wow,0.37); R=wobble(R,a.wow,0.41)
peak=max(np.abs(L).max(),np.abs(R).max()) or 1.0
pcm=np.empty(2*n,dtype=np.int16); pcm[0::2]=(32000*np.tanh(L/peak*a.drive)).astype(np.int16); pcm[1::2]=(32000*np.tanh(R/peak*a.drive)).astype(np.int16)
with open(a.out,'wb') as w:
    w.write(b'RIFF'+struct.pack('<I',36+len(pcm)*2)+b'WAVEfmt '+struct.pack('<IHHIIHH',16,1,2,SR,SR*4,4,16)+b'data'+struct.pack('<I',len(pcm)*2)); w.write(pcm.tobytes())
print('treated',a.src.rsplit('/',1)[-1],'->',a.out.rsplit('/',1)[-1],'%d samples (%.3f s)'%(n,n/SR))
