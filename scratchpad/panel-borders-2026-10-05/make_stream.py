"""A stream of water on concrete, synthesised from noise (no samples): 8 s body that loops, then a 2.5 s tail.
Usage: python3 make_stream.py OUT.wav [seed]"""
import sys, wave, numpy as np
SR = 44100
seed = int(sys.argv[2]) if len(sys.argv) > 2 else 7
r = np.random.default_rng(seed)
BODY, TAIL, LEAD = 8.0, 3.0, 0.5   # (Sam: fade in a little at the start, out a little at the end) the file is LEAD (fade-in) + BODY (loops) + TAIL
N = int(SR * (BODY + TAIL)); nb = int(SR * BODY)
t = np.arange(N) / SR

def smooth_noise(n, cutoff_hz, rng):
    """lowpassed white noise, unit variance-ish: a wandering envelope"""
    w = rng.standard_normal(n); F = np.fft.rfft(w); f = np.fft.rfftfreq(n, 1/SR)
    F *= 1 / (1 + (f / cutoff_hz) ** 4); x = np.fft.irfft(F, n); return x / (x.std() + 1e-9)

def shaped_noise(n, curve, rng):
    w = rng.standard_normal(n); F = np.fft.rfft(w); f = np.fft.rfftfreq(n, 1/SR)
    F *= curve(f); x = np.fft.irfft(F, n); return x / (np.abs(x).max() + 1e-9)

# 1. the spatter: the stream breaks into droplets before it lands; each a 1 to 3 ms wide-band pat (no ring)
spat = np.zeros(N)
rate = 320.0                     # pats per second in the body
pos = 0.0
while pos < BODY + TAIL:
    i = int(pos * SR)
    dur = 0.001 + r.random() * 0.002
    n = int(dur * SR)
    burst = r.standard_normal(n) * np.exp(-np.arange(n) / (n * 0.35))
    # a wide band per pat, 1.2 to 7 kHz, one pole each side
    F = np.fft.rfft(burst); f = np.fft.rfftfreq(n, 1/SR); fc = 1200 * (2 ** (r.random() * 2.5))
    F *= np.exp(-((np.log(f + 1) - np.log(fc)) ** 2) / 0.8); burst = np.fft.irfft(F, n)
    amp = r.random() ** 1.6
    spat[i:i + n] += burst / (np.abs(burst).max() + 1e-9) * amp
    # in the tail the pats thin out
    local_rate = rate if pos < BODY else rate * max(0.02, 1 - (pos - BODY) / 1.2) ** 2
    pos += r.exponential(1 / max(local_rate, 2.0))

# 2. the sheet: the broadband splash of the stream on the hard ground, pink-ish, 600 Hz to 8 kHz
sheet = shaped_noise(N, lambda f: np.where(f < 50, 0, (1 / (1 + (600 / (f + 1)) ** 2)) * (1 / (1 + (f / 4500) ** 2)) * (1 / np.sqrt(f / 600 + 1))), r)

# 3. the turbulence: how a stream pulses. slow wander x pulse (9 to 15 Hz, smooth) x fast sputter
wander = 1 + 0.08 * smooth_noise(N, 0.4, r)   # (Sam: less fluctuating) a faint swell only
pulse_f = 9 + 6 * (smooth_noise(N, 0.2, r) * 0.5 + 0.5)
pulse = 1 + 0.1 * np.sin(2 * np.pi * np.cumsum(pulse_f) / SR)
sputter = np.clip(1 + 0.3 * smooth_noise(N, 35, r), 0.1, None)
turb = np.clip(wander * pulse * sputter, 0, None)

# 4. the ground: concrete gives the splash a hard slap, a very short early reflection, and a dry resonance near 3 kHz
def comb(x, delay_s, fb):
    d = int(delay_s * SR); y = x.copy()
    for k in range(d, len(x)): y[k] += fb * y[k - d]
    return y
mix = (0.55 * spat + 0.45 * sheet) * turb
# comb in numpy without the python loop: a short FIR slapback instead
d = int(0.0014 * SR); slap = np.zeros(N); slap[d:] = mix[:-d]; mix = mix + 0.35 * slap
F = np.fft.rfft(mix); f = np.fft.rfftfreq(N, 1/SR)
F *= 1 + 0.9 * np.exp(-((f - 3000) / 900) ** 2)     # the dry concrete ring
F *= 1 / (1 + (f / 9000) ** 4)                       # nothing glassy up top
F *= 1 / (1 + (250 / (f + 1)) ** 4)                  # no rumble
mix = np.fft.irfft(F, N)

# 4b. (Sam: "a little bit more white noise to disrupt the rhythm") a plain hiss of spray that does not
# follow the pulse, only the slow wander, so the pulse is heard through it rather than as a beat
spray = shaped_noise(N, lambda f: np.where(f < 400, 0, 1 / (1 + (f / 7000) ** 2)), r) * wander * np.clip(1 + 0.25 * smooth_noise(N, 20, r), 0.2, None)

# 5. the stream itself: a low pour under it, the weight of the water
pour = shaped_noise(N, lambda f: np.where(f < 40, 0, 1 / (1 + (f / 350) ** 2)), r) * turb * 0.5

# 6. envelope: a stutter as it starts, steady body, then the stream fails and dribbles
env = np.ones(N)
tt = t[nb:] - BODY
env[nb:] = np.clip(1 - tt / 2.2, 0, None) ** 1.3
# the pats after the stream fails stay audible on their own as drips
out = (mix + 0.6 * pour + 0.3 * spray) * env + spat[:] * np.where(t > BODY + 1.2, 0.4, 0) * np.clip(1 - (t - BODY) / TAIL, 0, 1) ** 1.5
out /= np.abs(out).max() + 1e-9; out *= 0.7
# the loop seam: cross-fade the body's last 60 ms into its first 60 ms
xf = int(0.06 * SR); w = np.linspace(0, 1, xf)
body = out[:nb].copy(); body[-xf:] = body[-xf:] * (1 - w) + out[:xf] * w
out[:nb] = body
# the lead-in: the body's last half second (which runs seamlessly into its start) under a fade-in
nl = int(LEAD * SR); lead = body[-nl:] * (np.linspace(0, 1, nl) ** 1.5)
out = np.concatenate([lead, out]); N = len(out); t = np.arange(N) / SR
with wave.open(sys.argv[1], "wb") as wv:
    wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR)
    wv.writeframes((np.clip(out, -1, 1) * 32767).astype("<i2").tobytes())
seg = out[int(1.5*SR):int(7.5*SR)]
spec = np.abs(np.fft.rfft(seg * np.hanning(len(seg)))) ** 2; f = np.fft.rfftfreq(len(seg), 1/SR)
print("centroid %.0f Hz" % ((f*spec).sum()/spec.sum()))
for lo, hi in [(0,300),(300,1000),(1000,3000),(3000,6000),(6000,22050)]:
    m=(f>=lo)&(f<hi); print("  %5d-%5d  %4.1f%%" % (lo,hi,100*spec[m].sum()/spec.sum()))
e = np.sqrt(np.convolve(seg**2, np.ones(441)/441, 'valid'))[::441]; print("sputter %.2f" % (e.std()/e.mean()))
