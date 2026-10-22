// ====== COACH AND HORSES SCENE — INLINE ======
(function() {
var chActive = false;
var chAnimId = null, chHost = null, chDisposeExtra = null;

function initCoachHorses() {
if (chActive) return;
chActive = true;
var expectedHost=chHost;
function ready(){if(chHost===expectedHost&&expectedHost&&expectedHost.isConnected)buildCHScene();}
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(ready) : ready()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(ready) : ready());
}
}

// The rare ending retains the familiar corner, now blackened and remembered through smoke.
var chFireTune={pace:1,smokeCount:18,emberCount:16,smokeColor:0x87939f,smokeOpacity:.25,lightColor:0xa46549,lightPeak:.65,stillTime:12,exitFade:2.4};
function makeCoachFire(scene,pub,windows){
  var cloned=new Map();pub.traverse(function(o){if(!o.material)return;function local(m){if(!cloned.has(m))cloned.set(m,m.clone());return cloned.get(m);}o.material=Array.isArray(o.material)?o.material.map(local):local(o.material);});
  cloned.forEach(function(copy,original){var used=false;scene.traverse(function(o){if(o.material===original||(Array.isArray(o.material)&&o.material.indexOf(original)>=0))used=true;});if(!used)original.dispose();});
  var materials=new Set();pub.traverse(function(o){if(!o.material)return;(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(materials.has(m))return;materials.add(m);if(m.color)m.color.multiplyScalar(.24);if(m.emissive)m.emissive.multiplyScalar(.045);});});
  var c=document.createElement('canvas');c.width=c.height=256;var ctx=c.getContext('2d');
  for(var i=0;i<75;i++){var px=48+Math.random()*160,py=48+Math.random()*160,r=16+Math.random()*48,g=ctx.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,'rgba(155,165,178,.06)');g.addColorStop(1,'rgba(155,165,178,0)');ctx.fillStyle=g;ctx.fillRect(px-r,py-r,r*2,r*2);}
  var map=new THREE.CanvasTexture(c),wisps=[];
  for(var n=0;n<chFireTune.smokeCount;n++){var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:map,color:chFireTune.smokeColor,transparent:true,opacity:.2,depthWrite:false,toneMapped:false}));scene.add(sp);wisps.push(sp);}
  var positions=new Float32Array(chFireTune.emberCount*3),geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
  var embers=new THREE.Points(geo,new THREE.PointsMaterial({color:0xa86b4f,size:.035,transparent:true,opacity:.7,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(embers);
  var light=new THREE.PointLight(chFireTune.lightColor,chFireTune.lightPeak,16,2);light.position.set(-1,.8,1);scene.add(light);
  // Sam's audio belongs here; no new sound has been added.
  // Greek ground panes first, then Romilly; the three upper rooms fail last.
  windows.forEach(function(w,i){w.material.emissive.setHex(0xa47852);w.userData.fireFailure=2+i*1.65;});
  return function(t){t/=chFireTune.pace;
    windows.forEach(function(w){var fade=Math.max(0,1-Math.max(0,t-w.userData.fireFailure)/2.8);fade=fade*fade*(3-2*fade);w.material.emissiveIntensity=.32*fade;});
    wisps.forEach(function(w,i){var settle=1-Math.exp(-t/20),u=i/chFireTune.smokeCount;
      w.position.set(-7+u*9+settle*.9, .6+(i%6)*.69+settle*.35, .75+Math.sin(i*2)*.55);
      w.scale.set(3.2+settle*2.4,1.1+(i%3)*.6,1);
      var d=Math.hypot(w.position.x-1,w.position.y-4.8,w.position.z-1),lit=Math.exp(-d*d/9);
      w.material.color.setHex(chFireTune.smokeColor).lerp(new THREE.Color(0xd5c09d),lit);
      w.material.opacity=chFireTune.smokeOpacity*(.3+lit*.7)*Math.exp(-t/28);
    });
    for(var i=0;i<chFireTune.emberCount;i++){var age=t+i*.38,p=1-Math.exp(-age/4);positions[i*3]=-7+(i%9)*.85+p*.15;positions[i*3+1]=.25+p*(.3+i%3*.15);positions[i*3+2]=.8+Math.sin(i*3)*.5;}
    geo.attributes.position.needsUpdate=true;embers.material.opacity=.35*Math.exp(-t/5);light.intensity=chFireTune.lightPeak*Math.exp(-t/12);

  };
}

function buildCHScene() {
var chIsFire=chHost&&chHost.dataset.fire==='true';
if(chIsFire&&window.dssAudio&&window.dssAudio.fireCrackle){try{window.dssAudio.fireCrackle(chHost);}catch(e){}} /* 2026-10-18 night: stops by itself when the room leaves the page */
var chStill=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Full-screen overlay wrapper
var chWrap = document.createElement('div');
chWrap.id = 'ch-wrap';
chWrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9000;background:#050508;';

// Vignette overlay
var chVig = document.createElement('div');
chVig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:radial-gradient(ellipse at 45% 45%, transparent 30%, rgba(0,0,0,0.6) 100%);';
chWrap.appendChild(chVig);

// Film grain overlay
var chGrain = document.createElement('canvas');
chGrain.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9002;opacity:0.02;mix-blend-mode:overlay;';
chGrain.width = 256; chGrain.height = 256;
chWrap.appendChild(chGrain);
var chGrainCtx = chGrain.getContext('2d');
var chGrainFrame = 0;

// Colorwash overlay
var chWash = document.createElement('div');
chWash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9002;background:linear-gradient(180deg, rgba(10,8,25,0.3) 0%, rgba(5,5,15,0.08) 30%, rgba(5,5,15,0.08) 60%, rgba(5,3,2,0.4) 100%);';
chWrap.appendChild(chWash);

// Location label
var chLoc = document.createElement('div');
chLoc.classList.add('dss-room-caption');
chLoc.textContent = 'GREEK STREET SOUTH, SOHO';
chLoc.style.cssText = 'position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font:12px \'Courier New\',monospace;color:rgba(200,180,140,0.25);letter-spacing:2px;pointer-events:none;z-index:9003;white-space:nowrap;';
chWrap.appendChild(chLoc);

document.body.appendChild(chWrap);

// ============================================================
// SCENE SETUP
// ============================================================
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x050508);

// Depth-based fog: linear fog from near to far gives that depth-buffer look
// Objects fade into murky darkness the further they are
// Thick Soho fog — starts close, swallows everything beyond mid-distance
scene.fog = new THREE.Fog(0x050508, 5, 34); // eased back (was 3,28) so the pub facade survives the fog

var camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 200);

// ============================================================
// LAYOUT EXPLANATION
// ============================================================
// Corner of pub at origin (0, 0, 0)
// Greek St face: runs along -Z (z=0 to z=-5), facade at x≈0 faces +X
// Romilly St face: runs along -X (x=0 to x=-9), facade at z≈0 faces +Z
// Building bodies extend BEHIND facades (into -X and -Z)
// Camera at (+X, +Z) so it sees BOTH facades from the outside
//
// From camera: Greek St face on the RIGHT, Romilly face on the LEFT,
// corner banner in the MIDDLE — just like the photo!

camera.position.set(13, 2.8, 10);
camera.lookAt(-1, 3.5, -1);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth<600?1.25:1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.62;
chWrap.appendChild(renderer.domElement);
window._dssBindScene('ch-wrap', scene, renderer, camera);
window._dssThreeRegistry['ch-wrap'].camera=camera;
var dssComposerLocal = window.dssMakeComposer ? window.dssMakeComposer(scene, camera, renderer, { focus: 12 }) : null;
if (window.dssFilmGrade) window.dssFilmGrade(document.getElementById('ch-wrap'));
chDisposeExtra=function(){if(dssComposerLocal&&dssComposerLocal.dssDispose)dssComposerLocal.dssDispose();};

// ============================================================
// MATERIALS
// ============================================================
var chKit = window.dssScene || null;
var creamWall = (chKit && chKit.makeWeatheredStucco)
  ? chKit.makeWeatheredStucco({ baseColor: 0xd8cfc0, repeat: [2, 2.5] })
  : new THREE.MeshStandardMaterial({ color: 0xd8cfc0, roughness: 0.85 });
var darkCream = (chKit && chKit.makeWeatheredStucco)
  ? chKit.makeWeatheredStucco({ baseColor: 0xc0b8a8, repeat: [2, 2.5] })
  : new THREE.MeshStandardMaterial({ color: 0xc0b8a8, roughness: 0.8 });
// Painted red timber — glossy pub paint over boards, grimed toward the ground
function chRedPaintMat(base, boardTone, rough) {
  if (!chKit || !chKit.makeCanvasTexture) {
    return new THREE.MeshStandardMaterial({ color: base === '#7e1414' ? 0x8b1a1a : 0xcc2020, roughness: rough });
  }
  var tex = chKit.makeCanvasTexture(512, 512, function(cx, w, h) {
    cx.fillStyle = base; cx.fillRect(0, 0, w, h);
    // Vertical board joints with slight tonal drift per board
    for (var bx = 0; bx < w; bx += 64) {
      cx.fillStyle = 'rgba(0,0,0,' + (0.04 + Math.random() * 0.05) + ')';
      cx.fillRect(bx, 0, 3, h);
      cx.fillStyle = 'rgba(' + boardTone + ',' + (0.03 + Math.random() * 0.05) + ')';
      cx.fillRect(bx + 3, 0, 61, h);
    }
    // Paint sheen streaks
    cx.fillStyle = 'rgba(255,200,180,0.045)';
    for (var s = 0; s < 8; s++) {
      cx.fillRect(Math.random() * w, 0, 2 + Math.random() * 5, h * (0.3 + Math.random() * 0.5));
    }
    // Chips and scuffs
    for (var c = 0; c < 46; c++) {
      cx.fillStyle = 'rgba(20,8,6,' + (0.15 + Math.random() * 0.3) + ')';
      var chx = Math.random() * w, chy = Math.random() * h;
      cx.fillRect(chx, chy, 1 + Math.random() * 4, 1 + Math.random() * 3);
    }
    // Rising street grime along the bottom edge
    var gr = cx.createLinearGradient(0, h * 0.72, 0, h);
    gr.addColorStop(0, 'rgba(12,8,5,0)');
    gr.addColorStop(1, 'rgba(12,8,5,0.5)');
    cx.fillStyle = gr; cx.fillRect(0, h * 0.72, w, h * 0.28);
    // Soot wash from the top (weather off the cornice)
    var gt = cx.createLinearGradient(0, 0, 0, h * 0.2);
    gt.addColorStop(0, 'rgba(10,8,8,0.35)');
    gt.addColorStop(1, 'rgba(10,8,8,0)');
    cx.fillStyle = gt; cx.fillRect(0, 0, w, h * 0.2);
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1);
  return new THREE.MeshStandardMaterial({ map: tex, roughness: rough });
}
var redFacade = chRedPaintMat('#7e1414', '255,120,90', 0.55);
var brightRed = chRedPaintMat('#a81c1c', '255,140,100', 0.5);
redFacade.roughness=.48;brightRed.roughness=.44;
var goldMat = new THREE.MeshStandardMaterial({ color: 0xc0a040, roughness: 0.24, metalness: 0.4 });
var darkWood = new THREE.MeshStandardMaterial({ color: 0x2a1505, roughness: 0.7 });
var warmGlass = new THREE.MeshStandardMaterial({ color: 0x3a2510, roughness: 0.22, emissive: 0xc89030, emissiveIntensity: 0.8 }); // a working pub's windows should glow
var pavementMat = (chKit && chKit.makePavingSlabs)
  ? chKit.makePavingSlabs({ repeat: [22, 22] })
  : new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.9 });
