"""The French as a room: every click drives the passage's own gated link.
Run from scratchpad/audit-2026-09-16: PYTHONPATH=. python3 fi_routes.py OUTDIR WIDTH [reduced]"""
import sys, os, json
from harness import *
out, width = sys.argv[1], int(sys.argv[2])
reduced = len(sys.argv) > 3 and sys.argv[3] == 'reduced'
os.makedirs(out, exist_ok=True)
tag = ('phone-' if width < 600 else '') + ('reduced-' if reduced else '')
g = Game(width=width, height=780 if width < 600 else 900)
FAILS = []
def check(cond, msg):
    print(('  ok   ' if cond else '  FAIL ') + msg, flush=True)
    if not cond: FAILS.append(msg)

def boot(seeds, name='The French'):
    p = g.page(name, seeds)
    if reduced: p.emulate_media(reduced_motion='reduce')
    Game.click(p, "BEGIN", 1200)
    for _ in range(40):
        if p.evaluate("() => !!document.querySelector('#fi-wrap canvas') && document.getElementById('fi-wrap').dataset.cam === 'idle'"): break
        p.wait_for_timeout(250)
    p.wait_for_timeout(1200)
    Game.clear_overlays(p)
    return p

def screen(p, world):
    p.evaluate("() => document.getElementById('fi-wrap').scrollIntoView({block:'start'})"); p.wait_for_timeout(250)
    return p.evaluate("""(w) => {
      const e = window._dssThreeRegistry['fi-wrap']; const cam = e.camera;
      const c = document.querySelector('#fi-wrap canvas'); const r = c.getBoundingClientRect();
      const v = new THREE.Vector3(w[0], w[1], w[2]); v.project(cam);
      return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height];
    }""", world)
def ghost_pos(p, i):
    return p.evaluate("""(i) => { const e = window._dssThreeRegistry['fi-wrap']; const sp = e.scene.children.filter(o => o.isSprite && o.material.blending === THREE.AdditiveBlending && o.scale.y > 1)[i]; const v = new THREE.Vector3(); sp.getWorldPosition(v); v.y += 0.35; return [v.x, v.y, v.z]; }""", i)
WORLD = {'photographs': [0.4, 2.0, -4.4], 'telephone': [-3.44, 1.33, -0.35], 'door': [2.45, 1.3, -4.4], 'bar': [-1.5, 1.15, -0.3]}
def in_view(p, xy):
    vw, vh = p.viewport_size['width'], p.viewport_size['height']
    return 0 <= xy[0] < vw and 0 <= xy[1] < vh
def tap(p, xy):
    # a genuine pointer at viewport coordinates (the room was scrolled into view when they were measured)
    p.mouse.move(xy[0], xy[1]); p.wait_for_timeout(200); p.mouse.down(); p.mouse.up()
def blank(p):
    # a point on the ceiling of the room, inside the canvas, on no hotspot
    return p.evaluate("() => { const c = document.querySelector('#fi-wrap canvas'); const r = c.getBoundingClientRect(); for (let y = r.top + 150; y < r.top + r.height - 40; y += 40) { const x = r.left + r.width / 2; if (document.elementFromPoint(x, y) === c) return [x, y]; } return [r.left + r.width / 2, r.top + 150]; }")
def wait_cam(p, mode):
    for _ in range(80):
        if p.evaluate("() => (document.getElementById('fi-wrap')||{dataset:{}}).dataset.cam") == mode: return True
        p.wait_for_timeout(150)
    return False
def card(p):
    return p.evaluate("() => { const d = [...document.querySelectorAll('#fi-wrap div')].find(e => e.style.opacity === '1' && e.textContent.includes('STEP BACK')); return d ? {text: d.textContent, buttons: [...d.querySelectorAll('.fi-action')].map(b => b.textContent)} : null; }")
def press(p, label):
    return p.evaluate("(l) => { const b = [...document.querySelectorAll('#fi-wrap .fi-action')].find(e => e.textContent.trim() === l); if (!b) return false; b.click(); return true; }", label)
