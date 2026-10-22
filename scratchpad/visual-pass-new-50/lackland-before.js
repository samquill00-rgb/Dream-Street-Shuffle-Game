// ====== LACKLAND'S OFFICE SCENE — INLINE ======
(function() {
var loActive = false;
var loAnimId = null;
var loWrap = null;
var loVig = null;
var loGrain = null;
var loGrainCtx = null;
var loGrainFrame = 0;
var loWash = null;
var loDate = null;
var loLoc = null;
var loBtn = null;

function initLackland() {
if (loActive) return;
loActive = true;
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(buildLOScene) : buildLOScene()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(buildLOScene) : buildLOScene());
}
}

function buildLOScene() {
// Create full-screen overlay wrapper
loWrap = document.createElement('div');
loWrap.id = 'lo-wrap';
loWrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9000;background:#040408;overflow:hidden;';
var loStill = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================================
// SCENE SETUP
// ============================================================
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x04040a);
scene.fog = new THREE.Fog(0x04040a, 4, 22);

var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(2.8, 2.0, 6.5);
camera.lookAt(0, 2.8, 0);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.54;
loWrap.appendChild(renderer.domElement);
window._dssBindScene('lo-wrap', scene, renderer, camera);
var dssComposerLocal = window.dssMakeComposer ? window.dssMakeComposer(scene, camera, renderer, { focus: 10 }) : null;
if (window.dssFilmGrade) window.dssFilmGrade(document.getElementById('lo-wrap'));

// ============================================================
// MATERIALS
// ============================================================
var stuccoTex = makeCanvasTexture(512, 1024, function(cx, w, h) {
cx.fillStyle = '#d5ccb8';
cx.fillRect(0, 0, w, h);
var sootWash = cx.createLinearGradient(0, 0, 0, h);
sootWash.addColorStop(0, 'rgba(50, 45, 35, 0.15)');
sootWash.addColorStop(0.1, 'rgba(60, 55, 45, 0.05)');
sootWash.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
sootWash.addColorStop(0.85, 'rgba(50, 45, 30, 0.08)');
sootWash.addColorStop(1, 'rgba(40, 35, 25, 0.2)');
cx.fillStyle = sootWash;
cx.fillRect(0, 0, w, h);
cx.strokeStyle = 'rgba(90, 85, 70, 0.06)';
cx.lineWidth = 2;
for (var rs = 0; rs < 20; rs++) {
cx.beginPath();
var rx = Math.random() * w;
cx.moveTo(rx, 0);
for (var ry = 0; ry < h; ry += 30) {
rx += (Math.random() - 0.5) * 4;
cx.lineTo(rx, ry);
}
cx.stroke();
}
cx.fillStyle = 'rgba(160, 150, 130, 0.08)';
for (var pc = 0; pc < 6; pc++) {
cx.beginPath();
cx.ellipse(Math.random() * w, Math.random() * h, 30 + Math.random() * 60, 20 + Math.random() * 40, Math.random(), 0, Math.PI * 2);
cx.fill();
}
});
// Toolkit-grade weathering — the old flat MeshStandard colors read as
// clean plastic against the reviewed scenes (2026-07-29 audit).
var loKit = window.dssScene || null;
var creamStucco = (loKit && loKit.makeWeatheredStucco)
  ? loKit.makeWeatheredStucco({ baseColor: 0xd5ccb8, repeat: [2, 2.5] })
  : new THREE.MeshStandardMaterial({ map: stuccoTex, roughness: 0.85 });
var darkStucco = (loKit && loKit.makeWeatheredStucco)
  ? loKit.makeWeatheredStucco({ baseColor: 0xb0a890, repeat: [2, 2.5] })
  : new THREE.MeshStandardMaterial({ color: 0xb0a890, roughness: 0.85 });
var sootBrick = (loKit && loKit.makeGrimyBrick)
  ? loKit.makeGrimyBrick({ baseColor: 0x2a2520, repeat: [2, 4], sootStreaks: 9, dampPatches: 5 })
  : new THREE.MeshStandardMaterial({ color: 0x2a2520, roughness: 0.9 });
var darkBrick = (loKit && loKit.makeGrimyBrick)
  ? loKit.makeGrimyBrick({ baseColor: 0x3a2a22, repeat: [2, 4], sootStreaks: 7 })
  : new THREE.MeshStandardMaterial({ color: 0x3a2a22, roughness: 0.9 });
var redBrick = (loKit && loKit.makeGrimyBrick)
  ? loKit.makeGrimyBrick({ baseColor: 0x6b3a2a, repeat: [2, 4], sootStreaks: 6, dampPatches: 4 })
  : new THREE.MeshStandardMaterial({ color: 0x6b3a2a, roughness: 0.85 });
var greyStone = new THREE.MeshStandardMaterial({ color: 0x9a9488, roughness: 0.75 });
var whiteStone = (loKit && loKit.makeWeatheredStucco)
  ? loKit.makeWeatheredStucco({ baseColor: 0xc8c0b0, repeat: [1.5, 2] })
  : new THREE.MeshStandardMaterial({ color: 0xc8c0b0, roughness: 0.7 });
