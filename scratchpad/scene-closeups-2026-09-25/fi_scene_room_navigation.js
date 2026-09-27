// ====== INSIDE THE FRENCH — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-25. The first "look closer" scene, carried over from the
// Fagin's Den mechanism in the Oliver Twist files: hotspots in the 3D
// room, a hover halo, click and the camera pushes in on the thing and a
// caption card opens; click anywhere to step back. Built to Sam's photo
// of the French House bar (counter on the left, the photo wall at the
// back, the frieze of prints under the ceiling, the blue door on the
// right).
// 2026-09-26 (Sam: "you are already in the French; the clicks should
// give you different paths through it"): the room now sits at the top
// of The French passage itself (#fi-container there) and is its
// navigation. Every path stays a Harlowe link in the passage below,
// with its own gate; the room only finds those links in the rendered
// passage and clicks them. The bar opens the drink when the passage
// offers it; the telephone shows the call choices when it is ringing;
// the figures at the bar are the Stranger, the artists, the novelist
// and the sketch when their links exist. Nothing is decided in JS.
// The card's inspection words are pink placeholders for Sam.
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
var fiHost = document.getElementById('fi-container');
if (!fiHost) { fiActive = false; return; }
var fiWrap = document.createElement('div');
fiWrap.id = 'fi-wrap';
function fiSize() {
var w = Math.max(280, document.documentElement.clientWidth || window.innerWidth);
var vh = window.innerHeight || 800;
var h = Math.round(w < 600 ? Math.max(300, vh * 0.56) : Math.max(320, Math.min(vh * 0.66, 680)));
return { w: w, h: h };
}
var fiSz = fiSize();
// Full-bleed inside the passage column: as wide as the window, stacked below the header, the prose and links follow underneath.
fiWrap.style.cssText = 'position:relative;width:100vw;margin-left:calc(50% - 50vw);height:' + fiSz.h + 'px;z-index:0;isolation:isolate;background:#0a0705;overflow:hidden;';
var fiCanvas = document.createElement('canvas');
fiCanvas.width = fiSz.w;
fiCanvas.height = fiSz.h;
fiCanvas.style.cssText = 'display:block;position:absolute;top:0;left:0;width:100%;height:100%;touch-action:manipulation;';
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
fiHost.appendChild(fiWrap);
fiSz = fiSize(); fiWrap.style.height = fiSz.h + 'px';

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0705);
scene.fog = new THREE.FogExp2(0x120b06, 0.055);
var aspect = fiSz.w / fiSz.h;
var portrait = aspect < 1;
var camera = new THREE.PerspectiveCamera(portrait ? 78 : 52, aspect, 0.05, 60);
var CAM = portrait ? { x: 1.3, y: 1.5, z: 4.1, tx: -1.45, ty: 1.2, tz: -1.4 } : { x: 1.05, y: 1.5, z: 3.4, tx: -0.35, ty: 1.28, tz: -1.4 };
camera.position.set(CAM.x, CAM.y, CAM.z);

