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

// ====== INSIDE THE COLONY — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-26. The second "look closer" room, after the French. Built
// from what is written of the Colony Room Club at 41 Dean Street: one
// small first-floor room painted a bilious green, its walls crowded
// with pictures, a small bar, bamboo furniture, an upright piano, a
// window onto the street. The room sits at the top of The Colony Room
// passage (#ci-container) and is its navigation: the man at the bar,
// the agent at his table and the telephone open the passage's own
// links when the passage has rendered them; the bar opens the drink
// when it is offered. The pictures, the piano and the window are
// inspections, their card words pink placeholders for Sam. Nothing
// about the game is decided in JS: the room only finds the passage's
// links by their wording and clicks them.
(function() {
var ciActive = false;
var ciAnimId = null;

function initColonyInside() {
if (ciActive) return;
ciActive = true;
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(buildCIScene) : buildCIScene()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(buildCIScene) : buildCIScene());
}
}

function buildCIScene() {
var ciStill = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var ciHost = document.getElementById('ci-container');
if (!ciHost) { ciActive = false; return; }
var ciWrap = document.createElement('div');
ciWrap.id = 'ci-wrap';
function ciSize() {
var w = Math.max(280, document.documentElement.clientWidth || window.innerWidth);
var vh = window.innerHeight || 800;
// the room fills the window below its top edge: the passage's words sit inside it now, nothing follows underneath
var top = 0, el = ciHost; while (el) { top += el.offsetTop; el = el.offsetParent; }
// and the page's own padding under it, so the room ends where the page ends
var pad = 0; el = ciHost; while (el && el !== document.body) { var cs = getComputedStyle(el); pad += (parseFloat(cs.paddingBottom) || 0) + (parseFloat(cs.marginBottom) || 0); el = el.parentNode; }
var h = Math.round(Math.max(360, vh - top - pad - 2));
return { w: w, h: h };
}
var ciSz = ciSize();
ciWrap.style.cssText = 'position:relative;width:100vw;margin-left:calc(50% - 50vw);height:' + ciSz.h + 'px;z-index:0;isolation:isolate;background:#070905;overflow:hidden;';
var ciCanvas = document.createElement('canvas');
ciCanvas.width = ciSz.w; ciCanvas.height = ciSz.h;
ciCanvas.style.cssText = 'display:block;position:absolute;top:0;left:0;width:100%;height:100%;touch-action:none;';
ciWrap.appendChild(ciCanvas);
var ciWash = document.createElement('div');
ciWash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9000;background:linear-gradient(180deg,rgba(10,18,6,0.3) 0%,rgba(6,10,4,0.05) 35%,rgba(6,10,4,0.05) 60%,rgba(3,5,2,0.45) 100%);';
ciWrap.appendChild(ciWash);
var ciVig = document.createElement('div');
ciVig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:radial-gradient(ellipse at 50% 44%,transparent 24%,rgba(0,0,0,0.74) 100%);';
ciWrap.appendChild(ciVig);
var ciGrain = document.createElement('div');
ciGrain.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9002;opacity:0.06;mix-blend-mode:overlay;background:url(' + (window.dssGetGrainURL ? window.dssGetGrainURL() : '') + ');';
ciWrap.appendChild(ciGrain);
var ciLoc = document.createElement('div');
ciLoc.classList.add('dss-room-caption');
ciLoc.textContent = 'THE COLONY ROOM, DEAN STREET';
ciLoc.style.cssText = 'position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font:12px \'Courier New\',monospace;color:rgba(190,200,140,0.25);letter-spacing:3px;white-space:nowrap;z-index:9003;pointer-events:none;';
ciWrap.appendChild(ciLoc);
ciHost.appendChild(ciWrap);
ciSz = ciSize(); ciWrap.style.height = ciSz.h + 'px';
// once the passage has settled (its fade-in moves it), size the room again
setTimeout(function() { var r = window._dssThreeRegistry && window._dssThreeRegistry['ci-wrap']; if (r && r.resize) r.resize(); }, 1600);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x070905);
scene.fog = new THREE.FogExp2(0x0c1208, 0.07);
var aspect = ciSz.w / ciSz.h;
var portrait = aspect < 1.4;
var camera = new THREE.PerspectiveCamera(portrait ? 80 : 54, aspect, 0.05, 40);
// from just inside the door at the front left, looking across the room to the bar and the piano
var CAM = portrait ? { x: -1.6, y: 1.5, z: 1.9, tx: 0.25, ty: 1.1, tz: -0.9 } : { x: -1.55, y: 1.5, z: 1.75, tx: 0.3, ty: 1.15, tz: -0.9 };
camera.position.set(CAM.x, CAM.y, CAM.z);

