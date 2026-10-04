"""Fresh night, strangers, lilies and notebook, lost WebGL in a room, stat flash.
PYTHONPATH=scratchpad/audit-2026-09-16 DSS_FAST=1 python3 scratchpad/review-2026-10-04/night.py OUT [sections]"""
import sys, os, re, json
import harness; from harness import Game
harness.STATE_VARS += ["lilyCount","tookLily1","tookLily2","tookLily3","tookLily4","tookLily5","goochMet","fetchSeen","truzeMet","longshanksMet","songstrongMet","lineWomanMet","lostToDrink","afterMidnight","shipFate"]
harness.AUDIT_HEADER = ('\n<div id="audit-name">(print: (passage:)\'s name)</div>\n(link-repeat: "AUDIT READ")[<div id="audit-state">' + "".join('%s=(print: $%s);;' % (v, v) for v in harness.STATE_VARS) + '</div>]')
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
SECT = sys.argv[2:] or ["fresh","strangers","lilies","lost","flash"]
g = Game(width=1280, height=900); FAILS = []
def check(c, m):
    print(('  ok   ' if c else '  FAIL ') + m, flush=True)
    if not c: FAILS.append(m)
def errs(p): return [e[:200] for e in p._errs if 'audio' not in e.lower()]
def cerrs(p): return [c[1][:160] for c in p._cons if c[0]=='error' and 'udio' not in c[1] and 'net::' not in c[1] and 'favicon' not in c[1]]
def st(p):
    s = Game.snapshot(p); return {k: (re.search(r'(?:^|;;)%s=(.*?);;' % k, s["state"] or "") or [None, None])[1] for k in harness.STATE_VARS}
def boot(t, s):
    p = g.page(t, s); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
    for _ in range(3):
        if Game.name(p) == "Dean Street": break
        if not Game.click(p, "On.", 800): break
        Game.clear_overlays(p)
    for _ in range(40):
        if p.evaluate("() => !!document.querySelector('.soho-map-stage canvas')"): break
        p.wait_for_timeout(250)
    return p
def tele(p, c, r): return p.evaluate("([c,r]) => window.__dssSohoTeleport(c,r)", [c, r])
def walk(p, key, ms):
    p.keyboard.down(key); p.wait_for_timeout(ms); p.keyboard.up(key); p.wait_for_timeout(2500)
def hub(p, k): return p.evaluate("(k) => document.querySelector('.dss-hub-flag[data-k=\"'+k+'\"]')?.textContent.trim()", k)
def shot(p, n): p.evaluate("() => window.dispatchEvent(new Event('resize'))"); p.wait_for_timeout(700); p.screenshot(path=os.path.join(OUT, n + ".png"))

if "fresh" in SECT:
    print("== FRESH NIGHT FROM BEGIN (no seeds) ==")
    p = g.page(None, "", audit_header=False)   # untouched Start
    p.wait_for_timeout(1500); shot(p, "00-title")
    check(p.evaluate("() => !!document.querySelector('tw-passage')"), "title renders")
    names = []
    for i in range(14):
        Game.clear_overlays(p)
        n = p.evaluate("() => document.querySelector('tw-passage')?.getAttribute('tags') || ''")
        txt = p.inner_text("tw-passage")[:60].replace("\n"," ")
        links = p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].map(e=>e.textContent.trim())")
        names.append((n, txt, links[:5]))
        if p.evaluate("() => !!document.querySelector('.soho-map-stage canvas')"): break
        tw = p.evaluate("() => [...document.querySelectorAll('tw-error')].map(e=>e.textContent.slice(0,200))")
        check(not tw, "no tw-error at step %d %s" % (i, tw))
        clicked = False
        for cand in ("BEGIN", "On.", "Begin", "Continue", "Go on", "Out into the night"):
            if cand in links: Game.click(p, cand, 1800); clicked = True; break
        if not clicked and links:
            Game.click(p, links[0], 1800); clicked = True
        if not clicked: break
        shot(p, "fresh-%02d" % i)
    for n in names: print("     ", n)
    check(p.evaluate("() => !!document.querySelector('.soho-map-stage canvas')"), "reached the Dean Street map from BEGIN with no seeds")
    shot(p, "01-dean-street-fresh")
    check(not errs(p), "fresh night: no JS errors " + str(errs(p)))
    check(not cerrs(p), "fresh night: no console errors " + str(cerrs(p)[:3]))
    p.close()