def shot(p, name): p.screenshot(path=os.path.join(out, tag + name + '.png'))
def state(p, var):
    return p.evaluate("(v) => { const s = document.querySelector('#audit-state'); return null; }", var)

print('== first arrival: the Stranger is the figure at the bar, the bar has no drink yet ==')
p = boot('(set: $frenchApproached to true)(set: $visited\'s French to false)(set: $visited\'s FrenchVisits to 0)(set: $haunts to (a:))(set: $lilyCount to 0)')
check(Game.name(p) == 'The French', 'lands on The French')
check(p.evaluate("() => !!document.querySelector('#fi-wrap canvas')"), 'room mounted inside the passage')
check(p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].some(l => l.textContent.trim() === 'Approach')"), 'Stranger link rendered by Harlowe')
shot(p, '1-first-arrival')
xy = screen(p, ghost_pos(p, 0)); check(in_view(p, xy), 'figure 1 on screen at %d,%d' % (xy[0], xy[1]))
tap(p, xy); wait_cam(p, 'inspect'); p.wait_for_timeout(500)
c = card(p); check(c is not None and 'Approach' in (c or {}).get('buttons', []), 'figure card offers the passage\'s Approach: %s' % (c and c['buttons']))
shot(p, '2-figure-card')
tap(p, blank(p)); wait_cam(p, 'idle'); p.wait_for_timeout(300); xy2 = screen(p, WORLD['bar'])
tap(p, xy2); wait_cam(p, 'inspect'); p.wait_for_timeout(400)
c = card(p); check(c is not None and c['buttons'] == [] and 'Sam:' in c['text'], 'bar is an inspection on a first visit (no drink link): %s' % (c and c['buttons']))
tap(p, blank(p)); wait_cam(p, 'idle'); p.wait_for_timeout(300); xy = screen(p, ghost_pos(p, 0))
tap(p, xy); wait_cam(p, 'inspect'); p.wait_for_timeout(300)
press(p, 'Approach'); p.wait_for_timeout(2500)
check(Game.name(p) == 'The Stranger at the French', 'Approach lands on The Stranger at the French (now: %s)' % Game.name(p))
check(p.evaluate("() => !document.getElementById('fi-wrap')"), 'room disposed on leaving')
print('  errors', [e[:120] for e in p._errs if 'audio' not in e.lower()]); check(not [e for e in p._errs if 'audio' not in e.lower()], 'no JS errors'); p.close()

print('== second genuine visit: the bar offers the drink; the painter figure offers the sketch ==')
p = boot('(set: $frenchApproached to true)(set: $visited\'s French to true)(set: $visited\'s FrenchVisits to 1)(set: $haunt1 to "The Sketch")(set: $haunt4 to "H4")(set: $haunts to (a: "H4", "The Sketch"))(set: $hasDrawing to false)(set: $lilyCount to 0)')
check(p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].some(l => l.textContent.trim() === 'Get a drink at the bar')"), 'drink link rendered by Harlowe on visit 2')
xy = screen(p, WORLD['bar']); check(in_view(p, xy), 'bar on screen'); tap(p, xy); wait_cam(p, 'inspect'); p.wait_for_timeout(400)
c = card(p); check(c is not None and 'Get a drink at the bar' in (c or {}).get('buttons', []), 'bar card offers Get a drink at the bar: %s' % (c and c['buttons']))
shot(p, '3-bar-drink-card')
tap(p, blank(p)); wait_cam(p, 'idle')
xy = screen(p, ghost_pos(p, 1)); check(in_view(p, xy), 'painter figure on screen'); tap(p, xy); wait_cam(p, 'inspect'); p.wait_for_timeout(400)
c = card(p); check(c is not None and 'Sketch him on a napkin' in (c or {}).get('buttons', []), 'painter card offers the sketch: %s' % (c and c['buttons']))
tap(p, blank(p)); wait_cam(p, 'idle'); p.wait_for_timeout(300); xy0 = screen(p, ghost_pos(p, 0)); tap(p, xy0); wait_cam(p, 'inspect'); p.wait_for_timeout(400)
c = card(p); check(c is not None and 'Approach' in (c or {}).get('buttons', []), 'man at the bar is the novelist now (Approach): %s' % (c and c['buttons']))
tap(p, blank(p)); wait_cam(p, 'idle'); p.wait_for_timeout(300)
xy = screen(p, WORLD['bar']); tap(p, xy); wait_cam(p, 'inspect'); p.wait_for_timeout(300); press(p, 'Get a drink at the bar'); p.wait_for_timeout(2500)
check(Game.name(p) == 'Which drink at the French?', 'drink lands on Which drink at the French? (now: %s)' % Game.name(p))
check(not [e for e in p._errs if 'audio' not in e.lower()], 'no JS errors'); p.close()

