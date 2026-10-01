"""Desktop/phone walks for the five rooms built from the kit: Coach (cb), Trisha's (ti), Lackland (lk), Chippy (cc), O'Flatterly (oi).
Run from scratchpad/audit-2026-09-16: PYTHONPATH=.:<scene-closeups> python3 five_routes.py ROOM OUTDIR WIDTH [reduced]"""
import sys
from harness import *
from room_harness import *
room, out, width = sys.argv[1], sys.argv[2], int(sys.argv[3])
reduced = len(sys.argv) > 4 and sys.argv[4] == 'reduced'
NAMES = {'cb': 'coach', 'ti': 'trishas', 'lk': 'lackland', 'cf': 'chippy', 'oi': 'oflatterly'}
tag = NAMES[room] + '-' + ('phone-' if width < 600 else '') + ('reduced-' if reduced else '')
setup(room + '-wrap', width, reduced, out, tag)

def mounted(p, P, gone=None):
    check(Game.name(p) == P, 'lands on ' + P + ' (now: %s)' % Game.name(p))
    check(p.evaluate("() => !!document.querySelector('#%s-wrap canvas')" % room), 'room mounted inside the passage')
    check(p.evaluate("() => !!document.querySelector('#%s-wrap .dss-room-prose')" % room), 'the passage\'s words sit in the panel')
    if gone: check(p.evaluate("() => !document.querySelector('tw-passage %s')" % gone), 'old decoration %s is gone from under the room' % gone)

_open_at = open_at
def open_at(p, world, wait=400):
    wait_cam(p, 'idle'); return _open_at(p, world, wait)

def absent(p, key):
    xy = screen(p, at(p, key)); tap(p, xy); p.wait_for_timeout(600)
    check(card(p) is None and p.evaluate("() => document.getElementById('%s-wrap').dataset.cam" % room) == 'idle', key + ' is not clickable now (figure with nothing to offer)')

def spots(p):
    sp = p.evaluate("() => window._dssThreeRegistry['%s-wrap'].spots" % room)
    return {x['name']: x for x in sp}

def at(p, key):
    sp = spots(p)[NAME[key]]
    return sp['haloAt']

def named(c, key): return c is not None and NAME[key].upper() in c['text'].upper()

def offers(p, W, key, buttons, n, claimed=True):
    vis, ok, c = open_at(p, at(p, key))
    check(vis and named(c, key) and sorted(c['buttons']) == sorted(buttons), '%s offers %s: %s' % (key, buttons, c and (c['buttons'], c['text'][:40]))); shot(p, '%d-%s-card' % (n, key)); back(p)
    for b in (buttons if claimed else []):
        if b.startswith('['): continue
        check(p.evaluate("(t) => [...document.querytSelectorAll('tw-passage tw-link')].filter(l => l.textContent.trim() === t).every(l => l.classList.contains('dss-claimed'))".replace('querytSelectorAll', 'querySelectorAll'), b), '"%s" is hidden in the panel (claimed)' % b)

def inspections(p, W, keys, n):
    for key in keys:
        vis, ok, c = open_at(p, at(p, key))
        if vis: check(ok and named(c, key) and c['buttons'] == [] and 'Sam:' in c['text'], key + ' is an inspection with a pink line (%s)' % (c and c['text'][:30])); shot(p, '%d-%s' % (n, key)); back(p)
        else: print('  note ' + key + ' is off frame at this size')

def goes(p, W, key, label, dest):
    open_at(p, at(p, key), 300); press(p, label); p.wait_for_timeout(2500)
    check(Game.name(p) == dest, '"%s" lands on %s (now: %s)' % (label, dest, Game.name(p)))
    check(p.evaluate("() => !document.getElementById('%s-wrap')" % room), 'room disposed on leaving')

def clean(p): check(not errs(p), 'no JS errors %s' % errs(p)); p.close()

