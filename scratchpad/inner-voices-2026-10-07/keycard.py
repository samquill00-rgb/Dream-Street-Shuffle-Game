"""Switch keyCardOneLine on and off: the chippy ticket's card, with and without the object's line. Args: OUT W H"""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
OUT = sys.argv[1]; W, H = int(sys.argv[2]), int(sys.argv[3]); os.makedirs(OUT, exist_ok=True)
g = Game(width=W, height=H)
for on in (False, True):
    p = g.page("Chinese Fish and Chips", "(set: $inisToldOfPillars to true)(set: $hadChippy to false)(set: $enteredVenue to true)")
    p.evaluate("(on) => { window.DSS_VOICES.switches.keyCardOneLine = on; }", on)
    Game.click(p, "BEGIN", 1200)
    for _ in range(200):
        if p.evaluate("() => !!document.querySelector('#cf-wrap canvas') && document.getElementById('cf-wrap').dataset.cam === 'idle' && !!document.getElementById('cf-wrap').dataset.words"): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(1200)
    try: p.click('tw-story > .dss-room-fixed .dss-room-dismiss', timeout=2500)
    except Exception: pass
    p.wait_for_timeout(1500); Game.clear_overlays(p)
    p.evaluate("() => window._dssThreeRegistry['cf-wrap'].look('the ticket')"); p.wait_for_timeout(1500)
    r = p.evaluate("() => { const d=document.querySelector('#cf-wrap .dss-room-card'); return [...d.children].map(c => c.textContent.trim().slice(0, 50)); }")
    print('oneLine', on, json.dumps(r, ensure_ascii=False), p._errs[:1])
    p.screenshot(path=os.path.join(OUT, 'key-card-one-line-%s.png' % ('on' if on else 'off'))); p.close()
g.close()
