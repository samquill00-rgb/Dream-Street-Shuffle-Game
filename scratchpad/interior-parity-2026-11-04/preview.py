from pathlib import Path
s=Path('Dream Street Shuffle.twee').read_text();out=Path('scratchpad/interior-parity-2026-11-04')
base=Path('scratchpad/visual-pass-50b/make-previews.py').read_text();ns={};exec(base[:base.index('for name,slug')],ns)
prefix=ns['prefix'].replace('var target=new THREE.Vector3();','var target=new THREE.Vector3(o.CAM.tx,o.CAM.ty,o.CAM.tz);').replace('window.dssGhostTex=function','window.dssGhostLevel=function(b){return Math.min(b,0.24);};window.dssGhostTex=function')
shared=s[s.index('window.dssInteriorSurface ='):s.index('// >>>> DSS ROOM KIT BEGIN')]
shared+=s[s.index('window.dssHandledPhoneMaterials='):s.index('// ====== INSIDE THE FRENCH')]
shared+=s[s.index('window.dssOrangePaperbackCover ='):s.index('window.dssScene =')]
shared+=s[s.index('window.dssDetailProps='):s.index('// ====== INSIDE THE COLONY')]
shared+=s[s.index('window.dssBookSwaps ='):s.index('// ====== INSIDE O\'FLATTERLY')]
# Include the real texture assets and their loader, preserving the game's materials.
a=s.index('window.dssPaintTex =');b=s.index('/* 2026-10-29 (Sam: "I added a parallax',a);shared+=s[a:b]
kit=s[s.index('// >>>> DSS ROOM KIT BEGIN'):s.index('// <<<< DSS ROOM KIT END')]
rooms=[('THE FRENCH','french','fi',False),('THE COLONY','colony','ci',False),('THE PILLARS','pillars','pi',False),("RONNIE'S",'ronnie','ri',False),("COPPER'S CELLAR",'cellar','cu',True),('THE COACH AND HORSES','coach','cb',True),("TRISHA'S",'trisha','ti',True),("LACKLAND'S OFFICE",'office','lk',True),('THE CHINESE FISH AND CHIPS','chippy','cf',True),("O'FLATTERLY'S",'bookshop','oi',True)]
for name,slug,cid,k in rooms:
 a=s.index('// ====== INSIDE '+name);b=s.index('// ======',a+20);block=s[a:b]
 (out/(slug+'.html')).write_text(prefix.replace('CONTAINER',cid+'-container')+shared+(kit if k else '')+block+'</script>')
print('Prepared ten current interior previews')
