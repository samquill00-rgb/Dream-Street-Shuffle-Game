// ====== INSIDE THE COLONY — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-26. The second "look closer" room, after the French. Built
// from what is written of the Colony Room Club at 41 Dean Street: one
// small first-floor room painted a bilious green, its walls crowded
// with pictures, a small bar, bamboo furniture, an upright piano, a
// window onto the street. The room sits at the top of The Colony Room
// passage (#ci-container) and is its navigation: the man at the bar,
// the agent at his table and the telephone open the passage's own
// links when the passage has rendered them; the bar opens the drink
// when it is offered. The pictures, the piano and the window are
// inspections, their card words pink placeholders for Sam. Nothing
// about the game is decided in JS: the room only finds the passage's
// links by their wording and clicks them.
(function() {
var ciActive = false;
var ciAnimId = null;

function initColonyInside() {
if (ciActive) return;
ciActive = true;
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(buildCIScene) : buildCIScene()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(buildCIScene) : buildCIScene());
}
}

function buildCIScene() {
var ciStill = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var ciHost = document.getElementById('ci-container');
if (!ciHost) { ciActive = false; return; }
var ciWrap = document.createElement('div');
ciWrap.id = 'ci-wrap';
function ciSize() {
var w = Math.max(280, document.documentElement.clientWidth || window.innerWidth);
var vh = window.innerHeight || 800;
var h = Math.round(w < 600 ? Math.max(300, vh * 0.56) : Math.max(320, Math.min(vh * 0.66, 680)));
return { w: w, h: h };
}
var ciSz = ciSize();
ciWrap.style.cssText = 'position:relative;width:100vw;margin-left:calc(50% - 50vw);height:' + ciSz.h + 'px;z-index:0;isolation:isolate;background:#070905;overflow:hidden;';
var ciCanvas = document.createElement('canvas');
ciCanvas.width = ciSz.w; ciCanvas.height = ciSz.h;
ciCanvas.style.cssText = 'display:block;position:absolute;top:0;left:0;width:100%;height:100%;touch-action:manipulation;';
ciWrap.appendChild(ciCanvas);
var ciWash = document.createElement('div');
ciWash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9000;background:linear-gradient(180deg,rgba(10,18,6,0.3) 0%,rgba(6,10,4,0.05) 35%,rgba(6,10,4,0.05) 60%,rgba(3,5,2,0.45) 100%);';
ciWrap.appendChild(ciWash);
var ciVig = document.createElement('div');
ciVig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:radial-gradient(ellipse at 50% 44%,transparent 24%,rgba(0,0,0,0.74) 100%);';
ciWrap.appendChild(ciVig);
var ciGrain = document.createElement('div');
ciGrain.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9002;opacity:0.06;mix-blend-mode:overlay;background:url(' + (window.dssGetGrainURL ? window.dssGetGrainURL() : '') + ');';
ciWrap.appendChild(ciGrain);
var ciLoc = document.createElement('div');
ciLoc.textContent = 'THE COLONY ROOM, DEAN STREET';
ciLoc.style.cssText = 'position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font:12px \'Courier New\',monospace;color:rgba(190,200,140,0.25);letter-spacing:3px;white-space:nowrap;z-index:9003;pointer-events:none;';
ciWrap.appendChild(ciLoc);
ciHost.appendChild(ciWrap);
ciSz = ciSize(); ciWrap.style.height = ciSz.h + 'px';

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x070905);
scene.fog = new THREE.FogExp2(0x0c1208, 0.07);
var aspect = ciSz.w / ciSz.h;
var portrait = aspect < 1;
var camera = new THREE.PerspectiveCamera(portrait ? 80 : 54, aspect, 0.05, 40);
// from just inside the door at the front left, looking across the room to the bar and the piano
var CAM = portrait ? { x: -1.6, y: 1.5, z: 1.9, tx: 0.25, ty: 1.1, tz: -0.9 } : { x: -1.55, y: 1.5, z: 1.75, tx: 0.3, ty: 1.15, tz: -0.9 };
camera.position.set(CAM.x, CAM.y, CAM.z);

