// ====== RONNIE SCOTT'S SCENE — INLINE ======
(function() {
var rsActive = false;
var rsAnimId = null;
var rsWrap = null;
var rsVig = null;
var rsGrain = null;
var rsGrainCtx = null;
var rsGrainFrame = 0;
var rsWash = null;
var rsDate = null;
var rsLoc = null;
var rsBtn = null;

function initRonnieScotts() {
if (rsActive) return;
rsActive = true;
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(buildRSScene) : buildRSScene()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(buildRSScene) : buildRSScene());
}
}

function buildRSScene() {
// Reduced-motion: hold one settled frame (neon steady, sky still, grain drawn once).
var rsStill = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
rsWrap = document.createElement('div');
rsWrap.id = 'rs-wrap';
rsWrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9000;background:#050508;overflow:hidden;';

// ============================================================
// SCENE SETUP — RONNIE SCOTT'S 3D STREET VIEW
// ============================================================

// ============================================================
// HELPERS (must be defined before any textures)
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
// SCENE SETUP
// ============================================================
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x16161f);
scene.fog = new THREE.Fog(0x16161f, 5, 40);
scene.add(new THREE.AmbientLight(0x1c1c30, 0.34)); // added 2026-09-13: the scene had no ambient, so anything out of a lamp’s reach was pure black

var camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 200);

// ============================================================
// LAYOUT — Standing on the pavement, looking down Frith Street
// Ronnie Scott's sign visible ahead on the left, street receding
// ============================================================
camera.position.set(8, 1.7, 2.5);
camera.lookAt(-6, 2.8, 1.5);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.48;
rsWrap.appendChild(renderer.domElement);
window._dssBindScene('rs-wrap', scene, renderer, camera);
var dssComposerLocal = window.dssMakeComposer ? window.dssMakeComposer(scene, camera, renderer, { focus: 13 }) : null;
if (window.dssFilmGrade) window.dssFilmGrade(document.getElementById('rs-wrap'));

// ============================================================
// MATERIALS
// ============================================================
var darkRedBrick = new THREE.MeshStandardMaterial({ color: 0x7a3a28, roughness: 0.9 });
var medBrick = new THREE.MeshStandardMaterial({ color: 0x8a4a38, roughness: 0.85 });
var lightBrick = new THREE.MeshStandardMaterial({ color: 0x9a5a48, roughness: 0.8 });
var darkPaint = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7 });
var blackFascia = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.5 });
var whiteTrim = new THREE.MeshStandardMaterial({ color: 0xe8e4dc, roughness: 0.7 });
var creamTrim = new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.75 });
var sillMat = new THREE.MeshStandardMaterial({ color: 0xdcd4c8, roughness: 0.7 });
var windowFrame = new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.6 });
var darkGlass = new THREE.MeshStandardMaterial({ color: 0x0a0a15, roughness: 0.2, metalness: 0.3 });
var ironMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6, metalness: 0.3 });
var pipeMat = new THREE.MeshStandardMaterial({ color: 0x2a2a28, roughness: 0.7 });
// High-contrast paving slabs — joints strong enough to read under the warm lamp wash
var rsPaveTex = (function() {
  var c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  var cx = c.getContext('2d');
  cx.fillStyle = '#464642'; cx.fillRect(0, 0, 512, 512);
  var sw = 128, sh = 96;
  for (var sy = 0; sy < 512; sy += sh) {
    var off = ((sy / sh) % 2 === 0) ? 0 : sw / 2;
    for (var sx = -sw; sx < 512 + sw; sx += sw) {
      var bxp = sx + off;
      var sg = 50 + Math.floor(Math.random() * 46);
      cx.fillStyle = 'rgb(' + sg + ',' + sg + ',' + (sg - 4) + ')';
      cx.fillRect(bxp, sy, sw, sh);
      cx.strokeStyle = 'rgba(10, 10, 8, 1)'; cx.lineWidth = 5;
      cx.strokeRect(bxp, sy, sw, sh);
      // Chipped corner here and there
      if (Math.random() < 0.3) {
        cx.fillStyle = 'rgba(20, 20, 18, 0.5)';
        cx.fillRect(bxp + (Math.random() < 0.5 ? 2 : sw - 14), sy + (Math.random() < 0.5 ? 2 : sh - 10), 12, 8);
      }
    }
  }
  // Cracks
  cx.strokeStyle = 'rgba(15, 15, 12, 0.7)'; cx.lineWidth = 1.2;
  for (var c2 = 0; c2 < 9; c2++) {
    cx.beginPath();
    cx.moveTo(Math.random() * 512, Math.random() * 512);
    cx.lineTo(Math.random() * 512, Math.random() * 512);
    cx.stroke();
  }
  // Weather stains
  for (var wp = 0; wp < 7; wp++) {
    var wpx = Math.random() * 512, wpy = Math.random() * 512;
    var wpr = 35 + Math.random() * 70;
    var wpg = cx.createRadialGradient(wpx, wpy, 0, wpx, wpy, wpr);
    wpg.addColorStop(0, 'rgba(52, 58, 60, 0.45)');
    wpg.addColorStop(1, 'rgba(52, 58, 60, 0)');
    cx.fillStyle = wpg; cx.fillRect(wpx - wpr, wpy - wpr, wpr * 2, wpr * 2);
  }
  var tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(24, 24);
  return tex;
})();
var pavementMat = new THREE.MeshStandardMaterial({ map: rsPaveTex, roughness: 0.85 });
var roadMat = (window.dssScene && window.dssScene.makeGrimyRoad)
  ? window.dssScene.makeGrimyRoad({ baseColor: 0x101012 })
  : new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.4, metalness: 0.3 });
// Rained-on asphalt: low roughness + a little metalness for streetlight sheen
roadMat.roughness = 0.38;
roadMat.metalness = 0.28;
var metalSignBg = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.6 });
var neonMat = new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.1, metalness: 0.3, emissive: 0xff4400, emissiveIntensity: 0.8 });
var woodMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.8 });
var barrelMat = new THREE.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 0.8 });

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
// renders over the tarmac and the road never shows at all
road.position.set(0, 0.004, 10);
road.receiveShadow = true;
scene.add(road);

// Wet road surface (reflective sheen)
var wetMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a, roughness: 0.15, metalness: 0.5, transparent: true, opacity: 0.25
});
var wetRoad = new THREE.Mesh(new THREE.PlaneGeometry(8, 60), wetMat);
wetRoad.rotation.x = -Math.PI / 2;
wetRoad.position.set(0, 0.01, 10);
scene.add(wetRoad);

// Road centre line comes painted into the grimy-road texture
// Kerb stones along both edges of the road
var kerbMat = new THREE.MeshStandardMaterial({ color: 0x4a4a46, roughness: 0.85 });
var kerbL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 60), kerbMat);
kerbL.position.set(-4.1, 0.04, 10); kerbL.receiveShadow = true; scene.add(kerbL);
var kerbR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 60), kerbMat);
kerbR.position.set(4.1, 0.04, 10); kerbR.receiveShadow = true; scene.add(kerbR);

// Gutter drain grate against the near kerb, wet-stained
var drainRecess = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.85),
  new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9 }));
drainRecess.rotation.x = -Math.PI / 2;
drainRecess.position.set(3.68, 0.012, 3.6);
scene.add(drainRecess);
var drainBarMat = new THREE.MeshStandardMaterial({ color: 0x232320, roughness: 0.55, metalness: 0.5 });
for (var db = 0; db < 6; db++) {
  var drainBar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.06), drainBarMat);
  drainBar.position.set(3.68, 0.022, 3.28 + db * 0.13);
  scene.add(drainBar);
}
// Frame around the grate
var drainFrame = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.025, 0.92), drainBarMat);
drainFrame.position.set(3.68, 0.008, 3.6);
scene.add(drainFrame);
// Damp stain spreading from the drain
var drainStain = new THREE.Mesh(new THREE.CircleGeometry(0.9, 20),
  new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false }));
drainStain.rotation.x = -Math.PI / 2;
drainStain.position.set(3.55, 0.014, 3.6);
scene.add(drainStain);

// ============================================================
// RONNIE SCOTT'S BUILDING (main facade)
// ============================================================
var building = new THREE.Group();

// Main brick body — 4 storeys
var brickBody = new THREE.Mesh(new THREE.BoxGeometry(6.5, 13, 7), medBrick);
brickBody.position.set(-0.2, 6.5, -3.5);
building.add(brickBody);

// Facade panel — real brick coursing from the toolkit, London-stock red
var facadeBrickMat = (window.dssScene && window.dssScene.makeGrimyBrick)
  ? window.dssScene.makeGrimyBrick({ baseColor: 0x7a3a28, repeat: [1.9, 5], sootStreaks: 7, dampPatches: 4 })
  : darkRedBrick;
var facadePanel = new THREE.Mesh(new THREE.BoxGeometry(6.52, 13, 0.08), facadeBrickMat);
facadePanel.position.set(-0.2, 6.5, 0.04);
building.add(facadePanel);

// Side wall visible at angle
var sideWall = new THREE.Mesh(new THREE.PlaneGeometry(7, 13),
  new THREE.MeshStandardMaterial({ color: 0x6a3a2a, roughness: 0.88 }));
sideWall.position.set(3.0, 6.5, -3.5);
sideWall.rotation.y = -Math.PI / 2;
building.add(sideWall);

// Mortar coursing now comes painted into the brick texture

// ---- WHITE STRING COURSES (between floors) ----
var stringHeights = [3.6, 6.8, 10.0];
for (var si = 0; si < stringHeights.length; si++) {
  var stringCourse = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.12, 0.14), whiteTrim);
  stringCourse.position.set(-0.2, stringHeights[si], 0.12);
  building.add(stringCourse);
  placeMesh(building, new THREE.BoxGeometry(6.62, 0.04, 0.18), whiteTrim, -0.2, stringHeights[si] + 0.07, 0.14);
  var shadowLine = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.03, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x5a3a2a, roughness: 0.9 }));
  shadowLine.position.set(-0.2, stringHeights[si] - 0.08, 0.1);
  building.add(shadowLine);
  placeMesh(building, new THREE.BoxGeometry(0.14, 0.12, 0.3), whiteTrim, 3.0, stringHeights[si], -0.02);
}

// ---- TOP CORNICE ----
var topCornice = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.2, 0.4), whiteTrim);
topCornice.position.set(-0.2, 13.05, 0.2);
building.add(topCornice);
placeMesh(building, new THREE.BoxGeometry(6.85, 0.1, 0.5), whiteTrim, -0.2, 12.95, 0.28);
var corniceUnder = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.08, 0.5), creamTrim);
corniceUnder.position.set(-0.2, 12.85, 0.25);
building.add(corniceUnder);

// Dentil course
for (var di = -3.2; di <= 2.8; di += 0.3) {
  var dentil = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.06), whiteTrim);
  dentil.position.set(di, 12.78, 0.22);
  building.add(dentil);
}

placeMesh(building, new THREE.BoxGeometry(6.75, 0.05, 0.1), creamTrim, -0.2, 12.7, 0.15);
placeMesh(building, new THREE.BoxGeometry(0.4, 0.2, 0.5), whiteTrim, 3.0, 13.05, -0.05);

// ---- MANSARD ROOF ----
var roofMat = new THREE.MeshStandardMaterial({ color: 0x2a2a30, roughness: 0.85 });
var slateMat = new THREE.MeshStandardMaterial({ color: 0x3a3a42, roughness: 0.8 });
var roofSlab = new THREE.Mesh(new THREE.BoxGeometry(6.8, 1.8, 4), roofMat);
roofSlab.position.set(-0.2, 14, -1.5);
building.add(roofSlab);

var mansardFace = new THREE.Mesh(new THREE.PlaneGeometry(6.82, 2.0), slateMat);
mansardFace.position.set(-0.2, 14, 0.52);
mansardFace.rotation.x = 0.15;
building.add(mansardFace);

placeMesh(building, new THREE.BoxGeometry(6.8, 0.08, 0.12), roofMat, -0.2, 14.92, -0.2);
placeMesh(building, new THREE.BoxGeometry(6.82, 0.06, 0.06),
  new THREE.MeshStandardMaterial({ color: 0x555560, roughness: 0.4, metalness: 0.3 }),
  -0.2, 13.15, 0.12);

// ---- SASH WINDOWS (upper floors) ----
var litGlassMats = [];
function addSashWindow(x, y, isLit, isBigger) {
  var ww = isBigger ? 1.0 : 0.85;
  var wh = isBigger ? 1.8 : 1.5;

  placeMesh(building, new THREE.BoxGeometry(ww + 0.28, wh + 0.28, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x5a3228, roughness: 0.9 }),
    x, y, 0.04);

  placeMesh(building, new THREE.BoxGeometry(ww + 0.22, wh + 0.22, 0.06), windowFrame, x, y, 0.07);
  placeMesh(building, new THREE.BoxGeometry(ww + 0.08, wh + 0.08, 0.04), windowFrame, x, y, 0.1);

  var glassMat = (window.dssScene && window.dssScene.makeDressedWindow)
    ? window.dssScene.makeDressedWindow(isLit, Math.floor(Math.abs(x * 7.3 + y * 3.1)) % 3, Math.floor(Math.abs(x * 5.1 + y * 1.7)) % 4)
    : new THREE.MeshBasicMaterial({ color: isLit ? 0xffd699 : 0x334466, transparent: true, opacity: isLit ? 0.45 : 0.15 });
  placeMesh(building, new THREE.PlaneGeometry(ww, wh), glassMat, x, y, 0.14);
  // Lit rooms flicker from within — the animate loop dims the painted room's brightness
  if (isLit) {
    litGlassMats.push({ mat: glassMat, spd: 0.5 + Math.random() * 1.1, off: Math.random() * Math.PI * 2 });
  }

  placeMesh(building, new THREE.BoxGeometry(ww + 0.1, 0.06, 0.06), windowFrame, x, y + 0.1, 0.14);
  placeMesh(building, new THREE.BoxGeometry(ww, 0.025, 0.03), windowFrame, x, y - 0.2, 0.15);

  placeMesh(building, new THREE.BoxGeometry(0.025, wh, 0.02), windowFrame, x - ww * 0.25, y, 0.16);
  placeMesh(building, new THREE.BoxGeometry(0.025, wh, 0.02), windowFrame, x + ww * 0.25, y, 0.16);
  placeMesh(building, new THREE.BoxGeometry(ww, 0.025, 0.02), windowFrame, x, y + wh * 0.22, 0.16);
  placeMesh(building, new THREE.BoxGeometry(ww, 0.025, 0.02), windowFrame, x, y - wh * 0.22, 0.16);
  placeMesh(building, new THREE.BoxGeometry(ww, 0.02, 0.02), windowFrame, x, y + wh * 0.36, 0.16);
  placeMesh(building, new THREE.BoxGeometry(ww, 0.02, 0.02), windowFrame, x, y - wh * 0.36, 0.16);

  placeMesh(building, new THREE.BoxGeometry(ww + 0.3, 0.08, 0.2), sillMat, x, y - wh / 2 - 0.06, 0.16);
}

