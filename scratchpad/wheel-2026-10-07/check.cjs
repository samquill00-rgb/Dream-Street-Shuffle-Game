const {chromium}=require('/Users/samquill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 let results=[];
 for(const [width,reduced] of [[1280,false],[390,false],[390,true]]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:2,reducedMotion:reduced?'reduce':'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:8777/Dream%20Street%20Shuffle.html?dev=1#dss-debug-jump=The%20Wheel');
  const link=page.locator('tw-link').filter({hasText:/^Draw it down$/});
  await link.waitFor({state:'visible',timeout:15000});await link.click();
  const wheel=page.locator('.ezekiel-wheel-canvas');await wheel.waitFor();
  await page.waitForTimeout(3700);
  await wheel.screenshot({path:`${__dirname}/wheel-${width}-${reduced?'still':'moving'}.png`});
  const first=await wheel.evaluate(c=>c.toDataURL());
  await page.waitForTimeout(1400);
  const second=await wheel.evaluate(c=>c.toDataURL());
  const bounds=await wheel.boundingBox();
  const twErrors=await page.locator('tw-error').allTextContents();
  await page.screenshot({path:`${__dirname}/page-${width}-${reduced?'still':'moving'}.png`});
  const come=page.locator('tw-link').filter({hasText:/^Come back$/});await come.click();
  await page.waitForFunction(()=>document.querySelector('tw-story').textContent.includes('Dean Street again'));
  results.push({width,reduced,animated:first!==second,withinViewport:bounds.x>=0&&bounds.x+bounds.width<=width,removed:await wheel.count()===0,returnText:(await page.locator('tw-story').innerText()).includes('Dean Street again'),errors,twErrors});
  await page.close();
 }
 fs.writeFileSync(`${__dirname}/results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results));await browser.close();
})();
