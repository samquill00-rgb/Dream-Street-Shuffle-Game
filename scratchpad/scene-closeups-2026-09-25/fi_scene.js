// ====== INSIDE THE FRENCH — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-25. The first "look closer" scene, carried over from the
// Fagin's Den mechanism in the Oliver Twist files: hotspots in the 3D
// room, a hover halo, click and the camera pushes in on the thing and a
// caption card opens; click anywhere to step back. Built to Sam's photo
// of the French House bar (counter on the left, the photo wall at the
// back, the frieze of prints under the ceiling, the blue door on the
// right). Sits between the exterior approach and The French passage;
// the bar (or the button) goes on into the passage. The card's words
// are pink placeholders for Sam.
(function() {
var fiActive = false;
var fiAnimId = null;

function initFrenchInside() {
if (fiActive) return;
fiActive = true;
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(buildFIScene) : buildFIScene()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(buildFIScene) : buildFIScene());
}
}

function buildFIScene() {
var fiStill = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var fiWrap = document.createElement('div');
fiWrap.id = 'fi-wrap';
fiWrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9000;background:#0a0705;';
var fiCanvas = document.createElement('canvas');
fiCanvas.width = window.innerWidth;
fiCanvas.height = window.innerHeight;
fiCanvas.style.cssText = 'display:block;position:absolute;top:0;left:0;';
fiWrap.appendChild(fiCanvas);
var fiVig = document.createElement('div');
fiVig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:radial-gradient(ellipse at 46% 42%,transparent 26%,rgba(0,0,0,0.72) 100%);';
var fiWash = document.createElement('div');
fiWash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9000;background:linear-gradient(180deg,rgba(20,8,2,0.28) 0%,rgba(10,5,2,0.06) 35%,rgba(10,5,2,0.06) 60%,rgba(5,3,2,0.42) 100%);';
fiWrap.appendChild(fiWash);
fiWrap.appendChild(fiVig);
var fiGrain = document.createElement('div');
fiGrain.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9002;opacity:0.05;mix-blend-mode:overlay;background:url(' + (window.dssGetGrainURL ? window.dssGetGrainURL() : '') + ');';
fiWrap.appendChild(fiGrain);
var fiLoc = document.createElement('div');
fiLoc.textContent = 'THE FRENCH HOUSE, DEAN STREET';
fiLoc.style.cssText = 'position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font:12px \'Courier New\',monospace;color:rgba(200,180,140,0.25);letter-spacing:3px;white-space:nowrap;z-index:9003;pointer-events:none;';
fiWrap.appendChild(fiLoc);
document.body.appendChild(fiWrap);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0705);
scene.fog = new THREE.FogExp2(0x120b06, 0.055);
var aspect = window.innerWidth / window.innerHeight;
var portrait = aspect < 1;
var camera = new THREE.PerspectiveCamera(portrait ? 78 : 52, aspect, 0.05, 60);
var CAM = portrait ? { x: 1.3, y: 1.5, z: 4.1, tx: -1.45, ty: 1.2, tz: -1.4 } : { x: 1.05, y: 1.5, z: 3.4, tx: -0.35, ty: 1.28, tz: -1.4 };
camera.position.set(CAM.x, CAM.y, CAM.z);

var renderer = new THREE.WebGLRenderer({ canvas: fiCanvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 600 ? 1.25 : 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.6;
window._dssBindScene('fi-wrap', scene, renderer, camera);
var origResize = window._dssThreeRegistry['fi-wrap'].resize;
window._dssThreeRegistry['fi-wrap'].resize = function() {
camera.fov = (window.innerWidth / window.innerHeight) < 1 ? 78 : 52;
origResize();
};
window.removeEventListener('resize', origResize);
window.addEventListener('resize', window._dssThreeRegistry['fi-wrap'].resize);

function tex(w, h, fn) {
var c = document.createElement('canvas'); c.width = w; c.height = h;
var cx = c.getContext('2d'); fn(cx, w, h);
var t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearFilter;
return t;
}
function rnd(seed) { var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function mesh(geo, mat, x, y, z, parent) {
var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || scene).add(m); return m;
}
function woodTex(base, grain, seed) {
return tex(256, 256, function(cx, w, h) {
cx.fillStyle = base; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 90; i++) {
cx.strokeStyle = grain; cx.globalAlpha = 0.12 + rnd(seed + i) * 0.25; cx.lineWidth = 0.6 + rnd(seed + i * 3) * 1.6;
cx.beginPath(); var y0 = rnd(seed + i * 7) * h; cx.moveTo(0, y0);
for (var x = 0; x <= w; x += 16) cx.lineTo(x, y0 + Math.sin(x * 0.05 + i) * 2.2);
cx.stroke();
}
cx.globalAlpha = 1;
});
}

// ---------- MATERIALS ----------
var mahogany = new THREE.MeshStandardMaterial({ map: woodTex('#3a1c0c', '#150803', 1), roughness: 0.42, metalness: 0.08 });
var darkWood = new THREE.MeshStandardMaterial({ map: woodTex('#2a140a', '#0e0603', 2), roughness: 0.6 });
var counterTop = new THREE.MeshStandardMaterial({ map: woodTex('#4a2410', '#1c0a04', 3), roughness: 0.22, metalness: 0.12 });
var brass = new THREE.MeshStandardMaterial({ color: 0xb8863a, roughness: 0.3, metalness: 0.85 });
var ochreWall = new THREE.MeshStandardMaterial({ map: tex(256, 256, function(cx, w, h) {
cx.fillStyle = '#9a5a1e'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 1400; i++) { cx.fillStyle = 'rgba(' + (60 + rnd(i) * 80 | 0) + ',' + (30 + rnd(i + 9) * 40 | 0) + ',10,' + (0.05 + rnd(i + 3) * 0.14) + ')'; cx.fillRect(rnd(i + 1) * w, rnd(i + 2) * h, 2 + rnd(i + 5) * 5, 1 + rnd(i + 6) * 3); }
}), roughness: 0.9 });
var ceilingMat = new THREE.MeshStandardMaterial({ color: 0xb46a26, roughness: 0.85 });
var redWall = new THREE.MeshStandardMaterial({ color: 0x6a2418, roughness: 0.85 });
var carpet = new THREE.MeshStandardMaterial({ map: tex(256, 256, function(cx, w, h) {
cx.fillStyle = '#4a1612'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 2600; i++) { cx.fillStyle = 'rgba(' + (30 + rnd(i) * 60 | 0) + ',' + (8 + rnd(i + 1) * 14 | 0) + ',' + (8 + rnd(i + 2) * 12 | 0) + ',' + (0.2 + rnd(i + 3) * 0.4) + ')'; cx.fillRect(rnd(i + 4) * w, rnd(i + 5) * h, 2, 2); }
cx.strokeStyle = 'rgba(170,120,60,0.22)'; cx.lineWidth = 1;
for (var y = 0; y < h; y += 32) for (var x = 0; x < w; x += 32) { cx.beginPath(); cx.moveTo(x + 16, y); cx.lineTo(x + 32, y + 16); cx.lineTo(x + 16, y + 32); cx.lineTo(x, y + 16); cx.closePath(); cx.stroke(); }
}), roughness: 0.95 });
carpet.map.wrapS = carpet.map.wrapT = THREE.RepeatWrapping; carpet.map.repeat.set(5, 6);