var paveTex = makeCanvasTexture(512, 512, function(cx, w, h) {
cx.fillStyle = '#555550';
cx.fillRect(0, 0, w, h);
var flagRows = [
{ y: 0, h: 128 },
{ y: 128, h: 110 },
{ y: 238, h: 140 },
{ y: 378, h: 134 }
];
for (var ri = 0; ri < flagRows.length; ri++) {
var row = flagRows[ri];
var slabs = (ri % 2 === 0) ? [0, 200, 380] : [0, 260, 420];
for (var si = 0; si < slabs.length; si++) {
var sx = slabs[si];
var sw = (si < slabs.length - 1) ? slabs[si + 1] - sx : w - sx;
var tone = 60 + Math.random() * 25;
cx.fillStyle = 'rgb(' + tone + ',' + tone + ',' + (tone - 3) + ')';
cx.fillRect(sx + 2, row.y + 2, sw - 4, row.h - 4);
cx.fillStyle = 'rgba(80, 78, 72, 0.06)';
for (var sp = 0; sp < 8; sp++) {
cx.beginPath();
cx.ellipse(sx + Math.random() * sw, row.y + Math.random() * row.h, 10 + Math.random() * 25, 5 + Math.random() * 12, Math.random(), 0, Math.PI * 2);
cx.fill();
}
}
}
cx.strokeStyle = 'rgba(25, 22, 18, 0.6)';
cx.lineWidth = 3;
for (var ri = 0; ri < flagRows.length; ri++) {
cx.beginPath();
cx.moveTo(0, flagRows[ri].y);
cx.lineTo(w, flagRows[ri].y);
cx.stroke();
}
var vertLines1 = [200, 380];
var vertLines2 = [260, 420];
for (var ri = 0; ri < flagRows.length; ri++) {
var row = flagRows[ri];
var vlines = (ri % 2 === 0) ? vertLines1 : vertLines2;
for (var vi = 0; vi < vlines.length; vi++) {
cx.beginPath();
cx.moveTo(vlines[vi], row.y);
cx.lineTo(vlines[vi], row.y + row.h);
cx.stroke();
}
}
cx.fillStyle = 'rgba(15, 12, 8, 0.25)';
for (var ri = 0; ri < flagRows.length; ri++) {
cx.fillRect(0, flagRows[ri].y - 1, w, 4);
}
cx.fillStyle = 'rgba(30, 28, 22, 0.2)';
for (var st = 0; st < 8; st++) {
cx.beginPath();
cx.ellipse(Math.random() * w, Math.random() * h, 8 + Math.random() * 20, 6 + Math.random() * 15, Math.random() * Math.PI, 0, Math.PI * 2);
cx.fill();
}
cx.fillStyle = 'rgba(90, 88, 82, 0.35)';
for (var gm = 0; gm < 5; gm++) {
cx.beginPath();
cx.arc(Math.random() * w, Math.random() * h, 2 + Math.random() * 4, 0, Math.PI * 2);
cx.fill();
}
cx.fillStyle = 'rgba(35, 35, 38, 0.12)';
for (var dp = 0; dp < 3; dp++) {
cx.beginPath();
cx.ellipse(Math.random() * w, Math.random() * h, 25 + Math.random() * 40, 20 + Math.random() * 30, Math.random(), 0, Math.PI * 2);
cx.fill();
}
});
var pavementMat = new THREE.MeshStandardMaterial({ map: paveTex, roughness: 0.9 });
// Road — grimy tarmac with aggregate, cracks, repair patches, tar-seal
var roadFaceTexLo = makeCanvasTexture(512, 512, function(cx, w, h) {
cx.fillStyle = '#181818'; cx.fillRect(0, 0, w, h);
for (var p = 0; p < 4200; p++) {
var pg = 25 + Math.floor(Math.random() * 70);
cx.fillStyle = 'rgba(' + pg + ',' + pg + ',' + pg + ',0.42)';
cx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
}
for (var rp = 0; rp < 6; rp++) {
var rx = Math.random() * w, ry = Math.random() * h;
var rwd = 50 + Math.random() * 100, rht = 35 + Math.random() * 70;
cx.fillStyle = 'rgba(72, 72, 72, ' + (0.16 + Math.random() * 0.22).toFixed(3) + ')';
cx.fillRect(rx, ry, rwd, rht);
cx.strokeStyle = 'rgba(100, 100, 100, 0.18)'; cx.lineWidth = 0.6;
cx.strokeRect(rx, ry, rwd, rht);
}
cx.strokeStyle = 'rgba(6, 6, 6, 0.8)'; cx.lineWidth = 1.2;
for (var c = 0; c < 10; c++) {
cx.beginPath();
var cx0 = Math.random() * w, cy0 = Math.random() * h;
cx.moveTo(cx0, cy0);
var ang = Math.random() * Math.PI * 2, len = 30 + Math.random() * 80;
cx.lineTo(cx0 + Math.cos(ang) * len, cy0 + Math.sin(ang) * len);
cx.lineTo(cx0 + Math.cos(ang + 0.4) * len * 1.4, cy0 + Math.sin(ang + 0.4) * len * 1.4);
cx.stroke();
}
cx.strokeStyle = 'rgba(0, 0, 0, 0.9)'; cx.lineWidth = 2.6;
for (var tm = 0; tm < 5; tm++) {
cx.beginPath();
var tx = Math.random() * w, ty = Math.random() * h;
cx.moveTo(tx, ty);
for (var ts = 0; ts < 5; ts++) {
tx += (Math.random() - 0.5) * 30;
ty += 8 + Math.random() * 16;
cx.lineTo(tx, ty);
}
cx.stroke();
}
cx.fillStyle = 'rgba(220, 220, 200, 0.5)';
cx.fillRect(w * 0.5 - 2, h * 0.3, 4, h * 0.4);
cx.fillStyle = 'rgba(220, 220, 200, 0.18)';
cx.fillRect(w * 0.5 - 2, h * 0.05, 4, h * 0.2);
cx.fillRect(w * 0.5 - 2, h * 0.75, 4, h * 0.2);
for (var os = 0; os < 4; os++) {
var ox = Math.random() * w, oy = Math.random() * h;
var orr = 8 + Math.random() * 18;
var og = cx.createRadialGradient(ox, oy, 0, ox, oy, orr);
og.addColorStop(0, 'rgba(0, 0, 0, 0.62)');
og.addColorStop(0.7, 'rgba(15, 12, 5, 0.22)');
og.addColorStop(1, 'rgba(15, 12, 5, 0)');
cx.fillStyle = og; cx.fillRect(ox - orr, oy - orr, orr * 2, orr * 2);
}
});
roadFaceTexLo.wrapS = roadFaceTexLo.wrapT = THREE.RepeatWrapping;
roadFaceTexLo.repeat.set(1, 8);
var roadMat = new THREE.MeshStandardMaterial({ map: roadFaceTexLo, roughness: 0.78, metalness: 0.15 });
var kerbMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.8 });
var paveMat = new THREE.MeshStandardMaterial({ map: paveTex, roughness: 0.85 });
var windowFrame = new THREE.MeshStandardMaterial({ color: 0x8a8070, roughness: 0.7 });
var darkGlass = new THREE.MeshStandardMaterial({ color: 0x0a0a12, roughness: 0.2, metalness: 0.3 });
var warmGlass = new THREE.MeshStandardMaterial({ color: 0x2a1505, roughness: 0.3, emissive: 0xe87818, emissiveIntensity: 0.12 });
var ironMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6, metalness: 0.4 });
var doorTex = makeCanvasTexture(256, 512, function(cx, w, h) {
cx.fillStyle = '#1a4a2a';
cx.fillRect(0, 0, w, h);
cx.strokeStyle = 'rgba(10, 50, 22, 0.4)';
cx.lineWidth = 1;
for (var gx = 0; gx < w; gx += 3 + Math.random() * 4) {
cx.beginPath();
cx.moveTo(gx, 0);
cx.lineTo(gx + (Math.random() - 0.5) * 2, h);
cx.stroke();
}
cx.fillStyle = 'rgba(12, 40, 18, 0.3)';
for (var k = 0; k < 5; k++) {
cx.beginPath();
cx.ellipse(Math.random() * w, Math.random() * h, 6 + Math.random() * 8, 3 + Math.random() * 4, Math.random() * Math.PI, 0, Math.PI * 2);
cx.fill();
}
cx.fillStyle = 'rgba(35, 80, 45, 0.15)';
cx.fillRect(0, 0, 8, h);
cx.fillRect(w - 8, 0, 8, h);
cx.fillRect(0, 0, w, 6);
cx.fillRect(0, h - 6, w, 6);
cx.fillStyle = 'rgba(20, 30, 15, 0.25)';
for (var sc = 0; sc < 12; sc++) {
cx.fillRect(Math.random() * w, h - 20 - Math.random() * 60, 15 + Math.random() * 25, 1 + Math.random() * 2);
}
cx.fillStyle = 'rgba(30, 50, 25, 0.08)';
cx.fillRect(0, 0, w, h * 0.15);
cx.fillStyle = 'rgba(15, 35, 18, 0.06)';
cx.fillRect(0, h * 0.85, w, h * 0.15);
});
var racingGreen = new THREE.MeshStandardMaterial({ map: doorTex, roughness: 0.5, metalness: 0.05 });
var panelTex = makeCanvasTexture(256, 512, function(cx, w, h) {
cx.fillStyle = '#143820';
cx.fillRect(0, 0, w, h);
cx.strokeStyle = 'rgba(8, 40, 16, 0.35)';
cx.lineWidth = 1;
for (var gx = 0; gx < w; gx += 3 + Math.random() * 5) {
cx.beginPath();
cx.moveTo(gx, 0);
cx.lineTo(gx + (Math.random() - 0.5) * 2, h);
cx.stroke();
}
var panelShadow = cx.createLinearGradient(0, 0, 0, h);
panelShadow.addColorStop(0, 'rgba(5, 15, 8, 0.2)');
panelShadow.addColorStop(0.3, 'rgba(5, 15, 8, 0)');
panelShadow.addColorStop(1, 'rgba(5, 15, 8, 0.05)');
cx.fillStyle = panelShadow;
cx.fillRect(0, 0, w, h);
});
var racingGreenDark = new THREE.MeshStandardMaterial({ map: panelTex, roughness: 0.55, metalness: 0.05 });
var brassMat = new THREE.MeshStandardMaterial({
color: 0xb8922a, roughness: 0.25, metalness: 0.85
});
var brassMatDull = new THREE.MeshStandardMaterial({
color: 0x8a7020, roughness: 0.4, metalness: 0.7
});

// ============================================================
// HELPERS
// ============================================================
function makeCanvasTexture(w, h, drawFunc) {
var c = document.createElement('canvas');
c.width = w; c.height = h;
var cx = c.getContext('2d');
drawFunc(cx, w, h);
var tex = new THREE.CanvasTexture(c);
tex.minFilter = THREE.LinearFilter;
return tex;
}

function placeMesh(geo, mat, x, y, z) {
var m = new THREE.Mesh(geo, mat);
m.position.set(x, y, z);
scene.add(m);
return m;
}

// ============================================================
// GROUND
// ============================================================
var pavement = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), paveMat);
pavement.rotation.x = -Math.PI / 2;
pavement.receiveShadow = true;
scene.add(pavement);

var road = new THREE.Mesh(new THREE.PlaneGeometry(40, 7), roadMat);
road.rotation.x = -Math.PI / 2;
road.position.set(0, 0.004, 6);
road.receiveShadow = true;
scene.add(road);

var kerb = new THREE.Mesh(new THREE.BoxGeometry(30, 0.15, 0.15), kerbMat);
kerb.position.set(0, 0.075, 2.5);
scene.add(kerb);

var raisedPave = new THREE.Mesh(new THREE.BoxGeometry(30, 0.12, 3), paveMat);
raisedPave.position.set(0, 0.06, 1);
raisedPave.receiveShadow = true;
scene.add(raisedPave);

var wetMat = new THREE.MeshStandardMaterial({
color: 0x1a1a1a, roughness: 0.12, metalness: 0.5, transparent: true, opacity: 0.3
});
var wetRoad = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), wetMat);
wetRoad.rotation.x = -Math.PI / 2;
wetRoad.position.set(1, 0.01, 5);
scene.add(wetRoad);

// ============================================================
// THE BUILDING — Georgian townhouse facade
// ============================================================
var building = new THREE.Group();

var facade = new THREE.Mesh(new THREE.BoxGeometry(7, 14, 1.5), creamStucco);
facade.position.set(0, 7, -0.75);
facade.castShadow = true;
building.add(facade);

var groundBase = new THREE.Mesh(new THREE.BoxGeometry(7.05, 3.5, 0.1), darkStucco);
groundBase.position.set(0, 1.75, 0.02);
building.add(groundBase);

var grooveMat = new THREE.MeshStandardMaterial({ color: 0x908878, roughness: 0.8 });
for (var i = 0; i < 5; i++) {
var gy = 0.5 + i * 0.7;
var g1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.08), grooveMat);
g1.position.set(-3.2, gy, 0.04);
building.add(g1);
var g2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.08), grooveMat);
g2.position.set(-1.25, gy, 0.04);
building.add(g2);
var g3 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.08), grooveMat);
g3.position.set(1.25, gy, 0.04);
building.add(g3);
var g4 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.08), grooveMat);
g4.position.set(3.2, gy, 0.04);
building.add(g4);
}

var stringCourse = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.2, 0.12), whiteStone);
stringCourse.position.set(0, 3.8, 0.05);
building.add(stringCourse);

var cornice = new THREE.Mesh(new THREE.BoxGeometry(7.3, 0.25, 0.2), whiteStone);
cornice.position.set(0, 13.9, 0.1);
building.add(cornice);
var corniceUnder = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.12, 0.15), greyStone);
corniceUnder.position.set(0, 13.7, 0.08);
building.add(corniceUnder);