var renderer = new THREE.WebGLRenderer({ canvas: ciCanvas, antialias: true });
renderer.setSize(ciSz.w, ciSz.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, ciSz.w < 600 ? 1.25 : 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.66;
window._dssBindScene('ci-wrap', scene, renderer, camera);
var origResize = window._dssThreeRegistry['ci-wrap'].resize;
window._dssThreeRegistry['ci-wrap'].resize = function() {
ciSz = ciSize(); ciWrap.style.height = ciSz.h + 'px';
camera.aspect = ciSz.w / ciSz.h;
camera.fov = camera.aspect < 1.4 ? 80 : 54;
camera.updateProjectionMatrix();
renderer.setSize(ciSz.w, ciSz.h);
};
window.removeEventListener('resize', origResize);
window.addEventListener('resize', window._dssThreeRegistry['ci-wrap'].resize);
// The outside scenes' bloom and grade, at the room's own size.
var composer = window.dssMakeComposer ? window.dssMakeComposer(scene, camera, renderer, { bloomStrength: 0.3, bloomRadius: 0.55, bloomThreshold: 0.72 }) : null;
if (composer) { composer.setSize(ciSz.w, ciSz.h); var ciResize = window._dssThreeRegistry['ci-wrap'].resize; window._dssThreeRegistry['ci-wrap'].resize = function() { ciResize(); composer.setSize(ciSz.w, ciSz.h); }; window.removeEventListener('resize', ciResize); window.addEventListener('resize', window._dssThreeRegistry['ci-wrap'].resize); }

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
return tex(512, 512, function(cx, w, h) {
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
});
}
function paintTex(base, seed, warm) {
return tex(512, 512, function(cx, w, h) {
cx.fillStyle = base; cx.fillRect(0, 0, w, h);
for (var n = 0; n < 28; n++) {
var x = rnd(n + seed) * w, y = rnd(n * 3 + seed) * h, r = 30 + rnd(n * 7) * 130;
var g = cx.createRadialGradient(x, y, 0, x, y, r);
g.addColorStop(0, n % 3 ? 'rgba(20,12,4,0.15)' : (warm || 'rgba(150,110,50,0.1)')); g.addColorStop(1, 'rgba(60,32,8,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
}
var soot = cx.createLinearGradient(0, 0, 0, h); soot.addColorStop(0, 'rgba(18,10,4,0.3)'); soot.addColorStop(0.3, 'rgba(38,20,6,0)'); soot.addColorStop(1, 'rgba(18,10,4,0.14)'); cx.fillStyle = soot; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 9000; i++) { cx.fillStyle = i % 2 ? 'rgba(20,12,4,0.05)' : 'rgba(200,180,140,0.04)'; cx.fillRect(rnd(i + seed) * w, rnd(i * 3 + seed) * h, 1, 1); }
});
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

// ---------- THE ROOM: 5 by 4, ceiling low ----------
var W = 5.2, D = 4.2, H = 2.55;
// the bilious green, "less salad than submarine": a murky green under yellowed varnish, uneven, nicotine at the top
var wallGrain = paintTex('#3b5a2b', 17, 'rgba(150,140,50,0.14)');
var wallMat = new THREE.MeshStandardMaterial({ map: wallGrain, bumpMap: wallGrain, bumpScale: 0.012, roughness: 0.9, envMap: roomEnv, envMapIntensity: 0.08 });
var ceilMat = new THREE.MeshStandardMaterial({ map: paintTex('#8a7a44', 25, 'rgba(200,170,60,0.14)'), roughness: 0.96 });
var carpetPile = tex(512, 512, function(cx, w, h) {
cx.fillStyle = '#2c2818'; cx.fillRect(0, 0, w, h);
cx.strokeStyle = 'rgba(140,110,50,0.14)'; cx.lineWidth = 2;
for (var y = 0; y < h; y += 64) for (var x = 0; x < w; x += 64) { cx.beginPath(); cx.moveTo(x + 32, y); cx.lineTo(x + 64, y + 32); cx.lineTo(x + 32, y + 64); cx.lineTo(x, y + 32); cx.closePath(); cx.stroke(); }
for (var n = 0; n < 18; n++) { var x = rnd(n) * w, y = rnd(n + 9) * h, g = cx.createRadialGradient(x, y, 0, x, y, 75); g.addColorStop(0, n % 2 ? 'rgba(120,100,60,0.14)' : 'rgba(10,8,4,0.3)'); g.addColorStop(1, 'rgba(120,100,60,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); }
for (var i = 0; i < 42000; i++) { cx.fillStyle = i % 3 ? 'rgba(12,10,6,0.24)' : 'rgba(150,130,80,0.18)'; cx.fillRect(rnd(i) * w, rnd(i + 4) * h, 0.6, 1.5 + rnd(i + 7) * 2); }
});
carpetPile.wrapS = carpetPile.wrapT = THREE.RepeatWrapping; carpetPile.repeat.set(3.5, 3);
var carpetMat = new THREE.MeshStandardMaterial({ map: carpetPile, bumpMap: carpetPile, bumpScale: 0.018, roughness: 1 });
var floor = mesh(new THREE.PlaneGeometry(W, D), carpetMat, 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
var ceil = mesh(new THREE.PlaneGeometry(W, D), ceilMat, 0, H, 0); ceil.rotation.x = Math.PI / 2;
var back = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2); back.receiveShadow = true;
var front = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, D / 2); front.rotation.y = Math.PI;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -W / 2, H / 2, 0); left.rotation.y = Math.PI / 2; left.receiveShadow = true;
var right = mesh(new THREE.PlaneGeometry(D, H), wallMat, W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2; right.receiveShadow = true;
// dado, skirting and a cornice, dark varnished
var woodMat = darkWood;
[[0, -D / 2 + 0.02, W, 0], [0, D / 2 - 0.02, W, Math.PI], [-W / 2 + 0.02, 0, D, Math.PI / 2], [W / 2 - 0.02, 0, D, -Math.PI / 2]].forEach(function(s) {
var sk = mesh(new THREE.BoxGeometry(s[2], 0.14, 0.035), woodMat, s[0], 0.07, s[1]); sk.rotation.y = s[3];
var dd = mesh(new THREE.BoxGeometry(s[2], 0.05, 0.04), oak, s[0], 0.95, s[1]); dd.rotation.y = s[3];
var cn = mesh(new THREE.BoxGeometry(s[2], 0.06, 0.08), new THREE.MeshStandardMaterial({ color: 0x5a5030, roughness: 0.9 }), s[0], H - 0.03, s[1]); cn.rotation.y = s[3];
});
// the door out, on the left wall near the front: the foul staircase is behind it
var doorG = new THREE.Group(); doorG.position.set(-W / 2 + 0.03, 0, 1.3); doorG.rotation.y = Math.PI / 2; scene.add(doorG);
mesh(new THREE.BoxGeometry(0.86, 2.0, 0.06), darkWood, 0, 1.0, 0, doorG);
mesh(new THREE.BoxGeometry(0.98, 0.09, 0.1), oak, 0, 2.04, 0, doorG); mesh(new THREE.BoxGeometry(0.07, 2.1, 0.1), oak, -0.49, 1.05, 0, doorG); mesh(new THREE.BoxGeometry(0.07, 2.1, 0.1), oak, 0.49, 1.05, 0, doorG);
mesh(new THREE.BoxGeometry(0.3, 0.7, 0.02), oak, -0.19, 1.45, 0.035, doorG); mesh(new THREE.BoxGeometry(0.3, 0.7, 0.02), oak, 0.19, 1.45, 0.035, doorG); mesh(new THREE.BoxGeometry(0.3, 0.6, 0.02), oak, -0.19, 0.5, 0.035, doorG); mesh(new THREE.BoxGeometry(0.3, 0.6, 0.02), oak, 0.19, 0.5, 0.035, doorG);
mesh(new THREE.SphereGeometry(0.03, 10, 8), brass, 0.34, 1.0, 0.06, doorG);
var membersTex = tex(256, 128, function(cx, w, h) { cx.fillStyle = '#e4d8b8'; cx.fillRect(0, 0, w, h); cx.strokeStyle = '#2a1a10'; cx.lineWidth = 3; cx.strokeRect(8, 8, w - 16, h - 16); cx.fillStyle = '#2a1a10'; cx.textAlign = 'center'; cx.font = 'bold 30px Georgia,serif'; cx.fillText('MEMBERS ONLY', w / 2, 56); cx.font = 'italic 17px Georgia,serif'; cx.fillText('and their guests, at her discretion', w / 2, 92); });
mesh(new THREE.PlaneGeometry(0.34, 0.17), new THREE.MeshStandardMaterial({ map: membersTex, roughness: 0.9 }), 0, 1.72, 0.045, doorG);

// ---------- THE PICTURES, crowding every wall ----------
var picG = new THREE.Group(); scene.add(picG);
var giltFrame = new THREE.MeshStandardMaterial({ color: 0xb99a50, roughness: 0.35, metalness: 0.7, envMap: roomEnv, envMapIntensity: 0.6 });
var frameMats = [giltFrame, new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.5, envMap: roomEnv, envMapIntensity: 0.2 }), oak];
// A sitter, drawn the way the French's photographs are: a coat, a collar, a lit cheek and the grain of the print.
function sitter(cx, px, py, scale, k, tone) {
cx.save(); cx.translate(px, py); cx.scale(scale, scale);
var coat = cx.createLinearGradient(-70, 0, 70, 140); coat.addColorStop(0, tone ? '#1a1612' : '#171c19'); coat.addColorStop(0.65, k % 2 ? '#4c4d44' : '#373b35'); coat.addColorStop(1, '#222822');
cx.fillStyle = coat; cx.beginPath(); cx.moveTo(-88, 185); cx.quadraticCurveTo(-95, 75, -35, 60); cx.lineTo(-17, 43); cx.lineTo(20, 41); cx.lineTo(36, 59); cx.quadraticCurveTo(88, 72, 91, 185); cx.closePath(); cx.fill();
cx.fillStyle = '#aea998'; cx.beginPath(); cx.moveTo(-18, 48); cx.lineTo(2, 106); cx.lineTo(23, 49); cx.lineTo(0, 62); cx.closePath(); cx.fill();
var face = cx.createRadialGradient(-12, -8, 1, 0, 7, 54); face.addColorStop(0, tone ? '#d8c0a0' : '#c9c4af'); face.addColorStop(0.45, tone ? '#a88868' : '#9b9b89'); face.addColorStop(1, '#494f43');
cx.fillStyle = face; cx.beginPath(); cx.moveTo(-31, -7); cx.bezierCurveTo(-37, -51, 36, -52, 33, -9); cx.lineTo(29, 28); cx.quadraticCurveTo(19, 54, 0, 50); cx.quadraticCurveTo(-28, 45, -30, 22); cx.closePath(); cx.fill();
cx.fillStyle = k % 3 === 0 ? '#76796a' : '#343c32'; cx.beginPath(); cx.moveTo(-31, 1); cx.quadraticCurveTo(-46, -52, 7, -43); cx.quadraticCurveTo(42, -44, 34, -1); cx.lineTo(24, -22); cx.quadraticCurveTo(4, -13, -15, -27); cx.lineTo(-24, -10); cx.closePath(); cx.fill();
cx.strokeStyle = 'rgba(27,35,29,0.65)'; cx.lineWidth = 2.4; cx.beginPath(); cx.moveTo(-22, 3); cx.lineTo(-8, 1); cx.moveTo(9, 2); cx.lineTo(23, 5); cx.moveTo(1, 5); cx.lineTo(-3, 24); cx.lineTo(7, 26); cx.moveTo(-9, 36); cx.quadraticCurveTo(1, 39, 13, 34); cx.stroke();
cx.fillStyle = 'rgba(23,28,23,0.6)'; cx.fillRect(-17, 7, 5, 3); cx.fillRect(14, 8, 4, 3);
if (k % 4 === 1) { cx.lineWidth = 1.5; cx.strokeRect(-24, 0, 19, 15); cx.strokeRect(8, 1, 18, 15); }
if (k % 5 === 2) { cx.fillStyle = 'rgba(30,25,20,0.8)'; cx.beginPath(); cx.moveTo(-36, -18); cx.quadraticCurveTo(0, -30, 38, -20); cx.lineTo(28, -26); cx.lineTo(24, -44); cx.quadraticCurveTo(0, -50, -22, -42); cx.lineTo(-28, -24); cx.closePath(); cx.fill(); }
cx.restore();
}
function pictureTex(seed) {
return tex(192, 192, function(cx, w, h) {
var kind = rnd(seed + 0.5);
if (kind < 0.32) { // a photograph, the sitter half in shadow
var g = cx.createLinearGradient(0, 0, w, h); g.addColorStop(0, ['#777369', '#6b665d', '#838074'][seed % 3]); g.addColorStop(1, '#24251f'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
cx.fillStyle = 'rgba(18,19,16,0.22)'; if (seed % 2) { for (var c = 0; c < 6; c++) cx.fillRect(c * 34, 0, 11, h); } else { cx.fillRect(10, 0, 7, h); cx.fillRect(w - 28, 0, 10, h); }
if (seed % 4 === 0) { sitter(cx, 60, 84, 0.55, seed); sitter(cx, 128, 92, 0.6, seed + 1); } else sitter(cx, 96, 80, 0.72, seed);
for (var i = 0; i < 9000; i++) { cx.fillStyle = i % 2 ? 'rgba(225,221,193,0.07)' : 'rgba(5,14,8,0.075)'; cx.fillRect(rnd(seed + i * 7) * w, rnd(seed + i * 11) * h, 1, 1); }
} else if (kind < 0.66) { // a painting: a figure or a face in thick strokes, the daubs of the room's painters
var cols = [['#8a2a1a', '#c8a030', '#2a4a7a', '#d8c8a0'], ['#1a1a1a', '#b05a6a', '#e8d8b0', '#5a7a2a'], ['#2a2a4a', '#d89a30', '#8a3a2a', '#c0c0b0']][seed % 3];
cx.fillStyle = cols[0]; cx.fillRect(0, 0, w, h);
for (var s = 0; s < 70; s++) { cx.strokeStyle = cols[(s + seed) % 4]; cx.globalAlpha = 0.5 + rnd(seed + s) * 0.5; cx.lineWidth = 5 + rnd(s * 3 + seed) * 14; cx.beginPath(); var x0 = rnd(seed + s * 5) * w, y0 = rnd(seed + s * 7) * h; cx.moveTo(x0, y0); cx.quadraticCurveTo(x0 + (rnd(s) - 0.5) * 60, y0 + (rnd(s + 1) - 0.5) * 60, x0 + (rnd(s + 2) - 0.5) * 70, y0 + (rnd(s + 3) - 0.5) * 70); cx.stroke(); }
cx.globalAlpha = 1;
if (seed % 2) { // a face, roughly
cx.fillStyle = cols[3]; cx.beginPath(); cx.ellipse(w * 0.5, h * 0.42, 34, 44, 0.1, 0, 6.3); cx.fill(); cx.fillStyle = cols[0]; cx.beginPath(); cx.arc(w * 0.42, h * 0.38, 5, 0, 6.3); cx.arc(w * 0.6, h * 0.37, 5, 0, 6.3); cx.fill(); cx.strokeStyle = cols[2]; cx.lineWidth = 6; cx.beginPath(); cx.moveTo(w * 0.42, h * 0.58); cx.quadraticCurveTo(w * 0.5, h * 0.66, w * 0.6, h * 0.57); cx.stroke();
} else { // a nude or a figure, a long stroke
cx.strokeStyle = cols[3]; cx.lineWidth = 18; cx.beginPath(); cx.moveTo(w * 0.35, h * 0.2); cx.quadraticCurveTo(w * 0.7, h * 0.4, w * 0.4, h * 0.65); cx.quadraticCurveTo(w * 0.3, h * 0.85, w * 0.65, h * 0.92); cx.stroke();
}
for (var i = 0; i < 2000; i++) { cx.fillStyle = 'rgba(255,255,255,' + rnd(i + seed) * 0.05 + ')'; cx.fillRect(rnd(i) * w, rnd(i + 3) * h, 2, 1); }
} else { // a drawing on paper: a head in pen, a few lines
cx.fillStyle = '#d8ccb0'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 3000; i++) { cx.fillStyle = 'rgba(90,70,40,0.05)'; cx.fillRect(rnd(seed + i) * w, rnd(seed + i * 3) * h, 1, 1); }
cx.strokeStyle = 'rgba(30,20,10,0.8)'; cx.lineWidth = 1.4; cx.save(); cx.translate(96, 90); cx.rotate((rnd(seed) - 0.5) * 0.3);
cx.beginPath(); cx.moveTo(-30, -10); cx.bezierCurveTo(-36, -50, 36, -52, 32, -8); cx.quadraticCurveTo(38, 10, 24, 34); cx.quadraticCurveTo(8, 56, -10, 48); cx.quadraticCurveTo(-30, 36, -30, -10); cx.stroke();
cx.beginPath(); cx.moveTo(-20, -2); cx.lineTo(-6, -4); cx.moveTo(8, -4); cx.lineTo(22, -2); cx.moveTo(2, 0); cx.lineTo(-2, 18); cx.lineTo(8, 20); cx.moveTo(-10, 32); cx.quadraticCurveTo(2, 36, 14, 30); cx.stroke();
cx.globalAlpha = 0.4; for (var n = 0; n < 12; n++) { cx.beginPath(); cx.moveTo(-28 + n * 2, 10 + n); cx.lineTo(-18 + n * 2, 6 + n); cx.stroke(); } cx.globalAlpha = 1;
for (var n = 0; n < 24; n++) { var xx = -32 + n * 2.6, yy = -18 - Math.sqrt(Math.max(0, 900 - xx * xx)) * 0.5; cx.beginPath(); cx.moveTo(xx, yy + 6); cx.quadraticCurveTo(xx - 5, yy - 8, xx + 6, yy - 6); cx.stroke(); }
cx.restore();
cx.font = 'italic 10px Georgia,serif'; cx.fillStyle = 'rgba(60,40,20,0.7)'; cx.fillText(['for Muriel', 'Colony, Tues.', 'after closing'][seed % 3], 96, 176);
}
var g2 = cx.createLinearGradient(0, 0, w, h); g2.addColorStop(0, 'rgba(255,240,200,0.12)'); g2.addColorStop(1, 'rgba(0,0,0,0.28)'); cx.fillStyle = g2; cx.fillRect(0, 0, w, h);
});
}
var picN = 0;
function hang(x, y, z, ry, w, h, seed) {
var g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; picG.add(g);
var fm = frameMats[(seed * 5 | 0) % 3];
mesh(new THREE.BoxGeometry(w + 0.07, h + 0.07, 0.035), fm, 0, 0, 0.017, g);
mesh(new THREE.BoxGeometry(w + 0.02, h + 0.02, 0.01), new THREE.MeshStandardMaterial({ color: 0xd8cfb4, roughness: 0.9 }), 0, 0, 0.036, g);
mesh(new THREE.PlaneGeometry(w - 0.03, h - 0.03), new THREE.MeshStandardMaterial({ map: pictureTex(seed), roughness: 0.75, envMap: roomEnv, envMapIntensity: 0.15 }), 0, 0, 0.042, g);
g.rotation.z = (rnd(seed + 99) - 0.5) * 0.06;
picN++;
}
var wallsToHang = [
{ x0: -W / 2 + 0.3, x1: W / 2 - 0.3, z: -D / 2 + 0.005, ry: 0, axis: 'x' },
{ x0: -D / 2 + 0.3, x1: D / 2 - 0.9, z: W / 2 - 0.005, ry: -Math.PI / 2, axis: 'z' },
{ x0: -W / 2 + 0.3, x1: W / 2 - 1.5, z: D / 2 - 0.005, ry: Math.PI, axis: 'x' },
{ x0: -D / 2 + 0.3, x1: D / 2 - 1.6, z: -W / 2 + 0.005, ry: Math.PI / 2, axis: 'z' }
];
// 2026-10-23 (Sam: "Probably the Colony is the best shout"): his Christ Church Commem. Ball print, toned after the
// Overlook photograph in The Shining (colony-ball-photo.jpg, beside the html), hangs in a gilt frame above the piano
// on the right wall. The crowd of pictures leaves its patch bare; it is its own close-up, not one of the Pictures.
var BALL = { z: -0.86, y: 1.8, w: 0.62, h: 0.368 }; /* along from the piano's candle, which yellowed its sky */
function ballPatch(z0, z1, y0, y1) { return z1 > BALL.z - BALL.w / 2 - 0.1 && z0 < BALL.z + BALL.w / 2 + 0.1 && y1 > BALL.y - BALL.h / 2 - 0.1 && y0 < BALL.y + BALL.h / 2 + 0.1; }
var seedP = 3;
wallsToHang.forEach(function(wd, wi) {
var u = wd.x0;
while (u < wd.x1) {
var col = (rnd(seedP) * 3 | 0) + 2, cw = 0.22 + rnd(seedP + 1) * 0.3;
var y = 1.25;
for (var r = 0; r < col; r++) {
var ch = 0.18 + rnd(seedP + r + 2) * 0.28;
if (y + ch / 2 > H - 0.15) break;
if (wd.axis === 'x') hang(u + cw / 2, y + ch / 2, wd.z, wd.ry, cw, ch, seedP + r);
else if (!(wi === 1 && ballPatch(u, u + cw, y, y + ch))) hang(wd.z, y + ch / 2, (wd.ry > 0 ? -1 : 1) * (u + cw / 2), wd.ry, cw, ch, seedP + r);
y += ch + 0.07 + rnd(seedP + r + 5) * 0.06;
}
u += cw + 0.06 + rnd(seedP + 9) * 0.08; seedP += 4;
}
});
// the print: the plain grey of its mount shows until the photograph loads, or if it never does; a brass picture
// lamp over it, dark until the camera comes to look, then the print warms up under it (ballOn, eased in ciFrame)
var ballG = new THREE.Group(); ballG.position.set(W / 2 - 0.005, BALL.y, BALL.z); ballG.rotation.y = -Math.PI / 2; scene.add(ballG);
mesh(new THREE.BoxGeometry(BALL.w + 0.07, BALL.h + 0.07, 0.035), giltFrame, 0, 0, 0.017, ballG);
var ballMat = new THREE.MeshStandardMaterial({ color: 0xa4a4a4, roughness: 0.92, emissive: 0x000000, emissiveIntensity: 0 }); /* matte, so the pendant does not glare across the trees */
mesh(new THREE.PlaneGeometry(BALL.w, BALL.h), ballMat, 0, 0, 0.036, ballG);
new THREE.TextureLoader().load('colony-ball-photo.jpg?v=1', function(t) { ballMat.map = t; ballMat.emissiveMap = t; ballMat.color.setHex(0xffffff); ballMat.emissive.setHex(0xffffff); ballMat.needsUpdate = true; });
mesh(new THREE.BoxGeometry(0.03, 0.03, 0.13), giltFrame, 0, BALL.h / 2 + 0.1, 0.065, ballG);
var ballShade = mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.36, 14), giltFrame, 0, BALL.h / 2 + 0.09, 0.13, ballG); ballShade.rotation.z = Math.PI / 2;
var ballGlow = null, ballOn = false, ballLook = 0; /* the lamp's glow is made under LIGHT, once glowTex exists */

