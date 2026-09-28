"""Walk of Astra's 28 September additions: hut fire, smashable windows, Coach fire ending, betrayal guards.
PYTHONPATH=scratchpad/audit-2026-09-16 python3 walk.py OUT [width] [reduced] [sections...]"""
import sys, os, re, json, time
import harness; from harness import Game
harness.STATE_VARS += ["drinksTonight","blackouts","lostToDrink","hutBurnt","matchesLeft","brokenWindows","coachFireChance","coachBurnt","crossed","savedBy"]
harness.AUDIT_HEADER = ('\n<div id="audit-name">(print: (passage:)\'s name)</div>\n(link-repeat: "AUDIT READ")[<div id="audit-state">' + "".join('%s=(print: $%s);;' % (v, v) for v in harness.STATE_VARS) + '</div>]')
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
WIDTH = int(sys.argv[2]) if len(sys.argv) > 2 else 1280
REDUCED = "reduced" in sys.argv[3:]
SECTIONS = [a for a in sys.argv[3:] if a != "reduced"] or ["hut","windows","coach","betrayal"]
TAG = "%s%s" % (WIDTH, "-reduced" if REDUCED else "")
g = Game(width=WIDTH, height=900 if WIDTH > 600 else 844)
if REDUCED:
    _np = g.b.new_page
    def _new_page(**kw):
        p = _np(**kw); p.emulate_media(reduced_motion="reduce"); return p
    g.b.new_page = _new_page
FAILS = []; NOTES = []
def check(c, m):
    print(('  ok   ' if c else '  FAIL ') + m, flush=True)
    if not c: FAILS.append(m)
def note(m): print('  note ' + m, flush=True); NOTES.append(m)
def st(p):
    s = Game.snapshot(p); s["vars"] = {k: (re.search(r'(?:^|;;)%s=(.*?);;' % k, s["state"] or "") or [None, None])[1] for k in harness.STATE_VARS}; return s
def links(p): return [l for l in p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].map(l => l.textContent.trim())") if l != "AUDIT READ"]
def pink(p): return p.evaluate("() => [...document.querySelectorAll('tw-passage .claude-draft tw-link')].map(l => l.textContent.trim().replace(/^\\[|\\]$/g, ''))")
def P(p, text, wait=900):
    ok = p.evaluate("(t) => { const e = [...document.querySelectorAll('tw-link')].find(e => e.textContent.trim().replace(/^\\[|\\]$/g, '') === t); if (!e) return false; e.click(); return true; }", text)
    p.wait_for_timeout(wait); return ok
def boot(t, s):
    p = g.page(t, s); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 700): break
        Game.clear_overlays(p)
    return p
def to_dean(p):
    for _ in range(3):
        if Game.name(p) == "Dean Street": break
        if not Game.click(p, "On.", 800): break
        Game.clear_overlays(p)
    Game.clear_overlays(p)
    if Game.name(p) == "Dean Street":
        for _ in range(40):
            if p.evaluate("() => !!document.querySelector('.soho-map-stage canvas')"): break
            p.wait_for_timeout(250)
        p.wait_for_timeout(600)
def errs(p): return [e[:200] for e in p._errs if 'audio' not in e.lower()]
def shot(p, name): p.screenshot(path="%s/%s-%s.png" % (OUT, TAG, name))
def wait_scene(p, wrap, secs=25):
    for _ in range(secs*4):
        if p.evaluate("(w) => { const el = document.getElementById(w); return !!(el && el.querySelector('canvas')) && (el.dataset.cam || 'idle') === 'idle'; }", wrap): return True
        p.wait_for_timeout(250)
    return False
def overlaps(p):
    # visible text nodes overlapping other visible elements inside tw-passage, ignoring the scene wrap
    return p.evaluate("""() => {
      const out = []; const els = [...document.querySelectorAll('tw-passage .claude-draft, tw-passage tw-link, tw-passage p')].filter(e => e.offsetParent && e.textContent.trim());
      for (let i = 0; i < els.length; i++) for (let j = i+1; j < els.length; j++) {
        if (els[i].contains(els[j]) || els[j].contains(els[i])) continue;
        const a = els[i].getBoundingClientRect(), b = els[j].getBoundingClientRect();
        if (a.width && b.width && a.left < b.right - 4 && b.left < a.right - 4 && a.top < b.bottom - 4 && b.top < a.bottom - 4) out.push([els[i].textContent.trim().slice(0,40), els[j].textContent.trim().slice(0,40)]);
      }
      return out; }""")