var roadMat = (chKit && chKit.makeGrimyRoad)
  ? chKit.makeGrimyRoad({ baseColor: 0x161616 })
  : new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85 });
var blueBrick = (chKit && chKit.makeGrimyBrick)
  ? chKit.makeGrimyBrick({ baseColor: 0x3a4a6a, repeat: [2, 4], sootStreaks: 6 })
  : new THREE.MeshStandardMaterial({ color: 0x3a4a6a, roughness: 0.85 });
var redBrick = (chKit && chKit.makeGrimyBrick)
  ? chKit.makeGrimyBrick({ baseColor: 0x8b4a3a, repeat: [2, 4], sootStreaks: 7, dampPatches: 4 })
  : new THREE.MeshStandardMaterial({ color: 0x8b4a3a, roughness: 0.85 });
var windowFrame = new THREE.MeshStandardMaterial({ color: 0xb0a890, roughness: 0.7 });
var darkGlass = new THREE.MeshStandardMaterial({ color: 0x0a0a15, roughness: 0.2, metalness: 0.3 });

// ============================================================
// HELPER: canvas texture
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

function makeSign(text, opts) {
var o = opts || {};
var w = o.w || 512; var h = o.h || 128;
var bg = o.bg || '#6b0e0e'; var fg = o.fg || '#c8a840';
var fs = o.fs || 36; var ff = o.ff || 'bold Georgia';
var tex = makeCanvasTexture(w, h, function(cx, cw, ch) {
cx.fillStyle = bg; cx.fillRect(0, 0, cw, ch);
if (o.border) {
cx.strokeStyle = fg; cx.lineWidth = 4;
cx.strokeRect(6, 6, cw - 12, ch - 12);
}
cx.fillStyle = fg; cx.font = fs + 'px ' + ff;
cx.textAlign = 'center'; cx.textBaseline = 'middle';
cx.fillText(text, cw/2, ch/2);
});
return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 });
}

// ============================================================
// GROUND
// ============================================================
var pavement = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), pavementMat);
pavement.rotation.x = -Math.PI / 2;
pavement.receiveShadow = true;
scene.add(pavement);

// Greek St road (runs along Z, east of the pub)
var greekRoad = new THREE.Mesh(new THREE.PlaneGeometry(8, 40), roadMat);
greekRoad.rotation.x = -Math.PI / 2;
greekRoad.position.set(5, 0.004, -5);
greekRoad.receiveShadow = true;
scene.add(greekRoad);

// Romilly St road (runs along X, south of the pub)
var romRoad = new THREE.Mesh(new THREE.PlaneGeometry(30, 8), roadMat);
romRoad.rotation.x = -Math.PI / 2;
romRoad.position.set(-10, 0.004, 5);
romRoad.receiveShadow = true;
scene.add(romRoad);

// Wet road reflections — alpha fades out radially so the sheen has no
// hard rectangular boundary cutting across the tarmac
var wetAlphaTex = makeCanvasTexture(256, 256, function(cx, w, h) {
var grad = cx.createRadialGradient(w/2, h/2, 20, w/2, h/2, w/2);
grad.addColorStop(0, 'rgba(255,255,255,1)');
grad.addColorStop(0.6, 'rgba(255,255,255,0.55)');
grad.addColorStop(1, 'rgba(255,255,255,0)');
cx.fillStyle = grad; cx.fillRect(0, 0, w, h);
});
var wetMat = new THREE.MeshStandardMaterial({
color: 0x1a1a1a, roughness: 0.2, metalness: 0.5, transparent: true, opacity: 0.25,
map: wetAlphaTex, depthWrite:false
});
var wetRoad = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), wetMat);
wetRoad.rotation.x = -Math.PI / 2;
wetRoad.position.set(3, 0.01, 3);
scene.add(wetRoad);

// ============================================================
// THE COACH & HORSES
// ============================================================
var pub = new THREE.Group();

// ----- UPPER FLOORS -----
// Greek St wing body: extends from x=-6 to x=0, z=-5 to z=0
// Facade is at x=0, facing +X
var greekBody = new THREE.Mesh(new THREE.BoxGeometry(6, 8, 5), creamWall);
greekBody.position.set(-3, 8, -2.5);
greekBody.castShadow = true;
pub.add(greekBody);

// Romilly St wing body: extends from x=-9 to x=0, z=0 to z=-6
// Facade is at z=0, facing +Z
var romBody = new THREE.Mesh(new THREE.BoxGeometry(9, 8, 6), creamWall);
romBody.position.set(-4.5, 8, -3);
romBody.castShadow = true;
pub.add(romBody);

// Corner chamfer block — wider so the banner face is prominent
var cornerBlock = new THREE.Mesh(new THREE.BoxGeometry(3, 12.5, 3), creamWall);
cornerBlock.rotation.y = Math.PI / 4;
cornerBlock.position.set(-0.2, 6.25, -0.2);
pub.add(cornerBlock);

// Red ground floor on the chamfer face
var cornerRedBlock = new THREE.Mesh(new THREE.BoxGeometry(3.05, 4, 3.05), redFacade);
cornerRedBlock.rotation.y = Math.PI / 4;
cornerRedBlock.position.set(-0.2, 2, -0.2);
pub.add(cornerRedBlock);

// ----- CORNICES -----
// Top cornice — Greek St face (at x=0.08, running along -Z)
pub.add(makeCorniceBox(0.15, 0.4, 5.5, 0.08, 12, -2.5));
// Top cornice — Romilly face (at z=0.08, running along -X)
pub.add(makeCorniceBoxZ(9.5, 0.4, 0.15, -4.5, 12, 0.08));
// Mid cornice — Greek St
pub.add(makeCorniceBox(0.15, 0.3, 5.5, 0.08, 8, -2.5));
// Mid cornice — Romilly
pub.add(makeCorniceBoxZ(9.5, 0.3, 0.15, -4.5, 8, 0.08));

function makeCorniceBox(w, h, d, x, y, z) {
var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), darkCream);
m.position.set(x, y, z);
return m;
}
function makeCorniceBoxZ(w, h, d, x, y, z) {
var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), darkCream);
m.position.set(x, y, z);
return m;
}

