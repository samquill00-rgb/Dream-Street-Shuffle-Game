"""Fresh save, each trail step by step: the seen flags carry from room to room as a save would.
Per step: is the object glowing warm before it is opened, does the card show the trail line, does the last step offer the key.
Then the key is pocketed and (eye) the Ezekiel gate is checked at the Third Pillar Portal.
Args: OUT W H [trail keys]"""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
OUT = sys.argv[1]; W, H = int(sys.argv[2]), int(sys.argv[3]); only = sys.argv[4:]
os.makedirs(OUT, exist_ok=True)
TOLD = "(set: $inisToldOfPillars to true)"
ROOMS = {
 "fi": ("The French", TOLD), "ci": ("The Colony Room", TOLD), "pi": ("Entering The Pillars of Hercules", TOLD + "(set: $metCritic to true)"),
 "cf": ("Chinese Fish and Chips", TOLD + "(set: $hadChippy to false)"), "cb": ("Coach and Horses bar", TOLD),
 "lk": ("Martin Lackland's Office", TOLD + "(set: $knowsLackland to true)"), "ti": ("Trisha's", TOLD),
 "oi": ("O'Flatterly's shop", TOLD), "cu": ("Turn to Copper", TOLD),
}
TRAILS = {
 "cocaine": ["cu/the bulb", "ti/the jukebox", "ti/the door to the back"],
 "ticket": ["oi/the globe", "cf/the menu", "cf/the ticket"],
 "slip": ["cu/the chesterfield", "cb/the gents", "cb/his glass"],
 "eye": ["oi/the glass case", "lk/the shelves", "lk/the dish"],
 "lighter": ["ci/the piano", "pi/the lattice window", "fi/the bar"],
}
g = Game(width=W, height=H)
def enter(room, seen, extra=""):
    pas, seeds = ROOMS[room]
    p = g.page(pas, seeds + extra + "(set: $enteredVenue to true)(set: $sobriety to 60)(set: $nightPhase to 0)")
    p.evaluate("(s) => localStorage.setItem('dssVoicesSeen', JSON.stringify(s))", seen)
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
def open_obj(p, w, name):
    warm = p.evaluate("([w,n]) => { const e=window._dssThreeRegistry[w]; const gr=e.scene.getObjectByName('restGlow'); const i=e.hotspots.findIndex(h=>h.name===n); return i<0 ? 'no spot' : gr.children[i].material.color.g < 0.99; }", [w, name])
    p.evaluate("([w,n]) => window._dssThreeRegistry[w].look(n)", [w, name])
    p.wait_for_timeout(1200)
    c = p.evaluate("(w) => { const d=document.querySelector('#'+w+' .dss-room-card'); if(!d) return null; const r=d.getBoundingClientRect(); return {edge: d.style.borderColor, voices:[...d.querySelectorAll('.dss-voice')].map(v=>v.className.replace('dss-voice dss-voice-','')+': '+v.textContent), buttons:[...d.querySelectorAll('.fi-action')].map(b=>b.textContent), top: Math.round(r.top), bottom: Math.round(r.bottom)}; }", w)
    return warm, c
res = {}
for key, steps in TRAILS.items():
    if only and key not in only: continue
    seen, out = [], []
    for i, at in enumerate(steps):
        room, name = at.split("/", 1)
        p, w = enter(room, seen)
        warm, c = open_obj(p, w, name)
        p.screenshot(path=os.path.join(OUT, "%s-%d-%s.png" % (key, i + 1, room)))
        step = {"at": at, "warmBefore": warm, "card": c}
        if i == len(steps) - 1:
            ok = p.evaluate("(w) => { const b=[...document.querySelectorAll('#'+w+' .dss-room-card .fi-action')].find(b=>/^Pocket the|^Leave the/.test(b.textContent)); if (b) { b.click(); return b.textContent; } return null; }", w)
            p.wait_for_timeout(1800)
            Game.click(p, "AUDIT READ", 400)
            step["pressed"] = ok
            step["state"] = p.evaluate("() => (document.querySelector('#audit-state')?.innerText||'').split('\\n').filter(l=>/dreamKey|^key/.test(l))")
        step["errors"] = p._errs[:2]
        seen = p.evaluate("() => JSON.parse(localStorage.getItem('dssVoicesSeen')||'[]')")
        p.close(); out.append(step)
    res[key] = out
    print(key, json.dumps(out, ensure_ascii=False, indent=0), flush=True)
# the Ezekiel gate: the eye in the pocket, with none and with four worlds behind it
if not only or "eye" in only:
    for label, worlds in (("no worlds", "(a:)"), ("four worlds", '(a: "himalayas", "nazca", "easter", "pyramid")')):
        p = g.page("Third Pillar Portal", TOLD + '(set: $dreamKey to "eye")(set: $keyEye to "held")(set: $worldsVisited to %s)' % worlds)
        Game.click(p, "BEGIN", 1500)
        p.wait_for_timeout(9000)
        r = {"passage": Game.name(p), "stepThrough": p.evaluate("() => [...document.querySelectorAll('#dss-portal-action tw-link')].map(e=>e.textContent)"), "notYetShown": p.evaluate("() => { const e=document.getElementById('dss-portal-notyet'); return !!e && getComputedStyle(e).display !== 'none'; }")}
        p.screenshot(path=os.path.join(OUT, "eye-portal-%s.png" % label.replace(' ', '-')))
        print("portal", label, json.dumps(r), flush=True); p.close()
g.close()
