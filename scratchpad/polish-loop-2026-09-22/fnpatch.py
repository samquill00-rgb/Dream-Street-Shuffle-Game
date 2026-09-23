"""fnpatch.py FUNCNAME  — reads a JSON list of [old, new] pairs on stdin and applies each
exactly once, only inside `function FUNCNAME() {` ... up to the next `function build` or EOF."""
import sys, json, re
TWEE="/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee"
fn=sys.argv[1]
src=open(TWEE,encoding="utf-8").read()
start=src.index("function %s() {"%fn)
m=re.search(r"\nfunction build\w+Scene\(\)", src[start+10:])
end=start+10+m.start() if m else len(src)
body=src[start:end]
pairs=json.load(sys.stdin)
for old,new in pairs:
    n=body.count(old)
    assert n==1, "expected 1 match, got %d for: %r"%(n, old[:80])
    body=body.replace(old,new)
open(TWEE,"w",encoding="utf-8").write(src[:start]+body+src[end:])
print("patched %s: %d edits"%(fn,len(pairs)))
