# Chessboxing Rating: how the probabilities are computed

This document describes the model behind the Chessboxing Rating app: how a fight
is simulated round by round, how the star rating is built, which assumptions the
model makes, where it is known to be wrong, and what could improve it.

Code references point to `src/model.js` (the fight model), `src/grid.js` (star
rating and chances map) and `src/main.js` (what the page shows).

All example numbers below were produced by the current code with its default
values, for a 7-round fight with colours not drawn, unless stated otherwise.

---

## 1. Inputs

Each fighter has two numbers.

| Input | Range | Meaning |
|---|---|---|
| Chess | 800–2400 ELO, in steps of 10 | Standard chess rating. Internally converted to a chess level `c = (ELO − 800) × 7 / 1600`, so one level is ≈ 229 ELO and the scale runs 0–7. |
| Boxing | 0–5, in steps of 0.1 | Boxing level: 0 Novice, 1 Beginner, 2 Amateur, 3 Regional, 4 Semi-Pro, 5 Professional. |

Plus two fight settings:

- **Round format:** 5, 7, 9 or 11 fighting rounds. Rounds alternate chess and
  boxing, starting and ending with chess.
- **Your pieces:** white, black, or not drawn yet.

### 1.1 Both scales are even

Like ELO, both scales are designed so that one step changes the odds by the same
factor wherever you start: going from Novice to Beginner is worth as much as going
from Semi-Pro to Professional. This is a deliberate design choice, not an
approximation.

For reference, in the model one boxing level shifts the odds of a decided boxing
round by a factor e^(2a) with a ≈ 1.07–1.37, which is about as much as 370–480 ELO
shifts a chess game under the ELO formula.

---

## 2. One round

Every round, including the final boxing decision, has three possible outcomes:
you win the fight in this round, your opponent wins it, or the fight goes on.

```
you win : they win : fight goes on  =  e^(+s) : e^(−s) : k

s = a × (your level − opponent's level)      chess levels in chess rounds,
                                             boxing levels in boxing rounds
```

So the probabilities for that round, given the fight is still on, are:

```
P(you win round)    = e^s  / (e^s + e^−s + k)
P(they win round)   = e^−s / (e^s + e^−s + k)
P(fight continues)  = k    / (e^s + e^−s + k)
```

- **a** is how much the level gap matters in that round. A large `a` means the
  stronger fighter almost always wins the round when it is decided.
- **k** is how hard it is to finish the fight in that round. Early chess rounds
  have a very large `k` because games rarely end in the first minutes. The final
  boxing decision has `k = 0`, so someone always wins it on points.
- With equal levels (`s = 0`) each fighter wins a decided round 50/50, and the
  round is decided with probability `2 / (2 + k)`.

A chess round only looks at the chess gap and a boxing round only at the boxing
gap. The data table the model was fitted on has exactly this structure (checked by
`verify_structure()` in `computations/fit_round_model.py`).

### 2.1 Chaining the rounds

Rounds are chained: a round only matters if the fight is still on.

```
still_on(0) = 1
you_win(r)  = still_on(r − 1) × P(you win round r)
they_win(r) = still_on(r − 1) × P(they win round r)
still_on(r) = still_on(r − 1) × P(fight continues in round r)

P(you win the fight) = Σ you_win(r) over all rounds, including the decision
```

Because the decision has `k = 0`, `still_on` is 0 after it and the two winning
probabilities add up to 100 %.

From the same numbers the app derives:

| Shown as | Computed as |
|---|---|
| You win in the ring | Σ `you_win(r)` over boxing rounds and the decision |
| You win at the board | Σ `you_win(r)` over chess rounds |
| You lose at the board / in the ring | same with `they_win(r)` |
| Expected length | Σ r × (`you_win(r)` + `they_win(r)`). The decision counts as round N + 1; the page caps the value at N. |
| Still on (round table) | `still_on(r)` |

Code: `matchupProbsForSide()` and `getWinBreakdown()` in `src/model.js`.

---

## 3. Round values per format

`a` and `k` for every round of every format live in `ROUND_CONFIGS` in
`src/model.js`.

### 3.1 Where they come from