if room == 'cb':
    NAME = {'cow': 'the cow', 'bernard': 'Jeffrey Bernard', 'glass': 'his glass', 'optics': 'the optics', 'telephone': 'the telephone', 'windows': 'the windows', 'door': 'the door', 'gents': 'the gents'}
    P = 'Coach and Horses bar'; Wd, D = 8.0, 7.0; barZ = -D / 2 + 1.1
    W = {'cow': [1.2, 1.0, -D / 2 + 0.9], 'bernard': [-0.3, 0.7, barZ + 0.9], 'glass': [-0.3, 1.18, barZ + 0.2], 'optics': [0.2, 2.2, -D / 2 + 0.2], 'telephone': [-2.95, 1.45, -D / 2 + 0.3], 'windows': [-Wd / 2, 1.9, -0.8], 'door': [-Wd / 2, 1.3, 2.3], 'gents': [Wd / 2, 1.2, -1.6]}
    BASE = '(set: $hadPhoneCall to false)(set: $lilyCount to 0)(set: $alba to (a: $alba1, $alba2))(set: $cowRideDone to false)(set: $haunts to (a:))(set: $knowsLackland to false)(set: $primerShown to true)(set: $inisToldOfPillars to false)'
    print('== quiet night: the cow is for riding, the rest are inspections =='); p = boot(BASE, P); mounted(p, P); shot(p, '1-arrival')
    offers(p, W, 'cow', ['Ride the beast'], 2); inspections(p, W, ['bernard', 'glass', 'optics', 'telephone', 'windows', 'door', 'gents'], 3)
    goes(p, W, 'cow', 'Ride the beast', "Ride Jeffrey Bernard's cow"); clean(p)
    print('== cow ridden already: nothing to press =='); p = boot(BASE.replace('$cowRideDone to false', '$cowRideDone to true'), P); inspections(p, W, ['cow'], 4); clean(p)
    ring = BASE.replace('$lilyCount to 0', '$lilyCount to 1').replace('$hadPhoneCall to false', '$hadPhoneCall to true') + '(set: $hadLilyCall1 to false)(set: $returns to 3)(set: $phoneCallReturnsAt to 1)'
    print('== Lily rings: the telephone takes the call =='); p = boot(ring, P); mounted(p, P)
    offers(p, W, 'telephone', ['Accept the call', "I'm not here"], 5, False); inspections(p, W, ['cow'], 6)
    goes(p, W, 'telephone', 'Accept the call', 'Lily phone call 1'); clean(p)
    dual = BASE.replace('$lilyCount to 0', '$lilyCount to 2').replace('$hadPhoneCall to false', '$hadPhoneCall to true') + '(set: $hadLilyCall1 to true)(set: $hadDualRing to false)(set: $returns to 5)(set: $lilyCall1ReturnsAt to 1)'
    print('== the dual ring =='); p = boot(dual, P); offers(p, W, 'telephone', ['Accept the call', 'Turn and leave'], 7, False); goes(p, W, 'telephone', 'Turn and leave', 'The Fetch'); clean(p)

elif room == 'ti':
    NAME = {'shana': 'Shana', 'stairs': 'the stairs', 'bar': 'the bar', 'jukebox': 'the jukebox', 'wheel': "the ship's wheel", 'photographs': 'the photographs', 'backdoor': 'the door to the back'}
    P = "Trisha's"; Wd, D = 6.0, 6.0; SZ = -D / 2 + 0.3; barX = Wd / 2 - 0.75; barZ = (-1.4 + 1.2) / 2
    W = {'shana': [-0.3, 0.6, SZ + 0.05], 'stairs': [1.9, 1.3, D / 2 - 0.2], 'bar': [barX, 1.1, barZ], 'jukebox': [Wd / 2 - 0.45, 0.9, 2.1], 'photographs': [-Wd / 2, 1.4, 1.9], 'backdoor': [-Wd / 2, 1.0, 2.4]}
    BASE = "(set: $visited's Trishas to true)(set: $metShana to false)(set: $knowsRonnies to true)(set: $completedSetlist to false)(set: $haunts to (a:))(set: $hauntExplained to true)(set: $inisToldOfPillars to false)"
    print('== Shana not yet met: she takes the approach, the stairs take both ways out =='); p = boot(BASE, P); mounted(p, P, '.trishas-strip'); shot(p, '1-arrival')
    offers(p, W, 'shana', ['Approach Shana'], 2); offers(p, W, 'stairs', ['Back to the street', "Ronnie Scott's is nearby."], 3)
    inspections(p, W, ['bar', 'jukebox', 'wheel', 'photographs', 'backdoor'], 4); goes(p, W, 'shana', 'Approach Shana', 'Approach Shana'); clean(p)
    print('== Shana met, Ronnie\'s unknown: she is an inspection, the stairs give the street only =='); p = boot(BASE.replace('$metShana to false', '$metShana to true').replace('$knowsRonnies to true', '$knowsRonnies to false'), P)
    absent(p, 'shana'); offers(p, W, 'stairs', ['Back to the street'], 6); goes(p, W, 'stairs', 'Back to the street', 'Dean Street'); clean(p)

