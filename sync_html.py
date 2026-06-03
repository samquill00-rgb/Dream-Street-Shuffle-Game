#!/usr/bin/env python3
"""Sync the Twee file to the HTML file.
Updates all <tw-passagedata> elements, the <style id='twine-user-stylesheet'> tag,
and the <script id='twine-user-script'> tag."""

import re
import html
import os
import base64

# Paths are relative to this script's own directory
_here = os.path.dirname(os.path.abspath(__file__))
twee_path = os.path.join(_here, "Dream Street Shuffle.twee")
html_path = os.path.join(_here, "Dream Street Shuffle.html")

# ============================================================
# Audio embedding configuration
# ============================================================
# Each entry is a (placeholder, source-file, mime) tuple. At sync time, every
# placeholder string in the .twee UserScript is replaced with a base64 data URI
# of its source file, so the HTML works from file:// without a server.
#
# The hub theme uses AAC (.m4a) for sample-perfect gapless looping (MP3 has
# encoder padding on the loop seam). Venue ambient beds tolerate MP3 fine —
# they're field recordings at low volume, the seam is masked by texture.
#
# To add a new ambient bed: pick a placeholder name, drop the audio file in
# this directory, add a tuple here, and add a registerAmbientBed({ ... }) call
# in the .twee UserScript using the same placeholder string.
AUDIO_EMBEDS = [
    ("__DSS_MUSIC_DATA_URI__",       "Dream Street Shuffle experiment theme loop.m4a", "audio/mp4"),
    ("__DSS_PUB_DATA_URI__",         "the-french-pub-ambience.mp3",                    "audio/mpeg"),
    ("__DSS_PILLARS_DATA_URI__",     "the-pillars-pub-ambience.m4a",                   "audio/mp4"),
    ("__DSS_PIANO_DATA_URI__",       "piano-eoin-roe.mp3",                             "audio/mpeg"),
    ("__DSS_GENTS_DATA_URI__",       "the-gents-coach-toilet.mp3",                     "audio/mpeg"),
    ("__DSS_COACH_NIGHT_DATA_URI__", "the-coach-night-ambience.m4a",                   "audio/mp4"),
    ("__DSS_SOHO_DAWN_DATA_URI__",   "the-soho-dawn-ambience.m4a",                     "audio/mp4"),
    ("__DSS_GREEN_SEA_DATA_URI__",   "the-green-sea-cafe-ambience.m4a",                "audio/mp4"),
    ("__DSS_CARTHAGE_DATA_URI__",    "the-carthage-cicadas-ambience.m4a",              "audio/mp4"),
    ("__DSS_CARTHAGE_MELODY_DATA_URI__", "carthage-melody.mp3",                            "audio/mpeg"),
    ("__DSS_DIDOS_LAMENT_DATA_URI__", "didos-lament.mp3",                               "audio/mpeg"),
    ("__DSS_CELLAR_DATA_URI__",      "the-cellar-pump-ambience.m4a",                   "audio/mp4"),
    ("__DSS_QUIET_CAFE_DATA_URI__",  "the-quiet-cafe-ambience.m4a",                    "audio/mp4"),
    ("__DSS_RONNIES_DATA_URI__",     "the-ronnies-jazz-ambience.m4a",                  "audio/mp4"),
    ("__DSS_MINIGAME_DATA_URI__",    "the-minigame-retro.m4a",                         "audio/mp4"),
    ("__DSS_PONGMINI_DATA_URI__",    "the-pongmini-loop.m4a",                          "audio/mp4"),
    ("__DSS_JAZZMINI_DATA_URI__",    "the-jazzmini-loop.m4a",                          "audio/mp4"),
    ("__DSS_COWGAME_DATA_URI__",     "the-cowgame-loop.m4a",                           "audio/mp4"),
    ("__DSS_WALTZ_DATA_URI__",       "the-cecil-court-waltz.m4a",                      "audio/mp4"),
    ("__DSS_INTERVAL_RADIO_DATA_URI__", "the-interval-radio.m4a",                       "audio/mp4"),
    ("__DSS_LACKLAND_DATA_URI__",    "lacklands-office-music.mp3",                     "audio/mpeg"),
]

