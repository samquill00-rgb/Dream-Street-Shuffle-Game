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

window.dssBookSwaps = function() {
 var pairs=[];
 return { pair:function(a,b){
  var i=pairs.length, ax=a.position.x,bx=b.position.x;
  var aw=a.geometry.parameters.width,bw=b.geometry.parameters.width;
  var mats=[];[a,b].forEach(function(book){book.traverse(function(o){if(o.material){var m=o.material;m.transparent=true;m.depthWrite=false;mats.push({m:m,alpha:m.opacity});}});});
  pairs.push({a:a,b:b,ax:ax,bx:bx,at:bx+bw/2-aw/2,bt:ax-aw/2+bw/2,mats:mats,start:5+(i*1.9%8),period:11+(i*3.7%13)});
 },frame:function(t,still){if(still)return;pairs.forEach(function(p){
  var elapsed=t-p.start, turn=elapsed<0?-1:Math.floor(elapsed/p.period), age=elapsed<0?2:elapsed%p.period;
  var swapped=elapsed>=0 && (turn+(age>=0.8?1:0))%2===1;
  p.a.position.x=swapped?p.at:p.ax;p.b.position.x=swapped?p.bt:p.bx;
  var alpha=age<1.6?Math.abs(age-0.8)/0.8:1;alpha=alpha*alpha*(3-2*alpha);
  p.mats.forEach(function(v){v.m.opacity=v.alpha*alpha;});
 });} };
};

window.dssBookMagic = function() {
 var books=[], palette=[0xc23c57,0x1ab48c,0x426fe0,0xa74cc7,0xd7a936,0xd65d9b].map(function(c){return new THREE.Color(c);});
 // A quarter turn quickly; the rest keep their own medium or slow rhythm.
 return { add:function(mat){var n=books.length,base=mat.color.clone(),target=palette[(n+2)%palette.length];if(target.equals(base))target=palette[(n+3)%palette.length];books.push({mat:mat,base:base,pace:n%4===0?3+(n*0.73%3):8+(n*3.31%14),offset:n*2.399,target:target});},
 frame:function(t,still){if(still)return;books.forEach(function(b){var v=(Math.sin(t*6.283185/b.pace+b.offset)+1)*0.5;v=v*v*(3-2*v);b.mat.color.copy(b.base).lerp(b.target,v);});} };
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

// >>>> DSS ROOM KIT BEGIN
// ====== THE ROOM KIT — what the six later rooms share (2026-09-30) ======
// The four rooms above (French, Colony, Pillars, Ronnie's) each carry a
// copy of the same machinery: the wrap sized to the window, the renderer
// and the outside scenes' composer, the grain, soot and varnish textures,
// the environment cube, the planar mirror, the ghosts, the hover halo and
// the resting glow, the card, the words panel, the camera tweens and the
// pick. The six rooms built on 2026-09-30 (Coach and Horses, Trisha's,
// Lackland's office, the Chippy, Copper's cellar, O'Flatterly's) take it
// from here instead, so each of those blocks is only its room and its
// close-ups. Nothing about the game is decided here: a room only finds the
// passage's own links by their wording and presses them from the card.
// spec: { id, caption, captionColor, bg, fog, exposure, bloom, wash, vignette,
//         cam(portrait), fov [portrait, landscape], hint, card {fg, bg, border, dim, btn, btnBorder},
//         build(k) -> { hotspots, frame(t, dt, still) } }
window.dssRoomKit = function(spec) {
var ID = spec.id, CONT = ID + '-container', WRAP = ID + '-wrap';
var active = false, animId = null;

function init() {
if (active) return;
active = true;
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(build) : build()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(build) : build());
}
}

function build() {
var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var host = document.getElementById(CONT);
if (!host) { active = false; return; }
var wrap = document.createElement('div');
wrap.id = WRAP;
function size() {
var w = Math.max(280, document.documentElement.clientWidth || window.innerWidth);
var vh = window.innerHeight || 800;
// the room fills the window below its top edge: the passage's words sit inside it, nothing follows underneath
var top = 0, el = host; while (el) { top += el.offsetTop; el = el.offsetParent; }
var pad = 0; el = host; while (el && el !== document.body) { var cs = getComputedStyle(el); pad += (parseFloat(cs.paddingBottom) || 0) + (parseFloat(cs.marginBottom) || 0); el = el.parentNode; }
var h = Math.round(Math.max(360, vh - top - pad - 2));
return { w: w, h: h };
}
var sz = size();
var bgHex = '#' + ('000000' + (spec.bg || 0x050304).toString(16)).slice(-6);
wrap.style.cssText = 'position:relative;width:100vw;margin-left:calc(50% - 50vw);height:' + sz.h + 'px;z-index:0;isolation:isolate;background:' + bgHex + ';overflow:hidden;';
var canvas = document.createElement('canvas');
canvas.width = sz.w; canvas.height = sz.h;
canvas.style.cssText = 'display:block;position:absolute;top:0;left:0;width:100%;height:100%;touch-action:none;';
wrap.appendChild(canvas);
var wash = document.createElement('div');
wash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9000;background:' + (spec.wash || 'linear-gradient(180deg,rgba(10,8,6,0.195) 0%,rgba(6,5,4,0.05) 35%,rgba(6,5,4,0.05) 60%,rgba(3,2,2,0.293) 100%)') + ';';
wrap.appendChild(wash);
var vig = document.createElement('div');
vig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:' + (spec.vignette || 'radial-gradient(ellipse at 50% 44%,transparent 34%,rgba(0,0,0,0.48) 100%)') + ';';
wrap.appendChild(vig);
var grain = document.createElement('div');
grain.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9002;opacity:0.06;mix-blend-mode:overlay;background:url(' + (window.dssGetGrainURL ? window.dssGetGrainURL() : '') + ');';
wrap.appendChild(grain);
var loc = document.createElement('div');
loc.className = 'dss-room-caption';
loc.textContent = spec.caption || '';
loc.style.cssText = 'position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font:12px \'Courier New\',monospace;color:' + (spec.captionColor || 'rgba(200,190,160,0.25)') + ';letter-spacing:3px;white-space:nowrap;z-index:9003;pointer-events:none;';
wrap.appendChild(loc);
host.appendChild(wrap);
sz = size(); wrap.style.height = sz.h + 'px';
setTimeout(function() { var r = window._dssThreeRegistry && window._dssThreeRegistry[WRAP]; if (r && r.resize) r.resize(); }, 1600);

var scene = new THREE.Scene();
scene.background = new THREE.Color(spec.bg || 0x050304);
if (spec.fog) scene.fog = new THREE.FogExp2(spec.fog[0], spec.fog[1]);
var aspect = sz.w / sz.h;
var portrait = aspect < 1.4;
var FOV = spec.fov || [92, 70];
var camera = new THREE.PerspectiveCamera(portrait ? FOV[0] : FOV[1], aspect, 0.05, 40);
var CAM = spec.cam(portrait);
camera.position.set(CAM.x, CAM.y, CAM.z);

var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sz.w, sz.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, sz.w < 600 ? 1.25 : 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = spec.exposure || 0.66;
window._dssBindScene(WRAP, scene, renderer, camera);
var origResize = window._dssThreeRegistry[WRAP].resize;
window._dssThreeRegistry[WRAP].resize = function() {
sz = size(); wrap.style.height = sz.h + 'px';
camera.aspect = sz.w / sz.h;
camera.fov = camera.aspect < 1.4 ? FOV[0] : FOV[1];
camera.updateProjectionMatrix();
renderer.setSize(sz.w, sz.h);
};
window.removeEventListener('resize', origResize);
window.addEventListener('resize', window._dssThreeRegistry[WRAP].resize);
// The outside scenes' bloom and grade, at the room's own size.
var composer = window.dssMakeComposer ? window.dssMakeComposer(scene, camera, renderer, spec.bloom || { bloomStrength: 0.38, bloomRadius: 0.6, bloomThreshold: 0.7 }) : null;
if (composer) { composer.setSize(sz.w, sz.h); var rs = window._dssThreeRegistry[WRAP].resize; window._dssThreeRegistry[WRAP].resize = function() { rs(); composer.setSize(sz.w, sz.h); }; window.removeEventListener('resize', rs); window.addEventListener('resize', window._dssThreeRegistry[WRAP].resize); }

function tex(w, h, fn) {
var c = document.createElement('canvas'); c.width = w; c.height = h;
var cx = c.getContext('2d'); fn(cx, w, h);
var t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearMipmapLinearFilter;
t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
return t;
}
function rnd(seed) { var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function mesh(geo, mat, x, y, z, parent) { var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || scene).add(m); return m; }

// ---------- TEXTURES AND MATERIALS: the same grain, soot and varnish as the French ----------
function woodTex(base, grain, seed) {
return window.dssInteriorSurface(tex(512, 512, function(cx, w, h) {
cx.fillStyle = base; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 420; i++) {
var y = rnd(seed + i * 7) * h, bend = 2 + rnd(i + seed * 5) * 11;
cx.strokeStyle = i % 5 ? grain : '#a8743f'; cx.globalAlpha = 0.035 + rnd(i + seed) * 0.1;
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
cx.strokeStyle = 'rgba(216,165,103,0.13)'; cx.lineWidth = 0.6;
for (var n = 0; n < 65; n++) { var xx = rnd(n * 9 + seed) * w, yy = rnd(n * 17) * h; cx.beginPath(); cx.moveTo(xx, yy); cx.lineTo(xx + 3 + rnd(n) * 48, yy + 0.3); cx.stroke(); }
}), 'wood', seed);
}
function paintTex(base, seed, warm) {
return window.dssInteriorSurface(tex(512, 512, function(cx, w, h) {
cx.fillStyle = base; cx.fillRect(0, 0, w, h);
for (var n = 0; n < 28; n++) {
var x = rnd(n + seed) * w, y = rnd(n * 3 + seed) * h, r = 30 + rnd(n * 7) * 130;
var g = cx.createRadialGradient(x, y, 0, x, y, r);
g.addColorStop(0, n % 3 ? 'rgba(20,12,4,0.15)' : (warm || 'rgba(150,110,50,0.1)')); g.addColorStop(1, 'rgba(60,32,8,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
}
var soot = cx.createLinearGradient(0, 0, 0, h); soot.addColorStop(0, 'rgba(18,10,4,0.3)'); soot.addColorStop(0.3, 'rgba(38,20,6,0)'); soot.addColorStop(1, 'rgba(18,10,4,0.14)'); cx.fillStyle = soot; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 9000; i++) { cx.fillStyle = i % 2 ? 'rgba(20,12,4,0.05)' : 'rgba(200,180,140,0.04)'; cx.fillRect(rnd(i + seed) * w, rnd(i * 3 + seed) * h, 1, 1); }
}), 'plaster', seed);
}
// A small canvas-made room environment: what the metal, the glass and the varnish reflect.
function makeEnv(top, mid, low, lamp) {
var faces = [];
for (var ef = 0; ef < 6; ef++) {
var ec = document.createElement('canvas'); ec.width = ec.height = 128;
var ex = ec.getContext('2d'), eg = ex.createLinearGradient(0, 0, 0, 128);
eg.addColorStop(0, ef === 2 ? top : mid); eg.addColorStop(0.5, mid); eg.addColorStop(1, low); ex.fillStyle = eg; ex.fillRect(0, 0, 128, 128);
if (ef !== 3) {
for (var el = 0; el < 2; el++) {
var lx = 28 + el * 73, ly = ef === 2 ? 64 : 30;
var gl = ex.createRadialGradient(lx, ly, 0, lx, ly, 20); gl.addColorStop(0, '#ffe6b8'); gl.addColorStop(0.14, lamp || '#d9b070'); gl.addColorStop(0.4, '#8a5f2c'); gl.addColorStop(1, 'rgba(96,63,25,0)'); ex.fillStyle = gl; ex.fillRect(0, 0, 128, 128);
} ex.fillStyle = 'rgba(190,120,70,0.14)'; ex.fillRect(4, 84, 120, 10);
} faces.push(ec);
}
var env = new THREE.CubeTexture(faces); env.needsUpdate = true; return env;
}
var envSpec = spec.env || ['#5a4028', '#3e2e1e', '#0a0705', '#d9b070'];
var roomEnv = makeEnv(envSpec[0], envSpec[1], envSpec[2], envSpec[3]);
var grainA = woodTex('#3d2416', '#150905', 1), grainB = woodTex('#2a1810', '#0e0704', 2), grainC = woodTex('#4a2c1a', '#1a0c06', 3);
var M = {
oak: new THREE.MeshStandardMaterial({ map: grainA, bumpMap: grainA, bumpScale: 0.003, roughnessMap: grainA, roughness: 0.62, envMap: roomEnv, envMapIntensity: 0.4, metalness: 0.04 }),
darkWood: new THREE.MeshStandardMaterial({ map: grainB, bumpMap: grainB, bumpScale: 0.006, roughness: 0.58, envMap: roomEnv, envMapIntensity: 0.22 }),
shelfWood: new THREE.MeshStandardMaterial({ map: grainC, bumpMap: grainC, bumpScale: 0.002, roughnessMap: grainC, roughness: 0.5, envMap: roomEnv, envMapIntensity: 0.5, metalness: 0.06 }),
brass: new THREE.MeshStandardMaterial({ color: 0xb99a60, roughness: 0.3, metalness: 0.82, envMap: roomEnv, envMapIntensity: 0.72 }),
black: new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.15, metalness: 0.2, envMap: roomEnv, envMapIntensity: 0.8 }),
chrome: new THREE.MeshStandardMaterial({ color: 0xc8c8c8, roughness: 0.22, metalness: 0.95, envMap: roomEnv, envMapIntensity: 1.0 }),
glass: new THREE.MeshPhysicalMaterial({ color: 0xf0eadc, roughness: 0.09, metalness: 0.04, envMap: roomEnv, envMapIntensity: 1.1, clearcoat: 1, transparent: true, opacity: 0.34 }),
paper: new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.95 }),
bakelite: new THREE.MeshStandardMaterial({ color: 0x16120f, roughness: 0.26, metalness: 0.08, envMap: roomEnv, envMapIntensity: 0.55 }),
hidden: new THREE.MeshBasicMaterial({ visible: false })
};

