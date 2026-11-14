#!/usr/bin/env python3
"""Dependency-free checks: run `python3 tests/check_site.py` from the repo root."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
ERRORS = []

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.ids, self.refs, self.idrefs = path, [], [], []
        self.h1s, self.mains, self.titles, self.descriptions = 0, 0, 0, 0
        self.lang = ''
        self.feed(path.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        label = str(self.path.relative_to(ROOT))
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'html': self.lang = a.get('lang', '')
        if tag == 'h1': self.h1s += 1
        if tag == 'main': self.mains += 1
        if tag == 'title': self.titles += 1
        if tag == 'meta' and a.get('name') == 'description':
            self.descriptions += 1
            if not a.get('content', '').strip(): ERRORS.append(f'{label}: empty description')
        if tag == 'img' and not a.get('alt', '').strip(): ERRORS.append(f'{label}: missing image alt')
        if tag in ('img', 'script') and a.get('src'): self.refs.append(a['src'])
        if tag in ('a', 'link') and a.get('href'): self.refs.append(a['href'])
        if tag == 'a' and a.get('target') == '_blank' and 'noopener' not in a.get('rel', ''):
            ERRORS.append(f'{label}: unsafe new-tab link')
        for key in ('aria-labelledby', 'aria-describedby', 'aria-controls'):
            self.idrefs.extend(a.get(key, '').split())
        if tag == 'label' and a.get('for'): self.idrefs.append(a['for'])

    handle_startendtag = handle_starttag

pages = {p.resolve(): Page(p) for p in SITE.glob('*.html')}
for path, page in pages.items():
    label = str(path.relative_to(ROOT))
    for item, count in Counter(page.ids).items():
        if count > 1: ERRORS.append(f'{label}: duplicate ID {item}')
    for ref in page.idrefs:
        if ref not in page.ids: ERRORS.append(f'{label}: missing referenced ID {ref}')
    for name, count in [('h1', page.h1s), ('main', page.mains), ('title', page.titles), ('description', page.descriptions)]:
        if count != 1: ERRORS.append(f'{label}: expected one {name}, got {count}')
    if page.lang != 'en-GB': ERRORS.append(f'{label}: missing language')
    if 'lorem ipsum' in path.read_text().lower(): ERRORS.append(f'{label}: placeholder copy')
    for ref in page.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc: continue
        if url.path.startswith('/'):
            ERRORS.append(f'{label}: root-relative URL breaks project Pages: {ref}')
            continue
        target = (path.parent / unquote(url.path)).resolve() if url.path else path
        if not target.is_relative_to(SITE.resolve()):
            ERRORS.append(f'{label}: URL escapes site/: {ref}')
        elif not target.exists():
            ERRORS.append(f'{label}: broken local reference {ref}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            ERRORS.append(f'{label}: missing fragment in {ref}')

for path in SITE.glob('assets/images/*.svg'):
    try: ET.parse(path)
    except ET.ParseError as e: ERRORS.append(f'{path.name}: malformed SVG: {e}')

css = SITE / 'assets/css/styles.css'
for ref in re.findall(r'url\([\'"]?([^\)\'\"]+)', css.read_text()):
    if not urlsplit(ref).scheme and not (css.parent / ref).exists():
        ERRORS.append(f'CSS: broken asset {ref}')

workflow = (ROOT / '.github/workflows/pages.yml').read_text()
for required in ('workflow_dispatch:', 'branches: [main]', 'path: site', 'pages: write', 'id-token: write', 'actions/upload-pages-artifact@v3', 'actions/deploy-pages@v4'):
    if required not in workflow: ERRORS.append(f'Workflow missing {required}')
for filename in ('index.html', 'trips.html', 'about.html', 'practical.html'):
    if not (SITE / filename).exists(): ERRORS.append(f'Missing required page: {filename}')

if ERRORS:
    print('\n'.join(f'FAIL: {e}' for e in ERRORS))
    sys.exit(1)
print(f'PASS: {len(pages)} pages; local files, fragments, unique IDs, labels, metadata, SVGs, and Pages workflow.')
