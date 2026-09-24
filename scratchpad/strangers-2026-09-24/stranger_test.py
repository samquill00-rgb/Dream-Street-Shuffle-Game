"""Walk onto a stranger's corner. Run from scratchpad/audit-2026-09-16:
PYTHONPATH=. python3 ../strangers-2026-09-24/stranger_test.py <slug> "<seed sets>" fromC fromR dir holdMs "<passage name>" outdir
dir is one of up/down/left/right; the walker starts at fromC,fromR and holds the arrow for holdMs."""
import sys, os
from harness import *
slug, seedx, fc, fr, d, hold, pname, out = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5], int(sys.argv[6]), sys.argv[7], sys.argv[8]
key = {'up':'ArrowUp','down':'ArrowDown','left':'ArrowLeft','right':'ArrowRight'}[d]
seed = "(set: $inisToldOfPillars to true)(set: $knowsCecilCourt to true)" + seedx
g = Game(width=1212, height=900)
p = g.page("Dean Street", seed)
Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
print("at", Game.name(p))
def shot(name):
    el = p.query_selector('.soho-map-stage'); el.scroll_into_view_if_needed(); p.wait_for_timeout(400)
    el.screenshot(path=os.path.join(out, name), scale='device')
print("teleport", p.evaluate("([c,r]) => window.__dssSohoTeleport(c,r)", [fc, fr]))
p.evaluate("() => window.dispatchEvent(new Event('resize'))"); p.wait_for_timeout(1200)
shot(slug + "-corner.png")
p.keyboard.down(key); p.wait_for_timeout(hold); p.keyboard.up(key); p.wait_for_timeout(2500)
print("now at", Game.name(p), "| expected", pname)
print("errs", [e[:120] for e in p._errs if 'audio' not in e.lower()][:3])
print("tw-error", p.evaluate("() => document.querySelectorAll('tw-error').length"))
p.screenshot(path=os.path.join(out, slug + "-passage.png"), full_page=True)
Game.click(p, "Walk on", 1200); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
print("back at", Game.name(p))
print("teleport", p.evaluate("([c,r]) => window.__dssSohoTeleport(c,r)", [fc, fr]))
p.evaluate("() => window.dispatchEvent(new Event('resize'))"); p.wait_for_timeout(1200)
shot(slug + "-after.png")
g.close()
