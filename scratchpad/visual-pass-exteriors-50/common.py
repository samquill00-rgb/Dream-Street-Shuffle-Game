from pathlib import Path
root=Path('.');p=root/'Dream Street Shuffle.twee';out=root/'scratchpad/visual-pass-exteriors-50';check=out/'checklist.md'
def mark(n):
 s=check.read_text().replace(f'- [ ] {n}.',f'- [x] {n}.');check.write_text(s)
def replace(t,old,new):
 assert old in t,old[:100];return t.replace(old,new,1)
def scope(start,end):
 s=p.read_text();a=s.index(start);b=s.index(end,a+len(start));return s,a,b,s[a:b]
def save(s,a,b,t):p.write_text(s[:a]+t+s[b:])
