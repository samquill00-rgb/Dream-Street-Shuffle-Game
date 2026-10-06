import sys, time
from playwright.sync_api import sync_playwright
OUT="/mnt/project-files/pyramid-harmony-2026-10-06/shots/"
URL="http://localhost:8777/Dream%20Street%20Shuffle.html?dev=1#dss-debug-jump=King%27s%20Chamber"
CHROME="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
def run(label, width, height, reduced, plan):
    with sync_playwright() as pw:
        b=pw.chromium.launch(executable_path=CHROME, args=["--autoplay-policy=no-user-gesture-required"])
        c=b.new_context(viewport={"width":width,"height":height}, reduced_motion="reduce" if reduced else "no-preference", device_scale_factor=1)
        p=c.new_page(); errs=[]
        p.on("pageerror", lambda e: errs.append(str(e)))
        p.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
        p.goto(URL); p.wait_for_selector("#dss-harmony canvas", timeout=30000); time.sleep(1.2)
        p.screenshot(path=OUT+label+"-01-chamber.png")
        cv=p.locator("#dss-harmony canvas"); box=cv.bounding_box()
        print(label, "canvas box", box, "banner/title:", p.locator(".hm-title").inner_text())
        for i,(kind,secs) in enumerate(plan):
            p.mouse.move(box["x"]+box["width"]/2, box["y"]+box["height"]/2); p.mouse.down(); t=time.time()
            if kind=="hit":
                while True:
                    s=p.evaluate("window._harmonyDev.state().semis")
                    if s>=5.85: break
                    time.sleep(0.02)
            elif kind=="hold": time.sleep(secs)
            if kind!="crack": p.mouse.up()
            else:
                while not p.evaluate("window._harmonyDev.state().result"): time.sleep(0.1)
            time.sleep(0.4); st=p.evaluate("window._harmonyDev.state()"); print(label, "attempt", i+1, kind, st)
            p.screenshot(path=OUT+label+"-02-attempt%d-%s.png"%(i+1, st["result"]))
            time.sleep(2.3)
        time.sleep(1.5)
        revealed=p.evaluate("document.getElementById('hm-after').classList.contains('hm-revealed')")
        marked=p.evaluate("!!document.querySelector('#hm-mark tw-hook') && !document.querySelector('#hm-mark tw-link')")
        print(label, "revealed", revealed, "flag link consumed", marked)
        p.screenshot(path=OUT+label+"-03-revealed.png")
        p.locator("tw-link", has_text="Keep listening").first.click(); time.sleep(1.5)
        p.screenshot(path=OUT+label+"-04-proportion.png", full_page=True)
        print(label, "tw-errors:", p.locator("tw-error").count(), "js errors:", [e for e in errs if "audio" not in e.lower() and "decod" not in e.lower()][:5])
        p.locator("tw-link", has_text="Back the way you came").first.click(); time.sleep(1.2)
        print(label, "after return, game still in DOM:", p.evaluate("!!document.getElementById('dss-harmony')"), "passage text:", p.locator("tw-passage").last.inner_text()[:90].replace("\n"," "))
        b.close()
which=sys.argv[1] if len(sys.argv)>1 else "all"
if which in("all","hit"): run("desktop-hit",1280,900,False,[("hit",0)])
if which in("all","miss"): run("desktop-miss",1280,900,False,[("hold",0.6),("crack",0),("hold",2.25)])
if which in("all","phone"): run("phone-hit",390,844,False,[("hold",0.5),("hit",0)])
if which in("all","reduced"): run("reduced-hit",1280,900,True,[("hit",0)])
