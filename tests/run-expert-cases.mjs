// Regression check of the fight model against the expert test set.
// Usage: npm test   (or: node tests/run-expert-cases.mjs)
//
// Thresholds on A's win chance (colours not drawn):
//   A > 55 %, clear A > 65 %, slight A > 50 %; B < 45 %, clear B < 35 %,
//   slight B < 50 %; even 45–55 %;
//   even-B (balanced, B small favourite) 40–50 %.
// Ending: chess if more fights end at the board than by stoppage, boxing if
// the reverse; long if the boxing decision or a late finish dominates
// (not checked yet).
// Cases marked known_issue are reported but do not fail the run.

import { readFileSync } from 'node:fs';
import { setActiveConfig, getWinBreakdown, levelOfElo } from '../src/model.js';

const { cases } = JSON.parse(readFileSync(new URL('./expert-cases.json', import.meta.url), 'utf8'));

function evaluate(c) {
  setActiveConfig(String(c.rounds));
  const r = getWinBreakdown(levelOfElo(c.A.elo), c.A.box, levelOfElo(c.B.elo), c.B.box, 0);
  const { probs } = r;
  const n = probs.length;
  const decision = (probs[n - 1].pA - probs[n - 2].pA) + (probs[n - 1].pB - probs[n - 2].pB);
  return {
    pA: (r.chessWin + r.boxWin) * 100,
    board: (r.chessWin + r.chessLoss) * 100,
    stop: (r.boxWin + r.boxLoss - decision) * 100,
    koB: (r.boxLoss - (probs[n - 1].pB - probs[n - 2].pB)) * 100,
    koA: (r.boxWin - (probs[n - 1].pA - probs[n - 2].pA)) * 100
  };
}

const results = new Map(cases.map(c => [c.id, evaluate(c)]));

function check(c, m) {
  const fails = [];
  const fav = c.favourite;
  const bar = c.clear ? 15 : c.slight ? 0 : 5; // distance from 50 %
  const kind = c.clear ? 'clear ' : c.slight ? 'slight ' : '';
  if (fav === 'A' && !(m.pA > 50 + bar)) fails.push(`A should be ${kind}favourite`);
  if (fav === 'B' && !(m.pA < 50 - bar)) fails.push(`B should be ${kind}favourite`);
  if (fav === 'even' && !(m.pA >= 45 && m.pA <= 55)) fails.push('should be even (45–55 %)');
  if (fav === 'even-B' && !(m.pA >= 40 && m.pA <= 50)) fails.push('should be balanced, B slightly ahead (40–50 %)');
  if (c.ending === 'chess' && !(m.board > m.stop)) fails.push('should end mostly at the board');
  if (c.ending === 'boxing' && !(m.stop > m.board)) fails.push('should end mostly by stoppage');
  if (c.ko_not_above_case) {
    const ref = results.get(c.ko_not_above_case);
    const ko = fav === 'B' ? m.koB : m.koA, refKo = fav === 'B' ? ref.koB : ref.koA;
    if (ko > refKo + (c.ko_tolerance ?? 0)) fails.push(`knockout ${ko.toFixed(0)} % should not exceed case ${c.ko_not_above_case} (${refKo.toFixed(0)} %)`);
  }
  return fails;
}

let failed = 0, known = 0;
for (const c of cases) {
  const m = results.get(c.id);
  const fails = check(c, m);
  const status = !fails.length ? 'ok   ' : c.known_issue ? 'known' : 'FAIL ';
  if (fails.length && c.known_issue) known++;
  else if (fails.length) failed++;
  const line = `${status} #${String(c.id).padEnd(2)} ${String(c.rounds).padStart(2)}R  ` +
    `A ${c.A.elo}/${c.A.box} vs B ${c.B.elo}/${c.B.box}  A wins ${m.pA.toFixed(1)} %  ` +
    `board ${m.board.toFixed(0)} %  stop ${m.stop.toFixed(0)} %`;
  console.log(line + (fails.length ? `\n        ${fails.join('; ')}` : ''));
}

console.log(`\n${cases.length - failed - known} ok, ${known} known issues, ${failed} failing`);
process.exit(failed ? 1 : 0);
