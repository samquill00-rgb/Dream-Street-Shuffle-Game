window.dssSkeleton = function() {
  if (!window.THREE) return null;
  // 2026-10-30 (Sam): aged, tactile bone rather than smooth cream plastic.
  function surface(kind) {
    var c=document.createElement('canvas');c.width=c.height=256;var cx=c.getContext('2d');
    cx.fillStyle=kind==='wood'?'#69492e':'#dccba9';cx.fillRect(0,0,256,256);
    for(var i=0;i<95;i++){
      var x=(i*73.37)%256,y=(i*47.91)%256;
      var wash=cx.createRadialGradient(x,y,0,x,y,12+i%25);
      wash.addColorStop(0,kind==='wood'?'rgba(28,15,5,0.20)':'rgba(123,97,61,0.19)');wash.addColorStop(1,'rgba(110,85,49,0)');
      cx.fillStyle=wash;cx.fillRect(x-40,y-40,80,80);
    }
    for(var j=0;j<660;j++){
      cx.fillStyle=j%3?'rgba(105,80,48,0.18)':'rgba(255,246,215,0.28)';
      cx.fillRect((j*67.13)%256,(j*39.71)%256,0.6+j%2,kind==='wood'?8+j%29:0.8+j%3);
    }
    cx.strokeStyle=kind==='wood'?'rgba(29,16,8,0.28)':'rgba(124,101,69,0.16)';cx.lineWidth=kind==='wood'?1.1:0.65;
    for(var k=0;k<22;k++){var sx=(k*41.3)%256;cx.beginPath();cx.moveTo(sx,0);for(var yy=16;yy<=256;yy+=16)cx.lineTo(sx+Math.sin(yy*0.025+k)*2.5,yy);cx.stroke();}
    if(kind==='skull'){
      cx.strokeStyle='rgba(98,76,47,0.52)';cx.lineWidth=1.1;
      // Broken interlocking cranial seams, drawn into the bone surface.
      [0,1].forEach(function(axis){cx.beginPath();for(var n=0;n<=32;n++){var u=24+n*6.5,v=116+Math.sin(n*0.4)*12+(n%2?2:-2);var px=axis?v:u,py=axis?u:v;if(n)cx.lineTo(px,py);else cx.moveTo(px,py);}cx.stroke();});
    }
    return new THREE.CanvasTexture(c);
  }
  var boneMap=surface('bone'),skullMap=surface('skull'),woodMap=surface('wood');
  var g=new THREE.Group();g.name='gothic-anatomical-skeleton';
  var bone=new THREE.MeshStandardMaterial({color:0xe0d2b4,map:boneMap,bumpMap:boneMap,bumpScale:.0018,roughness:.88});
  var skullBone=bone.clone();skullBone.map=skullBone.bumpMap=skullMap;
  var dark=new THREE.MeshStandardMaterial({color:0x201b16,roughness:1});
  var iron=new THREE.MeshStandardMaterial({color:0x292b29,metalness:.65,roughness:.62});
  var wood=new THREE.MeshStandardMaterial({color:0x64503e,map:woodMap,bumpMap:woodMap,bumpScale:.003,roughness:.8});
  function add(geo,mat,x,y,z){var m=new THREE.Mesh(geo,mat||bone);m.position.set(x||0,y||0,z||0);m.castShadow=m.receiveShadow=true;g.add(m);return m;}
  function ell(x,y,z,rx,ry,rz,mat){var m=add(new THREE.SphereGeometry(1,20,14),mat,x,y,z);m.scale.set(rx,ry,rz);return m;}
  function curve(points,r,mat){return add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(function(p){return new THREE.Vector3().fromArray(p);})),Math.max(12,points.length*5),r,8,false),mat);}
  // Anatomical long bones: continuous waisted shafts, gently swollen joint ends.
  function shaft(a,b,r){var A=new THREE.Vector3().fromArray(a),B=new THREE.Vector3().fromArray(b),d=B.clone().sub(A),len=d.length();
    var profile=[[0,0],[.92,.025],[1.18,.075],[.91,.15],[.66,.3],[.58,.5],[.66,.73],[.9,.88],[1.16,.95],[.86,.985],[0,1]];
    var m=add(new THREE.LatheGeometry(profile.map(function(p){return new THREE.Vector2(p[0]*r,(p[1]-.5)*len);}),12),bone);
    m.position.copy(A).add(B).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;
  }
  // A narrow, blackened specimen stand with a turned, weathered plinth.
  add(new THREE.LatheGeometry([[0,0],[.19,0],[.22,.014],[.22,.028],[.19,.042],[.16,.049],[0,.049]].map(function(p){return new THREE.Vector2(p[0],p[1]);}),40),wood,0,0,-.12);
  add(new THREE.CylinderGeometry(.009,.013,1.77,12),iron,0,.935,-.125);
  [.13,.87,1.53,1.78].forEach(function(y){add(new THREE.TorusGeometry(.016,.004,6,16),iron,0,y,-.125).rotation.x=Math.PI/2;});
  [-1,1].forEach(function(sd){curve([[0,.19,-.125],[sd*.045,.09,-.125],[sd*.14,.055,-.125]],.007,iron);});
  curve([[0,1.79,-.125],[0,1.83,-.1],[0,1.82,-.055]],.007,iron);
  // Rounded cranium, hollow orbital openings, cheek arches and an open articulated jaw.
  var cranium=ell(0,1.716,-.027,.081,.092,.081,skullBone);cranium.rotation.z=-.045;
  var face=new THREE.Shape();face.moveTo(-.066,.067);face.bezierCurveTo(-.093,.038,-.079,-.018,-.055,-.034);face.lineTo(-.034,-.058);face.quadraticCurveTo(0,-.066,.034,-.058);face.lineTo(.055,-.034);face.bezierCurveTo(.079,-.018,.093,.038,.066,.067);face.quadraticCurveTo(0,.09,-.066,.067);
  [-1,1].forEach(function(sd){var hole=new THREE.Path();hole.absellipse(sd*.033,.018,.023,.026,0,Math.PI*2,true,sd*.12);face.holes.push(hole);});
  var nose=new THREE.Path();nose.moveTo(0,.004);nose.lineTo(-.013,-.029);nose.quadraticCurveTo(0,-.023,.013,-.029);nose.lineTo(0,.004);face.holes.push(nose);
  add(new THREE.ExtrudeGeometry(face,{depth:.009,steps:1,bevelEnabled:true,bevelThickness:.003,bevelSize:.003,bevelSegments:3,curveSegments:16}),skullBone,0,1.665,.052);
  [-1,1].forEach(function(sd){ell(sd*.033,1.683,.052,.022,.025,.008,dark);
    curve([[sd*.069,1.691,.047],[sd*.077,1.664,.05],[sd*.052,1.646,.065],[sd*.025,1.632,.07]],.007,bone);
    curve([[sd*.06,1.659,.018],[sd*.06,1.605,.038],[sd*.034,1.593,.071],[0,1.589,.078]],.008,bone);
    ell(sd*.058,1.655,.019,.009,.012,.01);
  });
  ell(0,1.649,.055,.012,.017,.006,dark);
  // Individual small teeth follow the curved upper and lower dental arches.
  for(var tooth=0;tooth<12;tooth++){var angle=-1.2+tooth*2.4/11,x=Math.sin(angle)*.039,z=.043+Math.cos(angle)*.032;
    ell(x,1.612,z,.0036,.0085,.0047);ell(x,1.601,z-.001,.0033,.006,.0044);
  }
  // A slightly curved spine with vertebral bodies and rear processes.
  for(var v=0;v<23;v++){var y=1.565-v*.0265,z=-.035+Math.sin(v*.22)*.016;
    ell(0,y,z,.018+(v>16?.005:0),.010,.014);
    curve([[-.026,y-.003,z-.007],[0,y,z-.019],[.026,y-.003,z-.007]],.004,bone);
    shaft([0,y,z-.012],[0,y-.006,z-.035],.004);
  }
  // Paired ribs sweep out from the spine and down to the breastbone; lower ribs float free.
  for(var rib=0;rib<12;rib++){var y=1.465-rib*.026,w=.077+Math.sin((rib+1)/13*Math.PI)*.064;
    [-1,1].forEach(function(sd){var frontY=y-.035-rib*.002;
      var pts=[[sd*.014,y,-.039],[sd*w*.72,y+.008,-.048],[sd*w,y-.01,.005],[sd*w*.9,frontY,.078]];
      if(rib<10)pts.push([sd*.025,frontY-.012,.104-rib*.002]);
      curve(pts,rib<3?.005:.006,bone);
    });
  }
  curve([[0,1.463,.09],[0,1.405,.107],[0,1.319,.095],[0,1.269,.078]],.010,bone);
  // Thin scapulae and natural S-shaped collarbones.
  [-1,1].forEach(function(sd){
    var blade=new THREE.Shape();blade.moveTo(0,.07);blade.quadraticCurveTo(.075,.08,.083,.028);blade.lineTo(.028,-.085);blade.quadraticCurveTo(.006,-.06,0,.07);
    var m=add(new THREE.ExtrudeGeometry(blade,{depth:.004,bevelEnabled:true,bevelThickness:.002,bevelSize:.003,bevelSegments:2}),bone,sd*.029,1.409,-.061);m.scale.x=sd;
    curve([[0,1.474,.073],[sd*.053,1.489,.067],[sd*.106,1.478,.038],[sd*.15,1.465,.008]],.007,bone);
  });
  // Open pelvic wings and obturator openings, rather than a solid ring.
  [-1,1].forEach(function(sd){
    var wing=new THREE.Shape();wing.moveTo(.018,.055);wing.bezierCurveTo(.05,.125,.112,.115,.128,.071);wing.quadraticCurveTo(.118,.016,.071,-.014);wing.lineTo(.046,-.062);wing.quadraticCurveTo(.019,-.052,.018,.055);
    var m=add(new THREE.ExtrudeGeometry(wing,{depth:.009,bevelEnabled:true,bevelThickness:.003,bevelSize:.003,bevelSegments:3}),bone,0,.931,-.025);m.scale.x=sd;m.rotation.y=sd*-.23;
    curve([[sd*.071,.931,.015],[sd*.093,.877,.028],[sd*.052,.854,.047],[sd*.014,.884,.053],[sd*.03,.931,.031]],.009,bone);
  });
  ell(0,.967,-.035,.027,.055,.018);
  // Arms have paired radius/ulna; legs have distinct tibia/fibula and patellae.
  [-1,1].forEach(function(sd){
    shaft([sd*.155,1.46,0],[sd*.19,1.169,.013],.014);
    shaft([sd*.184,1.164,.018],[sd*.199,.91,.05],.009);
    shaft([sd*.198,1.166,.008],[sd*.217,.91,.043],.007);
    ell(sd*.203,.901,.047,.017,.011,.014);
    for(var f=0;f<5;f++){var fx=sd*(.181+f*.010),fy=.872+(f===0?.026:0),fz=.05+f*.003;
      shaft([sd*.204,.90,.05],[fx,fy,fz],.0035);
      var length=f===0?.038:.054-Math.abs(f-2)*.006;
      shaft([fx,fy,fz],[fx+sd*.004,fy-length*.56,fz+.01],.003);
      shaft([fx+sd*.004,fy-length*.56,fz+.01],[fx+sd*.003,fy-length,fz+.014],.0025);
    }
    shaft([sd*.083,.927,0],[sd*.10,.511,.012],.018);
    ell(sd*.10,.5,.034,.017,.021,.009);
    shaft([sd*.096,.49,.009],[sd*.097,.117,-.006],.014);
    shaft([sd*.119,.486,-.004],[sd*.118,.12,-.016],.0065);
    ell(sd*.101,.104,.0,.022,.022,.024);
    ell(sd*.101,.081,-.022,.022,.019,.032);
    for(var toe=0;toe<5;toe++){var tx=sd*(.077+toe*.010),tz=.105-toe*.007;
      shaft([sd*.10,.085,.002],[tx,.071,tz-.026],.005);
      shaft([tx,.071,tz-.026],[tx,.065,tz],toe===0?.0045:.0034);
    }
  });
  // Merge static pieces by material: detailed anatomy without hundreds of extra draw calls.
  var batches=new Map();g.updateMatrixWorld(true);
  g.children.forEach(function(m){if(!m.isMesh)return;var geo=m.geometry.clone();geo.applyMatrix4(m.matrix);var list=batches.get(m.material)||[];list.push(geo);batches.set(m.material,list);m.geometry.dispose();});
  g.clear();batches.forEach(function(list,mat){var positions=[],normals=[],uvs=[],indices=[],offset=0;
    list.forEach(function(geo){var p=geo.getAttribute('position'),n=geo.getAttribute('normal'),uv=geo.getAttribute('uv');
      for(var i=0;i<p.count;i++){positions.push(p.getX(i),p.getY(i),p.getZ(i));normals.push(n.getX(i),n.getY(i),n.getZ(i));uvs.push(uv?uv.getX(i):0,uv?uv.getY(i):0);}
      if(geo.index){for(var j=0;j<geo.index.count;j++)indices.push(offset+geo.index.getX(j));}else{for(var j=0;j<p.count;j++)indices.push(offset+j);}offset+=p.count;geo.dispose();
    });
    var geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geo.setIndex(indices);geo.computeBoundingSphere();add(geo,mat);
  });
  return g;
};
