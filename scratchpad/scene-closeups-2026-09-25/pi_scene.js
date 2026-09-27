// ====== INSIDE THE PILLARS — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-26. The third "look closer" room. Built from what is written of
// the Pillars of Hercules at 7 Greek Street (wooden fittings, bentwood
// stools, elbow-height tables against the wall, a copper bar top, dark
// walls, a stained-glass panel in the ceiling, and the classical columns
// that divide the bar) crossed with the passage's own Piranesi ruins.
// The room sits at the top of Entering The Pillars of Hercules
// (#pi-container) and is its navigation: the bar opens the drink, the man
// through the fumes opens the Great Ham, the third pillar opens the
// crossing or the synthesis, the threshold opens the walk on water, each
// only when the passage has rendered that link. The lattice window, the
// glass overhead and the telephone are inspections, their card words pink
// placeholders for Sam. Nothing about the game is decided in JS.
(function() {
var piActive = false;
var piAnimId = null;

function initPillarsInside() {
if (piActive) return;
piActive = true;
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(buildPIScene) : buildPIScene()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(buildPIScene) : buildPIScene());
}
}

function buildPIScene() {
var piStill = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var piHost = document.getElementById('pi-container');
if (!piHost) { piActive = false; return; }
var piWrap = document.createElement('div');
piWrap.id = 'pi-wrap';
function piSize() {
var w = Math.max(280, document.documentElement.clientWidth || window.innerWidth);
var vh = window.innerHeight || 800;
var h = Math.round(w < 600 ? Math.max(300, vh * 0.56) : Math.max(320, Math.min(vh * 0.66, 680)));
return { w: w, h: h };
}
var piSz = piSize();
piWrap.style.cssText = 'position:relative;width:100vw;margin-left:calc(50% - 50vw);height:' + piSz.h + 'px;z-index:0;isolation:isolate;background:#090705;overflow:hidden;';
var piCanvas = document.createElement('canvas');
piCanvas.width = piSz.w; piCanvas.height = piSz.h;
piCanvas.style.cssText = 'display:block;position:absolute;top:0;left:0;width:100%;height:100%;touch-action:manipulation;';
piWrap.appendChild(piCanvas);
var piWash = document.createElement('div');
piWash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9000;background:linear-gradient(180deg,rgba(10,18,6,0.3) 0%,rgba(6,10,4,0.05) 35%,rgba(6,10,4,0.05) 60%,rgba(3,5,2,0.45) 100%);';
piWrap.appendChild(piWash);
var piVig = document.createElement('div');
piVig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:radial-gradient(ellipse at 50% 44%,transparent 24%,rgba(0,0,0,0.74) 100%);';
piWrap.appendChild(piVig);
var piGrain = document.createElement('div');
piGrain.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9002;opacity:0.06;mix-blend-mode:overlay;background:url(' + (window.dssGetGrainURL ? window.dssGetGrainURL() : '') + ');';
piWrap.appendChild(piGrain);
var piLoc = document.createElement('div');
piLoc.textContent = 'THE PILLARS OF HERCULES, GREEK STREET';
piLoc.style.cssText = 'position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font:12px \'Courier New\',monospace;color:rgba(190,200,140,0.25);letter-spacing:3px;white-space:nowrap;z-index:9003;pointer-events:none;';
piWrap.appendChild(piLoc);
piHost.appendChild(piWrap);
piSz = piSize(); piWrap.style.height = piSz.h + 'px';

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x090705);
scene.fog = new THREE.FogExp2(0x14100a, 0.06);
var aspect = piSz.w / piSz.h;
var portrait = aspect < 1;
var camera = new THREE.PerspectiveCamera(portrait ? 80 : 54, aspect, 0.05, 40);
// from just inside the door at the front left, looking across the room to the bar and the piano
var CAM = portrait ? { x: -0.7, y: 1.5, z: 3.5, tx: 0.1, ty: 1.55, tz: -1.7 } : { x: -0.9, y: 1.5, z: 3.1, tx: 0.15, ty: 1.72, tz: -1.7 };
camera.position.set(CAM.x, CAM.y, CAM.z);

