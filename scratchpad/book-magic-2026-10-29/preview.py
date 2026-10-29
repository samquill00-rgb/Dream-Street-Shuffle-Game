from pathlib import Path
s=Path('Dream Street Shuffle.twee').read_text();out=Path('scratchpad/book-magic-2026-10-29')
a=s.index('window.dssBookMagic =');b=s.index('// ====== INSIDE O\'FLATTERLY',a);magic=s[a:b]
# Reuse isolated exterior fixture shell and its shared scene helpers.
p=Path('scratchpad/inis-approach-2026-10-29/after.html').read_text();a=s.index("// ====== O'FLATTERLY'S BOOKSHOP SCENE");b=s.index('// ====== THIRD PILLAR PORTAL',a)
(out/'outside.html').write_text(p[:p.index("// ====== O'FLATTERLY'S BOOKSHOP SCENE")]+magic+s[a:b]+'</script>')
ns={};base=Path('scratchpad/visual-pass-50b/make-previews.py').read_text();exec(base[:base.index('for name,slug')],ns)
prefix=ns['prefix'].replace('CONTAINER','oi-container').replace('var target=new THREE.Vector3();','var target=new THREE.Vector3(o.CAM.tx,o.CAM.ty,o.CAM.tz);').replace('{resize:function(){}}','{scene:s,renderer:r,camera:c,resize:function(){}}')
kit=s[s.index('// >>>> DSS ROOM KIT BEGIN'):s.index('// <<<< DSS ROOM KIT END')]
helper=s[s.index('window.dssDetailProps='):s.index('// ====== INSIDE THE COLONY')]
phone=s[s.index('window.dssHandledPhoneMaterials='):s.index('// ====== INSIDE THE FRENCH')]
cover=s[s.index('window.dssOrangePaperbackCover ='):s.index('window.dssScene =')]
a=s.index("// ====== INSIDE O'FLATTERLY'S");b=s.index('// <<<< DSS ROOM OI END',a)
(out/'inside.html').write_text(prefix+Path('scratchpad/interior-textures-2026-10-28/surfaces.js').read_text()+phone+cover+helper+kit+magic+s[a:b]+'</script>')
