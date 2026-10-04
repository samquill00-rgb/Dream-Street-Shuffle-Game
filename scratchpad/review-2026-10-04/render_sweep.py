"""Render every story passage once with a rich state; report tw-error and JS errors. No screenshots.
PYTHONPATH=scratchpad/audit-2026-09-16 DSS_FAST=1 python3 render_sweep.py"""
import re, sys, json
from harness import *
SKIP = {"script","stylesheet","startup","header","system"}
RICH = ('(set: $inisToldOfPillars to true)(set: $returnedPage to true)(set: $metCritic to true)(set: $knowsCecilCourt to true)(set: $knowsLackland to true)(set: $knowsCopperSecret to true)(set: $metDavy to true)(set: $metShana to true)(set: $haunts to (a: $haunt1, $haunt2))(set: $dreamKey to "ticket")(set: $keyTicket to "held")(set: $hasDrawing to true)(set: $bookTitle to "The Test Book")(set: $sobriety to 55)(set: $confidence to 60)(set: $enteredVenue to true)')
g = Game(width=1280, height=900); bad = []; n = 0
for name, tags in TAGS.items():
    if name in ("UserScript","StoryData","StoryTitle","Start") or set(tags) & SKIP: continue
    n += 1
    try:
        p = g.page(name, RICH); Game.click(p, "BEGIN", 700); p.wait_for_timeout(1400)
        tw = p.evaluate("() => [...document.querySelectorAll('tw-error')].map(e=>e.textContent.slice(0,160))")
        js = [e[:160] for e in p._errs if 'audio' not in e.lower()]
        at = Game.name(p)
        if tw or js or at == "?": bad.append((name, at, tw, js))
        p.close()
    except Exception as e:
        bad.append((name, "EXC", str(e)[:120], []))
    if n % 40 == 0: print("…", n, flush=True)
g.close()
print("rendered", n, "passages; problems:", len(bad))
for b in bad: print("  ", b)