// ----- GROUND FLOOR RED FACADES -----
// Greek St facade slab (at x=0.08, facing +X)
var greekRedSlab = new THREE.Mesh(new THREE.BoxGeometry(0.15, 4, 5), redFacade);
greekRedSlab.position.set(0.08, 2, -2.5);
pub.add(greekRedSlab);

// Romilly facade slab (at z=0.08, facing +Z)
var romRedSlab = new THREE.Mesh(new THREE.BoxGeometry(9, 4, 0.15), redFacade);
romRedSlab.position.set(-4.5, 2, 0.08);
pub.add(romRedSlab);

// Ground floor fill behind facades
var gfFill1 = new THREE.Mesh(
new THREE.BoxGeometry(6, 4, 5),
new THREE.MeshStandardMaterial({ color: 0x4a1010, roughness: 0.9 })
);
gfFill1.position.set(-3, 2, -2.5);
pub.add(gfFill1);
var gfFill2 = new THREE.Mesh(
new THREE.BoxGeometry(9, 4, 6),
new THREE.MeshStandardMaterial({ color: 0x4a1010, roughness: 0.9 })
);
gfFill2.position.set(-4.5, 2, -3);
pub.add(gfFill2);

// Red ground floor on corner
var cornerRed = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 2), redFacade);
cornerRed.rotation.y = Math.PI / 4;
cornerRed.position.set(-0.3, 2, -0.3);
pub.add(cornerRed);

// ----- FASCIA SIGNS -----
// Greek St fascia (face +X, at x=0.16)
var greekFascia = new THREE.Mesh(
new THREE.PlaneGeometry(4.5, 0.55),
makeSign('THE  COACH  &  HORSES', { w: 512, h: 64, fs: 28, border: true })
);
greekFascia.rotation.y = Math.PI / 2; // face +X
greekFascia.position.set(0.16, 3.7, -2.5);
pub.add(greekFascia);

// Romilly fascia (face +Z, at z=0.16)
var romFascia = new THREE.Mesh(
new THREE.PlaneGeometry(8.5, 0.55),
makeSign('THE  COACH  &  HORSES', { w: 512, h: 64, fs: 28, border: true })
);
// face +Z — default plane faces +Z, no rotation needed
romFascia.position.set(-4.5, 3.7, 0.16);
pub.add(romFascia);

// ----- RED COLUMNS -----
function addColumn(x, y, z) {
var col = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 3.2, 8), brightRed);
col.position.set(x, y, z);
col.castShadow = true;
pub.add(col);
var cap = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.15, 8), goldMat);
cap.position.set(x, y + 1.65, z);
pub.add(cap);
var base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.1, 8), goldMat);
base.position.set(x, y - 1.6, z);
pub.add(base);
}

// Greek St columns (at x=0.2, spaced along -Z)
addColumn(0.2, 2, -0.8);
addColumn(0.2, 2, -1.8);
addColumn(0.2, 2, -3.2);
addColumn(0.2, 2, -4.2);

// Romilly St columns (at z=0.2, spaced along -X)
addColumn(-1.5, 2, 0.2);
addColumn(-3.0, 2, 0.2);
addColumn(-4.5, 2, 0.2);
addColumn(-6.0, 2, 0.2);
addColumn(-7.5, 2, 0.2);

// ----- UPPER FLOOR WINDOWS -----
// Dressed rooms above the pub (drapes / blinds / nets), one or two lit —
// the old build lit every pane with warmGlass, which flattened the whole
// upper storey into an even amber glow.
function placeMesh(geo, mat, x, y, z) {
var m = new THREE.Mesh(geo, mat);
m.position.set(x, y, z);
pub.add(m);
return m;
}

var chWinIdx = 0, chFireWindows=[], chFireUpper=[];
function addWin(x, y, z, faceX, lit) {
var ww = 0.7, wh = 1.5;
var glassM = (chKit && chKit.makeDressedWindow)
  ? chKit.makeDressedWindow(!!lit, chWinIdx % 3, chWinIdx % 4)
  : (lit ? warmGlass : darkGlass);
if(chIsFire&&lit){var dressed=glassM;glassM=new THREE.MeshStandardMaterial({map:dressed.map,emissiveMap:dressed.map,color:0x302d29,roughness:.25,emissive:0xa47852,emissiveIntensity:.32});if(dressed!==warmGlass)dressed.dispose();chFireUpper.push(glassM);}
chWinIdx++;
if (faceX) {
placeMesh(new THREE.BoxGeometry(0.08, wh+0.15, ww+0.15), windowFrame, x, y, z);
placeMesh(new THREE.BoxGeometry(0.06, wh, ww), glassM, x, y, z);
placeMesh(new THREE.BoxGeometry(0.09, 0.05, ww), windowFrame, x, y+0.2, z);
placeMesh(new THREE.BoxGeometry(0.09, wh, 0.05), windowFrame, x, y, z); // vertical bar
} else {
placeMesh(new THREE.BoxGeometry(ww+0.15, wh+0.15, 0.08), windowFrame, x, y, z);
placeMesh(new THREE.BoxGeometry(ww, wh, 0.06), glassM, x, y, z);
placeMesh(new THREE.BoxGeometry(ww, 0.05, 0.09), windowFrame, x, y+0.2, z);
placeMesh(new THREE.BoxGeometry(0.05, wh, 0.09), windowFrame, x, y, z); // vertical bar
}
}

// Greek St upper windows (face +X at x=0.1)
addWin(0.1, 6, -1.0, true);
addWin(0.1, 6, -2.5, true, true);
addWin(0.1, 6, -4.0, true);
addWin(0.1, 10, -1.0, true);
addWin(0.1, 10, -2.5, true);
addWin(0.1, 10, -4.0, true);

// Romilly upper windows (face +Z at z=0.1)
addWin(-1.5, 6, 0.1, false);
addWin(-3.5, 6, 0.1, false, true);
addWin(-5.5, 6, 0.1, false);
addWin(-7.5, 6, 0.1, false);
addWin(-1.5, 10, 0.1, false);
addWin(-3.5, 10, 0.1, false);
addWin(-5.5, 10, 0.1, false);
addWin(-7.5, 10, 0.1, false, true);

// ----- GROUND FLOOR PUB WINDOWS -----
function addPubWin(x, y, z, faceX) {
var ww = 0.9, wh = 2.2;
var pane=chIsFire?warmGlass.clone():warmGlass;if(chIsFire)chFireWindows.push(pane);
if (faceX) {
placeMesh(new THREE.BoxGeometry(0.08, wh+0.1, ww+0.1), darkWood, x, y, z);
placeMesh(new THREE.BoxGeometry(0.06, wh, ww), pane, x, y, z);
} else {
placeMesh(new THREE.BoxGeometry(ww+0.1, wh+0.1, 0.08), darkWood, x, y, z);
placeMesh(new THREE.BoxGeometry(ww, wh, 0.06), pane, x, y, z);
}
}

// Greek St pub windows (face +X)
addPubWin(0.16, 1.8, -1.5, true);
addPubWin(0.16, 1.8, -3.5, true);

// Romilly pub windows (face +Z)
addPubWin(-2.0, 1.8, 0.16, false);
addPubWin(-4.0, 1.8, 0.16, false);
addPubWin(-6.0, 1.8, 0.16, false);
addPubWin(-8.0, 1.8, 0.16, false);

// ----- SILHOUETTES OF PEOPLE IN PUB WINDOWS -----
// Dark figure shapes on planes just inside the windows, swaying gently
var silhouettes = [];

function makeSilhouetteTex(seed) {
return makeCanvasTexture(256, 256, function(cx, w, h) {
// Warm amber interior glow background
var bg = cx.createRadialGradient(w/2, h*0.4, 10, w/2, h*0.5, w);
bg.addColorStop(0, 'rgba(200, 140, 50, 0.5)');
bg.addColorStop(0.5, 'rgba(160, 100, 30, 0.3)');
bg.addColorStop(1, 'rgba(80, 50, 15, 0.15)');
cx.fillStyle = bg;
cx.fillRect(0, 0, w, h);

// Bold dark silhouettes against the warm glow
var figureCount = 1 + Math.floor(seed * 2.5);
for (var f = 0; f < figureCount; f++) {
var fx = (w / (figureCount + 1)) * (f + 1);
var baseY = h * 0.98;
var headR = 14 + seed * 6;
var shoulderW = 35 + seed * 15;

cx.fillStyle = 'rgba(10, 5, 0, 0.85)';

// Body — tall trapezoid
cx.beginPath();
cx.moveTo(fx - shoulderW/2, baseY - h*0.35);
cx.lineTo(fx + shoulderW/2, baseY - h*0.35);
cx.lineTo(fx + shoulderW/2 + 8, baseY);
cx.lineTo(fx - shoulderW/2 - 8, baseY);
cx.closePath();
cx.fill();

// Shoulders — wider ellipse
cx.beginPath();
cx.ellipse(fx, baseY - h*0.38, shoulderW/2 + 5, 14, 0, 0, Math.PI, true);
cx.fill();

// Neck
cx.fillRect(fx - 6, baseY - h*0.48, 12, h*0.1);

// Head — big and clear
cx.beginPath();
cx.arc(fx + (f - 1) * 4, baseY - h*0.52, headR, 0, Math.PI * 2);
cx.fill();

// Raised arm with pint for some figures
if ((seed > 0.4 && f === 0) || (seed > 0.6 && f === 1)) {
cx.fillStyle = 'rgba(10, 5, 0, 0.8)';
// Arm going up
cx.beginPath();
cx.moveTo(fx + shoulderW/2, baseY - h*0.38);
cx.lineTo(fx + shoulderW/2 + 12, baseY - h*0.6);
cx.lineTo(fx + shoulderW/2 + 22, baseY - h*0.6);
cx.lineTo(fx + shoulderW/2 + 10, baseY - h*0.35);
cx.closePath();
cx.fill();
// Pint glass shape
cx.fillRect(fx + shoulderW/2 + 8, baseY - h*0.7, 16, 22);
// Beer in glass (lighter)
cx.fillStyle = 'rgba(180, 130, 40, 0.4)';
cx.fillRect(fx + shoulderW/2 + 10, baseY - h*0.68, 12, 14);
}
}
});
}

