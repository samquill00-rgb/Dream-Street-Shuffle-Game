// 2026-10-28: bold drawn surfaces, deliberately stylised rather than photographic.
// Room-owned canvases only; no extra meshes, lights, textures or frame work.
window.dssInteriorSurface = function(t, kind, seed) {
if (!t || !t.image || !t.image.getContext) return t;
var c=t.image, x=c.getContext('2d'), w=c.width, h=c.height;
var key='_dssSurface_'+kind; if(c[key]) return t; c[key]=true;
function r(n){var v=Math.sin(n*127.1+(seed||1)*311.7)*43758.5453;return v-Math.floor(v);}
function line(a,b,d,e,col,width){x.strokeStyle=col;x.lineWidth=width||1;x.beginPath();x.moveTo(a,b);x.lineTo(d,e);x.stroke();}
function patch(px,py,ww,hh,col){x.fillStyle=col;x.beginPath();x.moveTo(px,py+hh*.12);x.lineTo(px+ww*.72,py);x.lineTo(px+ww,py+hh*.24);x.lineTo(px+ww*.91,py+hh*.84);x.lineTo(px+ww*.24,py+hh);x.lineTo(px-ww*.08,py+hh*.62);x.closePath();x.fill();}
x.save();
if(kind==='wood' || kind==='boards' || kind==='bamboo') {
  if(kind==='bamboo'){x.translate(0,h);x.rotate(-Math.PI/2);var swap=w;w=h;h=swap;}
  if(kind!=='boards' || !c._dssSurface_wood){
  // Long ink-like ribbons and broad rubbed strokes read from the doorway.
  for(var i=0;i<90;i++){
    var yy=r(i+1700)*h,phase=r(i+30)*6.28,bend=2+r(i+80)*8;
    x.strokeStyle=i%3?'rgba(12,6,3,0.27)':'rgba(219,163,91,0.24)';x.lineWidth=1+r(i+9)*2.3;x.beginPath();
    for(var a=-8;a<=w+8;a+=8){var y=yy+Math.sin(a*.018+phase)*bend+Math.sin(a*.042+phase)*1.7;if(a===-8)x.moveTo(a,y);else x.lineTo(a,y);}x.stroke();
  }
  for(var i=0;i<18;i++){var px=r(i+330)*w,py=r(i+440)*h;line(px,py,px+18+r(i+550)*70,py,'rgba(231,179,108,0.16)',2+r(i)*4);}
  // A handful of drawn knots, elongated with the grain.
  for(var k=0;k<(kind==='bamboo'?0:3);k++){var px=(.16+r(k+77)*.68)*w,py=(.12+r(k+99)*.76)*h;
    for(var n=0;n<4;n++){x.strokeStyle=n%2?'rgba(214,153,80,0.25)':'rgba(17,8,3,0.35)';x.lineWidth=1.4;x.beginPath();x.ellipse(px,py,8+n*6,2+n*2,.04,0,6.283);x.stroke();}
  }
  }
  if(kind==='boards')for(var b=0;b<4;b++){
    var y=b*h/4,join=(0.18+r(b+9)*0.62)*w;
    x.fillStyle=b%2?'rgba(225,169,99,0.07)':'rgba(16,8,3,0.08)';x.fillRect(0,y,w,h/4);
    line(0,y,w,y,'rgba(10,6,3,0.68)',2.4);line(0,y+2,w,y+2,'rgba(227,178,111,0.29)',1);
    line(join,y,join,y+h/4,'rgba(10,6,3,0.6)',1.8);
    for(var n=0;n<2;n++){x.fillStyle='rgba(15,9,5,0.6)';x.beginPath();x.arc(join+(n?5:-5),y+8,1.4,0,6.283);x.fill();}
  }
} else if(kind==='plaster' || kind==='stone') {
  // Angular washes and scumbled chips: visible painted texture, not camera grain.
  for(var i=0;i<140;i++){var px=r(i+120)*w,py=r(i+720)*h,sz=5+r(i+90)*25;
    patch(px,py,sz*(1+r(i+180)),sz*.55,i%3?'rgba(17,12,8,0.12)':'rgba(244,225,186,0.15)');
  }
  for(var i=0;i<300;i++){var px=r(i)*w,py=r(i+2300)*h;
    x.fillStyle=i%3?'rgba(17,12,8,0.15)':'rgba(244,230,203,0.19)';x.fillRect(px,py,1+r(i+700)*4,1+r(i+900)*2.5);
  }
  if(kind==='stone')for(var i=0;i<34;i++){var px=r(i+80)*w,py=r(i+180)*h;line(px,py,px+5+r(i+400)*18,py+2,'rgba(23,19,14,0.25)',1.2);line(px,py+2,px+7+r(i+400)*18,py+4,'rgba(224,209,177,0.16)',1);}
} else if(kind==='cloth' || kind==='carpet') {
  for(var y=1;y<h;y+=4)line(0,y,w,y,'rgba(225,192,158,0.16)',1.2);
  for(var a=1;a<w;a+=5)line(a,0,a,h,'rgba(8,5,5,0.24)',1.3);
  if(kind==='carpet'){
    // Faded small lozenges, woven into the existing room-coloured pile.
    var step=64;
    for(var row=-1;row<h/step+1;row++)for(var col=-1;col<w/step+1;col++){
      var px=col*step+(row%2)*step/2,py=row*step;
      x.strokeStyle='rgba(188,140,83,0.27)';x.lineWidth=2;x.beginPath();x.moveTo(px,py-23);x.lineTo(px+17,py);x.lineTo(px,py+23);x.lineTo(px-17,py);x.closePath();x.stroke();
      x.fillStyle='rgba(17,8,7,0.25)';x.fillRect(px-3,py-3,6,6);
    }
  }
  for(var i=0;i<260;i++){x.fillStyle=i%2?'rgba(238,206,176,0.17)':'rgba(9,5,4,0.18)';x.fillRect(r(i)*w,r(i+400)*h,1.2,2.8);}
} else if(kind==='tile' || kind==='lino') {
  // Larger enamel/aggregate flecks and broad irregular rubbed marks.
  for(var i=0;i<230;i++){var px=r(i)*w,py=r(i+500)*h;
    patch(px,py,2+r(i+800)*5,1+r(i+900)*3,i%3?'rgba(53,44,32,0.16)':'rgba(247,230,191,0.23)');
  }
  if(kind==='lino')for(var i=0;i<24;i++){x.strokeStyle='rgba(12,10,9,0.23)';x.lineWidth=2.3;x.beginPath();x.ellipse(r(i+33)*w,r(i+66)*h,6+r(i+44)*12,3+r(i+77)*5,r(i)*3,.2,2.1);x.stroke();}
} else if(kind==='metal') {
  for(var i=0;i<60;i++){var y=r(i)*h;line(r(i+200)*w,y,w,y,i%3?'rgba(229,208,161,0.2)':'rgba(24,18,11,0.25)',1+r(i+90)*2);}
  for(var i=0;i<26;i++)patch(r(i+9)*w,r(i+30)*h,7+r(i+80)*22,3+r(i+100)*7,'rgba(45,37,22,0.14)');
}
x.restore();t.needsUpdate=true;return t;
};
window.dssHandledPhoneMaterials=function(tex,env){
 var shellRough=tex(256,128,function(c,w,h){c.fillStyle='#a0a0a0';c.fillRect(0,0,w,h);for(var n=0;n<360;n++){c.strokeStyle=n%4?'rgba(234,234,234,0.23)':'rgba(48,48,48,0.2)';c.lineWidth=0.5;c.beginPath();var x=n*47%w,y=n*71%h;c.moveTo(x,y);c.lineTo(x+2+n%9,y-1-n%3);c.stroke();}var g=c.createRadialGradient(157,70,4,157,70,55);g.addColorStop(0,'rgba(48,48,48,0.35)');g.addColorStop(1,'rgba(48,48,48,0)');c.fillStyle=g;c.fillRect(90,10,130,118);});
 var gripRough=tex(256,128,function(c,w,h){c.fillStyle='#858585';c.fillRect(0,0,w,h);var g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,'rgba(36,36,36,0)');g.addColorStop(0.25,'rgba(36,36,36,0.75)');g.addColorStop(0.72,'rgba(36,36,36,0.75)');g.addColorStop(1,'rgba(36,36,36,0)');c.fillStyle=g;c.fillRect(0,0,w,h);for(var n=0;n<95;n++){c.strokeStyle='rgba(211,211,211,0.28)';c.lineWidth=0.5;c.beginPath();var x=n*61%w,y=n*43%h;c.moveTo(x,y);c.lineTo(x+3+n%8,y+1);c.stroke();}});
 var metalRough=tex(128,128,function(c,w,h){c.fillStyle='#999999';c.fillRect(0,0,w,h);for(var n=0;n<120;n++){c.strokeStyle='rgba(224,224,224,0.22)';c.lineWidth=0.5;c.beginPath();c.moveTo(0,n*31%h);c.lineTo(w,n*31%h+2);c.stroke();}});
 shellRough.encoding=gripRough.encoding=metalRough.encoding=THREE.LinearEncoding;
 return {shell:new THREE.MeshStandardMaterial({color:0x191511,roughness:0.65,roughnessMap:shellRough,metalness:0.04,envMap:env,envMapIntensity:0.55}),grip:new THREE.MeshStandardMaterial({color:0x17130f,roughness:0.55,roughnessMap:gripRough,metalness:0.04,envMap:env,envMapIntensity:0.65}),metal:new THREE.MeshStandardMaterial({color:0x9a9384,roughness:0.67,roughnessMap:metalRough,metalness:0.65,envMap:env,envMapIntensity:0.4}),touchMetal:new THREE.MeshStandardMaterial({color:0xb1aa98,roughness:0.31,metalness:0.65,envMap:env,envMapIntensity:0.4})};
};

window.dssOrangePaperbackCover = function() {
  var c = document.createElement('canvas'); c.width = 512; c.height = 768;
  var x = c.getContext('2d');
  x.fillStyle = '#d8641c'; x.fillRect(0, 0, 512, 768);
  x.fillStyle = '#a84416'; x.fillRect(0, 0, 22, 768);
  x.strokeStyle = '#f4dfac'; x.lineWidth = 3; x.strokeRect(38, 28, 444, 710);
  x.fillStyle = '#fff0cf'; x.textAlign = 'center';
  x.font = 'bold 64px Georgia'; x.fillText('CHARIOTS', 260, 114);
  x.font = 'bold 44px Georgia'; x.fillText('OF THE', 260, 170);
  x.font = 'bold 78px Georgia'; x.fillText('GODS?', 260, 253);
  // Screen-printed saucer, stars and ancient stone silhouettes.
  x.strokeStyle = '#f4dfac'; x.lineWidth = 3;
  x.beginPath(); x.arc(260, 437, 139, 0, Math.PI * 2); x.stroke();
  x.fillStyle = '#352b26';
  x.beginPath(); x.ellipse(260, 406, 104, 23, -0.16, 0, Math.PI * 2); x.fill();
  x.beginPath(); x.ellipse(258, 391, 46, 29, -0.16, Math.PI, Math.PI * 2); x.fill();
  x.strokeStyle = '#fff0cf'; x.beginPath(); x.moveTo(174, 407); x.lineTo(338, 382); x.stroke();
  x.fillStyle = '#f4dfac';
  [[119,340],[386,319],[367,478],[155,476]].forEach(function(p) {
    x.fillRect(p[0]-5,p[1]-1,10,2); x.fillRect(p[0]-1,p[1]-5,2,10);
  });
  x.fillStyle = '#352b26'; x.beginPath();
  x.moveTo(57,638); x.lineTo(193,466); x.lineTo(321,638);
  x.lineTo(372,535); x.lineTo(467,638); x.closePath(); x.fill();
  x.fillStyle = '#7c391e'; x.beginPath(); x.moveTo(193,466); x.lineTo(221,638); x.lineTo(321,638); x.closePath(); x.fill();
  x.fillStyle = '#fff0cf'; x.font = '25px Georgia'; x.fillText('ERICH VON DÄNIKEN', 260, 701);
  // Restrained rubbed edges, deterministic so every copy matches.
  x.fillStyle = 'rgba(245,218,169,0.28)';
  for (var i=0;i<65;i++) x.fillRect(28+(i*73)%458, 731+(i%5), 3+i%9, 1);
  var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
  t.anisotropy = 4;
  return new THREE.MeshStandardMaterial({map:t, roughness:0.86});
};
window.dssDetailProps=function(mesh,tex,env,scene){
 var cache={};
 function material(color,kind){var key=color+'|'+kind;if(cache[key])return cache[key];
 var map=tex(128,128,function(c,w,h){c.fillStyle=color;c.fillRect(0,0,w,h);
 for(var i=0;i<650;i++){c.fillStyle=i%4?'rgba(235,225,202,0.09)':'rgba(22,20,16,0.1)';c.fillRect((i*47)%w,(i*71)%h,kind==='cloth'?1:1+i%4,1);}
 if(kind==='cloth')for(var y=0;y<h;y+=3){c.fillStyle='rgba(0,0,0,0.07)';c.fillRect(0,y,w,1);}
 if(kind==='paper')for(var y=3;y<h;y+=9){c.fillStyle='rgba(92,76,47,0.16)';c.fillRect(0,y,w,1);}
 });
 return cache[key]=new THREE.MeshStandardMaterial({map:map,roughness:kind==='metal'?0.55:kind==='glaze'?0.3:0.92,metalness:kind==='metal'?0.65:0,envMap:env,envMapIntensity:kind==='metal'?0.35:0.12});}
 function add(g,m,x,y,z,p){return mesh(g,m,x,y,z,p||scene);}
 function arc(p,r,t,m,x,y,z,span,turn){var o=add(new THREE.TorusGeometry(r,t,6,28,span||Math.PI*2),m,x,y,z,p);o.rotation.x=Math.PI/2;o.rotation.z=turn||0;return o;}
 function lathe(points,m,x,y,z,p,segments){return add(new THREE.LatheGeometry(points.map(function(v){return new THREE.Vector2(v[0],v[1]);}),segments||28),m,x,y,z,p);}
 function group(x,y,z,p){var g=new THREE.Group();g.position.set(x,y,z);(p||scene).add(g);return g;}
 function wire(points,r,m,p){return add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(function(v){return new THREE.Vector3(v[0],v[1],v[2]);})),Math.max(12,points.length*4),r,5,false),m,0,0,0,p);}
 var glass=new THREE.MeshPhysicalMaterial({color:0xdce4d9,roughness:0.13,metalness:0,envMap:env,envMapIntensity:0.7,clearcoat:0.5,transparent:true,opacity:0.12,depthWrite:false,side:THREE.DoubleSide});
 var edgeGlass=glass.clone();edgeGlass.opacity=0.26;edgeGlass.roughness=0.22;
 function cup(p,r,h,handled){var b=r*0.85,cupGlass=glass;
 // Selected used glasses: the untouched areas remain clear; washing scuffs alter the reflections.
 if(handled){if(!cache.handledGlass){var rough=tex(256,256,function(c,w,hh){c.fillStyle='#303030';c.fillRect(0,0,w,hh);for(var n=0;n<170;n++){var x=n*47%w,y=n*71%hh;c.strokeStyle='rgba(204,204,204,0.3)';c.lineWidth=0.5;c.beginPath();c.moveTo(x,y);c.lineTo(x+2+n%7,y-1);c.stroke();}for(var n=0;n<4;n++){var y=hh-13-n*3;c.strokeStyle='rgba(178,178,178,0.25)';c.beginPath();c.moveTo(27+n*21,y);c.lineTo(100+n*28,y+1);c.stroke();}var g=c.createRadialGradient(187,137,4,187,137,30);g.addColorStop(0,'rgba(149,149,149,0.28)');g.addColorStop(1,'rgba(149,149,149,0)');c.fillStyle=g;c.fillRect(150,100,74,74);});rough.encoding=THREE.LinearEncoding;var used=glass.clone();used.roughness=0.65;used.roughnessMap=rough;cache.handledGlass=used;
 var traces=tex(256,256,function(c,w,hh){c.clearRect(0,0,w,hh);for(var n=0;n<5;n++){c.strokeStyle='rgba(220,217,202,0.14)';c.lineWidth=0.7;c.beginPath();c.moveTo(20+n*37,hh-12-n%3);c.lineTo(43+n*37,hh-13-n%3);c.stroke();}for(var n=0;n<5;n++){c.strokeStyle='rgba(220,217,206,0.08)';c.lineWidth=0.65;c.beginPath();c.ellipse(187,137,7+n*3,10+n*4,-0.4,0.2,4.6);c.stroke();}});cache.glassTraces=new THREE.MeshStandardMaterial({map:traces,transparent:true,opacity:0.28,roughness:0.9,depthWrite:false});}
 cupGlass=cache.handledGlass;lathe([[b+0.00022,0.008],[r+0.00022,h-0.001]],cache.glassTraces,0,0,0,p);}
 lathe([[0,0],[b,0],[b,0.008],[r,h-0.001],[r-0.0012,h],[b-0.0012,0.009],[0,0.009]],cupGlass,0,0,0,p);arc(p,r-0.0006,0.0007,edgeGlass,0,h,0);add(new THREE.CylinderGeometry(b,b,0.005,28),edgeGlass,0,0.003,0,p);}
 // 2026-10-24: selected prop wear — accumulated ash, tar and scorched cigarette rests.
 function ash(x,y,z,p,r){r=r||0.05;var g=group(x,y,z,p),m=material('#77796b','glaze').clone();m.roughness=0.57;
 lathe([[0,0],[r*0.84,0],[r,0.006],[r,0.018],[r*0.91,0.021],[r*0.75,0.008],[0,0.008]],m,0,0,0,g);
 var bed=cache.ashBed;if(!bed){var bedTex=tex(256,256,function(c,w,h){c.clearRect(0,0,w,h);
 var haze=c.createRadialGradient(119,139,9,128,128,123);haze.addColorStop(0,'rgba(53,46,36,0.75)');haze.addColorStop(0.65,'rgba(91,76,53,0.48)');haze.addColorStop(1,'rgba(97,75,43,0)');c.fillStyle=haze;c.fillRect(0,0,w,h);
 for(var n=0;n<1100;n++){var a=n*2.39996,d=Math.sqrt((n*67%1103)/1103)*115;c.fillStyle=['rgba(34,31,26,0.7)','rgba(177,169,147,0.65)','rgba(118,112,99,0.7)','rgba(209,202,180,0.42)'][n%4];c.fillRect(128+Math.cos(a)*d,128+Math.sin(a)*d,1+n%5,1+n%3);}
 for(var n=0;n<4;n++){var a=n*1.7+0.3,px=128+Math.cos(a)*64,py=128+Math.sin(a)*64,sm=c.createRadialGradient(px,py,1,px,py,24);sm.addColorStop(0,'rgba(32,24,17,0.82)');sm.addColorStop(1,'rgba(57,39,21,0)');c.fillStyle=sm;c.fillRect(px-24,py-24,48,48);}});bed=cache.ashBed=new THREE.MeshStandardMaterial({map:bedTex,transparent:true,roughness:1,depthWrite:false});}
 var ashFloor=add(new THREE.CircleGeometry(r*0.74,28),bed,0,0.0086,0,g);ashFloor.rotation.x=-Math.PI/2;
 var rim=cache.ashRim;if(!rim){var rimTex=tex(256,256,function(c,w,h){c.clearRect(0,0,w,h);for(var n=0;n<4;n++){var a=n*Math.PI/2+0.2;c.save();c.translate(128+Math.cos(a)*119,128+Math.sin(a)*119);c.rotate(a);var stain=c.createRadialGradient(0,0,1,0,0,17);stain.addColorStop(0,'rgba(63,37,15,0.8)');stain.addColorStop(1,'rgba(82,53,24,0)');c.fillStyle=stain;c.fillRect(-19,-19,38,38);c.restore();}c.fillStyle='rgba(194,185,155,0.75)';for(var n=0;n<9;n++){var a=n*2.4;c.fillRect(128+Math.cos(a)*124,128+Math.sin(a)*124,2+n%3,2);}});rim=cache.ashRim=new THREE.MeshStandardMaterial({map:rimTex,transparent:true,roughness:0.9,depthWrite:false});}
 var lipGeo=new THREE.RingGeometry(r*0.91,r,36),lipPos=lipGeo.attributes.position;for(var v=0;v<lipPos.count;v++){var dist=Math.hypot(lipPos.getX(v),lipPos.getY(v));lipPos.setZ(v,-0.003*Math.max(0,Math.min(1,(dist/r-0.91)/0.09)));}lipGeo.computeVertexNormals();
 var ashLip=add(lipGeo,rim,0,0.0213,0,g);ashLip.rotation.x=-Math.PI/2;
 var dust=material('#a69e8b','ash'),filter=material('#a27b49','paper'),paper=material('#cfc7b3','paper');
 for(var i=0;i<3;i++){var e=group((i-1)*r*0.48,0.011,(i%2-0.5)*r*0.32,g);e.rotation.y=i*2.3;
 var b=add(new THREE.CylinderGeometry(0.003,0.0032,0.015,8),paper,0,0,0,e);b.rotation.z=Math.PI/2;
 b=add(new THREE.CylinderGeometry(0.0032,0.0032,0.008,8),filter,-0.011,0,0,e);b.rotation.z=Math.PI/2;
 var burnt=add(new THREE.SphereGeometry(0.0031,6,5),material('#39332b','paper'),0.008,0,0,e);burnt.scale.set(0.6,0.85,1);}
 var crumbGeo=new THREE.SphereGeometry(0.001,5,4),crumbs=new THREE.InstancedMesh(crumbGeo,dust,38),crumbPose=new THREE.Object3D();
 for(var i=0;i<38;i++){var a=i*2.4,d=(i*7%41)/41*r*0.66;crumbPose.position.set(Math.cos(a)*d,0.0094,Math.sin(a)*d);crumbPose.scale.set(1+i%4*0.6,0.35+i%3*0.12,1+i%3*0.4);crumbPose.updateMatrix();crumbs.setMatrixAt(i,crumbPose.matrix);}crumbs.instanceMatrix.needsUpdate=true;g.add(crumbs);return g;}
 function paperBlock(w,h,d,x,y,z,p,color){var g=group(x,y,z,p),paper=material('#d3c9ac','paper'),cover=material(color||'#43382b','cloth');
 add(new THREE.BoxGeometry(w,h,d),paper,0,h/2,0,g);
 add(new THREE.BoxGeometry(w+0.008,0.003,d+0.008),cover,0,0,0,g);add(new THREE.BoxGeometry(w+0.008,0.003,d+0.008),cover,0,h,0,g);
 add(new THREE.BoxGeometry(0.006,h,d+0.008),cover,-w/2,h/2,0,g);return g;}
 function bottle(g,h,r,col,seed){seed=Math.abs(seed|0)%4;var bm=new THREE.MeshPhysicalMaterial({color:col,roughness:0.23,metalness:0,envMap:env,envMapIntensity:0.65,clearcoat:0.5,transparent:true,opacity:0.92});
 var sh=0.74+seed*0.045;lathe([[0,0],[r*0.85,0],[r,h*0.04],[r,h*sh],[r*0.8,h*(sh+0.08)],[r*0.32,h*1.04],[r*0.32,h*1.31],[r*0.38,h*1.33],[0,h*1.33]],bm,0,0,0,g);
 add(new THREE.CylinderGeometry(r*0.38,r*0.38,h*0.05,12),material(seed%2?'#6a593e':'#34332b','metal'),0,h*1.33,0,g);
 var key='label'+seed,lm=cache[key];if(!lm){var label=tex(128,128,function(c,w,h){c.fillStyle=['#c5b99b','#cfc4aa','#aaa68e','#b7a47f'][seed];c.fillRect(0,0,w,h);c.strokeStyle='#675a42';c.lineWidth=2;c.strokeRect(7,7,w-14,h-14);c.beginPath();c.ellipse(64,35,12,16,0,0,6.3);c.stroke();for(var n=0;n<5;n++)c.fillRect(24+n%2*8,65+n*8,80-n%2*16,2);for(var n=0;n<250;n++){c.fillStyle=n%3?'rgba(240,225,192,0.25)':'rgba(69,51,25,0.1)';c.fillRect(n*47%w,n*71%h,2,1);}});lm=cache[key]=new THREE.MeshStandardMaterial({map:label,roughness:0.94,side:THREE.DoubleSide});}
 // Local handling wear on the paper label, leaving its printed design readable; no extra mesh.
 if(!lm.userData.handledLabel){var lc=lm.map.image.getContext('2d'),lw=lm.map.image.width,lh=lm.map.image.height;
 var age=lc.createLinearGradient(0,0,0,lh);age.addColorStop(0,'rgba(102,73,32,0.25)');age.addColorStop(0.19,'rgba(102,73,32,0)');age.addColorStop(0.82,'rgba(73,57,33,0.04)');age.addColorStop(1,'rgba(73,57,33,0.3)');lc.fillStyle=age;lc.fillRect(0,0,lw,lh);
 var smudge=lc.createRadialGradient(20+seed*21,88,2,20+seed*21,88,26);smudge.addColorStop(0,'rgba(60,47,29,0.18)');smudge.addColorStop(1,'rgba(60,47,29,0)');lc.fillStyle=smudge;lc.fillRect(0,50,lw,78);
 for(var nick=0;nick<35;nick++){lc.fillStyle=nick%4?'rgba(223,209,172,0.8)':'rgba(109,87,52,0.35)';lc.fillRect((nick*47+seed*13)%lw,nick%2?lh-2-nick%5:nick%4,2+nick%6,1+nick%2);}lm.map.needsUpdate=true;lm.userData.handledLabel=true;}
 add(new THREE.CylinderGeometry(r*1.012,r*1.012,h*0.4,20,1,true,-1.35,2.7),lm,0,h*0.43,0,g);}
 function cloth(w,h,x,y,z,p,col,worn){var geo=new THREE.PlaneGeometry(w,h,14,12),pos=geo.attributes.position;for(var v=0;v<pos.count;v++){var px=pos.getX(v),py=pos.getY(v);pos.setZ(v,Math.sin(px/w*26+py*2)*w*0.018+Math.sin(py/h*9)*w*0.012);}geo.computeVertexNormals();var m=material(col||'#4a4537','cloth').clone();
 // Only the working bar towels get spill marks; tablecloths and the telephone cloth retain their own finish.
 if(worn){var key='used-towel|'+col;if(!cache[key])cache[key]=tex(256,256,function(c,tw,th){c.fillStyle=col||'#4a4537';c.fillRect(0,0,tw,th);for(var n=0;n<4;n++){var px=40+(n*79%169),py=39+(n*61%174),g=c.createRadialGradient(px,py,3,px,py,33+n*5);g.addColorStop(0,n%2?'rgba(49,39,23,0.39)':'rgba(99,64,29,0.34)');g.addColorStop(0.72,'rgba(67,47,26,0.13)');g.addColorStop(1,'rgba(67,47,26,0)');c.fillStyle=g;c.fillRect(px-60,py-60,120,120);}c.strokeStyle='rgba(66,47,28,0.24)';c.lineWidth=2;c.beginPath();c.ellipse(179,94,31,28,0.2,0.3,5.8);c.stroke();for(var q=0;q<tw;q+=3){c.fillStyle='rgba(229,222,198,0.09)';c.fillRect(q,0,1,th);c.fillStyle='rgba(16,19,18,0.1)';c.fillRect(0,q,tw,1);}for(var n=0;n<75;n++){c.fillStyle='rgba(225,214,183,0.2)';c.fillRect(n*47%tw,n%2?2:th-3,2+n%4,1);}});m.map=cache[key];m.roughness=1;}
 m.side=THREE.DoubleSide;return add(geo,m,x,y,z,p);}
 function button(p,x,y,z,r,col){var o=add(new THREE.SphereGeometry(1,10,6),material(col||'#8a7d63','metal'),x,y,z,p);o.scale.set(r,r*0.28,r);return o;}
 return {material:material,arc:arc,lathe:lathe,group:group,wire:wire,cup:cup,ash:ash,paperBlock:paperBlock,bottle:bottle,cloth:cloth,button:button,glass:glass};
};

