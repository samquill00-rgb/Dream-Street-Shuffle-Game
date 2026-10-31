const {chromium}=require('/Users/samquill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Users/samquill/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell',args:['--use-gl=angle','--use-angle=metal','--enable-unsafe-swiftshader']});
let results=[];
const p=await browser.newPage({viewport:{width:1200,height:900}});let errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto('http://127.0.0.1:8784/scratchpad/soho-hut-reference-2026-10-31/preview.html');await p.waitForFunction(()=>window.ready);await p.screenshot({path:'/private/tmp/dss-soho-hut.png'});await p.evaluate(()=>{camera.position.set(0,4,17);camera.lookAt(0,3,0);renderer.render(scene,camera);});await p.screenshot({path:'/private/tmp/dss-soho-hut-front.png'});console.log({errors});await browser.close();})();
