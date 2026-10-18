"""How different are the beds? tone, syllabic modulation (intelligibility proxy), density, width."""
import sys, os, glob, numpy as np, engine as E
from scipy.io import wavfile
from scipy.signal import butter, sosfiltfilt, hilbert
ref = E.thirds(E.cut("rec143_BAR", 0.5, 77.7))
rows = {}
for p in sorted(glob.glob("out/*.f32.wav")) + [q for q in ["_raw143.wav"] if os.path.exists(q)]:
    sr, x = wavfile.read(p); x = x.astype(float); m = x.mean(1) if x.ndim == 2 else x
    t = E.thirds(m); d = t - ref; d -= d[6]
    # speech-band envelope modulation 2-8 Hz relative to its mean: high = foreground talk, low = wash
    sp = sosfiltfilt(butter(4, [300, 3000], "band", fs=sr, output="sos"), m); env = np.abs(hilbert(sp))[::480]  # 100 Hz env
    fs2 = 100; F = np.abs(np.fft.rfft(env - env.mean())) ** 2; f = np.fft.rfftfreq(len(env), 1 / fs2)
    mod = 10 * np.log10(F[(f >= 2) & (f <= 8)].sum() / (env.mean() ** 2 * len(env) ** 2) + 1e-20)
    cent = np.sum(np.array(E.CENTRES) * 10 ** (t / 10)) / np.sum(10 ** (t / 10))
    name = p.split("/")[-1].replace(".f32.wav", "")
    print(f"{name:30s} centroid {cent:6.0f} Hz  syllabic mod {mod:6.1f} dB  hi(>4k) vs bar {d[E.CENTRES.index(min(E.CENTRES, key=lambda c: abs(c-5000)))]:+5.1f} dB  lo(125) vs bar {d[1]:+5.1f} dB")
