"""Light desktop check of the ten venue rooms: mount, words panel, every hotspot card, card buttons vs the passage's links,
A CHOICE WAITS AT on cards without a choice, no errors.
Run from scratchpad/audit-2026-09-16: PYTHONPATH=. DSS_FAST=1 python3 ../review-2026-10-04/light_rooms.py OUT [rooms]"""
import sys, os, re, json, time
import harness; from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
ROOMS = {
 'fi': ("The French", "fi-wrap", "(set: $haunts to (a: $haunt1))"),
 'ci': ("The Colony Room", "ci-wrap", ""),
 'pi': ("Entering The Pillars of Hercules", "pi-wrap", "(set: $hadLilyCall1 to true)(set: $hadDualRing to true)(set: $metCritic to true)"),
 'ri': ("Ronnie Scott's", "ri-wrap", "(set: $visited's Ronnies to true)(set: $knowsRonnies to true)"),
 'cb': ('Coach and Horses bar', "cb-wrap", '(set: $hadPhoneCall to false)(set: $lilyCount to 0)(set: $haunts to (a:))(set: $knowsLackland to false)(set: $primerShown to true)(set: $inisToldOfPillars to false)'),
 'ti': ("Trisha's", "ti-wrap", "(set: $visited's Trishas to true)(set: $metShana to false)(set: $knowsRonnies to true)(set: $completedSetlist to false)(set: $haunts to (a:))(set: $hauntExplained to true)(set: $inisToldOfPillars to false)"),
 'lk': ("Martin Lackland's Office", "lk-wrap", '(set: $nazcaTracing to false)(set: $metDavy to true)(set: $confidence to 70)(set: $inisToldOfPillars to false)'),
 'cf': ('Chinese Fish and Chips', "cf-wrap", '(set: $hadChippy to false)(set: $tookLily1 to false)(set: $sobriety to 70)(set: $hasMatches to true)(set: $lilyCount to 0)(set: $inisToldOfPillars to false)(set: $lilyHintShown to true)'),
 'oi': ("O'Flatterly's shop", "oi-wrap", '(set: $pyramidNumber to false)(set: $returnedPage to false)(set: $hasMissingPage to false)'),
 'cu': ('Turn to Copper', "cu-wrap", '(set: $crossed to "")(set: $knowsCopperWord to false)(set: $haunts to (a: $haunt4))'),
}
want = sys.argv[2:] or list(ROOMS)
g = Game(width=int(os.environ.get("RW", "960")), height=800); FAILS = []
def check(c, m):
    print(('  ok   ' if c else '  FAIL ') + m, flush=True)
    if not c: FAILS.append(m)
def errs(p): return [e[:200] for e in p._errs if 'audio' not in e.lower()]
def cam(p, w): return p.evaluate("(w) => (document.getElementById(w)||{dataset:{}}).dataset.cam", w)
def wait_cam(p, w, mode, n=80):
    for _ in range(n):
        if cam(p, w) == mode: return True
        p.wait_for_timeout(150)
    return False
def tap(p, xy): p.mouse.move(xy[0], xy[1]); p.wait_for_timeout(150); p.mouse.down(); p.mouse.up()
def blank(p, w):
    return p.evaluate("(w) => { const c = document.querySelector('#'+w+' canvas'); const r = c.getBoundingClientRect(); for (let y = r.top + 150; y < r.top + r.height - 40; y += 40) { const x = r.left + r.width / 2; if (document.elementFromPoint(x, y) === c) return [x, y]; } return [r.left + r.width / 2, r.top + 150]; }", w)
def card(p, w):
    return p.evaluate("(w) => { const d = [...document.querySelectorAll('#'+w+' div')].find(e => e.style.opacity === '1' && e.textContent.includes('STEP BACK')); if(!d) return null; const t=d.textContent; return {buttons: [...d.querySelectorAll('.fi-action')].map(b => b.textContent.trim()), wayon: t.includes('A CHOICE WAITS AT')}; }", w)
def project(p, w, at):
    return p.evaluate("([w,a]) => { const e = window._dssThreeRegistry[w]; const v = new THREE.Vector3(a[0],a[1],a[2]); v.project(e.camera); const c = document.querySelector('#'+w+' canvas'); const r = c.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; }", [w, at])
