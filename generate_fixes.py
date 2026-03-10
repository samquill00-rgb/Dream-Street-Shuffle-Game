#!/usr/bin/env python3
"""
Generate the exact twee code needed to fix the broken passages.
"""

import re
import html
from pathlib import Path

def extract_passages_from_html(html_file):
    """Extract passages from compiled HTML file."""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    passages = {}
    pattern = r'<tw-passagedata[^>]*?name="([^"]+)"[^>]*?>(.*?)</tw-passagedata>'

    for match in re.finditer(pattern, content, re.DOTALL):
        name = match.group(1)
        passage_html = match.group(2)
        passage_text = html.unescape(passage_html)
        passages[name] = passage_text

    return passages

def main():
    backup_html = Path('/sessions/blissful-tender-brown/mnt/uploads/Dream Street Shuffle (3).html')

    backup = extract_passages_from_html(str(backup_html))

    # The 4 problematic passages with their tags
    fixes = {
        "Steve Merkin": "venue-colony",
        "The Colony Room": "venue-colony",
        "Coach and Horses lock": "venue-coach",
        "Colony drink": "venue-colony"
    }

    print("=" * 100)
    print("TWEE CODE FIXES FOR BROKEN PASSAGES")
    print("=" * 100)
    print()

    for passage_name, tag in fixes.items():
        if passage_name not in backup:
            continue

        backup_text = backup[passage_name]

        print()
        print("=" * 100)
        print(f"PASSAGE: {passage_name}")
        print("=" * 100)
        print()
        print(f":: {passage_name} [{tag}]")
        print(backup_text)
        print()

if __name__ == '__main__':
    main()
