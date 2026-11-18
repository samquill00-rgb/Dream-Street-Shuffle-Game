"""resting-dog.glb -> models/dog.bin (DSSF, read by window.dssFur). 2026-11-18.
Run: blender -b --python tools/dog_to_dssf.py -- "../resting-dog.glb" models/dog.bin [fur-share multiplier] ['{"taper_x": 0.34}' to try another snout]
Solid meshes go through Blender (decimated, vertex colours kept); the mesh fur is read straight from the glb,
thinned to a share of its strands, each kept strand stored as three points, a width, a normal and two colours.
DSSF: 'DSSF', u32 version, f32 min[3], f32 size[3], u32 groups, f32 pivot[3] each,
 u32 meshes, each: u32 group, u32 gloss, u32 nv, u32 ni, u16 pos[nv*3], i8 normal[nv*3], u8 colour[nv*3] (sRGB), u16 index[ni], each array padded to 4;
 u32 furs, each: u32 group, u32 strands, u16 points[strands*9] (root, middle, tip), u8 colours[strands*6] (root, tip), i8 normal[strands*3], u8 width[strands] (0.05 mm), each padded to 4."""
import bpy, sys, os, struct, numpy as np
argv = sys.argv[sys.argv.index('--') + 1:]
SRC, OUT = argv[0], argv[1]
KEEP_MUL = float(argv[2]) if len(argv) > 2 else 1.0
import json
CT = {5120: np.int8, 5121: np.uint8, 5122: np.int16, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
NC = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}
class GLB:
    def __init__(s, p):
        b = open(p, 'rb').read(); cl = struct.unpack_from('<I', b, 12)[0]
        s.j = json.loads(b[20:20 + cl]); s.bin = memoryview(b)[20 + cl + 8:]
    def acc(s, i):
        a = s.j['accessors'][i]; bv = s.j['bufferViews'][a['bufferView']]; dt = np.dtype(CT[a['componentType']]); n = NC[a['type']]
        off = bv.get('byteOffset', 0) + a.get('byteOffset', 0); stride = bv.get('byteStride', 0)
        if stride and stride != dt.itemsize * n:
            raw = np.frombuffer(s.bin, np.uint8, stride * a['count'], off).reshape(a['count'], stride)[:, :dt.itemsize * n].copy()
            arr = raw.view(dt).reshape(a['count'], n)
        else:
            arr = np.frombuffer(s.bin, dt, a['count'] * n, off).reshape(a['count'], n)
        if a.get('normalized'):
            arr = arr.astype(np.float32) / np.iinfo(dt).max
        return arr


GROUPS = {'Body and shoulders': 1, 'White chest ruff': 2}
DECIMATE = [('Asymmetric collie head', 0.42), ('Body and shoulders', 0.14), ('White chest ruff', 0.3), ('paw', 0.3), ('toe', 0.35), ('nail', 0.4)]
GLOSS = ('iris', 'Eye globe', 'Pupil', 'Catchlight', 'nose')
# share of strands kept, and how much wider each kept strand is drawn
FUR = [('head', 0.36, 2.6), ('lid', 0.7, 1.6), ('ear', 0.45, 2.2), ('tail', 0.38, 2.6), ('ruff', 0.42, 2.4), ('paw', 0.35, 2.6), ('', 0.34, 2.8)]

