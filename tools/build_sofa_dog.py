"""Reference-modelled resting dog. Blender 5.x; no changes to game source.
Run: blender -b --python tools/build_sofa_dog.py
"""
import bpy, math, random, os
from mathutils import Vector
from mathutils.noise import noise_vector
from math import sin, cos, pi
random.seed(417)
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=os.path.join(ROOT,'dog-model-preview')
os.makedirs(OUT,exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)

def material(name,color,rough=.7,metal=0):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Roughness'].default_value=rough; p.inputs['Metallic'].default_value=metal
    return m
black=material('Soft charcoal fur',(.009,.013,.018))
white=material('Warm ivory fur',(.77,.78,.73))
tan=material('Muted copper markings',(.25,.14,.065))
skin=material('Eye rims and lips',(.012,.008,.008),.48)
nosemat=material('Black textured nose',(.012,.014,.016),.33)
nostril=material('Nostril shadow',(.001,.001,.001),.8)
eyeWhite=material('Dark eye globe',(.018,.012,.011),.13)
blue=material('Pale blue right iris',(.18,.36,.47),.23)
brown=material('Amber brown left iris',(.12,.047,.014),.23)
pupil=material('Pupil',(.001,.002,.003),.08)
glint=material('Eye catchlight',(.9,.95,1),.05)
claw=material('Natural grey claws',(.16,.15,.14),.55)
furmat=material('Fur with individual strand colour',(.1,.1,.1),.82)
nodes=furmat.node_tree.nodes; vc=nodes.new('ShaderNodeVertexColor'); vc.layer_name='Coat'
furmat.node_tree.links.new(vc.outputs['Color'],nodes.get('Principled BSDF').inputs['Base Color'])
nodes.get('Principled BSDF').inputs['Sheen Weight'].default_value=.035
nodes.get('Principled BSDF').inputs['Specular IOR Level'].default_value=.18
noise=nosemat.node_tree.nodes.new('ShaderNodeTexNoise'); noise.inputs['Scale'].default_value=290
bump=nosemat.node_tree.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value=.18; bump.inputs['Distance'].default_value=.003
nosemat.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height']); nosemat.node_tree.links.new(bump.outputs['Normal'],nosemat.node_tree.nodes.get('Principled BSDF').inputs['Normal'])
DOG=[]
def uv(name,loc,scale,mat,segments=40,rings=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=rings,location=loc)
    o=bpy.context.object; o.name=name; o.scale=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    for f in o.data.polygons:f.use_smooth=True
    if mat:o.data.materials.append(mat)
    return o
def tube(name,points,radii,mat,sides=12):
    vs=[]; fs=[]
    for i,p in enumerate(points):
        p=Vector(p); t=Vector(points[min(i+1,len(points)-1)])-Vector(points[max(0,i-1)])
        t.normalize(); a=t.cross(Vector((0,0,1)))
        if a.length<.01:a=t.cross(Vector((0,1,0)))
        a.normalize(); b=t.cross(a).normalized()
        for j in range(sides):vs.append(p+radii[i]*(a*cos(2*pi*j/sides)+b*sin(2*pi*j/sides)))
    for i in range(len(points)-1):
        for j in range(sides):fs.append((i*sides+j,i*sides+(j+1)%sides,(i+1)*sides+(j+1)%sides,(i+1)*sides+j))
    fs.extend([tuple(reversed(range(sides))),tuple((len(points)-1)*sides+j for j in range(sides))])
    me=bpy.data.meshes.new(name);me.from_pydata(vs,[],fs);me.update()
    o=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(o)
    if mat:me.materials.append(mat)
    for f in me.polygons:f.use_smooth=True
    return o
def join_sculpt(name,objs,voxel=.008):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:o.select_set(True)
    bpy.context.view_layer.objects.active=objs[0];bpy.ops.object.join();o=objs[0];o.name=name
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    rem=o.modifiers.new('Fused anatomical volumes','REMESH');rem.mode='VOXEL';rem.voxel_size=voxel
    bpy.ops.object.modifier_apply(modifier=rem.name)
    sm=o.modifiers.new('Soft transitions','SMOOTH');sm.factor=1.2;sm.iterations=5;bpy.ops.object.modifier_apply(modifier=sm.name)
    for p in o.data.polygons:p.use_smooth=True
    return o