var renderer = new THREE.WebGLRenderer({ canvas: ciCanvas, antialias: true });
renderer.setSize(ciSz.w, ciSz.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, ciSz.w < 600 ? 1.25 : 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.66;
window._dssBindScene('ci-wrap', scene, renderer, camera);
var origResize = window._dssThreeRegistry['ci-wrap'].resize;
window._dssThreeRegistry['ci-wrap'].resize = function() {
ciSz = ciSize(); ciWrap.style.height = ciSz.h + 'px';
camera.aspect = ciSz.w / ciSz.h;
camera.fov = camera.aspect < 1 ? 80 : 54;
camera.updateProjectionMatrix();
renderer.setSize(ciSz.w, ciSz.h);
};
window.removeEventListener('resize', origResize);
window.addEventListener('resize', window._dssThreeRegistry['ci-wrap'].resize);
// The outside scenes' bloom and grade, at the room's own size.
var composer = window.dssMakeComposer ? window.dssMakeComposer(scene, camera, renderer, { bloomStrength: 0.3, bloomRadius: 0.55, bloomThreshold: 0.72 }) : null;
if (composer) { composer.setSize(ciSz.w, ciSz.h); var ciResize = window._dssThreeRegistry['ci-wrap'].resize; window._dssThreeRegistry['ci-wrap'].resize = function() { ciResize(); composer.setSize(ciSz.w, ciSz.h); }; window.removeEventListener('resize', ciResize); window.addEventListener('resize', window._dssThreeRegistry['ci-wrap'].resize); }

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

// ---------- THE ROOM: 5 by 4, ceiling low ----------
var W = 5.2, D = 4.2, H = 2.55;
// the bilious green, "less salad than submarine": a murky green under yellowed varnish, uneven, nicotine at the top
var wallGrain = paintTex('#3b5a2b', 17, 'rgba(150,140,50,0.14)');
var wallMat = new THREE.MeshStandardMaterial({ map: wallGrain, bumpMap: wallGrain, bumpScale: 0.012, roughness: 0.9, envMap: roomEnv, envMapIntensity: 0.08 });
var ceilMat = new THREE.MeshStandardMaterial({ map: paintTex('#8a7a44', 25, 'rgba(200,170,60,0.14)'), roughness: 0.96 });
var carpetPile = tex(512, 512, function(cx, w, h) {
cx.fillStyle = '#2c2818'; cx.fillRect(0, 0, w, h);
cx.strokeStyle = 'rgba(140,110,50,0.14)'; cx.lineWidth = 2;
for (var y = 0; y < h; y += 64) for (var x = 0; x < w; x += 64) { cx.beginPath(); cx.moveTo(x + 32, y); cx.lineTo(x + 64, y + 32); cx.lineTo(x + 32, y + 64); cx.lineTo(x, y + 32); cx.closePath(); cx.stroke(); }
for (var n = 0; n < 18; n++) { var x = rnd(n) * w, y = rnd(n + 9) * h, g = cx.createRadialGradient(x, y, 0, x, y, 75); g.addColorStop(0, n % 2 ? 'rgba(120,100,60,0.14)' : 'rgba(10,8,4,0.3)'); g.addColorStop(1, 'rgba(120,100,60,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); }
for (var i = 0; i < 42000; i++) { cx.fillStyle = i % 3 ? 'rgba(12,10,6,0.24)' : 'rgba(150,130,80,0.18)'; cx.fillRect(rnd(i) * w, rnd(i + 4) * h, 0.6, 1.5 + rnd(i + 7) * 2); }
});
carpetPile.wrapS = carpetPile.wrapT = THREE.RepeatWrapping; carpetPile.repeat.set(3.5, 3);
var carpetMat = new THREE.MeshStandardMaterial({ map: carpetPile, bumpMap: carpetPile, bumpScale: 0.018, roughness: 1 });
var floor = mesh(new THREE.PlaneGeometry(W, D), carpetMat, 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceil = mesh(new THREE.PlaneGeometry(W, D), ceilMat, 0, H, 0); ceil.rotation.x = Math.PI / 2;
var back = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2); back.receiveShadow = true;
var front = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, D / 2); front.rotation.y = Math.PI;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2; left.receiveShadow = true;
var right = mesh(new THREE.PlaneGeometry(D, H), wallMat, W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2; right.receiveShadow = true;
// dado, skirting and a cornice, dark varnished
var woodMat = darkWood;
[[0, -D / 2 + 0.02, W, 0], [0, D / 2 - 0.02, W, Math.PI], [-W / 2 + 0.02, 0, D, Math.PI / 2], [W / 2 - 0.02, 0, D, -Math.PI / 2]].forEach(function(s) {
var sk = mesh(new THREE.BoxGeometry(s[2], 0.14, 0.035), woodMat, s[0], 0.07, s[1]); sk.rotation.y = s[3];
var dd = mesh(new THREE.BoxGeometry(s[2], 0.05, 0.04), oak, s[0], 0.95, s[1]); dd.rotation.y = s[3];
var cn = mesh(new THREE.BoxGeometry(s[2], 0.06, 0.08), new THREE.MeshStandardMaterial({ color: 0x5a5030, roughness: 0.9 }), s[0], H - 0.03, s[1]); cn.rotation.y = s[3];
});
// the door out, on the left wall near the front: the foul staircase is behind it
var doorG = new THREE.Group(); doorG.position.set(-W / 2 + 0.03, 0, 1.3); doorG.rotation.y = Math.PI / 2; scene.add(doorG);
mesh(new THREE.BoxGeometry(0.86, 2.0, 0.06), darkWood, 0, 1.0, 0, doorG);
mesh(new THREE.BoxGeometry(0.98, 0.09, 0.1), oak, 0, 2.04, 0, doorG); mesh(new THREE.BoxGeometry(0.07, 2.1, 0.1), oak, -0.49, 1.05, 0, doorG); mesh(new THREE.BoxGeometry(0.07, 2.1, 0.1), oak, 0.49, 1.05, 0, doorG);
mesh(new THREE.BoxGeometry(0.3, 0.7, 0.02), oak, -0.19, 1.45, 0.035, doorG); mesh(new THREE.BoxGeometry(0.3, 0.7, 0.02), oak, 0.19, 1.45, 0.035, doorG); mesh(new THREE.BoxGeometry(0.3, 0.6, 0.02), oak, -0.19, 0.5, 0.035, doorG); mesh(new THREE.BoxGeometry(0.3, 0.6, 0.02), oak, 0.19, 0.5, 0.035, doorG);
mesh(new THREE.SphereGeometry(0.03, 10, 8), brass, 0.34, 1.0, 0.06, doorG);
var membersTex = tex(256, 128, function(cx, w, h) { cx.fillStyle = '#e4d8b8'; cx.fillRect(0, 0, w, h); cx.strokeStyle = '#2a1a10'; cx.lineWidth = 3; cx.strokeRect(8, 8, w - 16, h - 16); cx.fillStyle = '#2a1a10'; cx.textAlign = 'center'; cx.font = 'bold 30px Georgia,serif'; cx.fillText('MEMBERS ONLY', w / 2, 56); cx.font = 'italic 17px Georgia,serif'; cx.fillText('and their guests, at her discretion', w / 2, 92); });
mesh(new THREE.PlaneGeometry(0.34, 0.17), new THREE.MeshStandardMaterial({ map: membersTex, roughness: 0.9 }), 0, 1.72, 0.045, doorG);

// ---------- THE PICTURES, crowding every wall ----------
var picG = new THREE.Group(); scene.add(picG);
var giltFrame = new THREE.MeshStandardMaterial({ color: 0xb99a50, roughness: 0.35, metalness: 0.7, envMap: roomEnv, envMapIntensity: 0.6 });
var frameMats = [giltFrame, new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.5, envMap: roomEnv, envMapIntensity: 0.2 }), oak];
// A sitter, drawn the way the French's photographs are: a coat, a collar, a lit cheek and the grain of the print.
function sitter(cx, px, py, scale, k, tone) {
cx.save(); cx.translate(px, py); cx.scale(scale, scale);
var coat = cx.createLinearGradient(-70, 0, 70, 140); coat.addColorStop(0, tone ? '#1a1612' : '#171c19'); coat.addColorStop(0.65, k % 2 ? '#4c4d44' : '#373b35'); coat.addColorStop(1, '#222822');
cx.fillStyle = coat; cx.beginPath(); cx.moveTo(-88, 185); cx.quadraticCurveTo(-95, 75, -35, 60); cx.lineTo(-17, 43); cx.lineTo(20, 41); cx.lineTo(36, 59); cx.quadraticCurveTo(88, 72, 91, 185); cx.closePath(); cx.fill();
cx.fillStyle = '#aea998'; cx.beginPath(); cx.moveTo(-18, 48); cx.lineTo(2, 106); cx.lineTo(23, 49); cx.lineTo(0, 62); cx.closePath(); cx.fill();
var face = cx.createRadialGradient(-12, -8, 1, 0, 7, 54); face.addColorStop(0, tone ? '#d8c0a0' : '#c9c4af'); face.addColorStop(0.45, tone ? '#a88868' : '#9b9b89'); face.addColorStop(1, '#494f43');
cx.fillStyle = face; cx.beginPath(); cx.moveTo(-31, -7); cx.bezierCurveTo(-37, -51, 36, -52, 33, -9); cx.lineTo(29, 28); cx.quadraticCurveTo(19, 54, 0, 50); cx.quadraticCurveTo(-28, 45, -30, 22); cx.closePath(); cx.fill();
cx.fillStyle = k % 3 === 0 ? '#76796a' : '#343c32'; cx.beginPath(); cx.moveTo(-31, 1); cx.quadraticCurveTo(-46, -52, 7, -43); cx.quadraticCurveTo(42, -44, 34, -1); cx.lineTo(24, -22); cx.quadraticCurveTo(4, -13, -15, -27); cx.lineTo(-24, -10); cx.closePath(); cx.fill();
cx.strokeStyle = 'rgba(27,35,29,0.65)'; cx.lineWidth = 2.4; cx.beginPath(); cx.moveTo(-22, 3); cx.lineTo(-8, 1); cx.moveTo(9, 2); cx.lineTo(23, 5); cx.moveTo(1, 5); cx.lineTo(-3, 24); cx.lineTo(7, 26); cx.moveTo(-9, 36); cx.quadraticCurveTo(1, 39, 13, 34); cx.stroke();
cx.fillStyle = 'rgba(23,28,23,0.6)'; cx.fillRect(-17, 7, 5, 3); cx.fillRect(14, 8, 4, 3);
if (k % 4 === 1) { cx.lineWidth = 1.5; cx.strokeRect(-24, 0, 19, 15); cx.strokeRect(8, 1, 18, 15); }
if (k % 5 === 2) { cx.fillStyle = 'rgba(30,25,20,0.8)'; cx.beginPath(); cx.moveTo(-36, -18); cx.quadraticCurveTo(0, -30, 38, -20); cx.lineTo(28, -26); cx.lineTo(24, -44); cx.quadraticCurveTo(0, -50, -22, -42); cx.lineTo(-28, -24); cx.closePath(); cx.fill(); }
cx.restore();
}
function pictureTex(seed) {
return tex(192, 192, function(cx, w, h) {
var kind = rnd(seed + 0.5);
if (kind < 0.32) { // a photograph, the sitter half in shadow
var g = cx.createLinearGradient(0, 0, w, h); g.addColorStop(0, ['#777369', '#6b665d', '#838074'][seed % 3]); g.addColorStop(1, '#24251f'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
cx.fillStyle = 'rgba(18,19,16,0.22)'; if (seed % 2) { for (var c = 0; c < 6; c++) cx.fillRect(c * 34, 0, 11, h); } else { cx.fillRect(10, 0, 7, h); cx.fillRect(w - 28, 0, 10, h); }
if (seed % 4 === 0) { sitter(cx, 60, 84, 0.55, seed); sitter(cx, 128, 92, 0.6, seed + 1); } else sitter(cx, 96, 80, 0.72, seed);
for (var i = 0; i < 9000; i++) { cx.fillStyle = i % 2 ? 'rgba(225,221,193,0.07)' : 'rgba(5,14,8,0.075)'; cx.fillRect(rnd(seed + i * 7) * w, rnd(seed + i * 11) * h, 1, 1); }
} else if (kind < 0.66) { // a painting: a figure or a face in thick strokes, the daubs of the room's painters
var cols = [['#8a2a1a', '#c8a030', '#2a4a7a', '#d8c8a0'], ['#1a1a1a', '#b05a6a', '#e8d8b0', '#5a7a2a'], ['#2a2a4a', '#d89a30', '#8a3a2a', '#c0c0b0']][seed % 3];
cx.fillStyle = cols[0]; cx.fillRect(0, 0, w, h);
for (var s = 0; s < 70; s++) { cx.strokeStyle = cols[(s + seed) % 4]; cx.globalAlpha = 0.5 + rnd(seed + s) * 0.5; cx.lineWidth = 5 + rnd(s * 3 + seed) * 14; cx.beginPath(); var x0 = rnd(seed + s * 5) * w, y0 = rnd(seed + s * 7) * h; cx.moveTo(x0, y0); cx.quadraticCurveTo(x0 + (rnd(s) - 0.5) * 60, y0 + (rnd(s + 1) - 0.5) * 60, x0 + (rnd(s + 2) - 0.5) * 70, y0 + (rnd(s + 3) - 0.5) * 70); cx.stroke(); }
cx.globalAlpha = 1;
if (seed % 2) { // a face, roughly
cx.fillStyle = cols[3]; cx.beginPath(); cx.ellipse(w * 0.5, h * 0.42, 34, 44, 0.1, 0, 6.3); cx.fill(); cx.fillStyle = cols[0]; cx.beginPath(); cx.arc(w * 0.42, h * 0.38, 5, 0, 6.3); cx.arc(w * 0.6, h * 0.37, 5, 0, 6.3); cx.fill(); cx.strokeStyle = cols[2]; cx.lineWidth = 6; cx.beginPath(); cx.moveTo(w * 0.42, h * 0.58); cx.quadraticCurveTo(w * 0.5, h * 0.66, w * 0.6, h * 0.57); cx.stroke();
} else { // a nude or a figure, a long stroke
cx.strokeStyle = cols[3]; cx.lineWidth = 18; cx.beginPath(); cx.moveTo(w * 0.35, h * 0.2); cx.quadraticCurveTo(w * 0.7, h * 0.4, w * 0.4, h * 0.65); cx.quadraticCurveTo(w * 0.3, h * 0.85, w * 0.65, h * 0.92); cx.stroke();
}
for (var i = 0; i < 2000; i++) { cx.fillStyle = 'rgba(255,255,255,' + rnd(i + seed) * 0.05 + ')'; cx.fillRect(rnd(i) * w, rnd(i + 3) * h, 2, 1); }
} else { // a drawing on paper: a head in pen, a few lines
cx.fillStyle = '#d8ccb0'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 3000; i++) { cx.fillStyle = 'rgba(90,70,40,0.05)'; cx.fillRect(rnd(seed + i) * w, rnd(seed + i * 3) * h, 1, 1); }
cx.strokeStyle = 'rgba(30,20,10,0.8)'; cx.lineWidth = 1.4; cx.save(); cx.translate(96, 90); cx.rotate((rnd(seed) - 0.5) * 0.3);
cx.beginPath(); cx.moveTo(-30, -10); cx.bezierCurveTo(-36, -50, 36, -52, 32, -8); cx.quadraticCurveTo(38, 10, 24, 34); cx.quadraticCurveTo(8, 56, -10, 48); cx.quadraticCurveTo(-30, 36, -30, -10); cx.stroke();
cx.beginPath(); cx.moveTo(-20, -2); cx.lineTo(-6, -4); cx.moveTo(8, -4); cx.lineTo(22, -2); cx.moveTo(2, 0); cx.lineTo(-2, 18); cx.lineTo(8, 20); cx.moveTo(-10, 32); cx.quadraticCurveTo(2, 36, 14, 30); cx.stroke();
cx.globalAlpha = 0.4; for (var n = 0; n < 12; n++) { cx.beginPath(); cx.moveTo(-28 + n * 2, 10 + n); cx.lineTo(-18 + n * 2, 6 + n); cx.stroke(); } cx.globalAlpha = 1;
for (var n = 0; n < 24; n++) { var xx = -32 + n * 2.6, yy = -18 - Math.sqrt(Math.max(0, 900 - xx * xx)) * 0.5; cx.beginPath(); cx.moveTo(xx, yy + 6); cx.quadraticCurveTo(xx - 5, yy - 8, xx + 6, yy - 6); cx.stroke(); }
cx.restore();
cx.font = 'italic 10px Georgia,serif'; cx.fillStyle = 'rgba(60,40,20,0.7)'; cx.fillText(['for Muriel', 'Colony, Tues.', 'after closing'][seed % 3], 96, 176);
}
var g2 = cx.createLinearGradient(0, 0, w, h); g2.addColorStop(0, 'rgba(255,240,200,0.12)'); g2.addColorStop(1, 'rgba(0,0,0,0.28)'); cx.fillStyle = g2; cx.fillRect(0, 0, w, h);
});
}
var picN = 0;
function hang(x, y, z, ry, w, h, seed) {
var g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; picG.add(g);
var fm = frameMats[(seed * 5 | 0) % 3];
mesh(new THREE.BoxGeometry(w + 0.07, h + 0.07, 0.035), fm, 0, 0, 0.017, g);
mesh(new THREE.BoxGeometry(w + 0.02, h + 0.02, 0.01), new THREE.MeshStandardMaterial({ color: 0xd8cfb4, roughness: 0.9 }), 0, 0, 0.036, g);
mesh(new THREE.PlaneGeometry(w - 0.03, h - 0.03), new THREE.MeshStandardMaterial({ map: pictureTex(seed), roughness: 0.75, envMap: roomEnv, envMapIntensity: 0.15 }), 0, 0, 0.042, g);
g.rotation.z = (rnd(seed + 99) - 0.5) * 0.06;
picN++;
}
var wallsToHang = [
{ x0: -W / 2 + 0.3, x1: W / 2 - 0.3, z: -D / 2 + 0.005, ry: 0, axis: 'x' },
{ x0: -D / 2 + 0.3, x1: D / 2 - 0.9, z: W / 2 - 0.005, ry: -Math.PI / 2, axis: 'z' },
{ x0: -W / 2 + 0.3, x1: W / 2 - 1.5, z: D / 2 - 0.005, ry: Math.PI, axis: 'x' },
{ x0: -D / 2 + 0.3, x1: D / 2 - 1.6, z: -W / 2 + 0.005, ry: Math.PI / 2, axis: 'z' }
];
var seedP = 3;
wallsToHang.forEach(function(wd, wi) {
var u = wd.x0;
while (u < wd.x1) {
var col = (rnd(seedP) * 3 | 0) + 2, cw = 0.22 + rnd(seedP + 1) * 0.3;
var y = 1.25;
for (var r = 0; r < col; r++) {
var ch = 0.18 + rnd(seedP + r + 2) * 0.28;
if (y + ch / 2 > H - 0.15) break;
if (wd.axis === 'x') hang(u + cw / 2, y + ch / 2, wd.z, wd.ry, cw, ch, seedP + r);
else hang(wd.z, y + ch / 2, (wd.ry > 0 ? -1 : 1) * (u + cw / 2), wd.ry, cw, ch, seedP + r);
y += ch + 0.07 + rnd(seedP + r + 5) * 0.06;
}
u += cw + 0.06 + rnd(seedP + 9) * 0.08; seedP += 4;
}
});

// ---------- THE BAR, small, bamboo-fronted, along the back wall on the left ----------
var barG = new THREE.Group(); scene.add(barG);
var bamboo = tex(256, 256, function(cx, w, h) {
cx.fillStyle = '#b89a58'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 12; i++) {
var x = i * 21.5, g = cx.createLinearGradient(x, 0, x + 20, 0); g.addColorStop(0, '#8a6c34'); g.addColorStop(0.3, i % 2 ? '#d4b874' : '#c4a660'); g.addColorStop(0.55, '#e0c88a'); g.addColorStop(1, '#8a6c34'); cx.fillStyle = g; cx.fillRect(x, 0, 20, h);
cx.fillStyle = 'rgba(70,45,15,0.75)'; for (var y = 12 + rnd(i) * 30; y < h; y += 44 + rnd(i + y) * 26) { cx.fillRect(x, y, 20, 3); cx.fillStyle = 'rgba(240,220,160,0.4)'; cx.fillRect(x, y + 3, 20, 1); cx.fillStyle = 'rgba(70,45,15,0.75)'; }
cx.fillStyle = 'rgba(0,0,0,0.35)'; cx.fillRect(x + 20, 0, 1.5, h);
for (var s = 0; s < 40; s++) { cx.fillStyle = 'rgba(60,40,10,' + rnd(s + i) * 0.2 + ')'; cx.fillRect(x + rnd(s * 3 + i) * 20, rnd(s * 5 + i) * h, 1, 4 + rnd(s) * 12); }
}
});
bamboo.wrapS = bamboo.wrapT = THREE.RepeatWrapping; bamboo.repeat.set(3, 1);
var bambooMat = new THREE.MeshStandardMaterial({ map: bamboo, bumpMap: bamboo, bumpScale: 0.006, roughness: 0.55, envMap: roomEnv, envMapIntensity: 0.3 });
var counterMat = new THREE.MeshStandardMaterial({ map: grainB, bumpMap: grainB, bumpScale: 0.002, roughness: 0.32, metalness: 0.06, envMap: roomEnv, envMapIntensity: 0.65 });
var barX0 = -W / 2, barX1 = -0.55, barZ = -D / 2 + 0.7, barLen = barX1 - barX0, barMidX = (barX0 + barX1) / 2;
var body = mesh(new THREE.BoxGeometry(barLen, 1.05, 0.55), bambooMat, barMidX, 0.525, barZ, barG); body.castShadow = true; body.receiveShadow = true;
mesh(new THREE.BoxGeometry(barLen, 0.05, 0.57), darkWood, barMidX, 0.025, barZ, barG); mesh(new THREE.BoxGeometry(barLen, 0.04, 0.58), darkWood, barMidX, 1.03, barZ, barG);
var top = mesh(new THREE.BoxGeometry(barLen + 0.08, 0.05, 0.66), counterMat, barMidX, 1.075, barZ, barG); top.receiveShadow = true; top.castShadow = true;
mesh(new THREE.BoxGeometry(barLen + 0.08, 0.05, 0.03), brass, barMidX, 1.075, barZ + 0.33, barG);
var rail = mesh(new THREE.CylinderGeometry(0.018, 0.018, barLen, 10), brass, barMidX, 0.2, barZ + 0.4, barG); rail.rotation.z = Math.PI / 2;
// the back bar: a real mirror gone smoky at the edges, two shelves of bottles, the till, the green lamp
var mir = mesh(new THREE.PlaneGeometry(barLen - 0.2, 0.9), null, barMidX, 1.65, -D / 2 + 0.012);
mirrors.push(makeMirror(mir, new THREE.Vector3(0, 0, 1), portrait ? 512 : 1024, new THREE.Vector3(0.64, 0.68, 0.56), { edge: '0.12' }));
mesh(new THREE.BoxGeometry(barLen - 0.1, 1.0, 0.03), oak, barMidX, 1.65, -D / 2 + 0.008, barG);
mesh(new THREE.BoxGeometry(0.06, 1.2, 0.2), oak, barX1 + 0.05, 1.7, -D / 2 + 0.1, barG); mesh(new THREE.BoxGeometry(0.06, 1.2, 0.2), oak, barX0 + 0.03, 1.7, -D / 2 + 0.1, barG);
var giltTex = tex(1024, 128, function(cx, w, h) { cx.clearRect(0, 0, w, h); cx.font = 'bold 40px Georgia,serif'; cx.textAlign = 'center'; cx.fillStyle = 'rgba(214,176,90,0.8)'; cx.fillText('THE COLONY ROOM CLUB', w / 2, 58); cx.font = 'italic 20px Georgia,serif'; cx.fillStyle = 'rgba(214,176,90,0.65)'; cx.fillText('41 Dean Street · first floor · members', w / 2, 96); });
mesh(new THREE.PlaneGeometry(barLen - 0.5, 0.26), new THREE.MeshBasicMaterial({ map: giltTex, transparent: true, depthWrite: false, toneMapped: false, opacity: 0.9 }), barMidX, 1.92, -D / 2 + 0.02);
var shelfMat = shelfWood;
var botCols = [0x2a5a2a, 0x7a4a18, 0x1a2a5a, 0x8a7a20, 0x4a1a1a, 0x2a4a3a, 0xa08030, 0x3a2a1a, 0x6a3a10];
function bottle(x, y, z, col, h, r, parent) {
var g = new THREE.Group(); g.position.set(x, y, z);
var bm = new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.17, metalness: 0.04, envMap: roomEnv, envMapIntensity: 0.8, clearcoat: 0.85, clearcoatRoughness: 0.12, transparent: true, opacity: 0.88 });
mesh(new THREE.CylinderGeometry(r, r, h, 10), bm, 0, h / 2, 0, g);
mesh(new THREE.CylinderGeometry(r * 0.35, r * 0.6, h * 0.35, 8), bm, 0, h + h * 0.16, 0, g);
mesh(new THREE.CylinderGeometry(r * 0.36, r * 0.36, 0.03, 8), rnd(x * 7 + z) < 0.5 ? brass : new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.3 }), 0, h + h * 0.34, 0, g);
if (rnd(z * 3 + x) < 0.7) mesh(new THREE.PlaneGeometry(r * 1.6, h * 0.42), new THREE.MeshStandardMaterial({ color: [0xe8dcc0, 0xc8b890, 0x1a1a1a][(rnd(x + z * 5) * 3) | 0], roughness: 0.9 }), 0, h * 0.45, r + 0.002, g);
(parent || scene).add(g); return g;
}
[1.28, 1.72].forEach(function(sy, si) {
mesh(new THREE.BoxGeometry(barLen - 0.2, 0.03, [0.26, 0.2][si]), shelfMat, barMidX, sy, -D / 2 + [0.14, 0.11][si], barG);
var n = 11 + si * 2;
for (var i = 0; i < n; i++) {
if (rnd(si * 40 + i) < 0.14) continue;
bottle(barX0 + 0.15 + i * ((barLen - 0.4) / n) + (rnd(i + si * 9) - 0.5) * 0.04, sy + 0.015, -D / 2 + [0.14, 0.11][si] + (rnd(i * 3 + si) - 0.5) * 0.05, botCols[(i + si * 4) % botCols.length], 0.2 + rnd(i + si * 30) * 0.13, 0.028 + rnd(i * 2 + si) * 0.012, barG);
}
});
for (var o = 0; o < 4; o++) bottle(barX0 + 0.5 + o * 0.45, 1.69, -D / 2 + 0.16, botCols[(o * 5) % botCols.length], 0.2, 0.028, barG).rotation.x = Math.PI;
var till = mesh(new THREE.BoxGeometry(0.34, 0.26, 0.3), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.5, envMap: roomEnv, envMapIntensity: 0.4 }), barX1 - 0.45, 1.23, -D / 2 + 0.22, barG);
mesh(new THREE.BoxGeometry(0.3, 0.06, 0.1), new THREE.MeshStandardMaterial({ color: 0x3a4a3a, emissive: 0x2a6a3a, emissiveIntensity: 0.5 }), barX1 - 0.45, 1.39, -D / 2 + 0.12, barG);
// a soda syphon, a bar towel, a bowl and the night's glasses
var syphon = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.24, 14), new THREE.MeshPhysicalMaterial({ color: 0x8ab0c0, roughness: 0.1, transparent: true, opacity: 0.6, envMap: roomEnv, envMapIntensity: 1, clearcoat: 1 }), barX0 + 0.5, 1.22, barZ - 0.12, barG);
mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.06, 12), new THREE.MeshStandardMaterial({ color: 0xc8c8c0, roughness: 0.3, metalness: 0.8, envMap: roomEnv, envMapIntensity: 0.7 }), barX0 + 0.5, 1.37, barZ - 0.12, barG);
mesh(new THREE.BoxGeometry(0.26, 0.012, 0.18), new THREE.MeshStandardMaterial({ color: 0x1e4a2a, roughness: 0.95 }), barX0 + 0.95, 1.106, barZ + 0.08, barG);
var glassMat = new THREE.MeshPhysicalMaterial({ color: 0xf0eadc, roughness: 0.09, metalness: 0.04, envMap: roomEnv, envMapIntensity: 1.1, clearcoat: 1, transparent: true, opacity: 0.34 });
var ginMat = new THREE.MeshStandardMaterial({ color: 0xe8f0e0, roughness: 0.1, transparent: true, opacity: 0.5, emissive: 0x304030, emissiveIntensity: 0.2 });
function tumbler(x, y, z, fill, parent) {
var g = new THREE.Group(); g.position.set(x, y, z); (parent || scene).add(g);
var b = mesh(new THREE.CylinderGeometry(0.034, 0.03, 0.1, 14, 1, true), glassMat, 0, 0.05, 0, g); b.material = glassMat.clone(); b.material.side = THREE.DoubleSide;
mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.006, 14), glassMat, 0, 0.003, 0, g);
if (fill > 0) mesh(new THREE.CylinderGeometry(0.03, 0.029, 0.09 * fill, 14), ginMat, 0, 0.006 + 0.045 * fill, 0, g);
return g;
}
tumbler(-1.5, 1.1, barZ + 0.1, 0.5, barG); tumbler(-2.2, 1.1, barZ + 0.14, 0, barG); tumbler(-0.95, 1.1, barZ - 0.05, 0.8, barG);
var ashMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.3, metalness: 0.2, envMap: roomEnv, envMapIntensity: 0.4 });
mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.02, 16), ashMat, -0.9, 1.11, barZ + 0.12, barG);
// bamboo stools, a bent back on each
var stoolG = new THREE.Group(); scene.add(stoolG);
var seatMat = new THREE.MeshStandardMaterial({ color: 0x5a2a20, roughness: 0.65, envMap: roomEnv, envMapIntensity: 0.15 });
var stools = [];
function stool(x, z) {
var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rnd(x + z) * 6; stoolG.add(g);
[[-0.13, -0.13], [0.13, -0.13], [-0.13, 0.13], [0.13, 0.13]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.62, 8), bambooMat, l[0], 0.31, l[1], g); });
mesh(new THREE.TorusGeometry(0.14, 0.01, 6, 20), bambooMat, 0, 0.2, 0, g).rotation.x = Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.04, 18), seatMat, 0, 0.64, 0, g).castShadow = true;
var bk = mesh(new THREE.TorusGeometry(0.15, 0.011, 6, 20, Math.PI), bambooMat, 0, 0.88, 0, g); bk.rotation.x = Math.PI / 2; bk.rotation.z = Math.PI;
mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.26, 6), bambooMat, -0.15, 0.77, 0, g); mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.26, 6), bambooMat, 0.15, 0.77, 0, g);
stools.push(g); return g;
}
stool(-2.05, barZ + 0.62); stool(-1.35, barZ + 0.62);

