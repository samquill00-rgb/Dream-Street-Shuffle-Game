"""Drink route review walk. Run from repo root: PYTHONPATH=scratchpad/audit-2026-09-16 python3 scratchpad/review-2026-09-28/drink_walk.py OUT"""
import sys, os, json, re
import harness
from harness import Game
harness.STATE_VARS += ["drinksTonight","drinksRound","blackouts","lostToDrink","blackedOut","crossed","savedBy","lilyCount","pillarsNoAuto","metRed","tookLily4"]
harness.AUDIT_HEADER = ('\n<div id="audit-name">(print: (passage:)\'s name)</div>\n'
    '(link-repeat: "AUDIT READ")[<div id="audit-state">' + "".join('%s=(print: $%s);;' % (v, v) for v in harness.STATE_VARS) + '</div>]')
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
g = Game(); FAILS = []; LOG = []
def check(c, msg):
    print(('  ok   ' if c else '  FAIL ') + msg, flush=True); LOG.append(('ok' if c else 'FAIL', msg))
    if not c: FAILS.append(msg)
def st(p):
    s = Game.snapshot(p); d = {}
    for k in harness.STATE_VARS:
        m = re.search(r'(?:^|;;)%s=(.*?);;' % k, s["state"] or "")
        d[k] = m.group(1).strip() if m else None
    s["vars"] = d; return s
def num(v):
    try: return float(v)
    except: return None
def links(p): return p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].map(l => l.textContent.trim())")
def pink_links(p): return p.evaluate("() => [...document.querySelectorAll('tw-passage .claude-draft tw-link')].map(l => l.textContent.trim())")
def boot(target, seeds):
    p = g.page(target, seeds); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 700): break
        Game.clear_overlays(p)
    return p
def errs(p): return [e[:150] for e in p._errs if 'audio' not in e.lower()]

# ---- 1. Colony drinks via the street: the round resets on Dean Street, drinksTonight keeps counting ----
print("== Colony drinks, three sittings of one ==")
seed = '(set: $sobriety to 70)(set: $drinksRound to 0)(set: $drinksTonight to 0)(set: $blackouts to 0)(set: $lostToDrink to (a:))(set: $metDavy to true)(set: $knowsRonnies to true)(set: $visited\'s Colony to true)'
p = boot("Colony drink choice", seed); path = []
for i in range(3):
    Game.clear_overlays(p); L = links(p)
    check("One more" not in L and "Vodka tonic" in L, "sitting %d: full menu after the street reset the round (%s)" % (i+1, L))
    Game.click(p, "Vodka tonic", 900); Game.clear_overlays(p); s = st(p)
    path.append((s["at"], num(s["vars"]["sobriety"]), num(s["vars"]["drinksTonight"]), num(s["vars"]["drinksRound"])))
    check(s["at"] == "Colony drink" and num(s["vars"]["drinksTonight"]) == i+1, "drink %d counted: drinksTonight %s at %s" % (i+1, s["vars"]["drinksTonight"], s["at"]))
    check(not s["twErrors"], "no tw-error %s" % s["twErrors"])
    if i == 0: p.screenshot(path=OUT+"/colony-drink-1.png")
    if i < 2:
        Game.click(p, "Back to the street", 900); Game.clear_overlays(p)
        for _ in range(3):
            if not Game.click(p, "On.", 700): break
            Game.clear_overlays(p)
        Game.click(p, "Back to The Colony Room", 1200); Game.clear_overlays(p); p.wait_for_timeout(800)
        Game.click(p, "\u00b7", 1200); Game.clear_overlays(p)
        for _ in range(4):
            if Game.name(p) == "The Colony Room": break
            L = [l for l in links(p) if l != "AUDIT READ" and "Dean Street" not in l]
            if not L: break
            Game.click(p, L[0], 1200); Game.clear_overlays(p)
        p.wait_for_timeout(1500); Game.click(p, "Get a drink", 900); Game.clear_overlays(p)
        check(Game.name(p) == "Colony drink choice", "back at the menu via the street and the room (%s)" % Game.name(p))
