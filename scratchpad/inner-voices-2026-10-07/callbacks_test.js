// every callback, both orders, on a fresh save each time. run after extracting /tmp/voices.js (see engine_test.js)
const store={}; global.localStorage={getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]};
global.document={createElement:()=>({}),head:{appendChild(){}},getElementById:()=>null};
global.window=global; window._passageGen=1;
eval(require('fs').readFileSync('/tmp/voices.js','utf8'));
const v=window.dssVoices, V=window.DSS_VOICES;
const line=(p)=>{const [r,...n]=p.split('/');return (v.lines(r,n.join('/')).find(l=>l.voice==='now')||{}).text;};
let bad=0;
V.callbacks.forEach(c=>{
  v.forget(); const plain=line(c.at); v.see(c.after); const fwd=line(c.at);   // after first, then at
  v.forget(); v.see(c.at); const rev=line(c.at);                                // at first: no callback yet
  v.see(c.after); const revLater=line(c.at);                                    // ...back to at once after is seen
  const ok = fwd===c.now && rev===plain && revLater===c.now;
  if(!ok) bad++;
  console.log((ok?'ok  ':'BAD ')+c.after+' -> '+c.at+' | fwd: '+fwd+' | at-first: '+rev+' | at-again: '+revLater);
});
console.log(bad?bad+' callbacks wrong':'all callbacks fire after their object, and not before');
