from pathlib import Path
p=Path('Dream Street Shuffle.twee');s=p.read_text();o=Path('scratchpad/visual-pass-last');items=[]
def scope(start,end):
 a=s.index(start);b=s.index(end,a+len(start));return a,b,s[a:b]
a,b,t=scope('// ====== CARTHAGE COAST','// ====== THE GREEN SEA');(o/'carthage-before.js').write_text(t)
def change(old,new,label):
 global t
 assert old in t,label;t=t.replace(old,new,1);items.append(label)
helper='''
  // Thick, chipped pottery walls; deterministic shaping keeps the scatter unchanged.
  function shoreShard(source) {
    var q=source.parameters,n=24,rows=3,v=[],uv=[],ix=[];
    for(var side=0;side<2;side++)for(var y=0;y<=rows;y++)for(var j=0;j<=n;j++){
      var u=j/n,h=y/rows,ang=q.thetaStart+q.thetaLength*u;
      var r=q.radiusBottom+(q.radiusTop-q.radiusBottom)*h-side*0.018;
      var chip=(Math.sin(j*2.17)+Math.sin(j*0.83))*0.009;
      v.push(Math.sin(ang)*r,(h-0.5)*q.height+chip*(h*h+(1-h)*(1-h)),Math.cos(ang)*r);uv.push(u,h);
    }
    var stride=n+1,layer=(rows+1)*stride;
    function quad(a,b,c,d,flip){if(flip)ix.push(a,c,b,a,d,c);else ix.push(a,b,c,a,c,d);}
    for(var side=0;side<2;side++)for(var y=0;y<rows;y++)for(var j=0;j<n;j++){var k=side*layer+y*stride+j;quad(k,k+1,k+stride+1,k+stride,!!side);}
    for(var j=0;j<n;j++){quad(j,layer+j,layer+j+1,j+1,false);var k=rows*stride+j;quad(k,k+1,layer+k+1,layer+k,false);}
    for(var y=0;y<rows;y++){var k=y*stride;quad(k,k+stride,layer+k+stride,layer+k,false);k+=n;quad(k,layer+k,layer+k+stride,k+stride,false);}
    var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();source.dispose();return g;
  }
'''
t=t.replace('  // GROUND CLUTTER — Cecil Court style detail','  // GROUND CLUTTER — Cecil Court style detail',1)
t=t.replace('  // Scattered rubble — organic dodecahedra',helper+'\n  // Scattered rubble — organic dodecahedra',1)
change('new THREE.DodecahedronGeometry(rbs * 0.5, 0)','new THREE.DodecahedronGeometry(rbs * 0.5, 1)','Carthage foreground rubble softened by weather')
change('new THREE.Mesh(potGeo, terracotta)','new THREE.Mesh(shoreShard(potGeo), terracotta)','Shore pottery: thick walls and chipped rims')
change('new THREE.Mesh(rpGeo, terracotta)','new THREE.Mesh(shoreShard(rpGeo), terracotta)','Right-hand pottery: solid broken wall edges')
change('new THREE.DodecahedronGeometry(rrbS * 0.5, 0)','new THREE.DodecahedronGeometry(rrbS * 0.5, 1)','Right-hand rubble rounded erosion')
change('    fragMesh.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.2;','    fragMesh.rotation.x = (Math.random() - 0.5) * 0.2;','Flat tile fragments lying against the sand')
change('  scene.add(farRightFallen);','''  scene.add(farRightFallen);
  var shoreFine=window.dssDreamDetail(scene);
  [-0.61,0.61].forEach(function(y){shoreFine.ring(0.296,0.009,0x94846a,0,y,0,farRightFallen);});''','Fallen column drum eroded end rims')
change('  // Second ruin fragment further right','''  for(var groove=0;groove<9;groove++){var ga=groove*Math.PI*2/9;shoreFine.wire([[Math.sin(ga)*0.302,-0.56,Math.cos(ga)*0.302],[Math.sin(ga)*0.304,0,Math.cos(ga)*0.304],[Math.sin(ga)*0.302,0.56,Math.cos(ga)*0.302]],0.0035,0x8a7b63,farRightFallen);}
  // Second ruin fragment further right''','Fallen column faint worn longitudinal grooves')
change('  // Dry scrub patches on the ground', '''  var scrubEdgeTex=makeCanvasTexture(128,128,function(cx,w,h){cx.clearRect(0,0,w,h);for(var i=0;i<70;i++){var x=64+Math.sin(i*2.4)*48,y=64+Math.cos(i*3.1)*42;cx.strokeStyle='rgba(122,104,65,0.4)';cx.lineWidth=1;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+Math.sin(i)*9,y-4);cx.stroke();}});
  // Dry scrub patches on the ground''','Dry scrub patches irregular broken straw texture')
t=t.replace('new THREE.MeshStandardMaterial({ color: 0x6a5832, roughness: 0.9, transparent: true, opacity: 0.35 })','new THREE.MeshStandardMaterial({ map:scrubEdgeTex,color:0xb0a080,roughness:1,transparent:true,opacity:0.55,depthWrite:false })',1)
s=s[:a]+t+s[b:]
a,b,t=scope('// ====== THIRD PILLAR PORTAL SCENE','// ====== CENTRE POINT SCENE');(o/'portal-before.js').write_text(t)
change('var y = 0.62;','''var portalFine=window.dssDreamDetail(scene);
[-0.56,0.56].forEach(function(x){portalFine.wire([[x,0.35,0.59],[x*0.92,0.44,0.597],[x*0.96,0.56,0.59]],0.006,0x2e4052,g);});
var y = 0.62;''','Portal upper plinth hairline fissures')
change('// broken crown: a tilted part-drum','''portalFine.ring(0.495,0.008,0x42586b,0,0.655,0,g);
// broken crown: a tilted part-drum''','Portal column foot water-worn stone lip')
change('g.add(crown);','''var crownPos=crown.geometry.attributes.position;
for(var ci=0;ci<crownPos.count;ci++){if(crownPos.getY(ci)>0){var xx=crownPos.getX(ci),zz=crownPos.getZ(ci);crownPos.setY(ci,crownPos.getY(ci)+Math.sin(xx*19+zz*13)*0.035+Math.cos(zz*27)*0.018);}}
crown.geometry.computeVertexNormals();g.add(crown);''','Portal broken crowns irregular fracture surfaces')
change('new THREE.DodecahedronGeometry(0.16 + Math.random() * 0.17)','new THREE.DodecahedronGeometry(0.16 + Math.random() * 0.17,1)','Portal half-drowned rubble water-rounded profiles')
s=s[:a]+t+s[b:];p.write_text(s)
(o/'checklist.md').write_text('# Final focused pass\n\n'+'\n'.join('- [x] '+str(i+1)+'. '+v for i,v in enumerate(items))+'\n');print(len(items),'visual improvements')
