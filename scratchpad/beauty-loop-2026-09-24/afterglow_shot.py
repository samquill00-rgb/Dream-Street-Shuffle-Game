"""PYTHONPATH=. python3 ../beauty-loop-2026-09-24/afterglow_shot.py "Passage" "link text substring" outprefix [alpha] [width] [reduced]"""
import sys, os
from harness import *
target, link, out = sys.argv[1], sys.argv[2], sys.argv[3]
alpha = sys.argv[4] if len(sys.argv) > 4 else None
width = int(sys.argv[5]) if len(sys.argv) > 5 else 1212
reduced = len(sys.argv) > 6 and sys.argv[6] == 'reduced'
RICH = ('(set: $metCritic to true)(set: $metDavy to true)(set: $lilyCount to 3)(set: $haunts to (a: $haunt1, $haunt2, $haunt3))')
g = Game(width=width, height=780 if width < 600 else 900)
p = g.page(target, RICH)
if reduced: p.emulate_media(reduced_motion='reduce')
if alpha: p.evaluate("(a)=>{window.DSS_AFTERGLOW_ALPHA=a}", float(alpha))
Game.click(p, "BEGIN", 1200)
for _ in range(3):
    if Game.name(p) == target: break
    if not Game.click(p, "On.", 900): break
p.wait_for_timeout(2500); Game.clear_overlays(p)
print("at", Game.name(p))
ok = p.evaluate("(t)=>{const e=[...document.querySelectorAll('tw-link')].find(e=>e.textContent.trim().toUpperCase().includes(t.toUpperCase())); if(!e) return false; e.click(); return true;}", link)
print("clicked", ok)
for ms, tag in ((250, "0s"), (2500, "2s"), (5000, "5s")):
    p.wait_for_timeout(ms if tag=="0s" else (ms - (250 if tag=="2s" else 2500)))
    p.screenshot(path=f"{out}-{tag}.png", full_page=False)
    print(tag, "at", Game.name(p), "glow", p.evaluate("()=>{const g=document.querySelector('.dss-afterglow'); return g? getComputedStyle(g).opacity : 'none'}"))
print("errs", [e[:120] for e in p._errs if 'audio' not in e.lower()][:3])
g.close()
