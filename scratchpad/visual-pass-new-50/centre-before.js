// ====== CENTRE POINT SCENE — INLINE ======
(function() {
var cpActive = false;
var cpAnimId = null;

function initCentrePoint() {
if (cpActive) return;
cpActive = true;
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(buildCPScene) : buildCPScene()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(buildCPScene) : buildCPScene());
}
}

function buildCPScene() {
// Reduced-motion: hold one settled frame (uplights steady, ladder pulse parked, fog still).
var cpStill = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var cpWrap = document.createElement('div');
cpWrap.id = 'cp-wrap';
cpWrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9000;background:#060810;';

// ============================================================
// HELPERS (defined first — used by materials below)
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
cpScene.add(m);
return m;
}

// ============================================================
// SCENE SETUP
// ============================================================
var cpScene = new THREE.Scene();
cpScene.background = new THREE.Color(0x060810);
cpScene.fog = new THREE.Fog(0x060810, 45, 220);

var cpCamera = new THREE.PerspectiveCamera(82, window.innerWidth / window.innerHeight, 0.1, 300);
cpCamera.position.set(0.6, 1.2, 5.0);
cpCamera.lookAt(0.3, 28, -2);

var cpRenderer;
try {
  cpRenderer = new THREE.WebGLRenderer({ antialias: true });
  cpRenderer.setSize(window.innerWidth, window.innerHeight);
  cpRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  cpRenderer.shadowMap.enabled = true;
  cpRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  cpRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  cpRenderer.toneMappingExposure = 0.55;
  cpWrap.appendChild(cpRenderer.domElement);
  window._dssBindScene('cp-wrap', cpScene, cpRenderer, cpCamera);
var dssComposerLocal = window.dssMakeComposer ? window.dssMakeComposer(cpScene, cpCamera, cpRenderer, { focus: 40, aperture: 0.0001, maxblur: 0.002 }) : null;
if (window.dssFilmGrade) window.dssFilmGrade(document.getElementById('cp-wrap'));
} catch (e) {
  /* WebGL unavailable (Chrome's GPU process is unhealthy or too many contexts
     are active). Skip the 3D ladder; build a plain fallback so the player can
     still click CLIMB IT and progress through to the ending. The fallback uses
     the same CLIMB IT button styling created further down so it visually
     matches; we just stop the WebGL pipeline here. */
  console.warn('[DSS] WebGL unavailable for Centre Point — falling back to plain CLIMB IT button.', e);
  var fbCaption = document.createElement('div');
  fbCaption.textContent = 'Every man and every woman is a star.';
  fbCaption.style.cssText = 'position:fixed;bottom:110px;left:0;right:0;text-align:center;font-family:"Playfair Display",Georgia,serif;font-size:14px;color:#f5d070;letter-spacing:0.18em;text-transform:uppercase;pointer-events:none;z-index:9003;white-space:nowrap;text-shadow:0 0 8px rgba(245,208,112,0.55),0 0 16px rgba(245,208,112,0.25),0 0 2px rgba(8,6,4,0.95);';
  cpWrap.appendChild(fbCaption);
  var fbBtn = document.createElement('button');
  fbBtn.className = 'dss-climb-button';
  fbBtn.type = 'button';
  fbBtn.textContent = 'CLIMB IT';
  fbBtn.style.cssText = 'position:fixed;bottom:40px;left:50%;transform:translateX(-50%);padding:16px 42px;font:bold 20px "Courier New",monospace;color:rgba(255,255,250,1);border:2px solid rgba(255,252,232,1);letter-spacing:5px;white-space:nowrap;cursor:pointer;z-index:9004;background:rgba(255,236,176,0.22);box-shadow:0 0 18px rgba(255,240,180,0.55),0 0 42px rgba(255,228,148,0.35),inset 0 0 14px rgba(255,248,212,0.25);text-shadow:0 0 8px rgba(255,255,255,1),0 0 18px rgba(255,252,220,1),0 0 36px rgba(255,236,168,0.85),0 0 58px rgba(255,220,140,0.55),0 0 2px rgba(8,6,4,0.85);';
  fbBtn.addEventListener('click', function() {
    var links = document.querySelectorAll('tw-link, .enchantment-link');
    for (var i = 0; i < links.length; i++) {
      if (links[i].textContent.trim() === '·') { links[i].click(); break; }
    }
  });
  cpWrap.appendChild(fbBtn);
  document.body.appendChild(cpWrap);
  return;
}

// ============================================================
// MATERIALS
// ============================================================