var winXs = [-1.8, -0.2, 1.4];
for (var wyi = 0; wyi < winXs.length; wyi++) {
  addSashWindow(winXs[wyi], 11.5, Math.random() > 0.4, false);
  addSashWindow(winXs[wyi], 8.3, Math.random() > 0.5, false);
  addSashWindow(winXs[wyi], 5.1, Math.random() > 0.3, false);
}

// ---- GROUND FLOOR SHOPFRONT (dark, recessed) ----
// Panelled timber boards, not flat paint
var shopBoardsTex = makeCanvasTexture(512, 256, function(cx, w, h) {
  cx.fillStyle = '#10151a'; cx.fillRect(0, 0, w, h);
  for (var pb = 0; pb < w; pb += 64) {
    cx.fillStyle = 'rgba(70, 82, 78, 0.28)';
    cx.fillRect(pb, 0, 2, h);
    cx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    cx.fillRect(pb + 3, 0, 3, h);
    // Panel sheen variation
    cx.fillStyle = 'rgba(46, 56, 54, ' + (0.06 + Math.random() * 0.12).toFixed(3) + ')';
    cx.fillRect(pb + 6, 0, 58, h);
  }
  // Mid rail
  cx.fillStyle = 'rgba(60, 70, 66, 0.3)'; cx.fillRect(0, h * 0.48, w, 3);
  cx.fillStyle = 'rgba(0, 0, 0, 0.5)'; cx.fillRect(0, h * 0.48 + 3, w, 3);
  // Scuffs and grime at the base
  var bg = cx.createLinearGradient(0, h * 0.7, 0, h);
  bg.addColorStop(0, 'rgba(8, 8, 6, 0)');
  bg.addColorStop(1, 'rgba(8, 8, 6, 0.55)');
  cx.fillStyle = bg; cx.fillRect(0, 0, w, h);
  for (var sc = 0; sc < 12; sc++) {
    cx.fillStyle = 'rgba(90, 95, 90, ' + (0.05 + Math.random() * 0.1).toFixed(3) + ')';
    cx.fillRect(Math.random() * w, h * 0.5 + Math.random() * h * 0.5, 6 + Math.random() * 30, 1.5 + Math.random() * 3);
  }
});
var shopBoardsMat = new THREE.MeshStandardMaterial({ map: shopBoardsTex, roughness: 0.75 });
var darkShopfront = new THREE.Mesh(new THREE.BoxGeometry(6.5, 3.2, 0.25), shopBoardsMat);
darkShopfront.position.set(-0.2, 1.6, 0.2);
building.add(darkShopfront);

// Recessed entrance area
placeMesh(building, new THREE.BoxGeometry(1.2, 2.8, 0.15),
  new THREE.MeshStandardMaterial({ color: 0x0a0a15, roughness: 0.9 }),
  -0.2, 1.4, 0.05);

// Small ground floor window (left side) — gig bills pinned in a lit case
var billsTex = makeCanvasTexture(256, 224, function(cx, w, h) {
  cx.fillStyle = '#221a10'; cx.fillRect(0, 0, w, h);
  var bgl = cx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.7);
  bgl.addColorStop(0, 'rgba(255, 200, 120, 0.3)');
  bgl.addColorStop(1, 'rgba(120, 85, 40, 0.05)');
  cx.fillStyle = bgl; cx.fillRect(0, 0, w, h);
  for (var bc = 0; bc < 3; bc++) {
    for (var br = 0; br < 2; br++) {
      var blx = w * 0.06 + bc * w * 0.32, bly = h * 0.08 + br * h * 0.46;
      cx.save();
      cx.translate(blx + w * 0.13, bly + h * 0.19);
      cx.rotate((bc + br) % 2 ? 0.03 : -0.04);
      cx.fillStyle = 'rgba(228, 218, 190, 0.95)';
      cx.fillRect(-w * 0.13, -h * 0.19, w * 0.26, h * 0.38);
      // Headline band and text lines
      cx.fillStyle = 'rgba(160, 30, 20, 0.85)';
      cx.fillRect(-w * 0.11, -h * 0.16, w * 0.22, h * 0.05);
      cx.fillStyle = 'rgba(40, 34, 26, 0.8)';
      for (var tl = 0; tl < 4; tl++) {
        cx.fillRect(-w * 0.1, -h * 0.07 + tl * h * 0.055, w * (0.12 + ((bc + tl) % 3) * 0.04), h * 0.018);
      }
      cx.restore();
    }
  }
});
placeMesh(building, new THREE.BoxGeometry(1.0, 0.9, 0.06), blackFascia, -2.5, 1.8, 0.31);
placeMesh(building, new THREE.PlaneGeometry(0.85, 0.75),
  new THREE.MeshBasicMaterial({ map: billsTex }), -2.5, 1.8, 0.35);

// Small ground floor window (right side) — wall of band photographs
var photosTex = makeCanvasTexture(256, 224, function(cx, w, h) {
  cx.fillStyle = '#1a140e'; cx.fillRect(0, 0, w, h);
  var pgl = cx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.7);
  pgl.addColorStop(0, 'rgba(255, 190, 110, 0.22)');
  pgl.addColorStop(1, 'rgba(110, 75, 35, 0.04)');
  cx.fillStyle = pgl; cx.fillRect(0, 0, w, h);
  for (var pc = 0; pc < 4; pc++) {
    for (var prr = 0; prr < 3; prr++) {
      var phx = w * 0.05 + pc * w * 0.24, phy = h * 0.06 + prr * h * 0.32;
      cx.fillStyle = 'rgba(215, 210, 195, 0.9)';
      cx.fillRect(phx, phy, w * 0.2, h * 0.26);
      // Monochrome print inside the mount
      var pgr = 40 + ((pc * 3 + prr) % 4) * 18;
      cx.fillStyle = 'rgb(' + pgr + ',' + pgr + ',' + pgr + ')';
      cx.fillRect(phx + w * 0.015, phy + h * 0.03, w * 0.17, h * 0.2);
      // Player silhouette suggestion
      cx.fillStyle = 'rgba(200, 195, 180, 0.55)';
      cx.beginPath();
      cx.arc(phx + w * 0.1, phy + h * 0.11, w * 0.028, 0, Math.PI * 2);
      cx.fill();
      cx.fillRect(phx + w * 0.07, phy + h * 0.13, w * 0.06, h * 0.09);
    }
  }
});
placeMesh(building, new THREE.BoxGeometry(1.0, 0.9, 0.06), blackFascia, 2.1, 1.8, 0.31);
placeMesh(building, new THREE.PlaneGeometry(0.85, 0.75),
  new THREE.MeshBasicMaterial({ map: photosTex }), 2.1, 1.8, 0.35);

// Door frame
placeMesh(building, new THREE.BoxGeometry(0.9, 2.0, 0.08), blackFascia, -0.2, 1.0, 0.25);
var clubDoorTex = makeCanvasTexture(128, 256, function(cx, w, h) {
  cx.fillStyle = '#131820'; cx.fillRect(0, 0, w, h);
  // Two tall recessed panels
  var panels = [[0.14, 0.1, 0.72, 0.34], [0.14, 0.52, 0.72, 0.38]];
  for (var dp = 0; dp < panels.length; dp++) {
    var pn = panels[dp];
    cx.strokeStyle = 'rgba(0, 0, 0, 0.7)'; cx.lineWidth = 3;
    cx.strokeRect(w * pn[0], h * pn[1], w * pn[2], h * pn[3]);
    cx.strokeStyle = 'rgba(72, 84, 92, 0.35)'; cx.lineWidth = 1.5;
    cx.strokeRect(w * pn[0] + 3, h * pn[1] + 3, w * pn[2] - 6, h * pn[3] - 6);
    cx.fillStyle = 'rgba(30, 38, 46, 0.4)';
    cx.fillRect(w * pn[0] + 5, h * pn[1] + 5, w * pn[2] - 10, h * pn[3] - 10);
  }
  // Scuffs near the base
  for (var ds = 0; ds < 6; ds++) {
    cx.fillStyle = 'rgba(100, 105, 100, 0.12)';
    cx.fillRect(Math.random() * w, h * 0.85 + Math.random() * h * 0.12, 5 + Math.random() * 18, 2);
  }
});
placeMesh(building, new THREE.BoxGeometry(0.8, 1.9, 0.04),
  new THREE.MeshStandardMaterial({ map: clubDoorTex, roughness: 0.6 }), -0.2, 1.0, 0.32);

// Door step
placeMesh(building, new THREE.BoxGeometry(1.0, 0.06, 0.2), sillMat, -0.2, 0.03, 0.4);

// Entrance mat on the pavement in front of the door
var doorMatTex = makeCanvasTexture(256, 160, function(cx, w, h) {
  cx.fillStyle = '#26201c'; cx.fillRect(0, 0, w, h);
  // Coir weave — fine horizontal ribs
  for (var mv = 0; mv < h; mv += 4) {
    cx.fillStyle = 'rgba(70, 58, 44, ' + (0.12 + Math.random() * 0.14).toFixed(3) + ')';
    cx.fillRect(0, mv, w, 2);
  }
  // Red border band
  cx.strokeStyle = '#6a1a14'; cx.lineWidth = 10;
  cx.strokeRect(10, 10, w - 20, h - 20);
  // Woven lettering, worn
  cx.fillStyle = 'rgba(190, 160, 90, 0.75)';
  cx.font = 'bold 26px Georgia';
  cx.textAlign = 'center'; cx.textBaseline = 'middle';
  cx.fillText("RONNIE SCOTT'S", w / 2, h / 2);
  // Wear from footfall — dark scuffed patch over the middle
  var wearG = cx.createRadialGradient(w / 2, h * 0.55, 8, w / 2, h * 0.55, w * 0.4);
  wearG.addColorStop(0, 'rgba(15, 12, 10, 0.4)');
  wearG.addColorStop(1, 'rgba(15, 12, 10, 0)');
  cx.fillStyle = wearG; cx.fillRect(0, 0, w, h);
});
var doorMatMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.72),
  new THREE.MeshStandardMaterial({ map: doorMatTex, roughness: 0.95 }));
doorMatMesh.rotation.x = -Math.PI / 2;
doorMatMesh.position.set(-0.2, 0.028, 0.95);
building.add(doorMatMesh);

// ---- WINDOW MULLIONS/GLAZING BARS (ground floor shop windows) ----
// Left window bars
placeMesh(building, new THREE.BoxGeometry(0.025, 0.75, 0.02), windowFrame, -2.5 - 0.2, 1.8, 0.37);
placeMesh(building, new THREE.BoxGeometry(0.85, 0.025, 0.02), windowFrame, -2.5, 1.8 + 0.2, 0.37);
placeMesh(building, new THREE.BoxGeometry(0.85, 0.025, 0.02), windowFrame, -2.5, 1.8 - 0.2, 0.37);
// Right window bars
placeMesh(building, new THREE.BoxGeometry(0.025, 0.75, 0.02), windowFrame, 2.1 - 0.2, 1.8, 0.37);
placeMesh(building, new THREE.BoxGeometry(0.85, 0.025, 0.02), windowFrame, 2.1, 1.8 + 0.2, 0.37);
placeMesh(building, new THREE.BoxGeometry(0.85, 0.025, 0.02), windowFrame, 2.1, 1.8 - 0.2, 0.37);

// ---- FASCIA BOARD ABOVE SHOPFRONT (dark with "RONNIE SCOTT'S" in gold) ----
var fasciaTex = makeCanvasTexture(512, 64, function(cx, w, h) {
  cx.fillStyle = '#0a0a0a';
  cx.fillRect(0, 0, w, h);
  cx.fillStyle = '#d8a840';
  cx.font = 'bold 48px Georgia, serif';
  cx.textAlign = 'center';
  cx.fillText('RONNIE SCOTT\'S', w / 2, 48);
});
var fasciaMat = new THREE.MeshBasicMaterial({ map: fasciaTex });
var fascia = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 0.6), fasciaMat);
fascia.position.set(-0.2, 3.35, 0.32);
building.add(fascia);

// Fascia frame box
placeMesh(building, new THREE.BoxGeometry(6.3, 0.62, 0.08), blackFascia, -0.2, 3.35, 0.25);

// ---- DOOR BRASS FURNITURE ----
var brassMat = new THREE.MeshStandardMaterial({ color: 0xc8a840, roughness: 0.3, metalness: 0.5 });
placeMesh(building, new THREE.BoxGeometry(0.06, 0.12, 0.08), brassMat, -0.2, 1.1, 0.38);
// Kick plate
placeMesh(building, new THREE.BoxGeometry(0.68, 0.22, 0.02), brassMat, -0.2, 0.22, 0.35);
// Porthole window, lit from inside
placeMesh(building, new THREE.RingGeometry(0.085, 0.105, 20), brassMat, -0.2, 1.62, 0.36);
var portholeMat = new THREE.MeshBasicMaterial({ color: 0xffc878, transparent: true, opacity: 0.75 });
placeMesh(building, new THREE.CircleGeometry(0.085, 20), portholeMat, -0.2, 1.62, 0.355);