// ---------- ROOM ----------
var W = 7.4, H = 3.3, D = 9.0; // x -3.7..3.7, y 0..3.3, z -4.5..4.5
var floor = mesh(new THREE.PlaneGeometry(W, D), carpet, 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceil = mesh(new THREE.PlaneGeometry(W, D), ceilingMat, 0, H, 0); ceil.rotation.x = Math.PI / 2;
// back wall: red panel with a dark dado
var backWall = mesh(new THREE.PlaneGeometry(W, H), redWall, 0, H / 2, -D / 2); backWall.receiveShadow = true;
mesh(new THREE.BoxGeometry(W, 1.05, 0.06), darkWood, 0, 0.525, -D / 2 + 0.03);
mesh(new THREE.BoxGeometry(W, 0.06, 0.1), mahogany, 0, 1.07, -D / 2 + 0.05);
// side walls
var leftWall = mesh(new THREE.PlaneGeometry(D, H), ochreWall, -W / 2, H / 2, 0); leftWall.rotation.y = Math.PI / 2;
var rightWall = mesh(new THREE.PlaneGeometry(D, H), ochreWall, W / 2, H / 2, 0); rightWall.rotation.y = -Math.PI / 2;
mesh(new THREE.BoxGeometry(0.06, 1.05, D), darkWood, W / 2 - 0.03, 0.525, 0);
var frontWall = mesh(new THREE.PlaneGeometry(W, H), ochreWall, 0, H / 2, D / 2); frontWall.rotation.y = Math.PI;
// the frieze of prints under the ceiling, all round
var friezeTex = tex(1024, 96, function(cx, w, h) {
cx.fillStyle = '#d6c396'; cx.fillRect(0, 0, w, h);
cx.fillStyle = '#b08e52'; cx.fillRect(0, 0, w, 4); cx.fillRect(0, h - 4, w, 4);
for (var i = 0; i < 20; i++) {
var x = 8 + i * 51, y = 12, pw = 40, ph = 68;
cx.fillStyle = '#e9dfc2'; cx.fillRect(x, y, pw, ph);
cx.strokeStyle = 'rgba(80,50,20,0.5)'; cx.lineWidth = 1; cx.strokeRect(x + 0.5, y + 0.5, pw - 1, ph - 1);
// a caricature: big head, small shoulders, a hat or a lot of hair, sepia ink
var hx = x + pw / 2 + (rnd(i) - 0.5) * 6, hy = y + 26, hw = 9 + rnd(i + 1) * 5, hh = 11 + rnd(i + 2) * 5;
cx.fillStyle = 'rgba(70,45,20,' + (0.55 + rnd(i + 3) * 0.3) + ')';
cx.beginPath(); cx.ellipse(hx, hy, hw, hh, (rnd(i + 4) - 0.5) * 0.4, 0, Math.PI * 2); cx.fill();
if (rnd(i + 5) > 0.5) { cx.fillRect(hx - hw - 3, hy - hh + 2, hw * 2 + 6, 3); cx.fillRect(hx - hw * 0.6, hy - hh - 8, hw * 1.2, 10); }
else { cx.beginPath(); cx.ellipse(hx, hy - hh * 0.6, hw * 1.25, hh * 0.7, 0, Math.PI, Math.PI * 2); cx.fill(); }
cx.beginPath(); cx.moveTo(hx - hw * 1.6, y + ph - 4); cx.quadraticCurveTo(hx, hy + hh - 2, hx + hw * 1.6, y + ph - 4); cx.fill();
cx.fillStyle = 'rgba(233,223,194,0.9)'; cx.beginPath(); cx.arc(hx - hw * 0.35, hy - 1, 1.6, 0, Math.PI * 2); cx.arc(hx + hw * 0.35, hy - 1, 1.6, 0, Math.PI * 2); cx.fill();
cx.fillStyle = 'rgba(150,40,30,' + (0.15 + rnd(i + 6) * 0.4) + ')'; cx.fillRect(x + 4 + rnd(i + 7) * 24, y + ph - 12, 8, 3);
}
});
friezeTex.wrapS = THREE.RepeatWrapping;
var friezeMat = new THREE.MeshStandardMaterial({ map: friezeTex, roughness: 0.8 });
function frieze(len, x, z, ry) {
var m = mesh(new THREE.PlaneGeometry(len, 0.34), friezeMat, x, H - 0.24, z); m.rotation.y = ry;
m.material = friezeMat.clone(); m.material.map = friezeTex.clone(); m.material.map.needsUpdate = true; m.material.map.repeat.set(len / 3.5, 1);
return m;
}
frieze(W, 0, -D / 2 + 0.02, 0); frieze(D, -W / 2 + 0.02, 0, Math.PI / 2); frieze(D, W / 2 - 0.02, 0, -Math.PI / 2); frieze(W, 0, D / 2 - 0.02, Math.PI);
// cornice line and picture rail
var cornice = new THREE.MeshStandardMaterial({ color: 0x3a1a0c, roughness: 0.6 });
[[W, 0, -D / 2 + 0.05, 0], [D, -W / 2 + 0.05, 0, Math.PI / 2], [D, W / 2 - 0.05, 0, -Math.PI / 2]].forEach(function(c) {
var m = mesh(new THREE.BoxGeometry(c[0], 0.05, 0.1), cornice, c[1], H - 0.44, c[2]); m.rotation.y = c[3];
var m2 = mesh(new THREE.BoxGeometry(c[0], 0.05, 0.1), cornice, c[1], H - 0.04, c[2]); m2.rotation.y = c[3];
});

// ---------- THE BAR, running away from us on the left ----------
var barG = new THREE.Group(); scene.add(barG);
var P1 = new THREE.Vector3(-2.35, 0, 3.2), P2 = new THREE.Vector3(-1.05, 0, -2.1);
var barLen = P1.distanceTo(P2), barAng = Math.atan2(P1.x - P2.x, P1.z - P2.z);
var barMid = P1.clone().add(P2).multiplyScalar(0.5);
barG.position.copy(barMid); barG.rotation.y = barAng;
// counter body (customer side faces +x in local space), pale panels below the top
var body = mesh(new THREE.BoxGeometry(0.62, 1.08, barLen), mahogany, 0, 0.54, 0, barG); body.castShadow = true; body.receiveShadow = true;
var panelMat = new THREE.MeshStandardMaterial({ color: 0xd9c9a2, roughness: 0.7 });
for (var pi = 0; pi < Math.floor(barLen / 0.7); pi++) {
mesh(new THREE.BoxGeometry(0.02, 0.62, 0.5), panelMat, 0.32, 0.5, -barLen / 2 + 0.42 + pi * 0.7, barG);
}
var top = mesh(new THREE.BoxGeometry(0.78, 0.06, barLen + 0.1), counterTop, 0, 1.11, 0, barG); top.castShadow = true; top.receiveShadow = true;
mesh(new THREE.BoxGeometry(0.04, 0.05, barLen + 0.1), brass, 0.4, 1.135, 0, barG);
var rail = mesh(new THREE.CylinderGeometry(0.02, 0.02, barLen, 8), brass, 0.48, 0.2, 0, barG); rail.rotation.x = Math.PI / 2;
// the curved end nearest the back
var endCap = mesh(new THREE.CylinderGeometry(0.39, 0.39, 1.08, 24, 1, false, 0, Math.PI), mahogany, 0, 0.54, -barLen / 2, barG); endCap.rotation.y = Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.06, 24, 1, false, 0, Math.PI), counterTop, 0, 1.11, -barLen / 2 - 0.05, barG).rotation.y = Math.PI / 2;
// pump handles on the counter
var pumpMat = new THREE.MeshStandardMaterial({ color: 0x1a1210, roughness: 0.35 });
var ivory = new THREE.MeshStandardMaterial({ color: 0xe6dcc0, roughness: 0.4 });
for (var pu = 0; pu < 3; pu++) {
var z0 = -0.5 + pu * 0.28;
mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.16, 10), brass, -0.12, 1.22, z0, barG);
var handle = mesh(new THREE.CylinderGeometry(0.022, 0.03, 0.34, 10), ivory, -0.12, 1.46, z0, barG); handle.rotation.x = -0.18;
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 6), brass, -0.12, 1.32, z0, barG);
}