// ---------- THE TELEPHONE, at the end of the bar ----------
var phoneG = new THREE.Group(); phoneG.position.set(barX1 - 0.12, 1.1, barZ - 0.1); phoneG.rotation.y = -0.3; scene.add(phoneG);
var bakelite = new THREE.MeshStandardMaterial({ color: 0x16120f, roughness: 0.26, metalness: 0.08, envMap: roomEnv, envMapIntensity: 0.55 });
mesh(new THREE.BoxGeometry(0.2, 0.09, 0.17), bakelite, 0, 0.045, 0, phoneG);
mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.02, 20), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.5 }), 0.02, 0.1, 0.03, phoneG);
var hs = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.2, 10), bakelite, 0, 0.14, -0.02, phoneG); hs.rotation.z = Math.PI / 2;
mesh(new THREE.SphereGeometry(0.032, 10, 8), bakelite, -0.1, 0.13, -0.02, phoneG); mesh(new THREE.SphereGeometry(0.032, 10, 8), bakelite, 0.1, 0.13, -0.02, phoneG);
// the knotted cord
for (var ck = 0; ck < 6; ck++) mesh(new THREE.TorusGeometry(0.014, 0.004, 5, 10), bakelite, -0.13 - ck * 0.02, 0.02 + (ck % 2) * 0.01, 0.06 + ck * 0.015, phoneG).rotation.x = ck * 0.7;
var phoneHit = mesh(new THREE.BoxGeometry(0.34, 0.3, 0.3), new THREE.MeshBasicMaterial({ visible: false }), 0, 0.12, 0, phoneG);

