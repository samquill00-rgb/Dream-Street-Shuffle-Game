"""Two approach scenes after the caption change. Args: OUT PRE"""
import sys, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
OUT, PRE = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
g = Game(width=1440, height=900)
for key, pas in [("approach-lacklands", "Approach Lacklands Office"), ("approach-ronnies", "Approach Ronnie Scott's")]:
    p = g.page(pas, "", audit_header=False); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p); p.wait_for_timeout(6000); Game.clear_overlays(p)
    cap = p.evaluate("() => [...document.querySelectorAll('tw-passage div, tw-passage span')].map(e=>e.textContent.trim()).filter(t=>/, (FRITH|GREEK|DEAN) STREET/.test(t)).slice(0,3)")
    print(PRE, key, Game.name(p), cap, "errs", [e[:80] for e in p._errs if 'audio' not in e.lower()][:2], flush=True)
    p.screenshot(path=os.path.join(OUT, "%s-%s.png" % (PRE, key))); p.close()
g.close()