// ============================================================
// THE DOOR — Racing green Georgian door
// ============================================================
var doorGroup = new THREE.Group();

var doorRecess = new THREE.Mesh(
new THREE.BoxGeometry(1.4, 3.2, 0.3),
new THREE.MeshStandardMaterial({ color: 0x3a3530, roughness: 0.9 })
);
doorRecess.position.set(0, 1.7, -0.05);
doorGroup.add(doorRecess);

var woodFrameTex = makeCanvasTexture(128, 512, function(cx, w, h) {
cx.fillStyle = '#2a1e14';
cx.fillRect(0, 0, w, h);
cx.strokeStyle = 'rgba(50, 35, 22, 0.5)';
cx.lineWidth = 1;
for (var gx = 0; gx < w; gx += 2 + Math.random() * 3) {
cx.beginPath();
cx.moveTo(gx, 0);
cx.lineTo(gx + (Math.random() - 0.5) * 2, h);
cx.stroke();
}
cx.fillStyle = 'rgba(15, 10, 5, 0.15)';
cx.fillRect(0, 0, 6, h);
cx.fillRect(w - 6, 0, 6, h);
});
var woodFrameMat = new THREE.MeshStandardMaterial({ map: woodFrameTex, roughness: 0.55, metalness: 0.05 });

var frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.9, 0.07), woodFrameMat);
frameLeft.position.set(-0.6, 1.55, 0.06);
doorGroup.add(frameLeft);
var frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.9, 0.07), woodFrameMat);
frameRight.position.set(0.6, 1.55, 0.06);
doorGroup.add(frameRight);
var frameTop = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.08, 0.07), woodFrameMat);
frameTop.position.set(0, 3.01, 0.06);
doorGroup.add(frameTop);
var frameBottom = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.05, 0.07), woodFrameMat);
frameBottom.position.set(0, 0.13, 0.06);
doorGroup.add(frameBottom);

var doorSlab = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.8, 0.08), racingGreen);
doorSlab.position.set(0, 1.55, 0.08);
doorSlab.castShadow = true;
doorGroup.add(doorSlab);

var panelGeo1 = new THREE.BoxGeometry(0.38, 0.65, 0.03);
var topPanelL = new THREE.Mesh(panelGeo1, racingGreenDark);
topPanelL.position.set(-0.22, 2.55, 0.12);
doorGroup.add(topPanelL);
var topPanelR = new THREE.Mesh(panelGeo1, racingGreenDark);
topPanelR.position.set(0.22, 2.55, 0.12);
doorGroup.add(topPanelR);

var panelGeo2 = new THREE.BoxGeometry(0.38, 0.45, 0.03);
var midPanelL = new THREE.Mesh(panelGeo2, racingGreenDark);
midPanelL.position.set(-0.22, 1.65, 0.12);
doorGroup.add(midPanelL);
var midPanelR = new THREE.Mesh(panelGeo2, racingGreenDark);
midPanelR.position.set(0.22, 1.65, 0.12);
doorGroup.add(midPanelR);

var panelGeo3 = new THREE.BoxGeometry(0.38, 0.6, 0.03);
var botPanelL = new THREE.Mesh(panelGeo3, racingGreenDark);
botPanelL.position.set(-0.22, 0.75, 0.12);
doorGroup.add(botPanelL);
var botPanelR = new THREE.Mesh(panelGeo3, racingGreenDark);
botPanelR.position.set(0.22, 0.75, 0.12);
doorGroup.add(botPanelR);

var mouldMat = new THREE.MeshStandardMaterial({ color: 0x1e5530, roughness: 0.45 });

function addPanelMould(cx, cy, pw, ph) {
doorGroup.add(new THREE.Mesh(new THREE.BoxGeometry(pw + 0.06, 0.025, 0.02), mouldMat).translateX(cx).translateY(cy + ph/2 + 0.01).translateZ(0.13));
doorGroup.add(new THREE.Mesh(new THREE.BoxGeometry(pw + 0.06, 0.025, 0.02), mouldMat).translateX(cx).translateY(cy - ph/2 - 0.01).translateZ(0.13));
doorGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.025, ph + 0.06, 0.02), mouldMat).translateX(cx - pw/2 - 0.01).translateY(cy).translateZ(0.13));
doorGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.025, ph + 0.06, 0.02), mouldMat).translateX(cx + pw/2 + 0.01).translateY(cy).translateZ(0.13));
}

addPanelMould(-0.22, 2.55, 0.38, 0.65);
addPanelMould(0.22, 2.55, 0.38, 0.65);
addPanelMould(-0.22, 1.65, 0.38, 0.45);
addPanelMould(0.22, 1.65, 0.38, 0.45);
addPanelMould(-0.22, 0.75, 0.38, 0.6);
addPanelMould(0.22, 0.75, 0.38, 0.6);

var centreStile = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.6, 0.02), racingGreen);
centreStile.position.set(0, 1.55, 0.12);
doorGroup.add(centreStile);

var backplate = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.015, 16), brassMat);
backplate.rotation.x = Math.PI / 2;
backplate.position.set(0, 1.55, 0.14);
doorGroup.add(backplate);

var knobStem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.07, 8), brassMat);
knobStem.rotation.x = Math.PI / 2;
knobStem.position.set(0, 1.55, 0.18);
doorGroup.add(knobStem);

var knob = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 12), brassMat);
knob.position.set(0, 1.55, 0.25);
doorGroup.add(knob);

var keyholeEsc = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.01, 8), brassMatDull);
keyholeEsc.rotation.x = Math.PI / 2;
keyholeEsc.position.set(0.32, 1.3, 0.13);
doorGroup.add(keyholeEsc);
var keyholeSlot = new THREE.Mesh(
new THREE.BoxGeometry(0.008, 0.02, 0.01),
new THREE.MeshStandardMaterial({ color: 0x050505 })
);
keyholeSlot.position.set(0.32, 1.3, 0.14);
doorGroup.add(keyholeSlot);

var letterbox = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.015), brassMat);
letterbox.position.set(0, 1.1, 0.13);
doorGroup.add(letterbox);
var letterSlot = new THREE.Mesh(
new THREE.BoxGeometry(0.22, 0.015, 0.02),
new THREE.MeshStandardMaterial({ color: 0x0a0a05 })
);
letterSlot.position.set(0, 1.1, 0.14);
doorGroup.add(letterSlot);

var pilasterL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.0, 0.12), whiteStone);
pilasterL.position.set(-0.85, 1.6, 0.05);
doorGroup.add(pilasterL);

var pilasterR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.0, 0.12), whiteStone);
pilasterR.position.set(0.85, 1.6, 0.05);
doorGroup.add(pilasterR);

var pilBaseL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.15), whiteStone);
pilBaseL.position.set(-0.85, 0.1, 0.06);
doorGroup.add(pilBaseL);
var pilBaseR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.15), whiteStone);
pilBaseR.position.set(0.85, 0.1, 0.06);
doorGroup.add(pilBaseR);

var capitalMat = new THREE.MeshStandardMaterial({ color: 0xd0c8b8, roughness: 0.65 });
var capL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.15, 0.16), capitalMat);
capL.position.set(-0.85, 3.2, 0.07);
doorGroup.add(capL);
var capR = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.15, 0.16), capitalMat);
capR.position.set(0.85, 3.2, 0.07);
doorGroup.add(capR);

var entablature = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.18, 0.18), whiteStone);
entablature.position.set(0, 3.4, 0.08);
doorGroup.add(entablature);

var pediment = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.2), capitalMat);
pediment.position.set(0, 3.55, 0.1);
doorGroup.add(pediment);

var fanlightGlass = new THREE.MeshStandardMaterial({
color: 0x0a0808, roughness: 0.2, emissive: 0xc08030, emissiveIntensity: 0.15
});
var fanlight = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.4, 0.05), fanlightGlass);
fanlight.position.set(0, 3.1, 0.06);
doorGroup.add(fanlight);

var fanlightFrame = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.42, 0.02), windowFrame);
fanlightFrame.position.set(0, 3.1, 0.04);
doorGroup.add(fanlightFrame);

for (var i = 0; i < 5; i++) {
var bar = new THREE.Mesh(
new THREE.BoxGeometry(0.015, 0.38, 0.01),
new THREE.MeshStandardMaterial({ color: 0x6a6050, roughness: 0.7 })
);
bar.position.set(-0.4 + i * 0.2, 3.1, 0.08);
bar.rotation.z = (i - 2) * 0.12;
doorGroup.add(bar);
}

var buzzerPanelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a18, roughness: 0.5, metalness: 0.4 });
var buzzerPanel = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.65, 0.03), buzzerPanelMat);
buzzerPanel.position.set(1.25, 1.5, 0.08);
doorGroup.add(buzzerPanel);

var buzzerFrame = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.67, 0.01), brassMatDull);
buzzerFrame.position.set(1.25, 1.5, 0.065);
doorGroup.add(buzzerFrame);

var buzzerLight = new THREE.PointLight(0xffe0a0, 0.15, 2);
buzzerLight.position.set(1.25, 1.9, 0.5);
doorGroup.add(buzzerLight);

