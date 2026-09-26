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
// 2026-09-26. The second "look closer" room, after the French. Built
// from what is written of the Colony Room Club at 41 Dean Street: one
// small first-floor room painted a bilious green, its walls crowded
// with pictures, a small bar, bamboo furniture, an upright piano, a
// window onto the street. The room sits at the top of The Colony Room
// passage (#pi-container) and is its navigation: the man at the bar,
// the agent at his table and the telephone open the passage's own
// links when the passage has rendered them; the bar opens the drink
// when it is offered. The pictures, the piano and the window are
// inspections, their card words pink placeholders for Sam. Nothing
// about the game is decided in JS: the room only finds the passage's
// links by their wording and clicks them.
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
renderer.toneMappingExposure = 0.6;
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

function tex(w, h, fn) {
var c = document.createElement('canvas'); c.width = w; c.height = h;
var cx = c.getContext('2d'); fn(cx, w, h);
var t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearMipmapLinearFilter;
t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
return t;
}
function rnd(seed) { var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function mesh(geo, mat, x, y, z, parent) { var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || scene).add(m); return m; }

// ---------- THE ROOM: a long narrow pub, the columns dividing it ----------
// From what is written of the Pillars of Hercules at 7 Greek Street: wooden fittings, bentwood stools, elbow-height tables against the wall,
// a copper bar top, dark walls, a stained-glass panel in the ceiling, and the classical columns that divide the bar and were there before the building.
// The passage's own two pillars are Piranesi ruins; here they stand broken at the top too, and the third, between them, is a trace until the passage shows it.
var W = 4.6, D = 8.0, H = 3.1;
var wallTex = tex(512, 256, function(cx, w, h) {
cx.fillStyle = '#2e2218'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 700; i++) { var x = rnd(i) * w, y = rnd(i + 7) * h, r = 6 + rnd(i + 3) * 30; var g = cx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rnd(i + 11) < 0.5 ? 'rgba(90,60,30,0.14)' : 'rgba(20,12,6,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); }
var ng = cx.createLinearGradient(0, 0, 0, h); ng.addColorStop(0, 'rgba(120,90,30,0.22)'); ng.addColorStop(1, 'rgba(0,0,0,0.2)'); cx.fillStyle = ng; cx.fillRect(0, 0, w, h);
});
wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping; wallTex.repeat.set(3, 1);
var wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.85 });
var panelTex = tex(256, 256, function(cx, w, h) {
cx.fillStyle = '#3a2412'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 90; i++) { cx.strokeStyle = 'rgba(' + (20 + rnd(i) * 40 | 0) + ',' + (10 + rnd(i + 1) * 20 | 0) + ',5,' + (0.2 + rnd(i + 2) * 0.3) + ')'; cx.lineWidth = 1 + rnd(i + 3) * 2; cx.beginPath(); cx.moveTo(0, i * 3); cx.bezierCurveTo(w / 3, i * 3 + rnd(i) * 10, 2 * w / 3, i * 3 - rnd(i + 5) * 10, w, i * 3); cx.stroke(); }
cx.strokeStyle = 'rgba(0,0,0,0.5)'; cx.lineWidth = 3; for (var p = 0; p < 4; p++) cx.strokeRect(6 + p * 64, 6, 52, h - 12);
var vg = cx.createLinearGradient(0, 0, 0, h); vg.addColorStop(0, 'rgba(255,200,120,0.1)'); vg.addColorStop(1, 'rgba(0,0,0,0.3)'); cx.fillStyle = vg; cx.fillRect(0, 0, w, h);
});
panelTex.wrapS = panelTex.wrapT = THREE.RepeatWrapping;
var panelMat = new THREE.MeshStandardMaterial({ map: panelTex, roughness: 0.4, metalness: 0.05 });
var boardTex = tex(512, 512, function(cx, w, h) {
cx.fillStyle = '#2a1c10'; cx.fillRect(0, 0, w, h);
for (var b = 0; b < 12; b++) { cx.fillStyle = 'rgba(' + (50 + rnd(b) * 40 | 0) + ',' + (30 + rnd(b + 1) * 25 | 0) + ',12,0.6)'; cx.fillRect(0, b * 43, w, 40); cx.fillStyle = 'rgba(0,0,0,0.6)'; cx.fillRect(0, b * 43 + 40, w, 3); }
for (var i = 0; i < 3000; i++) { cx.fillStyle = 'rgba(0,0,0,' + rnd(i) * 0.25 + ')'; cx.fillRect(rnd(i + 1) * w, rnd(i + 2) * h, 1 + rnd(i + 3) * 3, 1); }
});
boardTex.wrapS = boardTex.wrapT = THREE.RepeatWrapping; boardTex.repeat.set(2, 4);
// the boards are wet towards the door: the flood has topped the kerb
var floorMat = new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.35, metalness: 0.15 });
var floor = mesh(new THREE.PlaneGeometry(W, D), floorMat, 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var wet = mesh(new THREE.PlaneGeometry(W, 2.4), new THREE.MeshStandardMaterial({ color: 0x0a0c12, roughness: 0.05, metalness: 0.7, transparent: true, opacity: 0.55 }), 0, 0.004, D / 2 - 1.2); wet.rotation.x = -Math.PI / 2;
var ceilMat = new THREE.MeshStandardMaterial({ color: 0x4a3a20, roughness: 0.95 });
var ceil = mesh(new THREE.PlaneGeometry(W, D), ceilMat, 0, H, 0); ceil.rotation.x = Math.PI / 2;
var back = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2); back.receiveShadow = true;
var front = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, D / 2); front.rotation.y = Math.PI;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2;
var right = mesh(new THREE.PlaneGeometry(D, H), wallMat, W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2;
// dark panelling to elbow height on the right wall and the back, elbow-height shelf tables clutching the wall
var rpan = mesh(new THREE.PlaneGeometry(D, 1.15), panelMat, W / 2 - 0.01, 0.575, 0); rpan.rotation.y = -Math.PI / 2;
var bpan = mesh(new THREE.PlaneGeometry(W, 1.15), panelMat, 0, 0.575, -D / 2 + 0.01);
var woodMat = new THREE.MeshStandardMaterial({ color: 0x2a1a0c, roughness: 0.45, metalness: 0.05 });
for (var s = 0; s < 3; s++) { var sh = mesh(new THREE.BoxGeometry(0.28, 0.04, 1.3), woodMat, W / 2 - 0.15, 1.12, 2.4 - s * 2.3); sh.castShadow = true; mesh(new THREE.BoxGeometry(0.04, 0.5, 0.04), woodMat, W / 2 - 0.05, 0.85, 2.4 - s * 2.3); }
// the stained-glass panel let into the ceiling, lit from above
var glassTex = tex(256, 128, function(cx, w, h) {
var cols = ['#c8402a', '#d8a030', '#2a6a9a', '#4a8a3a', '#e8d8a0', '#8a3a7a'];
for (var i = 0; i < 40; i++) { cx.fillStyle = cols[i % cols.length]; cx.beginPath(); var x = (i % 8) * 32 + 16, y = ((i / 8) | 0) * 26 + 13; cx.moveTo(x, y - 14); cx.lineTo(x + 16, y); cx.lineTo(x, y + 14); cx.lineTo(x - 16, y); cx.closePath(); cx.fill(); }
cx.strokeStyle = '#1a1410'; cx.lineWidth = 3; for (var i = 0; i < 40; i++) { var x = (i % 8) * 32 + 16, y = ((i / 8) | 0) * 26 + 13; cx.beginPath(); cx.moveTo(x, y - 14); cx.lineTo(x + 16, y); cx.lineTo(x, y + 14); cx.lineTo(x - 16, y); cx.closePath(); cx.stroke(); }
});
var glassPanel = mesh(new THREE.PlaneGeometry(1.6, 0.8), new THREE.MeshBasicMaterial({ map: glassTex, toneMapped: false, transparent: true, opacity: 0.9 }), 0, H - 0.02, -0.6); glassPanel.rotation.x = Math.PI / 2;
mesh(new THREE.BoxGeometry(1.7, 0.03, 0.05), woodMat, 0, H - 0.03, -0.6 - 0.42); mesh(new THREE.BoxGeometry(1.7, 0.03, 0.05), woodMat, 0, H - 0.03, -0.6 + 0.42);
var glassLight = new THREE.PointLight(0xffd8a0, 0.7, 5); glassLight.position.set(0, H - 0.4, -0.6); scene.add(glassLight);

// ---------- THE BAR, along the left, with its copper top ----------
var barG = new THREE.Group(); scene.add(barG);
var barZ0 = -3.0, barZ1 = 1.6, barX = -W / 2 + 0.9, barLen = barZ1 - barZ0;
var body = mesh(new THREE.BoxGeometry(0.6, 1.08, barLen), panelMat, barX, 0.54, (barZ0 + barZ1) / 2, barG); body.castShadow = true; body.receiveShadow = true;
var copper = new THREE.MeshStandardMaterial({ color: 0xb8683a, roughness: 0.25, metalness: 0.9 });
var top = mesh(new THREE.BoxGeometry(0.76, 0.05, barLen + 0.1), copper, barX, 1.105, (barZ0 + barZ1) / 2, barG); top.receiveShadow = true;
mesh(new THREE.CylinderGeometry(0.02, 0.02, barLen, 8), new THREE.MeshStandardMaterial({ color: 0xa08040, roughness: 0.3, metalness: 0.8 }), barX + 0.42, 0.22, (barZ0 + barZ1) / 2, barG).rotation.x = Math.PI / 2;
for (var pz = barZ0 + 0.8; pz < barZ1 - 0.4; pz += 0.9) { var pump = mesh(new THREE.CylinderGeometry(0.02, 0.028, 0.32, 10), new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.4 }), barX - 0.14, 1.28, pz, barG); pump.rotation.z = 0.28; mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.14, 10), copper, barX - 0.1, 1.17, pz, barG); }
// the back bar on the left wall: mirror, shelves, bottles, the till, the telephone
var mirrorMat = new THREE.MeshStandardMaterial({ color: 0x8a8a80, roughness: 0.2, metalness: 0.9 });
var mir = mesh(new THREE.PlaneGeometry(barLen - 0.4, 1.1), mirrorMat, -W / 2 + 0.01, 1.85, (barZ0 + barZ1) / 2, barG); mir.rotation.y = Math.PI / 2;
[1.35, 1.8, 2.25].forEach(function(sy, si) {
var sh = mesh(new THREE.BoxGeometry(0.22, 0.03, barLen - 0.4), woodMat, -W / 2 + 0.12, sy, (barZ0 + barZ1) / 2, barG);
var n = 10 + si * 2;
for (var i = 0; i < n; i++) {
var bz = barZ0 + 0.3 + i * ((barLen - 0.6) / n), hgt = 0.22 + rnd(i + si * 30) * 0.12;
var bc = [0x1e3a1e, 0x4a2a10, 0x8a7a30, 0x2a2a3a, 0x6a1a1a, 0xc8c0a0][(rnd(i + si * 7) * 6) | 0];
var bm = new THREE.MeshStandardMaterial({ color: bc, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.85 });
mesh(new THREE.CylinderGeometry(0.03, 0.035, hgt, 10), bm, -W / 2 + 0.12, sy + hgt / 2 + 0.015, bz, barG);
mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.07, 8), bm, -W / 2 + 0.12, sy + hgt + 0.05, bz, barG);
}
});
mesh(new THREE.BoxGeometry(0.3, 0.26, 0.36), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.4 }), -W / 2 + 0.25, 1.23, barZ0 + 0.9, barG);
// bentwood stools along the bar
var bentMat = new THREE.MeshStandardMaterial({ color: 0x3a2210, roughness: 0.5 });
function stool(x, z) {
var g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
[[-0.13, -0.13], [0.13, -0.13], [-0.13, 0.13], [0.13, 0.13]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.72, 8), bentMat, l[0], 0.36, l[1], g); });
mesh(new THREE.TorusGeometry(0.15, 0.012, 6, 20), bentMat, 0, 0.22, 0, g).rotation.x = Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.035, 18), bentMat, 0, 0.74, 0, g).castShadow = true;
return g;
}
stool(barX + 0.62, -2.2); stool(barX + 0.62, -1.4); stool(barX + 0.62, 0.2); stool(barX + 0.62, 1.0);
// glasses on the copper
var glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, metalness: 0, transmission: 0.9, thickness: 0.02, transparent: true, opacity: 0.6 });
mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.13, 12), glassMat, barX + 0.15, 1.2, -0.6, barG);
mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.13, 12), glassMat, barX + 0.2, 1.2, 0.9, barG);

