import './style.css';
import { i18n, currentLang, setLangState } from './i18n.js';
import { eloOf, pWin, getWinBreakdown, getActiveConfig, setActiveConfig, getSide, setSide, whiteEdgeAt, kChessFactor, kBoxFactor, CHESS_MIN, CHESS_MAX, CHESS_STEP, BOX_MIN, BOX_MAX, BOX_STEP } from './model.js';
import { chessLevels, boxLevels, starsOf, rankOf, draw, color, px2cell, CELL, MARGIN, NX, NY, invalidateGrid } from './grid.js';
import {
  chessCategory, boxCategory, getChessDrumLevels, getBoxingDrumLevels,
  buildStarSvg, setStars, setupSlider, pulse, miniStarsHTML, tooltipLineHTML, escapeHtml
} from './ui.js';
import { FIGHTERS } from './fighters.js';

let myChess = 3.0;
let myBox = 2.0;
let oppChess = 3.0; // ≈1500 ELO (1486)
let oppBox = 2.0;
let strictMatchmaking = false;
let showEarlyStoppageZone = false;

const $ = id => document.getElementById(id);
const t = () => i18n[currentLang];
const pct = p => Math.round(p * 100) + '%';

const idxOf = (c, b) => ({
  i: Math.max(0, Math.min(NX - 1, Math.round((c - CHESS_MIN) / CHESS_STEP))),
  j: Math.max(0, Math.min(NY - 1, Math.round((b - BOX_MIN) / BOX_STEP)))
});
// One training step: +1 boxing level or +1 chess level (≈230 ELO), capped at the top.
const upBox = b => Math.min(BOX_MAX, +(b + 1).toFixed(1));
const upChess = c => Math.min(CHESS_MAX, +(c + 1).toFixed(1));
const starsAt = (c, b) => { const { i, j } = idxOf(c, b); return starsOf(i, j); };

function fighterType(c, b) {
  const cn = c / CHESS_MAX, bn = b / BOX_MAX;
  if (cn >= 0.7 && bn >= 0.7) return 'complete';
  if (cn - bn > 0.15) return 'tactician';
  if (bn - cn > 0.15) return 'brawler';
  return 'balanced';
}

// ── Stars ────────────────────────────────────────────────────────────────────
const myStarsClip = buildStarSvg($('myStars'));
const oppStarsClip = buildStarSvg($('oppStars'));

function renderYou() {
  const tt = t();
  const { i, j } = idxOf(myChess, myBox);
  const s = starsOf(i, j);
  $('my-stars-num').textContent = s.toFixed(1);
  setStars(myStarsClip, s);
  const type = fighterType(myChess, myBox);
  $('my-type').textContent = tt['type_' + type];
  $('my-type').title = tt['type_' + type + '_desc'];
  $('my-top').textContent = `${tt.top} ${Math.max(1, Math.round((1 - rankOf(i, j)) * 100))}% ${tt.of_fighters}`;

  const sBox = myBox < BOX_MAX ? starsAt(myChess, upBox(myBox)) : null;
  const sChess = myChess < CHESS_MAX ? starsAt(upChess(myChess), myBox) : null;
  setLever('lever-box', sBox, v => v / 5, v => v.toFixed(1) + ' ★');
  setLever('lever-chess', sChess, v => v / 5, v => v.toFixed(1) + ' ★');

  const dB = sBox === null ? null : sBox - s;
  const dC = sChess === null ? null : sChess - s;
  let text;
  if (dB === null && dC === null) text = tt.more_stars_max;
  else if (dC === null || (dB !== null && dB - dC >= 0.1)) text = tt.more_stars_box(dB.toFixed(1));
  else if (dB === null || dC - dB >= 0.1) text = tt.more_stars_chess(dC.toFixed(1));
  else text = tt.more_stars_even;
  $('lever-text').textContent = text;
}

function setLever(prefix, value, toFrac, fmt, extra = '') {
  $(prefix + '-fill').style.width = value === null ? '0%' : (toFrac(value) * 100).toFixed(1) + '%';
  $(prefix + '-val').innerHTML = value === null ? t().maxed : fmt(value) + extra;
}

