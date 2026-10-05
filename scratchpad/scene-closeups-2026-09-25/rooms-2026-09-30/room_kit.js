// ====== THE ROOM KIT — what the six later rooms share (2026-09-30) ======
// The four rooms above (French, Colony, Pillars, Ronnie's) each carry a
// copy of the same machinery: the wrap sized to the window, the renderer
// and the outside scenes' composer, the grain, soot and varnish textures,
// the environment cube, the planar mirror, the ghosts, the hover halo and
// the resting glow, the card, the words panel, the camera tweens and the
// pick. The six rooms built on 2026-09-30 (Coach and Horses, Trisha's,
// Lackland's office, the Chippy, Copper's cellar, O'Flatterly's) take it
// from here instead, so each of those blocks is only its room and its
// close-ups. Nothing about the game is decided here: a room only finds the
// passage's own links by their wording and presses them from the card.
// spec: { id, caption, captionColor, bg, fog, exposure, bloom, wash, vignette,
//         cam(portrait), fov [portrait, landscape], hint, card {fg, bg, border, dim, btn, btnBorder},
//         build(k) -> { hotspots, frame(t, dt, still) } }
window.dssRoomKit = function(spec) {
var ID = spec.id, CONT = ID + '-container', WRAP = ID + '-wrap';
var active = false, animId = null;

function init() {
if (active) return;
active = true;
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(build) : build()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(build) : build());
}
}

