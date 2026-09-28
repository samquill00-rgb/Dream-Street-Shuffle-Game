import sys, json, re
sys.path.insert(0, "scratchpad/audit-2026-09-16")
import harness as H
from harness import Game
H.STATE_VARS += ["blackouts","drinksTonight","lostToDrink","lilyCount","drinksRound"]
H.AUDIT_HEADER = ('\n<div id="audit-name">(print: (passage:)\'s name)</div>\n'
    '(link-repeat: "AUDIT READ")[<div id="audit-state">(print: (dm: '
    + ",".join('"%s", $%s' % (v, v) for v in H.STATE_VARS) + '))</div>]')
OUT = "scratchpad/drink-route-2026-09-28/"
g = Game()
rep = []
def st(p):
    s = Game.snapshot(p); d = {}
    for k in H.STATE_VARS:
        m = re.search(r'%s[`<>/a-z]*?(-?\d+)' % k, s["state"] or "")
        if m: d[k] = int(m.group(1))
    s["st"] = d; return s
def go(p, txt, w=900):
    ok = Game.click(p, txt, w); assert ok, ("no link", txt, Game.snapshot(p)["links"]); Game.clear_overlays(p)
def check(label, cond, detail=""):
    rep.append((label, "ok" if cond else "FAIL", detail)); print(label, "ok" if cond else "FAIL", detail)

# A. five drinks at the French to the first blackout, then Retch
p = g.page("The French", seeds="(set: $visited's FrenchVisits to 2)"); Game.clear_overlays(p)
s = st(p); check("A0 French drink link", "Get a drink at the bar" in s["links"], s["st"])
sob = [s["st"]["sobriety"]]
menus = []
for i in range(6):
    go(p, "Get a drink at the bar"); s = st(p); menus.append(s["links"])
    if i == 3: p.screenshot(path=OUT+"A-menu-onemore.png")
    drink = "Beaujolais" if "Beaujolais" in s["links"] else "One more"
    go(p, drink); s = st(p); sob.append(s["st"]["sobriety"])
    if Game.name(p) == "The Blackout": break
check("A1 sobriety path", True, sob)
check("A2 menu shrinks from 3rd drink", "Beaujolais" in menus[0] and "Beaujolais" in menus[2] and "One more" in menus[3] and "Beaujolais" not in menus[3], [len(m) for m in menus])
check("A3 blackout reached", Game.name(p) == "The Blackout", Game.name(p)); p.screenshot(path=OUT+"A-blackout.png")
check("A3b no tw-errors", not s["twErrors"], s["twErrors"])
go(p, "Come to", 1500); s = st(p); p.screenshot(path=OUT+"A-gents-first.png")
check("A4 gents first time", Game.name(p) == "Coach and Horses lock" and "Retch." in s["links"] and "Give up. Sleep here." in s["links"] and "You gather your limbs to the bar." in s["links"], s["links"])
check("A5 blackouts=1 drinksTonight", s["st"].get("blackouts") == 1 and s["st"].get("drinksTonight") == len(sob)-1, s["st"])
go(p, "Retch.", 1500); Game.clear_overlays(p); go(p, "You gather your limbs to the bar.", 1500); s = st(p); check("A6 retch raises sobriety", s["st"]["sobriety"] > sob[-1], s["st"]["sobriety"])
check("A6b errors", not s["twErrors"] and not p._errs, (s["twErrors"], p._errs[:2])); p.close()

# B. second blackout at the Colony to the Dawn
p = g.page("Colony drink choice", seeds="(set: $blackouts to 1)(set: $sobriety to 12)(set: $lostToDrink to (a: 'lily3','gooch'))"); Game.clear_overlays(p)
go(p, "Beer"); check("B1 blackout 2", Game.name(p) == "The Blackout", Game.name(p)); p.screenshot(path=OUT+"B-blackout2.png")
go(p, "Come to", 1500); s = st(p); p.screenshot(path=OUT+"B-gents-second.png")
check("B2 gents second time: sleep only", Game.name(p) == "Coach and Horses lock" and "Retch." not in s["links"] and "You gather your limbs to the bar." not in s["links"] and "Give up. Sleep here." in s["links"], s["links"])
go(p, "Give up. Sleep here.", 1200); s = st(p); p.screenshot(path=OUT+"B-alba-incomplete.png")
check("B3 Alba Incomplete drinker line", Game.name(p) == "Alba Incomplete" and "drinker" in s["textSample"], s["textSample"][:200])
go(p, "Traveller, sleep!", 500); p.wait_for_timeout(18000); check("B4 black page", Game.name(p) == "Black page", Game.name(p))
p.wait_for_timeout(7000); go(p, "PLUS. ULTRA.", 3000); s = st(p); p.screenshot(path=OUT+"B-dawn.png", full_page=True)
full = p.evaluate("() => document.querySelector('tw-passage')?.innerText || ''")
check("B5 dawn lost count", Game.name(p) == "Dawn" and "2 Sam: lost to drink" in full, full[-200:])
check("B6 errors", not s["twErrors"], s["twErrors"]); p.close()

