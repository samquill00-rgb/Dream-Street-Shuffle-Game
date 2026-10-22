from common import *
s,a,b,t=scope("// ====== RONNIE SCOTT'S SCENE", "// ====== COPPER'S LAIR SCENE");(out/'ronnie-before.js').write_text(t)
t=replace(t,'var scene = new THREE.Scene();','var scene = new THREE.Scene();\nvar exterior=window.dssExteriorDetail(scene);')
t=replace(t,'// Kick plate\n','exterior.plate(building,-0.2,1.1,0.422,0.09,0.22,0,0x9d8754);\n// Kick plate\n');mark(41)
t=replace(t,'// Porthole window, lit from inside','''exterior.finish(brassMat,false);
var kickFix=exterior.group(building,-0.2,0.22,0.363);exterior.screws(kickFix,[[-0.30,-0.08,0],[0.30,-0.08,0],[-0.30,0.08,0],[0.30,0.08,0]],0.006);
// Porthole window, lit from inside''');mark(42)
t=replace(t,'// Second lit frame on the other side of the door','''var posterFix=exterior.group(building,-1.2,1.5,0.392);exterior.screws(posterFix,[[-0.224,-0.47,0],[0.224,-0.47,0],[-0.224,0.47,0],[0.224,0.47,0]],0.008);exterior.finish(posterFrameMat,false);
// Second lit frame on the other side of the door''');mark(43)
t=replace(t,'var numMat =','exterior.age(numTex,false);\nvar numMat =')
t=replace(t,'building.add(numPlane);', '''building.add(numPlane);
var numberFix=exterior.group(building,1.5,1.2,0.355);exterior.screws(numberFix,[[-0.26,-0.55,0],[0.26,-0.55,0],[-0.26,0.55,0],[0.26,0.55,0]],0.008);''');mark(44)
t=replace(t,'var awningMat = new THREE.MeshStandardMaterial','exterior.age(awningTex,true);\nvar awningMat = new THREE.MeshStandardMaterial');mark(45)
t=replace(t,'// ---- DRAINPIPES ----','exterior.step(building,-0.2,0.121,0.55,1.16,0.31);\n// ---- DRAINPIPES ----');mark(46)
t=replace(t,'// ---- GUTTERING ----', '''[-2.8,2.6].forEach(function(x){[1.5,4,7,10].forEach(function(y){exterior.ring(building,x,y,x<0?0.2:0.15,0.047,0.004,Math.PI/2,0x585c50);});});
// ---- GUTTERING ----''');mark(47)
t=replace(t,'// ---- MANHOLE COVER (circular dark disc on road) ----', '''exterior.tread(scene,-2.5,0.033,6,0.46,0.46,false);
var grateFix=exterior.group(scene,-2.5,0.035,6);grateFix.rotation.x=-Math.PI/2;exterior.screws(grateFix,[[-0.22,-0.22,0],[0.22,-0.22,0],[-0.22,0.22,0],[0.22,0.22,0]],0.007);
// ---- MANHOLE COVER (circular dark disc on road) ----''');mark(48)
t=replace(t,'scene.add(manholeInner);','scene.add(manholeInner);\nexterior.tread(scene,2.5,0.049,4.5,0.35,0.35,true);');mark(49)
t=replace(t,'new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8), bollardMat','new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16), bollardMat')
t=replace(t,'// Top cap\n','''exterior.ring(scene,bp[0],0.05,bp[1],0.088,0.006,Math.PI/2,0x55594e);
exterior.ring(scene,bp[0],0.49,bp[1],0.084,0.003,Math.PI/2,0x676b5d);
// Top cap
''');mark(50)
save(s,a,b,t);print('Ronnie frontage: 10 completed')
