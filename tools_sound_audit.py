#!/usr/bin/env python3
"""Dream Street Shuffle sound audit (2026-11-14, Sam: "spend the four hours on a sound audit you can listen to").

Plays every sound the game can make, one at a time, in the same headless and muted browser the regression player
uses, records what the game actually sends to the speakers (after its own gains), measures it, and writes

    sound-audit/levels.json     every sound: loudness, peak, length, where it is called from, any flag
    sound-audit/clips/*.m4a     the recording of each, at its in-game level
    sound-audit/index.html      a listening page: every sound with a play button, over a bed of your choosing

Run after sync_html.py:   ~/.dss-regress/venv/bin/python tools_sound_audit.py            (everything, about 20 minutes)
                          ~/.dss-regress/venv/bin/python tools_sound_audit.py coin bed:   (names containing these)
                          ~/.dss-regress/venv/bin/python tools_sound_audit.py --page      (rebuild the page from levels.json)
Nothing opens on screen and nothing makes a sound. Listen with the preview server: /sound-audit/index.html

Loudness is K-weighted (EBU R128, through ffmpeg): beds and music by their integrated loudness, one-shot cues by
their loudest 400 ms, since a click has no integrated loudness to speak of. The recording passes through Opus on its
way out of the browser, which moves levels by a fraction of a dB at most.
"""
import base64, json, os, re, subprocess, sys, time
import tools_regress as tr
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "sound-audit"); CLIPS = os.path.join(OUT, "clips")
TWEE = os.path.join(ROOT, "Dream Street Shuffle.twee")

# not sounds: switches, stops, loaders, readouts
SKIP = re.compile(r"^(_|stop|prime|set|is|update|register|pause|resume|prewarm|start(TagTicks|Bed|Music)$|tagTickCount|soloBed|bedLevel|bedPlaying|fadeBed|letBedFinish|"
                  r"ambientOff|ambientCut|spotSound|sfxTake|scoreCue|transitionDistance|playTransition$)")
# what to call a sound with when no arguments would say nothing, and the extra versions worth hearing
ARGS = {"fightCall": [["fight"], ["round_1"], ["you_win"]], "revoShout": [[False], [True]], "gust": [[False], [True]], "surfWash": [[False], [True]],
        "pongPoint": [[True], [False]], "typeKey": [["a"]], "keyPickup": [["cocaine"]], "phoneBell": [[]], "doorKnock": [[3]], "footstep": [[0]],
        "chirp": [[0.7, False]], "heartbeat": [[]], "landThud": [[1]], "fairyTwinkle": [[]], "fireCrackle": [[]], "pubPass": [[1]], "pillarsShanty": [[True]],
        "trombonePhrase": [[[[58, 0.45], [62, 0.45], [65, 0.7]]]], "humPhrase": [[[[58, 0.45], [62, 0.45], [65, 0.7]]]], "jeffreyTune": [[]], "typewriterTick": [[0.35]], "distantTraffic": [[]], "phoneRing": [[]]}
# sounds that go on until told to stop: how long to listen, and what stops them
STREAMS = {"startPissStream": (7, None), "startRetchStream": (7, None), "distantTraffic": (8, "stopDistantTraffic"), "phoneBell": (7, "stopPhoneBell"),
           "phoneLine": (5, "stopPhoneLine"), "ambientPub": (8, "ambientOff"), "ambientDream": (8, "ambientOff"), "windFarnell": (8, "ambientOff"),
           "fireFarnell": (8, "ambientOff"), "fireCrackle": (7, None), "pubPass": (8, "pubPass(null, 0.1)"), "pillarsShanty": (10, "pillarsShanty(false)"), "jeffreyTune": (10, None)}