// ---------- THE BACK BAR along the left wall ----------
var bbX = -W / 2;
mesh(new THREE.BoxGeometry(0.42, 1.2, 6.2), darkWood, bbX + 0.21, 0.6, 0.5).receiveShadow = true;
mesh(new THREE.BoxGeometry(0.48, 0.05, 6.2), counterTop, bbX + 0.24, 1.22, 0.5);
// mirror and shelves
var mirrorTex = tex(512, 128, function(cx, w, h) {
var g = cx.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#5a4a30'); g.addColorStop(0.45, '#8a7452'); g.addColorStop(0.5, '#a89268'); g.addColorStop(0.55, '#7a6446'); g.addColorStop(1, '#3a2c1a');
cx.fillStyle = g; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 40; i++) { cx.fillStyle = 'rgba(' + (20 + rnd(i) * 60 | 0) + ',' + (30 + rnd(i + 1) * 40 | 0) + ',' + (10 + rnd(i + 2) * 30 | 0) + ',0.5)'; cx.fillRect(i * 13 + 4, h * 0.45 + rnd(i + 3) * 20, 5, 30 + rnd(i + 4) * 30); }
cx.fillStyle = 'rgba(255,240,210,0.18)'; cx.beginPath(); cx.moveTo(w * 0.62, 0); cx.lineTo(w * 0.7, 0); cx.lineTo(w * 0.5, h); cx.lineTo(w * 0.42, h); cx.closePath(); cx.fill();
});
var mirrorMat = new THREE.MeshStandardMaterial({ map: mirrorTex, roughness: 0.12, metalness: 0.35, emissive: 0x2a2014, emissiveIntensity: 0.35 });
var mirror = mesh(new THREE.PlaneGeometry(5.6, 1.1), mirrorMat, bbX + 0.03, 1.95, 0.4); mirror.rotation.y = Math.PI / 2;
var shelfMat = new THREE.MeshStandardMaterial({ color: 0x1c0d06, roughness: 0.5 });
mesh(new THREE.BoxGeometry(0.34, 0.03, 5.8), shelfMat, bbX + 0.17, 1.62, 0.4);
mesh(new THREE.BoxGeometry(0.28, 0.03, 5.8), shelfMat, bbX + 0.14, 2.2, 0.4);
mesh(new THREE.BoxGeometry(0.2, 0.03, 5.8), shelfMat, bbX + 0.1, 2.72, 0.4);
mesh(new THREE.BoxGeometry(0.06, 3.3, 0.16), mahogany, bbX + 0.03, 1.65, -2.55);
mesh(new THREE.BoxGeometry(0.06, 3.3, 0.16), mahogany, bbX + 0.03, 1.65, 3.4);
// bottles, three rows
var botCols = [0x2a5a2a, 0x7a4a18, 0x1a2a5a, 0x8a7a20, 0x4a1a1a, 0x2a4a3a, 0xa08030, 0x3a2a1a];
function bottle(x, y, z, col, h, r) {
var g = new THREE.Group(); g.position.set(x, y, z);
var bm = new THREE.MeshStandardMaterial({ color: col, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.9 });
mesh(new THREE.CylinderGeometry(r, r, h, 10), bm, 0, h / 2, 0, g);
mesh(new THREE.CylinderGeometry(r * 0.35, r * 0.6, h * 0.35, 8), bm, 0, h + h * 0.16, 0, g);
mesh(new THREE.CylinderGeometry(r * 0.36, r * 0.36, 0.03, 8), brass, 0, h + h * 0.34, 0, g);
scene.add(g); return g;
}
for (var row = 0; row < 3; row++) {
var sy = [1.635, 2.215, 2.735][row], sx = [bbX + 0.2, bbX + 0.16, bbX + 0.12][row];
for (var b = 0; b < 22; b++) {
if (rnd(row * 40 + b) < 0.18) continue;
bottle(sx + (rnd(row + b * 3) - 0.5) * 0.06, sy, -2.3 + b * 0.25 + (rnd(b + row * 9) - 0.5) * 0.06, botCols[(b + row * 3) % botCols.length], 0.2 + rnd(b * 5 + row) * 0.14, 0.03 + rnd(b * 2 + row) * 0.012);
}
}
// optics under the top shelf, and the till
for (var o = 0; o < 6; o++) {
bottle(bbX + 0.12, 2.32, -1.6 + o * 0.3, botCols[(o * 5) % botCols.length], 0.22, 0.03).rotation.x = Math.PI;
}
var till = mesh(new THREE.BoxGeometry(0.3, 0.26, 0.42), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.5 }), bbX + 0.27, 1.37, 1.3);
mesh(new THREE.BoxGeometry(0.12, 0.08, 0.3), new THREE.MeshStandardMaterial({ color: 0x3a4a3a, emissive: 0x2a6a3a, emissiveIntensity: 0.6 }), bbX + 0.4, 1.54, 1.3);

