"""Curl the straight quotes in the twee's prose. Touches only text that reaches the screen as prose:
skips passage headers, script/stylesheet passages, <script>/<style> blocks, comments, HTML tags,
Harlowe macros (everything inside (name: ...), strings included), [[links]] whole, HTML entities,
and Harlowe's '' bold markup. Link labels and macro strings stay straight on purpose: the room
scripts match links by their exact text.
Usage: python3 curly.py [--write]   (dry run by default; prints a per-passage report)"""
import re, sys
PATH = "/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee"
src = open(PATH, encoding="utf-8").read()
WRITE = "--write" in sys.argv
hdr = re.compile(r'^:: (.+?)(?:\s+\[([^\]]*)\])?(?:\s+(\{[^\n]+\}))?\s*$', re.M)
ELISIONS = ("s", "em", "tis", "twas", "cause", "n", "til", "till", "bout", "round", "ere", "neath", "cos")
WORD = re.compile(r"[A-Za-z0-9À-ÿ]")

def skip_macro(s, i):
    """s[i] == '(' starting a Harlowe macro; return index after its matching ')'."""
    depth = 0; q = None; n = len(s)
    while i < n:
        c = s[i]
        if q:
            if c == "\\": i += 2; continue
            if c == q: q = None
        elif c == "'" and i > 0 and (s[i-1].isalnum() or s[i-1] == "_"): pass  # Harlowe's possessive 's, not a string
        elif c in "\"'": q = c
        elif c == "(": depth += 1
        elif c == ")":
            depth -= 1
            if depth == 0: return i + 1
        i += 1
    return n

def convert_prose(t, stats, prev="\n", nxt="\n"):
    out = []; n = len(t); i = 0
    def prev_char():
        for k in range(len(out) - 1, -1, -1):
            if out[k]: return out[k][-1]
        return prev
    while i < n:
        c = t[i]
        if c == "'":
            if t[i:i+2] == "''":  # Harlowe bold markup
                j = i
                while j < n and t[j] == "'": j += 1
                out.append(t[i:j]); i = j; continue
            p = prev_char(); nx = t[i+1] if i + 1 < n else nxt
            if WORD.match(p) and WORD.match(nx): r = "’"
            elif WORD.match(p): r = "’"
            elif WORD.match(nx) or nx in ".,;:!?‘\"“‘([<$…" :
                m = re.match(r"[A-Za-z]+", t[i+1:i+8])
                if nx.isdigit() or (m and m.group(0).lower() in ELISIONS and not WORD.match(t[i+1+len(m.group(0)):i+2+len(m.group(0))] or " ")): r = "’"
                else: r = "‘"
            else: r = "’"
            stats[r] = stats.get(r, 0) + 1; out.append(r); i += 1; continue
        if c == '"':
            p = prev_char(); nx = t[i+1] if i + 1 < n else nxt
            if p in " \n\t(—–-[>‘'/" or (not WORD.match(p) and p not in ".,;:!?’)" and WORD.match(nx)): r = "“"
            else: r = "”"
            stats[r] = stats.get(r, 0) + 1; out.append(r); i += 1; continue
        out.append(c); i += 1
    return "".join(out)

def convert_body(b, stats):
    out = []; i = 0; n = len(b)
    while i < n:
        if b.startswith("<!--", i):
            j = b.find("-->", i); j = n if j < 0 else j + 3; out.append(b[i:j]); i = j; continue
        for tag in ("<script", "<style"):
            if b.startswith(tag, i):
                end = "</script>" if tag == "<script" else "</style>"
                j = b.find(end, i); j = n if j < 0 else j + len(end); out.append(b[i:j]); i = j; break
        else:
            if b[i] == "<" and re.match(r"</?[A-Za-z!]", b[i:i+3] or "x"):
                # an html tag, honouring quoted attributes
                j = i + 1; q = None
                while j < n:
                    ch = b[j]
                    if q:
                        if ch == q: q = None
                    elif ch in "\"'": q = ch
                    elif ch == ">": j += 1; break
                    j += 1
                out.append(b[i:j]); i = j; continue
            if b.startswith("[[", i):
                j = b.find("]]", i); j = n if j < 0 else j + 2; out.append(b[i:j]); i = j; continue
            if b[i] == "(" and re.match(r"\([a-zA-Z][\w-]*:", b[i:i+40]):
                j = skip_macro(b, i); out.append(b[i:j]); i = j; continue
            if b[i] == "&":
                m = re.match(r"&#?\w+;", b[i:i+12])
                if m: out.append(m.group(0)); i += len(m.group(0)); continue
            # plain run up to the next special
            j = i + 1
            while j < n and b[j] not in "<[(&": j += 1
            out.append(convert_prose(b[i:j], stats, b[i-1] if i > 0 else "\n", b[j] if j < n else "\n")); i = j
            continue
        continue
    return "".join(out)

ms = list(hdr.finditer(src)); pieces = [src[:ms[0].start()]]; report = []; total = {}
for k, m in enumerate(ms):
    name, tags = m.group(1), (m.group(2) or "")
    body = src[m.end(): ms[k+1].start() if k+1 < len(ms) else len(src)]
    pieces.append(src[m.start():m.end()])
    if name in ("UserScript", "StoryData", "StoryTitle") or any(t in tags.split() for t in ("script", "stylesheet")):
        pieces.append(body); continue
    stats = {}
    nb = convert_body(body, stats)
    if nb != body:
        for key, v in stats.items(): total[key] = total.get(key, 0) + v
        report.append((sum(stats.values()), name, stats))
    pieces.append(nb)
new = "".join(pieces)
report.sort(reverse=True)
for cnt, name, stats in report: print("%4d  %-40s %s" % (cnt, name, stats))
print("passages changed:", len(report), "marks:", total)
if WRITE:
    open(PATH, "w", encoding="utf-8").write(new); print("written")
else:
    open("/tmp/curly-preview.twee", "w", encoding="utf-8").write(new); print("preview at /tmp/curly-preview.twee")
