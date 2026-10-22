// ====== FRENCH HOUSE SCENE — INLINE ======
(function() {
var fhActive = false;
var fhAnimId = null;

function initFrenchHouse() {
if (fhActive) return;
fhActive = true;
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(buildFHScene) : buildFHScene()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(buildFHScene) : buildFHScene());
}
}

function buildFHScene() {
var fhStill = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* 2026-10-19 (Sam, playtest): the green fairy twinkles, soon after you arrive and every 6 to 11 s while you stay; a visit counter
   (localStorage dssFairyVisits) picks its note set, so each visit sounds a little different */
(function() {
  var visit = 0; try { visit = (+localStorage.getItem('dssFairyVisits') || 0) + 1; localStorage.setItem('dssFairyVisits', String(visit)); } catch (e) {}
  var seen = false, waits = 0;
  function twinkle() {
    var on = !!(fhWrap && fhWrap.isConnected); /* this build's own overlay (hoisted var): wait for it, stop once it is gone */
    if (!on) { if (!seen && ++waits < 20) setTimeout(twinkle, 500); return; } /* 2026-10-19 overnight: gives up after 10 s, so a visit left within the first beat doesn't poll all night */
    seen = true;
    if (!document.hidden && window.dssAudio && window.dssAudio.fairyTwinkle) { try { window.dssAudio._tick(function() { window.dssAudio.fairyTwinkle(visit); }); } catch (e) {} }
    setTimeout(twinkle, 6000 + Math.random() * 5000);
  }
  setTimeout(twinkle, 1400);
})();
var fhWindowMats = [];
// Full-screen overlay
var fhWrap = document.createElement('div');
fhWrap.id = 'fh-wrap';
fhWrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9000;background:#050508;';

// Canvas for Three.js
var fhCanvas = document.createElement('canvas');
fhCanvas.width = window.innerWidth;
fhCanvas.height = window.innerHeight;
fhCanvas.style.cssText = 'display:block;position:absolute;top:0;left:0;';
fhWrap.appendChild(fhCanvas);

// Vignette overlay (offset centre for painterly feel)
var fhVig = document.createElement('div');
fhVig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:radial-gradient(ellipse at 45% 45%,transparent 30%,rgba(0,0,0,0.6) 100%);';
fhWrap.appendChild(fhVig);

// Film grain overlay
var fhGrain = document.createElement('div');
fhGrain.id = 'grain';
fhGrain.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9002;opacity:0.02;mix-blend-mode:overlay;';
fhWrap.appendChild(fhGrain);

// Colour wash overlay
var fhColorwash = document.createElement('div');
fhColorwash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9000;background:linear-gradient(180deg,rgba(10,8,25,0.3) 0%,rgba(5,5,15,0.08) 30%,rgba(5,5,15,0.08) 60%,rgba(5,3,2,0.4) 100%);';
fhWrap.appendChild(fhColorwash);

// Location label
var fhLoc = document.createElement('div');
fhLoc.classList.add('dss-room-caption');
fhLoc.textContent = 'DEAN STREET, SOHO';
fhLoc.style.cssText = 'position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font:12px \'Courier New\',monospace;color:rgba(200,180,140,0.25);letter-spacing:2px;pointer-events:none;z-index:9003;white-space:nowrap;';
fhWrap.appendChild(fhLoc);

document.body.appendChild(fhWrap);

// ============================================================
// SCENE SETUP
// ============================================================
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x121218);
scene.fog = new THREE.Fog(0x121218, 3, 28);

var camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 200);

// ============================================================
// LAYOUT — Camera angled slightly from the right, looking left
// ============================================================
// Facade at z=0 facing +Z. Camera offset to the right so we see
// the building at a gentle angle, left side receding.
camera.position.set(4.0, 4.2, 16);
camera.lookAt(-0.5, 5.2, 0);

var renderer = new THREE.WebGLRenderer({ canvas: fhCanvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 600 ? 1.25 : 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.55;
window._dssBindScene('fh-wrap', scene, renderer, camera);
var dssComposerLocal = window.dssMakeComposer ? window.dssMakeComposer(scene, camera, renderer, { focus: 16 }) : null;
if (window.dssFilmGrade) window.dssFilmGrade(document.getElementById('fh-wrap'));

// ============================================================
// MATERIALS
// ============================================================
var redBrick = new THREE.MeshStandardMaterial({ color: 0x8a4a38, roughness: 0.85 });
var darkBrick = new THREE.MeshStandardMaterial({ color: 0x6a3a2a, roughness: 0.9 });
var lightBrick = new THREE.MeshStandardMaterial({ color: 0x9a5a48, roughness: 0.8 });
var whiteTrim = new THREE.MeshStandardMaterial({ color: 0xe8e4dc, roughness: 0.7 });
var creamTrim = new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.75 });
var bluePaint = new THREE.MeshStandardMaterial({ color: 0x1a2a5a, roughness: 0.6 });
var darkBlue = new THREE.MeshStandardMaterial({ color: 0x0a1a3a, roughness: 0.7 });
var midBlue = new THREE.MeshStandardMaterial({ color: 0x15245a, roughness: 0.65 });
var blackFascia = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.5 });
var goldMat = new THREE.MeshStandardMaterial({ color: 0xc8a840, roughness: 0.3, metalness: 0.4 });
var brassMat = new THREE.MeshStandardMaterial({ color: 0xb89830, roughness: 0.35, metalness: 0.5 });
// High-contrast paving slabs (same recipe as Ronnie's — joints that survive lamp wash)
var fhPaveTex = (function() {
  var c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  var cx = c.getContext('2d');
  cx.fillStyle = '#42423e'; cx.fillRect(0, 0, 512, 512);
  var sw = 128, sh = 96;
  for (var sy = 0; sy < 512; sy += sh) {
    var off = ((sy / sh) % 2 === 0) ? 0 : sw / 2;
    for (var sx = -sw; sx < 512 + sw; sx += sw) {
      var bxp = sx + off;
      var sg = 46 + Math.floor(Math.random() * 42);
      cx.fillStyle = 'rgb(' + sg + ',' + sg + ',' + (sg - 4) + ')';
      cx.fillRect(bxp, sy, sw, sh);
      cx.strokeStyle = 'rgba(10, 10, 8, 1)'; cx.lineWidth = 5;
      cx.strokeRect(bxp, sy, sw, sh);
      if (Math.random() < 0.3) {
        cx.fillStyle = 'rgba(18, 18, 16, 0.5)';
        cx.fillRect(bxp + (Math.random() < 0.5 ? 2 : sw - 14), sy + (Math.random() < 0.5 ? 2 : sh - 10), 12, 8);
      }
    }
  }
  cx.strokeStyle = 'rgba(14, 14, 11, 0.7)'; cx.lineWidth = 1.2;
  for (var c2 = 0; c2 < 9; c2++) {
    cx.beginPath();
    cx.moveTo(Math.random() * 512, Math.random() * 512);
    cx.lineTo(Math.random() * 512, Math.random() * 512);
    cx.stroke();
  }
  for (var wp = 0; wp < 7; wp++) {
    var wpx = Math.random() * 512, wpy = Math.random() * 512;
    var wpr = 35 + Math.random() * 70;
    var wpg = cx.createRadialGradient(wpx, wpy, 0, wpx, wpy, wpr);
    wpg.addColorStop(0, 'rgba(50, 56, 58, 0.45)');
    wpg.addColorStop(1, 'rgba(50, 56, 58, 0)');
    cx.fillStyle = wpg; cx.fillRect(wpx - wpr, wpy - wpr, wpr * 2, wpr * 2);
  }
  var tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(24, 24);
  return tex;
})();
var pavementMat = new THREE.MeshStandardMaterial({ map: fhPaveTex, roughness: 0.85 });
var roadMat = (window.dssScene && window.dssScene.makeGrimyRoad)
  ? window.dssScene.makeGrimyRoad({ baseColor: 0x121214 })
  : new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85 });
var sillMat = new THREE.MeshStandardMaterial({ color: 0xdcd4c8, roughness: 0.7 });
var darkGlass = new THREE.MeshStandardMaterial({ color: 0x0a0a15, roughness: 0.2, metalness: 0.3 });
var windowFrame = new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.6 });
var pipeMat = new THREE.MeshStandardMaterial({ color: 0x2a2a28, roughness: 0.7 });
var ironMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6, metalness: 0.3 });
var woodMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.8 });
var darkWood = new THREE.MeshStandardMaterial({ color: 0x201510, roughness: 0.85 });
var plasterMat = new THREE.MeshStandardMaterial({ color: 0xc8c0b0, roughness: 0.8 });

// ============================================================
// HELPERS
// ============================================================
function makeCanvasTexture(w, h, drawFunc) {
// 2026-10-14 (Sam: "weirdly pixelated"): the windows, signs and brick were painted at their small sizes and stretched
// two or three times on a laptop screen; they are painted at twice the resolution now (the same drawing, scaled), and
// mipmapped so they do not shimmer when small
var S = 2, c = document.createElement('canvas');
c.width = w * S; c.height = h * S;
var cx = c.getContext('2d'); cx.scale(S, S);
drawFunc(cx, w, h);
var tex = new THREE.CanvasTexture(c);
tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true;
try { tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy()); } catch (e) {}
return tex;
}

function placeMesh(group, geo, mat, x, y, z) {
var m = new THREE.Mesh(geo, mat);
m.position.set(x, y, z);
group.add(m);
return m;
}

// ============================================================
// GROUND
// ============================================================
var ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), pavementMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

var road = new THREE.Mesh(new THREE.PlaneGeometry(8, 60), roadMat);
road.rotation.x = -Math.PI / 2;
// y=0.004 — must sit ABOVE the ground plane at y=0, or the slabbed ground
// renders over the tarmac (same buried-plane bug as Ronnie's)
road.position.set(0, 0.004, 10);
road.receiveShadow = true;
scene.add(road);

// Wet road surface (reflective sheen)
var wetMat = new THREE.MeshStandardMaterial({
color: 0x1a1a1a, roughness: 0.15, metalness: 0.5, transparent: true, opacity: 0.18, depthWrite:false
});
var wetRoad = new THREE.Mesh(new THREE.PlaneGeometry(8, 60), wetMat);
wetRoad.rotation.x = -Math.PI / 2;
wetRoad.position.set(0, 0.01, 10);
scene.add(wetRoad);

// Road centre line comes painted into the grimy-road texture

// ============================================================
// THE FRENCH HOUSE
// ============================================================
var pub = new THREE.Group();

// ---- MAIN BRICK BODY ----
// 4 storeys of red brick. Facade at z=0 facing +Z.
// Width about 7 units (x from -3 to 4)
var hasToolkit = !!(window.dssScene && window.dssScene.makeGrimyBrick);
var brickBody = new THREE.Mesh(new THREE.BoxGeometry(7, 13, 7),
hasToolkit ? window.dssScene.makeGrimyBrick({ baseColor: 0x8a4a38, repeat: [2.2, 5] }) : redBrick);
brickBody.position.set(0.5, 6.5, -3.5);
pub.add(brickBody);

// Brick face panel — real coursed brickwork from the toolkit
var facadePanel = new THREE.Mesh(new THREE.BoxGeometry(7.02, 13, 0.08),
hasToolkit ? window.dssScene.makeGrimyBrick({ baseColor: 0x6a3a2a, repeat: [2, 5], sootStreaks: 7 }) : darkBrick);
facadePanel.position.set(0.5, 6.5, 0.04);
pub.add(facadePanel);

// Side wall visible at the angle — slightly different brick tone
var sideWall = new THREE.Mesh(new THREE.PlaneGeometry(7, 13),
hasToolkit ? window.dssScene.makeGrimyBrick({ baseColor: 0x7a4438, repeat: [2, 5], dampPatches: 7 })
: new THREE.MeshStandardMaterial({ color: 0x7a4438, roughness: 0.88 }));
sideWall.position.set(4.01, 6.5, -3.5);
sideWall.rotation.y = -Math.PI / 2;
pub.add(sideWall);

// Mortar coursing now comes painted into the brick texture

// ---- WHITE HORIZONTAL STRING COURSES (between floors) ----
var stringHeights = [3.6, 6.8, 10.0];
for (var si = 0; si < stringHeights.length; si++) {
// Main course
var stringCourse = new THREE.Mesh(new THREE.BoxGeometry(7.1, 0.12, 0.14), whiteTrim);
stringCourse.position.set(0.5, stringHeights[si], 0.12);
pub.add(stringCourse);
// Upper lip (projecting slightly)
placeMesh(pub, new THREE.BoxGeometry(7.12, 0.04, 0.18), whiteTrim, 0.5, stringHeights[si] + 0.07, 0.14);
// Shadow line below
var shadowLine = new THREE.Mesh(new THREE.BoxGeometry(7.1, 0.03, 0.06),
new THREE.MeshStandardMaterial({ color: 0x5a3a2a, roughness: 0.9 }));
shadowLine.position.set(0.5, stringHeights[si] - 0.08, 0.1);
pub.add(shadowLine);
// Side return on right (visible at angle)
placeMesh(pub, new THREE.BoxGeometry(0.14, 0.12, 0.3), whiteTrim, 4.01, stringHeights[si], -0.02);
}

// ---- TOP CORNICE (heavy projecting cornice at roofline) ----
var topCornice = new THREE.Mesh(new THREE.BoxGeometry(7.3, 0.2, 0.4), whiteTrim);
topCornice.position.set(0.5, 13.05, 0.2);
pub.add(topCornice);
// Second layer — deeper projection
placeMesh(pub, new THREE.BoxGeometry(7.35, 0.1, 0.5), whiteTrim, 0.5, 12.95, 0.28);
// Cornice underside
var corniceUnder = new THREE.Mesh(new THREE.BoxGeometry(7.3, 0.08, 0.5), creamTrim);
corniceUnder.position.set(0.5, 12.85, 0.25);
pub.add(corniceUnder);
// Dentil course (small blocks under cornice)
for (var di = -3; di <= 4; di += 0.3) {
var dentil = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.06), whiteTrim);
dentil.position.set(di, 12.78, 0.22);
pub.add(dentil);
}
// Moulding band below dentils
placeMesh(pub, new THREE.BoxGeometry(7.25, 0.05, 0.1), creamTrim, 0.5, 12.7, 0.15);
// Side return of cornice
placeMesh(pub, new THREE.BoxGeometry(0.4, 0.2, 0.5), whiteTrim, 4.01, 13.05, -0.05);

// ---- MANSARD ROOF with DORMER WINDOWS ----
var roofMat = new THREE.MeshStandardMaterial({ color: 0x2a2a30, roughness: 0.85 });
var slateMat = new THREE.MeshStandardMaterial({ color: 0x3a3a42, roughness: 0.8 });
var roofSlab = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.8, 4), roofMat);
roofSlab.position.set(0.5, 14, -1.5);
pub.add(roofSlab);
// Mansard slope face (slightly angled appearance — a tilted plane)
var mansardFace = new THREE.Mesh(new THREE.PlaneGeometry(7.22, 2.0), slateMat);
mansardFace.position.set(0.5, 14, 0.52);
mansardFace.rotation.x = 0.15;
pub.add(mansardFace);
// Ridge tiles along top
placeMesh(pub, new THREE.BoxGeometry(7.2, 0.08, 0.12), roofMat, 0.5, 14.92, -0.2);
// Lead flashing strip at base of mansard
placeMesh(pub, new THREE.BoxGeometry(7.22, 0.06, 0.06),
new THREE.MeshStandardMaterial({ color: 0x555560, roughness: 0.4, metalness: 0.3 }),
0.5, 13.15, 0.12);

