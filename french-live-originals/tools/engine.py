"""Circular layering engine for DSS ambience beds.
Every layer is written into a ring of N samples (N a multiple of 1024 at 48 kHz),
so the finished loop has no seam; joins live only inside layers, as equal-power overlaps."""
import os, subprocess, numpy as np
from scipy.io import wavfile
from scipy.signal import stft, firwin2, fftconvolve, butter, sosfiltfilt

SR = 48000
HERE = os.path.dirname(os.path.abspath(__file__))

def nlen(sec):  # nearest whole number of AAC frames
    return int(round(sec * SR / 1024)) * 1024

_cache = {}
def src(name):
    if name not in _cache:
        sr, x = wavfile.read(f"{HERE}/clean/{name}.wav"); assert sr == SR
        _cache[name] = x.astype(np.float64)
    return _cache[name]

def cut(name, a, b):
    return src(name)[int(a * SR):int(b * SR)].copy()

# ---------------------------------------------------------------- tone
CENTRES = []
_fc = 100.0
while _fc < 14000: CENTRES.append(_fc); _fc *= 2 ** (1 / 3)
def thirds(x):
    f, t, Z = stft(x, SR, nperseg=4096); P = (np.abs(Z) ** 2).mean(axis=1)
    return np.array([10 * np.log10(P[(f >= c / 2 ** (1 / 6)) & (f < c * 2 ** (1 / 6))].mean() + 1e-20) for c in CENTRES])

def tone_match(x, ref_curve, maxdb=8.0, smooth=1):
    """Gentle linear-phase EQ that moves x's third-octave balance toward ref_curve (level-aligned at 400 Hz)."""
    d = ref_curve - thirds(x); d -= d[6]
    if smooth: d = np.convolve(np.r_[d[0], d, d[-1]], [0.25, 0.5, 0.25], "valid")
    d = np.clip(d, -maxdb, maxdb)
    freqs = np.r_[0, CENTRES, SR / 2] / (SR / 2); gains = 10 ** (np.r_[d[0], d, d[-1]] / 20)
    h = firwin2(2047, freqs, gains)
    return fftconvolve(x, h, mode="same")

def eq_shelf(x, f0, db, kind="high"):
    """Linear-phase shelf via firwin2 (no phase smear between layers)."""
    fr = np.linspace(0, 1, 512); f = fr * SR / 2
    s = 1 / (1 + (f0 / (f + 1)) ** 2) if kind == "high" else 1 / (1 + ((f + 1) / f0) ** 2)
    g = 10 ** (db * s / 20)
    return fftconvolve(x, firwin2(2047, fr, g), mode="same")

def eq_bell(x, f0, db, octaves=1.0):
    fr = np.linspace(0, 1, 1024); f = fr * SR / 2 + 1
    g = 10 ** (db * np.exp(-0.5 * (np.log2(f / f0) / (octaves / 2)) ** 2) / 20)
    return fftconvolve(x, firwin2(2047, fr, g), mode="same")

def lowpass(x, fc, order=4):
    return sosfiltfilt(butter(order, fc, "low", fs=SR, output="sos"), x)

# ---------------------------------------------------------------- ring
class Ring:
    def __init__(self, sec):
        self.n = nlen(sec); self.L = np.zeros(self.n); self.R = np.zeros(self.n)
    def add(self, sig, pos, gain=1.0, pan=0.0, side=None):
        """pan -1..1 constant-power; side 'L'/'R' writes one channel only."""
        n = self.n; pos = int(pos) % n; idx = (pos + np.arange(len(sig))) % n
        if side == "L": np.add.at(self.L, idx, sig * gain); return
        if side == "R": np.add.at(self.R, idx, sig * gain); return
        th = (pan + 1) * np.pi / 4
        np.add.at(self.L, idx, sig * gain * np.cos(th) * np.sqrt(2))
        np.add.at(self.R, idx, sig * gain * np.sin(th) * np.sqrt(2))
    def mono(self): return 0.5 * (self.L + self.R)

def ep_fades(sig, xf_in, xf_out):
    """Equal-power fade-in/out (sin/cos) for joining uncorrelated material."""
    s = sig.copy(); a = int(xf_in * SR); b = int(xf_out * SR)
    if a: s[:a] *= np.sin(np.linspace(0, np.pi / 2, a))
    if b: s[-b:] *= np.cos(np.linspace(0, np.pi / 2, b))
    return s

