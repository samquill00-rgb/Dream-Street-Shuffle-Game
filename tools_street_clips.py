# Sam's street recording (New Recording 150, cut into five clips by GPT; originals in street-live-originals/), 2026-11-11.
# python3 tools_street_clips.py   -> writes the four game files beside the html. Needs ffmpeg (aac_at). Stdlib only.
#   lackland-doorbell.m4a  04-doorbell      the ring at Lackland's door, Frith Street (transition out>venue-lackland)
#   lackland-steps-out.m4a 01-footsteps     walking off from his door (transition venue-lackland>out)
#   map-cab-wet.m4a        03-cars...       one pass on the wet road, for the cab crossing Old Compton Street on the Soho map
#   street-wet-loop.m4a    05-street        a seamless wet-street layer under the street bed on outdoor pages
#   pub-pass-loop.m4a      02-pub-walk-by   the pub heard from the pavement as you walk past an open pub, club or bar on the Soho map
import subprocess, re, wave, array, math, os
HERE = os.path.dirname(os.path.abspath(__file__)); SRC = os.path.join(HERE, "street-live-originals")
TMP = os.path.join(HERE, "street-live-originals", "_work"); os.makedirs(TMP, exist_ok=True)

def lufs(path):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", err)[-1])

def encode(wav, dst, target):
    gain = target - lufs(wav)
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", wav, "-af", "volume=%.2fdB" % gain,
                    "-c:a", "aac_at", "-b:a", "128k", "-movflags", "+faststart", os.path.join(HERE, dst)], check=True)
    print("wrote %s  %+.1f dB -> %.1f LUFS" % (dst, gain, lufs(os.path.join(HERE, dst))))

def cut(name, out, af, ss=None, t=None):
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"]
    if ss is not None: cmd += ["-ss", str(ss)]
    if t is not None: cmd += ["-t", str(t)]
    cmd += ["-i", os.path.join(SRC, name), "-af", af, "-ar", "48000", "-ac", "1", out]
    subprocess.run(cmd, check=True); return out

# the transition clips sit at the French door clips' level (french-enter-bar.m4a, -29.9 LUFS); the game sets each gain
encode(cut("04-doorbell.wav", os.path.join(TMP, "bell.wav"), "highpass=f=60,afade=t=in:d=0.02,afade=t=out:st=1.2:d=0.2"), "lackland-doorbell.m4a", -29.9)
encode(cut("01-footsteps.wav", os.path.join(TMP, "steps.wav"), "highpass=f=60,afade=t=in:d=0.05,afade=t=out:st=6.2:d=0.65"), "lackland-steps-out.m4a", -29.9)
# the cab: 3.6-10.7 s holds the clip's one clear swell (peak about 8 s); faded in over the approach, out on the tail
encode(cut("03-cars-in-the-rain.wav", os.path.join(TMP, "cab.wav"), "highpass=f=40,afade=t=in:d=2.2,afade=t=out:st=5.5:d=1.6", ss=3.6, t=7.1), "map-cab-wet.m4a", -26.0)

def loop(src_wav, name, xf_secs):
    # an equal-power crossfade of the tail over the head; loop length a whole number of 1024-sample AAC frames
    w = wave.open(src_wav); n = w.getnframes(); a = array.array("h"); a.frombytes(w.readframes(n)); w.close()
    XF = int(xf_secs * 48000); L = ((n - XF) // 1024) * 1024
    out = array.array("h", a[:L])
    for i in range(XF):
        f = i / XF; fi, fo = math.sin(math.pi / 2 * f), math.cos(math.pi / 2 * f)
        out[i] = max(-32768, min(32767, int(a[i] * fi + a[L + i] * fo)))
    p = os.path.join(TMP, name); w = wave.open(p, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(48000); w.writeframes(out.tobytes()); w.close()
    print(name, "loop", L, "samples =", round(L / 48000, 3), "s,", L // 1024, "frames")
    return p

encode(loop(os.path.join(SRC, "05-street-ambience.wav"), "street.wav", 4), "street-wet-loop.m4a", -36.1)   # the street bed's own level (the-street-layered-floor.m4a)
# the pub: the whole clip (Sam, 2026-11-11: "a bit longer so it catches more"; was 0.5-11 s, a 7.5 s loop), high-passed so the
# footfalls give way to the room, and levelled over 10 s windows so the walk's tail-off holds up into the loop's crossfade
encode(loop(cut("02-pub-walk-by.wav", os.path.join(TMP, "pub.wav"), "highpass=f=130,dynaudnorm=f=500:g=21:m=6"), "publoop.wav", 3), "pub-pass-loop.m4a", -29.9)
