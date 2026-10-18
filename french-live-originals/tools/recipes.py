import sys, os, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import engine as E
from scipy.signal import resample_poly
OUT = os.path.join(E.HERE, "out")
SR = E.SR
REF = E.thirds(E.cut("rec143_BAR", 0.5, 77.7))

def speed(x, up, down):  # resample = tape-speed change: pitch and tempo move together
    return resample_poly(x, down, up)

def bar_pieces():
    A = E.cut("rec143_BAR", 0.5, 40.0); C = E.cut("rec143_BAR", 40.0, 77.7)
    B = E.tone_match(E.cut("rec145_BAR", 102.5, 119.8), REF); D = E.tone_match(E.cut("rec144_BAR", 80.3, 89.8), REF)
    return A, B, C, D

def bar_events(thresh=15.0, pre=0.06, post=0.5):
    x = E.cut("rec143_BAR", 0.5, 77.7); ev = E.event_times(x, thresh)
    return [x[int((t - pre) * SR):int((t + post) * SR)] for t in ev if t > pre and t + post < len(x) / SR]

def place_spread(rng, count, n, min_gap):
    pos = []
    while len(pos) < count:
        p = int(rng.integers(0, n))
        if all(min(abs(p - q), n - abs(p - q)) >= min_gap * SR for q in pos): pos.append(p)
    return pos

# ------------------------------------------------------------------ the French's own three
def french_bar():
    print("french bar"); A, B, C, D = bar_pieces()
    r = E.Ring(92.0)
    k = E.body(r, [A, B, C, D], xf=3.0, pans=[-0.12, 0.12, -0.08, 0.1]); print("  body pieces", k)
    pool = [A, B, C, D]
    E.grains(r, pool, density=6, glen=(0.6, 1.6), gain=0.32, rng=np.random.default_rng(11), side="L")
    E.grains(r, pool, density=6, glen=(0.6, 1.6), gain=0.32, rng=np.random.default_rng(12), side="R")
    E.rider(r, win=4.0, maxdb=3.0, strength=0.6)
    E.reverb(r, rt60=0.45, wet=0.06, lp=5000)
    return r, "the-french-pub-layered", -30.2

