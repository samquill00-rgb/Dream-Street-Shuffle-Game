const {chromium}=require('/Users/samquill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:'/Users/samquill/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell',args:['--use-gl=angle','--use-angle=metal']});
for(const state of ['before','after']){
const p=await browser.newPage({viewport:{width:1100,height:760},reducedMotion:'reduce'});
p.on('pageerror',e=>console.log(state,String(e)));
await p.goto('http://127.0.0.1:8775/bookshop-'+state+'.html');await p.waitForTimeout(1700);
await p.evaluate(()=>{document.querySelectorAll('#render-metrics,body>div:not([id$="container"])').forEach(e=>{if(e.id!=='oi-container')e.style.display='none';});document.querySelectorAll('button,.dss-room-caption').forEach(e=>e.style.visibility='hidden');
const e=Object.values(window._dssThreeRegistry)[0], render=e.renderer.render.bind(e.renderer);e.renderer.setPixelRatio(1.5);
e.renderer.render=function(s,c){if(c===e.camera){c.position.set(0,0.78,2.4);c.lookAt(0,0,-0.7);}return render(s,c);};});
await p.waitForTimeout(1000);await p.screenshot({path:'/private/tmp/dss-bookshop-textures-'+state+'.png'});console.log(state,await p.locator('#errors').textContent());await p.close();
}
await browser.close();})();
