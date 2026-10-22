// ====== O'FLATTERLY'S BOOKSHOP SCENE — INLINE ======
// Marchpane (16 Cecil Court) is the reference: racing-green front on pale
// stucco, gold letterspaced fascia, scalloped awning over the window only,
// glazed door LEFT blazing amber, packed book window, bench of stock, the
// studded coal plates in the pavement. Night; the shop is the court's light.
// Living element: the dealer behind the door glass, turning a page.
(function() {
var ofActive = false;
var ofAnimId = null;

function initOflatterly() {
if (ofActive) return;
ofActive = true;
if (typeof THREE === 'undefined') {
var sc = document.createElement('script');
sc.src = 'vendor/three/three.min.js';
sc.onload = function() { (window.dssLoadPost ? window.dssLoadPost(buildOFScene) : buildOFScene()); };
document.head.appendChild(sc);
} else {
(window.dssLoadPost ? window.dssLoadPost(buildOFScene) : buildOFScene());
}
}

function buildOFScene() {
// Reduced-motion: hold one settled frame (lamps steady, sign still, haze and motes parked).
var ofStill = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var ofWrap = document.createElement('div');
ofWrap.id = 'of-wrap';
ofWrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9000;background:#06070b;';

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x06070b);
scene.fog = new THREE.FogExp2(0x07080c, 0.05);

var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0.1, 1.7, 5.6);
camera.lookAt(0, 1.9, 0);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.88;
ofWrap.appendChild(renderer.domElement);
window._dssBindScene('of-wrap', scene, renderer, camera);
var dssComposerLocal = window.dssMakeComposer ? window.dssMakeComposer(scene, camera, renderer, { bokeh: true, focus: 5, aperture: 0.0005, maxblur: 0.005, bloomStrength: 0.5, bloomThreshold: 0.35 }) : null;
if (window.dssFilmGrade) window.dssFilmGrade(document.getElementById('of-wrap'));

function placeMesh(geo, mat, x, y, z) {
var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); scene.add(m); return m;
}
function makeCanvasTexture(w, h, drawFunc) {
var c = document.createElement('canvas');
c.width = w; c.height = h;
var cx = c.getContext('2d');
drawFunc(cx, w, h);
var tex = new THREE.CanvasTexture(c);
tex.minFilter = THREE.LinearFilter;
return tex;
}

// Court cobbles — worn setts, dark joints, a century of grot
var flagTex = makeCanvasTexture(512, 512, function(cx, w, h) {
cx.fillStyle = '#3d3831'; cx.fillRect(0, 0, w, h);
var cw = 46, chh = 34;
for (var row = 0; row < h / chh + 1; row++) {
var off = (row % 2) * (cw / 2);
for (var col = -1; col < w / cw + 1; col++) {
var cxp = col * cw + off, cyp = row * chh;
var tone = 58 + Math.floor(Math.random() * 26);
var g = cx.createRadialGradient(cxp + cw/2 - 4, cyp + chh/2 - 4, 2, cxp + cw/2, cyp + chh/2, cw * 0.62);
g.addColorStop(0, 'rgb(' + (tone + 18) + ',' + (tone + 12) + ',' + (tone + 2) + ')');
g.addColorStop(0.75, 'rgb(' + tone + ',' + (tone - 6) + ',' + (tone - 14) + ')');
g.addColorStop(1, 'rgb(' + (tone - 34) + ',' + (tone - 38) + ',' + (tone - 44) + ')');
cx.fillStyle = g;
cx.beginPath();
cx.rect(cxp + 2, cyp + 2, cw - 4, chh - 4);
cx.fill();
cx.strokeStyle = 'rgba(20,18,14,0.6)'; cx.lineWidth = 2; cx.strokeRect(cxp + 2, cyp + 2, cw - 4, chh - 4);
}
}
for (var st = 0; st < 40; st++) {
cx.fillStyle = 'rgba(24,22,18,' + (0.12 + Math.random() * 0.24).toFixed(2) + ')';
cx.beginPath(); cx.ellipse(Math.random() * w, Math.random() * h, 16 + Math.random() * 50, 10 + Math.random() * 30, Math.random() * 3, 0, Math.PI * 2); cx.fill();
}
for (var gm = 0; gm < 120; gm++) {
cx.fillStyle = 'rgba(18,16,12,' + (0.2 + Math.random() * 0.3).toFixed(2) + ')';
cx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 4, 1 + Math.random() * 3);
}
});
flagTex.wrapS = flagTex.wrapT = THREE.RepeatWrapping; flagTex.repeat.set(10, 6.5);
var ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 18), new THREE.MeshStandardMaterial({ map: flagTex, roughness: 0.85 }));
ground.rotation.x = -Math.PI / 2; ground.position.set(0, 0, 3); scene.add(ground);
// The studded coal plates
var coalTex = makeCanvasTexture(512, 96, function(cx, w, h) {
cx.fillStyle = '#3a3834'; cx.fillRect(0, 0, w, h);
for (var px = 14; px < w; px += 26) { for (var py = 14; py < h; py += 26) {
cx.fillStyle = 'rgba(90,86,78,0.9)'; cx.beginPath(); cx.arc(px, py, 5, 0, Math.PI * 2); cx.fill();
cx.fillStyle = 'rgba(20,18,16,0.8)'; cx.beginPath(); cx.arc(px + 1.5, py + 1.5, 2.4, 0, Math.PI * 2); cx.fill();
} }
});
placeMesh(new THREE.BoxGeometry(4.9, 0.015, 0.55), new THREE.MeshStandardMaterial({ map: coalTex, roughness: 0.6, metalness: 0.4 }), 0, 0.01, 3.6);

