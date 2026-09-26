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
renderer.toneMappingExposure = 0.6;
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

function tex(w, h, fn) {
var c = document.createElement('canvas'); c.width = w; c.height = h;
var cx = c.getContext('2d'); fn(cx, w, h);
var t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearMipmapLinearFilter;
t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
return t;
}
function rnd(seed) { var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function mesh(geo, mat, x, y, z, parent) { var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || scene).add(m); return m; }

// ---------- THE ROOM: 5 by 4, ceiling low ----------
var W = 5.2, D = 4.2, H = 2.55;
// the bilious green, "less salad than submarine": a murky green under yellowed varnish, uneven
var wallTex = tex(512, 256, function(cx, w, h) {
cx.fillStyle = '#3d5a2c'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 900; i++) { var x = rnd(i) * w, y = rnd(i + 7) * h, r = 4 + rnd(i + 3) * 26; var g = cx.createRadialGradient(x, y, 0, x, y, r); var k = rnd(i + 11); g.addColorStop(0, k < 0.5 ? 'rgba(90,120,60,0.16)' : 'rgba(40,60,30,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); }
// nicotine towards the top
var ng = cx.createLinearGradient(0, 0, 0, h); ng.addColorStop(0, 'rgba(120,100,30,0.28)'); ng.addColorStop(0.5, 'rgba(120,100,30,0.04)'); ng.addColorStop(1, 'rgba(0,0,0,0.12)'); cx.fillStyle = ng; cx.fillRect(0, 0, w, h);
});
wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping; wallTex.repeat.set(2, 1);
var wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.82, metalness: 0.02 });
var ceilTex = tex(256, 256, function(cx, w, h) { cx.fillStyle = '#8a7a48'; cx.fillRect(0, 0, w, h); for (var i = 0; i < 300; i++) { cx.fillStyle = 'rgba(' + (60 + rnd(i) * 40 | 0) + ',' + (50 + rnd(i + 1) * 30 | 0) + ',20,0.14)'; var x = rnd(i + 2) * w, y = rnd(i + 3) * h; cx.beginPath(); cx.arc(x, y, 3 + rnd(i + 4) * 30, 0, 6.3); cx.fill(); } });
var ceilMat = new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.95 });
var carpetTex = tex(512, 512, function(cx, w, h) {
cx.fillStyle = '#2a2418'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 4000; i++) { cx.fillStyle = rnd(i) < 0.5 ? 'rgba(80,60,30,0.35)' : 'rgba(40,50,28,0.35)'; cx.fillRect(rnd(i + 1) * w, rnd(i + 2) * h, 2, 2); }
// a worn pattern, lozenges, mostly gone
cx.strokeStyle = 'rgba(120,90,40,0.16)'; cx.lineWidth = 2;
for (var x = 0; x < w; x += 64) for (var y = 0; y < h; y += 64) { cx.beginPath(); cx.moveTo(x + 32, y); cx.lineTo(x + 64, y + 32); cx.lineTo(x + 32, y + 64); cx.lineTo(x, y + 32); cx.closePath(); cx.stroke(); }
});
carpetTex.wrapS = carpetTex.wrapT = THREE.RepeatWrapping; carpetTex.repeat.set(3, 2.5);
var carpetMat = new THREE.MeshStandardMaterial({ map: carpetTex, roughness: 1 });
var floor = mesh(new THREE.PlaneGeometry(W, D), carpetMat, 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceil = mesh(new THREE.PlaneGeometry(W, D), ceilMat, 0, H, 0); ceil.rotation.x = Math.PI / 2;
var back = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2); back.receiveShadow = true;
var front = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, D / 2); front.rotation.y = Math.PI;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2;
var right = mesh(new THREE.PlaneGeometry(D, H), wallMat, W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2;
// dado and skirting, dark varnished
var woodMat = new THREE.MeshStandardMaterial({ color: 0x3a2412, roughness: 0.55, metalness: 0.05 });
[[0, -D / 2 + 0.02, W, 0], [0, D / 2 - 0.02, W, Math.PI], [-W / 2 + 0.02, 0, D, Math.PI / 2], [W / 2 - 0.02, 0, D, -Math.PI / 2]].forEach(function(s) {
var sk = mesh(new THREE.BoxGeometry(s[2], 0.12, 0.03), woodMat, s[0], 0.06, s[1]); sk.rotation.y = s[3];
var dd = mesh(new THREE.BoxGeometry(s[2], 0.04, 0.03), woodMat, s[0], 0.95, s[1]); dd.rotation.y = s[3];
});

// ---------- THE PICTURES, crowding every wall ----------
var picG = new THREE.Group(); scene.add(picG);
var frameMats = [new THREE.MeshStandardMaterial({ color: 0x8a6a22, roughness: 0.5, metalness: 0.5 }), new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.6 }), new THREE.MeshStandardMaterial({ color: 0x5a4a30, roughness: 0.7 })];
function pictureTex(seed) {
return tex(96, 96, function(cx, w, h) {
var kind = rnd(seed + 0.5);
if (kind < 0.3) { // a photograph, sepia
cx.fillStyle = '#5a4a32'; cx.fillRect(0, 0, w, h); cx.fillStyle = 'rgba(210,190,150,0.7)'; cx.beginPath(); cx.arc(w / 2, h * 0.42, 14, 0, 6.3); cx.fill(); cx.fillRect(w / 2 - 22, h * 0.6, 44, 40); cx.fillStyle = 'rgba(0,0,0,0.35)'; cx.fillRect(0, 0, w, 8);
} else if (kind < 0.65) { // a painting, daubs
var cols = ['#8a2a1a', '#c8a030', '#2a4a7a', '#5a7a2a', '#d8c8a0', '#1a1a1a', '#b05a6a'];
cx.fillStyle = cols[(seed * 3 | 0) % cols.length]; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 14; i++) { cx.fillStyle = cols[(seed * 7 + i) % cols.length]; cx.globalAlpha = 0.75; cx.beginPath(); cx.ellipse(rnd(seed + i) * w, rnd(seed + i + 40) * h, 8 + rnd(seed + i + 80) * 26, 6 + rnd(seed + i + 120) * 20, rnd(i) * 3, 0, 6.3); cx.fill(); }
cx.globalAlpha = 1;
} else { // a drawing on paper
cx.fillStyle = '#d8ccb0'; cx.fillRect(0, 0, w, h); cx.strokeStyle = 'rgba(30,20,10,0.8)'; cx.lineWidth = 1.5; cx.beginPath();
for (var j = 0; j < 9; j++) { var x = rnd(seed + j * 3) * w, y = rnd(seed + j * 5) * h; if (j === 0) cx.moveTo(x, y); else cx.quadraticCurveTo(rnd(seed + j) * w, rnd(seed + j + 9) * h, x, y); }
cx.stroke();
}
// varnish and dust
var g = cx.createLinearGradient(0, 0, w, h); g.addColorStop(0, 'rgba(255,240,200,0.12)'); g.addColorStop(1, 'rgba(0,0,0,0.25)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
});
}
var picN = 0;
function hang(x, y, z, ry, w, h, seed) {
var g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; picG.add(g);
var fm = frameMats[(seed * 5 | 0) % 3];
mesh(new THREE.BoxGeometry(w + 0.06, h + 0.06, 0.03), fm, 0, 0, 0.015, g);
var canvasM = mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: pictureTex(seed), roughness: 0.8 }), 0, 0, 0.032, g);
g.rotation.z = (rnd(seed + 99) - 0.5) * 0.06;
picN++;
}
// the back wall, over the bar; the right wall around the piano; the front wall beside the window; the left wall
var wallsToHang = [
{ x0: -W / 2 + 0.3, x1: W / 2 - 0.3, z: -D / 2 + 0.005, ry: 0, axis: 'x' },
{ x0: -D / 2 + 0.3, x1: D / 2 - 0.9, z: W / 2 - 0.005, ry: -Math.PI / 2, axis: 'z' },
{ x0: -W / 2 + 0.3, x1: W / 2 - 1.5, z: D / 2 - 0.005, ry: Math.PI, axis: 'x' },
{ x0: -D / 2 + 0.3, x1: D / 2 - 0.3, z: -W / 2 + 0.005, ry: Math.PI / 2, axis: 'z' }
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
var bamboo = tex(128, 256, function(cx, w, h) {
cx.fillStyle = '#b89a58'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 12; i++) { var x = i * 11; cx.fillStyle = i % 2 ? '#c8ac68' : '#a88a48'; cx.fillRect(x, 0, 10, h); cx.fillStyle = 'rgba(70,45,15,0.7)'; for (var y = 12 + rnd(i) * 30; y < h; y += 40 + rnd(i + y) * 24) cx.fillRect(x, y, 10, 3); cx.fillStyle = 'rgba(0,0,0,0.25)'; cx.fillRect(x + 8, 0, 2, h); }
});
bamboo.wrapS = bamboo.wrapT = THREE.RepeatWrapping; bamboo.repeat.set(4, 1);
var bambooMat = new THREE.MeshStandardMaterial({ map: bamboo, roughness: 0.7 });
var counterMat = new THREE.MeshStandardMaterial({ color: 0x2c1a0c, roughness: 0.28, metalness: 0.12 });
var barX0 = -W / 2, barX1 = -0.55, barZ = -D / 2 + 0.7, barLen = barX1 - barX0;
var body = mesh(new THREE.BoxGeometry(barLen, 1.05, 0.55), bambooMat, (barX0 + barX1) / 2, 0.525, barZ, barG); body.castShadow = true; body.receiveShadow = true;
var top = mesh(new THREE.BoxGeometry(barLen + 0.08, 0.05, 0.66), counterMat, (barX0 + barX1) / 2, 1.075, barZ, barG); top.receiveShadow = true;
// the back bar: a mirror gone smoky, two shelves of bottles, the till
var mirrorMat = new THREE.MeshStandardMaterial({ color: 0x9aa890, roughness: 0.25, metalness: 0.85 });
mesh(new THREE.PlaneGeometry(barLen - 0.2, 0.9), mirrorMat, (barX0 + barX1) / 2, 1.65, -D / 2 + 0.01, barG);
var shelfMat = new THREE.MeshStandardMaterial({ color: 0x2a1a0e, roughness: 0.5 });
[1.28, 1.72].forEach(function(sy, si) {
mesh(new THREE.BoxGeometry(barLen - 0.2, 0.03, 0.22), shelfMat, (barX0 + barX1) / 2, sy, -D / 2 + 0.12, barG);
var n = 9 + si * 2;
for (var i = 0; i < n; i++) {
var bx = barX0 + 0.15 + i * ((barLen - 0.4) / n), hgt = 0.2 + rnd(i + si * 30) * 0.12;
var bc = [0x1e3a1e, 0x4a2a10, 0x8a7a30, 0x2a2a3a, 0x6a1a1a, 0xc8c0a0][(rnd(i + si * 7) * 6) | 0];
var bm = new THREE.MeshStandardMaterial({ color: bc, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.85 });
mesh(new THREE.CylinderGeometry(0.03, 0.035, hgt, 10), bm, bx, sy + hgt / 2 + 0.015, -D / 2 + 0.12, barG);
mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.07, 8), bm, bx, sy + hgt + 0.05, -D / 2 + 0.12, barG);
}
});
var till = mesh(new THREE.BoxGeometry(0.34, 0.26, 0.3), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.4 }), barX1 - 0.45, 1.23, -D / 2 + 0.22, barG);
// bamboo stools
var stoolG = new THREE.Group(); scene.add(stoolG);
function stool(x, z) {
var g = new THREE.Group(); g.position.set(x, 0, z); stoolG.add(g);
var legM = bambooMat;
[[-0.13, -0.13], [0.13, -0.13], [-0.13, 0.13], [0.13, 0.13]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.62, 8), legM, l[0], 0.31, l[1], g); });
mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.04, 16), new THREE.MeshStandardMaterial({ color: 0x5a2a20, roughness: 0.7 }), 0, 0.64, 0, g).castShadow = true;
return g;
}
stool(-2.05, barZ + 0.62); stool(-1.35, barZ + 0.62);
// a glass and an ashtray on the counter
var glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, metalness: 0, transmission: 0.9, thickness: 0.02, transparent: true, opacity: 0.6 });
mesh(new THREE.CylinderGeometry(0.03, 0.025, 0.1, 12), glassMat, -1.5, 1.15, barZ + 0.1, barG);
mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.02, 12), new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.3, metalness: 0.5 }), -0.9, 1.11, barZ + 0.12, barG);

