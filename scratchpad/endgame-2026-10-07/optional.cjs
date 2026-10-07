const {chromium}=require('/Users/samquill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
const base='http://localhost:8777/Dream%20Street%20Shuffle.html?dev=1#dss-debug-jump=';
(async()=>{
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const cases=[
 ['complete',1280,false,'(set: $alba to (a:$alba1,$alba2,$alba3))(set: $lilyCount to 5)(set: $haunts to (a:$haunt1,$haunt2,$haunt3,$haunt4,$haunt5,$haunt6,$haunt7,$haunt8,$haunt9,$haunt10,$haunt11))(set: $aoifeRework to true)','Alba Complete'],
 ['incomplete',390,true,'(set: $alba to (a:$alba1))(set: $lilyCount to 2)(set: $haunts to (a:$haunt1))','Alba Incomplete'],
 ['stolen',390,true,'(set: $alba to (a:$alba1,$alba2,$alba3))(set: $notebook to "stolen")(set: $refusedDualRing to true)','Alba Incomplete'],
 ['losses',1280,true,'(set: $alba to (a:))(set: $blackouts to 2)(set: $shipNews to "sunk")(set: $ashtonSold to true)(set: $hutBurnt to true)(set: $lostToDrink to (a:"gooch"))','Alba Incomplete']
];
let results=[];
async function boot(target,width,reduce,seeds){
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:reduce?'reduce':'no-preference'});
 page.errs=[];page.on('pageerror',e=>page.errs.push(e.message));
 await page.addInitScript(({target,seeds})=>document.addEventListener('DOMContentLoaded',()=>{
  const p=[...document.querySelectorAll('tw-passagedata')].find(p=>p.getAttribute('name')===target);
  if(p)p.textContent=seeds+'\n'+p.textContent;
 }),{target,seeds});
 await page.goto(base+encodeURIComponent(target));return page;
}
async function click(page,text){const l=page.locator('tw-story tw-link').filter({hasText:new RegExp('^'+text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$')});await l.last().click({timeout:25000});}
for(const [name,width,reduce,seeds,ending] of []){
 const page=await boot('The Fetch',width,reduce,seeds);
 await page.locator('#fetch-reveal').waitFor({state:'visible',timeout:25000});
 const retreat=await page.locator('tw-story tw-link').filter({hasText:'Not yet. Back to the night.'}).count();
 const crown=(await page.locator('tw-story').innerText()).includes('THE CROWN');
 await page.screenshot({path:`${__dirname}/${name}-fetch.png`});
 await click(page,'Follow him');await page.locator('#cp-wrap .dss-climb-button').waitFor({timeout:20000});
 await page.waitForTimeout(reduce?700:5000);
 await page.locator('#cp-wrap .dss-climb-button').click();
 await page.waitForFunction(()=>!!document.querySelector('.ending-pane'));
 await page.waitForTimeout(1200);
 await page.screenshot({path:`${__dirname}/${name}-alba.png`});
 const arrived=await page.locator('[data-endgame]').last().getAttribute('data-endgame');
 await click(page,ending==='Alba Complete'?'Traveller, wake!':'Traveller, sleep!');
 await page.locator('.dawn-approach').waitFor();await page.waitForTimeout(3500);
 await page.screenshot({path:`${__dirname}/${name}-aerial.png`});
 await page.locator('.plus-ultra-fade').waitFor({timeout:22000});
 await page.screenshot({path:`${__dirname}/${name}-page.png`});
 await click(page,'PLUS. ULTRA.');
 await page.locator('.dawn-title').waitFor({timeout:20000});await page.waitForTimeout(7500);
 await page.screenshot({path:`${__dirname}/${name}-dawn.png`});
 const snapshot=await page.evaluate(()=>({canvases:document.querySelectorAll('.dss-end-frieze').length,overflow:document.documentElement.scrollWidth>innerWidth+1,errors:[...document.querySelectorAll('tw-error')].map(x=>x.textContent),text:document.querySelector('tw-story').textContent}));
 results.push({name,retreat,crown,arrived,errors:page.errs,twErrors:snapshot.errors,overflow:snapshot.overflow,friezes:snapshot.canvases,dawn:snapshot.text.includes('THE DAWN')});
 fs.writeFileSync(`${__dirname}/results.json`,JSON.stringify(results,null,2));console.log(name,JSON.stringify(results.at(-1)));await page.close();
}
// Optional world-completion route, all five ritual interactions through to Fetch.
const page=await boot('The Synthesis',390,true,'(set: $alba to (a:$alba1,$alba2,$alba3))');
for(const text of ['Speak the mantra','Hold up the tracing','Remember the glyph','Hum the number','Draw the wheel'])await click(page,text);
await page.waitForTimeout(1500);console.log('SYNTHESIS',await page.evaluate(()=>({markers:[...document.querySelectorAll('[id^=dss-end]')].map(x=>[x.id,x.dataset.ready,!!x.closest('tw-passage')]),hex:document.querySelectorAll('.hexagram-wrap').length,canvas:document.querySelectorAll('.dss-end-frieze').length,errors:[...document.querySelectorAll('tw-error')].map(x=>x.textContent)})));await page.locator('.hexagram-wrap canvas').waitFor();await page.screenshot({path:`${__dirname}/synthesis.png`});
await click(page,'Step into the Seal');await page.locator('[data-endgame="sanctum"] canvas').waitFor();await page.screenshot({path:`${__dirname}/sanctum.png`});
await click(page,'Sit down');await page.locator('[data-endgame="sitting"] canvas').waitFor();
await click(page,'Read what you wrote');await page.locator('[data-endgame="alt"] canvas').waitFor();await page.screenshot({path:`${__dirname}/alt-dawn.png`});
await click(page,'Wake');await page.locator('#fetch-reveal').waitFor({state:'visible'});
results.push({name:'synthesis-sanctum',retreat:await page.locator('tw-story tw-link').filter({hasText:'Not yet. Back to the night.'}).count(),friezes:await page.locator('.dss-end-frieze').count(),errors:page.errs,twErrors:await page.locator('tw-error').allTextContents()});
fs.writeFileSync(`${__dirname}/results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results.at(-1)));await browser.close();
})();