function addBuzzerRow(yPos, labelText) {
var btn = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 12), brassMat);
btn.rotation.x = Math.PI / 2;
btn.position.set(1.35, yPos, 0.1);
doorGroup.add(btn);
var rim = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.008, 12), brassMatDull);
rim.rotation.x = Math.PI / 2;
rim.position.set(1.35, yPos, 0.095);
doorGroup.add(rim);
var divider = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.005, 0.01), brassMatDull);
divider.position.set(1.25, yPos - 0.09, 0.095);
doorGroup.add(divider);
var labelTex = makeCanvasTexture(256, 64, function(cx, w, h) {
cx.fillStyle = labelText ? '#e8e0c8' : '#d8d0b8';
cx.fillRect(0, 0, w, h);
if (!labelText) {
cx.fillStyle = 'rgba(140, 120, 80, 0.12)';
cx.fillRect(0, 0, w, h);
cx.strokeStyle = 'rgba(100, 70, 30, 0.1)';
cx.lineWidth = 2;
cx.beginPath();
cx.arc(w * 0.55, h * 0.5, 14, 0, Math.PI * 2);
cx.stroke();
}
cx.strokeStyle = '#8a7020';
cx.lineWidth = 2;
cx.strokeRect(3, 3, w - 6, h - 6);
if (labelText) {
cx.fillStyle = '#1a1a1a';
cx.font = '600 18px Georgia';
cx.textAlign = 'center';
cx.textBaseline = 'middle';
cx.fillText(labelText, w/2, h/2);
}
});
var labelMat = new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.45 });
var label = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.05), labelMat);
label.position.set(1.18, yPos, 0.1);
doorGroup.add(label);
}

addBuzzerRow(1.32, 'M. LACKLAND');
addBuzzerRow(1.5, '');
addBuzzerRow(1.68, '');

var stepTex = makeCanvasTexture(512, 128, function(cx, w, h) {
cx.fillStyle = '#8a8878';
cx.fillRect(0, 0, w, h);
var wornGrad = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w * 0.4);
wornGrad.addColorStop(0, 'rgba(70, 68, 60, 0.35)');
wornGrad.addColorStop(0.6, 'rgba(80, 78, 68, 0.15)');
wornGrad.addColorStop(1, 'rgba(90, 88, 78, 0)');
cx.fillStyle = wornGrad;
cx.fillRect(0, 0, w, h);
cx.fillStyle = 'rgba(40, 35, 25, 0.3)';
cx.fillRect(0, 0, w, 8);
cx.fillRect(0, h - 6, w, 6);
cx.fillRect(0, 0, 10, h);
cx.fillRect(w - 10, 0, 10, h);
cx.strokeStyle = 'rgba(55, 50, 40, 0.2)';
cx.lineWidth = 1;
for (var sc = 0; sc < 20; sc++) {
cx.beginPath();
var sx = Math.random() * w;
cx.moveTo(sx, Math.random() * h);
cx.lineTo(sx + 10 + Math.random() * 30, Math.random() * h);
cx.stroke();
}
cx.fillStyle = 'rgba(30, 25, 18, 0.2)';
for (var st = 0; st < 4; st++) {
cx.beginPath();
cx.ellipse(50 + Math.random() * (w - 100), 20 + Math.random() * (h - 40), 8 + Math.random() * 15, 4 + Math.random() * 8, Math.random(), 0, Math.PI * 2);
cx.fill();
}
cx.fillStyle = 'rgba(25, 20, 10, 0.4)';
cx.beginPath();
cx.arc(w * 0.7, h * 0.6, 3, 0, Math.PI * 2);
cx.fill();
});
var stepMat = new THREE.MeshStandardMaterial({ map: stepTex, roughness: 0.8, metalness: 0.0 });
var doorStep = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.4), stepMat);
doorStep.position.set(0, 0.05, 0.3);
doorGroup.add(doorStep);

var numberTex = makeCanvasTexture(128, 64, function(cx, w, h) {
cx.fillStyle = 'rgba(0,0,0,0)';
cx.fillRect(0, 0, w, h);
cx.fillStyle = '#c8c0a0';
cx.font = 'bold 28px Georgia';
cx.textAlign = 'center';
cx.textBaseline = 'middle';
cx.fillText('14', w/2, h/2);
});
var numberMat = new THREE.MeshStandardMaterial({
map: numberTex, roughness: 0.5, transparent: true
});
var numberPlate = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.1), numberMat);
numberPlate.position.set(0, 3.65, 0.12);
doorGroup.add(numberPlate);

var wallSignTex = makeCanvasTexture(512, 128, function(cx, w, h) {
cx.fillStyle = '#8a7a30';
cx.fillRect(0, 0, w, h);
cx.strokeStyle = '#5a4a18';
cx.lineWidth = 6;
cx.strokeRect(6, 6, w - 12, h - 12);
cx.strokeStyle = '#b8a240';
cx.lineWidth = 2;
cx.strokeRect(12, 12, w - 24, h - 24);
cx.fillStyle = '#1a1508';
cx.font = '600 42px Georgia';
cx.textAlign = 'center';
cx.textBaseline = 'middle';
cx.fillText('M. LACKLAND', w/2, h/2);
});
var wallSignMat = new THREE.MeshStandardMaterial({
map: wallSignTex, roughness: 0.3, metalness: 0.6
});
var wallSign = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.18), wallSignMat);
wallSign.position.set(0, 3.72, 0.15);
doorGroup.add(wallSign);

var screwMat2 = new THREE.MeshStandardMaterial({ color: 0xb8922a, roughness: 0.3, metalness: 0.8 });
var screwGeo2 = new THREE.SphereGeometry(0.015, 6, 4);
var screw1 = new THREE.Mesh(screwGeo2, screwMat2);
screw1.position.set(-0.32, 3.79, 0.16);
doorGroup.add(screw1);
var screw2 = new THREE.Mesh(screwGeo2, screwMat2);
screw2.position.set(0.32, 3.79, 0.16);
doorGroup.add(screw2);
var screw3 = new THREE.Mesh(screwGeo2, screwMat2);
screw3.position.set(-0.32, 3.65, 0.16);
doorGroup.add(screw3);
var screw4 = new THREE.Mesh(screwGeo2, screwMat2);
screw4.position.set(0.32, 3.65, 0.16);
doorGroup.add(screw4);

var signLight = new THREE.PointLight(0xffe0a0, 0.2, 3);
signLight.position.set(0, 4.1, 0.8);
doorGroup.add(signLight);

doorGroup.position.set(0, 0.12, 0);
scene.add(doorGroup);

function addSashWindow(x, y, lit) {
var surround = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.5, 0.08), whiteStone);
surround.position.set(x, y, 0.03);
building.add(surround);
var glassMat = (window.dssScene && window.dssScene.makeDressedWindow)
? window.dssScene.makeDressedWindow(lit, Math.floor(Math.abs(x * 7.3 + y * 3.1)) % 3, Math.floor(Math.abs(x * 5.1 + y * 1.7)) % 4)
: (lit ? warmGlass : darkGlass);
var glass = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.3, 0.04), glassMat);
glass.position.set(x, y, 0.05);
building.add(glass);
var glazBar = new THREE.Mesh(
new THREE.BoxGeometry(0.72, 0.03, 0.02),
windowFrame
);
glazBar.position.set(x, y + 0.1, 0.07);
building.add(glazBar);
var sill = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.15), whiteStone);
sill.position.set(x, y - 0.75, 0.06);
building.add(sill);
var lintel = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 0.1), whiteStone);
lintel.position.set(x, y + 0.8, 0.04);
building.add(lintel);
}

addSashWindow(-2.2, 5.5, false);
addSashWindow(0, 5.5, false);
addSashWindow(2.2, 5.5, false);

addSashWindow(-2.2, 8.5, false);
addSashWindow(0, 8.5, false);
addSashWindow(2.2, 8.5, false);

addSashWindow(-2.2, 11.2, false);
addSashWindow(0, 11.2, false);
addSashWindow(2.2, 11.2, false);

var amberGlass = new THREE.MeshStandardMaterial({
color: 0x2a1805, roughness: 0.3, emissive: 0xd8a030, emissiveIntensity: 0.18
});
// Red-light windows as DRESSED ROOMS tinted red (the Pillars standard) —
// drapes at the edges, a shaded lamp burning low, wall tone behind —
// instead of a flat saturated pane.
var redRoomTex = makeCanvasTexture(128, 256, function(cx, w, h) {
  // Deep red room base with darker floor falloff
  var room = cx.createLinearGradient(0, 0, 0, h);
  room.addColorStop(0, '#4c0404');
  room.addColorStop(0.55, '#961010');
  room.addColorStop(1, '#360202');
  cx.fillStyle = room; cx.fillRect(0, 0, w, h);
  // The lamp: a hot shaded core off-centre, mid-height
  var lamp = cx.createRadialGradient(w * 0.62, h * 0.52, 2, w * 0.62, h * 0.52, w * 0.55);
  lamp.addColorStop(0, 'rgba(255,70,60,0.95)');
  lamp.addColorStop(0.25, 'rgba(240,28,24,0.65)');
  lamp.addColorStop(1, 'rgba(150,8,8,0)');
  cx.fillStyle = lamp; cx.fillRect(0, 0, w, h);
  // Lampshade silhouette over the core
  cx.fillStyle = 'rgba(30,4,4,0.75)';
  cx.beginPath();
  cx.moveTo(w * 0.52, h * 0.50); cx.lineTo(w * 0.72, h * 0.50);
  cx.lineTo(w * 0.68, h * 0.42); cx.lineTo(w * 0.56, h * 0.42);
  cx.closePath(); cx.fill();
  // Heavy drapes bunched at both edges
  cx.fillStyle = 'rgba(20,2,2,0.9)';
  cx.beginPath();
  cx.moveTo(0, 0); cx.lineTo(w * 0.24, 0);
  cx.quadraticCurveTo(w * 0.12, h * 0.5, w * 0.20, h);
  cx.lineTo(0, h); cx.closePath(); cx.fill();
  cx.beginPath();
  cx.moveTo(w, 0); cx.lineTo(w * 0.82, 0);
  cx.quadraticCurveTo(w * 0.92, h * 0.55, w * 0.86, h);
  cx.lineTo(w, h); cx.closePath(); cx.fill();
  // Drape folds
  cx.strokeStyle = 'rgba(60,8,8,0.5)'; cx.lineWidth = 2;
  [0.07, 0.13, 0.90, 0.95].forEach(function(fx) {
    cx.beginPath(); cx.moveTo(w * fx, 0); cx.lineTo(w * (fx + 0.02), h); cx.stroke();
  });
  // Pelmet shadow across the top
  var pel = cx.createLinearGradient(0, 0, 0, h * 0.14);
  pel.addColorStop(0, 'rgba(15,2,2,0.9)'); pel.addColorStop(1, 'rgba(15,2,2,0)');
  cx.fillStyle = pel; cx.fillRect(0, 0, w, h * 0.14);
  // Grime on the glass itself
  cx.fillStyle = 'rgba(20,10,8,0.12)';
  for (var g = 0; g < 14; g++) {
    cx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 8, 1 + Math.random() * 4);
  }
});
var redGlass = new THREE.MeshBasicMaterial({ map: redRoomTex });

