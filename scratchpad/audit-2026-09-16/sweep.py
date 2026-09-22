"""Render every passage under a rich late-night seed and record errors.

Run from this folder (so `harness` imports): PYTHONPATH=. python3 sweep.py [passage ...]
Results go to sweep_results.json beside this script, or to $SWEEP_OUT.
Two known false positives in this sandbox (2026-09-22): "Unable to decode audio data"
(headless Chromium has no AAC/MP3 codecs) and "Cannot set properties of null (setting
'textContent') at <anonymous>:6" (the harness init script also runs inside the three
iframe scenes, where there is no Start passage). Filter both before reading the rest.
"""
import json, sys, traceback, os
from harness import *

SKIP_TAGS = {"script", "stylesheet", "startup", "header", "system"}
RICH = ('(set: $inisToldOfPillars to true)(set: $returnedPage to true)(set: $metCritic to true)'
        '(set: $knowsCecilCourt to true)(set: $knowsLackland to true)(set: $knowsCopperSecret to true)'
        '(set: $metDavy to true)(set: $metShana to true)(set: $haunts to (a: $haunt1, $haunt2))'
        '(set: $dreamKey to "ticket")(set: $keyTicket to "held")(set: $hasDrawing to true)'
        '(set: $bookTitle to "The Test Book")(set: $sobriety to 55)(set: $confidence to 60)')

names = [n for n in BODIES if not (set(TAGS[n]) & SKIP_TAGS) and n not in ("StoryData","StoryTitle","Start","Title","UserScript","UserStylesheet")]
only = sys.argv[1:]
if only: names = [n for n in names if n in only]
g = Game()
results = []
for i, n in enumerate(names):
    try:
        p = g.page(n, RICH)
        Game.click(p, "BEGIN", 1200)
        p.wait_for_timeout(1500)
        Game.clear_overlays(p)
        snap = Game.snapshot(p)
        stray = p.evaluate(r"""() => { const out=[]; const root=document.querySelector('tw-passage'); if(!root) return ['NO tw-passage'];
          const w=document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let t;
          while(t=w.nextNode()){ const s=t.textContent; if(/\\|\(\w+:|\$[a-zA-Z]/.test(s) && !t.parentElement.closest('script,style')) out.push(s.trim().slice(0,90)); }
          return out; }""")
        r = {"passage": n, "tags": TAGS[n], "at": snap["at"], "twErrors": snap["twErrors"], "links": snap["links"][:12],
             "stray": stray[:6], "jsErrors": list(p._errs), "net": [c for c in p._cons if c[0] != "warning"]}
        p.close()
    except Exception as e:
        r = {"passage": n, "exception": traceback.format_exc()[-400:]}
    results.append(r)
    flag = "!!" if (r.get("twErrors") or r.get("jsErrors") or r.get("stray") or r.get("exception")) else "ok"
    print(f"[{i+1}/{len(names)}] {flag} {n} -> {r.get('at')}", flush=True)
json.dump(results, open(os.environ.get("SWEEP_OUT", os.path.join(os.path.dirname(os.path.abspath(__file__)), "sweep_results.json")),"w"), indent=1)
g.close()
print("DONE")