if "strangers" in SECT:
    print("== FIVE EDGE STRANGERS + THE WOMAN ==")
    cases = [("gooch", "$mantraComplete", 48, 26, "Helvellyn Gooch", "goochMet", "ArrowRight", 46, 26),
             ("truze", "$nazcaTracing", 7, 17, "Devon Truze", "truzeMet", "ArrowLeft", 9, 17),
             ("longshanks", "$easterGlyph", 7, 29, "Tom Longshanks", "longshanksMet", "ArrowLeft", 9, 29),
             ("songstrong", "$pyramidNumber", 31, 40, "Guilliam Songstrong", "songstrongMet", "ArrowDown", 31, 38),
             ("fetch", "$ezekielVision", 17, 8, "The Fetch on Dean Street", "fetchSeen", "ArrowUp", 17, 11),
             ("line", "$afterMidnight", 7, 3, "The Woman from the Line", "lineWomanMet", "ArrowUp", 7, 6)]
    for sid, flag, c, r, pas, var, key, sc, sr in cases:
        seeds = "(set: %s to true)(set: $enteredVenue to true)(set: $confidence to 50)" % flag
        if sid == "line": seeds += '(set: $shipFate to "sunk")'
        p = boot("Dean Street", seeds)
        drawn = p.evaluate("(id) => { const d=(window.__dssDoors||[]).find?.(x=>x.id===id); return d? true : null; }", sid)
        ok = tele(p, sc, sr); p.wait_for_timeout(600); shot(p, "stranger-%s-far" % sid)
        check(ok, "%s: teleport to approach tile" % sid)
        before = p.evaluate("() => document.querySelector('.stat-bars')?.innerText || ''")
        walk(p, key, 1400)
        at = Game.name(p)
        if at != pas:
            # second try, a longer hold
            walk(p, key, 1500); at = Game.name(p)
        check(at == pas, "%s: walking onto the corner reaches %s (got %s)" % (sid, pas, at))
        if at == pas:
            shot(p, "stranger-%s-scene" % sid)
            tw = p.evaluate("() => [...document.querySelectorAll('tw-error')].map(e=>e.textContent.slice(0,200))")
            check(not tw, "%s: no tw-error %s" % (sid, tw))
            pink = p.evaluate("() => document.querySelectorAll('tw-passage .claude-draft').length")
            print("      pink blocks:", pink, "| links:", p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].map(e=>e.textContent.trim()).filter(t=>t!=='AUDIT READ')"))
            check(Game.click(p, "Walk on", 2500), "%s: Walk on" % sid)
            Game.clear_overlays(p)
            s = st(p)
            check(s.get(var) == "true", "%s: %s true after (%s)" % (sid, var, s.get(var)))
            check(hub(p, "met-" + sid) == "on", "%s: hub flag met-%s on" % (sid, sid))
            if sid not in ("line",):
                check(s.get("confidence") in ("60",) or sid == "fetch", "%s: +10 morale sober (confidence %s)" % (sid, s.get("confidence")))
            delta = p.evaluate("() => [...document.querySelectorAll('.stat-delta')].map(e=>e.textContent)")
            print("      header deltas on return:", delta)
            # met once: link gone from dock
            check(not p.evaluate("(n) => [...document.querySelectorAll('tw-link')].some(e=>e.textContent.trim()===n)", pas), "%s: hub link gone once met" % sid)
            Game.click(p, "NOTEBOOK", 1800); nb = p.inner_text("body")
            print("      notebook mentions name:", pas.split(" on ")[0].split(" from ")[0] in nb)
            shot(p, "stranger-%s-notebook" % sid)
        check(not errs(p), "%s: no JS errors %s" % (sid, errs(p)))
        p.close()
    # morris remnants in the live DOM
    p = boot("Dean Street", "(set: $nazcaTracing to true)")
    check(not p.evaluate("() => document.documentElement.outerHTML.toLowerCase().includes('morris')"), "no 'morris' anywhere in the live hub DOM")
    p.close()

