import asyncio, pathlib
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist','--mute-audio'])
        pg=await b.new_page(viewport={'width':1440,'height':900}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type in('error',) else None)
        await pg.goto(pathlib.Path('../waterloo-walk.html').resolve().as_uri()+'?stage=charing-cross'); await pg.wait_for_timeout(3500)
        print('errs',errs[:5]); print(await pg.evaluate("JSON.stringify(__walk.state())"))
        await pg.screenshot(path='c1.jpg',type='jpeg',quality=80)
        await pg.keyboard.down('w'); await pg.wait_for_timeout(11000)
        print('asking',await pg.evaluate("__walk.asking()"), await pg.evaluate("__walk.state().s")); await pg.screenshot(path='c2.jpg',type='jpeg',quality=80)
        await pg.click('#ask button'); print(await pg.evaluate("JSON.stringify(__walk.choices)"))
        await pg.wait_for_timeout(5500); await pg.screenshot(path='c3.jpg',type='jpeg',quality=80)
        await pg.wait_for_timeout(9000); await pg.screenshot(path='c4.jpg',type='jpeg',quality=80)
        fps=await pg.evaluate("new Promise(r=>{let n=0,t=performance.now();(function f(){n++;performance.now()-t<2000?requestAnimationFrame(f):r(n/2)})()})"); print('fps',fps)
        await pg.evaluate("__walk.goto(0.9)"); await pg.wait_for_timeout(700); await pg.screenshot(path='c5.jpg',type='jpeg',quality=80)
        for i in range(30):
            await pg.wait_for_timeout(300); s=await pg.evaluate("__walk.state()")
            if s['id']=='bridge': break
        print('then',s['id'],errs[:5])
        await b.close()
asyncio.run(main())
