// Removed from buildTPScene on 2026-09-23 (HANDOFF 20r): the gold column's
// reflection in the rainwater. It rendered, but the strip it lies in is
// clipped to white by the rim light's specular on the water. Put back after
// the whirlpool block, plus the two animate lines at the end, if that hotspot
// is ever softened.
var tpReflTex = makeCanvasTexture(64, 256, function(cx, w, h) {
var g = cx.createLinearGradient(0, 0, w, 0);
g.addColorStop(0, 'rgba(0,0,0,0)');
g.addColorStop(0.32, 'rgba(212,174,106,0.22)');
g.addColorStop(0.5, 'rgba(240,208,144,0.85)');
g.addColorStop(0.68, 'rgba(212,174,106,0.22)');
g.addColorStop(1, 'rgba(0,0,0,0)');
cx.fillStyle = g; cx.fillRect(0, 0, w, h);
var v = cx.createLinearGradient(0, 0, 0, h);
v.addColorStop(0, 'rgba(0,0,0,0)');
v.addColorStop(0.18, 'rgba(0,0,0,0.1)');
v.addColorStop(0.55, 'rgba(0,0,0,0.55)');
v.addColorStop(1, 'rgba(0,0,0,1)');
cx.globalCompositeOperation = 'destination-out';
cx.fillStyle = v; cx.fillRect(0, 0, w, h);
for (var rb = 0; rb < 22; rb++) {
var ry = 6 + Math.random() * (h - 12);
cx.fillStyle = 'rgba(0,0,0,' + (0.25 + Math.random() * 0.5) + ')';
cx.fillRect(0, ry, w, 1 + Math.random() * 2.2);
}
});
var tpRefl = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 6.2), new THREE.MeshBasicMaterial({ map: tpReflTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
tpRefl.rotation.x = -Math.PI / 2;
tpRefl.position.set(0, 0.035, 4.3);
scene.add(tpRefl);
// in tpAnimate, after seam.material.opacity:
// tpRefl.material.opacity = pr * (0.26 + 0.06 * Math.sin(t * 1.7 + 0.6));
// tpRefl.scale.x = 1 + 0.08 * Math.sin(t * 0.9);