elif room == 'lk':
    NAME = {'turntable': 'the turntable', 'backdoor': 'the door at the back', 'lackland': 'Lackland', 'book': 'your book', 'glass': 'the glass', 'dish': 'the dish', 'window': 'the window', 'shelves': 'the shelves'}
    P = "Martin Lackland's Office"; Wd, D = 5.6, 6.0
    W = {'turntable': [Wd / 2 - 0.35, 1.25, -1.0], 'backdoor': [-1.6, 1.1, -D / 2], 'lackland': [-0.3, 0.7, -2.35], 'book': [-0.2, 0.82, -1.68], 'glass': [0.35, 0.85, -1.6], 'dish': [-0.65, 0.8, -1.4], 'window': [1.4, 1.7, -D / 2], 'shelves': [-Wd / 2, 1.3, -0.6]}
    BASE = '(set: $nazcaTracing to false)(set: $metDavy to true)(set: $confidence to 70)(set: $inisToldOfPillars to false)'
    print('== the turntable holds the lore, the back door holds Linger =='); p = boot(BASE, P); mounted(p, P); shot(p, '1-arrival')
    offers(p, W, 'turntable', ["What's he listening to?"], 2); offers(p, W, 'backdoor', ['Linger'], 3)
    inspections(p, W, ['lackland', 'book', 'glass', 'dish', 'window', 'shelves'], 4)
    open_at(p, at(p, 'turntable'), 300); press(p, "What's he listening to?"); p.wait_for_timeout(800)
    check(p.evaluate("() => !!document.querySelector('#lk-wrap .dss-room-prose .lore-box')"), 'the lore opens in the panel'); shot(p, '5-lore')
    inspections(p, W, ['turntable'], 6)
    goes(p, W, 'backdoor', 'Linger', "Martin Lackland's Back Door"); clean(p)

elif room == 'cf':
    NAME = {'plate': 'your plate', 'window': 'the window', 'range': 'the range', 'menu': 'the menu', 'ticket': 'the ticket', 'table': 'the empty table', 'door': 'the door'}
    P = 'Chinese Fish and Chips'; Wd, D = 4.2, 6.4
    W = {'plate': [Wd / 2 - 0.33, 1.0, 1.2], 'window': [-0.6, 1.45, D / 2], 'range': [-0.5, 1.2, -D / 2 + 0.55], 'menu': [0, 1.75, -D / 2], 'ticket': [Wd / 2 - 0.45, 1.0, 0.75], 'table': [-1.35, 0.75, 1.9], 'door': [1.3, 1.2, D / 2]}
    BASE = '(set: $hadChippy to false)(set: $tookLily1 to false)(set: $sobriety to 70)(set: $hasMatches to true)(set: $lilyCount to 0)(set: $inisToldOfPillars to false)(set: $lilyHintShown to true)'
    print('== first visit: the plate eats, the window holds the lily =='); p = boot(BASE, P); mounted(p, P, '.chippy-tube'); shot(p, '1-arrival')
    check(p.evaluate("() => !document.querySelector('tw-passage .chippy-light')"), 'the strip lights are gone from under the room')
    offers(p, W, 'plate', ['Eat.'], 2); offers(p, W, 'window', ['[Sam: the lily]'], 3)
    check(p.evaluate("() => !!document.querySelector('tw-passage tw-hook[name=\"lily1\"] svg')"), 'lily hook rendered below the room')
    inspections(p, W, ['range', 'menu', 'ticket', 'table', 'door'], 4)
    open_at(p, at(p, 'window'), 300); press(p, '[Sam: the lily]'); p.wait_for_timeout(1200)
    check(p.evaluate("() => !!document.querySelector('tw-passage tw-hook[name=\"lily1\"] .lily-glimpse') || !document.querySelector('tw-passage tw-hook[name=\"lily1\"] svg')"), 'pressing the lily takes it')
    inspections(p, W, ['window'], 5)
    goes(p, W, 'plate', 'Eat.', 'Dean Street'); clean(p)
    print('== lily taken already, drunk: the window is an inspection =='); p = boot(BASE.replace('$tookLily1 to false', '$tookLily1 to true').replace('$hadChippy to false', '$hadChippy to true'), P)
    inspections(p, W, ['window'], 6); offers(p, W, 'plate', ['Eat.'], 7); clean(p)

elif room == 'oi':
    NAME = {'inis': "Inis O'Flatterly", 'counter': 'the counter', 'shelves': 'the shelves', 'ladder': 'the ladder', 'case': 'the glass case', 'globe': 'the globe', 'bell': 'the bell', 'window': 'the window', 'door': 'the door'}
    P = "O'Flatterly's shop"; Wd, D = 4.4, 7.0; CZ = -D / 2 + 1.7
    W = {'inis': [0.6, 0.7, CZ - 0.72], 'counter': [0.5, 1.0, CZ], 'shelves': [-Wd / 2, 1.5, -0.8], 'ladder': [-Wd / 2 + 0.55, 1.6, -1.6], 'case': [Wd / 2 - 0.55, 0.9, 1.4], 'globe': [-1.5, 1.2, -1.9], 'bell': [-0.5, 2.1, D / 2], 'window': [0.9, 1.5, D / 2], 'door': [-0.8, 1.2, D / 2]}
    BASE = '(set: $pyramidNumber to false)(set: $returnedPage to false)(set: $hasMissingPage to false)'
    print('== Inis takes the introduction =='); p = boot(BASE, P); mounted(p, P); shot(p, '1-arrival')
    offers(p, W, 'inis', ['The Great Ham sent me'], 2); inspections(p, W, ['counter', 'shelves', 'ladder', 'case', 'globe', 'bell', 'window', 'door'], 3)
    goes(p, W, 'inis', 'The Great Ham sent me', "O'Flatterly introduction"); clean(p)
finish()
