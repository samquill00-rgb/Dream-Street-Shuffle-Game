  var hut=new THREE.Group();hut.name='soho-square-gardeners-hut';scene.add(hut);
  box(6.5,.32,4.6,0,.08,0,hutBase,hut);
  if(!burnt){
    // Reference photograph: two-storey black-and-white pavilion beneath a steep, swept hip roof.
    var hutWhite=plaster.clone();hutWhite.color.setHex(0xe2e1d5);hutWhite.bumpScale=.009;
    var hutBlack=wood.clone();hutBlack.color.setHex(0x292d29);hutBlack.roughness=.88;hutBlack.bumpScale=.009;
    box(5.8,3.3,4,0,1.89,0,hutWhite,hut);
    // Muted green-grey small tiles, staggered joints, moss and worn lower edges.
    var tiles=document.createElement('canvas');tiles.width=tiles.height=512;var tx=tiles.getContext('2d');tx.fillStyle='#626956';tx.fillRect(0,0,512,512);
    for(var row=0;row<28;row++){var y=row*512/28;for(var col=-1;col<14;col++){var x=col*40+(row%2)*20;var n=(row*71+col*37+557)%41;tx.fillStyle='rgb('+(72+n)+','+(80+n)+','+(62+n)+')';tx.fillRect(x,y,39,18);tx.fillStyle='rgba(15,24,17,.55)';tx.fillRect(x,y+15,40,2);tx.fillStyle='rgba(184,184,144,.25)';tx.fillRect(x+1,y+17,37,1);tx.fillStyle='rgba(27,33,23,.3)';tx.fillRect(x,y,1,17);}}
    for(var moss=0;moss<90;moss++){var x=(moss*83.1)%512,y=(moss*47.7)%512;tx.fillStyle=moss%3?'rgba(82,103,37,.25)':'rgba(175,179,136,.22)';tx.beginPath();tx.ellipse(x,y,5+moss%13,2+moss%5,.3,0,6.3);tx.fill();}
    var tileMap=new THREE.CanvasTexture(tiles);tileMap.wrapS=tileMap.wrapT=THREE.RepeatWrapping;tileMap.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
    var hipMat=new THREE.MeshStandardMaterial({map:tileMap,bumpMap:tileMap,bumpScale:.012,roughness:.93,side:THREE.DoubleSide});
    // Four swept roof slopes: steep upper pitch, flared overhanging eaves.
    var pos=[],uv=[],idx=[],roofN=32,roofRows=24;
    var corners=[[-3.48,-2.72],[3.48,-2.72],[3.48,2.72],[-3.48,2.72]];
    corners.forEach(function(c,face){var next=corners[(face+1)%4],base=pos.length/3;
      for(var r=0;r<=roofRows;r++){var v=r/roofRows,spread=Math.pow(v,.88),y=6.85-3.21*Math.pow(v,.73);
        for(var j=0;j<=roofN;j++){var u=j/roofN;pos.push((c[0]*(1-u)+next[0]*u)*spread,y,(c[1]*(1-u)+next[1]*u)*spread);uv.push(u*1.5,v*1.5);if(r<roofRows&&j<roofN){var i=base+r*(roofN+1)+j;idx.push(i,i+roofN+1,i+1,i+1,i+roofN+1,i+roofN+2);}}
      }
    });
    var hipGeo=new THREE.BufferGeometry();hipGeo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));hipGeo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));hipGeo.setIndex(idx);hipGeo.computeVertexNormals();mesh(hipGeo,hipMat,0,0,0,hut);
    // Slim hip ridges, fascia boards and a restrained finial at the peak.
    corners.forEach(function(c,i){var pts=[];for(var n=0;n<=20;n++){var v=n/20,spread=Math.pow(v,.88);pts.push(new THREE.Vector3(c[0]*spread,6.87-3.21*Math.pow(v,.73),c[1]*spread));}mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),40,.035,6,false),hipMat,0,0,0,hut);
      var q=corners[(i+1)%4];beam([c[0],3.63,c[1]],[q[0],3.63,q[1]],.045,hutBlack,hut);
    });
    mesh(new THREE.ConeGeometry(.07,.19,12),hutBlack,0,6.95,0,hut);orb(.048,0,7.07,0,hutBlack,hut);
    // Projecting front gable: its own tiled roof, white infill and branching timberwork.
    var gable=new THREE.Shape();gable.moveTo(-1.35,0);gable.lineTo(0,1.28);gable.lineTo(1.35,0);gable.closePath();mesh(new THREE.ShapeGeometry(gable),hutWhite,0,3.48,2.79,hut);
    var gpos=[-1.48,3.49,2.87,0,4.91,2.87,0,4.91,1.03,-1.48,3.49,2.87,0,4.91,1.03,-1.48,3.49,1.03,1.48,3.49,2.87,1.48,3.49,1.03,0,4.91,1.03,1.48,3.49,2.87,0,4.91,1.03,0,4.91,2.87];
    var gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute(gpos,3));var guv=[];for(var k=0;k<gpos.length;k+=3)guv.push(gpos[k+2]*.65,(4.91-gpos[k+1])*.8);gg.setAttribute('uv',new THREE.Float32BufferAttribute(guv,2));gg.computeVertexNormals();mesh(gg,hipMat,0,0,0,hut);
    beam([-1.48,3.48,2.90],[0,4.91,2.90],.085,hutBlack,hut);beam([0,4.91,2.90],[1.48,3.48,2.90],.085,hutBlack,hut);
    box(.12,1.25,.12,0,4.10,2.87,hutBlack,hut);beam([0,3.68,2.88],[-.67,4.24,2.88],.055,hutBlack,hut);beam([0,3.68,2.88],[.67,4.24,2.88],.055,hutBlack,hut);
    box(2.74,.13,.18,0,3.5,2.87,hutBlack,hut);
    // Strong corner posts, closely spaced upper studs and deep horizontal floor bands.
    [-2.84,-1.42,0,1.42,2.84].forEach(function(x){[-2.06,2.06].forEach(function(z){box(.145,3.34,.15,x,1.91,z,hutBlack,hut);});});
    [.39,2.26,2.51,3.48].forEach(function(y){box(5.94,.13,4.15,0,y,0,hutBlack,hut);});
    for(var x=-2.65;x<2.8;x+=.46){box(.065,.91,.10,x,2.98,2.095,hutBlack,hut);box(.065,.91,.10,x,2.98,-2.095,hutBlack,hut);}
    [-1,1].forEach(function(sd){for(var z=-1.8;z<=1.8;z+=.45)box(.10,.91,.065,sd*2.955,2.98,z,hutBlack,hut);});
    // White panels between short black posts form the projecting balustrade-like storey band.
    for(var x=-2.82;x<2.85;x+=.38){box(.27,.31,.10,x,2.47,2.23,hutWhite,hut);box(.055,.36,.13,x+.16,2.48,2.24,hutBlack,hut);}
    [-1,1].forEach(function(sd){for(var z=-1.9;z<2.1;z+=.38){box(.10,.31,.27,sd*3.08,2.47,z,hutWhite,hut);box(.13,.36,.055,sd*3.09,2.48,z+.16,hutBlack,hut);}});
    // Lower white recessed panels with characteristic Tudor arch braces.
    function arch(cx,z,side){var pts=[];for(var i=0;i<=16;i++){var a=Math.PI-i*Math.PI/16;pts.push(new THREE.Vector3(cx+Math.cos(a)*.54,1.57+Math.sin(a)*.56,z));}var m=mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),32,.033,6,false),hutBlack,0,0,0,hut);if(side){m.rotation.y=side*Math.PI/2;}}
    [-2.12,2.12].forEach(function(x){box(1.04,1.59,.07,x,1.30,2.10,hutWhite,hut);arch(x,2.16,0);box(.045,1.45,.075,x,1.28,2.15,hutBlack,hut);box(1.04,.045,.075,x,1.56,2.15,hutBlack,hut);});
    [-1,1].forEach(function(sd){[-1.35,0,1.35].forEach(function(z){box(.08,1.7,.09,sd*2.98,1.31,z,hutBlack,hut);});
      for(var z=-1.32;z<1.4;z+=1.32){var pts=[];for(var i=0;i<=16;i++){var a=Math.PI-i*Math.PI/16;pts.push(new THREE.Vector3(sd*2.99,1.58+Math.sin(a)*.53,z+Math.cos(a)*.57));}mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),32,.029,6,false),hutBlack,0,0,0,hut);}
    });
    box(2.65,.91,.78,0,3.04,2.39,hutWhite,hut);
    // Small dark leaded panes under the gable, above the solid timber double doors.
    var hutGlass=new THREE.MeshStandardMaterial({color:0x59625a,roughness:.38,metalness:.22});
    for(var win=0;win<5;win++){var x=-.94+win*.47;box(.38,.61,.035,x,3.13,2.83,hutGlass,hut);box(.045,.67,.065,x+.215,3.14,2.88,hutBlack,hut);beam([x-.15,3.12,2.865],[x+.15,3.42,2.865],.007,hutBlack,hut);beam([x-.15,3.42,2.865],[x+.15,3.12,2.865],.007,hutBlack,hut);}
    box(2.23,1.84,.12,0,1.29,2.13,hutBlack,hut);box(2.40,.17,.24,0,2.23,2.18,hutBlack,hut);
    for(var plank=-7;plank<=7;plank++)box(.012,1.75,.018,plank*.145,1.29,2.201,black,hut);
    box(.07,1.8,.04,0,1.29,2.23,hutBlack,hut);[.69,1.78].forEach(function(y){box(2.15,.085,.04,0,y,2.22,hutBlack,hut);});orb(.035,.18,1.25,2.25,brass,hut);
    // Corner downpipes follow the building rather than floating beyond the eaves.
    [-1,1].forEach(function(sd){beam([sd*2.99,3.50,-2.09],[sd*2.99,.28,-2.09],.035,iron,hut);});
  }else{
    // Preserve the existing fire aftermath and its lower remains.
    box(5.4,.12,3.7,0,.3,0,black,hut);beam([-2.8,3,-1.9],[-1.7,3.7,-1.9],.07,wood,hut);
    beam([-1.5,2.8,2.4],[-.25,4.5,2.4],.09,wood,hut);beam([.1,4.7,2.4],[1.5,2.8,2.4],.08,wood,hut);
    for(var ash=0;ash<24;ash++){var br=box(.05+rnd()*.15,.06,.3+rnd()*.7,rnd()*7-3.5,.27,rnd()*4+1,wood);br.rotation.y=rnd()*6;}
    for(var bx=-2.8;bx<=2.81;bx+=1.4){box(.14,2.8,.12,bx,1.62,2.06,wood,hut);box(.14,2.8,.12,bx,1.62,-2.06,wood,hut);}
    [.35,1.2,2.9].forEach(function(y){beam([-2.9,y,2.06],[2.9,y,2.06],.055,wood,hut);beam([-2.9,y,-2.06],[2.9,y,-2.06],.055,wood,hut);});
    [-1,1].forEach(function(sd){beam([sd*1.55,.42,2.13],[sd*2.72,1.15,2.13],.06,wood,hut);});
    box(1.16,.14,.26,0,2.30,2.16,wood,hut);orb(.05,.34,1.2,2.23,brass,hut);
    [-1.92,1.92].forEach(function(wx){for(var k=-2;k<3;k++){beam([wx-.45,1.5+k*.13,2.22],[wx+.45,2.1+k*.13,2.22],.009,wood,hut);beam([wx-.45,2.1+k*.13,2.22],[wx+.45,1.5+k*.13,2.22],.009,wood,hut);}box(1.03,.1,.21,wx,1.44,2.15,wood,hut);});
  }
    hut.updateMatrixWorld(true);var localFromWorld=new THREE.Matrix4().copy(hut.matrixWorld).invert(),batches=new Map();
    hut.traverse(function(m){if(!m.isMesh)return;var geo=m.geometry.clone();geo.applyMatrix4(new THREE.Matrix4().multiplyMatrices(localFromWorld,m.matrixWorld));var list=batches.get(m.material)||[];list.push(geo);batches.set(m.material,list);m.geometry.dispose();});
    hut.clear();batches.forEach(function(list,material){var pos=[],nor=[],uv=[],indices=[],offset=0;
      list.forEach(function(geo){var p=geo.getAttribute('position'),n=geo.getAttribute('normal'),u=geo.getAttribute('uv');for(var i=0;i<p.count;i++){pos.push(p.getX(i),p.getY(i),p.getZ(i));nor.push(n.getX(i),n.getY(i),n.getZ(i));uv.push(u?u.getX(i):0,u?u.getY(i):0);}if(geo.index){for(var j=0;j<geo.index.count;j++)indices.push(offset+geo.index.getX(j));}else{for(var j=0;j<p.count;j++)indices.push(offset+j);}offset+=p.count;geo.dispose();});
      var geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeBoundingSphere();mesh(geo,material,0,0,0,hut);
    });
