"""Direct close-up check for one early room: project each hotspot's tgt and tap it until a card opens."""
import sys, os, time
from harness import Game
rid, pas, w, seeds = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
OUT = sys.argv[5]; os.makedirs(OUT, exist_ok=True)
g = Game(width=960, height=800)
p = g.page(pas, seeds + "(set: $enteredVenue to true)(set: $sobriety to 60)"); Game.click(p, "BEGIN", 1200)
for _ in range(80):
    if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle'", w): break
    p.wait_for_timeout(300)
p.wait_for_timeout(900); Game.clear_overlays(p)
p.click('tw-story > .dss-room-fixed .dss-room-dismiss'); p.wait_for_timeout(1200)
spots = p.evaluate("(w) => window._dssThreeRegistry[w].hotspots.map(h => ({name: h.name, at: h.haloAt || null, root: h.root ? [h.root.position.x, h.root.position.y, h.root.position.z] : null, figure: !!h.figure}))", w)
print(spots)
def project(at):
    return p.evaluate("([w,a]) => { const e = window._dssThreeRegistry[w]; const v = new THREE.Vector3(a[0],a[1],a[2]); v.project(e.camera); const c = document.querySelector('#'+w+' canvas'); const r = c.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; }", [w, at])
def cam(): return p.evaluate("(w) => document.getElementById(w).dataset.cam", w)
# the rest glows carry each clickable's world position
glows = p.evaluate("(w) => { const e=window._dssThreeRegistry[w]; const g=e.scene.getObjectByName('restGlow'); return g ? g.children.map(s=>[s.position.x,s.position.y,s.position.z, s.visible]) : null; }", w)
print("glows:", glows)
for i, gl in enumerate(glows or []):
    xy = project(gl[:3]); print(i, xy, gl[3])
    if not (0 <= xy[0] < 960 and 120 <= xy[1] < 800): continue
    p.mouse.move(xy[0], xy[1]); p.wait_for_timeout(300)
    hn = p.evaluate("(w) => { const h=document.querySelector('#'+w+' .dss-room-hovername'); return h && [h.textContent, getComputedStyle(h).opacity]; }", w)
    print("   hover:", hn)
    p.mouse.down(); p.mouse.up()
    for _ in range(140):
        if cam() == 'inspect': break
        p.wait_for_timeout(150)
    p.wait_for_timeout(500)
    card = p.evaluate("(w) => { const d=[...document.querySelectorAll('#'+w+' .dss-room-card')][0]; return d && d.style.opacity==='1' ? d.textContent.slice(0,120) : null; }", w)
    print("   cam:", cam(), "card:", card)
    if card:
        p.screenshot(path=os.path.join(OUT, rid + "-card.png")); break
    for _ in range(60):
        if cam() == 'idle': break
        p.wait_for_timeout(150)
g.close()
