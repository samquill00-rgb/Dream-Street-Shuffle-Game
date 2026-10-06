"""The French: one visual pass (2026-10-05). Exact-string edits inside the INSIDE THE FRENCH block; refuses to run twice."""
import sys
P = "/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee"
s = open(P, encoding="utf-8").read()
if "the street's lamp comes in at the window" in s: sys.exit("already applied")
a = s.index("// ====== INSIDE THE FRENCH — THE ROOM, WITH CLOSE-UPS ======"); b = s.index("// ====== INSIDE THE COLONY", a)
blk = s[a:b]; orig = blk
def rep(old, new, n=1):
    global blk
    assert blk.count(old) == n, (blk.count(old), old[:70])
    blk = blk.replace(old, new)

# 1. The two opal globes turned down: the walls were one flat orange, and the three people vanished into it.
rep("var lampMain = new THREE.PointLight(0xffd09a, 2.25, 9, 1.7);", "var lampMain = new THREE.PointLight(0xffd09a, 1.5, 9, 1.7);")
rep("lampMain.intensity = 2.25 + breath;", "lampMain.intensity = 1.5 + breath;")
rep("var lampBack = new THREE.PointLight(0xffc486, 1.5, 8, 1.7);", "var lampBack = new THREE.PointLight(0xffc486, 1.0, 8, 1.7);")
rep("lampBack.intensity = 1.5 + Math.sin(t * 0.39 + 1.2) * 0.027;", "lampBack.intensity = 1.0 + Math.sin(t * 0.39 + 1.2) * 0.027;")
rep("scene.add(new THREE.AmbientLight(0x68513a, 0.3));", "scene.add(new THREE.AmbientLight(0x68513a, 0.2));")

# 2. The people drawn as the cellar's are now: the lit figure over the room, not added to it, so they hold on a warm wall.
rep("function ghostTex(seed) { return window.dssGhostTex(tex, rnd, seed, false, false, [255, 225, 180]); }",
    "function ghostTex(seed) { return window.dssGhostTex(tex, rnd, seed, false, true, [255, 225, 180]); }")
rep("[[1.95, 0.8, 0, 0.7, 0], [4.05, 0.8, 0, 0.56, 2], [5.7, 1.4, 0, 0.44, 4]].forEach(function(gs, i) {",
    "[[1.95, 0.8, 0, 1.0, 0], [4.05, 0.8, 0, 0.9, 2], [5.7, 1.4, 0, 0.62, 4]].forEach(function(gs, i) {")
rep("var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ghostTex(gs[4]), transparent: true, opacity: gs[3] * 0.8, depthWrite: false, blending: THREE.AdditiveBlending }));",
    "var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ghostTex(gs[4]), transparent: true, opacity: gs[3] * 0.8, depthWrite: false, blending: THREE.NormalBlending }));")

# 3. The street's lamp comes in at the window: a cold pale spill on the carpet under the sill, the one light in the room that is not the French's.
rep("var winLight = new THREE.PointLight(0xffd8a0, 0.18, 5, 2);",
    "var winSpillTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(w * 0.85, h * 0.5, 0, w * 0.85, h * 0.5, w * 0.8); g.addColorStop(0, 'rgba(225,215,200,0.5)'); g.addColorStop(0.3, 'rgba(210,200,190,0.22)'); g.addColorStop(1, 'rgba(190,185,180,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); cx.globalCompositeOperation = 'destination-out'; cx.fillStyle = 'rgba(0,0,0,0.55)'; for (var i = 0; i < 6; i++) cx.fillRect(0, 8 + i * 20, w, 3); });\n"
    "var winSpill = mesh(new THREE.PlaneGeometry(2.2, 1.6), new THREE.MeshBasicMaterial({ map: winSpillTex, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), W / 2 - 1.15, 0.006, -2.4); winSpill.rotation.x = -Math.PI / 2; winSpill.rotation.z = 0; // the street's lamp comes in at the window\n"
    "var winLight = new THREE.PointLight(0xe8dcc8, 0.42, 5, 2);")

# 4. The globes' light on the ceiling: a warm disc over each lamp, the ceiling's paint catching it.
rep("mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), brass, 0.4, 3.15, -0.3);",
    "mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), brass, 0.4, 3.15, -0.3);\n"
    "var ceilPoolMat = new THREE.MeshBasicMaterial({ map: glowTex, color: 0xffd8a0, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false });\n"
    "[[0.4, -0.3, 2.6], [-0.6, -2.6, 2.3]].forEach(function(cp) { var pool = mesh(new THREE.PlaneGeometry(cp[2], cp[2]), ceilPoolMat, cp[0], H - 0.01, cp[1]); pool.rotation.x = Math.PI / 2; });")

assert blk != orig
open(P, "w", encoding="utf-8").write(s[:a] + blk + s[b:])
print("applied")