print("colony path:", path); LOG.append(("info", "colony via street: %s" % path)); p.close()

# ---- 1b. A sitting at the Pillars: menu -> drink -> back to the bar, One more from the third, Blackout ----
print("== Pillars sitting from 70 ==")
p = boot("Entering The Pillars of Hercules", "(set: $sobriety to 70)(set: $drinksRound to 0)(set: $drinksTonight to 0)(set: $blackouts to 0)(set: $visited's Pillars to true)(set: $tookLily2 to true)(set: $pillarsNoAuto to true)(set: $inisToldOfPillars to false)(set: $dreamKey to \"\")(set: $hadPhoneCall to true)(set: $metCritic to true)(set: $pillarsVisits to 2)(set: $lostToDrink to (a:))")
p.wait_for_timeout(2000); Game.clear_overlays(p); path = []
for i in range(6):
    Game.clear_overlays(p)
    if not Game.click(p, "Get a drink at the bar", 1000): check(False, "Pillars offers Get a drink at the bar (links %s)" % links(p)); break
    Game.clear_overlays(p); L = links(p); PL = pink_links(p)
    if i >= 3: check(L and set(L) - {"AUDIT READ"} == {"One more"} and PL == ["One more"], "drink %d: single pink One more (%s)" % (i+1, L))
    else: check("Stout" in L and "One more" not in L, "drink %d: full menu (%s)" % (i+1, L))
    Game.click(p, "One more" if "One more" in L else "Stout", 1200); Game.clear_overlays(p); p.wait_for_timeout(1200); s = st(p)
    path.append((s["at"], num(s["vars"]["sobriety"]))); check(not s["twErrors"] and not errs(p), "no errors after drink %d %s %s" % (i+1, s["twErrors"], errs(p)))
    if s["at"] == "The Blackout": break
print("pillars path:", path)
check([x[1] for x in path] == [59, 44, 28, 15, 7], "Pillars sitting path 59, 44, 28, 15, 7: %s" % [x[1] for x in path])
check(path and path[-1][0] == "The Blackout", "fifth drink cuts to The Blackout (%s)" % (path and path[-1][0]))
if path and path[-1][0] == "The Blackout":
    s = st(p); check(num(s["vars"]["blackouts"]) == 1 and s["vars"]["drinksRound"] == "0", "Blackout: blackouts 1, round reset (%s %s)" % (s["vars"]["blackouts"], s["vars"]["drinksRound"]))
    p.screenshot(path=OUT+"/blackout-1.png"); Game.click(p, "Come to", 1200); Game.clear_overlays(p); s = st(p)
    check(s["at"] == "Coach and Horses lock", "Come to -> Coach and Horses lock (%s)" % s["at"]); L = links(p)
    check("Retch." in L and "Give up. Sleep here." in L, "first blackout offers Retch and Sleep: %s" % L)
    check(not s["twErrors"] and not errs(p), "no errors in the gents %s %s" % (s["twErrors"], errs(p))); p.screenshot(path=OUT+"/gents-first.png")
    Game.click(p, "Retch.", 1200); Game.clear_overlays(p); s = st(p)
    check(num(s["vars"]["sobriety"]) and num(s["vars"]["sobriety"]) > 7, "Retch gives sobriety back (%s)" % s["vars"]["sobriety"]); LOG.append(("info", "after Retch at %s links %s" % (s["at"], links(p))))
p.close()