def gents():
    print("gents"); x = E.cut("rec145_GENTS", 20.0, 67.0); ev = E.event_times(x, 12.0)
    quiet = E.quiet_stretches(x, ev, pad=0.3, minlen=1.6); print(f"  {len(ev)} events, {len(quiet)} quiet stretches, {sum(map(len, quiet))/SR:.1f}s")
    room = np.sqrt(np.mean(x ** 2)); r = E.Ring(64.0); rng = np.random.default_rng(21)
    Lp = quiet + [speed(q, 50, 51) for q in quiet[::-1]]           # second pass ~2% slower
    Rp = [speed(q, 51, 50) for q in quiet] + [speed(q, 49, 51) for q in quiet[::-1]]
    E.body(r, Lp, xf=0.6, side="L"); E.body(r, list(np.array(Rp, dtype=object)[rng.permutation(len(Rp))]), xf=0.6, start=r.n // 2, side="R")
    snips = [x[int(max(0, t - 0.08) * SR):int((t + 0.7) * SR)] for t in ev]
    keep = [s_ for s_ in snips if 20 * np.log10(np.abs(s_).max() / room) < 18]; print(f"  events kept {len(keep)} of {len(snips)} (door hits dropped)"); snips = keep
    E.events(r, snips, place_spread(rng, len(snips), r.n, 2.5), gain=0.9, pans=list(rng.uniform(-0.5, 0.5, len(snips))))
    E.grains(r, quiet, density=4, glen=(0.8, 2.0), gain=0.25, rng=np.random.default_rng(22), pan_spread=1.0)
    E.rider(r, win=5.0, maxdb=2.0, strength=0.5)
    return r, "the-gents-french-layered", -33.3

def outside():
    print("outside"); x = E.cut("rec144_OUTS", 4.0, 79.0); ev = E.event_times(x, 12.0)
    quiet = E.quiet_stretches(x, ev, pad=0.4, minlen=3.0); print(f"  {len(ev)} events, {len(quiet)} quiet stretches, {sum(map(len, quiet))/SR:.1f}s")
    r = E.Ring(80.0); rng = np.random.default_rng(31)
    # cut the quiet stretches into ~8 s pieces so each side can be a different shuffle, R a touch slower
    chunks = [q[i:i + 8 * SR] for q in quiet for i in range(0, len(q) - 5 * SR, 8 * SR)]
    E.body(r, [chunks[i] for i in rng.permutation(len(chunks))], xf=2.0, side="L")
    E.body(r, [speed(chunks[i], 50, 51) for i in rng.permutation(len(chunks))], xf=2.0, start=r.n // 3, side="R")
    snips = [x[int(max(0, t - 0.08) * SR):int((t + 0.8) * SR)] for t in ev]
    E.events(r, snips, place_spread(rng, len(snips), r.n, 4.0), gain=0.9, pans=list(rng.uniform(-0.6, 0.6, len(snips))))
    E.grains(r, quiet, density=4, glen=(1.0, 2.5), gain=0.25, rng=np.random.default_rng(32), pan_spread=1.0)
    E.rider(r, win=6.0, maxdb=2.5, strength=0.5)
    return r, "the-french-outside-layered", -31.0

# ------------------------------------------------------------------ three indoor soundscapes from the same material
def busy_bar():
    print("busy bar (Coach)"); A, B, C, D = bar_pieces(); r = E.Ring(92.0)
    E.body(r, [A, B, C, D], xf=3.0, pans=[-0.35, -0.25], gain=1.0)
    up = [speed(p, 33, 32) for p in (C, D, A, B)]          # ~3% faster/higher: other voices
    E.body(r, up, xf=3.0, start=r.n // 3, pans=[0.35, 0.25], gain=0.75)
    dn = [E.lowpass(speed(p, 32, 34), 3500) for p in (B, A, D, C)]  # ~6% slower/lower, further back
    E.body(r, dn, xf=3.0, start=2 * r.n // 3, gain=0.6)
    snips = bar_events(15.0); rng = np.random.default_rng(41); cnt = min(36, 3 * len(snips))
    pick = [snips[i % len(snips)] for i in rng.permutation(cnt)]
    pick = [speed(s, *(33, 32) if j % 3 == 1 else (32, 33) if j % 3 == 2 else (1, 1)) for j, s in enumerate(pick)]
    E.events(r, pick, place_spread(rng, len(pick), r.n, 1.5), gain=0.55, pans=list(rng.uniform(-0.8, 0.8, len(pick))))
    E.grains(r, [A, B, C, D], density=8, glen=(0.5, 1.2), gain=0.35, rng=np.random.default_rng(42), pan_spread=1.0)
    E.reverb(r, rt60=0.9, wet=0.16, lp=4500)
    E.rider(r, win=4.0, maxdb=3.0, strength=0.6)
    return r, "indoor-busy-bar", -40.0

def warm_pub():
    print("warm pub (Pillars)"); A, B, C, D = bar_pieces(); r = E.Ring(92.0)
    E.body(r, [speed(p, 32, 33) for p in (A, B, C, D)], xf=3.5, pans=[-0.2, 0.15, -0.1, 0.2], gain=1.0)  # ~3% lower
    E.body(r, [E.lowpass(speed(p, 51, 50), 2500) for p in (D, C, B, A)], xf=3.5, start=r.n // 2, pans=[0.3, -0.3], gain=0.45)  # ~2% faster: other voices
    E.grains(r, [A, B, C, D], density=4, glen=(0.7, 1.8), gain=0.28, rng=np.random.default_rng(51), pan_spread=1.0)
    E.ring_filter(r, E.eq_shelf, 3000, -5.0, "high"); E.ring_filter(r, E.eq_bell, 250, 2.0, 1.5)
    E.reverb(r, rt60=0.6, wet=0.2, lp=3000)
    E.rider(r, win=5.0, maxdb=3.0, strength=0.6)
    return r, "indoor-warm-pub", -29.4

def quiet_lounge():
    print("quiet lounge (Trisha's)"); A, B, C, D = bar_pieces(); r = E.Ring(90.0)
    pool = [B, D, A, C]
    for side, sd in (("L", 61), ("R", 62)):  # murmur from short grains: voices without words
        E.grains(r, pool, density=5, glen=(0.25, 0.7), gain=0.6, rng=np.random.default_rng(sd), side=side)
    E.body(r, [E.lowpass(speed(p, 32, 34), 1500) for p in (B, D)], xf=2.5, gain=0.45)  # the next room, through a wall
    snips = [E.lowpass(s, 5000) for s in bar_events(16.0)]; rng = np.random.default_rng(63)
    pick = [snips[i] for i in rng.permutation(len(snips))[:8]]
    E.events(r, pick, place_spread(rng, len(pick), r.n, 6.0), gain=0.35, pans=list(rng.uniform(-0.7, 0.7, len(pick))))
    E.ring_filter(r, E.lowpass, 5000, 2); E.ring_filter(r, E.eq_bell, 300, 1.5, 1.5)
    E.reverb(r, rt60=0.65, wet=0.26, lp=3500)
    E.rider(r, win=5.0, maxdb=4.0, strength=0.8)
    return r, "indoor-quiet-lounge", -36.5

def colony_room():
    """A small, packed, bright room: the crowd close, laughter and glasses often, a short lively reverb.
    Trisha's keeps the quiet lounge; this is the Colony."""
    print("colony room"); A, B, C, D = bar_pieces(); r = E.Ring(88.0); rng = np.random.default_rng(71)
    E.body(r, [A, C, B, D], xf=2.5, pans=[-0.3, 0.3, -0.2, 0.25], gain=1.0)                 # the crowd, close
    E.body(r, [speed(p, 50, 49) for p in (C, A, D, B)], xf=2.5, start=r.n // 2, pans=[0.35, -0.35], gain=0.55)  # ~2% higher, the other side of the room
    snips = bar_events(13.0); loud = sorted(snips, key=lambda x: -np.abs(x).max())[: max(8, len(snips) // 2)]   # the laughs and the louder glasses
    pick = [loud[i % len(loud)] for i in rng.permutation(min(28, 2 * len(loud)))]
    pick = [speed(x, 50, 49) if j % 2 else x for j, x in enumerate(pick)]
    E.events(r, pick, place_spread(rng, len(pick), r.n, 1.8), gain=0.7, pans=list(rng.uniform(-0.8, 0.8, len(pick))))
    E.grains(r, [A, B, C, D], density=5, glen=(0.3, 0.9), gain=0.3, rng=np.random.default_rng(72), pan_spread=1.0)
    E.ring_filter(r, E.eq_shelf, 2500, 2.0, "high"); E.ring_filter(r, E.eq_bell, 180, -2.0, 1.2)  # bright, not boomy
    E.reverb(r, rt60=0.35, wet=0.14, lp=6500)
    E.rider(r, win=4.0, maxdb=3.0, strength=0.6)
    return r, "indoor-colony-room", -33.0

def street():
    """The street outside any venue: the outside-the-French material (quiet stretches shuffled, passing sounds once a lap);
    with --floor the September late-night-street bed sits on top per Sam's rule for background rooms."""
    r, name, target = outside()
    return r, "the-street-layered", -36.0


# the September generated bed that each real bed replaced, as an optional floor under it
FLOORS = {"the-street-layered": "the-coach-night-ambience.m4a", "the-french-pub-layered": "the-french-pub-ambience.mp3", "the-gents-french-layered": "the-gents-coach-toilet.mp3",
          "indoor-busy-bar": "the-coach-night-ambience.m4a", "indoor-warm-pub": "the-pillars-pub-ambience.m4a",
          "indoor-quiet-lounge": "the-trishas-ambience.m4a", "indoor-colony-room": "the-colony-ambience.m4a"}
FLOOR_DB = 3.0    # the generated bed 3 dB over the real material (2026-10-18, Sam: real quieter twice; 0 and -3 before, -8 inaudible)
GAME = os.path.normpath(os.path.join(E.HERE, "..", ".."))

if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]; want_floor = "--floor" in sys.argv
    which = args or ["french_bar", "gents", "outside", "busy_bar", "warm_pub", "quiet_lounge", "colony_room"]
    for w in which:
        r, name, target = globals()[w]()
        E.write(r, name, target, OUT)
        if want_floor and name in FLOORS:
            E.file_layer(r, os.path.join(GAME, FLOORS[name]), FLOOR_DB)
            E.write(r, name + "-floor", target, OUT)
