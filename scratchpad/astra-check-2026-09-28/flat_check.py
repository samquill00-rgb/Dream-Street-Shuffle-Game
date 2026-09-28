"""Flat costs: hut fire -12/+10, blackout -30, clamped. PYTHONPATH=scratchpad/audit-2026-09-16 python3 flat_check.py"""
import sys
sys.argv = ["x", "scratchpad/astra-check-2026-09-28/flat", "1280", "none"]
exec(open("scratchpad/astra-check-2026-09-28/walk.py").read().split('if "hut" in SECTIONS:')[0])
for conf, sob, wc, ws in ((66, 25, 54, 35), (8, 2, 0, 12)):
    p = boot("Soho Hut Burns", DRUNK + "(set: $confidence to %d)(set: $sobriety to %d)" % (conf, sob)); v = st(p)["vars"]
    check(v["confidence"] == str(wc) and v["sobriety"] == str(ws) and v["hutBurnt"] == "true", "hut fire from %d/%d -> %s/%s (want %d/%d)" % (conf, sob, v["confidence"], v["sobriety"], wc, ws)); check(not st(p)["twErrors"], "no tw-error"); p.close()
for conf, wc in ((70, 40), (20, 0)):
    p = boot("The Blackout", "(set: $confidence to %d)(set: $sobriety to 5)(set: $blackouts to 0)(set: $drinksTonight to 5)" % conf); v = st(p)["vars"]
    check(v["confidence"] == str(wc), "blackout from %d -> %s (want %d)" % (conf, v["confidence"], wc)); check(not st(p)["twErrors"] and not errs(p), "no errors %s %s" % (st(p)["twErrors"], errs(p))); p.close()
p = boot("Colony drink choice", "(set: $sobriety to 70)(set: $drinksRound to 0)(set: $metDavy to true)(set: $knowsRonnies to true)(set: $visited's Colony to true)"); Game.click(p, "Vodka tonic", 1000); Game.clear_overlays(p); v = st(p)["vars"]
check(v["sobriety"] == "59", "ordinary drink still proportional: 70 -> %s (want 59)" % v["sobriety"]); p.close()
g.close(); print("FAILS", len(FAILS)); [print("  -", f) for f in FAILS]