if "lilies" in SECT:
    print("== FIVE LILIES AND THE NOTEBOOK PENTANGLE ==")
    lilies = [("Chinese Fish and Chips", "lily1", "(set: $hadChippy to true)"), ("The Pillars of Hercules", "lily2", "(set: $inisToldOfPillars to true)"), ("Ronnie Scott's", "lily3", "(set: $completedSetlist to true)"), ("The Colony Room", "lily4", ""), ("The French", "lily5", "")]
    for pas, lid, extra in lilies:
        for sob, expectFlower in ((60, True), (20, False)):
            p = g.page(pas, "(set: $sobriety to %d)(set: $enteredVenue to true)" % sob + extra); Game.click(p, "BEGIN", 900); p.wait_for_timeout(2500); Game.clear_overlays(p)
            n = p.evaluate("(h) => document.querySelectorAll('tw-hook[name=\"'+h+'\"] .lily-prompt, tw-hook[name=\"'+h+'\"] svg').length", lid)
            if not n:
                print("      %s: no lily hook %s found on the page (links: %s)" % (pas, lid, p.evaluate("() => [...document.querySelectorAll('tw-link')].map(e=>e.textContent.trim()).slice(0,8)")))
                check(False, "%s at %d: lily hook present" % (pas, sob)); p.close(); continue
            p.evaluate("(h) => { const e=document.querySelector('tw-hook[name=\"'+h+'\"] svg')||document.querySelector('tw-hook[name=\"'+h+'\"]'); e.dispatchEvent(new MouseEvent('click',{bubbles:true})); }", lid)
            p.wait_for_timeout(1500)
            txt = p.inner_text("tw-passage"); s = st(p)
            if expectFlower:
                check("lily-glimpse" in p.content() and s.get("took" + lid.capitalize().replace("Lily","Lily")) in ("true",) or s.get("tookLily"+lid[-1]) == "true", "%s sober: flower taken (tookLily%s=%s, lilyCount=%s)" % (pas, lid[-1], s.get("tookLily"+lid[-1]), s.get("lilyCount")))
            else:
                check(s.get("tookLily"+lid[-1]) == "false" and lid in (s.get("lostToDrink") or ""), "%s under 30: trace, no flower, listed (lost=%s)" % (pas, s.get("lostToDrink")))
                check(p.evaluate("() => !!document.querySelector('.lily-glimpse.claude-draft')"), "%s under 30: pink trace shown" % pas)
            check(not p.evaluate("() => document.querySelectorAll('tw-error').length"), "%s at %d: no tw-error" % (pas, sob))
            check(not errs(p), "%s at %d: no JS errors %s" % (pas, sob, errs(p)))
            p.close()
    # pentangle order
    p = boot("Dean Street", "(set: $tookLily1 to true)(set: $tookLily2 to true)(set: $tookLily3 to true)(set: $tookLily4 to true)(set: $tookLily5 to true)(set: $lilyCount to 5)(set: $enteredVenue to true)")
    Game.click(p, "NOTEBOOK", 2500); shot(p, "notebook-five-lilies")
    pts = p.evaluate("() => [...document.querySelectorAll('.pent-lily')].map(e=>e.className)")
    print("      pent lilies:", pts)
    check(len(pts) == 5, "notebook pentangle draws five lilies")
    nbt = p.inner_text("body")
    for sec in ("THE SHIP", "LOST TO DRINK"):
        print("      notebook section '%s' present:" % sec, sec in nbt)
    check(not p.evaluate("() => document.querySelectorAll('tw-error').length"), "notebook: no tw-error")
    check(not errs(p), "notebook: no JS errors " + str(errs(p)))
    p.close()

