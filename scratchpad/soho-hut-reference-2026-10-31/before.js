  var hut=new THREE.Group();scene.add(hut);
  box(6.5,.32,4.6,0,.08,0,hutBase,hut);
  if(!burnt)box(5.8,2.8,4,0,1.58,0,plaster,hut);
  else {box(5.4,.12,3.7,0,.3,0,black,hut);}
  // Steep roof, a front-facing gable, weathered tile courses and exposed timber.
  function roof(x,z,w,depth,height,parent) {
    var g=new THREE.BufferGeometry(), v=[-w/2,0,-depth/2,w/2,0,-depth/2,0,height,-depth/2,-w/2,0,depth/2,0,height,depth/2,w/2,0,depth/2,-w/2,0,-depth/2,0,height,-depth/2,0,height,depth/2,-w/2,0,-depth/2,0,height,depth/2,-w/2,0,depth/2,w/2,0,-depth/2,w/2,0,depth/2,0,height,depth/2,w/2,0,-depth/2,0,height,depth/2,0,height,-depth/2];
    g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));var ruv=[];for(var ri=0;ri<v.length;ri+=3)ruv.push(v[ri+2]/1.1,Math.sqrt(v[ri]*v[ri]+(height-v[ri+1])*(height-v[ri+1]))/1.1);g.setAttribute('uv',new THREE.Float32BufferAttribute(ruv,2));g.computeVertexNormals(); var r=mesh(g,roofMat,x,3,z,parent); /* uv: along the ridge, and down the slope, so the tile courses run level */ r.material.side=THREE.DoubleSide; return r;
  }
  if(!burnt)roof(0,0,6.5,4.8,2.1,hut);
  else { beam([-2.8,3,-1.9],[-1.7,3.7,-1.9],.07,wood,hut); }
  if(!burnt){
    var gable=new THREE.Shape();gable.moveTo(-1.4,0);gable.lineTo(0,1.9);gable.lineTo(1.4,0);gable.closePath();
    mesh(new THREE.ShapeGeometry(gable),plaster,0,2.9,2.65,hut);
    beam([-1.55,2.9,2.70],[0,5,2.70],.10,wood,hut);beam([0,5,2.70],[1.55,2.9,2.70],.10,wood,hut);beam([0,3,2.71],[0,4.85,2.71],.08,wood,hut);
    for(var yy=0;yy<10;yy++){
      var ry=3+yy*.205, rx=3.25*(1-yy/10);
      beam([-rx-.035,ry+.04,-2.43],[-rx-.035,ry+.04,2.43],.016,wood,hut);beam([rx+.035,ry+.04,-2.43],[rx+.035,ry+.04,2.43],.016,wood,hut);
      for(var tz=-2.3;tz<2.4;tz+=.38){var off=(yy%2)*.18;beam([rx+.035,ry+.04,tz+off],[rx-.28,ry+.245,tz+off],.009,wood,hut);}

    }
  } else {
    // The missing front gable is remembered by its cracked ribs, never by a wall of flame.
    beam([-1.5,2.8,2.4],[-.25,4.5,2.4],.09,wood,hut);beam([.1,4.7,2.4],[1.5,2.8,2.4],.08,wood,hut);
    for(var ash=0;ash<24;ash++){var br=box(.05+rnd()*.15,.06,.3+rnd()*.7,rnd()*7-3.5,.27,rnd()*4+1,wood);br.rotation.y=rnd()*6;}
  }
  for(var bx=-2.8;bx<=2.81;bx+=1.4){box(.14,2.8,.12,bx,1.62,2.06,wood,hut);box(.14,2.8,.12,bx,1.62,-2.06,wood,hut);}
  [0.35,1.2,2.9].forEach(function(y){if(!burnt)box(5.9,.12,4.14,0,y,0,wood,hut);else {beam([-2.9,y,2.06],[2.9,y,2.06],.055,wood,hut);beam([-2.9,y,-2.06],[2.9,y,-2.06],.055,wood,hut);}});
  [-1,1].forEach(function(side){beam([side*1.55,.42,2.13],[side*2.72,1.15,2.13],.06,wood,hut);});
  if(!burnt)box(1,1.95,.16,0,1.28,2.12,black,hut);box(1.16,.14,.26,0,2.30,2.16,wood,hut);orb(.05,.34,1.2,2.23,brass,hut);
  var glass=new THREE.MeshStandardMaterial({color:burnt?0x121819:0x526b70,roughness:.21,metalness:.55});
  [-1.92,1.92].forEach(function(wx){if(!burnt)box(.9,1.05,.1,wx,2,2.14,glass,hut);for(var k=-2;k<3;k++){beam([wx-.45,1.5+k*.13,2.22],[wx+.45,2.1+k*.13,2.22],.009,wood,hut);beam([wx-.45,2.1+k*.13,2.22],[wx+.45,1.5+k*.13,2.22],.009,wood,hut);}box(1.03,.1,.21,wx,1.44,2.15,wood,hut);});
  if(!burnt){
    for(var dp=-3;dp<=3;dp++)box(.012,1.78,.022,dp*.13,1.24,2.225,wood,hut);
    box(.73,.05,.055,0,1.55,2.27,wood,hut);box(.73,.05,.055,0,.65,2.27,wood,hut);
    beam([-2.82,1.2,2.18],[-1.42,2.85,2.18],.045,wood,hut);beam([1.42,2.85,2.18],[2.82,1.2,2.18],.045,wood,hut);
    for(var sz=-1.6;sz<2;sz+=1.1){box(.14,2.7,.11,2.98,1.57,sz,wood,hut);beam([3.0,.35,sz],[3.0,1.2,sz+.9],.045,wood,hut);}
    beam([-3.32,2.94,-2.45],[-3.32,2.94,2.42],.06,iron,hut);beam([3.32,2.94,-2.45],[3.32,2.94,2.42],.06,iron,hut);beam([3.2,2.94,-1.95],[3.2,.3,-1.95],.06,iron,hut);
  }
