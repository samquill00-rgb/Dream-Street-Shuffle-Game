const {chromium}=require('/Users/samquill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Users/samquill/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell',args:['--use-gl=angle','--use-angle=metal','--enable-unsafe-swiftshader']});
let results=[];
for(const room of ['bookshop']){
 const p=await browser.newPage({viewport:{width:1100,height:760}});let errors=[];p.on('pageerror',e=>errors.push(String(e)));
 console.log('loading',room);await p.goto('http://127.0.0.1:8784/scratchpad/lighting-2026-10-31/'+room+'-after-post.html');await p.waitForTimeout(2200);
 const data=await p.evaluate(()=>{let e=Object.values(window._dssThreeRegistry)[0];return {banner:document.querySelector('#errors').textContent,scene:!!e, meshes:e?e.scene.children.length:0, textures:e?e.renderer.info.memory.textures:0};});
 if(room==='chippy'){await p.getByRole('button',{name:'A range',exact:true}).click();await p.waitForTimeout(500);}await p.screenshot({path:'/private/tmp/dss-lighting-post-'+room+'.png'});results.push({room,...data,errors});console.log(JSON.stringify(results.at(-1)));await p.close();
}
fs.writeFileSync('scratchpad/lighting-2026-10-31/verification-skeleton.json',JSON.stringify(results,null,2));const c=await browser.newPage({viewport:{width:900,height:1100}});let ce=[];c.on('pageerror',e=>ce.push(String(e)));await c.goto('http://127.0.0.1:8784/scratchpad/skeleton-gothic-2026-10-31/closeup.html');await c.waitForFunction(()=>window.ready);console.log(await c.evaluate(()=>({meshes:skeleton.children.length,bounds:new THREE.Box3().setFromObject(skeleton),calls:renderer.info.render.calls})));await c.screenshot({path:'/private/tmp/dss-gothic-skeleton.png'});await c.evaluate(()=>{camera.position.set(.29,1.72,.6);camera.lookAt(0,1.68,0);renderer.render(scene,camera);});await c.screenshot({path:'/private/tmp/dss-gothic-skull.png'});console.log('closeup errors',ce);await browser.close();if(results.some(r=>r.errors.length||r.banner||!r.scene))process.exitCode=1;
})();
