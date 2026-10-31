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

// ====== INSIDE THE PILLARS — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-26. The third "look closer" room. Built from what is written of
// the Pillars of Hercules at 7 Greek Street (wooden fittings, bentwood
// stools, elbow-height tables against the wall, a copper bar top, dark
// walls, a stained-glass panel in the ceiling, and the classical columns
// that divide the bar) crossed with the passage's own Piranesi ruins.
// The room sits at the top of Entering The Pillars of Hercules
// (#pi-container) and is its navigation: the bar opens the drink, the man
// through the fumes opens the Great Ham, the third pillar opens the
// crossing or the synthesis, the threshold the lily (the walk on water was cut 2026-10-09), each
// only when the passage has rendered that link. The lattice window, the
// glass overhead and the telephone are inspections, their card words pink
// placeholders for Sam. Nothing about the game is decided in JS.
(function() {
var piActive = false;
var piAnimId = null;

function initPillarsInside() {
if (piActive) return;
piActive = true;
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(buildPIScene) : buildPIScene()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(buildPIScene) : buildPIScene());
}
}

function buildPIScene() {
var piStill = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var piHost = document.getElementById('pi-container');
if (!piHost) { piActive = false; return; }
var piWrap = document.createElement('div');
piWrap.id = 'pi-wrap';
function piSize() {
var w = Math.max(280, document.documentElement.clientWidth || window.innerWidth);
var vh = window.innerHeight || 800;
// the room fills the window below its top edge: the passage's words sit inside it now, nothing follows underneath
var top = 0, el = piHost; while (el) { top += el.offsetTop; el = el.offsetParent; }
// and the page's own padding under it, so the room ends where the page ends
var pad = 0; el = piHost; while (el && el !== document.body) { var cs = getComputedStyle(el); pad += (parseFloat(cs.paddingBottom) || 0) + (parseFloat(cs.marginBottom) || 0); el = el.parentNode; }
var h = Math.round(Math.max(360, vh - top - pad - 2));
return { w: w, h: h };
}
var piSz = piSize();
piWrap.style.cssText = 'position:relative;width:100vw;margin-left:calc(50% - 50vw);height:' + piSz.h + 'px;z-index:0;isolation:isolate;background:#090705;overflow:hidden;';
var piCanvas = document.createElement('canvas');
piCanvas.width = piSz.w; piCanvas.height = piSz.h;
piCanvas.style.cssText = 'display:block;position:absolute;top:0;left:0;width:100%;height:100%;touch-action:none;';
piWrap.appendChild(piCanvas);
var piWash = document.createElement('div');
piWash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9000;background:linear-gradient(180deg,rgba(10,18,6,0.3) 0%,rgba(6,10,4,0.05) 35%,rgba(6,10,4,0.05) 60%,rgba(3,5,2,0.45) 100%);';
piWrap.appendChild(piWash);
var piVig = document.createElement('div');
piVig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:radial-gradient(ellipse at 50% 44%,transparent 24%,rgba(0,0,0,0.74) 100%);';
piWrap.appendChild(piVig);
var piGrain = document.createElement('div');
piGrain.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9002;opacity:0.06;mix-blend-mode:overlay;background:url(' + (window.dssGetGrainURL ? window.dssGetGrainURL() : '') + ');';
piWrap.appendChild(piGrain);
var piLoc = document.createElement('div');
piLoc.classList.add('dss-room-caption');
piLoc.textContent = 'THE PILLARS OF HERCULES, GREEK STREET';
piLoc.style.cssText = 'position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font:12px \'Courier New\',monospace;color:rgba(190,200,140,0.25);letter-spacing:3px;white-space:nowrap;z-index:9003;pointer-events:none;';
piWrap.appendChild(piLoc);
piHost.appendChild(piWrap);
piSz = piSize(); piWrap.style.height = piSz.h + 'px';
// once the passage has settled (its fade-in moves it), size the room again
setTimeout(function() { var r = window._dssThreeRegistry && window._dssThreeRegistry['pi-wrap']; if (r && r.resize) r.resize(); }, 1600);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x090705);
scene.fog = new THREE.FogExp2(0x14100a, 0.06);
var aspect = piSz.w / piSz.h;
var portrait = aspect < 1.4;
var camera = new THREE.PerspectiveCamera(portrait ? 80 : 54, aspect, 0.05, 40);
// from just inside the door at the front left, looking across the room to the bar and the piano
var CAM = portrait ? { x: -0.7, y: 1.5, z: 3.5, tx: 0.1, ty: 1.55, tz: -1.7 } : { x: -0.9, y: 1.5, z: 3.1, tx: 0.15, ty: 1.72, tz: -1.7 };
camera.position.set(CAM.x, CAM.y, CAM.z);