// ---------- THE PIANO, upright, against the right wall ----------
var pianoG = new THREE.Group(); pianoG.position.set(W / 2 - 0.34, 0, -0.55); pianoG.rotation.y = -Math.PI / 2; scene.add(pianoG);
var pianoMat = new THREE.MeshStandardMaterial({ map: grainB, bumpMap: grainB, bumpScale: 0.002, roughness: 0.22, metalness: 0.08, envMap: roomEnv, envMapIntensity: 0.7 });
var pb = mesh(new THREE.BoxGeometry(1.4, 1.25, 0.6), pianoMat, 0, 0.625, 0, pianoG); pb.castShadow = true; pb.receiveShadow = true;
mesh(new THREE.BoxGeometry(1.44, 0.05, 0.64), pianoMat, 0, 1.275, 0, pianoG);
mesh(new THREE.BoxGeometry(1.36, 0.5, 0.02), oak, 0, 1.0, 0.305, pianoG); mesh(new THREE.BoxGeometry(0.5, 0.36, 0.012), darkWood, -0.35, 1.0, 0.318, pianoG); mesh(new THREE.BoxGeometry(0.5, 0.36, 0.012), darkWood, 0.35, 1.0, 0.318, pianoG);
mesh(new THREE.BoxGeometry(1.42, 0.04, 0.34), pianoMat, 0, 0.82, 0.3, pianoG);
var ivoryMat = new THREE.MeshStandardMaterial({ color: 0xe8dcb8, roughness: 0.35, envMap: roomEnv, envMapIntensity: 0.25 });
for (var k = 0; k < 36; k++) mesh(new THREE.BoxGeometry(0.031, 0.02, 0.14), ivoryMat, -0.6 + k * 0.034, 0.845, 0.36, pianoG);
for (var k = 0; k < 36; k++) if (k % 7 !== 2 && k % 7 !== 5 && k < 35) mesh(new THREE.BoxGeometry(0.018, 0.014, 0.08), bakelite, -0.583 + k * 0.034, 0.862, 0.33, pianoG);
mesh(new THREE.BoxGeometry(1.3, 0.16, 0.02), oak, 0, 1.12, 0.31, pianoG);
var scoreTex = tex(256, 192, function(cx, w, h) { cx.fillStyle = '#eee6cc'; cx.fillRect(0, 0, w, h); cx.strokeStyle = '#3a3020'; cx.lineWidth = 1; for (var s = 0; s < 4; s++) for (var l = 0; l < 5; l++) { cx.beginPath(); cx.moveTo(16, 30 + s * 40 + l * 5); cx.lineTo(w - 16, 30 + s * 40 + l * 5); cx.stroke(); } cx.fillStyle = '#2a2018'; for (var n = 0; n < 60; n++) { cx.beginPath(); cx.ellipse(24 + rnd(n) * (w - 48), 30 + (rnd(n + 1) * 4 | 0) * 40 + rnd(n + 2) * 20, 3.2, 2.4, -0.4, 0, 6.3); cx.fill(); cx.fillRect(27 + rnd(n) * (w - 48), 12 + (rnd(n + 1) * 4 | 0) * 40 + rnd(n + 2) * 20, 1, 18); } cx.font = 'italic 11px Georgia,serif'; cx.fillText('Lento, come una memoria', 20, 16); });
var score = mesh(new THREE.PlaneGeometry(0.34, 0.26), new THREE.MeshStandardMaterial({ map: scoreTex, roughness: 0.9, side: THREE.DoubleSide }), -0.1, 1.15, 0.325, pianoG); score.rotation.x = -0.12;
// a candle in a bottle, wax down the glass, and an empty glass on top
bottle(0.45, 1.3, 0, 0x1e3a1e, 0.22, 0.03, pianoG);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), new THREE.MeshStandardMaterial({ color: 0xf0e8d0, roughness: 0.9 }), 0.45, 1.6, 0, pianoG);
mesh(new THREE.CylinderGeometry(0.02, 0.034, 0.05, 10), new THREE.MeshStandardMaterial({ color: 0xf0e8d0, roughness: 0.9 }), 0.45, 1.545, 0, pianoG);
var candle = new THREE.PointLight(0xffb060, 0.5, 2.2); candle.position.set(0.45, 1.7, 0); pianoG.add(candle);
var flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(32, 32, function(cx, w, h) { var g = cx.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,230,160,1)'); g.addColorStop(0.4, 'rgba(255,170,60,0.6)'); g.addColorStop(1, 'rgba(255,120,20,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); }), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
flame.scale.set(0.09, 0.14, 1); flame.position.set(0.45, 1.69, 0); pianoG.add(flame);
tumbler(-0.4, 1.3, 0.05, 0.2, pianoG);
bottle(-0.62, 1.3, -0.1, 0x7a4a18, 0.24, 0.032, pianoG);
// the piano stool, and the pedals
var pst = mesh(new THREE.BoxGeometry(0.5, 0.06, 0.32), seatMat, 0, 0.5, 0.75, pianoG);
[[-0.2, 0.62], [0.2, 0.62], [-0.2, 0.88], [0.2, 0.88]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), pianoMat, l[0], 0.25, l[1], pianoG); });
mesh(new THREE.BoxGeometry(0.04, 0.02, 0.1), brass, -0.08, 0.06, 0.33, pianoG); mesh(new THREE.BoxGeometry(0.04, 0.02, 0.1), brass, 0.08, 0.06, 0.33, pianoG);

