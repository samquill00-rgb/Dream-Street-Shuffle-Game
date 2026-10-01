// ====== INSIDE COPPER'S CELLAR — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-30. Built from the Copper's Lair approach scene (the cellar under
// the Colony: block walls with their drips, a concrete floor, joists and
// pipes, one bare bulb on its wire, the table at the far end, the
// chesterfield on its rug, the puddle) and from what the passage says: Copper
// in front of you, Quiet Frankie at the table, Ashton Granger opposite him.
// The room sits at the top of Turn to Copper (#cu-container) and is its
// navigation: Copper takes "Say nothing" and the two names; Ashton takes
// the look you are not supposed to give her. Frankie, the bulb, the stairs
// and the chesterfield are inspections, their card words pink placeholders
// for Sam. The password, when he knows the words, stays in the panel.
window.dssRoomKit({
id: 'cu', caption: 'A CELLAR UNDER DEAN STREET', captionColor: 'rgba(200,190,150,0.22)',
bg: 0x050506, fog: [0x06060a, 0.05], exposure: 0.74, bloom: { bloomStrength: 0.42, bloomRadius: 0.55, bloomThreshold: 0.6 },
env: ['#4a4030', '#2a2820', '#08080a', '#e0cfa0'],
wash: 'linear-gradient(180deg,rgba(8,8,10,0.35) 0%,rgba(6,6,8,0.05) 35%,rgba(6,6,8,0.05) 60%,rgba(2,2,3,0.5) 100%)',
card: { fg: 'rgba(222,214,190,0.92)', bg: 'rgba(6,6,8,0.82)', border: 'rgba(190,180,140,0.3)', dim: 'rgba(190,185,150,0.5)', btn: 'rgba(230,222,190,0.95)', btnBorder: 'rgba(190,180,140,0.45)' },
cam: function(portrait) { return portrait ? { x: 0.2, y: 1.5, z: 5.2, tx: 0.0, ty: 1.05, tz: -2.6 } : { x: 0.3, y: 1.45, z: 4.4, tx: 0.0, ty: 1.05, tz: -2.6 }; },
build: function(k) {
var THREE_ = THREE, scene = k.scene, mesh = k.mesh, tex = k.tex, rnd = k.rnd, M = k.M;
var W = 6.0, D = 12.0, H = 2.8;
// ---------- MATERIALS: concrete blocks with their drips, the stained floor, the stained ceiling ----------
function blockTex(seed) {
return tex(512, 256, function(cx, cw, ch) {
cx.fillStyle = '#585550'; cx.fillRect(0, 0, cw, ch);
var blockH = 32, blockW = 64, n = 0;
for (var row = 0; row < ch / blockH + 1; row++) { var ox = (row % 2 === 0) ? 0 : blockW / 2;
for (var col = -1; col < cw / blockW + 1; col++) { var bx = col * blockW + ox, by = row * blockH, shade = 72 + Math.floor(rnd(seed + n++) * 22);
cx.fillStyle = 'rgb(' + shade + ',' + (shade - 2) + ',' + (shade - 6) + ')'; cx.fillRect(bx + 1, by + 1, blockW - 2, blockH - 2);
cx.strokeStyle = 'rgba(40,38,35,0.7)'; cx.lineWidth = 1.5; cx.strokeRect(bx, by, blockW, blockH); } }
for (var i = 0; i < 30; i++) { cx.fillStyle = 'rgba(50,45,35,' + (rnd(seed * 3 + i) * 0.3) + ')'; cx.beginPath(); cx.arc(rnd(seed + i * 7) * cw, rnd(seed + i * 11) * ch, rnd(i) * 30 + 5, 0, Math.PI * 2); cx.fill(); }
for (var d = 0; d < 6; d++) { var dx = 40 + rnd(seed * 5 + d) * (cw - 80), dW = 3 + rnd(d + seed) * 5, dL = ch * (0.4 + rnd(d * 3 + seed) * 0.6);
var grd = cx.createLinearGradient(dx, 0, dx, dL); grd.addColorStop(0, 'rgba(20,18,12,0.85)'); grd.addColorStop(0.3, 'rgba(25,20,14,0.7)'); grd.addColorStop(0.7, 'rgba(20,18,12,0.4)'); grd.addColorStop(1, 'rgba(20,18,12,0)');
cx.fillStyle = grd; cx.beginPath(); cx.moveTo(dx - dW / 2, 0); cx.quadraticCurveTo(dx + dW, dL * 0.3, dx - dW * 0.3, dL * 0.6); cx.quadraticCurveTo(dx + dW * 0.5, dL * 0.85, dx, dL); cx.lineTo(dx + dW, dL); cx.quadraticCurveTo(dx + dW * 1.5, dL * 0.85, dx + dW * 1.3, dL * 0.6); cx.quadraticCurveTo(dx - dW * 0.5, dL * 0.3, dx + dW / 2, 0); cx.closePath(); cx.fill();
cx.fillStyle = 'rgba(80,75,65,0.2)'; cx.fillRect(dx - dW / 2, 0, dW, 8); }
var soot = cx.createLinearGradient(0, 0, 0, ch); soot.addColorStop(0, 'rgba(10,8,6,0.35)'); soot.addColorStop(0.5, 'rgba(10,8,6,0)'); soot.addColorStop(1, 'rgba(10,8,6,0.3)'); cx.fillStyle = soot; cx.fillRect(0, 0, cw, ch);
});
}
function wallMat(seed, rep) { var t = blockTex(seed); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, 1); return new THREE.MeshStandardMaterial({ map: t, bumpMap: t, bumpScale: 0.012, roughness: 0.92 }); }
var floorTex = tex(512, 512, function(cx, w, h) {
cx.fillStyle = '#3a3835'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 200; i++) { var shade = Math.floor(rnd(i) * 20) + 45; cx.fillStyle = 'rgba(' + shade + ',' + shade + ',' + (shade - 5) + ',0.4)'; cx.fillRect(rnd(i * 3) * w, rnd(i * 5) * h, rnd(i * 7) * 30 + 5, rnd(i * 9) * 30 + 5); }
for (var i = 0; i < 8; i++) { cx.strokeStyle = 'rgba(30,28,25,0.5)'; cx.lineWidth = 0.5 + rnd(i); cx.beginPath(); cx.moveTo(rnd(i * 2) * w, rnd(i * 4) * h); cx.lineTo(rnd(i * 6) * w, rnd(i * 8) * h); cx.stroke(); }
for (var i = 0; i < 12; i++) { var sx = rnd(i * 13) * w, sy = rnd(i * 17) * h, sr = 14 + rnd(i * 19) * 46; var sg = cx.createRadialGradient(sx, sy, 0, sx, sy, sr); sg.addColorStop(0, 'rgba(18,16,13,' + (0.22 + rnd(i) * 0.22).toFixed(2) + ')'); sg.addColorStop(1, 'rgba(18,16,13,0)'); cx.fillStyle = sg; cx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2); }
for (var i = 0; i < 6; i++) { var gx = rnd(i * 23) * w, gy = rnd(i * 29) * h, gl = 40 + rnd(i * 31) * 90, ga = rnd(i * 37) * Math.PI; cx.strokeStyle = 'rgba(22,20,17,' + (0.18 + rnd(i * 41) * 0.15).toFixed(2) + ')'; cx.lineWidth = 3 + rnd(i * 43) * 5; cx.beginPath(); cx.moveTo(gx, gy); cx.lineTo(gx + Math.cos(ga) * gl, gy + Math.sin(ga) * gl); cx.stroke(); }
});
floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(1, 2);
var ceilTex = tex(512, 256, function(cx, cw, ch) { cx.fillStyle = '#4a4038'; cx.fillRect(0, 0, cw, ch); for (var i = 0; i < 15; i++) { cx.fillStyle = 'rgba(60,50,35,' + (rnd(i) * 0.3 + 0.1) + ')'; cx.beginPath(); cx.ellipse(rnd(i * 3) * cw, rnd(i * 5) * ch, rnd(i * 7) * 50 + 20, rnd(i * 9) * 20 + 10, 0, 0, Math.PI * 2); cx.fill(); } for (var wr = 0; wr < 5; wr++) { var wx = rnd(wr * 11) * cw, wy = rnd(wr * 13) * ch, wrr = 12 + rnd(wr * 17) * 26; cx.strokeStyle = 'rgba(60,48,32,0.35)'; cx.lineWidth = 1.5; cx.beginPath(); cx.arc(wx, wy, wrr, 0, Math.PI * 2); cx.stroke(); cx.fillStyle = 'rgba(52,42,30,0.12)'; cx.fill(); } });
ceilTex.wrapS = ceilTex.wrapT = THREE.RepeatWrapping; ceilTex.repeat.set(1, 2);
var woodBeam = new THREE.MeshStandardMaterial({ map: k.grain[2], color: 0x9a7a50, roughness: 0.85 });
var pipeMat = new THREE.MeshStandardMaterial({ color: 0x555550, roughness: 0.55, metalness: 0.35, envMap: k.roomEnv, envMapIntensity: 0.4 });
var ironMat = new THREE.MeshStandardMaterial({ color: 0x2a2a28, roughness: 0.7, metalness: 0.4, envMap: k.roomEnv, envMapIntensity: 0.3 });
var wireMat = new THREE.MeshStandardMaterial({ color: 0x888878, roughness: 0.7 });
var concrete = new THREE.MeshStandardMaterial({ color: 0x484540, roughness: 0.92 });
// ---------- THE ROOM ----------
var floor = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: floorTex, bumpMap: floorTex, bumpScale: 0.01, roughness: 0.9 }), 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceil = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.9 }), 0, H, 0); ceil.rotation.x = Math.PI / 2;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat(1, 3), -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2; left.receiveShadow = true;
var right = mesh(new THREE.PlaneGeometry(D, H), wallMat(2, 3), W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2; right.receiveShadow = true;
var far = mesh(new THREE.PlaneGeometry(W, H), wallMat(3, 1.5), 0, H / 2, -D / 2); far.receiveShadow = true;
var near = mesh(new THREE.PlaneGeometry(W, H), wallMat(4, 1.5), 0, H / 2, D / 2); near.rotation.y = Math.PI;
// joists, the two long bearers, the posts that hold the house up
for (var jz = -D / 2 + 1; jz <= D / 2 - 1; jz += 1.8) { var j = mesh(new THREE.BoxGeometry(W - 0.2, 0.12, 0.08), woodBeam, 0, H - 0.06, jz); j.castShadow = true; }
mesh(new THREE.BoxGeometry(0.15, 0.2, D - 0.4), woodBeam, -1.5, H - 0.1, 0); mesh(new THREE.BoxGeometry(0.15, 0.2, D - 0.4), woodBeam, 1.5, H - 0.1, 0);
[[-1.2, 1.5], [1.2, -1.5], [-1.3, -4.6]].forEach(function(p) { var post = mesh(new THREE.BoxGeometry(0.13, H, 0.13), woodBeam, p[0], H / 2, p[1]); post.castShadow = true; });
// pipes along the walls, a junction box, the wire stapled to the joist
var p1 = mesh(new THREE.CylinderGeometry(0.04, 0.04, D - 1, 8), pipeMat, -W / 2 + 0.15, H - 0.3, 0); p1.rotation.x = Math.PI / 2;
var p2 = mesh(new THREE.CylinderGeometry(0.05, 0.05, D - 3, 8), pipeMat, W / 2 - 0.2, 2.35, -0.5); p2.rotation.x = Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.04, 0.04, H, 8), ironMat, W / 2 - 0.15, H / 2, 2.4);
mesh(new THREE.BoxGeometry(0.3, 0.3, 0.5), ironMat, W / 2 - 0.25, H - 0.5, 1); mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8), ironMat, W / 2 - 0.15, H - 0.5, 0.3);
for (var cp = -4; cp < 5; cp += 4) { var cpipe = mesh(new THREE.CylinderGeometry(0.02, 0.02, W * 0.6, 6), wireMat, 0, H - 0.15, cp); cpipe.rotation.z = Math.PI / 2; }
// ---------- THE BULB, on its wire, with the air it lights ----------
var bulbG = new THREE.Group(); bulbG.position.set(0, H - 0.05, 0.6); scene.add(bulbG);
mesh(new THREE.CylinderGeometry(0.005, 0.005, 1.0, 4), wireMat, 0, -0.5, 0, bulbG);
mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.08, 8), ironMat, 0, -1.0, 0, bulbG);
var bulbGlass = new THREE.MeshStandardMaterial({ color: 0xeeeee8, roughness: 0.2, emissive: 0xe8d8b0, emissiveIntensity: 1.4, transparent: true, opacity: 0.9, toneMapped: false });
mesh(new THREE.SphereGeometry(0.06, 12, 8), bulbGlass, 0, -1.08, 0, bulbG);
var bulbLight = new THREE.PointLight(0xd8c8a0, 3.0, 16, 1.4); bulbLight.position.set(0, -1.12, 0); bulbLight.castShadow = true; bulbLight.shadow.mapSize.set(512, 512); bulbLight.shadow.radius = 6; bulbLight.shadow.bias = -0.002; bulbG.add(bulbLight);
var bulbGlow = k.glow(0, -1.08, 0, 0.7, 0.55, 0xf0e0b0, bulbG);
var shaft = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.9, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0xbbaa90, transparent: true, opacity: 0.045, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); shaft.position.set(0, -1.12 - 0.95, 0); bulbG.add(shaft);
var wirePts = [new THREE.Vector3(0, H - 1.0, 0.6), new THREE.Vector3(0.8, H - 0.6, 0.6), new THREE.Vector3(1.8, H - 0.3, 0.6), new THREE.Vector3(W / 2 - 0.1, H - 0.2, 0.6)];
scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(wirePts), 20, 0.008, 4, false), wireMat));
var bulbHit = mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.3, 8), M.hidden, 0, -0.65, 0, bulbG);
var hazeTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(160,150,130,0.3)'); g.addColorStop(0.55, 'rgba(140,130,115,0.12)'); g.addColorStop(1, 'rgba(120,112,100,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var haze = [];
for (var hz = 0; hz < 6; hz++) { var hs = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTex, transparent: true, opacity: 0.07 + rnd(hz) * 0.05, depthWrite: false })); hs.position.set((rnd(hz * 3) - 0.5) * 5, 0.9 + rnd(hz * 5) * 1.3, -2 + rnd(hz * 7) * 5); var hsc = 3.5 + rnd(hz * 9) * 3; hs.scale.set(hsc, hsc * 0.6, 1); hs.userData = { ph: rnd(hz * 11) * 6.28, sp: 0.12 + rnd(hz * 13) * 0.2, base: hs.material.opacity }; scene.add(hs); haze.push(hs); }
scene.add(new THREE.AmbientLight(0x1a1620, 0.9)); scene.add(new THREE.HemisphereLight(0x3a3630, 0x0a0806, 0.35));
var farFill = new THREE.PointLight(0x8090aa, 0.7, 8, 1.6); farFill.position.set(0, 2.2, -D / 2 + 0.5); scene.add(farFill);
var rim = new THREE.PointLight(0x506080, 0.35, 7, 2); rim.position.set(0.3, 1.2, -D / 2 + 3.0); scene.add(rim);
// ---------- THE TABLE at the far end: Quiet Frankie, Ashton opposite, her notebook, his hands ----------
var tableG = new THREE.Group(); tableG.position.set(0, 0, -D / 2 + 2.4); scene.add(tableG);
var tableMat = new THREE.MeshStandardMaterial({ map: k.grain[1], roughness: 0.8, envMap: k.roomEnv, envMapIntensity: 0.2 });
var top = mesh(new THREE.BoxGeometry(1.5, 0.06, 0.8), tableMat, 0, 0.72, 0, tableG); top.castShadow = true; top.receiveShadow = true;
[[-0.65, -0.3], [0.65, -0.3], [-0.65, 0.3], [0.65, 0.3]].forEach(function(l) { mesh(new THREE.BoxGeometry(0.06, 0.7, 0.06), M.darkWood, l[0], 0.35, l[1], tableG); });
// a lamp on the table with a green shade, the only other light in the room
mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.26, 8), M.brass, 0.45, 0.88, -0.15, tableG);
var shade = mesh(new THREE.ConeGeometry(0.14, 0.12, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0x1a4a2a, roughness: 0.6, side: THREE.DoubleSide, emissive: 0x0a2a14, emissiveIntensity: 0.4 }), 0.45, 1.02, -0.15, tableG);
mesh(new THREE.SphereGeometry(0.02, 8, 6), new THREE.MeshBasicMaterial({ color: 0xfff0c0, toneMapped: false }), 0.45, 0.98, -0.15, tableG);
var tableLight = new THREE.PointLight(0xffe0a0, 0.9, 3.2, 1.6); tableLight.position.set(0.45, 0.95, -0.15); tableG.add(tableLight);
var tableGlow = k.glow(0.45, 0.97, -0.15, 0.45, 0.4, 0xffe0a0, tableG);
// her notebook and pen, his glass, an ashtray with the night in it, a folded newspaper
mesh(new THREE.BoxGeometry(0.2, 0.015, 0.26), new THREE.MeshStandardMaterial({ color: 0xe0d8c8, roughness: 0.95 }), -0.35, 0.757, 0.12, tableG).rotation.y = 0.25;
mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.14, 6), M.black, -0.28, 0.77, 0.06, tableG).rotation.set(Math.PI / 2, 0, 0.6);
mesh(new THREE.CylinderGeometry(0.03, 0.028, 0.08, 12), M.glass, 0.35, 0.79, 0.2, tableG);
mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.03, 12), new THREE.MeshStandardMaterial({ color: 0xc27a18, roughness: 0.1, transparent: true, opacity: 0.7, emissive: 0x5a3000, emissiveIntensity: 0.3 }), 0.35, 0.765, 0.2, tableG);
mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.016, 14), new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.3, metalness: 0.2 }), 0.05, 0.758, -0.2, tableG);
mesh(new THREE.BoxGeometry(0.28, 0.01, 0.2), new THREE.MeshStandardMaterial({ color: 0xc8c0b0, roughness: 0.95 }), -0.5, 0.755, -0.22, tableG).rotation.y = -0.4;
// the two chairs and the two of them
function chair(x, z, ry, parent) { var c = new THREE.Group(); c.position.set(x, 0, z); c.rotation.y = ry; parent.add(c); mesh(new THREE.BoxGeometry(0.42, 0.04, 0.42), M.darkWood, 0, 0.45, 0, c); mesh(new THREE.BoxGeometry(0.42, 0.5, 0.04), M.darkWood, 0, 0.72, -0.19, c); [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 6), M.darkWood, l[0], 0.225, l[1], c); }); return c; }
chair(0.45, -0.55, 0, tableG); chair(-0.45, 0.55, Math.PI, tableG);
var frankie = k.ghost(0.45, 0, -D / 2 + 2.4 - 0.55, 3, 0.42, true, false, 1.2);      // Quiet Frankie, a planet, the sort of man with moons
var ashton = k.ghost(-0.45, 0, -D / 2 + 2.4 + 0.55, 5, 0.46, true, true, 0.95);   // Ashton Granger, twirling her hair, scribbling without looking
// ---------- COPPER, between you and the room ----------
var copper = k.ghost(-0.85, 0, 2.3, 7, 0.55, false, true, 0.92);                    // a big man in a small body, or the other way round
copper.hit.scale.set(1.5, 1, 1.5);
// ---------- THE STAIRS you came down, the door he closed behind you ----------
var stairG = new THREE.Group(); stairG.position.set(-W / 2 + 0.7, 0, -0.5); stairG.rotation.y = Math.PI; scene.add(stairG);
var stairMat = new THREE.MeshStandardMaterial({ map: k.grain[1], roughness: 0.85 });
for (var s = 0; s < 9; s++) { var st = mesh(new THREE.BoxGeometry(1.0, 0.22, 0.28), stairMat, 0, 0.11 + s * 0.22, s * 0.28, stairG); st.castShadow = true; st.receiveShadow = true; }
mesh(new THREE.BoxGeometry(0.08, 2.4, 2.7), concrete, 0.55, 1.2, 1.15, stairG);
var stairRail = mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.9, 8), ironMat, -0.45, 1.3, 1.15, stairG); stairRail.rotation.x = -Math.atan2(1.98, 2.5);
mesh(new THREE.BoxGeometry(0.9, 2.0, 0.08), M.darkWood, 0, 2.0 + 1.0, 2.6, stairG);
mesh(new THREE.SphereGeometry(0.03, 8, 6), M.brass, 0.32, 3.0, 2.56, stairG);
// the line of light under the door, and nothing else coming down it
mesh(new THREE.PlaneGeometry(0.86, 0.03), new THREE.MeshBasicMaterial({ color: 0xffe8c0, toneMapped: false }), 0, 2.0 + 0.02, 2.55, stairG);
var doorLine = new THREE.PointLight(0xffe0a0, 0.25, 2.5, 2); doorLine.position.set(0, 2.1, 2.3); stairG.add(doorLine);
var stairHit = mesh(new THREE.BoxGeometry(1.2, 3.2, 3.0), M.hidden, 0, 1.6, 1.3, stairG);
// ---------- THE CHESTERFIELD on its rug, against the right wall ----------
var rugTex = tex(512, 512, function(cx, w, h) {
cx.fillStyle = '#3a0e0e'; cx.fillRect(0, 0, w, h); cx.strokeStyle = '#1a0505'; cx.lineWidth = 14; cx.strokeRect(10, 10, w - 20, h - 20); cx.strokeStyle = '#7a5a20'; cx.lineWidth = 6; cx.strokeRect(22, 22, w - 44, h - 44);
for (var i = 35; i < w - 35; i += 18) { cx.fillStyle = '#5a3818'; cx.fillRect(i, 30, 8, 8); cx.fillRect(i, h - 38, 8, 8); cx.fillRect(30, i, 8, 8); cx.fillRect(w - 38, i, 8, 8); }
cx.strokeStyle = '#5a1818'; cx.lineWidth = 3; cx.strokeRect(45, 45, w - 90, h - 90); cx.strokeStyle = '#8a7a50'; cx.lineWidth = 1.5; cx.strokeRect(50, 50, w - 100, h - 100);
cx.save(); cx.translate(w / 2, h / 2); cx.rotate(Math.PI / 4); cx.fillStyle = '#4a1510'; cx.fillRect(-65, -65, 130, 130); cx.strokeStyle = '#7a5a28'; cx.lineWidth = 2; cx.strokeRect(-65, -65, 130, 130); cx.fillStyle = '#2a0a08'; cx.fillRect(-40, -40, 80, 80); cx.fillStyle = '#5a2015'; cx.fillRect(-18, -18, 36, 36); cx.restore();
[[120, 120], [w - 120, 120], [120, h - 120], [w - 120, h - 120]].forEach(function(c) { cx.save(); cx.translate(c[0], c[1]); cx.rotate(Math.PI / 4); cx.fillStyle = '#4a1812'; cx.fillRect(-25, -25, 50, 50); cx.fillStyle = '#3a0e0a'; cx.fillRect(-12, -12, 24, 24); cx.restore(); });
for (var i = 0; i < 40; i++) { cx.fillStyle = 'rgba(20,10,5,' + (rnd(i * 3) * 0.12) + ')'; cx.fillRect(rnd(i) * w, rnd(i * 5) * h, rnd(i * 7) * 30 + 5, rnd(i * 9) * 30 + 5); }
});
var rug = mesh(new THREE.PlaneGeometry(2.6, 3.6), new THREE.MeshStandardMaterial({ map: rugTex, roughness: 0.92 }), W / 2 - 1.2, 0.003, 0.2); rug.rotation.x = -Math.PI / 2; rug.receiveShadow = true;
var sofaG = new THREE.Group(); sofaG.position.set(W / 2 - 0.55, 0, 0.2); scene.add(sofaG);
var chesterRed = new THREE.MeshStandardMaterial({ color: 0x6a1818, roughness: 0.7 }), chesterDark = new THREE.MeshStandardMaterial({ color: 0x4a1010, roughness: 0.75 });
var sofaBody = mesh(new THREE.BoxGeometry(0.7, 0.35, 1.6), chesterRed, 0, 0.175, 0, sofaG); sofaBody.castShadow = true;
mesh(new THREE.BoxGeometry(0.6, 0.08, 1.5), chesterRed, 0, 0.39, 0, sofaG); mesh(new THREE.BoxGeometry(0.15, 0.5, 1.6), chesterDark, 0.28, 0.6, 0, sofaG);
mesh(new THREE.BoxGeometry(0.6, 0.35, 0.12), chesterDark, 0, 0.5, -0.8, sofaG); mesh(new THREE.BoxGeometry(0.6, 0.35, 0.12), chesterDark, 0, 0.5, 0.8, sofaG);
var tuftTex = tex(256, 128, function(cx, cw, ch) { cx.fillStyle = '#5a1515'; cx.fillRect(0, 0, cw, ch); for (var row = 0; row < 5; row++) for (var col = 0; col < 10; col++) { var tx = col * 26 + (row % 2 === 0 ? 0 : 13), ty = row * 26 + 5; cx.fillStyle = '#3a0a0a'; cx.beginPath(); cx.arc(tx + 13, ty + 13, 4, 0, Math.PI * 2); cx.fill(); cx.strokeStyle = '#4a1212'; cx.lineWidth = 0.8; cx.beginPath(); cx.moveTo(tx, ty + 13); cx.lineTo(tx + 13, ty); cx.lineTo(tx + 26, ty + 13); cx.lineTo(tx + 13, ty + 26); cx.closePath(); cx.stroke(); } });
var tuft = mesh(new THREE.PlaneGeometry(1.5, 0.45), new THREE.MeshStandardMaterial({ map: tuftTex, roughness: 0.75 }), 0.2, 0.6, 0, sofaG); tuft.rotation.y = -Math.PI / 2;
// a coat thrown over the arm, a folded racing paper, the dent where somebody sat
mesh(new THREE.BoxGeometry(0.5, 0.08, 0.5), new THREE.MeshStandardMaterial({ color: 0x1a1a20, roughness: 0.95 }), 0.05, 0.7, -0.75, sofaG).rotation.z = 0.2;
mesh(new THREE.BoxGeometry(0.22, 0.01, 0.3), M.paper, -0.05, 0.44, 0.35, sofaG).rotation.y = 0.3;
// ---------- STOCK: crates and a barrel by the left wall, a safe, the puddle ----------
var crateMat = new THREE.MeshStandardMaterial({ map: k.grain[2], roughness: 0.9 });
[[-2.3, -1.6, 0], [-2.2, -0.9, 0.5], [-2.35, -1.25, 0.3]].forEach(function(c, i) { var cr = mesh(new THREE.BoxGeometry(0.55, 0.42, 0.5), crateMat, c[0], 0.21 + (i === 2 ? 0.42 : 0), c[1], undefined); cr.rotation.y = c[2] * 0.3; cr.castShadow = true; });
mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.7, 12), M.darkWood, -2.3, 0.35, 0.4).castShadow = true;
var safe = mesh(new THREE.BoxGeometry(0.6, 0.8, 0.6), new THREE.MeshStandardMaterial({ color: 0x1e2a1e, roughness: 0.45, metalness: 0.5, envMap: k.roomEnv, envMapIntensity: 0.4 }), -2.4, 0.4, -3.6); safe.castShadow = true;
mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 20), M.brass, -2.09, 0.5, -3.6).rotation.y = Math.PI / 2;
var puddleTex = tex(256, 256, function(cx, cw, ch) { cx.clearRect(0, 0, cw, ch); var g = cx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, cw / 2); g.addColorStop(0, 'rgba(60,15,12,0.85)'); g.addColorStop(0.3, 'rgba(70,20,16,0.65)'); g.addColorStop(0.6, 'rgba(50,16,12,0.45)'); g.addColorStop(0.85, 'rgba(40,14,10,0.2)'); g.addColorStop(1, 'rgba(30,10,8,0)'); cx.fillStyle = g; cx.beginPath(); cx.moveTo(cw * 0.3, ch * 0.15); cx.quadraticCurveTo(cw * 0.7, ch * 0.05, cw * 0.8, ch * 0.3); cx.quadraticCurveTo(cw * 0.9, ch * 0.6, cw * 0.7, ch * 0.8); cx.quadraticCurveTo(cw * 0.5, ch * 0.95, cw * 0.25, ch * 0.75); cx.quadraticCurveTo(cw * 0.1, ch * 0.5, cw * 0.15, ch * 0.3); cx.quadraticCurveTo(cw * 0.2, ch * 0.1, cw * 0.3, ch * 0.15); cx.closePath(); cx.fill(); });
var puddle = mesh(new THREE.PlaneGeometry(1.6, 1.4), new THREE.MeshStandardMaterial({ map: puddleTex, transparent: true, roughness: 0.3, metalness: 0.2, envMap: k.roomEnv, envMapIntensity: 0.5 }), -0.6, 0.006, 2.2); puddle.rotation.x = -Math.PI / 2;
// the bulb in the puddle: a smear of it on the standing water
var reflTex = tex(64, 96, function(cx, w, h) { var g = cx.createRadialGradient(w / 2, h * 0.42, 0, w / 2, h * 0.42, w * 0.5); g.addColorStop(0, 'rgba(232,214,180,0.85)'); g.addColorStop(0.35, 'rgba(210,190,150,0.35)'); g.addColorStop(1, 'rgba(180,160,120,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); var tail = cx.createLinearGradient(0, h * 0.4, 0, h); tail.addColorStop(0, 'rgba(210,190,150,0.28)'); tail.addColorStop(1, 'rgba(180,160,120,0)'); cx.fillStyle = tail; cx.fillRect(w * 0.36, h * 0.4, w * 0.28, h * 0.6); });
var refl = mesh(new THREE.PlaneGeometry(0.34, 0.62), new THREE.MeshBasicMaterial({ map: reflTex, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), -0.46, 0.012, 2.0); refl.rotation.x = -Math.PI / 2;
// a drip from the ceiling into it, now and then
var drip = mesh(new THREE.SphereGeometry(0.012, 6, 6), new THREE.MeshStandardMaterial({ color: 0xc0c8d0, roughness: 0.1, transparent: true, opacity: 0.8 }), -0.46, H - 0.1, 2.0);
k.contact(-0.85, 0, 2.3, 1.1); k.contact(W / 2 - 0.55, 0, 0.2, 2.2);
// ---------- THE CLOSE-UPS ----------
var SZ = -D / 2 + 2.4;
var hotspots = [
{ root: copper.hit, name: 'Copper', pos: [-0.1, 1.55, 3.5], tgt: [-0.85, 0.75, 2.3], haloAt: [-0.85, 1.3, 2.3], haloSc: 0.9,
actions: function() { return k.byText(['Say nothing', "Give him Red's name", "Give him John's name"]); },
line: 'He is waiting for the words. He has the patience of a man who has already decided what to do with you either way. [Sam: Copper, when there is nothing left to say to him]' },
{ root: ashton.hit, name: 'Ashton Granger', pos: [-0.9, 1.4, SZ + 2.2], tgt: [-0.45, 0.55, SZ + 0.55], haloAt: [-0.45, 1.05, SZ + 0.55], haloSc: 0.8,
actions: function() { return k.byText(['Break the agreement. Look at her.']); },
line: 'She is still not looking at you, which takes work, and you can see the work. [Sam: Ashton after the agreement is kept or broken]' },
{ root: frankie.hit, name: 'Quiet Frankie', pos: [1.0, 1.45, SZ + 2.0], tgt: [0.45, 0.6, SZ - 0.55], haloAt: [0.45, 1.2, SZ - 0.55], haloSc: 1.0,
line: 'He has not moved. He does not need to. Everything in the room is already in orbit. [Sam: Quiet Frankie Muscat]' },
{ root: bulbHit, name: 'the bulb', pos: [0.3, 1.7, 2.0], tgt: [0, H - 1.1, 0.6], haloAt: [0, H - 1.1, 0.6], haloSc: 0.6,
line: 'One bulb on a wire, and the wire stapled along the joist to a box that has been opened with a knife. It swings when the door upstairs shuts. [Sam: the bulb]' },
{ root: stairHit, name: 'the stairs', pos: [-0.6, 1.5, 0.4], tgt: [-W / 2 + 0.7, 1.8, -2.0], haloAt: [-W / 2 + 0.7, 1.9, -2.0], haloSc: 1.4,
line: 'The stairs you do not remember coming down, and the door at the top of them, shut, with the pub going on behind it. [Sam: the way back, closed]' },
{ root: sofaG, name: 'the chesterfield', pos: [1.2, 1.3, 1.6], tgt: [W / 2 - 0.55, 0.6, 0.2], haloAt: [W / 2 - 0.7, 0.75, 0.2], haloSc: 1.3,
line: 'A chesterfield somebody carried down here once and nobody will carry up. A coat on the arm. The racing paper folded to a page. [Sam: the chesterfield]' }
];
return { hotspots: hotspots, frame: function(t, dt, still) {
if (still) return;
var sw = Math.sin(t * 0.6) * 0.06; bulbG.rotation.z = sw; bulbG.rotation.x = Math.cos(t * 0.45) * 0.03;
bulbLight.intensity = 3.0 + 0.08 * Math.sin(t * 9.3) + 0.05 * Math.sin(t * 2.1); bulbGlow.material.opacity = 0.55 + 0.03 * Math.sin(t * 9.3);
tableLight.intensity = 0.9 + 0.04 * Math.sin(t * 1.7);
for (var i = 0; i < haze.length; i++) { var h = haze[i]; h.position.x += Math.sin(t * h.userData.sp + h.userData.ph) * 0.0015; h.material.opacity = h.userData.base * (0.8 + 0.2 * Math.sin(t * 0.3 + h.userData.ph)); }
var cyc = (t % 6) / 6; drip.position.y = cyc < 0.7 ? H - 0.1 : H - 0.1 - (cyc - 0.7) / 0.3 * (H - 0.11); drip.visible = cyc > 0.6;
refl.material.opacity = 0.18 + (cyc > 0.95 ? 0.1 : 0) + 0.02 * Math.sin(t * 9.3);
} };
}
});