// ====== INSIDE THE FRENCH — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-25. The first "look closer" scene, carried over from the
// Fagin's Den mechanism in the Oliver Twist files: hotspots in the 3D
// room, a hover halo, click and the camera pushes in on the thing and a
// caption card opens; click anywhere to step back. Built to Sam's photo
// of the French House bar (counter on the left, the photo wall at the
// back, the frieze of prints under the ceiling, the blue door on the
// right).
// 2026-09-26 (Sam: "you are already in the French; the clicks should
// give you different paths through it"): the room now sits at the top
// of The French passage itself (#fi-container there) and is its
// navigation. Every path stays a Harlowe link in the passage below,
// with its own gate; the room only finds those links in the rendered
// passage and clicks them. The bar opens the drink when the passage
// offers it; the telephone shows the call choices when it is ringing;
// the figures at the bar are the Stranger, the artists, the novelist
// and the sketch when their links exist. Nothing is decided in JS.
// The card's inspection words are pink placeholders for Sam.
(function() {
var fiActive = false;
var fiAnimId = null;

function initFrenchInside() {
if (fiActive) return;
fiActive = true;
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(buildFIScene) : buildFIScene()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(buildFIScene) : buildFIScene());
}
}

function buildFIScene() {
var fiStill = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var fiHost = document.getElementById('fi-container');
if (!fiHost) { fiActive = false; return; }
var fiWrap = document.createElement('div');
fiWrap.id = 'fi-wrap';
function fiSize() {
var w = Math.max(280, document.documentElement.clientWidth || window.innerWidth);
var vh = window.visualViewport ? window.visualViewport.height : window.innerHeight || 800;
// Measure the actual visible top, including the header, rather than summing nested offsets.
var top = Math.max(0, fiHost.getBoundingClientRect().top);
var h = Math.round(Math.max(180, vh - top - 12));
return { w: w, h: h };
}
var fiSz = fiSize();
// Full-bleed inside the passage column: as wide as the window, stacked below the header, the prose and links follow underneath.
fiWrap.style.cssText = 'position:relative;width:100vw;margin-left:calc(50% - 50vw);height:' + fiSz.h + 'px;z-index:0;isolation:isolate;background:#0a0705;overflow:hidden;';
var fiCanvas = document.createElement('canvas');
fiCanvas.width = fiSz.w;
fiCanvas.height = fiSz.h;
fiCanvas.style.cssText = 'display:block;position:absolute;top:0;left:0;width:100%;height:100%;touch-action:none;';
fiWrap.appendChild(fiCanvas);
var fiVig = document.createElement('div');
fiVig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:radial-gradient(ellipse at 46% 42%,transparent 26%,rgba(0,0,0,0.72) 100%);';
var fiWash = document.createElement('div');
fiWash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9000;background:linear-gradient(180deg,rgba(20,8,2,0.28) 0%,rgba(10,5,2,0.06) 35%,rgba(10,5,2,0.06) 60%,rgba(5,3,2,0.42) 100%);';
fiWrap.appendChild(fiWash);
fiWrap.appendChild(fiVig);
var fiGrain = document.createElement('div');
fiGrain.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9002;opacity:0.05;mix-blend-mode:overlay;background:url(' + (window.dssGetGrainURL ? window.dssGetGrainURL() : '') + ');';
fiWrap.appendChild(fiGrain);
var fiLoc = document.createElement('div');
fiLoc.classList.add('dss-room-caption');
fiLoc.textContent = 'THE FRENCH HOUSE, DEAN STREET';
fiLoc.style.cssText = 'position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font:12px \'Courier New\',monospace;color:rgba(200,180,140,0.25);letter-spacing:3px;white-space:nowrap;z-index:9003;pointer-events:none;';
fiWrap.appendChild(fiLoc);
fiHost.appendChild(fiWrap);
fiSz = fiSize(); fiWrap.style.height = fiSz.h + 'px';
// once the passage has settled (its fade-in moves it), size the room again
setTimeout(function() { var r = window._dssThreeRegistry && window._dssThreeRegistry['fi-wrap']; if (r && r.resize) r.resize(); }, 1600);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0705);
scene.fog = new THREE.FogExp2(0x120b06, 0.055);
var aspect = fiSz.w / fiSz.h;
var portrait = aspect < 1.4;
var camera = new THREE.PerspectiveCamera(portrait ? 86 : 68, aspect, 0.05, 60);
var CAM = portrait ? { x: 0.45, y: 1.6, z: 4.25, tx: 0, ty: 1.35, tz: -1.3 } : { x: 0.4, y: 1.6, z: 4.25, tx: 0, ty: 1.35, tz: -1.3 };
camera.position.set(CAM.x, CAM.y, CAM.z);

