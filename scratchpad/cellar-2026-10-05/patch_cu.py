"""Copper's cellar: one visual pass (2026-10-05). Exact-string edits on the twee's CU block; refuses to run twice."""
import sys
P = "/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee"
s = open(P, encoding="utf-8").read()
if "the standing water gives the bulb back" in s: sys.exit("already applied")
a, b = s.index("// >>>> DSS ROOM CU BEGIN"), s.index("// <<<< DSS ROOM CU END")
blk = s[a:b]; orig = blk
def rep(old, new, n=1):
    global blk
    assert blk.count(old) == n, (blk.count(old), old[:60])
    blk = blk.replace(old, new)

# 1. The bulb: less of it. The walls were lit like a shop, and the three people in the room washed out against them.
rep("var bulbLight = new THREE.PointLight(0xd8c8a0, 2.0, 16, 1.4);", "var bulbLight = new THREE.PointLight(0xd8c8a0, 1.35, 16, 1.4);")
rep("bulbLight.intensity = 3.0 + 0.08 * Math.sin(t * 9.3) + 0.05 * Math.sin(t * 2.1);",
    "bulbLight.intensity = 1.35 + 0.08 * Math.sin(t * 9.3) + 0.07 * Math.sin(t * 2.1) + (Math.sin(t * 0.37) > 0.992 ? -0.35 : 0);")
rep("scene.add(new THREE.AmbientLight(0x1a1620, 0.6)); scene.add(new THREE.HemisphereLight(0x3a3630, 0x0a0806, 0.28));",
    "scene.add(new THREE.AmbientLight(0x1a1620, 0.45)); scene.add(new THREE.HemisphereLight(0x3a3630, 0x0a0806, 0.22));")

# 2. The three of them, now that the room is darker, come forward.
rep("var frankie = k.ghost(0.45, 0, -D / 2 + 2.4 - 0.55, 3, 0.55, true, false, 1.2);", "var frankie = k.ghost(0.45, 0, -D / 2 + 2.4 - 0.55, 3, 0.8, true, false, 1.2);")
rep("var ashton = k.ghost(-0.45, 0, -D / 2 + 2.4 + 0.55, 5, 0.62, true, true, 0.95);", "var ashton = k.ghost(-0.45, 0, -D / 2 + 2.4 + 0.55, 5, 0.82, true, true, 0.95);")
rep("var copper = k.ghost(-0.85, 0, 2.3, 7, 0.72, false, true, 0.92);", "var copper = k.ghost(-0.85, 0, 2.3, 7, 0.9, false, true, 0.92);")

# 3. The puddle becomes standing water: a planar reflection of the bulb, Copper and the joists, rippled, gone at the edges.
rep("var refl = mesh(new THREE.PlaneGeometry(0.34, 0.62), new THREE.MeshBasicMaterial({ map: reflTex, transparent: true, opacity: 0.18,",
    "var water = mesh(new THREE.PlaneGeometry(1.15, 1.0), M.hidden, -0.6, 0.009, 2.2); water.rotation.x = -Math.PI / 2;\n"
    "k.makeMirror(water, new THREE.Vector3(0, 1, 0), 256, new THREE.Vector3(0.72, 0.44, 0.38), { transparent: true, ripple: true, edge: '0.9' });\n"
    "// the standing water gives the bulb back, and Copper, and the joists; the painted smear stays for the drip to brighten\n"
    "var refl = mesh(new THREE.PlaneGeometry(0.34, 0.62), new THREE.MeshBasicMaterial({ map: reflTex, transparent: true, opacity: 0.1,")
rep("refl.material.opacity = 0.18 + (cyc > 0.95 ? 0.1 : 0) + 0.02 * Math.sin(t * 9.3);", "refl.material.opacity = 0.1 + (cyc > 0.95 ? 0.12 : 0) + 0.02 * Math.sin(t * 9.3);")