// Dormer windows (5 across the top)
for (var dx = -2.2; dx <= 3.2; dx += 1.35) {
// Dormer box
var dormerBox = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.8), roofMat);
dormerBox.position.set(dx, 14.1, 0.3);
pub.add(dormerBox);
// White dormer face
var dormerFace = new THREE.Mesh(new THREE.BoxGeometry(0.92, 1.22, 0.06), whiteTrim);
dormerFace.position.set(dx, 14.1, 0.72);
pub.add(dormerFace);
// Dormer cheeks (side walls visible at angle)
placeMesh(pub, new THREE.BoxGeometry(0.06, 1.2, 0.8), slateMat, dx + 0.46, 14.1, 0.32);
placeMesh(pub, new THREE.BoxGeometry(0.06, 1.2, 0.8), slateMat, dx - 0.46, 14.1, 0.32);
// Glass with warm hint
var dormerGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.85),
new THREE.MeshBasicMaterial({ color: 0x556688, transparent: true, opacity: 0.3 }));
dormerGlass.position.set(dx, 14.15, 0.76);
pub.add(dormerGlass);
// Glazing bars — cross pattern
placeMesh(pub, new THREE.BoxGeometry(0.02, 0.85, 0.02), whiteTrim, dx, 14.15, 0.78);
placeMesh(pub, new THREE.BoxGeometry(0.6, 0.02, 0.02), whiteTrim, dx, 14.15, 0.78);
placeMesh(pub, new THREE.BoxGeometry(0.6, 0.02, 0.02), whiteTrim, dx, 14.42, 0.78);
placeMesh(pub, new THREE.BoxGeometry(0.6, 0.02, 0.02), whiteTrim, dx, 13.88, 0.78);
// Dormer sill
placeMesh(pub, new THREE.BoxGeometry(0.7, 0.04, 0.08), whiteTrim, dx, 13.68, 0.76);
// Peaked top
var dormerPeak = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.5, 4), roofMat);
dormerPeak.position.set(dx, 14.95, 0.3);
dormerPeak.rotation.y = Math.PI / 4;
pub.add(dormerPeak);
// Finial on peak
placeMesh(pub, new THREE.CylinderGeometry(0.015, 0.015, 0.15, 4), ironMat, dx, 15.25, 0.3);
}

// ---- UPPER FLOOR WINDOWS (3 rows of sash windows) ----
// Painted window interiors: lamp-lit rooms or dark ones, dressed with
// curtains, a half-drawn blind, or net curtains
var fhCurtainCols = ['#7a2c22', '#5a5a30', '#6a4a5a', '#3a4a58'];
function makeUpperWindowTex(lit, style, colIdx) {
return makeCanvasTexture(128, 192, function(cx, w, h) {
if (lit) {
var bgg = cx.createLinearGradient(0, 0, 0, h);
bgg.addColorStop(0, '#c89448'); bgg.addColorStop(0.5, '#a87434'); bgg.addColorStop(1, '#6a4820');
cx.fillStyle = bgg; cx.fillRect(0, 0, w, h);
// Ceiling lamp glow near the top
var cg = cx.createRadialGradient(w * 0.5, h * 0.16, 4, w * 0.5, h * 0.2, w * 0.55);
cg.addColorStop(0, 'rgba(255, 235, 180, 0.9)');
cg.addColorStop(1, 'rgba(255, 220, 150, 0)');
cx.fillStyle = cg;
cx.beginPath(); cx.arc(w * 0.5, h * 0.18, w * 0.55, 0, Math.PI * 2); cx.fill();
// A picture on the back wall
cx.fillStyle = 'rgba(85, 55, 22, 0.55)';
cx.fillRect(w * 0.4, h * 0.44, w * 0.2, h * 0.13);
cx.strokeStyle = 'rgba(200, 170, 90, 0.5)'; cx.lineWidth = 2;
cx.strokeRect(w * 0.4, h * 0.44, w * 0.2, h * 0.13);
// Floor shadow
var fsh = cx.createLinearGradient(0, h * 0.7, 0, h);
fsh.addColorStop(0, 'rgba(40, 24, 8, 0)');
fsh.addColorStop(1, 'rgba(40, 24, 8, 0.55)');
cx.fillStyle = fsh; cx.fillRect(0, 0, w, h);
} else {
var bgd = cx.createLinearGradient(0, 0, 0, h);
bgd.addColorStop(0, '#232c3e'); bgd.addColorStop(1, '#131a26');
cx.fillStyle = bgd; cx.fillRect(0, 0, w, h);
// Faint slanted street-light sheen on the dark glass
cx.fillStyle = 'rgba(150, 160, 180, 0.07)';
cx.beginPath();
cx.moveTo(w * 0.55, 0); cx.lineTo(w * 0.8, 0);
cx.lineTo(w * 0.35, h); cx.lineTo(w * 0.1, h);
cx.closePath(); cx.fill();
}
if (style === 1) {
// Half-drawn roller blind
cx.fillStyle = lit ? '#c8b890' : '#39404e';
cx.fillRect(3, 0, w - 6, h * 0.38);
cx.fillStyle = 'rgba(0, 0, 0, 0.3)';
cx.fillRect(3, h * 0.365, w - 6, 3.5);
cx.strokeStyle = 'rgba(40, 30, 15, 0.7)'; cx.lineWidth = 1.5;
cx.beginPath(); cx.moveTo(w / 2, h * 0.38); cx.lineTo(w / 2, h * 0.43); cx.stroke();
cx.beginPath(); cx.arc(w / 2, h * 0.45, 3, 0, Math.PI * 2); cx.stroke();
}
if (style === 2) {
// Net curtains — translucent wash with gentle vertical waves and a hem
cx.fillStyle = 'rgba(235, 233, 222, 0.3)';
cx.fillRect(0, 0, w, h * 0.88);
for (var nv = 0; nv < w; nv += 9) {
cx.fillStyle = 'rgba(255, 255, 250, ' + (0.05 + (nv % 27 === 0 ? 0.08 : 0)) + ')';
cx.fillRect(nv, 0, 4, h * 0.88);
}
cx.fillStyle = 'rgba(235, 233, 222, 0.35)';
for (var sc2 = 0; sc2 < 4; sc2++) {
cx.beginPath();
cx.arc(w * (0.125 + sc2 * 0.25), h * 0.88, w * 0.125, 0, Math.PI);
cx.fill();
}
} else {
// Side drapes gathered with tiebacks, plus a dark pelmet
var dCol = lit ? fhCurtainCols[colIdx % fhCurtainCols.length] : '#1e1a22';
function drawDrape() {
cx.fillStyle = dCol;
cx.beginPath();
cx.moveTo(0, 0);
cx.lineTo(w * 0.32, 0);
cx.quadraticCurveTo(w * 0.2, h * 0.3, w * 0.15, h * 0.55);
cx.quadraticCurveTo(w * 0.19, h * 0.72, w * 0.27, h * 0.92);
cx.lineTo(0, h * 0.95);
cx.closePath(); cx.fill();
// Fold shadows
cx.strokeStyle = 'rgba(0, 0, 0, 0.3)'; cx.lineWidth = 2.5;
for (var fl2 = 0; fl2 < 3; fl2++) {
cx.beginPath();
cx.moveTo(w * (0.06 + fl2 * 0.08), 4);
cx.quadraticCurveTo(w * (0.03 + fl2 * 0.06), h * 0.4, w * (0.05 + fl2 * 0.07), h * 0.88);
cx.stroke();
}
// Highlight on the leading fold
cx.strokeStyle = 'rgba(255, 240, 210, ' + (lit ? 0.25 : 0.06) + ')'; cx.lineWidth = 1.5;
cx.beginPath();
cx.moveTo(w * 0.29, 4);
cx.quadraticCurveTo(w * 0.17, h * 0.32, w * 0.13, h * 0.55);
cx.stroke();
}
drawDrape();
cx.save(); cx.translate(w, 0); cx.scale(-1, 1); drawDrape(); cx.restore();
// Pelmet
cx.fillStyle = lit ? 'rgba(40, 20, 12, 0.9)' : 'rgba(10, 8, 12, 0.9)';
cx.fillRect(0, 0, w, 7);
}
});
}
function addSashWindow(x, y, isLit, isBigger) {
var ww = isBigger ? 1.0 : 0.85;
var wh = isBigger ? 1.8 : 1.5;

// Brick reveal (recessed surround — creates depth)
placeMesh(pub, new THREE.BoxGeometry(ww + 0.28, wh + 0.28, 0.05),
new THREE.MeshStandardMaterial({ color: 0x5a3228, roughness: 0.9 }),
x, y, 0.04);

// White frame surround — outer
placeMesh(pub, new THREE.BoxGeometry(ww + 0.22, wh + 0.22, 0.06), windowFrame, x, y, 0.07);
// Inner frame (slightly recessed)
placeMesh(pub, new THREE.BoxGeometry(ww + 0.08, wh + 0.08, 0.04), windowFrame, x, y, 0.1);

// Glass — painted room behind it: lamp glow, curtains or blind or nets
var winStyle = Math.floor(Math.abs(x * 7.3 + y * 3.1)) % 3;
var winCol = Math.floor(Math.abs(x * 5.1 + y * 1.7)) % fhCurtainCols.length;
var fhRoomTex = makeUpperWindowTex(isLit, winStyle, winCol);
var glassMat = new THREE.MeshStandardMaterial({map:fhRoomTex,emissiveMap:fhRoomTex,emissive:0xffffff,emissiveIntensity:.82,roughness:.23,metalness:.03});
if(isLit)fhWindowMats.push(glassMat);
placeMesh(pub, new THREE.PlaneGeometry(ww, wh), glassMat, x, y, 0.14);

// Sash bar (horizontal divider — the distinctive sash window split)
placeMesh(pub, new THREE.BoxGeometry(ww + 0.1, 0.06, 0.06), windowFrame, x, y + 0.1, 0.14);
// Sash lift rail (thinner bar in lower sash)
placeMesh(pub, new THREE.BoxGeometry(ww, 0.025, 0.03), windowFrame, x, y - 0.2, 0.15);

// Vertical glazing bars (6 over 6 pane style)
placeMesh(pub, new THREE.BoxGeometry(0.025, wh, 0.02), windowFrame, x - ww * 0.25, y, 0.16);
placeMesh(pub, new THREE.BoxGeometry(0.025, wh, 0.02), windowFrame, x + ww * 0.25, y, 0.16);
// Horizontal glazing bars (upper and lower sections)
placeMesh(pub, new THREE.BoxGeometry(ww, 0.025, 0.02), windowFrame, x, y + wh * 0.22, 0.16);
placeMesh(pub, new THREE.BoxGeometry(ww, 0.025, 0.02), windowFrame, x, y - wh * 0.22, 0.16);
// Extra horizontals for 6-pane look
placeMesh(pub, new THREE.BoxGeometry(ww, 0.02, 0.02), windowFrame, x, y + wh * 0.36, 0.16);
placeMesh(pub, new THREE.BoxGeometry(ww, 0.02, 0.02), windowFrame, x, y - wh * 0.36, 0.16);

// Stone sill (projecting, with drip edge)
placeMesh(pub, new THREE.BoxGeometry(ww + 0.3, 0.08, 0.2), sillMat, x, y - wh / 2 - 0.06, 0.16);
// Drip edge underneath sill
placeMesh(pub, new THREE.BoxGeometry(ww + 0.32, 0.025, 0.03), sillMat, x, y - wh / 2 - 0.12, 0.22);

// Brick flat arch / lintel above (slightly lighter brick — gauged brick)
placeMesh(pub, new THREE.BoxGeometry(ww + 0.25, 0.12, 0.06), lightBrick, x, y + wh / 2 + 0.08, 0.1);
// Keystone hint at centre of lintel
placeMesh(pub, new THREE.BoxGeometry(0.1, 0.16, 0.04), lightBrick, x, y + wh / 2 + 0.1, 0.13);
}

// Window X positions (4 across, roughly evenly spaced)
var winXs = [-1.8, -0.3, 1.2, 2.7];

// 3rd floor windows (smaller, top floor — most lit, it's evening)
var topLit = [true, false, true, true];
for (var wi = 0; wi < winXs.length; wi++) {
addSashWindow(winXs[wi], 11.4, topLit[wi], false);
}
// 2nd floor windows (bigger — these have the flags — all lit)
for (var wi = 0; wi < winXs.length; wi++) {
addSashWindow(winXs[wi], 8.4, true, true);
}
// 1st floor windows (biggest, warmly lit — main pub floor)
for (var wi = 0; wi < winXs.length; wi++) {
addSashWindow(winXs[wi], 5.2, true, true);
}

// ---- FLAGS (hanging from first floor windows) ----
function makeTricolore() {
return makeCanvasTexture(192, 128, function(cx, w, h) {
// Hung-cloth outline — straight top hem, sagging scalloped bottom edge
cx.beginPath();
cx.moveTo(0, 0);
cx.lineTo(w, 0);
cx.lineTo(w * 0.97, h * 0.82);
cx.quadraticCurveTo(w * 0.85, h * 0.98, w * 0.68, h * 0.88);
cx.quadraticCurveTo(w * 0.52, h * 0.8, w * 0.36, h * 0.92);
cx.quadraticCurveTo(w * 0.18, h * 1.0, w * 0.03, h * 0.86);
cx.closePath();
cx.save();
cx.clip();
// Aged tricolore bands
cx.fillStyle = '#1e3f8f'; cx.fillRect(0, 0, w / 3, h);
cx.fillStyle = '#e6e2d6'; cx.fillRect(w / 3, 0, w / 3, h);
cx.fillStyle = '#c23230'; cx.fillRect(w * 2 / 3, 0, w / 3, h);
// Drape creases — alternating soft shadow and sheen bands down the cloth
var cxp = 0;
while (cxp < w) {
var bw2 = 8 + Math.random() * 16;
var shade = Math.random();
if (shade < 0.45) {
cx.fillStyle = 'rgba(0, 0, 0, ' + (0.06 + Math.random() * 0.1).toFixed(3) + ')';
} else if (shade < 0.8) {
cx.fillStyle = 'rgba(255, 255, 255, ' + (0.04 + Math.random() * 0.06).toFixed(3) + ')';
} else {
cx.fillStyle = 'rgba(0, 0, 0, 0)';
}
cx.fillRect(cxp, 0, bw2, h);
cxp += bw2;
}
// Three stronger fold shadows, slightly curved
cx.strokeStyle = 'rgba(0, 0, 0, 0.2)'; cx.lineWidth = 3;
var folds = [0.24, 0.5, 0.77];
for (var fd = 0; fd < folds.length; fd++) {
cx.beginPath();
cx.moveTo(w * folds[fd], 0);
cx.quadraticCurveTo(w * (folds[fd] + 0.03), h * 0.5, w * (folds[fd] - 0.015), h);
cx.stroke();
}
// Horizontal weave
for (var fy = 0; fy < h; fy += 3) {
cx.fillStyle = 'rgba(0, 0, 0, 0.025)';
cx.fillRect(0, fy, w, 1);
}
// Soot dirt gathering at the sagging lower edge
var dg = cx.createLinearGradient(0, h * 0.55, 0, h);
dg.addColorStop(0, 'rgba(55, 45, 32, 0)');
dg.addColorStop(1, 'rgba(55, 45, 32, 0.4)');
cx.fillStyle = dg; cx.fillRect(0, 0, w, h);
// A few smudges
for (var sm = 0; sm < 4; sm++) {
cx.fillStyle = 'rgba(40, 34, 24, ' + (0.06 + Math.random() * 0.08).toFixed(3) + ')';
cx.beginPath();
cx.ellipse(Math.random() * w, h * 0.35 + Math.random() * h * 0.55,
6 + Math.random() * 14, 3 + Math.random() * 7, Math.random(), 0, Math.PI * 2);
cx.fill();
}
cx.restore();
// Darker top hem where it wraps the pole line
cx.fillStyle = 'rgba(0, 0, 0, 0.3)';
cx.fillRect(0, 0, w, 4);
});
}