def offscreen(p):
    return p.evaluate("""() => [...document.querySelectorAll('#sq-wrap button, #sq-card, #ch-wrap button, .claude-draft button')].filter(b => b.offsetParent).map(b => { const r = b.getBoundingClientRect(); return [b.textContent.trim().slice(0,30), r.left < 0 || r.right > innerWidth || r.top < 0 || r.bottom > innerHeight, Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]; }).filter(x => x[1])""")

DRUNK = "(set: $sobriety to 25)(set: $blackouts to 1)(set: $drinksTonight to 5)(set: $hasMatches to true)(set: $matchesLeft to 3)(set: $hutBurnt to false)(set: $lostToDrink to (a: 'lily2'))(set: $confidence to 60)"

if "hut" in SECTIONS:
    print("== HUT 1. fork closed: sober, no blackout, already burnt ==")
    for label, seed in (("sober30", DRUNK + "(set: $sobriety to 30)"), ("noblackout", DRUNK + "(set: $blackouts to 0)"), ("burnt", DRUNK + "(set: $hutBurnt to true)")):
        p = boot("Alley: Soho Square", seed); L = links(p); pk = pink(p)
        check("Sam: cross the garden to the hut" not in pk, "%s: no garden link (%s)" % (label, pk))
        if label == "burnt":
            check("Down to the gents" not in L and "black trace" in p.evaluate("() => document.querySelector('tw-passage').innerText"), "burnt square: gents closed, trace shown (%s)" % L)
            check(not p.evaluate("() => !!document.querySelector('tw-passage .soho-hut-art, tw-passage svg.hut')"), "hut art gone when burnt")
            shot(p, "square-burnt")
        else:
            check("Down to the gents" in L, "%s: gents open (%s)" % (label, L))
        check(not st(p)["twErrors"] and not errs(p), "%s: no errors %s %s" % (label, st(p)["twErrors"], errs(p))); p.close()

    print("== HUT 2. approach without matches ==")
    p = boot("Alley: Soho Square", DRUNK + "(set: $hasMatches to false)")
    check("Sam: cross the garden to the hut" in pink(p), "garden link offered without matches (%s)" % pink(p))
    P(p, "Sam: cross the garden to the hut", 800); check(Game.name(p) == "Soho Square: the hut", "at the hut (%s)" % Game.name(p))
    check(wait_scene(p, "sq-wrap"), "hut scene mounted, camera idle")
    check("Sam: light it" not in pink(p) and "Sam: walk away" in pink(p), "no light link without matches (%s)" % pink(p))
    p.evaluate("() => [...document.querySelectorAll('#sq-wrap button')].find(b => b.textContent.includes('door')).click()"); p.wait_for_timeout(1800)
    card = p.evaluate("() => document.getElementById('sq-card') ? document.getElementById('sq-card').innerText : ''")
    check("no matches" in card and "light" not in card.lower().replace("[sam: step back]",""), "door card without matches (%s)" % card.replace("\n"," | "))
    shot(p, "hut-door-nomatches"); check(not errs(p), "no JS errors %s" % errs(p)); p.close()

    print("== HUT 3. the full route: approach, door, king, gate, light, fire, after, street ==")
    p = boot("Alley: Soho Square", DRUNK)
    check("Sam: cross the garden to the hut" in pink(p) and "Down to the gents" in links(p), "drunk square offers the garden (%s)" % pink(p))
    shot(p, "square-drunk")
    P(p, "Sam: cross the garden to the hut", 800); check(Game.name(p) == "Soho Square: the hut", "at the hut (%s)" % Game.name(p))
    check(wait_scene(p, "sq-wrap"), "hut scene mounted, camera idle"); p.wait_for_timeout(2500)
    shot(p, "hut-approach")
    btns = p.evaluate("() => [...document.querySelectorAll('#sq-wrap button')].map(b => b.textContent.trim())")
    check(btns == ["[Sam: door]", "[Sam: king]", "[Sam: gate]"], "dock buttons (%s)" % btns)
    check(not offscreen(p), "dock buttons inside the frame %s" % offscreen(p))
    check(set(pink(p)) == {"Sam: light it", "Sam: walk away"}, "passage links light it / walk away (%s)" % pink(p))
    for obj in ("king", "gate", "door"):
        p.evaluate("(o) => [...document.querySelectorAll('#sq-wrap button')].find(b => b.textContent.includes(o)).click()", obj); p.wait_for_timeout(1800)
        card = p.evaluate("() => document.getElementById('sq-card').innerText").replace("\n", " | ")
        cb = p.evaluate("() => [...document.querySelectorAll('#sq-card button')].map(b => b.textContent.trim())")
        want = {"king": ["[Sam: step back]"], "gate": ["[Sam: walk away]", "[Sam: step back]"], "door": ["[Sam: light it]", "[Sam: step back]"]}[obj]
        check(cb == want and obj in card.lower(), "%s card: %s" % (obj, card[:90]))
        check(not offscreen(p), "%s card inside the frame %s" % (obj, offscreen(p)))
        shot(p, "hut-" + obj)
        if obj != "door":
            p.keyboard.press("Escape"); p.wait_for_timeout(1500)
            check(p.evaluate("() => document.getElementById('sq-card').style.display === 'none' && document.getElementById('sq-wrap').dataset.cam !== 'inspect'"), "%s: Escape steps back" % obj)
    # notebook over the scene
    nb = p.evaluate("() => { const l = document.querySelector('.notebook-link tw-link'); if (!l) return 'nolink'; l.click(); return 'clicked'; }"); p.wait_for_timeout(1200)
    nbvis = p.evaluate("() => { const n = document.querySelector('.notebook-overlay, .nb-overlay, #notebook-overlay, .notebook-page, .nb-page'); if(!n) return null; const r = n.getBoundingClientRect(); const top = document.elementFromPoint(Math.round(r.left + r.width/2), Math.round(r.top + Math.min(r.height/2, innerHeight/2))); return {w: r.width, h: r.height, topEl: top ? (top.className || top.tagName) + '' : null, inside: !!(top && n.contains(top))}; }")
    note("notebook over the hut scene: link %s, overlay %s" % (nb, nbvis))
    shot(p, "hut-notebook")
    p.mouse.click(8, 8); p.wait_for_timeout(800)
    if p.evaluate("() => !!document.querySelector('tw-dialog')"): p.keyboard.press("Escape"); p.wait_for_timeout(800)
    check(not p.evaluate("() => !!document.querySelector('tw-dialog')"), "notebook closed again over the scene")
    p.evaluate("() => [...document.querySelectorAll('#sq-card button')].find(b => b.textContent.includes('light')).click()"); p.wait_for_timeout(1500)
    check(Game.name(p) == "Soho Hut Burns", "light it goes to Soho Hut Burns (%s)" % Game.name(p))
    check(wait_scene(p, "sq-wrap"), "fire scene mounted"); p.wait_for_timeout(3000); shot(p, "hut-fire")
    s = st(p); v = s["vars"]
    check(v["hutBurnt"] == "true" and v["matchesLeft"] == "2", "hutBurnt true, one match spent (%s %s)" % (v["hutBurnt"], v["matchesLeft"]))
    check("hut" in (v["lostToDrink"] or ""), "hut recorded in lostToDrink (%s)" % v["lostToDrink"])
    note("stats after fire: confidence %s (was 60), sobriety %s (was 25)" % (v["confidence"], v["sobriety"]))
    check(int(v["confidence"]) < 60 and int(v["sobriety"]) > 25, "morale down, sobriety up")
    check(not s["twErrors"], "no tw-error on the fire (%s)" % s["twErrors"])
    cb = p.evaluate("() => [...document.querySelectorAll('#sq-card button')].map(b => b.textContent.trim())"); check(cb == ["[Sam: turn your back on it]"], "fire card button (%s)" % cb)
    check(not offscreen(p), "fire card inside the frame %s" % offscreen(p))
    p.evaluate("() => document.querySelector('#sq-card button').click()"); p.wait_for_timeout(1200)
    check(Game.name(p) == "Soho Square: after", "turn your back -> after (%s)" % Game.name(p))
    check(not p.evaluate("() => !!document.getElementById('sq-wrap')"), "scene wrap disposed after leaving")
    check(not p.evaluate("() => !!(window._dssThreeRegistry && window._dssThreeRegistry['sq-wrap'])"), "three registry entry released")
    shot(p, "square-after"); check(overlaps(p) == [], "no overlaps on after (%s)" % overlaps(p))
    P(p, "Sam: back to the street", 1200); to_dean(p)
    check(Game.name(p) == "Dean Street", "back on Dean Street (%s)" % Game.name(p))
    check(p.evaluate("() => (document.querySelector('.dss-hub-flag[data-k=hut]')||{}).textContent.trim() === 'burnt'"), "hub flag hut = burnt")
    tp = p.evaluate("() => window.__dssSohoTeleport(36, 11)"); p.wait_for_timeout(300)
    p.keyboard.down("ArrowLeft"); p.wait_for_timeout(350); p.keyboard.up("ArrowLeft"); p.wait_for_timeout(2500)
    check(tp and Game.name(p) == "Dean Street", "teleported to the square's south side (%s %s)" % (tp, Game.name(p)))
    el = p.query_selector('.soho-map-stage'); el.scroll_into_view_if_needed(); p.wait_for_timeout(500); el.screenshot(path="%s/%s-map-burnt.png" % (OUT, TAG), scale="device")
    # constable near the square
    tp = p.evaluate("() => window.__dssSohoTeleport(39, 10)"); p.wait_for_timeout(1200)
    check(tp and Game.name(p) == "Dean Street", "teleported to the square's east side (%s %s)" % (tp, Game.name(p)))
    bar = p.evaluate("() => (document.querySelector('.soho-map-bar')||document.body).innerText.slice(0,300)")
    check("CONSTABLE" in bar.upper(), "constable stationed by the square, note shown (%s)" % bar.replace("\n"," / ")[:120])
    el.screenshot(path="%s/%s-map-constable.png" % (OUT, TAG), scale="device")
    # notebook
    p.evaluate("() => document.querySelector('.notebook-link tw-link').click()"); p.wait_for_timeout(1500)
    nbtext = p.evaluate("() => [...document.querySelectorAll('.nb-section, .nb-item')].map(e => e.textContent.trim()).join(' || ')")
    check("the hut in Soho Square" in nbtext, "notebook lists the hut under lost to drink")
    p.evaluate("() => document.querySelector('.nb-tab[data-tab=map]').click()"); p.wait_for_timeout(900)
    svgt = p.evaluate("() => [...document.querySelectorAll('.soho-map svg text')].map(t => t.textContent.trim())")
    check("[Sam: burnt]" in svgt, "notebook map shows [Sam: burnt] under Soho Square (%s)" % [t for t in svgt if 'burnt' in t or 'Soho' in t])
    bb = p.evaluate("() => { const t = [...document.querySelectorAll('.soho-map svg text')].find(t => t.textContent.includes('burnt')); if(!t) return null; const r = t.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), r.width > 0 && r.height > 0]; }")
    check(bb and bb[2], "burnt label has a visible box %s" % bb)
    shot(p, "notebook-burnt")
    p.close()

    print("== HUT 4. revisits: fire cannot charge twice, direct entry without conditions ==")
    p = boot("Soho Hut Burns", DRUNK + "(set: $hutBurnt to true)(set: $matchesLeft to 2)(set: $lostToDrink to (a: 'hut'))")
    v = st(p)["vars"]; check(v["matchesLeft"] == "2" and (v["lostToDrink"] or "").count("hut") == 1, "revisit burnt: no second charge (%s %s)" % (v["matchesLeft"], v["lostToDrink"])); p.close()
    p = boot("Soho Hut Burns", DRUNK + "(set: $sobriety to 60)")
    v = st(p)["vars"]; check(v["hutBurnt"] == "false" and v["matchesLeft"] == "3" and "Sam: back to the square" in pink(p), "sober direct entry: nothing burns, fallback link (%s)" % pink(p))
    check(not p.evaluate("() => !!document.getElementById('sq-container')"), "no scene on invalid entry"); p.close()
    p = boot("Soho Square: the hut", DRUNK + "(set: $sobriety to 60)")
    check("Sam: light it" not in pink(p) and "Sam: walk away" in pink(p), "sober direct approach: no light link (%s)" % pink(p)); p.close()

    print("== HUT 5. Dawn remembers ==")
    p = g.page("Dawn", DRUNK + "(set: $hutBurnt to true)(set: $lostToDrink to (a: 'hut'))(set: $alba to (a: $alba1, $alba2, $alba3))"); Game.click(p, "BEGIN", 900)
    p.wait_for_timeout(9000); Game.clear_overlays(p)
    txt = p.evaluate("() => (document.querySelector('#dawn-record')||{}).innerText || ''")
    check("hut in Soho Square" in txt, "Dawn record carries the hut line (%s)" % txt.replace("\n"," / ")[:160])
    rec = p.query_selector('#dawn-record')
    if rec: rec.scroll_into_view_if_needed(); p.wait_for_timeout(400)
    shot(p, "dawn-hut"); check(not st(p)["twErrors"], "no tw-error on Dawn"); p.close()
    p = g.page("Dawn", DRUNK + "(set: $hutBurnt to false)(set: $alba to (a: $alba1, $alba2, $alba3))"); Game.click(p, "BEGIN", 900); p.wait_for_timeout(9000)
    txt = p.evaluate("() => (document.querySelector('#dawn-record')||{}).innerText || ''"); check("hut" not in txt, "Dawn without the fire has no hut line"); p.close()

