import re, sys
sys.path.insert(0, "scratchpad/audit-2026-09-16")
src = open("Dream Street Shuffle.twee", encoding="utf-8").read()
hdr = re.compile(r'^:: (.+?)(?:\s+\[([^\]]*)\])?(?:\s+(\{[^\n]+\}))?\s*$', re.M)
ms = list(hdr.finditer(src)); B={}; T={}
for i,m in enumerate(ms):
    B[m.group(1)] = src[m.end(): ms[i+1].start() if i+1<len(ms) else len(src)]; T[m.group(1)]=(m.group(2) or "").split()
names=set(B)
print("passages", len(B))
# dead links
dead=[]
for n,b in B.items():
    if n in ("StoryInit","header header"): pass
    for t in re.findall(r'\[\[([^\]]+)\]\]', b):
        tgt = t.split('->')[-1] if '->' in t else (t.split('<-')[0] if '<-' in t else t.split('|')[-1])
        tgt=tgt.strip()
        if tgt not in names and not tgt.startswith('$') and not tgt.startswith('('): dead.append((n,tgt))
    for t in re.findall(r'\((?:go-to|link-goto|link-reveal-goto|redirect|click-goto|display):\s*(?:"[^"]*",\s*)?"([^"]+)"\s*\)', b):
        if t not in names: dead.append((n,t,'macro'))
print("DEAD LINKS:", dead)
# rain in Soho (non-dream) passages
dream_words = ("Nazca","Easter","Moai","Pyramid","Chebar","Ezekiel","Himalaya","Airport","Yeti","Climb","Camp","Glyph","Shore","Reclamation","Carthage","Sanctum","Portal","Synthesis","Pillar Three","Third Pillar","Preview","Plain","Spoke","Wheel","Khufu","Dido","Salon","Cow")
for n,b in B.items():
    if any(w.lower() in n.lower() for w in dream_words): continue
    txt=re.sub(r'<style>.*?</style>|<script>.*?</script>','',b,flags=re.S)
    for m in re.finditer(r'\b(rain\w*|drizzl\w*|downpour|wet pavement|puddle\w*)\b', txt, re.I):
        ctx=txt[max(0,m.start()-70):m.end()+50].replace('\n',' ')
        pink = 'claude-draft' in txt[max(0,m.start()-400):m.start()] or '[Sam:' in txt[max(0,m.start()-200):m.start()]
        print("RAIN", n, "|", "PINK" if pink else "    ", "|", ctx)
# straight quotes in his written loops
his = [n for n in B if any(k in n for k in ("Nazca","Easter Island","Moai","Glyph","Airport","Base Camp","Himalaya","Climb","Yeti","Summit","Camp","Shore","Turn-Back","Turn Back","Listening"))]
print("HIS LOOP PASSAGES:", his)
for n in his:
    txt=re.sub(r'<style>.*?</style>|<script>.*?</script>|<[^>]+>|\([a-z-]+:[^)]*\)','',B[n],flags=re.S)
    txt=re.sub(r'\[Sam:[^\]]*\]','',txt)
    sq=[txt[max(0,m.start()-30):m.end()+30].replace('\n',' ') for m in re.finditer(r'"|(?<=\w)\'(?=\w)|(?<!\w)\'|\'(?!\w)', txt)]
    sq=[s for s in sq if '=' not in s and 'src' not in s]
    if sq: print("STRAIGHT", n, len(sq), sq[:6])
    cd = len(re.findall(r'claude-draft', B[n]))
    if cd: print("PINK in", n, cd)
# morris
print("morris refs:", [n for n,b in B.items() if re.search(r'morris', b, re.I)], re.findall(r'.{30}morris.{30}', src, re.I)[:5])
# empty passages / passages with no outgoing link
noout=[n for n,b in B.items() if not re.search(r'\[\[|\(go-to|\(link-goto|\(link-reveal-goto|\(redirect|\(click-goto|goto\(|dss-passage|data-passage|href', b) and not any(t in T[n] for t in ("system","script","stylesheet","header","startup")) and n not in ("StoryInit",)]
print("NO OUTGOING:", noout)