// ---------- THE TELEPHONE, on the back bar ----------
var phoneG = new THREE.Group(); phoneG.position.set(-W / 2 + 0.2, 1.36, barZ1 - 0.3); scene.add(phoneG);
var bakelite = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.32, metalness: 0.1 });
mesh(new THREE.BoxGeometry(0.16, 0.08, 0.2), bakelite, 0, 0.04, 0, phoneG);
mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.02, 20), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.3 }), 0.03, 0.085, 0, phoneG).rotation.z = 0;
var hs = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.2, 10), bakelite, -0.02, 0.12, 0, phoneG); hs.rotation.x = Math.PI / 2;
mesh(new THREE.SphereGeometry(0.03, 10, 8), bakelite, -0.02, 0.11, -0.1, phoneG); mesh(new THREE.SphereGeometry(0.03, 10, 8), bakelite, -0.02, 0.11, 0.1, phoneG);
var phoneHit = mesh(new THREE.BoxGeometry(0.3, 0.3, 0.34), new THREE.MeshBasicMaterial({ visible: false }), 0, 0.12, 0, phoneG);

// ---------- THE PILLARS: two broken columns dividing the bar, and the third ----------
var stoneTex = tex(128, 512, function(cx, w, h) {
cx.fillStyle = '#9a9080'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 1500; i++) { cx.fillStyle = 'rgba(' + (40 + rnd(i) * 60 | 0) + ',' + (35 + rnd(i + 1) * 50 | 0) + ',' + (25 + rnd(i + 2) * 40 | 0) + ',' + rnd(i + 3) * 0.35 + ')'; cx.fillRect(rnd(i + 4) * w, rnd(i + 5) * h, 1 + rnd(i + 6) * 4, 1 + rnd(i + 7) * 3); }
for (var f = 0; f < 12; f++) { cx.fillStyle = 'rgba(0,0,0,0.28)'; cx.fillRect(f * 11, 0, 3, h); cx.fillStyle = 'rgba(255,255,255,0.12)'; cx.fillRect(f * 11 + 5, 0, 2, h); }
var sg = cx.createLinearGradient(0, 0, 0, h); sg.addColorStop(0, 'rgba(0,0,0,0.35)'); sg.addColorStop(0.5, 'rgba(0,0,0,0)'); sg.addColorStop(1, 'rgba(60,40,20,0.3)'); cx.fillStyle = sg; cx.fillRect(0, 0, w, h);
});
var stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.9 });
function column(x, z, brokenAt, mat) {
var g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
mesh(new THREE.BoxGeometry(0.62, 0.12, 0.62), mat, 0, 0.06, 0, g);
mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.14, 24), mat, 0, 0.19, 0, g);
var shaft = mesh(new THREE.CylinderGeometry(0.2, 0.24, brokenAt, 24, 1), mat, 0, 0.26 + brokenAt / 2, 0, g); shaft.castShadow = true; shaft.receiveShadow = true;
// the break: a jagged cap of stone
var cap = mesh(new THREE.CylinderGeometry(0.21, 0.2, 0.08, 9, 1), mat, 0, 0.26 + brokenAt + 0.02, 0, g); cap.rotation.y = rnd(x + z) * 3; cap.scale.set(1, 1 + rnd(z) * 0.6, 0.9);
if (brokenAt > H - 0.9) { mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.18, 24), mat, 0, 0.26 + brokenAt + 0.12, 0, g); mesh(new THREE.BoxGeometry(0.66, 0.1, 0.66), mat, 0, 0.26 + brokenAt + 0.26, 0, g); }
return g;
}
var PZ = -1.7; // the columns stand across the room two thirds of the way in
var pillarL = column(-1.15, PZ, 1.9, stoneMat);
var pillarR = column(1.15, PZ, 2.25, stoneMat);
// the third pillar: whole, and only a trace until the passage below has shown it (Inis's tip); it holds the room still
var pillarShown = !!document.querySelector('tw-passage .pillars-scene .pillar.centre');
var ghostStone = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.9, transparent: true, opacity: pillarShown ? 0.92 : 0.14, emissive: 0x2a2418, emissiveIntensity: pillarShown ? 0.25 : 0.05 });
var pillarC = column(0, PZ, H - 0.7, ghostStone);
var pillarHit = mesh(new THREE.CylinderGeometry(0.34, 0.34, H, 12), new THREE.MeshBasicMaterial({ visible: false }), 0, H / 2, PZ);
var pillarLight = new THREE.PointLight(0xd8c8a0, 0, 3); pillarLight.position.set(0, 1.6, PZ + 0.5); scene.add(pillarLight);