# ============================================================
# Image embedding configuration
# ============================================================
# Same pattern as audio: placeholders in the .twee (used in CSS or HTML) are
# replaced with base64 data URIs of the source PNG. Means the game works from
# file:// or anywhere, and an asset can't go 404 because it's part of the HTML.
IMAGE_EMBEDS = [
    ("__DSS_COIN_HEADS_DATA_URI__", "coin-heads.png", "image/png"),
    ("__DSS_COIN_TAILS_DATA_URI__", "coin-tails.png", "image/png"),
]

# ============================================================
# 1. Parse the Twee file
# ============================================================

with open(twee_path, "r", encoding="utf-8") as f:
    twee_content = f.read()

# Match passage headers — with or without metadata JSON
# Patterns:
#   :: Name [tags] {"position":"x,y","size":"w,h"}
#   :: Name [tags]
#   :: Name {"position":"x,y","size":"w,h"}
#   :: Name
passage_pattern = re.compile(
    r'^:: (.+?)(?:\s+\[([^\]]*)\])?(?:\s+(\{[^\n]+\}))?\s*$',
    re.MULTILINE
)

passages = []
stylesheet_content = None
userscript_content = None
matches = list(passage_pattern.finditer(twee_content))

for i, match in enumerate(matches):
    name = match.group(1).strip()
    tags = match.group(2) or ""
    metadata = match.group(3) or ""

    # Get passage content (everything between this header and the next)
    start = match.end()
    if i + 1 < len(matches):
        end = matches[i + 1].start()
    else:
        end = len(twee_content)

    content = twee_content[start:end].strip()

    # Skip special passages
    if name == "StoryTitle" or name == "StoryData":
        continue

    if name == "StoryStylesheet" or name == "UserStylesheet" or tags.strip() == "stylesheet":
        stylesheet_content = content
        continue

    if name == "UserScript" or tags.strip() == "script":
        userscript_content = content
        continue

    # Skip header/footer tag-only passages without position metadata
    if tags.strip() in ("header", "footer") and not metadata:
        # Still include as a passage but with default position
        pass

    # Parse position and size from metadata
    pos_match = re.search(r'"position"\s*:\s*"([^"]+)"', metadata) if metadata else None
    size_match = re.search(r'"size"\s*:\s*"([^"]+)"', metadata) if metadata else None
    position = pos_match.group(1) if pos_match else "0,0"
    size = size_match.group(1) if size_match else "100,100"

    passages.append({
        "name": name,
        "tags": tags.strip(),
        "position": position,
        "size": size,
        "content": content
    })

print(f"Parsed {len(passages)} passages from Twee file")
if stylesheet_content:
    print(f"Found stylesheet ({len(stylesheet_content)} chars)")
if userscript_content:
    print(f"Found UserScript ({len(userscript_content)} chars)")

# ============================================================
# 1b. Build a passage-graph JSON for the astral reveal
# ============================================================
# Harlowe consumes <tw-passagedata> elements at boot, so we can't read the
# graph at runtime. Instead we bake it here: for every passage we emit
# {name, x, y, tags, links}. The userscript replaces __DSS_PASSAGE_GRAPH__
# with this JSON literal, and the astral reveal reads it directly.
#
# Special / display-only passages are excluded so the constellation
# matches the actual night's network of stops, not the SVG-builder utility
# passages.
import json
_GRAPH_SKIP = {
    "StoryInit", "StoryData", "UserScript",
    "UserStylesheet", "StoryStylesheet",
    "Lily SVG", "Deco Divider", "Build Notebook",
    "Dawn Rule SVG top", "Dawn Rule SVG eclipse", "Dawn Rule SVG bottom",
    "French Rule SVG h24", "French Rule SVG h60", "Ronnies Rule SVG h14",
    "Ending Vines SVG",
    # Now-orphaned passages — gameplay no longer routes through them after
    # recent flow rewires. Skipping them keeps the constellation tight
    # around stops the player actually reaches.
    "Dream to Dean",        # superseded by The Interval (forced wake path)
    "Eat Shelleys Liver",   # superseded by inline notebook "Eat it" button
    "Failure: Trisha's",    # now unreachable; Trisha's gates at the hub
}
_link_re      = re.compile(r"\[\[([^\[\]]+?)\]\]")
_goto_re      = re.compile(r"\(go-to:\s*[\"']([^\"']+)[\"']")
_linkgoto_re  = re.compile(r"\(link-goto:\s*[\"'][^\"']*[\"']\s*,\s*[\"']([^\"']+)[\"']")
_graph_passages = [p for p in passages if p["name"] not in _GRAPH_SKIP]
_name_to_idx = {p["name"]: i for i, p in enumerate(_graph_passages)}
_graph_json = []
for src_idx, p in enumerate(_graph_passages):
    px, py = (p["position"].split(",") + ["0", "0"])[:2]
    try:
        px, py = float(px), float(py)
    except ValueError:
        px, py = 0.0, 0.0
    targets = set()
    # [[A]], [[A|B]], [[A->B]]
    for m in _link_re.finditer(p["content"]):
        inner = m.group(1)
        if "|" in inner:
            t = inner.split("|")[-1]
        elif "->" in inner:
            t = inner.split("->")[-1]
        else:
            t = inner
        targets.add(t.strip())
    for m in _goto_re.finditer(p["content"]):
        targets.add(m.group(1).strip())
    for m in _linkgoto_re.finditer(p["content"]):
        targets.add(m.group(1).strip())
    link_idxs = sorted({_name_to_idx[t] for t in targets
                        if t in _name_to_idx and _name_to_idx[t] != src_idx})
    _graph_json.append({
        "n": p["name"],
        "x": px, "y": py,
        "t": p["tags"],
        "l": link_idxs,
    })