function renderOpp() {
  const s = starsAt(oppChess, oppBox);
  $('opp-stars-num').textContent = s.toFixed(1);
  setStars(oppStarsClip, s);
  $('opp-type').textContent = t()['type_' + fighterType(oppChess, oppBox)];
}

// ── The fight ────────────────────────────────────────────────────────────────
function verdict(p) {
  const tt = t();
  if (p > 0.70) return [tt.v_fav_clear, 'badge--gold'];
  if (p > 0.55) return [tt.v_fav, 'badge--gold'];
  if (p >= 0.45) return [tt.v_even, 'badge--neutral'];
  if (p > 0.30) return [tt.v_under, 'badge--blue'];
  return [tt.v_long, 'badge--blue'];
}

// Per-round chances that the fight ends in that round, for each side.
function roundBreakdown() {
  const params = getActiveConfig().params;
  const { probs } = getWinBreakdown(myChess, myBox, oppChess, oppBox);
  let prevA = 0, prevB = 0;
  return probs.map((p, r) => {
    const row = {
      label: r === params.length - 1 ? t().decision : 'R' + (r + 1),
      type: params[r].type,
      win: Math.max(0, p.pA - prevA),
      loss: Math.max(0, p.pB - prevB),
      cont: p.pCont
    };
    prevA = p.pA; prevB = p.pB;
    return row;
  });
}

// Rounds that carry at least a quarter of the total (max two), in fight order.
function keyRounds(rows, key) {
  const total = rows.reduce((s, r) => s + r[key], 0);
  if (total < 0.02) return [];
  return rows
    .filter(r => r[key] >= total * 0.25)
    .sort((a, b) => b[key] - a[key]).slice(0, 2)
    .sort((a, b) => rows.indexOf(a) - rows.indexOf(b))
    .map(r => r.label);
}

function renderFight() {
  const tt = t();
  const p = pWin(myChess, myBox, oppChess, oppBox);
  $('win-pct').textContent = pct(p);
  const [label, cls] = verdict(p);
  const v = $('verdict');
  v.textContent = label;
  v.className = 'badge verdict__badge ' + cls;
  $('color-compare').textContent = getSide() ? '' :
    tt.color_compare(pct(pWin(myChess, myBox, oppChess, oppBox, 1)), pct(pWin(myChess, myBox, oppChess, oppBox, -1)));

  const { chessWin, boxWin, chessLoss, boxLoss, expectedRounds } = getWinBreakdown(myChess, myBox, oppChess, oppBox);
  const segs = [boxWin, chessWin, chessLoss, boxLoss];
  [...$('ends-bar').children].forEach((el, k) => { el.style.flexGrow = segs[k]; });
  $('p-win-ring').textContent = pct(boxWin);
  $('p-win-board').textContent = pct(chessWin);
  $('p-lose-board').textContent = pct(chessLoss);
  $('p-lose-ring').textContent = pct(boxLoss);

  const n = getActiveConfig().params.length - 1; // fighting rounds (last param = decision)
  const e = Math.min(expectedRounds, n);
  $('expected-len').textContent = tt.of_rounds(e.toFixed(1), n);
  $('expected-hint').textContent = e < n * 0.5 ? `(${tt.early_hint})` : e > n * 0.85 ? `(${tt.distance_hint})` : '';

  // Game plan
  const youBy = boxWin >= chessWin ? tt.ring_word : tt.board_word;
  const themBy = chessLoss >= boxLoss ? tt.board_word : tt.ring_word;
  $('game-plan').innerHTML = youBy === themBy
    ? escapeHtml(tt.edge_same(youBy))
    : `${escapeHtml(tt.edge_you)} <b class="gold">${escapeHtml(youBy)}</b>. ${escapeHtml(tt.edge_opp)} <b class="blue">${escapeHtml(themBy)}</b>.`;
  const rows = roundBreakdown();
  const best = keyRounds(rows, 'win'), danger = keyRounds(rows, 'loss');
  $('plan-rounds').innerHTML =
    (best.length ? `<div><span class="muted">${escapeHtml(tt.best_rounds)}</span> ${best.map(r => `<span class="chip chip--gold">${r}</span>`).join('')}</div>` : '') +
    (danger.length ? `<div><span class="muted">${escapeHtml(tt.danger_rounds)}</span> ${danger.map(r => `<span class="chip chip--blue">${r}</span>`).join('')}</div>` : '');

  const pBox = myBox < BOX_MAX ? pWin(myChess, upBox(myBox), oppChess, oppBox) : null;
  const pChess = myChess < CHESS_MAX ? pWin(upChess(myChess), myBox, oppChess, oppBox) : null;
  const gain = v => ` <span class="muted">+${Math.round(v * 100) - Math.round(p * 100)}</span>`;
  setLever('train-box', pBox, v => v, pct, pBox === null ? '' : gain(pBox));
  setLever('train-chess', pChess, v => v, pct, pChess === null ? '' : gain(pChess));

  renderRounds(rows);
  renderMethod(rows);
}

