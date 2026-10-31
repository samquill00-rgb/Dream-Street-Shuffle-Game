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
wash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9000;background:' + (spec.wash || 'linear-gradient(180deg,rgba(10,8,6,0.3) 0%,rgba(6,5,4,0.05) 35%,rgba(6,5,4,0.05) 60%,rgba(3,2,2,0.45) 100%)') + ';';
wrap.appendChild(wash);
var vig = document.createElement('div');
vig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:' + (spec.vignette || 'radial-gradient(ellipse at 50% 44%,transparent 24%,rgba(0,0,0,0.74) 100%)') + ';';
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
// ====== INSIDE COPPER'S CELLAR — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-30. Built from the Copper's Lair approach scene (the cellar under
// the Colony: block walls with their drips, a concrete floor, joists and
// pipes, one bare bulb on its wire, the table at the far end, the
// chesterfield on its rug, the puddle) and from what the passage says: Copper
// in front of you, Quiet Frankie at the table, Ashton Granger opposite him.
// The room sits at the top of Turn to Copper (#cu-container) and is its
// navigation: Copper takes "Say nothing" and the two names; Ashton takes
// the look you are not supposed to give her. Frankie, the bulb, the stairs
// and the chesterfield are inspections, their card words pink placeholders
// for Sam. The password, when he knows the words, stays in the panel.
// 2026-10-31 (Sam: the approach "should match this inner view ... it's the only one where the approach is the same as the interior"):
// the spec is kept as window.dssCellarSpec, and Approach Coppers Lair (#cx-container) builds the same room from it, seen from the
// same place, with no close-ups and the old approach's one button. The old approach scene (initCoppersLair) is left unused.
window.dssCellarSpec = {
id: 'cu', caption: 'A CELLAR UNDER DEAN STREET', captionColor: 'rgba(200,190,150,0.22)',
bg: 0x050506, fog: [0x06060a, 0.05], exposure: 0.74, bloom: { bloomStrength: 0.42, bloomRadius: 0.55, bloomThreshold: 0.6 },
env: ['#4a4030', '#2a2820', '#08080a', '#e0cfa0'],
wash: 'linear-gradient(180deg,rgba(8,8,10,0.35) 0%,rgba(6,6,8,0.05) 35%,rgba(6,6,8,0.05) 60%,rgba(2,2,3,0.5) 100%)',
card: { fg: 'rgba(222,214,190,0.92)', bg: 'rgba(6,6,8,0.82)', border: 'rgba(190,180,140,0.3)', dim: 'rgba(190,185,150,0.5)', btn: 'rgba(230,222,190,0.95)', btnBorder: 'rgba(190,180,140,0.45)' },
cam: function(portrait) { return portrait ? { x: 0.2, y: 1.5, z: 5.2, tx: 0.0, ty: 1.05, tz: -2.6 } : { x: 0.3, y: 1.45, z: 4.4, tx: 0.0, ty: 1.05, tz: -2.6 }; },
build: function(k) {
var THREE_ = THREE, scene = k.scene, mesh = k.mesh, tex = k.tex, rnd = k.rnd, M = k.M;
var detail=window.dssDetailProps(mesh,tex,k.roomEnv,scene);
var W = 6.0, D = 12.0, H = 2.8;
// ---------- MATERIALS: concrete blocks with their drips, the stained floor, the stained ceiling ----------
function blockTex(seed) {
return tex(512, 256, function(cx, cw, ch) {
cx.fillStyle = '#585550'; cx.fillRect(0, 0, cw, ch);
var blockH = 32, blockW = 64, n = 0;
for (var row = 0; row < ch / blockH + 1; row++) { var ox = (row % 2 === 0) ? 0 : blockW / 2;
for (var col = -1; col < cw / blockW + 1; col++) { var bx = col * blockW + ox, by = row * blockH, shade = 72 + Math.floor(rnd(seed + n++) * 22);
cx.fillStyle = 'rgb(' + shade + ',' + (shade - 2) + ',' + (shade - 6) + ')'; cx.fillRect(bx + 1, by + 1, blockW - 2, blockH - 2);
cx.strokeStyle = 'rgba(40,38,35,0.7)'; cx.lineWidth = 1.5; cx.strokeRect(bx, by, blockW, blockH); } }
for (var i = 0; i < 30; i++) { cx.fillStyle = 'rgba(50,45,35,' + (rnd(seed * 3 + i) * 0.3) + ')'; cx.beginPath(); cx.arc(rnd(seed + i * 7) * cw, rnd(seed + i * 11) * ch, rnd(i) * 30 + 5, 0, Math.PI * 2); cx.fill(); }
for (var d = 0; d < 6; d++) { var dx = 40 + rnd(seed * 5 + d) * (cw - 80), dW = 3 + rnd(d + seed) * 5, dL = ch * (0.4 + rnd(d * 3 + seed) * 0.6);
var grd = cx.createLinearGradient(dx, 0, dx, dL); grd.addColorStop(0, 'rgba(20,18,12,0.85)'); grd.addColorStop(0.3, 'rgba(25,20,14,0.7)'); grd.addColorStop(0.7, 'rgba(20,18,12,0.4)'); grd.addColorStop(1, 'rgba(20,18,12,0)');
cx.fillStyle = grd; cx.beginPath(); cx.moveTo(dx - dW / 2, 0); cx.quadraticCurveTo(dx + dW, dL * 0.3, dx - dW * 0.3, dL * 0.6); cx.quadraticCurveTo(dx + dW * 0.5, dL * 0.85, dx, dL); cx.lineTo(dx + dW, dL); cx.quadraticCurveTo(dx + dW * 1.5, dL * 0.85, dx + dW * 1.3, dL * 0.6); cx.quadraticCurveTo(dx - dW * 0.5, dL * 0.3, dx + dW / 2, 0); cx.closePath(); cx.fill();
cx.fillStyle = 'rgba(80,75,65,0.2)'; cx.fillRect(dx - dW / 2, 0, dW, 8); }
var soot = cx.createLinearGradient(0, 0, 0, ch); soot.addColorStop(0, 'rgba(10,8,6,0.35)'); soot.addColorStop(0.5, 'rgba(10,8,6,0)'); soot.addColorStop(1, 'rgba(10,8,6,0.3)'); cx.fillStyle = soot; cx.fillRect(0, 0, cw, ch);
});
}
function wallMat(seed, rep) { var t = window.dssInteriorSurface(blockTex(seed), 'stone', seed); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, 1); return new THREE.MeshStandardMaterial({ map: t, bumpMap: t, bumpScale: 0.012, roughness: 0.92 }); }
var floorTex = tex(512, 512, function(cx, w, h) {
cx.fillStyle = '#3a3835'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 200; i++) { var shade = Math.floor(rnd(i) * 20) + 45; cx.fillStyle = 'rgba(' + shade + ',' + shade + ',' + (shade - 5) + ',0.4)'; cx.fillRect(rnd(i * 3) * w, rnd(i * 5) * h, rnd(i * 7) * 30 + 5, rnd(i * 9) * 30 + 5); }
for (var i = 0; i < 8; i++) { cx.strokeStyle = 'rgba(30,28,25,0.5)'; cx.lineWidth = 0.5 + rnd(i); cx.beginPath(); cx.moveTo(rnd(i * 2) * w, rnd(i * 4) * h); cx.lineTo(rnd(i * 6) * w, rnd(i * 8) * h); cx.stroke(); }
for (var i = 0; i < 12; i++) { var sx = rnd(i * 13) * w, sy = rnd(i * 17) * h, sr = 14 + rnd(i * 19) * 46; var sg = cx.createRadialGradient(sx, sy, 0, sx, sy, sr); sg.addColorStop(0, 'rgba(18,16,13,' + (0.22 + rnd(i) * 0.22).toFixed(2) + ')'); sg.addColorStop(1, 'rgba(18,16,13,0)'); cx.fillStyle = sg; cx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2); }
for (var i = 0; i < 6; i++) { var gx = rnd(i * 23) * w, gy = rnd(i * 29) * h, gl = 40 + rnd(i * 31) * 90, ga = rnd(i * 37) * Math.PI; cx.strokeStyle = 'rgba(22,20,17,' + (0.18 + rnd(i * 41) * 0.15).toFixed(2) + ')'; cx.lineWidth = 3 + rnd(i * 43) * 5; cx.beginPath(); cx.moveTo(gx, gy); cx.lineTo(gx + Math.cos(ga) * gl, gy + Math.sin(ga) * gl); cx.stroke(); }
});
window.dssInteriorSurface(floorTex, 'stone', 72);
floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(1, 2); /* 2026-10-31 (Sam: "plain concrete, not slabs"): back to the stained screed; the 2026-10-29 slate tiles are off */
var ceilTex = tex(512, 256, function(cx, cw, ch) { cx.fillStyle = '#4a4038'; cx.fillRect(0, 0, cw, ch); for (var i = 0; i < 15; i++) { cx.fillStyle = 'rgba(60,50,35,' + (rnd(i) * 0.3 + 0.1) + ')'; cx.beginPath(); cx.ellipse(rnd(i * 3) * cw, rnd(i * 5) * ch, rnd(i * 7) * 50 + 20, rnd(i * 9) * 20 + 10, 0, 0, Math.PI * 2); cx.fill(); } for (var wr = 0; wr < 5; wr++) { var wx = rnd(wr * 11) * cw, wy = rnd(wr * 13) * ch, wrr = 12 + rnd(wr * 17) * 26; cx.strokeStyle = 'rgba(60,48,32,0.35)'; cx.lineWidth = 1.5; cx.beginPath(); cx.arc(wx, wy, wrr, 0, Math.PI * 2); cx.stroke(); cx.fillStyle = 'rgba(52,42,30,0.12)'; cx.fill(); } });
ceilTex.wrapS = ceilTex.wrapT = THREE.RepeatWrapping; ceilTex.repeat.set(1, 2);
/* 2026-10-31 (Sam: "the pillars and joists ... should be metal"): the structure is painted steel gone to rust, was wood (k.grain[2]) */
var steelTex = tex(256, 256, function(cx, w, h) {
cx.fillStyle = '#3e423c'; cx.fillRect(0, 0, w, h); /* old grey-green paint */
for (var i = 0; i < 30; i++) { var x = rnd(i * 3 + 400) * w, y = rnd(i * 5 + 400) * h, r = 6 + rnd(i * 7 + 400) * 30, g = cx.createRadialGradient(x, y, 0, x, y, r);
g.addColorStop(0, 'rgba(112,58,26,0.75)'); g.addColorStop(0.6, 'rgba(84,46,22,0.4)'); g.addColorStop(1, 'rgba(84,46,22,0)'); cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); } /* rust blooms through */
for (var i = 0; i < 14; i++) { var x = rnd(i * 11 + 400) * w, l = 30 + rnd(i * 13 + 400) * 120, sg = cx.createLinearGradient(0, 0, 0, l); sg.addColorStop(0, 'rgba(96,50,22,0.5)'); sg.addColorStop(1, 'rgba(96,50,22,0)'); cx.fillStyle = sg; cx.fillRect(x, rnd(i * 17 + 400) * h * 0.5, 2 + rnd(i) * 3, l); } /* runs */
for (var i = 0; i < 700; i++) { cx.fillStyle = i % 3 ? 'rgba(20,20,18,0.25)' : 'rgba(150,150,138,0.18)'; cx.fillRect(rnd(i * 19 + 400) * w, rnd(i * 23 + 400) * h, 1 + rnd(i) * 2, 1); } /* pitting, chipped paint */
});
steelTex.wrapS = steelTex.wrapT = THREE.RepeatWrapping;
var woodBeam = new THREE.MeshStandardMaterial({ map: steelTex, bumpMap: steelTex, bumpScale: 0.004, roughness: 0.68, metalness: 0.55, envMap: k.roomEnv, envMapIntensity: 0.35 }); /* the name kept; it is steel now */
var pipeMat = new THREE.MeshStandardMaterial({ color: 0x555550, roughness: 0.55, metalness: 0.35, envMap: k.roomEnv, envMapIntensity: 0.4 });
var ironMat = new THREE.MeshStandardMaterial({ color: 0x2a2a28, roughness: 0.7, metalness: 0.4, envMap: k.roomEnv, envMapIntensity: 0.3 });
var wireMat = new THREE.MeshStandardMaterial({ color: 0x888878, roughness: 0.7 });
var concrete = new THREE.MeshStandardMaterial({ color: 0x484540, roughness: 0.92 });
// ---------- THE ROOM ----------
var floor = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: floorTex, bumpMap: floorTex, bumpScale: 0.01, roughness: 0.9 }), 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceil = mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.9 }), 0, H, 0); ceil.rotation.x = Math.PI / 2;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat(1, 3), -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2; left.receiveShadow = true;
var right = mesh(new THREE.PlaneGeometry(D, H), wallMat(2, 3), W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2; right.receiveShadow = true;
var far = mesh(new THREE.PlaneGeometry(W, H), wallMat(3, 1.5), 0, H / 2, -D / 2); far.receiveShadow = true;
var cuNet = window.dssNetting ? window.dssNetting(scene, { w: 2.0, h: 2.45, x: W / 2 - 0.06, y: 1.25, z: -D / 2 + 2.4, ry: -Math.PI / 2, tint: 0x7f948a, opacity: 0.8 }) : null; /* 2026-10-29 (Sam's construction mesh, sparingly): a length of netting down the right wall towards the far end of Copper's cellar */
/* 2026-10-31 (Sam: "embroider that with the art deco lily of the valley leaves that appear just before the dawn", the Dawn corner sprigs):
   the Dawn page's #dawnCornerArt, its paths copied as they are, stitched into the netting in gold thread at its four corners, mirrored
   as on the Dawn pane. Stems and tendrils in running stitch, the bells and the leaf in satin stitch. Laid on the netting's own billowed
   sheet (its geometry, drawn again a hair in front), so the thread moves with the cloth. */
if (cuNet) {
var EMB = { stem: ['M 0,12 Q 22,12 38,28 Q 56,48 60,80', 'M 38,28 Q 30,58 36,90 Q 44,108 38,120', 'M 0,4 Q 14,4 26,16', 'M 60,80 Q 78,86 84,78 Q 84,68 74,72 Q 72,82 80,82'],
leaf: 'M 26,16 Q 18,22 14,32 Q 22,28 28,22 Z', bud: [84, 78, 1.3],
/* (Sam, same night: "make it more visibly the flowers") the bells as flowers: [where on the stem x, y, which side, size]; the Dawn art's
   three at their heights, larger, white, each on its own stalk, and two smaller between them */
bells: [[32.5, 60, 1, 6.2], [33.6, 73, -1, 4.4], [35.8, 86, 1, 5.6], [38.6, 97, -1, 4], [41, 107, 1, 5]] };
var embTex = tex(1024, 1254, function(cx, cw, ch) {
cx.clearRect(0, 0, cw, ch);
var S = 4.1, IN = 30; /* the corner art's 130 units to about 1 m of the sheet, set in from the hem, so it reads from the stairs */
function satin(path, bx, by, bw, bh, c1, c2) { cx.save(); cx.clip(path); cx.lineWidth = 0.9; for (var s = -bh - bw; s < bw + bh; s += 0.55) { cx.strokeStyle = s % 1.1 < 0.55 ? (c1 || '#e2bf74') : (c2 || '#b8924a'); cx.beginPath(); cx.moveTo(bx + s, by - bh); cx.lineTo(bx + s + bh * 2, by + bh); cx.stroke(); } cx.restore(); }
function corner(fx, fy) {
cx.save(); cx.translate(fx < 0 ? cw - IN : IN, fy < 0 ? ch - IN : IN); cx.scale(S * fx, S * fy); cx.lineCap = 'round';
EMB.stem.forEach(function(d, i) { var p = new Path2D(d), w = i === 0 ? 2.1 : 1.5;
cx.setLineDash([]); cx.lineWidth = w + 0.5; cx.strokeStyle = 'rgba(16,12,6,0.55)'; cx.save(); cx.translate(0.35, 0.45); cx.stroke(p); cx.restore(); /* the thread's shadow on the net */
cx.setLineDash([3.2, 0.7]); cx.lineWidth = w; cx.strokeStyle = '#c99d4e'; cx.stroke(p); /* running stitch */
cx.setLineDash([1.6, 2.3]); cx.lineWidth = w * 0.4; cx.strokeStyle = '#f2d89a'; cx.stroke(p); }); /* the twist catching light */
cx.setLineDash([]);
var lp = new Path2D(EMB.leaf); satin(lp, 21, 24, 10, 10); cx.lineWidth = 0.45; cx.strokeStyle = '#8a6a30'; cx.stroke(lp);
EMB.bells.forEach(function(b) { /* a stalk arching off the stem, and a bell hanging from it: domed top, flared three-scallop rim */
var r = b[3], bx = b[0] + b[2] * (r * 1.15 + 2), by = b[1] + r * 1.3;
cx.lineWidth = 1.0; cx.strokeStyle = '#c99d4e'; cx.beginPath(); cx.moveTo(b[0], b[1]); cx.quadraticCurveTo(b[0] + b[2] * r * 0.9, b[1] - r * 0.4, bx, by - r * 1.05); cx.stroke();
var bp = new Path2D(); bp.moveTo(bx - r * 0.7, by - r * 0.2); bp.quadraticCurveTo(bx - r * 0.75, by - r * 1.1, bx, by - r * 1.1); bp.quadraticCurveTo(bx + r * 0.75, by - r * 1.1, bx + r * 0.7, by - r * 0.2);
bp.quadraticCurveTo(bx + r * 0.8, by + r * 0.5, bx + r * 1.05, by + r * 0.75); bp.quadraticCurveTo(bx + r * 0.7, by + r * 0.55, bx + r * 0.35, by + r * 0.85); bp.quadraticCurveTo(bx, by + r * 0.55, bx - r * 0.35, by + r * 0.85);
bp.quadraticCurveTo(bx - r * 0.7, by + r * 0.55, bx - r * 1.05, by + r * 0.75); bp.quadraticCurveTo(bx - r * 0.8, by + r * 0.5, bx - r * 0.7, by - r * 0.2); bp.closePath();
cx.save(); cx.translate(0.4, 0.5); cx.fillStyle = 'rgba(16,12,6,0.5)'; cx.fill(bp); cx.restore(); /* its shadow on the net */
satin(bp, bx, by, r * 1.1, r * 1.2, '#f6efdc', '#d8ccae'); cx.lineWidth = 0.6; cx.strokeStyle = '#b8924a'; cx.stroke(bp); /* white silk, outlined in gold */
cx.fillStyle = 'rgba(255,252,240,0.7)'; cx.beginPath(); cx.ellipse(bx - r * 0.3, by - r * 0.55, r * 0.18, r * 0.3, -0.3, 0, Math.PI * 2); cx.fill(); }); /* the bell's sheen */
cx.fillStyle = '#e8c884'; cx.beginPath(); cx.arc(EMB.bud[0], EMB.bud[1], EMB.bud[2] + 0.3, 0, Math.PI * 2); cx.fill(); /* a French knot */
cx.restore();
}
corner(1, 1); corner(-1, 1); corner(1, -1); corner(-1, -1);
});
var emb = new THREE.Mesh(cuNet.geometry, new THREE.MeshStandardMaterial({ map: embTex, emissive: 0xffffff, emissiveMap: embTex, emissiveIntensity: 0.28, transparent: true, alphaTest: 0.08, roughness: 0.48, metalness: 0.35, envMap: k.roomEnv, envMapIntensity: 0.5, side: THREE.DoubleSide, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
emb.position.copy(cuNet.position); emb.rotation.copy(cuNet.rotation); emb.translateZ(0.004); emb.renderOrder = (cuNet.renderOrder || 0) + 1; scene.add(emb);
}
var near = mesh(new THREE.PlaneGeometry(W, H), wallMat(4, 1.5), 0, H / 2, D / 2); near.rotation.y = Math.PI;
// joists, the two long bearers, the posts that hold the house up
for (var jz = -D / 2 + 1; jz <= D / 2 - 1; jz += 1.8) { var j = mesh(new THREE.BoxGeometry(W - 0.2, 0.12, 0.08), woodBeam, 0, H - 0.06, jz); j.castShadow = true; }
[-1.5, 1.5].forEach(function(bx) { /* the bearers as steel I-beams: two flanges and a web */
mesh(new THREE.BoxGeometry(0.15, 0.018, D - 0.4), woodBeam, bx, H - 0.009, 0); mesh(new THREE.BoxGeometry(0.15, 0.018, D - 0.4), woodBeam, bx, H - 0.191, 0);
mesh(new THREE.BoxGeometry(0.018, 0.17, D - 0.4), woodBeam, bx, H - 0.1, 0);
});
[[-1.2, 1.5], [1.2, -1.5], [-1.3, -4.6]].forEach(function(p) { /* the posts as round steel columns, plated at the foot and the head */
var post = mesh(new THREE.CylinderGeometry(0.055, 0.055, H - 0.2, 14), woodBeam, p[0], (H - 0.2) / 2, p[1]); post.castShadow = true;
mesh(new THREE.BoxGeometry(0.2, 0.014, 0.2), woodBeam, p[0], 0.007, p[1]); mesh(new THREE.BoxGeometry(0.18, 0.014, 0.18), woodBeam, p[0], H - 0.207, p[1]);
});
// pipes along the walls, a junction box, the wire stapled to the joist
var p1 = mesh(new THREE.CylinderGeometry(0.04, 0.04, D - 1, 8), pipeMat, -W / 2 + 0.15, H - 0.3, 0); p1.rotation.x = Math.PI / 2;
var p2 = mesh(new THREE.CylinderGeometry(0.05, 0.05, D - 3, 8), pipeMat, W / 2 - 0.2, 2.35, -0.5); p2.rotation.x = Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.04, 0.04, H, 8), ironMat, W / 2 - 0.15, H / 2, 2.4);
mesh(new THREE.BoxGeometry(0.3, 0.3, 0.5), ironMat, W / 2 - 0.25, H - 0.5, 1); mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8), ironMat, W / 2 - 0.15, H - 0.5, 0.3);
for (var cp = -4; cp < 5; cp += 4) { var cpipe = mesh(new THREE.CylinderGeometry(0.02, 0.02, W * 0.6, 6), wireMat, 0, H - 0.15, cp); cpipe.rotation.z = Math.PI / 2; }
// ---------- THE BULB, on its wire, with the air it lights ----------
var bulbG = new THREE.Group(); bulbG.position.set(0, H - 0.05, 0.6); scene.add(bulbG);
mesh(new THREE.CylinderGeometry(0.005, 0.005, 1.0, 4), wireMat, 0, -0.5, 0, bulbG);
mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.08, 8), ironMat, 0, -1.0, 0, bulbG);
var bulbGlass = new THREE.MeshStandardMaterial({ color: 0xeeeee8, roughness: 0.2, emissive: 0xe8d8b0, emissiveIntensity: 1.4, transparent: true, opacity: 0.9, toneMapped: false });
mesh(new THREE.SphereGeometry(0.06, 12, 8), bulbGlass, 0, -1.08, 0, bulbG);
var bulbLight = new THREE.PointLight(0xd8c8a0, 1.35, 16, 1.4); bulbLight.position.set(0, -1.12, 0); bulbLight.castShadow = true; bulbLight.shadow.mapSize.set(512, 512); bulbLight.shadow.radius = 6; bulbLight.shadow.bias = -0.002; bulbG.add(bulbLight);
var bulbGlow = k.glow(0, -1.08, 0, 0.7, 0.55, 0xf0e0b0, bulbG);
var shaft = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.9, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0xbbaa90, transparent: true, opacity: 0.045, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); shaft.position.set(0, -1.12 - 0.95, 0); bulbG.add(shaft);
var wirePts = [new THREE.Vector3(0, H - 1.0, 0.6), new THREE.Vector3(0.8, H - 0.6, 0.6), new THREE.Vector3(1.8, H - 0.3, 0.6), new THREE.Vector3(W / 2 - 0.1, H - 0.2, 0.6)];
scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(wirePts), 20, 0.008, 4, false), wireMat));
var bulbHit = mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.3, 8), M.hidden, 0, -0.65, 0, bulbG);
var hazeTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(160,150,130,0.3)'); g.addColorStop(0.55, 'rgba(140,130,115,0.12)'); g.addColorStop(1, 'rgba(120,112,100,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var haze = [];
for (var hz = 0; hz < 6; hz++) { var hs = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTex, transparent: true, opacity: 0.07 + rnd(hz) * 0.05, depthWrite: false })); hs.position.set((rnd(hz * 3) - 0.5) * 5, 0.9 + rnd(hz * 5) * 1.3, -2 + rnd(hz * 7) * 5); var hsc = 3.5 + rnd(hz * 9) * 3; hs.scale.set(hsc, hsc * 0.6, 1); hs.userData = { ph: rnd(hz * 11) * 6.28, sp: 0.12 + rnd(hz * 13) * 0.2, base: hs.material.opacity }; scene.add(hs); haze.push(hs); }
var moteTex = tex(32, 32, function(cx, w, h) { var g = cx.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,240,210,1)'); g.addColorStop(0.35, 'rgba(255,230,190,0.5)'); g.addColorStop(1, 'rgba(255,220,170,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var MOTES = 70, motePos = new Float32Array(MOTES * 3), moteSeed = [];
for (var mi = 0; mi < MOTES; mi++) { var mr = rnd(mi * 3 + 50) * 0.9, ma = rnd(mi * 5 + 50) * 6.283, my = 0.25 + rnd(mi * 7 + 50) * 1.4; motePos[mi * 3] = Math.cos(ma) * mr * (0.3 + my * 0.5); motePos[mi * 3 + 1] = my; motePos[mi * 3 + 2] = 0.6 + Math.sin(ma) * mr * (0.3 + my * 0.5); moteSeed.push([rnd(mi * 11 + 50) * 6.28, 0.04 + rnd(mi * 13 + 50) * 0.05, 0.1 + rnd(mi * 17 + 50) * 0.25]); }
var moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
var motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({ map: moteTex, color: 0xffe8c0, size: 0.028, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, fog: false })); scene.add(motes);
scene.add(new THREE.AmbientLight(0x1a1620, 0.45)); scene.add(new THREE.HemisphereLight(0x3a3630, 0x0a0806, 0.22));
var farFill = new THREE.PointLight(0x8090aa, 0.45, 8, 1.6); farFill.position.set(0, 2.2, -D / 2 + 0.5); scene.add(farFill);
var rim = new THREE.PointLight(0x506080, 0.35, 7, 2); rim.position.set(0.3, 1.2, -D / 2 + 3.0); scene.add(rim);
// ---------- THE TABLE at the far end: Quiet Frankie, Ashton opposite, her notebook, his hands ----------
var tableG = new THREE.Group(); tableG.position.set(0, 0, -D / 2 + 2.4); scene.add(tableG);
var tableMat = new THREE.MeshStandardMaterial({ map: k.grain[1], roughness: 0.8, envMap: k.roomEnv, envMapIntensity: 0.2 });
var top = mesh(new THREE.BoxGeometry(1.5, 0.06, 0.8), tableMat, 0, 0.72, 0, tableG); top.castShadow = true; top.receiveShadow = true;
[[-0.65, -0.3], [0.65, -0.3], [-0.65, 0.3], [0.65, 0.3]].forEach(function(l) { mesh(new THREE.BoxGeometry(0.06, 0.7, 0.06), M.darkWood, l[0], 0.35, l[1], tableG); });
// a lamp on the table with a green shade, the only other light in the room
mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.26, 8), M.brass, 0.45, 0.88, -0.15, tableG);
var shade = mesh(new THREE.ConeGeometry(0.14, 0.12, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0x1a4a2a, roughness: 0.6, side: THREE.DoubleSide, emissive: 0x0a2a14, emissiveIntensity: 0.4 }), 0.45, 1.02, -0.15, tableG);
mesh(new THREE.SphereGeometry(0.02, 8, 6), new THREE.MeshBasicMaterial({ color: 0xfff0c0, toneMapped: false }), 0.45, 0.98, -0.15, tableG);
detail.arc(tableG,0.138,0.003,M.brass,0.45,0.96,-0.15);
mesh(new THREE.CylinderGeometry(0.055,0.07,0.015,24),M.brass,0.45,0.76,-0.15,tableG);detail.button(tableG,0.47,0.78,-0.15,0.006,'#322d24');
var tableLight = new THREE.PointLight(0xffe0a0, 0.9, 3.2, 1.6); tableLight.position.set(0.45, 0.95, -0.15); tableG.add(tableLight);
var tableGlow = k.glow(0.45, 0.97, -0.15, 0.45, 0.4, 0xffe0a0, tableG);
// her notebook and pen, his glass, an ashtray with the night in it, a folded newspaper
var notebook=detail.paperBlock(0.2,0.014,0.26,-0.35,0.75,0.12,tableG,'#504a38');notebook.rotation.y=0.25;for(var stitch=0;stitch<6;stitch++){var loop=mesh(new THREE.TorusGeometry(0.004,0.0008,4,10),M.chrome,-0.45,0.766,0.035+stitch*0.032,tableG);loop.rotation.y=Math.PI/2;}
var penG=detail.group(-0.28,0.77,0.06,tableG);penG.rotation.set(Math.PI/2,0,0.6);
mesh(new THREE.CylinderGeometry(0.004,0.0045,0.12,12),M.black,0,0,0,penG);
mesh(new THREE.ConeGeometry(0.004,0.017,10),M.brass,0,0.068,0,penG);
mesh(new THREE.CylinderGeometry(0.0048,0.0048,0.004,12),M.brass,0,-0.035,0,penG);mesh(new THREE.BoxGeometry(0.0015,0.024,0.002),M.brass,0.005,-0.038,0,penG);
var whiskyGlass=detail.group(0.35,0.75,0.2,tableG);detail.cup(whiskyGlass,0.03,0.08);
mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.03, 12), new THREE.MeshStandardMaterial({ color: 0xc27a18, roughness: 0.1, transparent: true, opacity: 0.7, emissive: 0x5a3000, emissiveIntensity: 0.3 }), 0.35, 0.765, 0.2, tableG);
detail.ash(0.05,0.75,-0.2,tableG,0.05);
var news=detail.paperBlock(0.28,0.006,0.2,-0.5,0.75,-0.22,tableG,'#c5bca4');news.rotation.y=-0.4;
var newsTex=tex(256,192,function(c,w,h){c.fillStyle='#c9c0a9';c.fillRect(0,0,w,h);c.fillStyle='#67604f';c.fillRect(12,12,232,4);for(var col=0;col<4;col++)for(var line=0;line<35;line++){c.globalAlpha=0.35+(line%3)*0.1;c.fillRect(12+col*60,28+line*4,43+(line*7%11),1);}c.globalAlpha=0.25;c.fillRect(0,94,w,2);});
var newsFace=mesh(new THREE.PlaneGeometry(0.27,0.19),new THREE.MeshStandardMaterial({map:newsTex,roughness:1}),0,0.010,0,news);newsFace.rotation.x=-Math.PI/2;
// the two chairs and the two of them
function chair(x, z, ry, parent) { var c = new THREE.Group(); c.position.set(x, 0, z); c.rotation.y = ry; parent.add(c); mesh(new THREE.BoxGeometry(0.42, 0.04, 0.42), M.darkWood, 0, 0.45, 0, c); mesh(new THREE.BoxGeometry(0.42, 0.5, 0.04), M.darkWood, 0, 0.72, -0.19, c); [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 6), M.darkWood, l[0], 0.225, l[1], c); }); return c; }
chair(0.45, -0.55, 0, tableG); chair(-0.45, 0.55, Math.PI, tableG);
var frankie = k.ghost(0.45, 0, -D / 2 + 2.4 - 0.55, 3, 0.8, true, false, 1.2);      // Quiet Frankie, a planet, the sort of man with moons
var ashton = k.ghost(-0.45, 0, -D / 2 + 2.4 + 0.55, 5, 0.82, true, true, 0.95);   // Ashton Granger, twirling her hair, scribbling without looking
// ---------- COPPER, between you and the room ----------
var copper = k.ghost(-0.85, 0, 2.3, 7, 0.9, false, true, 0.92);                    // a big man in a small body, or the other way round
copper.hit.scale.set(1.5, 1, 1.5);
// ---------- THE STAIRS you came down, the door he closed behind you ----------
var stairG = new THREE.Group(); stairG.position.set(-W / 2 + 0.7, 0, -0.5); stairG.rotation.y = Math.PI; scene.add(stairG);
var stairMat = new THREE.MeshStandardMaterial({ map: k.grain[1], roughness: 0.85 });
for (var s = 0; s < 9; s++) { var st = mesh(new THREE.BoxGeometry(1.0, 0.22, 0.28), stairMat, 0, 0.11 + s * 0.22, s * 0.28, stairG); st.castShadow = true; st.receiveShadow = true; }
mesh(new THREE.BoxGeometry(0.08, 2.4, 2.7), concrete, 0.55, 1.2, 1.15, stairG);
var stairRail = mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.9, 8), ironMat, -0.45, 1.3, 1.15, stairG); stairRail.rotation.x = -Math.atan2(1.98, 2.5);
mesh(new THREE.BoxGeometry(0.9, 2.0, 0.08), M.darkWood, 0, 2.0 + 1.0, 2.6, stairG);
mesh(new THREE.SphereGeometry(0.03, 8, 6), M.brass, 0.32, 3.0, 2.56, stairG);
// the line of light under the door, and nothing else coming down it
mesh(new THREE.PlaneGeometry(0.86, 0.03), new THREE.MeshBasicMaterial({ color: 0xffe8c0, toneMapped: false }), 0, 2.0 + 0.02, 2.55, stairG);
var spillTex = tex(32, 128, function(cx, w, h) { var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(255,232,190,0.55)'); g.addColorStop(0.25, 'rgba(255,225,180,0.22)'); g.addColorStop(0.7, 'rgba(240,210,160,0.05)'); g.addColorStop(1, 'rgba(240,210,160,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); var side = cx.createLinearGradient(0, 0, w, 0); side.addColorStop(0, 'rgba(0,0,0,0.6)'); side.addColorStop(0.2, 'rgba(0,0,0,0)'); side.addColorStop(0.8, 'rgba(0,0,0,0)'); side.addColorStop(1, 'rgba(0,0,0,0.6)'); cx.globalCompositeOperation = 'destination-out'; cx.fillStyle = side; cx.fillRect(0, 0, w, h); });
var spillGeo = new THREE.BufferGeometry(); spillGeo.setAttribute('position', new THREE.Float32BufferAttribute([-0.43, 2.03, 2.52, 0.43, 2.03, 2.52, -0.43, 1.08, 0.9, 0.43, 1.08, 0.9], 3)); spillGeo.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 1, 1], 2)); spillGeo.setIndex([0, 2, 1, 1, 2, 3]); spillGeo.computeVertexNormals();
var spill = new THREE.Mesh(spillGeo, new THREE.MeshBasicMaterial({ map: spillTex, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); stairG.add(spill);
var doorLine = new THREE.PointLight(0xffe0a0, 0.25, 2.5, 2); doorLine.position.set(0, 2.1, 2.3); stairG.add(doorLine);
var stairHit = mesh(new THREE.BoxGeometry(1.2, 3.2, 3.0), M.hidden, 0, 1.6, 1.3, stairG);
// ---------- THE CHESTERFIELD on its rug, against the right wall ----------
// 2026-10-31 (Sam: "the chesterfield sofa and the turkish rug ... feel underdeveloped"): both rebuilt. The rug is a worn Turkish weave
// (madder field, a stepped indigo medallion with its pendants, spandrels, an indigo main border of hooked lozenges between guard stripes,
// abrash bands, the pile walked down to the warp in front of the sofa, a stain), with its fringes on the short ends where a rug has them.
// The chesterfield is oxblood leather gone dull: deep-buttoned back and inner arms (dimpled for real, a button in each), scroll arms as
// high as the back, two seat cushions, brass nailheads, turned bun feet, creases and rubbed patches where it has been sat in.
var RUG_W = 2.6, RUG_L = 3.6;
var rugTex = tex(740, 1024, function(cx, w, h) {
var MAD = '#7a1d16', MADD = '#5e1510', IND = '#1f2944', INDL = '#2e3c5e', IVO = '#d8c9a4', SAF = '#b98a34', BRN = '#3c2216';
cx.fillStyle = MAD; cx.fillRect(0, 0, w, h);
function stepDiamond(x, y, rw, rh, st, fill, line) { /* a lozenge with stepped edges, as a knotted rug draws one */
var pts = [], n = Math.max(2, Math.round(rh / st));
for (var i = 0; i <= n; i++) { var yy = y - rh + i * (rh / n), ww = rw * (i / n); pts.push([x + ww, yy]); pts.push([x + ww, yy + rh / n]); }
for (var i = n; i >= 0; i--) { var yy = y + rh - i * (rh / n), ww = rw * (i / n); pts.push([x + ww, yy]); pts.push([x + ww, yy - rh / n]); }
cx.beginPath(); cx.moveTo(x, y - rh);
for (var i = 0; i < n; i++) { var a = rw * (i + 1) / n, yy = y - rh + i * rh / n; cx.lineTo(x + a, yy); cx.lineTo(x + a, yy + rh / n); }
for (var i = n - 1; i >= 0; i--) { var a = rw * (i + 1) / n, yy = y + (n - 1 - i) * rh / n; cx.lineTo(x + a, yy); cx.lineTo(x + rw * i / n, yy); }
for (var i = 0; i < n; i++) { var a = rw * (i + 1) / n, yy = y + rh - i * rh / n; cx.lineTo(x - a, yy); cx.lineTo(x - a, yy - rh / n); }
for (var i = n - 1; i >= 0; i--) { var a = rw * (i + 1) / n, yy = y - (n - 1 - i) * rh / n; cx.lineTo(x - a, yy); cx.lineTo(x - rw * i / n, yy); }
cx.closePath(); if (fill) { cx.fillStyle = fill; cx.fill(); } if (line) { cx.strokeStyle = line; cx.lineWidth = 3; cx.stroke(); }
}
function star(x, y, r, col) { cx.fillStyle = col; for (var a = 0; a < 4; a++) { cx.save(); cx.translate(x, y); cx.rotate(a * Math.PI / 4); cx.fillRect(-r, -r * 0.28, r * 2, r * 0.56); cx.restore(); } }
/* borders: outer guard, main border, inner guard */
var B0 = 14, B1 = 34, B2 = 112, B3 = 132;
cx.fillStyle = BRN; cx.fillRect(0, 0, w, h); cx.fillStyle = IVO; cx.fillRect(B0 - 6, B0 - 6, w - 2 * (B0 - 6), h - 2 * (B0 - 6)); cx.fillStyle = MAD; cx.fillRect(B0, B0, w - 2 * B0, h - 2 * B0);
for (var t = B0; t < w - B0; t += 16) { cx.fillStyle = (t / 16) % 2 ? SAF : IND; cx.beginPath(); cx.moveTo(t, B0); cx.lineTo(t + 8, B1 - 4); cx.lineTo(t + 16, B0); cx.fill(); cx.beginPath(); cx.moveTo(t, h - B0); cx.lineTo(t + 8, h - B1 + 4); cx.lineTo(t + 16, h - B0); cx.fill(); }
for (var t = B0; t < h - B0; t += 16) { cx.fillStyle = (t / 16) % 2 ? SAF : IND; cx.beginPath(); cx.moveTo(B0, t); cx.lineTo(B1 - 4, t + 8); cx.lineTo(B0, t + 16); cx.fill(); cx.beginPath(); cx.moveTo(w - B0, t); cx.lineTo(w - B1 + 4, t + 8); cx.lineTo(w - B0, t + 16); cx.fill(); }
cx.fillStyle = IND; cx.fillRect(B1, B1, w - 2 * B1, h - 2 * B1); /* the main border, indigo */
var mid = (B1 + B2) / 2, seg = 74, cols = [IVO, SAF, MAD];
for (var t = B1 + seg / 2, k2 = 0; t < w - B1; t += seg, k2++) { stepDiamond(t, mid, 26, 26, 6, cols[k2 % 3], BRN); stepDiamond(t, h - mid, 26, 26, 6, cols[(k2 + 1) % 3], BRN); star(t, mid, 7, IND); star(t, h - mid, 7, IND); }
for (var t = B2 + seg / 2, k2 = 0; t < h - B2; t += seg, k2++) { stepDiamond(mid, t, 26, 26, 6, cols[(k2 + 2) % 3], BRN); stepDiamond(w - mid, t, 26, 26, 6, cols[k2 % 3], BRN); star(mid, t, 7, IND); star(w - mid, t, 7, IND); }
[[mid, mid], [w - mid, mid], [mid, h - mid], [w - mid, h - mid]].forEach(function(c) { star(c[0], c[1], 22, SAF); star(c[0], c[1], 11, MAD); });
cx.fillStyle = IVO; cx.fillRect(B2, B2, w - 2 * B2, h - 2 * B2); cx.fillStyle = SAF; cx.fillRect(B2 + 5, B2 + 5, w - 2 * (B2 + 5), h - 2 * (B2 + 5));
cx.fillStyle = IVO; cx.fillRect(B2 + 11, B2 + 11, w - 2 * (B2 + 11), h - 2 * (B2 + 11)); cx.fillStyle = MAD; cx.fillRect(B3, B3, w - 2 * B3, h - 2 * B3); /* the field */
/* spandrels: indigo stepped corners into the field */
[[B3, B3, 1, 1], [w - B3, B3, -1, 1], [B3, h - B3, 1, -1], [w - B3, h - B3, -1, -1]].forEach(function(c) { cx.fillStyle = IND; cx.beginPath(); cx.moveTo(c[0], c[1]);
for (var s = 0; s < 7; s++) { cx.lineTo(c[0] + c[2] * (150 - s * 21), c[1] + c[3] * s * 21); cx.lineTo(c[0] + c[2] * (150 - s * 21), c[1] + c[3] * (s + 1) * 21); } cx.lineTo(c[0], c[1] + c[3] * 150); cx.closePath(); cx.fill();
star(c[0] + c[2] * 40, c[1] + c[3] * 40, 14, IVO); star(c[0] + c[2] * 40, c[1] + c[3] * 40, 6, MAD); });
/* small motifs scattered through the field */
for (var i = 0; i < 46; i++) { var x = B3 + 30 + rnd(i * 13 + 7) * (w - 2 * B3 - 60), y = B3 + 30 + rnd(i * 17 + 7) * (h - 2 * B3 - 60); var dx = (x - w / 2) / 170, dy = (y - h / 2) / 330; if (dx * dx + dy * dy < 1.15) continue;
if (i % 3 === 0) star(x, y, 9, IVO); else if (i % 3 === 1) stepDiamond(x, y, 8, 11, 4, IND, null); else { cx.fillStyle = SAF; cx.fillRect(x - 6, y - 2, 12, 4); cx.fillRect(x - 2, y - 6, 4, 12); } }
/* the medallion and its pendants */
cx.fillStyle = IND; stepDiamond(w / 2, h / 2 - 300, 28, 40, 8, IND, IVO); stepDiamond(w / 2, h / 2 + 300, 28, 40, 8, IND, IVO);
cx.fillStyle = IVO; cx.fillRect(w / 2 - 3, h / 2 - 262, 6, 40); cx.fillRect(w / 2 - 3, h / 2 + 222, 6, 40);
stepDiamond(w / 2, h / 2, 170, 230, 18, IVO, null); stepDiamond(w / 2, h / 2, 158, 216, 18, IND, null); stepDiamond(w / 2, h / 2, 104, 142, 14, MADD, IVO);
stepDiamond(w / 2, h / 2, 56, 76, 10, SAF, BRN); star(w / 2, h / 2, 26, IND); star(w / 2, h / 2, 12, IVO);
[[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(function(d) { star(w / 2 + d[0] * 112, h / 2 + d[1] * 160, 14, SAF); });
/* abrash: the dye lots drift across the rug in bands */
for (var y = 0; y < h; y += 6) { var a = Math.sin(y * 0.013 + 1.3) * 0.5 + Math.sin(y * 0.041) * 0.3; cx.fillStyle = a > 0 ? 'rgba(255,220,180,' + (a * 0.06).toFixed(3) + ')' : 'rgba(10,4,2,' + (-a * 0.08).toFixed(3) + ')'; cx.fillRect(0, y, w, 6); }
/* knots: the pile's grid, and its nap */
for (var y = 0; y < h; y += 3) { cx.fillStyle = 'rgba(12,6,3,0.10)'; cx.fillRect(0, y, w, 1); } for (var x = 0; x < w; x += 3) { cx.fillStyle = 'rgba(230,200,150,0.04)'; cx.fillRect(x, 0, 1, h); }
for (var i = 0; i < 9000; i++) { cx.fillStyle = i % 2 ? 'rgba(0,0,0,0.12)' : 'rgba(255,230,190,0.06)'; cx.fillRect(rnd(i * 3 + 1) * w, rnd(i * 7 + 1) * h, 2, 1); }
/* wear: the pile walked down to the ivory warp in a track in front of the sofa (the rug's left half, upright), a stain, frayed edges */
for (var i = 0; i < 26; i++) { var x = 150 + rnd(i * 5 + 90) * 210, y = 200 + rnd(i * 9 + 90) * 620, r = 30 + rnd(i * 11 + 90) * 70, g = cx.createRadialGradient(x, y, 0, x, y, r);
g.addColorStop(0, 'rgba(176,150,112,0.38)'); g.addColorStop(1, 'rgba(176,150,112,0)'); cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); }
cx.strokeStyle = 'rgba(214,198,160,0.22)'; cx.lineWidth = 1; for (var x = 160; x < 380; x += 4) { cx.beginPath(); cx.moveTo(x, 260 + rnd(x) * 60); cx.lineTo(x, 760 - rnd(x * 3) * 60); cx.stroke(); }
var sg = cx.createRadialGradient(470, 640, 4, 470, 640, 60); sg.addColorStop(0, 'rgba(26,12,6,0.55)'); sg.addColorStop(0.7, 'rgba(26,12,6,0.3)'); sg.addColorStop(1, 'rgba(26,12,6,0)'); cx.fillStyle = sg; cx.beginPath(); cx.ellipse(470, 640, 64, 44, 0.4, 0, Math.PI * 2); cx.fill();
for (var i = 0; i < 60; i++) { var side = i % 2, y = rnd(i * 23 + 3) * h; cx.fillStyle = 'rgba(214,198,160,0.5)'; cx.fillRect(side ? w - 4 : 0, y, 4, 4 + rnd(i) * 14); }
for (var i = 0; i < 220; i++) { cx.fillStyle = 'rgba(14,8,4,' + (rnd(i * 29 + 5) * 0.16).toFixed(2) + ')'; cx.fillRect(rnd(i * 31 + 5) * w, rnd(i * 37 + 5) * h, 6 + rnd(i) * 30, 4 + rnd(i * 2) * 20); }
});
/* 2026-10-31 (Sam: "a public domain real persian rug, fit it over the rug I have here, adjust for lighting"): the photograph (Commons, Abrash.JPG,
   warmed and a little desaturated for the bulb into assets/cellar-rug.jpg) is painted over the drawn rug when it loads, then walked on again:
   the track in front of the sofa, the stain, grime, a dark overcast selvedge down the long sides, the frayed ends. The drawn rug stays as the fallback. */
var rugImg = new Image(); rugImg.onload = function() { var c = rugTex.image, cx = c.getContext('2d'), w = c.width, h = c.height;
cx.drawImage(rugImg, 0, 0, w, h);
for (var i = 0; i < 22; i++) { var x = 150 + rnd(i * 5 + 90) * 210, y = 200 + rnd(i * 9 + 90) * 620, r = 30 + rnd(i * 11 + 90) * 70, g = cx.createRadialGradient(x, y, 0, x, y, r);
g.addColorStop(0, 'rgba(170,150,118,0.22)'); g.addColorStop(1, 'rgba(170,150,118,0)'); cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); }
var sg = cx.createRadialGradient(470, 640, 4, 470, 640, 60); sg.addColorStop(0, 'rgba(20,10,4,0.5)'); sg.addColorStop(0.7, 'rgba(20,10,4,0.25)'); sg.addColorStop(1, 'rgba(20,10,4,0)'); cx.fillStyle = sg; cx.beginPath(); cx.ellipse(470, 640, 64, 44, 0.4, 0, Math.PI * 2); cx.fill();
for (var i = 0; i < 160; i++) { cx.fillStyle = 'rgba(14,8,4,' + (rnd(i * 29 + 5) * 0.14).toFixed(2) + ')'; cx.fillRect(rnd(i * 31 + 5) * w, rnd(i * 37 + 5) * h, 6 + rnd(i) * 30, 4 + rnd(i * 2) * 20); }
cx.fillStyle = '#1a1210'; cx.fillRect(0, 0, 7, h); cx.fillRect(w - 7, 0, 7, h); for (var y = 0; y < h; y += 5) { cx.fillStyle = 'rgba(120,96,70,0.5)'; cx.fillRect(1, y, 5, 2); cx.fillRect(w - 6, y + 2, 5, 2); }
cx.fillStyle = 'rgba(200,184,150,0.8)'; cx.fillRect(0, 0, w, 5); cx.fillRect(0, h - 5, w, 5);
var eg = cx.createLinearGradient(0, 0, w, 0); eg.addColorStop(0, 'rgba(0,0,0,0.25)'); eg.addColorStop(0.08, 'rgba(0,0,0,0)'); eg.addColorStop(0.92, 'rgba(0,0,0,0)'); eg.addColorStop(1, 'rgba(0,0,0,0.25)'); cx.fillStyle = eg; cx.fillRect(0, 0, w, h);
rugTex.needsUpdate = true; if (rugMat) { rugMat.color.setHex(0xc8bcb0); rugMat.bumpScale = 0.006; rugMat.needsUpdate = true; } };
rugImg.src = 'assets/cellar-rug.jpg?v=1';
var rugMat = new THREE.MeshStandardMaterial({ map: rugTex, bumpMap: rugTex, bumpScale: 0.004, roughness: 0.95, color: 0x8a7a70 });
var rug = mesh(new THREE.BoxGeometry(RUG_W, 0.01, RUG_L), [M.hidden, M.hidden, rugMat, M.hidden, M.hidden, M.hidden], W / 2 - 1.2, 0.005, 0.2); rug.receiveShadow = true;
var fringeTex = tex(512, 32, function(cx, w, h) { cx.clearRect(0, 0, w, h); for (var x = 2; x < w; x += 4) { var l = h * (0.55 + rnd(x * 0.37) * 0.45), lean = (rnd(x * 0.91) - 0.5) * 6; cx.strokeStyle = 'rgba(' + (196 + Math.round(rnd(x) * 30)) + ',' + (180 + Math.round(rnd(x * 2) * 26)) + ',150,0.95)'; cx.lineWidth = 1.6; cx.beginPath(); cx.moveTo(x, 0); cx.quadraticCurveTo(x + lean * 0.5, l * 0.5, x + lean, l); cx.stroke(); }
for (var x = 0; x < w; x += 16) { cx.fillStyle = 'rgba(150,130,100,0.9)'; cx.fillRect(x + 2, 0, 12, 3); } }); /* knotted warp ends, grubby ivory */
[-1, 1].forEach(function(e) { var fr = mesh(new THREE.PlaneGeometry(RUG_W - 0.02, 0.09), new THREE.MeshStandardMaterial({ map: fringeTex, transparent: true, alphaTest: 0.2, roughness: 1, side: THREE.DoubleSide }), W / 2 - 1.2, 0.006, 0.2 + e * (RUG_L / 2 + 0.043)); fr.rotation.x = -Math.PI / 2; if (e < 0) fr.rotation.z = Math.PI; });
var sofaG = new THREE.Group(); sofaG.position.set(W / 2 - 0.55, 0, 0.2); scene.add(sofaG); /* built with its back to +x, its length along z */
var leatherTex = tex(512, 512, function(cx, w, h) {
cx.fillStyle = '#5c1712'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 6000; i++) { cx.fillStyle = i % 2 ? 'rgba(20,4,2,0.18)' : 'rgba(150,60,40,0.10)'; cx.fillRect(rnd(i * 3 + 11) * w, rnd(i * 5 + 11) * h, 1 + rnd(i) * 2, 1); } /* grain */
cx.lineWidth = 1; for (var i = 0; i < 40; i++) { var x = rnd(i * 7 + 11) * w, y = rnd(i * 13 + 11) * h, a = rnd(i * 17 + 11) * Math.PI, l = 20 + rnd(i * 19 + 11) * 80; cx.strokeStyle = 'rgba(24,6,4,0.4)'; cx.beginPath(); cx.moveTo(x, y); cx.quadraticCurveTo(x + Math.cos(a + 0.4) * l * 0.5, y + Math.sin(a + 0.4) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); cx.stroke(); } /* creases */
for (var i = 0; i < 14; i++) { var x = rnd(i * 23 + 11) * w, y = rnd(i * 29 + 11) * h, r = 20 + rnd(i * 31 + 11) * 60, g = cx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(150,80,56,0.3)'); g.addColorStop(1, 'rgba(150,80,56,0)'); cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); } /* rubbed to the brown */
});
leatherTex.wrapS = leatherTex.wrapT = THREE.RepeatWrapping; leatherTex.repeat.set(1.6, 1.6);
var chesterRed = new THREE.MeshStandardMaterial({ map: leatherTex, bumpMap: leatherTex, bumpScale: 0.003, roughness: 0.46, metalness: 0.05, envMap: k.roomEnv, envMapIntensity: 1.1, emissive: 0x160604 }); /* the room's sky lends the shadowed sides a leather sheen, so the arm away from the bulb is not a black slab */
var chesterDark = chesterRed.clone(); chesterDark.color.setHex(0xd8c8c8);
function rbox(w, h, d, r, mat, x, y, z) { /* a padded block: a rounded box */
var s = new THREE.Shape(), a = w / 2 - r, b = h / 2 - r; s.moveTo(-a, -b); s.lineTo(a, -b); s.lineTo(a, b); s.lineTo(-a, b); s.lineTo(-a, -b);
var g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.001, d - 2 * r), bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 4, curveSegments: 4 }); g.translate(0, 0, -(d - 2 * r) / 2);
var m = mesh(g, mat, x, y, z, sofaG); m.castShadow = true; m.receiveShadow = true; return m;
}
var buttonMat = new THREE.MeshStandardMaterial({ color: 0x2a0806, roughness: 0.45, envMap: k.roomEnv, envMapIntensity: 0.4 });
function tufted(pw, ph, nx, ny, depth) { /* a deep-buttoned panel, dimpled in a diamond grid, a button in each dimple; faces +z */
var g = new THREE.PlaneGeometry(pw, ph, nx * 8, ny * 8), p = g.attributes.position, pts = [], gp = new THREE.Group();
for (var j = 0; j <= ny; j++) for (var i = 0; i <= nx; i++) { if ((i + j) % 2) continue; pts.push([-pw / 2 + pw * i / nx, -ph / 2 + ph * j / ny]); }
for (var v = 0; v < p.count; v++) { var x = p.getX(v), y = p.getY(v), dmin = 9; for (var q = 0; q < pts.length; q++) { var dx = x - pts[q][0], dy = y - pts[q][1], dd = Math.sqrt(dx * dx + dy * dy); if (dd < dmin) dmin = dd; }
var edge = Math.min(1, Math.min(pw / 2 - Math.abs(x), ph / 2 - Math.abs(y)) / 0.03); p.setZ(v, depth * Math.min(1, dmin / (pw / nx * 0.6)) * edge); }
g.computeVertexNormals(); var m = new THREE.Mesh(g, chesterRed); m.castShadow = true; m.receiveShadow = true; gp.add(m);
pts.forEach(function(c) { if (Math.abs(c[0]) > pw / 2 - 0.01 || Math.abs(c[1]) > ph / 2 - 0.01) return; var bt = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 6), buttonMat); bt.position.set(c[0], c[1], 0.004); bt.scale.z = 0.6; gp.add(bt); });
return gp;
}
var SL = 1.95, SD = 0.82; /* length, depth */
rbox(SD, 0.26, SL, 0.04, chesterRed, 0, 0.21, 0); /* the base, on its feet */
[-1, 1].forEach(function(s) { rbox(0.6, 0.13, SL / 2 - 0.2, 0.05, chesterRed, -0.08, 0.405, s * (SL / 4 - 0.1)); }); /* two seat cushions */
rbox(0.2, 0.46, SL, 0.05, chesterDark, SD / 2 - 0.1, 0.57, 0); /* the back */
var backRoll = mesh(new THREE.CylinderGeometry(0.105, 0.105, SL + 0.02, 20), chesterDark, SD / 2 - 0.1, 0.8, 0, sofaG); backRoll.rotation.x = Math.PI / 2; backRoll.castShadow = true;
[-1, 1].forEach(function(s) { /* the arms: a padded side, a roll on top as high as the back, a pleated scroll end */
var z = s * (SL / 2 - 0.085);
rbox(SD, 0.46, 0.17, 0.05, chesterDark, 0, 0.57, z);
var roll = mesh(new THREE.CylinderGeometry(0.11, 0.11, SD + 0.02, 20), chesterDark, 0, 0.8, z + s * 0.02, sofaG); roll.rotation.z = Math.PI / 2; roll.castShadow = true;
var scroll = new THREE.Mesh(new THREE.CircleGeometry(0.112, 24), new THREE.MeshStandardMaterial({ map: tex(128, 128, function(cx, w, h) { cx.fillStyle = '#4a120e'; cx.fillRect(0, 0, w, h); for (var a = 0; a < 18; a++) { cx.strokeStyle = 'rgba(16,4,2,0.6)'; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(64, 64); cx.lineTo(64 + Math.cos(a / 18 * Math.PI * 2) * 64, 64 + Math.sin(a / 18 * Math.PI * 2) * 64); cx.stroke(); } cx.fillStyle = '#2a0806'; cx.beginPath(); cx.arc(64, 64, 9, 0, Math.PI * 2); cx.fill(); }), roughness: 0.55 }));
scroll.position.set(-SD / 2 - 0.012, 0.8, z + s * 0.02); scroll.rotation.y = -Math.PI / 2; sofaG.add(scroll);
var tp = tufted(SD - 0.32, 0.3, 4, 3, 0.028); tp.position.set(-0.07, 0.62, z - s * 0.086); tp.rotation.y = s < 0 ? 0 : Math.PI; sofaG.add(tp);
});
var tb = tufted(SL - 0.38, 0.36, 12, 3, 0.03); tb.position.set(SD / 2 - 0.201, 0.64, 0); tb.rotation.y = -Math.PI / 2; sofaG.add(tb); /* the deep-buttoned back */
var nails = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0075, 8, 6), M.brass, 140), nm = new THREE.Matrix4(), ni = 0; /* brass nailheads round the base and up the arm fronts */
for (var zz = -SL / 2 + 0.03; zz <= SL / 2 - 0.03 && ni < 140; zz += 0.026) nails.setMatrixAt(ni++, nm.makeTranslation(-SD / 2 - 0.004, 0.31, zz));
[-1, 1].forEach(function(s) { for (var yy = 0.36; yy <= 0.7 && ni < 140; yy += 0.026) nails.setMatrixAt(ni++, nm.makeTranslation(-SD / 2 - 0.004, yy, s * (SL / 2 - 0.085))); });
nails.count = ni; sofaG.add(nails);
[[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function(c) { detail.lathe([[0, 0], [0.03, 0], [0.045, 0.02], [0.042, 0.05], [0.03, 0.07], [0.036, 0.08], [0, 0.08]], M.darkWood, c[0] * (SD / 2 - 0.07), 0, c[1] * (SL / 2 - 0.08), sofaG, 16); }); /* turned bun feet */
// a folded racing paper on the seat (the coat over the arm went 2026-10-31: Sam read it as a stray bit of wood)
mesh(new THREE.BoxGeometry(0.22, 0.01, 0.3), M.paper, -0.12, 0.475, 0.35, sofaG).rotation.y = 0.3;
// ---------- STOCK: crates and a barrel by the left wall, a safe, the puddle ----------
var crateMat = new THREE.MeshStandardMaterial({ map: k.grain[2], roughness: 0.9 });
[[-2.3, -1.6, 0], [-2.2, -0.9, 0.5], [-2.35, -1.25, 0.3]].forEach(function(c, i) { var cr = mesh(new THREE.BoxGeometry(0.55, 0.42, 0.5), crateMat, c[0], 0.21 + (i === 2 ? 0.42 : 0), c[1], undefined); cr.rotation.y = c[2] * 0.3; cr.castShadow = true;
var crateG=detail.group(c[0],0.21+(i===2?0.42:0),c[1]);crateG.rotation.y=cr.rotation.y;
[-1,1].forEach(function(side){for(var slat=0;slat<4;slat++){mesh(new THREE.BoxGeometry(0.5,0.004,0.002),detail.material('#31291c','cloth'),0,-0.15+slat*0.1,side*0.252,crateG);}[-0.22,0.22].forEach(function(x){mesh(new THREE.BoxGeometry(0.042,0.4,0.018),crateMat,x,0,side*0.255,crateG);[-0.16,0.16].forEach(function(y){var nail=mesh(new THREE.SphereGeometry(0.004,6,4),M.chrome,x,y,side*0.267,crateG);nail.scale.z=0.3;});});}); });
var barrelG=detail.group(-2.3,0,0.4);var staveMat=detail.material('#53402a','cloth'),hoopMat=detail.material('#4b4a40','metal');
detail.lathe([[0,0],[0.24,0],[0.27,0.08],[0.285,0.35],[0.27,0.62],[0.24,0.7],[0,0.7]],staveMat,0,0,0,barrelG,32);
[0.07,0.2,0.5,0.63].forEach(function(y){var r=0.247+Math.sin(y/0.7*Math.PI)*0.038;detail.arc(barrelG,r,0.009,hoopMat,0,y,0);});
for(var seam=0;seam<16;seam++){var angle=seam/16*Math.PI*2;detail.wire([[Math.cos(angle)*0.242,0.01,Math.sin(angle)*0.242],[Math.cos(angle)*0.286,0.35,Math.sin(angle)*0.286],[Math.cos(angle)*0.242,0.69,Math.sin(angle)*0.242]],0.0018,detail.material('#2a261d','cloth'),barrelG);}
mesh(new THREE.CylinderGeometry(0.025,0.025,0.008,12),M.darkWood,0.08,0.704,0.03,barrelG);
var safe = mesh(new THREE.BoxGeometry(0.6, 0.8, 0.6), new THREE.MeshStandardMaterial({ color: 0x1e2a1e, roughness: 0.45, metalness: 0.5, envMap: k.roomEnv, envMapIntensity: 0.4 }), -2.4, 0.4, -3.6); safe.castShadow = true;
mesh(new THREE.BoxGeometry(0.012,0.68,0.48),detail.material('#3b4338','metal'),-2.091,0.4,-3.6);
[-1,1].forEach(function(side){mesh(new THREE.CylinderGeometry(0.019,0.019,0.09,10),M.chrome,-2.08,0.4+side*0.23,-3.83);});
var safeDial=mesh(new THREE.CylinderGeometry(0.035,0.035,0.015,24),M.chrome,-2.07,0.6,-3.49);safeDial.rotation.z=Math.PI/2;
for(var tick=0;tick<12;tick++){var angle=tick*Math.PI/6;mesh(new THREE.SphereGeometry(0.002,5,4),M.black,-2.061,0.6+Math.cos(angle)*0.028,-3.49+Math.sin(angle)*0.028);}
mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 20), M.brass, -2.09, 0.5, -3.6).rotation.y = Math.PI / 2;
var puddleTex = tex(256, 256, function(cx, cw, ch) { cx.clearRect(0, 0, cw, ch); var g = cx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, cw / 2); g.addColorStop(0, 'rgba(60,15,12,0.85)'); g.addColorStop(0.3, 'rgba(70,20,16,0.65)'); g.addColorStop(0.6, 'rgba(50,16,12,0.45)'); g.addColorStop(0.85, 'rgba(40,14,10,0.2)'); g.addColorStop(1, 'rgba(30,10,8,0)'); cx.fillStyle = g; cx.beginPath(); cx.moveTo(cw * 0.3, ch * 0.15); cx.quadraticCurveTo(cw * 0.7, ch * 0.05, cw * 0.8, ch * 0.3); cx.quadraticCurveTo(cw * 0.9, ch * 0.6, cw * 0.7, ch * 0.8); cx.quadraticCurveTo(cw * 0.5, ch * 0.95, cw * 0.25, ch * 0.75); cx.quadraticCurveTo(cw * 0.1, ch * 0.5, cw * 0.15, ch * 0.3); cx.quadraticCurveTo(cw * 0.2, ch * 0.1, cw * 0.3, ch * 0.15); cx.closePath(); cx.fill(); });
var puddle = mesh(new THREE.PlaneGeometry(1.6, 1.4), new THREE.MeshStandardMaterial({ map: puddleTex, transparent: true, roughness: 0.3, metalness: 0.2, envMap: k.roomEnv, envMapIntensity: 0.5 }), -0.6, 0.006, 2.2); puddle.rotation.x = -Math.PI / 2;
// the bulb in the puddle: a smear of it on the standing water
var reflTex = tex(64, 96, function(cx, w, h) { var g = cx.createRadialGradient(w / 2, h * 0.42, 0, w / 2, h * 0.42, w * 0.5); g.addColorStop(0, 'rgba(232,214,180,0.85)'); g.addColorStop(0.35, 'rgba(210,190,150,0.35)'); g.addColorStop(1, 'rgba(180,160,120,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); var tail = cx.createLinearGradient(0, h * 0.4, 0, h); tail.addColorStop(0, 'rgba(210,190,150,0.28)'); tail.addColorStop(1, 'rgba(180,160,120,0)'); cx.fillStyle = tail; cx.fillRect(w * 0.36, h * 0.4, w * 0.28, h * 0.6); });
var water = mesh(new THREE.PlaneGeometry(1.15, 1.0), M.hidden, -0.6, 0.009, 2.2); water.rotation.x = -Math.PI / 2;
k.makeMirror(water, new THREE.Vector3(0, 1, 0), 256, new THREE.Vector3(0.72, 0.44, 0.38), { transparent: true, ripple: true, edge: '0.9' });
// the standing water gives the bulb back, and Copper, and the joists; the painted smear stays for the drip to brighten
var refl = mesh(new THREE.PlaneGeometry(0.34, 0.62), new THREE.MeshBasicMaterial({ map: reflTex, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), -0.46, 0.012, 2.0); refl.rotation.x = -Math.PI / 2;
// a drip from the ceiling into it, now and then
/* 2026-10-31 (Sam: "the ceiling used to drip, could you add that again?"): the old bead was 12 mm and drifted down over two seconds, so
   nobody saw it. Now a drop swells on the ceiling, falls under gravity, rings the puddle and lifts the bulb's smear, and is heard landing.
   (The cellar's own ambient drips, TAG_TICKS 'venue-cellar', still fall elsewhere in the dark.) */
var DRIP_TOP = H - 0.02, DRIP_X = -0.46, DRIP_Z = 2.0;
var drip = mesh(new THREE.SphereGeometry(0.016, 12, 10), new THREE.MeshStandardMaterial({ color: 0xd8e0e8, roughness: 0.04, metalness: 0.3, envMap: k.roomEnv, envMapIntensity: 1.6, emissive: 0x262a2e, transparent: true, opacity: 0.9 }), DRIP_X, DRIP_TOP, DRIP_Z);
var wetSpot = mesh(new THREE.CircleGeometry(0.09, 20), new THREE.MeshStandardMaterial({ color: 0x1e1a14, roughness: 0.2, transparent: true, opacity: 0.55, envMap: k.roomEnv, envMapIntensity: 0.6 }), DRIP_X, H - 0.002, DRIP_Z); wetSpot.rotation.x = Math.PI / 2; /* the damp patch it gathers on */
var ringMat = new THREE.MeshBasicMaterial({ color: 0xd8d0b8, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
var ripples = [0, 0.22].map(function(lag) { var r = mesh(new THREE.RingGeometry(0.85, 1, 40), ringMat.clone(), DRIP_X, 0.014, DRIP_Z); r.rotation.x = -Math.PI / 2; r.scale.setScalar(0.01); return { m: r, lag: lag }; });
var dripS = { phase: 'wait', t: 0, next: 1.5 + Math.random() * 2, hitAt: -9 };
window._dssCellarDrip = dripS; /* debug: set .phase = 'fall', .t = 0 to drop one now */
k.contact(-0.85, 0, 2.3, 1.1); k.contact(W / 2 - 0.55, 0, 0.2, 2.2);
// ---------- THE ARK, against the left wall near you, between the barrel and the cellar's near end ----------
// (moved 2026-10-31, Sam: "the opposite wall and nearer the camera ... more worn and fitting with the lighting of the cellar":
// no glow of its own, little shine from the room's sky, tarnished and grimy gold, dust on the lid; the bulb lights it)
// 2026-10-31 (Sam: "put it in Copper's gangster's lair, against the wall"; built from the render he downloaded): a gold chest
// on four ball feet, pillar corners ringed top and bottom, a lattice skin, framed panels, a bevelled lid, two cherubim kneeling
// face to face with their wings swept up over the mercy seat, and the two carrying poles through rings at the corners.
// Built along x with its front to +z, then turned to face into the room.
var arkG = new THREE.Group(); arkG.position.set(-W / 2 + 0.45, 0, 1.65); arkG.rotation.y = Math.PI / 2; scene.add(arkG);
function tarnish(cx, w, h, seed) { /* grime in the hollows, green-black tarnish blooms, rub-marks where hands have been, scratches */
for (var i = 0; i < 26; i++) { var x = rnd(seed + i * 3) * w, y = rnd(seed + i * 5) * h, r = 10 + rnd(seed + i * 7) * 46, g = cx.createRadialGradient(x, y, 0, x, y, r);
g.addColorStop(0, i % 3 ? 'rgba(34,26,12,0.55)' : 'rgba(30,38,22,0.5)'); g.addColorStop(1, 'rgba(30,24,12,0)'); cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); }
for (var i = 0; i < 7; i++) { var x = rnd(seed + i * 11) * w, y = rnd(seed + i * 13) * h, r = 8 + rnd(seed + i * 17) * 22, g = cx.createRadialGradient(x, y, 0, x, y, r);
g.addColorStop(0, 'rgba(236,196,110,0.32)'); g.addColorStop(1, 'rgba(236,196,110,0)'); cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); }
cx.lineWidth = 0.6; for (var i = 0; i < 40; i++) { var x = rnd(seed + i * 19) * w, y = rnd(seed + i * 23) * h, a = rnd(seed + i * 29) * Math.PI, l = 6 + rnd(seed + i * 31) * 30;
cx.strokeStyle = i % 2 ? 'rgba(230,200,130,0.28)' : 'rgba(20,14,6,0.35)'; cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); cx.stroke(); }
for (var i = 0; i < 500; i++) { cx.fillStyle = 'rgba(24,16,6,' + (rnd(seed + i * 37) * 0.25).toFixed(2) + ')'; cx.fillRect(rnd(seed + i * 41) * w, rnd(seed + i * 43) * h, 1 + rnd(i) * 2, 1 + rnd(i * 2) * 2); }
}
var latTex = tex(256, 256, function(cx, w, h) {
cx.fillStyle = '#8a6526'; cx.fillRect(0, 0, w, h);
cx.lineWidth = 1.4; for (var d = -h; d < w + h; d += 9) { cx.strokeStyle = 'rgba(214,172,92,0.4)'; cx.beginPath(); cx.moveTo(d, 0); cx.lineTo(d + h, h); cx.stroke(); cx.strokeStyle = 'rgba(40,26,8,0.6)'; cx.beginPath(); cx.moveTo(d + h, 0); cx.lineTo(d, h); cx.stroke(); }
tarnish(cx, w, h, 3);
});
latTex.wrapS = latTex.wrapT = THREE.RepeatWrapping; latTex.repeat.set(3, 2);
var plainTex = tex(256, 256, function(cx, w, h) { cx.fillStyle = '#9a7230'; cx.fillRect(0, 0, w, h); tarnish(cx, w, h, 9); });
plainTex.wrapS = plainTex.wrapT = THREE.RepeatWrapping;
var arkGold = new THREE.MeshStandardMaterial({ map: latTex, bumpMap: latTex, bumpScale: 0.005, roughnessMap: latTex, color: 0xf2d9a0, roughness: 0.55, metalness: 0.5, envMap: k.roomEnv, envMapIntensity: 0.7 });
var arkPlain = new THREE.MeshStandardMaterial({ map: plainTex, bumpMap: plainTex, bumpScale: 0.003, color: 0xf2d9a0, roughness: 0.45, metalness: 0.55, envMap: k.roomEnv, envMapIntensity: 0.75 });
var AL = 1.15, AD = 0.68, AH = 0.6, AY = 0.1; /* the chest: length, depth, height, lifted on its feet */
var body = mesh(new THREE.BoxGeometry(AL, AH, AD), arkGold, 0, AY + AH / 2, 0, arkG); body.castShadow = true; body.receiveShadow = true;
[[1, 0.012, AL - 0.24, AH - 0.16], [-1, 0.012, AL - 0.24, AH - 0.16]].forEach(function(f) { /* raised frames round the front and back panels */
var z = f[0] * (AD / 2 + 0.006), fw = f[2], fh = f[3], cy = AY + AH / 2;
mesh(new THREE.BoxGeometry(fw, 0.022, 0.014), arkPlain, 0, cy + fh / 2, z, arkG); mesh(new THREE.BoxGeometry(fw, 0.022, 0.014), arkPlain, 0, cy - fh / 2, z, arkG);
mesh(new THREE.BoxGeometry(0.022, fh, 0.014), arkPlain, -fw / 2, cy, z, arkG); mesh(new THREE.BoxGeometry(0.022, fh, 0.014), arkPlain, fw / 2, cy, z, arkG);
});
[-1, 1].forEach(function(s) { var x = s * (AL / 2 + 0.006), fd = AD - 0.2, fh = AH - 0.16, cy = AY + AH / 2; /* and the ends */
mesh(new THREE.BoxGeometry(0.014, 0.022, fd), arkPlain, x, cy + fh / 2, 0, arkG); mesh(new THREE.BoxGeometry(0.014, 0.022, fd), arkPlain, x, cy - fh / 2, 0, arkG);
mesh(new THREE.BoxGeometry(0.014, fh, 0.022), arkPlain, x, cy, fd / 2, arkG); mesh(new THREE.BoxGeometry(0.014, fh, 0.022), arkPlain, x, cy, -fd / 2, arkG);
});
[[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function(c) { /* the corner pillars, their rings, the ball feet, the pole rings */
var x = c[0] * AL / 2, z = c[1] * AD / 2;
var col = mesh(new THREE.CylinderGeometry(0.045, 0.045, AH, 16), arkPlain, x, AY + AH / 2, z, arkG); col.castShadow = true;
[AY + 0.03, AY + 0.06, AY + AH - 0.06, AY + AH - 0.03].forEach(function(y) { var r = mesh(new THREE.TorusGeometry(0.05, 0.008, 6, 18), arkPlain, x, y, z, arkG); r.rotation.x = Math.PI / 2; });
detail.lathe([[0, 0], [0.04, 0.005], [0.055, 0.035], [0.05, 0.07], [0.035, 0.09], [0.045, AY], [0, AY]], arkPlain, x, 0, z, arkG, 18);
var ring = mesh(new THREE.TorusGeometry(0.04, 0.009, 8, 18), arkPlain, x + (c[0] < 0 ? 0.11 : -0.11), AY + 0.22, z + c[1] * 0.06, arkG); /* rings stand off the long sides for the poles */
});
var lid = mesh(new THREE.BoxGeometry(AL + 0.06, 0.035, AD + 0.06), arkGold, 0, AY + AH + 0.018, 0, arkG); lid.castShadow = true;
mesh(new THREE.BoxGeometry(AL + 0.02, 0.03, AD + 0.02), arkPlain, 0, AY + AH + 0.05, 0, arkG); /* the mercy seat's bevel */
mesh(new THREE.BoxGeometry(AL - 0.04, 0.012, AD - 0.04), arkGold, 0, AY + AH + 0.07, 0, arkG);
var dustTex = tex(256, 160, function(cx, w, h) { cx.clearRect(0, 0, w, h); /* cellar dust settled on the lid, thinner at the edges, a hand-wipe through it */
var g = cx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.6); g.addColorStop(0, 'rgba(120,110,92,0.55)'); g.addColorStop(1, 'rgba(120,110,92,0.12)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 900; i++) { cx.fillStyle = 'rgba(140,128,104,' + (rnd(i * 47) * 0.4).toFixed(2) + ')'; cx.fillRect(rnd(i * 53) * w, rnd(i * 59) * h, 1, 1); }
cx.globalCompositeOperation = 'destination-out'; cx.lineCap = 'round'; cx.lineWidth = 16; cx.strokeStyle = 'rgba(0,0,0,0.75)'; cx.beginPath(); cx.moveTo(w * 0.62, h * 0.12); cx.quadraticCurveTo(w * 0.7, h * 0.5, w * 0.58, h * 0.9); cx.stroke(); cx.globalCompositeOperation = 'source-over'; });
var dust = mesh(new THREE.PlaneGeometry(AL - 0.04, AD - 0.04), new THREE.MeshStandardMaterial({ map: dustTex, transparent: true, roughness: 1, depthWrite: false }), 0, AY + AH + 0.0765, 0, arkG); dust.rotation.x = -Math.PI / 2;
[-1, 1].forEach(function(s) { /* the carrying poles, ball-ended */
var z = s * (AD / 2 + 0.06), y = AY + 0.22, pl = 1.95;
var pole = mesh(new THREE.CylinderGeometry(0.022, 0.022, pl, 12), arkPlain, 0, y, z, arkG); pole.rotation.z = Math.PI / 2; pole.castShadow = true;
[-1, 1].forEach(function(e) { mesh(new THREE.SphereGeometry(0.036, 14, 10), arkPlain, e * pl / 2, y, z, arkG); var cl = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 12), arkPlain, e * (pl / 2 - 0.05), y, z, arkG); cl.rotation.z = Math.PI / 2; });
});
var wingShape = new THREE.Shape(); /* one wing, root at the origin, reaching along +x and up; the trailing edge feathered */
wingShape.moveTo(0, 0); wingShape.bezierCurveTo(0.06, 0.16, 0.2, 0.25, 0.34, 0.22);
var fe = [[0.34, 0.22], [0.29, 0.15], [0.26, 0.18], [0.21, 0.1], [0.18, 0.14], [0.13, 0.05], [0.1, 0.09], [0.06, 0.0]];
for (var fi = 1; fi < fe.length; fi++) wingShape.quadraticCurveTo((fe[fi - 1][0] + fe[fi][0]) / 2 - 0.012, (fe[fi - 1][1] + fe[fi][1]) / 2 - 0.02, fe[fi][0], fe[fi][1]);
wingShape.lineTo(0, 0);
var wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 1, curveSegments: 10 });
var wingMat = arkPlain.clone(); wingMat.side = THREE.DoubleSide;
[-1, 1].forEach(function(s) { /* a cherub at each end, kneeling, facing the other */
var cg = detail.group(s * (AL / 2 - 0.2), AY + AH + 0.076, 0, arkG); cg.scale.x = -s; /* built facing +x; the right-hand one mirrored */
detail.lathe([[0, 0], [0.07, 0], [0.075, 0.03], [0.055, 0.1], [0.045, 0.15], [0.03, 0.17], [0, 0.17]], arkPlain, 0, 0, 0, cg, 16); /* robed body */
var hd = mesh(new THREE.SphereGeometry(0.033, 14, 10), arkPlain, 0.03, 0.2, 0, cg); hd.scale.set(1, 1.1, 0.9); /* head bowed toward the seat */
var arm = mesh(new THREE.CylinderGeometry(0.014, 0.012, 0.09, 8), arkPlain, 0.05, 0.12, 0, cg); arm.rotation.z = -1.1;
[-1, 1].forEach(function(side) { var w = mesh(wingGeo, wingMat, 0.0, 0.14, side * 0.045, cg); w.rotation.x = side * 0.32; w.rotation.y = side * -0.12; w.position.z -= 0.006; w.castShadow = true; });
});
k.contact(-W / 2 + 0.45, 0, 1.65, 1.6);
// ---------- THE RAT (2026-10-31, Sam: "add it to this room", on a path that stays in view) ----------
// The approach scene's rat, its model copied as it is. Here it runs between five cover places: under the sofa, behind the crates,
// under the ark, behind the safe, and the long way round behind the table back up the right wall. Each run starts where the last
// ended; between runs it is out of sight under whatever it ran to. Every route runs both ways.
var ratMat = new THREE.MeshStandardMaterial({ color: 0x302b29, roughness: 0.95 });
var ratG = new THREE.Group();ratG.name="dss-room-rat";
ratG.visible = false;
scene.add(ratG);
function ratPart(geo, x, y, z, sx, sy, sz) {
var m = new THREE.Mesh(geo, ratMat);
m.position.set(x, y, z); m.scale.set(sx||1, sy||1, sz||1);
ratG.add(m); return m;
}
ratPart(new THREE.SphereGeometry(.075,20,14),0,.062,0,.78,.68,1.48);
[-1,1].forEach(function(side){ratPart(new THREE.SphereGeometry(.048,16,12),side*.035,.045,-.058,.75,.85,1);});
var ratHead=new THREE.Group();ratHead.position.set(0,.053,.109);ratG.add(ratHead);
var ratSkull=new THREE.Mesh(new THREE.SphereGeometry(.042,18,12),ratMat);ratSkull.scale.set(.79,.76,1.15);ratHead.add(ratSkull);
var ratSnout=new THREE.Mesh(new THREE.SphereGeometry(.027,16,10),ratMat);ratSnout.position.set(0,-.009,.045);ratSnout.scale.set(.64,.56,1.4);ratHead.add(ratSnout);
var ratSkin=new THREE.MeshStandardMaterial({color:0x765d54,roughness:.88});
var ratNose=new THREE.Mesh(new THREE.SphereGeometry(.008,12,8),ratSkin);ratNose.position.set(0,-.008,.082);ratHead.add(ratNose);
[-1,1].forEach(function(side){
 var ear=new THREE.Mesh(new THREE.SphereGeometry(.019,14,10),ratMat);ear.position.set(side*.028,.028,-.008);ear.scale.set(1,1,.32);ratHead.add(ear);
 var inner=new THREE.Mesh(new THREE.SphereGeometry(.014,12,8),ratSkin);inner.position.set(side*.028,.028,-.001);inner.scale.set(1,1,.16);ratHead.add(inner);
 var eye=new THREE.Mesh(new THREE.SphereGeometry(.005,12,8),new THREE.MeshStandardMaterial({color:0x090a08,roughness:.22}));eye.position.set(side*.029,.005,.025);ratHead.add(eye);
 var lines=[];for(var wh=0;wh<3;wh++){lines.push(new THREE.Vector3(side*.015,-.01,.061),new THREE.Vector3(side*(.056+wh*.005),-.008+(wh-1)*.009,.068));}ratHead.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lines),new THREE.LineBasicMaterial({color:0x8d8975,transparent:true,opacity:.45})));
});
var ratFeet=[];
[-1,1].forEach(function(side){[false,true].forEach(function(rear){var foot=new THREE.Group();foot.position.set(side*.043,.032,rear?-.071:.067);var ankle=new THREE.Mesh(new THREE.SphereGeometry(.015,12,8),ratMat);ankle.scale.set(.7,1.2,.8);foot.add(ankle);var paw=new THREE.Mesh(new THREE.SphereGeometry(.013,12,8),ratSkin);paw.position.set(0,-.019,.009);paw.scale.set(.8,.35,1.4);foot.add(paw);ratG.add(foot);ratFeet.push(foot);});});
var ratTail=[],ratTailVecA=new THREE.Vector3(),ratTailVecB=new THREE.Vector3(),ratTailAxis=new THREE.Vector3(0,1,0);
for(var rti0=0;rti0<12;rti0++){var rtSeg=new THREE.Mesh(new THREE.CylinderGeometry(Math.max(.001,.009-rti0*.00065),Math.max(.001,.0096-rti0*.00065),1,7),ratSkin);ratG.add(rtSeg);ratTail.push(rtSeg);}
var RAT_ROUTES = [
{ a: 'sofa', b: 'crates', pts: [[2.15, 0.4], [1.2, 0.85], [0.1, 0.35], [-1.0, -0.45], [-2.0, -0.95]] },
{ a: 'sofa', b: 'ark', pts: [[2.1, 0.95], [1.1, 1.2], [0.0, 1.05], [-0.7, 1.15], [-1.6, 1.0], [-2.45, 1.3]] },
{ a: 'crates', b: 'safe', pts: [[-2.0, -1.1], [-1.65, -2.4], [-2.0, -3.15], [-2.6, -3.35]] },
{ a: 'safe', b: 'sofa', pts: [[-2.6, -3.35], [-1.6, -4.3], [0.9, -4.6], [2.78, -4.0], [2.82, -1.8], [2.5, -0.55]] },
{ a: 'ark', b: 'crates', pts: [[-2.45, 1.0], [-1.75, 0.55], [-1.7, -0.2], [-2.0, -0.85]] }
];
ratG.visible = false;
var ratState = { phase: 'wait', tNext: 2.5, at: 'sofa', pts: null, cum: null, total: 0, traveled: 0, pauseAts: [], pauseUntil: 0 }; window._dssCellarRat = ratState; /* debug: set .tNext = 0 to send it now */
// ---------- THE CLOSE-UPS ----------
var SZ = -D / 2 + 2.4;
var hotspots = [
{ root: copper.hit, name: 'COPPER', pos: [-0.1, 1.55, 3.5], tgt: [-0.85, 0.75, 2.3], haloAt: [-0.85, 1.3, 2.3], haloSc: 0.9,
actions: function() { return k.byText(['Say nothing', "Give him Red’s name", "Give him John’s name"]); } },
{ root: ashton.hit, name: 'ASHTON GRANGER', pos: [-0.9, 1.4, SZ + 2.2], tgt: [-0.45, 0.55, SZ + 0.55], haloAt: [-0.45, 1.05, SZ + 0.55], haloSc: 0.8,
actions: function() { return k.byText(['Look at ASHTON']); } },
{ root: frankie.hit, name: 'QUIET FRANKIE', pos: [1.0, 1.45, SZ + 2.0], tgt: [0.45, 0.6, SZ - 0.55], haloAt: [0.45, 1.2, SZ - 0.55], haloSc: 1.0 },
{ root: bulbHit, name: 'A bulb', pos: [0.3, 1.7, 2.0], tgt: [0, H - 1.1, 0.6], haloAt: [0, H - 1.1, 0.6], haloSc: 0.6 },
{ root: stairHit, name: 'Stairs', pos: [-0.6, 1.5, 0.4], tgt: [-W / 2 + 0.7, 1.8, -2.0], haloAt: [-W / 2 + 0.7, 1.9, -2.0], haloSc: 1.4 },
{ root: sofaG, name: 'A chesterfield', pos: [1.2, 1.3, 1.6], tgt: [W / 2 - 0.55, 0.6, 0.2], haloAt: [W / 2 - 0.7, 0.75, 0.2], haloSc: 1.3 }
];
return { hotspots: hotspots, frame: function(t, dt, still) {
if (still) return;
var sw = Math.sin(t * 0.6) * 0.06; bulbG.rotation.z = sw; bulbG.rotation.x = Math.cos(t * 0.45) * 0.03;
bulbLight.intensity = 1.35 + 0.08 * Math.sin(t * 9.3) + 0.07 * Math.sin(t * 2.1) + (Math.sin(t * 0.37) > 0.992 ? -0.35 : 0); bulbGlow.material.opacity = 0.55 + 0.03 * Math.sin(t * 9.3);
tableLight.intensity = 0.9 + 0.04 * Math.sin(t * 1.7);
for (var i = 0; i < haze.length; i++) { var h = haze[i]; h.position.x += Math.sin(t * h.userData.sp + h.userData.ph) * 0.0015; h.material.opacity = h.userData.base * (0.8 + 0.2 * Math.sin(t * 0.3 + h.userData.ph)); }
var mp = moteGeo.attributes.position.array; for (var mi2 = 0; mi2 < MOTES; mi2++) { var ms = moteSeed[mi2]; mp[mi2 * 3 + 1] += ms[1] * dt * Math.sin(t * 0.3 + ms[0]) - 0.006 * dt; mp[mi2 * 3] += Math.sin(t * ms[2] + ms[0]) * 0.0006; if (mp[mi2 * 3 + 1] < 0.2) mp[mi2 * 3 + 1] = 1.65; } moteGeo.attributes.position.needsUpdate = true; motes.material.opacity = 0.4 + 0.15 * Math.sin(t * 0.8);
/* the rat: wait under cover, run a route out of whatever it is under to the next cover (one or two sniffs on the way), gone again */
var rdt = Math.min(dt, 0.05), rs = ratState;
if (rs.phase === 'wait') { if (t > rs.tNext) {
var opts = RAT_ROUTES.filter(function(r) { return r.a === rs.at || r.b === rs.at; }), pick = opts[Math.floor(Math.random() * opts.length)];
rs.pts = pick.a === rs.at ? pick.pts : pick.pts.slice().reverse(); rs.at = pick.a === rs.at ? pick.b : pick.a;
rs.cum = [0]; for (var rci = 1; rci < rs.pts.length; rci++) { var rdx = rs.pts[rci][0] - rs.pts[rci - 1][0], rdz = rs.pts[rci][1] - rs.pts[rci - 1][1]; rs.cum.push(rs.cum[rci - 1] + Math.sqrt(rdx * rdx + rdz * rdz)); }
rs.total = rs.cum[rs.cum.length - 1]; rs.traveled = 0;
rs.pauseAts = Math.random() < 0.65 ? [rs.total * (0.2 + Math.random() * 0.3), rs.total * (0.55 + Math.random() * 0.3)] : [rs.total * (0.25 + Math.random() * 0.5)];
rs.phase = 'run'; ratG.visible = true; } }
else if (rs.phase === 'run') { rs.traveled += 2.3 * rdt;
if (rs.traveled >= rs.total) { rs.phase = 'wait'; rs.tNext = t + 5 + Math.random() * 8; ratG.visible = false; }
else if (rs.pauseAts.length && rs.traveled >= rs.pauseAts[0]) { rs.pauseAts.shift(); rs.phase = 'pause'; rs.pauseUntil = t + 0.45 + Math.random() * 0.7; } }
else if (rs.phase === 'pause') { if (t > rs.pauseUntil) rs.phase = 'run'; }
if (ratG.visible) { var ratRunning = rs.phase === 'run', rSeg = 1;
while (rSeg < rs.cum.length - 1 && rs.cum[rSeg] < rs.traveled) rSeg++;
var rSegLen = rs.cum[rSeg] - rs.cum[rSeg - 1], rFrac = rSegLen > 0 ? Math.min((rs.traveled - rs.cum[rSeg - 1]) / rSegLen, 1) : 1;
var rA = rs.pts[rSeg - 1], rB = rs.pts[rSeg];
ratG.position.set(rA[0] + (rB[0] - rA[0]) * rFrac, 0.012 + (ratRunning ? Math.abs(Math.sin(rs.traveled * 22)) * 0.004 : 0), rA[1] + (rB[1] - rA[1]) * rFrac);
ratG.rotation.y = Math.atan2(rB[0] - rA[0], rB[1] - rA[1]) + (ratRunning ? Math.sin(rs.traveled * 3) * 0.05 : 0);
ratHead.rotation.x = ratRunning ? 0.035 : (-0.13 + Math.sin(t * 7) * 0.025);
ratFeet.forEach(function(foot, i) { foot.rotation.x = ratRunning ? Math.sin(rs.traveled * 28 + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.3 : 0; });
var tw = ratRunning ? 5 : 1.4; for (var rtj = 0; rtj < ratTail.length; rtj++) { var f = rtj / ratTail.length, nf = (rtj + 1) / ratTail.length;
ratTailVecA.set(Math.sin(t * tw - f * 3) * 0.026 * f, 0.025 - f * 0.016, -0.10 - f * 0.25); ratTailVecB.set(Math.sin(t * tw - nf * 3) * 0.026 * nf, 0.025 - nf * 0.016, -0.10 - nf * 0.25);
var seg = ratTail[rtj]; seg.position.copy(ratTailVecA).add(ratTailVecB).multiplyScalar(0.5); seg.scale.y = ratTailVecB.sub(ratTailVecA).length(); seg.quaternion.setFromUnitVectors(ratTailAxis, ratTailVecB.normalize()); } }
dripS.t += dt; /* wait, swell on the ceiling, fall (g), land */
if (dripS.phase === 'wait') { drip.visible = false; if (dripS.t > dripS.next) { dripS.phase = 'swell'; dripS.t = 0; } }
else if (dripS.phase === 'swell') { var sw2 = Math.min(1, dripS.t / 1.4); drip.visible = true; drip.position.y = DRIP_TOP - 0.012 * sw2; drip.scale.set(0.4 + 0.6 * sw2, (0.4 + 0.6 * sw2) * (1 + 0.5 * sw2), 0.4 + 0.6 * sw2); if (dripS.t > 1.4 + Math.random() * 0.3) { dripS.phase = 'fall'; dripS.t = 0; } }
else if (dripS.phase === 'fall') { var fy = DRIP_TOP - 0.012 - 4.9 * dripS.t * dripS.t; drip.scale.set(0.85, 1.6, 0.85); drip.position.y = fy;
if (fy <= 0.02) { drip.visible = false; dripS.phase = 'wait'; dripS.t = 0; dripS.next = 4 + Math.random() * 5; dripS.hitAt = t; try { if (window.dssAudio && window.dssAudio.dripDrop) window.dssAudio.dripDrop(); } catch (e) {} } }
var since = t - dripS.hitAt;
ripples.forEach(function(r) { var a = since - r.lag; if (a < 0 || a > 1.1) { r.m.material.opacity = 0; return; } r.m.scale.setScalar(0.03 + a * 0.4); r.m.material.opacity = 0.42 * (1 - a / 1.1); });
refl.material.opacity = 0.1 + (since < 0.5 ? 0.14 * (1 - since / 0.5) : 0) + 0.02 * Math.sin(t * 9.3);
} };
}
};
window.dssRoomKit(window.dssCellarSpec);
window.dssRoomKit(Object.assign({}, window.dssCellarSpec, { id: 'cx', build: function(k) {
var room = window.dssCellarSpec.build(k);
var btn = document.createElement('div'); btn.className = 'dss-cellar-announce'; btn.textContent = "ANNOUNCE YOURSELF IN COPPER'S LAIR";
btn.style.cssText = 'position:absolute;bottom:118px;left:50%;transform:translateX(-50%);padding:14px min(36px, 8vw);white-space:nowrap;max-width:calc(100vw - 16px);box-sizing:border-box;font:16px "Courier New",monospace;color:rgba(180,170,150,0.85);border:1px solid rgba(180,170,150,0.3);letter-spacing:min(4px, 0.9vw);cursor:pointer;z-index:9004;background:rgba(6,6,8,0.35);opacity:0;transition:opacity 2s ease, color 0.3s, border-color 0.3s;';
btn.addEventListener('mouseenter', function() { btn.style.color = 'rgba(210,200,170,0.95)'; btn.style.borderColor = 'rgba(180,170,150,0.6)'; });
btn.addEventListener('mouseleave', function() { btn.style.color = 'rgba(180,170,150,0.85)'; btn.style.borderColor = 'rgba(180,170,150,0.3)'; });
btn.addEventListener('click', function() { var l = k.byText(['·'])[0] || Array.prototype.filter.call(document.querySelectorAll('tw-link'), function(a) { return a.textContent.trim() === '·'; })[0]; if (l) l.click(); });
k.wrap.appendChild(btn); setTimeout(function() { btn.style.opacity = '1'; }, 2500);
/* nothing to look closer at from the door: the room's hint goes, and the strip keeps only ← Back (the button is the way in) */
var tidyN = 0, tidy = setInterval(function() { Array.prototype.forEach.call(k.wrap.querySelectorAll('div, button'), function(e) { var t = e.textContent.trim(); if ((e.classList.contains('dss-room-strip-btn') && t === '\u00b7') || (!e.children.length && t === 'LOOK CLOSER AT WHAT CATCHES YOUR EYE')) e.style.display = 'none'; }); if (++tidyN > 25) clearInterval(tidy); }, 200);
return { hotspots: [], frame: room.frame };
} }));
// <<<< DSS ROOM CU END

// >>>> DSS ROOM CB BEGIN
