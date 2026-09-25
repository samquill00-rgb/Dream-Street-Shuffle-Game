"""Inside the French: idle, each close-up, step back, then the bar into The French.
Run from scratchpad/audit-2026-09-16: PYTHONPATH=. python3 fi_shot.py OUTDIR WIDTH [reduced]"""
import sys, os
from harness import *
out, width = sys.argv[1], int(sys.argv[2])
reduced = len(sys.argv) > 3 and sys.argv[3] == 'reduced'
os.makedirs(out, exist_ok=True)
g = Game(width=width, height=780 if width < 600 else 900)
p = g.page("Inside the French", "")
if reduced: p.emulate_media(reduced_motion='reduce')
Game.click(p, "BEGIN", 1200)
p.wait_for_timeout(4500)
tag = ('phone-' if width < 600 else '') + ('reduced-' if reduced else '')
p.screenshot(path=os.path.join(out, tag + '0-room.png'))

SPOTS = {'the photographs': [0.4, 2.0, -4.4], 'the telephone': [-3.44, 1.33, -0.35],
         'the glass on the bar': None, 'the blue door': [2.45, 1.3, -4.4]}
def screen(world):
    return p.evaluate("""(w) => {
      const e = window._dssThreeRegistry['fi-wrap']; const cam = e.camera;
      const c = document.querySelector('#fi-wrap canvas'); const r = c.getBoundingClientRect();
      let v;
      if (w === null) { const gl = e.scene.children.find(o => o.children && o.children.some(k => k.geometry && k.geometry.type === 'RingGeometry')); v = new THREE.Vector3(); gl.getWorldPosition(v); v.y += 0.05; }
      else v = new THREE.Vector3(w[0], w[1], w[2]);
      v.project(cam);
      return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height];
    }""", world)
def mouse_at(x, y):
    p.evaluate("([x,y]) => { document.querySelector('#fi-wrap canvas').dispatchEvent(new PointerEvent('pointermove', {clientX: x, clientY: y, bubbles: true, pointerType: 'mouse'})); }", [x, y])
def click_at(x, y):
    p.evaluate("([x,y]) => { const c = document.querySelector('#fi-wrap canvas'); c.dispatchEvent(new PointerEvent('pointermove', {clientX: x, clientY: y, bubbles: true, pointerType: 'mouse'})); c.dispatchEvent(new PointerEvent('pointerdown', {clientX: x, clientY: y, bubbles: true, pointerType: 'mouse'})); }", [x, y])
def cursor():
    return p.evaluate("() => document.querySelector('#fi-wrap canvas').style.cursor")
def card():
    return p.evaluate("() => { const d = [...document.querySelectorAll('#fi-wrap div')].find(e => e.style.opacity === '1' && e.textContent.includes('STEP BACK')); return d ? d.textContent.slice(0, 60) : null; }")

def wait_idle(mode):
    for _ in range(80):
        if p.evaluate("() => document.getElementById('fi-wrap').dataset.cam") == mode: break
        p.wait_for_timeout(150)
    p.wait_for_timeout(400)
n = 0
for name, world in SPOTS.items():
    x, y = screen(world)
    mouse_at(x, y); p.wait_for_timeout(1500)
    cur = cursor()
    if n == 2:
        p.screenshot(path=os.path.join(out, tag + '5-hover-' + name.replace(' ', '_') + '.png'))
    click_at(x, y); wait_idle('inspect')
    n += 1
    p.screenshot(path=os.path.join(out, tag + str(n) + '-' + name.replace(' ', '_') + '.png'))
    print(name, 'at', int(x), int(y), 'cursor', cur, 'card:', card(), flush=True)
    click_at(8, 8); wait_idle('idle')
    print('  stepped back, card gone:', card() is None, flush=True)

p.evaluate("() => { const b = [...document.querySelectorAll('#fi-wrap div')].find(e => e.textContent === 'TO THE BAR'); b.click(); }")
p.wait_for_timeout(900)
p.screenshot(path=os.path.join(out, tag + '6-to-the-bar.png'))
p.wait_for_timeout(2600)
print('landed on', Game.name(p), '| wrap gone:', p.evaluate("() => !document.getElementById('fi-wrap')"))
Game.clear_overlays(p); p.wait_for_timeout(800)
p.screenshot(path=os.path.join(out, tag + '7-the-french.png'))
print('errors', [e[:160] for e in p._errs if 'audio' not in e.lower()])
g.close()