_graph_payload = "window._DSS_PASSAGE_GRAPH = " + json.dumps(_graph_json, separators=(",", ":")) + ";"
print(f"Baked passage graph: {len(_graph_json)} nodes, "
      f"{sum(len(p['l']) for p in _graph_json)} links")

# ============================================================
# 2. Update the HTML file
# ============================================================

with open(html_path, "r", encoding="utf-8") as f:
    html_content = f.read()

# Build new passage data elements
def encode_content(text):
    """Encode passage content for HTML storage."""
    text = text.replace("&", "&amp;")
    text = text.replace("<", "&lt;")
    text = text.replace(">", "&gt;")
    text = text.replace('"', "&quot;")
    text = text.replace("'", "&#x27;")
    return text

passage_elements = []
for i, p in enumerate(passages, start=1):
    encoded = encode_content(p["content"])
    tags_attr = f' tags="{html.escape(p["tags"])}"' if p["tags"] else ""
    elem = (f'<tw-passagedata pid="{i}" name="{html.escape(p["name"])}"'
            f'{tags_attr}'
            f' position="{p["position"]}" size="{p["size"]}">'
            f'{encoded}</tw-passagedata>')
    passage_elements.append(elem)

# Find the startnode — look for the "Title" passage
startnode = "1"
for i, p in enumerate(passages, start=1):
    if p["name"] == "Title":
        startnode = str(i)
        break

print(f"Start node (Title): PID {startnode}")

# Replace startnode in tw-storydata
html_content = re.sub(
    r'startnode="\d+"',
    f'startnode="{startnode}"',
    html_content
)

# --- Embed images as base64 data URIs (both for CSS and inline HTML) ---
# Build the substitutions once; apply to stylesheet, userscript, AND passages
# so any reference to the placeholder anywhere ends up as a full data: URI.
image_replacements = []
for placeholder, source_file, mime in IMAGE_EMBEDS:
    image_path = os.path.join(_here, source_file)
    if not os.path.exists(image_path):
        print(f"WARNING: image file not found: {image_path} — {placeholder} not embedded")
        continue
    with open(image_path, "rb") as imf:
        img_b64 = base64.b64encode(imf.read()).decode("ascii")
    data_uri = "data:" + mime + ";base64," + img_b64
    image_replacements.append((placeholder, data_uri, source_file, len(img_b64)))
    print(f"Embedded image: {source_file} ({len(img_b64)//1024} KB base64) -> {placeholder}")

def _embed_images(text):
    for placeholder, data_uri, _src, _kb in image_replacements:
        text = text.replace(placeholder, data_uri)
    return text