// ---------- THE BAR, small, bamboo-fronted, along the back wall on the left ----------
var barG = new THREE.Group(); scene.add(barG);
var bamboo = tex(256, 256, function(cx, w, h) {
cx.fillStyle = '#b89a58'; cx.fillRect(0, 0, w, h);
for (var i = 0; i < 12; i++) {
var x = i * 21.5, g = cx.createLinearGradient(x, 0, x + 20, 0); g.addColorStop(0, '#8a6c34'); g.addColorStop(0.3, i % 2 ? '#d4b874' : '#c4a660'); g.addColorStop(0.55, '#e0c88a'); g.addColorStop(1, '#8a6c34'); cx.fillStyle = g; cx.fillRect(x, 0, 20, h);
cx.fillStyle = 'rgba(70,45,15,0.75)'; for (var y = 12 + rnd(i) * 30; y < h; y += 44 + rnd(i + y) * 26) { cx.fillRect(x, y, 20, 3); cx.fillStyle = 'rgba(240,220,160,0.4)'; cx.fillRect(x, y + 3, 20, 1); cx.fillStyle = 'rgba(70,45,15,0.75)'; }
cx.fillStyle = 'rgba(0,0,0,0.35)'; cx.fillRect(x + 20, 0, 1.5, h);
for (var s = 0; s < 40; s++) { cx.fillStyle = 'rgba(60,40,10,' + rnd(s + i) * 0.2 + ')'; cx.fillRect(x + rnd(s * 3 + i) * 20, rnd(s * 5 + i) * h, 1, 4 + rnd(s) * 12); }
}
});
bamboo.wrapS = bamboo.wrapT = THREE.RepeatWrapping; bamboo.repeat.set(3, 1);
var bambooMat = new THREE.MeshStandardMaterial({ map: bamboo, bumpMap: bamboo, bumpScale: 0.006, roughness: 0.55, envMap: roomEnv, envMapIntensity: 0.3 });
var counterMat = new THREE.MeshStandardMaterial({ map: grainB, bumpMap: grainB, bumpScale: 0.002, roughness: 0.32, metalness: 0.06, envMap: roomEnv, envMapIntensity: 0.65 });
var barX0 = -W / 2, barX1 = -0.55, barZ = -D / 2 + 0.7, barLen = barX1 - barX0, barMidX = (barX0 + barX1) / 2;
var body = mesh(new THREE.BoxGeometry(barLen, 1.05, 0.55), bambooMat, barMidX, 0.525, barZ, barG); body.castShadow = true; body.receiveShadow = true;
mesh(new THREE.BoxGeometry(barLen, 0.05, 0.57), darkWood, barMidX, 0.025, barZ, barG); mesh(new THREE.BoxGeometry(barLen, 0.04, 0.58), darkWood, barMidX, 1.03, barZ, barG);
var top = mesh(new THREE.BoxGeometry(barLen + 0.08, 0.05, 0.66), counterMat, barMidX, 1.075, barZ, barG); top.receiveShadow = true; top.castShadow = true;
mesh(new THREE.BoxGeometry(barLen + 0.08, 0.05, 0.03), brass, barMidX, 1.075, barZ + 0.33, barG);
var rail = mesh(new THREE.CylinderGeometry(0.018, 0.018, barLen, 10), brass, barMidX, 0.2, barZ + 0.4, barG); rail.rotation.z = Math.PI / 2;
var detail=window.dssDetailProps(mesh,tex,roomEnv,scene);
// the back bar: a real mirror gone smoky at the edges, two shelves of bottles, the till, the green lamp
var mir = mesh(new THREE.PlaneGeometry(barLen - 0.2, 0.9), null, barMidX, 1.65, -D / 2 + 0.012);
mirrors.push(makeMirror(mir, new THREE.Vector3(0, 0, 1), portrait ? 512 : 1024, new THREE.Vector3(0.64, 0.68, 0.56), { edge: '0.12' }));
mesh(new THREE.BoxGeometry(barLen - 0.1, 1.0, 0.03), oak, barMidX, 1.65, -D / 2 + 0.008, barG);
mesh(new THREE.BoxGeometry(0.06, 1.2, 0.2), oak, barX1 + 0.05, 1.7, -D / 2 + 0.1, barG); mesh(new THREE.BoxGeometry(0.06, 1.2, 0.2), oak, barX0 + 0.03, 1.7, -D / 2 + 0.1, barG);
var giltTex = tex(1024, 128, function(cx, w, h) { cx.clearRect(0, 0, w, h); cx.font = 'bold 40px Georgia,serif'; cx.textAlign = 'center'; cx.fillStyle = 'rgba(214,176,90,0.8)'; cx.fillText('THE COLONY ROOM CLUB', w / 2, 58); cx.font = 'italic 20px Georgia,serif'; cx.fillStyle = 'rgba(214,176,90,0.65)'; cx.fillText('41 Dean Street · first floor · members', w / 2, 96); });
mesh(new THREE.PlaneGeometry(barLen - 0.5, 0.26), new THREE.MeshBasicMaterial({ map: giltTex, transparent: true, depthWrite: false, toneMapped: false, opacity: 0.9 }), barMidX, 1.92, -D / 2 + 0.05);
var shelfMat = shelfWood;
var botCols = [0x2a5a2a, 0x7a4a18, 0x1a2a5a, 0x8a7a20, 0x4a1a1a, 0x2a4a3a, 0xa08030, 0x3a2a1a, 0x6a3a10];
function bottle(x, y, z, col, h, r, parent) {
var g = new THREE.Group(); g.position.set(x, y, z);
detail.bottle(g,h,r,col,Math.round(x*13+z*31));
(parent || scene).add(g); return g;
}
[1.28, 1.72].forEach(function(sy, si) {
mesh(new THREE.BoxGeometry(barLen - 0.2, 0.03, [0.26, 0.2][si]), shelfMat, barMidX, sy, -D / 2 + [0.14, 0.11][si], barG);
var n = 11 + si * 2;
for (var i = 0; i < n; i++) {
if (rnd(si * 40 + i) < 0.14) continue;
bottle(barX0 + 0.15 + i * ((barLen - 0.4) / n) + (rnd(i + si * 9) - 0.5) * 0.04, sy + 0.015, -D / 2 + [0.14, 0.11][si] + (rnd(i * 3 + si) - 0.5) * 0.05, botCols[(i + si * 4) % botCols.length], 0.2 + rnd(i + si * 30) * 0.13, 0.028 + rnd(i * 2 + si) * 0.012, barG);
}
});
for (var o = 0; o < 4; o++) bottle(barX0 + 0.5 + o * 0.45, 1.69, -D / 2 + 0.16, botCols[(o * 5) % botCols.length], 0.2, 0.028, barG).rotation.x = Math.PI;
var till = mesh(new THREE.BoxGeometry(0.34, 0.26, 0.3), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.5, envMap: roomEnv, envMapIntensity: 0.4 }), barX1 - 0.45, 1.23, -D / 2 + 0.22, barG);
mesh(new THREE.BoxGeometry(0.3, 0.06, 0.1), new THREE.MeshStandardMaterial({ color: 0x3a4a3a, emissive: 0x2a6a3a, emissiveIntensity: 0.5 }), barX1 - 0.45, 1.39, -D / 2 + 0.12, barG);
// a soda syphon, a bar towel, a bowl and the night's glasses
var syphon = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.24, 14), new THREE.MeshPhysicalMaterial({ color: 0x8ab0c0, roughness: 0.1, transparent: true, opacity: 0.6, envMap: roomEnv, envMapIntensity: 1, clearcoat: 1 }), barX0 + 0.5, 1.22, barZ - 0.12, barG);
mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.06, 12), new THREE.MeshStandardMaterial({ color: 0xc8c8c0, roughness: 0.3, metalness: 0.8, envMap: roomEnv, envMapIntensity: 0.7 }), barX0 + 0.5, 1.37, barZ - 0.12, barG);
var towel=detail.cloth(0.26,0.18,barX0+0.95,1.108,barZ+0.08,barG,'#46513a',true);towel.rotation.x=-Math.PI/2;
var glassMat = new THREE.MeshPhysicalMaterial({ color: 0xf0eadc, roughness: 0.09, metalness: 0.04, envMap: roomEnv, envMapIntensity: 1.1, clearcoat: 1, transparent: true, opacity: 0.34 });
var ginMat = new THREE.MeshStandardMaterial({ color: 0xe8f0e0, roughness: 0.1, transparent: true, opacity: 0.5, emissive: 0x304030, emissiveIntensity: 0.2 });
function tumbler(x, y, z, fill, parent) {
var g = new THREE.Group(); g.position.set(x, y, z); (parent || scene).add(g);
detail.cup(g,0.034,0.1);
if (fill > 0) mesh(new THREE.CylinderGeometry(0.03, 0.029, 0.09 * fill, 14), ginMat, 0, 0.006 + 0.045 * fill, 0, g);
return g;
}
tumbler(-1.5, 1.1, barZ + 0.1, 0.5, barG); tumbler(-2.2, 1.1, barZ + 0.14, 0, barG); tumbler(-0.95, 1.1, barZ - 0.05, 0.8, barG);
var ashMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.3, metalness: 0.2, envMap: roomEnv, envMapIntensity: 0.4 });
detail.ash(-0.9,1.1,barZ+0.12,barG,0.06);
// Soda syphon lever and downturned nozzle, over fluted glass.
var syMetal=detail.material('#ada896','metal');
detail.wire([[barX0+0.5,1.39,barZ-0.12],[barX0+0.57,1.39,barZ-0.12],[barX0+0.59,1.36,barZ-0.12]],0.006,syMetal,barG);
mesh(new THREE.BoxGeometry(0.075,0.007,0.015),syMetal,barX0+0.53,1.414,barZ-0.12,barG);
for(var flute=0;flute<10;flute++){var angle=flute/10*Math.PI*2;mesh(new THREE.CylinderGeometry(0.0015,0.0015,0.2,5),detail.glass,barX0+0.5+Math.cos(angle)*0.045,1.22,barZ-0.12+Math.sin(angle)*0.045,barG);}
// bamboo stools, a bent back on each
var stoolG = new THREE.Group(); scene.add(stoolG);
var seatMat = new THREE.MeshStandardMaterial({ color: 0x5a2a20, roughness: 0.65, envMap: roomEnv, envMapIntensity: 0.15 });
var stools = [];
function stool(x, z) {
var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rnd(x + z) * 6; stoolG.add(g);
[[-0.13, -0.13], [0.13, -0.13], [-0.13, 0.13], [0.13, 0.13]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.62, 8), bambooMat, l[0], 0.31, l[1], g); });
mesh(new THREE.TorusGeometry(0.14, 0.01, 6, 20), bambooMat, 0, 0.2, 0, g).rotation.x = Math.PI / 2;
var cushion=mesh(new THREE.SphereGeometry(1,20,10),detail.material('#66372b','cloth'),0,0.64,0,g);cushion.scale.set(0.17,0.029,0.17);detail.arc(g,0.165,0.002,seatMat,0,0.635,0);
var bk = mesh(new THREE.TorusGeometry(0.15, 0.011, 6, 20, Math.PI), bambooMat, 0, 0.88, 0, g); bk.rotation.x = Math.PI / 2; bk.rotation.z = Math.PI;
mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.26, 6), bambooMat, -0.15, 0.77, 0, g); mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.26, 6), bambooMat, 0.15, 0.77, 0, g);
[[-0.13,-0.13],[0.13,-0.13],[-0.13,0.13],[0.13,0.13]].forEach(function(p){[0.18,0.53].forEach(function(y){mesh(new THREE.CylinderGeometry(0.021,0.021,0.014,10),detail.material('#b49a64','cloth'),p[0],y,p[1],g);});});
stools.push(g); return g;
}
stool(-2.05, barZ + 0.62); stool(-1.35, barZ + 0.62);