# 2026-11-18 (Sam: "make the dog's snout less weird shaped. It looks like she ate a bee's nest. Make it more gentle and elegant"): the model's muzzle is a
# short drum as wide and as tall as it is long, set square on the face with its top at eye height. Here, in the head's own space (x across, y up, z out
# along the nose; the eyes end at z 0.10), everything in front of the eyes is drawn in toward the line of the nose, more the further forward it is, so the
# muzzle tapers to a smaller nose and its bridge slopes down from the brow, widening into the cheeks under the eyes and narrowing between them, and it is let out a
# little in length. Then the skin of the front of the face (not the eyes or their lids) is smoothed hard, which takes out the drum's ridges; the nose, the lips,
# the whiskers and each strand of fur go with the skin nearest them.
import json as _json
SN = dict(za=0.105, z0=0.12, z1=0.212, base_lo=1.15, base_hi=0.7, tip=0.58, pw=0.9, tip_y=0.55, yc0=0.03, yc1=0.022, length=0.03, lam=0.5, rep=320, top=0.098)
if len(argv) > 3: SN.update(_json.loads(argv[3]))
def _ss(a, b, v): t = np.clip((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def snout(p):
    x, y, z = p[:, 0], p[:, 1], p[:, 2]
    w = _ss(SN['za'], SN['z0'] + 0.005, z); u = np.clip((z - SN['z0']) / (SN['z1'] - SN['z0']), 0, 1)
    base = SN['base_lo'] + (SN['base_hi'] - SN['base_lo']) * _ss(0.05, 0.11, y)       # wide under the eyes, narrow between them
    sx = (1 + w * (base - 1)) * (1 - (1 - SN['tip'] / base) * u ** SN['pw'])
    yc = SN['yc0'] + (SN['yc1'] - SN['yc0']) * u; sy = 1 - (1 - SN['tip_y']) * u ** SN['pw']
    # the muzzle's top stood at 0.14, level with the eyes (0.126): above the line of the nose it is pressed down so it starts under them (Sam: "the snout still goes too far up the face")
    up = 1 - _ss(0.112, 0.125, z) * (1 - (SN['top'] - yc) / (0.14 - yc)); sy = np.where(y > yc, sy * up, sy)
    return np.stack([x * sx, yc + (y - yc) * sy, z + SN['length'] * _ss(SN['z0'], SN['z1'], z)], 1)
def smooth_mask(p):   # on the model's own head space, before the taper: the front of the face, but not the eyes and their lids
    x, y, z = p[:, 0], p[:, 1], p[:, 2]
    eye = np.minimum(np.linalg.norm(p - np.array([0.09, 0.126, 0.085]), axis=1), np.linalg.norm(p - np.array([-0.09, 0.126, 0.085]), axis=1))
    return _ss(0.07, 0.11, z) * _ss(0.04, 0.068, eye)

def srgb(c):
    c = np.clip(c, 0, 1); return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)

# ---------- solids, through Blender ----------
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)
bpy.context.scene.frame_set(1)
HEAD = bpy.data.objects['Head pose']; HINV = np.array(HEAD.matrix_world.inverted(), np.float64)
def under_head(o):
    while o:
        if o == HEAD: return True
        o = o.parent
    return False
def head_space(ob):      # the mesh's vertices in the head's own space, glTF axes (Blender's head space is z up: glTF's is (x, z, -y))
    rel = HINV @ np.array(ob.matrix_world, np.float64); me = ob.data
    co = np.zeros(len(me.vertices) * 3, np.float64); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
    h = co @ rel[:3, :3].T + rel[:3, 3]; return np.stack([h[:, 0], h[:, 2], -h[:, 1]], 1), rel
def put_head_space(ob, gh, rel):
    h2 = np.stack([gh[:, 0], -gh[:, 2], gh[:, 1]], 1); co2 = (h2 - rel[:3, 3]) @ np.linalg.inv(rel[:3, :3]).T
    ob.data.vertices.foreach_set('co', co2.astype(np.float32).ravel()); ob.data.update()
from mathutils import kdtree
head_obs = [o for o in bpy.context.scene.objects if o.type == 'MESH' and '· fur' not in o.name and under_head(o)]
SKIN = bpy.data.objects['Asymmetric collie head']
g0, rel = head_space(SKIN); mask = smooth_mask(g0); g1 = snout(g0); put_head_space(SKIN, g1, rel)
vg = SKIN.vertex_groups.new(name='muzzle')
for vi in np.nonzero(mask > 0.001)[0]: vg.add([int(vi)], float(mask[vi]), 'REPLACE')
if SN['rep'] > 0:
    md = SKIN.modifiers.new('sm', 'SMOOTH'); md.factor = SN['lam']; md.iterations = int(SN['rep']); md.vertex_group = 'muzzle'
    bpy.context.view_layer.update()
    ev = SKIN.evaluated_get(bpy.context.evaluated_depsgraph_get()); cs = np.zeros(len(SKIN.data.vertices) * 3, np.float32); ev.data.vertices.foreach_get('co', cs)
    SKIN.modifiers.remove(md); SKIN.data.vertices.foreach_set('co', cs); SKIN.data.update()