// Centre Point's distinctive off-white precast concrete panels
// with a slightly grainy aggregate finish — Portland stone dust mixed in
var concreteTex = makeCanvasTexture(512, 512, function(cx, w, h) {
// Base off-white — not pure white, slightly warm and aged
cx.fillStyle = '#cdc8bc';
cx.fillRect(0, 0, w, h);
// Aggregate texture — fine pebbled surface
for (var i = 0; i < 3000; i++) {
var gx = Math.random() * w;
var gy = Math.random() * h;
var gr = 0.8 + Math.random() * 1.8;
var tone = 150 + Math.random() * 60;
cx.fillStyle = 'rgba(' + tone + ',' + (tone-5) + ',' + (tone-10) + ',0.35)';
cx.beginPath();
cx.arc(gx, gy, gr, 0, Math.PI * 2);
cx.fill();
}
// Pollution staining — London grime running down from the top
var soot = cx.createLinearGradient(0, 0, 0, h);
soot.addColorStop(0,   'rgba(40, 38, 32, 0.18)');
soot.addColorStop(0.2, 'rgba(40, 38, 32, 0.08)');
soot.addColorStop(0.6, 'rgba(0,0,0,0)');
soot.addColorStop(1,   'rgba(40, 38, 32, 0.06)');
cx.fillStyle = soot;
cx.fillRect(0, 0, w, h);
// Rain streak staining
cx.strokeStyle = 'rgba(80, 75, 65, 0.05)';
cx.lineWidth = 1.5;
for (var rs = 0; rs < 18; rs++) {
cx.beginPath();
var rx = Math.random() * w;
cx.moveTo(rx, 0);
for (var ry = 0; ry < h; ry += 25) {
rx += (Math.random() - 0.5) * 3;
cx.lineTo(rx, ry);
}
cx.stroke();
}
});
var concreteMat = new THREE.MeshStandardMaterial({
map: concreteTex, roughness: 0.88, metalness: 0.0
});

// The dark recessed concrete between the honeycomb cells
var recessMat = new THREE.MeshStandardMaterial({
color: 0x1a1a18, roughness: 0.92
});

// Dark glass in the honeycomb windows — slightly reflective, 1973 tinted glass
var darkGlassTex = makeCanvasTexture(128, 128, function(cx, w, h) {
cx.fillStyle = '#080c10';
cx.fillRect(0, 0, w, h);
// Faint reflection — sky and light caught in the glass
var refl = cx.createLinearGradient(0, 0, w, h);
refl.addColorStop(0,   'rgba(60, 70, 90, 0.25)');
refl.addColorStop(0.4, 'rgba(20, 25, 35, 0.10)');
refl.addColorStop(1,   'rgba(5, 8, 12, 0.05)');
cx.fillStyle = refl;
cx.fillRect(0, 0, w, h);
});
var darkGlass = new THREE.MeshStandardMaterial({
map: darkGlassTex, roughness: 0.15, metalness: 0.55,
color: 0x0a0e14
});

// A few windows warmly lit — offices working late
var warmGlass = new THREE.MeshStandardMaterial({
color: 0x1a0c02, roughness: 0.3,
emissive: 0xd07020, emissiveIntensity: 0.28
});

// Very faintly lit window — fluorescent strip light, cold
var coldGlass = new THREE.MeshStandardMaterial({
color: 0x080c10, roughness: 0.3,
emissive: 0x8090b0, emissiveIntensity: 0.08
});

// Ground pavement
var paveTex = makeCanvasTexture(512, 512, function(cx, w, h) {
cx.fillStyle = '#484840';
cx.fillRect(0, 0, w, h);
// Concrete paving slabs
cx.strokeStyle = 'rgba(20, 18, 14, 0.55)';
cx.lineWidth = 3;
for (var gx = 0; gx <= w; gx += 128) {
cx.beginPath(); cx.moveTo(gx, 0); cx.lineTo(gx, h); cx.stroke();
}
for (var gy = 0; gy <= h; gy += 128) {
cx.beginPath(); cx.moveTo(0, gy); cx.lineTo(w, gy); cx.stroke();
}
// Surface grime and oil stains
cx.fillStyle = 'rgba(25, 22, 16, 0.15)';
for (var st = 0; st < 12; st++) {
cx.beginPath();
cx.ellipse(Math.random()*w, Math.random()*h, 10+Math.random()*30, 6+Math.random()*18, Math.random()*Math.PI, 0, Math.PI*2);
cx.fill();
}
});
var paveMat = new THREE.MeshStandardMaterial({ map: paveTex, roughness: 0.92 });

