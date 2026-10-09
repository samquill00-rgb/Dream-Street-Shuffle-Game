"""Note 1: Eat. at the chippy opens the eating card there; the street follows once eaten."""
import sys, json
sys.path.insert(0, "scratchpad/audit-2026-09-16")
from harness import Game
OUT = "scratchpad/playthrough-2026-10-09/"
g = Game()
p = g.page("Chinese Fish and Chips", "(set: $hasMatches to true)(set: $inisToldOfPillars to false)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(2500)
print("at", Game.name(p), "errors", p.locator("tw-error").count(), p._errs[:2])
print("eat overlay before:", p.locator("#eat-overlay").count())
ok = Game.click(p, "Eat.", 600)
print("clicked Eat.", ok, "| still at", Game.name(p), "| eat overlay now:", p.locator("#eat-overlay").count())
p.screenshot(path=OUT + "t1-card-at-counter.png")
box = p.locator("#eat-overlay canvas").bounding_box()
p.mouse.move(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
p.mouse.down()
for i in range(40):
    p.wait_for_timeout(500)
    if p.evaluate("() => !!document.querySelector('#eat-overlay') && getComputedStyle(document.querySelector('#eat-overlay')).opacity==='1' && document.querySelector('#eat-overlay > div').style.opacity==='0'"): break
p.mouse.up()
print("held for ~%.1fs" % ((i+1)*0.5))
for i in range(20):
    p.wait_for_timeout(500)
    if Game.name(p) == "Dean Street": break
print("after eating: at", Game.name(p), "| overlay:", p.locator("#eat-overlay").count(), "| errors", p._errs[:2])
snap = Game.snapshot(p); print("state", snap["state"][:200] if snap["state"] else None)
p.screenshot(path=OUT + "t1-street-after.png")
g.close()