def body(ring, pieces, xf=3.0, start=0, gain=1.0, pans=None, side=None):
    """Lay pieces end to end (cycling the list if needed) with equal-power overlaps, filling exactly
    one lap from `start`; the last piece's fade-out lands on the first piece's fade-in. Pieces are only
    ever trimmed, never tiled, so every join is a crossfade."""
    n = ring.n; k = int(xf * SR); minlen = 2 * k + SR
    pieces = [p for p in pieces if len(p) >= minlen]; assert pieces, "no piece long enough for the crossfade"
    pos = 0; i = 0; laid = []
    while True:
        p = pieces[i % len(pieces)]; need = n + k - pos; reused = i >= len(pieces)
        if len(p) >= need:  # a piece coming round a second time gives its tail, not the head already heard
            laid.append((pos, p[-need:] if reused else p[:need])); break
        rem = need - (len(p) - k)          # what would be left after laying p whole
        if rem < minlen:                   # leave room for a tail long enough to crossfade
            p = p[: len(p) - (minlen - rem)]
        laid.append((pos, p)); pos += len(p) - k; i += 1
    for j, (p0, p) in enumerate(laid):
        pan = 0.0 if pans is None else pans[j % len(pans)]
        ring.add(ep_fades(p, xf, xf), start + p0, gain, pan, side)
    return len(laid)

def grains(ring, pool, density, glen=(0.5, 1.4), gain=1.0, rng=None, side=None, pan_spread=0.0, avoid=None):
    """Hann grains drawn at random from pool (list of arrays), scattered round the ring.
    density = average number of grains overlapping at any instant. Output normalised so its
    RMS equals the pool's RMS times gain (uncorrelated grains add in power)."""
    rng = rng or np.random.default_rng(0); n = ring.n
    mean_len = np.mean(glen); count = int(density * n / (mean_len * SR))
    tmp = Ring(n / SR); tmp.n = n; tmp.L = np.zeros(n); tmp.R = np.zeros(n)
    weights = np.array([len(p) for p in pool], float); weights /= weights.sum()
    for _ in range(count):
        p = pool[rng.choice(len(pool), p=weights)]; L = int(rng.uniform(*glen) * SR)
        if len(p) <= L: continue
        a = rng.integers(0, len(p) - L); g = p[a:a + L] * np.hanning(L)
        pan = rng.uniform(-pan_spread, pan_spread)
        tmp.add(g, rng.integers(0, n), 1.0, pan, side)
    pool_rms = np.sqrt(np.mean(np.concatenate(pool) ** 2))
    chans = [c for c in (tmp.L, tmp.R) if np.any(c)]
    cur = np.sqrt(np.mean(np.concatenate(chans) ** 2)) + 1e-12
    ring.L += tmp.L * gain * pool_rms / cur; ring.R += tmp.R * gain * pool_rms / cur
    return count

def events(ring, snippets, positions, gain=1.0, pans=None):
    for j, (s, p) in enumerate(zip(snippets, positions)):
        ring.add(ep_fades(s, 0.05, 0.15), p, gain, 0.0 if pans is None else pans[j % len(pans)])

def event_times(x, thresh_db=12.0, gap=0.4):
    """Onsets of high-band (2-8 kHz) spikes, seconds from the start of x."""
    f, t, Z = stft(x, SR, nperseg=1024, noverlap=1024 - 2400)
    hb = 10 * np.log10((np.abs(Z[(f > 2000) & (f < 8000)]) ** 2).sum(axis=0) + 1e-20)
    out = []
    for tt in t[hb > np.median(hb) + thresh_db]:
        if not out or tt - out[-1] > gap: out.append(tt)
    return out

def quiet_stretches(x, ev, pad=0.4, minlen=2.0):
    """Stretches of x with no event within pad seconds, at least minlen long."""
    bad = np.zeros(len(x), bool)
    for e in ev: bad[max(0, int((e - pad) * SR)):int((e + pad + 0.3) * SR)] = True
    out = []; i = 0
    while i < len(x):
        if bad[i]: i += 1; continue
        j = i
        while j < len(x) and not bad[j]: j += 1
        if j - i >= minlen * SR: out.append(x[i:j])
        i = j
    return out

# ---------------------------------------------------------------- rooms and riders
def room_ir(rt60, lp=4000.0, pre=0.012, seed=1, er=True):
    """Synthetic diffuse room: exponentially decaying noise, darkened, with a few early reflections."""
    rng = np.random.default_rng(seed); L = int(rt60 * 1.2 * SR)
    t = np.arange(L) / SR; ir = rng.standard_normal(L) * 10 ** (-3 * t / rt60)
    ir = lowpass(ir, lp, 2); ir[: int(pre * SR)] = 0
    if er:
        for d, g in ((0.007, 0.5), (0.013, 0.35), (0.019, 0.28), (0.027, 0.2)):
            ir[int(d * SR)] += g * (1 if rng.random() > 0.5 else -1) * np.abs(ir).max()
    return ir / np.sqrt(np.sum(ir ** 2))