// Flags at each 1st floor window — ALL French tricolores
var flagMeshes = [];
for (var fi = 0; fi < winXs.length; fi++) {
var flagTex = makeTricolore();
var flagMat = new THREE.MeshBasicMaterial({
map: flagTex, side: THREE.DoubleSide, transparent: true, opacity: 0.9
});
var flagPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.5), flagMat);
flagPlane.position.set(winXs[fi], 6.4, 0.6);
flagPlane.rotation.x = -0.3;
flagPlane.rotation.z = (fi % 2 === 0) ? 0.15 : -0.15;
pub.add(flagPlane);
flagMeshes.push({ mesh: flagPlane, baseRotZ: flagPlane.rotation.z, phase: Math.random() * Math.PI * 2 });
// Flag pole
var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.0, 4), ironMat);
pole.position.set(winXs[fi], 6.5, 0.25);
pole.rotation.x = -0.6;
pub.add(pole);
// Pole bracket on wall
placeMesh(pub, new THREE.BoxGeometry(0.06, 0.06, 0.15), ironMat, winXs[fi], 6.55, 0.12);
}

// Two larger tricolores flanking the fascia
var bigFlagMeshes = [];
var bigFlagL = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.6),
new THREE.MeshBasicMaterial({ map: makeTricolore(), side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
bigFlagL.position.set(-2.5, 3.9, 0.8);
bigFlagL.rotation.x = -0.2;
pub.add(bigFlagL);
bigFlagMeshes.push({ mesh: bigFlagL, baseRotZ: 0, phase: 0.5 });

var bigFlagR = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.6),
new THREE.MeshBasicMaterial({ map: makeTricolore(), side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
bigFlagR.position.set(3.5, 3.9, 0.8);
bigFlagR.rotation.x = -0.2;
pub.add(bigFlagR);
bigFlagMeshes.push({ mesh: bigFlagR, baseRotZ: 0, phase: 1.2 });

// ---- BLACK FASCIA "THE FRENCH HOUSE" ----
var fasciaC = document.createElement('canvas');
fasciaC.width = 768; fasciaC.height = 80;
var fctx = fasciaC.getContext('2d');
fctx.fillStyle = '#0a0a0a';
fctx.fillRect(0, 0, 768, 80);
// Gold border with double line
fctx.strokeStyle = '#c8a840'; fctx.lineWidth = 3;
fctx.strokeRect(4, 4, 760, 72);
fctx.strokeStyle = '#a08830'; fctx.lineWidth = 1;
fctx.strokeRect(8, 8, 752, 64);
// "Pol Roger & Co" on left
fctx.fillStyle = '#a08830';
fctx.font = 'italic 16px Georgia, serif';
fctx.textAlign = 'left';
fctx.fillText('Pol Roger & Co', 25, 50);
fctx.textAlign = 'right';
fctx.fillText('Pol Roger & Co', 743, 50);
// "THE FRENCH HOUSE" centred in gold
fctx.fillStyle = '#d4b040';
fctx.font = 'bold 36px Georgia, serif';
fctx.textAlign = 'center';
fctx.fillText('THE  FRENCH  HOUSE', 384, 48);
// Thin gold decorative rule
fctx.strokeStyle = '#b09830'; fctx.lineWidth = 1;
fctx.beginPath(); fctx.moveTo(150, 60); fctx.lineTo(618, 60); fctx.stroke();

var fasciaTex = new THREE.CanvasTexture(fasciaC);
var fascia = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.65, 0.2),
new THREE.MeshBasicMaterial({ map: fasciaTex }));
fascia.position.set(0.5, 3.85, 0.35);
pub.add(fascia);
// Fascia underside (black slab)
placeMesh(pub, new THREE.BoxGeometry(7.0, 0.08, 0.35), blackFascia, 0.5, 3.5, 0.3);
// Fascia top cap (gold strip)
placeMesh(pub, new THREE.BoxGeometry(7.02, 0.03, 0.22), goldMat, 0.5, 4.19, 0.35);

// Victorian globe lamps on fascia (3 lamps now)
var fasciaLamps = [];
for (var flx = -2.2; flx <= 3.2; flx += 2.7) {
// Ornate bracket
placeMesh(pub, new THREE.BoxGeometry(0.06, 0.25, 0.08), ironMat, flx, 4.15, 0.42);
placeMesh(pub, new THREE.BoxGeometry(0.04, 0.04, 0.15), ironMat, flx, 4.3, 0.48);
// Decorative scroll (curved bracket hint)
placeMesh(pub, new THREE.BoxGeometry(0.03, 0.15, 0.03), ironMat, flx + 0.04, 4.22, 0.46);
// Globe
var globe = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8),
new THREE.MeshBasicMaterial({ color: 0xffeebb, transparent: true, opacity: 0.7 }));
globe.position.set(flx, 4.35, 0.55);
pub.add(globe);
// Inner filament glow
var filament = new THREE.Mesh(new THREE.SphereGeometry(0.03, 4, 4),
new THREE.MeshBasicMaterial({ color: 0xffcc66 }));
filament.position.set(flx, 4.35, 0.55);
pub.add(filament);
var fasciaLight = new THREE.PointLight(0xffd080, 0.5, 5);
fasciaLight.position.set(flx, 4.35, 0.65);
fasciaLight.userData.baseIntensity = 0.5;
pub.add(fasciaLight);
fasciaLamps.push(fasciaLight);
}

// ---- BLUE AWNINGS (3 across the ground floor) ----
var awningMat = new THREE.MeshStandardMaterial({ color: 0x1a2a6a, roughness: 0.5 });
var awningEdge = new THREE.MeshStandardMaterial({ color: 0x1a2058, roughness: 0.6 });
var awningPositions = [-1.5, 0.5, 2.5];
for (var ai = 0; ai < awningPositions.length; ai++) {
// Awning body (angled box)
var awning = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.9), awningMat);
awning.position.set(awningPositions[ai], 3.2, 0.7);
awning.rotation.x = 0.2;
pub.add(awning);
// Awning underside (slightly different shade for depth)
var awningUnder = new THREE.Mesh(new THREE.PlaneGeometry(1.95, 0.85), midBlue);
awningUnder.position.set(awningPositions[ai], 3.16, 0.7);
awningUnder.rotation.x = -Math.PI / 2 + 0.2;
pub.add(awningUnder);
// Awning front flap (valance)
var flap = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 0.04), awningMat);
flap.position.set(awningPositions[ai], 3.0, 1.12);
pub.add(flap);
// Scalloped edge along bottom of valance (small triangles via thin boxes)
for (var sci = -0.85; sci <= 0.85; sci += 0.2) {
placeMesh(pub, new THREE.BoxGeometry(0.08, 0.06, 0.02), awningEdge,
awningPositions[ai] + sci, 2.83, 1.12);
}
// Awning side panels
placeMesh(pub, new THREE.BoxGeometry(0.04, 0.35, 0.9), awningMat, awningPositions[ai] - 1.0, 3.1, 0.7);
placeMesh(pub, new THREE.BoxGeometry(0.04, 0.35, 0.9), awningMat, awningPositions[ai] + 1.0, 3.1, 0.7);

// Text labels on awning front
var awningTextC = document.createElement('canvas');
awningTextC.width = 256; awningTextC.height = 48;
var atctx = awningTextC.getContext('2d');
atctx.fillStyle = '#1a2a6a'; atctx.fillRect(0, 0, 256, 48);
atctx.fillStyle = '#d8d0b0'; atctx.font = 'bold 22px Georgia, serif'; atctx.textAlign = 'center';
if (ai === 1) {
atctx.fillText('The French House', 128, 33);
} else {
atctx.fillStyle = '#e0d080'; atctx.font = 'bold 26px Georgia, serif';
atctx.fillText('RICARD', 128, 34);
}
var awningTex = new THREE.CanvasTexture(awningTextC);
var awningLabel = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.26),
new THREE.MeshBasicMaterial({ map: awningTex }));
awningLabel.position.set(awningPositions[ai], 3.01, 1.15);
pub.add(awningLabel);
}

// ---- BLUE GROUND FLOOR ----
var blueGF = new THREE.Mesh(new THREE.BoxGeometry(7.02, 3.2, 0.15), bluePaint);
blueGF.position.set(0.5, 1.6, 0.15);
pub.add(blueGF);

// Thin gold pinstripe at top of blue area
placeMesh(pub, new THREE.BoxGeometry(7.04, 0.025, 0.04), goldMat, 0.5, 3.22, 0.24);

// White pilasters dividing the ground floor bays
var pilasterXs = [-3.0, -0.5, 1.5, 3.5];
for (var pxi = 0; pxi < pilasterXs.length; pxi++) {
// Main pilaster body
placeMesh(pub, new THREE.BoxGeometry(0.15, 3.2, 0.2), whiteTrim, pilasterXs[pxi], 1.6, 0.28);
// Fluted detail (vertical grooves via thin strips)
placeMesh(pub, new THREE.BoxGeometry(0.02, 3.0, 0.04), creamTrim, pilasterXs[pxi] - 0.04, 1.6, 0.39);
placeMesh(pub, new THREE.BoxGeometry(0.02, 3.0, 0.04), creamTrim, pilasterXs[pxi] + 0.04, 1.6, 0.39);
// Capital detail at top
placeMesh(pub, new THREE.BoxGeometry(0.22, 0.12, 0.24), whiteTrim, pilasterXs[pxi], 3.22, 0.28);
placeMesh(pub, new THREE.BoxGeometry(0.18, 0.06, 0.22), creamTrim, pilasterXs[pxi], 3.16, 0.28);
// Base plinth
placeMesh(pub, new THREE.BoxGeometry(0.2, 0.15, 0.22), whiteTrim, pilasterXs[pxi], 0.08, 0.28);
}

// Interior of the pub, painted — back bar, bottles, mirror, photo wall
function makePubInteriorTex(seed) {
return makeCanvasTexture(256, 320, function(cx, w, h) {
// Warm room base with a deep amber glow off-centre
cx.fillStyle = '#241408'; cx.fillRect(0, 0, w, h);
var rg = cx.createRadialGradient(w * (0.35 + seed * 0.3), h * 0.42, 12, w / 2, h * 0.5, w * 0.85);
rg.addColorStop(0, 'rgba(255, 190, 90, 0.55)');
rg.addColorStop(0.45, 'rgba(200, 130, 45, 0.3)');
rg.addColorStop(1, 'rgba(90, 55, 18, 0.08)');
cx.fillStyle = rg; cx.fillRect(0, 0, w, h);
// Nicotine-stained upper wall
cx.fillStyle = 'rgba(120, 85, 40, 0.35)';
cx.fillRect(0, 0, w, h * 0.16);
// The famous photo wall — rows of small framed pictures
for (var pr = 0; pr < 2; pr++) {
for (var pc = 0; pc < 5; pc++) {
var fx2 = w * 0.06 + pc * w * 0.19 + (pr % 2) * w * 0.04;
var fy2 = h * 0.05 + pr * h * 0.1;
cx.fillStyle = 'rgba(200, 170, 90, 0.7)';
cx.fillRect(fx2, fy2, w * 0.13, h * 0.07);
cx.fillStyle = 'rgba(40, 30, 20, 0.85)';
cx.fillRect(fx2 + 2, fy2 + 2, w * 0.13 - 4, h * 0.07 - 4);
}
}
// Mirror behind the back bar — pale panel with a slanted glint
cx.fillStyle = 'rgba(150, 130, 95, 0.45)';
cx.fillRect(w * 0.12, h * 0.26, w * 0.76, h * 0.2);
cx.fillStyle = 'rgba(235, 215, 170, 0.25)';
cx.beginPath();
cx.moveTo(w * 0.2, h * 0.26); cx.lineTo(w * 0.32, h * 0.26);
cx.lineTo(w * 0.22, h * 0.46); cx.lineTo(w * 0.1, h * 0.46); cx.closePath(); cx.fill();
// Back-bar shelf with bottles against the mirror
cx.fillStyle = 'rgba(50, 32, 16, 0.9)';
cx.fillRect(w * 0.1, h * 0.46, w * 0.8, h * 0.02);
var botCols = ['#2a4a2a', '#5a3a18', '#1a2a4a', '#6a5a20', '#3a1a1a', '#2a4a3a'];
for (var bt2 = 0; bt2 < 8; bt2++) {
cx.fillStyle = botCols[(bt2 + Math.floor(seed * 5)) % botCols.length];
var btx = w * 0.13 + bt2 * w * 0.095;
cx.fillRect(btx, h * 0.36, w * 0.04, h * 0.1);
cx.fillRect(btx + w * 0.012, h * 0.33, w * 0.016, h * 0.035);
}
// Hanging glasses over the counter — small pale stems
for (var hg = 0; hg < 6; hg++) {
cx.fillStyle = 'rgba(230, 215, 180, 0.4)';
cx.fillRect(w * 0.16 + hg * w * 0.12, h * 0.52, 2, h * 0.035);
cx.beginPath();
cx.arc(w * 0.16 + hg * w * 0.12 + 1, h * 0.575, 4, 0, Math.PI); cx.fill();
}
// Counter edge
cx.fillStyle = 'rgba(70, 45, 20, 0.95)';
cx.fillRect(0, h * 0.6, w, h * 0.045);
cx.fillStyle = 'rgba(160, 120, 60, 0.35)';
cx.fillRect(0, h * 0.6, w, h * 0.008);
// Two pendant lamps with soft glow
for (var pl2 = 0; pl2 < 2; pl2++) {
var plx = w * (0.28 + pl2 * 0.42 + seed * 0.05);
cx.strokeStyle = 'rgba(20, 12, 6, 0.8)'; cx.lineWidth = 2;
cx.beginPath(); cx.moveTo(plx, 0); cx.lineTo(plx, h * 0.13); cx.stroke();
var lg2 = cx.createRadialGradient(plx, h * 0.16, 2, plx, h * 0.16, 26);
lg2.addColorStop(0, 'rgba(255, 230, 160, 0.95)');
lg2.addColorStop(0.4, 'rgba(255, 190, 100, 0.5)');
lg2.addColorStop(1, 'rgba(200, 130, 50, 0)');
cx.fillStyle = lg2;
cx.beginPath(); cx.arc(plx, h * 0.16, 26, 0, Math.PI * 2); cx.fill();
cx.fillStyle = 'rgba(40, 25, 10, 0.9)';
cx.beginPath(); cx.arc(plx, h * 0.135, 7, Math.PI, 0); cx.fill();
}
// Lower panelling shadow
var pg2 = cx.createLinearGradient(0, h * 0.75, 0, h);
pg2.addColorStop(0, 'rgba(15, 8, 4, 0)');
pg2.addColorStop(1, 'rgba(15, 8, 4, 0.6)');
cx.fillStyle = pg2; cx.fillRect(0, 0, w, h);
});
}