// ---------- A PLANAR REFLECTION, drawn only when the view changes ----------
var mirrors = [];
function makeMirror(m, normal, sizePx, tint, extra) {
extra = extra || {};
var target = new THREE.WebGLRenderTarget(sizePx, sizePx, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
var mcam = camera.clone(), mat4 = new THREE.Matrix4(), n = normal.clone().normalize();
m.material = new THREE.ShaderMaterial({
uniforms: { reflection: { value: target.texture }, reflectionMatrix: { value: mat4 }, time: { value: 0 }, tint: { value: tint } },
transparent: !!extra.transparent, depthWrite: !extra.transparent,
vertexShader: 'uniform mat4 reflectionMatrix; varying vec4 reflected; varying vec2 faceUV; void main(){ faceUV=uv; vec4 wp=modelMatrix*vec4(position,1.0); reflected=reflectionMatrix*wp; gl_Position=projectionMatrix*viewMatrix*wp; }',
fragmentShader: 'uniform sampler2D reflection; uniform float time; uniform vec3 tint; varying vec4 reflected; varying vec2 faceUV; void main(){ vec4 r=reflected; ' + (extra.ripple ? 'r.xy+=vec2(sin(faceUV.y*38.0+time*1.1)*0.004+sin(faceUV.x*23.0-time*0.7)*0.003, cos(faceUV.x*31.0+time*0.9)*0.004)*r.w;' : '') + ' vec3 c=texture2DProj(reflection,r).rgb; float edge=smoothstep(0.0,' + (extra.edge || '0.07') + ',min(min(faceUV.x,1.0-faceUV.x),min(faceUV.y,1.0-faceUV.y))); float stain=0.5+0.5*sin(faceUV.x*193.0+sin(faceUV.y*117.0)*3.0); ' + (extra.transparent ? 'c=c*tint; float a=edge*(0.62+0.1*stain); gl_FragColor=vec4(c,a);' : 'c=mix(vec3(0.05,0.033,0.019),c*tint,0.65+0.35*edge); c*=1.0-(1.0-edge)*stain*0.3; gl_FragColor=vec4(c,1.0);') + '\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'
});
m.geometry.addEventListener('dispose', function() { target.dispose(); });
var lastAspect = 0, lastP = new THREE.Vector3(999, 999, 999), lastT = new THREE.Vector3(999, 999, 999), p0 = new THREE.Vector3();
function reflect(v) { var d = v.clone().sub(p0).dot(n); return v.clone().sub(n.clone().multiplyScalar(2 * d)); }
var o = { mesh: m, update: function(tgt, t) {
m.material.uniforms.time.value = t;
if (lastAspect === camera.aspect && lastP.distanceToSquared(camera.position) < 0.0025 && lastT.distanceToSquared(tgt) < 0.0025) return;
lastAspect = camera.aspect; lastP.copy(camera.position); lastT.copy(tgt);
m.getWorldPosition(p0);
mcam.copy(camera); mcam.position.copy(reflect(camera.position)); mcam.up.copy(reflect(camera.position.clone().add(new THREE.Vector3(0, 1, 0))).sub(mcam.position));
mcam.lookAt(reflect(tgt)); mcam.updateMatrixWorld();
var clip = new THREE.Plane(n.clone(), -p0.dot(n)).applyMatrix4(mcam.matrixWorldInverse);
var cp = new THREE.Vector4(clip.normal.x, clip.normal.y, clip.normal.z, clip.constant);
var pm = mcam.projectionMatrix.elements, cq = new THREE.Vector4((Math.sign(cp.x) + pm[8]) / pm[0], (Math.sign(cp.y) + pm[9]) / pm[5], -1, (1 + pm[10]) / pm[14]);
cp.multiplyScalar(2 / cp.dot(cq)); pm[2] = cp.x; pm[6] = cp.y; pm[10] = cp.z + 1; pm[14] = cp.w;
mat4.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1).multiply(mcam.projectionMatrix).multiply(mcam.matrixWorldInverse);
var oldTarget = renderer.getRenderTarget(), oldTone = renderer.toneMapping;
mirrors.forEach(function(q) { q.mesh.visible = false; });
renderer.toneMapping = THREE.NoToneMapping; renderer.setRenderTarget(target); renderer.render(scene, mcam);
renderer.setRenderTarget(oldTarget); renderer.toneMapping = oldTone; mirrors.forEach(function(q) { q.mesh.visible = true; });
} };
mirrors.push(o); return o;
}