- **7 rounds:** fitted on a table of per-round probabilities
  (`computations/Probability_winning_per_round.csv`, 165 rows: boxing gap −5…5 ×
  chess gap −7…7, for 8 rounds). The fitting script
  (`computations/fit_round_model.py`) compares four model shapes; the app uses the
  simplest one, "SoftmaxLinear" (section 2). The boxing rounds keep their fitted
  values. The chess rounds were then retuned by hand (see 3.2).
- **11 rounds:** set by hand.
- **9 rounds:** interpolated halfway between 7 and 11 rounds, per round role
  (for example "last chess round" and "decision" are matched by role, not by
  position).
- **5 rounds:** extrapolated from 7 and 11 rounds, with floors where
  extrapolation gave impossible values, then retuned by hand.

Originally fitted 7-round chess values, before retuning (from the comments in
`ROUND_CONFIGS`):

| Round | a fitted | k fitted | a now | k now |
|---|---|---|---|---|
| R1 | 0.4516 | 124.2 | 0.40 | 80.2 |
| R3 | 0.3974 | 7.9 | 0.57 | 60 |
| R5 | 0.6434 | 2.1 | 0.81 | 9.63 |
| R7 | 0.3801 | 0.4 | 1.17 | 0.64 |

### 3.2 Key chess rounds (time wins)

Some chess rounds carry an extra bias: **round 3 in 5-round fights** (a = 0.90) and
**round 5 in 7-round fights** (a = 0.81). These are the rounds where a clearly
better chess player can force a win on time, so the level gap matters more there.
In 7-round fights round 5 has k = 9.63 (3× the earlier 3.21): between close
club players it rarely finishes, and it only becomes decisive through the chess
gap rule (section 4) when one player is clearly better.

### 3.3 Why more rounds favour the boxer

More rounds mean more boxing rounds, and more chess time for the weaker chess
player to stall. So a fight between a strong chess player and a strong boxer tilts
towards the boxer as the format gets longer. This is intended. Example: a 2400 ELO
novice boxer against an 800 ELO professional wins 15.8 % over 7 rounds and 0.4 %
over 11.

### 3.4 Current values

The fitted values are for a club-level fight; section 4 adjusts `k` (and adds the
white edge) for other levels.

#### 5 rounds (early-stoppage threshold: 3 expected rounds)

| Round | Type | a | k |
|---|---|---|---|
| R1 | chess | 0.53 | 260 |
| R2 | boxing | 1.0689 | 8.077 |
| R3 | chess | 0.90 | 20 |
| R4 | boxing | 1.1695 | 15.236 |
| R5 | chess | 1.40 | 0.48 |
| Decision | boxing | 2.54 | 0 |

#### 7 rounds (threshold: 4)

| Round | Type | a | k |
|---|---|---|---|
| R1 | chess | 0.40 | 80.207 |
| R2 | boxing | 1.0689 | 8.077 |
| R3 | chess | 0.57 | 60 |
| R4 | boxing | 1.1695 | 15.236 |
| R5 | chess | 0.81 | 9.63 |
| R6 | boxing | 1.3734 | 38.332 |
| R7 | chess | 1.17 | 0.6419 |
| Decision | boxing | 1.70 | 0 |

#### 9 rounds (threshold: 5)

| Round | Type | a | k |
|---|---|---|---|
| R1 | chess | 0.25 | 320 |
| R2 | boxing | 1.0689 | 8.077 |
| R3 | chess | 0.36 | 80 |
| R4 | boxing | 1.1695 | 15.236 |
| R5 | chess | 0.51 | 12.8 |
| R6 | boxing | 1.3734 | 38.332 |
| R7 | chess | 0.73 | 2.56 |
| R8 | boxing | 1.60 | 45 |
| R9 | chess | 1.04 | 0.52 |
| Decision | boxing | 1.90 | 0 |

#### 11 rounds (threshold: 6)

