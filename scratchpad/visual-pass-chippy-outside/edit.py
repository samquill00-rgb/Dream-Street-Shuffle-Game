from pathlib import Path
p=Path('Dream Street Shuffle.twee');s=p.read_text();a=s.index('// ====== CHINESE FISH AND CHIPS — INLINE');b=s.index('// ====== PILLARS SCENE LAYOUT FIX',a);t=s[a:b];o=Path('scratchpad/visual-pass-chippy-outside');(o/'before.js').write_text(t)
t=t.replace('  // ---- Worn stone step in front of the door ----','''  // Small worn fittings, kept behind the existing door furniture.
  var outsideFine=window.dssDreamDetail(scene);
  outsideFine.box(0.08,0.15,0.008,0x777c75,0.75,1.5,0.348,shop,true);
  outsideFine.pin(0.75,1.555,0.357,shop);outsideFine.pin(0.75,1.445,0.357,shop);
  [0.32,0.68].forEach(function(x){outsideFine.box(0.055,0.065,0.009,0x8e9287,x,1.5,0.35,shop,true);outsideFine.pin(x,1.5,0.361,shop);});
  [0.95,2.85].forEach(function(y){outsideFine.box(0.055,0.09,0.018,0x77766b,0.12,y,0.364,shop,true);});
  // ---- Worn stone step in front of the door ----''',1)
t=t.replace('  shop.add(openSign);','''  shop.add(openSign);
  outsideFine.wire([[0.35,2.875,0.368],[0.5,3.08,0.365],[0.65,2.875,0.368]],0.0025,0x52544c,shop);''',1)
t=t.replace('  // Bollard\n','''  // The recessed dark gaps beneath the existing grate bars.
  for(var ds=-0.09;ds<0.13;ds+=0.06)outsideFine.box(0.31,0.002,0.03,0x0d1112,-1,0.103,3.3+ds);
  // Bollard
''',1)
t=t.replace('  // Dustbin — moved','''  outsideFine.ring(0.077,0.01,0x555448,-2.2,0.07,3.2);
  // Dustbin — moved''',1)
t=t.replace('  // Bicycle leaning against wall','''  outsideFine.ring(0.196,0.01,0x676a60,-1.8,0.587,1.6);
  outsideFine.wire([[-1.85,0.59,1.6],[-1.85,0.63,1.6],[-1.75,0.63,1.6],[-1.75,0.59,1.6]],0.008,0x676a60);
  // Bicycle leaning against wall''',1)
t=t.replace('new THREE.CylinderGeometry(0.25, 0.25, 0.02, 16)','new THREE.TorusGeometry(0.23,0.02,6,28).rotateX(Math.PI/2)')
t=t.replace('  // Handlebars\n','''  [-2.15,-1.45].forEach(function(x){
    outsideFine.ring(0.211,0.006,0x828782,x,0.25,1.2,null,true);
    outsideFine.put(new THREE.SphereGeometry(0.024,8,6),outsideFine.mat(0x74786e,true),x,0.25,1.217);
    for(var spoke=0;spoke<12;spoke++){var sa=spoke*Math.PI/6;outsideFine.wire([[x,0.25,1.213],[x+Math.cos(sa)*0.208,0.25+Math.sin(sa)*0.208,1.213]],0.0018,0x8c9085);}
  });
  outsideFine.box(0.19,0.035,0.09,0x3d3427,-1.45,0.65,1.2);
  outsideFine.wire([[-1.8,0.32,1.2],[-1.8,0.21,1.24],[-1.73,0.21,1.24]],0.008,0x62675d);
  // Handlebars
''',1)
s=s[:a]+t+s[b:];p.write_text(s)
items=['Door handle plate and fixings','Chrome pushbar mounting pads','Door hinge leaves','OPEN sign suspension wire','Drain recessed dark slots','Bollard base collar','Dustbin rolled lid and carry handle','Bicycle open tyres replacing solid discs','Bicycle rims, hubs and spokes','Bicycle saddle and pedal crank']
(o/'checklist.md').write_text('# Chippy exterior\n\n'+'\n'.join('- [x] '+str(i+1)+'. '+v for i,v in enumerate(items))+'\n')
import re
pat=r'(?:fillText|strokeText|makeClickable|addEventListener|textContent\s*=|passage:).*';assert re.findall(pat,(o/'before.js').read_text())==re.findall(pat,t)
ns={};q=Path('scratchpad/visual-pass-exteriors-50/make-previews.py').read_text();exec(q[:q.index('items=[')],ns)
h=s[s.index('// Small material and fitting details shared'):s.index('// ====== THE ENLIGHTENMENT — AIRPORT PUB SCENE')]
import json
views=[{'name':'Bicycle','pos':[-2.5,1.1,3.1],'tgt':[-1.8,0.4,1.2]}]
(o/'preview.html').write_text(ns['prefix'].replace('CONTAINER','fc-container').replace('VIEWS',json.dumps(views))+ns['kit']+h+t[:t.rfind('})();')+5]+'</script>')
print('10 details; text and interaction declarations unchanged')
