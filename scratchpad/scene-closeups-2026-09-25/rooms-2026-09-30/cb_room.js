// ====== INSIDE THE COACH AND HORSES — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-30. Built from what is written of the Coach and Horses at 29
// Greek Street, Norman Balon's pub: one long Victorian bar with its brass
// rail and its optics, a mirror behind, dark panelling to the dado, etched
// and frosted windows onto Greek Street and Romilly Street with the lamps
// outside them, stools, a telephone behind the bar, the gents through a
// door at the back; and from the passage: Jeffrey Bernard at the bar and,
// tall under the optics, his cow. The room sits at the top of the Coach
// and Horses bar passage (#cb-container) and is its navigation: the cow
// opens "Ride the beast" when the passage offers it, the telephone opens the
// game's own ringing modal. Bernard, the optics, the windows, the door, the
// gents and the glass on the bar are inspections, their card words pink
// placeholders for Sam. Nothing about the game is decided in JS.
window.dssRoomKit({
id: 'cb', caption: 'THE COACH AND HORSES, GREEK STREET', captionColor: 'rgba(220,180,110,0.25)',
bg: 0x080504, fog: [0x0c0805, 0.045], exposure: 0.72, bloom: { bloomStrength: 0.4, bloomRadius: 0.6, bloomThreshold: 0.68 },
env: ['#6a4a28', '#40301c', '#0a0705', '#e0b060'],
wash: 'linear-gradient(180deg,rgba(20,12,6,0.3) 0%,rgba(10,6,4,0.05) 35%,rgba(10,6,4,0.05) 60%,rgba(4,2,1,0.45) 100%)',
card: { fg: 'rgba(230,214,180,0.92)', bg: 'rgba(10,6,3,0.8)', border: 'rgba(210,170,100,0.3)', dim: 'rgba(200,180,140,0.5)', btn: 'rgba(240,220,170,0.95)', btnBorder: 'rgba(210,170,100,0.45)' },
cam: function(portrait) { return portrait ? { x: 0.2, y: 1.5, z: 3.9, tx: 0.0, ty: 1.15, tz: -2.4 } : { x: 0.4, y: 1.5, z: 2.7, tx: -0.1, ty: 1.2, tz: -2.4 }; },
build: function(k) {
var scene = k.scene, mesh = k.mesh, tex = k.tex, rnd = k.rnd, M = k.M;
var W = 8.0, D = 7.0, H = 3.4;
// ---------- THE ROOM: panelling to the dado, nicotine paint above, a tongue-and-groove ceiling, boards ----------
var wallPaint = k.paintTex('#5a4a2c', 11, 'rgba(120,80,30,0.16)');
var wallMat = new THREE.MeshStandardMaterial({ map: wallPaint, bumpMap: wallPaint, bumpScale: 0.008, roughness: 0.94 });
var panelTex = k.woodTex('#2a1a10', '#0c0604', 5); panelTex.wrapS = panelTex.wrapT = THREE.RepeatWrapping;
var boardsTex = k.woodTex('#3a2818', '#160a04', 8); boardsTex.wrapS = boardsTex.wrapT = THREE.RepeatWrapping; boardsTex.repeat.set(6, 5);
var floor = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: boardsTex, bumpMap: boardsTex, bumpScale: 0.01, roughness: 0.7, envMap: k.roomEnv, envMapIntensity: 0.25 }), 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceilTex = k.paintTex('#3a2c18', 21, 'rgba(90,60,20,0.2)');
var ceil = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.96 }), 0, H, 0); ceil.rotation.x = Math.PI / 2;
var back = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2); back.receiveShadow = true;
var front = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, D / 2); front.rotation.y = Math.PI;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2; left.receiveShadow = true;
var right = mesh(new THREE.PlaneGeometry(D, H), wallMat, W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2; right.receiveShadow = true;
function dado(len, x, z, ry) { var m = new THREE.MeshStandardMaterial({ map: panelTex.clone(), roughness: 0.55, envMap: k.roomEnv, envMapIntensity: 0.35 }); m.map.needsUpdate = true; m.map.repeat.set(len / 1.5, 1); var p = mesh(new THREE.PlaneGeometry(len, 1.1), m, x, 0.55, z); p.rotation.y = ry; var r = mesh(new THREE.BoxGeometry(len, 0.06, 0.04), M.darkWood, x, 1.12, z); r.rotation.y = ry; for (var i = 0; i < len / 0.5; i++) { var s = mesh(new THREE.BoxGeometry(0.03, 1.0, 0.02), M.darkWood, 0, 0.55, 0); s.rotation.y = ry; var off = -len / 2 + 0.25 + i * 0.5; s.position.set(x + Math.cos(ry) * off, 0.55, z - Math.sin(ry) * off); } }
dado(D, -W / 2 + 0.02, 0, Math.PI / 2); dado(D, W / 2 - 0.02, 0, -Math.PI / 2); dado(W, 0, D / 2 - 0.02, Math.PI);
var cornice = new THREE.MeshStandardMaterial({ color: 0x8a7a50, roughness: 0.9 });
[[W, 0, -D / 2 + 0.06, 0], [W, 0, D / 2 - 0.06, 0], [D, -W / 2 + 0.06, 0, Math.PI / 2], [D, W / 2 - 0.06, 0, Math.PI / 2]].forEach(function(c) { var m = mesh(new THREE.BoxGeometry(c[0], 0.12, 0.12), cornice, c[1], H - 0.06, c[2]); m.rotation.y = c[3]; });
// ---------- THE WINDOWS onto Greek Street: frosted, etched, the lamps outside ----------
var winG = new THREE.Group(); scene.add(winG);
function frostTex(seed, word) { return tex(256, 384, function(cx, w, h) { cx.fillStyle = '#c8d0c0'; cx.fillRect(0, 0, w, h); for (var i = 0; i < 9000; i++) { cx.fillStyle = i % 2 ? 'rgba(255,255,255,0.08)' : 'rgba(120,130,110,0.08)'; cx.fillRect(rnd(seed + i) * w, rnd(seed + i * 3) * h, 1.5, 1.5); } cx.strokeStyle = 'rgba(255,255,255,0.55)'; cx.lineWidth = 2; cx.strokeRect(14, 14, w - 28, h - 28); cx.beginPath(); cx.arc(w / 2, h / 2, 60, 0, 6.3); cx.stroke(); for (var a = 0; a < 8; a++) { cx.beginPath(); cx.moveTo(w / 2 + Math.cos(a) * 60, h / 2 + Math.sin(a) * 60); cx.lineTo(w / 2 + Math.cos(a) * 82, h / 2 + Math.sin(a) * 82); cx.stroke(); } cx.font = 'bold 30px Georgia,serif'; cx.textAlign = 'center'; cx.fillStyle = 'rgba(255,255,255,0.7)'; cx.save(); cx.translate(w / 2, h / 2); cx.scale(-1, 1); cx.fillText(word, 0, 11); cx.restore(); }); }
var frostMat = function(seed, word) { return new THREE.MeshStandardMaterial({ map: frostTex(seed, word), emissive: 0x9ab0a0, emissiveMap: frostTex(seed, word), emissiveIntensity: 0.28, roughness: 0.6, transparent: true, opacity: 0.92 }); };
var winLights = [];
mesh(new THREE.BoxGeometry(0.2, 2.2, 1.6), M.hidden, -W / 2 + 0.05, 1.95, -2.2, winG); mesh(new THREE.BoxGeometry(0.2, 2.2, 1.6), M.hidden, -W / 2 + 0.05, 1.95, 0.6, winG);
[[-2.2, 'ALES'], [0.6, 'STOUT']].forEach(function(wn, i) {
var g = new THREE.Group(); g.position.set(-W / 2 + 0.03, 1.95, wn[0]); g.rotation.y = Math.PI / 2; winG.add(g);
mesh(new THREE.BoxGeometry(1.5, 2.0, 0.1), M.darkWood, 0, 0, 0, g);
mesh(new THREE.PlaneGeometry(0.62, 0.86), frostMat(i * 7, wn[1]), -0.36, 0.45, 0.06, g); mesh(new THREE.PlaneGeometry(0.62, 0.86), frostMat(i * 7 + 1, ''), 0.36, 0.45, 0.06, g);
mesh(new THREE.PlaneGeometry(0.62, 0.86), frostMat(i * 7 + 2, ''), -0.36, -0.47, 0.06, g); mesh(new THREE.PlaneGeometry(0.62, 0.86), frostMat(i * 7 + 3, wn[1] === 'ALES' ? 'WINES' : 'SPIRITS'), 0.36, -0.47, 0.06, g);
mesh(new THREE.BoxGeometry(1.6, 0.08, 0.16), M.darkWood, 0, -1.02, 0.02, g);
var wl = new THREE.PointLight(0xd8e8c0, 0.55, 4.5, 1.7); wl.position.set(0, 0.2, 0.5); g.add(wl); winLights.push(wl);
k.glow(0, 0.3, 0.12, 2.2, 0.22, 0xc0d8b0, g);
});
// ---------- THE BAR along the back wall: mahogany, a brass rail, the optics, the mirror ----------
var barG = new THREE.Group(); scene.add(barG);
var barZ = -D / 2 + 1.1, barLen = 6.4;
var mahog = new THREE.MeshStandardMaterial({ map: k.grain[0], bumpMap: k.grain[0], bumpScale: 0.003, roughness: 0.45, envMap: k.roomEnv, envMapIntensity: 0.5, metalness: 0.05 });
var body = mesh(new THREE.BoxGeometry(barLen, 1.1, 0.6), mahog, 0, 0.55, barZ, barG); body.castShadow = true;
for (var pn = 0; pn < 8; pn++) { mesh(new THREE.BoxGeometry(0.62, 0.7, 0.03), M.darkWood, -barLen / 2 + 0.45 + pn * 0.79, 0.55, barZ + 0.31, barG); }
mesh(new THREE.BoxGeometry(barLen + 0.1, 0.06, 0.74), mahog, 0, 1.13, barZ, barG);
mesh(new THREE.BoxGeometry(barLen + 0.1, 0.03, 0.05), M.brass, 0, 1.17, barZ + 0.35, barG);
var rail = mesh(new THREE.CylinderGeometry(0.02, 0.02, barLen, 10), M.brass, 0, 0.22, barZ + 0.5, barG); rail.rotation.z = Math.PI / 2;
for (var rb = 0; rb < 5; rb++) mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8), M.brass, -barLen / 2 + 0.4 + rb * 1.4, 0.22, barZ + 0.42, barG).rotation.x = Math.PI / 2;
// the back-bar: shelves, the mirror, the optics on their brackets, the till, the pumps on the counter
mesh(new THREE.BoxGeometry(barLen, 1.3, 0.35), mahog, 0, 0.65, -D / 2 + 0.18, barG);
mesh(new THREE.BoxGeometry(barLen + 0.2, 0.05, 0.45), mahog, 0, 1.32, -D / 2 + 0.22, barG);
var mir = mesh(new THREE.PlaneGeometry(barLen - 0.4, 1.3), null, 0, 2.05, -D / 2 + 0.02); k.makeMirror(mir, new THREE.Vector3(0, 0, 1), k.portrait ? 512 : 1024, new THREE.Vector3(0.7, 0.66, 0.6), { edge: '0.08' });
mesh(new THREE.BoxGeometry(barLen - 0.3, 0.08, 0.1), mahog, 0, 2.74, -D / 2 + 0.05, barG); mesh(new THREE.BoxGeometry(barLen - 0.3, 0.08, 0.1), mahog, 0, 1.38, -D / 2 + 0.05, barG);
for (var col = 0; col < 4; col++) mesh(new THREE.BoxGeometry(0.08, 1.4, 0.08), mahog, -barLen / 2 + 0.2 + col * (barLen - 0.4) / 3, 2.06, -D / 2 + 0.06, barG);
// the optics: a row of inverted bottles on brass brackets, each with its measure
var botCols = [0x7a4a18, 0xa08030, 0x2a5a2a, 0xc8c0a0, 0x8a2a1a, 0x1a2a5a, 0xd0a040];
var optics = new THREE.Group(); optics.position.set(0, 1.95, -D / 2 + 0.16); scene.add(optics);
mesh(new THREE.BoxGeometry(5.6, 0.9, 0.4), M.hidden, 0, 0.2, 0, optics);
for (var o = 0; o < 9; o++) {
var bm = new THREE.MeshPhysicalMaterial({ color: botCols[o % botCols.length], roughness: 0.15, metalness: 0.04, envMap: k.roomEnv, envMapIntensity: 0.9, clearcoat: 0.9, transparent: true, opacity: 0.86 });
var ox = -2.4 + o * 0.6;
mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.34, 10), bm, ox, 0.28, 0, optics); mesh(new THREE.CylinderGeometry(0.018, 0.035, 0.12, 8), bm, ox, 0.05, 0, optics);
mesh(new THREE.PlaneGeometry(0.06, 0.16), M.paper, ox, 0.28, 0.042, optics);
mesh(new THREE.BoxGeometry(0.03, 0.03, 0.12), M.brass, ox, 0.0, -0.04, optics); mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.06, 8), M.chrome, ox, -0.05, 0, optics);
mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.6, 6), M.brass, ox, 0.24, -0.1, optics);
}
mesh(new THREE.BoxGeometry(barLen - 0.5, 0.03, 0.1), M.brass, 0, 0.5, -0.1, optics);
var optLight = new THREE.PointLight(0xffd090, 1.1, 5, 1.6); optLight.position.set(0, 2.6, -D / 2 + 0.6); scene.add(optLight);
var optGlow = k.glow(0, 2.6, -D / 2 + 0.5, 1.4, 0.3, 0xffd090);
for (var sh = 0; sh < 2; sh++) for (var b = 0; b < 10; b++) { if (rnd(sh * 30 + b) < 0.2) continue; var bh = 0.2 + rnd(b + sh * 9) * 0.1, br = 0.028; var bmat = new THREE.MeshPhysicalMaterial({ color: botCols[(b + sh * 3) % botCols.length], roughness: 0.18, envMap: k.roomEnv, envMapIntensity: 0.8, clearcoat: 0.8, transparent: true, opacity: 0.88 }); mesh(new THREE.CylinderGeometry(br, br, bh, 10), bmat, -2.6 + b * 0.55 + (rnd(b * 7 + sh) - 0.5) * 0.08, 1.35 + sh * 0.65 + bh / 2, -D / 2 + 0.2, barG); mesh(new THREE.CylinderGeometry(br * 0.35, br * 0.6, bh * 0.35, 8), bmat, -2.6 + b * 0.55 + (rnd(b * 7 + sh) - 0.5) * 0.08, 1.35 + sh * 0.65 + bh * 1.16, -D / 2 + 0.2, barG); }
mesh(new THREE.BoxGeometry(barLen - 0.6, 0.03, 0.3), M.darkWood, 0, 1.98, -D / 2 + 0.2, barG);
// beer pumps on the counter with their ceramic handles, the till, a bowl of pickled eggs, the ashtrays
for (var pm = 0; pm < 4; pm++) { var px = -1.6 + pm * 0.5; mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.34, 10), M.brass, px, 1.33, barZ - 0.1, barG); var hdl = mesh(new THREE.CylinderGeometry(0.02, 0.028, 0.26, 10), new THREE.MeshStandardMaterial({ color: [0xe8e0d0, 0x1a1a1a, 0xe8e0d0, 0x8a1a1a][pm], roughness: 0.3, envMap: k.roomEnv, envMapIntensity: 0.5 }), px, 1.6, barZ - 0.06, barG); hdl.rotation.x = 0.35; mesh(new THREE.PlaneGeometry(0.05, 0.08), M.paper, px, 1.6, barZ - 0.03, barG); }
mesh(new THREE.BoxGeometry(0.34, 0.3, 0.32), new THREE.MeshStandardMaterial({ color: 0x1a1a18, roughness: 0.4, metalness: 0.5, envMap: k.roomEnv, envMapIntensity: 0.4 }), 2.5, 1.31, -D / 2 + 0.35, barG);
mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.22, 14), new THREE.MeshPhysicalMaterial({ color: 0xe0e8d8, roughness: 0.1, transparent: true, opacity: 0.5, envMap: k.roomEnv, envMapIntensity: 1, clearcoat: 1 }), 1.7, 1.27, barZ - 0.1, barG);
for (var eg = 0; eg < 5; eg++) mesh(new THREE.SphereGeometry(0.03, 8, 6), new THREE.MeshStandardMaterial({ color: 0xd8c8a0, roughness: 0.6 }), 1.7 + (rnd(eg) - 0.5) * 0.1, 1.2 + eg * 0.03, barZ - 0.1 + (rnd(eg + 3) - 0.5) * 0.1, barG);
var ashMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.3, metalness: 0.2, envMap: k.roomEnv, envMapIntensity: 0.4 });
[-2.4, -0.4, 1.2].forEach(function(ax) { mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.016, 14), ashMat, ax, 1.17, barZ + 0.1, barG); });
// the till roll of the night's tab and a bar towel
mesh(new THREE.BoxGeometry(0.34, 0.012, 0.22), new THREE.MeshStandardMaterial({ color: 0x1a3a6a, roughness: 0.98 }), 0.5, 1.166, barZ + 0.05, barG);
// the barman, a trace behind the pumps, not looking at you
var barman = k.ghost(-0.9, 0, -D / 2 + 0.6, 11, 0.2, false, false, 1.0);
// ---------- THE TELEPHONE behind the bar, at the far end ----------
var phoneG = new THREE.Group(); phoneG.position.set(-2.95, 1.335, -D / 2 + 0.3); phoneG.rotation.y = 0.5; scene.add(phoneG);
mesh(new THREE.BoxGeometry(0.2, 0.09, 0.17), M.bakelite, 0, 0.045, 0, phoneG);
mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.02, 20), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.5 }), 0.02, 0.1, 0.03, phoneG);
var hs = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.2, 10), M.bakelite, 0, 0.14, -0.02, phoneG); hs.rotation.z = Math.PI / 2;
mesh(new THREE.SphereGeometry(0.032, 10, 8), M.bakelite, -0.1, 0.13, -0.02, phoneG); mesh(new THREE.SphereGeometry(0.032, 10, 8), M.bakelite, 0.1, 0.13, -0.02, phoneG);
var phoneHit = mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), M.hidden, 0, 0.15, 0, phoneG);
// ---------- THE STOOLS, and JEFFREY BERNARD on his, and THE COW tall under the optics ----------
var leatherMat = new THREE.MeshStandardMaterial({ color: 0x5a1a14, roughness: 0.7, envMap: k.roomEnv, envMapIntensity: 0.2 });
function stool(x, z) { var g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g); mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.07, 16), leatherMat, 0, 0.72, 0, g); mesh(new THREE.TorusGeometry(0.18, 0.012, 6, 24), M.brass, 0, 0.69, 0, g).rotation.x = Math.PI / 2; mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.66, 8), M.darkWood, 0, 0.35, 0, g); mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.03, 16), M.darkWood, 0, 0.02, 0, g); [0, 1, 2].forEach(function(l) { var lg = mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.62, 6), M.darkWood, Math.cos(l * 2.09) * 0.13, 0.33, Math.sin(l * 2.09) * 0.13, g); lg.rotation.z = -Math.cos(l * 2.09) * 0.25; lg.rotation.x = Math.sin(l * 2.09) * 0.25; }); return g; }
[-2.4, -1.5, 0.9, 1.9, 2.8].forEach(function(sx) { stool(sx, barZ + 0.85); });
var bernardStool = stool(-0.3, barZ + 0.85);
var bernard = k.ghost(-0.3, 0.3, barZ + 0.9, 13, 0.52, true, true, 1.05);          // Jeffrey Bernard, unwell, on his stool
// his glass, a large one, and the betting slip half under its wet ring
var vodkaMat = new THREE.MeshStandardMaterial({ color: 0xe8e8e0, roughness: 0.05, transparent: true, opacity: 0.35, envMap: k.roomEnv, envMapIntensity: 1 });
var glassG = new THREE.Group(); glassG.position.set(0.45, 1.165, barZ + 0.2); scene.add(glassG);
mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.11, 14, 1, true), M.glass.clone(), 0, 0.055, 0, glassG).material.side = THREE.DoubleSide;
mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.05, 14), vodkaMat, 0, 0.03, 0, glassG);
mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.02, 6), new THREE.MeshStandardMaterial({ color: 0xe8e0c0, roughness: 0.6 }), 0.01, 0.06, 0.005, glassG);
var slip = mesh(new THREE.PlaneGeometry(0.09, 0.06), new THREE.MeshStandardMaterial({ color: 0xe8e0c8, roughness: 0.95 }), 0.04, 0.002, 0.03, glassG); slip.rotation.x = -Math.PI / 2; slip.rotation.z = 0.4;
mesh(new THREE.TorusGeometry(0.032, 0.004, 6, 20), new THREE.MeshStandardMaterial({ color: 0x8a7a50, roughness: 0.4, transparent: true, opacity: 0.4 }), 0, 0.001, 0, glassG).rotation.x = Math.PI / 2;
var glassHit = mesh(new THREE.BoxGeometry(0.24, 0.2, 0.2), M.hidden, 0, 0.08, 0, glassG);
// the cow: Friesian, tall, standing behind the bar under the optics, breathing
var cowG = new THREE.Group(); cowG.position.set(1.2, 0, -D / 2 + 0.75); cowG.rotation.y = -0.35; scene.add(cowG);
var hideTex = tex(256, 256, function(cx, w, h) { cx.fillStyle = '#e8e4dc'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#141210'; for (var i = 0; i < 9; i++) { cx.beginPath(); var x = rnd(i * 3) * w, y = rnd(i * 5) * h; cx.moveTo(x, y); for (var a = 0; a < 7; a++) { var r = 22 + rnd(i * 7 + a) * 34; cx.lineTo(x + Math.cos(a * 0.9) * r, y + Math.sin(a * 0.9) * r); } cx.closePath(); cx.fill(); } for (var i = 0; i < 4000; i++) { cx.fillStyle = 'rgba(0,0,0,0.06)'; cx.fillRect(rnd(i) * w, rnd(i * 3) * h, 1, 2); } });
var hide = new THREE.MeshStandardMaterial({ map: hideTex, roughness: 0.9 });
var cowBody = mesh(new THREE.BoxGeometry(0.7, 0.75, 1.5), hide, 0, 1.25, 0, cowG); cowBody.castShadow = true;
mesh(new THREE.BoxGeometry(0.62, 0.3, 0.9), hide, 0, 0.75, -0.1, cowG);
mesh(new THREE.BoxGeometry(0.36, 0.5, 0.45), hide, 0, 1.5, 0.95, cowG);
var cowHead = mesh(new THREE.BoxGeometry(0.3, 0.4, 0.5), hide, 0, 1.3, 1.3, cowG);
mesh(new THREE.BoxGeometry(0.26, 0.16, 0.12), new THREE.MeshStandardMaterial({ color: 0xc8a090, roughness: 0.7 }), 0, 1.16, 1.55, cowG);
[-0.13, 0.13].forEach(function(ex) { mesh(new THREE.SphereGeometry(0.03, 8, 6), M.black, ex, 1.42, 1.5, cowG); mesh(new THREE.BoxGeometry(0.06, 0.12, 0.04), hide, ex * 1.6, 1.5, 1.2, cowG).rotation.z = ex * 4; var horn = mesh(new THREE.ConeGeometry(0.025, 0.16, 8), new THREE.MeshStandardMaterial({ color: 0xd8d0b8, roughness: 0.5 }), ex * 1.3, 1.6, 1.18, cowG); horn.rotation.z = -ex * 3; });
[[-0.22, -0.55], [0.22, -0.55], [-0.22, 0.5], [0.22, 0.5]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.9, 8), hide, l[0], 0.45, l[1], cowG); mesh(new THREE.CylinderGeometry(0.065, 0.07, 0.06, 8), M.black, l[0], 0.03, l[1], cowG); });
var tail = mesh(new THREE.CylinderGeometry(0.02, 0.012, 0.7, 6), hide, 0, 1.25, -0.8, cowG); tail.rotation.x = 0.3;
var udder = mesh(new THREE.SphereGeometry(0.16, 10, 8), new THREE.MeshStandardMaterial({ color: 0xd8a898, roughness: 0.7 }), 0, 0.68, 0.1, cowG);
// the bridle, since you will take it
mesh(new THREE.TorusGeometry(0.2, 0.012, 6, 20), new THREE.MeshStandardMaterial({ color: 0x3a2a18, roughness: 0.8 }), 0, 1.3, 1.36, cowG).rotation.x = 0.1;
var bell = mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.05, 8), M.brass, 0, 1.06, 1.42, cowG);
k.contact(1.2, 0, -D / 2 + 0.75, 2.4);
// ---------- THE DOOR to Greek Street, front left, and THE GENTS through the door at the back right ----------
var doorG = new THREE.Group(); doorG.position.set(-W / 2 + 0.03, 0, -0.75); doorG.rotation.y = Math.PI / 2; scene.add(doorG);
mesh(new THREE.BoxGeometry(0.95, 2.2, 0.06), M.darkWood, 0, 1.1, 0, doorG);
mesh(new THREE.PlaneGeometry(0.5, 0.8), frostMat(30, 'BAR'), 0, 1.55, 0.035, doorG);
mesh(new THREE.BoxGeometry(1.1, 0.1, 0.12), mahog, 0, 2.25, 0, doorG); mesh(new THREE.BoxGeometry(0.08, 2.3, 0.12), mahog, -0.55, 1.15, 0, doorG); mesh(new THREE.BoxGeometry(0.08, 2.3, 0.12), mahog, 0.55, 1.15, 0, doorG);
mesh(new THREE.BoxGeometry(0.3, 0.12, 0.04), M.brass, 0.15, 1.02, 0.04, doorG); mesh(new THREE.BoxGeometry(0.4, 0.5, 0.02), M.brass, 0, 0.5, 0.035, doorG);
var doorLight = new THREE.PointLight(0xc0d8b0, 0.4, 3, 1.8); doorLight.position.set(-W / 2 + 0.4, 1.6, -0.75); scene.add(doorLight);
var doorHit = mesh(new THREE.BoxGeometry(1.2, 2.5, 0.5), M.hidden, 0, 1.2, 0.15, doorG);
var gentsG = new THREE.Group(); gentsG.position.set(W / 2 - 0.03, 0, -1.6); gentsG.rotation.y = -Math.PI / 2; scene.add(gentsG);
mesh(new THREE.BoxGeometry(0.85, 2.1, 0.06), new THREE.MeshStandardMaterial({ color: 0x3a3a30, roughness: 0.85 }), 0, 1.05, 0, gentsG);
mesh(new THREE.BoxGeometry(1.0, 0.1, 0.12), M.darkWood, 0, 2.15, 0, gentsG); mesh(new THREE.BoxGeometry(0.08, 2.2, 0.12), M.darkWood, -0.5, 1.1, 0, gentsG); mesh(new THREE.BoxGeometry(0.08, 2.2, 0.12), M.darkWood, 0.5, 1.1, 0, gentsG);
var gentsTex = tex(128, 64, function(cx, w, h) { cx.fillStyle = '#2a2a24'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#c8c0a8'; cx.font = 'bold 26px Georgia,serif'; cx.textAlign = 'center'; cx.fillText('GENTS', w / 2, 42); });
mesh(new THREE.PlaneGeometry(0.4, 0.2), new THREE.MeshStandardMaterial({ map: gentsTex, roughness: 0.8 }), 0, 1.7, 0.035, gentsG);
mesh(new THREE.SphereGeometry(0.035, 8, 6), M.brass, 0.3, 1.0, 0.05, gentsG);
var gentsLight = new THREE.PointLight(0xa0c0b0, 0.3, 2.5, 2); gentsLight.position.set(W / 2 - 0.4, 2.0, -1.6); scene.add(gentsLight);
var gentsHit = mesh(new THREE.BoxGeometry(1.1, 2.4, 0.5), M.hidden, 0, 1.15, 0.15, gentsG);
// ---------- TABLES along the window wall, a fruit machine, the light ----------
function table(x, z, seed) { var g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g); mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.03, 20), new THREE.MeshStandardMaterial({ color: 0x8a1a1a, roughness: 0.4, envMap: k.roomEnv, envMapIntensity: 0.4 }), 0, 0.72, 0, g); mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.7, 8), new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 0.4, metalness: 0.5 }), 0, 0.36, 0, g); mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 16), M.black, 0, 0.02, 0, g); if (rnd(seed) < 0.7) { mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.12, 12), M.glass, 0.1, 0.8, 0.05, g); } mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.016, 14), ashMat, -0.12, 0.745, -0.1, g); [[-0.5, 0], [0, 0.5]].forEach(function(c) { var ch = new THREE.Group(); ch.position.set(c[0], 0, c[1]); ch.rotation.y = c[0] ? Math.PI / 2 : Math.PI; g.add(ch); mesh(new THREE.BoxGeometry(0.4, 0.05, 0.4), leatherMat, 0, 0.46, 0, ch); mesh(new THREE.BoxGeometry(0.4, 0.4, 0.04), M.darkWood, 0, 0.7, -0.18, ch); [[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].forEach(function(lg) { mesh(new THREE.CylinderGeometry(0.015, 0.018, 0.44, 6), M.darkWood, lg[0], 0.22, lg[1], ch); }); }); k.contact(x, 0, z, 1.3); return g; }
table(-2.9, -1.0, 1); table(-2.9, 0.9, 2); table(-2.7, 2.6, 3); table(2.6, 1.4, 4);
var machine = mesh(new THREE.BoxGeometry(0.6, 1.7, 0.5), new THREE.MeshStandardMaterial({ color: 0x2a1a30, roughness: 0.4, metalness: 0.3, envMap: k.roomEnv, envMapIntensity: 0.5 }), W / 2 - 0.35, 0.85, 1.8); machine.rotation.y = -Math.PI / 2;
var machTex = tex(128, 192, function(cx, w, h) { cx.fillStyle = '#100810'; cx.fillRect(0, 0, w, h); ['#ff4040', '#ffd040', '#40c0ff'].forEach(function(c, i) { cx.fillStyle = c; cx.fillRect(14, 20 + i * 50, 100, 30); }); cx.fillStyle = '#000'; for (var i = 0; i < 3; i++) cx.fillRect(20 + i * 32, 130, 26, 40); cx.fillStyle = '#ffe080'; cx.font = 'bold 22px Arial'; cx.textAlign = 'center'; ['7', '£', '7'].forEach(function(t, i) { cx.fillText(t, 33 + i * 32, 158); }); });
var machFace = mesh(new THREE.PlaneGeometry(0.5, 1.2), new THREE.MeshBasicMaterial({ map: machTex, toneMapped: false }), W / 2 - 0.61, 1.0, 1.8); machFace.rotation.y = -Math.PI / 2;
var machLight = new THREE.PointLight(0xff80a0, 0.5, 2.5, 2); machLight.position.set(W / 2 - 0.9, 1.2, 1.8); scene.add(machLight);
// the lights: three pendants with cream shades over the bar, one over the tables, and the glow of the place
var pendants = [];
[[-2.0, barZ + 0.6], [0.2, barZ + 0.6], [2.2, barZ + 0.6], [-2.9, 1.0]].forEach(function(pp, i) { var g = new THREE.Group(); g.position.set(pp[0], H, pp[1]); scene.add(g); mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.9, 6), M.black, 0, -0.45, 0, g); var sh = mesh(new THREE.ConeGeometry(0.22, 0.2, 18, 1, true), new THREE.MeshStandardMaterial({ color: 0xe8dcc0, roughness: 0.8, side: THREE.DoubleSide, emissive: 0xffe0a0, emissiveIntensity: 0.25 }), 0, -0.95, 0, g); mesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfff0c8, toneMapped: false }), 0, -1.0, 0, g); var l = new THREE.PointLight(0xffd8a0, i === 3 ? 0.8 : 1.0, 5.5, 1.6); l.position.set(0, -1.05, 0); g.add(l); if (i === 1) { l.castShadow = true; l.shadow.mapSize.set(512, 512); l.shadow.bias = -0.002; } pendants.push({ l: l, g: k.glow(0, -1.0, 0, 0.9, 0.5, 0xffe0b0, g) }); });
scene.add(new THREE.AmbientLight(0x4a3018, 0.6));
scene.add(new THREE.HemisphereLight(0x7a5a30, 0x100804, 0.4));
// the smoke of the place, kept low, and the dust over the bar
var hazeTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(220,190,150,0.2)'); g.addColorStop(0.4, 'rgba(170,130,90,0.1)'); g.addColorStop(1, 'rgba(100,70,40,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var haze = [[0, 2.2, barZ + 0.6, 4.5, 2.0], [-2.6, 2.0, 0.5, 2.4, 1.6]].map(function(p) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTex, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending })); sp.position.set(p[0], p[1], p[2]); sp.scale.set(p[3], p[4], 1); scene.add(sp); return sp; });
// a couple of the regulars, traces at the tables, and the one at the far end of the bar
k.ghost(-2.9, 0, -1.5, 17, 0.14, true, false); k.ghost(2.6, 0, 1.9, 19, 0.12, true, false); k.ghost(2.8, 0.3, barZ + 0.9, 23, 0.16, true, false);
// ---------- THE CLOSE-UPS ----------
var hotspots = [
{ root: cowG, name: 'the cow', pos: [0.4, 1.6, -0.6], tgt: [1.2, 1.0, -D / 2 + 0.9], haloAt: [1.1, 1.3, -D / 2 + 1.0], haloSc: 1.8,
actions: function() { return k.byText(['Ride the beast']); },
line: 'Tall under the optics, black and white, and breathing, which the optics are not. She has a bridle on, and a bell, and no opinion of you at all. [Sam: the cow when she is not for riding]' },
{ root: bernard.hit, name: 'Jeffrey Bernard', pos: [0.4, 1.5, 0.3], tgt: [-0.3, 0.7, barZ + 0.9], haloAt: [-0.3, 1.2, barZ + 0.9], haloSc: 1.0,
line: 'On his stool, which is his the way the pub is his, with his eyes hefted up at the optics and nothing else moving. Unwell, as the paper says. [Sam: Jeffrey Bernard]' },
{ root: glassHit, name: 'his glass', pos: [0.6, 1.55, barZ + 1.2], tgt: [0.45, 1.18, barZ + 0.2], haloAt: [0.45, 1.25, barZ + 0.2], haloSc: 0.5,
line: 'A large vodka with a lime in it, and a wet ring, and under the wet ring a betting slip with a horse\'s name half gone. [Sam: the glass and the slip]' },
{ root: optics, name: 'the optics', pos: [0.2, 1.7, -0.5], tgt: [0.2, 2.2, -D / 2 + 0.2], haloAt: [0.2, 2.2, -D / 2 + 0.3], haloSc: 2.4,
line: 'Upside down in a row and lit from beneath, every one a quarter gill from you and every one of them the same colour as the wallpaper by now. [Sam: the optics]' },
{ root: phoneHit, name: 'the telephone', pos: [-1.6, 1.6, -0.6], tgt: [-2.95, 1.45, -D / 2 + 0.3], haloAt: [-2.95, 1.5, -D / 2 + 0.3], haloSc: 0.5,
actions: function() { return k.passageLinks('.phone-ringing tw-link'); }, prose: function() { return k.modalProse(); },
line: 'The telephone behind the bar, at the end where the barman can pretend not to hear it. It is not ringing. That is not the same as quiet. [Sam: the phone when it is quiet]' },
{ root: winG, name: 'the windows', pos: [-1.6, 1.7, -0.6], tgt: [-W / 2, 1.9, -2.2], haloAt: [-W / 2 + 0.15, 1.9, -2.2], haloSc: 2.2,
line: 'Frosted and etched, ALES and STOUT and WINES backwards, and the lamp on Greek Street coming through them like the day never does. [Sam: the windows]' },
{ root: doorHit, name: 'the door', pos: [-2.2, 1.5, 0.3], tgt: [-W / 2, 1.3, -0.75], haloAt: [-W / 2 + 0.15, 1.3, -0.75], haloSc: 1.3,
line: 'The door to Greek Street. He said to find your own way out, and this is a way, and it is out. [Sam: the door]' },
{ root: gentsHit, name: 'the gents', pos: [2.2, 1.5, -0.4], tgt: [W / 2, 1.2, -1.6], haloAt: [W / 2 - 0.15, 1.2, -1.6], haloSc: 1.3,
line: 'The door you came out of, with the smell coming out of it after you. GENTS. You know the tiles in there better than you know most people. [Sam: the gents]' }
];
var breath = 0;
return { hotspots: hotspots, frame: function(t, dt, still) {
if (still) return;
breath = Math.sin(t * 0.7); cowBody.scale.set(1 + breath * 0.012, 1 + breath * 0.02, 1); cowHead.rotation.x = Math.sin(t * 0.31) * 0.05; tail.rotation.z = Math.sin(t * 1.3) * 0.25;
for (var i = 0; i < pendants.length; i++) { var f = 0.05 * Math.sin(t * (1.1 + i * 0.3) + i); pendants[i].l.intensity = (i === 3 ? 0.8 : 1.0) + f; pendants[i].g.material.opacity = 0.5 + f; }
for (var w = 0; w < winLights.length; w++) winLights[w].intensity = 0.9 + 0.04 * Math.sin(t * 0.6 + w * 2);
machLight.intensity = 0.5 + 0.2 * (Math.sin(t * 3.1) > 0.6 ? 1 : 0); machFace.material.opacity = 1;
haze[0].material.opacity = 0.12 + 0.03 * Math.sin(t * 0.27); haze[1].material.opacity = 0.1 + 0.03 * Math.sin(t * 0.33 + 1);
optGlow.material.opacity = 0.3 + 0.02 * Math.sin(t * 0.8);
} };
}
});