// ============================================================
// GROUND
// ============================================================
var ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), paveMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
cpScene.add(ground);

// ============================================================
// CENTRE POINT TOWER
// ============================================================
// The building is a cylindrical-ish tower with a hexagonal/faceted
// plan. Each face of the tower has the distinctive deep-set honeycomb
// window grid: horizontal bands of precast concrete framing
// large trapezoidal glazed bays.
//
// We build it as a CylinderGeometry core (the structural mass)
// then tile the honeycomb facade panels onto the visible faces.

var tower = new THREE.Group();

// ----- CORE SHAFT -----
// 34-storey tower. In 1973 it dominated the Tottenham Court Road skyline.
// Scale: ~0.7 units per storey, so total ~24 units tall.
var STOREYS = 34;
var STOREY_H = 0.72;
var TOWER_H = STOREYS * STOREY_H;
var TOWER_R = 2.8;

// Octagonal core — the structural body
var coreGeo = new THREE.CylinderGeometry(TOWER_R, TOWER_R + 0.2, TOWER_H, 8, 1);
var core = new THREE.Mesh(coreGeo, recessMat);
core.position.set(0, TOWER_H / 2, 0);
tower.add(core);

// ----- HONEYCOMB FACADE PANELS -----
// Centre Point's signature: each storey has deep-set concrete ribs
// forming a diamond/hexagonal grid on the facade.
// We'll tile this on the front 3 faces of the octagon.

// Each honeycomb cell: a concrete surround (thick, projected forward)
// with a recessed glass pane inside.
// Cell dimensions roughly: 0.65 wide × 0.68 tall

var CELL_W = 0.62;
var CELL_H = 0.66;
var PANEL_DEPTH = 0.18;
var GLASS_INSET = 0.12;

// The angled faces of the octagon — we'll cover faces at angles:
// 0° (front), ±45° (front-flanks), and partially ±90° (sides)
var facadeAngles = [0, -45, 45, -90, 90];
var facadeWidths = [5.0, 3.5, 3.5, 2.2, 2.2];

// Random seed for consistent window lighting
var winStates = [];
for (var w = 0; w < 2000; w++) {
var r = Math.random();
winStates.push(r < 0.08 ? 'warm' : r < 0.13 ? 'cold' : 'dark');
}

var warmWindows = [];
var winIdx = 0;

facadeAngles.forEach(function(angleDeg, fi) {
var angleRad = angleDeg * Math.PI / 180;
var fWidth   = facadeWidths[fi];

// Position of this face: on the surface of the octagon
var faceDist = TOWER_R * Math.cos(Math.PI / 8);

var cols = Math.floor(fWidth / CELL_W);
var rows = STOREYS;

for (var row = 0; row < rows; row++) {
for (var col = 0; col < cols; col++) {

// Local position on the face
var lx = (col - (cols - 1) / 2) * CELL_W;
var ly = (row + 0.5) * CELL_H + 0.5;

// Odd rows offset by half a cell — the honeycomb stagger
if (row % 2 === 1) lx += CELL_W * 0.5;

// Concrete surround (the rib frame around each cell)
var surroundGeo = new THREE.BoxGeometry(CELL_W - 0.04, CELL_H - 0.04, PANEL_DEPTH);
var surround = new THREE.Mesh(surroundGeo, concreteMat);

// Glass pane — inset behind the surround
var glassState = winStates[winIdx % winStates.length];
winIdx++;
var glassMat = (glassState === 'warm') ? warmGlass :
(glassState === 'cold') ? coldGlass : darkGlass;

var glassGeo = new THREE.BoxGeometry(CELL_W * 0.72, CELL_H * 0.78, 0.04);
var glass = new THREE.Mesh(glassGeo, glassMat);
glass.position.z = -GLASS_INSET;

// The horizontal rib — a thin bar across the bottom of each cell
var ribGeo = new THREE.BoxGeometry(CELL_W, 0.06, PANEL_DEPTH + 0.04);
var rib = new THREE.Mesh(ribGeo, concreteMat);
rib.position.y = -(CELL_H / 2) + 0.03;

// Group the cell
var cell = new THREE.Group();
cell.add(surround);
cell.add(glass);
cell.add(rib);

// Position on the face, rotated to sit on the correct face of octagon
cell.position.set(lx, ly, faceDist);
cell.rotation.y = -angleRad;

// Rotate so x-axis aligns with the face
var worldPos = new THREE.Vector3();
var cosA = Math.cos(angleRad);
var sinA = Math.sin(angleRad);
cell.position.set(
lx * cosA - 0 * sinA,
ly,
lx * sinA + faceDist * cosA
);

if (glassState === 'warm') {
warmWindows.push({ x: cell.position.x, y: ly, z: cell.position.z });
}

tower.add(cell);
}
}
});

