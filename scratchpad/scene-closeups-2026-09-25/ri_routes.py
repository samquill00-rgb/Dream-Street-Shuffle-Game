"""Ronnie Scott's as a room: every click drives the passage's own gated control.
Run from scratchpad/audit-2026-09-16: PYTHONPATH=.:<scratchpad> python3 ri_routes.py OUTDIR WIDTH [reduced]"""
import sys, os
from harness import *
from room_harness import *
out, width = sys.argv[1], int(sys.argv[2])
reduced = len(sys.argv) > 3 and sys.argv[3] == 'reduced'
tag = 'ronnies-' + ('phone-' if width < 600 else '') + ('reduced-' if reduced else '')
setup('ri-wrap', width, reduced, out, tag)
P = "Ronnie Scott's"
W = {'stage': [0.1, 1.0, -3.0], 'bar': [-2.75, 1.12, 0.6], 'door': [3.4, 1.2, -0.6], 'phone': [-2.75, 1.25, -0.35], 'photos': [3.45, 1.7, -1.2], 'table': [-1.7, 0.75, -0.2]}
BASE = '(set: $visited\'s Ronnies to true)(set: $lilyCount to 0)(set: $tookLily3 to true)(set: $sobriety to 70)'
def modal_links(p): return p.evaluate("() => [...document.querySelectorAll('tw-passage .phone-ringing tw-link')].map(l => l.textContent.trim())")
def modal_click(p, t): return p.evaluate("(t) => { const l = [...document.querySelectorAll('tw-passage .phone-ringing tw-link')].find(l => l.textContent.trim() === t); if (!l) return false; l.click(); return true; }", t)

print('== the set is on: the bar opens the round for the band, the door is not yet a way out ==')
p = boot(BASE + '(set: $completedSetlist to false)', P)
check(Game.name(p) == P, 'lands on Ronnie Scott\'s')
check(p.evaluate("() => !!document.querySelector('#ri-wrap canvas')"), 'room mounted inside the passage')
check(p.evaluate("() => !!document.getElementById('bar-start-btn')"), 'passage renders its Go to the Bar button')
shot(p, '1-arrival')
vis, ok, c = open_at(p, W['bar']); check(vis and c is not None and len(c['buttons']) == 1 and 'Go to the Bar' in c['buttons'][0], 'bar card offers the passage\'s own button: %s' % (c and c['buttons']))
shot(p, '2-bar-card'); back(p)
vis, ok, c = open_at(p, W['door']); check(c is not None and c['buttons'] == [] and 'Sam:' in c['text'], 'door is an inspection during the set: %s' % (c and c['buttons'])); back(p)
vis, ok, c = open_at(p, W['stage']); check(vis and c is not None and c['buttons'] == [] and 'Sam:' in c['text'], 'stage inspection opens: %s' % (c and c['buttons'])); shot(p, '3-stage-card'); back(p)
open_at(p, W['bar'], 300); press(p, [b for b in card(p)['buttons']][0]); p.wait_for_timeout(2000)
check(Game.name(p) == P and p.evaluate("() => { const c = document.getElementById('bar-canvas'); return !!c && c.style.display !== 'none'; }"), 'the round starts in the passage below (bar canvas shown)')
check(p.evaluate("() => !!document.querySelector('#ri-wrap canvas')"), 'room still mounted while the round plays')
shot(p, '4-round-started')
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()

print('== the set is over: the door opens Back to the street, the bar is an inspection ==')
p = boot(BASE + '(set: $completedSetlist to true)', P)
check(p.evaluate("() => !!document.querySelector('tw-passage .venue-exhausted')") and has_link(p, 'Back to the street'), 'exhausted line and street link rendered')
vis, ok, c = open_at(p, W['door']); check(vis and c is not None and c['buttons'] == ['Back to the street'], 'door offers Back to the street: %s' % (c and c['buttons'])); shot(p, '5-door-card'); back(p)
vis, ok, c = open_at(p, W['bar']); check(c is not None and c['buttons'] == [] and 'Sam:' in c['text'], 'bar is an inspection after the set: %s' % (c and c['buttons'])); back(p)
open_at(p, W['door'], 300); press(p, 'Back to the street'); p.wait_for_timeout(2500)
check(Game.name(p) == 'Dean Street', 'door lands on Dean Street (now: %s)' % Game.name(p))
check(p.evaluate("() => !document.getElementById('ri-wrap')"), 'room disposed on leaving')
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()