def smooth(a,b,v):
    t=max(0,min(1,(v-a)/(b-a)));return t*t*(3-2*t)
def mix(a,b,t):return tuple(a[i]*(1-t)+b[i]*t for i in range(3))
def coat_colour(p,zone):
    x,y,z=p
    n=sin(x*113+sin(z*43))*sin(y*91+z*79)*.006
    if zone=='head':
        # Continuous markings follow the surface, avoiding distorted photo eyes/nose.
        ivory=(.66,.67,.62);dark=(.002,.003,.0045)
        edge=.035+.055*(1-smooth(.025,.12,z))+.009*sin(z*26)+n*.35
        patch=smooth(edge-.008,edge+.009,x)
        outer=smooth(.12,.15,abs(x))
        back=smooth(-.01,.065,y)
        c=mix(ivory,dark,max(patch,outer,back))
        # White muzzle wraps naturally below the dark eye patch.
        muzzle=(1-smooth(.055,.095,z))*(1-smooth(-.12,-.075,y))
        c=mix(c,ivory,muzzle)
        brow=math.exp(-(((x-.107)/.045)**2+((z-.202)/.021)**2))*smooth(-.03,-.10,y)
        cheek=math.exp(-(((x-.125)/.025)**2+((z-.045)/.067)**2))*(1-smooth(-.075,-.025,y))
        c=mix(c,(.23,.14,.073),max(brow,cheek)*.75)
        fleck=math.exp(-(((x+.018)/.013)**2+((z-.205)/.018)**2))*.15
        c=mix(c,(.15,.18,.18),fleck)
        detail=1+.045*sin(x*800+sin(z*250))*sin(z*530+y*370)
        c=tuple(v*detail for v in c)
        return c
    if zone=='white':return (.76,.77,.72)
    if zone=='ear':return (.011,.016,.022)
    if zone=='leg':
        return (.76,.77,.73) if x<-.80+n or z<.085 else (.23,.15,.085) if x<-.64 else (.011,.016,.021)
    if zone=='hind':return (.76,.77,.73) if z<.11 else (.26,.18,.105) if z<.15 else (.011,.016,.022)
    if zone=='tail':return (.055,.06,.06) if x<.45 and z<.12 else (.009,.014,.020)
    return (.76,.77,.72) if x<-.37 and y<-.035 and z<.44 else (.0015,.0025,.004)

def paint(o,zone):
    o.data.materials.clear();o.data.materials.append(furmat)
    c=o.data.color_attributes.new(name='Coat',type='FLOAT_COLOR',domain='POINT')
    for i,v in enumerate(o.data.vertices):c.data[i].color=(*coat_colour(v.co+o.location,zone),1)

def fur(o,zone,count,length,width=.00065):
    # Actual tapered mesh strands, portable to GLB rather than render-only hair.
    import bisect
    o.data.calc_loop_triangles();tris=o.data.loop_triangles;cum=[];total=0
    for t in tris:total+=t.area;cum.append(total)
    verts=[];faces=[];colors=[]
    for k in range(count):
        t=tris[min(bisect.bisect_left(cum,random.random()*total),len(tris)-1)]
        a,b,c=[o.data.vertices[i].co for i in t.vertices]
        u=math.sqrt(random.random());v=random.random();p=(1-u)*a+u*(1-v)*b+u*v*c
        n=t.normal.copy();wp=p+o.location
        if zone=='head':
            if wp.y<-.11 and abs(wp.x)<.15 and .08<wp.z<.20 and abs(abs(wp.x)-.097)<.045:continue
            flow=Vector((wp.x*.7,.10,-.75));ll=length*(.3 if wp.y<-.1 else 1)
        elif zone=='ear':flow=Vector((wp.x*.3,0,-1));ll=length
        elif zone=='tail':flow=Vector((-.7,-.25,-.2));ll=length
        elif zone in ('leg','hind','white'):flow=Vector((-.2,-.35,-.55));ll=length
        else:flow=Vector((.9,.15,-.22));ll=length
        loft=.42 if zone in ('body','white','tail','ear','hind') else .30
        flow=flow-n*flow.dot(n);d=(n*loft+flow.normalized()*.9+Vector((random.uniform(-.15,.15),random.uniform(-.15,.15),random.uniform(-.1,.1)))).normalized()
        ll*=random.uniform(.6,1.5);w=width*random.uniform(.6,1.3)
        side=d.cross(n)
        if side.length<.01:side=d.cross(Vector((0,1,0)))
        side.normalize();idx=len(verts)
        pts=[p-n*.0007,p+d*ll*.5+n*ll*.10,p+d*ll+n*ll*.04]
        for j,pt in enumerate(pts):
            wj=w*(1 if j==0 else .65 if j==1 else .015)
            verts.extend([pt-side*wj,pt+side*wj])
        faces.extend([(idx,idx+1,idx+3,idx+2),(idx+2,idx+3,idx+5,idx+4)])
        color=coat_colour(wp,zone);shade=random.uniform(.68,1.2)
        for j in range(6):colors.append(tuple(min(.95,v*shade*(.88+.12*j/5)) for v in color)+(1,))
    me=bpy.data.meshes.new(o.name+' feathering');me.from_pydata(verts,[],faces);me.update()
    ob=bpy.data.objects.new(o.name+' · fur',me);bpy.context.collection.objects.link(ob);ob.location=o.location
    me.materials.append(furmat);attr=me.color_attributes.new(name='Coat',type='FLOAT_COLOR',domain='POINT')
    for i,col in enumerate(colors):attr.data[i].color=col
    DOG.append(ob);return ob