// ----- PODIUM / BASE -----
// The building sits on a broad podium at street level
var podiumGeo = new THREE.BoxGeometry(7, 2.0, 7);
var podium = new THREE.Mesh(podiumGeo, concreteMat);
podium.position.set(0, 1.0, 0);
tower.add(podium);

// Podium overhang / colonnade edge
var overhangGeo = new THREE.BoxGeometry(8.2, 0.25, 8.2);
var overhang = new THREE.Mesh(overhangGeo, concreteMat);
overhang.position.set(0, 2.1, 0);
tower.add(overhang);

// Colonnade pillars around the base
for (var pi = 0; pi < 8; pi++) {
var pa = (pi / 8) * Math.PI * 2;
var px = Math.sin(pa) * 3.8;
var pz = Math.cos(pa) * 3.8;
var pillarGeo = new THREE.CylinderGeometry(0.15, 0.18, 2.2, 8);
var pillar = new THREE.Mesh(pillarGeo, concreteMat);
pillar.position.set(px, 1.1, pz);
tower.add(pillar);
}

// ----- ROOF / CROWN -----
// The top of Centre Point has a distinctive recessed plant-room and
// a parapet with a slightly different profile
var roofSlab = new THREE.Mesh(
new THREE.CylinderGeometry(TOWER_R + 0.1, TOWER_R + 0.1, 0.4, 8),
concreteMat
);
roofSlab.position.set(0, TOWER_H + 0.2, 0);
tower.add(roofSlab);

// Plant room on roof
var plantRoom = new THREE.Mesh(
new THREE.BoxGeometry(3.5, 2.5, 3.5),
recessMat
);
plantRoom.position.set(0, TOWER_H + 1.65, 0);
tower.add(plantRoom);

// Roof parapet
var parapet = new THREE.Mesh(
new THREE.CylinderGeometry(TOWER_R + 0.3, TOWER_R + 0.3, 0.3, 8),
concreteMat
);
parapet.position.set(0, TOWER_H + 0.55, 0);
tower.add(parapet);

// Aviation warning light on top
var warningLight = new THREE.Mesh(
new THREE.SphereGeometry(0.12, 8, 6),
new THREE.MeshStandardMaterial({
color: 0x400000, roughness: 0.3,
emissive: 0xff2000, emissiveIntensity: 0.6
})
);
warningLight.position.set(0, TOWER_H + 3.2, 0);
tower.add(warningLight);

cpScene.add(tower);

// ============================================================
// LOWER BUILDING / PODIUM CONTEXT — the smaller block at the base
// ============================================================
// Centre Point had a lower surrounding block — shops, service access
var lowerBlock = new THREE.Mesh(
new THREE.BoxGeometry(10, 5.5, 8),
concreteMat
);
lowerBlock.position.set(0, 2.75, -3.5);
cpScene.add(lowerBlock);

// A few windows on the lower block
for (var lb = 0; lb < 6; lb++) {
var lwx = -3.5 + lb * 1.4;
var lwGlass = (Math.random() < 0.3) ? warmGlass : darkGlass;
var lwin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.06), lwGlass);
lwin.position.set(lwx, 3.8, 0.5);
cpScene.add(lwin);
}

// ============================================================
// SKY — night sky with a faint sodium glow on the horizon
// ============================================================
// Sky dome
var skyGeo = new THREE.SphereGeometry(150, 16, 8);
var skyTex = makeCanvasTexture(512, 256, function(cx, w, h) {
// Very dark blue-black night sky
var skyGrad = cx.createLinearGradient(0, 0, 0, h);
skyGrad.addColorStop(0,    '#030408');
skyGrad.addColorStop(0.5,  '#060810');
skyGrad.addColorStop(0.75, '#0c0e18');
skyGrad.addColorStop(0.85, '#1a1008');
skyGrad.addColorStop(1,    '#2a1a08');
cx.fillStyle = skyGrad;
cx.fillRect(0, 0, w, h);
// Stars — faint
cx.fillStyle = 'rgba(255,255,255,0.7)';
for (var s = 0; s < 180; s++) {
var sx = Math.random() * w;
var sy = Math.random() * h * 0.7;
var sr = 0.4 + Math.random() * 0.8;
cx.beginPath();
cx.arc(sx, sy, sr, 0, Math.PI * 2);
cx.fill();
}
});
var skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide });
var sky = new THREE.Mesh(skyGeo, skyMat);
cpScene.add(sky);

