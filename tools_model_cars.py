"""Five 1960s/70s London parked cars for soho-joyride.html, built procedurally in Blender.
Game axes: x across (right +), y up, z along the car, FRONT AT -z. Blender holds them as (x, z_game, y_game)
only for its BVH ray casts; the export writes game axes.
Run: blender -b --python model_cars.py -- <out.js> [preview.png]"""
import bpy, bmesh, math, sys, json
from mathutils import Vector
from mathutils.bvhtree import BVHTree

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else "/tmp/joyride-cars.js"
PREVIEW = argv[1] if len(argv) > 1 else None

MATS = ["paint", "roof", "glass", "chrome", "dark", "lamp", "tail", "flash", "sign", "plate", "hub"]


class Part:
    """A list of triangles in game axes, one material, smooth or flat shaded."""
    def __init__(self, mat, smooth=True):
        self.mat, self.smooth, self.v, self.f = mat, smooth, [], []

    def add_v(self, p):
        self.v.append(tuple(p)); return len(self.v) - 1

    def quad(self, a, b, c, d):
        self.f.append((a, b, c)); self.f.append((a, c, d))

    def tri(self, a, b, c):
        self.f.append((a, b, c))


def superellipse(hw, y0, y1, n=4.0, steps=14, bottom_flat=True):
    """Right half of a rounded-box cross-section, bottom centre round to top centre."""
    cy, hh = (y0 + y1) / 2, (y1 - y0) / 2
    pts = []
    for k in range(steps + 1):
        t = -math.pi / 2 + math.pi * k / steps
        c, s = math.cos(t), math.sin(t)
        x = hw * (abs(c) ** (2 / n))
        y = cy + hh * math.copysign(abs(s) ** (2 / n), s)
        if bottom_flat and k == 0: x = 0
        pts.append((x, y))
    pts[0] = (0, y0); pts[-1] = (0, y1)
    return pts


def loft_z(part, stations, cap0=True, cap1=True):
    """stations: list of (z, [(x, y) right half, bottom centre to top centre]); mirrored to a full ring."""
    rings = []
    for z, half in stations:
        full = [(-x, y) for (x, y) in reversed(half[1:-1])] + list(half)   # left side bottom-up? build a closed loop
        # loop: bottom centre -> right side up -> top centre -> left side down
        loop = list(half) + [(-x, y) for (x, y) in reversed(half[1:-1])]
        rings.append([part.add_v((x, y, z)) for (x, y) in loop])
    n = len(rings[0])
    for a, b in zip(rings, rings[1:]):
        for i in range(n):
            j = (i + 1) % n
            part.quad(a[i], a[j], b[j], b[i])
    for ring, cap, z in ((rings[0], cap0, stations[0][0]), (rings[-1], cap1, stations[-1][0])):
        if not cap: continue
        cx = sum(part.v[i][0] for i in ring) / n; cy = sum(part.v[i][1] for i in ring) / n
        c = part.add_v((cx, cy, z))
        for i in range(n):
            part.tri(c, ring[i], ring[(i + 1) % n])


def loft_y(part, levels, steps=4, cap_top=True):
    """A greenhouse: levels of (y, zf, zr, hw, r) horizontal rounded rectangles (front z, rear z, half-width, corner radius)."""
    rings = []
    for (y, zf, zr, hw, r) in levels:
        r = min(r, hw * 0.95, (zr - zf) / 2 * 0.95)
        loop = []
        corners = [(hw - r, zf + r, -math.pi / 2), (hw - r, zr - r, 0), (-(hw - r), zr - r, math.pi / 2), (-(hw - r), zf + r, math.pi)]
        for cx, cz, a0 in corners:
            for k in range(steps + 1):
                a = a0 + (math.pi / 2) * k / steps
                loop.append((cx + r * math.cos(a), cz + r * math.sin(a)))
        rings.append([part.add_v((x, y, z)) for (x, z) in loop])
    n = len(rings[0])
    for a, b in zip(rings, rings[1:]):
        for i in range(n):
            j = (i + 1) % n
            part.quad(a[i], b[i], b[j], a[j])
    if cap_top:
        top = rings[-1]; y = levels[-1][0]
        c = part.add_v((0, y, (levels[-1][1] + levels[-1][2]) / 2))
        for i in range(n):
            part.tri(c, top[(i + 1) % n], top[i])
    return rings


def box(part, x0, x1, y0, y1, z0, z1):
    P = [part.add_v(p) for p in [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]]
    for a, b, c, d in [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (3, 7, 6, 2), (0, 4, 7, 3), (1, 2, 6, 5)]:
        part.quad(P[a], P[b], P[c], P[d])


