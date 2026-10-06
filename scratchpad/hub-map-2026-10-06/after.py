"""After shots + walk test. Args: OUT W H [walk]"""
import sys, os, json
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
OUT, W, H = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); walk = len(sys.argv) > 4
g = Game(width=W, height=H)
p = g.page("Dean Street", audit_header=False); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
p.wait_for_timeout(3000); Game.clear_overlays(p)
JS = """() => { const st=document.querySelector('.soho-map-stage'), cv=st.querySelector('canvas'), bar=document.querySelector('.soho-map-bar'); const r=st.getBoundingClientRect();
 return {top: Math.round(r.top+pageYOffset), bottom: Math.round(r.bottom+pageYOffset), barBottom: Math.round(bar.getBoundingClientRect().bottom+pageYOffset), sw: st.clientWidth, cvW: cv.width, cvH: cv.height, rows: cv.height/16-3, innerH: innerHeight, docH: document.documentElement.scrollHeight,
  labels: [...st.querySelectorAll('.soho-map-stage > *:not(canvas)')].filter(e=>e.style.visibility!=='hidden' && e.textContent.trim()).map(e=>e.textContent.trim()).slice(0,12)}; }"""
info = p.evaluate(JS); print(W, H, json.dumps(info), "errs", [e[:100] for e in p._errs if 'audio' not in e.lower()][:3], flush=True)
p.screenshot(path=os.path.join(OUT, "after-hub-%sx%s.png" % (W, H)))
if walk:
    p.evaluate("() => document.querySelector('.soho-map-stage canvas').focus({preventScroll:true})")
    for key, ms in (("ArrowDown", 3700), ("ArrowRight", 1500)):
        p.keyboard.down(key); p.wait_for_timeout(ms); p.keyboard.up(key); p.wait_for_timeout(300)
        print(key, p.evaluate("() => document.querySelector('.smb-place')?.textContent.trim()"), p.evaluate("() => document.querySelector('tw-passage')?.getAttribute('tags')"), "scrollY", p.evaluate("() => pageYOffset"))
    p.screenshot(path=os.path.join(OUT, "after-walk-%sx%s.png" % (W, H)))
    # keep walking up Dean Street until a door takes us somewhere
    for i in range(8):
        p.keyboard.down("ArrowRight"); p.wait_for_timeout(500); p.keyboard.up("ArrowRight"); p.wait_for_timeout(600)
        tags = p.evaluate("() => document.querySelector('tw-passage')?.getAttribute('tags')")
        print("step", i, p.evaluate("() => document.querySelector('.smb-place')?.textContent.trim()"), tags, flush=True)
        if tags is not None and 'hub' not in tags: break
    p.wait_for_timeout(1500); p.screenshot(path=os.path.join(OUT, "after-door-%sx%s.png" % (W, H)))
    print("landed", p.evaluate("() => (document.querySelector('tw-passage')?.innerText||'').slice(0,160).replace(/\\n/g,' | ')"))
p.close(); g.close()
