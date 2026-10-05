import sys; sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
g = Game(width=1440, height=900)
p = g.page("Colony Member", "", audit_header=False); p.emulate_media(reduced_motion="reduce"); p.reload(); p.wait_for_timeout(1500)
print("matches at boot:", p.evaluate("() => matchMedia('(prefers-reduced-motion: reduce)').matches"))
Game.click(p, "BEGIN", 1200); Game.clear_overlays(p); p.wait_for_timeout(2500); Game.clear_overlays(p)
r = p.evaluate("""() => new Promise(res => { const l=[...document.querySelectorAll('tw-story .dss-threshold tw-link')].pop(); const t0=performance.now(); const out=[]; const tick=()=>{ out.push([Math.round(performance.now()-t0), document.querySelector('tw-story').className, document.querySelector('#audit-name')?.textContent||'']); if(performance.now()-t0<600) requestAnimationFrame(tick); else res(out); }; l.click(); tick(); })""")
print([x for i,x in enumerate(r) if i%4==0][:8]); p.close(); g.close()
