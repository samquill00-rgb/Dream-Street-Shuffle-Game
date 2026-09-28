"""Combination routes: blackout out of the French room's menu; drunk lily inside the French room. PYTHONPATH=scratchpad/audit-2026-09-16"""
import sys, os, re
import harness; from harness import Game
harness.STATE_VARS += ["drinksTonight","blackouts","lostToDrink","lilyCount"]
harness.AUDIT_HEADER = ('\n<div id="audit-name">(print: (passage:)\'s name)</div>\n(link-repeat: "AUDIT READ")[<div id="audit-state">' + "".join('%s=(print: $%s);;' % (v, v) for v in harness.STATE_VARS) + '</div>]')
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True); g = Game(); FAILS = []
def check(c, m):
    print(('  ok   ' if c else '  FAIL ') + m, flush=True)
    if not c: FAILS.append(m)
def var(p, k):
    s = Game.snapshot(p); m = re.search(r'(?:^|;;)%s=(.*?);;' % k, s["state"] or ""); return (s, m.group(1) if m else None)
def errs(p): return [e[:160] for e in p._errs if 'audio' not in e.lower()]
def room(p, wrap):
    for _ in range(40):
        if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle'", wrap): return True
        p.wait_for_timeout(250)
    return False
seed = "(set: $sobriety to 11)(set: $drinksRound to 0)(set: $drinksTonight to 4)(set: $blackouts to 0)(set: $visited's FrenchVisits to 3)(set: $frenchApproached to true)(set: $haunts to (a:))(set: $tookLily5 to true)(set: $lostToDrink to (a:))"
print("== blackout out of the French room ==")
p = g.page("The French", seed); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p)
check(room(p, "fi-wrap"), "French room mounted"); p.wait_for_timeout(1000)
reg_before = p.evaluate("() => Object.keys(window._dssThreeRegistry || {})")
Game.click(p, "Get a drink at the bar", 1200); Game.clear_overlays(p)
check(Game.name(p) == "Which drink at the French?", "menu reached (%s)" % Game.name(p))
Game.click(p, "Claret", 1500); Game.clear_overlays(p); s, b = var(p, "blackouts")
check(s["at"] == "The Blackout" and b == "1", "Claret at 11 -> The Blackout (%s %s)" % (s["at"], b))
p.wait_for_timeout(1500)
canv = p.evaluate("() => document.querySelectorAll('canvas').length"); wraps = p.evaluate("() => !!document.getElementById('fi-wrap')"); reg = p.evaluate("() => Object.keys(window._dssThreeRegistry || {})")
check(not wraps, "French room wrapper gone after the cut (fi-wrap present: %s, canvases %d, registry before %s after %s)" % (wraps, canv, reg_before, reg))
check(not s["twErrors"] and not errs(p), "no errors %s %s" % (s["twErrors"], errs(p)))
p.screenshot(path=OUT+"/french-room-blackout.png"); p.close()
print("== drunk lily in the French room ==")
p = g.page("The French", "(set: $sobriety to 20)(set: $tookLily5 to false)(set: $lilyCount to 0)(set: $lostToDrink to (a:))(set: $visited's FrenchVisits to 2)(set: $frenchApproached to true)(set: $haunts to (a:))"); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p)
check(room(p, "fi-wrap"), "French room mounted"); p.wait_for_timeout(1000)
ok = p.evaluate("() => { const h = document.querySelector('tw-hook[name=lily5]'); if(!h) return false; h.scrollIntoView(); h.click(); return true; }"); p.wait_for_timeout(1200)
s, lost = var(p, "lostToDrink"); _, lc = var(p, "lilyCount")
check(ok and "lily5" in (lost or "") and lc == "0", "lily5 traced not taken (hook %s lost %s count %s)" % (ok, lost, lc))
check(p.evaluate("() => !!document.querySelector('tw-passage .lily-glimpse.claude-draft')"), "pink trace under the room")
check(p.evaluate("() => !!document.querySelector('#fi-wrap canvas')") and not errs(p), "room still alive, no errors %s" % errs(p))
p.screenshot(path=OUT+"/french-room-drunk-lily.png"); p.close(); g.close()
print("FAILS", len(FAILS)); [print("  -", f) for f in FAILS]
