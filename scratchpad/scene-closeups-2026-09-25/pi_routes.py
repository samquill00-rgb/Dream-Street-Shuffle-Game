"""The Pillars of Hercules as a room: every click drives the passage's own gated link.
Run from scratchpad/audit-2026-09-16: PYTHONPATH=.:<scratchpad> python3 pi_routes.py OUTDIR WIDTH [reduced]"""
import sys, os
from harness import *
from room_harness import *
out, width = sys.argv[1], int(sys.argv[2])
reduced = len(sys.argv) > 3 and sys.argv[3] == 'reduced'
tag = 'pillars-' + ('phone-' if width < 600 else '') + ('reduced-' if reduced else '')
setup('pi-wrap', width, reduced, out, tag)
P = 'Entering The Pillars of Hercules'
W = {'bar': [-1.4, 1.12, -0.4], 'pillar': [0, 1.5, -1.7], 'door': [2.2, 1.0, 0.6], 'phone': [-2.1, 1.45, 1.3], 'window': [-1.35, 2.3, -3.98], 'glass': [0, 3.08, -0.95]}
BASE = '(set: $visited\'s Pillars to true)(set: $lilyCount to 0)(set: $tookLily2 to true)(set: $pillarsNoAuto to true)(set: $inisToldOfPillars to false)(set: $dreamKey to "")'
def modal_links(p): return p.evaluate("() => [...document.querySelectorAll('tw-passage .phone-ringing tw-link')].map(l => l.textContent.trim())")
def modal_click(p, t): return p.evaluate("(t) => { const l = [...document.querySelectorAll('tw-passage .phone-ringing tw-link')].find(l => l.textContent.trim() === t); if (!l) return false; l.click(); return true; }", t)

print('== the Ham: the man through the fumes is clickable only while the passage offers him ==')
p = boot(BASE + '(set: $hadPhoneCall to true)(set: $metCritic to false)(set: $pillarsVisits to 1)', P)
check(Game.name(p) == P, 'lands on Entering The Pillars of Hercules')
check(p.evaluate("() => !!document.querySelector('#pi-wrap canvas')"), 'room mounted inside the passage')
check(has_link(p, 'Talk to the Great Ham'), 'passage renders the Ham link')
shot(p, '1-arrival')
vis, ok, c = open_at(p, ghost_pos(p, 0)); check(vis and c is not None and c['buttons'] == ['Talk to the Great Ham'], 'the man offers Talk to the Great Ham: %s' % (c and c['buttons']))
shot(p, '2-ham-card'); back(p)
vis, ok, c = open_at(p, W['bar']); check(c is not None and c['buttons'] == [] and 'Sam:' in c['text'], 'bar is an inspection before the critic: %s' % (c and c['buttons'])); back(p)
vis, ok, c = open_at(p, W['pillar']); check(c is not None and c['buttons'] == [] and 'Sam:' in c['text'], 'third pillar is an inspection with no key: %s' % (c and c['buttons'])); shot(p, '3-pillar-shut'); back(p)
open_at(p, ghost_pos(p, 0), 300); press(p, 'Talk to the Great Ham'); p.wait_for_timeout(2500)
check(Game.name(p) == 'Talk to the critic', 'Ham lands on Talk to the critic (now: %s)' % Game.name(p))
check(p.evaluate("() => !document.getElementById('pi-wrap')"), 'room disposed on leaving')
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()

print('== after the critic: the bar offers the drink, the threshold offers the walk on water, the man is not clickable ==')
p = boot(BASE + '(set: $hadPhoneCall to true)(set: $metCritic to true)(set: $pillarsVisits to 2)(set: $sobriety to 70)', P)
check(has_link(p, 'Get a drink at the bar') and has_link(p, "'I can walk on water'") and not has_link(p, 'Talk to the Great Ham'), 'passage renders drink and water, no Ham')
vis, ok, c = open_at(p, W['bar']); check(vis and c is not None and c['buttons'] == ['Get a drink at the bar'], 'bar offers the drink: %s' % (c and c['buttons'])); shot(p, '4-bar-drink-card'); back(p)
vis, ok, c = open_at(p, W['door']); check(c is not None and c['buttons'] == ["'I can walk on water'"], 'threshold offers the walk on water: %s' % (c and c['buttons'])); shot(p, '5-threshold-card'); back(p)
xy = screen(p, ghost_pos(p, 0)); tap(p, xy); p.wait_for_timeout(1800); c = card(p)
check(p.evaluate("() => document.getElementById('pi-wrap').dataset.cam") == 'idle' or (c is not None and c['buttons'] == []), 'the man ignored when no path is offered (card: %s)' % (c and c['buttons']))
if c: back(p)
open_at(p, W['bar'], 300); press(p, 'Get a drink at the bar'); p.wait_for_timeout(2500)
check(Game.name(p) == 'Which drink at the Pillars?', 'drink lands on Which drink at the Pillars? (now: %s)' % Game.name(p))
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()
p = boot(BASE + '(set: $hadPhoneCall to true)(set: $metCritic to true)(set: $pillarsVisits to 2)(set: $sobriety to 70)', P)
open_at(p, W['door'], 300); press(p, "'I can walk on water'"); p.wait_for_timeout(2500)
check(Game.name(p) == 'The coast of Carthage', 'walk on water lands on The coast of Carthage (now: %s)' % Game.name(p)); p.close()
p = boot(BASE + '(set: $hadPhoneCall to true)(set: $metCritic to true)(set: $pillarsVisits to 3)(set: $sobriety to 30)', P)
vis, ok, c = open_at(p, W['door']); check(c is not None and c['buttons'] == ["'I can walk on water'"], 'drunk variant (link:) also found by its wording: %s' % (c and c['buttons']))
press(p, "'I can walk on water'"); p.wait_for_timeout(2500)
check(Game.name(p) == 'The coast of Carthage', 'stumbled crossing lands on The coast of Carthage (now: %s)' % Game.name(p)); p.close()