g2, rel = head_space(SKIN); DISP = g2 - g1
print('snout: smoothing moved the skin by up to %.1f mm (mean %.2f mm over %d masked vertices)' % (np.linalg.norm(DISP, axis=1).max() * 1000, np.linalg.norm(DISP[mask > 0.5], axis=1).mean() * 1000, (mask > 0.5).sum()))
skd = kdtree.KDTree(len(g1))
for vi, p in enumerate(g1): skd.insert(p, vi)
skd.balance()
def skin_shift(p):       # how far the smoothing moved the skin nearest to each point (points are in head space, after the taper)
    return DISP[[skd.find(q)[1] for q in p]]
for ob in head_obs:
    if ob == SKIN: continue
    g, rel = head_space(ob); g = snout(g)
    if any(k in ob.name for k in ('Eye', 'iris', 'Pupil', 'Catchlight', 'lid', 'ear')): pass
    elif any(k in ob.name for k in ('lip', 'crease', 'Philtrum')): g = g + skin_shift(g)
    else:
        near = np.array([skd.find(q)[2] for q in g]); pick = near <= near.min() + 0.004; g = g + skin_shift(g[pick]).mean(0)
    put_head_space(ob, g, rel)
solids = {}   # (group, gloss) -> list of (pos, nrm, col) triangle-corner arrays
for ob in [o for o in bpy.context.scene.objects if o.type == 'MESH' and '· fur' not in o.name]:
    ratio = next((r for key, r in DECIMATE if key in ob.name), None)
    if ratio and len(ob.data.polygons) > 200:
        m = ob.modifiers.new('dec', 'DECIMATE'); m.ratio = ratio
    dg = bpy.context.evaluated_depsgraph_get(); ev = ob.evaluated_get(dg); me = ev.to_mesh()
    me.calc_loop_triangles(); nt = len(me.loop_triangles)
    tl = np.zeros(nt * 3, np.int32); me.loop_triangles.foreach_get('loops', tl)
    tv = np.zeros(nt * 3, np.int32); me.loop_triangles.foreach_get('vertices', tv)
    co = np.zeros(len(me.vertices) * 3, np.float32); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
    cn = np.zeros(len(me.loops) * 3, np.float32); me.corner_normals.foreach_get('vector', cn); cn = cn.reshape(-1, 3)
    M = np.array(ob.matrix_world, np.float64); R = M[:3, :3]; NM = np.linalg.inv(R).T
    P = (co[tv] @ R.T + M[:3, 3]); N = cn[tl] @ NM.T; N /= np.linalg.norm(N, axis=1)[:, None] + 1e-12
    mat = ob.material_slots[0].material if ob.material_slots else None
    ca = me.color_attributes.active_color or (me.color_attributes[0] if len(me.color_attributes) else None)
    if ca is not None and mat is not None and 'strand colour' in mat.name:
        raw = np.zeros(len(ca.data) * 4, np.float32); ca.data.foreach_get('color', raw); raw = raw.reshape(-1, 4)[:, :3]
        C = raw[tl] if ca.domain == 'CORNER' else raw[tv]
    else:
        base = (0.5, 0.5, 0.5)
        if mat and mat.use_nodes:
            b = next((n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
            if b: base = tuple(b.inputs['Base Color'].default_value)[:3]
        C = np.tile(np.array(base, np.float32), (len(tl), 1))
    # Blender z-up -> y-up
    P = np.stack([P[:, 0], P[:, 2], -P[:, 1]], 1); N = np.stack([N[:, 0], N[:, 2], -N[:, 1]], 1)
    grp = GROUPS.get(ob.name, 0); gloss = 1 if any(g in ob.name for g in GLOSS) else 0
    solids.setdefault((grp, gloss), []).append((P, N, srgb(C)))
    print('solid %-30s tris %6d group %d gloss %d decimate %s colour %s' % (ob.name, nt, grp, gloss, ratio, ca.domain if ca else None))
    ev.to_mesh_clear()

# the skin under the fur: each strand is lit by the normal of the skin at its root, so the coat shades as one form
SKP = np.concatenate([p for (grp, gl), v in solids.items() if not gl for p, _, _ in v]); SKN = np.concatenate([n for (grp, gl), v in solids.items() if not gl for _, n, _ in v])
SKP, ui = np.unique(np.round(SKP, 4), axis=0, return_index=True); SKN = SKN[ui]
kd = kdtree.KDTree(len(SKP))
for i, p in enumerate(SKP): kd.insert(p, i)
kd.balance()
# ---------- fur, straight from the glb ----------
g = GLB(SRC); J = g.j
def local(n):
    T = np.eye(4)
    if 'translation' in n: T[:3, 3] = n['translation']
    Rm = np.eye(4)
    if 'rotation' in n:
        x, y, z, w = n['rotation']
        Rm[:3, :3] = [[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)], [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)], [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]]
    S = np.eye(4)
    if 'scale' in n: S[0, 0], S[1, 1], S[2, 2] = n['scale']
    return T @ Rm @ S
