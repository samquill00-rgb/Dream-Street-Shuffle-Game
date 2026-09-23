"""Put the cut placeholder prose (cuts.py, project files) into the twee in place of the long
pink placeholders, keeping the claude-draft class. Survey mode by default; --write applies.
Safety: every sentence of a cut must already exist in the long group it replaces (the cuts kept
sentences, they did not rewrite), else the group is skipped and listed."""
import re, sys, json
sys.path.insert(0, "/mnt/project-files/.notes/dream-loops-build")
from cuts import CUTS
TWEE = "/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee"
src = open(TWEE, encoding="utf-8").read()
hdr = re.compile(r'^:: (.+?)(?:\s+\[([^\]]*)\])?(?:\s+(\{[^\n]+\}))?\s*$', re.M)
ms = list(hdr.finditer(src))
spans = {}
for i, m in enumerate(ms):
    spans[m.group(1)] = (m.end(), ms[i+1].start() if i+1 < len(ms) else len(src))
DIV = re.compile(r'<div class="claude-draft">(.*?)</div>', re.S)
LINK = re.compile(r'\[\[[^\]]*\]\]|\(link[^:]*:[^)]*\)\[[^\]]*\]')
def norm(t):
    t = t.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    t = re.sub(r'\s+', ' ', t).strip()
    return t
def groups_of(body):
    """yield (start, end, text) of prose runs inside pink divs, in order"""
    for dm in DIV.finditer(body):
        inner = dm.group(1); base = dm.start(1)
        pos = 0
        for lm in list(LINK.finditer(inner)) + [None]:
            end = lm.start() if lm else len(inner)
            chunk = inner[pos:end]
            if norm(re.sub(r'<[^>]+>', '', chunk)):
                yield (base + pos, base + end, chunk)
            pos = lm.end() if lm else end
write = "--write" in sys.argv
edits = []
for name, cuts in CUTS.items():
    if name not in spans: print("MISSING passage", name); continue
    a, b = spans[name]; body = src[a:b]
    gs = list(groups_of(body))
    if len(gs) == len(cuts) - 1 and cuts and cuts[0] is None: cuts = cuts[1:]  # Third Pillar Portal: the id'd steer div is kept
    flag = ""
    if len(gs) != len(cuts): flag = f"  <-- group count mismatch: twee {len(gs)} vs cuts {len(cuts)}"
    print(f"{name}: {len(gs)} pink groups, {len(cuts)} cuts{flag}")
    if flag: continue
    for (s, e, chunk), cut in zip(gs, cuts):
        if cut is None: continue
        plain = norm(re.sub(r'<[^>]+>', '', chunk))
        hooks = '(if:' in chunk or '(else' in chunk or '(unless:' in chunk
        # every cut sentence (minus markup) must be in the original
        ok = True
        cw = set(re.findall(r"[a-z']+", norm(" ".join(cut)).lower())); ow = set(re.findall(r"[a-z']+", plain.lower()))
        novel = sorted(cw - ow)
        if len(novel) > max(3, len(cw)//8): ok = False; print("   ! too many new words:", novel[:12])
        elif novel: print("   (new words:", ", ".join(novel), ")")
        comments = re.findall(r'<!--.*?-->', chunk, re.S)
        if re.sub(r'<!--.*?-->', '', chunk, flags=re.S).count('<'): print("   ! chunk has markup; manual:", re.findall(r'<[^>]+>', chunk)[:4]); ok = False
        if '[' in " ".join(cut): print("   ! cut has bracket markup; manual"); ok = False
        if hooks: print("   ! group has hooks; manual:", chunk.strip()[:120].replace("\n", " ")); ok = False
        if ok:
            new = "\n" + "\n\n".join(cut) + "".join(comments) + "\n"
            edits.append((a + s, a + e, new, name))
            print(f"   ok: {len(plain)} chars -> {len(norm(new))} chars")
if write:
    out = src
    for s, e, new, name in sorted(edits, reverse=True):
        out = out[:s] + new + out[e:]
    open(TWEE, "w", encoding="utf-8").write(out)
    print("WROTE", len(edits), "groups")
