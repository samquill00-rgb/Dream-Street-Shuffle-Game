from pathlib import Path
import json,re
s=Path('Dream Street Shuffle.twee').read_text();o=Path('scratchpad/visual-pass-new-50');ns={};base=Path('scratchpad/visual-pass-exteriors-50/make-previews.py').read_text();exec(base[:base.index('items=[')],ns)
helper=s[s.index('// Small material and fitting details shared'):s.index('// ====== THE ENLIGHTENMENT — AIRPORT PUB SCENE')]
items=[('bookshop',"// ====== O'FLATTERLY'S BOOKSHOP SCENE",'// ====== THIRD PILLAR PORTAL SCENE','of',[{'name':'Door and stock','pos':[-0.6,1.5,3.5],'tgt':[-0.6,1.3,0.4]}]),('trisha',"// ====== TRISHA'S SCENE","// ====== O'FLATTERLY'S BOOKSHOP SCENE",'ts',[{'name':'Entrance','pos':[0.5,2,3.5],'tgt':[0,2.3,0.2]}]),('colony','// ====== COLONY ROOM SCENE',"// ====== RONNIE SCOTT'S SCENE",'cr',[{'name':'Doors','pos':[1,1.5,4],'tgt':[0.8,1.5,0.1]},{'name':'Pipe and drain','pos':[0,0.9,4],'tgt':[0,0.5,1]}]),('lackland',"// ====== LACKLAND'S OFFICE SCENE",'// ====== CARTHAGE COAST','lo',[{'name':'Entrance','pos':[1,1.7,4],'tgt':[0,1.5,0.1]},{'name':'Dustbin','pos':[-2.5,1.4,3],'tgt':[-3.8,0.6,1.2]}]),('centre','// ====== CENTRE POINT SCENE','function buildFcScene()','cp',[{'name':'Podium','pos':[6,2.5,9],'tgt':[0,1.5,2]},{'name':'Crown','pos':[5,29,8],'tgt':[0,26,0]}])]
for slug,start,end,cid,views in items:
 a=s.index(start);b=s.index(end,a+len(start));block=s[a:b];close=block.rfind('})();');block=block[:close+5]
 (o/(slug+'.html')).write_text(ns['prefix'].replace('CONTAINER',cid+'-container').replace('VIEWS',json.dumps(views))+ns['kit']+ns['helper']+helper+block+'</script>')
 # All original interaction and visible text lines remain unchanged.
 old=(o/(slug+'-before.js')).read_text();pat=r'(?:fillText|strokeText|makeClickable|addEventListener|textContent\s*=|passage:|var TARGET\s*=).*'
 assert re.findall(pat,old)==re.findall(pat,s[a:b]),slug
print('Five previews prepared; text and interaction declarations unchanged.')
