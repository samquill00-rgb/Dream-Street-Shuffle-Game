from common import *
s,a,b,t=scope("COPPER'S CELLAR");(root/'scratchpad/visual-pass-50/cellar-before.js').write_text(t)
t=replace(t,'var W =','var detail=window.dssDetailProps(mesh,tex,k.roomEnv,scene);\nvar W =')
old="mesh(new THREE.BoxGeometry(0.2, 0.015, 0.26), new THREE.MeshStandardMaterial({ color: 0xe0d8c8, roughness: 0.95 }), -0.35, 0.757, 0.12, tableG).rotation.y = 0.25;"
t=replace(t,old,"var notebook=detail.paperBlock(0.2,0.014,0.26,-0.35,0.75,0.12,tableG,'#504a38');notebook.rotation.y=0.25;for(var stitch=0;stitch<6;stitch++){var loop=mesh(new THREE.TorusGeometry(0.004,0.0008,4,10),M.chrome,-0.45,0.766,0.035+stitch*0.032,tableG);loop.rotation.y=Math.PI/2;}");mark(21)
needle='mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.14, 6), M.black, -0.28, 0.77, 0.06, tableG).rotation.set(Math.PI / 2, 0, 0.6);'
t=replace(t,needle,'''var penG=detail.group(-0.28,0.77,0.06,tableG);penG.rotation.set(Math.PI/2,0,0.6);
mesh(new THREE.CylinderGeometry(0.004,0.0045,0.12,12),M.black,0,0,0,penG);
mesh(new THREE.ConeGeometry(0.004,0.017,10),M.brass,0,0.068,0,penG);
mesh(new THREE.CylinderGeometry(0.0048,0.0048,0.004,12),M.brass,0,-0.035,0,penG);mesh(new THREE.BoxGeometry(0.0015,0.024,0.002),M.brass,0.005,-0.038,0,penG);''');mark(22)
t=replace(t,'mesh(new THREE.CylinderGeometry(0.03, 0.028, 0.08, 12), M.glass, 0.35, 0.79, 0.2, tableG);','var whiskyGlass=detail.group(0.35,0.75,0.2,tableG);detail.cup(whiskyGlass,0.03,0.08);');mark(23)
t=replace(t,'mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.016, 14), new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.3, metalness: 0.2 }), 0.05, 0.758, -0.2, tableG);','detail.ash(0.05,0.75,-0.2,tableG,0.05);');mark(24)
t=replace(t,"mesh(new THREE.BoxGeometry(0.28, 0.01, 0.2), new THREE.MeshStandardMaterial({ color: 0xc8c0b0, roughness: 0.95 }), -0.5, 0.755, -0.22, tableG).rotation.y = -0.4;",'''var news=detail.paperBlock(0.28,0.006,0.2,-0.5,0.75,-0.22,tableG,'#c5bca4');news.rotation.y=-0.4;
var newsTex=tex(256,192,function(c,w,h){c.fillStyle='#c9c0a9';c.fillRect(0,0,w,h);c.fillStyle='#67604f';c.fillRect(12,12,232,4);for(var col=0;col<4;col++)for(var line=0;line<35;line++){c.globalAlpha=0.35+(line%3)*0.1;c.fillRect(12+col*60,28+line*4,43+(line*7%11),1);}c.globalAlpha=0.25;c.fillRect(0,94,w,2);});
var newsFace=mesh(new THREE.PlaneGeometry(0.27,0.19),new THREE.MeshStandardMaterial({map:newsTex,roughness:1}),0,0.010,0,news);newsFace.rotation.x=-Math.PI/2;''');mark(25)
t=replace(t,'var tableLight = new THREE.PointLight', '''detail.arc(tableG,0.138,0.003,M.brass,0.45,0.96,-0.15);
mesh(new THREE.CylinderGeometry(0.055,0.07,0.015,24),M.brass,0.45,0.76,-0.15,tableG);detail.button(tableG,0.47,0.78,-0.15,0.006,'#322d24');
var tableLight = new THREE.PointLight''');mark(26)
t=replace(t,'mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.7, 12), M.darkWood, -2.3, 0.35, 0.4).castShadow = true;', '''var barrelG=detail.group(-2.3,0,0.4);var staveMat=detail.material('#53402a','cloth'),hoopMat=detail.material('#4b4a40','metal');
detail.lathe([[0,0],[0.24,0],[0.27,0.08],[0.285,0.35],[0.27,0.62],[0.24,0.7],[0,0.7]],staveMat,0,0,0,barrelG,32);
[0.07,0.2,0.5,0.63].forEach(function(y){var r=0.247+Math.sin(y/0.7*Math.PI)*0.038;detail.arc(barrelG,r,0.009,hoopMat,0,y,0);});
for(var seam=0;seam<16;seam++){var angle=seam/16*Math.PI*2;detail.wire([[Math.cos(angle)*0.242,0.01,Math.sin(angle)*0.242],[Math.cos(angle)*0.286,0.35,Math.sin(angle)*0.286],[Math.cos(angle)*0.242,0.69,Math.sin(angle)*0.242]],0.0018,detail.material('#2a261d','cloth'),barrelG);}
mesh(new THREE.CylinderGeometry(0.025,0.025,0.008,12),M.darkWood,0.08,0.704,0.03,barrelG);''');mark(27)
needle='cr.rotation.y = c[2] * 0.3; cr.castShadow = true;'
t=replace(t,needle,'''cr.rotation.y = c[2] * 0.3; cr.castShadow = true;
var crateG=detail.group(c[0],0.21+(i===2?0.42:0),c[1]);crateG.rotation.y=cr.rotation.y;
[-1,1].forEach(function(side){for(var slat=0;slat<4;slat++){mesh(new THREE.BoxGeometry(0.5,0.004,0.002),detail.material('#31291c','cloth'),0,-0.15+slat*0.1,side*0.252,crateG);}[-0.22,0.22].forEach(function(x){mesh(new THREE.BoxGeometry(0.042,0.4,0.018),crateMat,x,0,side*0.255,crateG);[-0.16,0.16].forEach(function(y){var nail=mesh(new THREE.SphereGeometry(0.004,6,4),M.chrome,x,y,side*0.267,crateG);nail.scale.z=0.3;});});});''');mark(28)
t=replace(t,'safe.castShadow = true;', '''safe.castShadow = true;
mesh(new THREE.BoxGeometry(0.012,0.68,0.48),detail.material('#3b4338','metal'),-2.091,0.4,-3.6);
[-1,1].forEach(function(side){mesh(new THREE.CylinderGeometry(0.019,0.019,0.09,10),M.chrome,-2.08,0.4+side*0.23,-3.83);});
var safeDial=mesh(new THREE.CylinderGeometry(0.035,0.035,0.015,24),M.chrome,-2.07,0.6,-3.49);safeDial.rotation.z=Math.PI/2;
for(var tick=0;tick<12;tick++){var angle=tick*Math.PI/6;mesh(new THREE.SphereGeometry(0.002,5,4),M.black,-2.061,0.6+Math.cos(angle)*0.028,-3.49+Math.sin(angle)*0.028);}''');mark(29)
t=replace(t,'var rug = mesh(','''// Fine weave and faded crossings preserve the rug's original pattern.
(function(){var c=rugTex.image.getContext('2d');for(var y=0;y<512;y+=3){c.fillStyle='rgba(15,10,7,0.08)';c.fillRect(0,y,512,1);}for(var x=0;x<512;x+=3){c.fillStyle='rgba(188,157,112,0.05)';c.fillRect(x,0,1,512);}rugTex.needsUpdate=true;})();
var rug = mesh(''')
t=replace(t,'rug.receiveShadow = true;', '''rug.receiveShadow = true;
for(var fringe=0;fringe<42;fringe++){var z=0.2+(fringe/41-0.5)*3.5;[-1,1].forEach(function(side){var thread=mesh(new THREE.CylinderGeometry(0.0015,0.0015,0.035,4),detail.material('#866f4b','cloth'),W/2-1.2+side*1.31,0.004,z);thread.rotation.z=Math.PI/2;});}''');mark(30)
save(s,a,b,t);print('Cellar: 10 completed')
