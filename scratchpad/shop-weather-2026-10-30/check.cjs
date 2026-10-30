const fs=require('fs'),{createCanvas}=require('/Users/samquill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas'),THREE=require(process.cwd()+'/vendor/three/three.min.js');
const s=fs.readFileSync('Dream Street Shuffle.twee','utf8'),doc={createElement:()=>createCanvas(1,1)},win={};
const rnd=seed=>{let x=Math.sin(seed*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const tex=(w,h,draw)=>{let c=createCanvas(w,h);draw(c.getContext('2d'),w,h);return new THREE.CanvasTexture(c)};
new Function('window','document','THREE',fs.readFileSync('scratchpad/interior-textures-2026-10-28/surfaces.js','utf8'))(win,doc,THREE);
let k=s.indexOf('// >>>> DSS ROOM KIT BEGIN'),a=s.indexOf('function woodTex(',k),b=s.indexOf('function paintTex(',a);
const wood=new Function('window','tex','rnd',s.slice(a,b)+'return woodTex;')(win,tex,rnd);
a=s.indexOf('function oiWeatherSurface(');b=s.indexOf('var boardsTex =',a);
const weather=new Function('document','rnd',s.slice(a,b)+'return oiWeatherSurface;')(doc,rnd);
const floor=wood('#4a3420','#1a0e06',14);win.dssInteriorSurface(floor,'boards',157);weather(floor,4,6,false);
a=s.indexOf('var ceilTex =',b);b=s.indexOf('ceilTex.wrapS',a);const ceiling=new Function('tex','rnd',s.slice(a,b)+'return ceilTex;')(tex,rnd);weather(ceiling,3,5,true);
for(const [name,map] of [['floor',floor],['ceiling',ceiling]]){fs.writeFileSync('/private/tmp/inis-weathered-'+name+'.png',map.image.toBuffer('image/png'));if(map.image.width!==1024||map.repeat.x!==1)throw Error('Texture sizing');}
console.log('Both actual-source weathering textures generated successfully, 1024px, no extra texture objects.');
