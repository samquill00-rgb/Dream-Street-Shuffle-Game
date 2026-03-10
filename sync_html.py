#!/usr/bin/env python3
"""Sync the Twee file to the HTML file.
Updates all <tw-passagedata> elements, the <style id='twine-user-stylesheet'> tag,
and the <script id='twine-user-script'> tag."""

import re
import html
import os

# Paths are relative to this script's own directory
_here = os.path.dirname(os.path.abspath(__file__))
twee_path = os.path.join(_here, "Dream Street Shuffle.twee")
html_path = os.path.join(_here, "Dream Street Shuffle.html")

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

# Replace the stylesheet
if stylesheet_content:
    # Raw CSS — NOT html-encoded, because it lives inside a <style> tag
    # (same as <script> tags, browsers don't decode HTML entities in <style>)
    encoded_css = stylesheet_content
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

# Replace all passage data
# Remove old passages
html_content = re.sub(r'<tw-passagedata[^>]*>.*?</tw-passagedata>', '', html_content, flags=re.DOTALL)

# Insert new passages before </tw-storydata>
new_passages_str = "\n".join(passage_elements)
html_content = html_content.replace("</tw-storydata>", new_passages_str + "\n</tw-storydata>")

# Write the updated HTML
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Wrote {len(passages)} passages to HTML file")
print("Done!")
