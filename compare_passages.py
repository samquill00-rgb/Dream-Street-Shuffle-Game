#!/usr/bin/env python3
"""
Compare passages from Dream Street Shuffle backup (HTML) vs current (twee).
Find passages where content was stripped instead of wrapped with styling.
"""

import re
import html
from pathlib import Path
from collections import defaultdict

# Define patterns to strip (venue styling, decorations, etc.)
STRIP_PATTERNS = [
    (r'<svg[^>]*>.*?</svg>', 'svg_element'),
    (r'<div\s+class="[^"]*-scene"[^>]*>.*?</div>', 'scene_wrapper'),
    (r'<div\s+class="trishas-frame"[^>]*>.*?</div>', 'trishas_frame'),
    (r'<div\s+class="cellar-bulb-wrap"[^>]*>.*?</div>', 'cellar_wrap'),
    (r'<div\s+class="[^"]*(?:bulb|wrap|frame|scene)[^"]*"[^>]*>.*?</div>', 'venue_decoration'),
    (r'<!-- .*? -->', 'html_comment'),
    (r'<span\s+class="guided-link"[^>]*>.*?</span>', 'guided_link_span'),
    (r'<span\s+class="trishas-strip"[^>]*>.*?</span>', 'trishas_strip_span'),
    (r'<span\s+class="[^"]*(?:guided|trishas|strip)[^"]*"[^>]*>.*?</span>', 'styled_span'),
]

def extract_passages_from_html(html_file):
    """Extract passages from compiled HTML file."""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    passages = {}
    # In HTML compiled files, passages are stored as tw-passagedata elements
    pattern = r'<tw-passagedata[^>]*?name="([^"]+)"[^>]*?>(.*?)</tw-passagedata>'

    for match in re.finditer(pattern, content, re.DOTALL):
        name = match.group(1)
        passage_html = match.group(2)
        # HTML decode
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
        # Passage header: :: PassageName [tags]
        if line.startswith('::') and not line.startswith(':: '):
            # This is a passage header but not a directive
            continue

        if line.startswith('::'):
            # Save previous passage
            if current_passage:
                passages[current_passage] = {
                    'content': ''.join(current_content).strip(),
                    'tags': current_tags
                }

            # Parse new passage header
            match = re.match(r'::\s+([^\[\n]+)(?:\s*\[(.*?)\])?', line)
            if match:
                current_passage = match.group(1).strip()
                current_tags = match.group(2) if match.group(2) else ""
                current_content = []
            else:
                current_passage = None
        elif current_passage:
            current_content.append(line)

    # Save last passage
    if current_passage:
        passages[current_passage] = {
            'content': ''.join(current_content).strip(),
            'tags': current_tags
        }

    return passages

def strip_venue_styling(text):
    """Remove all venue styling elements from text, keeping content."""
    result = text

    # First, handle multiline SVG and div elements
    result = re.sub(r'<svg[^>]*>.*?</svg>', '', result, flags=re.DOTALL | re.IGNORECASE)
    result = re.sub(r'<div[^>]*(?:class="[^"]*(?:scene|frame|wrap|bulb|trishas|cellar|guided)[^"]*")[^>]*>.*?</div>', '', result, flags=re.DOTALL | re.IGNORECASE)

    # Remove HTML comments
    result = re.sub(r'<!--.*?-->', '', result, flags=re.DOTALL)

    # Remove styled spans but keep content inside
    result = re.sub(r'<span\s+class="[^"]*(?:guided|trishas|strip|styled)[^"]*"[^>]*>(.*?)</span>', r'\1', result, flags=re.DOTALL | re.IGNORECASE)

    # Clean up other HTML tags but keep text content
    result = re.sub(r'<[^>]+>', '', result)

    # Normalize whitespace
    result = re.sub(r'\s+', ' ', result).strip()

    return result

def normalize_content(text):
    """Normalize text content for comparison."""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Decode HTML entities
    text = html.unescape(text)
    return text