// THE TELEPHONE behind the bar (the one that rings)
var phoneG = new THREE.Group(); phoneG.position.set(bbX + 0.26, 1.245, -0.35); phoneG.rotation.y = 0.55; scene.add(phoneG);
var bakelite = new THREE.MeshStandardMaterial({ color: 0x0c0a0a, roughness: 0.28, metalness: 0.15 });
mesh(new THREE.BoxGeometry(0.22, 0.1, 0.2), bakelite, 0, 0.05, 0, phoneG);
mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.02, 20), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.5 }), 0, 0.11, 0.04, phoneG);
var hs = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.22, 8), bakelite, 0, 0.16, -0.02, phoneG); hs.rotation.z = Math.PI / 2;
mesh(new THREE.SphereGeometry(0.035, 10, 8), bakelite, -0.11, 0.15, -0.02, phoneG);
mesh(new THREE.SphereGeometry(0.035, 10, 8), bakelite, 0.11, 0.15, -0.02, phoneG);
var phoneProxy = mesh(new THREE.SphereGeometry(0.22, 8, 6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }), 0, 0.1, 0, phoneG);

// ---------- THE PHOTO WALL at the back ----------
var photoG = new THREE.Group(); scene.add(photoG);
var frameMat = new THREE.MeshStandardMaterial({ color: 0x1a1008, roughness: 0.5 });
var mountMat = new THREE.MeshStandardMaterial({ color: 0xc8bca4, roughness: 0.85 });
function photoTex(seed) {
return tex(96, 128, function(cx, w, h) {
var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#5a4a38'); g.addColorStop(1, '#2a221a');
cx.fillStyle = g; cx.fillRect(0, 0, w, h);
// a figure, half there
cx.fillStyle = 'rgba(20,14,10,' + (0.55 + rnd(seed) * 0.3) + ')';
var hx = w * (0.35 + rnd(seed + 1) * 0.3), hy = h * 0.34, hr = 10 + rnd(seed + 2) * 5;
cx.beginPath(); cx.arc(hx, hy, hr, 0, Math.PI * 2); cx.fill();
cx.beginPath(); cx.moveTo(hx - hr * 2.2, h); cx.quadraticCurveTo(hx, hy + hr * 0.8, hx + hr * 2.2, h); cx.fill();
cx.fillStyle = 'rgba(230,210,170,' + (0.1 + rnd(seed + 3) * 0.2) + ')'; cx.fillRect(0, 0, w, h * 0.12);
for (var i = 0; i < 60; i++) { cx.fillStyle = 'rgba(255,240,200,' + rnd(seed + i) * 0.12 + ')'; cx.fillRect(rnd(seed + i + 9) * w, rnd(seed + i + 4) * h, 2, 2); }
});
}
var EMPTY = 5; // the one frame with no one in it
for (var f = 0; f < 8; f++) {
var fx = -2.65 + f * 0.76, fy = 2.0, fz = -D / 2 + 0.035;
mesh(new THREE.BoxGeometry(0.44, 0.56, 0.03), frameMat, fx, fy, fz, photoG);
mesh(new THREE.PlaneGeometry(0.38, 0.5), mountMat, fx, fy, fz + 0.017, photoG);
var pm = f === EMPTY
? new THREE.MeshStandardMaterial({ color: 0xcfc2a4, roughness: 0.9 })
: new THREE.MeshStandardMaterial({ map: photoTex(f + 11), roughness: 0.6 });
mesh(new THREE.PlaneGeometry(0.26, 0.36), pm, fx, fy, fz + 0.02, photoG);
}
// a couple more, smaller, high on the left wall behind the bar (the famous wall)
for (var f2 = 0; f2 < 5; f2++) {
var lz = -2.2 + f2 * 0.5;
var lm = mesh(new THREE.BoxGeometry(0.03, 0.3, 0.24), frameMat, bbX + 0.02, 2.62 + (f2 % 2) * 0.06, lz);
var lp = mesh(new THREE.PlaneGeometry(0.18, 0.24), new THREE.MeshStandardMaterial({ map: photoTex(f2 + 30), roughness: 0.6 }), bbX + 0.04, 2.62 + (f2 % 2) * 0.06, lz); lp.rotation.y = Math.PI / 2;
}