# ---- 2. Second blackout: sleep only, into Alba Incomplete, then Dawn ----
print("== second blackout ==")
p = boot("Which drink at the French?", '(set: $sobriety to 11)(set: $drinksRound to 0)(set: $blackouts to 1)(set: $drinksTonight to 5)(set: $lostToDrink to (a: "lily4", "fetch"))(set: $lilyCount to 1)')
Game.click(p, "Claret", 900); Game.clear_overlays(p); s = st(p)
check(s["at"] == "The Blackout" and num(s["vars"]["blackouts"]) == 2, "French claret at 11 -> The Blackout, blackouts 2 (%s %s)" % (s["at"], s["vars"]["blackouts"]))
p.screenshot(path=OUT+"/blackout-2.png")
Game.click(p, "Come to", 1200); Game.clear_overlays(p); s = st(p); L = links(p)
check(s["at"] == "Coach and Horses lock" and "Retch." not in L and "Give up. Sleep here." in L and not any("gather your limbs" in l for l in L), "second time: sleep only, no Retch, no bar: %s" % L)
check("[Sam: the second time" in s["textSample"], "second-time pink line shows")
p.screenshot(path=OUT+"/gents-second.png")
Game.click(p, "Give up. Sleep here.", 1500); Game.clear_overlays(p); s = st(p)
check(s["at"] == "Alba Incomplete", "Sleep -> Alba Incomplete (%s)" % s["at"])
check("drinker's dawn" in s["textSample"], "drinker's pink paragraph in Alba Incomplete")
check(not s["twErrors"], "no tw-error %s" % s["twErrors"]); p.screenshot(path=OUT+"/alba-incomplete-drunk.png")
for _ in range(6):
    L = links(p)
    if not L: break
    Game.click(p, L[0], 1500); Game.clear_overlays(p)
    if Game.name(p) == "Dawn": break
s = st(p); check(s["at"] == "Dawn", "reaches Dawn (%s)" % s["at"])
txt = p.evaluate("() => document.body.innerText")
check(bool(re.search(r"lost to drink|LOST TO DRINK|Lost to drink", txt, re.I)) or p.evaluate("() => !!document.querySelector('.dawn-record .dawn-lost, .dawn-lost, [class*=lost]')"), "Dawn prints the lost-to-drink count")
p.wait_for_timeout(3000); p.screenshot(path=OUT+"/dawn-drunk.png", full_page=False)
check(not errs(p), "no JS errors to Dawn %s" % errs(p)); p.close()

# ---- 3. Lily under 30 in the Colony room; sober lily removes it ----
print("== drunk lily at the Colony room ==")
p = boot("The Colony Room", '(set: $sobriety to 20)(set: $tookLily4 to false)(set: $lilyCount to 0)(set: $lostToDrink to (a:))(set: $visited\'s Colony to true)(set: $metDavy to true)(set: $knowsRonnies to true)')
p.wait_for_timeout(2500); Game.clear_overlays(p)
ok = p.evaluate("() => { const h = document.querySelector('tw-hook[name=lily4]'); if(!h) return false; h.click(); return true; }"); p.wait_for_timeout(900)
check(ok, "lily4 hook clickable")
s = st(p); check("lily4" in (s["vars"]["lostToDrink"] or "") or "lily4" in (s["state"] or ""), "lily4 listed in lostToDrink (%s)" % s["state"][-200:])
check(num(s["vars"]["lilyCount"]) == 0 and s["vars"]["tookLily4"] == "false", "no flower counted (%s %s)" % (s["vars"]["lilyCount"], s["vars"]["tookLily4"]))
check(p.evaluate("() => !!document.querySelector('.lily-glimpse.claude-draft')"), "pink trace shown")
p.screenshot(path=OUT+"/lily-drunk-colony.png"); check(not s["twErrors"] and not errs(p), "no errors %s %s" % (s["twErrors"], errs(p))); p.close()
print("== sober lily removes it from the list ==")
p = boot("The Colony Room", '(set: $sobriety to 70)(set: $tookLily4 to false)(set: $lilyCount to 0)(set: $lostToDrink to (a: "lily4"))(set: $visited\'s Colony to true)(set: $metDavy to true)(set: $knowsRonnies to true)')
p.wait_for_timeout(2500); Game.clear_overlays(p)
p.evaluate("() => document.querySelector('tw-hook[name=lily4]').click()"); p.wait_for_timeout(1200)
s = st(p); check(num(s["vars"]["lilyCount"]) == 1 and "lily4" not in (s["vars"]["lostToDrink"] or ""), "lily taken, lily4 off the list (%s | %s)" % (s["vars"]["lilyCount"], s["vars"]["lostToDrink"])); p.close()