// Materials
var hasKit = !!(window.dssScene && window.dssScene.makeWeatheredStucco);
var stuccoMat = hasKit ? new THREE.MeshStandardMaterial({ map: null, roughness: 0.9 }) : new THREE.MeshStandardMaterial({ color: 0xbfb6a4, roughness: 0.9 });
if (hasKit) { stuccoMat = window.dssScene.makeWeatheredStucco({ baseColor: 0xc4bba8, repeat: [1.6, 2.2] }); }
var greenMat = new THREE.MeshStandardMaterial({ color: 0x18291f, roughness: 0.72 });
var greenDark = new THREE.MeshStandardMaterial({ color: 0x122419, roughness: 0.6 });
var brassMat = new THREE.MeshStandardMaterial({ color: 0x8a6c22, roughness: 0.48, metalness: 0.75 });
var woodDark = new THREE.MeshStandardMaterial({ color: 0x2c1d10, roughness: 0.8 });

// Upper facade — pale stucco with two dark sashes
var brickUp = (window.dssScene && window.dssScene.makeGrimyBrick) ? window.dssScene.makeGrimyBrick({ baseColor: 0x6b4a38, repeat: [2.6, 1.7], sootStreaks: 9, dampPatches: 6 }) : new THREE.MeshStandardMaterial({ color: 0x5c4034, roughness: 0.92 });
placeMesh(new THREE.BoxGeometry(5.6, 3.7, 0.3), brickUp, 0, 5.35, -0.06);
for (var uw = 0; uw < 2; uw++) {
var ux = uw === 0 ? -1.15 : 1.25;
placeMesh(new THREE.BoxGeometry(0.8, 1.25, 0.06), greenDark, ux, 5.15, 0.1);
var uwGlass = (window.dssScene && window.dssScene.makeDressedWindow) ? window.dssScene.makeDressedWindow(false, uw, uw + 1) : new THREE.MeshStandardMaterial({ color: 0x141a22, roughness: 0.3 });
placeMesh(new THREE.PlaneGeometry(0.66, 1.1), uwGlass, ux, 5.15, 0.14);
placeMesh(new THREE.BoxGeometry(0.03, 1.1, 0.02), greenDark, ux, 5.15, 0.15);
placeMesh(new THREE.BoxGeometry(0.66, 0.03, 0.02), greenDark, ux, 5.15, 0.15);
placeMesh(new THREE.BoxGeometry(0.9, 0.06, 0.12), stuccoMat, ux, 4.5, 0.12);
}
var stuccoGrimeTex = makeCanvasTexture(512, 256, function(cx, w, h) {
cx.clearRect(0, 0, w, h);
for (var sg = 0; sg < 26; sg++) {
cx.fillStyle = 'rgba(40,36,28,' + (0.06 + Math.random() * 0.14).toFixed(2) + ')';
var sgx = Math.random() * w;
cx.fillRect(sgx, Math.random() * h * 0.4, 3 + Math.random() * 9, 40 + Math.random() * 140);
}
for (var dp = 0; dp < 8; dp++) {
var dg = cx.createRadialGradient(Math.random() * w, h * 0.5 + Math.random() * h * 0.5, 0, Math.random() * w, h * 0.6, 40 + Math.random() * 60);
dg.addColorStop(0, 'rgba(46,42,30,0.28)'); dg.addColorStop(1, 'rgba(46,42,30,0)');
cx.fillStyle = dg; cx.fillRect(0, 0, w, h);
}
var tg = cx.createLinearGradient(0, 0, 0, 60);
tg.addColorStop(0, 'rgba(20,18,12,0.5)'); tg.addColorStop(1, 'rgba(20,18,12,0)');
cx.fillStyle = tg; cx.fillRect(0, 0, w, 60);
});
placeMesh(new THREE.PlaneGeometry(5.5, 3.6), new THREE.MeshBasicMaterial({ map: stuccoGrimeTex, transparent: true, opacity: 0.75, depthWrite: false }), 0, 5.35, 0.1);
placeMesh(new THREE.PlaneGeometry(4.7, 0.4), new THREE.MeshBasicMaterial({ map: stuccoGrimeTex, transparent: true, opacity: 0.5, depthWrite: false }), 0, 0.2, 0.19);
// Side masses closing the court at frame edges
var sideMat = new THREE.MeshStandardMaterial({ color: 0x6e675c, roughness: 0.92 });
placeMesh(new THREE.BoxGeometry(2.4, 8, 7), sideMat, -4.9, 4, 1.2);
placeMesh(new THREE.BoxGeometry(2.4, 8, 7), sideMat, 4.9, 4, 1.2);
placeMesh(new THREE.PlaneGeometry(0.7, 1.0), new THREE.MeshBasicMaterial({ color: 0x2a3444, transparent: true, opacity: 0.5 }), -3.66, 4.6, 2.2).rotation.y = Math.PI / 2;
placeMesh(new THREE.PlaneGeometry(0.7, 1.0), new THREE.MeshBasicMaterial({ color: 0x40342a, transparent: true, opacity: 0.4 }), 3.66, 3.8, 1.6).rotation.y = -Math.PI / 2;

