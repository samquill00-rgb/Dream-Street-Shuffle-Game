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
renderer.toneMappingExposure = 0.66;
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
// The outside scenes' bloom and grade, at the room's own size.
var composer = window.dssMakeComposer ? window.dssMakeComposer(scene, camera, renderer, { bloomStrength: 0.38, bloomRadius: 0.6, bloomThreshold: 0.7 }) : null;
if (composer) { composer.setSize(riSz.w, riSz.h); var riResize = window._dssThreeRegistry['ri-wrap'].resize; window._dssThreeRegistry['ri-wrap'].resize = function() { riResize(); composer.setSize(riSz.w, riSz.h); }; window.removeEventListener('resize', riResize); window.addEventListener('resize', window._dssThreeRegistry['ri-wrap'].resize); }

function tex(w, h, fn) {
var c = document.createElement('canvas'); c.width = w; c.height = h;
var cx = c.getContext('2d'); fn(cx, w, h);
var t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearMipmapLinearFilter;
t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
return t;
}
function rnd(seed) { var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function mesh(geo, mat, x, y, z, parent) { var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || scene).add(m); return m; }

// ---------- TEXTURES AND MATERIALS: the same grain, soot and varnish as the French ----------
function woodTex(base, grain, seed) {
return tex(512, 512, function(cx, w, h) {
cx.fillStyle = base; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 420; i++) {
var y = rnd(seed + i * 7) * h, bend = 2 + rnd(i + seed * 5) * 11;
cx.strokeStyle = i % 5 ? grain : '#a8743f'; cx.globalAlpha = 0.035 + rnd(i + seed) * 0.1;
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
cx.strokeStyle = 'rgba(216,165,103,0.13)'; cx.lineWidth = 0.6;
for (var n = 0; n < 65; n++) { var xx = rnd(n * 9 + seed) * w, yy = rnd(n * 17) * h; cx.beginPath(); cx.moveTo(xx, yy); cx.lineTo(xx + 3 + rnd(n) * 48, yy + 0.3); cx.stroke(); }
});
}
function paintTex(base, seed, warm) {
return tex(512, 512, function(cx, w, h) {
cx.fillStyle = base; cx.fillRect(0, 0, w, h);
for (var n = 0; n < 28; n++) {
var x = rnd(n + seed) * w, y = rnd(n * 3 + seed) * h, r = 30 + rnd(n * 7) * 130;
var g = cx.createRadialGradient(x, y, 0, x, y, r);
g.addColorStop(0, n % 3 ? 'rgba(20,12,4,0.15)' : (warm || 'rgba(150,110,50,0.1)')); g.addColorStop(1, 'rgba(60,32,8,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
}
var soot = cx.createLinearGradient(0, 0, 0, h); soot.addColorStop(0, 'rgba(18,10,4,0.3)'); soot.addColorStop(0.3, 'rgba(38,20,6,0)'); soot.addColorStop(1, 'rgba(18,10,4,0.14)'); cx.fillStyle = soot; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 9000; i++) { cx.fillStyle = i % 2 ? 'rgba(20,12,4,0.05)' : 'rgba(200,180,140,0.04)'; cx.fillRect(rnd(i + seed) * w, rnd(i * 3 + seed) * h, 1, 1); }
});
}
// A small canvas-made room environment, darker and more copper than the French's: it is what the metal and the varnish reflect.
var envFaces = [];
for (var ef = 0; ef < 6; ef++) {
var ec = document.createElement('canvas'); ec.width = ec.height = 128;
var ex = ec.getContext('2d'), eg = ex.createLinearGradient(0, 0, 0, 128);
eg.addColorStop(0, ef === 2 ? '#5a4028' : '#3e2e1e'); eg.addColorStop(0.5, '#241a10'); eg.addColorStop(1, '#0a0705'); ex.fillStyle = eg; ex.fillRect(0, 0, 128, 128);
if (ef !== 3) {
for (var el = 0; el < 2; el++) {
var lx = 28 + el * 73, ly = ef === 2 ? 64 : 30;
var gl = ex.createRadialGradient(lx, ly, 0, lx, ly, 20); gl.addColorStop(0, '#ffe6b8'); gl.addColorStop(0.14, '#d9b070'); gl.addColorStop(0.4, '#8a5f2c'); gl.addColorStop(1, 'rgba(96,63,25,0)'); ex.fillStyle = gl; ex.fillRect(0, 0, 128, 128);
} ex.fillStyle = 'rgba(190,120,70,0.14)'; ex.fillRect(4, 84, 120, 10);
} envFaces.push(ec);
}
var roomEnv = new THREE.CubeTexture(envFaces); roomEnv.needsUpdate = true;
var grainA = woodTex('#3d2416', '#150905', 1), grainB = woodTex('#2a1810', '#0e0704', 2), grainC = woodTex('#4a2c1a', '#1a0c06', 3);
var oak = new THREE.MeshStandardMaterial({ map: grainA, bumpMap: grainA, bumpScale: 0.003, roughnessMap: grainA, roughness: 0.62, envMap: roomEnv, envMapIntensity: 0.4, metalness: 0.04 });
var darkWood = new THREE.MeshStandardMaterial({ map: grainB, bumpMap: grainB, bumpScale: 0.006, roughness: 0.58, envMap: roomEnv, envMapIntensity: 0.22 });
var shelfWood = new THREE.MeshStandardMaterial({ map: grainC, bumpMap: grainC, bumpScale: 0.002, roughnessMap: grainC, roughness: 0.5, envMap: roomEnv, envMapIntensity: 0.5, metalness: 0.06 });
var brass = new THREE.MeshStandardMaterial({ color: 0xb99a60, roughness: 0.3, metalness: 0.82, envMap: roomEnv, envMapIntensity: 0.72 });