var renderer = new THREE.WebGLRenderer({ canvas: piCanvas, antialias: true });
renderer.setSize(piSz.w, piSz.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, piSz.w < 600 ? 1.25 : 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.68;
window._dssBindScene('pi-wrap', scene, renderer, camera);
var origResize = window._dssThreeRegistry['pi-wrap'].resize;
window._dssThreeRegistry['pi-wrap'].resize = function() {
piSz = piSize(); piWrap.style.height = piSz.h + 'px';
camera.aspect = piSz.w / piSz.h;
camera.fov = camera.aspect < 1 ? 80 : 54;
camera.updateProjectionMatrix();
renderer.setSize(piSz.w, piSz.h);
};
window.removeEventListener('resize', origResize);
window.addEventListener('resize', window._dssThreeRegistry['pi-wrap'].resize);
// The outside scenes' bloom and grade, at the room's own size.
var composer = window.dssMakeComposer ? window.dssMakeComposer(scene, camera, renderer, { bloomStrength: 0.32, bloomRadius: 0.55, bloomThreshold: 0.72 }) : null;
if (composer) { composer.setSize(piSz.w, piSz.h); var piResize = window._dssThreeRegistry['pi-wrap'].resize; window._dssThreeRegistry['pi-wrap'].resize = function() { piResize(); composer.setSize(piSz.w, piSz.h); }; window.removeEventListener('resize', piResize); window.addEventListener('resize', window._dssThreeRegistry['pi-wrap'].resize); }

function tex(w, h, fn) {
var c = document.createElement('canvas'); c.width = w; c.height = h;
var cx = c.getContext('2d'); fn(cx, w, h);
var t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearMipmapLinearFilter;
t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
return t;
}
function rnd(seed) { var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function mesh(geo, mat, x, y, z, parent) { var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || scene).add(m); return m; }

// ---------- TEXTURES AND MATERIALS: the same grain, soot and varnish as the French ----------
function woodTex(base, grain, seed) {
return tex(512, 512, function(cx, w, h) {
cx.fillStyle = base; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 420; i++) {
var y = rnd(seed + i * 7) * h, bend = 2 + rnd(i + seed * 5) * 11;
cx.strokeStyle = i % 5 ? grain : '#a8743f'; cx.globalAlpha = 0.035 + rnd(i + seed) * 0.1;
cx.lineWidth = 0.4 + rnd(i * 3) * 1.2; cx.beginPath();
for (var x = 0; x <= w; x += 8) {
var yy = y + Math.sin(x * 0.009 + y * 0.018) * bend + Math.sin(x * 0.033 + y) * 0.8;
if (!x) cx.moveTo(x, yy); else cx.lineTo(x, yy);
} cx.stroke();
}
cx.globalAlpha = 1;
for (var n = 0; n < 12; n++) {
var xx = rnd(n + seed * 21) * w, yy = rnd(n + seed * 19) * h;
var g = cx.createRadialGradient(xx, yy, 0, xx, yy, 90);
g.addColorStop(0, 'rgba(14,6,2,0.19)'); g.addColorStop(1, 'rgba(14,6,2,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
}
cx.strokeStyle = 'rgba(216,165,103,0.13)'; cx.lineWidth = 0.6;
for (var n = 0; n < 65; n++) { var xx = rnd(n * 9 + seed) * w, yy = rnd(n * 17) * h; cx.beginPath(); cx.moveTo(xx, yy); cx.lineTo(xx + 3 + rnd(n) * 48, yy + 0.3); cx.stroke(); }
});
}
function paintTex(base, seed, warm) {
return tex(512, 512, function(cx, w, h) {
cx.fillStyle = base; cx.fillRect(0, 0, w, h);
for (var n = 0; n < 28; n++) {
var x = rnd(n + seed) * w, y = rnd(n * 3 + seed) * h, r = 30 + rnd(n * 7) * 130;
var g = cx.createRadialGradient(x, y, 0, x, y, r);
g.addColorStop(0, n % 3 ? 'rgba(20,12,4,0.15)' : (warm || 'rgba(150,110,50,0.1)')); g.addColorStop(1, 'rgba(60,32,8,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
}
var soot = cx.createLinearGradient(0, 0, 0, h); soot.addColorStop(0, 'rgba(18,10,4,0.3)'); soot.addColorStop(0.3, 'rgba(38,20,6,0)'); soot.addColorStop(1, 'rgba(18,10,4,0.14)'); cx.fillStyle = soot; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 9000; i++) { cx.fillStyle = i % 2 ? 'rgba(20,12,4,0.05)' : 'rgba(200,180,140,0.04)'; cx.fillRect(rnd(i + seed) * w, rnd(i * 3 + seed) * h, 1, 1); }
});
}
// A small canvas-made room environment, darker and more copper than the French's: it is what the metal and the varnish reflect.
var envFaces = [];
for (var ef = 0; ef < 6; ef++) {
var ec = document.createElement('canvas'); ec.width = ec.height = 128;
var ex = ec.getContext('2d'), eg = ex.createLinearGradient(0, 0, 0, 128);
eg.addColorStop(0, ef === 2 ? '#5a4028' : '#3e2e1e'); eg.addColorStop(0.5, '#241a10'); eg.addColorStop(1, '#0a0705'); ex.fillStyle = eg; ex.fillRect(0, 0, 128, 128);
if (ef !== 3) {
for (var el = 0; el < 2; el++) {
var lx = 28 + el * 73, ly = ef === 2 ? 64 : 30;
var gl = ex.createRadialGradient(lx, ly, 0, lx, ly, 20); gl.addColorStop(0, '#ffe6b8'); gl.addColorStop(0.14, '#d9b070'); gl.addColorStop(0.4, '#8a5f2c'); gl.addColorStop(1, 'rgba(96,63,25,0)'); ex.fillStyle = gl; ex.fillRect(0, 0, 128, 128);
} ex.fillStyle = 'rgba(190,120,70,0.14)'; ex.fillRect(4, 84, 120, 10);
} envFaces.push(ec);
}
var roomEnv = new THREE.CubeTexture(envFaces); roomEnv.needsUpdate = true;
var grainA = woodTex('#3d2416', '#150905', 1), grainB = woodTex('#2a1810', '#0e0704', 2), grainC = woodTex('#4a2c1a', '#1a0c06', 3);
var oak = new THREE.MeshStandardMaterial({ map: grainA, bumpMap: grainA, bumpScale: 0.003, roughnessMap: grainA, roughness: 0.62, envMap: roomEnv, envMapIntensity: 0.4, metalness: 0.04 });
var darkWood = new THREE.MeshStandardMaterial({ map: grainB, bumpMap: grainB, bumpScale: 0.006, roughness: 0.58, envMap: roomEnv, envMapIntensity: 0.22 });
var shelfWood = new THREE.MeshStandardMaterial({ map: grainC, bumpMap: grainC, bumpScale: 0.002, roughnessMap: grainC, roughness: 0.5, envMap: roomEnv, envMapIntensity: 0.5, metalness: 0.06 });
var brass = new THREE.MeshStandardMaterial({ color: 0xb99a60, roughness: 0.3, metalness: 0.82, envMap: roomEnv, envMapIntensity: 0.72 });
// The copper top: hammered, worn to a penny's pink where the elbows go, greening at the edges.
var copperTex = tex(1024, 256, function(cx, w, h) {
cx.fillStyle = '#9c5a34'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 2600; i++) { var x = rnd(i * 3) * w, y = rnd(i * 5 + 1) * h, r = 3 + rnd(i) * 9; var g = cx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r); g.addColorStop(0, 'rgba(230,150,100,0.22)'); g.addColorStop(0.6, 'rgba(120,60,30,0.1)'); g.addColorStop(1, 'rgba(60,30,15,0.18)'); cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, r, 0, 6.3); cx.fill(); }
for (var n = 0; n < 9; n++) { var x = 60 + n * 105 + rnd(n) * 40, g2 = cx.createRadialGradient(x, h * 0.62, 0, x, h * 0.62, 70); g2.addColorStop(0, 'rgba(236,170,120,0.28)'); g2.addColorStop(1, 'rgba(236,170,120,0)'); cx.fillStyle = g2; cx.fillRect(0, 0, w, h); }
var vg = cx.createLinearGradient(0, 0, 0, h); vg.addColorStop(0, 'rgba(70,110,80,0.28)'); vg.addColorStop(0.12, 'rgba(70,110,80,0)'); vg.addColorStop(0.9, 'rgba(70,110,80,0)'); vg.addColorStop(1, 'rgba(70,110,80,0.22)'); cx.fillStyle = vg; cx.fillRect(0, 0, w, h);
for (var k = 0; k < 40; k++) { cx.strokeStyle = 'rgba(40,20,10,' + (0.08 + rnd(k) * 0.12) + ')'; cx.lineWidth = 0.7; cx.beginPath(); var x0 = rnd(k * 7) * w, y0 = rnd(k * 11) * h; cx.moveTo(x0, y0); cx.lineTo(x0 + 20 + rnd(k) * 90, y0 + (rnd(k + 2) - 0.5) * 6); cx.stroke(); }
for (var r2 = 0; r2 < 6; r2++) { cx.strokeStyle = 'rgba(30,15,8,0.16)'; cx.lineWidth = 2; cx.beginPath(); cx.arc(rnd(r2 * 13) * w, rnd(r2 * 17) * h, 9 + rnd(r2) * 5, 0, 6.3); cx.stroke(); }
});
copperTex.wrapS = THREE.RepeatWrapping;
var copper = new THREE.MeshStandardMaterial({ map: copperTex, bumpMap: copperTex, bumpScale: 0.004, roughnessMap: copperTex, roughness: 0.42, metalness: 0.88, envMap: roomEnv, envMapIntensity: 0.9 });
var copperPlain = new THREE.MeshStandardMaterial({ color: 0xa86238, roughness: 0.32, metalness: 0.88, envMap: roomEnv, envMapIntensity: 0.8 });
var wallGrain = paintTex('#3a2a20', 17);
var wallMat = new THREE.MeshStandardMaterial({ map: wallGrain, bumpMap: wallGrain, bumpScale: 0.012, roughness: 0.94 });
var ceilMat = new THREE.MeshStandardMaterial({ map: paintTex('#4a3a24', 25, 'rgba(200,150,60,0.12)'), roughness: 0.96 });
// Stone for the columns: a warm limestone with veins and chips, darkened by a century of smoke.
var stoneTex = tex(512, 1024, function(cx, w, h) {
cx.fillStyle = '#8f8472'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 4000; i++) { cx.fillStyle = 'rgba(' + (40 + rnd(i) * 70 | 0) + ',' + (35 + rnd(i + 1) * 55 | 0) + ',' + (25 + rnd(i + 2) * 40 | 0) + ',' + rnd(i + 3) * 0.3 + ')'; cx.fillRect(rnd(i + 4) * w, rnd(i + 5) * h, 1 + rnd(i + 6) * 5, 1 + rnd(i + 7) * 3); }
for (var v = 0; v < 14; v++) { cx.strokeStyle = 'rgba(70,60,45,' + (0.12 + rnd(v) * 0.2) + ')'; cx.lineWidth = 0.8 + rnd(v + 3) * 1.6; cx.beginPath(); var x = rnd(v * 5) * w, y = 0; cx.moveTo(x, y); for (var s = 0; s < 12; s++) { y += h / 12; x += (rnd(v * 9 + s) - 0.5) * 60; cx.lineTo(x, y); } cx.stroke(); }
for (var c = 0; c < 30; c++) { var x = rnd(c * 7) * w, y = rnd(c * 3) * h, r = 4 + rnd(c) * 14; var g = cx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(50,40,30,0.35)'); g.addColorStop(1, 'rgba(50,40,30,0)'); cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); }
var sg = cx.createLinearGradient(0, 0, 0, h); sg.addColorStop(0, 'rgba(20,12,6,0.42)'); sg.addColorStop(0.4, 'rgba(20,12,6,0.05)'); sg.addColorStop(1, 'rgba(60,40,20,0.3)'); cx.fillStyle = sg; cx.fillRect(0, 0, w, h);
});
stoneTex.wrapS = THREE.RepeatWrapping;
var stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, bumpMap: stoneTex, bumpScale: 0.01, roughness: 0.88, envMap: roomEnv, envMapIntensity: 0.12 });
// Floorboards, each a shade its own, scuffed toward the bar; the flood lies on them at the door.
var boardTex = tex(1024, 1024, function(cx, w, h) {
for (var b = 0; b < 12; b++) {
var y0 = b * 86, tone = 0.75 + rnd(b * 3) * 0.5;
cx.fillStyle = 'rgb(' + (58 * tone | 0) + ',' + (36 * tone | 0) + ',' + (18 * tone | 0) + ')'; cx.fillRect(0, y0, w, 84);
for (var i = 0; i < 60; i++) { cx.strokeStyle = i % 4 ? 'rgba(20,10,4,' + (0.12 + rnd(i + b) * 0.2) + ')' : 'rgba(150,100,55,0.12)'; cx.lineWidth = 0.5 + rnd(i * 3 + b) * 1.4; cx.beginPath(); var yy = y0 + 4 + rnd(i + b * 7) * 76; cx.moveTo(0, yy); for (var x = 0; x <= w; x += 32) cx.lineTo(x, yy + Math.sin(x * 0.01 + i) * 2.5); cx.stroke(); }
cx.fillStyle = 'rgba(0,0,0,0.75)'; cx.fillRect(0, y0 + 84, w, 2);
var jx = rnd(b * 11) * w; cx.fillRect(jx, y0, 2, 84);
for (var n = 0; n < 2; n++) { cx.fillStyle = 'rgba(20,10,5,0.5)'; cx.beginPath(); cx.arc((jx + 40 + n * 300) % w, y0 + 20 + n * 44, 1.6, 0, 6.3); cx.fill(); }
}
for (var s = 0; s < 14; s++) { var x = rnd(s * 5) * w, y = rnd(s * 9) * h, g = cx.createRadialGradient(x, y, 0, x, y, 120); g.addColorStop(0, s % 2 ? 'rgba(10,5,2,0.28)' : 'rgba(160,120,70,0.1)'); g.addColorStop(1, 'rgba(10,5,2,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); }
});
boardTex.wrapS = boardTex.wrapT = THREE.RepeatWrapping; boardTex.repeat.set(2, 3.5);
var floorMat = new THREE.MeshStandardMaterial({ map: boardTex, bumpMap: boardTex, bumpScale: 0.004, roughness: 0.6, envMap: roomEnv, envMapIntensity: 0.18, metalness: 0.02 });

// ---------- A PLANAR REFLECTION, drawn only when the view changes ----------
// The French's mirror, made general so the flood on the boards can hold the room upside down as well.
function makeMirror(m, normal, size, tint, extra) {
var target = new THREE.WebGLRenderTarget(size, size, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
var mcam = camera.clone(), mat4 = new THREE.Matrix4(), n = normal.clone().normalize();
m.material = new THREE.ShaderMaterial({
uniforms: { reflection: { value: target.texture }, reflectionMatrix: { value: mat4 }, time: { value: 0 }, tint: { value: tint } },
transparent: !!extra.transparent, depthWrite: !extra.transparent,
vertexShader: 'uniform mat4 reflectionMatrix; varying vec4 reflected; varying vec2 faceUV; void main(){ faceUV=uv; vec4 wp=modelMatrix*vec4(position,1.0); reflected=reflectionMatrix*wp; gl_Position=projectionMatrix*viewMatrix*wp; }',
fragmentShader: 'uniform sampler2D reflection; uniform float time; uniform vec3 tint; varying vec4 reflected; varying vec2 faceUV; void main(){ vec4 r=reflected; ' + (extra.ripple ? 'r.xy+=vec2(sin(faceUV.y*38.0+time*1.1)*0.004+sin(faceUV.x*23.0-time*0.7)*0.003, cos(faceUV.x*31.0+time*0.9)*0.004)*r.w;' : '') + ' vec3 c=texture2DProj(reflection,r).rgb; float edge=smoothstep(0.0,' + (extra.edge || '0.07') + ',min(min(faceUV.x,1.0-faceUV.x),min(faceUV.y,1.0-faceUV.y))); float stain=0.5+0.5*sin(faceUV.x*193.0+sin(faceUV.y*117.0)*3.0); ' + (extra.transparent ? 'c=c*tint; float a=edge*(0.62+0.1*stain); gl_FragColor=vec4(c,a);' : 'c=mix(vec3(0.05,0.033,0.019),c*tint,0.65+0.35*edge); c*=1.0-(1.0-edge)*stain*0.3; gl_FragColor=vec4(c,1.0);') + '\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'
});
m.geometry.addEventListener('dispose', function() { target.dispose(); });
var lastAspect = 0, lastP = new THREE.Vector3(999, 999, 999), lastT = new THREE.Vector3(999, 999, 999), p0 = new THREE.Vector3();
function reflect(v) { var d = v.clone().sub(p0).dot(n); return v.clone().sub(n.clone().multiplyScalar(2 * d)); }
return { mesh: m, update: function(tgt, t) {
m.material.uniforms.time.value = t;
if (lastAspect === camera.aspect && lastP.distanceToSquared(camera.position) < 0.0025 && lastT.distanceToSquared(tgt) < 0.0025) return;
lastAspect = camera.aspect; lastP.copy(camera.position); lastT.copy(tgt);
m.getWorldPosition(p0);
mcam.copy(camera); mcam.position.copy(reflect(camera.position)); mcam.up.copy(reflect(camera.position.clone().add(new THREE.Vector3(0, 1, 0))).sub(mcam.position));
mcam.lookAt(reflect(tgt)); mcam.updateMatrixWorld();
var clip = new THREE.Plane(n.clone(), -p0.dot(n)).applyMatrix4(mcam.matrixWorldInverse);
var cp = new THREE.Vector4(clip.normal.x, clip.normal.y, clip.normal.z, clip.constant);
var pm = mcam.projectionMatrix.elements, cq = new THREE.Vector4((Math.sign(cp.x) + pm[8]) / pm[0], (Math.sign(cp.y) + pm[9]) / pm[5], -1, (1 + pm[10]) / pm[14]);
cp.multiplyScalar(2 / cp.dot(cq)); pm[2] = cp.x; pm[6] = cp.y; pm[10] = cp.z + 1; pm[14] = cp.w;
mat4.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1).multiply(mcam.projectionMatrix).multiply(mcam.matrixWorldInverse);
var oldTarget = renderer.getRenderTarget(), oldTone = renderer.toneMapping;
mirrors.forEach(function(o) { o.mesh.visible = false; }); var haloWas = typeof halo !== 'undefined' && halo.visible; if (haloWas) halo.visible = false;
renderer.toneMapping = THREE.NoToneMapping; renderer.setRenderTarget(target); renderer.render(scene, mcam);
renderer.setRenderTarget(oldTarget); renderer.toneMapping = oldTone; mirrors.forEach(function(o) { o.mesh.visible = true; }); if (haloWas) halo.visible = true;
} };
}
var mirrors = [];

// ---------- THE ROOM: a long narrow pub, the columns dividing it ----------
// From what is written of the Pillars of Hercules at 7 Greek Street: wooden fittings, bentwood stools, elbow-height tables against the wall,
// a copper bar top, dark walls, a stained-glass panel in the ceiling, and the classical columns that divide the bar and were there before the building.
// The passage's own two pillars are Piranesi ruins; here they stand broken at the top too, and the third, between them, is a trace until the passage shows it.
var W = 4.6, D = 8.0, H = 3.1;
var floor = mesh(new THREE.PlaneGeometry(W, D), floorMat, 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceil = mesh(new THREE.PlaneGeometry(W, D), ceilMat, 0, H, 0); ceil.rotation.x = Math.PI / 2;
var back = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2); back.receiveShadow = true;
var front = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, D / 2); front.rotation.y = Math.PI;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2;
var right = mesh(new THREE.PlaneGeometry(D, H), wallMat, W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2; right.receiveShadow = true;
// Dark oak panelling to elbow height on the right wall and the back: raised panels in their frames, a moulded rail along the top.
function panelling(len, x, z, ry) {
var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
mesh(new THREE.BoxGeometry(len, 1.15, 0.04), darkWood, 0, 0.575, 0, g);
var n = Math.round(len / 0.72), pw = len / n;
for (var i = 0; i < n; i++) {
var px = -len / 2 + pw * (i + 0.5);
mesh(new THREE.BoxGeometry(pw - 0.1, 0.78, 0.025), oak, px, 0.6, 0.03, g);
mesh(new THREE.BoxGeometry(pw - 0.2, 0.62, 0.012), oak, px, 0.6, 0.048, g);
}
mesh(new THREE.BoxGeometry(len, 0.07, 0.09), oak, 0, 1.17, 0.03, g);
mesh(new THREE.BoxGeometry(len, 0.12, 0.05), darkWood, 0, 0.06, 0.03, g);
return g;
}
panelling(D, W / 2 - 0.02, 0, -Math.PI / 2); panelling(W, 0, -D / 2 + 0.02, 0);
// the cornice, and a dado rail on the plain walls
var corniceMat = new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.7 });
[[W, 0, -D / 2 + 0.05, 0], [D, -W / 2 + 0.05, 0, Math.PI / 2], [D, W / 2 - 0.05, 0, -Math.PI / 2], [W, 0, D / 2 - 0.05, Math.PI]].forEach(function(c) {
var m = mesh(new THREE.BoxGeometry(c[0], 0.07, 0.1), corniceMat, c[1], H - 0.04, c[2]); m.rotation.y = c[3];
});
// Elbow-height shelf tables clutching the right wall, with what people leave on them.
var glassMat = new THREE.MeshPhysicalMaterial({ color: 0xf0eadc, roughness: 0.09, metalness: 0.04, envMap: roomEnv, envMapIntensity: 1.1, clearcoat: 1, transparent: true, opacity: 0.34 });
var beerMat = new THREE.MeshStandardMaterial({ color: 0xc27a18, roughness: 0.1, transparent: true, opacity: 0.72, emissive: 0x5a3000, emissiveIntensity: 0.35 });
function pintGlass(x, y, z, fill, parent) {
var g = new THREE.Group(); g.position.set(x, y, z); (parent || scene).add(g);
var body = mesh(new THREE.CylinderGeometry(0.04, 0.032, 0.15, 14, 1, true), glassMat, 0, 0.075, 0, g); body.material = glassMat.clone(); body.material.side = THREE.DoubleSide;
mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.005, 14), glassMat, 0, 0.002, 0, g);
if (fill > 0) mesh(new THREE.CylinderGeometry(0.031 + fill * 0.007, 0.03, 0.14 * fill, 14), beerMat, 0, 0.005 + 0.07 * fill, 0, g);
return g;
}
var ashMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.3, metalness: 0.2, envMap: roomEnv, envMapIntensity: 0.4 });
for (var s = 0; s < 3; s++) {
var sz = 2.4 - s * 2.3;
var sh = mesh(new THREE.BoxGeometry(0.3, 0.045, 1.3), shelfWood, W / 2 - 0.16, 1.12, sz); sh.castShadow = true; sh.receiveShadow = true;
mesh(new THREE.BoxGeometry(0.04, 0.5, 0.04), darkWood, W / 2 - 0.05, 0.87, sz - 0.5); mesh(new THREE.BoxGeometry(0.04, 0.5, 0.04), darkWood, W / 2 - 0.05, 0.87, sz + 0.5);
mesh(new THREE.BoxGeometry(0.26, 0.04, 0.04), darkWood, W / 2 - 0.16, 1.1, sz - 0.5); mesh(new THREE.BoxGeometry(0.26, 0.04, 0.04), darkWood, W / 2 - 0.16, 1.1, sz + 0.5);
if (s !== 2) pintGlass(W / 2 - 0.18, 1.143, sz + 0.3 - s * 0.5, s === 0 ? 0.35 : 0.8);
if (s === 1) { var tray = mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.018, 16), ashMat, W / 2 - 0.15, 1.152, sz - 0.25); }
if (s === 0) { var paper = mesh(new THREE.BoxGeometry(0.2, 0.008, 0.28), new THREE.MeshStandardMaterial({ color: 0xcfc4a6, roughness: 0.95 }), W / 2 - 0.17, 1.147, sz - 0.3); paper.rotation.y = 0.3; }
}
// The stained-glass panel let into the ceiling: a leaded rose lit from the room above, its colours dropped on the boards.
var glassTex = tex(512, 256, function(cx, w, h) {
var cols = ['#b83a24', '#d19a2a', '#2c6a96', '#4d8a3c', '#e2d3a0', '#7a3a78', '#c8622a'];
cx.fillStyle = '#e8dcb4'; cx.fillRect(0, 0, w, h);
function pane(px, py, i) { var g = cx.createRadialGradient(px, py, 2, px, py, 22); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = cols[i % cols.length]; cx.fill(); cx.fillStyle = g; cx.fill(); }
for (var i = 0; i < 64; i++) { var x = (i % 16) * 32 + 16, y = ((i / 16) | 0) * 64 + 32; cx.beginPath(); cx.moveTo(x, y - 30); cx.lineTo(x + 16, y); cx.lineTo(x, y + 30); cx.lineTo(x - 16, y); cx.closePath(); pane(x, y, i * 3 + ((i / 16) | 0)); }
var cxm = w / 2, cym = h / 2;
cx.beginPath(); cx.arc(cxm, cym, 92, 0, 6.3); cx.fillStyle = '#e8dcb4'; cx.fill();
for (var p = 0; p < 12; p++) { var a = p * Math.PI / 6; cx.beginPath(); cx.moveTo(cxm, cym); cx.quadraticCurveTo(cxm + Math.cos(a - 0.3) * 60, cym + Math.sin(a - 0.3) * 60, cxm + Math.cos(a) * 88, cym + Math.sin(a) * 88); cx.quadraticCurveTo(cxm + Math.cos(a + 0.3) * 60, cym + Math.sin(a + 0.3) * 60, cxm, cym); cx.closePath(); pane(cxm + Math.cos(a) * 45, cym + Math.sin(a) * 45, p + 2); }
cx.beginPath(); cx.arc(cxm, cym, 22, 0, 6.3); pane(cxm, cym, 1);
cx.strokeStyle = '#1a1410'; cx.lineWidth = 3.5;
for (var i = 0; i < 64; i++) { var x = (i % 16) * 32 + 16, y = ((i / 16) | 0) * 64 + 32; if (Math.hypot(x - cxm, y - cym) < 80) continue; cx.beginPath(); cx.moveTo(x, y - 30); cx.lineTo(x + 16, y); cx.lineTo(x, y + 30); cx.lineTo(x - 16, y); cx.closePath(); cx.stroke(); }
cx.beginPath(); cx.arc(cxm, cym, 92, 0, 6.3); cx.stroke(); cx.beginPath(); cx.arc(cxm, cym, 22, 0, 6.3); cx.stroke();
for (var p = 0; p < 12; p++) { var a = p * Math.PI / 6; cx.beginPath(); cx.moveTo(cxm + Math.cos(a) * 22, cym + Math.sin(a) * 22); cx.lineTo(cxm + Math.cos(a) * 92, cym + Math.sin(a) * 92); cx.stroke(); }
for (var g2 = 0; g2 < 5000; g2++) { cx.fillStyle = g2 % 2 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'; cx.fillRect(rnd(g2) * w, rnd(g2 + 1) * h, 1, 1); }
});
var glassPanel = mesh(new THREE.PlaneGeometry(1.6, 0.8), new THREE.MeshBasicMaterial({ map: glassTex, toneMapped: false, transparent: true, opacity: 0.92 }), 0, H - 0.02, -0.6); glassPanel.rotation.x = Math.PI / 2;
mesh(new THREE.BoxGeometry(1.74, 0.05, 0.07), darkWood, 0, H - 0.03, -0.6 - 0.43); mesh(new THREE.BoxGeometry(1.74, 0.05, 0.07), darkWood, 0, H - 0.03, -0.6 + 0.43);
mesh(new THREE.BoxGeometry(0.07, 0.05, 0.9), darkWood, -0.84, H - 0.03, -0.6); mesh(new THREE.BoxGeometry(0.07, 0.05, 0.9), darkWood, 0.84, H - 0.03, -0.6);
var glassLight = new THREE.PointLight(0xffd8a0, 0.5, 4.5, 1.6); glassLight.position.set(0, H - 0.4, -0.6); scene.add(glassLight);
var glassPool = mesh(new THREE.PlaneGeometry(1.9, 1.0), new THREE.MeshBasicMaterial({ map: glassTex, transparent: true, opacity: 0.09, depthWrite: false, blending: THREE.AdditiveBlending }), 0.15, 0.006, -0.35); glassPool.rotation.x = -Math.PI / 2; glassPool.rotation.z = 0.06;

// ---------- THE BAR, along the left, with its copper top ----------
var barG = new THREE.Group(); scene.add(barG);
var barZ0 = -3.0, barZ1 = 1.6, barX = -W / 2 + 0.9, barLen = barZ1 - barZ0, barMidZ = (barZ0 + barZ1) / 2;
var body = mesh(new THREE.BoxGeometry(0.6, 1.08, barLen), oak, barX, 0.54, barMidZ, barG); body.castShadow = true; body.receiveShadow = true;
for (var bp = 0; bp < Math.floor(barLen / 0.66); bp++) {
var pz0 = barZ0 + 0.4 + bp * 0.66;
mesh(new THREE.BoxGeometry(0.03, 0.72, 0.5), darkWood, barX + 0.31, 0.56, pz0, barG);
mesh(new THREE.BoxGeometry(0.012, 0.56, 0.36), oak, barX + 0.33, 0.56, pz0, barG);
}
mesh(new THREE.BoxGeometry(0.66, 0.08, barLen), darkWood, barX, 0.04, barMidZ, barG);
var top = mesh(new THREE.BoxGeometry(0.76, 0.05, barLen + 0.1), copper, barX, 1.105, barMidZ, barG); top.receiveShadow = true; top.castShadow = true;
mesh(new THREE.BoxGeometry(0.03, 0.06, barLen + 0.1), copperPlain, barX + 0.385, 1.11, barMidZ, barG);
var rail = mesh(new THREE.CylinderGeometry(0.02, 0.02, barLen, 10), brass, barX + 0.42, 0.22, barMidZ, barG); rail.rotation.x = Math.PI / 2;
for (var rb = 0; rb < 4; rb++) mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 6), brass, barX + 0.36, 0.2, barZ0 + 0.5 + rb * 1.2, barG).rotation.z = Math.PI / 2;
var ivory = new THREE.MeshStandardMaterial({ color: 0xe6dcc0, roughness: 0.35, envMap: roomEnv, envMapIntensity: 0.3 });
for (var pz = barZ0 + 0.8; pz < barZ1 - 0.4; pz += 0.9) {
mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.16, 12), copperPlain, barX - 0.1, 1.2, pz, barG);
var pump = mesh(new THREE.CylinderGeometry(0.022, 0.03, 0.34, 10), ivory, barX - 0.16, 1.42, pz, barG); pump.rotation.z = 0.28; pump.castShadow = true;
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.09, 6), brass, barX - 0.12, 1.3, pz, barG).rotation.z = 0.28;
mesh(new THREE.BoxGeometry(0.03, 0.045, 0.03), new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.5 }), barX - 0.16, 1.585, pz, barG);
}
// what stands on the copper: glasses, a bar towel, a bowl of something
pintGlass(barX + 0.15, 1.13, -0.6, 0.55, barG); pintGlass(barX + 0.2, 1.13, 0.9, 0, barG); pintGlass(barX + 0.05, 1.13, -1.9, 0.9, barG);
mesh(new THREE.BoxGeometry(0.28, 0.012, 0.18), new THREE.MeshStandardMaterial({ color: 0x6a1e1e, roughness: 0.95 }), barX - 0.05, 1.136, 1.3, barG);
mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.04, 16), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.5, envMap: roomEnv, envMapIntensity: 0.3 }), barX + 0.1, 1.15, -1.2, barG);
// the back bar on the left wall: a real mirror, shelves, bottles, the till, the telephone
var bbX = -W / 2;
mesh(new THREE.BoxGeometry(0.42, 1.2, barLen), darkWood, bbX + 0.21, 0.6, barMidZ, barG).receiveShadow = true;
mesh(new THREE.BoxGeometry(0.48, 0.05, barLen), shelfWood, bbX + 0.24, 1.22, barMidZ, barG);
var mir = mesh(new THREE.PlaneGeometry(barLen - 0.4, 1.15), null, bbX + 0.03, 1.9, barMidZ); mir.rotation.y = Math.PI / 2;
mirrors.push(makeMirror(mir, new THREE.Vector3(1, 0, 0), portrait ? 512 : 1024, new THREE.Vector3(0.7, 0.66, 0.58), {}));
mesh(new THREE.BoxGeometry(0.06, 1.3, barLen - 0.3), oak, bbX + 0.02, 1.9, barMidZ, barG).position.x = bbX - 0.01;
mesh(new THREE.BoxGeometry(0.06, 3.1, 0.16), oak, bbX + 0.03, 1.55, barZ0 - 0.1); mesh(new THREE.BoxGeometry(0.06, 3.1, 0.16), oak, bbX + 0.03, 1.55, barZ1 + 0.1);
[1.35, 1.82, 2.28].forEach(function(sy, si) {
mesh(new THREE.BoxGeometry([0.34, 0.28, 0.22][si], 0.03, barLen - 0.4), shelfWood, bbX + [0.17, 0.14, 0.11][si], sy, barMidZ, barG);
});
var botCols = [0x2a5a2a, 0x7a4a18, 0x1a2a5a, 0x8a7a20, 0x4a1a1a, 0x2a4a3a, 0xa08030, 0x3a2a1a, 0x6a3a10];
function bottle(x, y, z, col, h, r, parent) {
var g = new THREE.Group(); g.position.set(x, y, z);
var bm = new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.17, metalness: 0.04, envMap: roomEnv, envMapIntensity: 0.8, clearcoat: 0.85, clearcoatRoughness: 0.12, transparent: true, opacity: 0.88 });
mesh(new THREE.CylinderGeometry(r, r, h, 10), bm, 0, h / 2, 0, g);
mesh(new THREE.CylinderGeometry(r * 0.35, r * 0.6, h * 0.35, 8), bm, 0, h + h * 0.16, 0, g);
mesh(new THREE.CylinderGeometry(r * 0.36, r * 0.36, 0.03, 8), rnd(x * 7 + z) < 0.5 ? brass : ashMat, 0, h + h * 0.34, 0, g);
if (rnd(z * 3 + x) < 0.7) mesh(new THREE.PlaneGeometry(r * 1.6, h * 0.42), new THREE.MeshStandardMaterial({ color: [0xe8dcc0, 0xc8b890, 0x1a1a1a][(rnd(x + z * 5) * 3) | 0], roughness: 0.9 }), r + 0.002, h * 0.45, 0, g).rotation.y = Math.PI / 2;
(parent || scene).add(g); return g;
}
[1.365, 1.835, 2.295].forEach(function(sy, row) {
var sx = bbX + [0.2, 0.16, 0.12][row], n = 16;
for (var b = 0; b < n; b++) {
if (rnd(row * 40 + b) < 0.16) continue;
bottle(sx + (rnd(row + b * 3) - 0.5) * 0.05, sy, barZ0 + 0.3 + b * ((barLen - 0.6) / n) + (rnd(b + row * 9) - 0.5) * 0.06, botCols[(b + row * 4) % botCols.length], 0.2 + rnd(b * 5 + row) * 0.14, 0.03 + rnd(b * 2 + row) * 0.012, barG);
}
});
for (var o = 0; o < 5; o++) bottle(bbX + 0.13, 1.79, -1.9 + o * 0.42, botCols[(o * 5) % botCols.length], 0.22, 0.03, barG).rotation.x = Math.PI;
var till = mesh(new THREE.BoxGeometry(0.3, 0.26, 0.36), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.5, envMap: roomEnv, envMapIntensity: 0.4 }), bbX + 0.25, 1.37, barZ0 + 0.9, barG);
mesh(new THREE.BoxGeometry(0.12, 0.07, 0.26), new THREE.MeshStandardMaterial({ color: 0x3a4a3a, emissive: 0x2a6a3a, emissiveIntensity: 0.5 }), bbX + 0.38, 1.53, barZ0 + 0.9, barG);
// bentwood stools along the bar: the bent back, the round seat, the ring for your feet
var bentMat = new THREE.MeshStandardMaterial({ color: 0x3a2210, roughness: 0.45, envMap: roomEnv, envMapIntensity: 0.25 });
var stoolSeat = new THREE.MeshStandardMaterial({ map: grainC, roughness: 0.5, envMap: roomEnv, envMapIntensity: 0.3 });
var stools = [];
function stool(x, z) {
var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rnd(x * 3 + z) * 6; scene.add(g);
for (var l = 0; l < 4; l++) { var a = l * Math.PI / 2 + 0.4; var leg = mesh(new THREE.CylinderGeometry(0.013, 0.017, 0.72, 8), bentMat, Math.cos(a) * 0.14, 0.36, Math.sin(a) * 0.14, g); leg.rotation.z = Math.cos(a) * 0.08; leg.rotation.x = -Math.sin(a) * 0.08; }
mesh(new THREE.TorusGeometry(0.15, 0.011, 6, 20), bentMat, 0, 0.24, 0, g).rotation.x = Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.035, 20), stoolSeat, 0, 0.74, 0, g).castShadow = true;
var back = mesh(new THREE.TorusGeometry(0.15, 0.011, 6, 20, Math.PI), bentMat, 0, 0.98, 0, g); back.rotation.x = Math.PI / 2; back.rotation.z = Math.PI;
mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.26, 6), bentMat, -0.15, 0.87, 0, g); mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.26, 6), bentMat, 0.15, 0.87, 0, g);
stools.push(g); return g;
}
stool(barX + 0.62, -2.2); stool(barX + 0.62, -1.4); stool(barX + 0.62, 0.2); stool(barX + 0.62, 1.0);