var renderer = new THREE.WebGLRenderer({ canvas: fiCanvas, antialias: true });
renderer.setSize(fiSz.w, fiSz.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, fiSz.w < 600 ? 1.25 : 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.64;
window._dssBindScene('fi-wrap', scene, renderer, camera);
var origResize = window._dssThreeRegistry['fi-wrap'].resize;
window._dssThreeRegistry['fi-wrap'].resize = function() {
fiSz = fiSize(); fiWrap.style.height = fiSz.h + 'px';
camera.aspect = fiSz.w / fiSz.h;
camera.fov = camera.aspect < 1.4 ? 86 : 68;
camera.updateProjectionMatrix();
renderer.setSize(fiSz.w, fiSz.h);
};
window.removeEventListener('resize', origResize);
window.addEventListener('resize', window._dssThreeRegistry['fi-wrap'].resize);
var composer = window.dssMakeComposer ? window.dssMakeComposer(scene, camera, renderer, { bloomStrength: 0.3, bloomRadius: 0.55, bloomThreshold: 0.72 }) : null;
if (composer) { composer.setSize(fiSz.w, fiSz.h); var fiResize = window._dssThreeRegistry['fi-wrap'].resize; window._dssThreeRegistry['fi-wrap'].resize = function() { fiResize(); composer.setSize(fiSz.w, fiSz.h); }; window.removeEventListener('resize', fiResize); window.addEventListener('resize', window._dssThreeRegistry['fi-wrap'].resize); }

function tex(w, h, fn) {
var c = document.createElement('canvas'); c.width = w; c.height = h;
var cx = c.getContext('2d'); fn(cx, w, h);
// Mipmaps keep fine ink and carpet threads from sparkling at phone size.
var t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearMipmapLinearFilter;
t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
return t;
}
function rnd(seed) { var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function mesh(geo, mat, x, y, z, parent) {
var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || scene).add(m); return m;
}
// The same layered grain, soot washes and warm varnish as the street scenes.
function woodTex(base, grain, seed) {
return window.dssInteriorSurface(tex(512, 512, function(cx, w, h) {
cx.fillStyle = base; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 420; i++) {
var y = rnd(seed + i * 7) * h, bend = 2 + rnd(i + seed * 5) * 11;
cx.strokeStyle = i % 5 ? grain : '#c28951'; cx.globalAlpha = 0.035 + rnd(i + seed) * 0.1;
cx.lineWidth = 0.4 + rnd(i * 3) * 1.2; cx.beginPath();
for (var x = 0; x <= w; x += 8) {
var yy = y + Math.sin(x * 0.009 + y * 0.018) * bend + Math.sin(x * 0.033 + y) * 0.8;
if (!x) cx.moveTo(x, yy); else cx.lineTo(x, yy);
} cx.stroke();
}
cx.globalAlpha = 1;
for (var n = 0; n < 12; n++) {
var xx = rnd(n + seed * 21) * w, yy = rnd(n + seed * 19) * h;
var g = cx.createRadialGradient(xx, yy, 0, xx, yy, 90);
g.addColorStop(0, 'rgba(14,6,2,0.19)'); g.addColorStop(1, 'rgba(14,6,2,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
}
// Fine scratches in old varnish, along rather than across the grain.
cx.strokeStyle = 'rgba(216,165,103,0.13)'; cx.lineWidth = 0.6;
for (var n = 0; n < 65; n++) { var xx = rnd(n * 9 + seed) * w, yy = rnd(n * 17) * h; cx.beginPath(); cx.moveTo(xx, yy); cx.lineTo(xx + 3 + rnd(n) * 48, yy + 0.3); cx.stroke(); }
}), 'wood', seed);
}
function paintTex(base, seed) {
return window.dssInteriorSurface(tex(512, 512, function(cx, w, h) {
cx.fillStyle = base; cx.fillRect(0, 0, w, h);
for (var n = 0; n < 28; n++) {
var x = rnd(n + seed) * w, y = rnd(n * 3 + seed) * h, r = 30 + rnd(n * 7) * 130;
var g = cx.createRadialGradient(x, y, 0, x, y, r);
g.addColorStop(0, n % 3 ? 'rgba(40,20,4,0.13)' : 'rgba(214,164,78,0.12)'); g.addColorStop(1, 'rgba(60,32,8,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
}
var soot = cx.createLinearGradient(0, 0, 0, h); soot.addColorStop(0, 'rgba(38,20,6,0.24)'); soot.addColorStop(0.3, 'rgba(38,20,6,0)'); soot.addColorStop(1, 'rgba(38,20,6,0.1)'); cx.fillStyle = soot; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 9000; i++) { cx.fillStyle = i % 2 ? 'rgba(20,12,4,0.045)' : 'rgba(236,213,169,0.05)'; cx.fillRect(rnd(i + seed) * w, rnd(i * 3 + seed) * h, 1, 1); }
}), 'plaster', seed);
}
// A small, entirely canvas-made room environment: amber ceiling, dark floor,
// cream panels and broad globe reflections. Shared by the varnish and metal.
var envFaces = [];
for (var ef = 0; ef < 6; ef++) {
var ec = document.createElement('canvas'); ec.width = ec.height = 128;
var ex = ec.getContext('2d'), eg = ex.createLinearGradient(0, 0, 0, 128);
eg.addColorStop(0, ef === 2 ? '#80603b' : '#665034'); eg.addColorStop(0.5, '#38291b'); eg.addColorStop(1, '#0e0906'); ex.fillStyle = eg; ex.fillRect(0, 0, 128, 128);
if (ef !== 3) {
for (var el = 0; el < 2; el++) {
var lx = 28 + el * 73, ly = ef === 2 ? 64 : 24;
var gl = ex.createRadialGradient(lx, ly, 0, lx, ly, 22); gl.addColorStop(0, '#fff0c9'); gl.addColorStop(0.14, '#dec28b'); gl.addColorStop(0.4, '#98713d'); gl.addColorStop(1, 'rgba(96,63,25,0)'); ex.fillStyle = gl; ex.fillRect(0, 0, 128, 128);
} ex.fillStyle = 'rgba(188,162,112,0.16)'; ex.fillRect(4, 76, 120, 13);
} envFaces.push(ec);
}
var roomEnv = new THREE.CubeTexture(envFaces); roomEnv.needsUpdate = true;

// ---------- MATERIALS ----------
var grainA = woodTex('#56321e', '#190c06', 1), grainB = woodTex('#382115', '#100905', 2), grainC = woodTex('#69402a', '#211006', 3);
var mahogany = new THREE.MeshStandardMaterial({ map: grainA, bumpMap: grainA, bumpScale: 0.003, roughnessMap: grainA, roughness: 0.68, envMap: roomEnv, envMapIntensity: 0.42, metalness: 0.04 });
var darkWood = new THREE.MeshStandardMaterial({ map: grainB, bumpMap: grainB, bumpScale: 0.006, roughness: 0.58, envMap: roomEnv, envMapIntensity: 0.22 });
var counterTop = new THREE.MeshStandardMaterial({ map: grainC, bumpMap: grainC, bumpScale: 0.002, roughnessMap: grainC, roughness: 0.48, envMap: roomEnv, envMapIntensity: 0.58, metalness: 0.08 });
var brass = new THREE.MeshStandardMaterial({ color: 0xb99a60, roughness: 0.28, metalness: 0.82, envMap: roomEnv, envMapIntensity: 0.72 });
var wallGrain = paintTex('#aa753d', 17);
var ochreWall = new THREE.MeshStandardMaterial({ map: wallGrain, bumpMap: wallGrain, bumpScale: 0.014, roughness: 0.94 });
var ceilingMat = new THREE.MeshStandardMaterial({ map: paintTex('#ad7940', 25), roughness: 0.96 });
var redWall = new THREE.MeshStandardMaterial({ map: paintTex('#713b2d', 33), roughness: 0.92 });
var carpetPile = tex(512, 512, function(cx, w, h) {
cx.fillStyle = '#512922'; cx.fillRect(0, 0, w, h);
// The old pattern survives as a worn thread, not a newly laid lattice.
cx.strokeStyle = 'rgba(177,137,88,0.15)'; cx.lineWidth = 2;
for (var y = 0; y < h; y += 64) for (var x = 0; x < w; x += 64) { cx.beginPath(); cx.moveTo(x + 32, y); cx.lineTo(x + 64, y + 32); cx.lineTo(x + 32, y + 64); cx.lineTo(x, y + 32); cx.closePath(); cx.stroke(); }
for (var n = 0; n < 18; n++) { var x = rnd(n) * w, y = rnd(n + 9) * h, g = cx.createRadialGradient(x, y, 0, x, y, 75); g.addColorStop(0, 'rgba(168,128,94,0.15)'); g.addColorStop(1, 'rgba(168,128,94,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); }
for (var i = 0; i < 42000; i++) { cx.fillStyle = i % 3 ? 'rgba(21,10,8,0.24)' : 'rgba(186,124,91,0.2)'; cx.fillRect(rnd(i) * w, rnd(i + 4) * h, 0.6, 1.5 + rnd(i + 7) * 2); }
});
window.dssInteriorSurface(carpetPile, 'carpet', 4);
carpetPile.wrapS = carpetPile.wrapT = THREE.RepeatWrapping; carpetPile.repeat.set(5, 6);
var carpet = new THREE.MeshStandardMaterial({ map: carpetPile, bumpMap: carpetPile, bumpScale: 0.018, roughness: 1 });

// ---------- ROOM ----------
var W = 7.4, H = 3.3, D = 9.0; // x -3.7..3.7, y 0..3.3, z -4.5..4.5
var floor = mesh(new THREE.PlaneGeometry(W, D), carpet, 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceil = mesh(new THREE.PlaneGeometry(W, D), ceilingMat, 0, H, 0); ceil.rotation.x = Math.PI / 2;
// back wall: red panel with a dark dado
var backWall = mesh(new THREE.PlaneGeometry(W, H), redWall, 0, H / 2, -D / 2); backWall.receiveShadow = true;
mesh(new THREE.BoxGeometry(W, 1.05, 0.06), darkWood, 0, 0.525, -D / 2 + 0.03);
mesh(new THREE.BoxGeometry(W, 0.06, 0.1), mahogany, 0, 1.07, -D / 2 + 0.05);
// side walls
var leftWall = mesh(new THREE.PlaneGeometry(D, H), ochreWall, -W / 2, H / 2, 0); leftWall.rotation.y = Math.PI / 2;
var rightWall = mesh(new THREE.PlaneGeometry(D, H), ochreWall, W / 2, H / 2, 0); rightWall.rotation.y = -Math.PI / 2;
mesh(new THREE.BoxGeometry(0.06, 0.75, 7.3), darkWood, W / 2 - 0.03, 0.375, 0.67);
var frontWall = mesh(new THREE.PlaneGeometry(W, H), ochreWall, 0, H / 2, D / 2); frontWall.rotation.y = Math.PI;
// the frieze of prints under the ceiling, all round
// Sepia pen studies: twenty individual heads, fine hatching and uneven ink.
// Draw at four times the old strip resolution so the close-ups retain linework.
function inkStudy(cx, seed) {
var turn = seed % 4, lean = (rnd(seed + 8) - 0.5) * 0.18;
cx.save(); cx.translate(50, 53); cx.rotate(lean);
cx.strokeStyle = '#5c4531'; cx.fillStyle = '#d6c6a4'; cx.lineWidth = 0.8;
function line(points) { cx.beginPath(); cx.moveTo(points[0],points[1]); for(var k=2;k<points.length;k+=2) cx.lineTo(points[k],points[k+1]); cx.stroke(); }
// Jackets, a neck and two differently turned lapels.
cx.fillStyle = 'rgba(83,63,44,0.13)'; cx.beginPath(); cx.moveTo(-39,78); cx.quadraticCurveTo(-35,48,-12,39); cx.lineTo(-8,26); cx.lineTo(11,27); cx.lineTo(15,40); cx.quadraticCurveTo(35,45,40,78); cx.closePath(); cx.fill(); cx.stroke();
line([-12,39,-22,46,-11,57,-16,61,-4,78]); line([15,40,24,48,13,58,18,62,7,78]); line([-8,33,-8,42,1,52,11,40,11,29]);
if(seed%3===0) { cx.fillStyle='#796047'; cx.beginPath(); cx.moveTo(0,50); cx.lineTo(-4,56); cx.lineTo(1,72); cx.lineTo(5,55); cx.closePath(); cx.fill(); }
// A cheek and jaw with a deliberately asymmetric contour, never a filled dot.
var jaw = 11 + rnd(seed + 3) * 7, brow = 17 + rnd(seed + 4) * 4;
cx.fillStyle = '#e6d8b9'; cx.beginPath(); cx.moveTo(-brow,-12); cx.bezierCurveTo(-24,-32,22,-33,20,-9); cx.quadraticCurveTo(26,4,17,17); cx.quadraticCurveTo(jaw,34,0,35); cx.quadraticCurveTo(-15,33,-20,9); cx.quadraticCurveTo(-26,-2,-brow,-12); cx.fill(); cx.stroke();
// A second wandering pen contour, ears and temple.
cx.globalAlpha=0.35; line([-19,-5,-21,6,-15,23,-8,30]); cx.globalAlpha=1;
line([-20,1,-25,-1,-24,10,-19,12]); line([20,0,24,1,22,12,18,12]);
var eye = turn === 1 ? 5 : 0;
line([-13+eye,-3,-6+eye,-5,-2+eye,-3]); line([6+eye,-4,13+eye,-3]);
line([2+eye,-2,-1+eye,10,6+eye,12]); line([-6,21,3,20,10,18]); line([-1,25,7,24]);
cx.fillStyle='#604b35'; cx.fillRect(-8+eye,-1,2,1.5); cx.fillRect(10+eye,0,2,1.3);
if(seed%5===2) { cx.beginPath(); cx.ellipse(-7+eye,0,7,5,0,0,Math.PI*2); cx.ellipse(11+eye,1,6,5,0,0,Math.PI*2); cx.stroke(); line([0+eye,0,5+eye,0]); }
// Hat, swept hair, balding crown, curls and moustaches vary by sitter.
if(seed%5===0) { cx.fillStyle='rgba(67,49,32,0.55)'; cx.beginPath(); cx.moveTo(-26,-17); cx.quadraticCurveTo(0,-11,27,-20); cx.lineTo(18,-24); cx.lineTo(13,-40); cx.quadraticCurveTo(-5,-43,-17,-37); cx.lineTo(-20,-22); cx.closePath(); cx.fill(); cx.stroke(); line([-17,-25,15,-27]); }
else {
for(var n=0;n<25;n++) { var xx=-20+n*1.6, yy=-19-Math.sqrt(Math.max(0,400-xx*xx))*0.5; if(seed%5===3 && n>7 && n<18) continue; cx.beginPath(); cx.moveTo(xx,yy+7); cx.quadraticCurveTo(xx-5,yy-7,xx+6,yy-5+(n%3)); cx.stroke(); }
}
if(seed%3===1) { for(var m=0;m<9;m++) line([-8+m*2,15, -10+m*2,18+(m%2)]); }
// Fine parallel strokes describe the cheek, jacket and shadow under the chin.
cx.globalAlpha=0.32; cx.lineWidth=0.55;
for(var n=0;n<12;n++) { var yy=4+n*2; line([-17,yy,-11+Math.sin(n)*2,yy-4]); }
for(var n=0;n<20;n++) { var xx=-34+n*3.6; line([xx,67,xx+8,52+Math.abs(xx)*0.32]); }
for(var n=0;n<7;n++) line([-8+n*2,33,-6+n*2,39]);
cx.globalAlpha=1; cx.restore();
}
var friezeTex = tex(4096, 384, function(cx, w, h) {
cx.fillStyle = '#bbaa87'; cx.fillRect(0,0,w,h);
cx.fillStyle = '#685036'; cx.fillRect(0,0,w,12); cx.fillRect(0,h-12,w,12);
for(var i=0;i<20;i++) {
var x=22+i*204, y=35, pw=166, ph=306;
cx.fillStyle='#211b14'; cx.fillRect(x,y,pw,ph);
cx.fillStyle=i%3===0?'#d6c9aa':'#e1d4b6'; cx.fillRect(x+5,y+5,pw-10,ph-10);
cx.strokeStyle='rgba(108,83,50,0.25)'; cx.lineWidth=1; cx.strokeRect(x+18,y+21,pw-36,ph-48);
cx.save(); cx.translate(x+22,y+26); cx.scale((pw-44)/100,(ph-52)/150); inkStudy(cx,i+21); cx.restore();
for(var n=0;n<90;n++) { cx.fillStyle='rgba(82,57,30,0.07)'; cx.fillRect(x+7+rnd(n+i*99)*(pw-14),y+7+rnd(n*3+i*71)*(ph-14),1,1); }
}
});
friezeTex.wrapS = THREE.RepeatWrapping;
var friezeMat = new THREE.MeshStandardMaterial({ map: friezeTex, roughness: 0.8 });
function frieze(len, x, z, ry) {
var m = mesh(new THREE.PlaneGeometry(len, 0.34), friezeMat, x, H - 0.24, z); m.rotation.y = ry;
m.material = friezeMat.clone(); m.material.map = friezeTex.clone(); m.material.map.needsUpdate = true; m.material.map.repeat.set(len / 3.5, 1);
return m;
}
frieze(W, 0, -D / 2 + 0.02, 0); frieze(D, -W / 2 + 0.02, 0, Math.PI / 2); frieze(D, W / 2 - 0.02, 0, -Math.PI / 2); frieze(W, 0, D / 2 - 0.02, Math.PI);
// cornice line and picture rail
var cornice = new THREE.MeshStandardMaterial({ color: 0x3a1a0c, roughness: 0.6 });
[[W, 0, -D / 2 + 0.05, 0], [D, -W / 2 + 0.05, 0, Math.PI / 2], [D, W / 2 - 0.05, 0, -Math.PI / 2]].forEach(function(c) {
var m = mesh(new THREE.BoxGeometry(c[0], 0.05, 0.1), cornice, c[1], H - 0.44, c[2]); m.rotation.y = c[3];
var m2 = mesh(new THREE.BoxGeometry(c[0], 0.05, 0.1), cornice, c[1], H - 0.04, c[2]); m2.rotation.y = c[3];
});

// ---------- THE BAR, running away from us on the left ----------
var barG = new THREE.Group(); scene.add(barG);
var P1 = new THREE.Vector3(-2.35, 0, 3.2), P2 = new THREE.Vector3(-1.05, 0, -2.1);
var barLen = P1.distanceTo(P2), barAng = Math.atan2(P1.x - P2.x, P1.z - P2.z);
var barMid = P1.clone().add(P2).multiplyScalar(0.5);
barG.position.copy(barMid); barG.rotation.y = barAng;
// counter body (customer side faces +x in local space), pale panels below the top
var body = mesh(new THREE.BoxGeometry(0.62, 1.08, barLen), mahogany, 0, 0.54, 0, barG); body.castShadow = true; body.receiveShadow = true;
var panelMat = new THREE.MeshStandardMaterial({ map: paintTex('#d9c9a2', 61), roughness: 0.65, envMap: roomEnv, envMapIntensity: 0.18 });
for (var pi = 0; pi < Math.floor(barLen / 0.7); pi++) {
mesh(new THREE.BoxGeometry(0.02, 0.62, 0.5), panelMat, 0.32, 0.5, -barLen / 2 + 0.42 + pi * 0.7, barG);
}
var top = mesh(new THREE.BoxGeometry(0.78, 0.06, barLen + 0.1), counterTop, 0, 1.11, 0, barG); top.castShadow = true; top.receiveShadow = true;
mesh(new THREE.BoxGeometry(0.04, 0.05, barLen + 0.1), brass, 0.4, 1.135, 0, barG);
var rail = mesh(new THREE.CylinderGeometry(0.02, 0.02, barLen, 8), brass, 0.48, 0.2, 0, barG); rail.rotation.x = Math.PI / 2;
rail.material=new THREE.MeshStandardMaterial({map:pubWear('#aa8950',12,false),color:0xc5a36a,roughness:0.48,metalness:0.65,envMap:roomEnv,envMapIntensity:0.4});
for(var mount=0;mount<4;mount++){var rz=-barLen/2+0.45+mount*(barLen-0.9)/3;
mesh(new THREE.CylinderGeometry(0.035,0.035,0.012,16),rail.material,0.48,0.012,rz,barG);
var bracket=mesh(new THREE.CylinderGeometry(0.012,0.012,0.19,10),rail.material,0.48,0.105,rz,barG);}

// the curved end nearest the back
var endCap = mesh(new THREE.CylinderGeometry(0.39, 0.39, 1.08, 24, 1, false, 0, Math.PI), mahogany, 0, 0.54, -barLen / 2, barG); endCap.rotation.y = Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.06, 24, 1, false, 0, Math.PI), counterTop, 0, 1.11, -barLen / 2 - 0.05, barG).rotation.y = Math.PI / 2;
// pump handles on the counter
var pumpMat = new THREE.MeshStandardMaterial({ color: 0x1a1210, roughness: 0.35 });
var ivory = new THREE.MeshStandardMaterial({ color: 0xe6dcc0, roughness: 0.4 });
for (var pu = 0; pu < 3; pu++) {
var z0 = -0.5 + pu * 0.28;
mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.16, 10), brass, -0.12, 1.22, z0, barG);
var handle = mesh(new THREE.LatheGeometry([[0,0],[0.019,0],[0.024,0.03],[0.02,0.08],[0.03,0.23],[0.027,0.31],[0.015,0.34],[0,0.345]].map(function(p){return new THREE.Vector2(p[0],p[1]-0.17);}),24), ivory, -0.12, 1.46, z0, barG); handle.rotation.x = -0.18;
ivory.map=pubWear('#ded1ae',15,false);ivory.roughness=0.3;ivory.needsUpdate=true;
var spoutPath=new THREE.CatmullRomCurve3([new THREE.Vector3(-0.12,1.3,z0),new THREE.Vector3(0.01,1.32,z0),new THREE.Vector3(0.065,1.28,z0),new THREE.Vector3(0.065,1.23,z0)]);
mesh(new THREE.TubeGeometry(spoutPath,12,0.008,8,false),brass,0,0,0,barG);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 6), brass, -0.12, 1.32, z0, barG);
}

// ---------- THE BACK BAR along the left wall ----------
var bbX = -W / 2;
mesh(new THREE.BoxGeometry(0.42, 1.2, 6.2), darkWood, bbX + 0.21, 0.6, 0.5).receiveShadow = true;
mesh(new THREE.BoxGeometry(0.48, 0.05, 6.2), counterTop, bbX + 0.24, 1.22, 0.5);
// mirror and shelves
// A real planar reflection, redrawn only when the viewing angle changes.
// No post-processing or vendor dependency. The tarnish lives at the edges.
var mirrorSize = portrait ? 512 : 1024;
var mirrorTarget = new THREE.WebGLRenderTarget(mirrorSize, mirrorSize, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
var mirrorCamera = camera.clone(), mirrorMatrix = new THREE.Matrix4();
var mirrorMat = new THREE.ShaderMaterial({
uniforms: { reflection: { value: mirrorTarget.texture }, reflectionMatrix: { value: mirrorMatrix } },
vertexShader: 'uniform mat4 reflectionMatrix; varying vec4 reflected; varying vec2 faceUV; void main(){ faceUV=uv; vec4 wp=modelMatrix*vec4(position,1.0); reflected=reflectionMatrix*wp; gl_Position=projectionMatrix*viewMatrix*wp; }',
fragmentShader: 'uniform sampler2D reflection; varying vec4 reflected; varying vec2 faceUV; void main(){ vec3 c=texture2DProj(reflection,reflected).rgb; float edge=smoothstep(0.0,0.07,min(min(faceUV.x,1.0-faceUV.x),min(faceUV.y,1.0-faceUV.y))); float stain=0.5+0.5*sin(faceUV.x*193.0+sin(faceUV.y*117.0)*3.0); c=mix(vec3(0.05,0.033,0.019),c*vec3(0.72,0.68,0.59),0.65+0.35*edge); c*=1.0-(1.0-edge)*stain*0.3; gl_FragColor=vec4(c,1.0);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'
});
var mirror = mesh(new THREE.PlaneGeometry(5.6, 1.1), mirrorMat, bbX + 0.03, 1.95, 0.4); mirror.rotation.y = Math.PI / 2;
mirror.geometry.addEventListener('dispose', function() { mirrorTarget.dispose(); });
var lastMirrorAspect = 0;
var lastMirrorP = new THREE.Vector3(999, 999, 999), lastMirrorT = new THREE.Vector3(999, 999, 999);
function reflectRoom(target) {
if (lastMirrorAspect === camera.aspect && lastMirrorP.distanceToSquared(camera.position) < 0.0025 && lastMirrorT.distanceToSquared(target) < 0.0025) return;
lastMirrorAspect = camera.aspect; lastMirrorP.copy(camera.position); lastMirrorT.copy(target);
mirrorCamera.copy(camera); mirrorCamera.position.x = 2 * mirror.position.x - camera.position.x;
mirrorCamera.lookAt(2 * mirror.position.x - target.x, target.y, target.z); mirrorCamera.updateMatrixWorld();
// Oblique near plane excludes the room behind the silvered glass.
var clip = new THREE.Plane(new THREE.Vector3(1, 0, 0), -mirror.position.x).applyMatrix4(mirrorCamera.matrixWorldInverse);
var cp = new THREE.Vector4(clip.normal.x, clip.normal.y, clip.normal.z, clip.constant);
var pm = mirrorCamera.projectionMatrix.elements, cq = new THREE.Vector4((Math.sign(cp.x) + pm[8]) / pm[0], (Math.sign(cp.y) + pm[9]) / pm[5], -1, (1 + pm[10]) / pm[14]);
cp.multiplyScalar(2 / cp.dot(cq)); pm[2] = cp.x; pm[6] = cp.y; pm[10] = cp.z + 1; pm[14] = cp.w;
mirrorMatrix.set(0.5,0,0,0.5, 0,0.5,0,0.5, 0,0,0.5,0.5, 0,0,0,1).multiply(mirrorCamera.projectionMatrix).multiply(mirrorCamera.matrixWorldInverse);
var oldTarget = renderer.getRenderTarget(), oldTone = renderer.toneMapping;
mirror.visible = false; renderer.toneMapping = THREE.NoToneMapping;
renderer.setRenderTarget(mirrorTarget); renderer.render(scene, mirrorCamera);
renderer.setRenderTarget(oldTarget); renderer.toneMapping = oldTone; mirror.visible = true;
}
var shelfMat = darkWood;
mesh(new THREE.BoxGeometry(0.34, 0.03, 5.8), shelfMat, bbX + 0.17, 1.62, 0.4);
mesh(new THREE.BoxGeometry(0.28, 0.03, 5.8), shelfMat, bbX + 0.14, 2.2, 0.4);
mesh(new THREE.BoxGeometry(0.2, 0.03, 5.8), shelfMat, bbX + 0.1, 2.72, 0.4);
mesh(new THREE.BoxGeometry(0.06, 3.3, 0.16), mahogany, bbX + 0.03, 1.65, -2.55);
mesh(new THREE.BoxGeometry(0.06, 3.3, 0.16), mahogany, bbX + 0.03, 1.65, 3.4);
// bottles, three rows
var botCols = [0x2a5a2a, 0x7a4a18, 0x1a2a5a, 0x8a7a20, 0x4a1a1a, 0x2a4a3a, 0xa08030, 0x3a2a1a];
var bottleLabels=[];
for(var labelStyle=0;labelStyle<6;labelStyle++) {
 (function(style){
 var labelMap=tex(256,256,function(cx,w,h){
 cx.fillStyle=['#c3b391','#d2c4a4','#b7b09a','#b4a889','#c6baa3','#a59b85'][style];cx.fillRect(0,0,w,h);
 var ink=['#51412e','#6b3730','#384a3b'][style%3];cx.strokeStyle=ink;cx.lineWidth=3;cx.strokeRect(14,14,228,228);cx.lineWidth=1;cx.strokeRect(20,20,216,216);
 cx.fillStyle=ink;cx.beginPath();cx.ellipse(128,76,26,30,0,0,Math.PI*2);cx.fill();
 cx.fillStyle='#d0c2a2';cx.beginPath();cx.ellipse(128,76,20,24,0,0,Math.PI*2);cx.fill();
 cx.strokeStyle=ink;cx.lineWidth=2;cx.beginPath();cx.moveTo(115,88);cx.lineTo(128,57);cx.lineTo(141,88);cx.stroke();
 // Faded printer's rules suggest old labels without adding new story text.
 for(var rule=0;rule<6;rule++){var span=rule===0?136:rule===1?112:60+(rule%3)*22;cx.fillStyle=ink;cx.globalAlpha=rule<2?0.65:0.4;cx.fillRect(128-span/2,122+rule*14,span,rule<2?5:2);}cx.globalAlpha=1;
 for(var wear=0;wear<520;wear++){cx.fillStyle=wear%4?'rgba(229,218,191,0.25)':'rgba(88,74,50,0.12)';cx.fillRect((wear*47+style*13)%256,(wear*83)%256,1+wear%4,1+wear%3);}
 cx.globalCompositeOperation='destination-out';
 for(var chip=0;chip<22;chip++){cx.beginPath();cx.arc(chip%2?256:0,(chip*47+style*9)%256,2+chip%5,0,Math.PI*2);cx.fill();}
 });
 bottleLabels.push(new THREE.MeshStandardMaterial({map:labelMap,transparent:true,roughness:0.94,side:THREE.DoubleSide}));
 })(labelStyle);
}
function bottle(x, y, z, col, h, r) {
var g = new THREE.Group(); g.position.set(x, y, z);
var variant=Math.abs(Math.round(z*31+y*17))%6;
var bm = new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.22+variant*0.012, metalness: 0, envMap: roomEnv, envMapIntensity: 0.65, clearcoat: 0.6, clearcoatRoughness: 0.2, transparent: true, opacity: 0.92 });
var shoulder=[0.83,0.76,0.9,0.8,0.86,0.72][variant],neck=[0.3,0.36,0.26,0.32,0.29,0.4][variant];
var profile=[[0,0],[0.85,0],[1,0.035],[1,shoulder-0.08],[0.97,shoulder],[0.72,shoulder+0.09],[neck,1.03],[neck,1.28],[neck*1.16,1.29],[neck*1.16,1.34],[0,1.34]].map(function(p){return new THREE.Vector2(p[0]*r,p[1]*h);});
mesh(new THREE.LatheGeometry(profile,20),bm,0,0,0,g);
var capMat=new THREE.MeshStandardMaterial({color:variant%2?0x77613c:0x3a3328,roughness:0.6,metalness:0.2});
mesh(new THREE.CylinderGeometry(r*neck*1.2,r*neck*1.2,h*0.055,12),capMat,0,h*1.335,0,g);
// Curved paper wraps face out from the back bar, toward the room (+x).
var paper=mesh(new THREE.CylinderGeometry(r*1.012,r*1.012,h*0.43,20,1,true,0.24,Math.PI-0.48),bottleLabels[variant],0,h*0.44,0,g);
scene.add(g); return g;
}

