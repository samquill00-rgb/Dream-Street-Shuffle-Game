"""Three playtest fixes (2026-10-07): slips never fade and stack; a flower taken keeps the room; French re-entry lines in the loops."""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'audit-2026-09-16'))
from harness import Game
OUT = sys.argv[1]; W, H = int(sys.argv[2]), int(sys.argv[3]); only = sys.argv[4:]
os.makedirs(OUT, exist_ok=True)
g = Game(width=W, height=H)
res = {}

def settle_room(p, w):
    for _ in range(200):
        if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle' && !!document.getElementById(w).dataset.words", w): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(1500); Game.clear_overlays(p)

def dismiss(p):
    try: p.click('tw-story > .dss-room-fixed .dss-room-dismiss', timeout=3000); return True
    except Exception as e: print("no dismiss", e); return False

def panel_text(p):
    return p.evaluate("() => { const b=document.querySelector('tw-story > .dss-room-veil .dss-room-prose'); return b ? b.innerText.replace(/\\s+/g,' ').trim() : null; }")

def press(p, w, label):
    return p.evaluate("([w,l]) => { const b=[...document.querySelectorAll('#'+w+' .dss-room-card .fi-action')].find(b=>b.textContent===l); if(!b) return false; b.click(); return true; }", [w, label])

def open_spot(p, w, name):
    # press the keyboard row's button for the named object (rooms are keyboard-playable since #49), else fall back to the way-on buttons
    ok = p.evaluate("([w,n]) => { const r=document.querySelector('#'+w+' .dss-room-keys'); if(!r) return false; const b=[...r.querySelectorAll('button, [role=button]')].find(b=>b.textContent.trim().toLowerCase()===n); if(!b) return false; b.click(); return true; }", [w, name])
    if not ok:
        ok = p.evaluate("([w,n]) => { const b=[...document.querySelectorAll('#'+w+' .fi-wayon-btn')].find(b=>b.textContent.trim().toLowerCase()===n); if(!b) return false; b.click(); return true; }", [w, name])
    for _ in range(100):
        if p.evaluate("(w) => document.getElementById(w).dataset.cam", w) == 'inspect': break
        p.wait_for_timeout(150)
    p.wait_for_timeout(700)
    return ok

def slips(p):
    return p.evaluate("() => [...document.querySelectorAll('.dss-hint-slip')].map(c => ({text: c.querySelector('.dss-hint-type').textContent.slice(0,60), going: !!c.__dssGoing, inClass: c.classList.contains('in'), typed: c.classList.contains('typed'), x: (()=>{const r=c.querySelector('.dss-hint-x').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)];})()}))")

# ---------- 1. the slips ----------
if not only or 'slips' in only:
    p = g.page("Dean Street", "(set: $sobriety to 60)"); Game.click(p, "BEGIN", 1500)
    p.wait_for_timeout(2500); Game.clear_overlays(p)
    p.evaluate("() => window.dssInlineHint('Leave what you are carrying here; the night is long and the bag is heavy.')")
    p.wait_for_timeout(5000)
    r = {"one_after_5s": slips(p)}
    p.screenshot(path=os.path.join(OUT, "slip-1-typed.png"))
    p.screenshot(path=os.path.join(OUT, "slip-1-close-up.png"), clip=p.evaluate("() => { const r=document.querySelector('.dss-hint-slip').getBoundingClientRect(); return {x:Math.max(0,r.left-20), y:Math.max(0,r.top-20), width:r.width+40, height:r.height+40}; }"))
    p.wait_for_timeout(16000)   # the old slip went at ~10 s; this one must still be standing at 21 s
    r["one_after_21s"] = slips(p)
    p.evaluate("() => window.dssInlineHint('A second note lands above the first.')")
    p.wait_for_timeout(4000)
    r["two_stacked"] = slips(p)
    r["stack_order"] = p.evaluate("() => [...document.querySelectorAll('.dss-hint-slip')].map(c => Math.round(c.getBoundingClientRect().top))")
    p.screenshot(path=os.path.join(OUT, "slip-2-stacked.png"))
    # hover the × of the top slip
    p.hover('.dss-hint-slip:first-child .dss-hint-x'); p.wait_for_timeout(500)
    p.screenshot(path=os.path.join(OUT, "slip-3-x-hover.png"), clip=p.evaluate("() => { const r=document.querySelector('.dss-hint-slip:first-child').getBoundingClientRect(); return {x:Math.max(0,r.left-20), y:Math.max(0,r.top-20), width:r.width+40, height:r.height+40}; }"))
    p.click('.dss-hint-slip:first-child .dss-hint-x'); p.wait_for_timeout(1500)
    r["after_x_click"] = slips(p)
    # the primer (long) still shows and scrolls, and stacks with a nudge
    p.evaluate("() => window.dssShowPrimer && window.dssShowPrimer()")
    p.wait_for_timeout(9000)
    r["primer"] = slips(p)
    p.screenshot(path=os.path.join(OUT, "slip-4-primer-and-note.png"))
    # a fourth slip sends the oldest away
    p.evaluate("() => { window.dssInlineHint('Third.'); }"); p.wait_for_timeout(3000)
    p.evaluate("() => { window.dssInlineHint('Fourth.'); }"); p.wait_for_timeout(4000)
    r["cap_three"] = slips(p)
    r["jsErrors"] = p._errs[:3]
    res["slips"] = r; print("slips", json.dumps(r, ensure_ascii=False), flush=True); p.close()