// Fascia — I. O'FLATTERLY, dealer in books; No 23 both ends
var fasciaTex = makeCanvasTexture(1024, 200, function(cx, w, h) {
cx.fillStyle = '#152a1e'; cx.fillRect(0, 0, w, h);
var grad = cx.createLinearGradient(0, 0, 0, h);
grad.addColorStop(0, 'rgba(0,0,0,0.25)'); grad.addColorStop(0.5, 'rgba(255,255,255,0.04)'); grad.addColorStop(1, 'rgba(0,0,0,0.3)');
cx.fillStyle = grad; cx.fillRect(0, 0, w, h);
cx.strokeStyle = 'rgba(196,164,72,0.5)'; cx.lineWidth = 2;
cx.beginPath(); cx.moveTo(18, 14); cx.lineTo(w - 18, 14); cx.stroke();
cx.beginPath(); cx.moveTo(18, h - 14); cx.lineTo(w - 18, h - 14); cx.stroke();
cx.fillStyle = '#d2b258';
cx.font = '600 64px Georgia, serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
var name = "I. O'FLATTERLY";
var spread = 44, startX = w / 2 - (name.length - 1) * spread / 2;
for (var ch = 0; ch < name.length; ch++) {
if (name[ch] === "'") {
cx.save();
cx.translate(startX + ch * spread, 30);
cx.rotate(Math.PI);
cx.fillText("'", 0, 0);
cx.restore();
} else { cx.fillText(name[ch], startX + ch * spread, 70); }
}
cx.font = 'small-caps 500 26px Georgia, serif';
cx.fillStyle = 'rgba(210,178,88,0.85)';
var sub = 'DEALER IN BOOKS', sSpread = 17, sStart = w / 2 - (sub.length - 1) * sSpread / 2;
for (var ch2 = 0; ch2 < sub.length; ch2++) { cx.fillText(sub[ch2], sStart + ch2 * sSpread, 130); }
cx.font = '500 32px Georgia, serif';
cx.fillText('92-94', 74, 92); cx.fillText('92-94', w - 74, 92);
cx.fillStyle = 'rgba(10,18,12,0.28)';
for (var wk = 0; wk < 14; wk++) { cx.fillRect(Math.random() * w, 0, 2 + Math.random() * 6, h); }
for (var bl = 0; bl < 10; bl++) {
var blg = cx.createRadialGradient(Math.random() * w, Math.random() * h, 0, Math.random() * w, Math.random() * h, 30 + Math.random() * 50);
blg.addColorStop(0, 'rgba(6,10,7,0.3)'); blg.addColorStop(1, 'rgba(6,10,7,0)');
cx.fillStyle = blg; cx.fillRect(0, 0, w, h);
}
for (var dr = 0; dr < 7; dr++) {
var drx = Math.random() * w;
cx.fillStyle = 'rgba(8,14,9,0.35)';
cx.fillRect(drx, 8 + Math.random() * 30, 2, 30 + Math.random() * 90);
}
var botG = cx.createLinearGradient(0, h - 50, 0, h);
botG.addColorStop(0, 'rgba(5,8,6,0)'); botG.addColorStop(1, 'rgba(5,8,6,0.55)');
cx.fillStyle = botG; cx.fillRect(0, h - 50, w, 50);
});
placeMesh(new THREE.BoxGeometry(4.7, 0.72, 0.1), new THREE.MeshStandardMaterial({ map: fasciaTex, roughness: 0.5 }), 0, 3.12, 0.14);
placeMesh(new THREE.BoxGeometry(4.95, 0.1, 0.26), greenDark, 0, 3.54, 0.12);
placeMesh(new THREE.BoxGeometry(4.8, 0.035, 0.2), brassMat, 0, 3.5, 0.13);
placeMesh(new THREE.BoxGeometry(4.75, 0.05, 0.16), greenDark, 0, 2.73, 0.15);

// Bay infill — the wall strips between door, window, and pilasters
placeMesh(new THREE.BoxGeometry(0.52, 3.06, 0.12), greenMat, -0.93, 1.5, 0.05);
placeMesh(new THREE.BoxGeometry(0.34, 3.06, 0.12), greenMat, -2.21, 1.5, 0.05);
placeMesh(new THREE.BoxGeometry(0.36, 3.06, 0.12), greenMat, 2.2, 1.5, 0.05);
placeMesh(new THREE.BoxGeometry(0.4, 1.9, 0.03), greenDark, -0.93, 1.6, 0.13);

// Pilasters
for (var pl = 0; pl < 2; pl++) {
var plx = pl === 0 ? -2.32 : 2.32;
placeMesh(new THREE.BoxGeometry(0.36, 3.1, 0.2), greenMat, plx, 1.55, 0.12);
placeMesh(new THREE.BoxGeometry(0.26, 2.1, 0.03), greenDark, plx, 1.7, 0.23);
placeMesh(new THREE.BoxGeometry(0.42, 0.12, 0.24), greenDark, plx, 0.06, 0.13);
placeMesh(new THREE.BoxGeometry(0.4, 0.08, 0.22), greenDark, plx, 3.02, 0.14);
}

// Whole-front filth: mottling, run-off, chipped paint
var frontGrimeTex = makeCanvasTexture(512, 384, function(cx, w, h) {
cx.clearRect(0, 0, w, h);
for (var mg = 0; mg < 26; mg++) {
var mgg = cx.createRadialGradient(Math.random() * w, Math.random() * h, 0, Math.random() * w, Math.random() * h, 26 + Math.random() * 70);
mgg.addColorStop(0, 'rgba(10,14,10,' + (0.14 + Math.random() * 0.22).toFixed(2) + ')');
mgg.addColorStop(1, 'rgba(10,14,10,0)');
cx.fillStyle = mgg; cx.fillRect(0, 0, w, h);
}
for (var rs = 0; rs < 22; rs++) {
cx.fillStyle = 'rgba(8,12,9,' + (0.12 + Math.random() * 0.22).toFixed(2) + ')';
cx.fillRect(Math.random() * w, Math.random() * h * 0.5, 1.5 + Math.random() * 4, 30 + Math.random() * 120);
}
for (var chp = 0; chp < 18; chp++) {
cx.fillStyle = 'rgba(122,132,110,' + (0.1 + Math.random() * 0.16).toFixed(2) + ')';
cx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 6, 2 + Math.random() * 9);
}
var bg2 = cx.createLinearGradient(0, h - 70, 0, h);
bg2.addColorStop(0, 'rgba(14,14,10,0)'); bg2.addColorStop(1, 'rgba(14,14,10,0.6)');
cx.fillStyle = bg2; cx.fillRect(0, h - 70, w, 70);
});
placeMesh(new THREE.PlaneGeometry(4.72, 3.1), new THREE.MeshBasicMaterial({ map: frontGrimeTex, transparent: true, opacity: 0.55, depthWrite: false }), 0, 1.55, 0.21);