# C. a lily under 30 and sober
for sob0, want in ((20, 0), (50, 1)):
    p = g.page("Ronnie Scott's", seeds="(set: $knowsRonnies to true)(set: $sobriety to %d)" % sob0); Game.clear_overlays(p)
    p.evaluate("() => document.querySelector('.lily-prompt').click()"); p.wait_for_timeout(900)
    s = st(p); p.screenshot(path=OUT+"C-lily-%d.png" % sob0)
    check("C lily at %d" % sob0, s["st"].get("lilyCount") == want and (("cannot hold" in s["textSample"]) == (want == 0)), (s["st"].get("lilyCount"), s["st"].get("lostToDrink"), s["twErrors"]))
    p.close()

# D. a stranger under 30
p = g.page("Helvellyn Gooch", seeds="(set: $sobriety to 20)(set: $confidence to 50)"); s = st(p); p.screenshot(path=OUT+"D-gooch-drunk.png")
check("D stranger thins", "thinned" in s["textSample"] and s["st"]["confidence"] == 50 and not s["twErrors"], (s["st"], s["twErrors"])); p.close()
p = g.page("Helvellyn Gooch", seeds="(set: $sobriety to 50)(set: $confidence to 50)"); s = st(p)
check("D stranger sober", "trombone" in s["textSample"] and s["st"]["confidence"] == 60, s["st"]); p.close()

# E. the third pillar under 30 and sober
SEEDS = "(set: $metCritic to true)(set: $inisToldOfPillars to true)(set: $dreamKey to 'lighter')(set: $keyLighter to 'held')(set: $sobriety to %d)"
p = g.page("Entering The Pillars of Hercules", seeds=SEEDS % 20); Game.clear_overlays(p); s = st(p)
check("E1 no auto-crossing drunk", Game.name(p) == "Entering The Pillars of Hercules" and "Step through the third pillar" in s["links"], (Game.name(p), s["links"]))
print("E state:", s["state"][:600]); sob_before = s["st"].get("sobriety")
go(p, "Step through the third pillar", 1200); s = st(p); p.screenshot(path=OUT+"E-wall.png")
check("E2 the Wall", Game.name(p) == "The Wall" and not s["twErrors"], (Game.name(p), s["twErrors"]))
go(p, "Back to the bar", 1200); s = st(p)
check("E3 back, key kept, no charge", Game.name(p) == "Entering The Pillars of Hercules" and s["st"]["sobriety"] == sob_before and "dreamKeylighter" in (s["state"] or ""), (Game.name(p), s["st"]["sobriety"], s["state"][:200]))
p.close()
p = g.page("Entering The Pillars of Hercules", seeds=SEEDS % 50); p.wait_for_timeout(1500)
check("E4 sober auto-crossing", Game.name(p) == "Third Pillar Portal", Game.name(p)); p.close()

# F. the dual ring counts as a blackout
p = g.page("The dual ring", seeds="(set: $lilyCount to 2)"); p.wait_for_timeout(16500); go(p, "Hang up.", 1500); s = st(p)
check("F dual ring = blackout 1, retch", Game.name(p) == "Coach and Horses lock" and s["st"].get("blackouts") == 1 and "Retch." in s["links"], (Game.name(p), s["st"].get("blackouts"), s["links"])); p.close()

# G. notebook and hub flag on Dean Street, drunk
p = g.page("Dean Street", seeds="(set: $aoifeRework to false)(set: $sobriety to 20)(set: $lostToDrink to (a: 'lily3','gooch','pillar'))"); Game.clear_overlays(p)
if Game.name(p) != "Dean Street": go(p, Game.snapshot(p)["links"][0], 1500)
flag = p.evaluate("() => document.querySelector('.dss-hub-flag[data-k=\"drunk\"]')?.textContent")
go(p, "NOTEBOOK", 1200); n = p.evaluate("() => [...document.querySelectorAll('.nb-lost')].map(e=>e.textContent)")
p.screenshot(path=OUT+"G-notebook.png", full_page=True); s = st(p)
check("G notebook + flag", flag == "far" and len(n) == 3 and not s["twErrors"], (flag, n, s["twErrors"])); p.close()

# H. cellar lines
p = g.page("Beaten", seeds="(set: $sobriety to 20)(set: $haunts to (a: $haunt4))"); s = st(p)
check("H Beaten drunk line", "cellar floor" in s["textSample"] and not s["twErrors"], s["twErrors"]); p.close()
p = g.page("Standing", seeds="(set: $sobriety to 20)"); s = st(p)
check("H Standing drunk line", "bolt drunk" in s["textSample"] and not s["twErrors"], s["twErrors"]); p.close()

# I. regression: Pillars and Colony menus at 70, John's round
p = g.page("Which drink at the Pillars?", seeds="(set: $metCritic to true)"); s = st(p)
check("I Pillars menu", set(["Stout","Porter","Mild"]) <= set(s["links"]) and "One more" not in s["links"], s["links"])
go(p, "Stout", 1200); s = st(p); check("I Stout returns to Pillars", Game.name(p) == "Entering The Pillars of Hercules" and s["st"]["drinksTonight"] == 1 and not s["twErrors"], (Game.name(p), s["st"].get("drinksTonight"), s["twErrors"])); p.close()
p = g.page("His round"); go(p, "Drink with him", 1200); s = st(p)
check("I John's round", Game.name(p) == "The Empty Glass" and not s["twErrors"], (Game.name(p), s["twErrors"])); p.close()
g.close()
json.dump(rep, open(OUT+"report.json","w"), indent=1)
print("FAILS:", [r for r in rep if r[1] != "ok"])
