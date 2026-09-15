const fs=require('fs'),vm=require('vm');const s=fs.readFileSync('Dream Street Shuffle.twee','utf8');const m=[...s.matchAll(/^:: (.+?)(?:\s+\[([^\]]*)\])?(?:\s+(\{[^\n]+\}))?\s*$/gm)];const names=m.map(x=>x[1]);let errors=[],scripts=0,links=0;
m.forEach((h,i)=>{const body=s.slice(h.index+h[0].length,m[i+1]?.index??s.length);if((h[2]||'').includes('stylesheet'))return;
const blocks=(h[2]||'').split(' ').includes('script')?[body]:[...body.replace(/<!--[\s\S]*?-->/g,'').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
blocks.forEach(js=>{scripts++;try{new vm.Script(js)}catch(e){errors.push(h[1]+': '+e.message)}});
if((h[2]||'').split(' ').includes('script'))return;
for(const x of body.replace(/<!--[\s\S]*?-->/g,'').matchAll(/\[\[([^\]\n]+)\]\]/g)){let t=x[1];if(t.includes('|'))t=t.split('|').at(-1);else if(t.includes('->'))t=t.split('->').at(-1);else if(t.includes('<-'))t=t.split('<-')[0]; links++;if(!names.includes(t))errors.push('Missing '+t);}
});const out={passages:names.length,scripts,literalLinks:links,duplicates:names.filter((n,i)=>names.indexOf(n)!==i),errors};console.log(JSON.stringify(out));fs.writeFileSync('/tmp/dss-static-results.json',JSON.stringify(out,null,2));if(errors.length)process.exit(1);
