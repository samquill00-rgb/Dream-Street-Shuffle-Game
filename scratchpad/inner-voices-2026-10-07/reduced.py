"""Reduced motion: the chippy card, trail warmth, key from the card."""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
g = Game(width=1440, height=900)
orig = g.b.new_page
g.b.new_page = lambda **kw: orig(reduced_motion='reduce', **kw)
p = g.page("Chinese Fish and Chips", "(set: $enteredVenue to true)(set: $inisToldOfPillars to true)")
p.evaluate("() => localStorage.setItem('dssVoicesSeen', JSON.stringify(['oi/the globe','cf/the menu']))")
Game.click(p, "BEGIN", 1500)
for _ in range(120):
    if p.evaluate("() => !!document.querySelector('#cf-wrap canvas') && !!document.getElementById('cf-wrap').dataset.words"): break
    p.wait_for_timeout(300)
p.wait_for_timeout(1500)
try: p.click('tw-story > .dss-room-fixed .dss-room-dismiss', timeout=2500)
except Exception: pass
p.wait_for_timeout(1500)
r = {"reduced": p.evaluate("() => matchMedia('(prefers-reduced-motion: reduce)').matches"),
     "warm": p.evaluate("() => { const e=window._dssThreeRegistry['cf-wrap']; const gr=e.scene.getObjectByName('restGlow'); return e.hotspots.map((h,i)=>[h.name, gr.children[i].visible, gr.children[i].material.color.g<0.99]).filter(x=>x[2]); }"),
     "opened": p.evaluate("() => window._dssThreeRegistry['cf-wrap'].look('the ticket')")}
p.wait_for_timeout(1000)
r["card"] = p.evaluate("() => { const d=document.querySelector('#cf-wrap .dss-room-card'); return {op: d.style.opacity, edge: d.style.borderColor, v:[...d.querySelectorAll('.dss-voice')].map(x=>x.textContent), b:[...d.querySelectorAll('.fi-action')].map(x=>x.textContent)}; }")
p.screenshot(path="/tmp/reduced-card.png")
r["errs"] = p._errs[:3]
print(json.dumps(r, ensure_ascii=False))
g.close()
