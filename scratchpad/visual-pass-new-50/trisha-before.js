// ====== TRISHA'S SCENE — INLINE ======
(function() {
var tsActive = false;
var tsAnimId = null;

function initTrishas() {
if (tsActive) return;
tsActive = true;
if (typeof THREE === 'undefined') {
var s = document.createElement('script');
s.src = 'vendor/three/three.min.js';
s.onload = function() { (window.dssLoadPost ? window.dssLoadPost(buildTSScene) : buildTSScene()); };
document.head.appendChild(s);
} else {
(window.dssLoadPost ? window.dssLoadPost(buildTSScene) : buildTSScene());
}
}

function buildTSScene() {
// Reduced-motion: no drips, steady lantern, the cat settles and holds.
var tsStill = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var tsStillNow = Date.now();
var tsWrap = document.createElement('div');
tsWrap.id = 'ts-wrap';
tsWrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9000;background:#121019;';

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x121019);
scene.fog = new THREE.FogExp2(0x121019, 0.09);

var camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(-0.45, 2.6, 5.2);
camera.lookAt(0, 2.55, 0); // near-level gaze (was 3.0 looking down at 2.4) — straightens the splayed verticals

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.68;
tsWrap.appendChild(renderer.domElement);
window._dssBindScene('ts-wrap', scene, renderer, camera);
var dssComposerLocal = window.dssMakeComposer ? window.dssMakeComposer(scene, camera, renderer, { focus: 7, aperture: 0.0004, maxblur: 0.0045 }) : null;
if (window.dssFilmGrade) window.dssFilmGrade(document.getElementById('ts-wrap'));

function placeMesh(geo, mat, x, y, z) {
var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); scene.add(m); return m;
}

function makeCanvasTexture(w, h, drawFunc) {
var c = document.createElement('canvas');
c.width = w; c.height = h;
var cx = c.getContext('2d');
drawFunc(cx, w, h);
var tex = new THREE.CanvasTexture(c);
tex.minFilter = THREE.LinearFilter;
return tex;
}

// Red London brick
var brickTex = makeCanvasTexture(512, 1024, function(cx, w, h) {
cx.fillStyle='#3e2820'; cx.fillRect(0,0,w,h);
var brickH=8, mortarW=2, brickW=22; // was 18/3/54 — bricks read close to a metre wide; now near true course size
for (var row=0; row<Math.ceil(h/(brickH+mortarW)); row++) {
var by=row*(brickH+mortarW), offset=(row%2===0)?0:brickW/2;
for (var bx=-brickW; bx<w+brickW; bx+=brickW+mortarW) {
var xb=bx+offset, r=90+Math.floor(Math.random()*30), g=42+Math.floor(Math.random()*18), b=28+Math.floor(Math.random()*14);
cx.fillStyle='rgb('+r+','+g+','+b+')'; cx.fillRect(xb,by,brickW,brickH);
cx.fillStyle='rgba('+(r+12)+','+(g+8)+','+(b+4)+',0.18)'; cx.fillRect(xb+2,by+2,brickW-4,brickH-4);
}
cx.fillStyle='rgba(48,38,30,0.65)'; cx.fillRect(0,by+brickH,w,mortarW);
}
for (var row=0; row<Math.ceil(h/(brickH+mortarW)); row++) {
var by=row*(brickH+mortarW), offset=(row%2===0)?0:brickW/2;
for (var bx=-brickW; bx<w+brickW; bx+=brickW+mortarW) { cx.fillStyle='rgba(48,38,30,0.55)'; cx.fillRect(bx+offset-1,by,mortarW,brickH); }
}
var soot=cx.createLinearGradient(0,0,0,h);
soot.addColorStop(0,'rgba(8,5,3,0.45)'); soot.addColorStop(0.12,'rgba(10,6,3,0.20)');
soot.addColorStop(0.5,'rgba(8,5,2,0.10)'); soot.addColorStop(0.88,'rgba(8,5,2,0.14)'); soot.addColorStop(1,'rgba(6,4,2,0.38)');
cx.fillStyle=soot; cx.fillRect(0,0,w,h);
cx.strokeStyle='rgba(16,10,6,0.12)'; cx.lineWidth=2;
for (var rs=0; rs<28; rs++) { cx.beginPath(); var rxs=Math.random()*w; cx.moveTo(rxs,0); for (var rys=0; rys<h; rys+=22) { rxs+=(Math.random()-0.5)*3; cx.lineTo(rxs,rys); } cx.stroke(); }
cx.fillStyle='rgba(15,10,6,0.16)';
for (var dp=0;dp<7;dp++){cx.beginPath();cx.ellipse(Math.random()*w,h*0.55+Math.random()*h*0.45,30+Math.random()*55,20+Math.random()*35,Math.random(),0,Math.PI*2);cx.fill();}
cx.fillStyle='rgba(22,35,12,0.18)'; cx.fillRect(0,h*0.91,w,h*0.09);
});
// Pavement
var paveTex = makeCanvasTexture(512, 512, function(cx, w, h) {
cx.fillStyle='#2e2818'; cx.fillRect(0,0,w,h);
var flagRows=[{y:0,h:130},{y:130,h:115},{y:245,h:135},{y:380,h:132}];
for (var ri=0;ri<flagRows.length;ri++){
var row=flagRows[ri], slabs=(ri%2===0)?[0,195,375]:[0,255,415];
for (var si=0;si<slabs.length;si++){
var sx=slabs[si], sw=(si<slabs.length-1)?slabs[si+1]-sx:w-sx;
var tone=32+Math.random()*16; cx.fillStyle='rgb('+(tone)+','+(tone-4)+','+(tone-10)+')'; cx.fillRect(sx+2,row.y+2,sw-4,row.h-4);
}
cx.strokeStyle='rgba(16,13,8,0.72)'; cx.lineWidth=3; cx.beginPath(); cx.moveTo(0,row.y); cx.lineTo(w,row.y); cx.stroke();
}
cx.fillStyle='rgba(18,15,9,0.28)';
for (var st=0;st<14;st++){cx.beginPath();cx.ellipse(Math.random()*w,Math.random()*h,10+Math.random()*28,7+Math.random()*18,Math.random()*Math.PI,0,Math.PI*2);cx.fill();}
var ref=cx.createLinearGradient(0,0,w,0);
ref.addColorStop(0,'rgba(0,0,0,0)'); ref.addColorStop(0.25,'rgba(180,110,30,0.06)'); ref.addColorStop(0.45,'rgba(200,130,40,0.10)'); ref.addColorStop(0.65,'rgba(180,110,30,0.06)'); ref.addColorStop(1,'rgba(0,0,0,0)');
cx.fillStyle=ref; cx.fillRect(0,0,w,h);
});
// Door texture — deep Soho green (was near-black #0c0c0e, which swallowed
// the lamp light whole), with panelling so the light has edges to find.
var blackDoorTex = makeCanvasTexture(256, 512, function(cx, w, h) {
cx.fillStyle='#1d251f'; cx.fillRect(0,0,w,h);
cx.strokeStyle='rgba(14,18,15,0.5)'; cx.lineWidth=1;
for (var gx=0;gx<w;gx+=3+Math.random()*4){cx.beginPath();cx.moveTo(gx,0);cx.lineTo(gx+(Math.random()-0.5)*2,h);cx.stroke();}
// Two recessed panels, catching a whisper of tone on their bevels
function panel(px,py,pw,ph){
cx.strokeStyle='rgba(8,10,8,0.85)'; cx.lineWidth=3; cx.strokeRect(px,py,pw,ph);
cx.strokeStyle='rgba(70,84,72,0.35)'; cx.lineWidth=1; cx.strokeRect(px-2,py-2,pw+4,ph+4);
cx.fillStyle='rgba(10,13,11,0.4)'; cx.fillRect(px,py,pw,ph);
}
panel(w*0.16,h*0.10,w*0.68,h*0.34);
panel(w*0.16,h*0.54,w*0.68,h*0.34);
cx.fillStyle='rgba(30,28,35,0.15)'; cx.fillRect(0,0,10,h);
cx.fillStyle='rgba(18,16,14,0.35)';
for (var sc=0;sc<10;sc++){cx.fillRect(Math.random()*w,h-18-Math.random()*55,12+Math.random()*22,1+Math.random()*2);}
});
// White stone doorcase
var whiteStoneTex = makeCanvasTexture(256, 512, function(cx, w, h) {
cx.fillStyle='#c2baa8'; cx.fillRect(0,0,w,h);
cx.strokeStyle='rgba(140,130,110,0.08)'; cx.lineWidth=1;
for (var rs=0;rs<12;rs++){cx.beginPath();var rxs=Math.random()*w;cx.moveTo(rxs,0);for (var rys=0;rys<h;rys+=40){rxs+=(Math.random()-0.5)*3;cx.lineTo(rxs,rys);}cx.stroke();}
var sh=cx.createLinearGradient(0,h*0.75,0,h); sh.addColorStop(0,'rgba(60,50,35,0)'); sh.addColorStop(1,'rgba(60,50,35,0.22)');
cx.fillStyle=sh; cx.fillRect(0,0,w,h);
cx.strokeStyle='rgba(100,90,75,0.12)'; cx.lineWidth=0.7;
for (var cr=0;cr<8;cr++){cx.beginPath();cx.moveTo(Math.random()*w,Math.random()*h);cx.lineTo(Math.random()*w,Math.random()*h);cx.stroke();}
});
// Awning sign
var awningSignTex = makeCanvasTexture(512, 256, function(cx, w, h) {
cx.fillStyle='#080808'; cx.fillRect(0,0,w,h);
var glow=cx.createRadialGradient(w/2,h/2,0,w/2,h/2,w*0.55);
glow.addColorStop(0,'rgba(180,110,20,0.18)'); glow.addColorStop(1,'rgba(0,0,0,0)');
cx.fillStyle=glow; cx.fillRect(0,0,w,h);
cx.font='italic bold 62px Georgia, serif'; cx.textAlign='center'; cx.textBaseline='middle';
cx.fillStyle='#c8981e'; cx.fillText("Trisha's",w/2,h*0.38);
cx.strokeStyle='rgba(180,140,30,0.55)'; cx.lineWidth=1.5;
cx.beginPath(); cx.moveTo(w*0.28,h*0.56); cx.lineTo(w*0.72,h*0.56); cx.stroke();
cx.font='small-caps 22px Georgia, serif'; cx.fillStyle='rgba(190,148,40,0.80)'; cx.fillText('Est. 1839',w/2,h*0.70);
});

// Materials
var facadeBrick  = new THREE.MeshStandardMaterial({ map:brickTex, roughness:0.92 });
var paveMat      = new THREE.MeshStandardMaterial({ map:paveTex, roughness:0.32, metalness:0.15 }); // wet after the rain — the lantern finds a sheen
var roadMat      = new THREE.MeshStandardMaterial({ color:0x0c0c0a, roughness:0.9 });
var kerbMat      = new THREE.MeshStandardMaterial({ color:0x383632, roughness:0.88 });
var blackDoorMat = new THREE.MeshStandardMaterial({ map:blackDoorTex, roughness:0.82, metalness:0.04 }); // was glossy (0.28) — the door light's specular hotspot read as a phantom second handle
var whiteStoneMat= new THREE.MeshStandardMaterial({ map:whiteStoneTex, roughness:0.80 });
var brassMat     = new THREE.MeshStandardMaterial({ color:0xb08828, roughness:0.22, metalness:0.88 });
var brassMatDull = new THREE.MeshStandardMaterial({ color:0x806018, roughness:0.45, metalness:0.65 });
var ironMat      = new THREE.MeshStandardMaterial({ color:0x161614, roughness:0.65, metalness:0.38 });
var awningBlack  = new THREE.MeshStandardMaterial({ color:0x080808, roughness:0.55, side:THREE.DoubleSide });
var awningSign   = new THREE.MeshStandardMaterial({ map:awningSignTex, roughness:0.50, side:THREE.FrontSide, emissive:0xffffff, emissiveMap:awningSignTex, emissiveIntensity:0.7 }); // 2026-09-16: no light reaches the awning face, so the gold lettering rendered plain black; it now carries its own faint glow like the fanlight
var blackPanelMat= new THREE.MeshStandardMaterial({ color:0x0e0e10, roughness:0.38, metalness:0.08 });
var lanternGlass = new THREE.MeshStandardMaterial({ color:0x1a0c02, roughness:0.2, emissive:0xd47010, emissiveIntensity:1.6 }); // was 0.9 — the flame itself should read
var darkBrick    = new THREE.MeshStandardMaterial({ color:0x1e1410, roughness:0.92 });
var fanlightMat  = new THREE.MeshStandardMaterial({ color:0x141008, roughness:0.2, metalness:0.2, emissive:0xc87818, emissiveIntensity:0.4 }); // was 0.05 — someone is home behind the fanlight

// Building
placeMesh(new THREE.BoxGeometry(8,9,0.28), facadeBrick, 0,4.0,0);
placeMesh(new THREE.BoxGeometry(8,3.5,0.28), facadeBrick, 0,9.25,0);
placeMesh(new THREE.BoxGeometry(0.3,12,4), darkBrick, -4.15,4.5,-1.8);
placeMesh(new THREE.BoxGeometry(0.3,12,4), darkBrick,  4.15,4.5,-1.8);
// Doorcase
placeMesh(new THREE.BoxGeometry(0.32,3.6,0.18), whiteStoneMat, -0.72,2.25,0.15);
placeMesh(new THREE.BoxGeometry(0.32,3.6,0.18), whiteStoneMat,  0.72,2.25,0.15);
placeMesh(new THREE.BoxGeometry(1.82,0.30,0.22), whiteStoneMat, 0,4.08,0.14);
placeMesh(new THREE.BoxGeometry(0.36,0.22,0.20), whiteStoneMat, -0.72,0.46,0.15);
placeMesh(new THREE.BoxGeometry(0.36,0.22,0.20), whiteStoneMat,  0.72,0.46,0.15);
// Door
var tsDoor = new THREE.Mesh(new THREE.BoxGeometry(1.08,2.55,0.07), blackDoorMat);
tsDoor.position.set(0,1.90,0.19); scene.add(tsDoor);
var pW=0.38, pH=0.62, pD=0.025;
var panelOffsets=[[-0.24,2.90],[0.24,2.90],[-0.24,2.15],[0.24,2.15],[-0.24,1.38],[0.24,1.38]];
for (var pi=0;pi<panelOffsets.length;pi++){
var pm=new THREE.Mesh(new THREE.BoxGeometry(pW,pH,pD), blackPanelMat); pm.position.set(panelOffsets[pi][0],panelOffsets[pi][1],0.225); scene.add(pm);
}
// Letterbox — plate, flap, and slot. Low-metalness brass: full-metal
// materials go pure black down here where almost no light reaches.
var lbBrass=new THREE.MeshStandardMaterial({color:0xc09a40,roughness:0.38,metalness:0.3});
var lbBrassDark=new THREE.MeshStandardMaterial({color:0x8a6c26,roughness:0.5,metalness:0.25});
var lbPlate=new THREE.Mesh(new THREE.BoxGeometry(0.40,0.13,0.02), lbBrassDark); lbPlate.position.set(0,1.62,0.228); scene.add(lbPlate);
var lbMesh=new THREE.Mesh(new THREE.BoxGeometry(0.30,0.07,0.05), lbBrass); lbMesh.position.set(0,1.62,0.235); scene.add(lbMesh);
var lbSlot=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.018,0.052), new THREE.MeshStandardMaterial({color:0x0a0806,roughness:0.9})); lbSlot.position.set(0,1.62,0.238); scene.add(lbSlot);
var knob=new THREE.Mesh(new THREE.SphereGeometry(0.062,10,10), brassMat); knob.position.set(0.36,1.90,0.245); scene.add(knob);
placeMesh(new THREE.BoxGeometry(0.06,0.16,0.018), brassMatDull, 0.36,1.90,0.222);
// (door-mounted 57 removed — the number lives on the wall slate only)
// Fanlight
placeMesh(new THREE.BoxGeometry(0.96,0.28,0.06), fanlightMat, 0,3.34,0.19);
// Fanlight frame + glazing bars — without them the lit pane read as a row
// of oddly coloured bricks. Dark timber against the white doorcase.
var fanFrameMat = new THREE.MeshStandardMaterial({color:0x171310, roughness:0.75});
placeMesh(new THREE.BoxGeometry(1.06,0.05,0.07), fanFrameMat, 0,3.505,0.19);
placeMesh(new THREE.BoxGeometry(1.06,0.05,0.07), fanFrameMat, 0,3.175,0.19);
placeMesh(new THREE.BoxGeometry(0.05,0.38,0.07), fanFrameMat, -0.505,3.34,0.19);
placeMesh(new THREE.BoxGeometry(0.05,0.38,0.07), fanFrameMat, 0.505,3.34,0.19);
placeMesh(new THREE.BoxGeometry(0.028,0.28,0.065), fanFrameMat, -0.24,3.34,0.19);
placeMesh(new THREE.BoxGeometry(0.028,0.28,0.065), fanFrameMat, 0,3.34,0.19);
placeMesh(new THREE.BoxGeometry(0.028,0.28,0.065), fanFrameMat, 0.24,3.34,0.19);
placeMesh(new THREE.BoxGeometry(0.96,0.022,0.065), blackPanelMat, 0,3.34,0.20);
placeMesh(new THREE.BoxGeometry(0.022,0.28,0.065), blackPanelMat, 0,3.34,0.20);
// Awning
var awningPoints=[];
for (var i=0;i<=14;i++){var t=(i/14)*Math.PI*0.5;awningPoints.push(new THREE.Vector2(Math.sin(t)*1.05,Math.cos(t)*0.68));}
var awningDome=new THREE.Mesh(new THREE.LatheGeometry(awningPoints,20), awningBlack);
awningDome.rotation.x=Math.PI; awningDome.scale.set(1.0,1.0,0.85); awningDome.position.set(0,4.42,0.52); scene.add(awningDome);
var awningUnder=new THREE.Mesh(new THREE.CircleGeometry(1.02,20),new THREE.MeshStandardMaterial({color:0x1a0c02,emissive:0xc06010,emissiveIntensity:0.30,side:THREE.DoubleSide}));
awningUnder.rotation.x=-Math.PI/2; awningUnder.scale.set(1.0,0.85,1.0); awningUnder.position.set(0,4.42,0.52); scene.add(awningUnder);
var awningFace=new THREE.Mesh(new THREE.PlaneGeometry(1.85,0.88), awningSign);
awningFace.position.set(0,4.18,1.48); awningFace.rotation.x=-0.2; scene.add(awningFace); // 2026-09-16: was y=4.75 z=1.10, which is ABOVE the top of the frame from the camera at y=2.6 — the lettering was never on screen. Now on the front of the dome, just below its rim.
placeMesh(new THREE.BoxGeometry(2.12,0.10,0.015), awningBlack, 0,4.42,1.08);
// Wall lantern
var bracket=new THREE.Mesh(new THREE.BoxGeometry(0.32,0.04,0.04), ironMat); bracket.position.set(-0.95,3.55,0.40); scene.add(bracket);
var bracketV=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.28,0.04), ironMat); bracketV.position.set(-1.08,3.44,0.40); scene.add(bracketV);
placeMesh(new THREE.BoxGeometry(0.20,0.28,0.20), ironMat, -1.09,3.22,0.40);
placeMesh(new THREE.BoxGeometry(0.16,0.22,0.16), lanternGlass, -1.09,3.22,0.40);
// Iron cage ribs — the lantern read as a smooth untextured box beside the
// brick; four corner bars give it its Victorian ironwork back.
placeMesh(new THREE.BoxGeometry(0.022,0.24,0.022), ironMat, -1.175,3.22,0.315);
placeMesh(new THREE.BoxGeometry(0.022,0.24,0.022), ironMat, -1.005,3.22,0.315);
placeMesh(new THREE.BoxGeometry(0.022,0.24,0.022), ironMat, -1.175,3.22,0.485);
placeMesh(new THREE.BoxGeometry(0.022,0.24,0.022), ironMat, -1.005,3.22,0.485);
placeMesh(new THREE.BoxGeometry(0.24,0.06,0.24), ironMat, -1.09,3.37,0.40);
placeMesh(new THREE.CylinderGeometry(0.08,0.10,0.06,8), ironMat, -1.09,3.07,0.40);
var houseNumTex=makeCanvasTexture(64,80,function(cx,w,h){cx.clearRect(0,0,w,h);cx.font='bold 36px Georgia, serif';cx.fillStyle='rgba(210,195,165,0.90)';cx.textAlign='center';cx.textBaseline='middle';cx.fillText('57',w/2,h/2);});
// Mounted on a slate plaque rather than floating on the brick
placeMesh(new THREE.BoxGeometry(0.32,0.40,0.025), new THREE.MeshStandardMaterial({color:0x2d3138,roughness:0.85}), -1.55,3.10,0.15);
placeMesh(new THREE.PlaneGeometry(0.22,0.28),new THREE.MeshStandardMaterial({map:houseNumTex,roughness:0.6,transparent:true}),-1.55,3.10,0.165);
// Steps
placeMesh(new THREE.BoxGeometry(1.30,0.12,0.40), whiteStoneMat, 0,0.40,0.38);
placeMesh(new THREE.BoxGeometry(1.45,0.10,0.55), whiteStoneMat, 0,0.30,0.58);
// Pavement & road
var pave=new THREE.Mesh(new THREE.PlaneGeometry(9,4.5), paveMat); pave.rotation.x=-Math.PI/2; pave.position.set(0,0.35,2.8); scene.add(pave);
placeMesh(new THREE.BoxGeometry(9,0.14,0.14), kerbMat, 0,0.35,5.0);
var road=new THREE.Mesh(new THREE.PlaneGeometry(14,8), roadMat); road.rotation.x=-Math.PI/2; road.position.set(0,0.28,8.5); scene.add(road);
var groundFill=new THREE.Mesh(new THREE.PlaneGeometry(9,2.2), paveMat); groundFill.rotation.x=-Math.PI/2; groundFill.position.set(0,0.35,0.5); scene.add(groundFill);
// Standing water by the steps, catching the lantern
var puddle=new THREE.Mesh(new THREE.CircleGeometry(0.55,24), new THREE.MeshStandardMaterial({color:0x0a0d12,roughness:0.08,metalness:0.5}));
puddle.rotation.x=-Math.PI/2; puddle.position.set(-0.9,0.355,2.0); puddle.scale.set(1.6,1,0.7); scene.add(puddle);
// The lantern in the puddle (2026-09-22 polish loop): a small warm smear of
// the gas lantern on the standing water by the step, flickering with it.
// One additive plane.
var tsReflTex=makeCanvasTexture(64,96,function(cx,w,h){
var g=cx.createRadialGradient(w/2,h*0.38,0,w/2,h*0.38,w*0.5);
g.addColorStop(0,'rgba(255,190,110,0.8)'); g.addColorStop(0.4,'rgba(230,150,60,0.3)'); g.addColorStop(1,'rgba(200,120,30,0)');
cx.fillStyle=g; cx.fillRect(0,0,w,h);
var tl=cx.createLinearGradient(0,h*0.38,0,h);
tl.addColorStop(0,'rgba(230,150,60,0.25)'); tl.addColorStop(1,'rgba(200,120,30,0)');
cx.fillStyle=tl; cx.fillRect(w*0.38,h*0.38,w*0.24,h*0.62);
});
var tsRefl=new THREE.Mesh(new THREE.PlaneGeometry(0.42,0.66), new THREE.MeshBasicMaterial({map:tsReflTex,transparent:true,opacity:0.2,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
tsRefl.rotation.x=-Math.PI/2; tsRefl.position.set(-1.0,0.362,1.8); scene.add(tsRefl);

// ── The Trisha's cat ──
// A Soho black cat sitting on the lower step under the lantern. Kept as a
// near-black silhouette against the lit stone doorcase — sold by motion
// (tail, ears, head turns, breathing, blink), never by anatomy. It never walks.
var catMat = new THREE.MeshStandardMaterial({ color: 0x0b0b0d, roughness: 0.85 });
var tsCat = new THREE.Group();
tsCat.position.set(-0.94, 0.35, 0.55); // 2026-09-16: was -0.66, which put the cat under the centred TRISHA'S button; nearer the lantern now
tsCat.rotation.y = -0.2;
tsCat.scale.set(1.3, 1.3, 1.3); // a big Soho tom — true scale vanished at this camera distance
scene.add(tsCat);
function catPart(geo, x, y, z, sx, sy, sz) {
var m = new THREE.Mesh(geo, catMat);
m.position.set(x, y, z); m.scale.set(sx||1, sy||1, sz||1);
tsCat.add(m); return m;
}
catPart(new THREE.SphereGeometry(0.15, 14, 12), 0, 0.13, -0.03, 0.82, 0.92, 1.05);
var catChest = catPart(new THREE.SphereGeometry(0.105, 12, 10), 0, 0.215, 0.07, 0.78, 1, 0.9);
catPart(new THREE.CylinderGeometry(0.017, 0.02, 0.17, 8), -0.045, 0.085, 0.115);
catPart(new THREE.CylinderGeometry(0.017, 0.02, 0.17, 8), 0.045, 0.085, 0.115);
catPart(new THREE.SphereGeometry(0.026, 8, 6), -0.047, 0.014, 0.135, 1, 0.55, 1.3);
catPart(new THREE.SphereGeometry(0.026, 8, 6), 0.047, 0.014, 0.135, 1, 0.55, 1.3);
var catHead = new THREE.Group();
catHead.position.set(0, 0.35, 0.075);
tsCat.add(catHead);
var catSkull = new THREE.Mesh(new THREE.SphereGeometry(0.082, 14, 12), catMat);
catSkull.scale.set(0.92, 0.85, 0.88); catHead.add(catSkull);
var catMuzzle = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), catMat);
catMuzzle.position.set(0, -0.025, 0.055); catMuzzle.scale.set(1, 0.75, 0.9); catHead.add(catMuzzle);
// Ears: 4-sided pyramids, flat face forward — the outline's signature
var catEarL = new THREE.Mesh(new THREE.ConeGeometry(0.034, 0.085, 4), catMat);
catEarL.position.set(-0.052, 0.07, -0.002); catEarL.rotation.y = Math.PI/4; catEarL.rotation.z = 0.22; catHead.add(catEarL);
var catEarR = new THREE.Mesh(new THREE.ConeGeometry(0.034, 0.085, 4), catMat);
catEarR.position.set(0.052, 0.07, -0.002); catEarR.rotation.y = Math.PI/4; catEarR.rotation.z = -0.22; catHead.add(catEarR);
// Eyes: amber, lit only while the head faces the street — lamplight caught, not headlamps
var catEyeMat = new THREE.MeshStandardMaterial({ color: 0x0d0a04, emissive: 0xe8b040, emissiveIntensity: 0 });
var catEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 6), catEyeMat);
catEyeL.position.set(-0.031, 0.008, 0.068); catEyeL.scale.set(1, 0.85, 0.5); catHead.add(catEyeL);
var catEyeR = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 6), catEyeMat);
catEyeR.position.set(0.031, 0.008, 0.068); catEyeR.scale.set(1, 0.85, 0.5); catHead.add(catEyeR);
// Tiny additive halos on the eyes — at street distance the emissive spheres
// alone are a pixel; the sprites give the lamplight-caught bloom
var catEyeGlowTex = makeCanvasTexture(32, 32, function(cx, w, h) {
var g = cx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
g.addColorStop(0, 'rgba(255,205,90,0.95)'); g.addColorStop(0.4, 'rgba(230,160,50,0.35)'); g.addColorStop(1, 'rgba(210,140,40,0)');
cx.fillStyle = g; cx.fillRect(0, 0, w, h);
});
var catEyeGlowL = new THREE.Sprite(new THREE.SpriteMaterial({ map: catEyeGlowTex, transparent: true, opacity: 0, depthWrite: false }));
catEyeGlowL.position.set(-0.031, 0.008, 0.075); catEyeGlowL.scale.set(0.085, 0.085, 1); catHead.add(catEyeGlowL);
var catEyeGlowR = new THREE.Sprite(new THREE.SpriteMaterial({ map: catEyeGlowTex, transparent: true, opacity: 0, depthWrite: false }));
catEyeGlowR.position.set(0.031, 0.008, 0.075); catEyeGlowR.scale.set(0.085, 0.085, 1); catHead.add(catEyeGlowR);
// Tail: a chain of shrinking spheres laid along a curve computed per frame,
// curled round the right flank on the step, tip idling and flicking
var catTail = [];
for (var cti = 0; cti < 9; cti++) {
var ctSeg = new THREE.Mesh(new THREE.SphereGeometry(0.031 - cti*0.0016, 8, 6), catMat);
tsCat.add(ctSeg); catTail.push(ctSeg);
}
var catState = { yaw: 0, yawTarget: -0.15, nextTurn: 0, blinkUntil: 0, nextBlink: 0, flickStart: -1, nextFlick: 0, earUntil: 0, earSide: 1, nextEar: 0 };
// Lantern bounce off the wet slabs — lifts the cat's brow and chest a whisper
var catFill = new THREE.PointLight(0xc98a30, 0.4, 2.2, 2.0);
catFill.position.set(-1.0, 1.05, 1.35); scene.add(catFill);

