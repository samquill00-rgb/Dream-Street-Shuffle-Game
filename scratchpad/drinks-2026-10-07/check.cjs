const {chromium}=require('/Users/samquill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
const out=__dirname;
const src=fs.readFileSync('Dream Street Shuffle.twee','utf8');
const start=src.indexOf('window.DrinkPopup =');
const popup=src.slice(start,src.indexOf('// Global helper to show drink popup',start));
new Function(popup);
(async()=>{
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:2});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:8777/Dream%20Street%20Shuffle.html');
await page.waitForFunction(()=>typeof window.DrinkPopup==='function');
await page.evaluate(()=>{ window.dssAudio=null; });
// All real popup variants: automatic fill, hold/drain, release/close.
const types=['pint','whisky','gin','wine','champagne','scotch','cider','vodka','beer','stout','porter','mild','claret','beaujolais','krug'];
let checks=[];
for(const width of [1280,390]){
 await page.setViewportSize({width,height:900});
 for(const type of types){
  await page.evaluate(t=>{window.testDrink=new DrinkPopup(t)},type);
  await page.waitForFunction(()=>!testDrink.filling);
  const filled=await page.evaluate(()=>!testDrink.filling&&testDrink.liquidLevel===1);
  const canvas=page.locator('#drink-popup-overlay canvas').first();
  await canvas.hover(); await page.mouse.down(); await page.waitForFunction(()=>testDrink.liquidLevel<.97);
  const held=await page.evaluate(()=>testDrink.drinking && testDrink.liquidLevel<1);
  if(['whisky','champagne','beer','wine','gin'].includes(type)&&width===1280) await page.screenshot({path:`${out}/${type}-tilted.png`});
  await page.mouse.up(); await page.waitForFunction(()=>testDrink.done);
  const closed=await page.evaluate(()=>testDrink.done&&!document.querySelector('#drink-popup-overlay')&&!window._drinkPopupOpen);
  checks.push({width,type,filled,held,closed});
 }
}
// A still contact sheet uses the actual class and canvas drawing, at full/half fill.
await page.setContent('<body style="background:#100b07;color:#c8a86a;margin:24px;font:14px Georgia"><div id="gallery" style="display:grid;grid-template-columns:repeat(5,200px);gap:16px"></div></body>');
await page.addScriptTag({content:popup});
await page.evaluate(types=>{
 for(const type of types){
  const d=new DrinkPopup(type);d.done=true;d.overlay.remove();d.t=3;d.liquidLevel=1;d.lipOpen=.18;d.lipOpenTarget=.18;d.entryStrength=0;d.streamStrength=0;d._draw();
  const card=document.createElement('div');card.style='border:1px solid #54452b;border-radius:8px;text-align:center;padding:8px;background:#0e0904';
  const label=document.createElement('div');label.textContent=d.cfg.label;card.append(label);card.append(d.canvas);d.canvas.style.margin='auto'; document.querySelector('#gallery').append(card);
 }
},types);
await page.setViewportSize({width:1120,height:980});await page.screenshot({path:`${out}/all-drinks.png`});
fs.writeFileSync(`${out}/results.json`,JSON.stringify({checks,errors},null,2));
console.log(JSON.stringify({tests:checks.length,failures:checks.filter(c=>!c.filled||!c.held||!c.closed),errors}));
await browser.close();
})();
