const {chromium}=require('/Users/samquill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');const assert=require('assert');const fs=require('fs');
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome',args:['--enable-unsafe-swiftshader']});const records=[];try{
for(const [passage,id,preferred] of [['The French','fi-wrap','A window'],['The Colony Room','ci-wrap',null],['Entering The Pillars of Hercules','pi-wrap',null],["Ronnie Scott's",'ri-wrap',null]].filter(c=>!process.env.DSS_ROOM_CASE||c[1]===process.env.DSS_ROOM_CASE)){
 const p=await b.newPage({viewport:{width:1280,height:850},reducedMotion:'reduce'});let errors=[];p.on('pageerror',e=>errors.push(e.message));
 try{
 await p.goto('http://127.0.0.1:8732/Dream%20Street%20Shuffle.html?start='+encodeURIComponent(passage),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(id=>{let r=window._dssThreeRegistry&&window._dssThreeRegistry[id];return r&&r.hotspots&&r.state().frames>2},id,{timeout:20000});
 const opening=await p.locator('#'+id).getAttribute('data-words');if(opening==='modal'){await p.evaluate(()=>{let dismiss=document.querySelector('.dss-room-dismiss');if(dismiss)dismiss.focus()});await p.keyboard.press('Enter');await p.waitForTimeout(350);assert(await p.evaluate(()=>!!document.activeElement.closest('.dss-room-keys, .dss-room-strip')));}else assert.equal(opening,'room');
 const label=await p.evaluate(({id,preferred})=>{let r=window._dssThreeRegistry[id],wrap=document.getElementById(id);let buttons=[...wrap.querySelectorAll('.dss-room-keys button')].filter(e=>e.tabIndex===0);let selected=buttons.find(e=>e.textContent===preferred)||buttons[0];if(!selected)throw Error('No available object');selected.focus();return selected.textContent},{id,preferred});
 await p.keyboard.press('Enter');await p.waitForTimeout(350);
 const card=p.locator('#'+id+' .dss-room-card');assert.equal(await card.getAttribute('aria-hidden'),'false');assert(await card.locator('.dss-room-back').isVisible());
 const notes=await p.locator('.dss-hint-stack').count();if(notes)assert.equal(await p.locator('.dss-hint-stack').evaluate(e=>getComputedStyle(e).visibility),'hidden');
 await p.setViewportSize({width:390,height:700});await p.waitForTimeout(500);
 let bounds=await card.boundingBox();assert(bounds.x>=-1&&bounds.x+bounds.width<=391);assert(await card.locator('.dss-room-back').isVisible());
 if(id==='fi-wrap')await p.screenshot({path:'/tmp/dss-interior-polish-phone.png',timeout:15000});
 await card.locator('.dss-room-back').click();await p.waitForTimeout(250);assert.equal(await card.getAttribute('aria-hidden'),'true');assert.equal(await p.evaluate(()=>document.activeElement.textContent),label);
 if(notes)assert.equal(await p.locator('.dss-hint-stack').evaluate(e=>getComputedStyle(e).visibility),'visible');
 const storyErrors=await p.locator('tw-error').allTextContents();assert.deepEqual(storyErrors,[]);assert.deepEqual(errors,[]);
 let record={passage,label,phoneCardFits:true,backRestoresFocus:true,notesWait:!!notes,errors};records.push(record);console.log('PASS',JSON.stringify(record));
 }finally{await p.close()}
}
fs.writeFileSync('scratchpad/interior-polish-2026-10-28/live-results.json',JSON.stringify(records,null,2));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