// ---------- THE TELEPHONE, at the end of the bar ----------
var phoneG = new THREE.Group(); phoneG.position.set(barX1 - 0.12, 1.1, barZ - 0.1); phoneG.rotation.y = -0.3; scene.add(phoneG);
var bakelite = new THREE.MeshStandardMaterial({ color: 0x16120f, roughness: 0.26, metalness: 0.08, envMap: roomEnv, envMapIntensity: 0.55 });
mesh(new THREE.BoxGeometry(0.2, 0.09, 0.17), bakelite, 0, 0.045, 0, phoneG);
mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.02, 20), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.5 }), 0.02, 0.1, 0.03, phoneG);
var hs = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.2, 10), bakelite, 0, 0.14, -0.02, phoneG); hs.rotation.z = Math.PI / 2;
mesh(new THREE.SphereGeometry(0.032, 10, 8), bakelite, -0.1, 0.13, -0.02, phoneG); mesh(new THREE.SphereGeometry(0.032, 10, 8), bakelite, 0.1, 0.13, -0.02, phoneG);
// the knotted cord
for (var ck = 0; ck < 6; ck++) mesh(new THREE.TorusGeometry(0.014, 0.004, 5, 10), bakelite, -0.13 - ck * 0.02, 0.02 + (ck % 2) * 0.01, 0.06 + ck * 0.015, phoneG).rotation.x = ck * 0.7;
var phoneHit = mesh(new THREE.BoxGeometry(0.34, 0.3, 0.3), new THREE.MeshBasicMaterial({ visible: false }), 0, 0.12, 0, phoneG);

