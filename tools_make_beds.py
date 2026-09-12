#!/usr/bin/env python
"""Procedural replacements for the nine licensed ambience beds in Dream Street Shuffle.
Every sound here is synthesised from noise and sine partials; nothing is sampled.
Output: seamless-loop stereo files with the SAME filenames the game already links."""
import os, sys, wave, subprocess, math
import numpy as np

SR = 44100
OUT = sys.argv[1] if len(sys.argv) > 1 else "."
DUR = 72.0  # seconds per loop
# integrated loudness of the licensed originals (measured 2026-09-12), so nothing in the .twee needs retuning
TARGET_LUFS = {
    "the-french-pub-ambience.mp3": -30.2, "the-pillars-pub-ambience.m4a": -29.4, "the-coach-night-ambience.m4a": -40.0,
    "the-quiet-cafe-ambience.m4a": -37.8, "the-gents-coach-toilet.mp3": -33.3, "the-cellar-pump-ambience.m4a": -37.7,
    "the-carthage-cicadas-ambience.m4a": -30.9, "the-green-sea-cafe-ambience.m4a": -35.4, "the-soho-dawn-ambience.m4a": -23.7,
}

# ---------------------------------------------------------------- helpers
def R(seed): return np.random.default_rng(seed)

def shaped(n, curve, r):
    """White noise shaped in the frequency domain by curve(f) -> magnitude."""
    w = r.standard_normal(n)
    F = np.fft.rfft(w)
    f = np.fft.rfftfreq(n, 1.0 / SR)
    F *= curve(f)
    x = np.fft.irfft(F, n)
    return x / (np.abs(x).max() + 1e-9)

def bp(lo, hi, slope=2.0):
    return lambda f: (1.0 / (1.0 + (lo / (f + 1.0)) ** (2 * slope))) * (1.0 / (1.0 + (f / hi) ** (2 * slope)))

def lp(hi, slope=2.0): return lambda f: 1.0 / (1.0 + (f / hi) ** (2 * slope))
def hp(lo, slope=2.0): return lambda f: 1.0 / (1.0 + (lo / (f + 1.0)) ** (2 * slope))
def pinkish(f): return 1.0 / np.sqrt(f + 30.0)
def brownish(f): return 1.0 / (f + 30.0)
def mul(*cs): return lambda f: np.prod([c(f) for c in cs], axis=0)

def lfo_env(n, r, periods=(7.0, 13.0, 29.0), depth=0.5, floor=None):
    """Slow wandering envelope in [1-depth, 1]."""
    t = np.arange(n) / SR
    e = np.zeros(n)
    for p in periods:
        e += np.sin(2 * np.pi * t / (p * r.uniform(0.8, 1.25)) + r.uniform(0, 6.28))
    e = (e - e.min()) / (e.max() - e.min() + 1e-9)
    return (1.0 - depth) + depth * e

def tone(freqs, dur, decay, amps=None, r=None, detune=0.0):
    n = int(dur * SR); t = np.arange(n) / SR
    y = np.zeros(n)
    for i, f in enumerate(freqs):
        a = 1.0 if amps is None else amps[i]
        fd = f * (1.0 + (r.uniform(-detune, detune) if r is not None else 0.0))
        y += a * np.sin(2 * np.pi * fd * t + (r.uniform(0, 6.28) if r is not None else 0.0)) * np.exp(-t / (decay * (0.6 + 0.4 * (1.0 / (i + 1)))))
    y[:8] *= np.linspace(0, 1, 8)
    return y / (np.abs(y).max() + 1e-9)

def burst(dur, curve, r, attack=0.004, release=None):
    n = int(dur * SR)
    y = shaped(n, curve, r)
    t = np.arange(n) / SR
    rel = release if release is not None else dur * 0.6
    env = np.minimum(1.0, t / attack) * np.exp(-np.maximum(0.0, t - attack) / rel)
    return y * env

