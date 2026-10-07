"""A key on its object: no entry popup while the room stands; the popup comes back if the room fails."""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
g = Game(width=1440, height=900)
for pas, w in [("The French", "fi-wrap"), ("Martin Lackland's Office", "lk-wrap")]:
    p = g.page(pas, "(set: $inisToldOfPillars to true)(set: $knowsLackland to true)(set: $enteredVenue to true)")
    Game.click(p, "BEGIN", 1200)
    for _ in range(200):
        if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle'", w): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(3000)
    try: p.click('tw-story > .dss-room-fixed .dss-room-dismiss', timeout=3000)
    except Exception: pass
    p.wait_for_timeout(2000)
    r = {"popupWithRoom": p.evaluate("() => !!document.getElementById('dss-key-overlay')"),
         "offers": p.evaluate("() => [...document.querySelectorAll('tw-passage .dss-key-offer')].map(o=>o.dataset.key+':'+o.dataset.kind+':'+o.querySelectorAll('tw-link').length)")}
    p.evaluate("() => window.dssSceneFailed(new Error('test'), 'frame')")
    p.wait_for_timeout(3500)
    r["popupAfterFail"] = p.evaluate("() => { const o=document.getElementById('dss-key-overlay'); return o ? o.innerText.replace(/\\s+/g,' ').slice(0,160) : null; }")
    p.screenshot(path="/tmp/iv1/fail-%s.png" % w)
    r["jsErrors"] = p._errs[:3]
    print(pas, json.dumps(r, ensure_ascii=False))
    p.close()
g.close()