def compare_passages(backup_passages, current_passages):
    """Find passages with missing content."""
    issues = []

    for passage_name in sorted(backup_passages.keys()):
        if passage_name not in current_passages:
            continue

        backup_text = backup_passages[passage_name]
        current_data = current_passages[passage_name]
        current_text = current_data['content'] if isinstance(current_data, dict) else current_data

        # Strip styling from backup to get raw content
        backup_stripped = strip_venue_styling(backup_text)
        current_stripped = strip_venue_styling(current_text)

        # Normalize
        backup_norm = normalize_content(backup_stripped)
        current_norm = normalize_content(current_stripped)

        # Check if backup has significantly more content
        backup_len = len(backup_norm)
        current_len = len(current_norm)

        # If backup is 30%+ longer and current doesn't contain most of backup, flag it
        if backup_len > current_len and (backup_len - current_len) > 100:
            # Find what's missing
            missing_content = []

            # Look for specific patterns that might be missing
            # Links
            backup_links = re.findall(r'\[\[([^\]]+)\]\]', backup_text)
            current_links = re.findall(r'\[\[([^\]]+)\]\]', current_text)
            missing_links = [l for l in backup_links if l not in current_text]

            # (link:) macros
            backup_link_macros = re.findall(r'\(link:\s*"[^"]*"[^)]*\)', backup_text)
            current_link_macros = re.findall(r'\(link:\s*"[^"]*"[^)]*\)', current_text)
            missing_macros = [m for m in backup_link_macros if m not in current_text]

            # Lore sections
            backup_lore = re.findall(r'\(link:\s*"⟡\s*LORE:[^"]*"[^)]*\)', backup_text, re.IGNORECASE)
            current_lore = re.findall(r'\(link:\s*"⟡\s*LORE:[^"]*"[^)]*\)', current_text, re.IGNORECASE)
            missing_lore = [l for l in backup_lore if l not in current_text]

            # (set:) changes
            backup_sets = re.findall(r'\(set:\s*[^)]*\)', backup_text)
            current_sets = re.findall(r'\(set:\s*[^)]*\)', current_text)
            missing_sets = [s for s in backup_sets if s not in current_text]

            # Prose paragraphs (lines with significant content)
            backup_paras = [p.strip() for p in backup_stripped.split('\n') if len(p.strip()) > 50]
            current_paras = [p.strip() for p in current_stripped.split('\n') if len(p.strip()) > 50]
            missing_paras = [p for p in backup_paras if p not in current_text and len(p) > 50]

            if missing_links or missing_macros or missing_lore or missing_sets or missing_paras:
                issues.append({
                    'passage_name': passage_name,
                    'backup_length': backup_len,
                    'current_length': current_len,
                    'difference': backup_len - current_len,
                    'missing_links': missing_links,
                    'missing_macros': missing_macros,
                    'missing_lore': missing_lore,
                    'missing_sets': missing_sets,
                    'missing_paras': missing_paras,
                    'backup_raw': backup_text[:500],
                    'current_raw': current_text[:500],
                })

    return sorted(issues, key=lambda x: x['difference'], reverse=True)

def main():
    backup_html = Path('/sessions/blissful-tender-brown/mnt/uploads/Dream Street Shuffle (3).html')
    current_twee = Path('/sessions/blissful-tender-brown/mnt/Claude work/Dream Street Shuffle.twee')

    print("=" * 80)
    print("DREAM STREET SHUFFLE - CONTENT COMPARISON")
    print("=" * 80)
    print()

    # Extract passages
    print("Extracting passages from backup HTML...")
    backup_passages = extract_passages_from_html(str(backup_html))
    print(f"  Found {len(backup_passages)} passages in backup")

    print("Extracting passages from current twee...")
    current_passages = extract_passages_from_twee(str(current_twee))
    print(f"  Found {len(current_passages)} passages in current")
    print()

    # Compare
    print("Comparing passages...")
    issues = compare_passages(backup_passages, current_passages)

    if not issues:
        print("No significant content mismatches found!")
        return

    print(f"Found {len(issues)} passages with MISSING CONTENT")
    print()
    print("=" * 80)

    for i, issue in enumerate(issues, 1):
        print()
        print(f"[{i}] PASSAGE: {issue['passage_name']}")
        print(f"    Backup: {issue['backup_length']} chars | Current: {issue['current_length']} chars | MISSING: {issue['difference']} chars")
        print()

        if issue['missing_links']:
            print("    MISSING LINKS:")
            for link in issue['missing_links'][:5]:  # Show first 5
                print(f"      - [[{link}]]")
            if len(issue['missing_links']) > 5:
                print(f"      ... and {len(issue['missing_links']) - 5} more")
            print()

        if issue['missing_macros']:
            print("    MISSING LINK MACROS:")
            for macro in issue['missing_macros'][:3]:
                print(f"      - {macro[:100]}...")
            print()

        if issue['missing_lore']:
            print("    MISSING LORE SECTIONS:")
            for lore in issue['missing_lore'][:3]:
                print(f"      - {lore[:100]}...")
            print()

        if issue['missing_sets']:
            print("    MISSING (set:) VARIABLES:")
            for s in issue['missing_sets'][:3]:
                print(f"      - {s[:100]}...")
            print()

        if issue['missing_paras']:
            print("    MISSING PROSE PARAGRAPHS:")
            for para in issue['missing_paras'][:2]:
                print(f"      - {para[:120]}...")
            print()

        print("    BACKUP CONTENT (first 500 chars):")
        print("    " + "─" * 76)
        content = issue['backup_raw'].replace('\n', '\n    ')
        print("    " + content[:500])
        print("    " + "─" * 76)
        print()

        print("    CURRENT CONTENT (first 500 chars):")
        print("    " + "─" * 76)
        content = issue['current_raw'].replace('\n', '\n    ')
        print("    " + content[:500])
        print("    " + "─" * 76)
        print()

if __name__ == '__main__':
    main()
