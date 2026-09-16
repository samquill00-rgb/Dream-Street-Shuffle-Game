#!/usr/bin/env python3
"""Static audit of Dream Street Shuffle.twee: passages, links, macros, scripts."""
import re, sys, json, subprocess, os, collections

TWEE = "/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee"
src = open(TWEE, encoding="utf-8").read()

hdr = re.compile(r'^:: (.+?)(?:\s+\[([^\]]*)\])?(?:\s+(\{[^\n]+\}))?\s*$', re.M)
heads = list(hdr.finditer(src))
passages = {}
order = []
for i, h in enumerate(heads):
    name = h.group(1).strip()
    tags = (h.group(2) or "").split()
    body = src[h.end():heads[i+1].start() if i+1 < len(heads) else len(src)]
    # strip leading newline
    if body.startswith("\n"):
        body = body[1:]
    passages[name] = {"tags": tags, "body": body, "line": src[:h.start()].count("\n")+1}
    order.append(name)

names = set(passages)
report = collections.OrderedDict()
report["passage_count"] = len(order)
dups = [n for n, c in collections.Counter(order).items() if c > 1]
report["duplicates"] = dups

def strip_html_comments(t):
    return re.sub(r'<!--[\s\S]*?-->', '', t)

# ---- link targets ----
missing = []
refs = collections.defaultdict(set)  # target -> set(sources)
for name, p in passages.items():
    if "script" in p["tags"] or "stylesheet" in p["tags"]:
        continue
    body = strip_html_comments(p["body"])
    # strip <script> blocks for link scanning
    body_nojs = re.sub(r'<script\b[^>]*>[\s\S]*?</script>', '', body)
    for m in re.finditer(r'\[\[([^\]\n]+?)\]\]', body_nojs):
        t = m.group(1)
        if "->" in t: t = t.split("->")[-1]
        elif "<-" in t: t = t.split("<-")[0]
        elif "|" in t: t = t.split("|")[-1]
        t = t.strip()
        refs[t].add(name)
        if t not in names:
            missing.append((name, "[[ ]]", t))
    # macros with string literal passage names
    for m in re.finditer(r'\((?:go-to|goto|display|link-goto|link-reveal-goto|click-goto|mouseover-goto|mouseout-goto|link-undo|redirect):\s*([^)]*)\)', body_nojs):
        mac = m.group(0).split(":")[0][1:]
        args = m.group(1)
        strs = re.findall(r'"((?:[^"\\]|\\.)*)"', args)
        if not strs:
            continue
        if mac in ("go-to", "goto", "display", "redirect"):
            t = strs[0]
        else:
            t = strs[-1]
        # skip variables / expressions
        if mac in ("link-goto","link-reveal-goto","click-goto") and len(strs) < 2:
            # (link-goto: "Text") uses text as passage name
            t = strs[0]
        refs[t].add(name)
        if t not in names:
            missing.append((name, mac, t))
report["missing_link_targets"] = missing

# ---- orphans (never referenced, not start/special) ----
special = {"StoryInit","StoryTitle","StoryData","UserScript","UserStylesheet","Start"}
orphans = []
for name, p in passages.items():
    if name in special or p["tags"] & {"script","stylesheet","startup","header","footer","debug-header","debug-footer","debug-startup"} if isinstance(p["tags"], set) else set(p["tags"]) & {"script","stylesheet","startup","header","footer","debug-header","debug-footer","debug-startup"}:
        continue
    if name not in refs:
        # check quoted mention anywhere in source (JS goto etc)
        if ('"%s"' % name) in src or ("'%s'" % name) in src:
            continue
        orphans.append(name)
report["orphans_unreferenced"] = orphans

# ---- script blocks syntax ----
js_errors = []
scratch = os.path.dirname(os.path.abspath(__file__))
n_scripts = 0
for name, p in passages.items():
    if "stylesheet" in p["tags"]:
        continue
    if "script" in p["tags"]:
        blocks = [p["body"]]
    else:
        blocks = re.findall(r'<script\b[^>]*>([\s\S]*?)</script>', strip_html_comments(p["body"]))
    for k, js in enumerate(blocks):
        n_scripts += 1
        fn = os.path.join(scratch, "jscheck_%d.js" % n_scripts)
        open(fn, "w").write(js)
        r = subprocess.run(["node", "--check", fn], capture_output=True, text=True)
        if r.returncode != 0:
            js_errors.append((name, k, r.stderr.strip()[:400]))
        os.remove(fn)
report["script_blocks"] = n_scripts
report["script_errors"] = js_errors

# ---- stylesheet brace balance ----
css = passages.get("UserStylesheet", {}).get("body", "")
report["css_brace_balance"] = css.count("{") - css.count("}")

# ---- trailing backslash on last line ----
trailing_bs = [n for n, p in passages.items() if p["body"].rstrip("\n").endswith("\\") and "script" not in p["tags"] and "stylesheet" not in p["tags"]]
report["trailing_backslash_last_line"] = trailing_bs

# ---- harlowe hook / paren balance (rough, outside script/style) ----
balance = []
for name, p in passages.items():
    if "script" in p["tags"] or "stylesheet" in p["tags"]:
        continue
    b = strip_html_comments(p["body"])
    b = re.sub(r'<script\b[^>]*>[\s\S]*?</script>', '', b)
    b = re.sub(r'<style\b[^>]*>[\s\S]*?</style>', '', b)
    b = re.sub(r'<svg\b[\s\S]*?</svg>', '', b)
    # remove strings
    b2 = re.sub(r'"(?:[^"\\]|\\.)*"', '""', b)
    b2 = re.sub(r"'(?:[^'\\]|\\.)*'", "''", b2)
    po = b2.count("(") - b2.count(")")
    sq = b2.count("[") - b2.count("]")
    if po or sq:
        balance.append((name, po, sq))
report["paren_bracket_imbalance"] = balance

# ---- variables: set vs read ----
setvars = set(re.findall(r'\(set:\s*\$(\w+)', src))
setvars |= set(re.findall(r'\(put:[^)]*?into\s+\$(\w+)', src))
allvars = set(re.findall(r'\$(\w+)', src))
# exclude those inside JS ${...}? crude: exclude names that only occur in script passage
script_src = "".join(p["body"] for p in passages.values() if "script" in p["tags"])
readonly = sorted(v for v in allvars - setvars if not re.match(r'^\d', v) and v not in ("",))
report["vars_read_never_set"] = readonly

# ---- the tag audit ----
tagcount = collections.Counter(t for p in passages.values() for t in p["tags"])
report["tags"] = dict(tagcount)

# ---- StoryData start passage ----
sd = passages.get("StoryData", {}).get("body", "")
m = re.search(r'"start"\s*:\s*"([^"]+)"', sd)
report["start_passage"] = m.group(1) if m else None
report["start_exists"] = (m.group(1) in names) if m else False

print(json.dumps(report, indent=1, ensure_ascii=False))