TAP = r"""(function () {
  var C = AudioNode.prototype.connect, A = window.__aud = { ac: null, dest: null, an: null };
  function ensure(ac) { if (ac.__audDest) return; ac.__audDest = ac.createMediaStreamDestination(); ac.__audAn = ac.createAnalyser(); ac.__audAn.fftSize = 2048; A.ac = ac; A.dest = ac.__audDest; A.an = ac.__audAn; }
  AudioNode.prototype.connect = function (dst) { var r = C.apply(this, arguments); try { if (dst instanceof AudioDestinationNode) { ensure(dst.context); C.call(this, dst.context.__audDest); C.call(this, dst.context.__audAn); } } catch (e) {} return r; };
  var buf = new Float32Array(2048);
  A.level = function () { if (!A.an) return -120; A.an.getFloatTimeDomainData(buf); var s = 0; for (var i = 0; i < buf.length; i++) s += buf[i] * buf[i]; return 10 * Math.log10(s / buf.length + 1e-12); };
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  A.quiet = async function (maxMs) { var t0 = performance.now(), q = 0; while (performance.now() - t0 < maxMs) { if (A.level() < -78) { q += 50; if (q >= 500) return true; } else q = 0; await sleep(50); } return false; };
  /* record what reaches the speakers while fn runs: at least minMs, then until it has been quiet for 600 ms, at most maxMs */
  A.record = async function (code, minMs, maxMs, after) {
    if (!A.dest) return { err: 'no audio context yet' };
    var mr = new MediaRecorder(A.dest.stream, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 192000 }), chunks = [], err = null, heard = false;
    mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
    mr.start(); await sleep(300);
    var t0 = performance.now(); try { (0, eval)(code); } catch (e) { err = String(e).slice(0, 160); }
    var q = 0;
    while (true) { var el = performance.now() - t0, lv = A.level(); if (lv > -70) heard = true; if (lv < -78) q += 40; else q = 0; if (el >= maxMs) break; if (el >= minMs && q >= 600) break; await sleep(40); }
    var ms = performance.now() - t0;
    if (after) { try { (0, eval)(after); } catch (e) {} }
    await sleep(900); /* the recorder runs some hundreds of ms behind the graph: a short cue was still in the pipe */ mr.stop(); await new Promise(function (r) { mr.onstop = r; });
    var blob = new Blob(chunks, { type: 'audio/webm' }), ab = await blob.arrayBuffer(), u8 = new Uint8Array(ab), s = '';
    for (var i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return { b64: btoa(s), ms: Math.round(ms), err: err, heard: heard };
  };
})();"""

HUSH = r"""async (labels) => { var A = window.dssAudio; try { A.stopMusic(); } catch (e) {} try { A.ambientOff(); } catch (e) {} try { A.startTagTicks([]); } catch (e) {}
  ['stopDistantTraffic', 'stopPhoneBell', 'stopPhoneLine'].forEach(function (f) { try { A[f](); } catch (e) {} });
  labels.forEach(function (l) { try { A.soloBed(l, false); A.stopBed(l); } catch (e) {} }); return await window.__aud.quiet(6000); }"""


def measure(path):
    """K-weighted integrated loudness, loudest 400 ms, true peak and length of an audio file."""
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    txt = p.stderr
    ms = [float(x) for x in re.findall(r"\bM:\s*(-?\d+\.\d+)", txt)]
    summary = txt[txt.rfind("Summary:"):] if "Summary:" in txt else ""
    i = re.search(r"I:\s*(-?\d+\.\d+) LUFS", summary); pk = re.search(r"Peak:\s*(-?\d+\.\d+|-inf) dBFS", summary)
    d = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", path], capture_output=True, text=True).stdout.strip()
    return {"I": float(i.group(1)) if i else None, "M": max(ms) if ms else None, "peak": (None if not pk or pk.group(1) == "-inf" else float(pk.group(1))), "secs": float(d) if d and d != "N/A" else None}


def save(name, b64):
    os.makedirs(CLIPS, exist_ok=True)
    raw = os.path.join(CLIPS, name + ".webm"); wav = os.path.join(CLIPS, name + ".wav"); m4a = os.path.join(CLIPS, name + ".m4a")
    open(raw, "wb").write(base64.b64decode(b64))
    # nothing is trimmed: the recorder leaves out the silence before a sound by itself (a first version trimmed a quarter second and cut the clicks off whole)
    try:
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", raw, "-af", "apad=pad_dur=0.5", "-ar", "48000", wav], check=True, capture_output=True)
        m = measure(wav)
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", wav, "-c:a", "aac", "-b:a", "112k", m4a], check=True, capture_output=True)
    except subprocess.CalledProcessError:
        m = {"I": None, "M": None, "peak": None, "secs": 0.0}   # the recorder handed back nothing readable; take() tries once more
    for f in (raw, wav):
        if os.path.exists(f): os.remove(f)
    return m


