"""Sam's own glass-and-object recordings, cut at their natural pauses into whole gestures (a clink-clink, a set-down)
so each stays recognisable, and handed out to the venues he ticks for them.
Drop any new recording (m4a/wav/mp3/aif) into ../../glass-originals/ and rerun: it is converted once into
clean/glass_<name>.wav, cut, and shown on the page as new. glass_venues.json holds his ticks ({piece id: [venues]}).
python3 glass.py  -> rewrites ../../glass-originals/glass.html for listening and ticking."""
import os, glob, json, subprocess, numpy as np
import engine as E
from scipy.signal import stft

SR = E.SR
GLASS_DIR = os.path.normpath(os.path.join(E.HERE, "..", "..", "glass-originals"))
VENUES_FILE = os.path.join(E.HERE, "glass_venues.json")
VENUES = {"busy_bar": "Coach", "warm_pub": "Pillars", "quiet_lounge": "Trisha's", "colony_room": "Colony"}
PRE, TAIL, GAP = 0.08, 0.25, 0.4    # lead-in, ring-out kept after the sound falls, longest pause inside one gesture
AUDIO_EXT = (".m4a", ".wav", ".mp3", ".aif", ".aiff", ".caf", ".flac")

def recordings():
    """Every recording in glass-originals/, converted (once, or again if the original is newer) to a mono 48 kHz clean wav."""
    names = []
    for p in sorted(glob.glob(os.path.join(GLASS_DIR, "*"))):
        if not p.lower().endswith(AUDIO_EXT): continue
        name = "glass_" + os.path.splitext(os.path.basename(p))[0].replace(" ", "-")
        dst = os.path.join(E.HERE, "clean", name + ".wav")
        if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(p):
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", p, "-ac", "1", "-ar", str(SR), "-c:a", "pcm_f32le", dst], check=True)
            print(f"  converted {os.path.basename(p)}")
        names.append(name)
    return names

def _measure(name):
    """Runs of sound over the room floor, joined across pauses under GAP seconds. dom = strongest partial (Hz)."""
    x = E.src(name)
    f, t, Z = stft(x, SR, nperseg=1024, noverlap=1024 - 480); dt = t[1] - t[0]; P = np.abs(Z) ** 2
    hb = 10 * np.log10(P[f > 300].sum(0) + 1e-20); on = hb > np.percentile(hb, 20) + 8
    segs = []; i = 0
    while i < len(on):
        if not on[i]: i += 1; continue
        j = i
        while j < len(on) and on[j]: j += 1
        if segs and (i - segs[-1][1]) * dt < GAP: segs[-1][1] = j
        else: segs.append([i, j])
        i = j
    band = (f > 300) & (f < 14000); out = []
    for a, b in segs:
        if (b - a) * dt < 0.08: continue
        sp = P[band, a:b].mean(1)
        out.append(dict(src=name, t=round(a * dt, 2), end=round(b * dt, 2), dom=round(float(f[band][np.argmax(sp)]))))
    return out

_pieces = None
def pieces():
    """Every gesture: id, src, t, end, dom, venues (venue keys ticked), new (never saved from the page)."""
    global _pieces
    if _pieces is None:
        ticks = json.load(open(VENUES_FILE)) if os.path.exists(VENUES_FILE) else {}
        _pieces = []
        for n in recordings():
            for h in _measure(n):
                h["id"] = f"{n[6:]}@{h['t']:.2f}"; h["new"] = h["id"] not in ticks
                h["venues"] = ticks.get(h["id"], []); _pieces.append(h)
    return _pieces

def snip(h):
    """The gesture from just before it starts to just after it rings out, with a 30 ms fade at the end."""
    x = E.cut(h["src"], max(0.0, h["t"] - PRE), h["end"] + TAIL); k = int(0.03 * SR)
    x[-k:] *= np.cos(np.linspace(0, np.pi / 2, k)); return x

def pool(venue):
    return [snip(h) for h in pieces() if venue in h["venues"]]

def export():
    uris = {}
    for h in pieces():
        x = snip(h); uris[h["id"]] = E.mp3_uri(x / max(1e-9, np.abs(x).max()) * 0.7)
    page = (open(os.path.join(E.HERE, "glass_template.html")).read()
            .replace("__HITS__", json.dumps(pieces())).replace("__AUDIO__", json.dumps(uris)).replace("__VENUES__", json.dumps(VENUES)))
    open(os.path.join(GLASS_DIR, "glass.html"), "w").write(page)
    per = {v: sum(k in h["venues"] for h in pieces()) for k, v in VENUES.items()}
    print(f"{len(pieces())} pieces ({sum(h['new'] for h in pieces())} new): {per}  -> glass-originals/glass.html")

if __name__ == "__main__":
    export()
