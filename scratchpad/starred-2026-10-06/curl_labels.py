"""Curl the straight apostrophes in link labels and in every matcher that names them. Dry run unless --write."""
import re, sys
P='/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee'
s=open(P,encoding='utf-8').read(); WRITE='--write' in sys.argv
hdr=re.compile(r'^:: (.+?)(?:\s+\[([^\]]*)\])?(?:\s+(\{[^\n]+\}))?\s*$',re.M)
def curl(lbl):
    out=[]
    for i,ch in enumerate(lbl):
        if ch=="'":
            prev=lbl[i-1] if i>0 else ' '
            out.append('‘' if prev in ' [(…"“' or i==0 else '’')
        else: out.append(ch)
    return ''.join(out)
# 1. the labels, found as the scan found them
ms=list(hdr.finditer(s)); labels=set()
for i,m in enumerate(ms):
    name=m.group(1); tags=(m.group(2) or '')
    if 'script' in tags or 'stylesheet' in tags or name=='StoryData': continue
    body=s[m.end():ms[i+1].start() if i+1<len(ms) else len(s)]
    for lm in re.finditer(r'\[\[(.+?)\]\]',body):
        inner=lm.group(1).lstrip('[')
        if '<-' in inner: lbl=inner.split('<-',1)[1]
        elif '->' in inner: lbl=inner.split('->',1)[0]
        elif '|' in inner: lbl=inner.split('|',1)[0]
        else: lbl=inner
        if "'" in lbl and '],[' not in lbl: labels.add(lbl)
    for lm in re.finditer(r'\((?:link|link-reveal|link-repeat|link-goto|link-replace|link-rerun|link-show|click|click-replace|click-goto|link-reveal-goto):\s*"((?:[^"\\]|\\.)*)"',body):
        if "'" in lm.group(1): labels.add(lm.group(1))
labels=sorted(labels, key=len, reverse=True)
before={l: s.count(l) for l in labels}
# 2. passages: curl the label inside link syntax only
def fix_passages(s):
    out=[]; pos=0
    for i,m in enumerate(ms):
        name=m.group(1); tags=(m.group(2) or '')
        st=m.end(); en=ms[i+1].start() if i+1<len(ms) else len(s)
        out.append(s[pos:st]); body=s[st:en]; pos=en
        if 'script' in tags or 'stylesheet' in tags or name=='StoryData': out.append(body); continue
        def link_sub(lm):
            inner=lm.group(1)
            for l in labels:
                if l in inner and "'" in l:
                    # curl the label part only (text before | or ->, or after <-)
                    if '<-' in inner: t,lab=inner.split('<-',1); inner=t+'<-'+lab.replace(l,curl(l))
                    elif '->' in inner: lab,t=inner.split('->',1); inner=lab.replace(l,curl(l))+'->'+t
                    elif '|' in inner: lab,t=inner.split('|',1); inner=lab.replace(l,curl(l))+'|'+t
                    else: inner=inner.replace(l,curl(l))
            return '[['+inner+']]'
        body=re.sub(r'\[\[(.+?)\]\]', link_sub, body)
        def macro_sub(lm):
            lab=lm.group(2)
            return lm.group(0) if "'" not in lab or lab not in labels else '('+lm.group(1)+': "'+curl(lab)+'"'
        body=re.sub(r'\((link|link-reveal|link-repeat|link-goto|link-replace|link-rerun|link-show|click|click-replace|click-goto|link-reveal-goto):\s*"((?:[^"\\]|\\.)*)"', macro_sub, body)
        out.append(body)
    out.append(s[pos:]); return ''.join(out)
s2=fix_passages(s)
# 3. the matchers in the UserScript, and the three approach-scene buttons
M=[('byText(["\'I can walk on water\'"])', 'byText(["‘I can walk on water’"])'), ('k.byText([\'Say nothing\', "Give him Red\'s name", "Give him John\'s name"])', 'k.byText([\'Say nothing\', "Give him Red’s name", "Give him John’s name"])'), ('byText(["⟡ LORE: Ronnie Scott\'s ⟡", "LORE: Ronnie Scott\'s"])', 'byText(["⟡ LORE: Ronnie Scott’s ⟡", "LORE: Ronnie Scott’s"])'), ('k.byText([\'Back to the street\', "Ronnie Scott\'s is nearby."])', 'k.byText([\'Back to the street\', "Ronnie Scott’s is nearby."])'), ("rx:/^St Anne's Court$/i", "rx:/^St Anne['’]s Court$/i"), ("rx:/^Bateman's Buildings$/i", "rx:/^Bateman['’]s Buildings$/i"), ("rx:/^Walker's Court$/i", "rx:/^Walker['’]s Court$/i"), ("rx:/Cecil Court|O'Flatterly|antiquarian/i", "rx:/Cecil Court|O['’]Flatterly|antiquarian/i"), ("if (/Cecil Court|Watkins|O'Flatterly|Rescue the page|Return the page/i.test(name))", "if (/Cecil Court|Watkins|O['’]Flatterly|Rescue the page|Return the page/i.test(name))"), ("loBtn.textContent = 'ENTER LACKLAND\\'S OFFICE';", "loBtn.textContent = 'ENTER LACKLAND’S OFFICE';"), ('rsBtn.textContent = "ENTER RONNIE SCOTT\\u0027S";', 'rsBtn.textContent = "ENTER RONNIE SCOTT’S";'), ('ofBtn.textContent = "ENTER O\'FLATTERLY\'S";', 'ofBtn.textContent = "ENTER O’FLATTERLY’S";'), ('data-go="I\'ll look for it"', 'data-go="I’ll look for it"'), ('name:"RONNIE SCOTT\'S",             label:"Ronnie Scott\'s",', 'name:"RONNIE SCOTT’S",             label:"Ronnie Scott’s",'), ('name:"LACKLAND\'S OFFICE",          label:"Lackland\'s",', 'name:"LACKLAND’S OFFICE",          label:"Lackland’s",'), ('name:"TRISHA\'S",                   label:"Trisha\'s",', 'name:"TRISHA’S",                   label:"Trisha’s",'), ('name:"BATEMAN\'S BUILDINGS",', 'name:"BATEMAN’S BUILDINGS",'), ('name:"ST ANNE\'S COURT",', 'name:"ST ANNE’S COURT",'), ('name:"WALKER\'S COURT",', 'name:"WALKER’S COURT",')]
for a,b in M:
    n=s2.count(a); assert n in (1,2), (n,a); s2=s2.replace(a,b)
print('labels:',len(labels))
for l in labels: print('  %-46r before %2d  after %2d  curled %2d'%(l, before[l], s2.count(l), s2.count(curl(l))))
print('remaining straight occurrences, with line context:')
for l in labels:
    for mm in re.finditer(re.escape(l), s2):
        ln=s2.count('\n',0,mm.start())+1; print('  line %d: %s'%(ln, s2.split('\n')[ln-1].strip()[:150]))
if WRITE: open(P,'w',encoding='utf-8').write(s2); print('WRITTEN')