if "windows" in SECTIONS:
    print("== WINDOWS 1. six panes, walk up, press E ==")
    WINS = [("dean-north",15,9,16,9),("dean-west",15,18,16,18),("dean-east",20,33,19,33),("frith",27,19,28,19),("greek",44,20,43,20),("romilly",34,33,34,34)]
    p = boot("Dean Street", DRUNK); to_dean(p)
    check(Game.name(p) == "Dean Street" and p.evaluate("() => !!document.querySelector('.soho-map-stage canvas')"), "on the map")
    check(p.evaluate("() => document.querySelectorAll('[data-window-action]').length") == 6, "six window actions in the passage")
    check(p.evaluate("() => { const d = document.querySelector('[data-window-action]').closest('div'); const r = d.getBoundingClientRect(); return r.right < 0 || r.width === 0; }"), "hidden action dock off screen")
    el = p.query_selector('.soho-map-stage')
    for i, (wid, c, r, fc, fr) in enumerate(WINS):
        ok1 = p.evaluate("([c,r]) => window.__dssSohoTeleport(c,r)", [c, r]); ok2 = p.evaluate("([c,r]) => window.__dssSohoTeleport(c,r)", [fc, fr])
        check((not ok1) and ok2, "%s: pane tile solid, stand tile walkable (%s %s)" % (wid, ok1, ok2))
        p.wait_for_timeout(500)
        vis = p.evaluate("() => document.getElementById('dss-smash-window').style.display")
        check(vis == "block", "%s: smash button shows when near (%s)" % (wid, vis))
        if i == 0:
            p.keyboard.down("ArrowLeft"); p.wait_for_timeout(120); p.keyboard.up("ArrowLeft"); p.wait_for_timeout(1500)
            el.scroll_into_view_if_needed(); el.screenshot(path="%s/%s-window-before.png" % (OUT, TAG), scale="device")
            p.evaluate("([c,r]) => window.__dssSohoTeleport(c,r)", [fc, fr]); p.wait_for_timeout(500)
        p.evaluate("() => document.querySelector('.soho-map-stage canvas').focus()")
        if i % 2 == 0: p.keyboard.press("e")
        else: p.evaluate("() => document.getElementById('dss-smash-window').click()")
        p.wait_for_timeout(900)
        brokenDom = p.evaluate("(w) => !!document.querySelector('[data-window-broken=\"'+w+'\"]')", wid)
        check(brokenDom, "%s: broken marker after %s" % (wid, "E" if i % 2 == 0 else "button"))
        check(Game.name(p) == "Dean Street", "%s: still on Dean Street" % wid)
        if i == 0:
            p.wait_for_timeout(200); el.screenshot(path="%s/%s-window-shards.png" % (OUT, TAG), scale="device"); p.wait_for_timeout(1500); el.screenshot(path="%s/%s-window-after.png" % (OUT, TAG), scale="device")
        vis = p.evaluate("() => document.getElementById('dss-smash-window').style.display"); check(vis == "none", "%s: button hides once broken (%s)" % (wid, vis))
        p.keyboard.press("e"); p.wait_for_timeout(400)
    v = st(p)["vars"]; check(v["brokenWindows"] and v["brokenWindows"].count(",") == 5, "six broken in state (%s)" % v["brokenWindows"])
    check(not st(p)["twErrors"] and not errs(p), "no errors %s %s" % (st(p)["twErrors"], errs(p)))
    # leave and return
    Game.click(p, "Soho Square", 1000); Game.clear_overlays(p); check(Game.name(p) == "Alley: Soho Square", "to the square")
    Game.click(p, "Back to Dean Street", 1000) or Game.click(p, "Back to the street", 1000); to_dean(p); p.wait_for_timeout(800)
    check(Game.name(p) == "Dean Street", "back to Dean Street (%s)" % Game.name(p))
    n = p.evaluate("() => [...document.querySelectorAll('[data-window-state]')].filter(e => e.textContent.trim() === 'broken').length"); check(n == 6, "damage persists after leaving (%d)" % n)
    p.evaluate("() => window.__dssSohoTeleport(16,9)"); p.wait_for_timeout(1500); el = p.query_selector('.soho-map-stage'); el.scroll_into_view_if_needed(); el.screenshot(path="%s/%s-window-persist.png" % (OUT, TAG), scale="device")
    p.evaluate("() => window.__dssSohoTeleport(16,9)"); p.wait_for_timeout(600); vis = p.evaluate("() => document.getElementById('dss-smash-window').style.display"); check(vis == "none", "no button by a broken pane")
    # notebook
    p.evaluate("() => document.querySelector('.notebook-link tw-link').click()"); p.wait_for_timeout(1500)
    nbtext = p.evaluate("() => [...document.querySelectorAll('.nb-section, .nb-item')].map(e => e.textContent.trim()).join(' || ')")
    check("broken windows] — 6" in nbtext or "broken windows] — 6" in nbtext, "notebook counts six windows (%s)" % [t for t in nbtext.split(" || ") if "window" in t])
    shot(p, "notebook-windows"); p.close()

    print("== WINDOWS 2. canvas click on the pane, and sober rejection ==")
    p = boot("Dean Street", DRUNK); to_dean(p); p.evaluate("() => window.__dssSohoTeleport(28,19)"); p.wait_for_timeout(600)
    el = p.query_selector('.soho-map-stage canvas'); el.scroll_into_view_if_needed(); p.wait_for_timeout(1200); box = el.bounding_box()
    pt = p.evaluate("""() => { const cv = document.querySelector('.soho-map-stage canvas'); const r = cv.getBoundingClientRect(); const s = window.dssSohoMap.state; return null; }""")
    # click roughly where the pane is drawn: one tile left of the walker, who stands mid-frame; probe a small grid
    hit = False
    for dx in range(-60, -12, 6):
        for dy in range(-40, 41, 6):
            p.mouse.click(box["x"] + box["width"]/2 + dx, box["y"] + box["height"]*0.5 + dy); p.wait_for_timeout(100)
            if p.evaluate("() => !!document.querySelector('[data-window-broken=frith]')"): hit = True; break
        if hit: break
    check(hit and Game.name(p) == "Dean Street", "canvas click on the Frith pane breaks it and stays on the map (%s)" % hit)
    p.close()
    p = boot("Dean Street", DRUNK + "(set: $sobriety to 40)"); to_dean(p)
    check(p.evaluate("() => document.querySelectorAll('[data-window-action]').length") == 0, "sober: no window actions")
    p.evaluate("() => window.__dssSohoTeleport(16,9)"); p.wait_for_timeout(600)
    check(p.evaluate("() => document.getElementById('dss-smash-window').style.display") == "none", "sober: no smash button by the pane")
    p.keyboard.press("e"); p.wait_for_timeout(400); check(st(p)["vars"]["brokenWindows"] in ("", None, "0"), "sober: E does nothing (%s)" % st(p)["vars"]["brokenWindows"])
    check(not errs(p), "no JS errors %s" % errs(p)); p.close()