// ---------- THE TELEPHONE, on the back bar ----------
var phoneG = new THREE.Group(); phoneG.position.set(-W / 2 + 0.2, 1.36, barZ1 - 0.3); phoneG.rotation.y = 0.4; scene.add(phoneG);
var bakelite = new THREE.MeshStandardMaterial({ color: 0x16120f, roughness: 0.26, metalness: 0.08, envMap: roomEnv, envMapIntensity: 0.55 });
mesh(new THREE.BoxGeometry(0.2, 0.09, 0.2), bakelite, 0, 0.045, 0, phoneG);
mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.02, 20), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.5 }), 0.03, 0.1, 0.04, phoneG);
var hs = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.2, 10), bakelite, -0.02, 0.14, -0.02, phoneG); hs.rotation.z = Math.PI / 2;
mesh(new THREE.SphereGeometry(0.032, 10, 8), bakelite, -0.12, 0.13, -0.02, phoneG); mesh(new THREE.SphereGeometry(0.032, 10, 8), bakelite, 0.08, 0.13, -0.02, phoneG);
var phoneHit = mesh(new THREE.BoxGeometry(0.3, 0.3, 0.34), new THREE.MeshBasicMaterial({ visible: false }), 0, 0.12, 0, phoneG);

// ---------- THE PILLARS: two broken columns dividing the bar, and the third ----------
// Fluted shafts, an Attic base, and a break at the top that no two share; the whole one keeps its capital.
function flutedShaft(r0, r1, h, brokenTop) {
var geo = new THREE.CylinderGeometry(r0, r1, h, 72, 6, false);
var pos = geo.attributes.position, seedA = r0 * 100 + h;
for (var i = 0; i < pos.count; i++) {
var x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), a = Math.atan2(z, x), rr = Math.hypot(x, z);
var flute = Math.max(0, Math.cos(a * 20)); var f = 1 - 0.05 * flute * flute;
if (brokenTop && y > h / 2 - 0.01) { var j = rnd(seedA + a * 13) * 0.3; pos.setY(i, y - j); f *= 0.95 + rnd(a * 7 + seedA) * 0.1; }
pos.setX(i, x / rr * rr * f); pos.setZ(i, z / rr * rr * f);
}
geo.computeVertexNormals(); return geo;
}
function column(x, z, brokenAt, mat) {
var g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
mesh(new THREE.BoxGeometry(0.66, 0.1, 0.66), mat, 0, 0.05, 0, g);
mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.06, 32), mat, 0, 0.13, 0, g);
mesh(new THREE.TorusGeometry(0.26, 0.05, 10, 32), mat, 0, 0.19, 0, g).rotation.x = Math.PI / 2;
var whole = brokenAt > H - 0.9;
var shaft = mesh(flutedShaft(0.2, 0.24, brokenAt, !whole), mat, 0, 0.26 + brokenAt / 2, 0, g); shaft.castShadow = true; shaft.receiveShadow = true;
if (whole) { mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.16, 32), mat, 0, 0.26 + brokenAt + 0.08, 0, g); mesh(new THREE.BoxGeometry(0.68, 0.1, 0.68), mat, 0, 0.26 + brokenAt + 0.21, 0, g); }
else {
// the rubble of the break lies at the foot
for (var r = 0; r < 4; r++) { var chip = mesh(new THREE.DodecahedronGeometry(0.05 + rnd(r + x) * 0.05, 0), mat, (rnd(r * 3 + z) - 0.5) * 0.9, 0.12, (rnd(r * 5 + x) - 0.5) * 0.7 + 0.2, g); chip.rotation.set(rnd(r) * 3, rnd(r + 1) * 3, 0); }
}
return g;
}
var PZ = -1.7; // the columns stand across the room two thirds of the way in
var pillarL = column(-1.15, PZ, 1.9, stoneMat);
var pillarR = column(1.15, PZ, 2.25, stoneMat);
// the third pillar: whole, and only a trace until the passage below has shown it (Inis's tip); it holds the room still
var pillarShown = !!document.querySelector('tw-passage .pillars-scene .pillar.centre');
var ghostStone = new THREE.MeshStandardMaterial({ map: stoneTex, bumpMap: stoneTex, bumpScale: 0.01, roughness: 0.88, transparent: true, opacity: pillarShown ? 0.92 : 0.14, emissive: 0x2a2418, emissiveIntensity: pillarShown ? 0.25 : 0.05, envMap: roomEnv, envMapIntensity: 0.12 });
var pillarC = column(0, PZ, H - 0.7, ghostStone);
var pillarHit = mesh(new THREE.CylinderGeometry(0.34, 0.34, H, 12), new THREE.MeshBasicMaterial({ visible: false }), 0, H / 2, PZ);
var pillarLight = new THREE.PointLight(0xd8c8a0, 0, 3); pillarLight.position.set(0, 1.6, PZ + 0.5); scene.add(pillarLight);