// ---------- THE PIANO, upright, against the right wall ----------
var pianoG = new THREE.Group(); pianoG.position.set(W / 2 - 0.34, 0, -0.55); pianoG.rotation.y = -Math.PI / 2; scene.add(pianoG);
var pianoMat = new THREE.MeshStandardMaterial({ map: grainB, bumpMap: grainB, bumpScale: 0.002, roughness: 0.22, metalness: 0.08, envMap: roomEnv, envMapIntensity: 0.7 });
var pb = mesh(new THREE.BoxGeometry(1.4, 1.25, 0.6), pianoMat, 0, 0.625, 0, pianoG); pb.castShadow = true; pb.receiveShadow = true;
mesh(new THREE.BoxGeometry(1.44, 0.05, 0.64), pianoMat, 0, 1.275, 0, pianoG);
mesh(new THREE.BoxGeometry(1.36, 0.5, 0.02), oak, 0, 1.0, 0.305, pianoG); mesh(new THREE.BoxGeometry(0.5, 0.36, 0.012), darkWood, -0.35, 1.0, 0.318, pianoG); mesh(new THREE.BoxGeometry(0.5, 0.36, 0.012), darkWood, 0.35, 1.0, 0.318, pianoG);
mesh(new THREE.BoxGeometry(1.42, 0.04, 0.34), pianoMat, 0, 0.82, 0.3, pianoG);
var ivoryMat=detail.material('#d4c9a5','paper');
for (var k = 0; k < 36; k++) mesh(new THREE.BoxGeometry(0.031, 0.02, 0.14), ivoryMat, -0.6 + k * 0.034, 0.845, 0.36, pianoG);
for (var k = 0; k < 36; k++) if (k % 7 !== 2 && k % 7 !== 5 && k < 35) mesh(new THREE.BoxGeometry(0.018, 0.014, 0.08), bakelite, -0.583 + k * 0.034, 0.862, 0.33, pianoG);
mesh(new THREE.BoxGeometry(1.3, 0.16, 0.02), oak, 0, 1.12, 0.31, pianoG);
var scoreTex = tex(256, 192, function(cx, w, h) { cx.fillStyle = '#eee6cc'; cx.fillRect(0, 0, w, h); cx.strokeStyle = '#3a3020'; cx.lineWidth = 1; for (var s = 0; s < 4; s++) for (var l = 0; l < 5; l++) { cx.beginPath(); cx.moveTo(16, 30 + s * 40 + l * 5); cx.lineTo(w - 16, 30 + s * 40 + l * 5); cx.stroke(); } cx.fillStyle = '#2a2018'; for (var n = 0; n < 60; n++) { cx.beginPath(); cx.ellipse(24 + rnd(n) * (w - 48), 30 + (rnd(n + 1) * 4 | 0) * 40 + rnd(n + 2) * 20, 3.2, 2.4, -0.4, 0, 6.3); cx.fill(); cx.fillRect(27 + rnd(n) * (w - 48), 12 + (rnd(n + 1) * 4 | 0) * 40 + rnd(n + 2) * 20, 1, 18); } cx.font = 'italic 11px Georgia,serif'; cx.fillText('Lento, come una memoria', 20, 16); });
var score = mesh(new THREE.PlaneGeometry(0.34, 0.26), new THREE.MeshStandardMaterial({ map: scoreTex, roughness: 0.9, side: THREE.DoubleSide }), -0.1, 1.15, 0.325, pianoG); score.rotation.x = -0.12;
for(var keyWear=0;keyWear<36;keyWear++){mesh(new THREE.BoxGeometry(0.001,0.001,0.105),detail.material('#8d846c','paper'),-0.615+keyWear*0.034,0.856,0.37,pianoG);}
// Paper turns up softly at the music stand, with a visible centre fold.
var scoreEdge=mesh(new THREE.BoxGeometry(0.34,0.003,0.26),detail.material('#bcb092','paper'),-0.1,1.15,0.322,pianoG);scoreEdge.rotation.x=Math.PI/2-0.12;
mesh(new THREE.BoxGeometry(0.0018,0.24,0.002),detail.material('#ab9c7d','paper'),-0.1,1.15,0.329,pianoG);
// a candle in a bottle, wax down the glass, and an empty glass on top
bottle(0.45, 1.3, 0, 0x1e3a1e, 0.22, 0.03, pianoG);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), new THREE.MeshStandardMaterial({ color: 0xf0e8d0, roughness: 0.9 }), 0.45, 1.6, 0, pianoG);
mesh(new THREE.CylinderGeometry(0.02, 0.034, 0.05, 10), new THREE.MeshStandardMaterial({ color: 0xf0e8d0, roughness: 0.9 }), 0.45, 1.545, 0, pianoG);
var waxMat=detail.material('#e3d8b9','glaze');
for(var drip=0;drip<5;drip++){var angle=drip*2.4,len=0.024+drip%3*0.014;var bead=mesh(new THREE.SphereGeometry(1,10,8),waxMat,0.45+Math.cos(angle)*0.021,1.55-len*0.3,Math.sin(angle)*0.021,pianoG);bead.scale.set(0.006,len,0.006);}
mesh(new THREE.CylinderGeometry(0.0015,0.0018,0.012,6),detail.material('#332d24','cloth'),0.45,1.665,0,pianoG);
var candle = new THREE.PointLight(0xffb060, 0.5, 2.2); candle.position.set(0.45, 1.7, 0); pianoG.add(candle);
var flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(32, 32, function(cx, w, h) { var g = cx.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,230,160,1)'); g.addColorStop(0.4, 'rgba(255,170,60,0.6)'); g.addColorStop(1, 'rgba(255,120,20,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); }), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
flame.scale.set(0.09, 0.14, 1); flame.position.set(0.45, 1.69, 0); pianoG.add(flame);
tumbler(-0.4, 1.3, 0.05, 0.2, pianoG);
bottle(-0.62, 1.3, -0.1, 0x7a4a18, 0.24, 0.032, pianoG);
// the piano stool, and the pedals
var pst = mesh(new THREE.BoxGeometry(0.5, 0.06, 0.32), seatMat, 0, 0.5, 0.75, pianoG);
[[-0.2, 0.62], [0.2, 0.62], [-0.2, 0.88], [0.2, 0.88]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), pianoMat, l[0], 0.25, l[1], pianoG); });
mesh(new THREE.BoxGeometry(0.04, 0.02, 0.1), brass, -0.08, 0.06, 0.33, pianoG); mesh(new THREE.BoxGeometry(0.04, 0.02, 0.1), brass, 0.08, 0.06, 0.33, pianoG);