// ---------- LIGHT SPRITES, CONTACT SHADOWS, GHOSTS ----------
var glowTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,225,160,0.9)'); g.addColorStop(0.3, 'rgba(255,190,100,0.35)'); g.addColorStop(0.7, 'rgba(220,140,50,0.08)'); g.addColorStop(1, 'rgba(180,100,30,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function glow(x, y, z, sc, op, col, parent) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: col || 0xffffff, transparent: true, opacity: op || 0.6, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, fog: false, toneMapped: false })); sp.scale.set(sc, sc, 1); sp.position.set(x, y, z); (parent || scene).add(sp); return sp; }
var contactTex = tex(64, 64, function(cx, w, h) { var g = cx.createRadialGradient(32, 32, 3, 32, 32, 32); g.addColorStop(0, 'rgba(0,0,0,0.36)'); g.addColorStop(0.45, 'rgba(0,0,0,0.2)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function contact(x, y, z, s) { var sh = mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false }), x, y + 0.004, z); sh.rotation.x = -Math.PI / 2; return sh; }
function ghostTex(seed, seated, bright) { return window.dssGhostTex(tex, rnd, seed, seated, bright); }
var ghosts = [];
function ghost(x, y, z, seed, base, seated, bright, scale) {
var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ghostTex(seed, seated, bright), transparent: true, opacity: base, depthWrite: false, blending: bright ? THREE.NormalBlending : THREE.AdditiveBlending }));
var sc = scale || 1; sp.scale.set(0.9 * sc, 1.8 * sc, 1); sp.position.set(x, y + 0.9 * sc, z); scene.add(sp);
var hit = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * sc, 0.2 * sc, (seated ? 1.1 : 1.5) * sc, 8), M.hidden);
hit.position.set(x, y + (seated ? 0.7 : 0.95) * sc, z); scene.add(hit);
var g = { sp: sp, hit: hit, base: base, ph: seed * 2.1 }; ghosts.push(g); return g;
}

// ---------- THE PASSAGE'S OWN LINKS ----------
var play = null;
function passageLinks(sel) {
var pass = window.dssRoomScope(host);
if (!pass) return [];
return Array.prototype.slice.call(pass.querySelectorAll(sel)).filter(function(l) { return !(play && play.card.contains(l)) && !l.closest('.dss-key-offer') && (l.classList.contains('dss-claimed') || l.getClientRects().length > 0); });
}
function lilyHook(n) { var pass = window.dssRoomScope(host); if (!pass) return []; var h = pass.querySelector('tw-hook[name="lily' + n + '"]'); return (h && h.querySelector('svg') && !h.querySelector('.lily-glimpse') && (h.classList.contains('dss-claimed') || h.getClientRects().length > 0)) ? [h] : []; }
function byText(texts) { return passageLinks('tw-link').filter(function(l) { return texts.indexOf(l.textContent.trim()) >= 0; }); }
function byPrefix(prefix) { return passageLinks('tw-link').filter(function(l) { return l.textContent.trim().indexOf(prefix) === 0; }); }
function modalProse() { var d = passageLinks('.phone-ringing')[0]; if (!d) return ''; var c = d.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('tw-link'), function(l) { l.parentNode.removeChild(l); }); return c.textContent.replace(/\s+/g, ' ').trim(); }

var k = { scene: scene, camera: camera, renderer: renderer, tex: tex, rnd: rnd, mesh: mesh, woodTex: woodTex, paintTex: paintTex, roomEnv: roomEnv, M: M, grain: [grainA, grainB, grainC],
makeMirror: makeMirror, glow: glow, glowTex: glowTex, contact: contact, ghost: ghost, portrait: portrait, still: still, host: host, wrap: wrap,
passageLinks: passageLinks, byText: byText, byPrefix: byPrefix, lilyHook: lilyHook, modalProse: modalProse };
var built = spec.build(k) || {};
var HOTSPOTS = built.hotspots || [];
renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true;

// ---------- THE CLOSE-UPS, AND THE PATHS ----------
// ---------- THE CLOSE-UPS, AND THE PATHS: shared with every room (window.dssRoomPlay) ----------
var play = window.dssRoomPlay({ wrap: wrap, canvas: canvas, host: host, scene: scene, camera: camera, CAM: CAM, HOTSPOTS: HOTSPOTS, tex: tex, still: still,
card: spec.card, hint: spec.hint, state: function() { return { active: active, animId: animId }; } });
var words = play.words, curTarget = play.curTarget;

// ---------- FRAMES ----------
var clock = new THREE.Clock();
function animate() {
animId = requestAnimationFrame(animate);
// a throw in the frame ends the room, not the night (dssSceneFailed)
try { frameOnce(); } catch (err) { cancelAnimationFrame(animId); animId = null; if (window.dssSceneFailed) window.dssSceneFailed(err, ID); else throw err; }
}
function frameOnce() {
var dt = Math.min(0.1, clock.getDelta());
var t = still ? 0 : clock.getElapsedTime();
play.frame(t, dt);
if (!still) {
for (var gi = 0; gi < ghosts.length; gi++) { var g = ghosts[gi]; g.sp.material.opacity = g.base * (0.7 + 0.3 * Math.sin(t * 0.23 + g.ph)); }
}
if (built.frame) built.frame(t, dt, still);
play.withGlowsHidden(function() { for (var mr = 0; mr < mirrors.length; mr++) mirrors[mr].update(curTarget, t); });
if (composer) composer.render(); else renderer.render(scene, camera);
}
animate();
}