// ---------- A PLANAR REFLECTION, drawn only when the view changes ----------
// The French's mirror, made general so the flood on the boards can hold the room upside down as well.
function makeMirror(m, normal, size, tint, extra) {
var target = new THREE.WebGLRenderTarget(size, size, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
var mcam = camera.clone(), mat4 = new THREE.Matrix4(), n = normal.clone().normalize();
m.material = new THREE.ShaderMaterial({
uniforms: { reflection: { value: target.texture }, reflectionMatrix: { value: mat4 }, time: { value: 0 }, tint: { value: tint } },
transparent: !!extra.transparent, depthWrite: !extra.transparent,
vertexShader: 'uniform mat4 reflectionMatrix; varying vec4 reflected; varying vec2 faceUV; void main(){ faceUV=uv; vec4 wp=modelMatrix*vec4(position,1.0); reflected=reflectionMatrix*wp; gl_Position=projectionMatrix*viewMatrix*wp; }',
fragmentShader: 'uniform sampler2D reflection; uniform float time; uniform vec3 tint; varying vec4 reflected; varying vec2 faceUV; void main(){ vec4 r=reflected; ' + (extra.ripple ? 'r.xy+=vec2(sin(faceUV.y*38.0+time*1.1)*0.004+sin(faceUV.x*23.0-time*0.7)*0.003, cos(faceUV.x*31.0+time*0.9)*0.004)*r.w;' : '') + ' vec3 c=texture2DProj(reflection,r).rgb; float edge=smoothstep(0.0,' + (extra.edge || '0.07') + ',min(min(faceUV.x,1.0-faceUV.x),min(faceUV.y,1.0-faceUV.y))); float stain=0.5+0.5*sin(faceUV.x*193.0+sin(faceUV.y*117.0)*3.0); ' + (extra.transparent ? 'c=c*tint; float a=edge*(0.62+0.1*stain); gl_FragColor=vec4(c,a);' : 'c=mix(vec3(0.05,0.033,0.019),c*tint,0.65+0.35*edge); c*=1.0-(1.0-edge)*stain*0.3; gl_FragColor=vec4(c,1.0);') + '\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'
});
m.geometry.addEventListener('dispose', function() { target.dispose(); });
var lastAspect = 0, lastP = new THREE.Vector3(999, 999, 999), lastT = new THREE.Vector3(999, 999, 999), p0 = new THREE.Vector3();
function reflect(v) { var d = v.clone().sub(p0).dot(n); return v.clone().sub(n.clone().multiplyScalar(2 * d)); }
return { mesh: m, update: function(tgt, t) {
m.material.uniforms.time.value = t;
if (lastAspect === camera.aspect && lastP.distanceToSquared(camera.position) < 0.0025 && lastT.distanceToSquared(tgt) < 0.0025) return;
lastAspect = camera.aspect; lastP.copy(camera.position); lastT.copy(tgt);
m.getWorldPosition(p0);
mcam.copy(camera); mcam.position.copy(reflect(camera.position)); mcam.up.copy(reflect(camera.position.clone().add(new THREE.Vector3(0, 1, 0))).sub(mcam.position));
mcam.lookAt(reflect(tgt)); mcam.updateMatrixWorld();
var clip = new THREE.Plane(n.clone(), -p0.dot(n)).applyMatrix4(mcam.matrixWorldInverse);
var cp = new THREE.Vector4(clip.normal.x, clip.normal.y, clip.normal.z, clip.constant);
var pm = mcam.projectionMatrix.elements, cq = new THREE.Vector4((Math.sign(cp.x) + pm[8]) / pm[0], (Math.sign(cp.y) + pm[9]) / pm[5], -1, (1 + pm[10]) / pm[14]);
cp.multiplyScalar(2 / cp.dot(cq)); pm[2] = cp.x; pm[6] = cp.y; pm[10] = cp.z + 1; pm[14] = cp.w;
mat4.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1).multiply(mcam.projectionMatrix).multiply(mcam.matrixWorldInverse);
var oldTarget = renderer.getRenderTarget(), oldTone = renderer.toneMapping;
mirrors.forEach(function(o) { o.mesh.visible = false; }); var haloWas = typeof halo !== 'undefined' && halo.visible; if (haloWas) halo.visible = false;
renderer.toneMapping = THREE.NoToneMapping; renderer.setRenderTarget(target); renderer.render(scene, mcam);
renderer.setRenderTarget(oldTarget); renderer.toneMapping = oldTone; mirrors.forEach(function(o) { o.mesh.visible = true; }); if (haloWas) halo.visible = true;
} };
}
var mirrors = [];

// ---------- THE ROOM: a dark U around the stage, tiers of small tables, red lamps ----------
// From what is written of Ronnie Scott's at 47 Frith Street: a dark room with velvet chairs, small tables, red table lamps,
// sloping layers of tables in a U around the stage, photographs of the players on the walls, the bar at the back.
var W = 7.0, D = 9.0, H = 3.2;
var wallGrain = paintTex('#241614', 17, 'rgba(120,40,40,0.14)');
var wallMat = new THREE.MeshStandardMaterial({ map: wallGrain, bumpMap: wallGrain, bumpScale: 0.01, roughness: 0.92 });
// the walls are lined to shoulder height with pleated red cloth, the way the club was
var pleatTex = tex(512, 256, function(cx, w, h) {
for (var x = 0; x < w; x += 16) { var g = cx.createLinearGradient(x, 0, x + 16, 0); g.addColorStop(0, '#2a0a0e'); g.addColorStop(0.45, '#6a1820'); g.addColorStop(0.6, '#7a2028'); g.addColorStop(1, '#240a0c'); cx.fillStyle = g; cx.fillRect(x, 0, 16, h); }
for (var i = 0; i < 6000; i++) { cx.fillStyle = i % 2 ? 'rgba(0,0,0,0.12)' : 'rgba(255,200,200,0.04)'; cx.fillRect(rnd(i) * w, rnd(i + 3) * h, 1, 2); }
var vg = cx.createLinearGradient(0, 0, 0, h); vg.addColorStop(0, 'rgba(0,0,0,0.35)'); vg.addColorStop(0.5, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.4)'); cx.fillStyle = vg; cx.fillRect(0, 0, w, h);
});
pleatTex.wrapS = pleatTex.wrapT = THREE.RepeatWrapping;
var pleatMat = new THREE.MeshStandardMaterial({ map: pleatTex, bumpMap: pleatTex, bumpScale: 0.02, roughness: 0.95 });
var carpetPile = tex(512, 512, function(cx, w, h) {
cx.fillStyle = '#2a1014'; cx.fillRect(0, 0, w, h);
for (var n = 0; n < 18; n++) { var x = rnd(n) * w, y = rnd(n + 9) * h, g = cx.createRadialGradient(x, y, 0, x, y, 75); g.addColorStop(0, n % 2 ? 'rgba(120,50,50,0.14)' : 'rgba(0,0,0,0.3)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); }
for (var i = 0; i < 42000; i++) { cx.fillStyle = i % 3 ? 'rgba(10,4,4,0.24)' : 'rgba(140,60,60,0.18)'; cx.fillRect(rnd(i) * w, rnd(i + 4) * h, 0.6, 1.5 + rnd(i + 7) * 2); }
});
carpetPile.wrapS = carpetPile.wrapT = THREE.RepeatWrapping; carpetPile.repeat.set(4, 5);
var floor = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: carpetPile, bumpMap: carpetPile, bumpScale: 0.018, roughness: 1 }), 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceil = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: paintTex('#0e0a08', 25), roughness: 1 }), 0, H, 0); ceil.rotation.x = Math.PI / 2;
var back = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2); back.receiveShadow = true;
var front = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, D / 2); front.rotation.y = Math.PI;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2;
var right = mesh(new THREE.PlaneGeometry(D, H), wallMat, W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2; right.receiveShadow = true;
[[D, W / 2 - 0.01, 0, -Math.PI / 2], [W, 0, D / 2 - 0.01, Math.PI], [D / 2 - 0.5, -W / 2 + 0.01, -D / 4 - 0.25, Math.PI / 2]].forEach(function(p) { var pl = mesh(new THREE.PlaneGeometry(p[0], 1.3), pleatMat, p[1], 0.65, p[2]); pl.rotation.y = p[3]; pl.material = pleatMat.clone(); pl.material.map = pleatTex.clone(); pl.material.map.needsUpdate = true; pl.material.map.repeat.set(p[0] / 1.2, 1); });
var woodMat = darkWood;
var velvet = new THREE.MeshStandardMaterial({ map: pleatTex, color: 0xa04048, roughness: 0.9, bumpMap: pleatTex, bumpScale: 0.004 });
var velvetPlain = new THREE.MeshStandardMaterial({ color: 0x6a1418, roughness: 0.92 });
var black = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.15, metalness: 0.2, envMap: roomEnv, envMapIntensity: 0.8 });
var chrome = new THREE.MeshStandardMaterial({ color: 0xc8c8c8, roughness: 0.22, metalness: 0.95, envMap: roomEnv, envMapIntensity: 1.0 });
// a lighting bar across the ceiling with its cans, most of them off
var rig = mesh(new THREE.CylinderGeometry(0.025, 0.025, 5.2, 8), black, 0, H - 0.3, -D / 2 + 3.4); rig.rotation.z = Math.PI / 2;
for (var cn = 0; cn < 5; cn++) { var can = mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.24, 12, 1, true), black, -2.0 + cn * 1.0, H - 0.5, -D / 2 + 3.4); can.rotation.x = 0.9; can.material = black.clone(); can.material.side = THREE.DoubleSide; }

