# Interval stairwell, looking DOWN the flight (2026-11-11, Sam note 12). Blender 5.x, Cycles.
# blender -b -P stairs_down.py -- OUT.png [samples]
import bpy, math, sys
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else "/tmp/stairs_down.png"
SAMPLES = int(argv[1]) if len(argv) > 1 else 128

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

N, R, G, WID = 14, 0.17, 0.28, 2.0
L, DROP = N * G, N * R
A = math.atan2(R, G)
HW = WID / 2
BOT = -DROP - 0.4

def mat(name, base, rough=0.6, metal=0.0, emit=None, estr=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*base, 1); b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1); b.inputs["Emission Strength"].default_value = estr
    return m

def textured(name, c1, c2, scale, rough, bump, detail=6.0, metal=0.0, stretch=None):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; n = nt.nodes; l = nt.links
    b = n["Principled BSDF"]
    tc = n.new("ShaderNodeTexCoord")
    mp = n.new("ShaderNodeMapping")
    if stretch: mp.inputs["Scale"].default_value = stretch
    l.new(tc.outputs["Object"], mp.inputs["Vector"])
    nz = n.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = scale; nz.inputs["Detail"].default_value = detail; nz.inputs["Roughness"].default_value = 0.62
    l.new(mp.outputs["Vector"], nz.inputs["Vector"])
    ramp = n.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*c1, 1); ramp.color_ramp.elements[1].color = (*c2, 1)
    ramp.color_ramp.elements[0].position = 0.3; ramp.color_ramp.elements[1].position = 0.72
    l.new(nz.outputs["Fac"], ramp.inputs["Fac"]); l.new(ramp.outputs["Color"], b.inputs["Base Color"])
    bp = n.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = bump
    l.new(nz.outputs["Fac"], bp.inputs["Height"]); l.new(bp.outputs["Normal"], b.inputs["Normal"])
    b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal
    return m

def carpet():
    m = bpy.data.materials.new("carpet"); m.use_nodes = True
    nt = m.node_tree; n = nt.nodes; l = nt.links; b = n["Principled BSDF"]
    tc = n.new("ShaderNodeTexCoord")
    sep = n.new("ShaderNodeSeparateXYZ"); l.new(tc.outputs["Object"], sep.inputs["Vector"])
    ab = n.new("ShaderNodeMath"); ab.operation = "ABSOLUTE"; l.new(sep.outputs["X"], ab.inputs[0])
    mr = n.new("ShaderNodeMapRange"); mr.inputs["From Min"].default_value = 0.0; mr.inputs["From Max"].default_value = 0.42
    mr.inputs["To Min"].default_value = 1.0; mr.inputs["To Max"].default_value = 0.0; l.new(ab.outputs["Value"], mr.inputs["Value"])
    nz = n.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 140; nz.inputs["Detail"].default_value = 8
    l.new(tc.outputs["Object"], nz.inputs["Vector"])
    nz2 = n.new("ShaderNodeTexNoise"); nz2.inputs["Scale"].default_value = 9; nz2.inputs["Detail"].default_value = 4
    l.new(tc.outputs["Object"], nz2.inputs["Vector"])
    wear = n.new("ShaderNodeMath"); wear.operation = "MULTIPLY"; l.new(mr.outputs["Result"], wear.inputs[0]); l.new(nz2.outputs["Fac"], wear.inputs[1])
    mix = n.new("ShaderNodeMix"); mix.data_type = "RGBA"
    mix.inputs["A"].default_value = (0.30, 0.018, 0.022, 1); mix.inputs["B"].default_value = (0.36, 0.15, 0.11, 1)
    l.new(wear.outputs["Value"], mix.inputs["Factor"])
    l.new(mix.outputs["Result"], b.inputs["Base Color"])
    bp = n.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = 0.35
    l.new(nz.outputs["Fac"], bp.inputs["Height"]); l.new(bp.outputs["Normal"], b.inputs["Normal"])
    b.inputs["Roughness"].default_value = 0.92
    b.inputs["Sheen Weight"].default_value = 0.4; b.inputs["Sheen Tint"].default_value = (0.8, 0.35, 0.3, 1)
    return m

WALL = textured("wall", (0.30, 0.25, 0.19), (0.42, 0.35, 0.27), 3.0, 0.85, 0.12, stretch=(1, 1, 1.6))
WOOD = textured("wood", (0.10, 0.028, 0.018), (0.20, 0.06, 0.035), 6.0, 0.38, 0.05, stretch=(1, 14, 1))
STEP = textured("stepwood", (0.035, 0.022, 0.016), (0.075, 0.045, 0.03), 18.0, 0.55, 0.08)
CARPET = carpet()
BRASS = mat("brass", (0.78, 0.55, 0.26), 0.28, 1.0)
SHADE = mat("shade", (0.95, 0.9, 0.8), 0.6, 0.0, (1.0, 0.82, 0.55), 6.0)
CEIL = textured("ceil", (0.10, 0.085, 0.07), (0.17, 0.14, 0.11), 2.0, 0.9, 0.05)
DOOR = textured("door", (0.12, 0.08, 0.05), (0.2, 0.13, 0.08), 5.0, 0.5, 0.05, stretch=(1, 1, 10))
BEYOND = mat("beyond", (0, 0, 0), 1, 0, (1.0, 0.6, 0.28), 5.0)
CANVAS = textured("canvas", (0.22, 0.17, 0.1), (0.42, 0.33, 0.2), 4.0, 0.8, 0.25)