// 2026-10-12 (the venues audit): a self-link ("Back to the bar" in the Coach) swaps in a fresh container within one tick;
// a new container rebuilds the room, as the French/Colony/Pillars/Ronnie's watchers now do
var seenHost = null;
setInterval(function() {
var container = document.getElementById(CONT);
if (container && active && seenHost && container !== seenHost) {
active = false;
if (animId) { cancelAnimationFrame(animId); animId = null; }
window._dssDisposeWrap(WRAP);
}
if (container && !active) {
seenHost = container;
init();
} else if (!container) {
active = false;
if (animId) { cancelAnimationFrame(animId); animId = null; }
window._dssDisposeWrap(WRAP);
}
}, 300);
};
// ====== INSIDE O'FLATTERLY'S — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-30. Built from what is written of I. O'Flatterly, dealer in books,
// in Cecil Court: a narrow shop shelved floor to ceiling, a ladder on its
// rail, a glass case of the better things, a thick wooden counter with a
// lamp on it and Inis behind it reading what he's reading, the bell over
// the door, the window with the court's lamp in it. The room sits at the
// top of the O'Flatterly's shop passage (#oi-container) and is its
// navigation: Inis opens "The Great Ham sent me" while the passage offers
// it. The shelves, the ladder, the case, the bell, the window and the
// globe are inspections, their card words pink placeholders for Sam.
// Nothing about the game is decided in JS.
window.dssRoomKit({
id: 'oi', caption: "I. O’FLATTERLY, DEALER IN BOOKS, CECIL COURT", captionColor: 'rgba(220,190,120,0.28)',
bg: 0x0a0704, fog: [0x120c06, 0.045], exposure: .74, bloom: { bloomStrength: 0.32, bloomRadius: 0.65, bloomThreshold: 0.66 },
env: ['#8a6a30', '#4a3a20', '#0c0906', '#f0d090'],
wash: 'linear-gradient(180deg,rgba(30,20,8,0.195) 0%,rgba(14,10,4,0.05) 35%,rgba(14,10,4,0.05) 60%,rgba(5,3,1,0.293) 100%)',
card: { fg: 'rgba(235,220,185,0.92)', bg: 'rgba(12,8,3,0.82)', border: 'rgba(220,180,100,0.3)', dim: 'rgba(210,190,140,0.5)', btn: 'rgba(245,230,185,0.95)', btnBorder: 'rgba(220,180,100,0.45)' },
cam: function(portrait) { return portrait ? { x: 0.2, y: 1.5, z: 3.3, tx: 0.0, ty: 1.15, tz: -2.0 } : { x: 0.3, y: 1.5, z: 3.4, tx: 0.0, ty: 1.2, tz: -2.0 }; },
build: function(k) {
var scene = k.scene, mesh = k.mesh, tex = k.tex, rnd = k.rnd, M = k.M;
var detail=window.dssDetailProps(mesh,tex,k.roomEnv,scene);
var W = 4.4, D = 7.0, H = 3.3;
// ---------- THE SHOP: boards, a pressed ceiling, the walls where they show between the shelves ----------
// 2026-10-30 (Sam): room-wide wear, so stains/scuffs don't repeat on every tile.
function oiWeatherSurface(texture, cols, rows, ceiling) {
var c=document.createElement('canvas');c.width=c.height=1024;var cx=c.getContext('2d');
for(var ty=0;ty<rows;ty++)for(var tx=0;tx<cols;tx++)cx.drawImage(texture.image,tx*1024/cols,ty*1024/rows,1024/cols,1024/rows);
if(ceiling){
  // Old leaks in the plaster, nicotine at the edges, rubbed high mouldings.
  [[145,210,145],[810,670,205],[680,100,100],[260,850,130]].forEach(function(s){
    var stain=cx.createRadialGradient(s[0],s[1],s[2]*0.18,s[0],s[1],s[2]);
    stain.addColorStop(0,'rgba(111,77,39,0.08)');stain.addColorStop(0.62,'rgba(128,91,44,0.24)');stain.addColorStop(0.79,'rgba(111,79,39,0.31)');stain.addColorStop(1,'rgba(136,101,54,0)');
    cx.save();cx.translate(0,s[1]*0.22);cx.scale(1,0.78);cx.fillStyle=stain;cx.fillRect(s[0]-s[2],s[1]-s[2],s[2]*2,s[2]*2);cx.restore();
  });
  for(var cr=0;cr<9;cr++){
    var x=60+rnd(cr+711)*900,y=40+rnd(cr+735)*880;
    cx.beginPath();cx.moveTo(x,y);
    for(var seg=0;seg<7;seg++){x+=8+rnd(cr*17+seg)*17;y+=(rnd(cr*29+seg)-0.45)*35;cx.lineTo(x,y);}
    cx.strokeStyle='rgba(78,65,47,0.43)';cx.lineWidth=0.9;cx.stroke();
    cx.strokeStyle='rgba(244,231,199,0.34)';cx.lineWidth=0.5;cx.translate(1,1);cx.stroke();cx.translate(-1,-1);
  }
  for(var chip=0;chip<140;chip++){cx.fillStyle=chip%3?'rgba(231,217,184,0.30)':'rgba(103,88,64,0.20)';cx.fillRect(rnd(chip+818)*1024,rnd(chip+930)*1024,2+rnd(chip)*8,1+rnd(chip+6)*3);}
  var edge=cx.createRadialGradient(510,500,240,510,500,710);edge.addColorStop(0,'rgba(78,59,29,0)');edge.addColorStop(1,'rgba(78,59,29,0.34)');cx.fillStyle=edge;cx.fillRect(0,0,1024,1024);
}else{
  // Footfall polishes an uneven pale path; darker grime stays at the shelves.
  var path=cx.createRadialGradient(540,560,40,540,560,510);path.addColorStop(0,'rgba(190,153,96,0.24)');path.addColorStop(0.55,'rgba(169,131,78,0.13)');path.addColorStop(1,'rgba(16,10,5,0.23)');cx.fillStyle=path;cx.fillRect(0,0,1024,1024);
  for(var sc=0;sc<190;sc++){
    var px=190+rnd(sc+1030)*650,py=rnd(sc+1470)*1024;
    cx.beginPath();cx.moveTo(px,py);cx.bezierCurveTo(px-6,py+3,px+8,py+10,px+12+rnd(sc+29)*23,py+12+rnd(sc+57)*15);
    cx.strokeStyle=sc%3?'rgba(210,177,120,0.26)':'rgba(20,12,6,0.38)';cx.lineWidth=0.7+rnd(sc+31)*2.2;cx.stroke();
  }
  for(var scratch=0;scratch<95;scratch++){var xx=rnd(scratch+1710)*1024,yy=rnd(scratch+1880)*1024;cx.strokeStyle='rgba(215,178,112,0.24)';cx.lineWidth=0.7;cx.beginPath();cx.moveTo(xx,yy);cx.lineTo(xx+2,yy+15+rnd(scratch+54)*50);cx.stroke();}
  [[245,730,62],[740,285,46],[620,880,30]].forEach(function(s){cx.strokeStyle='rgba(22,12,5,0.28)';cx.lineWidth=3;cx.beginPath();cx.ellipse(s[0],s[1],s[2],s[2]*0.48,0.2,0.3,5.8);cx.stroke();});
}
texture.image=c;texture.repeat.set(1,1);texture.needsUpdate=true;
}
var boardsTex = k.woodTex('#4a3420', '#1a0e06', 14); window.dssInteriorSurface(boardsTex, 'boards', 157);
boardsTex.wrapS = boardsTex.wrapT = THREE.RepeatWrapping; boardsTex.repeat.set(4, 6);
oiWeatherSurface(boardsTex,4,6,false);
var floor = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: boardsTex, bumpMap: boardsTex, bumpScale: 0.009, roughness: 0.78, envMap: k.roomEnv, envMapIntensity: 0.22 }), 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceilTex = tex(256, 256, function(cx, w, h) { cx.fillStyle = '#c8bca0'; cx.fillRect(0, 0, w, h); cx.strokeStyle = 'rgba(90,70,40,0.5)'; cx.lineWidth = 2; for (var i = 0; i < 4; i++) { cx.strokeRect(10 + i * 10, 10 + i * 10, w - 20 - i * 20, h - 20 - i * 20); } cx.beginPath(); cx.arc(w / 2, h / 2, 40, 0, 6.3); cx.stroke(); for (var p = 0; p < 8; p++) { cx.beginPath(); cx.ellipse(w / 2 + Math.cos(p * 0.785) * 28, h / 2 + Math.sin(p * 0.785) * 28, 10, 5, p * 0.785, 0, 6.3); cx.stroke(); } for (var g = 0; g < 2000; g++) { cx.fillStyle = 'rgba(60,40,20,0.08)'; cx.fillRect(rnd(g) * w, rnd(g * 3) * h, 1.5, 1.5); } });
ceilTex.wrapS = ceilTex.wrapT = THREE.RepeatWrapping; ceilTex.repeat.set(3, 5);
oiWeatherSurface(ceilTex,3,5,true);
var ceil = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: ceilTex, bumpMap: ceilTex, bumpScale: 0.006, roughness: 0.97 }), 0, H, 0); ceil.rotation.x = Math.PI / 2;
var wallPaint = k.paintTex('#4a3a28', 61, 'rgba(110,80,40,0.16)');
var wallMat = new THREE.MeshStandardMaterial({ map: wallPaint, roughness: 0.95 });
var back = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2); var front = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, D / 2); front.rotation.y = Math.PI;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2; var right = mesh(new THREE.PlaneGeometry(D, H), wallMat, W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2;
// ---------- THE SHELVES, floor to ceiling, both walls and the back, and the books in them ----------
var oiBookMagic = window.dssBookMagic(), oiBookSwaps=window.dssBookSwaps();
var bookCols = [0x6a2a1a, 0x2a3a5a, 0x1a4a2a, 0xa08030, 0xe8e0d0, 0x3a2a4a, 0x8a1a1a, 0x2a2a2a, 0xc8b070, 0x5a3a18, 0x7a6a50, 0x1a2a3a];
var spineTex = tex(64, 256, function(cx, w, h) { cx.fillStyle = 'rgba(255,255,255,0)'; cx.clearRect(0, 0, w, h); cx.fillStyle = 'rgba(230,200,120,0.75)'; cx.fillRect(10, 30, w - 20, 3); cx.fillRect(10, h - 40, w - 20, 3); for (var l = 0; l < 3; l++) cx.fillRect(14 + rnd(l) * 10, 60 + l * 14, w - 28 - rnd(l * 3) * 20, 4); cx.fillStyle = 'rgba(0,0,0,0.18)'; cx.fillRect(0, 0, 6, h); cx.fillRect(w - 6, 0, 6, h); });
function shelfWall(len, x, z, ry, seed, gaps) {
var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
// 2026-10-30 (Sam): a thin back and side uprights, not a solid block
// occupying the shelves — the old block buried almost every book spine.
mesh(new THREE.BoxGeometry(len, H - 0.1, 0.035), M.shelfWood, 0, (H - 0.1) / 2, -0.165, g);
[-1,1].forEach(function(side){mesh(new THREE.BoxGeometry(0.035,H-0.1,0.36),M.shelfWood,side*(len/2-0.0175),(H-0.1)/2,0,g);});
var n = Math.floor((H - 0.3) / 0.38);
for (var sh = 0; sh < n; sh++) {
var y = 0.12 + sh * 0.38;
mesh(new THREE.BoxGeometry(len, 0.03, 0.34), M.shelfWood, 0, y, 0.0, g);
if (gaps && gaps(sh)) continue;
var bx = -len / 2 + 0.03, rowBooks=[];
while (bx < len / 2 - 0.05) {
var bw = Math.min(0.035 + rnd(seed + sh * 100 + bx * 37) * 0.055, len/2-0.035-bx), bh = 0.23 + rnd(seed + sh * 7 + bx * 13) * 0.12;
if (rnd(seed + sh * 3 + bx * 5) < 0.015) { bx += 0.035; continue; }
var col = bookCols[Math.floor(rnd(seed + sh * 11 + bx * 17) * bookCols.length)];
var bm = new THREE.MeshStandardMaterial({ color: col, roughness: 0.85 });
oiBookMagic.add(bm);
var bd = 0.2 + rnd(bx + seed) * 0.1;
var bk = mesh(new THREE.BoxGeometry(bw, bh, bd), bm, bx + bw / 2, y + 0.015 + bh / 2, 0.04, g);
if (rnd(bx * 7 + seed) < 0.3) { var lettering=mesh(new THREE.PlaneGeometry(bw * 0.9, bh * 0.9), new THREE.MeshStandardMaterial({ map: spineTex, transparent: true, roughness: 0.8 }), bx + bw / 2, y + 0.015 + bh / 2, 0.04 + bd / 2 + 0.001, g); bk.attach(lettering); }
rowBooks.push(bk);
if (rnd(bx * 3 + seed) < 0.07) bk.rotation.z = 0.18;
bx += bw + 0.0015;
}
if(sh%3===1 && rowBooks.length>5)oiBookSwaps.pair(rowBooks[2],rowBooks[3]);
}
return g;
}
var shelfL = shelfWall(3.8, -W / 2 + 0.18, -1.6, Math.PI / 2, 1);
var shelfR = shelfWall(2.6, W / 2 - 0.18, -2.1, -Math.PI / 2, 2);
var shelfB = shelfWall(W - 0.4, 0, -D / 2 + 0.18, 0, 3, function(sh) { return sh === 3; });
/* 2026-10-29 (Sam's potions, "different colours ... around Inis's shop"): a row of them along the back wall's empty shelf, one in front of the right-hand books */
if (window.dssPotion) {
  var potCols = [0x9a1a3a, 0x2a6aa8, 0xc8a020, 0x5a2a8a, 0x2a8a5a, 0xc85a1a, 0x1a8a8a, 0xb02a7a, 0x6a9a2a];
  ['potion', 'elixir', 'flask', 'bomb', 'vial', 'jar', 'tube', 'potion', 'elixir'].forEach(function(kd, i) { var p = window.dssPotion(kd, potCols[i], k.roomEnv); if (!p) return; p.position.set(-1.65 + i * 0.41 + (rnd(i * 13) - 0.5) * 0.08, 0.12 + 3 * 0.38 + 0.015, 0.02 + rnd(i * 7) * 0.06); p.rotation.y = rnd(i) * 6; shelfB.add(p); });
  [['bomb', 0xd04a6a, 0.6, 2], ['vial', 0x3ab0c0, 0.75, 4]].forEach(function(d, i) { var p = window.dssPotion(d[0], d[1], k.roomEnv); if (p) { p.position.set(d[2], 0.12 + d[3] * 0.38 + 0.015, 0.16); shelfR.add(p); } });
}
// the ladder on its brass rail along the left shelves
var ladderG = new THREE.Group(); ladderG.position.set(-W / 2 + 0.55, 0, -1.6); ladderG.rotation.z = 0.12; scene.add(ladderG);
[[-0.2], [0.2]].forEach(function(s) { mesh(new THREE.BoxGeometry(0.04, 3.0, 0.03), M.oak, s[0], 1.5, 0, ladderG); });
for(var r=0;r<9;r++){var rung=mesh(new THREE.CylinderGeometry(0.014,0.014,0.4,12),detail.material('#9b7a49','glaze'),0,0.25+r*0.32,0,ladderG);rung.rotation.z=Math.PI/2;
[-1,1].forEach(function(side){var fixing=mesh(new THREE.SphereGeometry(0.004,8,5),M.brass,side*0.2,0.25+r*0.32,0.018,ladderG);fixing.scale.z=0.3;});}
mesh(new THREE.CylinderGeometry(0.015, 0.015, D - 1.8, 8), M.brass, -W / 2 + 0.42, H - 0.3, -0.8).rotation.x = Math.PI / 2;
var ladderHit = mesh(new THREE.BoxGeometry(0.6, 3.0, 0.4), M.hidden, 0, 1.5, 0, ladderG);
// an open book on the ladder's step, left there
var ladderBook=detail.group(0,1.22,0.02,ladderG);ladderBook.rotation.x=-0.4;
[-1,1].forEach(function(side){var leaf=detail.paperBlock(0.078,0.012,0.22,side*0.04,0,0,ladderBook,'#624637');leaf.rotation.z=-side*0.08;
var print=tex(64,128,function(c,w,h){c.fillStyle='#ded2b4';c.fillRect(0,0,w,h);c.fillStyle='#7c705b';for(var l=0;l<22;l++)c.fillRect(6,9+l*5,43+(l*7%10),0.7);});var face=mesh(new THREE.PlaneGeometry(0.072,0.21),new THREE.MeshStandardMaterial({map:print,roughness:1}),0,0.014,0,leaf);face.rotation.x=-Math.PI/2;});
// the stacks on the floor, the way a shop like this has them
function stack(x, z, n, seed) { var g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g); var y = 0; for (var i = 0; i < n; i++) { var h = 0.03 + rnd(seed + i) * 0.04, w = 0.18 + rnd(seed + i * 3) * 0.1, d = 0.24 + rnd(seed + i * 5) * 0.08; var b = mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: bookCols[Math.floor(rnd(seed + i * 7) * bookCols.length)], roughness: 0.85 }), (rnd(seed + i * 9) - 0.5) * 0.04, y + h / 2, (rnd(seed + i * 11) - 0.5) * 0.04, g); b.rotation.y = (rnd(seed + i * 13) - 0.5) * 0.4; b.castShadow = true; oiBookMagic.add(b.material);
var page=mesh(new THREE.BoxGeometry(w*0.95,h*0.72,d*0.96),detail.material('#c3b697','paper'),b.position.x,b.position.y,b.position.z+0.004,g);page.rotation.y=b.rotation.y;
[-1,1].forEach(function(side){var cover=mesh(new THREE.BoxGeometry(w+0.005,0.003,d+0.005),b.material,b.position.x,b.position.y+side*h*0.46,b.position.z,g);cover.rotation.y=b.rotation.y;});b.visible=false;
y += h; } k.contact(x, 0, z, 0.6); return g; }
stack(-1.4, 1.6, 9, 5); stack(-1.1, 1.75, 5, 6); stack(1.5, 0.4, 7, 7); stack(1.45, -0.3, 11, 8); stack(0.9, 2.6, 6, 9);
// ---------- THE COUNTER, thick, with INIS behind it, reading ----------
var counterG = new THREE.Group(); counterG.position.set(0.5, 0, -D / 2 + 1.7); scene.add(counterG);
var counterMat = new THREE.MeshStandardMaterial({ map: k.grain[0], bumpMap: k.grain[0], bumpScale: 0.004, roughness: 0.5, envMap: k.roomEnv, envMapIntensity: 0.4 });
var counterTop = mesh(new THREE.BoxGeometry(1.9, 0.09, 0.8), counterMat, 0, 0.98, 0, counterG); counterTop.castShadow = true; counterTop.receiveShadow = true;
mesh(new THREE.BoxGeometry(1.8, 0.9, 0.7), new THREE.MeshStandardMaterial({ map: k.grain[1], roughness: 0.6, envMap: k.roomEnv, envMapIntensity: 0.25 }), 0, 0.45, 0, counterG);
for (var pn = 0; pn < 3; pn++) mesh(new THREE.BoxGeometry(0.5, 0.6, 0.03), M.darkWood, -0.6 + pn * 0.6, 0.47, 0.36, counterG);
// the lamp on the counter, brass with a parchment shade, the pool of light he reads in
mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.02, 16), M.brass, -0.6, 1.035, -0.15, counterG); mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 8), M.brass, -0.6, 1.25, -0.15, counterG);
var shadeMat = new THREE.MeshPhysicalMaterial({ color: 0xe8d0a0, roughness: 0.8, emissive: 0xffd080, emissiveIntensity: 0.45, side: THREE.DoubleSide, transparent: true, opacity: 0.95 });
mesh(new THREE.CylinderGeometry(0.1, 0.17, 0.16, 18, 1, true), shadeMat, -0.6, 1.5, -0.15, counterG);
mesh(new THREE.SphereGeometry(0.03, 8, 6), new THREE.MeshBasicMaterial({ color: 0xfff0c8, toneMapped: false }), -0.6, 1.45, -0.15, counterG);
var lampLight = new THREE.PointLight(0xffc477, 1.75, 3.8, 1.8); lampLight.position.set(-0.6, 1.42, -0.1); lampLight.castShadow = true; lampLight.shadow.mapSize.set(512, 512); lampLight.shadow.bias = -0.002; counterG.add(lampLight);
var lampGlow = k.glow(-0.6, 1.45, -0.13, 0.65, 0.36, 0xffc477, counterG);
// what is on the counter: the book he is reading, open; a ledger; a pot of pens; a magnifying glass; the brown paper and string; a cup gone cold
var openBook = new THREE.Group(); openBook.position.set(0.1, 1.03, -0.12); counterG.add(openBook);
var pageTex = tex(128, 160, function(cx, w, h) { cx.fillStyle = '#ece4cc'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#2a2420'; for (var l = 0; l < 20; l++) cx.fillRect(12, 16 + l * 7, 30 + rnd(l * 3) * 74, 1.2); for (var g = 0; g < 400; g++) { cx.fillStyle = 'rgba(120,90,40,0.1)'; cx.fillRect(rnd(g) * w, rnd(g * 3) * h, 1, 1); } });
[-0.11, 0.11].forEach(function(px, i) { var pg = mesh(new THREE.BoxGeometry(0.2, 0.02, 0.28), new THREE.MeshStandardMaterial({ color: 0xe8e0c8, roughness: 0.95 }), px, 0.01, 0, openBook); pg.rotation.z = i ? -0.06 : 0.06; var face = mesh(new THREE.PlaneGeometry(0.18, 0.26), new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.95 }), px, 0.021, 0, openBook); face.rotation.x = -Math.PI / 2; face.rotation.y = i ? -0.06 : 0.06; });
mesh(new THREE.BoxGeometry(0.44, 0.012, 0.3), new THREE.MeshStandardMaterial({ color: 0x4a1a14, roughness: 0.7 }), 0, -0.002, 0, openBook);
var ledger = mesh(new THREE.BoxGeometry(0.3, 0.05, 0.42), new THREE.MeshStandardMaterial({ color: 0x1a2a3a, roughness: 0.75 }), 0.65, 1.05, 0.05, counterG); ledger.rotation.y = 0.15;ledger.material=detail.material('#273a47','cloth');ledger.visible=false;
var ledgerPages=detail.paperBlock(0.285,0.038,0.405,0.65,1.025,0.05,counterG,'#273a47');ledgerPages.rotation.y=0.15;
for(var rib=0;rib<4;rib++)mesh(new THREE.BoxGeometry(0.007,0.004,0.03),detail.material('#8a7a53','cloth'),0.498,1.054,-0.07+rib*0.08,counterG);
detail.lathe([[0,0],[0.03,0],[0.035,0.1],[0.031,0.1],[0.026,0.01],[0,0.01]],detail.material('#3e5445','glaze'),-0.25,1.025,0.22,counterG);detail.arc(counterG,0.033,0.0014,detail.material('#666a52','glaze'),-0.25,1.125,0.22); for (var pe = 0; pe < 4; pe++) mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.16, 6), new THREE.MeshStandardMaterial({ color: [0x1a1a1a, 0x8a1a1a, 0xd8c060, 0x1a1a1a][pe], roughness: 0.6 }), -0.25 + (rnd(pe) - 0.5) * 0.04, 1.17, 0.22 + (rnd(pe + 3) - 0.5) * 0.04, counterG).rotation.set((rnd(pe * 5) - 0.5) * 0.3, 0, (rnd(pe * 7) - 0.5) * 0.3);
var magG = new THREE.Group(); magG.position.set(0.35, 1.035, 0.24); magG.rotation.y = 0.8; counterG.add(magG); mesh(new THREE.TorusGeometry(0.05, 0.006, 8, 24), M.brass, 0, 0.006, 0, magG).rotation.x = Math.PI / 2; mesh(new THREE.CircleGeometry(0.046, 24), M.glass, 0, 0.006, 0, magG).rotation.x = -Math.PI / 2; mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.1, 8), M.darkWood, 0.1, 0.006, 0, magG).rotation.z = Math.PI / 2;
var parcel=mesh(new THREE.BoxGeometry(0.3,0.1,0.22),detail.material('#987d54','paper'),-0.75,1.08,0.2,counterG);
var stringMat=detail.material('#b5a17b','cloth');
detail.wire([[-0.9,1.134,0.2],[-0.75,1.134,0.2],[-0.6,1.134,0.2],[-0.598,1.03,0.2]],0.0014,stringMat,counterG);
detail.wire([[-0.75,1.03,0.088],[-0.75,1.134,0.088],[-0.75,1.134,0.31],[-0.75,1.03,0.312]],0.0014,stringMat,counterG);
mesh(new THREE.BoxGeometry(0.001,0.07,0.12),detail.material('#6b583d','paper'),-0.901,1.08,0.2,counterG);
 mesh(new THREE.TorusGeometry(0.035, 0.012, 8, 16), new THREE.MeshStandardMaterial({ color: 0xc8b080, roughness: 0.95 }), -0.6, 1.045, 0.3, counterG).rotation.x = Math.PI / 2;