// ---- ILLUMINATED POSTER FRAME (like a lit panel) ----
var posterFrameMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.6 });
placeMesh(building, new THREE.BoxGeometry(0.5, 1.0, 0.08), posterFrameMat, -1.2, 1.5, 0.35);
var posterTex = makeCanvasTexture(256, 320, function(cx, w, h) {
  cx.fillStyle = '#181410'; cx.fillRect(0, 0, w, h);
  cx.strokeStyle = '#ff6600'; cx.lineWidth = 3;
  cx.strokeRect(10, 10, w - 20, h - 20);
  cx.fillStyle = '#ff6600';
  cx.font = 'bold 34px Georgia';
  cx.textAlign = 'center';
  cx.fillText('TONIGHT', w / 2, 62);
  // Billing lines — names as printed bars
  cx.fillStyle = 'rgba(230, 220, 195, 0.9)';
  var billW = [0.55, 0.4, 0.62, 0.35, 0.5];
  for (var pl = 0; pl < billW.length; pl++) {
    cx.fillRect(w * (0.5 - billW[pl] / 2), 95 + pl * 34, w * billW[pl], 11);
  }
  cx.fillStyle = '#ff6600';
  cx.font = 'bold 22px Georgia';
  cx.fillText('TWO HOUSES', w / 2, 285);
  cx.font = '18px Georgia';
  cx.fillText('8.30 & 11.15', w / 2, 308);
});
placeMesh(building, new THREE.PlaneGeometry(0.45, 0.95), new THREE.MeshBasicMaterial({ map: posterTex }), -1.2, 1.5, 0.38);
// Glow from poster
var posterLight = new THREE.PointLight(0xff6600, 0.5, 4);
posterLight.position.set(-1.2, 1.5, 0.8);
building.add(posterLight);

// Second lit frame on the other side of the door
placeMesh(building, new THREE.BoxGeometry(0.5, 1.0, 0.08), posterFrameMat, 0.8, 1.5, 0.35);
var poster2Tex = makeCanvasTexture(256, 320, function(cx, w, h) {
  cx.fillStyle = '#141018'; cx.fillRect(0, 0, w, h);
  cx.strokeStyle = '#d8a840'; cx.lineWidth = 3;
  cx.strokeRect(10, 10, w - 20, h - 20);
  cx.fillStyle = '#d8a840';
  cx.font = 'bold 30px Georgia';
  cx.textAlign = 'center';
  cx.fillText('LATE SHOW', w / 2, 66);
  // A saxophone silhouette, simply drawn
  cx.strokeStyle = 'rgba(216, 168, 64, 0.85)'; cx.lineWidth = 7; cx.lineCap = 'round';
  cx.beginPath();
  cx.moveTo(w * 0.42, h * 0.3);
  cx.quadraticCurveTo(w * 0.38, h * 0.55, w * 0.5, h * 0.66);
  cx.quadraticCurveTo(w * 0.64, h * 0.74, w * 0.66, h * 0.6);
  cx.stroke();
  cx.fillStyle = 'rgba(216, 168, 64, 0.85)';
  cx.beginPath(); cx.ellipse(w * 0.665, h * 0.575, 13, 17, 0.35, 0, Math.PI * 2); cx.fill();
  cx.lineCap = 'butt';
  cx.font = '18px Georgia';
  cx.fillStyle = '#d8a840';
  cx.fillText('FROM 1 A.M.', w / 2, 292);
});
placeMesh(building, new THREE.PlaneGeometry(0.45, 0.95), new THREE.MeshBasicMaterial({ map: poster2Tex }), 0.8, 1.5, 0.38);
var poster2Light = new THREE.PointLight(0xd8a840, 0.4, 3.5);
poster2Light.position.set(0.8, 1.5, 0.8);
building.add(poster2Light);

// Upper edge of ground floor
placeMesh(building, new THREE.BoxGeometry(6.5, 0.08, 0.12), whiteTrim, -0.2, 3.2, 0.25);

// ---- AWNINGS (dark canopies — split to avoid sign area) ----
// Ribbed canvas texture so the awnings read as fabric, not flat card
var awningTex = makeCanvasTexture(256, 128, function(cx, w, h) {
  cx.fillStyle = '#1c1c1e'; cx.fillRect(0, 0, w, h);
  for (var rb = 0; rb < w; rb += 18) {
    cx.fillStyle = 'rgba(50, 50, 55, 0.35)';
    cx.fillRect(rb, 0, 7, h);
    cx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    cx.fillRect(rb + 14, 0, 3, h);
  }
  // Grime along the outer edge
  var ag = cx.createLinearGradient(0, h * 0.7, 0, h);
  ag.addColorStop(0, 'rgba(10, 10, 8, 0)');
  ag.addColorStop(1, 'rgba(10, 10, 8, 0.5)');
  cx.fillStyle = ag; cx.fillRect(0, 0, w, h);
});
var awningMat = new THREE.MeshStandardMaterial({ map: awningTex, roughness: 0.9 });
var valanceMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85 });
var awningBracketMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.4 });

// SINGLE awning across the whole front — pitched steeply toward the pavement.
// Right edge stops at x=2.75 so it can never occlude the Cosmogramma side sign
// (which sits at x=2.9, nearer the camera than the awning edge).
var awningFull = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.9, 0.05), awningMat);
awningFull.position.set(-0.35, 2.9, 0.7);
awningFull.rotation.x = -1.0;
building.add(awningFull);
// Valance hanging from the low outer edge
placeMesh(building, new THREE.BoxGeometry(6.2, 0.10, 0.04), valanceMat, -0.35, 2.6, 1.08);

// Warm light spilling from under the awning onto the pavement
var awningLight = new THREE.PointLight(0xff8830, 0.4, 6);
awningLight.position.set(-0.2, 2.3, 1.0);
building.add(awningLight);

// ---- DOOR STEP ----
placeMesh(building, new THREE.BoxGeometry(1.2, 0.12, 0.35), sillMat, -0.2, 0.06, 0.55);
placeMesh(building, new THREE.BoxGeometry(1.3, 0.06, 0.4),
  new THREE.MeshStandardMaterial({ color: 0xc8c0b0, roughness: 0.8 }), -0.2, 0.0, 0.55);

// ---- DRAINPIPES ----
placeMesh(building, new THREE.CylinderGeometry(0.04, 0.04, 13, 6), pipeMat, -2.8, 6.5, 0.2);
for (var pbh = 2; pbh < 13; pbh += 2.5) {
  placeMesh(building, new THREE.BoxGeometry(0.12, 0.04, 0.1), pipeMat, -2.8, pbh, 0.2);
}

placeMesh(building, new THREE.CylinderGeometry(0.035, 0.035, 13, 6), pipeMat, 2.6, 6.5, 0.15);
for (var pbh = 3; pbh < 13; pbh += 3) {
  placeMesh(building, new THREE.BoxGeometry(0.1, 0.04, 0.08), pipeMat, 2.6, pbh, 0.15);
}

// ---- GUTTERING ----
placeMesh(building, new THREE.BoxGeometry(6.8, 0.06, 0.08),
  new THREE.MeshStandardMaterial({ color: 0x3a3a38, roughness: 0.5, metalness: 0.2 }),
  -0.2, 13.12, 0.18);

// ---- CHIMNEYS ----
var chimMat = new THREE.MeshStandardMaterial({ color: 0x7a5a48, roughness: 0.85 });
placeMesh(building, new THREE.BoxGeometry(0.6, 1.8, 0.6), chimMat, -1.5, 15.4, -2);
placeMesh(building, new THREE.BoxGeometry(0.6, 1.8, 0.6), chimMat, 1.5, 15.4, -2);
placeMesh(building, new THREE.BoxGeometry(0.7, 0.1, 0.7), chimMat, -1.5, 16.35, -2);
placeMesh(building, new THREE.BoxGeometry(0.7, 0.1, 0.7), chimMat, 1.5, 16.35, -2);

// ---- WET SURFACE SHEEN (subtle reflective plane in front of brickwork) ----
var wetSheenMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a, roughness: 0.15, metalness: 0.65, transparent: true, opacity: 0.15
});
var wetSheen = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 13), wetSheenMat);
wetSheen.position.set(-0.2, 6.5, 0.08);
building.add(wetSheen);

// ---- DRIP MARKS / MOISTURE STREAKS (dark vertical planes) ----
var soothMat = new THREE.MeshStandardMaterial({
  color: 0x2a2a2a, roughness: 0.95, transparent: true, opacity: 0.25
});
var dripPositions = [[-1.8, 10, -3.5], [0.6, 9.5, -3.5], [2.2, 8.2, -3.5], [-2.6, 7, -3.5],
                     [1.4, 11.5, -3.5], [-0.8, 6.8, -3.5], [2.8, 9, -3.5], [-1.2, 12.5, -3.5]];
for (var dri = 0; dri < dripPositions.length; dri++) {
  var dp = dripPositions[dri];
  var drip = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 3.5), soothMat);
  drip.position.set(dp[0], dp[1], dp[2]);
  building.add(drip);
}

// ---- SOOT/WEATHERING PATCHES (dark transparent random areas on facade) ----
var weatherMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a, roughness: 0.9, transparent: true, opacity: 0.2
});
var weatherPatches = [[0.5, 11.5], [-1.2, 9.8], [1.8, 8.5], [-2.0, 10.2], [0.1, 7.5], [-1.5, 12.0]];
for (var wpi = 0; wpi < weatherPatches.length; wpi++) {
  var wp = weatherPatches[wpi];
  var patch = new THREE.Mesh(new THREE.PlaneGeometry(1.2 + Math.random() * 0.8, 1.8 + Math.random() * 1.2), weatherMat);
  patch.position.set(wp[0], wp[1], 0.05);
  building.add(patch);
}

// ---- WINDOW KEYSTONES (small decorative stone pieces above upper windows) ----
var keystoneMat = new THREE.MeshStandardMaterial({ color: 0xa8a098, roughness: 0.8 });
var keystoneX = [-1.8, -0.2, 1.4];
for (var kxi = 0; kxi < keystoneX.length; kxi++) {
  placeMesh(building, new THREE.BoxGeometry(0.15, 0.12, 0.08), keystoneMat, keystoneX[kxi], 12.3, 0.06);
  placeMesh(building, new THREE.BoxGeometry(0.15, 0.12, 0.08), keystoneMat, keystoneX[kxi], 9.1, 0.06);
  placeMesh(building, new THREE.BoxGeometry(0.15, 0.12, 0.08), keystoneMat, keystoneX[kxi], 5.9, 0.06);
}

// ---- VERTICAL MORTAR LINES (additional density) ----
for (var vmi = -2.8; vmi < 3.0; vmi += 0.7) {
  if (Math.random() > 0.2) {
    var vmortar = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 13),
      new THREE.MeshStandardMaterial({ color: 0x9a7a68, roughness: 0.95, transparent: true, opacity: 0.15 }));
    vmortar.position.set(vmi, 6.5, 0.055);
    building.add(vmortar);
  }
}

// ---- BUILDING NUMBER "93" (near the door) ----
var numTex = makeCanvasTexture(64, 128, function(cx, w, h) {
  cx.fillStyle = '#ccaa88';
  cx.font = 'bold 80px Georgia, serif';
  cx.textAlign = 'center';
  cx.fillText('93', w / 2, 95);
});
var numMat = new THREE.MeshBasicMaterial({ map: numTex });
var numPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1.2), numMat);
numPlane.position.set(1.5, 1.2, 0.35);
building.add(numPlane);

scene.add(building);

// ============================================================
// THE ICONIC NEON SIGN (hero element — projecting 90° from wall)
// ============================================================
var signGroup = new THREE.Group();

// Metal bracket arm from building wall (horizontal, sticking out)
var bracketMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.5, metalness: 0.5 });
placeMesh(signGroup, new THREE.BoxGeometry(0.08, 0.08, 2.0), bracketMat, 0, 4.85, 1.0);  // top bar
placeMesh(signGroup, new THREE.BoxGeometry(0.08, 0.08, 2.0), bracketMat, 0, 3.55, 1.0);  // bottom bar
placeMesh(signGroup, new THREE.BoxGeometry(0.08, 1.4, 0.08), bracketMat, 0, 4.2, 2.0);  // vertical end
placeMesh(signGroup, new THREE.BoxGeometry(0.08, 1.4, 0.08), bracketMat, 0, 4.2, 0.1);  // vertical wall

// Dark backing panel (perpendicular to wall, facing down the street)
var signBackPanel = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 1.8), metalSignBg);
signBackPanel.position.set(0, 4.2, 1.1);
signGroup.add(signBackPanel);

// Canvas texture for neon text — compact sign matching reference
var neonSignTex = makeCanvasTexture(512, 420, function(cx, w, h) {
  cx.fillStyle = '#0a0a0a';
  cx.fillRect(0, 0, w, h);

  // "ronnie" — red/orange neon, hand-drawn squiggly style
  cx.shadowColor = 'rgba(255, 80, 0, 0.9)';
  cx.shadowBlur = 25;
  cx.fillStyle = '#ff4400';
  cx.font = 'italic bold 78px Georgia, serif';
  cx.textAlign = 'center';
  cx.fillText('ronnie', w * 0.38, h * 0.18);

  // "scott's" — red/orange neon
  cx.font = 'italic bold 78px Georgia, serif';
  cx.fillText("scott's", w * 0.38, h * 0.38);

  // Saxophone (blue neon) — right side
  cx.shadowColor = 'rgba(0, 120, 255, 0.9)';
  cx.shadowBlur = 20;
  cx.strokeStyle = '#0088ff';
  cx.lineWidth = 4;
  cx.beginPath();
  cx.arc(w * 0.82, h * 0.32, 32, -0.3, Math.PI * 1.3);
  cx.stroke();
  cx.beginPath();
  cx.moveTo(w * 0.78, h * 0.27);
  cx.quadraticCurveTo(w * 0.74, h * 0.14, w * 0.82, h * 0.08);
  cx.stroke();
  cx.beginPath();
  cx.moveTo(w * 0.82, h * 0.08);
  cx.quadraticCurveTo(w * 0.93, h * 0.05, w * 0.88, h * 0.18);
  cx.stroke();
  cx.beginPath();
  cx.moveTo(w * 0.88, h * 0.18);
  cx.lineTo(w * 0.91, h * 0.13);
  cx.stroke();
  cx.fillStyle = '#0088ff';
  cx.beginPath(); cx.arc(w * 0.77, h * 0.22, 3, 0, Math.PI * 2); cx.fill();
  cx.beginPath(); cx.arc(w * 0.75, h * 0.16, 3, 0, Math.PI * 2); cx.fill();
  cx.beginPath(); cx.arc(w * 0.78, h * 0.10, 3, 0, Math.PI * 2); cx.fill();

  // "6.30 pm - 3am" — smaller red
  cx.shadowColor = 'rgba(255, 80, 0, 0.7)';
  cx.shadowBlur = 12;
  cx.fillStyle = '#ff4400';
  cx.font = '38px Arial';
  cx.fillText('6.30 pm - 3am', w * 0.5, h * 0.58);

  // "OPEN NIGHTLY" — green neon (compact, tucked under the times)
  cx.shadowColor = 'rgba(0, 200, 0, 0.9)';
  cx.shadowBlur = 18;
  cx.fillStyle = '#00cc00';
  cx.font = 'bold 48px Arial';
  cx.fillText('OPEN NIGHTLY', w * 0.5, h * 0.72);
});