// ---------- THE RIGHT SIDE: pillar, window, the blue door ----------
var pillar = mesh(new THREE.BoxGeometry(0.34, H, 0.34), mahogany, 3.05, H / 2, 0.2); pillar.castShadow = true;
mesh(new THREE.BoxGeometry(0.5, 0.12, 0.5), mahogany, 3.05, H - 0.06, 0.2);
mesh(new THREE.BoxGeometry(0.5, 0.12, 0.5), mahogany, 3.05, 0.06, 0.2);
// sash window on the right wall, night outside with the street's lamp in it
var winTex = tex(128, 192, function(cx, w, h) {
cx.fillStyle = '#0c0e18'; cx.fillRect(0, 0, w, h);
var g = cx.createRadialGradient(w * 0.6, h * 0.3, 2, w * 0.6, h * 0.3, w * 0.7);
g.addColorStop(0, 'rgba(255,200,110,0.55)'); g.addColorStop(0.35, 'rgba(160,110,50,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0)');
cx.fillStyle = g; cx.fillRect(0, 0, w, h);
cx.fillStyle = 'rgba(236,228,205,0.35)';
for (var i = 0; i < 6; i++) cx.fillRect(4 + i * 20, 0, 3, h); // net curtain
cx.fillStyle = '#e8e0c8'; cx.fillRect(0, h / 2 - 3, w, 6); cx.fillRect(w / 2 - 3, 0, 6, h);
});
var winMat = new THREE.MeshStandardMaterial({ map: winTex, emissive: 0xffffff, emissiveMap: winTex, emissiveIntensity: 0.55, roughness: 0.9 });
var win = mesh(new THREE.PlaneGeometry(1.1, 1.7), winMat, W / 2 - 0.03, 1.95, -2.4); win.rotation.y = -Math.PI / 2;
var winFrame = mesh(new THREE.BoxGeometry(0.06, 1.85, 1.25), new THREE.MeshStandardMaterial({ color: 0xe8e0c8, roughness: 0.7 }), W / 2 - 0.02, 1.95, -2.4);
win.position.x = W / 2 - 0.06;
// a plant on the sill
var leafMat = new THREE.MeshStandardMaterial({ color: 0x2a5a24, roughness: 0.8, side: THREE.DoubleSide });
for (var lf = 0; lf < 9; lf++) {
var leaf = mesh(new THREE.PlaneGeometry(0.16, 0.42), leafMat, W / 2 - 0.3, 1.25 + rnd(lf) * 0.2, -2.4 + (rnd(lf + 2) - 0.5) * 0.4);
leaf.rotation.set((rnd(lf + 3) - 0.5) * 1.4, rnd(lf + 4) * Math.PI, (rnd(lf + 5) - 0.5) * 1.2);
}
mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.18, 10), new THREE.MeshStandardMaterial({ color: 0x8a4a2a, roughness: 0.9 }), W / 2 - 0.3, 1.08, -2.4);
// the blue door at the back right (to the stairs)
var doorG = new THREE.Group(); doorG.position.set(2.45, 0, -D / 2 + 0.06); scene.add(doorG);
var blue = new THREE.MeshStandardMaterial({ color: 0x1e4a9a, roughness: 0.45, metalness: 0.05 });
var blueDark = new THREE.MeshStandardMaterial({ color: 0x163a7a, roughness: 0.5 });
mesh(new THREE.BoxGeometry(1.06, 2.25, 0.08), blue, 0, 1.125, 0, doorG).castShadow = true;
mesh(new THREE.BoxGeometry(1.2, 0.1, 0.12), darkWood, 0, 2.3, 0, doorG);
mesh(new THREE.BoxGeometry(0.07, 2.35, 0.12), darkWood, -0.63, 1.175, 0, doorG);
mesh(new THREE.BoxGeometry(0.07, 2.35, 0.12), darkWood, 0.63, 1.175, 0, doorG);
mesh(new THREE.BoxGeometry(0.34, 0.78, 0.02), blueDark, -0.22, 1.55, 0.045, doorG);
mesh(new THREE.BoxGeometry(0.34, 0.78, 0.02), blueDark, 0.22, 1.55, 0.045, doorG);
mesh(new THREE.BoxGeometry(0.34, 0.6, 0.02), blueDark, -0.22, 0.55, 0.045, doorG);
mesh(new THREE.BoxGeometry(0.34, 0.6, 0.02), blueDark, 0.22, 0.55, 0.045, doorG);
mesh(new THREE.SphereGeometry(0.035, 10, 8), brass, 0.4, 1.05, 0.07, doorG);
// a small notice pinned to it
mesh(new THREE.PlaneGeometry(0.2, 0.26), new THREE.MeshStandardMaterial({ color: 0xe6dcc4, roughness: 0.9 }), 0.16, 1.92, 0.05, doorG);
// a thin line of light under it
var doorLight = new THREE.PointLight(0xffd090, 0.0, 1.6); doorLight.position.set(2.45, 0.08, -D / 2 + 0.3); scene.add(doorLight);
var doorGlow = mesh(new THREE.PlaneGeometry(1.0, 0.03), new THREE.MeshBasicMaterial({ color: 0xffd8a0, transparent: true, opacity: 0.0 }), 2.45, 0.015, -D / 2 + 0.11);

// ---------- STOOLS ----------
var stoolSeat = new THREE.MeshStandardMaterial({ color: 0x7a1c1c, roughness: 0.6 });
var stoolLeg = new THREE.MeshStandardMaterial({ color: 0x1a0e08, roughness: 0.5 });
function stool(x, z) {
var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rnd(x * 3 + z) * 6;
mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.07, 18), stoolSeat, 0, 0.72, 0, g).castShadow = true;
mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.03, 18), stoolLeg, 0, 0.67, 0, g);
for (var l = 0; l < 4; l++) {
var a = l * Math.PI / 2 + 0.4;
var leg = mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.68, 6), stoolLeg, Math.cos(a) * 0.13, 0.34, Math.sin(a) * 0.13, g); leg.rotation.z = Math.cos(a) * 0.09; leg.rotation.x = -Math.sin(a) * 0.09;
}
var ring = mesh(new THREE.TorusGeometry(0.15, 0.008, 6, 20), stoolLeg, 0, 0.22, 0, g); ring.rotation.x = Math.PI / 2;
scene.add(g); return g;
}
var barDir = P2.clone().sub(P1).normalize(), barPerp = new THREE.Vector3(-barDir.z, 0, barDir.x); // perp points to the customers' side
var stools = [];
for (var st = 0; st < 5; st++) {
var pAlong = P1.clone().add(barDir.clone().multiplyScalar(0.9 + st * 1.05)).add(barPerp.clone().multiplyScalar(0.72));
stools.push(stool(pAlong.x, pAlong.z));
}
stool(2.5, -3.6); stool(3.1, -3.1); stool(1.9, -1.9);
// a shelf on the right wall the stools sit at
mesh(new THREE.BoxGeometry(0.3, 0.05, 2.4), counterTop, W / 2 - 0.16, 1.05, -2.9);

