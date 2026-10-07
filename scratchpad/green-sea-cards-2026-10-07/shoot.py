import sys, json, asyncio
from playwright.async_api import async_playwright
OUT = sys.argv[1]; MOBILE = len(sys.argv) > 2 and sys.argv[2] == 'phone'
URL = 'http://127.0.0.1:8790/Dream%20Street%20Shuffle.html#dss-debug-jump=Green%20Sea%20House%20of%20Cards'
async def main():
  async with async_playwright() as pw:
    b = await pw.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args=['--autoplay-policy=no-user-gesture-required'])
    ctx = await b.new_context(**({'viewport':{'width':390,'height':844},'is_mobile':True,'has_touch':True,'device_scale_factor':2} if MOBILE else {'viewport':{'width':1280,'height':900}}))
    p = await ctx.new_page(); errs=[]
    p.on('pageerror', lambda e: errs.append(str(e)))
    await p.goto(URL); await p.wait_for_timeout(2500)
    await p.screenshot(path=f'{OUT}-01-rules.png')
    await p.locator('.dss-rules-play').click(); await p.wait_for_timeout(600)
    root = p.locator('#dss-house-cards')
    await p.evaluate("()=>{var c=document.querySelector('#dss-house-cards canvas').getBoundingClientRect();scrollBy(0,c.top-(innerWidth<600?140:165));}"); await p.wait_for_timeout(300)
    await p.screenshot(path=f'{OUT}-02-start.png', full_page=False)
    async def put(a):
      await p.evaluate('a=>{_houseCardsDev.angle(a);_houseCardsDev.place();}', a); await p.wait_for_timeout(350)
    await put(70); await put(70); await put(70)
    await p.evaluate('()=>_houseCardsDev.angle(62)'); await p.wait_for_timeout(200)
    await p.screenshot(path=f'{OUT}-03-building.png')
    # roar
    await p.evaluate('()=>_houseCardsDev.roar()'); await p.wait_for_timeout(120)
    await p.screenshot(path=f'{OUT}-04-roar.png')
    await p.wait_for_timeout(500)
    # a slip
    await p.evaluate('()=>{_houseCardsDev.angle(40);_houseCardsDev.place();}'); await p.wait_for_timeout(250)
    await p.screenshot(path=f'{OUT}-05-slip.png')
    await p.wait_for_timeout(400)
    for _ in range(30):
      s = await p.evaluate('()=>_houseCardsDev.snapshot()')
      if s['active'] < 0 or s['ended']: break
      await put(0 if s['slots'][s['active']]['kind']=='bridge' else 70)
    await p.screenshot(path=f'{OUT}-06-built.png')
    s = await p.evaluate('()=>_houseCardsDev.snapshot()')
    if not s['ended']:
      await p.locator('.cards-place').click(); await p.wait_for_timeout(1600)
      await p.screenshot(path=f'{OUT}-07-end.png')
    await p.wait_for_timeout(3500)
    await p.screenshot(path=f'{OUT}-08-back.png')
    print(json.dumps({'errors':errs,'standing':s['standing'],'used':s['used']}))
    await b.close()
asyncio.run(main())
