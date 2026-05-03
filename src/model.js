export const CHESS_MIN = 0, CHESS_MAX = 7, CHESS_STEP = 0.2;
export const BOX_MIN = 0, BOX_MAX = 5, BOX_STEP = 0.2;

export const MATCHMAKING_CONSTRAINTS = {
  selectionable: {
    myBoxAdvantageMax: 1.5,
    maxWinProb: 0.80
  },
  strict: {
    boxDiffMax: 1.5,
    minWinProb: 0.25,
    maxWinProb: 0.75,
    minExpectedRounds: 4.0
  }
};

// ── Round format configurations ─────────────────────────────────────────────
// Formats: 5 / 7 / 9 / 11 fighting rounds.
//   - Rounds always alternate chess / boxing, starting AND ending with chess.
//   - One extra boxing DECISION round is appended (k = 0) — it is NOT a
//     fighting round; it models the boxing-points tiebreak if the fight is
//     still tied after all chess/boxing rounds.
//   - Total params = fighting rounds + 1  →  6 / 8 / 10 / 12 entries.
//
// Anchor formats: 7-round (fitted from data) and 11-round (user-provided).
// Derived formats: 9-round (linear interpolation, t = 0.5) and
//                  5-round (linear extrapolation, t = −0.5).
//
// Interpolation formula: param(n) = param_7 + t × (param_11 − param_7)
//   where t = (n − 7) / (11 − 7).
//
// Role-based positions (not at the same index in every format):
//   • "last chess fighting round" : R7 in 7R, R9 in 9R, R5 in 5R, R11 in 11R
//   • "boxing decision round"     : R8 in 7R, R10 in 9R, R6 in 5R, R12 in 11R
// These are interpolated/extrapolated using the 7R and 11R anchor values for
// those roles, not the absolute-position values.
//
// Edit a / k values here to tune any format.

export const ROUND_CONFIGS = {

  // ── 5-round format (6 params: 5 fighting C B C B C + boxing decision) ──
  // Extrapolated at t = −0.5 from 7R and 11R anchors.
  // Where extrapolation would produce negative values, domain-appropriate
  // floors are applied (noted inline).
  '5': {
    label: '5',
    minExpectedRounds: 3.0,
    params: [
      //                    7R value      11R value   t=−0.5 result
      { type: 'chess', a: 0.53, k: 260 }, // R1   0.4516,124.2   0.3,130   → 0.53, 121  ✓
      { type: 'box', a: 1.0689, k: 8.077 }, // R2   1.0689, 8.1    1.5, 15   → 0.85, 4.5  ✓
      { type: 'chess', a: 0.90, k: 20 }, // R3   0.3974, 7.9    0.4, 50   → 0.40, −13 → k floored to 5
      { type: 'box', a: 1.1695, k: 15.236 }, // R4   1.1695,15.2    1.4, 27   → 1.05, 9.4  ✓
      { type: 'chess', a: 1.4, k: 0.48 }, // R5*  last-chess role: 7R-R7(0.38,0.42) ↔ 11R-R11(0.8,0.3) → 0.17→floor 0.25; k=0.48 ✓
      { type: 'box', a: 2.54, k: 0 }, // R6   decision role:  7R-R8(1.86,0) ↔ 11R-R12(0.5,0) → 2.54 ✓
    ],
  },

  // ── 7-round format (8 params: 7 fighting C B C B C B C + boxing decision) ──
  // Anchor — parameters fitted from real data.
  '7': {
    label: '7',
    minExpectedRounds: 4.0,
    params: [
      { type: 'chess', a: 0.4, k: 80.207 }, // R1
      { type: 'box', a: 1.0689, k: 8.077 }, // R2
      { type: 'chess', a: 0.57, k: 60 }, // R3
      { type: 'box', a: 1.1695, k: 15.236 }, // R4
      { type: 'chess', a: 0.81, k: 3.2103 }, // R5
      { type: 'box', a: 1.3734, k: 38.332 }, // R6
      { type: 'chess', a: 1.17, k: 0.6419 }, // R7* last chess fighting round
      { type: 'box', a: 1.7, k: 0 }, // R8  boxing decision
    ],
  },

  // ── 9-round format (10 params: 9 fighting C B C B C B C B C + boxing decision) ──
  // Interpolated at t = 0.5 (midpoint) between 7R and 11R anchors.
  // R6 is identical in both anchors → unchanged.
  // R8: bridges 7R-R8 (decision, k=0) and 11R-R8 (boxing, k=76) → k=38,
  //     which coincidentally matches 7R-R6 (last boxing before last chess, k=38.3) ✓
  // R9 (last chess fighting): role-based interpolation of 7R-R7 ↔ 11R-R11.
  // R10 (boxing decision): role-based interpolation of 7R-R8 ↔ 11R-R12.
  '9': {
    label: '9',
    minExpectedRounds: 5,
    params: [
      //                      7R value          11R value     t=0.5 result
      {
        type: 'chess', a: 0.25, k: 320
      }, // R1  0.4516,124.2  0.3,130    → 0.38, 127
      { type: 'box', a: 1.0689, k: 8.077 }, // R2  1.0689,  8.1  1.5, 15    → 1.28,  12
      { type: 'chess', a: 0.36, k: 80 }, // R3  0.3974,  7.9  0.4, 50    → 0.40,  29
      { type: 'box', a: 1.1695, k: 15.236 }, // R4  1.1695, 15.2  1.4, 27    → 1.28,  21
      { type: 'chess', a: 0.51, k: 12.8 }, // R5  0.6434,  2.1  0.5, 30    → 0.57,  16
      { type: 'box', a: 1.3734, k: 38.332 }, // R6  1.3734, 38.3  1.3734,38.3→ unchanged
      { type: 'chess', a: 0.73, k: 2.56 }, // R7  0.3801,  0.4  0.6, 15    → 0.49,  7.7
      { type: 'box', a: 1.6, k: 45 }, // R8  1.8596,  0    1.5, 76    → 1.68,  38
      { type: 'chess', a: 1.04, k: 0.52 }, // R9* last-chess role: 7R-R7(0.38,0.42) ↔ 11R-R11(0.8,0.3) → 0.59, 0.36
      { type: 'box', a: 1.9, k: 0 }, // R10 decision role:  7R-R8(1.86,0) ↔ 11R-R12(0.5,0) → 1.18
    ],
  },

  // ── 11-round format (12 params: 11 fighting C B C B C B C B C B C + boxing decision) ──
  // Anchor — parameters provided by user.
  '11': {
    label: '11',
    minExpectedRounds: 6,
    params: [
      { type: 'chess', a: 0.2, k: 1280 }, // R1
      { type: 'box', a: 1.0689, k: 8.077 }, // R2
      { type: 'chess', a: 0.29, k: 256 }, // R3
      { type: 'box', a: 1.1695, k: 15.236 }, // R4
      { type: 'chess', a: 0.5, k: 51.6 }, // R5
      { type: 'box', a: 1.3734, k: 38.332 }, // R6
      { type: 'chess', a: 0.58, k: 10 }, // R7
      { type: 'box', a: 1.6, k: 45 }, // R8
      { type: 'chess', a: .83, k: 2 }, // R9
      { type: 'box', a: 1.9, k: 55 }, // R10
      { type: 'chess', a: 1.19, k: .5 }, // R11* last chess fighting round
      { type: 'box', a: 2.2, k: 0 }, // R12  boxing decision
    ],
  },
};