function renderMethod(rows) {
  const tt = t();
  const m = (myChess + oppChess) / 2, n = (myBox + oppBox) / 2;
  const kc = kChessFactor(m), kb = kBoxFactor(n);
  const num = v => currentLang === 'fr' ? String(v).replace('.', ',') : String(v);
  $('method-body').innerHTML = tt.method_html({
    m: num(m.toFixed(1)), n: num(n.toFixed(1)),
    kc: num(kc.toFixed(2)), kb: num(kb.toFixed(2)), w: num(whiteEdgeAt(m).toFixed(3))
  });
  const params = getActiveConfig().params;
  const fmtK = k => k >= 100 ? Math.round(k) : k >= 10 ? k.toFixed(1) : k.toFixed(2);
  $('method-table').innerHTML =
    `<thead><tr><th>${tt.mt_round}</th><th>${tt.mt_type}</th><th>${tt.mt_a}</th><th>${tt.mt_k}</th><th>${tt.mt_k_fight}</th><th>${tt.mt_win}</th><th>${tt.mt_loss}</th><th>${tt.mt_cont}</th></tr></thead><tbody>` +
    rows.map((r, i) => {
      const { type, a, k } = params[i];
      const kHere = k * (type === 'chess' ? kc : kb);
      return `<tr${r.win + r.loss >= 0.15 ? ' class="hl"' : ''}><td>${r.label}</td><td>${type === 'chess' ? tt.mt_chess : tt.mt_box}</td>` +
        `<td>${num(a.toFixed(2))}</td><td>${num(fmtK(k))}</td><td>${num(fmtK(kHere))}</td>` +
        `<td>${num((r.win * 100).toFixed(1))}%</td><td>${num((r.loss * 100).toFixed(1))}%</td><td>${num((r.cont * 100).toFixed(1))}%</td></tr>`;
    }).join('') + '</tbody>';
  const side = getSide() === 1 ? tt.side_white : getSide() === -1 ? tt.side_black : tt.side_none;
  $('method-table-note').textContent = tt.mt_note(params.length - 1, side);
}

function renderRounds(rows) {
  $('round-rows').innerHTML = rows.map(r => {
    const icon = r.type === 'chess' ? 'assets/icon-chess.png' : 'assets/icon-boxing.png';
    return `<div class="round-row">
      <span class="round-row__label"><img src="${icon}" alt="">${r.label}</span>
      <span class="round-row__bars">
        <span class="round-row__win" style="width:${(r.win * 100).toFixed(1)}%"></span><span class="round-row__loss" style="width:${(r.loss * 100).toFixed(1)}%"></span>
        <span class="round-row__txt"><b class="gold">${pct(r.win)}</b> · <b class="blue">${pct(r.loss)}</b></span>
      </span>
      <span class="round-row__cont">${pct(r.cont)}</span>
    </div>`;
  }).join('');
}

// ── Chances map (canvas) ─────────────────────────────────────────────────────
const canvas = $('grid');
canvas.width = MARGIN.left + NX * CELL + MARGIN.right;
canvas.height = MARGIN.top + NY * CELL + MARGIN.bottom;
const ctx = canvas.getContext('2d');
const tooltip = $('tooltip');
const mapDetails = $('d-map');

function drawMap() {
  if (!mapDetails.open) return;
  draw(canvas, ctx, myChess, myBox, strictMatchmaking, idxOf(oppChess, oppBox), showEarlyStoppageZone);
}
mapDetails.addEventListener('toggle', drawMap);