function build() {
var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var host = document.getElementById(CONT);
if (!host) { active = false; return; }
var wrap = document.createElement('div');
wrap.id = WRAP;
function size() {
var w = Math.max(280, document.documentElement.clientWidth || window.innerWidth);
var vh = window.innerHeight || 800;
// the room fills the window below its top edge: the passage's words sit inside it, nothing follows underneath
var top = 0, el = host; while (el) { top += el.offsetTop; el = el.offsetParent; }
var pad = 0; el = host; while (el && el !== document.body) { var cs = getComputedStyle(el); pad += (parseFloat(cs.paddingBottom) || 0) + (parseFloat(cs.marginBottom) || 0); el = el.parentNode; }
var h = Math.round(Math.max(360, vh - top - pad - 2));
return { w: w, h: h };
}
var sz = size();
var bgHex = '#' + ('000000' + (spec.bg || 0x050304).toString(16)).slice(-6);
wrap.style.cssText = 'position:relative;width:100vw;margin-left:calc(50% - 50vw);height:' + sz.h + 'px;z-index:0;isolation:isolate;background:' + bgHex + ';overflow:hidden;';
var canvas = document.createElement('canvas');
canvas.width = sz.w; canvas.height = sz.h;
canvas.style.cssText = 'display:block;position:absolute;top:0;left:0;width:100%;height:100%;touch-action:none;';
wrap.appendChild(canvas);
var wash = document.createElement('div');
wash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9000;background:' + (spec.wash || 'linear-gradient(180deg,rgba(10,8,6,0.3) 0%,rgba(6,5,4,0.05) 35%,rgba(6,5,4,0.05) 60%,rgba(3,2,2,0.45) 100%)') + ';';
wrap.appendChild(wash);
var vig = document.createElement('div');
vig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:' + (spec.vignette || 'radial-gradient(ellipse at 50% 44%,transparent 24%,rgba(0,0,0,0.74) 100%)') + ';';
wrap.appendChild(vig);
var grain = document.createElement('div');
grain.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9002;opacity:0.06;mix-blend-mode:overlay;background:url(' + (window.dssGetGrainURL ? window.dssGetGrainURL() : '') + ');';
wrap.appendChild(grain);
var loc = document.createElement('div');
loc.textContent = spec.caption || '';
loc.style.cssText = 'position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font:12px \'Courier New\',monospace;color:' + (spec.captionColor || 'rgba(200,190,160,0.25)') + ';letter-spacing:3px;white-space:nowrap;z-index:9003;pointer-events:none;';
wrap.appendChild(loc);
host.appendChild(wrap);
sz = size(); wrap.style.height = sz.h + 'px';
setTimeout(function() { var r = window._dssThreeRegistry && window._dssThreeRegistry[WRAP]; if (r && r.resize) r.resize(); }, 1600);

var scene = new THREE.Scene();
scene.background = new THREE.Color(spec.bg || 0x050304);
if (spec.fog) scene.fog = new THREE.FogExp2(spec.fog[0], spec.fog[1]);
var aspect = sz.w / sz.h;
var portrait = aspect < 1.4;
var FOV = spec.fov || [92, 70];
var camera = new THREE.PerspectiveCamera(portrait ? FOV[0] : FOV[1], aspect, 0.05, 40);
var CAM = spec.cam(portrait);
camera.position.set(CAM.x, CAM.y, CAM.z);

var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sz.w, sz.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, sz.w < 600 ? 1.25 : 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = spec.exposure || 0.66;
window._dssBindScene(WRAP, scene, renderer, camera);
var origResize = window._dssThreeRegistry[WRAP].resize;
window._dssThreeRegistry[WRAP].resize = function() {
sz = size(); wrap.style.height = sz.h + 'px';
camera.aspect = sz.w / sz.h;
camera.fov = camera.aspect < 1.4 ? FOV[0] : FOV[1];
camera.updateProjectionMatrix();
renderer.setSize(sz.w, sz.h);
};
window.removeEventListener('resize', origResize);
window.addEventListener('resize', window._dssThreeRegistry[WRAP].resize);
// The outside scenes' bloom and grade, at the room's own size.
var composer = window.dssMakeComposer ? window.dssMakeComposer(scene, camera, renderer, spec.bloom || { bloomStrength: 0.38, bloomRadius: 0.6, bloomThreshold: 0.7 }) : null;
if (composer) { composer.setSize(sz.w, sz.h); var rs = window._dssThreeRegistry[WRAP].resize; window._dssThreeRegistry[WRAP].resize = function() { rs(); composer.setSize(sz.w, sz.h); }; window.removeEventListener('resize', rs); window.addEventListener('resize', window._dssThreeRegistry[WRAP].resize); }

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
// A small canvas-made room environment: what the metal, the glass and the varnish reflect.
function makeEnv(top, mid, low, lamp) {
var faces = [];
for (var ef = 0; ef < 6; ef++) {
var ec = document.createElement('canvas'); ec.width = ec.height = 128;
var ex = ec.getContext('2d'), eg = ex.createLinearGradient(0, 0, 0, 128);
eg.addColorStop(0, ef === 2 ? top : mid); eg.addColorStop(0.5, mid); eg.addColorStop(1, low); ex.fillStyle = eg; ex.fillRect(0, 0, 128, 128);
if (ef !== 3) {
for (var el = 0; el < 2; el++) {
var lx = 28 + el * 73, ly = ef === 2 ? 64 : 30;
var gl = ex.createRadialGradient(lx, ly, 0, lx, ly, 20); gl.addColorStop(0, '#ffe6b8'); gl.addColorStop(0.14, lamp || '#d9b070'); gl.addColorStop(0.4, '#8a5f2c'); gl.addColorStop(1, 'rgba(96,63,25,0)'); ex.fillStyle = gl; ex.fillRect(0, 0, 128, 128);
} ex.fillStyle = 'rgba(190,120,70,0.14)'; ex.fillRect(4, 84, 120, 10);
} faces.push(ec);
}
var env = new THREE.CubeTexture(faces); env.needsUpdate = true; return env;
}
var envSpec = spec.env || ['#5a4028', '#3e2e1e', '#0a0705', '#d9b070'];
var roomEnv = makeEnv(envSpec[0], envSpec[1], envSpec[2], envSpec[3]);
var grainA = woodTex('#3d2416', '#150905', 1), grainB = woodTex('#2a1810', '#0e0704', 2), grainC = woodTex('#4a2c1a', '#1a0c06', 3);
var M = {
oak: new THREE.MeshStandardMaterial({ map: grainA, bumpMap: grainA, bumpScale: 0.003, roughnessMap: grainA, roughness: 0.62, envMap: roomEnv, envMapIntensity: 0.4, metalness: 0.04 }),
darkWood: new THREE.MeshStandardMaterial({ map: grainB, bumpMap: grainB, bumpScale: 0.006, roughness: 0.58, envMap: roomEnv, envMapIntensity: 0.22 }),
shelfWood: new THREE.MeshStandardMaterial({ map: grainC, bumpMap: grainC, bumpScale: 0.002, roughnessMap: grainC, roughness: 0.5, envMap: roomEnv, envMapIntensity: 0.5, metalness: 0.06 }),
brass: new THREE.MeshStandardMaterial({ color: 0xb99a60, roughness: 0.3, metalness: 0.82, envMap: roomEnv, envMapIntensity: 0.72 }),
black: new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.15, metalness: 0.2, envMap: roomEnv, envMapIntensity: 0.8 }),
chrome: new THREE.MeshStandardMaterial({ color: 0xc8c8c8, roughness: 0.22, metalness: 0.95, envMap: roomEnv, envMapIntensity: 1.0 }),
glass: new THREE.MeshPhysicalMaterial({ color: 0xf0eadc, roughness: 0.09, metalness: 0.04, envMap: roomEnv, envMapIntensity: 1.1, clearcoat: 1, transparent: true, opacity: 0.34 }),
paper: new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.95 }),
bakelite: new THREE.MeshStandardMaterial({ color: 0x16120f, roughness: 0.26, metalness: 0.08, envMap: roomEnv, envMapIntensity: 0.55 }),
hidden: new THREE.MeshBasicMaterial({ visible: false })
};

