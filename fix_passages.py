#!/usr/bin/env python3
"""
Restore broken passages in Dream Street Shuffle.twee
Extracts original content from HTML backup and fixes passages where styling replaced content.
"""

import re
import html
from pathlib import Path

BACKUP_FILE = "/sessions/blissful-tender-brown/mnt/uploads/Dream Street Shuffle (3).html"
TWEE_FILE = "/sessions/blissful-tender-brown/mnt/Claude work/Dream Street Shuffle.twee"
OUTPUT_FILE = "/sessions/blissful-tender-brown/mnt/Claude work/Dream Street Shuffle_FIXED.twee"

# Passages that need fixing
PASSAGES_TO_FIX = {
    "Steve Merkin": {
        "tag": "[venue-colony]",
        "needs_wrapper": "colony-scene",
        "wrapper_type": "colony"
    },
    "The Colony Room": {
        "tag": "[venue-colony]",
        "needs_wrapper": "colony-scene",
        "wrapper_type": "colony"
    },
    "Coach and Horses lock": {
        "tag": "[venue-coach]",
        "needs_wrapper": "coach-beam",
        "wrapper_type": "coach"
    },
    "Dido": {
        "tag": "[venue-trishas]",
        "needs_wrapper": "trishas-frame",
        "wrapper_type": "trishas"
    },
    "Trisha's": {
        "tag": "[venue-trishas]",
        "needs_wrapper": "trishas-frame",
        "wrapper_type": "trishas"
    }
}

def extract_passages_from_html(html_file):
    """Extract passages from HTML backup file."""
    passages = {}

    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all passage divs: <div class="passage" name="...">...</div>
    passage_pattern = r'<div\s+class="passage"\s+name="([^"]+)"[^>]*>(.*?)</div>\s*(?=<div\s+class="passage"|$)'
    matches = re.finditer(passage_pattern, content, re.DOTALL)

    for match in matches:
        name = match.group(1)
        passage_html = match.group(2).strip()

        # Decode HTML entities
        passage_text = html.unescape(passage_html)

        passages[name] = passage_text

    return passages

