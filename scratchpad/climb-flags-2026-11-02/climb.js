
(function(){
  'use strict';
  var canvas=document.getElementById('hc-canvas');
  if(!canvas || canvas.dataset.hcInit) return;
  if(window._hcCleanup) window._hcCleanup();
  canvas.dataset.hcInit='3d';
  var stage=canvas.closest('.hc-stage'), cover=document.getElementById('hc-cover');
  var beginButton=document.getElementById('hc-begin'), pauseButton=document.getElementById('hc-pause');
  var expandButton=document.getElementById('hc-expand'), hud=document.getElementById('hc-hud'), banner=document.getElementById('hc-banner');
  var reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var disposed=false, renderer=null, scene=null, camera=null, animId=0, observer=null, resizeObserver=null;
  var removers=[], loader=null, eng=null, feedbackTimer=null, lastNow=null, accumulator=0;
  var started=false, paused=false, finished=false, ending=-1, turned=false;
  var keys={}, pointerKeys={}, bufferT=0, coyoteT=.20, jumpCut=false;
  var hcTouch=!!(window.matchMedia&&window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  var s=2, u=0, y=0, vy=0, grounded=true, breath=1, slips=0, prints=0, checkpoint=2, snowWalk=0; /* snowWalk: distance since the last snow step (2026-10-23) */
  var time=0, yetiS=13, nextPrint=3, printList=[], collected=new Set(), flagObjects=[];
  var climber, yeti, eyeMaterial, summitCats=[], cameraReady=false, lastHUD='', running=0;
  var LENGTH=440, GRAV=18, JUMP=7.6, SPEED=8.4, COYOTE=.20, BUFFER=.22;
  // Extended route: ladders, timber crossing, a cornice and the avalanche couloir.
  // Route coordinates s/u map into a winding 3D world; all collision uses the
  // same height/width functions as the rendered mesh. No invisible bridges.
  var GAPS=[[30,31.25],[74,75.5],[118,119.25],[151,152.5],[204,205.5],[267,268.5],[322,323.5],[410,411.5]];
  var STEPS=[46,98,143,194,242,310,380], FLAGS=[24,65,108,132,176,218,258,296,344,394,428];
  var LADDERS=[{a:124,b:126,rise:7},{a:286,b:288,rise:9}], BRIDGE=[164,176], CORNICE=[226,229];
  // Four couloirs. Each fires once; a sweep-back re-arms the one you were in.
  var COULOIRS=[[84,96],[248,262],[352,365],[396,408]];
  // Plateaus: [from, to, width multiplier, wind multiplier]. Wide open snowfields where the wind has nothing to break it.
  var PLATEAUS=[[52,62,2.8,1.7],[231,240,2.6,1.6],[299,308,3.0,1.9],[368,378,2.6,1.7]];
  var windLock=false; // dev: _hcDev.calm(true) stills the wind for testing
  function plateau(at){for(var i=0;i<PLATEAUS.length;i++){var p=PLATEAUS[i];if(at>=p[0]&&at<=p[1])return p;}return null;}
  // The wind: a crosswind that wanders, plus gusts on top. Sam: the wind should be what you are mostly fighting.
  var wind={strength:0,target:0,timer:0};
  // The whirlwind that carries a fallen climber back to the flags.
  var whirl={active:false,t:0,dur:1.7,fs:0,fu:0,fy:0,ts:0,ty:0}, whirlMesh=null;
  var rescueGrace=0, rescueShelter=false, corniceWarned=false;
  var climbing=false, corniceTimer=-1, corniceBroken=false, corniceMesh=null;
  // PASS 2 state: post stack, snowfall, gusts, dawn.
  var composer=null, bloomPass=null, gradeEls=[], snowPoints=null, snowPos=null, snowVel=null, SNOW_N=window.innerWidth<600?650:1100, snowLight={value:0};
  var gust={phase:'idle',t:0,dir:1,next:14}, dawn=0, hemi=null, sun=null;
  var NIGHT={bg:0x121419,sky:0xc8ccd4,ground:0x2a2a2e,sun:0xd4d8de,hemiI:.72,sunI:.65}, DAWN={bg:0x411a18,sky:0xc89078,ground:0x3a2c30,sun:0xd88a5a,hemiI:.52,sunI:.82}; /* 2026-10-23 (Sam): slate night, bruised dawn, silver; sRGB output, so bg values are linear (render ~#4a5058 and ~#8a5a56) */ // Orange storm-light builds with altitude; lower sky fill preserves dark faces in the snow.
  var cBg=null, cSky=null, cGround=null, cSun=null;
  var mistBanks=[], cloudBanks=[], cloudFloor=null, rimLight=null, weatherVeil=0, cloudFlow=0, cloudSpin=0, cloudWind=0, snowStorm=0, snowDrift=0, cloudFade={value:0}, cloudTint=null;
  var avalanche={phase:'idle',t:0,front:372,index:-1,done:[],cued:false}, avalancheMesh=null;
  function height(at){return .19*at+STEPS.reduce(function(n,edge){return n+(at>=edge?.85:0);},0)+LADDERS.reduce(function(n,l){return n+l.rise*Math.max(0,Math.min(1,(at-l.a)/(l.b-l.a)));},0);}
  function center(at){return 5*Math.sin(at/17)+2*Math.sin(at/8);}
  function tangent(at){return 5/17*Math.cos(at/17)+.25*Math.cos(at/8);}
  function width(at){if(at> LENGTH-13)return 8;if(at>=BRIDGE[0]&&at<=BRIDGE[1])return 2;var w=5.6+.7*Math.sin(at/14);
    for(var i=0;i<PLATEAUS.length;i++){var p=PLATEAUS[i];if(at>=p[0]-3&&at<=p[1]+3){var ramp=Math.min(1,Math.max(0,Math.min(at-(p[0]-3),(p[1]+3)-at)/3));return w*(1+(p[2]-1)*ramp);}}
    return w;}
  function gap(at){return GAPS.some(function(g){return at>g[0] && at<g[1];}) || corniceBroken && at>CORNICE[0] && at<CORNICE[1];}
  function support(at,across){return at>=-3 && at<=LENGTH+10 && !gap(at) && Math.abs(across)<=width(at)/2;}
  function position(at,across,up){return new THREE.Vector3(center(at)+across,up,-at);}
  function listen(el,event,fn){el.addEventListener(event,fn);removers.push(function(){el.removeEventListener(event,fn);});}
  function held(k){return !!keys[k] || Object.keys(pointerKeys).some(function(id){return pointerKeys[id]===k;});}
  function clearInput(){keys={};pointerKeys={};bufferT=0;jumpCut=false;stage.querySelectorAll('[data-held]').forEach(function(b){b.removeAttribute('data-held');});}
  function announce(message){clearTimeout(feedbackTimer);banner.textContent=message;banner.style.opacity='1';feedbackTimer=setTimeout(function(){banner.style.opacity='0';},1600);}
  function cleanup(){
    if(disposed)return;disposed=true;cancelAnimationFrame(animId);clearTimeout(feedbackTimer);
    if(observer)observer.disconnect();if(resizeObserver)resizeObserver.disconnect();
    removers.forEach(function(remove){remove();});clearInput();
    if(loader){loader.onload=null;loader.onerror=null;}
    if(eng){eng.kill();eng=null;}
    if(scene){var geometries=new Set(),materials=new Set();scene.traverse(function(o){if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){materials.add(m);});});geometries.forEach(function(g){g.dispose();});materials.forEach(function(m){if(m.map)m.map.dispose();m.dispose();});}
    if(bloomPass && bloomPass.dispose){try{bloomPass.dispose();}catch(e){}}
    if(composer){try{composer.renderTarget1.dispose();composer.renderTarget2.dispose();}catch(e){}}
    gradeEls.forEach(function(el){if(el.parentNode)el.parentNode.removeChild(el);});gradeEls=[];
    if(renderer){renderer.dispose();renderer.forceContextLoss();}
    if(document.fullscreenElement===stage && document.exitFullscreen)document.exitFullscreen().catch(function(){});
    if(window._hcCleanup===cleanup)window._hcCleanup=null;
    if(window._hcDev && window._hcDev.canvas===canvas)delete window._hcDev;
  }
  window._hcCleanup=cleanup;
  observer=new MutationObserver(function(){if(!canvas.isConnected)cleanup();});
  observer.observe(document.querySelector('tw-story') || document.body,{childList:true,subtree:true});
  function startGame(){if(!renderer || disposed || finished)return;started=true;if(window.dssAudio&&window.dssAudio.primeSnowSteps)window.dssAudio.primeSnowSteps();paused=false;lastNow=null;accumulator=0;clearInput();cover.hidden=true;pauseButton.textContent='Pause';canvas.focus({preventScroll:true});if(!eng)makeAudio();if(eng)eng.resume();}
  function setPaused(value){if(!started || finished)return;paused=value;clearInput();lastNow=null;accumulator=0;cover.hidden=!value;beginButton.textContent='Resume ascent';pauseButton.textContent=value?'Resume':'Pause';if(eng)eng.silence();if(!value){canvas.focus({preventScroll:true});if(eng)eng.resume();}}
  function releaseJump(){if(!held(' ') && vy>0 && !jumpCut){vy*=.55;jumpCut=true;}}
  function kd(e){
    if(e.target && /INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.tagName))return;
    var k=e.key.length===1?e.key.toLowerCase():e.key;
    if(k==='p'||k==='Escape'){if(started){e.preventDefault();setPaused(!paused);}return;}
    if(window.DSS_DEV && k==='e' && started && !paused && ending<0){s=LENGTH-9;u=0;y=height(s);vy=0;grounded=true;yetiS=LENGTH;cameraReady=false;return;}
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d',' '].indexOf(k)<0)return;
    e.preventDefault();if(paused||finished||ending>=0)return;if(!started)startGame();keys[k]=true;if(k===' '&&!e.repeat)bufferT=BUFFER;
  }
  listen(window,'keydown',kd);
  listen(window,'keyup',function(e){var k=e.key.length===1?e.key.toLowerCase():e.key;keys[k]=false;if(k===' ')releaseJump();});
  listen(window,'blur',function(){if(started&&!finished)setPaused(true);else clearInput();});
  listen(document,'visibilitychange',function(){if(document.hidden && started)setPaused(true);});
  listen(beginButton,'click',startGame);listen(pauseButton,'click',function(){setPaused(!paused);});
  listen(expandButton,'click',function(){
    if(document.fullscreenElement===stage){document.exitFullscreen().catch(function(){});return;}
    if(stage.requestFullscreen)stage.requestFullscreen().catch(function(){stage.classList.toggle('hc-expanded');resize();});
    else{stage.classList.toggle('hc-expanded');resize();}
  });
  listen(document,'fullscreenchange',function(){expandButton.textContent=document.fullscreenElement===stage?'Shrink':'Expand';resize();});
  stage.querySelectorAll('[data-hc-key]').forEach(function(button){
    var k=button.getAttribute('data-hc-key');
    listen(button,'pointerdown',function(e){e.preventDefault();if(paused||finished||ending>=0)return;if(!started)startGame();pointerKeys[e.pointerId]=k;button.setPointerCapture(e.pointerId);button.setAttribute('data-held','');if(k===' ')bufferT=BUFFER;});
    function release(e){delete pointerKeys[e.pointerId];if(!held(k))button.removeAttribute('data-held');if(k===' ')releaseJump();}
    listen(button,'pointerup',release);listen(button,'pointercancel',release);listen(button,'lostpointercapture',release);
    listen(button,'keydown',function(e){if(e.key!==' '&&e.key!=='Enter')return;e.preventDefault();if(paused||finished)return;if(!started)startGame();keys[k]=true;if(k===' '&&!e.repeat)bufferT=BUFFER;});
    listen(button,'keyup',function(e){if(e.key!==' '&&e.key!=='Enter')return;e.preventDefault();keys[k]=false;if(k===' ')releaseJump();});
  });
  function makeAudio(){
  try {
    var actx = new (window.AudioContext || window.webkitAudioContext)();
    var nbuf = actx.createBuffer(1, actx.sampleRate * 2, actx.sampleRate);
    var nd = nbuf.getChannelData(0);
    for (var ni = 0; ni < nd.length; ni++) nd[ni] = Math.random()*2 - 1;
    var nsrc = actx.createBufferSource(); nsrc.buffer = nbuf; nsrc.loop = true;
    var nfilt = actx.createBiquadFilter(); nfilt.type = 'bandpass'; nfilt.frequency.value = 300; nfilt.Q.value = 0.6;
    var ngain = actx.createGain(); ngain.gain.value = 0;
    nsrc.connect(nfilt); nfilt.connect(ngain); ngain.connect(actx.destination);
    nsrc.start();
    var hum = actx.createOscillator(); hum.type = 'sine'; hum.frequency.value = 108;
    var humG = actx.createGain(); humG.gain.value = 0;
    hum.connect(humG); humG.connect(actx.destination);
    hum.start();
    var lastTick = 0;
    eng = {
      resume: function(){ try { actx.resume(); } catch(e){} },
      update: function(gustOn, chantOn, quiet){
        var muted = (window.dssAudio && window.dssAudio.isMuted && window.dssAudio.isMuted());
        var wTgt = muted || quiet ? 0.004 : (gustOn ? 0.055 : 0.018);
        if (muted) wTgt = 0;
        ngain.gain.setTargetAtTime(wTgt, actx.currentTime, 0.4);
        nfilt.frequency.setTargetAtTime(gustOn ? 520 : 300, actx.currentTime, 0.3);
        humG.gain.setTargetAtTime(muted ? 0 : (chantOn ? 0.028 : 0), actx.currentTime, 0.15);
      },
      tick: function(){
        var muted = (window.dssAudio && window.dssAudio.isMuted && window.dssAudio.isMuted());
        if (muted) return;
        var now3 = actx.currentTime;
        if (now3 - lastTick < 0.25) return;
        lastTick = now3;
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = 'sine'; o.frequency.value = 520 + Math.random()*80;
        g.gain.value = 0; g.gain.setTargetAtTime(0.03, now3, 0.008);
        g.gain.setTargetAtTime(0, now3 + 0.06, 0.05);
        o.connect(g); g.connect(actx.destination);
        o.start(); o.stop(now3 + 0.25);
      },
      silence: function(){ ngain.gain.setTargetAtTime(0,actx.currentTime,.05); humG.gain.setTargetAtTime(0,actx.currentTime,.05); },
      kill: function(){ try { nsrc.stop(); hum.stop(); actx.close(); } catch(e){} }
    };
  } catch(e){ eng = null; }

  }
  function resize(){if(!renderer||disposed)return;var w=canvas.parentElement.clientWidth;var h=Math.round(w*(window.innerWidth<500?.96:.75));if(document.fullscreenElement===stage || stage.classList.contains('hc-expanded'))h=Math.min(h,window.innerHeight-160);h=Math.max(200,h);renderer.setSize(w,h,false);canvas.style.height=h+'px';camera.aspect=w/h;camera.updateProjectionMatrix();if(composer){composer.setSize(w,h);if(bloomPass)bloomPass.setSize(w,h);}}
  function boot(){
    if(disposed||!canvas.isConnected)return;
    if(typeof THREE==='undefined'){
      loader=document.createElement('script');loader.src='vendor/three/three.min.js';loader.onload=function(){withPost(start);};loader.onerror=loadFailure;document.head.appendChild(loader);
    }else withPost(start);
  }
  // Bloom and bokeh add-ons load once from vendor/three/ via the shared
  // loader; if they are missing the plain renderer is used and nothing breaks.
  function withPost(fn){if(window.dssLoadPost){window.dssLoadPost(function(){if(!disposed)fn();});}else fn();}
  function loadFailure(){if(disposed)return;beginButton.disabled=true;cover.querySelector('#hc-instructions').textContent='The 3D climb could not load. Reload to try again, or continue to the cave.';document.getElementById('hc-lose').style.display='block';}
  function start(){
    if(disposed||!canvas.isConnected)return;
    try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,powerPreference:'low-power'});}catch(e){loadFailure();return;}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.outputEncoding=THREE.sRGBEncoding;
    scene=new THREE.Scene();scene.background=new THREE.Color(0x121419);scene.fog=new THREE.Fog(0x121419,32,112);
    camera=new THREE.PerspectiveCamera(57,4/3,.1,240);
    hemi=new THREE.HemisphereLight(0xc8e6ff,0x31303b,.72);scene.add(hemi);
    sun=new THREE.DirectionalLight(0xdbeaff,.65);sun.position.set(-25,55,15);scene.add(sun);
    cBg=new THREE.Color();cSky=new THREE.Color();cGround=new THREE.Color();cSun=new THREE.Color();
    // Low grazing light catches silhouettes without bleaching the shelf.
    rimLight=new THREE.DirectionalLight(0xc8d0dc,.28);scene.add(rimLight);scene.add(rimLight.target);
    var rock=new THREE.MeshLambertMaterial({color:0x4c5969});
    cloudTint={value:new THREE.Color(0x8a8c90)};
    rock.onBeforeCompile=function(shader){
      shader.uniforms.hcCloudY=cloudFade;shader.uniforms.hcCloudTint=cloudTint;
      shader.vertexShader='varying float hcRockY;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvec4 hcRock=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nhcRock=instanceMatrix*hcRock;\n#endif\nhcRockY=(modelMatrix*hcRock).y;');
      shader.fragmentShader='uniform float hcCloudY; uniform vec3 hcCloudTint; varying float hcRockY;\n'+shader.fragmentShader.replace('#include <fog_fragment>','#include <fog_fragment>\nfloat cloudDepth=1.0-smoothstep(hcCloudY-8.0,hcCloudY+3.0,hcRockY);\ngl_FragColor.rgb=mix(gl_FragColor.rgb,hcCloudTint,cloudDepth*0.98);');
    };
    var snow=new THREE.MeshPhongMaterial({color:0xabc4d4,specular:0x698a9d,shininess:42,side:THREE.DoubleSide});
    // A slow, faint interference of light across world-space snow; no extra pass.
    snow.onBeforeCompile=function(shader){
      shader.uniforms.hcTime=snowLight;
      shader.vertexShader='varying vec3 hcWorld;\n'+shader.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvec4 hcP=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nhcP=instanceMatrix*hcP;\n#endif\nhcWorld=(modelMatrix*hcP).xyz;');
      shader.fragmentShader='uniform float hcTime; varying vec3 hcWorld;\n'+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat sheen=pow(0.5+0.5*sin(hcWorld.z*0.7+hcWorld.x*1.9+hcTime*0.35),12.0);\ndiffuseColor.rgb+=vec3(0.025,0.045,0.055)*sheen;');
      shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\nvec3 crystalCell=floor(hcWorld*36.0);\nfloat crystal=fract(sin(dot(crystalCell,vec3(127.1,311.7,74.7)))*43758.5453);\nfloat sparkle=pow(max(0.0,sin(hcTime*1.8+crystal*97.0)),18.0)*step(0.982,crystal);\ntotalEmissiveRadiance+=vec3(0.8,0.88,1.0)*sparkle*0.85;');
    };
    var dark=new THREE.MeshLambertMaterial({color:0x162030});
    var cube=new THREE.BoxGeometry(1,1,1), sphere=new THREE.SphereGeometry(1,18,12);
    function mesh(geo,mat,x,y2,z,sx,sy,sz,parent){var m=new THREE.Mesh(geo,mat);m.position.set(x,y2,z);m.scale.set(sx,sy,sz);(parent||scene).add(m);return m;}
    // One indexed snow ribbon and one rock skirt: bounded geometry, two draws.
    var verts=[], faces=[], skirts=[], skirtFaces=[];
    function quad(array,index,a,b,c,d){var n=array.length/3;[a,b,c,d].forEach(function(p){array.push(p[0],p[1],p[2]);});index.push(n,n+2,n+1,n,n+3,n+2);}
    for(var at=-3;at<LENGTH+10;at+=.25){
      var to=at+.25;if(gap((at+to)/2))continue;
      var h0=height(at+.00001),h1=height(to-.00001),w0=width(at)/2,w1=width(to)/2;
      var a=[center(at)-w0,h0,-at],b=[center(at)+w0,h0,-at],c=[center(to)+w1,h1,-to],d=[center(to)-w1,h1,-to];
      if(!((at+to)/2>=BRIDGE[0] && (at+to)/2<=BRIDGE[1]) && !((at+to)/2>=CORNICE[0] && (at+to)/2<=CORNICE[1]))quad(verts,faces,a,b,c,d);
      quad(skirts,skirtFaces,[a[0]-3.5-Math.sin(at*.8),h0-10,a[2]],a,d,[d[0]-3.5-Math.sin(to*.8),h1-10,d[2]]);
      quad(skirts,skirtFaces,b,[b[0]+3.5+Math.sin(at*.8),h0-10,b[2]],[c[0]+3.5+Math.sin(to*.8),h1-10,c[2]],c);
    }
    function ribbon(v,f,mat){var shared=new Map(),points=[],remap=[];for(var i=0;i<v.length;i+=3){var key=v[i].toFixed(5)+','+v[i+1].toFixed(5)+','+v[i+2].toFixed(5);if(!shared.has(key)){shared.set(key,points.length/3);points.push(v[i],v[i+1],v[i+2]);}remap.push(shared.get(key));}var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setIndex(f.map(function(i){return remap[i];}));g.computeVertexNormals();scene.add(new THREE.Mesh(g,mat));}
    ribbon(verts,faces,snow);rock.side=THREE.DoubleSide;ribbon(skirts,skirtFaces,rock);
    // Both lips of every real gap, in one draw: visible ice, never a false floor.
    var lipVerts=[];
    GAPS.concat([CORNICE]).forEach(function(g){g.forEach(function(at){for(var j=0;j<12;j++){var x0=-width(at)/2+width(at)*j/12,x1=-width(at)/2+width(at)*(j+.78)/12;lipVerts.push(center(at)+x0,height(at)+.045,-at,center(at)+x1,height(at)+.045,-at);}});});
    var lipGeo=new THREE.BufferGeometry();lipGeo.setAttribute('position',new THREE.Float32BufferAttribute(lipVerts,3));
    scene.add(new THREE.LineSegments(lipGeo,new THREE.LineBasicMaterial({color:0x8ce1ef,transparent:true,opacity:.85})));
    STEPS.concat(GAPS.reduce(function(all,g){return all.concat(g);},[])).forEach(function(at){mesh(cube,rock,center(at),height(at)-1,-at,width(at),2,.1);});
    // Blue ice exposed down each crevasse wall; never a surface across the gap.
    var iceFaces=[],iceColours=[],iceIndices=[];
    GAPS.concat([CORNICE]).forEach(function(g){g.forEach(function(at,edge){
      var start=iceFaces.length/3;
      for(var row=0;row<3;row++)for(var shard=0;shard<=16;shard++){
        var across=-width(at)/2+width(at)*shard/16;
        iceFaces.push(center(at)+across,height(at)-.02-row*4.5,-at+(edge?.065:-.065)+Math.sin(shard*2.7)*row*.035);
        var tint=row===0?[.4,.86,1]:row===1?[.06,.39,.62]:[.015,.08,.17];iceColours.push(tint[0],tint[1],tint[2]);
        if(row<2&&shard<16){var v=start+row*17+shard;iceIndices.push(v,v+1,v+18,v,v+18,v+17);}
      }
    });});
    var iceFaceGeo=new THREE.BufferGeometry();iceFaceGeo.setAttribute('position',new THREE.Float32BufferAttribute(iceFaces,3));iceFaceGeo.setAttribute('color',new THREE.Float32BufferAttribute(iceColours,3));iceFaceGeo.setIndex(iceIndices);iceFaceGeo.computeVertexNormals();
    var iceWalls=new THREE.Mesh(iceFaceGeo,new THREE.MeshPhongMaterial({color:0xffffff,vertexColors:true,side:THREE.DoubleSide,emissive:0x06314a,emissiveIntensity:.28,specular:0x5ac8e8,shininess:62}));iceWalls.name='ice-blue-crevasse-walls';scene.add(iceWalls);
    var iceCanvas=document.createElement('canvas');iceCanvas.width=iceCanvas.height=256;var ic=iceCanvas.getContext('2d');
    ic.fillStyle='#66b9db';ic.fillRect(0,0,256,256);
    for(var crack=0;crack<13;crack++){ic.strokeStyle=crack%3?'rgba(13,73,116,.5)':'rgba(200,245,255,.7)';ic.lineWidth=crack%3?1:2;ic.beginPath();var ix=(crack*71)%256;ic.moveTo(ix,0);for(var iy=0;iy<=256;iy+=24)ic.lineTo(ix+Math.sin(crack*3+iy*.07)*14,iy);ic.stroke();}
    var iceMap=new THREE.CanvasTexture(iceCanvas);
    var brittleIce=new THREE.MeshPhongMaterial({color:0x88d9f2,map:iceMap,specular:0x9eeaff,shininess:74,emissive:0x06314a,emissiveIntensity:.22});
    var timber=new THREE.MeshLambertMaterial({color:0x766353}),rope=new THREE.MeshLambertMaterial({color:0xc2b18c});
    var beamGeometry=new THREE.CylinderGeometry(1,1,1,8);
    function beam(start,end,radius,material){var v=end.clone().sub(start),m=mesh(beamGeometry,material,0,0,0,radius,v.length(),radius);m.position.copy(start).add(end).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return m;}
    LADDERS.forEach(function(l){
      [-.65,.65].forEach(function(side){beam(position(l.a,side,height(l.a)+.12),position(l.b,side,height(l.b)+.12),.085,timber);});
      for(var rung=0;rung<=l.rise/.38;rung++){var at=l.a+(l.b-l.a)*rung/Math.ceil(l.rise/.38);beam(position(at,-.65,height(at)+.15),position(at,.65,height(at)+.15),.055,rope);}
    });
    for(var plank=BRIDGE[0];plank<BRIDGE[1];plank+=.45){var board=mesh(cube,timber,center(plank),height(plank)+.08,-plank,2,.12,.42);board.rotation.y=-Math.atan(tangent(plank));}
    [-1,1].forEach(function(side){for(var at=BRIDGE[0];at<BRIDGE[1];at+=2){beam(position(at,side,height(at)),position(at,side,height(at)+1.1),.045,timber);beam(position(at,side,height(at)+1.1),position(Math.min(at+2,BRIDGE[1]),side,height(Math.min(at+2,BRIDGE[1]))+1.1),.025,rope);}});
    corniceMesh=mesh(cube,brittleIce,center(227.5),height(227.5)-.08,-227.5,width(227.5),.25,3);
    corniceMesh.rotation.x=Math.atan(.19);
    avalancheMesh=new THREE.InstancedMesh(sphere,snow,28);avalancheMesh.visible=false;scene.add(avalancheMesh);
    whirlMesh=new THREE.InstancedMesh(sphere,snow,44);whirlMesh.visible=false;scene.add(whirlMesh);
    // Rounded, weathered ridge geometry, shared by every distant peak.
    var ridge=new THREE.SphereGeometry(1,20,14),rp=ridge.attributes.position;
    for(var ri=0;ri<rp.count;ri++){var rx=rp.getX(ri),ry=rp.getY(ri),rz=rp.getZ(ri);var erosion=1+.13*Math.sin(rx*9+ry*5)*Math.cos(rz*8-ry*3);rp.setXYZ(ri,rx*erosion+ry*ry*.13,ry,rz*erosion);}
    ridge.computeVertexNormals();
    var peaks=new THREE.InstancedMesh(ridge,rock,34),dummy=new THREE.Object3D();
    for(var i=0;i<34;i++){var at2=i*(LENGTH/32)-20;dummy.position.set(center(at2)+(i%2?1:-1)*(20+(i%5)*4),height(at2)-12,-at2);dummy.scale.set(9+i%4,14+(i%7)*2,12);if(i%3!==0)dummy.scale.setScalar(0);dummy.rotation.y=i;dummy.updateMatrix();peaks.setMatrixAt(i,dummy.matrix);}scene.add(peaks);
    // Distant ridges echo flags turned upside down: planted in the cloud deck,
    // folded stone faces rise to a torn cloth-like skyline rather than floating bunting.
    var flagPeakPositions=[],flagPeakColours=[],flagPeakIndices=[],flagPeakUVs=[];
    var tornTop=[.87,.89,.88,.91,.89,.90,.86];
    for(var strip=0;strip<7;strip++){
      var fx=-1+strip/3,fold=Math.sin(strip*2.3)*.24;
      flagPeakPositions.push(fx,-1,fold*.55,fx*.96,tornTop[strip],fold);
      flagPeakColours.push(.6,.62,.67,.95,.97,1);flagPeakUVs.push(strip/6,0,strip/6,1);
      if(strip<6){var n=strip*2;flagPeakIndices.push(n,n+1,n+3,n,n+3,n+2);}
    }
    var flagPeakGeo=new THREE.BufferGeometry();flagPeakGeo.setAttribute('position',new THREE.Float32BufferAttribute(flagPeakPositions,3));flagPeakGeo.setAttribute('color',new THREE.Float32BufferAttribute(flagPeakColours,3));flagPeakGeo.setAttribute('uv',new THREE.Float32BufferAttribute(flagPeakUVs,2));flagPeakGeo.setIndex(flagPeakIndices);flagPeakGeo.computeVertexNormals();
    // Woven borders and weathered emblems make the huge ridges unmistakably cloth-like.
    var peakCanvas=document.createElement('canvas');peakCanvas.width=256;peakCanvas.height=384;var pc=peakCanvas.getContext('2d');
    pc.fillStyle='#eee8d8';pc.fillRect(0,0,256,384);pc.strokeStyle='rgba(52,48,54,.38)';pc.lineWidth=5;pc.strokeRect(16,19,224,346);pc.lineWidth=1.5;pc.strokeRect(23,26,210,332);
    pc.save();pc.translate(128,192);pc.rotate(Math.PI);pc.lineWidth=3;
    pc.beginPath();pc.ellipse(0,0,57,72,0,0,Math.PI*2);pc.stroke();
    for(var ray=0;ray<12;ray++){var ra=ray*Math.PI/6;pc.beginPath();pc.moveTo(Math.cos(ra)*65,Math.sin(ra)*81);pc.lineTo(Math.cos(ra)*80,Math.sin(ra)*98);pc.stroke();}
    pc.beginPath();pc.moveTo(0,-50);pc.lineTo(38,0);pc.lineTo(0,50);pc.lineTo(-38,0);pc.closePath();pc.stroke();pc.restore();
    for(var weave=0;weave<384;weave+=3){pc.fillStyle=weave%2?'rgba(255,255,255,.045)':'rgba(70,60,65,.045)';pc.fillRect(0,weave,256,1);}
    var peakMap=new THREE.CanvasTexture(peakCanvas);
    var flagPeakMaterial=new THREE.MeshLambertMaterial({color:0xffffff,map:peakMap,vertexColors:true,side:THREE.DoubleSide});
    flagPeakMaterial.onBeforeCompile=function(shader){shader.uniforms.hcFlagTime=snowLight;shader.vertexShader='uniform float hcFlagTime;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.z+=sin(position.x*4.5+position.y*2.0+hcFlagTime*.22)*.12*max(0.0,position.y+.8);');};
    var flagPeakSlots=[];for(var slot=0;slot<34;slot++)if(slot%3!==0)flagPeakSlots.push(slot);
    var flagPeaks=new THREE.InstancedMesh(flagPeakGeo,flagPeakMaterial,flagPeakSlots.length);
    flagPeaks.name='inverted-prayer-flag-peaks';flagPeaks.frustumCulled=false;
    var stoneTints=[0x7391c9,0xe0dbc7,0xba7671,0x7a9f83,0xc2ac61];
    for(var peak=0;peak<flagPeakSlots.length;peak++){
      var pi=flagPeakSlots[peak],ps=pi*(LENGTH/32)-20;
      dummy.position.set(center(ps)+(pi%2?1:-1)*(25+(peak%3)*4),height(ps)-11,-ps);
      dummy.scale.set(8+peak%3,15+(peak%4)*2,7);dummy.rotation.set(0,-.2+Math.sin(peak)*.3,Math.sin(peak*2.3)*.08);dummy.updateMatrix();flagPeaks.setMatrixAt(peak,dummy.matrix);flagPeaks.setColorAt(peak,new THREE.Color(stoneTints[peak%5]));
    }
    flagPeaks.instanceMatrix.needsUpdate=true;flagPeaks.instanceColor.needsUpdate=true;scene.add(flagPeaks);
    // Soft snow shoulders break up the ruler-straight shelf silhouette.
    var drifts=new THREE.InstancedMesh(sphere,snow,88);
    for(var di=0;di<88;di++){var ds=di*(LENGTH/88),side=di%2?1:-1;dummy.position.set(center(ds)+side*(width(ds)/2+.3),height(ds)-.23,-ds);dummy.scale.set(.58,.32,1.9);if(GAPS.some(function(g){return ds>g[0]-1.9 && ds<g[1]+1.9;}))dummy.scale.setScalar(0);dummy.rotation.set(0,0,0);dummy.updateMatrix();drifts.setMatrixAt(di,dummy.matrix);}scene.add(drifts);
    var poleMat=new THREE.MeshLambertMaterial({color:0x80715e});
    var flagMats=[0x6686b5,0xe7dfc9,0xb65f56,0x6b9075,0xd4b364].map(function(c){return new THREE.MeshLambertMaterial({color:c,side:THREE.DoubleSide});});
    FLAGS.forEach(function(at){
      var group=new THREE.Group();group.position.copy(position(at,0,height(at)));scene.add(group);
      mesh(cube,poleMat,-2.25,1.15,0,.07,2.3,.07,group);mesh(cube,poleMat,2.25,1.15,0,.07,2.3,.07,group);
      mesh(cube,poleMat,0,2.17,0,4.5,.025,.025,group);
      for(var n=0;n<9;n++)mesh(cube,flagMats[n%5],-1.95+n*.49,1.96-Math.sin(n/8*Math.PI)*.18,0,.36,.42,.035,group);
      var marker=mesh(cube,new THREE.MeshBasicMaterial({color:0x7b8592}),0,.025,0,4.6,.025,.18,group);flagObjects.push({s:at,marker:marker});
    });
    // Loose roadside offerings: only the original checkpoint banners cross the track.
    function flagScatter(n){var value=Math.sin(n*91.731+17.3)*43758.54;return value-Math.floor(value);}
    var extraFlagGroups=[];
    for(var festoon=0;festoon<39;festoon++){
      var at=5+festoon*10.7+(flagScatter(festoon+7)-.5)*6;if(at>LENGTH-8)break;
      var side=flagScatter(festoon+44)>.5?1:-1;
      var toAt=Math.min(LENGTH-2,at+2.1+flagScatter(festoon+91)*6.2);
      var fromHeight=.65+flagScatter(festoon+13)*1.9,toHeight=.4+flagScatter(festoon+28)*1.8;
      var from=position(at,side*(width(at)/2+.65+flagScatter(festoon+62)*1.2),height(at)+fromHeight);
      var to=position(toAt,side*(width(toAt)/2+.65+flagScatter(festoon+73)*2.1),height(toAt)+toHeight);
      var fg=new THREE.Group();fg.name='decorative-prayer-flags-'+festoon;scene.add(fg);extraFlagGroups.push(fg);
      [from,to].forEach(function(p,index){
        // Short, leaning stakes and rock-tied cords, at unequal heights.
        var anchorHeight=index?toHeight:fromHeight;
        if(flagScatter(festoon*3+index+104)>.3){var stake=mesh(cube,poleMat,p.x,p.y-anchorHeight/2,p.z,.045,anchorHeight+.15,.045,fg);stake.rotation.z=(flagScatter(festoon+index+119)-.5)*.28;}
      });
      var last=from.clone(),pieces=5+Math.floor(flagScatter(festoon+166)*9);
      for(var fn=0;fn<pieces;fn++){
        var fraction=(fn+1)/pieces,point=from.clone().lerp(to,fraction);
        point.y-=Math.sin(fraction*Math.PI)*(.25+flagScatter(festoon+181)*.65);
        var line=point.clone().sub(last),cord=mesh(cube,poleMat,0,0,0,.012,line.length(),.012,fg);
        cord.position.copy(last).add(point).multiplyScalar(.5);cord.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),line.normalize());
        if(flagScatter(fn+festoon*17+201)>.12){
          var fw=.22+flagScatter(fn+festoon*13+220)*.21,fh=.23+flagScatter(fn+festoon*19+241)*.28;
          var cloth=mesh(cube,flagMats[(fn+festoon)%5],point.x,point.y-fh/2,point.z,fw,fh,.015,fg);
          cloth.rotation.y=Math.atan2(to.x-from.x,to.z-from.z)+Math.PI/2+(flagScatter(fn+festoon*7+263)-.5)*1.25;
          cloth.rotation.x=(flagScatter(fn+festoon*11+284)-.5)*.85;cloth.rotation.z=(flagScatter(fn+festoon*3+305)-.5)*.7;
        }
        last.copy(point);
      }
    }
    var flagBatches=new Map();
    flagObjects.map(function(flag){return flag.marker.parent;}).concat(extraFlagGroups).forEach(function(group){group.updateMatrixWorld(true);group.children.slice().forEach(function(m){if(flagObjects.some(function(flag){return m===flag.marker;}))return;var batch=flagBatches.get(m.material)||[];batch.push(m.matrixWorld.clone());flagBatches.set(m.material,batch);group.remove(m);});});
    flagBatches.forEach(function(matrices,material){var batch=new THREE.InstancedMesh(cube,material,matrices.length);batch.name="climb-prayer-flags";batch.frustumCulled=false;matrices.forEach(function(matrix,i){batch.setMatrixAt(i,matrix);});batch.instanceMatrix.needsUpdate=true;scene.add(batch);});
    function person(isYeti){
      var g=new THREE.Group(),coat=new THREE.MeshLambertMaterial({color:isYeti?0xc9d5d8:0xad614b});
      var boots=isYeti?coat:dark,limbs=[];
      mesh(sphere,coat,0,1.15,0,isYeti?.52:.39,.62,.31,g);
      mesh(sphere,coat,0,1.82,-.035,.29,.32,.27,g);
      [-1,1].forEach(function(side){
        var leg=new THREE.Group();leg.position.set(side*.19,.79,0);g.add(leg);
        mesh(sphere,boots,0,-.37,0,.13,.4,.15,leg);mesh(sphere,boots,0,-.69,-.075,.15,.105,.23,leg);limbs.push(leg);
        var arm=new THREE.Group();arm.position.set(side*(isYeti?.47:.39),1.53,0);g.add(arm);
        mesh(sphere,coat,side*.055,-.31,0,.15,isYeti?.47:.38,.15,arm);mesh(sphere,boots,side*.075,-.67,-.02,.115,.13,.12,arm);limbs.push(arm);
      });
      if(isYeti){
        eyeMaterial=new THREE.MeshBasicMaterial({color:0x7a7e84});mesh(sphere,dark,0,1.79,-.255,.2,.13,.07,g);
        [-1,1].forEach(function(side){mesh(sphere,eyeMaterial,side*.095,1.85,-.312,.035,.028,.025,g);});
        // One instanced layer of tapered fur along shoulders and flanks.
        var fur=new THREE.InstancedMesh(sphere,coat,36),f=new THREE.Object3D();
        for(var n=0;n<36;n++){var angle=n*2.399;f.position.set(Math.cos(angle)*.44,.9+(n%6)*.115,Math.sin(angle)*.27);f.scale.set(.065,.16,.055);f.rotation.z=-Math.cos(angle)*.3;f.updateMatrix();fur.setMatrixAt(n,f.matrix);}g.add(fur);g.scale.setScalar(1.35);
      }else{
        var pack=new THREE.MeshLambertMaterial({color:0x354851}),trim=new THREE.MeshLambertMaterial({color:0xcaa779});
        mesh(sphere,pack,0,1.19,.32,.3,.41,.19,g);
        [-1,1].forEach(function(side){mesh(sphere,trim,side*.235,1.2,.43,.035,.32,.035,g);});
        mesh(sphere,dark,0,1.88,.005,.29,.24,.28,g);
        mesh(sphere,coat,0,1.57,-.03,.3,.10,.27,g);
      }
      g.userData.limbs=limbs;scene.add(g);return g;
    }
    function muscularYeti(){
      var g=new THREE.Group(),limbs=[];
      g.name='climb-leading-yeti';
      var hide=new THREE.MeshLambertMaterial({color:0xa9b1b0}); // 2026-10-18: the skin under the fur, a shade darker so the gaps between strands read as depth
      var smooth=new THREE.SphereGeometry(1,24,16), furJobs=[];
      // Rounded muscle volumes are batched per moving limb, rather than boxes
      // or separate draw calls for every shoulder, forearm, thigh and calf.
      function volumes(parent,parts,material){
        var batch=new THREE.InstancedMesh(smooth,material||hide,parts.length),d=new THREE.Object3D();
        parts.forEach(function(p,i){d.position.set(p[0],p[1],p[2]);d.scale.set(p[3],p[4],p[5]);d.rotation.set(p[6]||0,0,p[7]||0);d.updateMatrix();batch.setMatrixAt(i,d.matrix);});
        if(!material)furJobs.push({parent:parent,parts:parts});
        parent.add(batch);return batch;
      }
      // Continuous pelvis-to-neck contour: narrow waist, flared lats and a
      // broad rib cage. Flattened depth keeps the back human, not barrel-like.
      var contour=[[.24,.78],[.33,.85],[.36,.96],[.32,1.08],[.30,1.20],[.36,1.37],[.46,1.53],[.49,1.64],[.43,1.74],[.29,1.83],[.16,1.89]];
      var trunk=new THREE.Mesh(new THREE.LatheGeometry(contour.map(function(p){return new THREE.Vector2(p[0],p[1]);}),32),hide);
      trunk.scale.z=.68;g.add(trunk);
      volumes(g,[
        [0,1.88,0,.17,.20,.18],                 // thick human neck
        [0,2.15,-.015,.235,.285,.215],         // skull
        [0,2.01,-.075,.19,.17,.18],            // jaw
        [-.22,1.67,.12,.25,.13,.10,0,-.24],   // trapezius / shoulder blades
        [.22,1.67,.12,.25,.13,.10,0,.24],
        [-.21,1.56,-.205,.22,.135,.09,0,-.06],  // pectorals, visible at the turn
        [.21,1.56,-.205,.22,.135,.09,0,.06],
        [-.15,.92,.12,.18,.145,.12], [.15,.92,.12,.18,.145,.12]
      ]);
      [-1,1].forEach(function(side){
        var leg=new THREE.Group();leg.position.set(side*.205,.96,0);g.add(leg);
        volumes(leg,[
          [0,-.22,0,.195,.32,.21],             // powerful tapered thigh
          [0,-.45,-.025,.135,.15,.145],        // knee
          [0,-.62,.035,.145,.26,.16],          // calf
          [0,-.81,0,.105,.14,.12],             // ankle
          [0,-.865,-.11,.145,.095,.255]        // bare long foot
        ]);limbs.push(leg);
        var arm=new THREE.Group();arm.position.set(side*.49,1.71,0);g.add(arm);
        volumes(arm,[
          [0,-.015,0,.20,.21,.20],              // rounded deltoid
          [side*.035,-.24,.015,.175,.29,.18],  // biceps / triceps
          [side*.045,-.46,0,.125,.135,.13],    // elbow
          [side*.065,-.64,-.03,.145,.235,.14], // forearm
          [side*.08,-.835,-.065,.09,.12,.10],  // wrist
          [side*.085,-.94,-.08,.12,.145,.11]   // relaxed hand
        ]);limbs.push(arm);
      });
      // A recessed face, brow and small eyes retain the silent recognition at
      // the cave; the limbs, turn timing and world-space guide position stay put.
      volumes(g,[[0,2.10,-.203,.158,.10,.043]],new THREE.MeshLambertMaterial({color:0x4d5756})); // 2026-10-18: grey skin; the old near-black read as goggles
      volumes(g,[[-.085,2.18,-.205,.10,.05,.06],[.085,2.18,-.205,.10,.05,.06]]); // brows: grown into a shaggy fringe below
      volumes(g,[[0,2.085,-.24,.053,.09,.055]],new THREE.MeshLambertMaterial({color:0x3f4746})); // 2026-10-18: the nose is skin, not a white blob
      eyeMaterial=new THREE.MeshBasicMaterial({color:0x7a7e84});
      volumes(g,[[-.081,2.13,-.245,.026,.022,.018],[.081,2.13,-.245,.026,.022,.018]],eyeMaterial);
      // 2026-10-18 (Sam: "less like the Michelin Man. Keep him muscular, but he should be more ragged and hairy"):
      // the muscle volumes stay as the body; a coat of faceted strands covers them. Each strand is a five-sided cone
      // grown from the surface and drooping under its own weight; tones vary from snow to slate; shoulders, forearm
      // cuffs, shins and the back of the skull grow long, shaggy locks; the face, palms and soles stay bare.
      var rnd=(function(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};})(1973);
      var strand=new THREE.ConeGeometry(1,1,4,1,false);strand.translate(0,.5,0);strand.scale(1,1,.45); // a flat lock, not a round spine
      var furMat=new THREE.MeshLambertMaterial({color:0xffffff});
      var TONES=[0xeceee8,0xdfe2dc,0xcfd3ce,0xbfc4be,0xadb2ab,0xd8d1bf,0xc2baa6,0x9a9e96,0x868a83]; // snow to weathered grey and a little old-ivory dirt
      var UP=new THREE.Vector3(0,1,0),DOWN=new THREE.Vector3(0,-1,0);
      function grow(parent,points){
        if(!points.length)return null; // an empty batch breaks three r128 (the brow and nose sit wholly on the bare face)
        var fur=new THREE.InstancedMesh(strand,furMat,points.length),o=new THREE.Object3D(),c=new THREE.Color(),dir=new THREE.Vector3();
        var slope=new THREE.Vector3();
        points.forEach(function(q,i){
          // combed down the surface: the downhill tangent at the root, lifted off the skin by (1 - droop), so the tops of
          // the shoulders and skull are covered too (hair hanging straight down from a top surface would sink into him)
          slope.copy(DOWN).addScaledVector(q.n,-DOWN.dot(q.n));
          var lift=Math.max(.12,1-q.droop)*(.8+rnd()*.5);
          if(q.n.y<-.55)dir.copy(DOWN);                                                     // undersides simply hang
          else if(slope.lengthSq()<.04)dir.set(rnd()-.5,0,rnd()-.5).normalize().multiplyScalar(.7).add(q.n).normalize(); // a crown lies outward
          else dir.copy(slope.normalize()).multiplyScalar(1-lift).addScaledVector(q.n,lift).addScaledVector(DOWN,.6*Math.max(0,q.n.y)).normalize(); // near a top, tip it down so it lies over the curve
          o.position.copy(q.p);o.quaternion.setFromUnitVectors(UP,dir);
          var ragged=rnd()<.07?1.35+rnd()*.3:1; // a few long, matted outliers break the outline
          var topShort=1-(q.keep?.2:.55)*Math.max(0,q.n.y); // shorter on upward-facing skin, or it overhangs the silhouette (less so on the head: a mane)
          var w=q.w*(.75+rnd()*.5);o.scale.set(w,q.len*(.7+rnd()*.6)*ragged*topShort,w*(.8+rnd()*.4));o.updateMatrix();fur.setMatrixAt(i,o.matrix);
          c.setHex(TONES[Math.floor(rnd()*(q.dark?TONES.length:TONES.length-2))]);if(q.p.y<.35&&!q.dark)c.multiplyScalar(.9);fur.setColorAt(i,c);
        });
        fur.instanceMatrix.needsUpdate=true;if(fur.instanceColor)fur.instanceColor.needsUpdate=true;parent.add(fur);return fur;
      }
      // points on an ellipsoid volume [x,y,z,rx,ry,rz,rotX,rotZ], with outward normals, in the parent's space
      function onVolume(p,count,rule){
        var out=[],e=new THREE.Euler(p[6]||0,0,p[7]||0),u=new THREE.Vector3(),n=new THREE.Vector3();
        for(var k=0;k<count;k++){
          var zz=1-2*(k+.5)/count,rr=Math.sqrt(1-zz*zz),ph=k*2.39996+rnd()*.4;u.set(Math.cos(ph)*rr,zz,Math.sin(ph)*rr);
          n.set(u.x/p[3],u.y/p[4],u.z/p[5]).normalize().applyEuler(e);
          var pt=new THREE.Vector3(u.x*p[3],u.y*p[4],u.z*p[5]).applyEuler(e).add(new THREE.Vector3(p[0],p[1],p[2]));
          var r=rule(pt,n.clone());if(r)out.push({p:pt.addScaledVector(n,-.012),n:n.clone(),len:r.len,w:r.w,droop:r.droop,dark:r.dark});
        }
        return out;
      }
      function area(p){return p[3]*p[4]+p[4]*p[5]+p[3]*p[5];}
      // the torso: the lathe contour, scaled .68 deep
      var body=[];
      for(var k=0;k<560;k++){
        var t=rnd(),seg=Math.min(contour.length-2,Math.floor(t*(contour.length-1))),f=t*(contour.length-1)-seg,a=contour[seg],b=contour[seg+1];
        var rad=a[0]+(b[0]-a[0])*f,hy=a[1]+(b[1]-a[1])*f,ang=rnd()*Math.PI*2;
        var nn=new THREE.Vector3(Math.cos(ang),(a[0]-b[0])*.6,Math.sin(ang)/.68).normalize();
        var shoulder=hy>1.45,front=Math.sin(ang)<-.35;
        body.push({p:new THREE.Vector3(Math.cos(ang)*rad,hy,Math.sin(ang)*rad*.68).addScaledVector(nn,-.01),n:nn,
          len:shoulder?.2+rnd()*.12:(front?.09+rnd()*.06:.12+rnd()*.08),w:shoulder?.046:.038,droop:shoulder?.8:.86,dark:!front});
      }
      grow(g,body);
      furJobs.forEach(function(job){
        var pts=[],isArm=limbs.indexOf(job.parent)>=0 && job.parent.position.y>1.5,isLeg=limbs.indexOf(job.parent)>=0 && !isArm;
        var isBrow=!isArm && !isLeg && job.parts.length===2 && job.parts[0][1]===2.18;
        job.parts.forEach(function(p){
          var isHead=!isArm && !isLeg && !isBrow && p[1]>1.95;
          var count=Math.round(area(p)*(isArm||isLeg?760:(isBrow?2600:(isHead?1500:620))));
          pts=pts.concat(onVolume(p,count,function(pt,n){
            if(isBrow){ // a shaggy fringe hanging over the eyes
              if(n.y<-.3 || n.z>.3)return null;return {len:.07+rnd()*.05,w:.03,droop:.93,dark:false,keep:true};
            }
            if(!isArm && !isLeg){
              // the face itself stays bare (tight now, so the fur frames it); a dense mane over crown, sides and back
              if(pt.z<-.1 && Math.abs(pt.x)<.15 && pt.y>1.98 && pt.y<2.24)return null;
              var back=n.z>.2,crown=pt.y>2.28;return {len:back?.19+rnd()*.11:(crown?.15+rnd()*.08:.1+rnd()*.06),w:.04,droop:back?.86:(crown?.7:.82),dark:back,keep:true};
            }
            if(isArm){
              var y=pt.y;if(y<-.88)return null; // the hand stays bare
              var cuff=y<-.52 && y>-.8,deltoid=y>-.12;
              return {len:cuff?.2+rnd()*.12:(deltoid?.17+rnd()*.1:.11+rnd()*.07),w:cuff?.044:.036,droop:cuff?.93:.86,dark:n.z>0};
            }
            var yl=pt.y;if(yl<-.8)return null; // the foot stays bare
            var shin=yl<-.5;return {len:shin?.22+rnd()*.12:.13+rnd()*.07,w:shin?.046:.038,droop:shin?.94:.86,dark:true};
          }));
        });
        grow(job.parent,pts);
      });
      // bare hands and feet a dark, weathered grey rather than the fur's white
      var hands=new THREE.MeshLambertMaterial({color:0x3f4746}); // dark, leathery
      limbs.forEach(function(l){var isArm=l.position.y>1.5;l.children.forEach(function(c){if(c.isInstancedMesh && c.material===hide && c.count>=5){
        var m=new THREE.Matrix4(),q=new THREE.Object3D(),idx=isArm?[5]:[4];
        idx.forEach(function(i){c.getMatrixAt(i,m);m.decompose(q.position,q.quaternion,q.scale);var h=new THREE.Mesh(smooth,hands);h.position.copy(q.position);h.quaternion.copy(q.quaternion);h.scale.copy(q.scale).multiplyScalar(isArm?.96:1.02);l.add(h);});
      }});});
      // AVIATORS (Sam): on his face only once he has turned at the cave mouth. Teardrop lenses, dark with a cool glint,
      // in a thin gold wire frame, a double bridge, temples running back into the fur.
      var shades=new THREE.Group();shades.name='yeti-aviators';shades.visible=false;
      var lensShape=new THREE.Shape();
      lensShape.moveTo(-.055,.035);lensShape.bezierCurveTo(-.02,.05,.045,.05,.06,.03);lensShape.bezierCurveTo(.07,.0,.05,-.045,.005,-.05);lensShape.bezierCurveTo(-.04,-.055,-.07,-.02,-.055,.035);
      var lensGeo=new THREE.ShapeGeometry(lensShape,12);
      var lensMat=new THREE.MeshPhongMaterial({color:0x14181d,specular:0x9fb6c8,shininess:90,emissive:0x05070a});
      var gold=new THREE.MeshPhongMaterial({color:0xc8a14a,specular:0xfff0c0,shininess:60});
      var rim=lensShape.getPoints(24).map(function(v){return new THREE.Vector3(v.x,v.y,0);});
      var rimGeo=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rim,true),48,.0042,5,true);
      [-1,1].forEach(function(side){
        var lens=new THREE.Group();lens.position.set(side*.082,2.13,-.262);lens.rotation.y=side*.12;
        var glass=new THREE.Mesh(lensGeo,lensMat);glass.scale.x=-side;glass.rotation.y=Math.PI;lens.add(glass);
        var frame=new THREE.Mesh(rimGeo,gold);frame.scale.x=-side;frame.rotation.y=Math.PI;lens.add(frame);
        shades.add(lens);
        var temple=new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,.26,5),gold);temple.rotation.x=Math.PI/2;temple.position.set(side*.148,2.15,-.14);temple.rotation.z=side*.08;shades.add(temple);
      });
      [[2.162,.034],[2.142,.022]].forEach(function(bar){var br=new THREE.Mesh(new THREE.CylinderGeometry(.0035,.0035,bar[1]*2.2,5),gold);br.rotation.z=Math.PI/2;br.position.set(0,bar[0],-.272);shades.add(br);});
      g.add(shades);g.userData.shades=shades;
      g.scale.setScalar(1.35);g.userData.limbs=limbs;scene.add(g);return g;
    }
    // 2026-10-18 (Sam: the climber "looks kinda lame"; he chose a hooded mountaineer seen from behind): an anonymous
    // figure at the yeti's level of detail. Hood up with a fur ruff (no face is ever built), a long weathered anorak,
    // a frame pack with a rolled mat and a strapped ice axe, a rope coil over one shoulder, gaiters and heavy boots.
    // Same limb groups and order as before (leg, arm per side), so the walk and the snow-whirl animate him unchanged.
    function mountaineer(){
      var g=new THREE.Group(),limbs=[];g.name='climb-mountaineer';
      // no fog on him, and his colours converted to linear: this renderer outputs sRGB, which lifted 0x2a1513 to a mid brick-brown
      var M=function(c){return new THREE.MeshLambertMaterial({color:new THREE.Color(c).convertSRGBToLinear(),fog:false});};
      // 2026-10-18 (Sam: "still look kinda cosy and safe ... a more shadowy figure"): near-black throughout, the warm
      // accents cooled to dirty greys, so he reads as a dark cut-out against the snow; only a trace of oxblood left in the cloth
      var anorak=M(0x2a1513),yoke=M(0x150b0a),
          trouser=M(0x16191c),gaiter=M(0x24282c),boot=M(0x0f0c0b),sole=M(0x070605),mitt=M(0x111315),pack=M(0x1a2126),packDark=M(0x101519),strap=M(0x0b0e10),mat=M(0x3a3731),rope=M(0x4f4a40),steel=M(0x5b6266),wood=M(0x2e2219),ruffC=M(0x7d786e);
      var ball=new THREE.SphereGeometry(1,20,14),box=new THREE.BoxGeometry(1,1,1),cyl=new THREE.CylinderGeometry(1,1,1,14);
      var taper=function(top,bottom,h){return new THREE.CylinderGeometry(top,bottom,h,14);}; // limbs as tapered tubes, not stacked balls
      var snow=M(0xa9a7a1); // dulled, so the snow on him doesn't brighten the silhouette
      // the anorak: a lathe from the hem (mid-thigh) to the shoulders, a little deeper than it is wide at the back
      var prof=[[.27,.66],[.30,.72],[.31,.86],[.29,1.02],[.30,1.20],[.33,1.36],[.35,1.50],[.31,1.60],[.20,1.68],[.12,1.72]];
      var coat=new THREE.Mesh(new THREE.LatheGeometry(prof.map(function(p){return new THREE.Vector2(p[0],p[1]);}),28),anorak);coat.scale.z=.78;g.add(coat);
      mesh(ball,yoke,0,1.5,.02,.345,.12,.27,g);                     // shoulder yoke, darker cloth
      mesh(cyl,strap,0,.93,0,.305,.05,.24,g);                        // waist belt / harness
      mesh(cyl,snow,0,.69,0,.315,.07,.25,g);                         // a crust of snow on the coat's hem
      mesh(cyl,yoke,0,.74,0,.312,.02,.246,g);                        // the hem's drawcord
      [-1,1].forEach(function(sd){mesh(box,yoke,sd*.16,1.06,-.21,.1,.12,.03,g);}); // chest pockets (front, rarely seen)
      // hood, up: a rounded, slightly peaked shell; the face opening is a dark recess and a fur ruff
      var hood=mesh(ball,anorak,0,1.86,.02,.215,.24,.235,g);
      mesh(ball,yoke,0,1.98,.06,.11,.055,.15,g);                     // the hood's peak
      mesh(box,yoke,0,1.87,.245,.014,.26,.03,g);                     // a seam down the back of the hood
      mesh(ball,M(0x0d1117),0,1.83,-.13,.13,.15,.08,g); // the opening, tucked inside the hood
      var ruff=new THREE.Group();ruff.position.set(0,1.84,-.14);g.add(ruff);
      var tuft=new THREE.ConeGeometry(1,1,4,1,false);tuft.translate(0,.5,0);
      var ring=new THREE.InstancedMesh(tuft,ruffC,46),o=new THREE.Object3D(),up=new THREE.Vector3(0,1,0),dir=new THREE.Vector3();
      for(var k=0;k<46;k++){var a=k/46*Math.PI*2,rx=.17,ry=.2;o.position.set(Math.cos(a)*rx,Math.sin(a)*ry,0);dir.set(Math.cos(a),Math.sin(a),-.35+Math.random()*.2).normalize();o.quaternion.setFromUnitVectors(up,dir);o.scale.set(.022,.06+Math.random()*.04,.014);o.updateMatrix();ring.setMatrixAt(k,o.matrix);}
      ruff.add(ring);
      // the pack: frame pack on the back (+z), lid, side pockets, a rolled mat on top, an ice axe strapped across
      mesh(box,pack,0,1.22,.36,.46,.62,.26,g);
      mesh(box,packDark,0,1.56,.37,.44,.1,.27,g);                    // lid
      [-1,1].forEach(function(sd){mesh(box,packDark,sd*.25,1.1,.37,.06,.3,.2,g);mesh(box,strap,sd*.17,1.3,.215,.04,.66,.03,g);}); // side pockets, shoulder straps
      mesh(box,strap,0,1.0,.495,.36,.04,.02,g);mesh(box,strap,0,1.36,.495,.36,.04,.02,g); // compression straps
      var roll=mesh(cyl,mat,0,1.7,.36,.12,.52,.12,g);roll.rotation.z=Math.PI/2;
      [-1,1].forEach(function(sd){var b=mesh(cyl,strap,sd*.16,1.7,.36,.125,.025,.125,g);b.rotation.z=Math.PI/2;});
      var axe=new THREE.Group();axe.position.set(.08,1.2,.5);axe.rotation.z=-.5;g.add(axe);
      mesh(cyl,wood,0,0,0,.018,.78,.018,axe);mesh(box,steel,0,.38,0,.24,.03,.025,axe);mesh(box,steel,.13,.36,0,.05,.05,.02,axe);mesh(cyl,steel,0,-.41,0,.012,.06,.012,axe);
      // a rope coil over the left shoulder, across the chest
      var coil=new THREE.Mesh(new THREE.TorusGeometry(.33,.028,6,26),rope);coil.position.set(-.04,1.32,0);coil.rotation.set(Math.PI/2,.0,.62);coil.scale.set(1,.8,1);g.add(coil);
      [-1,1].forEach(function(sd){
        var leg=new THREE.Group();leg.position.set(sd*.15,.86,0);g.add(leg);
        mesh(taper(.125,.105,.36),trouser,0,-.17,0,1,1,1,leg);        // thigh, mostly under the coat
        mesh(ball,trouser,0,-.36,0,.1,.08,.105,leg);                 // knee
        mesh(taper(.112,.098,.34),gaiter,0,-.54,0,1,1,1,leg);        // gaiter over the shin
        mesh(cyl,strap,0,-.4,0,.114,.018,.114,leg);                  // gaiter top strap
        mesh(box,boot,0,-.75,-.04,.16,.12,.27,leg);mesh(box,sole,0,-.82,-.04,.17,.04,.29,leg); // heavy boot and sole
        limbs.push(leg);
        var arm=new THREE.Group();arm.position.set(sd*.37,1.54,0);g.add(arm);
        mesh(ball,anorak,0,0,0,.115,.1,.115,arm);                     // the shoulder seam
        var up1=mesh(taper(.1,.088,.32),anorak,sd*.02,-.18,0,1,1,1,arm);up1.rotation.z=sd*.05; // upper sleeve
        mesh(ball,yoke,sd*.035,-.35,.0,.085,.07,.085,arm);            // elbow patch
        var fo=mesh(taper(.088,.078,.26),anorak,sd*.045,-.49,-.015,1,1,1,arm);fo.rotation.z=sd*.04; // forearm sleeve
        mesh(cyl,yoke,sd*.055,-.62,-.03,.085,.04,.085,arm);           // cuff
        mesh(ball,mitt,sd*.06,-.72,-.04,.08,.1,.075,arm);             // mitt
        limbs.push(arm);
      });
      // a dusting of snow on the hood, shoulders and pack lid
      [[0,2.06,.05,.13,.03,.13],[-.21,1.6,.05,.13,.03,.11],[.21,1.6,.05,.13,.03,.11],[0,1.62,.38,.2,.025,.12],[.12,1.79,.37,.08,.02,.05]].forEach(function(d){mesh(ball,snow,d[0],d[1],d[2],d[3],d[4],d[5],g);});
      g.userData.limbs=limbs;scene.add(g);return g;
    }
    climber=mountaineer();yeti=muscularYeti(); // 2026-10-18: the hooded mountaineer (was person(false))
    // Two quiet companions in the final stretch; decorative, never obstacles.
    var catSphere=new THREE.SphereGeometry(1,16,12),catEar=new THREE.ConeGeometry(1,1,3);
    var catCoat=new THREE.MeshPhongMaterial({color:0x191e26,specular:0x424951,shininess:8}),catWhite=new THREE.MeshPhongMaterial({color:0xd9dedb,specular:0x555a59,shininess:6}),catEyes=new THREE.MeshBasicMaterial({color:0xbaa76b}),catPink=new THREE.MeshLambertMaterial({color:0x685659});
    function summitCat(tuxedo,side){
      var group=new THREE.Group();group.name=side<0?'summit-black-cat-left':'summit-tuxedo-cat-right';group.visible=false;scene.add(group);
      var darkParts=[[0,.26,.015,.128,.15,.275],[0,.27,-.13,.12,.16,.14],[0,.25,.17,.13,.15,.15],[-.09,.19,.17,.07,.12,.12],[.09,.19,.17,.07,.12,.12],[0,.36,-.21,.075,.1,.085],[0,.445,-.26,.105,.095,.10],[-.035,.405,-.345,.044,.035,.035],[.035,.405,-.345,.044,.035,.035]];
      var paleParts=tuxedo?[[0,.33,-.19,.105,.11,.065],[.102,.28,.08,.055,.14,.17],[.04,.4,.1,.075,.055,.14],[0,.43,-.328,.022,.065,.015]]:[];
      function batch(geometry,material,parts,parent){var im=new THREE.InstancedMesh(geometry,material,parts.length),pose=new THREE.Object3D();parts.forEach(function(p,i){pose.position.set(p[0],p[1],p[2]);pose.scale.set(p[3],p[4],p[5]);pose.rotation.set(0,0,0);pose.updateMatrix();im.setMatrixAt(i,pose.matrix);});im.instanceMatrix.needsUpdate=true;im.frustumCulled=false;(parent||group).add(im);return im;}
      batch(catSphere,catCoat,darkParts);if(paleParts.length)batch(catSphere,catWhite,paleParts);
      batch(catEar,catCoat,[[-.072,.535,-.25,.046,.115,.043],[.072,.535,-.25,.046,.115,.043]]);
      batch(catEar,catPink,[[-.072,.539,-.275,.027,.075,.016],[.072,.539,-.275,.027,.075,.016]]);
      batch(catSphere,catPink,[[0,.419,-.376,.019,.012,.012]]);
      var whiskerVertices=[];[-1,1].forEach(function(side){for(var whisker=0;whisker<3;whisker++){whiskerVertices.push(side*.04,.401,-.37,side*(.12+whisker*.008),.386+whisker*.013,-.345);}});
      var whiskerGeo=new THREE.BufferGeometry();whiskerGeo.setAttribute('position',new THREE.Float32BufferAttribute(whiskerVertices,3));group.add(new THREE.LineSegments(whiskerGeo,new THREE.LineBasicMaterial({color:0xb2b4b6,transparent:true,opacity:.32})));
      batch(catSphere,catEyes,[[-.047,.46,-.349,.011,.014,.008],[.047,.46,-.349,.011,.014,.008]]);
      var legs=batch(catSphere,catCoat,[[0,0,0,1,1,1],[0,0,0,1,1,1],[0,0,0,1,1,1],[0,0,0,1,1,1]]);
      var paws=batch(catSphere,tuxedo?catWhite:catCoat,[[0,0,0,1,1,1],[0,0,0,1,1,1],[0,0,0,1,1,1],[0,0,0,1,1,1]]);
      var tailRoot=new THREE.Group();tailRoot.position.set(0,.31,.22);group.add(tailRoot);
      batch(catSphere,catCoat,[[0,.015,.04,.036,.04,.07],[0,.055,.095,.034,.055,.045],[0,.13,.12,.032,.065,.035],[.008,.215,.12,.03,.065,.032],[.027,.29,.1,.028,.045,.035],[.06,.325,.07,.026,.027,.04],[.09,.32,.035,.023,.026,.03],[.1,.292,.012,.019,.03,.022]],tailRoot);
      group.scale.setScalar(1.15);group.userData={side:side,tuxedo:tuxedo,legs:legs,paws:paws,tail:tailRoot,pose:new THREE.Object3D()};return group;
    }
    summitCats=[summitCat(false,-1),summitCat(true,1)];
    var pawCanvas=document.createElement('canvas');pawCanvas.width=pawCanvas.height=64;var pawInk=pawCanvas.getContext('2d');
    pawInk.fillStyle='#36434c';pawInk.beginPath();pawInk.ellipse(32,42,12,10,0,0,Math.PI*2);pawInk.fill();
    [[14,27,-.35],[25,18,-.13],[39,18,.13],[50,27,.35]].forEach(function(toe){pawInk.beginPath();pawInk.ellipse(toe[0],toe[1],5,7,toe[2],0,Math.PI*2);pawInk.fill();});
    var pawMap=new THREE.CanvasTexture(pawCanvas),pawMat=new THREE.MeshBasicMaterial({map:pawMap,transparent:true,opacity:.42,depthWrite:false,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1});
    summitCats.forEach(function(cat){
      var trail=new THREE.InstancedMesh(new THREE.PlaneGeometry(.11,.145),pawMat,32);trail.name=cat.name+'-paw-trail';trail.visible=false;trail.frustumCulled=false;scene.add(trail);
      cat.userData.trail=trail;cat.userData.trailPose=new THREE.Object3D();cat.userData.trailYaw=new THREE.Quaternion();
    });

    // Irregular overlapping boulders form an open cave arch.
    var caveAt=LENGTH+5,caveY=height(caveAt),caveX=center(caveAt);
    for(var ci=0;ci<9;ci++){var ca=ci/8*Math.PI;var stone=mesh(ridge,rock,caveX+Math.cos(ca)*3.9,caveY+.6+Math.sin(ca)*4.5,-caveAt,1.75,1.75,2.5);stone.rotation.z=ca*.7;}
    mesh(sphere,snow,caveX,caveY+6,-caveAt,4.4,.75,2.6);
    mesh(sphere,new THREE.MeshBasicMaterial({color:0x060d17}),caveX,caveY+2.1,-caveAt-2,3.1,2.7,.3);
    var hardware=new Map();scene.updateMatrixWorld(true);scene.children.slice().forEach(function(o){if(o.isMesh && (o.material===timber || o.material===rope)){var key=o.geometry.uuid+o.material.uuid;var batch=hardware.get(key)||{geometry:o.geometry,material:o.material,matrices:[]};batch.matrices.push(o.matrixWorld.clone());hardware.set(key,batch);scene.remove(o);}});
    hardware.forEach(function(batch){var instanced=new THREE.InstancedMesh(batch.geometry,batch.material,batch.matrices.length);batch.matrices.forEach(function(m,i){instanced.setMatrixAt(i,m);});scene.add(instanced);});
    // SNOWFALL: one Points cloud in a box that travels with the camera. Each
    // flake falls, drifts with the wind, and wraps when it leaves the box, so
    // the cloud is bounded whatever the route length. The flurry angle is the
    // gust telegraph: the whole cloud leans before the push arrives.
    {
      snowPos=new Float32Array(SNOW_N*3);snowVel=new Float32Array(SNOW_N);
      for(var si=0;si<SNOW_N;si++){snowPos[si*3]=(Math.random()-.5)*44;snowPos[si*3+1]=(Math.random()-.5)*26;snowPos[si*3+2]=(Math.random()-.5)*44;snowVel[si]=1.6+Math.random()*2.2;}
      var snowGeo=new THREE.BufferGeometry();snowGeo.setAttribute('position',new THREE.BufferAttribute(snowPos,3));
      var flakeColors=new Float32Array(SNOW_N*3);for(var fc=0;fc<SNOW_N;fc++){var glint=.55+Math.random()*.45;flakeColors[fc*3]=glint*.85;flakeColors[fc*3+1]=glint*.94;flakeColors[fc*3+2]=glint;}snowGeo.setAttribute('color',new THREE.BufferAttribute(flakeColors,3));
      var flakeCanvas=document.createElement('canvas');flakeCanvas.width=flakeCanvas.height=32;var fx=flakeCanvas.getContext('2d');var fg=fx.createRadialGradient(16,16,0,16,16,16);fg.addColorStop(0,'rgba(255,255,255,1)');fg.addColorStop(.35,'rgba(255,255,255,.85)');fg.addColorStop(1,'rgba(255,255,255,0)');fx.fillStyle=fg;fx.fillRect(0,0,32,32);
      var flakeTex=new THREE.CanvasTexture(flakeCanvas);
      var snowMat=new THREE.PointsMaterial({color:0xf2f6ff,vertexColors:true,size:.15,map:flakeTex,transparent:true,opacity:.7,depthWrite:false,sizeAttenuation:true});
      // Independent, gentle flake glints; the clock freezes for reduced motion.
      snowMat.onBeforeCompile=function(shader){
        shader.uniforms.hcTime=snowLight;
        shader.vertexShader='varying float hcFlake;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nhcFlake=fract(sin(dot(position,vec3(12.9898,78.233,37.719)))*43758.5453);');
        shader.fragmentShader='uniform float hcTime; varying float hcFlake;\n'+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat twinkle=pow(max(0.0,sin(hcTime*1.7+hcFlake*62.8)),10.0);\ndiffuseColor.rgb*=0.8+twinkle*1.3;');
      };
      snowPoints=new THREE.Points(snowGeo,snowMat);snowPoints.frustumCulled=false;scene.add(snowPoints);
      // Broad, feathered veils of spindrift beyond the immediate jumping area.
      // Share the flake texture; normal scene cleanup owns every material.
      for(var mb=0;mb<7;mb++){
        var mist=new THREE.Sprite(new THREE.SpriteMaterial({map:flakeTex,color:0xacc6df,transparent:true,opacity:.07,depthWrite:false}));
        mist.scale.set(34+mb%3*9,7+mb%2*4,1);mistBanks.push(mist);scene.add(mist);
      }
    }
    // A continuous cloud deck closes the void; soft banks give its top depth.
    // All geometry stays well below the shelf and follows the ascent.
    cloudFloor=new THREE.Mesh(new THREE.PlaneGeometry(700,700),new THREE.MeshBasicMaterial({color:0x5e6268,side:THREE.DoubleSide}));
    cloudFloor.rotation.x=-Math.PI/2;scene.add(cloudFloor);
    var cloudCanvas=document.createElement('canvas');cloudCanvas.width=cloudCanvas.height=64;
    var cc=cloudCanvas.getContext('2d'),cg=cc.createRadialGradient(32,32,0,32,32,32);
    cg.addColorStop(0,'rgba(255,255,255,1)');cg.addColorStop(.45,'rgba(255,255,255,.9)');cg.addColorStop(1,'rgba(255,255,255,0)');cc.fillStyle=cg;cc.fillRect(0,0,64,64);
    var cloudTex=new THREE.CanvasTexture(cloudCanvas);
    for(var ci=0;ci<28;ci++){
      var bank=new THREE.Sprite(new THREE.SpriteMaterial({map:cloudTex,color:0x8a8c90,transparent:true,opacity:.9,depthWrite:false}));
      bank.scale.set(76+(ci%3)*12,25+(ci%4)*4,1);cloudBanks.push(bank);scene.add(bank);
    }
    // POST: bloom at canvas size (window-sized dssMakeComposer would be
    // wrong for an in-page canvas), skipped on narrow screens for the frame
    // rate. Threshold high so only the prints, flags and lit snow bloom.
    if(typeof THREE.EffectComposer==='function' && typeof THREE.UnrealBloomPass==='function' && window.innerWidth>=600){
      try{
        composer=new THREE.EffectComposer(renderer);composer.addPass(new THREE.RenderPass(scene,camera));
        bloomPass=new THREE.UnrealBloomPass(new THREE.Vector2(canvas.width||720,canvas.height||540),.26,.5,.95);composer.addPass(bloomPass);
      }catch(e){composer=null;bloomPass=null;}
    }
    // FILM GRADE: the shared vignette + grain overlays, on the frame so the
    // cover and banner stay above them.
    if(window.dssFilmGrade){var frame=canvas.parentElement,before=frame.children.length;window.dssFilmGrade(frame);for(var gi=before;gi<frame.children.length;gi++)gradeEls.push(frame.children[gi]);cover.style.zIndex='6';banner.style.zIndex='5';}
    y=height(s);beginButton.disabled=false;resize();resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas.parentElement);
    listen(window,'resize',resize);
    if(window.DSS_DEV)window._hcDev={canvas:canvas,scene:scene,renderer:renderer,camera:camera,snapshot:function(){return {s:s,u:u,y:y,ground:height(s),vy:vy,grounded:grounded,breath:breath,prints:prints,slips:slips,checkpoint:checkpoint,yetiS:yetiS,ending:ending,paused:paused,finished:finished,coyote:coyoteT,buffer:bufferT,activePrints:printList.filter(function(p){return p.mesh.visible;}).length,drawCalls:renderer.info.render.calls,climbing:climbing,corniceBroken:corniceBroken,avalanche:avalanche.phase,avalancheFront:avalanche.front,gust:gust.phase,gustDir:gust.dir,dawn:dawn,bloom:!!composer,wind:wind.strength,whirl:whirl.active,width:width(s),plateau:!!plateau(s)};},
      // Testing only: put the climber at any point on the route, or force a gust.
      warp:function(at){if(!started||ending>=0)return;s=Math.max(0,Math.min(LENGTH-1,at));u=0;y=height(s);vy=0;grounded=true;yetiS=Math.min(LENGTH,s+13);nextPrint=Math.max(nextPrint,s+3);cameraReady=false;},
      gust:function(dir){gust.phase='warning';gust.t=0;gust.dir=dir||1;},
      shove:function(du){u+=du;},
      yeti:yeti, climber:climber, // 2026-10-18: for close-up checks of the yeti and the mountaineer (dev only)
      calm:function(on){windLock=!!on;if(on){wind.target=0;wind.strength=0;gust.phase='idle';gust.next=99;}else{wind.timer=0;gust.next=4;}},
      avalanche:function(){var ci=0;for(var i=0;i<COULOIRS.length;i++)if(s<COULOIRS[i][1])ci=i,i=99;avalanche.phase='warning';avalanche.index=ci;avalanche.t=0;avalanche.front=Math.max(s+22,COULOIRS[ci][1]+8);avalanche.cued=false;if(avalanche.done.indexOf(ci)<0)avalanche.done.push(ci);announce('THE SLOPE IS GOING · BE READY TO JUMP');}};
    loop(performance.now());
  }
  function makePrint(at){
    if(gap(at))return;
    var material=new THREE.MeshBasicMaterial({color:0x57c7ff,transparent:true,opacity:.95,depthWrite:false});
    var g=new THREE.Group(),geo=new THREE.CircleGeometry(1,10);
    [-1,1].forEach(function(side){var foot=new THREE.Mesh(geo,material);foot.rotation.x=-Math.PI/2;foot.scale.set(.16,.32,1);foot.position.set(side*.19,0,side*.18);g.add(foot);});
    // 2026-10-14 (overnight report, Sam: fix): the prints wander across the path, so following them takes steering
    // (on the centre line they collected themselves); on the narrow bridge they keep near the middle
    var lim=Math.max(.2,width(at)/2-.9),pu=Math.max(-lim,Math.min(lim,1.6*Math.sin(at*.55)+.5*Math.sin(at*1.7)));
    g.position.copy(position(at,pu,height(at)+.045));g.rotation.y=-Math.atan(tangent(at));scene.add(g);
    printList.push({s:at,u:pu,born:time,mesh:g,material:material,geometry:geo,id:Math.round(at*100)});
  }
  // A fall is a whirlwind, not a teleport (Sam: "swept back onto the course
  // in a whirlwind like you did in the old version"). The climber is lifted,
  // spun and carried back to the last flags; the slip is counted at once and
  // the hazards reset when he is set down. Input is dead while airborne.
  function respawn(){if(whirl.active)return;slips++;whirl.active=true;whirl.t=0;whirl.fs=s;whirl.fu=u;whirl.fy=Math.max(y,height(s)-2);whirl.ts=Math.min(checkpoint,s);while(whirl.ts>2 && (!support(whirl.ts,0)||LADDERS.some(function(l){return whirl.ts>=l.a && whirl.ts<=l.b;})))whirl.ts-=.25;whirl.ty=height(whirl.ts);whirl.dur=Math.min(2.8,1.3+Math.abs(s-whirl.ts)*.022);clearInput();vy=0;grounded=false;if(whirlMesh)whirlMesh.visible=true;announce('SWEPT BACK · THE WIND KEEPS YOU');}
  function setDown(){whirl.active=false;if(whirlMesh)whirlMesh.visible=false;corniceTimer=-1;corniceWarned=false;corniceBroken=false;if(corniceMesh){corniceMesh.visible=true;corniceMesh.position.y=height(227.5)-.08;}
    if(avalanche.index>=0){var di=avalanche.done.indexOf(avalanche.index);if(di>=0)avalanche.done.splice(di,1);}avalanche.phase='idle';avalanche.t=0;avalanche.index=-1;if(avalancheMesh)avalancheMesh.visible=false;
    s=whirl.ts;u=0;y=height(s);vy=0;grounded=true;coyoteT=COYOTE;bufferT=0;breath=Math.max(.65,breath);climber.rotation.z=0;
    clearInput();rescueGrace=1.8;rescueShelter=true;wind.strength=0;wind.target=0;wind.timer=2;gust.phase='idle';gust.t=0;gust.next=5;
    yetiS=Math.min(LENGTH,s+13);nextPrint=s+1.35;
    printList.forEach(function(p){scene.remove(p.mesh);p.geometry.dispose();p.material.dispose();});printList=[];
    announce('SAFE AT THE FLAGS · TAKE YOUR TIME');}
  function update(dt){
    if(!started||paused||finished)return;time+=dt;
    if(ending>=0){
      ending+=dt;
      if(ending>1.2 && !turned){turned=true;if(window.dssAudio && window.dssAudio.loreUnravel && !(window.dssAudio.isMuted && window.dssAudio.isMuted()))window.dssAudio.loreUnravel();}
      if(ending>3.8)yetiS=Math.min(LENGTH+8,yetiS+dt*1.5);
      if(ending>8){finished=true;clearInput();hud.textContent='';banner.textContent='';
        var EZ=window.dssEase?window.dssEase.level('climb'):0;/* 2026-10-28 (dssEase): after a lost climb the next asks fewer prints and forgives more slips */
        var won=slips<=3+EZ && prints>=10-2*EZ;var exit=document.getElementById(won?'hc-win':'hc-lose');exit.style.display='block';exit.classList.add('dss-mini-exit');
        if(!won && window.dssEase){window.dssEase.lost('climb');window.dssEase.offer(stage, { onAgain: function(){ var a = document.querySelector('.hc-again tw-link'); if (a) a.click(); }, onMove: function(){ var l = exit.querySelector('tw-link'); if (l) l.click(); } });}
        if(document.fullscreenElement===stage)document.exitFullscreen().catch(function(){});
        exit.scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'nearest'});
      }
      return;
    }
    if(whirl.active){whirl.t+=dt;var we=Math.min(1,whirl.t/whirl.dur),wk=we*we*(3-2*we);
      s=whirl.fs+(whirl.ts-whirl.fs)*wk;u=whirl.fu*(1-wk);y=whirl.fy+(whirl.ty-whirl.fy)*wk+Math.sin(we*Math.PI)*5.5;
      if(we>=1)setDown();
      if(eng)eng.update(true,false,false);
      return;}
    rescueGrace=Math.max(0,rescueGrace-dt);
    var chant=(held('ArrowDown')||held('s'))&&grounded;
    var forward=held('ArrowUp')||held('w'), lateral=(held('ArrowRight')||held('d')?1:0)-(held('ArrowLeft')||held('a')?1:0);
    climbing=LADDERS.some(function(l){return s>=l.a-.1 && s<l.b && Math.abs(u)<1.15 && Math.abs(y-height(s))<.25;});
    if(climbing){bufferT=0;vy=0;grounded=true;u*=Math.max(0,1-dt*8);}
    bufferT=Math.max(0,bufferT-dt);coyoteT=grounded?COYOTE:Math.max(0,coyoteT-dt);
    if(bufferT>0 && coyoteT>0){vy=JUMP;grounded=false;bufferT=0;coyoteT=0;jumpCut=false;if(window.dssAudio&&window.dssAudio.jumpPuff)window.dssAudio.jumpPuff();}
    var oldY=y, oldS=s, oldU=u;
    // Breath changes walking speed only. Airborne range stays fully available.
    var speed=grounded?SPEED*(.66+.34*Math.min(1,breath*4)):SPEED;
    if(climbing)speed=.72;
    var moving=!chant && (forward||lateral);if(moving || !grounded)rescueShelter=false;
    if(!chant){s+=forward?speed*dt:0;if(!climbing)u+=lateral*4.6*dt;}
    // Walking stops at a visible gap lip. Space still makes the crossing;
    // airborne players and side-edge falls retain normal collision/respawn.
    if(grounded && Math.abs(u)<width(s)/2){GAPS.concat(corniceBroken?[CORNICE]:[]).forEach(function(g){if(oldS<=g[0] && s>g[0] && s<g[1])s=g[0]-.025;});}
    if(s>=BRIDGE[0] && s<=BRIDGE[1] && grounded)u=Math.max(-.8,Math.min(.8,u));
    var top=height(s),supported=support(s,u);
    if(grounded && supported && top-oldY>.16){s=oldS;top=height(s);supported=support(s,u);}
    if(grounded && supported){y=top;vy=0;}
    /* 2026-10-23 (Sam: "Walking: I want this to be the sound used in the yeti climb"): a recorded snow step every 3 units walked on the ground (not on the ladders) */
    if(grounded && !climbing && !chant){snowWalk+=Math.abs(s-oldS)+Math.abs(u-oldU)*.6;if(snowWalk>=3){snowWalk=0;if(window.dssAudio&&window.dssAudio.snowStep)window.dssAudio.snowStep();}}
    else{
      grounded=false;vy-=GRAV*dt;y+=vy*dt;
      // Resolve the solid riser BEFORE testing the landing. A jump below its
      // lip stays on the lower side, rather than entering the upper mesh.
      if(supported){STEPS.forEach(function(edge){
        if(oldS<edge && s>=edge && y<height(s)){s=edge-.001;}
      });top=height(s);supported=support(s,u);}
      // Sweep feet against the surface at BOTH ends of this movement. The
      // uphill floor can meet a rising foot near the apex; vertical velocity
      // alone must not reject that landing or let the snow overtake the feet.
      var wasAbove=support(oldS,oldU) ? oldY>=height(oldS)-.002 : oldY>=top-.002;
      if(supported && wasAbove && y<=top){if(window.dssAudio&&window.dssAudio.landThud)window.dssAudio.landThud(Math.min(1.4,Math.abs(vy)/Math.abs(JUMP)));y=top;vy=0;grounded=true;}
    }
    // GUSTS. Idle → warning (1.4s: the flurries lean and the wind rises, no
    // push yet) → blowing (1.2s: a sideways shove of 2.4 you can lean against,
    // lateral speed being 4.6; standing still costs about three units, a fall
    // only if you were already near that edge) → idle. Never on a ladder, the bridge
    // (its rails already clamp), during the avalanche or the ending, and not
    // before the first flag so the opening teaches the controls first.
    var exempt=climbing || rescueGrace>0 || rescueShelter || (s>=BRIDGE[0]&&s<=BRIDGE[1]) || avalanche.phase!=='idle';
    // THE WIND. A crosswind that picks a new target strength and side every
    // few seconds and eases toward it; it grows with height and is multiplied
    // on the plateaus. Gusts (warned by the flurries and the wind bed for
    // 1.4s) come every 4 to 9s on top of it. Together they are what you fight:
    // hold forward alone and you drift off. Chanting plants you and the wind
    // cannot move you, which is what chanting costs you in breath-time.
    wind.timer-=dt;if(wind.timer<=0){wind.timer=2.4+Math.random()*3.6;wind.target=windLock?0:(Math.random()<.2?0:(.6+Math.random()))*(Math.random()<.5?-1:1);}
    wind.strength+=(wind.target-wind.strength)*Math.min(1,dt*1.1);
    var pl=plateau(s),windMul=(s<FLAGS[0]?.45:1)*(1+dawn*.35)*(pl?pl[3]:1);
    if(gust.phase==='idle'){gust.next-=dt;if(gust.next<=0 && !exempt && s>=FLAGS[0]){gust.phase='warning';gust.t=0;gust.dir=Math.random()<.5?-1:1;if(window.dssAudio&&window.dssAudio.gust&&window.dssAudio._tick)window.dssAudio._tick(function(){window.dssAudio.gust(false);}); /* 2026-10-18 night: the wind rises with the warning */if(reducedMotion)announce('GUST FROM THE '+(gust.dir<0?'RIGHT':'LEFT'));}}
    else{gust.t+=dt;
      if(gust.phase==='warning' && gust.t>1.4){gust.phase='blowing';gust.t=0;}
      else if(gust.phase==='blowing' && gust.t>1.5){gust.phase='idle';gust.t=0;gust.next=4+Math.random()*5;}
      if(exempt && gust.phase!=='idle'){gust.phase='idle';gust.next=4+Math.random()*4;}
    }
    var push=(wind.strength+(gust.phase==='blowing'?gust.dir*2:0))*windMul;
    // Always leave steering authority, even on exposed plateaus. Air is steadier.
    push=exempt?0:Math.max(-3.5,Math.min(3.5,push));
    if(!chant)u+=push*(grounded?1:.8)*dt;
    dawn=Math.max(0,Math.min(1,(s-30)/(LENGTH-60)));
    if(!corniceWarned && s>=CORNICE[0]-3.5 && s<CORNICE[1]){corniceWarned=true;announce('CORNICE · HOLD JUMP + ↑');}
    if(corniceTimer<0 && grounded && s>=CORNICE[0] && s<CORNICE[1])corniceTimer=0;
    if(corniceTimer>=0 && !corniceBroken){corniceTimer+=dt;if(corniceTimer>.3){corniceBroken=true;if(corniceMesh)corniceMesh.visible=false;
      // The shelf goes from under anyone still standing on it: a runner cannot step across the hole before it opens.
      if(grounded && s>CORNICE[0] && s<CORNICE[1]){grounded=false;vy=-3;y=height(s)-1.7;}}}
    // AVALANCHES (Sam: more of them, much more warning). The warning starts
    // 30 units before the couloir and lasts 4s: the front appears eight units above
    // the couloir, visibly creeping but staying ahead during the warning, the camera trembles and the wind bed rises.
    // Then it runs at 18/s and a JUMP cue fires about 0.50s before the front
    // reaches the climber (measured against their closing speed, so walking
    // into it and standing still get the same reaction window).
    // Clearing it is a timed jump; being under it is a sweep-back.
    if(avalanche.phase==='idle' && rescueGrace<=0 && !rescueShelter){for(var ci=0;ci<COULOIRS.length;ci++){var C=COULOIRS[ci];if(avalanche.done.indexOf(ci)<0 && s>=C[0]-30 && s<C[1]){avalanche.phase='warning';avalanche.index=ci;avalanche.t=0;avalanche.front=Math.max(s+22,C[1]+8);avalanche.cued=false;avalanche.done.push(ci);announce('THE SLOPE IS GOING · BE READY TO JUMP');break;}}}
    if(avalanche.phase==='warning'){avalanche.t+=dt;avalanche.front=Math.max(s+18,avalanche.front-5*dt);if(avalanche.t>4){avalanche.phase='running';avalanche.t=0;}}
    if(avalanche.phase==='running'){
      var oldFront=avalanche.front;avalanche.front-=18*dt;avalanche.t+=dt;var C2=COULOIRS[avalanche.index];
      if(!avalanche.cued && avalanche.front>s && (avalanche.front-s)/(18+Math.max(0,(s-oldS)/dt))<.50){avalanche.cued=true;announce(hcTouch?'JUMP · HOLD JUMP':'JUMP · HOLD SPACE');}
      if(oldS<=oldFront && s>=avalanche.front && Math.abs(u)<width(s)/2 && y-height(s)<.6){respawn();announce('AVALANCHE · SWEPT BACK');return;}
      else if(avalanche.front<s-6 || avalanche.front<4){avalanche.phase='idle';avalanche.index=-1;}
    }
    if((!support(s,u) && y<height(s)-1.6) || Math.abs(u)>width(s)/2+3){respawn();return;}
    breath=Math.max(0,Math.min(1,breath+(chant?.48:(moving?-(.021+.023*s/LENGTH):.025))*dt));
    if(moving && grounded)running+=dt*11;
    flagObjects.forEach(function(flag){if(grounded && support(s,u) && Math.abs(u)<width(s)/2-.35 && Math.abs(s-flag.s)<.4 && checkpoint<flag.s){checkpoint=flag.s;flag.marker.material.color.setHex(0xd8c38d);breath=Math.max(breath,.65);announce('CHECKPOINT · PRAYER FLAGS');}});
    var desired=Math.min(LENGTH,Math.max(s+11,yetiS));yetiS+=Math.min(desired-yetiS,dt*SPEED*1.4);
    // A bounded trail of nine prints. They fade while the player pauses to chant.
    while(nextPrint<yetiS-1){makePrint(nextPrint);nextPrint+=1.35;}
    printList.forEach(function(p){var age=time-p.born;var available=!collected.has(p.id)&&age<24;p.mesh.visible=available;p.material.opacity=Math.max(0,.95-age/26);
      if(available && Math.abs(s-p.s)<.75 && Math.abs(u-(p.u||0))<.6 && Math.abs(y-height(p.s))<.7){collected.add(p.id);prints++;p.mesh.visible=false;if(eng)eng.tick();}
    });
    while(printList.length>9){var old=printList.shift();scene.remove(old.mesh);old.geometry.dispose();old.material.dispose();}
    if(s>=LENGTH-8 && grounded){ending=0;yetiS=LENGTH;clearInput();banner.textContent='';banner.style.opacity='0';hud.textContent='';}
    else{var wa=Math.min(4,Math.round(Math.abs(push)/.9)),windTxt=gust.phase==='warning'?'GUST COMING':wa===0?'WIND · calm':'WIND '+(push<0?'◀'.repeat(wa):'▶'.repeat(wa));
      var nearGap=GAPS.concat([CORNICE]).find(function(g){return g[0]-s>=-.1 && g[0]-s<6;});
      var hazard=avalanche.phase!=='idle'?(avalanche.cued?(hcTouch?'JUMP · HOLD JUMP':'JUMP · HOLD SPACE'):'AVALANCHE APPROACHING · GET READY'):nearGap?'GAP AHEAD · HOLD JUMP + ↑':STEPS.some(function(edge){return edge>=s && edge-s<2;})?'STEP UP · JUMP':'';
      var label=(hazard?hazard+'   ·   ':'')+'PRINTS '+prints+' / 10   ·   SLIPS '+slips+' / 3   ·   BREATH '+Math.round(breath*100)+'%   ·   '+windTxt+(climbing?'   ·   LADDER · HOLD ↑':chant?'   ·   '+['DATTA','DAYADHVAM','DAMYATA'][Math.floor(time*1.7)%3]:breath<.25?'   ·   Hold ↓ to chant':'');if(label!==lastHUD){hud.textContent=label;lastHUD=label;}}
    if(eng)eng.update(gust.phase!=='idle' || avalanche.phase!=='idle' || Math.abs(push)>1.4,chant,false);
  }
  function draw(dt){
    snowLight.value=reducedMotion?0:time;
    if(avalancheMesh){avalancheMesh.visible=avalanche.phase==='running'||avalanche.phase==='warning';if(avalancheMesh.visible){var block=new THREE.Object3D();for(var n=0;n<28;n++){var at=avalanche.front+(n%4)*.7;block.position.copy(position(at,(Math.floor(n/4)-3)*width(at)/6,height(at)+.28));block.scale.set(width(at)/10,.38,.6);if(!reducedMotion)block.rotation.set(time*2+n,n,time+n);block.updateMatrix();avalancheMesh.setMatrixAt(n,block.matrix);}avalancheMesh.instanceMatrix.needsUpdate=true;}}
    if(corniceMesh && !corniceBroken && corniceTimer>=0 && !reducedMotion)corniceMesh.position.y=height(227.5)-.08+Math.sin(time*35)*.035;
    climber.position.copy(position(s,u,y));climber.rotation.y=-Math.atan(tangent(s));
    if(whirl.active){
      // Spun, limbs flailing, and a helix of snow climbing round him.
      if(!reducedMotion){climber.rotation.y+=dt*15;climber.rotation.z=Math.sin(time*9)*.35;}
      climber.userData.limbs.forEach(function(l,i){l.rotation.x=reducedMotion?0:Math.sin(time*26+i*1.7)*.9;});
      if(whirlMesh){var wb=new THREE.Object3D();for(var wn=0;wn<44;wn++){var wa2=wn*.72+time*8,wr=.7+(wn%6)*.22;wb.position.set(climber.position.x+Math.cos(wa2)*wr,climber.position.y+.2+(wn/44)*3.4,climber.position.z+Math.sin(wa2)*wr);wb.scale.setScalar(.09+(wn%3)*.04);wb.updateMatrix();whirlMesh.setMatrixAt(wn,wb.matrix);}whirlMesh.instanceMatrix.needsUpdate=true;}
    }else{
      climber.rotation.z=Math.max(-.22,Math.min(.22,-(wind.strength*(plateau(s)?plateau(s)[3]:1))*.12)); // leans into a strong wind
      climber.userData.limbs.forEach(function(l,i){l.rotation.x=reducedMotion?0:Math.sin(running+(Math.floor(i/2)+i%2)*Math.PI)*.24;});
    }
    yeti.position.copy(position(yetiS,0,height(yetiS)));yeti.visible=yetiS<LENGTH+7.3;
    yeti.rotation.y=ending>1.2 && ending<3.8?Math.PI:-Math.atan(tangent(yetiS));
    if(yeti.userData.shades)yeti.userData.shades.visible=turned; // 2026-10-18 (Sam): aviators once he turns at the cave
    yeti.userData.limbs.forEach(function(l,i){l.rotation.x=reducedMotion || ending>=0 && ending<3.8?0:Math.sin(time*7+(Math.floor(i/2)+i%2)*Math.PI)*.25;});
    summitCats.forEach(function(cat,index){
      cat.visible=s>=380&&yeti.visible;cat.userData.trail.visible=cat.visible;if(!cat.visible)return;
      var at=yetiS-1.7-index*.22,side=cat.userData.side;
      var hop=0;GAPS.forEach(function(g){if(at>g[0]-.3&&at<g[1]+.3)hop=Math.sin((at-g[0]+.3)/(g[1]-g[0]+.6)*Math.PI)*.38;});
      cat.position.copy(position(at,side*.76,height(at)+hop+(reducedMotion?0:Math.sin(time*16+index)*.006)));cat.rotation.y=-Math.atan(tangent(at));
      var walking=!(ending>=0&&ending<3.8),stride=reducedMotion||!walking?0:time*8+index*.9;
      for(var leg=0;leg<4;leg++){
        var front=leg<2,lr=leg%2?1:-1,swing=reducedMotion||!walking?0:Math.sin(stride+(front?(leg%2)*Math.PI:(1-leg%2)*Math.PI))*.1;
        var pose=cat.userData.pose;pose.position.set(lr*.09,.12,(front?-.16:.17)+swing);pose.scale.set(.036,.12,.04);pose.rotation.set(swing*2,0,0);pose.updateMatrix();cat.userData.legs.setMatrixAt(leg,pose.matrix);
        var lift=reducedMotion||!walking?0:Math.max(0,Math.sin(stride+(front?(leg%2)*Math.PI:(1-leg%2)*Math.PI)))*.045;
        pose.position.set(lr*.09,.025+lift,(front?-.18:.15)+swing);pose.scale.set(.046,.027,.066);pose.rotation.set(0,0,0);pose.updateMatrix();cat.userData.paws.setMatrixAt(leg,pose.matrix);
      }
      cat.userData.legs.instanceMatrix.needsUpdate=true;cat.userData.paws.instanceMatrix.needsUpdate=true;
      cat.userData.tail.rotation.z=reducedMotion?0:Math.sin(time*1.7+index)*.14;cat.userData.tail.rotation.x=reducedMotion?0:Math.sin(time*1.1+index)*.06;
      // Alternating tiny paw marks follow the actual snow path, never bridge a gap.
      for(var print=0;print<32;print++){
        var pawAt=Math.floor((at-.18)/.2)*.2-print*.2,pawAcross=side*.76+(print%2?.075:-.075);
        var tp=cat.userData.trailPose;tp.position.copy(position(pawAt,pawAcross,height(pawAt)+.018));
        tp.rotation.set(-Math.PI/2,0,0);cat.userData.trailYaw.setFromAxisAngle(new THREE.Vector3(0,1,0),-Math.atan(tangent(pawAt)));tp.quaternion.premultiply(cat.userData.trailYaw);
        tp.scale.setScalar(gap(pawAt)?0:1);tp.updateMatrix();cat.userData.trail.setMatrixAt(print,tp.matrix);
      }
      cat.userData.trail.instanceMatrix.needsUpdate=true;

    });
    var baseY=Math.max(y,height(s)-1.5),cam=position(s-7.5,u*.7,baseY+4.1),look=position(s+7,u*.25,height(s+7)+1.45);
    look.y=Math.min(look.y,baseY+3); // Keep the climber in frame below steep ladders.
    // No bob, shake, FOV pulse or automatic orbit; reduced motion locks follow.
    if(!cameraReady||reducedMotion){camera.position.copy(cam);cameraReady=true;}else camera.position.lerp(cam,1-Math.exp(-dt*7));
    if(avalanche.phase==='warning' && !reducedMotion){camera.position.x+=Math.sin(time*41)*.03;camera.position.y+=Math.cos(time*37)*.025;}
    camera.lookAt(look);
    // DAWN: the sky, fog and lights slide from night at the foot to a grey
    // orange storm-lit morning near the cave, keyed to height, not to time.
    if(cBg){var d=Math.pow(dawn,.8);
      cBg.setHex(NIGHT.bg).lerp(cSky.setHex(DAWN.bg),d);scene.background=cBg;scene.fog.color.copy(cBg);
      hemi.color.setHex(NIGHT.sky).lerp(cSky.setHex(DAWN.sky),d);hemi.groundColor.setHex(NIGHT.ground).lerp(cGround.setHex(DAWN.ground),d);hemi.intensity=NIGHT.hemiI+(DAWN.hemiI-NIGHT.hemiI)*d;
      sun.color.setHex(NIGHT.sun).lerp(cSun.setHex(DAWN.sun),d);sun.intensity=NIGHT.sunI+(DAWN.sunI-NIGHT.sunI)*d;sun.position.set(-25+70*d+(reducedMotion?0:Math.sin(time*.09)*5),55-30*d,15+30*d);
      if(snowPoints)snowPoints.material.color.setHex(0xdceeff).lerp(cSun.setHex(0xffb364),d*.85);
    }
    // Weather thickens smoothly in gusts; the near shelf stays out of the veil.
    var weatherTarget=gust.phase==='warning'?.42:gust.phase==='blowing'?1:.12;
    weatherVeil+=(weatherTarget-weatherVeil)*(1-Math.exp(-dt*.85));
    scene.fog.near=32-weatherVeil*5;scene.fog.far=112-weatherVeil*31;
    var morning=Math.pow(dawn,.8);
    if(rimLight){rimLight.color.setHex(0xc8d0dc).lerp(cSun.setHex(0xd88a5a),morning);
      rimLight.intensity=.28+morning*.24-weatherVeil*.06;
      rimLight.position.set(center(s)+22,height(s)+13,-s-36);rimLight.target.position.set(center(s),height(s)+1,-s);}
    // Integrate the wind so cloud motion accelerates into gusts without snapping.
    if(!reducedMotion){var cloudPush=wind.strength*2+(gust.phase==='blowing'?gust.dir*7:gust.phase==='warning'?gust.dir*2.5:0);
      cloudWind+=(cloudPush-cloudWind)*(1-Math.exp(-dt*1.5));
      cloudFlow+=dt*(.65+cloudWind);cloudSpin+=dt*(.23+Math.abs(cloudWind)*.09);
    }
    mistBanks.forEach(function(bank,i){var phase=i*1.73+cloudSpin;
      bank.position.set(center(s)+Math.sin(phase)*25+Math.sin(cloudFlow*.18+i)*8,height(s)+5+i%3*4+(reducedMotion?0:Math.sin(phase*.8)*(1.8+weatherVeil)),-s-24-i*10+Math.cos(phase)*10);
      bank.material.rotation=reducedMotion?0:Math.sin(phase*.7)*(.18+weatherVeil*.12);
      bank.material.color.setHex(0xacc6df).lerp(cGround.setHex(0xffaa62),morning*.9);
      bank.material.opacity=(.045+weatherVeil*.07)*(i===0?.65:1);
    });
    cloudFade.value=height(s)-7;
    if(cloudTint)cloudTint.value.setHex(0x8a8c90).lerp(cGround.setHex(0xcc8b60),morning);
    if(cloudFloor){cloudFloor.position.set(camera.position.x,height(s)-13,camera.position.z);
      cloudFloor.material.color.setHex(0x5e6268).lerp(cGround.setHex(0xb77852),morning);}
    cloudBanks.forEach(function(bank,i){var row=Math.floor(i/7),col=i%7;
      var eddy=cloudSpin+i*1.9,flow=cloudFlow*.18;
      // Overlapping oval eddies keep the deck covered as banks curl past one another.
      var sway=reducedMotion?0:Math.sin(eddy)*(17+weatherVeil*9)+Math.sin(flow+i*.6)*12;
      var curl=reducedMotion?0:Math.cos(eddy)*(13+weatherVeil*7);
      var lift=reducedMotion?0:Math.sin(eddy*.8)*(2.3+weatherVeil*1.2);
      bank.position.set(camera.position.x+(col-3)*30+sway,height(s)-10-row*1.5+Math.sin(i*2.3)*1.2+lift,camera.position.z+22-row*36+curl);
      bank.material.rotation=reducedMotion?0:Math.sin(eddy*.65)*(.23+weatherVeil*.15);
      bank.scale.set((76+(i%3)*12)*(1+(reducedMotion?0:Math.sin(eddy)*(.1+weatherVeil*.05))),25+(i%4)*4,1);
      bank.material.color.setHex(0x8a8c90).lerp(cGround.setHex(i%3===0?0xffbd7a:0xcc8b60),morning);
    });
    var stormTarget=gust.phase==='blowing'?1:gust.phase==='warning'?.3*Math.min(1,gust.t/1.4):0;
    if(!reducedMotion)snowStorm+=(stormTarget-snowStorm)*(1-Math.exp(-dt*3));
    if(snowPoints){snowPoints.material.opacity=.7+snowStorm*.23;snowPoints.material.size=.15+snowStorm*.045;
      snowPoints.geometry.setDrawRange(0,Math.floor(SNOW_N*(.72+snowStorm*.28)));}
    // SNOW: fall, drift with the gust, wrap inside a box centred on the camera.
    if(snowPoints){var cx=camera.position.x,cy=camera.position.y,cz=camera.position.z;
      var pl2=plateau(s),base=wind.strength*(pl2?pl2[3]:1)*(1+dawn*.35)*4;
      var lean=gust.phase==='warning'?gust.dir*(5+12*Math.min(1,gust.t/1.4)):gust.phase==='blowing'?gust.dir*36:0;
      if(!reducedMotion)snowDrift+=(base+lean-snowDrift)*(1-Math.exp(-dt*4));
      var drift=snowDrift+Math.sin(time*.4)*.6;
      if(!reducedMotion){for(var k=0;k<SNOW_N;k++){var i3=k*3;
        // Rolling gust eddies: flakes race sideways, curl upwards, then fall back.
        var eddy=time*(2.2+snowStorm*2)+k*2.399+snowPos[i3+2]*.12;
        snowPos[i3]+=(drift*(.7+(k%11)*.06)+Math.sin(eddy)*snowStorm*7+Math.sin(time*1.3+k)*.35)*dt;
        snowPos[i3+1]+=(-snowVel[k]*(1-snowStorm*.35)+Math.cos(eddy)*snowStorm*5)*dt;
        snowPos[i3+2]+=(Math.sin(eddy*.73)*snowStorm*8+Math.cos(time*.9+k*.7)*.25)*dt;
        if(snowPos[i3+1]<cy-13)snowPos[i3+1]+=26;else if(snowPos[i3+1]>cy+13)snowPos[i3+1]-=26;if(snowPos[i3]<cx-22)snowPos[i3]+=44;else if(snowPos[i3]>cx+22)snowPos[i3]-=44;if(snowPos[i3+2]<cz-22)snowPos[i3+2]+=44;else if(snowPos[i3+2]>cz+22)snowPos[i3+2]-=44;
        // A flake right against the lens is a white blob the size of the frame: push it out.
        var ddx=snowPos[i3]-cx,ddy=snowPos[i3+1]-cy,ddz=snowPos[i3+2]-cz;if(ddx*ddx+ddy*ddy+ddz*ddz<4){snowPos[i3]=cx+(Math.random()-.5)*44;snowPos[i3+1]=cy+13;snowPos[i3+2]=cz-6-Math.random()*16;}}
        snowPoints.geometry.attributes.position.needsUpdate=true;}
      else{snowPoints.position.set(cx,cy,cz);}
    }
    if(composer)composer.render();else renderer.render(scene,camera);
  }
  function loop(now){
    if(disposed)return;if(!canvas.isConnected){cleanup();return;}
    var dt=lastNow===null?0:Math.min(.1,(now-lastNow)/1000);lastNow=now;
    if(!paused && !finished){accumulator+=dt;while(accumulator>=1/120){update(1/120);accumulator-=1/120;}}
    draw(paused?0:dt);
    if(eng && (!started||paused||finished))eng.silence();else if(eng && ending>=0)eng.update(false,false,turned);
    animId=requestAnimationFrame(loop);
  }
  beginButton.disabled=true;boot();
})();