def disc(part, centre, normal, r, segs=12, depth=0.0):
    """A flat round lamp facing along normal (game axes), with an optional short barrel behind it."""
    n = Vector(normal).normalized()
    up = Vector((0, 1, 0)) if abs(n.y) < 0.9 else Vector((1, 0, 0))
    u = n.cross(up).normalized(); v = n.cross(u).normalized()
    c = Vector(centre)
    ring = [c + (u * math.cos(2 * math.pi * k / segs) + v * math.sin(2 * math.pi * k / segs)) * r for k in range(segs)]
    ci = part.add_v(c)
    ids = [part.add_v(p) for p in ring]
    for k in range(segs):
        part.tri(ci, ids[k], ids[(k + 1) % segs])
    if depth:
        back = [part.add_v(p - n * depth) for p in ring]
        for k in range(segs):
            j = (k + 1) % segs
            part.quad(ids[k], back[k], back[j], ids[j])


def wheel(parts, x, z, r, w, side):
    """Tyre (dark), hubcap (chrome) on the outer face; side +1 right, -1 left."""
    tyre, hub = parts["dark"], parts["hub"]
    segs = 14
    xo, xi = x + side * w / 2, x - side * w / 2
    ro = [tyre.add_v((xo, r + r * math.sin(2 * math.pi * k / segs), z + r * math.cos(2 * math.pi * k / segs))) for k in range(segs)]
    ri = [tyre.add_v((xi, r + r * math.sin(2 * math.pi * k / segs), z + r * math.cos(2 * math.pi * k / segs))) for k in range(segs)]
    for k in range(segs):
        j = (k + 1) % segs
        tyre.quad(ro[k], ri[k], ri[j], ro[j])
    disc(tyre, (xo, r, z), (side, 0, 0), r * 0.98, segs)
    disc(hub, (xo + side * 0.006, r, z), (side, 0, 0), r * 0.42, segs)
    disc(tyre, (xo + side * 0.009, r, z), (side, 0, 0), r * 0.2, 8)


class Car:
    def __init__(self, name):
        self.name = name
        self.parts = {m: Part(m, smooth=m in ("paint", "roof", "glass", "chrome")) for m in MATS}
        self.flat = {m: Part(m, smooth=False) for m in MATS}
        self._bvh = None

    def bvh(self):
        """Ray-cast tree over the painted body (built once the body is in)."""
        if self._bvh is None:
            verts, polys = [], []
            for p in (self.parts["paint"], self.parts["roof"], self.parts["glass"]):
                base = len(verts)
                verts += [Vector(v) for v in p.v]
                polys += [tuple(base + i for i in f) for f in p.f]
            self._bvh = BVHTree.FromPolygons(verts, polys)
        return self._bvh

    def hit(self, origin, direction):
        loc, nrm, idx, dist = self.bvh().ray_cast(Vector(origin), Vector(direction).normalized(), 10)
        return (loc, nrm) if loc is not None else (None, None)

    def on_face(self, x, y, front=True):
        """Where the body's front (or back) face is at (x, y), and its normal."""
        loc, nrm = self.hit((x, y, -5 if front else 5), (0, 0, 1 if front else -1))
        return loc, nrm

    def on_side(self, y, z, side=1):
        loc, nrm = self.hit((5 * side, y, z), (-side, 0, 0))
        return loc, nrm


def body_stations(z0, z1, prof, width, n=4.0, zsteps=22, ysteps=9, nose_r=0.25, tail_r=0.25, plan_n=2.2, ybot=None):
    """Lower body: prof(z) -> (ybottom, ytop); width(z) -> half width before the plan rounding at the ends."""
    out = []
    for k in range(zsteps + 1):
        t = k / zsteps
        z = z0 + (z1 - z0) * t
        hw = width(z)
        dz0, dz1 = z - z0, z1 - z
        f = 1.0
        if dz0 < nose_r: f = min(f, (1 - ((nose_r - dz0) / nose_r) ** plan_n) ** (1 / plan_n))
        if dz1 < tail_r: f = min(f, (1 - ((tail_r - dz1) / tail_r) ** plan_n) ** (1 / plan_n))
        f = max(f, 0.62)
        yb, yt = prof(z)
        out.append((z, superellipse(hw * f, yb, yt, n=n, steps=ysteps)))
    return out


def lerp_pts(pts, z):
    """Piecewise-linear through [(z, value)]; smoothstep between points."""
    if z <= pts[0][0]: return pts[0][1]
    for (za, a), (zb, b) in zip(pts, pts[1:]):
        if z <= zb:
            t = (z - za) / (zb - za); t = t * t * (3 - 2 * t)
            return a + (b - a) * t
    return pts[-1][1]


