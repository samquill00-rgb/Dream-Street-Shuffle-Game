from pathlib import Path
p=Path('green-sea-3d-static.html');s=p.read_text();Path('scratchpad/visual-pass-last/green-before.html').write_text(s)
s=s.replace('// ---- CAFÉ TABLES & CHAIRS (human scale) ----','''// ---- CAFÉ TABLES & CHAIRS (human scale) ----
var cafeWear=makeCanvasTexture(128,128,function(cx,w,h){cx.fillStyle='#ffffff';cx.fillRect(0,0,w,h);for(var i=0;i<100;i++){cx.strokeStyle='rgba(75,88,83,0.12)';cx.lineWidth=0.5;var x=(i*47)%w,y=(i*31)%h;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+3+(i%7),y+1);cx.stroke();}});
var cafeFixMat=new THREE.MeshStandardMaterial({color:0x889a98,roughness:0.72,metalness:0.2});''',1)
s=s.replace('var chairSlatMat =','tableMat.map=cafeWear;chairMat.map=cafeWear;\nvar chairSlatMat =',1)
s=s.replace('  var column = new THREE.Mesh', '''  var lip=new THREE.Mesh(new THREE.TorusGeometry(radius,0.005,5,32),chairSlatMat);lip.rotation.x=Math.PI/2;lip.position.y=0.796;g.add(lip);
  var column = new THREE.Mesh''',1)
s=s.replace('    g.add(slat);','''    g.add(slat);
    [-0.165,0.165].forEach(function(x){var pin=new THREE.Mesh(new THREE.SphereGeometry(0.008,6,4),cafeFixMat);pin.position.set(x,by,slat.position.z+0.012);pin.scale.z=0.35;g.add(pin);});''',1)
s=s.replace('  scene.add(g);\n}\n\n// Table set 1','''  var brace=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,0.34,8),chairMat);brace.rotation.z=Math.PI/2;brace.position.set(0,0.19,0.15);g.add(brace);
  scene.add(g);
}

// Table set 1''',1)
s=s.replace('// Ashtray on left table','''// Shallow hollow ceramic ashtrays, with a rubbed rim and dark basin.
function cafeAshGeometry(){return new THREE.LatheGeometry([[0,0],[0.072,0],[0.098,0.012],[0.098,0.035],[0.089,0.04],[0.08,0.029],[0.067,0.009],[0,0.009]].map(function(p){return new THREE.Vector2(p[0],p[1]);}),24);}
// Ashtray on left table''',1)
s=s.replace('new THREE.CylinderGeometry(0.08, 0.1, 0.04, 8), ashtrayMat','cafeAshGeometry(), ashtrayMat')
s=s.replace('ashtray1.position.set(-3.0, 0.82, 5.3)','ashtray1.position.set(-3.0, 0.798, 5.3)').replace('ashtray2.position.set(3.3, 0.82, 5.8)','ashtray2.position.set(3.3, 0.798, 5.8)')
p.write_text(s)
c=Path('scratchpad/visual-pass-last/checklist.md');c.write_text(c.read_text()+''.join('- [x] '+str(i+13)+'. '+v+'\n' for i,v in enumerate(['Green Sea café furniture subtle paint wear','Café tabletops rolled lips','Café chair back slat fixings','Café chair lower cross braces','Café ashtrays hollow ceramic profiles seated on tables'])))
print('Five Green Sea details added')
