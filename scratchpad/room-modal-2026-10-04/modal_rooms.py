"""Walk the ten rooms with the entry modal: arrival (modal up), dismiss, strip offers the unclaimed links,
a close-up and back returns to the clean room, strip button presses a real link, lost-context fallback.
Run from scratchpad/audit-2026-09-16: PYTHONPATH=. DSS_FAST=1 python3 modal_rooms.py OUT [rooms]"""
import sys, os, time
import harness; from harness import Game
sys.path.insert(0, os.path.join(os.path.dirname(harness.__file__), '..', 'review-2026-10-04'))
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
W = int(os.environ.get("RW", "960")); PRE = os.environ.get("PRE", "")
g = Game(width=W, height=800); FAILS = []
def check(c, m):
    print(('  ok   ' if c else '  FAIL ') + m, flush=True)
    if not c: FAILS.append(m)
def errs(p): return [e[:200] for e in p._errs if 'audio' not in e.lower()]
def words(p, w): return p.evaluate("(w) => (document.getElementById(w)||{dataset:{}}).dataset.words", w)
def cam(p, w): return p.evaluate("(w) => (document.getElementById(w)||{dataset:{}}).dataset.cam", w)
def wait_cam(p, w, mode, n=80):
    for _ in range(n):
        if cam(p, w) == mode: return True
        p.wait_for_timeout(150)
    return False
def tap(p, xy): p.mouse.move(xy[0], xy[1]); p.wait_for_timeout(150); p.mouse.down(); p.mouse.up()
def shot(p, n): p.screenshot(path=os.path.join(OUT, PRE + n + ".png"))
def strip_labels(p, w): return p.evaluate("(w) => [...document.querySelectorAll('#'+w+' .dss-room-strip-btn')].map(b=>b.textContent.trim())", w)
def strip_vis(p, w): return p.evaluate("(w) => { const s=document.querySelector('#'+w+' .dss-room-strip'); return s && getComputedStyle(s).visibility==='visible' && getComputedStyle(s).opacity!=='0'; }", w)
def veil_vis(p, w): return p.evaluate("(w) => { const s=document.querySelector('#'+w+' .dss-room-veil'); return s && getComputedStyle(s).visibility==='visible'; }", w)
def blank(p, w):
    return p.evaluate("(w) => { const c = document.querySelector('#'+w+' canvas'); const r = c.getBoundingClientRect(); for (let y = r.top + 150; y < r.top + r.height - 90; y += 40) { const x = r.left + r.width / 2; if (document.elementFromPoint(x, y) === c) return [x, y]; } return [r.left + r.width / 2, r.top + 150]; }", w)
def card(p, w):
    return p.evaluate("(w) => { const d = [...document.querySelectorAll('#'+w+' div')].find(e => e.style.opacity === '1' && e.textContent.includes('STEP BACK')); if(!d) return null; return {buttons: [...d.querySelectorAll('.fi-action')].map(b => b.textContent.trim()), wayon: d.textContent.includes('A CHOICE WAITS AT')}; }", w)
def project(p, w, at):
    return p.evaluate("([w,a]) => { const e = window._dssThreeRegistry[w]; const v = new THREE.Vector3(a[0],a[1],a[2]); v.project(e.camera); const c = document.querySelector('#'+w+' canvas'); const r = c.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; }", [w, at])