// ---- THE WINDOW (right of door): packed with warm stock ----
var displayTex = makeCanvasTexture(1024, 768, function(cx, w, h) {
var bg = cx.createRadialGradient(w * 0.5, h * 0.45, 60, w * 0.5, h * 0.5, w * 0.62);
bg.addColorStop(0, '#c25f14'); bg.addColorStop(0.45, '#8a3d0c'); bg.addColorStop(1, '#3d1d06');
cx.fillStyle = bg; cx.fillRect(0, 0, w, h);
var shelfY = [180, 350, 520, 690];
for (var sh = 0; sh < shelfY.length; sh++) {
var sy = shelfY[sh];
cx.fillStyle = 'rgba(40,20,8,0.85)'; cx.fillRect(30, sy, w - 60, 12);
var bx = 40;
while (bx < w - 60) {
var bw = 13 + Math.random() * 24, bh = 88 + Math.random() * 56;
var palette = ['#96491a', '#6e2a0e', '#54431c', '#25422a', '#5e1c1c', '#84592e', '#38335a', '#9a7038', '#4a3a28', '#70614a'];
var col2 = palette[Math.floor(Math.random() * palette.length)];
var lean = (Math.random() < 0.22) ? (Math.random() - 0.5) * 0.12 : 0;
cx.save();
cx.translate(bx + bw / 2, sy);
cx.rotate(lean);
cx.fillStyle = col2; cx.fillRect(-bw/2, -bh, bw, bh);
var bg3 = cx.createLinearGradient(-bw/2, 0, bw/2, 0);
bg3.addColorStop(0, 'rgba(0,0,0,0.45)');
bg3.addColorStop(0.18, 'rgba(0,0,0,0)');
bg3.addColorStop(0.85, 'rgba(255,240,200,0.12)');
bg3.addColorStop(1, 'rgba(0,0,0,0.3)');
cx.fillStyle = bg3; cx.fillRect(-bw/2, -bh, bw, bh);
var tg2 = cx.createLinearGradient(0, -bh, 0, 0);
tg2.addColorStop(0, 'rgba(255,235,190,0.14)'); tg2.addColorStop(0.15, 'rgba(0,0,0,0)'); tg2.addColorStop(1, 'rgba(0,0,0,0.32)');
cx.fillStyle = tg2; cx.fillRect(-bw/2, -bh, bw, bh);
cx.fillStyle = 'rgba(225,196,128,' + (0.3 + Math.random() * 0.35).toFixed(2) + ')';
cx.fillRect(-bw * 0.24, -bh + 7 + Math.random() * 6, bw * 0.48, 2.5);
cx.fillRect(-bw * 0.24, -bh + 16 + Math.random() * 4, bw * 0.48, 1.5);
if (Math.random() < 0.5) cx.fillRect(-bw * 0.24, -bh * 0.42, bw * 0.48, 2);
if (Math.random() < 0.35) { cx.fillStyle = 'rgba(20,10,4,0.35)'; cx.fillRect(-bw/2, -bh * (0.2 + Math.random() * 0.5), bw, 2); }
cx.restore();
bx += bw + 1 + Math.floor(Math.random() * 4);
if (Math.random() < 0.12 && bx < w - 130) {
for (var ly = 0; ly < 3; ly++) {
var lw = 58 + Math.random() * 26, lh = 11 + Math.random() * 5;
cx.fillStyle = palette[Math.floor(Math.random() * palette.length)];
cx.fillRect(bx, sy - (ly + 1) * lh - 2, lw, lh);
cx.fillStyle = 'rgba(240,220,170,0.4)';
cx.fillRect(bx + lw - 7, sy - (ly + 1) * lh - 1, 5, lh - 2);
}
bx += 92;
}
}
}
var prSpots = [[130, 170], [640, 200], [360, 430]];
for (var pr = 0; pr < 3; pr++) {
var px2 = prSpots[pr][0], py2 = prSpots[pr][1];
var pw2 = 100 + pr * 18, ph2 = 120 + (pr % 2) * 26;
cx.fillStyle = 'rgba(204,182,134,0.9)'; cx.fillRect(px2, py2, pw2, ph2);
cx.strokeStyle = 'rgba(60,30,10,0.8)'; cx.lineWidth = 5; cx.strokeRect(px2, py2, pw2, ph2);
cx.fillStyle = 'rgba(120,70,30,0.55)';
cx.fillRect(px2 + 12, py2 + 14, pw2 - 24, 8);
cx.fillRect(px2 + 12, py2 + 30, pw2 - 24, 4);
cx.fillRect(px2 + 12, py2 + ph2 - 26, pw2 * 0.5, 4);
}
var glow = cx.createRadialGradient(w * 0.5, h * 0.42, 30, w * 0.5, h * 0.42, w * 0.5);
glow.addColorStop(0, 'rgba(255,190,90,0.30)'); glow.addColorStop(1, 'rgba(255,190,90,0)');
cx.fillStyle = glow; cx.fillRect(0, 0, w, h);
});
var ofDisplay = placeMesh(new THREE.PlaneGeometry(2.66, 2.0), new THREE.MeshBasicMaterial({ map: displayTex }), 0.675, 1.62, -0.16);
// 3D dressing just behind the glass
for (var bs = 0; bs < 3; bs++) {
var stackX = 0.0 + bs * 0.62, stackH = 0.1 + Math.random() * 0.14;
placeMesh(new THREE.BoxGeometry(0.34, stackH, 0.24), new THREE.MeshStandardMaterial({ color: [0x8a4418, 0x5d4a1e, 0x6b1f1f][bs], roughness: 0.7 }), stackX - 0.2, 0.62 + stackH / 2, -0.04);
}
var folio = placeMesh(new THREE.PlaneGeometry(0.34, 0.26), new THREE.MeshStandardMaterial({ color: 0xe0d0a0, roughness: 0.8, side: THREE.DoubleSide }), 1.5, 0.72, -0.03);
folio.rotation.set(-1.1, 0.25, 0);
// Window glass + frame
placeMesh(new THREE.PlaneGeometry(2.75, 2.1), new THREE.MeshStandardMaterial({ color: 0xffd9a0, transparent: true, opacity: 0.07, roughness: 0.1, metalness: 0.3 }), 0.675, 1.62, 0.07);
var glassGrimeTex = makeCanvasTexture(256, 256, function(cx, w, h) {
cx.clearRect(0, 0, w, h);
var eg = cx.createRadialGradient(w/2, h/2, w * 0.2, w/2, h/2, w * 0.72);
eg.addColorStop(0, 'rgba(160,148,118,0)'); eg.addColorStop(1, 'rgba(150,138,108,0.5)');
cx.fillStyle = eg; cx.fillRect(0, 0, w, h);
for (var sm = 0; sm < 8; sm++) {
cx.strokeStyle = 'rgba(170,158,128,' + (0.06 + Math.random() * 0.1).toFixed(2) + ')';
cx.lineWidth = 5 + Math.random() * 12;
cx.beginPath(); var smx = Math.random() * w, smy = Math.random() * h;
cx.moveTo(smx, smy); cx.lineTo(smx + 40 + Math.random() * 80, smy - 20 - Math.random() * 40); cx.stroke();
}
cx.fillStyle = 'rgba(140,128,100,0.35)';
cx.fillRect(0, h - 22, w, 22);
});
placeMesh(new THREE.PlaneGeometry(2.66, 2.02), new THREE.MeshBasicMaterial({ map: glassGrimeTex, transparent: true, opacity: 0.55, depthWrite: false }), 0.675, 1.6, 0.085);
placeMesh(new THREE.PlaneGeometry(0.68, 1.56), new THREE.MeshBasicMaterial({ map: glassGrimeTex, transparent: true, opacity: 0.45, depthWrite: false }), -1.62, 1.72, 0.095);
placeMesh(new THREE.BoxGeometry(2.85, 0.07, 0.09), greenMat, 0.675, 2.7, 0.09);
placeMesh(new THREE.BoxGeometry(2.85, 0.09, 0.11), greenMat, 0.675, 0.56, 0.09);
placeMesh(new THREE.BoxGeometry(0.07, 2.2, 0.09), greenMat, -0.71, 1.62, 0.09);
placeMesh(new THREE.BoxGeometry(0.07, 2.2, 0.09), greenMat, 2.06, 1.62, 0.09);
placeMesh(new THREE.BoxGeometry(0.035, 2.1, 0.05), greenDark, 0.24, 1.62, 0.1);
placeMesh(new THREE.BoxGeometry(0.035, 2.1, 0.05), greenDark, 1.18, 1.62, 0.1);
// Stallriser
placeMesh(new THREE.BoxGeometry(2.85, 0.55, 0.14), greenMat, 0.675, 0.27, 0.08);
placeMesh(new THREE.BoxGeometry(2.5, 0.3, 0.03), greenDark, 0.675, 0.27, 0.16);

