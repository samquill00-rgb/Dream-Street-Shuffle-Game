const {chromium}=require('/Users/samquill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Users/samquill/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell',args:['--use-gl=angle','--use-angle=metal','--enable-unsafe-swiftshader']});
let results=[];
const p=await browser.newPage({viewport:{width:900,height:1100}});let errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto('http://127.0.0.1:8784/scratchpad/charles-statue-2026-10-31/preview.html');await p.waitForFunction(()=>window.ready);await p.screenshot({path:'/private/tmp/dss-charles-statue.png'});await p.evaluate(()=>{camera.position.set(1.4,3.8,3);camera.lookAt(0,3.4,0);renderer.render(scene,camera);});await p.screenshot({path:'/private/tmp/dss-charles-detail.png'});console.log({errors});await browser.close();})();
