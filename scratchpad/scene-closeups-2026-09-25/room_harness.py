"""Shared helpers for the room-as-navigation walks (French, Colony, ...).
Import after `from harness import *`; call setup(wrap_id, width, reduced, out, tag)."""
import os
from harness import Game

S = {}
FAILS = []

def setup(wrap, width, reduced, out, tag):
    S.update(wrap=wrap, width=width, reduced=reduced, out=out, tag=tag)
    S['g'] = Game(width=width, height=780 if width < 600 else 900)
    os.makedirs(out, exist_ok=True)

def J(js):
    return js.replace('WRAPID', S['wrap'])

def check(cond, msg):
    print(('  ok   ' if cond else '  FAIL ') + msg, flush=True)
    if not cond: FAILS.append(msg)

def boot(seeds, name):
    p = S['g'].page(name, seeds)
    if S['reduced']: p.emulate_media(reduced_motion='reduce')
    Game.click(p, "BEGIN", 1200)
    for _ in range(40):
        if p.evaluate(J("() => !!document.querySelector('#WRAPID canvas') && document.getElementById('WRAPID').dataset.cam === 'idle'")): break
        p.wait_for_timeout(250)
    p.wait_for_timeout(1200)
    Game.clear_overlays(p)
    return p

def screen(p, world):
    p.evaluate(J("() => document.getElementById('WRAPID').scrollIntoView({block:'start'})")); p.wait_for_timeout(250)
    return p.evaluate(J("""(w) => {
      const e = window._dssThreeRegistry['WRAPID']; const cam = e.camera;
      const c = document.querySelector('#WRAPID canvas'); const r = c.getBoundingClientRect();
      const v = new THREE.Vector3(w[0], w[1], w[2]); v.project(cam);
      return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height];
    }"""), world)

def ghost_pos(p, i):
    return p.evaluate(J("""(i) => { const e = window._dssThreeRegistry['WRAPID']; const sp = e.scene.children.filter(o => o.isSprite && o.material.blending === THREE.AdditiveBlending && o.scale.y > 1)[i]; const v = new THREE.Vector3(); sp.getWorldPosition(v); v.y += 0.35; return [v.x, v.y, v.z]; }"""), i)

def in_view(p, xy):
    vw, vh = p.viewport_size['width'], p.viewport_size['height']
    return 0 <= xy[0] < vw and 0 <= xy[1] < vh

def tap(p, xy):
    p.mouse.move(xy[0], xy[1]); p.wait_for_timeout(200); p.mouse.down(); p.mouse.up()

def blank(p):
    return p.evaluate(J("() => { const c = document.querySelector('#WRAPID canvas'); const r = c.getBoundingClientRect(); for (let y = r.top + 150; y < r.top + r.height - 40; y += 40) { const x = r.left + r.width / 2; if (document.elementFromPoint(x, y) === c) return [x, y]; } return [r.left + r.width / 2, r.top + 150]; }"))

def wait_cam(p, mode):
    for _ in range(80):
        if p.evaluate(J("() => (document.getElementById('WRAPID')||{dataset:{}}).dataset.cam")) == mode: return True
        p.wait_for_timeout(150)
    return False

def back(p):
    for _ in range(40):
        if p.evaluate(J("() => (document.getElementById('WRAPID')||{dataset:{}}).dataset.cam")) != 'tween': break
        p.wait_for_timeout(150)
    tap(p, blank(p)); wait_cam(p, 'idle'); p.wait_for_timeout(300)

def card(p):
    return p.evaluate(J("() => { const d = [...document.querySelectorAll('#WRAPID div')].find(e => e.style.opacity === '1' && e.textContent.includes('STEP BACK')); return d ? {text: d.textContent, buttons: [...d.querySelectorAll('.fi-action')].map(b => b.textContent)} : null; }"))

def press(p, label):
    return p.evaluate(J("(l) => { const b = [...document.querySelectorAll('#WRAPID .fi-action')].find(e => e.textContent.trim() === l); if (!b) return false; b.click(); return true; }"), label)

def open_at(p, world, wait=400):
    xy = screen(p, world); vis = in_view(p, xy)
    tap(p, xy); ok = wait_cam(p, 'inspect'); p.wait_for_timeout(wait)
    return vis, ok, card(p)

def has_link(p, text):
    return p.evaluate("(t) => [...document.querySelectorAll('tw-passage tw-link')].some(l => l.textContent.trim() === t)", text)

def shot(p, name): p.screenshot(path=os.path.join(S['out'], S['tag'] + name + '.png'))

def errs(p): return [e[:120] for e in p._errs if 'audio' not in e.lower()]

def finish():
    print('FAILS', len(FAILS))
    for f in FAILS: print('  -', f)
