const {chromium}=require('/Users/samquill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});const p=await b.newPage({viewport:{width:1100,height:950}});let errors=[];p.on('pageerror',e=>errors.push(e.message));async function fresh(){await p.goto('file:///tmp/pyr-preview.html');await p.click('#pr-begin');await p.evaluate(()=>pyrTest.stop());}
await fresh();
const run=await p.evaluate(()=>{
 const press=(k,on)=>window.dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{key:k,bubbles:true}));
 let jump=false,duck=false,maxX=0,frames=0,bumps=[],oldStumbles=0;press('ArrowRight',true);
 for(;frames<24000;frames++){
  const s=pyrTest.get();if(s.stumbles>oldStumbles){bumps.push({x:s.px,y:s.py});oldStumbles=s.stumbles;}if(s.finished)break;maxX=Math.max(maxX,s.px);
  const lintel=s.LINTELS.some(l=>s.px>l.x0-45&&s.px<l.x1+12);
  press('ArrowDown',lintel);duck=lintel;
  if(jump&&s.onGround){press('ArrowUp',false);jump=false;}
  const obstacle=s.FLOOR.some((f,i)=>f.x0>s.px&&f.x0-s.px<65&&(f.y===null||(i>0&&f.y!==null&&s.FLOOR[i-1].y!==null&&f.y<s.FLOOR[i-1].y)))||s.SCARABS.some(c=>c.x>s.px&&c.x-s.px<60);
  if(!jump&&s.onGround&&!lintel&&obstacle){press('ArrowUp',true);jump=true;}
  pyrTest.step(1/120);
 }
 const s=pyrTest.get();return{finished:s.finished,x:s.px,maxX,seconds:frames/120,marks:s.glyphCount,stumbles:s.stumbles,bumps,ball:s.ball};
});console.log('FULL RUN',JSON.stringify(run));assert(run.finished);
await fresh();const ceilings=await p.evaluate(()=>{
 const key=(k,on)=>window.dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{key:k,bubbles:true}));
 pyrTest.set({px:905,py:340,vy:0,onGround:true});key('ArrowDown',true);pyrTest.step(1/120,35);key('ArrowDown',false);const duck=pyrTest.get().stumbles;
 pyrTest.set({px:920,py:315,vy:-100,onGround:false,invuln:0});pyrTest.step(1/120);return{duck,jumping:pyrTest.get().stumbles};});assert.equal(ceilings.duck,0);assert.equal(ceilings.jumping,1);console.log('CEILINGS',ceilings);
await fresh();const fall=await p.evaluate(()=>{pyrTest.set({px:530,py:320,onGround:true});pyrTest.step(1/120,200);const s=pyrTest.get();return{x:s.px,y:s.py,ground:s.onGround,stumbles:s.stumbles,checkpoint:s.lastCheckpoint};});console.log('PIT recovery',fall);assert(fall.stumbles>=1);assert(fall.ground);
for(const win of [true,false]){await fresh();await p.evaluate(w=>{pyrTest.set({px:5200,py:210,vy:0,onGround:true,glyphCount:w?4:0,stumbles:w?0:5});pyrTest.step(1/120,350);},win);assert(await p.locator(win?'#pyr-run-win':'#pyr-run-lose').isVisible());assert(await p.locator(win?'#pyr-run-lose':'#pyr-run-win').isHidden());console.log('ENDING',win?'bonus':'no bonus');}
await p.goto('file:///tmp/pyr-preview.html');await p.click('#pr-begin');await p.click('#pr-pause');let clock=await p.evaluate(()=>pyrTest.get().gameClock);await p.waitForTimeout(200);assert.equal(await p.evaluate(()=>pyrTest.get().gameClock),clock);await p.click('#pr-pause');assert.equal(await p.evaluate(()=>document.activeElement.id),'pyr-run-canvas');console.log('PAUSE and focus PASS');
const mobile=await b.newContext({viewport:{width:375,height:812},hasTouch:true,isMobile:true,deviceScaleFactor:1});const mp=await mobile.newPage();mp.on('pageerror',e=>errors.push(e.message));await mp.goto('file:///tmp/pyr-preview.html');await mp.screenshot({path:'/tmp/pr-mobile-start.png'});await mp.click('#pr-begin');const cdp=await mobile.newCDPSession(mp),right=await mp.locator('[data-pr-key="ArrowRight"]').boundingBox(),duck=await mp.locator('[data-pr-key="ArrowDown"]').boundingBox();await mp.evaluate(()=>pyrTest.set({px:850,py:340,onGround:true}));const pt=(bb,id)=>({x:bb.x+bb.width/2,y:bb.y+bb.height/2,id});await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[pt(right,1),pt(duck,2)]});await mp.waitForTimeout(500);const mobileRun=await mp.evaluate(()=>({x:pyrTest.get().px,stumbles:pyrTest.get().stumbles}));await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});console.log("TOUCH",mobileRun);assert(mobileRun.x>940);assert.equal(mobileRun.stumbles,0);assert.equal(await mp.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await mp.screenshot({path:'/tmp/pr-mobile-play.png'});console.log('MULTITOUCH',mobileRun);assert.equal(errors.length,0,errors.join('\n'));console.log('PASS no browser errors');await b.close();})().catch(e=>{console.error(e);process.exit(1)});