// Greek St pub window silhouettes (face +X, at x=0.13, slightly behind glass)
var seeds = [0.3, 0.7];
var greekWinZ = [-1.5, -3.5];
for (var i = 0; i < 2; i++) {
var sTex = makeSilhouetteTex(seeds[i]);
var sMat = new THREE.MeshBasicMaterial({
map: sTex, transparent: true, side: THREE.DoubleSide, depthWrite: false
});
var sPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 2.0), sMat);
sPlane.rotation.y = Math.PI / 2; // face +X
sPlane.position.set(0.12, 1.8, greekWinZ[i]);
pub.add(sPlane);
silhouettes.push({
mesh: sPlane,
baseX: 0.12,
baseZ: greekWinZ[i],
swayPhase: Math.random() * Math.PI * 2,
swaySpeed: 0.3 + Math.random() * 0.4,
swayAmt: 0.02 + Math.random() * 0.03
});
}

// Romilly pub window silhouettes (face +Z, at z=0.13)
var romWinX = [-2.0, -4.0, -6.0, -8.0];
var romSeeds = [0.8, 0.2, 0.6, 0.4];
for (var i = 0; i < 4; i++) {
var sTex2 = makeSilhouetteTex(romSeeds[i]);
var sMat2 = new THREE.MeshBasicMaterial({
map: sTex2, transparent: true, side: THREE.DoubleSide, depthWrite: false
});
var sPlane2 = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 2.0), sMat2);
// face +Z — default orientation
sPlane2.position.set(romWinX[i], 1.8, 0.12);
pub.add(sPlane2);
silhouettes.push({
mesh: sPlane2,
baseX: romWinX[i],
baseZ: 0.12,
swayPhase: Math.random() * Math.PI * 2,
swaySpeed: 0.2 + Math.random() * 0.5,
swayAmt: 0.02 + Math.random() * 0.03
});
}

// ----- PUB DOOR (Greek St face, near corner) -----
placeMesh(new THREE.BoxGeometry(0.08, 2.5, 1.0), darkWood, 0.16, 1.25, -2.5);
placeMesh(new THREE.BoxGeometry(0.06, 1.2, 0.7), warmGlass, 0.18, 1.8, -2.5);
placeMesh(new THREE.BoxGeometry(0.06, 0.15, 0.04), goldMat, 0.2, 1.3, -2.15);

// Door light
var doorLight = new THREE.PointLight(0xc89030, 0.8, 8);
doorLight.position.set(0.5, 2, -2.5);
pub.add(doorLight);

// ----- COACH LANTERNS flanking the door -----
var lanternIron = new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.65, metalness: 0.3 });
var lanternPane = new THREE.MeshBasicMaterial({ color: 0xffd28a });
function addCoachLantern(z) {
  // Bracket out from the facade
  placeMesh(new THREE.BoxGeometry(0.3, 0.035, 0.035), lanternIron, 0.3, 3.06, z);
  // Lantern body: pane core inside four corner posts + cap
  placeMesh(new THREE.BoxGeometry(0.13, 0.2, 0.13), lanternPane, 0.46, 2.92, z);
  placeMesh(new THREE.BoxGeometry(0.19, 0.03, 0.19), lanternIron, 0.46, 2.8, z);
  placeMesh(new THREE.BoxGeometry(0.19, 0.03, 0.19), lanternIron, 0.46, 3.04, z);
  var lcap = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.1, 4), lanternIron);
  lcap.position.set(0.46, 3.11, z); lcap.rotation.y = Math.PI / 4; pub.add(lcap);
  var ll = new THREE.PointLight(0xffc060, 0.55, 7);
  ll.decay = 2;
  ll.position.set(0.52, 2.9, z);
  pub.add(ll);
  return ll;
}
var lantern1 = addCoachLantern(-1.85);
var lantern2 = addCoachLantern(-3.15);

// ----- HOODED LAMPS over the Romilly fascia -----
var fasciaLamps = [];
if (chKit && chKit.createHoodedShopLamp) {
  fasciaLamps.push(chKit.createHoodedShopLamp(scene, -2.5, 4.35, 0.16, { intensity: 0.5, distance: 5 }));
  fasciaLamps.push(chKit.createHoodedShopLamp(scene, -6.5, 4.35, 0.16, { intensity: 0.5, distance: 5 }));
}

// ----- LIVING ELEMENT: the drinker outside -----
// A regular taking his pint and cigarette on the Greek Street pavement,
// leaning on the wall between the pub windows. Silhouetted against the
// glass; the cigarette ember flares on an irregular cycle and lets off
// a thin ribbon of smoke.
var drinkerTex = makeCanvasTexture(256, 512, function(cx, w, h) {
  cx.fillStyle = 'rgba(8,5,4,0.94)';
  cx.beginPath();
  // Head in profile (facing right, tipped slightly back)
  cx.ellipse(w * 0.52, h * 0.115, w * 0.085, h * 0.055, -0.12, 0, Math.PI * 2);
  cx.fill();
  // Flat cap brim
  cx.beginPath();
  cx.ellipse(w * 0.50, h * 0.082, w * 0.10, h * 0.022, -0.18, 0, Math.PI * 2);
  cx.fill();
  // Neck + slouched shoulders into the wall (left side of canvas = wall)
  cx.beginPath();
  cx.moveTo(w * 0.46, h * 0.15);
  cx.quadraticCurveTo(w * 0.30, h * 0.185, w * 0.26, h * 0.24);
  cx.lineTo(w * 0.26, h * 0.52);
  cx.quadraticCurveTo(w * 0.28, h * 0.56, w * 0.34, h * 0.58);
  // Coat hem swinging out at the knee
  cx.lineTo(w * 0.36, h * 0.72);
  cx.lineTo(w * 0.56, h * 0.72);
  cx.lineTo(w * 0.62, h * 0.50);
  cx.quadraticCurveTo(w * 0.66, h * 0.30, w * 0.60, h * 0.20);
  cx.quadraticCurveTo(w * 0.57, h * 0.155, w * 0.52, h * 0.15);
  cx.closePath();
  cx.fill();
  // Cigarette arm: bent up, hand near the mouth
  cx.beginPath();
  cx.moveTo(w * 0.58, h * 0.30);
  cx.quadraticCurveTo(w * 0.70, h * 0.26, w * 0.66, h * 0.17);
  cx.lineTo(w * 0.61, h * 0.145);
  cx.quadraticCurveTo(w * 0.63, h * 0.24, w * 0.54, h * 0.28);
  cx.closePath();
  cx.fill();
  // Pint arm: hanging, glass at the hip
  cx.beginPath();
  cx.moveTo(w * 0.40, h * 0.32);
  cx.lineTo(w * 0.38, h * 0.50);
  cx.lineTo(w * 0.44, h * 0.52);
  cx.lineTo(w * 0.46, h * 0.34);
  cx.closePath();
  cx.fill();
  // Pint glass — amber block below the hand
  cx.fillStyle = 'rgba(200,140,40,0.8)';
  cx.fillRect(w * 0.375, h * 0.52, w * 0.07, h * 0.055);
  cx.fillStyle = 'rgba(8,5,4,0.94)';
  // Legs: crossed at the ankle, weight on the wall
  cx.beginPath();
  cx.moveTo(w * 0.38, h * 0.72);
  cx.lineTo(w * 0.34, h * 0.955);
  cx.lineTo(w * 0.42, h * 0.955);
  cx.lineTo(w * 0.46, h * 0.74);
  cx.closePath();
  cx.fill();
  cx.beginPath();
  cx.moveTo(w * 0.50, h * 0.72);
  cx.lineTo(w * 0.56, h * 0.94);
  cx.lineTo(w * 0.64, h * 0.945);
  cx.lineTo(w * 0.56, h * 0.72);
  cx.closePath();
  cx.fill();
  // Shoes
  cx.fillRect(w * 0.30, h * 0.945, w * 0.14, h * 0.02);
  cx.fillRect(w * 0.55, h * 0.935, w * 0.15, h * 0.02);
});
var drinkerMat = new THREE.MeshBasicMaterial({ map: drinkerTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
var drinker = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 1.9), drinkerMat);
drinker.rotation.y = Math.PI / 2; // face out across Greek Street
drinker.position.set(0.55, 1.11, -4.35);
drinker.userData.noShadow = true; // a textured plane casts a solid rectangle, not a figure
scene.add(drinker);