| Round | Type | a | k |
|---|---|---|---|
| R1 | chess | 0.20 | 1280 |
| R2 | boxing | 1.0689 | 8.077 |
| R3 | chess | 0.29 | 256 |
| R4 | boxing | 1.1695 | 15.236 |
| R5 | chess | 0.50 | 51.6 |
| R6 | boxing | 1.3734 | 38.332 |
| R7 | chess | 0.58 | 10 |
| R8 | boxing | 1.60 | 45 |
| R9 | chess | 0.83 | 2 |
| R10 | boxing | 1.90 | 55 |
| R11 | chess | 1.19 | 0.5 |
| Decision | boxing | 2.20 | 0 |

---

## 4. Level adjustments

The fitted values describe a club-level fight (about 1486 ELO, Amateur boxers).
Real fights behave differently at other levels and gaps, so these adjustments use
the two fighters' **average** chess level `m` (0–7), their chess gap `Δc`, their
**average** boxing level `n` (0–5) and their boxing gap `Δb`.
The values are fixed in `LEVEL` in `src/model.js`.

```
chess rounds:   k × e^(0.2 × (m − 3))     longer games between strong players
                  × e^(−0.5 × |Δc|)       from round 2 of chess on (not round 1):
                                          a big mismatch collapses fast
boxing rounds:  k × e^(−0.4 × (n − 2))    more stoppages between strong boxers
                  × 4 × e^(−0.9 × |Δb|)   close boxers rarely stop each other
                                          early; a big mismatch is a quick KO
white edge:     s + w for white, s − w for black, in chess rounds only
                w = 0.1 × min(1, 0.2 + 0.8 × m / 5)
```

- **Chess game length.** Beginners blunder early and games end at the board
  quickly; strong players' games last, so more of their fights reach the ring and
  the decision. At m = 3 (club level) the factor is 1.
- **Chess mismatch.** A clearly better chess player finishes the game quickly,
  and can force a win on time in the key rounds. This applies to every chess
  round except the first: in round 1 players stall in the opening and mates are
  rare. Example, 1800 vs 800 ELO with equal Amateur boxing, 7 rounds: the fight
  reaches round 4 28 % of the time and the 1800 player wins 96 %.
- **Boxing gap.** Between close boxers stoppages are rare and fights go long;
  a big boxing mismatch ends in a quick knockout. The factor 4 and 0.9 were
  tuned on the expert test set (section 10): with a one-level gap the factor is
  1.6, with a two-level gap 0.66, with a three-level gap 0.27.
- **Stoppage rate.** Novices rarely stop each other; semi-pros and pros often do.
  At n = 2 (Amateur) the factor is 1.
- **White edge.** White has a first-move advantage that grows with chess level.
  At full strength (w = 0.1, from Expert, m ≥ 5) white wins 55 % of equal fights
  that are decided at the board; total beginners get a fifth of it.

Effect on an equal 7-round fight:

| Both fighters | Ends at the board | Ends by stoppage | Boxing decision | Expected length |
|---|---|---|---|---|
| Beginners (1028 ELO, Beginner) | 82 % | 6 % | 12 % | 6.1 |
| Club (1486 ELO, Amateur) | 74 % | 9 % | 17 % | 6.2 |
| Strong (1942 ELO, Semi-Pro) | 59 % | 20 % | 22 % | 6.1 |
| Elite (2400 ELO, Pro) | 46 % | 28 % | 27 % | 5.9 |

White against black in an equal 7-round fight:

| Both fighters | White wins | Black wins | White's share of board finishes |
|---|---|---|---|
| Beginners | 51.5 % | 48.5 % | 51.8 % |
| Club | 52.5 % | 47.5 % | 53.4 % |
| Strong | 52.9 % | 47.1 % | 55.0 % |

The data table itself lists fighter A as white and gives white 51.4 % in an equal
fight.

---

## 5. Colours

- **White** or **Black** selected: the white edge `w` is added for you or for your
  opponent in every chess round.
- **Not drawn:** the fight is computed once with you as white and once as black,
  and every probability is the average of the two. The page also shows both
  numbers ("With white 40 % · with black 37 %").

The star rating always uses "not drawn", so it never depends on a coin toss.

---

## 6. Worked example

You: 1500 ELO, boxing 2.0 (Amateur). Opponent: 1810 ELO, boxing 1.2 (Beginner).
7 rounds, colours not drawn.