var amberWin = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.3, 0.045), amberGlass);
amberWin.position.set(-2.2, 11.2, 0.055);
building.add(amberWin);

var redWin = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.3, 0.045), redGlass);
redWin.position.set(2.2, 11.2, 0.055);
building.add(redWin);

var amberWinGlow = new THREE.PointLight(0xd8a030, 0.15, 4);
amberWinGlow.position.set(-2.2, 11.2, 0.8);
scene.add(amberWinGlow);

var redWinGlow = new THREE.PointLight(0xff2020, 1.0, 6);
redWinGlow.position.set(2.2, 11.2, 1.2);
scene.add(redWinGlow);

var redWin1F = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.3, 0.045), redGlass);
redWin1F.position.set(-2.2, 5.5, 0.055);
building.add(redWin1F);

var redWinGlow1F = new THREE.PointLight(0xff2020, 1.1, 7);
redWinGlow1F.position.set(-2.2, 5.5, 1.5);
scene.add(redWinGlow1F);
// The red of Lackland's first-floor window lying on the wet pavement
// beneath it: one additive plane, a tall red smear cut by flag joints,
// flickering with the working light behind the curtain.
var loRedReflTex = makeCanvasTexture(64, 128, function(cx, w, h) {
cx.clearRect(0, 0, w, h);
var g = cx.createRadialGradient(w / 2, h * 0.35, 0, w / 2, h * 0.35, w * 0.5);
g.addColorStop(0, 'rgba(255,60,50,0.75)'); g.addColorStop(0.5, 'rgba(255,40,40,0.3)'); g.addColorStop(1, 'rgba(255,30,30,0)');
cx.save(); cx.translate(w / 2, h * 0.35); cx.scale(1, 1.9); cx.translate(-w / 2, -h * 0.35);
cx.fillStyle = g; cx.beginPath(); cx.arc(w / 2, h * 0.35, w * 0.5, 0, Math.PI * 2); cx.fill(); cx.restore();
cx.strokeStyle = 'rgba(0,0,0,0.5)'; cx.lineWidth = 2;
for (var k = 0; k <= h; k += 26) { cx.beginPath(); cx.moveTo(0, k); cx.lineTo(w, k); cx.stroke(); }
cx.beginPath(); cx.moveTo(w * 0.55, 0); cx.lineTo(w * 0.55, h); cx.stroke();
});
var loRedRefl = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.9), new THREE.MeshBasicMaterial({
map: loRedReflTex, transparent: true, opacity: 0.13, blending: THREE.AdditiveBlending, depthWrite: false, fog: false
}));
loRedRefl.rotation.x = -Math.PI / 2;
loRedRefl.position.set(-2.2, 0.125, 1.4); // on top of the raised pavement (y 0.12), between the wall and the kerb
scene.add(loRedRefl);

var curtainGlass1F = new THREE.MeshStandardMaterial({
color: 0x080808, roughness: 0.95, metalness: 0.0
});
var darkWin1F = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.3, 0.05), curtainGlass1F);
darkWin1F.position.set(0, 5.5, 0.055);
building.add(darkWin1F);

var darkWin1FBar = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.03, 0.02), windowFrame);
darkWin1FBar.position.set(0, 5.6, 0.08);
building.add(darkWin1FBar);

var workingGlass1F = new THREE.MeshStandardMaterial({
color: 0x0a0a08, roughness: 0.3, metalness: 0.1,
emissive: 0xc08030, emissiveIntensity: 0.0
});
var workWin1F = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.3, 0.045), workingGlass1F);
workWin1F.position.set(2.2, 5.5, 0.055);
building.add(workWin1F);

var workingGlow1F = new THREE.PointLight(0xc08030, 0.0, 4);
workingGlow1F.position.set(2.2, 5.5, 1.0);
scene.add(workingGlow1F);

// LIVING ELEMENT: Lackland at the working window — seated silhouette bowed
// over the desk, breathing; a pale page turns every 16-26s (the O'Flatterly
// dealer pattern). Sits behind the flickering work light.
var loFigTex = makeCanvasTexture(128, 256, function(cx, w, h) {
cx.fillStyle = 'rgba(6,4,3,0.92)';
// Desk line across the lower third
cx.fillRect(0, h * 0.72, w, h * 0.05);
// Seated body: back rising from desk right, leaning over it
cx.beginPath();
cx.moveTo(w * 0.78, h * 0.72);
cx.quadraticCurveTo(w * 0.82, h * 0.42, w * 0.62, h * 0.30);
cx.quadraticCurveTo(w * 0.46, h * 0.22, w * 0.42, h * 0.34);
cx.quadraticCurveTo(w * 0.40, h * 0.46, w * 0.50, h * 0.52);
cx.lineTo(w * 0.52, h * 0.72);
cx.closePath();
cx.fill();
// Bowed head over the papers
cx.beginPath();
cx.ellipse(w * 0.40, h * 0.33, w * 0.10, h * 0.062, 0.5, 0, Math.PI * 2);
cx.fill();
// Forward arm onto the desk
cx.beginPath();
cx.moveTo(w * 0.48, h * 0.50);
cx.quadraticCurveTo(w * 0.30, h * 0.58, w * 0.18, h * 0.70);
cx.lineTo(w * 0.26, h * 0.73);
cx.quadraticCurveTo(w * 0.38, h * 0.62, w * 0.52, h * 0.58);
cx.closePath();
cx.fill();
// Anglepoise hint: stem + shade over the papers, left
cx.strokeStyle = 'rgba(6,4,3,0.9)'; cx.lineWidth = 3;
cx.beginPath(); cx.moveTo(w * 0.10, h * 0.72); cx.lineTo(w * 0.16, h * 0.52); cx.stroke();
cx.fillStyle = 'rgba(6,4,3,0.9)';
cx.beginPath();
cx.moveTo(w * 0.08, h * 0.52); cx.lineTo(w * 0.26, h * 0.52);
cx.lineTo(w * 0.21, h * 0.45); cx.lineTo(w * 0.12, h * 0.45);
cx.closePath(); cx.fill();
});
var loFigure = new THREE.Mesh(
new THREE.PlaneGeometry(0.62, 1.15),
new THREE.MeshBasicMaterial({ map: loFigTex, transparent: true, depthWrite: false })
);
loFigure.position.set(2.2, 5.42, 0.09);
loFigure.userData.noShadow = true;
building.add(loFigure);
var loPage = new THREE.Mesh(
new THREE.PlaneGeometry(0.11, 0.075),
new THREE.MeshBasicMaterial({ color: 0xe8dcc0, transparent: true, opacity: 0.85, depthWrite: false })
);
loPage.position.set(2.06, 5.16, 0.095);
loPage.userData.noShadow = true;
building.add(loPage);
var loPageState = { next: 9 + Math.random() * 12, t: -1 };
var loLastT = 0;

var curtainGlass = new THREE.MeshStandardMaterial({
color: 0x080808, roughness: 0.95, metalness: 0.0
});
var curtainPatternTex = makeCanvasTexture(256, 512, function(cx, w, h) {
cx.fillStyle = '#0a0a08';
cx.fillRect(0, 0, w, h);
cx.fillStyle = 'rgba(180, 170, 150, 0.18)';
cx.fillRect(0, 0, w, h);
cx.strokeStyle = 'rgba(220, 210, 190, 0.22)';
cx.lineWidth = 1;
var spacing = 18;
for (var dy = -h; dy < h * 2; dy += spacing) {
cx.beginPath();
cx.moveTo(0, dy);
cx.lineTo(w, dy + w);
cx.stroke();
cx.beginPath();
cx.moveTo(0, dy);
cx.lineTo(w, dy - w);
cx.stroke();
}
cx.fillStyle = 'rgba(230, 220, 200, 0.15)';
for (var px = 0; px < w; px += spacing) {
for (var py = 0; py < h; py += spacing) {
cx.beginPath();
cx.arc(px, py, 2.5, 0, Math.PI * 2);
cx.fill();
}
}
cx.strokeStyle = 'rgba(160, 150, 130, 0.1)';
cx.lineWidth = 3;
for (var dx = 20; dx < w; dx += 40) {
cx.beginPath();
cx.moveTo(dx, 0);
cx.bezierCurveTo(dx - 5, h * 0.3, dx + 5, h * 0.6, dx - 3, h);
cx.stroke();
}
var glow = cx.createRadialGradient(w * 0.6, h * 0.4, 10, w * 0.6, h * 0.4, w * 0.6);
glow.addColorStop(0, 'rgba(192, 128, 48, 0.18)');
glow.addColorStop(0.5, 'rgba(192, 128, 48, 0.06)');
glow.addColorStop(1, 'rgba(192, 128, 48, 0)');
cx.fillStyle = glow;
cx.fillRect(0, 0, w, h);
});