if "coach" in SECTIONS:
    print("== COACH 1. the rare offer on Dean Street and the approach ==")
    CO = DRUNK + "(set: $coachFireChance to true)(set: $coachBurnt to false)(set: $visitedCentrePoint to false)"
    p = boot("Dean Street", CO); to_dean(p)
    check("Sam: The Coach and Horses" in pink(p), "pink Coach link on Dean Street (%s)" % pink(p))
    P(p, "Sam: The Coach and Horses", 1000); Game.clear_overlays(p); check(Game.name(p) == "Approach The Coach", "at Approach The Coach (%s)" % Game.name(p))
    for _ in range(80):
        if p.evaluate("() => !!document.querySelector('#ch-wrap canvas, #ch-container canvas')"): break
        p.wait_for_timeout(250)
    p.wait_for_timeout(3000)
    check(set(pink(p)) >= {"Sam: burn down the Coach and Horses", "Sam: walk away"}, "pink burn down / walk away (%s)" % pink(p))
    cb = p.evaluate("() => [...document.querySelectorAll('#ch-wrap button, #ch-container button')].map(b => b.textContent.trim())"); note("coach approach buttons: %s" % cb)
    shot(p, "coach-approach")
    P(p, "Sam: walk away", 1200); to_dean(p); v = st(p)["vars"]
    check(Game.name(p) == "Dean Street" and v["coachBurnt"] == "false" and v["matchesLeft"] == "3" and v["coachFireChance"] == "true", "walk away: no cost, chance kept (%s %s %s)" % (v["coachBurnt"], v["matchesLeft"], v["coachFireChance"]))
    p.close()
    print("== COACH 2. burn it ==")
    p = boot("Approach The Coach", CO)
    for _ in range(80):
        if p.evaluate("() => !!document.querySelector('#ch-wrap canvas, #ch-container canvas')"): break
        p.wait_for_timeout(250)
    p.wait_for_timeout(1500)
    P(p, "Sam: burn down the Coach and Horses", 1200); check(Game.name(p) == "The Coach Burns", "at The Coach Burns (%s)" % Game.name(p))
    for _ in range(80):
        if p.evaluate("() => { const c = document.querySelector('#ch-container'); return !!(c && c.dataset.fire === 'true') && !!document.querySelector('#ch-wrap canvas'); }"): break
        p.wait_for_timeout(250)
    p.wait_for_timeout(4000); shot(p, "coach-fire")
    s = st(p); v = s["vars"]
    check(v["coachBurnt"] == "true" and v["matchesLeft"] == "2" and "coach" in (v["lostToDrink"] or ""), "coach burnt, one match, loss recorded (%s %s %s)" % (v["coachBurnt"], v["matchesLeft"], v["lostToDrink"]))
    check(not s["twErrors"], "no tw-error (%s)" % s["twErrors"])
    cb = p.evaluate("() => [...document.querySelectorAll('#ch-wrap button')].map(b => b.textContent.trim())"); check("[Sam: let the night end here]" in cb, "fire scene button (%s)" % cb)
    check(not offscreen(p), "fire card inside the frame %s" % offscreen(p))
    hidden = p.evaluate("() => { const w = document.getElementById('ch-wrap'); return w ? getComputedStyle(w).display : 'none'; }")
    p.evaluate("() => [...document.querySelectorAll('#ch-wrap button')].find(b => b.textContent.includes('night end')).click()"); p.wait_for_timeout(1500)
    check(Game.name(p) == "Coach Fire Ending", "-> Coach Fire Ending (%s)" % Game.name(p))
    check(not p.evaluate("() => !!document.getElementById('ch-wrap')"), "coach scene wrap disposed on the ending")
    check(not p.evaluate("() => !!document.querySelector('.header-links .notebook-link, .stat-bar, #stat-bar')") or p.evaluate("() => { const e = document.querySelector('.stat-bar, #stat-bar'); return !e || !e.offsetParent; }"), "stats hidden on the ending")
    shot(p, "coach-ending"); check(overlaps(p) == [], "no overlaps on the ending (%s)" % overlaps(p))
    btn = p.evaluate("() => { const b = [...document.querySelectorAll('tw-passage button')].find(b => b.offsetParent); return b ? b.textContent.trim() : null; }"); check(btn is not None, "restart button present (%s)" % btn)
    p.evaluate("() => [...document.querySelectorAll('tw-passage button')].find(b => b.offsetParent).click()"); p.wait_for_timeout(3000)
    nm = p.evaluate("() => (document.querySelector('tw-passage')||{}).getAttribute ? document.querySelector('tw-passage').getAttribute('tags') : null"); note("after restart, passage tags: %s, url %s" % (nm, p.url[-40:]))
    check(not errs(p), "no JS errors %s" % errs(p)); p.close()
    print("== COACH 3. guards ==")
    p = boot("Dean Street", CO + "(set: $coachFireChance to false)"); to_dean(p); check("Sam: The Coach and Horses" not in pink(p), "no offer when the draw failed"); p.close()
    p = boot("Dean Street", CO + "(set: $visitedCentrePoint to true)"); to_dean(p); check("Sam: The Coach and Horses" not in pink(p), "no offer after Centre Point"); p.close()
    p = boot("Approach The Coach", CO + "(set: $coachFireChance to false)"); check("Sam: burn down the Coach and Horses" not in pink(p), "approach: no burn link when the draw failed"); p.close()
    p = boot("The Coach Burns", CO + "(set: $sobriety to 50)"); v = st(p)["vars"]; check(v["coachBurnt"] == "false" and v["matchesLeft"] == "3" and "Sam: back to the street" in pink(p), "sober direct entry harmless (%s)" % pink(p)); p.close()
    p = boot("Coach Fire Ending", CO); check(Game.name(p) == "Dean Street" or Game.name(p).startswith("Aoife"), "ending without the fire bounces to the street (%s)" % Game.name(p)); p.close()
    p = boot("The Coach Burns", CO + "(set: $coachBurnt to true)(set: $matchesLeft to 2)(set: $lostToDrink to (a: 'coach'))"); v = st(p)["vars"]; check(v["matchesLeft"] == "2" and (v["lostToDrink"] or "").count("coach") == 1, "revisit: no second charge"); p.close()
    # the draw itself: sample StoryInit's roll across fresh boots
    draws = []
    for _ in range(12):
        p = g.page("Dean Street", "", base=False); Game.click(p, "BEGIN", 700); draws.append(st(p)["vars"]["coachFireChance"]); p.close()
    note("coachFireChance over 12 fresh nights: %s" % draws); check(set(draws) <= {"true", "false"}, "draw is boolean")
    p = boot("Dean Street", CO + "(set: $lostToDrink to (a: 'coach', 'hut'))"); to_dean(p); p.evaluate("() => document.querySelector('.notebook-link tw-link').click()"); p.wait_for_timeout(1500)
    nbtext = p.evaluate("() => [...document.querySelectorAll('.nb-section, .nb-item')].map(e => e.textContent.trim()).join(' || ')"); check("the Coach and Horses" in nbtext and "the hut in Soho Square" in nbtext, "notebook names both losses"); p.close()

