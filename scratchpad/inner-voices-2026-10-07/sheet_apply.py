"""Put the lines written in the sheet into the table.
Usage: python3 sheet_apply.py "Voices writing sheet.md" ["Dream Street Shuffle.twee"]
Each sheet entry is "N. essential|optional · <what>" under "### object" under "## venue", then a "> line".
A filled line replaces that slot's text in DSS_VOICES; an empty line is left alone. Then run sync_html.py.
Prints every slot it set and every entry it could not place."""
import re, sys, os
SHEET = sys.argv[1]
TWEE = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'Dream Street Shuffle.twee')
NAME = {'The French': 'fi', 'The Colony Room': 'ci', 'The Pillars of Hercules': 'pi', 'Ronnie Scott’s': 'ri', 'Copper’s cellar': 'cu',
        'The Coach and Horses': 'cb', 'Trisha’s': 'ti', 'Lackland’s office': 'lk', 'O’Flatterly’s shop': 'oi', 'The chippy': 'cf'}
src = open(TWEE, encoding='utf-8').read()
a, b = src.index('// >>>> DSS VOICES BEGIN'), src.index('// <<<< DSS VOICES END')
table = src[a:b]

def js(s): return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"

def set_own(room, obj, voice, line):
    # the object's line inside its room block: 'obj': { ..., voice: '...', ... }
    rb = re.search(r"^'" + re.escape(room) + r"': \{\n", table, re.M)
    if not rb: return False
    end = table.index('\n},', rb.end())
    block = table[rb.end():end]
    m = re.search(r"^'" + re.escape(obj) + r"': \{(.*)\}", block, re.M)
    if not m: return False
    inner = m.group(1)
    # the key sits at the start of the inner text or after ', ', never inside a value
    n = re.subn(r"(^ *|, )" + voice + r": '(?:[^'\\]|\\.)*'", lambda mm: mm.group(1) + voice + ': ' + js(line), inner, count=1)
    if n[1] != 1: return False
    new_block = block[:m.start(1)] + n[0] + block[m.end(1):]
    globals()['table'] = table[:rb.end()] + new_block + table[end:]
    return True

def set_in(pattern, repl):
    n = re.subn(pattern, repl, table, count=1, flags=re.M)
    if n[1] != 1: return False
    globals()['table'] = n[0]; return True

room = obj = None; head = None; pend = []; done = []; lost = []
def flush():
    global head, pend
    if head is None: return
    line = ' '.join(x for x in pend if x).strip(); num, what = head; head = None; pend = []
    if not line or room is None or obj is None: return
    place(num, what, line)
def place(num, what, line):
    path = room + '/' + obj
    ok = False
    if what.startswith('then, ') and ' trail step ' in what:
        ok = set_in(r"(\{ at: " + re.escape(js(path)) + r", then: )'(?:[^'\\]|\\.)*'", lambda mm: mm.group(1) + js(line))
    elif what.startswith('now, back'):
        # the back line lives on the callback whose 'after' is this object: replace its back, or add one before the closing brace
        pat = r"(\{ at: '[^']*', after: " + re.escape(js(path)) + r", now: '(?:[^'\\]|\\.)*')(, back: '(?:[^'\\]|\\.)*')?( \})"
        ok = set_in(pat, lambda mm: mm.group(1) + ', back: ' + js(line) + mm.group(3))
    elif what.startswith('now, callback'):
        ok = set_in(r"(\{ at: " + re.escape(js(path)) + r", after: '[^']*', now: )'(?:[^'\\]|\\.)*'", lambda mm: mm.group(1) + js(line))
    else:
        voice = what.split(' ')[0]
        if voice in ('now', 'then', 'id'): ok = set_own(room, obj, voice, line)
    (done if ok else lost).append((num, path, what, line))
for raw in open(SHEET, encoding='utf-8'):
    ln = raw.rstrip('\n')
    if ln.startswith('## ') and not ln.startswith('### '): flush(); room = NAME.get(ln[3:].strip()); obj = None; continue
    if ln.startswith('### '): flush(); obj = re.sub(r' \(a key lies here\)$', '', ln[4:].strip()); continue
    m = re.match(r'^(\d+)\. (?:\*\*essential\*\*|optional) · (.*)$', ln)
    if m: flush(); head = (m.group(1), m.group(2)); continue
    m = re.match(r'^\s*> ?(.*)$', ln)
    if not m or head is None: continue
    # an answer may run over several '>' lines: gather them, then place the entry when the next heading comes
    pend.append(m.group(1).strip()); continue
flush()
if done:
    open(TWEE, 'w', encoding='utf-8').write(src[:a] + table + src[b:])
for d in done: print('set', d[0], d[1], '|', d[2], '->', d[3][:60])
for l in lost: print('COULD NOT PLACE', l[0], l[1], '|', l[2])
print(len(done), 'lines set,', len(lost), 'not placed. Now run: python3 sync_html.py')