def add_greenhouse(car, levels, pillars, roof_mat="roof", bpillars=()):
    """Glass greenhouse lofted in y, a thin roof slab on top, pillars as paint strips on the glass corners."""
    g = car.parts["glass"]
    rings = loft_y(g, levels, cap_top=False)
    y, zf, zr, hw, r = levels[-1]
    roof = car.parts[roof_mat]
    lv = [(y - 0.012, zf - 0.03, zr + 0.03, hw + 0.03, r + 0.03), (y + 0.025, zf - 0.01, zr + 0.01, hw + 0.01, r + 0.01), (y + 0.05, zf + 0.06, zr - 0.06, hw - 0.06, max(0.02, r - 0.06))]
    loft_y(roof, lv, cap_top=True)
    # pillars: thin strips following the glass at chosen corner directions, a little proud of it
    paint = car.parts[roof_mat if roof_mat == "roof" else "paint"]
    for (wfrac_z, which, width) in pillars:
        for side in (1, -1):
            pts = []
            for (yy, zf_, zr_, hw_, r_) in levels:
                if which == "A":   # front corner, between windscreen and side glass
                    pts.append((side * (hw_ - r_ * 0.25), yy, zf_ + r_ * 0.25))
                elif which == "C":
                    pts.append((side * (hw_ - r_ * 0.25), yy, zr_ - r_ * 0.25))
            strip(paint, pts, width, side)
    for zfrac in bpillars:
        for side in (1, -1):
            pts = [(side * (hw_ + 0.004), yy, zf_ + (zr_ - zf_) * zfrac) for (yy, zf_, zr_, hw_, r_) in levels]
            strip_side(car.parts[roof_mat if roof_mat == "roof" else "paint"], pts, 0.07, side)


def strip(part, pts, width, side):
    """A narrow band along pts, pushed outward a touch, oriented roughly across the corner."""
    ids = []
    for (x, y, z) in pts:
        out = Vector((x, 0, z)).normalized() * 0.012
        a = Vector((x, y, z)) + out
        d = Vector((-z, 0, x)).normalized() * (width / 2)
        ids.append((part.add_v(a - d), part.add_v(a + d)))
    for (a0, a1), (b0, b1) in zip(ids, ids[1:]):
        part.quad(a0, a1, b1, b0)
        part.quad(a0, b0, b1, a1)


def strip_side(part, pts, width, side):
    ids = []
    for (x, y, z) in pts:
        ids.append((part.add_v((x, y, z - width / 2)), part.add_v((x, y, z + width / 2))))
    for (a0, a1), (b0, b1) in zip(ids, ids[1:]):
        part.quad(a0, a1, b1, b0)
        part.quad(a0, b0, b1, a1)


def greenhouse_levels(ybelt, yroof, zf_belt, zf_roof, zr_belt, zr_roof, hw_belt, hw_roof, r_belt, r_roof, steps=6, bulge=0.0):
    """Levels between belt and roof; bulge rounds the side glass outward in the middle (tumblehome)."""
    out = []
    for k in range(steps + 1):
        t = k / steps
        e = t * t * (3 - 2 * t)
        y = ybelt + (yroof - ybelt) * t
        zf = zf_belt + (zf_roof - zf_belt) * (t ** 0.9)
        zr = zr_belt + (zr_roof - zr_belt) * (t ** 0.9)
        hw = hw_belt + (hw_roof - hw_belt) * t + bulge * math.sin(math.pi * t)
        r = r_belt + (r_roof - r_belt) * e
        out.append((y, zf, zr, hw, r))
    return out


def bumper(car, z, front, hw, y, depth=0.07, h=0.07, wrap=0.25):
    """A chrome bar tight to the body end: placed by ray cast so it never floats off the body."""
    c = car.parts["chrome"]
    xs = [hw * k / 6 for k in range(-6, 7)]
    top, bot = [], []
    for x in xs:
        loc, nrm = car.on_face(x * 0.96, y, front)
        if loc is None: continue
        zz = loc.z + (-depth if front else depth) * 0.6
        top.append(c.add_v((x, y + h / 2, zz))); bot.append(c.add_v((x, y - h / 2, zz)))
    for i in range(len(top) - 1):
        if front: c.quad(bot[i], top[i], top[i + 1], bot[i + 1])
        else: c.quad(bot[i], bot[i + 1], top[i + 1], top[i])


def face_lamp(car, x, y, r, front, mat, proud=0.012):
    for side in (1, -1):
        loc, nrm = car.on_face(side * x, y, front)
        if loc is None: continue
        n = Vector((0, 0, -1 if front else 1))
        disc(car.flat[mat], loc + n * proud, n, r, 12)
        disc(car.flat["chrome"], loc + n * (proud * 0.5), n, r * 1.18, 12)


def face_rect(car, x0, x1, y0, y1, front, mat, proud=0.01, part=None):
    """A flat panel (grille, plate, tail lamp) laid on the body end, its z taken from the body at its centre."""
    loc, nrm = car.on_face((x0 + x1) / 2, (y0 + y1) / 2, front)
    if loc is None: return
    z = loc.z + (-proud if front else proud)
    p = part or car.flat[mat]
    a, b, c_, d = p.add_v((x0, y0, z)), p.add_v((x1, y0, z)), p.add_v((x1, y1, z)), p.add_v((x0, y1, z))
    if front: p.quad(a, d, c_, b)
    else: p.quad(a, b, c_, d)