- m = (3.06 + 4.42) / 2 ≈ 3.7 and the chess gap is 1.36 levels, so chess `k`
  × 1.15 in round 1 and × 1.15 × e^(−0.5 × 1.36) ≈ 0.58 from round 3 on.
- n = (2.0 + 1.2) / 2 = 1.6 and the boxing gap is 0.8, so boxing `k`
  × 1.17 × 4 × e^(−0.9 × 0.8) ≈ 2.28.
- White edge w ≈ 0.079.

| Round | Type | You win | They win | Still on |
|---|---|---|---|---|
| R1 | chess | 0.6 % | 1.8 % | 97.6 % |
| R2 | boxing | 10.8 % | 2.0 % | 84.8 % |
| R3 | chess | 1.0 % | 4.9 % | 78.9 % |
| R4 | boxing | 5.3 % | 0.8 % | 72.8 % |
| R5 | chess | 2.7 % | 24.3 % | 45.8 % |
| R6 | boxing | 1.5 % | 0.2 % | 44.1 % |
| R7 | chess | 1.7 % | 39.4 % | 3.1 % |
| Decision | boxing | 2.9 % | 0.2 % | 0.0 % |

Result: you win **26.5 %** (27.6 % as white, 25.5 % as black). You win in the ring
20.5 % and at the board 6.0 %; you lose at the board 70.3 % and in the ring 3.1 %.
Expected length 5.3 rounds.

The game plan on the page follows from this table: your best round is R2 and the
danger rounds are R5 and R7 (section 8.3).

---

## 7. Star rating

### 7.1 Goal and why it cannot be exact

The ideal would be "a fighter with more stars always has more than 50 % to win".
That is impossible with this model, because the relation "beats with more than
50 %" has **rock-paper-scissors cycles**. Example, 7 rounds, colours not drawn:

- 1500 ELO / boxing 2.5 beats 2300 ELO / boxing 0.5 with 68 %
- 2300 ELO / boxing 0.5 beats 2000 ELO / boxing 1.5 with 68 %
- 2000 ELO / boxing 1.5 beats 1500 ELO / boxing 2.5 with 71 %

The cause is that the chess advantage flattens out: a small chess edge is worth
about as much as a boxing level, but a huge chess edge is only worth about two
boxing levels, because the boxer gets several chances to stop the fight before the
chess game is over. Forcing the exact rule would put almost every profile on the
same star level.

### 7.2 Domination (Copeland) rating

Instead the stars follow a domination ranking:

1. Build the grid of all profiles: 36 chess steps (every 0.2 level ≈ 46 ELO) ×
   26 boxing steps (every 0.2) = 936 profiles.
2. Let every profile fight every other one (colours not drawn) and count how many
   it beats with more than 50 %.
3. Rank the profiles by that count; ties share the average rank.
4. Stars = rank / 935 × 5, so 0 to 5 stars. "Top X %" is (1 − rank) × 100.

A profile between grid steps (the sliders move every 10 ELO and 0.1 boxing
level) is placed the same way: count the grid profiles it beats, and place that
count among the grid profiles' counts.

The stars depend on the round format, since the fights do.

Code: `ensureRank()` and `rankAt()` in `src/grid.js`.

### 7.3 Guarantees

- More chess or more boxing never lowers your stars (the model is monotonic in
  both).
- Being **about 1.3 stars ahead or more always makes you the favourite** (checked
  on all pairs of grid profiles, in every format: 1.32 in 5 rounds, 1.10 in 7,
  1.07 in 9, 1.09 in 11). A sample of 700 random fine-grained profiles needed
  1.00 star in 7 rounds.
- About 94 % of all pairs respect "more stars wins" even for smaller gaps.

---

## 8. What the page derives from the model

### 8.1 Verdict

| Win chance | Label |
|---|---|
| > 70 % | Clear favourite |
| > 55 % | Favourite |
| 45–55 % | Even fight |
| > 30 % | Underdog |
| ≤ 30 % | Long shot |

### 8.2 Fighter type

Using chess level / 7 and boxing level / 5 (both 0–1):

