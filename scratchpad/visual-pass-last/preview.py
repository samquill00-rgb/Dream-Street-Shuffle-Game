from pathlib import Path
import re,json
s=Path('Dream Street Shuffle.twee').read_text();o=Path('scratchpad/visual-pass-last');ns={};q=Path('scratchpad/visual-pass-exteriors-50/make-previews.py').read_text();exec(q[:q.index('items=[')],ns)
h=s[s.index('// Small material and fitting details shared'):s.index('// ====== THE ENLIGHTENMENT — AIRPORT PUB SCENE')]
for slug,start,end,cid,views in [('carthage','// ====== CARTHAGE COAST','// ====== THE GREEN SEA','ca',[{'name':'Fallen drum','pos':[20,1.4,3.5],'tgt':[19,0.3,0.5]},{'name':'Shore pottery','pos':[0,1,-3],'tgt':[0,0,-6]}]),('portal','// ====== THIRD PILLAR PORTAL SCENE','// ====== CENTRE POINT SCENE','tp',[{'name':'Broken column','pos':[-1,2.5,4],'tgt':[-2.9,2,0]}])]:
 a=s.index(start);b=s.index(end,a+len(start));block=s[a:b];old=(o/(slug+'-before.js')).read_text();pat=r'(?:fillText|strokeText|makeClickable|addEventListener|textContent\s*=|passage:).*';assert re.findall(pat,old)==re.findall(pat,block)
 block=block[:block.rfind('})();')+5]
 if slug=='carthage':block=block.replace("getElementById('cc-approach')","getElementById('ca-container')")
 (o/(slug+'.html')).write_text(ns['prefix'].replace('CONTAINER',cid+'-container').replace('VIEWS',json.dumps(views))+ns['kit']+h+block+'</script>')
print('Text and interaction declarations unchanged; previews ready')
