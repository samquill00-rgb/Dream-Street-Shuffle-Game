"""Render every passage at phone width (390x780) and record horizontal overflow.

Run from this folder: PYTHONPATH=. python3 phone_sweep.py [passage ...]
Results: phone_sweep_results.json beside this script (or $PHONE_OUT).
Same sandbox false positives as sweep.py (audio decode; harness init in iframes).
Note: tw-story and html carry overflow-x:hidden, so scrollWidth never exceeds the viewport;
the "wide" list (elements whose box passes the right edge, not clipped by a narrower
container) is the real signal."""
import json, sys, traceback, os
from harness import *

SKIP_TAGS = {"script", "stylesheet", "startup", "header", "system"}
RICH = ('(set: $inisToldOfPillars to true)(set: $returnedPage to true)(set: $metCritic to true)'
        '(set: $knowsCecilCourt to true)(set: $knowsLackland to true)(set: $knowsCopperSecret to true)'
        '(set: $metDavy to true)(set: $metShana to true)(set: $haunts to (a: $haunt1, $haunt2))'
        '(set: $dreamKey to "ticket")(set: $keyTicket to "held")(set: $hasDrawing to true)'
        '(set: $bookTitle to "The Test Book")(set: $sobriety to 55)(set: $confidence to 60)')
MEASURE = r"""() => {
  const W = document.documentElement.clientWidth;
  const out = {clientW: W, scrollW: document.documentElement.scrollWidth, bodyScrollW: document.body.scrollWidth, wide: []};
  const seen = new Set();
  for (const el of document.querySelectorAll('tw-passage *, .stat-bars *, #dss-notebook *')) {
    if (el.closest('script,style,svg *')) continue;
    const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') continue;
    const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue;
    if (r.left < -1000) continue; // parked off-screen on purpose (docked hub list etc.)
    let clipped=false; for (let a=el.parentElement; a && a!==document.body; a=a.parentElement){const o=getComputedStyle(a).overflowX; if(o==='hidden'||o==='clip'){const ar=a.getBoundingClientRect(); if(ar.right<W-1){clipped=true;break;}}}
    if (clipped) continue;
    if (r.right > W + 1 || r.left < -1) {
      const key = el.tagName + '.' + [...el.classList].slice(0,3).join('.') + (el.id ? '#' + el.id : '');
      if (seen.has(key)) continue; seen.add(key);
      out.wide.push({el: key, left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width), text: (el.textContent || '').trim().slice(0, 40)});
      if (out.wide.length >= 8) break;
    }
  }
  return out;
}"""
names = [n for n in BODIES if not (set(TAGS[n]) & SKIP_TAGS) and n not in ("StoryData","StoryTitle","Start","Title","UserScript","UserStylesheet")]
only = sys.argv[1:]
if only: names = [n for n in names if n in only]
g = Game(width=390, height=780)
results = []
for i, n in enumerate(names):
    try:
        p = g.page(n, RICH)
        Game.click(p, "BEGIN", 1200)
        p.wait_for_timeout(1500)
        Game.clear_overlays(p)
        at = Game.name(p)
        m = p.evaluate(MEASURE)
        r = {"passage": n, "tags": TAGS[n], "at": at, **m,
             "jsErrors": [e[:160] for e in p._errs if 'audio' not in e.lower() and 'textContent' not in e]}
        p.close()
    except Exception as e:
        r = {"passage": n, "exception": traceback.format_exc()[-400:]}
    results.append(r)
    flag = "!!" if (r.get("scrollW", 390) > 390 or r.get("wide") or r.get("jsErrors") or r.get("exception")) else "ok"
    print(f"[{i+1}/{len(names)}] {flag} {n} -> {r.get('at')} sw={r.get('scrollW')} wide={len(r.get('wide', []))}", flush=True)
json.dump(results, open(os.environ.get("PHONE_OUT", os.path.join(os.path.dirname(os.path.abspath(__file__)), "phone_sweep_results.json")), "w"), indent=1)
g.close()
print("DONE")
