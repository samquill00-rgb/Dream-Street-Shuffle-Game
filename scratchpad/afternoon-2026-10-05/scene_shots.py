"""Shots of the fires, Centre Point, the Fetch and the dawns after a wait. Args: OUT PRE W H [keys]"""
import sys, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
OUT, PRE, W, H = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]); os.makedirs(OUT, exist_ok=True)
CASES = {"hut-fire": ("Soho Hut Burns", "(set: $hasMatches to true)", 9000), "coach-fire": ("The Coach Burns", "(set: $hasMatches to true)", 9000),
 "centre-point": ("Approach Centre Point", "(set: $alba to (a: $alba1, $alba2, $alba3))", 9000), "fetch": ("The Fetch", "", 9000),
 "dawn": ("Dawn", "(set: $alba to (a: $alba1, $alba2, $alba3))", 9000), "alt-dawn": ("Alt-Dawn", "", 6000), "alba-complete": ("Alba Complete", "(set: $alba to (a: $alba1, $alba2, $alba3))", 5000),
 "towards-dawn": ("Towards Dawn", "", 5000), "phone-box-rings": ("The Phone Box Rings", "", 4000), "blackout": ("The Blackout", "(set: $sobriety to 5)", 5000), "coach-fire-ending": ("Coach Fire Ending", "", 5000)}
keys = sys.argv[5:] or list(CASES)
g = Game(width=W, height=H)
for key in keys:
    pas, seeds, wait = CASES[key]
    p = g.page(pas, seeds, audit_header=False); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p); p.wait_for_timeout(wait); Game.clear_overlays(p)
    info = p.evaluate("() => { const tp=document.querySelector('tw-passage'); return {tags: tp&&tp.getAttribute('tags'), canvases: document.querySelectorAll('canvas').length, docW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight, links: [...document.querySelectorAll('tw-link, button')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim().slice(0,30)).slice(0,8)}; }")
    print(PRE, key, info, "errs", [e[:90] for e in p._errs if 'audio' not in e.lower()][:2], flush=True)
    try: p.screenshot(path=os.path.join(OUT, "%s-%s-%sx%s.png" % (PRE, key, W, H)))
    except Exception as e: print("shot", e)
    p.close()
g.close()
