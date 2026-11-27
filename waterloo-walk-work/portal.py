import asyncio, pathlib
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist','--mute-audio'])
        pg=await b.new_page(viewport={'width':1440,'height':900}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type in('error','warning') else None)
        await pg.goto(pathlib.Path('../waterloo-walk.html').resolve().as_uri()+'?at=0.5'); await pg.wait_for_timeout(3000)
        await pg.screenshot(path='p1.jpg',type='jpeg',quality=80)
        await pg.evaluate("__walk.goto(0.575)"); await pg.wait_for_timeout(300); await pg.screenshot(path='p2.jpg',type='jpeg',quality=80)
        await pg.keyboard.down('w'); await pg.wait_for_timeout(3600); await pg.screenshot(path='p3.jpg',type='jpeg',quality=80); print(await pg.evaluate("JSON.stringify(__walk.state())"))
        for i in range(12):
            await pg.wait_for_timeout(400); s=await pg.evaluate("__walk.state()")
            if s['stage']==1: break
        await pg.screenshot(path='p4.jpg',type='jpeg',quality=80); print(s['stage'],s['blur'],round(s['s']))
        await pg.wait_for_timeout(2500); await pg.screenshot(path='p5.jpg',type='jpeg',quality=80); s=await pg.evaluate("__walk.state()"); print(s['stage'],repr(s['blur']),round(s['s']))
        await pg.evaluate("__walk.goto(0.965)"); await pg.wait_for_timeout(6000); print(await pg.evaluate("JSON.stringify([__walk.state().done,document.getElementById('end').className])"), errs[:5])
        await b.close()
asyncio.run(main())