// ---- THE DOOR (left): amber glass, the dealer behind it ----
placeMesh(new THREE.BoxGeometry(0.14, 2.75, 0.1), greenMat, -2.08, 1.38, 0.02);
placeMesh(new THREE.BoxGeometry(0.14, 2.75, 0.1), greenMat, -1.16, 1.38, 0.02);
placeMesh(new THREE.BoxGeometry(1.06, 0.24, 0.1), greenMat, -1.62, 2.64, 0.02);
placeMesh(new THREE.BoxGeometry(1.06, 0.12, 0.1), greenMat, -1.62, 0.92, 0.02);
placeMesh(new THREE.BoxGeometry(1.06, 0.88, 0.1), greenMat, -1.62, 0.44, 0.02);
var doorGlassBackTex = makeCanvasTexture(256, 512, function(cx, w, h) {
var g = cx.createRadialGradient(w / 2, h * 0.42, 20, w / 2, h * 0.5, h * 0.6);
g.addColorStop(0, '#d47a1e'); g.addColorStop(0.5, '#8a4210'); g.addColorStop(1, '#351704');
cx.fillStyle = g; cx.fillRect(0, 0, w, h);
for (var sv = 0; sv < 5; sv++) {
cx.fillStyle = 'rgba(40,18,6,0.55)';
cx.fillRect(18 + sv * 46, 40 + (sv % 2) * 30, 26, h - 140);
}
});
var ofDoorBack = placeMesh(new THREE.PlaneGeometry(0.86, 2.3), new THREE.MeshBasicMaterial({ map: doorGlassBackTex }), -1.62, 1.55, -0.62);
// The dealer: counter, head-and-shoulders, the book, THE PAGE
var silMat = new THREE.MeshBasicMaterial({ color: 0x120a05 });
placeMesh(new THREE.BoxGeometry(0.72, 0.1, 0.12), silMat, -1.62, 0.98, -0.5);
var dealer = new THREE.Group();
dealer.position.set(-1.56, 0, -0.55);
scene.add(dealer);
var dHead = new THREE.Mesh(new THREE.CircleGeometry(0.085, 14), silMat); dHead.position.set(0, 1.5, 0); dealer.add(dHead);
var dBody = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.42), silMat); dBody.position.set(0, 1.2, 0); dealer.add(dBody);
var dShoulder = new THREE.Mesh(new THREE.CircleGeometry(0.21, 12), silMat); dShoulder.position.set(0, 1.38, 0); dShoulder.scale.set(1, 0.55, 1); dealer.add(dShoulder);
var dBook = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.05), silMat); dBook.position.set(0, 1.05, 0.02); dealer.add(dBook);
var pageMat = new THREE.MeshBasicMaterial({ color: 0xf0dCA8, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
var dPage = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.09), pageMat);
dPage.position.set(-1.56 + 0.065, 1.08, -0.52);
dPage.rotation.x = -0.9;
scene.add(dPage);
var pageState = { next: 6 + Math.random() * 8, start: -10 };
// Door glass tint + furniture
placeMesh(new THREE.PlaneGeometry(0.7, 1.62), new THREE.MeshStandardMaterial({ color: 0xffc070, transparent: true, opacity: 0.1, roughness: 0.15 }), -1.62, 1.72, 0.08);
placeMesh(new THREE.BoxGeometry(0.78, 0.06, 0.06), greenDark, -1.62, 2.56, 0.08);
placeMesh(new THREE.BoxGeometry(0.78, 0.06, 0.06), greenDark, -1.62, 0.88, 0.08);
placeMesh(new THREE.BoxGeometry(0.72, 0.62, 0.06), greenDark, -1.62, 0.48, 0.08);
placeMesh(new THREE.BoxGeometry(0.5, 0.3, 0.02), greenMat, -1.62, 0.48, 0.12);
var knob = placeMesh(new THREE.SphereGeometry(0.045, 10, 8), brassMat, -1.28, 1.45, 0.13);
placeMesh(new THREE.PlaneGeometry(0.86, 0.3), new THREE.MeshBasicMaterial({ color: 0xd88a28, transparent: true, opacity: 0.55 }), -1.62, 2.86, 0.06);
placeMesh(new THREE.BoxGeometry(1.0, 0.05, 0.3), new THREE.MeshStandardMaterial({ color: 0x7a746a, roughness: 0.9 }), -1.62, 0.025, 0.35);

