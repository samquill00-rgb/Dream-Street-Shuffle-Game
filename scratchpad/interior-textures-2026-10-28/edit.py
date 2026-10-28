from pathlib import Path
import re
p=Path('Dream Street Shuffle.twee');s=p.read_text();out=Path('scratchpad/interior-textures-2026-10-28')
(out/'source-before.twee').write_text(s)
helper=(out/'surfaces.js').read_text()
s=s.replace('// >>>> DSS ROOM KIT BEGIN',helper+'\n// >>>> DSS ROOM KIT BEGIN',1)
start=s.index('// >>>> DSS ROOM KIT BEGIN');end=s.index('// ======',s.index('// ====== INSIDE O\'FLATTERLY\'S')+20)
part=s[start:end]
for fn,kind in [('woodTex','wood'),('paintTex','plaster')]:
 pat=r'function '+fn+r'\([^\n]*\) \{\nreturn tex\([\s\S]*?\n\}\);\n\}'
 def change(m):
  b=m.group();b=b.replace('return tex(', 'return window.dssInteriorSurface(tex(',1)
  idx=b.rfind('});');return b[:idx]+"}), '"+kind+"', seed);"+b[idx+3:]
 part,n=re.subn(pat,change,part);print(fn,n);assert n==5
s=s[:start]+part+s[end:]
rooms=[('THE FRENCH', [('carpetPile','cloth')]),('THE COLONY',[('carpetPile','cloth'),('bamboo','wood')]),('THE PILLARS',[('boardTex','wood'),('stoneTex','stone'),('copperTex','metal')]),("RONNIE'S",[('carpetPile','cloth'),('pleatTex','cloth')]),("COPPER'S CELLAR",[('floorTex','stone')]),('THE COACH AND HORSES',[('tileTex','tile'),('panelTex','wood')]),("TRISHA'S",[('floorTex','boards')]),("LACKLAND'S OFFICE",[('boardsTex','boards')]),('THE CHINESE FISH AND CHIPS',[('tileTex','tile'),('linoTex','lino')]),("O'FLATTERLY'S",[('boardsTex','boards')])]
for ri,(name,maps) in enumerate(rooms):
 a=s.index('// ====== INSIDE '+name);b=s.index('// ======',a+20);part=s[a:b]
 for j,(v,k) in enumerate(maps):
  # The wrap setup follows texture drawing and precedes material creation.
  pat=v+r'\.wrapS'
  part,n=re.subn(pat,"window.dssInteriorSurface("+v+", '"+k+"', "+str(ri*17+j+4)+");\n"+v+'.wrapS',part,count=1)
  assert n==1,(name,v)
 if name=="COPPER'S CELLAR":
  part=part.replace('var t = blockTex(seed);','var t = window.dssInteriorSurface(blockTex(seed), \'stone\', seed);',1)
 if name=='THE CHINESE FISH AND CHIPS':
  part=part.replace('map: t, roughness: 0.25','map: t, bumpMap: t, bumpScale: 0.0015, roughness: 0.3',1)
 s=s[:a]+part+s[b:]
 print(name, maps)
p.write_text(s)
