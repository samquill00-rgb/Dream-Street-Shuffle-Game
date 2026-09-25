"""Stranger corner shots for the 2026-09-25 loop. Run from scratchpad/audit-2026-09-16:
PYTHONPATH=. python3 ../strangers-loop-2026-09-25/stranger_shot.py <slug> <outdir> [walk] [reduced]
Boots Dean Street with the world's flag set, teleports the walker a few tiles from the
stranger, crops the centre of the stage at 3x (far), steps two tiles closer (near),
then (with walk) walks onto the corner, into the scene, back, and crops the corner again (after)."""
import sys, os
from harness import *
STR = {
  'gooch':      ("(set: $mantraComplete to true)", 48, 26, 'right', 5),
  'fetch':      ("(set: $ezekielVision to true)",   17, 8,  'up',    6),
  'morris':     ("(set: $nazcaTracing to true)",    7,  17, 'left',  5),
  'longshanks': ("(set: $easterGlyph to true)",     7,  29, 'left',  5),
  'songstrong': ("(set: $pyramidNumber to true)",   31, 40, 'down',  5),
}
slug, out = sys.argv[1], sys.argv[2]; walk = 'walk' in sys.argv; reduced = 'reduced' in sys.argv
flag, sc, sr, d, dist = STR[slug]
key = {'up':'ArrowUp','down':'ArrowDown','left':'ArrowLeft','right':'ArrowRight'}[d]
dc = {'right':-1,'left':1,'up':0,'down':0}[d]; dr = {'down':-1,'up':1,'left':0,'right':0}[d]
seed = "(set: $inisToldOfPillars to true)(set: $knowsCecilCourt to true)(set: $enteredVenue to true)" + flag
g = Game(width=1212, height=900)
_np = g.b.new_page
g.b.new_page = lambda **kw: _np(device_scale_factor=3, reduced_motion=('reduce' if reduced else 'no-preference'), **kw)
p = g.page("Dean Street", seed)
Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
print("at", Game.name(p))
T, W, VR, SKY, WW, WH = 16, 416, 26, 3, 52*16, 44*16
POS = [0, 0]
def crop(name, wait=1500, tiles=9):
    p.evaluate("() => window.dispatchEvent(new Event('resize'))"); p.wait_for_timeout(wait)
    el = p.query_selector('.soho-map-stage canvas'); el.scroll_into_view_if_needed(); p.wait_for_timeout(300)
    bb = el.bounding_box(); k = bb["width"] / W
    camx = max(0, min(WW - W, POS[0]*T + 8 - W/2)); camy = max(0, min(WH - VR*T, POS[1]*T + 8 - VR*T/2))
    cxp = (sc*T + 8 - camx) * k + bb["x"]; cyp = (SKY*T + sr*T + 8 - camy) * k + bb["y"]
    half = tiles/2 * T * k
    p.screenshot(path=os.path.join(out, slug + "-" + name + ".png"), clip={"x": cxp - half, "y": cyp - half, "width": half*2, "height": half*2}, scale='device')
def tele(c, r):
    ok = p.evaluate("([c,r]) => window.__dssSohoTeleport(c,r)", [c, r]); print("teleport", c, r, ok); POS[0] = c; POS[1] = r; return ok
tele(sc + dc*dist, sr + dr*dist); crop("far")
tele(sc + dc*2, sr + dr*2); crop("near")
if walk:
    p.keyboard.down(key); p.wait_for_timeout(1400); p.keyboard.up(key); p.wait_for_timeout(2500)
    print("now at", Game.name(p))
    print("errs", [e[:120] for e in p._errs if 'audio' not in e.lower()][:3])
    print("tw-error", p.evaluate("() => document.querySelectorAll('tw-error').length"))
    p.screenshot(path=os.path.join(out, slug + "-scene.png"))
    Game.click(p, "Walk on", 300)
    p.wait_for_timeout(200); p.screenshot(path=os.path.join(out, slug + "-return-0s.png"))
    p.wait_for_timeout(1800); p.screenshot(path=os.path.join(out, slug + "-return-2s.png"))
    Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 900): break
        Game.clear_overlays(p)
    print("back at", Game.name(p))
    tele(sc + dc*2, sr + dr*2); crop("after")
g.close()