world = {}
def walk(i, M):
    W = M @ local(J['nodes'][i]); world[i] = W
    for c in J['nodes'][i].get('children', []): walk(c, W)
for r in J['scenes'][0]['nodes']: walk(r, np.eye(4))
pivots = {0: np.zeros(3)}
head_i = next(i for i, n in enumerate(J['nodes']) if n.get('name') == 'Head pose'); head_kids = set()
def _kids(i):
    for c2 in J['nodes'][i].get('children', []): head_kids.add(c2); _kids(c2)
_kids(head_i)
furs = {}
rng = np.random.default_rng(7)
for i, n in enumerate(J['nodes']):
    nm = n.get('name', '')
    if nm in GROUPS: pivots[GROUPS[nm]] = world[i][:3, 3].copy()
    if 'mesh' not in n or '· fur' not in nm: continue
    pr = J['meshes'][n['mesh']]['primitives'][0]
    P = g.acc(pr['attributes']['POSITION']).astype(np.float64); N = g.acc(pr['attributes']['NORMAL']).astype(np.float64); C = g.acc(pr['attributes']['COLOR_0'])[:, :3].astype(np.float64)
    W = world[i]; R = W[:3, :3]
    if i in head_kids:
        rel = np.linalg.inv(world[head_i]) @ W; P = snout(P @ rel[:3, :3].T + rel[:3, 3]); W = world[head_i]; N = N @ rel[:3, :3].T; R = W[:3, :3]
        if 'ear' not in nm: P = P + np.repeat(skin_shift(P.reshape(-1, 8, 3)[:, 0:2].mean(1)), 8, axis=0)   # each strand goes with the skin at its root
    P = P @ R.T + W[:3, 3]; N = N @ np.linalg.inv(R).T.T
    ns = len(P) // 8; S = P.reshape(ns, 8, 3); NS = N.reshape(ns, 8, 3); CS = C.reshape(ns, 8, 3)
    low = nm.lower(); keep, wide = next((k, w) for key, k, w in FUR if key in low)
    keep = min(1.0, keep * KEEP_MUL); sel = rng.random(ns) < keep
    S, NS, CS = S[sel], NS[sel], CS[sel]
    root = S[:, 0:2].mean(1); mid = S[:, 2:6].mean(1); tip = S[:, 6:8].mean(1)
    w = np.linalg.norm(S[:, 0] - S[:, 1], axis=1) * wide
    own = NS.mean(1); own /= np.linalg.norm(own, axis=1)[:, None] + 1e-12
    skin = SKN[[kd.find(p)[1] for p in root]]
    own *= np.sign((own * skin).sum(1))[:, None]
    nrm = skin * 0.8 + own * 0.3; nrm /= np.linalg.norm(nrm, axis=1)[:, None] + 1e-12
    grp = GROUPS.get(nm.replace(' · fur', ''), 0)
    furs.setdefault(grp, []).append((root, mid, tip, srgb(CS[:, 0:2].mean(1)), srgb(CS[:, 6:8].mean(1)), nrm, w))
    print('fur   %-34s strands %6d of %6d  width %.2f mm' % (nm, sel.sum(), ns, np.median(w) * 1000))