# ---- 4. Stranger under 30 ----
print("== stranger under 30 ==")
p = boot("The Fetch on Dean Street", '(set: $sobriety to 20)(set: $confidence to 50)(set: $lostToDrink to (a:))')
s = st(p); check("fetch" in (s["state"] or "") and num(s["vars"]["confidence"]) == 50, "Fetch lost, no morale (%s conf %s)" % (s["vars"]["lostToDrink"], s["vars"]["confidence"]))
check("thinned" in s["textSample"], "pink thinning line"); check(not s["twErrors"], "no tw-error"); p.close()
p = boot("The Fetch on Dean Street", '(set: $sobriety to 60)(set: $confidence to 50)(set: $lostToDrink to (a:))')
s = st(p); check(num(s["vars"]["confidence"]) == 60 and "fetch" not in (s["vars"]["lostToDrink"] or ""), "sober Fetch gives +10 (%s)" % s["vars"]["confidence"]); p.close()

# ---- 5. Third pillar under 30: The Wall ----
print("== The Wall ==")
p = boot("Entering The Pillars of Hercules", '(set: $sobriety to 20)(set: $inisToldOfPillars to true)(set: $dreamKey to "himalaya")(set: $pillarsNoAuto to false)(set: $visited\'s Pillars to true)(set: $tookLily2 to true)(set: $metCritic to true)(set: $hadPhoneCall to true)(set: $lostToDrink to (a:))(set: $pillarsVisits to 2)')
p.wait_for_timeout(2500); Game.clear_overlays(p); s = st(p)
check(s["at"] == "Entering The Pillars of Hercules", "no auto-crossing under 30 (%s)" % s["at"])
check("Step through the third pillar" in pink_links(p), "third pillar link is pink: %s" % pink_links(p))
check(p.evaluate("() => !!document.querySelector('tw-passage .pillars-scene .pillar.centre')"), "third pillar hook present for the room")
p.screenshot(path=OUT+"/pillars-drunk.png")
Game.click(p, "Step through the third pillar", 1200); Game.clear_overlays(p); s = st(p)
check(s["at"] == "The Wall", "-> The Wall (%s)" % s["at"])
check("pillar" in (s["vars"]["lostToDrink"] or "") and s["vars"]["dreamKey"] == 'himalaya', "pillar lost, key kept (%s %s)" % (s["vars"]["lostToDrink"], s["vars"]["dreamKey"]))
p.screenshot(path=OUT+"/the-wall.png")
Game.click(p, "Back to the bar", 1500); Game.clear_overlays(p); s = st(p)
check(s["at"] == "Entering The Pillars of Hercules" and not s["twErrors"], "back to the Pillars without crossing (%s %s)" % (s["at"], s["twErrors"]))
check(not errs(p), "no JS errors %s" % errs(p)); p.close()
print("== sober third pillar still crosses ==")
p = boot("Entering The Pillars of Hercules", '(set: $sobriety to 60)(set: $inisToldOfPillars to true)(set: $dreamKey to "himalaya")(set: $pillarsNoAuto to false)(set: $visited\'s Pillars to true)(set: $tookLily2 to true)(set: $metCritic to true)(set: $hadPhoneCall to true)(set: $pillarsVisits to 2)(set: $lostToDrink to (a: "pillar"))')
p.wait_for_timeout(1500); s = st(p); check(s["at"] == "Third Pillar Portal", "auto-crossing at 60 (%s)" % s["at"]); check("pillar" not in (s["vars"]["lostToDrink"] or "[]"), "pillar off the lost list when crossed (%s)" % s["vars"]["lostToDrink"]); p.close()