var renderer = new THREE.WebGLRenderer({ canvas: fiCanvas, antialias: true });
renderer.setSize(fiSz.w, fiSz.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, fiSz.w < 600 ? 1.25 : 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.55;
window._dssBindScene('fi-wrap', scene, renderer, camera);
var origResize = window._dssThreeRegistry['fi-wrap'].resize;
window._dssThreeRegistry['fi-wrap'].resize = function() {
fiSz = fiSize(); fiWrap.style.height = fiSz.h + 'px';
camera.aspect = fiSz.w / fiSz.h;
camera.fov = camera.aspect < 1 ? 78 : 52;
camera.updateProjectionMatrix();
renderer.setSize(fiSz.w, fiSz.h);
};
window.removeEventListener('resize', origResize);
window.addEventListener('resize', window._dssThreeRegistry['fi-wrap'].resize);

function tex(w, h, fn) {
var c = document.createElement('canvas'); c.width = w; c.height = h;
var cx = c.getContext('2d'); fn(cx, w, h);
// Mipmaps keep fine ink and carpet threads from sparkling at phone size.
var t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearMipmapLinearFilter;
t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
return t;
}
function rnd(seed) { var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function mesh(geo, mat, x, y, z, parent) {
var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || scene).add(m); return m;
}
// The same layered grain, soot washes and warm varnish as the street scenes.
function woodTex(base, grain, seed) {
return tex(512, 512, function(cx, w, h) {
cx.fillStyle = base; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 420; i++) {
var y = rnd(seed + i * 7) * h, bend = 2 + rnd(i + seed * 5) * 11;
cx.strokeStyle = i % 5 ? grain : '#c28951'; cx.globalAlpha = 0.035 + rnd(i + seed) * 0.1;
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
// Fine scratches in old varnish, along rather than across the grain.
cx.strokeStyle = 'rgba(216,165,103,0.13)'; cx.lineWidth = 0.6;
for (var n = 0; n < 65; n++) { var xx = rnd(n * 9 + seed) * w, yy = rnd(n * 17) * h; cx.beginPath(); cx.moveTo(xx, yy); cx.lineTo(xx + 3 + rnd(n) * 48, yy + 0.3); cx.stroke(); }
});
}
function paintTex(base, seed) {
return tex(512, 512, function(cx, w, h) {
cx.fillStyle = base; cx.fillRect(0, 0, w, h);
for (var n = 0; n < 28; n++) {
var x = rnd(n + seed) * w, y = rnd(n * 3 + seed) * h, r = 30 + rnd(n * 7) * 130;
var g = cx.createRadialGradient(x, y, 0, x, y, r);
g.addColorStop(0, n % 3 ? 'rgba(40,20,4,0.13)' : 'rgba(214,164,78,0.12)'); g.addColorStop(1, 'rgba(60,32,8,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
}
var soot = cx.createLinearGradient(0, 0, 0, h); soot.addColorStop(0, 'rgba(38,20,6,0.24)'); soot.addColorStop(0.3, 'rgba(38,20,6,0)'); soot.addColorStop(1, 'rgba(38,20,6,0.1)'); cx.fillStyle = soot; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 9000; i++) { cx.fillStyle = i % 2 ? 'rgba(20,12,4,0.045)' : 'rgba(236,213,169,0.05)'; cx.fillRect(rnd(i + seed) * w, rnd(i * 3 + seed) * h, 1, 1); }
});
}
// A small, entirely canvas-made room environment: amber ceiling, dark floor,
// cream panels and broad globe reflections. Shared by the varnish and metal.
var envFaces = [];
for (var ef = 0; ef < 6; ef++) {
var ec = document.createElement('canvas'); ec.width = ec.height = 128;
var ex = ec.getContext('2d'), eg = ex.createLinearGradient(0, 0, 0, 128);
eg.addColorStop(0, ef === 2 ? '#80603b' : '#665034'); eg.addColorStop(0.5, '#38291b'); eg.addColorStop(1, '#0e0906'); ex.fillStyle = eg; ex.fillRect(0, 0, 128, 128);
if (ef !== 3) {
for (var el = 0; el < 2; el++) {
var lx = 28 + el * 73, ly = ef === 2 ? 64 : 24;
var gl = ex.createRadialGradient(lx, ly, 0, lx, ly, 22); gl.addColorStop(0, '#fff0c9'); gl.addColorStop(0.14, '#dec28b'); gl.addColorStop(0.4, '#98713d'); gl.addColorStop(1, 'rgba(96,63,25,0)'); ex.fillStyle = gl; ex.fillRect(0, 0, 128, 128);
} ex.fillStyle = 'rgba(188,162,112,0.16)'; ex.fillRect(4, 76, 120, 13);
} envFaces.push(ec);
}
var roomEnv = new THREE.CubeTexture(envFaces); roomEnv.needsUpdate = true;

// ---------- MATERIALS ----------
var grainA = woodTex('#56321e', '#190c06', 1), grainB = woodTex('#382115', '#100905', 2), grainC = woodTex('#69402a', '#211006', 3);
var mahogany = new THREE.MeshStandardMaterial({ map: grainA, bumpMap: grainA, bumpScale: 0.003, roughnessMap: grainA, roughness: 0.68, envMap: roomEnv, envMapIntensity: 0.42, metalness: 0.04 });
var darkWood = new THREE.MeshStandardMaterial({ map: grainB, bumpMap: grainB, bumpScale: 0.006, roughness: 0.58, envMap: roomEnv, envMapIntensity: 0.22 });
var counterTop = new THREE.MeshStandardMaterial({ map: grainC, bumpMap: grainC, bumpScale: 0.002, roughnessMap: grainC, roughness: 0.48, envMap: roomEnv, envMapIntensity: 0.58, metalness: 0.08 });
var brass = new THREE.MeshStandardMaterial({ color: 0xb99a60, roughness: 0.28, metalness: 0.82, envMap: roomEnv, envMapIntensity: 0.72 });
var wallGrain = paintTex('#aa753d', 17);
var ochreWall = new THREE.MeshStandardMaterial({ map: wallGrain, bumpMap: wallGrain, bumpScale: 0.014, roughness: 0.94 });
var ceilingMat = new THREE.MeshStandardMaterial({ map: paintTex('#ad7940', 25), roughness: 0.96 });
var redWall = new THREE.MeshStandardMaterial({ map: paintTex('#713b2d', 33), roughness: 0.92 });
var carpetPile = tex(512, 512, function(cx, w, h) {
cx.fillStyle = '#512922'; cx.fillRect(0, 0, w, h);
// The old pattern survives as a worn thread, not a newly laid lattice.
cx.strokeStyle = 'rgba(177,137,88,0.15)'; cx.lineWidth = 2;
for (var y = 0; y < h; y += 64) for (var x = 0; x < w; x += 64) { cx.beginPath(); cx.moveTo(x + 32, y); cx.lineTo(x + 64, y + 32); cx.lineTo(x + 32, y + 64); cx.lineTo(x, y + 32); cx.closePath(); cx.stroke(); }
for (var n = 0; n < 18; n++) { var x = rnd(n) * w, y = rnd(n + 9) * h, g = cx.createRadialGradient(x, y, 0, x, y, 75); g.addColorStop(0, 'rgba(168,128,94,0.15)'); g.addColorStop(1, 'rgba(168,128,94,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); }
for (var i = 0; i < 42000; i++) { cx.fillStyle = i % 3 ? 'rgba(21,10,8,0.24)' : 'rgba(186,124,91,0.2)'; cx.fillRect(rnd(i) * w, rnd(i + 4) * h, 0.6, 1.5 + rnd(i + 7) * 2); }
});
carpetPile.wrapS = carpetPile.wrapT = THREE.RepeatWrapping; carpetPile.repeat.set(5, 6);
var carpet = new THREE.MeshStandardMaterial({ map: carpetPile, bumpMap: carpetPile, bumpScale: 0.018, roughness: 1 });

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
// Sepia pen studies: twenty individual heads, fine hatching and uneven ink.
// Draw at four times the old strip resolution so the close-ups retain linework.
function inkStudy(cx, seed) {
var turn = seed % 4, lean = (rnd(seed + 8) - 0.5) * 0.18;
cx.save(); cx.translate(50, 53); cx.rotate(lean);
cx.strokeStyle = '#5c4531'; cx.fillStyle = '#d6c6a4'; cx.lineWidth = 0.8;
function line(points) { cx.beginPath(); cx.moveTo(points[0],points[1]); for(var k=2;k<points.length;k+=2) cx.lineTo(points[k],points[k+1]); cx.stroke(); }
// Jackets, a neck and two differently turned lapels.
cx.fillStyle = 'rgba(83,63,44,0.13)'; cx.beginPath(); cx.moveTo(-39,78); cx.quadraticCurveTo(-35,48,-12,39); cx.lineTo(-8,26); cx.lineTo(11,27); cx.lineTo(15,40); cx.quadraticCurveTo(35,45,40,78); cx.closePath(); cx.fill(); cx.stroke();
line([-12,39,-22,46,-11,57,-16,61,-4,78]); line([15,40,24,48,13,58,18,62,7,78]); line([-8,33,-8,42,1,52,11,40,11,29]);
if(seed%3===0) { cx.fillStyle='#796047'; cx.beginPath(); cx.moveTo(0,50); cx.lineTo(-4,56); cx.lineTo(1,72); cx.lineTo(5,55); cx.closePath(); cx.fill(); }
// A cheek and jaw with a deliberately asymmetric contour, never a filled dot.
var jaw = 11 + rnd(seed + 3) * 7, brow = 17 + rnd(seed + 4) * 4;
cx.fillStyle = '#e6d8b9'; cx.beginPath(); cx.moveTo(-brow,-12); cx.bezierCurveTo(-24,-32,22,-33,20,-9); cx.quadraticCurveTo(26,4,17,17); cx.quadraticCurveTo(jaw,34,0,35); cx.quadraticCurveTo(-15,33,-20,9); cx.quadraticCurveTo(-26,-2,-brow,-12); cx.fill(); cx.stroke();
// A second wandering pen contour, ears and temple.
cx.globalAlpha=0.35; line([-19,-5,-21,6,-15,23,-8,30]); cx.globalAlpha=1;
line([-20,1,-25,-1,-24,10,-19,12]); line([20,0,24,1,22,12,18,12]);
var eye = turn === 1 ? 5 : 0;
line([-13+eye,-3,-6+eye,-5,-2+eye,-3]); line([6+eye,-4,13+eye,-3]);
line([2+eye,-2,-1+eye,10,6+eye,12]); line([-6,21,3,20,10,18]); line([-1,25,7,24]);
cx.fillStyle='#604b35'; cx.fillRect(-8+eye,-1,2,1.5); cx.fillRect(10+eye,0,2,1.3);
if(seed%5===2) { cx.beginPath(); cx.ellipse(-7+eye,0,7,5,0,0,Math.PI*2); cx.ellipse(11+eye,1,6,5,0,0,Math.PI*2); cx.stroke(); line([0+eye,0,5+eye,0]); }
// Hat, swept hair, balding crown, curls and moustaches vary by sitter.
if(seed%5===0) { cx.fillStyle='rgba(67,49,32,0.55)'; cx.beginPath(); cx.moveTo(-26,-17); cx.quadraticCurveTo(0,-11,27,-20); cx.lineTo(18,-24); cx.lineTo(13,-40); cx.quadraticCurveTo(-5,-43,-17,-37); cx.lineTo(-20,-22); cx.closePath(); cx.fill(); cx.stroke(); line([-17,-25,15,-27]); }
else {
for(var n=0;n<25;n++) { var xx=-20+n*1.6, yy=-19-Math.sqrt(Math.max(0,400-xx*xx))*0.5; if(seed%5===3 && n>7 && n<18) continue; cx.beginPath(); cx.moveTo(xx,yy+7); cx.quadraticCurveTo(xx-5,yy-7,xx+6,yy-5+(n%3)); cx.stroke(); }
}
if(seed%3===1) { for(var m=0;m<9;m++) line([-8+m*2,15, -10+m*2,18+(m%2)]); }
// Fine parallel strokes describe the cheek, jacket and shadow under the chin.
cx.globalAlpha=0.32; cx.lineWidth=0.55;
for(var n=0;n<12;n++) { var yy=4+n*2; line([-17,yy,-11+Math.sin(n)*2,yy-4]); }
for(var n=0;n<20;n++) { var xx=-34+n*3.6; line([xx,67,xx+8,52+Math.abs(xx)*0.32]); }
for(var n=0;n<7;n++) line([-8+n*2,33,-6+n*2,39]);
cx.globalAlpha=1; cx.restore();
}
var friezeTex = tex(4096, 384, function(cx, w, h) {
cx.fillStyle = '#bbaa87'; cx.fillRect(0,0,w,h);
cx.fillStyle = '#685036'; cx.fillRect(0,0,w,12); cx.fillRect(0,h-12,w,12);
for(var i=0;i<20;i++) {
var x=22+i*204, y=35, pw=166, ph=306;
cx.fillStyle='#211b14'; cx.fillRect(x,y,pw,ph);
cx.fillStyle=i%3===0?'#d6c9aa':'#e1d4b6'; cx.fillRect(x+5,y+5,pw-10,ph-10);
cx.strokeStyle='rgba(108,83,50,0.25)'; cx.lineWidth=1; cx.strokeRect(x+18,y+21,pw-36,ph-48);
cx.save(); cx.translate(x+22,y+26); cx.scale((pw-44)/100,(ph-52)/150); inkStudy(cx,i+21); cx.restore();
for(var n=0;n<90;n++) { cx.fillStyle='rgba(82,57,30,0.07)'; cx.fillRect(x+7+rnd(n+i*99)*(pw-14),y+7+rnd(n*3+i*71)*(ph-14),1,1); }
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
var panelMat = new THREE.MeshStandardMaterial({ map: paintTex('#d9c9a2', 61), roughness: 0.65, envMap: roomEnv, envMapIntensity: 0.18 });
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
// A real planar reflection, redrawn only when the viewing angle changes.
// No post-processing or vendor dependency. The tarnish lives at the edges.
var mirrorSize = portrait ? 512 : 1024;
var mirrorTarget = new THREE.WebGLRenderTarget(mirrorSize, mirrorSize, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
var mirrorCamera = camera.clone(), mirrorMatrix = new THREE.Matrix4();
var mirrorMat = new THREE.ShaderMaterial({
uniforms: { reflection: { value: mirrorTarget.texture }, reflectionMatrix: { value: mirrorMatrix } },
vertexShader: 'uniform mat4 reflectionMatrix; varying vec4 reflected; varying vec2 faceUV; void main(){ faceUV=uv; vec4 wp=modelMatrix*vec4(position,1.0); reflected=reflectionMatrix*wp; gl_Position=projectionMatrix*viewMatrix*wp; }',
fragmentShader: 'uniform sampler2D reflection; varying vec4 reflected; varying vec2 faceUV; void main(){ vec3 c=texture2DProj(reflection,reflected).rgb; float edge=smoothstep(0.0,0.07,min(min(faceUV.x,1.0-faceUV.x),min(faceUV.y,1.0-faceUV.y))); float stain=0.5+0.5*sin(faceUV.x*193.0+sin(faceUV.y*117.0)*3.0); c=mix(vec3(0.05,0.033,0.019),c*vec3(0.72,0.68,0.59),0.65+0.35*edge); c*=1.0-(1.0-edge)*stain*0.3; gl_FragColor=vec4(c,1.0);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'
});
var mirror = mesh(new THREE.PlaneGeometry(5.6, 1.1), mirrorMat, bbX + 0.03, 1.95, 0.4); mirror.rotation.y = Math.PI / 2;
mirror.geometry.addEventListener('dispose', function() { mirrorTarget.dispose(); });
var lastMirrorAspect = 0;
var lastMirrorP = new THREE.Vector3(999, 999, 999), lastMirrorT = new THREE.Vector3(999, 999, 999);
function reflectRoom(target) {
if (lastMirrorAspect === camera.aspect && lastMirrorP.distanceToSquared(camera.position) < 0.0025 && lastMirrorT.distanceToSquared(target) < 0.0025) return;
lastMirrorAspect = camera.aspect; lastMirrorP.copy(camera.position); lastMirrorT.copy(target);
mirrorCamera.copy(camera); mirrorCamera.position.x = 2 * mirror.position.x - camera.position.x;
mirrorCamera.lookAt(2 * mirror.position.x - target.x, target.y, target.z); mirrorCamera.updateMatrixWorld();
// Oblique near plane excludes the room behind the silvered glass.
var clip = new THREE.Plane(new THREE.Vector3(1, 0, 0), -mirror.position.x).applyMatrix4(mirrorCamera.matrixWorldInverse);
var cp = new THREE.Vector4(clip.normal.x, clip.normal.y, clip.normal.z, clip.constant);
var pm = mirrorCamera.projectionMatrix.elements, cq = new THREE.Vector4((Math.sign(cp.x) + pm[8]) / pm[0], (Math.sign(cp.y) + pm[9]) / pm[5], -1, (1 + pm[10]) / pm[14]);
cp.multiplyScalar(2 / cp.dot(cq)); pm[2] = cp.x; pm[6] = cp.y; pm[10] = cp.z + 1; pm[14] = cp.w;
mirrorMatrix.set(0.5,0,0,0.5, 0,0.5,0,0.5, 0,0,0.5,0.5, 0,0,0,1).multiply(mirrorCamera.projectionMatrix).multiply(mirrorCamera.matrixWorldInverse);
var oldTarget = renderer.getRenderTarget(), oldTone = renderer.toneMapping;
mirror.visible = false; renderer.toneMapping = THREE.NoToneMapping;
renderer.setRenderTarget(mirrorTarget); renderer.render(scene, mirrorCamera);
renderer.setRenderTarget(oldTarget); renderer.toneMapping = oldTone; mirror.visible = true;
}
var shelfMat = darkWood;
mesh(new THREE.BoxGeometry(0.34, 0.03, 5.8), shelfMat, bbX + 0.17, 1.62, 0.4);
mesh(new THREE.BoxGeometry(0.28, 0.03, 5.8), shelfMat, bbX + 0.14, 2.2, 0.4);
mesh(new THREE.BoxGeometry(0.2, 0.03, 5.8), shelfMat, bbX + 0.1, 2.72, 0.4);
mesh(new THREE.BoxGeometry(0.06, 3.3, 0.16), mahogany, bbX + 0.03, 1.65, -2.55);
mesh(new THREE.BoxGeometry(0.06, 3.3, 0.16), mahogany, bbX + 0.03, 1.65, 3.4);
// bottles, three rows
var botCols = [0x2a5a2a, 0x7a4a18, 0x1a2a5a, 0x8a7a20, 0x4a1a1a, 0x2a4a3a, 0xa08030, 0x3a2a1a];
function bottle(x, y, z, col, h, r) {
var g = new THREE.Group(); g.position.set(x, y, z);
var bm = new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.17, metalness: 0.04, envMap: roomEnv, envMapIntensity: 0.8, clearcoat: 0.85, clearcoatRoughness: 0.12, transparent: true, opacity: 0.87 });
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
var bakelite = new THREE.MeshStandardMaterial({ color: 0x16120f, roughness: 0.26, metalness: 0.08, envMap: roomEnv, envMapIntensity: 0.55 });
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
return tex(256, 384, function(cx, w, h) {
var tones = ['#777369','#6b665d','#838074','#65635c'];
var g = cx.createLinearGradient(0,0,w,h); g.addColorStop(0,tones[seed%4]); g.addColorStop(1,'#24251f'); cx.fillStyle=g; cx.fillRect(0,0,w,h);
// A faded curtain, doorjamb or pub interior rather than a uniform backdrop.
cx.fillStyle='rgba(18,19,16,0.22)';
if(seed%2) { for(var c=0;c<7;c++) cx.fillRect(c*42,0,13,h); }
else { cx.fillRect(12,0,8,h); cx.fillRect(w-35,0,13,h); cx.fillRect(0,76,w,8); }
var count = seed%3 === 0 ? 3 : seed%4 === 0 ? 2 : 1;
function sitter(px, py, scale, k) {
cx.save(); cx.translate(px,py); cx.scale(scale,scale);
var coat=cx.createLinearGradient(-70,0,70,140); coat.addColorStop(0,'#171c19'); coat.addColorStop(0.65,k%2?'#4c4d44':'#373b35'); coat.addColorStop(1,'#222822');
cx.fillStyle=coat; cx.beginPath(); cx.moveTo(-88,185); cx.quadraticCurveTo(-95,75,-35,60); cx.lineTo(-17,43); cx.lineTo(20,41); cx.lineTo(36,59); cx.quadraticCurveTo(88,72,91,185); cx.closePath(); cx.fill();
// White collar, lapels and the small flash of a shirt.
cx.fillStyle='#aea998'; cx.beginPath(); cx.moveTo(-18,48); cx.lineTo(2,106); cx.lineTo(23,49); cx.lineTo(0,62); cx.closePath(); cx.fill();
cx.strokeStyle='rgba(172,171,148,0.26)'; cx.lineWidth=2; cx.beginPath(); cx.moveTo(-34,61); cx.lineTo(-19,83); cx.lineTo(-28,94); cx.lineTo(-3,136); cx.moveTo(35,63); cx.lineTo(17,85); cx.lineTo(27,95); cx.lineTo(6,139); cx.stroke();
var face=cx.createRadialGradient(-12,-8,1,0,7,54); face.addColorStop(0,'#c9c4af'); face.addColorStop(0.45,'#9b9b89'); face.addColorStop(1,'#494f43');
cx.fillStyle=face; cx.beginPath(); cx.moveTo(-31,-7); cx.bezierCurveTo(-37,-51,36,-52,33,-9); cx.lineTo(29,28); cx.quadraticCurveTo(19,54,0,50); cx.quadraticCurveTo(-28,45,-30,22); cx.closePath(); cx.fill();
// Hairline, side-light, nose, brows, mouth: grain softens these into the print.
cx.fillStyle=k%3===0?'#76796a':'#343c32'; cx.beginPath(); cx.moveTo(-31,1); cx.quadraticCurveTo(-46,-52,7,-43); cx.quadraticCurveTo(42,-44,34,-1); cx.lineTo(24,-22); cx.quadraticCurveTo(4,-13,-15,-27); cx.lineTo(-24,-10); cx.closePath(); cx.fill();
cx.strokeStyle='rgba(27,35,29,0.65)'; cx.lineWidth=2.4; cx.beginPath(); cx.moveTo(-22,3); cx.lineTo(-8,1); cx.moveTo(9,2); cx.lineTo(23,5); cx.moveTo(1,5); cx.lineTo(-3,24); cx.lineTo(7,26); cx.moveTo(-9,36); cx.quadraticCurveTo(1,39,13,34); cx.stroke();
cx.fillStyle='rgba(23,28,23,0.6)'; cx.fillRect(-17,7,5,3); cx.fillRect(14,8,4,3);
if(k%4===1) { cx.lineWidth=1.5; cx.strokeRect(-24,0,19,15); cx.strokeRect(8,1,18,15); cx.beginPath(); cx.moveTo(-5,5); cx.lineTo(8,6); cx.stroke(); }
if(k%4===2) { cx.fillStyle='rgba(38,43,35,0.6)'; cx.beginPath(); cx.ellipse(0,31,13,4,-0.12,0,Math.PI*2); cx.fill(); }
cx.restore();
}
if(count===1) sitter(118+(seed%3)*7,136,1.35,seed);
else for(var j=0;j<count;j++) sitter(44+j*(168/(count-1)),142+(j%2)*24,0.69+(j%2)*0.08,seed+j);
// Silver mirroring at the edge and uneven emulsion, retained in the shadows.
var silver=cx.createLinearGradient(0,0,w,h); silver.addColorStop(0,'rgba(185,194,178,0.25)'); silver.addColorStop(0.2,'rgba(157,166,152,0.02)'); silver.addColorStop(0.8,'rgba(157,166,152,0)'); silver.addColorStop(1,'rgba(185,194,178,0.18)'); cx.fillStyle=silver; cx.fillRect(0,0,w,h);
for(var i=0;i<17000;i++) { cx.fillStyle=i%2?'rgba(225,221,193,0.07)':'rgba(5,14,8,0.075)'; cx.fillRect(rnd(seed+i*7)*w,rnd(seed+i*11)*h,1,1); }
cx.strokeStyle='rgba(211,207,179,0.18)'; cx.lineWidth=0.6;
for(var n=0;n<5;n++) { var xx=rnd(seed+n)*w; cx.beginPath(); cx.moveTo(xx,rnd(n)*h); cx.lineTo(xx+1,rnd(n+3)*h); cx.stroke(); }
var edge=cx.createRadialGradient(w/2,h*0.45,w*0.22,w/2,h*0.45,h*0.7); edge.addColorStop(0,'rgba(13,15,10,0)'); edge.addColorStop(1,'rgba(13,15,10,0.45)'); cx.fillStyle=edge; cx.fillRect(0,0,w,h);
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
var glassMat = new THREE.MeshPhysicalMaterial({ color: 0xf0eadc, roughness: 0.09, metalness: 0.04, envMap: roomEnv, envMapIntensity: 1.1, clearcoat: 1, transparent: true, opacity: 0.32 });
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
// along the counter, on the customers' side: the man at the bar at the second stool, the painter at the fourth, a third trace beyond the end of the bar
[[1.95, 0.8, 0, 0.7, 0], [4.05, 0.8, 0, 0.56, 2], [5.7, 1.4, 0, 0.44, 4]].forEach(function(gs, i) {
var pAt = P1.clone().add(barDir.clone().multiplyScalar(gs[0])).add(barPerp.clone().multiplyScalar(gs[1]));
var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ghostTex(gs[4]), transparent: true, opacity: gs[3] * 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
sp.scale.set(0.9, 1.8, 1); sp.position.set(pAt.x, 0.9, pAt.z); scene.add(sp);
// a slim unseen body to click, so a tap on the counter beside a figure is the counter's
var hit = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8), new THREE.MeshBasicMaterial({ visible: false }));
hit.position.set(pAt.x, 0.95, pAt.z); scene.add(hit);
ghosts.push({ sp: sp, hit: hit, base: gs[3] * 0.5, ph: i * 2.1 });
});

// ---------- LIGHT ----------
scene.add(new THREE.AmbientLight(0x68513a, 0.22));
scene.add(new THREE.HemisphereLight(0xa58153, 0x160d09, 0.2));
var globeMat = new THREE.MeshBasicMaterial({ color: 0xfff0d0, fog: false, toneMapped: false });
var glowTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,225,160,0.9)'); g.addColorStop(0.3, 'rgba(255,190,100,0.35)'); g.addColorStop(0.7, 'rgba(220,140,50,0.08)'); g.addColorStop(1, 'rgba(180,100,30,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function globeGlow(x, y, z, sc) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0.66, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, fog: false, toneMapped: false })); sp.scale.set(sc, sc, 1); sp.position.set(x, y, z); scene.add(sp); return sp; }
var lampMain = new THREE.PointLight(0xffd09a, 2.25, 9, 1.7); lampMain.position.set(0.4, 2.85, -0.3); lampMain.castShadow = true; lampMain.shadow.mapSize.set(512, 512); lampMain.shadow.bias = -0.001; lampMain.shadow.normalBias = 0.025; lampMain.shadow.radius = 3; lampMain.shadow.camera.near = 0.15; lampMain.shadow.camera.far = 10; scene.add(lampMain);
mesh(new THREE.SphereGeometry(0.16, 16, 12), globeMat, 0.4, 2.85, -0.3); var mainGlow = globeGlow(0.4, 2.85, -0.3, 1.35);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), brass, 0.4, 3.15, -0.3);
var lampBack = new THREE.PointLight(0xffc486, 1.5, 8, 1.7); lampBack.position.set(-0.6, 2.85, -2.6); scene.add(lampBack);
mesh(new THREE.SphereGeometry(0.16, 16, 12), globeMat, -0.6, 2.85, -2.6); var backGlow = globeGlow(-0.6, 2.85, -2.6, 1.2);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), brass, -0.6, 3.15, -2.6);
var barLight = new THREE.PointLight(0xffc992, 0.28, 6, 2); barLight.position.set(-2.9, 2.4, 0.4); scene.add(barLight);
var winLight = new THREE.PointLight(0xffd8a0, 0.18, 5, 2); winLight.position.set(3.2, 2.0, -2.4); scene.add(winLight);
// Contact shadow under each stool; broad penumbra from the opal globes.
var contactTex = tex(64, 64, function(cx, w, h) { var g = cx.createRadialGradient(32,32,3,32,32,32); g.addColorStop(0,'rgba(0,0,0,0.34)'); g.addColorStop(0.45,'rgba(0,0,0,0.2)'); g.addColorStop(1,'rgba(0,0,0,0)'); cx.fillStyle=g; cx.fillRect(0,0,w,h); });
stools.forEach(function(st) { var shadow = mesh(new THREE.PlaneGeometry(0.85, 0.85), new THREE.MeshBasicMaterial({map:contactTex,transparent:true,depthWrite:false}),st.position.x,0.004,st.position.z); shadow.rotation.x=-Math.PI/2; });
// The shadow casters are static. Keep the six cube-map faces off the frame loop.
renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true;
// A little suspended smoke around the opal lamps, never a visible beam.
var hazeTex = tex(128,128,function(cx,w,h) { var g=cx.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0,'rgba(208,181,139,0.22)'); g.addColorStop(0.35,'rgba(171,137,94,0.13)'); g.addColorStop(1,'rgba(111,82,51,0)'); cx.fillStyle=g; cx.fillRect(0,0,w,h); });
var haze = [];
[[0.4,2.35,-0.3],[-0.6,2.35,-2.6]].forEach(function(p) {
var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:hazeTex,transparent:true,opacity:0.14,depthWrite:false,blending:THREE.AdditiveBlending})); sp.position.set(p[0],p[1],p[2]); sp.scale.set(2.4,1.7,1); scene.add(sp); haze.push(sp);
});
// Soft specks, confined to the lamp pools; no square foreground confetti.
var dustTex = tex(32,32,function(cx,w,h) { var g=cx.createRadialGradient(16,16,0,16,16,16); g.addColorStop(0,'rgba(255,237,197,0.85)'); g.addColorStop(0.22,'rgba(255,237,197,0.4)'); g.addColorStop(1,'rgba(255,237,197,0)'); cx.fillStyle=g; cx.fillRect(0,0,w,h); });
var moteN = 48, moteBase = new Float32Array(moteN * 3), motePos = new Float32Array(moteN * 3), moteColors = new Float32Array(moteN * 3);
for(var mi=0;mi<moteN;mi++) {
var lp=mi%2 ? [-0.6,-2.6] : [0.4,-0.3], angle=rnd(mi*7)*Math.PI*2, radius=0.15+rnd(mi*11)*1.1;
moteBase[mi*3]=lp[0]+Math.cos(angle)*radius; moteBase[mi*3+1]=0.6+rnd(mi+1)*2.15; moteBase[mi*3+2]=lp[1]+Math.sin(angle)*radius;
var strength=0.2+0.65*rnd(mi+31); moteColors[mi*3]=strength; moteColors[mi*3+1]=strength*0.83; moteColors[mi*3+2]=strength*0.58;
}
motePos.set(moteBase);
var moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position',new THREE.BufferAttribute(motePos,3)); moteGeo.setAttribute('color',new THREE.BufferAttribute(moteColors,3));
scene.add(new THREE.Points(moteGeo,new THREE.PointsMaterial({map:dustTex,vertexColors:true,size:0.017,transparent:true,opacity:0.3,depthWrite:false,blending:THREE.AdditiveBlending})));