print('== exhausted venue: no figure is clickable, the passage keeps NOT NOW and the exits ==')
p = boot('(set: $frenchApproached to true)(set: $visited\'s French to true)(set: $visited\'s FrenchVisits to 3)(set: $haunt1 to "The Sketch")(set: $haunt2 to "H2")(set: $haunt4 to "H4")(set: $haunts to (a: "The Sketch", "H2", "H4"))(set: $hasDrawing to true)(set: $lilyCount to 0)')
check(p.evaluate("() => !!document.querySelector('tw-passage .venue-exhausted')"), 'NOT NOW rendered')
xy = screen(p, ghost_pos(p, 0)); tap(p, xy); p.wait_for_timeout(1500)
c = card(p); check(p.evaluate("() => document.getElementById('fi-wrap').dataset.cam") == 'idle' or (c is not None and c['buttons'] == []), 'figure ignored when no path is offered (card: %s)' % (c and c['buttons']))
check(p.evaluate("() => { const t = [...document.querySelectorAll('tw-passage tw-link')].map(l => l.textContent.trim()); return t.includes('Leave the French') && t.some(x => x.startsWith('The Colony Room is just round')); }"), 'street exit and Colony link still below the room')
shot(p, '4-exhausted')
check(not [e for e in p._errs if 'audio' not in e.lower()], 'no JS errors'); p.close()

print('== the Lily call: the telephone shows the passage\'s choices; refusal keeps its effects ==')
LILY = '(set: $frenchApproached to true)(set: $visited\'s French to true)(set: $visited\'s FrenchVisits to 2)(set: $haunts to (a:))(set: $lilyCount to 1)(set: $hadLilyCall1 to false)(set: $hadPhoneCall to true)(set: $phoneCallReturnsAt to 2)(set: $returns to 8)(set: $refusedCalls to 0)'
p = boot(LILY)
check(p.evaluate("() => !!document.querySelector('tw-passage .phone-ringing')"), 'phone-ringing rendered by Harlowe')
check(not p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].some(l => l.textContent.trim() === 'Approach')"), 'no encounter link while the phone rings (no bypass)')
xy = screen(p, WORLD['telephone']); check(in_view(p, xy), 'telephone on screen at %d,%d' % (xy[0], xy[1])); tap(p, xy); wait_cam(p, 'inspect'); p.wait_for_timeout(400)
c = card(p); check(c is not None and c['buttons'] == ['Accept the call', "I'm not here"], 'telephone card shows the two call choices: %s' % (c and c['buttons']))
check(c is not None and 'mouths' in c['text'], "card carries Sam's ringing line")
shot(p, '5-phone-ringing')
press(p, "I'm not here"); p.wait_for_timeout(1200); wait_cam(p, 'idle')
check(Game.name(p) == 'The French', 'refusal stays in The French')
check(p.evaluate("() => /What would Lily want/.test(document.querySelector('tw-passage').textContent)"), 'refusal text replaced in the passage (its own (replace:))')
tap(p, xy); wait_cam(p, 'inspect'); p.wait_for_timeout(400)
c = card(p); check(c is not None and c['buttons'] == ['Back to the street'], 'after refusal the telephone offers Back to the street: %s' % (c and c['buttons']))
shot(p, '6-phone-refused')
check(not [e for e in p._errs if 'audio' not in e.lower()], 'no JS errors'); p.close()
p = boot(LILY)
xy = screen(p, WORLD['telephone']); tap(p, xy); wait_cam(p, 'inspect'); p.wait_for_timeout(300); press(p, 'Accept the call'); p.wait_for_timeout(2500)
check(Game.name(p) == 'Lily phone call 1', 'Accept lands on Lily phone call 1 (now: %s)' % Game.name(p)); p.close()