// ---------- THE WINDOW, onto Dean Street, on the right wall by the front ----------
var winG = new THREE.Group(); winG.position.set(W / 2 - 0.02, 1.55, 1.15); winG.rotation.y = -Math.PI / 2; scene.add(winG);
var winTex = tex(256, 384, function(cx, w, h) {
var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#141a2a'); g.addColorStop(0.5, '#2a2c34'); g.addColorStop(0.8, '#3a3020'); g.addColorStop(1, '#1a1610'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
// the houses opposite, their lit windows, the lamp, the wet street below
cx.fillStyle = '#1e1c1a'; cx.fillRect(0, 40, w, 230); for (var f = 0; f < 3; f++) for (var c = 0; c < 4; c++) { var lit = rnd(f * 4 + c) < 0.45; cx.fillStyle = lit ? ['#e8c070', '#d8a050', '#b04030'][(f + c) % 3] : '#0c0a08'; cx.fillRect(18 + c * 60, 60 + f * 66, 30, 44); if (lit) { cx.fillStyle = 'rgba(255,255,255,0.25)'; cx.fillRect(18 + c * 60 + 13, 60 + f * 66, 4, 44); } }
var lg = cx.createRadialGradient(150, 250, 0, 150, 250, 70); lg.addColorStop(0, 'rgba(255,214,150,0.85)'); lg.addColorStop(0.15, 'rgba(255,200,120,0.4)'); lg.addColorStop(1, 'rgba(255,200,120,0)'); cx.fillStyle = lg; cx.fillRect(0, 0, w, h);
cx.fillStyle = '#ffe6bb'; cx.fillRect(146, 246, 8, 10); cx.fillStyle = '#111'; cx.fillRect(149, 256, 2, 80);
cx.fillStyle = 'rgba(255,214,150,0.2)'; cx.fillRect(140, 300, 20, 84);
// the net curtain
cx.fillStyle = 'rgba(236,228,205,0.3)'; for (var i = 0; i < 12; i++) cx.fillRect(4 + i * 21 + Math.sin(i) * 3, 0, 5, h);
cx.fillStyle = 'rgba(236,228,205,0.12)'; cx.fillRect(0, 0, w, h);
});
var winPane = mesh(new THREE.PlaneGeometry(1.0, 1.4), new THREE.MeshBasicMaterial({ map: winTex, toneMapped: false }), 0, 0, 0, winG);
var sashMat = new THREE.MeshStandardMaterial({ map: paintTex('#cfc4a4', 41), roughness: 0.7 });
mesh(new THREE.BoxGeometry(1.14, 0.07, 0.08), sashMat, 0, 0.72, 0.03, winG); mesh(new THREE.BoxGeometry(1.14, 0.1, 0.14), sashMat, 0, -0.74, 0.06, winG);
mesh(new THREE.BoxGeometry(0.07, 1.5, 0.08), sashMat, -0.535, 0, 0.03, winG); mesh(new THREE.BoxGeometry(0.07, 1.5, 0.08), sashMat, 0.535, 0, 0.03, winG);
mesh(new THREE.BoxGeometry(1.04, 0.05, 0.06), sashMat, 0, 0, 0.03, winG); mesh(new THREE.BoxGeometry(0.04, 1.4, 0.05), sashMat, 0, 0, 0.03, winG);
bottle(0.3, -0.69, 0.06, 0x2a5a2a, 0.18, 0.026, winG); tumbler(-0.25, -0.69, 0.06, 0, winG);
var winGlow = new THREE.PointLight(0x8090b0, 0.35, 3.5, 1.6); winGlow.position.set(W / 2 - 0.5, 1.55, 1.15); scene.add(winGlow);

