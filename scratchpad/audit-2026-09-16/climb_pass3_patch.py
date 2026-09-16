"""Pass 3 for The Climb: wind as the main fight, whirlwind sweep-back, four avalanches with real warning, wide windy plateaus."""
P = "/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee"
src = open(P, encoding="utf-8").read()
a = src.index("\n:: The Climb "); b = src.index("\n:: ", a + 5)
blk = src[a:b]; orig = blk
def rep(old, new):
    global blk
    n = blk.count(old); assert n == 1, (old[:70], n); blk = blk.replace(old, new)

# 0. design note
rep("""     window._hcDev.warp(s) and .gust() for testing. -->""",
"""     window._hcDev.warp(s) and .gust() for testing.
     PASS 3 (2026-09-16, Sam's notes after playing: "mostly really easy, you
     just hold forward"): the WIND is the fight now, a constant crosswind that
     wanders in strength and direction, grows with height, and gusts on top
     of it every few seconds, so holding forward alone drifts you off;
     chanting plants you (shelter, at the cost of breath time). A FALL is no
     longer a teleport: a whirlwind lifts you, spins you and carries you back
     to the last flags (still one slip). FOUR avalanche couloirs instead of
     one, each with a 4s warning during which the front is visible far up the
     slope and creeping, then a JUMP cue when it is close. PLATEAUS: stretches
     two to three times as wide where the wind is far stronger; harder to
     resist, harder to be blown off. Dev: _hcDev.shove(du). -->""")

# 1. constants + state
rep("""  var LADDERS=[{a:124,b:126,rise:7},{a:286,b:288,rise:9}], BRIDGE=[164,176], CORNICE=[226,229], COULOIR=[352,365];""",
"""  var LADDERS=[{a:124,b:126,rise:7},{a:286,b:288,rise:9}], BRIDGE=[164,176], CORNICE=[226,229];
  // Four couloirs. Each fires once; a sweep-back re-arms the one you were in.
  var COULOIRS=[[84,96],[248,262],[352,365],[396,408]];
  // Plateaus: [from, to, width multiplier, wind multiplier]. Wide open snowfields where the wind has nothing to break it.
  var PLATEAUS=[[52,62,2.6,2.4],[231,240,2.4,2.2],[299,308,2.8,2.6],[368,378,2.4,2.4]];
  function plateau(at){for(var i=0;i<PLATEAUS.length;i++){var p=PLATEAUS[i];if(at>=p[0]&&at<=p[1])return p;}return null;}
  // The wind: a crosswind that wanders, plus gusts on top. Sam: the wind should be what you are mostly fighting.
  var wind={strength:0,target:0,timer:0};
  // The whirlwind that carries a fallen climber back to the flags.
  var whirl={active:false,t:0,dur:1.7,fs:0,fu:0,fy:0,ts:0,ty:0}, whirlMesh=null;""")
rep("""  var avalanche={phase:'idle',t:0,front:372}, avalancheMesh=null;""",
    """  var avalanche={phase:'idle',t:0,front:372,index:-1,done:[],cued:false}, avalancheMesh=null;""")
# width: plateaus, with a short ramp in and out so the ribbon does not step
rep("""  function width(at){if(at> LENGTH-13)return 8;if(at>=BRIDGE[0]&&at<=BRIDGE[1])return 2;return 5.6+.7*Math.sin(at/14);}""",
"""  function width(at){if(at> LENGTH-13)return 8;if(at>=BRIDGE[0]&&at<=BRIDGE[1])return 2;var w=5.6+.7*Math.sin(at/14);
    for(var i=0;i<PLATEAUS.length;i++){var p=PLATEAUS[i];if(at>=p[0]-3&&at<=p[1]+3){var ramp=Math.min(1,Math.max(0,Math.min(at-(p[0]-3),(p[1]+3)-at)/3));return w*(1+(p[2]-1)*ramp);}}
    return w;}""")

# 2. whirlwind mesh after the avalanche mesh
rep("""    avalancheMesh=new THREE.InstancedMesh(sphere,snow,28);avalancheMesh.visible=false;scene.add(avalancheMesh);""",
"""    avalancheMesh=new THREE.InstancedMesh(sphere,snow,28);avalancheMesh.visible=false;scene.add(avalancheMesh);
    whirlMesh=new THREE.InstancedMesh(sphere,snow,44);whirlMesh.visible=false;scene.add(whirlMesh);""")

