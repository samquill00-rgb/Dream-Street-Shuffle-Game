import sys, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
g = Game(width=1440, height=900); p = g.page(None, "", audit_header=False); p.wait_for_timeout(2500)
p.evaluate("(t) => { const l=[...document.querySelectorAll('tw-link')].find(e=>e.textContent.trim()===t); l && l.click(); }", "BEGIN"); p.wait_for_timeout(3500)
r = p.evaluate("""() => new Promise(res => { const l=[...document.querySelectorAll('tw-link')].find(e=>e.textContent.trim()==='Step into the night'); const t0=performance.now(); const out=[]; const tick=()=>{ const t=Math.round(performance.now()-t0); if(out.length===0 || t-out[out.length-1].t>=45){ out.push({t, story: document.querySelector('tw-story').className, ps: [...document.querySelectorAll('tw-passage')].map(e=>{const cs=getComputedStyle(e); return [e.innerText.trim().slice(0,6), cs.opacity.slice(0,4), cs.display, cs.visibility, e.parentElement.tagName.toLowerCase()+'.'+e.parentElement.className, e.getAttribute('data-raw')||'', (e.getAttribute('class')||'')]})}); } if(t<1400) requestAnimationFrame(tick); else res(out); }; l.click(); tick(); })""")
for row in r: print(row['t'], row['story'], row['ps'])
g.close()