// THE GLASS someone left on the bar, with its ring
var glassG = new THREE.Group();
var gp = P1.clone().add(barDir.clone().multiplyScalar(3.9)).add(barPerp.clone().multiplyScalar(0.18));
glassG.position.set(gp.x, 1.14, gp.z); scene.add(glassG);
var glassMat = new THREE.MeshStandardMaterial({ color: 0xf0eadc, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.28 });
mesh(new THREE.CylinderGeometry(0.036, 0.03, 0.12, 14, 1, true), glassMat, 0, 0.06, 0, glassG).material.side = THREE.DoubleSide;
mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.004, 14), glassMat, 0, 0.002, 0, glassG);
mesh(new THREE.CylinderGeometry(0.031, 0.029, 0.04, 14), new THREE.MeshStandardMaterial({ color: 0xd08a20, roughness: 0.1, transparent: true, opacity: 0.7, emissive: 0x6a3a00, emissiveIntensity: 0.4 }), 0, 0.022, 0, glassG);
var ringMark = mesh(new THREE.RingGeometry(0.03, 0.044, 24), new THREE.MeshBasicMaterial({ color: 0xffe6b0, transparent: true, opacity: 0.16, depthWrite: false }), 0.045, 0.001, 0.03, glassG); ringMark.rotation.x = -Math.PI / 2;
var glassProxy = mesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }), 0, 0.05, 0, glassG);

// ---------- THE PEOPLE, barely there ----------
function ghostTex(seed) {
return tex(128, 256, function(cx, w, h) {
var hr = 16 + rnd(seed) * 6, hx = w / 2, hy = 40;
try { cx.filter = 'blur(3px)'; } catch (e) {}
cx.fillStyle = 'rgba(255,225,180,0.85)';
cx.beginPath(); cx.arc(hx, hy, hr, 0, Math.PI * 2); cx.fill();
cx.beginPath(); cx.moveTo(hx - 34, h); cx.lineTo(hx - 30, hy + hr + 6); cx.quadraticCurveTo(hx, hy + hr - 6, hx + 30, hy + hr + 6); cx.lineTo(hx + 34, h); cx.closePath(); cx.fill();
// edge fade
try { cx.filter = 'none'; } catch (e) {}
var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(10,7,5,0)'); g.addColorStop(0.2, 'rgba(10,7,5,0.15)'); g.addColorStop(0.6, 'rgba(10,7,5,0.6)'); g.addColorStop(1, 'rgba(10,7,5,1)');
cx.globalCompositeOperation = 'destination-out'; cx.fillStyle = g; cx.fillRect(0, 0, w, h);
});
}
var ghosts = [];
[[0.62, 1.6, 1.95, 0.7, 0], [0.9, 1.05, 2.0, 0.56, 2], [1.4, 1.02, 1.85, 0.44, 4]].forEach(function(gs, i) {
var pAt = P1.clone().add(barDir.clone().multiplyScalar(gs[0] + i * 1.1)).add(barPerp.clone().multiplyScalar(gs[1]));
var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ghostTex(gs[4]), transparent: true, opacity: gs[3] * 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
sp.scale.set(0.9, 1.8, 1); sp.position.set(pAt.x, 0.9, pAt.z); scene.add(sp);
ghosts.push({ sp: sp, base: gs[3] * 0.5, ph: i * 2.1 });
});

// ---------- LIGHT ----------
scene.add(new THREE.AmbientLight(0x50300f, 0.38));
scene.add(new THREE.HemisphereLight(0xb06a24, 0x1a0804, 0.28));
var globeMat = new THREE.MeshBasicMaterial({ color: 0xfff0d0, fog: false, toneMapped: false });
var glowTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,225,160,0.9)'); g.addColorStop(0.3, 'rgba(255,190,100,0.35)'); g.addColorStop(0.7, 'rgba(220,140,50,0.08)'); g.addColorStop(1, 'rgba(180,100,30,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function globeGlow(x, y, z, sc) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0.85, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, fog: false })); sp.scale.set(sc, sc, 1); sp.position.set(x, y, z); scene.add(sp); return sp; }
var lampMain = new THREE.PointLight(0xffb060, 1.5, 9, 1.7); lampMain.position.set(0.4, 2.85, -0.3); lampMain.castShadow = true; lampMain.shadow.mapSize.set(512, 512); scene.add(lampMain);
mesh(new THREE.SphereGeometry(0.16, 16, 12), globeMat, 0.4, 2.85, -0.3); globeGlow(0.4, 2.85, -0.3, 0.7);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), brass, 0.4, 3.15, -0.3);
var lampBack = new THREE.PointLight(0xffa850, 0.9, 8, 1.7); lampBack.position.set(-0.6, 2.85, -2.6); scene.add(lampBack);
mesh(new THREE.SphereGeometry(0.16, 16, 12), globeMat, -0.6, 2.85, -2.6); globeGlow(-0.6, 2.85, -2.6, 1.3);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), brass, -0.6, 3.15, -2.6);
var barLight = new THREE.PointLight(0xffc070, 0.7, 6, 2); barLight.position.set(-2.9, 2.4, 0.4); scene.add(barLight);
var winLight = new THREE.PointLight(0xffd8a0, 0.5, 5, 2); winLight.position.set(3.2, 2.0, -2.4); scene.add(winLight);
// dust in the lamp light
var moteN = 40, moteBase = new Float32Array(moteN * 3), motePos = new Float32Array(moteN * 3);
for (var mi = 0; mi < moteN; mi++) { moteBase[mi * 3] = -1.5 + rnd(mi) * 3.5; moteBase[mi * 3 + 1] = 0.6 + rnd(mi + 1) * 2.4; moteBase[mi * 3 + 2] = -2 + rnd(mi + 2) * 4.5; }
motePos.set(moteBase);
var moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
scene.add(new THREE.Points(moteGeo, new THREE.PointsMaterial({ color: 0xffe0a0, size: 0.018, transparent: true, opacity: 0.45, depthWrite: false })));

