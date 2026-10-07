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
p('Every voice slot, by venue. Write your line after the `>`. Each shows pink in the game until written. When done, `sheet_apply.py` (beside sheet.js in the scratchpad) puts the lines into the table.');
p('');
p(`- **now**: you now. **then**: the idealised you (the child, the imagined future). **id**: speaks only at ${idNote}.`);
p('- A trail line replaces that object\'s own **then**. A callback line replaces its **now** once the earlier object has been seen.');
p('');
// essential: what the game needs to work (trail steps, the key objects' own lines, callbacks, the id); the rest optional
const keyObj=new Set(Object.values(V.trails).map(t=>t.steps[t.steps.length-1].at));
const body=[]; let n=0, ess=0;
const slot=(text,e)=>{ n++; if(e) ess++; body.push(`${n}. ${e?'**essential**':'optional'} · ${text}`+BLANK); };
for (const room of Object.keys(V.objects)) {
  body.push(`## ${NAME[room]||room}`); body.push('');
  for (const [obj,slots] of Object.entries(V.objects[room])) {
    const path=room+'/'+obj;
    body.push(`### ${obj}${keyObj.has(path)?' (a key lies here)':''}`);
    for (const v of ['now','then','id']) if (slots[v]!=null) slot(`${v}${v==='id'?' (when the id speaks)':''}`, v==='id'||keyObj.has(path));
    for (const [k,t] of Object.entries(V.trails)) t.steps.forEach((st,i)=>{ if(st.at===path) slot(`then, ${k} trail step ${i+1} of ${t.steps.length} (${t.world})${i===0?', always shows here':', after you have seen '+t.steps[i-1].at.split('/').slice(1).join('/')+' in '+(NAME[t.steps[i-1].at.split('/')[0]])}`, true); });
    for (const c of V.callbacks) if (c.at===path) slot(`now, callback, after you have seen ${c.after.split('/').slice(1).join('/')} in ${NAME[c.after.split('/')[0]]}`, true);
    body.push('');
  }
}
L.splice(2, 0, `**${ess} essential slots** (trail steps, the objects where keys lie, callbacks, the id): write these first and the game works. The other ${n-ess} are optional. ${n} in all.`, '');
p('');
p('To quiet an optional slot, set it to `\'\'` in the table: the player then sees nothing there, no gap. A slot not yet written still shows pink.');
p('');
body.forEach(x=>p(x));
process.stdout.write(L.join('\n')+'\n');