// ---------- THE STAGE, at the far end, under its light ----------
var stageG = new THREE.Group(); stageG.position.set(0, 0, -D / 2 + 1.5); scene.add(stageG);
var stage = mesh(new THREE.BoxGeometry(4.4, 0.42, 2.6), new THREE.MeshStandardMaterial({ map: grainB, bumpMap: grainB, bumpScale: 0.003, roughness: 0.5, envMap: roomEnv, envMapIntensity: 0.3 }), 0, 0.21, 0, stageG); stage.castShadow = true; stage.receiveShadow = true;
mesh(new THREE.BoxGeometry(4.5, 0.06, 2.7), oak, 0, 0.42, 0, stageG);
mesh(new THREE.PlaneGeometry(4.6, 0.42), pleatMat, 0, 0.21, 1.31, stageG);
// the curtain behind: folds of red velvet hung from a rail
var curtMat = new THREE.MeshStandardMaterial({ color: 0x5a0e14, roughness: 0.95 }), curtLit = new THREE.MeshStandardMaterial({ color: 0x8a1a22, roughness: 0.95 });
for (var f = 0; f < 22; f++) { var fold = mesh(new THREE.CylinderGeometry(0.11, 0.13, 3.0, 10, 1, false, 0, Math.PI), f % 2 ? curtMat : curtLit, -2.2 + f * 0.21, 1.5 + 0.42, -1.2, stageG); fold.receiveShadow = true; }
mesh(new THREE.BoxGeometry(4.7, 0.06, 0.2), black, 0, H - 0.08, -1.2, stageG);
mesh(new THREE.PlaneGeometry(4.6, 3.2), new THREE.MeshStandardMaterial({ color: 0x1a0406, roughness: 1 }), 0, 1.6, -1.29, stageG);
// the grand piano, lid up, stage left: a curved body, the lid on its prop, the keys
var pianoG = new THREE.Group(); pianoG.position.set(-1.3, 0.42, -0.2); pianoG.rotation.y = 0.5; stageG.add(pianoG);
var pianoShape = new THREE.Shape(); pianoShape.moveTo(-0.75, 0.7); pianoShape.lineTo(0.75, 0.7); pianoShape.lineTo(0.75, 0.1); pianoShape.bezierCurveTo(0.75, -0.5, 0.3, -0.72, -0.1, -0.7); pianoShape.bezierCurveTo(-0.5, -0.68, -0.75, -0.3, -0.75, 0.1); pianoShape.lineTo(-0.75, 0.7);
var pbody = new THREE.Mesh(new THREE.ExtrudeGeometry(pianoShape, { depth: 0.3, bevelEnabled: false }), black); pbody.rotation.x = Math.PI / 2; pbody.position.set(0, 1.07, 0); pbody.castShadow = true; pianoG.add(pbody);
var lid = new THREE.Mesh(new THREE.ExtrudeGeometry(pianoShape, { depth: 0.03, bevelEnabled: false }), black); lid.rotation.x = Math.PI / 2; lid.position.set(0, 1.1, 0); lid.rotation.z = 0; pianoG.add(lid);
lid.rotation.order = 'ZXY'; lid.rotation.z = 0.0; lid.rotation.x = Math.PI / 2 + 0.7; lid.position.set(0, 1.1, 0.7);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.8, 6), black, 0.6, 1.4, -0.1, pianoG).rotation.z = 0.6;
var keybed = mesh(new THREE.BoxGeometry(1.2, 0.08, 0.3), black, 0, 1.04, 0.78, pianoG);
for (var k = 0; k < 40; k++) mesh(new THREE.BoxGeometry(0.026, 0.02, 0.14), new THREE.MeshStandardMaterial({ color: 0xe8e0c8, roughness: 0.35 }), -0.55 + k * 0.028, 1.09, 0.82, pianoG);
for (var k = 0; k < 40; k++) if (k % 7 !== 2 && k % 7 !== 5 && k < 39) mesh(new THREE.BoxGeometry(0.016, 0.014, 0.08), black, -0.536 + k * 0.028, 1.105, 0.79, pianoG);
[[-0.65, -0.45], [0.65, -0.45], [0, 0.6]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.78, 10), black, l[0], 0.39, l[1], pianoG); mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 12), brass, l[0], 0.02, l[1], pianoG); });
mesh(new THREE.BoxGeometry(0.5, 0.05, 0.3), velvetPlain, 0, 0.5, 1.2, pianoG); [[-0.2, 1.08], [0.2, 1.08], [-0.2, 1.32], [0.2, 1.32]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.48, 8), black, l[0], 0.24, l[1], pianoG); });
// the trio's kit: the mic on its stand, a stool, the guitarist's amp with its glowing valve, a double bass laid against the piano
mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.5, 8), chrome, 0.3, 0.42 + 0.75, 0.6, stageG);
mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.03, 12), black, 0.3, 0.44, 0.6, stageG);
var micHead = mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.12, 10), chrome, 0.3, 0.42 + 1.55, 0.6, stageG); micHead.rotation.x = 0.4;
mesh(new THREE.SphereGeometry(0.03, 10, 8), new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.6, metalness: 0.7 }), 0.3, 0.42 + 1.61, 0.63, stageG);
var amp = mesh(new THREE.BoxGeometry(0.55, 0.5, 0.3), new THREE.MeshStandardMaterial({ map: grainB, roughness: 0.8 }), 1.6, 0.42 + 0.25, -0.6, stageG);
mesh(new THREE.PlaneGeometry(0.46, 0.34), new THREE.MeshStandardMaterial({ color: 0x3a3028, roughness: 1 }), 1.6, 0.42 + 0.22, -0.44, stageG);
mesh(new THREE.SphereGeometry(0.012, 6, 6), new THREE.MeshBasicMaterial({ color: 0xff6030, toneMapped: false }), 1.82, 0.42 + 0.47, -0.44, stageG);
mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 14), velvetPlain, 1.4, 0.42 + 0.7, 0.2, stageG); mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.68, 8), chrome, 1.4, 0.42 + 0.34, 0.2, stageG);
mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 14), velvetPlain, 1.4, 0.42 + 0.7, 0.2, stageG);
// the spotlight, and its cone in the smoke
var spot = new THREE.SpotLight(0xffe0b0, 3.2, 9, 0.42, 0.55, 1.2); spot.position.set(0, H - 0.1, -D / 2 + 3.4); spot.target.position.set(0.2, 0.6, -D / 2 + 1.5); scene.add(spot); scene.add(spot.target); spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -0.001; spot.shadow.normalBias = 0.02; spot.shadow.radius = 3;
var coneTex = tex(64, 256, function(cx, w, h) { var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(255,230,190,0.26)'); g.addColorStop(1, 'rgba(255,230,190,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); var s = cx.createLinearGradient(0, 0, w, 0); s.addColorStop(0, 'rgba(0,0,0,1)'); s.addColorStop(0.3, 'rgba(0,0,0,0)'); s.addColorStop(0.7, 'rgba(0,0,0,0)'); s.addColorStop(1, 'rgba(0,0,0,1)'); cx.globalCompositeOperation = 'destination-out'; cx.fillStyle = s; cx.fillRect(0, 0, w, h); });
var cone = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 1.5, 3.0, 24, 1, true), new THREE.MeshBasicMaterial({ map: coneTex, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
cone.position.set(0.1, H - 1.5, -D / 2 + 2.4); cone.rotation.x = 0.28; scene.add(cone);
var glowTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,225,160,0.9)'); g.addColorStop(0.3, 'rgba(255,190,100,0.35)'); g.addColorStop(0.7, 'rgba(220,140,50,0.08)'); g.addColorStop(1, 'rgba(180,100,30,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function glow(x, y, z, sc, op, col, parent) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: col || 0xffffff, transparent: true, opacity: op || 0.6, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, fog: false, toneMapped: false })); sp.scale.set(sc, sc, 1); sp.position.set(x, y, z); (parent || scene).add(sp); return sp; }
var spotGlow = glow(0, H - 0.2, -D / 2 + 3.4, 0.9, 0.5);

