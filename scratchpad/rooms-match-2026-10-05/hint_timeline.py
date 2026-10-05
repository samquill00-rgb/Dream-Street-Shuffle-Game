from harness import Game
import time
pas, w = "The French", "fi-wrap"
g = Game(width=960, height=800)
p = g.page(pas, "(set: $haunts to (a: $haunt1))(set: $enteredVenue to true)(set: $sobriety to 60)"); Game.click(p, "BEGIN", 300)
t0 = time.time(); last = None
js = "(w) => { const wrap=document.getElementById(w); if(!wrap) return 'no wrap'; const hs=[...wrap.querySelectorAll('div')].filter(e=>e.textContent.trim()==='LOOK CLOSER AT WHAT CATCHES YOUR EYE'); return JSON.stringify({words: wrap.dataset.words||null, cam: wrap.dataset.cam||null, hint: hs.map(h=>h.style.opacity), canvas: !!wrap.querySelector('canvas')}); }"
for i in range(120):
    st = p.evaluate(js, w)
    if st != last: print("%5.1fs %s" % (time.time()-t0, st)); last = st
    if '"words":"modal"' in st and time.time()-t0 > 12: break
    p.wait_for_timeout(250)
g.close()
