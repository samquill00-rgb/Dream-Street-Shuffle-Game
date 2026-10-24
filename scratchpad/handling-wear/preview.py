from pathlib import Path
import json
s=Path('Dream Street Shuffle.twee').read_text();out=Path('scratchpad/handling-wear')
base=Path('scratchpad/visual-pass-50b/make-previews.py').read_text();ns={};exec(base[:base.index('for name,slug')],ns)
prefix=ns['prefix'].replace('r.render=function(){var result=', 'r.render=function(){if(window._wearView){c.position.fromArray(window._wearView.pos);c.lookAt(new THREE.Vector3().fromArray(window._wearView.tgt));}var result=')
a=s.index('window.dssDetailProps=');b=s.index('// ====== INSIDE THE COLONY',a);helper=s[a:b]
phone=s[s.index('window.dssHandledPhoneMaterials='):s.index('// ====== INSIDE THE FRENCH')]
cover=s[s.index('window.dssOrangePaperbackCover ='):s.index('window.dssScene =')]
for name,slug,cid,mode,views in [
('THE FRENCH','french','fi','old',[{'name':'Handled telephone','pos':[-3.0,1.65,0.02],'tgt':[-3.4,1.34,-0.35]}]),
('THE COACH AND HORSES','coach','cb','kit',[{'name':'Handled telephone','pos':[-2.10,1.70,-2.82],'tgt':[-2.35,1.43,-3.20]},{'name':'Jeffrey’s glass','pos':[0.62,1.43,-1.96],'tgt':[0.45,1.225,-2.20]}]),
("RONNIE'S",'ronnie','ri','old',[{'name':'Used empty tumbler','pos':[-2.54,1.36,1.12],'tgt':[-2.8,1.17,0.9]}])]:
 a=s.index('// ====== INSIDE '+name);b=s.index('// ======',a+20);block=s[a:b]
 nav='''</script><div style="position:fixed;top:0;left:0;z-index:100000" id="wear-nav"></div><script>'''+json.dumps(views)+'''.forEach(function(v){var b=document.createElement('button');b.textContent=v.name;b.onclick=function(){window._wearView=v};document.getElementById('wear-nav').appendChild(b)});</script>'''
 page=prefix.replace('CONTAINER',cid+'-container')+phone+cover+helper+(ns['kit'] if mode=='kit' else '')+block+nav
 (out/(slug+'.html')).write_text(page)
 old=(out/(slug+'-before.js')).read_text();oldhelper=(out/'helper-before.js').read_text()
 (out/(slug+'-before.html')).write_text(page.replace(block,old).replace(helper,oldhelper))
