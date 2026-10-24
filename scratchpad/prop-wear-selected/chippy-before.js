// ====== INSIDE THE CHINESE FISH AND CHIPS — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-30. Built from what is written of the Chinese Fish and Chips on
// Greek Street: a narrow shop under strip lights, the stainless range with
// its fryers and its hot cabinet, a menu board, a formica counter you eat
// at with a stool or two, salt and vinegar and the vinegar-brown paper, the
// window onto the street and the street going past it. The room sits at
// the top of the Chinese Fish and Chips passage (#cf-container) and is its
// navigation: the plate on the counter opens "Eat." and the window holds
// the lily while the passage offers it. The range, the menu, the ticket on
// the table and the door are inspections, their card words pink
// placeholders for Sam. Nothing about the game is decided in JS.
window.dssRoomKit({
id: 'cf', caption: 'CHINESE FISH AND CHIPS, GREEK STREET', captionColor: 'rgba(190,215,255,0.28)',
bg: 0x0a0c10, fog: [0x10141a, 0.04], exposure: 0.66, bloom: { bloomStrength: 0.32, bloomRadius: 0.6, bloomThreshold: 0.8 },
env: ['#c0d0e0', '#5a6270', '#101418', '#e8f0ff'],
wash: 'linear-gradient(180deg,rgba(180,210,255,0.06) 0%,rgba(10,12,16,0.02) 30%,rgba(10,12,16,0.02) 60%,rgba(4,5,8,0.42) 100%)',
vignette: 'radial-gradient(ellipse at 50% 40%,transparent 30%,rgba(0,0,4,0.66) 100%)',
card: { fg: 'rgba(225,232,245,0.92)', bg: 'rgba(8,10,14,0.82)', border: 'rgba(170,200,240,0.3)', dim: 'rgba(180,200,230,0.5)', btn: 'rgba(225,235,255,0.95)', btnBorder: 'rgba(170,200,240,0.45)' },
cam: function(portrait) { return portrait ? { x: 0.4, y: 1.55, z: -2.6, tx: -0.1, ty: 1.1, tz: 2.2 } : { x: 0.6, y: 1.55, z: -2.3, tx: -0.2, ty: 1.15, tz: 2.2 }; },
build: function(k) {
var scene = k.scene, mesh = k.mesh, tex = k.tex, rnd = k.rnd, M = k.M;
var detail=window.dssDetailProps(mesh,tex,k.roomEnv,scene);
var W = 4.2, D = 6.4, H = 2.9;
// ---------- THE SHOP: white tiles to the shoulder, cream paint above, a lino floor, a suspended ceiling ----------
var tileTex = tex(512, 256, function(cx, w, h) { cx.fillStyle = '#b3ab97'; cx.fillRect(0, 0, w, h); var tw = 64, th = 32; for (var r = 0; r < h / th; r++) for (var c = -1; c < w / tw + 1; c++) { var x = c * tw + (r % 2 ? tw / 2 : 0), y = r * th, sh = 222 + Math.floor(rnd(r * 31 + c * 7) * 18); cx.fillStyle = 'rgb(' + sh + ',' + (sh - 2) + ',' + (sh - 10) + ')'; cx.fillRect(x + 1.5, y + 1.5, tw - 3, th - 3); var g = cx.createLinearGradient(x, y, x + tw, y + th); g.addColorStop(0, 'rgba(255,255,255,0.25)'); g.addColorStop(1, 'rgba(0,0,0,0.08)'); cx.fillStyle = g; cx.fillRect(x + 1.5, y + 1.5, tw - 3, th - 3); } for (var i = 0; i < 40; i++) { cx.fillStyle = 'rgba(120,100,60,' + (rnd(i) * 0.15) + ')'; cx.beginPath(); cx.arc(rnd(i * 3) * w, h * 0.7 + rnd(i * 5) * h * 0.3, 4 + rnd(i * 7) * 14, 0, 6.3); cx.fill(); } });
tileTex.wrapS = tileTex.wrapT = THREE.RepeatWrapping;
function tiles(len, x, z, ry) { var t = tileTex.clone(); t.needsUpdate = true; t.repeat.set(len / 2, 1); var m = new THREE.MeshStandardMaterial({ map: t, roughness: 0.25, envMap: k.roomEnv, envMapIntensity: 0.5 }); var p = mesh(new THREE.PlaneGeometry(len, 1.5), m, x, 0.75, z); p.rotation.y = ry; p.receiveShadow = true; return p; }
var creamPaint = k.paintTex('#c8c0a8', 51, 'rgba(150,130,80,0.12)');
var wallMat = new THREE.MeshStandardMaterial({ map: creamPaint, roughness: 0.9 });
var linoTex = tex(512, 512, function(cx, w, h) { for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) { cx.fillStyle = (r + c) % 2 ? '#2a2a30' : '#8a8478'; cx.fillRect(c * 64, r * 64, 64, 64); } for (var i = 0; i < 6000; i++) { cx.fillStyle = i % 2 ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,240,0.06)'; cx.fillRect(rnd(i) * w, rnd(i * 3) * h, 1.5, 1.5); } for (var s = 0; s < 14; s++) { cx.fillStyle = 'rgba(60,40,20,' + (rnd(s) * 0.25) + ')'; cx.beginPath(); cx.ellipse(rnd(s * 3) * w, rnd(s * 5) * h, 10 + rnd(s * 7) * 30, 6 + rnd(s * 9) * 18, rnd(s) * 3, 0, 6.3); cx.fill(); } });
linoTex.wrapS = linoTex.wrapT = THREE.RepeatWrapping; linoTex.repeat.set(2, 3);
var floor = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: linoTex, roughness: 0.35, envMap: k.roomEnv, envMapIntensity: 0.45 }), 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceilTex = tex(256, 256, function(cx, w, h) { cx.fillStyle = '#d8d4c8'; cx.fillRect(0, 0, w, h); cx.strokeStyle = '#8a8a80'; cx.lineWidth = 3; for (var i = 0; i <= 2; i++) { cx.beginPath(); cx.moveTo(i * 128, 0); cx.lineTo(i * 128, h); cx.stroke(); cx.beginPath(); cx.moveTo(0, i * 128); cx.lineTo(w, i * 128); cx.stroke(); } for (var i = 0; i < 3000; i++) { cx.fillStyle = 'rgba(0,0,0,0.06)'; cx.fillRect(rnd(i) * w, rnd(i * 3) * h, 1, 1); } cx.fillStyle = 'rgba(120,90,40,0.25)'; cx.beginPath(); cx.arc(60, 190, 40, 0, 6.3); cx.fill(); });
ceilTex.wrapS = ceilTex.wrapT = THREE.RepeatWrapping; ceilTex.repeat.set(4, 6);
var ceil = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.95 }), 0, H, 0); ceil.rotation.x = Math.PI / 2;
var back = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2); var front = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, D / 2); front.rotation.y = Math.PI;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2; var right = mesh(new THREE.PlaneGeometry(D, H), wallMat, W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2;
tiles(W, 0, -D / 2 + 0.01, 0); tiles(D, -W / 2 + 0.01, 0, Math.PI / 2); tiles(D, W / 2 - 0.01, 0, -Math.PI / 2);
// ---------- THE STRIP LIGHTS: two tubes, one of them thinking about it ----------
var tubes = [];
[-1.6, 1.0].forEach(function(tz, i) { var g = new THREE.Group(); g.position.set(0, H - 0.08, tz); scene.add(g); mesh(new THREE.BoxGeometry(1.6, 0.06, 0.16), new THREE.MeshStandardMaterial({ color: 0xd8d8d0, roughness: 0.5, metalness: 0.3 }), 0, 0.02, 0, g); var tube = mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 12), new THREE.MeshBasicMaterial({ color: 0xe8f0ff, toneMapped: false }), 0, -0.03, 0, g); tube.rotation.z = Math.PI / 2; var l = new THREE.PointLight(0xdce8ff, 0.7, 6, 1.6); l.position.set(0, -0.15, 0); g.add(l); if (i === 0) { l.castShadow = true; l.shadow.mapSize.set(512, 512); l.shadow.bias = -0.002; } var gl = k.glow(0, -0.03, 0, 2.4, 0.4, 0xd8e8ff, g); gl.scale.set(2.4, 0.6, 1); tubes.push({ tube: tube, l: l, gl: gl, ph: i * 2 }); });
// ---------- THE RANGE: stainless, the fryers, the hot cabinet with its lamp, the chips under it ----------
var steel = new THREE.MeshStandardMaterial({ color: 0xc8ccd0, roughness: 0.28, metalness: 0.85, envMap: k.roomEnv, envMapIntensity: 1.0 });
var steelDull = new THREE.MeshStandardMaterial({ color: 0x9a9ea2, roughness: 0.45, metalness: 0.7, envMap: k.roomEnv, envMapIntensity: 0.6 });
var rangeG = new THREE.Group(); rangeG.position.set(-W / 2 + 0.55, 0, 0.0); rangeG.rotation.y = Math.PI / 2; scene.add(rangeG);
var rangeBody = mesh(new THREE.BoxGeometry(3.4, 0.95, 0.9), steel, 0, 0.475, 0, rangeG); rangeBody.castShadow = true;
mesh(new THREE.BoxGeometry(3.5, 0.05, 1.0), steel, 0, 0.975, 0, rangeG);
// two fryers with their baskets, the oil dark and moving
[-1.1, -0.3].forEach(function(fx, i) { mesh(new THREE.BoxGeometry(0.62, 0.02, 0.62), steelDull, fx, 1.0, 0, rangeG); var oil = mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshPhysicalMaterial({ color: 0x3a2a10, roughness: 0.05, metalness: 0.1, envMap: k.roomEnv, envMapIntensity: 1.2, clearcoat: 1 }), fx, 0.99, 0, rangeG); oil.rotation.x = -Math.PI / 2; var basket=detail.group(fx,1.08,0,rangeG),wirePositions=[];
function segment(x,y,z,xx,yy,zz){wirePositions.push(x,y,z,xx,yy,zz);}
for(var w=0;w<=12;w++){var v=-0.2+w/12*0.4;
segment(v,-0.07,-0.2,v,-0.07,0.2);segment(-0.2,-0.07,v,0.2,-0.07,v);
segment(v,-0.07,-0.2,v,0.07,-0.2);segment(v,-0.07,0.2,v,0.07,0.2);
segment(-0.2,-0.07,v,-0.2,0.07,v);segment(0.2,-0.07,v,0.2,0.07,v);}
for(var level=0;level<4;level++){var y=-0.07+level*0.047;segment(-0.2,y,-0.2,0.2,y,-0.2);segment(-0.2,y,0.2,0.2,y,0.2);segment(-0.2,y,-0.2,-0.2,y,0.2);segment(0.2,y,-0.2,0.2,y,0.2);}
var meshGeo=new THREE.BufferGeometry();meshGeo.setAttribute('position',new THREE.Float32BufferAttribute(wirePositions,3));basket.add(new THREE.LineSegments(meshGeo,new THREE.LineBasicMaterial({color:0x8e9186})));
var grip=mesh(new THREE.CylinderGeometry(0.014,0.014,0.13,12),detail.material('#38352b','glaze'),fx,1.345,0.405,rangeG);grip.rotation.x=0.9;
 mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.4, 6), steel, fx, 1.25, 0.28, rangeG).rotation.x = 0.9; for (var b = 0; b < 4; b++) mesh(new THREE.SphereGeometry(0.02, 6, 5), new THREE.MeshBasicMaterial({ color: 0xfff0d0, transparent: true, opacity: 0.35 }), fx + (rnd(b + i * 9) - 0.5) * 0.4, 1.0, (rnd(b * 3 + i) - 0.5) * 0.4, rangeG); });
