from common import *
s,a,b,t=scope("O'FLATTERLY'S");(root/'scratchpad/visual-pass-50/bookshop-before.js').write_text(t)
t=replace(t,'var W =','var detail=window.dssDetailProps(mesh,tex,k.roomEnv,scene);\nvar W =')
t=replace(t,'for (var r = 0; r < 9; r++) mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.4, 8), M.oak, 0, 0.25 + r * 0.32, 0, ladderG).rotation.z = Math.PI / 2;', '''for(var r=0;r<9;r++){var rung=mesh(new THREE.CylinderGeometry(0.014,0.014,0.4,12),detail.material('#9b7a49','glaze'),0,0.25+r*0.32,0,ladderG);rung.rotation.z=Math.PI/2;
[-1,1].forEach(function(side){var fixing=mesh(new THREE.SphereGeometry(0.004,8,5),M.brass,side*0.2,0.25+r*0.32,0.018,ladderG);fixing.scale.z=0.3;});}''');mark(41)
t=replace(t,"mesh(new THREE.BoxGeometry(0.16, 0.02, 0.22), new THREE.MeshStandardMaterial({ color: 0xe8e0cc, roughness: 0.95 }), 0.0, 1.22, 0.02, ladderG).rotation.x = -0.4;", '''var ladderBook=detail.group(0,1.22,0.02,ladderG);ladderBook.rotation.x=-0.4;
[-1,1].forEach(function(side){var leaf=detail.paperBlock(0.078,0.012,0.22,side*0.04,0,0,ladderBook,'#624637');leaf.rotation.z=-side*0.08;
var print=tex(64,128,function(c,w,h){c.fillStyle='#ded2b4';c.fillRect(0,0,w,h);c.fillStyle='#7c705b';for(var l=0;l<22;l++)c.fillRect(6,9+l*5,43+(l*7%10),0.7);});var face=mesh(new THREE.PlaneGeometry(0.072,0.21),new THREE.MeshStandardMaterial({map:print,roughness:1}),0,0.014,0,leaf);face.rotation.x=-Math.PI/2;});''');mark(42)
t=replace(t,'ledger.rotation.y = 0.15;', '''ledger.rotation.y = 0.15;ledger.material=detail.material('#273a47','cloth');
var ledgerPages=detail.paperBlock(0.285,0.038,0.405,0.65,1.025,0.05,counterG,'#273a47');ledgerPages.rotation.y=0.15;
for(var rib=0;rib<4;rib++)mesh(new THREE.BoxGeometry(0.007,0.004,0.03),detail.material('#8a7a53','cloth'),0.498,1.054,-0.07+rib*0.08,counterG);''');mark(43)
t=replace(t,"mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.1, 10), new THREE.MeshStandardMaterial({ color: 0x2a4a3a, roughness: 0.5 }), -0.25, 1.075, 0.22, counterG);", "detail.lathe([[0,0],[0.03,0],[0.035,0.1],[0.031,0.1],[0.026,0.01],[0,0.01]],detail.material('#3e5445','glaze'),-0.25,1.025,0.22,counterG);detail.arc(counterG,0.033,0.0014,detail.material('#666a52','glaze'),-0.25,1.125,0.22);");mark(44)
t=replace(t,'// his chair, high and old', '''// The lens edge is slightly green; the grip has turned bands and a worn end.
detail.arc(magG,0.046,0.001,detail.glass,0,0.007,0);
for(var grip=0;grip<4;grip++){var band=mesh(new THREE.CylinderGeometry(0.0105,0.0105,0.003,12),detail.material('#826648','metal'),0.07+grip*0.018,0.006,0,magG);band.rotation.z=Math.PI/2;}
// his chair, high and old''');mark(45)
needle="mesh(new THREE.BoxGeometry(0.3, 0.1, 0.22), new THREE.MeshStandardMaterial({ color: 0x8a6a40, roughness: 0.98 }), -0.75, 1.08, 0.2, counterG);"
t=replace(t,needle,'''var parcel=mesh(new THREE.BoxGeometry(0.3,0.1,0.22),detail.material('#987d54','paper'),-0.75,1.08,0.2,counterG);
var stringMat=detail.material('#b5a17b','cloth');
detail.wire([[-0.9,1.134,0.2],[-0.75,1.134,0.2],[-0.6,1.134,0.2],[-0.598,1.03,0.2]],0.0014,stringMat,counterG);
detail.wire([[-0.75,1.03,0.088],[-0.75,1.134,0.088],[-0.75,1.134,0.31],[-0.75,1.03,0.312]],0.0014,stringMat,counterG);
mesh(new THREE.BoxGeometry(0.001,0.07,0.12),detail.material('#6b583d','paper'),-0.901,1.08,0.2,counterG);
''');mark(46)
needle="mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.07, 14), new THREE.MeshStandardMaterial({ color: 0xf0f0e8, roughness: 0.3 }), 0.85, 1.06, -0.25, counterG);"
t=replace(t,needle,'''detail.lathe([[0,0],[0.026,0],[0.03,0.012],[0.035,0.07],[0.031,0.07],[0.026,0.015],[0,0.015]],detail.material('#d6cfb9','glaze'),0.85,1.025,-0.25,counterG);
var cupHandle=mesh(new THREE.TorusGeometry(0.022,0.004,8,20,Math.PI*1.5),detail.material('#d6cfb9','glaze'),0.882,1.064,-0.25,counterG);cupHandle.rotation.z=-Math.PI*0.75;
detail.arc(counterG,0.0305,0.0008,detail.material('#8d744b','glaze'),0.85,1.086,-0.25);
''');mark(47)
t=replace(t,'var counterHit =', '''var specMetal=detail.material('#8b7954','metal');
detail.wire([[0.57,1.425,-D/2+1.1],[0.575,1.43,-D/2+1.1],[0.58,1.425,-D/2+1.1]],0.0012,specMetal);
[0.53,0.62].forEach(function(x){detail.wire([[x,1.42,-D/2+1.1],[x,1.418,-D/2+1.06],[x+0.02,1.415,-D/2+1.03]],0.0012,specMetal);});
var counterHit =''');mark(48)
needle='var bell = mesh(new THREE.CylinderGeometry(0.03, 0.07, 0.08, 14, 1, true), M.brass.clone(), 0, -0.4, 0.16, bellG); bell.material.side = THREE.DoubleSide;'
t=replace(t,needle,"var bell=detail.lathe([[0.007,0.04],[0.018,0.038],[0.022,0.025],[0.03,0.005],[0.047,-0.025],[0.067,-0.04],[0.068,-0.045],[0.061,-0.045],[0.04,-0.023],[0.025,0.01],[0.015,0.03]],detail.material('#a58c52','metal'),0,-0.4,0.16,bellG);bell.material.side=THREE.DoubleSide;detail.arc(bellG,0.064,0.0025,M.brass,0,-0.443,0.16);mesh(new THREE.CylinderGeometry(0.002,0.002,0.05,8),M.brass,0,-0.415,0.16,bellG);");mark(49)
t=replace(t,'b.castShadow = true; y += h;', '''b.castShadow = true;
var page=mesh(new THREE.BoxGeometry(w*0.95,h*0.72,d*0.96),detail.material('#c3b697','paper'),b.position.x,b.position.y,b.position.z+0.004,g);page.rotation.y=b.rotation.y;
[-1,1].forEach(function(side){var cover=mesh(new THREE.BoxGeometry(w+0.005,0.003,d+0.005),b.material,b.position.x,b.position.y+side*h*0.46,b.position.z,g);cover.rotation.y=b.rotation.y;});b.visible=false;
y += h;''');mark(50)
save(s,a,b,t);print('Bookshop: 10 completed')
