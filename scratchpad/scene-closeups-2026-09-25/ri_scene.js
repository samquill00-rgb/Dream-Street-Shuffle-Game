// ====== INSIDE RONNIE'S — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-26. The fourth "look closer" room. Built from what is written
// of Ronnie Scott's at 47 Frith Street: a dark room in a U around the
// stage, sloping tiers of small tables with red lamps, velvet chairs,
// photographs of the players on the walls, the bar at the back. The
// room sits at the top of the Ronnie Scott's passage (#ri-container)
// and is its navigation: the bar opens the passage's own "Go to the
// Bar" (the round for the band) while the passage offers it, the door
// opens Back to the street when the passage has that link. The stage,
// the photographs, the table behind you and the telephone are
// inspections, their card words pink placeholders for Sam. Nothing
// about the game is decided in JS.
// 2026-09-26. The second "look closer" room, after the French. Built
// from what is written of the Colony Room Club at 41 Dean Street: one
// small first-floor room painted a bilious green, its walls crowded
// with pictures, a small bar, bamboo furniture, an upright piano, a
// window onto the street. The room sits at the top of The Colony Room
// passage (#ri-container) and is its navigation: the man at the bar,
// the agent at his table and the telephone open the passage's own
// links when the passage has rendered them; the bar opens the drink
// when it is offered. The pictures, the piano and the window are
// inspections, their card words pink placeholders for Sam. Nothing
// about the game is decided in JS: the room only finds the passage's
// links by their wording and clicks them.
(function() {
var riActive = false;
var riAnimId = null;

function initRonniesInside() {
if (riActive) return;
riActive = true;
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(buildRIScene) : buildRIScene()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(buildRIScene) : buildRIScene());
}
}

function buildRIScene() {
var riStill = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var riHost = document.getElementById('ri-container');
if (!riHost) { riActive = false; return; }
var riWrap = document.createElement('div');
riWrap.id = 'ri-wrap';
function riSize() {
var w = Math.max(280, document.documentElement.clientWidth || window.innerWidth);
var vh = window.innerHeight || 800;
var h = Math.round(w < 600 ? Math.max(300, vh * 0.56) : Math.max(320, Math.min(vh * 0.66, 680)));
return { w: w, h: h };
}
var riSz = riSize();
riWrap.style.cssText = 'position:relative;width:100vw;margin-left:calc(50% - 50vw);height:' + riSz.h + 'px;z-index:0;isolation:isolate;background:#050304;overflow:hidden;';
var riCanvas = document.createElement('canvas');
riCanvas.width = riSz.w; riCanvas.height = riSz.h;
riCanvas.style.cssText = 'display:block;position:absolute;top:0;left:0;width:100%;height:100%;touch-action:manipulation;';
riWrap.appendChild(riCanvas);
var riWash = document.createElement('div');
riWash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9000;background:linear-gradient(180deg,rgba(10,18,6,0.3) 0%,rgba(6,10,4,0.05) 35%,rgba(6,10,4,0.05) 60%,rgba(3,5,2,0.45) 100%);';
riWrap.appendChild(riWash);
var riVig = document.createElement('div');
riVig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:radial-gradient(ellipse at 50% 44%,transparent 24%,rgba(0,0,0,0.74) 100%);';
riWrap.appendChild(riVig);
var riGrain = document.createElement('div');
riGrain.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9002;opacity:0.06;mix-blend-mode:overlay;background:url(' + (window.dssGetGrainURL ? window.dssGetGrainURL() : '') + ');';
riWrap.appendChild(riGrain);
var riLoc = document.createElement('div');
riLoc.textContent = 'RONNIE SCOTT\'S, FRITH STREET';
riLoc.style.cssText = 'position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font:12px \'Courier New\',monospace;color:rgba(190,200,140,0.25);letter-spacing:3px;white-space:nowrap;z-index:9003;pointer-events:none;';
riWrap.appendChild(riLoc);
riHost.appendChild(riWrap);
riSz = riSize(); riWrap.style.height = riSz.h + 'px';

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x050304);
scene.fog = new THREE.FogExp2(0x0a0506, 0.05);
var aspect = riSz.w / riSz.h;
var portrait = aspect < 1;
var camera = new THREE.PerspectiveCamera(portrait ? 92 : 70, aspect, 0.05, 40);
// from just inside the door at the front left, looking across the room to the bar and the piano
var CAM = portrait ? { x: -0.3, y: 1.5, z: 3.9, tx: 0.1, ty: 1.15, tz: -2.8 } : { x: -0.3, y: 1.45, z: 2.6, tx: 0.1, ty: 1.2, tz: -2.8 };
camera.position.set(CAM.x, CAM.y, CAM.z);