[-1.1,-0.3].forEach(function(fx){
var knob=mesh(new THREE.CylinderGeometry(0.025,0.025,0.014,20),detail.material('#37382f','glaze'),fx,0.79,0.46,rangeG);knob.rotation.x=Math.PI/2;
mesh(new THREE.BoxGeometry(0.002,0.014,0.002),M.chrome,fx,0.8,0.468,rangeG);
var lamp=mesh(new THREE.SphereGeometry(0.006,10,6),detail.material('#98642d','glaze'),fx+0.08,0.79,0.461,rangeG);lamp.scale.z=0.35;
[-1,1].forEach(function(side){var screw=mesh(new THREE.SphereGeometry(0.003,6,4),M.chrome,fx+side*0.16,0.86,0.455,rangeG);screw.scale.z=0.3;});
});
// the hot cabinet: glass front, the lamp inside, the fish and the chips under it
var cabG = new THREE.Group(); cabG.position.set(0.95, 1.0, 0); rangeG.add(cabG);
mesh(new THREE.BoxGeometry(1.2, 0.6, 0.7), steel, 0, 0.3, 0, cabG); mesh(new THREE.PlaneGeometry(1.1, 0.5), new THREE.MeshPhysicalMaterial({ color: 0xf0f4f8, roughness: 0.05, transparent: true, opacity: 0.25, envMap: k.roomEnv, envMapIntensity: 1, clearcoat: 1 }), 0, 0.32, 0.36, cabG);
var chipTex = tex(128, 128, function(cx, w, h) { cx.fillStyle = '#c8901a'; cx.fillRect(0, 0, w, h); for (var i = 0; i < 90; i++) { cx.save(); cx.translate(rnd(i) * w, rnd(i * 3) * h); cx.rotate(rnd(i * 5) * 3); cx.fillStyle = ['#e8b040', '#d89a28', '#f0c860', '#b87818'][i % 4]; cx.fillRect(-14, -3, 28, 6); cx.restore(); } });
mesh(new THREE.BoxGeometry(0.5, 0.14, 0.5), new THREE.MeshStandardMaterial({ map: chipTex, roughness: 0.6 }), -0.28, 0.14, 0, cabG);
for (var fs = 0; fs < 4; fs++) { var fish = mesh(new THREE.BoxGeometry(0.28, 0.05, 0.12), new THREE.MeshStandardMaterial({ color: [0xd8a040, 0xc89030, 0xe0b050, 0xb88028][fs], roughness: 0.55 }), 0.3, 0.1 + fs * 0.03, -0.18 + fs * 0.12, cabG); fish.rotation.y = (rnd(fs) - 0.5) * 0.5; }
var cabLamp = mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.0, 8), new THREE.MeshBasicMaterial({ color: 0xff7030, toneMapped: false }), 0, 0.52, 0, cabG); cabLamp.rotation.z = Math.PI / 2;
var cabLight = new THREE.PointLight(0xff8040, 1.2, 2.4, 1.6); cabLight.position.set(0, 0.45, 0.1); cabG.add(cabLight);
var cabGlow = k.glow(0, 0.5, 0.05, 1.3, 0.45, 0xff8040, cabG); cabGlow.scale.set(1.4, 0.5, 1);
// the extractor hood with its grease, the wok burner at the end, the vinegar bottles and the salt
mesh(new THREE.BoxGeometry(3.0, 0.5, 0.8), steelDull, 0, 2.5, -0.1, rangeG); mesh(new THREE.BoxGeometry(2.9, 0.04, 0.7), new THREE.MeshStandardMaterial({ color: 0x4a4038, roughness: 0.9 }), 0, 2.24, -0.1, rangeG);
mesh(new THREE.CylinderGeometry(0.22, 0.14, 0.14, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.8, metalness: 0.5, side: THREE.DoubleSide }), -1.5, 1.06, 0.1, rangeG); var wokFlame = k.glow(-1.5, 1.0, 0.1, 0.36, 0.6, 0x4080ff);
[[1.55, 0.2, 0xc8b080], [1.62, 0.32, 0x3a2a10], [1.48, 0.36, 0xe8e8e0]].forEach(function(b, i) { mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.14, 8), new THREE.MeshStandardMaterial({ color: b[2], roughness: 0.4, transparent: i === 1, opacity: 0.85 }), b[0], 1.07, b[1], rangeG); });
// the man at the range, a trace in the steam, with his back to you
var cook = k.ghost(-W / 2 + 1.3, 0, 0.4, 41, 0.3, false, false, 1.0);
var steamTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(240,244,255,0.25)'); g.addColorStop(0.4, 'rgba(200,210,230,0.1)'); g.addColorStop(1, 'rgba(160,170,190,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var steam = []; for (var s = 0; s < 4; s++) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, transparent: true, opacity: 0.16, depthWrite: false })); sp.position.set(-W / 2 + 0.55, 1.3 + rnd(s) * 0.4, -1.1 + s * 0.35); sp.scale.set(0.8, 0.8, 1); sp.userData = { ph: s * 1.7, y0: sp.position.y }; scene.add(sp); steam.push(sp); }
var rangeHit = mesh(new THREE.BoxGeometry(3.6, 1.5, 1.1), M.hidden, 0, 0.75, 0, rangeG);
// ---------- THE MENU BOARD over the range, the prices in plastic letters ----------
var menuTex = tex(768, 256, function(cx, w, h) { cx.fillStyle = '#1a1a1a'; cx.fillRect(0, 0, w, h); cx.strokeStyle = '#8a8a80'; cx.lineWidth = 4; cx.strokeRect(6, 6, w - 12, h - 12); cx.fillStyle = '#f0f0e8'; cx.font = 'bold 26px Arial,sans-serif'; cx.textAlign = 'left'; var L = [['COD', '38p'], ['ROCK SALMON', '35p'], ['SAVELOY', '8p'], ['WALLY', '3p'], ['CHOW MEIN', '45p'], ['CHOP SUEY', '40p'], ['FOO YUNG', '42p']]; /* 2026-10-16: the board reads as THE PRIME's menu line does; the chow mein stays 45p for THE OLDBOY's nine shillings */ for (var i = 0; i < L.length; i++) { var col = i < 4 ? 0 : 1, row = i % 4; cx.fillStyle = i % 2 ? '#f0f0e8' : '#ffd040'; cx.fillText(L[i][0], 30 + col * 380, 60 + row * 46); cx.textAlign = 'right'; cx.fillText(L[i][1], 350 + col * 380, 60 + row * 46); cx.textAlign = 'left'; } for (var g = 0; g < 700; g++) { cx.fillStyle = 'rgba(0,0,0,0.25)'; cx.fillRect(rnd(g) * w, rnd(g * 3) * h, 2, 1); } });
var menu = mesh(new THREE.PlaneGeometry(3.0, 1.0), new THREE.MeshStandardMaterial({ map: menuTex, roughness: 0.6 }), -W / 2 + 0.03, 1.72, 0.0); menu.rotation.y = Math.PI / 2; /* 2026-10-16: lowered from 2.05, the hood hid the top row (COD, the 45p CHOW MEIN) */
var menuLight = new THREE.PointLight(0xfff0d0, 0.5, 3, 2); menuLight.position.set(-W / 2 + 0.8, 2.5, 0.0); scene.add(menuLight);
// ---------- THE COUNTER you eat at, along the right wall, your plate on it ----------
var counterG = new THREE.Group(); counterG.position.set(W / 2 - 0.35, 0, 0.2); scene.add(counterG);
var formica=detail.material('#c6a38e','glaze');formica.roughness=0.42;
mesh(new THREE.BoxGeometry(0.5, 0.05, 3.2), formica, 0, 0.98, 0, counterG); mesh(new THREE.BoxGeometry(0.5, 0.06, 3.2), M.chrome, 0, 0.94, 0, counterG); [[-1.4], [0], [1.4]].forEach(function(b) { mesh(new THREE.BoxGeometry(0.06, 0.9, 0.06), M.chrome, -0.2, 0.45, b[0], counterG); });
function stool(z) { var g = new THREE.Group(); g.position.set(-0.45, 0, z); counterG.add(g); var seat=mesh(new THREE.SphereGeometry(1,24,10),detail.material('#9c3f37','cloth'),0,0.7,0,g);seat.scale.set(0.17,0.037,0.17);detail.arc(g,0.164,0.002,detail.material('#c68067','cloth'),0,0.699,0);mesh(new THREE.CylinderGeometry(0.033,0.033,0.025,16),M.chrome,0,0.65,0,g); mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.66, 8), M.chrome, 0, 0.35, 0, g); mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.03, 16), M.chrome, 0, 0.02, 0, g); return g; }
stool(-0.9); stool(0.1); var yourStool = stool(1.0);
for(var scratch=0;scratch<14;scratch++){var line=mesh(new THREE.BoxGeometry(0.012+scratch%3*0.011,0.0003,0.0004),detail.material('#a78e7a','paper'),-0.1+scratch%4*0.07,1.005,-1.2+scratch*0.17,counterG);line.rotation.y=scratch*0.7;}
// your plate: fish, chips, the paper it came in, salt, vinegar, a fork
var plateG = new THREE.Group(); plateG.position.set(0.02, 1.005, 1.0); counterG.add(plateG);
var paperTex = tex(256, 256, function(cx, w, h) { cx.fillStyle = '#e8e0c8'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#2a2a2a'; for (var l = 0; l < 30; l++) { cx.fillRect(10, 8 + l * 8, 20 + rnd(l * 3) * 200, 1.5); } cx.fillStyle = 'rgba(140,100,40,0.35)'; cx.beginPath(); cx.ellipse(130, 130, 90, 70, 0.3, 0, 6.3); cx.fill(); });
var paper = mesh(new THREE.PlaneGeometry(0.42, 0.36), new THREE.MeshStandardMaterial({ map: paperTex, roughness: 0.95 }), 0, 0.002, 0, plateG); paper.rotation.x = -Math.PI / 2; paper.rotation.z = 0.2;
detail.lathe([[0,0],[0.09,0],[0.125,0.004],[0.15,0.012],[0.15,0.016],[0.14,0.017],[0.12,0.007],[0,0.007]],detail.material('#dedbca','glaze'),0,0.004,0,plateG);detail.arc(plateG,0.146,0.0014,detail.material('#bdbda9','glaze'),0,0.021,0);
var chipMat = new THREE.MeshStandardMaterial({ color: 0xd9a63a, roughness: 0.75 });
for (var ch = 0; ch < 14; ch++) { var chip = mesh(new THREE.BoxGeometry(0.012, 0.012, 0.07 + k.rnd(ch) * 0.05), chipMat, -0.05 + (k.rnd(ch * 7) - 0.5) * 0.17, 0.028 + (ch % 3) * 0.011, 0.03 + (k.rnd(ch * 3) - 0.5) * 0.2, plateG); chip.rotation.y = k.rnd(ch * 11) * 3.1; chip.rotation.z = (k.rnd(ch * 13) - 0.5) * 0.4; }
var batterTex = tex(128, 64, function(cx, w, h) { cx.fillStyle = '#c99438'; cx.fillRect(0, 0, w, h); for (var i = 0; i < 400; i++) { cx.fillStyle = i % 3 ? 'rgba(90,50,10,0.35)' : 'rgba(240,200,120,0.4)'; cx.fillRect(k.rnd(i) * w, k.rnd(i * 5) * h, 1 + k.rnd(i * 2) * 3, 1 + k.rnd(i * 4) * 2); } });
var fishOn = mesh(new THREE.SphereGeometry(1, 18, 12), new THREE.MeshStandardMaterial({ map: batterTex, bumpMap: batterTex, bumpScale: 0.004, roughness: 0.8 }), 0.02, 0.055, -0.06, plateG); fishOn.scale.set(0.13, 0.028, 0.055); fishOn.rotation.y = 0.3;
detail.lathe([[0,0],[0.017,0],[0.018,0.008],[0.014,0.078],[0.012,0.084],[0,0.084]],detail.glass,0.2,0.015,0.12,plateG);
mesh(new THREE.CylinderGeometry(0.012,0.015,0.05,20),detail.material('#d2cebd','paper'),0.2,0.043,0.12,plateG);
mesh(new THREE.CylinderGeometry(0.0145,0.0145,0.01,20),detail.material('#999d94','metal'),0.2,0.101,0.12,plateG);
for(var hole=0;hole<7;hole++){var angle=hole*Math.PI/3,r=hole===6?0:0.008;detail.button(plateG,0.2+Math.cos(angle)*r,0.107,0.12+Math.sin(angle)*r,0.0012,'#383c35');} var vinegarG=detail.group(0.25,0.015,0.05,plateG);detail.bottle(vinegarG,0.082,0.019,0x66502a,2);
mesh(new THREE.CylinderGeometry(0.008,0.008,0.01,16),detail.material('#aaaca1','metal'),0,0.115,0,vinegarG);
mesh(new THREE.CylinderGeometry(0.0025,0.0035,0.008,10),M.chrome,0.003,0.123,0,vinegarG);
var forkG=detail.group(0.12,0.023,0.06,plateG);forkG.rotation.y=-0.4;
var handle=mesh(new THREE.SphereGeometry(1,16,8),M.chrome,0,0,0.025,forkG);handle.scale.set(0.006,0.002,0.055);
mesh(new THREE.BoxGeometry(0.006,0.003,0.035),M.chrome,0,0,-0.035,forkG);mesh(new THREE.BoxGeometry(0.027,0.003,0.012),M.chrome,0,0.001,-0.055,forkG);
for(var tine=0;tine<4;tine++)mesh(new THREE.BoxGeometry(0.0025,0.002,0.024),M.chrome,(tine-1.5)*0.007,0.002,-0.072,forkG);
var plateHit = mesh(new THREE.BoxGeometry(0.55, 0.3, 0.5), M.hidden, 0.05, 0.1, 0, plateG);
// the ticket, the number on it, on the counter beside your elbow, and the tea
var ticket = mesh(new THREE.PlaneGeometry(0.06, 0.09), new THREE.MeshStandardMaterial({ map: tex(64, 96, function(cx, w, h) { cx.fillStyle = '#f0e8d8'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#1a1a1a'; cx.font = 'bold 26px Arial'; cx.textAlign = 'center'; cx.fillText('47', 32, 40); cx.font = '10px Arial'; cx.fillText('魚 薯條', 32, 62); cx.fillStyle = 'rgba(120,80,30,0.5)'; cx.beginPath(); cx.arc(46, 78, 8, 0, 6.3); cx.fill(); }), roughness: 0.95 }), -0.1, 1.008, 0.55, counterG); ticket.rotation.x = -Math.PI / 2; ticket.rotation.z = -0.5;
var ticketHit = mesh(new THREE.BoxGeometry(0.2, 0.1, 0.2), M.hidden, -0.1, 1.03, 0.55, counterG);
mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.08, 14), new THREE.MeshStandardMaterial({ color: 0xf0f0e8, roughness: 0.3 }), 0.12, 1.045, 0.5, counterG); mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.005, 14), new THREE.MeshStandardMaterial({ color: 0x7a4a20, roughness: 0.3 }), 0.12, 1.08, 0.5, counterG);
// the newly-empty table by the door with its matchbox, its ashtray and its paper
var tableG = new THREE.Group(); tableG.position.set(-1.15, 0, 2.5); scene.add(tableG); mesh(new THREE.BoxGeometry(0.9, 1.0, 0.9), M.hidden, 0, 0.5, 0, tableG);
mesh(new THREE.BoxGeometry(0.7, 0.04, 0.6), formica, 0, 0.74, 0, tableG); mesh(new THREE.BoxGeometry(0.7, 0.05, 0.6), M.chrome, 0, 0.7, 0, tableG); mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.68, 8), M.chrome, 0, 0.35, 0, tableG); mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 16), M.chrome, 0, 0.01, 0, tableG);
var matchG=detail.group(0.18,0.77,0.1,tableG);matchG.rotation.y=0.5;
mesh(new THREE.BoxGeometry(0.06,0.017,0.04),detail.material('#b59c63','paper'),0,0,0,matchG);
mesh(new THREE.BoxGeometry(0.002,0.012,0.034),detail.material('#d8ccb0','paper'),0.031,0,0,matchG);
mesh(new THREE.BoxGeometry(0.052,0.009,0.001),detail.material('#654b37','cloth'),0,0,0.0205,matchG);
mesh(new THREE.BoxGeometry(0.035,0.0005,0.021),detail.material('#8a4933','paper'),0,0.009,0,matchG); detail.ash(-0.15,0.76,-0.1,tableG,0.04);
mesh(new THREE.BoxGeometry(0.3, 0.008, 0.2), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.95 }), -0.05, 0.765, 0.15, tableG).rotation.y = -0.3;
[[0.45, 0], [-0.45, 0]].forEach(function(c) { var ch = new THREE.Group(); ch.position.set(c[0], 0, c[1]); ch.rotation.y = c[0] > 0 ? -Math.PI / 2 : Math.PI / 2; tableG.add(ch); mesh(new THREE.BoxGeometry(0.38, 0.05, 0.38), new THREE.MeshStandardMaterial({ color: 0xc03030, roughness: 0.35 }), 0, 0.46, 0, ch); mesh(new THREE.BoxGeometry(0.38, 0.32, 0.04), new THREE.MeshStandardMaterial({ color: 0xc03030, roughness: 0.35 }), 0, 0.68, -0.17, ch); [[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.44, 6), M.chrome, l[0], 0.22, l[1], ch); }); });
k.contact(-1.35, 0, 1.9, 1.3);
// ---------- THE WINDOW onto Greek Street and THE DOOR beside it: the street going past, and her ----------
var winG = new THREE.Group(); winG.position.set(-0.6, 1.55, D / 2 - 0.03); winG.rotation.y = Math.PI; scene.add(winG);
mesh(new THREE.BoxGeometry(2.2, 2.2, 0.1), new THREE.MeshStandardMaterial({ color: 0x2a3a2a, roughness: 0.7 }), 0, 0, 0, winG);
var streetTex = tex(512, 512, function(cx, w, h) { var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0a0c14'); g.addColorStop(0.55, '#141420'); g.addColorStop(1, '#1e1a1e'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); cx.fillStyle = '#1a1614'; cx.fillRect(0, h * 0.2, w, h * 0.5); for (var wi = 0; wi < 10; wi++) { cx.fillStyle = rnd(wi) < 0.4 ? 'rgba(255,200,120,0.55)' : 'rgba(30,30,50,0.9)'; cx.fillRect(30 + (wi % 5) * 95, h * 0.26 + Math.floor(wi / 5) * 90, 40, 60); } cx.fillStyle = '#2a2a30'; cx.fillRect(0, h * 0.7, w, h * 0.3); var lg = cx.createRadialGradient(400, h * 0.3, 0, 400, h * 0.3, 120); lg.addColorStop(0, 'rgba(255,220,150,0.9)'); lg.addColorStop(0.2, 'rgba(255,200,120,0.4)'); lg.addColorStop(1, 'rgba(255,200,120,0)'); cx.fillStyle = lg; cx.fillRect(0, 0, w, h); cx.fillStyle = '#0a0a0a'; cx.fillRect(396, h * 0.3, 6, h * 0.42); var rg = cx.createLinearGradient(0, h * 0.7, 0, h); rg.addColorStop(0, 'rgba(255,220,150,0.25)'); rg.addColorStop(1, 'rgba(255,220,150,0)'); cx.fillStyle = rg; cx.fillRect(360, h * 0.7, 80, h * 0.3); for (var r = 0; r < 600; r++) { cx.fillStyle = 'rgba(200,220,255,0.15)'; cx.fillRect(rnd(r * 3) * w, rnd(r * 5) * h, 1, 3 + rnd(r) * 5); } });
mesh(new THREE.PlaneGeometry(2.0, 2.0), new THREE.MeshBasicMaterial({ map: streetTex, toneMapped: false }), 0, 0, 0.055, winG);
mesh(new THREE.PlaneGeometry(2.0, 2.0), new THREE.MeshPhysicalMaterial({ color: 0xf0f4ff, roughness: 0.05, transparent: true, opacity: 0.12, envMap: k.roomEnv, envMapIntensity: 1, clearcoat: 1 }), 0, 0, 0.06, winG);
var letterTex = tex(512, 96, function(cx, w, h) { cx.clearRect(0, 0, w, h); cx.save(); cx.translate(w, 0); cx.scale(-1, 1); cx.fillStyle = 'rgba(240,60,50,0.9)'; cx.font = 'bold 44px Arial,sans-serif'; cx.textAlign = 'center'; cx.fillText('FISH & CHIPS', w / 2, 62); cx.fillStyle = 'rgba(240,200,60,0.9)'; cx.font = 'bold 30px Arial'; cx.fillText('中國', 70, 60); cx.restore(); });
mesh(new THREE.PlaneGeometry(2.0, 0.375), new THREE.MeshBasicMaterial({ map: letterTex, transparent: true, toneMapped: false }), 0, 0.72, 0.065, winG);
mesh(new THREE.BoxGeometry(0.05, 2.0, 0.04), new THREE.MeshStandardMaterial({ color: 0x2a3a2a, roughness: 0.7 }), 0.4, 0, 0.08, winG);
// Lily, passing the window: a tall trace in the street light, articulated the way you remember
var lily = k.ghost(-0.55, 0.1, D / 2 + 0.25, 43, 0.5, false, true, 1.18); lily.sp.material.depthTest = false;
var lilyHit = mesh(new THREE.BoxGeometry(2.3, 2.3, 0.4), M.hidden, 0, 0, 0.2, winG);
var doorG = new THREE.Group(); doorG.position.set(1.3, 0, D / 2 - 0.03); doorG.rotation.y = Math.PI; scene.add(doorG);
mesh(new THREE.BoxGeometry(0.9, 2.2, 0.06), new THREE.MeshStandardMaterial({ color: 0x2a3a2a, roughness: 0.7 }), 0, 1.1, 0, doorG); mesh(new THREE.PlaneGeometry(0.6, 1.2), new THREE.MeshBasicMaterial({ map: streetTex, toneMapped: false }), 0, 1.4, 0.035, doorG);
mesh(new THREE.BoxGeometry(0.3, 0.04, 0.05), M.chrome, 0.2, 1.0, 0.05, doorG); mesh(new THREE.PlaneGeometry(0.3, 0.12), new THREE.MeshStandardMaterial({ map: tex(128, 48, function(cx, w, h) { cx.fillStyle = '#e8e0d0'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#1a1a1a'; cx.font = 'bold 26px Arial'; cx.textAlign = 'center'; cx.fillText('OPEN', 64, 34); }), roughness: 0.8 }), -0.15, 1.6, 0.04, doorG);
var doorHit = mesh(new THREE.BoxGeometry(1.1, 2.4, 0.5), M.hidden, 0, 1.2, 0.15, doorG);
var streetLight = new THREE.PointLight(0xffd8a0, 0.9, 5, 1.7); streetLight.position.set(0.4, 1.7, D / 2 - 0.5); scene.add(streetLight);
var winGlow = k.glow(-0.6, 1.6, D / 2 - 0.1, 2.6, 0.2, 0xffd8a0);
// ---------- LIGHT ----------
scene.add(new THREE.AmbientLight(0x8a94a8, 0.22));
scene.add(new THREE.HemisphereLight(0xc8d4e8, 0x30281c, 0.26));
k.ghost(W / 2 - 0.9, 0, -0.9, 45, 0.16, true, false);
// ---------- THE CLOSE-UPS ----------
var hotspots = [
{ root: plateHit, name: 'Your plate', pos: [1.0, 1.55, 1.8], tgt: [W / 2 - 0.33, 1.0, 1.2], haloAt: [W / 2 - 0.33, 1.1, 1.2], haloSc: 0.7,
actions: function() { return k.byText(['Eat.']); } },
{ root: lilyHit, name: 'A window', pos: [0.2, 1.5, 2.0], tgt: [-0.6, 1.45, D / 2], haloAt: [-0.6, 1.5, D / 2 - 0.15], haloSc: 2.2,
actions: function() { return k.lilyHook(1); } },
{ root: rangeHit, name: 'A range', pos: [0.5, 1.5, 0.0], tgt: [-W / 2 + 0.55, 1.2, 0.0], haloAt: [-W / 2 + 0.7, 1.3, 0.0], haloSc: 2.4 },
{ root: menu, name: 'A menu', pos: [0.5, 1.95, 0.0], tgt: [-W / 2, 1.72, 0.0], haloAt: [-W / 2 + 0.15, 1.72, 0.0], haloSc: 2.6 },
{ root: ticketHit, name: 'A ticket', pos: [W / 2 - 0.8, 1.2, 1.02], tgt: [W / 2 - 0.45, 1.0, 0.75], haloAt: [W / 2 - 0.45, 1.06, 0.75], haloSc: 0.45 },
{ root: tableG, name: 'An empty table', pos: [-0.3, 1.4, 1.2], tgt: [-1.15, 0.75, 2.5], haloAt: [-1.15, 0.85, 2.5], haloSc: 1.2 },
{ root: doorHit, name: 'A door', pos: [0.6, 1.5, 1.6], tgt: [1.3, 1.2, D / 2], haloAt: [1.3, 1.2, D / 2 - 0.15], haloSc: 1.3,
actions: function() { return window.dssStreetExit(); }, // 2026-10-06: the door offers the page's own "Exit to the street" (it stays in the header too), as the Coach's door does
}
];
var lilyX0 = -0.55;
return { hotspots: hotspots, frame: function(t, dt, still) {
if (still) return;
for (var i = 0; i < tubes.length; i++) { var fl = i === 1 && Math.sin(t * 7.3) > 0.92 ? 0.35 : 1; tubes[i].l.intensity = 1.5 * fl + 0.03 * Math.sin(t * 60 + i); tubes[i].gl.material.opacity = 0.4 * fl; tubes[i].tube.material.color.setScalar(0.7 + 0.3 * fl); }
cabLight.intensity = 1.2 + 0.05 * Math.sin(t * 2.3); wokFlame.material.opacity = 0.4 + 0.25 * Math.sin(t * 17) * Math.sin(t * 5);
for (var s = 0; s < steam.length; s++) { var sp = steam[s]; sp.position.y = sp.userData.y0 + ((t * 0.15 + sp.userData.ph) % 1.2); sp.material.opacity = 0.16 * (1 - ((t * 0.15 + sp.userData.ph) % 1.2) / 1.2); sp.position.x += Math.sin(t + sp.userData.ph) * 0.001; }
// she passes, slowly, and comes back round, the way a memory does
var pass = ((t * 0.09) % 1); lily.sp.position.x = lilyX0 + (pass - 0.5) * 3.0; lily.hit.position.x = lily.sp.position.x; lily.sp.material.opacity = 0.5 * Math.max(0, 1 - Math.abs(pass - 0.5) * 3.2);
winGlow.material.opacity = 0.2 + 0.03 * Math.sin(t * 0.7);
} };
}
});
// <<<< DSS ROOM CF END

// >>>> DSS ROOM OI BEGIN