// ---------- THE BACK: the arch to Manette Street, the lattice window beside it, rain ----------
var archG = new THREE.Group(); archG.position.set(0.6, 0, -D / 2 + 0.02); scene.add(archG);
var nightTex = tex(128, 256, function(cx, w, h) {
var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0a0e16'); g.addColorStop(0.55, '#171a22'); g.addColorStop(0.8, '#2e2a22'); g.addColorStop(1, '#141210'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
// the far wall of the passage, a doorway, the lamp, the wet flags
cx.fillStyle = '#1f1c18'; cx.fillRect(0, 60, w, 130); for (var b = 0; b < 30; b++) { cx.fillStyle = 'rgba(0,0,0,' + (0.1 + rnd(b) * 0.2) + ')'; cx.fillRect((b % 6) * 22 + (((b / 6) | 0) % 2) * 11, 60 + ((b / 6) | 0) * 26, 21, 25); }
cx.fillStyle = '#0a0806'; cx.fillRect(80, 90, 26, 100);
var lg = cx.createRadialGradient(62, 118, 0, 62, 118, 60); lg.addColorStop(0, 'rgba(255,214,150,0.9)'); lg.addColorStop(0.1, 'rgba(255,200,120,0.5)'); lg.addColorStop(1, 'rgba(255,200,120,0)'); cx.fillStyle = lg; cx.fillRect(0, 0, w, h);
cx.fillStyle = '#ffe6bb'; cx.fillRect(58, 114, 8, 9); cx.fillStyle = '#111'; cx.fillRect(61, 123, 2, 60);
var wg = cx.createLinearGradient(0, 190, 0, h); wg.addColorStop(0, 'rgba(120,110,90,0.35)'); wg.addColorStop(1, 'rgba(20,20,26,0.5)'); cx.fillStyle = wg; cx.fillRect(0, 190, w, h - 190);
cx.fillStyle = 'rgba(255,214,150,0.18)'; cx.fillRect(56, 190, 12, 66);
});
var archPane = mesh(new THREE.PlaneGeometry(1.1, 2.2), new THREE.MeshBasicMaterial({ map: nightTex, toneMapped: false }), 0, 1.15, -0.04, archG);
var rainTex = tex(128, 512, function(cx, w, h) { for (var i = 0; i < 160; i++) { cx.strokeStyle = 'rgba(200,210,230,' + (0.05 + rnd(i) * 0.16) + ')'; cx.lineWidth = 0.8 + rnd(i + 1); cx.beginPath(); var x = rnd(i + 3) * w, y = rnd(i + 5) * h; cx.moveTo(x, y); cx.lineTo(x - 1.5, y + 14 + rnd(i) * 26); cx.stroke(); } });
rainTex.wrapS = rainTex.wrapT = THREE.RepeatWrapping;
var rain = mesh(new THREE.PlaneGeometry(1.1, 2.2), new THREE.MeshBasicMaterial({ map: rainTex, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), 0, 1.15, -0.02, archG);
var archStone = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.9, color: 0x9a9080 });
mesh(new THREE.BoxGeometry(0.18, 2.3, 0.14), archStone, -0.64, 1.15, 0.05, archG); mesh(new THREE.BoxGeometry(0.18, 2.3, 0.14), archStone, 0.64, 1.15, 0.05, archG);
for (var v = 0; v < 9; v++) { var a = Math.PI * v / 8, vs = mesh(new THREE.BoxGeometry(0.2, 0.17, 0.14), archStone, Math.cos(a) * 0.66, 2.28 + Math.sin(a) * 0.66, 0.05, archG); vs.rotation.z = a - Math.PI / 2; if (v === 4) vs.scale.set(1.15, 1.25, 1); }
mesh(new THREE.BoxGeometry(1.3, 0.06, 0.1), darkWood, 0, 0.03, 0.05, archG);
var archLight = new THREE.PointLight(0x9aa6c0, 0.42, 4, 1.6); archLight.position.set(0.6, 1.4, -D / 2 + 0.6); scene.add(archLight);
var streetLamp = new THREE.PointLight(0xffd8a0, 0.5, 3.5, 1.8); streetLamp.position.set(0.55, 1.3, -D / 2 + 0.1); scene.add(streetLamp);
// the lattice window high on the back wall, rain on it, the flood-light of the street
var winG = new THREE.Group(); winG.position.set(-1.35, 2.3, -D / 2 + 0.02); scene.add(winG);
var latticeTex = tex(512, 256, function(cx, w, h) {
var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#232a3a'); g.addColorStop(0.7, '#4a4030'); g.addColorStop(1, '#6a5a38'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
var lg = cx.createRadialGradient(w * 0.7, h * 0.55, 0, w * 0.7, h * 0.55, w * 0.5); lg.addColorStop(0, 'rgba(255,214,150,0.5)'); lg.addColorStop(1, 'rgba(255,214,150,0)'); cx.fillStyle = lg; cx.fillRect(0, 0, w, h);
for (var q = 0; q < 700; q++) { cx.fillStyle = 'rgba(' + (200 + rnd(q) * 40 | 0) + ',' + (200 + rnd(q + 1) * 30 | 0) + ',' + (180 + rnd(q + 2) * 40 | 0) + ',' + rnd(q + 3) * 0.06 + ')'; cx.fillRect(rnd(q + 4) * w, rnd(q + 5) * h, 3 + rnd(q) * 8, 3 + rnd(q + 6) * 8); }
cx.strokeStyle = 'rgba(28,24,20,0.95)'; cx.lineWidth = 4;
for (var d = -h; d < w + h; d += 44) { cx.beginPath(); cx.moveTo(d, 0); cx.lineTo(d + h, h); cx.stroke(); cx.beginPath(); cx.moveTo(d, h); cx.lineTo(d + h, 0); cx.stroke(); }
cx.strokeStyle = 'rgba(120,110,100,0.25)'; cx.lineWidth = 1;
for (var d = -h + 3; d < w + h; d += 44) { cx.beginPath(); cx.moveTo(d, 0); cx.lineTo(d + h, h); cx.stroke(); }
for (var i = 0; i < 120; i++) { cx.fillStyle = 'rgba(220,230,255,' + (0.1 + rnd(i) * 0.25) + ')'; cx.beginPath(); cx.ellipse(rnd(i + 3) * w, rnd(i + 5) * h, 1.5 + rnd(i + 7), 3 + rnd(i) * 8, 0, 0, 6.3); cx.fill(); }
});
var winPane = mesh(new THREE.PlaneGeometry(2.0, 0.9), new THREE.MeshBasicMaterial({ map: latticeTex, toneMapped: false }), 0, 0, 0, winG);
mesh(new THREE.BoxGeometry(2.14, 0.07, 0.07), darkWood, 0, 0.485, 0.03, winG); mesh(new THREE.BoxGeometry(2.14, 0.09, 0.12), shelfWood, 0, -0.5, 0.05, winG);
mesh(new THREE.BoxGeometry(0.07, 1.0, 0.07), darkWood, -1.035, 0, 0.03, winG); mesh(new THREE.BoxGeometry(0.07, 1.0, 0.07), darkWood, 1.035, 0, 0.03, winG); mesh(new THREE.BoxGeometry(0.05, 1.0, 0.05), darkWood, 0, 0, 0.03, winG);
var winLight = new THREE.PointLight(0x9aa8c8, 0.4, 4, 1.6); winLight.position.set(-1.35, 2.2, -D / 2 + 0.6); scene.add(winLight);
// the door, front right: the threshold the flood is lapping at
var doorG = new THREE.Group(); doorG.position.set(W / 2 - 0.03, 0, 0.6); doorG.rotation.y = -Math.PI / 2; scene.add(doorG);
var doorLeaf = mesh(new THREE.BoxGeometry(0.95, 2.15, 0.06), darkWood, 0, 1.075, 0, doorG); doorLeaf.castShadow = true;
mesh(new THREE.BoxGeometry(1.1, 0.1, 0.12), oak, 0, 2.2, 0, doorG); mesh(new THREE.BoxGeometry(0.08, 2.25, 0.12), oak, -0.55, 1.125, 0, doorG); mesh(new THREE.BoxGeometry(0.08, 2.25, 0.12), oak, 0.55, 1.125, 0, doorG);
mesh(new THREE.BoxGeometry(0.34, 0.7, 0.02), oak, -0.2, 0.55, 0.035, doorG); mesh(new THREE.BoxGeometry(0.34, 0.7, 0.02), oak, 0.2, 0.55, 0.035, doorG);
mesh(new THREE.PlaneGeometry(0.62, 0.62), new THREE.MeshBasicMaterial({ map: latticeTex, toneMapped: false }), 0, 1.55, 0.035, doorG);
mesh(new THREE.BoxGeometry(0.7, 0.05, 0.05), darkWood, 0, 1.86, 0.04, doorG); mesh(new THREE.BoxGeometry(0.7, 0.05, 0.05), darkWood, 0, 1.24, 0.04, doorG);
mesh(new THREE.SphereGeometry(0.035, 12, 10), brass, 0.36, 1.05, 0.06, doorG); mesh(new THREE.BoxGeometry(0.06, 0.16, 0.012), brass, 0.36, 1.05, 0.035, doorG);
mesh(new THREE.BoxGeometry(0.16, 0.05, 0.012), brass, 0, 1.0, 0.035, doorG);
// the flood: water over the boards at the threshold, holding the room upside down and finding its level
var pool = mesh(new THREE.PlaneGeometry(2.2, 3.2), null, W / 2 - 0.9, 0.008, 0.7); pool.rotation.x = -Math.PI / 2;
mirrors.push(makeMirror(pool, new THREE.Vector3(0, 1, 0), portrait ? 512 : 1024, new THREE.Vector3(0.55, 0.6, 0.72), { transparent: true, ripple: true, edge: '0.3' }));
var seep = mesh(new THREE.PlaneGeometry(1.3, 0.24), new THREE.MeshBasicMaterial({ color: 0x8aa0c0, transparent: true, opacity: 0.12, depthWrite: false }), 0, 0.01, -0.1, doorG); seep.rotation.x = -Math.PI / 2;
var doorHit = mesh(new THREE.BoxGeometry(1.1, 2.2, 0.5), new THREE.MeshBasicMaterial({ visible: false }), 0, 1.1, -0.15, doorG);

