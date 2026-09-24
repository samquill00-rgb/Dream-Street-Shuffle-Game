"""Walk north up Dean Street into the Fetch. Run from scratchpad/audit-2026-09-16:
PYTHONPATH=. python3 ../strangers-2026-09-24/fetch_test.py outdir"""
import sys, os
from harness import *
out = sys.argv[1]
seed = "(set: $inisToldOfPillars to true)(set: $knowsCecilCourt to true)(set: $ezekielVision to true)"
g = Game(width=1212, height=900)
p = g.page("Dean Street", seed)
Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
print("at", Game.name(p))
def shot(name, hold):
    p.keyboard.down("ArrowUp"); p.wait_for_timeout(hold); p.keyboard.up("ArrowUp"); p.wait_for_timeout(1200)
    el = p.query_selector('.soho-map-stage'); el.scroll_into_view_if_needed(); p.wait_for_timeout(300)
    el.screenshot(path=os.path.join(out, name), scale='device')
    bb = el.bounding_box(); p.screenshot(path=os.path.join(out, name.replace('.png','-crop.png')), clip={"x": bb["x"] + bb["width"]*0.36, "y": bb["y"] + bb["height"]*0.25, "width": bb["width"]*0.3, "height": bb["height"]*0.38})
    print(name, p.evaluate("() => (document.querySelector('.smb-place, .soho-map-bar') || {}).textContent || ''")[:60])
print("teleport", p.evaluate("() => window.__dssSohoTeleport(17, 16)"))
p.evaluate("() => window.dispatchEvent(new Event('resize'))"); p.wait_for_timeout(500)
shot("fetch-far.png", 450)      # a few tiles north, the double clear ahead
shot("fetch-near.png", 900)    # closer, the double thinning
p.keyboard.down("ArrowUp"); p.wait_for_timeout(2600); p.keyboard.up("ArrowUp"); p.wait_for_timeout(2500)
print("now at", Game.name(p))
print("errs", [e[:120] for e in p._errs if 'audio' not in e.lower()][:3])
print("tw-error", p.evaluate("() => document.querySelectorAll('tw-error').length"))
p.screenshot(path=os.path.join(out, "fetch-passage.png"), full_page=True)
Game.click(p, "Walk on", 1200); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
print("back at", Game.name(p))
print("teleport", p.evaluate("() => window.__dssSohoTeleport(17, 15)"))
p.evaluate("() => window.dispatchEvent(new Event('resize'))"); p.wait_for_timeout(500)
shot("fetch-after.png", 700)
g.close()
