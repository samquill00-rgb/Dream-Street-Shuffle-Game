from pathlib import Path
import re
s=Path('Dream Street Shuffle.twee').read_text();out=Path('scratchpad/venue-art-2026-10-31');helper=(out/'helper.js').read_text()
ga=s.index('// >>>> DSS GHOST TEX BEGIN');gb=s.index('// <<<< DSS GHOST TEX END',ga);ghost=s[ga:gb]
kit=s[s.index('// >>>> DSS ROOM KIT BEGIN'):s.index('// <<<< DSS ROOM KIT END')]
for slug,name in [('french','THE FRENCH'),('trisha',"TRISHA'S"),('ronnie',"RONNIE'S"),('coach','THE COACH AND HORSES')]:
    mark='// ====== INSIDE '+name;a=s.index(mark);b=s.index('// ======',a+20);block=s[a:b]
    t=(Path('scratchpad/lighting-2026-10-31')/(slug+'-after-post.html')).read_text();prefix=t[:t.index(mark)]
    if '// >>>> DSS ROOM KIT BEGIN' in prefix:
        x=prefix.index('// >>>> DSS ROOM KIT BEGIN');prefix=prefix[:x]+kit
    (out/(slug+'.html')).write_text(prefix+ghost+helper+block+'</script>')
m=re.search(r'^:: UserScript[^\n]*\n(.*?)(?=^:: )',s,re.M|re.S);(out/'userscript.js').write_text(m[1])