if "betrayal" in SECTIONS:
    print("== BETRAYAL guards from the last commit ==")
    SEED = '(set: $haunts to (a: $haunt4))(set: $knowsCopperWord to false)'
    p = g.page("Turn to Copper", SEED + "(set: $alba to (a:))"); Game.clear_overlays(p); L = links(p)
    check("Give him Red's name" not in L and "Give him John's name" in L and "Break the agreement. Look at her." in L, "Red met but no kiss line: Red's name withheld (%s)" % L); p.close()
    p = g.page("Turn to Copper", SEED); Game.clear_overlays(p); L = links(p); check("Give him Red's name" in L, "after the kiss line: Red's name offered (%s)" % L)
    Game.click(p, "Give him Red's name", 900); check(Game.name(p) == "You give him Red" and st(p)["vars"]["crossed"] == "red", "crossing red sticks (%s %s)" % (Game.name(p), st(p)["vars"]["crossed"])); p.close()
    p = g.page("You give him Red", SEED + "(set: $alba to (a:))"); Game.clear_overlays(p); check(Game.name(p) == "Turn to Copper" and st(p)["vars"]["crossed"] == "", "direct entry without the kiss bounces back (%s)" % Game.name(p)); p.close()
    p = g.page("You give him John", SEED + "(set: $crossed to 'ashton')"); Game.clear_overlays(p); check(Game.name(p) == "Turn to Copper" and st(p)["vars"]["crossed"] == "ashton", "second crossing bounces, first kept (%s %s)" % (Game.name(p), st(p)["vars"]["crossed"])); p.close()
    p = g.page("You notice her", SEED); Game.clear_overlays(p); check(Game.name(p) == "You notice her" and st(p)["vars"]["crossed"] == "ashton", "looking at her sets ashton")
    check(not p.evaluate("() => !!document.querySelector('.header-links tw-link')"), "header back link hidden on the crossing passage"); p.close()
    p = g.page("The dark pass", SEED + "(set: $savedBy to 'john')(set: $crossed to 'red')"); Game.clear_overlays(p); p.wait_for_timeout(1500)
    col = p.evaluate("() => { const e = document.querySelector('.dss-betrayal-aftermath .claude-draft'); return e ? getComputedStyle(e).color : null; }"); check(col == "rgb(255, 58, 168)", "dark pass pink draft colour (%s)" % col); shot(p, "dark-pass-red"); p.close()

g.close(); print("FAILS", len(FAILS)); [print("  -", f) for f in FAILS]
json.dump({"fails": FAILS, "notes": NOTES}, open("%s/%s-result.json" % (OUT, TAG), "w"), indent=1)
