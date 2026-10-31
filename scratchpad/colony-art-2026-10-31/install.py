from pathlib import Path
import json
assets=json.loads(Path('artwork/colony/manifest.json').read_text())
entries=[{'id':x['id'],'file':x['local_path'],'title':x['title'],'artist':x['artist_title'],'ratio':x['aspect_ratio']} for x in assets]
p=Path('Dream Street Shuffle.twee');s=p.read_text();a=s.index('// ====== INSIDE THE COLONY');b=s.index('// ======',a+20);block=s[a:b]
Path('scratchpad/colony-art-2026-10-31/room-before.js').write_text(block)
x=block.index('function pictureTex(seed) {');y=block.index('var picN = 0;',x)
replacement='''// Local public-domain museum images; complete compositions fit inside neutral paper mounts.
var colonyArt = ENTRIES;
var colonyArtUses=colonyArt.map(function(){return 0;}),colonyArtVersion=0;
var colonyArtImages={};
function pictureArt(seed,aspect){
  var best=0,score=Infinity;
  colonyArt.forEach(function(a,i){var n=colonyArtUses[i]*2+Math.abs(Math.log(a.ratio/aspect))+rnd(seed+i)*.08;if(n<score){best=i;score=n;}});
  colonyArtUses[best]++;return colonyArt[best];
}
function pictureTex(art,aspect){
  var w=aspect>=1?384:Math.round(384*aspect),h=aspect>=1?Math.round(384/aspect):384;
  var texture=tex(w,h,function(c,w,h){c.fillStyle='#b7ad94';c.fillRect(0,0,w,h);}),dead=false;
  texture.addEventListener('dispose',function(){dead=true;});
  function draw(im){if(dead)return;var c=texture.image.getContext('2d'),w=texture.image.width,h=texture.image.height;
    c.fillStyle='#b7ad94';c.fillRect(0,0,w,h);var margin=Math.max(3,Math.min(w,h)*.035),scale=Math.min((w-margin*2)/im.naturalWidth,(h-margin*2)/im.naturalHeight),dw=im.naturalWidth*scale,dh=im.naturalHeight*scale;
    c.drawImage(im,(w-dw)/2,(h-dh)/2,dw,dh);c.fillStyle='rgba(117,94,51,.035)';c.fillRect((w-dw)/2,(h-dh)/2,dw,dh);texture.needsUpdate=true;colonyArtVersion++;
  }
  var cached=colonyArtImages[art.file];
  if(cached){if(cached.loaded)draw(cached.image);else cached.wait.push(draw);}
  else{var im=new Image();cached={image:im,loaded:false,wait:[draw]};colonyArtImages[art.file]=cached;im.onload=function(){cached.loaded=true;cached.wait.forEach(function(fn){fn(im);});cached.wait=[];};im.src=art.file;}
  return texture;
}
'''.replace('ENTRIES',json.dumps(entries,ensure_ascii=False,separators=(',',':')))
block=block[:x]+replacement+block[y:]
needle='mesh(new THREE.PlaneGeometry(w - 0.03, h - 0.03), new THREE.MeshStandardMaterial({ map: pictureTex(seed), roughness: 0.75, envMap: roomEnv, envMapIntensity: 0.15 }), 0, 0, 0.042, g);'
assert block.count(needle)==1
block=block.replace(needle,'''var art=pictureArt(seed,(w-.03)/(h-.03));g.userData.artwork=art;g.name='colony-artwork-'+art.id;
mesh(new THREE.PlaneGeometry(w - 0.03, h - 0.03), new THREE.MeshStandardMaterial({ map: pictureTex(art,(w-.03)/(h-.03)), roughness: 0.82, envMap: roomEnv, envMapIntensity: 0.10 }), 0, 0, 0.042, g);''',1)
block=block.replace('var lastAspect = 0, lastP =', 'var lastArtVersion=-1;\nvar lastAspect = 0, lastP =',1)
block=block.replace('if (lastAspect === camera.aspect && lastP.distanceToSquared', 'if (lastArtVersion===colonyArtVersion && lastAspect === camera.aspect && lastP.distanceToSquared',1)
block=block.replace('lastAspect = camera.aspect; lastP.copy', 'lastArtVersion=colonyArtVersion;lastAspect = camera.aspect; lastP.copy',1)
# First mirror update happens only after the scene has finished constructing, so the version is ready.
s=s[:a]+block+s[b:];p.write_text(s)
fixture=Path('scratchpad/colony-mirror-ghosts-2026-10-31/preview.html').read_text();x=fixture.index('// ====== INSIDE THE COLONY')
Path('scratchpad/colony-art-2026-10-31/preview.html').write_text(fixture[:x]+block+'</script>')
