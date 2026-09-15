const fs=require('fs');const{chromium}=require('/Users/samquill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const src=fs.readFileSync('/Users/samquill/Claude work/Dream Street Shuffle - Game Files/Dream Street Shuffle.twee','utf8');const ms=[...src.matchAll(/^:: (.+?)(?:\s+\[([^\]]*)\])?(?:\s+(\{[^\n]+\}))?\s*$/gm)];const bodies={};ms.forEach((m,i)=>bodies[m[1]]=src.slice(m.index+m[0].length,ms[i+1]?.index??src.length));
const base='(set: $metRed to true)(set: $returns to 8)(set: $sawAoifeReflection to true)(set: $sawAoifeMemory2 to true)(set: $hadPhoneCall to true)(set: $hadLilyCall1 to true)(set: $hadDualRing to true)(set: $shownOpenNightTip to true)(set: $shownVenueHint to true)(set: $primerShown to true)(set: $hasMatches to true)(set: $hasCoin to true)(set: $alba to (a: $alba1))(set: $visited\'s French to true)';

(async()=>{
const b=await chromium.launch({headless:true,channel:'chrome'}); const records=[];
async function make(target,seeds=''){
 const p=await b.newPage(); const errors=[];p.on('pageerror',e=>errors.push(e.message));p.auditErrors=errors;
 await p.addInitScript(({start,header})=>document.addEventListener('DOMContentLoaded',()=>{
 document.querySelector('tw-passagedata[name="Start"]').textContent=start;
 document.querySelector('tw-passagedata[name="header header"]').textContent=header;
 document.querySelector('tw-storydata').setAttribute('startnode',document.querySelector('tw-passagedata[name="Start"]').getAttribute('pid'));
 }),{start:bodies.Start.replace('(go-to: "The Night Ahead")',base+seeds+'\n(go-to: '+JSON.stringify(target)+')'),header:bodies['header header']+'\n<div id="audit-name">(print: (passage:)\'s name)</div>'});
 await p.goto('http://localhost:8732/Dream%20Street%20Shuffle.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(1500);return p;
}
async function click(p,t){const found=await p.evaluate(t=>{const el=[...document.querySelectorAll('tw-link')].find(e=>e.textContent.trim()===t);if(el)el.click();return !!el},t);if(!found)throw Error('Missing link '+t);await p.waitForTimeout(900);}
async function record(p,name,data){const errors=await p.locator('tw-error').allTextContents();records.push({name,...data,errors,jsErrors:p.auditErrors});if(errors.length||p.auditErrors.length)throw Error(JSON.stringify(records.at(-1)));}
let p=await make('Sketch the Painter','(set: $haunts to (a: $haunt1,$haunt4))');
const initialDisabled=await p.locator('#napkin-done').isDisabled();
await p.evaluate(()=>{const c=document.querySelector('.napkin-wrap canvas');const r=c.getBoundingClientRect();for(const [type,x,y] of [['mousedown',40,40],['mousemove',70,65],['mouseup',70,65]])c.dispatchEvent(new MouseEvent(type,{bubbles:true,clientX:r.left+x,clientY:r.top+y}));});
const drawnEnabled=await p.locator('#napkin-done').isEnabled();
await click(p,'← Exit to the street');await click(p,'To The French');await click(p,'·');await click(p,'Sketch him on a napkin');
const resumedEnabled=await p.locator('#napkin-done').isEnabled();
await p.locator('#napkin-done').click();await p.waitForTimeout(6000);
const finishedAt=await p.locator('#audit-name').textContent();
await record(p,'Sketch persists and finishes',{initialDisabled,drawnEnabled,resumedEnabled,finishedAt});
if(!initialDisabled||!drawnEnabled||!resumedEnabled||finishedAt!=='Give him the painting')throw Error('Sketch failed');
await p.close();
p=await make('The Glyph','(set: $inisToldOfPillars to true)(set: $returnedPage to true)');
let before=await p.evaluate(()=>dssLoadLifetimeGifts());
await click(p,'Pocket the rubbing');
let after=await p.evaluate(()=>dssLoadLifetimeGifts());
await record(p,'Completion only when gift taken',{before,after});
if(before.length||!after.includes('easter'))throw Error('Gift boundary failed');await p.close();
p=await make('Dawn');
await p.evaluate(()=>DSS_WORLDS_ALL.forEach(dssMarkWorldSeen));
before=await p.evaluate(()=>({gifts:dssLoadLifetimeGifts(),worlds:dssLoadLifetimeWorlds()}));
await p.evaluate(()=>document.querySelector('.dawn-restart-btn').click());await p.waitForTimeout(2000);
after=await p.evaluate(()=>({gifts:dssLoadLifetimeGifts(),worlds:dssLoadLifetimeWorlds()}));
await record(p,'All five survive actual restart',{before,after});
if(after.gifts.length!==5||after.worlds.length!==5)throw Error('Restart cleared progress');await p.close();
fs.writeFileSync('/tmp/dss-persistence-results.json',JSON.stringify(records,null,2));console.log(JSON.stringify(records,null,2));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