// ---------- A PLANAR REFLECTION, drawn only when the view changes ----------
var mirrors = [];
function makeMirror(m, normal, sizePx, tint, extra) {
extra = extra || {};
var target = new THREE.WebGLRenderTarget(sizePx, sizePx, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
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
var o = { mesh: m, update: function(tgt, t) {
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
mirrors.forEach(function(q) { q.mesh.visible = false; });
renderer.toneMapping = THREE.NoToneMapping; renderer.setRenderTarget(target); renderer.render(scene, mcam);
renderer.setRenderTarget(oldTarget); renderer.toneMapping = oldTone; mirrors.forEach(function(q) { q.mesh.visible = true; });
} };
mirrors.push(o); return o;
}

// ---------- LIGHT SPRITES, CONTACT SHADOWS, GHOSTS ----------
var glowTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,225,160,0.9)'); g.addColorStop(0.3, 'rgba(255,190,100,0.35)'); g.addColorStop(0.7, 'rgba(220,140,50,0.08)'); g.addColorStop(1, 'rgba(180,100,30,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function glow(x, y, z, sc, op, col, parent) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: col || 0xffffff, transparent: true, opacity: op || 0.6, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, fog: false, toneMapped: false })); sp.scale.set(sc, sc, 1); sp.position.set(x, y, z); (parent || scene).add(sp); return sp; }
var contactTex = tex(64, 64, function(cx, w, h) { var g = cx.createRadialGradient(32, 32, 3, 32, 32, 32); g.addColorStop(0, 'rgba(0,0,0,0.36)'); g.addColorStop(0.45, 'rgba(0,0,0,0.2)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function contact(x, y, z, s) { var sh = mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false }), x, y + 0.004, z); sh.rotation.x = -Math.PI / 2; return sh; }
function ghostTex(seed, seated, bright) { return window.dssGhostTex(tex, rnd, seed, seated, bright); }
var ghosts = [];
function ghost(x, y, z, seed, base, seated, bright, scale) {
var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ghostTex(seed, seated, bright), transparent: true, opacity: base, depthWrite: false, blending: bright ? THREE.NormalBlending : THREE.AdditiveBlending }));
var sc = scale || 1; sp.scale.set(0.9 * sc, 1.8 * sc, 1); sp.position.set(x, y + 0.9 * sc, z); scene.add(sp);
var hit = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * sc, 0.2 * sc, (seated ? 1.1 : 1.5) * sc, 8), M.hidden);
hit.position.set(x, y + (seated ? 0.7 : 0.95) * sc, z); scene.add(hit);
var g = { sp: sp, hit: hit, base: base, ph: seed * 2.1 }; ghosts.push(g); return g;
}