// Ground floor windows (large, warmly lit — 3 bays)
var bayXPositions = [-2.2, 0.5, 2.5];
var bayWidths = [1.2, 1.8, 1.8];
for (var bi = 0; bi < bayXPositions.length; bi++) {
var bx = bayXPositions[bi];
var bw = bayWidths[bi];

// Blue window frame (outer)
placeMesh(pub, new THREE.BoxGeometry(bw + 0.18, 2.4, 0.06), bluePaint, bx, 1.6, 0.26);
// Inner frame
placeMesh(pub, new THREE.BoxGeometry(bw + 0.08, 2.3, 0.04), darkBlue, bx, 1.6, 0.29);

// Glazing starts halfway up, as at the real French — you see only the top
// half of the room and its drinkers over the panelled lower half.
// z=0.315: in FRONT of the frame boxes (whose front faces reach 0.31);
// anything deeper gets buried inside them and never renders.
var gfIntTex = makePubInteriorTex(bi * 0.33 + 0.15);
gfIntTex.repeat.set(1, 0.62);
gfIntTex.offset.set(0, 0.38);
var gfInterior = new THREE.Mesh(new THREE.PlaneGeometry(bw, 1.3),
new THREE.MeshBasicMaterial({ map: gfIntTex }));
gfInterior.position.set(bx, 2.0, 0.315);
pub.add(gfInterior);
// Thin warm glass tint over everything, so it still reads as glazing
var gfGlass = new THREE.Mesh(new THREE.PlaneGeometry(bw, 1.3),
new THREE.MeshBasicMaterial({ color: 0xffcc66, transparent: true, opacity: 0.18 }));
gfGlass.position.set(bx, 2.0, 0.335);
pub.add(gfGlass);

// Vertical glazing bars (upper glazed half only)
var numBars = Math.floor(bw / 0.5);
for (var gbi = 0; gbi <= numBars; gbi++) {
var gbx = bx - bw / 2 + gbi * (bw / numBars);
placeMesh(pub, new THREE.BoxGeometry(0.035, 1.3, 0.04), whiteTrim, gbx, 2.0, 0.34);
}
// Horizontal glazing bars
placeMesh(pub, new THREE.BoxGeometry(bw, 0.035, 0.04), whiteTrim, bx, 2.3, 0.34);
// Bottom rail where the glass meets the panelling — an internal sill line
placeMesh(pub, new THREE.BoxGeometry(bw, 0.06, 0.05), whiteTrim, bx, 1.35, 0.34);

// Panelled lower half beneath the glazing (solid dark blue, moulded)
placeMesh(pub, new THREE.BoxGeometry(bw, 0.95, 0.08), darkBlue, bx, 0.88, 0.3);
placeMesh(pub, new THREE.BoxGeometry(bw - 0.15, 0.72, 0.03), midBlue, bx, 0.88, 0.35);
// Kickboard below (solid dark blue with panelling)
placeMesh(pub, new THREE.BoxGeometry(bw, 0.35, 0.08), darkBlue, bx, 0.28, 0.3);
// Panel inset
placeMesh(pub, new THREE.BoxGeometry(bw - 0.15, 0.22, 0.03), midBlue, bx, 0.28, 0.35);

// Transom bar above window
placeMesh(pub, new THREE.BoxGeometry(bw + 0.1, 0.06, 0.06), whiteTrim, bx, 2.75, 0.32);
}

// ---- PUB DOOR ----
// Moved left to x=-1.1 so no pilaster (they stand at -3.0/-0.5/1.5/3.5)
// runs through the door face
// Recessed doorway (reveals depth)
placeMesh(pub, new THREE.BoxGeometry(0.92, 2.5, 0.12),
new THREE.MeshStandardMaterial({ color: 0x0a0a15, roughness: 0.9 }),
-1.1, 1.25, 0.2);
// Door itself
placeMesh(pub, new THREE.BoxGeometry(0.82, 2.35, 0.06), bluePaint, -1.1, 1.22, 0.3);
// Door panels (upper glass, lower solid)
var doorGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 1.4),
new THREE.MeshBasicMaterial({ color: 0xffcc66, transparent: true, opacity: 0.65 }));
doorGlass.position.set(-1.1, 1.55, 0.34);
pub.add(doorGlass);
// Door glazing bars
placeMesh(pub, new THREE.BoxGeometry(0.02, 1.4, 0.02), whiteTrim, -1.1, 1.55, 0.36);
placeMesh(pub, new THREE.BoxGeometry(0.65, 0.02, 0.02), whiteTrim, -1.1, 1.55, 0.36);
placeMesh(pub, new THREE.BoxGeometry(0.65, 0.02, 0.02), whiteTrim, -1.1, 1.9, 0.36);
// Lower door panel
placeMesh(pub, new THREE.BoxGeometry(0.7, 0.5, 0.04), darkBlue, -1.1, 0.5, 0.33);
// Panel moulding
placeMesh(pub, new THREE.BoxGeometry(0.55, 0.35, 0.02), midBlue, -1.1, 0.5, 0.36);
// Door frame surround
placeMesh(pub, new THREE.BoxGeometry(0.92, 0.06, 0.1), whiteTrim, -1.1, 2.45, 0.32);
placeMesh(pub, new THREE.BoxGeometry(0.06, 2.45, 0.1), whiteTrim, -0.68, 1.22, 0.32);
placeMesh(pub, new THREE.BoxGeometry(0.06, 2.45, 0.1), whiteTrim, -1.52, 1.22, 0.32);
// Fanlight above door
var fanlightGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.2),
new THREE.MeshBasicMaterial({ color: 0xffcc66, transparent: true, opacity: 0.5 }));
fanlightGlass.position.set(-1.1, 2.55, 0.34);
pub.add(fanlightGlass);
placeMesh(pub, new THREE.BoxGeometry(0.78, 0.02, 0.02), whiteTrim, -1.1, 2.45, 0.36);
// Door handle (brass)
placeMesh(pub, new THREE.BoxGeometry(0.04, 0.12, 0.06), brassMat, -0.82, 1.1, 0.38);
// Letterbox
placeMesh(pub, new THREE.BoxGeometry(0.18, 0.04, 0.03), brassMat, -1.1, 0.7, 0.38);
// Door step
placeMesh(pub, new THREE.BoxGeometry(0.95, 0.06, 0.2), sillMat, -1.1, 0.02, 0.38);
// Step nosing
placeMesh(pub, new THREE.BoxGeometry(0.97, 0.02, 0.04),
new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.2 }),
-1.1, 0.06, 0.48);

// ---- FLOWER BASKETS (enriched) ----
var basketMat = new THREE.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 0.8 });
var flowerPositions = [3.3, -2.8, 0.5];
for (var fpi = 0; fpi < flowerPositions.length; fpi++) {
// Ornate iron bracket
placeMesh(pub, new THREE.BoxGeometry(0.05, 0.35, 0.04), ironMat, flowerPositions[fpi], 2.85, 0.3);
placeMesh(pub, new THREE.BoxGeometry(0.04, 0.04, 0.3), ironMat, flowerPositions[fpi], 2.65, 0.45);
placeMesh(pub, new THREE.BoxGeometry(0.03, 0.2, 0.03), ironMat, flowerPositions[fpi] + 0.03, 2.75, 0.38);
// Basket (wire cage look)
var basket = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.22, 8), basketMat);
basket.position.set(flowerPositions[fpi], 2.52, 0.6);
pub.add(basket);
// Flowers (colourful small spheres in clusters)
var flowerCols = [0xcc3030, 0xff6060, 0xaa2060, 0xee8040, 0xff80b0];
for (var fli = 0; fli < 7; fli++) {
var flowerBall = new THREE.Mesh(new THREE.SphereGeometry(0.04 + Math.random() * 0.04, 5, 5),
new THREE.MeshStandardMaterial({ color: flowerCols[fli % flowerCols.length], roughness: 0.7 }));
flowerBall.position.set(
flowerPositions[fpi] + (Math.random() - 0.5) * 0.22,
2.68 + Math.random() * 0.12,
0.6 + (Math.random() - 0.5) * 0.18
);
pub.add(flowerBall);
}
// Green foliage trailing down
for (var gli = 0; gli < 6; gli++) {
var leaf = new THREE.Mesh(new THREE.SphereGeometry(0.035, 4, 4),
new THREE.MeshStandardMaterial({ color: 0x2a5a1a + Math.floor(Math.random() * 0x101000), roughness: 0.8 }));
leaf.position.set(
flowerPositions[fpi] + (Math.random() - 0.5) * 0.3,
2.5 + Math.random() * 0.2,
0.6 + (Math.random() - 0.5) * 0.25
);
pub.add(leaf);
}
}

// ---- HANGING PUB SIGN (right side — heraldic coat of arms) ----
var signTex = makeCanvasTexture(128, 160, function(cx, w, h) {
cx.fillStyle = '#0a1a4a'; cx.fillRect(10, 10, w - 20, h - 30);
cx.strokeStyle = '#c8a840'; cx.lineWidth = 4;
cx.strokeRect(12, 12, w - 24, h - 34);
// Inner border
cx.strokeStyle = '#a08830'; cx.lineWidth = 1;
cx.strokeRect(16, 16, w - 32, h - 42);
cx.fillStyle = '#c8a840'; cx.font = 'bold 14px Georgia'; cx.textAlign = 'center';
cx.fillText('THE', w / 2, 38);
cx.fillText('FRENCH', w / 2, 58);
cx.fillText('HOUSE', w / 2, 78);
cx.font = '28px Georgia';
cx.fillText('\u269C', w / 2, 116);
// Small decorative dots
cx.beginPath(); cx.arc(30, 100, 3, 0, Math.PI * 2); cx.fill();
cx.beginPath(); cx.arc(w - 30, 100, 3, 0, Math.PI * 2); cx.fill();
});
var signMat = new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.5, side: THREE.DoubleSide });
var hangSign = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.9), signMat);
hangSign.position.set(4.5, 4.0, 1.5);
pub.add(hangSign);
// Ornate bracket arm
placeMesh(pub, new THREE.BoxGeometry(1.4, 0.05, 0.05), ironMat, 4.1, 4.5, 0.8);
// Vertical chain
placeMesh(pub, new THREE.BoxGeometry(0.03, 0.55, 0.03), ironMat, 4.5, 4.25, 1.5);
// Decorative scrollwork
placeMesh(pub, new THREE.BoxGeometry(0.5, 0.03, 0.03), ironMat, 3.7, 4.35, 0.5);
placeMesh(pub, new THREE.BoxGeometry(0.3, 0.03, 0.03), ironMat, 3.6, 4.25, 0.4);
// Small gold ball at bottom of sign
var signBall = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), goldMat);
signBall.position.set(4.5, 3.5, 1.5);
pub.add(signBall);

// ---- DRAINPIPES ----
// Main drainpipe left side
placeMesh(pub, new THREE.CylinderGeometry(0.04, 0.04, 13, 6), pipeMat, -2.9, 6.5, 0.2);
// Pipe brackets
for (var pbh = 2; pbh < 13; pbh += 2.5) {
placeMesh(pub, new THREE.BoxGeometry(0.12, 0.04, 0.1), pipeMat, -2.9, pbh, 0.2);
}
// Hopper head
placeMesh(pub, new THREE.BoxGeometry(0.18, 0.2, 0.12), pipeMat, -2.9, 13.0, 0.18);
// Downpipe at base flares out
placeMesh(pub, new THREE.BoxGeometry(0.12, 0.3, 0.1), pipeMat, -2.9, 0.15, 0.25);
// Second drainpipe on right
placeMesh(pub, new THREE.CylinderGeometry(0.035, 0.035, 13, 6), pipeMat, 3.8, 6.5, 0.15);
for (var pbh = 3; pbh < 13; pbh += 3) {
placeMesh(pub, new THREE.BoxGeometry(0.1, 0.04, 0.08), pipeMat, 3.8, pbh, 0.15);
}

// ---- GUTTERING along roofline ----
placeMesh(pub, new THREE.BoxGeometry(7.2, 0.06, 0.08),
new THREE.MeshStandardMaterial({ color: 0x3a3a38, roughness: 0.5, metalness: 0.2 }),
0.5, 13.12, 0.18);

// ---- CHIMNEYS ----
var chimMat = new THREE.MeshStandardMaterial({ color: 0x7a5a48, roughness: 0.85 });
placeMesh(pub, new THREE.BoxGeometry(0.6, 1.8, 0.6), chimMat, -1.5, 15.4, -2);
placeMesh(pub, new THREE.BoxGeometry(0.6, 1.8, 0.6), chimMat, 2.5, 15.4, -2);
// Chimney caps
placeMesh(pub, new THREE.BoxGeometry(0.7, 0.1, 0.7), chimMat, -1.5, 16.35, -2);
placeMesh(pub, new THREE.BoxGeometry(0.7, 0.1, 0.7), chimMat, 2.5, 16.35, -2);
// Chimney haunching
placeMesh(pub, new THREE.BoxGeometry(0.65, 0.06, 0.65),
new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7 }),
-1.5, 16.28, -2);
placeMesh(pub, new THREE.BoxGeometry(0.65, 0.06, 0.65),
new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7 }),
2.5, 16.28, -2);
// Chimney pots
for (var cpi = -1.7; cpi <= -1.3; cpi += 0.4) {
placeMesh(pub, new THREE.CylinderGeometry(0.06, 0.08, 0.35, 6), chimMat, cpi, 16.55, -2);
placeMesh(pub, new THREE.CylinderGeometry(0.07, 0.06, 0.06, 6), chimMat, cpi, 16.75, -2);
}
for (var cpi = 2.3; cpi <= 2.7; cpi += 0.4) {
placeMesh(pub, new THREE.CylinderGeometry(0.06, 0.08, 0.35, 6), chimMat, cpi, 16.55, -2);
placeMesh(pub, new THREE.CylinderGeometry(0.07, 0.06, 0.06, 6), chimMat, cpi, 16.75, -2);
}

// ---- CHALKBOARD SIGN outside ----
// A-frame chalkboard
var cbLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.7, 0.35), woodMat);
cbLeg1.position.set(-1.65, 0.35, 1.05); cbLeg1.rotation.z = 0.08; pub.add(cbLeg1);
var cbLeg2 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.7, 0.35), woodMat);
cbLeg2.position.set(-1.95, 0.35, 1.05); cbLeg2.rotation.z = -0.08; pub.add(cbLeg2);
// Board face
var cbBoard = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.55, 0.04),
new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 }));
cbBoard.position.set(-1.8, 0.42, 1.2); cbBoard.rotation.y = 0.12; pub.add(cbBoard);
// Wood frame around board
placeMesh(pub, new THREE.BoxGeometry(0.44, 0.03, 0.05), woodMat, -1.8, 0.71, 1.2);
placeMesh(pub, new THREE.BoxGeometry(0.44, 0.03, 0.05), woodMat, -1.8, 0.13, 1.2);
placeMesh(pub, new THREE.BoxGeometry(0.03, 0.55, 0.05), woodMat, -1.58, 0.42, 1.2);
placeMesh(pub, new THREE.BoxGeometry(0.03, 0.55, 0.05), woodMat, -2.02, 0.42, 1.2);

var cbC = document.createElement('canvas');
cbC.width = 96; cbC.height = 128;
var cbctx = cbC.getContext('2d');
cbctx.fillStyle = '#0a0a0a'; cbctx.fillRect(0, 0, 96, 128);
cbctx.fillStyle = '#c8c0a0'; cbctx.font = 'italic 13px Georgia'; cbctx.textAlign = 'center';
cbctx.fillText('MENU', 48, 22);
cbctx.fillText('du Jour', 48, 40);
cbctx.strokeStyle = '#808060'; cbctx.lineWidth = 0.5;
cbctx.beginPath(); cbctx.moveTo(20, 48); cbctx.lineTo(76, 48); cbctx.stroke();
cbctx.font = '10px Georgia';
cbctx.fillText('Soupe \u00E0 l\'oignon', 48, 65);
cbctx.fillText('Steak frites', 48, 82);
cbctx.fillText('Cr\u00E8me br\u00FBl\u00E9e', 48, 99);
cbctx.fillStyle = '#a09060'; cbctx.font = 'italic 9px Georgia';
cbctx.fillText('~ Bon App\u00E9tit ~', 48, 120);
var cbTex = new THREE.CanvasTexture(cbC);
var cbFace = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.5),
new THREE.MeshBasicMaterial({ map: cbTex }));
cbFace.position.set(-1.8, 0.42, 1.23); cbFace.rotation.y = 0.12; pub.add(cbFace);