var renderer = new THREE.WebGLRenderer({ canvas: riCanvas, antialias: true });
renderer.setSize(riSz.w, riSz.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, riSz.w < 600 ? 1.25 : 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.6;
window._dssBindScene('ri-wrap', scene, renderer, camera);
var origResize = window._dssThreeRegistry['ri-wrap'].resize;
window._dssThreeRegistry['ri-wrap'].resize = function() {
riSz = riSize(); riWrap.style.height = riSz.h + 'px';
camera.aspect = riSz.w / riSz.h;
camera.fov = camera.aspect < 1 ? 92 : 70;
camera.updateProjectionMatrix();
renderer.setSize(riSz.w, riSz.h);
};
window.removeEventListener('resize', origResize);
window.addEventListener('resize', window._dssThreeRegistry['ri-wrap'].resize);

function tex(w, h, fn) {
var c = document.createElement('canvas'); c.width = w; c.height = h;
var cx = c.getContext('2d'); fn(cx, w, h);
var t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearMipmapLinearFilter;
t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
return t;
}
function rnd(seed) { var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function mesh(geo, mat, x, y, z, parent) { var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || scene).add(m); return m; }

// ---------- THE ROOM: a dark U around the stage, tiers of small tables, red lamps ----------
// From what is written of Ronnie Scott's at 47 Frith Street: a dark room with velvet chairs, small tables, red table lamps,
// sloping layers of tables in a U around the stage, photographs of the players on the walls, the bar at the back.
var W = 7.0, D = 9.0, H = 3.2;
var wallTex = tex(512, 256, function(cx, w, h) {
cx.fillStyle = '#1c1210'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 700; i++) { var x = rnd(i) * w, y = rnd(i + 7) * h, r = 6 + rnd(i + 3) * 30; var g = cx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rnd(i + 11) < 0.5 ? 'rgba(80,30,30,0.12)' : 'rgba(0,0,0,0.2)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); }
});
wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping; wallTex.repeat.set(3, 1);
var wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.9 });
var carpetTex = tex(256, 256, function(cx, w, h) { cx.fillStyle = '#241012'; cx.fillRect(0, 0, w, h); for (var i = 0; i < 3000; i++) { cx.fillStyle = rnd(i) < 0.5 ? 'rgba(90,30,30,0.3)' : 'rgba(0,0,0,0.3)'; cx.fillRect(rnd(i + 1) * w, rnd(i + 2) * h, 2, 2); } });
carpetTex.wrapS = carpetTex.wrapT = THREE.RepeatWrapping; carpetTex.repeat.set(4, 5);
var floor = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: carpetTex, roughness: 1 }), 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceil = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ color: 0x0c0806, roughness: 1 }), 0, H, 0); ceil.rotation.x = Math.PI / 2;
var back = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2); back.receiveShadow = true;
var front = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, D / 2); front.rotation.y = Math.PI;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2;
var right = mesh(new THREE.PlaneGeometry(D, H), wallMat, W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2;
var woodMat = new THREE.MeshStandardMaterial({ color: 0x2a1a0c, roughness: 0.45, metalness: 0.05 });
var velvet = new THREE.MeshStandardMaterial({ color: 0x6a1418, roughness: 0.95 });

// ---------- THE STAGE, at the far end, under its light ----------
var stageG = new THREE.Group(); stageG.position.set(0, 0, -D / 2 + 1.5); scene.add(stageG);
var stage = mesh(new THREE.BoxGeometry(4.4, 0.42, 2.6), woodMat, 0, 0.21, 0, stageG); stage.castShadow = true; stage.receiveShadow = true;
mesh(new THREE.PlaneGeometry(4.6, 3.2), new THREE.MeshStandardMaterial({ color: 0x3a0c10, roughness: 1 }), 0, 1.6, -1.29, stageG); // the red curtain behind
for (var f = 0; f < 18; f++) mesh(new THREE.BoxGeometry(0.08, 3.1, 0.04), new THREE.MeshStandardMaterial({ color: f % 2 ? 0x4a1014 : 0x300a0c, roughness: 1 }), -2.2 + f * 0.26, 1.55, -1.27, stageG);
// the grand piano, lid up, stage left
var pianoG = new THREE.Group(); pianoG.position.set(-1.3, 0.42, -0.2); pianoG.rotation.y = 0.5; stageG.add(pianoG);
var black = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.15, metalness: 0.2 });
var pbody = mesh(new THREE.BoxGeometry(1.5, 0.3, 1.4), black, 0, 0.92, 0, pianoG); pbody.castShadow = true;
var lid = mesh(new THREE.BoxGeometry(1.4, 0.03, 1.3), black, 0.05, 1.5, -0.1, pianoG); lid.rotation.z = -0.75; lid.position.x = 0.5; lid.position.y = 1.4;
mesh(new THREE.BoxGeometry(0.9, 0.03, 0.14), new THREE.MeshStandardMaterial({ color: 0xe8e0c8, roughness: 0.4 }), 0, 1.08, 0.72, pianoG);
[[-0.65, -0.55], [0.65, -0.55], [0, 0.6]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.78, 8), black, l[0], 0.39, l[1], pianoG); });
// the drum-less trio: mic stands, a stool, an amp for the guitar
var chrome = new THREE.MeshStandardMaterial({ color: 0xc8c8c8, roughness: 0.25, metalness: 0.9 });
mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.5, 8), chrome, 0.3, 0.42 + 0.75, 0.6, stageG);
mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.12, 10), black, 0.3, 0.42 + 1.55, 0.6, stageG).rotation.x = 0.4;
mesh(new THREE.BoxGeometry(0.55, 0.5, 0.3), new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.8 }), 1.6, 0.42 + 0.25, -0.6, stageG);
mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 14), velvet, 1.4, 0.42 + 0.7, 0.2, stageG);
// the spotlight, and its cone in the smoke
var spot = new THREE.SpotLight(0xffe0b0, 3.2, 9, 0.42, 0.55, 1.2); spot.position.set(0, H - 0.1, -D / 2 + 3.4); spot.target.position.set(0.2, 0.6, -D / 2 + 1.5); scene.add(spot); scene.add(spot.target); spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -0.002;
var coneTex = tex(64, 256, function(cx, w, h) { var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(255,230,190,0.28)'); g.addColorStop(1, 'rgba(255,230,190,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); var s = cx.createLinearGradient(0, 0, w, 0); s.addColorStop(0, 'rgba(0,0,0,1)'); s.addColorStop(0.3, 'rgba(0,0,0,0)'); s.addColorStop(0.7, 'rgba(0,0,0,0)'); s.addColorStop(1, 'rgba(0,0,0,1)'); cx.globalCompositeOperation = 'destination-out'; cx.fillStyle = s; cx.fillRect(0, 0, w, h); });
var cone = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 1.5, 3.0, 24, 1, true), new THREE.MeshBasicMaterial({ map: coneTex, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
cone.position.set(0.1, H - 1.5, -D / 2 + 2.4); cone.rotation.x = 0.28; scene.add(cone);

// ---------- THE TABLES, tiers of them in a U, each with its red lamp ----------
var tables = [], lampLights = [];
function table(x, z, seed) {
var g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.03, 18), woodMat, 0, 0.72, 0, g).castShadow = true;
mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.7, 8), black, 0, 0.36, 0, g);
mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 16), black, 0, 0.02, 0, g);
// the red lamp
mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.14, 8), chrome, 0.1, 0.8, 0.05, g);
var shade = mesh(new THREE.ConeGeometry(0.09, 0.1, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xc02020, roughness: 0.6, emissive: 0xa01010, emissiveIntensity: 0.9, side: THREE.DoubleSide }), 0.1, 0.9, 0.05, g);
var l = new THREE.PointLight(0xff5030, 0.9, 2.4); l.position.set(0.1, 0.86, 0.05); g.add(l); lampLights.push(l);
mesh(new THREE.CylinderGeometry(0.03, 0.025, 0.1, 12), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transmission: 0.9, transparent: true, opacity: 0.6 }), -0.12, 0.79, -0.06, g);
// two velvet chairs
[[0, 0.42, 0], [0.45, 0, -Math.PI / 2]].forEach(function(c) { var ch = new THREE.Group(); ch.position.set(c[0], 0, c[1]); ch.rotation.y = c[2]; g.add(ch); mesh(new THREE.BoxGeometry(0.4, 0.06, 0.4), velvet, 0, 0.45, 0, ch); mesh(new THREE.BoxGeometry(0.4, 0.5, 0.05), velvet, 0, 0.72, 0.18, ch); [[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].forEach(function(lg) { mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.44, 6), black, lg[0], 0.22, lg[1], ch); }); });
tables.push(g); return g;
}
// two tiers in a U: the near rows on a low step
var step = mesh(new THREE.BoxGeometry(W, 0.18, 3.6), woodMat, 0, 0.09, D / 2 - 1.8); step.receiveShadow = true;
[[-1.9, -1.5], [-0.3, -1.7], [1.3, -1.6], [2.5, -1.2], [2.6, 0.3], [1.6, 1.2], [2.4, 2.8], [0.6, 3.2], [-1.2, 3.3]].forEach(function(t, i) { var tb = table(t[0], t[1], i); if (t[1] > 2.5) tb.position.y = 0.18; });
var nearTable = table(-1.7, -0.2, 20);   // the empty table at the side, in the half dark

