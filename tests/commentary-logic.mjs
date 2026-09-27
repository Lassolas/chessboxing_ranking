// Checks that simulated-fight commentary stays logical, over many random fights.
// Usage: node tests/commentary-logic.mjs (also run by npm test)

import { setActiveConfig, getActiveConfig, getMatchupProbs, levelOfElo } from '../src/model.js';
import { narrate, COMMENTARY } from '../src/commentary.js';

const MATCHUPS = [[1500, 2, 1500, 2], [2400, 0, 800, 3], [1000, 4, 2200, 1], [1800, 2, 1600, 3], [2000, 5, 1200, 0.5]];
const FIGHTS = 400;
const errors = [];

for (const lang of ['en', 'fr']) {
  const L = COMMENTARY[lang];
  const open = new Set(Object.values(L.chess.open).flat());
  const hot = new Map(Object.values(L.box.hot).flat().map(x => [x.t, x]));
  const cutLine = { you: L.box.cut.you, them: L.box.cut.them };
  const boxLean = new Map();
  for (const k of ['even', 'you', 'them']) {
    L.box.calm[k].forEach(t => boxLean.set(t, k));
    L.box.hot[k].forEach(x => boxLean.set(x.t, k));
  }
  boxLean.set(cutLine.you, 'you');
  boxLean.set(cutLine.them, 'them');
  const clock = /flag|seconds|time trouble|drapeau|secondes|zeitnot/i;

  for (const fmt of ['5', '7', '9', '11']) {
    setActiveConfig(fmt);
    const params = getActiveConfig().params;
    const nChess = params.filter(p => p.type === 'chess').length;
    for (const [e1, b1, e2, b2] of MATCHUPS) {
      for (let n = 0; n < FIGHTS; n++) {
        const side = Math.random() < 0.5 ? 1 : -1;
        const probs = getMatchupProbs(levelOfElo(e1), b1, levelOfElo(e2), b2, side);
        const rounds = [];
        let pa = 0, pb = 0, pc = 1, chessSoFar = 0;
        for (let r = 0; r < params.length; r++) {
          const pA = (probs[r].pA - pa) / pc, pB = (probs[r].pB - pb) / pc;
          pa = probs[r].pA; pb = probs[r].pB; pc = probs[r].pCont;
          if (params[r].type === 'chess') chessSoFar++;
          const u = Math.random();
          const result = u < pA ? 'you' : u < pA + pB ? 'them' : null;
          rounds.push({ type: params[r].type, decision: r === params.length - 1, pA, pB,
            clockOk: params[r].type === 'chess' && chessSoFar >= Math.floor(nChess / 2) + 1, result });
          if (result) break;
        }
        const story = narrate(lang, rounds);
        const where = `${lang} ${fmt}R ${e1}/${b1} vs ${e2}/${b2}`;
        const counts = { you: 0, them: 0 }, cut = { you: false, them: false }, won = { you: 0, them: 0, even: 0 };

        story.rows.forEach((row, i) => {
          const rd = rounds[i];
          const t = row.text;
          if (rd.type === 'chess' && !rd.decision && !row.result && i === 0 && !open.has(t)) errors.push(`${where}: round 1 is not an opening line: ${t}`);
          if (i > 0 && open.has(t)) errors.push(`${where}: opening line after round 1: ${t}`);
          if (rd.type === 'chess' && !rd.clockOk && clock.test(t)) errors.push(`${where}: clock line in R${i + 1} before a flag can fall: ${t}`);
          if (rd.type === 'box' && !rd.decision && !row.result) {
            const h = hot.get(t);
            if (h) {
              if (h.you >= 3 || h.them >= 3) errors.push(`${where}: 3 counts in a round that goes on`);
              counts.you += h.you; counts.them += h.them;
              if (counts.you >= 4 || counts.them >= 4) errors.push(`${where}: 4 counts in the fight but it goes on`);
            }
            if (t === cutLine.you) cut.them = true;
            if (t === cutLine.them) cut.you = true;
            const lean = boxLean.get(t);
            if (!lean) errors.push(`${where}: unknown boxing line ${t}`);
            else won[lean]++;
          }
          if (rd.type === 'box' && !rd.decision && row.result) {
            const loser = row.result === 'you' ? 'them' : 'you';
            const lines = row.result === 'you' ? L.box.win : L.box.loss;
            if (t === lines.count4.t && counts[loser] < 3) errors.push(`${where}: "fourth count" with only ${counts[loser]} before`);
            if (t === lines.count4of2.t && counts[loser] !== 2) errors.push(`${where}: "two more make four" with ${counts[loser]} before`);
            if (t === lines.count3.t && counts[loser] > 1) errors.push(`${where}: "third of the round" with ${counts[loser]} before (would have stopped earlier)`);
            if (lines.doctor.some(x => x.t === t) && !cut[loser]) errors.push(`${where}: doctor stoppage without a cut`);
          }
          if (rd.decision) {
            const w = row.result, o = w === 'you' ? 'them' : 'you';
            if (won[w] <= won[o]) errors.push(`${where}: points to ${w} but boxing rounds ${won[w]}-${won[o]}`);
            if (story.boxing.won !== won[w]) errors.push(`${where}: decision says ${story.boxing.won} rounds, story shows ${won[w]}`);
          }
        });
        if (story.how === 'time') {
          const i = story.rows.length - 1;
          if (!rounds[i].clockOk) errors.push(`${where}: time loss in R${i + 1} before a flag can fall`);
        }
      }
    }
  }
}

const unique = [...new Set(errors)];
unique.slice(0, 20).forEach(e => console.log('FAIL', e));
console.log(unique.length ? `\ncommentary: ${errors.length} problems (${unique.length} distinct)` : `commentary: ok (${2 * 4 * MATCHUPS.length * FIGHTS} simulated fights checked)`);
process.exit(unique.length ? 1 : 0);