# Replace the stylesheet
if stylesheet_content:
    # Raw CSS — NOT html-encoded, because it lives inside a <style> tag
    # (same as <script> tags, browsers don't decode HTML entities in <style>)
    encoded_css = _embed_images(stylesheet_content)
    css_match = re.search(
        r'(<style role="stylesheet" id="twine-user-stylesheet" type="text/twine-css">).*?(</style>)',
        html_content,
        flags=re.DOTALL
    )
    if css_match:
        html_content = html_content[:css_match.start()] + css_match.group(1) + encoded_css + css_match.group(2) + html_content[css_match.end():]
        print("Updated stylesheet")
    else:
        print("WARNING: Could not find twine-user-stylesheet tag in HTML")

# Replace the UserScript (raw JS — NOT html-encoded, because it lives inside a <script> tag)
if userscript_content:
    # --- Embed each audio file as a base64 data URI ---
    # Iterate AUDIO_EMBEDS; each placeholder in the userscript is replaced
    # with a full data: URI. Keeps the .twee small and lets the HTML run from
    # file:// without local-file restrictions.
    for placeholder, source_file, mime in AUDIO_EMBEDS:
        audio_path = os.path.join(_here, source_file)
        if not os.path.exists(audio_path):
            print(f"WARNING: audio file not found: {audio_path} — {placeholder} not embedded")
            continue
        with open(audio_path, "rb") as af:
            audio_b64 = base64.b64encode(af.read()).decode("ascii")
        data_uri = "data:" + mime + ";base64," + audio_b64
        if placeholder in userscript_content:
            userscript_content = userscript_content.replace(placeholder, data_uri)
            kb = len(audio_b64) // 1024
            print(f"Embedded audio: {source_file} ({kb} KB base64) -> {placeholder}")
        else:
            print(f"WARNING: placeholder {placeholder} not found in UserScript — {source_file} not embedded")

    # --- Bake the passage-graph JSON into the userscript ---
    # The astral reveal at Centre Point needs the actual passage positions
    # and link relationships. Harlowe drops <tw-passagedata> at boot so we
    # can't read them at runtime; we substitute the JSON in here instead.
    if "__DSS_PASSAGE_GRAPH__" in userscript_content:
        userscript_content = userscript_content.replace("__DSS_PASSAGE_GRAPH__", _graph_payload)
        print(f"Embedded passage graph -> __DSS_PASSAGE_GRAPH__")
    else:
        print(f"WARNING: __DSS_PASSAGE_GRAPH__ placeholder not in UserScript — astral reveal will be empty")

    # --- Embed images into the userscript too (for inline <img src=> via JS) ---
    userscript_content = _embed_images(userscript_content)

    js_match = re.search(
        r'(<script role="script" id="twine-user-script" type="text/twine-javascript">).*?(</script>)',
        html_content,
        flags=re.DOTALL
    )
    if js_match:
        html_content = html_content[:js_match.start()] + js_match.group(1) + userscript_content + js_match.group(2) + html_content[js_match.end():]
        print("Updated UserScript")
    else:
        print("WARNING: Could not find twine-user-script tag in HTML")

# Replace all passage data — scope the cleanup regex to ONLY the
# <tw-storydata>...</tw-storydata> block. Previously the regex ran over
# the whole HTML, which meant any literal occurrence of "<tw-passagedata>"
# inside a JS comment or string in the userscript would match and the
# non-greedy `.*?` would scan forward to the next "</tw-passagedata>",
# wiping out the entire passagedata block (and sometimes the closing
# </tw-storydata> tag itself). Slicing the storydata bounds first
# guarantees the cleanup can't escape that block.
_sd_open = re.search(r'<tw-storydata[^>]*>', html_content)
_sd_close = html_content.find('</tw-storydata>', _sd_open.end()) if _sd_open else -1
if _sd_open and _sd_close >= 0:
    _sd_inner = html_content[_sd_open.end():_sd_close]
    _sd_inner = re.sub(r'<tw-passagedata[^>]*>.*?</tw-passagedata>', '', _sd_inner, flags=re.DOTALL)
    html_content = html_content[:_sd_open.end()] + _sd_inner + html_content[_sd_close:]
else:
    print("WARNING: could not locate <tw-storydata>…</tw-storydata> block — skipping passage cleanup")

# Insert new passages before </tw-storydata>
new_passages_str = _embed_images("\n".join(passage_elements))
html_content = html_content.replace("</tw-storydata>", new_passages_str + "\n</tw-storydata>")

# Write the updated HTML
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Wrote {len(passages)} passages to HTML file")
print("Done!")
