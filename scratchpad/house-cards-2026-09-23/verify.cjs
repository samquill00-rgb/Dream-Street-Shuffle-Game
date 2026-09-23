const {chromium}=require('/Users/samquill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),assert=require('assert');
const OUT=__dirname, URL='http://127.0.0.1:8789/Dream%20Street%20Shuffle.html#dss-debug-jump=Green%20Sea%20House%20of%20Cards';
const source=fs.readFileSync('Dream Street Shuffle.twee','utf8');
const header=source.match(/^:: header header[^\n]*\n([\s\S]*?)(?=\n:: )/m)[1];
const results=[];
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 let allErrors=[]; console.log('Browser launched');
 async function game(options={}){
  const context=await browser.newContext({viewport:{width:1100,height:1000},...options});
  const page=await context.newPage();page.on('pageerror',e=>allErrors.push(e.message));
  await page.addInitScript(({header})=>document.addEventListener('DOMContentLoaded',()=>{
   document.querySelector('tw-passagedata[name="header header"]').textContent=header+'\n<script>window.cardsAudit={confidence:$confidence,played:$houseCardsPlayed,alba:$alba,sobriety:$sobriety};</script>';
  }),{header});
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.locator('.dss-rules-play').waitFor();
  assert.equal(await page.locator('tw-error').count(),0);
  await page.locator('.dss-rules-play').click();
  await page.waitForTimeout(350);
  return {page,context};
 }
 const snap=p=>p.evaluate(()=>window._houseCardsDev.snapshot());
 async function put(p,a){await p.evaluate(a=>{window._houseCardsDev.angle(a);window._houseCardsDev.place();},a);await p.waitForTimeout(340);}
 async function build(p,{mistake=false,slow=false}={}){
  if(mistake)await put(p,40);
  for(let i=0;i<15;i++){
   let s=await snap(p);assert(!s.ended);let slot=s.slots[s.active];
   await put(p,slot.kind==='bridge'?0:70);
   if(slow && i<14)await p.waitForTimeout(3200);
  }
  await p.getByRole('button',{name:'Face the roar',exact:true}).click();
 }
 async function returned(p){await p.waitForFunction(()=>!document.querySelector('#dss-house-cards'));assert.equal(await p.locator('tw-error').count(),0);assert(await p.getByText('Listen',{exact:true}).count());assert.equal(await p.evaluate(()=>typeof window._houseCardsDev),'undefined');return p.evaluate(()=>window.cardsAudit);}
 if(process.env.CARDS_EXTRA){let g,p,s,state;
 // A completed but weak house must lose specifically to the final roar.
 g=await game();p=g.page;await put(p,84);await put(p,84);await p.evaluate(()=>{for(let i=0;i<6;i++)_houseCardsDev.roar();});
 for(let i=2;i<15;i++){s=await snap(p);await put(p,s.slots[s.active].kind==='bridge'?0:70);}
 assert.equal((await snap(p)).standing,15);
 await p.getByRole('button',{name:'Face the roar',exact:true}).click();
 await p.evaluate(()=>{const old=Math.random;Math.random=()=>.9;try{window._houseCardsDev.roar();}finally{Math.random=old;}});
 assert((await snap(p)).ended);assert((await snap(p)).standing<15);
 state=await returned(p);assert.equal(state.confidence,70);results.push({case:'weak completed house loses in final roar',state});await g.context.close();
 // Harlowe owns the 150-second bail, independently of the canvas loop.
 g=await game();p=g.page;await p.clock.install();await p.clock.fastForward(151000);
 await p.locator('.canvas-bail tw-link').waitFor({timeout:5000});await p.locator('.canvas-bail tw-link').click();
 await returned(p);results.push({case:'150-second independent manual escape',passed:true});await g.context.close();
assert.deepEqual(allErrors,[]);fs.writeFileSync(OUT+'/extra-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));await browser.close();return;}
 let g=await game(),p=g.page;
 let s=await snap(p);await p.locator('#dss-house-cards canvas').press('ArrowRight');assert.equal((await snap(p)).angle,s.angle+2);
 let box=await p.locator('#dss-house-cards canvas').boundingBox();
 await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();await p.mouse.move(box.x+box.width/2+26.6667,box.y+box.height/2);await p.mouse.up();assert.equal((await snap(p)).used,1);assert.equal((await snap(p)).standing,1);
 await p.waitForTimeout(350);await p.locator('#dss-house-cards canvas').press('ArrowLeft');assert.equal((await snap(p)).angle,78);
 await p.evaluate(()=>window._houseCardsDev.angle(70));await p.locator('#dss-house-cards canvas').press('Space');assert.equal((await snap(p)).used,2);
 await p.screenshot({path:OUT+'/controls.png'});console.log('Checkpoint');results.push({case:'popup, mouse drag/release, two-degree keys, Space',passed:true});await g.context.close();
 // Normal-speed run: the house must survive real periodic tremors over about a minute.
 g=await game();p=g.page;await build(p,{slow:!process.env.CARDS_QUICK});await p.screenshot({path:OUT+'/complete-house.png'});
 await p.waitForTimeout(1400);assert.equal(await p.locator('.cards-payment .inventory-note').innerText(),'MORALE +12');
 let state=await returned(p);assert.equal(state.confidence,77);assert.equal(state.played,true);assert.deepEqual(state.alba,[]);assert.equal(state.sobriety,70);
 console.log('Checkpoint');results.push({case:(process.env.CARDS_QUICK?'quick distinction':'natural ~55-second distinction')+', final roar, +12 and automatic LINE 2 return',state});
 await p.getByText('Build a house of cards while you wait',{exact:true}).click();await p.locator('.dss-rules-play').click();await p.waitForTimeout(350);await build(p);await p.waitForTimeout(1400);assert.equal(await p.locator('.cards-payment .inventory-note').count(),0);state=await returned(p);assert.equal(state.confidence,77);console.log('Checkpoint');results.push({case:'replay gives no second morale note or reward',state});await g.context.close();
 g=await game();p=g.page;await build(p,{mistake:true});await p.waitForTimeout(1400);assert.equal(await p.locator('.cards-payment .inventory-note').innerText(),'MORALE +8');state=await returned(p);assert.equal(state.confidence,75);console.log('Checkpoint');results.push({case:'one mistake, win, +8 and return',state});await g.context.close();
 g=await game();p=g.page;for(let i=0;i<18;i++)await put(p,40);state=await returned(p);assert.equal(state.confidence,70);assert.equal(state.played,true);console.log('Checkpoint');results.push({case:'deck exhausted, loss, no reward, return',state});
 await p.getByText('Build a house of cards while you wait',{exact:true}).click();await p.locator('.dss-rules-play').click();await p.waitForTimeout(350);await build(p);await p.waitForTimeout(1400);assert.equal(await p.locator('.cards-payment .inventory-note').count(),0);state=await returned(p);assert.equal(state.confidence,70);console.log('Checkpoint');results.push({case:'loss consumes first completion reward eligibility',state});await g.context.close();
 // Cascading collapse: near-edge first pair supports a bridge; safer distant pair survives.
 g=await game();p=g.page;await put(p,84);await put(p,84);for(let i=0;i<4;i++)await put(p,70);await put(p,0);
 await p.evaluate(()=>{for(let i=0;i<14;i++)window._houseCardsDev.roar();});s=await snap(p);assert(!s.cards[0]);assert(!s.cards[1]);assert(!s.cards[6]);assert(s.cards[4]);assert(s.cards[5]);assert(s.falls>=3);console.log('Checkpoint');results.push({case:'dependent bridge collapses; independent pair survives',snapshot:s});await g.context.close();
 // A completed but weak house must lose specifically to the final roar.
 g=await game();p=g.page;await put(p,84);await put(p,84);await p.evaluate(()=>{for(let i=0;i<6;i++)_houseCardsDev.roar();});
 for(let i=2;i<15;i++){s=await snap(p);await put(p,s.slots[s.active].kind==='bridge'?0:70);}
 assert.equal((await snap(p)).standing,15);
 await p.getByRole('button',{name:'Face the roar',exact:true}).click();
 await p.evaluate(()=>{const old=Math.random;Math.random=()=>.9;try{window._houseCardsDev.roar();}finally{Math.random=old;}});
 assert((await snap(p)).ended);assert((await snap(p)).standing<15);
 state=await returned(p);assert.equal(state.confidence,70);results.push({case:'weak completed house loses in final roar',state});await g.context.close();
 // Harlowe owns the 150-second bail, independently of the canvas loop.
 g=await game();p=g.page;await p.clock.install();await p.clock.fastForward(151000);
 await p.locator('.canvas-bail tw-link').waitFor({timeout:5000});await p.locator('.canvas-bail tw-link').click();
 await returned(p);results.push({case:'150-second independent manual escape',passed:true});await g.context.close();
 g=await game({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3,reducedMotion:'reduce'});p=g.page;
 assert((await snap(p)).reduced);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 box=await p.locator('#dss-house-cards canvas').boundingBox();const cdp=await g.context.newCDPSession(p);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+100,y:box.y+100}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+133.333,y:box.y+100}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal((await snap(p)).standing,1);
 await p.waitForTimeout(350);await p.evaluate(()=>window._houseCardsDev.angle(70));await p.touchscreen.tap(box.x+100,box.y+100);assert.equal((await snap(p)).standing,2);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+100,y:box.y+100}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});assert.equal((await snap(p)).used,2);
 await p.evaluate(()=>window._houseCardsDev.roar());await p.screenshot({path:OUT+'/phone.png'});
 assert(await p.evaluate(()=>{const c=document.querySelector('#dss-house-cards canvas');return c.width/c.clientWidth<=1.51;}));
 await p.locator('.cards-skip tw-link').click();await returned(p);console.log('Checkpoint');results.push({case:'390px touch drag/tap/cancel; reduced motion; pixel cap; skip teardown',passed:true});await g.context.close();
 assert.deepEqual(allErrors,[]);console.log('Checkpoint');results.push({case:'Harlowe and JavaScript errors',errors:allErrors});
 fs.writeFileSync(OUT+'/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results.map(r=>({case:r.case,passed:true})),null,2));await browser.close();
})().catch(e=>{fs.writeFileSync(OUT+'/failure.txt',String(e.stack));console.error(e);process.exit(1)});
