"""For a seeded room: every hotspot's actions() link texts, plus all link texts in the document. Args: wrapId passage seeds"""
import sys, json
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
w, pas, seeds = sys.argv[1], sys.argv[2], sys.argv[3]
g = Game(width=1440, height=900)
p = g.page(pas, seeds + "(set: $enteredVenue to true)(set: $sobriety to 60)"); Game.click(p, "BEGIN", 1200)
for _ in range(200):
    if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle'", w): break
    p.wait_for_timeout(300)
p.wait_for_timeout(900); Game.clear_overlays(p)
print(pas, "at", Game.name(p))
print("  all links:", p.evaluate("() => [...document.querySelectorAll('tw-link')].map(l=>l.textContent.trim()).filter(t=>t!=='AUDIT READ')"))
print("  actions:", json.dumps(p.evaluate("(w) => window._dssThreeRegistry[w].hotspots.map(h => { let a=[]; try { a=(h.actions?h.actions():[]).map(l=>l.textContent.trim()); } catch(e) { a=['ERR '+e]; } return [h.name, a]; })", w), ensure_ascii=False))
g.close()