for rid in want:
    pas, w, seeds = ROOMS[rid]
    print("== %s: %s ==" % (rid, pas), flush=True); t0 = time.time()
    p = g.page(pas, seeds + "(set: $enteredVenue to true)(set: $sobriety to 60)"); Game.click(p, "BEGIN", 1200)
    # the passage's own words must not show before the room: sample while waiting
    flashes = []
    for _ in range(80):
        st = p.evaluate("(w) => { const tp=document.querySelector('tw-passage'); const wrap=document.getElementById(w); const kids=tp?[...tp.children].filter(e=>e.tagName!=='TW-INCLUDE'):[]; const vis=kids.filter(e=>getComputedStyle(e).opacity!=='0').map(e=>e.tagName+'#'+e.id); return {wrap: !!wrap, idle: !!wrap && wrap.dataset.cam==='idle', vis}; }", w)
        if st['wrap']: break
        if st['vis']: flashes.append(st['vis'])
        p.wait_for_timeout(200)
    for _ in range(80):
        if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle'", w): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(900); Game.clear_overlays(p)
    check(Game.name(p) == pas, "%s: at %s" % (rid, Game.name(p)))
    check(not flashes, "%s: no passage words visible before the room (%s)" % (rid, flashes[:2]))
    p.evaluate("(w) => document.getElementById(w).scrollIntoView({block:'start'})", w); p.wait_for_timeout(500)
    m = words(p, w); check(m == 'modal', "%s: words arrive as a modal (%s)" % (rid, m))
    check(veil_vis(p, w), "%s: veil visible" % rid)
    shot(p, "%s-1-modal" % rid)
    # dismiss on the pink line
    p.click('#%s .dss-room-dismiss' % w)
    for _ in range(12):
        p.wait_for_timeout(300)
        if words(p, w) == 'room' and not veil_vis(p, w): break
    check(words(p, w) == 'room' and not veil_vis(p, w), "%s: dismissed, room clean (%s)" % (rid, words(p, w)))
    labels = strip_labels(p, w); print("      strip:", labels)
    check(strip_vis(p, w) and '[Sam: the words]' in labels, "%s: strip visible with the read-again control" % rid)
    unclaimed = p.evaluate("() => [...document.querySelectorAll('tw-passage .dss-room-prose tw-link')].filter(e=>e.getClientRects().length && !e.closest('.dss-claimed,.dss-claimed-wrap,.phone-ringing')).map(e=>e.textContent.trim()).filter(t=>t!=='AUDIT READ')")
    check(all(u in labels for u in unclaimed), "%s: every unclaimed link is on the strip (%s vs %s)" % (rid, unclaimed, labels))
    shot(p, "%s-2-room" % rid)
    # the read-again control reopens, the veil click dismisses
    p.click('#%s .dss-room-strip-again' % w); p.wait_for_timeout(700)
    check(words(p, w) == 'modal', "%s: the words come back on the pink control" % rid)
    r = p.evaluate("(w) => { const v=document.querySelector('#'+w+' .dss-room-veil').getBoundingClientRect(); return [v.left+20, v.top+v.height-8]; }", w)
    p.mouse.click(r[0], r[1]); p.wait_for_timeout(800)
    check(words(p, w) == 'room', "%s: a click on the dimmed room dismisses" % rid)
    # a close-up and back
    spots = p.evaluate("(w) => { const e=(window._dssThreeRegistry||{})[w]; if(!e) return null; if(e.spots) return e.spots.map(s=>({name:s.name, at:s.haloAt||s.tgt})); const sp = (e.scene ? e.scene.children : []).filter(o => o.isSprite && o.material.blending === THREE.AdditiveBlending && o.scale.y > 1); return sp.map((s,i)=>{ const v=new THREE.Vector3(); s.getWorldPosition(v); return {name:'halo '+i, at:[v.x, v.y+0.35, v.z]}; }); }", w) or []
    got = None
    for s in spots:
        xy = project(p, w, s["at"])
        if not (0 <= xy[0] < W and 120 <= xy[1] < 800): continue
        tap(p, xy); ok = wait_cam(p, w, 'inspect', 140); p.wait_for_timeout(600)
        c = card(p, w)
        if c: got = (s["name"], c); break
        for _ in range(40):
            if cam(p, w) != 'tween': break
            p.wait_for_timeout(150)
        tap(p, blank(p, w)); wait_cam(p, w, 'idle', 60)
    check(bool(got), "%s: a close-up opens a card %s" % (rid, got))
    if got:
        check(not strip_vis(p, w) and words(p, w) == 'room', "%s: strip hidden under the card" % rid)
        shot(p, "%s-3-card" % rid)
        tap(p, blank(p, w)); wait_cam(p, w, 'idle', 60); p.wait_for_timeout(800)
        check(words(p, w) == 'room' and strip_vis(p, w), "%s: stepping back returns to the clean room with the strip (%s)" % (rid, words(p, w)))
        shot(p, "%s-4-back" % rid)
    # lost context: the strip offers every link
    p.evaluate("(w) => { const c=document.querySelector('#'+w+' canvas'); const gl=c.getContext('webgl2')||c.getContext('webgl'); const ext=gl&&gl.getExtension('WEBGL_lose_context'); if(ext){ ext.loseContext(); window._dssExt=ext; } }", w)
    p.wait_for_timeout(4000)
    alll = p.evaluate("() => [...document.querySelectorAll('tw-passage .dss-room-prose tw-link')].filter(e=>e.getClientRects().length && !e.closest('.phone-ringing')).map(e=>e.textContent.trim()).filter(t=>t!=='AUDIT READ')")
    lab2 = strip_labels(p, w)
    check(strip_vis(p, w) and all(a in lab2 for a in alll), "%s: lost context, strip offers every link (%s vs %s)" % (rid, alll, lab2))
    shot(p, "%s-5-lost" % rid)
    p.evaluate("() => window._dssExt && window._dssExt.restoreContext()")
    for _ in range(12):
        p.wait_for_timeout(500)
        if set(strip_labels(p, w)) == set(labels): break
    lab3 = strip_labels(p, w); check(set(lab3) == set(labels), "%s: restored, strip back to the unclaimed links (%s)" % (rid, lab3))
    # press one unclaimed link from the strip
    pressable = [u for u in unclaimed]
    if pressable:
        p.click('#%s .dss-room-strip-btn:has-text("%s")' % (w, pressable[0].replace('"', '\\"')), timeout=3000); p.wait_for_timeout(2500)
        print("      pressed '%s' -> %s" % (pressable[0], Game.name(p)))
        check(Game.name(p) != pas or p.evaluate("() => !!document.querySelector('.dss-room-veil-on')"), "%s: strip button acts (now %s)" % (rid, Game.name(p)))
    check(not p.evaluate("() => document.querySelectorAll('tw-error').length"), "%s: no tw-error" % rid)
    check(not errs(p), "%s: no JS errors %s" % (rid, errs(p)[:2]))
    print("      (%.0fs)" % (time.time() - t0), flush=True); p.close()
g.close()
print("\nFAILS:", len(FAILS)); [print(" -", f) for f in FAILS]