// ---------- THE WINDOW, onto Dean Street, on the right wall by the front ----------
var winG = new THREE.Group(); winG.position.set(W / 2 - 0.02, 1.55, 1.15); winG.rotation.y = -Math.PI / 2; scene.add(winG);
var winTex = tex(256, 384, function(cx, w, h) {
var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#141a2a'); g.addColorStop(0.5, '#2a2c34'); g.addColorStop(0.8, '#3a3020'); g.addColorStop(1, '#1a1610'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
// the houses opposite, their lit windows, the lamp, the wet street below
cx.fillStyle = '#1e1c1a'; cx.fillRect(0, 40, w, 230); for (var f = 0; f < 3; f++) for (var c = 0; c < 4; c++) { var lit = rnd(f * 4 + c) < 0.45; cx.fillStyle = lit ? ['#e8c070', '#d8a050', '#b04030'][(f + c) % 3] : '#0c0a08'; cx.fillRect(18 + c * 60, 60 + f * 66, 30, 44); if (lit) { cx.fillStyle = 'rgba(255,255,255,0.25)'; cx.fillRect(18 + c * 60 + 13, 60 + f * 66, 4, 44); } }
var lg = cx.createRadialGradient(150, 250, 0, 150, 250, 70); lg.addColorStop(0, 'rgba(255,214,150,0.85)'); lg.addColorStop(0.15, 'rgba(255,200,120,0.4)'); lg.addColorStop(1, 'rgba(255,200,120,0)'); cx.fillStyle = lg; cx.fillRect(0, 0, w, h);
cx.fillStyle = '#ffe6bb'; cx.fillRect(146, 246, 8, 10); cx.fillStyle = '#111'; cx.fillRect(149, 256, 2, 80);
cx.fillStyle = 'rgba(255,214,150,0.2)'; cx.fillRect(140, 300, 20, 84);
// the net curtain
cx.fillStyle = 'rgba(236,228,205,0.3)'; for (var i = 0; i < 12; i++) cx.fillRect(4 + i * 21 + Math.sin(i) * 3, 0, 5, h);
cx.fillStyle = 'rgba(236,228,205,0.12)'; cx.fillRect(0, 0, w, h);
});
var winPane = mesh(new THREE.PlaneGeometry(1.0, 1.4), new THREE.MeshBasicMaterial({ map: winTex, toneMapped: false }), 0, 0, 0, winG);
var sashMat = new THREE.MeshStandardMaterial({ map: paintTex('#cfc4a4', 41), roughness: 0.7 });
mesh(new THREE.BoxGeometry(1.14, 0.07, 0.08), sashMat, 0, 0.72, 0.03, winG); mesh(new THREE.BoxGeometry(1.14, 0.1, 0.14), sashMat, 0, -0.74, 0.06, winG);
mesh(new THREE.BoxGeometry(0.07, 1.5, 0.08), sashMat, -0.535, 0, 0.03, winG); mesh(new THREE.BoxGeometry(0.07, 1.5, 0.08), sashMat, 0.535, 0, 0.03, winG);
mesh(new THREE.BoxGeometry(1.04, 0.05, 0.06), sashMat, 0, 0, 0.03, winG); mesh(new THREE.BoxGeometry(0.04, 1.4, 0.05), sashMat, 0, 0, 0.03, winG);
bottle(0.3, -0.69, 0.06, 0x2a5a2a, 0.18, 0.026, winG); tumbler(-0.25, -0.69, 0.06, 0, winG);
var winGlow = new THREE.PointLight(0x8090b0, 0.35, 3.5, 1.6); winGlow.position.set(W / 2 - 0.5, 1.55, 1.15); scene.add(winGlow);

