const {chromium}=require('/Users/samquill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Users/samquill/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell',args:['--use-gl=angle','--use-angle=metal','--enable-unsafe-swiftshader']});let results=[];
for(const room of ['french','trisha','ronnie','coach']){
 const p=await browser.newPage({viewport:{width:1100,height:760},reducedMotion:'reduce'});let errors=[];p.on('pageerror',e=>errors.push(String(e)));p.on('console',e=>{if(e.type()==='error')errors.push(e.text());});p.on('response',r=>{if(r.url().includes('/artwork/')&&r.status()!==200)errors.push(r.status()+' '+r.url());});
 await p.goto('http://127.0.0.1:8784/scratchpad/venue-art-2026-10-31/'+room+'.html');await p.waitForTimeout(1800);
 try{await p.waitForFunction(()=>{var e=Object.values(window._dssThreeRegistry)[0];if(!e)return false;var art=[];e.scene.traverse(o=>{var t=o.material?.map;if(t?.userData?.dssVenueArt)art.push(t);});return art.length>0&&art.every(t=>t.userData.loaded);},{},{timeout:15000});}catch(e){errors.push('Art load wait: '+e.message);}
 const data=await p.evaluate(()=>{var e=Object.values(window._dssThreeRegistry)[0],art=[];if(e)e.scene.traverse(o=>{var t=o.material?.map;if(t?.userData?.dssVenueArt)art.push(t.userData);});return {scene:!!e,banner:document.querySelector('#errors')?.textContent||'',frames:art.length,loaded:art.filter(x=>x.loaded).length,unique:new Set(art.map(x=>x.artworkId)).size};});
 await p.screenshot({path:'/private/tmp/dss-real-art-'+room+'.png'});
 const name=room==='coach'?'A bar':'Photographs';const btn=p.getByRole('button',{name,exact:true});if(await btn.count()){await btn.click();await p.waitForTimeout(400);await p.screenshot({path:'/private/tmp/dss-real-art-'+room+'-close.png'});}
 results.push({room,...data,errors});console.log(JSON.stringify(results.at(-1)));await p.close();
}
fs.writeFileSync('scratchpad/venue-art-2026-10-31/verification.json',JSON.stringify(results,null,2));await browser.close();if(results.some(x=>x.errors.length||x.banner||!x.scene))process.exitCode=1;})();
