/* The walk to Waterloo, stage: Charing Cross. In through a shop off the forecourt (the fridge of canned cocktails on the right),
   out of its far door onto the concourse, across to the side way out for the bridge. Today's station, not 1973: Sam's ruling, 2026-11-26.
   Built without photographs; no shop or railway names are shown. Frame: the walk heads -z first, x to the right. */
window.WW_buildChx = function (kit) {
  'use strict';
  var cv = kit.cv, tex = kit.tex, rnd = kit.rnd;
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0c0c);
  scene.fog = new THREE.FogExp2(0x17161a, 0.0045);

  function basic(o) { return new THREE.MeshBasicMaterial(o); }
  function box(w, h, d, mat, x, y, z, parent) { var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); (parent || scene).add(m); return m; }
  function plane(w, h, mat, x, y, z, ry, rx, parent) { var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); m.position.set(x, y, z); if (ry) m.rotation.y = ry; if (rx) m.rotation.x = rx; (parent || scene).add(m); return m; }
  function glow(x, y, z, size, color, op) {
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: kit.glowTex, color: color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: op == null ? 1 : op, fog: false }));
    s.position.set(x, y, z); s.scale.set(size, size, 1); scene.add(s); return s;
  }
  function rep(t, rx, ry) { var c = t.clone(); c.needsUpdate = true; c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rx, ry); return c; }

  /* ---------- measurements ---------- */
  var SHOP_HW = 3.6, SHOP_Z0 = -2, SHOP_Z1 = -16.5, SHOP_H = 3.1;
  var HALL_HW = 34, HALL_Z0 = SHOP_Z1, GATES_Z = -50, HALL_H = 11, EXIT_Z = -46.5, EXIT_W = 4.2; /* the door straight to the bridge, left of the platforms (Sam, 2026-11-26) */

  /* ---------- textures ---------- */
  var tile = tex(cv(256, 256, function (g, w, h) {
    g.fillStyle = '#9a958b'; g.fillRect(0, 0, w, h);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) { var v = 150 + Math.floor(rnd() * 22); g.fillStyle = 'rgb(' + v + ',' + (v - 4) + ',' + (v - 12) + ')'; g.fillRect(c * 64 + 1, r * 64 + 1, 62, 62); }
    for (var i = 0; i < 1600; i++) { g.fillStyle = 'rgba(60,56,50,' + rnd() * 0.08 + ')'; g.fillRect(rnd() * w, rnd() * h, 2, 2); }
  }), true);
  var vinyl = tex(cv(128, 128, function (g, w, h) { g.fillStyle = '#6f7074'; g.fillRect(0, 0, w, h); for (var i = 0; i < 900; i++) { g.fillStyle = 'rgba(' + (rnd() < 0.5 ? '30,30,34' : '170,170,176') + ',' + rnd() * 0.12 + ')'; g.fillRect(rnd() * w, rnd() * h, 2, 2); } }), true);
  var brick = tex(cv(256, 256, function (g, w, h) {
    g.fillStyle = '#3a3128'; g.fillRect(0, 0, w, h);
    for (var r = 0; r < 16; r++) for (var c = 0; c < 9; c++) { var a = 0.75 + rnd() * 0.3; g.fillStyle = 'rgb(' + Math.floor(150 * a) + ',' + Math.floor(118 * a) + ',' + Math.floor(72 * a) + ')'; g.fillRect(c * 32 - (r % 2) * 16 + 1, r * 16 + 1, 30, 14); }
    for (var i = 0; i < 700; i++) { g.fillStyle = 'rgba(20,16,12,' + rnd() * 0.2 + ')'; g.fillRect(rnd() * w, rnd() * h, 3, 6 + rnd() * 16); }
  }), true);
  var stone = tex(cv(128, 128, function (g, w, h) { g.fillStyle = '#2b2824'; g.fillRect(0, 0, w, h); g.fillStyle = '#353129'; for (var r = 0; r < 4; r++) for (var c = 0; c < 2; c++) g.fillRect(c * 64 + (r % 2) * 32 - 32 + 1, r * 32 + 1, 62, 30); g.fillRect(97, 33, 30, 30); }), true);
  function shelfTex() {
    return tex(cv(512, 256, function (g, w, h) {
      g.fillStyle = '#d9d6cf'; g.fillRect(0, 0, w, h);
      var cols = ['#c8372d', '#e0b02c', '#2c6fb0', '#2f8f5a', '#e8e4da', '#7a3f8f', '#e07a2c', '#1f2a44', '#d94f86', '#3aa6a0', '#5a3a22'];
      for (var r = 0; r < 5; r++) {
        var y = r * 51 + 6, x = 4;
        while (x < w - 6) { var bw = 8 + Math.floor(rnd() * 22), bh = 26 + Math.floor(rnd() * 16), run = 1 + Math.floor(rnd() * 4), col = cols[Math.floor(rnd() * cols.length)];
          for (var k = 0; k < run && x < w - 6; k++) { g.fillStyle = col; g.fillRect(x, y + 44 - bh, bw, bh); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x + 2, y + 44 - bh + 4, bw - 4, 5); x += bw + 1; } x += 2; }
        g.fillStyle = '#8d8a84'; g.fillRect(0, y + 44, w, 5); g.fillStyle = '#f4f2ea'; g.fillRect(0, y + 45, w, 2);
      }
    }), true);
  }
  var fridge = tex(cv(512, 512, function (g, w, h) { /* the chiller: four shelves of cans under a white strip */
    g.fillStyle = '#eef3f6'; g.fillRect(0, 0, w, h);
    var cans = [['#d9a23a', '#7a4a12'], ['#e86a6a', '#7a1f2a'], ['#3aa6a0', '#0f4a4a'], ['#e7d24a', '#6a5a10'], ['#e58ab8', '#7a2a55'], ['#c9ccd2', '#4a4e58'], ['#8fbf4a', '#2f5a1a'], ['#f08a3a', '#7a3a10']];
    for (var r = 0; r < 4; r++) {
      var y = r * 124 + 22, x = 10, kind = cans[Math.floor(rnd() * cans.length)], left = 0;
      g.fillStyle = '#cfd6da'; g.fillRect(0, y + 92, w, 10); g.fillStyle = '#ffffff'; g.fillRect(0, r * 124, w, 9);
      while (x < w - 30) {
        if (left <= 0) { kind = cans[Math.floor(rnd() * cans.length)]; left = 3 + Math.floor(rnd() * 5); }
        g.fillStyle = kind[0]; g.fillRect(x, y + 14, 26, 78); g.fillStyle = kind[1]; g.fillRect(x, y + 42, 26, 22);
        g.fillStyle = '#d7dadd'; g.fillRect(x + 2, y + 8, 22, 7); g.fillStyle = 'rgba(255,255,255,.45)'; g.fillRect(x + 4, y + 16, 4, 74);
        x += 29; left--;
      }
    }
  }));
  var board = tex(cv(1024, 256, function (g, w, h) { /* the departures: amber rows, nothing to read */
    g.fillStyle = '#07080a'; g.fillRect(0, 0, w, h);
    for (var c = 0; c < 8; c++) {
      var x0 = c * 128 + 6; g.fillStyle = '#f3efe2'; g.fillRect(x0, 8, 60 + rnd() * 40, 14);
      for (var r = 0; r < 11; r++) { g.fillStyle = r === 0 ? '#ffc04a' : 'rgba(255,176,48,' + (0.55 + rnd() * 0.4) + ')'; var x = x0; while (x < x0 + 100) { var bw = 6 + rnd() * 26; if (rnd() < 0.85) g.fillRect(x, 32 + r * 19, Math.min(bw, x0 + 112 - x), 10); x += bw + 5; } }
      g.fillStyle = '#1b1d22'; g.fillRect(c * 128 + 125, 0, 3, h);
    }
  }));
  function frontTex(warm) { /* a lit shop front seen from the hall: glass, mullions, a blur of stock, a blank fascia */
    return tex(cv(512, 256, function (g, w, h) {
      var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, warm ? '#f2e2bc' : '#e6eef2'); gr.addColorStop(1, warm ? '#b99a62' : '#9fb0b8'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 90; i++) { g.fillStyle = 'hsla(' + Math.floor(rnd() * 360) + ',45%,' + (35 + rnd() * 30) + '%,.5)'; g.fillRect(rnd() * w, 90 + rnd() * 150, 14 + rnd() * 40, 10 + rnd() * 30); }
      g.fillStyle = '#16181c'; for (var x = 0; x <= w; x += 128) g.fillRect(x - 3, 0, 6, h); g.fillRect(0, 0, w, 6);
      g.fillStyle = warm ? '#2a1f18' : '#1b2430'; g.fillRect(0, 0, w, 52); g.fillStyle = 'rgba(255,255,255,.75)'; g.fillRect(w / 2 - 70, 20, 140, 12);
    }));
  }
  var truss = tex(cv(256, 128, function (g, w, h) {
    g.clearRect(0, 0, w, h); g.strokeStyle = '#d9dbd8'; g.lineWidth = 9;
    g.beginPath(); g.moveTo(0, 6); g.lineTo(w, 6); g.moveTo(0, h - 6); g.lineTo(w, h - 6); g.stroke();
    g.lineWidth = 6; g.beginPath(); g.moveTo(0, h - 6); g.lineTo(w / 2, 6); g.lineTo(w, h - 6); g.moveTo(0, 0); g.lineTo(0, h); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke();
  }), true);

  /* ---------- outside: the forecourt and the station front ---------- */
  var paving = rep(stone, 30, 12); plane(90, 30, basic({ map: paving, color: 0x8a8478 }), 0, 0, 12, 0, -Math.PI / 2);
  var facade = rep(stone, 34, 8);
  [[-HALL_HW, -SHOP_HW], [SHOP_HW, HALL_HW]].forEach(function (r) { plane(r[1] - r[0], 16, basic({ map: facade }), (r[0] + r[1]) / 2, 8, SHOP_Z0, 0); });
  plane(SHOP_HW * 2, 16 - SHOP_H, basic({ map: facade }), 0, SHOP_H + (16 - SHOP_H) / 2, SHOP_Z0, 0);
  for (var fx = -27; fx <= 27; fx += 9) { if (Math.abs(fx) < 5) continue; plane(3.2, 5.5, basic({ color: 0x191613 }), fx, 6.5, SHOP_Z0 + 0.03, 0); glow(fx, 3.2, SHOP_Z0 + 0.6, 4.5, 0xffb060, 0.35); }

  /* ---------- the shop ---------- */
  (function () {
    plane(SHOP_HW * 2, SHOP_Z0 - SHOP_Z1, basic({ map: rep(vinyl, 5, 10), color: 0xd8d8dc }), 0, 0.01, (SHOP_Z0 + SHOP_Z1) / 2, 0, -Math.PI / 2);
    plane(SHOP_HW * 2, SHOP_Z0 - SHOP_Z1, basic({ color: 0xcfcfca }), 0, SHOP_H, (SHOP_Z0 + SHOP_Z1) / 2, 0, Math.PI / 2);
    var len = SHOP_Z0 - SHOP_Z1, zc = (SHOP_Z0 + SHOP_Z1) / 2, wall = basic({ color: 0xbdbbb4 });
    plane(len, SHOP_H, wall, -SHOP_HW, SHOP_H / 2, zc, Math.PI / 2); plane(len, SHOP_H, wall, SHOP_HW, SHOP_H / 2, zc, -Math.PI / 2);
    /* glass front and back, a doorway in each */
    var glass = basic({ color: 0xbfd0d6, transparent: true, opacity: 0.16, side: THREE.DoubleSide }), frame = basic({ color: 0x1c1e22 });
    [SHOP_Z0, SHOP_Z1].forEach(function (z) {
      [-1, 1].forEach(function (sd) { plane(SHOP_HW - 1.1, SHOP_H, glass, sd * (1.1 + (SHOP_HW - 1.1) / 2), SHOP_H / 2, z, 0); box(0.09, SHOP_H, 0.09, frame, sd * 1.1, SHOP_H / 2, z); box(0.09, SHOP_H, 0.09, frame, sd * SHOP_HW, SHOP_H / 2, z); });
      box(SHOP_HW * 2, 0.5, 0.12, frame, 0, SHOP_H - 0.25, z);
    });
    /* shelving down the left, and past the fridge on the right */
    plane(len - 1.5, 2.3, basic({ map: rep(shelfTex(), 3, 1) }), -SHOP_HW + 0.32, 1.2, zc, Math.PI / 2);
    box(0.32, 2.4, len - 1.5, basic({ color: 0x8f8d88 }), -SHOP_HW + 0.15, 1.2, zc);
    plane(4.2, 2.3, basic({ map: shelfTex() }), SHOP_HW - 0.32, 1.2, -4.6, -Math.PI / 2);
    box(0.32, 2.4, 4.2, basic({ color: 0x8f8d88 }), SHOP_HW - 0.15, 1.2, -4.6);
    /* the chiller, with its cans */
    box(0.7, 2.4, 3.6, basic({ color: 0x2a2d32 }), SHOP_HW - 0.35, 1.2, -9.4);
    plane(3.4, 2.05, basic({ map: fridge, color: 0xa9adb2 }), SHOP_HW - 0.71, 1.25, -9.4, -Math.PI / 2);
    box(0.5, 0.12, 3.6, basic({ color: 0xc8ccd0 }), SHOP_HW - 0.5, 2.36, -9.4);
    glow(SHOP_HW - 1.0, 1.4, -9.4, 5, 0xdff2ff, 0.15);
    /* the till by the far door */
    box(1.0, 1.0, 2.6, basic({ color: 0x3a3f46 }), SHOP_HW - 0.6, 0.5, -14.2); box(1.06, 0.05, 2.66, basic({ color: 0x9aa0a6 }), SHOP_HW - 0.6, 1.02, -14.2);
    box(0.3, 0.32, 0.36, basic({ color: 0x16181c }), SHOP_HW - 0.6, 1.2, -14.4); plane(0.26, 0.2, basic({ color: 0x7fd6ff }), SHOP_HW - 0.76, 1.22, -14.4, -Math.PI / 2);
    /* a middle gondola, low, on the left of the way through */
    box(0.8, 1.35, 6.5, basic({ color: 0x9a9892 }), -1.55, 0.68, -8.5);
    plane(6.5, 1.25, basic({ map: rep(shelfTex(), 2, 0.6) }), -1.14, 0.7, -8.5, Math.PI / 2); plane(6.5, 1.25, basic({ map: rep(shelfTex(), 2, 0.6) }), -1.96, 0.7, -8.5, -Math.PI / 2);
    for (var z = -3.6; z > SHOP_Z1; z -= 2.6) { box(0.16, 0.05, 1.5, basic({ color: 0xffffff }), 0.3, SHOP_H - 0.04, z); glow(0.3, SHOP_H - 0.2, z, 1.4, 0xf4f8ff, 0.12); }
    glow(0, 1.6, SHOP_Z0 + 0.4, 9, 0xeaf2ff, 0.3);
  })();

  /* ---------- the concourse ---------- */
  var people = [];
  (function () {
    var depth = HALL_Z0 - GATES_Z, zc = (HALL_Z0 + GATES_Z) / 2;
    plane(HALL_HW * 2, depth + 70, basic({ map: rep(tile, 34, 52), color: 0xe8e4dc }), 0, 0, zc - 35, 0, -Math.PI / 2);
    /* the floor's shine under the roof lights */
    var shine = tex(cv(64, 256, function (g, w, h) { var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, 'rgba(255,255,255,.22)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }));
    /* south wall: the row of shop fronts either side of ours */
    var k = 0;
    for (var x = -HALL_HW; x < HALL_HW; x += 7.6) {
      var x1 = Math.min(HALL_HW, x + 7.6), mid = (x + x1) / 2;
      if (Math.abs(mid) < SHOP_HW + 0.5) { k++; continue; }
      plane(x1 - x, 4.2, basic({ map: frontTex(k % 2 === 0) }), mid, 2.1, HALL_Z0 + 0.02, Math.PI); k++;
    }
    plane(HALL_HW * 2, HALL_H - 4.2, basic({ map: rep(brick, 22, 2.4) }), 0, 4.2 + (HALL_H - 4.2) / 2, HALL_Z0 + 0.02, Math.PI);
    box(SHOP_HW * 2 + 1, 1.1, 0.2, basic({ color: 0x1b2430 }), 0, 3.65, HALL_Z0 - 0.05);
    /* side walls: stock brick, round-headed recesses; the way out for the bridge in the west one */
    var sideLen = depth + 70, sz = HALL_Z0 - sideLen / 2;
    plane(sideLen, HALL_H, basic({ map: rep(brick, 36, 3.6) }), HALL_HW, HALL_H / 2, sz, -Math.PI / 2);
    var a = HALL_Z0 - (EXIT_Z + EXIT_W / 2), b = sideLen - a - EXIT_W;
    plane(a, HALL_H, basic({ map: rep(brick, a / 3, 3.6) }), -HALL_HW, HALL_H / 2, HALL_Z0 - a / 2, Math.PI / 2);
    plane(b, HALL_H, basic({ map: rep(brick, b / 3, 3.6) }), -HALL_HW, HALL_H / 2, EXIT_Z - EXIT_W / 2 - b / 2, Math.PI / 2);
    plane(EXIT_W, HALL_H - 4.6, basic({ map: rep(brick, 1.5, 2) }), -HALL_HW, 4.6 + (HALL_H - 4.6) / 2, EXIT_Z, Math.PI / 2);
    box(0.5, 4.6, 0.4, basic({ color: 0xcfc9b8 }), -HALL_HW + 0.1, 2.3, EXIT_Z + EXIT_W / 2); box(0.5, 4.6, 0.4, basic({ color: 0xcfc9b8 }), -HALL_HW + 0.1, 2.3, EXIT_Z - EXIT_W / 2);
    box(0.5, 0.45, EXIT_W + 0.4, basic({ color: 0xcfc9b8 }), -HALL_HW + 0.1, 4.8, EXIT_Z);
    box(0.12, 0.6, 3.2, basic({ color: 0x0a2a5c }), -HALL_HW + 0.4, 5.6, EXIT_Z); /* the blue way-out board, left blank */
    plane(6, 5, basic({ color: 0x0a0a0c }), -HALL_HW - 3, 2.4, EXIT_Z, Math.PI / 2); /* the dark beyond the arch */
    [-1, 1].forEach(function (sd) { for (var z = HALL_Z0 - 6; z > GATES_Z - 60; z -= 8) { if (sd < 0 && Math.abs(z - EXIT_Z) < 6) continue; plane(3.4, 6.2, basic({ color: 0x1d1814 }), sd * (HALL_HW - 0.03), 4.3, z, -sd * Math.PI / 2); } });
    /* the roof: white trusses, night glass, rows of lights */
    plane(HALL_HW * 2, depth + 70, basic({ color: 0x101216 }), 0, HALL_H + 1.4, zc - 35, 0, Math.PI / 2);
    for (var z = HALL_Z0 - 2.5; z > GATES_Z - 66; z -= 5) {
      plane(HALL_HW * 2, 1.5, basic({ map: rep(truss, 17, 1), transparent: true, alphaTest: 0.3, side: THREE.DoubleSide }), 0, HALL_H + 0.5, z, 0);
      if (z > GATES_Z - 4) for (var x2 = -HALL_HW + 5.5; x2 < HALL_HW; x2 += 9) {
        box(1.3, 0.1, 0.5, basic({ color: 0xffffff }), x2, HALL_H - 0.3, z + 2.5); glow(x2, HALL_H - 0.6, z + 2.5, 5, 0xf2f6ff, 0.55);
        var s = plane(3.5, 7, basic({ map: shine, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), x2, 0.02, z + 2.5, 0, -Math.PI / 2); s.renderOrder = 1;
      }
    }
    for (var cx = -HALL_HW + 11; cx < HALL_HW; cx += 11.4) for (var cz = HALL_Z0 - 9; cz > GATES_Z - 60; cz -= 16) box(0.34, HALL_H + 1, 0.34, basic({ color: 0xc9ccc8 }), cx, (HALL_H + 1) / 2, cz);
    /* the gate line, the board over it, the platforms and trains beyond */
    for (var gx = -24; gx <= 27; gx += 1.5) {
      box(0.34, 1.05, 1.5, basic({ color: 0x8f949a }), gx, 0.52, GATES_Z); box(0.36, 0.06, 0.5, basic({ color: rnd() < 0.8 ? 0x35d06a : 0xe8452c }), gx, 1.08, GATES_Z + 0.45);
      if (Math.abs(gx % 9) < 0.1) box(0.2, 2.4, 0.2, basic({ color: 0x5a5f66 }), gx, 1.2, GATES_Z);
    }
    plane(44, 3.6, basic({ map: board }), 0, 5.9, GATES_Z + 1.2, 0); box(44.4, 3.9, 0.3, basic({ color: 0x15171b }), 0, 5.9, GATES_Z + 1.0);
    [-19, 19].forEach(function (x3) { box(0.3, 4.1, 0.3, basic({ color: 0x2a2d32 }), x3, 2.05, GATES_Z + 1.0); });
    for (var p = 0; p < 6; p++) {
      var px = -25 + p * 10;
      box(1.5, 0.75, 0.1, basic({ color: 0x0a2a5c }), px, 3.55, GATES_Z + 0.4); /* platform plates, numberless */
      box(4.2, 1.0, 62, basic({ color: 0x7c7a74 }), px, 0.5, GATES_Z - 36); box(4.3, 0.04, 62, basic({ color: 0xd9c23a }), px, 1.02, GATES_Z - 36);
      if (p % 2 === 0 || p === 3) {
        var tx = px + 4.9, body = basic({ color: 0xd4d7da }), win = basic({ color: 0xf2dc96 });
        box(2.7, 2.6, 58, body, tx, 2.3, GATES_Z - 38); box(2.74, 0.75, 56, win, tx, 2.75, GATES_Z - 38); box(2.76, 0.5, 58.05, basic({ color: 0x1f3352 }), tx, 1.25, GATES_Z - 38);
        box(2.5, 1.5, 0.1, basic({ color: 0xe6c21c }), tx, 1.9, GATES_Z - 8.95); box(2.1, 0.8, 0.12, basic({ color: 0x15181c }), tx, 2.95, GATES_Z - 8.95);
        glow(tx - 0.8, 1.4, GATES_Z - 8.8, 1.6, 0xffffff, 0.9); glow(tx + 0.8, 1.4, GATES_Z - 8.8, 1.6, 0xffffff, 0.9);
      }
    }
    /* a clock, and benches */
    var clock = box(1.5, 1.5, 0.25, basic({ color: 0x15171b }), 0, 8.4, HALL_Z0 - 14); plane(1.2, 1.2, basic({ color: 0xf4f1e6 }), 0, 8.4, HALL_Z0 - 13.86, 0); plane(1.2, 1.2, basic({ color: 0xf4f1e6 }), 0, 8.4, HALL_Z0 - 14.14, Math.PI);
    [[12, -26], [12, -34], [-9, -44], [22, -42]].forEach(function (q) { box(3.2, 0.45, 0.6, basic({ color: 0x6a4a2c }), q[0], 0.42, q[1]); box(3.2, 0.5, 0.08, basic({ color: 0x6a4a2c }), q[0], 0.8, q[1] + 0.3); });

    /* the crowd: plain figures, no faces */
    var coats = [0x1b2233, 0x23201d, 0x3a2a22, 0x4a1f24, 0x2a3a34, 0x8a6a48, 0x15161a, 0x5a5d62, 0x1f2f4a], hair = [0x15110e, 0x2a1c12, 0x6a5a48, 0x0c0c0e, 0x8a8478];
    for (var i = 0; i < 46; i++) {
      var g = new THREE.Group(), coat = basic({ color: coats[Math.floor(rnd() * coats.length)] }), lm = basic({ color: rnd() < 0.7 ? 0x16181e : 0x3a4250 });
      var body = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.19, 0.8, 8), coat); body.position.y = 1.2; body.scale.x = 0.62; g.add(body);
      var head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 8, 6), basic({ color: hair[Math.floor(rnd() * hair.length)] })); head.position.y = 1.72; g.add(head);
      var lg = new THREE.BoxGeometry(0.13, 0.84, 0.15); lg.translate(0, -0.42, 0);
      var l1 = new THREE.Mesh(lg, lm), l2 = new THREE.Mesh(lg, lm); l1.position.set(0, 0.84, -0.09); l2.position.set(0, 0.84, 0.09); g.add(l1); g.add(l2);
      g.scale.setScalar(0.94 + rnd() * 0.14);
      var still = rnd() < 0.22, ang = rnd() < 0.6 ? (rnd() < 0.5 ? 0 : Math.PI) + (rnd() - 0.5) * 0.5 : rnd() * Math.PI * 2;
      people.push({ g: g, l1: l1, l2: l2, x: -HALL_HW + 2 + rnd() * (HALL_HW * 2 - 4), z: GATES_Z + 2.5 + rnd() * (depth - 5), a: ang, v: still ? 0 : 1.0 + rnd() * 0.7, ph: rnd() * 6 });
      scene.add(g);
    }
  })();

  /* ---------- the way through ---------- */
  var PTS = [[0, 4], [0, SHOP_Z1 - 1.5], [-3, -27], [-24, EXIT_Z + 1.5], [-HALL_HW + 0.5, EXIT_Z]], cum = [0];
  for (var i = 1; i < PTS.length; i++) cum.push(cum[i - 1] + Math.hypot(PTS[i][0] - PTS[i - 1][0], PTS[i][1] - PTS[i - 1][1]));
  var LEN = cum[cum.length - 1];
  function at(s) {
    s = Math.max(0, Math.min(LEN, s));
    for (var i = 1; i < cum.length; i++) if (s <= cum[i]) { var t = (s - cum[i - 1]) / (cum[i] - cum[i - 1]); return [PTS[i - 1][0] + (PTS[i][0] - PTS[i - 1][0]) * t, PTS[i - 1][1] + (PTS[i][1] - PTS[i - 1][1]) * t]; }
    return PTS[PTS.length - 1];
  }
  function yawAt(s) { var a = at(s - 1.2), b = at(s + 2.6), dx = b[0] - a[0], dz = b[1] - a[1]; if (s + 2.6 > LEN) { dx = PTS[PTS.length - 1][0] - PTS[PTS.length - 2][0]; dz = PTS[PTS.length - 1][1] - PTS[PTS.length - 2][1]; } return Math.atan2(-dx, -dz); }
  var FRIDGE_S = 4 + 8.6;

  scene.traverse(function (o) { [].concat(o.material || []).forEach(function (m) { m.toneMapped = false; }); });
  return {
    scene: scene, length: LEN, fov: 64, near: 0.1, far: 400, bloom: [0.32, 0.5, 0.86], nearDist: 9, yawMax: 2.3, portal: { w: 4.4, h: 4.6 },
    /* the words of the question are a placeholder for Sam's own */
    prompts: [{ id: 'cans', at: FRIDGE_S, look: -0.95, draft: true, text: 'Canned cocktails for the train?', options: [{ label: 'Buy them', value: true }, { label: 'Walk on', value: false }] }],
    pose: function (s) { var p = at(s); return { x: p[0], y: 1.66, z: p[1], yaw: yawAt(s) }; },
    lat: function (s) { return s < 21.5 ? [-0.7, 1.5] : s > LEN - 7 ? [-1.2, 1.2] : [-5, 5]; }, /* the aisle; the hall; the doorway */
    portalAt: function () { return { x: -HALL_HW + 0.2, y: 2.3, z: EXIT_Z }; },
    portalYaw: Math.PI / 2,
    update: function (dt, t, s, cam) {
      var c = cam || at(s);
      people.forEach(function (q) {
        q.x += Math.cos(q.a) * q.v * dt; q.z += Math.sin(q.a) * q.v * dt;
        if (q.x < -HALL_HW + 1.5 || q.x > HALL_HW - 1.5) { q.a = Math.PI - q.a; q.x = Math.max(-HALL_HW + 1.5, Math.min(HALL_HW - 1.5, q.x)); }
        if (q.z > HALL_Z0 - 2 || q.z < GATES_Z + 2) { q.a = -q.a; q.z = Math.max(GATES_Z + 2, Math.min(HALL_Z0 - 2, q.z)); }
        var dx = q.x - c[0], dz = q.z - c[1], d = Math.hypot(dx, dz); if (d < 1.3 && d > 0.001) { q.x = c[0] + dx / d * 1.3; q.z = c[1] + dz / d * 1.3; }
        q.g.position.set(q.x, q.v ? Math.abs(Math.cos(t * q.v * 4.4 + q.ph)) * 0.025 : 0, q.z); q.g.rotation.y = -q.a;
        var sw = q.v ? Math.sin(t * q.v * 4.4 + q.ph) * 0.5 : 0; q.l1.rotation.z = sw; q.l2.rotation.z = -sw;
      });
    }
  };
};