# 3. dev hooks
rep("""      gust:function(dir){gust.phase='warning';gust.t=0;gust.dir=dir||1;}};""",
"""      gust:function(dir){gust.phase='warning';gust.t=0;gust.dir=dir||1;},
      shove:function(du){u+=du;},
      avalanche:function(){var ci=0;for(var i=0;i<COULOIRS.length;i++)if(s<COULOIRS[i][1])ci=i,i=99;avalanche.phase='warning';avalanche.index=ci;avalanche.t=0;avalanche.front=COULOIRS[ci][1]+42;avalanche.cued=false;if(avalanche.done.indexOf(ci)<0)avalanche.done.push(ci);}};""")
rep("""avalanche:avalanche.phase,avalancheFront:avalanche.front,gust:gust.phase,gustDir:gust.dir,dawn:dawn,bloom:!!composer};},""",
    """avalanche:avalanche.phase,avalancheFront:avalanche.front,gust:gust.phase,gustDir:gust.dir,dawn:dawn,bloom:!!composer,wind:wind.strength,whirl:whirl.active,width:width(s),plateau:!!plateau(s)};},""")

# 4. respawn -> whirlwind
rep("""  function respawn(){slips++;corniceTimer=-1;corniceBroken=false;if(corniceMesh){corniceMesh.visible=true;corniceMesh.position.y=height(227.5)-.08;}avalanche.phase='idle';avalanche.t=0;if(avalancheMesh)avalancheMesh.visible=false;s=checkpoint;u=0;y=height(s);vy=0;grounded=true;coyoteT=COYOTE;bufferT=0;breath=Math.max(.65,breath);cameraReady=false;announce('SLIP · BACK AT THE FLAGS');}""",
"""  // A fall is a whirlwind, not a teleport (Sam: "swept back onto the course
  // in a whirlwind like you did in the old version"). The climber is lifted,
  // spun and carried back to the last flags; the slip is counted at once and
  // the hazards reset when he is set down. Input is dead while airborne.
  function respawn(){if(whirl.active)return;slips++;whirl.active=true;whirl.t=0;whirl.fs=s;whirl.fu=u;whirl.fy=Math.max(y,height(s)-2);whirl.ts=checkpoint;whirl.ty=height(checkpoint);whirl.dur=Math.min(2.8,1.3+Math.abs(s-checkpoint)*.022);clearInput();vy=0;grounded=false;if(whirlMesh)whirlMesh.visible=true;announce('SWEPT BACK · THE WIND KEEPS YOU');}
  function setDown(){whirl.active=false;if(whirlMesh)whirlMesh.visible=false;corniceTimer=-1;corniceBroken=false;if(corniceMesh){corniceMesh.visible=true;corniceMesh.position.y=height(227.5)-.08;}
    if(avalanche.index>=0){var di=avalanche.done.indexOf(avalanche.index);if(di>=0)avalanche.done.splice(di,1);}avalanche.phase='idle';avalanche.t=0;avalanche.index=-1;if(avalancheMesh)avalancheMesh.visible=false;
    s=whirl.ts;u=0;y=height(s);vy=0;grounded=true;coyoteT=COYOTE;bufferT=0;breath=Math.max(.65,breath);climber.rotation.z=0;}""")

# 5. update(): whirl flight, before the ordinary input handling
rep("""    var chant=(held('ArrowDown')||held('s'))&&grounded;""",
"""    if(whirl.active){whirl.t+=dt;var we=Math.min(1,whirl.t/whirl.dur),wk=we*we*(3-2*we);
      s=whirl.fs+(whirl.ts-whirl.fs)*wk;u=whirl.fu*(1-wk);y=whirl.fy+(whirl.ty-whirl.fy)*wk+Math.sin(we*Math.PI)*5.5;
      if(we>=1)setDown();
      if(eng)eng.update(true,false,false);
      return;}
    var chant=(held('ArrowDown')||held('s'))&&grounded;""")