var renderer = new THREE.WebGLRenderer({ canvas: piCanvas, antialias: true });
renderer.setSize(piSz.w, piSz.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, piSz.w < 600 ? 1.25 : 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.68;
window._dssBindScene('pi-wrap', scene, renderer, camera);
var origResize = window._dssThreeRegistry['pi-wrap'].resize;
window._dssThreeRegistry['pi-wrap'].resize = function() {
piSz = piSize(); piWrap.style.height = piSz.h + 'px';
camera.aspect = piSz.w / piSz.h;
camera.fov = camera.aspect < 1.4 ? 80 : 54;
camera.updateProjectionMatrix();
renderer.setSize(piSz.w, piSz.h);
};
window.removeEventListener('resize', origResize);
window.addEventListener('resize', window._dssThreeRegistry['pi-wrap'].resize);
// The outside scenes' bloom and grade, at the room's own size.
var composer = window.dssMakeComposer ? window.dssMakeComposer(scene, camera, renderer, { bloomStrength: 0.32, bloomRadius: 0.55, bloomThreshold: 0.72 }) : null;
if (composer) { composer.setSize(piSz.w, piSz.h); var piResize = window._dssThreeRegistry['pi-wrap'].resize; window._dssThreeRegistry['pi-wrap'].resize = function() { piResize(); composer.setSize(piSz.w, piSz.h); }; window.removeEventListener('resize', piResize); window.addEventListener('resize', window._dssThreeRegistry['pi-wrap'].resize); }

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
// A small canvas-made room environment, darker and more copper than the French's: it is what the metal and the varnish reflect.
var envFaces = [];
for (var ef = 0; ef < 6; ef++) {
var ec = document.createElement('canvas'); ec.width = ec.height = 128;
var ex = ec.getContext('2d'), eg = ex.createLinearGradient(0, 0, 0, 128);
eg.addColorStop(0, ef === 2 ? '#5a4028' : '#3e2e1e'); eg.addColorStop(0.5, '#241a10'); eg.addColorStop(1, '#0a0705'); ex.fillStyle = eg; ex.fillRect(0, 0, 128, 128);
if (ef !== 3) {
for (var el = 0; el < 2; el++) {
var lx = 28 + el * 73, ly = ef === 2 ? 64 : 30;
var gl = ex.createRadialGradient(lx, ly, 0, lx, ly, 20); gl.addColorStop(0, '#ffe6b8'); gl.addColorStop(0.14, '#d9b070'); gl.addColorStop(0.4, '#8a5f2c'); gl.addColorStop(1, 'rgba(96,63,25,0)'); ex.fillStyle = gl; ex.fillRect(0, 0, 128, 128);
} ex.fillStyle = 'rgba(190,120,70,0.14)'; ex.fillRect(4, 84, 120, 10);
} envFaces.push(ec);
}
var roomEnv = new THREE.CubeTexture(envFaces); roomEnv.needsUpdate = true;
var grainA = woodTex('#3d2416', '#150905', 1), grainB = woodTex('#2a1810', '#0e0704', 2), grainC = woodTex('#4a2c1a', '#1a0c06', 3);
var oak = new THREE.MeshStandardMaterial({ map: grainA, bumpMap: grainA, bumpScale: 0.003, roughnessMap: grainA, roughness: 0.62, envMap: roomEnv, envMapIntensity: 0.4, metalness: 0.04 });
var darkWood = new THREE.MeshStandardMaterial({ map: grainB, bumpMap: grainB, bumpScale: 0.006, roughness: 0.58, envMap: roomEnv, envMapIntensity: 0.22 });
var shelfWood = new THREE.MeshStandardMaterial({ map: grainC, bumpMap: grainC, bumpScale: 0.002, roughnessMap: grainC, roughness: 0.5, envMap: roomEnv, envMapIntensity: 0.5, metalness: 0.06 });
var brass = new THREE.MeshStandardMaterial({ color: 0xb99a60, roughness: 0.3, metalness: 0.82, envMap: roomEnv, envMapIntensity: 0.72 });
// The copper top: hammered, worn to a penny's pink where the elbows go, greening at the edges.
var copperTex = tex(1024, 256, function(cx, w, h) {
cx.fillStyle = '#9c5a34'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 2600; i++) { var x = rnd(i * 3) * w, y = rnd(i * 5 + 1) * h, r = 3 + rnd(i) * 9; var g = cx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r); g.addColorStop(0, 'rgba(230,150,100,0.22)'); g.addColorStop(0.6, 'rgba(120,60,30,0.1)'); g.addColorStop(1, 'rgba(60,30,15,0.18)'); cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, r, 0, 6.3); cx.fill(); }
for (var n = 0; n < 9; n++) { var x = 60 + n * 105 + rnd(n) * 40, g2 = cx.createRadialGradient(x, h * 0.62, 0, x, h * 0.62, 70); g2.addColorStop(0, 'rgba(236,170,120,0.28)'); g2.addColorStop(1, 'rgba(236,170,120,0)'); cx.fillStyle = g2; cx.fillRect(0, 0, w, h); }
var vg = cx.createLinearGradient(0, 0, 0, h); vg.addColorStop(0, 'rgba(70,110,80,0.28)'); vg.addColorStop(0.12, 'rgba(70,110,80,0)'); vg.addColorStop(0.9, 'rgba(70,110,80,0)'); vg.addColorStop(1, 'rgba(70,110,80,0.22)'); cx.fillStyle = vg; cx.fillRect(0, 0, w, h);
for (var k = 0; k < 40; k++) { cx.strokeStyle = 'rgba(40,20,10,' + (0.08 + rnd(k) * 0.12) + ')'; cx.lineWidth = 0.7; cx.beginPath(); var x0 = rnd(k * 7) * w, y0 = rnd(k * 11) * h; cx.moveTo(x0, y0); cx.lineTo(x0 + 20 + rnd(k) * 90, y0 + (rnd(k + 2) - 0.5) * 6); cx.stroke(); }
for (var r2 = 0; r2 < 6; r2++) { cx.strokeStyle = 'rgba(30,15,8,0.16)'; cx.lineWidth = 2; cx.beginPath(); cx.arc(rnd(r2 * 13) * w, rnd(r2 * 17) * h, 9 + rnd(r2) * 5, 0, 6.3); cx.stroke(); }
});
window.dssInteriorSurface(copperTex, 'metal', 40);
copperTex.wrapS = THREE.RepeatWrapping;
var copper = new THREE.MeshStandardMaterial({ map: copperTex, bumpMap: copperTex, bumpScale: 0.004, roughnessMap: copperTex, roughness: 0.42, metalness: 0.88, envMap: roomEnv, envMapIntensity: 0.9 });
var copperPlain = new THREE.MeshStandardMaterial({ color: 0xa86238, roughness: 0.32, metalness: 0.88, envMap: roomEnv, envMapIntensity: 0.8 });
var wallGrain = paintTex('#3a2a20', 17);
var wallMat = new THREE.MeshStandardMaterial({ map: wallGrain, bumpMap: wallGrain, bumpScale: 0.012, roughness: 0.94 });
var ceilMat = new THREE.MeshStandardMaterial({ map: paintTex('#4a3a24', 25, 'rgba(200,150,60,0.12)'), roughness: 0.96 });
// Stone for the columns: a warm limestone with veins and chips, darkened by a century of smoke.
var stoneTex = tex(512, 1024, function(cx, w, h) {
cx.fillStyle = '#8f8472'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 4000; i++) { cx.fillStyle = 'rgba(' + (40 + rnd(i) * 70 | 0) + ',' + (35 + rnd(i + 1) * 55 | 0) + ',' + (25 + rnd(i + 2) * 40 | 0) + ',' + rnd(i + 3) * 0.3 + ')'; cx.fillRect(rnd(i + 4) * w, rnd(i + 5) * h, 1 + rnd(i + 6) * 5, 1 + rnd(i + 7) * 3); }
for (var v = 0; v < 14; v++) { cx.strokeStyle = 'rgba(70,60,45,' + (0.12 + rnd(v) * 0.2) + ')'; cx.lineWidth = 0.8 + rnd(v + 3) * 1.6; cx.beginPath(); var x = rnd(v * 5) * w, y = 0; cx.moveTo(x, y); for (var s = 0; s < 12; s++) { y += h / 12; x += (rnd(v * 9 + s) - 0.5) * 60; cx.lineTo(x, y); } cx.stroke(); }
for (var c = 0; c < 30; c++) { var x = rnd(c * 7) * w, y = rnd(c * 3) * h, r = 4 + rnd(c) * 14; var g = cx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(50,40,30,0.35)'); g.addColorStop(1, 'rgba(50,40,30,0)'); cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); }
var sg = cx.createLinearGradient(0, 0, 0, h); sg.addColorStop(0, 'rgba(20,12,6,0.42)'); sg.addColorStop(0.4, 'rgba(20,12,6,0.05)'); sg.addColorStop(1, 'rgba(60,40,20,0.3)'); cx.fillStyle = sg; cx.fillRect(0, 0, w, h);
});
window.dssInteriorSurface(stoneTex, 'stone', 39);
stoneTex.wrapS = THREE.RepeatWrapping;
var stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, bumpMap: stoneTex, bumpScale: 0.01, roughness: 0.88, envMap: roomEnv, envMapIntensity: 0.12 });
// Floorboards, each a shade its own, scuffed toward the bar; the flood lies on them at the door.
var boardTex = tex(1024, 1024, function(cx, w, h) {
for (var b = 0; b < 12; b++) {
var y0 = b * 86, tone = 0.75 + rnd(b * 3) * 0.5;
cx.fillStyle = 'rgb(' + (58 * tone | 0) + ',' + (36 * tone | 0) + ',' + (18 * tone | 0) + ')'; cx.fillRect(0, y0, w, 84);
for (var i = 0; i < 60; i++) { cx.strokeStyle = i % 4 ? 'rgba(20,10,4,' + (0.12 + rnd(i + b) * 0.2) + ')' : 'rgba(150,100,55,0.12)'; cx.lineWidth = 0.5 + rnd(i * 3 + b) * 1.4; cx.beginPath(); var yy = y0 + 4 + rnd(i + b * 7) * 76; cx.moveTo(0, yy); for (var x = 0; x <= w; x += 32) cx.lineTo(x, yy + Math.sin(x * 0.01 + i) * 2.5); cx.stroke(); }
cx.fillStyle = 'rgba(0,0,0,0.75)'; cx.fillRect(0, y0 + 84, w, 2);
var jx = rnd(b * 11) * w; cx.fillRect(jx, y0, 2, 84);
for (var n = 0; n < 2; n++) { cx.fillStyle = 'rgba(20,10,5,0.5)'; cx.beginPath(); cx.arc((jx + 40 + n * 300) % w, y0 + 20 + n * 44, 1.6, 0, 6.3); cx.fill(); }
}
for (var s = 0; s < 14; s++) { var x = rnd(s * 5) * w, y = rnd(s * 9) * h, g = cx.createRadialGradient(x, y, 0, x, y, 120); g.addColorStop(0, s % 2 ? 'rgba(10,5,2,0.28)' : 'rgba(160,120,70,0.1)'); g.addColorStop(1, 'rgba(10,5,2,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); }
});
window.dssInteriorSurface(boardTex, 'wood', 38);
boardTex.wrapS = boardTex.wrapT = THREE.RepeatWrapping; boardTex.repeat.set(2, 3.5);
var floorMat = new THREE.MeshStandardMaterial({ map: boardTex, bumpMap: boardTex, bumpScale: 0.004, roughness: 0.6, envMap: roomEnv, envMapIntensity: 0.18, metalness: 0.02 });

// ---------- A PLANAR REFLECTION, drawn only when the view changes ----------
// The French's mirror, made general so the flood on the boards can hold the room upside down as well.
function makeMirror(m, normal, size, tint, extra) {
var target = new THREE.WebGLRenderTarget(size, size, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
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
return { mesh: m, update: function(tgt, t) {
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
mirrors.forEach(function(o) { o.mesh.visible = false; });
renderer.toneMapping = THREE.NoToneMapping; renderer.setRenderTarget(target); renderer.render(scene, mcam);
renderer.setRenderTarget(oldTarget); renderer.toneMapping = oldTone; mirrors.forEach(function(o) { o.mesh.visible = true; });
} };
}
var mirrors = [];

// ---------- THE ROOM: a long narrow pub, the columns dividing it ----------
// From what is written of the Pillars of Hercules at 7 Greek Street: wooden fittings, bentwood stools, elbow-height tables against the wall,
// a copper bar top, dark walls, a stained-glass panel in the ceiling, and the classical columns that divide the bar and were there before the building.
// The passage's own two pillars are Piranesi ruins; here they stand broken at the top too, and the third, between them, is a trace until the passage shows it.
var W = 4.6, D = 8.0, H = 3.1;
var floor = mesh(new THREE.PlaneGeometry(W, D), floorMat, 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceil = mesh(new THREE.PlaneGeometry(W, D), ceilMat, 0, H, 0); ceil.rotation.x = Math.PI / 2;
var back = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2); back.receiveShadow = true;
var front = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, D / 2); front.rotation.y = Math.PI;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2;
var right = mesh(new THREE.PlaneGeometry(D, H), wallMat, W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2; right.receiveShadow = true;
// Dark oak panelling to elbow height on the right wall and the back: raised panels in their frames, a moulded rail along the top.
function panelling(len, x, z, ry) {
var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
mesh(new THREE.BoxGeometry(len, 1.15, 0.04), darkWood, 0, 0.575, 0, g);
var n = Math.round(len / 0.72), pw = len / n;
for (var i = 0; i < n; i++) {
var px = -len / 2 + pw * (i + 0.5);
mesh(new THREE.BoxGeometry(pw - 0.1, 0.78, 0.025), oak, px, 0.6, 0.03, g);
mesh(new THREE.BoxGeometry(pw - 0.2, 0.62, 0.012), oak, px, 0.6, 0.048, g);
}
mesh(new THREE.BoxGeometry(len, 0.07, 0.09), oak, 0, 1.17, 0.03, g);
mesh(new THREE.BoxGeometry(len, 0.12, 0.05), darkWood, 0, 0.06, 0.03, g);
return g;
}
panelling(D, W / 2 - 0.02, 0, -Math.PI / 2); panelling(W, 0, -D / 2 + 0.02, 0);
// the cornice, and a dado rail on the plain walls
var corniceMat = new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.7 });
[[W, 0, -D / 2 + 0.05, 0], [D, -W / 2 + 0.05, 0, Math.PI / 2], [D, W / 2 - 0.05, 0, -Math.PI / 2], [W, 0, D / 2 - 0.05, Math.PI]].forEach(function(c) {
var m = mesh(new THREE.BoxGeometry(c[0], 0.07, 0.1), corniceMat, c[1], H - 0.04, c[2]); m.rotation.y = c[3];
});
// Elbow-height shelf tables clutching the right wall, with what people leave on them.
var glassMat = new THREE.MeshPhysicalMaterial({ color: 0xf0eadc, roughness: 0.09, metalness: 0.04, envMap: roomEnv, envMapIntensity: 1.1, clearcoat: 1, transparent: true, opacity: 0.34 });
var beerMat = new THREE.MeshStandardMaterial({ color: 0xc27a18, roughness: 0.1, transparent: true, opacity: 0.72, emissive: 0x5a3000, emissiveIntensity: 0.35 });
function pintGlass(x, y, z, fill, parent) {
var g = new THREE.Group(); g.position.set(x, y, z); (parent || scene).add(g);
var body = mesh(new THREE.CylinderGeometry(0.04, 0.032, 0.15, 14, 1, true), glassMat, 0, 0.075, 0, g); body.material = glassMat.clone(); body.material.side = THREE.DoubleSide;
mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.005, 14), glassMat, 0, 0.002, 0, g);
if (fill > 0) mesh(new THREE.CylinderGeometry(0.031 + fill * 0.007, 0.03, 0.14 * fill, 14), beerMat, 0, 0.005 + 0.07 * fill, 0, g);
return g;
}
var ashMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.3, metalness: 0.2, envMap: roomEnv, envMapIntensity: 0.4 });
for (var s = 0; s < 3; s++) {
var sz = 2.4 - s * 2.3;
var sh = mesh(new THREE.BoxGeometry(0.3, 0.045, 1.3), shelfWood, W / 2 - 0.16, 1.12, sz); sh.castShadow = true; sh.receiveShadow = true;
mesh(new THREE.BoxGeometry(0.04, 0.5, 0.04), darkWood, W / 2 - 0.05, 0.87, sz - 0.5); mesh(new THREE.BoxGeometry(0.04, 0.5, 0.04), darkWood, W / 2 - 0.05, 0.87, sz + 0.5);
mesh(new THREE.BoxGeometry(0.26, 0.04, 0.04), darkWood, W / 2 - 0.16, 1.1, sz - 0.5); mesh(new THREE.BoxGeometry(0.26, 0.04, 0.04), darkWood, W / 2 - 0.16, 1.1, sz + 0.5);
if (s !== 2) pintGlass(W / 2 - 0.18, 1.143, sz + 0.3 - s * 0.5, s === 0 ? 0.35 : 0.8);
if (s === 1) { var tray = mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.018, 16), ashMat, W / 2 - 0.15, 1.152, sz - 0.25); }
if (s === 0) { var paper = mesh(new THREE.BoxGeometry(0.2, 0.008, 0.28), new THREE.MeshStandardMaterial({ color: 0xcfc4a6, roughness: 0.95 }), W / 2 - 0.17, 1.147, sz - 0.3); paper.rotation.y = 0.3; }
}
// The stained-glass panel let into the ceiling: a leaded rose lit from the room above, its colours dropped on the boards.
var glassTex = tex(512, 256, function(cx, w, h) {
var cols = ['#b83a24', '#d19a2a', '#2c6a96', '#4d8a3c', '#e2d3a0', '#7a3a78', '#c8622a'];
cx.fillStyle = '#e8dcb4'; cx.fillRect(0, 0, w, h);
function pane(px, py, i) { var g = cx.createRadialGradient(px, py, 2, px, py, 22); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = cols[i % cols.length]; cx.fill(); cx.fillStyle = g; cx.fill(); }
for (var i = 0; i < 64; i++) { var x = (i % 16) * 32 + 16, y = ((i / 16) | 0) * 64 + 32; cx.beginPath(); cx.moveTo(x, y - 30); cx.lineTo(x + 16, y); cx.lineTo(x, y + 30); cx.lineTo(x - 16, y); cx.closePath(); pane(x, y, i * 3 + ((i / 16) | 0)); }
var cxm = w / 2, cym = h / 2;
cx.beginPath(); cx.arc(cxm, cym, 92, 0, 6.3); cx.fillStyle = '#e8dcb4'; cx.fill();
for (var p = 0; p < 12; p++) { var a = p * Math.PI / 6; cx.beginPath(); cx.moveTo(cxm, cym); cx.quadraticCurveTo(cxm + Math.cos(a - 0.3) * 60, cym + Math.sin(a - 0.3) * 60, cxm + Math.cos(a) * 88, cym + Math.sin(a) * 88); cx.quadraticCurveTo(cxm + Math.cos(a + 0.3) * 60, cym + Math.sin(a + 0.3) * 60, cxm, cym); cx.closePath(); pane(cxm + Math.cos(a) * 45, cym + Math.sin(a) * 45, p + 2); }
cx.beginPath(); cx.arc(cxm, cym, 22, 0, 6.3); pane(cxm, cym, 1);
cx.strokeStyle = '#1a1410'; cx.lineWidth = 3.5;
for (var i = 0; i < 64; i++) { var x = (i % 16) * 32 + 16, y = ((i / 16) | 0) * 64 + 32; if (Math.hypot(x - cxm, y - cym) < 80) continue; cx.beginPath(); cx.moveTo(x, y - 30); cx.lineTo(x + 16, y); cx.lineTo(x, y + 30); cx.lineTo(x - 16, y); cx.closePath(); cx.stroke(); }
cx.beginPath(); cx.arc(cxm, cym, 92, 0, 6.3); cx.stroke(); cx.beginPath(); cx.arc(cxm, cym, 22, 0, 6.3); cx.stroke();
for (var p = 0; p < 12; p++) { var a = p * Math.PI / 6; cx.beginPath(); cx.moveTo(cxm + Math.cos(a) * 22, cym + Math.sin(a) * 22); cx.lineTo(cxm + Math.cos(a) * 92, cym + Math.sin(a) * 92); cx.stroke(); }
for (var g2 = 0; g2 < 5000; g2++) { cx.fillStyle = g2 % 2 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'; cx.fillRect(rnd(g2) * w, rnd(g2 + 1) * h, 1, 1); }
});
var glassPanel = mesh(new THREE.PlaneGeometry(1.6, 0.8), new THREE.MeshBasicMaterial({ map: glassTex, toneMapped: false, transparent: true, opacity: 0.92 }), 0, H - 0.02, -0.6); glassPanel.rotation.x = Math.PI / 2;
mesh(new THREE.BoxGeometry(1.74, 0.05, 0.07), darkWood, 0, H - 0.03, -0.6 - 0.43); mesh(new THREE.BoxGeometry(1.74, 0.05, 0.07), darkWood, 0, H - 0.03, -0.6 + 0.43);
mesh(new THREE.BoxGeometry(0.07, 0.05, 0.9), darkWood, -0.84, H - 0.03, -0.6); mesh(new THREE.BoxGeometry(0.07, 0.05, 0.9), darkWood, 0.84, H - 0.03, -0.6);
var glassLight = new THREE.PointLight(0xffd8a0, 0.5, 4.5, 1.6); glassLight.position.set(0, H - 0.4, -0.6); scene.add(glassLight);
var glassPool = mesh(new THREE.PlaneGeometry(1.9, 1.0), new THREE.MeshBasicMaterial({ map: glassTex, transparent: true, opacity: 0.09, depthWrite: false, blending: THREE.AdditiveBlending }), 0.15, 0.006, -0.35); glassPool.rotation.x = -Math.PI / 2; glassPool.rotation.z = 0.06;

// ---------- THE BAR, along the left, with its copper top ----------
var barG = new THREE.Group(); scene.add(barG);
var barZ0 = -3.0, barZ1 = 1.6, barX = -W / 2 + 0.9, barLen = barZ1 - barZ0, barMidZ = (barZ0 + barZ1) / 2;
var body = mesh(new THREE.BoxGeometry(0.6, 1.08, barLen), oak, barX, 0.54, barMidZ, barG); body.castShadow = true; body.receiveShadow = true;
for (var bp = 0; bp < Math.floor(barLen / 0.66); bp++) {
var pz0 = barZ0 + 0.4 + bp * 0.66;
mesh(new THREE.BoxGeometry(0.03, 0.72, 0.5), darkWood, barX + 0.31, 0.56, pz0, barG);
mesh(new THREE.BoxGeometry(0.012, 0.56, 0.36), oak, barX + 0.33, 0.56, pz0, barG);
}
mesh(new THREE.BoxGeometry(0.66, 0.08, barLen), darkWood, barX, 0.04, barMidZ, barG);
var top = mesh(new THREE.BoxGeometry(0.76, 0.05, barLen + 0.1), copper, barX, 1.105, barMidZ, barG); top.receiveShadow = true; top.castShadow = true;
mesh(new THREE.BoxGeometry(0.03, 0.06, barLen + 0.1), copperPlain, barX + 0.385, 1.11, barMidZ, barG);
var rail = mesh(new THREE.CylinderGeometry(0.02, 0.02, barLen, 10), brass, barX + 0.42, 0.22, barMidZ, barG); rail.rotation.x = Math.PI / 2;
for (var rb = 0; rb < 4; rb++) mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 6), brass, barX + 0.36, 0.2, barZ0 + 0.5 + rb * 1.2, barG).rotation.z = Math.PI / 2;
var detail=window.dssDetailProps(mesh,tex,roomEnv,scene);
var ivory = new THREE.MeshStandardMaterial({ color: 0xe6dcc0, roughness: 0.35, envMap: roomEnv, envMapIntensity: 0.3 });
for (var pz = barZ0 + 0.8; pz < barZ1 - 0.4; pz += 0.9) {
mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.16, 12), copperPlain, barX - 0.1, 1.2, pz, barG);
var pump = mesh(new THREE.LatheGeometry([[0,-0.17],[0.019,-0.17],[0.022,-0.11],[0.018,-0.06],[0.03,0.08],[0.025,0.15],[0,0.17]].map(function(p){return new THREE.Vector2(p[0],p[1]);}),24), ivory, barX - 0.16, 1.42, pz, barG); pump.rotation.z = 0.28; pump.castShadow = true;
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.09, 6), brass, barX - 0.12, 1.3, pz, barG).rotation.z = 0.28;
mesh(new THREE.BoxGeometry(0.03, 0.045, 0.03), new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.5 }), barX - 0.16, 1.585, pz, barG);
}
// what stands on the copper: glasses, a bar towel, a bowl of something
pintGlass(barX + 0.15, 1.13, -0.6, 0.55, barG); pintGlass(barX + 0.2, 1.13, 0.9, 0, barG); pintGlass(barX + 0.05, 1.13, -1.9, 0.9, barG);
mesh(new THREE.BoxGeometry(0.28, 0.012, 0.18), new THREE.MeshStandardMaterial({ color: 0x6a1e1e, roughness: 0.95 }), barX - 0.05, 1.136, 1.3, barG);
mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.04, 16), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.5, envMap: roomEnv, envMapIntensity: 0.3 }), barX + 0.1, 1.15, -1.2, barG);
// the back bar on the left wall: a real mirror, shelves, bottles, the till, the telephone
var bbX = -W / 2;
mesh(new THREE.BoxGeometry(0.42, 1.2, barLen), darkWood, bbX + 0.21, 0.6, barMidZ, barG).receiveShadow = true;
mesh(new THREE.BoxGeometry(0.48, 0.05, barLen), shelfWood, bbX + 0.24, 1.22, barMidZ, barG);
var mir = mesh(new THREE.PlaneGeometry(barLen - 0.4, 1.15), null, bbX + 0.03, 1.9, barMidZ); mir.rotation.y = Math.PI / 2;
mirrors.push(makeMirror(mir, new THREE.Vector3(1, 0, 0), portrait ? 512 : 1024, new THREE.Vector3(0.7, 0.66, 0.58), {}));
mesh(new THREE.BoxGeometry(0.06, 1.3, barLen - 0.3), oak, bbX + 0.02, 1.9, barMidZ, barG).position.x = bbX - 0.01;
mesh(new THREE.BoxGeometry(0.06, 3.1, 0.16), oak, bbX + 0.03, 1.55, barZ0 - 0.1); mesh(new THREE.BoxGeometry(0.06, 3.1, 0.16), oak, bbX + 0.03, 1.55, barZ1 + 0.1);
[1.35, 1.82, 2.28].forEach(function(sy, si) {
mesh(new THREE.BoxGeometry([0.34, 0.28, 0.22][si], 0.03, barLen - 0.4), shelfWood, bbX + [0.17, 0.14, 0.11][si], sy, barMidZ, barG);
});
var botCols = [0x2a5a2a, 0x7a4a18, 0x1a2a5a, 0x8a7a20, 0x4a1a1a, 0x2a4a3a, 0xa08030, 0x3a2a1a, 0x6a3a10];
function bottle(x, y, z, col, h, r, parent) {
var g = new THREE.Group(); g.position.set(x, y, z);
detail.bottle(g,h,r,col,Math.round(x*19+z*23));g.rotation.y=Math.PI/2;
(parent || scene).add(g); return g;
}
[1.365, 1.835, 2.295].forEach(function(sy, row) {
var sx = bbX + [0.2, 0.16, 0.12][row], n = 16;
for (var b = 0; b < n; b++) {
if (rnd(row * 40 + b) < 0.16) continue;
bottle(sx + (rnd(row + b * 3) - 0.5) * 0.05, sy, barZ0 + 0.3 + b * ((barLen - 0.6) / n) + (rnd(b + row * 9) - 0.5) * 0.06, botCols[(b + row * 4) % botCols.length], 0.2 + rnd(b * 5 + row) * 0.14, 0.03 + rnd(b * 2 + row) * 0.012, barG);
}
});
for (var o = 0; o < 5; o++) bottle(bbX + 0.13, 1.79, -1.9 + o * 0.42, botCols[(o * 5) % botCols.length], 0.22, 0.03, barG).rotation.x = Math.PI;
// Old mechanical register: charcoal enamel, dull nickel and yellowed keys.
var till=new THREE.Group();till.position.set(bbX+0.25,1.24,barZ0+0.9);till.rotation.y=Math.PI/2;barG.add(till);
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

