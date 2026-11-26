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
  /* plain figures, no faces. Each walks a heading inside a box of floor and turns at its edges */
  var COATS = [0x1b2233, 0x23201d, 0x3a2a22, 0x4a1f24, 0x2a3a34, 0x8a6a48, 0x15161a, 0x5a5d62, 0x1f2f4a, 0x0e0e10], HAIR = [0x15110e, 0x2a1c12, 0x6a5a48, 0x0c0c0e, 0x8a8478];
  function crowd(n, b, opts) {
    opts = opts || {}; var list = [];
    for (var i = 0; i < n; i++) {
      var g = new THREE.Group(), dim = opts.dim || 1, cc = new THREE.Color(COATS[Math.floor(rnd() * COATS.length)]).multiplyScalar(dim);
      var body = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.19, 0.8, 8), basic({ color: cc })); body.position.y = 1.2; body.scale.x = 0.62; g.add(body);
      var head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 8, 6), basic({ color: new THREE.Color(HAIR[Math.floor(rnd() * HAIR.length)]).multiplyScalar(dim) })); head.position.y = 1.72; g.add(head);
      var lg = new THREE.BoxGeometry(0.13, 0.84, 0.15); lg.translate(0, -0.42, 0); var lm = basic({ color: new THREE.Color(rnd() < 0.7 ? 0x16181e : 0x3a4250).multiplyScalar(dim) });
      var l1 = new THREE.Mesh(lg, lm), l2 = new THREE.Mesh(lg, lm); l1.position.set(0, 0.84, -0.09); l2.position.set(0, 0.84, 0.09); g.add(l1); g.add(l2);
      g.scale.setScalar(0.94 + rnd() * 0.14);
      var along = opts.along, a = along ? (rnd() < (opts.towards == null ? 0.5 : opts.towards) ? Math.PI / 2 : -Math.PI / 2) + (rnd() - 0.5) * 0.12 : rnd() * Math.PI * 2;
      list.push({ g: g, l1: l1, l2: l2, x: b[0] + rnd() * (b[1] - b[0]), z: b[2] + rnd() * (b[3] - b[2]), a: a, v: rnd() < (opts.still || 0) ? 0 : 1.0 + rnd() * 0.7, ph: rnd() * 6 });
      scene.add(g);
    }
    return function (dt, t, c) {
      list.forEach(function (q) {
        q.x += Math.cos(q.a) * q.v * dt; q.z += Math.sin(q.a) * q.v * dt;
        if (q.x < b[0] || q.x > b[1]) { q.a = Math.PI - q.a; q.x = Math.max(b[0], Math.min(b[1], q.x)); }
        if (q.z < b[2]) { if (opts.along) q.z = b[3]; else { q.a = -q.a; q.z = b[2]; } }
        if (q.z > b[3]) { if (opts.along) q.z = b[2]; else { q.a = -q.a; q.z = b[3]; } }
        var dx = q.x - c[0], dz = q.z - c[1], d = Math.hypot(dx, dz); if (d < 1.2 && d > 0.001) { q.x = c[0] + dx / d * 1.2; q.z = c[1] + dz / d * 1.2; }
        q.g.position.set(q.x, (opts.y || 0) + (q.v ? Math.abs(Math.cos(t * q.v * 4.4 + q.ph)) * 0.025 : 0), q.z); q.g.rotation.y = -q.a;
        var sw = q.v ? Math.sin(t * q.v * 4.4 + q.ph) * 0.5 : 0; q.l1.rotation.z = sw; q.l2.rotation.z = -sw;
      });
    };
  }

  /* ---------- shared textures ---------- */
  var slabs = tex(cv(256, 256, function (g, w, h) {
    g.fillStyle = '#2c2a28'; g.fillRect(0, 0, w, h);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) { var v = 120 + Math.floor(rnd() * 26); g.fillStyle = 'rgb(' + v + ',' + (v - 3) + ',' + (v - 8) + ')'; g.fillRect(((c * 86 + (r % 2) * 43) % w) + 1, r * 64 + 1, 84, 62); }
    for (var i = 0; i < 2200; i++) { g.fillStyle = 'rgba(' + (rnd() < 0.6 ? '20,18,16' : '200,196,188') + ',' + rnd() * 0.09 + ')'; g.fillRect(rnd() * w, rnd() * h, 2, 2); }
  }), true);
  var tile = tex(cv(256, 256, function (g, w, h) {
    g.fillStyle = '#a39f96'; g.fillRect(0, 0, w, h);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) { var v = 172 + Math.floor(rnd() * 18); g.fillStyle = 'rgb(' + v + ',' + (v - 3) + ',' + (v - 9) + ')'; g.fillRect(c * 64 + 1, r * 64 + 1, 62, 62); }
  }), true);
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
    var P = pathOf([[0.9, Z0 - 1], [0.9, Z1 + 2]]), people = crowd(16, [-1.4, 3.6, Z1, Z0], { along: true, towards: 0.3, dim: 0.8 });
    untone(scene);
    return { scene: scene, length: P.len, fov: 62, near: 0.1, far: 200, bloom: [0.4, 0.5, 0.82], nearDist: 10, yawMax: 2.3, portal: { w: 6.4, h: 4.6 },
      pose: function (s) { var p = P.at(s); return { x: p[0], y: 1.66, z: p[1], yaw: P.yaw(s) }; },
      portalAt: function (s) { return { x: 0.4, y: 2.3, z: Z1 + 1.4 }; },
      update: function (dt, t, s) { people(dt, t, P.at(s)); } };
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
    var P = pathOf([[2.5, 12], [2.5, -34], [ARCH_X, FACE_Z + 8], [ARCH_X, FACE_Z + 0.6]]), people = crowd(34, [-3, 8.5, -56, 14], { along: true, towards: 0.75, dim: 0.75 });
    function rise(z) { return Math.max(0, Math.min(1.02, (FACE_Z + 5.4 - z) / 3 * 1.02)); }
    untone(scene);
    return { scene: scene, length: P.len, fov: 62, near: 0.15, far: 900, bloom: [0.4, 0.5, 0.88], nearDist: 12, yawMax: 2.3, portal: { w: 9.5, h: 10 },
      pose: function (s) { var p = P.at(s); return { x: p[0], y: 1.66 + rise(p[1]), z: p[1], yaw: P.yaw(s) }; },
      portalAt: function () { return { x: ARCH_X, y: 5.6, z: FACE_Z + 0.15 }; },
      update: function (dt, t, s) {
        people(dt, t, P.at(s));
        cars.forEach(function (c) { c.z += c.dir * c.v * dt; if (c.z > 40) c.z = -70; if (c.z < -70) c.z = 40; c.g.position.set(c.x, 0, c.z); });
      } };
  }

  /* ================= the Waterloo concourse (IMG_2593) ================= */
  function buildConcourse() {
    scene = new THREE.Scene(); scene.background = new THREE.Color(0x0c0d10); scene.fog = new THREE.FogExp2(0x16171b, 0.003);
    var HW = 56, Z0 = 2, Z1 = -36, H = 17, zc = (Z0 + Z1) / 2, depth = Z0 - Z1, GATE_X = 16;
    plane(HW * 2, depth + 80, basic({ map: rep(tile, 56, 60), color: 0xf0ede6 }), 0, 0, zc - 40, 0, -Math.PI / 2);
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
    var P = pathOf([[-30, 0.5], [-30, -8], [GATE_X - 6, -26], [GATE_X, Z1 + 0.8]]), people = crowd(70, [-HW + 2, HW - 2, Z1 + 2, Z0 - 4], { still: 0.2 });
    untone(scene);
    return { scene: scene, length: P.len, fov: 66, near: 0.15, far: 500, bloom: [0.32, 0.5, 0.86], nearDist: 9, yawMax: 2.3, portal: { w: 5.4, h: 4.4 },
      pose: function (s) { var p = P.at(s); return { x: p[0], y: 1.66, z: p[1], yaw: P.yaw(s) }; },
      portalAt: function () { return { x: GATE_X, y: 2.2, z: Z1 + 0.2 }; },
      update: function (dt, t, s) { people(dt, t, P.at(s)); } };
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
    var P = pathOf([[0.8, 4], [0.8, DOOR_Z + 3.2], [-1.6, DOOR_Z], [-PW - 0.1, DOOR_Z]]), people = crowd(7, [-1.6, 2.4, -90, 2], { along: true, towards: 0.7 });
    untone(scene);
    return { scene: scene, length: P.len, fov: 64, near: 0.1, far: 300, bloom: [0.36, 0.5, 0.84], nearDist: 5, yawMax: 2.3, portal: { w: 1.9, h: 2.5 },
      pose: function (s) { var p = P.at(s); return { x: p[0], y: 1.66, z: p[1], yaw: P.yaw(s) }; },
      portalAt: function () { return { x: -PW - 0.25, y: 1.3, z: DOOR_Z }; },
      update: function (dt, t, s) { people(dt, t, P.at(s)); } };
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
    }
    var gone = 0, v = 0, FIELD = 700, START = 110;
    untone(scene);
    return { scene: scene, ride: true, length: 40, fov: 68, near: 0.05, far: 900, bloom: [0.4, 0.55, 0.82], nearDist: 4, yawMax: 2.2, portal: null,
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

  return { tunnel: buildTunnel(), arch: buildArch(), concourse: buildConcourse(), platform: buildPlatform(), train: buildTrain() };
};