(function () {
  const lc = $('legendBar');
  const lctx = lc.getContext('2d');
  for (let x = 0; x < lc.width; x++) {
    lctx.fillStyle = color(x / (lc.width - 1));
    lctx.fillRect(x, 0, 1, lc.height);
  }
})();

function showTooltip(idx, cssX, cssY) {
  if (!idx) { tooltip.style.display = 'none'; return; }
  const tt = t();
  const oc = chessLevels[idx.i], ob = boxLevels[idx.j];
  const p = pWin(myChess, myBox, oc, ob);
  tooltip.style.display = 'block';
  tooltip.innerHTML =
    tooltipLineHTML('assets/icon-chess.png', `<b>${escapeHtml(chessCategory(oc).short)}</b>`, `<span class="tt-elo">ELO ${eloOf(oc)}</span>`) + `<br>` +
    tooltipLineHTML('assets/icon-boxing.png', `<b>${escapeHtml(boxCategory(ob))}</b>`, `<span class="tt-elo">${tt.lvl} ${ob.toFixed(1)}</span>`) + `<br>` +
    `<b>${pct(p)}</b>` +
    `<span class="tt-stars">${miniStarsHTML(starsOf(idx.i, idx.j))}</span>`;

  const ttW = tooltip.offsetWidth || 150;
  const ttH = tooltip.offsetHeight || 80;
  const r = canvas.getBoundingClientRect();
  let left = Math.max(ttW / 2 + 4, Math.min(r.width - ttW / 2 - 4, cssX));
  let top = cssY - 14;
  if (top - ttH < 4) { top = cssY + 24; tooltip.style.transform = 'translate(-50%, 0)'; }
  else tooltip.style.transform = 'translate(-50%, -100%)';
  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
}

function eventCoords(e) {
  const r = canvas.getBoundingClientRect();
  const cssX = e.clientX - r.left, cssY = e.clientY - r.top;
  return { cssX, cssY, canvasX: cssX * (canvas.width / r.width), canvasY: cssY * (canvas.height / r.height) };
}

let pdTime = 0, pdX = 0, pdY = 0, dragging = false;
canvas.addEventListener('pointerdown', e => {
  pdTime = Date.now(); pdX = e.clientX; pdY = e.clientY; dragging = false;
  const { cssX, cssY, canvasX, canvasY } = eventCoords(e);
  showTooltip(px2cell(canvasX, canvasY), cssX, cssY);
});
canvas.addEventListener('pointermove', e => {
  if (Math.hypot(e.clientX - pdX, e.clientY - pdY) > 6) dragging = true;
  const { cssX, cssY, canvasX, canvasY } = eventCoords(e);
  showTooltip(px2cell(canvasX, canvasY), cssX, cssY);
});
canvas.addEventListener('pointerup', e => {
  const { canvasX, canvasY } = eventCoords(e);
  const idx = px2cell(canvasX, canvasY);
  tooltip.style.display = 'none';
  if (!dragging && Date.now() - pdTime < 400 && idx) setOpponent(chessLevels[idx.i], boxLevels[idx.j]);
});
canvas.addEventListener('pointerleave', () => { tooltip.style.display = 'none'; });
canvas.addEventListener('pointercancel', () => { tooltip.style.display = 'none'; });

function updateRulesDisplay() {
  const tt = t();
  const minRnds = getActiveConfig().minExpectedRounds;
  const rules = [];
  if (strictMatchmaking) rules.push(tt.rule_strict(minRnds));
  if (showEarlyStoppageZone) rules.push(tt.rule_early_stoppage(minRnds));
  const el = $('active-rules-container');
  el.innerHTML = rules.join('&ensp;·&ensp;');
  el.style.display = rules.length ? 'block' : 'none';
}

$('strict-matchmaking-toggle').addEventListener('change', e => {
  strictMatchmaking = e.target.checked;
  updateRulesDisplay();
  drawMap();
});
$('early-stoppage-toggle').addEventListener('change', e => {
  showEarlyStoppageZone = e.target.checked;
  $('early-stoppage-legend').hidden = !showEarlyStoppageZone;
  updateRulesDisplay();
  drawMap();
});

