"""Re-walk of the drink-route checks whose first reading was a walker fault. PYTHONPATH=scratchpad/audit-2026-09-16 python3 drink_walk2.py OUT"""
import sys, os, json, re
import harness
from harness import Game
harness.STATE_VARS += ["drinksTonight","drinksRound","blackouts","lostToDrink","blackedOut","crossed","savedBy","lilyCount","pillarsNoAuto"]
harness.AUDIT_HEADER = ('\n<div id="audit-name">(print: (passage:)\'s name)</div>\n(link-repeat: "AUDIT READ")[<div id="audit-state">' + "".join('%s=(print: $%s);;' % (v, v) for v in harness.STATE_VARS) + '</div>]')
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
g = Game(); FAILS = []; LOG = []
def check(c, msg):
    print(('  ok   ' if c else '  FAIL ') + msg, flush=True); LOG.append(('ok' if c else 'FAIL', msg))
    if not c: FAILS.append(msg)
def st(p):
    s = Game.snapshot(p); d = {}
    for k in harness.STATE_VARS:
        m = re.search(r'(?:^|;;)%s=(.*?);;' % k, s["state"] or ""); d[k] = m.group(1).strip() if m else None
    s["vars"] = d
    s["text"] = p.evaluate("() => { const t = document.querySelector('tw-passage'); if (!t) return ''; const c = t.cloneNode(true); c.querySelectorAll('#audit-state, #audit-name').forEach(e => e.remove()); return c.innerText; }")
    s["pink"] = p.evaluate("() => [...document.querySelectorAll('tw-passage .claude-draft')].filter(e => e.offsetParent !== null).map(e => e.innerText.slice(0, 80))")
    return s
def num(v):
    try: return float(v)
    except: return None
def links(p): return [l for l in p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].map(l => l.textContent.trim())") if l != "AUDIT READ"]
def boot(target, seeds):
    p = g.page(target, seeds); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 700): break
        Game.clear_overlays(p)
    return p
def errs(p): return [e[:150] for e in p._errs if 'audio' not in e.lower()]

print("== first blackout: Retch, then the bar ==")
p = boot("The Blackout", '(set: $sobriety to 7)(set: $blackouts to 0)(set: $drinksTonight to 5)')
Game.click(p, "Come to", 1200); Game.clear_overlays(p); Game.click(p, "Retch.", 1200); Game.clear_overlays(p)
Game.click(p, "You gather your limbs to the bar.", 1200); Game.clear_overlays(p); s = st(p)
check(s["at"] == "Coach and Horses bar" and num(s["vars"]["sobriety"]) and num(s["vars"]["sobriety"]) > 20, "Retch then bar: sobriety back (%s at %s)" % (s["vars"]["sobriety"], s["at"]))
check(not s["twErrors"] and not errs(p), "no errors %s %s" % (s["twErrors"], errs(p))); p.close()

print("== second blackout: gents line, Alba Incomplete, Dawn ==")
p = boot("Which drink at the French?", '(set: $sobriety to 11)(set: $drinksRound to 0)(set: $blackouts to 1)(set: $drinksTonight to 5)(set: $lostToDrink to (a: "lily4", "fetch"))(set: $lilyCount to 1)')
Game.click(p, "Claret", 900); Game.clear_overlays(p); Game.click(p, "Come to", 1200); Game.clear_overlays(p); s = st(p)
check(s["at"] == "Coach and Horses lock" and any("the second time" in x for x in s["pink"]), "second-time pink line shows: %s" % s["pink"])
Game.click(p, "Give up. Sleep here.", 1500); Game.clear_overlays(p); s = st(p)
check(s["at"] == "Alba Incomplete" and any("drinker's dawn" in x for x in s["pink"]), "Alba Incomplete with the drinker's paragraph: %s" % s["pink"])
p.screenshot(path=OUT+"/alba-incomplete-drunk.png")
for _ in range(6):
    L = links(p)
    if not L: break
    Game.click(p, L[0], 2000); Game.clear_overlays(p)
    if Game.name(p) == "Dawn": break
s = st(p); check(s["at"] == "Dawn", "reaches Dawn (%s, links were %s)" % (s["at"], links(p)))
p.wait_for_timeout(4000)
rec = p.evaluate("() => { const r = document.querySelector('#dawn-record'); return r ? r.innerText : null; }")
lost = p.evaluate("() => [...document.querySelectorAll('.dawn-record *')].map(e => e.className).filter(c => /lost|drink/i.test(c))")
check(rec is not None and (lost or re.search(r'2', rec or '')), "Dawn record carries the lost count (record: %r classes %s)" % (rec, lost))
LOG.append(("info", "dawn record: %r" % rec)); p.screenshot(path=OUT+"/dawn-drunk.png"); check(not errs(p), "no JS errors %s" % errs(p)); p.close()

