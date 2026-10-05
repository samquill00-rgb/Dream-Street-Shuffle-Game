"""Hover over the first visible clickable of a room and read the halo and the hover name, for a kit room and an early room."""
import sys, os
from harness import Game
ROOMS = {'fi': ("The French", "fi-wrap", "(set: $haunts to (a: $haunt1))"), 'cb': ('Coach and Horses bar', "cb-wrap", '(set: $hadPhoneCall to false)(set: $lilyCount to 0)(set: $haunts to (a:))(set: $knowsLackland to false)(set: $primerShown to true)(set: $inisToldOfPillars to false)')}
g = Game(width=960, height=800)
for rid in sys.argv[1:]:
    pas, w, seeds = ROOMS[rid]
    p = g.page(pas, seeds + "(set: $enteredVenue to true)(set: $sobriety to 60)"); Game.click(p, "BEGIN", 1200)
    for _ in range(80):
        if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle'", w): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(900); Game.clear_overlays(p)
    p.click('tw-story > .dss-room-fixed .dss-room-dismiss'); p.wait_for_timeout(6000)
    glows = p.evaluate("(w) => { const e=window._dssThreeRegistry[w]; const g=e.scene.getObjectByName('restGlow'); return g.children.filter(s=>s.visible).map(s=>{ const v=new THREE.Vector3(s.position.x,s.position.y,s.position.z); v.project(e.camera); const c=document.querySelector('#'+w+' canvas'); const r=c.getBoundingClientRect(); return [r.left+(v.x+1)/2*r.width, r.top+(1-v.y)/2*r.height, s.material.opacity]; }); }", w)
    print(rid, "rest glows (x, y, opacity):", [[round(a), round(b), round(c, 2)] for a, b, c in glows])
    for xy in glows:
        if not (0 <= xy[0] < 960 and 120 <= xy[1] < 800): continue
        p.mouse.move(xy[0] - 40, xy[1]); p.wait_for_timeout(200); p.mouse.move(xy[0], xy[1]); p.wait_for_timeout(800)
        st = p.evaluate("(w) => { const h=document.querySelector('#'+w+' .dss-room-hovername'); const e=window._dssThreeRegistry[w]; const halo=e.scene.children.find(o=>o.isSprite && o.material.depthTest===false && o.material.map && o.scale.x>=0.4 && o.parent===e.scene); const c=document.querySelector('#'+w+' canvas'); return {name: h && h.textContent, nameOpacity: h && getComputedStyle(h).opacity, cursor: c.style.cursor, haloVisible: halo ? halo.visible : 'none', haloScale: halo ? halo.scale.x : null}; }", w)
        print("  ", rid, st)
        if st['name']: p.screenshot(path=os.path.join(sys.argv[0].rsplit('/',1)[0], '..', '..', '..', 'tmp-' + rid + '-hover.png')) if False else None
        break
    p.screenshot(path='/tmp/claude-0/-home-user-Dream-Street-Shuffle-Game/6f926d91-7d1e-5118-87a1-56c7c628ff1f/scratchpad/play1/%s-hover.png' % rid)
    p.close()
g.close()