def source_facts():
    """From the .twee: the beds registered, and how often each sound function is called (outside its own definition and the export list)."""
    s = open(TWEE, encoding="utf-8").read()
    beds = []
    for m in re.finditer(r"registerAmbientBed\(\{(.*?)\}\);", s, re.S):
        body = m.group(1); lab = re.search(r"label:\s*'([^']+)'", body)
        if not lab: continue
        tags = re.search(r"\btags:\s*\{([^}]*)\}", body); vol = re.search(r"\bvolume:\s*([\d.]+)", body)
        beds.append({"label": lab.group(1), "tags": re.findall(r"'([^']+)'", tags.group(1)) if tags else [], "volume": float(vol.group(1)) if vol else 0.18, "score": bool(re.search(r"\bscore:", body))})
    seen = set(); beds = [b for b in beds if not (b["label"] in seen or seen.add(b["label"]))]
    return s, beds


def uses(s, name):
    n = len(re.findall(r"(?<![\w$])" + re.escape(name) + r"\s*\(", s)) + len(re.findall(r"[\[, (]" + re.escape(name) + r"\s*[\],)]", s))
    n -= len(re.findall(r"function\s+" + re.escape(name) + r"\s*\(", s))
    ticks = bool(re.search(r"TAG_TICKS[\s\S]{0,4000}?\b" + re.escape(name) + r"\b", s)) and bool(re.search(r"min:\s*\d+,\s*max:\s*\d+,\s*fn:[^\n]*\b" + re.escape(name) + r"\b", s))
    spot = bool(re.search(r"\['[a-z ]+',\s*" + re.escape(name) + r"\]", s))
    return max(0, n), ticks, spot


