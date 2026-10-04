"""Two flows through the modal: Ronnie's bar game takes the panel (full), and the French lily taken from the door card brings the words back.
Run from scratchpad/audit-2026-09-16: PYTHONPATH=. DSS_FAST=1 python3 flows.py OUT"""
import sys, os, time
import harness; from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
W = int(os.environ.get("RW", "960")); PRE = os.environ.get("PRE", "")
g = Game(width=W, height=800); FAILS = []
def check(c, m):
    print(('  ok   ' if c else '  FAIL ') + m, flush=True)
    if not c: FAILS.append(m)
def words(p, w): return p.evaluate("(w) => (document.getElementById(w)||{dataset:{}}).dataset.words", w)
def cam(p, w): return p.evaluate("(w) => (document.getElementById(w)||{dataset:{}}).dataset.cam", w)
def wait_cam(p, w, mode, n=80):
    for _ in range(n):
        if cam(p, w) == mode: return True
        p.wait_for_timeout(150)
    return False
def tap(p, xy): p.mouse.move(xy[0], xy[1]); p.wait_for_timeout(150); p.mouse.down(); p.mouse.up()
def shot(p, n): p.screenshot(path=os.path.join(OUT, PRE + n + ".png"))
def project(p, w, at):
    return p.evaluate("([w,a]) => { const e = window._dssThreeRegistry[w]; const v = new THREE.Vector3(a[0],a[1],a[2]); v.project(e.camera); const c = document.querySelector('#'+w+' canvas'); const r = c.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; }", [w, at])
def card_buttons(p, w):
    return p.evaluate("(w) => { const d = [...document.querySelectorAll('#'+w+' div')].find(e => e.style.opacity === '1' && e.textContent.includes('STEP BACK')); return d ? [...d.querySelectorAll('.fi-action')].map(b => b.textContent.trim()) : null; }", w)
def boot(pas, w, seeds):
    p = g.page(pas, seeds + "(set: $enteredVenue to true)(set: $sobriety to 60)"); Game.click(p, "BEGIN", 1200)
    for _ in range(80):
        if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle'", w): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(900); Game.clear_overlays(p)
    p.click('#%s .dss-room-dismiss' % w)
    for _ in range(12):
        p.wait_for_timeout(300)
        if words(p, w) == 'room': break
    return p
def spots_of(p, w):
    return p.evaluate("(w) => { const e=(window._dssThreeRegistry||{})[w]; if(!e) return []; if(e.spots) return e.spots.map(s=>({name:s.name, at:s.haloAt||s.tgt})); const sp = (e.scene ? e.scene.children : []).filter(o => o.isSprite && o.material.blending === THREE.AdditiveBlending && o.scale.y > 1); return sp.map((s,i)=>{ const v=new THREE.Vector3(); s.getWorldPosition(v); return {name:'halo '+i, at:[v.x, v.y+0.35, v.z]}; }); }", w)
def find_card_with(p, w, label):
    for s in spots_of(p, w):
        xy = project(p, w, s["at"])
        if not (0 <= xy[0] < W and 120 <= xy[1] < 800): continue
        tap(p, xy); wait_cam(p, w, 'inspect', 60); p.wait_for_timeout(500)
        b = card_buttons(p, w)
        if b and any(label in x for x in b): return s["name"], b
        for _ in range(40):
            if cam(p, w) != 'tween': break
            p.wait_for_timeout(150)
        tap(p, (W/2, 200)); wait_cam(p, w, 'idle', 60); p.wait_for_timeout(300)
    return None
# 1. Ronnie's: the bar game from the bar card takes the whole panel
print("== ri: the bar game ==", flush=True)
p = boot("Ronnie Scott's", "ri-wrap", "(set: $visited's Ronnies to true)(set: $knowsRonnies to true)")
check(words(p, "ri-wrap") == 'room', "ri: dismissed")
f = find_card_with(p, "ri-wrap", "")
print("      card:", f)
btns = f[1] if f else []
game_btn = next((b for b in btns if 'STEP' not in b), None)
if game_btn:
    p.evaluate("(t) => { const b=[...document.querySelectorAll('#ri-wrap .fi-action')].find(b=>b.textContent.trim()===t); b.click(); }", game_btn)
    for _ in range(20):
        p.wait_for_timeout(400)
        if words(p, "ri-wrap") == 'full': break
    print("      after pressing '%s': words=%s canvas=%s" % (game_btn, words(p, "ri-wrap"), p.evaluate("() => { const c=document.querySelector('#bar-canvas'); return c ? [c.style.display, Math.round(c.getBoundingClientRect().height)] : null; }")))
    check(words(p, "ri-wrap") == 'full' or p.evaluate("() => !!document.querySelector('#bar-canvas') && document.querySelector('#bar-canvas').style.display !== 'none'"), "ri: the bar game takes the panel")
    shot(p, "ri-flow-game")
check(not [e for e in p._errs if 'audio' not in e.lower()], "ri: no JS errors %s" % [e[:160] for e in p._errs][:2])
p.close()
# 2. The French: the lily from the door card brings the words back with the lily line
print("== fi: the lily ==", flush=True)
p = boot("The French", "fi-wrap", "(set: $haunts to (a: $haunt1))(set: $tookLily5 to false)(set: $lilyCount to 0)")
f = find_card_with(p, "fi-wrap", "lily")
print("      card:", f)
check(bool(f), "fi: a card offers the lily")
if f:
    p.evaluate("() => { const b=[...document.querySelectorAll('#fi-wrap .fi-action')].find(b=>/lily/.test(b.textContent)); b.click(); }")
    for _ in range(20):
        p.wait_for_timeout(400)
        if words(p, "fi-wrap") == 'modal': break
    print("      after the lily: words=%s" % words(p, "fi-wrap"))
    check(words(p, "fi-wrap") == 'modal', "fi: the words come back after the lily is taken")
    shot(p, "fi-flow-lily")
    txt = p.evaluate("() => document.querySelector('#fi-wrap .dss-room-prose').textContent.replace(/\\s+/g,' ')")
    print("      panel now says:", txt[:160])
check(not [e for e in p._errs if 'audio' not in e.lower()], "fi: no JS errors")
p.close(); g.close()
print("\nFAILS:", len(FAILS)); [print(" -", f) for f in FAILS]
