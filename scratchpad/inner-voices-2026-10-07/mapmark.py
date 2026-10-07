"""Switch mapMark on for one page: Dean Street with the ticket and cocaine trails begun. Which door labels carry the warm dot.
Args: OUT W H"""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
OUT = sys.argv[1]; W, H = int(sys.argv[2]), int(sys.argv[3]); os.makedirs(OUT, exist_ok=True)
g = Game(width=W, height=H)
p = g.page("The French", "(set: $enteredVenue to true)(set: $inisToldOfPillars to true)(set: $knowsLackland to true)(set: $hadBreather to true)")
p.evaluate("() => { localStorage.setItem('dssVoicesSeen', JSON.stringify(['oi/the globe','cu/the bulb'])); window.DSS_VOICES.switches.mapMark = true; }")
Game.click(p, "BEGIN", 4000); Game.clear_overlays(p)
Game.click(p, "\u2190 Exit to the street", 6000); Game.clear_overlays(p); p.wait_for_timeout(2500)
print(Game.name(p))
r = p.evaluate("() => [...document.querySelectorAll('.soho-door-label')].map(e => e.textContent + (e.classList.contains('soho-door-trail') ? ' *' : ''))")
print(json.dumps(r, ensure_ascii=False), p._errs[:2])
el = p.query_selector('.soho-door-trail')
if el: el.scroll_into_view_if_needed(); p.wait_for_timeout(800)
p.screenshot(path=os.path.join(OUT, 'map-mark-on.png'))
for i, e in enumerate(p.query_selector_all('.soho-door-label')):
    b = e.bounding_box()
    if b and b['width'] > 0: print(e.text_content(), {k: round(v) for k, v in b.items()})
p.evaluate("() => { const s=document.querySelector('.soho-map-stage'); s.style.overflow='visible'; }")
print('dot', p.evaluate("() => { const e=document.querySelector('.soho-door-trail'); const c=getComputedStyle(e,'::after'); return [c.width, c.height, c.backgroundColor, c.display]; }"))
# the look, on a label that is in view: lend the class to the visible doorway label for one shot
print('lent', p.evaluate("() => { const l=[...document.querySelectorAll('.soho-door-label')].find(e => { const b=e.getBoundingClientRect(); return e.textContent === 'A doorway' && b.top > 700 && b.top < 760 && b.left > 600 && b.left < 700; }); if (!l) return null; l.classList.add('soho-door-trail'); const c=getComputedStyle(l,'::after'); return [l.className, c.width, c.display, l.getBoundingClientRect().right]; }"))
p.wait_for_timeout(300)
p.screenshot(path=os.path.join(OUT, 'map-mark-look.png'), clip={'x': 560, 'y': 690, 'width': 240, 'height': 100})
g.close()
