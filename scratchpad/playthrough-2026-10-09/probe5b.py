import sys, re; sys.path.insert(0, "scratchpad/audit-2026-09-16")
from harness import Game
g = Game()
seed = '(set: $afterMidnight to true)(set: $shipCall to "")(set: $enteredVenue to true)(set: $returns to 3)(set: $hasCoin to false)'
for seen in (False, True):
    p = g.page("Turn to Copper" if seen else "Dean Street", seed)
    Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(1500)
    if seen:
        Game.click(p, "← Exit to the street", 1500); Game.clear_overlays(p); p.wait_for_timeout(1000)
    print("metCopper=%s at" % seen, Game.name(p), "| text:", p.evaluate("() => (document.querySelector('tw-passage')||{}).innerText||''")[:90].replace("\n"," / "))
    has = Game.click(p, "The phone box", 1200)
    print("   phone box link:", has, "-> at", Game.name(p))
    p.close()
g.close()
