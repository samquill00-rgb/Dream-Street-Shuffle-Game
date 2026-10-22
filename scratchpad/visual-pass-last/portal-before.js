// ====== THIRD PILLAR PORTAL SCENE — INLINE ======
// v2-expansion: the crossing moment. The pub dissolves into a flooded
// void; a whirlpool wakes in the rainwater between the two broken
// columns; a waterspout climbs out of its eye and the gold column
// rises inside it (blue + gold, Sam's direction 2026-08-21). When the
// world-pool is empty (nothing opens tonight) the spout falters at
// ~40% and sinks back — dim mode, button routes back to the Pillars.
// Standard lifecycle: tp-container / tp-wrap / _dssDisposeWrap.
(function() {
var tpActive = false;
var tpAnimId = null;

function initThirdPillar() {
if (tpActive) return;
tpActive = true;
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(buildTPScene) : buildTPScene()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(buildTPScene) : buildTPScene());
}
}

function buildTPScene() {
var tpWrap = document.createElement('div');
tpWrap.id = 'tp-wrap';
tpWrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9000;background:#04060c;';
document.body.appendChild(tpWrap);

// Mode: the passage's roll script has already run. If it produced a
// visible step-through link the crossing is open; otherwise dim mode.
var tpTargetLink = document.querySelector('#dss-portal-action tw-link');
var tpFallbackLink = document.querySelector('#dss-portal-fallback tw-link');
var tpFull = !!tpTargetLink;
// Reduced motion: this is a timed birth, so instead of holding the start we
// jump to the settled end (t pinned at 9s, dt 0: column risen, spout calm,
// no spin) and show the button almost at once.
var tpStill = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function makeCanvasTexture(w, h, drawFunc) {
var c = document.createElement('canvas');
c.width = w; c.height = h;
var cx = c.getContext('2d');
drawFunc(cx, w, h);
var tex = new THREE.CanvasTexture(c);
tex.minFilter = THREE.LinearFilter;
return tex;
}
function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
function easeOutCubic(v) { return 1 - Math.pow(1 - v, 3); }
function easeInOut(v) { return v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2; }

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x04060c);
scene.fog = new THREE.FogExp2(0x04060c, 0.038);
var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 90);
camera.position.set(0, 2.6, 10.2);
camera.lookAt(0, 2.4, 0);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.68;
tpWrap.appendChild(renderer.domElement);
window._dssBindScene('tp-wrap', scene, renderer, camera);
var dssComposerLocal = window.dssMakeComposer ? window.dssMakeComposer(scene, camera, renderer, { bloomStrength: 0.55, bloomRadius: 0.6, bloomThreshold: 0.6 }) : null;
if (window.dssFilmGrade) window.dssFilmGrade(tpWrap);

// ============================================================
// LIGHTS
// ============================================================
scene.add(new THREE.AmbientLight(0x243a4c, 0.8));
var coolDir = new THREE.DirectionalLight(0x4a86a8, 0.75);
coolDir.position.set(-6, 8, -7);
scene.add(coolDir);
// Three Blue Posts: a cyan rim-light from behind edges all three
// pillars in blue — the broken pair read spectral, the gold column
// keeps its face and takes blue only at its outline. Elevation 36, not
// 25: the water mirrors this light straight back at the camera, and at
// 25 that mirror sat at the bottom edge of the frame as a white road.
// At 36 it falls below the frame, and the gold reflection can read.
var rimLight = new THREE.DirectionalLight(0x8ac8dc, 0.78);
rimLight.position.set(0, 6.5, -9);
scene.add(rimLight);
// Gold light wakes as the column rises. Decay 2 + generous range — the
// short-cutoff terminator reads as a straight line across water.
var goldLight = new THREE.PointLight(0xd4ae6a, 0, 38, 2);
goldLight.position.set(0, 2.8, 0.9);
scene.add(goldLight);
// Faint cyan uplight from the whirlpool eye. Held at 1.4, not 0.9: any
// lower and its mirror in the water is a white blob in front of the plinth.
var cyanLight = new THREE.PointLight(0x4a9cc0, 0, 24, 2);
cyanLight.position.set(0, 1.4, 0);
scene.add(cyanLight);