# 4. The line of light under the door comes down the stairs: a wedge of it hanging in the air over the treads, fading before it reaches the floor.
rep("var doorLine = new THREE.PointLight(0xffe0a0, 0.25, 2.5, 2);",
    "var spillTex = tex(32, 128, function(cx, w, h) { var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(255,232,190,0.55)'); g.addColorStop(0.25, 'rgba(255,225,180,0.22)'); g.addColorStop(0.7, 'rgba(240,210,160,0.05)'); g.addColorStop(1, 'rgba(240,210,160,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); var side = cx.createLinearGradient(0, 0, w, 0); side.addColorStop(0, 'rgba(0,0,0,0.6)'); side.addColorStop(0.2, 'rgba(0,0,0,0)'); side.addColorStop(0.8, 'rgba(0,0,0,0)'); side.addColorStop(1, 'rgba(0,0,0,0.6)'); cx.globalCompositeOperation = 'destination-out'; cx.fillStyle = side; cx.fillRect(0, 0, w, h); });\n"
    "var spillGeo = new THREE.BufferGeometry(); spillGeo.setAttribute('position', new THREE.Float32BufferAttribute([-0.43, 2.03, 2.52, 0.43, 2.03, 2.52, -0.43, 1.08, 0.9, 0.43, 1.08, 0.9], 3)); spillGeo.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 1, 1], 2)); spillGeo.setIndex([0, 2, 1, 1, 2, 3]); spillGeo.computeVertexNormals();\n"
    "var spill = new THREE.Mesh(spillGeo, new THREE.MeshBasicMaterial({ map: spillTex, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); stairG.add(spill);\n"
    "var doorLine = new THREE.PointLight(0xffe0a0, 0.25, 2.5, 2);")

# 5. Dust in the bulb's light: the air under it is not empty.
rep("scene.add(new THREE.AmbientLight(0x1a1620, 0.45));",
    "var moteTex = tex(32, 32, function(cx, w, h) { var g = cx.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,240,210,1)'); g.addColorStop(0.35, 'rgba(255,230,190,0.5)'); g.addColorStop(1, 'rgba(255,220,170,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });\n"
    "var MOTES = 70, motePos = new Float32Array(MOTES * 3), moteSeed = [];\n"
    "for (var mi = 0; mi < MOTES; mi++) { var mr = rnd(mi * 3 + 50) * 0.9, ma = rnd(mi * 5 + 50) * 6.283, my = 0.25 + rnd(mi * 7 + 50) * 1.4; motePos[mi * 3] = Math.cos(ma) * mr * (0.3 + my * 0.5); motePos[mi * 3 + 1] = my; motePos[mi * 3 + 2] = 0.6 + Math.sin(ma) * mr * (0.3 + my * 0.5); moteSeed.push([rnd(mi * 11 + 50) * 6.28, 0.04 + rnd(mi * 13 + 50) * 0.05, 0.1 + rnd(mi * 17 + 50) * 0.25]); }\n"
    "var moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));\n"
    "var motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({ map: moteTex, color: 0xffe8c0, size: 0.028, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, fog: false })); scene.add(motes);\n"
    "scene.add(new THREE.AmbientLight(0x1a1620, 0.45));")
rep("var cyc = (t % 6) / 6;",
    "var mp = moteGeo.attributes.position.array; for (var mi2 = 0; mi2 < MOTES; mi2++) { var ms = moteSeed[mi2]; mp[mi2 * 3 + 1] += ms[1] * dt * Math.sin(t * 0.3 + ms[0]) - 0.006 * dt; mp[mi2 * 3] += Math.sin(t * ms[2] + ms[0]) * 0.0006; if (mp[mi2 * 3 + 1] < 0.2) mp[mi2 * 3 + 1] = 1.65; } moteGeo.attributes.position.needsUpdate = true; motes.material.opacity = 0.4 + 0.15 * Math.sin(t * 0.8);\n"
    "var cyc = (t % 6) / 6;")

assert blk != orig
open(P, "w", encoding="utf-8").write(s[:a] + blk + s[b:])
print("applied")