// ---- EXTRA GRANULAR DETAILS ----

// Cast iron drainpipe (right side of pub facade)
var pipeMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.7, metalness: 0.3 });
placeMesh(pub, new THREE.BoxGeometry(0.08, 14, 0.08), pipeMat, 3.85, 7, 0.35);
// Pipe brackets (3 fixing points)
for (var pb = 0; pb < 3; pb++) {
placeMesh(pub, new THREE.BoxGeometry(0.16, 0.04, 0.06), pipeMat, 3.85, 3 + pb * 4, 0.38);
}
// Hopper head at gutter junction
placeMesh(pub, new THREE.BoxGeometry(0.16, 0.2, 0.12), pipeMat, 3.85, 13.2, 0.38);
// Downpipe shoe at base (angled outlet)
placeMesh(pub, new THREE.BoxGeometry(0.1, 0.15, 0.14), pipeMat, 3.85, 0.1, 0.42);

// Left drainpipe removed — was blocking the PARIS sign from camera angle

// Guttering along roofline
placeMesh(pub, new THREE.BoxGeometry(7.4, 0.06, 0.1), pipeMat, 0.5, 13.5, 0.38);

// Gas meter box (small, on the left wall near ground)
var meterMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.6, metalness: 0.4 });
placeMesh(pub, new THREE.BoxGeometry(0.25, 0.2, 0.1), meterMat, -3.2, 0.5, 0.4);
// Meter dial face
placeMesh(pub, new THREE.BoxGeometry(0.08, 0.08, 0.02),
new THREE.MeshBasicMaterial({ color: 0xeeeeee }), -3.2, 0.52, 0.46);

// Boot scraper at doorstep (classic iron semicircle)
placeMesh(pub, new THREE.BoxGeometry(0.15, 0.12, 0.04), ironMat, -0.8, 0.06, 0.5);
placeMesh(pub, new THREE.BoxGeometry(0.02, 0.12, 0.04), ironMat, -0.88, 0.06, 0.5);
placeMesh(pub, new THREE.BoxGeometry(0.02, 0.12, 0.04), ironMat, -0.72, 0.06, 0.5);

// Brass door plate (above letterbox — "PUSH")
var doorPlateMat = new THREE.MeshStandardMaterial({ color: 0xb89040, roughness: 0.3, metalness: 0.8 });
placeMesh(pub, new THREE.BoxGeometry(0.12, 0.06, 0.01), doorPlateMat, -1.1, 0.88, 0.38);

// Pub number plate — "49" (The French House is at 49 Dean Street)
var numC = document.createElement('canvas');
numC.width = 64; numC.height = 48;
var numCtx = numC.getContext('2d');
numCtx.fillStyle = '#0a1a4a'; numCtx.fillRect(0, 0, 64, 48);
numCtx.fillStyle = '#d8d0b0'; numCtx.font = 'bold 28px Georgia'; numCtx.textAlign = 'center';
numCtx.fillText('49', 32, 35);
var numTex = new THREE.CanvasTexture(numC);
var numPlate = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.16),
new THREE.MeshBasicMaterial({ map: numTex }));
numPlate.position.set(-1.52, 2.8, 0.36);
pub.add(numPlate);

// Ventilation grille (cast iron, near ground level)
for (var vi = 0; vi < 4; vi++) {
placeMesh(pub, new THREE.BoxGeometry(0.3, 0.015, 0.02), ironMat, 1.8, 0.08 + vi * 0.035, 0.42);
}
// Grille surround
placeMesh(pub, new THREE.BoxGeometry(0.35, 0.17, 0.015), pipeMat, 1.8, 0.1, 0.41);

// Pavement kerb stone (granite edge along the street)
var kerbMat = new THREE.MeshStandardMaterial({ color: 0x787878, roughness: 0.7 });
var kerbStone = new THREE.Mesh(new THREE.BoxGeometry(20, 0.12, 0.25), kerbMat);
kerbStone.position.set(0, -0.04, 3.0);
scene.add(kerbStone);

// Pavement flagstones (subtle grid lines scored into the ground)
var flagMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.85 });
for (var fi = -5; fi <= 8; fi++) {
var flagLine = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.005, 3.5), flagMat);
flagLine.position.set(fi * 1.0, 0.005, 1.5);
scene.add(flagLine);
}
for (var fi = 0; fi < 6; fi++) {
var flagCross = new THREE.Mesh(new THREE.BoxGeometry(14, 0.005, 0.02), flagMat);
flagCross.position.set(1, 0.005, fi * 0.6 + 0.3);
scene.add(flagCross);
}

// Drain cover (cast iron, in the gutter)
var drainCover = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.4),
new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.6 }));
drainCover.position.set(1.5, 0.01, 3.3);
scene.add(drainCover);
// Drain slots
for (var di = 0; di < 5; di++) {
var slot = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.025, 0.02),
new THREE.MeshStandardMaterial({ color: 0x111111 }));
slot.position.set(1.5, 0.02, 3.15 + di * 0.07);
scene.add(slot);
}

// Bollard moved far left so it doesn't block PARIS sign
var bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.5, 8), pipeMat);
bollard.position.set(-11, 0.25, 3.5);
scene.add(bollard);
var bollardTop = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 4), pipeMat);
bollardTop.position.set(-11, 0.52, 3.5);
scene.add(bollardTop);

// Window condensation drips (subtle wet streaks below some upper windows)
var dripMat = new THREE.MeshStandardMaterial({ color: 0x5a3a28, roughness: 0.4, metalness: 0.1, transparent: true, opacity: 0.3 });
// Drips below 1st floor windows (post-rain moisture)
placeMesh(pub, new THREE.BoxGeometry(0.03, 0.4, 0.01), dripMat, -1.6, 3.8, 0.12);
placeMesh(pub, new THREE.BoxGeometry(0.02, 0.35, 0.01), dripMat, 0.7, 3.85, 0.12);
placeMesh(pub, new THREE.BoxGeometry(0.025, 0.45, 0.01), dripMat, 2.9, 3.75, 0.12);
// Drips below 2nd floor windows
placeMesh(pub, new THREE.BoxGeometry(0.02, 0.3, 0.01), dripMat, -0.5, 7.2, 0.12);
placeMesh(pub, new THREE.BoxGeometry(0.03, 0.25, 0.01), dripMat, 1.4, 7.25, 0.12);

// Cigarette butt litter near doorstep (tiny details for realism)
var buttMat = new THREE.MeshStandardMaterial({ color: 0xd8d0b8, roughness: 0.9 });
for (var ci = 0; ci < 4; ci++) {
var butt = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.04, 4), buttMat);
butt.rotation.z = Math.PI / 2;
butt.rotation.y = Math.random() * Math.PI;
butt.position.set(-0.5 + (Math.random() - 0.5) * 0.8, 0.01, 1.6 + Math.random() * 0.5);
scene.add(butt);
}

// Wet puddle highlights (small reflective patches on pavement — post-rain)
var puddleMat = new THREE.MeshStandardMaterial({ color: 0x0a0a18, roughness: 0.05, metalness: 0.9, transparent: true, opacity: 0.25 });
var puddle1 = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), puddleMat);
puddle1.rotation.x = -Math.PI / 2; puddle1.position.set(-2, 0.012, 4);
scene.add(puddle1);
var puddle2 = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.3), puddleMat);
puddle2.rotation.x = -Math.PI / 2; puddle2.position.set(3.5, 0.012, 3.8);
scene.add(puddle2);
var puddle3 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), puddleMat);
puddle3.rotation.x = -Math.PI / 2; puddle3.position.set(0.5, 0.012, 5.5);
scene.add(puddle3);

// ---- INTERIOR GLOW ----
var pubGlow = new THREE.PointLight(0xffd080, 0.9, 8);
pubGlow.position.set(0.5, 1.5, 2);
pub.add(pubGlow);
var pubGlow2 = new THREE.PointLight(0xffd060, 0.4, 6);
pubGlow2.position.set(-1.5, 1.5, 1.5);
pub.add(pubGlow2);
var pubGlow3 = new THREE.PointLight(0xffc850, 0.3, 5);
pubGlow3.position.set(2.5, 1.5, 1.5);
pub.add(pubGlow3);
var doorLight = new THREE.PointLight(0xc89030, 0.5, 5);
doorLight.position.set(-1.1, 2, 1);
pub.add(doorLight);

// Warm light spill on pavement
var spillLight = new THREE.PointLight(0xffc060, 0.25, 4);
spillLight.position.set(0.5, 0.3, 2.5);
pub.add(spillLight);

scene.add(pub);

// ============================================================
// NEIGHBOURING BUILDINGS (enriched)
// ============================================================

// --- LEFT: White/cream Georgian building ---
var hasStucco = !!(window.dssScene && window.dssScene.makeWeatheredStucco);
var leftBuilding = new THREE.Group();
var leftBody = new THREE.Mesh(new THREE.BoxGeometry(5, 15, 7),
hasStucco ? window.dssScene.makeWeatheredStucco({ baseColor: 0xe0d8c8, repeat: [1.5, 3] })
: new THREE.MeshStandardMaterial({ color: 0xe0d8c8, roughness: 0.8 }));
leftBody.position.set(-6, 7.5, -3.5);
leftBuilding.add(leftBody);
// Facade detail panel (extended 0.3 rightward to overlap pub edge and hide seam)
placeMesh(leftBuilding, new THREE.BoxGeometry(5.3, 15, 0.05),
hasStucco ? window.dssScene.makeWeatheredStucco({ baseColor: 0xd8d0c0, repeat: [1.5, 3] })
: new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.82 }), -6.0, 7.5, 0.02);
// Windows with full sash detail and warm glow
// Fixed pattern: no Math.random() — consistent between loads
var leftLitPattern = [
[true, false],   // row 0 (lowest) — one lit, one dark
[true, true],    // row 1 — both lit
[false, true],   // row 2 — one dark, one lit
[false, false]   // row 3 (top) — both dark
];
for (var row = 0; row < 4; row++) {
for (var col = 0; col < 2; col++) {
var lwx = -5 - col * 1.6;
var lwy = 3 + row * 3;
var lLit = leftLitPattern[row][col];
// Brick reveal (recessed surround)
placeMesh(leftBuilding, new THREE.BoxGeometry(0.95, 1.55, 0.04),
new THREE.MeshStandardMaterial({ color: 0xb0a898, roughness: 0.9 }), lwx, lwy, 0.02);
// Outer frame
placeMesh(leftBuilding, new THREE.BoxGeometry(0.88, 1.48, 0.06), windowFrame, lwx, lwy, 0.04);
// Inner frame
placeMesh(leftBuilding, new THREE.BoxGeometry(0.78, 1.38, 0.04), windowFrame, lwx, lwy, 0.06);
// Glass — painted dressed window. z=0.085: the inner frame box's front
// face reaches 0.08, so glass any deeper is buried inside it and never shows
placeMesh(leftBuilding, new THREE.PlaneGeometry(0.7, 1.3),
new THREE.MeshBasicMaterial({ map: makeUpperWindowTex(lLit, (row + col * 2) % 3, (row * 2 + col) % fhCurtainCols.length) }),
lwx, lwy, 0.085);
// Inner glow behind lit windows
if (lLit) {
placeMesh(leftBuilding, new THREE.PlaneGeometry(0.55, 1.0),
new THREE.MeshBasicMaterial({ color: 0xffe0a0, transparent: true, opacity: 0.35 }),
lwx, lwy, 0.05);
}
// Sash bar (horizontal divider — the sash window split)
placeMesh(leftBuilding, new THREE.BoxGeometry(0.78, 0.04, 0.04), windowFrame, lwx, lwy + 0.08, 0.08);
// Vertical glazing bars (6-over-6 pane style)
placeMesh(leftBuilding, new THREE.BoxGeometry(0.02, 1.3, 0.02), windowFrame, lwx - 0.17, lwy, 0.09);
placeMesh(leftBuilding, new THREE.BoxGeometry(0.02, 1.3, 0.02), windowFrame, lwx + 0.17, lwy, 0.09);
// Horizontal glazing bars
placeMesh(leftBuilding, new THREE.BoxGeometry(0.7, 0.02, 0.02), windowFrame, lwx, lwy + 0.35, 0.09);
placeMesh(leftBuilding, new THREE.BoxGeometry(0.7, 0.02, 0.02), windowFrame, lwx, lwy - 0.35, 0.09);
placeMesh(leftBuilding, new THREE.BoxGeometry(0.7, 0.015, 0.02), windowFrame, lwx, lwy + 0.55, 0.09);
placeMesh(leftBuilding, new THREE.BoxGeometry(0.7, 0.015, 0.02), windowFrame, lwx, lwy - 0.55, 0.09);
// Stone sill (projecting)
placeMesh(leftBuilding, new THREE.BoxGeometry(1.0, 0.07, 0.16), sillMat, lwx, lwy - 0.72, 0.1);
// Drip edge under sill
placeMesh(leftBuilding, new THREE.BoxGeometry(1.02, 0.02, 0.03), sillMat, lwx, lwy - 0.78, 0.15);
// Lintel
placeMesh(leftBuilding, new THREE.BoxGeometry(0.98, 0.1, 0.05), sillMat, lwx, lwy + 0.76, 0.06);
}
}
// String courses
placeMesh(leftBuilding, new THREE.BoxGeometry(5.1, 0.08, 0.1), whiteTrim, -6, 3.6, 0.1);
placeMesh(leftBuilding, new THREE.BoxGeometry(5.1, 0.08, 0.1), whiteTrim, -6, 6.6, 0.1);
placeMesh(leftBuilding, new THREE.BoxGeometry(5.1, 0.08, 0.1), whiteTrim, -6, 9.6, 0.1);
// Cornice
placeMesh(leftBuilding, new THREE.BoxGeometry(5.15, 0.18, 0.35),
new THREE.MeshStandardMaterial({ color: 0xd0c8b8, roughness: 0.7 }), -6, 15.05, 0.18);
// Shop front with signage
var leftShop = new THREE.MeshStandardMaterial({ color: 0x2a3a2a, roughness: 0.8 });
placeMesh(leftBuilding, new THREE.BoxGeometry(5.3, 3.2, 0.3), leftShop, -6, 1.6, 0.45);
// Shop fascia
var leftFascia = makeCanvasTexture(256, 48, function(cx, w, h) {
cx.fillStyle = '#2a3a2a'; cx.fillRect(0, 0, w, h);
cx.fillStyle = '#e8dfc0'; cx.font = 'bold 32px Georgia'; cx.textAlign = 'center';
cx.fillText('PARIS', w / 2, 36);
});
placeMesh(leftBuilding, new THREE.PlaneGeometry(4.5, 0.6),
new THREE.MeshBasicMaterial({ map: leftFascia }), -6, 3.0, 0.65);
// Shop fascia light (small warm spotlight illuminating the PARIS sign)
var parisLight = new THREE.PointLight(0xffd080, 0.4, 6);
parisLight.position.set(-6, 3.6, 1.5);
scene.add(parisLight);
// Shop windows — closed for the night, blinds and dark drapes behind the glass
var swStyle = 0;
for (var swx = -7.2; swx <= -4.8; swx += 1.2) {
placeMesh(leftBuilding, new THREE.PlaneGeometry(0.9, 1.8),
(window.dssScene && window.dssScene.makeDressedWindow)
? window.dssScene.makeDressedWindow(false, swStyle % 2 === 0 ? 1 : 0, swStyle)
: new THREE.MeshBasicMaterial({ color: 0x223322, transparent: true, opacity: 0.25 }), swx, 1.6, 0.62);
placeMesh(leftBuilding, new THREE.BoxGeometry(0.04, 1.8, 0.03), woodMat, swx + 0.45, 1.6, 0.63);
swStyle++;
}
// Drainpipe
// Drainpipe moved to far edge of left building so it doesn't block PARIS sign
placeMesh(leftBuilding, new THREE.CylinderGeometry(0.035, 0.035, 15, 6), pipeMat, -8.2, 7.5, 0.2);
scene.add(leftBuilding);

