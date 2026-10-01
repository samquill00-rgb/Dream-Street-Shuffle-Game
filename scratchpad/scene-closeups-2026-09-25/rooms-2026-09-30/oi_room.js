// ====== INSIDE O'FLATTERLY'S — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-30. Built from what is written of I. O'Flatterly, dealer in books,
// in Cecil Court: a narrow shop shelved floor to ceiling, a ladder on its
// rail, a glass case of the better things, a thick wooden counter with a
// lamp on it and Inis behind it reading what he's reading, the bell over
// the door, the window with the court's lamp in it. The room sits at the
// top of the O'Flatterly's shop passage (#oi-container) and is its
// navigation: Inis opens "The Great Ham sent me" while the passage offers
// it. The shelves, the ladder, the case, the bell, the window and the
// globe are inspections, their card words pink placeholders for Sam.
// Nothing about the game is decided in JS.
window.dssRoomKit({
id: 'oi', caption: "I. O'FLATTERLY, DEALER IN BOOKS, CECIL COURT", captionColor: 'rgba(220,190,120,0.28)',
bg: 0x0a0704, fog: [0x120c06, 0.045], exposure: 0.76, bloom: { bloomStrength: 0.4, bloomRadius: 0.65, bloomThreshold: 0.66 },
env: ['#8a6a30', '#4a3a20', '#0c0906', '#f0d090'],
wash: 'linear-gradient(180deg,rgba(30,20,8,0.3) 0%,rgba(14,10,4,0.05) 35%,rgba(14,10,4,0.05) 60%,rgba(5,3,1,0.45) 100%)',
card: { fg: 'rgba(235,220,185,0.92)', bg: 'rgba(12,8,3,0.82)', border: 'rgba(220,180,100,0.3)', dim: 'rgba(210,190,140,0.5)', btn: 'rgba(245,230,185,0.95)', btnBorder: 'rgba(220,180,100,0.45)' },
cam: function(portrait) { return portrait ? { x: 0.2, y: 1.5, z: 3.3, tx: 0.0, ty: 1.15, tz: -2.0 } : { x: 0.3, y: 1.5, z: 3.4, tx: 0.0, ty: 1.2, tz: -2.0 }; },
build: function(k) {
var scene = k.scene, mesh = k.mesh, tex = k.tex, rnd = k.rnd, M = k.M;
var W = 4.4, D = 7.0, H = 3.3;
// ---------- THE SHOP: boards, a pressed ceiling, the walls where they show between the shelves ----------
var boardsTex = k.woodTex('#4a3420', '#1a0e06', 14); boardsTex.wrapS = boardsTex.wrapT = THREE.RepeatWrapping; boardsTex.repeat.set(4, 6);
var floor = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: boardsTex, bumpMap: boardsTex, bumpScale: 0.012, roughness: 0.6, envMap: k.roomEnv, envMapIntensity: 0.3 }), 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceilTex = tex(256, 256, function(cx, w, h) { cx.fillStyle = '#c8bca0'; cx.fillRect(0, 0, w, h); cx.strokeStyle = 'rgba(90,70,40,0.5)'; cx.lineWidth = 2; for (var i = 0; i < 4; i++) { cx.strokeRect(10 + i * 10, 10 + i * 10, w - 20 - i * 20, h - 20 - i * 20); } cx.beginPath(); cx.arc(w / 2, h / 2, 40, 0, 6.3); cx.stroke(); for (var p = 0; p < 8; p++) { cx.beginPath(); cx.ellipse(w / 2 + Math.cos(p * 0.785) * 28, h / 2 + Math.sin(p * 0.785) * 28, 10, 5, p * 0.785, 0, 6.3); cx.stroke(); } for (var g = 0; g < 2000; g++) { cx.fillStyle = 'rgba(60,40,20,0.08)'; cx.fillRect(rnd(g) * w, rnd(g * 3) * h, 1.5, 1.5); } });
ceilTex.wrapS = ceilTex.wrapT = THREE.RepeatWrapping; ceilTex.repeat.set(3, 5);
var ceil = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: ceilTex, bumpMap: ceilTex, bumpScale: 0.01, roughness: 0.9 }), 0, H, 0); ceil.rotation.x = Math.PI / 2;
var wallPaint = k.paintTex('#4a3a28', 61, 'rgba(110,80,40,0.16)');
var wallMat = new THREE.MeshStandardMaterial({ map: wallPaint, roughness: 0.95 });
var back = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2); var front = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, D / 2); front.rotation.y = Math.PI;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2; var right = mesh(new THREE.PlaneGeometry(D, H), wallMat, W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2;
// ---------- THE SHELVES, floor to ceiling, both walls and the back, and the books in them ----------
var bookCols = [0x6a2a1a, 0x2a3a5a, 0x1a4a2a, 0xa08030, 0xe8e0d0, 0x3a2a4a, 0x8a1a1a, 0x2a2a2a, 0xc8b070, 0x5a3a18, 0x7a6a50, 0x1a2a3a];
var spineTex = tex(64, 256, function(cx, w, h) { cx.fillStyle = 'rgba(255,255,255,0)'; cx.clearRect(0, 0, w, h); cx.fillStyle = 'rgba(230,200,120,0.75)'; cx.fillRect(10, 30, w - 20, 3); cx.fillRect(10, h - 40, w - 20, 3); for (var l = 0; l < 3; l++) cx.fillRect(14 + rnd(l) * 10, 60 + l * 14, w - 28 - rnd(l * 3) * 20, 4); cx.fillStyle = 'rgba(0,0,0,0.18)'; cx.fillRect(0, 0, 6, h); cx.fillRect(w - 6, 0, 6, h); });
function shelfWall(len, x, z, ry, seed, gaps) {
var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
mesh(new THREE.BoxGeometry(len, H - 0.1, 0.36), M.shelfWood, 0, (H - 0.1) / 2, 0, g);
var n = Math.floor((H - 0.3) / 0.38);
for (var sh = 0; sh < n; sh++) {
var y = 0.12 + sh * 0.38;
mesh(new THREE.BoxGeometry(len, 0.03, 0.34), M.shelfWood, 0, y, 0.0, g);
if (gaps && gaps(sh)) continue;
var bx = -len / 2 + 0.03;
while (bx < len / 2 - 0.05) {
var bw = 0.025 + rnd(seed + sh * 100 + bx * 37) * 0.05, bh = 0.2 + rnd(seed + sh * 7 + bx * 13) * 0.13;
if (rnd(seed + sh * 3 + bx * 5) < 0.05) { bx += 0.1; continue; }
var col = bookCols[Math.floor(rnd(seed + sh * 11 + bx * 17) * bookCols.length)];
var bm = new THREE.MeshStandardMaterial({ color: col, roughness: 0.85 });
var bk = mesh(new THREE.BoxGeometry(bw, bh, 0.2 + rnd(bx + seed) * 0.1), bm, bx + bw / 2, y + 0.015 + bh / 2, 0.04, g);
if (rnd(bx * 7 + seed) < 0.3) mesh(new THREE.PlaneGeometry(bw * 0.9, bh * 0.9), new THREE.MeshStandardMaterial({ map: spineTex, transparent: true, roughness: 0.8 }), bx + bw / 2, y + 0.015 + bh / 2, 0.04 + 0.11 + rnd(bx + seed) * 0.05 + 0.001, g);
if (rnd(bx * 3 + seed) < 0.07) bk.rotation.z = 0.18;
bx += bw + 0.003;
}
}
return g;
}
var shelfL = shelfWall(3.8, -W / 2 + 0.18, -1.6, Math.PI / 2, 1);
var shelfR = shelfWall(2.6, W / 2 - 0.18, -2.1, -Math.PI / 2, 2);
var shelfB = shelfWall(W - 0.4, 0, -D / 2 + 0.18, 0, 3, function(sh) { return sh === 3; });
// the ladder on its brass rail along the left shelves
var ladderG = new THREE.Group(); ladderG.position.set(-W / 2 + 0.55, 0, -1.6); ladderG.rotation.z = 0.12; scene.add(ladderG);
[[-0.2], [0.2]].forEach(function(s) { mesh(new THREE.BoxGeometry(0.04, 3.0, 0.03), M.oak, s[0], 1.5, 0, ladderG); });
for (var r = 0; r < 9; r++) mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.4, 8), M.oak, 0, 0.25 + r * 0.32, 0, ladderG).rotation.z = Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.015, 0.015, D - 1.8, 8), M.brass, -W / 2 + 0.42, H - 0.3, -0.8).rotation.x = Math.PI / 2;
var ladderHit = mesh(new THREE.BoxGeometry(0.6, 3.0, 0.4), M.hidden, 0, 1.5, 0, ladderG);
// an open book on the ladder's step, left there
mesh(new THREE.BoxGeometry(0.16, 0.02, 0.22), new THREE.MeshStandardMaterial({ color: 0xe8e0cc, roughness: 0.95 }), 0.0, 1.22, 0.02, ladderG).rotation.x = -0.4;
// the stacks on the floor, the way a shop like this has them
function stack(x, z, n, seed) { var g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g); var y = 0; for (var i = 0; i < n; i++) { var h = 0.03 + rnd(seed + i) * 0.04, w = 0.18 + rnd(seed + i * 3) * 0.1, d = 0.24 + rnd(seed + i * 5) * 0.08; var b = mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: bookCols[Math.floor(rnd(seed + i * 7) * bookCols.length)], roughness: 0.85 }), (rnd(seed + i * 9) - 0.5) * 0.04, y + h / 2, (rnd(seed + i * 11) - 0.5) * 0.04, g); b.rotation.y = (rnd(seed + i * 13) - 0.5) * 0.4; b.castShadow = true; y += h; } k.contact(x, 0, z, 0.6); return g; }
stack(-1.4, 1.6, 9, 5); stack(-1.1, 1.75, 5, 6); stack(1.5, 0.4, 7, 7); stack(1.45, -0.3, 11, 8); stack(0.9, 2.6, 6, 9);
// ---------- THE COUNTER, thick, with INIS behind it, reading ----------
var counterG = new THREE.Group(); counterG.position.set(0.5, 0, -D / 2 + 1.7); scene.add(counterG);
var counterMat = new THREE.MeshStandardMaterial({ map: k.grain[0], bumpMap: k.grain[0], bumpScale: 0.004, roughness: 0.5, envMap: k.roomEnv, envMapIntensity: 0.4 });
var counterTop = mesh(new THREE.BoxGeometry(1.9, 0.09, 0.8), counterMat, 0, 0.98, 0, counterG); counterTop.castShadow = true; counterTop.receiveShadow = true;
mesh(new THREE.BoxGeometry(1.8, 0.9, 0.7), new THREE.MeshStandardMaterial({ map: k.grain[1], roughness: 0.6, envMap: k.roomEnv, envMapIntensity: 0.25 }), 0, 0.45, 0, counterG);
for (var pn = 0; pn < 3; pn++) mesh(new THREE.BoxGeometry(0.5, 0.6, 0.03), M.darkWood, -0.6 + pn * 0.6, 0.47, 0.36, counterG);
// the lamp on the counter, brass with a parchment shade, the pool of light he reads in
mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.02, 16), M.brass, -0.6, 1.035, -0.15, counterG); mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 8), M.brass, -0.6, 1.25, -0.15, counterG);
var shadeMat = new THREE.MeshPhysicalMaterial({ color: 0xe8d0a0, roughness: 0.8, emissive: 0xffd080, emissiveIntensity: 0.45, side: THREE.DoubleSide, transparent: true, opacity: 0.95 });
mesh(new THREE.CylinderGeometry(0.1, 0.17, 0.16, 18, 1, true), shadeMat, -0.6, 1.5, -0.15, counterG);
mesh(new THREE.SphereGeometry(0.03, 8, 6), new THREE.MeshBasicMaterial({ color: 0xfff0c8, toneMapped: false }), -0.6, 1.45, -0.15, counterG);
var lampLight = new THREE.PointLight(0xffd890, 1.6, 5, 1.5); lampLight.position.set(-0.6, 1.42, -0.1); lampLight.castShadow = true; lampLight.shadow.mapSize.set(512, 512); lampLight.shadow.bias = -0.002; counterG.add(lampLight);
var lampGlow = k.glow(-0.6, 1.45, -0.13, 0.8, 0.45, 0xffd890, counterG);
// what is on the counter: the book he is reading, open; a ledger; a pot of pens; a magnifying glass; the brown paper and string; a cup gone cold
var openBook = new THREE.Group(); openBook.position.set(0.1, 1.03, -0.12); counterG.add(openBook);
var pageTex = tex(128, 160, function(cx, w, h) { cx.fillStyle = '#ece4cc'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#2a2420'; for (var l = 0; l < 20; l++) cx.fillRect(12, 16 + l * 7, 30 + rnd(l * 3) * 74, 1.2); for (var g = 0; g < 400; g++) { cx.fillStyle = 'rgba(120,90,40,0.1)'; cx.fillRect(rnd(g) * w, rnd(g * 3) * h, 1, 1); } });
[-0.11, 0.11].forEach(function(px, i) { var pg = mesh(new THREE.BoxGeometry(0.2, 0.02, 0.28), new THREE.MeshStandardMaterial({ color: 0xe8e0c8, roughness: 0.95 }), px, 0.01, 0, openBook); pg.rotation.z = i ? -0.06 : 0.06; var face = mesh(new THREE.PlaneGeometry(0.18, 0.26), new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.95 }), px, 0.021, 0, openBook); face.rotation.x = -Math.PI / 2; face.rotation.y = i ? -0.06 : 0.06; });
mesh(new THREE.BoxGeometry(0.44, 0.012, 0.3), new THREE.MeshStandardMaterial({ color: 0x4a1a14, roughness: 0.7 }), 0, -0.002, 0, openBook);
var ledger = mesh(new THREE.BoxGeometry(0.3, 0.05, 0.42), new THREE.MeshStandardMaterial({ color: 0x1a2a3a, roughness: 0.75 }), 0.65, 1.05, 0.05, counterG); ledger.rotation.y = 0.15;
mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.1, 10), new THREE.MeshStandardMaterial({ color: 0x2a4a3a, roughness: 0.5 }), -0.25, 1.075, 0.22, counterG); for (var pe = 0; pe < 4; pe++) mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.16, 6), new THREE.MeshStandardMaterial({ color: [0x1a1a1a, 0x8a1a1a, 0xd8c060, 0x1a1a1a][pe], roughness: 0.6 }), -0.25 + (rnd(pe) - 0.5) * 0.04, 1.17, 0.22 + (rnd(pe + 3) - 0.5) * 0.04, counterG).rotation.set((rnd(pe * 5) - 0.5) * 0.3, 0, (rnd(pe * 7) - 0.5) * 0.3);
var magG = new THREE.Group(); magG.position.set(0.35, 1.035, 0.24); magG.rotation.y = 0.8; counterG.add(magG); mesh(new THREE.TorusGeometry(0.05, 0.006, 8, 24), M.brass, 0, 0.006, 0, magG).rotation.x = Math.PI / 2; mesh(new THREE.CircleGeometry(0.046, 24), M.glass, 0, 0.006, 0, magG).rotation.x = -Math.PI / 2; mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.1, 8), M.darkWood, 0.1, 0.006, 0, magG).rotation.z = Math.PI / 2;
mesh(new THREE.BoxGeometry(0.3, 0.1, 0.22), new THREE.MeshStandardMaterial({ color: 0x8a6a40, roughness: 0.98 }), -0.75, 1.08, 0.2, counterG); mesh(new THREE.TorusGeometry(0.035, 0.012, 8, 16), new THREE.MeshStandardMaterial({ color: 0xc8b080, roughness: 0.95 }), -0.6, 1.045, 0.3, counterG).rotation.x = Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.07, 14), new THREE.MeshStandardMaterial({ color: 0xf0f0e8, roughness: 0.3 }), 0.85, 1.06, -0.25, counterG); mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.004, 14), new THREE.MeshStandardMaterial({ color: 0x5a3a18, roughness: 0.3 }), 0.85, 1.09, -0.25, counterG);
// his chair, high and old, and Inis in it, not looking up
mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), M.darkWood, 0.1, 0.55, -0.75, counterG); mesh(new THREE.BoxGeometry(0.5, 0.7, 0.05), M.darkWood, 0.1, 0.95, -0.98, counterG); for (var sl = 0; sl < 5; sl++) mesh(new THREE.BoxGeometry(0.03, 0.6, 0.03), M.darkWood, -0.1 + sl * 0.1, 0.95, -0.95, counterG); [[-0.12, -0.55], [0.32, -0.55], [-0.12, -0.95], [0.32, -0.95]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.52, 8), M.darkWood, l[0], 0.26, l[1], counterG); });
var inis = k.ghost(0.6, 0.15, -D / 2 + 1.7 - 0.72, 51, 0.58, true, true, 1.05);
// his spectacles, caught in the lamp, and a pipe in the ashtray
mesh(new THREE.TorusGeometry(0.02, 0.003, 6, 16), M.brass, 0.55, 1.42, -D / 2 + 1.7 - 0.6); mesh(new THREE.TorusGeometry(0.02, 0.003, 6, 16), M.brass, 0.6, 1.42, -D / 2 + 1.7 - 0.6);
var counterHit = mesh(new THREE.BoxGeometry(2.0, 0.6, 1.0), M.hidden, 0, 1.0, 0, counterG);
// ---------- THE GLASS CASE of the better things, right, and the globe ----------
var caseG = new THREE.Group(); caseG.position.set(-W / 2 + 0.55, 0, 1.1); caseG.rotation.y = Math.PI / 2; scene.add(caseG);
mesh(new THREE.BoxGeometry(1.3, 0.8, 0.5), new THREE.MeshStandardMaterial({ map: k.grain[1], roughness: 0.55, envMap: k.roomEnv, envMapIntensity: 0.3 }), 0, 0.4, 0, caseG);
var caseGlass = new THREE.MeshPhysicalMaterial({ color: 0xf0f4f0, roughness: 0.04, transparent: true, opacity: 0.18, envMap: k.roomEnv, envMapIntensity: 1.2, clearcoat: 1 });
mesh(new THREE.BoxGeometry(1.26, 0.4, 0.46), caseGlass, 0, 1.0, 0, caseG); [[-0.63, 0], [0.63, 0]].forEach(function(e) { mesh(new THREE.BoxGeometry(0.02, 0.42, 0.48), M.brass, e[0], 1.0, 0, caseG); }); mesh(new THREE.BoxGeometry(1.28, 0.02, 0.48), M.brass, 0, 1.2, 0, caseG);
mesh(new THREE.BoxGeometry(1.2, 0.01, 0.4), new THREE.MeshStandardMaterial({ color: 0x3a1a2a, roughness: 0.95 }), 0, 0.805, 0, caseG);
[[-0.4, 0x8a1a1a, 0.18, 0.26], [-0.05, 0x1a3a2a, 0.14, 0.2], [0.3, 0xd8c8a0, 0.2, 0.28], [0.5, 0x2a2a4a, 0.1, 0.15]].forEach(function(b, i) { var bk = mesh(new THREE.BoxGeometry(b[2], 0.035, b[3]), new THREE.MeshStandardMaterial({ color: b[1], roughness: 0.6, envMap: k.roomEnv, envMapIntensity: 0.3 }), b[0], 0.83, (rnd(i) - 0.5) * 0.1, caseG); bk.rotation.y = (rnd(i * 3) - 0.5) * 0.5; if (i === 2) { mesh(new THREE.PlaneGeometry(0.17, 0.25), new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.95 }), b[0], 0.849, (rnd(i) - 0.5) * 0.1, caseG).rotation.set(-Math.PI / 2, 0, bk.rotation.y); } mesh(new THREE.PlaneGeometry(0.06, 0.03), new THREE.MeshStandardMaterial({ color: 0xf0e8d0, roughness: 0.95 }), b[0], 0.812, 0.15, caseG).rotation.x = -Math.PI / 2; });
var caseLight = new THREE.PointLight(0xffe0b0, 0.6, 2, 2); caseLight.position.set(0, 1.15, 0.1); caseG.add(caseLight); var caseGlow = k.glow(0, 1.18, 0, 0.9, 0.25, 0xffe0b0, caseG);
var caseHit = mesh(new THREE.BoxGeometry(1.4, 1.3, 0.7), M.hidden, 0, 0.65, 0, caseG);
var globeG = new THREE.Group(); globeG.position.set(-1.5, 0, -1.9); scene.add(globeG);
mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.9, 10), M.darkWood, 0, 0.45, 0, globeG); mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.04, 20), M.darkWood, 0, 0.02, 0, globeG);
var globeTex = tex(256, 128, function(cx, w, h) { cx.fillStyle = '#c8b888'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#7a6a40'; [[20, 30, 60, 40], [100, 20, 70, 50], [60, 80, 40, 30], [180, 30, 50, 60], [150, 90, 60, 25]].forEach(function(c) { cx.beginPath(); cx.ellipse(c[0] + c[2] / 2, c[1] + c[3] / 2, c[2] / 2, c[3] / 2, 0.3, 0, 6.3); cx.fill(); }); cx.strokeStyle = 'rgba(60,40,20,0.35)'; cx.lineWidth = 0.6; for (var ln = 0; ln < 12; ln++) { cx.beginPath(); cx.moveTo(ln * 21, 0); cx.lineTo(ln * 21, h); cx.stroke(); } for (var lt = 0; lt < 6; lt++) { cx.beginPath(); cx.moveTo(0, lt * 21); cx.lineTo(w, lt * 21); cx.stroke(); } for (var g = 0; g < 1500; g++) { cx.fillStyle = 'rgba(60,40,20,0.12)'; cx.fillRect(rnd(g) * w, rnd(g * 3) * h, 1, 1); } });
var globe = mesh(new THREE.SphereGeometry(0.3, 24, 16), new THREE.MeshStandardMaterial({ map: globeTex, roughness: 0.7, envMap: k.roomEnv, envMapIntensity: 0.2 }), 0, 1.22, 0, globeG); globe.rotation.z = 0.4;
mesh(new THREE.TorusGeometry(0.34, 0.012, 8, 32, Math.PI), M.brass, 0, 1.22, 0, globeG).rotation.z = Math.PI / 2 + 0.4;
var globeHit = mesh(new THREE.SphereGeometry(0.4, 10, 8), M.hidden, 0, 1.22, 0, globeG);
// ---------- THE DOOR with the bell over it, and THE WINDOW onto the court ----------
var doorG = new THREE.Group(); doorG.position.set(W / 2 - 0.03, 0, -0.2); doorG.rotation.y = -Math.PI / 2; scene.add(doorG);
var green = new THREE.MeshStandardMaterial({ color: 0x1a3a28, roughness: 0.4, envMap: k.roomEnv, envMapIntensity: 0.4 });
mesh(new THREE.BoxGeometry(0.95, 2.3, 0.06), green, 0, 1.15, 0, doorG);
var courtTex = tex(256, 384, function(cx, w, h) { var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0a0c14'); g.addColorStop(0.5, '#141418'); g.addColorStop(1, '#1e1a16'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); cx.fillStyle = '#1a1612'; cx.fillRect(0, h * 0.1, w, h * 0.65); for (var wi = 0; wi < 6; wi++) { cx.fillStyle = rnd(wi) < 0.5 ? 'rgba(255,210,140,0.6)' : 'rgba(30,30,44,0.9)'; cx.fillRect(30 + (wi % 3) * 75, h * 0.2 + Math.floor(wi / 3) * 90, 36, 56); } var lg = cx.createRadialGradient(128, h * 0.38, 0, 128, h * 0.38, 90); lg.addColorStop(0, 'rgba(255,225,160,0.95)'); lg.addColorStop(0.15, 'rgba(255,210,140,0.5)'); lg.addColorStop(1, 'rgba(255,210,140,0)'); cx.fillStyle = lg; cx.fillRect(0, 0, w, h); cx.fillStyle = '#0a0a0a'; cx.fillRect(124, h * 0.4, 8, h * 0.36); cx.fillStyle = '#2a2a2e'; cx.fillRect(0, h * 0.75, w, h * 0.25); cx.fillStyle = 'rgba(255,220,150,0.18)'; cx.fillRect(90, h * 0.75, 80, h * 0.25); });
mesh(new THREE.PlaneGeometry(0.6, 1.1), new THREE.MeshBasicMaterial({ map: courtTex, toneMapped: false }), 0, 1.5, 0.035, doorG);
mesh(new THREE.BoxGeometry(0.3, 0.05, 0.05), M.brass, 0.25, 1.05, 0.05, doorG); mesh(new THREE.BoxGeometry(1.1, 0.1, 0.12), M.darkWood, 0, 2.35, 0, doorG);
var bellG = new THREE.Group(); bellG.position.set(0.3, 2.5, 0.08); doorG.add(bellG);
mesh(new THREE.BoxGeometry(0.04, 0.3, 0.02), new THREE.MeshStandardMaterial({ color: 0x2a2a28, roughness: 0.6, metalness: 0.5 }), 0, -0.15, 0, bellG); var bellArm = mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.2, 6), new THREE.MeshStandardMaterial({ color: 0x2a2a28, roughness: 0.6, metalness: 0.5 }), 0, -0.3, 0.08, bellG); bellArm.rotation.x = 0.9;
var bell = mesh(new THREE.CylinderGeometry(0.03, 0.07, 0.08, 14, 1, true), M.brass.clone(), 0, -0.4, 0.16, bellG); bell.material.side = THREE.DoubleSide; mesh(new THREE.SphereGeometry(0.012, 8, 6), M.brass, 0, -0.44, 0.16, bellG);
var bellHit = mesh(new THREE.BoxGeometry(0.4, 0.5, 0.4), M.hidden, 0, -0.3, 0.1, bellG);
var doorHit = mesh(new THREE.BoxGeometry(1.1, 2.2, 0.2), M.hidden, 0, 1.0, 0.05, doorG);
var winG = new THREE.Group(); winG.position.set(W / 2 - 0.03, 1.6, 1.0); winG.rotation.y = -Math.PI / 2; scene.add(winG);
mesh(new THREE.BoxGeometry(1.8, 2.0, 0.1), green, 0, 0, 0, winG);
mesh(new THREE.PlaneGeometry(1.6, 1.8), new THREE.MeshBasicMaterial({ map: courtTex, toneMapped: false }), 0, 0, 0.055, winG);
mesh(new THREE.PlaneGeometry(1.6, 1.8), caseGlass, 0, 0, 0.06, winG);
// the window's own books, backs to you, on a shelf the court sees
mesh(new THREE.BoxGeometry(1.6, 0.03, 0.3), M.shelfWood, 0, -0.75, 0.2, winG); for (var wb = 0; wb < 7; wb++) { var wbk = mesh(new THREE.BoxGeometry(0.16 + rnd(wb) * 0.06, 0.24 + rnd(wb * 3) * 0.06, 0.03), new THREE.MeshStandardMaterial({ color: bookCols[(wb * 5) % bookCols.length], roughness: 0.8 }), -0.68 + wb * 0.22, -0.6, 0.25, winG); wbk.rotation.x = -0.2; }
mesh(new THREE.BoxGeometry(0.05, 1.8, 0.04), green, 0, 0, 0.09, winG); mesh(new THREE.BoxGeometry(1.6, 0.05, 0.04), green, 0, 0.2, 0.09, winG);
var fasciaTex = tex(512, 64, function(cx, w, h) { cx.clearRect(0, 0, w, h); cx.save(); cx.translate(w, 0); cx.scale(-1, 1); cx.fillStyle = 'rgba(220,180,90,0.9)'; cx.font = 'bold 30px Georgia,serif'; cx.textAlign = 'center'; cx.fillText("I. O'FLATTERLY", w / 2, 42); cx.restore(); });
mesh(new THREE.PlaneGeometry(1.5, 0.19), new THREE.MeshBasicMaterial({ map: fasciaTex, transparent: true, toneMapped: false }), 0, 0.68, 0.065, winG);
var courtLight = new THREE.PointLight(0xffd8a0, 0.9, 5, 1.7); courtLight.position.set(W / 2 - 0.6, 1.7, 0.7); scene.add(courtLight);
var courtGlow = k.glow(W / 2 - 0.1, 1.6, 1.0, 2.4, 0.22, 0xffd8a0);
var winHit = mesh(new THREE.BoxGeometry(1.7, 2.1, 0.2), M.hidden, 0, 0, 0.05, winG);
// ---------- LIGHT: the lamp, a pendant with a green shade over the middle, the court through the glass ----------
var pendG = new THREE.Group(); pendG.position.set(0, H, -0.2); scene.add(pendG);
mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.0, 6), M.black, 0, -0.5, 0, pendG);
mesh(new THREE.ConeGeometry(0.26, 0.2, 18, 1, true), new THREE.MeshStandardMaterial({ color: 0x1a4a30, roughness: 0.5, side: THREE.DoubleSide, emissive: 0x0a2a18, emissiveIntensity: 0.4 }), 0, -1.05, 0, pendG);
mesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfff0c8, toneMapped: false }), 0, -1.1, 0, pendG);
var pendLight = new THREE.PointLight(0xffe0b0, 1.0, 6, 1.6); pendLight.position.set(0, -1.15, 0); pendG.add(pendLight); var pendGlow = k.glow(0, -1.1, 0, 0.9, 0.45, 0xffe0b0, pendG);
scene.add(new THREE.AmbientLight(0x4a3818, 0.7));
scene.add(new THREE.HemisphereLight(0x8a6a38, 0x0c0804, 0.4));
var dustTex = tex(32, 32, function(cx, w, h) { var g = cx.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,237,197,0.85)'); g.addColorStop(0.22, 'rgba(255,237,197,0.4)'); g.addColorStop(1, 'rgba(255,237,197,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var moteN = 70, moteBase = new Float32Array(moteN * 3), motePos = new Float32Array(moteN * 3);
for (var mi = 0; mi < moteN; mi++) { moteBase[mi * 3] = -0.1 + (rnd(mi * 7) - 0.5) * 1.6; moteBase[mi * 3 + 1] = 0.6 + rnd(mi + 1) * 2.2; moteBase[mi * 3 + 2] = -D / 2 + 1.7 + (rnd(mi * 11) - 0.5) * 1.6; }
motePos.set(moteBase); var moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
scene.add(new THREE.Points(moteGeo, new THREE.PointsMaterial({ map: dustTex, color: 0xffe0c0, size: 0.018, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending })));
k.contact(0.5, 0, -D / 2 + 1.7, 2.6);
// ---------- THE CLOSE-UPS ----------
var CZ = -D / 2 + 1.7;
var hotspots = [
{ root: inis.hit, name: "Inis O'Flatterly", pos: [0.5, 1.5, CZ + 1.4], tgt: [0.6, 0.7, CZ - 0.72], haloAt: [0.6, 1.3, CZ - 0.72], haloSc: 1.1,
figure: true, actions: function() { return k.byText(['The Great Ham sent me']); },
line: 'He reads what he is reading and does not look up, and the shop does not lack welcome for that. [Sam: Inis, after]' },
{ root: counterHit, name: 'the counter', pos: [0.3, 1.5, CZ + 1.2], tgt: [0.5, 1.0, CZ], haloAt: [0.5, 1.1, CZ], haloSc: 1.6,
line: 'Thick enough to stop a cart, with the lamp on it, his book open in the lamp, a ledger, a glass for looking closer, brown paper and string, a cup gone cold. [Sam: the counter]' },
{ root: shelfL, name: 'the shelves', pos: [-0.3, 1.6, 0.2], tgt: [-W / 2, 1.5, -1.2], haloAt: [-W / 2 + 0.4, 1.5, -1.2], haloSc: 2.4,
line: 'Floor to ceiling and both walls and the one at the back, and every spine a different weather. Somewhere in them is the page. [Sam: the shelves]' },
{ root: ladderHit, name: 'the ladder', pos: [-0.5, 1.6, -0.2], tgt: [-W / 2 + 0.55, 1.6, -1.6], haloAt: [-W / 2 + 0.55, 1.7, -1.6], haloSc: 1.2,
line: 'A ladder on a brass rail, with a book left open on the fourth step by somebody who meant to come back. [Sam: the ladder]' },
{ root: caseHit, name: 'the glass case', pos: [-0.4, 1.4, 1.9], tgt: [-W / 2 + 0.55, 0.9, 1.1], haloAt: [-W / 2 + 0.8, 1.0, 1.1], haloSc: 1.3,
line: 'The better things under glass, their prices on cards you cannot read from here, one of them open at a plate of something with wings. [Sam: the case]' },
{ root: globeHit, name: 'the globe', pos: [-0.6, 1.5, -0.6], tgt: [-1.5, 1.2, -1.9], haloAt: [-1.5, 1.25, -1.9], haloSc: 0.8,
line: 'A globe with the old names on it and the sea the colour of the paper. Somebody has turned it so the desert faces the room. [Sam: the globe]' },
{ root: bellHit, name: 'the bell', pos: [1.0, 1.9, 0.3], tgt: [W / 2, 2.1, 0.1], haloAt: [W / 2 - 0.2, 2.1, 0.1], haloSc: 0.6,
line: 'The bell over the door, on its spring, which rang when you came in and which he did not look up for. [Sam: the bell]' },
{ root: winHit, name: 'the window', pos: [0.5, 1.6, 1.0], tgt: [W / 2, 1.5, 1.0], haloAt: [W / 2 - 0.15, 1.5, 1.0], haloSc: 2.0,
line: 'The court through the glass, lamplit, wet, with his name across it backwards and the books in the window with their backs to you. [Sam: the window]' },
{ root: doorHit, name: 'the door', pos: [0.8, 1.3, -0.2], tgt: [W / 2, 1.2, -0.2], haloAt: [W / 2 - 0.15, 1.2, -0.2], haloSc: 1.2,
line: 'The door, racing green, and the court beyond it. Not yet. [Sam: the door]' }
];
return { hotspots: hotspots, frame: function(t, dt, still) {
if (still) return;
lampLight.intensity = 1.6 + 0.03 * Math.sin(t * 1.1); lampGlow.material.opacity = 0.45 + 0.02 * Math.sin(t * 1.1);
pendLight.intensity = 1.0 + 0.03 * Math.sin(t * 0.9 + 1);
bell.rotation.x = Math.sin(t * 2.3) * 0.03 * Math.max(0, Math.sin(t * 0.2));
globe.rotation.y = t * 0.02;
for (var m = 0; m < moteN; m++) { motePos[m * 3] = moteBase[m * 3] + Math.sin(t * 0.15 + m) * 0.05; motePos[m * 3 + 1] = 0.6 + ((moteBase[m * 3 + 1] - 0.6 + (m % 2 ? 1 : -1) * t * 0.025) % 2.2 + 2.2) % 2.2; }
moteGeo.attributes.position.needsUpdate = true;
courtGlow.material.opacity = 0.22 + 0.02 * Math.sin(t * 0.6);
} };
}
});