for (var row = 0; row < 3; row++) {
var sy = [1.635, 2.215, 2.735][row], sx = [bbX + 0.2, bbX + 0.16, bbX + 0.12][row];
for (var b = 0; b < 22; b++) {
if (rnd(row * 40 + b) < 0.18) continue;
bottle(sx + (rnd(row + b * 3) - 0.5) * 0.06, sy, -2.3 + b * 0.25 + (rnd(b + row * 9) - 0.5) * 0.06, botCols[(b + row * 3) % botCols.length], 0.2 + rnd(b * 5 + row) * 0.14, 0.03 + rnd(b * 2 + row) * 0.012);
}
}
// optics under the top shelf, and the till
for (var o = 0; o < 6; o++) {
bottle(bbX + 0.12, 2.32, -1.6 + o * 0.3, botCols[(o * 5) % botCols.length], 0.22, 0.03).rotation.x = Math.PI;
}
// Old mechanical register: charcoal enamel, dull nickel and yellowed keys.
var till=new THREE.Group();till.position.set(bbX+0.27,1.24,1.3);till.rotation.y=Math.PI/2;scene.add(till);
var tillWear=tex(256,256,function(cx,w,h){
 cx.fillStyle='#88877e';cx.fillRect(0,0,w,h);
 for(var n=0;n<900;n++){cx.fillStyle=n%5?'rgba(213,207,188,0.06)':'rgba(33,31,26,0.18)';cx.fillRect((n*47)%w,(n*83)%h,1+n%4,1);}
 for(var n=0;n<18;n++){cx.strokeStyle='rgba(214,208,187,0.23)';cx.lineWidth=0.5;cx.beginPath();cx.moveTo((n*37)%w,(n*67)%h);cx.lineTo((n*37)%w+8,(n*67)%h-1);cx.stroke();}
});
var tillEnamel=new THREE.MeshStandardMaterial({map:tillWear,color:0x454b45,roughness:0.48,metalness:0.25,envMap:roomEnv,envMapIntensity:0.35});
var tillNickel=new THREE.MeshStandardMaterial({color:0xaaa18b,roughness:0.57,metalness:0.65,envMap:roomEnv,envMapIntensity:0.3});
var tillBlack=new THREE.MeshStandardMaterial({color:0x25251f,roughness:0.7});
function tillCase(width,height,depth,material,x,y,z){
 var shape=new THREE.Shape(),r=0.012,w=width/2,h=height/2;
 shape.moveTo(-w+r,-h);shape.lineTo(w-r,-h);shape.quadraticCurveTo(w,-h,w,-h+r);shape.lineTo(w,h-r);shape.quadraticCurveTo(w,h,w-r,h);shape.lineTo(-w+r,h);shape.quadraticCurveTo(-w,h,-w,h-r);shape.lineTo(-w,-h+r);shape.quadraticCurveTo(-w,-h,-w+r,-h);
 var geo=new THREE.ExtrudeGeometry(shape,{depth:depth-0.008,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:0.004,bevelThickness:0.004,curveSegments:4});geo.translate(0,0,-depth/2+0.004);
 return mesh(geo,material,x,y,z,till);
}
tillCase(0.41,0.064,0.30,tillEnamel,0,0.034,0);
tillCase(0.34,0.13,0.18,tillEnamel,0,0.12,-0.055);
var keyboard=tillCase(0.34,0.025,0.17,tillEnamel,0,0.091,0.052);keyboard.rotation.x=0.24;
tillCase(0.35,0.078,0.09,tillEnamel,0,0.222,-0.079);
// Mechanical number flags behind a single smoked window, no electronic glow.
mesh(new THREE.BoxGeometry(0.29,0.043,0.006),tillNickel,0,0.224,-0.029,till);
var flags=tex(512,96,function(cx,w,h){
 cx.fillStyle='#242822';cx.fillRect(0,0,w,h);cx.textAlign='center';cx.textBaseline='middle';cx.font='52px Georgia';
 for(var n=0;n<5;n++){cx.fillStyle='#bab49c';cx.fillText('0',68+n*94,53);cx.fillStyle='rgba(0,0,0,0.45)';cx.fillRect(20+n*94,47,88,2);}
});
mesh(new THREE.PlaneGeometry(0.275,0.034),new THREE.MeshStandardMaterial({map:flags,roughness:0.73}),0,0.224,-0.025,till);
var keyPaper=[];
for(var k=0;k<10;k++){
 var keyMap=tex(64,64,function(cx,w,h){cx.fillStyle='#c5baa0';cx.fillRect(0,0,w,h);cx.fillStyle='#403a2c';cx.textAlign='center';cx.textBaseline='middle';cx.font='34px Georgia';cx.fillText(String(k),32,34);});
 keyPaper.push(new THREE.MeshStandardMaterial({map:keyMap,roughness:0.83}));
}
for(var row=0;row<3;row++)for(var col=0;col<7;col++){
 var x=(col-3)*0.042,z=0.008+row*0.043,y=0.113-row*0.010;
 mesh(new THREE.CylinderGeometry(0.008,0.008,0.018,8),tillNickel,x,y,z,till);
 mesh(new THREE.CylinderGeometry(0.014,0.014,0.007,14),tillBlack,x,y+0.011,z,till);
 var cap=mesh(new THREE.CircleGeometry(0.0115,16),keyPaper[(col+row*3)%10],x,y+0.015,z,till);cap.rotation.x=-Math.PI/2;
}
// Drawer seam, recessed pull and old lock on the worn front lip.
mesh(new THREE.BoxGeometry(0.365,0.002,0.002),tillBlack,0,0.049,0.152,till);
mesh(new THREE.BoxGeometry(0.10,0.012,0.006),tillBlack,0,0.027,0.153,till);
mesh(new THREE.BoxGeometry(0.086,0.004,0.012),tillNickel,0,0.029,0.159,till);
var lock=mesh(new THREE.CylinderGeometry(0.008,0.008,0.004,12),tillNickel,0.137,0.028,0.154,till);lock.rotation.x=Math.PI/2;
mesh(new THREE.BoxGeometry(0.0017,0.007,0.001),tillBlack,0.137,0.028,0.157,till);
// Short side lever with a polished dark handle.
var lever=mesh(new THREE.CylinderGeometry(0.004,0.004,0.065,8),tillNickel,0.193,0.128,0.015,till);lever.rotation.z=-0.4;
var knob=mesh(new THREE.SphereGeometry(0.011,12,8),tillBlack,0.206,0.16,0.015,till);knob.scale.y=1.3;

// THE TELEPHONE behind the bar (the one that rings)
var phoneG = new THREE.Group(); phoneG.position.set(bbX + 0.26, 1.245, -0.35); phoneG.rotation.y = 0.55; scene.add(phoneG);
var phoneWear=window.dssHandledPhoneMaterials(tex,roomEnv);
var bakelite=phoneWear.shell;
// Rounded moulded Bakelite, with a slightly raised shoulder beneath the dial.
var phoneBody=mesh(new THREE.SphereGeometry(1,24,12),bakelite,0,0.045,0,phoneG);phoneBody.scale.set(0.126,0.06,0.113);
var plinth=mesh(new THREE.CylinderGeometry(0.106,0.114,0.018,32),bakelite,0,0.012,0,phoneG);plinth.scale.z=0.88;
var dialG=new THREE.Group();dialG.position.set(0,0.1,0.035);dialG.rotation.x=0.22;phoneG.add(dialG);
var dialMetal=phoneWear.metal;
mesh(new THREE.CylinderGeometry(0.056,0.06,0.009,32),dialMetal,0,0,0,dialG);
var dialFace=tex(256,256,function(cx,w,h){
 cx.fillStyle='#a99f89';cx.fillRect(0,0,w,h);
 cx.textAlign='center';cx.textBaseline='middle';cx.font='20px Georgia';
 for(var n=0;n<10;n++) {var angle=(-65+n*27)*Math.PI/180,x=128+Math.cos(angle)*94,y=128+Math.sin(angle)*94;
 cx.fillStyle='#d3c8ad';cx.beginPath();cx.arc(x,y,17,0,Math.PI*2);cx.fill();cx.fillStyle='#302c25';cx.fillText(String((n+1)%10),x,y);}
 cx.strokeStyle='#5e574a';cx.lineWidth=2;cx.beginPath();cx.arc(128,128,52,0,Math.PI*2);cx.stroke();
 cx.fillStyle='#d7cdb6';cx.beginPath();cx.arc(128,128,45,0,Math.PI*2);cx.fill();cx.fillStyle='#716958';cx.font='12px Georgia';cx.fillText('TELEPHONE',128,119);cx.fillText('•',128,138);
});
var face=mesh(new THREE.CircleGeometry(0.054,40),new THREE.MeshStandardMaterial({map:dialFace,roughness:0.65}),0,0.005,0,dialG);face.rotation.x=-Math.PI/2;
for(var n=0;n<10;n++) {
 var angle=(-65+n*27)*Math.PI/180;
 var hole=mesh(new THREE.TorusGeometry(0.0068,0.0012,5,12),phoneWear.touchMetal,Math.cos(angle)*0.04,0.007,Math.sin(angle)*0.04,dialG);hole.rotation.x=-Math.PI/2;
}
mesh(new THREE.BoxGeometry(0.006,0.012,0.018),phoneWear.touchMetal,0.048,0.012,0.018,dialG);
// Low rear shoulder and broad cradle saddles physically support the receiver.
var rearShoulder=mesh(new THREE.SphereGeometry(1,20,10),bakelite,0,0.073,-0.042,phoneG);rearShoulder.scale.set(0.108,0.044,0.055);
[-1,1].forEach(function(side){
 var saddle=mesh(new THREE.SphereGeometry(1,16,8),bakelite,side*0.092,0.097,-0.033,phoneG);saddle.scale.set(0.033,0.022,0.032);
 var cup=mesh(new THREE.SphereGeometry(1,16,10),phoneWear.grip,side*0.103,0.119,-0.033,phoneG);cup.scale.set(0.038,0.025,0.034);
 mesh(new THREE.CylinderGeometry(0.028,0.032,0.009,20),bakelite,side*0.103,0.102,-0.033,phoneG);
});
var handlePath=new THREE.CatmullRomCurve3([new THREE.Vector3(-0.103,0.129,-0.033),new THREE.Vector3(-0.064,0.149,-0.036),new THREE.Vector3(0.064,0.149,-0.036),new THREE.Vector3(0.103,0.129,-0.033)]);
mesh(new THREE.TubeGeometry(handlePath,20,0.013,8,false),phoneWear.grip,0,0,0,phoneG);
var cordPoints=[];
for(var n=0;n<=160;n++){var u=n/160,angle=u*Math.PI*2*18;cordPoints.push(new THREE.Vector3(-0.127-0.01*Math.cos(angle)-0.035*Math.sin(u*Math.PI),0.113-u*0.094,-0.035+u*0.075+0.01*Math.sin(angle)));}
var cordPath=new THREE.CatmullRomCurve3(cordPoints);
mesh(new THREE.TubeGeometry(cordPath,180,0.0022,5,false),bakelite,0,0,0,phoneG);
var phoneProxy = mesh(new THREE.SphereGeometry(0.22, 8, 6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }), 0, 0.1, 0, phoneG);

// ---------- THE PHOTO WALL at the back ----------
var photoG = new THREE.Group(); scene.add(photoG);
var frameMat = new THREE.MeshStandardMaterial({ color: 0x1a1008, roughness: 0.5 });
var mountMat = new THREE.MeshStandardMaterial({ color: 0xc8bca4, roughness: 0.85 });
function photoTex(seed) {
return tex(256, 384, function(cx, w, h) {
var tones = ['#777369','#6b665d','#838074','#65635c'];
var g = cx.createLinearGradient(0,0,w,h); g.addColorStop(0,tones[seed%4]); g.addColorStop(1,'#24251f'); cx.fillStyle=g; cx.fillRect(0,0,w,h);
// A faded curtain, doorjamb or pub interior rather than a uniform backdrop.
cx.fillStyle='rgba(18,19,16,0.22)';
if(seed%2) { for(var c=0;c<7;c++) cx.fillRect(c*42,0,13,h); }
else { cx.fillRect(12,0,8,h); cx.fillRect(w-35,0,13,h); cx.fillRect(0,76,w,8); }
var count = seed%3 === 0 ? 3 : seed%4 === 0 ? 2 : 1;
function sitter(px, py, scale, k) {
cx.save(); cx.translate(px,py); cx.scale(scale,scale);
var coat=cx.createLinearGradient(-70,0,70,140); coat.addColorStop(0,'#171c19'); coat.addColorStop(0.65,k%2?'#4c4d44':'#373b35'); coat.addColorStop(1,'#222822');
cx.fillStyle=coat; cx.beginPath(); cx.moveTo(-88,185); cx.quadraticCurveTo(-95,75,-35,60); cx.lineTo(-17,43); cx.lineTo(20,41); cx.lineTo(36,59); cx.quadraticCurveTo(88,72,91,185); cx.closePath(); cx.fill();
// White collar, lapels and the small flash of a shirt.
cx.fillStyle='#aea998'; cx.beginPath(); cx.moveTo(-18,48); cx.lineTo(2,106); cx.lineTo(23,49); cx.lineTo(0,62); cx.closePath(); cx.fill();
cx.strokeStyle='rgba(172,171,148,0.26)'; cx.lineWidth=2; cx.beginPath(); cx.moveTo(-34,61); cx.lineTo(-19,83); cx.lineTo(-28,94); cx.lineTo(-3,136); cx.moveTo(35,63); cx.lineTo(17,85); cx.lineTo(27,95); cx.lineTo(6,139); cx.stroke();
var face=cx.createRadialGradient(-12,-8,1,0,7,54); face.addColorStop(0,'#c9c4af'); face.addColorStop(0.45,'#9b9b89'); face.addColorStop(1,'#494f43');
cx.fillStyle=face; cx.beginPath(); cx.moveTo(-31,-7); cx.bezierCurveTo(-37,-51,36,-52,33,-9); cx.lineTo(29,28); cx.quadraticCurveTo(19,54,0,50); cx.quadraticCurveTo(-28,45,-30,22); cx.closePath(); cx.fill();
// Hairline, side-light, nose, brows, mouth: grain softens these into the print.
cx.fillStyle=k%3===0?'#76796a':'#343c32'; cx.beginPath(); cx.moveTo(-31,1); cx.quadraticCurveTo(-46,-52,7,-43); cx.quadraticCurveTo(42,-44,34,-1); cx.lineTo(24,-22); cx.quadraticCurveTo(4,-13,-15,-27); cx.lineTo(-24,-10); cx.closePath(); cx.fill();
cx.strokeStyle='rgba(27,35,29,0.65)'; cx.lineWidth=2.4; cx.beginPath(); cx.moveTo(-22,3); cx.lineTo(-8,1); cx.moveTo(9,2); cx.lineTo(23,5); cx.moveTo(1,5); cx.lineTo(-3,24); cx.lineTo(7,26); cx.moveTo(-9,36); cx.quadraticCurveTo(1,39,13,34); cx.stroke();
cx.fillStyle='rgba(23,28,23,0.6)'; cx.fillRect(-17,7,5,3); cx.fillRect(14,8,4,3);
if(k%4===1) { cx.lineWidth=1.5; cx.strokeRect(-24,0,19,15); cx.strokeRect(8,1,18,15); cx.beginPath(); cx.moveTo(-5,5); cx.lineTo(8,6); cx.stroke(); }
if(k%4===2) { cx.fillStyle='rgba(38,43,35,0.6)'; cx.beginPath(); cx.ellipse(0,31,13,4,-0.12,0,Math.PI*2); cx.fill(); }
cx.restore();
}
if(count===1) sitter(118+(seed%3)*7,136,1.35,seed);
else for(var j=0;j<count;j++) sitter(44+j*(168/(count-1)),142+(j%2)*24,0.69+(j%2)*0.08,seed+j);
// Silver mirroring at the edge and uneven emulsion, retained in the shadows.
var silver=cx.createLinearGradient(0,0,w,h); silver.addColorStop(0,'rgba(185,194,178,0.25)'); silver.addColorStop(0.2,'rgba(157,166,152,0.02)'); silver.addColorStop(0.8,'rgba(157,166,152,0)'); silver.addColorStop(1,'rgba(185,194,178,0.18)'); cx.fillStyle=silver; cx.fillRect(0,0,w,h);
for(var i=0;i<17000;i++) { cx.fillStyle=i%2?'rgba(225,221,193,0.07)':'rgba(5,14,8,0.075)'; cx.fillRect(rnd(seed+i*7)*w,rnd(seed+i*11)*h,1,1); }
cx.strokeStyle='rgba(211,207,179,0.18)'; cx.lineWidth=0.6;
for(var n=0;n<5;n++) { var xx=rnd(seed+n)*w; cx.beginPath(); cx.moveTo(xx,rnd(n)*h); cx.lineTo(xx+1,rnd(n+3)*h); cx.stroke(); }
var edge=cx.createRadialGradient(w/2,h*0.45,w*0.22,w/2,h*0.45,h*0.7); edge.addColorStop(0,'rgba(13,15,10,0)'); edge.addColorStop(1,'rgba(13,15,10,0.45)'); cx.fillStyle=edge; cx.fillRect(0,0,w,h);
});
}
var EMPTY = 5; // the one frame with no one in it
for (var f = 0; f < 8; f++) {
var fx = -W / 2 + 0.58 + f * ((W - 1.16) / 7), fy = 2.0, fz = -D / 2 + 0.035; // evenly spaced across the full back wall
mesh(new THREE.BoxGeometry(0.44, 0.56, 0.03), frameMat, fx, fy, fz, photoG);
mesh(new THREE.PlaneGeometry(0.38, 0.5), mountMat, fx, fy, fz + 0.017, photoG);
// 2026-10-14 (Sam): the empty frame now holds his own photograph (french-frame-photo.jpg, beside the html), black and
// white with the faint warm cast of the other prints; the plain mount shows until it loads, or if it never does
var pm = f === EMPTY
? new THREE.MeshStandardMaterial({ color: 0xcfc2a4, roughness: 0.9 })
: new THREE.MeshStandardMaterial({ map: photoTex(f + 11), roughness: 0.6 });
if (f === EMPTY) { (function(mat) { new THREE.TextureLoader().load('french-frame-photo.jpg?v=1', function(t) { mat.map = t; mat.color.setHex(0xeadfca); mat.roughness = 0.6; mat.needsUpdate = true; }); })(pm); }
mesh(new THREE.PlaneGeometry(0.26, 0.36), pm, fx, fy, fz + 0.02, photoG);
}
// a couple more, smaller, high on the left wall behind the bar (the famous wall)
for (var f2 = 0; f2 < 5; f2++) {
var lz = -2.2 + f2 * 0.5;
var lm = mesh(new THREE.BoxGeometry(0.03, 0.3, 0.24), frameMat, bbX + 0.02, 2.62 + (f2 % 2) * 0.06, lz);
var lp = mesh(new THREE.PlaneGeometry(0.18, 0.24), new THREE.MeshStandardMaterial({ map: photoTex(f2 + 30), roughness: 0.6 }), bbX + 0.04, 2.62 + (f2 % 2) * 0.06, lz); lp.rotation.y = Math.PI / 2;
}

