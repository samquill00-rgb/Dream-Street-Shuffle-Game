from common import *
s,a,b,t=scope('THE PILLARS');(root/'scratchpad/visual-pass-50/pillars-before.js').write_text(t)
t=replace(t,'var ivory =','var detail=window.dssDetailProps(mesh,tex,roomEnv,scene);\nvar ivory =')
f=t.index('var bm = new THREE.MeshPhysicalMaterial',t.index('function bottle('));e=t.index('(parent || scene).add(g); return g;',f);t=t[:f]+'detail.bottle(g,h,r,col,Math.round(x*19+z*23));g.rotation.y=Math.PI/2;\n'+t[e:];mark(11)
frenchStart=s.index('// ====== INSIDE THE FRENCH');pa=s.index('var bakelite =',frenchStart);pb=s.index('var phoneProxy',pa);phone=s[pa:pb]
f=t.index('var bakelite =');e=t.index('var phoneHit',f);t=t[:f]+phone+t[e:];mark(12)
pa=s.index('// Old mechanical register:',frenchStart);pb=s.index('// THE TELEPHONE behind the bar',pa);till=s[pa:pb].replace('bbX+0.27,1.24,1.3','bbX+0.25,1.24,barZ0+0.9').replace('scene.add(till);','barG.add(till);')
f=t.index('var till = mesh(');e=t.index('// bentwood stools',f);t=t[:f]+till+t[e:];mark(13)
t=replace(t,'mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.035, 20), stoolSeat, 0, 0.74, 0, g).castShadow = true;',"var wornSeat=mesh(new THREE.SphereGeometry(1,24,10),stoolSeat,0,0.74,0,g);wornSeat.scale.set(0.17,0.022,0.17);detail.arc(g,0.165,0.002,detail.material('#725134','glaze'),0,0.735,0);");mark(14)
t=replace(t,'mesh(new THREE.TorusGeometry(0.15, 0.011, 6, 20), bentMat, 0, 0.24, 0, g).rotation.x = Math.PI / 2;',"detail.arc(g,0.15,0.011,detail.material('#7c6348','glaze'),0,0.24,0);for(var join=0;join<4;join++){var angle=join*Math.PI/2+0.4;mesh(new THREE.CylinderGeometry(0.017,0.017,0.016,10),bentMat,Math.cos(angle)*0.14,0.24,Math.sin(angle)*0.14,g);}");mark(15)
t=replace(t,"cx.fillText('ALES', 32, 41); });","cx.fillText('ALES', 32, 41);cx.strokeStyle='rgba(91,66,31,0.22)';cx.lineWidth=2;cx.beginPath();cx.arc(27,34,21,0,6.3);cx.stroke();for(var f=0;f<230;f++){cx.fillStyle='rgba(238,222,182,0.23)';cx.fillRect(f*47%w,f*71%h,1,1);} });");mark(16)
t=replace(t,'// coat hooks by the door', '''var clockRim=mesh(new THREE.TorusGeometry(0.163,0.008,8,48),detail.material('#8e7954','metal'),1.75,2.42,-D/2+0.085);
mesh(new THREE.CircleGeometry(0.157,40),detail.glass,1.75,2.42,-D/2+0.09);
for(var tick=0;tick<60;tick++){var angle=tick*Math.PI/30;var tm=mesh(new THREE.BoxGeometry(0.001,tick%5?0.003:0.006,0.001),detail.material('#5c5343','metal'),1.75+Math.sin(angle)*0.149,2.42+Math.cos(angle)*0.149,-D/2+0.084);tm.rotation.z=-angle;}
// coat hooks by the door''');mark(17)
t=replace(t,'pr.rotation.y = -Math.PI / 2;', '''pr.rotation.y = -Math.PI / 2;
var trim=detail.material('#806441','metal');[-1,1].forEach(function(side){mesh(new THREE.BoxGeometry(0.005,0.55,0.005),trim,W/2-0.056,fy,fz+side*0.215);mesh(new THREE.BoxGeometry(0.005,0.005,0.43),trim,W/2-0.056,fy+side*0.275,fz);});''');mark(18)
needle='mesh(new THREE.SphereGeometry(0.012, 8, 6), brass, barX - 0.22, 1.2, barZ1 - 0.2, barG);'
t=replace(t,needle,needle+"\ndetail.arc(barG,0.043,0.0025,brass,barX-0.22,1.131,barZ1-0.2);mesh(new THREE.CylinderGeometry(0.003,0.003,0.012,8),detail.material('#3d372d','metal'),barX-0.22,1.209,barZ1-0.2,barG);");mark(19)
t=replace(t,'new THREE.CylinderGeometry(0.022, 0.03, 0.34, 10), ivory','new THREE.LatheGeometry([[0,-0.17],[0.019,-0.17],[0.022,-0.11],[0.018,-0.06],[0.03,0.08],[0.025,0.15],[0,0.17]].map(function(p){return new THREE.Vector2(p[0],p[1]);}),24), ivory');mark(20)
save(s,a,b,t);print('Pillars: 10 completed')
