"""Pass 2 for The Climb: bloom + film grade, snowfall/flurries, telegraphed gusts, night into dawn, dev warp."""
import re
P = "/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee"
src = open(P, encoding="utf-8").read()
a = src.index("\n:: The Climb ")
b = src.index("\n:: ", a + 5)
blk = src[a:b]
orig = blk

def rep(old, new, count=1):
    global blk
    n = blk.count(old)
    assert n == count, (old[:70], n)
    blk = blk.replace(old, new)

# 0. design note in the passage comment: what pass 2 added
rep("""     $himalayaClimbWon → MORALE +8 at The Cave. -->""",
"""     $himalayaClimbWon → MORALE +8 at The Cave.
     3D PASS 1 (2026-09-16, Astra): three.js route, ladders, bridge, cornice,
     avalanche, physics, exits, teardown. PASS 2 (2026-09-16, Claude): bloom +
     film grade (canvas-sized composer, like Nazca), snowfall that rides with
     the camera, GUSTS telegraphed by the flurry angle and the wind ~1.4s before
     they push (counter by leaning into them; ladders, the bridge and the
     ending are exempt), and night turning to dawn with height. Dev only:
     window._hcDev.warp(s) and .gust() for testing. -->""")

# 1. state
rep("""  var climbing=false, corniceTimer=-1, corniceBroken=false, corniceMesh=null;""",
"""  var climbing=false, corniceTimer=-1, corniceBroken=false, corniceMesh=null;
  // PASS 2 state: post stack, snowfall, gusts, dawn.
  var composer=null, bloomPass=null, gradeEls=[], snowPoints=null, snowPos=null, snowVel=null, SNOW_N=900;
  var gust={phase:'idle',t:0,dir:1,next:14}, dawn=0, hemi=null, sun=null;
  var NIGHT={bg:0x1c3048,sky:0xc8e6ff,ground:0x31303b,sun:0xdbeaff,hemiI:.72,sunI:.65}, DAWN={bg:0x8d7f8e,sky:0xffd6b3,ground:0x5a4a4e,sun:0xffb076,hemiI:.92,sunI:1.0};
  var cBg=new THREE.Color(), cSky=new THREE.Color(), cGround=new THREE.Color(), cSun=new THREE.Color();""")

# The THREE.Color calls above run before THREE is loaded: move them lazily. Simpler: create in start().
rep("""  var cBg=new THREE.Color(), cSky=new THREE.Color(), cGround=new THREE.Color(), cSun=new THREE.Color();""",
    """  var cBg=null, cSky=null, cGround=null, cSun=null;""")

# 2. cleanup: composer targets + grade overlays
rep("""    if(renderer){renderer.dispose();renderer.forceContextLoss();}""",
"""    if(bloomPass && bloomPass.dispose){try{bloomPass.dispose();}catch(e){}}
    if(composer){try{composer.renderTarget1.dispose();composer.renderTarget2.dispose();}catch(e){}}
    gradeEls.forEach(function(el){if(el.parentNode)el.parentNode.removeChild(el);});gradeEls=[];
    if(renderer){renderer.dispose();renderer.forceContextLoss();}""")

# 3. loader: bring the post add-ons in after the core (vendored, offline-safe)
rep("""      loader=document.createElement('script');loader.src='vendor/three/three.min.js';loader.onload=start;loader.onerror=loadFailure;document.head.appendChild(loader);
    }else start();""",
"""      loader=document.createElement('script');loader.src='vendor/three/three.min.js';loader.onload=function(){withPost(start);};loader.onerror=loadFailure;document.head.appendChild(loader);
    }else withPost(start);""")
rep("""  function loadFailure(){""",
"""  // Bloom and bokeh add-ons load once from vendor/three/ via the shared
  // loader; if they are missing the plain renderer is used and nothing breaks.
  function withPost(fn){if(window.dssLoadPost){window.dssLoadPost(function(){if(!disposed)fn();});}else fn();}
  function loadFailure(){""")

# 4. resize: keep the composer in step with the canvas
rep("""renderer.setSize(w,h,false);canvas.style.height=h+'px';camera.aspect=w/h;camera.updateProjectionMatrix();}""",
    """renderer.setSize(w,h,false);canvas.style.height=h+'px';camera.aspect=w/h;camera.updateProjectionMatrix();if(composer){composer.setSize(w,h);if(bloomPass)bloomPass.setSize(w,h);}}""")