// ---------- THE RIGHT SIDE: pillar, window, the blue door ----------
var pillar = mesh(new THREE.BoxGeometry(0.34, H, 0.34), mahogany, 3.05, H / 2, 0.2); pillar.castShadow = true;
mesh(new THREE.BoxGeometry(0.5, 0.12, 0.5), mahogany, 3.05, H - 0.06, 0.2);
mesh(new THREE.BoxGeometry(0.5, 0.12, 0.5), mahogany, 3.05, 0.06, 0.2);
// A continuous night street panorama, shared across all five window bays.
var streetCanvas = document.createElement('canvas'); streetCanvas.width = 1536; streetCanvas.height = 512;
var streetCtx = streetCanvas.getContext('2d');
function paintStreet(t) {
var cx=streetCtx,w=1536,h=512;
var sky=cx.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#101525');sky.addColorStop(1,'#343139');cx.fillStyle=sky;cx.fillRect(0,0,w,h);
for(var house=0;house<9;house++) {
var x=house*184-35;
cx.fillStyle=['#302c32','#3b3434','#272e36'][house%3];cx.fillRect(x,0,178,368);
cx.fillStyle='#171820';cx.fillRect(x+4,310,170,58);
cx.fillStyle=['#754c3c','#3b5051','#655339'][house%3];cx.fillRect(x+8,290,162,18);
for(var row=0;row<3;row++)for(var col=0;col<3;col++){
var wx=x+18+col*50,wy=18+row*86;
cx.fillStyle='#756d65';cx.fillRect(wx-3,wy-3,32,60);
cx.fillStyle=(house+row+col)%3===0?'#a88b5d':'#19202c';cx.fillRect(wx,wy,26,54);
cx.fillStyle='rgba(223,202,160,.3)';cx.fillRect(wx+12,wy,2,54);cx.fillRect(wx,wy+28,26,2);
}
for(var shop=0;shop<3;shop++){cx.fillStyle=shop===1?'#776148':'#27333b';cx.fillRect(x+17+shop*49,318,39,43);}
}
cx.fillStyle='#5a5351';cx.fillRect(0,368,w,36);cx.fillStyle='#96816b';cx.fillRect(0,400,w,4);
var road=cx.createLinearGradient(0,404,0,h);road.addColorStop(0,'#242630');road.addColorStop(1,'#111923');cx.fillStyle=road;cx.fillRect(0,404,w,h-404);
for(var l=0;l<4;l++){
var lx=100+l*420;
var glow=cx.createRadialGradient(lx,163,0,lx,163,137);glow.addColorStop(0,'rgba(255,212,134,.44)');glow.addColorStop(.2,'rgba(241,174,83,.13)');glow.addColorStop(1,'rgba(241,174,83,0)');cx.fillStyle=glow;cx.fillRect(lx-137,26,274,274);
cx.fillStyle='#171b24';cx.fillRect(lx-3,164,6,233);cx.fillRect(lx-15,147,30,7);cx.fillRect(lx-12,154,24,27);
cx.fillStyle='#ffe2a5';cx.fillRect(lx-8,157,16,19);
var pool=cx.createRadialGradient(lx,403,0,lx,403,115);pool.addColorStop(0,'rgba(221,171,94,.18)');pool.addColorStop(1,'rgba(221,171,94,0)');cx.save();cx.translate(0,300);cx.scale(1,.25);cx.fillStyle=pool;cx.fillRect(lx-120,280,240,240);cx.restore();
}
// Small walkers travel both ways, with alternating steps and coat hems.
for(var person=0;person<7;person++) {
var dir=person%2?1:-1,px=((person*239+dir*t*(14+person*1.8))%1750+1750)%1750-100;
var py=385+(person%3)*5,step=Math.sin(t*5+person*2),scale=.7+(person%3)*.12;
cx.save();cx.translate(px,py);cx.scale(scale,scale);
cx.fillStyle='rgba(0,0,0,.3)';cx.beginPath();cx.ellipse(0,2,15,3,0,0,Math.PI*2);cx.fill();
cx.strokeStyle='#141823';cx.lineWidth=5;cx.beginPath();cx.moveTo(-4,-21);cx.lineTo(-5-step*5,0);cx.moveTo(4,-21);cx.lineTo(5+step*5,0);cx.stroke();
cx.fillStyle=['#514342','#303f50','#595248'][person%3];cx.beginPath();cx.moveTo(-7,-49);cx.lineTo(7,-49);cx.lineTo(10+step,-18);cx.lineTo(-10+step,-18);cx.closePath();cx.fill();
cx.fillStyle='#aa8e78';cx.beginPath();cx.arc(0,-56,6,0,Math.PI*2);cx.fill();cx.fillStyle='#21232d';cx.fillRect(-7,-62,14,4);cx.restore();
}
/* 2026-10-24 (Sam, playtest: "I wanted the outdoor view to be sepia/greyscale"): the street is drained to grey, then washed sepia */
cx.save();cx.globalCompositeOperation='saturation';cx.fillStyle='#808080';cx.fillRect(0,0,w,h);cx.globalCompositeOperation='color';cx.fillStyle='rgba(138,104,66,0.6)';cx.fillRect(0,0,w,h);cx.restore();
}
paintStreet(0);
var winTex = new THREE.CanvasTexture(streetCanvas); winTex.minFilter=THREE.LinearMipmapLinearFilter;winTex.generateMipmaps=true;try{winTex.anisotropy=renderer.capabilities.getMaxAnisotropy();}catch(e){} /* 2026-10-24 (Sam, playtest: "The tops of the windows are flashing"): the street's fine window grid, seen at a slant without mipmaps, sparkled as the camera breathed; mipmapped and anisotropic now (was LinearFilter, no mipmaps) */
var streetLast=-1, streetTextures=[];
// Broad street-facing glazing, from beside the exit to the near corner.
var winG = new THREE.Group(); scene.add(winG);
var windowTrim = new THREE.MeshStandardMaterial({ color: 0xe8e0c8, roughness: 0.7 });
var windowStart = -2.98, windowEnd = D / 2 - 0.18, windowBays = 5;
var bayWidth = (windowEnd - windowStart) / windowBays;
for (var wb = 0; wb < windowBays; wb++) {
var wz = windowStart + (wb + 0.5) * bayWidth;
var bayTex=winTex.clone();bayTex.repeat.set(1/windowBays,1);bayTex.offset.set(wb/windowBays,0);bayTex.needsUpdate=true;streetTextures.push(bayTex);
var winMat=new THREE.MeshBasicMaterial({map:bayTex,color:0xcdc6ba}); /* 2026-10-24: neutral, so the sepia street is not pushed blue (was 0xc1c7d2) */
var pane = mesh(new THREE.PlaneGeometry(bayWidth - 0.1, 1.95), winMat, W / 2 - 0.08, 1.84, wz, winG); pane.rotation.y = -Math.PI / 2;
// A faint varnished-room reflection over the street, strongest at grazing angles.
var glassReflection=new THREE.MeshPhysicalMaterial({color:0xd7c8ad,envMap:roomEnv,envMapIntensity:0.85,metalness:0.25,roughness:0.16,clearcoat:1,clearcoatRoughness:0.12,transparent:true,opacity:0.12,depthWrite:false});
var reflection=mesh(new THREE.PlaneGeometry(bayWidth-0.1,1.95),glassReflection,W/2-0.095,1.84,wz,winG);reflection.rotation.y=-Math.PI/2;
// Separate frame strips leave the glass visible, with a deep wooden sill.
[0.83, 2.85].forEach(function(y) { mesh(new THREE.BoxGeometry(0.13, 0.09, bayWidth), windowTrim, W / 2 - 0.035, y, wz, winG); });
[-0.5, 0.5].forEach(function(edge) { mesh(new THREE.BoxGeometry(0.13, 2.1, 0.08), windowTrim, W / 2 - 0.035, 1.84, wz + edge * bayWidth, winG); });
mesh(new THREE.BoxGeometry(0.15, 0.045, bayWidth), windowTrim, W / 2 - 0.06, 1.95, wz, winG);

}
mesh(new THREE.BoxGeometry(0.32, 0.08, windowEnd-windowStart), darkWood, W / 2 - 0.13, 0.78, (windowStart+windowEnd)/2, winG);
// Streetlight spill: three soft pools reach across the carpet and furniture.
// Passing silhouettes cut the projected light rather than darkening unrelated parts of the room.
var spillCanvas=document.createElement('canvas');spillCanvas.width=spillCanvas.height=512;
var spillCtx=spillCanvas.getContext('2d'),spillTex=new THREE.CanvasTexture(spillCanvas);spillTex.minFilter=THREE.LinearFilter;spillTex.generateMipmaps=false;
var spillPlane=mesh(new THREE.PlaneGeometry(W,D),new THREE.MeshBasicMaterial({map:spillTex,transparent:true,opacity:0.56,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}),0,0.009,0);spillPlane.rotation.x=-Math.PI/2;spillPlane.raycast=function(){};
var streetLamps=[];
[0,2,4].forEach(function(bay){
var z=windowStart+(bay+.5)*bayWidth;
var light=new THREE.SpotLight(0xffcb82,0.6,8,0.73,0.85,1.4);light.position.set(W/2-.18,2.45,z);
light.target.position.set(-.5,.1,z-.55);scene.add(light);scene.add(light.target);streetLamps.push({light:light,z:z,bay:bay});
});
function updateStreetSpill(t){
var cx=spillCtx,w=512,h=512;cx.clearRect(0,0,w,h);
streetLamps.forEach(function(lamp){
var y=(lamp.z+D/2)/D*h,occlusion=0;
// Match the same walkers and direction used by the outside panorama.
var walkers=[];
for(var n=0;n<7;n++){
var dir=n%2?1:-1,px=((n*239+dir*t*(14+n*1.8))%1750+1750)%1750-100;
var z=windowStart+px/1536*(windowEnd-windowStart),dist=Math.abs(z-lamp.z);
if(dist<.85){walkers.push({z:z,n:n});occlusion=Math.max(occlusion,Math.max(0,1-dist/.6));}
}
lamp.light.intensity=.6*(1-occlusion*.45);
cx.save();cx.beginPath();cx.moveTo(w,y-25);cx.lineTo(w,y+25);cx.lineTo(85,y+75);cx.lineTo(85,y-106);cx.closePath();cx.clip();
var grad=cx.createLinearGradient(85,0,w,0);grad.addColorStop(0,'rgba(245,184,92,0)');grad.addColorStop(.55,'rgba(247,188,103,.16)');grad.addColorStop(1,'rgba(255,217,151,.46)');cx.fillStyle=grad;cx.fillRect(0,0,w,h);
// Sash and mullion shadows stay within each pool.
cx.globalCompositeOperation='destination-out';cx.fillStyle='rgba(0,0,0,.34)';
cx.beginPath();cx.moveTo(w,y-2);cx.lineTo(w,y+2);cx.lineTo(85,y-10);cx.lineTo(85,y-19);cx.closePath();cx.fill();
walkers.forEach(function(person){
var sy=(person.z+D/2)/D*h,lean=Math.sin(t*5+person.n*2)*5;
cx.save();cx.translate(385,sy);cx.rotate(-.17);cx.fillStyle='rgba(0,0,0,.67)';cx.shadowColor='rgba(0,0,0,.7)';cx.shadowBlur=9;
cx.beginPath();cx.ellipse(-56,0,53,9,0,0,Math.PI*2);cx.ellipse(-111,0,10,8,0,0,Math.PI*2);cx.fill();
cx.lineWidth=7;cx.strokeStyle='rgba(0,0,0,.6)';cx.beginPath();cx.moveTo(-12,-4);cx.lineTo(32,-8+lean);cx.moveTo(-12,4);cx.lineTo(33,9-lean);cx.stroke();cx.restore();
});cx.restore();
});spillTex.needsUpdate=true;
}
updateStreetSpill(0);
// Street exit, still at the far end, now on the street-facing right wall.
var doorG = new THREE.Group(); doorG.position.set(W / 2 - 0.09, 0, -3.7); doorG.rotation.y = -Math.PI / 2; scene.add(doorG);
var blue = new THREE.MeshStandardMaterial({ color: 0x1e4a9a, roughness: 0.45, metalness: 0.05 });
var blueDark = new THREE.MeshStandardMaterial({ color: 0x163a7a, roughness: 0.5 });
mesh(new THREE.BoxGeometry(1.06, 2.25, 0.08), blue, 0, 1.125, 0, doorG).castShadow = true;
mesh(new THREE.BoxGeometry(1.2, 0.1, 0.12), darkWood, 0, 2.3, 0, doorG);
mesh(new THREE.BoxGeometry(0.07, 2.35, 0.12), darkWood, -0.63, 1.175, 0, doorG);
mesh(new THREE.BoxGeometry(0.07, 2.35, 0.12), darkWood, 0.63, 1.175, 0, doorG);
mesh(new THREE.BoxGeometry(0.34, 0.78, 0.02), blueDark, -0.22, 1.55, 0.045, doorG);
mesh(new THREE.BoxGeometry(0.34, 0.78, 0.02), blueDark, 0.22, 1.55, 0.045, doorG);
mesh(new THREE.BoxGeometry(0.34, 0.6, 0.02), blueDark, -0.22, 0.55, 0.045, doorG);
mesh(new THREE.BoxGeometry(0.34, 0.6, 0.02), blueDark, 0.22, 0.55, 0.045, doorG);
mesh(new THREE.SphereGeometry(0.035, 10, 8), brass, 0.4, 1.05, 0.07, doorG);
// a small notice pinned to it
mesh(new THREE.PlaneGeometry(0.2, 0.26), new THREE.MeshStandardMaterial({ color: 0xe6dcc4, roughness: 0.9 }), 0.16, 1.92, 0.05, doorG);
// a thin line of light under it
var doorLight = new THREE.PointLight(0xffd090, 0.0, 1.6); doorLight.position.set(W / 2 - 0.35, 0.08, -3.7); scene.add(doorLight);
var doorGlow = mesh(new THREE.PlaneGeometry(1.0, 0.03), new THREE.MeshBasicMaterial({ color: 0xffd8a0, transparent: true, opacity: 0.0 }), 0, 0.035, 0.065, doorG);

// Small-object wear shared by the French's furnishings; deterministic, no new text.
function pubWear(base,seed,cloth){return tex(256,256,function(cx,w,h){
 cx.fillStyle=base;cx.fillRect(0,0,w,h);
 for(var n=0;n<1100;n++){cx.fillStyle=n%4?'rgba(225,211,181,0.07)':'rgba(25,23,19,0.09)';cx.fillRect((n*47+seed*13)%w,(n*83+seed*7)%h,cloth?1:2+n%5,1);}
 if(cloth){for(var y=0;y<h;y+=3){cx.fillStyle='rgba(0,0,0,0.055)';cx.fillRect(0,y,w,1);}for(var x=0;x<w;x+=3){cx.fillStyle='rgba(245,235,209,0.045)';cx.fillRect(x,0,1,h);}}
});}
function pubArc(parent,r,tube,material,x,y,z,span,turn){var o=mesh(new THREE.TorusGeometry(r,tube,6,32,span||Math.PI*2),material,x,y,z,parent);o.rotation.x=Math.PI/2;o.rotation.z=turn||0;return o;}
// ---------- STOOLS ----------
var stoolSeat = new THREE.MeshStandardMaterial({map:pubWear('#762d27',8,true),roughness:0.64,envMap:roomEnv,envMapIntensity:0.22});
var stoolLeg = new THREE.MeshStandardMaterial({map:pubWear('#3d2b1c',9,false),roughness:0.65,envMap:roomEnv,envMapIntensity:0.15});
function stool(x, z) {
var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rnd(x * 3 + z) * 6;
var cushion=mesh(new THREE.SphereGeometry(1,24,12),stoolSeat,0,0.72,0,g);cushion.scale.set(0.19,0.045,0.19);cushion.castShadow=true;
pubArc(g,0.184,0.003,stoolSeat,0,0.713,0);
var seatSeam=new THREE.MeshStandardMaterial({color:0xa35e48,roughness:0.85});
for(var stitch=0;stitch<28;stitch++){var angle=stitch/28*Math.PI*2;pubArc(g,0.178,0.0007,seatSeam,0,0.732,0,0.035,angle);}
mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.03, 18), stoolLeg, 0, 0.67, 0, g);
for (var l = 0; l < 4; l++) {
var a = l * Math.PI / 2 + 0.4;
var leg = mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.68, 6), stoolLeg, Math.cos(a) * 0.13, 0.34, Math.sin(a) * 0.13, g); leg.rotation.z = Math.cos(a) * 0.09; leg.rotation.x = -Math.sin(a) * 0.09;
}
var ring = mesh(new THREE.TorusGeometry(0.15, 0.008, 6, 28), new THREE.MeshStandardMaterial({color:0x72604a,roughness:0.6}), 0, 0.22, 0, g); ring.rotation.x = Math.PI / 2;
scene.add(g); return g;
}
var barDir = P2.clone().sub(P1).normalize(), barPerp = new THREE.Vector3(-barDir.z, 0, barDir.x); // perp points to the customers' side
var stools = [];
for (var st = 0; st < 5; st++) {
var pAlong = P1.clone().add(barDir.clone().multiplyScalar(0.9 + st * 1.05)).add(barPerp.clone().multiplyScalar(0.72));
stools.push(stool(pAlong.x, pAlong.z));
}
stool(3.0, -2.6); stool(3.05, -1.3); stool(1.9, -1.9); /* 2026-10-21: the two stools that stood by the door moved along to the ledge under the windows */
// a shelf on the right wall the stools sit at
mesh(new THREE.BoxGeometry(0.3, 0.05, 2.4), counterTop, W / 2 - 0.16, 1.05, -1.7); /* 2026-10-21 (Sam, playtest: "a plank of wood going across this bar, blocking the door ... the bar should be under the windows"): the ledge ran from z -4.1 to -1.7 and crossed the blue door at -3.7; it now runs under the first window bays, from -2.9 to -0.5 */

