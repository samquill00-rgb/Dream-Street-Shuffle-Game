"""Walk venue -> street -> venue with audio unmuted; count sources let go, errors. DSS_FAST."""
import sys, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
g = Game(width=1280, height=900)
p = g.page("The French", "(set: $haunts to (a: $haunt1))"); Game.click(p, "BEGIN", 1500); Game.clear_overlays(p); p.wait_for_timeout(4000)
p.evaluate("() => { window._letGoLog=[]; const A=window.dssAudio; }")
st = p.evaluate("() => { const A=window.dssAudio||{}; return Object.keys(A).filter(k=>/bed|music|Bed|Music/i.test(k)); }"); print("audio api", st)
for i in range(3):
    Game.click(p, "On.", 800)
print("at", Game.name(p), "links", p.evaluate("() => [...document.querySelectorAll('tw-link')].map(l=>l.textContent.trim()).slice(0,12)"))
# leave via the exit link in the header
ok = p.evaluate("() => { const l=[...document.querySelectorAll('#stat-bars-lifted tw-link, .stat-bars tw-link')].find(l=>/EXIT/i.test(l.textContent)); if(!l) return false; l.click(); return l.textContent.trim(); }")
p.wait_for_timeout(3000); print("exit ->", ok, Game.name(p))
print("ctx", p.evaluate("() => { try { const A=window.dssAudio; return A && A.debugState ? A.debugState() : 'n/a'; } catch(e) { return String(e); } }"))
print("errs", [e[:160] for e in p._errs if 'decode' not in e.lower()])
p.close(); g.close()