// ---------- THE TELEPHONE, at the end of the bar ----------
var phoneG = new THREE.Group(); phoneG.position.set(barX1 - 0.12, 1.1, barZ - 0.1); scene.add(phoneG);
var bakelite = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.32, metalness: 0.1 });
mesh(new THREE.BoxGeometry(0.2, 0.08, 0.16), bakelite, 0, 0.04, 0, phoneG);
mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 20), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.3 }), 0, 0.085, 0.03, phoneG);
var hs = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.2, 10), bakelite, 0, 0.12, -0.02, phoneG); hs.rotation.z = Math.PI / 2;
mesh(new THREE.SphereGeometry(0.03, 10, 8), bakelite, -0.1, 0.11, -0.02, phoneG); mesh(new THREE.SphereGeometry(0.03, 10, 8), bakelite, 0.1, 0.11, -0.02, phoneG);
var phoneHit = mesh(new THREE.BoxGeometry(0.34, 0.3, 0.3), new THREE.MeshBasicMaterial({ visible: false }), 0, 0.12, 0, phoneG);

// ---------- THE PIANO, upright, against the right wall ----------
var pianoG = new THREE.Group(); pianoG.position.set(W / 2 - 0.34, 0, -0.55); pianoG.rotation.y = -Math.PI / 2; scene.add(pianoG);
var pianoMat = new THREE.MeshStandardMaterial({ color: 0x241408, roughness: 0.3, metalness: 0.1 });
var pb = mesh(new THREE.BoxGeometry(1.4, 1.25, 0.6), pianoMat, 0, 0.625, 0, pianoG); pb.castShadow = true; pb.receiveShadow = true;
mesh(new THREE.BoxGeometry(1.42, 0.04, 0.34), pianoMat, 0, 0.82, 0.3, pianoG); // the key shelf lid, closed
var keys = mesh(new THREE.BoxGeometry(1.2, 0.02, 0.14), new THREE.MeshStandardMaterial({ color: 0xe8e0c8, roughness: 0.4 }), 0, 0.84, 0.36, pianoG);
for (var k = 0; k < 30; k++) if (k % 7 !== 2 && k % 7 !== 5) mesh(new THREE.BoxGeometry(0.02, 0.012, 0.08), bakelite, -0.58 + k * 0.04, 0.855, 0.33, pianoG);
mesh(new THREE.BoxGeometry(1.3, 0.14, 0.02), new THREE.MeshStandardMaterial({ color: 0x4a2a12, roughness: 0.5 }), 0, 1.1, 0.31, pianoG); // the music rest
// a candle in a bottle and an empty glass on top
mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.22, 10), new THREE.MeshStandardMaterial({ color: 0x1e3a1e, roughness: 0.2, transparent: true, opacity: 0.85 }), 0.45, 1.36, 0, pianoG);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), new THREE.MeshStandardMaterial({ color: 0xf0e8d0, roughness: 0.9 }), 0.45, 1.53, 0, pianoG);
var candle = new THREE.PointLight(0xffb060, 0.5, 2.2); candle.position.set(0.45, 1.62, 0); pianoG.add(candle);
var flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(32, 32, function(cx, w, h) { var g = cx.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,230,160,1)'); g.addColorStop(0.4, 'rgba(255,170,60,0.6)'); g.addColorStop(1, 'rgba(255,120,20,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); }), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); flame.scale.set(0.06, 0.09, 1); flame.position.set(0.45, 1.62, 0); pianoG.add(flame);
mesh(new THREE.CylinderGeometry(0.03, 0.025, 0.1, 12), glassMat, -0.4, 1.3, 0.05, pianoG);
// a piano stool
var pst = mesh(new THREE.BoxGeometry(0.5, 0.06, 0.32), new THREE.MeshStandardMaterial({ color: 0x5a2a20, roughness: 0.7 }), 0, 0.5, 0.75, pianoG);
[[-0.2, 0.62], [0.2, 0.62], [-0.2, 0.88], [0.2, 0.88]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), pianoMat, l[0], 0.25, l[1], pianoG); });

