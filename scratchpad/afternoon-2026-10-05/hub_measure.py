import sys, os, json
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
W = int(sys.argv[1]) if len(sys.argv) > 1 else 1440; H = int(sys.argv[2]) if len(sys.argv) > 2 else 900
g = Game(width=W, height=H)
p = g.page("Dean Street", audit_header=False); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
p.wait_for_timeout(2500); Game.clear_overlays(p)
print(json.dumps(p.evaluate("""() => {
  const out = {};
  const tp = document.querySelector('tw-passage'); const cs = getComputedStyle(tp);
  out.passage = {top: Math.round(tp.getBoundingClientRect().top), padTop: cs.paddingTop, marginTop: cs.marginTop};
  const story = document.querySelector('tw-story'); const ss = getComputedStyle(story); out.story = {padTop: ss.paddingTop, marginTop: ss.marginTop};
  out.cssVars = {reserve: getComputedStyle(document.documentElement).getPropertyValue('--dss-header-reserve')};
  const hdr = document.querySelector('#stat-bars-lifted, .stat-bars'); if (hdr) out.header = Math.round(hdr.getBoundingClientRect().bottom);
  const els = [...tp.querySelectorAll('*')].filter(e => e.getClientRects().length && !e.closest('.dss-threshold') && e.children.length < 3 && e.getBoundingClientRect().height > 4);
  out.first = els.slice(0, 20).map(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return [e.tagName+'.'+String(e.className).slice(0,30), Math.round(r.top), Math.round(r.bottom), s.marginTop, s.marginBottom, s.paddingTop, e.textContent.trim().slice(0,25)]; });
  const m = document.querySelector('.soho-map-stage'); if (m) { const r = m.getBoundingClientRect(); out.map = [Math.round(r.top), Math.round(r.bottom)]; let e = m; const chain=[]; while (e && e !== tp) { const s = getComputedStyle(e); chain.push([e.tagName+'.'+String(e.className).slice(0,30), Math.round(e.getBoundingClientRect().top), s.marginTop, s.paddingTop]); e = e.parentElement; } out.mapChain = chain; }
  out.docH = document.documentElement.scrollHeight;
  return out; }"""), indent=1))
p.close(); g.close()