var fiBtn = document.createElement('div');
// ---------- THE CLOSE-UPS ----------
// Each: what you click, where the camera goes, what the card says.
// Words in the cards are placeholders, pink, for Sam to write.
var PINK = 'color:#ff3aa8;text-shadow:0 0 4px rgba(255,58,168,0.45);';
var HOTSPOTS = [
{ root: photoG, name: 'the photographs', pos: [0.2, 1.95, -2.4], tgt: [0.9, 2.0, -4.5],
line: 'Eight frames on the back wall, seven of them faces the bar still drinks to, and one gone pale where the sun has had it. [Sam: the photo wall]' },
{ root: phoneG, name: 'the telephone', pos: [-2.2, 1.6, 0.6], tgt: [-3.45, 1.32, -0.35],
line: 'The phone behind the bar, black, off duty, the handset lying in its cradle like something asleep with one eye open. [Sam: the phone that rings]' },
{ root: glassG, name: 'the glass on the bar', pos: [-0.9, 1.5, 0.35], tgt: [gp.x, 1.16, gp.z],
line: 'Half a drink left on the counter and the ring beside it where the last one stood; whoever it was has stepped out, or never came back. [Sam: the glass someone left]' },
{ root: doorG, name: 'the blue door', pos: [1.9, 1.5, -2.3], tgt: [2.45, 1.3, -4.5],
line: 'The blue door at the back, the one to the stairs, with a line of light under it that was not there a moment ago. [Sam: the door to upstairs]' },
{ root: barG, name: 'the bar', pos: [-1.05, 1.45, 1.55], tgt: [-2.55, 1.25, -0.4], enter: true }
];
var hotspotRoots = HOTSPOTS.map(function(h) { return h.root; });
function hotspotFor(obj) { while (obj) { var i = hotspotRoots.indexOf(obj); if (i >= 0) return HOTSPOTS[i]; obj = obj.parent; } return null; }
// hover halo, the warm colour of the room
var haloTex = tex(128, 128, function(cx, w, h) {
var g = cx.createRadialGradient(w / 2, h / 2, 1, w / 2, h / 2, w / 2);
g.addColorStop(0, 'rgba(255,218,140,0.5)'); g.addColorStop(0.4, 'rgba(244,188,90,0.22)'); g.addColorStop(0.75, 'rgba(212,150,45,0.08)'); g.addColorStop(1, 'rgba(180,120,30,0)');
cx.fillStyle = g; cx.fillRect(0, 0, w, h);
});
var halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, transparent: true, opacity: 0.8, depthWrite: false, depthTest: false }));
halo.visible = false; halo.scale.set(0.5, 0.5, 1); scene.add(halo);
function haloAt(spot) {
var wp = new THREE.Vector3();
if (spot.root === photoG) wp.set(0.4, 2.0, -4.4);
else if (spot.root === barG) wp.set(-1.7, 1.2, 0.5);
else if (spot.root === doorG) wp.set(2.45, 1.3, -4.4);
else spot.root.getWorldPosition(wp);
halo.position.copy(wp);
var sc = spot.root === barG || spot.root === photoG ? 1.4 : spot.root === doorG ? 1.1 : 0.42;
halo.scale.set(sc, sc, 1);
}
// the card
var card = document.createElement('div');
card.style.cssText = 'position:absolute;left:50%;bottom:64px;transform:translateX(-50%);width:min(560px,86vw);' +
'font:15px/1.5 \'Crimson Text\',Georgia,serif;color:rgba(220,198,150,0.92);text-align:center;' +
'background:rgba(10,7,4,0.74);border:1px solid rgba(200,168,106,0.32);padding:14px 22px 12px;border-radius:2px;' +
'pointer-events:none;z-index:9004;opacity:0;transition:opacity 0.7s ease;';
fiWrap.appendChild(card);
function showCard(spot) {
card.innerHTML = '<div style="font:11px \'Courier New\',monospace;letter-spacing:3px;color:rgba(200,180,140,0.5);margin-bottom:6px;text-transform:uppercase;">' + spot.name + '</div>' +
'<div style="' + PINK + '">' + spot.line + '</div>' +
'<div style="font:10px \'Courier New\',monospace;letter-spacing:2px;color:rgba(200,180,140,0.32);margin-top:8px;">CLICK ANYWHERE TO STEP BACK</div>';
card.style.opacity = '1';
}
// the camera
var camMode = 'idle', camK = 0, camNext = 'idle', activeSpot = null, hoverSpot = null, leaving = false;
var camFromP = new THREE.Vector3(), camFromT = new THREE.Vector3(), camToP = new THREE.Vector3(), camToT = new THREE.Vector3();
var curTarget = new THREE.Vector3(CAM.tx, CAM.ty, CAM.tz);
function beginTween(toP, toT, next) {
camFromP.copy(camera.position); camFromT.copy(curTarget);
camToP.set(toP[0], toP[1], toP[2]); camToT.set(toT[0], toT[1], toT[2]);
camK = fiStill ? 1 : 0; camNext = next; camMode = 'tween';
}
var ray = new THREE.Raycaster(), mouseN = new THREE.Vector2();
function pick(ev) {
var r = fiCanvas.getBoundingClientRect();
mouseN.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
ray.setFromCamera(mouseN, camera);
var hits = ray.intersectObjects(hotspotRoots, true);
return hits.length ? hotspotFor(hits[0].object) : null;
}
fiCanvas.addEventListener('pointermove', function(ev) {
if (camMode !== 'idle' || ev.pointerType === 'touch') { hoverSpot = null; halo.visible = false; return; }
var spot = pick(ev); hoverSpot = spot;
if (spot) { haloAt(spot); halo.visible = true; fiCanvas.style.cursor = 'pointer'; }
else { halo.visible = false; fiCanvas.style.cursor = 'default'; }
});
function goIn() {
if (leaving) return; leaving = true;
var curtain = document.createElement('div'); curtain.style.cssText = 'position:absolute;inset:0;background:#0a0705;opacity:0;transition:opacity 1.2s ease;z-index:9006;pointer-events:none;'; fiWrap.appendChild(curtain); requestAnimationFrame(function() { curtain.style.opacity = '1'; });
setTimeout(function() {
if (fiAnimId) cancelAnimationFrame(fiAnimId);
var TARGET = 'The French';
var link = document.querySelector('tw-link[passage-name="' + TARGET + '"]');
if (!link) { var all = document.querySelectorAll('tw-passage tw-link'); for (var i = 0; i < all.length; i++) { if (all[i].textContent.trim() === '·') { link = all[i]; break; } } }
if (link) { link.click(); }
else { var storyEl = document.querySelector('tw-story') || document.body; var inj = document.createElement('tw-link'); inj.setAttribute('passage-name', TARGET); inj.style.display = 'none'; storyEl.appendChild(inj); inj.click(); storyEl.removeChild(inj); }
}, 1200);
}
fiCanvas.addEventListener('pointerdown', function(ev) {
if (camMode === 'tween' || leaving) return;
if (camMode === 'inspect') {
activeSpot = null; card.style.opacity = '0'; doorLight.intensity = 0; doorGlow.material.opacity = 0; fiBtn.style.opacity = '1'; fiBtn.style.pointerEvents = '';
beginTween([CAM.x, CAM.y, CAM.z], [CAM.tx, CAM.ty, CAM.tz], 'idle');
return;
}
var spot = ev.pointerType === 'touch' ? pick(ev) : (hoverSpot || pick(ev));
if (!spot) return;
if (spot.enter) { beginTween(spot.pos, spot.tgt, 'enter'); setTimeout(goIn, fiStill ? 100 : 700); return; }
activeSpot = spot; halo.visible = false; fiCanvas.style.cursor = 'default';
showCard(spot); fiBtn.style.opacity = '0'; fiBtn.style.pointerEvents = 'none';
beginTween(spot.pos, spot.tgt, 'inspect');
if (spot.root === doorG) { doorLight.intensity = 0.9; doorGlow.material.opacity = 0.55; }
});