// ---------- THE WINDOW, onto Dean Street, on the right wall by the front ----------
var winG = new THREE.Group(); winG.position.set(W / 2 - 0.02, 1.55, 1.15); winG.rotation.y = -Math.PI / 2; scene.add(winG);
var winTex = tex(128, 192, function(cx, w, h) {
var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1a2030'); g.addColorStop(0.55, '#3a3a40'); g.addColorStop(1, '#6a5030'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
cx.fillStyle = 'rgba(255,200,120,0.5)'; cx.fillRect(30, 110, 6, 8); cx.fillRect(80, 118, 5, 7);
cx.fillStyle = 'rgba(230,230,230,0.35)'; for (var i = 0; i < 8; i++) cx.fillRect(4 + i * 16, 0, 3, h); // net curtain
});
var winPane = mesh(new THREE.PlaneGeometry(1.0, 1.4), new THREE.MeshBasicMaterial({ map: winTex, toneMapped: false }), 0, 0, 0, winG);
var sashMat = new THREE.MeshStandardMaterial({ color: 0xc8c0a8, roughness: 0.7 });
mesh(new THREE.BoxGeometry(1.1, 0.06, 0.06), sashMat, 0, 0.72, 0.03, winG); mesh(new THREE.BoxGeometry(1.1, 0.06, 0.06), sashMat, 0, -0.72, 0.03, winG);
mesh(new THREE.BoxGeometry(0.06, 1.44, 0.06), sashMat, -0.52, 0, 0.03, winG); mesh(new THREE.BoxGeometry(0.06, 1.44, 0.06), sashMat, 0.52, 0, 0.03, winG);
mesh(new THREE.BoxGeometry(1.04, 0.04, 0.05), sashMat, 0, 0, 0.03, winG); mesh(new THREE.BoxGeometry(0.04, 1.4, 0.05), sashMat, 0, 0, 0.03, winG);
var winGlow = new THREE.PointLight(0x8090b0, 0.35, 3.5); winGlow.position.set(W / 2 - 0.5, 1.55, 1.15); scene.add(winGlow);

