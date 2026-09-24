"""Walk onto Helvellyn Gooch's corner. Run from scratchpad/audit-2026-09-16:
PYTHONPATH=. python3 ../strangers-2026-09-24/gooch_test.py outdir [noflag]"""
import sys, os
from harness import *
out = sys.argv[1]; noflag = len(sys.argv) > 2
seed = "(set: $inisToldOfPillars to true)(set: $knowsCecilCourt to true)" + ("" if noflag else "(set: $mantraComplete to true)")
g = Game(width=1212, height=900)
p = g.page("Dean Street", seed)
Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
print("at", Game.name(p))
print("teleport", p.evaluate("() => window.__dssSohoTeleport(40, 26)"))
p.evaluate("() => window.dispatchEvent(new Event('resize'))"); p.wait_for_timeout(400)
p.keyboard.down("ArrowRight"); p.wait_for_timeout(1500); p.keyboard.up("ArrowRight")
p.wait_for_timeout(2500)
el = p.query_selector('.soho-map-stage'); el.scroll_into_view_if_needed(); p.wait_for_timeout(500)
el.screenshot(path=os.path.join(out, "gooch-corner-" + ("noflag" if noflag else "flag") + ".png"), scale='device')
bb = el.bounding_box(); p.screenshot(path=os.path.join(out, "gooch-corner-" + ("noflag" if noflag else "flag") + "-crop.png"), clip={"x": bb["x"] + bb["width"]*0.62, "y": bb["y"] + bb["height"]*0.46, "width": bb["width"]*0.38, "height": bb["height"]*0.2})
print("bar", p.evaluate("() => (document.querySelector('.soho-map-bar, .smb') || {}).textContent || ''")[:120])
if not noflag:
    p.keyboard.down("ArrowRight"); p.wait_for_timeout(1400); p.keyboard.up("ArrowRight")
    p.wait_for_timeout(2500)
    print("now at", Game.name(p))
    print("errs", [e[:120] for e in p._errs if 'audio' not in e.lower()][:3])
    print("tw-error", p.evaluate("() => document.querySelectorAll('tw-error').length"))
    p.screenshot(path=os.path.join(out, "gooch-passage.png"), full_page=True)
    Game.click(p, "Walk on", 1200); Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 900): break
        Game.clear_overlays(p)
    print("back at", Game.name(p))
    print("teleport", p.evaluate("() => window.__dssSohoTeleport(40, 26)"))
    p.keyboard.down("ArrowRight"); p.wait_for_timeout(1500); p.keyboard.up("ArrowRight"); p.wait_for_timeout(2000)
    el = p.query_selector('.soho-map-stage'); el.scroll_into_view_if_needed(); p.wait_for_timeout(500)
    el.screenshot(path=os.path.join(out, "gooch-corner-after.png"), scale='device')
    print("state", p.evaluate("() => { try { return String(State.variables.goochMet) + ' ' + String(State.variables.confidence); } catch(e) { return 'no State' } }"))
g.close()
