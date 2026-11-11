# Sam's "Drunken sailor" (four-part harmony, recorded dry), 2026-11-11, for the Pillars approach: heard from the street, coming out of the pub.
# python3 tools_shanty.py  -> pillars-shanty.m4a. Original kept in shanty-originals/. Needs ffmpeg (aac_at). Stdlib only.
# Only the first two lines (Sam, 2026-11-11: "just says 'what shall we do with a drunk sailor' twice and don't continue"): the take is cut
# at 8.5 s, the breath after the second "sailor" (the song runs in 1.95 s bars from 0.45 s; the dip there is -36 dB), so the room rings out after it.
# The dry take is given a panelled bar room (a synthetic 1.75 s decay), and the top rolled off at 3.2 kHz as if through the door and glass.
import subprocess, re, wave, array, math, random, os
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "shanty-originals", "Drunken sailor game.mp3")
TMP = os.path.join(HERE, "shanty-originals", "_work"); os.makedirs(TMP, exist_ok=True)

def lufs(path):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", err)[-1])

# a small room: noise under an exponential decay (RT60 about 1.75 s; was 1.4 until Sam asked for a little more reverb, 2026-11-11), early reflections thinned, darker as it dies
random.seed(93); SR = 48000; N = int(2.2 * SR); ir = []
lp = 0.0
for i in range(N):
    t = i / SR
    amp = math.exp(-6.9 * t / 1.75) * (0.35 if t < 0.012 else 1.0)
    k = min(0.92, 0.35 + t * 0.5)                 # one-pole low-pass that closes as the tail goes on
    lp = lp * k + (random.random() * 2 - 1) * (1 - k)
    ir.append(lp * amp)
pk = max(abs(x) for x in ir); irp = os.path.join(TMP, "room.wav")
w = wave.open(irp, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes(array.array("h", [int(x / pk * 32000) for x in ir]).tobytes()); w.close()

wet = os.path.join(TMP, "wet.wav")
subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", SRC, "-i", irp, "-filter_complex",
    "[0:a]aresample=48000,atrim=end=8.5,afade=t=out:st=8.3:d=0.2,apad=pad_dur=2.5[d];[d]asplit[a][b];[a][1:a]afir=dry=10:wet=10[r];[b][r]amix=inputs=2:weights='0.5 0.6':normalize=0,"
    "lowpass=f=3200,highpass=f=90,afade=t=out:st=9.8:d=1.2", "-ac", "2", wet], check=True)
gain = -29.9 - lufs(wet)                          # the door clips' level; the game sets it low (see pillarsShanty)
out = os.path.join(HERE, "pillars-shanty.m4a")
subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", wet, "-af", "volume=%.2fdB" % gain,
                "-c:a", "aac_at", "-b:a", "160k", "-movflags", "+faststart", out], check=True)
print("wrote pillars-shanty.m4a  %+.1f dB -> %.1f LUFS" % (gain, lufs(out)))