// Cigarette ember — flares on the drag, dies back to a dull point
var emberTex = makeCanvasTexture(32, 32, function(cx, w, h) {
  var grad = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
  grad.addColorStop(0, 'rgba(255,140,40,1)');
  grad.addColorStop(0.4, 'rgba(230,80,20,0.6)');
  grad.addColorStop(1, 'rgba(180,40,10,0)');
  cx.fillStyle = grad; cx.fillRect(0, 0, w, h);
});
var ember = new THREE.Sprite(new THREE.SpriteMaterial({ map: emberTex, transparent: true, depthWrite:false, opacity: 0.35 }));
ember.position.set(0.58, 1.68, -4.11);
ember.scale.set(0.06, 0.06, 1);
scene.add(ember);
var emberState = { nextFlare: 4 + Math.random() * 6, flareT: -1 };

// Cigarette smoke wisps
var cigSmokeTex = makeCanvasTexture(64, 64, function(cx, w, h) {
  var grad = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
  grad.addColorStop(0, 'rgba(180,180,190,0.5)');
  grad.addColorStop(0.5, 'rgba(150,150,160,0.18)');
  grad.addColorStop(1, 'rgba(120,120,130,0)');
  cx.fillStyle = grad; cx.fillRect(0, 0, w, h);
});
var cigWisps = [];
for (var cw = 0; cw < 3; cw++) {
  var wisp = new THREE.Sprite(new THREE.SpriteMaterial({ map: cigSmokeTex, transparent: true, depthWrite:false, opacity: 0 }));
  wisp.position.set(0.58, 1.75, -4.11);
  wisp.scale.set(0.12, 0.12, 1);
  scene.add(wisp);
  cigWisps.push({ sprite: wisp, age: cw * 1.4, life: 4.2, phase: Math.random() * Math.PI * 2 });
}

// ----- THE BIG CORNER BANNER -----
// This is the iconic sign — tall, filling the chamfer face
// In the photo it runs from just below roof to just above ground floor
var bannerTex = makeCanvasTexture(512, 1024, function(cx, w, h) {
// Deep red background
cx.fillStyle = '#6b0e0e';
cx.fillRect(0, 0, w, h);

// Gold border — thick and ornate
cx.strokeStyle = '#c0a040';
cx.lineWidth = 10;
cx.strokeRect(18, 18, w - 36, h - 36);
// Inner border line
cx.lineWidth = 3;
cx.strokeRect(30, 30, w - 60, h - 60);

cx.fillStyle = '#c8a840';
cx.textAlign = 'center';

// Main title — large
cx.font = 'bold 52px Georgia';
cx.fillText('THE', w/2, 100);
cx.font = 'bold 64px Georgia';
cx.fillText('COACH', w/2, 175);
cx.font = 'bold 52px Georgia';
cx.fillText('&', w/2, 240);
cx.font = 'bold 64px Georgia';
cx.fillText('HORSES', w/2, 315);

// Decorative line
cx.strokeStyle = '#c0a040';
cx.lineWidth = 2;
cx.beginPath();
cx.moveTo(100, 355); cx.lineTo(w - 100, 355);
cx.stroke();

cx.fillStyle = '#c8a840';
cx.font = '28px Georgia';
cx.fillText('BUILT IN 1847', w/2, 400);

// Decorative line
cx.beginPath();
cx.moveTo(120, 430); cx.lineTo(w - 120, 430);
cx.stroke();

cx.font = 'italic 34px Georgia';
cx.fillText("NORMAN'S", w/2, 480);

cx.font = 'bold 36px Georgia';
cx.fillText('THE', w/2, 545);
cx.font = 'bold 44px Georgia';
cx.fillText("WEST END'S", w/2, 600);
cx.font = 'bold 52px Georgia';
cx.fillText('BEST', w/2, 665);
cx.fillText('KNOWN', w/2, 730);
cx.font = 'bold 60px Georgia';
cx.fillText('PUB', w/2, 810);

// Decorative line
cx.strokeStyle = '#c0a040';
cx.lineWidth = 2;
cx.beginPath();
cx.moveTo(80, 855); cx.lineTo(w - 80, 855);
cx.stroke();

cx.font = 'italic 26px Georgia';
cx.fillText('Traditional', w/2, 905);
cx.font = 'bold 30px Georgia';
cx.fillText('BEERS & LAGERS', w/2, 955);
});
var bannerMat = new THREE.MeshStandardMaterial({
map: bannerTex, roughness: 0.4, emissive: 0x6b0e0e, emissiveIntensity: 0.35,
emissiveMap: bannerTex
});
// Banner faces outward from corner at 45° — toward (+X, +Z)
// Sized to fill most of the chamfer face: 2.5 wide, 7 tall
// The chamfer face diagonal = 3 * sqrt(2)/2 ≈ 2.12, so 2.0 wide fits nicely
// Use DoubleSide so it's visible from both directions, and BasicMaterial so lighting can't hide it
var bannerMeshMat = new THREE.MeshBasicMaterial({
map: bannerTex, side: THREE.DoubleSide
});
var banner = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 8.0), bannerMeshMat);
// Position clearly in front of the chamfer wall
banner.position.set(1.6, 6, 1.6);
banner.rotation.y = Math.PI / 4; // face toward camera at (+X, +Z) — NOTE: positive PI/4!
pub.add(banner);

// Strong spot light on the banner — it should glow in the fog
var bannerSpot = new THREE.SpotLight(0xffddaa, 1.2, 15, Math.PI / 5, 0.3);
bannerSpot.position.set(3, 14, 3);
bannerSpot.target.position.set(1.6, 6, 1.6);
pub.add(bannerSpot);
pub.add(bannerSpot.target);

// Second light from below to catch the lower half
var bannerSpot2 = new THREE.PointLight(0xffccaa, 0.4, 8);
bannerSpot2.position.set(1.5, 2, 1.5);
pub.add(bannerSpot2);

// ----- HANGING PUB SIGN (Greek St face) -----
var signTex = makeCanvasTexture(128, 128, function(cx, w, h) {
cx.fillStyle = '#6b0e0e';
cx.fillRect(0, 0, w, h);
cx.strokeStyle = '#c0a040'; cx.lineWidth = 3;
cx.strokeRect(5, 5, w-10, h-10);
cx.fillStyle = '#c8a840';
cx.font = 'bold 16px Georgia'; cx.textAlign = 'center';
cx.fillText('COACH', w/2, 45);
cx.fillText('&', w/2, 65);
cx.fillText('HORSES', w/2, 85);
cx.font = '10px Georgia'; cx.fillText("NORMAN'S", w/2, 108);
});
var signMat = new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.5, side: THREE.DoubleSide });
var hangSign = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), signMat);
hangSign.position.set(1.2, 3.8, -4.2);
pub.add(hangSign);
// Bracket
var bracketMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
placeMesh(new THREE.BoxGeometry(1.2, 0.05, 0.05), bracketMat, 0.6, 4.3, -4.2);
placeMesh(new THREE.BoxGeometry(0.05, 0.55, 0.05), bracketMat, 1.2, 4.05, -4.2);

// ----- CHIMNEYS -----
var chimMat = new THREE.MeshStandardMaterial({ color: 0xa09080, roughness: 0.85 });
placeMesh(new THREE.BoxGeometry(0.5, 1.5, 0.5), chimMat, -2, 12.75, -1);
placeMesh(new THREE.BoxGeometry(0.5, 1.5, 0.5), chimMat, -6, 12.75, -2);
placeMesh(new THREE.BoxGeometry(0.6, 0.15, 0.6), chimMat, -2, 13.55, -1);
placeMesh(new THREE.BoxGeometry(0.6, 0.15, 0.6), chimMat, -6, 13.55, -2);

scene.add(pub);

// ============================================================
// NEIGHBOURING BUILDINGS
// ============================================================

// --- NEXT DOOR: Building adjoining pub on Greek St (further down the street) ---
// Greek St face ends at z=-5, so this building starts right there
// In the photo this is a dark/red brick building flush against the pub
var greekNextDoor = new THREE.Group();
var gndBody = new THREE.Mesh(new THREE.BoxGeometry(6, 13, 6), redBrick);
gndBody.position.set(-3, 6.5, -8);
gndBody.castShadow = true;
greekNextDoor.add(gndBody);
// Simple windows on the face visible to camera (at x=0, facing +X)
for (var row = 0; row < 3; row++) {
for (var col = 0; col < 2; col++) {
var gndGlass = (window.dssScene && window.dssScene.makeDressedWindow)
  ? window.dssScene.makeDressedWindow(row === 1 && col === 0, (row + col) % 3, (row * 2 + col) % 4)
  : darkGlass;
var wm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.2, 0.6), gndGlass);
wm.position.set(0.05, 4 + row * 3.5, -6.5 - col * 2.5);
greekNextDoor.add(wm);
var wf = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.3, 0.7), windowFrame);
wf.position.set(0.04, 4 + row * 3.5, -6.5 - col * 2.5);
greekNextDoor.add(wf);
}
}
scene.add(greekNextDoor);

