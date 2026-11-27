import asyncio, pathlib, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist','--mute-audio'])
        pg=await b.new_page(viewport={'width':1440,'height':900}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type in('error',) else None)
        await pg.goto(pathlib.Path('../waterloo-walk.html').resolve().as_uri()+'?stage=tunnel'); await pg.wait_for_timeout(4500)
        print('errs',errs[:5])
        for i,(sid,fr) in enumerate([('tunnel',[0.15,0.6]),('arch',[0.1,0.75]),('concourse',[0.12,0.6]),('platform',[0.2,0.8])]):
            await pg.evaluate(f"__walk.enter({3+i})")
            for j,f in enumerate(fr):
                await pg.evaluate(f"__walk.goto({f})"); await pg.wait_for_timeout(500); await pg.screenshot(path=f'w-{sid}{j}.jpg',type='jpeg',quality=78)
            fps=await pg.evaluate("new Promise(r=>{let n=0,t=performance.now();(function f(){n++;performance.now()-t<1500?requestAnimationFrame(f):r(n/1.5)})()})"); print(sid,'fps',round(fps), await pg.evaluate("__walk.state().id"))
        await pg.evaluate("__walk.choices.cans=true;__walk.enter(7)"); await pg.wait_for_timeout(1500); await pg.screenshot(path='w-train0.jpg',type='jpeg',quality=78)
        await pg.evaluate("__walk.look(-0.9,-0.1)"); await pg.wait_for_timeout(9000); await pg.screenshot(path='w-train1.jpg',type='jpeg',quality=78)
        await pg.wait_for_timeout(14000); await pg.screenshot(path='w-train2.jpg',type='jpeg',quality=78)
        await pg.wait_for_timeout(19000); print(await pg.evaluate("JSON.stringify([__walk.state().id,__walk.state().done,document.getElementById('end').className])"), errs[:5])
        await b.close()
asyncio.run(main())
