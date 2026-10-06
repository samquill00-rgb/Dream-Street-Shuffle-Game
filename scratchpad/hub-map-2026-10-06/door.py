import sys, os, json
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
OUT, W, H = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
g = Game(width=W, height=H)
p = g.page("Dean Street", audit_header=False); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
p.wait_for_timeout(3000); Game.clear_overlays(p)
p.evaluate("() => document.querySelector('.soho-map-stage canvas').focus({preventScroll:true})")
p.keyboard.down("ArrowDown"); p.wait_for_timeout(2300); p.keyboard.up("ArrowDown"); p.wait_for_timeout(600)
labs = p.evaluate("""() => [...document.querySelectorAll('.soho-map-stage [aria-label]')].filter(e=>e.style.visibility!=='hidden').map(e=>{const r=e.getBoundingClientRect(); return {a:e.getAttribute('aria-label'), x:r.x+r.width/2, y:r.y+r.height/2, w:r.width}})""")
print("visible labels", [(l['a'], round(l['y'])) for l in labs])
p.screenshot(path=os.path.join(OUT, "after-walk-%sx%s.png" % (W, H)))
opn = [l for l in labs if 'Not tonight' not in l['a'] and 'A map of Soho' not in l['a'] and l['w'] > 0 and 0 < l['y'] < H]
if opn:
    t = opn[0]; print("clicking", t['a'], round(t['x']), round(t['y']))
    p.mouse.click(t['x'], t['y']); p.wait_for_timeout(3500)
    print("tags", p.evaluate("() => document.querySelector('tw-passage')?.getAttribute('tags')"), "|", p.evaluate("() => (document.querySelector('tw-passage')?.innerText||'').slice(0,120).replace(/\\n/g,' ')"))
    p.screenshot(path=os.path.join(OUT, "after-door-%sx%s.png" % (W, H)))
print("errs", [e[:100] for e in p._errs if 'audio' not in e.lower()][:3])
p.close(); g.close()