var curtainMatL = new THREE.MeshStandardMaterial({
map: curtainPatternTex, roughness: 0.7, emissive: 0xc08030, emissiveIntensity: 0.0
});
var curtainMatR = new THREE.MeshStandardMaterial({
map: curtainPatternTex, roughness: 0.7, emissive: 0xc08030, emissiveIntensity: 0.0
});

var gfSurroundL = new THREE.Mesh(new THREE.BoxGeometry(1.35, 2.15, 0.25), whiteStone);
gfSurroundL.position.set(-2.2, 1.8, 0.15);
building.add(gfSurroundL);
var gfWinL = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.9, 0.02), curtainMatL);
gfWinL.position.set(-2.2, 1.8, 0.29);
building.add(gfWinL);
var gfBarL = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.03, 0.02), windowFrame);
gfBarL.position.set(-2.2, 1.9, 0.31);
building.add(gfBarL);
var gfSillL = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.08, 0.25), whiteStone);
gfSillL.position.set(-2.2, 0.72, 0.15);
building.add(gfSillL);
var gfLintelL = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.1, 0.2), whiteStone);
gfLintelL.position.set(-2.2, 2.9, 0.12);
building.add(gfLintelL);

var gfSurroundR = new THREE.Mesh(new THREE.BoxGeometry(1.35, 2.15, 0.25), whiteStone);
gfSurroundR.position.set(2.2, 1.8, 0.15);
building.add(gfSurroundR);
var gfWinR = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.9, 0.02), curtainMatR);
gfWinR.position.set(2.2, 1.8, 0.29);
building.add(gfWinR);
var gfBarR = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.03, 0.02), windowFrame);
gfBarR.position.set(2.2, 1.9, 0.31);
building.add(gfBarR);
var gfSillR = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.08, 0.25), whiteStone);
gfSillR.position.set(2.2, 0.72, 0.15);
building.add(gfSillR);
var gfLintelR = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.1, 0.2), whiteStone);
gfLintelR.position.set(2.2, 2.9, 0.12);
building.add(gfLintelR);

var workingGlowGFL = new THREE.PointLight(0xc08030, 0.0, 3);
workingGlowGFL.position.set(-2.2, 1.8, 0.6);
scene.add(workingGlowGFL);

var workingGlow = new THREE.PointLight(0xc08030, 0.0, 3);
workingGlow.position.set(2.2, 1.8, 0.6);
scene.add(workingGlow);

scene.add(building);

var leftNeighbour = new THREE.Mesh(new THREE.BoxGeometry(6, 15, 2), sootBrick);
leftNeighbour.position.set(-6.5, 7.5, -1);
leftNeighbour.castShadow = true;
scene.add(leftNeighbour);

for (var row = 0; row < 3; row++) {
var wx = -6.5;
var wy = 5 + row * 3.2;
var wf = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.2, 0.06), windowFrame);
wf.position.set(wx, wy, 0.02);
scene.add(wf);
var wg = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.0, 0.04), (row === 1) ? warmGlass : darkGlass);
wg.position.set(wx, wy, 0.04);
scene.add(wg);
}

var rightNeighbour = new THREE.Mesh(new THREE.BoxGeometry(6, 13, 2), redBrick);
rightNeighbour.position.set(6.5, 6.5, -1);
rightNeighbour.castShadow = true;
scene.add(rightNeighbour);

for (var row = 0; row < 3; row++) {
for (var col = 0; col < 2; col++) {
var wx2 = 5.5 + col * 2;
var wy2 = 4.5 + row * 3;
var wf2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.2, 0.06), windowFrame);
wf2.position.set(wx2, wy2, 0.02);
scene.add(wf2);
var wg2 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.0, 0.04), (row === 0 && col === 1) ? warmGlass : darkGlass);
wg2.position.set(wx2, wy2, 0.04);
scene.add(wg2);
}
}

var acrossRoad = new THREE.Mesh(new THREE.BoxGeometry(20, 12, 2), sootBrick);
acrossRoad.position.set(0, 6, 12);
scene.add(acrossRoad);

var chimMat = new THREE.MeshStandardMaterial({ color: 0x2a2520, roughness: 0.85 });
placeMesh(new THREE.BoxGeometry(0.5, 1.5, 0.5), chimMat, -1, 14.75, -0.5);
placeMesh(new THREE.BoxGeometry(0.6, 0.12, 0.6), chimMat, -1, 15.55, -0.5);
placeMesh(new THREE.CylinderGeometry(0.08, 0.1, 0.3, 6), chimMat, -1, 15.8, -0.5);
placeMesh(new THREE.BoxGeometry(0.5, 1.8, 0.5), chimMat, 2, 14.9, -0.5);
placeMesh(new THREE.BoxGeometry(0.6, 0.12, 0.6), chimMat, 2, 15.85, -0.5);

var lampLights = [];

function createStreetlamp(x, z, intensity) {
var g = new THREE.Group();
var postMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });

g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 0.4, 8), postMat).translateY(0.2));
g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 4.5, 6), postMat).translateY(2.45));
g.add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.3), postMat).translateY(4.9));

var glassGeo = new THREE.BoxGeometry(0.22, 0.3, 0.22);
var glassMat = new THREE.MeshStandardMaterial({
color: 0x4a2005, roughness: 0.2, transparent: true, opacity: 0.7,
emissive: 0xe87818, emissiveIntensity: 0.6
});
g.add(new THREE.Mesh(glassGeo, glassMat).translateY(4.9));

var light = new THREE.PointLight(0xe87818, intensity || 0.8, 15);
light.position.set(0, 4.8, 0);
light.castShadow = true;
g.add(light);
lampLights.push(light);

var glowTex = makeCanvasTexture(64, 64, function(cx, w, h) {
var grad = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
grad.addColorStop(0, 'rgba(232, 120, 24, 0.8)');
grad.addColorStop(0.3, 'rgba(200, 90, 15, 0.3)');
grad.addColorStop(1, 'rgba(140, 50, 8, 0)');
cx.fillStyle = grad;
cx.fillRect(0, 0, w, h);
});
var glow = new THREE.Sprite(new THREE.SpriteMaterial({
map: glowTex, transparent: true, opacity: 0.6
}));
glow.position.set(0, 4.9, 0);
glow.scale.set(3.5, 3.5, 1);
g.add(glow);

g.position.set(x, 0, z);
scene.add(g);
return light;
}

var doorLamp = createStreetlamp(2.5, 2.5, 1.0);
createStreetlamp(-5, 2.5, 0.25);
createStreetlamp(10, 2.5, 0.15);

var bollardMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7, metalness: 0.3 });
placeMesh(new THREE.CylinderGeometry(0.08, 0.1, 0.7, 6), bollardMat, 1.8, 0.47, 2.2);
placeMesh(new THREE.SphereGeometry(0.1, 6, 4), bollardMat, 1.8, 0.85, 2.2);

var drainMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7, metalness: 0.4 });
placeMesh(new THREE.BoxGeometry(0.5, 0.02, 0.35), drainMat, -1.5, 0.01, 2.8);

var binMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.6, metalness: 0.3 });
var bin = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.75, 8), binMat);
bin.position.set(-3.8, 0.5, 1.2);
scene.add(bin);
var lid = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.03, 8), binMat);
lid.position.set(-3.8, 0.9, 1.2);
lid.rotation.z = 0.08;
scene.add(lid);

for (var i = 0; i < 3; i++) {
var stump = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.25, 6), ironMat);
stump.position.set(-1.5 + i * 0.3, 0.25, 0.5);
scene.add(stump);
}

var silhouettes = [];

function makeSilhouetteTex(seed) {
return makeCanvasTexture(256, 256, function(cx, w, h) {
var bg = cx.createRadialGradient(w/2, h*0.4, 10, w/2, h*0.5, w);
bg.addColorStop(0, 'rgba(200, 140, 50, 0.5)');
bg.addColorStop(0.5, 'rgba(160, 100, 30, 0.3)');
bg.addColorStop(1, 'rgba(80, 50, 15, 0.15)');
cx.fillStyle = bg;
cx.fillRect(0, 0, w, h);

cx.fillStyle = 'rgba(10, 5, 0, 0.85)';
var fx = w/2 + (seed - 0.5) * 30;
var baseY = h * 0.98;
cx.beginPath();
cx.moveTo(fx - 20, baseY - h*0.35);
cx.lineTo(fx + 20, baseY - h*0.35);
cx.lineTo(fx + 28, baseY);
cx.lineTo(fx - 28, baseY);
cx.closePath();
cx.fill();
cx.beginPath();
cx.ellipse(fx, baseY - h*0.38, 25, 12, 0, 0, Math.PI, true);
cx.fill();
cx.fillRect(fx - 5, baseY - h*0.48, 10, h*0.1);
cx.beginPath();
cx.arc(fx, baseY - h*0.52, 14, 0, Math.PI * 2);
cx.fill();
});
}