// Lighting
scene.add(new THREE.AmbientLight(0x171530, 0.68));
var moon=new THREE.DirectionalLight(0x2b2850, 0.24); moon.position.set(3,10,6); scene.add(moon);
var tsLanternLight=new THREE.PointLight(0xd4780e,2.2,7.5,1.8); tsLanternLight.position.set(-1.09,3.18,0.88); tsLanternLight.castShadow=true; scene.add(tsLanternLight);
// Halo at the lantern so the light SOURCE blooms (the Ginger Light treatment).
var tsHaloTex=makeCanvasTexture(128,128,function(cx,w,h){var g=cx.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);g.addColorStop(0,'rgba(255,190,110,0.85)');g.addColorStop(0.35,'rgba(240,150,60,0.30)');g.addColorStop(1,'rgba(220,120,30,0)');cx.fillStyle=g;cx.fillRect(0,0,w,h);});
var tsHalo=new THREE.Sprite(new THREE.SpriteMaterial({map:tsHaloTex,transparent:true,opacity:0.75,depthWrite:false}));
tsHalo.position.set(-1.09,3.22,0.62); tsHalo.scale.set(2.3,2.3,1); tsHalo.material.opacity=0.95; scene.add(tsHalo);
var awningGlow=new THREE.PointLight(0xd49018,0.80,4.0,2.0); awningGlow.position.set(0,4.20,0.90); scene.add(awningGlow);
var doorGlow=new THREE.PointLight(0xc07010,0.4,3.2,2.0); doorGlow.position.set(0,1.8,0.85); scene.add(doorGlow); // was buried at z=0 INSIDE the wall, lighting nothing — now grazes the door furniture