def extract_passages_from_twee(twee_file):
    """Extract passages from twee file with their headers and content."""
    passages = {}

    with open(twee_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    i = 0
    while i < len(lines):
        line = lines[i]

        # Check if this is a passage header
        if line.startswith(":: "):
            header = line.rstrip('\n')
            content_lines = []
            i += 1

            # Collect content until next passage header or end of file
            while i < len(lines) and not lines[i].startswith(":: "):
                content_lines.append(lines[i])
                i += 1

            # Extract passage name from header
            # Format: :: Name [tags] {metadata}
            name_match = re.match(r'^::\s+([^\[{]+)', header)
            if name_match:
                name = name_match.group(1).strip()
                passages[name] = {
                    'header': header,
                    'content': ''.join(content_lines),
                    'content_lines': content_lines
                }
        else:
            i += 1

    return passages

def get_wrapper_from_twee(twee_passages, wrapper_type):
    """Extract wrapper pattern from existing passage with that wrapper."""
    for name, data in twee_passages.items():
        content = data['content']

        if wrapper_type == "colony":
            # Look for colony-scene wrapper
            if '<div class="colony-scene">' in content:
                # Extract the opening and closing patterns
                start_match = re.search(r'<div class="colony-scene">.*?(?=\n)', content, re.DOTALL)
                end_match = re.search(r'</div>\s*$', content)
                if start_match and end_match:
                    return ('colony', start_match.group(0), content[end_match.start():])

        elif wrapper_type == "coach":
            # Look for coach beam patterns
            if 'class="coach-beam"' in content:
                lines = content.split('\n')
                opening_lines = []
                closing_lines = []
                found_opening = False
                found_closing = False

                for i, line in enumerate(lines):
                    if not found_opening and 'class="coach-beam"' in line:
                        opening_lines.append(line)
                        if '></svg>' in line:
                            found_opening = True
                    elif found_opening and not found_closing and 'class="coach-beam-bottom"' in line:
                        closing_lines.append(line)
                        found_closing = True

                if opening_lines and closing_lines:
                    return ('coach', '\n'.join(opening_lines), '\n'.join(closing_lines))

        elif wrapper_type == "trishas":
            # Look for trishas-frame wrapper
            if 'class="trishas-frame"' in content:
                start_match = re.search(r'<div class="trishas-frame">\s*<span class="trishas-strip">[^<]*</span>', content)
                end_match = re.search(r'<span class="trishas-strip">[^<]*</span>\s*</div>\s*$', content)
                if start_match and end_match:
                    return ('trishas', start_match.group(0), content[end_match.start():])

    return None

def clean_passage_content(html_content):
    """Clean up HTML passage content for twee format."""
    # Remove excessive whitespace at start/end
    content = html_content.strip()

    # Convert HTML line breaks to actual line breaks if needed
    content = re.sub(r'<br\s*/?>\s*', '\n', content)

    # Keep inline HTML tags like <div>, <span>, <strong>, etc.
    return content

def fix_steve_merkin(backup_passages, twee_passages):
    """Fix Steve Merkin passage - restore critical variables at end."""
    original = backup_passages.get("Steve Merkin", "")
    current = twee_passages.get("Steve Merkin", {})

    if not original or not current:
        return None

    header = current['header']

    # Extract just the prose and setup from original
    # Look for the pattern ending with the back link
    clean_orig = clean_passage_content(original)

    # Wrap in colony-scene if needed
    if '<div class="colony-scene">' in current['content']:
        wrapper = get_wrapper_from_twee(twee_passages, "colony")
        if wrapper:
            _, open_tag, close_tag = wrapper
            fixed = open_tag + "\n" + clean_orig + "\n" + close_tag
        else:
            fixed = clean_orig
    else:
        fixed = clean_orig

    return header, fixed

def fix_colony_room(backup_passages, twee_passages):
    """Fix The Colony Room - restore missing choice links."""
    original = backup_passages.get("The Colony Room", "")
    current = twee_passages.get("The Colony Room", {})

    if not original or not current:
        return None

    header = current['header']
    clean_orig = clean_passage_content(original)

    # Wrap in colony-scene
    wrapper = get_wrapper_from_twee(twee_passages, "colony")
    if wrapper:
        _, open_tag, close_tag = wrapper
        fixed = open_tag + "\n" + clean_orig + "\n" + close_tag
    else:
        fixed = clean_orig

    return header, fixed

def fix_coach_and_horses(backup_passages, twee_passages):
    """Fix Coach and Horses lock - restore all prose and choice links."""
    original = backup_passages.get("Coach and Horses lock", "")
    current = twee_passages.get("Coach and Horses lock", {})

    if not original or not current:
        return None

    header = current['header']
    clean_orig = clean_passage_content(original)

    # Check if current has SVG decorations we should preserve
    current_content = current['content']
    wrapper = get_wrapper_from_twee(twee_passages, "coach")

    if wrapper and ('<svg' in current_content or 'class="coach' in current_content):
        _, open_tag, close_tag = wrapper
        fixed = open_tag + "\n" + clean_orig + "\n" + close_tag
    else:
        fixed = clean_orig

    return header, fixed

def fix_dido_lore(backup_passages, twee_passages):
    """Fix Dido - ensure lore box verse has proper line breaks."""
    original = backup_passages.get("Dido", "")
    current = twee_passages.get("Dido", {})

    if not original or not current:
        return None

    header = current['header']
    clean_orig = clean_passage_content(original)

    return header, clean_orig

def main():
    print("=" * 80)
    print("RESTORING BROKEN PASSAGES IN DREAM STREET SHUFFLE")
    print("=" * 80)

    # Extract from backup
    print("\nExtracting passages from HTML backup...")
    backup_passages = extract_passages_from_html(BACKUP_FILE)
    print(f"Found {len(backup_passages)} passages in backup")

    # Extract from current twee
    print("Extracting passages from current twee file...")
    twee_passages = extract_passages_from_twee(TWEE_FILE)
    print(f"Found {len(twee_passages)} passages in twee file")

    # Read the entire twee file
    with open(TWEE_FILE, 'r', encoding='utf-8') as f:
        twee_content = f.read()

    # Track fixes
    fixes_applied = {}

    # Fix each broken passage
    print("\n" + "=" * 80)
    print("APPLYING FIXES")
    print("=" * 80)

    # Steve Merkin
    print("\n>>> Fixing STEVE MERKIN...")
    result = fix_steve_merkin(backup_passages, twee_passages)
    if result:
        header, fixed_content = result
        fixes_applied["Steve Merkin"] = (header, fixed_content)
        print(f"✓ Fixed Steve Merkin")
        print(f"  First 5 lines:")
        for line in fixed_content.split('\n')[:5]:
            print(f"    {line[:75]}")

    # The Colony Room
    print("\n>>> Fixing THE COLONY ROOM...")
    result = fix_colony_room(backup_passages, twee_passages)
    if result:
        header, fixed_content = result
        fixes_applied["The Colony Room"] = (header, fixed_content)
        print(f"✓ Fixed The Colony Room")
        print(f"  First 5 lines:")
        for line in fixed_content.split('\n')[:5]:
            print(f"    {line[:75]}")

    # Coach and Horses lock
    print("\n>>> Fixing COACH AND HORSES LOCK...")
    result = fix_coach_and_horses(backup_passages, twee_passages)
    if result:
        header, fixed_content = result
        fixes_applied["Coach and Horses lock"] = (header, fixed_content)
        print(f"✓ Fixed Coach and Horses lock")
        print(f"  First 5 lines:")
        for line in fixed_content.split('\n')[:5]:
            print(f"    {line[:75]}")

    # Dido
    print("\n>>> Fixing DIDO...")
    result = fix_dido_lore(backup_passages, twee_passages)
    if result:
        header, fixed_content = result
        fixes_applied["Dido"] = (header, fixed_content)
        print(f"✓ Fixed Dido")
        print(f"  First 5 lines:")
        for line in fixed_content.split('\n')[:5]:
            print(f"    {line[:75]}")

    # Now rebuild the twee file with fixes
    print("\n" + "=" * 80)
    print("REBUILDING TWEE FILE")
    print("=" * 80)

    output_lines = []
    current_passage = None
    skip_until_next_passage = False

    for line in twee_content.split('\n'):
        # Check if this is a passage header
        if line.startswith(":: "):
            # Extract passage name
            name_match = re.match(r'^::\s+([^\[{]+)', line)
            if name_match:
                current_passage = name_match.group(1).strip()

            # Check if this is a passage we're fixing
            if current_passage in fixes_applied:
                skip_until_next_passage = True
                # Add the fixed header and content
                header, content = fixes_applied[current_passage]
                output_lines.append(header)
                output_lines.append(content.rstrip('\n'))
                output_lines.append("")  # blank line after passage
            else:
                skip_until_next_passage = False
                output_lines.append(line)
        else:
            # If we're not skipping, add the line
            if not skip_until_next_passage:
                output_lines.append(line)

    # Write fixed twee file
    fixed_twee_content = '\n'.join(output_lines)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(fixed_twee_content)

    print(f"\n✓ Fixed twee file written to: {OUTPUT_FILE}")
    print(f"✓ Applied {len(fixes_applied)} passage fixes")

    # Verification
    print("\n" + "=" * 80)
    print("VERIFICATION")
    print("=" * 80)

    fixed_twee_passages = extract_passages_from_twee(OUTPUT_FILE)

    for passage_name in fixes_applied.keys():
        if passage_name in fixed_twee_passages:
            content = fixed_twee_passages[passage_name]['content']
            line_count = len(content.split('\n'))
            char_count = len(content)
            print(f"\n✓ {passage_name}")
            print(f"  Lines: {line_count}, Characters: {char_count}")

if __name__ == "__main__":
    main()
