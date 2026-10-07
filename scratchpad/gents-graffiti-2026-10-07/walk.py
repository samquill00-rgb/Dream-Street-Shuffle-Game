"""Gents door graffiti (2026-10-07): jumbled letters; 'Rearrange them' sorts them into JEFFREY BERNARD IS UNWELL."""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
W, H = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (1280, 900)
g = Game(width=W, height=H); res = {}
p = g.page("Coach and Horses bar", "(set: $inisToldOfPillars to true)(set: $sobriety to 60)(set: $coachViaGents to true)")
Game.click(p, "BEGIN", 2500); Game.clear_overlays(p)
def idle():
    for _ in range(120):
        if p.evaluate("() => { const w=document.getElementById('cb-wrap'); return !!(w && w.querySelector('canvas') && w.dataset.cam==='idle'); }"): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(600)
idle()
res["errors_before"] = p.evaluate("() => (window.__errs||[]).slice(0,5)")
res["look"] = p.evaluate("() => { const r=window._dssThreeRegistry['cb-wrap']; r.look('the gents'); return true; }")
p.wait_for_timeout(400); idle()
res["card"] = p.evaluate("() => { const c=[...document.querySelectorAll('#cb-wrap *')].find(e=>e.querySelector && e.querySelector('.fi-action')); return c ? c.innerText : null; }")
p.screenshot(path=os.path.join(OUT, "1-jumble.png"))
btn = p.locator("#cb-wrap .fi-action", has_text="Rearrange them")
res["btn"] = btn.count()
if btn.count(): btn.first.click()
p.wait_for_timeout(1300); p.screenshot(path=os.path.join(OUT, "2-moving.png"))
p.wait_for_timeout(2500); p.screenshot(path=os.path.join(OUT, "3-sorted.png"))
res["done"] = p.evaluate("() => !!window._dssGentsGrafDone")
res["cam"] = p.evaluate("() => document.getElementById('cb-wrap').dataset.cam")
res["btn_after"] = p.locator("#cb-wrap .fi-action", has_text="Rearrange them").count()
print(json.dumps(res, indent=1))
