from common import *
s,a,b,t=scope('// ====== FRENCH HOUSE SCENE','// ====== THE ROOM\'S WORDS');(out/'french-before.js').write_text(t)
t=replace(t,'var scene = new THREE.Scene();','var scene = new THREE.Scene();\nvar exterior=window.dssExteriorDetail(scene);')
t=replace(t,'// Letterbox\n','exterior.plate(pub,-0.82,1.1,0.373,0.075,0.20,0,0x9b8251);\n// Letterbox\n');mark(11)
t=replace(t,'// Door step\n','''exterior.plate(pub,-1.1,0.7,0.398,0.20,0.055,0,0x8b784b);
exterior.mesh(pub,new THREE.BoxGeometry(0.148,0.022,0.003),exterior.material(0x514d3c,true),-1.1,0.7,0.403);
// Door step
''');mark(12)
t=replace(t,'// ---- FLOWER BASKETS (enriched) ----','exterior.step(pub,-1.1,0.071,0.40,0.91,0.17);\n// ---- FLOWER BASKETS (enriched) ----');mark(13)
t=replace(t,'placeMesh(pub, new THREE.BoxGeometry(0.03, 0.55, 0.03), ironMat, 4.5, 4.25, 1.5);', '''exterior.mesh(pub,new THREE.BoxGeometry(0.035,0.035,0.7),exterior.material(0x3b3c34,true),4.5,4.5,1.15);
exterior.chain(pub,4.27,4.5,1.5,0.1);exterior.chain(pub,4.73,4.5,1.5,0.1);''');mark(14)
t=replace(t,'var signMat = new THREE.MeshStandardMaterial({ map: signTex','exterior.age(signTex,false);\nvar signMat = new THREE.MeshStandardMaterial({ map: signTex');mark(15)
t=replace(t,'var awningPositions =','exterior.finish(awningMat,true);\nvar awningPositions =')
t=replace(t,'// Awning front flap (valance)', '''[-0.96,0.96].forEach(function(offset){exterior.mesh(pub,new THREE.BoxGeometry(0.003,0.002,0.83),exterior.material(0x7883a3,false),awningPositions[ai]+offset,3.255,0.69);});
// Awning front flap (valance)''');mark(16)
t=replace(t,'// Hopper head\n','''for(var collarY=2;collarY<13;collarY+=2.5){exterior.ring(pub,-2.9,collarY,0.2,0.047,0.004,Math.PI/2,0x53564a);exterior.plate(pub,-2.9,collarY,0.17,0.13,0.07,0,0x41443a);}
// Hopper head
''');mark(17)
t=replace(t,'placeMesh(pub, new THREE.BoxGeometry(0.18, 0.2, 0.12), pipeMat, -2.9, 13.0, 0.18);', '''var hopper=exterior.group(pub,-2.9,13,0.18);var hm=exterior.material(0x45483d,true);
[-1,1].forEach(function(side){exterior.mesh(hopper,new THREE.BoxGeometry(0.012,0.2,0.12),hm,side*0.084,0,0);exterior.mesh(hopper,new THREE.BoxGeometry(0.18,0.2,0.01),hm,0,0,side*0.055);});
exterior.mesh(hopper,new THREE.BoxGeometry(0.16,0.005,0.1),exterior.material(0x1d241e,false),0,-0.075,0);''');mark(18)
t=replace(t,'// ---- CHIMNEYS ----','''[-2.9,0.5,3.8].forEach(function(x){exterior.mesh(pub,new THREE.BoxGeometry(0.035,0.075,0.095),exterior.material(0x66675a,true),x,13.12,0.18);});
// ---- CHIMNEYS ----''');mark(19)
t=replace(t,'cbFace.rotation.y = 0.12; pub.add(cbFace);','''cbFace.rotation.y = 0.12; pub.add(cbFace);
exterior.finish(woodMat,false);exterior.plate(pub,-1.8,0.71,1.23,0.11,0.035,0,0x71654c);exterior.age(cbTex,false);''');mark(20)
save(s,a,b,t);print('French frontage: 10 completed')