def reverb(x, rt60, r, wet=0.35, pre=0.012, size=1.0):
    n = int(rt60 * SR)
    t = np.arange(n) / SR
    ir = r.standard_normal(n) * np.exp(-6.9 * t / rt60)
    # early reflections
    for d in (0.007, 0.013, 0.021, 0.034):
        i = int(d * size * SR)
        if i < n: ir[i] += r.uniform(0.3, 0.7)
    ir = shaped(n, lp(6000, 1.0), r) * np.exp(-6.9 * t / rt60) + ir * 0.4
    ir /= (np.abs(ir).sum() / 40.0 + 1e-9)
    N = len(x) + n
    y = np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)[: len(x)]
    y = np.roll(y, int(pre * SR)); y[: int(pre * SR)] = 0
    return x * (1 - wet) + y * wet / (np.abs(y).max() + 1e-9) * np.abs(x).max()

class Bed:
    def __init__(self, seed, dur=DUR):
        self.r = R(seed); self.n = int(dur * SR)
        self.L = np.zeros(self.n); self.R_ = np.zeros(self.n)
    def add(self, x, gain=1.0, pan=0.0, at=0.0):
        """pan -1..1; wraps around the loop end so events straddling the seam still loop."""
        i = int(at * SR) % self.n
        g_l = gain * math.cos((pan + 1) * math.pi / 4); g_r = gain * math.sin((pan + 1) * math.pi / 4)
        m = len(x)
        idx = (np.arange(m) + i) % self.n
        np.add.at(self.L, idx, x * g_l); np.add.at(self.R_, idx, x * g_r)
    def add_stereo(self, l, rr, gain=1.0):
        self.L += l[: self.n] * gain; self.R_ += rr[: self.n] * gain
    def scatter(self, make, count, gain, spread=1.0, gain_jit=0.5, region=None):
        for _ in range(count):
            at = self.r.uniform(0, self.n / SR) if region is None else self.r.uniform(*region)
            self.add(make(), gain * self.r.uniform(1 - gain_jit, 1.0), self.r.uniform(-spread, spread), at)
    def finish(self, peak=0.5, xf=3.0):
        for ch in ("L", "R_"):
            x = getattr(self, ch)
            # seamless loop: equal-power crossfade of the tail into the head
            k = int(xf * SR); w = np.linspace(0, 1, k)
            head = x[:k].copy(); tail = x[-k:].copy()
            x[:k] = head * np.sqrt(w) + tail * np.sqrt(1 - w)
            x = x[: self.n - k]
            setattr(self, ch, x)
        m = max(np.abs(self.L).max(), np.abs(self.R_).max()) + 1e-9
        self.L *= peak / m; self.R_ *= peak / m
        return self