# Body lying on its right hip, with forelegs stretched toward the left.
body=join_sculpt('Body and shoulders',[
 uv('Ribcage',(.04,.10,.25),(.48,.205,.225),None),
 uv('Hindquarters',(.40,.14,.21),(.25,.21,.20),None),
 uv('Shoulder',(-.35,.06,.27),(.23,.18,.23),None),
 uv('Rising neck',(-.48,.015,.40),(.15,.14,.23),None)],.009)
paint(body,'body');DOG.append(body);fur(body,'body',28000,.036)
chest=uv('White chest ruff',(-.51,-.095,.32),(.135,.11,.18),None);paint(chest,'white');DOG.append(chest);fur(chest,'white',8500,.059)

for name,pts,rads in [
 ('Far foreleg',[(-.43,.16,.20),(-.64,.11,.09),(-.82,.005,.052),(-.96,-.055,.045)],[.07,.045,.031,.035]),
 ('Near foreleg',[(-.40,-.075,.18),(-.54,-.23,.095),(-.72,-.32,.052),(-.86,-.37,.045)],[.075,.048,.034,.037])]:
    o=tube(name,pts,rads,None,16);paint(o,'leg');DOG.append(o);fur(o,'leg',4000,.018)
    p=Vector(pts[-1]);paw=uv(name+' paw',p+Vector((-.025,-.015,0)),(.078,.055,.040),None)
    paint(paw,'white');DOG.append(paw);fur(paw,'white',1800,.009)
    for j in range(3):
        toe=uv(name+' toe',p+Vector((-.058,(j-1)*.023-.015,-.003)),(.035,.018,.029),white,24,16);DOG.append(toe)
        nail=uv(name+' nail',p+Vector((-.088,(j-1)*.023-.018,-.008)),(.010,.007,.007),claw,16,12);DOG.append(nail)
for j,offset in enumerate([0,.15]):
    o=tube('Tucked hind leg '+str(j),[(.46,.13+offset*.3,.18),(.62,-.005+offset,.10),(.57,-.19+offset,.045)],[.095,.065,.044],None,18)
    paint(o,'hind');DOG.append(o);fur(o,'hind',3000,.027)
    p=uv('Hind paw '+str(j),(.56,-.22+offset,.045),(.085,.06,.04),None);paint(p,'white');DOG.append(p);fur(p,'white',1200,.01)
tail=tube('Curled feathered tail',[(.53,.22,.23),(.70,.20,.16),(.75,.04,.10),(.67,-.13,.08),(.48,-.28,.075),(.31,-.31,.06)],[.055,.07,.078,.075,.056,.005],None,20)
paint(tail,'tail');DOG.append(tail);fur(tail,'tail',15000,.065)

# Head built in local coordinates, then transformed as one unit into the pose.
before=set(bpy.data.objects)
head=join_sculpt('Asymmetric collie head',[
 uv('Cranium',(0,.010,.112),(.151,.13,.130),None),
 uv('Cheek L',(-.083,-.045,.040),(.080,.09,.095),None),
 uv('Cheek R',(.083,-.045,.040),(.080,.09,.095),None),
 uv('Muzzle bridge',(0,-.137,.055),(.083,.150,.085),None),
 uv('Tapered muzzle',(0,-.207,.005),(.098,.112,.062),None),
 uv('Lower jaw',(0,-.155,-.032),(.093,.118,.046),None)],.004)
