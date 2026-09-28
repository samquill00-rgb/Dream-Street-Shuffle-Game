import sys, json
sys.path.insert(0, "scratchpad/audit-2026-09-16")
from harness import Game
OUT = "scratchpad/betrayal-2026-09-28/"
g = Game()
SEED = '(set: $haunts to (a: $haunt4))(set: $knowsCopperWord to false)'
cases = [("keep", "Say nothing"), ("ashton", "Break the agreement. Look at her."),
         ("red", "Give him Red's name"), ("john", "Give him John's name")]
report = []
def go(p, txt):
    ok = Game.click(p, txt, 900); assert ok, ("no link", txt, Game.snapshot(p)["links"]); Game.clear_overlays(p)
for label, choice in cases:
    for result in ("defeat", "victory"):
        p = g.page("Turn to Copper", seeds=SEED)
        Game.clear_overlays(p)
        snap = Game.snapshot(p)
        assert "Say nothing" in snap["links"], snap["links"]
        if label == "keep": assert "Give him John's name" in snap["links"] and "Give him Red's name" in snap["links"]
        if label == "keep" and result == "defeat": p.screenshot(path=OUT+"lair-choices.png")
        go(p, choice)
        if label != "keep":
            assert Game.name(p).startswith("You "), Game.name(p)
            if result == "defeat": p.screenshot(path=OUT+f"lair-{label}.png")
            go(p, "Brace yourself")
        else:
            go(p, "Brace yourself")
        assert Game.name(p) == "Fight starts", Game.name(p)
        p.wait_for_timeout(1500)
        p.evaluate("(id) => document.querySelector('#'+id+' tw-link').click()", "go-fight-"+result)
        p.wait_for_timeout(900)
        nm = Game.name(p); assert nm in ("Fight Defeat", "Fight Victory"), nm
        go(p, "Try to get up" if result == "defeat" else "Escape up the stairs")
        s1 = Game.snapshot(p)
        p.screenshot(path=OUT+f"rescue-{label}-{result}.png")
        errs = list(s1["twErrors"])
        nxt = s1["links"][0]
        go(p, nxt)
        if Game.name(p) == "St. John's Word":
            s_w = Game.snapshot(p); errs += s_w["twErrors"]; go(p, "Dean Street")
        s2 = Game.snapshot(p)
        p.screenshot(path=OUT+f"darkpass-{label}-{result}.png")
        errs += s2["twErrors"]
        go(p, "Dean Street")
        s3 = Game.snapshot(p); errs += s3["twErrors"]
        report.append({"case": label, "result": result, "rescue": s1["at"], "rescue_text": s1["textSample"][:700],
                       "next": nxt, "after": s2["at"], "darkpass_text": s2["textSample"][:500], "hub": s3["at"],
                       "twErrors": errs, "jsErrors": p._errs[:3]})
        p.close()
# Colony trace and tarot with a red crossing, notebook with john crossing
p = g.page("The Colony Room", seeds='(set: $crossed to "red")(set: $haunts to (a: $haunt1))(set: $visited\'s Colony to false)')
Game.clear_overlays(p); s = Game.snapshot(p); report.append({"colony_red": s["textSample"][:400], "twErrors": s["twErrors"]}); p.screenshot(path=OUT+"colony-red.png"); p.close()
p = g.page("Dean Street", seeds='(set: $crossed to "john")(set: $haunts to (a: $haunt4))')
Game.clear_overlays(p); p.wait_for_timeout(800)
nb = p.evaluate("() => { const b=[...document.querySelectorAll('tw-link, button, a, div')].find(e=>/NOTEBOOK/i.test(e.textContent.trim()) && e.textContent.trim().length<20); if(b){b.click(); return true;} return false; }")
p.wait_for_timeout(900); txt = p.evaluate("() => document.body.innerText")
report.append({"notebook_opened": nb, "debt_trace_shown": "sold" in txt and "Coniunctio" in txt}); p.screenshot(path=OUT+"notebook-john.png"); p.close()
p = g.page("Shana Reads", seeds='(set: $crossed to "ashton")(set: $metShana to true)')
Game.clear_overlays(p); s = Game.snapshot(p); report.append({"tarot_errors": s["twErrors"], "tarot_at": s["at"]}); p.close()
p = g.page("His round", seeds=''); Game.clear_overlays(p); s = Game.snapshot(p); report.append({"french_errors": s["twErrors"], "french_pink": "Ashton" in s["textSample"]}); p.screenshot(path=OUT+"french-pink.png"); p.close()
g.close()
json.dump(report, open(OUT+"report.json","w"), indent=1)
for r in report: print(json.dumps(r)[:600])
