"""The Colony Room as a room: every click drives the passage's own gated link.
Run from scratchpad/audit-2026-09-16: PYTHONPATH=.:<scratchpad> python3 ci_routes.py OUTDIR WIDTH [reduced]"""
import sys, os
from harness import *
from room_harness import *
out, width = sys.argv[1], int(sys.argv[2])
reduced = len(sys.argv) > 3 and sys.argv[3] == 'reduced'
tag = 'colony-' + ('phone-' if width < 600 else '') + ('reduced-' if reduced else '')
setup('ci-wrap', width, reduced, out, tag)
P = 'The Colony Room'
W = {'pictures': [0.2, 1.7, -2.05], 'phone': [-0.67, 1.2, -1.5], 'bar': [-1.8, 1.1, -1.4], 'piano': [2.1, 1.1, -0.55], 'window': [2.5, 1.55, 1.15]}
BASE = '(set: $visited\'s Colony to true)(set: $lilyCount to 0)(set: $tookLily4 to true)'

print('== first time in: the man at the bar is Davy, the agent is at his table, the bar itself has no drink yet ==')
p = boot(BASE + '(set: $metDavy to false)(set: $knowsRonnies to false)', P)
check(Game.name(p) == P, 'lands on The Colony Room')
check(p.evaluate("() => !!document.querySelector('#ci-wrap canvas')"), 'room mounted inside the passage')
check(has_link(p, 'Get a drink with the man at the bar') and has_link(p, 'Talk to the famous agent'), 'passage renders Davy and the agent links')
shot(p, '1-arrival')
vis, ok, c = open_at(p, ghost_pos(p, 0)); check(vis and c is not None and c['buttons'] == ['Get a drink with the man at the bar'], 'man at the bar offers Davy\'s drink: %s' % (c and c['buttons']))
shot(p, '2-davy-card'); back(p)
vis, ok, c = open_at(p, ghost_pos(p, 1)); check(vis and c is not None and c['buttons'] == ['Talk to the famous agent'], 'agent offers his talk: %s' % (c and c['buttons']))
shot(p, '3-agent-card'); back(p)
vis, ok, c = open_at(p, W['bar']); check(c is not None and c['buttons'] == [] and 'Sam:' in c['text'], 'bar is an inspection (no plain drink yet): %s' % (c and c['buttons']))
back(p)
open_at(p, ghost_pos(p, 1), 300); press(p, 'Talk to the famous agent'); p.wait_for_timeout(2500)
check(Game.name(p) == 'Talk to the intimidating agent', 'agent lands on Talk to the intimidating agent (now: %s)' % Game.name(p))
check(p.evaluate("() => !document.getElementById('ci-wrap')"), 'room disposed on leaving')
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()

print('== Davy route ==')
p = boot(BASE + '(set: $metDavy to false)(set: $knowsRonnies to false)', P)
open_at(p, ghost_pos(p, 0), 300); press(p, 'Get a drink with the man at the bar'); p.wait_for_timeout(2500)
check(Game.name(p) == 'Davy Merkin', 'Davy lands on Davy Merkin (now: %s)' % Game.name(p))
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()

print('== later: Davy met, agent known; the bar offers the drink, no figure is clickable ==')
p = boot(BASE + '(set: $metDavy to true)(set: $knowsRonnies to true)', P)
check(has_link(p, 'Get a drink') and not has_link(p, 'Talk to the famous agent'), 'passage renders Get a drink only')
vis, ok, c = open_at(p, W['bar']); check(vis and c is not None and c['buttons'] == ['Get a drink'], 'bar offers Get a drink: %s' % (c and c['buttons']))
shot(p, '4-bar-drink-card'); back(p)
xy = screen(p, ghost_pos(p, 1)); tap(p, xy); p.wait_for_timeout(1500); c = card(p)
check(p.evaluate("() => document.getElementById('ci-wrap').dataset.cam") == 'idle' or (c is not None and c['buttons'] == []), 'agent ignored when no path is offered (card: %s)' % (c and c['buttons']))
if c: back(p)
open_at(p, W['bar'], 300); press(p, 'Get a drink'); p.wait_for_timeout(2500)
check(Game.name(p) == 'Colony drink choice', 'drink lands on Colony drink choice (now: %s)' % Game.name(p))
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()