// ============================================================
// THE RAINWATER FLOOR
// ============================================================
var waterTex = makeCanvasTexture(512, 512, function(cx, w, h) {
cx.fillStyle = '#071018'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 90; i++) {
var r = 18 + Math.random() * 70;
var g = cx.createRadialGradient(Math.random() * w, Math.random() * h, 2, Math.random() * w, Math.random() * h, r);
var dark = Math.random() < 0.5;
g.addColorStop(0, dark ? 'rgba(4,8,13,0.5)' : 'rgba(12,24,34,0.4)');
g.addColorStop(1, 'rgba(0,0,0,0)');
cx.fillStyle = g;
cx.fillRect(0, 0, w, h);
}
for (var s2 = 0; s2 < 26; s2++) {
cx.strokeStyle = 'rgba(120,180,200,' + (0.02 + Math.random() * 0.045) + ')';
cx.lineWidth = 0.6 + Math.random() * 1.4;
var sy = Math.random() * h, sx = Math.random() * w;
cx.beginPath(); cx.moveTo(sx, sy);
cx.quadraticCurveTo(sx + 40 + Math.random() * 60, sy + (Math.random() - 0.5) * 16, sx + 120 + Math.random() * 90, sy + (Math.random() - 0.5) * 26);
cx.stroke();
}
});
waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping;
waterTex.repeat.set(4, 4);
var waterMat = new THREE.MeshStandardMaterial({ map: waterTex, color: 0x9ab4c2, roughness: 0.17, metalness: 0.6 });
var floor = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), waterMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);

// Drifting sheen patches — BLOBS, never rings (rings read as straight
// lines at a low camera). Additive so they catch as light on water.
var sheenSpriteTex = makeCanvasTexture(128, 128, function(cx, w, h) {
var g = cx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
g.addColorStop(0, 'rgba(140,200,220,0.30)');
g.addColorStop(0.55, 'rgba(90,150,180,0.10)');
g.addColorStop(1, 'rgba(0,0,0,0)');
cx.fillStyle = g; cx.fillRect(0, 0, w, h);
});
var sheens = [];
for (var sh = 0; sh < 7; sh++) {
var shm = new THREE.Sprite(new THREE.SpriteMaterial({ map: sheenSpriteTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.05 + Math.random() * 0.06, depthWrite: false }));
var shr = 4.5 + Math.random() * 9, sha = Math.random() * Math.PI * 2;
shm.position.set(Math.cos(sha) * shr, 0.06, Math.sin(sha) * shr);
shm.scale.set(2.5 + Math.random() * 3.5, 1.1 + Math.random() * 1.4, 1);
shm.userData = { drift: 0.05 + Math.random() * 0.1, ph: Math.random() * Math.PI * 2 };
scene.add(shm); sheens.push(shm);
}