# ---- 6. Beaten / Standing drink lines, with a crossing (combination) ----
print("== cellar drunk with a crossing ==")
for res, link in (("defeat", "Try to get up"), ("victory", "Escape up the stairs")):
    p = boot("Turn to Copper", '(set: $sobriety to 20)(set: $haunts to (a: $haunt4))(set: $knowsCopperWord to false)(set: $metRed to true)(set: $crossed to "")')
    Game.clear_overlays(p); Game.click(p, "Give him Red's name", 900); Game.click(p, "Brace yourself", 900)
    p.wait_for_timeout(1500); p.evaluate("(id) => document.querySelector('#'+id+' tw-link').click()", "go-fight-"+res); p.wait_for_timeout(900)
    Game.click(p, link, 1200); Game.clear_overlays(p); s = st(p)
    check(s["at"] in ("Beaten", "Standing"), "%s -> %s" % (res, s["at"]))
    check(s["vars"]["crossed"] == 'red' and s["vars"]["savedBy"] == 'john', "crossed red, saved by john (%s %s)" % (s["vars"]["crossed"], s["vars"]["savedBy"]))
    n = s["textSample"].count("[Sam:"); check(n >= 2, "%s carries both the rescuer variant and the drink line (%d pink blocks)" % (s["at"], n))
    check(not s["twErrors"] and not errs(p), "no errors %s %s" % (s["twErrors"], errs(p)))
    p.screenshot(path=OUT+"/cellar-drunk-%s.png" % res); p.close()

# ---- 7. Notebook lost section, present and absent ----
print("== notebook ==")
def notebook(p):
    p.wait_for_timeout(800)
    p.evaluate("() => { const b=[...document.querySelectorAll('tw-link, button, a, div')].find(e=>/NOTEBOOK/i.test(e.textContent.trim()) && e.textContent.trim().length<20); if(b) b.click(); }")
    p.wait_for_timeout(900); return p.evaluate("() => document.body.innerText")
p = boot("Dean Street", '(set: $lostToDrink to (a: "lily4", "fetch", "pillar"))'); t = notebook(p)
check("LOST TO DRINK" in t and "the flower at the Colony" in t and "the Fetch" in t and "the third pillar" in t, "notebook lists the three losses"); p.screenshot(path=OUT+"/notebook-lost.png"); p.close()
p = boot("Dean Street", '(set: $lostToDrink to (a:))'); t = notebook(p)
check("LOST TO DRINK" not in t, "notebook hides the section when nothing lost"); p.close()

# ---- 8. Dual ring counts a blackout ----
print("== dual ring ==")
p = boot("The dual ring", '(set: $sobriety to 40)(set: $blackouts to 0)(set: $hadDualRing to false)')
p.wait_for_timeout(16500); Game.clear_overlays(p)
ok = p.evaluate("() => { const l=[...document.querySelectorAll('tw-link')].find(l=>l.textContent.trim()==='Hang up.'); if(l){l.click(); return true;} return false; }"); p.wait_for_timeout(1500); Game.clear_overlays(p)
s = st(p); check(ok and num(s["vars"]["blackouts"]) == 1 and num(s["vars"]["sobriety"]) == 8, "Hang up: blackouts 1, sobriety 8 (%s %s at %s)" % (s["vars"]["blackouts"], s["vars"]["sobriety"], s["at"]))
LOG.append(("info", "after dual ring at %s links %s" % (s["at"], links(p)))); p.close()

# ---- 9. Header back-fill from an old save ----
print("== header back-fill ==")
p = boot("Dean Street", '(set: $crossed to 0)(set: $savedBy to 0)(set: $drinksTonight to "x")(set: $blackouts to "x")(set: $lostToDrink to 0)(set: $blackedOut to 0)')
s = st(p); check(s["vars"]["crossed"] == '' and s["vars"]["drinksTonight"] == "0" and s["vars"]["blackouts"] == "0" and not s["twErrors"], "header repairs the five new variables (%s)" % {k: s["vars"][k] for k in ("crossed","savedBy","drinksTonight","blackouts","lostToDrink","blackedOut")}); p.close()

g.close()
json.dump(LOG, open(OUT+"/log.json","w"), indent=1)
print("FAILS", len(FAILS)); [print("  -", f) for f in FAILS]
