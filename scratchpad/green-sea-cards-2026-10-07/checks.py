import asyncio, json
from playwright.async_api import async_playwright
URL='http://127.0.0.1:8790/Dream%20Street%20Shuffle.html#dss-debug-jump=Green%20Sea%20House%20of%20Cards'
async def main():
  out={}
  async with async_playwright() as pw:
    b=await pw.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
    # loss path, reduced motion
    c=await b.new_context(viewport={'width':1280,'height':900},reduced_motion='reduce'); p=await c.new_page(); errs=[]
    p.on('pageerror',lambda e:errs.append(str(e)))
    await p.goto(URL); await p.wait_for_timeout(2000); await p.locator('.dss-rules-play').click(); await p.wait_for_timeout(400)
    for _ in range(18):
      s=await p.evaluate('()=>_houseCardsDev.snapshot()')
      if s['ended']: break
      await p.evaluate('()=>{_houseCardsDev.angle(35);_houseCardsDev.place();}'); await p.wait_for_timeout(340)
    await p.evaluate("()=>{var c=document.querySelector('#dss-house-cards canvas').getBoundingClientRect();scrollBy(0,c.top-165);}")
    await p.wait_for_timeout(500); await p.screenshot(path='after/d-09-loss-reduced.png')
    await p.wait_for_timeout(3800)
    out['loss_returns_to']=await p.evaluate("()=>document.querySelector('tw-passage:last-of-type').getAttribute('name')||document.querySelector('tw-story').getAttribute('passage')||''")
    out['loss_text']=await p.evaluate("()=>({line2:document.body.innerText.includes('Just off the beach'),cards:!!document.querySelector('#dss-house-cards')})")
    out['loss_errors']=[e for e in errs if 'decode audio' not in e]
    await c.close()
    # phone overflow
    c=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True); p=await c.new_page()
    await p.goto(URL); await p.wait_for_timeout(2000); await p.locator('.dss-rules-play').click(); await p.wait_for_timeout(400)
    out['phone_overflow']=await p.evaluate('()=>document.documentElement.scrollWidth>innerWidth')
    await c.close(); await b.close()
  print(json.dumps(out,indent=1))
asyncio.run(main())
