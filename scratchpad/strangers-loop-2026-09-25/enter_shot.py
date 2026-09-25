"""The step onto a stranger: frames of the map's fade. Run from scratchpad/audit-2026-09-16:
PYTHONPATH=. python3 ../strangers-loop-2026-09-25/enter_shot.py <slug> <outdir>"""
import sys, os
from harness import *
STR = {'gooch': ("(set: $mantraComplete to true)", 47, 26, 'ArrowRight'), 'morris': ("(set: $nazcaTracing to true)", 8, 17, 'ArrowLeft'),
       'longshanks': ("(set: $easterGlyph to true)", 8, 29, 'ArrowLeft'), 'songstrong': ("(set: $pyramidNumber to true)", 31, 39, 'ArrowDown'), 'fetch': ("(set: $ezekielVision to true)", 17, 9, 'ArrowUp')}
slug, out = sys.argv[1], sys.argv[2]; flag, c, r, key = STR[slug]
g = Game(width=1212, height=900)
p = g.page("Dean Street", "(set: $inisToldOfPillars to true)(set: $knowsCecilCourt to true)(set: $enteredVenue to true)" + flag)
Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
p.evaluate("([c,r]) => window.__dssSohoTeleport(c,r)", [c, r]); p.evaluate("() => window.dispatchEvent(new Event('resize'))"); p.wait_for_timeout(800)
el = p.query_selector('.soho-map-stage canvas'); el.scroll_into_view_if_needed(); p.wait_for_timeout(300); bb = el.bounding_box()
clip = {"x": bb["x"], "y": bb["y"], "width": bb["width"], "height": bb["height"]}
p.keyboard.down(key)
for i in range(8):
    p.wait_for_timeout(90); p.screenshot(path=os.path.join(out, "%s-enter-%d.png" % (slug, i)), clip=clip)
p.keyboard.up(key); p.wait_for_timeout(2000); print("now at", Game.name(p), "errs", [e[:100] for e in p._errs if 'audio' not in e.lower()][:2])
g.close()
