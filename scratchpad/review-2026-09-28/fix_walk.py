"""Walk of the three review fixes. PYTHONPATH=scratchpad/audit-2026-09-16 python3 fix_walk.py OUT"""
import sys, os, re
import harness; from harness import Game
harness.STATE_VARS += ["drinksTonight","drinksRound","blackouts","lostToDrink"]
harness.AUDIT_HEADER = ('\n<div id="audit-name">(print: (passage:)\'s name)</div>\n(link-repeat: "AUDIT READ")[<div id="audit-state">' + "".join('%s=(print: $%s);;' % (v, v) for v in harness.STATE_VARS) + '</div>]')
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True); g = Game(); FAILS = []
def check(c, m):
    print(('  ok   ' if c else '  FAIL ') + m, flush=True)
    if not c: FAILS.append(m)
def st(p):
    s = Game.snapshot(p); s["vars"] = {k: (re.search(r'(?:^|;;)%s=(.*?);;' % k, s["state"] or "") or [None, None])[1] for k in harness.STATE_VARS}; return s
def links(p): return [l for l in p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].map(l => l.textContent.trim())") if l != "AUDIT READ"]
def pink(p): return p.evaluate("() => [...document.querySelectorAll('tw-passage .claude-draft tw-link')].map(l => l.textContent.trim())")
def boot(t, s):
    p = g.page(t, s); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 700): break
        Game.clear_overlays(p)
    return p
def errs(p): return [e[:160] for e in p._errs if 'audio' not in e.lower() and 'textContent' not in e]

print("== 1. a sitting at the Colony ==")
p = boot("Colony drink choice", "(set: $sobriety to 70)(set: $drinksRound to 0)(set: $drinksTonight to 0)(set: $blackouts to 0)(set: $metDavy to true)(set: $knowsRonnies to true)(set: $visited's Colony to true)")
path = []
for i in range(6):
    Game.clear_overlays(p); L = links(p)
    if i >= 3: check(set(L) == {"One more"} and pink(p) == ["One more"], "drink %d: single pink One more (%s)" % (i+1, L))
    else: check("Vodka tonic" in L, "drink %d: full menu (%s)" % (i+1, L))
    Game.click(p, "One more" if "One more" in L else "Vodka tonic", 1000); Game.clear_overlays(p); s = st(p); path.append((s["at"], s["vars"]["sobriety"]))
    check(not s["twErrors"], "no tw-error %s" % s["twErrors"])
    if s["at"] == "The Blackout": break
    check(s["at"] == "Colony drink" and "Sam: another" in pink(p) and "Back to the street" in links(p), "Colony drink offers the pink link back and the street (%s %s)" % (s["at"], links(p)))
    if i == 0: p.screenshot(path=OUT + "/colony-drink-another.png")
    Game.click(p, "Sam: another", 900); Game.clear_overlays(p); check(Game.name(p) == "Colony drink choice", "pink link returns to the menu (%s)" % Game.name(p))
print("colony path:", path); check([x[1] for x in path] == ["59", "44", "28", "15", "7"] and path[-1][0] == "The Blackout", "Colony sitting 59, 44, 28, 15, 7 then The Blackout")
check(not errs(p), "no JS errors %s" % errs(p)); p.close()

print("== 2. the round carried across the street: Colony, French, Pillars ==")
p = boot("Colony drink choice", "(set: $sobriety to 70)(set: $drinksRound to 0)(set: $drinksTonight to 0)(set: $blackouts to 0)(set: $metDavy to true)(set: $knowsRonnies to true)(set: $visited's Colony to true)(set: $visited's French to true)(set: $visited's FrenchVisits to 3)(set: $frenchApproached to true)(set: $haunts to (a:))(set: $tookLily5 to true)(set: $tookLily4 to true)(set: $tookLily2 to true)(set: $visited's Pillars to true)(set: $metCritic to true)(set: $hadPhoneCall to true)(set: $pillarsVisits to 2)(set: $inisToldOfPillars to false)")
Game.click(p, "Vodka tonic", 1000); Game.clear_overlays(p); Game.click(p, "Sam: another", 900); Game.clear_overlays(p); Game.click(p, "Champagne", 1000); Game.clear_overlays(p); s = st(p)
check(s["vars"]["drinksRound"] == "2" and s["vars"]["sobriety"] == "44", "two Colony drinks: round 2, sobriety 44 (%s %s)" % (s["vars"]["drinksRound"], s["vars"]["sobriety"]))
Game.click(p, "Back to the street", 1000); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 700): break
    Game.clear_overlays(p)
