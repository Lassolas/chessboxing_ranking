# WCBO World Championships 2026, Istanbul: fight list

`wc2026_istanbul_fights.csv` lists every fight found in the official pairing sheets
and bracket trees (17 to 21 November 2026), one row per fight, sorted by division
(Men, Women, Juniors, Masters), weight, then round.

## How winners were determined

The documents are schedules and brackets, not result sheets. A winner is filled in
only when the documents prove it:

- **next-round pairing**: the fighter appears in the following round's pairing.
- **bracket tree (loser struck through)**: the loser's name is struck through on the
  bracket tree (Men -74, Men -79 qualifiers, Women -52 semi-finals).

- **reported by Val (results form, 2026-11-24)**: final and exhibition results the
  documents don't have, entered by Val on a form. 21 of the 29 missing results were
  filled in this way, 20 of them with the win method. The other 8 (5 Juniors finals and the
  Masters -85, -100 and +100 finals) are still unknown and keep an empty `winner`.

`win_method` comes from Val's answers, plus one **TKO** written on a bracket (Women -52
semi-final, Noskova over Brown). Methods for the earlier rounds are not recorded.

## Columns left for the evaluation

`chess_elo_a`, `boxing_level_a`, `chess_elo_b`, `boxing_level_b` use the same scales as
the app (ELO 800 to 2400, boxing 0 to 5). `p_win_a` (fighter A's theoretical chance)
and `upset` are empty for you to fill. Fighter names are spelled the same way in every
row so they can be joined to a ratings table.

## Gaps and contradictions in the sources

1. **No final results in the documents.** The Men -61 bracket medal table lists
   Zhandaulet as SILVER, but Val reports that Zhandaulet won the final, so the medal tables
   are not reliable (spreadsheet formula artefact; bronze shows `#REF!`).
2. **Dates.** Bracket headers say 16 to 21/11/2026; fights are scheduled 17 to 21 Nov.
3. **Two versions of the Day 3 morning sheet** ((4) and (5)) with different times;
   the (5) version is used.
4. **Men -74 semi-final Volkov vs Otchy** appears on both the Day 4 morning (#2, 09:20)
   and afternoon (#18, 16:00, "Semi-final 2") sheets; the afternoon slot is kept.
5. **Men -100 final** is on the gala-night sheet but timed 13:00 (same slot as the
   Men +100 final).
6. **Men -85 Day 1 bouts** are labelled "Qualifiers" but are quarter-finals on the tree.
7. **Juniors M -63**: Day 1 lists Mchedlishvili = Russia and Poliakov = Georgia; the final
   sheet has Mchedlishvili = Georgia. Treated as swapped on Day 1.
8. **Juniors M -59**: the other semi-final (Andrei Belov) is not in the documents;
   "Ilez Barkhinkhoev" is marked as an updated fighter (an "Osman Barkhinkhoev" fights
   in Juniors -63).
9. **Missing brackets**: the Men -57/-61/-65/-69/-85/-92 trees show pairings but no
   struck-through losers, and there is no tree at all for Women -55/-59/-63/-72, Juniors
   or Masters; those winners come from the day sheets only. Masters -79
   quarter-finals cover only 2 bouts (Landy and Berdikeyev had byes).
10. **Women -77 and Women +82**: sole entrants, gold without a fight (kept as walkover rows).
11. **Women -49 exhibition** (Antapa vs Pratibha) and a "Women's exhibition fight, to be
    confirmed" on Day 5 have no result.
12. **Name and country spellings** are harmonised: club cities (Cologne, Montreal) are
    replaced by the tree's country (Germany, Canada); names keep the bracket-tree spelling,
    which is sometimes surname first (e.g. "Volkov Maxime", "Righi Sofian", "Marty Jean-Yves").