def side_strip(car, y, z0, z1, mat="chrome", h=0.018):
    """A trim line along both flanks at height y, laid on the body by ray casts."""
    p = car.flat[mat]
    for side in (1, -1):
        prev = None
        for k in range(21):
            z = z0 + (z1 - z0) * k / 20
            loc, nrm = car.on_side(y, z, side)
            if loc is None: prev = None; continue
            x = loc.x + side * 0.006
            cur = (p.add_v((x, y - h / 2, z)), p.add_v((x, y + h / 2, z)))
            if prev:
                if side > 0: p.quad(prev[0], cur[0], cur[1], prev[1])
                else: p.quad(prev[0], prev[1], cur[1], cur[0])
            prev = cur


def arch(car, z, r, side, ytop_cut):
    """A dark wheel-arch opening on the flank above the wheel (a half disc laid on the body side)."""
    p = car.flat["dark"]
    segs = 10
    pts = []
    for k in range(segs + 1):
        a = math.pi * k / segs
        zz, yy = z + (r + 0.04) * math.cos(a), r + (r + 0.04) * math.sin(a)
        loc, nrm = car.on_side(yy, zz, side)
        x = (loc.x if loc is not None else side * 0.7) + side * 0.004
        pts.append((x, yy, zz))
    loc, nrm = car.on_side(r * 0.8, z, side)
    cx = (loc.x if loc is not None else side * 0.7) + side * 0.004
    c = p.add_v((cx, r * 0.5, z))
    ids = [p.add_v(q) for q in pts]
    for k in range(segs):
        if side > 0: p.tri(c, ids[k + 1], ids[k])
        else: p.tri(c, ids[k], ids[k + 1])


# ------------------------------------------------------------------ the five cars

def make_mini():
    car = Car("mini")
    z0, z1, W = -1.52, 1.52, 0.70
    prof = lambda z: (0.2, lerp_pts([(-1.52, 0.66), (-1.45, 0.76), (-1.0, 0.8), (1.3, 0.8), (1.48, 0.74), (1.52, 0.6)], z))
    width = lambda z: lerp_pts([(-1.52, 0.6), (-1.2, 0.69), (1.2, 0.70), (1.52, 0.66)], z)
    loft_z(car.parts["paint"], body_stations(z0, z1, prof, width, n=3.0, nose_r=0.3, tail_r=0.22))
    lv = greenhouse_levels(0.8, 1.32, -0.62, -0.4, 1.12, 0.98, 0.66, 0.6, 0.1, 0.12, steps=5)
    add_greenhouse(car, lv, [(0, "A", 0.06), (0, "C", 0.16)], roof_mat="roof", bpillars=(0.5,))
    # seams: the welded flank seams standing out (a short vertical lip at the A-pillar foot and over the rear wheel)
    for side in (1, -1):
        for zz in (-0.62, 1.12):
            pts = [(side * (width(zz) + 0.01), y, zz) for y in (0.32, 0.55, 0.8)]
            strip_side(car.flat["paint"], pts, 0.025, side)
    face_lamp(car, 0.46, 0.62, 0.085, True, "lamp")
    face_rect(car, -0.3, 0.3, 0.38, 0.58, True, "dark")              # the grille
    face_rect(car, -0.3, 0.3, 0.47, 0.5, True, "chrome", proud=0.016)  # its moustache bar
    face_rect(car, -0.26, 0.26, 0.24, 0.34, True, "plate", proud=0.02)
    face_rect(car, -0.2, 0.2, 0.36, 0.46, False, "plate")
    for side in (1, -1):
        face_rect(car, side * 0.55 - 0.05, side * 0.55 + 0.05, 0.46, 0.66, False, "tail")
        face_rect(car, side * 0.55 - 0.05, side * 0.55 + 0.05, 0.66, 0.72, False, "flash")
        face_rect(car, side * 0.56 - 0.04, side * 0.56 + 0.04, 0.56, 0.62, True, "flash")
    bumper(car, z0, True, 0.66, 0.3); bumper(car, z1, False, 0.66, 0.3)
    for side in (1, -1):
        for zz in (-1.02, 1.02):
            arch(car, zz, 0.25, side, 0.5); wheel(car.parts, side * 0.6, zz, 0.25, 0.15, side)
    return car


