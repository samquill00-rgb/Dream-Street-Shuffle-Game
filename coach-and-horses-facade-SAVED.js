// ============================================================
// COACH & HORSES — FACADE CODE (SAVED COPY)
// ============================================================
// This is a saved copy of the Coach & Horses front facade
// from the Dean Street 3D prototype.
//
// WHAT MAKES IT WORK:
// -------------------
// 1. Cream upper floors with a deep red ground-floor shopfront
// 2. Five red columns with gold capitals (like the real pub)
// 3. A gold fascia sign reading "THE COACH & HORSES"
// 4. Warm glowing pub windows between the columns
// 5. Three rows of Georgian upper windows (with sills, lintels, glazing bars)
// 6. Cornices (horizontal ledges) at each floor level
// 7. A tall vertical red-and-gold banner on the side wall
// 8. Warm light spilling out onto the pavement
// 9. A clickable door with brass handle and warm light
// 10. Two hanging pub signs with painted coach-and-horses scenes
//
// DEPENDENCIES (helper functions from the main prototype):
//   - addCornice(parent, x, z, width, y, depth, color)
//   - addWindowRow(parent, localX, localZ, startY, count, spacing, litChance, faceZ)
//   - makeSign(text, opts) — creates a canvas texture for signs
//   - createDoor(x, z, w, h, venueName, passage, faceZ)
//   - createHangingSign(x, z, text, subtext, faceZ)
//
// To use this in a new project, you'd also need those helpers
// plus the Three.js library loaded.
// ============================================================

(function() {
  var g = new THREE.Group();

  // ---- UPPER FLOORS — cream/off-white Georgian brick ----
  var upper = new THREE.Mesh(
    new THREE.BoxGeometry(7, 8.5, 7),
    new THREE.MeshLambertMaterial({ color: 0xd8d0c0 })
  );
  upper.position.set(0, 7.75, 0);
  g.add(upper);

  // ---- GROUND FLOOR — deep red shopfront panel ----
  var ground = new THREE.Mesh(
    new THREE.BoxGeometry(7, 3.5, 0.4),
    new THREE.MeshLambertMaterial({ color: 0x7a1515 })
  );
  ground.position.set(0, 1.75, 3.7);
  g.add(ground);

  // ---- RED COLUMNS WITH GOLD CAPITALS ----
  // Five columns spaced evenly across the front,
  // each with a small gold block on top (the "capital")
  for (var cx = -2.5; cx <= 2.5; cx += 1.25) {
    var col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.11, 3.2, 8),
      new THREE.MeshLambertMaterial({ color: 0x7a1515 })
    );
    col.position.set(cx, 1.6, 3.95);
    g.add(col);

    // Gold capital on top of each column
    var cap = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.1, 0.25),
      new THREE.MeshLambertMaterial({ color: 0xd4a030 })
    );
    cap.position.set(cx, 3.25, 3.95);
    g.add(cap);
  }

  // ---- GOLD FASCIA SIGN ----
  // Uses canvas texture to paint "THE COACH & HORSES" in gold
  // on a deep red background with a gold border
  var fascia = new THREE.Mesh(
    new THREE.BoxGeometry(6.8, 0.55, 0.18),
    new THREE.MeshBasicMaterial({
      map: makeSign('THE COACH & HORSES', {
        bg: '#5a1010',
        fg: '#ffd700',
        fs: 28,
        border: '#d4a030'
      })
    })
  );
  fascia.position.set(0, 3.35, 3.88);
  g.add(fascia);

  // ---- LARGE PUB WINDOWS (warm glow between columns) ----
  for (var wx = -1.8; wx <= 1.8; wx += 1.2) {
    var pw = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 2.2),
      new THREE.MeshBasicMaterial({
        color: 0xffd699,
        transparent: true,
        opacity: 0.8
      })
    );
    pw.position.set(wx, 1.6, 3.93);
    g.add(pw);
  }

  // ---- CORNICES (horizontal ledges at floor levels) ----
  addCornice(g, 0, 3.8, 7, 3.6, 0.35, 0xd4c8b8);   // above shopfront
  addCornice(g, 0, 3.8, 7, 7, 0.2, 0xc8bca8);        // mid floor
  addCornice(g, 0, 3.8, 7, 12, 0.25, 0xd4c8b8);      // roofline

  // ---- UPPER WINDOWS (3 rows of Georgian sash windows) ----
  // Each row: 3 windows, spaced 2 units apart
  // litChance controls how many have warm light inside
  addWindowRow(g, 0, 3.9, 5.5, 3, 2, 0.45, 1);   // 1st floor — 45% lit
  addWindowRow(g, 0, 3.9, 8, 3, 2, 0.35, 1);      // 2nd floor — 35% lit
  addWindowRow(g, 0, 3.9, 10.5, 3, 2, 0.25, 1);   // 3rd floor — 25% lit

  // ---- VERTICAL BANNER ON SIDE WALL ----
  // Painted canvas with "THE COACH & HORSES" in gold on red
  var bannerC = document.createElement('canvas');
  bannerC.width = 128;
  bannerC.height = 384;
  var bctx = bannerC.getContext('2d');

  // Red background with gold border
  bctx.fillStyle = '#5a1010';
  bctx.fillRect(0, 0, 128, 384);
  bctx.strokeStyle = '#d4a030';
  bctx.lineWidth = 4;
  bctx.strokeRect(8, 8, 112, 368);

  // Gold text
  bctx.fillStyle = '#ffd700';
  bctx.font = 'bold 20px Georgia';
  bctx.textAlign = 'center';
  bctx.fillText('THE', 64, 50);
  bctx.fillText('COACH', 64, 85);
  bctx.fillText('&', 64, 115);
  bctx.fillText('HORSES', 64, 150);
  bctx.font = '14px Georgia';
  bctx.fillText('Est. 1847', 64, 200);
  bctx.font = 'bold 24px Georgia';
  bctx.fillText('PUB', 64, 300);

  var bannerTex = new THREE.CanvasTexture(bannerC);
  var banner = new THREE.Mesh(
    new THREE.BoxGeometry(1, 5, 0.1),
    new THREE.MeshBasicMaterial({ map: bannerTex })
  );
  banner.position.set(3.2, 7, 3.85);
  g.add(banner);

  // ---- WARM LIGHT SPILL onto the pavement ----
  var cSpill = new THREE.PointLight(0xffd080, 0.8, 8);
  cSpill.position.set(0, 1.5, 5.5);
  g.add(cSpill);

  // ---- POSITION the whole building on the street ----
  // Left side of Dean Street, z = -8
  g.position.set(-9.5, 0, -8);
  scene.add(g);

  // ---- CLICKABLE DOOR (warm glow, brass handle) ----
  createDoor(-9.5, -4.08, 1.3, 2.3, 'Coach & Horses', 'Coach and Horses lock', 1);

  // ---- TWO HANGING PUB SIGNS ----
  // Each has a painted scene with a coach and horses
  createHangingSign(-12, -4.1, 'Coach & Horses', 'Est. 1847', 1);
  createHangingSign(-7, -4.1, 'Coach & Horses', "The West End's Best", 1);
})();