print('== the dual ring ==')
p = boot('(set: $frenchApproached to true)(set: $visited\'s French to true)(set: $visited\'s FrenchVisits to 3)(set: $haunts to (a:))(set: $lilyCount to 2)(set: $hadLilyCall1 to true)(set: $hadDualRing to false)(set: $lilyCall1ReturnsAt to 2)(set: $returns to 8)(set: $hadPhoneCall to true)')
xy = screen(p, WORLD['telephone']); tap(p, xy); wait_cam(p, 'inspect'); p.wait_for_timeout(400)
c = card(p); check(c is not None and c['buttons'] == ['Accept the call', 'Turn and leave'], 'dual ring card shows Accept / Turn and leave: %s' % (c and c['buttons']))
press(p, 'Turn and leave'); p.wait_for_timeout(2500)
check(Game.name(p) == 'The Fetch', 'Turn and leave lands on The Fetch (now: %s)' % Game.name(p)); p.close()

print('== inspections still work; the exterior lands here; the old passage forwards ==')
p = boot('(set: $frenchApproached to true)(set: $visited\'s French to true)(set: $visited\'s FrenchVisits to 1)(set: $haunts to (a:))(set: $lilyCount to 0)')
for k in ['photographs', 'door']:
    xy = screen(p, WORLD[k]); vis = in_view(p, xy)
    if vis:
        tap(p, xy); ok = wait_cam(p, 'inspect'); p.wait_for_timeout(300); c = card(p)
        check(ok and c is not None and 'Sam:' in c['text'], k + ' inspection opens'); shot(p, '7-' + k); tap(p, blank(p)); wait_cam(p, 'idle')
    else:
        print('  note  ' + k + ' is out of frame at this width (%d,%d); inspection only, not a path' % (xy[0], xy[1]))
check(p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].some(l => l.textContent.trim() === 'Approach')"), 'passage links readable below the room (text fallback)')
shot(p, '8-full-passage'); p.screenshot(path=os.path.join(out, tag + '8-full-passage-page.png'), full_page=True)
check(not [e for e in p._errs if 'audio' not in e.lower()], 'no JS errors'); p.close()
p = g.page('Inside the French', ''); Game.click(p, 'BEGIN', 1200); p.wait_for_timeout(2500)
check(Game.name(p) == 'The French', 'Inside the French forwards to The French (now: %s)' % Game.name(p)); p.close()
p = g.page('Approach The French', '(set: $visited\'s French to true)(set: $visited\'s FrenchVisits to 1)'); Game.click(p, 'BEGIN', 1200); p.wait_for_timeout(6000)
p.evaluate("() => { const b = [...document.querySelectorAll('#fh-wrap div')].find(e => e.textContent === 'ENTER THE FRENCH'); if (b) b.click(); }")
for _ in range(40):
    if p.evaluate("() => !!document.querySelector('#fi-wrap canvas')"): break
    p.wait_for_timeout(300)
p.wait_for_timeout(500)
check(Game.name(p) == 'The French' and p.evaluate("() => !!document.querySelector('#fi-wrap canvas')"), 'ENTER THE FRENCH lands on The French with the room (now: %s)' % Game.name(p))
check(not [e for e in p._errs if 'audio' not in e.lower()], 'no JS errors on the approach'); p.close()
g.close()
print('FAILS', len(FAILS)); [print('  -', f) for f in FAILS]