// ---------- THE BAR, along the back wall behind the tables ----------
var barG = new THREE.Group(); scene.add(barG);
var barX = -W / 2 + 0.75, barZ0 = -0.6, barZ1 = 2.6, barLen = barZ1 - barZ0, barZ = (barZ0 + barZ1) / 2, barX0 = barX;
var body = mesh(new THREE.BoxGeometry(0.55, 1.08, barLen), woodMat, barX, 0.54, barZ, barG); body.castShadow = true;
mesh(new THREE.BoxGeometry(0.66, 0.05, barLen + 0.08), black, barX, 1.1, barZ, barG);
var mir = mesh(new THREE.PlaneGeometry(barLen - 0.2, 1.0), new THREE.MeshStandardMaterial({ color: 0x6a6a68, roughness: 0.2, metalness: 0.9 }), -W / 2 + 0.01, 2.0, barZ, barG); mir.rotation.y = Math.PI / 2;
[1.55, 1.95].forEach(function(sy, si) {
mesh(new THREE.BoxGeometry(0.2, 0.03, barLen - 0.2), woodMat, -W / 2 + 0.12, sy, barZ, barG);
var n = 12;
for (var i = 0; i < n; i++) {
var bz = barZ0 + 0.2 + i * ((barLen - 0.4) / n), hgt = 0.2 + rnd(i + si * 30) * 0.12;
var bc = [0x1e3a1e, 0x4a2a10, 0x8a7a30, 0x2a2a3a, 0x6a1a1a, 0xc8c0a0][(rnd(i + si * 7) * 6) | 0];
var bm = new THREE.MeshStandardMaterial({ color: bc, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.85 });
mesh(new THREE.CylinderGeometry(0.03, 0.035, hgt, 10), bm, -W / 2 + 0.12, sy + hgt / 2 + 0.015, bz, barG);
}
});
var barLamp = new THREE.PointLight(0xffc890, 0.8, 3.5); barLamp.position.set(-W / 2 + 0.5, 2.4, 0.9); scene.add(barLamp);
mesh(new THREE.SphereGeometry(0.05, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffe0b0, toneMapped: false }), -W / 2 + 0.5, 2.4, 0.9);
// the telephone at the near end of the bar
var phoneG = new THREE.Group(); phoneG.position.set(barX, 1.12, barZ0 + 0.25); scene.add(phoneG);
mesh(new THREE.BoxGeometry(0.2, 0.08, 0.16), black, 0, 0.04, 0, phoneG);
mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 20), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.3 }), 0, 0.085, 0.03, phoneG);
var hs = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.2, 10), black, 0, 0.12, -0.02, phoneG); hs.rotation.z = Math.PI / 2;
mesh(new THREE.SphereGeometry(0.03, 10, 8), black, -0.1, 0.11, -0.02, phoneG); mesh(new THREE.SphereGeometry(0.03, 10, 8), black, 0.1, 0.11, -0.02, phoneG);
var phoneHit = mesh(new THREE.BoxGeometry(0.34, 0.3, 0.3), new THREE.MeshBasicMaterial({ visible: false }), 0, 0.12, 0, phoneG);

