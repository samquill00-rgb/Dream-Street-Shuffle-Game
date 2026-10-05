"""Render the game's own startPissStream through an OfflineAudioContext in headless Chromium and save a WAV plus spectral stats."""
import sys, os, json, wave, struct
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
import numpy as np
from harness import Game
out = sys.argv[1]
g = Game()
p = g.b.new_page()
p.add_init_script("""
window.__AC = window.AudioContext;
window.AudioContext = function(){ const o = new OfflineAudioContext(1, 44100*5, 44100); window.__off = o; return o; };
window.webkitAudioContext = window.AudioContext;
""")
p.goto("http://localhost:8777/Dream%20Street%20Shuffle.html", wait_until="domcontentloaded")
p.wait_for_timeout(1500)
data = p.evaluate("""async () => {
  const c = window.dssAudio.startPissStream();
  const ac = window.__off;
  if (!ac) return null;
  ac.suspend(3.0).then(() => { c.stop(); ac.resume(); });
  const buf = await ac.startRendering();
  return Array.from(buf.getChannelData(0));
}""")
g.close()
x = np.array(data, dtype=np.float32)
print("samples", len(x), "peak", float(np.abs(x).max()), "rms", float(np.sqrt((x**2).mean())))
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(44100)
    w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())
# spectrum of the steady part (0.8 s to 2.8 s)
seg = x[int(0.8*44100):int(2.8*44100)]
spec = np.abs(np.fft.rfft(seg * np.hanning(len(seg))))**2
f = np.fft.rfftfreq(len(seg), 1/44100)
cent = float((f*spec).sum()/spec.sum())
cum = np.cumsum(spec)/spec.sum()
print("centroid Hz %.0f   10%%..90%% energy band %.0f..%.0f Hz" % (cent, f[np.searchsorted(cum,0.1)], f[np.searchsorted(cum,0.9)]))
for lo,hi in [(0,200),(200,600),(600,1200),(1200,2500),(2500,6000),(6000,22050)]:
    m=(f>=lo)&(f<hi); print("  %5d-%5d Hz  %5.1f%%" % (lo,hi,100*spec[m].sum()/spec.sum()))
# amplitude modulation: envelope std / mean in 10 ms windows
env = np.sqrt(np.convolve(seg**2, np.ones(441)/441, 'valid'))[::441]
print("sputter (envelope variation) %.2f" % float(env.std()/env.mean()))
