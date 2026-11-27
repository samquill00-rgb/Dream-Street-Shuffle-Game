import sys, asyncio, pathlib
from playwright.async_api import async_playwright
shots=[a.split(',') for a in sys.argv[1:]]  # name,at,yaw,pitch
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist','--mute-audio'])
        pg=await b.new_page(viewport={'width':1440,'height':900})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
        await pg.goto(pathlib.Path('../waterloo-walk.html').resolve().as_uri())
        await pg.wait_for_timeout(3500)
        for n,at,yaw,pitch in shots:
            await pg.evaluate(f"__walk.goto({at});__walk.look({yaw},{pitch})")
            await pg.wait_for_timeout(500)
            await pg.screenshot(path=f'shot-{n}.jpg',type='jpeg',quality=80)
        print('errors',errs[:6]); print(await pg.evaluate("JSON.stringify(__walk.state())"))
        await b.close()
asyncio.run(main())
