#!/usr/bin/env python3
"""
Generate detailed comparison report for affected passages.
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

def extract_passages_from_twee(twee_file):
    """Extract passages from twee source file."""
    with open(twee_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    passages = {}
    current_passage = None
    current_content = []
    current_tags = ""

    for line in lines:
        if line.startswith('::'):
            if current_passage:
                passages[current_passage] = {
                    'content': ''.join(current_content).strip(),
                    'tags': current_tags
                }

            match = re.match(r'::\s+([^\[\n]+)(?:\s*\[(.*?)\])?', line)
            if match:
                current_passage = match.group(1).strip()
                current_tags = match.group(2) if match.group(2) else ""
                current_content = []
            else:
                current_passage = None
        elif current_passage:
            current_content.append(line)

    if current_passage:
        passages[current_passage] = {
            'content': ''.join(current_content).strip(),
            'tags': current_tags
        }

    return passages

def main():
    backup_html = Path('/sessions/blissful-tender-brown/mnt/uploads/Dream Street Shuffle (3).html')
    current_twee = Path('/sessions/blissful-tender-brown/mnt/Claude work/Dream Street Shuffle.twee')

    backup = extract_passages_from_html(str(backup_html))
    current = extract_passages_from_twee(str(current_twee))

    # The 4 problematic passages
    problematic = [
        "Steve Merkin",
        "The Colony Room",
        "Coach and Horses lock",
        "Colony drink"
    ]

    for passage_name in problematic:
        if passage_name not in backup:
            continue

        print()
        print("=" * 100)
        print(f"PASSAGE: {passage_name}")
        print("=" * 100)
        print()

        backup_text = backup[passage_name]
        current_data = current.get(passage_name, {'content': '', 'tags': ''})
        current_text = current_data['content'] if isinstance(current_data, dict) else current_data

        print("BACKUP CONTENT:")
        print("─" * 100)
        print(backup_text)
        print()
        print()

        print("CURRENT CONTENT:")
        print("─" * 100)
        print(current_text)
        print()
        print()

if __name__ == '__main__':
    main()
