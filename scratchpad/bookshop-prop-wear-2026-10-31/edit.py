from pathlib import Path
p=Path('Dream Street Shuffle.twee');s=p.read_text();out=Path('scratchpad/bookshop-prop-wear-2026-10-31')
out.joinpath('source-before.twee').write_text(s)
todo=out/'TODO.md'
def done(label):todo.write_text(todo.read_text().replace('- [ ] '+label,'- [x] '+label))
a=s.index('var pageTex =',s.index("// ====== INSIDE O'FLATTERLY'S"));b=s.index('var ledger =',a)
s=s[:a]+'''// Softened leather, rubbed corners, foxed paper and a dark handled gutter.
var pageTex = tex(256, 320, function(cx,w,h){
cx.fillStyle='#d8c69b';cx.fillRect(0,0,w,h);
var edge=cx.createLinearGradient(0,0,w,0);edge.addColorStop(0,'#756040');edge.addColorStop(.12,'#d0b987');edge.addColorStop(.48,'#e7d7ad');edge.addColorStop(1,'#ad8d5c');cx.fillStyle=edge;cx.fillRect(0,0,w,h);
for(var i=0;i<210;i++){var x=rnd(i+91)*w,y=rnd(i+271)*h;cx.fillStyle='rgba(115,66,25,'+(.035+rnd(i+36)*.12)+')';cx.beginPath();cx.ellipse(x,y,.7+rnd(i+2)*3,.7+rnd(i+3)*2,0,0,6.3);cx.fill();}
cx.fillStyle='#65513a';for(var l=0;l<24;l++){cx.globalAlpha=.45+rnd(l+9)*.3;cx.fillRect(25,26+l*10,135+rnd(l+31)*61,.7+rnd(l)*.8);}cx.globalAlpha=1;
cx.strokeStyle='rgba(108,70,32,.32)';cx.lineWidth=1;cx.beginPath();cx.moveTo(w-38,0);cx.lineTo(w-2,36);cx.stroke();
cx.fillStyle='rgba(107,71,36,.15)';cx.beginPath();cx.ellipse(w-21,h*.67,13,30,-.25,0,6.3);cx.fill();
});
var bookLeather=tex(256,128,function(cx,w,h){cx.fillStyle='#482c22';cx.fillRect(0,0,w,h);for(var i=0;i<550;i++){cx.fillStyle=i%4?'rgba(171,121,75,.19)':'rgba(17,10,8,.28)';cx.fillRect(rnd(i+7)*w,rnd(i+9)*h,1+rnd(i)*8,.5+rnd(i+12)*2);}cx.strokeStyle='#a17d4c';cx.globalAlpha=.5;cx.strokeRect(7,7,w-14,h-14);cx.strokeRect(11,11,w-22,h-22);cx.globalAlpha=1;});
var pageEdgeTex=tex(128,128,function(cx,w,h){cx.fillStyle='#c4aa7c';cx.fillRect(0,0,w,h);for(var i=0;i<42;i++){cx.strokeStyle=i%5?'rgba(93,69,42,.28)':'rgba(242,220,174,.6)';cx.beginPath();cx.moveTo(0,i*3);cx.lineTo(w,i*3+Math.sin(i)*1.5);cx.stroke();}});
[-.11,.11].forEach(function(px,i){var pg=mesh(new THREE.BoxGeometry(.2,.025,.28),new THREE.MeshStandardMaterial({map:pageEdgeTex,roughness:1}),px,.01,0,openBook);pg.rotation.z=i?-.06:.06;
var paperGeo=new THREE.PlaneGeometry(.18,.26,12,16),pa=paperGeo.getAttribute('position');for(var v=0;v<pa.count;v++){var x=pa.getX(v),y=pa.getY(v);pa.setZ(v,.002*Math.sin(x*28)+.005*Math.pow(Math.max(0,(y+.07)/.2),4)*Math.pow(Math.abs(x)/.09,3));}paperGeo.computeVertexNormals();
var face=mesh(paperGeo,new THREE.MeshStandardMaterial({map:pageTex,roughness:1,side:THREE.DoubleSide}),px,.027,0,openBook);face.rotation.x=-Math.PI/2;face.rotation.z=i?Math.PI:0;
});
mesh(new THREE.BoxGeometry(.445,.014,.305),new THREE.MeshStandardMaterial({map:bookLeather,bumpMap:bookLeather,bumpScale:.0012,roughness:.91}),0,-.006,0,openBook);
// A faded ribbon has slipped out from the pages.
var bookmark=mesh(new THREE.PlaneGeometry(.012,.12),new THREE.MeshStandardMaterial({color:0x63423c,roughness:1,side:THREE.DoubleSide}),.025,.006,.169,openBook);bookmark.rotation.x=-Math.PI/2;bookmark.rotation.z=.12;
''' +s[b:];p.write_text(s);done('Make the open counter book more used-looking.')
a=s.index('// 2026-10-30 (Sam): pastel blue seas');b=s.index('var globeHit =',a)
s=s[:a]+'''// Faded pink/green printed land on blue seas, with old varnish and worn paper gores.
var globeTex=tex(1024,512,function(cx,w,h){
cx.fillStyle='#628e9c';cx.fillRect(0,0,w,h);
var lands=[[[.08,.20],[.14,.13],[.23,.16],[.28,.24],[.25,.32],[.20,.36],[.19,.46],[.15,.38],[.12,.28]],[[.23,.46],[.29,.48],[.32,.57],[.29,.68],[.25,.80],[.23,.72],[.24,.61],[.21,.53]],[[.43,.27],[.48,.21],[.52,.25],[.54,.31],[.51,.35],[.48,.32]],[[.45,.36],[.53,.34],[.58,.43],[.56,.55],[.52,.68],[.48,.62],[.47,.51],[.43,.43]],[[.53,.24],[.60,.15],[.72,.17],[.82,.24],[.85,.31],[.77,.34],[.73,.43],[.67,.39],[.63,.46],[.60,.35],[.55,.33]],[[.76,.64],[.83,.61],[.88,.69],[.86,.76],[.78,.75]],[[.31,.12],[.35,.08],[.38,.14],[.34,.22]]];
lands.forEach(function(points,i){cx.beginPath();points.forEach(function(q,j){var x=q[0]*w,y=q[1]*h;if(j)cx.lineTo(x,y);else cx.moveTo(x,y);});cx.closePath();cx.fillStyle=i%2?'#b79b9e':'#8ca586';cx.fill();cx.strokeStyle='#4f685b';cx.lineWidth=1.4;cx.stroke();cx.save();cx.clip();for(var n=0;n<110;n++){cx.strokeStyle=n%2?'rgba(54,69,42,.22)':'rgba(239,218,162,.25)';var x=rnd(n+i*101)*w,y=rnd(n*3+i)*h;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+6,y-4);cx.lineTo(x+11,y);cx.stroke();}cx.restore();});
cx.strokeStyle='rgba(41,64,64,.42)';cx.lineWidth=1;for(var x=0;x<=w;x+=w/24){cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,h);cx.stroke();}for(var y=0;y<h;y+=h/12){cx.beginPath();cx.moveTo(0,y);cx.lineTo(w,y);cx.stroke();}
// Printed paper gores, small rubbed patches and darkened varnish.
for(var gore=0;gore<12;gore++){cx.strokeStyle='rgba(77,61,37,.26)';cx.lineWidth=2;cx.beginPath();cx.moveTo(gore*w/12,0);cx.quadraticCurveTo(gore*w/12+9,h/2,gore*w/12,h);cx.stroke();}
for(var n=0;n<180;n++){var x=rnd(n+14)*w,y=rnd(n+61)*h,r=3+rnd(n+8)*23,gr=cx.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,n%3?'rgba(79,55,25,.13)':'rgba(229,207,153,.26)');gr.addColorStop(1,'rgba(110,82,41,0)');cx.fillStyle=gr;cx.fillRect(x-r,y-r,2*r,2*r);}
cx.strokeStyle='rgba(226,204,152,.32)';cx.lineWidth=.7;for(var j=0;j<110;j++){var x=rnd(j+7)*w,y=rnd(j+18)*h;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+4+rnd(j+23)*17,y+1);cx.stroke();}
});
var globe=mesh(new THREE.SphereGeometry(.3,48,32),new THREE.MeshStandardMaterial({map:globeTex,bumpMap:globeTex,bumpScale:.0012,roughness:.77,envMap:k.roomEnv,envMapIntensity:.16}),0,1.22,0,globeG);globe.rotation.z=.4;
var globeBrass=new THREE.MeshStandardMaterial({color:0x8c7849,metalness:.65,roughness:.69});
var meridian=mesh(new THREE.TorusGeometry(.34,.009,10,64,Math.PI),globeBrass,0,1.22,0,globeG);meridian.rotation.z=Math.PI/2+.4;
for(var tick=0;tick<=24;tick++){var angle=tick*Math.PI/24;var m=mesh(new THREE.BoxGeometry(.0015,tick%3?.009:.015,.002),globeBrass,Math.cos(angle)*.34,1.22+Math.sin(angle)*.34,.01,globeG);m.rotation.z=angle-Math.PI/2;}
''' +s[b:];p.write_text(s);done('Make globe more legible and aged, retaining pink/blue/green palette.')
# Shared potion helper: surface wear, cork pores, cloudy glass, old labels and sediment.
a=s.index('window.dssPotion =');b=s.index('\n};',a)+3;block=s[a:b]
block=block.replace('  var glass =', '''  g.name='aged-apothecary-'+kind;
  function painted(fn){var c=document.createElement('canvas');c.width=c.height=128;fn(c.getContext('2d'));return new THREE.CanvasTexture(c);}
  var wear=painted(function(cx){cx.fillStyle='#b4b4b4';cx.fillRect(0,0,128,128);for(var i=0;i<220;i++){cx.fillStyle=i%3?'rgba(40,40,40,.22)':'rgba(245,245,245,.3)';cx.fillRect((i*47.31)%128,(i*29.7)%128,.8+i%2,2+i%9);}cx.strokeStyle='#e4e4e4';cx.lineWidth=1;for(var j=0;j<12;j++){cx.beginPath();cx.moveTo(j*11,0);cx.lineTo(j*11-4,128);cx.stroke();}});
  var glass =''')