def make_small():   # the Anglia 105E manner: reverse-raked rear window, peaked brows, little fins
    car = Car("small")
    z0, z1 = -1.96, 1.96
    prof = lambda z: (0.25, lerp_pts([(-1.96, 0.66), (-1.85, 0.76), (-0.75, 0.84), (0.75, 0.86), (1.7, 0.86), (1.96, 0.78)], z))
    width = lambda z: lerp_pts([(-1.96, 0.7), (-1.5, 0.76), (1.5, 0.77), (1.96, 0.74)], z)
    loft_z(car.parts["paint"], body_stations(z0, z1, prof, width, n=3.2, nose_r=0.3, tail_r=0.18))
    # reverse rake: the rear window's top is further back than its foot
    lv = greenhouse_levels(0.85, 1.38, -0.72, -0.28, 0.78, 0.98, 0.72, 0.62, 0.1, 0.12, steps=6)
    add_greenhouse(car, lv, [(0, "A", 0.06), (0, "C", 0.1)], roof_mat="paint", bpillars=(0.48,))
    # peaked brows over the lamps: a small paint hood proud of the nose
    for side in (1, -1):
        loc, nrm = car.on_face(side * 0.5, 0.7, True)
        if loc is not None:
            box(car.flat["paint"], side * 0.5 - 0.11, side * 0.5 + 0.11, 0.72, 0.77, loc.z - 0.06, loc.z + 0.05)
    # fins: a small upswept blade on each rear wing
    for side in (1, -1):
        fp = car.parts["paint"]
        x = side * 0.66
        a, b, c = fp.add_v((x, 0.85, 1.2)), fp.add_v((x, 0.85, 1.8)), fp.add_v((x, 0.95, 1.78))
        a2, b2, c2 = fp.add_v((x - side * 0.04, 0.85, 1.2)), fp.add_v((x - side * 0.04, 0.85, 1.8)), fp.add_v((x - side * 0.04, 0.95, 1.78))
        fp.tri(a, b, c); fp.tri(a2, c2, b2); fp.quad(c, b, b2, c2); fp.quad(a, c, c2, a2)
    face_lamp(car, 0.5, 0.64, 0.085, True, "lamp")
    face_rect(car, -0.34, 0.34, 0.5, 0.62, True, "chrome")     # the wide slatted grille
    for yy in (0.53, 0.565, 0.6):
        face_rect(car, -0.32, 0.32, yy - 0.008, yy + 0.008, True, "dark", proud=0.016)
    face_rect(car, -0.24, 0.24, 0.3, 0.4, True, "plate", proud=0.02)
    face_rect(car, -0.2, 0.2, 0.42, 0.52, False, "plate")
    for side in (1, -1):
        face_rect(car, side * 0.62 - 0.05, side * 0.62 + 0.05, 0.62, 0.8, False, "tail")
        face_rect(car, side * 0.62 - 0.05, side * 0.62 + 0.05, 0.56, 0.62, False, "flash")
    side_strip(car, 0.66, -1.85, 1.85)
    bumper(car, z0, True, 0.74, 0.34); bumper(car, z1, False, 0.74, 0.36)
    for side in (1, -1):
        for zz in (-1.15, 1.15):
            arch(car, zz, 0.28, side, 0.6); wheel(car.parts, side * 0.66, zz, 0.28, 0.16, side)
    return car


def make_big():   # Cortina Mk II / Rover / Jaguar Mk 2: long low bonnet, rounded roof, chrome grille
    car = Car("big")
    z0, z1 = -2.14, 2.14
    prof = lambda z: (0.26, lerp_pts([(-2.14, 0.62), (-2.0, 0.76), (-0.7, 0.84), (0.9, 0.86), (1.95, 0.84), (2.14, 0.72)], z))
    width = lambda z: lerp_pts([(-2.14, 0.76), (-1.7, 0.82), (1.7, 0.83), (2.14, 0.8)], z)
    loft_z(car.parts["paint"], body_stations(z0, z1, prof, width, n=3.0, nose_r=0.32, tail_r=0.3))
    lv = greenhouse_levels(0.85, 1.38, -0.66, -0.12, 1.02, 0.66, 0.78, 0.6, 0.12, 0.22, steps=7, bulge=0.02)
    add_greenhouse(car, lv, [(0, "A", 0.05), (0, "C", 0.12)], roof_mat="paint", bpillars=(0.45,))
    face_lamp(car, 0.6, 0.64, 0.08, True, "lamp")
    face_lamp(car, 0.4, 0.64, 0.06, True, "lamp")
    face_rect(car, -0.28, 0.28, 0.44, 0.7, True, "chrome")      # the upright chrome grille
    for k in range(-4, 5):
        face_rect(car, k * 0.06 - 0.01, k * 0.06 + 0.01, 0.46, 0.68, True, "dark", proud=0.016)
    face_rect(car, -0.24, 0.24, 0.3, 0.4, True, "plate", proud=0.02)
    face_rect(car, -0.22, 0.22, 0.42, 0.52, False, "plate")
    for side in (1, -1):
        face_rect(car, side * 0.66 - 0.08, side * 0.66 + 0.08, 0.6, 0.74, False, "tail")
        face_rect(car, side * 0.66 - 0.08, side * 0.66 + 0.08, 0.54, 0.6, False, "flash")
        face_rect(car, side * 0.66 - 0.04, side * 0.66 + 0.04, 0.48, 0.54, True, "flash")
    side_strip(car, 0.7, -2.0, 2.0)
    bumper(car, z0, True, 0.8, 0.36); bumper(car, z1, False, 0.8, 0.38)
    for side in (1, -1):
        for zz in (-1.3, 1.3):
            arch(car, zz, 0.3, side, 0.62); wheel(car.parts, side * 0.7, zz, 0.3, 0.18, side)
    return car


