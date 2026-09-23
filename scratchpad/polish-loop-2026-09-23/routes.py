"""Play every route: walk each dream world from its first passage (seeded as the story would
have it), choosing win / lose / turn-back at each fork, back to Dean Street; the complete and
incomplete nights from Towards Dawn to Dawn; Alt-Dawn. Logs Harlowe errors, JS errors, console
errors and dead ends per passage.
Run from scratchpad/audit-2026-09-16: PYTHONPATH=. python3 ../polish-loop-2026-09-23/routes.py [width] [reduced] [route ...]"""
import json, sys, os, time, re
from harness import *

width = int(sys.argv[1]) if len(sys.argv) > 1 else 1212
args = sys.argv[2:]; reduced = False
if args and args[0] == 'reduced': reduced = True; args = args[1:]
BASE_SEED = ('(set: $inisToldOfPillars to true)(set: $crossedThreshold to true)(set: $dreamKey to "")'
             '(set: $returnedPage to true)(set: $metCritic to true)(set: $knowsCecilCourt to true)(set: $knowsLackland to true)')
WORLDS = {
  "himalayas": ("Airport Pub", '(set: $keyLighter to "spent")'),
  "nazca": ("Nazca Approach", '(set: $keyCocaine to "spent")'),
  "easter": ("Easter Island Shore", '(set: $keyTicket to "spent")'),
  "pyramid": ("Pyramid Mouth", '(set: $keySlip to "spent")'),
  "ezekiel": ("The Plain of Chebar", '(set: $keyEye to "spent")'),
}
NIGHTS = {
  "night-complete": ("Towards Dawn", '(set: $lilyCount to 5)(set: $haunts to (a: $haunt1,$haunt2,$haunt3,$haunt4,$haunt5,$haunt6,$haunt7,$haunt8,$haunt9,$haunt10,$haunt11,$haunt12))(set: $alba to (a: $alba1,$alba2,$alba3))'),
  "night-incomplete": ("Towards Dawn", '(set: $lilyCount to 2)(set: $haunts to (a: $haunt1,$haunt2))'),
  "alt-dawn": ("Alt-Dawn", '(set: $lilyCount to 5)'),
}
AVOID = {"NOTEBOOK", "AUDIT READ", "CONTINUE WHERE I LEFT OFF"}
RETREAT = re.compile(r"^(not yet|back\b|turn back|turn around|walk on past|wake\b|leave\b|give up|stay\b|sleep|← )", re.I)
STOP = {"Dean Street", "Dawn", "Alt-Dawn", "White page", "Black page"}
STOP_AFTER = {"Dawn": 4, "Alt-Dawn": 4}
def errs(p):
    return {"js": [e[:200] for e in p._errs if 'audio' not in e.lower() and 'textContent' not in e][:4],
            "console": [c[1][:160] for c in p._cons if c[0]=='error' and 'udio' not in c[1] and 'textContent' not in c[1] and 'net::' not in c[1]][:4]}
LINKS_JS = """() => [...document.querySelectorAll('tw-link')].filter(e=>{let el=e;while(el&&el!==document.body){const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden'||cs.pointerEvents==='none'&&el===e)return false;el=el.parentElement;}return true;}).map(e=>e.textContent.trim())"""
OUTCOME_JS = """(want) => { const ids=[...document.querySelectorAll('[id$="-win"],[id$="-lose"],[id$="-win-link"],[id$="-lose-link"]')].map(e=>e.id); const el=[...document.querySelectorAll('[id$="-win"],[id$="-lose"],[id$="-win-link"],[id$="-lose-link"]')].find(e=>e.id.includes('-'+want)); if(!el) return {ids}; el.style.display=''; const l=el.querySelector('tw-link')||(el.tagName==='TW-LINK'?el:null)||el.closest('tw-link'); if(!l) return {ids, nolink:true}; const t=l.textContent.trim(); l.click(); return {ids, clicked:t}; }"""
def walk(g, route, start, seed, outcome, maxsteps=45):
    p = g.page(start, BASE_SEED + seed)
    if reduced: p.emulate_media(reduced_motion='reduce')
    Game.click(p, "BEGIN", 1500); p.wait_for_timeout(1500); Game.clear_overlays(p)
    steps = []; clicked = {}; issues = []
    for i in range(maxsteps):
        Game.clear_overlays(p)
        at = Game.name(p)
        tw = p.evaluate("() => [...document.querySelectorAll('tw-error')].map(e=>e.textContent.slice(0,200))")
        e = errs(p)
        step = {"at": at}
        if tw: step["twErrors"] = tw
        if e["js"] or e["console"]: step["errors"] = e
        p._errs.clear(); p._cons.clear()
        if at in STOP and (at not in STOP_AFTER or i >= 1):
            steps.append(step); break
        # minigame outcome
        if outcome in ("win", "lose"):
            r = p.evaluate(OUTCOME_JS, outcome)
            if r.get("clicked"):
                step["outcome"] = r["clicked"]; steps.append(step); p.wait_for_timeout(2500); continue
        ls = [l for l in p.evaluate(LINKS_JS) if l not in AVOID]
        waited = 0
        while not ls and waited < 22000:
            p.wait_for_timeout(2000); waited += 2000; Game.clear_overlays(p)
            ls = [l for l in p.evaluate(LINKS_JS) if l not in AVOID]
        if not ls:
            step["deadEnd"] = True; steps.append(step); issues.append(("dead end", at)); break
        step["links"] = ls[:8]
        pref = [l for l in ls if bool(RETREAT.search(l)) == (outcome == "turnback")] or ls
        pref = sorted(pref, key=lambda l: clicked.get((at, l), 0))
        choice = pref[0]; clicked[(at, choice)] = clicked.get((at, choice), 0) + 1
        if clicked[(at, choice)] > 2: step["loop"] = True; steps.append(step); issues.append(("loop", at)); break
        step["click"] = choice; steps.append(step)
        Game.click(p, choice, 1800)
    p.close()
    return {"route": route, "outcome": outcome, "width": width, "reduced": reduced, "steps": steps, "issues": issues}

routes = []
for k, (s, seed) in WORLDS.items():
    for o in ("win", "lose", "turnback"): routes.append((f"{k}/{o}", s, seed, o))
for k, (s, seed) in NIGHTS.items(): routes.append((k, s, seed, "win"))
if args: routes = [r for r in routes if any(a in r[0] for a in args)]
g = Game(width=width, height=780 if width < 600 else 900)
out = []
for route, s, seed, o in routes:
    t0 = time.time()
    try: r = walk(g, route, s, seed, o)
    except Exception as ex: r = {"route": route, "outcome": o, "exception": str(ex)[:300], "steps": [], "issues": [("exception", str(ex)[:100])]}
    out.append(r)
    path = " > ".join(x["at"] for x in r["steps"])
    bad = [x for x in r["steps"] if x.get("twErrors") or x.get("errors") or x.get("deadEnd") or x.get("loop")]
    print(f"{'!!' if bad or r['issues'] else 'ok'} {route} ({int(time.time()-t0)}s): {path}", flush=True)
    for x in bad: print("    ", json.dumps({k: v for k, v in x.items() if k != 'links'})[:400], flush=True)
name = os.environ.get("ROUTES_OUT", os.path.join(os.path.dirname(os.path.abspath(__file__)), f"routes_{width}{'_reduced' if reduced else ''}.json"))
json.dump(out, open(name, "w"), indent=1)
g.close(); print("DONE")
