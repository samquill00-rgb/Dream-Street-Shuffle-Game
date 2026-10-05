"""Viewport shots of a few header pages at a size. Args: OUT PREFIX W H"""
import sys, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
OUT, PRE, W, H = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]); os.makedirs(OUT, exist_ok=True)
CASES = [("hub","Dean Street",""),("nazca-race","Nazca Race",""),("colony-member","Colony Member",""),("trishas-room","Trisha's","(set: $visited's Trishas to true)(set: $hasTrishaMatchbook to true)")]
g = Game(width=W, height=H)
for key, pas, seeds in CASES:
    p = g.page(pas, seeds, audit_header=False); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 900): break
        Game.clear_overlays(p)
    p.wait_for_timeout(3500); Game.clear_overlays(p)
    info = p.evaluate("""() => { const tp=document.querySelector('tw-passage'); const hdr=document.querySelector('#stat-bars-lifted'); const m=document.querySelector('.soho-map-stage'); const first=[...tp.querySelectorAll('h1, p, canvas, iframe, .dss-room-prose, svg')].find(e=>e.getClientRects().length && !e.closest('.dss-threshold')); return {hdr: hdr?Math.round(hdr.getBoundingClientRect().bottom):null, padTop: getComputedStyle(tp).paddingTop, storyPad: getComputedStyle(document.querySelector('tw-story')).paddingTop, first: first?[first.tagName, Math.round(first.getBoundingClientRect().top)]:null, map: m?Math.round(m.getBoundingClientRect().top):null, docH: document.documentElement.scrollHeight}; }""")
    print(PRE, key, info, "errs", [e[:80] for e in p._errs if 'audio' not in e.lower()][:2], flush=True)
    try: p.screenshot(path=os.path.join(OUT, "%s-%s-%sx%s.png" % (PRE, key, W, H)))
    except Exception as e: print("shot", e)
    p.close()
g.close()
