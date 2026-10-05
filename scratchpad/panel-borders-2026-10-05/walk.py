"""Plain-page panels and a room modal, desktop and phone, with the frame glow."""
import sys, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
CASES = [
 ("colony-member", "Colony Member", ""),
 ("oflatterly-quest", "O'Flatterly's quest", "(set: $haunts to (a:))"),
 ("doorway", "A Doorway on Dean Street", ""),
 ("maltese", "Maltese Gangsters", ""),
]
for W, H, tag in [(1280, 900, "desktop"), (390, 844, "phone")]:
    g = Game(width=W, height=H)
    for key, pas, seeds in CASES:
        p = g.page(pas, seeds); Game.click(p, "BEGIN", 1500); Game.clear_overlays(p)
        for _ in range(20):
            if p.evaluate("() => !!document.querySelector('tw-story .dss-threshold .dss-room-prose')"): break
            p.wait_for_timeout(200)
        p.wait_for_timeout(1800); Game.clear_overlays(p)
        info = p.evaluate("() => { const b=document.querySelector('tw-story .dss-threshold .dss-room-prose'); if(!b) return null; const cs=getComputedStyle(b), bf=getComputedStyle(b,'::before'), af=getComputedStyle(b,'::after'); return {at: document.querySelector('#audit-name')?.textContent, border: cs.borderColor, shadow: cs.boxShadow.slice(0,60), before: bf.boxShadow.slice(0,50)+' anim='+bf.animationName, after: af.borderColor}; }")
        print(tag, key, info, "errs", p._errs[:2], flush=True)
        p.screenshot(path=os.path.join(OUT, "%s-%s.png" % (tag, key)))
        p.close()
    # a room modal: Trisha's (ti) with the plain renderer
    p = g.page("Trisha's", "(set: $visited's Trishas to true)(set: $hasTrishaMatchbook to true)"); Game.click(p, "BEGIN", 1500); Game.clear_overlays(p)
    for _ in range(60):
        if p.evaluate("() => !!document.querySelector('.dss-room-veil-on .dss-room-prose')"): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(2500); Game.clear_overlays(p)
    print(tag, "room", Game.name(p), p.evaluate("() => { const b=document.querySelector('.dss-room-veil-on .dss-room-prose'); return b ? getComputedStyle(b).borderColor : null; }"), "errs", p._errs[:2], flush=True)
    p.screenshot(path=os.path.join(OUT, "%s-room-trishas.png" % tag))
    p.close(); g.close()