// bentwood stools along the bar: the bent back, the round seat, the ring for your feet
var bentMat = new THREE.MeshStandardMaterial({ color: 0x3a2210, roughness: 0.45, envMap: roomEnv, envMapIntensity: 0.25 });
var stoolSeat = new THREE.MeshStandardMaterial({ map: grainC, roughness: 0.5, envMap: roomEnv, envMapIntensity: 0.3 });
var stools = [];
function stool(x, z) {
var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rnd(x * 3 + z) * 6; scene.add(g);
for (var l = 0; l < 4; l++) { var a = l * Math.PI / 2 + 0.4; var leg = mesh(new THREE.CylinderGeometry(0.013, 0.017, 0.72, 8), bentMat, Math.cos(a) * 0.14, 0.36, Math.sin(a) * 0.14, g); leg.rotation.z = Math.cos(a) * 0.08; leg.rotation.x = -Math.sin(a) * 0.08; }
detail.arc(g,0.15,0.011,detail.material('#7c6348','glaze'),0,0.24,0);for(var join=0;join<4;join++){var angle=join*Math.PI/2+0.4;mesh(new THREE.CylinderGeometry(0.017,0.017,0.016,10),bentMat,Math.cos(angle)*0.14,0.24,Math.sin(angle)*0.14,g);}
var wornSeat=mesh(new THREE.SphereGeometry(1,24,10),stoolSeat,0,0.74,0,g);wornSeat.scale.set(0.17,0.022,0.17);detail.arc(g,0.165,0.002,detail.material('#725134','glaze'),0,0.735,0);
var back = mesh(new THREE.TorusGeometry(0.15, 0.011, 6, 20, Math.PI), bentMat, 0, 0.98, 0, g); back.rotation.x = Math.PI / 2; back.rotation.z = Math.PI;
mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.26, 6), bentMat, -0.15, 0.87, 0, g); mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.26, 6), bentMat, 0.15, 0.87, 0, g);
stools.push(g); return g;
}
stool(barX + 0.62, -2.2); stool(barX + 0.62, -1.4); stool(barX + 0.62, 0.2); stool(barX + 0.62, 1.0);

