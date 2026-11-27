/* The walk to Waterloo, the stages after the bridge: the tunnel under the railway, York Road to the Victory Arch,
   the Waterloo concourse, platform 3, and the train pulling out. Built from Sam's photographs of 26 November 2026
   (IMG_2591 to IMG_2596). Today's London. No company names are shown. Each stage: the walk heads -z first, x to the right. */
window.WW_buildWaterloo = function (kit) {
  'use strict';
  var cv = kit.cv, tex = kit.tex, rnd = kit.rnd, scene = null;

  function basic(o) { return new THREE.MeshBasicMaterial(o); }
  function box(w, h, d, mat, x, y, z, parent) { var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); (parent || scene).add(m); return m; }
  function plane(w, h, mat, x, y, z, ry, rx, parent) { var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); m.position.set(x, y, z); if (ry) m.rotation.y = ry; if (rx) m.rotation.x = rx; (parent || scene).add(m); return m; }
  function glow(x, y, z, size, color, op, parent) {
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: kit.glowTex, color: color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: op == null ? 1 : op, fog: false }));
    s.position.set(x, y, z); s.scale.set(size, size, 1); (parent || scene).add(s); return s;
  }
  function rep(t, rx, ry) { var c = t.clone(); c.needsUpdate = true; c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rx, ry); return c; }
  function untone(sc) { sc.traverse(function (o) { [].concat(o.material || []).forEach(function (m) { m.toneMapped = false; }); }); }
  function pathOf(PTS) {
    var cum = [0]; for (var i = 1; i < PTS.length; i++) cum.push(cum[i - 1] + Math.hypot(PTS[i][0] - PTS[i - 1][0], PTS[i][1] - PTS[i - 1][1]));
    var LEN = cum[cum.length - 1], n = PTS.length;
    function at(s) { s = Math.max(0, Math.min(LEN, s)); for (var i = 1; i < n; i++) if (s <= cum[i]) { var t = (s - cum[i - 1]) / (cum[i] - cum[i - 1]); return [PTS[i - 1][0] + (PTS[i][0] - PTS[i - 1][0]) * t, PTS[i - 1][1] + (PTS[i][1] - PTS[i - 1][1]) * t]; } return PTS[n - 1]; }
    function yaw(s) { var a = at(s - 1.2), b = at(s + 2.6), dx = b[0] - a[0], dz = b[1] - a[1]; if (s + 2.6 > LEN) { dx = PTS[n - 1][0] - PTS[n - 2][0]; dz = PTS[n - 1][1] - PTS[n - 2][1]; } return Math.atan2(-dx, -dz); }
    return { len: LEN, at: at, yaw: yaw };
  }
  var HAIR = [0x15110e, 0x2a1c12, 0x6a5a48, 0x0c0c0e, 0x8a8478]; /* the heads over the seat backs on the train */
  /* passers-by (the page's shared figure). Each walks a heading inside a box of floor and turns at its edges */
  function crowd(n, b, opts) {
    opts = opts || {}; var list = [];
    for (var i = 0; i < n; i++) {
      var f = kit.figure({ dim: opts.dim, tint: opts.tint, shadow: opts.shadow }); scene.add(f.g);
      var a = opts.along ? (rnd() < (opts.towards == null ? 0.5 : opts.towards) ? Math.PI / 2 : -Math.PI / 2) + (rnd() - 0.5) * 0.12 : rnd() * Math.PI * 2;
      list.push({ f: f, g: f.g, x: b[0] + rnd() * (b[1] - b[0]), z: b[2] + rnd() * (b[3] - b[2]), a: a, v: rnd() < (opts.still || 0) ? 0 : 1.0 + rnd() * 0.7 });
    }
    return function (dt, t, c) {
      list.forEach(function (q) {
        q.x += Math.cos(q.a) * q.v * dt; q.z += Math.sin(q.a) * q.v * dt;
        if (q.x < b[0] || q.x > b[1]) { q.a = Math.PI - q.a; q.x = Math.max(b[0], Math.min(b[1], q.x)); }
        if (q.z < b[2]) { if (opts.along) q.z = b[3]; else { q.a = -q.a; q.z = b[2]; } }
        if (q.z > b[3]) { if (opts.along) q.z = b[2]; else { q.a = -q.a; q.z = b[3]; } }
        var dx = q.x - c[0], dz = q.z - c[1], d = Math.hypot(dx, dz); if (d < 1.2 && d > 0.001) { q.x = c[0] + dx / d * 1.2; q.z = c[1] + dz / d * 1.2; }
        q.g.position.set(q.x, opts.y || 0, q.z); q.g.rotation.y = -q.a; q.f.step(t, q.v);
      });
    };
  }
  /* 2026-11-27, the graphics pass: small makers for the detail */
  function cyl(r0, r1, h, mat, x, y, z, parent, seg) { var m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, seg || 8), mat); m.position.set(x, y, z); (parent || scene).add(m); return m; }
  var smear = tex(cv(64, 64, function (g, w, h) { var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }));
  var footT = tex(cv(8, 64, function (g, w, h) { var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.62)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }));
  /* a pool of light lying on the ground; a streak of it on something wet; the dark at the foot of a wall */
  function pool(x, z, w, d, col, op, parent) { var q = plane(w, d, basic({ map: smear, color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false }), x, 0.025, z, 0, -Math.PI / 2, parent); q.renderOrder = 1; return q; }
  function streak(x, z, w, len, col, op, parent) { var q = plane(w, len, basic({ map: shine, color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false }), x, 0.02, z, 0, -Math.PI / 2, parent); q.renderOrder = 1; return q; }
  function foot(x, z, len, ry, h) { return plane(len, h || 1.5, basic({ map: footT, transparent: true, depthWrite: false }), x, (h || 1.5) / 2, z, ry); }

  /* ---------- shared textures ---------- */
  var slabs = tex(kit.soiled(cv(256, 256, function (g, w, h) {
    g.fillStyle = '#2c2a28'; g.fillRect(0, 0, w, h);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) { var v = 120 + Math.floor(rnd() * 26); g.fillStyle = 'rgb(' + v + ',' + (v - 3) + ',' + (v - 8) + ')'; g.fillRect(((c * 86 + (r % 2) * 43) % w) + 1, r * 64 + 1, 84, 62); }
    for (var i = 0; i < 2200; i++) { g.fillStyle = 'rgba(' + (rnd() < 0.6 ? '20,18,16' : '200,196,188') + ',' + rnd() * 0.09 + ')'; g.fillRect(rnd() * w, rnd() * h, 2, 2); }
  }), 'floor', 1), true);
  var tile = tex(kit.soiled(cv(256, 256, function (g, w, h) {
    g.fillStyle = '#a39f96'; g.fillRect(0, 0, w, h);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) { var v = 172 + Math.floor(rnd() * 18); g.fillStyle = 'rgb(' + v + ',' + (v - 3) + ',' + (v - 9) + ')'; g.fillRect(c * 64 + 1, r * 64 + 1, 62, 62); }
  }), 'floor', 0.25), true);
  var winTex = tex(cv(256, 256, function (g, w, h) {
    g.fillStyle = '#0d0e10'; g.fillRect(0, 0, w, h);
    for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) { var l = rnd(); g.fillStyle = l < 0.12 ? '#c9a460' : l < 0.2 ? '#aeb6bc' : '#15171b'; g.fillRect(c * 32 + 4, r * 32 + 6, 24, 20); }
  }), true);
  var lattice = tex(cv(256, 128, function (g, w, h) {
    g.clearRect(0, 0, w, h); g.strokeStyle = '#c9cbc6'; g.lineWidth = 10; g.beginPath(); g.moveTo(0, 6); g.lineTo(w, 6); g.moveTo(0, h - 6); g.lineTo(w, h - 6); g.stroke();
    g.lineWidth = 6; g.beginPath(); g.moveTo(0, h - 6); g.lineTo(w / 4, 6); g.lineTo(w / 2, h - 6); g.lineTo(w * 3 / 4, 6); g.lineTo(w, h - 6); g.moveTo(0, 0); g.lineTo(0, h); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke();
  }), true);
  var shine = tex(cv(64, 256, function (g, w, h) { var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, 'rgba(255,255,255,.2)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }));
  function boardTex(cols) {
    return tex(cv(128 * cols, 256, function (g, w, h) {
      g.fillStyle = '#07080a'; g.fillRect(0, 0, w, h);
      for (var c = 0; c < cols; c++) {
        var x0 = c * 128 + 6; g.fillStyle = '#f3efe2'; g.fillRect(x0, 8, 60 + rnd() * 40, 14);
        for (var r = 0; r < 11; r++) { g.fillStyle = 'rgba(255,176,48,' + (0.55 + rnd() * 0.4) + ')'; var x = x0; while (x < x0 + 100) { var bw = 6 + rnd() * 26; if (rnd() < 0.85) g.fillRect(x, 32 + r * 19, Math.min(bw, x0 + 112 - x), 10); x += bw + 5; } }
        g.fillStyle = '#1b1d22'; g.fillRect(c * 128 + 125, 0, 3, h);
      }
    }));
  }
  function trainSide() { /* one 20 m car: pale body, dark skirt, a lit window band, two pairs of doors */
    return tex(cv(1024, 128, function (g, w, h) {
      g.fillStyle = '#d3d6d8'; g.fillRect(0, 0, w, h); g.fillStyle = '#26303f'; g.fillRect(0, h - 22, w, 22); g.fillStyle = '#b9bdc0'; g.fillRect(0, 0, w, 10);
      g.fillStyle = '#1a1c20'; g.fillRect(20, 30, w - 40, 44);
      for (var i = 0; i < 12; i++) { g.fillStyle = rnd() < 0.85 ? '#f0dfa6' : '#d9c888'; g.fillRect(34 + i * 81, 34, 68, 36); g.fillStyle = 'rgba(40,36,30,.5)'; if (rnd() < 0.5) g.fillRect(44 + i * 81 + rnd() * 30, 48, 14, 22); }
      [250, 760].forEach(function (x) { g.fillStyle = '#c9ccce'; g.fillRect(x, 16, 74, 92); g.fillStyle = '#e0b01c'; g.fillRect(x, 16, 3, 92); g.fillRect(x + 71, 16, 3, 92); g.fillRect(x + 35, 16, 4, 92); g.fillStyle = '#f0dfa6'; g.fillRect(x + 8, 30, 22, 38); g.fillRect(x + 44, 30, 22, 38); });
    }), true);
  }

  /* ================= the tunnel under the railway (IMG_2591) ================= */
  function buildTunnel() {
    scene = new THREE.Scene(); scene.background = new THREE.Color(0x09090b); scene.fog = new THREE.FogExp2(0x121214, 0.007);
    var HW = 4.7, Z0 = 4, Z1 = -48, LEN = Z0 - Z1, zc = (Z0 + Z1) / 2, H = 5.3;
    plane(HW * 2 + 12, LEN + 40, basic({ map: rep(slabs, 9, 34), color: 0xb9b4ac }), 0, 0, zc, 0, -Math.PI / 2);
    for (var z = Z0 - 4; z > Z1; z -= 9) { var s = plane(5, 8, basic({ map: shine, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), 1.6, 0.02, z, 0, -Math.PI / 2); s.renderOrder = 1; }
    /* the bridge deck overhead: riveted plates, a cross girder every metre and a half, two long ones */
    var plate = tex(cv(128, 128, function (g, w, h) { g.fillStyle = '#9d988a'; g.fillRect(0, 0, w, h); g.fillStyle = '#b3ae9f'; g.fillRect(3, 3, w - 6, h - 6); g.fillStyle = '#7d786c'; for (var i = 8; i < w; i += 12) { g.fillRect(i, 6, 3, 3); g.fillRect(i, h - 9, 3, 3); g.fillRect(6, i, 3, 3); g.fillRect(w - 9, i, 3, 3); } }), true);
    plane(HW * 2, LEN, basic({ map: rep(plate, 6, 34), color: 0xb0aa9c }), 0, H, zc, 0, Math.PI / 2);
    var nB = Math.floor(LEN / 1.5), beams = new THREE.InstancedMesh(new THREE.BoxGeometry(HW * 2, 0.62, 0.22), basic({ color: 0xa39d8e }), nB), o = new THREE.Object3D();
    for (var i = 0; i < nB; i++) { o.position.set(0, H - 0.31, Z0 - 0.8 - i * 1.5); o.updateMatrix(); beams.setMatrixAt(i, o.matrix); } scene.add(beams);
    [-1.7, 1.7].forEach(function (x) { box(0.4, 0.95, LEN, basic({ color: 0x8e897b }), x, H - 0.47, zc); });
    /* right: white glazed brick with great black letters; left: a pale hoarding covered in colour. Shapes only, nothing to read */
    var glazed = tex(cv(2048, 512, function (g, w, h) {
      g.fillStyle = '#c9c7c0'; g.fillRect(0, 0, w, h);
      for (var r = 0; r < 26; r++) for (var c = 0; c < 52; c++) { var v = 205 + Math.floor(rnd() * 30); g.fillStyle = 'rgb(' + v + ',' + v + ',' + (v - 6) + ')'; g.fillRect(c * 40 - (r % 2) * 20 + 1, r * 20 + 1, 38, 18); }
      g.strokeStyle = '#0d0d0f'; g.lineCap = 'butt'; g.lineJoin = 'miter'; g.lineWidth = 46;
      var x = 140; while (x < w - 200) { /* block letterforms from straight strokes */
        var lw = 110 + rnd() * 60, top = 120, bot = 440, k = Math.floor(rnd() * 5); g.beginPath();
        if (k === 0) { g.moveTo(x, bot); g.lineTo(x + lw / 2, top); g.lineTo(x + lw, bot); g.moveTo(x + lw * 0.2, 320); g.lineTo(x + lw * 0.8, 320); }
        else if (k === 1) { g.moveTo(x, top); g.lineTo(x, bot); g.moveTo(x + lw, top); g.lineTo(x, 290); g.lineTo(x + lw, bot); }
        else if (k === 2) { g.moveTo(x + lw, top); g.lineTo(x, top); g.lineTo(x, bot); g.lineTo(x + lw, bot); g.moveTo(x, 280); g.lineTo(x + lw * 0.7, 280); }
        else if (k === 3) { g.moveTo(x + lw, top + 20); g.lineTo(x, top + 20); g.lineTo(x, 280); g.lineTo(x + lw, 280); g.lineTo(x + lw, bot - 20); g.lineTo(x, bot - 20); }
        else { g.moveTo(x, top); g.lineTo(x + lw / 2, bot); g.lineTo(x + lw, top); }
        g.stroke(); x += lw + 70;
      }
      for (var d = 0; d < 46; d++) { g.fillStyle = 'rgba(190,28,34,.9)'; g.beginPath(); g.arc(rnd() * w, 280 + rnd() * 220, 10 + rnd() * 16, 0, 7); g.fill(); }
    }));
    plane(LEN, H, basic({ map: glazed, color: 0xd8d6d0 }), HW, H / 2, zc, -Math.PI / 2);
    var sprayed = tex(cv(2048, 512, function (g, w, h) {
      g.fillStyle = '#b9b6ae'; g.fillRect(0, 0, w, h);
      var cols = ['#e2542c', '#f0c22c', '#2c8fd0', '#3aa86a', '#d94f96', '#7a4fc0', '#101012', '#f2f0e8', '#28c0b8'];
      for (var i = 0; i < 260; i++) { g.fillStyle = cols[Math.floor(rnd() * cols.length)]; g.globalAlpha = 0.55 + rnd() * 0.45; var x = rnd() * w, y = 150 + rnd() * 360, r = 14 + rnd() * 60; g.beginPath(); g.ellipse(x, y, r * (0.7 + rnd()), r * (0.5 + rnd() * 0.6), rnd() * 3, 0, 7); g.fill(); }
      g.globalAlpha = 1;
      for (var j = 0; j < 150; j++) { g.strokeStyle = cols[Math.floor(rnd() * cols.length)]; g.lineWidth = 3 + rnd() * 9; g.beginPath(); var x2 = rnd() * w, y2 = 160 + rnd() * 330; g.moveTo(x2, y2); for (var k = 0; k < 5; k++) { x2 += (rnd() - 0.3) * 70; y2 += (rnd() - 0.5) * 80; g.lineTo(x2, y2); } g.stroke(); }
    }));
    plane(LEN, H, basic({ map: sprayed, color: 0xc4c2bc }), -HW, H / 2, zc, Math.PI / 2);
    /* wall lamps down the right, one strong one near the mouth */
    for (var lz = Z0 - 6; lz > Z1; lz -= 9) { box(0.18, 0.22, 0.34, basic({ color: 0xfff4dc }), HW - 0.12, 3.5, lz); glow(HW - 0.3, 3.5, lz, 3.4, 0xfff0d0, 0.7); }
    glow(HW - 0.5, 4.3, Z0 - 9, 7, 0xffffff, 0.8);
    /* the cafe's pen on the left: a patterned fence, tables behind it */
    var fence = tex(cv(256, 128, function (g, w, h) { g.fillStyle = '#16161a'; g.fillRect(0, 0, w, h); g.fillStyle = '#e2542c'; g.beginPath(); g.moveTo(0, h); g.lineTo(64, 20); g.lineTo(128, h); g.fill(); g.fillStyle = '#eceae2'; g.beginPath(); g.moveTo(128, h); g.lineTo(192, 20); g.lineTo(256, h); g.fill(); g.strokeStyle = '#eceae2'; g.lineWidth = 4; g.strokeRect(2, 2, w - 4, h - 4); }), true);
    plane(15, 1.05, basic({ map: rep(fence, 6, 1), side: THREE.DoubleSide }), -2.1, 0.55, -19.5, Math.PI / 2);
    for (var tz = -13.5; tz > -26; tz -= 2.4) { box(0.7, 0.05, 0.7, basic({ color: 0x4a3626 }), -3.3, 0.76, tz); box(0.07, 0.75, 0.07, basic({ color: 0x1a1a1c }), -3.3, 0.38, tz); box(0.4, 0.45, 0.4, basic({ color: 0x1c1c1e }), -3.3, 0.22, tz + 0.85); }
    /* the far mouth: night, and a doorway lit purple */
    plane(40, 14, basic({ color: 0x0b0b0e }), 0, 7, Z1 - 16, 0); glow(-2.6, 2.4, Z1 - 12, 7, 0x9a4cff, 0.8); box(2.2, 3.2, 0.2, basic({ color: 0x5a2c9a }), -2.6, 1.6, Z1 - 12.5);
    /* ---------- 2026-11-27, detail ---------- */
    /* conduit and pipe along both walls under the girders; the lamps' housings and their light down the brick */
    [[HW - 0.1, 4.55, 0.07], [HW - 0.1, 4.35, 0.05], [HW - 0.22, 4.7, 0.1], [-HW + 0.1, 4.6, 0.06], [-HW + 0.1, 4.42, 0.09]].forEach(function (q) { var c = cyl(q[2], q[2], LEN, basic({ color: 0x4a4944 }), q[0], q[1], zc, scene, 6); c.rotation.x = Math.PI / 2; });
    for (var cz2 = Z0 - 3; cz2 > Z1; cz2 -= 4.5) { box(0.16, 0.26, 0.06, basic({ color: 0x3a3936 }), HW - 0.1, 4.5, cz2); box(0.16, 0.26, 0.06, basic({ color: 0x3a3936 }), -HW + 0.1, 4.5, cz2 - 2); }
    for (var lz3 = Z0 - 6; lz3 > Z1; lz3 -= 9) { box(0.3, 0.08, 0.5, basic({ color: 0x2a2a2c }), HW - 0.16, 3.68, lz3); kit.cone(scene, HW - 0.5, 3.5, lz3, 3.5, 2.6, 0xfff0d0, 0.14); pool(HW - 1.6, lz3, 6, 7, 0xfff0d0, 0.45); }
    foot(HW - 0.03, zc, LEN, -Math.PI / 2, 1.4); foot(-HW + 0.03, zc, LEN, Math.PI / 2, 1.4);
    /* a drain down the middle and the wet that lies along it */
    plane(0.3, LEN, basic({ color: 0x0c0c0d }), -0.4, 0.006, zc, 0, -Math.PI / 2); streak(-0.4, zc, 1.6, LEN, 0xd8dce8, 0.3);
    /* the cafe: chairs, shut parasols, a string of bulbs over the pen, its lit hatch in the hoarding */
    for (var tz2 = -13.5; tz2 > -26; tz2 -= 2.4) { [-0.7, 0.7].forEach(function (d) { box(0.36, 0.04, 0.36, basic({ color: 0x1a1a1c }), -3.3 + d * 0.1, 0.46, tz2 + d); box(0.36, 0.42, 0.04, basic({ color: 0x1a1a1c }), -3.3 + d * 0.1, 0.68, tz2 + d * 1.25); }); }
    [-15.5, -22].forEach(function (z) { cyl(0.03, 0.03, 2.4, basic({ color: 0x1a1a1c }), -2.7, 1.2, z); var par = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.5, 8), basic({ color: 0x2a1416 })); par.position.set(-2.7, 1.9, z); scene.add(par); });
    var bulbs = []; for (var bz2 = -12.4; bz2 > -27; bz2 -= 0.7) bulbs.push(-2.2 - Math.abs(Math.sin(bz2 * 0.9)) * 0.9, 2.5 - Math.abs(Math.sin(bz2 * 1.5)) * 0.25, bz2);
    var bg = new THREE.BufferGeometry(); bg.setAttribute('position', new THREE.Float32BufferAttribute(bulbs, 3)); scene.add(new THREE.Points(bg, new THREE.PointsMaterial({ color: 0xffd9a0, size: 4, sizeAttenuation: false, fog: false })));
    glow(-2.7, 2.3, -19.5, 9, 0xffc878, 0.22); pool(-2.9, -19.5, 4, 15, 0xffc878, 0.4);
    plane(2.4, 1.3, basic({ color: 0xf2cf8a }), -HW + 0.04, 1.75, -19.5, Math.PI / 2); box(0.3, 0.08, 2.6, basic({ color: 0x3a2a1c }), -HW + 0.18, 1.08, -19.5); glow(-HW + 0.5, 1.8, -19.5, 3.5, 0xffc878, 0.4);
    /* pasted bills on the hoarding near the mouth; a bike locked to the fence; litter */
    for (var pb = 0; pb < 7; pb++) plane(0.6, 0.84, basic({ color: [0xd8d0b8, 0xc83a2a, 0x2a4a8a, 0xe0b02c, 0x1a1a1c][pb % 5] }), -HW + 0.035, 1.5 + (pb % 2) * 0.1, Z0 - 2.4 - pb * 0.72, Math.PI / 2);
    [[0.34, -31], [0.34, -32.05]].forEach(function (q) { var wh = new THREE.Mesh(new THREE.TorusGeometry(q[0], 0.025, 5, 16), basic({ color: 0x0c0c0e })); wh.position.set(-2.0, 0.36, q[1]); wh.rotation.y = Math.PI / 2; scene.add(wh); }); box(0.03, 0.03, 1.1, basic({ color: 0x6a1c1c }), -2.0, 0.66, -31.5); box(0.03, 0.5, 0.03, basic({ color: 0x6a1c1c }), -2.0, 0.6, -31.2);
    for (var lt = 0; lt < 14; lt++) box(0.08 + rnd() * 0.12, 0.02, 0.06 + rnd() * 0.1, basic({ color: [0xb8b4a8, 0x8a2a20, 0x3a5a8a][lt % 3] }), -4 + rnd() * 8, 0.012, Z0 - rnd() * LEN).rotation.y = rnd() * 3;
    /* beyond the far mouth: the street's lamps and lights, not a flat dark */
    for (var fm = 0; fm < 12; fm++) glow(-9 + rnd() * 18, 1 + rnd() * 7, Z1 - 6 - rnd() * 9, 1.5 + rnd() * 3, [0xffae3a, 0xffae3a, 0xff2a1a, 0xfff0d2, 0x9a4cff][fm % 5], 0.7);
    var P = pathOf([[0.9, Z0 - 1], [0.9, Z1 + 2]]), people = crowd(18, [-1.4, 3.6, Z1, Z0], { along: true, towards: 0.3, dim: 0.72 });
    untone(scene);
    return { scene: scene, length: P.len, fov: 62, near: 0.1, far: 200, bloom: [0.4, 0.5, 0.82], nearDist: 10, yawMax: 2.3, portal: { w: 6.4, h: 4.6 },
      pose: function (s) { var p = P.at(s); return { x: p[0], y: 1.66, z: p[1], yaw: P.yaw(s) }; },
      portalAt: function (s) { return { x: 0.4, y: 2.3, z: Z1 + 1.4 }; },
      lat: function () { return [-2.5, 3.2]; }, /* the fence to the glazed wall */
      update: function (dt, t, s, cam) { people(dt, t, cam || P.at(s)); } };
  }

  /* ================= York Road, to the Victory Arch (IMG_2592) ================= */
  function buildArch() {
    scene = new THREE.Scene(); scene.background = new THREE.Color(0x0d0b09); scene.fog = new THREE.FogExp2(0x1a140e, 0.0042);
    var ARCH_X = 2.5, FACE_Z = -66; /* the arch stands at the end of your own pavement: no crossing through the traffic */
    plane(260, 200, basic({ color: 0x0c0c0d }), 0, -0.02, -30, 0, -Math.PI / 2); /* the road */
    plane(15, 90, basic({ map: rep(slabs, 6, 34), color: 0xd0a868 }), 3.5, 0, -22, 0, -Math.PI / 2); /* pavement under sodium lamps */
    plane(60, 14, basic({ map: rep(slabs, 22, 5), color: 0xcaa468 }), ARCH_X, 0.005, FACE_Z + 7, 0, -Math.PI / 2);
    box(0.25, 0.14, 76, basic({ color: 0x6a6258 }), -4.1, 0.05, -22);
    for (var m = 10; m > -52; m -= 6) plane(0.14, 2.6, basic({ color: 0x8a8a84 }), -8.6, 0.0, m, 0, -Math.PI / 2);
    /* the glass block on the right, and lit towers behind the station */
    var tw = winTex.clone(); tw.needsUpdate = true; tw.repeat.set(5, 9);
    box(34, 70, 46, basic({ map: tw }), 29, 35, -14); box(34.2, 4.4, 46.2, basic({ color: 0x0c0d0f }), 29, 2.2, -14);
    [[-70, -60, 24, 52], [-44, -120, 22, 64], [40, -130, 30, 80], [-100, -30, 26, 40], [-58, 10, 30, 36]].forEach(function (b) { var t = winTex.clone(); t.needsUpdate = true; t.repeat.set(b[2] / 9, b[3] / 9); box(b[2], b[3], b[2], basic({ map: t, fog: false, color: 0xc8c8c8 }), b[0], b[3] / 2, b[1]); });
    /* the station front: white stone, floodlit, the great arch lit from within */
    var front = tex(cv(1024, 512, function (g, w, h) {
      var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#b9b3a2'); gr.addColorStop(1, '#e6e0cf'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(70,64,52,.5)'; for (var y = 150; y < h; y += 30) g.fillRect(0, y, w, 2); g.fillStyle = '#8f8876'; g.fillRect(0, 96, w, 16); g.fillRect(0, 130, w, 6);
      for (var x = 40; x < w; x += 92) { if (Math.abs(x - w / 2) < 150) continue; g.fillStyle = '#15130f'; g.fillRect(x, 170, 44, 110); g.fillRect(x, 330, 44, 110); g.fillStyle = 'rgba(255,214,150,' + (rnd() < 0.5 ? 0.75 : 0.15) + ')'; g.fillRect(x + 4, 174, 36, 102); }
      g.fillStyle = '#f2ead6'; g.beginPath(); g.moveTo(w / 2 - 128, h); g.lineTo(w / 2 - 128, 250); g.arc(w / 2, 250, 128, Math.PI, 0); g.lineTo(w / 2 + 128, h); g.fill();
      var ag = g.createRadialGradient(w / 2, 400, 10, w / 2, 330, 200); ag.addColorStop(0, '#fff3c4'); ag.addColorStop(0.6, '#e2c060'); ag.addColorStop(1, '#8a6a22');
      g.fillStyle = ag; g.beginPath(); g.moveTo(w / 2 - 98, h); g.lineTo(w / 2 - 98, 256); g.arc(w / 2, 256, 98, Math.PI, 0); g.lineTo(w / 2 + 98, h); g.fill();
      g.fillStyle = '#a79f8c'; [w / 2 - 190, w / 2 + 150].forEach(function (x2) { g.fillRect(x2, 150, 40, 300); g.fillRect(x2 - 10, 300, 60, 24); }); /* piers and their sculpture blocks */
      g.fillStyle = '#cfc8b4'; g.beginPath(); g.moveTo(w / 2 - 110, 96); g.lineTo(w / 2, 30); g.lineTo(w / 2 + 110, 96); g.fill();
    }));
    plane(64, 32, basic({ map: front, fog: false, color: 0x8f8a80 }), ARCH_X, 16, FACE_Z, 0);
    box(0.08, 7, 0.08, basic({ color: 0x8a8a86 }), ARCH_X - 4, 35, FACE_Z - 0.5); plane(2.6, 1.5, basic({ color: 0x9a1c24, side: THREE.DoubleSide }), ARCH_X - 2.6, 37.4, FACE_Z - 0.5, 0);
    glow(ARCH_X, 7, FACE_Z + 1.5, 18, 0xffe2a0, 0.2);
    for (var st = 0; st < 6; st++) box(15, 0.17, 0.5, basic({ color: 0xbfb8a6 }), ARCH_X, 0.085 + st * 0.17, FACE_Z + 5.2 - st * 0.5);
    box(15, 1.02, 2.4, basic({ color: 0xb5ae9c }), ARCH_X, 0.51, FACE_Z + 1.2);
    /* street lamps, twin heads, sodium; the lights at the crossing */
    [[-3.4, 4], [-3.4, -14], [-3.4, -32], [10.5, -4], [10.5, -24], [-3.4, -50], [-22, -44], [-22, -20]].forEach(function (p) {
      box(0.16, 9.5, 0.16, basic({ color: 0x1a1a1c }), p[0], 4.75, p[1]); box(1.6, 0.1, 0.1, basic({ color: 0x1a1a1c }), p[0], 9.5, p[1]);
      glow(p[0] - 0.8, 9.4, p[1], 7, 0xffae3a, 0.95); glow(p[0] + 0.8, 9.4, p[1], 7, 0xffae3a, 0.95);
    });
    [[-4.6, -40, 0xff2a1a], [-13.4, -40, 0xff2a1a], [-4.6, -6, 0x2aff7a]].forEach(function (p) { box(0.1, 3.2, 0.1, basic({ color: 0x151517 }), p[0], 1.6, p[1]); box(0.26, 0.8, 0.22, basic({ color: 0x0c0c0e }), p[0], 3.3, p[1]); glow(p[0], 3.4, p[1] + 0.15, 1.4, p[2], 1); });
    /* traffic */
    var cars = [];
    for (var c = 0; c < 7; c++) {
      var g = new THREE.Group(), dir = c % 2 ? 1 : -1, taxi = rnd() < 0.5;
      box(1.8, taxi ? 1.5 : 1.1, 4.2, basic({ color: taxi ? 0x0c0c0e : [0x5a1418, 0x1a2230, 0x3a3a3c][c % 3] }), 0, taxi ? 0.95 : 0.75, 0, g); box(1.6, 0.5, 2.2, basic({ color: 0x15171c }), 0, taxi ? 1.75 : 1.45, 0.2, g);
      glow(-0.6, 0.75, -2.15, 1.5, 0xfff6d8, 1, g); glow(0.6, 0.75, -2.15, 1.5, 0xfff6d8, 1, g); glow(-0.6, 0.8, 2.15, 1.3, 0xff2010, 1, g); glow(0.6, 0.8, 2.15, 1.3, 0xff2010, 1, g);
      g.rotation.y = dir > 0 ? Math.PI : 0; scene.add(g); cars.push({ g: g, dir: dir, x: dir > 0 ? -6.6 : -11, z: -60 + rnd() * 90, v: 5 + rnd() * 4 });
    }
    /* ---------- 2026-11-27, detail ---------- */
    /* the front in relief: piers standing proud, a cornice, the sculpture groups, bracket lamps by the arch, brass rails up the steps */
    var stoneL = basic({ color: 0x8f8a7c }), stoneD = basic({ color: 0x6a665c });
    [-9.6, -6.6, 6.6, 9.6, -20, 20, -28, 28].forEach(function (dx) { box(1.4, 22, 0.9, stoneL, ARCH_X + dx, 11, FACE_Z + 0.45); box(1.8, 0.6, 1.2, stoneD, ARCH_X + dx, 22.3, FACE_Z + 0.5); box(1.8, 1.2, 1.2, stoneD, ARCH_X + dx, 0.6, FACE_Z + 0.5); });
    box(64, 0.9, 1.3, stoneD, ARCH_X, 23.4, FACE_Z + 0.55); box(64, 0.5, 0.9, stoneL, ARCH_X, 8.6, FACE_Z + 0.4); box(20, 1.2, 1.5, stoneL, ARCH_X, 25.2, FACE_Z + 0.6);
    [-8.1, 8.1].forEach(function (dx) { box(2.6, 3.2, 1.6, stoneL, ARCH_X + dx, 12.6, FACE_Z + 0.9); var fig = new THREE.Mesh(new THREE.ConeGeometry(1.0, 3.4, 6), stoneL); fig.position.set(ARCH_X + dx, 15.6, FACE_Z + 0.9); scene.add(fig); box(0.5, 0.06, 1.2, iron2(), ARCH_X + dx * 0.72, 5.2, FACE_Z + 1.0); glow(ARCH_X + dx * 0.72, 4.9, FACE_Z + 1.6, 3.4, 0xffe2a8, 0.8); kit.cone(scene, ARCH_X + dx * 0.72, 4.9, FACE_Z + 1.6, 4.9, 2.6, 0xffe2a8, 0.12); });
    var figTop = new THREE.Mesh(new THREE.ConeGeometry(2.2, 4.6, 7), stoneL); figTop.position.set(ARCH_X, 28, FACE_Z + 0.6); scene.add(figTop);
    function iron2() { return basic({ color: 0x151517 }); }
    [-5.5, 0, 5.5].forEach(function (dx) { var r = box(0.05, 0.05, 3.4, basic({ color: 0x8a6a2a }), ARCH_X + dx, 1.55, FACE_Z + 3.9); r.rotation.x = -0.32; cyl(0.03, 0.03, 1.0, basic({ color: 0x8a6a2a }), ARCH_X + dx, 0.5, FACE_Z + 5.4); cyl(0.03, 0.03, 1.0, basic({ color: 0x8a6a2a }), ARCH_X + dx, 1.5, FACE_Z + 2.4); });
    /* the lamps' light in the air and on the stones; the front's light spilled down the steps; the road's shine */
    [[-3.4, 4], [-3.4, -14], [-3.4, -32], [10.5, -4], [10.5, -24], [-3.4, -50]].forEach(function (p) { kit.cone(scene, p[0], 9.3, p[1], 9.3, 5.2, 0xffae3a, 0.12); pool(p[0] + 1.5, p[1], 11, 11, 0xffa030, 0.5); streak(p[0] - 5, p[1], 4, 16, 0xffa030, 0.4); });
    pool(ARCH_X, FACE_Z + 7, 22, 16, 0xffe6b0, 0.55); streak(-8.8, -22, 5, 80, 0xffb060, 0.14);
    foot(11.95, -14, 46, -Math.PI / 2, 2.2);
    /* bollards on the kerb, a stand of hire bikes, a lit way-finding post, bins */
    for (var bz3 = 10; bz3 > -56; bz3 -= 3.8) { cyl(0.07, 0.085, 1.0, iron2(), -3.7, 0.5, bz3); }
    for (var bk = 0; bk < 7; bk++) { var bx = 9.4, bzz = 2 - bk * 0.85; box(0.08, 0.55, 0.3, basic({ color: 0x2a2c30 }), bx, 0.28, bzz); var w1 = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.03, 5, 14), basic({ color: 0x0c0c0e })); w1.position.set(bx - 0.6, 0.34, bzz); scene.add(w1); var w2 = w1.clone(); w2.position.x = bx - 1.55; scene.add(w2); box(1.0, 0.05, 0.05, basic({ color: 0x8a1418 }), bx - 1.05, 0.68, bzz); }
    box(0.9, 2.6, 0.2, basic({ color: 0x15171b }), 6.5, 1.3, -28); plane(0.7, 1.3, basic({ color: 0xcfe0f4 }), 6.5, 1.6, -27.89, 0); glow(6.5, 1.6, -27.6, 2.4, 0xcfe0f4, 0.45);
    [[7.8, -8], [-2.6, -40]].forEach(function (q) { box(0.55, 1.05, 0.55, basic({ color: 0x101214 }), q[0], 0.52, q[1]); });
    /* the cars' wheels and their lights on the road */
    cars.forEach(function (c) { [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) { var wh = cyl(0.36, 0.36, 0.24, basic({ color: 0x08080a }), q[0] * 0.82, 0.36, q[1] * 1.3, c.g, 12); wh.rotation.z = Math.PI / 2; }); streak(0, -6.6, 2.2, 9, 0xfff2d0, 0.5, c.g); streak(0, 5.6, 2.0, 7, 0xff2010, 0.45, c.g); });
    /* the railway on its viaduct beyond the road, a lit train drawn across it */
    box(160, 1.4, 6, basic({ color: 0x0e0e10 }), -70, 9, -84); for (var ar = -140; ar < 0; ar += 14) box(2.4, 8.4, 6, basic({ color: 0x15130f }), ar, 4.2, -84);
    var tsd = trainSide(); box(70, 2.7, 2.8, [basic({ color: 0x9a9c9e }), basic({ color: 0x9a9c9e }), basic({ color: 0x2a2c2e }), basic({ color: 0x111111 }), basic({ map: rep(tsd, 3.5, 1), color: 0xa0a0a0 }), basic({ map: rep(tsd, 3.5, 1), color: 0xa0a0a0 })], -70, 11.1, -84);
    var P = pathOf([[2.5, 12], [2.5, -34], [ARCH_X, FACE_Z + 8], [ARCH_X, FACE_Z + 0.6]]), people = crowd(40, [-3, 8.5, -56, 14], { along: true, towards: 0.75, dim: 0.68, tint: 0xffd2a0 });
    function rise(z) { return Math.max(0, Math.min(1.02, (FACE_Z + 5.4 - z) / 3 * 1.02)); }
    untone(scene);
    return { scene: scene, length: P.len, fov: 62, near: 0.15, far: 900, bloom: [0.4, 0.5, 0.88], nearDist: 12, yawMax: 2.3, portal: { w: 9.5, h: 10 },
      pose: function (s) { var p = P.at(s); return { x: p[0], y: 1.66 + rise(p[1]), z: p[1], yaw: P.yaw(s) }; },
      portalAt: function () { return { x: ARCH_X, y: 5.6, z: FACE_Z + 0.15 }; },
      lat: function (s) { return s > P.len - 14 ? [-3.5, 3.5] : [-5.2, 6.6]; }, /* kerb to the glass block; then the steps */
      update: function (dt, t, s, cam) {
        people(dt, t, cam || P.at(s));
        cars.forEach(function (c) { c.z += c.dir * c.v * dt; if (c.z > 40) c.z = -70; if (c.z < -70) c.z = 40; c.g.position.set(c.x, 0, c.z); });
      } };
  }

  /* ================= the Waterloo concourse (IMG_2593) ================= */
  function buildConcourse() {
    scene = new THREE.Scene(); scene.background = new THREE.Color(0x0c0d10); scene.fog = new THREE.FogExp2(0x16171b, 0.003);
    var HW = 56, Z0 = 2, Z1 = -36, H = 17, zc = (Z0 + Z1) / 2, depth = Z0 - Z1, GATE_X = 16;
    plane(HW * 2, depth + 80, basic({ map: rep(tile, 56, 60), color: 0xa8a49c }), 0, 0, zc - 40, 0, -Math.PI / 2);
    /* the roof: ridge and furrow glass on deep lattice girders, white floods beneath */
    var glazing = tex(cv(128, 128, function (g, w, h) { g.fillStyle = '#0d1014'; g.fillRect(0, 0, w, h); g.strokeStyle = '#8f9498'; g.lineWidth = 2; for (var i = 0; i <= w; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); } g.lineWidth = 5; g.beginPath(); g.moveTo(0, 2); g.lineTo(w, 2); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke(); }), true);
    plane(HW * 2, depth + 80, basic({ map: rep(glazing, 40, 30) }), 0, H + 2, zc - 40, 0, Math.PI / 2);
    for (var x = -HW + 4; x < HW; x += 8) {
      plane(depth + 80, 2.6, basic({ map: rep(lattice, 20, 1), transparent: true, alphaTest: 0.3, side: THREE.DoubleSide }), x, H + 0.4, zc - 40, Math.PI / 2);
      for (var z = Z0 - 6; z > Z1 + 2; z -= 10) { box(0.6, 0.12, 1.2, basic({ color: 0xffffff }), x + 4, H - 1.2, z); glow(x + 4, H - 1.5, z, 6, 0xf2f6ff, 0.6); var s = plane(4, 8, basic({ map: shine, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), x + 4, 0.02, z, 0, -Math.PI / 2); s.renderOrder = 1; }
    }
    for (var z2 = Z0 - 8; z2 > Z1 - 76; z2 -= 12) plane(HW * 2, 1.8, basic({ map: rep(lattice, 28, 1), transparent: true, alphaTest: 0.3, side: THREE.DoubleSide }), 0, H - 0.2, z2, 0);
    /* behind you: the stone wall, shops at floor level, a balcony of more above */
    var stoneT = tex(cv(128, 128, function (g, w, h) { g.fillStyle = '#b5ad9a'; g.fillRect(0, 0, w, h); g.fillStyle = '#c6bfac'; for (var r = 0; r < 4; r++) for (var c = 0; c < 2; c++) g.fillRect(((c * 64 + (r % 2) * 32) % w) + 1, r * 32 + 1, 62, 30); }), true);
    plane(HW * 2, H + 2, basic({ map: rep(stoneT, 40, 6) }), 0, (H + 2) / 2, Z0, Math.PI);
    function shopFront(warm) { return tex(cv(256, 128, function (g, w, h) { var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, warm ? '#f2e2bc' : '#e6eef2'); gr.addColorStop(1, warm ? '#b99a62' : '#9fb0b8'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (var i = 0; i < 40; i++) { g.fillStyle = 'hsla(' + Math.floor(rnd() * 360) + ',45%,' + (35 + rnd() * 30) + '%,.5)'; g.fillRect(rnd() * w, 50 + rnd() * 70, 10 + rnd() * 26, 8 + rnd() * 20); } g.fillStyle = '#15171b'; g.fillRect(0, 0, w, 24); g.fillRect(0, 0, 4, h); g.fillRect(w - 4, 0, 4, h); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(w / 2 - 40, 9, 80, 7); })); }
    for (var sx = -HW + 5; sx < HW - 5; sx += 9.2) { if (Math.abs(sx + 4.6 + 30) < 6) continue; plane(8.6, 4.2, basic({ map: shopFront(rnd() < 0.5) }), sx + 4.6, 2.1, Z0 - 0.05, Math.PI); plane(8.6, 3.4, basic({ map: shopFront(rnd() < 0.5) }), sx + 4.6, 7.4, Z0 - 0.06, Math.PI); }
    box(HW * 2, 0.4, 3.2, basic({ color: 0x8f897a }), 0, 5.3, Z0 - 1.6); plane(HW * 2, 1.1, basic({ color: 0xbfd0d6, transparent: true, opacity: 0.2, side: THREE.DoubleSide }), 0, 6.05, Z0 - 3.2, 0); box(HW * 2, 0.06, 0.06, basic({ color: 0x9aa0a6 }), 0, 6.62, Z0 - 3.2);
    plane(9, 5, basic({ color: 0x08080a }), -30, 2.5, Z0 - 0.04, Math.PI); /* the way in from the arch */
    [-HW, HW].forEach(function (wx) { plane(depth + 80, H + 2, basic({ map: rep(stoneT, 36, 6), color: 0xd0d0d0 }), wx, (H + 2) / 2, zc - 40, wx < 0 ? Math.PI / 2 : -Math.PI / 2); });
    /* the gate line and the boards over it; platforms and trains beyond */
    for (var gx = -HW + 4; gx <= HW - 4; gx += 1.5) { box(0.34, 1.05, 1.5, basic({ color: 0x8f949a }), gx, 0.52, Z1); box(0.36, 0.06, 0.5, basic({ color: rnd() < 0.8 ? 0x35d06a : 0xe8452c }), gx, 1.08, Z1 + 0.45); }
    [-36, 0, 36].forEach(function (bx) { plane(32, 3.4, basic({ map: boardTex(8) }), bx, 6.1, Z1 + 1.3, 0); box(32.4, 3.7, 0.3, basic({ color: 0x15171b }), bx, 6.1, Z1 + 1.1); });
    var plate3 = tex(cv(128, 64, function (g, w, h) { g.fillStyle = '#0a2a5c'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffffff'; g.font = 'bold 46px Helvetica, Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('3', w / 2, h / 2 + 2); }));
    for (var p = 0; p < 11; p++) {
      var px = -HW + 8 + p * 10;
      box(1.6, 0.8, 0.1, basic(Math.abs(px - GATE_X) < 5 ? { map: plate3 } : { color: 0x0a2a5c }), Math.abs(px - GATE_X) < 5 ? GATE_X : px, 3.7, Z1 + 0.4);
      box(0.4, H + 1, 0.4, basic({ color: 0xc9ccc8 }), px + 5, (H + 1) / 2, Z1 - 1.2);
      box(4.4, 1.0, 70, basic({ color: 0x7c7a74 }), px, 0.5, Z1 - 40);
      if (p % 2 === 0) { var tx = px + 5; var ts = trainSide(); ts.rotation = 0; box(2.8, 2.7, 60, [basic({ map: rep(ts, 3, 1) }), basic({ map: rep(ts, 3, 1) }), basic({ color: 0x9a9c9e }), basic({ color: 0x111111 }), basic({ color: 0xc9ccce }), basic({ color: 0xc9ccce })], tx, 2.35, Z1 - 40); box(2.5, 1.2, 0.1, basic({ color: 0xe6c21c }), tx, 1.7, Z1 - 9.95); glow(tx - 0.8, 1.5, Z1 - 9.8, 1.6, 0xffffff, 0.9); glow(tx + 0.8, 1.5, Z1 - 9.8, 1.6, 0xffffff, 0.9); }
    }
    /* way-finding posts, benches, the hanging clock, a bronze on a plinth */
    [[-18, -12], [6, -9], [24, -20], [-36, -22], [40, -10]].forEach(function (q) { box(1.1, 3.5, 0.24, basic({ color: 0xf2f2ee }), q[0], 1.75, q[1]); box(1.12, 0.5, 0.26, basic({ color: 0x5a2c8a }), q[0], 3.3, q[1]); box(0.8, 1.2, 0.27, basic({ color: 0x2a6fd0 }), q[0], 1.6, q[1]); });
    [[-8, -20], [0, -26], [30, -14], [-26, -14], [44, -24]].forEach(function (q) { box(3.4, 0.45, 0.7, basic({ color: 0x8a5a30 }), q[0], 0.42, q[1]); box(3.4, 0.5, 0.1, basic({ color: 0x8a5a30 }), q[0], 0.85, q[1] + 0.3); });
    box(0.06, 5.5, 0.06, basic({ color: 0x2a2c30 }), 0, H - 3.4, -17); box(1.7, 1.7, 1.7, basic({ color: 0x15171b }), 0, H - 7, -17);
    [[0, 0.86, 0], [0, -0.86, Math.PI], [0.86, 0, Math.PI / 2], [-0.86, 0, -Math.PI / 2]].forEach(function (f) { plane(1.4, 1.4, basic({ color: 0xf6f2e4 }), f[0], H - 7, -17 + f[1], f[2]); });
    box(1.6, 1.3, 1.6, basic({ color: 0x8a8478 }), -10, 0.65, -12); var br = new THREE.Mesh(new THREE.ConeGeometry(0.55, 2.3, 7), basic({ color: 0x2a221a })); br.position.set(-10, 2.45, -12); scene.add(br); var bh = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), basic({ color: 0x2a221a })); bh.position.set(-10, 3.75, -12); scene.add(bh);
    /* ---------- 2026-11-27, detail ---------- */
    /* great lit hoardings over the balcony, their colour on the floor; shop pods in the hall; bins; signs hung from the roof */
    function hoarding(seed) { return tex(cv(256, 128, function (g, w, h) { var hue = Math.floor(rnd() * 360), gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, 'hsl(' + hue + ',55%,42%)'); gr.addColorStop(1, 'hsl(' + ((hue + 50) % 360) + ',60%,22%)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (var i = 0; i < 5; i++) { g.fillStyle = 'hsla(' + ((hue + 180 + i * 20) % 360) + ',50%,70%,.35)'; g.beginPath(); g.arc(rnd() * w, rnd() * h, 14 + rnd() * 40, 0, 7); g.fill(); } g.fillStyle = 'rgba(255,255,255,.8)'; g.fillRect(18, h - 30, 90, 8); g.fillRect(18, h - 18, 54, 5); })); }
    [-38, -14, 10, 34].forEach(function (hx, i) { plane(18, 6, basic({ map: hoarding(i), color: 0xb8b8b8 }), hx, 12.6, Z0 - 0.08, Math.PI); box(18.4, 6.4, 0.2, basic({ color: 0x101214 }), hx, 12.6, Z0 - 0.02); pool(hx, Z0 - 9, 16, 12, [0xff7ab0, 0x7ab0ff, 0xffc070, 0x8affc0][i], 0.22); });
    [[-12, -22], [28, -26], [-40, -14]].forEach(function (q) { box(5, 2.8, 3.4, basic({ color: 0x1c1e22 }), q[0], 1.4, q[1]); plane(4.4, 1.3, basic({ color: 0xf2dca8 }), q[0], 1.8, q[1] + 1.71, 0); plane(4.4, 1.3, basic({ color: 0xf2dca8 }), q[0], 1.8, q[1] - 1.71, Math.PI); box(5.3, 0.2, 3.7, basic({ color: 0x101214 }), q[0], 2.9, q[1]); glow(q[0], 1.9, q[1] + 2.2, 6, 0xffd890, 0.35); pool(q[0], q[1] + 3.4, 7, 4, 0xffd890, 0.4); pool(q[0], q[1] - 3.4, 7, 4, 0xffd890, 0.4); });
    [[-22, -18], [4, -14], [34, -20], [18, -8], [-44, -26]].forEach(function (q) { box(0.5, 0.95, 0.5, basic({ color: 0x15171b }), q[0], 0.48, q[1]); });
    [[-30, -14], [-4, -20], [GATE_X, -26], [40, -22]].forEach(function (q) { box(4, 0.6, 0.1, basic({ color: 0x0a2a5c }), q[0], 5.0, q[1]); for (var k = 0; k < 4; k++) plane(0.5, 0.14, basic({ color: 0xe8eef6 }), q[0] - 1.4 + k * 0.9, 5.0, q[1] + 0.06, 0); box(0.03, H - 5.3, 0.03, basic({ color: 0x8a8f96 }), q[0] - 1.8, 5.3 + (H - 5.3) / 2, q[1]); box(0.03, H - 5.3, 0.03, basic({ color: 0x8a8f96 }), q[0] + 1.8, 5.3 + (H - 5.3) / 2, q[1]); });
    /* the boards' amber on the floor; the dark at the foot of the walls; rope posts before the gates */
    pool(0, Z1 + 6, 100, 12, 0xffb030, 0.4); foot(0, Z0 - 0.1, HW * 2, Math.PI, 1.8);
    for (var rp = -HW + 6; rp < HW - 6; rp += 5) { if (Math.abs(rp - GATE_X) < 5) continue; cyl(0.04, 0.05, 0.95, basic({ color: 0x8a8f96 }), rp, 0.48, Z1 + 3.2); }
    var P = pathOf([[-30, 0.5], [-30, -8], [GATE_X - 6, -26], [GATE_X, Z1 + 0.8]]), people = crowd(78, [-HW + 2, HW - 2, Z1 + 2, Z0 - 4], { still: 0.2, dim: 0.9 });
    untone(scene);
    return { scene: scene, length: P.len, fov: 66, near: 0.15, far: 500, bloom: [0.32, 0.5, 0.86], nearDist: 9, yawMax: 2.3, portal: { w: 5.4, h: 4.4 },
      pose: function (s) { var p = P.at(s); return { x: p[0], y: 1.66, z: p[1], yaw: P.yaw(s) }; },
      portalAt: function () { return { x: GATE_X, y: 2.2, z: Z1 + 0.2 }; },
      lat: function (s) { return s < 6 ? [-2, 2] : s > P.len - 6 ? [-1.6, 1.6] : [-7, 7]; },
      update: function (dt, t, s, cam) { people(dt, t, cam || P.at(s)); } };
  }

  /* ================= platform 3 (IMG_2594) ================= */
  function buildPlatform() {
    scene = new THREE.Scene(); scene.background = new THREE.Color(0x090a0c); scene.fog = new THREE.FogExp2(0x101114, 0.006);
    var DOOR_Z = -31, PW = 3.6;
    var conc = tex(cv(128, 128, function (g, w, h) { g.fillStyle = '#77756f'; g.fillRect(0, 0, w, h); for (var i = 0; i < 1400; i++) { g.fillStyle = 'rgba(' + (rnd() < 0.5 ? '30,30,30' : '190,188,180') + ',' + rnd() * 0.1 + ')'; g.fillRect(rnd() * w, rnd() * h, 2, 2); } g.fillStyle = 'rgba(40,40,40,.35)'; g.fillRect(0, 0, w, 2); }), true);
    plane(PW * 2, 120, basic({ map: rep(conc, 4, 60) }), 0, 0, -50, 0, -Math.PI / 2);
    [-1, 1].forEach(function (sd) { plane(0.42, 120, basic({ color: 0xc9b23a }), sd * (PW - 0.75), 0.004, -50, 0, -Math.PI / 2); plane(0.1, 120, basic({ color: 0xe8e4d8 }), sd * (PW - 0.12), 0.004, -50, 0, -Math.PI / 2); box(0.3, 1.1, 120, basic({ color: 0x4a4944 }), sd * (PW + 0.15), -0.55, -50); });
    plane(60, 140, basic({ color: 0x0d0d0e }), 0, -1.1, -50, 0, -Math.PI / 2);
    for (var hz = 2; hz > -100; hz -= 9) { var s = plane(3.5, 6, basic({ map: shine, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), 0.8, 0.01, hz, 0, -Math.PI / 2); s.renderOrder = 1; }
    /* the train on the left, its doors open by you; another across the track on the right */
    var side = trainSide(), body = basic({ color: 0xc9ccce });
    for (var c = 0; c < 6; c++) {
      var z = 2 - c * 20.3 - 10;
      box(2.8, 2.75, 20, [basic({ map: side }), basic({ map: side }), basic({ color: 0x9a9c9e }), basic({ color: 0x111111 }), body, body], -PW - 1.75, 1.45, z);
      box(2.8, 2.75, 20, [basic({ map: side, color: 0xa8b4c4 }), basic({ map: side, color: 0xa8b4c4 }), basic({ color: 0x7a7c80 }), basic({ color: 0x111111 }), body, body], PW + 5.2, 1.45, z - 6);
    }
    box(0.1, 2.05, 1.5, basic({ color: 0xd9cfa8 }), -PW - 0.36, 1.2, DOOR_Z); glow(-PW - 0.2, 1.3, DOOR_Z, 3.0, 0xfff0c8, 0.25);
    [-1, 1].forEach(function (sd) { box(0.06, 2.05, 0.75, basic({ color: 0xc9ccce }), -PW - 0.33, 1.2, DOOR_Z + sd * 1.12); box(0.07, 2.05, 0.06, basic({ color: 0xe0b01c }), -PW - 0.32, 1.2, DOOR_Z + sd * 0.76); });
    plane(1.5, 1.0, basic({ color: 0xd9d4c6 }), -PW - 0.2, 0.004, DOOR_Z, 0, -Math.PI / 2);
    /* the roof and its columns; lamps; the indicator with its amber rows; the blue 3 */
    plane(40, 130, basic({ color: 0x15161a }), 0, 7.4, -50, 0, Math.PI / 2);
    for (var tz = 0; tz > -110; tz -= 6) plane(26, 1.5, basic({ map: rep(lattice, 9, 1), transparent: true, alphaTest: 0.3, side: THREE.DoubleSide, color: 0x9a9c98 }), 2, 6.5, tz, 0);
    for (var cz = -4; cz > -100; cz -= 12) { box(0.3, 7, 0.3, basic({ color: 0xa8a69c }), PW - 1.5, 3.5, cz); box(0.5, 1.2, 0.5, basic({ color: 0x5a5c60 }), PW - 1.5, 0.6, cz); box(0.9, 0.12, 0.3, basic({ color: 0xffffff }), 0.6, 5.6, cz + 5); glow(0.6, 5.4, cz + 5, 4.5, 0xf4f6ff, 0.7); }
    var ind = tex(cv(256, 256, function (g, w, h) { g.fillStyle = '#08090b'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffb030'; g.fillRect(14, 16, 70, 22); g.fillRect(160, 16, 80, 22); for (var r = 0; r < 7; r++) { var x = 14; while (x < 230) { var bw = 10 + rnd() * 40; if (rnd() < 0.8) g.fillRect(x, 56 + r * 26, Math.min(bw, 240 - x), 13); x += bw + 8; } } }));
    box(1.3, 1.3, 0.2, basic({ color: 0x111214 }), 1.4, 4.4, -9); plane(1.2, 1.2, basic({ map: ind }), 1.4, 4.4, -8.89, 0); box(0.05, 2.4, 0.05, basic({ color: 0x2a2c30 }), 1.4, 6.2, -9);
    var p3 = tex(cv(64, 64, function (g, w, h) { g.fillStyle = '#0a2a5c'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = 'bold 48px Helvetica, Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('3', w / 2, h / 2 + 3); }));
    [-14, -40].forEach(function (z3) { box(0.5, 0.5, 0.06, basic({ map: p3 }), PW - 1.5, 3.2, z3 + 0.2); });
    plane(40, 12, basic({ color: 0x0a0a0c }), 0, 4, -112, 0); glow(-9, 3, -110, 3, 0xff2a1a, 0.9); glow(6, 3.4, -110, 3, 0x2aff7a, 0.7);
    /* ---------- 2026-11-27, detail ---------- */
    /* through the open door: the vestibule's floor, a yellow pole, seat backs, the far door's window */
    box(2.6, 0.06, 1.5, basic({ color: 0x2a3040 }), -PW - 1.75, 0.2, DOOR_Z); cyl(0.025, 0.025, 2.0, basic({ color: 0xe0b01c }), -PW - 1.2, 1.2, DOOR_Z); cyl(0.025, 0.025, 2.0, basic({ color: 0xe0b01c }), -PW - 2.3, 1.2, DOOR_Z);
    [-1, 1].forEach(function (sd) { box(0.5, 0.9, 0.1, basic({ color: 0x2a3a6a }), -PW - 1.2, 0.9, DOOR_Z + sd * 0.9); box(0.5, 0.9, 0.1, basic({ color: 0x2a3a6a }), -PW - 2.3, 0.9, DOOR_Z + sd * 0.9); });
    plane(1.1, 0.9, basic({ color: 0x15202c }), -PW - 3.1, 1.5, DOOR_Z, Math.PI / 2); box(0.2, 0.04, 1.5, basic({ color: 0xffffff }), -PW - 1.75, 2.2, DOOR_Z); pool(-PW + 0.6, DOOR_Z, 3.5, 3, 0xfff0c8, 0.6);
    /* gaps and bellows between the cars; the lamps' light down through the air and on the platform; wet shine along the edge */
    for (var gc = 0; gc < 6; gc++) { box(2.5, 2.3, 0.34, basic({ color: 0x0c0c0e }), -PW - 1.75, 1.35, 2 - gc * 20.3 - 20.15); box(2.5, 2.3, 0.34, basic({ color: 0x0c0c0e }), PW + 5.2, 1.35, 2 - gc * 20.3 - 26.15); }
    for (var cz3 = -4; cz3 > -100; cz3 -= 12) { kit.cone(scene, 0.6, 5.5, cz3 + 5, 5.5, 3.6, 0xf4f6ff, 0.10); pool(0.6, cz3 + 5, 7, 8, 0xf4f6ff, 0.35); }
    streak(-PW + 0.6, -50, 1.4, 120, 0xfff0d0, 0.35); streak(PW - 0.5, -50, 1.2, 120, 0xdfe8ff, 0.2);
    /* benches, a help point with its blue lamp, a hung sign, conduit along the roof, the brackets on the columns */
    [-18, -52].forEach(function (z) { box(0.5, 0.08, 2.2, basic({ color: 0x3a3f46 }), PW - 1.5, 0.48, z + 2.6); box(0.06, 0.5, 2.2, basic({ color: 0x3a3f46 }), PW - 1.28, 0.78, z + 2.6); box(0.4, 0.46, 0.08, basic({ color: 0x2a2c30 }), PW - 1.5, 0.23, z + 1.7); box(0.4, 0.46, 0.08, basic({ color: 0x2a2c30 }), PW - 1.5, 0.23, z + 3.5); });
    box(0.3, 1.7, 0.2, basic({ color: 0xe8e8e4 }), PW - 1.5, 0.85, -22.5); glow(PW - 1.5, 1.8, -22.5, 1.1, 0x3a8cff, 0.9);
    box(2.2, 0.5, 0.08, basic({ color: 0x0a2a5c }), 0.6, 3.6, -20); plane(1.2, 0.12, basic({ color: 0xe8eef6 }), 0.4, 3.6, -19.95, 0); box(0.03, 3, 0.03, basic({ color: 0x8a8f96 }), -0.3, 5.3, -20); box(0.03, 3, 0.03, basic({ color: 0x8a8f96 }), 1.5, 5.3, -20);
    [[-1.2, 6.9], [2.2, 6.95], [2.5, 6.8]].forEach(function (q) { box(0.07, 0.07, 120, basic({ color: 0x2c2e32 }), q[0], q[1], -50); });
    for (var cz4 = -4; cz4 > -100; cz4 -= 12) { var brk = box(0.08, 0.08, 1.6, basic({ color: 0xa8a69c }), PW - 1.5, 6.1, cz4); brk.rotation.y = Math.PI / 2; brk.rotation.z = 0.6; }
    for (var sg = 0; sg < 5; sg++) glow(-12 + sg * 6 + rnd() * 2, 2.5 + rnd() * 2, -108, 2, sg % 2 ? 0xff2a1a : 0xffb030, 0.8);
    var P = pathOf([[0.8, 4], [0.8, DOOR_Z + 3.2], [-1.6, DOOR_Z], [-PW - 0.1, DOOR_Z]]), people = crowd(9, [-1.6, 2.4, -90, 2], { along: true, towards: 0.7, dim: 0.85 });
    untone(scene);
    return { scene: scene, length: P.len, fov: 64, near: 0.1, far: 300, bloom: [0.36, 0.5, 0.84], nearDist: 5, yawMax: 2.3, portal: { w: 1.9, h: 2.5 },
      pose: function (s) { var p = P.at(s); return { x: p[0], y: 1.66, z: p[1], yaw: P.yaw(s) }; },
      portalAt: function () { return { x: -PW - 0.25, y: 1.3, z: DOOR_Z }; },
      lat: function (s) { return s > P.len - 6.5 ? [-0.4, 0.4] : [-3.5, 0.9]; }, /* yellow line to the columns; then the doorway */
      update: function (dt, t, s, cam) { people(dt, t, cam || P.at(s)); } };
  }

  /* ================= the train out (IMG_2595, IMG_2596): you sit; it leaves ================= */
  function buildTrain() {
    scene = new THREE.Scene(); scene.background = new THREE.Color(0x07080a); scene.fog = new THREE.FogExp2(0x0b0c0f, 0.0035);
    var HW = 1.36, SEAT_X = 0.92, EYE = 1.2;
    /* the carriage: stays still; the world outside moves */
    plane(HW * 2, 30, basic({ color: 0x232a3a }), 0, 0, -6, 0, -Math.PI / 2); plane(HW * 2, 30, basic({ color: 0xd2d2cc }), 0, 2.2, -6, 0, Math.PI / 2);
    var wall = tex(cv(256, 256, function (g, w, h) { g.fillStyle = '#c9c9c3'; g.fillRect(0, 0, w, h); g.fillStyle = '#b2b2ac'; g.fillRect(0, 196, w, 60); g.clearRect(22, 46, 212, 118); g.strokeStyle = '#3a3c40'; g.lineWidth = 6; g.strokeRect(22, 46, 212, 118); }), true);
    [-1, 1].forEach(function (sd) {
      plane(30, 2.2, basic({ map: rep(wall, 30 / 1.7, 1), transparent: true, alphaTest: 0.5, side: THREE.DoubleSide }), sd * HW, 1.1, -6, sd > 0 ? -Math.PI / 2 : Math.PI / 2);
      plane(30, 2.2, basic({ color: 0x9fb4c0, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false }), sd * (HW + 0.01), 1.1, -6, Math.PI / 2);
      box(0.3, 0.05, 30, basic({ color: 0x9a9c9e }), sd * (HW - 0.18), 1.86, -6); /* the rack */
    });
    for (var lz = 6; lz > -20; lz -= 2.4) { box(0.22, 0.03, 1.5, basic({ color: 0xffffff }), 0, 2.18, lz); glow(0, 2.05, lz, 1.2, 0xf2f6ff, 0.18); }
    var back = basic({ color: 0x9da1a6 }), cush = basic({ color: 0x2a3a6a });
    for (var k = -2; k <= 16; k++) { /* backs behind each sitter; the row in front of you is k = 1 */
      var zb = 0.3 - 0.86 * k;
      [-SEAT_X, -SEAT_X + 0.5, SEAT_X - 0.5, SEAT_X].forEach(function (x) {
        box(0.44, 0.78, 0.09, back, x, 0.86, zb); box(0.4, 0.2, 0.1, back, x, 1.3, zb); box(0.44, 0.1, 0.42, cush, x, 0.44, zb - 0.25);
        if (k >= 2 && rnd() < 0.3) { var h = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), basic({ color: HAIR[Math.floor(rnd() * HAIR.length)] })); h.position.set(x, 1.36, zb - 0.2); scene.add(h); }
      });
    }
    /* ---------- 2026-11-27, detail ---------- */
    /* seat cloth, grab handles on the aisle seats, poles and a glass screen by the doors ahead, the rack's rails, vents, a worn carpet */
    var cloth = tex(cv(64, 64, function (g, w, h) { g.fillStyle = '#263566'; g.fillRect(0, 0, w, h); for (var i = 0; i < 260; i++) { g.fillStyle = ['rgba(232,176,28,.55)', 'rgba(20,26,54,.7)', 'rgba(90,110,180,.5)'][i % 3]; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 3, 1 + rnd() * 2); } }), true);
    var carpet = tex(cv(64, 64, function (g, w, h) { g.fillStyle = '#1e2433'; g.fillRect(0, 0, w, h); for (var i = 0; i < 500; i++) { g.fillStyle = 'rgba(' + (rnd() < 0.5 ? '10,12,18' : '70,80,110') + ',' + rnd() * 0.5 + ')'; g.fillRect(rnd() * w, rnd() * h, 1.5, 1.5); } }), true);
    plane(HW * 2, 30, basic({ map: rep(carpet, 4, 44) }), 0, 0.004, -6, 0, -Math.PI / 2); plane(0.5, 30, basic({ color: 0x3a4052 }), 0, 0.006, -6, 0, -Math.PI / 2);
    for (var k2 = -2; k2 <= 16; k2++) { var zb2 = 0.3 - 0.86 * k2; [-SEAT_X, -SEAT_X + 0.5, SEAT_X - 0.5, SEAT_X].forEach(function (x, i) { plane(0.4, 0.62, basic({ map: cloth }), x, 0.9, zb2 - 0.052, Math.PI); plane(0.42, 0.4, basic({ map: cloth }), x, 0.496, zb2 - 0.25, 0, -Math.PI / 2); if (i === 1 || i === 2) { var hd = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.014, 5, 10, Math.PI), basic({ color: 0xe0b01c })); hd.position.set(x + (i === 1 ? 0.2 : -0.2), 1.38, zb2); hd.rotation.y = Math.PI / 2; scene.add(hd); } }); }
    [-0.5, 0.5].forEach(function (x) { cyl(0.02, 0.02, 2.2, basic({ color: 0xe0b01c }), x, 1.1, -15.4); plane(0.8, 1.2, basic({ color: 0x9fb4c0, transparent: true, opacity: 0.14, side: THREE.DoubleSide, depthWrite: false }), x * 1.9, 1.3, -15.2, 0); });
    [-1, 1].forEach(function (sd) { cyl(0.012, 0.012, 30, basic({ color: 0xc8ccd0 }), sd * (HW - 0.3), 1.9, -6, scene, 5).rotation.x = Math.PI / 2; for (var vz = 6; vz > -20; vz -= 1.2) box(0.2, 0.01, 0.5, basic({ color: 0xa8a8a2 }), sd * 0.55, 2.195, vz); });
    plane(HW * 2, 2.2, basic({ color: 0xbfbfb9 }), 0, 1.1, -21, 0); box(0.8, 1.95, 0.05, basic({ color: 0x8a8e94 }), 0, 0.98, -20.95); plane(0.4, 0.5, basic({ color: 0x15202c }), 0, 1.45, -20.9, 0);
    /* the carriage's own lights, faint in the glass */
    for (var rz = 6; rz > -20; rz -= 2.4) { [-1, 1].forEach(function (sd) { var q = plane(0.22, 1.5, basic({ color: 0xffffff, transparent: true, opacity: 0.10, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), sd * (HW * 2), 2.18, rz, 0, Math.PI / 2); }); }
    /* the tray on the seat in front, and the cans if you bought them */
    var tray = new THREE.Group(); tray.position.set(SEAT_X, 0.8, 0.3 - 0.86 + 0.17); scene.add(tray);
    box(0.36, 0.015, 0.24, basic({ color: 0x8a8e94 }), 0, 0, 0, tray);
    [[-0.07, 0xd9a23a, 0x7a4a12], [0.05, 0xe58ab8, 0x7a2a55]].forEach(function (c) {
      var can = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.125, 14), basic({ color: c[1] })); can.position.set(c[0], 0.07, 0.02); tray.add(can);
      var band = new THREE.Mesh(new THREE.CylinderGeometry(0.0305, 0.0305, 0.04, 14), basic({ color: c[2] })); band.position.set(c[0], 0.06, 0.02); tray.add(band);
      var top = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.03, 0.008, 14), basic({ color: 0xd7dadd })); top.position.set(c[0], 0.136, 0.02); tray.add(top);
    });
    /* outside: the platform and the train across it slide away; then the lights of the town */
    var world = new THREE.Group(); scene.add(world);
    var conc = basic({ color: 0x6c6a64 });
    box(5.2, 0.3, 150, conc, HW + 0.25 + 2.6, -1.1, -45, world); plane(0.4, 150, basic({ color: 0xc9b23a }), HW + 1.0, -0.94, -45, 0, -Math.PI / 2, world);
    for (var cz = 8; cz > -118; cz -= 12) { box(0.3, 6, 0.3, basic({ color: 0xa8a69c }), HW + 3.4, 2, cz, world); glow(HW + 2.4, 3.9, cz + 5, 3.6, 0xf4f6ff, 0.75, world); box(0.9, 0.1, 0.3, basic({ color: 0xffffff }), HW + 2.4, 4.1, cz + 5, world); }
    var side = trainSide();
    for (var c = 0; c < 5; c++) box(2.8, 2.75, 20, [basic({ map: side }), basic({ map: side }), basic({ color: 0x9a9c9e }), basic({ color: 0x111111 }), basic({ color: 0xc9ccce }), basic({ color: 0xc9ccce })], HW + 8.6, 0.35, 10 - c * 20.3 - 10, world);
    plane(40, 150, basic({ color: 0x15161a }), 6, 4.9, -45, 0, Math.PI / 2, world);
    box(2.8, 2.75, 100, [basic({ map: rep(side, 5, 1), color: 0x8a94a4 }), basic({ map: rep(side, 5, 1), color: 0x8a94a4 }), basic({ color: 0x7a7c80 }), basic({ color: 0x111111 }), basic({ color: 0x9a9c9e }), basic({ color: 0x9a9c9e })], -HW - 2.2, 0.35, -30, world);
    box(3.5, 0.3, 150, conc, -HW - 5.6, -1.1, -45, world);
    /* past the platform ends: two long fields of lights that take turns */
    var fields = [];
    for (var f = 0; f < 2; f++) {
      var G = new THREE.Group(); world.add(G); fields.push(G);
      var cols = [0xffb060, 0xffc98a, 0xfff0d2, 0xff9a48, 0xfff0d2, 0xb04cff, 0x30e0d8, 0xff4a3a, 0x4a7cff];
      for (var i = 0; i < 150; i++) { var sd = rnd() < 0.5 ? -1 : 1, dist = 9 + Math.pow(rnd(), 2) * 260; glow(sd * dist, -1 + rnd() * (4 + dist * 0.12), -rnd() * 700, 1.5 + dist * 0.03, cols[Math.floor(rnd() * cols.length)], 0.9, G); }
      for (var b = 0; b < 16; b++) { var sd2 = rnd() < 0.5 ? -1 : 1, d2 = 26 + rnd() * 160, w = 14 + rnd() * 26, h = 12 + rnd() * 60, t = winTex.clone(); t.needsUpdate = true; t.repeat.set(w / 9, h / 9); box(w, h, w, basic({ map: t }), sd2 * (d2 + w / 2), h / 2 - 3, -rnd() * 700, G); }
      for (var m = 0; m < 24; m++) { box(0.2, 5, 0.2, basic({ color: 0x2a2c30 }), HW + 4.5, 1.5, -m * 29, G); }
      /* gantries with their signals, the dark flank of a viaduct wall, lit windows close by the line, a station's lit canopy going past */
      for (var gz = 0; gz < 10; gz++) { var z0 = -30 - gz * 68; box(0.3, 7, 0.3, basic({ color: 0x1c1e22 }), -HW - 6, 2.5, z0, G); box(0.3, 7, 0.3, basic({ color: 0x1c1e22 }), HW + 12, 2.5, z0, G); box(18 + HW * 2, 0.3, 0.3, basic({ color: 0x1c1e22 }), 3, 6, z0, G); glow(HW + 2 + (gz % 3) * 3, 5.4, z0, 1.2, gz % 2 ? 0xff2a1a : 0x30ff60, 0.9, G); glow(-HW - 3, 5.4, z0, 1.2, 0xffb030, 0.9, G); }
      box(0.6, 3, 700, basic({ color: 0x0e0d0c }), HW + 14, 0.2, -350, G); box(0.6, 3, 700, basic({ color: 0x0e0d0c }), -HW - 9, 0.2, -350, G);
      for (var nb = 0; nb < 14; nb++) { var sdn = nb % 2 ? 1 : -1, t3 = winTex.clone(); t3.needsUpdate = true; t3.repeat.set(2, 1.4); box(18, 12, 1, basic({ map: t3, color: 0xd8c8a8 }), sdn * (18 + rnd() * 6), 5, -40 - nb * 48, G).rotation.y = Math.PI / 2; }
      box(4, 0.3, 60, basic({ color: 0x15161a }), HW + 3.6, 3.6, -420, G); box(4.5, 0.3, 60, basic({ color: 0x6c6a64 }), HW + 3.6, -1.1, -420, G); for (var pl = 0; pl < 6; pl++) glow(HW + 3.2, 3.2, -394 - pl * 10, 3, 0xf4f6ff, 0.8, G);
    }
    var gone = 0, v = 0, FIELD = 700, START = 110;
    untone(scene);
    return { scene: scene, ride: true, length: 34, fov: 68, near: 0.05, far: 900, bloom: [0.4, 0.55, 0.82], nearDist: 4, yawMax: 2.2, portal: null,
      pose: function () { return { x: SEAT_X, y: EYE, z: 0, yaw: -0.5 }; },
      reset: function () { gone = 0; v = 0; },
      update: function (dt, t, s) {
        tray.children.forEach(function (o, i) { if (i > 0) o.visible = kit.choices.cans === true; });
        var target = s < 4 ? 0 : Math.min(24, (s - 4) * 1.15); v += (target - v) * Math.min(1, dt * 1.5); gone += v * dt;
        world.position.z = gone;
        /* each field sits ahead of the platform's end and steps forward once it has gone by */
        fields.forEach(function (G, i) { var base = -START - i * FIELD, pass = Math.floor(Math.max(0, gone + base + FIELD + 60) / (FIELD * 2)); G.position.z = base - pass * FIELD * 2; });
        scene.rotation.z = Math.sin(t * 1.7) * 0.0025 * Math.min(1, v / 8); scene.position.y = Math.sin(t * 9.1) * 0.0025 * Math.min(1, v / 8);
      } };
  }


  /* ================= the Strand, to the front of Charing Cross (no photographs; built from knowledge of the place) =================
     Out of St Martin's Lane you come down the station side of the Strand, buses and cabs on your right, and turn in through the
     forecourt gates past the Eleanor Cross to the doors under the canopy. */
  function buildStrand() {
    scene = new THREE.Scene(); scene.background = new THREE.Color(0x0c0b0a); scene.fog = new THREE.FogExp2(0x17130f, 0.0045);
    var GATE_Z = -30, FRONT_X = -30, DOOR_Z = -44;
    plane(240, 260, basic({ color: 0x0b0b0c }), 0, -0.02, -40, 0, -Math.PI / 2); /* the roadway */
    plane(6.4, 150, basic({ map: rep(slabs, 3, 60), color: 0xcdb48a }), -0.2, 0, -45, 0, -Math.PI / 2); /* your pavement */
    plane(4, 150, basic({ map: rep(slabs, 2, 60), color: 0x8f8572 }), 19, 0, -45, 0, -Math.PI / 2); /* the far one */
    box(0.25, 0.14, 150, basic({ color: 0x6a6258 }), 3.1, 0.05, -45);
    for (var m = 20; m > -120; m -= 6) plane(0.14, 2.6, basic({ color: 0x8a8a84 }), 10, 0.0, m, 0, -Math.PI / 2);
    plane(1.2, 150, basic({ color: 0x7a1a14 }), 4.4, 0.001, -45, 0, -Math.PI / 2); /* the red of the bus lane */
    /* shop fronts with rooms above: yours on the left before the forecourt, and all down the far side */
    var street = tex(cv(1024, 512, function (g, w, h) {
      g.fillStyle = '#2a2622'; g.fillRect(0, 0, w, h);
      for (var c = 0; c < 8; c++) {
        var x = c * 128, tone = 40 + Math.floor(rnd() * 26); g.fillStyle = 'rgb(' + (tone + 16) + ',' + (tone + 8) + ',' + tone + ')'; g.fillRect(x + 2, 0, 124, 400);
        for (var r = 0; r < 4; r++) for (var k = 0; k < 3; k++) { var l = rnd(); g.fillStyle = l < 0.22 ? '#d9b46c' : l < 0.3 ? '#b8c2c8' : '#121110'; g.fillRect(x + 14 + k * 38, 26 + r * 92, 24, 56); }
        var warm = rnd() < 0.6, gr = g.createLinearGradient(0, 400, 0, h); gr.addColorStop(0, warm ? '#f4e2b4' : '#e4eef4'); gr.addColorStop(1, warm ? '#b08a4c' : '#8fa2ac'); g.fillStyle = gr; g.fillRect(x + 6, 420, 116, 92);
        for (var i = 0; i < 12; i++) { g.fillStyle = 'hsla(' + Math.floor(rnd() * 360) + ',45%,' + (30 + rnd() * 30) + '%,.55)'; g.fillRect(x + 8 + rnd() * 100, 450 + rnd() * 50, 8 + rnd() * 18, 8 + rnd() * 16); }
        g.fillStyle = ['#1b2430', '#2a1f18', '#1f2a22', '#30181a'][c % 4]; g.fillRect(x + 2, 400, 124, 22); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(x + 34, 407, 60, 7); g.fillStyle = '#141414'; g.fillRect(x + 62, 422, 4, 90);
      }
    }), true);
    plane(40, 22, basic({ map: rep(street, 0.9, 1), color: 0xa8a8a8 }), -3.4, 11, -2, Math.PI / 2);
    plane(150, 22, basic({ map: rep(street, 3.3, 1), color: 0xc8c8c8 }), 21, 11, -45, -Math.PI / 2);
    plane(50, 22, basic({ map: rep(street, 1.1, 1) }), -3.4, 11, -99, Math.PI / 2);
    /* the forecourt: railings and gate piers along the pavement, setts within */
    var setts = tex(cv(128, 128, function (g, w, h) { g.fillStyle = '#1c1a18'; g.fillRect(0, 0, w, h); for (var r = 0; r < 8; r++) for (var c = 0; c < 6; c++) { var v = 62 + Math.floor(rnd() * 26); g.fillStyle = 'rgb(' + v + ',' + (v - 3) + ',' + (v - 8) + ')'; g.fillRect(((c * 22 + (r % 2) * 11) % w) + 1, r * 16 + 1, 20, 14); } }), true);
    plane(28, 52, basic({ map: rep(setts, 14, 26), color: 0xd0c0a0 }), -17, 0.004, -48, 0, -Math.PI / 2);
    var stoneM = basic({ color: 0x6a6354 }), iron = basic({ color: 0x141416 });
    [[-22, GATE_Z + 4.5], [GATE_Z - 4.5, -74]].forEach(function (r) { box(0.4, 0.7, r[0] - r[1], stoneM, -3.4, 0.35, (r[0] + r[1]) / 2); box(0.05, 0.05, r[0] - r[1], iron, -3.4, 1.95, (r[0] + r[1]) / 2); box(0.05, 0.05, r[0] - r[1], iron, -3.4, 0.85, (r[0] + r[1]) / 2); for (var z = r[0]; z > r[1]; z -= 0.22) box(0.03, 1.3, 0.03, iron, -3.4, 1.35, z); }); /* open railings: rails and bars, no sheet */
    [-22, GATE_Z + 4.5, GATE_Z - 4.5, -52, -74].forEach(function (z) { box(1.1, 3.4, 1.1, stoneM, -3.4, 1.7, z); box(1.4, 0.3, 1.4, stoneM, -3.4, 3.5, z); box(0.3, 0.5, 0.3, basic({ color: 0xffe9c0 }), -3.4, 4.0, z); glow(-3.4, 4.0, z, 1.5, 0xffd9a0, 0.6); });
    /* the Eleanor Cross: eight-sided, tier on tier, floodlit */
    var cross = new THREE.Group(); cross.position.set(-14, 0, -40); scene.add(cross);
    var lit = basic({ color: 0x968a6e }), shade = basic({ color: 0x6e654f });
    function tier(r0, r1, h, y, mat) { var m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, h, 8), mat); m.position.y = y + h / 2; cross.add(m); return m; }
    tier(3.4, 3.4, 0.4, 0, shade); tier(2.9, 2.9, 0.4, 0.4, shade); tier(2.2, 2.0, 5.2, 0.8, lit); tier(2.3, 2.3, 0.35, 6.0, shade);
    tier(1.6, 1.4, 5.0, 6.35, lit); tier(1.7, 1.7, 0.3, 11.35, shade); tier(1.05, 0.9, 4.2, 11.65, lit); tier(1.1, 1.1, 0.25, 15.85, shade); tier(0.7, 0.05, 4.6, 16.1, lit);
    box(0.12, 1.1, 0.12, lit, 0, 21.2, 0, cross); box(0.6, 0.12, 0.12, lit, 0, 21.4, 0, cross);
    [[2.2, 6.3], [1.6, 11.6], [1.05, 16.1]].forEach(function (t) { for (var k = 0; k < 8; k++) { var a = k / 8 * Math.PI * 2 + Math.PI / 8, pin = new THREE.Mesh(new THREE.ConeGeometry(0.16, 1.5, 4), lit); pin.position.set(Math.cos(a) * t[0], t[1] + 0.75, Math.sin(a) * t[0]); cross.add(pin); } });
    for (var n = 0; n < 8; n++) { var a2 = n / 8 * Math.PI * 2; plane(0.9, 2.6, basic({ color: 0x4a4234 }), -14 + Math.cos(a2) * 2.12, 3.2, -40 + Math.sin(a2) * 2.12, Math.PI / 2 - a2); }
    glow(-14, 4, -40, 12, 0xffe2a8, 0.28); glow(-14, 12, -40, 9, 0xffe2a8, 0.2);
    /* the station hotel across the back of the forecourt, its glass canopy over the doors */
    var hotel = tex(cv(1024, 512, function (g, w, h) {
      g.fillStyle = '#16181c'; g.fillRect(0, 0, w, 96); g.fillStyle = '#b79f72'; g.fillRect(0, 96, w, h - 96);
      g.fillStyle = '#8d7a56'; [96, 180, 268, 356, 430].forEach(function (y) { g.fillRect(0, y, w, 7); });
      for (var c = 0; c < 17; c++) {
        var x = 18 + c * 59;
        for (var r = 0; r < 4; r++) { var y = 112 + r * 86, l = rnd(); g.fillStyle = l < 0.42 ? '#f0cf86' : l < 0.5 ? '#c9d2d6' : '#17150f'; g.beginPath(); g.moveTo(x, y + 62); g.lineTo(x, y + 14); g.arc(x + 15, y + 14, 15, Math.PI, 0); g.lineTo(x + 30, y + 62); g.fill(); }
        if (c % 2 === 0) { g.fillStyle = '#22252a'; g.fillRect(x - 2, 40, 34, 56); g.fillStyle = rnd() < 0.3 ? '#e6c074' : '#0e0e10'; g.fillRect(x + 6, 52, 18, 30); }
        g.fillStyle = '#f6e6ba'; g.beginPath(); g.moveTo(x - 6, h); g.lineTo(x - 6, 462); g.arc(x + 15, 462, 21, Math.PI, 0); g.lineTo(x + 36, h); g.fill();
      }
    }));
    plane(76, 30, basic({ map: hotel, color: 0xb9b3a6 }), FRONT_X, 15, -48, Math.PI / 2);
    box(4, 30, 76, basic({ color: 0x0d0d0e }), FRONT_X - 2.1, 15, -48);
    box(6.4, 0.16, 26, basic({ color: 0x9fb4bc, transparent: true, opacity: 0.35 }), FRONT_X + 3.2, 5.6, DOOR_Z); box(6.6, 0.3, 0.3, iron, FRONT_X + 3.2, 5.45, DOOR_Z + 13); box(6.6, 0.3, 0.3, iron, FRONT_X + 3.2, 5.45, DOOR_Z - 13); box(0.3, 0.3, 26, iron, FRONT_X + 6.4, 5.45, DOOR_Z);
    for (var cz = DOOR_Z + 9; cz >= DOOR_Z - 9; cz -= 6) { /* none in the doorway's line */ box(0.22, 5.4, 0.22, iron, FRONT_X + 6.3, 2.7, cz); glow(FRONT_X + 3.2, 5.0, cz, 4.2, 0xfff2d6, 0.6); box(0.5, 0.08, 0.5, basic({ color: 0xffffff }), FRONT_X + 3.2, 5.45, cz); }
    plane(5, 4.4, basic({ color: 0xa8976a }), FRONT_X + 0.04, 2.2, DOOR_Z, Math.PI / 2);
    /* cabs waiting in the forecourt */
    [[-8, -56, 0.3], [-9.5, -62, 0.25], [-21, -62, 1.5]].forEach(function (c) { var g = new THREE.Group(); g.position.set(c[0], 0, c[1]); g.rotation.y = c[2]; scene.add(g); box(1.8, 1.5, 4.4, basic({ color: 0x0b0b0d }), 0, 0.95, 0, g); box(1.6, 0.5, 2.4, basic({ color: 0x15171c }), 0, 1.8, 0.2, g); box(0.5, 0.16, 0.16, basic({ color: 0xffb030 }), 0, 2.12, -1.0, g); glow(-0.6, 0.8, 2.25, 1.0, 0xff2010, 0.9, g); glow(0.6, 0.8, 2.25, 1.0, 0xff2010, 0.9, g); });
    /* lamps down your kerb; the lights at the gate */
    for (var lz = 8; lz > -110; lz -= 17) { box(0.16, 8.5, 0.16, iron, 2.7, 4.25, lz); box(1.4, 0.1, 0.1, iron, 3.3, 8.5, lz); glow(3.9, 8.4, lz, 7, 0xffd08a, 0.95); }
    [[2.6, GATE_Z + 6, 0x2aff7a], [2.6, GATE_Z - 8, 0xff2a1a]].forEach(function (p) { box(0.1, 3.2, 0.1, iron, p[0], 1.6, p[1]); box(0.26, 0.8, 0.22, basic({ color: 0x0c0c0e }), p[0], 3.3, p[1]); glow(p[0], 3.4, p[1] + 0.15, 1.4, p[2], 1); });
    /* buses and cabs: the near lanes run your way, the far lanes against you */
    var busSide = tex(cv(512, 256, function (g, w, h) {
      g.fillStyle = '#b0181a'; g.fillRect(0, 0, w, h); g.fillStyle = '#16181c'; g.fillRect(0, h - 26, w, 26); g.fillStyle = '#1a1c20'; g.fillRect(10, 22, w - 20, 62); g.fillRect(10, 128, w - 20, 66);
      for (var i = 0; i < 9; i++) { g.fillStyle = '#f2dfa4'; g.fillRect(16 + i * 54, 26, 48, 54); if (i !== 1 && i !== 5) g.fillRect(16 + i * 54, 132, 48, 58); g.fillStyle = 'rgba(40,34,28,.55)'; if (rnd() < 0.6) g.fillRect(26 + i * 54 + rnd() * 20, 50, 13, 30); if (rnd() < 0.5 && i !== 1 && i !== 5) g.fillRect(26 + i * 54 + rnd() * 20, 156, 13, 34); }
      g.fillStyle = '#8f1214'; g.fillRect(70, 128, 48, 100); g.fillRect(286, 128, 48, 100);
    }));
    var traffic = [];
    function vehicle(bus, lane, dir, z) {
      var g = new THREE.Group(), red = basic({ color: 0x74100f });
      if (bus) { box(2.55, 4.3, 11, [basic({ map: busSide }), basic({ map: busSide }), basic({ color: 0x7a1012 }), basic({ color: 0x111111 }), red, red], 0, 2.35, 0, g); box(2.2, 1.1, 0.06, basic({ color: 0x1a1c20 }), 0, 3.3, 5.52, g); box(2.2, 0.9, 0.06, basic({ color: 0x1a1c20 }), 0, 1.6, 5.52, g); box(1.6, 0.36, 0.06, basic({ color: 0xffb030 }), 0, 3.95, -5.52, g); box(2.2, 1.5, 0.06, basic({ color: 0x1a1c20 }), 0, 1.7, -5.52, g); }
      else { box(1.8, 1.5, 4.4, basic({ color: 0x0b0b0d }), 0, 0.95, 0, g); box(1.6, 0.5, 2.4, basic({ color: 0x15171c }), 0, 1.8, 0.2, g); box(0.5, 0.16, 0.16, basic({ color: 0xffb030 }), 0, 2.12, -1.0, g); }
      var half = bus ? 5.5 : 2.2, hy = bus ? 0.9 : 0.75;
      glow(-0.75, hy, -half - 0.05, 1.7, 0xfff6d8, 1, g); glow(0.75, hy, -half - 0.05, 1.7, 0xfff6d8, 1, g); glow(-0.75, hy + 0.1, half + 0.05, 1.4, 0xff2010, 1, g); glow(0.75, hy + 0.1, half + 0.05, 1.4, 0xff2010, 1, g);
      g.rotation.y = dir < 0 ? 0 : Math.PI; scene.add(g); traffic.push({ g: g, x: lane, dir: dir, z: z, v: (bus ? 4.2 : 6) + rnd() * 2.5 });
    }
    vehicle(true, 4.6, -1, 20); vehicle(false, 7.6, -1, -10); vehicle(true, 4.6, -1, -60); vehicle(false, 7.6, -1, -95);
    vehicle(true, 15.4, 1, -40); vehicle(false, 12.4, 1, -75); vehicle(false, 12.4, 1, 5); vehicle(true, 15.4, 1, -118);
    /* ---------- 2026-11-27, detail ---------- */
    /* awnings and hanging signs on your side; a cornice over the shop fronts on both */
    for (var az = 15; az > -20; az -= 4.4) { var aw = box(1.3, 0.05, 3.7, basic({ color: [0x2a1416, 0x14241c, 0x1a2030, 0x2a2416][Math.floor(rnd() * 4)] }), -2.85, 3.5, az); aw.rotation.z = -0.3; box(0.06, 0.55, 0.8, basic({ color: 0x101214 }), -2.9, 4.7, az + 1.9); box(0.5, 0.04, 0.04, iron, -3.15, 5.0, az + 1.9); }
    box(0.5, 0.35, 40, basic({ color: 0x3a342c }), -3.3, 4.75, -2); box(0.6, 0.4, 150, basic({ color: 0x302b25 }), 20.8, 4.75, -45); box(0.5, 0.5, 150, basic({ color: 0x25211c }), 20.8, 22, -45);
    /* bollards down the kerb, bins, a bus shelter with its lit panel */
    for (var bz = 12; bz > -112; bz -= 3.6) { if (Math.abs(bz - GATE_Z) < 5) continue; cyl(0.07, 0.085, 1.0, iron, 2.75, 0.5, bz); cyl(0.074, 0.074, 0.08, basic({ color: 0xb8b4a8 }), 2.75, 0.86, bz); }
    [[1.9, 2], [1.9, -18], [-2.4, -76]].forEach(function (q) { box(0.55, 1.05, 0.55, basic({ color: 0x101214 }), q[0], 0.52, q[1]); box(0.6, 0.06, 0.6, basic({ color: 0x2a2c30 }), q[0], 1.07, q[1]); });
    box(0.08, 2.5, 0.08, iron, 2.3, 1.25, -8); box(0.08, 2.5, 0.08, iron, 2.3, 1.25, -13); box(1.5, 0.08, 5.4, basic({ color: 0x1a1c20 }), 1.7, 2.55, -10.5); plane(4.8, 2.1, basic({ color: 0x9fb4bc, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false }), 2.3, 1.3, -10.5, Math.PI / 2);
    plane(1.2, 1.8, basic({ color: 0xe8d8b8 }), 1.1, 1.3, -13.02, 0); plane(1.2, 1.8, basic({ color: 0xc8dcf0 }), 1.1, 1.3, -13.06, Math.PI); glow(1.1, 1.3, -13.3, 3.2, 0xdfe8ff, 0.45); box(1.2, 0.08, 0.3, basic({ color: 0x4a3626 }), 1.6, 0.5, -10);
    /* the lamps' light in the air and on the ground; the shop fronts' light on the pavement; the road's wet shine */
    for (var lz2 = 8; lz2 > -110; lz2 -= 17) { kit.cone(scene, 3.9, 8.3, lz2, 8.3, 4.6, 0xffc070, 0.13); pool(3.2, lz2, 9, 9, 0xffb860, 0.5); streak(9, lz2, 4, 18, 0xffb860, 0.5); }
    pool(-1.6, -2, 4, 40, 0xffe2b0, 0.4); pool(18.6, -45, 4, 150, 0xffe2b0, 0.3); streak(13, -45, 5, 150, 0xffd9a0, 0.16);
    pool(-14, -40, 16, 16, 0xffe2a8, 0.45); pool(FRONT_X + 4, DOOR_Z, 9, 24, 0xfff0d0, 0.5);
    foot(-3.35, -2, 40, Math.PI / 2, 1.8); foot(FRONT_X + 0.06, -48, 76, Math.PI / 2, 2.2); foot(20.95, -45, 150, -Math.PI / 2, 1.8);
    /* the hotel's cornices and its mansard, dormers lit here and there; chimneys against the sky */
    [9.2, 14.6, 20.0, 25.6].forEach(function (y) { box(0.6, 0.45, 76, basic({ color: 0x8a7a58 }), FRONT_X + 0.3, y, -48); });
    box(3.4, 6.5, 76, basic({ color: 0x121418 }), FRONT_X - 1.2, 33.2, -48);
    for (var dz = -14; dz > -84; dz -= 6.2) { box(0.5, 2.2, 1.7, basic({ color: 0x1b1e24 }), FRONT_X + 0.6, 32.2, dz); plane(1.1, 1.5, basic({ color: rnd() < 0.3 ? 0xe6c074 : 0x0b0c0e }), FRONT_X + 0.87, 32.1, dz, Math.PI / 2); }
    [-20, -38, -58, -76].forEach(function (z) { box(1.6, 4, 2.6, basic({ color: 0x15130f }), FRONT_X - 1.5, 38.4, z); });
    glow(FRONT_X + 2, 12, -48, 60, 0xffd9a0, 0.10);
    /* the far end of the street: roofs, lit windows, the red of brake lights */
    [[-10, -150, 30, 26], [18, -165, 26, 34], [44, -150, 30, 22], [-40, -160, 26, 30]].forEach(function (b) { var t = winTex.clone(); t.needsUpdate = true; t.repeat.set(b[2] / 9, b[3] / 9); box(b[2], b[3], 12, basic({ map: t, fog: false, color: 0x9a9a9a }), b[0], b[3] / 2, b[1]); });
    for (var f2 = 0; f2 < 16; f2++) glow(5 + rnd() * 11, 0.9 + rnd(), -120 - rnd() * 40, 1.6 + rnd() * 2, rnd() < 0.6 ? 0xff2814 : 0xfff0d0, 0.6);
    /* wheels, and each vehicle's lights on the wet road */
    traffic.forEach(function (v) {
      var long = v.g.children[0].geometry.parameters.depth > 8, half = long ? 5.5 : 2.2;
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) { var wh = cyl(0.48, 0.48, 0.3, basic({ color: 0x08080a }), q[0] * (long ? 1.15 : 0.82), 0.48, q[1] * (half - (long ? 2 : 1.1)), v.g, 12); wh.rotation.z = Math.PI / 2; });
      streak(0, -half - 4.5, 2.2, 9, 0xfff2d0, 0.55, v.g); streak(0, half + 3.5, 2.0, 7, 0xff2010, 0.5, v.g);
    });
    var P = pathOf([[0, 4], [0, GATE_Z + 1], [-9, GATE_Z - 5], [-22, DOOR_Z + 0.5], [FRONT_X + 1.2, DOOR_Z]]);
    var onStreet = crowd(30, [-2.6, 2.4, -110, 14], { along: true, towards: 0.5, dim: 0.7, tint: 0xffdcae }), inYard = crowd(10, [-26, -6, -60, -34], { dim: 0.7, tint: 0xffdcae, still: 0.3 });
    untone(scene);
    return { scene: scene, length: P.len, fov: 62, near: 0.15, far: 600, bloom: [0.42, 0.5, 0.86], nearDist: 10, yawMax: 2.3, portal: { w: 5.2, h: 4.6 },
      pose: function (s) { var p = P.at(s); return { x: p[0], y: 1.66, z: p[1], yaw: P.yaw(s) }; },
      portalAt: function () { return { x: FRONT_X + 0.5, y: 2.3, z: DOOR_Z }; },
      lat: function (s) { return s < 30 ? [-2.4, 2.3] : s > P.len - 6 ? [-1.6, 1.6] : [-2.6, 2.6]; }, /* railings to kerb; through the gate; the doors */
      update: function (dt, t, s, cam) {
        var c = cam || P.at(s); onStreet(dt, t, c); inYard(dt, t, c);
        traffic.forEach(function (v) { v.z += v.dir * v.v * dt; if (v.z > 40) v.z = -130; if (v.z < -130) v.z = 40; v.g.position.set(v.x, 0, v.z); });
      } };
  }

  return { strand: buildStrand(), tunnel: buildTunnel(), arch: buildArch(), concourse: buildConcourse(), platform: buildPlatform(), train: buildTrain() };
};
