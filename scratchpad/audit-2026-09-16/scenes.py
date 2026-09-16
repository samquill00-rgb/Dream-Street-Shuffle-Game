import json, sys
from harness import *
RICH=('(set: $inisToldOfPillars to true)(set: $returnedPage to true)(set: $metCritic to true)(set: $knowsCecilCourt to true)'
      '(set: $knowsLackland to true)(set: $knowsCopperSecret to true)(set: $metDavy to true)(set: $metShana to true)'
      '(set: $haunts to (a: $haunt1, $haunt2))(set: $dreamKey to "ticket")(set: $keyTicket to "held")(set: $hasDrawing to true)'
      '(set: $bookTitle to "The Test Book")(set: $sobriety to 55)(set: $confidence to 60)')
SCENES=["Approach The Ginger Light","Approach The French","Approach The Coach","Approach The Pillars","Approach Lacklands Office",
 "Cecil Court Approach","The coast of Carthage","Green Sea Approach","Approach The Colony Room","Approach Ronnie Scott's",
 "Approach Coppers Lair","Approach Trisha's","Approach O'Flatterly","Third Pillar Portal","Approach Centre Point",
 "Approach Chinese Fish and Chips","Airport Pub","Nazca Approach","Easter Island Shore","Pyramid Mouth","The Plain of Chebar","White page"]
g=Game(); g.b.close(); g.b=g.pw.chromium.launch(headless=True, executable_path=CHROME, args=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"])
out=[]
for n in SCENES:
    try:
        p=g.page(n,RICH,audit_header=False); Game.click(p,"BEGIN",1200); Game.clear_overlays(p); p.wait_for_timeout(9000); Game.clear_overlays(p)
        info=p.evaluate("""() => ({canvases:[...document.querySelectorAll('canvas')].map(c=>c.width+'x'+c.height), iframes:document.querySelectorAll('iframe').length,
            text:(document.querySelector('tw-passage')?.innerText||'').slice(0,80).replace(/\\n/g,' '), errs:document.querySelectorAll('tw-error').length})""")
        fn="scenes/"+n.replace(" ","_").replace("'","")+".png"; p.screenshot(path=fn)
        r={"scene":n,**info,"js":[e.split(' @@')[0] for e in p._errs if 'decode' not in e and 'textContent' not in e]}
        p.close()
    except Exception as e:
        r={"scene":n,"exception":str(e)[:200]}
    out.append(r); print(json.dumps(r), flush=True)
json.dump(out,open("scenes/results.json","w"),indent=1); g.close(); print("DONE")
