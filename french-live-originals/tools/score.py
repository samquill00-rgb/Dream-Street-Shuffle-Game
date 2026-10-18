"""Score looped beds without ears. usage: score.py file.f32.wav|file.m4a [...]"""
import sys, os, subprocess, numpy as np
from scipy.io import wavfile
from scipy.signal import stft
SR = 48000
def load(p):
    if not p.endswith(".wav"):
        tmp = "/tmp/_score.wav" if False else os.path.join(os.path.dirname(os.path.abspath(__file__)), "_score.wav")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", p, "-ar", "48000", "-c:a", "pcm_f32le", tmp], check=True); p = tmp
    sr, x = wavfile.read(p); x = x.astype(np.float64)
    return x if x.ndim == 2 else np.stack([x, x], 1)
def bands(m):  # 32 log bands 100 Hz-12 kHz, 50 ms frames
    f, t, Z = stft(m, SR, nperseg=2048, noverlap=2048 - 2400 // 1); P = np.abs(Z) ** 2
    edges = np.geomspace(100, 12000, 33)
    return np.array([P[(f >= a) & (f < b)].sum(0) for a, b in zip(edges[:-1], edges[1:])]) + 1e-14
def score(p):
    x = load(p); L, R = x[:, 0], x[:, 1]; m = 0.5 * (L + R); n = len(m)
    # seam: rotate so the wrap is in the middle, compare 100 ms level steps and spectral flux there vs everywhere
    h = SR // 10; rot = np.roll(m, n // 2); e = 20 * np.log10(np.sqrt(np.add.reduceat(rot ** 2, np.arange(0, n - h + 1, h)) / h) + 1e-12)
    steps = np.abs(np.diff(e)); mid = (n // 2) // h
    seam_step = steps[mid - 2:mid + 2].max(); step_p95 = np.percentile(steps, 95)
    B = np.log(bands(rot)); flux = np.sqrt((np.diff(B, axis=1) ** 2).mean(0)); fm = int((n // 2) / 2400)
    seam_flux = flux[fm - 3:fm + 3].max(); flux_p95 = np.percentile(flux, 95)
    # smoothness: 3 s windows (circular) level spread p90-p10
    e1 = np.sqrt(np.add.reduceat(m ** 2, np.arange(0, n - h + 1, h)) / h)
    w = 30; e3 = 10 * np.log10(np.convolve(np.r_[e1, e1[:w]] ** 2, np.ones(w) / w, "valid")[: len(e1)] + 1e-20)
    spread = np.percentile(e3, 90) - np.percentile(e3, 10)
    # repetition: 2 s windows of band-envelope (detrended), max cosine similarity at circular lag >= 3 s
    Bm = np.log(bands(m)); Bm = Bm - Bm.mean(1, keepdims=True)
    win = 40; hop = 10; idx = np.arange(0, Bm.shape[1] - win, hop)
    V = np.array([Bm[:, i:i + win].ravel() for i in idx]); V -= V.mean(1, keepdims=True); V /= np.linalg.norm(V, axis=1, keepdims=True) + 1e-12
    S = V @ V.T; lagw = np.abs(idx[:, None] - idx[None, :]) * 0.05; lagw = np.minimum(lagw, n / SR - lagw)
    S[lagw < 3.0] = -1; rep = S.max(); rep_p99 = np.percentile(S[S > -1], 99.9)
    # clicks: >8 kHz residual spikes vs local rms
    d = np.diff(m); loc = np.sqrt(np.convolve(d ** 2, np.ones(480) / 480, "same")) + 1e-9
    clicks = int(np.sum(np.abs(d) > 10 * loc))
    corr = np.corrcoef(L, R)[0, 1]; mono_loss = 10 * np.log10(np.mean(m ** 2) / (0.5 * (np.mean(L ** 2) + np.mean(R ** 2))))
    print(f"{os.path.basename(p):40s} {n/SR:6.1f}s  seam step {seam_step:4.1f}dB (p95 {step_p95:3.1f})  seam flux {seam_flux:.2f} (p95 {flux_p95:.2f})  "
          f"3s spread {spread:4.1f}dB  repeat max {rep:.2f} (p99.9 {rep_p99:.2f})  clicks {clicks}  L/R corr {corr:+.2f}  mono {mono_loss:+.1f}dB")
for p in sys.argv[1:]: score(p)