var farLeft = new THREE.Mesh(new THREE.BoxGeometry(6, 14, 7),
hasStucco ? window.dssScene.makeWeatheredStucco({ baseColor: 0xc0b898, repeat: [1.8, 3] })
: new THREE.MeshStandardMaterial({ color: 0xc0b898, roughness: 0.9 }));
farLeft.position.set(-11, 7, -3.5);
scene.add(farLeft);
// Far left windows — some lit, with frames
var farLeftLit = [true, false, true];
for (var flr = 0; flr < 3; flr++) {
var flwx = -9.5;
var flwy = 4 + flr * 3;
var flLit = farLeftLit[flr];
// Frame
placeMesh(scene, new THREE.BoxGeometry(0.85, 1.35, 0.04),
new THREE.MeshStandardMaterial({ color: 0xd0c8b8, roughness: 0.7 }), flwx, flwy, 0.01);
// Glass — painted dressed window. z=0.035: clear of the frame box front at 0.03
placeMesh(scene, new THREE.PlaneGeometry(0.7, 1.2),
new THREE.MeshBasicMaterial({ map: makeUpperWindowTex(flLit, flr % 3, (flr + 1) % fhCurtainCols.length) }),
flwx, flwy, 0.035);
// Sash bar
placeMesh(scene, new THREE.BoxGeometry(0.72, 0.03, 0.02),
new THREE.MeshStandardMaterial({ color: 0xd0c8b8, roughness: 0.6 }), flwx, flwy + 0.05, 0.03);
// Vertical bar
placeMesh(scene, new THREE.BoxGeometry(0.02, 1.2, 0.02),
new THREE.MeshStandardMaterial({ color: 0xd0c8b8, roughness: 0.6 }), flwx, flwy, 0.03);
// Sill
placeMesh(scene, new THREE.BoxGeometry(0.9, 0.05, 0.1), sillMat, flwx, flwy - 0.64, 0.05);
}

// --- RIGHT: Mixed shops (enriched) ---
var rightBuilding = new THREE.Group();
var rightBody = new THREE.Mesh(new THREE.BoxGeometry(5, 14, 7),
hasToolkit ? window.dssScene.makeGrimyBrick({ baseColor: 0x8a6858, repeat: [1.6, 4] })
: new THREE.MeshStandardMaterial({ color: 0x9a7868, roughness: 0.85 }));
rightBody.position.set(7, 7, -3.5);
rightBuilding.add(rightBody);
// Right building windows — detailed sash windows with warm glow
var rightLitPattern = [
[true, true],    // row 0 (lowest) — both lit
[true, false],   // row 1 — one lit
[false, true]    // row 2 (top) — one lit
];
for (var row = 0; row < 3; row++) {
for (var col = 0; col < 2; col++) {
var rwx = 5.5 + col * 1.8;
var rwy = 4 + row * 3.2;
var rLit = rightLitPattern[row][col];
// Brick reveal
placeMesh(rightBuilding, new THREE.BoxGeometry(0.95, 1.55, 0.04),
new THREE.MeshStandardMaterial({ color: 0x7a5848, roughness: 0.9 }), rwx, rwy, 0.02);
// Outer frame
placeMesh(rightBuilding, new THREE.BoxGeometry(0.88, 1.48, 0.06), windowFrame, rwx, rwy, 0.04);
// Inner frame
placeMesh(rightBuilding, new THREE.BoxGeometry(0.78, 1.38, 0.04), windowFrame, rwx, rwy, 0.06);
// Glass
// z=0.085: clear of the inner frame box front at 0.08, which buries anything deeper
placeMesh(rightBuilding, new THREE.PlaneGeometry(0.7, 1.3),
new THREE.MeshBasicMaterial({ map: makeUpperWindowTex(rLit, (row * 2 + col) % 3, (row + col * 3) % fhCurtainCols.length) }),
rwx, rwy, 0.085);
// Inner glow
if (rLit) {
placeMesh(rightBuilding, new THREE.PlaneGeometry(0.55, 1.0),
new THREE.MeshBasicMaterial({ color: 0xffe0a0, transparent: true, opacity: 0.3 }),
rwx, rwy, 0.05);
}
// Sash bar
placeMesh(rightBuilding, new THREE.BoxGeometry(0.78, 0.04, 0.04), windowFrame, rwx, rwy + 0.08, 0.08);
// Vertical glazing bars
placeMesh(rightBuilding, new THREE.BoxGeometry(0.02, 1.3, 0.02), windowFrame, rwx - 0.17, rwy, 0.09);
placeMesh(rightBuilding, new THREE.BoxGeometry(0.02, 1.3, 0.02), windowFrame, rwx + 0.17, rwy, 0.09);
// Horizontal glazing bars
placeMesh(rightBuilding, new THREE.BoxGeometry(0.7, 0.02, 0.02), windowFrame, rwx, rwy + 0.35, 0.09);
placeMesh(rightBuilding, new THREE.BoxGeometry(0.7, 0.02, 0.02), windowFrame, rwx, rwy - 0.35, 0.09);
placeMesh(rightBuilding, new THREE.BoxGeometry(0.7, 0.015, 0.02), windowFrame, rwx, rwy + 0.55, 0.09);
placeMesh(rightBuilding, new THREE.BoxGeometry(0.7, 0.015, 0.02), windowFrame, rwx, rwy - 0.55, 0.09);
// Stone sill
placeMesh(rightBuilding, new THREE.BoxGeometry(1.0, 0.07, 0.14), sillMat, rwx, rwy - 0.72, 0.1);
placeMesh(rightBuilding, new THREE.BoxGeometry(1.02, 0.02, 0.03), sillMat, rwx, rwy - 0.78, 0.13);
// Lintel
placeMesh(rightBuilding, new THREE.BoxGeometry(0.98, 0.08, 0.04),
new THREE.MeshStandardMaterial({ color: 0x8a6858, roughness: 0.7 }), rwx, rwy + 0.76, 0.06);
}
}
// Shop front
var rightShopMat = new THREE.MeshStandardMaterial({ color: 0x3a2a28, roughness: 0.8 });
placeMesh(rightBuilding, new THREE.BoxGeometry(5, 3.2, 0.3), rightShopMat, 7, 1.6, 0.45);
// Right shop fascia
var rightFascia = makeCanvasTexture(256, 48, function(cx, w, h) {
cx.fillStyle = '#3a2a28'; cx.fillRect(0, 0, w, h);
cx.fillStyle = '#e0d0a0'; cx.font = 'bold 30px Georgia'; cx.textAlign = 'center';
cx.fillText('ESSEX', w / 2, 36);
});
placeMesh(rightBuilding, new THREE.PlaneGeometry(4.0, 0.55),
new THREE.MeshBasicMaterial({ map: rightFascia }), 7, 3.0, 0.62);
// Shop fascia light
var essexLight = new THREE.PointLight(0xffd080, 0.3, 5);
essexLight.position.set(7, 3.6, 1.5);
scene.add(essexLight);
// Shop windows — someone still in: one behind a half blind, one behind nets
placeMesh(rightBuilding, new THREE.PlaneGeometry(1.8, 2.0),
(window.dssScene && window.dssScene.makeDressedWindow)
? window.dssScene.makeDressedWindow(true, 1, 0)
: new THREE.MeshBasicMaterial({ color: 0xffd699, transparent: true, opacity: 0.15 }), 6, 1.5, 0.62);
placeMesh(rightBuilding, new THREE.PlaneGeometry(1.8, 2.0),
(window.dssScene && window.dssScene.makeDressedWindow)
? window.dssScene.makeDressedWindow(true, 2, 1)
: new THREE.MeshBasicMaterial({ color: 0xffd699, transparent: true, opacity: 0.12 }), 8, 1.5, 0.62);
// Cornice
placeMesh(rightBuilding, new THREE.BoxGeometry(5.1, 0.12, 0.25),
new THREE.MeshStandardMaterial({ color: 0x8a6858, roughness: 0.8 }), 7, 14, 0.12);
// Drainpipe
placeMesh(rightBuilding, new THREE.CylinderGeometry(0.035, 0.035, 14, 6), pipeMat, 9.4, 7, 0.15);
scene.add(rightBuilding);

var farRight = new THREE.Mesh(new THREE.BoxGeometry(6, 13, 7),
new THREE.MeshStandardMaterial({ color: 0x8a6850, roughness: 0.9 }));
farRight.position.set(12.5, 6.5, -3.5);
scene.add(farRight);

// Opposite side buildings
var oppSide = new THREE.Mesh(new THREE.BoxGeometry(30, 12, 4),
new THREE.MeshStandardMaterial({ color: 0x504838, roughness: 0.9 }));
oppSide.position.set(0, 6, 22);
scene.add(oppSide);
// Lit windows opposite — fixed positions, some glowing
var oppWinPositions = [
{ x: -6, y: 5, lit: true }, { x: -6, y: 8, lit: false },
{ x: -2.5, y: 4.5, lit: true }, { x: -2.5, y: 7.5, lit: true },
{ x: 1, y: 5, lit: false }, { x: 1, y: 8, lit: true },
{ x: 4.5, y: 4.5, lit: true }, { x: 4.5, y: 7.5, lit: false },
{ x: 8, y: 5, lit: false }, { x: 8, y: 8, lit: true }
];
for (var owi = 0; owi < oppWinPositions.length; owi++) {
var ow = oppWinPositions[owi];
placeMesh(scene, new THREE.PlaneGeometry(0.8, 1.2),
new THREE.MeshBasicMaterial({ color: ow.lit ? 0xffcc66 : 0x2a3a55, transparent: true, opacity: ow.lit ? 0.12 : 0.04 }),
ow.x, ow.y, 19.98);
}

// ============================================================
// PAVEMENTS & STREET DETAIL
// ============================================================
var kerbMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.8 });
// The raised aprons ARE the pavement the camera sees — slab texture, ~0.8m slabs
var fhPaveTex2 = fhPaveTex.clone();
fhPaveTex2.repeat.set(9, 0.75);
fhPaveTex2.needsUpdate = true;
var paveMat2 = new THREE.MeshStandardMaterial({ map: fhPaveTex2, roughness: 0.85 });

var pubPave = new THREE.Mesh(new THREE.BoxGeometry(30, 0.15, 3), paveMat2);
pubPave.position.set(0, 0.075, 2);
pubPave.receiveShadow = true;
scene.add(pubPave);
var pubKerb = new THREE.Mesh(new THREE.BoxGeometry(30, 0.18, 0.12), kerbMat);
pubKerb.position.set(0, 0.09, 3.5);
scene.add(pubKerb);

// Paving slab lines (grid pattern on pavement)
for (var psx = -8; psx < 12; psx += 0.8) {
var paveLine = new THREE.Mesh(new THREE.PlaneGeometry(0.015, 3),
new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9, transparent: true, opacity: 0.3 }));
paveLine.rotation.x = -Math.PI / 2;
paveLine.position.set(psx, 0.16, 2);
scene.add(paveLine);
}
for (var psz = 0.5; psz < 3.5; psz += 0.6) {
var paveLineH = new THREE.Mesh(new THREE.PlaneGeometry(30, 0.015),
new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9, transparent: true, opacity: 0.2 }));
paveLineH.rotation.x = -Math.PI / 2;
paveLineH.position.set(0, 0.16, psz);
scene.add(paveLineH);
}

var oppPave = new THREE.Mesh(new THREE.BoxGeometry(30, 0.15, 3), paveMat2);
oppPave.position.set(0, 0.075, 11);
scene.add(oppPave);
var oppKerb = new THREE.Mesh(new THREE.BoxGeometry(30, 0.18, 0.12), kerbMat);
oppKerb.position.set(0, 0.09, 9.5);
scene.add(oppKerb);

// Puddles (reflective)
var puddleMat = new THREE.MeshStandardMaterial({
color: 0x1a1a2a, roughness: 0.1, metalness: 0.6, transparent: true, opacity: 0.3
});
var puddlePos = [[1, 5, 2.0, 1.2], [-2, 6, 1.5, 0.8], [3, 7.5, 1.8, 1.0], [-1, 9, 2.2, 1.3], [5, 6, 1.2, 0.6], [-3, 8, 1.0, 0.7]];
for (var pi = 0; pi < puddlePos.length; pi++) {
var pp = puddlePos[pi];
var puddle = new THREE.Mesh(new THREE.PlaneGeometry(pp[2], pp[3]), puddleMat);
puddle.rotation.x = -Math.PI / 2;
puddle.position.set(pp[0], 0.02, pp[1]);
scene.add(puddle);
}

// Drain grate
var grateMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6, metalness: 0.3 });
var grate = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.3), grateMat);
grate.position.set(0, 0.08, 3.3);
scene.add(grate);
// Grate bars
for (var gbi = -0.15; gbi <= 0.15; gbi += 0.06) {
placeMesh(scene, new THREE.BoxGeometry(0.35, 0.025, 0.015), grateMat, 0, 0.09, 3.3 + gbi);
}

// Manhole cover
var manhole = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5),
new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.3 }));
manhole.rotation.x = -Math.PI / 2;
manhole.position.set(2, 0.015, 6.5);
scene.add(manhole);

// ---- STREET FURNITURE ----
// Bollard near pub
var bollardMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6, metalness: 0.2 });
placeMesh(scene, new THREE.CylinderGeometry(0.06, 0.08, 0.7, 8), bollardMat, 2.5, 0.35, 3.2);
placeMesh(scene, new THREE.SphereGeometry(0.07, 6, 6), bollardMat, 2.5, 0.72, 3.2);

// Dustbin / rubbish bin
var binMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.7 });
placeMesh(scene, new THREE.CylinderGeometry(0.2, 0.18, 0.6, 8), binMat, 5.5, 0.3, 1.5);
placeMesh(scene, new THREE.CylinderGeometry(0.22, 0.22, 0.04, 8), binMat, 5.5, 0.62, 1.5);

// Post box (red, classic British)
var postBoxMat = new THREE.MeshStandardMaterial({ color: 0x8a1a1a, roughness: 0.6 });
placeMesh(scene, new THREE.CylinderGeometry(0.15, 0.15, 1.0, 8), postBoxMat, -10, 0.5, 3.0);
placeMesh(scene, new THREE.CylinderGeometry(0.17, 0.15, 0.15, 8), postBoxMat, -10, 1.05, 3.0);
// Post slot
placeMesh(scene, new THREE.BoxGeometry(0.15, 0.02, 0.04),
new THREE.MeshStandardMaterial({ color: 0x0a0a0a }), -10, 0.8, 3.16);

