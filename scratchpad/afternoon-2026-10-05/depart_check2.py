import sys, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
OUT = sys.argv[1]
g = Game(width=1440, height=900)
# 1. real mouse press on a plain page link
p = g.page("Colony Member", audit_header=False); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p); p.wait_for_timeout(2500)
p.screenshot(path=os.path.join(OUT, "02-depart-before-press.png"))
box = p.evaluate("() => { const l=[...document.querySelectorAll('tw-story .dss-threshold tw-link')].pop(); const r=l.getBoundingClientRect(); return [r.x+r.width/2, r.y+r.height/2]; }")
p.mouse.click(box[0], box[1]); p.wait_for_timeout(130); p.screenshot(path=os.path.join(OUT, "02-depart-130ms.png")); p.wait_for_timeout(2500)
print("1 plain ->", Game.name(p), [e[:60] for e in p._errs if 'audio' not in e.lower()]); p.close()
# 2. a (link:) hook that only reveals text should not dim: Lackland's office LORE? use the hub NOTEBOOK (lifted header)
p = g.page("Dean Street", audit_header=False); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
p.wait_for_timeout(2000); Game.clear_overlays(p)
r = p.evaluate("""() => new Promise(res => { const l=[...document.querySelectorAll('tw-link')].find(l=>l.textContent.trim()==='NOTEBOOK'); const out=[]; const t0=performance.now();
  const tick=()=>{ out.push([Math.round(performance.now()-t0), getComputedStyle(document.querySelector('tw-passage')).opacity, document.querySelector('tw-story').className]); if(performance.now()-t0<400) requestAnimationFrame(tick); else res(out); };
  l.click(); tick(); })""")
print("2 notebook samples", r[::6], "open?", p.evaluate("() => !!document.querySelector('.notebook-overlay, #notebook-overlay, .nb-overlay, [class*=notebook]')"))
p.close()
# 3. minigame hidden exit: Nazca Race win span
p = g.page("Nazca Race", audit_header=False); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p); p.wait_for_timeout(2500)
p.evaluate("() => document.querySelector('#nz-race-win tw-link').click()"); p.wait_for_timeout(2500)
print("3 nazca win ->", Game.name(p), [e[:60] for e in p._errs if 'audio' not in e.lower()]); p.close()
g.close()