# 5. lights kept as named objects
rep("""    scene.add(new THREE.HemisphereLight(0xc8e6ff,0x31303b,.72));
    var sun=new THREE.DirectionalLight(0xdbeaff,.65);sun.position.set(-25,55,15);scene.add(sun);""",
"""    hemi=new THREE.HemisphereLight(0xc8e6ff,0x31303b,.72);scene.add(hemi);
    sun=new THREE.DirectionalLight(0xdbeaff,.65);sun.position.set(-25,55,15);scene.add(sun);
    cBg=new THREE.Color();cSky=new THREE.Color();cGround=new THREE.Color();cSun=new THREE.Color();""")

# 6. after the scene is built: snowfall, composer, film grade, dev hooks
rep("""    y=height(s);beginButton.disabled=false;resize();resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas.parentElement);""",
"""    // SNOWFALL: one Points cloud in a box that travels with the camera. Each
    // flake falls, drifts with the wind, and wraps when it leaves the box, so
    // the cloud is bounded whatever the route length. The flurry angle is the
    // gust telegraph: the whole cloud leans before the push arrives.
    {
      snowPos=new Float32Array(SNOW_N*3);snowVel=new Float32Array(SNOW_N);
      for(var si=0;si<SNOW_N;si++){snowPos[si*3]=(Math.random()-.5)*44;snowPos[si*3+1]=(Math.random()-.5)*26;snowPos[si*3+2]=(Math.random()-.5)*44;snowVel[si]=1.6+Math.random()*2.2;}
      var snowGeo=new THREE.BufferGeometry();snowGeo.setAttribute('position',new THREE.BufferAttribute(snowPos,3));
      var snowMat=new THREE.PointsMaterial({color:0xf2f6ff,size:.13,transparent:true,opacity:.72,depthWrite:false,sizeAttenuation:true});
      snowPoints=new THREE.Points(snowGeo,snowMat);snowPoints.frustumCulled=false;scene.add(snowPoints);
    }
    // POST: bloom at canvas size (window-sized dssMakeComposer would be
    // wrong for an in-page canvas), skipped on narrow screens for the frame
    // rate. Threshold high so only the prints, flags and lit snow bloom.
    if(typeof THREE.EffectComposer==='function' && typeof THREE.UnrealBloomPass==='function' && window.innerWidth>=600){
      try{
        composer=new THREE.EffectComposer(renderer);composer.addPass(new THREE.RenderPass(scene,camera));
        bloomPass=new THREE.UnrealBloomPass(new THREE.Vector2(canvas.width||720,canvas.height||540),.34,.5,.82);composer.addPass(bloomPass);
      }catch(e){composer=null;bloomPass=null;}
    }
    // FILM GRADE: the shared vignette + grain overlays, on the frame so the
    // cover and banner stay above them.
    if(window.dssFilmGrade){var frame=canvas.parentElement,before=frame.children.length;window.dssFilmGrade(frame);for(var gi=before;gi<frame.children.length;gi++)gradeEls.push(frame.children[gi]);cover.style.zIndex='6';banner.style.zIndex='5';}
    y=height(s);beginButton.disabled=false;resize();resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas.parentElement);""")

rep("""    if(window.DSS_DEV)window._hcDev={canvas:canvas,snapshot:function(){return {s:s,u:u,y:y,ground:height(s),vy:vy,grounded:grounded,breath:breath,prints:prints,slips:slips,checkpoint:checkpoint,yetiS:yetiS,ending:ending,paused:paused,finished:finished,coyote:coyoteT,buffer:bufferT,activePrints:printList.filter(function(p){return p.mesh.visible;}).length,drawCalls:renderer.info.render.calls,climbing:climbing,corniceBroken:corniceBroken,avalanche:avalanche.phase,avalancheFront:avalanche.front};}};""",
"""    if(window.DSS_DEV)window._hcDev={canvas:canvas,snapshot:function(){return {s:s,u:u,y:y,ground:height(s),vy:vy,grounded:grounded,breath:breath,prints:prints,slips:slips,checkpoint:checkpoint,yetiS:yetiS,ending:ending,paused:paused,finished:finished,coyote:coyoteT,buffer:bufferT,activePrints:printList.filter(function(p){return p.mesh.visible;}).length,drawCalls:renderer.info.render.calls,climbing:climbing,corniceBroken:corniceBroken,avalanche:avalanche.phase,avalancheFront:avalanche.front,gust:gust.phase,gustDir:gust.dir,dawn:dawn,bloom:!!composer};},
      // Testing only: put the climber at any point on the route, or force a gust.
      warp:function(at){if(!started||ending>=0)return;s=Math.max(0,Math.min(LENGTH-1,at));u=0;y=height(s);vy=0;grounded=true;yetiS=Math.min(LENGTH,s+13);nextPrint=Math.max(nextPrint,s+3);cameraReady=false;},
      gust:function(dir){gust.phase='warning';gust.t=0;gust.dir=dir||1;}};""")