// ============================================================
// STREETLAMPS
// ============================================================
var streetLampLights = [];

function createLamp(x, z) {
var g = new THREE.Group();
var castIron = new THREE.MeshStandardMaterial({ color: 0x1a1a18, roughness: 0.7, metalness: 0.4 });
var warmIron = new THREE.MeshStandardMaterial({ color: 0x2a2520, roughness: 0.6, metalness: 0.3 });

// Victorian fluted column — tapers elegantly
placeMesh(g, new THREE.CylinderGeometry(0.035, 0.06, 4.2, 8), castIron, 0, 2.1, 0);
// Decorative bulge at mid-height
placeMesh(g, new THREE.CylinderGeometry(0.065, 0.065, 0.12, 8), warmIron, 0, 2.8, 0);
// Ornate base plinth (stepped)
placeMesh(g, new THREE.CylinderGeometry(0.12, 0.16, 0.15, 8), castIron, 0, 0.075, 0);
placeMesh(g, new THREE.CylinderGeometry(0.1, 0.13, 0.1, 8), castIron, 0, 0.2, 0);
placeMesh(g, new THREE.BoxGeometry(0.35, 0.06, 0.35), castIron, 0, 0.0, 0);
// Collar below lantern
placeMesh(g, new THREE.CylinderGeometry(0.055, 0.04, 0.08, 8), warmIron, 0, 4.24, 0);
// Scroll brackets (4 curved supports meeting the lantern)
for (var sb = 0; sb < 4; sb++) {
var ang = sb * Math.PI / 2;
var sx = Math.cos(ang) * 0.07;
var sz = Math.sin(ang) * 0.07;
placeMesh(g, new THREE.BoxGeometry(0.015, 0.25, 0.015), warmIron, sx, 4.4, sz);
}

// Lantern — hexagonal gas lamp housing
placeMesh(g, new THREE.CylinderGeometry(0.1, 0.12, 0.04, 6), castIron, 0, 4.28, 0);  // base plate
placeMesh(g, new THREE.CylinderGeometry(0.1, 0.1, 0.04, 6), castIron, 0, 4.72, 0);   // top plate
// Lantern frame bars (6 vertical bars)
for (var lb = 0; lb < 6; lb++) {
var la = lb * Math.PI / 3;
var lbx = Math.cos(la) * 0.1;
var lbz = Math.sin(la) * 0.1;
placeMesh(g, new THREE.BoxGeometry(0.015, 0.42, 0.015), castIron, lbx, 4.5, lbz);
}
// Crown / finial on top
placeMesh(g, new THREE.CylinderGeometry(0.0, 0.06, 0.12, 6), castIron, 0, 4.82, 0);
placeMesh(g, new THREE.SphereGeometry(0.025, 6, 4), castIron, 0, 4.9, 0);

// Warm gas flame glow inside lantern (visible through glass)
var gasGlow = new THREE.MeshBasicMaterial({ color: 0xffcc66, transparent: true, opacity: 0.92 }); // warmer + brighter (was 0xffdd88 / 0.7) so the flame reads amber, not pale
// Glass panels (6 sides, warm amber)
for (var gp = 0; gp < 6; gp++) {
var ga = gp * Math.PI / 3 + Math.PI / 6;
var gpx = Math.cos(ga) * 0.085;
var gpz = Math.sin(ga) * 0.085;
var glassPanel = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.36), gasGlow);
glassPanel.position.set(gpx, 4.5, gpz);
glassPanel.rotation.y = -ga + Math.PI / 2;
g.add(glassPanel);
}
// Inner flame (tiny bright core)
var flameMat = new THREE.MeshBasicMaterial({ color: 0xffeedd });
placeMesh(g, new THREE.SphereGeometry(0.02, 4, 4), flameMat, 0, 4.5, 0);

// Warm gas light — pools of amber on the wet street
// 2026-10-14 (speed, Sam: yes): one light a lamp, not two, and no cube shadow (19 point lights, four of them
// shadowing, made this the slowest approach); a little brighter to stand for the fill light it absorbs
var light = new THREE.PointLight(0xffcc70, 1.05, 18);
light.position.set(0, 4.5, 0);
light.castShadow = false;
g.add(light);
streetLampLights.push(light);

// Atmospheric halo — large soft glow around the lamp
var haloTex = makeCanvasTexture(128, 128, function(cx, w, h) {
var grad = cx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
grad.addColorStop(0, 'rgba(255, 210, 120, 0.6)');
grad.addColorStop(0.15, 'rgba(255, 190, 90, 0.3)');
grad.addColorStop(0.4, 'rgba(200, 150, 60, 0.08)');
grad.addColorStop(1, 'rgba(150, 100, 40, 0)');
cx.fillStyle = grad; cx.fillRect(0, 0, w, h);
});
var halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, transparent: true, opacity: 0.85 })); // was 0.6
halo.position.set(0, 4.5, 0);
halo.scale.set(5, 5, 1);
g.add(halo);
// The lantern had glowing glass but NO light — nothing kissed the post,
// the flags, or the pavement. A modest gas-warm point fixes that.
// (2026-10-14 speed: this second light at the same spot is folded into the one above)

// Secondary smaller halo (misty diffusion — post-rain moisture in air)
var mistTex = makeCanvasTexture(64, 64, function(cx, w, h) {
var grad = cx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
grad.addColorStop(0, 'rgba(255, 220, 160, 0.15)');
grad.addColorStop(0.5, 'rgba(200, 170, 120, 0.05)');
grad.addColorStop(1, 'rgba(150, 120, 80, 0)');
cx.fillStyle = grad; cx.fillRect(0, 0, w, h);
});
var mist = new THREE.Sprite(new THREE.SpriteMaterial({ map: mistTex, transparent: true, opacity: 0.4 }));
mist.position.set(0, 3.5, 0);
mist.scale.set(8, 6, 1);
g.add(mist);

g.position.set(x, 0, z);
scene.add(g);
}

// Front street lamps moved far out so they don't block shop signs
createLamp(-14, 3.5);
createLamp(13, 3.5);
createLamp(3, 12);
createLamp(-10, 12);

// ---- THE GREEN FAIRY ----
// A little emerald fairy-moth flitting about the centre lamp's lantern
var fairyTex = makeCanvasTexture(64, 64, function(cx, w, h) {
// Soft emerald halo
var fg = cx.createRadialGradient(w / 2, h / 2, 1, w / 2, h / 2, w / 2);
fg.addColorStop(0, 'rgba(190, 255, 210, 0.95)');
fg.addColorStop(0.25, 'rgba(110, 240, 160, 0.55)');
fg.addColorStop(0.6, 'rgba(60, 190, 110, 0.18)');
fg.addColorStop(1, 'rgba(30, 140, 80, 0)');
cx.fillStyle = fg; cx.fillRect(0, 0, w, h);
// Wings — two pairs, pale luminous green
cx.fillStyle = 'rgba(180, 255, 205, 0.75)';
cx.save(); cx.translate(w / 2, h / 2);
cx.rotate(-0.6);
cx.beginPath(); cx.ellipse(-7, -4, 9, 4, 0, 0, Math.PI * 2); cx.fill();
cx.rotate(1.2);
cx.beginPath(); cx.ellipse(7, -4, 9, 4, 0, 0, Math.PI * 2); cx.fill();
cx.restore();
cx.fillStyle = 'rgba(150, 240, 180, 0.6)';
cx.save(); cx.translate(w / 2, h / 2);
cx.rotate(-0.25);
cx.beginPath(); cx.ellipse(-5, 4, 6, 3, 0, 0, Math.PI * 2); cx.fill();
cx.rotate(0.5);
cx.beginPath(); cx.ellipse(5, 4, 6, 3, 0, 0, Math.PI * 2); cx.fill();
cx.restore();
// Body — slender, bright
cx.fillStyle = 'rgba(230, 255, 235, 0.98)';
cx.beginPath(); cx.ellipse(w / 2, h / 2 + 1, 1.8, 6.5, 0, 0, Math.PI * 2); cx.fill();
// Head
cx.beginPath(); cx.arc(w / 2, h / 2 - 6.5, 2, 0, Math.PI * 2); cx.fill();
});
var fairyMat = new THREE.SpriteMaterial({ map: fairyTex, transparent: true, opacity: 0.95, depthWrite: false });
var greenFairy = new THREE.Sprite(fairyMat);
greenFairy.scale.set(0.17, 0.17, 1);
greenFairy.position.set(3, 4.5, 12);
scene.add(greenFairy);
// The emerald light she carries — a faint green kiss on the lantern ironwork
var fairyLight = new THREE.PointLight(0x50e890, 0.35, 2.2);
fairyLight.position.copy(greenFairy.position);
scene.add(fairyLight);

// ============================================================
// SILHOUETTES IN PUB WINDOWS
// ============================================================
var silhouettes = [];

function makeSilhouetteTex(seed) {
return makeCanvasTexture(256, 256, function(cx, w, h) {
var bg = cx.createRadialGradient(w / 2, h * 0.4, 10, w / 2, h * 0.5, w);
bg.addColorStop(0, 'rgba(200, 140, 50, 0.5)');
bg.addColorStop(0.5, 'rgba(160, 100, 30, 0.3)');
bg.addColorStop(1, 'rgba(80, 50, 15, 0.15)');
cx.fillStyle = bg; cx.fillRect(0, 0, w, h);

var figureCount = 1 + Math.floor(seed * 2.5);
for (var f = 0; f < figureCount; f++) {
var fx = (w / (figureCount + 1)) * (f + 1);
var baseY = h * 0.98;
var headR = 14 + seed * 6;
var shoulderW = 35 + seed * 15;

cx.fillStyle = 'rgba(10, 5, 0, 0.85)';
// Body
cx.beginPath();
cx.moveTo(fx - shoulderW / 2, baseY - h * 0.35);
cx.lineTo(fx + shoulderW / 2, baseY - h * 0.35);
cx.lineTo(fx + shoulderW / 2 + 8, baseY);
cx.lineTo(fx - shoulderW / 2 - 8, baseY);
cx.closePath(); cx.fill();
// Shoulders
cx.beginPath();
cx.ellipse(fx, baseY - h * 0.38, shoulderW / 2 + 5, 14, 0, 0, Math.PI, true);
cx.fill();
// Neck
cx.fillRect(fx - 6, baseY - h * 0.48, 12, h * 0.1);
// Head
cx.beginPath();
cx.arc(fx + (f - 1) * 4, baseY - h * 0.52, headR, 0, Math.PI * 2);
cx.fill();

// Raised arm with glass (some figures)
if ((seed > 0.4 && f === 0) || (seed > 0.6 && f === 1)) {
cx.fillStyle = 'rgba(10, 5, 0, 0.8)';
cx.beginPath();
cx.moveTo(fx + shoulderW / 2, baseY - h * 0.38);
cx.lineTo(fx + shoulderW / 2 + 12, baseY - h * 0.6);
cx.lineTo(fx + shoulderW / 2 + 22, baseY - h * 0.6);
cx.lineTo(fx + shoulderW / 2 + 10, baseY - h * 0.35);
cx.closePath(); cx.fill();
// Glass
cx.fillRect(fx + shoulderW / 2 + 8, baseY - h * 0.7, 16, 22);
cx.fillStyle = 'rgba(180, 130, 40, 0.4)';
cx.fillRect(fx + shoulderW / 2 + 10, baseY - h * 0.68, 12, 14);
}

// Cigarette smoke (some figures)
if (seed > 0.5 && f === figureCount - 1) {
cx.strokeStyle = 'rgba(120, 120, 120, 0.2)';
cx.lineWidth = 2;
cx.beginPath();
cx.moveTo(fx + headR + 5, baseY - h * 0.52);
cx.quadraticCurveTo(fx + headR + 15, baseY - h * 0.6, fx + headR + 10, baseY - h * 0.7);
cx.stroke();
}
}
});
}

// Ground floor silhouettes
var gfWinXs = [-2.2, 0.5, 2.5];
var gfSeeds = [0.7, 0.3, 0.8];
for (var i = 0; i < gfWinXs.length; i++) {
var sTex = makeSilhouetteTex(gfSeeds[i]);
var sMat = new THREE.MeshBasicMaterial({
map: sTex, transparent: true, side: THREE.DoubleSide, depthWrite: false
});
// First bay narrowed to fit beside the moved door; z=0.325 puts the drinkers
// between the painted interior (0.315) and the glass tint (0.335) — the old
// 0.28 was buried inside the frame boxes and never showed.
// Texture cropped to its top 60% so only heads and shoulders show above
// the half-height panelling, matching the real French's windows.
sTex.repeat.set(1, 0.6);
sTex.offset.set(0, 0.4);
var sPlane = new THREE.Mesh(new THREE.PlaneGeometry(i === 0 ? 1.05 : 1.5, 1.3), sMat);
sPlane.position.set(gfWinXs[i], 2.0, 0.325);
pub.add(sPlane);
silhouettes.push({
mesh: sPlane, baseX: gfWinXs[i],
swayPhase: Math.random() * Math.PI * 2,
swaySpeed: 0.3 + Math.random() * 0.4,
swayAmt: 0.015 + Math.random() * 0.02
});
}

// Also add silhouettes in 1st floor windows (upstairs bar)
for (var i = 0; i < 2; i++) {
var upTex = makeSilhouetteTex(0.4 + i * 0.3);
var upMat = new THREE.MeshBasicMaterial({
map: upTex, transparent: true, side: THREE.DoubleSide, depthWrite: false, opacity: 0.6
});
var upPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.5), upMat);
upPlane.position.set(winXs[i + 1], 5.2, 0.12);
pub.add(upPlane);
silhouettes.push({
mesh: upPlane, baseX: winXs[i + 1],
swayPhase: Math.random() * Math.PI * 2,
swaySpeed: 0.2 + Math.random() * 0.3,
swayAmt: 0.01 + Math.random() * 0.015
});
}

// ============================================================
// WALKING FIGURE (distant silhouette crossing the street)
// ============================================================
var walkerTex = makeCanvasTexture(64, 128, function(cx, w, h) {
cx.fillStyle = 'rgba(10, 8, 5, 0.7)';
// Head
cx.beginPath(); cx.arc(w / 2, 20, 8, 0, Math.PI * 2); cx.fill();
// Body
cx.fillRect(w / 2 - 8, 28, 16, 40);
// Legs
cx.fillRect(w / 2 - 8, 68, 7, 35);
cx.fillRect(w / 2 + 1, 68, 7, 35);
// Hat brim
cx.fillRect(w / 2 - 12, 13, 24, 4);
});
var walkerMat = new THREE.MeshBasicMaterial({ map: walkerTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
var walker = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1.2), walkerMat);
walker.position.set(8, 0.6, 7);
scene.add(walker);

// ============================================================
// LIGHTING
// ============================================================
// Gloomy but visible — low ambient with cold moonlight. Moonlight now has
// a properly configured shadow camera so the facade actually casts shadows
// onto the pavement and surrounding surfaces.
scene.add(new THREE.AmbientLight(0x1f1f38, 0.46));
var moonLight = new THREE.DirectionalLight(0x6a78b8, 0.35);
moonLight.position.set(6, 22, 12);
moonLight.target.position.set(-1, 3, 0);
scene.add(moonLight.target);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 2048;
moonLight.shadow.mapSize.height = 2048;
moonLight.shadow.camera.near = 0.5;
moonLight.shadow.camera.far = 60;
moonLight.shadow.camera.left = -20;
moonLight.shadow.camera.right = 20;
moonLight.shadow.camera.top = 20;
moonLight.shadow.camera.bottom = -5;
moonLight.shadow.bias = -0.0008;
moonLight.shadow.normalBias = 0.04;
scene.add(moonLight);