// THE GLASS someone left on the bar, with its ring
var glassG = new THREE.Group();
var gp = P1.clone().add(barDir.clone().multiplyScalar(3.9)).add(barPerp.clone().multiplyScalar(0.18));
glassG.position.set(gp.x, 1.14, gp.z); scene.add(glassG);
// Thick-footed everyday pub glasses: thin walls with actual inner surfaces.
var glassMat = new THREE.MeshPhysicalMaterial({ color:0xe4e9df,roughness:0.12,metalness:0,envMap:roomEnv,envMapIntensity:0.75,clearcoat:0.65,clearcoatRoughness:0.15,transparent:true,opacity:0.10,depthWrite:false,side:THREE.DoubleSide });
var glassFootMat=new THREE.MeshPhysicalMaterial({color:0xcdd7ce,roughness:0.22,metalness:0,envMap:roomEnv,envMapIntensity:0.65,transparent:true,opacity:0.34,depthWrite:false});
var glassWearMat=new THREE.MeshStandardMaterial({color:0xd6d1be,roughness:0.75,transparent:true,opacity:0.12,depthWrite:false});
function pubGlass(parent,radius,height,seed){
 var base=radius*0.83,wall=0.00125;
 var profile=[[0,0.001],[base*0.85,0.001],[base,0.003],[base,height*0.1],[radius*0.97,height*0.94],[radius,height-0.001],[radius-wall,height],[radius-wall,height*0.96],[base-wall,0.009],[0,0.009]].map(function(p){return new THREE.Vector2(p[0],p[1]);});
 mesh(new THREE.LatheGeometry(profile,32),glassMat,0,0,0,parent);
 mesh(new THREE.CylinderGeometry(base*0.96,base*0.91,0.006,32),glassFootMat,0,0.004,0,parent);
 var lip=mesh(new THREE.TorusGeometry(radius-wall*0.5,0.0007,6,40),glassFootMat,0,height-0.0005,0,parent);lip.rotation.x=Math.PI/2;
 // A few fine washing scuffs and a faint drying trace, never a frosted shell.
 for(var mark=0;mark<4;mark++){
  var y=height*(0.2+mark*0.17),r=base+(radius-base)*y/height;
  var scuff=mesh(new THREE.TorusGeometry(r+0.0002,0.00022,3,12,0.20+mark*0.045),glassWearMat,0,y,0,parent);
  scuff.rotation.set(Math.PI/2,0,seed*0.7+mark*1.9);
 }
}
pubGlass(glassG,0.036,0.12,3);
var aleMat=new THREE.MeshPhysicalMaterial({color:0x99601c,roughness:0.2,metalness:0,envMap:roomEnv,envMapIntensity:0.4,transparent:true,opacity:0.72,depthWrite:false});
mesh(new THREE.CylinderGeometry(0.0307,0.0282,0.033,32),aleMat,0,0.0255,0,glassG);
var meniscus=mesh(new THREE.TorusGeometry(0.0304,0.00065,5,32),new THREE.MeshStandardMaterial({color:0xc69850,roughness:0.35,transparent:true,opacity:0.35,depthWrite:false}),0,0.042,0,glassG);meniscus.rotation.x=Math.PI/2;
var ringMark = mesh(new THREE.RingGeometry(0.03, 0.044, 24), new THREE.MeshBasicMaterial({ color: 0xffe6b0, transparent: true, opacity: 0.16, depthWrite: false }), 0.045, 0.001, 0.03, glassG); ringMark.rotation.x = -Math.PI / 2;
var glassProxy = mesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }), 0, 0.05, 0, glassG);
// THE ORANGE PAPERBACK: illustrated front uppermost; clicked, it gives its title and nothing else
var bookG = new THREE.Group();
var bp = P1.clone().add(barDir.clone().multiplyScalar(3.25)).add(barPerp.clone().multiplyScalar(0.2));
bookG.position.set(bp.x, 1.14, bp.z); bookG.rotation.y = Math.atan2(barDir.x, barDir.z) + 0.35; scene.add(bookG);
mesh(new THREE.BoxGeometry(0.115, 0.022, 0.178), new THREE.MeshStandardMaterial({ color: 0xf0e6cc, roughness: 0.9 }), 0, 0.011, 0, bookG);
mesh(new THREE.BoxGeometry(0.118, 0.004, 0.18), new THREE.MeshStandardMaterial({ color: 0xd8641c, roughness: 0.7 }), 0, 0.024, 0, bookG);
var orangeFront = mesh(new THREE.PlaneGeometry(0.118, 0.18), window.dssOrangePaperbackCover(), 0, 0.0261, 0, bookG); orangeFront.rotation.x = -Math.PI / 2; orangeFront.rotation.z = Math.PI;
mesh(new THREE.BoxGeometry(0.006, 0.026, 0.18), new THREE.MeshStandardMaterial({ color: 0xe0701e, roughness: 0.6, emissive: 0x401800, emissiveIntensity: 0.3 }), -0.059, 0.013, 0, bookG);
mesh(new THREE.SphereGeometry(0.17, 8, 6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }), 0, 0.03, 0, bookG);

// ---------- THE PEOPLE, barely there ----------
function ghostTex(seed) { return window.dssGhostTex(tex, rnd, seed, false, true, [255, 225, 180]); }
var ghosts = [];
// along the counter, on the customers' side: the man at the bar at the second stool, the painter at the fourth, a third trace beyond the end of the bar
[[1.95, 0.8, 0, 1.0, 0], [4.05, 0.8, 0, 0.9, 2], [5.7, 1.4, 0, 0.62, 4]].forEach(function(gs, i) {
var pAt = P1.clone().add(barDir.clone().multiplyScalar(gs[0])).add(barPerp.clone().multiplyScalar(gs[1]));
var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ghostTex(gs[4]), transparent: true, opacity: gs[3] * 0.8, depthWrite: false, blending: THREE.NormalBlending }));
sp.scale.set(0.9, 1.8, 1); sp.position.set(pAt.x, 0.9, pAt.z); scene.add(sp);
// a slim unseen body to click, so a tap on the counter beside a figure is the counter's
var hit = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8), new THREE.MeshBasicMaterial({ visible: false }));
hit.position.set(pAt.x, 0.95, pAt.z); scene.add(hit);
ghosts.push({ sp: sp, hit: hit, base: gs[3] * 0.8, ph: i * 2.1 });
});

// ---------- LIGHT ----------
scene.add(new THREE.AmbientLight(0x68513a, 0.2));
scene.add(new THREE.HemisphereLight(0xa58153, 0x160d09, 0.2));
var globeMat = new THREE.MeshBasicMaterial({ color: 0xfff0d0, fog: false, toneMapped: false });
var glowTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,225,160,0.9)'); g.addColorStop(0.3, 'rgba(255,190,100,0.35)'); g.addColorStop(0.7, 'rgba(220,140,50,0.08)'); g.addColorStop(1, 'rgba(180,100,30,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function globeGlow(x, y, z, sc) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0.66, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, fog: false, toneMapped: false })); sp.scale.set(sc, sc, 1); sp.position.set(x, y, z); scene.add(sp); return sp; }
var lampMain = new THREE.PointLight(0xffd09a, 1.5, 9, 1.7); lampMain.position.set(0.4, 2.85, -0.3); lampMain.castShadow = true; lampMain.shadow.mapSize.set(512, 512); lampMain.shadow.bias = -0.001; lampMain.shadow.normalBias = 0.025; lampMain.shadow.radius = 3; lampMain.shadow.camera.near = 0.15; lampMain.shadow.camera.far = 10; scene.add(lampMain);
mesh(new THREE.SphereGeometry(0.16, 16, 12), globeMat, 0.4, 2.85, -0.3); var mainGlow = globeGlow(0.4, 2.85, -0.3, 1.35);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), brass, 0.4, 3.15, -0.3);
var ceilPoolMat = new THREE.MeshBasicMaterial({ map: glowTex, color: 0xffd8a0, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false });
[[0.4, -0.3, 2.6], [-0.6, -2.6, 2.3]].forEach(function(cp) { var pool = mesh(new THREE.PlaneGeometry(cp[2], cp[2]), ceilPoolMat, cp[0], H - 0.01, cp[1]); pool.rotation.x = Math.PI / 2; });
var lampBack = new THREE.PointLight(0xffc486, 1.0, 8, 1.7); lampBack.position.set(-0.6, 2.85, -2.6); scene.add(lampBack);
mesh(new THREE.SphereGeometry(0.16, 16, 12), globeMat, -0.6, 2.85, -2.6); var backGlow = globeGlow(-0.6, 2.85, -2.6, 1.2);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), brass, -0.6, 3.15, -2.6);
var barLight = new THREE.PointLight(0xffc992, 0.28, 6, 2); barLight.position.set(-2.9, 2.4, 0.4); scene.add(barLight);
var winSpillTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(w * 0.85, h * 0.5, 0, w * 0.85, h * 0.5, w * 0.8); g.addColorStop(0, 'rgba(225,215,200,0.5)'); g.addColorStop(0.3, 'rgba(210,200,190,0.22)'); g.addColorStop(1, 'rgba(190,185,180,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); cx.globalCompositeOperation = 'destination-out'; cx.fillStyle = 'rgba(0,0,0,0.55)'; for (var i = 0; i < 6; i++) cx.fillRect(0, 8 + i * 20, w, 3); });
var winSpill = mesh(new THREE.PlaneGeometry(2.2, 1.6), new THREE.MeshBasicMaterial({ map: winSpillTex, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), W / 2 - 1.15, 0.006, -2.4); winSpill.rotation.x = -Math.PI / 2; winSpill.rotation.z = 0; // the street's lamp comes in at the window
var winLight = new THREE.PointLight(0xe8dcc8, 0.42, 5, 2); winLight.position.set(3.2, 2.0, -2.4); scene.add(winLight);
// Contact shadow under each stool; broad penumbra from the opal globes.
var contactTex = tex(64, 64, function(cx, w, h) { var g = cx.createRadialGradient(32,32,3,32,32,32); g.addColorStop(0,'rgba(0,0,0,0.34)'); g.addColorStop(0.45,'rgba(0,0,0,0.2)'); g.addColorStop(1,'rgba(0,0,0,0)'); cx.fillStyle=g; cx.fillRect(0,0,w,h); });
stools.forEach(function(st) { var shadow = mesh(new THREE.PlaneGeometry(0.85, 0.85), new THREE.MeshBasicMaterial({map:contactTex,transparent:true,depthWrite:false}),st.position.x,0.004,st.position.z); shadow.rotation.x=-Math.PI/2; });
// The shadow casters are static. Keep the six cube-map faces off the frame loop.
renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true;
// A little suspended smoke around the opal lamps, never a visible beam.
var hazeTex = tex(128,128,function(cx,w,h) { var g=cx.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0,'rgba(208,181,139,0.22)'); g.addColorStop(0.35,'rgba(171,137,94,0.13)'); g.addColorStop(1,'rgba(111,82,51,0)'); cx.fillStyle=g; cx.fillRect(0,0,w,h); });
var haze = [];
[[0.4,2.35,-0.3],[-0.6,2.35,-2.6]].forEach(function(p) {
var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:hazeTex,transparent:true,opacity:0.14,depthWrite:false,blending:THREE.AdditiveBlending})); sp.position.set(p[0],p[1],p[2]); sp.scale.set(2.4,1.7,1); scene.add(sp); haze.push(sp);
});
// Soft specks, confined to the lamp pools; no square foreground confetti.
var dustTex = tex(32,32,function(cx,w,h) { var g=cx.createRadialGradient(16,16,0,16,16,16); g.addColorStop(0,'rgba(255,237,197,0.85)'); g.addColorStop(0.22,'rgba(255,237,197,0.4)'); g.addColorStop(1,'rgba(255,237,197,0)'); cx.fillStyle=g; cx.fillRect(0,0,w,h); });
var moteN = 48, moteBase = new Float32Array(moteN * 3), motePos = new Float32Array(moteN * 3), moteColors = new Float32Array(moteN * 3);
for(var mi=0;mi<moteN;mi++) {
var lp=mi%2 ? [-0.6,-2.6] : [0.4,-0.3], angle=rnd(mi*7)*Math.PI*2, radius=0.15+rnd(mi*11)*1.1;
moteBase[mi*3]=lp[0]+Math.cos(angle)*radius; moteBase[mi*3+1]=0.6+rnd(mi+1)*2.15; moteBase[mi*3+2]=lp[1]+Math.sin(angle)*radius;
var strength=0.2+0.65*rnd(mi+31); moteColors[mi*3]=strength; moteColors[mi*3+1]=strength*0.83; moteColors[mi*3+2]=strength*0.58;
}
motePos.set(moteBase);
var moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position',new THREE.BufferAttribute(motePos,3)); moteGeo.setAttribute('color',new THREE.BufferAttribute(moteColors,3));
scene.add(new THREE.Points(moteGeo,new THREE.PointsMaterial({map:dustTex,vertexColors:true,size:0.017,transparent:true,opacity:0.3,depthWrite:false,blending:THREE.AdditiveBlending})));

