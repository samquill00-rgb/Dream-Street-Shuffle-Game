import json, sys
new = {r["passage"]: r for r in json.load(open(sys.argv[1]))}
base = {r["passage"]: r for r in json.load(open(sys.argv[2]))}
def sig(r):
    s = set()
    for k in ("overlaps", "spill", "clipped"):
        for x in r.get(k, []): s.add((k, json.dumps(x, sort_keys=True)[:160]))
    for e in r.get("jsErrors", []):
        if "textContent" not in e: s.add(("js", e[:120]))
    if r.get("exception"): s.add(("exception", r["exception"][-120:]))
    return s
newflags = {}; fixed = {}
for n, r in new.items():
    b = base.get(n); ns = sig(r); bs = sig(b) if b else set()
    if ns - bs: newflags[n] = sorted(ns - bs)
    if bs - ns: fixed[n] = len(bs - ns)
print("passages swept:", len(new), "baseline:", len(base), "not in baseline:", [n for n in new if n not in base])
print("\nNEW FLAGS (not in the 25 September baseline):")
for n, f in newflags.items():
    print(" ", n, "->", new[n].get("at"))
    for k, v in f: print("     ", k, v[:150])
print("\nflagged passages whose flags have gone since the baseline:", len(fixed))
