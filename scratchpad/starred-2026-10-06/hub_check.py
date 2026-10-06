"""Dean Street: the map's door plates and a shot. Args: OUT W H"""
import sys, json
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
out, W, H = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
g = Game(width=W, height=H)
p = g.page("Dean Street", "(set: $knowsRonnies to true)(set: $knowsLackland to true)(set: $hasTrishaMatchbook to true)", audit_header=False); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
p.wait_for_timeout(5000); Game.clear_overlays(p)
print(W, "plates:", p.evaluate("() => [...document.querySelectorAll('.soho-door-label')].map(b=>b.textContent.trim().replace(/\\s+/g,' '))"))
print(W, "links:", p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].map(l=>l.textContent.trim()).filter(t=>/[’']/.test(t))"))
p.screenshot(path=out); g.close()
