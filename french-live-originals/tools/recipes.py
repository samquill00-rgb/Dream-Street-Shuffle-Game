import sys, os, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import engine as E
import hits as H
import glass as G
from fractions import Fraction
from scipy.signal import resample_poly
OUT = os.path.join(E.HERE, "out")
SR = E.SR
REF = E.thirds(E.cut("rec143_BAR", 0.5, 77.7))

def speed(x, up, down):  # resample = tape-speed change: pitch and tempo move together
    return resample_poly(x, down, up)

# how followable the talk is, per venue: 0 = as recorded, 1 = voices with no words (E.blur_speech)
# 2026-10-23, Sam: speech far too clear in all the venues; can be vaguely clear in the French
SPEECH_BLUR = {"french_bar": 0.35, "busy_bar": 0.85, "warm_pub": 0.85, "quiet_lounge": 0.9, "colony_room": 0.8}

def bar_pieces(blur=0.0):
    A = E.cut("rec143_BAR", 0.5, 40.0); C = E.cut("rec143_BAR", 40.0, 77.7)
    B = E.tone_match(E.cut("rec145_BAR", 102.5, 119.8), REF); D = E.tone_match(E.cut("rec144_BAR", 80.3, 89.8), REF)
    return tuple(E.blur_speech(p, blur, seed=j) for j, p in enumerate((A, B, C, D)))

def place_spread(rng, count, n, min_gap):
    pos = []; tries = 0
    while len(pos) < count:
        tries += 1; assert tries < 200000, f"can't fit {count} hits {min_gap}s apart in {n / SR:.0f}s: lower count or gap"
        p = int(rng.integers(0, n))
        if all(min(abs(p - q), n - abs(p - q)) >= min_gap * SR for q in pos): pos.append(p)
    return pos

# ------------------------------------------------------------------ glasses and laughs, dialled per venue
# Glasses come from three sources, mixed per venue by `mix` (relative weights; a source with nothing in it drops out):
#   live     Sam's glass recordings, the pieces he ticked for this venue (glass.py, ../../glass-originals/glass.html)
#   bar      glasses cut from the French bar recordings (hits.py, ../hits.html)
#   digital  the generated clink from the September beds
# Every glass is levelled to the same peak before the dials, so gain means the same thing whatever the source.
#   count   glasses per lap of the loop        gap     least seconds between them (between rounds)
#   burst   chance a glass brings 1-2 more 0.1-0.35 s behind it, a round set down
#   pitch   (low %, high %) each gets a random tape-speed shift in this range: + is smaller, brighter glass
#   gain    level, and jit how far one may fall below it (0 = all the same, 0.6 = some much softer)
#   spread  stereo width 0-1      lp   lowpass Hz to push them back (None = as recorded)
#   room    (rt60 s, wet 0-1) extra reverb on the glasses only, on top of the venue's own (None = none)
GLASS = {   # first moods, 2026-10-23: Coach busy rounds, Pillars fewer/heavier/lower, Trisha's sparse/distant, Colony bright/close
    "busy_bar":     dict(mix=dict(live=1.0, bar=0.6, digital=0.3), count=24, gap=1.2, burst=0.35, pitch=(-3, 3),
                         gain=0.5, jit=0.4, spread=0.8, lp=7000, room=(0.8, 0.2)),
    "warm_pub":     dict(mix=dict(live=1.0, bar=0.4, digital=0.0), count=10, gap=3.5, burst=0.15, pitch=(-8, -3),
                         gain=0.4, jit=0.3, spread=0.6, lp=4500, room=(0.7, 0.3)),
    "quiet_lounge": dict(mix=dict(live=1.0, bar=0.5, digital=0.0), count=6, gap=8.0, burst=0.0, pitch=(-2, 2),
                         gain=0.3, jit=0.3, spread=0.7, lp=3500, room=(0.9, 0.4)),
    "colony_room":  dict(mix=dict(live=1.0, bar=0.5, digital=0.3), count=20, gap=1.5, burst=0.25, pitch=(1, 4),
                         gain=0.6, jit=0.4, spread=0.8, lp=None, room=(0.35, 0.15)),
}
LAUGH = {   # laughs cut from the French bar recordings; same dials, no mix
    "busy_bar":     dict(count=14, gap=1.5, pitch=(-3, 3), gain=0.55, jit=0.3, spread=0.8, lp=None),
    "warm_pub":     dict(count=0,  gap=4.0, pitch=(-3, 0), gain=0.4,  jit=0.3, spread=0.7, lp=None),
    "quiet_lounge": dict(count=3,  gap=6.0, pitch=(0, 0),  gain=0.35, jit=0.3, spread=0.7, lp=5000),
    "colony_room":  dict(count=12, gap=1.8, pitch=(0, 2),  gain=0.7,  jit=0.3, spread=0.8, lp=None),
}

