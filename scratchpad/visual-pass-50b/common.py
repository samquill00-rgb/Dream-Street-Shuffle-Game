from pathlib import Path
root=Path('.');p=root/'Dream Street Shuffle.twee';check=root/'scratchpad/visual-pass-50b/checklist.md'
def mark(n):
 s=check.read_text();s=s.replace(f'- [ ] {n}.',f'- [x] {n}.');check.write_text(s)
def scope(name):
 s=p.read_text();a=s.index('// ====== INSIDE '+name);b=s.index('// ======',a+20);return s,a,b,s[a:b]
def replace(t,old,new):
 assert old in t,old[:130];return t.replace(old,new,1)
def save(s,a,b,t):p.write_text(s[:a]+t+s[b:])
