"""Phone / reduced-motion batch. Args: OUT PRE W H [reduced]"""
import sys, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
OUT, PRE, W, H = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]); os.makedirs(OUT, exist_ok=True)
REDUCED = len(sys.argv) > 5
CASES = [("towards-dawn","Towards Dawn",""),("colony-member","Colony Member",""),("nazca-race","Nazca Race",""),("hub","Dean Street","")]
g = Game(width=W, height=H)
for key, pas, seeds in CASES:
    p = g.page(pas, seeds, audit_header=False)
    if REDUCED: p.emulate_media(reduced_motion="reduce"); p.reload(); p.wait_for_timeout(1500)  # before boot, or the script never sees it
    Game.click(p, "BEGIN", 1200); Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 900): break
    p.wait_for_timeout(3000); Game.clear_overlays(p)
    info = p.evaluate("() => ({docW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight, hdr: (document.querySelector('#stat-bars-lifted')||{getBoundingClientRect(){return {bottom:null}}}).getBoundingClientRect().bottom, panelTop: (document.querySelector('tw-story .dss-threshold .dss-room-prose')||{getBoundingClientRect(){return {top:null}}}).getBoundingClientRect().top})")
    print(PRE, key, info, "errs", [e[:80] for e in p._errs if 'audio' not in e.lower()][:2], flush=True)
    try: p.screenshot(path=os.path.join(OUT, "%s-%s-%sx%s.png" % (PRE, key, W, H)))
    except Exception as e: print("shot", e)
    if key == "colony-member":
        # the departure: under reduced motion the press goes through at once; otherwise it is held
        r = p.evaluate("""() => new Promise(res => { const l=[...document.querySelectorAll('tw-story .dss-threshold tw-link')].pop(); const t0=performance.now(); const out=[]; const tick=()=>{ out.push([Math.round(performance.now()-t0), document.querySelector('tw-story').className, getComputedStyle(document.querySelector('tw-passage')).opacity]); if(performance.now()-t0<700) requestAnimationFrame(tick); else res(out); }; l.click(); tick(); })""")
        print(PRE, "depart samples", r[::5], flush=True)
    p.close()
g.close()
