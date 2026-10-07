"""Fresh save: Dean Street -> lighter trail (Colony piano, Pillars lattice window, French bar) -> pocket -> crossing."""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
g = Game(width=1440, height=900)
p = g.page("The Colony Room", "(set: $enteredVenue to true)(set: $inisToldOfPillars to true)(set: $knowsCecilCourt to true)(set: $returnedPage to true)(set: $metCritic to true)")
p.evaluate("() => localStorage.removeItem('dssVoicesSeen')")
log = []
def links(): return p.evaluate("() => [...document.querySelectorAll('tw-link')].map(e=>e.textContent.trim()).filter(t=>t && t!=='AUDIT READ')")
def settle(ms=2500):
    p.wait_for_timeout(ms); Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 1200): break
        Game.clear_overlays(p)
def through():
    # approach scenes: press the hidden door
    for _ in range(4):
        if '·' in links(): Game.click(p, '·', 2500); settle()
        else: break
def go(text):
    ok = Game.click(p, text, 1500); settle(); through()
    if Game.name(p) == 'Maritime interlude':
        log.append(('maritime links', links())); Game.click(p, 'Yes', 2500); settle(); through()
    log.append((text, ok, Game.name(p)))
def room(w):
    for _ in range(120):
        if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w)?.dataset.cam==='idle' && !!document.getElementById(w).dataset.words", w): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(1200)
    try: p.click('tw-story > .dss-room-fixed .dss-room-dismiss', timeout=2500)
    except Exception: pass
    p.wait_for_timeout(1500)
def look(w, name, shot):
    r = p.evaluate("([w,n]) => { const e=window._dssThreeRegistry[w]; if(!e) return 'no room'; const gr=e.scene.getObjectByName('restGlow'); const i=e.hotspots.findIndex(h=>h.name===n); const warm = i>=0 ? gr.children[i].material.color.g < 0.99 : null; return {warm, opened: e.look(n)}; }", [w, name])
    p.wait_for_timeout(900)
    c = p.evaluate("(w) => { const d=document.querySelector('#'+w+' .dss-room-card'); return d ? {edge: d.style.borderColor, voices:[...d.querySelectorAll('.dss-voice')].map(v=>v.textContent), buttons:[...d.querySelectorAll('.fi-action')].map(b=>b.textContent)} : null; }", w)
    p.screenshot(path=os.path.join(OUT, shot + '.png'))
    log.append((w, name, r, c))
    return c
def back(w):
    p.mouse.click(5, 450); p.wait_for_timeout(2000)
Game.click(p, "BEGIN", 3000); settle()
log.append(("start", Game.name(p)))
room('ci-wrap')
look('ci-wrap', 'the piano', '1-colony-piano'); back('ci-wrap')
go("\u2190 Exit to the street"); log.append(("hub", links()[:30]))
go("The Pillars"); room('pi-wrap')
look('pi-wrap', 'the lattice window', '2-pillars-lattice'); back('pi-wrap')
log.append(("pillars links", links()))
go("\u2190 Exit to the street")
go("To The French"); room('fi-wrap')
c = look('fi-wrap', 'the bar', '3-french-bar')
for l in log: print(json.dumps(l, ensure_ascii=False)[:700])
log.clear()
p.evaluate("() => { const b=[...document.querySelectorAll('#fi-wrap .dss-room-card .fi-action')].find(b=>b.textContent.startsWith('Pocket the')); if (b) b.click(); }")
p.wait_for_timeout(2500); p.screenshot(path=os.path.join(OUT, '4-pocketed.png'))
go("\u2190 Exit to the street"); log.append(("hub2", links()[:30]))
go("The Pillars"); log.append(("pillars2", links()))
p.screenshot(path=os.path.join(OUT, '5-pillars-with-key.png'))
for l in log: print(json.dumps(l, ensure_ascii=False)[:600])
g.close()