// ---------- THE PARTICULARS: what the outside scenes have and a bare room lacks: lettering, prints, the things a pub accumulates ----------
function textTex(w, h, fn) { return tex(w, h, function(cx, ww, hh) { fn(cx, ww, hh); }); }
// pump clips, each its own ale
var clipNames = ['BEST BITTER', 'OLD PORTER', 'PALE ALE', 'MILD'];
var clipK = 0;
for (var pz2 = barZ0 + 0.8; pz2 < barZ1 - 0.4; pz2 += 0.9) {
var nm = clipNames[clipK % clipNames.length], cc = ['#7a1e1e', '#1e2a4a', '#b08a2a', '#2a4a2a'][clipK % 4]; clipK++;
var ct = textTex(128, 96, function(cx, w, h) { cx.fillStyle = '#e8dcc0'; cx.fillRect(0, 0, w, h); cx.fillStyle = cc; cx.fillRect(4, 4, w - 8, h - 8); cx.fillStyle = '#e8dcc0'; cx.font = 'bold 15px Georgia,serif'; cx.textAlign = 'center'; cx.fillText(nm, w / 2, h / 2 + 5); cx.strokeStyle = '#e8dcc0'; cx.lineWidth = 1; cx.strokeRect(10, 10, w - 20, h - 20); });
var clip = mesh(new THREE.PlaneGeometry(0.09, 0.068), new THREE.MeshStandardMaterial({ map: ct, roughness: 0.6 }), barX - 0.2, 1.36, pz2, barG); clip.rotation.y = Math.PI / 2; clip.rotation.z = 0.28; clip.position.x = barX - 0.205;
}
// the gilt line across the mirror
var giltTex = textTex(1024, 128, function(cx, w, h) { cx.clearRect(0, 0, w, h); cx.font = 'bold 44px Georgia,serif'; cx.textAlign = 'center'; cx.fillStyle = 'rgba(214,176,90,0.85)'; cx.fillText('THE PILLARS OF HERCULES', w / 2, 62); cx.font = 'italic 22px Georgia,serif'; cx.fillStyle = 'rgba(214,176,90,0.7)'; cx.fillText('fine ales · wines · spirits', w / 2, 100); cx.strokeStyle = 'rgba(214,176,90,0.6)'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(120, 72); cx.lineTo(w - 120, 72); cx.stroke(); });
var gilt = mesh(new THREE.PlaneGeometry(barLen - 0.9, 0.34), new THREE.MeshBasicMaterial({ map: giltTex, transparent: true, depthWrite: false, toneMapped: false, opacity: 0.9 }), bbX + 0.035, 2.2, barMidZ); gilt.rotation.y = Math.PI / 2;
// a chalkboard on the back wall by the arch: REAL ALES and tonight's prices
var chalkTex = textTex(256, 320, function(cx, w, h) {
cx.fillStyle = '#1a1c18'; cx.fillRect(0, 0, w, h); for (var i = 0; i < 1500; i++) { cx.fillStyle = 'rgba(255,255,255,' + rnd(i) * 0.05 + ')'; cx.fillRect(rnd(i + 1) * w, rnd(i + 2) * h, 2, 2); }
cx.fillStyle = 'rgba(240,235,220,0.9)'; cx.textAlign = 'center'; cx.font = 'bold 34px Georgia,serif'; cx.fillText('REAL ALES', w / 2, 54); cx.strokeStyle = 'rgba(240,235,220,0.7)'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(30, 66); cx.lineTo(w - 30, 66); cx.stroke();
cx.font = '22px Georgia,serif'; cx.textAlign = 'left'; ['Bitter  . . . . 21p', 'Porter  . . . . 23p', 'Pale  . . . . . 22p', 'Mild  . . . . . 19p', 'Cider  . . . . . 20p'].forEach(function(l, i) { cx.fillText(l, 26, 110 + i * 36); });
cx.font = 'italic 18px Georgia,serif'; cx.textAlign = 'center'; cx.fillText('no credit, no exceptions', w / 2, 300);
});
var chalk = mesh(new THREE.PlaneGeometry(0.5, 0.64), new THREE.MeshStandardMaterial({ map: chalkTex, roughness: 0.95 }), 1.75, 1.72, -D / 2 + 0.03);
mesh(new THREE.BoxGeometry(0.58, 0.72, 0.03), oak, 1.75, 1.72, -D / 2 + 0.015);
// Piranesi on the right wall: three framed etchings of ruins, the same ruins the columns are
function etchingTex(seed) {
return tex(256, 320, function(cx, w, h) {
cx.fillStyle = '#d9cdae'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 6000; i++) { cx.fillStyle = i % 2 ? 'rgba(90,70,40,0.05)' : 'rgba(255,250,230,0.05)'; cx.fillRect(rnd(i + seed) * w, rnd(i * 3 + seed) * h, 1, 1); }
cx.strokeStyle = '#3a2c1c'; cx.lineWidth = 0.9;
function hatch(x0, y0, x1, y1, step, a) { cx.globalAlpha = a; for (var y = y0; y < y1; y += step) { cx.beginPath(); cx.moveTo(x0, y); cx.lineTo(x1, y + step * 0.6); cx.stroke(); } cx.globalAlpha = 1; }
// a sky of horizontal hatching, an arch, columns standing and fallen
hatch(20, 20, w - 20, 110, 4, 0.25);
var ax = 60 + rnd(seed) * 80, ar = 50 + rnd(seed + 1) * 30;
cx.lineWidth = 1.4; cx.beginPath(); cx.arc(ax + ar, 150, ar, Math.PI, 0); cx.moveTo(ax, 150); cx.lineTo(ax, 260); cx.moveTo(ax + ar * 2, 150); cx.lineTo(ax + ar * 2, 260); cx.stroke();
hatch(ax + 4, 100, ax + ar * 2 - 4, 150, 3, 0.5); hatch(ax + ar * 2 + 2, 150, w - 20, 260, 3.5, 0.35);
for (var c = 0; c < 3; c++) { var cx0 = 30 + c * 70 + rnd(seed + c) * 20, ch = 90 + rnd(seed * 3 + c) * 60; cx.lineWidth = 1; cx.strokeRect(cx0, 260 - ch, 14, ch); for (var f = 0; f < 4; f++) { cx.beginPath(); cx.moveTo(cx0 + 3 + f * 3, 260 - ch + 4); cx.lineTo(cx0 + 3 + f * 3, 258); cx.stroke(); } cx.strokeRect(cx0 - 3, 260 - ch - 6, 20, 6); }
cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(150, 250); cx.lineTo(230, 236); cx.moveTo(150, 262); cx.lineTo(230, 248); cx.moveTo(150, 250); cx.lineTo(150, 262); cx.stroke();
hatch(150, 250, 230, 262, 3, 0.4);
hatch(20, 262, w - 20, 300, 5, 0.3);
var tiny = [rnd(seed + 9) * 60 + 100, rnd(seed + 11) * 50 + 120]; cx.beginPath(); cx.arc(tiny[0], 252, 3, 0, 6.3); cx.moveTo(tiny[0], 255); cx.lineTo(tiny[0], 268); cx.stroke();
cx.font = 'italic 9px Georgia,serif'; cx.fillStyle = '#5a4a30'; cx.textAlign = 'center'; cx.fillText(['Veduta degli avanzi', 'Rovine del tempio', 'Colonne spezzate'][seed % 3], w / 2, 312);
var vg = cx.createRadialGradient(w / 2, h / 2, 60, w / 2, h / 2, 220); vg.addColorStop(0, 'rgba(90,70,40,0)'); vg.addColorStop(1, 'rgba(90,70,40,0.35)'); cx.fillStyle = vg; cx.fillRect(0, 0, w, h);
});
}
var frameMat = new THREE.MeshStandardMaterial({ color: 0x1a1008, roughness: 0.5, envMap: roomEnv, envMapIntensity: 0.2 });
[[2.3, 1], [-0.3, 2], [-2.6, 3]].forEach(function(f) {
var fz = f[0], fy = 2.05 + (f[1] % 2) * 0.05;
mesh(new THREE.BoxGeometry(0.03, 0.62, 0.5), frameMat, W / 2 - 0.035, fy, fz);
var pr = mesh(new THREE.PlaneGeometry(0.42, 0.54), new THREE.MeshStandardMaterial({ map: etchingTex(f[1]), roughness: 0.85 }), W / 2 - 0.052, fy, fz); pr.rotation.y = -Math.PI / 2;
});
// a clock over the arch, stopped at the hour the flood came
var clockTex = textTex(128, 128, function(cx, w, h) { cx.fillStyle = '#e8dcc0'; cx.beginPath(); cx.arc(64, 64, 60, 0, 6.3); cx.fill(); cx.fillStyle = '#2a1a10'; cx.font = 'bold 13px Georgia,serif'; cx.textAlign = 'center'; for (var i = 1; i <= 12; i++) { var a = i * Math.PI / 6; cx.fillText(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][i - 1], 64 + Math.sin(a) * 46, 68 - Math.cos(a) * 46); } cx.strokeStyle = '#2a1a10'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(64, 64); cx.lineTo(64 + Math.sin(2.6) * 34, 64 - Math.cos(2.6) * 34); cx.moveTo(64, 64); cx.lineTo(64 + Math.sin(5.9) * 22, 64 - Math.cos(5.9) * 22); cx.stroke(); cx.beginPath(); cx.arc(64, 64, 3, 0, 6.3); cx.fill(); });
mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.05, 32), oak, 1.75, 2.42, -D / 2 + 0.05).rotation.x = Math.PI / 2;
var clockFace = mesh(new THREE.CircleGeometry(0.16, 32), new THREE.MeshStandardMaterial({ map: clockTex, roughness: 0.6 }), 1.75, 2.42, -D / 2 + 0.08);
// coat hooks by the door, one coat left behind, a hat above it
var hookZ = 1.55;
for (var hk = 0; hk < 3; hk++) mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 6), brass, W / 2 - 0.05, 1.85, hookZ + hk * 0.25).rotation.z = Math.PI / 2;
var coatMat = new THREE.MeshStandardMaterial({ color: 0x2a2620, roughness: 0.95 });
var coat = mesh(new THREE.BoxGeometry(0.06, 0.9, 0.34), coatMat, W / 2 - 0.09, 1.38, hookZ + 0.25); coat.castShadow = true;
mesh(new THREE.BoxGeometry(0.05, 0.3, 0.16), coatMat, W / 2 - 0.1, 1.55, hookZ + 0.05);
mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.09, 16), coatMat, W / 2 - 0.1, 1.9, hookZ + 0.25).rotation.z = Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.012, 16), coatMat, W / 2 - 0.1, 1.9, hookZ + 0.25).rotation.z = Math.PI / 2;
// beer mats and a bell on the copper
var matTex = textTex(64, 64, function(cx, w, h) { cx.fillStyle = '#d8c8a0'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#7a1e1e'; cx.beginPath(); cx.arc(32, 32, 24, 0, 6.3); cx.fill(); cx.fillStyle = '#e8dcc0'; cx.font = 'bold 9px Georgia,serif'; cx.textAlign = 'center'; cx.fillText('PILLARS', 32, 30); cx.fillText('ALES', 32, 41); });
[[-2.4, 0.2], [-0.2, -0.1], [1.1, 0.25]].forEach(function(mz, i) { var bm2 = mesh(new THREE.PlaneGeometry(0.1, 0.1), new THREE.MeshStandardMaterial({ map: matTex, roughness: 0.95 }), barX + 0.18 + mz[1], 1.133, mz[0], barG); bm2.rotation.x = -Math.PI / 2; bm2.rotation.z = rnd(i) * 1.2; });
mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.06, 16), brass, barX - 0.22, 1.16, barZ1 - 0.2, barG); mesh(new THREE.SphereGeometry(0.012, 8, 6), brass, barX - 0.22, 1.2, barZ1 - 0.2, barG);

