"""Quick look at the French with the words inside the room. Run from scratchpad/audit-2026-09-16 with PYTHONPATH=.:../scene-closeups-2026-09-25"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'scene-closeups-2026-09-25'))
from harness import *
import room_harness as R
out = sys.argv[1]; width = int(sys.argv[2])
R.setup('fi-wrap', width, False, out, ('phone-' if width < 600 else ''))
p = R.boot('(set: $frenchApproached to true)(set: $visited\'s French to false)(set: $visited\'s FrenchVisits to 0)(set: $haunts to (a:))(set: $lilyCount to 0)', 'The French')
info = p.evaluate("""() => { const b = document.querySelector('#fi-wrap .dss-room-prose'); const w = document.getElementById('fi-wrap').getBoundingClientRect();
  return { wrap: [w.top, w.height, innerHeight], box: b ? {text: b.textContent.replace(/\\s+/g,' ').trim().slice(0,200), h: b.getBoundingClientRect().height, claimed: [...b.querySelectorAll('.dss-claimed')].map(e=>e.textContent.trim()), wraps: b.querySelectorAll('.dss-claimed-wrap').length, visibleLinks: [...b.querySelectorAll('tw-link')].filter(l=>l.getClientRects().length).map(l=>l.textContent.trim())} : null,
  passageKids: [...document.querySelector('tw-passage').children].map(e=>e.tagName+'#'+e.id+'.'+e.className).slice(0,12), docH: document.documentElement.scrollHeight }; }""")
print(info)
R.shot(p, '1-idle')
xy = R.screen(p, R.ghost_pos(p, 0)); print('figure at', xy)
R.tap(p, xy); R.wait_cam(p, 'inspect'); p.wait_for_timeout(600)
print('card', R.card(p)); R.shot(p, '2-figure')
print('box hidden?', p.evaluate("() => getComputedStyle(document.querySelector('#fi-wrap .dss-room-prose')).visibility"))
R.back(p); R.shot(p, '3-back')
print('box back?', p.evaluate("() => getComputedStyle(document.querySelector('#fi-wrap .dss-room-prose')).visibility"))
R.tap(p, xy); R.wait_cam(p, 'inspect'); p.wait_for_timeout(300); R.press(p, 'Approach'); p.wait_for_timeout(2500)
print('now at', Game.name(p)); print('errors', R.errs(p)); p.close()