// Sign face — rotated 90° from wall (facing down the street, both sides visible)
var neonSignFaceMat = new THREE.MeshBasicMaterial({ map: neonSignTex, side: THREE.DoubleSide });
var neonFace = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.2), neonSignFaceMat);
neonFace.position.set(0.06, 4.2, 1.1);
neonFace.rotation.y = Math.PI / 2;
signGroup.add(neonFace);

// Second face (back of sign, same texture)
var neonFaceBack = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.2), neonSignFaceMat);
neonFaceBack.position.set(-0.06, 4.2, 1.1);
neonFaceBack.rotation.y = -Math.PI / 2;
signGroup.add(neonFaceBack);

// Position the whole sign group on the building facade
signGroup.position.set(0.5, 0, 0);
scene.add(signGroup);

// Neon glow point light (warm orange, casting down the street)
var neonLight = new THREE.PointLight(0xff5500, 1.5, 25);
neonLight.position.set(0.8, 4.2, 2.0);
neonLight.castShadow = true;
scene.add(neonLight);

// Secondary neon light (green tint from OPEN NIGHTLY)
var neonLightGreen = new THREE.PointLight(0x00cc00, 0.3, 12);
neonLightGreen.position.set(0.8, 3.4, 1.8);
scene.add(neonLightGreen);

// Neon glow sprite (visible halo around the sign)
var neonGlowTex = makeCanvasTexture(128, 128, function(cx, w, h) {
  var grad = cx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  grad.addColorStop(0, 'rgba(255, 80, 0, 0.5)');
  grad.addColorStop(0.3, 'rgba(255, 60, 0, 0.25)');
  grad.addColorStop(0.6, 'rgba(255, 40, 0, 0.08)');
  grad.addColorStop(1, 'rgba(255, 30, 0, 0)');
  cx.fillStyle = grad;
  cx.fillRect(0, 0, w, h);
});
var neonGlowSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: neonGlowTex, transparent: true, opacity: 0.6 }));
neonGlowSprite.position.set(0.8, 4.2, 1.5);
neonGlowSprite.scale.set(5, 4, 1);
scene.add(neonGlowSprite);

// The neon in the wet pavement (2026-09-22 polish loop): a smear of the sign's
// red under it on the flags, with the green of OPEN NIGHTLY low in its tail,
// broken by the paving joints. One additive plane; follows the neon's breath.
var rsNeonReflTex = makeCanvasTexture(128, 96, function(cx, w, h) {
  var g = cx.createRadialGradient(w * 0.5, h * 0.32, 0, w * 0.5, h * 0.32, w * 0.55);
  g.addColorStop(0, 'rgba(255,96,30,0.62)');
  g.addColorStop(0.4, 'rgba(255,70,20,0.22)');
  g.addColorStop(1, 'rgba(255,50,10,0)');
  cx.fillStyle = g; cx.fillRect(0, 0, w, h);
  var gg = cx.createRadialGradient(w * 0.5, h * 0.62, 0, w * 0.5, h * 0.62, w * 0.26);
  gg.addColorStop(0, 'rgba(60,220,60,0.28)');
  gg.addColorStop(1, 'rgba(40,200,40,0)');
  cx.fillStyle = gg; cx.fillRect(0, 0, w, h);
  cx.globalCompositeOperation = 'destination-out';
  cx.fillStyle = 'rgba(0,0,0,0.65)';
  for (var ji = 1; ji < 5; ji++) cx.fillRect(0, Math.round(ji * h / 5) - 1, w, 2);
  for (var jj = 1; jj < 6; jj++) cx.fillRect(Math.round(jj * w / 6) - 1, 0, 2, h);
  cx.globalCompositeOperation = 'source-over';
});
var rsNeonRefl = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.6),
  new THREE.MeshBasicMaterial({ map: rsNeonReflTex, transparent: true, opacity: 0.13, blending: THREE.AdditiveBlending, depthWrite: false }));
rsNeonRefl.rotation.x = -Math.PI / 2;
rsNeonRefl.position.set(0.8, 0.02, 2.7);
scene.add(rsNeonRefl);

// ============================================================
// NEIGHBOURING BUILDING (left) - CHOY'S CHINESE
// ============================================================
var leftBuilding = new THREE.Group();
var leftBody = new THREE.Mesh(new THREE.BoxGeometry(4.5, 14, 7),
  new THREE.MeshStandardMaterial({ color: 0x9a7a68, roughness: 0.85 }));
leftBody.position.set(-5, 7, -3.5);
leftBuilding.add(leftBody);

// Left building windows
for (var row = 0; row < 3; row++) {
  for (var col = 0; col < 2; col++) {
    var lwx = -6.5 + col * 1.3;
    var lwy = 4 + row * 3.2;
    placeMesh(leftBuilding, new THREE.BoxGeometry(0.8, 1.4, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x8a6858, roughness: 0.85 }), lwx, lwy, 0.03);
    placeMesh(leftBuilding, new THREE.BoxGeometry(0.7, 1.3, 0.06), windowFrame, lwx, lwy, 0.05);
    var leftLit = (row < 2 && Math.random() > 0.5);
    placeMesh(leftBuilding, new THREE.PlaneGeometry(0.6, 1.2),
      new THREE.MeshBasicMaterial({ color: leftLit ? 0xffd699 : 0x334466, transparent: true, opacity: leftLit ? 0.3 : 0.15 }),
      lwx, lwy, 0.07);
    placeMesh(leftBuilding, new THREE.BoxGeometry(0.02, 1.2, 0.02), windowFrame, lwx, lwy, 0.08);
    placeMesh(leftBuilding, new THREE.BoxGeometry(0.6, 0.02, 0.02), windowFrame, lwx, lwy, 0.08);
    placeMesh(leftBuilding, new THREE.BoxGeometry(0.95, 0.06, 0.14), sillMat, lwx, lwy - 0.72, 0.1);
  }
}

placeMesh(leftBuilding, new THREE.BoxGeometry(4.5, 0.08, 0.1), whiteTrim, -5, 3.6, 0.1);
placeMesh(leftBuilding, new THREE.BoxGeometry(4.5, 0.08, 0.1), whiteTrim, -5, 6.6, 0.1);
placeMesh(leftBuilding, new THREE.BoxGeometry(4.5, 0.08, 0.1), whiteTrim, -5, 9.6, 0.1);

// Left shopfront
var leftShop = new THREE.MeshStandardMaterial({ color: 0x2a3a2a, roughness: 0.8 });
placeMesh(leftBuilding, new THREE.BoxGeometry(4.5, 3.2, 0.3), leftShop, -5, 1.6, 0.45);

var leftFascia = makeCanvasTexture(256, 32, function(cx, w, h) {
  cx.fillStyle = '#2a3a2a';
  cx.fillRect(0, 0, w, h);
  cx.fillStyle = '#c8c0a0';
  cx.font = '18px Georgia';
  cx.textAlign = 'center';
  cx.fillText('CHOY\'S CHINESE RESTAURANT', w / 2, 22);
});
placeMesh(leftBuilding, new THREE.PlaneGeometry(4.0, 0.5),
  new THREE.MeshBasicMaterial({ map: leftFascia }), -5, 3.0, 0.62);

// Shop windows left with display details
for (var swx = -6.2; swx <= -3.8; swx += 1.2) {
  placeMesh(leftBuilding, new THREE.PlaneGeometry(0.9, 1.8),
    new THREE.MeshBasicMaterial({ color: 0x223322, transparent: true, opacity: 0.25 }), swx, 1.6, 0.62);
  // Warm interior glow hint
  placeMesh(leftBuilding, new THREE.PlaneGeometry(0.85, 1.75),
    new THREE.MeshBasicMaterial({ color: 0xffcc99, transparent: true, opacity: 0.15 }), swx, 1.6, 0.65);
}

// Coloured display boxes in Choy's window (warm interior items)
var displayBoxCols = [0xdd3333, 0xffaa00, 0xeeee00, 0x3388dd];
for (var dbi = 0; dbi < 6; dbi++) {
  var dbx = -5.5 + (dbi % 2) * 0.8;
  var dby = 1.2 + Math.floor(dbi / 2) * 0.6;
  placeMesh(leftBuilding, new THREE.BoxGeometry(0.3, 0.4, 0.2),
    new THREE.MeshStandardMaterial({ color: displayBoxCols[dbi % displayBoxCols.length], roughness: 0.6 }),
    dbx, dby, 0.68);
}

// Small canopy/awning over Choy's entrance
var choyAwningMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.8 });
placeMesh(leftBuilding, new THREE.PlaneGeometry(1.5, 0.7), choyAwningMat, -5, 2.8, 0.7);
placeMesh(leftBuilding, new THREE.BoxGeometry(1.5, 0.05, 0.08), choyAwningMat, -5, 2.8, 0.8);

// ---- WINDOW BOXES WITH FLOWERS (on upper windows) ----
var boxMat = new THREE.MeshStandardMaterial({ color: 0x6a5a4a, roughness: 0.75 });
var flowerColors = [0xdd3333, 0xff6666, 0xcc2244, 0xee8844];
var leftWinRows = [4, 7.2, 10.4];
var leftWinCols = [-6.5, -5.2];
for (var lwri = 0; lwri < leftWinRows.length; lwri++) {
  for (var lwci = 0; lwci < leftWinCols.length; lwci++) {
    if (Math.random() > 0.3) {
      placeMesh(leftBuilding, new THREE.BoxGeometry(0.5, 0.12, 0.25), boxMat, leftWinCols[lwci], leftWinRows[lwri] - 0.75, 0.15);
      // Flowers in box
      for (var flbi = 0; flbi < 3; flbi++) {
        placeMesh(leftBuilding, new THREE.SphereGeometry(0.06, 5, 5),
          new THREE.MeshStandardMaterial({ color: flowerColors[Math.floor(Math.random() * flowerColors.length)], roughness: 0.7 }),
          leftWinCols[lwci] - 0.15 + flbi * 0.15, leftWinRows[lwri] - 0.5, 0.25);
      }
    }
  }
}

placeMesh(leftBuilding, new THREE.CylinderGeometry(0.035, 0.035, 15, 6), pipeMat, -3.2, 7.5, 0.2);
scene.add(leftBuilding);

// ============================================================
// NEIGHBOURING BUILDING (right)
// ============================================================
var rightBuilding = new THREE.Group();
var rightBody = new THREE.Mesh(new THREE.BoxGeometry(4.5, 14, 7),
  new THREE.MeshStandardMaterial({ color: 0x8a7068, roughness: 0.85 }));
rightBody.position.set(5.2, 7, -3.5);
rightBuilding.add(rightBody);

for (var row = 0; row < 3; row++) {
  for (var col = 0; col < 2; col++) {
    var rwx = 3.8 + col * 1.3;
    var rwy = 4 + row * 3.2;
    placeMesh(rightBuilding, new THREE.BoxGeometry(0.8, 1.4, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x8a6858, roughness: 0.85 }), rwx, rwy, 0.03);
    placeMesh(rightBuilding, new THREE.BoxGeometry(0.7, 1.3, 0.06), windowFrame, rwx, rwy, 0.05);
    var rightLit = (row === 0 && Math.random() > 0.4);
    placeMesh(rightBuilding, new THREE.PlaneGeometry(0.6, 1.2),
      new THREE.MeshBasicMaterial({ color: rightLit ? 0xffd699 : 0x334466, transparent: true, opacity: rightLit ? 0.25 : 0.12 }),
      rwx, rwy, 0.07);
    placeMesh(rightBuilding, new THREE.BoxGeometry(0.02, 1.2, 0.02), windowFrame, rwx, rwy, 0.08);
    placeMesh(rightBuilding, new THREE.BoxGeometry(0.6, 0.02, 0.02), windowFrame, rwx, rwy, 0.08);
  }
}

var rightShopMat = new THREE.MeshStandardMaterial({ color: 0x3a2a28, roughness: 0.8 });
placeMesh(rightBuilding, new THREE.BoxGeometry(4.5, 3.2, 0.3), rightShopMat, 5.2, 1.6, 0.45);

var rightFascia = makeCanvasTexture(640, 80, function(cx, w, h) {
  cx.fillStyle = '#3a2a28';
  cx.fillRect(0, 0, w, h);
  cx.fillStyle = '#e8d8b0';
  // 38px — at 46px the text filled the full canvas width and the C clipped at the edge
  cx.font = 'bold 38px Georgia, serif';
  cx.textAlign = 'center';
  cx.textBaseline = 'middle';
  cx.fillText('COSMOGRAMMA RECORDS', w / 2, h / 2);
});
placeMesh(rightBuilding, new THREE.PlaneGeometry(3.8, 0.55),
  new THREE.MeshBasicMaterial({ map: rightFascia }), 6.1, 3.0, 1.15);

