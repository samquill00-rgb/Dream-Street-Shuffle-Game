"""Timed shots around a press: BEGIN on the title, then Step into the night. Args OUT"""
import sys, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
g = Game(width=1440, height=900); p = g.page(None, "", audit_header=False); p.wait_for_timeout(2500)
for label, text in [("begin", "BEGIN"), ("step", "Step into the night")]:
    p.evaluate("(t) => { const l=[...document.querySelectorAll('tw-link')].find(e=>e.textContent.trim()===t); l && l.click(); }", text)
    for ms in (0, 250, 500, 800, 1100, 1500, 2000):
        p.wait_for_timeout(ms - (0 if ms==0 else [0,250,500,800,1100,1500,2000][[0,250,500,800,1100,1500,2000].index(ms)-1]))
        info = p.evaluate("() => [...document.querySelectorAll('tw-passage')].map(e=>({op:getComputedStyle(e).opacity.slice(0,4), h:e.offsetHeight, txt:e.innerText.trim().slice(0,20)}))")
        print(label, ms, info, flush=True)
        p.screenshot(path=os.path.join(OUT, "%s-%04d.png" % (label, ms)))
    p.wait_for_timeout(3000)
g.close()