// ── Known fighters ───────────────────────────────────────────────────────────
function renderFighters() {
  if (!FIGHTERS.length) return;
  const tt = t();
  $('fighters').hidden = false;
  $('fighter-pick-wrap').hidden = false;

  const list = FIGHTERS.map(f => ({ ...f, stars: starsAt(f.chess, f.box), p: pWin(myChess, myBox, f.chess, f.box) }));
  const rows = [...list, { name: tt.you, chess: myChess, box: myBox, stars: starsAt(myChess, myBox), me: true }]
    .sort((a, b) => b.stars - a.stars);
  $('fighter-rows').innerHTML = rows.map((f, k) => {
    const cells = `<span class="fr-rank">${k + 1}</span>
      <span class="fr-name"><b>${escapeHtml(f.name)}</b><span class="muted">${eloOf(f.chess)} ELO · ${escapeHtml(boxCategory(f.box))}</span></span>
      <span class="fr-stars">${f.stars.toFixed(1)} ★</span>
      <span class="fr-odds">${f.me ? '—' : pct(f.p)}</span>`;
    return f.me
      ? `<div class="fighter-row fighter-row--me">${cells}</div>`
      : `<button type="button" class="fighter-row" data-chess="${f.chess}" data-box="${f.box}">${cells}</button>`;
  }).join('');

  const pick = $('fighter-pick');
  const keep = pick.value;
  pick.innerHTML = `<option value="">—</option>` + FIGHTERS.map((f, k) =>
    `<option value="${k}">${escapeHtml(f.name)} · ${starsAt(f.chess, f.box).toFixed(1)} ★</option>`).join('');
  pick.value = keep;
}

$('fighter-rows').addEventListener('click', e => {
  const row = e.target.closest('button.fighter-row');
  if (!row) return;
  setOpponent(+row.dataset.chess, +row.dataset.box);
  $('opponent').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
$('fighter-pick').addEventListener('change', e => {
  const f = FIGHTERS[+e.target.value];
  if (f) setOpponent(f.chess, f.box, true);
});

// ── Wiring ───────────────────────────────────────────────────────────────────
function renderAll() {
  renderYou();
  renderOpp();
  renderFight();
  renderFighters();
  drawMap();
}

function setOpponent(c, b, fromPicker = false) {
  oppChess = c; oppBox = b;
  oppChessSlider.setValue(c);
  oppBoxSlider.setValue(b);
  if (!fromPicker) $('fighter-pick').value = '';
  renderOpp();
  renderFight();
  drawMap();
  pulse($('fight'));
}

const myChessSlider = setupSlider('my-chess-slider', 'my-chess-val', getChessDrumLevels, myChess,
  val => { myChess = val; renderAll(); pulse($('my-rating-card')); });
const myBoxSlider = setupSlider('my-box-slider', 'my-box-val', getBoxingDrumLevels, myBox,
  val => { myBox = val; renderAll(); pulse($('my-rating-card')); });
const oppChessSlider = setupSlider('opp-chess-slider', 'opp-chess-val', getChessDrumLevels, oppChess,
  val => { oppChess = val; $('fighter-pick').value = ''; renderOpp(); renderFight(); drawMap(); });
const oppBoxSlider = setupSlider('opp-box-slider', 'opp-box-val', getBoxingDrumLevels, oppBox,
  val => { oppBox = val; $('fighter-pick').value = ''; renderOpp(); renderFight(); drawMap(); });

function setLang(lang) {
  setLangState(lang);
  document.documentElement.lang = lang;
  const tt = t();
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = tt[el.getAttribute('data-i18n')];
    if (typeof v === 'string') el.textContent = v;
  });
  myChessSlider.setValue(myChess);
  myBoxSlider.setValue(myBox);
  oppChessSlider.setValue(oppChess);
  oppBoxSlider.setValue(oppBox);
  updateRulesDisplay();
  renderAll();
}

$('lang-switch').addEventListener('change', e => setLang(e.target.value));

document.querySelectorAll('input[name="side"]').forEach(r => r.addEventListener('change', e => {
  setSide(+e.target.value);
  renderFight();
  renderFighters();
  drawMap();
}));

document.querySelectorAll('.round-selector__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.round-selector__btn').forEach(b => b.classList.toggle('active', b === btn));
    setActiveConfig(btn.dataset.rounds);
    invalidateGrid();
    updateRulesDisplay();
    renderAll();
  });
});

setLang(currentLang);
