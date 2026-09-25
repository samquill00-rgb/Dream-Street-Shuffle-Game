"""PYTHONPATH=. python3 ../beauty-loop-2026-09-24/title_crop.py "Passage" selector out.png [scale]"""
import sys, os
from harness import *
from playwright.sync_api import sync_playwright
target, sel, out = sys.argv[1], sys.argv[2], sys.argv[3]
scale = float(sys.argv[4]) if len(sys.argv) > 4 else 3
class G3(Game):
    def page(self, *a, **k):
        p = Game.page(self, *a, **k); return p
g = G3(width=1212, height=900)
# recreate context with device scale factor
p = g.b.new_page(viewport={"width": 1212, "height": 900}, device_scale_factor=scale)
p._errs=[]; 
start = BODIES["Start"].replace('(go-to: "The Night Ahead")', BASE + '(set: $metShana to true)\n(go-to: ' + json.dumps(target) + ')')
p.add_init_script("(" + INIT_JS + ")(" + json.dumps({"start": start, "header": BODIES["header header"] + AUDIT_HEADER}) + ")")
p.goto(URL, wait_until="domcontentloaded"); p.wait_for_timeout(1300)
Game.click(p, "BEGIN", 1200)
for _ in range(3):
    if Game.name(p) == target: break
    if not Game.click(p, "On.", 900): break
p.wait_for_timeout(3000); Game.clear_overlays(p)
el = p.query_selector(sel)
print("at", Game.name(p), "found", bool(el))
if el: el.screenshot(path=out)
g.close()
