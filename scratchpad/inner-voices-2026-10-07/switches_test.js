// the two switches, off and on. run after extracting /tmp/voices.js (see engine_test.js)
const store={}; global.localStorage={getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]};
global.document={createElement:()=>({}),head:{appendChild(){}},getElementById:()=>null};
global.window=global; window._passageGen=1;
const src=require('fs').readFileSync('/tmp/voices.js','utf8'), a=require('assert');
function boot(sw){ eval(src.replace('switches: { callbacksBothWays: false, mapMark: false, keyCardOneLine: false }','switches: '+JSON.stringify(sw))); return window.dssVoices; }
let v=boot({callbacksBothWays:false,mapMark:false}); v.forget();
v.see('cf/the window'); a.equal(v.lines('fi','the window')[0].text,'[Sam: now / the window]');
a.equal(v.mapMark('chippy'),false); v.see('oi/the globe'); a.equal(v.mapMark('chippy'),false);
v=boot({callbacksBothWays:true,mapMark:true}); v.forget();
a.equal(v.lines('fi','the window')[0].text,'[Sam: now / the window]');
v.see('cf/the window'); a.equal(v.lines('fi','the window')[0].text,'[Sam: now / the window, back after the window, the chippy]');
v.see('fi/the window'); a.ok(v.lines('cf','the window')[0].text.includes('after the window, The French'));   // forward still wins at its own object
a.equal(v.mapMark('chippy'),false); v.see('oi/the globe'); a.equal(v.mapMark('chippy'),true);   // ticket trail begun: menu next
v.see('cf/the menu'); a.equal(v.mapMark('chippy'),true);  // ticket next
v.see('cf/the ticket'); a.equal(v.mapMark('chippy'),false);
v.see('cu/the bulb'); a.equal(v.mapMark('trishas'),true); a.equal(v.mapMark('colony'),false);
v.see('ci/the piano'); a.equal(v.mapMark('pillars'),true);
console.log('switch tests pass');