// ============================================================
// THE WHIRLPOOL — one disc, all art baked into one canvas
// ============================================================
var whirlTex = makeCanvasTexture(512, 512, function(cx, w, h) {
var cxr = w / 2, cyr = h / 2;
// dark eye
var eye = cx.createRadialGradient(cxr, cyr, 2, cxr, cyr, 70);
eye.addColorStop(0, 'rgba(2,4,8,0.9)');
eye.addColorStop(0.7, 'rgba(4,10,16,0.45)');
eye.addColorStop(1, 'rgba(0,0,0,0)');
cx.fillStyle = eye; cx.beginPath(); cx.arc(cxr, cyr, 72, 0, Math.PI * 2); cx.fill();
// spiral arms
for (var arm = 0; arm < 5; arm++) {
var a0 = (arm / 5) * Math.PI * 2;
cx.beginPath();
for (var st = 0; st <= 90; st++) {
var tt = st / 90;
var ang = a0 + tt * 4.6;
var rad = 12 + tt * 235;
var px = cxr + Math.cos(ang) * rad, py = cyr + Math.sin(ang) * rad;
if (st === 0) cx.moveTo(px, py); else cx.lineTo(px, py);
}
cx.strokeStyle = 'rgba(138,200,220,0.5)';
cx.lineWidth = 5;
cx.lineCap = 'round';
cx.globalAlpha = 0.55;
cx.stroke();
cx.strokeStyle = 'rgba(74,156,192,0.35)';
cx.lineWidth = 11;
cx.globalAlpha = 0.3;
cx.stroke();
cx.globalAlpha = 1;
}
// froth flecks along the arms
for (var f = 0; f < 130; f++) {
var fa = Math.random() * Math.PI * 2, fr = 20 + Math.random() * 225;
cx.fillStyle = 'rgba(190,230,240,' + (0.06 + Math.random() * 0.2) + ')';
cx.beginPath(); cx.arc(cxr + Math.cos(fa) * fr, cyr + Math.sin(fa) * fr, 0.7 + Math.random() * 2.1, 0, Math.PI * 2); cx.fill();
}
});
var whirlMat = new THREE.MeshBasicMaterial({ map: whirlTex, transparent: true, opacity: 0, depthWrite: false });
var whirl = new THREE.Mesh(new THREE.CircleGeometry(3.3, 48), whirlMat);
whirl.rotation.x = -Math.PI / 2;
whirl.position.y = 0.02;
scene.add(whirl);

// The gold column's reflection in the rainwater: a strip from the plinth
// towards the camera, brightest at its root, broken by ripples. Additive.
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

// ============================================================
// THE TWO BROKEN COLUMNS — standing in the water
// ============================================================
var stoneTex = makeCanvasTexture(256, 256, function(cx, w, h) {
cx.fillStyle = '#3e5570'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 60; i++) {
cx.fillStyle = 'rgba(' + (Math.random() < 0.5 ? '24,38,56' : '96,128,158') + ',' + (0.08 + Math.random() * 0.18) + ')';
cx.beginPath(); cx.arc(Math.random() * w, Math.random() * h, 3 + Math.random() * 22, 0, Math.PI * 2); cx.fill();
}
for (var cr = 0; cr < 7; cr++) {
cx.strokeStyle = 'rgba(16,22,28,' + (0.25 + Math.random() * 0.3) + ')';
cx.lineWidth = 0.7 + Math.random();
var x0 = Math.random() * w, y0 = Math.random() * h;
cx.beginPath(); cx.moveTo(x0, y0);
cx.lineTo(x0 + (Math.random() - 0.5) * 40, y0 + 20 + Math.random() * 50);
cx.lineTo(x0 + (Math.random() - 0.5) * 60, y0 + 60 + Math.random() * 60);
cx.stroke();
}
// rising damp band at the foot
var damp = cx.createLinearGradient(0, h * 0.72, 0, h);
damp.addColorStop(0, 'rgba(0,0,0,0)');
damp.addColorStop(1, 'rgba(10,18,26,0.55)');
cx.fillStyle = damp; cx.fillRect(0, 0, w, h);
});
var stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.88, metalness: 0.06, emissive: 0x16344a, emissiveIntensity: 0.22 });

function buildBrokenColumn(x, height, tiltDir) {
var g = new THREE.Group();
var plinthA = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.34, 1.5), stoneMat);
plinthA.position.y = 0.17; g.add(plinthA);
var plinthB = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.28, 1.18), stoneMat);
plinthB.position.y = 0.48; g.add(plinthB);
var y = 0.62;
while (y + 0.56 < height) {
var drum = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.5, 0.55, 20), stoneMat);
drum.position.y = y + 0.275;
drum.rotation.y = Math.random() * Math.PI;
g.add(drum);
y += 0.57;
}
// broken crown: a tilted part-drum
var crown = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.47, 0.3, 20), stoneMat);
crown.position.set(tiltDir * 0.07, y + 0.12, 0.03);
crown.rotation.z = tiltDir * 0.16;
crown.rotation.x = 0.07;
g.add(crown);
// rubble half-drowned at the base
for (var rb = 0; rb < 3; rb++) {
var chunk = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16 + Math.random() * 0.17), stoneMat);
var ra = Math.random() * Math.PI * 2, rr = 0.95 + Math.random() * 0.7;
chunk.position.set(Math.cos(ra) * rr, 0.05 + Math.random() * 0.06, Math.sin(ra) * rr);
chunk.rotation.set(Math.random(), Math.random(), Math.random());
g.add(chunk);
}
g.position.x = x;
scene.add(g);
return g;
}
buildBrokenColumn(-2.9, 3.7, -1);
buildBrokenColumn(2.9, 2.7, 1);