# ---------- bounds: floor at y 0, centred in x and z ----------
allp = np.concatenate([p for v in solids.values() for p, _, _ in v] + [a for v in furs.values() for f in v for a in f[:3]])
mn, mx = allp.min(0), allp.max(0); shift = np.array([(mn[0] + mx[0]) / 2, mn[1], (mn[2] + mx[2]) / 2])
mn -= shift; mx -= shift; size = mx - mn
def q16(p): return np.clip(np.round((p - shift - mn) / size * 65535), 0, 65535).astype('<u2')
def pad(b): return b + b'\0' * (-len(b) % 4)
out = [b'DSSF', struct.pack('<I', 1), mn.astype('<f4').tobytes(), size.astype('<f4').tobytes()]
ng = max(pivots) + 1; out.append(struct.pack('<I', ng))
for gi in range(ng): out.append((pivots[gi] - (shift if gi else 0)).astype('<f4').tobytes())
out.append(struct.pack('<I', len(solids))); tv = tt = 0
for (grp, gloss), parts in sorted(solids.items()):
    P = np.concatenate([p for p, _, _ in parts]); N = np.concatenate([n for _, n, _ in parts]); C = np.concatenate([c for _, _, c in parts])
    row = np.concatenate([q16(P).astype(np.int32), np.round(N * 127).astype(np.int32), np.round(C * 255).astype(np.int32)], 1)
    u, inv = np.unique(row, axis=0, return_inverse=True); inv = inv.ravel()
    assert len(u) < 65536, 'too many vertices for a 16-bit index: %d' % len(u)
    out += [struct.pack('<4I', grp, gloss, len(u), len(inv)), pad(u[:, 0:3].astype('<u2').tobytes()), pad(u[:, 3:6].astype('i1').tobytes()), pad(u[:, 6:9].astype('u1').tobytes()), pad(inv.astype('<u2').tobytes())]
    tv += len(u); tt += len(inv) // 3
    print('mesh  group %d gloss %d: %d vertices, %d triangles' % (grp, gloss, len(u), len(inv) // 3))
out.append(struct.pack('<I', len(furs))); ts = 0
for grp, parts in sorted(furs.items()):
    cat = [np.concatenate([p[k] for p in parts]) for k in range(7)]; ns = len(cat[0]); ts += ns
    pts = np.concatenate([q16(cat[0]), q16(cat[1]), q16(cat[2])], 1)
    cols = np.round(np.concatenate([cat[3], cat[4]], 1) * 255).astype('u1')
    out += [struct.pack('<2I', grp, ns), pad(pts.tobytes()), pad(cols.tobytes()), pad(np.round(cat[5] * 127).astype('i1').tobytes()), pad(np.clip(np.round(cat[6] / 0.00005), 1, 255).astype('u1').tobytes())]
blob = b''.join(out); open(OUT, 'wb').write(blob)
print('WROTE %.2f MB; %d solid vertices, %d solid triangles, %d strands' % (len(blob) / 1e6, tv, tt, ts)); print('SIZE', np.round(size, 3).tolist(), 'MIN', np.round(mn, 3).tolist(), 'PIVOTS', {k: np.round(v - shift, 3).tolist() for k, v in pivots.items() if k})