print("== The Wall with a real key ==")
seed = '(set: $sobriety to 20)(set: $inisToldOfPillars to true)(set: $dreamKey to "ticket")(set: $keyTicket to "held")(set: $pillarsNoAuto to false)(set: $visited\'s Pillars to true)(set: $tookLily2 to true)(set: $metCritic to true)(set: $hadPhoneCall to true)(set: $lostToDrink to (a:))(set: $pillarsVisits to 2)'
p = boot("Entering The Pillars of Hercules", seed); p.wait_for_timeout(2500); Game.clear_overlays(p); s = st(p)
check(s["at"] == "Entering The Pillars of Hercules" and not s["twErrors"], "no auto-crossing under 30, no error (%s %s)" % (s["at"], s["twErrors"]))
check(p.evaluate("() => !!document.querySelector('tw-passage .pillars-scene .pillar.centre')"), "third pillar hook present for the room")
shown = p.evaluate("() => { const e = window._dssThreeRegistry && window._dssThreeRegistry['pi-wrap']; return e ? 'room' : 'no-room'; }"); LOG.append(("info", "pillars room registry: %s" % shown))
p.screenshot(path=OUT+"/pillars-drunk.png")
Game.click(p, "Step through the third pillar", 1200); Game.clear_overlays(p); s = st(p)
check(s["at"] == "The Wall" and "pillar" in (s["vars"]["lostToDrink"] or "") and s["vars"]["dreamKey"] == "ticket", "The Wall: pillar lost, key kept (%s %s %s)" % (s["at"], s["vars"]["lostToDrink"], s["vars"]["dreamKey"]))
p.screenshot(path=OUT+"/the-wall.png"); Game.click(p, "Back to the bar", 1500); Game.clear_overlays(p); p.wait_for_timeout(1500); s = st(p)
check(s["at"] == "Entering The Pillars of Hercules" and not s["twErrors"] and not errs(p), "back to the Pillars, no crossing, no errors (%s %s %s)" % (s["at"], s["twErrors"], errs(p)))
check("Step through the third pillar" in links(p), "third pillar still offered after the Wall"); p.close()

print("== cellar drunk with a crossing ==")
for res, link in (("defeat", "Try to get up"), ("victory", "Escape up the stairs")):
    p = boot("Turn to Copper", '(set: $sobriety to 20)(set: $haunts to (a: $haunt4))(set: $knowsCopperWord to false)(set: $metRed to true)(set: $crossed to "")')
    Game.clear_overlays(p); Game.click(p, "Give him Red's name", 900); Game.click(p, "Brace yourself", 900)
    p.wait_for_timeout(1500); p.evaluate("(id) => document.querySelector('#'+id+' tw-link').click()", "go-fight-"+res); p.wait_for_timeout(900)
    Game.click(p, link, 1200); Game.clear_overlays(p); s = st(p)
    drink = [x for x in s["pink"] if "cellar floor" in x or "bolt drunk" in x]; resc = [x for x in s["pink"] if x not in drink]
    check(s["at"] in ("Beaten", "Standing") and drink and resc, "%s: drink line %d, rescuer/other pink %d at %s: %s" % (res, len(drink), len(resc), s["at"], s["pink"]))
    check(not s["twErrors"] and not errs(p), "no errors %s %s" % (s["twErrors"], errs(p))); p.screenshot(path=OUT+"/cellar-drunk-%s.png" % res); p.close()

print("== notebook ==")
def notebook(p):
    p.wait_for_timeout(800)
    ok = p.evaluate("() => { const b=[...document.querySelectorAll('tw-link, button, a, div, span')].find(e=>/^NOTEBOOK$/i.test(e.textContent.trim())); if(b){ b.click(); return true;} return false; }")
    p.wait_for_timeout(1200)
    return ok, p.evaluate("() => { const els = [...document.querySelectorAll('.nb-section, .nb-item, .nb-heading, .nb-lost, .nb-grey')]; return els.map(e => e.textContent.trim().slice(0,60)); }"), p.evaluate("() => [...document.querySelectorAll('[class*=nb-tab], [class*=notebook-tab]')].map(e => e.textContent.trim())")
p = boot("Dean Street", '(set: $lostToDrink to (a: "lily4", "fetch", "pillar"))(set: $crossed to "john")(set: $haunts to (a: $haunt4))'); ok, items, tabs = notebook(p)
LOG.append(("info", "notebook opened %s tabs %s items %s" % (ok, tabs, items[:40])))
check(ok and any("LOST TO DRINK" in i for i in items) and any("the flower at the Colony" in i for i in items) and any("the Fetch" in i for i in items) and any("the third pillar" in i for i in items), "notebook lists the three losses (%s)" % [i for i in items if "LOST" in i or "flower" in i or "Fetch" in i or "pillar" in i])
check(any("sold" in i for i in items), "notebook marks the Debt as sold: %s" % [i for i in items if "Debt" in i or "sold" in i])
p.screenshot(path=OUT+"/notebook-lost.png"); p.close()
g.close(); json.dump(LOG, open(OUT+"/log2.json","w"), indent=1)
print("FAILS", len(FAILS)); [print("  -", f) for f in FAILS]