// ---- AWNING over the window only — green canvas, scalloped valance ----
var awnTex = makeCanvasTexture(512, 256, function(cx, w, h) {
cx.fillStyle = '#2c4c37'; cx.fillRect(0, 0, w, h);
for (var wv = 0; wv < 14; wv++) {
cx.fillStyle = 'rgba(12,26,16,' + (0.12 + Math.random() * 0.2).toFixed(2) + ')';
cx.fillRect(Math.random() * w, 0, 8 + Math.random() * 30, h);
}
for (var aw2 = 0; aw2 < 8; aw2++) {
var ag = cx.createRadialGradient(Math.random() * w, Math.random() * h, 0, Math.random() * w, Math.random() * h, 24 + Math.random() * 40);
ag.addColorStop(0, 'rgba(50,44,26,0.35)'); ag.addColorStop(1, 'rgba(50,44,26,0)');
cx.fillStyle = ag; cx.fillRect(0, 0, w, h);
}
for (var wl = 0; wl < 10; wl++) {
cx.fillStyle = 'rgba(16,30,20,0.3)';
cx.fillRect(Math.random() * w, 0, 1.5 + Math.random() * 3, h);
}
cx.fillStyle = 'rgba(200,210,190,0.04)'; cx.fillRect(0, 0, w, 26);
});
var awning = placeMesh(new THREE.PlaneGeometry(2.95, 1.02), new THREE.MeshStandardMaterial({ map: awnTex, roughness: 0.85, side: THREE.DoubleSide, emissive: 0x16281c, emissiveIntensity: 0.32 }), 0.675, 2.46, 0.62);
awning.rotation.x = -0.52;
var scallopTex = makeCanvasTexture(512, 64, function(cx, w, h) {
cx.clearRect(0, 0, w, h);
cx.fillStyle = '#1f3a29';
cx.fillRect(0, 0, w, 26);
for (var sc2 = 0; sc2 < 8; sc2++) {
cx.beginPath(); cx.arc(32 + sc2 * 64, 26, 32, 0, Math.PI); cx.fill();
}
cx.fillStyle = 'rgba(200,190,150,0.12)'; cx.fillRect(0, 22, w, 4);
});
var valance = placeMesh(new THREE.PlaneGeometry(2.95, 0.3), new THREE.MeshStandardMaterial({ map: scallopTex, transparent: true, roughness: 0.85, side: THREE.DoubleSide }), 0.675, 2.12, 1.08);
for (var aa = 0; aa < 2; aa++) {
var ax = aa === 0 ? -0.72 : 2.07;
var arm = placeMesh(new THREE.CylinderGeometry(0.018, 0.018, 1.1, 6), greenDark, ax, 2.48, 0.6);
arm.rotation.x = 1.05;
}

// ---- BENCH of browsing stock under the window ----
placeMesh(new THREE.BoxGeometry(2.35, 0.07, 0.5), woodDark, 0.675, 0.6, 1.0);
for (var lg = 0; lg < 4; lg++) {
placeMesh(new THREE.BoxGeometry(0.06, 0.6, 0.06), woodDark, 0.675 + (lg % 2 === 0 ? -1.05 : 1.05), 0.3, 1.0 + (lg < 2 ? -0.18 : 0.18));
}
var spineTopTex = makeCanvasTexture(256, 128, function(cx, w, h) {
cx.fillStyle = '#241408'; cx.fillRect(0, 0, w, h);
var bx2 = 6;
while (bx2 < w - 8) {
var bw2 = 10 + Math.random() * 16;
var pal2 = ['#9a5020', '#6b2c12', '#54431c', '#26422a', '#5d1c1c', '#8a6034'];
cx.fillStyle = pal2[Math.floor(Math.random() * pal2.length)];
cx.fillRect(bx2, 8, bw2, h - 16);
cx.fillStyle = 'rgba(220,190,120,0.3)'; cx.fillRect(bx2 + 2, h * 0.4, bw2 - 4, 3);
bx2 += bw2 + 2;
}
});
for (var cr = 0; cr < 3; cr++) {
var crx = -0.05 + cr * 0.78;
placeMesh(new THREE.BoxGeometry(0.66, 0.16, 0.42), woodDark, crx, 0.72, 1.0);
var crTop = placeMesh(new THREE.PlaneGeometry(0.6, 0.36), new THREE.MeshStandardMaterial({ map: spineTopTex, roughness: 0.8 }), crx, 0.805, 1.0);
crTop.rotation.x = -Math.PI / 2 + 0.12;
}

