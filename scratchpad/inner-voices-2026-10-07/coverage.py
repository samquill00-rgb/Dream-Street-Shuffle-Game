"""Every object in every room: a voice line or a choice; the console names no unmatched objects."""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
R = [("fi-wrap","The French",""),("ci-wrap","The Colony Room",""),("pi-wrap","Entering The Pillars of Hercules","(set: $metCritic to true)"),
     ("ri-wrap","Ronnie Scott's","(set: $knowsRonnies to true)"),("cu-wrap","Turn to Copper",""),("cb-wrap","Coach and Horses bar",""),
     ("ti-wrap","Trisha's",""),("lk-wrap","Martin Lackland's Office","(set: $knowsLackland to true)"),("cf-wrap","Chinese Fish and Chips",""),("oi-wrap","O'Flatterly's shop","")]
g = Game(width=1440, height=900)
for w, pas, seeds in R:
    p = g.page(pas, seeds + "(set: $enteredVenue to true)")
    Game.click(p, "BEGIN", 1500)
    for _ in range(120):
        if p.evaluate("(w) => !!(window._dssThreeRegistry||{})[w] && !!document.getElementById(w)?.dataset.words", w): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(1500)
    rows = p.evaluate("""(w) => { const e=window._dssThreeRegistry[w]; const room=w.replace('-wrap','');
      return e.hotspots.map(h => { let a=[]; try { a=h.actions?h.actions():[]; } catch(x){}
        return [h.name, !!h.figure, a.length, window.dssVoices.lines(room, h.name).length]; }); }""", w)
    silent = [r for r in rows if r[3] == 0]
    unclick = [r[0] for r in rows if r[1] and r[2] == 0]
    warns = [c[1] for c in p._cons if 'DSS voices' in c[1]]
    print(w, len(rows), "objects; silent:", silent, "figures not clickable now:", unclick, "warn:", warns, "errs:", [e[:60] for e in p._errs])
    p.close()
g.close()
