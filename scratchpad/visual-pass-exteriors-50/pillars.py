from common import *
s,a,b,t=scope('// ====== PILLARS OF HERCULES SCENE','// ====== LACKLAND\'S OFFICE SCENE');(out/'pillars-before.js').write_text(t)
t=replace(t,'var scene = new THREE.Scene();','var scene = new THREE.Scene();\nvar exterior=window.dssExteriorDetail(scene);')
t=replace(t,'var leftFascia =','exterior.age(leftFasciaTex,false);\nvar leftFascia =');mark(31)
t=replace(t,'var rightFascia =','exterior.age(rightFasciaTex,false);\nvar rightFascia =');mark(32)
t=replace(t,'goldMat, -5.72, 1.2, 0.6);','goldMat, -5.72, 1.2, 0.6);\nexterior.plate(leftBuilding,-5.72,1.2,0.622,0.065,0.18,0,0x9a8654);');mark(33)
t=replace(t,'goldMat, 7.28, 1.2, 0.6);','goldMat, 7.28, 1.2, 0.6);\nexterior.plate(rightBuilding,7.28,1.2,0.622,0.065,0.18,0,0x7c7151);');mark(34)
t=replace(t,'leftBuilding.add(leftWinGlass2);', '''leftBuilding.add(leftWinGlass2);
exterior.glassEdge(leftBuilding,-7,1.6,0.634,1.8,2.0);exterior.glassEdge(leftBuilding,-5,1.6,0.634,1.8,2.0);''');mark(35)
# Add grime to actual ground-floor panes, not the upper dressed windows.
anchor='// Shop door between bays'
t=replace(t,anchor,'exterior.glassEdge(rightBuilding,5.8,1.6,0.634,1.8,2.0);exterior.glassEdge(rightBuilding,8.2,1.6,0.634,1.8,2.0);\n'+anchor);mark(36)
t=replace(t,'// Right window bays (two bays to the right of the door)','exterior.step(pub,doorX,0.081,0.80,1.06,0.27);\n// Right window bays (two bays to the right of the door)');mark(37)
t=replace(t,'// Door step (stone)','exterior.plate(pub,doorX+0.28,1.2,0.754,0.075,0.21,0,0x9a8150);\n// Door step (stone)');mark(38)
t=replace(t,'// Warm interior glow spilling from pub windows', '''[1.0,3.5,6,8,10.5].forEach(function(y){exterior.ring(pub,4,y,0.3,0.047,0.005,Math.PI/2,0x53564a);});
// Warm interior glow spilling from pub windows''');mark(39)
t=replace(t,'cbGroup.add(cbHinge);', '''cbGroup.add(cbHinge);
exterior.finish(cbPanelMat,false);exterior.plate(cbGroup,0,0.622,0.032,0.14,0.025,0,0x80714b);
var hingePin=exterior.mesh(cbGroup,new THREE.CylinderGeometry(0.008,0.008,0.16,12),exterior.material(0x5e5d4d,true),0,0.63,0.018);hingePin.rotation.z=Math.PI/2;''');mark(40)
save(s,a,b,t);print('Pillars and shops: 10 completed')
