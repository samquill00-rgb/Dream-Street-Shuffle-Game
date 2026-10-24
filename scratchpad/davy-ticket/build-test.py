from pathlib import Path
import shutil
root=Path.cwd();out=root/'scratchpad/davy-ticket';s=(root/'Dream Street Shuffle.twee').read_text()
s+='''
:: Test Davy setup
(set: $metDavy to true)(set: $inisToldOfPillars to true)(set: $dreamKey to "ticket")(set: $keyTicket to "held")(set: $keyLighter to "seed")(set: $davyPaperAsked to false)(set: $davyTicketPhase to "")(set: $davyTicketReady to false)(set: $davyTicketFragment to false)(set: $easterViaDavy to false)(set: $easterHomeFight to false)(set: $worldsVisited to (a:))(set: $easterReclaim to false)(set: $easterGlyph to false)(set: $confidence to 70)(set: $sobriety to 70)
[[Begin errand|Davy’s note]]
:: Test other venue [venue-french]
A different venue.
[[Return to DAVY|Davy’s note]]
:: Test ready empty
(set: $metDavy to true)(set: $inisToldOfPillars to true)(set: $davyPaperAsked to true)(set: $davyTicketPhase to "writing")(set: $davyTicketReady to true)(set: $davyTicketFragment to false)(set: $keyTicket to "Davy’s note")(set: $dreamKey to "")(set: $keyLighter to "seed")(set: $worldsVisited to (a:))(set: $easterGlyph to false)
[[Collect ticket|Davy’s note]]
:: Test home fight
(set: $easterHomeFight to true)(set: $easterViaDavy to true)(set: $easterGlyph to true)(set: $worldsVisited to (a: "easter"))
[[Test return fight|The Reclamation]]
:: Test ordinary island
(set: $davyTicketFragment to false)(set: $easterViaDavy to false)(set: $easterHomeFight to false)
[[Ordinary island choices|Among the Moai]]
:: Test controls [footer]
<details id="davy-test-controls"><summary>TEST CONTROLS</summary><button type="button" onclick="if(window._rcDev)window._rcDev.win()">TEST: win fight</button><button type="button" onclick="if(window._rcDev)window._rcDev.lose()">TEST: lose fight</button>
<div id="test-state">phase=(print: $davyTicketPhase); ready=(print: $davyTicketReady); fragment=(print: $davyTicketFragment); key=(print: $dreamKey); ticket=(print: $keyTicket); lighter=(print: $keyLighter); homefight=(print: $easterHomeFight); glyph=(print: $easterGlyph); worlds=(print: $worldsVisited)</div>
[[TEST: DAVY|Davy’s note]]
[[TEST: elsewhere|Test other venue]]
[[TEST: street|Dean Street]]
[[TEST: Colony|The Colony Room]]
(if: $dreamKey is "")[(link: "TEST: pocket lighter")[(set: $keyPick to "lighter")(display: "Key Set Held")]]
[[TEST: portal|Third Pillar Portal]]
[[TEST: island|Among the Moai]]
[[TEST: reset|Test Davy setup]]
</details>
'''
(out/'test.twee').write_text(s);shutil.copyfile(root/'Dream Street Shuffle.html',out/'test.html')
code=(root/'sync_html.py').read_text().replace('twee_path = os.path.join(_here, "Dream Street Shuffle.twee")','twee_path = '+repr(str(out/'test.twee'))).replace('html_path = os.path.join(_here, "Dream Street Shuffle.html")','html_path = '+repr(str(out/'test.html')))
code=code.replace("f.write(html_content)", 'f.write(html_content.replace("<head>", \'<head><base href="/">\', 1))')
# Preserve relative vendor paths in the scratch fixture.
exec(compile(code,str(root/'sync_html.py'),'exec'),{'__file__':str(root/'sync_html.py')})
# This fixture's extra stylesheet supplies its base URL through a tiny server redirect wrapper.