def run(want):
    src, beds = source_facts()
    srv = tr.serve(); port = srv.server_address[1]
    rows = []; t_all = time.time()
    old = {}
    if os.path.exists(os.path.join(OUT, "levels.json")) and want:
        old = {r["id"]: r for r in json.load(open(os.path.join(OUT, "levels.json")))["rows"]}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=tr.chrome_path(), headless=True, args=tr.FLAGS)
        ctx = browser.new_context(viewport={"width": 1440, "height": 900}); ctx.add_init_script(TAP)
        page = ctx.new_page()
        labels = [b["label"] for b in beds]
        # the stage: an empty passage with no tags, added to the served html the way the regression player adds its scratch passages.
        # (Dean Street will not do: its map has cabs, pigeons and a pub walk-by of its own, which leaked into the first recordings.)
        class _R: pass
        _r = _R(); _r.page = page; tr.scratch_passage(_r, "T-quiet", "quiet")

        def fresh():
            page.goto("http://127.0.0.1:%d/%s?t=%d&start=T-quiet" % (port, tr.HTML, int(time.time())), timeout=90000)
            page.wait_for_timeout(5000)
            page.evaluate("() => { try { window.dssAudio.tabTick(); } catch (e) {} }"); page.wait_for_timeout(600)
            page.evaluate(HUSH, labels)

        def take(rid, kind, name, code, min_ms, max_ms, after=None, extra=None, before=None, ready=None, tries=2):
            if want and not any(w in rid.lower() for w in want):
                if rid in old: rows.append(old[rid])
                return
            if not page.evaluate(HUSH, labels):
                fresh()
            if before:
                # a bed is fetched, decoded and faded in before it is at its level: start it, wait for it, let it settle, then listen
                page.evaluate("(c) => { (0, eval)(c); }", before)
                try: page.wait_for_function(ready, timeout=20000)
                except Exception: pass
                page.wait_for_timeout(5000)
            r = page.evaluate("([c, a, b, d]) => window.__aud.record(c, a, b, d)", [code, min_ms, max_ms, after])
            row = {"id": rid, "kind": kind, "name": name, "code": code, "err": r.get("err"), "heard": bool(r.get("heard"))}
            if r.get("b64"):
                row.update(save(re.sub(r"[^A-Za-z0-9_.-]+", "_", rid), r["b64"]))
                if row.get("secs"): row["clip"] = "clips/" + re.sub(r"[^A-Za-z0-9_.-]+", "_", rid) + ".m4a"
            if extra: row.update(extra)
            if (row.get("secs") or 0) < 0.65 and tries > 1:   # half a second of that is the pad
                fresh(); return take(rid, kind, name, code, max(min_ms, 1500), max_ms, after, extra, before, ready, tries - 1)   # the recorder came back empty: once more on a clean page
            rows.append(row)
            print("%-34s %s  M %s  I %s  peak %s  %.1f s%s" % (rid, "heard " if row["heard"] else "SILENT", row.get("M"), row.get("I"), row.get("peak"), row.get("secs") or 0, "  ERR " + row["err"] if row["err"] else ""), flush=True)

        fresh()
        names = page.evaluate("() => Object.keys(window.dssAudio).filter(k => typeof window.dssAudio[k] === 'function')")
        # ---- the music and the beds
        if not want or any(w in "music:theme" for w in want):
            # the theme plays only on Dean Street, so it is recorded there, a few seconds in (the street's own small sounds may be in it)
            page.goto("http://127.0.0.1:%d/%s?t=%d&start=Dean%%20Street" % (port, tr.HTML, int(time.time())), timeout=90000); page.wait_for_timeout(9000)
            r = page.evaluate("([c, a, b, d]) => window.__aud.record(c, a, b, d)", ["void 0", 12000, 12000, None])
            row = {"id": "music:theme", "kind": "music", "name": "Dream Street theme (on Dean Street)", "code": "window.dssAudio.startMusic()", "err": r.get("err"), "heard": bool(r.get("heard")), "uses": 1}
            if r.get("b64"):
                row.update(save("music_theme", r["b64"]))
                if row.get("secs"): row["clip"] = "clips/music_theme.m4a"
            rows.append(row); print("music:theme I %s" % row.get("I"), flush=True); fresh()
        elif "music:theme" in old: rows.append(old["music:theme"])
        live = set(page.evaluate("(ls) => ls.filter(l => window.dssAudio.bedLevel(l) != null)", labels))
        for b in beds:
            if b["score"] or b["label"] not in live: continue   # a bed named only in a comment is not in the game
            take("bed:" + b["label"], "bed", b["label"], "void 0", 10000, 10000, "window.dssAudio.stopBed(%s)" % json.dumps(b["label"]),
                 {"tags": b["tags"], "volume": b["volume"], "uses": 1}, before="window.dssAudio.startBed(%s)" % json.dumps(b["label"]), ready="() => window.dssAudio.bedPlaying(%s)" % json.dumps(b["label"]))
        # ---- every cue
        for n in sorted(names):
            if SKIP.search(n): continue
            u, ticks, spot = uses(src, n)
            for i, args in enumerate(ARGS.get(n, [[]])):
                rid = "cue:" + n + ("" if len(ARGS.get(n, [[]])) == 1 else ":" + "-".join(str(a) for a in args))[:40]
                code = "window.dssAudio.%s(%s)" % (n, ", ".join(json.dumps(a) for a in args))
                secs, stop = STREAMS.get(n, (None, None))
                if secs: take(rid, "stream", n, code, secs * 1000, secs * 1000, ("window.dssAudio." + (stop if "(" in stop else stop + "()")) if stop else None, {"uses": u, "ticks": ticks, "spot": spot})
                else: take(rid, "cue", n, code, 900, 9000, None, {"uses": u, "ticks": ticks, "spot": spot})
            if n in STREAMS and not STREAMS[n][1]: fresh()   # a stream with no stop: start clean
        browser.close()
    srv.shutdown()
    os.makedirs(OUT, exist_ok=True)
    json.dump({"made": time.strftime("%Y-%m-%d %H:%M"), "rows": rows}, open(os.path.join(OUT, "levels.json"), "w"), indent=1)
    print("%d sounds in %.0f s" % (len(rows), time.time() - t_all))


# what the numbers cannot say: things found by reading the code beside the measurement (2026-11-14)
NOTES = {
    "cue:glassSmash": "Clips: its peak is 3.6 dB over full scale, and it is the loudest thing in the game by about 7 dB. You asked for it stronger on 8 November (\"too weak\"), so it is left as it is; say if you want the same weight without the clipping.",
    "bed:coach-bar": "The quietest pub: 7 dB under the French and 10 under the Pillars. Deliberate so far (each pub floor was levelled to the generated bed it replaced), but worth a listen side by side.",
    "bed:piano-eoin": "The Dawn piano is the loudest bed in the game, 8 dB over the Dean Street theme. It is the ending, so probably meant.",
    "bed:cave-shanti": "Plays 9 dB louder than the same file does as the Climb music: it starts further into the piece, where the chant is at full voice.",
    "bed:world-ezekiel-music": "Reads quiet only because its first 20 seconds are quiet; the piece as a whole is level with the other world musics.",
    "cue:typewriterTick": "Could not be recorded: it is a 20 ms click, shorter than the recorder's smallest frame. It is heard in the game (11 call sites).",
    "cue:typeKey": "The same 20 ms click as typewriterTick, under another name.",
    "cue:footstep": "Called here with no surface, which gives its quietest form; on cobble (the Soho map) it is mapFootstep, 11 dB louder.",
    "cue:humPhrase": "Measured on three test notes of mine, not a phrase from the game.",
    "cue:trombonePhrase": "Measured on three test notes of mine, not a phrase from the game.",
}


