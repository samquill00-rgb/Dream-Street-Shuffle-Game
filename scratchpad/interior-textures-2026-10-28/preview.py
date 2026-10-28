from pathlib import Path
out=Path('scratchpad/interior-textures-2026-10-28')
base=Path('scratchpad/visual-pass-50b/make-previews.py').read_text();ns={};exec(base[:base.index('for name,slug')],ns)
prefix=ns['prefix'].replace('var target=new THREE.Vector3();', 'var target=new THREE.Vector3(o.CAM.tx,o.CAM.ty,o.CAM.tz);').replace('window._dssThreeRegistry[id]={resize:function(){}};', 'window._dssThreeRegistry[id]={scene:s,renderer:r,camera:c,resize:function(){}};r.setPixelRatio(0.65);r.shadowMap.enabled=false;')
rooms=[('THE FRENCH','french','fi',False),('THE COLONY','colony','ci',False),('THE PILLARS','pillars','pi',False),("RONNIE'S",'ronnie','ri',False),("COPPER'S CELLAR",'cellar','cu',True),('THE COACH AND HORSES','coach','cb',True),("TRISHA'S",'trisha','ti',True),("LACKLAND'S OFFICE",'office','lk',True),('THE CHINESE FISH AND CHIPS','chippy','cf',True),("O'FLATTERLY'S",'bookshop','oi',True)]
for state,s in [('after',Path('Dream Street Shuffle.twee').read_text()),('before',(out/'source-before.twee').read_text())]:
 kit=s[s.index('// >>>> DSS ROOM KIT BEGIN'):s.index('// <<<< DSS ROOM KIT END')]
 helper=s[s.index('window.dssDetailProps='):s.index('// ====== INSIDE THE COLONY')]
 phone=s[s.index('window.dssHandledPhoneMaterials='):s.index('// ====== INSIDE THE FRENCH')]
 cover=s[s.index('window.dssOrangePaperbackCover ='):s.index('window.dssScene =')]
 surface=(out/'surfaces.js').read_text() if state=='after' else ''
 for name,slug,cid,k in rooms:
  a=s.index('// ====== INSIDE '+name);b=s.index('// ======',a+20)
  block=s[a:b]
  (out/(slug+'-'+state+'.html')).write_text(prefix.replace('CONTAINER',cid+'-container')+surface+phone+cover+helper+(kit if k else '')+block+'</script>')
  (out/(slug+'-'+state+'.js')).write_text(surface+phone+cover+helper+(kit if k else '')+block)