def shift(x, pct):  # tape-speed shift by pct percent (pitch and length together)
    fr = Fraction(1 + pct / 100).limit_denominator(200)
    return x if fr == 1 else speed(x, fr.numerator, fr.denominator)

def digital_clink(rng):
    """The September beds' clink (tools_make_beds.clink) at 48 kHz, with the same quiet lead-in as the cut hits."""
    base = rng.uniform(2100, 3300); n = int(rng.uniform(0.18, 0.4) * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for i, (m, a) in enumerate(zip((1, 1.93, 2.71), (1, 0.5, 0.25))):
        y += a * np.sin(2 * np.pi * base * m * (1 + rng.uniform(-0.01, 0.01)) * t + rng.uniform(0, 6.28)) * np.exp(-t / (0.09 * (0.6 + 0.4 / (i + 1))))
    y[:8] *= np.linspace(0, 1, 8)
    return np.r_[np.zeros(int(H.PRE * SR)), y / np.abs(y).max()]

def glass_sources(venue, rng):
    """{source: (weight, draw())} for the venue's mix, each draw levelled to the bar glasses' median peak."""
    bar = H.pool("glass"); ref = np.median([np.abs(x).max() for x in bar]) if bar else 0.1
    lvl = lambda x: x * ref / max(1e-9, np.abs(x).max())
    live = G.pool(venue); src = {}
    if live: src["live"] = lambda: lvl(live[int(rng.integers(len(live)))])
    if bar: src["bar"] = lambda: bar[int(rng.integers(len(bar)))]
    src["digital"] = lambda: lvl(digital_clink(rng))
    return {k: (GLASS[venue]["mix"].get(k, 0), f) for k, f in src.items() if GLASS[venue]["mix"].get(k, 0) > 0}

def scatter_hits(r, d, draw, rng):
    """Lay d["count"] hits from draw() round the ring, each with its own pitch, level and pan."""
    if not d["count"] or draw is None: return
    tmp = E.Ring(r.n / SR); tmp.n = r.n; tmp.L = np.zeros(r.n); tmp.R = np.zeros(r.n)
    heads = place_spread(rng, d["count"], r.n, d["gap"]); snips, pos = [], []
    for p in heads:
        for k in range(1 + (rng.integers(1, 3) if rng.random() < d.get("burst", 0) else 0)):
            x = shift(draw(), rng.uniform(*d["pitch"]))
            if d["lp"]: x = E.lowpass(x, d["lp"])
            snips.append(x * rng.uniform(1 - d["jit"], 1)); pos.append(p + int(k * rng.uniform(0.1, 0.35) * SR) * (k > 0))
    E.events(tmp, snips, pos, gain=d["gain"], pans=list(rng.uniform(-d["spread"], d["spread"], len(snips))))
    if d.get("room"): E.reverb(tmp, d["room"][0], d["room"][1], seed=7)
    r.L += tmp.L; r.R += tmp.R

def venue_hits(r, venue, seed):
    rng = np.random.default_rng(seed); src = glass_sources(venue, rng)
    if src:
        keys = list(src); w = np.array([src[k][0] for k in keys]); w = w / w.sum()
        print(f"  glasses: {', '.join(f'{k} {wi:.0%}' for k, wi in zip(keys, w))}" + ("" if "live" in src else "  (no live pieces ticked yet)"))
        scatter_hits(r, GLASS[venue], lambda: src[keys[rng.choice(len(keys), p=w)]][1](), rng)
    laughs = H.pool("laugh")
    scatter_hits(r, LAUGH[venue], (lambda: laughs[int(rng.integers(len(laughs)))]) if laughs else None, rng)

# ------------------------------------------------------------------ the French's own three
def french_bar():
    print("french bar"); A, B, C, D = bar_pieces(SPEECH_BLUR["french_bar"])
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
    print("busy bar (Coach)"); A, B, C, D = bar_pieces(SPEECH_BLUR["busy_bar"]); r = E.Ring(92.0)
    E.body(r, [A, B, C, D], xf=3.0, pans=[-0.35, -0.25], gain=1.0)
    up = [speed(p, 33, 32) for p in (C, D, A, B)]          # ~3% faster/higher: other voices
    E.body(r, up, xf=3.0, start=r.n // 3, pans=[0.35, 0.25], gain=0.75)
    dn = [E.lowpass(speed(p, 32, 34), 3500) for p in (B, A, D, C)]  # ~6% slower/lower, further back
    E.body(r, dn, xf=3.0, start=2 * r.n // 3, gain=0.6)
    venue_hits(r, "busy_bar", 41)
    E.grains(r, [A, B, C, D], density=8, glen=(0.5, 1.2), gain=0.35, rng=np.random.default_rng(42), pan_spread=1.0)
    E.reverb(r, rt60=0.9, wet=0.16, lp=4500)
    E.rider(r, win=4.0, maxdb=3.0, strength=0.6)
    return r, "indoor-busy-bar", -40.0

def warm_pub():
    print("warm pub (Pillars)"); A, B, C, D = bar_pieces(SPEECH_BLUR["warm_pub"]); r = E.Ring(92.0)
    E.body(r, [speed(p, 32, 33) for p in (A, B, C, D)], xf=3.5, pans=[-0.2, 0.15, -0.1, 0.2], gain=1.0)  # ~3% lower
    E.body(r, [E.lowpass(speed(p, 51, 50), 2500) for p in (D, C, B, A)], xf=3.5, start=r.n // 2, pans=[0.3, -0.3], gain=0.45)  # ~2% faster: other voices
    venue_hits(r, "warm_pub", 52)
    E.grains(r, [A, B, C, D], density=4, glen=(0.7, 1.8), gain=0.28, rng=np.random.default_rng(51), pan_spread=1.0)
    E.ring_filter(r, E.eq_shelf, 3000, -5.0, "high"); E.ring_filter(r, E.eq_bell, 250, 2.0, 1.5)
    E.reverb(r, rt60=0.6, wet=0.2, lp=3000)
    E.rider(r, win=5.0, maxdb=3.0, strength=0.6)
    return r, "indoor-warm-pub", -29.4

def quiet_lounge():
    print("quiet lounge (Trisha's)"); A, B, C, D = bar_pieces(SPEECH_BLUR["quiet_lounge"]); r = E.Ring(90.0)
    pool = [B, D, A, C]
    for side, sd in (("L", 61), ("R", 62)):  # murmur from short grains: voices without words
        E.grains(r, pool, density=5, glen=(0.25, 0.7), gain=0.6, rng=np.random.default_rng(sd), side=side)
    E.body(r, [E.lowpass(speed(p, 32, 34), 1500) for p in (B, D)], xf=2.5, gain=0.45)  # the next room, through a wall
    venue_hits(r, "quiet_lounge", 63)
    E.ring_filter(r, E.lowpass, 5000, 2); E.ring_filter(r, E.eq_bell, 300, 1.5, 1.5)
    E.reverb(r, rt60=0.65, wet=0.26, lp=3500)
    E.rider(r, win=5.0, maxdb=4.0, strength=0.8)
    return r, "indoor-quiet-lounge", -36.5

def colony_room():
    """A small, packed, bright room: the crowd close, laughter and glasses often, a short lively reverb.
    Trisha's keeps the quiet lounge; this is the Colony."""
    print("colony room"); A, B, C, D = bar_pieces(SPEECH_BLUR["colony_room"]); r = E.Ring(88.0)
    E.body(r, [A, C, B, D], xf=2.5, pans=[-0.3, 0.3, -0.2, 0.25], gain=1.0)                 # the crowd, close
    E.body(r, [speed(p, 50, 49) for p in (C, A, D, B)], xf=2.5, start=r.n // 2, pans=[0.35, -0.35], gain=0.55)  # ~2% higher, the other side of the room
    venue_hits(r, "colony_room", 71)
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