// A further building down Greek St beyond that one
var greekFarB = new THREE.Mesh(
new THREE.BoxGeometry(6, 11, 8),
new THREE.MeshStandardMaterial({ color: 0x5a4a3a, roughness: 0.9 })
);
greekFarB.position.set(-3, 5.5, -15);
greekFarB.castShadow = true;
scene.add(greekFarB);

// --- NEXT DOOR: Building adjoining pub on Romilly St ---
// Romilly face ends at x=-9, so this building starts right there
// In the photo this is a blue/grey building flush against the pub
var romNextDoor = new THREE.Group();
var rndBody = new THREE.Mesh(new THREE.BoxGeometry(6, 14, 6), blueBrick);
rndBody.position.set(-12, 7, -3);
rndBody.castShadow = true;
romNextDoor.add(rndBody);
// Windows on the face facing +Z (toward Romilly St / camera)
for (var row = 0; row < 3; row++) {
for (var col = 0; col < 2; col++) {
var rndGlass = (window.dssScene && window.dssScene.makeDressedWindow)
  ? window.dssScene.makeDressedWindow(row === 2 && col === 1, (row * 2 + col) % 3, (row + col) % 4)
  : darkGlass;
var wm2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.06), rndGlass);
wm2.position.set(-10.5 - col * 2.5, 4 + row * 3.5, 0.05);
romNextDoor.add(wm2);
var wf2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.3, 0.08), windowFrame);
wf2.position.set(-10.5 - col * 2.5, 4 + row * 3.5, 0.04);
romNextDoor.add(wf2);
}
}
scene.add(romNextDoor);

// Further building along Romilly St
var romFarB = new THREE.Mesh(
new THREE.BoxGeometry(8, 12, 6),
new THREE.MeshStandardMaterial({ color: 0x4a3a30, roughness: 0.9 })
);
romFarB.position.set(-19, 6, -3);
romFarB.castShadow = true;
scene.add(romFarB);

// --- BUILDINGS ACROSS THE STREETS ---
// Across Greek St (east side — well behind camera so it doesn't block the view)
var oppGreek = new THREE.Mesh(
new THREE.BoxGeometry(4, 11, 20),
new THREE.MeshStandardMaterial({ color: 0x4a4040, roughness: 0.9 })
);
oppGreek.position.set(16, 5.5, -8);
scene.add(oppGreek);

// Across Romilly St (south side — behind camera)
var oppRom = new THREE.Mesh(
new THREE.BoxGeometry(25, 10, 4),
new THREE.MeshStandardMaterial({ color: 0x504838, roughness: 0.9 })
);
oppRom.position.set(-8, 5, 16);
scene.add(oppRom);

// ============================================================
// PAVEMENTS — raised kerbs along both streets
// ============================================================
var kerbMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.8 });
var paveMat = (chKit && chKit.makePavingSlabs)
  ? chKit.makePavingSlabs({ repeat: [10, 3] })
  : new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.85 });

// Greek St pavement — pub side (west, at x≈0-1)
// Runs along -Z from z=5 down to z=-20
var greekPaveW = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.15, 30), paveMat);
greekPaveW.position.set(1.25, 0.075, -5);
greekPaveW.receiveShadow = true;
scene.add(greekPaveW);
// Kerb edge
var greekKerbW = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.18, 30), kerbMat);
greekKerbW.position.set(2.5, 0.09, -5);
scene.add(greekKerbW);

// Greek St pavement — opposite side (east, at x≈8-9)
var greekPaveE = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.15, 30), paveMat);
greekPaveE.position.set(7.75, 0.075, -5);
greekPaveE.receiveShadow = true;
scene.add(greekPaveE);
var greekKerbE = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.18, 30), kerbMat);
greekKerbE.position.set(6.5, 0.09, -5);
scene.add(greekKerbE);

// Romilly St pavement — pub side (north, at z≈0-1)
var romPaveN = new THREE.Mesh(new THREE.BoxGeometry(25, 0.15, 2.5), paveMat);
romPaveN.position.set(-10, 0.075, 1.25);
romPaveN.receiveShadow = true;
scene.add(romPaveN);
var romKerbN = new THREE.Mesh(new THREE.BoxGeometry(25, 0.18, 0.15), kerbMat);
romKerbN.position.set(-10, 0.09, 2.5);
scene.add(romKerbN);

// Romilly St pavement — opposite side (south, at z≈8-9)
var romPaveS = new THREE.Mesh(new THREE.BoxGeometry(25, 0.15, 2.5), paveMat);
romPaveS.position.set(-10, 0.075, 7.75);
romPaveS.receiveShadow = true;
scene.add(romPaveS);
var romKerbS = new THREE.Mesh(new THREE.BoxGeometry(25, 0.18, 0.15), kerbMat);
romKerbS.position.set(-10, 0.09, 6.5);
scene.add(romKerbS);

// Corner pavement (where the two streets meet, in front of the pub)
var cornerPave = new THREE.Mesh(new THREE.BoxGeometry(4, 0.15, 4), paveMat);
cornerPave.position.set(1.5, 0.075, 1.5);
cornerPave.receiveShadow = true;
scene.add(cornerPave);

// ============================================================
// STREETLAMPS
// ============================================================
// Toolkit Victorian gas lamps — decay 2 + generous range so the pool of
// light dies naturally instead of terminating in a line across the road
// (memory: project_light_range_terminator.md).
var lampLights = [];
function createLamp(x, z, castsShadow) {
  if (chKit && chKit.createVictorianGasLamp) {
    var lamp = chKit.createVictorianGasLamp(scene, x, z, { intensity: 2.2, distance: 30, haloScale: 2.6 });
    // Only the near lamp pays for a shadow map — four shadow-casting
    // lights (3 lamps + moon) is silent frame cost for no visible gain
    if (lamp.userData.light) lamp.userData.light.castShadow = !!castsShadow;
    // The toolkit lantern's side panes are single-sided planes with inward
    // normals — from a three-quarter camera the lantern reads unlit. Render
    // both faces, brighten the halo, and seat a solid emissive glass core
    // inside the cage so the head reads lit from every angle and distance.
    lamp.traverse(function(o) {
      if (o.material && o.material.isMeshBasicMaterial) o.material.side = THREE.DoubleSide;
      if (o.isSprite) {
        // Additive blending: the glow sums over the dark scene instead of
        // alpha-mixing into it — this is what makes the mantle read as LIGHT
        o.material.blending = THREE.AdditiveBlending;
        o.material.opacity = Math.min(1, o.material.opacity + 0.25);
      }
    });
    var lampCore = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.38, 0.24),
      new THREE.MeshBasicMaterial({ color: 0xffe6b0 })
    );
    lampCore.position.set(0, 5.16, 0);
    lampCore.userData.noShadow = true;
    lamp.add(lampCore);
    if (lamp.userData.light) {
      lamp.userData.light.decay = 2;
      lampLights.push(lamp.userData.light);
    }
    return;
  }
  var light = new THREE.PointLight(0xffdda0, 0.6, 15);
  light.position.set(x, 4.8, z);
  scene.add(light);
  lampLights.push(light);
}

createLamp(1, 1);
createLamp(1, -8);
createLamp(7, 4, true);

// ============================================================
// LIGHTING — low ambient + cold moonlight casting real shadows on the street
// ============================================================
scene.add(new THREE.AmbientLight(0x1a1a2a, 0.30)); // was 0.20 — the corner was reading as void

var moonLight = new THREE.DirectionalLight(0x6a78b8, 0.38);
moonLight.position.set(10, 22, -4);
moonLight.target.position.set(0, 3, 0);
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

function enableChSceneShadows(root) {
  root.traverse(function(obj) {
    if (!(obj instanceof THREE.Mesh)) return;
    if (obj.userData.noShadow) return;
    var mat = obj.material;
    if (mat && (mat.transparent === true && (mat.opacity || 1) < 0.7)) return;
    obj.receiveShadow = true;
    if (obj.position.y > 0.2 || (obj.geometry && obj.geometry.type !== 'PlaneGeometry')) {
      obj.castShadow = true;
    }
  });
}
setTimeout(function() { enableChSceneShadows(scene); }, 0);

// Warm interior glow spilling from the pub windows. These sit OUTSIDE the
// facade slabs — a light buried inside the building body faces the back of
// the facade and never reaches the street.
var pubGlow1 = new THREE.PointLight(0xc89030, 2.6, 18);
pubGlow1.decay = 2;
pubGlow1.position.set(1.1, 2.0, -2.5);
scene.add(pubGlow1);
var pubGlow2 = new THREE.PointLight(0xc89030, 2.4, 18);
pubGlow2.decay = 2;
pubGlow2.position.set(-4.0, 2.0, 1.1);
scene.add(pubGlow2);