// ============================================================
// STARS
// ============================================================
var starTex = makeCanvasTexture(64, 64, function(cx, w, h) {
var g = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
g.addColorStop(0,    'rgba(255,255,255,0.95)');
g.addColorStop(0.12, 'rgba(255,255,255,0.6)');
g.addColorStop(0.4,  'rgba(200,210,255,0.15)');
g.addColorStop(1,    'rgba(0,0,0,0)');
cx.fillStyle = g;
cx.fillRect(0, 0, w, h);
});

for (var si = 0; si < 220; si++) {
var sMat = new THREE.SpriteMaterial({
map: starTex, transparent: true,
opacity: 0.3 + Math.random() * 0.7,
fog: false
});
var sSpr = new THREE.Sprite(sMat);
var sTheta = Math.random() * Math.PI * 2;
var sPhi   = 0.05 + Math.random() * 0.45;
var sDist  = 90 + Math.random() * 30;
sSpr.position.set(
Math.sin(sTheta) * Math.sin(sPhi) * sDist,
Math.cos(sPhi)   * sDist * 0.6 + 15,
Math.cos(sTheta) * Math.sin(sPhi) * sDist - 20
);
var sSz = 0.4 + Math.random() * 1.1;
sSpr.scale.set(sSz, sSz, 1);
cpScene.add(sSpr);
}

// ============================================================
// TOWER UPLIGHTING — dramatic uplights on the base washing the concrete
// ============================================================
var upLight1 = new THREE.SpotLight(0xfff0d0, 1.8, 35, Math.PI / 7, 0.5);
upLight1.position.set(-3, 0.5, 4.5);
upLight1.target.position.set(-1, 15, 0);
cpScene.add(upLight1);
cpScene.add(upLight1.target);

var upLight2 = new THREE.SpotLight(0xfff0d0, 1.5, 35, Math.PI / 7, 0.5);
upLight2.position.set(3, 0.5, 4.5);
upLight2.target.position.set(1, 15, 0);
cpScene.add(upLight2);
cpScene.add(upLight2.target);

var upLight3 = new THREE.SpotLight(0xffe8b0, 1.0, 40, Math.PI / 8, 0.6);
upLight3.position.set(0, 0.5, 5.5);
upLight3.target.position.set(0, 22, 0);
cpScene.add(upLight3);
cpScene.add(upLight3.target);

// ============================================================
// WARM WINDOW GLOW LIGHTS
// ============================================================
// Add a few point lights near the warmly lit windows
var windowGlows = [];
var glowSubset = warmWindows.slice(0, 8);
glowSubset.forEach(function(ww) {
var wl = new THREE.PointLight(0xd07020, 0.18, 3.5);
wl.position.set(ww.x * 0.85, ww.y, ww.z * 0.85 + 0.5);
cpScene.add(wl);
windowGlows.push(wl);
});

// ============================================================
// AVIATION WARNING LIGHT — animated red blink
// ============================================================
var avLight = new THREE.PointLight(0xff2000, 0.0, 20);
avLight.position.set(0, TOWER_H + 3.3, 0);
cpScene.add(avLight);

// ============================================================
// AMBIENT + MOON
// ============================================================
cpScene.add(new THREE.AmbientLight(0x05060e, 0.12));

var moonLight = new THREE.DirectionalLight(0x1a2255, 0.06);
moonLight.position.set(-8, 30, 10);
cpScene.add(moonLight);

// ============================================================
// FOG SPRITES — ground-level murk
// ============================================================
var thickFogTex = makeCanvasTexture(128, 128, function(cx, w, h) {
var grad = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
grad.addColorStop(0,   'rgba(130,125,115,0.28)');
grad.addColorStop(0.5, 'rgba(100, 95, 85,0.12)');
grad.addColorStop(1,   'rgba(70, 65, 55, 0)');
cx.fillStyle = grad;
cx.fillRect(0, 0, w, h);
});
var sodiumFogTex = makeCanvasTexture(128, 128, function(cx, w, h) {
var grad = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
grad.addColorStop(0,   'rgba(220,110,20,0.22)');
grad.addColorStop(0.4, 'rgba(190, 85,14,0.10)');
grad.addColorStop(1,   'rgba(140, 55, 8, 0)');
cx.fillStyle = grad;
cx.fillRect(0, 0, w, h);
});

