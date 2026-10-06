"""Seeded room card check. Args: wrapId passage hotspotName seeds"""
import sys, time, json
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
w, pas, hot, seeds = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
g = Game(width=1440, height=900)
p = g.page(pas, seeds + "(set: $enteredVenue to true)(set: $sobriety to 60)", audit_header=False); Game.click(p, "BEGIN", 1200)
for _ in range(200):
    if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle'", w): break
    p.wait_for_timeout(300)
p.wait_for_timeout(900); Game.clear_overlays(p)
p.evaluate("() => { const d=document.querySelector('.dss-room-dismiss'); d && d.click(); }"); p.wait_for_timeout(1200)
spots = p.evaluate("(w) => window._dssThreeRegistry[w].hotspots.map(h => h.name)", w)
links = p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].map(l=>l.textContent.trim())")
print(pas, "| links in passage:", links)
xy = p.evaluate("([w,name]) => { const e = window._dssThreeRegistry[w]; const h=e.hotspots.find(h=>h.name===name); const a=h.haloAt; const v = new THREE.Vector3(a[0],a[1],a[2]); v.project(e.camera); const c = document.querySelector('#'+w+' canvas'); const r = c.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; }", [w, hot])
p.mouse.move(xy[0], xy[1]); p.wait_for_timeout(400); p.mouse.down(); p.mouse.up()
for _ in range(140):
    if p.evaluate("(w) => document.getElementById(w).dataset.cam", w) == 'inspect': break
    p.wait_for_timeout(150)
p.wait_for_timeout(1200)
card = p.evaluate("(w) => { const d=[...document.querySelectorAll('#'+w+' .dss-room-card')][0]; if(!d) return null; return {op: d.style.opacity, buttons: [...d.querySelectorAll('.fi-action')].map(b=>b.textContent.trim())}; }", w)
print("  CARD", hot, json.dumps(card, ensure_ascii=False))
p.screenshot(path="/home/user/Dream-Street-Shuffle-Game/scratchpad/starred-2026-10-06/shots2/seeded-%s-card.png" % w)
g.close()
