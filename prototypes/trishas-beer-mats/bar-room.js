// A small native Three.js room, using the same library as Dream Street Shuffle.
// No character artwork: Lea and Jack are off-screen on the customer's side.
(() => {
  const host = document.querySelector('.scene');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x100407);
  scene.fog = new THREE.FogExp2(0x18060c, .055);
  const camera = new THREE.PerspectiveCamera(51, 1.5, .1, 30);
  camera.position.set(0, 1.75, 3.7);
  camera.lookAt(0, 1.36, -1.5);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({antialias:true, alpha:false}); }
  catch(e) { host.classList.add('no-webgl'); return; }
  renderer.domElement.id = 'bar-room';
  renderer.domElement.setAttribute('aria-hidden','true');
  host.prepend(renderer.domElement);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .78;
  const mat = (color, roughness=.75, metalness=0) => new THREE.MeshStandardMaterial({color,roughness,metalness});
  const red=mat(0x571324), dark=mat(0x180c0e), brass=mat(0x987144,.37,.58), cream=mat(0xc4b393);
  // Small, repeatable imperfections; no photographic textures or per-frame noise.
  let grainSeed=137;
  function rnd(){grainSeed=(grainSeed*16807)%2147483647;return grainSeed/2147483647;}
  const plasterCanvas=document.createElement('canvas');plasterCanvas.width=plasterCanvas.height=256;
  const pc=plasterCanvas.getContext('2d');pc.fillStyle='#b0aaa5';pc.fillRect(0,0,256,256);
  for(let i=0;i<5200;i++){pc.fillStyle=i%2?'rgba(255,244,230,.035)':'rgba(24,8,12,.045)';const r=1+rnd()*4;pc.fillRect(rnd()*256,rnd()*256,r,r);}
  const plaster=new THREE.CanvasTexture(plasterCanvas);plaster.wrapS=plaster.wrapT=THREE.RepeatWrapping;plaster.repeat.set(3,2);
  red.map=plaster;red.bumpMap=plaster;red.bumpScale=.012;
  const woodCanvas=document.createElement('canvas');woodCanvas.width=256;woodCanvas.height=128;
  const cx=woodCanvas.getContext('2d');cx.fillStyle='#402318';cx.fillRect(0,0,256,128);
  for(let i=0;i<150;i++){cx.strokeStyle=i%3?'rgba(189,124,69,.12)':'rgba(8,3,2,.22)';cx.beginPath();cx.moveTo(0,i);cx.bezierCurveTo(80,i+Math.sin(i)*2,190,i-2,256,i);cx.stroke();}
  for(let i=0;i<900;i++){cx.fillStyle=i%2?'rgba(222,169,105,.045)':'rgba(10,5,3,.08)';cx.fillRect(rnd()*256,rnd()*128,1+rnd()*6,.5);}
  const woodMap=new THREE.CanvasTexture(woodCanvas);woodMap.wrapS=woodMap.wrapT=THREE.RepeatWrapping;woodMap.repeat.set(3,1);
  const wood=new THREE.MeshStandardMaterial({map:woodMap,bumpMap:woodMap,bumpScale:.006,roughness:.43,color:0xa37b60});
  function mesh(geometry,material,x,y,z){const o=new THREE.Mesh(geometry,material);o.position.set(x,y,z);scene.add(o);return o;}
  const box=(x,y,z,a,b,c,m)=>mesh(new THREE.BoxGeometry(a,b,c),m,x,y,z);
  const cyl=(x,y,z,r1,r2,height,m,n=10)=>mesh(new THREE.CylinderGeometry(r1,r2,height,n),m,x,y,z);
  box(0,1.45,-2.4,6,2.9,.12,red);box(0,2.9,-.5,6,.12,4,mat(0x250912));
  box(-3,1.45,-.5,.12,2.9,4,red);box(3,1.45,-.5,.12,2.9,4,red);
  [-2,-.5,1].forEach(z=>box(0,2.82,z,6,.14,.12,dark));
  // Broad counter and thick rounded-looking wooden lip, comfortably within reach.
  box(0,.95,.1,6,.13,2.6,wood);box(0,.86,1.43,6,.09,.10,wood);
  // A couple of old glass rings and fine scuffs on the polish, away from the mats.
  const wear=new THREE.MeshBasicMaterial({color:0xbaa482,transparent:true,opacity:.085,depthWrite:false,side:THREE.DoubleSide});
  for(const [x,z,r] of [[.91,.69,.084],[-.88,.38,.10]]){const ring=mesh(new THREE.RingGeometry(r,r+.005,40,1,.15,Math.PI*1.72),wear,x,1.016,z);ring.rotation.x=-Math.PI/2;}
  const scratchMat=new THREE.LineBasicMaterial({color:0xc4a17a,transparent:true,opacity:.10});
  for(let i=0;i<15;i++){const x=(rnd()-.5)*4.8,z=rnd()*1.7-.6;const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,1.017,z),new THREE.Vector3(x+.03+rnd()*.09,1.017,z+.008)]);scene.add(new THREE.Line(geo,scratchMat));}
  box(0,.39,1.34,6,.85,.12,dark);box(0,.815,1.405,6,.018,.016,brass);
  for(let x=-2.7;x<3;x+=.6){box(x,.4,1.415,.022,.64,.025,wood);box(x+.29,.075,1.415,.57,.025,.025,wood);}
  // A tarnished back mirror, deliberately simple like the existing rooms.
  const mirror=mat(0x35423d,.38,.55);
  mirror.roughnessMap=plaster;
  box(0,1.98,-2.28,3.9,1.53,.07,dark);box(0,1.98,-2.23,3.79,1.43,.015,mirror);
  [-1.94,1.94].forEach(x=>box(x,1.98,-2.17,.045,1.54,.05,brass));
  [1.23,2.73].forEach(y=>box(0,y,-2.17,3.9,.035,.05,brass));
  [1.17,1.72].forEach(y=>{box(0,y,-1.92,4.1,.065,.52,wood);box(0,y+.025,-1.645,4.1,.018,.025,brass)});
  const bottleMats=[mat(0x345445,.3),mat(0x754822,.32),mat(0x7f7660,.28),mat(0x54212a,.4)];
  for(let i=0;i<8;i++){
    const x=(i-3.5)*.43,m=bottleMats[i%4];
    box(x,2.28,-2.05,.025,.77,.05,dark);
    cyl(x,2.40,-1.93,.092,.082,.37,m,8);cyl(x,2.18,-1.93,.038,.078,.09,m,8);
    cyl(x,2.105,-1.93,.029,.029,.07,brass);box(x,2.39,-1.833,.12,.17,.008,i%2?cream:mat(0x873b2d));
    cyl(x,2.05,-1.93,.054,.054,.045,brass);cyl(x,1.985,-1.93,.034,.034,.08,mat(0x807c66,.25,.6));
    box(x,1.925,-1.89,.11,.014,.02,brass);
  }
  for(let i=0;i<11;i++){
    let x=(i-5)*.30,y=1.39,m=bottleMats[(i+1)%4];
    cyl(x,y,-1.99,.06,.065,.34,m,8);cyl(x,y+.21,-1.99,.024,.026,.09,m,8);
    box(x,y,-1.925,.07,.11,.006,cream);
  }
  const glass=new THREE.MeshStandardMaterial({color:0xb9c8bf,roughness:.19,transparent:true,opacity:.30,metalness:.1});
  for(let i=0;i<6;i++){let x=-1.75+i*.14;cyl(x,1.27,-1.58,.041,.03,.15,glass);}
  for(let i=0;i<4;i++){let x=1.12+i*.18;cyl(x,1.30,-1.61,.046,.008,.07,glass);cyl(x,1.235,-1.61,.004,.004,.07,glass);cyl(x,1.20,-1.61,.029,.029,.006,glass);}
  // Six fictional vintage pub/jazz photographs in the existing frames.
  // Atlas UVs preserve portrait proportions without stretching the square prints.
  const photoMaterials=[];
  for(const side of [-1,1])for(let i=0;i<3;i++){
    let x=side*(2.23+(i%2)*.29),y=1.54+i*.39;
    box(x,y,-2.25,.30,.36,.06,dark);box(x,y,-2.21,.25,.31,.01,mat(0x876955));
    const photoMat=new THREE.MeshStandardMaterial({color:0xcec8bb,roughness:.88,emissive:0x24201c,emissiveIntensity:.12});
    photoMaterials.push(photoMat);
    mesh(new THREE.PlaneGeometry(.20,.25),photoMat,x,y,-2.199);
  }
  new THREE.TextureLoader().load('pub-jazz-photos.png',atlas=>{
    photoMaterials.forEach((material,index)=>{
      const texture=atlas.clone();texture.encoding=THREE.sRGBEncoding;
      texture.repeat.set(.8/3,.98/2);
      texture.offset.set((index%3+.1)/3,(1-Math.floor(index/3)+.01)/2);
      texture.needsUpdate=true;material.map=texture;material.needsUpdate=true;
    });
    render();
  });
  scene.add(new THREE.HemisphereLight(0xb29488,0x190306,.42));
  const glowTexture=(()=>{let c=document.createElement('canvas');c.width=c.height=64;let a=c.getContext('2d'),g=a.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,239,199,.65)');g.addColorStop(.15,'rgba(255,200,130,.25)');g.addColorStop(1,'rgba(255,150,90,0)');a.fillStyle=g;a.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
  function glow(x,y,z,color,size){let s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture,color,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.position.set(x,y,z);s.scale.set(size,size,1);scene.add(s);return s;}
  for(const x of [-2.12,2.12]){
    cyl(x,2.07,-1.90,.09,.17,.19,mat(0xa91c3a),10);
    cyl(x,1.9,-1.9,.012,.012,.19,brass);
    let l=new THREE.PointLight(x<0?0xff4960:0xff315e,x<0?.82:.62,4,2);l.position.set(x,1.99,-1.68);scene.add(l);glow(x,2,-1.66,0xff6e85,.55);
  }
  let wire=[];for(let i=0;i<=28;i++){let x=-2.8+i*.2,y=2.72-.18*Math.sin(i/28*Math.PI);wire.push(new THREE.Vector3(x,y,-1.7));if(i%2===0){const colors=[0xffb75f,0xc95e75,0x759973];let color=colors[(i/2)%3];mesh(new THREE.SphereGeometry(.015,6,5),new THREE.MeshBasicMaterial({color}),x,y-.03,-1.7);glow(x,y-.03,-1.7,color,.13);}}
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(wire),new THREE.LineBasicMaterial({color:0x17130f})));
  let warm=new THREE.PointLight(0xffb476,1.2,5,2);warm.position.set(0,2.6,.6);scene.add(warm);
  // Low amber shelf glow catches bottle edges without lifting the whole room.
  const shelfGlow=new THREE.PointLight(0xffbb79,.28,2.1,2);shelfGlow.position.set(.55,1.77,-1.57);scene.add(shelfGlow);
  box(.55,1.746,-1.78,1.25,.009,.022,new THREE.MeshBasicMaterial({color:0xa06a3a}));
  // Player-side drink, candle and mat stack left clear in the centre.
  cyl(1.12,1.14,.5,.077,.059,.26,glass,12);cyl(1.12,1.105,.5,.064,.052,.18,mat(0x93612b,.25));
  cyl(1.12,1.201,.5,.065,.065,.012,mat(0xb9a786));
  cyl(-1.34,1.05,.18,.075,.08,.09,mat(0x622431,.4));
  let flame=mesh(new THREE.SphereGeometry(.012,6,5),new THREE.MeshBasicMaterial({color:0xffda97}),-1.34,1.13,.18);flame.scale.y=2;
  glow(-1.34,1.13,.18,0xffb160,.23);const candle=new THREE.PointLight(0xffb66e,.5,1.6,2);candle.position.set(-1.34,1.15,.18);scene.add(candle);
  function render(){renderer.render(scene,camera);}
  function resize(){const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();camera.updateMatrixWorld();const edge=new THREE.Vector3(0,1.025,1.42).project(camera);window.barEdgeY=(1-edge.y)/2;render();}
  new ResizeObserver(resize).observe(host);resize();
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();host.classList.add('no-webgl')});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{host.classList.remove('no-webgl');resize()});
  // Static camera and cached GPU frame keep the actual flick responsive.
  window.barRoom={render,renderer,scene,camera};
})();