def box(name, c, s, m, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=c, rotation=rot)
    o = bpy.context.object; o.name = name; o.scale = s; o.data.materials.append(m)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return o

def cyl(name, c, r, d, m, rot=(0, 0, 0), v=24):
    bpy.ops.mesh.primitive_cylinder_add(vertices=v, radius=r, depth=d, location=c, rotation=rot)
    o = bpy.context.object; o.name = name; o.data.materials.append(m)
    bpy.ops.object.shade_smooth()
    return o

# top landing and steps (descending in +y)
box("landing_top", (0, -1.2, -0.2), (WID, 2.4, 0.4), STEP)
box("runner_top", (0, -1.2, 0.006), (1.06, 2.4, 0.012), CARPET)
for i in range(N):
    zt = -(i + 1) * R
    box("step%d" % i, (0, (i + 0.5) * G + 0.015, (zt + BOT) / 2), (WID, G + 0.03, zt - BOT), STEP)
    box("nosing%d" % i, (0, (i + 1) * G + 0.012, zt - 0.012), (WID, 0.03, 0.035), STEP)
    cyl("brassnose%d" % i, (0, (i + 1) * G + 0.008, zt + 0.004), 0.014, 1.08, BRASS, rot=(0, math.pi / 2, 0), v=16)
    box("runner%d" % i, (0, (i + 0.5) * G + 0.02, zt + 0.006), (1.06, G + 0.03, 0.012), CARPET)
    cyl("rod%d" % i, (0, i * G + 0.03, zt + 0.02), 0.008, 1.12, BRASS, rot=(0, math.pi / 2, 0), v=12)
    for sx in (-1, 1):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.016, location=(sx * 0.57, i * G + 0.03, zt + 0.02))
        bpy.context.object.data.materials.append(BRASS)
box("landing_bot", (0, L + 0.8, -DROP - 0.2), (WID, 1.6, 0.4), STEP)
box("runner_bot", (0, L + 0.8, -DROP + 0.006), (1.06, 1.6, 0.012), CARPET)

# walls, ceiling
for sx in (-1, 1):
    box("wall%d" % sx, (sx * (HW + 0.05), L / 2, 0.2), (0.1, L + 6, 6.5), WALL)
SL = math.hypot(L, DROP) + 0.6
for sx in (-1, 1):
    # dado panel following the slope, and a stringer
    box("dado%d" % sx, (sx * (HW - 0.012), L / 2 + G / 2, -DROP / 2 + 0.2), (0.03, SL, 0.42), WOOD, rot=(-A, 0, 0))
    box("cap%d" % sx, (sx * (HW - 0.03), L / 2 + G / 2, -DROP / 2 + 0.42), (0.05, SL, 0.035), WOOD, rot=(-A, 0, 0))
    box("string%d" % sx, (sx * (HW - 0.06), L / 2 + G / 2, -DROP / 2 - 0.02), (0.08, SL, 0.26), WOOD, rot=(-A, 0, 0))
    # brass handrail on brackets
    cyl("rail%d" % sx, (sx * (HW - 0.09), L / 2 + G / 2, -DROP / 2 + 1.02), 0.022, SL + 0.4, BRASS, rot=(math.pi / 2 - A, 0, 0))
    for t in range(5):
        yy = 0.2 + t * (L / 4.2); zz = -yy * math.tan(A) + 1.02 - 0.06
        cyl("bracket%d%d" % (sx, t), (sx * (HW - 0.05), yy + G / 2, zz), 0.008, 0.09, BRASS, rot=(0, math.pi / 2, 0), v=10)
box("ceil_top", (0, -1.2, 2.75), (WID + 0.3, 2.6, 0.1), CEIL)
box("ceil_slope", (0, L / 2, -DROP / 2 + 2.75), (WID + 0.3, SL + 0.4, 0.1), CEIL, rot=(-A, 0, 0))
box("ceil_bot", (0, L + 1.6, -DROP + 3.1), (WID + 0.3, 3.2, 0.1), CEIL)
box("wall_back", (0, -2.45, 1.2), (WID + 0.4, 0.1, 3.5), WALL)

