import re, sys
F = 'Dream Street Shuffle.twee'
src = open(F, encoding='utf-8').read()
lines = src.split('\n')

BLOCK = r'''// resting glow: every clickable object breathes faintly at rest, so the eye finds it before the pointer does.
// The hover halo above takes over (brighter, a little wider) when the pointer reaches it, so the two never stack.
// Set window.DSS_RESTGLOW = false to switch it off, or to a number (0..1) to change how loud it sits.
var restLevel = window.DSS_RESTGLOW === false ? 0 : (typeof window.DSS_RESTGLOW === 'number' ? window.DSS_RESTGLOW : 0.3);
var restGroup = new THREE.Group(); scene.add(restGroup);
var restGlows = HOTSPOTS.map(function(spot, i) {
var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, transparent: true, opacity: 0, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, toneMapped: false }));
sp.visible = false; restGroup.add(sp);
return { spot: spot, sp: sp, ph: i * 1.9, on: false };
});
var restNext = -1;
function restRefresh() {
var keepP = halo.position.clone(), keepS = halo.scale.clone();
restGlows.forEach(function(g) {
g.on = restLevel > 0 && available(g.spot);
if (g.on) { haloAt(g.spot); g.sp.position.copy(halo.position); g.sp.scale.set(halo.scale.x * 0.88, halo.scale.y * 0.88, 1); }
});
halo.position.copy(keepP); halo.scale.copy(keepS);
}
function restTick(t, still) {
if (t >= restNext || still) { restRefresh(); restNext = t + 1; }
var idle = camMode === 'idle';
restGlows.forEach(function(g) {
var vis = idle && g.on && g.spot !== hoverSpot;
g.sp.visible = vis;
if (vis) g.sp.material.opacity = restLevel * (still ? 0.86 : 0.72 + 0.28 * Math.sin(t * 0.5 + g.ph));
});
}'''

ROOMS = [('fi', 21200, 22100), ('ci', 22120, 22810), ('pi', 22830, 23590), ('ri', 23620, 24240)]
out = lines[:]
offset = 0
for tag, lo, hi in ROOMS:
    lo2, hi2 = lo + offset, hi + offset
    seg = out[lo2:hi2]
    # 1. after haloAt's closing brace
    i = next(k for k, l in enumerate(seg) if l.startswith('function haloAt(spot)'))
    j = next(k for k in range(i, len(seg)) if seg[k] == '}')
    # 2. before the composer render line
    r = next(k for k, l in enumerate(seg) if l.startswith('if (composer) composer.render(); else renderer.render(scene, camera);'))
    assert j < r
    seg = seg[:r] + ['restTick(t, %sStill);' % tag] + seg[r:]
    seg = seg[:j+1] + BLOCK.split('\n') + seg[j+1:]
    added = len(seg) - (hi2 - lo2)
    out = out[:lo2] + seg + out[hi2:]
    offset += added
    print(tag, 'haloAt at', lo2 + j, 'render at', lo2 + r, 'added', added)
open(F, 'w', encoding='utf-8').write('\n'.join(out))
