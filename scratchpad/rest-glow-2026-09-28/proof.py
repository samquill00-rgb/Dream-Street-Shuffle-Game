"""Resting glow proof: per room, before (off), loud (1.0), quiet (default), plus hover/inspect checks and one reduced-motion boot.
Run from scratchpad/audit-2026-09-16: PYTHONPATH=.:../scene-closeups-2026-09-25 python3 ../rest-glow-2026-09-28/proof.py OUT"""
import sys, os
from harness import *
from room_harness import *
out = sys.argv[1]
ROOMS = [
 ('fi-wrap', 'french', 'The French', "(set: $frenchApproached to true)(set: $visited's French to true)(set: $visited's FrenchVisits to 1)(set: $haunts to (a:))(set: $lilyCount to 0)"),
 ('ci-wrap', 'colony', 'The Colony Room', "(set: $visited's Colony to true)(set: $lilyCount to 0)(set: $tookLily4 to true)(set: $metDavy to false)(set: $knowsRonnies to false)"),
 ('pi-wrap', 'pillars', 'Entering The Pillars of Hercules', "(set: $visited's Pillars to true)(set: $lilyCount to 0)(set: $tookLily2 to true)(set: $pillarsNoAuto to true)(set: $inisToldOfPillars to false)(set: $dreamKey to \"\")(set: $hadPhoneCall to true)(set: $metCritic to false)(set: $pillarsVisits to 1)"),
 ('ri-wrap', 'ronnies', "Ronnie Scott's", "(set: $visited's Ronnies to true)(set: $lilyCount to 0)(set: $tookLily3 to true)(set: $sobriety to 70)"),
]
REST = "(() => { const e = window._dssThreeRegistry['WRAPID']; const g = e.scene.getObjectByName('restGlow'); return g ? g.children.map(s => ({vis: s.visible, op: +s.material.opacity.toFixed(3), pos: s.position.toArray(), sc: s.scale.x})) : null; })()"
HALO = "(() => { const e = window._dssThreeRegistry['WRAPID']; const h = e.scene.children.find(o => o.isSprite && o.material.depthTest === false && o.material.blending === THREE.AdditiveBlending && !o.parent.name); return h ? {vis: h.visible, op: +h.material.opacity.toFixed(3)} : null; })()"
def rest(p): return p.evaluate(J(REST))
def halo(p): return p.evaluate(J(HALO))
def level(g, v):
    orig = g.b.__class__.new_page
    def np(**kw):
        p = orig(g.b, **kw); p.add_init_script("window.DSS_RESTGLOW = %s;" % v); return p
    g.b.new_page = np
for wrap, tag, P, seeds in ROOMS:
    for lv, name in (('false', '1-before'), ('1', '2-loud'), ('0.3', '3-quiet')):
        setup(wrap, 1280, False, out, tag + '-'); level(S['g'], lv)
        p = boot(seeds, P)
        p.evaluate(J("() => document.getElementById('WRAPID').scrollIntoView({block:'start'})")); p.wait_for_timeout(600)
        r = rest(p); n = sum(1 for s in r if s['vis']) if r else -1
        print('== %s %s: %d resting glows visible of %d hotspots; opacities %s' % (tag, name, n, len(r or []), [s['op'] for s in r if s['vis']] if r else r))
        check((n == 0) if lv == 'false' else n > 0, 'visible count as expected')
        shot(p, name)
        if lv == '0.3':
            first = next(s for s in r if s['vis']); idx = r.index(first)
            xy = screen(p, first['pos']); p.mouse.move(xy[0], xy[1]); p.wait_for_timeout(500)
            r2 = rest(p); h = halo(p)
            check(not r2[idx]['vis'] and h and h['vis'], 'hover: resting glow yields to the hover halo (rest %s, halo %s)' % (r2[idx]['vis'], h))
            shot(p, '4-hover')
            tap(p, xy); wait_cam(p, 'inspect'); p.wait_for_timeout(400)
            check(all(not s['vis'] for s in rest(p)), 'inspect: no resting glows while pushed in')
            back(p); check(any(s['vis'] for s in rest(p)), 'step back: resting glows return')
            check(not errs(p), 'no JS errors %s' % errs(p))
        p.close(); S['g'].close()
# reduced motion once, the Colony
setup('ci-wrap', 1280, True, out, 'colony-'); level(S['g'], '0.3')
p = boot(ROOMS[1][3], ROOMS[1][2]); p.evaluate(J("() => document.getElementById('WRAPID').scrollIntoView({block:'start'})")); p.wait_for_timeout(600)
r = rest(p); check(any(s['vis'] for s in r) and len(set(s['op'] for s in r if s['vis'])) == 1, 'reduced motion: glows present and steady %s' % [s['op'] for s in r if s['vis']])
shot(p, '5-reduced'); p.close(); S['g'].close()
print('FAILS:', FAILS)