let _activeKey = '7';
const matchupProbCache = new Map();

export const getActiveConfig = () => ROUND_CONFIGS[_activeKey];
export const getActiveKey = () => _activeKey;

export function setActiveConfig(key) {
  _activeKey = key;
  matchupProbCache.clear();
}

export function getMatchupProbs(dChess, dBox) {
  const params = getActiveConfig().params;
  const normChess = +dChess.toFixed(2);
  const normBox = +dBox.toFixed(2);
  const key = `${_activeKey}|${normChess}|${normBox}`;
  const cached = matchupProbCache.get(key);
  if (cached) return cached;

  let cont = 1, cumA = 0, cumB = 0;
  const out = [];
  for (const { type, a, k } of params) {
    const x = type === 'chess' ? normChess : normBox;
    const eA = Math.exp(a * x), eB = Math.exp(-a * x);
    const Z = eA + eB + k;
    cumA += cont * eA / Z;
    cumB += cont * eB / Z;
    cont *= k / Z;
    out.push({ pA: cumA, pB: cumB, pCont: cont });
  }

  matchupProbCache.set(key, out);
  return out;
}

export function getWinBreakdown(dChess, dBox) {
  const params = getActiveConfig().params;
  const probs = getMatchupProbs(dChess, dBox);
  let prevA = 0, prevB = 0;
  let chessWin = 0, boxWin = 0, chessLoss = 0, boxLoss = 0, expectedRounds = 0;

  for (let r = 1; r <= params.length; r++) {
    const deltaA = Math.max(0, probs[r - 1].pA - prevA);
    const deltaB = Math.max(0, probs[r - 1].pB - prevB);
    expectedRounds += r * (deltaA + deltaB);
    if (params[r - 1].type === 'chess') {
      chessWin += deltaA;
      chessLoss += deltaB;
    } else {
      boxWin += deltaA;
      boxLoss += deltaB;
    }
    prevA = probs[r - 1].pA;
    prevB = probs[r - 1].pB;
  }

  return { chessWin, boxWin, chessLoss, boxLoss, expectedRounds, probs };
}

export function pWin(myC, myB, oppC, oppB) {
  const probs = getMatchupProbs(myC - oppC, myB - oppB);
  return probs[probs.length - 1].pA;
}

export const eloOf = c => Math.round(800 + c * (1600 / 7));