function addSilhouette(x, y, z, seed) {
var sTex = makeSilhouetteTex(seed);
var sMat = new THREE.MeshBasicMaterial({
map: sTex, transparent: true, side: THREE.DoubleSide, depthWrite: false
});
var sPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1.0), sMat);
sPlane.position.set(x, y, z);
scene.add(sPlane);
silhouettes.push({
mesh: sPlane,
baseX: x, baseY: y,
swayPhase: Math.random() * Math.PI * 2,
swaySpeed: 0.2 + Math.random() * 0.3,
swayAmt: 0.012 + Math.random() * 0.015
});
}

addSilhouette(-5.5, 8.2, 0.04, 0.6);

for (var i = 0; i < 10; i++) {
var puddleMat = new THREE.MeshStandardMaterial({
color: 0x111115, roughness: 0.08, metalness: 0.7, transparent: true, opacity: 0.3
});
var puddle = new THREE.Mesh(new THREE.CircleGeometry(0.25 + Math.random() * 0.7, 16), puddleMat);
puddle.rotation.x = -Math.PI / 2;
puddle.position.set(Math.random() * 10 - 4, 0.015, 2 + Math.random() * 5);
scene.add(puddle);
}

var doorPuddleMat = new THREE.MeshStandardMaterial({
color: 0x1a1208, roughness: 0.05, metalness: 0.8, transparent: true, opacity: 0.4,
emissive: 0xe87818, emissiveIntensity: 0.06
});
var doorPuddle = new THREE.Mesh(new THREE.CircleGeometry(1.0, 20), doorPuddleMat);
doorPuddle.rotation.x = -Math.PI / 2;
doorPuddle.position.set(1.5, 0.015, 3.5);
scene.add(doorPuddle);

scene.add(new THREE.AmbientLight(0x060610, 0.08));

var moonLight = new THREE.DirectionalLight(0x1a2255, 0.03);
moonLight.position.set(5, 18, -3);
moonLight.castShadow = true;
scene.add(moonLight);

var fanlightGlow = new THREE.PointLight(0xc08030, 0.15, 4);
fanlightGlow.position.set(0, 3.2, 0.5);
scene.add(fanlightGlow);

var doorSpot = new THREE.SpotLight(0xe8a040, 1.2, 10, Math.PI / 5, 0.6);
doorSpot.position.set(2.5, 5.5, 3.5);
doorSpot.target.position.set(0, 1.8, 0.1);
doorSpot.castShadow = true;
scene.add(doorSpot);
scene.add(doorSpot.target);

var doorFill = new THREE.PointLight(0xd09040, 0.15, 5);
doorFill.position.set(-2, 3.5, 2.5);
scene.add(doorFill);

var brassHighlight = new THREE.PointLight(0xffe0a0, 0.25, 2.5);
brassHighlight.position.set(0.2, 1.6, 1.0);
scene.add(brassHighlight);

var thickFogTex = makeCanvasTexture(128, 128, function(cx, w, h) {
var grad = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
grad.addColorStop(0, 'rgba(140, 135, 125, 0.32)');
grad.addColorStop(0.4, 'rgba(110, 105, 95, 0.15)');
grad.addColorStop(1, 'rgba(80, 75, 65, 0)');
cx.fillStyle = grad;
cx.fillRect(0, 0, w, h);
});
var thinFogTex = makeCanvasTexture(128, 128, function(cx, w, h) {
var grad = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
grad.addColorStop(0, 'rgba(100, 95, 85, 0.18)');
grad.addColorStop(0.6, 'rgba(80, 75, 65, 0.08)');
grad.addColorStop(1, 'rgba(60, 55, 45, 0)');
cx.fillStyle = grad;
cx.fillRect(0, 0, w, h);
});
var gingerFogTex = makeCanvasTexture(128, 128, function(cx, w, h) {
var grad = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
grad.addColorStop(0, 'rgba(232, 120, 24, 0.3)');
grad.addColorStop(0.3, 'rgba(210, 95, 18, 0.15)');
grad.addColorStop(0.6, 'rgba(180, 70, 12, 0.06)');
grad.addColorStop(1, 'rgba(140, 50, 8, 0)');
cx.fillStyle = grad;
cx.fillRect(0, 0, w, h);
});

var fogSprites = [];

for (var i = 0; i < 60; i++) {
var fogMat = new THREE.SpriteMaterial({
map: thickFogTex, transparent: true,
opacity: 0.3 + Math.random() * 0.25
});
var fog = new THREE.Sprite(fogMat);
fog.position.set(Math.random() * 40 - 15, 0.1 + Math.random() * 1.8, Math.random() * 30 - 5);
var s = 5 + Math.random() * 12;
fog.scale.set(s, s * 0.3, 1);
scene.add(fog);
fogSprites.push({
sprite: fog, baseX: fog.position.x,
drift: 0.001 + Math.random() * 0.002,
sway: Math.random() * Math.PI * 2,
swaySpeed: 0.0005 + Math.random() * 0.002,
swayAmt: 0.2 + Math.random() * 0.4
});
}

for (var i = 0; i < 15; i++) {
var mfMat = new THREE.SpriteMaterial({
map: thinFogTex, transparent: true,
opacity: 0.06 + Math.random() * 0.06
});
var mf = new THREE.Sprite(mfMat);
mf.position.set(Math.random() * 30 - 10, 2 + Math.random() * 4, 3 + Math.random() * 20);
var ms = 5 + Math.random() * 12;
mf.scale.set(ms, ms * 0.3, 1);
scene.add(mf);
fogSprites.push({
sprite: mf, baseX: mf.position.x,
drift: 0.0015 + Math.random() * 0.003,
sway: Math.random() * Math.PI * 2,
swaySpeed: 0.001 + Math.random() * 0.0025,
swayAmt: 0.25 + Math.random() * 0.6
});
}

for (var i = 0; i < 25; i++) {
var gfMat = new THREE.SpriteMaterial({
map: gingerFogTex, transparent: true,
opacity: 0.2 + Math.random() * 0.2
});
var gf = new THREE.Sprite(gfMat);
gf.position.set(2.5 + (Math.random() - 0.5) * 10, 0.3 + Math.random() * 5, 2.5 + (Math.random() - 0.5) * 8);
var gs = 2 + Math.random() * 6;
gf.scale.set(gs, gs * 0.45, 1);
scene.add(gf);
fogSprites.push({
sprite: gf, baseX: gf.position.x,
drift: 0.001 + Math.random() * 0.002,
sway: Math.random() * Math.PI * 2,
swaySpeed: 0.001 + Math.random() * 0.002,
swayAmt: 0.15 + Math.random() * 0.25
});
}

for (var i = 0; i < 10; i++) {
var wMat = new THREE.SpriteMaterial({
map: thinFogTex, transparent: true,
opacity: 0.04 + Math.random() * 0.05
});
var w = new THREE.Sprite(wMat);
w.position.set(Math.random() * 30 - 10, 8 + Math.random() * 7, 4 + Math.random() * 15);
w.scale.set(7 + Math.random() * 12, 2 + Math.random() * 3, 1);
scene.add(w);
fogSprites.push({
sprite: w, baseX: w.position.x,
drift: 0.002 + Math.random() * 0.004,
sway: Math.random() * Math.PI * 2,
swaySpeed: 0.0015 + Math.random() * 0.003,
swayAmt: 0.3 + Math.random() * 0.75
});
}

var clock = new THREE.Clock();

