from harness import *
from room_harness import *
setup('ci-wrap', 1280, False, '../rest-glow-2026-09-28/shots', 'colony-')
g = S['g']; orig = g.b.__class__.new_page
g.b.new_page = lambda **kw: orig(g.b, reduced_motion='reduce', **kw)
p = boot("(set: $visited's Colony to true)(set: $lilyCount to 0)(set: $tookLily4 to true)(set: $metDavy to false)(set: $knowsRonnies to false)", 'The Colony Room')
r = p.evaluate(J("() => { const g = window._dssThreeRegistry['WRAPID'].scene.getObjectByName('restGlow'); return g.children.filter(s => s.visible).map(s => +s.material.opacity.toFixed(3)); }"))
print('reduced (set before load):', r); shot(p, '7-reduced-true'); print('errs', errs(p)); p.close(); g.close()