// ---- COSMOGRAMMA SIDE SIGN (facing +X, visible to camera looking in -X) ----
// Camera is at x=8 looking toward x=-6, so the left wall of this building
// (at x≈2.95) needs a sign whose normal points +X.
// rotation.y = PI/2 rotates the plane normal from +Z to +X.
// The sign width then runs in the -Z direction (world space).
var rightFaciaSide = makeCanvasTexture(640, 80, function(cx, w, h) {
  cx.fillStyle = '#e4dcc4';
  cx.fillRect(0, 0, w, h);
  cx.strokeStyle = '#6a4a38';
  cx.lineWidth = 3;
  cx.strokeRect(4, 4, w - 8, h - 8);
  cx.fillStyle = '#2a1c16';
  cx.font = 'bold 62px Georgia, serif';
  cx.textAlign = 'center';
  cx.textBaseline = 'middle';
  cx.fillText('COSMOGRAMMA', w * 0.44, h / 2);
});
var rightFaciaSideMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 0.6),
  new THREE.MeshBasicMaterial({ map: rightFaciaSide, side: THREE.DoubleSide })
);
// x=2.93 — just outside the building's left wall (building spans x=2.95 to 7.45)
// and 3cm clear of the backing strip's front face at x=2.90, which is
// coplanar with 2.90 and z-fights the sign into black patches.
// y=2.6 (was 2.94, 2026-09-16) — from the camera at y=1.7 looking up, the
// board at 2.94 projected over the bottom third of the neon sign behind it
// (x=0.5, y 3.6–4.8) and hid OPEN NIGHTLY; at 2.6 its top edge (2.9) sits
// just under the neon's bottom edge in the frame. z=1.15 — pushed out toward
// the street so the board's far end clears the building corner, which
// otherwise hides the first letters from the camera's oblique angle.
rightFaciaSideMesh.position.set(2.93, 2.6, 1.15);
rightFaciaSideMesh.rotation.y = Math.PI / 2;
rightBuilding.add(rightFaciaSideMesh);
// Slim backing strip — matches new position
placeMesh(rightBuilding, new THREE.BoxGeometry(0.04, 0.65, 1.55),
  new THREE.MeshStandardMaterial({ color: 0x2a1a18, roughness: 0.7 }), 2.88, 2.6, 1.15);

// Vinyl record display — flat canvas painted onto the shop window glass
var recordDisplayTex = makeCanvasTexture(512, 512, function(cx, w, h) {
  // Dark shop interior background
  cx.fillStyle = '#1a1210';
  cx.fillRect(0, 0, w, h);
  // Dim overlay — painted into the texture so we don't need material opacity
  cx.globalAlpha = 0.55;
  // Grid of album covers (4 cols x 5 rows)
  var albumCols = ['#8a2222','#cc7722','#aa5566','#224422', '#444488','#55aa33','#225544','#885522',
                   '#aa4422','#556688','#cc4488','#668833', '#886622','#3344aa','#44aa66','#443322',
                   '#772233','#558844','#aa6633','#334466'];
  var cols = 4, rows = 5;
  var pad = 12, gap = 8;
  var aw = (w - pad * 2 - gap * (cols - 1)) / cols;
  var ah = (h - pad * 2 - gap * (rows - 1)) / rows;
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      var ax = pad + col * (aw + gap);
      var ay = pad + row * (ah + gap);
      cx.fillStyle = albumCols[(row * cols + col) % albumCols.length];
      cx.fillRect(ax, ay, aw, ah);
      // Subtle highlight on each cover
      cx.fillStyle = 'rgba(255,255,255,0.08)';
      cx.fillRect(ax + 2, ay + 2, aw * 0.4, ah * 0.3);
    }
  }
});
// Record display — sits proud of the shopfront as a separate panel
var recordDisplayMat = new THREE.MeshBasicMaterial({ map: recordDisplayTex });
var recordPanel = placeMesh(rightBuilding, new THREE.PlaneGeometry(3.5, 2.4), recordDisplayMat, 5.2, 1.5, 1.1);
recordPanel.renderOrder = 2;

// ---- WINDOW BOXES WITH FLOWERS (right building) ----
var rightWinRows = [4, 7.2, 10.4];
var rightWinCols = [3.8, 5.1];
for (var rwri = 0; rwri < rightWinRows.length; rwri++) {
  for (var rwci = 0; rwci < rightWinCols.length; rwci++) {
    if (Math.random() > 0.4) {
      placeMesh(rightBuilding, new THREE.BoxGeometry(0.5, 0.12, 0.25), boxMat, rightWinCols[rwci], rightWinRows[rwri] - 0.75, 0.15);
      for (var flri = 0; flri < 3; flri++) {
        placeMesh(rightBuilding, new THREE.SphereGeometry(0.06, 5, 5),
          new THREE.MeshStandardMaterial({ color: flowerColors[Math.floor(Math.random() * flowerColors.length)], roughness: 0.7 }),
          rightWinCols[rwci] - 0.15 + flri * 0.15, rightWinRows[rwri] - 0.5, 0.25);
      }
    }
  }
}

placeMesh(rightBuilding, new THREE.CylinderGeometry(0.035, 0.035, 14, 6), pipeMat, 7.0, 7, 0.15);
scene.add(rightBuilding);

// ============================================================
// STREET FURNITURE
// ============================================================
// Victorian cast-iron lamp post (ornate, matching French House style)
function createStreetLamp(x, z) {
  var g = new THREE.Group();
  var postMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7, metalness: 0.3 });
  var castIron = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6, metalness: 0.35 });

  // Ornate stepped base (3 tiers)
  placeMesh(g, new THREE.CylinderGeometry(0.18, 0.22, 0.12, 8), castIron, 0, 0.06, 0);
  placeMesh(g, new THREE.CylinderGeometry(0.14, 0.18, 0.15, 8), castIron, 0, 0.19, 0);
  placeMesh(g, new THREE.CylinderGeometry(0.10, 0.14, 0.12, 8), castIron, 0, 0.32, 0);

  // Main tapered column
  placeMesh(g, new THREE.CylinderGeometry(0.04, 0.08, 4.2, 8), postMat, 0, 2.5, 0);

  // Fluted detail strips on column
  for (var fi = 0; fi < 6; fi++) {
    var angle = (fi / 6) * Math.PI * 2;
    var fx = Math.cos(angle) * 0.055;
    var fz = Math.sin(angle) * 0.055;
    placeMesh(g, new THREE.BoxGeometry(0.012, 3.0, 0.012), postMat, fx, 2.2, fz);
  }

  // Decorative collar (lower)
  placeMesh(g, new THREE.CylinderGeometry(0.065, 0.055, 0.08, 8), castIron, 0, 1.2, 0);
  // Decorative collar (upper)
  placeMesh(g, new THREE.CylinderGeometry(0.06, 0.05, 0.1, 8), castIron, 0, 4.5, 0);
  // Bulge ring at top
  placeMesh(g, new THREE.CylinderGeometry(0.055, 0.06, 0.06, 8), castIron, 0, 4.62, 0);

  // Scroll arm (curved bracket)
  placeMesh(g, new THREE.BoxGeometry(0.04, 0.04, 0.04), castIron, 0, 4.7, 0);
  // Main arm extending out
  var arm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.05), castIron);
  arm.position.set(0.25, 4.85, 0);
  arm.rotation.z = -0.12;
  g.add(arm);
  // Scroll curl underneath
  placeMesh(g, new THREE.TorusGeometry(0.1, 0.02, 6, 8, Math.PI), castIron, 0.12, 4.65, 0);
  // Small finial on top
  placeMesh(g, new THREE.SphereGeometry(0.03, 6, 6), castIron, 0, 4.72, 0);

  // Lantern housing (four-sided Victorian style)
  var lanternMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.4 });
  // Top cap (pyramid)
  placeMesh(g, new THREE.CylinderGeometry(0.02, 0.18, 0.15, 4), lanternMat, 0.45, 5.12, 0);
  // Housing frame (4 posts)
  placeMesh(g, new THREE.BoxGeometry(0.025, 0.4, 0.025), lanternMat, 0.32, 4.9, 0.12);
  placeMesh(g, new THREE.BoxGeometry(0.025, 0.4, 0.025), lanternMat, 0.32, 4.9, -0.12);
  placeMesh(g, new THREE.BoxGeometry(0.025, 0.4, 0.025), lanternMat, 0.58, 4.9, 0.12);
  placeMesh(g, new THREE.BoxGeometry(0.025, 0.4, 0.025), lanternMat, 0.58, 4.9, -0.12);
  // Bottom plate
  placeMesh(g, new THREE.BoxGeometry(0.3, 0.03, 0.28), lanternMat, 0.45, 4.68, 0);

  // Glass panels (4 sides, warm glow)
  var lanternGlow = new THREE.MeshBasicMaterial({ color: 0xffeebb, transparent: true, opacity: 0.6 });
  placeMesh(g, new THREE.PlaneGeometry(0.22, 0.35), lanternGlow, 0.45, 4.9, 0.13);
  placeMesh(g, new THREE.PlaneGeometry(0.22, 0.35), lanternGlow, 0.45, 4.9, -0.13);
  placeMesh(g, new THREE.PlaneGeometry(0.22, 0.35), lanternGlow, 0.33, 4.9, 0);
  placeMesh(g, new THREE.PlaneGeometry(0.22, 0.35), lanternGlow, 0.57, 4.9, 0);

  // Light source
  var lampLight = new THREE.PointLight(0xffdda0, 0.6, 15);
  lampLight.position.set(0.45, 4.8, 0);
  lampLight.castShadow = false; // 2026-10-14 (speed): the street lamps' cube shadows (the neon keeps its shadow)
  g.add(lampLight);

  // Glow sprite
  var glowTex = makeCanvasTexture(64, 64, function(cx, w, h) {
    var grad = cx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    grad.addColorStop(0, 'rgba(255, 220, 150, 0.8)');
    grad.addColorStop(0.3, 'rgba(255, 200, 100, 0.3)');
    grad.addColorStop(1, 'rgba(255, 180, 80, 0)');
    cx.fillStyle = grad;
    cx.fillRect(0, 0, w, h);
  });
  var glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0.5 }));
  glowSprite.position.set(0.45, 4.95, 0);
  glowSprite.scale.set(3, 3, 1);
  g.add(glowSprite);

  g.position.set(x, 0, z);
  scene.add(g);
  return lampLight;
}

var lampLight1 = createStreetLamp(-3.5, 3.0);
var lampLight2 = createStreetLamp(4.5, 3.0);

// Soft shadow streaks from the lamp posts, thrown away from the club's lights
var lampShadowTex = makeCanvasTexture(64, 256, function(cx, w, h) {
  var sgrad = cx.createLinearGradient(0, 0, 0, h);
  sgrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  sgrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.22)');
  sgrad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  cx.fillStyle = sgrad;
  // Tapering wedge — narrow at the base (bottom), spreading as it falls away
  cx.beginPath();
  cx.moveTo(w * 0.38, h);
  cx.lineTo(w * 0.62, h);
  cx.lineTo(w * 0.85, 0);
  cx.lineTo(w * 0.15, 0);
  cx.closePath();
  cx.fill();
});
function addLampShadow(px, pz, len) {
  // Direction away from the club doorway lights at roughly (0.8, 0.7)
  var dx = px - 0.8, dz = pz - 0.7;
  var dl = Math.sqrt(dx * dx + dz * dz);
  dx /= dl; dz /= dl;
  var shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5, len),
    new THREE.MeshBasicMaterial({ map: lampShadowTex, transparent: true, depthWrite: false }));
  shadowMesh.rotation.set(-Math.PI / 2, 0, Math.atan2(-dx, -dz));
  shadowMesh.position.set(px + dx * len / 2, 0.165, pz + dz * len / 2);
  scene.add(shadowMesh);
}
addLampShadow(-3.5, 3.0, 1.5);
addLampShadow(4.5, 3.0, 1.9);

// ---- NEON GREEN GLOW SPRITE — far lamppost lantern ----
var greenGlowTex = makeCanvasTexture(128, 128, function(cx, w, h) {
  var grad = cx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  grad.addColorStop(0,   'rgba(50, 180, 50, 0.9)');
  grad.addColorStop(0.12,'rgba(35, 150, 35, 0.7)');
  grad.addColorStop(0.35,'rgba(20, 110, 20, 0.28)');
  grad.addColorStop(0.7, 'rgba(0,   80,  0, 0.06)');
  grad.addColorStop(1,   'rgba(0,   60,  0, 0)');
  cx.fillStyle = grad;
  cx.fillRect(0, 0, w, h);
});
var greenGlowSprite = new THREE.Sprite(
  new THREE.SpriteMaterial({ map: greenGlowTex, transparent: true, opacity: 0.5, fog: false })
);
greenGlowSprite.position.set(-3.05, 4.95, 3.0);
greenGlowSprite.scale.set(2.8, 2.8, 1);
scene.add(greenGlowSprite);

// (barrel removed)

// ============================================================
// OPPOSITE BUILDING (across the street — dark, minimal detail)
// ============================================================
var oppBuilding = new THREE.Group();
var oppBody = new THREE.Mesh(new THREE.BoxGeometry(5, 14, 6),
  new THREE.MeshStandardMaterial({ color: 0x6a5a4a, roughness: 0.88 }));
oppBody.position.set(-1, 7, 18);
oppBuilding.add(oppBody);

// Scattered lit windows (random)
for (var orow = 0; orow < 3; orow++) {
  for (var ocol = 0; ocol < 2; ocol++) {
    var owx = -2.5 + ocol * 1.8;
    var owy = 4 + orow * 3.5;
    var isLit = Math.random() > 0.6;
    placeMesh(oppBuilding, new THREE.PlaneGeometry(0.7, 1.3),
      new THREE.MeshBasicMaterial({ color: isLit ? 0xffcc88 : 0x334455, transparent: true, opacity: isLit ? 0.25 : 0.08 }),
      owx, owy, 3.02);
  }
}

scene.add(oppBuilding);

// ============================================================
// PAVEMENT & STREET DETAIL
// ============================================================
var kerbMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.8 });
// The raised pavement apron IS the pavement the camera sees — give it the
// slab texture, scaled so slabs come out around 0.8m on its 30x3 top face
var rsPaveTex2 = rsPaveTex.clone();
rsPaveTex2.repeat.set(9, 0.75);
rsPaveTex2.needsUpdate = true;
var paveMat2 = new THREE.MeshStandardMaterial({ map: rsPaveTex2, roughness: 0.85 });

var pubPave = new THREE.Mesh(new THREE.BoxGeometry(30, 0.15, 3), paveMat2);
pubPave.position.set(0, 0.075, 2);
pubPave.receiveShadow = true;
scene.add(pubPave);

