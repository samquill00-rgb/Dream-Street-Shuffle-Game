import sys, json
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
W, H = int(sys.argv[1]), int(sys.argv[2])
g = Game(width=W, height=H)
p = g.page("Dean Street", audit_header=False); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
JS = """() => { const st=document.querySelector('.soho-map-stage'), cv=st&&st.querySelector('canvas'), bar=document.querySelector('.soho-map-bar');
 const r=st.getBoundingClientRect(); return {innerH: innerHeight, innerW: innerWidth, top: Math.round(r.top+pageYOffset), sw: st.clientWidth, barH: bar.offsetHeight, cvH: cv.height, cvW: cv.width, bottom: Math.round(r.bottom+pageYOffset), scrollY: pageYOffset}; }"""
for t in (300, 1500, 3000):
    p.wait_for_timeout(t); print(t, p.evaluate(JS))
print("log", p.evaluate("() => window.__dssFitLog")); p.evaluate("() => window.dispatchEvent(new Event('resize'))"); p.wait_for_timeout(300); print('after resize', p.evaluate(JS))
p.close(); g.close()
