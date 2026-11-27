import asyncio, sys
from playwright.async_api import async_playwright
URL='http://localhost:8732/waterloo-walk.html?mute=1'
async def main():
    async with async_playwright() as p:
        b=await p.webkit.launch()
        pg=await b.new_page(viewport={'width':1280,'height':720}); errs=[]; pg.on('pageerror',lambda e:errs.append('PAGEERROR '+str(e)[:200])); pg.on('console',lambda m: errs.append(m.type+': '+m.text[:200]) if m.type in('error','warning') else None)
        for stage in sys.argv[1:] or ['alley']:
            await pg.goto(URL+'&stage='+stage); await pg.wait_for_timeout(5000); await pg.mouse.click(640,300)
            st=lambda: pg.evaluate("(()=>{try{const s=__walk.state();return JSON.stringify({id:s.id,s:+s.s.toFixed(1),lost:__walk.renderer.getContext().isContextLost(),mem:__walk.renderer.info.memory,progs:__walk.renderer.info.programs.length,fault:document.getElementById('fault').textContent.slice(0,120)})}catch(e){return 'no hook: '+e+' | '+document.getElementById('fault').textContent}})()")
            print(stage,'loaded',await st())
            for key in ['w','d','a']:
                await pg.keyboard.down(key); await pg.wait_for_timeout(2500); await pg.keyboard.up(key); print(' ',key,await st())
            await pg.screenshot(path=f'wk-{stage}.png')
        print('\n'.join(errs[:12]) or 'no errors'); await b.close()
asyncio.run(main())
