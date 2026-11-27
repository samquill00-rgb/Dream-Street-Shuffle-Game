import asyncio, sys
from playwright.async_api import async_playwright
URL='http://localhost:8732/waterloo-walk.html?v=6'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist','--mute-audio'])
        pg=await b.new_page(viewport={'width':1280,'height':720}); errs=[]; pg.on('pageerror',lambda e:errs.append('PAGEERROR '+str(e))); pg.on('console',lambda m: errs.append(m.type+': '+m.text[:160]) if m.type in('error','warning') else None)
        pg.on('framenavigated',lambda f: errs.append('NAVIGATED '+f.url))
        for stage in sys.argv[1:] or ['alley']:
            await pg.goto(URL+'&stage='+stage); await pg.wait_for_timeout(4000); await pg.mouse.click(640,300)
            for key in ['w','a','d','s','ArrowUp','ArrowLeft','ArrowRight','ArrowDown','Shift',' ']:
                await pg.keyboard.down(key); await pg.wait_for_timeout(1200); await pg.keyboard.up(key)
                r=await pg.evaluate("(()=>{const s=__walk.state(),c=__walk.cam.position.toArray();const gl=__walk.renderer.getContext();return JSON.stringify({id:s.id,s:+s.s.toFixed(1),lat:+s.lat.toFixed(2),cam:c.map(v=>+v.toFixed(2)),lost:gl.isContextLost()})})()")
                if 'null' in r or 'true' in r or 'NaN' in r: print(stage,key,r)
            # two at once
            await pg.keyboard.down('w'); await pg.keyboard.down('d'); await pg.wait_for_timeout(2500); await pg.keyboard.up('d'); await pg.keyboard.down('a'); await pg.wait_for_timeout(2500)
            r=await pg.evaluate("JSON.stringify([__walk.state().id,__walk.cam.position.toArray(),__walk.renderer.getContext().isContextLost(),__walk.renderer.info.memory,__walk.renderer.info.render.calls])"); print(stage,'after w+d,w+a',r)
            await pg.keyboard.up('w'); await pg.keyboard.up('a'); await pg.screenshot(path=f'keys-{stage}.jpg',type='jpeg',quality=60)
        print('\n'.join(errs[:15]) or 'no errors'); await b.close()
asyncio.run(main())