// ---------- THE FIGURES, faint traces ----------
function ghostTex(seed, seated) {
return tex(96, 192, function(cx, w, h) {
try { cx.filter = 'blur(2.5px)'; } catch (e) {}
var hx = 48 + (rnd(seed) - 0.5) * 8, hy = seated ? 58 : 38, hr = 14 + rnd(seed + 1) * 3;
cx.fillStyle = 'rgba(225,210,180,0.6)';
cx.beginPath(); cx.arc(hx, hy, hr, 0, 6.3); cx.fill();
cx.beginPath(); cx.moveTo(hx - 34, seated ? 150 : h); cx.lineTo(hx - 30, hy + hr + 6); cx.quadraticCurveTo(hx, hy + hr - 6, hx + 30, hy + hr + 6); cx.lineTo(hx + 34, seated ? 150 : h); cx.closePath(); cx.fill();
try { cx.filter = 'none'; } catch (e) {}
var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.25, 'rgba(0,0,0,0.15)'); g.addColorStop(0.65, 'rgba(0,0,0,0.6)'); g.addColorStop(1, 'rgba(0,0,0,1)');
cx.globalCompositeOperation = 'destination-out'; cx.fillStyle = g; cx.fillRect(0, 0, w, h);
});
}
var ghosts = [];
function ghost(x, z, seed, base, seated) {
var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ghostTex(seed, seated), transparent: true, opacity: base, depthWrite: false, blending: THREE.AdditiveBlending }));
sp.scale.set(0.9, 1.8, 1); sp.position.set(x, 0.9, z); scene.add(sp);
var hit = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, seated ? 1.1 : 1.5, 8), new THREE.MeshBasicMaterial({ visible: false }));
hit.position.set(x, seated ? 0.7 : 0.95, z); scene.add(hit);
var g = { sp: sp, hit: hit, base: base, ph: seed * 2.1 }; ghosts.push(g); return g;
}
var ham = ghost(W / 2 - 0.55, -1.0, 0, 0.4, false);     // the man you recognise through the fumes, at the shelf on the right wall by the pillars
var drinker = ghost(barX + 0.62, -1.4, 2, 0.24, false);   // someone at the bar, back turned
var farOne = ghost(0.6, -3.4, 4, 0.18, false);            // a shape under the arch, going or coming