// Cold blue fill — very dim so the moonlight shadows still read
var fillLight = new THREE.DirectionalLight(0x2233aa, 0.04);
fillLight.position.set(-5, 10, -5);
scene.add(fillLight);

// After all geometry is built, enable shadow casting/receiving on every
// solid mesh so the moonlight actually paints shadows on the street.
function enableFhSceneShadows(root) {
  root.traverse(function(obj) {
    if (!(obj instanceof THREE.Mesh)) return;
    var mat = obj.material;
    if (mat && (mat.transparent === true && (mat.opacity || 1) < 0.7)) return;
    obj.receiveShadow = true;
    if (obj.position.y > 0.2 || (obj.geometry && obj.geometry.type !== 'PlaneGeometry')) {
      obj.castShadow = true;
    }
  });
}
setTimeout(function() { enableFhSceneShadows(scene); }, 0);

// ============================================================
// FOG VOLUMES (4 layers)
// ============================================================
var thickFogTex = makeCanvasTexture(128, 128, function(cx, w, h) {
var grad = cx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
grad.addColorStop(0, 'rgba(180, 170, 155, 0.25)');
grad.addColorStop(0.4, 'rgba(150, 140, 130, 0.12)');
grad.addColorStop(1, 'rgba(120, 110, 100, 0)');
cx.fillStyle = grad; cx.fillRect(0, 0, w, h);
});
var thinFogTex = makeCanvasTexture(128, 128, function(cx, w, h) {
var grad = cx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
grad.addColorStop(0, 'rgba(140, 135, 125, 0.15)');
grad.addColorStop(0.6, 'rgba(120, 115, 105, 0.06)');
grad.addColorStop(1, 'rgba(100, 95, 85, 0)');
cx.fillStyle = grad; cx.fillRect(0, 0, w, h);
});
var warmFogTex = makeCanvasTexture(128, 128, function(cx, w, h) {
var grad = cx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
grad.addColorStop(0, 'rgba(200, 160, 100, 0.12)');
grad.addColorStop(0.5, 'rgba(180, 140, 80, 0.05)');
grad.addColorStop(1, 'rgba(150, 120, 60, 0)');
cx.fillStyle = grad; cx.fillRect(0, 0, w, h);
});

var fogSprites = [];

// Layer 1: Ground-hugging fog — much more subtle, placed BEHIND camera (z > 5)
// to avoid passing in front of the pub windows and causing flashing
for (var i = 0; i < 20; i++) {
var fogMat = new THREE.SpriteMaterial({ map: thickFogTex, transparent: true, opacity: 0.06 + Math.random() * 0.06 });
var fogSprite = new THREE.Sprite(fogMat);
// Place behind / to sides — NOT in front of pub windows
var fz = 6 + Math.random() * 20;
fogSprite.position.set(Math.random() * 40 - 15, 0.3 + Math.random() * 1.5, fz);
var s = 5 + Math.random() * 10;
fogSprite.scale.set(s, s * 0.3, 1);
scene.add(fogSprite);
fogSprites.push({ sprite: fogSprite, baseX: fogSprite.position.x, drift: 0.0005 + Math.random() * 0.001, sway: Math.random() * Math.PI * 2, swaySpeed: 0.0005 + Math.random() * 0.001, swayAmt: 0.3 + Math.random() * 0.5 });
}

// Layer 2: Mid-height fog — fewer, further back
for (var i = 0; i < 12; i++) {
var midFogMat = new THREE.SpriteMaterial({ map: thinFogTex, transparent: true, opacity: 0.04 + Math.random() * 0.05 });
var midFog = new THREE.Sprite(midFogMat);
midFog.position.set(Math.random() * 35 - 12, 2 + Math.random() * 5, 8 + Math.random() * 20);
var ms = 6 + Math.random() * 12;
midFog.scale.set(ms, ms * 0.25, 1);
scene.add(midFog);
fogSprites.push({ sprite: midFog, baseX: midFog.position.x, drift: 0.0003 + Math.random() * 0.001, sway: Math.random() * Math.PI * 2, swaySpeed: 0.0004 + Math.random() * 0.001, swayAmt: 0.3 + Math.random() * 0.8 });
}

// Layer 3: Warm tinted fog — only at ground level near pub, very faint
for (var i = 0; i < 6; i++) {
var warmFogMat = new THREE.SpriteMaterial({ map: warmFogTex, transparent: true, opacity: 0.04 + Math.random() * 0.04 });
var warmFog = new THREE.Sprite(warmFogMat);
warmFog.position.set(Math.random() * 8 - 2, 0.3 + Math.random() * 1, 3 + Math.random() * 4);
var ws = 3 + Math.random() * 5;
warmFog.scale.set(ws, ws * 0.2, 1);
scene.add(warmFog);
fogSprites.push({ sprite: warmFog, baseX: warmFog.position.x, drift: 0.0003 + Math.random() * 0.0008, sway: Math.random() * Math.PI * 2, swaySpeed: 0.0005 + Math.random() * 0.001, swayAmt: 0.2 + Math.random() * 0.4 });
}

// Layer 4: High wisps — very faint, background only
for (var i = 0; i < 6; i++) {
var highFogMat = new THREE.SpriteMaterial({ map: thinFogTex, transparent: true, opacity: 0.03 + Math.random() * 0.04 });
var highFog = new THREE.Sprite(highFogMat);
highFog.position.set(Math.random() * 30 - 10, 10 + Math.random() * 6, 10 + Math.random() * 15);
var hs = 8 + Math.random() * 12;
highFog.scale.set(hs, hs * 0.15, 1);
scene.add(highFog);
fogSprites.push({ sprite: highFog, baseX: highFog.position.x, drift: 0.001 + Math.random() * 0.002, sway: Math.random() * Math.PI * 2, swaySpeed: 0.0003 + Math.random() * 0.001, swayAmt: 0.5 + Math.random() * 1.0 });
}

// ============================================================
// FILM GRAIN (animated canvas noise)
// ============================================================
var grainCanvas = document.createElement('canvas');
grainCanvas.width = 256; grainCanvas.height = 256;
var grainCtx = grainCanvas.getContext('2d');
var grainEl = document.getElementById('grain');
grainEl.style.backgroundSize = '256px 256px';
var grainFrame = 0;

function updateGrain() {
if (++grainFrame % 3 !== 0) return; // update every 3rd frame for subtlety
var imgData = grainCtx.createImageData(256, 256);
var d = imgData.data;
for (var i = 0; i < d.length; i += 4) {
var v = Math.random() * 255;
d[i] = d[i+1] = d[i+2] = v;
d[i+3] = 255;
}
grainCtx.putImageData(imgData, 0, 0);
grainEl.style.backgroundImage = 'url(' + grainCanvas.toDataURL() + ')';
}

// ============================================================
// ENHANCED WET REFLECTIONS
// ============================================================
// Add more prominent puddle reflections near the pub
// Broken window colours in the existing wet patch, not another reflection pass.
var fhReflectionTex=makeCanvasTexture(128,256,function(cx,w,h){
  for(var r=0;r<64;r++){
    var v=r/64,envelope=Math.sin(v*Math.PI);
    for(var col=0;col<3;col++){
      var xx=18+col*38+Math.sin(r*.71+col)*3,ww=10+Math.sin(r*1.9+col)*4;
      cx.fillStyle='rgba(232,173,91,'+(envelope*(.12+(r%5)*.035))+')';
      cx.fillRect(xx,v*h,ww,1+(r%3));
    }
  }
});
var reflectMat = new THREE.MeshBasicMaterial({map:fhReflectionTex,color:0xe6c494,transparent:true,opacity:.25,depthWrite:false,blending:THREE.AdditiveBlending});
var bigReflect = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), reflectMat);
bigReflect.rotation.x = -Math.PI / 2;
bigReflect.position.set(0.5, 0.015, 5);
scene.add(bigReflect);

// ============================================================
// ANIMATION LOOP
// ============================================================
// Twenty-four grains of damp air; all but one settle. One returns to the light.
var fhMoteTex=makeCanvasTexture(16,16,function(cx,w,h){var g=cx.createRadialGradient(8,8,0,8,8,8);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.65)');g.addColorStop(1,'rgba(255,255,255,0)');cx.fillStyle=g;cx.fillRect(0,0,w,h);});
var fhMotePos=new Float32Array(24*3),fhMoteBase=new Float32Array(24*3);
for(var mi=0;mi<24;mi++){fhMoteBase[mi*3]=-2.5+Math.random()*6;fhMoteBase[mi*3+1]=.5+Math.random()*4;fhMoteBase[mi*3+2]=2+Math.random()*4;fhMotePos.set(fhMoteBase.subarray(mi*3,mi*3+3),mi*3);}
var fhMoteGeo=new THREE.BufferGeometry();fhMoteGeo.setAttribute('position',new THREE.BufferAttribute(fhMotePos,3));
var fhMotes=new THREE.Points(fhMoteGeo,new THREE.PointsMaterial({map:fhMoteTex,color:0xe3c69b,size:.045,transparent:true,opacity:.3,depthWrite:false}));scene.add(fhMotes);
var clock = new THREE.Clock();
var cameraBase = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
// Camera base already set above

function fhAnimate() {
fhAnimId = requestAnimationFrame(fhAnimate);
var t = fhStill ? 0 : clock.getElapsedTime();

// Film grain — update very infrequently to avoid flashing
if (Math.floor(t * 2) !== Math.floor((t - 0.016) * 2)) {
updateGrain();
}

// Camera is COMPLETELY STATIC — no breathing, no movement
// (Camera movement was causing light angle changes that looked like flashing)

// Fog — completely static (drift was causing flashing as fog crossed windows)
// Fog sprites stay in their initial positions for atmosphere without movement

// Only non-shadow doorway lights breathe, by a few percent over many seconds.
// Keep the camera, fog and shadow lights fixed: no full-scene flashing.
pubGlow.intensity=.9+Math.sin(t*.43)*.018;
doorLight.intensity=.5+Math.sin(t*.43-.8)*.012;
for(var gi=0;gi<fhWindowMats.length;gi++)fhWindowMats[gi].emissiveIntensity=.82+Math.sin(t*.32+gi*.7)*.012;
if(!fhStill){for(var mi=0;mi<24;mi++){var mb=mi*3;fhMotePos[mb]=fhMoteBase[mb]+Math.sin(t*.17+mi)*.09;fhMotePos[mb+1]=.45+((fhMoteBase[mb+1]+(mi===0?1:-1)*t*.065)%4.2+4.2)%4.2;}fhMoteGeo.attributes.position.needsUpdate=true;}

// Silhouettes — completely static (movement was causing flashing)
// They stay in their initial positions

// The Green Fairy — erratic moth-flight around the centre lantern,
// wings shivering, drifting near the glass then darting away
var fairyR = 0.32 + Math.sin(t * 0.23) * 0.14;
greenFairy.position.set(
3 + Math.cos(t * 1.3) * fairyR + Math.sin(t * .79) * 0.05 + Math.sin(t * 1.37) * 0.025,
4.5 + Math.sin(t * 2.1) * 0.26 + Math.sin(t * .89) * 0.04 + Math.cos(t * 1.51) * 0.02,
12 + Math.sin(t * 1.7) * fairyR * 0.8 + Math.cos(t * .93) * 0.04
);
greenFairy.scale.x = 0.17 * (.8 + Math.sin(t * 6) * .15);
greenFairy.material.rotation = Math.sin(t * 1.3) * 0.2;
greenFairy.material.opacity = .84 + Math.sin(t * .7) * .035;
fairyLight.position.copy(greenFairy.position);
fairyLight.intensity = .28 + Math.sin(t * .7) * .018;

// Flag flutter — gentle, post-rain calm
for (var i = 0; i < flagMeshes.length; i++) {
var fm = flagMeshes[i];
fm.mesh.rotation.z = fm.baseRotZ + Math.sin(t * 0.8 + fm.phase) * 0.02;
fm.mesh.rotation.x = -0.3 + Math.sin(t * 0.5 + fm.phase) * 0.01;
}
for (var i = 0; i < bigFlagMeshes.length; i++) {
var bfm = bigFlagMeshes[i];
bfm.mesh.rotation.z = Math.sin(t * 0.6 + bfm.phase) * 0.015;
}

// Walking figure (slower, more contemplative pace)
walker.position.x = 8 - ((t * 0.15) % 20);
if (walker.position.x < -12) walker.position.x = 8;

// Hanging sign — barely moving, damp and heavy
hangSign.rotation.z = Math.sin(t * 0.3) * 0.01;

// A slight ripple within the wet patch; the slab edges stay completely still.
fhReflectionTex.offset.x=Math.sin(t*.27)*.009;
reflectMat.opacity=.25+Math.sin(t*.43-1.4)*.012;

if (typeof dssComposerLocal !== 'undefined' && dssComposerLocal) { dssComposerLocal.render(); } else { renderer.render(scene, camera); }
}

fhAnimate();

// Approach button — fades in after 1.5s
var fhBtn = document.createElement('div');
fhBtn.textContent = 'ENTER THE FRENCH';
fhBtn.style.cssText = [
'position:absolute','bottom:60px','left:50%','transform:translateX(-50%)',
'font:13px \'Courier New\',monospace','color:rgba(200,170,100,0.85)',
'letter-spacing:4px','cursor:pointer','padding:12px 28px',
'border:1px solid rgba(200,170,100,0.3)','background:rgba(0,0,0,0.4)',
'z-index:9003','white-space:nowrap','opacity:0','transition:opacity 1.5s ease'
].join(';');
fhWrap.appendChild(fhBtn);
setTimeout(function() { fhBtn.style.opacity = '1'; }, 1500);

fhBtn.addEventListener('mouseenter', function() {
this.style.color = 'rgba(230,200,120,0.95)';
this.style.borderColor = 'rgba(200,170,100,0.6)';
});
fhBtn.addEventListener('mouseleave', function() {
this.style.color = 'rgba(200,170,100,0.85)';
this.style.borderColor = 'rgba(200,170,100,0.3)';
});

fhBtn.addEventListener('click', function() {
fhWrap.style.transition = 'opacity 1.2s ease';
fhWrap.style.opacity = '0';
setTimeout(function() {
cancelAnimationFrame(fhAnimId);
fhWrap.remove();
var TARGET = 'The French';
var link = document.querySelector('tw-link[passage-name="' + TARGET + '"]');
if (!link) {
var allLinks = document.querySelectorAll('tw-passage tw-link');
for (var i = 0; i < allLinks.length; i++) {
if (allLinks[i].textContent.trim() === '\u00B7') { link = allLinks[i]; break; }
}
}
if (link) {
link.click();
} else {
var storyEl = document.querySelector('tw-story') || document.body;
var injected = document.createElement('tw-link');
injected.setAttribute('passage-name', TARGET);
injected.style.display = 'none';
storyEl.appendChild(injected);
injected.click();
storyEl.removeChild(injected);
}
}, 1200);
});
}

// Watch for fh-container. Cleanup mirrors Pillars/Lackland: when the
// container disappears (passage change), cancel the animate loop and
// remove the body-appended wrap so the canvas + listeners don't leak.
setInterval(function() {
var container = document.getElementById('fh-container');
if (container && !fhActive) {
initFrenchHouse();
} else if (!container) {
fhActive = false;
if (fhAnimId) { cancelAnimationFrame(fhAnimId); fhAnimId = null; }
window._dssDisposeWrap('fh-wrap');
}
}, 300);
})();

