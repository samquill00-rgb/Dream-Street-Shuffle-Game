import asyncio, pathlib
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist','--mute-audio'])
        for (w,h,n) in [(1440,900,'wide'),(1536,730,'short'),(390,844,'phone')]:
            pg=await b.new_page(viewport={'width':w,'height':h}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(pathlib.Path('../waterloo-walk.html').resolve().as_uri()+'?at=0.585'); await pg.wait_for_timeout(3000)
            await pg.screenshot(path=f'fit-{n}.jpg',type='jpeg',quality=75)
            s0=await pg.evaluate("__walk.state().s"); fps=await pg.evaluate("new Promise(r=>{let n=0,t=performance.now();(function f(){n++;performance.now()-t<2000?requestAnimationFrame(f):r(n/2)})()})")
            await pg.keyboard.down('w'); await pg.wait_for_timeout(4000); s1=await pg.evaluate("__walk.state().s"); await pg.wait_for_timeout(5500)
            st=await pg.evaluate("JSON.stringify({done:__walk.state().done,end:document.getElementById('end').classList.contains('show'),scroll:document.documentElement.scrollHeight>innerHeight,hint:document.getElementById('hint').className})")
            print(n,'fps',fps,'walked',round(s1-s0,1),st,errs); await pg.close()
        await b.close()
asyncio.run(main())
