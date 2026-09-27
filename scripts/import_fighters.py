#!/usr/bin/env python3
"""Builds src/fighters.private.js (git-ignored, local only) from the selection
spreadsheet (.xlsx export).

Usage:
  python3 scripts/import_fighters.py path/to/SELECTION.xlsx

Reads the EVALUATIONS tab (one row per evaluation) and the COMBATTANTS tab
(names, weight categories). Keeps each fighter's latest evaluation and only
publishes name, chess ELO, boxing level and weight category: no contact
details, birth dates or evaluator comments.

Boxing: the sheet's 0-5 evaluation is not linear with the app's scale. It is
converted by straight lines between these anchor points (sheet -> app):
  0 -> 1,  1 -> 2,  2 -> 2.7,  3 -> 3.6,  4 -> 4.4,  5 -> 5
Chess: the evaluated ELO, kept between 800 and 2400.
"""
import sys
from datetime import datetime
from pathlib import Path

import openpyxl

BOX_ANCHORS = [(0, 1.0), (1, 2.0), (2, 2.7), (3, 3.6), (4, 4.4), (5, 5.0)]
SKIP_EVALUATORS = {'test'}
SRC = Path(__file__).resolve().parent.parent / 'src'
OUT = SRC / 'fighters.private.js'


def box_level(score):
    s = max(0.0, min(5.0, float(score)))
    for (x0, y0), (x1, y1) in zip(BOX_ANCHORS, BOX_ANCHORS[1:]):
        if s <= x1:
            return round(y0 + (y1 - y0) * (s - x0) / (x1 - x0), 1)
    return BOX_ANCHORS[-1][1]


def norm_id(v):
    if v is None:
        return None
    if isinstance(v, float) and v.is_integer():
        v = int(v)
    return str(v).strip()


def weight_label(cat):
    """'World-H-Adult-69' -> 'M -69 kg', 'World-F-Junior-55' -> 'W Junior -55 kg'."""
    if not cat:
        return None
    parts = str(cat).strip().split('-')
    if len(parts) < 4:
        return str(cat).strip()
    _, sex, age, limit = parts[:4]
    sex = {'H': 'M', 'F': 'W'}.get(sex, sex)
    age = '' if age.lower().startswith('adult') else age + ' '
    limit = 'Heavy' if limit.lower().startswith('lourd') else f'-{limit} kg'
    return f'{sex} {age}{limit}'


def js_str(s):
    return "'" + str(s).replace('\\', '\\\\').replace("'", "\\'") + "'"


def main(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    people = {}
    for r in wb['COMBATTANTS'].iter_rows(min_row=2, values_only=True):
        if r[0]:
            people[norm_id(r[0])] = {'name': (r[3] or '').strip(), 'world': r[17]}

    latest = {}
    for r in wb['EVALUATIONS'].iter_rows(min_row=2, values_only=True):
        fid = norm_id(r[0])
        if not fid or r[3] is None or r[9] is None:
            continue
        if str(r[8] or '').strip().lower() in SKIP_EVALUATORS:
            continue
        date = r[7] if isinstance(r[7], datetime) else None
        if fid in latest and latest[fid]['date'] and date and date < latest[fid]['date']:
            continue
        latest[fid] = {'date': date, 'box': r[3], 'elo': r[9], 'weight': r[6], 'name': r[1]}

    fighters, skipped = [], []
    for fid, e in latest.items():
        person = people.get(fid, {})
        name = ' '.join((person.get('name') or e['name'] or '').split())
        if not name:
            skipped.append(fid)
            continue
        fighters.append({
            'name': name,
            'elo': int(round(max(800, min(2400, float(e['elo']))))),
            'box': box_level(e['box']),
            'weight': weight_label(e['weight'] or person.get('world')),
            'note': 'Evaluation ' + e['date'].strftime('%Y-%m-%d') if e['date'] else 'Evaluation',
        })
    fighters.sort(key=lambda f: f['name'].lower())

    lines = []
    for f in fighters:
        parts = [f"name: {js_str(f['name'])}", f"elo: {f['elo']}", f"box: {f['box']}"]
        if f['weight']:
            parts.append(f"weight: {js_str(f['weight'])}")
        parts.append(f"note: {js_str(f['note'])}")
        lines.append('  { ' + ', '.join(parts) + ' },')

    template = OUT if OUT.exists() else SRC / 'fighters.js'
    header = template.read_text().split('export const FIGHTERS')[0]
    OUT.write_text(header + 'export const FIGHTERS = [\n' + '\n'.join(lines) + '\n];\n')
    print(f'{len(fighters)} fighters written to {OUT}')
    if skipped:
        print(f'{len(skipped)} evaluations skipped (no name found): {", ".join(skipped)}')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