// ---------- THE AGENT'S TABLE, bamboo, by the window ----------
var tableG = new THREE.Group(); tableG.position.set(1.35, 0, 0.75); scene.add(tableG);
mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.03, 20), new THREE.MeshStandardMaterial({ color: 0x3a2412, roughness: 0.4 }), 0, 0.72, 0, tableG).castShadow = true;
mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.7, 10), bambooMat, 0, 0.36, 0, tableG);
mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 16), bambooMat, 0, 0.02, 0, tableG);
mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.12, 12), glassMat, 0.1, 0.795, 0.06, tableG);
mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.12, 12), glassMat, -0.12, 0.795, -0.08, tableG);
// a bamboo chair each side
function chair(x, z, ry) {
var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; tableG.add(g);
[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.46, 8), bambooMat, l[0], 0.23, l[1], g); });
mesh(new THREE.BoxGeometry(0.42, 0.04, 0.42), new THREE.MeshStandardMaterial({ color: 0x5a2a20, roughness: 0.7 }), 0, 0.47, 0, g);
mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.5, 8), bambooMat, -0.18, 0.72, -0.18, g); mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.5, 8), bambooMat, 0.18, 0.72, -0.18, g);
mesh(new THREE.BoxGeometry(0.4, 0.05, 0.03), bambooMat, 0, 0.95, -0.18, g);
}
chair(0, -0.5, 0); chair(0.55, 0.05, -Math.PI / 2);

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
var davy = ghost(-1.35, barZ + 0.62, 0, 0.34, false);        // the man at the bar, on the second stool
var agent = ghost(1.35, 0.25, 2, 0.3, true);                // the agent, at his table, with his back half to the room
var pianist = ghost(W / 2 - 1.1, -0.55, 4, 0.2, true);      // someone at the piano, not playing