// ---------- THE TABLES, tiers of them in a U, each with its red lamp ----------
var tables = [], lampLights = [], lampGlows = [];
var glassMat = new THREE.MeshPhysicalMaterial({ color: 0xf0eadc, roughness: 0.09, metalness: 0.04, envMap: roomEnv, envMapIntensity: 1.1, clearcoat: 1, transparent: true, opacity: 0.34 });
var whiskyMat = new THREE.MeshStandardMaterial({ color: 0xc27a18, roughness: 0.1, transparent: true, opacity: 0.7, emissive: 0x5a3000, emissiveIntensity: 0.35 });
function tumbler(x, y, z, fill, parent) {
var g = new THREE.Group(); g.position.set(x, y, z); (parent || scene).add(g);
var b = mesh(new THREE.CylinderGeometry(0.032, 0.028, 0.09, 14, 1, true), glassMat, 0, 0.045, 0, g); b.material = glassMat.clone(); b.material.side = THREE.DoubleSide;
mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.006, 14), glassMat, 0, 0.003, 0, g);
if (fill > 0) mesh(new THREE.CylinderGeometry(0.028, 0.027, 0.08 * fill, 14), whiskyMat, 0, 0.006 + 0.04 * fill, 0, g);
return g;
}
var ashMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.3, metalness: 0.2, envMap: roomEnv, envMapIntensity: 0.4 });
var shadeMat = new THREE.MeshPhysicalMaterial({ color: 0xc02020, roughness: 0.5, emissive: 0xb01414, emissiveIntensity: 1.0, side: THREE.DoubleSide, transparent: true, opacity: 0.92 });
var tableTop = new THREE.MeshStandardMaterial({ map: grainB, roughness: 0.35, envMap: roomEnv, envMapIntensity: 0.5 });
var stools = [];
function table(x, z, seed) {
var g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.03, 24), tableTop, 0, 0.72, 0, g).castShadow = true;
mesh(new THREE.TorusGeometry(0.3, 0.008, 6, 32), brass, 0, 0.735, 0, g).rotation.x = Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.7, 8), black, 0, 0.36, 0, g);
mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 16), black, 0, 0.02, 0, g);
mesh(new THREE.PlaneGeometry(0.62, 0.62), new THREE.MeshStandardMaterial({ color: 0xf0e8dc, roughness: 0.95, transparent: true, opacity: 0.5 }), 0, 0.737, 0, g).rotation.x = -Math.PI / 2;
// the red lamp: a small shade on a chrome stem, the bulb inside it, its glow
mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.14, 8), chrome, 0.1, 0.8, 0.05, g);
mesh(new THREE.ConeGeometry(0.09, 0.1, 16, 1, true), shadeMat, 0.1, 0.9, 0.05, g);
mesh(new THREE.SphereGeometry(0.018, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd0c0, toneMapped: false }), 0.1, 0.88, 0.05, g);
var l = new THREE.PointLight(0xff5030, 0.9, 2.4, 1.4); l.position.set(0.1, 0.86, 0.05); g.add(l); lampLights.push(l);
lampGlows.push(glow(0.1, 0.87, 0.05, 0.36, 0.5, 0xff6040, g));
tumbler(-0.12, 0.74, -0.06, rnd(seed) < 0.6 ? 0.4 + rnd(seed + 1) * 0.5 : 0, g); if (rnd(seed + 3) < 0.5) tumbler(-0.05, 0.74, 0.14, 0.3, g);
mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.016, 14), ashMat, 0.14, 0.745, -0.14, g);
// two velvet chairs with turned legs and a curved back
[[0, 0.42, 0], [0.45, 0, -Math.PI / 2]].forEach(function(c) { var ch = new THREE.Group(); ch.position.set(c[0], 0, c[1]); ch.rotation.y = c[2]; g.add(ch); mesh(new THREE.BoxGeometry(0.4, 0.07, 0.4), velvet, 0, 0.45, 0, ch); var bk = mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.5, 12, 1, true, Math.PI * 0.75, Math.PI * 0.5), velvet, 0, 0.75, 0.0, ch); bk.material = velvet.clone(); bk.material.side = THREE.DoubleSide; [[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].forEach(function(lg) { mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.42, 8), black, lg[0], 0.21, lg[1], ch); }); });
tables.push(g); return g;
}
var step = mesh(new THREE.BoxGeometry(W, 0.18, 3.6), new THREE.MeshStandardMaterial({ map: carpetPile, roughness: 1 }), 0, 0.09, D / 2 - 1.8); step.receiveShadow = true;
mesh(new THREE.BoxGeometry(W, 0.03, 0.06), brass, 0, 0.18, D / 2 - 3.6);
[[-1.9, -1.5], [-0.3, -1.7], [1.3, -1.6], [2.5, -1.2], [2.6, 0.3], [1.6, 1.2], [2.4, 2.8], [0.6, 3.2], [-1.2, 3.3]].forEach(function(t, i) { var tb = table(t[0], t[1], i); if (t[1] > 2.5) tb.position.y = 0.18; });
var nearTable = table(-1.7, -0.2, 20);   // the empty table at the side, in the half dark
// the lipstick mark on the glass at the empty table is a line's worth of red
mesh(new THREE.PlaneGeometry(0.02, 0.012), new THREE.MeshBasicMaterial({ color: 0xc02040 }), -0.12, 0.83, -0.03, nearTable);

