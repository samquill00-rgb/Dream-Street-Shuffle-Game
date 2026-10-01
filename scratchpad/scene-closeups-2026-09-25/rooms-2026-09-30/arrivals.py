import sys
from playwright.sync_api import sync_playwright
ROOMS = {'cu': 'Turn to Copper', 'cb': 'Coach and Horses bar', 'ti': "Trisha's", 'lk': "Martin Lackland's Office", 'cf': 'Chinese Fish and Chips', 'oi': "O'Flatterly's shop"}
out = sys.argv[1]
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    for rid, name in ROOMS.items():
        p = b.new_page(viewport={'width': 1280, 'height': 900})
        errs = []; p.on('pageerror', lambda e: errs.append(str(e)))
        p.goto('http://127.0.0.1:8777/Dream%20Street%20Shuffle.html?dev=1#dss-debug-jump=' + name.replace(' ', '%20').replace("'", '%27'))
        for _ in range(60):
            p.wait_for_timeout(500)
            if p.evaluate("(id) => !!document.querySelector('#' + id + '-wrap canvas') && (document.getElementById(id + '-wrap').dataset.cam === 'idle')", rid): break
        p.wait_for_timeout(2500)
        p.evaluate("(id) => document.getElementById(id + '-wrap').scrollIntoView({block: 'start'})", rid); p.wait_for_timeout(800)
        print(rid, p.evaluate("() => (document.querySelector('tw-passage') || {}).getAttribute && document.querySelector('tw-passage').getAttribute('data-passage') || document.title"), 'errs', errs,
              'wrap', p.evaluate("(id) => { const w = document.getElementById(id + '-wrap'); return w ? [w.offsetWidth, w.offsetHeight] : null; }", rid))
        p.screenshot(path='%s/real-%s.png' % (out, rid)); p.close()
    b.close()
