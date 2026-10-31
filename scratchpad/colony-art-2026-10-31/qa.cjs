const {chromium}=require('/Users/samquill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Users/samquill/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell',args:['--use-gl=angle','--use-angle=metal','--enable-unsafe-swiftshader']});
let results=[];
for(const room of ['colony']){
 const p=await browser.newPage({viewport:{width:1100,height:760},reducedMotion:"reduce"});let errors=[];p.on('pageerror',e=>errors.push(String(e)));p.on('console',e=>{if(e.type()==='error')errors.push(e.text())});p.on('response',r=>{if(r.url().includes('/artwork/colony/')&&r.status()!==200)errors.push(r.status()+' '+r.url());});
 console.log('loading',room);await p.goto('http://127.0.0.1:8784/scratchpad/colony-art-2026-10-31/preview.html');await p.waitForTimeout(2200);
 const data=await p.evaluate(()=>{let e=Object.values(window._dssThreeRegistry)[0];return {banner:document.querySelector('#errors').textContent,scene:!!e, meshes:e?e.scene.children.length:0, textures:e?e.renderer.info.memory.textures:0};});
 if(room==='chippy'){await p.getByRole('button',{name:'A range',exact:true}).click();await p.waitForTimeout(500);}await p.waitForFunction(()=>{const e=Object.values(window._dssThreeRegistry)[0];if(!e)return false;const pictures=[];e.scene.traverse(o=>{if(o.userData.artwork)pictures.push(o);});return pictures.length>0&&Object.keys(window._colonyArtQA.images).length===30&&Object.values(window._colonyArtQA.images).every(x=>x.loaded);});
console.log(await p.evaluate(()=>{var e=Object.values(window._dssThreeRegistry)[0],frames=[],sizes=[];e.scene.traverse(o=>{if(o.userData.artwork)frames.push(o.userData.artwork.id);if(o.material?.map)sizes.push(o.material.map.image?.width);});return {frames:frames.length,uniqueArtworks:new Set(frames).size,loadedImages:Object.values(window._colonyArtQA.images).filter(x=>x.loaded).length};}));
await p.waitForTimeout(1800);await p.screenshot({path:'/private/tmp/dss-colony-real-art.png'});
for(const name of ['Pictures','A piano']){var b=p.getByRole('button',{name,exact:true});if(await b.count()){await b.click();await p.waitForTimeout(400);await p.screenshot({path:'/private/tmp/dss-colony-real-art-'+name.replaceAll(' ','-')+'.png'});}}
results.push({room,...data,errors});console.log(JSON.stringify(results.at(-1)));await p.close();
}
fs.writeFileSync('scratchpad/lighting-2026-10-31/verification-colony-art.json',JSON.stringify(results,null,2));await browser.close();if(results.some(r=>r.errors.length||r.banner||!r.scene))process.exitCode=1;
})();
