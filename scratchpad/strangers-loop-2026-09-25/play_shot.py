"""Play-size stage shot of a stranger's corner. Run from scratchpad/audit-2026-09-16:
PYTHONPATH=. python3 ../strangers-loop-2026-09-25/play_shot.py <slug> <width> <outdir>"""
import sys, os
from harness import *
STR = {'gooch': ("(set: $mantraComplete to true)", 46, 26), 'morris': ("(set: $nazcaTracing to true)", 9, 17),
       'longshanks': ("(set: $easterGlyph to true)", 9, 29), 'songstrong': ("(set: $pyramidNumber to true)", 31, 38), 'fetch': ("(set: $ezekielVision to true)", 17, 12)}
slug, width, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]; flag, c, r = STR[slug]
g = Game(width=width, height=900 if width > 600 else 844)
p = g.page("Dean Street", "(set: $inisToldOfPillars to true)(set: $knowsCecilCourt to true)(set: $enteredVenue to true)" + flag)
Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
p.evaluate("([c,r]) => window.__dssSohoTeleport(c,r)", [c, r]); p.evaluate("() => window.dispatchEvent(new Event('resize'))"); p.wait_for_timeout(1500)
el = p.query_selector('.soho-map-stage'); el.scroll_into_view_if_needed(); p.wait_for_timeout(400)
el.screenshot(path=os.path.join(out, "%s-play-%d.png" % (slug, width)))
print("errs", [e[:100] for e in p._errs if 'audio' not in e.lower()][:2])
g.close()
