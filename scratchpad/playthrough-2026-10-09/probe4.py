import sys, re; sys.path.insert(0, "scratchpad/audit-2026-09-16")
import harness
harness.STATE_VARS += ["alleyReturn","sawAoifeMemory2","aoifeRework","afterMidnight","shipCall"]
harness.AUDIT_HEADER = ('\n<div id="audit-name">(print: (passage:)\'s name)</div>\n(link-repeat: "AUDIT READ")[<div id="audit-state">(print: (dm: ' + ",".join('"%s", $%s' % (v, v) for v in harness.STATE_VARS) + '))</div>]')
from harness import Game
g = Game()
SEED4 = "(set: $aoifeRework to true)(set: $returns to 5)(set: $sawAoifeReflection to true)(set: $sawAoifeMemory2 to false)(set: $hadPhoneCall to true)(set: $metCritic to true)"
for ar in ("true","false"):
    p = g.page("Dean Street", SEED4 + "(set: $alleyReturn to %s)" % ar)
    Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(1200)
    st = Game.snapshot(p)["state"] or ""
    print("4 alleyReturn=%s -> at" % ar, Game.name(p), "| state:", re.findall(r"(alleyReturn|sawAoifeMemory2|returns)(\w+)", st))
    p.close()
# 5
for seen in (False, True):
    seed = "(set: $afterMidnight to true)(set: $shipCall to \"\")(set: $enteredVenue to true)(set: $sawAoifeMemory2 to true)(set: $aoifeRework to false)"
    p = g.page("Turn to Copper" if seen else "Dean Street", seed)
    Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(1200)
    if seen:
        Game.click(p, "← Exit to the street", 1200); Game.clear_overlays(p); p.wait_for_timeout(800)
    st = Game.snapshot(p)["state"] or ""
    print("5 metCopper=%s at" % seen, Game.name(p), "| ring link:", p.evaluate("() => !![...document.querySelectorAll('tw-link')].find(e=>e.textContent.trim()==='The phone box' && (e.getAttribute('passage-name')||'')==='The Phone Box Rings')"), "| state:", re.findall(r"(afterMidnight|shipCall)(\w*)", st))
    p.close()
g.close()
