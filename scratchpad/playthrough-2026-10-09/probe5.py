import sys, re; sys.path.insert(0, "scratchpad/audit-2026-09-16")
import harness
harness.STATE_VARS += ["alleyReturn","sawAoifeMemory2","aoifeRework","afterMidnight","shipCall","sawAoifeReflection"]
harness.AUDIT_HEADER = ('\n<div id="audit-name">(print: (passage:)\'s name)</div>\n(link-repeat: "AUDIT READ")[<div id="audit-state">(print: (dm: ' + ",".join('"%s", $%s' % (v, v) for v in harness.STATE_VARS) + '))</div>]')
from harness import Game
g = Game()
seed = '(set: $afterMidnight to true)(set: $shipCall to "")(set: $enteredVenue to true)(set: $sawAoifeMemory2 to true)(set: $aoifeRework to false)(set: $returns to 3)'
for seen in (False, True):
    p = g.page("Turn to Copper" if seen else "Dean Street", seed)
    Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(1500)
    if seen:
        print("  copper at", Game.name(p)); Game.click(p, "← Exit to the street", 1500); Game.clear_overlays(p); p.wait_for_timeout(1000)
    st = Game.snapshot(p)["state"] or ""
    dock = p.evaluate("() => [...document.querySelectorAll('.soho-hub-dock tw-link')].map(e=>e.textContent.trim()+'>'+(e.getAttribute('passage-name')||''))")
    print("5 metCopper=%s at" % seen, Game.name(p), "| dock:", dock, "| hist has Copper:", p.evaluate("() => !!document.querySelector('tw-passage')") , "| state tail:", st[-140:])
    p.close()
g.close()