// ---------- THE BACK: the arch to Manette Street, the lattice window over it, rain ----------
var archG = new THREE.Group(); archG.position.set(0.6, 0, -D / 2 + 0.02); scene.add(archG);
var nightTex = tex(128, 256, function(cx, w, h) {
var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0c1018'); g.addColorStop(0.6, '#1a1c22'); g.addColorStop(1, '#3a3020'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
cx.fillStyle = 'rgba(255,210,140,0.55)'; cx.fillRect(58, 120, 8, 10);
for (var i = 0; i < 90; i++) { cx.strokeStyle = 'rgba(200,210,230,' + (0.08 + rnd(i) * 0.14) + ')'; cx.lineWidth = 1; cx.beginPath(); var x = rnd(i + 3) * w, y = rnd(i + 5) * h; cx.moveTo(x, y); cx.lineTo(x - 2, y + 10 + rnd(i) * 14); cx.stroke(); }
});
var archPane = mesh(new THREE.PlaneGeometry(1.1, 2.2), new THREE.MeshBasicMaterial({ map: nightTex, toneMapped: false }), 0, 1.15, 0, archG);
var archStone = new THREE.MeshStandardMaterial({ color: 0x6a6050, roughness: 0.9 });
mesh(new THREE.BoxGeometry(0.16, 2.3, 0.1), archStone, -0.63, 1.15, 0.05, archG); mesh(new THREE.BoxGeometry(0.16, 2.3, 0.1), archStone, 0.63, 1.15, 0.05, archG);
mesh(new THREE.TorusGeometry(0.62, 0.08, 8, 24, Math.PI), archStone, 0, 2.28, 0.05, archG);
var archLight = new THREE.PointLight(0x8a98b8, 0.5, 4); archLight.position.set(0.6, 1.4, -D / 2 + 0.6); scene.add(archLight);
// the lattice window high on the front wall, rain on it, the flood-light of the street
var winG = new THREE.Group(); winG.position.set(-1.35, 2.3, -D / 2 + 0.02); scene.add(winG);
var latticeTex = tex(256, 128, function(cx, w, h) {
var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#2a3040'); g.addColorStop(1, '#6a5a38'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
cx.strokeStyle = 'rgba(30,25,20,0.9)'; cx.lineWidth = 3;
for (var d = -h; d < w + h; d += 22) { cx.beginPath(); cx.moveTo(d, 0); cx.lineTo(d + h, h); cx.stroke(); cx.beginPath(); cx.moveTo(d, h); cx.lineTo(d + h, 0); cx.stroke(); }
for (var i = 0; i < 60; i++) { cx.fillStyle = 'rgba(220,230,255,' + (0.1 + rnd(i) * 0.2) + ')'; cx.beginPath(); cx.ellipse(rnd(i + 3) * w, rnd(i + 5) * h, 1.5, 3 + rnd(i) * 5, 0, 0, 6.3); cx.fill(); }
});
var winPane = mesh(new THREE.PlaneGeometry(2.0, 0.9), new THREE.MeshBasicMaterial({ map: latticeTex, toneMapped: false }), 0, 0, 0, winG);
var sashMat = new THREE.MeshStandardMaterial({ color: 0x2a1a0c, roughness: 0.6 });
mesh(new THREE.BoxGeometry(2.1, 0.06, 0.06), sashMat, 0, 0.47, 0.03, winG); mesh(new THREE.BoxGeometry(2.1, 0.06, 0.06), sashMat, 0, -0.47, 0.03, winG);
mesh(new THREE.BoxGeometry(0.06, 0.96, 0.06), sashMat, -1.02, 0, 0.03, winG); mesh(new THREE.BoxGeometry(0.06, 0.96, 0.06), sashMat, 1.02, 0, 0.03, winG);
var winLight = new THREE.PointLight(0x9aa8c8, 0.45, 4); winLight.position.set(-1.35, 2.2, -D / 2 + 0.6); scene.add(winLight);
// the door, front right: the threshold the flood is lapping at
var doorG = new THREE.Group(); doorG.position.set(W / 2 - 0.03, 0, 0.6); doorG.rotation.y = -Math.PI / 2; scene.add(doorG);
mesh(new THREE.BoxGeometry(0.95, 2.15, 0.06), new THREE.MeshStandardMaterial({ color: 0x1e1208, roughness: 0.5 }), 0, 1.075, 0, doorG).castShadow = true;
mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ map: latticeTex, toneMapped: false }), 0, 1.55, 0.035, doorG);
mesh(new THREE.SphereGeometry(0.035, 10, 8), copper, 0.36, 1.05, 0.05, doorG);
var sill = mesh(new THREE.PlaneGeometry(1.2, 0.5), new THREE.MeshStandardMaterial({ color: 0x10141c, roughness: 0.03, metalness: 0.8, transparent: true, opacity: 0.7 }), 0, 0.006, -0.3, doorG); sill.rotation.x = -Math.PI / 2;
var doorHit = mesh(new THREE.BoxGeometry(1.1, 2.2, 0.5), new THREE.MeshBasicMaterial({ visible: false }), 0, 1.1, -0.15, doorG);

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
var ham = ghost(W / 2 - 0.55, -1.0, 0, 0.34, false);     // the man you recognise through the fumes, at the shelf on the right wall by the pillars
var drinker = ghost(barX + 0.62, -1.4, 2, 0.24, false);   // someone at the bar, back turned
var farOne = ghost(0.6, -3.4, 4, 0.18, false);            // a shape under the arch, going or coming