// ---- HANGING SIGN left of the door ----
placeMesh(new THREE.BoxGeometry(0.04, 0.04, 0.7), greenDark, -2.5, 3.3, 0.4);
var signTexOF = makeCanvasTexture(128, 160, function(cx, w, h) {
cx.fillStyle = '#152a1e'; cx.fillRect(0, 0, w, h);
cx.strokeStyle = 'rgba(200,168,76,0.8)'; cx.lineWidth = 4; cx.strokeRect(6, 6, w - 12, h - 12);
cx.fillStyle = '#d2b258';
cx.font = '600 34px Georgia, serif'; cx.textAlign = 'center';
cx.fillText("I.O'F", w / 2, 58);
cx.strokeStyle = '#d2b258'; cx.lineWidth = 2.5;
cx.beginPath(); cx.moveTo(28, 108); cx.quadraticCurveTo(46, 96, 64, 108); cx.quadraticCurveTo(82, 96, 100, 108); cx.stroke();
cx.beginPath(); cx.moveTo(28, 108); cx.lineTo(28, 116); cx.moveTo(100, 108); cx.lineTo(100, 116); cx.stroke();
cx.beginPath(); cx.moveTo(64, 104); cx.lineTo(64, 118); cx.stroke();
});
var ofPivot = new THREE.Group();
ofPivot.position.set(-2.5, 3.28, 0.72);
scene.add(ofPivot);
var ofSign = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.5), new THREE.MeshStandardMaterial({ map: signTexOF, roughness: 0.6, side: THREE.DoubleSide }));
ofSign.position.set(0, -0.28, 0);
ofPivot.add(ofSign);
ofPivot.rotation.y = 1.05;

// ---- LIGHTING: the shop is the court's lamp ----
scene.add(new THREE.AmbientLight(0x0e1220, 0.4));
var moon = new THREE.DirectionalLight(0x24304a, 0.14); moon.position.set(-4, 9, 5); scene.add(moon);
var winGlow = new THREE.PointLight(0xffa040, 1.7, 5, 1.6); winGlow.position.set(0.675, 1.7, 0.4); scene.add(winGlow);
var doorGlow = new THREE.PointLight(0xff9838, 1.2, 4, 1.6); doorGlow.position.set(-1.62, 1.6, 0.35); scene.add(doorGlow);
var spill = new THREE.PointLight(0xffb060, 0.9, 6, 2); spill.position.set(-0.2, 1.0, 1.6); scene.add(spill);
// The shop in the flags (2026-09-22 polish loop): the door's and the window's
// amber lying on the wet court in front of them, two pools strongest at the
// sill line and fading out towards the camera, cut by the flagstone joints.
// One additive plane; it follows the two lamps' pulses in ofAnimate.
var ofSheenTex = makeCanvasTexture(256, 128, function(cx, w, h) {
  function pool(px, pw, a) {
    var g = cx.createRadialGradient(px, h * 0.08, 0, px, h * 0.08, pw);
    g.addColorStop(0, 'rgba(255,190,100,' + a + ')');
    g.addColorStop(0.5, 'rgba(255,170,70,' + (a * 0.35) + ')');
    g.addColorStop(1, 'rgba(255,150,50,0)');
    cx.fillStyle = g; cx.fillRect(0, 0, w, h);
  }
  pool(w * 0.72, w * 0.36, 0.62);
  pool(w * 0.27, w * 0.2, 0.42);
  cx.globalCompositeOperation = 'destination-out';
  cx.fillStyle = 'rgba(0,0,0,0.6)';
  for (var ji = 1; ji < 5; ji++) cx.fillRect(0, Math.round(ji * h / 5) - 1, w, 2);
  for (var jj = 1; jj < 9; jj++) cx.fillRect(Math.round(jj * w / 9) - 1, 0, 2, h);
  cx.globalCompositeOperation = 'source-over';
});
var ofSheen = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2.2),
  new THREE.MeshBasicMaterial({ map: ofSheenTex, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false }));
ofSheen.rotation.x = -Math.PI / 2;
ofSheen.position.set(-0.4, 0.012, 1.55);
scene.add(ofSheen);
// Court fog drifting through the amber
var hazeTexOF = makeCanvasTexture(128, 128, function(cx, w, h) {
var g = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
g.addColorStop(0, 'rgba(200,190,170,0.28)'); g.addColorStop(1, 'rgba(180,170,150,0)');
cx.fillStyle = g; cx.fillRect(0, 0, w, h);
});
var ofHaze = [];
for (var hz2 = 0; hz2 < 3; hz2++) {
var hsp = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTexOF, transparent: true, opacity: 0.1 + Math.random() * 0.06, depthWrite: false }));
hsp.position.set((Math.random() - 0.5) * 7, 1 + Math.random() * 2.2, 1.5 + Math.random() * 2);
var hsc = 4 + Math.random() * 3.5;
hsp.scale.set(hsc, hsc * 0.55, 1);
hsp.userData = { ph: Math.random() * 6.28, sp: 0.06 + Math.random() * 0.05 };
scene.add(hsp); ofHaze.push(hsp);
}
// Dust motes in the spill
var motes = [];
for (var mt = 0; mt < 6; mt++) {
var mote = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTexOF, transparent: true, opacity: 0.25, depthWrite: false, color: 0xffd898 }));
mote.position.set(-0.4 + Math.random() * 2.2, 0.4 + Math.random() * 1.6, 0.5 + Math.random() * 0.8);
mote.scale.set(0.03, 0.03, 1);
mote.userData = { ph: Math.random() * 6.28, sp: 0.25 + Math.random() * 0.3, bx: mote.position.x };
scene.add(mote); motes.push(mote);
}