// ---------- THE TELEPHONE, on the back bar ----------
var phoneG = new THREE.Group(); phoneG.position.set(-W / 2 + 0.2, 1.36, barZ1 - 0.3); phoneG.rotation.y = 0.4; scene.add(phoneG);
var bakelite = new THREE.MeshStandardMaterial({ color: 0x16120f, roughness: 0.26, metalness: 0.08, envMap: roomEnv, envMapIntensity: 0.55 });
// Rounded moulded Bakelite, with a slightly raised shoulder beneath the dial.
var phoneBody=mesh(new THREE.SphereGeometry(1,24,12),bakelite,0,0.045,0,phoneG);phoneBody.scale.set(0.126,0.06,0.113);
var plinth=mesh(new THREE.CylinderGeometry(0.106,0.114,0.018,32),bakelite,0,0.012,0,phoneG);plinth.scale.z=0.88;
var dialG=new THREE.Group();dialG.position.set(0,0.1,0.035);dialG.rotation.x=0.22;phoneG.add(dialG);
var dialMetal=new THREE.MeshStandardMaterial({color:0x8f8878,roughness:0.48,metalness:0.65});
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
 var hole=mesh(new THREE.TorusGeometry(0.0068,0.0012,5,12),dialMetal,Math.cos(angle)*0.04,0.007,Math.sin(angle)*0.04,dialG);hole.rotation.x=-Math.PI/2;
}
mesh(new THREE.BoxGeometry(0.006,0.012,0.018),dialMetal,0.048,0.012,0.018,dialG);
// Low rear shoulder and broad cradle saddles physically support the receiver.
var rearShoulder=mesh(new THREE.SphereGeometry(1,20,10),bakelite,0,0.073,-0.042,phoneG);rearShoulder.scale.set(0.108,0.044,0.055);
[-1,1].forEach(function(side){
 var saddle=mesh(new THREE.SphereGeometry(1,16,8),bakelite,side*0.092,0.097,-0.033,phoneG);saddle.scale.set(0.033,0.022,0.032);
 var cup=mesh(new THREE.SphereGeometry(1,16,10),bakelite,side*0.103,0.119,-0.033,phoneG);cup.scale.set(0.038,0.025,0.034);
 mesh(new THREE.CylinderGeometry(0.028,0.032,0.009,20),bakelite,side*0.103,0.102,-0.033,phoneG);
});
var handlePath=new THREE.CatmullRomCurve3([new THREE.Vector3(-0.103,0.129,-0.033),new THREE.Vector3(-0.064,0.149,-0.036),new THREE.Vector3(0.064,0.149,-0.036),new THREE.Vector3(0.103,0.129,-0.033)]);
mesh(new THREE.TubeGeometry(handlePath,20,0.013,8,false),bakelite,0,0,0,phoneG);
var cordPoints=[];
for(var n=0;n<=160;n++){var u=n/160,angle=u*Math.PI*2*18;cordPoints.push(new THREE.Vector3(-0.127-0.01*Math.cos(angle)-0.035*Math.sin(u*Math.PI),0.113-u*0.094,-0.035+u*0.075+0.01*Math.sin(angle)));}
var cordPath=new THREE.CatmullRomCurve3(cordPoints);
mesh(new THREE.TubeGeometry(cordPath,180,0.0022,5,false),bakelite,0,0,0,phoneG);
var phoneHit = mesh(new THREE.BoxGeometry(0.3, 0.3, 0.34), new THREE.MeshBasicMaterial({ visible: false }), 0, 0.12, 0, phoneG);

// ---------- THE PILLARS: two broken columns dividing the bar, and the third ----------
// Fluted shafts, an Attic base, and a break at the top that no two share; the whole one keeps its capital.
function flutedShaft(r0, r1, h, brokenTop) {
var geo = new THREE.CylinderGeometry(r0, r1, h, 72, 6, false);
var pos = geo.attributes.position, seedA = r0 * 100 + h;
for (var i = 0; i < pos.count; i++) {
var x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), a = Math.atan2(z, x), rr = Math.hypot(x, z);
var flute = Math.max(0, Math.cos(a * 20)); var f = 1 - 0.05 * flute * flute;
if (brokenTop && y > h / 2 - 0.01) { var j = 0.06 + rnd(seedA + a * 13) * 0.25 + Math.max(0, Math.sin(a * 3 + seedA)) * 0.12; pos.setY(i, y - j); f *= 0.95 + rnd(a * 7 + seedA) * 0.1; }
if (rr > 1e-6) { pos.setX(i, x * f); pos.setZ(i, z * f); } // 2026-10-14: the cap's centre point (rr 0) went 0/0 = NaN (the console's computeBoundingSphere warning)
}
geo.computeVertexNormals(); return geo;
}
function column(x, z, brokenAt, mat) {
var g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
mesh(new THREE.BoxGeometry(0.66, 0.1, 0.66), mat, 0, 0.05, 0, g);
mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.06, 32), mat, 0, 0.13, 0, g);
mesh(new THREE.TorusGeometry(0.26, 0.05, 10, 32), mat, 0, 0.19, 0, g).rotation.x = Math.PI / 2;
var whole = brokenAt > H - 0.9;
var shaft = mesh(flutedShaft(0.2, 0.24, brokenAt, !whole), mat, 0, 0.26 + brokenAt / 2, 0, g); shaft.castShadow = true; shaft.receiveShadow = true;
if (whole) { mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.16, 32), mat, 0, 0.26 + brokenAt + 0.08, 0, g); mesh(new THREE.BoxGeometry(0.68, 0.1, 0.68), mat, 0, 0.26 + brokenAt + 0.21, 0, g); }
else {
// the rubble of the break lies at the foot
for (var r = 0; r < 6; r++) { var chip = mesh(new THREE.DodecahedronGeometry(0.05 + rnd(r + x) * 0.05, 0), mat, (rnd(r * 3 + z) - 0.5) * 0.9, 0.12, (rnd(r * 5 + x) - 0.5) * 0.7 + 0.2, g); chip.rotation.set(rnd(r) * 3, rnd(r + 1) * 3, 0); }
}
return g;
}
var PZ = -1.7; // the columns stand across the room two thirds of the way in
// The ruined pair flanks the sightline to the rear doorway; neither keeps a capital.
var ruinZ = -2.65;
var pillarL = column(-0.75, ruinZ, 2.0, stoneMat);
var pillarR = column(1.45, ruinZ, 2.04, stoneMat);
// the third pillar: whole, and only a trace until the passage below has shown it (Inis's tip); it holds the room still
var pillarShown = !!document.querySelector('tw-passage .pillar.centre');
var pillarSynth = false; try { var sv = document.getElementById('dss-synth-visited'); pillarSynth = ((sv && sv.textContent) || '').split(',').filter(function(x) { return x.trim(); }).length >= 5; } catch (e) {} // 2026-10-12 (the Pillars audit): tonight's five worlds, as the synthesis link reads them (was the lifetime store, so a pillar could stand with no link)
var pillarThere = pillarShown || pillarSynth; // 2026-10-06 (Dr Quill): no key or no word from Inis, no pillar at all // 2026-09-28 review fix: Harlowe renders the hook's svg in a wrapper outside .pillars-scene, so the old scoped query was always false
var ghostStone = new THREE.MeshStandardMaterial({ map: stoneTex, bumpMap: stoneTex, bumpScale: 0.01, roughness: 0.88, transparent: true, opacity: pillarShown ? 0.92 : 0.14, emissive: 0x2a2418, emissiveIntensity: pillarShown ? 0.25 : 0.05, envMap: roomEnv, envMapIntensity: 0.12 });
var pillarC = column(0, PZ, H - 0.7, ghostStone); pillarC.visible = pillarThere;
var pillarHit = mesh(new THREE.CylinderGeometry(0.34, 0.34, H, 12), new THREE.MeshBasicMaterial({ visible: false }), 0, H / 2, PZ);
var pillarLight = new THREE.PointLight(0xd8c8a0, 0, 3); pillarLight.position.set(0, 1.6, PZ + 0.5); scene.add(pillarLight);