// ---------- LIGHT: brass wall lamps with their shades, the glass overhead, the street through the lattice, smoke ----------
scene.add(new THREE.AmbientLight(0x4a3a24, 0.4));
scene.add(new THREE.HemisphereLight(0x8a7040, 0x0a0806, 0.3));
var glowTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,225,160,0.9)'); g.addColorStop(0.3, 'rgba(255,190,100,0.35)'); g.addColorStop(0.7, 'rgba(220,140,50,0.08)'); g.addColorStop(1, 'rgba(180,100,30,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function glow(x, y, z, sc, op) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: op || 0.6, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, fog: false, toneMapped: false })); sp.scale.set(sc, sc, 1); sp.position.set(x, y, z); scene.add(sp); return sp; }
var shadeMat = new THREE.MeshStandardMaterial({ color: 0xfff0d8, emissive: 0xffd8a0, emissiveIntensity: 0.8, roughness: 0.6, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
var lamps = [], glows = [];
[[W / 2 - 0.12, 2.1, 1.6, -1], [W / 2 - 0.12, 2.1, -0.4, -1], [-W / 2 + 0.12, 2.35, -0.6, 1], [-W / 2 + 0.12, 2.35, 1.0, 1]].forEach(function(lp, i) {
var l = new THREE.PointLight(0xffc880, 1.0, 5.5, 1.6); l.position.set(lp[0] + lp[3] * 0.16, lp[1] - 0.04, lp[2]);
if (i === 0) { l.castShadow = true; l.shadow.mapSize.set(1024, 1024); l.shadow.bias = -0.001; l.shadow.normalBias = 0.02; l.shadow.radius = 3; l.shadow.camera.near = 0.1; l.shadow.camera.far = 8; }
scene.add(l); lamps.push(l);
// bracket out from the wall, the shade a frosted tulip, the bulb inside it
var arm = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 6), brass, lp[0] + lp[3] * 0.1, lp[1] - 0.1, lp[2]); arm.rotation.z = Math.PI / 2;
mesh(new THREE.BoxGeometry(0.04, 0.16, 0.08), brass, lp[0], lp[1] - 0.1, lp[2]);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.1, 6), brass, lp[0] + lp[3] * 0.2, lp[1] - 0.06, lp[2]);
mesh(new THREE.CylinderGeometry(0.075, 0.03, 0.13, 18, 1, true), shadeMat, lp[0] + lp[3] * 0.2, lp[1] + 0.04, lp[2]);
mesh(new THREE.SphereGeometry(0.03, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfff4dc, toneMapped: false }), lp[0] + lp[3] * 0.2, lp[1] + 0.02, lp[2]);
glows.push(glow(lp[0] + lp[3] * 0.22, lp[1] + 0.04, lp[2], 0.9, 0.55));
});
glows.push(glow(0.55, 1.28, -D / 2 + 0.06, 0.7, 0.4));
// contact shadows under the stools and the pillars
var contactTex = tex(64, 64, function(cx, w, h) { var g = cx.createRadialGradient(32, 32, 3, 32, 32, 32); g.addColorStop(0, 'rgba(0,0,0,0.36)'); g.addColorStop(0.45, 'rgba(0,0,0,0.2)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function contact(x, z, s) { var sh = mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false }), x, 0.004, z); sh.rotation.x = -Math.PI / 2; return sh; }
stools.forEach(function(st) { contact(st.position.x, st.position.z, 0.85); });
contact(-1.15, PZ, 1.3); contact(1.15, PZ, 1.3);
renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true;
// smoke: slow additive sheets between the pillars, and haze under the lamps
var smokeTex = tex(256, 128, function(cx, w, h) { for (var i = 0; i < 26; i++) { var g = cx.createRadialGradient(rnd(i) * w, rnd(i + 1) * h, 0, rnd(i) * w, rnd(i + 1) * h, 20 + rnd(i + 2) * 60); g.addColorStop(0, 'rgba(200,180,140,0.13)'); g.addColorStop(1, 'rgba(200,180,140,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); } });
var smokes = [0, 1].map(function(i) { var sp = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.0), new THREE.MeshBasicMaterial({ map: smokeTex, transparent: true, opacity: 0.42, depthWrite: false, blending: THREE.AdditiveBlending })); sp.position.set(0, 1.6 + i * 0.5, PZ + 0.6 + i * 1.2); scene.add(sp); return sp; });
var hazeTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(208,181,139,0.2)'); g.addColorStop(0.35, 'rgba(171,137,94,0.12)'); g.addColorStop(1, 'rgba(111,82,51,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var haze = [[W / 2 - 0.5, 1.8, 1.6], [W / 2 - 0.5, 1.8, -0.4], [-W / 2 + 0.5, 2.0, -0.6], [-W / 2 + 0.5, 2.0, 1.0]].map(function(p) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTex, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending })); sp.position.set(p[0], p[1], p[2]); sp.scale.set(2.0, 1.5, 1); scene.add(sp); return sp; });
// soft specks in the lamp pools only
var dustTex = tex(32, 32, function(cx, w, h) { var g = cx.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,237,197,0.85)'); g.addColorStop(0.22, 'rgba(255,237,197,0.4)'); g.addColorStop(1, 'rgba(255,237,197,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var moteN = 72, moteBase = new Float32Array(moteN * 3), motePos = new Float32Array(moteN * 3);
for (var mi = 0; mi < moteN; mi++) { var lpp = lamps[mi % 4].position, angle = rnd(mi * 7) * Math.PI * 2, radius = 0.15 + rnd(mi * 11) * 1.0; moteBase[mi * 3] = lpp.x + Math.cos(angle) * radius * 0.6; moteBase[mi * 3 + 1] = 0.6 + rnd(mi + 1) * 2.0; moteBase[mi * 3 + 2] = lpp.z + Math.sin(angle) * radius; }
motePos.set(moteBase);
var moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
scene.add(new THREE.Points(moteGeo, new THREE.PointsMaterial({ map: dustTex, color: 0xe8d8b0, size: 0.018, transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.AdditiveBlending })));

// ---------- THE CLOSE-UPS, AND THE PATHS ----------
var PINK = 'color:#ff3aa8;text-shadow:0 0 4px rgba(255,58,168,0.45);';
function passageLinks(sel) {
var pass = piHost.closest('tw-passage') || document.querySelector('tw-passage');
if (!pass) return [];
return Array.prototype.slice.call(pass.querySelectorAll(sel)).filter(function(l) { return !piWrap.contains(l) && l.getClientRects().length > 0; });
}
function byText(texts) { return passageLinks('tw-link').filter(function(l) { return texts.indexOf(l.textContent.trim()) >= 0; }); }
var HOTSPOTS = [
{ root: barG, name: 'the bar', pos: [-0.5, 1.4, 0.9], tgt: [barX, 1.15, -0.9], haloAt: [barX, 1.15, -0.5], haloSc: 1.4,
actions: function() { return byText(['Get a drink at the bar']); },
line: 'Copper on the counter, worn to the colour of a penny where the elbows go; nobody is serving, and the pumps have nothing to say to you tonight. [Sam: the bar when no drink is offered]' },
{ root: ham.hit, name: 'the man through the fumes', pos: [0.75, 1.45, 1.0], tgt: [W / 2 - 0.55, 1.25, -1.0], figure: true,
actions: function() { return byText(['Talk to the Great Ham']); } },
{ root: pillarHit, name: 'the third pillar', pos: [0.15, 1.5, 0.4], tgt: [0, 1.45, PZ], haloAt: [0, 1.5, PZ + 0.36], haloSc: 1.3,
actions: function() { return byText(['Step through the third pillar', 'Perform the synthesis']); },
onLook: function(on) { pillarLight.intensity = on ? 0.9 : 0; },
line: 'Between the two broken ones a third, whole, that the room arranges itself around and nobody mentions. It stays shut. [Sam: the pillar with nothing in your pocket]' },
{ root: doorHit, name: 'the threshold', pos: [0.6, 1.35, 1.9], tgt: [W / 2 - 0.4, 0.9, 0.6], haloAt: [W / 2 - 0.3, 1.0, 0.6], haloSc: 1.3,
actions: function() { return byText(["'I can walk on water'"]); },
line: 'The door to Greek Street, and under it the water, which has topped the kerb and is finding its level across the boards. [Sam: the threshold and the flood]' },
{ root: phoneHit, name: 'the telephone', pos: [-0.9, 1.55, 1.2], tgt: [-W / 2 + 0.2, 1.45, barZ1 - 0.3], haloSc: 0.5,
actions: function() { return passageLinks('.phone-ringing tw-link'); },
prose: function() { var d = passageLinks('.phone-ringing')[0]; if (!d) return ''; var c = d.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('tw-link'), function(l) { l.parentNode.removeChild(l); }); return c.textContent.replace(/\s+/g, ' ').trim(); },
line: 'The telephone on the back bar, under the bottles, the one that gets answered and then looked over at you. Quiet for now. [Sam: the phone when it is quiet]' },
{ root: winG, name: 'the lattice window', pos: [-0.9, 1.9, -1.6], tgt: [-1.35, 2.3, -D / 2], haloAt: [-1.35, 2.3, -D / 2 + 0.1], haloSc: 1.6,
line: 'Rain on the diamond panes and the street lamp broken up by them; out there the runoff is a river now, and the river is coming in. [Sam: the lattice window]' }
];
var hotspotRoots = HOTSPOTS.map(function(h) { return h.root; });
function hotspotFor(obj) { while (obj) { var i = hotspotRoots.indexOf(obj); if (i >= 0) return HOTSPOTS[i]; obj = obj.parent; } return null; }
function spotActions(spot) { try { return spot.actions ? spot.actions() : []; } catch (e) { return []; } }
function available(spot) { return !!spot && (!spot.figure || spotActions(spot).length > 0); }
var haloTex = tex(128, 128, function(cx, w, h) {
cx.save(); cx.translate(64, 64); cx.scale(1, 0.78);
var g = cx.createRadialGradient(-5, -7, 0, 0, 0, 64);
g.addColorStop(0, 'rgba(235,255,190,0.75)'); g.addColorStop(0.16, 'rgba(215,240,160,0.45)'); g.addColorStop(0.44, 'rgba(180,210,110,0.18)'); g.addColorStop(0.78, 'rgba(140,170,70,0.045)'); g.addColorStop(1, 'rgba(120,150,40,0)');
cx.fillStyle = g; cx.fillRect(-64, -82, 128, 164); cx.restore();
});
var halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, transparent: true, opacity: 0.8, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, toneMapped: false }));
halo.visible = false; halo.scale.set(0.5, 0.5, 1); scene.add(halo);
function haloAt(spot) {
var wp = new THREE.Vector3();
if (spot.haloAt) wp.set(spot.haloAt[0], spot.haloAt[1], spot.haloAt[2]); else spot.root.getWorldPosition(wp);
if (spot.figure) wp.y += 0.45;
halo.position.copy(wp);
var sc = spot.haloSc || (spot.figure ? 0.9 : 0.5);
halo.scale.set(sc, sc, 1);
}
var card = document.createElement('div');
card.style.cssText = 'position:absolute;left:50%;bottom:44px;transform:translateX(-50%);width:min(560px,86%);' +
'font:15px/1.5 \'Crimson Text\',Georgia,serif;color:rgba(215,225,180,0.92);text-align:center;' +
'background:rgba(6,10,4,0.8);border:1px solid rgba(170,200,110,0.3);padding:14px 22px 12px;border-radius:2px;' +
'pointer-events:none;z-index:9004;opacity:0;transition:opacity 0.7s ease;';
piWrap.appendChild(card);
var BTN = 'display:inline-block;margin:6px 6px 0;font:12px \'Courier New\',monospace;letter-spacing:3px;text-transform:uppercase;color:rgba(220,235,160,0.95);padding:9px 18px;border:1px solid rgba(180,200,110,0.45);background:rgba(0,0,0,0.35);cursor:pointer;white-space:normal;max-width:100%;box-sizing:border-box;line-height:1.5;';
function showCard(spot) {
var acts = spotActions(spot);
var html = '<div style="font:11px \'Courier New\',monospace;letter-spacing:3px;color:rgba(190,200,150,0.5);margin-bottom:6px;text-transform:uppercase;">' + spot.name + '</div>';
if (acts.length) {
var prose = spot.prose ? spot.prose() : '';
if (prose) html += '<div style="margin-bottom:4px;">' + prose.replace(/</g, '&lt;') + '</div>';
html += '<div class="fi-actions"></div>';
} else {
html += '<div style="' + PINK + '">' + spot.line + '</div>';
}
html += '<div style="font:10px \'Courier New\',monospace;letter-spacing:2px;color:rgba(190,200,150,0.32);margin-top:8px;">' + (acts.length ? 'OR CLICK ANYWHERE ELSE TO STEP BACK' : 'CLICK ANYWHERE TO STEP BACK') + '</div>';
card.innerHTML = html;
var row = card.querySelector('.fi-actions');
if (row) acts.forEach(function(link) {
var b = document.createElement('span');
b.className = 'fi-action'; b.textContent = link.textContent.trim(); b.style.cssText = BTN;
b.addEventListener('pointerdown', function(ev) { ev.stopPropagation(); });
b.addEventListener('click', function(ev) { ev.stopPropagation(); if (!link.isConnected) { stepBack(); return; } link.click(); stepBack(); });
row.appendChild(b);
});
card.style.pointerEvents = acts.length ? 'auto' : 'none';
card.style.opacity = '1';
}
var camMode = 'idle', camK = 0, camNext = 'idle', activeSpot = null, hoverSpot = null;
var camFromP = new THREE.Vector3(), camFromT = new THREE.Vector3(), camToP = new THREE.Vector3(), camToT = new THREE.Vector3();
var curTarget = new THREE.Vector3(CAM.tx, CAM.ty, CAM.tz);
function beginTween(toP, toT, next) {
camFromP.copy(camera.position); camFromT.copy(curTarget);
camToP.set(toP[0], toP[1], toP[2]); camToT.set(toT[0], toT[1], toT[2]);
camK = piStill ? 1 : 0; camNext = next; camMode = 'tween';
}
function stepBack() {
if (activeSpot && activeSpot.onLook) activeSpot.onLook(false);
activeSpot = null; card.style.opacity = '0'; card.style.pointerEvents = 'none';
beginTween([CAM.x, CAM.y, CAM.z], [CAM.tx, CAM.ty, CAM.tz], 'idle');
}
var ray = new THREE.Raycaster(), mouseN = new THREE.Vector2();
function pick(ev) {
var r = piCanvas.getBoundingClientRect();
mouseN.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
ray.setFromCamera(mouseN, camera);
var hits = ray.intersectObjects(hotspotRoots, true);
for (var i = 0; i < hits.length; i++) { var sp = hotspotFor(hits[i].object); if (available(sp)) return sp; }
return null;
}
piCanvas.addEventListener('pointermove', function(ev) {
if (camMode !== 'idle' || ev.pointerType === 'touch') { hoverSpot = null; halo.visible = false; return; }
var spot = pick(ev); hoverSpot = spot;
if (spot) { haloAt(spot); halo.visible = true; piCanvas.style.cursor = 'pointer'; }
else { halo.visible = false; piCanvas.style.cursor = 'default'; }
});
piCanvas.addEventListener('pointerdown', function(ev) {
if (camMode === 'tween') return;
if (camMode === 'inspect') { stepBack(); return; }
var spot = ev.pointerType === 'touch' ? pick(ev) : (hoverSpot || pick(ev));
if (!spot) return;
activeSpot = spot; halo.visible = false; piCanvas.style.cursor = 'default';
showCard(spot);
beginTween(spot.pos, spot.tgt, 'inspect');
if (spot.onLook) spot.onLook(true);
});
card.addEventListener('pointerdown', function(ev) { if (camMode === 'inspect' && !ev.target.classList.contains('fi-action')) stepBack(); });
var piHint = document.createElement('div');
piHint.textContent = 'LOOK CLOSER AT WHAT CATCHES YOUR EYE';
piHint.style.cssText = 'position:absolute;top:22px;left:50%;transform:translateX(-50%);font:11px \'Courier New\',monospace;color:rgba(190,200,150,0.3);letter-spacing:3px;z-index:9003;pointer-events:none;opacity:0;transition:opacity 2s ease;text-align:center;max-width:90%;white-space:normal;';
piWrap.appendChild(piHint);
setTimeout(function() { piHint.style.opacity = '1'; }, 2600);
setTimeout(function() { piHint.style.opacity = '0'; }, 9000);