// ---------- THE BAR, along the back wall behind the tables ----------
var barG = new THREE.Group(); scene.add(barG);
var barX = -W / 2 + 0.75, barZ0 = -0.6, barZ1 = 2.6, barLen = barZ1 - barZ0, barZ = (barZ0 + barZ1) / 2, barX0 = barX;
var body = mesh(new THREE.BoxGeometry(0.55, 1.08, barLen), new THREE.MeshStandardMaterial({ map: pleatTex, roughness: 0.95, bumpMap: pleatTex, bumpScale: 0.015 }), barX, 0.54, barZ, barG); body.castShadow = true; body.material.map = pleatTex.clone(); body.material.map.needsUpdate = true; body.material.map.repeat.set(3, 1);
mesh(new THREE.BoxGeometry(0.66, 0.05, barLen + 0.08), black, barX, 1.1, barZ, barG);
mesh(new THREE.BoxGeometry(0.03, 0.05, barLen + 0.08), brass, barX + 0.335, 1.1, barZ, barG);
var rail = mesh(new THREE.CylinderGeometry(0.018, 0.018, barLen, 10), brass, barX + 0.36, 0.2, barZ, barG); rail.rotation.x = Math.PI / 2;
mesh(new THREE.BoxGeometry(0.42, 1.2, barLen), darkWood, -W / 2 + 0.21, 0.6, barZ, barG); mesh(new THREE.BoxGeometry(0.46, 0.04, barLen), black, -W / 2 + 0.23, 1.22, barZ, barG);
var mir = mesh(new THREE.PlaneGeometry(barLen - 0.2, 1.0), null, -W / 2 + 0.03, 2.0, barZ); mir.rotation.y = Math.PI / 2;
mirrors.push(makeMirror(mir, new THREE.Vector3(1, 0, 0), portrait ? 512 : 1024, new THREE.Vector3(0.62, 0.58, 0.58), { edge: '0.1' }));
mesh(new THREE.BoxGeometry(0.06, 1.14, barLen - 0.08), oak, -W / 2 + 0.015, 2.0, barZ, barG);
var botCols = [0x2a5a2a, 0x7a4a18, 0x1a2a5a, 0x8a7a20, 0x4a1a1a, 0x2a4a3a, 0xa08030, 0x3a2a1a, 0x6a3a10];
function bottle(x, y, z, col, h, r, parent) {
var g = new THREE.Group(); g.position.set(x, y, z);
var bm = new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.17, metalness: 0.04, envMap: roomEnv, envMapIntensity: 0.8, clearcoat: 0.85, clearcoatRoughness: 0.12, transparent: true, opacity: 0.88 });
mesh(new THREE.CylinderGeometry(r, r, h, 10), bm, 0, h / 2, 0, g);
mesh(new THREE.CylinderGeometry(r * 0.35, r * 0.6, h * 0.35, 8), bm, 0, h + h * 0.16, 0, g);
mesh(new THREE.CylinderGeometry(r * 0.36, r * 0.36, 0.03, 8), rnd(x * 7 + z) < 0.5 ? brass : ashMat, 0, h + h * 0.34, 0, g);
if (rnd(z * 3 + x) < 0.7) mesh(new THREE.PlaneGeometry(r * 1.6, h * 0.42), new THREE.MeshStandardMaterial({ color: [0xe8dcc0, 0xc8b890, 0x1a1a1a][(rnd(x + z * 5) * 3) | 0], roughness: 0.9 }), r + 0.002, h * 0.45, 0, g).rotation.y = Math.PI / 2;
(parent || scene).add(g); return g;
}
[1.55, 1.95, 2.35].forEach(function(sy, si) {
mesh(new THREE.BoxGeometry([0.26, 0.22, 0.18][si], 0.03, barLen - 0.2), black, -W / 2 + [0.13, 0.11, 0.09][si], sy, barZ, barG);
var n = 12;
for (var i = 0; i < n; i++) { if (rnd(si * 40 + i) < 0.15) continue; bottle(-W / 2 + [0.14, 0.12, 0.1][si] + (rnd(i + si) - 0.5) * 0.04, sy + 0.015, barZ0 + 0.2 + i * ((barLen - 0.4) / n) + (rnd(i * 3 + si) - 0.5) * 0.05, botCols[(i + si * 4) % botCols.length], 0.2 + rnd(i + si * 30) * 0.12, 0.028 + rnd(i * 2 + si) * 0.01, barG); }
});
for (var o = 0; o < 5; o++) bottle(-W / 2 + 0.11, 1.92, barZ0 + 0.4 + o * 0.55, botCols[(o * 5) % botCols.length], 0.2, 0.028, barG).rotation.x = Math.PI;
// the club's name in red script over the bar, lit
var signTex = tex(1024, 192, function(cx, w, h) { cx.clearRect(0, 0, w, h); cx.font = 'italic bold 96px Georgia,serif'; cx.textAlign = 'center'; cx.shadowColor = 'rgba(255,60,60,0.9)'; cx.shadowBlur = 24; cx.fillStyle = '#ff5a5a'; cx.fillText("Ronnie Scott's", w / 2, 118); cx.shadowBlur = 0; cx.font = '26px Georgia,serif'; cx.fillStyle = 'rgba(255,200,180,0.8)'; cx.fillText('FRITH STREET · SINCE 1959', w / 2, 168); });
var sign = mesh(new THREE.PlaneGeometry(2.4, 0.45), new THREE.MeshBasicMaterial({ map: signTex, transparent: true, toneMapped: false, depthWrite: false }), -W / 2 + 0.05, 2.78, barZ); sign.rotation.y = Math.PI / 2;
var signLight = new THREE.PointLight(0xff4040, 0.6, 3.5, 1.6); signLight.position.set(-W / 2 + 0.5, 2.7, barZ); scene.add(signLight);
var signGlow = glow(-W / 2 + 0.12, 2.78, barZ, 2.2, 0.35, 0xff5050);
var barLamp = new THREE.PointLight(0xffc890, 0.9, 3.8, 1.6); barLamp.position.set(-W / 2 + 0.5, 2.4, 0.9); scene.add(barLamp);
mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.5, 6), black, -W / 2 + 0.5, 2.7, 0.9); mesh(new THREE.ConeGeometry(0.12, 0.1, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6, side: THREE.DoubleSide }), -W / 2 + 0.5, 2.46, 0.9);
mesh(new THREE.SphereGeometry(0.04, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffe0b0, toneMapped: false }), -W / 2 + 0.5, 2.4, 0.9); var barGlow = glow(-W / 2 + 0.5, 2.38, 0.9, 0.8, 0.5);
// what the barman keeps in reach: a syphon, a cloth, glasses, a bowl of lemons, the night's takings
mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.24, 14), new THREE.MeshPhysicalMaterial({ color: 0x8ab0c0, roughness: 0.1, transparent: true, opacity: 0.6, envMap: roomEnv, envMapIntensity: 1, clearcoat: 1 }), barX - 0.1, 1.24, barZ1 - 0.5, barG);
mesh(new THREE.BoxGeometry(0.2, 0.012, 0.26), new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.95 }), barX + 0.05, 1.13, 1.6, barG);
tumbler(barX + 0.1, 1.125, 0.2, 0.5, barG); tumbler(barX - 0.05, 1.125, 0.9, 0, barG); tumbler(barX + 0.12, 1.125, 1.2, 0.7, barG);
mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.05, 16), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.5 }), barX - 0.12, 1.15, 0.5, barG); for (var lm = 0; lm < 4; lm++) mesh(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshStandardMaterial({ color: 0xe8d030, roughness: 0.7 }), barX - 0.12 + (rnd(lm) - 0.5) * 0.08, 1.19, 0.5 + (rnd(lm + 1) - 0.5) * 0.08, barG);
mesh(new THREE.BoxGeometry(0.3, 0.26, 0.34), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.5, envMap: roomEnv, envMapIntensity: 0.4 }), -W / 2 + 0.25, 1.37, barZ1 - 0.5, barG);
// the telephone at the near end of the bar, a cloth over it during the set
var phoneG = new THREE.Group(); phoneG.position.set(barX, 1.12, barZ0 + 0.25); phoneG.rotation.y = 0.3; scene.add(phoneG);
var bakelite = new THREE.MeshStandardMaterial({ color: 0x16120f, roughness: 0.26, metalness: 0.08, envMap: roomEnv, envMapIntensity: 0.55 });
mesh(new THREE.BoxGeometry(0.2, 0.09, 0.17), bakelite, 0, 0.045, 0, phoneG);
mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.02, 20), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.5 }), 0.02, 0.1, 0.03, phoneG);
var hs = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.2, 10), bakelite, 0, 0.14, -0.02, phoneG); hs.rotation.z = Math.PI / 2;
mesh(new THREE.SphereGeometry(0.032, 10, 8), bakelite, -0.1, 0.13, -0.02, phoneG); mesh(new THREE.SphereGeometry(0.032, 10, 8), bakelite, 0.1, 0.13, -0.02, phoneG);
var cloth = mesh(new THREE.BoxGeometry(0.26, 0.02, 0.22), new THREE.MeshStandardMaterial({ color: 0x6a1418, roughness: 0.98 }), 0.02, 0.17, 0.0, phoneG); cloth.rotation.z = 0.08;
var phoneHit = mesh(new THREE.BoxGeometry(0.34, 0.3, 0.3), new THREE.MeshBasicMaterial({ visible: false }), 0, 0.12, 0, phoneG);