var pubKerb = new THREE.Mesh(new THREE.BoxGeometry(30, 0.18, 0.12), kerbMat);
pubKerb.position.set(0, 0.09, 3.5);
scene.add(pubKerb);

// Paving slab lines
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

// ---- DRAIN GRATE (metal grid pattern on road) ----
var drainMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6, metalness: 0.4 });
var drainGrate = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), drainMat);
drainGrate.rotation.x = -Math.PI / 2;
drainGrate.position.set(-2.5, 0.025, 6);
scene.add(drainGrate);
// Grid pattern on grate
for (var dgi = 0; dgi < 5; dgi++) {
  var dgx = drainGrate.position.x - 0.25 + dgi * 0.125;
  var dgline = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 }));
  dgline.rotation.x = -Math.PI / 2;
  dgline.position.set(dgx, 0.03, 6);
  scene.add(dgline);
}

// ---- MANHOLE COVER (circular dark disc on road) ----
var manholeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.7 });
var manhole = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 16), manholeMat);
manhole.position.set(2.5, 0.025, 4.5);
scene.add(manhole);
// Inner detail
var manholeInner = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.025, 16),
  new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.7 }));
manholeInner.position.set(2.5, 0.035, 4.5);
scene.add(manholeInner);

// ---- DOUBLE YELLOW LINES (along kerb) ----
var yellowLineMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.8 });
for (var yli = -6; yli < 20; yli += 2.0) {
  placeMesh(scene, new THREE.PlaneGeometry(0.08, 1.5), yellowLineMat, -3.8, 0.03, yli);
  placeMesh(scene, new THREE.PlaneGeometry(0.08, 1.5), yellowLineMat, -3.6, 0.03, yli);
}

// ---- BOLLARDS (short dark cylinders at intervals along pavement) ----
var bollardMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.7, metalness: 0.3 });
var bollardPositions = [[-4.5, 8], [-4.5, 11], [-4.5, 5], [4.5, 7], [4.5, 10], [4.5, 13]];
for (var bi = 0; bi < bollardPositions.length; bi++) {
  var bp = bollardPositions[bi];
  placeMesh(scene, new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8), bollardMat, bp[0], 0.25, bp[1]);
  // Top cap
  placeMesh(scene, new THREE.CylinderGeometry(0.1, 0.08, 0.05, 8), bollardMat, bp[0], 0.52, bp[1]);
}

// Puddles (reflective — more numerous and highly reflective)
var puddleMat = new THREE.MeshStandardMaterial({
  color: 0x252540, roughness: 0.08, metalness: 0.7, transparent: true, opacity: 0.5
});
var puddlePos = [[1, 5, 2.0, 1.2], [-2, 6, 1.5, 0.8], [3, 7.5, 1.8, 1.0], [-1, 9, 2.2, 1.3],
                 [0, 3.5, 1.4, 0.9], [-3, 8, 1.6, 1.1], [2, 6.5, 1.3, 0.7], [-1.5, 10.5, 1.9, 0.95],
                 [-2, 13.5, 2.6, 1.6], [1.5, 17, 3.0, 1.8], [-0.5, 22, 3.4, 2.0], [2.5, 12, 2.2, 1.4],
                 [0.5, 27, 3.6, 2.2], [-2.5, 18.5, 2.4, 1.5]];
for (var pi = 0; pi < puddlePos.length; pi++) {
  var pp = puddlePos[pi];
  var puddle = new THREE.Mesh(new THREE.PlaneGeometry(pp[2], pp[3]), puddleMat);
  puddle.rotation.x = -Math.PI / 2;
  puddle.position.set(pp[0], 0.02, pp[1]);
  puddle.userData.puddleIndex = pi;
  scene.add(puddle);
}

// Additional gutter drip puddles at base of drainpipes
var gutterPuddleMat = new THREE.MeshStandardMaterial({
  color: 0x0a0a15, roughness: 0.08, metalness: 0.7, transparent: true, opacity: 0.4
});
var gutterDripPos = [[-2.8, 0.3, 0.8, 0.5], [2.6, 0.3, 0.7, 0.45]];
for (var gpi = 0; gpi < gutterDripPos.length; gpi++) {
  var gp = gutterDripPos[gpi];
  var gutterPuddle = new THREE.Mesh(new THREE.PlaneGeometry(gp[2], gp[3]), gutterPuddleMat);
  gutterPuddle.rotation.x = -Math.PI / 2;
  gutterPuddle.position.set(gp[0], 0.025, gp[1]);
  scene.add(gutterPuddle);
}

// ============================================================
// GLOW POOLS (flat circular planes with warm emissive beneath each light source)
// ============================================================
// Soft radial falloff so the pools fade into the paving instead of sitting on it as discs
var glowPoolTex = makeCanvasTexture(128, 128, function(cx, w, h) {
  var pg = cx.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2);
  pg.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
  pg.addColorStop(0.45, 'rgba(255, 255, 255, 0.35)');
  pg.addColorStop(1, 'rgba(255, 255, 255, 0)');
  cx.fillStyle = pg; cx.fillRect(0, 0, w, h);
});
var glowPoolMat = new THREE.MeshBasicMaterial({
  map: glowPoolTex, color: 0xcc7828, transparent: true, opacity: 0.4,
  blending: THREE.AdditiveBlending, depthWrite: false
});
var glowPool1 = new THREE.Mesh(new THREE.CircleGeometry(2.5, 24), glowPoolMat);
glowPool1.rotation.x = -Math.PI / 2;
glowPool1.position.set(-3.5, 0.015, 3.0);
scene.add(glowPool1);

var glowPool2 = new THREE.Mesh(new THREE.CircleGeometry(2.2, 24), glowPoolMat);
glowPool2.rotation.x = -Math.PI / 2;
glowPool2.position.set(4.5, 0.015, 3.0);
scene.add(glowPool2);

var neonGlowPool = new THREE.MeshBasicMaterial({
  map: glowPoolTex, color: 0xb44a10, transparent: true, opacity: 0.35,
  blending: THREE.AdditiveBlending, depthWrite: false
});
var neonPool = new THREE.Mesh(new THREE.CircleGeometry(3.0, 24), neonGlowPool);
neonPool.rotation.x = -Math.PI / 2;
neonPool.position.set(0.5, 0.012, 2.0);
scene.add(neonPool);

// ============================================================
// CELESTIAL SKY — Milky Way, nebulae, spiral galaxy, planets, moons, stars
// Camera looks in -X direction, so planes must use rotation.y = Math.PI/2
// to face the camera. Stars spread at large negative X (down the street).
// ============================================================

// ---- MILKY WAY BAND ----
var milkyTex = makeCanvasTexture(512, 256, function(cx, w, h) {
  for (var myi = 0; myi < h; myi++) {
    var dist = Math.abs(myi - h * 0.5) / (h * 0.42);
    var alpha = Math.max(0, (1 - dist * dist * dist)) * 0.38; // was 0.55 — the haze overpowered the stars
    cx.fillStyle = 'rgba(210, 200, 255, ' + alpha + ')';
    cx.fillRect(0, myi, w, 1);
  }
  for (var mki = 0; mki < 4000; mki++) {
    var mkx = Math.random() * w;
    var mky = h * 0.5 + (Math.random() - 0.5) * h * 0.85;
    var mkDist = Math.abs(mky - h * 0.5) / (h * 0.42);
    var mkA = Math.max(0, 1 - mkDist) * Math.random() * 0.85;
    cx.fillStyle = 'rgba(225, 215, 255, ' + mkA + ')';
    cx.fillRect(mkx, mky, Math.random() < 0.04 ? 2 : 1, 1);
  }
  var riftGrad = cx.createLinearGradient(0, h * 0.4, 0, h * 0.6);
  riftGrad.addColorStop(0, 'rgba(0,0,0,0)');
  riftGrad.addColorStop(0.5, 'rgba(0,0,0,0.15)');
  riftGrad.addColorStop(1, 'rgba(0,0,0,0)');
  cx.fillStyle = riftGrad;
  cx.fillRect(0, h * 0.3, w, h * 0.4);
  // Feather both ENDS of the band — without this the plane's edges cut hard
  // and the whole galaxy read as a grey searchlight wedge.
  cx.globalCompositeOperation = 'destination-out';
  var endL = cx.createLinearGradient(0, 0, w * 0.24, 0);
  endL.addColorStop(0, 'rgba(0,0,0,1)'); endL.addColorStop(1, 'rgba(0,0,0,0)');
  cx.fillStyle = endL; cx.fillRect(0, 0, w * 0.24, h);
  var endR = cx.createLinearGradient(w, 0, w * 0.76, 0);
  endR.addColorStop(0, 'rgba(0,0,0,1)'); endR.addColorStop(1, 'rgba(0,0,0,0)');
  cx.fillStyle = endR; cx.fillRect(w * 0.76, 0, w * 0.24, h);
  cx.globalCompositeOperation = 'source-over';
});
var milkyPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(90, 14),
  new THREE.MeshBasicMaterial({ map: milkyTex, transparent: true, opacity: 0.7, depthWrite: false, fog: false })
);
milkyPlane.position.set(-40, 14, 2);
milkyPlane.rotation.y = Math.PI / 2;
milkyPlane.rotation.z = 0.18;
scene.add(milkyPlane);

// ---- SPIRAL GALAXY ----
var galaxyTex = makeCanvasTexture(256, 256, function(cx, w, h) {
  var gx = w / 2, gy = h / 2;
  var cGrad = cx.createRadialGradient(gx, gy, 0, gx, gy, 28);
  cGrad.addColorStop(0, 'rgba(255, 245, 210, 1)');
  cGrad.addColorStop(0.25, 'rgba(255, 220, 160, 0.85)');
  cGrad.addColorStop(0.6, 'rgba(200, 160, 100, 0.4)');
  cGrad.addColorStop(1, 'rgba(0,0,0,0)');
  cx.fillStyle = cGrad;
  cx.fillRect(0, 0, w, h);
  for (var garm = 0; garm < 2; garm++) {
    var gArmOff = garm * Math.PI;
    for (var gt = 1; gt < 280; gt++) {
      var gAngle = (gt / 280) * Math.PI * 3.2 + gArmOff;
      var gRad = (gt / 280) * 112;
      var gpx = gx + Math.cos(gAngle) * gRad;
      var gpy = gy + Math.sin(gAngle) * gRad * 0.58;
      var gA = (0.95 - gt / 280 * 0.6) * (0.6 + Math.random() * 0.4);
      var gSize = gt < 60 ? 2 : 1;
      cx.fillStyle = 'rgba(220, 205, 255, ' + gA + ')';
      cx.fillRect(gpx + (Math.random() - 0.5) * 10, gpy + (Math.random() - 0.5) * 7, gSize, gSize);
    }
  }
  var dGrad = cx.createRadialGradient(gx, gy, 25, gx, gy, 118);
  dGrad.addColorStop(0, 'rgba(170, 150, 220, 0)');
  dGrad.addColorStop(0.6, 'rgba(170, 150, 220, 0.12)');
  dGrad.addColorStop(1, 'rgba(0,0,0,0)');
  cx.fillStyle = dGrad;
  cx.fillRect(0, 0, w, h);
});
var galaxyMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(7, 4.5),
  new THREE.MeshBasicMaterial({ map: galaxyTex, transparent: true, opacity: 0.95, depthWrite: false, fog: false })
);
galaxyMesh.position.set(-35, 9, -4);
galaxyMesh.rotation.y = Math.PI / 2;
galaxyMesh.rotation.z = 0.35;
scene.add(galaxyMesh);

// ---- NEBULAE ----
function makeNebulaTexture(r1, g1, b1, r2, g2, b2) {
  return makeCanvasTexture(256, 256, function(cx, w, h) {
    var nGrad = cx.createRadialGradient(w * 0.42, h * 0.48, 0, w * 0.5, h * 0.5, w * 0.5);
    nGrad.addColorStop(0, 'rgba(' + r1 + ',' + g1 + ',' + b1 + ',0.75)');
    nGrad.addColorStop(0.35, 'rgba(' + r1 + ',' + g1 + ',' + b1 + ',0.4)');
    nGrad.addColorStop(0.65, 'rgba(' + r2 + ',' + g2 + ',' + b2 + ',0.2)');
    nGrad.addColorStop(1, 'rgba(0,0,0,0)');
    cx.fillStyle = nGrad;
    cx.fillRect(0, 0, w, h);
    for (var nwi = 0; nwi < 6; nwi++) {
      var nwx = w * (0.15 + Math.random() * 0.7);
      var nwy = h * (0.15 + Math.random() * 0.7);
      var nwr = 18 + Math.random() * 36;
      var nwGrad = cx.createRadialGradient(nwx, nwy, 0, nwx, nwy, nwr);
      nwGrad.addColorStop(0, 'rgba(' + r1 + ',' + g1 + ',' + b1 + ',0.5)');
      nwGrad.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = nwGrad;
      cx.fillRect(nwx - nwr, nwy - nwr, nwr * 2, nwr * 2);
    }
  });
}
var nebTex1 = makeNebulaTexture(160, 60, 255, 80, 30, 180);
var nebTex2 = makeNebulaTexture(255, 80, 140, 180, 40, 100);
var nebTex3 = makeNebulaTexture(40, 100, 255, 20, 60, 180);
var nebTex4 = makeNebulaTexture(255, 160, 40, 200, 80, 20);
var nebula1 = new THREE.Mesh(new THREE.PlaneGeometry(16, 12),
  new THREE.MeshBasicMaterial({ map: nebTex1, transparent: true, opacity: 0.75, depthWrite: false, fog: false }));
nebula1.position.set(-30, 12, -2);
nebula1.rotation.y = Math.PI / 2;
scene.add(nebula1);
var nebula2 = new THREE.Mesh(new THREE.PlaneGeometry(11, 8),
  new THREE.MeshBasicMaterial({ map: nebTex2, transparent: true, opacity: 0.7, depthWrite: false, fog: false }));
nebula2.position.set(-22, 8, 6);
nebula2.rotation.y = Math.PI / 2;
scene.add(nebula2);
var nebula3 = new THREE.Mesh(new THREE.PlaneGeometry(13, 10),
  new THREE.MeshBasicMaterial({ map: nebTex3, transparent: true, opacity: 0.65, depthWrite: false, fog: false }));
