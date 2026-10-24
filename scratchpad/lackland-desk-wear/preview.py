from pathlib import Path
import json
s=Path('Dream Street Shuffle.twee').read_text();out=Path('scratchpad/lackland-desk-wear')
base=Path('scratchpad/visual-pass-50b/make-previews.py').read_text();ns={};exec(base[:base.index('for name,slug')],ns)
prefix=ns['prefix'].replace('r.render=function(){var result=', 'r.render=function(){if(window._deskView){c.position.fromArray(window._deskView.pos);c.lookAt(new THREE.Vector3().fromArray(window._deskView.tgt));}var result=')
a=s.index('window.dssDetailProps=');b=s.index('// ====== INSIDE THE COLONY',a);helper=s[a:b]
a=s.index("// ====== INSIDE LACKLAND'S OFFICE");b=s.index('// ======',a+20);block=s[a:b]
views=[{'name':'Desk overview','pos':[0.8,1.4,-0.15],'tgt':[-0.3,0.95,-1.7]},{'name':'Typewriter','pos':[-0.78,1.28,-0.97],'tgt':[-0.85,0.91,-1.55]},{'name':'Manuscript','pos':[0.08,1.20,-1.36],'tgt':[-0.2,0.83,-1.68]},{'name':'Paper stacks','pos':[0.65,1.24,-1.39],'tgt':[0.46,0.89,-1.8]}]
nav='''</script><div style="position:fixed;top:0;left:0;z-index:100000" id="desk-nav"></div><script>'''+json.dumps(views)+'''.forEach(function(v){var b=document.createElement('button');b.textContent=v.name;b.onclick=function(){window._deskView=v};document.getElementById('desk-nav').appendChild(b)});</script>'''
page=prefix.replace('CONTAINER','lk-container')+helper+ns['kit']+block+nav
(out/'office.html').write_text(page)
(out/'office-before.html').write_text(page.replace(block,(out/'office-before.js').read_text()))