# 6. wind + gusts replace the old gust block
rep("""    var exempt=climbing || (s>=BRIDGE[0]&&s<=BRIDGE[1]) || avalanche.phase==='running' || s<FLAGS[0];
    if(gust.phase==='idle'){gust.next-=dt;if(gust.next<=0 && !exempt){gust.phase='warning';gust.t=0;gust.dir=Math.random()<.5?-1:1;if(reducedMotion)announce('GUST FROM THE '+(gust.dir<0?'RIGHT':'LEFT'));}}
    else{gust.t+=dt;
      if(gust.phase==='warning' && gust.t>1.4){gust.phase='blowing';gust.t=0;}
      else if(gust.phase==='blowing'){if(!exempt && !chant)u+=gust.dir*(grounded?2.4:3.2)*dt;if(gust.t>1.2){gust.phase='idle';gust.t=0;gust.next=9+Math.random()*8;}}
      if(exempt && gust.phase==='blowing'){gust.phase='idle';gust.next=6+Math.random()*6;}
    }""",
"""    var exempt=climbing || (s>=BRIDGE[0]&&s<=BRIDGE[1]);
    // THE WIND. A crosswind that picks a new target strength and side every
    // few seconds and eases toward it; it grows with height and is multiplied
    // on the plateaus. Gusts (warned by the flurries and the wind bed for
    // 1.4s) come every 4 to 9s on top of it. Together they are what you fight:
    // hold forward alone and you drift off. Chanting plants you and the wind
    // cannot move you, which is what chanting costs you in breath-time.
    wind.timer-=dt;if(wind.timer<=0){wind.timer=2.4+Math.random()*3.6;wind.target=(Math.random()<.2?0:(.7+Math.random()*1.1))*(Math.random()<.5?-1:1);}
    wind.strength+=(wind.target-wind.strength)*Math.min(1,dt*1.1);
    var pl=plateau(s),windMul=(s<FLAGS[0]?.45:1)*(1+dawn*.7)*(pl?pl[3]:1);
    if(gust.phase==='idle'){gust.next-=dt;if(gust.next<=0 && !exempt && s>=FLAGS[0]){gust.phase='warning';gust.t=0;gust.dir=Math.random()<.5?-1:1;if(reducedMotion)announce('GUST FROM THE '+(gust.dir<0?'RIGHT':'LEFT'));}}
    else{gust.t+=dt;
      if(gust.phase==='warning' && gust.t>1.4){gust.phase='blowing';gust.t=0;}
      else if(gust.phase==='blowing' && gust.t>1.5){gust.phase='idle';gust.t=0;gust.next=4+Math.random()*5;}
      if(exempt && gust.phase==='blowing'){gust.phase='idle';gust.next=4+Math.random()*4;}
    }
    var push=(wind.strength+(gust.phase==='blowing'?gust.dir*2.2:0))*windMul;
    if(!exempt && !chant)u+=push*(grounded?1:1.3)*dt;""")

# 7. avalanches: four, long warning, visible front, JUMP cue
rep("""    if(avalanche.phase==='idle' && s>=COULOIR[0]-3 && s<COULOIR[1]){avalanche.phase='warning';avalanche.t=0;announce('THE SLOPE LETS GO · JUMP THE SNOW FRONT');}
    if(avalanche.phase==='warning'){avalanche.t+=dt;if(avalanche.t>1.4){avalanche.phase='running';avalanche.front=COULOIR[1]+7;avalanche.t=0;}}
    if(avalanche.phase==='running'){
      var oldFront=avalanche.front;avalanche.front-=18*dt;avalanche.t+=dt;
      if(oldS<=oldFront && s>=avalanche.front && Math.abs(u)<width(s)/2 && y-height(s)<.6){respawn();announce('AVALANCHE · BACK AT THE FLAGS');}
      else if(avalanche.front<COULOIR[0]-8)avalanche.phase='done';
    }
    if(y<height(s)-4.8 || Math.abs(u)>10)respawn();""",
"""    // AVALANCHES (Sam: more of them, much more warning). The warning starts
    // 30 units before the couloir and lasts 4s: the front appears 42 units up
    // the slope, visibly creeping, the camera trembles and the wind bed rises.
    // Then it runs at 18/s and a JUMP cue fires 16 units out (about 0.6s).
    // Clearing it is a timed jump; being under it is a sweep-back.
    if(avalanche.phase==='idle'){for(var ci=0;ci<COULOIRS.length;ci++){var C=COULOIRS[ci];if(avalanche.done.indexOf(ci)<0 && s>=C[0]-30 && s<C[1]){avalanche.phase='warning';avalanche.index=ci;avalanche.t=0;avalanche.front=C[1]+42;avalanche.cued=false;avalanche.done.push(ci);announce('THE SLOPE IS GOING · BE READY TO JUMP');break;}}}
    if(avalanche.phase==='warning'){avalanche.t+=dt;avalanche.front-=5*dt;if(avalanche.t>4){avalanche.phase='running';avalanche.t=0;}}
    if(avalanche.phase==='running'){
      var oldFront=avalanche.front;avalanche.front-=18*dt;avalanche.t+=dt;var C2=COULOIRS[avalanche.index];
      if(!avalanche.cued && avalanche.front>s && avalanche.front-s<16){avalanche.cued=true;announce('JUMP');}
      if(oldS<=oldFront && s>=avalanche.front && Math.abs(u)<width(s)/2 && y-height(s)<.6){respawn();announce('AVALANCHE · SWEPT BACK');}
      else if(avalanche.front<C2[0]-8){avalanche.phase='idle';avalanche.index=-1;}
    }
    if((!supported && y<height(s)-1.6) || Math.abs(u)>width(s)/2+3)respawn();""")