// ---------- THE WAY ON ----------
fiBtn.textContent = 'TO THE BAR';
fiBtn.style.cssText = ['position:absolute', 'bottom:60px', 'left:50%', 'transform:translateX(-50%)', 'font:13px \'Courier New\',monospace', 'color:rgba(200,170,100,0.85)', 'letter-spacing:4px', 'cursor:pointer', 'padding:12px 28px', 'border:1px solid rgba(200,170,100,0.3)', 'background:rgba(0,0,0,0.4)', 'z-index:9005', 'white-space:nowrap', 'opacity:0', 'transition:opacity 1.5s ease'].join(';');
fiWrap.appendChild(fiBtn);
setTimeout(function() { fiBtn.style.opacity = '1'; }, 1500);
fiBtn.addEventListener('mouseenter', function() { this.style.color = 'rgba(230,200,120,0.95)'; this.style.borderColor = 'rgba(200,170,100,0.6)'; });
fiBtn.addEventListener('mouseleave', function() { this.style.color = 'rgba(200,170,100,0.85)'; this.style.borderColor = 'rgba(200,170,100,0.3)'; });
fiBtn.addEventListener('click', function() { if (camMode === 'idle') { beginTween(HOTSPOTS[4].pos, HOTSPOTS[4].tgt, 'enter'); setTimeout(goIn, fiStill ? 100 : 700); } else goIn(); });
var fiHint = document.createElement('div');
fiHint.textContent = 'LOOK CLOSER AT WHAT CATCHES YOUR EYE';
fiHint.style.cssText = 'position:absolute;top:26px;left:50%;transform:translateX(-50%);font:11px \'Courier New\',monospace;color:rgba(200,180,140,0.3);letter-spacing:3px;white-space:nowrap;z-index:9003;pointer-events:none;opacity:0;transition:opacity 2s ease;text-align:center;max-width:90vw;white-space:normal;';
fiWrap.appendChild(fiHint);
setTimeout(function() { fiHint.style.opacity = '1'; }, 2600);
setTimeout(function() { fiHint.style.opacity = '0'; }, 9000);

// ---------- FRAMES ----------
var clock = new THREE.Clock();
window._dssThreeRegistry['fi-wrap'].camera = camera;
function fiAnimate() {
fiAnimId = requestAnimationFrame(fiAnimate);
var dt = Math.min(0.1, clock.getDelta());
var t = fiStill ? 0 : clock.getElapsedTime();
if (camMode === 'idle') {
camera.position.set(CAM.x + Math.sin(t * 0.11) * 0.05, CAM.y + Math.sin(t * 0.17) * 0.02, CAM.z);
curTarget.set(CAM.tx, CAM.ty, CAM.tz);
} else if (camMode === 'tween') {
camK = Math.min(1, camK + dt / 1.5);
var e = camK * camK * (3 - 2 * camK);
camera.position.lerpVectors(camFromP, camToP, e); curTarget.lerpVectors(camFromT, camToT, e);
if (camK >= 1) camMode = camNext;
} else {
camera.position.x = camToP.x + Math.sin(t * 0.3) * 0.008; camera.position.y = camToP.y + Math.sin(t * 0.45) * 0.005;
}
camera.lookAt(curTarget);
fiWrap.dataset.cam = camMode;
if (!fiStill) {
lampMain.intensity = 1.5 + Math.sin(t * 7.3) * 0.02 + Math.sin(t * 1.7) * 0.03;
for (var gi = 0; gi < ghosts.length; gi++) { var g = ghosts[gi]; g.sp.material.opacity = g.base * (0.7 + 0.3 * Math.sin(t * 0.23 + g.ph)); }
for (var m = 0; m < moteN; m++) { motePos[m * 3] = moteBase[m * 3] + Math.sin(t * 0.15 + m) * 0.08; motePos[m * 3 + 1] = 0.6 + ((moteBase[m * 3 + 1] - 0.6 + (m % 2 ? 1 : -1) * t * 0.04) % 2.4 + 2.4) % 2.4; }
moteGeo.attributes.position.needsUpdate = true;
if (halo.visible) { halo.material.opacity = 0.7 + Math.sin(t * 3.2) * 0.25; }
}
renderer.render(scene, camera);
}
fiAnimate();
}

setInterval(function() {
var container = document.getElementById('fi-container');
if (container && !fiActive) {
initFrenchInside();
} else if (!container) {
fiActive = false;
if (fiAnimId) { cancelAnimationFrame(fiAnimId); fiAnimId = null; }
window._dssDisposeWrap('fi-wrap');
}
}, 300);
})();