// ---------- THE AGENT'S TABLE, bamboo, by the window ----------
var tableG = new THREE.Group(); tableG.position.set(1.35, 0, 0.75); scene.add(tableG);
mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.03, 24), counterMat, 0, 0.72, 0, tableG).castShadow = true;
mesh(new THREE.TorusGeometry(0.33, 0.012, 6, 32), bambooMat, 0, 0.735, 0, tableG).rotation.x = Math.PI / 2;
mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.7, 10), bambooMat, 0, 0.36, 0, tableG);
mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 16), bambooMat, 0, 0.02, 0, tableG);
tumbler(0.1, 0.735, 0.06, 0.6, tableG); tumbler(-0.12, 0.735, -0.08, 0.3, tableG);
mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.018, 16), ashMat, -0.02, 0.744, 0.16, tableG);
var paper = mesh(new THREE.BoxGeometry(0.22, 0.008, 0.3), new THREE.MeshStandardMaterial({ color: 0xcfc4a6, roughness: 0.95 }), 0.14, 0.739, -0.14, tableG); paper.rotation.y = 0.5;
var hat = mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.09, 16), new THREE.MeshStandardMaterial({ color: 0x2a2620, roughness: 0.95 }), -0.18, 0.78, 0.14, tableG); mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.012, 16), new THREE.MeshStandardMaterial({ color: 0x2a2620, roughness: 0.95 }), -0.18, 0.74, 0.14, tableG);
function chair(x, z, ry) {
var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; tableG.add(g);
[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(function(l) { mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.46, 8), bambooMat, l[0], 0.23, l[1], g); });
mesh(new THREE.BoxGeometry(0.42, 0.04, 0.42), seatMat, 0, 0.47, 0, g);
mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.5, 8), bambooMat, -0.18, 0.72, -0.18, g); mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.5, 8), bambooMat, 0.18, 0.72, -0.18, g);
mesh(new THREE.BoxGeometry(0.4, 0.05, 0.03), bambooMat, 0, 0.95, -0.18, g); mesh(new THREE.BoxGeometry(0.4, 0.03, 0.03), bambooMat, 0, 0.8, -0.18, g);
}
chair(0, -0.5, 0); chair(0.55, 0.05, -Math.PI / 2);
// a coat stand in the corner by the door, with what the night left on it
var standG = new THREE.Group(); standG.position.set(-W / 2 + 0.35, 0, 1.85); scene.add(standG);
mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.8, 8), darkWood, 0, 0.9, 0, standG); mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.03, 16), darkWood, 0, 0.015, 0, standG);
for (var hk = 0; hk < 4; hk++) { var a = hk * Math.PI / 2; mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.16, 6), brass, Math.cos(a) * 0.08, 1.72, Math.sin(a) * 0.08, standG).rotation.set(Math.sin(a) * 0.9, 0, Math.cos(a) * 0.9); }
var coat = mesh(new THREE.BoxGeometry(0.28, 0.85, 0.16), new THREE.MeshStandardMaterial({ color: 0x3a2a24, roughness: 0.95 }), 0.12, 1.28, 0.06, standG); coat.rotation.y = 0.4; coat.castShadow = true;
mesh(new THREE.BoxGeometry(0.2, 0.5, 0.1), new THREE.MeshStandardMaterial({ color: 0x6a1e1e, roughness: 0.95 }), -0.1, 1.45, -0.08, standG);

// ---------- THE FIGURES, faint traces ----------
function ghostTex(seed, seated) { return window.dssGhostTex(tex, rnd, seed, seated, false, [210, 225, 180]); }
var ghosts = [];
function ghost(x, z, seed, base, seated) {
var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ghostTex(seed, seated), transparent: true, opacity: base, depthWrite: false, blending: THREE.AdditiveBlending }));
sp.scale.set(0.9, 1.8, 1); sp.position.set(x, 0.9, z); scene.add(sp);
var hit = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, seated ? 1.1 : 1.5, 8), new THREE.MeshBasicMaterial({ visible: false }));
hit.position.set(x, seated ? 0.7 : 0.95, z); scene.add(hit);
var g = { sp: sp, hit: hit, base: base, ph: seed * 2.1 }; ghosts.push(g); return g;
}
var davy = ghost(-1.35, barZ + 0.62, 0, 0.38, false);        // the man at the bar, on the second stool
var agent = ghost(1.35, 0.25, 2, 0.34, true);               // the agent, at his table, with his back half to the room
var pianist = ghost(W / 2 - 1.1, -0.55, 4, 0.22, true);     // someone at the piano, not playing