var fogSprites = [];

for (var fi = 0; fi < 50; fi++) {
var fMat = new THREE.SpriteMaterial({
map: (fi < 35) ? thickFogTex : sodiumFogTex,
transparent: true, opacity: 0.2 + Math.random() * 0.2
});
var fs = new THREE.Sprite(fMat);
fs.position.set(Math.random() * 40 - 18, 0.2 + Math.random() * 2.0, Math.random() * 25 - 3);
var fsc = 6 + Math.random() * 14;
fs.scale.set(fsc, fsc * 0.28, 1);
cpScene.add(fs);
fogSprites.push({
sprite: fs, baseX: fs.position.x,
drift: 0.002 + Math.random() * 0.005,
sway: Math.random() * Math.PI * 2,
swaySpeed: 0.001 + Math.random() * 0.003,
swayAmt: 0.5 + Math.random() * 1.2
});
}

// ============================================================
// NEON BLUE LADDER — two rails + cross rungs up the central gap
// ============================================================
var LADDER_X    = 0.0;
var RAIL_SEP    = 0.32;
var LADDER_Z    = TOWER_R + 0.4;
var RUNG_COUNT  = STOREYS + 2;
var RUNG_SPACING = STOREY_H;

// Base neon material — shared by rails
var neonMat = new THREE.MeshStandardMaterial({
color: 0x001833,
emissive: new THREE.Color(0x00aaff),
emissiveIntensity: 2.2,
roughness: 0.15,
metalness: 0.0,
fog: false
});

// LEFT RAIL
var leftRail = new THREE.Mesh(
new THREE.BoxGeometry(0.055, TOWER_H + 2, 0.055),
neonMat
);
leftRail.position.set(-RAIL_SEP, (TOWER_H + 2) / 2 + 0.5, LADDER_Z);
cpScene.add(leftRail);

// RIGHT RAIL
var rightRail = new THREE.Mesh(
new THREE.BoxGeometry(0.055, TOWER_H + 2, 0.055),
neonMat
);
rightRail.position.set(RAIL_SEP, (TOWER_H + 2) / 2 + 0.5, LADDER_Z);
cpScene.add(rightRail);

// RUNGS — flat boxes spanning between the rails, clearly visible face-on
var rungMeshes = [];
for (var rung = 0; rung < RUNG_COUNT; rung++) {
var ry = 0.8 + rung * RUNG_SPACING;
var rungMat = neonMat.clone();
var rungMesh = new THREE.Mesh(
new THREE.BoxGeometry(RAIL_SEP * 2, 0.07, 0.07),
rungMat
);
rungMesh.position.set(0, ry, LADDER_Z);
cpScene.add(rungMesh);
rungMeshes.push(rungMesh);
}

// Travelling pulse light
var pulseLight = new THREE.PointLight(0x00aaff, 0.0, 7);
cpScene.add(pulseLight);

// Soft base glow pooling at the bottom
var ladderBaseGlow = new THREE.PointLight(0x0055cc, 0.5, 10);
ladderBaseGlow.position.set(0, 1.5, LADDER_Z + 1);
cpScene.add(ladderBaseGlow);
// The neon in the night air (2026-09-22 polish loop): a soft blue haze
// hanging at the foot of the ladder, where the tubes' light catches the
// damp. One additive sprite; breathes with ladderBaseGlow.
var cpHazeTex = makeCanvasTexture(128, 128, function(cx, w, h) {
  var g = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
  g.addColorStop(0, 'rgba(90,170,255,0.55)');
  g.addColorStop(0.45, 'rgba(40,110,220,0.18)');
  g.addColorStop(1, 'rgba(20,60,160,0)');
  cx.fillStyle = g; cx.fillRect(0, 0, w, h);
});
var cpHaze = new THREE.Sprite(new THREE.SpriteMaterial({ map: cpHazeTex, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false }));
cpHaze.position.set(LADDER_X, 1.6, LADDER_Z + 0.9);
cpHaze.scale.set(3.6, 2.2, 1);
cpScene.add(cpHaze);

// ============================================================
// ANIMATION
// ============================================================
var cpClock = new THREE.Clock();
var avBlinkPhase = 0;

