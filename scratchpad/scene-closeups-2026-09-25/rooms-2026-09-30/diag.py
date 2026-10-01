import sys
from harness import *
from room_harness import *
room = sys.argv[1]
SEEDS = {
 'cb': ('Coach and Horses bar', '(set: $hadPhoneCall to false)(set: $lilyCount to 0)(set: $alba to (a: $alba1, $alba2))(set: $cowRideDone to false)(set: $haunts to (a:))(set: $knowsLackland to false)(set: $primerShown to true)(set: $inisToldOfPillars to false)'),
 'ti': ("Trisha's", "(set: $visited's Trishas to true)(set: $metShana to false)(set: $knowsRonnies to true)(set: $completedSetlist to false)(set: $haunts to (a:))(set: $hauntExplained to true)(set: $inisToldOfPillars to false)"),
 'lk': ("Martin Lackland's Office", '(set: $nazcaTracing to false)(set: $metDavy to true)(set: $confidence to 70)(set: $inisToldOfPillars to false)'),
 'cf': ('Chinese Fish and Chips', '(set: $hadChippy to false)(set: $tookLily1 to false)(set: $sobriety to 70)(set: $hasMatches to true)(set: $lilyCount to 0)(set: $inisToldOfPillars to false)(set: $lilyHintShown to true)'),
 'oi': ("O'Flatterly's shop", '(set: $pyramidNumber to false)(set: $returnedPage to false)(set: $hasMissingPage to false)'),
 'cu': ('Turn to Copper', '(set: $crossed to "")(set: $knowsCopperWord to false)(set: $haunts to (a: $haunt4))'),
}
P, BASE = SEEDS[room]
setup(room + '-wrap', int(sys.argv[2]) if len(sys.argv) > 2 else 1280, False, 'shots', 'diag-' + room + '-')
p = boot(BASE, P)
print('passage', Game.name(p), 'canvas', p.evaluate("() => !!document.querySelector('#%s-wrap canvas')" % room))
print('errors', errs(p))
print(p.evaluate("""(id) => { const e = window._dssThreeRegistry[id]; if (!e || !e.spots) return 'no spots'; const cam0 = e.camera; cam0.updateMatrixWorld(); const cam = cam0.clone(); cam.aspect = 1.6; cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
  return e.spots.map(s => { const f = (pt) => { const v = new THREE.Vector3(pt[0], pt[1], pt[2]); const d = v.clone().sub(cam.position).dot(cam.getWorldDirection(new THREE.Vector3())); v.project(cam); return (d > 0 && Math.abs(v.x) < 1 && Math.abs(v.y) < 1 ? 'IN ' : 'OUT') + ' x=' + v.x.toFixed(2) + ' y=' + v.y.toFixed(2); };
  return s.name.padEnd(22) + ' halo ' + f(s.haloAt) + ' | tgt ' + f(s.tgt); }).join('\\n'); }""", room + '-wrap'))
links = p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].map(l => l.tagName + ':' + l.textContent.trim().slice(0, 40) + (l.classList.contains('dss-claimed') ? ' [claimed]' : ''))")
print('links', links)
shot(p, 'arrival')
p.close()