// ---------- THE PHOTOGRAPHS on the side walls, the players who have stood there ----------
var picG = new THREE.Group(); scene.add(picG);
function photoTex(seed) {
return tex(192, 240, function(cx, w, h) {
cx.fillStyle = '#0e0e0e'; cx.fillRect(0, 0, w, h);
var lx = 30 + (rnd(seed) * 130); var g = cx.createRadialGradient(lx, 60, 4, w / 2, h * 0.45, 150); g.addColorStop(0, 'rgba(240,230,210,0.85)'); g.addColorStop(0.4, 'rgba(120,110,100,0.4)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
// the player, lit from the side: the head, the shoulders, the instrument a stroke of light
var hx = w / 2 + (rnd(seed + 1) - 0.5) * 30, hy = 80;
var face = cx.createLinearGradient(hx - 24, 0, hx + 24, 0); face.addColorStop(0, lx < w / 2 ? '#e8dcc8' : '#1a1a1a'); face.addColorStop(0.5, '#8a8078'); face.addColorStop(1, lx < w / 2 ? '#1a1a1a' : '#e8dcc8');
cx.fillStyle = face; cx.beginPath(); cx.ellipse(hx, hy, 22, 28, 0, 0, 6.3); cx.fill();
cx.fillStyle = '#111'; cx.beginPath(); cx.ellipse(hx, hy - 16, 24, 14, 0, Math.PI, 0); cx.fill();
var coat = cx.createLinearGradient(hx - 60, 0, hx + 60, 0); coat.addColorStop(0, lx < w / 2 ? '#3a3a3a' : '#050505'); coat.addColorStop(1, lx < w / 2 ? '#050505' : '#3a3a3a');
cx.fillStyle = coat; cx.beginPath(); cx.moveTo(hx - 70, h); cx.quadraticCurveTo(hx - 66, 120, hx - 26, 108); cx.lineTo(hx - 10, 100); cx.lineTo(hx + 10, 100); cx.lineTo(hx + 26, 108); cx.quadraticCurveTo(hx + 66, 120, hx + 70, h); cx.closePath(); cx.fill();
cx.fillStyle = '#e8e0d0'; cx.beginPath(); cx.moveTo(hx - 8, 104); cx.lineTo(hx, 150); cx.lineTo(hx + 8, 104); cx.closePath(); cx.fill();
var inst = seed % 4;
cx.strokeStyle = 'rgba(240,210,130,0.9)'; cx.lineWidth = 5; cx.lineCap = 'round'; cx.beginPath();
if (inst === 0) { cx.moveTo(hx + 4, 110); cx.quadraticCurveTo(hx + 40, 160, hx + 20, 210); cx.quadraticCurveTo(hx + 10, 230, hx + 40, 226); } // horn
else if (inst === 1) { cx.moveTo(hx - 50, 190); cx.lineTo(hx + 50, 186); cx.moveTo(hx - 50, 194); cx.lineTo(hx + 50, 190); } // keys
else if (inst === 2) { cx.moveTo(hx - 40, 140); cx.lineTo(hx + 30, 200); cx.strokeStyle = 'rgba(200,170,120,0.8)'; cx.beginPath(); cx.ellipse(hx + 26, 200, 26, 20, 0.4, 0, 6.3); } // guitar
else { cx.moveTo(hx + 30, 60); cx.lineTo(hx + 30, 230); cx.beginPath(); cx.ellipse(hx + 30, 190, 40, 46, 0, 0, 6.3); } // bass
cx.stroke();
for (var i = 0; i < 12000; i++) { cx.fillStyle = i % 2 ? 'rgba(225,221,193,0.06)' : 'rgba(0,0,0,0.08)'; cx.fillRect(rnd(seed + i * 7) * w, rnd(seed + i * 11) * h, 1, 1); }
cx.font = 'italic 11px Georgia,serif'; cx.fillStyle = 'rgba(230,220,200,0.6)'; cx.textAlign = 'center'; cx.fillText(['Frith St, late set', 'for Ronnie, with love', 'the Tuesday band', 'one more'][seed % 4], w / 2, h - 10);
});
}
var picFrame = new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 0.4, envMap: roomEnv, envMapIntensity: 0.3 });
for (var side = 1; side <= 1; side += 2) for (var i = 0; i < 7; i++) {
var g = new THREE.Group(); g.position.set(side * (W / 2 - 0.02), 1.7 + (rnd(i + side) - 0.5) * 0.3, -3.2 + i * 1.0); g.rotation.y = -side * Math.PI / 2; picG.add(g);
mesh(new THREE.BoxGeometry(0.48, 0.58, 0.03), picFrame, 0, 0, 0.015, g);
mesh(new THREE.PlaneGeometry(0.42, 0.52), new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.9 }), 0, 0, 0.031, g);
mesh(new THREE.PlaneGeometry(0.34, 0.44), new THREE.MeshStandardMaterial({ map: photoTex(i * 3 + side), roughness: 0.6, envMap: roomEnv, envMapIntensity: 0.2 }), 0, 0, 0.034, g);
// each lit by its own small picture light
var pl = new THREE.PointLight(0xffd8a0, 0.22, 1.2, 1.6); pl.position.set(0, 0.38, 0.12); g.add(pl);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8), brass, 0, 0.4, 0.06, g).rotation.z = Math.PI / 2;
}
// a poster by the door for tonight
var posterTex = tex(256, 384, function(cx, w, h) { cx.fillStyle = '#e8dcc0'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#1a1a1a'; cx.fillRect(0, 0, w, 70); cx.fillStyle = '#e8dcc0'; cx.textAlign = 'center'; cx.font = 'bold 26px Georgia,serif'; cx.fillText("RONNIE SCOTT'S", w / 2, 46); cx.fillStyle = '#1a1a1a'; cx.font = 'bold 20px Georgia,serif'; cx.fillText('TONIGHT', w / 2, 110); cx.font = 'italic 30px Georgia,serif'; cx.fillStyle = '#8a1a1a'; cx.fillText('the late set', w / 2, 160); cx.fillStyle = '#1a1a1a'; cx.font = '16px Georgia,serif'; ['a horn, a piano,', 'a guitar', 'and the tune you came in with', '', 'doors 9 · music 10 · till late'].forEach(function(l, i) { cx.fillText(l, w / 2, 210 + i * 28); }); for (var i = 0; i < 3000; i++) { cx.fillStyle = 'rgba(90,70,40,0.05)'; cx.fillRect(rnd(i) * w, rnd(i + 3) * h, 1, 1); } });
var poster = mesh(new THREE.PlaneGeometry(0.42, 0.63), new THREE.MeshStandardMaterial({ map: posterTex, roughness: 0.95 }), W / 2 - 0.02, 1.7, 0.6); poster.rotation.y = -Math.PI / 2;
// the door out to Frith Street, front left, with its dim exit light
var doorG = new THREE.Group(); doorG.position.set(W / 2 - 0.03, 0, -0.6); doorG.rotation.y = -Math.PI / 2; scene.add(doorG);
mesh(new THREE.BoxGeometry(0.95, 2.15, 0.06), darkWood, 0, 1.075, 0, doorG);
mesh(new THREE.BoxGeometry(1.1, 0.1, 0.12), oak, 0, 2.2, 0, doorG); mesh(new THREE.BoxGeometry(0.08, 2.25, 0.12), oak, -0.55, 1.125, 0, doorG); mesh(new THREE.BoxGeometry(0.08, 2.25, 0.12), oak, 0.55, 1.125, 0, doorG);
mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshStandardMaterial({ color: 0x0a0e10, roughness: 0.2, metalness: 0.5, envMap: roomEnv, envMapIntensity: 0.6 }), 0, 1.55, 0.035, doorG);
mesh(new THREE.BoxGeometry(0.34, 0.14, 0.04), brass, 0, 1.0, 0.04, doorG);
mesh(new THREE.BoxGeometry(0.4, 0.14, 0.02), new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 0.6 }), 0, 2.36, 0.04, doorG); mesh(new THREE.BoxGeometry(0.5, 0.18, 0.06), black, 0, 2.36, 0.02, doorG);
var exitTex = tex(128, 48, function(cx, w, h) { cx.fillStyle = '#0a2a10'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#60ff80'; cx.font = 'bold 30px Arial,sans-serif'; cx.textAlign = 'center'; cx.fillText('EXIT', w / 2, 36); });
mesh(new THREE.PlaneGeometry(0.4, 0.14), new THREE.MeshBasicMaterial({ map: exitTex, toneMapped: false }), 0, 2.36, 0.052, doorG);
var exitLight = new THREE.PointLight(0x40e060, 0.3, 2.5, 1.6); exitLight.position.set(W / 2 - 0.4, 2.3, -0.6); scene.add(exitLight);
var exitGlow = glow(W / 2 - 0.1, 2.36, -0.6, 0.6, 0.35, 0x60ff80);
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
var saxMat = new THREE.MeshStandardMaterial({ color: 0xd8a040, roughness: 0.25, metalness: 0.92, envMap: roomEnv, envMapIntensity: 1.2 });
var sax = mesh(new THREE.CylinderGeometry(0.025, 0.05, 0.62, 12), saxMat, 0.42, 0.42 + 1.0, SZ + 0.62); sax.rotation.z = 0.35; sax.rotation.x = 0.3;
var bell = mesh(new THREE.CylinderGeometry(0.1, 0.05, 0.14, 14, 1, true), saxMat, 0.55, 0.42 + 0.72, SZ + 0.72); bell.rotation.z = 0.35 + Math.PI; bell.rotation.x = 0.3; bell.material = saxMat.clone(); bell.material.side = THREE.DoubleSide;
for (var kk = 0; kk < 6; kk++) mesh(new THREE.SphereGeometry(0.012, 6, 6), new THREE.MeshStandardMaterial({ color: 0xf0e8d0, roughness: 0.4 }), 0.42 + kk * 0.018, 0.42 + 1.22 - kk * 0.07, SZ + 0.6 + kk * 0.012);
var pianist = ghost(-1.3, 0.42, SZ + 0.55, 2, 0.4, true, true);   // the pianist, at the keys
var guitarist = ghost(1.4, 0.42, SZ + 0.2, 4, 0.4, true, true);   // the guitarist, on his stool
mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.06, 18), new THREE.MeshStandardMaterial({ map: grainC, roughness: 0.5, envMap: roomEnv, envMapIntensity: 0.4 }), 1.25, 0.42 + 0.95, SZ + 0.32).rotation.set(0.3, 0, 1.1);
var neck = mesh(new THREE.BoxGeometry(0.04, 0.55, 0.02), darkWood, 1.05, 0.42 + 1.25, SZ + 0.34); neck.rotation.z = 0.9;
var listener = ghost(2.6, 0, 0.3, 6, 0.16, true, false);          // someone at a side table
var behind = ghost(0.6, 0.18, 3.2, 8, 0.12, true, false);         // someone at the table behind you, who will not look

