// Trisha's secret exit: opening colour, chromatic passage, live destination reveal.
(function () {
  var running = false, releasing = null;
  function begin(link) {
    if (running) return;
    running = true;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var veil = document.createElement('div'), canvas = document.createElement('canvas');
    veil.id = 'dss-trisha-secret-exit';
    veil.setAttribute('role', 'img'); veil.setAttribute('aria-label', 'A coloured doorway opens. Violet, turquoise and amber light pass through the dark; Dean Street appears through the exit.');
    veil.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:#030407;pointer-events:auto;';
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    veil.appendChild(canvas); document.body.appendChild(veil);
    var cx = canvas.getContext('2d'), started = performance.now(), raf = 0, done = false, navigated = false, mapStill = null, stillAt = 0;
    function navigate() {
      if (navigated) return; navigated = true; releasing = link;
      // A single-use arrival on Bateman Street, just round the corner from the club.
      window.dssSohoArrival = {c:38,r:14,facing:'left',door:'trishas'};
      try { sessionStorage.setItem('dssMapLast','trishas'); } catch(e) {}
      try { if (link.isConnected) link.click(); } finally { releasing = null; }
    }
    function finish() {
      if (done) return; done = true; cancelAnimationFrame(raf); clearTimeout(safety);disposePassage();
      document.removeEventListener('keydown', skip, true); window.removeEventListener('resize', size);
      try { navigate(); } finally {
        veil.style.transition = 'opacity .65s ease'; veil.style.opacity = '0';
        setTimeout(function () { veil.remove(); running = false; }, 700);
      }
    }
    function skip(e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopImmediatePropagation(); finish(); } }
    function size() { canvas.width = Math.round(innerWidth * Math.min(devicePixelRatio || 1, 1.5)); canvas.height = Math.round(innerHeight * Math.min(devicePixelRatio || 1, 1.5)); mapStill = null; }
    function ease(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
    // One soft, uneven mist stamp, reused by the existing animation loop.
    var mist=document.createElement('canvas');mist.width=256;mist.height=128;
    var mg=mist.getContext('2d');
    if(mg)for(var mi=0;mi<9;mi++){
      var mx=35+mi*23,my=64+Math.sin(mi*2.7)*22;
      var cloud=mg.createRadialGradient(mx,my,0,mx,my,42);
      cloud.addColorStop(0,'rgba(171,193,207,.22)');cloud.addColorStop(.4,'rgba(145,171,190,.11)');cloud.addColorStop(1,'rgba(145,171,190,0)');
      mg.fillStyle=cloud;mg.fillRect(0,0,256,128);
    }
    function rect(x,y,w,h,col) { cx.fillStyle=col; cx.fillRect(x,y,w,h); }
    // Overlapping cards cover the threshold, then tip and fall away in depth.
    var exitCards=[];
    for(var cr=0;cr<7;cr++)for(var cc=0;cc<8;cc++){
      var ci=cr*8+cc,noise=(Math.sin(ci*91.73+4)*43758.54)%1;
      exitCards.push({col:cc,row:cr,id:ci,noise:noise,
        at:.65+Math.abs(cc-3.5)*.15+cr*.13+(noise+1)*.13});
    }
    function fallingCards(t,w,h,dw,dh,x,y){
      var cards=exitCards.map(function(card){return {card:card,p:Math.max(0,Math.min(1,(t-card.at)/2.65))};});
      cards.sort(function(a,b){return b.p-a.p;});
      cards.forEach(function(item){
        var c=item.card,p=item.p;if(p>=1)return;
        var motion=p*p*p*(p*(p*6-15)+10);
        var cw=dw/8*1.08,ch=dh/7*1.08,flight=motion*motion;
        var centreX=x+(c.col+.5)*dw/8,centreY=y+(c.row+.5)*dh/7;
        var rx=motion*(2.15+c.noise*.55),ry=motion*(c.col%2?2.55:-2.55),rz=motion*(c.noise*.55);
        var depth=flight*dw*5.5,focal=dw*1.4;
        function vertex(u,v){
          var px=u*cw,py=v*ch,pz=0;
          var yy=py*Math.cos(rx),zz=py*Math.sin(rx);py=yy;pz=zz;
          var xx=px*Math.cos(ry)+pz*Math.sin(ry);pz=-px*Math.sin(ry)+pz*Math.cos(ry);px=xx;
          xx=px*Math.cos(rz)-py*Math.sin(rz);py=px*Math.sin(rz)+py*Math.cos(rz);px=xx;
          var scale=focal/(focal+depth+pz);
          return [w/2+(centreX-w/2+px+c.noise*dw*flight*.3)*scale,
            h*.48+(centreY-h*.48+py+dh*flight*.8)*scale];
        }
        function face(points,fill,stroke){cx.beginPath();points.forEach(function(pt,i){cx[i?'lineTo':'moveTo'](pt[0],pt[1]);});cx.closePath();if(fill){cx.fillStyle=fill;cx.fill();}if(stroke){cx.strokeStyle=stroke;cx.lineWidth=Math.max(.5,1.1*(1-p));cx.stroke();}}
        cx.globalAlpha=1-ease((p-.78)/.22);
        var light=Math.max(0,Math.cos(rx)*Math.cos(ry));
        var shade=Math.round(13+light*16),palette=c.id%3;
        face([vertex(-.5,-.5),vertex(.5,-.5),vertex(.5,.5),vertex(-.5,.5)],
          'rgb('+(shade+(palette===2?9:0))+','+(shade+(palette===0?10:3))+','+(shade+15)+')','rgba(210,184,130,.7)');
        // Satin stock catches a moving band of coloured light as each card turns.
        var top=vertex(-.5,-.5),bottom=vertex(.5,.5),foil=cx.createLinearGradient(top[0],top[1],bottom[0]+.01,bottom[1]+.01);
        foil.addColorStop(0,'rgba(229,201,142,'+(.04+motion*.13)+')');foil.addColorStop(.42,'rgba(180,211,209,'+(.08+Math.sin(p*Math.PI)*.19)+')');foil.addColorStop(.56,'rgba(7,10,18,.05)');foil.addColorStop(1,'rgba(0,0,0,.34)');
        face([vertex(-.5,-.5),vertex(.5,-.5),vertex(.5,.5),vertex(-.5,.5)],foil,null);
        // Stepped gold foil borders, fans and individually varied celestial seals.
        face([vertex(-.41,-.35),vertex(-.34,-.35),vertex(-.34,-.43),vertex(.34,-.43),vertex(.34,-.35),vertex(.41,-.35),vertex(.41,.35),vertex(.34,.35),vertex(.34,.43),vertex(-.34,.43),vertex(-.34,.35),vertex(-.41,.35)],null,'rgba(207,173,107,.62)');
        function ink(points,close){cx.beginPath();points.forEach(function(pt,i){var v=vertex(pt[0],pt[1]);cx[i?'lineTo':'moveTo'](v[0],v[1]);});if(close)cx.closePath();cx.strokeStyle='rgba(225,197,143,'+(.38+light*.25)+')';cx.lineWidth=Math.max(.45,.8*(1-p));cx.stroke();}
        [-1,1].forEach(function(sx){[-1,1].forEach(function(sy){
          ink([[sx*.29,sy*.31],[sx*.29,sy*.26],[sx*.34,sy*.26]],false);
          ink([[sx*.33,sy*.32],[sx*.35,sy*.34],[sx*.33,sy*.36],[sx*.31,sy*.34]],true);
        });});
        for(var fan=0;fan<7;fan++){
          var theta=Math.PI*(.18+fan*.106);
          ink([[0,-.24],[Math.cos(theta)*.29,-.24-Math.sin(theta)*.13]],false);
          ink([[0,.24],[Math.cos(theta)*.29,.24+Math.sin(theta)*.13]],false);
        }
        var ring=[];for(var seg=0;seg<32;seg++){var a=seg*Math.PI/16;ring.push([Math.cos(a)*.2,Math.sin(a)*.13]);}ink(ring,true);
        if(palette===0){
          var star=[];for(var sp=0;sp<5;sp++){var sa=-Math.PI/2+sp*Math.PI*4/5;star.push([Math.cos(sa)*.16,Math.sin(sa)*.105]);}ink(star,true);
        }else if(palette===1){
          ink([[0,-.105],[.145,.075],[-.145,.075]],true);ink([[0,.105],[.145,-.075],[-.145,-.075]],true);
        }else{
          ink([[0,-.07],[.14,0],[0,.07],[-.14,0]],true);
          var pupil=[];for(var ps=0;ps<20;ps++){var pa=ps*Math.PI/10;pupil.push([Math.cos(pa)*.045,Math.sin(pa)*.045]);}ink(pupil,true);
        }
        ink([[0,-.19],[0,-.15]],false);ink([[0,.15],[0,.19]],false);
      });
      cx.globalAlpha=1;
    }
    // Scene-owned, curved Deco passage. Rendered by the transition's existing frame.
    var passage=null,passageLoader=null,passageClosed=false;
    function disposePassage(){
      passageClosed=true;if(passageLoader){passageLoader.onload=null;passageLoader.remove();}
      if(!passage)return;var geos=new Set(),mats=new Set(),maps=new Set();
      passage.scene.traverse(function(o){if(o.geometry)geos.add(o.geometry);if(o.material){mats.add(o.material);if(o.material.map)maps.add(o.material.map);}});
      geos.forEach(function(g){g.dispose();});mats.forEach(function(m){m.dispose();});maps.forEach(function(m){m.dispose();});passage.renderer.dispose();passage.renderer.forceContextLoss();passage=null;
    }
    function buildPassage(){
      if(passageClosed||!veil.isConnected)return;
      var T=window.THREE;if(!T)return;
      var renderer;
      try{
        renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});renderer.setPixelRatio(1);
        renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.93;
        var scene=new T.Scene();scene.background=new T.Color(0x08090e);scene.fog=new T.FogExp2(0x17212a,.055);
        var camera=new T.PerspectiveCamera(68,1,.04,70);
        var path=new T.CatmullRomCurve3([new T.Vector3(0,0,3),new T.Vector3(0,0,-4),new T.Vector3(1.6,0,-11),new T.Vector3(-.8,0,-20),new T.Vector3(0,0,-31)]);
        function frame(u){var p=path.getPointAt(u),t=path.getTangentAt(u);return {p:p,right:new T.Vector3(-t.z,0,t.x).normalize(),t:t};}
        function texture(w,h,draw){var cv=document.createElement('canvas');cv.width=w;cv.height=h;draw(cv.getContext('2d'),w,h);var tx=new T.CanvasTexture(cv);tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.anisotropy=2;return tx;}
        var plaster=texture(256,512,function(c,w,h){
          c.fillStyle='#57414b';c.fillRect(0,0,w,h);
          for(var i=0;i<1600;i++){var x=(i*73.17)%w,y=(i*113.37)%h;c.fillStyle=i%3?'rgba(19,17,27,.055)':'rgba(218,194,157,.065)';c.fillRect(x,y,2+i%5,1+i%9);}
          c.strokeStyle='rgba(190,151,105,.23)';c.lineWidth=2;
          for(var x=0;x<w;x+=64){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();c.beginPath();c.moveTo(x+5,0);c.lineTo(x+5,h);c.stroke();}
          var g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,'rgba(0,0,0,.3)');g.addColorStop(.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.3)');c.fillStyle=g;c.fillRect(0,0,w,h);
        });
        var tiles=texture(512,512,function(c,w,h){
          c.fillStyle='#171e26';c.fillRect(0,0,w,h);
          for(var row=-1;row<5;row++)for(var col=-1;col<5;col++){
            var x=col*128+(row%2)*64,y=row*128;c.fillStyle=(row+col)%2?'#384044':'#222a33';c.beginPath();c.moveTo(x,y-62);c.lineTo(x+62,y);c.lineTo(x,y+62);c.lineTo(x-62,y);c.closePath();c.fill();
            c.strokeStyle='#88775b';c.lineWidth=1;c.stroke();
            c.strokeStyle='rgba(168,154,119,.35)';for(var ray=0;ray<5;ray++){c.beginPath();c.moveTo(x,y+45);c.lineTo(x-40+ray*20,y-30);c.stroke();}
          }
          for(var n=0;n<900;n++){c.fillStyle=n%2?'rgba(8,14,23,.1)':'rgba(199,193,162,.07)';c.fillRect(n*47%w,n*83%h,3+n%15,1);}
        });
        var wallMat=new T.MeshPhongMaterial({map:plaster,color:0xbeb1ad,specular:0x27232c,shininess:8,side:T.DoubleSide});
        var floorMat=new T.MeshPhongMaterial({map:tiles,color:0xb0b8bd,specular:0x697e87,shininess:72,side:T.DoubleSide});
        var gold=new T.MeshPhongMaterial({color:0xa68a50,specular:0xc4af78,shininess:38});
        var dark=new T.MeshPhongMaterial({color:0x202632,specular:0x4a4f56,shininess:22});
        var ribs=[],cross=[[-2,0],[-2,2.65]];
        for(var j=1;j<=16;j++){var a=Math.PI-j*Math.PI/16;cross.push([Math.cos(a)*2,2.65+Math.sin(a)*1.75]);}cross.push([2,0]);
        function ribbon(isFloor){var v=[],uv=[],idx=[],points=isFloor?[[-2,0],[2,0]]:cross,count=points.length;
          for(var row=0;row<=72;row++){var u=row/72,f=frame(u);for(var col=0;col<count;col++){var p=points[col];v.push(f.p.x+f.right.x*p[0],p[1],f.p.z+f.right.z*p[0]);uv.push(isFloor?col*2:col/3,u*17);if(row<72&&col<count-1){var n=row*count+col;idx.push(n,n+1,n+count+1,n,n+count+1,n+count);}}}
          var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();scene.add(new T.Mesh(g,isFloor?floorMat:wallMat));
        }ribbon(false);ribbon(true);
        function mesh(g,m,x,y,z,parent){var o=new T.Mesh(g,m);o.position.set(x,y,z);(parent||scene).add(o);return o;}
        var columnGeo=new T.CylinderGeometry(.065,.08,2.65,10),footGeo=new T.BoxGeometry(.24,.16,.24);
        var glowTex=new T.CanvasTexture(mist),colours=[0xb475b7,0x67bfc1,0xe2b77b];
        for(var arch=0;arch<11;arch++){
          var f=frame(.035+arch*.087),g=new T.Group();g.position.copy(f.p);g.rotation.y=Math.atan2(-f.t.x,-f.t.z);scene.add(g);
          [-1,1].forEach(function(side){mesh(columnGeo,gold,side*1.93,1.325,0,g);mesh(footGeo,dark,side*1.93,.08,0,g);mesh(footGeo,gold,side*1.93,2.6,0,g);});
          var arc=[];for(var k=0;k<=32;k++){var a=Math.PI-k*Math.PI/32;arc.push(new T.Vector3(Math.cos(a)*1.93,2.65+Math.sin(a)*1.7,0));}
          mesh(new T.TubeGeometry(new T.CatmullRomCurve3(arc),32,.045,6,false),gold,0,0,0,g);
          // Scalloped brass fanlights and a sun at the crown of each vault.
          for(var ray=0;ray<7;ray++){
            var a=.2+ray*(Math.PI-.4)/6,start=new T.Vector3(0,3.56,0),end=new T.Vector3(Math.cos(a)*.47,3.56+Math.sin(a)*.48,0),d=end.clone().sub(start);
            var spoke=mesh(new T.CylinderGeometry(.009,.009,d.length(),5),gold,0,0,0,g);spoke.position.copy(start).add(end).multiplyScalar(.5);spoke.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());
          }
          mesh(new T.SphereGeometry(.07,10,8),gold,0,3.56,0,g);
          // Tarnished oval mirrors and projecting Deco sconces alternate along the walls.
          var side=arch%2?1:-1,mirror=mesh(new T.CircleGeometry(.43,32),new T.MeshPhongMaterial({color:arch%3?0x354b55:0x574459,specular:0x8e9a96,shininess:55}),side*1.985,1.65,-1.2,g);mirror.rotation.y=-side*Math.PI/2;mirror.scale.y=1.45;
          var rim=mesh(new T.TorusGeometry(.45,.014,6,40),gold,side*1.97,1.65,-1.2,g);rim.rotation.y=-side*Math.PI/2;rim.scale.y=1.45;
          mesh(new T.BoxGeometry(.21,.055,.24),gold,side*1.8,2.42,-.5,g);
          var lamp=mesh(new T.SphereGeometry(.065,10,8),new T.MeshBasicMaterial({color:colours[arch%3]}),side*1.78,2.5,-.5,g);
          var halo=new T.Sprite(new T.SpriteMaterial({map:glowTex,color:colours[arch%3],transparent:true,opacity:.26,depthWrite:false,blending:T.AdditiveBlending}));halo.position.copy(lamp.position);halo.scale.set(.85,1.3,1);g.add(halo);
          if(arch%3===0){var light=new T.PointLight(colours[arch%3===0?Math.floor(arch/3)%3:0],1.7,11,1.5);light.position.set(0,2.8,0);g.add(light);ribs.push(light);}
        }
        scene.add(new T.HemisphereLight(0x8a9eac,0x251a24,.65));
        var follow=new T.PointLight(0xc6b496,.75,8,1.6);scene.add(follow);
        var motes=new T.BufferGeometry(),dust=[];for(var n=0;n<100;n++){var f=frame((n*.618)%1);dust.push(f.p.x+Math.sin(n*71.3)*1.7,.3+((n*.371)%1)*3.6,f.p.z);}motes.setAttribute('position',new T.Float32BufferAttribute(dust,3));scene.add(new T.Points(motes,new T.PointsMaterial({color:0xcabca4,size:.022,transparent:true,opacity:.28,depthWrite:false})));
        passage={scene:scene,camera:camera,renderer:renderer,path:path,follow:follow,width:0,height:0};
      }catch(error){if(renderer){renderer.dispose();renderer.forceContextLoss();}passage=null;}
    }
    if(!reduced){if(window.THREE)buildPassage();else{passageLoader=document.createElement('script');passageLoader.src='vendor/three/three.min.js';passageLoader.onload=buildPassage;document.head.appendChild(passageLoader);}}
    function drawPassage(t,w,h){
      if(!passage)return false;var p=passage;
      if(p.width!==w||p.height!==h){p.width=w;p.height=h;p.renderer.setSize(w,h,false);p.camera.aspect=w/h;p.camera.updateProjectionMatrix();}
      var progress=ease((t-.45)/4.1)*.84,here=p.path.getPointAt(progress),ahead=p.path.getPointAt(Math.min(.995,progress+.065));
      p.camera.position.copy(here);p.camera.position.y=1.65;p.camera.lookAt(ahead.x,1.65,ahead.z);p.follow.position.copy(here);p.follow.position.y=2.3;
      p.renderer.render(p.scene,p.camera);cx.drawImage(p.renderer.domElement,0,0,w,h);return true;
    }

    function paint(now) {
      var t = (now-started)/1000, w=canvas.width,h=canvas.height;
      if (reduced) { if(t>.2)navigate(); if(t>.8)finish(); else raf=requestAnimationFrame(paint); return; }
      if(t>3.45)navigate();
      var destination=navigated && document.querySelector('#soho-map-container canvas');
      // The last image is a large, motionless map of the actual arrival corner.
      var reveal=ease((t-3.65)/1), crossing=0;
      cx.globalCompositeOperation='source-over';cx.globalAlpha=1;rect(0,0,w,h,'#030407');
      var opening=ease(t/.9), travel=ease((t-.8)/3.7), arrival=crossing;
      var baseW=Math.min(w*.36,h*.53),baseH=h*.8,openingOut=ease((t-.8)/1.5);
      var dw=baseW*(1+openingOut*4.5),dh=baseH*(1+openingOut*2.2),x=(w-dw)/2,y=(h-dh)/2;
      // A breathing passage: curved silver threads pull towards the exit.
      cx.save();cx.beginPath();cx.moveTo(x,y+dw*.3);cx.bezierCurveTo(x,y-dh*.07,x+dw,y-dh*.07,x+dw,y+dw*.3);cx.lineTo(x+dw,y+dh);cx.lineTo(x,y+dh);cx.closePath();cx.clip();
      if(!drawPassage(t,w,h)){
      var well=cx.createLinearGradient(0,y,0,y+dh);well.addColorStop(0,'#070914');well.addColorStop(.58,'#151e2a');well.addColorStop(1,'#030509');cx.fillStyle=well;cx.fillRect(x,y,dw,dh);
      cx.save();cx.globalCompositeOperation='screen';
      for(var i=0;i<34;i++){
        var angle=i*Math.PI*2/34, phase=t*.38+i*.73;
        var endX=w/2+Math.cos(angle)*dw*.9,endY=h*.48+Math.sin(angle)*dh*.85;
        var bend=Math.sin(phase)*dw*.17;
        cx.strokeStyle='rgba('+(i%3===0?'153,112,193':i%3===1?'106,184,194':'187,179,153')+','+(.025+.045*(.5+.5*Math.sin(phase)))*(1-reveal)+')';
        cx.lineWidth=.7+(i%4)*.4;
        cx.beginPath();cx.moveTo(w/2+Math.cos(angle)*dw*.045,h*.48+Math.sin(angle)*dh*.045);
        cx.bezierCurveTo(w/2+bend+Math.cos(angle)*dw*.2,h*.48+Math.sin(angle)*dh*.12,endX-bend,endY-Math.sin(angle)*dh*.2,endX,endY);cx.stroke();
      }
      cx.restore();
      for(var r=0;r<110;r++){
        var rz=(r/110+travel*.3)%1, ry=h*.52+Math.pow(rz,2)*dh*.55;
        var shimmer=.5+.5*Math.sin(r*4.7+t*2.4),rw=dw*(.015+rz*.38)*shimmer;
        rect(w/2+Math.sin(r*8.1)*dw*rz*.28-rw/2,ry,rw,1+rz*2,'rgba(156,191,207,'+(.04+shimmer*.18)+')');
      }
      }
      // Low ribbons drift across one another; passing blooms colour the vapour.
      // Clear the view as the real street comes into focus.
      if(mg){
        cx.globalCompositeOperation='screen';
        for(var m=0;m<10;m++){
          var depth=m/9, drift=Math.sin(t*(.22+depth*.09)+m*2.4);
          var mw=dw*(.72+depth*.75),mh=dh*(.12+depth*.14);
          var mistX=w/2-mw/2+drift*dw*.24;
          var mistY=y+dh*(.36+depth*.5)+Math.sin(t*.31+m)*dh*.035;
          cx.globalAlpha=(.27+depth*.16)*opening*(1-reveal*.94);
          cx.drawImage(mist,mistX,mistY,mw,mh);
        }
        cx.globalAlpha=1;cx.globalCompositeOperation='source-over';
      }
      fallingCards(t,w,h,baseW,baseH,(w-baseW)/2,(h-baseH)/2);
      cx.restore();
      // Heavy door leaf swings away into darkness, with a coloured edge.
      var leaf=baseW*(1-opening);if(leaf>0)rect((w-baseW)/2,y,leaf,dh,'#100c15');
      cx.strokeStyle='rgba(225,180,233,'+(.6*(1-opening))+')';cx.lineWidth=3;cx.strokeRect(x+leaf,y,1,dh);
      cx.strokeStyle='rgba(142,113,70,'+(1-openingOut)+')';cx.lineWidth=5;cx.beginPath();cx.moveTo(x,y+dh);cx.lineTo(x,y+dw*.3);cx.bezierCurveTo(x,y-dh*.07,x+dw,y-dh*.07,x+dw,y+dw*.3);cx.lineTo(x+dw,y+dh);cx.stroke();
      // Gilded architectural corner keys, rather than repeated tunnel frames.
      if(openingOut<1){
        cx.save();cx.globalAlpha=(1-openingOut)*opening;cx.strokeStyle='rgba(207,174,111,.65)';cx.lineWidth=1;
        [-1,1].forEach(function(sx){[-1,1].forEach(function(sy){
          var cornerX=w/2+sx*dw/2,cornerY=h/2+sy*dh/2;
          cx.beginPath();cx.moveTo(cornerX-sx*dw*.13,cornerY+sy*5);cx.lineTo(cornerX-sx*dw*.045,cornerY+sy*5);cx.lineTo(cornerX-sx*dw*.045,cornerY-sy*12);cx.lineTo(cornerX+sx*5,cornerY-sy*12);cx.lineTo(cornerX+sx*5,cornerY-sy*dh*.09);cx.stroke();
        });});cx.restore();
      }
      // Three deliberate colour events, over a second apart: bloom then lingering afterimage.
      var pulses=[{at:.18,c:'207,63,225'},{at:1.5,c:'33,220,219'},{at:2.85,c:'255,157,57'}];
      pulses.forEach(function(p){var age=t-p.at;if(age<0||age>1.6)return;
        var strength=age<.3?ease(age/.3):Math.exp(-(age-.3)*3.2);
        cx.save();cx.globalCompositeOperation='screen';
        var bloom=cx.createRadialGradient(w/2,h*.48,0,w/2,h*.48,Math.max(w,h)*.8);
        bloom.addColorStop(0,'rgba('+p.c+','+strength*.58+')');bloom.addColorStop(.3,'rgba('+p.c+','+strength*.34+')');bloom.addColorStop(1,'rgba('+p.c+',0)');cx.fillStyle=bloom;cx.fillRect(0,0,w,h);
        cx.shadowColor='rgb('+p.c+')';cx.shadowBlur=32*strength;cx.strokeStyle='rgba('+p.c+','+strength*.9+')';cx.lineWidth=3+strength*7;
        cx.globalAlpha=strength*.24;cx.lineWidth=18;cx.beginPath();cx.ellipse(w/2,h*.48,dw*.66,dh*.65,Math.sin(t)*.05,0,Math.PI*2);cx.stroke();cx.restore();
      });
      // Dust and tiny refracted streaks give the light something to move through.
      cx.save();cx.globalCompositeOperation='screen';
      for(var d=0;d<80;d++){var phase=(d*.618+t*.11)%1,dx=w/2+Math.sin(d*71.3)*dw*(.15+phase*.65),dy=h/2+Math.cos(d*19.7)*dh*phase*.7;cx.strokeStyle='rgba(174,194,220,'+(.06+phase*.18)*(1-reveal)+')';cx.lineWidth=1;cx.beginPath();cx.moveTo(dx,dy);cx.lineTo(dx+(dx-w/2)*.018,dy+(dy-h/2)*.018);cx.stroke();}cx.restore();
      // Take one frame after the map has settled, with no animated crop or zoom.
      if(!mapStill && destination && t>4.4){
        var bounds=destination.getBoundingClientRect();
        var mapPainted=false;
        try { var probe=destination.getContext('2d').getImageData(Math.floor(destination.width/2),Math.floor(destination.height/2),1,1).data; mapPainted=probe[3]>0; } catch(e) {}
        if(bounds.width>0&&bounds.height>0&&mapPainted){
          mapStill=document.createElement('canvas');mapStill.width=w;mapStill.height=h;
          var sc=mapStill.getContext('2d'),sx=w/innerWidth,sy=h/innerHeight;
          if(sc){var ratio=destination.width/destination.height,mw=Math.min(w*.94,h*.86*ratio),mh=mw/ratio;sc.fillStyle='#030407';sc.fillRect(0,0,w,h);sc.drawImage(destination,(w-mw)/2,(h-mh)/2,mw,mh);stillAt=t;}
          else mapStill=null;
        }
      }
      if(mapStill){
        cx.globalAlpha=ease((t-stillAt)/.8);cx.drawImage(mapStill,0,0);cx.globalAlpha=1;
        // One full second of the complete, motionless last image, then the UI fades in.
        if(t>stillAt+1.8){finish();return;}
      }

      raf=requestAnimationFrame(paint);
    }
    var safety=setTimeout(finish,11000);
    veil.addEventListener('click',finish);document.addEventListener('keydown',skip,true);window.addEventListener('resize',size);
    size();if(cx)raf=requestAnimationFrame(paint);else finish();
  }
  setInterval(function(){var host=document.getElementById('dss-secret-exit-entry');if(host&&!host.dataset.started){var link=host.querySelector('tw-link');if(link){host.dataset.started='1';begin(link);}}},100);
})();

