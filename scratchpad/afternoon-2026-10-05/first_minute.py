"""Walk the real opening: title, BEGIN, the typewriter pages, the hub. Shots at each step. Args: OUT [W H] [tag]"""
import sys, os, time
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
W = int(sys.argv[2]) if len(sys.argv) > 2 else 1440; H = int(sys.argv[3]) if len(sys.argv) > 3 else 900
TAG = sys.argv[4] if len(sys.argv) > 4 else "desktop"
g = Game(width=W, height=H)
p = g.page(None, audit_header=False)
def shot(n): 
    try: p.screenshot(path=os.path.join(OUT, "%s-%s.png" % (TAG, n)))
    except Exception as e: print("shot fail", n, e)
def links():
    return p.evaluate("() => [...document.querySelectorAll('tw-link, .dss-room-strip button, button')].filter(e=>e.getClientRects().length).map(e=>e.tagName.toLowerCase()+':'+e.textContent.trim().slice(0,40))")
def at():
    return p.evaluate("() => { const tp=document.querySelector('tw-passage'); return tp ? tp.getAttribute('tags') : '?'; }")
p.wait_for_timeout(1500); shot("01-title-1s"); p.wait_for_timeout(2500); shot("01-title-4s")
print("title links", links(), flush=True)
Game.click(p, "BEGIN", 300); shot("02-after-begin-0.3s"); p.wait_for_timeout(1200); shot("02-after-begin-1.5s"); p.wait_for_timeout(3000); shot("02-after-begin-4.5s")
print("step", at(), links(), flush=True)
for i in range(8):
    ls = links()
    cand = [l for l in ls if l.startswith('tw-link:')]
    if not cand: break
    txt = cand[-1].split(':',1)[1]
    Game.click(p, txt, 400); shot("%02d-%s-0.4s" % (i+3, txt[:12].replace(' ','_')))
    p.wait_for_timeout(2600); shot("%02d-%s-3s" % (i+3, txt[:12].replace(' ','_')))
    Game.clear_overlays(p)
    print("step", i, txt, "->", at(), links(), flush=True)
    if 'hub' in (at() or ''): break
print("errs", p._errs[:3]); print("cons", [c for c in p._cons if 'audio' not in str(c).lower()][:5])
# full page of the hub
try: p.screenshot(path=os.path.join(OUT, "%s-hub-full.png" % TAG), full_page=True)
except Exception as e: print(e)
print("hub map top", p.evaluate("() => { const m=document.querySelector('.soho-map-stage, .soho-map, svg.soho-map'); return m? Math.round(m.getBoundingClientRect().top) : null; }"))
p.close(); g.close()