- **Complete fighter:** both ≥ 0.7
- **Tactician:** chess share exceeds boxing share by more than 0.15
- **Brawler:** boxing share exceeds chess share by more than 0.15
- **Balanced fighter:** otherwise

### 8.3 Game plan

- **Your edge / theirs:** the discipline where you win more (ring or board), and
  the one where you lose more.
- **Best rounds / danger rounds:** rounds that carry at least a quarter of your
  total win (or loss) chance, at most two, in fight order.

### 8.4 Training levers

- **Fastest way to more stars:** your stars after +1 boxing level and after +1
  chess level (≈ +230 ELO), capped at the top of each scale.
- **To beat this opponent, train:** your win chance against the current opponent
  after the same two steps.

### 8.5 Chances map filters

- **Good Matchmaking for You:** dims opponents unless boxing gap ≤ 1.5, win chance
  25–75 % and expected length ≥ the format's threshold (3 / 4 / 5 / 6 rounds for
  5 / 7 / 9 / 11).
- **Early Stoppage Zone:** colours opponents whose expected length is below that
  threshold, green when you are favoured and red when they are.

---

## 9. Assumptions

1. **Only a few things decide a round:** the gap in that round's discipline, the
   round's `a` and `k`, the fighters' average levels, the chess gap (for how fast a
   chess round ends), and the colours.
2. **Rounds are independent** once the fight is still on: what happened in earlier
   rounds does not change later ones (no damage or fatigue carry-over).
3. **Chess and boxing strengths are independent inputs.** A fighter's chess level
   is not affected by their boxing level, or the reverse.
4. **Symmetry:** apart from colours, swapping the two fighters swaps the
   probabilities exactly.
5. **Even scales:** one chess level (≈ 229 ELO) or one boxing level changes the
   odds by the same factor anywhere on the scale.
6. **The decision is pure boxing:** if nobody has won after the last fighting
   round, the boxing points decide, driven only by the boxing gap.
7. **Club-level calibration:** the round values describe a club-level fight; other
   levels and gaps are reached through the level adjustments, whose strengths
   are expert estimates or tuned on a small expert test set, not fitted on
   results.
8. **The data table is right:** the 7-round values come from a table of
   per-round probabilities, not from observed fight results.

---

## 10. Expert test set

Twelve tricky matchups (colours not drawn) were judged by an experienced
chessboxer before looking at the model: who is favourite, and how the fight
usually ends. The boxing pace and gap rule (section 4) were tuned on it.
"A wins" is the model's chance for fighter A after tuning.

The cases and answers are stored in `tests/expert-cases.json`. Run `npm test` after
any change to the model: it recomputes every case, prints the numbers, and fails
if a case that used to match no longer does (cases marked `known_issue` are
reported without failing).

| # | Rounds | A (ELO / boxing) | B (ELO / boxing) | Expert | A wins | Main ending in the model |
|---|---|---|---|---|---|---|
| 1 | 5 | 1900 / 0.5 | 1200 / 3 | B, KO in the first boxing round | 19 % | B by KO in R2 |
| 2 | 11 | 1900 / 0.5 | 1200 / 3 | same as 1, KO in the second boxing round similar or lower | 4 % | B by KO in R2 |
| 3 | 7 | 1600 / 2 | 1500 / 3 | B clear, long fight, KO around R6; a round-5 chess finish should be rare | 42 % | A at the board in R7, B by KO in R2 |
| 4 | 7 | 2200 / 1 | 1300 / 2 | A, on time in R5 | 81 % | A at the board, R3/R5 |
| 5 | 9 | 1400 / 4 | 2000 / 3 | B, tough, at the board in R5 or R7 | 45 % | B at the board R5/R7, A by KO R2 |
| 6 | 7 | 1800 / 2 | 1800 / 2.5 | B clear, tough | 39 % | long, board in R7 or decision |
| 7 | 7 | 2400 / 0 | 1000 / 2 | B, KO in the first boxing round | 53 % | split: B KO in R2, A at the board R3 |
| 8 | 11 | 1500 / 5 | 2100 / 4 | A in the ring | 60 % | A by KO |
| 9 | 5 | 1200 / 1 | 1000 / 1.5 | A clear | 80 % | A at the board |
| 10 | 7 | 2000 / 4 | 2300 / 3 | no clear favourite | 51 % | balanced |
| 11 | 5 | 1700 / 3 | 1300 / 4 | A | 62 % | A at the board |
| 12 | 11 | 1700 / 3 | 1300 / 4 | balanced, B small favourite | 47 % | balanced, long |

