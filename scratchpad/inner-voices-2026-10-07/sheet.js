// prints the writing sheet (markdown) from the table. run after extracting /tmp/voices.js (see engine_test.js)
global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.document={createElement:()=>({}),head:{appendChild(){}},getElementById:()=>null};
global.window=global; global.console.warn=()=>{};
eval(require('fs').readFileSync('/tmp/voices.js','utf8'));
const V=window.DSS_VOICES;
const NAME={fi:'The French',ci:'The Colony Room',pi:'The Pillars of Hercules',ri:'Ronnie Scott’s',cu:'Copper’s cellar',cb:'The Coach and Horses',ti:'Trisha’s',lk:'Lackland’s office',oi:'O’Flatterly’s shop',cf:'The chippy'};
const w=V.idWhen, idNote=`sobriety under ${w.sobrietyBelow}, morale under ${w.moraleBelow}, or from the small hours`;
const L=[]; const p=s=>L.push(s);
const BLANK='\n   > \n';
p('# Inner voices: writing sheet');
p('');
p('Every voice slot, by venue. Write your line after the `>`. Each shows pink in the game until written.');
p('');
p(`- **now**: you now. **then**: the idealised you (the child, the imagined future). **id**: speaks only at ${idNote}.`);
p('- A trail line replaces that object\'s own **then**. A callback line replaces its **now** once the earlier object has been seen.');
p('- An empty line keeps that voice quiet on that object.');
p('');
let n=0;
for (const room of Object.keys(V.objects)) {
  p(`## ${NAME[room]||room}`); p('');
  for (const [obj,slots] of Object.entries(V.objects[room])) {
    const path=room+'/'+obj;
    p(`### ${obj}`);
    for (const v of ['now','then','id']) if (slots[v]!=null) { n++; p(`${n}. ${v}${v==='id'?' (when the id speaks)':''}`+BLANK); }
    for (const [k,t] of Object.entries(V.trails)) t.steps.forEach((s,i)=>{ if(s.at===path){ n++; p(`${n}. then, ${k} trail step ${i+1} of ${t.steps.length} (${t.world})${i===0?', always shows here':', after you have seen '+t.steps[i-1].at.split('/').slice(1).join('/')+' in '+(NAME[t.steps[i-1].at.split('/')[0]])}${i===t.steps.length-1?'; the key lies here':''}`+BLANK); }});
    for (const c of V.callbacks) if (c.at===path) { n++; p(`${n}. now, callback, after you have seen ${c.after.split('/').slice(1).join('/')} in ${NAME[c.after.split('/')[0]]}`+BLANK); }
    p('');
  }
}
p(`_${n} slots._`);
process.stdout.write(L.join('\n')+'\n');
