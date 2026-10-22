from common import *
s,a,b,t=scope("LACKLAND'S OFFICE");(root/'scratchpad/visual-pass-50/office-before.js').write_text(t)
t=replace(t,'var W =','var detail=window.dssDetailProps(mesh,tex,k.roomEnv,scene);\nvar W =')
t=replace(t,'manuscript.rotation.y = -0.08;', '''manuscript.rotation.y = -0.08;
manuscript.material=detail.material('#dfd6bd','paper');for(var sheet=0;sheet<7;sheet++){mesh(new THREE.BoxGeometry(0.218,0.0008,0.298),detail.material('#b9ad90','paper'),0.1+Math.sin(sheet)*0.001,0.798+sheet*0.0038,0.02,deskG).rotation.y=-0.08;}''');mark(31)
t=replace(t,'var drinksHit =', '''detail.arc(decanter,0.059,0.0017,detail.glass,0,0.025,0);detail.arc(decanter,0.054,0.0013,detail.glass,0,0.145,0);
for(var cut=0;cut<12;cut++){var angle=cut*Math.PI/6;mesh(new THREE.CylinderGeometry(0.0015,0.0015,0.1,5),detail.glass,Math.cos(angle)*0.064,0.08,Math.sin(angle)*0.064,decanter);}
var stopper=mesh(new THREE.DodecahedronGeometry(0.025,1),detail.glass,0,0.278,0,decanter);stopper.scale.y=0.75;
var drinksHit =''');mark(32)
f=t.index('for (var pc = 0; pc < 7; pc++)');e=t.index('var eye =',f)
t=t[:f]+'''for(var pc=0;pc<7;pc++){var clip=detail.group((rnd(pc)-0.5)*0.07,0.009,(rnd(pc+5)-0.5)*0.07,dishG);clip.rotation.y=pc*1.7;
detail.wire([[-0.003,0,0.003],[-0.003,0,-0.008],[0,0,-0.012],[0.004,0,-0.008],[0.004,0,0.009],[0,0,0.014],[-0.006,0,0.009],[-0.006,0,-0.007]],0.0008,M.chrome,clip);}
'''+t[e:];mark(33)
t=replace(t,'[[0.72, 0.09, -0.02]', '''// Platen, carriage rail, paper guides and a typewriter's worn ribbon cover.
var platen=mesh(new THREE.CylinderGeometry(0.022,0.022,0.35,20),M.black,-0.55,0.966,0.037,deskG);platen.rotation.z=Math.PI/2;
var carriage=mesh(new THREE.CylinderGeometry(0.004,0.004,0.4,10),M.chrome,-0.55,0.956,0.052,deskG);carriage.rotation.z=Math.PI/2;
[-1,1].forEach(function(side){var knob=mesh(new THREE.CylinderGeometry(0.017,0.017,0.017,14),M.black,-0.55+side*0.19,0.966,0.037,deskG);knob.rotation.z=Math.PI/2;mesh(new THREE.BoxGeometry(0.008,0.035,0.006),M.chrome,-0.55+side*0.115,0.983,0.02,deskG);});
[[0.72, 0.09, -0.02]''');mark(34)
t=replace(t,"var leather = new THREE.MeshStandardMaterial({ color: 0x3a1a10, roughness: 0.5, envMap: k.roomEnv, envMapIntensity: 0.3 });","var leather=detail.material('#593626','cloth');leather.roughness=0.6;")
t=replace(t,'var lackland = k.ghost', '''var seamMat=detail.material('#87664b','cloth');
[-1,1].forEach(function(side){detail.wire([[side*0.255,0.55,0.24],[side*0.255,0.55,-0.23],[side*0.255,1.12,-0.194]],0.0015,seamMat,chairG);});
for(var button=0;button<6;button++)detail.button(chairG,(button%3-1)*0.15,0.72+Math.floor(button/3)*0.23,-0.195,0.009,'#3c2b20');
var lackland = k.ghost''');mark(35)
t=replace(t,'var platter =', '''// Aged enamel deck with recessed fixings and a narrow plinth lip.
plinth.material=detail.material('#b6ae98','metal');
[[-0.27,-0.18],[0.27,-0.18],[-0.27,0.18],[0.27,0.18]].forEach(function(p){detail.button(ttG,p[0],0.133,p[1],0.004,'#5c5a4d');});
mesh(new THREE.BoxGeometry(0.64,0.008,0.46),detail.material('#48392b','cloth'),0,0.052,0,ttG);
var platter =''');mark(36)
t=replace(t,'sleeve.rotation.z = (rnd(rv) - 0.5) * 0.08;', '''sleeve.rotation.z = (rnd(rv) - 0.5) * 0.08;
sleeve.material.map=detail.material('#c2b69e','paper').map;sleeve.material.needsUpdate=true;
mesh(new THREE.BoxGeometry(0.0015,0.28,0.002),detail.material('#87785c','paper'),-0.31+rv*0.033,-0.37,0.206,ttG);''');mark(37)
t=replace(t,'var ampLight =', '''for(var knob=0;knob<4;knob++){var control=mesh(new THREE.CylinderGeometry(0.012,0.012,0.009,14),M.black,-0.17+knob*0.09,0.095,0.185,ampG);control.rotation.x=Math.PI/2;mesh(new THREE.BoxGeometry(0.001,0.007,0.001),M.chrome,-0.17+knob*0.09,0.1,0.191,ampG);}
for(var vent=0;vent<12;vent++)mesh(new THREE.BoxGeometry(0.003,0.001,0.07),M.black,-0.21+vent*0.038,0.181,0.09,ampG);
var ampLight =''');mark(38)
t=replace(t,"new THREE.MeshStandardMaterial({ color: 0x3a3028, roughness: 1 })", "detail.material('#574a37','cloth')")
t=replace(t,'// ---------- THE SHELVES of other people', '''[-1,1].forEach(function(side){mesh(new THREE.BoxGeometry(0.008,0.72,0.012),M.darkWood,W/2-0.517,0.4,0.6+side*0.22);mesh(new THREE.BoxGeometry(0.008,0.012,0.44),M.darkWood,W/2-0.517,0.4+side*0.355,0.6);});
// ---------- THE SHELVES of other people''');mark(39)
t=replace(t,"var curtain = new THREE.MeshStandardMaterial({ color: 0x4a2a1a, roughness: 0.95 });","var curtain=detail.material('#583e29','cloth');")
t=replace(t,'// ---------- THE DOOR AT THE BACK', '''for(var hem=0;hem<5;hem++)mesh(new THREE.BoxGeometry(0.07,0.008,0.002),detail.material('#826544','cloth'),0.62+hem*0.09,-0.96,0.162,winG);
// ---------- THE DOOR AT THE BACK''');mark(40)
save(s,a,b,t);print('Office: 10 completed')