// ---------- FRAMES ----------
var clock = new THREE.Clock();
window._dssThreeRegistry['pi-wrap'].camera = camera;
function piAnimate() {
piAnimId = requestAnimationFrame(piAnimate);
var dt = Math.min(0.1, clock.getDelta());
var t = piStill ? 0 : clock.getElapsedTime();
if (camMode === 'idle') {
camera.position.set(CAM.x + Math.sin(t * 0.11) * 0.04, CAM.y + Math.sin(t * 0.17) * 0.02, CAM.z);
curTarget.set(CAM.tx, CAM.ty, CAM.tz);
} else if (camMode === 'tween') {
camK = Math.min(1, camK + dt / 1.5);
var e = camK * camK * (3 - 2 * camK);
camera.position.lerpVectors(camFromP, camToP, e);
curTarget.lerpVectors(camFromT, camToT, e);
if (camK >= 1) camMode = camNext;
}
camera.lookAt(curTarget);
if (piWrap.dataset.cam !== camMode) piWrap.dataset.cam = camMode;
if (!piStill) {
for (var gi = 0; gi < ghosts.length; gi++) { var g = ghosts[gi]; g.sp.material.opacity = g.base * (0.7 + 0.3 * Math.sin(t * 0.23 + g.ph)); }
for (var li = 0; li < lamps.length; li++) { var br = 0.035 * Math.sin(t * (0.6 + li * 0.13) + li) + 0.018 * Math.sin(t * 0.19 + li * 2); lamps[li].intensity = 1.0 + br; glows[li].material.opacity = 0.55 + br * 0.6; haze[li].material.opacity = 0.12 + br * 0.2; }
smokes[0].position.x = Math.sin(t * 0.07) * 0.4; smokes[1].position.x = Math.cos(t * 0.05) * 0.5; smokes[0].material.opacity = 0.38 + 0.07 * Math.sin(t * 0.21); smokes[1].material.opacity = 0.38 + 0.07 * Math.cos(t * 0.17);
rainTex.offset.y = -(t * 0.55) % 1; streetLamp.intensity = 0.5 + 0.03 * Math.sin(t * 2.3) + 0.02 * Math.sin(t * 5.1);
for (var m = 0; m < moteN; m++) { motePos[m * 3] = moteBase[m * 3] + Math.sin(t * 0.15 + m) * 0.06; motePos[m * 3 + 1] = 0.6 + ((moteBase[m * 3 + 1] - 0.6 + (m % 2 ? 1 : -1) * t * 0.035) % 2.0 + 2.0) % 2.0; }
moteGeo.attributes.position.needsUpdate = true;
if (halo.visible) halo.material.opacity = 0.8 + Math.sin(t * 0.9) * 0.08;
}
for (var mr = 0; mr < mirrors.length; mr++) mirrors[mr].update(curTarget, t);
if (composer) composer.render(); else renderer.render(scene, camera);
}
if (piStill) { camera.lookAt(curTarget); piWrap.dataset.cam = 'idle'; }
piAnimate();
}

setInterval(function() {
var container = document.getElementById('pi-container');
if (container && !piActive) {
initPillarsInside();
} else if (!container) {
piActive = false;
if (piAnimId) { cancelAnimationFrame(piAnimId); piAnimId = null; }
window._dssDisposeWrap('pi-wrap');
}
}, 300);
})();

