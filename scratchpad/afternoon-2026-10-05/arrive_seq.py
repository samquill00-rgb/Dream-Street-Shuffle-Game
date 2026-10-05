"""Timed shots of a room's arrival. Args OUT PRE then route steps; the last step is the press to time."""
import sys, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
OUT, PRE = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True); STEPS = sys.argv[3:]
g = Game(width=1440, height=900); p = g.page(None, ""); p.wait_for_timeout(2000)
def click_text(text):
    return p.evaluate("""(text) => { const els=[...document.querySelectorAll('tw-link, button, [role=button], div, span, a')].filter(e=>e.textContent.trim()===text && e.getClientRects().length && ![...e.children].some(c=>c.textContent.trim()===text)); if(!els.length) return false; els[els.length-1].click(); return true; }""", text)
for i, st in enumerate(STEPS):
    k, _, a = st.partition(':')
    if k == 'wait': p.wait_for_timeout(int(a)); continue
    last = i == len(STEPS) - 1
    print("press", a, click_text(a), flush=True)
    if last:
        prev = 0
        for ms in (300, 600, 900, 1200, 1500, 1800, 2100, 2500, 3000, 4000):
            p.wait_for_timeout(ms - prev); prev = ms
            info = p.evaluate("() => { const tp=[...document.querySelectorAll('tw-passage')].filter(e=>!e.closest('.dss-ghost')).pop(); const v=document.querySelector('.dss-room-veil'); return {op: tp?getComputedStyle(tp).opacity.slice(0,4):null, veil: v?(v.className+' op='+getComputedStyle(v).opacity.slice(0,4)):null, at: document.querySelector('#audit-name')?.textContent, canvas: !!document.querySelector('tw-passage canvas')}; }")
            print(ms, info, flush=True); p.screenshot(path=os.path.join(OUT, "%s-%04d.png" % (PRE, ms)))
g.close()