# ---------- 2. the flower ----------
V = [("french", "The French", "fi-wrap", 5, "", "the window"),
     ("colony", "The Colony Room", "ci-wrap", 4, "", None),
     ("pillars", "Entering The Pillars of Hercules", "pi-wrap", 2, "(set: $metCritic to true)", None)]
for key, pas, w, n, seeds, spot in V:
    if only and key not in only: continue
    p = g.page(pas, seeds + "(set: $enteredVenue to true)(set: $sobriety to 60)(set: $frenchApproached to true)"); Game.click(p, "BEGIN", 1200)
    settle_room(p, w); dismiss(p); p.wait_for_timeout(2500)
    r = {}
    lilyAt = p.evaluate("(w) => { const e=window._dssThreeRegistry[w]; const g=e.scene.getObjectByName('restGlow'); const s=g.children.find(s=>s.visible && s.renderOrder===999); if(!s) return null; const v=s.position.clone().project(e.camera); const c=document.querySelector('#'+w+' canvas'); const r=c.getBoundingClientRect(); return [r.left+(v.x+1)/2*r.width, r.top+(1-v.y)/2*r.height]; }", w)
    r["lilyAt"] = lilyAt
    if lilyAt:
        x, y = lilyAt
        p.mouse.move(x, y); p.wait_for_timeout(400); p.mouse.down(); p.mouse.up()
        for _ in range(150):
            if p.evaluate("(w) => document.getElementById(w).dataset.cam", w) == 'inspect': break
            p.wait_for_timeout(150)
        p.wait_for_timeout(700)
        p.screenshot(path=os.path.join(OUT, "flower-%s-1-card.png" % key))
        r["pressed"] = press(p, w, 'Always take a flower')
        for _ in range(150):
            if p.evaluate("(w) => document.getElementById(w).dataset.cam", w) == 'idle': break
            p.wait_for_timeout(150)
        p.wait_for_timeout(3500)
        r["after"] = p.evaluate("([n,w]) => { const h=document.querySelector('tw-hook[name=\"lily'+n+'\"]'); const e=window._dssThreeRegistry[w]; const g=e.scene.getObjectByName('restGlow'); return {glimpse: h && !!h.querySelector('.lily-glimpse'), words: document.getElementById(w).dataset.words, veilOn: !!document.querySelector('tw-story > .dss-room-veil.dss-room-veil-on'), lilySprites: g.children.filter(s=>s.visible && s.renderOrder===999).length}; }", [n, w])
        r["modal"] = p.evaluate("() => { const o=document.getElementById('dss-lily-overlay'); return o ? {text: o.innerText.replace(/\\s+/g,' ').trim().slice(0,220), svg: !!o.querySelector('svg'), focusInside: o.contains(document.activeElement)} : null; }")
        p.screenshot(path=os.path.join(OUT, "flower-%s-2-modal.png" % key))
        p.click('#dss-lily-overlay .dss-lily-close'); p.wait_for_timeout(1200)
        r["afterClose"] = p.evaluate("(w) => ({modalGone: !document.getElementById('dss-lily-overlay'), words: document.getElementById(w).dataset.words, veilOn: !!document.querySelector('tw-story > .dss-room-veil.dss-room-veil-on'), slips: document.querySelectorAll('.dss-hint-slip').length})", w)
        p.screenshot(path=os.path.join(OUT, "flower-%s-3-after.png" % key))
    Game.click(p, "AUDIT READ", 400)
    r["state"] = p.evaluate("() => (document.querySelector('#audit-state')?.textContent||'').slice(0,60)")
    r["jsErrors"] = p._errs[:3]
    res["flower-" + key] = r; print("flower", key, json.dumps(r, ensure_ascii=False), flush=True); p.close()

