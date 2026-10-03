"""Walk of the 3 October rulings: windows cost/give, Coach fire on to Dawn, Lackland caption.
PYTHONPATH=scratchpad/audit-2026-09-16 python3 walk.py OUT"""
import sys, os, re
import harness; from harness import Game
harness.STATE_VARS += ["blackouts","lostToDrink","brokenWindows","coachFireChance","coachBurnt","confidence","sobriety"]
harness.AUDIT_HEADER = ('\n<div id="audit-name">(print: (passage:)\'s name)</div>\n(link-repeat: "AUDIT READ")[<div id="audit-state">' + "".join('%s=(print: $%s);;' % (v, v) for v in harness.STATE_VARS) + '</div>]')
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
g = Game(width=1280, height=900)
FAILS = []
def check(c, m):
    print(('  ok   ' if c else '  FAIL ') + m, flush=True)
    if not c: FAILS.append(m)
def st(p):
    s = Game.snapshot(p); return {k: (re.search(r'(?:^|;;)%s=(.*?);;' % k, s["state"] or "") or [None, None])[1] for k in harness.STATE_VARS}
def errs(p): return [e[:200] for e in p._errs if 'audio' not in e.lower()]
def boot(t, s):
    p = g.page(t, s); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 700): break
        Game.clear_overlays(p)
    return p
def to_dean(p):
    for _ in range(3):
        if Game.name(p) == "Dean Street": break
        if not Game.click(p, "On.", 800): break
        Game.clear_overlays(p)
    Game.clear_overlays(p)
    for _ in range(40):
        if p.evaluate("() => !!document.querySelector('.soho-map-stage canvas')"): break
        p.wait_for_timeout(250)
    p.wait_for_timeout(600)
DRUNK = "(set: $sobriety to 25)(set: $blackouts to 1)(set: $drinksTonight to 5)(set: $hasMatches to true)(set: $matchesLeft to 3)(set: $hutBurnt to false)(set: $lostToDrink to (a: 'lily2'))(set: $confidence to 60)"

print("== WINDOWS ==")
p = boot("Dean Street", DRUNK); to_dean(p); check(Game.name(p) == "Dean Street", "on Dean Street")
# the audit readout is stale inside a passage after a link sets a variable, so leave and read on the next passage
def smash(p, rounds):
    for wid,c,r in rounds:
        p.evaluate("([c,r]) => window.__dssSohoTeleport(c,r)", [c,r]); p.wait_for_timeout(1200)
        p.keyboard.press("e"); p.wait_for_timeout(900)
    got = p.evaluate("() => [...document.querySelectorAll('[data-window-broken]')].map(e=>e.dataset.windowBroken)")
    check(all(w in got for w,_,_ in rounds), "panes broken in the DOM %s" % got)
def leave_and_read(p):
    Game.click(p, "Soho Square", 1200); Game.clear_overlays(p); v = st(p); return v
smash(p, [("dean-north",16,9),("frith",28,19),("dean-west",16,18)])
v = leave_and_read(p); check(v["confidence"] == "62", "take 5, give 5, take 5: confidence 60 -> 55, then the square bench once +7 = 62 (%s)" % v["confidence"]); check((v["brokenWindows"] or "").count(",") == 2, "three windows recorded (%s)" % v["brokenWindows"])
Game.click(p, "Back to Dean Street", 1000) or Game.click(p, "Back to the street", 1000); to_dean(p); check(Game.name(p) == "Dean Street", "back on Dean Street")
smash(p, [("greek",43,20),("dean-east",19,33),("romilly",34,34)])
p.evaluate("([c,r]) => window.__dssSohoTeleport(c,r)", [16,9]); p.wait_for_timeout(900); p.keyboard.press("e"); p.wait_for_timeout(600)
v = leave_and_read(p); check(v["confidence"] == "67", "give, take, give, then a dead press: 62 -> 67, bench not repeated (%s)" % v["confidence"]); check((v["brokenWindows"] or "").count(",") == 5, "six windows recorded (%s)" % v["brokenWindows"])
check(not errs(p), "no JS errors %s" % errs(p)); p.screenshot(path=OUT+"/windows-map.png"); p.close()

print("== COACH FIRE ON TO DAWN ==")
CO = DRUNK + "(set: $coachFireChance to true)(set: $coachBurnt to false)(set: $visitedCentrePoint to false)"
p = boot("The Coach Burns", CO); p.wait_for_timeout(2500)
check(Game.name(p) == "The Coach Burns", "at The Coach Burns (%s)" % Game.name(p))
v = st(p); check(v["confidence"] == "30", "confidence 60 -> 30 flat (%s)" % v["confidence"]); check("coach" in (v["lostToDrink"] or ""), "coach in lostToDrink (%s)" % v["lostToDrink"])
p.wait_for_timeout(6000); p.screenshot(path=OUT+"/coach-fire.png")
ok = p.evaluate("() => { const e = document.querySelector('tw-passage [data-coach-fire-end] tw-link'); if (!e) return false; e.click(); return true; }")
check(ok, "fire exit link clicked")
for _ in range(30):
    if Game.name(p) == "Coach Fire Ending": break
    p.wait_for_timeout(500)
check(Game.name(p) == "Coach Fire Ending", "reached Coach Fire Ending (%s)" % Game.name(p))
p.wait_for_timeout(2500); p.screenshot(path=OUT+"/coach-ending.png")
links = p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].map(l => l.textContent.trim())")
check(any("on towards dawn" in l for l in links), "pink link on towards dawn present %s" % links)
check(not p.evaluate("() => !!document.querySelector('tw-passage button.claude-draft')"), "restart button gone")
Game.click(p, "[Sam: on towards dawn]", 1500) or p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].find(l => /on towards dawn/.test(l.textContent)).click()"); p.wait_for_timeout(1500)
check(Game.name(p) == "Alba Incomplete", "on to Alba Incomplete (%s)" % Game.name(p))
links = p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].map(l => l.textContent.trim())")
check("Traveller, sleep!" in links, "Alba Incomplete offers Traveller, sleep! %s" % links)
p.screenshot(path=OUT+"/alba-incomplete.png")
check(not errs(p), "no JS errors %s" % errs(p)); p.close()

print("== LACKLAND CAPTION ==")
p = boot("Approach Lacklands Office", ""); p.wait_for_timeout(5000)
txt = p.evaluate("() => document.body.innerText")
check("FRITH STREET" in txt and "WARDOUR STREET" not in txt, "caption says Frith (%s)" % [l for l in txt.split('\n') if 'LACKLAND' in l][:2])
p.screenshot(path=OUT+"/lackland-approach.png"); check(not errs(p), "no JS errors %s" % errs(p)); p.close()
g.close()
print("FAILS", len(FAILS)); [print("  -", f) for f in FAILS]
