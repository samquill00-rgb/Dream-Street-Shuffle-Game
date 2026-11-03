#!/usr/bin/env python
"""2026-11-03 aesthetics pass: two more procedural beds in the house style of tools_make_beds.py.
  the-chippy-ambience.m4a    The Halibut: an extractor fan, the fryer's hiss and bubble, the till, the door, the tongs.
  the-bookshop-ambience.m4a  Cecil Court shops: a shut room, a mantel clock, pages, floorboards, Charing Cross Road through the glass.
Run with a python that has numpy:  python tools_make_beds_extra.py <outdir> [chippy|bookshop]"""
import sys, os
sys.argv = [sys.argv[0]] + (sys.argv[1:2] or ["."])  # tools_make_beds reads argv[1] as OUT
import numpy as np
import tools_make_beds as T
from tools_make_beds import Bed, SR, shaped, mul, bp, lp, hp, pinkish, brownish, lfo_env, tone, burst, reverb, fan_hum, till, door_thud, traffic, chair_scrape, write

T.TARGET_LUFS["the-chippy-ambience.m4a"] = -33.0     # beside the French pub bed (-30.2) and the Colony (-33.0)
T.TARGET_LUFS["the-bookshop-ambience.m4a"] = -37.5   # beside the quiet cafe (-37.8)

def chippy():
    b = Bed(211); n = b.n; r = b.r; t = np.arange(n) / SR
    fan_hum(b, 0.22, f0=120.0)                                   # the extractor over the range
    # the fryer: bright hiss with a slow bubble under it, swelling now and then as a basket goes in
    hiss = shaped(n, mul(pinkish, bp(900, 7000, 1.2)), r)
    bubble = 0.55 + 0.45 * lfo_env(n, r, periods=(0.9, 2.3, 6.0), depth=0.9)
    basket = 0.7 + 0.3 * lfo_env(n, r, periods=(17.0, 29.0), depth=1.0)
    l = hiss * bubble * basket; rr = shaped(n, mul(pinkish, bp(900, 7000, 1.2)), r) * bubble * basket
    b.add_stereo(l, rr, 0.5)
    # fat spitting: short bright ticks, often
    b.scatter(lambda: burst(r.uniform(0.01, 0.03), hp(2500), r, 0.001, 0.01), 60, 0.10, spread=0.5)
    # the till, twice; the door with its bell-less thud, three times; tongs on the steel, now and then
    b.scatter(lambda: till(r), 2, 0.16, spread=0.4)
    b.scatter(lambda: door_thud(r), 3, 0.18, spread=0.7)
    b.scatter(lambda: tone([3100, 4700, 6200], 0.12, 0.03, [1, 0.5, 0.3], r), 7, 0.08, spread=0.5)
    # a strip-light's 100 Hz buzz, faint
    buzz = np.sin(2 * np.pi * 100 * t) + 0.4 * np.sin(2 * np.pi * 300 * t)
    b.add_stereo(buzz, buzz, 0.03)
    # a tiled room: short, hard reverb
    b.L = reverb(b.L, 0.7, r, 0.2, size=0.8); b.R_ = reverb(b.R_, 0.7, r, 0.2, size=0.8)
    write(b.finish(0.5), "the-chippy-ambience.m4a")

def bookshop():
    b = Bed(223); n = b.n; r = b.r
    # the shut room: a deep hush with the road outside through the glass
    traffic(b, 0.16)
    hush = shaped(n, mul(brownish, lp(180, 1.5)), r)
    b.add_stereo(hush, shaped(n, mul(brownish, lp(180, 1.5)), r), 0.18)
    # a mantel clock, dry, slightly uneven, a little off-centre to the left
    tick = tone([2600, 800], 0.025, 0.007, [0.5, 1], r)
    tock = tone([2100, 650], 0.028, 0.008, [0.5, 1], r)
    for i in range(int(n / SR)):
        b.add(tick if i % 2 == 0 else tock, 0.06 if i % 2 == 0 else 0.05, -0.35, i + 0.2 + r.uniform(-0.01, 0.01))
    # pages turned, a book set down, a floorboard
    b.scatter(lambda: burst(r.uniform(0.12, 0.3), bp(1200, 5000, 1.2), r, 0.02, 0.08), 9, 0.07, spread=0.6)
    b.scatter(lambda: tone([90, 180, 260], 0.18, 0.05, [1, 0.4, 0.2], r), 4, 0.12, spread=0.5)
    b.scatter(lambda: chair_scrape(r) * 0.5, 2, 0.06, spread=0.5)
    # a radiator knocking once or twice
    b.scatter(lambda: np.concatenate([tone([700, 1900], 0.05, 0.02, [1, 0.4], r) * r.uniform(0.4, 1) for _ in range(r.integers(2, 5))]), 2, 0.08, spread=0.6)
    b.L = reverb(b.L, 0.5, r, 0.15, size=0.7); b.R_ = reverb(b.R_, 0.5, r, 0.15, size=0.7)
    write(b.finish(0.5), "the-bookshop-ambience.m4a")

if __name__ == "__main__":
    only = sys.argv[2:] if len(sys.argv) > 2 else None
    for fn in (chippy, bookshop):
        if only and fn.__name__ not in only: continue
        fn()
