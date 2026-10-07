"""Inner voices: per room, the card shows voices; keys sit on their objects; trails, callbacks, id; failure fallback."""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
OUT = sys.argv[1]; W, H = int(sys.argv[2]), int(sys.argv[3]); only = sys.argv[4:]
os.makedirs(OUT, exist_ok=True)
TOLD = "(set: $inisToldOfPillars to true)"
# key, passage, wrap, seeds, key object, seen-before (localStorage), objects to open
V = [
 ("chippy", "Chinese Fish and Chips", "cf-wrap", TOLD + "(set: $hadChippy to false)", "ticket", ["oi/the globe", "fi/the window"], ["the ticket", "the menu", "the window", "the range"]),
 ("french", "The French", "fi-wrap", TOLD, "lighter", ["ci/the piano", "pi/the lattice window"], ["the bar", "the blue door"]),
 ("coach", "Coach and Horses bar", "cb-wrap", TOLD, "slip", [], ["his glass", "the gents"]),
 ("lackland", "Martin Lackland's Office", "lk-wrap", TOLD + "(set: $knowsLackland to true)", "eye", ["oi/the glass case"], ["the dish", "the shelves"]),
 ("trishas", "Trisha's", "ti-wrap", TOLD, "cocaine", [], ["the door to the back", "the jukebox"]),
 ("shop", "O'Flatterly's shop", "oi-wrap", "", None, [], ["the counter", "the globe", "the bell"]),
 ("cellar", "Turn to Copper", "cu-wrap", "", None, [], ["the bulb", "the stairs"]),
 ("colony", "The Colony Room", "ci-wrap", "", None, [], ["the piano", "the window"]),
 ("pillars", "Entering The Pillars of Hercules", "pi-wrap", "(set: $metCritic to true)", None, [], ["the lattice window"]),
 ("ronnies", "Ronnie Scott's", "ri-wrap", "(set: $knowsRonnies to true)", None, [], ["the empty table", "the photographs"]),
]
SOB = int(os.environ.get("SOB", "60"))
g = Game(width=W, height=H)
res = {}
for key, pas, w, seeds, kid, seen, objs in V:
    if only and key not in only: continue
    p = g.page(pas, seeds + "(set: $enteredVenue to true)(set: $sobriety to %d)(set: $nightPhase to 0)" % SOB)
    p.evaluate("(s) => localStorage.setItem('dssVoicesSeen', JSON.stringify(s))", seen)
    Game.click(p, "BEGIN", 1200)
    for _ in range(200):
        if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle' && !!document.getElementById(w).dataset.words", w): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(1500)
    try: p.click('tw-story > .dss-room-fixed .dss-room-dismiss', timeout=3000)
    except Exception as e: pass
    p.wait_for_timeout(2500)
    r = {"keyPopup": p.evaluate("() => !!document.getElementById('dss-key-overlay')")}
    Game.clear_overlays(p)
    p.screenshot(path=os.path.join(OUT, "%s-0-room.png" % key))
    r["warm"] = p.evaluate("(w) => { const e=window._dssThreeRegistry[w]; const gr=e.scene.getObjectByName('restGlow'); return e.hotspots.map((h,i)=>[h.name, gr.children[i].material.color.g]).filter(x=>x[1]<0.99).map(x=>x[0]); }", w)
    cards = {}
    for oi, name in enumerate(objs):
        at = p.evaluate("([w,n]) => { const e=window._dssThreeRegistry[w]; const i=e.hotspots.findIndex(h=>h.name===n); if(i<0) return null; const gr=e.scene.getObjectByName('restGlow'); const s=gr.children[i]; const v=s.position.clone().project(e.camera); const c=document.querySelector('#'+w+' canvas'); const rc=c.getBoundingClientRect(); return [rc.left+(v.x+1)/2*rc.width, rc.top+(1-v.y)/2*rc.height]; }", [w, name])
        if not at: cards[name] = "no spot"; continue
        p.mouse.move(at[0], at[1]); p.wait_for_timeout(400); p.mouse.down(); p.mouse.up()
        for _ in range(60):
            if p.evaluate("(w) => document.getElementById(w).dataset.cam", w) == 'inspect': break
            p.wait_for_timeout(150)
        if p.evaluate("(w) => document.getElementById(w).dataset.cam", w) != 'inspect' or p.evaluate("(w) => (document.querySelector('#'+w+' .dss-room-card')||{}).firstChild?.textContent", w) != name:
            if p.evaluate("(w) => document.getElementById(w).dataset.cam", w) == 'inspect':
                p.mouse.click(5, H // 2); p.wait_for_timeout(2000)
            p.evaluate("([w,n]) => window._dssThreeRegistry[w].look(n)", [w, name])
        p.wait_for_timeout(1800)
        c = p.evaluate("(w) => { const d=document.querySelector('#'+w+' .dss-room-card'); if(!d||d.style.opacity!=='1') return null; const r=d.getBoundingClientRect(); return {name: d.firstChild.textContent, voices:[...d.querySelectorAll('.dss-voice')].map(v=>v.className.replace('dss-voice dss-voice-','')+': '+v.textContent), buttons:[...d.querySelectorAll('.fi-action')].map(b=>b.textContent), art: !!d.querySelector('.dss-card-keyart svg'), top: Math.round(r.top), h: Math.round(r.height)}; }", w)
        cards[name] = c
        p.screenshot(path=os.path.join(OUT, "%s-%d-%s.png" % (key, oi + 1, name.replace(' ', '-').replace('’', ''))))
        # press the key, if this card offers it
        if c and kid and any(b.startswith("Pocket the") for b in c["buttons"]):
            p.evaluate("(w) => [...document.querySelectorAll('#'+w+' .dss-room-card .fi-action')].find(b=>b.textContent.startsWith('Pocket the')).click()", w)
            p.wait_for_timeout(1500)
            r["slip"] = p.evaluate("() => [...document.querySelectorAll('.dss-inline-hint, .dss-notice, [class*=hint]')].map(e=>e.textContent.trim()).filter(Boolean).slice(-2)")
            p.screenshot(path=os.path.join(OUT, "%s-key-taken.png" % key))
        else:
            p.mouse.click(5, H // 2)
        for _ in range(60):
            if p.evaluate("(w) => document.getElementById(w).dataset.cam", w) == 'idle': break
            p.wait_for_timeout(150)
        p.wait_for_timeout(600)
    r["cards"] = cards
    r["seenNow"] = p.evaluate("() => JSON.parse(localStorage.getItem('dssVoicesSeen')||'[]')")
    if os.environ.get("FAIL") and kid:
        r["offersBeforeFail"] = p.evaluate("() => [...document.querySelectorAll('tw-passage .dss-key-offer')].map(o=>o.dataset.key+':'+o.dataset.kind+':'+o.querySelectorAll('tw-link').length)")
        p.evaluate("() => { window._dssKeyPopupSeenGen = -1; window.dssSceneFailed(new Error('test'), 'frame'); }")
        p.wait_for_timeout(3500)
        r["popupAfterFail"] = p.evaluate("() => !!document.getElementById('dss-key-overlay')")
        p.screenshot(path=os.path.join(OUT, "%s-after-fail.png" % key))
    Game.click(p, "AUDIT READ", 400)
    r["state"] = p.evaluate("() => { const s=document.querySelector('#audit-state')?.innerText||''; return s.split('\\n').filter(l=>/dreamKey|^key|lilyCount/.test(l)); }")
    r["jsErrors"] = p._errs[:3]
    res[key] = r; print(key, json.dumps(r, ensure_ascii=False, indent=0), flush=True)
    p.close()
g.close()