// Animation
var clock = new THREE.Clock();
function ofAnimate() {
ofAnimId = requestAnimationFrame(ofAnimate);
var t = ofStill ? 4 : clock.getElapsedTime();
// Lamplight breath — the shop's pulse, strong enough to read from the court
var doorPulse = 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(t * 1.05)) + 0.1 * Math.sin(t * 3.1);
var winPulse = 0.86 + 0.14 * (0.5 + 0.5 * Math.sin(t * 0.8 + 2));
winGlow.intensity = 1.5 + winPulse * 0.5;
doorGlow.intensity = 0.9 + doorPulse * 0.9;
ofSheen.material.opacity = 0.07 + winPulse * 0.03 + doorPulse * 0.012;
ofDoorBack.material.color.setScalar(0.62 + doorPulse * 0.45);
ofDisplay.material.color.setScalar(0.82 + winPulse * 0.2);
// The dealer turns a page
if (t > pageState.next) { pageState.start = t; pageState.next = t + 16 + Math.random() * 10; }
var pAge = t - pageState.start;
if (pAge >= 0 && pAge < 0.9) {
var pp = pAge / 0.9;
dPage.rotation.y = Math.PI * pp;
dPage.position.y = 1.08 + Math.sin(pp * Math.PI) * 0.06;
pageMat.opacity = 0.85 + Math.sin(pp * Math.PI) * 0.15;
} else {
dPage.rotation.y = 0;
dPage.position.y = 1.08;
pageMat.opacity = 0.85;
}
// A tiny living stillness in him: breath, and a slow settle of the head
dealer.position.y = Math.sin(t * 0.45) * 0.006;
dHead.rotation.z = Math.sin(t * 0.12) * 0.03;
// Sign sway + wind twist
ofPivot.rotation.z = Math.sin(t * 0.85) * 0.04;
ofPivot.rotation.y = 1.05 + Math.sin(t * 0.29) * 0.13;
// Haze drift
for (var hzi2 = 0; hzi2 < (ofStill ? 0 : ofHaze.length); hzi2++) {
var hzs2 = ofHaze[hzi2];
hzs2.position.x += Math.sin(t * hzs2.userData.sp + hzs2.userData.ph) * 0.0025;
}
// Motes rising through the amber
for (var mti = 0; mti < (ofStill ? 0 : motes.length); mti++) {
var mo = motes[mti];
mo.position.y += 0.0011 * mo.userData.sp;
mo.position.x = mo.userData.bx + Math.sin(t * 0.6 + mo.userData.ph) * 0.08;
if (mo.position.y > 2.3) mo.position.y = 0.35;
}
// Camera drift
camera.position.x = 0.1 + Math.sin(t * 0.1) * 0.03;
camera.position.y = 1.7 + Math.sin(t * 0.14) * 0.012;
if (typeof dssComposerLocal !== 'undefined' && dssComposerLocal) { dssComposerLocal.render(); } else { renderer.render(scene, camera); }
}
ofAnimate();

// Overlays
var ofVig = document.createElement('div');
ofVig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:radial-gradient(ellipse at 48% 44%, transparent 30%, rgba(0,0,0,0.6) 100%);';
ofWrap.appendChild(ofVig);
var ofWash = document.createElement('div');
ofWash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9002;background:linear-gradient(180deg, rgba(6,8,16,0.35) 0%, rgba(4,5,10,0.08) 30%, rgba(4,5,10,0.08) 62%, rgba(8,6,3,0.3) 100%);';
ofWrap.appendChild(ofWash);
var ofLoc = document.createElement('div');
ofLoc.classList.add('dss-room-caption');
ofLoc.textContent = 'CECIL COURT, WC2';
ofLoc.style.cssText = 'position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font:12px "Courier New",monospace;color:rgba(200,180,140,0.55);text-shadow:0 0 8px rgba(0,0,0,0.95),0 1px 2px rgba(0,0,0,0.9);letter-spacing:2px;pointer-events:none;z-index:9003;white-space:nowrap;'; // 2026-09-16: 0.25 alpha with no shadow vanished against the lit pavement here
ofWrap.appendChild(ofLoc);
var ofBtn = document.createElement('div');
ofBtn.textContent = "ENTER O’FLATTERLY’S";
ofBtn.style.cssText = 'position:fixed;bottom:60px;left:50%;transform:translateX(-50%);padding:14px min(36px, 8vw);white-space:nowrap;max-width:calc(100vw - 16px);box-sizing:border-box;font:16px "Courier New",monospace;color:rgba(212,178,88,0.85);border:1px solid rgba(212,178,88,0.3);letter-spacing:min(4px, 0.9vw);cursor:pointer;z-index:9004;background:transparent;opacity:0;transition:opacity 2s ease;';
setTimeout(function() { ofBtn.style.opacity = '1'; }, 2200);
ofBtn.addEventListener('mouseenter', function() { ofBtn.style.color = 'rgba(230,200,120,0.95)'; ofBtn.style.borderColor = 'rgba(212,178,88,0.6)'; });
ofBtn.addEventListener('mouseleave', function() { ofBtn.style.color = 'rgba(212,178,88,0.85)'; ofBtn.style.borderColor = 'rgba(212,178,88,0.3)'; });
ofBtn.addEventListener('click', function() {
ofWrap.style.transition = 'opacity 1.5s ease';
ofWrap.style.opacity = '0';
setTimeout(function() {
if (ofAnimId) cancelAnimationFrame(ofAnimId); ofAnimId = null;
if (ofWrap.parentNode) ofWrap.parentNode.removeChild(ofWrap);
var links = document.querySelectorAll('tw-link, .enchantment-link');
for (var i = 0; i < links.length; i++) { if (links[i].textContent.trim() === '·') { links[i].click(); break; } }
}, 1500);
});
ofWrap.appendChild(ofBtn);
document.body.appendChild(ofWrap);
}

setInterval(function() {
var container = document.getElementById('of-container');
if (container && !ofActive) {
initOflatterly();
} else if (!container) {
ofActive = false;
if (ofAnimId) { cancelAnimationFrame(ofAnimId); ofAnimId = null; }
window._dssDisposeWrap('of-wrap');
}
}, 300);
})();