// ---------- THE PHOTOGRAPHS on the side walls, the players who have stood there ----------
var picG = new THREE.Group(); scene.add(picG);
function photoTex(seed) {
return tex(96, 96, function(cx, w, h) {
cx.fillStyle = '#1a1a1a'; cx.fillRect(0, 0, w, h);
var g = cx.createRadialGradient(48 + (rnd(seed) - 0.5) * 30, 40, 4, 48, 48, 60); g.addColorStop(0, 'rgba(230,220,200,0.9)'); g.addColorStop(0.5, 'rgba(120,110,100,0.5)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
cx.fillStyle = 'rgba(0,0,0,0.75)'; cx.beginPath(); cx.arc(48 + (rnd(seed + 1) - 0.5) * 20, 38, 12, 0, 6.3); cx.fill(); cx.fillRect(28 + (rnd(seed + 1) - 0.5) * 20, 50, 40, 46);
if (rnd(seed + 2) < 0.5) { cx.strokeStyle = 'rgba(230,200,120,0.8)'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(60, 60); cx.quadraticCurveTo(80, 70, 70, 90); cx.stroke(); }
});
}
for (var side = 1; side <= 1; side += 2) for (var i = 0; i < 7; i++) {
var g = new THREE.Group(); g.position.set(side * (W / 2 - 0.02), 1.7 + (rnd(i + side) - 0.5) * 0.3, -3.2 + i * 1.0); g.rotation.y = -side * Math.PI / 2; picG.add(g);
mesh(new THREE.BoxGeometry(0.46, 0.56, 0.03), black, 0, 0, 0.015, g);
mesh(new THREE.PlaneGeometry(0.38, 0.48), new THREE.MeshStandardMaterial({ map: photoTex(i * 3 + side), roughness: 0.7 }), 0, 0, 0.032, g);
}
// the door out to Frith Street, front left, with its dim exit light
var doorG = new THREE.Group(); doorG.position.set(W / 2 - 0.03, 0, -0.6); doorG.rotation.y = -Math.PI / 2; scene.add(doorG);
mesh(new THREE.BoxGeometry(0.95, 2.15, 0.06), new THREE.MeshStandardMaterial({ color: 0x1a1008, roughness: 0.5 }), 0, 1.075, 0, doorG);
mesh(new THREE.PlaneGeometry(0.5, 0.18), new THREE.MeshBasicMaterial({ color: 0x40e060, toneMapped: false }), 0, 2.32, 0.02, doorG);
var exitLight = new THREE.PointLight(0x40e060, 0.25, 2.5); exitLight.position.set(W / 2 - 0.4, 2.3, -0.6); scene.add(exitLight);
var doorHit = mesh(new THREE.BoxGeometry(1.1, 2.5, 0.5), new THREE.MeshBasicMaterial({ visible: false }), 0, 1.2, 0.15, doorG);

// ---------- THE FIGURES: the three on stage, in the light, and the room in the dark ----------
function ghostTex(seed, seated, bright) {
return tex(96, 192, function(cx, w, h) {
try { cx.filter = 'blur(2.5px)'; } catch (e) {}
var hx = 48 + (rnd(seed) - 0.5) * 8, hy = seated ? 58 : 38, hr = 14 + rnd(seed + 1) * 3;
cx.fillStyle = bright ? 'rgba(255,235,200,0.75)' : 'rgba(225,210,180,0.6)';
cx.beginPath(); cx.arc(hx, hy, hr, 0, 6.3); cx.fill();
cx.beginPath(); cx.moveTo(hx - 34, seated ? 150 : h); cx.lineTo(hx - 30, hy + hr + 6); cx.quadraticCurveTo(hx, hy + hr - 6, hx + 30, hy + hr + 6); cx.lineTo(hx + 34, seated ? 150 : h); cx.closePath(); cx.fill();
try { cx.filter = 'none'; } catch (e) {}
var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.25, 'rgba(0,0,0,0.15)'); g.addColorStop(0.65, 'rgba(0,0,0,0.6)'); g.addColorStop(1, 'rgba(0,0,0,1)');
cx.globalCompositeOperation = 'destination-out'; cx.fillStyle = g; cx.fillRect(0, 0, w, h);
});
}
var ghosts = [];
function ghost(x, y, z, seed, base, seated, bright) {
var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ghostTex(seed, seated, bright), transparent: true, opacity: base, depthWrite: false, blending: THREE.AdditiveBlending }));
sp.scale.set(0.9, 1.8, 1); sp.position.set(x, y + 0.9, z); scene.add(sp);
var hit = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, seated ? 1.1 : 1.5, 8), new THREE.MeshBasicMaterial({ visible: false }));
hit.position.set(x, y + (seated ? 0.7 : 0.95), z); scene.add(hit);
var g = { sp: sp, hit: hit, base: base, ph: seed * 2.1 }; ghosts.push(g); return g;
}
var SZ = -D / 2 + 1.5;
var moe = ghost(0.3, 0.42, SZ + 0.5, 0, 0.55, false, true);       // Moe, at the mic, the saxophone a line of brass
var sax = mesh(new THREE.CylinderGeometry(0.03, 0.06, 0.7, 10), new THREE.MeshStandardMaterial({ color: 0xd8a040, roughness: 0.3, metalness: 0.9 }), 0.42, 0.42 + 1.0, SZ + 0.62); sax.rotation.z = 0.35; sax.rotation.x = 0.3;
var pianist = ghost(-1.3, 0.42, SZ + 0.55, 2, 0.4, true, true);   // the pianist, at the keys
var guitarist = ghost(1.4, 0.42, SZ + 0.2, 4, 0.4, true, true);   // the guitarist, on his stool
var listener = ghost(2.6, 0, 0.3, 6, 0.16, true, false);          // someone at a side table
var behind = ghost(0.6, 0.18, 3.2, 8, 0.12, true, false);         // someone at the table behind you, who will not look

