"""The reveal: after the words go, every clickable wears a ring and its name for a few seconds, then fades; a tap on empty room brings it back.
Run from scratchpad/audit-2026-09-16: PYTHONPATH=. DSS_FAST=1 python3 reveal_rooms.py OUT [rooms]"""
import sys, os, time
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
W = int(os.environ.get("RW", "960")); PRE = os.environ.get("PRE", "")
g = Game(width=W, height=800); FAILS = []
def check(c, m):
    print(('  ok   ' if c else '  FAIL ') + m, flush=True)
    if not c: FAILS.append(m)
def words(p, w): return p.evaluate("(w) => (document.getElementById(w)||{dataset:{}}).dataset.words", w)
def reveal(p, w): return p.evaluate("(w) => { const l=document.querySelector('#'+w+' .dss-room-reveal'); if(!l) return null; const on=l.classList.contains('dss-room-reveal-on'); const marks=[...l.querySelectorAll('.dss-room-mark')].filter(m=>m.style.display!=='none').map(m=>({name:m.textContent.trim(), x:Math.round(parseFloat(m.style.left)), y:Math.round(parseFloat(m.style.top))})); return {on, marks, op:getComputedStyle(l).opacity}; }", w)
def shot(p, n): p.screenshot(path=os.path.join(OUT, PRE + n + ".png"))
for rid in want:
    pas, w, seeds = ROOMS[rid]
    print("== %s: %s ==" % (rid, pas), flush=True); t0 = time.time()
    p = g.page(pas, seeds + "(set: $enteredVenue to true)(set: $sobriety to 60)"); Game.click(p, "BEGIN", 1200)
    for _ in range(80):
        if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle'", w): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(900); Game.clear_overlays(p)
    r0 = reveal(p, w); check(r0 is not None and not r0["on"], "%s: no reveal while the words are up (%s)" % (rid, r0 and r0["on"]))
    p.click('#%s .dss-room-dismiss' % w)
    r = None
    for _ in range(10):
        p.wait_for_timeout(250); r = reveal(p, w)
        if r and r["on"] and r["marks"]: break
    print("      marks:", [(m["name"], m["x"], m["y"]) for m in (r or {}).get("marks", [])])
    check(bool(r and r["on"] and r["marks"]), "%s: the reveal comes on when the words go" % rid)
    check(all(m["name"] for m in (r or {}).get("marks", [])), "%s: every mark carries a name" % rid)
    check(all(0 <= m["x"] <= W and 0 <= m["y"] <= 800 for m in (r or {}).get("marks", [])), "%s: marks inside the room" % rid)
    p.wait_for_timeout(600); shot(p, "%s-reveal" % rid)
    for _ in range(30):
        p.wait_for_timeout(400); r2 = reveal(p, w)
        if r2 and not r2["on"]: break
    check(bool(r2 and not r2["on"]), "%s: the reveal fades of its own accord" % rid)
    p.wait_for_timeout(1400); shot(p, "%s-after" % rid)
    # a tap on empty room brings it back: find a canvas point no hotspot owns
    xy = p.evaluate("(w) => { const c=document.querySelector('#'+w+' canvas'); const r=c.getBoundingClientRect(); const e=window._dssThreeRegistry[w]; const cam=e.camera; const spots=(e.spots||e.hotspots||[]); const taken=spots.map(s=>{const a=s.haloAt||s.tgt; if(!a) return null; const v=new THREE.Vector3(a[0],a[1],a[2]).project(cam); return [r.left+(v.x+1)/2*r.width, r.top+(1-v.y)/2*r.height];}).filter(Boolean); for (let y=r.top+r.height*0.25; y<r.top+r.height*0.7; y+=30) for (let x=r.left+40; x<r.right-40; x+=60) { if (document.elementFromPoint(x,y)!==c) continue; if (taken.every(t=>Math.hypot(t[0]-x,t[1]-y)>110)) return [x,y]; } return [r.left+r.width/2, r.top+r.height*0.3]; }", w)
    p.mouse.move(xy[0], xy[1]); p.wait_for_timeout(200); p.mouse.down(); p.mouse.up()
    r3 = None
    for _ in range(10):
        p.wait_for_timeout(250); r3 = reveal(p, w)
        if r3 and r3["on"]: break
    cam = p.evaluate("(w) => document.getElementById(w).dataset.cam", w)
    check(bool(r3 and r3["on"]) or cam != 'idle', "%s: a tap on empty room brings the reveal back (cam %s)" % (rid, cam))
    check(not [e for e in p._errs if 'audio' not in e.lower()], "%s: no JS errors %s" % (rid, [e[:160] for e in p._errs if 'audio' not in e.lower()][:2]))
    print("      (%.0fs)" % (time.time() - t0), flush=True); p.close()
g.close()
print("\nFAILS:", len(FAILS)); [print(" -", f) for f in FAILS]