nebula3.position.set(-45, 13, 3);
nebula3.rotation.y = Math.PI / 2;
scene.add(nebula3);
var nebula4 = new THREE.Mesh(new THREE.PlaneGeometry(8, 6),
  new THREE.MeshBasicMaterial({ map: nebTex4, transparent: true, opacity: 0.6, depthWrite: false, fog: false }));
nebula4.position.set(-50, 8, -7);
nebula4.rotation.y = Math.PI / 2;
scene.add(nebula4);

// ---- PLANETS ----
function makePlanetTexture(r, g, b, bR, bG, bB, hasRing, rR, rG, rB) {
  return makeCanvasTexture(128, 128, function(cx, w, h) {
    var px = w/2, py = h/2, pr = 24;
    var pGrad = cx.createRadialGradient(px - 6, py - 6, 3, px, py, pr);
    pGrad.addColorStop(0, 'rgba(' + Math.min(r+70,255) + ',' + Math.min(g+70,255) + ',' + Math.min(b+70,255) + ',1)');
    pGrad.addColorStop(0.45, 'rgba(' + r + ',' + g + ',' + b + ',1)');
    pGrad.addColorStop(1, 'rgba(' + Math.floor(r*0.2) + ',' + Math.floor(g*0.2) + ',' + Math.floor(b*0.2) + ',0.9)');
    cx.fillStyle = pGrad;
    cx.beginPath(); cx.arc(px, py, pr, 0, Math.PI * 2); cx.fill();
    for (var pbi = 0; pbi < 3; pbi++) {
      var bcy = py - 10 + pbi * 10;
      cx.save();
      cx.beginPath();
      cx.ellipse(px, bcy, pr * 0.95, pr * 0.18, 0, 0, Math.PI * 2);
      cx.clip();
      cx.fillStyle = 'rgba(' + bR + ',' + bG + ',' + bB + ',0.25)'; cx.fillRect(0, 0, w, h);
      cx.restore();
    }
    var atmo = cx.createRadialGradient(px, py, pr * 0.85, px, py, pr * 1.45);
    atmo.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',0.35)');
    atmo.addColorStop(1, 'rgba(0,0,0,0)');
    cx.fillStyle = atmo; cx.fillRect(0, 0, w, h);
    if (hasRing) {
      cx.save(); cx.translate(px, py); cx.scale(1.0, 0.32);
      cx.strokeStyle = 'rgba(' + rR + ',' + rG + ',' + rB + ',0.55)'; cx.lineWidth = 6;
      cx.beginPath(); cx.arc(0, 0, pr * 1.65, 0, Math.PI * 2); cx.stroke();
      cx.strokeStyle = 'rgba(' + rR + ',' + rG + ',' + rB + ',0.35)'; cx.lineWidth = 4;
      cx.beginPath(); cx.arc(0, 0, pr * 1.95, 0, Math.PI * 2); cx.stroke();
      cx.strokeStyle = 'rgba(' + rR + ',' + rG + ',' + rB + ',0.15)'; cx.lineWidth = 8;
      cx.beginPath(); cx.arc(0, 0, pr * 2.2, 0, Math.PI * 2); cx.stroke();
      cx.restore();
    }
  });
}
function makeMoonTexture(r, g, b) {
  return makeCanvasTexture(64, 64, function(cx, w, h) {
    var mx = w/2, my = h/2, mr = 8;
    var mGrad = cx.createRadialGradient(mx - 2, my - 2, 1, mx, my, mr);
    mGrad.addColorStop(0, 'rgba(' + Math.min(r+50,255) + ',' + Math.min(g+50,255) + ',' + Math.min(b+50,255) + ',0.95)');
    mGrad.addColorStop(0.7, 'rgba(' + r + ',' + g + ',' + b + ',0.8)');
    mGrad.addColorStop(1, 'rgba(' + Math.floor(r*0.4) + ',' + Math.floor(g*0.4) + ',' + Math.floor(b*0.4) + ',0.4)');
    cx.fillStyle = mGrad; cx.beginPath(); cx.arc(mx, my, mr, 0, Math.PI * 2); cx.fill();
    cx.fillStyle = 'rgba(0,0,0,0.12)';
    cx.beginPath(); cx.arc(mx - 2, my + 2, 2.5, 0, Math.PI * 2); cx.fill();
    cx.beginPath(); cx.arc(mx + 3, my - 1, 1.5, 0, Math.PI * 2); cx.fill();
  });
}
var pTex1 = makePlanetTexture(220, 180, 100, 240, 200, 120, true, 230, 210, 150);
var planet1 = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 4.0),
  new THREE.MeshBasicMaterial({ map: pTex1, transparent: true, depthWrite: false, fog: false }));
planet1.position.set(-28, 9, -2);
planet1.rotation.y = Math.PI / 2;
scene.add(planet1);
var pTex2 = makePlanetTexture(80, 130, 220, 100, 160, 240, false, 0, 0, 0);
var planet2 = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8),
  new THREE.MeshBasicMaterial({ map: pTex2, transparent: true, depthWrite: false, fog: false }));
planet2.position.set(-22, 10, 5);
planet2.rotation.y = Math.PI / 2;
scene.add(planet2);
var pTex3 = makePlanetTexture(210, 90, 60, 230, 110, 70, false, 0, 0, 0);
var planet3 = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8),
  new THREE.MeshBasicMaterial({ map: pTex3, transparent: true, depthWrite: false, fog: false }));
planet3.position.set(-40, 7.5, -6);
planet3.rotation.y = Math.PI / 2;
scene.add(planet3);
var moonTex1 = makeMoonTexture(195, 190, 175);
var moonTex2 = makeMoonTexture(150, 165, 200);
var moonTex3 = makeMoonTexture(210, 180, 120);
var moon1 = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8),
  new THREE.MeshBasicMaterial({ map: moonTex1, transparent: true, depthWrite: false, fog: false }));
moon1.position.set(-28, 9.6, 0.5);
moon1.rotation.y = Math.PI / 2;
scene.add(moon1);
var moon2 = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.55),
  new THREE.MeshBasicMaterial({ map: moonTex2, transparent: true, depthWrite: false, fog: false }));
moon2.position.set(-22, 9.3, 6.8);
moon2.rotation.y = Math.PI / 2;
scene.add(moon2);
var moon3 = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6),
  new THREE.MeshBasicMaterial({ map: moonTex3, transparent: true, depthWrite: false, fog: false }));
moon3.position.set(-28, 8.2, -4.1);
moon3.rotation.y = Math.PI / 2;
scene.add(moon3);

// ---- STARS ----
var celStarTex = makeCanvasTexture(32, 32, function(cx, w, h) {
  var sGrad = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
  sGrad.addColorStop(0, 'rgba(255,255,255,1)');
  sGrad.addColorStop(0.12, 'rgba(255,255,255,0.9)');
  sGrad.addColorStop(0.35, 'rgba(255,255,255,0.2)');
  sGrad.addColorStop(1, 'rgba(255,255,255,0)');
  cx.fillStyle = sGrad; cx.fillRect(0, 0, w, h);
});
var starCols = [
  new THREE.Color(1.0, 1.0, 1.0),
  new THREE.Color(0.78, 0.87, 1.0),
  new THREE.Color(1.0, 0.95, 0.72),
  new THREE.Color(1.0, 0.78, 0.42),
  new THREE.Color(1.0, 0.55, 0.55),
  new THREE.Color(0.7, 0.7, 1.0),
  new THREE.Color(0.82, 1.0, 0.88),
];
var celStars = [];
for (var csi = 0; csi < 140; csi++) {
  var csMat = new THREE.SpriteMaterial({
    map: celStarTex,
    color: starCols[Math.floor(Math.random() * starCols.length)],
    transparent: true,
    opacity: 0.5 + Math.random() * 0.5
  });
  csMat.fog = false;
  var csSpr = new THREE.Sprite(csMat);
  csSpr.position.set(-15 - Math.random() * 45, 5 + Math.random() * 10, (Math.random() - 0.5) * 30);
  var csS = 0.2 + Math.random() * 0.65;
  csSpr.scale.set(csS, csS, 1);
  scene.add(csSpr);
  celStars.push({ spr: csSpr, baseOp: csMat.opacity, twSpd: 0.4 + Math.random() * 2.8, twOff: Math.random() * Math.PI * 2 });
}
for (var hsi = 0; hsi < 18; hsi++) {
  var hsMat = new THREE.SpriteMaterial({
    map: celStarTex,
    color: starCols[Math.floor(Math.random() * starCols.length)],
    transparent: true,
    opacity: 0.85 + Math.random() * 0.15
  });
  hsMat.fog = false;
  var hsSpr = new THREE.Sprite(hsMat);
  hsSpr.position.set(-15 - Math.random() * 40, 6 + Math.random() * 10, (Math.random() - 0.5) * 25);
  var hsS = 0.65 + Math.random() * 1.0;
  hsSpr.scale.set(hsS, hsS, 1);
  scene.add(hsSpr);
  celStars.push({ spr: hsSpr, baseOp: hsMat.opacity, twSpd: 0.2 + Math.random() * 1.2, twOff: Math.random() * Math.PI * 2 });
}

// Satellites — tiny steady points tracking slowly across the field
var satellites = [];
for (var svi = 0; svi < 2; svi++) {
  var svMat = new THREE.SpriteMaterial({
    map: celStarTex, color: 0xfff4dc, transparent: true, opacity: 0.85
  });
  svMat.fog = false;
  var svSpr = new THREE.Sprite(svMat);
  var svS = 0.14 + svi * 0.04;
  svSpr.scale.set(svS, svS, 1);
  scene.add(svSpr);
  satellites.push({
    spr: svSpr,
    x: -28 - svi * 14,
    baseY: 9 + svi * 4,
    z0: svi * 11,
    vz: (svi === 0 ? 0.34 : -0.26),
    yOff: svi * 2.1
  });
}

// Shooting stars — streak sprites that fire now and then, then rest
var shootTex = makeCanvasTexture(128, 16, function(cx, w, h) {
  var sg = cx.createLinearGradient(0, 0, w, 0);
  sg.addColorStop(0, 'rgba(255, 255, 255, 0)');
  sg.addColorStop(0.55, 'rgba(200, 215, 255, 0.35)');
  sg.addColorStop(0.85, 'rgba(255, 255, 255, 0.95)');
  sg.addColorStop(1, 'rgba(255, 255, 255, 0)');
  cx.fillStyle = sg; cx.fillRect(0, h * 0.3, w, h * 0.4);
  var head = cx.createRadialGradient(w * 0.88, h * 0.5, 0, w * 0.88, h * 0.5, h * 0.5);
  head.addColorStop(0, 'rgba(255, 255, 255, 1)');
  head.addColorStop(1, 'rgba(255, 255, 255, 0)');
  cx.fillStyle = head;
  cx.fillRect(w * 0.8, 0, w * 0.2, h);
});
var shooters = [];
for (var shi = 0; shi < 2; shi++) {
  var shMat = new THREE.SpriteMaterial({ map: shootTex, transparent: true, opacity: 0 });
  shMat.fog = false;
  var shSpr = new THREE.Sprite(shMat);
  shSpr.scale.set(3.4, 0.24, 1);
  scene.add(shSpr);
  shooters.push({ spr: shSpr, active: false, next: 5 + shi * 9 + Math.random() * 6, t0: 0, sy: 0, sz: 0, sx: 0, vy: 0, vz: 0 });
}

// The heavens on two rigs, both wheeled in the animate loop: the deep sky
// (stars, Milky Way, nebulae) turns at full rate; the planets and moons ride
// a slower rig, drifting against the star field like nearer bodies would
var skyGroup = new THREE.Group();
var skyBodies = [milkyPlane, galaxyMesh, nebula1, nebula2, nebula3, nebula4];
for (var sbi = 0; sbi < skyBodies.length; sbi++) skyGroup.add(skyBodies[sbi]);
for (var sci = 0; sci < celStars.length; sci++) skyGroup.add(celStars[sci].spr);
for (var svg = 0; svg < satellites.length; svg++) skyGroup.add(satellites[svg].spr);
for (var shg = 0; shg < shooters.length; shg++) skyGroup.add(shooters[shg].spr);
scene.add(skyGroup);
var planetGroup = new THREE.Group();
var planetBodies = [planet1, planet2, planet3, moon1, moon2, moon3];
for (var pbi = 0; pbi < planetBodies.length; pbi++) planetGroup.add(planetBodies[pbi]);
scene.add(planetGroup);

// ============================================================
// LIGHTING
// ============================================================
scene.add(new THREE.AmbientLight(0x1a1a2a, 0.11));

var moonLight = new THREE.DirectionalLight(0x4455aa, 0.12);
moonLight.position.set(5, 20, 10);
moonLight.castShadow = true;
scene.add(moonLight);

var fillLight = new THREE.DirectionalLight(0x2233aa, 0.05);
fillLight.position.set(-5, 10, -5);
scene.add(fillLight);

// ============================================================
// FOG VOLUMES (4 layers with individual drift)
// ============================================================
var thickFogTex = makeCanvasTexture(128, 128, function(cx, w, h) {
  var grad = cx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  grad.addColorStop(0, 'rgba(180, 170, 155, 0.25)');
  grad.addColorStop(0.4, 'rgba(150, 140, 130, 0.12)');
  grad.addColorStop(1, 'rgba(120, 110, 100, 0)');
  cx.fillStyle = grad;
  cx.fillRect(0, 0, w, h);
});

var thinFogTex = makeCanvasTexture(128, 128, function(cx, w, h) {
  var grad = cx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  grad.addColorStop(0, 'rgba(140, 135, 125, 0.15)');
  grad.addColorStop(0.6, 'rgba(120, 115, 105, 0.06)');
  grad.addColorStop(1, 'rgba(100, 95, 85, 0)');
  cx.fillStyle = grad;
  cx.fillRect(0, 0, w, h);
});

var warmFogTex = makeCanvasTexture(128, 128, function(cx, w, h) {
  var grad = cx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  grad.addColorStop(0, 'rgba(200, 160, 100, 0.12)');
  grad.addColorStop(0.5, 'rgba(180, 140, 80, 0.05)');
  grad.addColorStop(1, 'rgba(150, 120, 60, 0)');
  cx.fillStyle = grad;
  cx.fillRect(0, 0, w, h);
});