// ---------- THE BACK: the arch to Manette Street, the lattice window beside it, rain ----------
var archG = new THREE.Group(); archG.position.set(0.6, 0, -D / 2 + 0.02); scene.add(archG);
var nightTex = tex(128, 256, function(cx, w, h) {
var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0a0e16'); g.addColorStop(0.55, '#171a22'); g.addColorStop(0.8, '#2e2a22'); g.addColorStop(1, '#141210'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
// the far wall of the passage, a doorway, the lamp, the wet flags
cx.fillStyle = '#1f1c18'; cx.fillRect(0, 60, w, 130); for (var b = 0; b < 30; b++) { cx.fillStyle = 'rgba(0,0,0,' + (0.1 + rnd(b) * 0.2) + ')'; cx.fillRect((b % 6) * 22 + (((b / 6) | 0) % 2) * 11, 60 + ((b / 6) | 0) * 26, 21, 25); }
cx.fillStyle = '#0a0806'; cx.fillRect(80, 90, 26, 100);
var lg = cx.createRadialGradient(62, 118, 0, 62, 118, 60); lg.addColorStop(0, 'rgba(255,214,150,0.9)'); lg.addColorStop(0.1, 'rgba(255,200,120,0.5)'); lg.addColorStop(1, 'rgba(255,200,120,0)'); cx.fillStyle = lg; cx.fillRect(0, 0, w, h);
cx.fillStyle = '#ffe6bb'; cx.fillRect(58, 114, 8, 9); cx.fillStyle = '#111'; cx.fillRect(61, 123, 2, 60);
var wg = cx.createLinearGradient(0, 190, 0, h); wg.addColorStop(0, 'rgba(120,110,90,0.35)'); wg.addColorStop(1, 'rgba(20,20,26,0.5)'); cx.fillStyle = wg; cx.fillRect(0, 190, w, h - 190);
cx.fillStyle = 'rgba(255,214,150,0.18)'; cx.fillRect(56, 190, 12, 66);
});
var archPane = mesh(new THREE.PlaneGeometry(1.1, 2.2), new THREE.MeshBasicMaterial({ map: nightTex, toneMapped: false }), 0, 1.15, -0.04, archG);
var rainTex = tex(128, 512, function(cx, w, h) { for (var i = 0; i < 160; i++) { cx.strokeStyle = 'rgba(200,210,230,' + (0.05 + rnd(i) * 0.16) + ')'; cx.lineWidth = 0.8 + rnd(i + 1); cx.beginPath(); var x = rnd(i + 3) * w, y = rnd(i + 5) * h; cx.moveTo(x, y); cx.lineTo(x - 1.5, y + 14 + rnd(i) * 26); cx.stroke(); } });
rainTex.wrapS = rainTex.wrapT = THREE.RepeatWrapping;
var rain = mesh(new THREE.PlaneGeometry(1.1, 2.2), new THREE.MeshBasicMaterial({ map: rainTex, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), 0, 1.15, -0.02, archG);
var archStone = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.9, color: 0x9a9080 });
mesh(new THREE.BoxGeometry(0.18, 2.3, 0.14), archStone, -0.64, 1.15, 0.05, archG); mesh(new THREE.BoxGeometry(0.18, 2.3, 0.14), archStone, 0.64, 1.15, 0.05, archG);
for (var v = 0; v < 9; v++) { var a = Math.PI * v / 8, vs = mesh(new THREE.BoxGeometry(0.2, 0.17, 0.14), archStone, Math.cos(a) * 0.66, 2.28 + Math.sin(a) * 0.66, 0.05, archG); vs.rotation.z = a - Math.PI / 2; if (v === 4) vs.scale.set(1.15, 1.25, 1); }
mesh(new THREE.BoxGeometry(1.3, 0.06, 0.1), darkWood, 0, 0.03, 0.05, archG);
var archLight = new THREE.PointLight(0x9aa6c0, 0.42, 4, 1.6); archLight.position.set(0.6, 1.4, -D / 2 + 0.6); scene.add(archLight);
var streetLamp = new THREE.PointLight(0xffd8a0, 0.5, 3.5, 1.8); streetLamp.position.set(0.55, 1.3, -D / 2 + 0.1); scene.add(streetLamp);
// the lattice window high on the back wall, rain on it, the flood-light of the street
var winG = new THREE.Group(); winG.position.set(-1.35, 2.3, -D / 2 + 0.02); scene.add(winG);
var latticeTex = tex(512, 256, function(cx, w, h) {
var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#232a3a'); g.addColorStop(0.7, '#4a4030'); g.addColorStop(1, '#6a5a38'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
var lg = cx.createRadialGradient(w * 0.7, h * 0.55, 0, w * 0.7, h * 0.55, w * 0.5); lg.addColorStop(0, 'rgba(255,214,150,0.5)'); lg.addColorStop(1, 'rgba(255,214,150,0)'); cx.fillStyle = lg; cx.fillRect(0, 0, w, h);
for (var q = 0; q < 700; q++) { cx.fillStyle = 'rgba(' + (200 + rnd(q) * 40 | 0) + ',' + (200 + rnd(q + 1) * 30 | 0) + ',' + (180 + rnd(q + 2) * 40 | 0) + ',' + rnd(q + 3) * 0.06 + ')'; cx.fillRect(rnd(q + 4) * w, rnd(q + 5) * h, 3 + rnd(q) * 8, 3 + rnd(q + 6) * 8); }
cx.strokeStyle = 'rgba(28,24,20,0.95)'; cx.lineWidth = 4;
for (var d = -h; d < w + h; d += 44) { cx.beginPath(); cx.moveTo(d, 0); cx.lineTo(d + h, h); cx.stroke(); cx.beginPath(); cx.moveTo(d, h); cx.lineTo(d + h, 0); cx.stroke(); }
cx.strokeStyle = 'rgba(120,110,100,0.25)'; cx.lineWidth = 1;
for (var d = -h + 3; d < w + h; d += 44) { cx.beginPath(); cx.moveTo(d, 0); cx.lineTo(d + h, h); cx.stroke(); }
for (var i = 0; i < 120; i++) { cx.fillStyle = 'rgba(220,230,255,' + (0.1 + rnd(i) * 0.25) + ')'; cx.beginPath(); cx.ellipse(rnd(i + 3) * w, rnd(i + 5) * h, 1.5 + rnd(i + 7), 3 + rnd(i) * 8, 0, 0, 6.3); cx.fill(); }
});
var winPane = mesh(new THREE.PlaneGeometry(2.0, 0.9), new THREE.MeshBasicMaterial({ map: latticeTex, toneMapped: false }), 0, 0, 0, winG);
mesh(new THREE.BoxGeometry(2.14, 0.07, 0.07), darkWood, 0, 0.485, 0.03, winG); mesh(new THREE.BoxGeometry(2.14, 0.09, 0.12), shelfWood, 0, -0.5, 0.05, winG);
mesh(new THREE.BoxGeometry(0.07, 1.0, 0.07), darkWood, -1.035, 0, 0.03, winG); mesh(new THREE.BoxGeometry(0.07, 1.0, 0.07), darkWood, 1.035, 0, 0.03, winG); mesh(new THREE.BoxGeometry(0.05, 1.0, 0.05), darkWood, 0, 0, 0.03, winG);
var winLight = new THREE.PointLight(0x9aa8c8, 0.4, 4, 1.6); winLight.position.set(-1.35, 2.2, -D / 2 + 0.6); scene.add(winLight);
// the door, front right: the threshold the flood is lapping at
var doorG = new THREE.Group(); doorG.position.set(W / 2 - 0.03, 0, 0.6); doorG.rotation.y = -Math.PI / 2; scene.add(doorG);
var doorLeaf = mesh(new THREE.BoxGeometry(0.95, 2.15, 0.06), darkWood, 0, 1.075, 0, doorG); doorLeaf.castShadow = true;
mesh(new THREE.BoxGeometry(1.1, 0.1, 0.12), oak, 0, 2.2, 0, doorG); mesh(new THREE.BoxGeometry(0.08, 2.25, 0.12), oak, -0.55, 1.125, 0, doorG); mesh(new THREE.BoxGeometry(0.08, 2.25, 0.12), oak, 0.55, 1.125, 0, doorG);
mesh(new THREE.BoxGeometry(0.34, 0.7, 0.02), oak, -0.2, 0.55, 0.035, doorG); mesh(new THREE.BoxGeometry(0.34, 0.7, 0.02), oak, 0.2, 0.55, 0.035, doorG);
// Solid upper panels and an obvious brass lever distinguish the exit from the lattice window.
[-0.2,0.2].forEach(function(x){mesh(new THREE.BoxGeometry(0.34,0.74,0.025),oak,x,1.6,0.04,doorG);});
mesh(new THREE.BoxGeometry(0.18,0.035,0.055),brass,0.31,1.05,0.09,doorG);
var exitTex=tex(256,64,function(cx,w,h){cx.fillStyle='#22352c';cx.fillRect(0,0,w,h);cx.strokeStyle='#cfbd83';cx.lineWidth=4;cx.strokeRect(3,3,w-6,h-6);cx.fillStyle='#f6e6b7';cx.textAlign='center';cx.textBaseline='middle';cx.font='bold 31px Georgia,serif';cx.fillText('WAY OUT',w/2,h/2);});
mesh(new THREE.PlaneGeometry(0.64,0.16),new THREE.MeshBasicMaterial({map:exitTex,toneMapped:false}),0,1.62,0.065,doorG);
mesh(new THREE.BoxGeometry(0.7, 0.05, 0.05), darkWood, 0, 1.86, 0.04, doorG); mesh(new THREE.BoxGeometry(0.7, 0.05, 0.05), darkWood, 0, 1.24, 0.04, doorG);
mesh(new THREE.SphereGeometry(0.035, 12, 10), brass, 0.36, 1.05, 0.06, doorG); mesh(new THREE.BoxGeometry(0.06, 0.16, 0.012), brass, 0.36, 1.05, 0.035, doorG);
mesh(new THREE.BoxGeometry(0.16, 0.05, 0.012), brass, 0, 1.0, 0.035, doorG);
// the flood: water over the boards at the threshold, holding the room upside down and finding its level
var pool = mesh(new THREE.PlaneGeometry(2.2, 3.2), null, W / 2 - 0.9, 0.008, 0.7); pool.rotation.x = -Math.PI / 2;
mirrors.push(makeMirror(pool, new THREE.Vector3(0, 1, 0), portrait ? 512 : 1024, new THREE.Vector3(0.55, 0.6, 0.72), { transparent: true, ripple: true, edge: '0.3' }));
var seep = mesh(new THREE.PlaneGeometry(1.3, 0.24), new THREE.MeshBasicMaterial({ color: 0x8aa0c0, transparent: true, opacity: 0.12, depthWrite: false }), 0, 0.01, -0.1, doorG); seep.rotation.x = -Math.PI / 2;
var doorHit = mesh(new THREE.BoxGeometry(1.1, 2.2, 0.5), new THREE.MeshBasicMaterial({ visible: false }), 0, 1.1, -0.15, doorG);