// ---------- LIGHT: dim, greenish, a shaded pendant, a lamp over the bar ----------
scene.add(new THREE.AmbientLight(0x3a4a2a, 0.5));
scene.add(new THREE.HemisphereLight(0x8a9a50, 0x101408, 0.3));
var pend = new THREE.PointLight(0xffd090, 1.1, 7, 1.6); pend.position.set(0.2, H - 0.45, -0.2); pend.castShadow = true; pend.shadow.mapSize.set(1024, 1024); pend.shadow.bias = -0.002; scene.add(pend);
mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.35, 6), bakelite, 0.2, H - 0.18, -0.2);
var shade = mesh(new THREE.ConeGeometry(0.28, 0.22, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0x6a5a20, roughness: 0.8, side: THREE.DoubleSide, emissive: 0x4a3a10, emissiveIntensity: 0.6 }), 0.2, H - 0.36, -0.2);
mesh(new THREE.SphereGeometry(0.07, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffe8b0, toneMapped: false }), 0.2, H - 0.45, -0.2);
var barLamp = new THREE.PointLight(0xc8ff90, 0.6, 3.2); barLamp.position.set(-1.6, 1.95, -D / 2 + 0.5); scene.add(barLamp);
var greenShade = mesh(new THREE.SphereGeometry(0.12, 16, 12, 0, 6.3, 0, 1.7), new THREE.MeshStandardMaterial({ color: 0x2a6a2a, roughness: 0.5, emissive: 0x1a4a1a, emissiveIntensity: 0.8, side: THREE.DoubleSide }), -1.6, 1.98, -D / 2 + 0.5);
// smoke in the lamplight
var moteN = 240, motePos = new Float32Array(moteN * 3);
for (var i = 0; i < moteN; i++) { motePos[i * 3] = (rnd(i) - 0.5) * W; motePos[i * 3 + 1] = 0.6 + rnd(i + 1) * (H - 0.8); motePos[i * 3 + 2] = (rnd(i + 2) - 0.5) * D; }
var moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
var motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({ color: 0xd8e8b0, size: 0.02, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(motes);

// ---------- THE CLOSE-UPS, AND THE PATHS ----------
var PINK = 'color:#ff3aa8;text-shadow:0 0 4px rgba(255,58,168,0.45);';
function passageLinks(sel) {
var pass = ciHost.closest('tw-passage') || document.querySelector('tw-passage');
if (!pass) return [];
return Array.prototype.slice.call(pass.querySelectorAll(sel)).filter(function(l) { return !ciWrap.contains(l) && l.getClientRects().length > 0; });
}
function byText(texts) { return passageLinks('tw-link').filter(function(l) { return texts.indexOf(l.textContent.trim()) >= 0; }); }
var HOTSPOTS = [
{ root: picG, name: 'the pictures', pos: [-0.3, 1.6, -1.2], tgt: [0.4, 1.75, -2.2], haloAt: [0.2, 1.7, -D / 2 + 0.05], haloSc: 1.6,
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
pend.intensity = 1.1 + 0.03 * Math.sin(t * 0.7);
var mp = moteGeo.attributes.position.array;
for (var i = 0; i < moteN; i++) { mp[i * 3 + 1] += dt * 0.012 * (0.5 + rnd(i)); mp[i * 3] += Math.sin(t * 0.3 + i) * dt * 0.01; if (mp[i * 3 + 1] > H - 0.2) mp[i * 3 + 1] = 0.6; }
moteGeo.attributes.position.needsUpdate = true;
}
renderer.render(scene, camera);
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

