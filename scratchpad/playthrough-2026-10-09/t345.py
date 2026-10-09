import sys; sys.path.insert(0, "scratchpad/audit-2026-09-16")
from harness import Game
g = Game()
def links(p): return [t for t in Game.snapshot(p)["links"] if t]
def errs(p): return p.evaluate("() => [...document.querySelectorAll('tw-error')].map(e => e.textContent.slice(0,120))")
# 3. Seek the shore
for mc in ("false", "true"):
    p = g.page("Maritime interlude", "(set: $pillarsVisits to 2)(set: $metCritic to %s)" % mc)
    Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(600)
    print("3 metCritic=%s" % mc, "Seek the shore shown:", "Seek the shore" in links(p), errs(p))
    p.close()
# 4. Aoife memory 2 vs a doorway return
SEED4 = "(set: $aoifeRework to true)(set: $returns to 5)(set: $sawAoifeReflection to true)(set: $sawAoifeMemory2 to false)(set: $hadPhoneCall to true)(set: $metCritic to true)"
for ar in ("true", "false"):
    p = g.page("Dean Street", SEED4 + "(set: $alleyReturn to %s)" % ar)
    Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(1200)
    print("4 alleyReturn=%s" % ar, "-> at", Game.name(p), errs(p))
    p.close()
# 5. phone box only after Copper
for seen in (False, True):
    seed = "(set: $afterMidnight to true)(set: $shipCall to \"\")(set: $enteredVenue to true)"
    p = g.page("Turn to Copper" if seen else "Dean Street", seed)
    Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(1200)
    if seen:
        Game.click(p, "← Exit to the street", 1200); Game.clear_overlays(p); p.wait_for_timeout(800)
    st = p.evaluate("() => { const d=window.dssSohoMap&&window.dssSohoMap.state; return d&&d.doors? (d.doors.phonebox||{}).status : (document.querySelector('.soho-hub-dock tw-link[passage-name=\"The Phone Box Rings\"]')?'link':'nolink'); }")
    print("5 metCopper=%s" % seen, "at", Game.name(p), "| ring link in dock:", p.evaluate("() => !![...document.querySelectorAll('tw-link')].find(e=>e.textContent.trim()==='The phone box' && (e.getAttribute('passage-name')||'')==='The Phone Box Rings')"), "| map:", st, errs(p))
    p.close()
g.close()
