// One persistent painted surface and one reusable falling drop; no growing mesh list.
window.dssStatueDroppings = function(king) {
  var key='dssCharlesDroppings1',count=window._dssCharlesDroppings||0;
  try{var saved=Number(localStorage.getItem(key));if(Number.isFinite(saved)&&saved>=0)count=Math.max(count,Math.min(1e9,Math.floor(saved)));}catch(e){}
  var canvas=document.createElement('canvas');canvas.width=384;canvas.height=640;var ctx=canvas.getContext('2d');
  var texture=new THREE.CanvasTexture(canvas);texture.minFilter=THREE.LinearFilter;texture.generateMipmaps=false;
  var material=new THREE.MeshStandardMaterial({map:texture,transparent:true,alphaTest:.015,depthWrite:false,roughness:.87,emissive:0x191813,emissiveMap:texture,emissiveIntensity:.22,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  var layer=new THREE.Group();layer.name='charles-cumulative-droppings';king.add(layer);
  var pos=[],uv=[],indices=[],surfaceHits=[],cols=32,rows=52,ray=new THREE.Raycaster(),dir=new THREE.Vector3(0,0,-1),inv=new THREE.Matrix4();
  king.updateWorldMatrix(true,true);inv.copy(king.matrixWorld).invert();dir.transformDirection(king.matrixWorld);
  var stone=king.children.filter(function(o){return o.isMesh;});
  for(var row=0;row<=rows;row++)for(var col=0;col<=cols;col++){
    var u=col/cols,v=row/rows,x=(u-.5)*.21,y=4.025-v*.34;
    var origin=new THREE.Vector3(x,y,1).applyMatrix4(king.matrixWorld);ray.set(origin,dir);var hits=ray.intersectObjects(stone,false),z=.105;
    if(hits.length)z=hits[0].point.clone().applyMatrix4(inv).z+.002;
    surfaceHits.push(hits.length>0);pos.push(x,y,z);uv.push(u,1-v);if(row<rows&&col<cols){var i=row*(cols+1)+col;indices.push(i,i+cols+1,i+1,i+1,i+cols+1,i+cols+2);}
  }
  var geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
  var stain=new THREE.Mesh(geo,material);stain.userData.sqDynamic=true;stain.renderOrder=3;layer.add(stain);
  var drop=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),new THREE.MeshStandardMaterial({color:0xf6f3dc,roughness:.55,emissive:0x15140e}));drop.scale.set(.009,.022,.009);drop.userData.sqDynamic=true;drop.visible=false;king.add(drop);
  function R(n,s){var x=Math.sin(n*37.13+s*71.79)*43758.5453;return x-Math.floor(x);}
  function deposit(n,p){var x=canvas.width*(.30+R(n,1)*.38),y=canvas.height*(.08+R(n,2)*.065),r=14+R(n,3)*13;
    ctx.fillStyle='rgba(247,245,222,.94)';ctx.beginPath();ctx.ellipse(x,y,r,r*.55,R(n,4),0,Math.PI*2);ctx.fill();
    for(var j=0;j<5;j++){var angle=R(n,j+8)*6.28;ctx.beginPath();ctx.ellipse(x+Math.cos(angle)*r*1.15,y+Math.sin(angle)*r*.6,2+R(n,j+20)*3,2,angle,0,6.3);ctx.fill();}
    var length=45+R(n,5)*155,bend=(R(n,6)-.5)*35;
    ctx.strokeStyle='rgba(241,239,215,.91)';ctx.lineWidth=7+R(n,7)*6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+bend*p*.45,y+length*p*.5,x+bend*p,y+length*p);ctx.stroke();
    ctx.fillStyle='#eae7cc';ctx.beginPath();ctx.ellipse(x+bend*p,y+length*p,ctx.lineWidth*.65,ctx.lineWidth*.9,0,0,6.3);ctx.fill();
    ctx.globalCompositeOperation='destination-in';ctx.drawImage(mask,0,0);ctx.globalCompositeOperation='source-over';
  }
  var mask=document.createElement('canvas');mask.width=canvas.width;mask.height=canvas.height;var mx=mask.getContext('2d');mx.fillStyle='#fff';
  for(var mr=0;mr<rows;mr++)for(var mc=0;mc<cols;mc++){var mi=mr*(cols+1)+mc;if(surfaceHits[mi]&&surfaceHits[mi+1]&&surfaceHits[mi+cols+1]&&surfaceHits[mi+cols+2])mx.fillRect(mc*canvas.width/cols,mr*canvas.height/rows,canvas.width/cols+1,canvas.height/rows+1);}
  var settled=document.createElement('canvas');settled.width=canvas.width;settled.height=canvas.height;var old=settled.getContext('2d');
  for(var n=0;n<count;n++)deposit(n,1);
  old.drawImage(canvas,0,0);texture.needsUpdate=true;
  var next=2.4,fallStart=-1,dripStart=-1,active=-1,started=null;
  function save(){window._dssCharlesDroppings=count;try{localStorage.setItem(key,String(count));}catch(e){}}
  layer.userData.count=count;
  function impact(t,still){active=count;count++;layer.userData.count=count;save();dripStart=t;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(settled,0,0);deposit(active,still?1:0);texture.needsUpdate=true;if(still){old.clearRect(0,0,canvas.width,canvas.height);old.drawImage(canvas,0,0);dripStart=-1;}drop.visible=false;fallStart=-1;}
  return {frame:function(t,still){
    var now=performance.now();if(started===null)started=now;t=(now-started)/1000;
    if(fallStart>=0){var f=Math.min(1,(t-fallStart)/.38);drop.visible=true;drop.position.set(-.038,4.12-.135*f*f,.085);if(f>=1)impact(t,false);}
    if(dripStart>=0){var p=Math.min(1,(t-dripStart)/1.7);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(settled,0,0);deposit(active,still?1:p);texture.needsUpdate=true;if(p>=1||still){old.clearRect(0,0,canvas.width,canvas.height);old.drawImage(canvas,0,0);dripStart=-1;}}
    if(t>=next&&fallStart<0&&dripStart<0){next=t+5.2;fallStart=t;if(still)impact(t,true);}
  }};
};