print('== the Lily call: the game\'s own ringing modal sits over the room; its links are the path ==')
ring = BASE.replace('$lilyCount to 0', '$lilyCount to 1') + '(set: $hadLilyCall1 to false)(set: $hadPhoneCall to true)(set: $returns to 3)(set: $phoneCallReturnsAt to 1)(set: $metDavy to true)(set: $knowsRonnies to true)'
def modal_links(p): return p.evaluate("() => [...document.querySelectorAll('tw-passage .phone-ringing tw-link')].map(l => l.textContent.trim())")
def modal_click(p, t): return p.evaluate("(t) => { const l = [...document.querySelectorAll('tw-passage .phone-ringing tw-link')].find(l => l.textContent.trim() === t); if (!l) return false; l.click(); return true; }", t)
p = boot(ring, P)
check(p.evaluate("() => !!document.querySelector('tw-passage .phone-ringing')"), 'phone-ringing rendered by Harlowe over the room')
check(p.evaluate("() => !!document.querySelector('#ci-wrap canvas')"), 'room mounted under the ringing modal')
check(not has_link(p, 'Get a drink'), 'no drink link while the phone rings (no bypass)')
check(modal_links(p) == ['Accept the call', "I'm not here"], 'modal shows the two call choices: %s' % modal_links(p))
shot(p, '5-phone-ringing')
modal_click(p, "I'm not here"); p.wait_for_timeout(1500)
check(Game.name(p) == P, 'refusal stays in The Colony Room')
check(p.evaluate("() => document.querySelector('tw-passage').textContent.includes('What would Lily want')"), 'refusal text replaced in the passage')
check(modal_links(p) == ['Back to the street'], 'after refusal the modal offers Back to the street: %s' % modal_links(p))
shot(p, '6-phone-refused')
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()
p = boot(ring, P); modal_click(p, 'Accept the call'); p.wait_for_timeout(2500)
check(Game.name(p) == 'Lily phone call 1', 'Accept lands on Lily phone call 1 (now: %s)' % Game.name(p))
check(p.evaluate("() => !document.getElementById('ci-wrap')"), 'room disposed on the call'); p.close()

print('== the dual ring ==')
dual = BASE.replace('$lilyCount to 0', '$lilyCount to 2') + '(set: $hadLilyCall1 to true)(set: $hadDualRing to false)(set: $returns to 5)(set: $lilyCall1ReturnsAt to 1)(set: $metDavy to true)(set: $knowsRonnies to true)'
p = boot(dual, P)
check(modal_links(p) == ['Accept the call', 'Turn and leave'], 'dual ring modal shows Accept / Turn and leave: %s' % modal_links(p))
modal_click(p, 'Turn and leave'); p.wait_for_timeout(2500)
check(Game.name(p) == 'The Fetch', 'Turn and leave lands on The Fetch (now: %s)' % Game.name(p)); p.close()

print('== inspections; the lily below the room; the door passage still lands here ==')
p = boot(BASE.replace('$tookLily4 to true', '$tookLily4 to false') + '(set: $metDavy to true)(set: $knowsRonnies to true)', P)
for k in ('pictures', 'piano', 'window'):
    vis, ok, c = open_at(p, W[k])
    if vis: check(ok and c is not None and 'Sam:' in c['text'], k + ' inspection opens'); shot(p, '7-' + k); back(p)
    else: print('  note ' + k + ' is off frame at this size (inspection only)')
check(p.evaluate("() => !!document.querySelector('tw-passage tw-hook[name=\"lily4\"]')"), 'lily hook rendered below the room')
p.screenshot(path=os.path.join(out, tag + '8-full-passage.png'), full_page=True)
check(not errs(p), 'no JS errors %s' % errs(p)); p.close()
p = boot(BASE + '(set: $metDavy to true)(set: $knowsRonnies to true)', 'The Colony Room Door')
check(Game.name(p) == P and p.evaluate("() => !!document.querySelector('#ci-wrap canvas')"), 'The Colony Room Door forwards to the room (now: %s)' % Game.name(p)); p.close()
finish()