def make_cab():   # the Austin FX4: tall and rounded, wings standing proud of a narrow bonnet, TAXI sign, luggage platform
    car = Car("cab")
    z0, z1 = -2.28, 2.3
    # the cabin body, from the windscreen back
    prof = lambda z: (0.3, lerp_pts([(-1.0, 0.98), (1.9, 1.0), (2.3, 0.86)], z))
    width = lambda z: lerp_pts([(-1.0, 0.8), (2.0, 0.82), (2.3, 0.78)], z)
    loft_z(car.parts["paint"], body_stations(-1.05, z1, prof, width, n=3.0, nose_r=0.05, tail_r=0.36))
    # the narrow bonnet between the wings
    bprof = lambda z: (0.42, lerp_pts([(-2.24, 0.86), (-2.0, 0.94), (-1.05, 0.98)], z))
    bwidth = lambda z: lerp_pts([(-2.24, 0.34), (-1.05, 0.42)], z)
    loft_z(car.parts["paint"], body_stations(-2.24, -1.0, bprof, bwidth, n=3.0, nose_r=0.12, tail_r=0.02, ysteps=10))
    # the front wings: long rounded pods either side, sweeping down into the running board
    for side in (1, -1):
        xc = side * 0.6
        st = []
        for k in range(11):
            t = k / 10
            z = -2.28 + t * 1.5
            top = lerp_pts([(-2.28, 0.66), (-2.1, 0.88), (-1.55, 0.92), (-1.1, 0.8), (-0.8, 0.5)], z)
            hw = lerp_pts([(-2.28, 0.1), (-2.15, 0.16), (-1.0, 0.17), (-0.78, 0.14)], z)
            sec = superellipse(hw, 0.3, top, n=2.6, steps=7)
            st.append((z, [(xc + (x if side > 0 else -x), y) for (x, y) in sec]))
        p = car.parts["paint"]
        rings = []
        for z, half in st:
            loop = list(half) + [(2 * xc - x, y) for (x, y) in reversed(half[1:-1])]
            rings.append([p.add_v((x, y, z)) for (x, y) in loop])
        n = len(rings[0])
        for a, b in zip(rings, rings[1:]):
            for i in range(n):
                j = (i + 1) % n
                if side > 0: p.quad(a[i], a[j], b[j], b[i])
                else: p.quad(a[i], b[i], b[j], a[j])
        # the big round headlamp in the wing's nose
        disc(car.flat["lamp"], (xc, 0.78, -2.2), (0, 0.25, -1), 0.1, 12)
        disc(car.flat["chrome"], (xc, 0.78, -2.195), (0, 0.25, -1), 0.12, 12)
        disc(car.flat["flash"], (xc - side * 0.0, 0.6, -2.26), (0, 0, -1), 0.035, 8)
    # the tall upright chrome grille in the bonnet's nose
    face_rect(car, -0.24, 0.24, 0.48, 0.86, True, "chrome")
    for k in range(-3, 4):
        face_rect(car, k * 0.06 - 0.012, k * 0.06 + 0.012, 0.5, 0.84, True, "dark", proud=0.016)
    face_rect(car, -0.2, 0.2, 0.34, 0.44, True, "plate", proud=0.03)
    # the greenhouse: tall, upright, rounded roof
    lv = greenhouse_levels(1.0, 1.72, -1.0, -0.86, 1.7, 1.45, 0.76, 0.64, 0.12, 0.34, steps=5, bulge=0.0)
    add_greenhouse(car, lv, [(0, "A", 0.07), (0, "C", 0.16)], roof_mat="paint", bpillars=(0.3, 0.55))
    # the open luggage platform beside the driver (left, the nearside): a dark well where the front passenger door would be
    for yy in (0.36,):
        pass
    p = car.flat["dark"]
    a, b, c, d = p.add_v((-0.83, 0.42, -0.95)), p.add_v((-0.83, 0.42, -0.25)), p.add_v((-0.83, 1.32, -0.25)), p.add_v((-0.83, 1.32, -0.95))
    p.quad(a, d, c, b)
    # the TAXI sign: a box on the front of the roof
    s = car.flat["sign"]
    box(s, -0.2, 0.2, 1.75, 1.88, -0.62, -0.5)
    # rear: tail lamps, plate
    face_rect(car, -0.22, 0.22, 0.5, 0.6, False, "plate")
    for side in (1, -1):
        face_rect(car, side * 0.6 - 0.06, side * 0.6 + 0.06, 0.66, 0.8, False, "tail")
        face_rect(car, side * 0.6 - 0.06, side * 0.6 + 0.06, 0.6, 0.66, False, "flash")
    bumper(car, z1, False, 0.78, 0.4)
    c_ = car.parts["chrome"]   # front bumper across the wings and bonnet
    box(c_, -0.78, 0.78, 0.34, 0.42, -2.34, -2.29)
    side_strip(car, 0.72, -0.9, 2.1)
    for side in (1, -1):
        for zz in (-1.5, 1.4):
            if zz > 0: arch(car, zz, 0.32, side, 0.7)
            wheel(car.parts, side * 0.68, zz, 0.32, 0.18, side)
    return car