# 8. HUD: wind indicator
rep("""    else{var label='PRINTS '+prints+' / 10   ·   SLIPS '+slips+' / 3   ·   BREATH '+Math.round(breath*100)+'%'+(climbing?'   ·   LADDER · HOLD ↑':chant?'   ·   '+['OM','AH','HUM','VAJ','RA','GU'][Math.floor(time*1.7)%6]:breath<.25?'   ·   Hold ↓ to chant':'');if(label!==lastHUD){hud.textContent=label;lastHUD=label;}}
    if(eng)eng.update(gust.phase!=='idle',chant,false);""",
"""    else{var wa=Math.min(4,Math.round(Math.abs(push)/.9)),windTxt=gust.phase==='warning'?'GUST COMING':wa===0?'WIND · calm':'WIND '+(push<0?'◀'.repeat(wa):'▶'.repeat(wa));
      var label='PRINTS '+prints+' / 10   ·   SLIPS '+slips+' / 3   ·   BREATH '+Math.round(breath*100)+'%   ·   '+windTxt+(climbing?'   ·   LADDER · HOLD ↑':chant?'   ·   '+['OM','AH','HUM','VAJ','RA','GU'][Math.floor(time*1.7)%6]:breath<.25?'   ·   Hold ↓ to chant':'');if(label!==lastHUD){hud.textContent=label;lastHUD=label;}}
    if(eng)eng.update(gust.phase!=='idle' || avalanche.phase!=='idle' || Math.abs(push)>1.4,chant,false);""")

# 9. draw(): avalanche front visible during warning; whirl spin + particles; camera tremble; snow lean from the wind
rep("""    if(avalancheMesh){avalancheMesh.visible=avalanche.phase==='running';""",
    """    if(avalancheMesh){avalancheMesh.visible=avalanche.phase==='running'||avalanche.phase==='warning';""")
rep("""    climber.userData.limbs.forEach(function(l,i){l.rotation.x=reducedMotion?0:Math.sin(running+(Math.floor(i/2)+i%2)*Math.PI)*.24;});""",
"""    if(whirl.active){
      // Spun, limbs flailing, and a helix of snow climbing round him.
      if(!reducedMotion){climber.rotation.y+=dt*15;climber.rotation.z=Math.sin(time*9)*.35;}
      climber.userData.limbs.forEach(function(l,i){l.rotation.x=reducedMotion?0:Math.sin(time*26+i*1.7)*.9;});
      if(whirlMesh){var wb=new THREE.Object3D();for(var wn=0;wn<44;wn++){var wa2=wn*.72+time*8,wr=.7+(wn%6)*.22;wb.position.set(climber.position.x+Math.cos(wa2)*wr,climber.position.y+.2+(wn/44)*3.4,climber.position.z+Math.sin(wa2)*wr);wb.scale.setScalar(.09+(wn%3)*.04);wb.updateMatrix();whirlMesh.setMatrixAt(wn,wb.matrix);}whirlMesh.instanceMatrix.needsUpdate=true;}
    }else{
      climber.rotation.z=Math.max(-.22,Math.min(.22,-(wind.strength*(plateau(s)?plateau(s)[3]:1))*.12)); // leans into a strong wind
      climber.userData.limbs.forEach(function(l,i){l.rotation.x=reducedMotion?0:Math.sin(running+(Math.floor(i/2)+i%2)*Math.PI)*.24;});
    }""")
rep("""    if(!cameraReady||reducedMotion){camera.position.copy(cam);cameraReady=true;}else camera.position.lerp(cam,1-Math.exp(-dt*7));""",
"""    if(!cameraReady||reducedMotion){camera.position.copy(cam);cameraReady=true;}else camera.position.lerp(cam,1-Math.exp(-dt*7));
    if(avalanche.phase==='warning' && !reducedMotion){camera.position.x+=Math.sin(time*41)*.03;camera.position.y+=Math.cos(time*37)*.025;}""")
rep("""      var lean=gust.phase==='warning'?gust.dir*(4+8*Math.min(1,gust.t/1.4)):gust.phase==='blowing'?gust.dir*13:0;
      var drift=(gust.phase==='idle'?Math.sin(time*.4)*.9:lean);""",
"""      var pl2=plateau(s),base=wind.strength*(pl2?pl2[3]:1)*(1+dawn*.7)*4;
      var lean=gust.phase==='warning'?gust.dir*(4+9*Math.min(1,gust.t/1.4)):gust.phase==='blowing'?gust.dir*14:0;
      var drift=base+lean+Math.sin(time*.4)*.6;""")

assert blk != orig
src = src[:a] + blk + src[b:]
open(P, "w", encoding="utf-8").write(src)
print("patched:", len(orig), "->", len(blk))
