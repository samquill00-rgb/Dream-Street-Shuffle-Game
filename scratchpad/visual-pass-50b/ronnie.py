from common import *
s,a,b,t=scope("RONNIE'S");(root/'scratchpad/visual-pass-50b/ronnie-before.js').write_text(t)
t=replace(t,'// ---------- THE STAGE,','var detail=window.dssDetailProps(mesh,tex,roomEnv,scene);\n// ---------- THE STAGE,')
t=replace(t,'micHead.rotation.x = 0.4;', '''micHead.rotation.x = 0.4;
var micMesh=tex(64,64,function(c,w,h){c.fillStyle='#6c6e66';c.fillRect(0,0,w,h);for(var y=0;y<h;y+=4)for(var x=0;x<w;x+=4){c.fillStyle='#252824';c.fillRect(x+y%8/2,y,2,2);}});
micHead.material=new THREE.MeshStandardMaterial({map:micMesh,roughness:0.55,metalness:0.55,envMap:roomEnv,envMapIntensity:0.3});
var micClip=mesh(new THREE.TorusGeometry(0.023,0.004,6,16),black,0.3,1.93,0.6,stageG);micClip.rotation.x=Math.PI/2;
detail.wire([[0.3,1.92,0.6],[0.32,1.4,0.61],[0.31,0.49,0.61],[0.48,0.435,0.9],[0.7,0.435,0.8],[0.6,0.435,0.6]],0.003,black,stageG);''');mark(1)
t=replace(t,"new THREE.MeshStandardMaterial({ color: 0x3a3028, roughness: 1 })","detail.material('#554838','cloth')")
t=replace(t,'// the spotlight, and its cone', '''for(var control=0;control<4;control++){var knob=mesh(new THREE.CylinderGeometry(0.009,0.009,0.008,12),black,1.43+control*0.075,0.865,-0.443,stageG);knob.rotation.x=Math.PI/2;}
[-1,1].forEach(function(side){[-1,1].forEach(function(up){mesh(new THREE.BoxGeometry(0.035,0.035,0.025),chrome,1.6+side*0.258,0.67+up*0.232,-0.44,stageG);});});
// the spotlight, and its cone''');mark(2)
t=replace(t,"new THREE.MeshStandardMaterial({ color: 0xe8e0c8, roughness: 0.35 })","detail.material('#d5cbae','paper')")
t=replace(t,'// the trio\'s kit:', '''for(var keyEdge=0;keyEdge<40;keyEdge++)mesh(new THREE.BoxGeometry(0.0006,0.001,0.11),detail.material('#8f846d','paper'),-0.563+keyEdge*0.028,1.101,0.825,pianoG);
// the trio's kit:''');mark(3)
t=replace(t,'// 2026-10-14 (speed): a real light only on the tables', '''detail.arc(g,0.089,0.0017,detail.material('#6e2923','cloth'),0.1,0.85,0.05);
mesh(new THREE.CylinderGeometry(0.031,0.038,0.009,20),chrome,0.1,0.746,0.05,g);
// 2026-10-14 (speed): a real light only on the tables''');mark(4)
t=replace(t,'mesh(new THREE.BoxGeometry(0.4, 0.07, 0.4), velvet, 0, 0.45, 0, ch);',"var cushion=mesh(new THREE.SphereGeometry(1,20,10),detail.material('#562022','cloth'),0,0.45,0,ch);cushion.scale.set(0.21,0.045,0.21);detail.arc(ch,0.197,0.002,detail.material('#813d38','cloth'),0,0.446,0);");mark(5)
f=t.index('var b = mesh(new THREE.CylinderGeometry(0.032',t.index('function tumbler('));e=t.index('if (fill > 0)',f);t=t[:f]+'detail.cup(g,0.032,0.09);\n'+t[e:];mark(6)
t=replace(t,'mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.016, 14), ashMat, 0.14, 0.745, -0.14, g);','detail.ash(0.14,0.739,-0.14,g,0.045);');mark(7)
f=t.index('var bm = new THREE.MeshPhysicalMaterial',t.index('function bottle('));e=t.index('(parent || scene).add(g); return g;',f);t=t[:f]+'detail.bottle(g,h,r,col,Math.round(x*17+z*23));g.rotation.y=Math.PI/2;\n'+t[e:];mark(8)
t=replace(t,"mesh(new THREE.BoxGeometry(0.2, 0.012, 0.26), new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.95 }), barX + 0.05, 1.13, 1.6, barG);","var barTowel=detail.cloth(0.2,0.26,barX+0.05,1.133,1.6,barG,'#c8bda3');barTowel.rotation.x=-Math.PI/2;");mark(9)
t=replace(t,'tumbler(barX + 0.1, 1.125', '''var syMetal=detail.material('#a6a394','metal');
detail.wire([[barX-0.1,1.36,barZ1-0.5],[barX-0.04,1.38,barZ1-0.5],[barX,1.35,barZ1-0.5]],0.005,syMetal,barG);
mesh(new THREE.CylinderGeometry(0.018,0.025,0.04,16),syMetal,barX-0.1,1.38,barZ1-0.5,barG);mesh(new THREE.BoxGeometry(0.06,0.005,0.012),syMetal,barX-0.07,1.405,barZ1-0.5,barG);
tumbler(barX + 0.1, 1.125''');mark(10)
t=replace(t,'mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.05, 16), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.5 }), barX - 0.12, 1.15, 0.5, barG);',"detail.lathe([[0,0],[0.06,0],[0.09,0.05],[0.084,0.05],[0.056,0.008],[0,0.008]],detail.material('#c1b59c','glaze'),barX-0.12,1.125,0.5,barG);")
t=replace(t,'mesh(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshStandardMaterial({ color: 0xe8d030, roughness: 0.7 }), barX - 0.12 + (rnd(lm) - 0.5) * 0.08, 1.19, 0.5 + (rnd(lm + 1) - 0.5) * 0.08, barG);',"{var lemon=mesh(new THREE.SphereGeometry(0.025,14,10),detail.material('#b6a13d','cloth'),barX-0.12+(rnd(lm)-0.5)*0.08,1.19,0.5+(rnd(lm+1)-0.5)*0.08,barG);lemon.scale.set(1.25,0.85,1);lemon.rotation.y=lm*1.7;}");mark(11)
fa=s.index('// Old mechanical register:');fb=s.index('// THE TELEPHONE behind the bar',fa);till=s[fa:fb].replace('bbX+0.27,1.24,1.3','-W/2+0.25,1.24,barZ1-0.5').replace('scene.add(till);','barG.add(till);')
old='mesh(new THREE.BoxGeometry(0.3, 0.26, 0.34), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.5, envMap: roomEnv, envMapIntensity: 0.4 }), -W / 2 + 0.25, 1.37, barZ1 - 0.5, barG);'
t=replace(t,old,till);mark(12)
fa=s.index('var bakelite =',s.index('// ====== INSIDE THE FRENCH'));fb=s.index('var phoneProxy',fa);phone=s[fa:fb]
f=t.index('var bakelite =');e=t.index('var phoneHit',f)
drape="""var cloth=detail.cloth(0.28,0.24,0.02,0.155,0,phoneG,'#612b2b');cloth.rotation.x=-Math.PI/2;
var cv=cloth.geometry.attributes.position;for(var v=0;v<cv.count;v++){var x=cv.getX(v),y=cv.getY(v);cv.setZ(v,cv.getZ(v)-Math.max(0,Math.abs(x)-0.08)*0.8-Math.max(0,Math.abs(y)-0.065)*0.7);}cloth.geometry.computeVertexNormals();
"""
t=t[:f]+phone+drape+t[e:];mark(13)
t=replace(t,'mesh(new THREE.BoxGeometry(0.48, 0.58, 0.03), picFrame, 0, 0, 0.015, g);', '''mesh(new THREE.BoxGeometry(0.48,0.58,0.03),detail.material('#2e2921','glaze'),0,0,0.015,g);
[-1,1].forEach(function(side){mesh(new THREE.BoxGeometry(0.006,0.53,0.004),detail.material('#77684c','metal'),side*0.215,0,0.033,g);mesh(new THREE.BoxGeometry(0.43,0.006,0.004),detail.material('#77684c','metal'),0,side*0.265,0.033,g);});''');mark(14)
t=replace(t,'mesh(new THREE.PlaneGeometry(0.62, 0.62), new THREE.MeshStandardMaterial({ color: 0xf0e8dc, roughness: 0.95, transparent: true, opacity: 0.5 }), 0, 0.737, 0, g).rotation.x = -Math.PI / 2;',"var tableCloth=detail.cloth(0.62,0.62,0,0.738,0,g,'#a69a87');tableCloth.rotation.x=-Math.PI/2;var cv=tableCloth.geometry.attributes.position;for(var v=0;v<cv.count;v++){var x=cv.getX(v),y=cv.getY(v),r=Math.hypot(x,y);cv.setZ(v,cv.getZ(v)-Math.max(0,r-0.29)*0.6);}tableCloth.geometry.computeVertexNormals();");mark(15)
save(s,a,b,t);print('Ronnie: 15 completed')