// ============================================================
// THE GOLD COLUMN — rises from the whirlpool's eye
// ============================================================
var fluteTex = makeCanvasTexture(256, 256, function(cx, w, h) {
var stripes = 16;
for (var i = 0; i < stripes; i++) {
var x0 = (i / stripes) * w, sw = w / stripes;
var g = cx.createLinearGradient(x0, 0, x0 + sw, 0);
g.addColorStop(0, '#7a5c2e');
g.addColorStop(0.35, '#caa25e');
g.addColorStop(0.5, '#e8c887');
g.addColorStop(0.65, '#caa25e');
g.addColorStop(1, '#6e5228');
cx.fillStyle = g; cx.fillRect(x0, 0, sw + 1, h);
}
// wear/noise
for (var n = 0; n < 240; n++) {
cx.fillStyle = 'rgba(' + (Math.random() < 0.5 ? '60,44,18' : '240,214,150') + ',' + (0.03 + Math.random() * 0.07) + ')';
cx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 5);
}
});
fluteTex.wrapS = fluteTex.wrapT = THREE.RepeatWrapping;
fluteTex.repeat.set(2, 1);
var goldMat = new THREE.MeshStandardMaterial({ map: fluteTex, color: 0xd4ae6a, metalness: 0.66, roughness: 0.34, emissive: 0x6a5220, emissiveIntensity: 0 });
var goldPlainMat = new THREE.MeshStandardMaterial({ color: 0xcaa25e, metalness: 0.7, roughness: 0.3, emissive: 0x6a5220, emissiveIntensity: 0 });

var pillar = new THREE.Group();
var gpA = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.28, 1.3), goldPlainMat);
gpA.position.y = 0.14; pillar.add(gpA);
var gpB = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.24, 1.04), goldPlainMat);
gpB.position.y = 0.4; pillar.add(gpB);
var shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.44, 4.3, 28), goldMat);
shaft.position.y = 2.67; pillar.add(shaft);
var echinus = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.42, 0.26, 28), goldPlainMat);
echinus.position.y = 4.95; pillar.add(echinus);
var abacus = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.16, 1.16), goldPlainMat);
abacus.position.y = 5.16; pillar.add(abacus);
pillar.position.y = -5.8;
scene.add(pillar);