function cpAnimate() {
cpAnimId = requestAnimationFrame(cpAnimate);
var t = cpStill ? 3 : cpClock.getElapsedTime();

// --- UPLIGHTING — slow breathing, like a building being dramatic ---
var upBreath = 0.96 + Math.sin(t * 0.18) * 0.03;
upLight1.intensity = 1.8 * upBreath;
upLight2.intensity = 1.5 * upBreath;
upLight3.intensity = 1.0 * upBreath;

// --- AVIATION LIGHT — slow red blink, every ~4 seconds ---
if (!cpStill) avBlinkPhase += 0.016;
var avCycle = Math.sin(avBlinkPhase * 0.8);
var avOn = avCycle > 0.85;
avLight.intensity = avOn ? (avCycle - 0.85) * 12 : 0;
warningLight.material.emissiveIntensity = avOn ? 0.8 + (avCycle - 0.85) * 4 : 0.08;

// --- WINDOW GLOW PULSE (very slow, nearly static) ---
for (var wgi = 0; wgi < windowGlows.length; wgi++) {
windowGlows[wgi].intensity = 0.15 + Math.sin(t * 0.08 + wgi * 0.9) * 0.04;
}

// --- NEON LADDER PULSE ---
// A bright pulse travels upward continuously, looping from bottom to top
var PULSE_SPEED = 4.5;
var pulsePos = (t * PULSE_SPEED) % (RUNG_COUNT + 4);
var pulseY   = 0.8 + pulsePos * RUNG_SPACING;

// Move the travelling point light
pulseLight.position.set(LADDER_X, pulseY, LADDER_Z + 0.8);

// Each rung brightness: peak when pulse is at that rung, fades off quickly
for (var ri = 0; ri < rungMeshes.length; ri++) {
var dist = Math.abs(ri - pulsePos);
var brightness = Math.max(0, 1.0 - dist * 0.55);
// Base flicker on the neon — slow, like a real tube
var neonFlicker = 0.88 + Math.sin(t * 1.4 + ri * 0.3) * 0.06
+ Math.sin(t * 3.1 + ri * 0.7) * 0.03;
rungMeshes[ri].material.emissiveIntensity = (0.5 + brightness * 1.8) * neonFlicker;
}

// Spine pulses with overall neon flicker
var spineFlicker = 0.9 + Math.sin(t * 1.2) * 0.05 + Math.sin(t * 2.8) * 0.03;
leftRail.material.emissiveIntensity  = 1.0 * spineFlicker;
rightRail.material.emissiveIntensity = 1.0 * spineFlicker;

// The pulse light intensity peaks at the centre of the travel
pulseLight.intensity = 1.2 + Math.sin(t * 1.8) * 0.2;

// Base glow breathes slowly
ladderBaseGlow.intensity = 0.35 + Math.sin(t * 0.4) * 0.12;
cpHaze.material.opacity = 0.08 + (ladderBaseGlow.intensity - 0.35) * 0.3 + Math.sin(t * 1.1) * 0.01;

// --- FOG DRIFT --- (held under reduced motion)
for (var fdi = 0; fdi < (cpStill ? 0 : fogSprites.length); fdi++) {
var f = fogSprites[fdi];
f.sway += f.swaySpeed;
f.sprite.position.x = f.baseX + Math.sin(f.sway) * f.swayAmt;
f.baseX += f.drift;
if (f.baseX > 22) f.baseX = -18;
}

if (typeof dssComposerLocal !== 'undefined' && dssComposerLocal) { dssComposerLocal.render(); } else { cpRenderer.render(cpScene, cpCamera); }
}

cpAnimate();

// Vignette
var cpVig = document.createElement('div');
cpVig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:radial-gradient(ellipse at 45% 45%, transparent 30%, rgba(0,0,0,0.6) 100%);';
cpWrap.appendChild(cpVig);

// Datestamp