// ---------- THE PASSAGE'S OWN LINKS ----------
var play = null;
function passageLinks(sel) {
var pass = host.closest('tw-passage') || document.querySelector('tw-passage');
if (!pass) return [];
return Array.prototype.slice.call(pass.querySelectorAll(sel)).filter(function(l) { return !(play && play.card.contains(l)) && !l.closest('.dss-key-offer') && (l.classList.contains('dss-claimed') || l.getClientRects().length > 0); });
}
function lilyHook(n) { var pass = host.closest('tw-passage') || document.querySelector('tw-passage'); if (!pass) return []; var h = pass.querySelector('tw-hook[name="lily' + n + '"]'); return (h && h.querySelector('svg') && !h.querySelector('.lily-glimpse') && h.getClientRects().length > 0) ? [h] : []; }
function byText(texts) { return passageLinks('tw-link').filter(function(l) { return texts.indexOf(l.textContent.trim()) >= 0; }); }
function byPrefix(prefix) { return passageLinks('tw-link').filter(function(l) { return l.textContent.trim().indexOf(prefix) === 0; }); }
function modalProse() { var d = passageLinks('.phone-ringing')[0]; if (!d) return ''; var c = d.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('tw-link'), function(l) { l.parentNode.removeChild(l); }); return c.textContent.replace(/\s+/g, ' ').trim(); }

var k = { scene: scene, camera: camera, renderer: renderer, tex: tex, rnd: rnd, mesh: mesh, woodTex: woodTex, paintTex: paintTex, roomEnv: roomEnv, M: M, grain: [grainA, grainB, grainC],
makeMirror: makeMirror, glow: glow, glowTex: glowTex, contact: contact, ghost: ghost, portrait: portrait, still: still, host: host, wrap: wrap,
passageLinks: passageLinks, byText: byText, byPrefix: byPrefix, lilyHook: lilyHook, modalProse: modalProse };
var built = spec.build(k) || {};
var HOTSPOTS = built.hotspots || [];
renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true;

// ---------- THE CLOSE-UPS, AND THE PATHS ----------
// ---------- THE CLOSE-UPS, AND THE PATHS: shared with every room (window.dssRoomPlay) ----------
var play = window.dssRoomPlay({ wrap: wrap, canvas: canvas, host: host, scene: scene, camera: camera, CAM: CAM, HOTSPOTS: HOTSPOTS, tex: tex, still: still,
card: spec.card, hint: spec.hint, state: function() { return { active: active, animId: animId }; } });
var words = play.words, curTarget = play.curTarget;

// ---------- FRAMES ----------
var clock = new THREE.Clock();
function animate() {
animId = requestAnimationFrame(animate);
var dt = Math.min(0.1, clock.getDelta());
var t = still ? 0 : clock.getElapsedTime();
play.frame(t, dt);
if (!still) {
for (var gi = 0; gi < ghosts.length; gi++) { var g = ghosts[gi]; g.sp.material.opacity = g.base * (0.7 + 0.3 * Math.sin(t * 0.23 + g.ph)); }
}
if (built.frame) built.frame(t, dt, still);
play.withGlowsHidden(function() { for (var mr = 0; mr < mirrors.length; mr++) mirrors[mr].update(curTarget, t); });
if (composer) composer.render(); else renderer.render(scene, camera);
}
animate();
}

setInterval(function() {
var container = document.getElementById(CONT);
if (container && !active) {
init();
} else if (!container) {
active = false;
if (animId) { cancelAnimationFrame(animId); animId = null; }
window._dssDisposeWrap(WRAP);
}
}, 300);
};