// ---------- THE PARTICULARS: what the outside scenes have and a bare room lacks: lettering, prints, the things a pub accumulates ----------
function textTex(w, h, fn) { return tex(w, h, function(cx, ww, hh) { fn(cx, ww, hh); }); }
// pump clips, each its own ale
var clipNames = ['BEST BITTER', 'OLD PORTER', 'PALE ALE', 'MILD'];
var clipK = 0;
for (var pz2 = barZ0 + 0.8; pz2 < barZ1 - 0.4; pz2 += 0.9) {
var nm = clipNames[clipK % clipNames.length], cc = ['#7a1e1e', '#1e2a4a', '#b08a2a', '#2a4a2a'][clipK % 4]; clipK++;
var ct = textTex(128, 96, function(cx, w, h) { cx.fillStyle = '#e8dcc0'; cx.fillRect(0, 0, w, h); cx.fillStyle = cc; cx.fillRect(4, 4, w - 8, h - 8); cx.fillStyle = '#e8dcc0'; cx.font = 'bold 15px Georgia,serif'; cx.textAlign = 'center'; cx.fillText(nm, w / 2, h / 2 + 5); cx.strokeStyle = '#e8dcc0'; cx.lineWidth = 1; cx.strokeRect(10, 10, w - 20, h - 20); });
var clip = mesh(new THREE.PlaneGeometry(0.09, 0.068), new THREE.MeshStandardMaterial({ map: ct, roughness: 0.6 }), barX - 0.2, 1.36, pz2, barG); clip.rotation.y = Math.PI / 2; clip.rotation.z = 0.28; clip.position.x = barX - 0.205;
}
// the gilt line across the mirror
var giltTex = textTex(1024, 128, function(cx, w, h) { cx.clearRect(0, 0, w, h); cx.font = 'bold 44px Georgia,serif'; cx.textAlign = 'center'; var gold=cx.createLinearGradient(0,25,0,66);gold.addColorStop(0,'#bf8b38');gold.addColorStop(.35,'#ffe6a1');gold.addColorStop(.49,'#fff1bd');gold.addColorStop(.64,'#e9c36a');gold.addColorStop(1,'#c08c3d');cx.fillStyle=gold;cx.strokeStyle='rgba(61,37,12,.85)';cx.lineWidth=1.8;cx.strokeText('THE PILLARS OF HERCULES',w/2,62); cx.fillText('THE PILLARS OF HERCULES', w / 2, 62); cx.font = 'italic 22px Georgia,serif'; cx.fillStyle = 'rgba(246,215,142,0.98)'; cx.fillText('fine ales · wines · spirits', w / 2, 100); cx.strokeStyle = 'rgba(245,209,127,0.9)'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(120, 72); cx.lineTo(w - 120, 72); cx.stroke(); });
var gilt = mesh(new THREE.PlaneGeometry(barLen - 0.9, 0.34), new THREE.MeshPhysicalMaterial({map:giltTex,transparent:true,roughness:0.27,metalness:0.58,clearcoat:0.7,clearcoatRoughness:0.2,envMap:roomEnv,envMapIntensity:1.1,emissive:0xffe4a2,emissiveMap:giltTex,emissiveIntensity:0.48,depthWrite:false}), bbX + 0.38, 2.06, barMidZ); gilt.rotation.y = Math.PI / 2;
// a chalkboard on the back wall by the arch: REAL ALES and tonight's prices
var chalkTex = textTex(256, 320, function(cx, w, h) {
cx.fillStyle = '#1a1c18'; cx.fillRect(0, 0, w, h); for (var i = 0; i < 1500; i++) { cx.fillStyle = 'rgba(255,255,255,' + rnd(i) * 0.05 + ')'; cx.fillRect(rnd(i + 1) * w, rnd(i + 2) * h, 2, 2); }
cx.fillStyle = 'rgba(240,235,220,0.9)'; cx.textAlign = 'center'; cx.font = 'bold 34px Georgia,serif'; cx.fillText('REAL ALES', w / 2, 54); cx.strokeStyle = 'rgba(240,235,220,0.7)'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(30, 66); cx.lineTo(w - 30, 66); cx.stroke();
cx.font = '22px Georgia,serif'; cx.textAlign = 'left'; ['Bitter  . . . . 21p', 'Porter  . . . . 23p', 'Pale  . . . . . 22p', 'Mild  . . . . . 19p', 'Cider  . . . . . 20p'].forEach(function(l, i) { cx.fillText(l, 26, 110 + i * 36); });
cx.font = 'italic 18px Georgia,serif'; cx.textAlign = 'center'; cx.fillText('no credit, no exceptions', w / 2, 300);
});
var chalk = mesh(new THREE.PlaneGeometry(0.5, 0.64), new THREE.MeshStandardMaterial({ map: chalkTex, roughness: 0.95 }), 1.75, 1.72, -D / 2 + 0.03);
mesh(new THREE.BoxGeometry(0.58, 0.72, 0.03), oak, 1.75, 1.72, -D / 2 + 0.015);
// Piranesi on the right wall: three framed etchings of ruins, the same ruins the columns are
function etchingTex(seed) {
return tex(256, 320, function(cx, w, h) {
cx.fillStyle = '#d9cdae'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 6000; i++) { cx.fillStyle = i % 2 ? 'rgba(90,70,40,0.05)' : 'rgba(255,250,230,0.05)'; cx.fillRect(rnd(i + seed) * w, rnd(i * 3 + seed) * h, 1, 1); }
cx.strokeStyle = '#3a2c1c'; cx.lineWidth = 0.9;
function hatch(x0, y0, x1, y1, step, a) { cx.globalAlpha = a; for (var y = y0; y < y1; y += step) { cx.beginPath(); cx.moveTo(x0, y); cx.lineTo(x1, y + step * 0.6); cx.stroke(); } cx.globalAlpha = 1; }
// a sky of horizontal hatching, an arch, columns standing and fallen
hatch(20, 20, w - 20, 110, 4, 0.25);
var ax = 60 + rnd(seed) * 80, ar = 50 + rnd(seed + 1) * 30;
cx.lineWidth = 1.4; cx.beginPath(); cx.arc(ax + ar, 150, ar, Math.PI, 0); cx.moveTo(ax, 150); cx.lineTo(ax, 260); cx.moveTo(ax + ar * 2, 150); cx.lineTo(ax + ar * 2, 260); cx.stroke();
hatch(ax + 4, 100, ax + ar * 2 - 4, 150, 3, 0.5); hatch(ax + ar * 2 + 2, 150, w - 20, 260, 3.5, 0.35);
for (var c = 0; c < 3; c++) { var cx0 = 30 + c * 70 + rnd(seed + c) * 20, ch = 90 + rnd(seed * 3 + c) * 60; cx.lineWidth = 1; cx.strokeRect(cx0, 260 - ch, 14, ch); for (var f = 0; f < 4; f++) { cx.beginPath(); cx.moveTo(cx0 + 3 + f * 3, 260 - ch + 4); cx.lineTo(cx0 + 3 + f * 3, 258); cx.stroke(); } cx.strokeRect(cx0 - 3, 260 - ch - 6, 20, 6); }
cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(150, 250); cx.lineTo(230, 236); cx.moveTo(150, 262); cx.lineTo(230, 248); cx.moveTo(150, 250); cx.lineTo(150, 262); cx.stroke();
hatch(150, 250, 230, 262, 3, 0.4);
hatch(20, 262, w - 20, 300, 5, 0.3);
var tiny = [rnd(seed + 9) * 60 + 100, rnd(seed + 11) * 50 + 120]; cx.beginPath(); cx.arc(tiny[0], 252, 3, 0, 6.3); cx.moveTo(tiny[0], 255); cx.lineTo(tiny[0], 268); cx.stroke();
cx.font = 'italic 9px Georgia,serif'; cx.fillStyle = '#5a4a30'; cx.textAlign = 'center'; cx.fillText(['Veduta degli avanzi', 'Rovine del tempio', 'Colonne spezzate'][seed % 3], w / 2, 312);
var vg = cx.createRadialGradient(w / 2, h / 2, 60, w / 2, h / 2, 220); vg.addColorStop(0, 'rgba(90,70,40,0)'); vg.addColorStop(1, 'rgba(90,70,40,0.35)'); cx.fillStyle = vg; cx.fillRect(0, 0, w, h);
});
}
var frameMat = new THREE.MeshStandardMaterial({ color: 0x1a1008, roughness: 0.5, envMap: roomEnv, envMapIntensity: 0.2 });
[[2.3, 1], [-0.3, 2], [-2.6, 3]].forEach(function(f) {
var fz = f[0], fy = 2.05 + (f[1] % 2) * 0.05;
mesh(new THREE.BoxGeometry(0.03, 0.62, 0.5), frameMat, W / 2 - 0.035, fy, fz);
var pr = mesh(new THREE.PlaneGeometry(0.42, 0.54), new THREE.MeshStandardMaterial({ map: etchingTex(f[1]), roughness: 0.85 }), W / 2 - 0.052, fy, fz); pr.rotation.y = -Math.PI / 2;
var trim=detail.material('#806441','metal');[-1,1].forEach(function(side){mesh(new THREE.BoxGeometry(0.005,0.55,0.005),trim,W/2-0.056,fy,fz+side*0.215);mesh(new THREE.BoxGeometry(0.005,0.005,0.43),trim,W/2-0.056,fy+side*0.275,fz);});
});
// a clock over the arch, stopped at the hour the flood came
var clockTex = textTex(128, 128, function(cx, w, h) { cx.fillStyle = '#e8dcc0'; cx.beginPath(); cx.arc(64, 64, 60, 0, 6.3); cx.fill(); cx.fillStyle = '#2a1a10'; cx.font = 'bold 13px Georgia,serif'; cx.textAlign = 'center'; for (var i = 1; i <= 12; i++) { var a = i * Math.PI / 6; cx.fillText(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][i - 1], 64 + Math.sin(a) * 46, 68 - Math.cos(a) * 46); } cx.strokeStyle = '#2a1a10'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(64, 64); cx.lineTo(64 + Math.sin(2.6) * 34, 64 - Math.cos(2.6) * 34); cx.moveTo(64, 64); cx.lineTo(64 + Math.sin(5.9) * 22, 64 - Math.cos(5.9) * 22); cx.stroke(); cx.beginPath(); cx.arc(64, 64, 3, 0, 6.3); cx.fill(); });
mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.05, 32), oak, 1.75, 2.42, -D / 2 + 0.05).rotation.x = Math.PI / 2;
var clockFace = mesh(new THREE.CircleGeometry(0.16, 32), new THREE.MeshStandardMaterial({ map: clockTex, roughness: 0.6 }), 1.75, 2.42, -D / 2 + 0.08);
var clockRim=mesh(new THREE.TorusGeometry(0.163,0.008,8,48),detail.material('#8e7954','metal'),1.75,2.42,-D/2+0.085);
mesh(new THREE.CircleGeometry(0.157,40),detail.glass,1.75,2.42,-D/2+0.09);
for(var tick=0;tick<60;tick++){var angle=tick*Math.PI/30;var tm=mesh(new THREE.BoxGeometry(0.001,tick%5?0.003:0.006,0.001),detail.material('#5c5343','metal'),1.75+Math.sin(angle)*0.149,2.42+Math.cos(angle)*0.149,-D/2+0.084);tm.rotation.z=-angle;}
// coat hooks by the door, one coat left behind, a hat above it
var hookZ = 1.55;
for (var hk = 0; hk < 3; hk++) mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 6), brass, W / 2 - 0.05, 1.85, hookZ + hk * 0.25).rotation.z = Math.PI / 2;
var coatMat = new THREE.MeshStandardMaterial({ color: 0x2a2620, roughness: 0.95 });
var coat = mesh(new THREE.BoxGeometry(0.06, 0.9, 0.34), coatMat, W / 2 - 0.09, 1.38, hookZ + 0.25); coat.castShadow = true;
mesh(new THREE.BoxGeometry(0.05, 0.3, 0.16), coatMat, W / 2 - 0.1, 1.55, hookZ + 0.05);
mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.09, 16), coatMat, W / 2 - 0.1, 1.9, hookZ + 0.25).rotation.z = Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.012, 16), coatMat, W / 2 - 0.1, 1.9, hookZ + 0.25).rotation.z = Math.PI / 2;
// beer mats and a bell on the copper
var matTex = textTex(64, 64, function(cx, w, h) { cx.fillStyle = '#d8c8a0'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#7a1e1e'; cx.beginPath(); cx.arc(32, 32, 24, 0, 6.3); cx.fill(); cx.fillStyle = '#e8dcc0'; cx.font = 'bold 9px Georgia,serif'; cx.textAlign = 'center'; cx.fillText('PILLARS', 32, 30); cx.fillText('ALES', 32, 41);cx.strokeStyle='rgba(91,66,31,0.22)';cx.lineWidth=2;cx.beginPath();cx.arc(27,34,21,0,6.3);cx.stroke();for(var f=0;f<230;f++){cx.fillStyle='rgba(238,222,182,0.23)';cx.fillRect(f*47%w,f*71%h,1,1);} });
[[-2.4, 0.2], [-0.2, -0.1], [1.1, 0.25]].forEach(function(mz, i) { var bm2 = mesh(new THREE.PlaneGeometry(0.1, 0.1), new THREE.MeshStandardMaterial({ map: matTex, roughness: 0.95 }), barX + 0.18 + mz[1], 1.133, mz[0], barG); bm2.rotation.x = -Math.PI / 2; bm2.rotation.z = rnd(i) * 1.2; });
mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.06, 16), brass, barX - 0.22, 1.16, barZ1 - 0.2, barG); mesh(new THREE.SphereGeometry(0.012, 8, 6), brass, barX - 0.22, 1.2, barZ1 - 0.2, barG);
detail.arc(barG,0.043,0.0025,brass,barX-0.22,1.131,barZ1-0.2);mesh(new THREE.CylinderGeometry(0.003,0.003,0.012,8),detail.material('#3d372d','metal'),barX-0.22,1.209,barZ1-0.2,barG);

