"""Browser checks: the id's three gates; a key swap keeps one key in the pocket; seen flags carried into a new night.
Args: OUT"""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
TOLD = "(set: $inisToldOfPillars to true)"
g = Game(width=1440, height=900)
# one browser profile for every page, so localStorage carries from night to night as it does for a player
ctx = g.b.new_context(viewport={"width": 1440, "height": 900})
class Shared:
    def new_page(self, **kw): return ctx.new_page()
real_b = g.b; g.b = Shared()
def enter(pas, room, seeds):
    p = g.page(pas, TOLD + "(set: $enteredVenue to true)(set: $sobriety to 60)(set: $confidence to 70)(set: $nightPhase to 0)" + seeds)
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
def card(p, w, name):
    p.evaluate("([w,n]) => window._dssThreeRegistry[w].look(n)", [w, name]); p.wait_for_timeout(1200)
    return p.evaluate("(w) => { const d=document.querySelector('#'+w+' .dss-room-card'); return d ? {voices:[...d.querySelectorAll('.dss-voice')].map(v=>v.className.replace('dss-voice dss-voice-','')+': '+v.textContent), buttons:[...d.querySelectorAll('.fi-action')].map(b=>b.textContent)} : null; }", w)
def state(p):
    Game.click(p, "AUDIT READ", 400)
    return p.evaluate("() => (document.querySelector('#audit-state')?.innerText||'').split('\\n').filter(l=>/dreamKey|^key/.test(l))")
# 1. the id: the chippy range carries the chippy's id line
for label, seeds in (("calm", ""), ("sobriety 20", "(set: $sobriety to 20)"), ("morale 25", "(set: $confidence to 25)"), ("small hours", "(set: $nightPhase to 2)")):
    p, w = enter("Chinese Fish and Chips", "cf", "(set: $hadChippy to false)" + seeds)
    c = card(p, w, "the range")
    p.screenshot(path=os.path.join(OUT, "id-%s.png" % label.replace(' ', '-')))
    print("id", label, json.dumps([v for v in c["voices"] if v.startswith("id")] if c else None, ensure_ascii=False), p._errs[:1], flush=True)
    p.close()
# 2. a key swap: the ticket in the pocket, Trisha's back door offers the cocaine
p, w = enter("Trisha's", "ti", '(set: $dreamKey to "ticket")(set: $keyTicket to "held")')
c = card(p, w, "the door to the back")
print("swap card", json.dumps(c["buttons"], ensure_ascii=False), flush=True)
p.evaluate("(w) => { const b=[...document.querySelectorAll('#'+w+' .dss-room-card .fi-action')].find(b=>/^Leave the/.test(b.textContent)); if (b) b.click(); }", w)
p.wait_for_timeout(1800)
s = state(p)
print("swap state", json.dumps(s), "held:", sum(1 for l in s if l.endswith("\theld")), flush=True)
p.screenshot(path=os.path.join(OUT, "swap.png")); p.close()
# 3. nights: the voices forget nothing between nights. Night one sees the French window; night two is a new game.
ctx.clear_cookies()
p = ctx.new_page(); p.goto("http://localhost:8777/"); p.evaluate("() => localStorage.removeItem('dssVoicesSeen')"); p.close()
p, w = enter("The French", "fi", "")
card(p, w, "the window"); p.wait_for_timeout(600)
print("night one seen", p.evaluate("() => localStorage.getItem('dssVoicesSeen')"), flush=True)
p.close()
p, w = enter("Chinese Fish and Chips", "cf", '(set: $hadChippy to false)(set: $nightsPlayed to 2)')
c = card(p, w, "the window")
print("night two chippy window", json.dumps(c["voices"], ensure_ascii=False), flush=True)
p.screenshot(path=os.path.join(OUT, "night-two-callback.png")); p.close()
ctx.close(); g.b = real_b; g.close()