// ---------- THE PARTICULARS (what the outside scenes have) ----------
// Lettering here is the room's dressing, not Sam's text: gilt on the mirror,
// the house rules, an enamel plate, a chalkboard, a notice on the door.
function signTex(w, h, fn) { return tex(w, h, function(cx, ww, hh) { cx.clearRect(0, 0, ww, hh); fn(cx, ww, hh); }); }
function signMat(t, em) { return new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.5, metalness: em ? 0.6 : 0, emissive: em ? 0xffe6b0 : 0x000000, emissiveMap: em ? t : null, emissiveIntensity: em ? 0.18 : 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }); }
// gilt across the mirror
var giltTex = signTex(2048, 400, function(cx, w, h) {
cx.textAlign = 'center'; cx.textBaseline = 'middle';
var gold=cx.createLinearGradient(0,65,0,205);gold.addColorStop(0,'#bd8432');gold.addColorStop(.36,'#ffe8a3');gold.addColorStop(.49,'#fff3c4');gold.addColorStop(.63,'#e7be61');gold.addColorStop(1,'#c18b39');cx.fillStyle = gold; cx.strokeStyle = 'rgba(90,60,20,0.7)'; cx.lineWidth = 3;
cx.font = 'bold 118px Georgia, serif'; cx.strokeText('THE FRENCH HOUSE', w / 2, h * 0.36); cx.fillText('THE FRENCH HOUSE', w / 2, h * 0.36);
cx.font = 'italic 56px Georgia, serif'; cx.fillStyle = 'rgba(246,215,142,0.98)';
cx.fillText('vins  ·  bières  ·  pastis  ·  half pints only', w / 2, h * 0.7);
cx.strokeStyle = 'rgba(245,209,127,0.9)'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(w * 0.1, h * 0.55); cx.lineTo(w * 0.9, h * 0.55); cx.stroke();
});
var gilt = mesh(new THREE.PlaneGeometry(5.3, 0.62), new THREE.MeshPhysicalMaterial({map:giltTex,transparent:true,roughness:0.27,metalness:0.58,clearcoat:0.7,clearcoatRoughness:0.2,envMap:roomEnv,envMapIntensity:1.1,emissive:0xffe4a2,emissiveMap:giltTex,emissiveIntensity:0.48,depthWrite:false}), bbX + 0.38, 1.94, 0.4); gilt.rotation.y = Math.PI / 2;
// the house rules, framed on the right wall
var rulesTex = signTex(512, 640, function(cx, w, h) {
cx.fillStyle = '#e7dcc0'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 3000; i++) { cx.fillStyle = 'rgba(80,60,30,0.08)'; cx.fillRect(rnd(i) * w, rnd(i + 5) * h, 2, 2); }
cx.fillStyle = '#2a1a10'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
cx.font = 'bold 54px Georgia, serif'; cx.fillText('HOUSE RULES', w / 2, 90);
cx.font = '40px Georgia, serif';
['NO MUSIC', 'NO MACHINES', 'NO TELEVISION', 'NO MOBILE PHONES', 'HALF PINTS ONLY'].forEach(function(l, i) { cx.fillText(l, w / 2, 190 + i * 78); });
cx.font = 'italic 30px Georgia, serif'; cx.fillText('the management', w / 2, h - 60);
cx.strokeStyle = '#5a3a20'; cx.lineWidth = 6; cx.strokeRect(14, 14, w - 28, h - 28);
});
mesh(new THREE.BoxGeometry(0.03, 0.62, 0.5), frameMat, W / 2 - 0.035, 2.05, 1.4);
var rules = mesh(new THREE.PlaneGeometry(0.44, 0.55), new THREE.MeshStandardMaterial({ map: rulesTex, roughness: 0.85 }), W / 2 - 0.055, 2.05, 1.4); rules.rotation.y = -Math.PI / 2;
// an enamel plate by the window
var ricardTex = signTex(512, 256, function(cx, w, h) {
cx.fillStyle = '#f2c72a'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#1c3f8f'; cx.fillRect(18, 18, w - 36, h - 36);
cx.fillStyle = '#f2c72a'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.font = 'bold 120px Arial, sans-serif'; cx.fillText('RICARD', w / 2, h / 2 - 8);
cx.font = '28px Arial, sans-serif'; cx.fillText('PASTIS DE MARSEILLE', w / 2, h - 52);
for (var i = 0; i < 400; i++) { cx.fillStyle = 'rgba(60,40,20,0.25)'; cx.fillRect(rnd(i + 9) * w, rnd(i + 13) * h, 2, 1); }
for(var chip=0;chip<50;chip++){cx.fillStyle=chip%3?'#817b67':'#51432f';var x=chip%2?3:w-5,y=(chip*47)%h;cx.fillRect(x,y,2+chip%4,2+chip%5);}
[[9,9],[w-9,9],[9,h-9],[w-9,h-9]].forEach(function(p){cx.fillStyle='#8d846c';cx.beginPath();cx.arc(p[0],p[1],3.5,0,Math.PI*2);cx.fill();cx.strokeStyle='#3d3c34';cx.beginPath();cx.moveTo(p[0]-2,p[1]);cx.lineTo(p[0]+2,p[1]);cx.stroke();});
});
var ricard = mesh(new THREE.PlaneGeometry(0.5, 0.25), new THREE.MeshStandardMaterial({ map: ricardTex, roughness: 0.35, metalness: 0.2, envMap: roomEnv, envMapIntensity: 0.3 }), W / 2 - 0.04, 2.55, -1.2); ricard.rotation.y = -Math.PI / 2;
// the tricolore hung from the cornice at the back
var flagTex = signTex(96, 64, function(cx, w, h) { cx.fillStyle = '#1d3f8a'; cx.fillRect(0, 0, w / 3, h); cx.fillStyle = '#f0ece0'; cx.fillRect(w / 3, 0, w / 3, h); cx.fillStyle = '#c62a2a'; cx.fillRect(2 * w / 3, 0, w / 3, h);
for(var thread=0;thread<w;thread+=2){cx.fillStyle='rgba(230,216,183,0.1)';cx.fillRect(thread,0,1,h);}for(var thread=0;thread<h;thread+=2){cx.fillStyle='rgba(36,31,27,0.1)';cx.fillRect(0,thread,w,1);}
});
var flag = mesh(new THREE.PlaneGeometry(0.42, 0.28, 16, 8), new THREE.MeshStandardMaterial({ map: flagTex, roughness: 0.9, side: THREE.DoubleSide }), 1.25, 2.68, -D / 2 + 0.09);
(function() { var p = flag.geometry.attributes.position; for (var i = 0; i < p.count; i++) { p.setZ(i,Math.sin(p.getX(i)*19)*0.012+Math.sin(p.getY(i)*12+p.getX(i)*7)*0.008);if(p.getY(i)<-0.13)p.setY(i,p.getY(i)+0.003*Math.sin(p.getX(i)*90)); } p.needsUpdate = true; flag.geometry.computeVertexNormals(); })();
flag.rotation.z = -0.06;
mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.5, 6), brass, 1.25, 2.83, -D / 2 + 0.09).rotation.z = Math.PI / 2;
// chalkboard under the photographs
var chalkTex = signTex(512, 384, function(cx, w, h) {
cx.fillStyle = '#1c2420'; cx.fillRect(0, 0, w, h);
for(var wipe=0;wipe<24;wipe++){cx.strokeStyle='rgba(205,205,184,0.035)';cx.lineWidth=8+wipe%9;cx.beginPath();cx.moveTo(15,(wipe*47)%h);cx.bezierCurveTo(100,(wipe*47)%h+13,320,(wipe*47)%h-8,w-20,(wipe*47)%h+7);cx.stroke();}
for (var i = 0; i < 4000; i++) { cx.fillStyle = 'rgba(230,230,220,0.05)'; cx.fillRect(rnd(i + 3) * w, rnd(i + 7) * h, 2, 2); }
cx.fillStyle = '#e8e4d4'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
cx.font = 'italic bold 52px Georgia, serif'; cx.fillText('vin du jour', w / 2, 64);
cx.font = '36px Georgia, serif';
[['Côtes du Rhône', '£4.20'], ['Muscadet sur lie', '£4.60'], ['Ricard, the measure', '£3.80'], ['Breton cider', '£3.90']].forEach(function(l, i) { cx.textAlign = 'left'; cx.fillText(l[0], 44, 150 + i * 56); cx.textAlign = 'right'; cx.fillText(l[1], w - 44, 150 + i * 56); });
cx.textAlign = 'center'; cx.font = 'italic 28px Georgia, serif'; cx.fillText('no pints. do not ask.', w / 2, h - 34);
for(var skip=0;skip<1900;skip++){cx.fillStyle='rgba(28,36,32,0.28)';cx.fillRect((skip*47)%w,(skip*83)%h,1,1);}
cx.strokeStyle='rgba(185,147,94,0.38)';cx.lineWidth=3;cx.strokeRect(2,2,w-4,h-4);
});
mesh(new THREE.BoxGeometry(0.66, 0.5, 0.03), frameMat, -1.6, 1.42, -D / 2 + 0.05);
mesh(new THREE.PlaneGeometry(0.6, 0.44), new THREE.MeshStandardMaterial({ map: chalkTex, roughness: 0.95 }), -1.6, 1.42, -D / 2 + 0.07);
// a notice on the blue door
var privTex = signTex(256, 320, function(cx, w, h) { cx.fillStyle = '#e6dcc4'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#2a1a10'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.font = 'bold 60px Georgia, serif'; cx.fillText('PRIVÉ', w / 2, 100); cx.font = '30px Georgia, serif'; cx.fillText('staff and', w / 2, 190); cx.fillText('the upstairs', w / 2, 230);
var fade=cx.createLinearGradient(0,0,w,h);fade.addColorStop(0,'rgba(102,76,36,0.2)');fade.addColorStop(0.2,'rgba(102,76,36,0)');fade.addColorStop(0.8,'rgba(102,76,36,0)');fade.addColorStop(1,'rgba(102,76,36,0.2)');cx.fillStyle=fade;cx.fillRect(0,0,w,h);
[[10,10],[w-10,10],[10,h-10],[w-10,h-10]].forEach(function(p){cx.fillStyle='#8b8067';cx.beginPath();cx.arc(p[0],p[1],2.5,0,Math.PI*2);cx.fill();});
});
mesh(new THREE.PlaneGeometry(0.2, 0.26), new THREE.MeshStandardMaterial({ map: privTex, roughness: 0.9 }), 0.16, 1.92, 0.052, doorG);
// half-pint glasses in a row on the back bar, and pewter on the top shelf
var pewter = new THREE.MeshStandardMaterial({ color: 0x8e8a80, roughness: 0.42, metalness: 0.85, envMap: roomEnv, envMapIntensity: 0.6 });
for (var hp = 0; hp < 7; hp++) {
var gz = 0.55 + hp * 0.16 + (rnd(hp + 40) - 0.5) * 0.03;
var hg=new THREE.Group();hg.position.set(bbX+0.34,1.245,gz);scene.add(hg);pubGlass(hg,0.031,0.1,hp);
}
for (var pw = 0; pw < 4; pw++) {
var pz = 1.9 + pw * 0.26, pg = new THREE.Group(); pg.position.set(bbX + 0.12, 2.735, pz); scene.add(pg);
var tankardProfile=[[0,0],[0.05,0],[0.05,0.012],[0.045,0.14],[0.041,0.14],[0.045,0.012],[0,0.012]].map(function(p){return new THREE.Vector2(p[0],p[1]);});
mesh(new THREE.LatheGeometry(tankardProfile,28),pewter,0,0,0,pg);pubArc(pg,0.043,0.0025,pewter,0,0.14,0);pubArc(pg,0.049,0.002,pewter,0,0.012,0);
pewter.map=pubWear('#a5a095',18,false);pewter.roughness=0.58;pewter.needsUpdate=true;
var pwh = mesh(new THREE.TorusGeometry(0.035, 0.008, 6, 14, Math.PI), pewter, 0.05, 0.08, 0, pg); pwh.rotation.y = Math.PI / 2; pwh.rotation.z = -Math.PI / 2;
}
// a pastis jug and water, beer mats and an ashtray along the counter
function onBar(along, across, y) { var p = P1.clone().add(barDir.clone().multiplyScalar(along)).add(barPerp.clone().multiplyScalar(across)); return [p.x, y, p.z]; }
var jugPos = onBar(2.9, 0.1, 1.14);
var jugMat=new THREE.MeshPhysicalMaterial({map:pubWear('#e7dcb4',4,false),color:0xf4ead4,roughness:0.3,clearcoat:0.55,envMap:roomEnv,envMapIntensity:0.45,side:THREE.DoubleSide});
var jugProfile=[[0,0],[0.055,0],[0.06,0.014],[0.057,0.14],[0.048,0.19],[0.05,0.2],[0.045,0.2],[0.043,0.19],[0.051,0.025],[0,0.025]].map(function(p){return new THREE.Vector2(p[0],p[1]);});
var jug=mesh(new THREE.LatheGeometry(jugProfile,32),jugMat,jugPos[0],jugPos[1],jugPos[2]);
var jHandle=mesh(new THREE.TorusGeometry(0.052,0.008,8,20,Math.PI*1.25),jugMat,jugPos[0]-0.047,jugPos[1]+0.105,jugPos[2]);jHandle.rotation.z=Math.PI*0.38;
var jSpout=mesh(new THREE.SphereGeometry(1,16,8),jugMat,jugPos[0]+0.043,jugPos[1]+0.192,jugPos[2]);jSpout.scale.set(0.026,0.009,0.024);
var jugLabel = signTex(128, 64, function(cx, w, h) { cx.fillStyle = '#1c3f8f'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#f2c72a'; cx.font = 'bold 40px Arial'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('RICARD', w / 2, h / 2); });
var jl = mesh(new THREE.PlaneGeometry(0.11, 0.055), new THREE.MeshStandardMaterial({ map: jugLabel, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -1 }), jugPos[0], jugPos[1] + 0.1, jugPos[2]); jl.position.add(barPerp.clone().multiplyScalar(0.061)); jl.rotation.y = Math.atan2(barPerp.x, barPerp.z);
var matTex = signTex(128, 128, function(cx, w, h) { cx.fillStyle = '#e8ddc2'; cx.fillRect(0, 0, w, h); cx.strokeStyle = '#8a2a2a'; cx.lineWidth = 6; cx.beginPath(); cx.arc(w / 2, h / 2, 48, 0, Math.PI * 2); cx.stroke(); cx.fillStyle = '#8a2a2a'; cx.font = 'bold 22px Georgia'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('FRENCH', w / 2, h / 2 - 12); cx.fillText('HOUSE', w / 2, h / 2 + 12);
for(var stain=0;stain<3;stain++){cx.strokeStyle='rgba(104,73,37,0.13)';cx.lineWidth=2+stain;cx.beginPath();cx.arc(51+stain*9,68,37+stain,0,Math.PI*2);cx.stroke();}
for(var fibre=0;fibre<700;fibre++){cx.fillStyle=fibre%3?'rgba(248,237,205,0.2)':'rgba(97,79,48,0.12)';cx.fillRect((fibre*47)%w,(fibre*71)%h,1,1);}
cx.globalCompositeOperation='destination-out';for(var chip=0;chip<24;chip++){cx.beginPath();cx.arc(chip%2?0:w,(chip*37)%h,1+chip%3,0,Math.PI*2);cx.fill();}
});
[1.2, 2.3, 4.6].forEach(function(al, i) { var p = onBar(al, 0.05 + rnd(i + 60) * 0.15, 1.142); var bm = mesh(new THREE.PlaneGeometry(0.11, 0.11), new THREE.MeshStandardMaterial({ map: matTex, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -1 }), p[0], p[1], p[2]); bm.rotation.x = -Math.PI / 2; bm.rotation.z = rnd(i + 70) * 6; });
var ashPos = onBar(3.3, -0.05, 1.14);
var ashG=new THREE.Group();ashG.position.set(ashPos[0],ashPos[1],ashPos[2]);scene.add(ashG);
var ashGlass=new THREE.MeshPhysicalMaterial({color:0xb6bca9,roughness:0.32,metalness:0,envMap:roomEnv,envMapIntensity:0.55,clearcoat:0.4,transparent:true,opacity:0.3,depthWrite:false,side:THREE.FrontSide});
var ashProfile=[[0,0.001],[0.039,0.001],[0.047,0.005],[0.051,0.018],[0.050,0.023],[0.045,0.024],[0.039,0.010],[0,0.009]].map(function(p){return new THREE.Vector2(p[0],p[1]);});
mesh(new THREE.LatheGeometry(ashProfile,40),ashGlass,0,0,0,ashG);
// Four low rim rests, worn smooth where cigarettes were laid.
for(var rest=0;rest<4;rest++){pubArc(ashG,0.047,0.0022,ashGlass,0,0.023,0,Math.PI/2-0.12,rest*Math.PI/2+0.06);}
var ashGrey=new THREE.MeshStandardMaterial({color:0x77736a,roughness:1});
var ashDust=tex(128,128,function(cx,w,h){cx.clearRect(0,0,w,h);var tar=cx.createRadialGradient(57,72,4,64,64,62);tar.addColorStop(0,'rgba(61,46,27,0.65)');tar.addColorStop(0.7,'rgba(83,65,39,0.32)');tar.addColorStop(1,'rgba(83,65,39,0)');cx.fillStyle=tar;cx.fillRect(0,0,w,h);for(var n=0;n<900;n++){var angle=n*2.39996,r=Math.sqrt((n*37%907)/907)*57;cx.fillStyle=n%3?'rgba(102,98,88,0.54)':'rgba(193,184,161,0.68)';cx.fillRect(64+Math.cos(angle)*r,64+Math.sin(angle)*r,1+n%4,1+n%2);}});
var dust=mesh(new THREE.CircleGeometry(0.036,32),new THREE.MeshStandardMaterial({map:ashDust,transparent:true,roughness:1,depthWrite:false}),0,0.0095,0,ashG);dust.rotation.x=-Math.PI/2;
var buttPaper=new THREE.MeshStandardMaterial({map:pubWear('#d8ceb3',19,false),roughness:0.95});
var buttFilter=new THREE.MeshStandardMaterial({map:pubWear('#9b6c39',23,false),roughness:1});
for(var end=0;end<3;end++){
 var butt=new THREE.Group();butt.position.set((end-1)*0.016,0.012,(end%2)*0.015-0.009);butt.rotation.y=end*1.8+0.4;ashG.add(butt);
 var paper=mesh(new THREE.CylinderGeometry(0.0031,0.0034,0.014+end*0.003,10),buttPaper,0,0,0,butt);paper.rotation.z=Math.PI/2;
 var filter=mesh(new THREE.CylinderGeometry(0.0034,0.0034,0.009,10),buttFilter,-0.011,0,0,butt);filter.rotation.z=Math.PI/2;
 var char=mesh(new THREE.SphereGeometry(0.0034,8,6),ashGrey,0.008+end*0.0015,0,0,butt);char.scale.x=0.55;
}
for(var fleck=0;fleck<15;fleck++){var angle=fleck*2.4,r=0.008+(fleck*7%23)/1000;var crumb=mesh(new THREE.SphereGeometry(0.0007+fleck%3*0.0002,5,4),ashGrey,Math.cos(angle)*r,0.0105,Math.sin(angle)*r,ashG);crumb.scale.y=0.4;}

// wall lamps with parchment shades on the right wall; a lamp on the back bar
var shadeMat = new THREE.MeshStandardMaterial({ color: 0xf0d8a8, emissive: 0xffc880, emissiveIntensity: 0.55, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.92 });
shadeMat.map=pubWear('#d3c29c',22,true);shadeMat.needsUpdate=true;
var lampGlows = [];
[-0.6, 2.4].forEach(function(z) {
var g = new THREE.Group(); g.position.set(W / 2 - 0.02, 2.25, z); scene.add(g);
mesh(new THREE.BoxGeometry(0.03, 0.12, 0.06), brass, 0, 0, 0, g);
var arm = mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.22, 6), brass, -0.11, 0.02, 0, g); arm.rotation.z = Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.13, 14, 1, true), shadeMat, -0.22, 0.05, 0, g);
pubArc(g,0.089,0.0025,brass,-0.22,-0.015,0);pubArc(g,0.05,0.0015,brass,-0.22,0.115,0);
mesh(new THREE.SphereGeometry(0.02, 8, 6), globeMat, -0.22, 0.03, 0, g);
var pl = new THREE.PointLight(0xffc888, 0.5, 3.4, 2); pl.position.set(-0.24, 0.02, 0); g.add(pl);
lampGlows.push(globeGlow(W / 2 - 0.26, 2.27, z, 0.55));
});
var blG = new THREE.Group(); blG.position.set(bbX + 0.3, 1.245, 2.55); scene.add(blG);
mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.02, 14), brass, 0, 0.01, 0, blG);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.34, 8), brass, 0, 0.18, 0, blG);
mesh(new THREE.CylinderGeometry(0.06, 0.12, 0.12, 16, 1, true), new THREE.MeshStandardMaterial({ map:pubWear('#315238',21,false),color:0xb8c1a3,emissive:0x273f24,emissiveIntensity:0.12,roughness:0.32,side:THREE.DoubleSide }), 0, 0.4, 0, blG);
mesh(new THREE.SphereGeometry(0.025, 8, 6), globeMat, 0, 0.36, 0, blG);
pubArc(blG,0.117,0.0025,brass,0,0.342,0);
mesh(new THREE.SphereGeometry(0.009,10,8),bakelite,0.021,0.18,0,blG);
var blLight = new THREE.PointLight(0xffd8a0, 0.55, 3, 2); blLight.position.set(0, 0.34, 0); blG.add(blLight);
lampGlows.push(globeGlow(bbX + 0.3, 1.6, 2.55, 0.5));
// a coat on a hook by the door end of the right wall
mesh(new THREE.SphereGeometry(0.02, 8, 6), brass, W / 2 - 0.04, 1.95, 3.3);
var coatMat=new THREE.MeshStandardMaterial({map:pubWear('#39362e',26,true),roughness:0.96,side:THREE.DoubleSide});
var coatG=new THREE.Group();coatG.position.set(W/2-0.16,1.5,3.3);scene.add(coatG);
var coatGeo=new THREE.CylinderGeometry(0.065,0.18,0.84,24,12,true),cp=coatGeo.attributes.position;
for(var v=0;v<cp.count;v++){var x=cp.getX(v),y=cp.getY(v),z=cp.getZ(v),angle=Math.atan2(z,x),fold=1+0.1*Math.sin(angle*7+y*2);cp.setXYZ(v,x*0.55*fold,y+0.014*Math.sin(angle*5),z*fold);}coatGeo.computeVertexNormals();
mesh(coatGeo,coatMat,0,0,0,coatG);
[-1,1].forEach(function(side){var sleeve=mesh(new THREE.CylinderGeometry(0.038,0.048,0.52,12,5),coatMat,0,0.08,side*0.12,coatG);sleeve.rotation.x=side*0.17;});
var collar=mesh(new THREE.TorusGeometry(0.054,0.015,6,16,Math.PI*1.5),coatMat,0,0.405,0,coatG);collar.rotation.y=Math.PI/2;
var hatMat=new THREE.MeshStandardMaterial({map:pubWear('#554535',30,true),roughness:0.95});
var hatG=new THREE.Group();hatG.position.set(W/2-0.14,2.02,3.3);hatG.rotation.z=0.12;scene.add(hatG);
var brim=mesh(new THREE.SphereGeometry(1,24,10),hatMat,0,-0.018,0,hatG);brim.scale.set(0.12,0.009,0.14);
var crown=mesh(new THREE.SphereGeometry(1,20,12),hatMat,0,0.012,0,hatG);crown.scale.set(0.085,0.05,0.1);
var band=mesh(new THREE.CylinderGeometry(0.087,0.09,0.015,24,1,true),new THREE.MeshStandardMaterial({color:0x29251f,roughness:0.85}),0,-0.004,0,hatG);band.scale.z=1.13;
// a broad contact shadow under the bar's foot and the pillar
[[P1, P2]].forEach(function() { var cs = mesh(new THREE.PlaneGeometry(1.2, barLen + 0.4), new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false, opacity: 0.8 }), barMid.x, 0.003, barMid.z); cs.rotation.x = -Math.PI / 2; cs.rotation.z = -barAng; cs.position.add(barPerp.clone().multiplyScalar(0.3)); });
var pcs = mesh(new THREE.PlaneGeometry(1.0, 1.0), new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false }), 3.05, 0.004, 0.2); pcs.rotation.x = -Math.PI / 2;
renderer.shadowMap.needsUpdate = true;

// ---------- THE CLOSE-UPS, AND THE PATHS ----------
// Each: what you click, where the camera goes, and either the passage
// links it opens (found in the rendered passage below at click time, so
// every gate stays Harlowe's) or, when there is no path, the pink
// inspection line for Sam to write.
var PINK = 'color:#ff3aa8;text-shadow:0 0 4px rgba(255,58,168,0.45);';
function passageLinks(sel) {
var pass = window.dssRoomScope(fiHost);
if (!pass) return [];
return Array.prototype.slice.call(pass.querySelectorAll(sel)).filter(function(l) { return !(play && play.card.contains(l)) && (l.classList.contains('dss-claimed') || !!l.closest('.lore-card-only') || l.getClientRects().length > 0); }); /* 2026-10-21: a lore link kept for a card alone (.lore-card-only) is hidden by design, so it counts though it has no box */
}
// Harlowe 3 keeps a link's target out of the DOM, so the passage's links are known by their own wording (as the signpost script does).
// the lily, when it is still there to take: the hook's own click-replace does the work
function lilyHook(n) { var pass = window.dssRoomScope(fiHost); if (!pass) return []; var h = pass.querySelector('tw-hook[name="lily' + n + '"]'); return (h && h.querySelector('svg') && !h.querySelector('.lily-glimpse') && (h.classList.contains('dss-claimed') || h.getClientRects().length > 0)) ? [h] : []; }
function byText(texts) {
return passageLinks('tw-link').filter(function(l) { return texts.indexOf(l.textContent.trim()) >= 0; });
}
// 2026-10-13 (Sam): a path's introduction (hidden in the passage as .fr-path-intro) is printed on its figure's card
function frIntro(k) { var pass = window.dssRoomScope(fiHost); var e = pass && pass.querySelector('.fr-path-intro[data-for="' + k + '"]'); if (!e) return ''; return Array.prototype.map.call(e.querySelectorAll('.fr-p'), function(p) { return p.textContent.replace(/\s+/g, ' ').trim(); }).join('\n\n'); }
var HOTSPOTS = [
{ root: photoG, name: 'Photographs', /* 2026-10-19 (Sam, playtest: "zoom in a little closer to the easter egg image"): centred on his photograph (frame 5, x 1.34) from about 1.2 away, was pos [0.2, 1.95, -2.4], tgt [0.9, 2.0, -4.5] */ pos: [1.2, 2.0, -3.25], tgt: [1.34, 2.0, -4.45], haloAt: [1.78, 2.0, -4.4], haloSc: 1.4 }, // 2026-10-14 (Sam): the glow sat on a frame; now in the gap between frames 5 and 6
{ root: phoneG, name: 'A telephone', pos: [-2.2, 1.6, 0.6], tgt: [-3.45, 1.32, -0.35],
actions: function() { return passageLinks('.phone-ringing tw-link'); },
prose: function() { var d = passageLinks('.phone-ringing')[0]; if (!d) return ''; var c = d.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('tw-link, tw-hook[name="lilyring"] tw-link'), function(l) { l.parentNode.removeChild(l); }); return c.textContent.replace(/\s+/g, ' ').trim(); } },
{ root: glassG, name: 'A glass on the bar', pos: [-0.9, 1.5, 0.35], tgt: [gp.x, 1.16, gp.z],
actions: function() { return byText(['Get a drink at the bar']); } },
{ root: bookG, name: 'An orange paperback', pos: [bp.x + 0.20, 1.46, bp.z + 0.18], tgt: [bp.x, 1.166, bp.z], haloAt: [bp.x - 0.05, 1.18, bp.z + 0.4], haloSc: 0.45, /* 2026-10-14: its glow a little along the bar, clear of the glass */ keepLine: true, notAWay: true,
line: '<i>Chariots of the Gods?</i>',
actions: function() { return byText(['⟡ LORE: Chariots of the Gods? ⟡', 'LORE: Chariots of the Gods?']); } },
{ root: doorG, name: 'A blue door', pos: [1.65, 1.5, -2.8], tgt: [3.6, 1.3, -3.7], haloAt: [3.45, 1.3, -3.7], haloSc: 1.1,
actions: function() { var a = byText(['Leave the French']); if (a.length) return a; return window.dssStreetExit(); }, /* 2026-10-16 (room sweep): until the French is done the door offers the page's own exit, as the Coach's does, rather than a card with nothing on it */ // 2026-10-12 (the venues audit): the way out is the door, not the window
onLook: function(on) { doorLight.intensity = on ? 0.9 : 0; doorGlow.material.opacity = on ? 0.55 : 0; } },
{ root: barG, name: 'A bar', pos: [-1.05, 1.45, 1.55], tgt: [-2.55, 1.25, -0.4], haloAt: [-1.75, 1.22, 1.7], haloSc: 1.4, actionOnly: true, /* 2026-10-17 (Sam: "do whatever makes most sense"): the French's bar is offered only once its drink is (the second visit on), not as an empty card with a voice line */ // 2026-10-14 (Sam: glows too close): further along the bar, clear of the glass and the paperback
actions: function() { return byText(['Get a drink at the bar']); } },
{ root: ghosts[0].hit, name: 'A man at the bar', pos: [-0.6, 1.45, 1.9], tgt: [-1.55, 1.15, 0.9], figure: true,
actions: function() { return passageLinks('.guided-link tw-link').filter(function(l) { return l.textContent.trim() === 'Approach'; }); } },
{ root: ghosts[2].hit, name: 'A novelist', pos: [1.2, 1.45, -0.6], tgt: [0.37, 1.15, -2.0], figure: true,
prose: function() { return frIntro('novelist'); },
actions: function() { return byText(['Speak to him']); } }, // 2026-10-11, Sam: the novelist's button is "Speak to him"; the man at the bar keeps "Approach"
{ root: winG, name: 'A window', pos: [2.2, 1.7, -1.5], tgt: [3.7, 1.9, -2.4], haloAt: [3.6, 1.95, -2.4], haloSc: 1.1,
actions: function() { return byText(['The Colony Room is just round the corner.']).concat(lilyHook(5)); } },
{ root: ghosts[1].hit, name: 'A painter', pos: [-0.35, 1.45, 0.75], tgt: [-1.25, 1.15, -0.3], figure: true,
prose: function() { return frIntro('artists'); },
actions: function() { return byText(['Approach the artists', 'Sketch him on a napkin', 'Help BENITO with his nail']); } }
];
// ---------- the hover, the card, the resting glow, the reveal and the words: shared with every room (window.dssRoomPlay) ----------
var play = window.dssRoomPlay({ wrap: fiWrap, canvas: fiCanvas, host: fiHost, scene: scene, camera: camera, CAM: CAM, HOTSPOTS: HOTSPOTS, tex: tex, still: fiStill,
card: { fg: 'rgba(220,198,150,0.92)', bg: 'rgba(10,7,4,0.78)', border: 'rgba(200,168,106,0.32)', dim: 'rgba(200,180,140,0.5)', btn: 'rgba(230,200,120,0.95)', btnBorder: 'rgba(200,170,100,0.45)' }, hint: 'LOOK CLOSER AT WHAT CATCHES YOUR EYE', state: function() { return { active: fiActive, animId: fiAnimId }; } });
var words = play.words, halo = play.halo, curTarget = play.curTarget;