block=block.replace('color: 0xf2f6f4, roughness: 0.05','color: 0xc5d5c4, roughness: 0.19, roughnessMap:wear, bumpMap:wear, bumpScale:0.00022').replace('opacity: 0.26, clearcoat: 1','opacity: 0.34, clearcoat: 0.7').replace('envMapIntensity: 1.1','envMapIntensity: 0.85').replace('emissiveIntensity: 0.45','emissiveIntensity: 0.18').replace('color: 0x8a6440, roughness: 0.95','color: 0x8a6440, map:wear, bumpMap:wear, bumpScale:0.0007, roughness: 0.98')
block=block.replace('  return g;', '''  var radius=0;P.forEach(function(p){if(p[1]<=lv)radius=Math.max(radius,p[0]);});
  // Curved worn labels, with decorative ink marks rather than new story text.
  var label=painted(function(cx){cx.clearRect(0,0,128,128);cx.fillStyle='#bfac7f';cx.beginPath();cx.moveTo(8,13);cx.lineTo(116,8);cx.lineTo(121,106);cx.lineTo(105,118);cx.lineTo(9,113);cx.lineTo(5,79);cx.closePath();cx.fill();cx.strokeStyle='#78643f';cx.lineWidth=2;cx.strokeRect(16,20,94,82);cx.beginPath();cx.arc(64,49,15,0,Math.PI*2);cx.moveTo(50,61);cx.lineTo(64,30);cx.lineTo(78,61);cx.closePath();cx.stroke();for(var i=0;i<4;i++){cx.fillStyle='rgba(70,51,30,'+(.45+i*.08)+')';cx.fillRect(27,76+i*5,67-i*8,1);}for(var n=0;n<85;n++){cx.fillStyle=n%2?'rgba(79,49,20,.18)':'rgba(229,209,161,.4)';cx.fillRect((n*39.7)%128,(n*17.3)%128,1+n%5,1+n%3);}});
  var paper=new THREE.Mesh(new THREE.CylinderGeometry(radius*1.015,radius*1.015,top*.29,18,1,true,-.8,1.6),new THREE.MeshStandardMaterial({map:label,transparent:true,alphaTest:.15,roughness:1,side:THREE.DoubleSide,depthWrite:false}));paper.position.y=top*.34;paper.renderOrder=3;g.add(paper);
  var ring=new THREE.Mesh(new THREE.TorusGeometry(neck*1.04,.0018,6,20),new THREE.MeshStandardMaterial({color:0x827047,metalness:.45,roughness:.73}));ring.rotation.x=Math.PI/2;ring.position.y=top-.005;g.add(ring);
  var sediment=new THREE.Mesh(new THREE.CylinderGeometry(radius*.73,radius*.77,.005,18),new THREE.MeshStandardMaterial({color:col.clone().multiplyScalar(.32),roughness:.92}));sediment.position.y=.008;g.add(sediment);
  var meniscus=new THREE.Mesh(new THREE.TorusGeometry(inner[inner.length-2].x*.97,.0014,5,20),new THREE.MeshStandardMaterial({color:col,roughness:.34,transparent:true,opacity:.65}));meniscus.rotation.x=Math.PI/2;meniscus.position.y=lv;meniscus.renderOrder=1;g.add(meniscus);
  return g;''')
s=s[:a]+block+s[b:];p.write_text(s);done('Weather and detail the potions/bottles.')