def make_van():   # the Bedford CA: blunt rounded nose, split windscreen, high roof
    car = Car("van")
    z0, z1 = -2.2, 2.3
    prof = lambda z: (0.3, lerp_pts([(-2.2, 0.9), (-2.0, 1.05), (-1.5, 1.08), (2.3, 1.08)], z))
    width = lambda z: lerp_pts([(-2.2, 0.8), (-1.8, 0.86), (2.3, 0.86)], z)
    loft_z(car.parts["paint"], body_stations(z0, z1, prof, width, n=3.4, nose_r=0.45, tail_r=0.08))
    # the high box above the belt: a paint loft with only the cab windows in glass
    lv = greenhouse_levels(1.08, 1.92, -2.0, -1.78, 2.3, 2.28, 0.86, 0.8, 0.3, 0.28, steps=5)
    loft_y(car.parts["paint"], lv, cap_top=True)
    # the split windscreen and cab side windows, laid on the box
    g = car.flat["glass"]
    for side in (1, -1):
        x = side * 0.865
        q = [g.add_v((x, 1.2, -1.55)), g.add_v((x, 1.2, -0.85)), g.add_v((x, 1.7, -0.9)), g.add_v((x, 1.7, -1.5))]
        if side > 0: g.quad(q[0], q[3], q[2], q[1])
        else: g.quad(q[0], q[1], q[2], q[3])
        # the sliding-door joint
        strip_side(car.flat["dark"], [(side * 0.866, y, -0.8) for y in (0.35, 1.0, 1.85)], 0.015, side)
    for side in (1, -1):
        face_rect(car, side * 0.34 - 0.27, side * 0.34 + 0.27, 1.22, 1.72, True, "glass")   # the split windscreen
    face_lamp(car, 0.58, 0.72, 0.09, True, "lamp")
    face_rect(car, -0.34, 0.34, 0.56, 0.76, True, "chrome")
    for yy in (0.6, 0.66, 0.72):
        face_rect(car, -0.32, 0.32, yy - 0.012, yy + 0.012, True, "dark", proud=0.016)
    face_rect(car, -0.22, 0.22, 0.38, 0.48, True, "plate", proud=0.02)
    face_rect(car, -0.2, 0.2, 0.52, 0.62, False, "plate")
    for side in (1, -1):
        face_rect(car, side * 0.72 - 0.05, side * 0.72 + 0.05, 0.62, 0.8, False, "tail")
        face_rect(car, side * 0.72 - 0.05, side * 0.72 + 0.05, 0.56, 0.62, False, "flash")
        face_rect(car, side * 0.3 - 0.22, side * 0.3 + 0.18, 1.3, 1.7, False, "glass")   # the back-door windows
    face_rect(car, -0.012, 0.012, 0.35, 1.85, False, "dark", proud=0.012)                  # the back doors' join
    bumper(car, z0, True, 0.82, 0.36); bumper(car, z1, False, 0.82, 0.36)
    for side in (1, -1):
        for zz in (-1.25, 1.35):
            arch(car, zz, 0.3, side, 0.7); wheel(car.parts, side * 0.72, zz, 0.3, 0.18, side)
    return car


