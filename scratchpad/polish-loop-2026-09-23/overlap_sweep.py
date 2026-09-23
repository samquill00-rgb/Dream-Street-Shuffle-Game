"""Render every passage at a given width and report text that overlaps other text,
runs past its box, or is clipped.

Run from scratchpad/audit-2026-09-16: PYTHONPATH=. python3 ../polish-loop-2026-09-23/overlap_sweep.py WIDTH [reduced] [passage ...]
Results: overlap_<width>.json beside this script.
Signals per passage:
  overlaps: pairs of text runs from different elements whose rects intersect by more than 3px each way
  spill:    text runs whose rect passes the right/left edge of their block container (that has a real width)
  clipped:  text elements with overflow hidden whose scrollHeight/Width exceeds the client box
Same sandbox false positives as sweep.py (audio decode; harness init in iframes)."""
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
  const out = {clientW: W, overlaps: [], spill: [], clipped: []};
  const key = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + ([...el.classList].length ? '.' + [...el.classList].slice(0,3).join('.') : '');
  const path = el => { const a=[]; for (let e=el; e && e!==document.body && a.length<4; e=e.parentElement) a.unshift(key(e)); return a.join(' > '); };
  const effOpacity = el => { let o=1; for (let e=el; e && e!==document.documentElement; e=e.parentElement){ const cs=getComputedStyle(e); if(cs.display==='none'||cs.visibility==='hidden') return 0; o*=parseFloat(cs.opacity); if (o<0.05) return 0; } return o; };
  const runs = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {acceptNode: n => {
    if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
    const p = n.parentElement; if (!p) return NodeFilter.FILTER_REJECT;
    if (p.closest('script,style,noscript,#audit-name,#audit-state,tw-passagedata,tw-storydata,tw-error')) return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT; }});
  let n;
  while ((n = walker.nextNode())) {
    const p = n.parentElement;
    if (effOpacity(p) < 0.05) continue;
    const isSvg = !!p.closest('svg');
    const rg = document.createRange(); rg.selectNodeContents(n);
    const rects = [...rg.getClientRects()].filter(r => r.width > 1 && r.height > 1);
    if (!rects.length) continue;
    let blk = p; while (blk && blk!==document.body) { const d=getComputedStyle(blk).display; if (d!=='inline' && d!=='contents') break; blk=blk.parentElement; }
    const bcs = blk ? getComputedStyle(blk) : null;
    const br = blk ? blk.getBoundingClientRect() : null;
    const fixed = (() => { for (let e=p; e && e!==document.body; e=e.parentElement){ if (getComputedStyle(e).position==='fixed') return true; } return false; })();
    for (const r of rects) {
      runs.push({el: p, k: path(p), r, text: n.nodeValue.trim().slice(0,50), isSvg, fixed});
      if (br && !isSvg && bcs.overflowX!=='hidden' && bcs.overflowX!=='clip' && bcs.whiteSpace!=='nowrap' && br.width > 20 && (r.right > br.right + 2 || r.left < br.left - 2) && (r.right > W+1 || r.left < -1 || r.right > br.right + 8)) {
        out.spill.push({el: path(p), text: n.nodeValue.trim().slice(0,50), run: [Math.round(r.left), Math.round(r.right)], box: [Math.round(br.left), Math.round(br.right)]});
      }
    }
  }
  for (const el of document.querySelectorAll('tw-passage *, #dss-notebook *, .stat-bars *')) {
    if (el.closest('svg, script, style, canvas')) continue;
    const cs = getComputedStyle(el); if (cs.overflow==='visible' && cs.overflowY==='visible') continue;
    if (cs.display==='none' || effOpacity(el)<0.05) continue;
    if (!el.innerText || !el.innerText.trim()) continue;
    if (el.scrollHeight > el.clientHeight + 4 && cs.overflowY==='hidden' && cs.textOverflow!=='ellipsis') out.clipped.push({el: path(el), sh: el.scrollHeight, ch: el.clientHeight, text: el.innerText.trim().slice(0,40)});
    else if (el.scrollWidth > el.clientWidth + 4 && (cs.overflowX==='hidden'||cs.overflowX==='clip')) out.clipped.push({el: path(el), sw: el.scrollWidth, cw: el.clientWidth, text: el.innerText.trim().slice(0,40)});
    if (out.clipped.length > 12) break;
  }
  const seen = new Set();
  for (let i=0;i<runs.length;i++) for (let j=i+1;j<runs.length;j++) {
    const a=runs[i], b=runs[j]; if (a.el===b.el) continue;
    if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const ox = Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left);
    const oy = Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top);
    if (ox > 3 && oy > 3) {
      const k = a.k+'|'+b.k; if (seen.has(k)) continue; seen.add(k);
      out.overlaps.push({a: a.k, at: a.text, b: b.k, bt: b.text, ox: Math.round(ox), oy: Math.round(oy), fixed: a.fixed||b.fixed, svg: a.isSvg||b.isSvg});
      if (out.overlaps.length > 20) return out;
    }
  }
  return out;
}"""
width = int(sys.argv[1]); args = sys.argv[2:]
reduced = False
if args and args[0] == 'reduced': reduced = True; args = args[1:]
names = [n for n in BODIES if not (set(TAGS[n]) & SKIP_TAGS) and n not in ("StoryData","StoryTitle","Start","Title","UserScript","UserStylesheet")]
if args: names = [n for n in names if n in args]
g = Game(width=width, height=780 if width < 600 else 900)
results = []
for i, n in enumerate(names):
    try:
        p = g.page(n, RICH)
        if reduced: p.emulate_media(reduced_motion='reduce')
        Game.click(p, "BEGIN", 1200)
        p.wait_for_timeout(3500)
        Game.clear_overlays(p)
        at = Game.name(p)
        m = p.evaluate(MEASURE)
        r = {"passage": n, "tags": TAGS[n], "at": at, **m,
             "jsErrors": [e[:160] for e in p._errs if 'audio' not in e.lower() and 'textContent' not in e]}
        p.close()
    except Exception as e:
        r = {"passage": n, "exception": traceback.format_exc()[-400:]}
    results.append(r)
    flag = "!!" if (r.get("overlaps") or r.get("spill") or r.get("clipped") or r.get("jsErrors") or r.get("exception")) else "ok"
    print(f"[{i+1}/{len(names)}] {flag} {n} -> {r.get('at')} ov={len(r.get('overlaps', []))} sp={len(r.get('spill', []))} cl={len(r.get('clipped', []))}", flush=True)
out = os.environ.get("OVERLAP_OUT", os.path.join(os.path.dirname(os.path.abspath(__file__)), f"overlap_{width}{'_reduced' if reduced else ''}.json"))
json.dump(results, open(out, "w"), indent=1)
g.close()
print("DONE")