// ---------- LIGHT ----------
scene.add(new THREE.AmbientLight(0x3a1c20, 0.95));
scene.add(new THREE.HemisphereLight(0x6a3838, 0x100608, 0.45));
var moteN = 260, motePos = new Float32Array(moteN * 3);
for (var i = 0; i < moteN; i++) { motePos[i * 3] = (rnd(i) - 0.5) * 3; motePos[i * 3 + 1] = 0.5 + rnd(i + 1) * (H - 0.7); motePos[i * 3 + 2] = -D / 2 + 0.5 + rnd(i + 2) * 3.5; }
var moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
var motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({ color: 0xffe0c0, size: 0.02, transparent: true, opacity: 0.25, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(motes);

// ---------- THE CLOSE-UPS, AND THE PATHS ----------
var PINK = 'color:#ff3aa8;text-shadow:0 0 4px rgba(255,58,168,0.45);';
function passageLinks(sel) {
var pass = riHost.closest('tw-passage') || document.querySelector('tw-passage');
if (!pass) return [];
return Array.prototype.slice.call(pass.querySelectorAll(sel)).filter(function(l) { return !riWrap.contains(l); });
}
function byText(texts) { return passageLinks('tw-link').filter(function(l) { return texts.indexOf(l.textContent.trim()) >= 0; }); }
var HOTSPOTS = [
{ root: stageG, name: 'the stage', pos: [0.2, 1.4, -0.6], tgt: [0.1, 1.1, SZ], haloAt: [0.1, 1.2, SZ + 0.3], haloSc: 2.2,
line: 'Three of them in the light and the light is all there is: the horn, the heron at the piano, the boy with the guitar; and the tune going round the head again. [Sam: the stage]' },
{ root: barG, name: 'the bar', pos: [-1.0, 1.5, 2.0], tgt: [barX, 1.2, 0.4], haloAt: [barX, 1.2, 0.6], haloSc: 1.6,
actions: function() { return passageLinks('#bar-start-btn'); },
line: 'The bar at the back, where the light from the stage does not reach and the barman keeps his own counsel. Nobody is asking you for a round. [Sam: the bar when there is no round to get]' },
{ root: doorHit, name: 'the door', pos: [1.2, 1.4, 0.8], tgt: [W / 2, 1.2, -0.6], haloAt: [W / 2 - 0.1, 1.2, -0.6], haloSc: 1.3,
actions: function() { return byText(['Back to the street']); },
line: 'The door to Frith Street, its green light the only cold thing in the room. Not yet. [Sam: the door before the set is over]' },
{ root: phoneHit, name: 'the telephone', pos: [-1.3, 1.5, 0.7], tgt: [barX, 1.25, barZ0 + 0.25], haloSc: 0.5,
actions: function() { return passageLinks('.phone-ringing tw-link'); },
prose: function() { var d = passageLinks('.phone-ringing')[0]; if (!d) return ''; var c = d.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('tw-link'), function(l) { l.parentNode.removeChild(l); }); return c.textContent.replace(/\s+/g, ' ').trim(); },
line: 'The telephone at the end of the bar, with a cloth over it during the set. It has your name somewhere in it. [Sam: the phone when it is quiet]' },
{ root: picG, name: 'the photographs', pos: [2.0, 1.6, 0.2], tgt: [W / 2, 1.7, -1.5], haloAt: [W / 2 - 0.1, 1.7, -1.5], haloSc: 1.6,
line: 'The wall of them, every one lit from the side and grinning or not, everyone who has stood in that light and gone home. [Sam: the photographs]' },
{ root: nearTable, name: 'the empty table', pos: [-0.9, 1.3, 1.2], tgt: [-1.7, 0.9, -0.2], haloAt: [-1.7, 1.0, -0.2], haloSc: 1.0,
line: 'A red lamp, a glass with a lipstick mark, a chair pushed back a little; whoever sat there is sitting there still, and will not look. [Sam: the empty table]' }
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
riWrap.appendChild(card);
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
b.addEventListener('click', function(ev) { ev.stopPropagation(); if (!link.isConnected) { stepBack(); return; } link.click(); stepBack(); if (link.tagName !== 'TW-LINK') setTimeout(function() { try { var ar = document.getElementById('bar-arena') || link; ar.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) {} }, 250); });
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
camK = riStill ? 1 : 0; camNext = next; camMode = 'tween';
}
function stepBack() {
activeSpot = null; card.style.opacity = '0'; card.style.pointerEvents = 'none';
beginTween([CAM.x, CAM.y, CAM.z], [CAM.tx, CAM.ty, CAM.tz], 'idle');
}
var ray = new THREE.Raycaster(), mouseN = new THREE.Vector2();
function pick(ev) {
var r = riCanvas.getBoundingClientRect();
mouseN.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
ray.setFromCamera(mouseN, camera);
var hits = ray.intersectObjects(hotspotRoots, true);
for (var i = 0; i < hits.length; i++) { var sp = hotspotFor(hits[i].object); if (available(sp)) return sp; }
return null;
}
riCanvas.addEventListener('pointermove', function(ev) {
if (camMode !== 'idle' || ev.pointerType === 'touch') { hoverSpot = null; halo.visible = false; return; }
var spot = pick(ev); hoverSpot = spot;
if (spot) { haloAt(spot); halo.visible = true; riCanvas.style.cursor = 'pointer'; }
else { halo.visible = false; riCanvas.style.cursor = 'default'; }
});
riCanvas.addEventListener('pointerdown', function(ev) {
if (camMode === 'tween') return;
if (camMode === 'inspect') { stepBack(); return; }
var spot = ev.pointerType === 'touch' ? pick(ev) : (hoverSpot || pick(ev));
if (!spot) return;
activeSpot = spot; halo.visible = false; riCanvas.style.cursor = 'default';
showCard(spot);
beginTween(spot.pos, spot.tgt, 'inspect');
});
card.addEventListener('pointerdown', function(ev) { if (camMode === 'inspect' && !ev.target.classList.contains('fi-action')) stepBack(); });
var riHint = document.createElement('div');
riHint.textContent = 'LOOK CLOSER AT WHAT CATCHES YOUR EYE';
riHint.style.cssText = 'position:absolute;top:22px;left:50%;transform:translateX(-50%);font:11px \'Courier New\',monospace;color:rgba(190,200,150,0.3);letter-spacing:3px;z-index:9003;pointer-events:none;opacity:0;transition:opacity 2s ease;text-align:center;max-width:90%;white-space:normal;';
riWrap.appendChild(riHint);
setTimeout(function() { riHint.style.opacity = '1'; }, 2600);
setTimeout(function() { riHint.style.opacity = '0'; }, 9000);

// ---------- FRAMES ----------
var clock = new THREE.Clock();
window._dssThreeRegistry['ri-wrap'].camera = camera;
function riAnimate() {
riAnimId = requestAnimationFrame(riAnimate);
var dt = Math.min(0.1, clock.getDelta());
var t = riStill ? 0 : clock.getElapsedTime();
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
if (riWrap.dataset.cam !== camMode) riWrap.dataset.cam = camMode;
if (!riStill) {
for (var gi = 0; gi < ghosts.length; gi++) { var g = ghosts[gi]; g.sp.material.opacity = g.base * (0.7 + 0.3 * Math.sin(t * 0.23 + g.ph)); }
spot.intensity = 3.2 + 0.12 * Math.sin(t * 0.5); cone.material.opacity = 0.5 + 0.05 * Math.sin(t * 0.37);
for (var li = 0; li < lampLights.length; li++) lampLights[li].intensity = 0.9 + 0.08 * Math.sin(t * (1.3 + li * 0.21) + li * 2);
var mp = moteGeo.attributes.position.array;
for (var i = 0; i < moteN; i++) { mp[i * 3 + 1] += dt * 0.012 * (0.5 + rnd(i)); mp[i * 3] += Math.sin(t * 0.3 + i) * dt * 0.01; if (mp[i * 3 + 1] > H - 0.2) mp[i * 3 + 1] = 0.6; }
moteGeo.attributes.position.needsUpdate = true;
}
renderer.render(scene, camera);
}
if (riStill) { camera.lookAt(curTarget); riWrap.dataset.cam = 'idle'; }
riAnimate();
}

setInterval(function() {
var container = document.getElementById('ri-container');
if (container && !riActive) {
initRonniesInside();
} else if (!container) {
riActive = false;
if (riAnimId) { cancelAnimationFrame(riAnimId); riAnimId = null; }
window._dssDisposeWrap('ri-wrap');
}
}, 300);
})();

