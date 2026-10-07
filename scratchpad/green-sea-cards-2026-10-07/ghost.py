import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
    for name in ['Dream%20Street%20Shuffle.html']:
      p=await (await b.new_context(viewport={'width':1280,'height':900})).new_page()
      await p.goto('http://127.0.0.1:8790/'+name+'#dss-debug-jump=Green%20Sea%20House%20of%20Cards'); await p.wait_for_timeout(2000)
      await p.locator('.dss-rules-play').click(); await p.wait_for_timeout(400)
      for _ in range(30):
        s=await p.evaluate('()=>_houseCardsDev.snapshot()')
        if s['active']<0: break
        await p.evaluate('k=>{_houseCardsDev.angle(k);_houseCardsDev.place();}', 0 if s['slots'][s['active']]['kind']=='bridge' else 70); await p.wait_for_timeout(340)
      await p.locator('.cards-place').click()
      await p.wait_for_function("()=>!document.querySelector('tw-passage:last-of-type #dss-house-cards')",timeout=15000)
      for k in range(4):
        await p.screenshot(path=f'ghost-{name[:3]}-{k}.png'); await p.wait_for_timeout(150)
    await b.close()
asyncio.run(main())