def tick_contexts(src, rows):
    """The random room sounds (TAG_TICKS) against the loudest bed on the same pages: a sound far under its bed is not heard."""
    by = {r["id"]: r for r in rows}; out = []
    m = re.search(r"var TAG_TICKS = \{(.*?)\n  \};", src, re.S)
    if not m: return out
    for tag, body in re.findall(r"'([a-z-]+)':\s*\{\s*min:\s*\d+,\s*max:\s*\d+,\s*fn:\s*function\(\)\{(.*?)\}\s*\}", m.group(1)):
        beds = [r for r in rows if r["kind"] == "bed" and tag in (r.get("tags") or []) and r.get("I") is not None]
        if not beds: continue
        top = max(beds, key=lambda r: r["I"])
        for name in sorted(set(re.findall(r"\b([a-zA-Z]+)\b", body))):
            for rid in [k for k in by if k == "cue:" + name or k.startswith("cue:" + name + ":")]:
                c = by[rid]
                if c.get("M") is None: continue
                out.append({"tag": tag, "cue": rid, "cueLevel": c["M"], "bed": top["id"], "bedLevel": top["I"], "margin": round(c["M"] - top["I"], 1)})
    return out


def flag(rows):
    """Mark what stands out. The game's own level map: music beds about -31 LUFS, room floors -43 to -52, cues about -26 at their loudest 400 ms."""
    for r in rows:
        f = []
        lv = r.get("I") if r["kind"] in ("bed", "music") else r.get("M")
        r["level"] = lv
        if lv is None or lv < -100: f.append("nothing recorded")
        elif r["kind"] in ("cue", "stream"):
            if lv > -12: f.append("far louder than any other cue")
            elif lv > -18: f.append("among the loudest cues")
            elif lv < -52: f.append("very quiet: under every bed in the game")
        if r.get("peak") is not None and r["peak"] > -0.3: f.append("peaks over full scale: it clips")
        if r.get("uses") == 0: f.append("not called anywhere in the game")
        if r.get("err"): f.append("error when called this way: " + r["err"][:60])
        r["flags"] = f; r["note"] = NOTES.get(r["id"], "")
    return rows


def page():
    d = json.load(open(os.path.join(OUT, "levels.json"))); rows = flag(d["rows"])
    ctx = tick_contexts(open(TWEE, encoding="utf-8").read(), rows)
    data = {"made": d["made"], "rows": rows, "contexts": ctx}
    json.dump(data, open(os.path.join(OUT, "levels.json"), "w"), indent=1)
    tpl = open(os.path.join(ROOT, "tools_sound_audit_page.html"), encoding="utf-8").read()
    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(tpl.replace("/*DATA*/", json.dumps(data)))
    fl = [r for r in rows if r["flags"] or r["note"]]
    print("page written: sound-audit/index.html (%d sounds, %d flagged or noted)" % (len(rows), len(fl)))
    for r in sorted(fl, key=lambda r: (r["kind"], -(r["level"] if r["level"] is not None else -999))):
        print("  %-30s %7s  %s" % (r["id"], "%.1f" % r["level"] if r["level"] is not None else "-", "; ".join(r["flags"]) or "(note)"))
    print("random room sounds against their beds (cue minus bed, dB):")
    for c in sorted(ctx, key=lambda c: c["margin"]):
        print("  %-18s %-22s %6.1f  under %-24s %6.1f  -> %+.1f%s" % (c["tag"], c["cue"][4:], c["cueLevel"], c["bed"][4:], c["bedLevel"], c["margin"], "  BURIED" if c["margin"] < -10 else ""))


if __name__ == "__main__":
    a = [x for x in sys.argv[1:]]
    if "--page" not in a: run([x.lower() for x in a if not x.startswith("--")])
    page()
