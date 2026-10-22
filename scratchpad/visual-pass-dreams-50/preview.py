from pathlib import Path
import json
s=Path('Dream Street Shuffle.twee').read_text();o=Path('scratchpad/visual-pass-dreams-50')
base=Path('scratchpad/visual-pass-exteriors-50/make-previews.py').read_text();ns={};exec(base[:base.index('items=[')],ns);prefix=ns['prefix']
helper=s[s.index('// Small material and fitting details shared'):s.index('// ====== THE ENLIGHTENMENT — AIRPORT PUB SCENE')]
for slug,start,end,cid,views in [
('nazca','// ====== NAZCA APPROACH SCENE','// ====== EASTER ISLAND SHORE SCENE','nz',[{'name':'Cantina','pos':[0,2,-20],'tgt':[-5,1.2,-20]}]),
('easter','// ====== EASTER ISLAND SHORE SCENE','// ====== PYRAMID MOUTH SCENE','ei',[{'name':'Shore','pos':[4,1.6,8],'tgt':[3.4,0.7,3]},{'name':'Moai','pos':[9,6,1],'tgt':[9,6,-6.5]}]),
('pyramid','// ====== PYRAMID MOUTH SCENE','// ====== THE PLAIN OF CHEBAR SCENE','py',[{'name':'Barrier','pos':[-1,2,133],'tgt':[-12,1,124]},{'name':'Mouth','pos':[-20,39,72],'tgt':[-26,38,59]}]),
('airport','// ====== THE ENLIGHTENMENT — AIRPORT PUB SCENE','// ====== NAZCA APPROACH SCENE','ap',[{'name':'Luggage','pos':[5.3,1.4,4.1],'tgt':[4.1,0.5,1.9]}])]:
 a=s.index(start);b=s.index(end,a+len(start));block=s[a:b]
 # Keep only the scene IIFE; prose passages can follow scene code in source.
 close=block.rfind('})();')
 if close>=0:block=block[:close+5]
 (o/(slug+'.html')).write_text(prefix.replace('CONTAINER',cid+'-container').replace('VIEWS',json.dumps(views))+helper+block+'</script>')
