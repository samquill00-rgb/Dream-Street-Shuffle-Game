# The Donkey coin, struck in gold (2026-11-11, Sam note 1). Blender 5.x, Cycles, orthographic, transparent ground.
# blender -b -P coin_render.py -- HEIGHT.png OUT.png [samples] [size]
import bpy, bmesh, math, sys
argv = sys.argv[sys.argv.index("--") + 1:]
HEIGHT, OUT = argv[0], argv[1]
SAMPLES = int(argv[2]) if len(argv) > 2 else 96
SIZE = int(argv[3]) if len(argv) > 3 else 640

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
img = bpy.data.images.load(HEIGHT); img.colorspace_settings.name = "Non-Color"

bpy.ops.mesh.primitive_grid_add(x_subdivisions=1000, y_subdivisions=1000, size=2.0)
coin = bpy.context.object
tex = bpy.data.textures.new("h", "IMAGE"); tex.image = img; tex.extension = "EXTEND"
dm = coin.modifiers.new("disp", "DISPLACE"); dm.texture = tex; dm.texture_coords = "UV"; dm.strength = 0.075; dm.mid_level = 0.0
bpy.ops.object.modifier_apply(modifier="disp")
bm = bmesh.new(); bm.from_mesh(coin.data)
gone = [v for v in bm.verts if math.hypot(v.co.x, v.co.y) > 0.995]
bmesh.ops.delete(bm, geom=gone, context="VERTS"); bm.to_mesh(coin.data); bm.free()
bpy.ops.object.shade_smooth()

m = bpy.data.materials.new("gold"); m.use_nodes = True
nt = m.node_tree; n = nt.nodes; l = nt.links; b = n["Principled BSDF"]
uv = n.new("ShaderNodeTexCoord")
ht = n.new("ShaderNodeTexImage"); ht.image = img; ht.extension = "EXTEND"; l.new(uv.outputs["UV"], ht.inputs["Vector"])
# patina in the recesses: low = darker, rougher
ramp = n.new("ShaderNodeValToRGB"); l.new(ht.outputs["Color"], ramp.inputs["Fac"])
ramp.color_ramp.elements[0].position = 0.18; ramp.color_ramp.elements[0].color = (0.22, 0.13, 0.04, 1)
ramp.color_ramp.elements[1].position = 0.6; ramp.color_ramp.elements[1].color = (0.80, 0.55, 0.22, 1)
nz = n.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 38; nz.inputs["Detail"].default_value = 10
l.new(uv.outputs["Object"], nz.inputs["Vector"])
mix = n.new("ShaderNodeMix"); mix.data_type = "RGBA"; mix.blend_type = "MULTIPLY"; mix.inputs["Factor"].default_value = 0.35
l.new(ramp.outputs["Color"], mix.inputs["A"]); l.new(nz.outputs["Color"], mix.inputs["B"])
TONE = argv[4] if len(argv) > 4 else ""
if TONE:
    ti = bpy.data.images.load(TONE); ti.colorspace_settings.name = "Non-Color"
    tn = n.new("ShaderNodeTexImage"); tn.image = ti; tn.extension = "EXTEND"; l.new(uv.outputs["UV"], tn.inputs["Vector"])
    tr = n.new("ShaderNodeMapRange"); tr.inputs["From Min"].default_value = 0.0; tr.inputs["From Max"].default_value = 1.0; tr.inputs["To Min"].default_value = 0.28; tr.inputs["To Max"].default_value = 1.0
    l.new(tn.outputs["Color"], tr.inputs["Value"])
    m2 = n.new("ShaderNodeMix"); m2.data_type = "RGBA"; m2.blend_type = "MULTIPLY"; m2.inputs["Factor"].default_value = 1.0
    l.new(mix.outputs["Result"], m2.inputs["A"]); l.new(tr.outputs["Result"], m2.inputs["B"])
    l.new(m2.outputs["Result"], b.inputs["Base Color"])
else:
    l.new(mix.outputs["Result"], b.inputs["Base Color"])
rr = n.new("ShaderNodeMapRange"); rr.inputs["From Min"].default_value = 0.15; rr.inputs["From Max"].default_value = 0.7
rr.inputs["To Min"].default_value = 0.6; rr.inputs["To Max"].default_value = 0.32
l.new(ht.outputs["Color"], rr.inputs["Value"])
rn = n.new("ShaderNodeMath"); rn.operation = "MULTIPLY_ADD"; rn.inputs[1].default_value = 0.18
l.new(nz.outputs["Fac"], rn.inputs[0]); l.new(rr.outputs["Result"], rn.inputs[2])
l.new(rn.outputs["Value"], b.inputs["Roughness"])
b.inputs["Metallic"].default_value = 1.0
sb = n.new("ShaderNodeTexNoise"); sb.inputs["Scale"].default_value = 260; sb.inputs["Detail"].default_value = 4
l.new(uv.outputs["Object"], sb.inputs["Vector"])
bp = n.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = 0.06; l.new(sb.outputs["Fac"], bp.inputs["Height"]); l.new(bp.outputs["Normal"], b.inputs["Normal"])
coin.data.materials.append(m)

def area(loc, rot, energy, size, col):
    bpy.ops.object.light_add(type="AREA", location=loc, rotation=rot)
    li = bpy.context.object; li.data.energy = energy; li.data.size = size; li.data.color = col
area((-2.8, 2.4, 1.5), (math.radians(-52), math.radians(-50), 0), 330, 1.2, (1.0, 0.86, 0.66))   # key, upper left
area((2.6, -1.6, 1.2), (math.radians(55), math.radians(60), 0), 60, 2.0, (0.75, 0.8, 1.0))       # cool rim, lower right
area((0, 0, 4), (0, 0, 0), 14, 4, (1.0, 0.9, 0.75))                                              # soft top fill

w = bpy.data.worlds.new("w"); w.use_nodes = True
bg = w.node_tree.nodes["Background"]; bg.inputs["Color"].default_value = (0.05, 0.04, 0.03, 1); bg.inputs["Strength"].default_value = 1.0
sc.world = w

bpy.ops.object.camera_add(location=(0, 0, 5), rotation=(0, 0, 0))
cam = bpy.context.object; cam.data.type = "ORTHO"; cam.data.ortho_scale = 2.02; sc.camera = cam

sc.render.engine = "CYCLES"
try:
    prefs = bpy.context.preferences.addons["cycles"].preferences; prefs.compute_device_type = "METAL"; prefs.get_devices()
    for d in prefs.devices: d.use = True
    sc.cycles.device = "GPU"
except Exception as e:
    print("GPU setup failed", e)
sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
sc.render.film_transparent = True
sc.render.resolution_x = sc.render.resolution_y = SIZE
sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_mode = "RGBA"
sc.view_settings.view_transform = "AgX"
try: sc.view_settings.look = "AgX - Medium High Contrast"
except Exception: pass
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print("WROTE", OUT)