// ---------- LIGHT: dim, greenish, a shaded pendant, a green lamp over the bar, the candle ----------
scene.add(new THREE.AmbientLight(0x3a4a2a, 0.5));
scene.add(new THREE.HemisphereLight(0x8a9a50, 0x101408, 0.32));
var glowTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,225,160,0.9)'); g.addColorStop(0.3, 'rgba(255,190,100,0.35)'); g.addColorStop(0.7, 'rgba(220,140,50,0.08)'); g.addColorStop(1, 'rgba(180,100,30,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function glow(x, y, z, sc, op, col) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: col || 0xffffff, transparent: true, opacity: op || 0.6, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, fog: false, toneMapped: false })); sp.scale.set(sc, sc, 1); sp.position.set(x, y, z); scene.add(sp); return sp; }
// the picture lamp over the Commem. Ball print, off until it is looked at
ballGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffd8a0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false }));
ballGlow.scale.set(0.5, 0.12, 1); ballGlow.position.set(0, BALL.h / 2 + 0.075, 0.12); ballG.add(ballGlow);
var pend = new THREE.PointLight(0xffd090, 1.2, 7, 1.6); pend.position.set(0.2, H - 0.45, -0.2); pend.castShadow = true; pend.shadow.mapSize.set(1024, 1024); pend.shadow.bias = -0.001; pend.shadow.normalBias = 0.02; pend.shadow.radius = 3; scene.add(pend);
mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.35, 6), bakelite, 0.2, H - 0.18, -0.2);
var shadeTex = paintTex('#7a6a28', 51, 'rgba(220,190,80,0.2)');
var shade = mesh(new THREE.ConeGeometry(0.28, 0.22, 24, 1, true), new THREE.MeshStandardMaterial({ map: shadeTex, roughness: 0.8, side: THREE.DoubleSide, emissive: 0x4a3a10, emissiveIntensity: 0.6 }), 0.2, H - 0.36, -0.2);
mesh(new THREE.TorusGeometry(0.28, 0.008, 6, 24), brass, 0.2, H - 0.47, -0.2).rotation.x = Math.PI / 2;
mesh(new THREE.SphereGeometry(0.06, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffe8b0, toneMapped: false }), 0.2, H - 0.45, -0.2);
var pendGlow = glow(0.2, H - 0.47, -0.2, 1.2, 0.5);
// the banker's lamp at the end of the bar, green glass on a brass stem
var barLamp = new THREE.PointLight(0xc8ff90, 0.7, 3.2, 1.6); barLamp.position.set(-1.6, 1.95, -D / 2 + 0.5); scene.add(barLamp);
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), brass, -1.6, 1.9, -D / 2 + 0.06);
mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.42, 6), brass, -1.6, 2.02, -D / 2 + 0.27).rotation.x = Math.PI / 2;
var greenShade = mesh(new THREE.SphereGeometry(0.13, 18, 12, 0, 6.3, 0, 1.7), new THREE.MeshPhysicalMaterial({ color: 0x2a7a2a, roughness: 0.3, emissive: 0x1a5a1a, emissiveIntensity: 0.9, side: THREE.DoubleSide, envMap: roomEnv, envMapIntensity: 0.5, clearcoat: 0.8 }), -1.6, 2.0, -D / 2 + 0.5);
mesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: 0xf0ffd0, toneMapped: false }), -1.6, 1.95, -D / 2 + 0.5);
var barGlow = glow(-1.6, 1.93, -D / 2 + 0.5, 0.8, 0.45, 0xc8ffa0);
var candleGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false })); candleGlow.scale.set(0.5, 0.5, 1); candleGlow.position.set(0.45, 1.7, 0); pianoG.add(candleGlow);
// contact shadows, static shadow map
var contactTex = tex(64, 64, function(cx, w, h) { var g = cx.createRadialGradient(32, 32, 3, 32, 32, 32); g.addColorStop(0, 'rgba(0,0,0,0.36)'); g.addColorStop(0.45, 'rgba(0,0,0,0.2)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
function contact(x, z, s) { var sh = mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false }), x, 0.004, z); sh.rotation.x = -Math.PI / 2; return sh; }
stools.forEach(function(st) { contact(st.position.x, st.position.z, 0.8); });
contact(1.35, 0.75, 1.2); contact(1.35, 0.25, 0.9); contact(-W / 2 + 0.35, 1.85, 0.6);
renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true;
// smoke in the lamplight: haze under the shades, specks only in their pools
var hazeTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(200,190,140,0.2)'); g.addColorStop(0.35, 'rgba(160,150,100,0.12)'); g.addColorStop(1, 'rgba(100,90,60,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var haze = [[0.2, 1.75, -0.2, 2.6, 1.6], [-1.6, 1.5, -D / 2 + 0.6, 1.6, 1.1]].map(function(p) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTex, transparent: true, opacity: 0.14, depthWrite: false, blending: THREE.AdditiveBlending })); sp.position.set(p[0], p[1], p[2]); sp.scale.set(p[3], p[4], 1); scene.add(sp); return sp; });
var dustTex = tex(32, 32, function(cx, w, h) { var g = cx.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,237,197,0.85)'); g.addColorStop(0.22, 'rgba(255,237,197,0.4)'); g.addColorStop(1, 'rgba(255,237,197,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var moteN = 64, moteBase = new Float32Array(moteN * 3), motePos = new Float32Array(moteN * 3);
for (var mi = 0; mi < moteN; mi++) { var lp = mi % 3 ? [0.2, -0.2] : [-1.6, -D / 2 + 0.5], angle = rnd(mi * 7) * Math.PI * 2, radius = 0.15 + rnd(mi * 11) * 1.0; moteBase[mi * 3] = lp[0] + Math.cos(angle) * radius; moteBase[mi * 3 + 1] = 0.6 + rnd(mi + 1) * 1.7; moteBase[mi * 3 + 2] = lp[1] + Math.sin(angle) * radius * 0.7; }
motePos.set(moteBase);
var moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
scene.add(new THREE.Points(moteGeo, new THREE.PointsMaterial({ map: dustTex, color: 0xd8e8b0, size: 0.018, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending })));

// ---------- THE CLOSE-UPS, AND THE PATHS ----------
var PINK = 'color:#ff3aa8;text-shadow:0 0 4px rgba(255,58,168,0.45);';
function passageLinks(sel) {
var pass = window.dssRoomScope(ciHost);
if (!pass) return [];
return Array.prototype.slice.call(pass.querySelectorAll(sel)).filter(function(l) { return !(play && play.card.contains(l)) && (l.classList.contains('dss-claimed') || !!l.closest('.lore-card-only') || l.getClientRects().length > 0); }); /* 2026-10-21: a lore link kept for a card alone (.lore-card-only) is hidden by design, so it counts though it has no box */
}
// the lily, when it is still there to take: the hook's own click-replace does the work
function lilyHook(n) { var pass = window.dssRoomScope(ciHost); if (!pass) return []; var h = pass.querySelector('tw-hook[name="lily' + n + '"]'); return (h && h.querySelector('svg') && !h.querySelector('.lily-glimpse') && (h.classList.contains('dss-claimed') || h.getClientRects().length > 0)) ? [h] : []; }
function byText(texts) { return passageLinks('tw-link').filter(function(l) { return texts.indexOf(l.textContent.trim()) >= 0; }); }
var wayOut = window.dssWayOutArrow(scene, -0.45, -1.1, -2.4, -0.75); /* 2026-10-20: the door out is behind you, on the left; the arrow is turned off the camera's line so it reads as an arrow, not a tick */
var HOTSPOTS = [
{ root: picG, name: 'Pictures', pos: [-0.3, 1.6, -1.2], tgt: [0.4, 1.75, -2.2], haloAt: [0.2, 1.7, -D / 2 + 0.05], haloSc: 1.6,
actions: function() { return lilyHook(4); } },
{ root: phoneHit, name: 'A telephone', pos: [-0.2, 1.5, -0.2], tgt: [barX1 - 0.12, 1.2, barZ - 0.1], haloSc: 0.5,
actions: function() { return passageLinks('.phone-ringing tw-link'); },
prose: function() { var d = passageLinks('.phone-ringing')[0]; if (!d) return ''; var c = d.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('tw-link'), function(l) { l.parentNode.removeChild(l); }); return c.textContent.replace(/\s+/g, ' ').trim(); } },
{ root: barG, name: 'A bar', pos: [-0.9, 1.45, 0.4], tgt: [-1.9, 1.15, barZ - 0.3], haloAt: [-1.7, 1.15, barZ], haloSc: 1.3,
actions: function() { return byText(['Get a drink']); } },
{ root: davy.hit, name: 'A man at the bar', pos: [-0.35, 1.45, 0.9], tgt: [-1.35, 1.15, barZ + 0.5], figure: true,
actions: function() { return byText(['Get a drink with the man at the bar', 'Talk to DAVY']); } },
{ root: agent.hit, name: 'An agent at his table', pos: [0.1, 1.4, 1.3], tgt: [1.35, 0.95, 0.35], figure: true,
actions: function() { return byText(['Talk to the famous agent']); } },
{ root: pianoG, name: 'A piano', pos: [0.9, 1.4, 0.2], tgt: [W / 2 - 0.3, 1.1, -0.55], haloAt: [W / 2 - 0.5, 1.1, -0.55], haloSc: 1.1 },
{ root: winG, name: 'A window', pos: [1.2, 1.5, 1.4], tgt: [W / 2, 1.55, 1.15], haloAt: [W / 2 - 0.1, 1.55, 1.15], haloSc: 1.2 },
{ root: ballG, name: 'A photograph', pos: [W / 2 - 0.78, 1.77, BALL.z + 0.03], tgt: [W / 2, BALL.y, BALL.z], haloAt: [W / 2 - 0.06, BALL.y, BALL.z], haloSc: 0.9,
onLook: function(on) { ballOn = on; } }, /* the push-in is the whole of it, as at the end of The Shining: the lamp is its onLook, so it takes a click with no words */
{ root: wayOut, name: 'The way out', label: 'WAY OUT', pos: [-1.2, 1.5, 1.0], tgt: [-W / 2 + 0.03, 1.1, 1.3], haloAt: [-0.16, 0.14, -1.15], haloSc: 0.55, /* the glow at the tail, so it does not wash out the chalk */
actions: function() { return window.dssStreetExit(); } }
];
// ---------- the hover, the card, the resting glow, the reveal and the words: shared with every room (window.dssRoomPlay) ----------
var play = window.dssRoomPlay({ wrap: ciWrap, canvas: ciCanvas, host: ciHost, scene: scene, camera: camera, CAM: CAM, HOTSPOTS: HOTSPOTS, tex: tex, still: ciStill,
card: { fg: 'rgba(215,225,180,0.92)', bg: 'rgba(6,10,4,0.8)', border: 'rgba(170,200,110,0.3)', dim: 'rgba(190,200,150,0.5)', btn: 'rgba(220,235,160,0.95)', btnBorder: 'rgba(180,200,110,0.45)' }, hint: 'LOOK CLOSER AT WHAT CATCHES YOUR EYE', state: function() { return { active: ciActive, animId: ciAnimId }; } });
var words = play.words, halo = play.halo, curTarget = play.curTarget;

// ---------- FRAMES ----------
var clock = new THREE.Clock();
function ciAnimate() {
ciAnimId = requestAnimationFrame(ciAnimate);
// a throw in the frame ends the room, not the night (dssSceneFailed)
try { ciFrame(); } catch (err) { cancelAnimationFrame(ciAnimId); ciAnimId = null; if (window.dssSceneFailed) window.dssSceneFailed(err, 'ci'); else throw err; }
}
function ciFrame() {
var dt = Math.min(0.1, clock.getDelta());
var t = ciStill ? 0 : clock.getElapsedTime();
play.frame(t, dt);
ballLook += ((ballOn ? 1 : 0) - ballLook) * (ciStill ? 1 : Math.min(1, dt * 1.4)); ballMat.emissiveIntensity = 0.28 * ballLook; ballGlow.material.opacity = 0.4 * ballLook;
if (!ciStill) {
for (var gi = 0; gi < ghosts.length; gi++) { var g = ghosts[gi]; g.sp.material.opacity = g.base * (0.7 + 0.3 * Math.sin(t * 0.23 + g.ph)); }
flame.material.opacity = 0.75 + 0.25 * Math.sin(t * 9.1) * Math.sin(t * 3.7); candle.intensity = 0.45 + 0.1 * Math.sin(t * 7.3);
var br = 0.03 * Math.sin(t * 0.7) + 0.015 * Math.sin(t * 0.19); pend.intensity = 1.2 + br; pendGlow.material.opacity = 0.5 + br * 0.6; haze[0].material.opacity = 0.14 + br * 0.2;
barLamp.intensity = 0.7 + 0.02 * Math.sin(t * 0.53 + 1); barGlow.material.opacity = 0.45 + 0.02 * Math.sin(t * 0.53 + 1); candleGlow.material.opacity = 0.3 + 0.12 * Math.sin(t * 9.1) * Math.sin(t * 3.7);
for (var m = 0; m < moteN; m++) { motePos[m * 3] = moteBase[m * 3] + Math.sin(t * 0.15 + m) * 0.06; motePos[m * 3 + 1] = 0.6 + ((moteBase[m * 3 + 1] - 0.6 + (m % 2 ? 1 : -1) * t * 0.03) % 1.7 + 1.7) % 1.7; }
moteGeo.attributes.position.needsUpdate = true;
}
play.withGlowsHidden(function() { for (var mr = 0; mr < mirrors.length; mr++) mirrors[mr].update(curTarget, t); });
if (composer) composer.render(); else renderer.render(scene, camera);
}
ciAnimate();
}

// 2026-10-12 (the Pillars audit): a pub that links to itself ("Back to the bar" after "I'm not here") swaps in a fresh
// container inside one tick, so the room never rebuilt and the screen stayed blank; a new container now rebuilds it,
// as the Coach's watcher already does
var ciSeenHost = null;
setInterval(function() {
var container = document.getElementById('ci-container');
if (container && ciActive && ciSeenHost && container !== ciSeenHost) {
ciActive = false;
if (ciAnimId) { cancelAnimationFrame(ciAnimId); ciAnimId = null; }
window._dssDisposeWrap('ci-wrap');
}
if (container && !ciActive) {
ciSeenHost = container;
initColonyInside();
} else if (!container) {
ciActive = false;
if (ciAnimId) { cancelAnimationFrame(ciAnimId); ciAnimId = null; }
window._dssDisposeWrap('ci-wrap');
}
}, 300);
})();

