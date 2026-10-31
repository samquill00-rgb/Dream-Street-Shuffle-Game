from pathlib import Path
import json,re,hashlib
out=Path('scratchpad/venue-art-2026-10-31');data=json.loads((out/'manifest.json').read_text())
catalog={venue:[{'id':x['id'],'file':x['local_path'],'title':x['title'],'artist':x['artist']} for x in works] for venue,works in data.items()}
helper='''// Locally stored, individually documented public-domain venue photographs and prints.
window.dssVenueArt = CATALOG;
window.dssVenueArtVersion=0;
window.dssVenuePhoto=function(venue,index,tex,aspect){
  var list=window.dssVenueArt[venue],art=list[index%list.length];aspect=aspect||.75;
  var w=aspect>=1?384:Math.round(384*aspect),h=aspect>=1?Math.round(384/aspect):384;
  var t=tex(w,h,function(c,w,h){c.fillStyle='#b9ae95';c.fillRect(0,0,w,h);}),dead=false;
  t.userData={dssVenueArt:venue,artworkId:art.id,loaded:false};t.addEventListener('dispose',function(){dead=true;});
  function draw(im){if(dead)return;var c=t.image.getContext('2d'),w=t.image.width,h=t.image.height;c.fillStyle='#b9ae95';c.fillRect(0,0,w,h);
    var margin=Math.max(3,Math.min(w,h)*.035),scale=Math.min((w-margin*2)/im.naturalWidth,(h-margin*2)/im.naturalHeight),dw=im.naturalWidth*scale,dh=im.naturalHeight*scale;
    c.drawImage(im,(w-dw)/2,(h-dh)/2,dw,dh);c.fillStyle='rgba(101,79,41,.035)';c.fillRect((w-dw)/2,(h-dh)/2,dw,dh);t.userData.loaded=true;t.needsUpdate=true;window.dssVenueArtVersion++;
  }
  var cache=window._dssVenueArtImages||(window._dssVenueArtImages={}),entry=cache[art.file];
  if(entry){if(entry.loaded)draw(entry.image);else entry.wait.push(draw);}
  else{var im=new Image();entry={image:im,loaded:false,wait:[draw]};cache[art.file]=entry;im.onload=function(){entry.loaded=true;entry.wait.forEach(function(fn){fn(im);});entry.wait=[];};im.src=art.file;}
  return t;
};
'''.replace('CATALOG',json.dumps(catalog,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c'))
(out/'helper.js').write_text(helper)
p=Path('Dream Street Shuffle.twee');s=p.read_text();s=s.replace('// >>>> DSS ROOM KIT BEGIN',helper+'\n// >>>> DSS ROOM KIT BEGIN',1)
def section(name):
    a=s.index('// ====== INSIDE '+name);b=s.index('// ======',a+20);return a,b,s[a:b]
# French: retain the entire special-photo branch exactly, changing only the generic photo generator.
a,b,block=section('THE FRENCH');(out/'french-before.js').write_text(block);x=block.index('function photoTex(seed) {');y=block.index('var EMPTY =',x)
block=block[:x]+"var frenchPhotoIndex=0;\nfunction photoTex(seed,aspect){return window.dssVenuePhoto('french',frenchPhotoIndex++,tex,aspect);}\n"+block[y:]
block=block.replace('photoTex(f + 11)','photoTex(f + 11,0.26/0.36)').replace('photoTex(f2 + 30)','photoTex(f2 + 30,0.18/0.24)')
assert (out/'french-special-branch.txt').read_text() in block
s=s[:a]+block+s[b:]
# Ronnie's existing seven performer photographs.
a,b,block=section("RONNIE'S");(out/'ronnie-before.js').write_text(block);x=block.index('function photoTex(seed) {');y=block.index('var picFrame =',x)
block=block[:x]+"var ronniePhotoIndex=0;\nfunction photoTex(seed){return window.dssVenuePhoto('ronnie',ronniePhotoIndex++,tex,0.34/0.44);}\n"+block[y:];s=s[:a]+block+s[b:]
# Trisha's nine tilted wall photographs.
a,b,block=section("TRISHA'S");(out/'trisha-before.js').write_text(block);x=block.index('function photoTex(seed) {');y=block.index('var picG =',x)
block=block[:x]+"var trishaPhotoIndex=0;\nfunction photoTex(seed){return window.dssVenuePhoto('trisha',trishaPhotoIndex++,tex,0.26/0.32);}\n"+block[y:];s=s[:a]+block+s[b:]
# Coach: the six framed satirical prints, not any signs or story posters.
a,b,block=section('THE COACH AND HORSES');(out/'coach-before.js').write_text(block);block=block.replace('function framedPrint(x,y,z,ry,seed){','var coachPrintIndex=0;\nfunction framedPrint(x,y,z,ry,seed){',1);x=block.index('var art=tex(',block.index('function framedPrint'));y=block.index('var g=new THREE.Group();g.position',x)
block=block[:x]+"var art=window.dssVenuePhoto('coach',coachPrintIndex++,tex,0.5/0.35);\n"+block[y:];s=s[:a]+block+s[b:]
p.write_text(s)
f=Path('french-frame-photo.jpg');assert hashlib.sha256(f.read_bytes()).hexdigest()==(out/'french-special-sha256.txt').read_text()