// AFTER the rain — the intro says the sky has cleared, so no live drizzle:
// instead the awning sheds occasional drips, each hanging a moment before
// it lets go and falls under gravity.
var dripCount=9;
var dripPositions=new Float32Array(dripCount*6);
var dripVel=new Float32Array(dripCount);
var dripWait=new Float32Array(dripCount);
function resetDrip(i, first){
var dx=(Math.random()-0.5)*2.0, dy=4.30, dz=1.06+Math.random()*0.06;
dripPositions[i*6]=dx; dripPositions[i*6+1]=dy; dripPositions[i*6+2]=dz;
dripPositions[i*6+3]=dx; dripPositions[i*6+4]=dy-0.05; dripPositions[i*6+5]=dz;
dripVel[i]=0;
dripWait[i]=(first?Math.random()*160:40+Math.random()*220);
}
for (var di0=0;di0<dripCount;di0++) resetDrip(di0,true);
var rainGeo=new THREE.BufferGeometry();
rainGeo.setAttribute('position',new THREE.BufferAttribute(dripPositions,3));
var rain=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0xaabbcc,transparent:true,opacity:0.35})); scene.add(rain);

// Animation
function tsAnimate() {
tsAnimId=requestAnimationFrame(tsAnimate);
var rp=rainGeo.attributes.position.array;
for (var ri=0;ri<(tsStill?0:dripCount);ri++){
if (dripWait[ri]>0){ dripWait[ri]--; continue; }
dripVel[ri]+=0.010;
rp[ri*6+1]-=dripVel[ri]; rp[ri*6+4]-=dripVel[ri];
if (rp[ri*6+4]<0.36){ resetDrip(ri,false); }
}
rainGeo.attributes.position.needsUpdate=true;
var flicker=tsStill?1.0:(1.0+Math.sin(Date.now()*0.0031)*0.04+Math.sin(Date.now()*0.0077)*0.02);
tsLanternLight.intensity=2.2*flicker;
tsRefl.material.opacity=0.2*flicker*flicker;
// The cat: head turns between street, lantern and door; eyes catch the
// light only when facing out; tail curls and flicks; ears twitch.
var catNow = tsStill ? tsStillNow : Date.now();
if (catNow > catState.nextTurn) {
catState.yawTarget = [-0.55, -0.15, 0.3, 0.62][Math.floor(Math.random()*4)];
catState.nextTurn = catNow + 2600 + Math.random()*5200;
}
catState.yaw += (catState.yawTarget - catState.yaw) * 0.035;
catHead.rotation.y = catState.yaw;
catHead.rotation.x = 0.06 + Math.sin(catNow*0.0009)*0.03;
// Only blink if we're near the scheduled moment — after a throttled-tab gap
// (rAF frozen while hidden) just reschedule, so the eyes aren't caught shut
// on the first frame back.
if (catNow > catState.nextBlink) {
if (catState.nextBlink > 0 && catNow - catState.nextBlink < 400) { catState.blinkUntil = catNow + 140; }
catState.nextBlink = catNow + 2200 + Math.random()*4800;
}
var catBlinking = catNow < catState.blinkUntil;
catEyeL.scale.y = catBlinking ? 0.12 : 0.85; catEyeR.scale.y = catBlinking ? 0.12 : 0.85;
var catEyeOn = catBlinking ? 0 : Math.max(0, Math.cos((catState.yaw + 0.1) * 1.5));
catEyeMat.emissiveIntensity = catEyeOn * 1.1;
catEyeGlowL.material.opacity = catEyeOn * 0.9;
catEyeGlowR.material.opacity = catEyeOn * 0.9;
catChest.scale.y = 1 + Math.sin(catNow*0.0016)*0.018;
if (catNow > catState.nextEar) { catState.earUntil = catNow + 260; catState.earSide = Math.random() < 0.5 ? -1 : 1; catState.nextEar = catNow + 3800 + Math.random()*6000; }
var earKick = (catNow < catState.earUntil) ? Math.sin((catState.earUntil - catNow)/260*Math.PI)*0.45 : 0;
catEarL.rotation.y = Math.PI/4 + (catState.earSide < 0 ? earKick : 0);
catEarR.rotation.y = Math.PI/4 + (catState.earSide > 0 ? earKick : 0);
if (catNow > catState.nextFlick && catState.flickStart < 0) { catState.flickStart = catNow; catState.nextFlick = catNow + 2800 + Math.random()*4600; }
var catFlick = 0;
if (catState.flickStart >= 0) {
var cfp = (catNow - catState.flickStart)/850;
if (cfp >= 1) { catState.flickStart = -1; } else { catFlick = Math.sin(cfp*Math.PI); }
}
for (var cts = 0; cts < 9; cts++) {
var ctt = cts/8;
var cta = 4.35 - ctt*(1.95 + Math.sin(catNow*0.0006)*0.06 + catFlick*0.45*ctt);
var ctr = 0.135 + ctt*0.045;
catTail[cts].position.set(-Math.cos(cta)*ctr, 0.025 + Math.max(0, 0.3 - ctt)*0.15 + catFlick*ctt*ctt*0.09, Math.sin(cta)*ctr);
}
if (typeof dssComposerLocal !== 'undefined' && dssComposerLocal) { dssComposerLocal.render(); } else { renderer.render(scene, camera); }
}
tsAnimate();

