import sys
W = int(sys.argv[1]); tag = sys.argv[2]
sys.argv = ["x", "scratchpad/astra-check-2026-09-28/fix", str(W), "none"]
exec(open("scratchpad/astra-check-2026-09-28/walk.py").read().split('if "hut" in SECTIONS:')[0])
p = boot("Alley: Soho Square", DRUNK); P(p, "Sam: cross the garden to the hut", 800); wait_scene(p, "sq-wrap"); p.wait_for_timeout(8000)
p.screenshot(path="scratchpad/astra-check-2026-09-28/fix/%s-%d-idle.png" % (tag, W))
for obj in ("gate", "king", "door"):
    p.evaluate("(o) => [...document.querySelectorAll('#sq-wrap button')].find(b => b.textContent.includes(o)).click()", obj)
    for _ in range(80):
        if p.evaluate("() => document.getElementById('sq-wrap').dataset.cam === 'inspect'"): break
        p.wait_for_timeout(250)
    p.wait_for_timeout(500); p.screenshot(path="scratchpad/astra-check-2026-09-28/fix/%s-%d-%s.png" % (tag, W, obj))
    p.keyboard.press("Escape")
    for _ in range(80):
        if p.evaluate("() => document.getElementById('sq-wrap').dataset.cam === 'idle'"): break
        p.wait_for_timeout(250)
print("done", errs(p)); p.close(); g.close()
