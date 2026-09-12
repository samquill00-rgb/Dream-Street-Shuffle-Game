const {chromium}=require('/Users/samquill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'chrome'});
const errors=[];const page=await browser.newPage({viewport:{width:1100,height:950}});page.on('pageerror',e=>errors.push(e.message));
async function fresh(){await page.goto('file:///tmp/dss-climb-preview.html');await page.click('#hc-begin');await page.evaluate(()=>{hcTest.stop();hcTest.calm();});}
await fresh();
const result=await page.evaluate(()=>{
function key(k,down){window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{key:k,bubbles:true}));}
function step(n){hcTest.step(1/120,n);}
const failures=[],g=hcTest.get(),route=[g.ledges[0],...g.route];
// Test every route transition using the actual physics and keyboard input.
for(let i=0;i<route.length-1;i++){
 const from=route[i],to=route[i+1],lad=g.ladders.find(l=>Math.abs(l.y0-from.y)<2&&Math.abs(l.y1-to.y)<2);
 const direction=Math.sign(to.x+to.w/2-(from.x+from.w/2));
 const start=lad?lad.x:Math.max(from.x+13,Math.min(from.x+from.w-13,to.x+to.w/2));
 hcTest.set({px:start,py:from.y,vx:0,vy:0,grounded:true,breath:1,maxY:from.y});
 if(lad){key('ArrowUp',true);step(160);key('ArrowUp',false);}
 else if(Math.abs(to.y-from.y)<2){key(direction>0?'ArrowRight':'ArrowLeft',true);step(Math.ceil(Math.abs(to.x+to.w/2-start)/230*120)+12);key(direction>0?'ArrowRight':'ArrowLeft',false);}
 else {
  const target=Math.max(to.x+12,Math.min(to.x+to.w-12,start));
  key('ArrowUp',true);
  for(let f=0;f<180;f++){
   const s=hcTest.get(),delta=target-s.px;
   key('ArrowLeft',delta < -4);key('ArrowRight',delta>4);
   step(1);const n=hcTest.get();if(f>3&&n.grounded)break;
  }
  key('ArrowUp',false);key('ArrowLeft',false);key('ArrowRight',false);
 }
 const n=hcTest.get();if(Math.abs(n.py-to.y)>3)failures.push({i,from:from.y,to:to.y,actual:n.py,x:n.px,lad:!!lad});
}
return{transitions:route.length-1,failures};});
console.log('ROUTE',JSON.stringify(result));assert.equal(result.failures.length,0);
await fresh();
const controls=await page.evaluate(()=>{
const btn=k=>document.querySelector('[data-hc-key="'+k+'"]');
function pointer(k,type,id){btn(k).dispatchEvent(new PointerEvent(type,{pointerId:id,bubbles:true}));}
// Synthetic capture can throw unless the pointer is active; actual touch checked below.
function key(k,down){window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{key:k,bubbles:true}));}
const ladder=hcTest.get().ladders[0];hcTest.set({px:ladder.x,py:ladder.y0,vx:0,vy:0,grounded:true});
key('ArrowUp',true);hcTest.step(1/120,70);key('ArrowUp',false);const mid=hcTest.get().py;
hcTest.step(1/120,80);const hold=hcTest.get().py;
key('ArrowUp',true);hcTest.step(1/120,100);key('ArrowUp',false);const top=hcTest.get().py;
key('ArrowDown',true);hcTest.step(1/120,80);key('ArrowDown',false);const down=hcTest.get().py;
return{mid,hold,top,down,expectedTop:ladder.y1};});
console.log('LADDERS',controls);assert.equal(controls.mid,controls.hold);assert(Math.abs(controls.top-controls.expectedTop)<1);assert(controls.down<controls.top-50);
await fresh();
const checkpoints=await page.evaluate(()=>{const flag=hcTest.get().ledges.find(l=>l.flag);hcTest.set({maxY:flag.y+50,py:flag.y+50});hcTest.step(1/120);const untouched=hcTest.get().checkpoint;hcTest.set({px:flag.x+50,py:flag.y,grounded:true,vy:0});hcTest.step(1/120);return{untouched,touched:hcTest.get().checkpoint,flag:flag.y};});
assert.equal(checkpoints.untouched,0);assert.equal(checkpoints.touched,checkpoints.flag);console.log('CHECKPOINTS',checkpoints);
for(const win of [true,false]){await fresh();await page.evaluate(w=>{hcTest.end(w);hcTest.step(1/120,210);},win);await page.screenshot({path:'/tmp/hc-summit.png'});await page.evaluate(()=>hcTest.step(1/120,800));assert(await page.locator(win?'#hc-win':'#hc-lose').isVisible());assert(await page.locator(win?'#hc-lose':'#hc-win').isHidden());console.log('ENDING',win?'win':'no bonus');}
// Pause in real time, including disappearing prints.
await page.goto('file:///tmp/dss-climb-preview.html');await page.click('#hc-begin');await page.waitForTimeout(200);await page.keyboard.press('p');const before=await page.evaluate(()=>hcTest.get().gameClock);await page.waitForTimeout(300);const after=await page.evaluate(()=>hcTest.get().gameClock);assert.equal(before,after);await page.click('#hc-begin');assert.equal(await page.evaluate(()=>hcTest.get().paused),false);console.log('PAUSE clock frozen');
const mobile=await browser.newContext({viewport:{width:375,height:812},isMobile:true,hasTouch:true,deviceScaleFactor:1});const mp=await mobile.newPage();mp.on('pageerror',e=>errors.push(e.message));await mp.goto('file:///tmp/dss-climb-preview.html');await mp.screenshot({path:'/tmp/hc-mobile-start.png'});await mp.click('#hc-begin');
const cdp=await mobile.newCDPSession(mp);const right=await mp.locator('[data-hc-key="ArrowRight"]').boundingBox(),up=await mp.locator('[data-hc-key="ArrowUp"]').boundingBox();
const pt=(b,id)=>({x:b.x+b.width/2,y:b.y+b.height/2,id});
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[pt(right,1),pt(up,2)]});await mp.waitForTimeout(250);const touchState=await mp.evaluate(()=>hcTest.get());assert(touchState.px>350 && touchState.py>30);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
await mp.screenshot({path:'/tmp/hc-mobile-play.png'});console.log('MULTITOUCH',JSON.stringify({x:touchState.px,y:touchState.py}));
assert.equal(await mp.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(errors.length,0,errors.join('\n'));console.log('PASS no browser errors; no mobile overflow');
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