// Overlays
var tsVig=document.createElement('div');
tsVig.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9001;background:radial-gradient(ellipse at 45% 45%, transparent 25%, rgba(0,0,0,0.65) 100%);';
tsWrap.appendChild(tsVig);
var tsWash=document.createElement('div');
tsWash.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9002;background:linear-gradient(180deg, rgba(8,8,20,0.35) 0%, rgba(5,5,12,0.1) 30%, rgba(5,5,12,0.1) 60%, rgba(8,5,3,0.35) 100%);';
tsWrap.appendChild(tsWash);
var tsLoc=document.createElement('div');
tsLoc.textContent='GREEK STREET, SOHO';
tsLoc.style.cssText='position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font:12px "Courier New",monospace;color:rgba(200,180,140,0.25);letter-spacing:2px;pointer-events:none;z-index:9003;white-space:nowrap;';
tsWrap.appendChild(tsLoc);
var tsBtn=document.createElement('div');
tsBtn.textContent="TRISHA'S";
tsBtn.style.cssText='position:fixed;bottom:60px;left:50%;transform:translateX(-50%);padding:14px 36px;font:16px "Courier New",monospace;color:rgba(212,165,116,0.85);border:1px solid rgba(212,165,116,0.3);letter-spacing:4px;cursor:pointer;z-index:9004;background:transparent;opacity:0;transition:opacity 2s ease;';
setTimeout(function(){tsBtn.style.opacity='1';},2500);
tsBtn.addEventListener('mouseenter',function(){tsBtn.style.color='rgba(230,195,150,0.95)';tsBtn.style.borderColor='rgba(212,165,116,0.6)';});
tsBtn.addEventListener('mouseleave',function(){tsBtn.style.color='rgba(212,165,116,0.85)';tsBtn.style.borderColor='rgba(212,165,116,0.3)';});
tsBtn.addEventListener('click',function(){
tsWrap.style.transition='opacity 1.5s ease'; tsWrap.style.opacity='0';
setTimeout(function(){
if (tsAnimId) cancelAnimationFrame(tsAnimId); tsAnimId=null;
if (tsWrap.parentNode) tsWrap.parentNode.removeChild(tsWrap);
var TARGET="Failure: Trisha's";
if (window.Engine && Engine.go) { Engine.go(TARGET); }
else { var links=document.querySelectorAll('tw-link, .enchantment-link'); for (var i=0;i<links.length;i++){if (links[i].textContent.trim()==='·'){links[i].click();break;}} }
},1500);
});
tsWrap.appendChild(tsBtn);
document.body.appendChild(tsWrap);
}

setInterval(function(){
var container=document.getElementById('ts-container');
if (container && !tsActive) {
initTrishas();
} else if (!container) {
tsActive=false;
if (tsAnimId) { cancelAnimationFrame(tsAnimId); tsAnimId=null; }
window._dssDisposeWrap('ts-wrap');
}
},300);
})();