// ---------- THE AGENT'S TABLE, bamboo, by the window ----------
var tableG = new THREE.Group(); tableG.position.set(1.35, 0, 0.75); scene.add(tableG);
mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.03, 24), counterMat, 0, 0.72, 0, tableG).castShadow = true;
mesh(new THREE.TorusGeometry(0.33, 0.012, 6, 32), bambooMat, 0, 0.735, 0, tableG).rotation.x = Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.7, 10), bambooMat, 0, 0.36, 0, tableG);
mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 16), bambooMat, 0, 0.02, 0, tableG);
tumbler(0.1, 0.735, 0.06, 0.6, tableG); tumbler(-0.12, 0.735, -0.08, 0.3, tableG);
mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.018, 16), ashMat, -0.02, 0.744, 0.16, tableG);
var paper = mesh(new THREE.BoxGeometry(0.22, 0.008, 0.3), new THREE.MeshStandardMaterial({ color: 0xcfc4a6, roughness: 0.95 }), 0.14, 0.739, -0.14, tableG); paper.rotation.y = 0.5;
var hat = mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.09, 16), new THREE.MeshStandardMaterial({ color: 0x2a2620, roughness: 0.95 }), -0.18, 0.78, 0.14, tableG); mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.012, 16), new THREE.MeshStandardMaterial({ color: 0x2a2620, roughness: 0.95 }), -0.18, 0.74, 0.14, tableG);
function chair(x, z, ry) {
var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; tableG.add(g);
[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.46, 8), bambooMat, l[0], 0.23, l[1], g); });
mesh(new THREE.BoxGeometry(0.42, 0.04, 0.42), seatMat, 0, 0.47, 0, g);
mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.5, 8), bambooMat, -0.18, 0.72, -0.18, g); mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.5, 8), bambooMat, 0.18, 0.72, -0.18, g);
mesh(new THREE.BoxGeometry(0.4, 0.05, 0.03), bambooMat, 0, 0.95, -0.18, g); mesh(new THREE.BoxGeometry(0.4, 0.03, 0.03), bambooMat, 0, 0.8, -0.18, g);
}
chair(0, -0.5, 0); chair(0.55, 0.05, -Math.PI / 2);
// a coat stand in the corner by the door, with what the night left on it
var standG = new THREE.Group(); standG.position.set(-W / 2 + 0.35, 0, 1.85); scene.add(standG);
mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.8, 8), darkWood, 0, 0.9, 0, standG); mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.03, 16), darkWood, 0, 0.015, 0, standG);
for (var hk = 0; hk < 4; hk++) { var a = hk * Math.PI / 2; mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.16, 6), brass, Math.cos(a) * 0.08, 1.72, Math.sin(a) * 0.08, standG).rotation.set(Math.sin(a) * 0.9, 0, Math.cos(a) * 0.9); }
var coat = mesh(new THREE.BoxGeometry(0.28, 0.85, 0.16), new THREE.MeshStandardMaterial({ color: 0x3a2a24, roughness: 0.95 }), 0.12, 1.28, 0.06, standG); coat.rotation.y = 0.4; coat.castShadow = true;
mesh(new THREE.BoxGeometry(0.2, 0.5, 0.1), new THREE.MeshStandardMaterial({ color: 0x6a1e1e, roughness: 0.95 }), -0.1, 1.45, -0.08, standG);