// ============================================================
// FOG VOLUMES — thick Soho pea-souper atmosphere
// ============================================================

// Shared fog textures (create once, reuse)
var thickFogTex = makeCanvasTexture(128, 128, function(cx, w, h) {
var grad = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
grad.addColorStop(0, 'rgba(180, 170, 155, 0.25)');
grad.addColorStop(0.4, 'rgba(150, 140, 130, 0.12)');
grad.addColorStop(1, 'rgba(120, 110, 100, 0)');
cx.fillStyle = grad;
cx.fillRect(0, 0, w, h);
});
var thinFogTex = makeCanvasTexture(128, 128, function(cx, w, h) {
var grad = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
grad.addColorStop(0, 'rgba(140, 135, 125, 0.15)');
grad.addColorStop(0.6, 'rgba(120, 115, 105, 0.06)');
grad.addColorStop(1, 'rgba(100, 95, 85, 0)');
cx.fillStyle = grad;
cx.fillRect(0, 0, w, h);
});
var warmFogTex = makeCanvasTexture(128, 128, function(cx, w, h) {
var grad = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
grad.addColorStop(0, 'rgba(200, 160, 100, 0.12)');
grad.addColorStop(0.5, 'rgba(180, 140, 80, 0.05)');
grad.addColorStop(1, 'rgba(150, 120, 60, 0)');
cx.fillStyle = grad;
cx.fillRect(0, 0, w, h);
});

var fogSprites = [];