// Gold halos + door-seam — ADDITIVE, or a near lamp reads dead-grey.
var goldGlowTex = makeCanvasTexture(128, 128, function(cx, w, h) {
var g = cx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
g.addColorStop(0, 'rgba(240,208,144,0.55)');
g.addColorStop(0.45, 'rgba(212,174,106,0.16)');
g.addColorStop(1, 'rgba(0,0,0,0)');
cx.fillStyle = g; cx.fillRect(0, 0, w, h);
});
var haloA = new THREE.Sprite(new THREE.SpriteMaterial({ map: goldGlowTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
haloA.position.set(0, 2.7, 0.4); haloA.scale.set(3.6, 5.4, 1); scene.add(haloA);
var haloB = new THREE.Sprite(new THREE.SpriteMaterial({ map: goldGlowTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
haloB.position.set(0, 4.6, 0.4); haloB.scale.set(2.2, 2.6, 1); scene.add(haloB);
var seamTex = makeCanvasTexture(32, 256, function(cx, w, h) {
var g = cx.createLinearGradient(0, 0, w, 0);
g.addColorStop(0, 'rgba(0,0,0,0)');
g.addColorStop(0.5, 'rgba(250,228,170,0.85)');
g.addColorStop(1, 'rgba(0,0,0,0)');
cx.fillStyle = g; cx.fillRect(0, 0, w, h);
var v = cx.createLinearGradient(0, 0, 0, h);
v.addColorStop(0, 'rgba(0,0,0,0.9)');
v.addColorStop(0.15, 'rgba(0,0,0,0)');
v.addColorStop(0.85, 'rgba(0,0,0,0)');
v.addColorStop(1, 'rgba(0,0,0,0.9)');
cx.globalCompositeOperation = 'destination-out';
cx.fillStyle = v; cx.fillRect(0, 0, w, h);
});
var seam = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 4.3), new THREE.MeshBasicMaterial({ map: seamTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
seam.position.set(0, 2.67, 0.47);
scene.add(seam);

// ============================================================
// THE WATERSPOUT — three nested spinning veils
// ============================================================
var spoutTex = makeCanvasTexture(256, 512, function(cx, w, h) {
for (var i = 0; i < 46; i++) {
var x0 = Math.random() * w, y0 = Math.random() * h;
var len = 60 + Math.random() * 170;
var grad = cx.createLinearGradient(x0, y0, x0 + 14, y0 - len);
var a = 0.2 + Math.random() * 0.42;
grad.addColorStop(0, 'rgba(74,156,192,0)');
grad.addColorStop(0.5, 'rgba(150,210,230,' + a + ')');
grad.addColorStop(1, 'rgba(74,156,192,0)');
cx.strokeStyle = grad;
cx.lineWidth = 1 + Math.random() * 2.6;
cx.lineCap = 'round';
cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x0 + 14, y0 - len); cx.stroke();
}
});
spoutTex.wrapS = spoutTex.wrapT = THREE.RepeatWrapping;
function makeVeil(rTop, rBottom, opacity, texRepeat) {
var geo = new THREE.CylinderGeometry(rTop, rBottom, 5.8, 32, 1, true);
geo.translate(0, 2.9, 0);
var tex = spoutTex.clone();
tex.needsUpdate = true;
tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
tex.repeat.set(texRepeat, 1);
var m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
m.userData = { baseOpacity: opacity, tex: tex };
m.scale.y = 0.04;
scene.add(m);
return m;
}
var veils = [makeVeil(0.85, 1.18, 0.62, 2), makeVeil(0.68, 0.95, 0.46, 3), makeVeil(0.56, 0.76, 0.38, 1)];

// ============================================================
// SPRAY + GOLD MOTES
// ============================================================
var sprayTex = makeCanvasTexture(64, 64, function(cx, w, h) {
var g = cx.createRadialGradient(w / 2, h / 2, 1, w / 2, h / 2, w / 2);
g.addColorStop(0, 'rgba(190,230,240,0.8)');
g.addColorStop(0.5, 'rgba(120,190,215,0.25)');
g.addColorStop(1, 'rgba(0,0,0,0)');
cx.fillStyle = g; cx.fillRect(0, 0, w, h);
});
var sprays = [];
for (var sp = 0; sp < 54; sp++) {
var spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprayTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
spr.userData = { ang: Math.random() * Math.PI * 2, r: 1.0 + Math.random() * 0.4, y: Math.random() * 5.5, vy: 0.5 + Math.random() * 1.1, va: 1.2 + Math.random() * 2.2, sc: 0.1 + Math.random() * 0.24 };
spr.scale.set(spr.userData.sc, spr.userData.sc, 1);
scene.add(spr); sprays.push(spr);
}
var motes = [];
for (var mo = 0; mo < 24; mo++) {
var mote = new THREE.Sprite(new THREE.SpriteMaterial({ map: goldGlowTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
mote.userData = { ang: Math.random() * Math.PI * 2, r: 0.8 + Math.random() * 1.6, y: Math.random() * 5.2, vy: 0.06 + Math.random() * 0.12, va: 0.08 + Math.random() * 0.2, sc: 0.05 + Math.random() * 0.08, ph: Math.random() * Math.PI * 2 };
mote.scale.set(mote.userData.sc, mote.userData.sc, 1);
scene.add(mote); motes.push(mote);
}

// ============================================================
// ANIMATE — growth one-shot, then ambient loop
// ============================================================
var t0 = performance.now();
var lastT = t0;
var loreFired = false;
function tpAnimate() {
tpAnimId = requestAnimationFrame(tpAnimate);
var now = performance.now();
// Review hook: set window.DSS_TP_SPEED = 0.4 in the console before
// entering to watch the birth in slow motion (1 = normal).
var t = tpStill ? 9 : ((now - t0) / 1000) * (window.DSS_TP_SPEED || parseFloat(localStorage.getItem('dssTpSpeed')) || 1);
var dt = tpStill ? 0 : Math.min(0.05, (now - lastT) / 1000);
lastT = now;

// growth: full mode climbs to 1; dim mode falters at 0.42 and sinks
var growth;
if (tpFull) {
growth = easeInOut(clamp01((t - 0.9) / 4.4));
} else {
var up = 0.42 * easeInOut(clamp01((t - 0.8) / 2.6));
var sink = clamp01((t - 4.6) / 2.4);
growth = up * (1 - 0.62 * sink);
}

// whirlpool
whirlMat.opacity = Math.min(1, t / 1.2) * (0.6 + 0.4 * growth);
whirl.rotation.z -= dt * (0.5 + 1.7 * growth);
cyanLight.intensity = (0.36 + 1.2 * growth) * Math.min(1, t / 1.5);

// veils
for (var v = 0; v < veils.length; v++) {
var veil = veils[v];
var settle = tpFull ? clamp01((t - 5.6) / 1.6) : 0;
veil.scale.y = Math.max(0.04, growth);
veil.userData.tex.offset.y -= dt * (0.35 + 0.65 * growth) * (v === 1 ? 1.4 : 1);
veil.rotation.y += dt * (0.9 + 1.1 * growth) * (v === 1 ? -0.8 : 1) * (v === 2 ? 1.6 : 1);
veil.material.opacity = veil.userData.baseOpacity * (0.55 + 0.45 * growth) * (1 - 0.45 * settle);
}

// the gold column rises inside the spout
var pr = tpFull ? clamp01((growth - 0.45) / 0.55) : 0.1 * growth;
pillar.position.y = -5.8 * (1 - easeOutCubic(pr));
pillar.rotation.y += dt * 0.05;
goldMat.emissiveIntensity = 0.38 * pr;
goldPlainMat.emissiveIntensity = 0.3 * pr;
goldLight.intensity = (tpFull ? 2.9 : 0.5) * pr * (1 + 0.06 * Math.sin(t * 2.1));
haloA.material.opacity = pr * (0.4 + 0.1 * Math.sin(t * 1.7));
haloB.material.opacity = pr * (0.3 + 0.08 * Math.sin(t * 1.7 + 1));
seam.material.opacity = pr * (0.45 + 0.12 * Math.sin(t * 1.3));
tpRefl.material.opacity = pr * (0.26 + 0.06 * Math.sin(t * 1.7 + 0.6));
tpRefl.scale.x = 1 + 0.08 * Math.sin(t * 0.9);
if (tpFull && !loreFired && pr > 0.05) {
loreFired = true;
if (window.dssAudio && window.dssAudio.loreUnravel) window.dssAudio.loreUnravel();
}

// spray riding the funnel
for (var s3 = 0; s3 < sprays.length; s3++) {
var spr2 = sprays[s3], u = spr2.userData;
u.ang += dt * u.va;
u.y += dt * u.vy;
var top = 5.8 * Math.max(0.04, growth);
if (u.y > top) { u.y = 0.05; u.ang = Math.random() * Math.PI * 2; }
var rr2 = u.r * (1.05 - 0.35 * (u.y / 5.8));
spr2.position.set(Math.cos(u.ang) * rr2, u.y, Math.sin(u.ang) * rr2);
spr2.material.opacity = (u.y < top ? 0.65 : 0) * (0.25 + 0.75 * growth);
}

// gold motes, only once the column stands
for (var m2 = 0; m2 < motes.length; m2++) {
var mt = motes[m2], mu = mt.userData;
mu.ang += dt * mu.va;
mu.y += dt * mu.vy;
if (mu.y > 5.4) mu.y = 0.3;
mt.position.set(Math.cos(mu.ang) * mu.r, mu.y, Math.sin(mu.ang) * mu.r);
mt.material.opacity = pr * (0.22 + 0.14 * Math.sin(t * 0.9 + mu.ph));
}

// sheen drift
for (var s4 = 0; s4 < sheens.length; s4++) {
var shn = sheens[s4];
shn.position.x += dt * shn.userData.drift * Math.sin(t * 0.2 + shn.userData.ph);
shn.material.opacity = 0.045 + 0.03 * Math.sin(t * 0.35 + shn.userData.ph) + 0.05 * growth;
}

// camera: slow push-in with the growth, breathing sway
camera.position.z = 10.2 - 1.15 * growth + Math.sin(t * 0.1) * 0.05;
camera.position.y = 2.6 + Math.sin(t * 0.13) * 0.025;
camera.position.x = Math.sin(t * 0.08) * 0.06;
camera.lookAt(0, 2.3 + 0.5 * pr, 0);

if (typeof dssComposerLocal !== 'undefined' && dssComposerLocal) { dssComposerLocal.render(); } else { renderer.render(scene, camera); }
}
tpAnimate();

// Overlays
var tpVig = document.createElement('div');
tpVig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:radial-gradient(ellipse at 50% 42%, transparent 32%, rgba(0,0,0,0.62) 100%);';
tpWrap.appendChild(tpVig);
var tpWash = document.createElement('div');
tpWash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9002;background:linear-gradient(180deg, rgba(4,8,16,0.4) 0%, rgba(4,5,10,0.06) 34%, rgba(4,5,10,0.06) 66%, rgba(6,8,4,0.3) 100%);';
tpWrap.appendChild(tpWash);

var tpBtn = document.createElement('div');
tpBtn.textContent = tpFull ? 'STEP THROUGH' : 'BACK TO THE PILLARS';
tpBtn.style.cssText = 'position:fixed;bottom:60px;left:50%;transform:translateX(-50%);padding:14px min(36px, 8vw);white-space:nowrap;max-width:calc(100vw - 16px);box-sizing:border-box;font:16px "Courier New",monospace;color:rgba(212,178,88,0.85);border:1px solid rgba(212,178,88,0.3);letter-spacing:min(4px, 0.9vw);cursor:pointer;z-index:9004;background:transparent;opacity:0;transition:opacity 2s ease;';
setTimeout(function() { tpBtn.style.opacity = '1'; }, tpStill ? 900 : (tpFull ? 7200 : 4200));
tpBtn.addEventListener('mouseenter', function() { tpBtn.style.color = 'rgba(230,200,120,0.95)'; tpBtn.style.borderColor = 'rgba(212,178,88,0.6)'; });
tpBtn.addEventListener('mouseleave', function() { tpBtn.style.color = 'rgba(212,178,88,0.85)'; tpBtn.style.borderColor = 'rgba(212,178,88,0.3)'; });
tpBtn.addEventListener('click', function() {
tpWrap.style.transition = 'opacity 1.5s ease';
tpWrap.style.opacity = '0';
setTimeout(function() {
if (tpAnimId) cancelAnimationFrame(tpAnimId); tpAnimId = null;
if (tpWrap.parentNode) tpWrap.parentNode.removeChild(tpWrap);
var target = tpFull ? document.querySelector('#dss-portal-action tw-link') : document.querySelector('#dss-portal-fallback tw-link');
if (target) target.click();
}, 1500);
});
tpWrap.appendChild(tpBtn);
}

setInterval(function() {
var container = document.getElementById('tp-container');
if (container && !tpActive) {
initThirdPillar();
} else if (!container) {
tpActive = false;
if (tpAnimId) { cancelAnimationFrame(tpAnimId); tpAnimId = null; }
window._dssDisposeWrap('tp-wrap');
}
}, 300);
})();

