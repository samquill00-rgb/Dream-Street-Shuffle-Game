// ====== FIVE SMALL ARRIVALS — the existing room palette, materials and lifecycle ======
(function(){
function arrival(id,caption,label,cam,build){window.dssRoomKit({id:id,arrival:true,caption:caption,captionColor:'rgba(222,204,165,.62)',bg:0x070709,fog:[0x11100f,0.045],exposure:0.84,bloom:{bloomStrength:0.32,bloomRadius:0.55,bloomThreshold:0.8},cam:function(p){return {x:cam[0],y:cam[1],z:cam[2]+(p?1:0),tx:cam[3],ty:cam[4],tz:cam[5]};},build:function(k){
var m=k.mesh,T=THREE,scene=k.scene,wood=k.M.darkWood,brass=k.M.brass;
function mat(col,r){return new T.MeshStandardMaterial({color:col,roughness:r===undefined?0.8:r,envMap:k.roomEnv,envMapIntensity:0.25});}
function box(w,h,d,ma,x,y,z,g){var piece=m(new T.BoxGeometry(w,h,d),ma,x,y,z,g);piece.castShadow=true;piece.receiveShadow=true;return piece;}
function wall(w,h,x,y,z,col){return box(w,h,0.12,new T.MeshStandardMaterial({map:k.paintTex(col,31),roughness:0.94}),x,y,z);}
function text(words,w,h,x,y,z,fg,bg,size){var tx=k.tex(512,128,function(c,W,H){c.fillStyle=bg||'#26231c';c.fillRect(0,0,W,H);c.strokeStyle='#85724d';c.lineWidth=3;c.strokeRect(7,7,W-14,H-14);c.fillStyle=fg||'#d9c99b';c.font=(size||30)+'px Georgia';c.textAlign='center';c.textBaseline='middle';c.fillText(words,W/2,H/2,W-28);});return m(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:tx,roughness:0.8}),x,y,z);}
function lamp(x,y,z,col,power){var bulb=m(new T.SphereGeometry(0.045,12,8),new T.MeshBasicMaterial({color:col||0xffdf9d,toneMapped:false}),x,y,z);var light=new T.PointLight(col||0xffd09a,power||1.2,7,1.8);light.position.set(x,y,z);light.castShadow=true;light.shadow.mapSize.set(512,512);light.shadow.bias=-0.002;scene.add(light);k.glow(x,y,z,0.65,0.25,col||0xffd09a);return light;}
function floor(w,d,y,col){var ft=k.woodTex(col||'#38332a','#11110f',72);ft.wrapS=ft.wrapT=T.RepeatWrapping;ft.repeat.set(w/2,d/2);var f=box(w,0.06,d,new T.MeshStandardMaterial({map:ft,roughness:0.8}),0,y-0.03,0);f.receiveShadow=true;return f;}
function pavement(w,d,y){var tx=k.tex(512,512,function(c,W,H){c.fillStyle='#343732';c.fillRect(0,0,W,H);for(var row=0;row<5;row++)for(var col=0;col<4;col++){var x=col*128+(row%2?64:0);c.fillStyle=(row+col)%3?'#53554b':'#666459';c.fillRect(x+2,row*103+2,124,99);c.fillStyle='rgba(23,28,25,.22)';c.fillRect(x+5,row*103+91,117,7);}for(var n=0;n<130;n++){c.fillStyle='rgba(20,27,22,.15)';c.fillRect(n*71%512,n*97%512,2+n%14,2);}});tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.repeat.set(w/3,d/3);var f=box(w,0.05,d,new T.MeshStandardMaterial({map:tx,bumpMap:tx,bumpScale:0.003,roughness:0.32,metalness:0.12,envMap:k.roomEnv,envMapIntensity:0.65}),0,y-0.025,0);f.receiveShadow=true;return f;}
function tiles(col){return k.tex(512,512,function(c,w,h){c.fillStyle='#534f43';c.fillRect(0,0,w,h);for(var row=0;row<8;row++)for(var coln=0;coln<8;coln++){c.fillStyle=(row+coln)%3?col:'#b7b69f';c.fillRect(coln*64+2,row*64+2,60,60);c.fillStyle='rgba(235,227,197,.15)';c.fillRect(coln*64+3,row*64+3,58,2);}for(var n=0;n<60;n++){c.fillStyle='rgba(44,47,30,.12)';c.fillRect(n*71%512,n*43%512,3+n%17,2+n%7);}});}
function tilewall(w,h,x,y,z,col){var tx=tiles(col);tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.repeat.set(w/2,h/2);return box(w,h,0.08,new T.MeshStandardMaterial({map:tx,bumpMap:tx,bumpScale:0.002,roughness:0.6}),x,y,z);}
function door(x,z,col){box(0.95,2.25,0.10,mat(col||0x26352a),x,1.125,z);box(1.08,0.08,0.17,wood,x,2.3,z);[-0.52,0.52].forEach(function(dx){box(0.07,2.3,0.17,wood,x+dx,1.15,z);});m(new T.SphereGeometry(0.025,12,8),brass,x+0.34,1.05,z+0.075);}
scene.add(new T.HemisphereLight(0x738c98,0x17110d,0.25));scene.add(new T.AmbientLight(0x665443,0.15));
var extra=build({k:k,m:m,T:T,box:box,wall:wall,mat:mat,text:text,lamp:lamp,floor:floor,pavement:pavement,tilewall:tilewall,door:door,wood:wood,brass:brass,scene:scene})||{};
// Pools of light and rain-dark surfaces, with the same restrained room colour treatment.
var outside=id==='bc'||id==='bd'||id==='jd';
scene.traverse(function(o){if(o.isPointLight)o.intensity*=0.68;});
var key=new T.SpotLight(outside?0xa9c8d1:0xc2d4bc,outside?2.0:(id==='gt'?1.15:1.5),18,Math.PI/5,0.48,1.5);
key.position.set(outside?-3.0:1.1,outside?4.2:2.65,outside?2.8:0.7);key.target.position.set(outside?0:-0.5,outside?0.2:0.65,outside?-1:-1.6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.bias=-0.0008;key.shadow.normalBias=0.02;scene.add(key);scene.add(key.target);
var rain=null;
if(outside){
var puddleMat=new T.MeshPhysicalMaterial({color:0x18232a,roughness:0.07,metalness:0.32,clearcoat:1,envMap:k.roomEnv,envMapIntensity:0.32,transparent:true,opacity:0.55,depthWrite:false});
for(var pi=0;pi<6;pi++){var pool=m(new T.CircleGeometry(1,40),puddleMat,(pi%2?1:-1)*(1.9+k.rnd(pi+9)*1.5),0.009,0.2+k.rnd(pi+71)*3);pool.rotation.x=-Math.PI/2;pool.scale.set(0.25+k.rnd(pi)*0.5,0.12+k.rnd(pi+1)*0.3,1);}
var rp=[];for(var ri=0;ri<70;ri++){var rx=(k.rnd(ri+700)-0.5)*9,ry=k.rnd(ri+800)*5,rz=k.rnd(ri+900)*4;rp.push(rx,ry,rz,rx-0.025,ry+0.17,rz);}
var rainGeo=new T.BufferGeometry();rainGeo.setAttribute('position',new T.Float32BufferAttribute(rp,3));rain=new T.LineSegments(rainGeo,new T.LineBasicMaterial({color:0xa6bbc1,transparent:true,opacity:0.16,depthWrite:false}));scene.add(rain);
}else{
// A narrow borrowed light cuts across the room, broken by window bars.
var windowG=new T.Group();windowG.position.set(id==='gt'?1.28:2.89,2.15,-0.15);windowG.rotation.y=-Math.PI/2;scene.add(windowG);
var windowMat=new T.MeshBasicMaterial({color:0x7d989d,transparent:true,opacity:0.42,toneMapped:false});m(new T.PlaneGeometry(id==='gt'?0.5:0.9,0.38),windowMat,0,0,0,windowG);
for(var bar=0;bar<4;bar++)box(0.025,0.4,0.03,wood,-0.22+bar*0.15,0,0.02,windowG);
}
var btn=document.createElement('button');btn.type='button';btn.textContent=label;btn.style.cssText='position:absolute;bottom:58px;left:50%;transform:translateX(-50%);max-width:94vw;box-sizing:border-box;padding:14px 28px;z-index:9010;background:rgba(12,10,8,.65);border:1px solid rgba(212,178,88,.45);color:#dfc58f;font:14px Courier New,monospace;letter-spacing:3px;cursor:pointer;';
btn.addEventListener('click',function(){btn.disabled=true;k.wrap.style.transition=k.still?'none':'opacity .65s ease';k.wrap.style.opacity='0';setTimeout(function(){k.wrap.hidden=true;k.host.style.display='none';var passage=k.host.closest('tw-passage');if(passage){passage.setAttribute('tabindex','-1');passage.focus({preventScroll:true});}},k.still?0:650);});k.wrap.appendChild(btn);
var origin=k.camera.position.clone(),target=new T.Vector3(cam[3],cam[4],cam[5]);
return {hotspots:[],frame:function(t,dt,still){var u=still?1:Math.min(t/5,1),ease=u*u*(3-2*u);k.camera.position.copy(origin);k.camera.position.z-=ease*0.6;k.camera.lookAt(target);if(rain&&!still)rain.position.y=-((t*0.9)%1);if(extra.frame)extra.frame(t,dt,still);}};
}});}
arrival('bc','BREWER STREET — THE CAR PARK','DOWN THE RAMP',[-0.6,1.6,5.6,0,0.8,-2],function(a){var b=a.box,m=a.mat,T=a.T;
var left=a.pavement(4.2,16,0);left.position.x=-3.95;var right=a.pavement(4.2,16,0);right.position.x=3.95;
// The entrance is genuinely open: two piers and a lintel, not a slab in front of the ramp.
a.tilewall(4.1,4,-3.95,2,-2.9,'#d0cbb4');a.tilewall(4.1,4,3.95,2,-2.9,'#d0cbb4');a.wall(3.8,1.1,0,3.45,-2.8,'#aaa894');
// Mask the centre of the distant facade with a recessed dark tunnel, in front of its back wall.
b(3.6,3.8,0.12,m(0x111918),0,0.65,-7);b(3.6,0.08,4,m(0x303a34),0,-1.0,-5);b(3.6,0.1,5,m(0x444c42),0,2.8,-4.5);[-1.85,1.85].forEach(function(x){b(0.10,3.8,4.5,m(0x60665b),x,0.7,-4.8);});var ramp=b(3.5,0.08,6,m(0x444743),0,-0.55,-0.1);ramp.rotation.x=-0.18;ramp.receiveShadow=true;
[-1,1].forEach(function(side){var curb=b(0.15,0.25,6,m(0x77786b),side*1.82,-0.22,-0.1);curb.rotation.x=-0.18;var rail=b(0.035,0.035,6,a.brass,side*1.76,0.72,-0.1);rail.rotation.x=-0.18;for(var z=-2;z<3;z+=1)b(0.03,0.75,0.03,a.wood,side*1.76,0.3,z);});
a.text('CAR PARK',3,0.5,0,3.5,-2.65);a.text('IN',0.45,0.3,-2.2,1.5,-2.8);
var dome=a.m(new T.SphereGeometry(1,32,16,0,Math.PI*2,0,Math.PI/2),new T.MeshStandardMaterial({color:0x536b58,roughness:0.62,metalness:0.45,envMap:a.k.roomEnv,envMapIntensity:0.5}),0,4,-3);dome.scale.set(1.4,0.85,1.4);b(3,0.12,1.5,m(0x697667),0,4,-3);
a.lamp(-2.3,2.4,-1.8,0xe3e6c5,1.4);a.lamp(0,3.4,-1.5,0xe2d1a8,0.8);a.lamp(1.2,1.9,-2.5,0xb8d5c5,0.65);
for(var i=0;i<3;i++){var g=a.k.ghost(-3.1+i*0.55,0,0.6,91+i,0.12,false,false,0.9);}
});
function shop(kind){var barber=kind==='barber';arrival(barber?'bd':'jd',barber?'MEARD STREET, SOHO':'OLD COMPTON STREET, SOHO',barber?'AT THE BARBER’S DOOR':'AT THE COUNTER',[1.1,1.6,4.4,0,1.35,-0.3],function(a){var b=a.box,m=a.mat,T=a.T,colour=barber?0x532b26:0x284c43;
a.pavement(9,10,0);[-3.2,3.2].forEach(function(x){a.wall(2.5,5,x,2.5,-0.6,barber?'#695548':'#5b6255');});a.wall(4,1.8,0,4.1,-0.6,barber?'#695548':'#5b6255');
b(3.85,0.18,0.3,m(colour),0,0.12,-0.3);b(3.85,0.42,0.3,m(colour),0,2.9,-0.3);[-1.9,0.55,1.9].forEach(function(x){b(0.1,2.65,0.3,m(colour),x,1.45,-0.3);});
a.text(barber?'BARBER':'MISTER JIMMY’S',3.5,0.38,0,2.9,-0.13,undefined,barber?'#382322':'#1c3631',36);
// A shallow lit shop bay visible through its open frontage.
b(3.65,0.05,2,a.wood,0,0.04,-1.4);a.wall(3.7,2.55,0,1.3,-2.4,barber?'#a79d80':'#a9ad94');
a.lamp(-0.5,2.4,-0.9,barber?0xffd69c:0xe2e8ce,1.5);a.lamp(1.4,2.6,0.5,barber?0xffd69c:0xdce3c6,0.6);[-1.83,1.82].forEach(function(x){b(0.08,2.6,1.8,m(colour),x,1.35,-1.45);});b(3.65,0.06,1.8,m(0x70664f),0,2.66,-1.45);
if(barber){
var poleTex=a.k.tex(128,256,function(c,w,h){c.fillStyle='#d9d2b7';c.fillRect(0,0,w,h);for(var n=-3;n<8;n++){c.fillStyle=n%2?'#283c59':'#933c38';c.beginPath();c.moveTo(0,n*64);c.lineTo(w,n*64-64);c.lineTo(w,n*64-42);c.lineTo(0,n*64+22);c.fill();}});poleTex.wrapT=T.RepeatWrapping;
var pole=a.m(new T.CylinderGeometry(0.10,0.10,0.85,24),new T.MeshStandardMaterial({map:poleTex,roughness:0.3,envMap:a.k.roomEnv,envMapIntensity:0.6}),-2.18,1.75,-0.10);
[1.29,2.21].forEach(function(y){a.m(new T.SphereGeometry(0.13,20,12),a.brass,-2.18,y,-0.1);});
b(0.7,0.09,0.62,m(0x542b29),-0.45,0.52,-1.25);b(0.7,0.65,0.10,m(0x542b29),-0.45,0.87,-1.55);a.m(new T.CylinderGeometry(0.07,0.10,0.42,16),a.brass,-0.45,0.25,-1.25);a.m(new T.CylinderGeometry(0.3,0.32,0.05,24),a.brass,-0.45,0.05,-1.25);
b(1.35,0.07,0.3,a.wood,-0.2,0.98,-2);var mir=a.m(new T.PlaneGeometry(1.1,1.15),null,-0.2,1.65,-2.31);a.k.makeMirror(mir,new T.Vector3(0,0,1),256,new T.Vector3(0.6,0.62,0.56));
a.k.ghost(0.35,0,-1.45,201,0.62,false,true,0.9);return {frame:function(t,dt,still){if(!still)poleTex.offset.y=-t*0.10;}};
}else{
b(2.8,0.95,0.45,m(0x30483c),-0.15,0.5,-1.55);b(2.9,0.06,0.55,a.wood,-0.15,1,-1.55);
[1.3,1.8,2.25].forEach(function(y,row){b(3.3,0.035,0.22,a.wood,0,y,-2.16);for(var n=0;n<12;n++){var x=-1.45+n*0.26;var bottle=m(n%3?0x5d6947:0x77512f,0.28);a.m(new T.CylinderGeometry(0.045,0.045,0.18,12),bottle,x,y+0.11,-2.12);b(0.065,0.08,0.005,m(0xd3ccb1),x,y+0.11,-2.068);b(0.06,0.035,0.06,m(0x27241d),x,y+0.22,-2.12);}});
a.k.ghost(0.25,0,-1.8,202,0.62,false,true,0.95);b(0.22,0.045,0.13,m(0xe4ddbd),-0.4,1.05,-1.3);
}
});}shop('barber');shop('jimmy');
arrival('pb','LACKLAND’S BACK ROOM','INTO THE BACK ROOM',[2.4,1.6,4.8,0,0.9,-0.8],function(a){var b=a.box,m=a.mat,T=a.T;a.floor(6,9,0,'#443528');a.wall(6,3,0,1.5,-3,'#a49b7f');[-3,3].forEach(function(x){var w=a.wall(9,3,x,1.5,0,'#807a64');w.rotation.y=Math.PI/2;});b(6,0.08,9,m(0x716a57),0,3,0);
var top=b(1.525,0.035,2.74,m(0x224d42),0,0.76,-0.5);top.receiveShadow=true;
[-0.72,0.72].forEach(function(x){b(0.018,0.002,2.70,m(0xd4d1b7),x,0.779,-0.5);});[-1.85,0.85].forEach(function(z){b(1.5,0.002,0.018,m(0xd4d1b7),0,0.779,z);});b(0.014,0.002,2.7,m(0xd4d1b7),0,0.779,-0.5);
[-0.6,0.6].forEach(function(x){[-1.4,0.4].forEach(function(z){b(0.05,0.72,0.05,m(0x242b28),x,0.38,z);});});
var net=a.k.tex(256,64,function(c,w,h){c.clearRect(0,0,w,h);c.strokeStyle='#b8b9a2';c.lineWidth=1;for(var x=0;x<w;x+=8){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}for(var y=0;y<h;y+=8){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}});
a.m(new T.PlaneGeometry(1.63,0.15),new T.MeshStandardMaterial({map:net,transparent:true,side:T.DoubleSide,roughness:0.9}),0,0.86,-0.5);[-0.82,0.82].forEach(function(x){b(0.018,0.19,0.018,a.brass,x,0.85,-0.5);});
a.k.ghost(-0.3,0,-2.25,301,0.62,false,true,1);a.k.ghost(0.25,0,1.3,302,0.62,false,true,1);a.lamp(0,2.35,-0.5,0xffe0a7,1.9);a.m(new T.CylinderGeometry(0.09,0.28,0.16,24,1,true),m(0x294c35),0,2.44,-0.5);b(0.01,0.5,0.01,a.wood,0,2.75,-0.5);a.door(1.6,-2.9,0x473e2d);
[-1,1].forEach(function(side){var strip=b(0.04,0.13,8.8,a.wood,side*2.93,0.12,0);b(0.045,0.06,8.8,a.wood,side*2.93,1.12,0);});
b(6,0.13,0.04,a.wood,0,0.12,-2.92);a.text('21',0.32,0.22,-1.75,1.85,-2.90);b(1.1,0.5,0.12,m(0x797c67),-1.6,0.45,-2.85);for(var fin=0;fin<10;fin++)b(0.025,0.45,0.035,m(0xa1a18a),-2.05+fin*0.1,0.45,-2.77);
b(0.38,0.06,2.1,a.wood,-2.65,0.46,-0.4);[-1.1,0.3].forEach(function(z){b(0.05,0.43,0.05,a.wood,-2.65,0.23,z);});
var bat=a.m(new T.CylinderGeometry(0.075,0.075,0.012,24),m(0x602a25),-2.6,0.51,-0.5);b(0.025,0.016,0.11,a.wood,-2.6,0.51,-0.39);
var ball=a.m(new T.SphereGeometry(0.02,16,12),m(0xeee6c4,0.6),0.3,0.81,0.3);return {frame:function(t,dt,still){if(!still){ball.position.set(0.3+Math.sin(t*1.7)*0.25,0.83+Math.abs(Math.sin(t*2))*0.13,0.25);}}};
});
arrival('gt','THE COACH AND HORSES — GENTS','STEADY YOURSELF',[0.65,1.5,1.7,-0.1,1.2,-1.25],function(a){var b=a.box,m=a.mat,T=a.T;
var gf=a.pavement(2.8,3.8,0);gf.material.color.setHex(0x858e7c);a.tilewall(2.8,2.55,0,1.275,-1.8,'#c6c4a9');[-1.4,1.4].forEach(function(x){var side=a.tilewall(3.8,2.55,x,1.275,0,'#c6c4a9');side.rotation.y=Math.PI/2;});b(2.8,0.08,3.8,m(0x8f927b),0,2.55,0);
var basin=a.m(new T.SphereGeometry(1,32,16),m(0xc7c8b3,0.3),-0.7,0.83,-1.48);basin.scale.set(0.46,0.15,0.32);var bowl=a.m(new T.SphereGeometry(1,24,12),m(0x6e796c,0.35),-0.7,0.94,-1.42);bowl.scale.set(0.31,0.024,0.22);
a.m(new T.CylinderGeometry(0.027,0.027,0.65,12),a.brass,-0.7,0.43,-1.58);[-0.94,-0.46].forEach(function(x){a.m(new T.CylinderGeometry(0.013,0.013,0.15,12),a.k.M.chrome,x,1.01,-1.63);b(0.065,0.012,0.018,a.k.M.chrome,x,1.085,-1.63);});
b(1.05,0.98,0.04,a.wood,-0.7,1.72,-1.74);var mir=a.m(new T.PlaneGeometry(0.97,0.90),null,-0.7,1.72,-1.71);a.k.makeMirror(mir,new T.Vector3(0,0,1),256,new T.Vector3(0.52,0.62,0.51));
a.door(0.72,-1.71,0x3c463a);a.text('GENTS',0.38,0.16,0.72,1.8,-1.63);
var drain=a.m(new T.CircleGeometry(0.09,24),m(0x171c17),0.4,0.006,0.1);drain.rotation.x=-Math.PI/2;for(var i=-2;i<=2;i++)b(0.13,0.004,0.006,a.brass,0.4,0.009,0.1+i*0.025);
// Wall urinals, with dark recessed bowls and exposed flush pipes.
[-0.35,0.65].forEach(function(z){var ceramic=m(0xc8cbb5,0.32);var u=a.m(new T.SphereGeometry(1,24,16),ceramic,-1.21,0.78,z);u.scale.set(0.20,0.40,0.25);var inside=a.m(new T.SphereGeometry(1,20,12),m(0x748270,0.4),-1.015,0.83,z);inside.scale.set(0.012,0.25,0.16);b(0.025,0.62,0.025,a.k.M.chrome,-1.21,1.43,z);b(0.11,0.055,0.06,a.brass,-1.17,1.73,z);});
a.lamp(-0.4,2.3,-0.7,0xc5d7b1,1.2);b(0.65,0.045,0.12,m(0xe4e8cf),-0.4,2.35,-0.7);b(0.22,0.28,0.14,m(0x65685a),-1.14,1.2,-1.62);
});
})();
// <<<< FIVE SMALL ARRIVALS END