// LAYER 1: Thick ground-hugging fog banks (the main pea-souper)
for (var i = 0; i < 50; i++) {
var fogMat = new THREE.SpriteMaterial({
map: thickFogTex, transparent: true,
opacity: 0.25 + Math.random() * 0.2
});
var fogSprite = new THREE.Sprite(fogMat);
fogSprite.position.set(
Math.random() * 50 - 20,
0.3 + Math.random() * 2,
Math.random() * 50 - 20
);
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

// LAYER 2: Mid-height fog (swirling around building level)
for (var i = 0; i < 30; i++) {
var midFogMat = new THREE.SpriteMaterial({
map: thinFogTex, transparent: true,
opacity: 0.07 + Math.random() * 0.08 // was 0.15-0.30 — stacked wisps in the camera corridor were washing the gas lamps out to dead grey
});
var midFog = new THREE.Sprite(midFogMat);
midFog.position.set(
Math.random() * 40 - 15,
2 + Math.random() * 6,
Math.random() * 40 - 15
);
var ms = 6 + Math.random() * 14;
midFog.scale.set(ms, ms * 0.3, 1);
scene.add(midFog);
fogSprites.push({
sprite: midFog,
baseX: midFog.position.x,
drift: 0.004 + Math.random() * 0.008,
sway: Math.random() * Math.PI * 2,
swaySpeed: 0.002 + Math.random() * 0.006,
swayAmt: 0.5 + Math.random() * 1.5
});
}

// LAYER 3: Warm-tinted fog near the pub (light spilling into mist)
for (var i = 0; i < 15; i++) {
var warmFogMat = new THREE.SpriteMaterial({
map: warmFogTex, transparent: true,
opacity: 0.2 + Math.random() * 0.15
});
var warmFog = new THREE.Sprite(warmFogMat);
warmFog.position.set(
Math.random() * 10 - 3,
0.5 + Math.random() * 3,
Math.random() * 10 - 3
);
var ws = 3 + Math.random() * 6;
warmFog.scale.set(ws, ws * 0.4, 1);
scene.add(warmFog);
fogSprites.push({
sprite: warmFog,
baseX: warmFog.position.x,
drift: 0.003 + Math.random() * 0.005,
sway: Math.random() * Math.PI * 2,
swaySpeed: 0.002 + Math.random() * 0.005,
swayAmt: 0.3 + Math.random() * 0.6
});
}

// LAYER 4: High wisps drifting past the rooftops
for (var i = 0; i < 20; i++) {
var wispMat = new THREE.SpriteMaterial({
map: thinFogTex, transparent: true,
opacity: 0.1 + Math.random() * 0.1
});
var wisp = new THREE.Sprite(wispMat);
wisp.position.set(
Math.random() * 40 - 15,
6 + Math.random() * 8,
Math.random() * 40 - 15
);
wisp.scale.set(8 + Math.random() * 15, 3 + Math.random() * 4, 1);
scene.add(wisp);
fogSprites.push({
sprite: wisp,
baseX: wisp.position.x,
drift: 0.006 + Math.random() * 0.012,
sway: Math.random() * Math.PI * 2,
swaySpeed: 0.003 + Math.random() * 0.008,
swayAmt: 0.8 + Math.random() * 2.0
});
}

// ============================================================
// PUDDLES (post-rain, wet ground)
// ============================================================
// Reuse three existing puddles for broken window colour and a premature ember.
var chWaterTex=makeCanvasTexture(64,128,function(cx,w,h){
  for(var ri=0;ri<42;ri++){var v=ri/42,fade=Math.sin(v*Math.PI),width=(12+(ri%5)*5)*fade;
    cx.fillStyle='rgba(239,189,118,'+(.12+(ri%4)*.05)*fade+')';cx.fillRect((w-width)/2+Math.sin(ri*.8)*3,v*h,width,1+(ri%2));}
});
var chWaterMats=[],chEmberWater;

for (var i = 0; i < 8; i++) {
var puddleMat = new THREE.MeshStandardMaterial({
color: 0x111118, roughness: 0.1, metalness: 0.6, transparent: true, opacity: 0.3
});
var puddle = new THREE.Mesh(new THREE.CircleGeometry(0.4 + Math.random() * 0.8, 16), puddleMat);
puddle.rotation.x = -Math.PI / 2;
puddle.position.set(
Math.random() * 16 - 4,
0.02,
Math.random() * 16 - 4
);
if(i===0){
  puddle.material.dispose();puddle.material=new THREE.MeshBasicMaterial({map:emberTex,color:0xc79063,transparent:true,opacity:.075,depthWrite:false,blending:THREE.AdditiveBlending});
  puddle.position.set(1.15,.023,-3.65);puddle.scale.set(.3,.7,1);chEmberWater=puddle;
}else if(i<3){
  puddle.material.dispose();puddle.material=new THREE.MeshBasicMaterial({map:chWaterTex,color:0xe3ba83,transparent:true,opacity:.23,depthWrite:false,blending:THREE.AdditiveBlending});
  puddle.position.set(i===1?2.1:-3.7,.024,i===1?-1.8:2.0);puddle.scale.set(.85,1.9,1);if(i===2)puddle.rotation.z=Math.PI/2;
  chWaterMats.push(puddle.material);
}else puddle.material.depthWrite=false;
scene.add(puddle);
}

// ============================================================
// ANIMATION
// ============================================================
var clock = new THREE.Clock();
var chLastT = 0;
var firePanes=[];
if(chIsFire){chFireWindows.concat(chFireUpper).forEach(function(m){pub.traverse(function(o){if(o.material===m)firePanes.push(o);});});signMat.color.setHex(0x080b10);}
var chFireFX=chIsFire?makeCoachFire(scene,pub,firePanes):null;
if(chIsFire){drinker.visible=false;ember.visible=false;silhouettes.forEach(function(s){s.mesh.visible=false;});cigWisps.forEach(function(w){w.sprite.visible=false;});}


function chAnimate() {
chAnimId = requestAnimationFrame(chAnimate);
var t = chStill?0:clock.getElapsedTime();
var dt = Math.min(t - chLastT, 0.1);
chLastT = t;

// Very subtle light breathing (barely perceptible)
var breath = 0.97 + Math.sin(t * 0.4) * 0.03;
doorLight.intensity = 0.8 * breath;
pubGlow1.intensity = 2.6 * breath;
pubGlow2.intensity = 2.4 * (.97+Math.sin(t*.4-.7)*.03);
warmGlass.emissiveIntensity=.8+Math.sin(t*.4-.4)*.012;
lantern1.intensity = 0.55 * (0.97 + Math.sin(t * .57) * 0.025);
lantern2.intensity = 0.55 * (0.97 + Math.sin(t * .63 + 1.4) * 0.025);

// Gas mantle flicker — irregular, per-lamp phase
for (var i = 0; i < lampLights.length; i++) {
var lamp = lampLights[i];
if (lamp.userData.chBase === undefined) lamp.userData.chBase = lamp.intensity;
var lf = .96
  + Math.sin(t*.39+i*2.1)*.018
  + Math.sin(t*.83+i)*.01
  + Math.sin(t*1.37+i*3.3)*.004;
lamp.intensity = lamp.userData.chBase * lf;
}

// The drinker's cigarette: ember flares on the drag, smoke rises steadily
emberState.nextFlare -= dt;
if (emberState.nextFlare <= 0 && emberState.flareT < 0) {
emberState.flareT = 0;
emberState.nextFlare = 7 + Math.random() * 7;
}
if (emberState.flareT >= 0) {
emberState.flareT += dt;
var ef = emberState.flareT;
if (ef < 1.6) {
var ek = ef < 0.5 ? ef / 0.5 : Math.max(0, 1 - (ef - 0.5) / 1.1);
ember.material.opacity = 0.35 + ek * 0.6;
var es = 0.06 + ek * 0.05;
ember.scale.set(es, es, 1);
} else {
emberState.flareT = -1;
ember.material.opacity = 0.35;
ember.scale.set(0.06, 0.06, 1);
}
}
for (var i = 0; i < cigWisps.length; i++) {
var cwp = cigWisps[i];
cwp.age += dt;
if (cwp.age > cwp.life) cwp.age = 0;
var wa = cwp.age / cwp.life;
cwp.sprite.position.y = 1.75 + wa * 0.9;
cwp.sprite.position.z = -4.11 + Math.sin(cwp.phase + t * .35) * .14 * wa;
cwp.sprite.position.x = .58+wa*.1+Math.sin(cwp.phase+t*.3)*.08*wa;
var ws = 0.1 + wa * 0.32;
cwp.sprite.scale.set(ws, ws, 1);
cwp.sprite.material.opacity = (wa < 0.15 ? wa / 0.15 : 1 - (wa - 0.15) / 0.85) * 0.3;
}

// Silhouettes sway gently
for (var i = 0; i < silhouettes.length; i++) {
var s = silhouettes[i];
s.swayPhase += s.swaySpeed * dt * .48;
var swayOffset = Math.sin(s.swayPhase) * s.swayAmt * 0.5;
s.mesh.position.y = 1.8 + Math.sin(s.swayPhase * 0.7) * 0.005;
if (s.mesh.rotation.y > 1) {
s.mesh.position.z = s.baseZ + swayOffset;
} else {
s.mesh.position.x = s.baseX + swayOffset;
}
}

// A small reflection takes the drag a second before the smoker does.
var chPremonition=!chStill && emberState.flareT<0 && emberState.nextFlare<1.25?Math.sin(Math.max(0,emberState.nextFlare)/1.25*Math.PI):0;
chEmberWater.material.opacity=.075+chPremonition*.07;
chWaterTex.offset.x=Math.sin(t*.23)*.007;
for(var wi=0;wi<chWaterMats.length;wi++)chWaterMats[wi].opacity=.23+Math.sin(t*.4-wi*.7)*.01;

// Film grain
chGrainFrame++;
if (chGrainFrame===1 || (!chStill && chGrainFrame % 18 === 0)) {
var imgData = chGrainCtx.createImageData(256, 256);
var d = imgData.data;
for (var i = 0; i < d.length; i += 4) {
var v = Math.random() * 255;
d[i] = d[i+1] = d[i+2] = v;
d[i+3] = 255;
}
chGrainCtx.putImageData(imgData, 0, 0);
}

if(chFireFX){var ft=chStill?chFireTune.stillTime:t;chFireFX(ft);doorLight.intensity=.08;pubGlow1.intensity=.35*Math.exp(-ft/(20*chFireTune.pace));pubGlow2.intensity=.28*Math.exp(-ft/(20*chFireTune.pace));warmGlass.emissive.setHex(0x873b27);warmGlass.emissiveIntensity=.18*Math.exp(-ft/(20*chFireTune.pace));chEmberWater.material.opacity=0;
  chWaterMats.forEach(function(m,i){m.color.setHex(0xaab8c7).lerp(new THREE.Color(0xb68b60),Math.exp(-ft/(9*chFireTune.pace)));m.opacity=.025+.19*Math.exp(-ft/((8+i*3)*chFireTune.pace));});}
if (typeof dssComposerLocal !== 'undefined' && dssComposerLocal) { dssComposerLocal.render(); } else { renderer.render(scene, camera); }
}

chAnimate();

// ENTER BUTTON
var chBtn = document.createElement('button');
var chFireExit=document.querySelector('tw-passage [data-coach-fire-end] tw-link');
chBtn.textContent = chIsFire&&chFireExit?chFireExit.textContent:'ENTER THE COACH AND HORSES';
if(chIsFire)chBtn.className='claude-draft';
var chLocked=!chIsFire&&!!document.querySelector('tw-passage [data-coach-locked]');
chBtn.style.cssText = [
'position:absolute','bottom:60px','left:50%','transform:translateX(-50%)',
'font:13px \'Courier New\',monospace','color:rgba(200,170,100,0.85)',
'letter-spacing:4px','cursor:pointer','padding:12px 28px',
'border:1px solid rgba(200,170,100,0.3)','background:rgba(0,0,0,0.4)',
'z-index:9003','white-space:nowrap','opacity:0','transition:opacity 1.5s ease'
].join(';');
if(chLocked)chBtn.style.display='none';
chWrap.appendChild(chBtn);
if(chIsFire){
  chBtn.style.color='#ed87ba';chBtn.style.letterSpacing='1px';
  var copy=document.querySelector('tw-passage [data-coach-fire-copy]'),card=document.createElement('div');card.textContent=copy?copy.textContent:'';
  card.style.cssText='position:absolute;bottom:125px;left:50%;transform:translateX(-50%);width:min(580px,85vw);padding:18px;color:#e8e2d2;background:#10151ae0;border-top:1px solid #9c839166;font:17px/1.5 Georgia,serif;z-index:9003;opacity:0;transition:opacity 2s ease';chWrap.appendChild(card);
  // 2026-10-08 (Sam): 'It is done. The blackout falls': no button. The line comes up with the fire, holds, then the scene goes dark and presses the parked link to the Fetch.
  chBtn.style.display='none';setTimeout(function(){card.style.opacity='1';},2500);
  setTimeout(function(){if(!chFireExit||!document.body.contains(chWrap))return;try{window.dssFireTrace(renderer,function(){if(dssComposerLocal)dssComposerLocal.render();else renderer.render(scene,camera);},chFireTune.exitFade);}catch(e){}chFireExit.click();},(chFireTune.stillTime+4)*1000);
} else {
  var waitSrc=document.querySelector('tw-passage [data-coach-wait]');if(chLocked&&waitSrc){var wcard=document.createElement('div');wcard.innerHTML=waitSrc.innerHTML; /* 2026-10-20: the passage's paragraph breaks come across (was textContent) */wcard.style.cssText='position:absolute;bottom:125px;left:50%;transform:translateX(-50%);width:min(580px,85vw);padding:18px;color:#e8e2d2;background:#10151ae0;border-top:1px solid #9c839166;font:17px/1.5 Georgia,serif;z-index:9003';chWrap.appendChild(wcard);}
  ['start','leave'].forEach(function(kind,i){var native=document.querySelector('tw-passage [data-coach-fire-'+kind+'] tw-link');if(!native)return;var alt=document.createElement('button');alt.type='button';alt.dataset.coachAction=kind;alt.textContent=native.textContent;alt.style.cssText='position:absolute;bottom:'+(112+i*42)+'px;left:50%;transform:translateX(-50%);max-width:92vw;z-index:9004;padding:10px 24px;color:rgba(230,200,120,0.95);background:rgba(0,0,0,0.5);border:1px solid rgba(200,170,100,0.5);font:13px Courier New,monospace;letter-spacing:3px;cursor:pointer';alt.onclick=function(){native.click();};chWrap.appendChild(alt);});
}

setTimeout(function() { chBtn.style.opacity = '1'; }, 1500);

chBtn.addEventListener('mouseenter', function() {
if(chIsFire)return;
this.style.color = 'rgba(230,200,120,0.95)';
this.style.borderColor = 'rgba(200,170,100,0.6)';
});
chBtn.addEventListener('mouseleave', function() {
if(chIsFire)return;
this.style.color = 'rgba(200,170,100,0.85)';
this.style.borderColor = 'rgba(200,170,100,0.3)';
});

chBtn.addEventListener('click', function() {
if(chIsFire){if(chFireExit){window.dssFireTrace(renderer,function(){if(dssComposerLocal)dssComposerLocal.render();else renderer.render(scene,camera);},chFireTune.exitFade);chFireExit.click();}return;}
chWrap.style.transition = 'opacity 1.2s ease';
chWrap.style.opacity = '0';
setTimeout(function() {
cancelAnimationFrame(chAnimId);
chWrap.remove();
var TARGET = 'Coach and Horses lock';
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

// Watch for ch-container. Cleanup mirrors Pillars/Lackland: when the
// container disappears (passage change), cancel the animate loop and
// remove the body-appended wrap so the canvas + listeners don't leak.
setInterval(function() {
var container = document.querySelector('tw-passage #ch-container');
if(container!==chHost){
  if(chAnimId){cancelAnimationFrame(chAnimId);chAnimId=null;}
  if(chDisposeExtra){chDisposeExtra();chDisposeExtra=null;}
  window._dssDisposeWrap('ch-wrap');chActive=false;chHost=container;
}
if(container&&!chActive)initCoachHorses();
}, 300);
})();