# bottom: a back wall with a pair of doors, one ajar onto a warm lit foyer
YB = L + 1.55
box("wall_end_l", (-0.62, YB, -DROP + 1.4), (0.56, 0.12, 2.8), WALL)
box("wall_end_r", (0.62, YB, -DROP + 1.4), (0.56, 0.12, 2.8), WALL)
box("wall_end_top", (0, YB, -DROP + 2.45), (0.7, 0.12, 0.7), WALL)
box("frame_l", (-0.35, YB - 0.07, -DROP + 1.05), (0.06, 0.04, 2.1), WOOD)
box("frame_r", (0.35, YB - 0.07, -DROP + 1.05), (0.06, 0.04, 2.1), WOOD)
box("frame_t", (0, YB - 0.07, -DROP + 2.12), (0.76, 0.04, 0.06), WOOD)
box("door_shut", (-0.17, YB - 0.01, -DROP + 1.04), (0.33, 0.04, 2.06), DOOR)
dr = box("door_ajar", (0.17, YB - 0.01, -DROP + 1.04), (0.33, 0.04, 2.06), DOOR)
# hinge the right leaf on its outer edge and swing it away from you
bpy.context.scene.cursor.location = (0.335, YB - 0.01, -DROP)
bpy.ops.object.origin_set(type="ORIGIN_CURSOR"); dr.rotation_euler = (0, 0, math.radians(-62))
cyl("knob", (-0.04, YB - 0.04, -DROP + 1.0), 0.02, 0.04, BRASS, rot=(math.pi / 2, 0, 0), v=12)
box("beyond", (0, YB + 0.9, -DROP + 1.2), (2.0, 0.05, 3.0), BEYOND)
box("beyond_floor", (0, YB + 0.5, -DROP - 0.01), (1.2, 1.0, 0.02), mat("tiles", (0.25, 0.2, 0.15), 0.4))

# sconces with warm lamps, and a picture on the left wall
def sconce(sx, y, z):
    cyl("arm", (sx * (HW - 0.06), y, z - 0.05), 0.01, 0.12, BRASS, rot=(0, math.pi / 2, 0), v=10)
    bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=0.085, radius2=0.05, depth=0.12, location=(sx * (HW - 0.14), y, z))
    o = bpy.context.object; o.data.materials.append(SHADE); bpy.ops.object.shade_smooth()
    bpy.ops.object.light_add(type="POINT", location=(sx * (HW - 0.16), y, z - 0.03))
    li = bpy.context.object; li.data.energy = 22; li.data.color = (1.0, 0.72, 0.42); li.data.shadow_soft_size = 0.05
sconce(-1, 1.7, 1.95 - 1.7 * math.tan(A) + 0.05)
sconce(1, 2.0, 1.95 - 2.0 * math.tan(A) + 0.05)
sconce(-1, 3.6, 1.95 - 3.6 * math.tan(A) + 0.05)
sconce(1, L + 0.9, -DROP + 1.95)
BILL = textured("bill", (0.16, 0.10, 0.07), (0.6, 0.5, 0.33), 9.0, 0.85, 0.08, stretch=(1, 0.6, 9))
for sx, yy in ((-1, 2.75),):
    zz = 1.55 - yy * math.tan(A) + 0.05
    box("bill_frame", (sx * (HW - 0.015), yy, zz), (0.03, 0.56, 0.7), mat("gilt2", (0.5, 0.34, 0.13), 0.35, 0.9))
    box("bill", (sx * (HW - 0.033), yy, zz), (0.01, 0.48, 0.62), CANVAS)

# a faint fill so the shadows hold some colour
bpy.ops.object.light_add(type="AREA", location=(0, L / 2, -DROP / 2 + 2.5))
fl = bpy.context.object; fl.data.energy = 8; fl.data.size = 1.2; fl.data.color = (1.0, 0.8, 0.6)

# camera at the top, looking down the flight
bpy.ops.object.camera_add(location=(0.08, 0.2, 1.42), rotation=(math.radians(90 - 41), 0, math.radians(-0.8)))
cam = bpy.context.object; cam.data.lens = 24; cam.data.sensor_width = 36
sc.camera = cam

w = bpy.data.worlds.new("w"); w.use_nodes = True; w.node_tree.nodes["Background"].inputs["Color"].default_value = (0, 0, 0, 1); sc.world = w
sc.render.engine = "CYCLES"
try:
    prefs = bpy.context.preferences.addons["cycles"].preferences; prefs.compute_device_type = "METAL"; prefs.get_devices()
    for d in prefs.devices: d.use = True
    sc.cycles.device = "GPU"
except Exception as e:
    print("GPU setup failed", e)
sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y = 1240, 500
sc.view_settings.view_transform = "AgX"
try: sc.view_settings.look = "AgX - Medium High Contrast"
except Exception: pass
sc.view_settings.exposure = 0.6
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print("WROTE", OUT)
