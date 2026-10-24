from pathlib import Path
import json
s=Path('Dream Street Shuffle.twee').read_text();out=Path('scratchpad/prop-wear-selected')
base=Path('scratchpad/visual-pass-50b/make-previews.py').read_text();ns={};exec(base[:base.index('for name,slug')],ns)
prefix=ns['prefix'].replace('r.render=function(){var result=', 'r.render=function(){if(window._wearView){c.position.fromArray(window._wearView.pos);c.lookAt(new THREE.Vector3().fromArray(window._wearView.tgt));}var result=')
a=s.index('window.dssDetailProps=');b=s.index('// ====== INSIDE THE COLONY',a);helper=s[a:b]
cover=s[s.index('window.dssOrangePaperbackCover ='):s.index('window.dssScene =')]
for name,slug,cid,mode,views in [
('THE FRENCH','french','fi','old',[{'name':'Glass ashtray','pos':[-1.40,1.43,0.27],'tgt':[-1.61,1.151,-0.017]}]),
('THE CHINESE FISH AND CHIPS','chippy','cf','kit',[{'name':'Ashtray','pos':[-1.12,1.01,2.7],'tgt':[-1.30,0.778,2.40]},{'name':'Matchbox','pos':[-0.83,0.96,2.79],'tgt':[-0.97,0.78,2.60]},{'name':'Condiments','pos':[1.8,1.36,1.52],'tgt':[2.1,1.09,1.29]}]),
('THE COACH AND HORSES','coach','cb','kit',[{'name':'Bottle labels','pos':[0.2,2.2,-2.6],'tgt':[0.2,2.2,-3.3]},{'name':'Counter ash','pos':[-0.3,1.5,-1.8],'tgt':[-0.4,1.18,-2.3]},{'name':'Working towel','pos':[0.55,1.55,-1.8],'tgt':[0.5,1.18,-2.35]}]),
("RONNIE'S",'ronnie','ri','old',[{'name':'Table ash','pos':[-1.38,1.04,0.02],'tgt':[-1.56,0.754,-0.34]},{'name':'Bar towel','pos':[-2.6,1.48,1.9],'tgt':[-2.7,1.15,1.6]}])]:
 a=s.index('// ====== INSIDE '+name);b=s.index('// ======',a+20);block=s[a:b]
 nav='''</script><div style="position:fixed;top:0;left:0;z-index:100000" id="wear-nav"></div><script>'''+json.dumps(views)+'''.forEach(function(v){var b=document.createElement('button');b.textContent=v.name;b.onclick=function(){window._wearView=v};document.getElementById('wear-nav').appendChild(b)});</script>'''
 (out/(slug+'.html')).write_text(prefix.replace('CONTAINER',cid+'-container')+cover+helper+(ns['kit'] if mode=='kit' else '')+block+nav)