var fogSprites = [];

// Layer 1: Ground-hugging thick fog
for (var i = 0; i < 50; i++) {
  var fogMat = new THREE.SpriteMaterial({ map: thickFogTex, transparent: true, opacity: 0.18 + Math.random() * 0.18 });
  var fogSprite = new THREE.Sprite(fogMat);
  fogSprite.position.set(Math.random() * 40 - 15, 0.3 + Math.random() * 2, Math.random() * 30 - 5);
  var s = 5 + Math.random() * 12;
  fogSprite.scale.set(s, s * 0.35, 1);
  scene.add(fogSprite);
  fogSprites.push({
    sprite: fogSprite,
    baseX: fogSprite.position.x,
    drift: 0.002 + Math.random() * 0.006,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.001 + Math.random() * 0.004,
    swayAmt: 0.4 + Math.random() * 1.0
  });
}

// Layer 2: Mid-height fog
for (var i = 0; i < 30; i++) {
  var midFogMat = new THREE.SpriteMaterial({ map: thinFogTex, transparent: true, opacity: 0.1 + Math.random() * 0.12 });
  var midFog = new THREE.Sprite(midFogMat);
  midFog.position.set(Math.random() * 35 - 12, 2 + Math.random() * 6, Math.random() * 30 - 5);
  var ms = 6 + Math.random() * 14;
  midFog.scale.set(ms, ms * 0.3, 1);
  scene.add(midFog);
  fogSprites.push({
    sprite: midFog,
    baseX: midFog.position.x,
    drift: 0.001 + Math.random() * 0.004,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.0008 + Math.random() * 0.003,
    swayAmt: 0.5 + Math.random() * 1.5
  });
}

// Layer 3: Warm tinted fog near building
for (var i = 0; i < 15; i++) {
  var warmFogMat = new THREE.SpriteMaterial({ map: warmFogTex, transparent: true, opacity: 0.12 + Math.random() * 0.1 });
  var warmFog = new THREE.Sprite(warmFogMat);
  warmFog.position.set(Math.random() * 10 - 3, 0.5 + Math.random() * 3, 1 + Math.random() * 6);
  var ws = 4 + Math.random() * 8;
  warmFog.scale.set(ws, ws * 0.3, 1);
  scene.add(warmFog);
  fogSprites.push({
    sprite: warmFog,
    baseX: warmFog.position.x,
    drift: 0.001 + Math.random() * 0.003,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.001 + Math.random() * 0.003,
    swayAmt: 0.3 + Math.random() * 0.8
  });
}

// Layer 4: High wisps
for (var i = 0; i < 12; i++) {
  var highFogMat = new THREE.SpriteMaterial({ map: thinFogTex, transparent: true, opacity: 0.06 + Math.random() * 0.08 });
  var highFog = new THREE.Sprite(highFogMat);
  highFog.position.set(Math.random() * 30 - 10, 8 + Math.random() * 8, Math.random() * 20 - 5);
  var hs = 10 + Math.random() * 15;
  highFog.scale.set(hs, hs * 0.2, 1);
  scene.add(highFog);
  fogSprites.push({
    sprite: highFog,
    baseX: highFog.position.x,
    drift: 0.003 + Math.random() * 0.005,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.0005 + Math.random() * 0.002,
    swayAmt: 1.0 + Math.random() * 2.0
  });
}

// ============================================================
// ANIMATION LOOP
// ============================================================
var clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  var t = rsStill ? 6 : clock.getElapsedTime();

  // Fog sprite drift (each sprite has individual drift and sway; held under reduced motion)
  for (var i = 0; i < (rsStill ? 0 : fogSprites.length); i++) {
    var f = fogSprites[i];
    f.sway += f.swaySpeed;
    f.sprite.position.x = f.baseX + Math.sin(f.sway) * f.swayAmt;
    f.baseX += f.drift;
    if (f.baseX > 25) f.baseX = -25;
  }

  // ---- PUDDLE SHIMMER ANIMATION ----
  for (var pi = 0; pi < scene.children.length; pi++) {
    var child = scene.children[pi];
    if (child.userData && child.userData.puddleIndex !== undefined) {
      var shimmerAmount = 0.3 + Math.sin(t * 3.0 + child.userData.puddleIndex) * 0.05;
      child.material.opacity = shimmerAmount;
    }
  }

  // Neon light held near-steady so the brickwork above no longer strobes;
  // the flashing now lives inside the windows instead
  neonLight.intensity = 1.2 + Math.sin(t * 3.5) * 0.02;
  rsNeonRefl.material.opacity = 0.115 + Math.sin(t * 3.5) * 0.012 + Math.sin(t * 0.7) * 0.01;

  // Lit rooms flicker from within — slow breathing plus sudden brighter flares,
  // done by dimming the painted room's brightness rather than its opacity
  for (var lgi = 0; lgi < litGlassMats.length; lgi++) {
    var lg = litGlassMats[lgi];
    var lgLevel = 0.72 + Math.sin(t * lg.spd + lg.off) * 0.14;
    if (Math.sin((t + lg.off) * 0.9) * Math.sin((t + lg.off) * 2.17) > 0.93) {
      lgLevel = 1.0;
    }
    lg.mat.color.setScalar(lgLevel);
  }

  // Green neon flicker (slightly different frequency)
  neonLightGreen.intensity = 0.3 + Math.sin(t * 4.1) * 0.06 + Math.sin(t * 8.5) * 0.03;

  // Cosmogramma side sign — tired electrics: mostly lit, with stuttering dark drops
  var sgGate = Math.sin(t * 2.3) * Math.sin(t * 5.7);
  var sgLevel = 0.94 + Math.sin(t * 11) * 0.06;
  if (sgGate > 0.88) sgLevel = 0.2 + Math.random() * 0.35;
  rightFaciaSideMesh.material.color.setScalar(sgLevel);

  // Street lamp flicker
  lampLight1.intensity = 0.7 + Math.sin(t * 2.2) * 0.08;
  lampLight2.intensity = 0.7 + Math.sin(t * 2.0 + 1.0) * 0.08;

  // Camera subtle breathing
  var camBreath = Math.sin(t * 0.3) * 0.03 + Math.sin(t * 0.17) * 0.02;
  camera.position.y = 1.7 + camBreath;
  camera.position.x = 8 + Math.sin(t * 0.08) * 0.04;

  // ---- CELESTIAL ANIMATION ----
  for (var csti = 0; csti < celStars.length; csti++) {
    var cst = celStars[csti];
    cst.spr.material.opacity = cst.baseOp * (0.62 + Math.sin(t * cst.twSpd + cst.twOff) * 0.38);
  }
  galaxyMesh.rotation.z = 0.35 + t * 0.0022;
  nebula1.position.z = -2 + Math.sin(t * 0.038) * 0.3;
  nebula2.position.y = 8 + Math.sin(t * 0.055) * 0.2;
  nebula3.rotation.z = Math.sin(t * 0.024) * 0.04;
  nebula4.position.z = -7 + Math.sin(t * 0.041 + 1.0) * 0.22;
  milkyPlane.material.opacity = 0.88 + Math.sin(t * 0.065) * 0.06;
  moon1.position.y = 9 + Math.sin(t * 0.11) * 0.9;
  moon1.position.z = -2 + Math.cos(t * 0.11) * 2.5;
  moon2.position.y = 10 + Math.sin(t * 0.085 + 1.2) * 0.65;
  moon2.position.z = 5 + Math.cos(t * 0.085 + 1.2) * 1.8;

  // The heavens wheel — stars at full rate, planets lagging behind them
  skyGroup.rotation.x = t * 0.015;
  planetGroup.rotation.x = t * 0.008;

  // Satellites — slow steady drift across the star field, wrapping round
  for (var svj = 0; svj < satellites.length; svj++) {
    var sv = satellites[svj];
    var svz = sv.z0 + t * sv.vz;
    svz = ((svz + 15) % 30 + 30) % 30 - 15;
    sv.spr.position.set(sv.x, sv.baseY + Math.sin(t * 0.09 + sv.yOff) * 0.6, svz);
  }

  // Shooting stars — brief streaks, then a long rest
  for (var shj = 0; shj < shooters.length; shj++) {
    var sh = shooters[shj];
    if (!sh.active && t > sh.next) {
      sh.active = true; sh.t0 = t;
      sh.sx = -25 - Math.random() * 20;
      sh.sy = 12 + Math.random() * 5;
      sh.sz = (Math.random() - 0.5) * 24;
      var shDir = Math.random() < 0.5 ? 1 : -1;
      sh.vz = shDir * (9 + Math.random() * 6);
      sh.vy = -(3.5 + Math.random() * 2.5);
      sh.spr.material.rotation = Math.atan2(sh.vy, -sh.vz);
    }
    if (sh.active) {
      var shT = t - sh.t0;
      if (shT > 0.85) {
        sh.active = false;
        sh.spr.material.opacity = 0;
        sh.next = t + 7 + Math.random() * 12;
      } else {
        sh.spr.position.set(sh.sx, sh.sy + sh.vy * shT, sh.sz + sh.vz * shT);
        sh.spr.material.opacity = Math.sin(Math.PI * shT / 0.85) * 0.9;
      }
    }
  }
  moon3.position.y = 9 + Math.sin(t * 0.13 + Math.PI) * 0.78;
  moon3.position.z = -2 + Math.cos(t * 0.13 + Math.PI) * 2.1;

    if (typeof dssComposerLocal !== 'undefined' && dssComposerLocal) { dssComposerLocal.render(); } else { renderer.render(scene, camera); }
}

animate();

document.body.appendChild(rsWrap);

// ============================================================
// VIGNETTE EFFECT
// ============================================================
rsVig = document.createElement('canvas');
rsVig.width = 256; rsVig.height = 256;
var vigCtx = rsVig.getContext('2d');
var vigGrad = vigCtx.createRadialGradient(128, 128, 0, 128, 128, 180);
vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
vigGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
vigCtx.fillStyle = vigGrad;
vigCtx.fillRect(0, 0, 256, 256);

// ============================================================
// GRAIN EFFECT
// ============================================================
rsGrain = document.createElement('canvas');
rsGrain.width = 512; rsGrain.height = 512;
rsGrainCtx = rsGrain.getContext('2d');

// ============================================================
// DATE STAMP & LOCATION LABEL
// ============================================================

rsLoc = document.createElement('div');
rsLoc.id = 'rs-location';
rsLoc.style.cssText = 'position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font:12px "Courier New", monospace;color:rgba(200,180,140,0.4);letter-spacing:2px;pointer-events:none;z-index:9001;';
rsLoc.textContent = "RONNIE’S, FRITH STREET, SOHO";
rsWrap.appendChild(rsLoc);

// ============================================================
// ENTER BUTTON
// ============================================================
rsBtn = document.createElement('div');
rsBtn.id = 'rs-enter-btn';
rsBtn.style.cssText = 'position:absolute;bottom:60px;left:50%;transform:translateX(-50%);font:13px "Courier New",monospace;color:rgba(200,140,100,0.85);cursor:pointer;user-select:none;z-index:9001;letter-spacing:2px;padding:8px 18px;border:1px solid rgba(200,140,100,0.35);opacity:0;transition:opacity 1.2s ease, color 0.3s ease, border-color 0.3s ease;';
rsBtn.textContent = "ENTER RONNIE SCOTT’S";
rsBtn.addEventListener('mouseenter', function() { rsBtn.style.color = 'rgba(255,160,100,0.95)'; rsBtn.style.borderColor = 'rgba(232,120,24,0.6)'; });
rsBtn.addEventListener('mouseleave', function() { rsBtn.style.color = 'rgba(200,140,100,0.85)'; rsBtn.style.borderColor = 'rgba(200,140,100,0.35)'; });
rsBtn.addEventListener('click', function() {
  rsAnimId = null;
  rsActive = false;
  rsWrap.remove();
  // Find the · navigation link specifically — NOT the first tw-link in the
  // passage, which would be the ← Back link sitting above the
  // rs-container in the source. That bug used to take the player back to
  // whatever passage they came from (e.g. the Colony) instead of into the
  // club.
  var cont = document.getElementById('rs-container');
  if (!cont) return;
  var links = cont.parentElement.querySelectorAll('tw-link, .enchantment-link');
  for (var i = 0; i < links.length; i++) {
    if (links[i].textContent.trim() === '·') { links[i].click(); return; }
  }
});
rsWrap.appendChild(rsBtn);
setTimeout(function() { rsBtn.style.opacity = '1'; }, 1500);

// ============================================================
// ANIMATION LOOP WITH EFFECTS
// ============================================================
var animFrame = 0;
function renderRS() {
  rsAnimId = requestAnimationFrame(renderRS);
  
  if (typeof dssComposerLocal !== 'undefined' && dssComposerLocal) { dssComposerLocal.render(); } else { renderer.render(scene, camera); }
  
  // Vignette overlay
  var vCtx = rsWrap.getContext ? null : document.createElement('canvas');
  var tempCanvas = document.createElement('canvas');
  tempCanvas.width = rsWrap.clientWidth;
  tempCanvas.height = rsWrap.clientHeight;
  var tCtx = tempCanvas.getContext('2d');
  
  // Grain effect
  animFrame++;
  rsGrainFrame = (rsGrainFrame + 1) % 8;
  if (rsGrainFrame === 0 && !(rsStill && animFrame > 8)) {
    for (var gy = 0; gy < rsGrain.height; gy++) {
      for (var gx = 0; gx < rsGrain.width; gx++) {
        var v = Math.floor(Math.random() * 256);
        rsGrainCtx.fillStyle = 'rgba(' + v + ',' + v + ',' + v + ',0.03)';
        rsGrainCtx.fillRect(gx, gy, 1, 1);
      }
    }
  }
}

renderRS();

}

// ============================================================
// CONTAINER WATCHER — polls for appear/disappear
// ============================================================
setInterval(function() {
  var cont = document.getElementById('rs-container');
  if (cont && !rsActive) {
    initRonnieScotts();
  } else if (!cont) {
    if (rsAnimId !== null) { cancelAnimationFrame(rsAnimId); rsAnimId = null; }
    rsActive = false;
    window._dssDisposeWrap('rs-wrap');
  }
}, 300);

})();