print('== the Lily ring and the dual ring: the game\'s own modal over the room ==')
ring = BASE.replace('$lilyCount to 0', '$lilyCount to 1') + '(set: $hadLilyCall1 to false)(set: $hadPhoneCall to true)(set: $returns to 3)(set: $phoneCallReturnsAt to 1)(set: $completedSetlist to false)'
p = boot(ring, P)
check(modal_links(p) == ['Accept the call', "I'm not here"], 'Lily modal shows the two choices: %s' % modal_links(p))
check(not p.evaluate("() => !!document.getElementById('bar-start-btn')"), 'no round while the phone rings (no bypass)')
shot(p, '6-phone-ringing')
modal_click(p, "I'm not here"); p.wait_for_timeout(1500)
check(Game.name(p) == P and modal_links(p) == ['Back to the street'], 'refusal stays, offers Back to the street: %s' % modal_links(p))
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()
p = boot(ring, P); modal_click(p, 'Accept the call'); p.wait_for_timeout(2500)
check(Game.name(p) == 'Lily phone call 1', 'Accept lands on Lily phone call 1 (now: %s)' % Game.name(p)); p.close()
dual = BASE.replace('$lilyCount to 0', '$lilyCount to 2') + '(set: $hadLilyCall1 to true)(set: $hadDualRing to false)(set: $returns to 5)(set: $lilyCall1ReturnsAt to 1)'
p = boot(dual, P)
check(modal_links(p) == ['Accept the call', 'Turn and leave'], 'dual ring modal: %s' % modal_links(p))
modal_click(p, 'Turn and leave'); p.wait_for_timeout(2500)
check(Game.name(p) == 'The Fetch', 'Turn and leave lands on The Fetch (now: %s)' % Game.name(p)); p.close()

print('== inspections; the lily and the lore below the room; the approach lands here ==')
p = boot(BASE.replace('$tookLily3 to true', '$tookLily3 to false') + '(set: $completedSetlist to false)', P)
for k in ('photos', 'table', 'phone'):
    vis, ok, c = open_at(p, W[k])
    if vis: check(ok and c is not None and 'Sam:' in c['text'], k + ' inspection opens'); shot(p, '7-' + k); back(p)
    else: print('  note ' + k + ' is off frame at this size (inspection only)')
check(p.evaluate("() => !!document.querySelector('tw-passage tw-hook[name=\"lily3\"]')"), 'lily hook rendered below the room')
check(p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].some(l => l.textContent.includes('LORE'))"), 'lore link still below the room')
p.screenshot(path=os.path.join(out, tag + '8-full-passage.png'), full_page=True)
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()
p = boot(BASE + '(set: $completedSetlist to false)', "Approach Ronnie Scott's")
for _ in range(40):
    if p.evaluate("() => { const b = [...document.querySelectorAll('#rs-wrap *')].find(b => b.textContent.trim() === \"ENTER RONNIE SCOTT'S\" && b.children.length === 0); if (b) { b.click(); return true; } return false; }"): break
    p.wait_for_timeout(300)
for _ in range(30):
    if Game.name(p) == P and p.evaluate("() => !!document.querySelector('#ri-wrap canvas')"): break
    p.wait_for_timeout(300)
check(Game.name(p) == P and p.evaluate("() => !!document.querySelector('#ri-wrap canvas')"), 'the approach lands in the club with the room (now: %s)' % Game.name(p))
ap = [e for e in errs(p) if "reading 'trim'" not in e]   # the approach scene's own composer throws after disposal on main too (pre-existing)
check(not ap, 'no new JS errors on the approach %s' % ap); p.close()
finish()
