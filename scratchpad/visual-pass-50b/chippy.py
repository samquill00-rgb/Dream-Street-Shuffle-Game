from common import *
s,a,b,t=scope('THE CHINESE FISH AND CHIPS');(root/'scratchpad/visual-pass-50b/chippy-before.js').write_text(t)
t=replace(t,'var W =','var detail=window.dssDetailProps(mesh,tex,k.roomEnv,scene);\nvar W =')
t=replace(t,'mesh(new THREE.CylinderGeometry(0.15, 0.13, 0.015, 24), new THREE.MeshStandardMaterial({ color: 0xf0f0e8, roughness: 0.3, envMap: k.roomEnv, envMapIntensity: 0.4 }), 0, 0.01, 0, plateG);',"detail.lathe([[0,0],[0.09,0],[0.125,0.004],[0.15,0.012],[0.15,0.016],[0.14,0.017],[0.12,0.007],[0,0.007]],detail.material('#dedbca','glaze'),0,0.004,0,plateG);detail.arc(plateG,0.146,0.0014,detail.material('#bdbda9','glaze'),0,0.021,0);");mark(41)
t=replace(t,'mesh(new THREE.BoxGeometry(0.015, 0.006, 0.13), M.chrome, 0.12, 0.02, 0.06, plateG).rotation.y = -0.4; mesh(new THREE.BoxGeometry(0.03, 0.006, 0.03), M.chrome, 0.145, 0.02, 0.005, plateG);', '''var forkG=detail.group(0.12,0.023,0.06,plateG);forkG.rotation.y=-0.4;
var handle=mesh(new THREE.SphereGeometry(1,16,8),M.chrome,0,0,0.025,forkG);handle.scale.set(0.006,0.002,0.055);
mesh(new THREE.BoxGeometry(0.006,0.003,0.035),M.chrome,0,0,-0.035,forkG);mesh(new THREE.BoxGeometry(0.027,0.003,0.012),M.chrome,0,0.001,-0.055,forkG);
for(var tine=0;tine<4;tine++)mesh(new THREE.BoxGeometry(0.0025,0.002,0.024),M.chrome,(tine-1.5)*0.007,0.002,-0.072,forkG);''');mark(42)
old='mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.09, 8), new THREE.MeshStandardMaterial({ color: 0xe8e8e0, roughness: 0.5 }), 0.2, 0.06, 0.12, plateG);'
t=replace(t,old,'''detail.lathe([[0,0],[0.017,0],[0.018,0.008],[0.014,0.078],[0.012,0.084],[0,0.084]],detail.glass,0.2,0.015,0.12,plateG);
mesh(new THREE.CylinderGeometry(0.012,0.015,0.05,20),detail.material('#d2cebd','paper'),0.2,0.043,0.12,plateG);
mesh(new THREE.CylinderGeometry(0.0145,0.0145,0.01,20),detail.material('#999d94','metal'),0.2,0.101,0.12,plateG);
for(var hole=0;hole<7;hole++){var angle=hole*Math.PI/3,r=hole===6?0:0.008;detail.button(plateG,0.2+Math.cos(angle)*r,0.107,0.12+Math.sin(angle)*r,0.0012,'#383c35');}''');mark(43)
old='mesh(new THREE.CylinderGeometry(0.014, 0.02, 0.11, 8), new THREE.MeshPhysicalMaterial({ color: 0x4a3010, roughness: 0.1, transparent: true, opacity: 0.85, envMap: k.roomEnv, envMapIntensity: 0.8 }), 0.25, 0.07, 0.05, plateG);'
t=replace(t,old,'''var vinegarG=detail.group(0.25,0.015,0.05,plateG);detail.bottle(vinegarG,0.082,0.019,0x66502a,2);
mesh(new THREE.CylinderGeometry(0.008,0.008,0.01,16),detail.material('#aaaca1','metal'),0,0.115,0,vinegarG);
mesh(new THREE.CylinderGeometry(0.0025,0.0035,0.008,10),M.chrome,0.003,0.123,0,vinegarG);''');mark(44)
old="mesh(new THREE.BoxGeometry(0.06, 0.018, 0.04), new THREE.MeshStandardMaterial({ color: 0xd8b060, roughness: 0.8 }), 0.18, 0.77, 0.1, tableG).rotation.y = 0.5;"
t=replace(t,old,'''var matchG=detail.group(0.18,0.77,0.1,tableG);matchG.rotation.y=0.5;
mesh(new THREE.BoxGeometry(0.06,0.017,0.04),detail.material('#b59c63','paper'),0,0,0,matchG);
mesh(new THREE.BoxGeometry(0.002,0.012,0.034),detail.material('#d8ccb0','paper'),0.031,0,0,matchG);
mesh(new THREE.BoxGeometry(0.052,0.009,0.001),detail.material('#654b37','cloth'),0,0,0.0205,matchG);
mesh(new THREE.BoxGeometry(0.035,0.0005,0.021),detail.material('#8a4933','paper'),0,0.009,0,matchG);''');mark(45)
old='mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.015, 12), new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.3 }), -0.15, 0.77, -0.1, tableG);'
t=replace(t,old,'detail.ash(-0.15,0.76,-0.1,tableG,0.04);');mark(46)
old='mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.06, 16), new THREE.MeshStandardMaterial({ color: 0xc03030, roughness: 0.35, envMap: k.roomEnv, envMapIntensity: 0.5 }), 0, 0.7, 0, g);'
t=replace(t,old,"var seat=mesh(new THREE.SphereGeometry(1,24,10),detail.material('#9c3f37','cloth'),0,0.7,0,g);seat.scale.set(0.17,0.037,0.17);detail.arc(g,0.164,0.002,detail.material('#c68067','cloth'),0,0.699,0);mesh(new THREE.CylinderGeometry(0.033,0.033,0.025,16),M.chrome,0,0.65,0,g);");mark(47)
t=replace(t,"var formica = new THREE.MeshStandardMaterial({ color: 0xe8b8a0, roughness: 0.3, envMap: k.roomEnv, envMapIntensity: 0.5 });","var formica=detail.material('#c6a38e','glaze');formica.roughness=0.42;")
t=replace(t,'// your plate: fish, chips,', '''for(var scratch=0;scratch<14;scratch++){var line=mesh(new THREE.BoxGeometry(0.012+scratch%3*0.011,0.0003,0.0004),detail.material('#a78e7a','paper'),-0.1+scratch%4*0.07,1.005,-1.2+scratch*0.17,counterG);line.rotation.y=scratch*0.7;}
// your plate: fish, chips,''');mark(48)
t=replace(t,'// the hot cabinet: glass front,', '''[-1.1,-0.3].forEach(function(fx){
var knob=mesh(new THREE.CylinderGeometry(0.025,0.025,0.014,20),detail.material('#37382f','glaze'),fx,0.79,0.46,rangeG);knob.rotation.x=Math.PI/2;
mesh(new THREE.BoxGeometry(0.002,0.014,0.002),M.chrome,fx,0.8,0.468,rangeG);
var lamp=mesh(new THREE.SphereGeometry(0.006,10,6),detail.material('#98642d','glaze'),fx+0.08,0.79,0.461,rangeG);lamp.scale.z=0.35;
[-1,1].forEach(function(side){var screw=mesh(new THREE.SphereGeometry(0.003,6,4),M.chrome,fx+side*0.16,0.86,0.455,rangeG);screw.scale.z=0.3;});
});
// the hot cabinet: glass front,''');mark(49)
old='var basket = mesh(new THREE.BoxGeometry(0.4, 0.14, 0.4), new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.5, metalness: 0.7, wireframe: true }), fx, 1.08, 0, rangeG);'
new='''var basket=detail.group(fx,1.08,0,rangeG),wirePositions=[];
function segment(x,y,z,xx,yy,zz){wirePositions.push(x,y,z,xx,yy,zz);}
for(var w=0;w<=12;w++){var v=-0.2+w/12*0.4;
segment(v,-0.07,-0.2,v,-0.07,0.2);segment(-0.2,-0.07,v,0.2,-0.07,v);
segment(v,-0.07,-0.2,v,0.07,-0.2);segment(v,-0.07,0.2,v,0.07,0.2);
segment(-0.2,-0.07,v,-0.2,0.07,v);segment(0.2,-0.07,v,0.2,0.07,v);}
for(var level=0;level<4;level++){var y=-0.07+level*0.047;segment(-0.2,y,-0.2,0.2,y,-0.2);segment(-0.2,y,0.2,0.2,y,0.2);segment(-0.2,y,-0.2,-0.2,y,0.2);segment(0.2,y,-0.2,0.2,y,0.2);}
var meshGeo=new THREE.BufferGeometry();meshGeo.setAttribute('position',new THREE.Float32BufferAttribute(wirePositions,3));basket.add(new THREE.LineSegments(meshGeo,new THREE.LineBasicMaterial({color:0x8e9186})));
var grip=mesh(new THREE.CylinderGeometry(0.014,0.014,0.13,12),detail.material('#38352b','glaze'),fx,1.345,0.405,rangeG);grip.rotation.x=0.9;
'''
t=replace(t,old,new);mark(50)
save(s,a,b,t);print('Chip shop: 10 completed')