# Lower and gently narrow only the crown; preserve the eyes and muzzle below.
for v in head.data.vertices:
    p=v.co+head.location
    crown=smooth(.155,.240,p.z)
    if crown>0:
        v.co.z-=.024*crown
        v.co.x*=1-.035*crown
head.data.update()
eye_surfaces={}
for sign in [-1,1]:
    origin=Vector((sign*.091,-1,.126))-head.location
    hit,point,normal,face=head.ray_cast(origin,Vector((0,1,0)))
    eye_surfaces[sign]=(point+head.location).y if hit else -.108
    for v in head.data.vertices:
        p=v.co+head.location
        r=((p.x-sign*.091)/.038)**2+((p.z-.126)/.032)**2
        if r<1 and p.y<eye_surfaces[sign]+.018:v.co.y+=.035*(1-r)**1.4
head.data.update()
paint(head,'head');fur(head,'head',20000,.014,.00027)

for sign in [-1,1]:
    # Soft triangular ears, falling outward rather than upright wolf ears.
    ear=tube('Feathered ear '+str(sign),[(sign*.115,.025,.185),(sign*.15,.015,.247),(sign*.193,-.025,.219),(sign*.214,-.02,.135),(sign*.19,-.015,.055)],[.035,.035,.043,.033,.005],None,16)
    # Flatten the ear in depth.
    for v in ear.data.vertices:v.co.y=.018+(v.co.y-.018)*.37
    paint(ear,'ear');fur(ear,'ear',5500,.046,.00048)
    x=sign*.091;z=.126;surface=eye_surfaces[sign];ey=surface+.011
    e=uv('Eye globe '+str(sign),(x,ey,z),(.028,.021,.022),eyeWhite)
    iris=blue if sign<0 else brown
    uv('Blue iris' if sign<0 else 'Brown iris',(x-sign*.001,ey-.019,z),(.020,.0025,.0175),iris)
    uv('Pupil '+str(sign),(x-sign*.001,ey-.021,z),(.0098,.0015,.0115),pupil,32,20)
    uv('Catchlight '+str(sign),(x-.004,ey-.023,z+.006),(.002,.001,.002),glint,16,12)
    # Shaped upper and lower eyelids cover the globe edge.
    for top in [True,False]:
        pts=[]
        for k in range(17):
            t=pi*k/16;pts.append((x+.028*cos(t),ey-.014-.004*sin(t),z+(1 if top else -1)*(.017 if top else .0145)*sin(t)))
        radii=[(.0016+.0010*sin(pi*k/16)) if top else (.00125+.00055*sin(pi*k/16)) for k in range(17)]
        lid=tube('Upper lid' if top else 'Lower lid',pts,radii,skin,8)
        if sign>0 and top:fur(lid,'ear',950,.006,.00018)

nose=uv('Broad black nose',(0,-.308,.030),(.057,.029,.040),nosemat)
for s in [-1,1]:
    uv('Nostril '+str(s),(s*.030,-.332,.031),(.013,.006,.0095),nostril,28,16)
def on_muzzle(x,z,offset=.0012):
    hit,p,normal,face=head.ray_cast(Vector((x,-1,z))-head.location,Vector((0,1,0)))
    return (x,(p+head.location).y-offset if hit else -.29,z)
# A small, gently asymmetric dark lip under the nose; white lower jaw below it.
lip_outline=[]
for i in range(64):
    t=2*pi*i/64;x=.026*cos(t);z=-.033+.0085*sin(t)-.09*x
    lip_outline.append(on_muzzle(x,z,.0015))
me=bpy.data.meshes.new('Soft dark upper lip');me.from_pydata([on_muzzle(0,-.033,.0016)]+lip_outline,[],[(0,i+1,(i+1)%64+1) for i in range(64)]);me.update()
ob=bpy.data.objects.new('Soft dark upper lip',me);bpy.context.collection.objects.link(ob);me.materials.append(skin)
for s in [-1,1]:
    pts=[];rads=[]
    for i in range(25):
        t=i/24;x=s*(.018+.065*t)
        z=-.034+(.016 if s<0 else .009)*t*t
        pts.append(on_muzzle(x,z));rads.append(.0013-.0005*t)
    tube('Natural lip crease '+str(s),pts,rads,skin,6)
    p=on_muzzle(s*.079,-.018 if s<0 else -.025,.0015)
    uv('Small dark mouth corner '+str(s),p,(.0035,.0018,.003),skin,20,12)