detail.lathe([[0,0],[0.026,0],[0.03,0.012],[0.035,0.07],[0.031,0.07],[0.026,0.015],[0,0.015]],detail.material('#d6cfb9','glaze'),0.85,1.025,-0.25,counterG);
var cupHandle=mesh(new THREE.TorusGeometry(0.022,0.004,8,20,Math.PI*1.5),detail.material('#d6cfb9','glaze'),0.882,1.064,-0.25,counterG);cupHandle.rotation.z=-Math.PI*0.75;
detail.arc(counterG,0.0305,0.0008,detail.material('#8d744b','glaze'),0.85,1.086,-0.25);
 mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.004, 14), new THREE.MeshStandardMaterial({ color: 0x5a3a18, roughness: 0.3 }), 0.85, 1.09, -0.25, counterG);
// The lens edge is slightly green; the grip has turned bands and a worn end.
detail.arc(magG,0.046,0.001,detail.glass,0,0.007,0);
for(var grip=0;grip<4;grip++){var band=mesh(new THREE.CylinderGeometry(0.0105,0.0105,0.003,12),detail.material('#826648','metal'),0.07+grip*0.018,0.006,0,magG);band.rotation.z=Math.PI/2;}
// his chair, high and old, and Inis in it, not looking up
mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), M.darkWood, 0.1, 0.55, -0.75, counterG); mesh(new THREE.BoxGeometry(0.5, 0.7, 0.05), M.darkWood, 0.1, 0.95, -0.98, counterG); for (var sl = 0; sl < 5; sl++) mesh(new THREE.BoxGeometry(0.03, 0.6, 0.03), M.darkWood, -0.1 + sl * 0.1, 0.95, -0.95, counterG); [[-0.12, -0.55], [0.32, -0.55], [-0.12, -0.95], [0.32, -0.95]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.52, 8), M.darkWood, l[0], 0.26, l[1], counterG); });
var inis = k.ghost(0.6, 0.15, -D / 2 + 1.7 - 0.72, 51, 0.58, true, true, 1.05);
// his spectacles, caught in the lamp, and a pipe in the ashtray
mesh(new THREE.TorusGeometry(0.02, 0.003, 6, 16), M.brass, 0.55, 1.42, -D / 2 + 1.7 - 0.6); mesh(new THREE.TorusGeometry(0.02, 0.003, 6, 16), M.brass, 0.6, 1.42, -D / 2 + 1.7 - 0.6);
var specMetal=detail.material('#8b7954','metal');
detail.wire([[0.57,1.425,-D/2+1.1],[0.575,1.43,-D/2+1.1],[0.58,1.425,-D/2+1.1]],0.0012,specMetal);
[0.53,0.62].forEach(function(x){detail.wire([[x,1.42,-D/2+1.1],[x,1.418,-D/2+1.06],[x+0.02,1.415,-D/2+1.03]],0.0012,specMetal);});
var counterHit = mesh(new THREE.BoxGeometry(2.0, 0.6, 1.0), M.hidden, 0, 1.0, 0, counterG);
if (window.dssSkeleton) { var oiBones = window.dssSkeleton(); if (oiBones) { oiBones.position.set(-W / 2 + 0.78, 0, -0.35); oiBones.rotation.y = Math.PI / 2 - 0.25; scene.add(oiBones); } } /* 2026-10-30 (Sam): left side between the ladder and glass case, facing into the room; clear of the exit and its approach on the right. */
if (window.dssPotion) [['potion', 0x7a1aa0, 0.42, 0.26], ['tube', 0x2ab06a, 0.53, 0.3], ['flask', 0xd88a1a, -0.42, 0.28]].forEach(function(d) { var p = window.dssPotion(d[0], d[1], k.roomEnv); if (p) { p.position.set(d[2], 1.025, d[3]); counterG.add(p); } }); /* 2026-10-29: three on the counter */
// ---------- THE GLASS CASE of the better things, right, and the globe ----------
var caseG = new THREE.Group(); caseG.position.set(-W / 2 + 0.55, 0, 1.1); caseG.rotation.y = Math.PI / 2; scene.add(caseG);
mesh(new THREE.BoxGeometry(1.3, 0.8, 0.5), new THREE.MeshStandardMaterial({ map: k.grain[1], roughness: 0.55, envMap: k.roomEnv, envMapIntensity: 0.3 }), 0, 0.4, 0, caseG);
var caseGlass = new THREE.MeshPhysicalMaterial({ color: 0xf0f4f0, roughness: 0.04, transparent: true, opacity: 0.18, envMap: k.roomEnv, envMapIntensity: 1.2, clearcoat: 1 });
if (window.dssPotion) [['elixir', 0x1a4ac0, -0.45], ['jar', 0xa0c020, -0.1], ['bomb', 0xc01a2a, 0.3]].forEach(function(d) { var p = window.dssPotion(d[0], d[1], k.roomEnv); if (p) { p.position.set(d[2], 1.205, 0.02); caseG.add(p); } }); /* 2026-10-29: three on the glass case */
mesh(new THREE.BoxGeometry(1.26, 0.4, 0.46), caseGlass, 0, 1.0, 0, caseG); [[-0.63, 0], [0.63, 0]].forEach(function(e) { mesh(new THREE.BoxGeometry(0.02, 0.42, 0.48), M.brass, e[0], 1.0, 0, caseG); }); mesh(new THREE.BoxGeometry(1.28, 0.02, 0.48), M.brass, 0, 1.2, 0, caseG);
mesh(new THREE.BoxGeometry(1.2, 0.01, 0.4), new THREE.MeshStandardMaterial({ color: 0x3a1a2a, roughness: 0.95 }), 0, 0.805, 0, caseG);
[[-0.4, 0x8a1a1a, 0.18, 0.26], [-0.05, 0x1a3a2a, 0.14, 0.2], [0.3, 0xd8c8a0, 0.2, 0.28], [0.5, 0x2a2a4a, 0.1, 0.15]].forEach(function(b, i) { var bk = mesh(new THREE.BoxGeometry(b[2], 0.035, b[3]), new THREE.MeshStandardMaterial({ color: b[1], roughness: 0.6, envMap: k.roomEnv, envMapIntensity: 0.3 }), b[0], 0.83, (rnd(i) - 0.5) * 0.1, caseG); bk.rotation.y = (rnd(i * 3) - 0.5) * 0.5; oiBookMagic.add(bk.material); if (i === 2) { mesh(new THREE.PlaneGeometry(0.17, 0.25), new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.95 }), b[0], 0.849, (rnd(i) - 0.5) * 0.1, caseG).rotation.set(-Math.PI / 2, 0, bk.rotation.y); } mesh(new THREE.PlaneGeometry(0.06, 0.03), new THREE.MeshStandardMaterial({ color: 0xf0e8d0, roughness: 0.95 }), b[0], 0.812, 0.15, caseG).rotation.x = -Math.PI / 2; });
// Sam, 2026-10-11: a glass eye with an electric-blue iris lies in the case, the other of the pair to the green one in LACKLAND's dish; it looks back at whoever looks in
var caseEye = new THREE.Group(); caseEye.position.set(0.12, 0.834, 0.06); caseG.add(caseEye);
mesh(new THREE.SphereGeometry(0.028, 48, 36), new THREE.MeshPhysicalMaterial({ color: 0xf2f0e8, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05, envMap: k.roomEnv, envMapIntensity: 1 }), 0, 0, 0, caseEye);
// the iris painted on a cap of the sphere, in polar form: the top of the canvas is the pupil, the bottom the rim of the iris
var irisTex = tex(256, 128, function(cx, w, h) {
var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#020205'); g.addColorStop(0.3, '#020205'); g.addColorStop(0.34, '#0b3fa8'); g.addColorStop(0.55, '#1e90ff'); g.addColorStop(0.82, '#3aa8ff'); g.addColorStop(0.92, '#0a2a6a'); g.addColorStop(1, '#06163a');
cx.fillStyle = g; cx.fillRect(0, 0, w, h);
for (var f = 0; f < 140; f++) { var x = rnd(f * 7) * w, l = 0.25 + rnd(f * 11) * 0.5; cx.fillStyle = rnd(f * 13) > 0.5 ? 'rgba(170,225,255,0.35)' : 'rgba(5,30,90,0.35)'; cx.fillRect(x, h * 0.34, 1 + rnd(f) * 1.5, h * l * 0.66); }
cx.fillStyle = '#020205'; cx.fillRect(0, 0, w, h * 0.3); });
var irisCap = mesh(new THREE.SphereGeometry(0.0283, 64, 24, 0, Math.PI * 2, 0, 0.56), new THREE.MeshPhysicalMaterial({ map: irisTex, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.03, emissive: 0x0a3a8a, emissiveIntensity: 0.25, envMap: k.roomEnv, envMapIntensity: 0.8 }), 0, 0, 0, caseEye);
irisCap.rotation.x = Math.PI / 2;
caseG.updateMatrixWorld(true); caseEye.lookAt(-0.4, 1.4, 1.9);
var caseLight = new THREE.PointLight(0xffe0b0, 0.6, 2, 2); caseLight.position.set(0, 1.15, 0.1); caseG.add(caseLight); var caseGlow = k.glow(0, 1.18, 0, 0.9, 0.25, 0xffe0b0, caseG);
var caseHit = mesh(new THREE.BoxGeometry(1.4, 1.3, 0.7), M.hidden, 0, 0.65, 0, caseG);
var globeG = new THREE.Group(); globeG.position.set(-1.05, 0, -1.65); scene.add(globeG);
mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.9, 10), M.darkWood, 0, 0.45, 0, globeG); mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.04, 20), M.darkWood, 0, 0.02, 0, globeG);
// 2026-10-30 (Sam): pastel blue seas, pink and green land; keep the old grid and patina.
var globeTex = tex(256, 128, function(cx, w, h) { cx.fillStyle = '#a9c9df'; cx.fillRect(0, 0, w, h); var globePastels=['#b3d4b4','#e5b5c6','#bddbbf','#e8c1ce','#abd1b8']; [[20, 30, 60, 40], [100, 20, 70, 50], [60, 80, 40, 30], [180, 30, 50, 60], [150, 90, 60, 25]].forEach(function(c, ci) { cx.fillStyle=globePastels[ci]; cx.beginPath(); cx.ellipse(c[0] + c[2] / 2, c[1] + c[3] / 2, c[2] / 2, c[3] / 2, 0.3, 0, 6.3); cx.fill(); }); cx.strokeStyle = 'rgba(67,88,102,0.30)'; cx.lineWidth = 0.6; for (var ln = 0; ln < 12; ln++) { cx.beginPath(); cx.moveTo(ln * 21, 0); cx.lineTo(ln * 21, h); cx.stroke(); } for (var lt = 0; lt < 6; lt++) { cx.beginPath(); cx.moveTo(0, lt * 21); cx.lineTo(w, lt * 21); cx.stroke(); } for (var g = 0; g < 1500; g++) { cx.fillStyle = 'rgba(72,86,91,0.08)'; cx.fillRect(rnd(g) * w, rnd(g * 3) * h, 1, 1); } });
var globe = mesh(new THREE.SphereGeometry(0.3, 24, 16), new THREE.MeshStandardMaterial({ map: globeTex, roughness: 0.7, envMap: k.roomEnv, envMapIntensity: 0.2 }), 0, 1.22, 0, globeG); globe.rotation.z = 0.4;
mesh(new THREE.TorusGeometry(0.34, 0.012, 8, 32, Math.PI), M.brass, 0, 1.22, 0, globeG).rotation.z = Math.PI / 2 + 0.4;
var globeHit = mesh(new THREE.SphereGeometry(0.4, 10, 8), M.hidden, 0, 1.22, 0, globeG);
// ---------- THE DOOR with the bell over it, and THE WINDOW onto the court ----------
var doorG = new THREE.Group(); doorG.position.set(W / 2 - 0.03, 0, -0.2); doorG.rotation.y = -Math.PI / 2; scene.add(doorG);
var green = new THREE.MeshStandardMaterial({ color: 0x1a3a28, roughness: 0.4, envMap: k.roomEnv, envMapIntensity: 0.4 });
// 2026-10-30 (Sam): worn green paint, panel joinery and restrained brass fittings.
var doorPaint=tex(256,512,function(cx,w,h){
 cx.fillStyle='#2b503a';cx.fillRect(0,0,w,h);
 for(var i=0;i<95;i++){var x=rnd(i+430)*w;cx.strokeStyle=i%3?'rgba(8,24,15,0.20)':'rgba(135,154,112,0.15)';cx.lineWidth=0.6+rnd(i+438)*2;cx.beginPath();cx.moveTo(x,0);cx.bezierCurveTo(x+3,170,x-3,340,x+2,h);cx.stroke();}
 for(var j=0;j<200;j++){var x=rnd(j+507)*w,y=rnd(j+801)*h;if(x<18||x>w-18||y>h-45){cx.fillStyle=j%3?'rgba(171,143,91,0.48)':'rgba(12,30,18,0.55)';cx.fillRect(x,y,1+rnd(j)*5,2+rnd(j+9)*9);}}
 var wear=cx.createRadialGradient(w*.88,h*.61,2,w*.88,h*.61,45);wear.addColorStop(0,'rgba(173,150,99,0.27)');wear.addColorStop(1,'rgba(173,150,99,0)');cx.fillStyle=wear;cx.fillRect(0,0,w,h);
});
var doorGreen=new THREE.MeshStandardMaterial({map:doorPaint,bumpMap:doorPaint,bumpScale:0.003,roughness:0.73,envMap:k.roomEnv,envMapIntensity:0.18});
mesh(new THREE.BoxGeometry(0.95, 2.3, 0.06), doorGreen, 0, 1.15, 0, doorG);
var doorTrim=new THREE.MeshStandardMaterial({color:0x46604a,roughness:0.75});
[-0.325,0.325].forEach(function(x){mesh(new THREE.BoxGeometry(0.035,1.18,0.022),doorTrim,x,1.5,0.046,doorG);});
[0.925,2.075].forEach(function(y){mesh(new THREE.BoxGeometry(0.685,0.035,0.022),doorTrim,0,y,0.046,doorG);});
mesh(new THREE.BoxGeometry(0.68,0.62,0.012),doorGreen,0,0.47,0.036,doorG);
[-0.35,0.35].forEach(function(x){mesh(new THREE.BoxGeometry(0.025,0.66,0.024),doorTrim,x,0.47,0.049,doorG);});
[0.14,0.8].forEach(function(y){mesh(new THREE.BoxGeometry(0.72,0.025,0.024),doorTrim,0,y,0.049,doorG);});
var doorBrass=detail.material('#8b7950','metal');
mesh(new THREE.BoxGeometry(0.64,0.105,0.006),doorBrass,0,0.09,0.037,doorG);
[-0.27,0.27].forEach(function(x){[0.065,0.115].forEach(function(y){mesh(new THREE.SphereGeometry(0.005,6,4),M.brass,x,y,0.042,doorG);});});
[0.35,1.15,2.03].forEach(function(y){mesh(new THREE.BoxGeometry(0.04,0.105,0.012),doorBrass,-0.445,y,0.038,doorG);mesh(new THREE.CylinderGeometry(0.008,0.008,0.12,8),doorBrass,-0.455,y,0.05,doorG);});
// Handle and keyhole sit on the solid timber below the glass.
mesh(new THREE.BoxGeometry(0.055,0.12,0.012),doorBrass,0.37,0.86,0.047,doorG);
mesh(new THREE.BoxGeometry(0.13,0.018,0.025),doorBrass,0.325,0.88,0.075,doorG);
mesh(new THREE.CircleGeometry(0.007,8),M.black,0.37,0.83,0.055,doorG);
var courtTex = tex(256, 384, function(cx, w, h) { var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0a0c14'); g.addColorStop(0.5, '#141418'); g.addColorStop(1, '#1e1a16'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); cx.fillStyle = '#1a1612'; cx.fillRect(0, h * 0.1, w, h * 0.65); for (var wi = 0; wi < 6; wi++) { cx.fillStyle = rnd(wi) < 0.5 ? 'rgba(255,210,140,0.6)' : 'rgba(30,30,44,0.9)'; cx.fillRect(30 + (wi % 3) * 75, h * 0.2 + Math.floor(wi / 3) * 90, 36, 56); } var lg = cx.createRadialGradient(128, h * 0.38, 0, 128, h * 0.38, 90); lg.addColorStop(0, 'rgba(255,225,160,0.95)'); lg.addColorStop(0.15, 'rgba(255,210,140,0.5)'); lg.addColorStop(1, 'rgba(255,210,140,0)'); cx.fillStyle = lg; cx.fillRect(0, 0, w, h); cx.fillStyle = '#0a0a0a'; cx.fillRect(124, h * 0.4, 8, h * 0.36); cx.fillStyle = '#2a2a2e'; cx.fillRect(0, h * 0.75, w, h * 0.25); cx.fillStyle = 'rgba(255,220,150,0.18)'; cx.fillRect(90, h * 0.75, 80, h * 0.25); });
mesh(new THREE.PlaneGeometry(0.6, 1.1), new THREE.MeshBasicMaterial({ map: courtTex, toneMapped: false }), 0, 1.5, 0.035, doorG);
mesh(new THREE.BoxGeometry(1.1, 0.1, 0.12), M.darkWood, 0, 2.35, 0, doorG);
var bellG = new THREE.Group(); bellG.position.set(0.3, 2.5, 0.08); doorG.add(bellG);
mesh(new THREE.BoxGeometry(0.04, 0.3, 0.02), new THREE.MeshStandardMaterial({ color: 0x2a2a28, roughness: 0.6, metalness: 0.5 }), 0, -0.15, 0, bellG); var bellArm = mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.2, 6), new THREE.MeshStandardMaterial({ color: 0x2a2a28, roughness: 0.6, metalness: 0.5 }), 0, -0.3, 0.08, bellG); bellArm.rotation.x = 0.9;
var bell=detail.lathe([[0.007,0.04],[0.018,0.038],[0.022,0.025],[0.03,0.005],[0.047,-0.025],[0.067,-0.04],[0.068,-0.045],[0.061,-0.045],[0.04,-0.023],[0.025,0.01],[0.015,0.03]],detail.material('#a58c52','metal'),0,-0.4,0.16,bellG);bell.material.side=THREE.DoubleSide;detail.arc(bellG,0.064,0.0025,M.brass,0,-0.443,0.16);mesh(new THREE.CylinderGeometry(0.002,0.002,0.05,8),M.brass,0,-0.415,0.16,bellG); mesh(new THREE.SphereGeometry(0.012, 8, 6), M.brass, 0, -0.44, 0.16, bellG);
var bellHit = mesh(new THREE.BoxGeometry(0.4, 0.5, 0.4), M.hidden, 0, -0.3, 0.1, bellG);
var doorHit = mesh(new THREE.BoxGeometry(1.1, 2.2, 0.2), M.hidden, 0, 1.0, 0.05, doorG);
var winG = new THREE.Group(); winG.position.set(W / 2 - 0.03, 1.6, 1.0); winG.rotation.y = -Math.PI / 2; scene.add(winG);
mesh(new THREE.BoxGeometry(1.8, 2.0, 0.1), green, 0, 0, 0, winG);
mesh(new THREE.PlaneGeometry(1.6, 1.8), new THREE.MeshBasicMaterial({ map: courtTex, toneMapped: false }), 0, 0, 0.055, winG);
mesh(new THREE.PlaneGeometry(1.6, 1.8), caseGlass, 0, 0, 0.06, winG);
// the window's own books, backs to you, on a shelf the court sees
var oiWindowBooks=[];
mesh(new THREE.BoxGeometry(1.6, 0.03, 0.3), M.shelfWood, 0, -0.75, 0.2, winG); for (var wb = 0; wb < 7; wb++) { var wbk = mesh(new THREE.BoxGeometry(0.16 + rnd(wb) * 0.06, 0.24 + rnd(wb * 3) * 0.06, 0.03), new THREE.MeshStandardMaterial({ color: bookCols[(wb * 5) % bookCols.length], roughness: 0.8 }), -0.68 + wb * 0.22, -0.6, 0.25, winG); wbk.rotation.x = -0.2; oiBookMagic.add(wbk.material); oiWindowBooks.push(wbk); }
oiBookSwaps.pair(oiWindowBooks[2],oiWindowBooks[3]);
mesh(new THREE.BoxGeometry(0.05, 1.8, 0.04), green, 0, 0, 0.09, winG); mesh(new THREE.BoxGeometry(1.6, 0.05, 0.04), green, 0, 0.2, 0.09, winG);
var fasciaTex = tex(512, 64, function(cx, w, h) { cx.clearRect(0, 0, w, h); cx.save(); cx.translate(w, 0); cx.scale(-1, 1); cx.fillStyle = 'rgba(220,180,90,0.9)'; cx.font = 'bold 30px Georgia,serif'; cx.textAlign = 'center'; cx.fillText("I. O'FLATTERLY", w / 2, 42); cx.restore(); });
mesh(new THREE.PlaneGeometry(1.5, 0.19), new THREE.MeshBasicMaterial({ map: fasciaTex, transparent: true, toneMapped: false }), 0, 0.68, 0.065, winG);
var courtLight = new THREE.PointLight(0x8798b8, 0.38, 3.5, 2); courtLight.position.set(W / 2 - 0.6, 1.7, 0.7); scene.add(courtLight);
var courtGlow = k.glow(W / 2 - 0.1, 1.6, 1.0, 1.8, 0.12, 0x8798b8);
var winHit = mesh(new THREE.BoxGeometry(1.7, 2.1, 0.2), M.hidden, 0, 0, 0.05, winG);
// 2026-10-30 (Sam): moodier pools of amber, cooler court light and deeper shelf shadows.
// ---------- LIGHT: the lamp, a pendant with a green shade over the middle, the court through the glass ----------
var pendG = new THREE.Group(); pendG.position.set(0, H, -0.2); scene.add(pendG);
mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.0, 6), M.black, 0, -0.5, 0, pendG);
mesh(new THREE.ConeGeometry(0.26, 0.2, 18, 1, true), new THREE.MeshStandardMaterial({ color: 0x1a4a30, roughness: 0.5, side: THREE.DoubleSide, emissive: 0x0a2a18, emissiveIntensity: 0.4 }), 0, -1.05, 0, pendG);
mesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfff0c8, toneMapped: false }), 0, -1.1, 0, pendG);
var pendLight = new THREE.PointLight(0xffc78b, 0.62, 4.2, 1.9); pendLight.position.set(0, -1.15, 0); pendG.add(pendLight); var pendGlow = k.glow(0, -1.1, 0, 0.7, 0.3, 0xffc78b, pendG);
scene.add(new THREE.AmbientLight(0x30271e, 0.28));
scene.add(new THREE.HemisphereLight(0x8892a3, 0x17110c, 0.29));
var dustTex = tex(32, 32, function(cx, w, h) { var g = cx.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,237,197,0.85)'); g.addColorStop(0.22, 'rgba(255,237,197,0.4)'); g.addColorStop(1, 'rgba(255,237,197,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var moteN = 70, moteBase = new Float32Array(moteN * 3), motePos = new Float32Array(moteN * 3);
for (var mi = 0; mi < moteN; mi++) { moteBase[mi * 3] = -0.1 + (rnd(mi * 7) - 0.5) * 1.6; moteBase[mi * 3 + 1] = 0.6 + rnd(mi + 1) * 2.2; moteBase[mi * 3 + 2] = -D / 2 + 1.7 + (rnd(mi * 11) - 0.5) * 1.6; }
motePos.set(moteBase); var moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
scene.add(new THREE.Points(moteGeo, new THREE.PointsMaterial({ map: dustTex, color: 0xffe0c0, size: 0.018, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending })));
k.contact(0.5, 0, -D / 2 + 1.7, 2.6);
// ---------- THE CLOSE-UPS ----------
var CZ = -D / 2 + 1.7;
var hotspots = [
{ root: inis.hit, name: "INIS O’FLATTERLY", pos: [0.5, 1.5, CZ + 1.4], tgt: [0.6, 0.7, CZ - 0.72], haloAt: [0.6, 1.3, CZ - 0.72], haloSc: 1.1,
figure: true, actions: function() { return k.byText(['The Great Ham sent me', 'Approach', 'Show him the page']); } },
{ root: counterHit, name: 'A counter', pos: [0.3, 1.5, CZ + 1.2], tgt: [0.5, 1.0, CZ], haloAt: [0.5, 1.1, CZ], haloSc: 1.6 },
{ root: shelfL, name: 'Shelves', pos: [-0.3, 1.6, 0.2], tgt: [-W / 2, 1.5, -1.2], haloAt: [-W / 2 + 0.4, 1.5, -1.2], haloSc: 2.4 },
{ root: ladderHit, name: 'A ladder', pos: [-0.5, 1.6, -0.2], tgt: [-W / 2 + 0.55, 1.6, -1.6], haloAt: [-W / 2 + 0.55, 1.7, -1.6], haloSc: 1.2 },
{ root: caseHit, name: 'A glass case', pos: [-0.4, 1.4, 1.9], tgt: [-W / 2 + 0.55, 0.9, 1.1], haloAt: [-W / 2 + 0.8, 1.0, 1.1], haloSc: 1.3 },
{ root: globeHit, name: 'A globe', pos: [-0.15, 1.5, -0.35], tgt: [-1.05, 1.2, -1.65], haloAt: [-1.05, 1.25, -1.65], haloSc: 0.8 },
{ root: bellHit, name: 'A bell', pos: [1.0, 1.9, 0.3], tgt: [W / 2, 2.1, 0.1], haloAt: [W / 2 - 0.2, 2.1, 0.1], haloSc: 0.6, }, /* 2026-10-16 (Sam, later: "It should ring when you enter the shop, not later"): the bell rings at the door as you come in, not when you look at it */ // 2026-10-16 (Sam): the bell rings when you look at it
{ root: winHit, name: 'A window', pos: [0.5, 1.6, 1.0], tgt: [W / 2, 1.5, 1.0], haloAt: [W / 2 - 0.15, 1.5, 1.0], haloSc: 2.0 },
{ root: doorHit, name: 'A door', pos: [0.8, 1.3, -0.2], tgt: [W / 2, 1.2, -0.2], haloAt: [W / 2 - 0.15, 1.2, -0.2], haloSc: 1.2,
actions: function() { return window.dssStreetExit(); } } /* 2026-10-20: the shop's door is its way out (it was only looked at) */
];
return { hotspots: hotspots, frame: function(t, dt, still) {
oiBookMagic.frame(t, still);
oiBookSwaps.frame(t, still);
if (still) return;
lampLight.intensity = 1.75 + 0.035 * Math.sin(t * 1.1); lampGlow.material.opacity = 0.36 + 0.02 * Math.sin(t * 1.1);
pendLight.intensity = 0.62 + 0.025 * Math.sin(t * 0.9 + 1);
bell.rotation.x = Math.sin(t * 2.3) * 0.03 * Math.max(0, Math.sin(t * 0.2));
globe.rotation.y = t * 0.02;
for (var m = 0; m < moteN; m++) { motePos[m * 3] = moteBase[m * 3] + Math.sin(t * 0.15 + m) * 0.05; motePos[m * 3 + 1] = 0.6 + ((moteBase[m * 3 + 1] - 0.6 + (m % 2 ? 1 : -1) * t * 0.025) % 2.2 + 2.2) % 2.2; }
moteGeo.attributes.position.needsUpdate = true;
courtGlow.material.opacity = 0.12 + 0.01 * Math.sin(t * 0.6);
} };
}
});
// <<<< DSS ROOM OI END

