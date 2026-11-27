import asyncio, pathlib
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist','--mute-audio'])
        pg=await b.new_page(viewport={'width':1440,'height':900}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type in('error',) else None)
        await pg.goto(pathlib.Path('../waterloo-walk.html').resolve().as_uri()); await pg.wait_for_timeout(3500)
        print('errs',errs[:5]); print(await pg.evaluate("JSON.stringify(__walk.state())"))
        await pg.screenshot(path='s1.jpg',type='jpeg',quality=80)
        for n,f in (('s2',0.45),('s3',0.8),('s4',0.93)):
            await pg.evaluate(f"__walk.goto({f})"); await pg.wait_for_timeout(400); await pg.screenshot(path=n+'.jpg',type='jpeg',quality=80)
        await pg.keyboard.down('w')
        for i in range(30):
            await pg.wait_for_timeout(300); s=await pg.evaluate("__walk.state()")
            if s['stage']==1: break
        print('entered',s['id'],s['blur']); await pg.wait_for_timeout(2600); await pg.screenshot(path='s5.jpg',type='jpeg',quality=80)
        fps=await pg.evaluate("new Promise(r=>{let n=0,t=performance.now();(function f(){n++;performance.now()-t<2000?requestAnimationFrame(f):r(n/2)})()})"); print('bridge fps',fps)
        await pg.evaluate("__walk.goto(0.99)"); await pg.wait_for_timeout(1500); s=await pg.evaluate("__walk.state()"); print(s['id'])
        await pg.evaluate("__walk.goto(0.99)"); await pg.wait_for_timeout(5500); print(await pg.evaluate("JSON.stringify([__walk.state().done,document.getElementById('end').className])"), errs[:5])
        await pg.evaluate("__walk.enter(0)"); fps=await pg.evaluate("new Promise(r=>{let n=0,t=performance.now();(function f(){n++;performance.now()-t<2000?requestAnimationFrame(f):r(n/2)})()})"); print('alley fps',fps)
        await b.close()
asyncio.run(main())
