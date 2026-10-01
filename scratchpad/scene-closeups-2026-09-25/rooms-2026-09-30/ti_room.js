// ====== INSIDE TRISHA'S — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-30. Built from what is written of Trisha's (the Hideout, 57 Greek
// Street): stairs down from the street into one low basement room, red
// walls under a red light, benches round the walls, a small bar with a
// jukebox beside it, fairy lights and photographs and the flotsam of forty
// years, a door to the back; and from the passage: a ship, the eternal
// afternoon, Shana on the circumambient benches with an angel each side.
// The room sits at the top of the Trisha's passage (#ti-container) and is
// its navigation: Shana opens Approach Shana while the passage offers it;
// the stairs open Back to the street and the way to Ronnie's. The bar, the
// jukebox, the wheel, the photographs and the back door are inspections,
// their card words pink placeholders for Sam. Nothing about the game is
// decided in JS.
window.dssRoomKit({
id: 'ti', caption: "TRISHA'S, GREEK STREET", captionColor: 'rgba(255,120,180,0.28)',
bg: 0x0a0306, fog: [0x140408, 0.05], exposure: 0.7, bloom: { bloomStrength: 0.5, bloomRadius: 0.7, bloomThreshold: 0.6 },
env: ['#7a2040', '#3a1020', '#0a0306', '#ff80b0'],
wash: 'linear-gradient(180deg,rgba(40,6,20,0.35) 0%,rgba(20,4,10,0.06) 35%,rgba(20,4,10,0.06) 60%,rgba(8,2,4,0.5) 100%)',
vignette: 'radial-gradient(ellipse at 50% 44%,transparent 22%,rgba(10,0,4,0.76) 100%)',
card: { fg: 'rgba(240,210,225,0.92)', bg: 'rgba(14,3,8,0.82)', border: 'rgba(255,110,180,0.3)', dim: 'rgba(230,170,200,0.5)', btn: 'rgba(255,220,235,0.95)', btnBorder: 'rgba(255,110,180,0.45)' },
cam: function(portrait) { return portrait ? { x: 1.4, y: 1.45, z: 2.9, tx: -0.5, ty: 1.0, tz: -1.6 } : { x: 1.3, y: 1.4, z: 2.5, tx: -0.7, ty: 1.0, tz: -1.6 }; }, fov: [94, 76],
hint: 'LOOK CLOSER AT WHAT CATCHES YOUR EYE',
build: function(k) {
var scene = k.scene, mesh = k.mesh, tex = k.tex, rnd = k.rnd, M = k.M;
var W = 6.0, D = 6.0, H = 2.5;
// ---------- THE ROOM: red walls, a red ceiling low enough to touch, a floor that has had drinks on it ----------
var redPaint = k.paintTex('#5a1424', 31, 'rgba(160,40,80,0.18)');
var wallMat = new THREE.MeshStandardMaterial({ map: redPaint, bumpMap: redPaint, bumpScale: 0.01, roughness: 0.9 });
var floorTex = k.woodTex('#2a1410', '#0c0404', 9); floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(4, 4);
var floor = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: floorTex, bumpMap: floorTex, bumpScale: 0.008, roughness: 0.55, envMap: k.roomEnv, envMapIntensity: 0.35 }), 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceil = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: k.paintTex('#2a0a12', 33), roughness: 1 }), 0, H, 0); ceil.rotation.x = Math.PI / 2;
var back = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2); back.receiveShadow = true;
var front = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, D / 2); front.rotation.y = Math.PI;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2; left.receiveShadow = true;
var right = mesh(new THREE.PlaneGeometry(D, H), wallMat, W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2; right.receiveShadow = true;
var beamMat = new THREE.MeshStandardMaterial({ map: k.grain[1], roughness: 0.8 });
for (var bz = -2.2; bz <= 2.2; bz += 1.1) mesh(new THREE.BoxGeometry(W, 0.14, 0.12), beamMat, 0, H - 0.07, bz);
// ---------- THE BENCHES round the walls, red vinyl, and the low tables in front of them ----------
var vinyl = new THREE.MeshStandardMaterial({ color: 0x8a1a2a, roughness: 0.35, envMap: k.roomEnv, envMapIntensity: 0.5 });
var vinylDark = new THREE.MeshStandardMaterial({ color: 0x5a0e1a, roughness: 0.4, envMap: k.roomEnv, envMapIntensity: 0.3 });
function bench(len, x, z, ry) { var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g); mesh(new THREE.BoxGeometry(len, 0.42, 0.5), vinylDark, 0, 0.21, 0, g); mesh(new THREE.BoxGeometry(len, 0.08, 0.52), vinyl, 0, 0.46, 0, g); var bk = mesh(new THREE.BoxGeometry(len, 0.55, 0.1), vinyl, 0, 0.75, -0.22, g); for (var i = 0; i < len / 0.4; i++) mesh(new THREE.BoxGeometry(0.02, 0.5, 0.02), vinylDark, -len / 2 + 0.2 + i * 0.4, 0.75, -0.16, g); return g; }
var benchBack = bench(4.8, 0, -D / 2 + 0.26, 0);
bench(3.6, -W / 2 + 0.26, 0.4, Math.PI / 2);
function lowTable(x, z) { var g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g); mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.03, 18), new THREE.MeshStandardMaterial({ color: 0x1a0a0c, roughness: 0.3, envMap: k.roomEnv, envMapIntensity: 0.5 }), 0, 0.5, 0, g); mesh(new THREE.CylinderGeometry(0.025, 0.04, 0.48, 8), M.chrome, 0, 0.25, 0, g); mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 16), M.chrome, 0, 0.01, 0, g); k.contact(x, 0, z, 0.9); return g; }
var shanaTable = lowTable(-0.3, -D / 2 + 1.1); lowTable(1.6, -D / 2 + 1.1); lowTable(-W / 2 + 1.1, 0.2); lowTable(-W / 2 + 1.1, 1.5);
// on the tables: glasses, a candle in a bottle, a pastis going cloudy, a cocktail with its cherry
var candleFlames = [];
function candle(x, y, z) { var g = new THREE.Group(); g.position.set(x, y, z); scene.add(g); mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.22, 10), new THREE.MeshPhysicalMaterial({ color: 0x2a5a3a, roughness: 0.2, transparent: true, opacity: 0.85, envMap: k.roomEnv, envMapIntensity: 0.8, clearcoat: 0.9 }), 0, 0.11, 0, g); mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.06, 8), new THREE.MeshStandardMaterial({ color: 0xf0e8d0, roughness: 0.8 }), 0, 0.25, 0, g); var fl = mesh(new THREE.SphereGeometry(0.012, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffe0a0, toneMapped: false }), 0, 0.29, 0, g); var l = new THREE.PointLight(0xffb060, 0.5, 1.8, 1.8); l.position.set(0, 0.32, 0); g.add(l); var gl = k.glow(0, 0.29, 0, 0.25, 0.5, 0xffc070, g); for (var d = 0; d < 6; d++) mesh(new THREE.SphereGeometry(0.01 + rnd(d) * 0.01, 6, 5), new THREE.MeshStandardMaterial({ color: 0xf0e8d0, roughness: 0.8 }), (rnd(d * 3) - 0.5) * 0.09, 0.2 - rnd(d * 5) * 0.1, (rnd(d * 7) - 0.5) * 0.09, g); candleFlames.push({ l: l, gl: gl, fl: fl }); return g; }
candle(-0.42, 0.515, -D / 2 + 1.2); candle(1.5, 0.515, -D / 2 + 1.0); candle(-W / 2 + 1.0, 0.515, 1.4);
var pastis = new THREE.MeshStandardMaterial({ color: 0xe8e0a0, roughness: 0.15, transparent: true, opacity: 0.75, emissive: 0x4a4010, emissiveIntensity: 0.25 });
function drink(x, y, z, kind) { var g = new THREE.Group(); g.position.set(x, y, z); scene.add(g); if (kind === 'pastis') { mesh(new THREE.CylinderGeometry(0.028, 0.024, 0.1, 12, 1, true), M.glass.clone(), 0, 0.05, 0, g).material.side = THREE.DoubleSide; mesh(new THREE.CylinderGeometry(0.025, 0.023, 0.06, 12), pastis, 0, 0.032, 0, g); } else { mesh(new THREE.ConeGeometry(0.045, 0.06, 14, 1, true), M.glass.clone(), 0, 0.1, 0, g).material.side = THREE.DoubleSide; mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.08, 6), M.glass, 0, 0.04, 0, g); mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.005, 12), M.glass, 0, 0.002, 0, g); mesh(new THREE.ConeGeometry(0.04, 0.05, 14), new THREE.MeshStandardMaterial({ color: 0xff3060, roughness: 0.1, transparent: true, opacity: 0.7, emissive: 0x600020, emissiveIntensity: 0.3 }), 0, 0.105, 0, g); mesh(new THREE.SphereGeometry(0.009, 6, 5), new THREE.MeshStandardMaterial({ color: 0xa00020, roughness: 0.4 }), 0, 0.09, 0, g); } return g; }
drink(-0.15, 0.515, -D / 2 + 1.0, 'pastis'); drink(-0.3, 0.515, -D / 2 + 1.25, 'cocktail'); drink(1.7, 0.515, -D / 2 + 1.2, 'cocktail'); drink(-W / 2 + 1.2, 0.515, 0.1, 'pastis');
// ---------- SHANA, the Byzantine broad, on the bench, with an angel on each side ----------
var SZ = -D / 2 + 0.3;
var shana = k.ghost(-0.3, 0.05, SZ + 0.05, 21, 0.62, true, true, 1.2);
shana.hit.scale.set(1.5, 1, 1.5);
var angelL = k.ghost(-1.15, 0.05, SZ + 0.05, 23, 0.34, true, false, 1.0);
var angelR = k.ghost(0.55, 0.05, SZ + 0.05, 25, 0.34, true, false, 1.0);
// the wings, two faint fans of light behind the angels, since the passage says angels
var wingTex = tex(128, 128, function(cx, w, h) { cx.strokeStyle = 'rgba(255,230,240,0.5)'; cx.lineWidth = 1.5; for (var i = 0; i < 9; i++) { cx.beginPath(); cx.moveTo(w * 0.5, h * 0.85); cx.quadraticCurveTo(w * (0.1 + i * 0.1), h * (0.5 - i * 0.03), w * (0.05 + i * 0.1), h * 0.1); cx.stroke(); } var g = cx.createRadialGradient(w / 2, h * 0.7, 0, w / 2, h * 0.7, w * 0.6); g.addColorStop(0, 'rgba(255,200,230,0.25)'); g.addColorStop(1, 'rgba(255,200,230,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var wings = [angelL, angelR].map(function(a, i) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: wingTex, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending })); sp.scale.set(1.2, 1.2, 1); sp.position.set(a.sp.position.x + (i ? 0.25 : -0.25), 1.35, SZ + 0.02); scene.add(sp); return sp; });
// her lamp: a red-shaded lamp on the wall above her, the light incarnadine
var redShade = new THREE.MeshPhysicalMaterial({ color: 0xd02040, roughness: 0.5, emissive: 0xb01030, emissiveIntensity: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
var shanaLamp = mesh(new THREE.ConeGeometry(0.16, 0.16, 16, 1, true), redShade, -0.3, 1.95, -D / 2 + 0.12);
mesh(new THREE.SphereGeometry(0.03, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd0d0, toneMapped: false }), -0.3, 1.9, -D / 2 + 0.12);
var shanaLight = new THREE.PointLight(0xff4060, 1.4, 4.5, 1.5); shanaLight.position.set(-0.3, 1.8, -D / 2 + 0.4); shanaLight.castShadow = true; shanaLight.shadow.mapSize.set(512, 512); shanaLight.shadow.bias = -0.002; scene.add(shanaLight);
var shanaGlow = k.glow(-0.3, 1.9, -D / 2 + 0.16, 0.9, 0.5, 0xff5070);
// ---------- THE BAR, small, along the right wall, the jukebox beside it ----------
var barG = new THREE.Group(); scene.add(barG);
var barX = W / 2 - 0.75, barZ0 = -1.4, barZ1 = 1.2, barLen = barZ1 - barZ0, barZ = (barZ0 + barZ1) / 2;
var body = mesh(new THREE.BoxGeometry(0.5, 1.05, barLen), new THREE.MeshStandardMaterial({ map: k.grain[1], roughness: 0.5, envMap: k.roomEnv, envMapIntensity: 0.4 }), barX, 0.525, barZ, barG); body.castShadow = true;
mesh(new THREE.BoxGeometry(0.62, 0.05, barLen + 0.08), new THREE.MeshStandardMaterial({ color: 0x1a0a0c, roughness: 0.25, envMap: k.roomEnv, envMapIntensity: 0.6 }), barX, 1.075, barZ, barG);
mesh(new THREE.BoxGeometry(0.03, 0.05, barLen + 0.08), M.brass, barX - 0.31, 1.075, barZ, barG);
mesh(new THREE.BoxGeometry(0.4, 2.0, barLen), new THREE.MeshStandardMaterial({ map: k.grain[2], roughness: 0.6, envMap: k.roomEnv, envMapIntensity: 0.3 }), W / 2 - 0.2, 1.0, barZ, barG);
var botCols = [0x2a5a2a, 0x7a4a18, 0xa08030, 0x4a1a1a, 0xc8c0a0, 0x1a2a5a];
[1.25, 1.65].forEach(function(sy, si) { mesh(new THREE.BoxGeometry(0.22, 0.03, barLen - 0.2), M.darkWood, W / 2 - 0.11, sy, barZ, barG); for (var i = 0; i < 8; i++) { if (rnd(si * 20 + i) < 0.2) continue; var bh = 0.18 + rnd(i + si) * 0.1; var bm = new THREE.MeshPhysicalMaterial({ color: botCols[(i + si * 2) % botCols.length], roughness: 0.17, envMap: k.roomEnv, envMapIntensity: 0.8, clearcoat: 0.85, transparent: true, opacity: 0.88 }); mesh(new THREE.CylinderGeometry(0.026, 0.026, bh, 10), bm, W / 2 - 0.12, sy + 0.015 + bh / 2, barZ0 + 0.25 + i * 0.3, barG); mesh(new THREE.CylinderGeometry(0.01, 0.016, 0.06, 8), bm, W / 2 - 0.12, sy + 0.015 + bh + 0.03, barZ0 + 0.25 + i * 0.3, barG); } });
var mir = mesh(new THREE.PlaneGeometry(barLen - 0.3, 0.9), null, W / 2 - 0.39, 1.6, barZ); mir.rotation.y = -Math.PI / 2; k.makeMirror(mir, new THREE.Vector3(-1, 0, 0), k.portrait ? 512 : 1024, new THREE.Vector3(0.7, 0.55, 0.6), { edge: '0.1' });
// the fairy lights along the bar shelf and the beam, a string of small coloured bulbs
var fairyCols = [0xff4060, 0x40c0ff, 0xffd040, 0x60ff80, 0xff80c0];
var fairies = [];
function fairyString(pts, n) { for (var i = 0; i < n; i++) { var u = i / (n - 1), p = new THREE.Vector3().lerpVectors(pts[0], pts[1], u); p.y -= Math.sin(u * Math.PI) * 0.12; var col = fairyCols[i % fairyCols.length]; mesh(new THREE.SphereGeometry(0.014, 6, 5), new THREE.MeshBasicMaterial({ color: col, toneMapped: false }), p.x, p.y, p.z); fairies.push({ sp: k.glow(p.x, p.y, p.z, 0.16, 0.6, col), ph: i * 0.7 }); } var wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([pts[0], new THREE.Vector3().lerpVectors(pts[0], pts[1], 0.5).add(new THREE.Vector3(0, -0.12, 0)), pts[1]]), 12, 0.004, 4, false), new THREE.MeshStandardMaterial({ color: 0x1a1a1a })); scene.add(wire); }
fairyString([new THREE.Vector3(W / 2 - 0.3, 2.05, barZ0 - 0.1), new THREE.Vector3(W / 2 - 0.3, 2.05, barZ1 + 0.1)], 9);
fairyString([new THREE.Vector3(-W / 2 + 0.2, H - 0.2, -1.1), new THREE.Vector3(W / 2 - 0.3, H - 0.2, -1.1)], 14);
fairyString([new THREE.Vector3(-W / 2 + 0.2, H - 0.2, 1.1), new THREE.Vector3(W / 2 - 0.3, H - 0.2, 1.1)], 14);
// the jukebox, the old kind with the arch and the bubbles, playing something for the afternoon
var jukeG = new THREE.Group(); jukeG.position.set(W / 2 - 0.45, 0, -2.2); jukeG.rotation.y = -Math.PI / 2; scene.add(jukeG);
mesh(new THREE.BoxGeometry(0.8, 0.9, 0.6), new THREE.MeshStandardMaterial({ map: k.grain[0], roughness: 0.4, envMap: k.roomEnv, envMapIntensity: 0.5 }), 0, 0.45, 0, jukeG).castShadow = true;
var arch = mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.6, 24, 1, false, 0, Math.PI), new THREE.MeshStandardMaterial({ map: k.grain[0], roughness: 0.4, envMap: k.roomEnv, envMapIntensity: 0.5 }), 0, 0.9, 0, jukeG); arch.rotation.z = Math.PI / 2; arch.rotation.y = Math.PI / 2; arch.rotation.x = Math.PI / 2;
var jukeTex = tex(128, 128, function(cx, w, h) { var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#ffb040'); g.addColorStop(0.5, '#ff4080'); g.addColorStop(1, '#40a0ff'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); cx.fillStyle = 'rgba(255,255,255,0.5)'; for (var i = 0; i < 20; i++) { cx.beginPath(); cx.arc(rnd(i * 3) * w, rnd(i * 5) * h, 2 + rnd(i) * 4, 0, 6.3); cx.fill(); } });
var jukeArch = mesh(new THREE.TorusGeometry(0.34, 0.05, 8, 24, Math.PI), new THREE.MeshBasicMaterial({ map: jukeTex, toneMapped: false }), 0, 0.9, 0.29, jukeG);
mesh(new THREE.PlaneGeometry(0.55, 0.3), new THREE.MeshPhysicalMaterial({ color: 0xffe0c0, roughness: 0.1, transparent: true, opacity: 0.6, envMap: k.roomEnv, envMapIntensity: 1, emissive: 0xffb060, emissiveIntensity: 0.3 }), 0, 0.95, 0.305, jukeG);
mesh(new THREE.PlaneGeometry(0.6, 0.2), new THREE.MeshStandardMaterial({ color: 0x1a1010, roughness: 0.7 }), 0, 0.55, 0.305, jukeG);
for (var kb = 0; kb < 8; kb++) mesh(new THREE.BoxGeometry(0.05, 0.03, 0.02), new THREE.MeshStandardMaterial({ color: 0xf0e8d0, roughness: 0.4 }), -0.2 + kb * 0.056, 0.55, 0.315, jukeG);
mesh(new THREE.BoxGeometry(0.6, 0.02, 0.02), M.chrome, 0, 0.45, 0.31, jukeG);
var jukeLight = new THREE.PointLight(0xff8060, 0.9, 3.5, 1.6); jukeLight.position.set(W / 2 - 1.0, 1.0, -2.2); scene.add(jukeLight);
var jukeGlow = k.glow(-0.0, 0.95, 0.35, 0.9, 0.4, 0xffa070, jukeG);
// ---------- THE SHIP in the room: a wheel on the wall, a brass porthole, a lifebelt, the photographs ----------
var wheelG = new THREE.Group(); wheelG.position.set(-W / 2 + 0.06, 2.0, -0.3); wheelG.rotation.y = Math.PI / 2; scene.add(wheelG);
mesh(new THREE.TorusGeometry(0.36, 0.03, 8, 28), M.oak, 0, 0, 0, wheelG); mesh(new THREE.TorusGeometry(0.22, 0.02, 8, 24), M.oak, 0, 0, 0, wheelG); mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 12), M.brass, 0, 0, 0, wheelG).rotation.x = Math.PI / 2;
for (var sp = 0; sp < 8; sp++) { var spoke = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.9, 8), M.oak, 0, 0, 0, wheelG); spoke.rotation.z = sp * Math.PI / 4; var knob = mesh(new THREE.SphereGeometry(0.03, 8, 6), M.oak, Math.cos(sp * Math.PI / 4) * 0.45, Math.sin(sp * Math.PI / 4) * 0.45, 0, wheelG); }
var portG = new THREE.Group(); portG.position.set(-W / 2 + 0.05, 1.7, 0.6); portG.rotation.y = Math.PI / 2; scene.add(portG);
mesh(new THREE.TorusGeometry(0.24, 0.035, 10, 28), M.brass, 0, 0, 0, portG); for (var rv = 0; rv < 8; rv++) mesh(new THREE.SphereGeometry(0.012, 6, 5), M.brass, Math.cos(rv * 0.785) * 0.24, Math.sin(rv * 0.785) * 0.24, 0.03, portG);
var portMir = mesh(new THREE.CircleGeometry(0.22, 24), null, -W / 2 + 0.06, 1.7, 0.6); portMir.rotation.y = Math.PI / 2; k.makeMirror(portMir, new THREE.Vector3(1, 0, 0), 256, new THREE.Vector3(0.6, 0.62, 0.7), { edge: '0.15' });
var beltG = new THREE.Group(); beltG.position.set(0, 1.85, D / 2 - 0.05); beltG.rotation.y = Math.PI; scene.add(beltG);
var beltTex = tex(256, 32, function(cx, w, h) { for (var i = 0; i < 4; i++) { cx.fillStyle = i % 2 ? '#e8e0d0' : '#c02020'; cx.fillRect(i * 64, 0, 64, h); } });
beltTex.wrapS = THREE.RepeatWrapping; mesh(new THREE.TorusGeometry(0.3, 0.07, 10, 32), new THREE.MeshStandardMaterial({ map: beltTex, roughness: 0.8 }), 0, 0, 0, beltG);
function photoTex(seed) { return tex(128, 160, function(cx, w, h) { cx.fillStyle = '#e8e0d0'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#1a1414'; cx.fillRect(10, 10, w - 20, h - 36); var lx = 30 + rnd(seed) * 60; var g = cx.createRadialGradient(lx, 50, 4, w / 2, h * 0.45, 90); g.addColorStop(0, 'rgba(240,220,210,0.85)'); g.addColorStop(0.5, 'rgba(120,100,100,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(10, 10, w - 20, h - 36); var n = 1 + (seed % 3); for (var f = 0; f < n; f++) { var hx = w / 2 + (f - (n - 1) / 2) * 30, hy = 60 + rnd(seed + f) * 10; cx.fillStyle = 'rgba(230,215,200,0.8)'; cx.beginPath(); cx.arc(hx, hy, 11, 0, 6.3); cx.fill(); cx.beginPath(); cx.moveTo(hx - 20, h - 26); cx.lineTo(hx - 14, hy + 14); cx.lineTo(hx + 14, hy + 14); cx.lineTo(hx + 20, h - 26); cx.closePath(); cx.fill(); } for (var i = 0; i < 3000; i++) { cx.fillStyle = i % 2 ? 'rgba(225,221,193,0.06)' : 'rgba(0,0,0,0.1)'; cx.fillRect(rnd(seed + i * 7) * w, rnd(seed + i * 11) * h, 1, 1); } }); }
var picG = new THREE.Group(); scene.add(picG); mesh(new THREE.BoxGeometry(0.12, 1.1, 1.5), M.hidden, -W / 2 + 0.05, 1.4, -0.05, picG);
for (var pi = 0; pi < 9; pi++) { var g = new THREE.Group(); var onBack = pi < 5; if (onBack) { g.position.set(-2.2 + pi * 1.1 + (rnd(pi) - 0.5) * 0.3, 1.55 + (rnd(pi * 3) - 0.5) * 0.5, -D / 2 + 0.02); } else { g.position.set(-W / 2 + 0.02, 1.4 + (rnd(pi * 3) - 0.5) * 0.7, -0.6 + (pi - 5) * 0.38 + (rnd(pi) - 0.5) * 0.2); g.rotation.y = Math.PI / 2; } g.rotation.z = (rnd(pi * 5) - 0.5) * 0.12; picG.add(g); mesh(new THREE.BoxGeometry(0.3, 0.36, 0.02), M.darkWood, 0, 0, 0, g); mesh(new THREE.PlaneGeometry(0.26, 0.32), new THREE.MeshStandardMaterial({ map: photoTex(pi * 7 + 3), roughness: 0.7 }), 0, 0, 0.012, g); }
// a tinsel garland and the day-before/day-after clock, stopped
var clockG = new THREE.Group(); clockG.position.set(2.2, 1.9, -D / 2 + 0.04); scene.add(clockG);
mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 24), M.oak, 0, 0, 0, clockG).rotation.x = Math.PI / 2;
var clockTex = tex(128, 128, function(cx, w, h) { cx.fillStyle = '#e8e0c8'; cx.beginPath(); cx.arc(64, 64, 60, 0, 6.3); cx.fill(); cx.strokeStyle = '#1a1a1a'; cx.lineWidth = 3; for (var i = 0; i < 12; i++) { cx.beginPath(); cx.moveTo(64 + Math.cos(i * 0.5236) * 50, 64 + Math.sin(i * 0.5236) * 50); cx.lineTo(64 + Math.cos(i * 0.5236) * 56, 64 + Math.sin(i * 0.5236) * 56); cx.stroke(); } cx.beginPath(); cx.moveTo(64, 64); cx.lineTo(64 + 30, 64 + 18); cx.stroke(); cx.beginPath(); cx.moveTo(64, 64); cx.lineTo(64 - 8, 64 - 42); cx.stroke(); });
mesh(new THREE.CircleGeometry(0.19, 24), new THREE.MeshStandardMaterial({ map: clockTex, roughness: 0.6 }), 0, 0, 0.03, clockG);
// ---------- THE STAIRS up to the street, front right, with the red light on them ----------
var stairG = new THREE.Group(); stairG.position.set(-2.1, 0, -0.8); stairG.rotation.y = Math.PI; scene.add(stairG);
var stairMat = new THREE.MeshStandardMaterial({ map: k.grain[1], roughness: 0.7 });
for (var s = 0; s < 8; s++) { var st = mesh(new THREE.BoxGeometry(0.9, 0.2, 0.26), stairMat, 0, 0.1 + s * 0.2, -0.3 + s * 0.24, stairG); st.castShadow = true; }
mesh(new THREE.BoxGeometry(0.06, 2.2, 2.2), wallMat, 0.48, 1.1, 0.7, stairG); mesh(new THREE.BoxGeometry(0.06, 2.2, 2.2), wallMat, -0.48, 1.1, 0.7, stairG);
var rail = mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.2, 8), M.brass, -0.42, 1.2, 0.6, stairG); rail.rotation.x = -Math.atan2(1.6, 1.9);
var stairLamp = mesh(new THREE.SphereGeometry(0.05, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff3050, toneMapped: false }), 0, 2.2, 0.5, stairG);
var stairLight = new THREE.PointLight(0xff2040, 1.2, 4, 1.6); stairLight.position.set(0, 2.1, 0.4); stairG.add(stairLight);
var stairGlow = k.glow(0, 2.2, 0.5, 1.2, 0.5, 0xff3050, stairG);
mesh(new THREE.PlaneGeometry(0.9, 0.5), new THREE.MeshBasicMaterial({ color: 0x1a0408 }), 0, 2.0, 1.75, stairG);
var stairHit = mesh(new THREE.BoxGeometry(1.0, 2.5, 2.4), M.hidden, 0, 1.2, 0.7, stairG);
// ---------- THE DOOR to the back, and the cistern behind it ----------
var backDoorG = new THREE.Group(); backDoorG.position.set(-W / 2 + 0.03, 0, 1.15); backDoorG.rotation.y = Math.PI / 2; scene.add(backDoorG);
mesh(new THREE.BoxGeometry(0.8, 2.0, 0.06), new THREE.MeshStandardMaterial({ color: 0x3a1018, roughness: 0.8 }), 0, 1.0, 0, backDoorG);
mesh(new THREE.BoxGeometry(0.95, 0.1, 0.12), M.darkWood, 0, 2.05, 0, backDoorG);
mesh(new THREE.SphereGeometry(0.03, 8, 6), M.brass, 0.3, 0.95, 0.05, backDoorG);
mesh(new THREE.PlaneGeometry(0.72, 0.02), new THREE.MeshBasicMaterial({ color: 0xa0d0c0, toneMapped: false }), 0, 0.03, 0.04, backDoorG);
var backLight = new THREE.PointLight(0x80c0b0, 0.3, 2, 2); backLight.position.set(-W / 2 + 0.3, 0.2, 1.15); scene.add(backLight);
var backHit = mesh(new THREE.BoxGeometry(1.0, 2.3, 0.5), M.hidden, 0, 1.1, 0.15, backDoorG);
// ---------- LIGHT: red, low, incarnadine ----------
scene.add(new THREE.AmbientLight(0x4a1020, 0.9));
scene.add(new THREE.HemisphereLight(0x8a2040, 0x100408, 0.5));
var barLamp = new THREE.PointLight(0xffb080, 0.8, 3.5, 1.6); barLamp.position.set(barX - 0.3, 2.0, barZ); scene.add(barLamp);
var hazeTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,140,180,0.2)'); g.addColorStop(0.4, 'rgba(200,80,120,0.1)'); g.addColorStop(1, 'rgba(120,30,60,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var haze = [[-0.3, 1.4, -D / 2 + 1.2, 3.6, 2.0], [1.9, 1.6, D / 2 - 0.6, 2.2, 2.2]].map(function(p) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTex, transparent: true, opacity: 0.14, depthWrite: false, blending: THREE.AdditiveBlending })); sp.position.set(p[0], p[1], p[2]); sp.scale.set(p[3], p[4], 1); scene.add(sp); return sp; });
k.ghost(-W / 2 + 0.5, 0.05, 1.2, 27, 0.16, true, false); k.ghost(barX - 0.6, 0, 0.6, 29, 0.14, false, false);
// ---------- THE CLOSE-UPS ----------
var hotspots = [
{ root: shana.hit, name: 'Shana', pos: [0.3, 1.5, -D / 2 + 2.4], tgt: [-0.3, 0.6, SZ + 0.05], haloAt: [-0.3, 1.15, SZ + 0.05], haloSc: 1.2,
figure: true, actions: function() { return k.byText(['Approach Shana']); },
line: 'Shana, destroyer of worlds, with an angel each side, and all systems in the room tending her way. [Sam: Shana, after]' },
{ root: stairHit, name: 'the stairs', pos: [-0.4, 1.5, 0.6], tgt: [-2.1, 1.3, -1.7], haloAt: [-2.1, 1.4, -1.7], haloSc: 1.5,
actions: function() { return k.byText(['Back to the street', "Ronnie Scott's is nearby."]); },
line: 'The stairs up through the red light, back to whatever weather it is up there. [Sam: the stairs when there is no leaving yet]' },
{ root: barG, name: 'the bar', pos: [0.8, 1.4, 0.6], tgt: [barX, 1.1, barZ], haloAt: [barX - 0.1, 1.15, barZ], haloSc: 1.6,
line: 'A bar the length of two people, a mirror behind it that has seen worse, the bottles in the fairy lights. Pastis going cloudy in a glass. [Sam: the bar]' },
{ root: jukeG, name: 'the jukebox', pos: [1.0, 1.3, -0.9], tgt: [W / 2 - 0.45, 1.0, -2.2], haloAt: [W / 2 - 0.75, 1.25, -2.2], haloSc: 1.2,
line: 'The bubbles go up the arch and the same record has been on since the afternoon began, which was years ago. [Sam: the jukebox]' },
{ root: wheelG, name: "the ship's wheel", pos: [-1.2, 1.7, 0.4], tgt: [-W / 2, 2.0, -0.3], haloAt: [-W / 2 + 0.15, 2.0, -0.3], haloSc: 1.1,
line: 'A wheel on the wall for the ship this is. Nobody is steering. That is how it stays in the calm. [Sam: the wheel]' },
{ root: picG, name: 'the photographs', pos: [-1.0, 1.6, 0.0], tgt: [-W / 2, 1.4, 0.0], haloAt: [-W / 2 + 0.15, 1.4, 0.0], haloSc: 1.6,
line: 'Everyone who has sat on these benches, in frames that do not match, with the same afternoon light on them all. [Sam: the photographs]' },
{ root: backHit, name: 'the door to the back', pos: [-1.2, 1.4, 1.15], tgt: [-W / 2, 1.0, 1.15], haloAt: [-W / 2 + 0.15, 1.0, 1.15], haloSc: 1.2,
line: 'The door to the back, where the cistern is, and whatever gets left on the cistern. [Sam: the back]' }
];
return { hotspots: hotspots, frame: function(t, dt, still) {
if (still) return;
for (var i = 0; i < candleFlames.length; i++) { var f = 0.5 + 0.12 * Math.sin(t * 9 + i * 2) + 0.06 * Math.sin(t * 23 + i); candleFlames[i].l.intensity = f; candleFlames[i].gl.material.opacity = 0.35 + f * 0.3; candleFlames[i].fl.scale.set(1, 1 + 0.4 * Math.sin(t * 11 + i), 1); }
for (var fi = 0; fi < fairies.length; fi++) fairies[fi].sp.material.opacity = 0.45 + 0.25 * Math.sin(t * 1.3 + fairies[fi].ph);
shanaLight.intensity = 1.4 + 0.05 * Math.sin(t * 0.9); shanaGlow.material.opacity = 0.5 + 0.03 * Math.sin(t * 0.9);
jukeArch.material.map.offset.y = -t * 0.05; jukeGlow.material.opacity = 0.4 + 0.05 * Math.sin(t * 2.2);
stairGlow.material.opacity = 0.5 + 0.03 * Math.sin(t * 1.7);
haze[0].material.opacity = 0.14 + 0.03 * Math.sin(t * 0.29); haze[1].material.opacity = 0.12 + 0.03 * Math.sin(t * 0.37 + 1);
for (var w = 0; w < wings.length; w++) wings[w].material.opacity = 0.18 + 0.06 * Math.sin(t * 0.4 + w * 2);
} };
}
});