function loAnimate() {
loAnimId = requestAnimationFrame(loAnimate);
var t = loStill ? 7 : clock.getElapsedTime();

for (var i = 0; i < lampLights.length; i++) {
var baseInt = (i === 0) ? 1.2 : (i === 1) ? 0.5 : 0.3;
var breath = 0.97 + Math.sin(t * 0.4) * 0.03;
lampLights[i].intensity = baseInt * breath;
}

fanlightGlow.intensity = 0.25 + Math.sin(t * 0.12) * 0.02;

var doorBreath = 0.95 + Math.sin(t * 0.25) * 0.03;
doorSpot.intensity = 1.5 * doorBreath;
doorFill.intensity = 0.4 * doorBreath;
brassHighlight.intensity = 0.3 * doorBreath;

brassMat.emissive = brassMat.emissive || new THREE.Color(0x4a3008);
brassMat.emissiveIntensity = 0.05 * doorBreath;

signLight.intensity = 0.25 + Math.sin(t * 0.2) * 0.02;

for (var i = 0; i < silhouettes.length; i++) {
var s = silhouettes[i];
s.swayPhase += loStill ? 0 : s.swaySpeed * 0.016;
s.mesh.position.x = s.baseX + Math.sin(s.swayPhase) * s.swayAmt * 0.5;
s.mesh.position.y = s.baseY + Math.sin(s.swayPhase * 0.7) * 0.002;
}

var wFlicker = Math.sin(t * 0.4) * 0.3 + Math.sin(t * 1.1) * 0.2 + Math.sin(t * 0.17) * 0.5;
wFlicker = Math.max(0, wFlicker);
curtainMatR.emissiveIntensity = 0.1 + wFlicker * 0.35;
workingGlow.intensity = 0.08 + wFlicker * 0.4;

var wFlickerGFL = Math.sin(t * 0.28) * 0.4 + Math.sin(t * 0.75) * 0.2 + Math.sin(t * 0.13) * 0.4;
wFlickerGFL = Math.max(0, wFlickerGFL);
curtainMatL.emissiveIntensity = 0.1 + wFlickerGFL * 0.35;
workingGlowGFL.intensity = 0.08 + wFlickerGFL * 0.4;

var wFlicker1F = Math.sin(t * 0.35) * 0.35 + Math.sin(t * 0.9) * 0.25 + Math.sin(t * 0.22) * 0.4;
wFlicker1F = Math.max(0, wFlicker1F);
workingGlass1F.emissiveIntensity = 0.15 + wFlicker1F * 0.35;
workingGlow1F.intensity = 0.1 + wFlicker1F * 0.5;
loRedRefl.material.opacity = 0.11 + wFlicker1F * 0.05 + Math.sin(t * 1.7) * 0.008;

// Lackland at the window: breath + the page turn
var loDt = Math.min(t - loLastT, 0.1); loLastT = t;
loFigure.scale.y = 1 + Math.sin(t * 0.7) * 0.006;
loFigure.position.y = 5.42 + Math.sin(t * 0.7) * 0.004;
loPageState.next -= loDt;
if (loPageState.next <= 0 && loPageState.t < 0) {
loPageState.t = 0;
loPageState.next = 16 + Math.random() * 10;
}
if (loPageState.t >= 0) {
loPageState.t += loDt;
var pp = loPageState.t / 0.8;
if (pp < 1) {
loPage.position.y = 5.16 + Math.sin(pp * Math.PI) * 0.05;
loPage.rotation.z = Math.sin(pp * Math.PI) * 0.6;
loPage.scale.x = Math.abs(Math.cos(pp * Math.PI));
} else {
loPageState.t = -1;
loPage.position.y = 5.16;
loPage.rotation.z = 0;
loPage.scale.x = 1;
}
}

doorPuddleMat.emissiveIntensity = 0.04 + Math.sin(t * 1.7) * 0.02;

loGrainFrame++;
if (loGrainFrame % 3 === 0 && !(loStill && loGrainFrame > 6)) {
var imgData = loGrainCtx.createImageData(256, 256);
var d = imgData.data;
for (var i = 0; i < d.length; i += 4) {
var v = Math.random() * 255;
d[i] = d[i+1] = d[i+2] = v;
d[i+3] = 255;
}
loGrainCtx.putImageData(imgData, 0, 0);
}

if (typeof dssComposerLocal !== 'undefined' && dssComposerLocal) { dssComposerLocal.render(); } else { renderer.render(scene, camera); }
}

loAnimate();

loVig = document.createElement('div');
loVig.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9001;pointer-events:none;background:radial-gradient(ellipse at 45% 45%, transparent 30%, rgba(0,0,0,0.6) 100%);';
loWrap.appendChild(loVig);

loGrain = document.createElement('canvas');
loGrain.width = 256;
loGrain.height = 256;
loGrainCtx = loGrain.getContext('2d');
var grainImg = new Image();
grainImg.src = loGrain.toDataURL();
var grainDiv = document.createElement('div');
grainDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9002;pointer-events:none;background-image:url(' + loGrain.toDataURL() + ');background-size:256px 256px;opacity:0.02;mix-blend-mode:overlay;';
loWrap.appendChild(grainDiv);

loWash = document.createElement('div');
loWash.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9002;pointer-events:none;background:linear-gradient(180deg, rgba(10,8,25,0.3) 0%, rgba(5,5,15,0.08) 30%, rgba(5,5,15,0.08) 60%, rgba(5,3,2,0.4) 100%);';
loWrap.appendChild(loWash);

loLoc = document.createElement('div');
loLoc.textContent = "LACKLAND’S OFFICE, FRITH STREET, SOHO";
loLoc.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);font:12px \"Courier New\",monospace;color:rgba(200,180,140,0.25);letter-spacing:min(2px, 0.5vw);white-space:nowrap;font-size:min(12px, 2.8vw);max-width:calc(100vw - 20px);pointer-events:none;z-index:9003;';
loWrap.appendChild(loLoc);

loBtn = document.createElement('div');
loBtn.textContent = 'ENTER LACKLAND’S OFFICE';
// Ginger-Light style: transparent dark background, coloured text +
// border, no infill. Hover brightens text and border.
loBtn.style.cssText = [
  'position:fixed', 'bottom:60px', 'left:50%', 'transform:translateX(-50%)',
  'font:13px "Courier New",monospace',
  'color:rgba(232,180,80,0.85)',
  'letter-spacing:4px', 'cursor:pointer', 'padding:12px 28px',
  'border:1px solid rgba(232,180,80,0.3)',
  'background:rgba(0,0,0,0.4)',
  'z-index:9004', 'white-space:nowrap',
  'opacity:0', 'transition:opacity 1.5s ease, color 0.3s ease, border-color 0.3s ease'
].join(';');
setTimeout(function() { loBtn.style.opacity = '1'; }, 1800);
loBtn.addEventListener('mouseenter', function() {
  this.style.color = 'rgba(255,210,120,0.95)';
  this.style.borderColor = 'rgba(232,180,80,0.6)';
});
loBtn.addEventListener('mouseleave', function() {
  this.style.color = 'rgba(232,180,80,0.85)';
  this.style.borderColor = 'rgba(232,180,80,0.3)';
});
loBtn.addEventListener('click', function() {
loWrap.style.transition = 'opacity 1.5s ease';
loWrap.style.opacity = '0';
setTimeout(function() {
if (loAnimId) { cancelAnimationFrame(loAnimId); loAnimId = null; }
if (loWrap.parentNode) loWrap.parentNode.removeChild(loWrap);
var TARGET = 'Martin Lackland\'s Office';
if (window.Engine && Engine.go) { Engine.go(TARGET); }
else {
var links = document.querySelectorAll('tw-link, .enchantment-link');
for (var i = 0; i < links.length; i++) {
if (links[i].textContent.trim() === '·') { links[i].click(); break; }
}
}
}, 1500);
});
loWrap.appendChild(loBtn);

document.body.appendChild(loWrap);
}

setInterval(function() {
var container = document.getElementById('lo-container');
if (container && !loActive) {
initLackland();
} else if (!container) {
loActive = false;
if (loAnimId) { cancelAnimationFrame(loAnimId); loAnimId = null; }
window._dssDisposeWrap('lo-wrap');
}
}, 300);
})();
// ====== CECIL COURT APPROACH — IFRAME FULLSCREEN ======
(function() {
var ccActive = false;
var ccWrap = null;
function initCecilCourt() {
if (ccActive) return;
ccActive = true;
ccWrap = document.createElement('div');
ccWrap.id = 'cc-wrap';
ccWrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9000;background:#040408;overflow:hidden;';
var ccFrame = document.createElement('iframe');
ccFrame.src = 'cecil-court-3d-static.html?v=20261014b'; // 2026-10-14: version bumped for the lighter lighting
ccFrame.title = 'Cecil Court at night';
ccFrame.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;';
ccWrap.appendChild(ccFrame);
var ccVig = document.createElement('div');
ccVig.style.cssText = 'position:fixed;inset:0;z-index:9001;pointer-events:none;background:linear-gradient(180deg,rgba(10,8,25,.12),transparent 35%,transparent 65%,rgba(5,3,2,.3));';
ccWrap.appendChild(ccVig);
var ccBtn = document.createElement('button');
ccBtn.type = 'button';
ccBtn.textContent = 'ENTER CECIL COURT';
ccBtn.style.cssText = [
  'position:fixed','bottom:max(60px,env(safe-area-inset-bottom))','left:50%','transform:translateX(-50%)',
  'max-width:calc(100% - 32px)','box-sizing:border-box',
  'font:13px "Courier New",monospace','color:rgba(232,120,24,0.85)',
  'letter-spacing:4px','cursor:pointer','padding:12px 28px',
  'border:1px solid rgba(232,120,24,0.3)','background:rgba(0,0,0,0.4)',
  'z-index:9004','white-space:nowrap','opacity:0','transition:opacity 1.5s ease'
].join(';');
setTimeout(function() { ccBtn.style.opacity = '1'; }, 1500);
ccBtn.addEventListener('mouseenter', function() {
  this.style.color = 'rgba(255,160,50,0.95)';
  this.style.borderColor = 'rgba(232,120,24,0.6)';
});
ccBtn.addEventListener('mouseleave', function() {
  this.style.color = 'rgba(232,120,24,0.85)';
  this.style.borderColor = 'rgba(232,120,24,0.3)';
});
ccBtn.addEventListener('click', function() {
if (ccBtn.disabled) return;
ccBtn.disabled = true;
var leavingWrap = ccWrap;
var exitDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1500;
ccWrap.style.transition = 'opacity 1.5s ease';
ccWrap.style.opacity = '0';
setTimeout(function() {
if (ccWrap !== leavingWrap || !document.getElementById('cc-approach')) return;
if (leavingWrap.parentNode) leavingWrap.parentNode.removeChild(leavingWrap);
var TARGET = 'Cecil Court';
if (window.Engine && Engine.go) { Engine.go(TARGET); }
else {
var links = document.querySelectorAll('tw-link, .enchantment-link');
for (var i = 0; i < links.length; i++) {
if (links[i].textContent.trim() === '\u00b7') { links[i].click(); break; }
}
}
}, exitDelay);
});
ccWrap.appendChild(ccBtn);
document.body.appendChild(ccWrap);
}
setInterval(function() {
var container = document.getElementById('cc-approach');
if (container && !ccActive) {
initCecilCourt();
} else if (!container) {
ccActive = false;
var wrap = document.getElementById('cc-wrap');
if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
}
}, 300);
})();