def circ_conv(x, ir):
    """Circular convolution: the reverb tail past the loop's end wraps onto its head."""
    y = fftconvolve(x, ir); n = len(x); out = y[:n].copy(); out[: len(y) - n] += y[n:]
    return out

def reverb(ring, rt60, wet, lp=4000.0, seed=1):
    for ch, sd in (("L", seed), ("R", seed + 17)):  # different IRs per side = extra width
        x = getattr(ring, ch); ir = room_ir(rt60, lp, seed=sd)
        setattr(ring, ch, np.sqrt(1 - wet) * x + np.sqrt(wet) * circ_conv(x, ir))

def rider(ring, win=4.0, maxdb=4.0, strength=0.7):
    """Slow circular gain rider: pulls the seconds-scale level toward its median, at most maxdb."""
    n = ring.n; m = ring.mono(); h = SR // 10
    e = np.sqrt(np.add.reduceat(m ** 2, np.arange(0, n, h)) / h + 1e-12)
    k = int(win * 10); ker = np.hanning(2 * k + 1); ker /= ker.sum()
    e2 = np.r_[e[-k:], e, e[:k]]; sm = np.convolve(e2 ** 2, ker, "valid") ** 0.5
    db = 20 * np.log10(sm); corr = np.clip((np.median(db) - db) * strength, -maxdb, maxdb)
    g = 10 ** (corr / 20); gi = np.interp(np.arange(n), np.arange(len(g)) * h + h / 2, g, period=n)
    ring.L *= gi; ring.R *= gi

# ---------------------------------------------------------------- finish
TOOLS_TARGETS = {}
def write(ring, name, target_lufs, outdir):
    os.makedirs(outdir, exist_ok=True)
    data = np.stack([ring.L, ring.R], 1); data /= max(1e-9, np.abs(data).max()) / 0.5
    wav = f"{outdir}/_{name}.wav"; wavfile.write(wav, SR, data.astype(np.float32))
    def meas(p):
        o = subprocess.run(["ffmpeg", "-hide_banner", "-i", p, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
        i = [l for l in o.splitlines() if l.strip().startswith("I:")][-1].split()[1]
        pk = [l for l in o.splitlines() if l.strip().startswith("Peak:")][-1].split()[1]
        return float(i), float(pk)
    cur, _ = meas(wav); gain = target_lufs - cur
    dst = f"{outdir}/{name}.m4a"
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", wav, "-af",
                    f"volume={gain:.2f}dB,alimiter=limit=-1.5dB:attack=5:release=80:level=false",
                    "-c:a", "aac_at", "-b:a", "128k", "-movflags", "+faststart", dst], check=True)
    os.replace(wav, f"{outdir}/{name}.f32.wav")  # keep the pre-encode master for scoring
    i, pk = meas(dst)
    print(f"  wrote {name}.m4a  {ring.n / SR:.3f}s  I={i} LUFS peak={pk} dBFS")

def click_times(x, factor=10.0):
    m = x.mean(1) if x.ndim == 2 else x; dd = np.diff(m)
    loc = np.sqrt(np.convolve(dd ** 2, np.ones(480) / 480, "same")) + 1e-9
    return np.where(np.abs(dd) > factor * loc)[0] / SR

def circ(fn, x, *a, pad=SR, **kw):
    """Apply a linear filter to a looped signal without edge effects at the wrap."""
    y = fn(np.r_[x[-pad:], x, x[:pad]], *a, **kw); return y[pad:pad + len(x)]

def ring_filter(ring, fn, *a, **kw):
    ring.L = circ(fn, ring.L, *a, **kw); ring.R = circ(fn, ring.R, *a, **kw)

def file_layer(ring, path, gain_db, xf=3.0, start=0):
    """Lay a finished stereo loop (e.g. a September generated bed) under the ring as a floor, tiled with
    equal-power crossfades so its own loop point never shows. gain_db is relative to the file as levelled."""
    import tempfile
    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False).name
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-ar", str(SR), "-ac", "2", "-c:a", "pcm_f32le", tmp], check=True)
    sr, x = wavfile.read(tmp); os.unlink(tmp); x = x.astype(np.float64); g = 10 ** (gain_db / 20)
    reps = int(np.ceil((ring.n + xf * SR) / len(x))) + 1
    for ch, col in (("L", 0), ("R", 1)):
        body(ring, [x[:, col]] * reps, xf=xf, start=start, gain=g, side=ch)