# ---------- 3. the French re-entry ----------
if not only or 'french-reentry' in only:
    for visit, label, spotname in [(2, 'Approach the artists', 'the painter'), (3, 'Approach', 'the novelist')]:
        # a return visit: FrenchVisits counts the approaches from the street; the passage bumps it when $frenchApproached is set
        seeds = "(set: $visited's FrenchVisits to %d)(set: $frenchApproached to true)(set: $enteredVenue to true)(set: $sobriety to 60)" % (visit - 1)
        p = g.page("The French", seeds); Game.click(p, "BEGIN", 1200)
        settle_room(p, "fi-wrap")
        r = {"visit": visit}
        r["entryPanel"] = panel_text(p)
        p.screenshot(path=os.path.join(OUT, "french-visit%d-1-entry-panel.png" % visit))
        dismiss(p); p.wait_for_timeout(2000)
        r["opened"] = open_spot(p, "fi-wrap", spotname)
        r["card"] = p.evaluate("() => [...document.querySelectorAll('#fi-wrap .dss-room-card .fi-action')].map(b=>b.textContent)")
        p.screenshot(path=os.path.join(OUT, "french-visit%d-2-figure-card.png" % visit))
        r["pressed"] = press(p, "fi-wrap", label)
        p.wait_for_timeout(3500)
        r["passage"] = Game.name(p)
        r["loopPanel"] = panel_text(p)
        p.screenshot(path=os.path.join(OUT, "french-visit%d-3-loop.png" % visit))
        # back to the French (Not now / nothing), then another figure: the line must not repeat this visit
        if visit == 2:
            Game.click(p, "Sit with him", 1500)
            r["nextPanel"] = panel_text(p)
        r["jsErrors"] = p._errs[:3]
        res["french-visit%d" % visit] = r; print("french", visit, json.dumps(r, ensure_ascii=False), flush=True); p.close()
    # first visit: the opening prose stays as it was, and no re-entry line in the loop
    p = g.page("The French", "(set: $visited's French to false)(set: $frenchApproached to true)(set: $enteredVenue to true)(set: $sobriety to 60)", base=False); Game.click(p, "BEGIN", 1200)
    settle_room(p, "fi-wrap")
    r = {"entryPanel": (panel_text(p) or '')[:120]}
    dismiss(p); p.wait_for_timeout(1500)
    r["opened"] = open_spot(p, "fi-wrap", "the painter"); r["pressed"] = press(p, "fi-wrap", "Approach the artists"); p.wait_for_timeout(3000)
    r["loopPanel"] = (panel_text(p) or '')[:120]; r["jsErrors"] = p._errs[:3]
    res["french-visit1"] = r; print("french 1", json.dumps(r, ensure_ascii=False), flush=True); p.close()
g.close()
json.dump(res, open(os.path.join(OUT, "results.json"), "w"), indent=1, ensure_ascii=False)

# ---------- 4. the Colony re-entry (his follow-up) ----------
if not only or 'colony-reentry' in only:
    g = Game(width=W, height=H); res = {}
    seeds = "(set: $colonyVisits to 1)(set: $visited's Colony to true)(set: $metDavy to false)(set: $knowsRonnies to false)(set: $enteredVenue to true)(set: $sobriety to 60)"
    p = g.page("The Colony Room Door", seeds); Game.click(p, "BEGIN", 1200)
    settle_room(p, "ci-wrap")
    r = {"entryPanel": (panel_text(p) or '')[:160]}
    p.screenshot(path=os.path.join(OUT, "colony-visit2-1-entry-panel.png"))
    dismiss(p); p.wait_for_timeout(2000)
    r["opened"] = open_spot(p, "ci-wrap", "the agent at his table")
    r["card"] = p.evaluate("() => [...document.querySelectorAll('#ci-wrap .dss-room-card .fi-action')].map(b=>b.textContent)")
    r["pressed"] = press(p, "ci-wrap", "Talk to the famous agent"); p.wait_for_timeout(3500)
    r["passage"] = Game.name(p); r["loopPanel"] = (panel_text(p) or '')[:200]
    p.screenshot(path=os.path.join(OUT, "colony-visit2-2-loop.png"))
    r["jsErrors"] = p._errs[:3]; res["colony-visit2"] = r; print("colony 2", json.dumps(r, ensure_ascii=False), flush=True); p.close()
    # first visit: no line
    p = g.page("The Colony Room Door", "(set: $colonyVisits to 0)(set: $visited's Colony to false)(set: $metDavy to false)(set: $enteredVenue to true)(set: $sobriety to 60)", base=False); Game.click(p, "BEGIN", 1200)
    Game.click(p, "Right", 1500); settle_room(p, "ci-wrap")
    r = {"entryPanel": (panel_text(p) or '')[:120]}
    dismiss(p); p.wait_for_timeout(1500)
    r["opened"] = open_spot(p, "ci-wrap", "the man at the bar"); r["pressed"] = press(p, "ci-wrap", "Get a drink with the man at the bar"); p.wait_for_timeout(3000)
    r["passage"] = Game.name(p); r["loopPanel"] = (panel_text(p) or '')[:160]; r["jsErrors"] = p._errs[:3]
    res["colony-visit1"] = r; print("colony 1", json.dumps(r, ensure_ascii=False), flush=True); p.close()
    g.close()