Still off after tuning:

- **Case 3:** B is only a slight favourite, not a clear one.
- **Case 7:** a boxing-0 fighter should lose to an easy knockout; the model still
  gives the 2400 ELO fighter 53 %.
- **Case 3, how it ends:** B should win by boxing late (around round 6). In the
  model round 6 rarely ends a fight (k = 38), so the chess player finishes in
  round 7 instead. Making round 6 more decisive gives B a clear edge here but
  pushes case 10 to A 60 %+, so it is left open.

## 11. Known limitations

1. **Not validated on real fights.** Nothing has been measured against actual
   results, so the accuracy of any single percentage is unknown. The chances
   should be read as informed estimates, not predictions.
2. **Only 7 rounds is data-based.** 11 rounds is set by hand and 5 and 9 rounds
   are derived, so their numbers are less reliable.
3. **No carry-over between rounds.** Taking punches does not lower your chess
   level later, and fitness does not matter, although both are central to real
   chessboxing.
4. **Missing outcomes:** chess draws, losing on the clock outside the key rounds,
   disqualifications, and the official tie-break rules are not modelled
   explicitly; they are folded into the round values.
5. **The chess edge saturates.** A 2400 ELO fighter against an 800 ELO fighter
   with equal boxing (Amateur) wins 97 % over 7 rounds and 96 % over 11. Fights
   between close boxers now rarely end by stoppage, which may make chess too
   dominant when the boxing gap is small (section 10).
6. **Stoppage rate between close boxers.** Between equal Amateur boxers the
   first boxing round now ends the fight about 6 % of the time, and only 9 % of
   equal club fights end by stoppage. This follows the expert test set but has
   not been checked on real results.
7. **Stars are relative to a uniform grid of profiles**, from 800 ELO novices to
   2400 ELO professionals, not to the real population of fighters. Most club
   fighters therefore sit between 1 and 3 stars.
8. **Star guarantee is approximate.** "More stars always wins" only holds for gaps
   of about 1.3 stars or more (section 7.3).
9. **Level adjustments are estimates.** The 0.2 / 0.5 / 0.4 / 4 / 0.9 / 0.1 values were chosen to
   give plausible behaviour, not fitted.
10. **The chances map is coarser** than the sliders (steps of ≈ 46 ELO and 0.2
    boxing level).
11. **Data files are not versioned.** `computations/` is excluded by
    `.gitignore`, so the source table and fitting script only exist locally.

---

## 12. Future work

In rough order of value:

1. **Fit on real fight results.** Collect past fights with both fighters' ELO,
   boxing level, colours, format, and how and when each fight ended. Fit `a`, `k`
   and the level adjustments by maximum likelihood, and report calibration (for
   example a Brier score and a reliability plot). Official evaluations and known
   chessboxers added to `src/fighters.js` are a natural start.
2. **Damage and fatigue carry-over.** Lower a fighter's effective chess level after
   each boxing round they lose, more against a harder puncher and less for a good
   boxer; add fatigue that grows with rounds for lower boxing levels.
3. **Stalling.** When the weaker chess player is the better boxer, chess rounds
   end less often, because that fighter can play slowly and wait for the ring.
4. **One model for all formats.** Model the chess clock (time per player) and the
   boxing rounds directly, so every format follows from the same parameters
   instead of hand-set or interpolated values.
5. **Explicit draws, time losses and tie-breaks** following the official rules.
6. **Chess rounds tied to the ELO formula**, so that among decided games the
   winner matches the ELO expected score.
7. **Uncertainty ranges.** Show each chance as a range (for example 40 % ± 8)
   based on how uncertain the parameters are.
8. **Stars against the real population.** Once enough real profiles exist, rank
   against them instead of a uniform grid.
9. **Version the data and fitting script** in the repository so results can be
   reproduced.