def write(bed, name):
    wav = os.path.join(OUT, "_tmp_" + os.path.splitext(name)[0] + ".wav")
    data = np.stack([bed.L, bed.R_], axis=1)
    pcm = (np.clip(data, -1, 1) * 32767).astype("<i2")
    with wave.open(wav, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    dst = os.path.join(OUT, name)
    # match the integrated loudness of the licensed original so the game's bed volumes still hold
    target = TARGET_LUFS.get(name)
    vol = []
    if target is not None:
        out = subprocess.run(["ffmpeg", "-hide_banner", "-i", wav, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
        cur = [l for l in out.splitlines() if l.strip().startswith("I:")][-1].split()[1]
        vol = ["-af", "volume=%.2fdB" % (target - float(cur))]
    if name.endswith(".m4a"):
        cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", wav] + vol + ["-c:a", "aac_at", "-b:a", "128k", "-movflags", "+faststart", dst]
    else:
        cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", wav] + vol + ["-c:a", "libmp3lame", "-b:a", "128k", dst]
    subprocess.run(cmd, check=True); os.remove(wav)
    print("wrote", name, os.path.getsize(dst) // 1024, "KB")

# ---------------------------------------------------------------- vocabulary
def murmur(bed, gain, brightness=1400.0, depth=0.55, voices=60, syll_gain=0.5, seed_off=0):
    r = bed.r; n = bed.n
    base_l = shaped(n, mul(pinkish, bp(160, brightness)), r) * lfo_env(n, r, depth=depth)
    base_r = shaped(n, mul(pinkish, bp(160, brightness)), r) * lfo_env(n, r, depth=depth)
    bed.add_stereo(base_l, base_r, gain)
    # syllable bursts: little formant blobs with 4-6 Hz amplitude modulation
    for _ in range(voices):
        f0 = r.uniform(220, 900); dur = r.uniform(0.25, 1.1)
        m = int(dur * SR); t = np.arange(m) / SR
        v = shaped(m, bp(f0 * 0.7, f0 * 2.2, 3.0), r)
        am = 0.55 + 0.45 * np.sin(2 * np.pi * r.uniform(3.5, 6.5) * t + r.uniform(0, 6))
        env = np.sin(np.pi * np.minimum(1, t / dur)) ** 0.7
        bed.add(v * am * env, gain * syll_gain * r.uniform(0.25, 1.0), r.uniform(-0.9, 0.9), r.uniform(0, n / SR))

def laugh(r):
    dur = r.uniform(0.6, 1.3); m = int(dur * SR); t = np.arange(m) / SR
    f0 = r.uniform(300, 700)
    v = shaped(m, bp(f0, f0 * 3.2, 2.5), r)
    rate = r.uniform(4.5, 6.5)
    am = (np.sin(2 * np.pi * rate * t) > 0.1).astype(float) * 0.8 + 0.2
    env = np.exp(-t / (dur * 0.5)) * np.minimum(1, t / 0.05)
    return v * am * env

def clink(r, hi=False):
    base = r.uniform(2100, 3300) * (1.5 if hi else 1.0)
    return tone([base, base * 1.93, base * 2.71], r.uniform(0.18, 0.4), 0.09, [1, 0.5, 0.25], r, 0.01)

def cup(r):
    base = r.uniform(1500, 2400)
    y = tone([base, base * 1.72], 0.12, 0.03, [1, 0.6], r, 0.02)
    k = burst(0.01, hp(2000), r)
    y[: len(k)] += k * 0.6
    return y

def spoon(r):
    return np.concatenate([tone([r.uniform(3800, 5200)], 0.07, 0.02, r=r) * r.uniform(0.4, 1) for _ in range(r.integers(2, 5))])

def door_thud(r):
    y = tone([70, 140], 0.25, 0.08, [1, 0.3], r) * 0.8
    k = burst(0.09, lp(500), r, 0.002, 0.03)
    y[: len(k)] += k
    return y

def chair_scrape(r):
    m = int(r.uniform(0.2, 0.5) * SR); t = np.arange(m) / SR
    return shaped(m, bp(250, 1500, 1.5), r) * (0.6 + 0.4 * np.sin(2 * np.pi * 27 * t)) * np.sin(np.pi * t / t[-1])

def till(r):
    return np.concatenate([tone([2600, 5200], 0.05, 0.01, [1, 0.4], r), np.zeros(int(0.15 * SR)), tone([1900, 3900], 0.3, 0.12, [1, 0.5], r)])

def drip(r, rt=1.4, wet=0.5):
    m = int(0.045 * SR); t = np.arange(m) / SR
    f = 1300 * np.exp(-t * 18)  # falling blip
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.012)
    y = np.concatenate([y, np.zeros(int(0.6 * SR))])
    return reverb(y, rt, r, wet=wet, size=0.6)

def flush(r):
    dur = 5.0; m = int(dur * SR); t = np.arange(m) / SR
    hiss = shaped(m, mul(pinkish, bp(400, 6000)), r)
    env = np.minimum(1, t / 0.6) * np.exp(-np.maximum(0, t - 1.8) / 1.4)
    gurgle = shaped(m, bp(80, 400, 1.5), r) * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * t)) * np.exp(-np.maximum(0, t - 1.0) / 1.2)
    return hiss * env + gurgle * 0.7

def cistern_fill(r, dur=14.0):
    m = int(dur * SR); t = np.arange(m) / SR
    y = shaped(m, bp(900, 5000, 1.5), r)
    env = np.minimum(1, t / 2.0) * (1 - np.minimum(1, np.maximum(0, t - dur + 3) / 3))
    return y * env * (0.7 + 0.3 * lfo_env(m, r, periods=(0.9, 1.7), depth=0.6))

def fan_hum(bed, gain, f0=100.0):
    n = bed.n; t = np.arange(n) / SR; r = bed.r
    h = sum(np.sin(2 * np.pi * f0 * k * t + r.uniform(0, 6)) / (k ** 1.6) for k in range(1, 7))
    h *= 0.7 + 0.3 * lfo_env(n, r, periods=(0.25, 3.0), depth=0.3)
    whoosh = shaped(n, mul(pinkish, lp(500)), r)
    bed.add_stereo(h + whoosh * 1.4, h * 0.95 + shaped(n, mul(pinkish, lp(500)), r) * 1.4, gain)

def cicada(r, dur, rate, f_lo, f_hi):
    m = int(dur * SR); t = np.arange(m) / SR
    carrier = shaped(m, bp(f_lo, f_hi, 3.0), r)
    pulse = (np.sin(2 * np.pi * rate * t) > 0.35).astype(float)
    pulse = np.convolve(pulse, np.ones(40) / 40, mode="same")
    env = np.sin(np.pi * np.minimum(1, t / dur)) ** 0.5
    return carrier * pulse * env

def bird_phrase(r, low=2200, high=4300, notes=None, vib=0.0):
    k = notes if notes is not None else r.integers(2, 6)
    parts = []
    for _ in range(k):
        d = r.uniform(0.05, 0.14); m = int(d * SR); t = np.arange(m) / SR
        f1 = r.uniform(low, high); f2 = f1 * r.uniform(0.75, 1.3)
        f = f1 + (f2 - f1) * (t / d) + vib * np.sin(2 * np.pi * 40 * t)
        y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 0.6
        parts.append(y); parts.append(np.zeros(int(r.uniform(0.03, 0.12) * SR)))
    return np.concatenate(parts)

def car_pass(r):
    dur = r.uniform(3.5, 6.5); m = int(dur * SR); t = np.arange(m) / SR
    y = shaped(m, mul(pinkish, bp(120, 1800)), r)
    c = dur * r.uniform(0.4, 0.6)
    env = np.exp(-((t - c) ** 2) / (2 * (dur * 0.18) ** 2))
    tyre = shaped(m, bp(800, 4000), r) * env ** 2 * 0.5
    return (y + tyre) * env

def sea_wash(bed, gain, period=9.0):
    n = bed.n; r = bed.r; t = np.arange(n) / SR
    ph = 0.0; env = np.zeros(n); i = 0
    while i < n:
        p = period * r.uniform(0.75, 1.3); m = int(p * SR)
        seg = np.arange(min(m, n - i)) / SR
        crest = np.sin(np.pi * seg / p) ** 2.2
        env[i:i + len(seg)] = crest * r.uniform(0.6, 1.0)
        i += m
    body_l = shaped(n, mul(pinkish, lp(1400, 1.5)), r); body_r = shaped(n, mul(pinkish, lp(1400, 1.5)), r)
    foam = shaped(n, bp(1500, 7000, 1.5), r)
    denv = np.clip(np.gradient(env) * SR * 2.5, 0, 1)  # hiss on the rising crest
    bed.add_stereo(body_l * (0.25 + env) + foam * (env ** 3 + denv) * 0.5, body_r * (0.25 + env) + foam * (env ** 3 + denv) * 0.5, gain)

def wind(bed, gain, hi=600.0, depth=0.7):
    n = bed.n; r = bed.r
    l = shaped(n, mul(brownish, lp(hi, 1.5)), r) * lfo_env(n, r, periods=(4.0, 9.0, 21.0), depth=depth)
    rr = shaped(n, mul(brownish, lp(hi, 1.5)), r) * lfo_env(n, r, periods=(4.0, 9.0, 21.0), depth=depth)
    bed.add_stereo(l, rr, gain)

def traffic(bed, gain):
    n = bed.n; r = bed.r
    l = shaped(n, mul(brownish, lp(260, 1.5)), r) * lfo_env(n, r, periods=(5.0, 11.0, 31.0), depth=0.5)
    rr = shaped(n, mul(brownish, lp(260, 1.5)), r) * lfo_env(n, r, periods=(5.0, 11.0, 31.0), depth=0.5)
    bed.add_stereo(l, rr, gain)

# ---------------------------------------------------------------- the nine beds
def pub_french():
    b = Bed(11)
    murmur(b, 1.0, brightness=1600, depth=0.5, voices=70, syll_gain=0.45)
    b.scatter(lambda: clink(b.r), 26, 0.28)
    b.scatter(lambda: laugh(b.r), 5, 0.22)
    b.scatter(lambda: chair_scrape(b.r), 4, 0.16)
    b.scatter(lambda: door_thud(b.r), 2, 0.3)
    # zinc bar: a bottle set down now and then
    b.scatter(lambda: tone([420, 1100, 2300], 0.2, 0.05, [1, 0.5, 0.3], b.r), 8, 0.2)
    write(b.finish(0.55), "the-french-pub-ambience.mp3")

def pub_pillars():
    b = Bed(23)
    murmur(b, 1.0, brightness=1300, depth=0.6, voices=90, syll_gain=0.55)
    b.scatter(lambda: clink(b.r), 34, 0.3)
    b.scatter(lambda: laugh(b.r), 9, 0.26)
    b.scatter(lambda: chair_scrape(b.r), 5, 0.18)
    b.scatter(lambda: door_thud(b.r), 3, 0.32)
    b.scatter(lambda: till(b.r), 2, 0.2)
    write(b.finish(0.55), "the-pillars-pub-ambience.m4a")

def coach_night():
    b = Bed(37)
    murmur(b, 1.0, brightness=1500, depth=0.45, voices=120, syll_gain=0.65)
    b.scatter(lambda: clink(b.r), 40, 0.3)
    b.scatter(lambda: laugh(b.r), 14, 0.3)
    b.scatter(lambda: chair_scrape(b.r), 4, 0.16)
    b.scatter(lambda: door_thud(b.r), 3, 0.3)
    b.scatter(lambda: till(b.r), 3, 0.22)
    # a raised voice that nobody answers
    b.scatter(lambda: burst(0.9, bp(250, 1200, 2.5), b.r, 0.02, 0.35), 3, 0.28)
    write(b.finish(0.55), "the-coach-night-ambience.m4a")

def quiet_cafe():
    b = Bed(41)
    murmur(b, 0.55, brightness=1100, depth=0.6, voices=22, syll_gain=0.4)
    fan_hum(b, 0.12, f0=50.0)  # a fridge behind the counter
    b.scatter(lambda: cup(b.r), 14, 0.22)
    b.scatter(lambda: spoon(b.r), 6, 0.14)
    b.scatter(lambda: chair_scrape(b.r), 2, 0.1)
    # a clock somewhere: gentle tick every second, dry
    n = b.n; tick = tone([3200, 900], 0.02, 0.006, [0.6, 1], b.r)
    for i in range(int(n / SR)):
        b.add(tick, 0.05 if i % 2 == 0 else 0.038, 0.55, i + 0.3)
    # coffee machine steam twice
    b.scatter(lambda: burst(2.2, bp(1200, 6000), b.r, 0.15, 0.9), 2, 0.16)
    write(b.finish(0.5), "the-quiet-cafe-ambience.m4a")

def gents():
    b = Bed(53)
    fan_hum(b, 0.35, f0=100.0)
    # the pub through the wall
    n = b.n
    far_l = shaped(n, mul(pinkish, lp(320, 2.0)), b.r) * lfo_env(n, b.r, depth=0.5)
    far_r = shaped(n, mul(pinkish, lp(320, 2.0)), b.r) * lfo_env(n, b.r, depth=0.5)
    b.add_stereo(far_l, far_r, 0.35)
    b.scatter(lambda: drip(b.r, 1.6, 0.6), 22, 0.3)
    b.add(flush(b.r), 0.5, 0.4, 18.0)
    b.add(cistern_fill(b.r), 0.28, 0.4, 20.5)
    b.add(door_thud(b.r), 0.35, -0.6, 44.0)
    b.add(reverb(door_thud(b.r), 1.2, b.r, 0.5), 0.3, 0.5, 61.0)
    # tiled reverb over the whole thing
    b.L = reverb(b.L, 1.5, b.r, 0.28); b.R_ = reverb(b.R_, 1.5, b.r, 0.28)
    write(b.finish(0.5), "the-gents-coach-toilet.mp3")

def cellar():
    b = Bed(61)
    fan_hum(b, 0.3, f0=60.0)  # cooler unit
    wind(b, 0.25, hi=250, depth=0.4)  # cold air moving
    b.scatter(lambda: drip(b.r, 2.2, 0.7), 16, 0.28)
    # the pump: chug cycles, 14 s on, 12 s off
    t0 = 6.0
    while t0 < DUR:
        for k in range(int(14 / 0.85)):
            at = t0 + k * 0.85
            thump = tone([58, 116], 0.18, 0.05, [1, 0.35], b.r)
            hiss = burst(0.11, bp(900, 3200), b.r, 0.003, 0.04)
            b.add(thump, 0.55, -0.3, at); b.add(hiss, 0.25, -0.25, at + 0.05)
        t0 += 26.0
    # pipe knock
    b.scatter(lambda: reverb(tone([310, 780, 1600], 0.3, 0.06, [1, 0.5, 0.2], b.r), 1.8, b.r, 0.6), 4, 0.25)
    b.L = reverb(b.L, 1.9, b.r, 0.3); b.R_ = reverb(b.R_, 1.9, b.r, 0.3)
    write(b.finish(0.5), "the-cellar-pump-ambience.m4a")

def cicadas():
    b = Bed(71)
    wind(b, 0.18, hi=800, depth=0.6)
    # a chorus of individuals, each swelling for a while at its own pulse rate
    for i in range(14):
        rate = b.r.uniform(95, 190); f_lo = b.r.uniform(3800, 5200); f_hi = f_lo * b.r.uniform(1.4, 1.9)
        t = b.r.uniform(0, DUR)
        while t < DUR + 20:
            d = b.r.uniform(4, 11)
            b.add(cicada(b.r, d, rate, f_lo, f_hi), b.r.uniform(0.12, 0.3), b.r.uniform(-0.95, 0.95), t)
            t += d + b.r.uniform(1, 9)
    # the constant far-off shimmer
    n = b.n
    b.add_stereo(shaped(n, bp(4500, 8000, 3), b.r) * 0.12, shaped(n, bp(4500, 8000, 3), b.r) * 0.12, 1.0)
    write(b.finish(0.5), "the-carthage-cicadas-ambience.m4a")

def green_sea():
    b = Bed(83)
    sea_wash(b, 0.9, period=9.5)
    wind(b, 0.12, hi=500, depth=0.5)
    # the cafe behind you, sparse
    murmur(b, 0.22, brightness=1000, depth=0.6, voices=14, syll_gain=0.35)
    b.scatter(lambda: cup(b.r), 8, 0.14)
    b.scatter(lambda: spoon(b.r), 3, 0.08)
    # a gull, far, twice
    def gull():
        d = b.r.uniform(0.35, 0.7); m = int(d * SR); t = np.arange(m) / SR
        f = 1100 + 500 * np.sin(np.pi * t / d) + 40 * np.sin(2 * np.pi * 30 * t)
        y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 0.4
        return reverb(y, 0.8, b.r, 0.5)
    b.scatter(gull, 2, 0.08, spread=0.9)
    write(b.finish(0.5), "the-green-sea-cafe-ambience.m4a")

def soho_dawn():
    b = Bed(97)
    traffic(b, 0.5)
    b.scatter(lambda: car_pass(b.r), 5, 0.22)
    # blackbird: lower, fluty, vibrato, long pauses
    b.scatter(lambda: bird_phrase(b.r, 1700, 2900, vib=12.0), 10, 0.16, spread=0.6)
    # smaller birds higher and further
    b.scatter(lambda: bird_phrase(b.r, 3000, 5200), 24, 0.09, spread=0.95)
    # one pigeon, close: soft low coo
    def coo():
        d = 0.9; m = int(d * SR); t = np.arange(m) / SR
        f = 330 + 30 * np.sin(2 * np.pi * 3.5 * t)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 1.5 * (0.7 + 0.3 * np.sin(2 * np.pi * 14 * t))
    b.scatter(coo, 3, 0.1, spread=0.4)
    # a milk-float bottle rattle, once
    b.add(np.concatenate([tone([2900, 4100], 0.06, 0.02, [1, 0.5], b.r) * b.r.uniform(0.3, 1) for _ in range(9)]), 0.08, 0.7, 40.0)
    write(b.finish(0.5), "the-soho-dawn-ambience.m4a")

if __name__ == "__main__":
    only = sys.argv[2:] if len(sys.argv) > 2 else None
    for fn in (pub_french, pub_pillars, coach_night, quiet_cafe, gents, cellar, cicadas, green_sea, soho_dawn):
        if only and fn.__name__ not in only: continue
        fn()