tube('Philtrum',[on_muzzle(0,z) for z in [.002,-.006,-.014,-.023]],[.0012]*4,skin,6)
for s in [-1,1]:
    for j in range(7):
        xx=s*(.05+random.random()*.025);zz=-.012+random.random()*.035;yy=-.25+random.random()*.025
        tube('Fine ivory whisker',[(xx,yy,zz),(xx+s*.055,yy-.02,zz+.006),(xx+s*.10,yy-.025,zz+.012)],[.00038,.00025,.00003],white,3)

headparts=set(bpy.data.objects)-before
# Shorten projection with a monotonic depth curve, avoiding a shelf across the
# bridge. All facial details follow the same curve and stay on the skin.
for o in headparts:
    if o.type!='MESH':continue
    for v in o.data.vertices:
        p=v.co+o.location
        if p.y<-.085:
            d=-.085-p.y
            shorter=.5*d+.01*(1-math.exp(-d/.02))
            v.co.y+=(-.085-shorter)-p.y
    o.data.update()
headroot=bpy.data.objects.new('Head pose',None);bpy.context.collection.objects.link(headroot)
for o in headparts:o.parent=headroot;DOG.append(o) if o not in DOG else None
headroot.location=(-.54,-.035,.51);headroot.rotation_euler=(math.radians(-7),math.radians(-8),math.radians(-12));DOG.append(headroot)

root=bpy.data.objects.new('Resting dog · reference model v1',None);bpy.context.collection.objects.link(root)
root.scale=(.75,.75,.75)
for o in DOG:
    if not o.parent:o.parent=root
root['reference']='Sam Quill dog photographs, November 2026; artist approximation, not a scan'
root['units']='metres; approximate nose-to-tail length 1.6 m'

# Slow restrained breathing, portable GLB animation.
for o in [body,next(x for x in DOG if x.name=='Body and shoulders · fur'),chest,next(x for x in DOG if x.name=='White chest ruff · fur')]:
    for frame,scale in [(1,1),(55,1.012),(110,1)]:
        o.scale.z=scale;o.keyframe_insert(data_path='scale',frame=frame)
    if o.animation_data and o.animation_data.action:
        o.animation_data.action.name='Resting breath'
bpy.context.scene.frame_set(1)

def select_dog():
    bpy.ops.object.select_all(action='DESELECT');root.select_set(True)
    for o in DOG:o.select_set(True)
select_dog()
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'resting-dog.glb'),export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='SCENE',export_frame_range=True)

# Dog-only preview. The game already has its own sofa.
scene=bpy.context.scene;scene.frame_end=110

floor=material('Studio floor',(.028,.033,.039),.92)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.002));bpy.context.object.data.materials.append(floor)
world=bpy.data.worlds.new('Soft studio');scene.world=world;world.use_nodes=True
world.node_tree.nodes.get('Background').inputs[0].default_value=(.075,.095,.12,1);world.node_tree.nodes.get('Background').inputs[1].default_value=.45
def area(name,loc,power,color,size):
    bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.color=color;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((-.25,0,.35))-o.location).to_track_quat('-Z','Y').to_euler()
area('Large warm window',(-2,-3,4),450,(1,.85,.71),4)
area('Cool soft fill',(2,-1,2.6),220,(.68,.80,1),3)
area('Fur rim',(0,2,3),370,(1,.9,.77),3)
bpy.ops.object.camera_add(location=(-1.05,-2.15,1.00));cam=bpy.context.object;cam.rotation_euler=(Vector((-.10,.0,.24))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=48;scene.camera=cam
scene.render.engine='CYCLES';scene.cycles.samples=32
scene.render.resolution_x=1500;scene.render.resolution_y=1050;scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'
scene.render.image_settings.file_format='PNG';scene.render.filepath=os.path.join(OUT,'resting-dog-preview.png')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'resting-dog.blend'))
bpy.ops.render.render(write_still=True)
print('DOG MODEL COMPLETE',OUT)
