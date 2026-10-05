"""Press a link and sample opacity through the departure; then walk a few navigations for errors. Args: OUT"""
import sys, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
g = Game(width=1440, height=900)
# plain page -> next
p = g.page("Colony Member", audit_header=False); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p); p.wait_for_timeout(2500)
print("links", p.evaluate("() => [...document.querySelectorAll('tw-link:not(#stat-bars-lifted tw-link)')].map(l=>l.textContent.trim())"))
samples = p.evaluate("""() => new Promise(res => { const l=[...document.querySelectorAll('tw-link:not(#stat-bars-lifted tw-link)')].pop(); const out=[]; const t0=performance.now();
  const tick=()=>{ const tp=document.querySelector('tw-passage'); const v=document.querySelector('tw-story > .dss-threshold'); out.push([Math.round(performance.now()-t0), tp?getComputedStyle(tp).opacity:'-', v?getComputedStyle(v).opacity:'-', tp?tp.getAttribute('data-dss-threshold'):'-', document.querySelectorAll('tw-passage').length]); if(performance.now()-t0<1400) requestAnimationFrame(tick); else res(out); };
  l.click(); tick(); })""")
for sm in samples[::4]: print(sm)
p.screenshot(path=os.path.join(OUT, "depart-mid.png"))
print("at", Game.name(p), "errs", p._errs[:2]); p.close()
# hub -> approach link via real mouse click, then back
p = g.page("Dean Street", audit_header=False); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
p.wait_for_timeout(2000); Game.clear_overlays(p)
box = p.evaluate("() => { const l=[...document.querySelectorAll('tw-link:not(#stat-bars-lifted tw-link)')].find(l=>l.getClientRects().length); if(!l) return null; const r=l.getBoundingClientRect(); return [l.textContent.trim(), r.x+r.width/2, r.y+r.height/2]; }")
print("mouse press", box)
if box:
    p.mouse.click(box[1], box[2]); p.wait_for_timeout(120); p.screenshot(path=os.path.join(OUT, "depart-hub-120ms.png")); p.wait_for_timeout(2500)
    print("now at", p.evaluate("() => document.querySelector('tw-passage')?.getAttribute('tags')"), "errs", p._errs[:2])
p.close(); g.close()
