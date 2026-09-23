"""Open the notebook MAP tab on a passage and screenshot the map.
Run from scratchpad/audit-2026-09-16: PYTHONPATH=. python3 ../polish-loop-2026-09-23/nbmap_shot.py OUT.png [width] [passage]"""
import sys, json
from harness import *
out = sys.argv[1]; width = int(sys.argv[2]) if len(sys.argv) > 2 else 1212
target = sys.argv[3] if len(sys.argv) > 3 else "The French"
SEED = __import__("os").environ.get("SEED","")
RICH = ('(set: $inisToldOfPillars to true)(set: $returnedPage to true)(set: $metCritic to true)'
        '(set: $knowsCecilCourt to true)(set: $knowsLackland to true)(set: $metDavy to true)(set: $metShana to true)'
        '(set: $visited\'s Colony to true)(set: $visited\'s Ronnies to true)(set: $visited\'s Trishas to true)')
g = Game(width=width, height=780 if width < 600 else 900)
p = g.page(target, RICH + SEED)
Game.click(p, "BEGIN", 1200); p.wait_for_timeout(1500); Game.clear_overlays(p)
print("at", Game.name(p))
ok = p.evaluate("""() => { const l=document.querySelector('.notebook-link tw-link, .notebook-link a, .notebook-link'); if(!l) return 'nolink'; (l.tagName==='TW-LINK'||l.tagName==='A'?l:(l.querySelector('tw-link,a')||l)).click(); return 'clicked'; }""")
print(ok); p.wait_for_timeout(1500)
ok = p.evaluate("""() => { const t=document.querySelector('.nb-tab[data-tab="map"]'); if(!t) return 'notab'; window.nbSwitchTab(t); return 'map'; }""")
print(ok); p.wait_for_timeout(1500)
el = p.query_selector('.soho-map')
if el: el.screenshot(path=out); print("shot", out)
else: p.screenshot(path=out); print("no .soho-map; full page shot")
print("errs", p._errs[:3])
g.close()