print('== the third pillar with a key in the pocket ==')
p = boot(BASE.replace('$inisToldOfPillars to false', '$inisToldOfPillars to true').replace('$dreamKey to ""', '$dreamKey to "nazca"') + '(set: $hadPhoneCall to true)(set: $metCritic to true)(set: $pillarsVisits to 2)(set: $sawThirdPillar to true)', P)
check(Game.name(p) == P, 'stays in the pub with $pillarsNoAuto (now: %s)' % Game.name(p))
check(has_link(p, 'Step through the third pillar'), 'passage renders Step through the third pillar')
check(p.evaluate("() => !!document.querySelector('tw-passage .pillars-scene .pillar.centre')"), 'passage shows its own centre pillar')
vis, ok, c = open_at(p, W['pillar']); check(vis and c is not None and c['buttons'] == ['Step through the third pillar'], 'third pillar offers the crossing: %s' % (c and c['buttons'])); shot(p, '6-pillar-open-card')
press(p, 'Step through the third pillar'); p.wait_for_timeout(2500)
check(Game.name(p) == 'Third Pillar Portal', 'crossing lands on Third Pillar Portal (now: %s)' % Game.name(p))
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()

print('== the first phone call (Aoife) and the Lily ring: the game\'s own modal over the room ==')
p = boot(BASE + '(set: $hadPhoneCall to false)(set: $metCritic to false)(set: $pillarsVisits to 1)', P)
check(modal_links(p) == ['Accept the call', "I'm not here"], 'Aoife modal shows Accept / I\'m not here: %s' % modal_links(p))
check(p.evaluate("() => !!document.querySelector('#pi-wrap canvas')"), 'room mounted under the modal')
shot(p, '7-first-call')
modal_click(p, "I'm not here"); p.wait_for_timeout(1500)
check(Game.name(p) == P and p.evaluate("() => document.querySelector('tw-passage').textContent.includes('Not seen him')"), 'refusal replaced in the passage, still in the pub')
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()
p = boot(BASE + '(set: $hadPhoneCall to false)(set: $metCritic to false)(set: $pillarsVisits to 1)', P)
modal_click(p, 'Accept the call'); p.wait_for_timeout(2500)
check(Game.name(p) == 'The phone call', 'Accept lands on The phone call (now: %s)' % Game.name(p)); p.close()
ring = BASE.replace('$lilyCount to 0', '$lilyCount to 1') + '(set: $hadLilyCall1 to false)(set: $hadPhoneCall to true)(set: $returns to 3)(set: $phoneCallReturnsAt to 1)(set: $metCritic to true)(set: $pillarsVisits to 2)'
p = boot(ring, P)
check(modal_links(p) == ['Accept the call', "I'm not here"] and not has_link(p, 'Get a drink at the bar'), 'Lily ring modal, no drink bypass: %s' % modal_links(p))
modal_click(p, 'Accept the call'); p.wait_for_timeout(2500)
check(Game.name(p) == 'Lily phone call 1', 'Accept lands on Lily phone call 1 (now: %s)' % Game.name(p)); p.close()

print('== inspections; the lily and the key guards below the room; the exterior lands here ==')
p = boot(BASE.replace('$tookLily2 to true', '$tookLily2 to false') + '(set: $hadPhoneCall to true)(set: $metCritic to true)(set: $pillarsVisits to 2)', P)
for k in ('window', 'phone'):
    vis, ok, c = open_at(p, W[k])
    if vis: check(ok and c is not None and 'Sam:' in c['text'], k + ' inspection opens'); shot(p, '8-' + k); back(p)
    else: print('  note ' + k + ' is off frame at this size (inspection only)')
check(p.evaluate("() => !!document.querySelector('tw-passage tw-hook[name=\"lily2\"]')"), 'lily hook rendered below the room')
p.screenshot(path=os.path.join(out, tag + '9-full-passage.png'), full_page=True)
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()
p = boot(BASE + '(set: $hadPhoneCall to true)(set: $metCritic to true)(set: $pillarsVisits to 2)', 'Approach The Pillars')
for _ in range(40):
    if p.evaluate("() => { const b = [...document.querySelectorAll('#ph-wrap *')].find(b => b.textContent.trim() === 'GO TO THE PILLARS' && b.children.length === 0); if (b) { b.click(); return true; } return false; }"): break
    p.wait_for_timeout(300)
for _ in range(30):
    if Game.name(p) == P and p.evaluate("() => !!document.querySelector('#pi-wrap canvas')"): break
    p.wait_for_timeout(300)
check(Game.name(p) == P and p.evaluate("() => !!document.querySelector('#pi-wrap canvas')"), 'the approach lands in the pub with the room (now: %s)' % Game.name(p))
check(not errs(p), 'no JS errors on the approach %s' % errs(p)); p.close()
finish()