# 7. update(): gusts + dawn progress. Insert before the cornice check.
rep("""    if(corniceTimer<0 && s>=CORNICE[0]-5 && s<CORNICE[1]){corniceTimer=0;announce('CORNICE CRACKING · JUMP');}""",
"""    // GUSTS. Idle → warning (1.4s: the flurries lean and the wind rises, no
    // push yet) → blowing (1.7s: a sideways shove you can lean against, 3.2
    // against a lateral speed of 4.6) → idle. Never on a ladder, the bridge
    // (its rails already clamp), during the avalanche or the ending, and not
    // before the first flag so the opening teaches the controls first.
    var exempt=climbing || (s>=BRIDGE[0]&&s<=BRIDGE[1]) || avalanche.phase==='running' || s<FLAGS[0];
    if(gust.phase==='idle'){gust.next-=dt;if(gust.next<=0 && !exempt){gust.phase='warning';gust.t=0;gust.dir=Math.random()<.5?-1:1;if(reducedMotion)announce('GUST FROM THE '+(gust.dir<0?'RIGHT':'LEFT'));}}
    else{gust.t+=dt;
      if(gust.phase==='warning' && gust.t>1.4){gust.phase='blowing';gust.t=0;}
      else if(gust.phase==='blowing'){if(!exempt && !chant)u+=gust.dir*(grounded?3.2:4.2)*dt;if(gust.t>1.7){gust.phase='idle';gust.t=0;gust.next=9+Math.random()*8;}}
      if(exempt && gust.phase==='blowing'){gust.phase='idle';gust.next=6+Math.random()*6;}
    }
    dawn=Math.max(0,Math.min(1,(s-30)/(LENGTH-60)));
    if(corniceTimer<0 && s>=CORNICE[0]-5 && s<CORNICE[1]){corniceTimer=0;announce('CORNICE CRACKING · JUMP');}""")

# wind audio: gustOn during warning+blowing
rep("""    if(eng)eng.update(false,chant,false);
  }""",
"""    if(eng)eng.update(gust.phase!=='idle',chant,false);
  }""")

# 8. draw(): snow, dawn, composer render
rep("""    camera.lookAt(look);renderer.render(scene,camera);
  }""",
"""    camera.lookAt(look);
    // DAWN: the sky, fog and lights slide from night at the foot to a grey
    // rose morning near the cave, keyed to height, not to time.
    if(cBg){var d=dawn*dawn*(3-2*dawn);
      cBg.setHex(NIGHT.bg).lerp(new THREE.Color(DAWN.bg),d);scene.background=cBg;scene.fog.color.copy(cBg);
      hemi.color.setHex(NIGHT.sky).lerp(cSky.setHex(DAWN.sky),d);hemi.groundColor.setHex(NIGHT.ground).lerp(cGround.setHex(DAWN.ground),d);hemi.intensity=NIGHT.hemiI+(DAWN.hemiI-NIGHT.hemiI)*d;
      sun.color.setHex(NIGHT.sun).lerp(cSun.setHex(DAWN.sun),d);sun.intensity=NIGHT.sunI+(DAWN.sunI-NIGHT.sunI)*d;sun.position.set(-25+70*d,55-30*d,15+30*d);
    }
    // SNOW: fall, drift with the gust, wrap inside a box centred on the camera.
    if(snowPoints){var cx=camera.position.x,cy=camera.position.y,cz=camera.position.z;
      var lean=gust.phase==='warning'?gust.dir*(4+8*Math.min(1,gust.t/1.4)):gust.phase==='blowing'?gust.dir*13:0;
      var drift=(gust.phase==='idle'?Math.sin(time*.4)*.9:lean);
      if(!reducedMotion){for(var k=0;k<SNOW_N;k++){var i3=k*3;snowPos[i3]+=drift*dt+Math.sin(time*1.3+k)*.35*dt;snowPos[i3+1]-=snowVel[k]*dt;snowPos[i3+2]+=Math.cos(time*.9+k*.7)*.25*dt;
        if(snowPos[i3+1]<cy-13)snowPos[i3+1]+=26;if(snowPos[i3]<cx-22)snowPos[i3]+=44;else if(snowPos[i3]>cx+22)snowPos[i3]-=44;if(snowPos[i3+2]<cz-22)snowPos[i3+2]+=44;else if(snowPos[i3+2]>cz+22)snowPos[i3+2]-=44;}
        snowPoints.geometry.attributes.position.needsUpdate=true;}
      else{snowPoints.position.set(cx,cy,cz);}
    }
    if(composer)composer.render();else renderer.render(scene,camera);
  }""")

assert blk != orig
src = src[:a] + blk + src[b:]
open(P, "w", encoding="utf-8").write(src)
print("patched The Climb:", len(orig), "->", len(blk), "chars")
