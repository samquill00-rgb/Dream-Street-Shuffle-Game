from common import *
s,a,b,t=scope('// ====== GINGER LIGHT SCENE','// ====== SOHO SQUARE');(out/'ginger-before.js').write_text(t)
t=replace(t,'var scene = new THREE.Scene();','var scene = new THREE.Scene();\nvar exterior=window.dssExteriorDetail(scene);')
t=replace(t,'scene.add(manhole1);','scene.add(manhole1);\nexterior.tread(scene,-1.5,0.038,1.5,0.65,0.65,true);');mark(1)
t=replace(t,'scene.add(utilCover);','scene.add(utilCover);\nexterior.tread(scene,8,0.038,0.5,0.74,0.44,false);');mark(2)
t=replace(t,'scene.add(drain2);', '''scene.add(drain2);
var drainFrame=exterior.group(scene,-3.8,0.054,-1);drainFrame.rotation.x=-Math.PI/2;exterior.screws(drainFrame,[[-0.225,-0.125,0],[0.225,-0.125,0],[-0.225,0.125,0],[0.225,0.125,0]],0.009);''');mark(3)
t=replace(t,'scene.add(drain3);', '''scene.add(drain3);
exterior.tread(scene,6,0.053,3.8,0.46,0.26,false);
for(var slotIndex=0;slotIndex<5;slotIndex++)exterior.mesh(scene,new THREE.BoxGeometry(0.34,0.001,0.022),exterior.material(0x131713,false),6,0.055,3.69+slotIndex*0.052);''');mark(4)
t=replace(t,'// --- ROAD TEXTURE: centre line', '''// Cast kerb-stone joints, with occasional small spalls in the exposed edge.
[-1,1].forEach(function(side){for(var joint=0;joint<18;joint++){var z=-14+joint*1.25;exterior.mesh(scene,new THREE.BoxGeometry(0.152,0.002,0.007),exterior.material(0x4b4c43,false),side*4,0.181,z);if(joint%4===0){var chip=exterior.mesh(scene,new THREE.SphereGeometry(1,8,5),exterior.material(0x57584e,false),side*3.925,0.12,z+0.12);chip.scale.set(0.003,0.018,0.04);}}});
// --- ROAD TEXTURE: centre line''');mark(5)
t=replace(t,'// Dashed centre line running north', '''exterior.finish(centreLine,false);
// Dashed centre line running north''');mark(6)
old='var patch = new THREE.Mesh(new THREE.BoxGeometry(tarPatches[tp].sx, 0.01, tarPatches[tp].sz), tarMat);'
new='''var patchShape=new THREE.Shape();for(var corner=0;corner<16;corner++){var angle=corner/16*Math.PI*2,r=0.46+0.04*Math.sin(corner*2.7+tp);var x=Math.cos(angle)*tarPatches[tp].sx*r,z=Math.sin(angle)*tarPatches[tp].sz*r;if(!corner)patchShape.moveTo(x,z);else patchShape.lineTo(x,z);}patchShape.closePath();
var patch=new THREE.Mesh(new THREE.ShapeGeometry(patchShape),tarMat);patch.rotation.x=-Math.PI/2;'''
t=replace(t,old,new);mark(7)
t=replace(t,'phoneBox.add(doorHandle);','phoneBox.add(doorHandle);\nexterior.plate(phoneBox,0.24,0.9,0.488,0.045,0.17,0,0x817453);');mark(8)
t=replace(t,'var telSignMat =','exterior.age(telSignTex,false);\nvar telSignMat =');mark(9)
t=replace(t,'heroLamp.add(baseSkirt);', '''heroLamp.add(baseSkirt);
exterior.ring(heroLamp,0,0.04,0,0.32,0.009,Math.PI/2,0x55564b);
var anchorG=exterior.group(heroLamp,0,0.035,0);anchorG.rotation.x=-Math.PI/2;exterior.screws(anchorG,[[-0.21,-0.21,0],[0.21,-0.21,0],[-0.21,0.21,0],[0.21,0.21,0]],0.015);''');mark(10)
save(s,a,b,t);print('Ginger corner: 10 completed')
