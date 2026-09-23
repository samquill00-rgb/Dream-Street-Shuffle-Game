"""Element screenshot of the Dean Street tile map at 2x. Run from scratchpad/audit-2026-09-16:
PYTHONPATH=. python3 ../polish-loop-2026-09-23/tilemap_shot.py out.png"""
import sys
from harness import *
out = sys.argv[1]
tc, tr = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (None, None)
g = Game(width=1212, height=900)
p = g.page("Dean Street", "(set: $inisToldOfPillars to true)(set: $knowsCecilCourt to true)(set: $knowsLackland to true)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
if tc is not None:
    print("teleport", p.evaluate("([c,r]) => window.__dssSohoTeleport(c,r)", [tc, tr]))
p.wait_for_timeout(600)
if tc is not None:
    # walk a few tiles so the camera moves and settles: the door labels are only re-placed on camera movement
    p.keyboard.down("ArrowUp"); p.wait_for_timeout(1600); p.keyboard.up("ArrowUp")
p.wait_for_timeout(2500)
print("at", Game.name(p))
el = p.query_selector('.soho-map-stage')
el.scroll_into_view_if_needed(); p.wait_for_timeout(800)
el.screenshot(path=out, scale='device')
print("errs", [e[:120] for e in p._errs if 'audio' not in e.lower()][:3])
g.close()