// ---------- LIGHT ----------
scene.add(new THREE.AmbientLight(0x3a1c20, 0.9));
scene.add(new THREE.HemisphereLight(0x6a3838, 0x100608, 0.42));
// contact shadows, static shadow map
var contactTex = tex(64, 64, function(cx, w, h) { var g = cx.createRadialGradient(32, 32, 3, 32, 32, 32); g.addColorStop(0, 'rgba(0,0,0,0.36)'); g.addColorStop(0.45, 'rgba(0,0,0,0.2)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function contact(x, y, z, s) { var sh = mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false }), x, y + 0.004, z); sh.rotation.x = -Math.PI / 2; return sh; }
tables.forEach(function(tb) { contact(tb.position.x, tb.position.y, tb.position.z, 1.3); });
renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true;
// smoke: the cone catches it, the lamps hold a little, specks only in the light
var hazeTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(220,190,160,0.2)'); g.addColorStop(0.35, 'rgba(170,130,110,0.12)'); g.addColorStop(1, 'rgba(100,70,60,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var haze = [[0.1, 1.6, SZ + 0.8, 3.4, 2.2], [-W / 2 + 0.6, 1.9, 0.9, 1.6, 1.2]].map(function(p) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTex, transparent: true, opacity: 0.14, depthWrite: false, blending: THREE.AdditiveBlending })); sp.position.set(p[0], p[1], p[2]); sp.scale.set(p[3], p[4], 1); scene.add(sp); return sp; });
var dustTex = tex(32, 32, function(cx, w, h) { var g = cx.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,237,197,0.85)'); g.addColorStop(0.22, 'rgba(255,237,197,0.4)'); g.addColorStop(1, 'rgba(255,237,197,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var moteN = 90, moteBase = new Float32Array(moteN * 3), motePos = new Float32Array(moteN * 3);
for (var mi = 0; mi < moteN; mi++) { var yy = 0.5 + rnd(mi + 1) * 2.4, rr = 0.15 + (H - yy) * 0.42 * rnd(mi * 11), angle = rnd(mi * 7) * Math.PI * 2; moteBase[mi * 3] = 0.1 + Math.cos(angle) * rr; moteBase[mi * 3 + 1] = yy; moteBase[mi * 3 + 2] = SZ + 0.6 + Math.sin(angle) * rr; }
motePos.set(moteBase);
var moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
scene.add(new THREE.Points(moteGeo, new THREE.PointsMaterial({ map: dustTex, color: 0xffe0c0, size: 0.02, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending })));

// ---------- THE CLOSE-UPS, AND THE PATHS ----------
var PINK = 'color:#ff3aa8;text-shadow:0 0 4px rgba(255,58,168,0.45);';
function passageLinks(sel) {
var pass = riHost.closest('tw-passage') || document.querySelector('tw-passage');
if (!pass) return [];
return Array.prototype.slice.call(pass.querySelectorAll(sel)).filter(function(l) { return !riWrap.contains(l); });
}
// the lily, when it is still there to take: the hook's own click-replace does the work
function lilyHook(n) { var pass = riHost.closest('tw-passage') || document.querySelector('tw-passage'); if (!pass) return []; var h = pass.querySelector('tw-hook[name="lily' + n + '"]'); return (h && h.querySelector('svg') && !h.querySelector('.lily-glimpse') && h.getClientRects().length > 0) ? [h] : []; }
function byText(texts) { return passageLinks('tw-link').filter(function(l) { return texts.indexOf(l.textContent.trim()) >= 0; }); }
var HOTSPOTS = [
{ root: stageG, name: 'the stage', pos: [0.2, 1.4, -0.6], tgt: [0.1, 1.1, SZ], haloAt: [0.1, 1.2, SZ + 0.3], haloSc: 2.2,
actions: function() { return passageLinks('#bar-start-btn'); },
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
actions: function() { return byText(["⟡ LORE: Ronnie Scott's ⟡"]); },
line: 'The wall of them, every one lit from the side and grinning or not, everyone who has stood in that light and gone home. [Sam: the photographs]' },
{ root: nearTable, name: 'the empty table', pos: [-0.9, 1.3, 1.2], tgt: [-1.7, 0.9, -0.2], haloAt: [-1.7, 1.0, -0.2], haloSc: 1.0,
actions: function() { return lilyHook(3); },
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
b.className = 'fi-action'; b.textContent = link.textContent.trim(); b.style.cssText = BTN; if (link.tagName === 'TW-HOOK') { b.textContent = '[Sam: the lily]'; b.style.color = '#ff3aa8'; }
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
spot.intensity = 3.2 + 0.12 * Math.sin(t * 0.5); cone.material.opacity = 0.46 + 0.05 * Math.sin(t * 0.37); spotGlow.material.opacity = 0.5 + 0.03 * Math.sin(t * 0.5); haze[0].material.opacity = 0.14 + 0.03 * Math.sin(t * 0.29);
for (var li = 0; li < lampLights.length; li++) { var lb = 0.08 * Math.sin(t * (1.3 + li * 0.21) + li * 2); lampLights[li].intensity = 0.9 + lb; lampGlows[li].material.opacity = 0.5 + lb * 0.8; }
signGlow.material.opacity = 0.35 + 0.02 * Math.sin(t * 7.1) + 0.02 * Math.sin(t * 2.3); signLight.intensity = 0.6 + 0.03 * Math.sin(t * 7.1);
for (var m = 0; m < moteN; m++) { motePos[m * 3] = moteBase[m * 3] + Math.sin(t * 0.15 + m) * 0.06; motePos[m * 3 + 1] = 0.5 + ((moteBase[m * 3 + 1] - 0.5 + (m % 2 ? 1 : -1) * t * 0.03) % 2.4 + 2.4) % 2.4; }
moteGeo.attributes.position.needsUpdate = true;
if (halo.visible) halo.material.opacity = 0.8 + Math.sin(t * 0.9) * 0.08;
}
for (var mr = 0; mr < mirrors.length; mr++) mirrors[mr].update(curTarget, t);
if (composer) composer.render(); else renderer.render(scene, camera);
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

