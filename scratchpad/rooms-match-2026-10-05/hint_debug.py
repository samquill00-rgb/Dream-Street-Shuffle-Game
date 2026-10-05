import sys, time
from harness import Game
pas, w = "The French", "fi-wrap"
g = Game(width=960, height=800)
p = g.page(pas, "(set: $haunts to (a: $haunt1))(set: $enteredVenue to true)(set: $sobriety to 60)"); Game.click(p, "BEGIN", 1200)
for _ in range(80):
    if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle'", w): break
    p.wait_for_timeout(300)
p.wait_for_timeout(900); Game.clear_overlays(p)
js = "(w) => { const wrap=document.getElementById(w); const hs=[...wrap.querySelectorAll('div')].filter(e=>e.textContent.trim()==='LOOK CLOSER AT WHAT CATCHES YOUR EYE'); const hn=wrap.querySelector('.dss-room-hovername'); return {words: wrap.dataset.words, hints: hs.map(h=>[h.style.opacity, getComputedStyle(h).opacity]), hoverStyle: hn && hn.style.opacity, hoverComputed: hn && getComputedStyle(hn).opacity, hoverText: hn && hn.textContent}; }"
print("before dismiss:", p.evaluate(js, w))
p.evaluate("(w) => { const wrap=document.getElementById(w); wrap.addEventListener('dss-room-words-away', () => { wrap.dataset.awayFired = '1'; }); }", w)
p.click('tw-story > .dss-room-fixed .dss-room-dismiss'); t0=time.time()
for i in range(8):
    p.wait_for_timeout(500)
    print(i, "%.1fs" % (time.time()-t0), p.evaluate(js, w)["hints"])
# hover
xy = p.evaluate("(w) => { const e=window._dssThreeRegistry[w]; const v=new THREE.Vector3(0.4,2,-4.4); v.project(e.camera); const c=document.querySelector('#'+w+' canvas'); const r=c.getBoundingClientRect(); return [r.left+(v.x+1)/2*r.width, r.top+(1-v.y)/2*r.height]; }", w)
p.mouse.move(xy[0]-40, xy[1]); p.wait_for_timeout(200); p.mouse.move(xy[0], xy[1])
for i in range(4):
    p.wait_for_timeout(300); print("hover", i, p.evaluate(js, w))
g.close()