s = st(p); check(s["at"] == "Dean Street" and s["vars"]["drinksRound"] == "2", "Dean Street keeps the round at 2 (%s %s)" % (s["at"], s["vars"]["drinksRound"]))
Game.click(p, "To The French", 1200); Game.clear_overlays(p)
for _ in range(5):
    if Game.name(p) == "The French": break
    L = [l for l in links(p) if "Dean Street" not in l]
    if not L: break
    Game.click(p, L[0], 1200); Game.clear_overlays(p)
p.wait_for_timeout(1500); Game.clear_overlays(p); s = st(p); print("  at", s["at"], "sobriety", s["vars"]["sobriety"], "round", s["vars"]["drinksRound"], "links", links(p))
ok = Game.click(p, "Get a drink at the bar", 1200); Game.clear_overlays(p); L = links(p)
check(ok and "Beaujolais" in L and "One more" not in L, "third drink of the night at the French: full menu still (%s)" % L)
Game.click(p, "Beaujolais", 1200); Game.clear_overlays(p); p.wait_for_timeout(1200); s = st(p)
check(s["vars"]["drinksRound"] == "3", "round 3 after the French drink (sobriety %s)" % s["vars"]["sobriety"])
Game.click(p, "Get a drink at the bar", 1200); Game.clear_overlays(p); L = links(p)
check(L == ["One more"], "fourth drink of the night at the French is One more (%s)" % L); p.screenshot(path=OUT + "/french-one-more-after-colony.png")
Game.click(p, "One more", 1200); Game.clear_overlays(p); p.wait_for_timeout(1200); s = st(p); print("  after fourth:", s["at"], s["vars"]["sobriety"])
Game.click(p, "Get a drink at the bar", 1200); Game.clear_overlays(p); Game.click(p, "One more", 1500); Game.clear_overlays(p); s = st(p)
check(s["at"] == "The Blackout" and s["vars"]["blackouts"] == "1" and s["vars"]["drinksRound"] == "0", "fifth drink of the night blacks out at the French (%s sobriety %s)" % (s["at"], s["vars"]["sobriety"]))
check(not s["twErrors"] and not errs(p), "no errors %s %s" % (s["twErrors"], errs(p))); p.close()

print("== 3. the Pillars room shows the third pillar once Inis has told you ==")
for told, want in ((True, 0.92), (False, 0.14)):
    p = boot("Entering The Pillars of Hercules", '(set: $sobriety to 60)(set: $inisToldOfPillars to %s)(set: $dreamKey to "")(set: $pillarsNoAuto to false)(set: $visited\'s Pillars to true)(set: $tookLily2 to true)(set: $metCritic to true)(set: $hadPhoneCall to true)(set: $pillarsVisits to 2)(set: $sawThirdPillar to false)' % ("true" if told else "false"))
    for _ in range(40):
        if p.evaluate("() => !!document.querySelector('#pi-wrap canvas') && document.getElementById('pi-wrap').dataset.cam === 'idle'"): break
        p.wait_for_timeout(250)
    p.wait_for_timeout(1500)
    ops = p.evaluate("() => { const e = window._dssThreeRegistry && window._dssThreeRegistry['pi-wrap']; if(!e) return null; const c = {}; e.scene.traverse(o => { if (o.material && o.material.transparent && o.material.bumpMap && o.material.map === o.material.bumpMap) c[o.material.opacity] = (c[o.material.opacity]||0)+1; }); return c; }")
    fs = p.evaluate("() => !!document.querySelector('tw-passage .pillar.centre.first-sight')")
    print("  told", told, "stone opacities", ops, "first-sight", fs)
    check(ops and str(want) in [str(k) for k in ops.keys()] and (told or "0.92" not in ops), "third pillar %s (opacities %s)" % ("solid" if told else "ghost", ops))
    if told: check(fs, "first-sight class added by the script")
    check(not errs(p), "no JS errors %s" % errs(p)); p.screenshot(path=OUT + "/pillars-told-%s.png" % told); p.close()
g.close(); print("FAILS", len(FAILS)); [print("  -", f) for f in FAILS]
