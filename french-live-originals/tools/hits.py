"""The bar recordings' one-shot events, sorted into glasses and laughs so each venue can dial them apart.
Auto-sorted by how the sound moves at its onset; hit_labels.json (written from hits.html) overrides any call.
python3 hits.py  -> rewrites ../hits.html for listening and relabelling."""
import os, json, numpy as np
import engine as E
from scipy.signal import stft

SR = E.SR
SOURCES = [("rec143_BAR", 0.5, 77.7), ("rec145_BAR", 102.5, 119.8), ("rec144_BAR", 80.3, 89.8)]
LABELS = os.path.join(E.HERE, "hit_labels.json")
PRE, POST = 0.06, {"glass": 0.5, "laugh": 0.9, "other": 0.5}

def _measure(x):
    """Refined onsets (2 ms) with: jh/jm = high-band (2.5-10k) and voice-band (200-1600) jump in dB,
    att = onset to high-band peak in ms, t10 = ms for the high band to fall 10 dB from its peak."""
    f, t, Z = stft(x, SR, nperseg=512, noverlap=512 - 96); dt = t[1] - t[0]
    P = np.abs(Z) ** 2; h = (f >= 2500) & (f < 10000); m = (f >= 200) & (f < 1600)
    hb = 10 * np.log10(P[h].sum(0) + 1e-20); mb = 10 * np.log10(P[m].sum(0) + 1e-20)
    out = []
    for e in E.event_times(x, 10.0, gap=0.3):
        c = int(e / dt); lo = max(60, c - 40); hi = min(len(hb) - 80, c + 40)
        if hi <= lo: continue
        i = lo + int(np.argmax(np.diff(hb[lo - 1:hi + 1])[:hi - lo]))   # steepest high-band rise
        pre = slice(i - 60, i - 10); p = i + int(np.argmax(hb[i:i + 15]))
        dec = hb[p:p + 60] < hb[p] - 10
        out.append(dict(t=round(i * dt, 3), jh=round(float(hb[p] - np.median(hb[pre])), 1),
                        jm=round(float(mb[i:i + 25].max() - np.median(mb[pre])), 1),
                        att=round((p - i) * dt * 1000), t10=round((int(np.argmax(dec)) if dec.any() else 60) * dt * 1000)))
    return out

def auto(h):
    """A glass is a sudden, mostly-high jump; a laugh lifts the voice band and hangs on."""
    if h["jh"] >= 10 and h["att"] <= 16 and h["jh"] - h["jm"] >= 6: return "glass"
    if h["jm"] >= 4 and h["t10"] >= 80: return "laugh"
    return "other"

_hits = None
def hits():
    """Every event as a dict: id, src, t (s in the source file), features, auto, label."""
    global _hits
    if _hits is None:
        over = json.load(open(LABELS)) if os.path.exists(LABELS) else {}
        _hits = []
        for name, a, b in SOURCES:
            for h in _measure(E.cut(name, a, b)):
                h = dict(h, src=name, t=round(a + h["t"], 3)); h["id"] = f"{name}@{h['t']:.2f}"
                h["auto"] = auto(h); h["label"] = over.get(h["id"], h["auto"]); _hits.append(h)
    return _hits

def snip(h, post=None):
    post = POST[h["label"]] if post is None else post
    return E.cut(h["src"], h["t"] - PRE, h["t"] + post)

def pool(label):
    return [snip(h) for h in hits() if h["label"] == label]

def export():
    uris = {}
    for h in hits():
        x = snip(h, 0.9); x = x / max(1e-9, np.abs(x).max()) * 0.7; uris[h["id"]] = E.mp3_uri(x)
    page = open(os.path.join(E.HERE, "hits_template.html")).read().replace("__HITS__", json.dumps(hits())).replace("__AUDIO__", json.dumps(uris))
    open(os.path.normpath(os.path.join(E.HERE, "..", "hits.html")), "w").write(page)
    n = {k: sum(h["label"] == k for h in hits()) for k in ("glass", "laugh", "other")}
    print(f"{len(hits())} hits: {n}  -> hits.html")

if __name__ == "__main__":
    export()