// Caption — Crowley's Thelemic line, sitting ABOVE the CLIMB IT button.
// Styled to match the "There is no part of me that is not of the Gods"
// quote that appears after the liver-eating: Playfair Display caps, gold,
// no italic. Caption at bottom:115px — lowered from 150px so it sits clear
// below the astral constellation that rises over the scene, while keeping
// breathing space above the CLIMB IT button (button top ≈88px).
var cpLoc = document.createElement('div');
cpLoc.classList.add('dss-room-caption');
var cpLocText = 'Every man and every woman is a star.';
cpLoc.style.cssText = 'position:fixed;bottom:115px;left:0;right:0;text-align:center;font-family:"Playfair Display",Georgia,serif;font-size:14px;color:#f5d070;letter-spacing:0.18em;text-transform:uppercase;pointer-events:none;z-index:9003;white-space:nowrap;text-shadow:0 0 8px rgba(245,208,112,0.55),0 0 16px rgba(245,208,112,0.25),0 0 2px rgba(8,6,4,0.95);opacity:0;transition:opacity 1.2s ease;';
// Phone widths: the letter-spaced caps run wider than the screen, so tighten them.
if (window.innerWidth < 480) { cpLoc.style.fontSize = '11px'; cpLoc.style.letterSpacing = '0.1em'; }
cpWrap.appendChild(cpLoc);
// Type the line out one character at a time — an inscription being chiselled,
// echoing the typewriter opening of the game — rather than a flat fade-in.
setTimeout(function() {
cpLoc.style.opacity = '1';
var cpci = 0;
var cpType = setInterval(function() {
cpci++;
cpLoc.textContent = cpLocText.slice(0, cpci);
if (cpci >= cpLocText.length) { clearInterval(cpType); }
}, 80);
}, 2600);

// Button: "CLIMB IT" — brightened from rgba(248,212,128) to a near-white
// gold so it reads as a clear, glowing call-to-action against the dark
// city scene rather than a muted text-link.
var cpBtn = document.createElement('button');
cpBtn.className = 'dss-climb-button';
cpBtn.type = 'button';
cpBtn.textContent = 'CLIMB IT';
cpBtn.style.cssText = 'position:fixed;bottom:40px;left:50%;transform:translateX(-50%);padding:16px 42px;font:bold 20px "Courier New",monospace;color:rgba(255,255,250,1);border:2px solid rgba(255,252,232,1);letter-spacing:5px;white-space:nowrap;cursor:pointer;z-index:9004;background:rgba(255,236,176,0.22);box-shadow:0 0 18px rgba(255,240,180,0.55),0 0 42px rgba(255,228,148,0.35),inset 0 0 14px rgba(255,248,212,0.25);opacity:0;transition:opacity 5.5s ease;text-shadow:0 0 8px rgba(255,255,255,1),0 0 18px rgba(255,252,220,1),0 0 36px rgba(255,236,168,0.85),0 0 58px rgba(255,220,140,0.55),0 0 2px rgba(8,6,4,0.85);';
setTimeout(function() { cpBtn.style.opacity = '1'; }, 3500);
cpBtn.addEventListener('mouseenter', function() {
cpBtn.style.color = 'rgba(255,252,232,1)';
cpBtn.style.borderColor = 'rgba(255,248,212,1)';
});
cpBtn.addEventListener('mouseleave', function() {
cpBtn.style.color = 'rgba(255,244,200,1)';
cpBtn.style.borderColor = 'rgba(255,232,160,0.95)';
});
cpBtn.addEventListener('click', function() {
// Freeze the canvas animation immediately so the 3D scene doesn't keep
// moving while it fades — kills the perceptual "second flash" some
// players were seeing as the snap-cut at end-of-fade.
if (cpAnimId) { cancelAnimationFrame(cpAnimId); cpAnimId = null; }
cpWrap.style.transition = 'opacity 0.6s ease';
cpWrap.style.opacity = '0';
setTimeout(function() {
if (cpWrap.parentNode) cpWrap.parentNode.removeChild(cpWrap);
// Approach Centre Point's hidden tw-link now targets Alba Complete /
// Alba Incomplete directly (the Centre Point router passage was
// bypassed). Click the first "·" link in the document.
var links = document.querySelectorAll('tw-link, .enchantment-link');
for (var i = 0; i < links.length; i++) {
if (links[i].textContent.trim() === '·') { links[i].click(); break; }
}
}, 650);
});
cpWrap.appendChild(cpBtn);

document.body.appendChild(cpWrap);
}

setInterval(function() {
var container = document.getElementById('cp-container');
if (container && !cpActive) {
initCentrePoint();
} else if (!container) {
cpActive = false;
if (cpAnimId) { cancelAnimationFrame(cpAnimId); cpAnimId = null; }
window._dssDisposeWrap('cp-wrap');
}
}, 300);
})();
// ====== CHINESE FISH AND CHIPS — INLINE ======
(function() {
var fcActive = false;
var fcAnimId = null;

function initFc() {
  if (fcActive) return; fcActive = true;
  if (typeof THREE === 'undefined') {
    var s = document.createElement('script');
    s.src = 'vendor/three/three.min.js';
    s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(buildFcScene) : buildFcScene()); };
    document.head.appendChild(s);
  } else { (window.dssLoadPost ? window.dssLoadPost(buildFcScene) : buildFcScene()); }
}