def export(cars):
    """Per car, per material: flat arrays p (x,y,z) and n (x,y,z) of triangles, rounded to millimetres."""
    out, stats = {}, {}
    for car in cars:
        mats = {}
        tris = 0
        for group in (car.parts, car.flat):
            for m, part in group.items():
                if not part.f: continue
                vn = None
                if part.smooth:
                    vn = [Vector((0, 0, 0)) for _ in part.v]
                    for (a, b, c) in part.f:
                        fa, fb, fc = Vector(part.v[a]), Vector(part.v[b]), Vector(part.v[c])
                        fn = (fb - fa).cross(fc - fa)
                        for i in (a, b, c): vn[i] += fn
                    # weld normals across coincident positions (loft seams)
                    pos = {}
                    for i, v in enumerate(part.v):
                        k = (round(v[0], 4), round(v[1], 4), round(v[2], 4)); pos.setdefault(k, []).append(i)
                    for ids in pos.values():
                        s = sum((vn[i] for i in ids), Vector((0, 0, 0)))
                        for i in ids: vn[i] = s
                    vn = [v.normalized() if v.length > 1e-9 else Vector((0, 1, 0)) for v in vn]
                d = mats.setdefault(m, {"p": [], "n": []})
                for (a, b, c) in part.f:
                    A, B, C = Vector(part.v[a]), Vector(part.v[b]), Vector(part.v[c])
                    fn = (B - A).cross(C - A)
                    if fn.length < 1e-12: continue
                    fn.normalize()
                    for i, P in ((a, A), (b, B), (c, C)):
                        nn = vn[i] if vn else fn
                        if vn and nn.dot(fn) < 0.2: nn = fn   # a hard crease keeps its face normal
                        d["p"] += [round(P.x, 3), round(P.y, 3), round(P.z, 3)]
                        d["n"] += [round(nn.x, 2), round(nn.y, 2), round(nn.z, 2)]
                    tris += 1
        out[car.name] = mats
        allp = [v for d in mats.values() for v in d["p"]]
        xs, ys, zs = allp[0::3], allp[1::3], allp[2::3]
        stats[car.name] = {"tris": tris, "x": [min(xs), max(xs)], "y": [min(ys), max(ys)], "z": [min(zs), max(zs)]}
    return out, stats


def preview(cars, path):
    """A Blender still of the five, for a first look (game axes -> Blender: x, z, y)."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    cols = {"paint": (0.25, 0.05, 0.04, 1), "roof": (0.85, 0.82, 0.75, 1), "glass": (0.02, 0.03, 0.04, 1), "chrome": (0.8, 0.8, 0.78, 1), "dark": (0.02, 0.02, 0.02, 1),
            "lamp": (0.95, 0.9, 0.7, 1), "tail": (0.6, 0.05, 0.03, 1), "flash": (0.8, 0.4, 0.05, 1), "sign": (0.95, 0.7, 0.1, 1), "plate": (0.9, 0.85, 0.6, 1), "hub": (0.4, 0.4, 0.38, 1)}
    mats = {}
    for m, c in cols.items():
        mt = bpy.data.materials.new(m); mt.use_nodes = True
        bsdf = mt.node_tree.nodes["Principled BSDF"]; bsdf.inputs["Base Color"].default_value = c
        bsdf.inputs["Roughness"].default_value = 0.3 if m in ("paint", "roof", "chrome", "glass") else 0.6
        if m == "chrome": bsdf.inputs["Metallic"].default_value = 1.0
        mats[m] = mt
    for k, car in enumerate(cars):
        off = (k - 2) * 2.6
        for group in (car.parts, car.flat):
            for m, part in group.items():
                if not part.f: continue
                me = bpy.data.meshes.new(car.name + m)
                me.from_pydata([(v[0] + off, v[2], v[1]) for v in part.v], [], part.f)
                me.materials.append(mats[m])
                ob = bpy.data.objects.new(car.name + m, me); sc.collection.objects.link(ob)
                if part.smooth:
                    for poly in me.polygons: poly.use_smooth = True
    w = bpy.data.worlds.new("w"); sc.world = w; w.use_nodes = True
    w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.35, 0.37, 0.4, 1)
    fl = bpy.data.meshes.new("floor"); fl.from_pydata([(-20, -20, 0), (20, -20, 0), (20, 20, 0), (-20, 20, 0)], [], [(0, 1, 2, 3)])
    sc.collection.objects.link(bpy.data.objects.new("floor", fl))
    sun = bpy.data.lights.new("sun", "SUN"); sun.energy = 3; so = bpy.data.objects.new("sun", sun); so.rotation_euler = (0.8, 0.2, 2.4); sc.collection.objects.link(so)
    cam = bpy.data.cameras.new("cam"); cam.lens = 40; co = bpy.data.objects.new("cam", cam); sc.collection.objects.link(co); sc.camera = co
    co.location = (9.0, -9.5, 4.2)
    d = Vector((0, 0, 0.8)) - co.location; co.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    sc.render.engine = "BLENDER_EEVEE" if "BLENDER_EEVEE" in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items] else "CYCLES"
    sc.render.resolution_x, sc.render.resolution_y = 1600, 700
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)


cars = [make_mini(), make_small(), make_big(), make_cab(), make_van()]
data, stats = export(cars)
with open(OUT, "w") as f:
    f.write("/* Parked cars for the Soho joyride, modelled in Blender by model_cars.py (2026-11-22): game axes, front at -z; per kind, per part, flat triangle positions and normals. */\n")
    f.write("window.JOYRIDE_CARS = " + json.dumps(data, separators=(",", ":")) + ";\n")
print("STATS", json.dumps(stats))
if PREVIEW: preview(cars, PREVIEW)