// ---------- THE FIGURES, faint traces ----------
function ghostTex(seed, seated) {
return tex(96, 192, function(cx, w, h) {
try { cx.filter = 'blur(2.5px)'; } catch (e) {}
var hx = 48 + (rnd(seed) - 0.5) * 8, hy = seated ? 58 : 38, hr = 14 + rnd(seed + 1) * 3;
cx.fillStyle = 'rgba(210,225,180,0.6)';
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
var davy = ghost(-1.35, barZ + 0.62, 0, 0.38, false);        // the man at the bar, on the second stool
var agent = ghost(1.35, 0.25, 2, 0.34, true);               // the agent, at his table, with his back half to the room
var pianist = ghost(W / 2 - 1.1, -0.55, 4, 0.22, true);     // someone at the piano, not playing

// ---------- LIGHT: dim, greenish, a shaded pendant, a green lamp over the bar, the candle ----------
scene.add(new THREE.AmbientLight(0x3a4a2a, 0.5));
scene.add(new THREE.HemisphereLight(0x8a9a50, 0x101408, 0.32));
var glowTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,225,160,0.9)'); g.addColorStop(0.3, 'rgba(255,190,100,0.35)'); g.addColorStop(0.7, 'rgba(220,140,50,0.08)'); g.addColorStop(1, 'rgba(180,100,30,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function glow(x, y, z, sc, op, col) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: col || 0xffffff, transparent: true, opacity: op || 0.6, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, fog: false, toneMapped: false })); sp.scale.set(sc, sc, 1); sp.position.set(x, y, z); scene.add(sp); return sp; }
var pend = new THREE.PointLight(0xffd090, 1.2, 7, 1.6); pend.position.set(0.2, H - 0.45, -0.2); pend.castShadow = true; pend.shadow.mapSize.set(1024, 1024); pend.shadow.bias = -0.001; pend.shadow.normalBias = 0.02; pend.shadow.radius = 3; scene.add(pend);
mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.35, 6), bakelite, 0.2, H - 0.18, -0.2);
var shadeTex = paintTex('#7a6a28', 51, 'rgba(220,190,80,0.2)');
var shade = mesh(new THREE.ConeGeometry(0.28, 0.22, 24, 1, true), new THREE.MeshStandardMaterial({ map: shadeTex, roughness: 0.8, side: THREE.DoubleSide, emissive: 0x4a3a10, emissiveIntensity: 0.6 }), 0.2, H - 0.36, -0.2);
mesh(new THREE.TorusGeometry(0.28, 0.008, 6, 24), brass, 0.2, H - 0.47, -0.2).rotation.x = Math.PI / 2;
mesh(new THREE.SphereGeometry(0.06, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffe8b0, toneMapped: false }), 0.2, H - 0.45, -0.2);
var pendGlow = glow(0.2, H - 0.47, -0.2, 1.2, 0.5);
// the banker's lamp at the end of the bar, green glass on a brass stem
var barLamp = new THREE.PointLight(0xc8ff90, 0.7, 3.2, 1.6); barLamp.position.set(-1.6, 1.95, -D / 2 + 0.5); scene.add(barLamp);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), brass, -1.6, 1.9, -D / 2 + 0.06);
mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.42, 6), brass, -1.6, 2.02, -D / 2 + 0.27).rotation.x = Math.PI / 2;
var greenShade = mesh(new THREE.SphereGeometry(0.13, 18, 12, 0, 6.3, 0, 1.7), new THREE.MeshPhysicalMaterial({ color: 0x2a7a2a, roughness: 0.3, emissive: 0x1a5a1a, emissiveIntensity: 0.9, side: THREE.DoubleSide, envMap: roomEnv, envMapIntensity: 0.5, clearcoat: 0.8 }), -1.6, 2.0, -D / 2 + 0.5);
mesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: 0xf0ffd0, toneMapped: false }), -1.6, 1.95, -D / 2 + 0.5);
var barGlow = glow(-1.6, 1.93, -D / 2 + 0.5, 0.8, 0.45, 0xc8ffa0);
var candleGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false })); candleGlow.scale.set(0.5, 0.5, 1); candleGlow.position.set(0.45, 1.7, 0); pianoG.add(candleGlow);
// contact shadows, static shadow map
var contactTex = tex(64, 64, function(cx, w, h) { var g = cx.createRadialGradient(32, 32, 3, 32, 32, 32); g.addColorStop(0, 'rgba(0,0,0,0.36)'); g.addColorStop(0.45, 'rgba(0,0,0,0.2)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function contact(x, z, s) { var sh = mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false }), x, 0.004, z); sh.rotation.x = -Math.PI / 2; return sh; }
stools.forEach(function(st) { contact(st.position.x, st.position.z, 0.8); });
contact(1.35, 0.75, 1.2); contact(1.35, 0.25, 0.9); contact(-W / 2 + 0.35, 1.85, 0.6);
renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true;
// smoke in the lamplight: haze under the shades, specks only in their pools
var hazeTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(200,190,140,0.2)'); g.addColorStop(0.35, 'rgba(160,150,100,0.12)'); g.addColorStop(1, 'rgba(100,90,60,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var haze = [[0.2, 1.75, -0.2, 2.6, 1.6], [-1.6, 1.5, -D / 2 + 0.6, 1.6, 1.1]].map(function(p) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTex, transparent: true, opacity: 0.14, depthWrite: false, blending: THREE.AdditiveBlending })); sp.position.set(p[0], p[1], p[2]); sp.scale.set(p[3], p[4], 1); scene.add(sp); return sp; });
var dustTex = tex(32, 32, function(cx, w, h) { var g = cx.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,237,197,0.85)'); g.addColorStop(0.22, 'rgba(255,237,197,0.4)'); g.addColorStop(1, 'rgba(255,237,197,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var moteN = 64, moteBase = new Float32Array(moteN * 3), motePos = new Float32Array(moteN * 3);
for (var mi = 0; mi < moteN; mi++) { var lp = mi % 3 ? [0.2, -0.2] : [-1.6, -D / 2 + 0.5], angle = rnd(mi * 7) * Math.PI * 2, radius = 0.15 + rnd(mi * 11) * 1.0; moteBase[mi * 3] = lp[0] + Math.cos(angle) * radius; moteBase[mi * 3 + 1] = 0.6 + rnd(mi + 1) * 1.7; moteBase[mi * 3 + 2] = lp[1] + Math.sin(angle) * radius * 0.7; }
motePos.set(moteBase);
var moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
scene.add(new THREE.Points(moteGeo, new THREE.PointsMaterial({ map: dustTex, color: 0xd8e8b0, size: 0.018, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending })));

// ---------- THE CLOSE-UPS, AND THE PATHS ----------
var PINK = 'color:#ff3aa8;text-shadow:0 0 4px rgba(255,58,168,0.45);';
function passageLinks(sel) {
var pass = ciHost.closest('tw-passage') || document.querySelector('tw-passage');
if (!pass) return [];
return Array.prototype.slice.call(pass.querySelectorAll(sel)).filter(function(l) { return !ciWrap.contains(l) && l.getClientRects().length > 0; });
}
// the lily, when it is still there to take: the hook's own click-replace does the work
function lilyHook(n) { var pass = ciHost.closest('tw-passage') || document.querySelector('tw-passage'); if (!pass) return []; var h = pass.querySelector('tw-hook[name="lily' + n + '"]'); return (h && h.querySelector('svg') && !h.querySelector('.lily-glimpse') && h.getClientRects().length > 0) ? [h] : []; }
function byText(texts) { return passageLinks('tw-link').filter(function(l) { return texts.indexOf(l.textContent.trim()) >= 0; }); }
var HOTSPOTS = [
{ root: picG, name: 'the pictures', pos: [-0.3, 1.6, -1.2], tgt: [0.4, 1.75, -2.2], haloAt: [0.2, 1.7, -D / 2 + 0.05], haloSc: 1.6,
actions: function() { return lilyHook(4); },
line: 'Every inch of the green is hung with something, a nude, a racehorse, a face the room has stopped naming; none of them straight, all of them staying. [Sam: the pictures on the wall]' },
{ root: phoneHit, name: 'the telephone', pos: [-0.2, 1.5, -0.2], tgt: [barX1 - 0.12, 1.2, barZ - 0.1], haloSc: 0.5,
actions: function() { return passageLinks('.phone-ringing tw-link'); },
prose: function() { var d = passageLinks('.phone-ringing')[0]; if (!d) return ''; var c = d.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('tw-link'), function(l) { l.parentNode.removeChild(l); }); return c.textContent.replace(/\s+/g, ' ').trim(); },
line: 'The telephone at the end of the bar, black, its cord knotted from years of being handed across. It is not ringing. It could. [Sam: the phone when it is quiet]' },
{ root: barG, name: 'the bar', pos: [-0.9, 1.45, 0.4], tgt: [-1.9, 1.15, barZ - 0.3], haloAt: [-1.7, 1.15, barZ], haloSc: 1.3,
actions: function() { return byText(['Get a drink']); },
line: 'A bar the length of a bath, bamboo on the front, the mirror behind it too tired to show you much. [Sam: the bar when no drink is offered]' },
{ root: davy.hit, name: 'the man at the bar', pos: [-0.35, 1.45, 0.9], tgt: [-1.35, 1.15, barZ + 0.5], figure: true,
actions: function() { return byText(['Get a drink with the man at the bar']); } },
{ root: agent.hit, name: 'the agent at his table', pos: [0.1, 1.4, 1.3], tgt: [1.35, 0.95, 0.35], figure: true,
actions: function() { return byText(['Talk to the famous agent']); } },
{ root: pianoG, name: 'the piano', pos: [0.9, 1.4, 0.2], tgt: [W / 2 - 0.3, 1.1, -0.55], haloAt: [W / 2 - 0.5, 1.1, -0.55], haloSc: 1.1,
line: 'An upright nobody has tuned since the war, a candle in a bottle on its lid, the keys yellow as the ceiling. Someone is always about to play it. [Sam: the piano]' },
{ root: winG, name: 'the window', pos: [1.2, 1.5, 1.4], tgt: [W / 2, 1.55, 1.15], haloAt: [W / 2 - 0.1, 1.55, 1.15], haloSc: 1.2,
line: 'Dean Street through a net curtain, one floor down and a whole life away; the lamps are on, the pavement wet, and nobody is looking up. [Sam: the window onto Dean Street]' }
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
ciWrap.appendChild(card);
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
b.className = 'fi-action'; b.textContent = link.textContent.trim(); b.style.cssText = BTN; if (link.tagName === 'TW-HOOK') { b.textContent = '[Sam: the lily]'; b.style.color = '#ff3aa8'; }
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
camK = ciStill ? 1 : 0; camNext = next; camMode = 'tween';
}
function stepBack() {
activeSpot = null; card.style.opacity = '0'; card.style.pointerEvents = 'none';
beginTween([CAM.x, CAM.y, CAM.z], [CAM.tx, CAM.ty, CAM.tz], 'idle');
}
var ray = new THREE.Raycaster(), mouseN = new THREE.Vector2();
function pick(ev) {
var r = ciCanvas.getBoundingClientRect();
mouseN.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
ray.setFromCamera(mouseN, camera);
var hits = ray.intersectObjects(hotspotRoots, true);
for (var i = 0; i < hits.length; i++) { var sp = hotspotFor(hits[i].object); if (available(sp)) return sp; }
return null;
}
ciCanvas.addEventListener('pointermove', function(ev) {
if (camMode !== 'idle' || ev.pointerType === 'touch') { hoverSpot = null; halo.visible = false; return; }
var spot = pick(ev); hoverSpot = spot;
if (spot) { haloAt(spot); halo.visible = true; ciCanvas.style.cursor = 'pointer'; }
else { halo.visible = false; ciCanvas.style.cursor = 'default'; }
});
ciCanvas.addEventListener('pointerdown', function(ev) {
if (camMode === 'tween') return;
if (camMode === 'inspect') { stepBack(); return; }
var spot = ev.pointerType === 'touch' ? pick(ev) : (hoverSpot || pick(ev));
if (!spot) return;
activeSpot = spot; halo.visible = false; ciCanvas.style.cursor = 'default';
showCard(spot);
beginTween(spot.pos, spot.tgt, 'inspect');
});
card.addEventListener('pointerdown', function(ev) { if (camMode === 'inspect' && !ev.target.classList.contains('fi-action')) stepBack(); });
var ciHint = document.createElement('div');
ciHint.textContent = 'LOOK CLOSER AT WHAT CATCHES YOUR EYE';
ciHint.style.cssText = 'position:absolute;top:22px;left:50%;transform:translateX(-50%);font:11px \'Courier New\',monospace;color:rgba(190,200,150,0.3);letter-spacing:3px;z-index:9003;pointer-events:none;opacity:0;transition:opacity 2s ease;text-align:center;max-width:90%;white-space:normal;';
ciWrap.appendChild(ciHint);
setTimeout(function() { ciHint.style.opacity = '1'; }, 2600);
setTimeout(function() { ciHint.style.opacity = '0'; }, 9000);

// ---------- FRAMES ----------
var clock = new THREE.Clock();
window._dssThreeRegistry['ci-wrap'].camera = camera;
function ciAnimate() {
ciAnimId = requestAnimationFrame(ciAnimate);
var dt = Math.min(0.1, clock.getDelta());
var t = ciStill ? 0 : clock.getElapsedTime();
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
if (ciWrap.dataset.cam !== camMode) ciWrap.dataset.cam = camMode;
if (!ciStill) {
for (var gi = 0; gi < ghosts.length; gi++) { var g = ghosts[gi]; g.sp.material.opacity = g.base * (0.7 + 0.3 * Math.sin(t * 0.23 + g.ph)); }
flame.material.opacity = 0.75 + 0.25 * Math.sin(t * 9.1) * Math.sin(t * 3.7); candle.intensity = 0.45 + 0.1 * Math.sin(t * 7.3);
var br = 0.03 * Math.sin(t * 0.7) + 0.015 * Math.sin(t * 0.19); pend.intensity = 1.2 + br; pendGlow.material.opacity = 0.5 + br * 0.6; haze[0].material.opacity = 0.14 + br * 0.2;
barLamp.intensity = 0.7 + 0.02 * Math.sin(t * 0.53 + 1); barGlow.material.opacity = 0.45 + 0.02 * Math.sin(t * 0.53 + 1); candleGlow.material.opacity = 0.3 + 0.12 * Math.sin(t * 9.1) * Math.sin(t * 3.7);
for (var m = 0; m < moteN; m++) { motePos[m * 3] = moteBase[m * 3] + Math.sin(t * 0.15 + m) * 0.06; motePos[m * 3 + 1] = 0.6 + ((moteBase[m * 3 + 1] - 0.6 + (m % 2 ? 1 : -1) * t * 0.03) % 1.7 + 1.7) % 1.7; }
moteGeo.attributes.position.needsUpdate = true;
if (halo.visible) halo.material.opacity = 0.8 + Math.sin(t * 0.9) * 0.08;
}
for (var mr = 0; mr < mirrors.length; mr++) mirrors[mr].update(curTarget, t);
if (composer) composer.render(); else renderer.render(scene, camera);
}
if (ciStill) { camera.lookAt(curTarget); ciWrap.dataset.cam = 'idle'; }
ciAnimate();
}

setInterval(function() {
var container = document.getElementById('ci-container');
if (container && !ciActive) {
initColonyInside();
} else if (!container) {
ciActive = false;
if (ciAnimId) { cancelAnimationFrame(ciAnimId); ciAnimId = null; }
window._dssDisposeWrap('ci-wrap');
}
}, 300);
})();

