export const CHESS_MIN = 0, CHESS_MAX = 7, CHESS_STEP = 0.2;
export const BOX_MIN   = 0, BOX_MAX   = 5, BOX_STEP   = 0.2;

export const ROUND_PARAMS = [
  { type: 'chess', a: 0.4516, k: 124.207 }, // R1
  { type: 'box',   a: 1.0689, k:   8.077 }, // R2
  { type: 'chess', a: 0.3974, k:   7.889 }, // R3
  { type: 'box',   a: 1.1695, k:  15.236 }, // R4
  { type: 'chess', a: 0.6434, k:   2.103 }, // R5
  { type: 'box',   a: 1.3734, k:  38.332 }, // R6
  { type: 'chess', a: 0.3801, k:   0.419 }, // R7
  { type: 'box',   a: 1.8596, k:   0     }, // R8
];

const matchupProbCache = new Map();

export function getMatchupProbs(dChess, dBox) {
  const normChess = +dChess.toFixed(2);
  const normBox = +dBox.toFixed(2);
  const key = `${normChess}|${normBox}`;
  const cached = matchupProbCache.get(key);
  if (cached) return cached;

  let cont = 1;
  let cumA = 0, cumB = 0;
  const out = [];
  for (let r = 1; r <= 8; r++) {
    const { type, a, k } = ROUND_PARAMS[r - 1];
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
  const probs = getMatchupProbs(dChess, dBox);
  let prevA = 0, prevB = 0;
  let chessWin = 0;
  let boxWin = 0;
  let chessLoss = 0;
  let boxLoss = 0;
  let expectedRounds = 0;

  for (let r = 1; r <= 8; r++) {
    const deltaA = Math.max(0, probs[r - 1].pA - prevA);
    const deltaB = Math.max(0, probs[r - 1].pB - prevB);
    expectedRounds += r * (deltaA + deltaB);
    if (ROUND_PARAMS[r - 1].type === 'chess') {
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
  return getMatchupProbs(myC - oppC, myB - oppB)[7].pA;
}

export const eloOf = c => Math.round(800 + c * (1600 / 7));