// ---------- LIGHT: brass wall lamps, the glass overhead, the street through the lattice, smoke ----------
scene.add(new THREE.AmbientLight(0x3a2a18, 0.5));
scene.add(new THREE.HemisphereLight(0x8a7040, 0x0a0806, 0.3));
var lampMat = new THREE.MeshBasicMaterial({ color: 0xffe0b0, toneMapped: false });
var lamps = [];
[[W / 2 - 0.12, 2.1, 1.6], [W / 2 - 0.12, 2.1, -0.4], [-W / 2 + 0.35, 2.55, -0.6], [-W / 2 + 0.35, 2.55, 1.0]].forEach(function(lp, i) {
var l = new THREE.PointLight(0xffc880, 0.9, 5, 1.5); l.position.set(lp[0], lp[1], lp[2]); if (i === 0) { l.castShadow = true; l.shadow.mapSize.set(1024, 1024); l.shadow.bias = -0.002; } scene.add(l); lamps.push(l);
mesh(new THREE.SphereGeometry(0.06, 12, 10), lampMat, lp[0], lp[1], lp[2]);
mesh(new THREE.ConeGeometry(0.13, 0.12, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0x8a6a30, roughness: 0.5, metalness: 0.6, side: THREE.DoubleSide }), lp[0], lp[1] + 0.09, lp[2]);
});
var moteN = 320, motePos = new Float32Array(moteN * 3);
for (var i = 0; i < moteN; i++) { motePos[i * 3] = (rnd(i) - 0.5) * W; motePos[i * 3 + 1] = 0.5 + rnd(i + 1) * (H - 0.7); motePos[i * 3 + 2] = (rnd(i + 2) - 0.5) * D; }
var moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
var motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({ color: 0xe8d8b0, size: 0.022, transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(motes);
// smoke: two slow additive sheets between the pillars
var smokeTex = tex(256, 128, function(cx, w, h) { for (var i = 0; i < 26; i++) { var g = cx.createRadialGradient(rnd(i) * w, rnd(i + 1) * h, 0, rnd(i) * w, rnd(i + 1) * h, 20 + rnd(i + 2) * 60); g.addColorStop(0, 'rgba(200,180,140,0.16)'); g.addColorStop(1, 'rgba(200,180,140,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); } });
var smokes = [0, 1].map(function(i) { var sp = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.0), new THREE.MeshBasicMaterial({ map: smokeTex, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending })); sp.position.set(0, 1.6 + i * 0.5, PZ + 0.6 + i * 1.2); scene.add(sp); return sp; });

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
for (var li = 0; li < lamps.length; li++) lamps[li].intensity = 0.9 + 0.04 * Math.sin(t * (0.6 + li * 0.13) + li);
smokes[0].position.x = Math.sin(t * 0.07) * 0.4; smokes[1].position.x = Math.cos(t * 0.05) * 0.5; smokes[0].material.opacity = 0.45 + 0.08 * Math.sin(t * 0.21); smokes[1].material.opacity = 0.45 + 0.08 * Math.cos(t * 0.17);
var mp = moteGeo.attributes.position.array;
for (var i = 0; i < moteN; i++) { mp[i * 3 + 1] += dt * 0.012 * (0.5 + rnd(i)); mp[i * 3] += Math.sin(t * 0.3 + i) * dt * 0.01; if (mp[i * 3 + 1] > H - 0.2) mp[i * 3 + 1] = 0.5; }
moteGeo.attributes.position.needsUpdate = true;
}
renderer.render(scene, camera);
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

