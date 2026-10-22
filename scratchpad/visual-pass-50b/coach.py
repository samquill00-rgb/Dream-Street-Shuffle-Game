from common import *
s,a,b,t=scope('THE COACH AND HORSES');(root/'scratchpad/visual-pass-50b/coach-before.js').write_text(t)
t=replace(t,'var W =','var detail=window.dssDetailProps(mesh,tex,k.roomEnv,scene);\nvar W =')
old='mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.34, 10), bm, ox, 0.28, 0, optics); mesh(new THREE.CylinderGeometry(0.018, 0.035, 0.12, 8), bm, ox, 0.05, 0, optics);\nmesh(new THREE.PlaneGeometry(0.06, 0.16), M.paper, ox, 0.28, 0.042, optics);'
t=replace(t,old,"var bottleG=detail.group(ox,0.455,0,optics);bottleG.rotation.x=Math.PI;detail.bottle(bottleG,0.34,0.04,botCols[o%botCols.length],o);");mark(16)
t=replace(t,'mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.6, 6), M.brass, ox, 0.24, -0.1, optics);', '''mesh(new THREE.CylinderGeometry(0.014,0.014,0.6,10),M.brass,ox,0.24,-0.1,optics);
detail.arc(optics,0.021,0.002,M.chrome,ox,-0.078,0);mesh(new THREE.BoxGeometry(0.035,0.006,0.014),M.chrome,ox,-0.04,0.028,optics);
mesh(new THREE.BoxGeometry(0.055,0.018,0.016),detail.material('#80704c','metal'),ox,0.49,-0.1,optics);''');mark(17)
t=replace(t,'new THREE.CylinderGeometry(0.02, 0.028, 0.26, 10), new THREE.MeshStandardMaterial','new THREE.LatheGeometry([[0,-0.13],[0.017,-0.13],[0.02,-0.08],[0.018,-0.04],[0.029,0.07],[0.024,0.12],[0,0.13]].map(function(p){return new THREE.Vector2(p[0],p[1]);}),24), new THREE.MeshStandardMaterial')
t=replace(t,'hdl.rotation.x = 0.35;', '''hdl.rotation.x = 0.35;
detail.wire([[px,1.38,barZ-0.1],[px+0.09,1.37,barZ-0.1],[px+0.11,1.31,barZ-0.1]],0.008,M.brass,barG);''');mark(18)
fa=s.index('// Old mechanical register:');fb=s.index('// THE TELEPHONE behind the bar',fa);till=s[fa:fb].replace('bbX+0.27,1.24,1.3','2.5,1.16,-D/2+0.35').replace('till.rotation.y=Math.PI/2','till.rotation.y=0').replace('scene.add(till);','barG.add(till);').replace('roomEnv','k.roomEnv')
old='mesh(new THREE.BoxGeometry(0.34, 0.3, 0.32), new THREE.MeshStandardMaterial({ color: 0x1a1a18, roughness: 0.4, metalness: 0.5, envMap: k.roomEnv, envMapIntensity: 0.4 }), 2.5, 1.31, -D / 2 + 0.35, barG);'
t=replace(t,old,till);mark(19)
old='mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.22, 14), new THREE.MeshPhysicalMaterial({ color: 0xe0e8d8, roughness: 0.1, transparent: true, opacity: 0.5, envMap: k.roomEnv, envMapIntensity: 1, clearcoat: 1 }), 1.7, 1.27, barZ - 0.1, barG);'
t=replace(t,old,"detail.lathe([[0,0],[0.09,0],[0.1,0.015],[0.12,0.22],[0.116,0.22],[0.096,0.018],[0,0.018]],detail.glass,1.7,1.16,barZ-0.1,barG);detail.arc(barG,0.118,0.0018,detail.glass,1.7,1.38,barZ-0.1);");mark(20)
t=replace(t,'mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.016, 14), ashMat, ax, 1.17, barZ + 0.1, barG);','detail.ash(ax,1.16,barZ+0.1,barG,0.05);');mark(21)
fa=s.index('var bakelite =',s.index('// ====== INSIDE THE FRENCH'));fb=s.index('var phoneProxy',fa);phone=s[fa:fb].replace('roomEnv','k.roomEnv')
f=t.index('mesh(new THREE.BoxGeometry(0.2, 0.09, 0.17), M.bakelite');e=t.index('var phoneHit',f);t=t[:f]+phone+t[e:];mark(22)
t=replace(t,'mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.07, 16), leatherMat, 0, 0.72, 0, g);',"var seat=mesh(new THREE.SphereGeometry(1,24,12),detail.material('#682c24','cloth'),0,0.72,0,g);seat.scale.set(0.18,0.044,0.18);detail.arc(g,0.175,0.0025,detail.material('#98644b','cloth'),0,0.716,0);");mark(23)
t=replace(t,'mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.11, 14, 1, true), M.glass.clone(), 0, 0.055, 0, glassG).material.side = THREE.DoubleSide;','detail.cup(glassG,0.035,0.11);');mark(24)
t=replace(t,'new THREE.MeshStandardMaterial({ color: 0xe8e0c8, roughness: 0.95 }), 0.04, 0.002, 0.03, glassG)',"new THREE.MeshStandardMaterial({map:tex(128,96,function(c,w,h){c.fillStyle='#d6ccb1';c.fillRect(0,0,w,h);c.fillStyle='#776b53';for(var row=0;row<10;row++)c.fillRect(7,12+row*7,80+row%3*12,1);c.strokeStyle='rgba(123,86,35,0.2)';c.lineWidth=2;c.beginPath();c.arc(87,58,32,0,6.3);c.stroke();}),roughness:1}),0.04,0.002,0.03,glassG)");mark(25)
t=replace(t,"// the till roll of the night's tab and a bar towel",'''// Rolled tab paper, the printed tail lying flat beside the towel.
var roll=mesh(new THREE.CylinderGeometry(0.022,0.022,0.06,24),detail.material('#d7cdb4','paper'),0.95,1.185,barZ-0.05,barG);roll.rotation.z=Math.PI/2;
var rollCore=mesh(new THREE.CylinderGeometry(0.006,0.006,0.061,12),detail.material('#655846','paper'),0.95,1.185,barZ-0.05,barG);rollCore.rotation.z=Math.PI/2;
var tail=mesh(new THREE.PlaneGeometry(0.06,0.13),detail.material('#d7cdb4','paper'),0.95,1.164,barZ+0.035,barG);tail.rotation.x=-Math.PI/2;
// the till roll of the night's tab and a bar towel''');mark(26)
t=replace(t,"mesh(new THREE.BoxGeometry(0.34, 0.012, 0.22), new THREE.MeshStandardMaterial({ color: 0x1a3a6a, roughness: 0.98 }), 0.5, 1.166, barZ + 0.05, barG);","var towel=detail.cloth(0.34,0.22,0.5,1.168,barZ+0.05,barG,'#3c4b62');towel.rotation.x=-Math.PI/2;");mark(27)
t=replace(t,'var bell = mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.05, 8), M.brass, 0, 1.06, 1.42, cowG);',"var bell=detail.lathe([[0.008,0.025],[0.016,0.022],[0.018,0],[0.037,-0.025],[0.034,-0.028],[0.014,0.004]],detail.material('#9b8247','metal'),0,1.06,1.42,cowG);detail.arc(cowG,0.035,0.0018,M.brass,0,1.034,1.42);mesh(new THREE.SphereGeometry(0.006,8,6),M.brass,0,1.03,1.42,cowG);");mark(28)
t=replace(t,'var gentsLight =', '''mesh(new THREE.BoxGeometry(0.065,0.14,0.006),detail.material('#8c7b4b','metal'),0.3,1,0.04,gentsG);
[-1,1].forEach(function(side){var screw=mesh(new THREE.SphereGeometry(0.0035,8,5),M.brass,0.3,1+side*0.055,0.045,gentsG);screw.scale.z=0.3;});
var gentsLight =''');mark(29)
t=replace(t,'var doorLight =', '''var pushWear=detail.material('#aa935b','metal');
mesh(new THREE.BoxGeometry(0.37,0.46,0.003),pushWear,0,0.5,0.047,doorG);
[-1,1].forEach(function(side){[-1,1].forEach(function(up){var fixing=mesh(new THREE.SphereGeometry(0.004,8,5),M.brass,side*0.165,0.5+up*0.205,0.05,doorG);fixing.scale.z=0.3;});});
var doorLight =''');mark(30)
save(s,a,b,t);print('Coach: 15 completed')