if "lost" in SECT:
    print("== LOST WEBGL CONTEXT IN A ROOM ==")
    for pas, wrap in (("The French", "fi-container"), ("The Coach and Horses", "cb-room"), ("The Colony Room", "ci-container")):
        p = g.page(pas, "(set: $enteredVenue to true)(set: $sobriety to 60)"); Game.click(p, "BEGIN", 900); p.wait_for_timeout(4000); Game.clear_overlays(p)
        has = p.evaluate("() => { const c=[...document.querySelectorAll('tw-passage canvas')].find(c=>c.width>0); return c ? {w:c.width, id:(c.closest('[id]')||{}).id, cls:(c.parentElement||{}).className} : null; }")
        print("      canvas:", has)
        check(bool(has), "%s: room canvas mounted" % pas)
        if not has: p.close(); continue
        before = p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].filter(e=>getComputedStyle(e).display!=='none' && !e.closest('.dss-claimed') && !e.closest('.dss-claimed-wrap')).map(e=>e.textContent.trim())")
        print("      visible panel links before:", before)
        r = p.evaluate("() => { const c=[...document.querySelectorAll('tw-passage canvas')].find(c=>c.width>0); const gl=c.getContext('webgl2')||c.getContext('webgl'); const ext=gl&&gl.getExtension('WEBGL_lose_context'); if(!ext) return 'noext'; ext.loseContext(); return 'lost'; }")
        check(r == "lost", "%s: forced loseContext (%s)" % (pas, r))
        p.wait_for_timeout(4500)
        after = p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].filter(e=>getComputedStyle(e).display!=='none' && !e.closest('.dss-claimed') && !e.closest('.dss-claimed-wrap')).map(e=>e.textContent.trim())")
        lostcls = p.evaluate("() => !!document.querySelector('.dss-room-prose-lost')")
        print("      visible panel links after loss:", after, "| lost class:", lostcls)
        check(lostcls, "%s: words panel fallback class after 2.5s lost" % pas)
        check(len(after) > len(before), "%s: the panel offers the claimed links itself (%d -> %d)" % (pas, len(before), len(after)))
        check(not p.evaluate("() => !!document.querySelector('tw-passage')?.innerText.includes('got itself in a mess') || !!document.querySelector('tw-backdrop')"), "%s: no Harlowe error page" % pas)
        shot(p, "lost-%s" % wrap)
        bad = [e for e in errs(p) if 'lost' not in e.lower()]
        check(not bad, "%s: no uncaught JS errors after loss %s" % (pas, bad[:2]))
        p.close()

if "flash" in SECT:
    print("== STAT CHANGES SHOW IN THE HEADER ==")
    # Gooch sober: +10 morale shows as a delta on the next screen
    p = boot("Dean Street", "(set: $mantraComplete to true)(set: $enteredVenue to true)(set: $confidence to 50)")
    tele(p, 46, 26); walk(p, "ArrowRight", 1400)
    if Game.name(p) != "Helvellyn Gooch": walk(p, "ArrowRight", 1500)
    Game.click(p, "Walk on", 2000)
    d = p.evaluate("() => [...document.querySelectorAll('.stat-delta')].map(e=>e.textContent)")
    fl = p.evaluate("() => [...document.querySelectorAll('[class*=bar-flash]')].map(e=>e.className)")
    print("      deltas:", d, "flash:", fl)
    check(any('+10' in x for x in d), "Gooch +10 morale shows a header delta on Dean Street")
    p.close()
    # window smash: -5 morale shows
    p = g.page("Dean Street", "(set: $enteredVenue to true)(set: $confidence to 50)(set: $sobriety to 25)(set: $blackouts to 1)")
    Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
    for _ in range(3):
        if Game.name(p) == "Dean Street": break
        Game.click(p, "On.", 800); Game.clear_overlays(p)
    links = p.evaluate("() => [...document.querySelectorAll('tw-link')].map(e=>e.textContent.trim())")
    print("      drunk hub links:", [l for l in links if 'indow' in l or 'Sam' in l][:8])
    p.close()
g.close()
print("\nFAILS:", len(FAILS)); [print(" -", f) for f in FAILS]