// ---------- THE CLOSE-UPS, AND THE PATHS ----------
// Each: what you click, where the camera goes, and either the passage
// links it opens (found in the rendered passage below at click time, so
// every gate stays Harlowe's) or, when there is no path, the pink
// inspection line for Sam to write.
var PINK = 'color:#ff3aa8;text-shadow:0 0 4px rgba(255,58,168,0.45);';
function passageLinks(sel) {
var pass = fiHost.closest('tw-passage') || document.querySelector('tw-passage');
if (!pass) return [];
return Array.prototype.slice.call(pass.querySelectorAll(sel)).filter(function(l) { return !fiWrap.contains(l) && l.getClientRects().length > 0; });
}
// Harlowe 3 keeps a link's target out of the DOM, so the passage's links are known by their own wording (as the signpost script does).
function byText(texts) {
return passageLinks('tw-link').filter(function(l) { return texts.indexOf(l.textContent.trim()) >= 0; });
}
var HOTSPOTS = [
{ root: photoG, name: 'the photographs', pos: [0.2, 1.95, -2.4], tgt: [0.9, 2.0, -4.5],
line: 'Eight frames on the back wall, seven of them faces the bar still drinks to, and one gone pale where the sun has had it. [Sam: the photo wall]' },
{ root: phoneG, name: 'the telephone', pos: [-2.2, 1.6, 0.6], tgt: [-3.45, 1.32, -0.35],
actions: function() { return passageLinks('.phone-ringing tw-link'); },
prose: function() { var d = passageLinks('.phone-ringing')[0]; if (!d) return ''; var c = d.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('tw-link, tw-hook[name="lilyring"] tw-link'), function(l) { l.parentNode.removeChild(l); }); return c.textContent.replace(/\s+/g, ' ').trim(); },
line: 'The phone behind the bar, black, off duty, the handset lying in its cradle like something asleep with one eye open. [Sam: the phone that rings]' },
{ root: glassG, name: 'the glass on the bar', pos: [-0.9, 1.5, 0.35], tgt: [gp.x, 1.16, gp.z],
line: 'Half a drink left on the counter and the ring beside it where the last one stood; whoever it was has stepped out, or never came back. [Sam: the glass someone left]' },
{ root: doorG, name: 'the blue door', pos: [1.9, 1.5, -2.3], tgt: [2.45, 1.3, -4.5],
line: 'The blue door at the back, the one to the stairs, with a line of light under it that was not there a moment ago. [Sam: the door to upstairs]' },
{ root: barG, name: 'the bar', pos: [-1.05, 1.45, 1.55], tgt: [-2.55, 1.25, -0.4],
actions: function() { return byText(['Get a drink at the bar']); },
line: 'The counter, wiped and wet again, the pumps standing to attention and nobody serving for the moment. [Sam: the bar when there is no drink to be had]' },
{ root: ghosts[0].hit, name: 'the man at the bar', pos: [-0.6, 1.45, 1.9], tgt: [-1.55, 1.15, 0.9], figure: true,
actions: function() { return byText(['Approach', 'Approach the artists']); } },
{ root: ghosts[1].hit, name: 'the painter', pos: [-0.35, 1.45, 0.75], tgt: [-1.25, 1.15, -0.3], figure: true,
actions: function() { return byText(['Sketch him on a napkin']); } }
];
var hotspotRoots = HOTSPOTS.map(function(h) { return h.root; });
function hotspotFor(obj) { while (obj) { var i = hotspotRoots.indexOf(obj); if (i >= 0) return HOTSPOTS[i]; obj = obj.parent; } return null; }
function spotActions(spot) { try { return spot.actions ? spot.actions() : []; } catch (e) { return []; } }
// a figure is only there to click when the passage offers its path; the others always take a closer look
function available(spot) { return !!spot && (!spot.figure || spotActions(spot).length > 0); }
// hover halo, the warm colour of the room
var haloTex = tex(128, 128, function(cx, w, h) {
// An uneven reflection on the object, with no outlined circumference.
cx.save(); cx.translate(64,64); cx.scale(1,0.78);
var g=cx.createRadialGradient(-5,-7,0,0,0,64);
g.addColorStop(0,'rgba(255,232,181,0.78)'); g.addColorStop(0.16,'rgba(251,216,151,0.48)'); g.addColorStop(0.44,'rgba(230,177,98,0.19)'); g.addColorStop(0.78,'rgba(196,140,62,0.045)'); g.addColorStop(1,'rgba(180,120,30,0)');
cx.fillStyle=g; cx.fillRect(-64,-82,128,164); cx.restore();
});
var halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, transparent: true, opacity: 0.8, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, toneMapped: false }));
halo.visible = false; halo.scale.set(0.5, 0.5, 1); scene.add(halo);
function haloAt(spot) {
var wp = new THREE.Vector3();
if (spot.root === photoG) wp.set(0.4, 2.0, -4.4);
else if (spot.root === barG) wp.set(-1.5, 1.2, -0.3);
else if (spot.root === doorG) wp.set(2.45, 1.3, -4.4);
else spot.root.getWorldPosition(wp);
if (spot.figure) wp.y += 0.45;
halo.position.copy(wp);
var sc = spot.root === barG || spot.root === photoG ? 1.4 : spot.root === doorG ? 1.1 : spot.figure ? 0.9 : 0.52;
halo.scale.set(sc, sc, 1);
}
// the card: a caption, then either the passage's own links as buttons (their own words) or the pink line
var card = document.createElement('div');
card.style.cssText = 'position:absolute;left:50%;bottom:44px;transform:translateX(-50%);width:min(560px,86%);' +
'font:15px/1.5 \'Crimson Text\',Georgia,serif;color:rgba(220,198,150,0.92);text-align:center;' +
'background:rgba(10,7,4,0.78);border:1px solid rgba(200,168,106,0.32);padding:14px 22px 12px;border-radius:2px;' +
'pointer-events:none;z-index:9004;opacity:0;transition:opacity 0.7s ease;';
fiWrap.appendChild(card);
var BTN = 'display:inline-block;margin:6px 6px 0;font:12px \'Courier New\',monospace;letter-spacing:3px;text-transform:uppercase;color:rgba(230,200,120,0.95);padding:9px 18px;border:1px solid rgba(200,170,100,0.45);background:rgba(0,0,0,0.35);cursor:pointer;white-space:normal;max-width:100%;box-sizing:border-box;line-height:1.5;';
function showCard(spot) {
var acts = spotActions(spot);
var html = '<div style="font:11px \'Courier New\',monospace;letter-spacing:3px;color:rgba(200,180,140,0.5);margin-bottom:6px;text-transform:uppercase;">' + spot.name + '</div>';
if (acts.length) {
var prose = spot.prose ? spot.prose() : '';
if (prose) html += '<div style="margin-bottom:4px;">' + prose.replace(/</g, '&lt;') + '</div>';
html += '<div class="fi-actions"></div>';
} else {
html += '<div style="' + PINK + '">' + spot.line + '</div>';
}
html += '<div style="font:10px \'Courier New\',monospace;letter-spacing:2px;color:rgba(200,180,140,0.32);margin-top:8px;">' + (acts.length ? 'OR CLICK ANYWHERE ELSE TO STEP BACK' : 'CLICK ANYWHERE TO STEP BACK') + '</div>';
card.innerHTML = html;
var row = card.querySelector('.fi-actions');
if (row) acts.forEach(function(link) {
var b = document.createElement('span');
b.className = 'fi-action';
b.textContent = link.textContent.trim();
b.style.cssText = BTN;
b.addEventListener('pointerdown', function(ev) { ev.stopPropagation(); });
b.addEventListener('click', function(ev) {
ev.stopPropagation();
if (!link.isConnected) { stepBack(); return; }
// the passage's own link does the work: its (set:)s, its go-to, its replace
link.click();
stepBack();
});
row.appendChild(b);
});
card.style.pointerEvents = acts.length ? 'auto' : 'none';
card.style.opacity = '1';
}
// the camera
var camMode = 'idle', camK = 0, camNext = 'idle', activeSpot = null, hoverSpot = null;
var camFromP = new THREE.Vector3(), camFromT = new THREE.Vector3(), camToP = new THREE.Vector3(), camToT = new THREE.Vector3();
var curTarget = new THREE.Vector3(CAM.tx, CAM.ty, CAM.tz);
function beginTween(toP, toT, next) {
camFromP.copy(camera.position); camFromT.copy(curTarget);
camToP.set(toP[0], toP[1], toP[2]); camToT.set(toT[0], toT[1], toT[2]);
camK = fiStill ? 1 : 0; camNext = next; camMode = 'tween';
}
function stepBack() {
activeSpot = null; card.style.opacity = '0'; card.style.pointerEvents = 'none'; doorLight.intensity = 0; doorGlow.material.opacity = 0;
beginTween([CAM.x, CAM.y, CAM.z], [CAM.tx, CAM.ty, CAM.tz], 'idle');
}
var ray = new THREE.Raycaster(), mouseN = new THREE.Vector2();
function pick(ev) {
var r = fiCanvas.getBoundingClientRect();
mouseN.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
ray.setFromCamera(mouseN, camera);
var hits = ray.intersectObjects(hotspotRoots, true);
for (var i = 0; i < hits.length; i++) { var sp = hotspotFor(hits[i].object); if (available(sp)) return sp; }
return null;
}
fiCanvas.addEventListener('pointermove', function(ev) {
if (camMode !== 'idle' || ev.pointerType === 'touch') { hoverSpot = null; halo.visible = false; return; }
var spot = pick(ev); hoverSpot = spot;
if (spot) { haloAt(spot); halo.visible = true; fiCanvas.style.cursor = 'pointer'; }
else { halo.visible = false; fiCanvas.style.cursor = 'default'; }
});
fiCanvas.addEventListener('pointerdown', function(ev) {
if (camMode === 'tween') return;
if (camMode === 'inspect') { stepBack(); return; }
var spot = ev.pointerType === 'touch' ? pick(ev) : (hoverSpot || pick(ev));
if (!spot) return;
activeSpot = spot; halo.visible = false; fiCanvas.style.cursor = 'default';
showCard(spot);
beginTween(spot.pos, spot.tgt, 'inspect');
if (spot.root === doorG) { doorLight.intensity = 0.9; doorGlow.material.opacity = 0.55; }
});
// a click on the dark of the card (not a button) steps back too
card.addEventListener('pointerdown', function(ev) { if (camMode === 'inspect' && !ev.target.classList.contains('fi-action')) stepBack(); });
var fiHint = document.createElement('div');
fiHint.textContent = 'LOOK CLOSER AT WHAT CATCHES YOUR EYE';
fiHint.style.cssText = 'position:absolute;top:22px;left:50%;transform:translateX(-50%);font:11px \'Courier New\',monospace;color:rgba(200,180,140,0.3);letter-spacing:3px;z-index:9003;pointer-events:none;opacity:0;transition:opacity 2s ease;text-align:center;max-width:90%;white-space:normal;';
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
var breath = Math.sin(t * 0.43) * 0.035 + Math.sin(t * 0.19) * 0.018;
lampMain.intensity = 2.25 + breath;
lampBack.intensity = 1.5 + Math.sin(t * 0.39 + 1.2) * 0.027;
mainGlow.material.opacity = 0.66 + breath * 0.6; backGlow.material.opacity = 0.66 + Math.sin(t * 0.39 + 1.2) * 0.018;
haze[0].material.opacity = 0.14 + breath * 0.18; haze[1].material.opacity = 0.14 + Math.sin(t * 0.23) * 0.008;
for (var gi = 0; gi < ghosts.length; gi++) { var g = ghosts[gi]; g.sp.material.opacity = g.base * (0.7 + 0.3 * Math.sin(t * 0.23 + g.ph)); }
for (var m = 0; m < moteN; m++) { motePos[m * 3] = moteBase[m * 3] + Math.sin(t * 0.15 + m) * 0.08; motePos[m * 3 + 1] = 0.6 + ((moteBase[m * 3 + 1] - 0.6 + (m % 2 ? 1 : -1) * t * 0.04) % 2.4 + 2.4) % 2.4; }
moteGeo.attributes.position.needsUpdate = true;
if (halo.visible) { halo.material.opacity = 0.8 + Math.sin(t * 0.9) * 0.08; }
}
reflectRoom(curTarget);
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

