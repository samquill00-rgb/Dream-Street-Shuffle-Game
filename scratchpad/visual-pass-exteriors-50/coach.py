from common import *
s,a,b,t=scope('// ====== COACH AND HORSES SCENE','// ====== PILLARS OF HERCULES SCENE');(out/'coach-before.js').write_text(t)
t=replace(t,'var scene = new THREE.Scene();','var scene = new THREE.Scene();\nvar exterior=window.dssExteriorDetail(scene);')
t=replace(t,'// Door light\n','exterior.plate(pub,0.238,1.3,-2.15,0.085,0.22,Math.PI/2,0x998049);\n// Door light\n');mark(21)
t=replace(t,'// Door light\n', '''exterior.plate(pub,0.205,0.65,-2.5,0.68,0.68,Math.PI/2,0x35291d);
// Door light
''');mark(22)
t=replace(t,'// Lantern body: pane core', '''// Fine corner uprights retain the glazed lantern's small dark frame.
[-1,1].forEach(function(sx){[-1,1].forEach(function(sz){exterior.mesh(pub,new THREE.CylinderGeometry(0.004,0.004,0.21,8),exterior.material(0x393c32,true),0.46+sx*0.075,2.92,z+sz*0.075);});});
exterior.glassEdge(pub,0.46,2.92,z+0.067,0.126,0.19,0);
// Lantern body: pane core''');mark(23)
t=replace(t,'pub.add(romFascia);', '''pub.add(romFascia);
var gfFix=exterior.group(pub,0.164,3.7,-2.5,Math.PI/2);exterior.screws(gfFix,[[-2.18,-0.2,0],[2.18,-0.2,0],[-2.18,0.2,0],[2.18,0.2,0]],0.012);
var rfFix=exterior.group(pub,-4.5,3.7,0.164);exterior.screws(rfFix,[[-4.13,-0.2,0],[4.13,-0.2,0],[-4.13,0.2,0],[4.13,0.2,0]],0.012);''');mark(24)
t=replace(t,'pub.add(base);','pub.add(base);\nbase.material=exterior.material(0x95804e,true);exterior.ring(pub,x,y-1.56,z,0.124,0.004,Math.PI/2,0x5e5d45);');mark(25)
t=replace(t,'var bannerMat =','exterior.age(bannerTex,true);\nvar bannerMat =');mark(26)
t=replace(t,'placeMesh(new THREE.BoxGeometry(0.05, 0.55, 0.05), bracketMat, 1.2, 4.05, -4.2);', '''exterior.chain(pub,0.94,4.3,-4.2,0.08);exterior.chain(pub,1.46,4.3,-4.2,0.08);''');mark(27)
t=replace(t,'var signMat = new THREE.MeshStandardMaterial({ map: signTex','exterior.age(signTex,false);\nvar signMat = new THREE.MeshStandardMaterial({ map: signTex')
t=replace(t,'pub.add(hangSign);', '''pub.add(hangSign);
[-1,1].forEach(function(side){exterior.mesh(pub,new THREE.BoxGeometry(0.01,0.89,0.012),exterior.material(0x8b7141,true),1.2+side*0.445,3.8,-4.19);});''');mark(28)
t=replace(t,'scene.add(pub);', '''[[-2,-1],[-6,-2]].forEach(function(p){var pot=exterior.mesh(pub,new THREE.CylinderGeometry(0.11,0.13,0.28,20,1,true),exterior.material(0x80664d,false),p[0],13.77,p[1]);exterior.ring(pub,p[0],13.91,p[1],0.11,0.012,Math.PI/2,0x5e5645);var mouth=exterior.mesh(pub,new THREE.CircleGeometry(0.096,24),exterior.material(0x252a23,false),p[0],13.87,p[1]);mouth.rotation.x=-Math.PI/2;});
scene.add(pub);''');mark(29)
t=replace(t,'// Door light\n', '''exterior.mesh(pub,new THREE.BoxGeometry(0.28,0.06,1.0),exterior.material(0x817e70,false),0.27,0.13,-2.5);exterior.step(pub,0.27,0.161,-2.5,0.26,0.98);
// Door light
''');mark(30)
save(s,a,b,t);print('Coach frontage: 10 completed')