// ---------- THE FIGURES, faint traces ----------
function ghostTex(seed, seated) { return window.dssGhostTex(tex, rnd, seed, seated, false); }
var ghosts = [];
function ghost(x, z, seed, base, seated) {
var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ghostTex(seed, seated), transparent: true, opacity: base, depthWrite: false, blending: THREE.AdditiveBlending }));
sp.scale.set(0.9, 1.8, 1); sp.position.set(x, 0.9, z); scene.add(sp);
var hit = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, seated ? 1.1 : 1.5, 8), new THREE.MeshBasicMaterial({ visible: false }));
hit.position.set(x, seated ? 0.7 : 0.95, z); scene.add(hit);
var g = { sp: sp, hit: hit, base: base, ph: seed * 2.1 }; ghosts.push(g); return g;
}
var ham = ghost(W / 2 - 0.55, -1.0, 0, 0.4, false);     // the man you recognise through the fumes, at the shelf on the right wall by the pillars
var drinker = ghost(barX + 0.62, 0.2, 2, 0.3, true);   // someone at the bar, back turned
var farOne = ghost(0.6, -3.4, 4, 0.18, false);            // a shape under the arch, going or coming

// ---------- LIGHT: brass wall lamps with their shades, the glass overhead, the street through the lattice, smoke ----------
scene.add(new THREE.AmbientLight(0x4a3a24, 0.4));
scene.add(new THREE.HemisphereLight(0x8a7040, 0x0a0806, 0.3));
var glowTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,225,160,0.9)'); g.addColorStop(0.3, 'rgba(255,190,100,0.35)'); g.addColorStop(0.7, 'rgba(220,140,50,0.08)'); g.addColorStop(1, 'rgba(180,100,30,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function glow(x, y, z, sc, op) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: op || 0.6, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, fog: false, toneMapped: false })); sp.scale.set(sc, sc, 1); sp.position.set(x, y, z); scene.add(sp); return sp; }
var shadeMat = new THREE.MeshStandardMaterial({ color: 0xfff0d8, emissive: 0xffd8a0, emissiveIntensity: 0.8, roughness: 0.6, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
var lamps = [], glows = [];
[[W / 2 - 0.12, 2.1, 1.6, -1], [W / 2 - 0.12, 2.1, -0.4, -1], [-W / 2 + 0.12, 2.35, -0.6, 1], [-W / 2 + 0.12, 2.35, 1.0, 1]].forEach(function(lp, i) {
var l = new THREE.PointLight(0xffc880, 1.0, 5.5, 1.6); l.position.set(lp[0] + lp[3] * 0.16, lp[1] - 0.04, lp[2]);
if (i === 0) { l.castShadow = true; l.shadow.mapSize.set(1024, 1024); l.shadow.bias = -0.001; l.shadow.normalBias = 0.02; l.shadow.radius = 3; l.shadow.camera.near = 0.1; l.shadow.camera.far = 8; }
scene.add(l); lamps.push(l);
// bracket out from the wall, the shade a frosted tulip, the bulb inside it
var arm = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 6), brass, lp[0] + lp[3] * 0.1, lp[1] - 0.1, lp[2]); arm.rotation.z = Math.PI / 2;
mesh(new THREE.BoxGeometry(0.04, 0.16, 0.08), brass, lp[0], lp[1] - 0.1, lp[2]);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.1, 6), brass, lp[0] + lp[3] * 0.2, lp[1] - 0.06, lp[2]);
mesh(new THREE.CylinderGeometry(0.075, 0.03, 0.13, 18, 1, true), shadeMat, lp[0] + lp[3] * 0.2, lp[1] + 0.04, lp[2]);
mesh(new THREE.SphereGeometry(0.03, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfff4dc, toneMapped: false }), lp[0] + lp[3] * 0.2, lp[1] + 0.02, lp[2]);
glows.push(glow(lp[0] + lp[3] * 0.22, lp[1] + 0.04, lp[2], 0.9, 0.55));
});
glows.push(glow(0.55, 1.28, -D / 2 + 0.06, 0.7, 0.4));
// contact shadows under the stools and the pillars
var contactTex = tex(64, 64, function(cx, w, h) { var g = cx.createRadialGradient(32, 32, 3, 32, 32, 32); g.addColorStop(0, 'rgba(0,0,0,0.36)'); g.addColorStop(0.45, 'rgba(0,0,0,0.2)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function contact(x, z, s) { var sh = mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false }), x, 0.004, z); sh.rotation.x = -Math.PI / 2; return sh; }
stools.forEach(function(st) { contact(st.position.x, st.position.z, 0.85); });
contact(-0.75, ruinZ, 1.3); contact(1.45, ruinZ, 1.3);
renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true;
// smoke: slow additive sheets between the pillars, and haze under the lamps
var smokeTex = tex(256, 128, function(cx, w, h) { for (var i = 0; i < 26; i++) { var g = cx.createRadialGradient(rnd(i) * w, rnd(i + 1) * h, 0, rnd(i) * w, rnd(i + 1) * h, 20 + rnd(i + 2) * 60); g.addColorStop(0, 'rgba(200,180,140,0.13)'); g.addColorStop(1, 'rgba(200,180,140,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); } });
var smokes = [0, 1].map(function(i) { var sp = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.0), new THREE.MeshBasicMaterial({ map: smokeTex, transparent: true, opacity: 0.42, depthWrite: false, blending: THREE.AdditiveBlending })); sp.position.set(0, 1.6 + i * 0.5, PZ + 0.6 + i * 1.2); scene.add(sp); return sp; });
var hazeTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(208,181,139,0.2)'); g.addColorStop(0.35, 'rgba(171,137,94,0.12)'); g.addColorStop(1, 'rgba(111,82,51,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var haze = [[W / 2 - 0.5, 1.8, 1.6], [W / 2 - 0.5, 1.8, -0.4], [-W / 2 + 0.5, 2.0, -0.6], [-W / 2 + 0.5, 2.0, 1.0]].map(function(p) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTex, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending })); sp.position.set(p[0], p[1], p[2]); sp.scale.set(2.0, 1.5, 1); scene.add(sp); return sp; });
// soft specks in the lamp pools only
var dustTex = tex(32, 32, function(cx, w, h) { var g = cx.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,237,197,0.85)'); g.addColorStop(0.22, 'rgba(255,237,197,0.4)'); g.addColorStop(1, 'rgba(255,237,197,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var moteN = 72, moteBase = new Float32Array(moteN * 3), motePos = new Float32Array(moteN * 3);
for (var mi = 0; mi < moteN; mi++) { var lpp = lamps[mi % 4].position, angle = rnd(mi * 7) * Math.PI * 2, radius = 0.15 + rnd(mi * 11) * 1.0; moteBase[mi * 3] = lpp.x + Math.cos(angle) * radius * 0.6; moteBase[mi * 3 + 1] = 0.6 + rnd(mi + 1) * 2.0; moteBase[mi * 3 + 2] = lpp.z + Math.sin(angle) * radius; }
motePos.set(moteBase);
var moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
scene.add(new THREE.Points(moteGeo, new THREE.PointsMaterial({ map: dustTex, color: 0xe8d8b0, size: 0.018, transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.AdditiveBlending })));

// ---------- THE CLOSE-UPS, AND THE PATHS ----------
var PINK = 'color:#ff3aa8;text-shadow:0 0 4px rgba(255,58,168,0.45);';
function passageLinks(sel) {
var pass = window.dssRoomScope(piHost);
if (!pass) return [];
return Array.prototype.slice.call(pass.querySelectorAll(sel)).filter(function(l) { return !(play && play.card.contains(l)) && (l.classList.contains('dss-claimed') || !!l.closest('.lore-card-only') || l.getClientRects().length > 0); }); /* 2026-10-21: a lore link kept for a card alone (.lore-card-only) is hidden by design, so it counts though it has no box */
}
// the lily, when it is still there to take: the hook's own click-replace does the work
function lilyHook(n) { var pass = window.dssRoomScope(piHost); if (!pass) return []; var h = pass.querySelector('tw-hook[name="lily' + n + '"]'); return (h && h.querySelector('svg') && !h.querySelector('.lily-glimpse') && (h.classList.contains('dss-claimed') || h.getClientRects().length > 0)) ? [h] : []; }
function byText(texts) { return passageLinks('tw-link').filter(function(l) { return texts.indexOf(l.textContent.trim()) >= 0; }); }
var HOTSPOTS = [
{ root: barG, name: 'A bar', pos: [-0.5, 1.4, 0.9], tgt: [barX, 1.15, -0.9], haloAt: [barX, 1.15, -0.5], haloSc: 1.4,
actions: function() { return byText(['Get a drink at the bar']); } },
{ root: ham.hit, name: 'A man through the fumes', pos: [0.75, 1.45, 1.0], tgt: [W / 2 - 0.55, 1.25, -1.0], haloAt: [W / 2 - 1.0, 0.98, -0.9], haloSc: 0.6, figure: true,
actions: function() { return byText(['Talk to the Great Ham', '⟡ LORE: The Great Ham ⟡', 'LORE: The Great Ham']); } },
{ root: pillarHit, name: 'The Third Pillar', pos: [0.15, 1.5, 0.4], tgt: [0, 1.45, PZ], haloAt: [0, 1.5, PZ + 0.36], haloSc: 1.3,
actions: function() { return byText(['Step into the third blue post', 'Perform the synthesis']); },
onLook: function(on) { pillarLight.intensity = on ? 0.9 : 0; } },
{ root: doorHit, name: 'A threshold', label: 'WAY OUT', pos: [0.6, 1.35, 1.9], tgt: [W / 2 - 0.4, 0.9, 0.6], haloAt: [W / 2 - 0.3, 1.0, 0.6], haloSc: 0.9,
actions: function() { var a = byText(['Back to the street']); return a.length ? a : window.dssStreetExit(); } }, /* 2026-10-20: the header's way out when the page has none of its own */
{ root: phoneHit, name: 'A telephone', pos: [-0.9, 1.55, 1.2], tgt: [-W / 2 + 0.2, 1.45, barZ1 - 0.3], haloSc: 0.5,
actions: function() { return passageLinks('.phone-ringing tw-link'); },
prose: function() { var d = passageLinks('.phone-ringing')[0]; if (!d) return ''; var c = d.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('tw-link'), function(l) { l.parentNode.removeChild(l); }); return c.textContent.replace(/\s+/g, ' ').trim(); } },
{ root: winG, name: 'A lattice window', pos: [-0.4, 1.85, -1.1], tgt: [-1.35, 2.3, -D / 2], haloAt: [-1.35, 2.3, -D / 2 + 0.1], haloSc: 1.6,
actions: function() { /* 2026-10-16 (Sam, from Astra's playtest): 'Not tonight.' on the window's card read as turning the window down. 2026-10-19 (Sam, playtest): the lily sits in this window, in front of the camera, where the STATS slip can't cover it; the door carries Back to the street */ return lilyHook(2); } }
];
// ---------- the hover, the card, the resting glow, the reveal and the words: shared with every room (window.dssRoomPlay) ----------
if (!pillarThere) HOTSPOTS = HOTSPOTS.filter(function(h) { return h.root !== pillarHit; });
var play = window.dssRoomPlay({ wrap: piWrap, canvas: piCanvas, host: piHost, scene: scene, camera: camera, CAM: CAM, HOTSPOTS: HOTSPOTS, tex: tex, still: piStill,
card: { fg: 'rgba(226,206,176,0.92)', bg: 'rgba(8,6,5,0.8)', border: 'rgba(190,130,90,0.32)', dim: 'rgba(200,180,150,0.5)', btn: 'rgba(240,210,170,0.95)', btnBorder: 'rgba(190,130,90,0.45)' }, hint: 'LOOK CLOSER AT WHAT CATCHES YOUR EYE', state: function() { return { active: piActive, animId: piAnimId }; } });
var words = play.words, halo = play.halo, curTarget = play.curTarget;

// ---------- FRAMES ----------
var clock = new THREE.Clock();
function piAnimate() {
piAnimId = requestAnimationFrame(piAnimate);
// a throw in the frame ends the room, not the night (dssSceneFailed)
try { piFrame(); } catch (err) { cancelAnimationFrame(piAnimId); piAnimId = null; if (window.dssSceneFailed) window.dssSceneFailed(err, 'pi'); else throw err; }
}
function piFrame() {
var dt = Math.min(0.1, clock.getDelta());
var t = piStill ? 0 : clock.getElapsedTime();
play.frame(t, dt);
if (!piStill) {
for (var gi = 0; gi < ghosts.length; gi++) { var g = ghosts[gi]; g.sp.material.opacity = g.base * (0.7 + 0.3 * Math.sin(t * 0.23 + g.ph)); }
for (var li = 0; li < lamps.length; li++) { var br = 0.035 * Math.sin(t * (0.6 + li * 0.13) + li) + 0.018 * Math.sin(t * 0.19 + li * 2); lamps[li].intensity = 1.0 + br; glows[li].material.opacity = 0.55 + br * 0.6; haze[li].material.opacity = 0.12 + br * 0.2; }
smokes[0].position.x = Math.sin(t * 0.07) * 0.4; smokes[1].position.x = Math.cos(t * 0.05) * 0.5; smokes[0].material.opacity = 0.38 + 0.07 * Math.sin(t * 0.21); smokes[1].material.opacity = 0.38 + 0.07 * Math.cos(t * 0.17);
rainTex.offset.y = -(t * 0.55) % 1; streetLamp.intensity = 0.5 + 0.03 * Math.sin(t * 2.3) + 0.02 * Math.sin(t * 5.1);
for (var m = 0; m < moteN; m++) { motePos[m * 3] = moteBase[m * 3] + Math.sin(t * 0.15 + m) * 0.06; motePos[m * 3 + 1] = 0.6 + ((moteBase[m * 3 + 1] - 0.6 + (m % 2 ? 1 : -1) * t * 0.035) % 2.0 + 2.0) % 2.0; }
moteGeo.attributes.position.needsUpdate = true;
}
play.withGlowsHidden(function() { for (var mr = 0; mr < mirrors.length; mr++) mirrors[mr].update(curTarget, t); });
if (composer) composer.render(); else renderer.render(scene, camera);
}
piAnimate();
}

// 2026-10-12 (the Pillars audit): a pub that links to itself ("Back to the bar" after "I'm not here") swaps in a fresh
// container inside one tick, so the room never rebuilt and the screen stayed blank; a new container now rebuilds it,
// as the Coach's watcher already does
var piSeenHost = null;
setInterval(function() {
var container = document.getElementById('pi-container');
if (container && piActive && piSeenHost && container !== piSeenHost) {
piActive = false;
if (piAnimId) { cancelAnimationFrame(piAnimId); piAnimId = null; }
window._dssDisposeWrap('pi-wrap');
}
if (container && !piActive) {
piSeenHost = container;
initPillarsInside();
} else if (!container) {
piActive = false;
if (piAnimId) { cancelAnimationFrame(piAnimId); piAnimId = null; }
window._dssDisposeWrap('pi-wrap');
}
}, 300);
})();

