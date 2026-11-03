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
