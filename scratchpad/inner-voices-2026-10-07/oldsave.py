"""Old saves: a browser that played main (before the voices) opens this branch.
Main's build (main-before-voices.html, served beside the branch's) writes what a player of main keeps in this
browser: a finished world (Himalayas) in the gifts, the legacy worlds list, mute, the napkin, and a Harlowe
'Saved Game' slot. Then the branch: the French offers the lighter's world is walked, so the bar offers no lighter (the game spends
that key at night start, as on main); Lackland's eye pockets; a garbled voices list does not break a room.
Args: OUT"""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
g = Game(width=1440, height=900)
ctx = g.b.new_context(viewport={"width": 1440, "height": 900})
class Shared:
    def new_page(self, **kw): return ctx.new_page()
real_b = g.b; g.b = Shared()
# 1. main's build, as a player of main left it
p = ctx.new_page(); errs = []; p.on("pageerror", lambda e: errs.append(str(e)))
p.goto("http://localhost:8777/main-before-voices.html", wait_until="domcontentloaded"); p.wait_for_timeout(4000)
p.evaluate("""() => { window.dssAddLifetimeGift('himalayas'); window.dssSaveLifetimeWorlds(['himalayas']);
  localStorage.setItem('dssMuted2', '1'); localStorage.setItem('dss_napkin', 'data:image/png;base64,iVBORw0KGgo=');
  localStorage.setItem('(Saved Game Dream Street Shuffle) Slot A', '{"old":true}'); }""")
print("main wrote:", p.evaluate("() => Object.keys(localStorage)"), "voices store on main:", p.evaluate("() => localStorage.getItem('dssVoicesSeen')"), "main errors:", [e[:60] for e in errs if 'decode' not in e])
p.close()
def enter(pas, room, seeds):
    p = g.page(pas, "(set: $inisToldOfPillars to true)(set: $enteredVenue to true)" + seeds)
    Game.click(p, "BEGIN", 1200)
    w = room + "-wrap"
    for _ in range(200):
        if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle' && !!document.getElementById(w).dataset.words", w): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(1200)
    try: p.click('tw-story > .dss-room-fixed .dss-room-dismiss', timeout=2500)
    except Exception: pass
    p.wait_for_timeout(1500); Game.clear_overlays(p)
    return p, w
def take(p, w, name):
    p.evaluate("([w,n]) => window._dssThreeRegistry[w].look(n)", [w, name]); p.wait_for_timeout(1200)
    b = p.evaluate("(w) => [...document.querySelectorAll('#'+w+' .dss-room-card .fi-action')].map(b=>b.textContent)", w)
    p.evaluate("(w) => { const b=[...document.querySelectorAll('#'+w+' .dss-room-card .fi-action')].find(b=>/^Pocket the|^Leave the/.test(b.textContent)); if (b) b.click(); }", w)
    p.wait_for_timeout(1800); Game.click(p, "AUDIT READ", 400)
    s = p.evaluate("() => (document.querySelector('#audit-state')?.innerText||'').split('\\n').filter(l=>/^dreamKey|^keyLighter|^keyEye/.test(l))")
    return b, s
# 2. the branch, same browser
p, w = enter("The French", "fi", "")
print("french card:", *take(p, w, "the bar"), "gifts:", p.evaluate("() => window.dssLoadLifetimeGifts()"), "errors:", [e[:60] for e in p._errs if 'decode' not in e])
p.close()
p, w = enter("Martin Lackland's Office", "lk", "(set: $knowsLackland to true)")
print("lackland card:", *take(p, w, "the dish"), "errors:", [e[:60] for e in p._errs if 'decode' not in e])
p.close()
# 3. a garbled voices list (hand-edited, or from some other build)
for bad in ('{"not":"a list"}', 'not json at all', '[1, null, "fi/the window"]'):
    p = ctx.new_page(); p.goto("http://localhost:8777/", wait_until="domcontentloaded"); p.evaluate("(b) => localStorage.setItem('dssVoicesSeen', b)", bad); p.close()
    p, w = enter("Chinese Fish and Chips", "cf", "(set: $hadChippy to false)")
    p.evaluate("([w]) => window._dssThreeRegistry[w].look('the window')", [w]); p.wait_for_timeout(1200)
    v = p.evaluate("(w) => [...document.querySelectorAll('#'+w+' .dss-room-card .dss-voice')].map(e=>e.textContent)", w)
    print("garbled", bad, "->", v, "errors:", [e[:60] for e in p._errs if 'decode' not in e])
    p.close()
ctx.close(); g.b = real_b; g.close()