// ---------- FRAMES ----------
var clock = new THREE.Clock();
function fiAnimate() {
fiAnimId = requestAnimationFrame(fiAnimate);
// a throw in the frame ends the room, not the night (dssSceneFailed)
try { fiFrame(); } catch (err) { cancelAnimationFrame(fiAnimId); fiAnimId = null; if (window.dssSceneFailed) window.dssSceneFailed(err, 'fi'); else throw err; }
}
function fiFrame() {
var dt = Math.min(0.1, clock.getDelta());
var t = fiStill ? 0 : clock.getElapsedTime();
play.frame(t, dt);
if(Math.floor(t*12)!==streetLast){streetLast=Math.floor(t*12);paintStreet(t);updateStreetSpill(t);streetTextures.forEach(function(tx){tx.needsUpdate=true;});}
if (!fiStill) {
var breath = Math.sin(t * 0.43) * 0.035 + Math.sin(t * 0.19) * 0.018;
lampMain.intensity = 1.5 + breath;
lampBack.intensity = 1.0 + Math.sin(t * 0.39 + 1.2) * 0.027;
mainGlow.material.opacity = 0.66 + breath * 0.6; backGlow.material.opacity = 0.66 + Math.sin(t * 0.39 + 1.2) * 0.018;
haze[0].material.opacity = 0.14 + breath * 0.18; haze[1].material.opacity = 0.14 + Math.sin(t * 0.23) * 0.008;
for (var gi = 0; gi < ghosts.length; gi++) { var g = ghosts[gi]; g.sp.material.opacity = g.base * (0.7 + 0.3 * Math.sin(t * 0.23 + g.ph)); }
for (var m = 0; m < moteN; m++) { motePos[m * 3] = moteBase[m * 3] + Math.sin(t * 0.15 + m) * 0.08; motePos[m * 3 + 1] = 0.6 + ((moteBase[m * 3 + 1] - 0.6 + (m % 2 ? 1 : -1) * t * 0.04) % 2.4 + 2.4) % 2.4; }
moteGeo.attributes.position.needsUpdate = true;
}
play.withGlowsHidden(function() { reflectRoom(curTarget); });
if (composer) composer.render(); else renderer.render(scene, camera);
}
fiAnimate();
}

// 2026-10-12 (the Pillars audit): a pub that links to itself ("Back to the bar" after "I'm not here") swaps in a fresh
// container inside one tick, so the room never rebuilt and the screen stayed blank; a new container now rebuilds it,
// as the Coach's watcher already does
var fiSeenHost = null;
setInterval(function() {
var container = document.getElementById('fi-container');
if (container && fiActive && fiSeenHost && container !== fiSeenHost) {
fiActive = false;
if (fiAnimId) { cancelAnimationFrame(fiAnimId); fiAnimId = null; }
window._dssDisposeWrap('fi-wrap');
}
if (container && !fiActive) {
fiSeenHost = container;
initFrenchInside();
} else if (!container) {
fiActive = false;
if (fiAnimId) { cancelAnimationFrame(fiAnimId); fiAnimId = null; }
window._dssDisposeWrap('fi-wrap');
}
}, 300);
})();

// Shared small-prop construction for the fifty-object visual pass (2026-10-22).
// Materials are cached per room; no new interactions, text, timers or dependencies.
window.dssDetailProps=function(mesh,tex,env,scene){
 var cache={};
 function material(color,kind){var key=color+'|'+kind;if(cache[key])return cache[key];
 var map=tex(128,128,function(c,w,h){c.fillStyle=color;c.fillRect(0,0,w,h);
 for(var i=0;i<650;i++){c.fillStyle=i%4?'rgba(235,225,202,0.09)':'rgba(22,20,16,0.1)';c.fillRect((i*47)%w,(i*71)%h,kind==='cloth'?1:1+i%4,1);}
 if(kind==='cloth')for(var y=0;y<h;y+=3){c.fillStyle='rgba(0,0,0,0.07)';c.fillRect(0,y,w,1);}
 if(kind==='paper')for(var y=3;y<h;y+=9){c.fillStyle='rgba(92,76,47,0.16)';c.fillRect(0,y,w,1);}
 });
 return cache[key]=new THREE.MeshStandardMaterial({map:map,roughness:kind==='metal'?0.55:kind==='glaze'?0.3:0.92,metalness:kind==='metal'?0.65:0,envMap:env,envMapIntensity:kind==='metal'?0.35:0.12});}
 function add(g,m,x,y,z,p){return mesh(g,m,x,y,z,p||scene);}
 function arc(p,r,t,m,x,y,z,span,turn){var o=add(new THREE.TorusGeometry(r,t,6,28,span||Math.PI*2),m,x,y,z,p);o.rotation.x=Math.PI/2;o.rotation.z=turn||0;return o;}
 function lathe(points,m,x,y,z,p,segments){return add(new THREE.LatheGeometry(points.map(function(v){return new THREE.Vector2(v[0],v[1]);}),segments||28),m,x,y,z,p);}
 function group(x,y,z,p){var g=new THREE.Group();g.position.set(x,y,z);(p||scene).add(g);return g;}
 function wire(points,r,m,p){return add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(function(v){return new THREE.Vector3(v[0],v[1],v[2]);})),Math.max(12,points.length*4),r,5,false),m,0,0,0,p);}
 var glass=new THREE.MeshPhysicalMaterial({color:0xdce4d9,roughness:0.13,metalness:0,envMap:env,envMapIntensity:0.7,clearcoat:0.5,transparent:true,opacity:0.12,depthWrite:false,side:THREE.DoubleSide});
 var edgeGlass=glass.clone();edgeGlass.opacity=0.26;edgeGlass.roughness=0.22;
 function cup(p,r,h,handled){var b=r*0.85,cupGlass=glass;
 // Selected used glasses: the untouched areas remain clear; washing scuffs alter the reflections.
 if(handled){if(!cache.handledGlass){var rough=tex(256,256,function(c,w,hh){c.fillStyle='#303030';c.fillRect(0,0,w,hh);for(var n=0;n<170;n++){var x=n*47%w,y=n*71%hh;c.strokeStyle='rgba(204,204,204,0.3)';c.lineWidth=0.5;c.beginPath();c.moveTo(x,y);c.lineTo(x+2+n%7,y-1);c.stroke();}for(var n=0;n<4;n++){var y=hh-13-n*3;c.strokeStyle='rgba(178,178,178,0.25)';c.beginPath();c.moveTo(27+n*21,y);c.lineTo(100+n*28,y+1);c.stroke();}var g=c.createRadialGradient(187,137,4,187,137,30);g.addColorStop(0,'rgba(149,149,149,0.28)');g.addColorStop(1,'rgba(149,149,149,0)');c.fillStyle=g;c.fillRect(150,100,74,74);});rough.encoding=THREE.LinearEncoding;var used=glass.clone();used.roughness=0.65;used.roughnessMap=rough;cache.handledGlass=used;
 var traces=tex(256,256,function(c,w,hh){c.clearRect(0,0,w,hh);for(var n=0;n<5;n++){c.strokeStyle='rgba(220,217,202,0.14)';c.lineWidth=0.7;c.beginPath();c.moveTo(20+n*37,hh-12-n%3);c.lineTo(43+n*37,hh-13-n%3);c.stroke();}for(var n=0;n<5;n++){c.strokeStyle='rgba(220,217,206,0.08)';c.lineWidth=0.65;c.beginPath();c.ellipse(187,137,7+n*3,10+n*4,-0.4,0.2,4.6);c.stroke();}});cache.glassTraces=new THREE.MeshStandardMaterial({map:traces,transparent:true,opacity:0.28,roughness:0.9,depthWrite:false});}
 cupGlass=cache.handledGlass;lathe([[b+0.00022,0.008],[r+0.00022,h-0.001]],cache.glassTraces,0,0,0,p);}
 lathe([[0,0],[b,0],[b,0.008],[r,h-0.001],[r-0.0012,h],[b-0.0012,0.009],[0,0.009]],cupGlass,0,0,0,p);arc(p,r-0.0006,0.0007,edgeGlass,0,h,0);add(new THREE.CylinderGeometry(b,b,0.005,28),edgeGlass,0,0.003,0,p);}
 // 2026-10-24: selected prop wear — accumulated ash, tar and scorched cigarette rests.
 function ash(x,y,z,p,r){r=r||0.05;var g=group(x,y,z,p),m=material('#77796b','glaze').clone();m.roughness=0.57;
 lathe([[0,0],[r*0.84,0],[r,0.006],[r,0.018],[r*0.91,0.021],[r*0.75,0.008],[0,0.008]],m,0,0,0,g);
 var bed=cache.ashBed;if(!bed){var bedTex=tex(256,256,function(c,w,h){c.clearRect(0,0,w,h);
 var haze=c.createRadialGradient(119,139,9,128,128,123);haze.addColorStop(0,'rgba(53,46,36,0.75)');haze.addColorStop(0.65,'rgba(91,76,53,0.48)');haze.addColorStop(1,'rgba(97,75,43,0)');c.fillStyle=haze;c.fillRect(0,0,w,h);
 for(var n=0;n<1100;n++){var a=n*2.39996,d=Math.sqrt((n*67%1103)/1103)*115;c.fillStyle=['rgba(34,31,26,0.7)','rgba(177,169,147,0.65)','rgba(118,112,99,0.7)','rgba(209,202,180,0.42)'][n%4];c.fillRect(128+Math.cos(a)*d,128+Math.sin(a)*d,1+n%5,1+n%3);}
 for(var n=0;n<4;n++){var a=n*1.7+0.3,px=128+Math.cos(a)*64,py=128+Math.sin(a)*64,sm=c.createRadialGradient(px,py,1,px,py,24);sm.addColorStop(0,'rgba(32,24,17,0.82)');sm.addColorStop(1,'rgba(57,39,21,0)');c.fillStyle=sm;c.fillRect(px-24,py-24,48,48);}});bed=cache.ashBed=new THREE.MeshStandardMaterial({map:bedTex,transparent:true,roughness:1,depthWrite:false});}
 var ashFloor=add(new THREE.CircleGeometry(r*0.74,28),bed,0,0.0086,0,g);ashFloor.rotation.x=-Math.PI/2;
 var rim=cache.ashRim;if(!rim){var rimTex=tex(256,256,function(c,w,h){c.clearRect(0,0,w,h);for(var n=0;n<4;n++){var a=n*Math.PI/2+0.2;c.save();c.translate(128+Math.cos(a)*119,128+Math.sin(a)*119);c.rotate(a);var stain=c.createRadialGradient(0,0,1,0,0,17);stain.addColorStop(0,'rgba(63,37,15,0.8)');stain.addColorStop(1,'rgba(82,53,24,0)');c.fillStyle=stain;c.fillRect(-19,-19,38,38);c.restore();}c.fillStyle='rgba(194,185,155,0.75)';for(var n=0;n<9;n++){var a=n*2.4;c.fillRect(128+Math.cos(a)*124,128+Math.sin(a)*124,2+n%3,2);}});rim=cache.ashRim=new THREE.MeshStandardMaterial({map:rimTex,transparent:true,roughness:0.9,depthWrite:false});}
 var lipGeo=new THREE.RingGeometry(r*0.91,r,36),lipPos=lipGeo.attributes.position;for(var v=0;v<lipPos.count;v++){var dist=Math.hypot(lipPos.getX(v),lipPos.getY(v));lipPos.setZ(v,-0.003*Math.max(0,Math.min(1,(dist/r-0.91)/0.09)));}lipGeo.computeVertexNormals();
 var ashLip=add(lipGeo,rim,0,0.0213,0,g);ashLip.rotation.x=-Math.PI/2;
 var dust=material('#a69e8b','ash'),filter=material('#a27b49','paper'),paper=material('#cfc7b3','paper');
 for(var i=0;i<3;i++){var e=group((i-1)*r*0.48,0.011,(i%2-0.5)*r*0.32,g);e.rotation.y=i*2.3;
 var b=add(new THREE.CylinderGeometry(0.003,0.0032,0.015,8),paper,0,0,0,e);b.rotation.z=Math.PI/2;
 b=add(new THREE.CylinderGeometry(0.0032,0.0032,0.008,8),filter,-0.011,0,0,e);b.rotation.z=Math.PI/2;
 var burnt=add(new THREE.SphereGeometry(0.0031,6,5),material('#39332b','paper'),0.008,0,0,e);burnt.scale.set(0.6,0.85,1);}
 var crumbGeo=new THREE.SphereGeometry(0.001,5,4),crumbs=new THREE.InstancedMesh(crumbGeo,dust,38),crumbPose=new THREE.Object3D();
 for(var i=0;i<38;i++){var a=i*2.4,d=(i*7%41)/41*r*0.66;crumbPose.position.set(Math.cos(a)*d,0.0094,Math.sin(a)*d);crumbPose.scale.set(1+i%4*0.6,0.35+i%3*0.12,1+i%3*0.4);crumbPose.updateMatrix();crumbs.setMatrixAt(i,crumbPose.matrix);}crumbs.instanceMatrix.needsUpdate=true;g.add(crumbs);return g;}
 function paperBlock(w,h,d,x,y,z,p,color){var g=group(x,y,z,p),paper=material('#d3c9ac','paper'),cover=material(color||'#43382b','cloth');
 add(new THREE.BoxGeometry(w,h,d),paper,0,h/2,0,g);
 add(new THREE.BoxGeometry(w+0.008,0.003,d+0.008),cover,0,0,0,g);add(new THREE.BoxGeometry(w+0.008,0.003,d+0.008),cover,0,h,0,g);
 add(new THREE.BoxGeometry(0.006,h,d+0.008),cover,-w/2,h/2,0,g);return g;}
 function bottle(g,h,r,col,seed){seed=Math.abs(seed|0)%4;var bm=new THREE.MeshPhysicalMaterial({color:col,roughness:0.23,metalness:0,envMap:env,envMapIntensity:0.65,clearcoat:0.5,transparent:true,opacity:0.92});
 var sh=0.74+seed*0.045;lathe([[0,0],[r*0.85,0],[r,h*0.04],[r,h*sh],[r*0.8,h*(sh+0.08)],[r*0.32,h*1.04],[r*0.32,h*1.31],[r*0.38,h*1.33],[0,h*1.33]],bm,0,0,0,g);
 add(new THREE.CylinderGeometry(r*0.38,r*0.38,h*0.05,12),material(seed%2?'#6a593e':'#34332b','metal'),0,h*1.33,0,g);
 var key='label'+seed,lm=cache[key];if(!lm){var label=tex(128,128,function(c,w,h){c.fillStyle=['#c5b99b','#cfc4aa','#aaa68e','#b7a47f'][seed];c.fillRect(0,0,w,h);c.strokeStyle='#675a42';c.lineWidth=2;c.strokeRect(7,7,w-14,h-14);c.beginPath();c.ellipse(64,35,12,16,0,0,6.3);c.stroke();for(var n=0;n<5;n++)c.fillRect(24+n%2*8,65+n*8,80-n%2*16,2);for(var n=0;n<250;n++){c.fillStyle=n%3?'rgba(240,225,192,0.25)':'rgba(69,51,25,0.1)';c.fillRect(n*47%w,n*71%h,2,1);}});lm=cache[key]=new THREE.MeshStandardMaterial({map:label,roughness:0.94,side:THREE.DoubleSide});}
 // Local handling wear on the paper label, leaving its printed design readable; no extra mesh.
 if(!lm.userData.handledLabel){var lc=lm.map.image.getContext('2d'),lw=lm.map.image.width,lh=lm.map.image.height;
 var age=lc.createLinearGradient(0,0,0,lh);age.addColorStop(0,'rgba(102,73,32,0.25)');age.addColorStop(0.19,'rgba(102,73,32,0)');age.addColorStop(0.82,'rgba(73,57,33,0.04)');age.addColorStop(1,'rgba(73,57,33,0.3)');lc.fillStyle=age;lc.fillRect(0,0,lw,lh);
 var smudge=lc.createRadialGradient(20+seed*21,88,2,20+seed*21,88,26);smudge.addColorStop(0,'rgba(60,47,29,0.18)');smudge.addColorStop(1,'rgba(60,47,29,0)');lc.fillStyle=smudge;lc.fillRect(0,50,lw,78);
 for(var nick=0;nick<35;nick++){lc.fillStyle=nick%4?'rgba(223,209,172,0.8)':'rgba(109,87,52,0.35)';lc.fillRect((nick*47+seed*13)%lw,nick%2?lh-2-nick%5:nick%4,2+nick%6,1+nick%2);}lm.map.needsUpdate=true;lm.userData.handledLabel=true;}
 add(new THREE.CylinderGeometry(r*1.012,r*1.012,h*0.4,20,1,true,-1.35,2.7),lm,0,h*0.43,0,g);}
 function cloth(w,h,x,y,z,p,col,worn){var geo=new THREE.PlaneGeometry(w,h,14,12),pos=geo.attributes.position;for(var v=0;v<pos.count;v++){var px=pos.getX(v),py=pos.getY(v);pos.setZ(v,Math.sin(px/w*26+py*2)*w*0.018+Math.sin(py/h*9)*w*0.012);}geo.computeVertexNormals();var m=material(col||'#4a4537','cloth').clone();
 // Only the working bar towels get spill marks; tablecloths and the telephone cloth retain their own finish.
 if(worn){var key='used-towel|'+col;if(!cache[key])cache[key]=tex(256,256,function(c,tw,th){c.fillStyle=col||'#4a4537';c.fillRect(0,0,tw,th);for(var n=0;n<4;n++){var px=40+(n*79%169),py=39+(n*61%174),g=c.createRadialGradient(px,py,3,px,py,33+n*5);g.addColorStop(0,n%2?'rgba(49,39,23,0.39)':'rgba(99,64,29,0.34)');g.addColorStop(0.72,'rgba(67,47,26,0.13)');g.addColorStop(1,'rgba(67,47,26,0)');c.fillStyle=g;c.fillRect(px-60,py-60,120,120);}c.strokeStyle='rgba(66,47,28,0.24)';c.lineWidth=2;c.beginPath();c.ellipse(179,94,31,28,0.2,0.3,5.8);c.stroke();for(var q=0;q<tw;q+=3){c.fillStyle='rgba(229,222,198,0.09)';c.fillRect(q,0,1,th);c.fillStyle='rgba(16,19,18,0.1)';c.fillRect(0,q,tw,1);}for(var n=0;n<75;n++){c.fillStyle='rgba(225,214,183,0.2)';c.fillRect(n*47%tw,n%2?2:th-3,2+n%4,1);}});m.map=cache[key];m.roughness=1;}
 m.side=THREE.DoubleSide;return add(geo,m,x,y,z,p);}
 function button(p,x,y,z,r,col){var o=add(new THREE.SphereGeometry(1,10,6),material(col||'#8a7d63','metal'),x,y,z,p);o.scale.set(r,r*0.28,r);return o;}
 return {material:material,arc:arc,lathe:lathe,group:group,wire:wire,cup:cup,ash:ash,paperBlock:paperBlock,bottle:bottle,cloth:cloth,button:button,glass:glass};
};

