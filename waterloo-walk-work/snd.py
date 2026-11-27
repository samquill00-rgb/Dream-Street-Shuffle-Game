import asyncio, subprocess, time
from playwright.async_api import async_playwright
async def main():
    srv=subprocess.Popen(['python3','-m','http.server','8799','--bind','127.0.0.1'],cwd='..',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
    try:
        async with async_playwright() as p:
            b=await p.chromium.launch(args=['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist','--mute-audio'])
            pg=await b.new_page(viewport={'width':1440,'height':900}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
            await pg.goto('http://127.0.0.1:8799/waterloo-walk.html'); await pg.wait_for_timeout(4000)
            snd="(()=>{const o=__walk.sound();return o.clip+' '+Object.keys(o).filter(k=>o[k]&&o[k].vol>0).map(k=>k+'@'+o[k].t+'s v'+o[k].vol).join(', ')})()"
            print('before press:',await pg.evaluate(snd)); await pg.keyboard.down('w'); await pg.wait_for_timeout(2500); print('alley:',await pg.evaluate(snd))
            await pg.evaluate("__walk.enter(1)"); await pg.wait_for_timeout(2500); print('chx start:',await pg.evaluate(snd))
            await pg.wait_for_timeout(8000); print('at fridge:',await pg.evaluate("__walk.asking()"),await pg.evaluate(snd)); await pg.click('#ask button'); await pg.wait_for_timeout(9000); print('on concourse:',await pg.evaluate(snd))
            total=0; names=[]
            for i in range(8):
                await pg.evaluate(f"__walk.enter({i})"); s=await pg.evaluate("__walk.state()"); d=(s['to']-s['from'])/(1 if s['id']=='train' else 1.55); total+=d; names.append(f"{s['id']} {d:.0f}s")
                await pg.wait_for_timeout(2600); print(' ',s['id'],'->',await pg.evaluate(snd))
            print('walk time:',', '.join(names),'= %.0f s'%total); print(errs[:4]); await b.close()
    finally: srv.terminate()
asyncio.run(main())
