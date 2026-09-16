"""Random walkers: start a fresh game and click random links, logging errors, dead ends and stuck states."""
import json, random, sys, time
from harness import *

N_WALKERS = int(sys.argv[1]) if len(sys.argv) > 1 else 4
STEPS = int(sys.argv[2]) if len(sys.argv) > 2 else 120
AVOID = {"NOTEBOOK", "AUDIT READ", "Head towards dawn", "Go towards dawn", "CONTINUE WHERE I LEFT OFF", "← Exit to the street"}
ENDINGS = {"Dawn", "Alt Dawn", "Alba Complete", "Alba Incomplete"}

def links(p):
    return p.evaluate("""() => [...document.querySelectorAll('tw-link, tw-passage .link, tw-passage [data-raw]')]
      .filter(e=>e.tagName==='TW-LINK').map(e=>{let el=e,vis=true;while(el&&el!==document.body){const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')vis=false;el=el.parentElement;}return {t:e.textContent.trim(),vis}})
      .filter(x=>x.vis).map(x=>x.t)""")

def overlays(p):
    return p.evaluate("(sel)=>[...document.querySelectorAll(sel)].map(e=>e.id)", OVERLAYS)

g = Game()
log = []
for w in range(N_WALKERS):
    rnd = random.Random(1000 + w)
    p = g.page(None, audit_header=True)  # natural start from Title
    Game.click(p, "BEGIN", 1200)
    path = []; stuck = 0; last = None; seen_err = set()
    for step in range(STEPS):
        Game.clear_overlays(p)
        at = Game.name(p)
        errs = p.evaluate("() => [...document.querySelectorAll('tw-error')].map(e=>e.textContent.slice(0,200))")
        for e in errs:
            if (at, e) not in seen_err:
                seen_err.add((at, e)); log.append({"walker": w, "step": step, "at": at, "twError": e, "path": path[-8:]})
        ls = [l for l in links(p) if l not in AVOID]
        if at in ENDINGS or (not ls and at == "Dawn"):
            log.append({"walker": w, "step": step, "at": at, "ending": True, "path": path[-12:]}); break
        if not ls:
            # maybe auto-advance; wait
            p.wait_for_timeout(2500)
            ls = [l for l in links(p) if l not in AVOID]
            if not ls:
                allls = links(p)
                if allls:  # only avoided links remain (e.g. dawn): take one
                    ls = allls
                else:
                    stuck += 1
                    if stuck >= 2:
                        log.append({"walker": w, "step": step, "at": at, "deadEnd": True, "path": path[-12:],
                                    "overlays": overlays(p), "text": p.evaluate("() => (document.querySelector('tw-passage')?.innerText||'').slice(0,300)")})
                        break
                    continue
        choice = rnd.choice(ls)
        ok = Game.click(p, choice, 900)
        path.append((at, choice))
        nxt = Game.name(p)
        if nxt == at and choice == last:
            stuck += 1
            if stuck >= 6:
                log.append({"walker": w, "step": step, "at": at, "stuck": True, "choice": choice, "path": path[-10:], "overlays": overlays(p)})
                break
        else:
            stuck = 0
        last = choice
    js = [e for e in p._errs if "decode audio" not in e]
    log.append({"walker": w, "finished_at": Game.name(p), "steps": len(path), "jsErrors": js, "net": [c for c in p._cons if c[0].startswith("http") or c[0] == "reqfail"], "path": path})
    print(f"walker {w}: {len(path)} steps, ended at {Game.name(p)}, js={len(js)}", flush=True)
    p.close()
json.dump(log, open("/tmp/claude-0/-home-user-Dream-Street-Shuffle-Game/ec1d130e-5625-535d-96c0-16f95b32b372/scratchpad/walker_results.json", "w"), indent=1)
g.close()
print("DONE")
