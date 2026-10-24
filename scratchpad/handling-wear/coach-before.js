// ====== INSIDE THE COACH AND HORSES — THE ROOM, WITH CLOSE-UPS ======
// 2026-09-30. Built from what is written of the Coach and Horses at 29
// Greek Street, Norman Balon's pub: one long Victorian bar with its brass
// rail and its optics, a mirror behind, dark panelling to the dado, etched
// and frosted windows onto Greek Street and Romilly Street with the lamps
// outside them, stools, a telephone behind the bar, the gents through a
// door at the back; and from the passage: Jeffrey Bernard at the bar and,
// in the bar, his cow. The room sits at the top of the Coach
// and Horses bar passage (#cb-container) and is its navigation: the cow
// opens "Ride the beast" when the passage offers it, the telephone opens the
// game's own ringing modal. Bernard, the optics, the windows, the door, the
// gents and the glass on the bar are inspections, their card words pink
// placeholders for Sam. Nothing about the game is decided in JS.
window.dssRoomKit({
id: 'cb', caption: 'THE COACH AND HORSES, GREEK STREET', captionColor: 'rgba(220,180,110,0.25)',
bg: 0x17130f, fog: [0x30251b, 0.036], exposure: 0.63, bloom: { bloomStrength: 0.2, bloomRadius: 0.5, bloomThreshold: 0.86 },
env: ['#8b7858', '#654b2e', '#20170e', '#dfc38e'],
wash: 'linear-gradient(180deg,rgba(20,12,6,0.12) 0%,rgba(10,6,4,0.05) 35%,rgba(10,6,4,0.05) 60%,rgba(4,2,1,0.23) 100%)',
vignette: 'radial-gradient(ellipse at 50% 44%,transparent 40%,rgba(0,0,0,.5) 100%)',
card: { fg: 'rgba(230,214,180,0.92)', bg: 'rgba(10,6,3,0.8)', border: 'rgba(210,170,100,0.3)', dim: 'rgba(200,180,140,0.5)', btn: 'rgba(240,220,170,0.95)', btnBorder: 'rgba(210,170,100,0.45)' },
// Keep the narrow preview camera inside the front wall at z=3.5.
cam: function(portrait) { return portrait ? { x: 0.2, y: 1.5, z: 2.9, tx: 0.0, ty: 1.15, tz: -2.4 } : { x: 0.4, y: 1.5, z: 2.7, tx: -0.1, ty: 1.2, tz: -2.4 }; },
build: function(k) {
var scene = k.scene, mesh = k.mesh, tex = k.tex, rnd = k.rnd, M = k.M;
var detail=window.dssDetailProps(mesh,tex,k.roomEnv,scene);
var W = 8.0, D = 7.0, H = 4.2;
// ---------- THE ROOM: panelling to the dado, nicotine paint above, a tongue-and-groove ceiling, boards ----------
var wallPaint = k.paintTex('#53615b', 11, 'rgba(45,59,48,0.12)');
var wallMat = new THREE.MeshStandardMaterial({ map: wallPaint, bumpMap: wallPaint, bumpScale: 0.008, roughness: 0.94 });
var panelTex = k.woodTex('#845a33', '#392616', 5); panelTex.wrapS = panelTex.wrapT = THREE.RepeatWrapping;
// Worn cream-and-chocolate tiles, as in the reference photographs.
function smokeStain(texture,seed){var cv=texture.image,cx=cv.getContext('2d'),w=cv.width,h=cv.height;
for(var n=0;n<22;n++){var x=rnd(seed+n*3)*w,y=rnd(seed+n*7)*h,r=20+rnd(seed+n*11)*w*.3;
var g=cx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(27,17,10,.19)');g.addColorStop(1,'rgba(27,17,10,0)');cx.fillStyle=g;cx.fillRect(x-r,y-r,r*2,r*2);}
var soot=cx.createLinearGradient(0,0,0,h);soot.addColorStop(0,'rgba(19,13,9,.27)');soot.addColorStop(.28,'rgba(19,13,9,0)');soot.addColorStop(1,'rgba(19,13,9,.18)');cx.fillStyle=soot;cx.fillRect(0,0,w,h);
texture.needsUpdate=true;}
smokeStain(panelTex,29);smokeStain(wallPaint,64);
var tileTex=tex(1024,1024,function(cx,w,h){
for(var row=0;row<8;row++)for(var col=0;col<8;col++){
var x=col*128,y=row*128;cx.fillStyle=(row+col)%2?'#382a25':'#b5a482';cx.fillRect(x,y,128,128);
cx.strokeStyle='rgba(33,26,21,.42)';cx.lineWidth=3;cx.strokeRect(x+1,y+1,126,126);
for(var n=0;n<140;n++){cx.fillStyle=n%2?'rgba(246,225,185,.08)':'rgba(30,25,20,.07)';cx.fillRect(x+rnd(n+row*931+col*71)*128,y+rnd(n*7+row*17+col*39)*128,1+rnd(n)*9,1);}
}});tileTex.wrapS=tileTex.wrapT=THREE.RepeatWrapping;tileTex.repeat.set(1.7,1.5);
var floor=mesh(new THREE.PlaneGeometry(W,D),new THREE.MeshStandardMaterial({map:tileTex,bumpMap:tileTex,bumpScale:.003,roughness:.48,envMap:k.roomEnv,envMapIntensity:.48}),0,0,0);floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;
// Sweeping combed-plaster fans, with a shallow relief that picks up chandelier light.
var ceilTex=tex(1024,1024,function(cx,w,h){cx.fillStyle='#682f3e';cx.fillRect(0,0,w,h);
for(var row=-1;row<8;row++)for(var col=-1;col<8;col++){
var x=col*160+(row%2)*80,y=row*150,turn=.2+((row+col)%3)*.16;
for(var ring=0;ring<23;ring++){var r=18+ring*4.9;
cx.strokeStyle='rgba(43,13,24,.28)';cx.lineWidth=1.4;cx.beginPath();cx.arc(x,y,r,turn,turn+Math.PI*1.26);cx.stroke();
cx.strokeStyle='rgba(189,108,129,.4)';cx.lineWidth=1.3;cx.beginPath();cx.arc(x,y+1.6,r+1.6,turn,turn+Math.PI*1.26);cx.stroke();}
}
for(var n=0;n<12000;n++){cx.fillStyle=n%2?'rgba(25,5,15,.045)':'rgba(211,139,151,.08)';cx.fillRect(rnd(n+32)*w,rnd(n*7+19)*h,1,1);}
});ceilTex.wrapS=ceilTex.wrapT=THREE.RepeatWrapping;ceilTex.repeat.set(2,1.75);
var ceil=mesh(new THREE.PlaneGeometry(W,D),new THREE.MeshStandardMaterial({map:ceilTex,bumpMap:ceilTex,bumpScale:.035,roughness:.68,envMap:k.roomEnv,envMapIntensity:.2}),0,H,0);ceil.rotation.x=Math.PI/2;
var back = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2); back.receiveShadow = true;
var front = mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, D / 2); front.rotation.y = Math.PI;
var left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -6.2, H / 2, 0); left.rotation.y = Math.PI / 2; left.receiveShadow = true;
var right = mesh(new THREE.PlaneGeometry(D, H), wallMat, W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2; right.receiveShadow = true;
var honeyOak=new THREE.MeshPhysicalMaterial({map:panelTex,roughness:.44,clearcoat:.42,clearcoatRoughness:.3,envMap:k.roomEnv,envMapIntensity:.65});
var oakTrim=new THREE.MeshStandardMaterial({color:0xb1844b,roughness:.4,envMap:k.roomEnv,envMapIntensity:.4});
function dado(len,x,z,ry){
var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;scene.add(g);
mesh(new THREE.BoxGeometry(len,2.23,.055),honeyOak,0,1.115,0,g);
[.15,2.2].forEach(function(y){mesh(new THREE.BoxGeometry(len,.10,.10),oakTrim,0,y,.035,g);});
for(var n=0;n<len/.58;n++){var px=-len/2+n*.58;mesh(new THREE.BoxGeometry(.045,2.05,.07),oakTrim,px,1.15,.035,g);}
return g;
}
dado(D,-6.185,0,Math.PI/2);dado(D,W/2-.015,0,-Math.PI/2);dado(W,0,D/2-.015,Math.PI);
var cornice=new THREE.MeshStandardMaterial({color:0xe1d6bc,roughness:.65});
[[W,0,-D/2+.06,0],[W,0,D/2-.06,0],[D,-6.14,0,Math.PI/2],[D,W/2-.06,0,Math.PI/2]].forEach(function(c){[H-.06,H-.16].forEach(function(y){var m=mesh(new THREE.BoxGeometry(c[0],.07,.13),cornice,c[1],y,c[2]);m.rotation.y=c[3];});});
// The neighbouring bar is indoors, continuing the same tiled floor and burgundy ceiling.
var sideFloorMat=floor.material.clone();sideFloorMat.map=floor.material.map.clone();sideFloorMat.map.repeat.x*=2.2/W;sideFloorMat.map.needsUpdate=true;sideFloorMat.bumpMap=sideFloorMat.map;
var sideFloor=mesh(new THREE.PlaneGeometry(2.2,D),sideFloorMat,-5.1,.0,0);sideFloor.rotation.x=-Math.PI/2;sideFloor.receiveShadow=true;
var sideCeil=mesh(new THREE.PlaneGeometry(2.2,D),ceil.material,-5.1,H,0);sideCeil.rotation.x=Math.PI/2;
mesh(new THREE.PlaneGeometry(2.2,H),wallMat,-5.1,H/2,-D/2);
var sideFront=mesh(new THREE.PlaneGeometry(2.2,H),wallMat,-5.1,H/2,D/2);sideFront.rotation.y=Math.PI;
// Tall panelled room divisions: all story objects remain on the main bar/gents side.
// The left-hand snug opens through a broad portal; the bar room continues to its right.
var partitions=new THREE.Group();scene.add(partitions);
function partitionPanel(x,z,len,ry){
var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;partitions.add(g);
mesh(new THREE.BoxGeometry(len,H,.12),honeyOak,0,H/2,0,g);
[.12,2.2,H-.12].forEach(function(y){mesh(new THREE.BoxGeometry(len,.10,.18),oakTrim,0,y,0,g);});
for(var n=0;n<=Math.ceil(len/.55);n++){var px=-len/2+n*len/Math.ceil(len/.55);mesh(new THREE.BoxGeometry(.055,H,.18),oakTrim,px,H/2,0,g);}
return g;}

// Oak-panelled left wall with a genuine floor-to-lintel opening into the next compartment.
var divideX=-2.8,openingNear=1.1,openingFar=-.9;
var dividerEnd=-1.99; // stops at the customer edge of the bar; service area behind stays continuous
partitionPanel(divideX,(dividerEnd+openingFar)/2,openingFar-dividerEnd,Math.PI/2);
partitionPanel(divideX,(openingNear+D/2)/2,D/2-openingNear,Math.PI/2);
// Open passage: no glass, sill or panel crosses the walking space.
[openingFar,openingNear].forEach(function(z){mesh(new THREE.BoxGeometry(.18,2.45,.14),oakTrim,divideX,1.225,z,partitions);});
mesh(new THREE.BoxGeometry(.18,.15,openingNear-openingFar+.14),oakTrim,divideX,2.47,(openingNear+openingFar)/2,partitions);
mesh(new THREE.BoxGeometry(.12,H-2.55,openingNear-openingFar),honeyOak,divideX,2.55+(H-2.55)/2,(openingNear+openingFar)/2,partitions);
mesh(new THREE.BoxGeometry(.16,.1,openingNear-openingFar+.15),cornice,divideX,H-.08,(openingNear+openingFar)/2,partitions);
// Framed cartoons and photographs interrupt the panelling, rather than bare expanses.
function framedPrint(x,y,z,ry,seed){
var art=tex(256,192,function(cx,w,h){cx.fillStyle='#e1d7bb';cx.fillRect(0,0,w,h);cx.strokeStyle='#6e6251';cx.lineWidth=1.2;
for(var n=0;n<4;n++){var px=36+n*52,py=55+rnd(seed+n)*35;cx.beginPath();cx.ellipse(px,py,12,16,(rnd(n)-.5)*.3,0,Math.PI*2);cx.moveTo(px-17,py+49);cx.quadraticCurveTo(px,py+10,px+18,py+49);cx.stroke();}
for(var n=0;n<28;n++){cx.strokeStyle='rgba(72,61,49,.18)';cx.beginPath();cx.moveTo(15+rnd(seed+n)*220,140+rnd(n+5)*28);cx.lineTo(20+rnd(seed+n)*220,140+rnd(n+5)*28);cx.stroke();}});
var g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;scene.add(g);mesh(new THREE.BoxGeometry(.58,.43,.035),M.darkWood,0,0,0,g);mesh(new THREE.PlaneGeometry(.5,.35),new THREE.MeshStandardMaterial({map:art,roughness:.8}),0,0,.022,g);
}
[[divideX+.08,1.63,-1.7,Math.PI/2],[3.42,2.7,-3.43,0],[3.94,1.93,-.1,-Math.PI/2],[3.94,1.3,.15,-Math.PI/2],[3.94,1.8,2.5,-Math.PI/2],[-3.94,2.3,2.6,Math.PI/2]].forEach(function(p,i){framedPrint(p[0],p[1],p[2],p[3],i+11);});
// The opening looks into another panelled bar, not onto the street.
var winLights=[];
// ---------- THE BAR along the back wall: mahogany, a brass rail, the optics, the mirror ----------
var barG = new THREE.Group(); scene.add(barG);
var barZ = -D / 2 + 1.1, barLen = 4.8;
var mahog = new THREE.MeshPhysicalMaterial({ map: panelTex, bumpMap: panelTex, bumpScale: 0.002, roughness: 0.26, envMap: k.roomEnv, envMapIntensity: 1.0, metalness: 0.02, clearcoat: 0.9, clearcoatRoughness: 0.19 });
var body = mesh(new THREE.BoxGeometry(barLen, 1.1, 0.6), mahog, 0, 0.55, barZ, barG); body.castShadow = true;
// Rounded oak bar ends, moulded rim and pale stone foot plinth.
for(var end=1;end<2;end++){var ex=(end?1:-1)*barLen/2;
mesh(new THREE.CylinderGeometry(.3,.3,1.1,32),mahog,ex,.55,barZ,barG).castShadow=true;
mesh(new THREE.CylinderGeometry(.39,.39,.065,32),mahog,ex,1.13,barZ,barG);
mesh(new THREE.CylinderGeometry(.44,.44,.10,32),new THREE.MeshStandardMaterial({color:0xc5b797,roughness:.73}),ex,.05,barZ,barG);
}
mesh(new THREE.BoxGeometry(barLen,.1,.85),new THREE.MeshStandardMaterial({color:0xc5b797,roughness:.73}),0,.05,barZ,barG);
for(var pn=0;pn<9;pn++){mesh(new THREE.BoxGeometry(.035,.9,.025),oakTrim,-barLen/2+.2+pn*((barLen-.4)/8),.55,barZ+.315,barG);}
mesh(new THREE.BoxGeometry(barLen+.1,.065,.78),mahog,0,1.13,barZ,barG);
mesh(new THREE.BoxGeometry(barLen,.065,.05),oakTrim,0,1.07,barZ+.32,barG);
// A subtle planar reflection retains the actual lamp shapes in the polished counter.
var counterReflection=mesh(new THREE.PlaneGeometry(barLen+3.3,.68),M.hidden,-1.65,1.165,barZ,barG);counterReflection.rotation.x=-Math.PI/2;
k.makeMirror(counterReflection,new THREE.Vector3(0,1,0),k.portrait?256:512,new THREE.Vector3(.66,.46,.25),{transparent:true,edge:'0.12'});
var rail = mesh(new THREE.CylinderGeometry(0.02, 0.02, barLen, 10), M.brass, 0, 0.22, barZ + 0.5, barG); rail.rotation.z = Math.PI / 2;
for (var rb = 0; rb < 5; rb++) mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8), M.brass, -barLen / 2 + 0.4 + rb * ((barLen-.8)/4), 0.22, barZ + 0.42, barG).rotation.x = Math.PI / 2;
// The same counter continues left into the second bar, with no partition behind it.
var otherBar=new THREE.Group();barG.add(otherBar);
mesh(new THREE.BoxGeometry(3.3,1.1,.6),mahog,-4.05,.55,barZ,otherBar).castShadow=true;
mesh(new THREE.BoxGeometry(3.3,.065,.78),mahog,-4.05,1.13,barZ,otherBar);
mesh(new THREE.BoxGeometry(3.3,.1,.85),new THREE.MeshStandardMaterial({color:0x9a8b70,roughness:.8}),-4.05,.05,barZ,otherBar);
mesh(new THREE.BoxGeometry(3.3,.065,.05),oakTrim,-4.05,1.07,barZ+.32,otherBar);
var otherRail=mesh(new THREE.CylinderGeometry(.02,.02,3.3,10),M.brass,-4.05,.22,barZ+.5,otherBar);otherRail.rotation.z=Math.PI/2;
mesh(new THREE.BoxGeometry(3.3,1.3,.35),mahog,-4.05,.65,-D/2+.18,otherBar);
var otherMirror=mesh(new THREE.PlaneGeometry(3.1,1.2),null,-4.05,2.05,-D/2+.035,otherBar);k.makeMirror(otherMirror,new THREE.Vector3(0,0,1),256,new THREE.Vector3(.56,.47,.32),{edge:'0.08'});
[1.4,2.05,2.72].forEach(function(y){mesh(new THREE.BoxGeometry(3.3,.07,.24),mahog,-4.05,y,-D/2+.14,otherBar);});
for(var nb=0;nb<16;nb++){var bx=-5.5+(nb%8)*.38,by=1.45+Math.floor(nb/8)*.65;mesh(new THREE.CylinderGeometry(.035,.04,.23,8),new THREE.MeshStandardMaterial({color:[0x4a4c22,0x704b25,0x303e30][nb%3],roughness:.3,envMap:k.roomEnv,envMapIntensity:.4}),bx,by+.115,-D/2+.2,otherBar);}
var otherLamp=new THREE.PointLight(0xffc185,.65,5,1.7);otherLamp.position.set(-4.6,2.8,-1.4);scene.add(otherLamp);
// the back-bar: shelves, the mirror, the optics on their brackets, the till, the pumps on the counter
mesh(new THREE.BoxGeometry(barLen, 1.3, 0.35), mahog, 0, 0.65, -D / 2 + 0.18, barG);
mesh(new THREE.BoxGeometry(barLen + 0.2, 0.05, 0.45), mahog, 0, 1.32, -D / 2 + 0.22, barG);
var mir = mesh(new THREE.PlaneGeometry(barLen - 0.4, 1.3), null, 0, 2.05, -D / 2 + 0.02); k.makeMirror(mir, new THREE.Vector3(0, 0, 1), k.portrait ? 512 : 1024, new THREE.Vector3(0.7, 0.66, 0.6), { edge: '0.08' });
mesh(new THREE.BoxGeometry(barLen - 0.3, 0.08, 0.1), mahog, 0, 2.74, -D / 2 + 0.05, barG); mesh(new THREE.BoxGeometry(barLen - 0.3, 0.08, 0.1), mahog, 0, 1.38, -D / 2 + 0.05, barG);
for (var col = 0; col < 4; col++) mesh(new THREE.BoxGeometry(0.08, 1.4, 0.08), mahog, -barLen / 2 + 0.2 + col * (barLen - 0.4) / 3, 2.06, -D / 2 + 0.06, barG);
var fascia=tex(1024,96,function(cx,w,h){cx.fillStyle='#9e713b';cx.fillRect(0,0,w,h);cx.fillStyle='#ecd6a1';cx.textAlign='center';cx.textBaseline='middle';cx.font='bold 30px Georgia,serif';cx.fillText('IND COOPE                         SKOL LAGER',w/2,h/2);});
mesh(new THREE.PlaneGeometry(barLen+.1,.23),new THREE.MeshStandardMaterial({map:fascia,roughness:.45,emissive:0x4b3515,emissiveIntensity:.22}),0,2.87,-D/2+.12,barG);
// the optics: a row of inverted bottles on brass brackets, each with its measure
var botCols = [0x7a4a18, 0xa08030, 0x2a5a2a, 0xc8c0a0, 0x8a2a1a, 0x1a2a5a, 0xd0a040];
var optics = new THREE.Group(); optics.position.set(0, 1.95, -D / 2 + 0.16); scene.add(optics);
mesh(new THREE.BoxGeometry(5.6, 0.9, 0.4), M.hidden, 0, 0.2, 0, optics);
for (var o = 0; o < 9; o++) {
var bm = new THREE.MeshPhysicalMaterial({ color: botCols[o % botCols.length], roughness: 0.15, metalness: 0.04, envMap: k.roomEnv, envMapIntensity: 0.9, clearcoat: 0.9, transparent: true, opacity: 0.86 });
var ox = -2.4 + o * 0.6;
var bottleG=detail.group(ox,0.455,0,optics);bottleG.rotation.z=Math.PI;detail.bottle(bottleG,0.34,0.04,botCols[o%botCols.length],o);
mesh(new THREE.BoxGeometry(0.03, 0.03, 0.12), M.brass, ox, 0.0, -0.04, optics); mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.06, 8), M.chrome, ox, -0.05, 0, optics);
mesh(new THREE.CylinderGeometry(0.014,0.014,0.6,10),M.brass,ox,0.24,-0.1,optics);
detail.arc(optics,0.021,0.002,M.chrome,ox,-0.078,0);mesh(new THREE.BoxGeometry(0.035,0.006,0.014),M.chrome,ox,-0.04,0.028,optics);
mesh(new THREE.BoxGeometry(0.055,0.018,0.016),detail.material('#80704c','metal'),ox,0.49,-0.1,optics);
}
mesh(new THREE.BoxGeometry(barLen - 0.5, 0.03, 0.1), M.brass, 0, 0.5, -0.1, optics);
var optLight = new THREE.PointLight(0xffd090, 0.62, 5, 1.6); optLight.position.set(0, 2.6, -D / 2 + 0.6); scene.add(optLight);
var optGlow = k.glow(0, 2.6, -D / 2 + 0.5, 1.4, 0.3, 0xffd090);
for (var sh = 0; sh < 2; sh++) for (var b = 0; b < 10; b++) { if (rnd(sh * 30 + b) < 0.2) continue; var bh = 0.2 + rnd(b + sh * 9) * 0.1, br = 0.028; var bmat = new THREE.MeshPhysicalMaterial({ color: botCols[(b + sh * 3) % botCols.length], roughness: 0.18, envMap: k.roomEnv, envMapIntensity: 0.8, clearcoat: 0.8, transparent: true, opacity: 0.88 }); mesh(new THREE.CylinderGeometry(br, br, bh, 10), bmat, -2.6 + b * 0.55 + (rnd(b * 7 + sh) - 0.5) * 0.08, 1.35 + sh * 0.65 + bh / 2, -D / 2 + 0.2, barG); mesh(new THREE.CylinderGeometry(br * 0.35, br * 0.6, bh * 0.35, 8), bmat, -2.6 + b * 0.55 + (rnd(b * 7 + sh) - 0.5) * 0.08, 1.35 + sh * 0.65 + bh * 1.16, -D / 2 + 0.2, barG); }
mesh(new THREE.BoxGeometry(barLen - 0.6, 0.03, 0.3), M.darkWood, 0, 1.98, -D / 2 + 0.2, barG);
// beer pumps on the counter with their ceramic handles, the till, a bowl of pickled eggs, the ashtrays
for (var pm = 0; pm < 4; pm++) { var px = -1.6 + pm * 0.5; mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.34, 10), M.brass, px, 1.33, barZ - 0.1, barG); var hdl = mesh(new THREE.LatheGeometry([[0,-0.13],[0.017,-0.13],[0.02,-0.08],[0.018,-0.04],[0.029,0.07],[0.024,0.12],[0,0.13]].map(function(p){return new THREE.Vector2(p[0],p[1]);}),24), new THREE.MeshStandardMaterial({ color: [0xe8e0d0, 0x1a1a1a, 0xe8e0d0, 0x8a1a1a][pm], roughness: 0.3, envMap: k.roomEnv, envMapIntensity: 0.5 }), px, 1.6, barZ - 0.06, barG); hdl.rotation.x = 0.35;
detail.wire([[px,1.38,barZ-0.1],[px+0.09,1.37,barZ-0.1],[px+0.11,1.31,barZ-0.1]],0.008,M.brass,barG); mesh(new THREE.PlaneGeometry(0.05, 0.08), M.paper, px, 1.6, barZ - 0.03, barG); }
// Old mechanical register: charcoal enamel, dull nickel and yellowed keys.
var till=new THREE.Group();till.position.set(2.5,1.345,-D/2+0.35);till.rotation.y=0;barG.add(till);
var tillWear=tex(256,256,function(cx,w,h){
 cx.fillStyle='#88877e';cx.fillRect(0,0,w,h);
 for(var n=0;n<900;n++){cx.fillStyle=n%5?'rgba(213,207,188,0.06)':'rgba(33,31,26,0.18)';cx.fillRect((n*47)%w,(n*83)%h,1+n%4,1);}
 for(var n=0;n<18;n++){cx.strokeStyle='rgba(214,208,187,0.23)';cx.lineWidth=0.5;cx.beginPath();cx.moveTo((n*37)%w,(n*67)%h);cx.lineTo((n*37)%w+8,(n*67)%h-1);cx.stroke();}
});
var tillEnamel=new THREE.MeshStandardMaterial({map:tillWear,color:0x454b45,roughness:0.48,metalness:0.25,envMap:k.roomEnv,envMapIntensity:0.35});
var tillNickel=new THREE.MeshStandardMaterial({color:0xaaa18b,roughness:0.57,metalness:0.65,envMap:k.roomEnv,envMapIntensity:0.3});
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
for(var keyIndex=0;keyIndex<10;keyIndex++){
 var keyMap=tex(64,64,function(cx,w,h){cx.fillStyle='#c5baa0';cx.fillRect(0,0,w,h);cx.fillStyle='#403a2c';cx.textAlign='center';cx.textBaseline='middle';cx.font='34px Georgia';cx.fillText(String(keyIndex),32,34);});
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


detail.lathe([[0,0],[0.09,0],[0.1,0.015],[0.12,0.22],[0.116,0.22],[0.096,0.018],[0,0.018]],detail.glass,1.7,1.16,barZ-0.1,barG);detail.arc(barG,0.118,0.0018,detail.glass,1.7,1.38,barZ-0.1);
for (var eg = 0; eg < 5; eg++) mesh(new THREE.SphereGeometry(0.03, 8, 6), new THREE.MeshStandardMaterial({ color: 0xd8c8a0, roughness: 0.6 }), 1.7 + (rnd(eg) - 0.5) * 0.1, 1.2 + eg * 0.03, barZ - 0.1 + (rnd(eg + 3) - 0.5) * 0.1, barG);
var ashMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.3, metalness: 0.2, envMap: k.roomEnv, envMapIntensity: 0.4 });
[-2.4, -0.4, 1.2].forEach(function(ax) { detail.ash(ax,1.16,barZ+0.1,barG,0.05); });
// Rolled tab paper, the printed tail lying flat beside the towel.
var roll=mesh(new THREE.CylinderGeometry(0.022,0.022,0.06,24),detail.material('#d7cdb4','paper'),0.95,1.185,barZ-0.05,barG);roll.rotation.z=Math.PI/2;
var rollCore=mesh(new THREE.CylinderGeometry(0.006,0.006,0.061,12),detail.material('#655846','paper'),0.95,1.185,barZ-0.05,barG);rollCore.rotation.z=Math.PI/2;
var tail=mesh(new THREE.PlaneGeometry(0.06,0.13),detail.material('#d7cdb4','paper'),0.95,1.164,barZ+0.035,barG);tail.rotation.x=-Math.PI/2;
// the till roll of the night's tab and a bar towel
var towel=detail.cloth(0.34,0.22,0.5,1.175,barZ+0.05,barG,'#3c4b62',true);towel.rotation.x=-Math.PI/2;
// the barman, a trace behind the pumps, not looking at you
var barman = k.ghost(-0.9, 0, -D / 2 + 0.6, 11, 0.2, false, false, 1.0);
// ---------- THE TELEPHONE behind the bar, at the far end ----------
var phoneG = new THREE.Group(); phoneG.position.set(-2.35, 1.335, -D / 2 + 0.3); phoneG.rotation.y = 0.5; scene.add(phoneG);
var bakelite = new THREE.MeshStandardMaterial({ color: 0x16120f, roughness: 0.26, metalness: 0.08, envMap: k.roomEnv, envMapIntensity: 0.55 });
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
var phoneHit = mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), M.hidden, 0, 0.15, 0, phoneG);
// ---------- THE STOOLS, and JEFFREY BERNARD on his, and THE COW in the bar ----------
var leatherMat = new THREE.MeshStandardMaterial({ color: 0x5a1a14, roughness: 0.7, envMap: k.roomEnv, envMapIntensity: 0.2 });
function stool(x, z) { var g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g); var seat=mesh(new THREE.SphereGeometry(1,24,12),detail.material('#682c24','cloth'),0,0.72,0,g);seat.scale.set(0.18,0.044,0.18);detail.arc(g,0.175,0.0025,detail.material('#98644b','cloth'),0,0.716,0); mesh(new THREE.TorusGeometry(0.18, 0.012, 6, 24), M.brass, 0, 0.69, 0, g).rotation.x = Math.PI / 2; mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.66, 8), M.darkWood, 0, 0.35, 0, g); mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.03, 16), M.darkWood, 0, 0.02, 0, g); [0, 1, 2].forEach(function(l) { var lg = mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.62, 6), M.darkWood, Math.cos(l * 2.09) * 0.13, 0.33, Math.sin(l * 2.09) * 0.13, g); lg.rotation.z = -Math.cos(l * 2.09) * 0.25; lg.rotation.x = Math.sin(l * 2.09) * 0.25; }); return g; }
[-2.4, -1.5, 0.9, 1.9, 2.8].forEach(function(sx) { stool(sx, barZ + 0.85); });
stool(-3.7,barZ+.85);stool(-4.8,barZ+.85);
var bernardStool = stool(-0.3, barZ + 0.85);
var bernard = k.ghost(-0.3, 0.3, barZ + 0.9, 13, 0.52, true, true, 1.05);          // Jeffrey Bernard, unwell, on his stool
// his glass, a large one, and the betting slip half under its wet ring
var vodkaMat = new THREE.MeshStandardMaterial({ color: 0xe8e8e0, roughness: 0.05, transparent: true, opacity: 0.35, envMap: k.roomEnv, envMapIntensity: 1 });
var glassG = new THREE.Group(); glassG.position.set(0.45, 1.165, barZ + 0.2); scene.add(glassG);
detail.cup(glassG,0.035,0.11);
mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.05, 14), vodkaMat, 0, 0.03, 0, glassG);
mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.02, 6), new THREE.MeshStandardMaterial({ color: 0xe8e0c0, roughness: 0.6 }), 0.01, 0.06, 0.005, glassG);
var slip = mesh(new THREE.PlaneGeometry(0.09, 0.06), new THREE.MeshStandardMaterial({map:tex(128,96,function(c,w,h){c.fillStyle='#d6ccb1';c.fillRect(0,0,w,h);c.fillStyle='#776b53';for(var row=0;row<10;row++)c.fillRect(7,12+row*7,80+row%3*12,1);c.strokeStyle='rgba(123,86,35,0.2)';c.lineWidth=2;c.beginPath();c.arc(87,58,32,0,6.3);c.stroke();}),roughness:1}),0.04,0.002,0.03,glassG); slip.rotation.x = -Math.PI / 2; slip.rotation.z = 0.4;
mesh(new THREE.TorusGeometry(0.032, 0.004, 6, 20), new THREE.MeshStandardMaterial({ color: 0x8a7a50, roughness: 0.4, transparent: true, opacity: 0.4 }), 0, 0.001, 0, glassG).rotation.x = Math.PI / 2;
var glassHit = mesh(new THREE.BoxGeometry(0.24, 0.2, 0.2), M.hidden, 0, 0.08, 0, glassG);
// The cow stands in the bar room, clear of the counter, showing its full silhouette.
var cowG = new THREE.Group(); cowG.position.set(1.35, 0, -1.0); cowG.rotation.y = -0.55; cowG.scale.setScalar(0.95); scene.add(cowG);
var hideTex = tex(256, 256, function(cx, w, h) { cx.fillStyle = '#b9b2a4'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#141210'; for (var i = 0; i < 9; i++) { cx.beginPath(); var x = rnd(i * 3) * w, y = rnd(i * 5) * h; cx.moveTo(x, y); for (var a = 0; a < 7; a++) { var r = 22 + rnd(i * 7 + a) * 34; cx.lineTo(x + Math.cos(a * 0.9) * r, y + Math.sin(a * 0.9) * r); } cx.closePath(); cx.fill(); } for (var i = 0; i < 4000; i++) { cx.fillStyle = 'rgba(0,0,0,0.06)'; cx.fillRect(rnd(i) * w, rnd(i * 3) * h, 1, 2); } });
var hide = new THREE.MeshStandardMaterial({ map: hideTex, roughness: 0.9 });
function cowForm(mat,x,y,z,sx,sy,sz){var part=mesh(new THREE.SphereGeometry(1,20,14),mat,x,y,z,cowG);part.scale.set(sx,sy,sz);part.castShadow=true;return part;}
cowG.name='dss-coach-cow';
var cowBody=cowForm(hide,0,1.16,-.05,.38,.41,.87);
cowForm(hide,0,1.26,.58,.31,.39,.38);cowForm(hide,0,1.18,-.65,.34,.36,.32);
cowForm(hide,0,1.35,.86,.21,.33,.32);
var cowHeadPartsAt=cowG.children.length;var cowHead=new THREE.Group();cowHead.position.set(0,1.37,1.13);cowForm(hide,0,1.37,1.13,.18,.235,.29);
var muzzleMat=new THREE.MeshStandardMaterial({color:0xb88e83,roughness:.82});
cowForm(muzzleMat,0,1.19,1.39,.19,.12,.14);
[-1,1].forEach(function(side){
 var nostril=cowForm(M.black,side*.105,1.225,1.505,.037,.019,.008);nostril.rotation.z=side*.25;
 cowForm(M.black,side*.163,1.43,1.245,.027,.023,.018);
 cowForm(new THREE.MeshBasicMaterial({color:0xc9b899}),side*.177,1.44,1.253,.006,.005,.004);
 var ear=cowForm(hide,side*.25,1.55,1.035,.13,.045,.068);ear.rotation.z=side*.22;
 var inner=cowForm(muzzleMat,side*.255,1.575,1.05,.085,.011,.042);inner.rotation.z=side*.22;
 var hornPath=new THREE.CatmullRomCurve3([new THREE.Vector3(side*.115,1.56,.995),new THREE.Vector3(side*.16,1.70,.985),new THREE.Vector3(side*.21,1.75,1.035)]);
 mesh(new THREE.TubeGeometry(hornPath,12,.022,8,false),new THREE.MeshStandardMaterial({color:0xc6bda0,roughness:.7}),0,0,0,cowG);
});
cowG.children.slice(cowHeadPartsAt).forEach(function(part){part.position.sub(cowHead.position);cowHead.add(part);});cowG.add(cowHead);
function cowLegSegment(a,b,r1,r2){var mid=new THREE.Vector3().addVectors(a,b).multiplyScalar(.5),delta=new THREE.Vector3().subVectors(b,a);var leg=mesh(new THREE.CylinderGeometry(r2,r1,delta.length(),12),hide,mid.x,mid.y,mid.z,cowG);leg.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return leg;}
[-1,1].forEach(function(side){[false,true].forEach(function(rear){
 var z=rear?-.67:.57,x=side*.235;
 var hip=new THREE.Vector3(x,.99,z),knee=new THREE.Vector3(x,.52,z+(rear?.10:-.025)),ankle=new THREE.Vector3(x,.14,z+(rear?-.035:.025));
 cowForm(hide,x,.91,z,rear?.115:.085,.24,.12);cowLegSegment(hip,knee,.075,.054);cowForm(hide,knee.x,knee.y,knee.z,.062,.07,.064);cowLegSegment(knee,ankle,.05,.036);
 [-1,1].forEach(function(toe){cowForm(M.black,x+toe*.025,.063,ankle.z+.025,.023,.057,.075);});
 });});
var tailPath=new THREE.CatmullRomCurve3([new THREE.Vector3(0,1.4,-.85),new THREE.Vector3(.045,1.07,-.98),new THREE.Vector3(.09,.72,-1.00),new THREE.Vector3(.12,.58,-.94)]);
var tail=new THREE.Group();tail.position.set(0,1.4,-.85);cowG.add(tail);tailPath.points.forEach(function(point){point.sub(tail.position);});mesh(new THREE.TubeGeometry(tailPath,18,.015,8,false),hide,0,0,0,tail);var cowTuft=cowForm(M.black,.12,.565,-.94,.035,.095,.034);cowTuft.position.sub(tail.position);tail.add(cowTuft);
var udder = mesh(new THREE.SphereGeometry(0.16, 10, 8), new THREE.MeshStandardMaterial({ color: 0xd8a898, roughness: 0.7 }), 0, 0.68, 0.1, cowG);
// the bridle, since you will take it
mesh(new THREE.TorusGeometry(0.2, 0.012, 6, 20), new THREE.MeshStandardMaterial({ color: 0x3a2a18, roughness: 0.8 }), 0, 1.3, 1.36, cowG).rotation.x = 0.1;
var bell=detail.lathe([[0.008,0.025],[0.016,0.022],[0.018,0],[0.037,-0.025],[0.034,-0.028],[0.014,0.004]],detail.material('#9b8247','metal'),0,1.06,1.42,cowG);detail.arc(cowG,0.035,0.0018,M.brass,0,1.034,1.42);mesh(new THREE.SphereGeometry(0.006,8,6),M.brass,0,1.03,1.42,cowG);
k.contact(1.35, 0, -1.0, 2.4);
var cowLight=new THREE.SpotLight(0xffd4a0,.9,6,.7,.8,1.5);cowLight.position.set(2.2,3.1,1.3);cowLight.target.position.set(1.35,1,-1.0);scene.add(cowLight);scene.add(cowLight.target);
// ---------- THE DOOR to Greek Street, front left, and THE GENTS through the door at the back right ----------
var doorG = new THREE.Group(); doorG.position.set(-6.15, 0, 0.15); doorG.rotation.y = Math.PI / 2; scene.add(doorG);
mesh(new THREE.BoxGeometry(0.95, 2.2, 0.06), M.darkWood, 0, 1.1, 0, doorG);
mesh(new THREE.PlaneGeometry(0.5, 0.8), honeyOak, 0, 1.55, 0.035, doorG);
mesh(new THREE.BoxGeometry(1.1, 0.1, 0.12), mahog, 0, 2.25, 0, doorG); mesh(new THREE.BoxGeometry(0.08, 2.3, 0.12), mahog, -0.55, 1.15, 0, doorG); mesh(new THREE.BoxGeometry(0.08, 2.3, 0.12), mahog, 0.55, 1.15, 0, doorG);
mesh(new THREE.BoxGeometry(0.3, 0.12, 0.04), M.brass, 0.15, 1.02, 0.04, doorG); mesh(new THREE.BoxGeometry(0.4, 0.5, 0.02), M.brass, 0, 0.5, 0.035, doorG);
var pushWear=detail.material('#aa935b','metal');
mesh(new THREE.BoxGeometry(0.37,0.46,0.003),pushWear,0,0.5,0.047,doorG);
[-1,1].forEach(function(side){[-1,1].forEach(function(up){var fixing=mesh(new THREE.SphereGeometry(0.004,8,5),M.brass,side*0.165,0.5+up*0.205,0.05,doorG);fixing.scale.z=0.3;});});
var doorLight = new THREE.PointLight(0xc0d8b0, 0.4, 3, 1.8); doorLight.position.set(-5.8, 1.6, 0.15); scene.add(doorLight);
var doorHit = mesh(new THREE.BoxGeometry(1.2, 2.5, 0.5), M.hidden, 0, 1.2, 0.15, doorG);
var cbWayOut = window.dssWayOutArrow(scene, -2.0, 0.2, -6.15, 0.15); /* 2026-10-23 overnight: the door is off the frame to the left */
var gentsG = new THREE.Group(); gentsG.position.set(W / 2 - 0.58, 0, -D / 2 + 0.08); scene.add(gentsG);
mesh(new THREE.BoxGeometry(0.85, 2.1, 0.06), new THREE.MeshStandardMaterial({ color: 0x3a3a30, roughness: 0.85 }), 0, 1.05, 0, gentsG);
mesh(new THREE.BoxGeometry(1.0, 0.1, 0.12), M.darkWood, 0, 2.15, 0, gentsG); mesh(new THREE.BoxGeometry(0.08, 2.2, 0.12), M.darkWood, -0.5, 1.1, 0, gentsG); mesh(new THREE.BoxGeometry(0.08, 2.2, 0.12), M.darkWood, 0.5, 1.1, 0, gentsG);
var gentsTex = tex(128, 64, function(cx, w, h) { cx.fillStyle = '#2a2a24'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#c8c0a8'; cx.font = 'bold 26px Georgia,serif'; cx.textAlign = 'center'; cx.fillText('GENTS', w / 2, 42); });
mesh(new THREE.PlaneGeometry(0.4, 0.2), new THREE.MeshStandardMaterial({ map: gentsTex, roughness: 0.8 }), 0, 1.7, 0.035, gentsG);
mesh(new THREE.SphereGeometry(0.035, 8, 6), M.brass, 0.3, 1.0, 0.05, gentsG);
mesh(new THREE.BoxGeometry(0.065,0.14,0.006),detail.material('#8c7b4b','metal'),0.3,1,0.04,gentsG);
[-1,1].forEach(function(side){var screw=mesh(new THREE.SphereGeometry(0.0035,8,5),M.brass,0.3,1+side*0.055,0.045,gentsG);screw.scale.z=0.3;});
var gentsLight = new THREE.PointLight(0xa0c0b0, 0.3, 2.5, 2); gentsLight.position.set(W / 2 - 0.58, 2.0, -D / 2 + 0.5); scene.add(gentsLight);
var gentsHit = mesh(new THREE.BoxGeometry(1.1, 2.4, 0.5), M.hidden, 0, 1.15, 0.15, gentsG);
// Sam 2026-10-07 (row 98, slip trail step 2): a jumble of chalky letters scrawled on the gents door; 'Rearrange them' on its
// card slides them into JEFFREY BERNARD IS UNWELL. Not a game, a small animation. Once sorted they stay sorted this session.
var GRAF_LINES = ['JEFFREY', 'BERNARD', 'IS UNWELL'], grafCv = document.createElement('canvas'); grafCv.width = 512; grafCv.height = 320;
var grafCx = grafCv.getContext('2d'), grafTex = new THREE.CanvasTexture(grafCv), GRAF_FONT = 'bold 58px "Marker Felt","Chalkboard SE","Comic Sans MS",cursive';
mesh(new THREE.PlaneGeometry(0.72, 0.45), new THREE.MeshBasicMaterial({ map: grafTex, color: 0xb8b4a2, transparent: true, depthWrite: false }), 0, 1.3, 0.036, gentsG);
// Sam 2026-10-07 (row 98): the sigil etched below the letters, a pyramid with an all-seeing eye, scratched into the paint.
var sigCv = document.createElement('canvas'); sigCv.width = 256; sigCv.height = 256; (function(cx) {
var seed = 11; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
function scratch(x1, y1, x2, y2) { for (var p = 0; p < 2; p++) { cx.beginPath(); cx.moveTo(x1 + (rnd() - 0.5) * 3, y1 + (rnd() - 0.5) * 3); cx.lineTo((x1 + x2) / 2 + (rnd() - 0.5) * 4, (y1 + y2) / 2 + (rnd() - 0.5) * 4); cx.lineTo(x2 + (rnd() - 0.5) * 3, y2 + (rnd() - 0.5) * 3); cx.stroke(); } }
cx.strokeStyle = 'rgba(226,222,200,0.85)'; cx.lineWidth = 5; cx.lineCap = 'round'; cx.lineJoin = 'round';
scratch(128, 22, 30, 226); scratch(30, 226, 226, 226); scratch(226, 226, 128, 22);
[[78, 124, 178, 124], [56, 170, 200, 170], [128, 170, 128, 226], [92, 198, 92, 226], [164, 198, 164, 226]].forEach(function(b) { scratch(b[0], b[1], b[2], b[3]); });
cx.lineWidth = 4.5; cx.beginPath(); cx.moveTo(98, 80); cx.quadraticCurveTo(128, 56, 158, 80); cx.quadraticCurveTo(128, 104, 98, 80); cx.stroke();
cx.beginPath(); cx.arc(128, 80, 10, 0, Math.PI * 2); cx.fillStyle = 'rgba(226,222,200,0.85)'; cx.fill();
cx.lineWidth = 3.5; for (var r = 0; r < 9; r++) { var a = -Math.PI / 2 + (r - 4) * 0.3; scratch(128 + Math.cos(a) * 46, 80 + Math.sin(a) * 46, 128 + Math.cos(a) * 66, 80 + Math.sin(a) * 66); }
})(sigCv.getContext('2d'));
mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sigCv), color: 0xb8b4a2, transparent: true, depthWrite: false }), -0.15, 0.93, 0.036, gentsG);
var grafLetters = [];
(function() {
grafCx.font = GRAF_FONT;
GRAF_LINES.forEach(function(line, r) {
var w = grafCx.measureText(line).width, x = 256 - w / 2;
line.split('').forEach(function(ch) { var cw = grafCx.measureText(ch).width; if (ch !== ' ') grafLetters.push({ ch: ch, tx: x + cw / 2, ty: 78 + r * 84, tr: 0 }); x += cw; });
});
// the jumble: each letter starts in another letter's place, tipped and nudged (a fixed shuffle, the same every night)
var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
var order = grafLetters.map(function(_, i) { return i; });
for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), tmp = order[i]; order[i] = order[j]; order[j] = tmp; }
grafLetters.forEach(function(L, i) { var o = grafLetters[order[i]]; L.sx = o.tx + (rnd() - 0.5) * 26; L.sy = o.ty + (rnd() - 0.5) * 30; L.sr = (rnd() - 0.5) * 0.9; });
})();
function grafDraw(k) {
var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
grafCx.clearRect(0, 0, 512, 320); grafCx.font = GRAF_FONT; grafCx.textAlign = 'center'; grafCx.textBaseline = 'middle';
grafCx.fillStyle = 'rgba(226,222,200,0.82)'; grafCx.shadowColor = 'rgba(0,0,0,0.35)'; grafCx.shadowBlur = 2;
grafLetters.forEach(function(L) {
grafCx.save(); grafCx.translate(L.sx + (L.tx - L.sx) * e, L.sy + (L.ty - L.sy) * e); grafCx.rotate(L.sr * (1 - e)); grafCx.fillText(L.ch, 0, 0); grafCx.restore();
});
grafTex.needsUpdate = true;
}
grafDraw(window._dssGentsGrafDone ? 1 : 0);
var grafLink = document.createElement('span'); grafLink.textContent = 'Rearrange them'; grafLink.setAttribute('data-dss-stay', '1');
grafLink.addEventListener('click', function() {
if (window._dssGentsGrafDone) return; window._dssGentsGrafDone = true;
if (k.still) { grafDraw(1); return; }
var t0 = performance.now(), DUR = 2600;
(function step() { var q = Math.min(1, (performance.now() - t0) / DUR); grafDraw(q); if (q < 1) requestAnimationFrame(step); })();
});
// ---------- TABLES along the window wall, a fruit machine, the light ----------
function table(x, z, seed) { var g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g); mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.03, 20), new THREE.MeshStandardMaterial({ color: 0x8a1a1a, roughness: 0.4, envMap: k.roomEnv, envMapIntensity: 0.4 }), 0, 0.72, 0, g); mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.7, 8), new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 0.4, metalness: 0.5 }), 0, 0.36, 0, g); mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 16), M.black, 0, 0.02, 0, g); if (rnd(seed) < 0.7) { mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.12, 12), M.glass, 0.1, 0.8, 0.05, g); } mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.016, 14), ashMat, -0.12, 0.745, -0.1, g); [[-0.5, 0], [0, 0.5]].forEach(function(c) { var ch = new THREE.Group(); ch.position.set(c[0], 0, c[1]); ch.rotation.y = c[0] ? Math.PI / 2 : Math.PI; g.add(ch); mesh(new THREE.BoxGeometry(0.4, 0.05, 0.4), leatherMat, 0, 0.46, 0, ch); mesh(new THREE.BoxGeometry(0.4, 0.4, 0.04), M.darkWood, 0, 0.7, -0.18, ch); [[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].forEach(function(lg) { mesh(new THREE.CylinderGeometry(0.015, 0.018, 0.44, 6), M.darkWood, lg[0], 0.22, lg[1], ch); }); }); k.contact(x, 0, z, 1.3); return g; }
table(-4.75, -0.6, 1); table(-4.75, 1.25, 2); table(-4.75, 2.8, 3); table(3.1, 2.7, 4);
var machine = mesh(new THREE.BoxGeometry(0.6, 1.7, 0.5), new THREE.MeshStandardMaterial({ color: 0x2a1a30, roughness: 0.4, metalness: 0.3, envMap: k.roomEnv, envMapIntensity: 0.5 }), W / 2 - 0.35, 0.85, 1.8); machine.rotation.y = -Math.PI / 2;
var machTex = tex(128, 192, function(cx, w, h) { cx.fillStyle = '#100810'; cx.fillRect(0, 0, w, h); ['#ff4040', '#ffd040', '#40c0ff'].forEach(function(c, i) { cx.fillStyle = c; cx.fillRect(14, 20 + i * 50, 100, 30); }); cx.fillStyle = '#000'; for (var i = 0; i < 3; i++) cx.fillRect(20 + i * 32, 130, 26, 40); cx.fillStyle = '#ffe080'; cx.font = 'bold 22px Arial'; cx.textAlign = 'center'; ['7', '£', '7'].forEach(function(t, i) { cx.fillText(t, 33 + i * 32, 158); }); });
var machFace = mesh(new THREE.PlaneGeometry(0.5, 1.2), new THREE.MeshBasicMaterial({ map: machTex, toneMapped: false }), W / 2 - 0.61, 1.0, 1.8); machFace.rotation.y = -Math.PI / 2;
var machLight = new THREE.PointLight(0xff80a0, 0.5, 2.5, 2); machLight.position.set(W / 2 - 0.9, 1.2, 1.8); scene.add(machLight);
// Brass candle chandeliers and wall sconces, reflected by the oak and bar mirror.
var pendants=[];
[[-1.75,barZ+.8],[1.45,barZ+.8],[-2.9,2.2]].forEach(function(pp,i){
var g=new THREE.Group();g.position.set(pp[0],H-.65,pp[1]);scene.add(g);
mesh(new THREE.CylinderGeometry(.007,.007,1.27,8),M.brass,0,.015,0,g);
mesh(new THREE.SphereGeometry(.075,16,12),M.brass,0,-.85,0,g);
for(var arm=0;arm<5;arm++){var a=arm*Math.PI*2/5,x=Math.cos(a)*.28,z=Math.sin(a)*.28;
var curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,-.82,0),new THREE.Vector3(x*.6,-.96,z*.6),new THREE.Vector3(x,-.84,z),new THREE.Vector3(x,-.68,z)]);
mesh(new THREE.TubeGeometry(curve,12,.012,6,false),M.brass,0,0,0,g);
mesh(new THREE.CylinderGeometry(.025,.025,.14,10),new THREE.MeshStandardMaterial({color:0xf1dec0,roughness:.6}),x,-.61,z,g);
var flame=mesh(new THREE.SphereGeometry(.027,10,8),new THREE.MeshBasicMaterial({color:0xffe8b1,toneMapped:false}),x,-.51,z,g);flame.scale.y=1.8;
}
var l=new THREE.PointLight(0xffcf8c,i===2?.6:.82,6,1.6);l.position.set(0,-.95,0);g.add(l);if(i===1){l.castShadow=true;l.shadow.mapSize.set(512,512);l.shadow.bias=-.002;}
pendants.push({l:l,g:k.glow(0,-.57,0,.8,.32,0xffdc9d,g),base:i===2?.6:.82});
});
[[3.85,2.12,.15],[-3.85,2.3,2.65]].forEach(function(p,i){var light=new THREE.PointLight(0xffbb70,.7,4,1.7);light.position.set(p[0]*.94,p[1],p[2]);scene.add(light);for(var side=-1;side<=1;side+=2){mesh(new THREE.CylinderGeometry(.018,.018,.18,8),M.brass,p[0]*.96,p[1]-.12,p[2]+side*.12);mesh(new THREE.SphereGeometry(.027,10,8),new THREE.MeshBasicMaterial({color:0xffdf9c,toneMapped:false}),p[0]*.96,p[1],p[2]+side*.12);}});
scene.add(new THREE.AmbientLight(0x786343,.32));scene.add(new THREE.HemisphereLight(0xc8b591,0x1b140e,.24));
// the smoke of the place, kept low, and the dust over the bar
var hazeTex = tex(128, 128, function(cx, w, h) { var g = cx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(220,190,150,0.2)'); g.addColorStop(0.4, 'rgba(170,130,90,0.1)'); g.addColorStop(1, 'rgba(100,70,40,0)'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); });
var haze = [[0, 2.2, barZ + 0.6, 4.5, 2.0], [-2.6, 2.0, 0.5, 2.4, 1.6], [1.2,1.9,-.7,3.0,1.25]].map(function(p) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTex, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending })); sp.position.set(p[0], p[1], p[2]); sp.scale.set(p[3], p[4], 1); scene.add(sp); return sp; });
// a couple of the regulars, traces at the tables, and the one at the far end of the bar
k.ghost(-4.7, 0, -0.6, 17, 0.14, true, false); k.ghost(3.1, 0, 2.7, 19, 0.12, true, false); k.ghost(2.8, 0.3, barZ + 0.9, 23, 0.16, true, false);
// ---------- THE CLOSE-UPS ----------
var hotspots = [
{ root: cowG, name: 'A cow', pos: [0.15, 1.6, 2.1], tgt: [1.1, 1.05, -0.55], haloAt: [0.85, 1.95, -0.8], haloSc: 0.65,
actions: function() { return k.byText(['Ride the beast', 'Milk her']); } }, // 2026-10-16: the restored milking is the cow's other action
{ root: bernard.hit, name: 'JEFFREY BERNARD', pos: [0.4, 1.5, 0.3], tgt: [-0.3, 0.7, barZ + 0.9], haloAt: [-0.85, 1.0, barZ + 1.0], haloSc: 0.55,
keepProse: true, prose: function() { return "He resumes a conversation he hadn’t begun:\n\n‘I’d very much like to wake up one morning with a cow of the Friesian variety and walk her down to Soho to the Coach and Horses, stopping on the way to buy twenty Players, ply her with vodkas until closing time, whip her off to an Indian restaurant, take her up to the Colony Room till 5.30 and then to the Yorkminster, Swiss Tavern, Three Greyhounds, get beaten up by Chinese waiters at midnight, have a row with the taxi driver, set the bed on fire, put it out with tears and then wake up on the floor. Could you then milk said cow? I doubt it.’"; } }, /* 2026-10-21 (Sam): his Friesian speech (15 April words, restored 2026-10-16 into the passage) now speaks on his click; first visit only, since he has gone to Bohemia after it */
{ root: glassHit, name: 'JEFFREY BERNARD’S glass', pos: [-0.15, 1.5, barZ + 1.2], tgt: [0.45, 1.18, barZ + 0.2], haloAt: [-0.1, 1.4, barZ + 0.18], haloSc: 0.4 },
{ root: optics, name: 'Optics', pos: [0.2, 1.7, -0.5], tgt: [0.2, 2.2, -D / 2 + 0.2], haloAt: [-0.5, 2.58, -D / 2 + 0.3], haloSc: 0.65 },
{ root: phoneHit, name: 'A telephone', pos: [-1.6, 1.6, -0.6], tgt: [-2.35, 1.45, -D / 2 + 0.3], haloAt: [-2.35, 1.5, -D / 2 + 0.3], haloSc: 0.5,
actions: function() { return k.passageLinks('.phone-ringing tw-link'); }, prose: function() { return k.modalProse(); } },
{ root: cbWayOut, name: 'A door', label: 'WAY OUT', pos: [-3.8, 1.5, 0.7], tgt: [-6.1, 1.3, 0.15], haloAt: [-1.72, 0.14, 0.2], haloSc: 0.55,
actions: function() { return window.dssStreetExit(); }, // Bernard said find your own way out: the door offers the page's own exit (it stays in the header too)
/* 2026-10-23 overnight (Sam, playtest: "I am stuck in the coach and horses"): the door stands on the left wall, off the frame
   (x -1.25 on screen at 1440x900), so the room had no way out to see; the chalk arrow on the floor points to it, as in the
   Colony and LACKLAND's office, and the close-up still turns to the door */
},
{ root: gentsHit, name: 'The Gents', pos: [W / 2 - 1.0, 1.4, -1.45], tgt: [W / 2 - 0.58, 1.1, -D / 2 + 0.08], haloAt: [W / 2 - 0.58, 1.2, -D / 2 + 0.22], haloSc: 1.3,
actions: function() { return window._dssGentsGrafDone ? [] : [grafLink]; }, keepLine: true, notAWay: true,
line: 'The door to the gents.' }
];
// Sam 2026-10-07 ("Drains only"): the gents door is a way in only for those who came up through the drains;
// on a front-door visit it is not offered (its words are "the door you came out of")
if (!document.querySelector('tw-passage .cb-via-gents')) hotspots = hotspots.filter(function(h) { return h.name !== 'The Gents'; });
// 2026-10-12 (the venues audit): the prose has him vanish to Bohemia; on the visits after, his stool is empty (his glass stays)
/* 2026-10-21 (Sam): JEFFREY stays on his stool on every visit, so his Friesian speech is there whenever he is clicked; the 2026-10-12 removal after his scene (the passage's .cb-jeff-gone hook) is gone */
var breath = 0;
return { hotspots: hotspots, frame: function(t, dt, still) {
if (still) return;
breath = Math.sin(t * 0.7); cowBody.scale.set(.38*(1 + breath*.012),.41*(1 + breath*.02),.87); cowHead.rotation.x = Math.sin(t * 0.31) * 0.05; tail.rotation.z = Math.sin(t * 1.3) * 0.25;
for (var i = 0; i < pendants.length; i++) { var f = 0.05 * Math.sin(t * (1.1 + i * 0.3) + i); pendants[i].l.intensity = pendants[i].base + f; pendants[i].g.material.opacity = 0.32 + f; }
for (var w = 0; w < winLights.length; w++) winLights[w].intensity = 0.38 + 0.04 * Math.sin(t * 0.6 + w * 2);
machLight.intensity = 0.5 + 0.2 * (Math.sin(t * 3.1) > 0.6 ? 1 : 0); machFace.material.opacity = 1;
haze.forEach(function(h,i){h.material.opacity=.20+.035*Math.sin(t*.27+i);h.position.x=[0,-2.6,1.2][i]+Math.sin(t*.12+i)*.22;h.position.y=[2.2,2,1.9][i]+Math.sin(t*.16+i)*.08;});
optGlow.material.opacity = 0.3 + 0.02 * Math.sin(t * 0.8);
} };
}
});
// <<<< DSS ROOM CB END

// >>>> DSS ROOM TI BEGIN