for rid in want:
    pas, w, seeds = ROOMS[rid]
    print("== %s: %s ==" % (rid, pas), flush=True)
    t0 = time.time()
    p = g.page(pas, seeds + "(set: $enteredVenue to true)(set: $sobriety to 60)"); Game.click(p, "BEGIN", 1200)
    for _ in range(80):
        if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle'", w): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(1000); Game.clear_overlays(p)
    at = Game.name(p); check(at == pas, "%s: at %s" % (rid, at))
    mounted = p.evaluate("(w) => { const c=document.querySelector('#'+w+' canvas'); return c ? [c.width, c.height] : null; }", w)
    check(bool(mounted), "%s: canvas mounted %s" % (rid, mounted))
    if not mounted: p.close(); continue
    p.evaluate("(w) => document.getElementById(w).scrollIntoView({block:'start'})", w); p.wait_for_timeout(400)
    panel = p.evaluate("() => { const b=document.querySelector('.dss-room-prose'); if(!b) return null; const r=b.getBoundingClientRect(); return {w:Math.round(r.width), h:Math.round(r.height), top:Math.round(r.top), pe:getComputedStyle(b).pointerEvents}; }")
    print("      words panel:", panel)
    check(bool(panel), "%s: words panel present" % rid)
    plinks = p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].map(e=>e.textContent.trim()).filter(t=>!/^(AUDIT READ|NOTEBOOK|← .*)$/.test(t))")
    visible = p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && r.height>0 && !e.closest('.dss-claimed, .dss-claimed-wrap');}).map(e=>e.textContent.trim()).filter(t=>!/^(AUDIT READ|NOTEBOOK|← .*)$/.test(t))")
    print("      passage links:", plinks); print("      still on the panel:", visible)
    spots = p.evaluate("(w) => { const e=(window._dssThreeRegistry||{})[w]; if(!e) return null; if(e.spots) return e.spots.map(s=>({name:s.name, at:s.haloAt||s.tgt})); const sp = (e.scene ? e.scene.children : []).filter(o => o.isSprite && o.material.blending === THREE.AdditiveBlending && o.scale.y > 1); return sp.map((s,i)=>{ const v=new THREE.Vector3(); s.getWorldPosition(v); return {name:'halo '+i, at:[v.x, v.y+0.35, v.z]}; }); }", w)
    spots = spots or []
    print("      hotspots:", [s["name"] for s in spots])
    check(len(spots) > 0, "%s: hotspots found (%d)" % (rid, len(spots)))
    buttons = set()
    for s in spots:
        xy = project(p, w, s["at"])
        inview = 0 <= xy[0] < g.w and 0 <= xy[1] < g.h
        if not inview:
            print("      %-22s: off screen at %s" % (s["name"], [round(x) for x in xy])); continue
        tap(p, xy); ok = wait_cam(p, w, 'inspect', 60); p.wait_for_timeout(600)
        c = card(p, w)
        if not c:
            tap(p, (xy[0], xy[1] - 14)); ok = wait_cam(p, w, 'inspect', 40); p.wait_for_timeout(500); c = card(p, w)
        if c:
            buttons.update(c["buttons"])
            print("      %-22s: %s%s" % (s["name"], c["buttons"], "  [A CHOICE WAITS AT]" if c["wayon"] else ""))
            check(bool(c["buttons"]) or c["wayon"], "%s: card '%s' has buttons or A CHOICE WAITS AT" % (rid, s["name"]))
        else:
            print("      %-22s: no card (cam %s)" % (s["name"], cam(p, w)))
            check(False, "%s: hotspot '%s' opens a card" % (rid, s["name"]))
        for _ in range(40):
            if cam(p, w) != 'tween': break
            p.wait_for_timeout(150)
        tap(p, blank(p, w)); wait_cam(p, w, 'idle', 60); p.wait_for_timeout(300)
    claimed = [l for l in plinks if l not in visible]
    missing = [l for l in claimed if l not in buttons and not any(l in b or b in l for b in buttons)]
    check(not missing, "%s: every link the panel gave up is on some card (missing %s)" % (rid, missing))
    check(not p.evaluate("() => document.querySelectorAll('tw-error').length"), "%s: no tw-error" % rid)
    check(not errs(p), "%s: no JS errors %s" % (rid, errs(p)[:2]))
    p.screenshot(path=os.path.join(OUT, "room-%s.png" % rid))
    print("      (%.0fs)" % (time.time() - t0), flush=True)
    p.close()
g.close()
print("\nFAILS:", len(FAILS)); [print(" -", f) for f in FAILS]
