"""Copper's cellar as a room: every click drives the passage's own gated link.
Run from scratchpad/audit-2026-09-16: PYTHONPATH=.:<scene-closeups> python3 cu_routes.py OUTDIR WIDTH [reduced]"""
import sys, os
from harness import *
from room_harness import *
out, width = sys.argv[1], int(sys.argv[2])
reduced = len(sys.argv) > 3 and sys.argv[3] == 'reduced'
tag = 'copper-' + ('phone-' if width < 600 else '') + ('reduced-' if reduced else '')
setup('cu-wrap', width, reduced, out, tag)
P = 'Turn to Copper'
SZ = -6 + 2.4
W = {'copper': [-0.85, 1.0, 2.3], 'ashton': [-0.45, 0.8, SZ + 0.55], 'frankie': [0.45, 0.9, SZ - 0.55], 'bulb': [0, 2.8 - 0.9, 0.6], 'stairs': [-2.3, 1.9, -2.0], 'sofa': [2.45, 0.5, 0.2]}
BASE = '(set: $crossed to "")(set: $knowsCopperWord to false)(set: $haunts to (a: $haunt4))'

print('== the words not known: Copper takes Say nothing and the names, Ashton the look ==')
p = boot(BASE, P)
check(Game.name(p) == P, 'lands on Turn to Copper')
check(p.evaluate("() => !!document.querySelector('#cu-wrap canvas')"), 'room mounted inside the passage')
check(p.evaluate("() => !!document.querySelector('#cu-wrap .dss-room-prose')"), 'the passage\'s words sit in the panel')
check(p.evaluate("() => !document.querySelector('tw-passage .cellar-bulb-wrap')"), 'the drawn bulb is gone from under the room')
shot(p, '1-arrival')
vis, ok, c = open_at(p, W['copper']); check(vis and c is not None and c['buttons'] == ['Say nothing', "Give him Red's name", "Give him John's name"], 'Copper offers the passage\'s own choices: %s' % (c and c['buttons'])); shot(p, '2-copper-card'); back(p)
check(p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].filter(l => l.textContent.trim() === 'Say nothing').every(l => l.classList.contains('dss-claimed'))"), 'Say nothing is hidden in the panel (claimed)')
vis, ok, c = open_at(p, W['ashton']); check(vis and c is not None and c['buttons'] == ['Break the agreement. Look at her.'], 'Ashton offers the look: %s' % (c and c['buttons'])); shot(p, '3-ashton-card'); back(p)
for key in ('frankie', 'bulb', 'stairs', 'sofa'):
    vis, ok, c = open_at(p, W[key])
    if vis: check(ok and c is not None and c['buttons'] == [] and 'Sam:' in c['text'], key + ' is an inspection with a pink line'); shot(p, '4-' + key); back(p)
    else: print('  note ' + key + ' is off frame at this size')
open_at(p, W['copper'], 300); press(p, 'Say nothing'); p.wait_for_timeout(2500)
check(Game.name(p) == 'Copper confronts', 'Say nothing lands on Copper confronts (now: %s)' % Game.name(p))
check(p.evaluate("() => !document.getElementById('cu-wrap')"), 'room disposed on leaving')
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()

print('== the look, and a name ==')
p = boot(BASE, P); open_at(p, W['ashton'], 300); press(p, 'Break the agreement. Look at her.'); p.wait_for_timeout(2500)
check(Game.name(p) == 'You notice her', 'the look lands on You notice her (now: %s)' % Game.name(p)); p.close()
p = boot(BASE, P); open_at(p, W['copper'], 300); press(p, "Give him John's name"); p.wait_for_timeout(2500)
check(Game.name(p) == 'You give him John', "John's name lands on You give him John (now: %s)" % Game.name(p)); p.close()

print('== the words known: the password stays in the panel and can be typed ==')
p = boot(BASE.replace('$knowsCopperWord to false', '$knowsCopperWord to true'), P)
check(p.evaluate("() => !!document.querySelector('#cu-wrap .dss-room-prose #copper-pwd-input')"), 'password box rendered in the panel')
vis, ok, c = open_at(p, W['copper']); check(c is not None and c['buttons'] == ["Give him Red's name", "Give him John's name"], 'Copper offers the names only: %s' % (c and c['buttons'])); back(p)
r = p.evaluate("() => { const e = document.getElementById('copper-pwd-input'); e.scrollIntoView({block: 'center'}); const b = e.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }")
tap(p, r); p.wait_for_timeout(300)
check(p.evaluate("() => document.activeElement && document.activeElement.id === 'copper-pwd-input'"), 'a press on the box through the room focuses it')
shot(p, '5-password')
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()

print('== the crossing made: no names, no look ==')
p = boot(BASE.replace('$crossed to ""', '$crossed to "red"'), P)
vis, ok, c = open_at(p, W['copper']); check(c is not None and c['buttons'] == ['Say nothing'], 'Copper offers Say nothing only: %s' % (c and c['buttons'])); back(p)
vis, ok, c = open_at(p, W['ashton']); check(c is not None and c['buttons'] == [] and 'Sam:' in c['text'], 'Ashton is an inspection once crossed'); back(p)
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()

print('== the approach lands here ==')
p = boot(BASE, 'Approach Coppers Lair')
for _ in range(40):
    if p.evaluate("() => { const b = [...document.querySelectorAll('#cl-wrap *')].find(b => b.textContent.trim() === \"ANNOUNCE YOURSELF IN COPPER'S LAIR\" && b.children.length === 0); if (b) { b.click(); return true; } return false; }"): break
    p.wait_for_timeout(300)
for _ in range(30):
    if Game.name(p) == P and p.evaluate("() => !!document.querySelector('#cu-wrap canvas')"): break
    p.wait_for_timeout(300)
check(Game.name(p) == P and p.evaluate("() => !!document.querySelector('#cu-wrap canvas')"), 'the approach lands in the cellar with the room (now: %s)' % Game.name(p))
ap = [e for e in errs(p) if "reading 'trim'" not in e]
check(not ap, 'no new JS errors on the approach %s' % ap); p.close()
finish()
