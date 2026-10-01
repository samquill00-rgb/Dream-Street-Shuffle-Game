// ====== INSIDE LACKLAND'S OFFICE — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-30. Built from what the passage says of Martin Lackland's rooms
// up two doglegs on Frith Street: an agent's office, a desk with a green
// blotter and a dish of paperclips, manuscripts in their piles, the
// Garrard 401 screwed into the wall with its SME arm, the record found at
// Dobell's, his glass sunk and topped up, a window over Frith Street, and
// the door at the back you had not seen before. The room sits at the top
// of the Martin Lackland's Office passage (#lk-container) and is its
// navigation: the turntable opens the passage's own lore link, the door at
// the back opens Linger. Lackland, the manuscript, the window, the drinks
// and the dish are inspections, their card words pink placeholders for Sam.
// Nothing about the game is decided in JS.
window.dssRoomKit({
id: 'lk', caption: 'M. LACKLAND, FRITH STREET, TWO FLOORS UP', captionColor: 'rgba(200,180,140,0.25)',
bg: 0x080604, fog: [0x0c0906, 0.05], exposure: 0.74, bloom: { bloomStrength: 0.36, bloomRadius: 0.6, bloomThreshold: 0.7 },
env: ['#5a4a30', '#3a2e1c', '#0a0806', '#e0c080'],
wash: 'linear-gradient(180deg,rgba(16,12,6,0.3) 0%,rgba(8,6,4,0.05) 35%,rgba(8,6,4,0.05) 60%,rgba(3,2,1,0.45) 100%)',
card: { fg: 'rgba(228,216,190,0.92)', bg: 'rgba(10,7,4,0.82)', border: 'rgba(200,170,110,0.3)', dim: 'rgba(200,185,150,0.5)', btn: 'rgba(240,225,185,0.95)', btnBorder: 'rgba(200,170,110,0.45)' },
cam: function(portrait) { return portrait ? { x: 0.3, y: 1.5, z: 3.3, tx: -0.2, ty: 1.1, tz: -1.6 } : { x: 0.5, y: 1.5, z: 2.4, tx: -0.2, ty: 1.15, tz: -1.6 }; },
build: function(k) {
var scene = k.scene, mesh = k.mesh, tex = k.tex, rnd = k.rnd, M = k.M;
var W = 5.6, D = 6.0, H = 3.0;
// ---------- THE ROOM: distempered walls, a picture rail, boards under a Turkey rug, a plaster rose ----------
var wallPaint = k.paintTex('#6a5a3c', 41, 'rgba(140,100,40,0.14)');
var wallMat = new THREE.MeshStandardMaterial({ map: wallPaint, bumpMap: wallPaint, bumpScale: 0.008, roughness: 0.95 });
var boardsTex = k.woodTex('#3a2a1a', '#160c06', 12); boardsTex.wrapS = boardsTex.wrapT = THREE.RepeatWrapping; boardsTex.repeat.set(5, 5);
var floor = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: boardsTex, bumpMap: boardsTex, bumpScale: 0.01, roughness: 0.6, envMap: k.roomEnv, envMapIntensity: 0.3 }), 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceil = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: k.paintTex('#d8d0b8', 43, 'rgba(120,100,60,0.12)'), roughness: 1 }), 0, H, 0); ceil.rotation.x = Math.PI / 2;
mesh(new THREE.TorusGeometry(0.28, 0.03, 8, 32), new THREE.MeshStandardMaterial({ color: 0xd0c8b0, roughness: 0.9 }), 0, H - 0.02, -0.4).rotation.x = Math.PI / 2;
var back = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2); back.receiveShadow = true;
var front = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, D / 2); front.rotation.y = Math.PI;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2; left.receiveShadow = true;
var right = mesh(new THREE.PlaneGeometry(D, H), wallMat, W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2; right.receiveShadow = true;
var railMat = new THREE.MeshStandardMaterial({ color: 0x9a8a60, roughness: 0.9 });
[[W, 0, -D / 2 + 0.03, 0], [W, 0, D / 2 - 0.03, 0], [D, -W / 2 + 0.03, 0, Math.PI / 2], [D, W / 2 - 0.03, 0, Math.PI / 2]].forEach(function(c) { var m = mesh(new THREE.BoxGeometry(c[0], 0.05, 0.06), railMat, c[1], 2.3, c[2]); m.rotation.y = c[3]; var sk = mesh(new THREE.BoxGeometry(c[0], 0.16, 0.05), M.darkWood, c[1], 0.08, c[2]); sk.rotation.y = c[3]; });
var rugTex = tex(512, 512, function(cx, w, h) { cx.fillStyle = '#5a2020'; cx.fillRect(0, 0, w, h); cx.strokeStyle = '#2a1010'; cx.lineWidth = 16; cx.strokeRect(12, 12, w - 24, h - 24); cx.strokeStyle = '#a08040'; cx.lineWidth = 4; cx.strokeRect(30, 30, w - 60, h - 60); cx.fillStyle = '#1a3a4a'; cx.save(); cx.translate(w / 2, h / 2); cx.rotate(Math.PI / 4); cx.fillRect(-80, -80, 160, 160); cx.fillStyle = '#a08040'; cx.fillRect(-50, -50, 100, 100); cx.fillStyle = '#5a2020'; cx.fillRect(-24, -24, 48, 48); cx.restore(); for (var i = 0; i < 60; i++) { cx.fillStyle = 'rgba(20,10,5,' + (rnd(i) * 0.14) + ')'; cx.fillRect(rnd(i * 3) * w, rnd(i * 5) * h, rnd(i * 7) * 30 + 5, rnd(i * 9) * 30 + 5); } for (var i = 0; i < 12000; i++) { cx.fillStyle = i % 2 ? 'rgba(0,0,0,0.08)' : 'rgba(255,220,180,0.05)'; cx.fillRect(rnd(i * 11) * w, rnd(i * 13) * h, 1, 1.5); } });
var rug = mesh(new THREE.PlaneGeometry(3.2, 2.6), new THREE.MeshStandardMaterial({ map: rugTex, roughness: 0.95 }), -0.2, 0.004, -0.6); rug.rotation.x = -Math.PI / 2; rug.receiveShadow = true;
// ---------- THE DESK, and LACKLAND behind it ----------
var deskG = new THREE.Group(); deskG.position.set(-0.3, 0, -1.7); scene.add(deskG);
var deskMat = new THREE.MeshStandardMaterial({ map: k.grain[0], bumpMap: k.grain[0], bumpScale: 0.003, roughness: 0.45, envMap: k.roomEnv, envMapIntensity: 0.4 });
var deskTop = mesh(new THREE.BoxGeometry(2.0, 0.05, 0.95), deskMat, 0, 0.76, 0, deskG); deskTop.castShadow = true; deskTop.receiveShadow = true;
[[-0.8, 0], [0.8, 0]].forEach(function(p) { var ped = mesh(new THREE.BoxGeometry(0.42, 0.72, 0.85), deskMat, p[0], 0.37, p[1], deskG); ped.castShadow = true; for (var d = 0; d < 3; d++) { mesh(new THREE.BoxGeometry(0.36, 0.2, 0.02), M.darkWood, p[0], 0.15 + d * 0.23, 0.435, deskG); mesh(new THREE.BoxGeometry(0.08, 0.02, 0.02), M.brass, p[0], 0.15 + d * 0.23, 0.45, deskG); } });
var blotter = mesh(new THREE.BoxGeometry(0.7, 0.012, 0.48), new THREE.MeshStandardMaterial({ color: 0x1a4a2a, roughness: 0.98 }), 0.05, 0.79, 0.05, deskG);
mesh(new THREE.BoxGeometry(0.74, 0.006, 0.06), M.darkWood, 0.05, 0.797, -0.19, deskG); mesh(new THREE.BoxGeometry(0.74, 0.006, 0.06), M.darkWood, 0.05, 0.797, 0.29, deskG);
// the lamp, green glass, on its brass stem
mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.02, 16), M.brass, -0.7, 0.8, -0.25, deskG); mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.36, 8), M.brass, -0.7, 0.98, -0.25, deskG);
var lampShade = mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.34, 16, 1, true, Math.PI, Math.PI), new THREE.MeshPhysicalMaterial({ color: 0x1a5a30, roughness: 0.4, emissive: 0x0e3a1e, emissiveIntensity: 0.6, side: THREE.DoubleSide, transparent: true, opacity: 0.92 }), -0.7, 1.16, -0.2, deskG); lampShade.rotation.set(Math.PI / 2, 0, Math.PI / 2);
mesh(new THREE.SphereGeometry(0.03, 8, 6), new THREE.MeshBasicMaterial({ color: 0xfff0c8, toneMapped: false }), -0.7, 1.12, -0.2, deskG);
var deskLight = new THREE.PointLight(0xffe0a0, 1.5, 4.5, 1.6); deskLight.position.set(-0.7, 1.1, -0.15); deskLight.castShadow = true; deskLight.shadow.mapSize.set(512, 512); deskLight.shadow.bias = -0.002; deskG.add(deskLight);
var deskGlow = k.glow(-0.7, 1.12, -0.18, 0.7, 0.45, 0xffe0a0, deskG);
// your book, laid down; his glass, sunk and topped up; the dish with paperclips and one blue glass eye
var msMat = new THREE.MeshStandardMaterial({ color: 0xe8e0cc, roughness: 0.95 });
var manuscript = mesh(new THREE.BoxGeometry(0.22, 0.03, 0.3), msMat, 0.1, 0.81, 0.02, deskG); manuscript.rotation.y = -0.08;
mesh(new THREE.PlaneGeometry(0.2, 0.28), new THREE.MeshStandardMaterial({ map: tex(128, 180, function(cx, w, h) { cx.fillStyle = '#ece4d0'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#2a2420'; for (var l = 0; l < 22; l++) { cx.fillRect(14, 30 + l * 6, 20 + rnd(l * 3) * 80, 1.2); } cx.fillStyle = '#4a1a1a'; cx.font = '8px Georgia,serif'; cx.fillText('1', 60, 172); }), roughness: 0.95 }), 0.1, 0.826, 0.02, deskG).rotation.set(-Math.PI / 2, 0, -0.08);
var msHit = mesh(new THREE.BoxGeometry(0.34, 0.16, 0.4), M.hidden, 0.1, 0.85, 0.02, deskG);
var whisky = new THREE.MeshStandardMaterial({ color: 0xc27a18, roughness: 0.1, transparent: true, opacity: 0.7, emissive: 0x5a3000, emissiveIntensity: 0.35 });
var glassG = new THREE.Group(); glassG.position.set(0.7, 0.785, 0.25); deskG.add(glassG);
mesh(new THREE.CylinderGeometry(0.034, 0.03, 0.09, 14, 1, true), M.glass.clone(), 0, 0.045, 0, glassG).material.side = THREE.DoubleSide; mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.006, 14), M.glass, 0, 0.003, 0, glassG);
var whiskyLevel = mesh(new THREE.CylinderGeometry(0.029, 0.028, 0.055, 14), whisky, 0, 0.033, 0, glassG);
var decanter = new THREE.Group(); decanter.position.set(0.55, 0.785, -0.25); deskG.add(decanter);
mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.16, 12), new THREE.MeshPhysicalMaterial({ color: 0xd8b060, roughness: 0.1, transparent: true, opacity: 0.7, envMap: k.roomEnv, envMapIntensity: 1, clearcoat: 1 }), 0, 0.08, 0, decanter); mesh(new THREE.CylinderGeometry(0.02, 0.035, 0.1, 10), M.glass, 0, 0.2, 0, decanter); mesh(new THREE.SphereGeometry(0.03, 8, 6), M.glass, 0, 0.27, 0, decanter);
var drinksHit = mesh(new THREE.BoxGeometry(0.4, 0.4, 0.7), M.hidden, 0.62, 0.95, 0.0, deskG);
var dishG = new THREE.Group(); dishG.position.set(-0.35, 0.785, 0.3); deskG.add(dishG);
mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.025, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.5, side: THREE.DoubleSide }), 0, 0.012, 0, dishG); mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.004, 16), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.5 }), 0, 0.002, 0, dishG);
for (var pc = 0; pc < 7; pc++) mesh(new THREE.TorusGeometry(0.008, 0.0015, 4, 8), M.chrome, (rnd(pc) - 0.5) * 0.07, 0.008, (rnd(pc + 5) - 0.5) * 0.07, dishG).rotation.x = Math.PI / 2 + rnd(pc * 3);
var eye = mesh(new THREE.SphereGeometry(0.014, 10, 8), new THREE.MeshPhysicalMaterial({ color: 0xf0f0e8, roughness: 0.1, clearcoat: 1, envMap: k.roomEnv, envMapIntensity: 1 }), 0.01, 0.018, -0.01, dishG);
mesh(new THREE.CircleGeometry(0.007, 10), new THREE.MeshStandardMaterial({ color: 0x3060c0, roughness: 0.3 }), 0.01, 0.024, 0.002, dishG).rotation.x = -Math.PI / 2 + 0.6;
var dishHit = mesh(new THREE.BoxGeometry(0.2, 0.14, 0.2), M.hidden, 0, 0.05, 0, dishG);
// a typewriter, more manuscripts, a telephone, an ashtray, the day's post
mesh(new THREE.BoxGeometry(0.34, 0.14, 0.3), new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.35, metalness: 0.3, envMap: k.roomEnv, envMapIntensity: 0.4 }), -0.55, 0.85, 0.15, deskG); for (var tk = 0; tk < 12; tk++) mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.01, 8), new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.5 }), -0.68 + (tk % 4) * 0.06 + (tk > 7 ? 0.02 : 0), 0.925 - Math.floor(tk / 4) * 0.015, 0.2 + Math.floor(tk / 4) * 0.04, deskG);
[[0.72, 0.09, -0.02], [0.78, 0.05, 0.05]].forEach(function(p, i) { mesh(new THREE.BoxGeometry(0.22, p[1], 0.3), msMat, p[0], 0.785 + p[1] / 2 + (i ? 0.09 : 0), -0.12 + p[2], deskG).rotation.y = (rnd(i) - 0.5) * 0.3; });
mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.016, 14), new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.3, metalness: 0.2 }), -0.15, 0.795, 0.32, deskG);
// his chair, and him in it, turned to the desk with both his elbows
var chairG = new THREE.Group(); chairG.position.set(-0.3, 0, -2.4); scene.add(chairG);
var leather = new THREE.MeshStandardMaterial({ color: 0x3a1a10, roughness: 0.5, envMap: k.roomEnv, envMapIntensity: 0.3 });
mesh(new THREE.BoxGeometry(0.55, 0.1, 0.55), leather, 0, 0.5, 0, chairG); mesh(new THREE.BoxGeometry(0.55, 0.6, 0.1), leather, 0, 0.85, -0.25, chairG); [[-0.25, 0], [0.25, 0]].forEach(function(a) { mesh(new THREE.BoxGeometry(0.06, 0.25, 0.5), leather, a[0], 0.65, 0, chairG); }); mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8), M.chrome, 0, 0.23, 0, chairG); for (var lg = 0; lg < 5; lg++) { var leg = mesh(new THREE.BoxGeometry(0.02, 0.02, 0.3), M.chrome, Math.cos(lg * 1.257) * 0.14, 0.02, Math.sin(lg * 1.257) * 0.14, chairG); leg.rotation.y = -lg * 1.257 + Math.PI / 2; }
var lackland = k.ghost(-0.3, 0.1, -2.35, 31, 0.5, true, true, 1.05);
// ---------- THE GARRARD 401 screwed into the wall, the SME arm, the record going round, the shelf of records ----------
var ttG = new THREE.Group(); ttG.position.set(W / 2 - 0.35, 1.1, -1.0); ttG.rotation.y = -Math.PI / 2; scene.add(ttG);
mesh(new THREE.BoxGeometry(0.7, 0.1, 0.5), M.shelfWood, 0, 0, 0, ttG); [[-0.3, 0.2], [0.3, 0.2]].forEach(function(b) { mesh(new THREE.BoxGeometry(0.05, 0.3, 0.05), M.brass, b[0], -0.2, b[1], ttG).rotation.x = 0.7; });
var plinth = mesh(new THREE.BoxGeometry(0.62, 0.08, 0.44), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.5, metalness: 0.2, envMap: k.roomEnv, envMapIntensity: 0.4 }), 0, 0.09, 0, ttG);
var platter = mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.02, 32), M.chrome, -0.08, 0.14, 0, ttG);
var recordTex = tex(256, 256, function(cx, w, h) { cx.fillStyle = '#0a0a0a'; cx.beginPath(); cx.arc(128, 128, 126, 0, 6.3); cx.fill(); for (var r = 50; r < 124; r += 2) { cx.strokeStyle = 'rgba(60,60,60,' + (0.2 + 0.3 * Math.sin(r)) + ')'; cx.lineWidth = 0.6; cx.beginPath(); cx.arc(128, 128, r, 0, 6.3); cx.stroke(); } cx.fillStyle = '#c04020'; cx.beginPath(); cx.arc(128, 128, 46, 0, 6.3); cx.fill(); cx.fillStyle = '#f0e0c0'; cx.font = 'bold 9px Arial'; cx.textAlign = 'center'; cx.fillText('2+2+1', 128, 118); cx.font = '7px Arial'; cx.fillText('PONDEROSA TWINS PLUS ONE', 128, 132); cx.fillText('BOUND', 128, 146); cx.fillStyle = '#0a0a0a'; cx.beginPath(); cx.arc(128, 128, 4, 0, 6.3); cx.fill(); });
var record = mesh(new THREE.CircleGeometry(0.15, 40), new THREE.MeshStandardMaterial({ map: recordTex, roughness: 0.25, envMap: k.roomEnv, envMapIntensity: 0.9 }), -0.08, 0.152, 0, ttG); record.rotation.x = -Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.03, 8), M.chrome, -0.08, 0.16, 0, ttG);
var armG = new THREE.Group(); armG.position.set(0.2, 0.15, -0.14); ttG.add(armG);
mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.06, 12), M.chrome, 0, 0.02, 0, armG); var arm = mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.3, 8), M.chrome, -0.12, 0.05, 0.1, armG); arm.rotation.z = Math.PI / 2; arm.rotation.y = -0.6; mesh(new THREE.BoxGeometry(0.03, 0.015, 0.02), M.black, -0.24, 0.05, 0.18, armG);
mesh(new THREE.BoxGeometry(0.06, 0.02, 0.02), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.5 }), 0.24, 0.13, 0.15, ttG); mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.01, 12), M.black, 0.2, 0.135, -0.16, ttG);
var ttHit = mesh(new THREE.BoxGeometry(0.9, 0.5, 0.7), M.hidden, 0, 0.2, 0, ttG);
// the records in their sleeves on a shelf under it, the amplifier with its valves glowing, the speaker
mesh(new THREE.BoxGeometry(0.7, 0.04, 0.4), M.shelfWood, 0, -0.55, 0.05, ttG);
for (var rv = 0; rv < 18; rv++) { var sleeve = mesh(new THREE.BoxGeometry(0.02, 0.31, 0.31), new THREE.MeshStandardMaterial({ color: [0xe8e0d0, 0x2a2a2a, 0xc04020, 0x3a5a8a, 0xd8c060, 0x1a3a2a][rv % 6], roughness: 0.9 }), -0.3 + rv * 0.033, -0.37, 0.05, ttG); sleeve.rotation.z = (rnd(rv) - 0.5) * 0.08; }
var ampG = new THREE.Group(); ampG.position.set(W / 2 - 0.4, 0.3, -1.9); ampG.rotation.y = -Math.PI / 2; scene.add(ampG);
mesh(new THREE.BoxGeometry(0.5, 0.18, 0.36), new THREE.MeshStandardMaterial({ color: 0x8a8a80, roughness: 0.4, metalness: 0.5, envMap: k.roomEnv, envMapIntensity: 0.4 }), 0, 0.09, 0, ampG);
var valves = []; for (var v = 0; v < 4; v++) { mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.07, 10), new THREE.MeshPhysicalMaterial({ color: 0xe0d8c0, roughness: 0.1, transparent: true, opacity: 0.5, envMap: k.roomEnv, envMapIntensity: 1 }), -0.15 + v * 0.1, 0.215, -0.08, ampG); valves.push(k.glow(-0.15 + v * 0.1, 0.22, -0.08, 0.14, 0.55, 0xff8030, ampG)); }
var ampLight = new THREE.PointLight(0xff8030, 0.3, 1.2, 2); ampLight.position.set(0, 0.3, -0.05); ampG.add(ampLight);
mesh(new THREE.BoxGeometry(0.5, 0.8, 0.3), new THREE.MeshStandardMaterial({ map: k.grain[1], roughness: 0.7 }), W / 2 - 0.35, 0.4, 0.6); mesh(new THREE.PlaneGeometry(0.44, 0.7), new THREE.MeshStandardMaterial({ color: 0x3a3028, roughness: 1 }), W / 2 - 0.51, 0.4, 0.6).rotation.y = -Math.PI / 2;
// ---------- THE SHELVES of other people's books, floor to rail, along the left wall ----------
var shelfG = new THREE.Group(); shelfG.position.set(-W / 2 + 0.18, 0, -0.6); shelfG.rotation.y = Math.PI / 2; scene.add(shelfG);
mesh(new THREE.BoxGeometry(4.0, 2.3, 0.36), M.shelfWood, 0, 1.15, 0, shelfG);
var bookCols = [0x6a2a1a, 0x2a3a5a, 0x1a4a2a, 0xa08030, 0xe8e0d0, 0x3a2a4a, 0x8a1a1a, 0x2a2a2a, 0xc8b070];
for (var sh = 0; sh < 6; sh++) { mesh(new THREE.BoxGeometry(4.0, 0.03, 0.34), M.shelfWood, 0, 0.12 + sh * 0.38, 0.0, shelfG); var bx = -1.9; while (bx < 1.9) { var bw = 0.03 + rnd(sh * 100 + bx * 37) * 0.05, bh = 0.2 + rnd(sh * 7 + bx * 13) * 0.14; if (rnd(sh * 3 + bx * 5) < 0.06) { bx += 0.12; continue; } var bk = mesh(new THREE.BoxGeometry(bw, bh, 0.22 + rnd(bx) * 0.08), new THREE.MeshStandardMaterial({ color: bookCols[Math.floor(rnd(sh * 11 + bx * 17) * bookCols.length)], roughness: 0.85 }), bx + bw / 2, 0.135 + sh * 0.38 + bh / 2, 0.04, shelfG); bk.rotation.x = rnd(bx * 3) < 0.08 ? 0.15 : 0; bx += bw + 0.004; } }
var shelfHit = mesh(new THREE.BoxGeometry(4.0, 2.4, 0.5), M.hidden, 0, 1.2, 0.05, shelfG);
// ---------- THE WINDOW over Frith Street, sash, the neon and the rain on it ----------
var winG = new THREE.Group(); winG.position.set(1.4, 1.7, -D / 2 + 0.02); scene.add(winG);
mesh(new THREE.BoxGeometry(1.4, 1.9, 0.12), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.8 }), 0, 0, 0, winG);
var nightTex = tex(256, 384, function(cx, w, h) { var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0a0c18'); g.addColorStop(0.6, '#141220'); g.addColorStop(1, '#2a1a20'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); cx.fillStyle = '#1a1614'; cx.fillRect(0, h * 0.35, w, h * 0.65); for (var wi = 0; wi < 12; wi++) { cx.fillStyle = rnd(wi) < 0.5 ? 'rgba(255,200,120,0.6)' : 'rgba(40,40,60,0.8)'; cx.fillRect(20 + (wi % 4) * 60, h * 0.42 + Math.floor(wi / 4) * 70, 26, 40); } cx.shadowColor = '#ff40a0'; cx.shadowBlur = 18; cx.fillStyle = '#ff60b0'; cx.font = 'bold 22px Arial'; cx.fillText('GIRLS', 60, h * 0.7); cx.shadowColor = '#40ff80'; cx.fillStyle = '#60ffa0'; cx.font = 'bold 16px Arial'; cx.fillText('OPEN', 150, h * 0.82); cx.shadowBlur = 0; for (var r = 0; r < 400; r++) { cx.fillStyle = 'rgba(200,220,255,0.18)'; cx.fillRect(rnd(r * 3) * w, rnd(r * 5) * h, 1, 3 + rnd(r) * 6); } });
mesh(new THREE.PlaneGeometry(1.2, 1.7), new THREE.MeshBasicMaterial({ map: nightTex, toneMapped: false }), 0, 0, 0.065, winG);
mesh(new THREE.BoxGeometry(1.26, 0.05, 0.04), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.8 }), 0, 0.02, 0.09, winG); mesh(new THREE.BoxGeometry(0.05, 1.7, 0.04), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.8 }), 0, 0, 0.09, winG);
mesh(new THREE.BoxGeometry(1.5, 0.08, 0.2), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.8 }), 0, -0.98, 0.06, winG);
var winLight = new THREE.PointLight(0xff80c0, 0.7, 4.5, 1.7); winLight.position.set(1.4, 1.5, -D / 2 + 0.6); scene.add(winLight);
var winGlow = k.glow(1.4, 1.5, -D / 2 + 0.1, 1.6, 0.25, 0xff70b0);
var curtain = new THREE.MeshStandardMaterial({ color: 0x4a2a1a, roughness: 0.95 });
for (var f = 0; f < 5; f++) { mesh(new THREE.CylinderGeometry(0.06, 0.07, 2.0, 8, 1, false, 0, Math.PI), curtain, 0.62 + f * 0.09, 0, 0.1, winG); }
mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.9, 8), M.brass, 0.1, 1.02, 0.14, winG).rotation.z = Math.PI / 2;
// ---------- THE DOOR AT THE BACK you had not seen, and the door you came in by ----------
var backDoorG = new THREE.Group(); backDoorG.position.set(-1.6, 0, -D / 2 + 0.03); scene.add(backDoorG);
mesh(new THREE.BoxGeometry(0.85, 2.05, 0.06), new THREE.MeshStandardMaterial({ map: wallPaint, roughness: 0.95, color: 0xbab0a0 }), 0, 1.025, 0, backDoorG);
mesh(new THREE.BoxGeometry(0.95, 0.08, 0.1), railMat, 0, 2.1, 0, backDoorG); mesh(new THREE.BoxGeometry(0.06, 2.1, 0.1), railMat, -0.45, 1.05, 0, backDoorG); mesh(new THREE.BoxGeometry(0.06, 2.1, 0.1), railMat, 0.45, 1.05, 0, backDoorG);
mesh(new THREE.SphereGeometry(0.03, 8, 6), M.brass, 0.3, 1.0, 0.05, backDoorG);
mesh(new THREE.PlaneGeometry(0.8, 0.015), new THREE.MeshBasicMaterial({ color: 0xffe8c0, toneMapped: false }), 0, 0.01, 0.04, backDoorG);
var backDoorHit = mesh(new THREE.BoxGeometry(1.0, 2.3, 0.5), M.hidden, 0, 1.1, 0.15, backDoorG);
var inDoorG = new THREE.Group(); inDoorG.position.set(0.8, 0, D / 2 - 0.03); inDoorG.rotation.y = Math.PI; scene.add(inDoorG);
mesh(new THREE.BoxGeometry(0.9, 2.1, 0.06), M.darkWood, 0, 1.05, 0, inDoorG); mesh(new THREE.BoxGeometry(1.0, 0.08, 0.1), M.darkWood, 0, 2.14, 0, inDoorG); mesh(new THREE.SphereGeometry(0.03, 8, 6), M.brass, -0.32, 1.0, 0.05, inDoorG);
var hatStand = mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.8, 8), M.darkWood, 2.2, 0.9, 2.4); for (var hk = 0; hk < 3; hk++) mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.2, 6), M.darkWood, 2.2 + Math.cos(hk * 2.1) * 0.1, 1.7, 2.4 + Math.sin(hk * 2.1) * 0.1).rotation.set(Math.sin(hk * 2.1) * 1.2, 0, -Math.cos(hk * 2.1) * 1.2);
mesh(new THREE.BoxGeometry(0.3, 0.6, 0.2), new THREE.MeshStandardMaterial({ color: 0x2a2a30, roughness: 0.95 }), 2.15, 1.3, 2.45);
// ---------- LIGHT, and the smoke of the room ----------
scene.add(new THREE.AmbientLight(0x3a2c18, 0.7));
scene.add(new THREE.HemisphereLight(0x6a5030, 0x0c0804, 0.4));
var ceilLight = new THREE.PointLight(0xffd8a0, 0.5, 6, 1.8); ceilLight.position.set(0, H - 0.4, -0.4); scene.add(ceilLight);
var hazeTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(220,190,150,0.2)'); g.addColorStop(0.4, 'rgba(170,130,90,0.1)'); g.addColorStop(1, 'rgba(100,70,40,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var haze = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTex, transparent: true, opacity: 0.14, depthWrite: false, blending: THREE.AdditiveBlending })); haze.position.set(-0.6, 1.5, -1.5); haze.scale.set(3.0, 1.8, 1); scene.add(haze);
k.contact(-0.3, 0, -1.7, 2.6);
// ---------- THE CLOSE-UPS ----------
var hotspots = [
{ root: ttHit, name: 'the turntable', pos: [1.2, 1.5, -0.2], tgt: [W / 2 - 0.35, 1.25, -1.0], haloAt: [W / 2 - 0.5, 1.3, -1.0], haloSc: 1.0,
actions: function() { return k.byPrefix("What's he listening to?"); },
line: 'The Garrard screwed into the wall, the arm bolted on, the record going round with the needle up. It has hardly been silent since Dobell\'s. [Sam: the turntable once the sleeve has been read]' },
{ root: backDoorHit, name: 'the door at the back', pos: [-0.9, 1.4, -1.2], tgt: [-1.6, 1.1, -D / 2], haloAt: [-1.6, 1.15, -D / 2 + 0.15], haloSc: 1.3,
actions: function() { return k.byText(['Linger']); },
line: 'A door at the back of the office you had not seen before, painted the colour of the wall so as not to be. [Sam: the back door when it is shut for good]' },
{ root: lackland.hit, name: 'Lackland', pos: [0.3, 1.5, -0.6], tgt: [-0.3, 0.7, -2.35], haloAt: [-0.3, 1.25, -2.35], haloSc: 1.0,
line: 'Both elbows on the desk, set down one at a time, and the first page, and the last, and one from the middle. He does not need the rest. [Sam: Lackland]' },
{ root: msHit, name: 'your book', pos: [-0.2, 1.4, -0.8], tgt: [-0.2, 0.82, -1.68], haloAt: [-0.2, 0.9, -1.68], haloSc: 0.6,
line: 'It lies on his blotter where you laid it, as one might set a toddler down, and looks smaller there than it did in your hands. [Sam: the book on the desk]' },
{ root: drinksHit, name: 'the glass', pos: [0.9, 1.35, -0.9], tgt: [0.35, 0.85, -1.6], haloAt: [0.4, 0.9, -1.55], haloSc: 0.7,
line: 'Sunk, then topped up again, from a decanter that is never let get lower than the level of his patience. He does not offer. [Sam: his glass]' },
{ root: dishHit, name: 'the dish', pos: [-0.9, 1.3, -0.7], tgt: [-0.65, 0.8, -1.4], haloAt: [-0.65, 0.86, -1.4], haloSc: 0.45,
line: 'Paperclips, a drawing pin, a stamp, and one glass eye, blue, looking at nothing in particular. [Sam: the dish]' },
{ root: winG, name: 'the window', pos: [0.9, 1.6, -1.0], tgt: [1.4, 1.7, -D / 2], haloAt: [1.4, 1.7, -D / 2 + 0.15], haloSc: 1.6,
line: 'Frith Street two floors down, the neon coming up through the rain on the glass, the same word in pink over and over. [Sam: the window]' },
{ root: shelfHit, name: 'the shelves', pos: [-0.9, 1.5, 0.6], tgt: [-W / 2, 1.3, -0.6], haloAt: [-W / 2 + 0.4, 1.3, -0.6], haloSc: 2.2,
line: 'Other people\'s books, floor to rail, every one of them once laid on that blotter by somebody with your face on. [Sam: the shelves]' }
];
return { hotspots: hotspots, frame: function(t, dt, still) {
if (still) return;
record.rotation.z = -t * 3.49;
deskLight.intensity = 1.5 + 0.03 * Math.sin(t * 1.3); deskGlow.material.opacity = 0.45 + 0.02 * Math.sin(t * 1.3);
for (var v = 0; v < valves.length; v++) valves[v].material.opacity = 0.5 + 0.08 * Math.sin(t * 2.1 + v);
winLight.intensity = 0.7 + (Math.sin(t * 1.7) > 0.3 ? 0.15 : 0); winGlow.material.opacity = 0.25 + (Math.sin(t * 1.7) > 0.3 ? 0.06 : 0);
haze.material.opacity = 0.14 + 0.03 * Math.sin(t * 0.31);
} };
}
});

