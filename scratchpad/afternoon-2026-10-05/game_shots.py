"""Shots of the minigame pages and the older games. Args: OUT PRE W H [keys]"""
import sys, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
OUT, PRE, W, H = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]); os.makedirs(OUT, exist_ok=True)
CASES = {"nazca-race": ("Nazca Race", ""), "pyramid-run": ("Pyramid Run", ""), "climb": ("The Climb", ""), "reclamation": ("The Reclamation", ""),
 "beer-mats": ("Trisha's Beer Mats", ""), "fight": ("Fight starts", ""), "waltz": ("Cecil Court Waltz", ""), "pong": ("PP Pong", "(set: $opponent to 'Jack Curtis')"), "cow": ("Ride Jeffrey Bernard's cow", ""), "cards": ("Green Sea House of Cards", ""), "worm": ("Soho Square Gents", "")}
keys = sys.argv[5:] or list(CASES)
g = Game(width=W, height=H)
for key in keys:
    pas, seeds = CASES[key]
    p = g.page(pas, seeds, audit_header=False); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p); p.wait_for_timeout(3500); Game.clear_overlays(p)
    info = p.evaluate("() => { const tp=document.querySelector('tw-passage'); const fonts={}; [...tp.querySelectorAll('button, .nz-help, small')].forEach(e=>{ const f=getComputedStyle(e).fontFamily.slice(0,20); fonts[f]=(fonts[f]||0)+1; }); return {tags: tp.getAttribute('tags'), fonts, docW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight}; }")
    print(PRE, key, info, "errs", [e[:90] for e in p._errs if 'audio' not in e.lower()][:2], flush=True)
    try: p.screenshot(path=os.path.join(OUT, "%s-%s-%sx%s.png" % (PRE, key, W, H)))
    except Exception as e: print("shot", e)
    p.close()
g.close()
