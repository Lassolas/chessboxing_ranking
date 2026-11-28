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

## Results from the livestream commentary (added 2026-11-28)

Source: YouTube auto-captions of the United Chessboxing and Chesscom Events streams
(Days 2 to 5, gala finals, medal ceremony). Per-video detail lives in the project's
`video_results/` CSVs. New columns: `video_id`, `video_start`, `video_end` (h:mm:ss in
that video), `video_winner`, `video_method`, `video_round`, `video_stoppages`,
`video_comment`, `video_check`.

- **8 unknown finals filled from the medal ceremony** (result_source says so):
  Juniors -59 Belov, -63 Mchedlishvili, -67 Nazarenko, -78 Sultangaziev, -84 Karabanov;
  Masters -85 Fedorenko, -100 Bespalov, +100 Shayakhmetov (name cut in captions, only
  "from Kazakhstan" heard).
- **win_method** filled from the stream where it was empty. Where Val's reported method
  differs from the stream, the list keeps Val's and `video_check` flags it: WC26-071 and
  WC26-085, -100, -111, -075 (stream: time), WC26-073 (resignation), WC26-080 (checkmate,
  not TKO).
- **Reversed on appeal**: WC26-049 (stream: Percoskie on time) and WC26-051 (stream:
  Perevalov mate). The ceremony gave Percoskie and Perevalov extra bronzes.
- **WC26-076 exhibition**: stream shows Pratibha beating Antapa on time; list still says
  Antapa. Unresolved.
- **WC26-075 Men +100**: two silvers (Latifi Refik and Feujio) by appeals committee decision.
- **WC26-054 Men -79 final**: ending not shown on stream.
- **Day 1**: KABckf5Qcuo is the Chess.com copy of Day 3, not Day 1. The French recap
  FVPGjs_3pgo covers the 4 French Day 1 fights (WC26-029, -034, -057, -064).
- **No video yet** for 21 fights: rest of Day 1 (no captions; Whisper script pending) and the
  Masters -79 quarter-finals WC26-101/102.
