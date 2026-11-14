#!/usr/bin/env python3
"""2026-11-14 (Sam: "process it so it doesn't sound like me (one voice) but like a whole stadium in unison"; "not to cut off the very end").
Turns one voice into a terrace: N copies of the take, each shifted in pitch with its formants (so they read as different throats, most of
them lower), each a little early or late and drifting, each with its own tone and place across the stereo, summed, then put in a long
concrete bowl (a decaying-noise impulse with a slap off the far stand). Usage: tools_crowd.py IN START END OUT.wav [WORKDIR]. Needs ffmpeg."""
import random, subprocess, sys, os
src, start, end, out = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
W = sys.argv[5] if len(sys.argv) > 5 else '/tmp'
rnd = random.Random(1987); N = 44; SR = 48000
def run(args): subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y'] + args, check=True)
dry = os.path.join(W, 'crowd-dry.wav'); ir = os.path.join(W, 'crowd-ir.wav')
run(['-i', src, '-af', f'atrim=start={start}:end={end},asetpts=PTS-STARTPTS,aformat=channel_layouts=mono,aresample={SR},highpass=f=110,afade=t=in:d=0.03,afade=t=out:st={end - start - 0.45}:d=0.45,apad=pad_dur=0.6', dry])
run(['-f', 'lavfi', '-i', f'anoisesrc=d=2.8:c=white:r={SR}:a=0.6:s=5', '-f', 'lavfi', '-i', f'anoisesrc=d=2.8:c=white:r={SR}:a=0.6:s=71',
     '-filter_complex', '[0][1]amerge=inputs=2,highpass=f=180,lowpass=f=3200,afade=t=in:d=0.03,afade=t=out:st=0.03:d=2.75:curve=exp,volume=0.4', ir])
parts = [f'[0]asplit={N}' + ''.join(f'[s{i}]' for i in range(N))]
for i in range(N):
    st = max(-6.5, min(5.0, rnd.gauss(-1.6, 2.3))); r = 2 ** (st / 12); drift = 1 + rnd.uniform(-0.012, 0.012)
    late = rnd.uniform(0, 170) if rnd.random() < 0.85 else rnd.uniform(170, 330); vol = rnd.uniform(0.45, 1.0); pan = rnd.uniform(0.08, 0.92)
    hp = rnd.uniform(110, 320); lp = rnd.uniform(2400, 6000)
    parts.append(f'[s{i}]asetrate={SR * r:.1f},aresample={SR},atempo={drift / r:.5f},highpass=f={hp:.0f},lowpass=f={lp:.0f},adelay={late:.0f}:all=1,volume={vol:.2f},pan=stereo|c0={1 - pan:.2f}*c0|c1={pan:.2f}*c0[v{i}]')
parts.append(''.join(f'[v{i}]' for i in range(N)) + f'amix=inputs={N}:normalize=0,volume={1.6 / N ** 0.5:.3f},apad=pad_dur=3.0,asplit[d][w0]')
parts.append('[w0][1]afir=dry=0:wet=1,aecho=0.9:0.6:260|410:0.22|0.12[w]')
parts.append("[d][w]amix=inputs=2:weights='1 0.75':normalize=0,lowpass=f=5200,alimiter=limit=0.92")
run(['-i', dry, '-i', ir, '-filter_complex', ';'.join(parts), out])
print('crowd of', N, '->', out)
