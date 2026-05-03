import './style.css';
import { i18n, currentLang, setLangState, getChessNamed, getBoxingNamed } from './i18n.js';
import { eloOf, pWin, getWinBreakdown, getActiveConfig, setActiveConfig, CHESS_MIN, CHESS_MAX, CHESS_STEP, BOX_MIN, BOX_MAX, BOX_STEP } from './model.js';
import { chessLevels, boxLevels, starsOf, rankOf, draw, color, px2cell, CELL, MARGIN, NX, NY, invalidateGrid } from './grid.js';
import {
  chessCategory, getChessDrumLevels, getBoxingDrumLevels, boxLabelHTML,
  fightCardChessHTML, fightCardBoxHTML, outcomeLabel, outcomeColor,
  buildStarSvg, setStars, setupSlider, pulseCard, renderRoundChart,
  miniStarsHTML, tooltipLineHTML, escapeHtml, boxCategory
} from './ui.js';

let myChess = 3.0;
let myBox = 2.0;
let oppChess = 4.0;
let oppBox = 2.0;
let showProbableFighters = false;
let strictMatchmaking = false;
let showEarlyStoppageZone = false;
let currentOppIdx = null;

const canvas = document.getElementById('grid');
canvas.width = MARGIN.left + NX * CELL + MARGIN.right;
canvas.height = MARGIN.top + NY * CELL + MARGIN.bottom;
const ctx = canvas.getContext('2d');

const myStarsClip = buildStarSvg(document.getElementById('myStars'));
const fcMyStarsClip = buildStarSvg(document.getElementById('fc-my-stars'));
const oppStarsClip = buildStarSvg(document.getElementById('oppStars'));

const fightCard = document.getElementById('fight-card');
const tooltip = document.getElementById('tooltip');

function updateMine() {
  const i = Math.round((myChess - CHESS_MIN) / CHESS_STEP);
  const j = Math.round((myBox - BOX_MIN) / BOX_STEP);
  const cn = chessCategory(myChess);
  document.getElementById('myChessLabel').textContent = cn.short;
  document.getElementById('myElo').textContent = 'ELO ' + eloOf(myChess);
  document.getElementById('myBoxLabel').innerHTML = boxLabelHTML(myBox);
  document.getElementById('myRating').textContent = i18n[currentLang].top + ' ' + Math.max(1, Math.round((1 - rankOf(i, j)) * 100)) + '%';
  setStars(myStarsClip, starsOf(i, j));
  setStars(fcMyStarsClip, starsOf(i, j));

  document.getElementById('fc-my-chess').innerHTML = fightCardChessHTML(cn.short);
  document.getElementById('fc-my-elo').textContent = 'ELO ' + eloOf(myChess);
  document.getElementById('fc-my-box').innerHTML = fightCardBoxHTML(myBox);

  if (currentOppIdx && document.getElementById('opponent-setup').classList.contains('visible')) {
    showFightCard(currentOppIdx, false);
  }
}

function showFightCard(idx, updateDrums = true) {
  if (!idx) return;
  currentOppIdx = idx;
  const t = i18n[currentLang];
  const oc = chessLevels[idx.i], ob = boxLevels[idx.j];

  if (updateDrums && typeof oppChessSliderObj !== 'undefined') {
    oppChess = oc;
    oppBox = ob;
    oppChessSliderObj.setValue(oc);
    oppBoxSliderObj.setValue(ob);
  }
  const p = pWin(myChess, myBox, oc, ob);
  const cn = chessCategory(oc);
  const col = outcomeColor(p);

  document.getElementById('hChess').innerHTML = fightCardChessHTML(cn.short);
  document.getElementById('hElo').textContent = 'ELO ' + eloOf(oc);
  document.getElementById('hBox').innerHTML = fightCardBoxHTML(ob);
  document.getElementById('hP').textContent = Math.round(p * 100) + '%';
  document.getElementById('hP').style.color = col;
  document.getElementById('fc-outcome-label').textContent = outcomeLabel(p);
  document.getElementById('fc-outcome').style.borderColor = col;

  const { chessWin, boxWin, chessLoss, boxLoss, expectedRounds } = getWinBreakdown(myChess - oc, myBox - ob);
  const chessBarYouEl = document.getElementById('fc-chess-bar-you');
  const chessBarOppEl = document.getElementById('fc-chess-bar-opp');
  const boxBarYouEl = document.getElementById('fc-box-bar-you');
  const boxBarOppEl = document.getElementById('fc-box-bar-opp');
  const chessProbYouEl = document.getElementById('fc-chess-prob-you');
  const chessProbOppEl = document.getElementById('fc-chess-prob-opp');
  const boxProbYouEl = document.getElementById('fc-box-prob-you');
  const boxProbOppEl = document.getElementById('fc-box-prob-opp');

  const chessYouPct = chessWin * 100;
  const chessOppPct = chessLoss * 100;
  const boxYouPct = boxWin * 100;
  const boxOppPct = boxLoss * 100;

  chessBarYouEl.style.width = chessYouPct.toFixed(1) + '%';
  chessBarOppEl.style.left = chessYouPct.toFixed(1) + '%';
  chessBarOppEl.style.width = chessOppPct.toFixed(1) + '%';
  boxBarYouEl.style.width = boxYouPct.toFixed(1) + '%';
  boxBarOppEl.style.left = boxYouPct.toFixed(1) + '%';
  boxBarOppEl.style.width = boxOppPct.toFixed(1) + '%';

  chessProbYouEl.textContent = `${t.you} ${Math.round(chessWin * 100)}%`;
  chessProbOppEl.textContent = `${t.opp} ${Math.round(chessLoss * 100)}%`;
  boxProbYouEl.textContent = `${t.you} ${Math.round(boxWin * 100)}%`;
  boxProbOppEl.textContent = `${t.opp} ${Math.round(boxLoss * 100)}%`;
  chessBarYouEl.title = `${t.prob_win} ${t.chess}: ${Math.round(chessWin * 100)}%`;
  chessBarOppEl.title = `${t.opponent} ${t.prob_win.toLowerCase()} ${t.chess}: ${Math.round(chessLoss * 100)}%`;
  boxBarYouEl.title = `${t.prob_win} ${t.boxing}: ${Math.round(boxWin * 100)}%`;
  boxBarOppEl.title = `${t.opponent} ${t.prob_win.toLowerCase()} ${t.boxing}: ${Math.round(boxLoss * 100)}%`;

  const eloDiff = eloOf(myChess) - eloOf(oc);
  const boxDiff = +(myBox - ob).toFixed(1);
  const signStr = v => v > 0 ? '+' : '';
  const diffCol = v => v > 0 ? '#39d353' : v < 0 ? '#e03c3c' : '#9090a8';
  const cdEl = document.getElementById('fc-chess-diff');
  if (cdEl) { cdEl.textContent = signStr(eloDiff) + eloDiff + ' ELO'; cdEl.style.color = diffCol(eloDiff); }
  const bdEl = document.getElementById('fc-box-diff');
  if (bdEl) { bdEl.textContent = signStr(boxDiff) + boxDiff + ' ' + t.lvl; bdEl.style.color = diffCol(boxDiff); }

  const totalR = getActiveConfig().params.length;
  let pace = '';
  if (expectedRounds < totalR * 0.5) pace = t.early_stoppage;
  else if (expectedRounds > totalR * 0.82) pace = t.distance;

  document.getElementById('fc-expected-length').innerHTML = `${expectedRounds.toFixed(1)} ${t.rnds} <span class="fc-expected-desc">${pace}</span>`;

  setStars(oppStarsClip, starsOf(idx.i, idx.j));
  renderRoundChart(myChess - oc, myBox - ob);

  document.getElementById('opponent-setup').classList.add('visible');
  draw(canvas, ctx, myChess, myBox, showProbableFighters, strictMatchmaking, currentOppIdx, showEarlyStoppageZone);
}

function dismissFightCard() {
  document.getElementById('opponent-setup').classList.remove('visible');
  currentOppIdx = null;
  draw(canvas, ctx, myChess, myBox, showProbableFighters, strictMatchmaking, currentOppIdx, showEarlyStoppageZone);
}

document.getElementById('fc-close-btn').addEventListener('click', dismissFightCard);

function showTooltip(idx, cssX, cssY) {
  if (!idx) { tooltip.style.display = 'none'; return; }
  const t = i18n[currentLang];
  const oc = chessLevels[idx.i], ob = boxLevels[idx.j];
  const p = pWin(myChess, myBox, oc, ob);
  const cn = chessCategory(oc);
  tooltip.style.display = 'block';
  tooltip.innerHTML =
    tooltipLineHTML('assets/icon-chess.png', `<b>${escapeHtml(cn.short)}</b>`, `<span class="tt-elo">ELO ${eloOf(oc)}</span>`) + `<br>` +
    tooltipLineHTML('assets/icon-boxing.png', `<b>${escapeHtml(boxCategory(ob))}</b>`, `<span class="tt-elo">${t.lvl} ${ob.toFixed(1)}</span>`) + `<br>` +
    `<b style="color:${outcomeColor(p)}">${Math.round(p * 100)}%</b>` +
    `<span class="tt-stars">${miniStarsHTML(starsOf(idx.i, idx.j))}</span>`;

  const ttW = tooltip.offsetWidth || 150;
  const ttH = tooltip.offsetHeight || 80;
  let left = cssX;
  let top = cssY - 14;

  if (left - ttW / 2 < 10) left = ttW / 2 + 10;
  if (left + ttW / 2 > canvas.width - 10) left = canvas.width - ttW / 2 - 10;

  if (top - ttH < 10) {
    top = cssY + 24;
    tooltip.style.transform = 'translate(-50%, 0)';
  } else {
    tooltip.style.transform = 'translate(-50%, -100%)';
  }

  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
}

function eventCoords(e) {
  const r = canvas.getBoundingClientRect();
  const cssX = e.clientX - r.left, cssY = e.clientY - r.top;
  return {
    cssX, cssY,
    canvasX: cssX * (canvas.width / r.width),
    canvasY: cssY * (canvas.height / r.height)
  };
}

let pdTime = 0, pdX = 0, pdY = 0, dragging = false;

canvas.addEventListener('pointerdown', e => {
  try { canvas.setPointerCapture(e.pointerId); } catch (_) { }
  pdTime = Date.now(); pdX = e.clientX; pdY = e.clientY; dragging = false;
  const { cssX, cssY, canvasX, canvasY } = eventCoords(e);
  showTooltip(px2cell(canvasX, canvasY), cssX, cssY);
});
canvas.addEventListener('pointermove', e => {
  const dx = e.clientX - pdX, dy = e.clientY - pdY;
  if (Math.sqrt(dx * dx + dy * dy) > 6) dragging = true;
  const { cssX, cssY, canvasX, canvasY } = eventCoords(e);
  showTooltip(px2cell(canvasX, canvasY), cssX, cssY);
});
canvas.addEventListener('pointerup', e => {
  const { cssX, cssY, canvasX, canvasY } = eventCoords(e);
  const idx = px2cell(canvasX, canvasY);
  if (!dragging && Date.now() - pdTime < 400 && idx) {
    tooltip.style.display = 'none';
    showFightCard(idx);
  } else {
    tooltip.style.display = 'none';
  }
});
canvas.addEventListener('pointerleave', () => { tooltip.style.display = 'none'; });
canvas.addEventListener('pointercancel', () => { tooltip.style.display = 'none'; });
canvas.addEventListener('mousemove', e => {
  if (e.buttons !== 0) return;
  const { cssX, cssY, canvasX, canvasY } = eventCoords(e);
  showTooltip(px2cell(canvasX, canvasY), cssX, cssY);
});

window.addEventListener('keydown', e => {
  if (!currentOppIdx || !document.getElementById('opponent-setup').classList.contains('visible')) return;
  let changed = false;
  let { i, j } = currentOppIdx;
  if (e.key === 'ArrowUp') { j = Math.min(NY - 1, j + 1); changed = true; e.preventDefault(); }
  else if (e.key === 'ArrowDown') { j = Math.max(0, j - 1); changed = true; e.preventDefault(); }
  else if (e.key === 'ArrowLeft') { i = Math.max(0, i - 1); changed = true; e.preventDefault(); }
  else if (e.key === 'ArrowRight') { i = Math.min(NX - 1, i + 1); changed = true; e.preventDefault(); }

  if (changed && (i !== currentOppIdx.i || j !== currentOppIdx.j)) {
    showFightCard({ i, j });
  }
});

const myChessSliderObj = setupSlider(
  'my-chess-slider', 'my-chess-val', getChessDrumLevels, myChess,
  val => { myChess = val; updateMine(); draw(canvas, ctx, myChess, myBox, showProbableFighters, strictMatchmaking, currentOppIdx, showEarlyStoppageZone); pulseCard(); }
);
const myBoxSliderObj = setupSlider(
  'my-box-slider', 'my-box-val', getBoxingDrumLevels, myBox,
  val => { myBox = val; updateMine(); draw(canvas, ctx, myChess, myBox, showProbableFighters, strictMatchmaking, currentOppIdx, showEarlyStoppageZone); pulseCard(); }
);

const oppChessSliderObj = setupSlider(
  'opp-chess-slider', 'opp-chess-val', getChessDrumLevels, oppChess,
  val => {
    oppChess = val;
    const i = Math.round((oppChess - CHESS_MIN) / CHESS_STEP);
    const j = Math.round((oppBox - BOX_MIN) / BOX_STEP);
    showFightCard({ i, j }, false);
  }
);
const oppBoxSliderObj = setupSlider(
  'opp-box-slider', 'opp-box-val', getBoxingDrumLevels, oppBox,
  val => {
    oppBox = val;
    const i = Math.round((oppChess - CHESS_MIN) / CHESS_STEP);
    const j = Math.round((oppBox - BOX_MIN) / BOX_STEP);
    showFightCard({ i, j }, false);
  }
);

(function () {
  const lc = document.getElementById('legendBar');
  const lctx = lc.getContext('2d');
  for (let x = 0; x < lc.width; x++) {
    lctx.fillStyle = color(x / (lc.width - 1));
    lctx.fillRect(x, 0, 1, lc.height);
  }
})();

function updateRulesDisplay() {
  const t = i18n[currentLang];
  const rules = [];
  if (showProbableFighters) rules.push(t.rule_selectionable);
  if (strictMatchmaking)    rules.push(t.rule_strict);
  if (showEarlyStoppageZone) rules.push(t.rule_early_stoppage);
  const el = document.getElementById('active-rules-container');
  el.innerHTML = rules.join('&ensp;·&ensp;');
  el.style.display = rules.length ? '' : 'none';
}

document.getElementById('probable-fighters-toggle').addEventListener('change', e => {
  showProbableFighters = e.target.checked;
  updateRulesDisplay();
  draw(canvas, ctx, myChess, myBox, showProbableFighters, strictMatchmaking, currentOppIdx, showEarlyStoppageZone);
});

document.getElementById('strict-matchmaking-toggle').addEventListener('change', e => {
  strictMatchmaking = e.target.checked;
  updateRulesDisplay();
  draw(canvas, ctx, myChess, myBox, showProbableFighters, strictMatchmaking, currentOppIdx, showEarlyStoppageZone);
});

document.getElementById('early-stoppage-toggle').addEventListener('change', e => {
  showEarlyStoppageZone = e.target.checked;
  updateRulesDisplay();
  draw(canvas, ctx, myChess, myBox, showProbableFighters, strictMatchmaking, currentOppIdx, showEarlyStoppageZone);
});

function setLang(lang) {
  setLangState(lang);
  const t = i18n[lang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.innerHTML = t[key];
  });



  myChessSliderObj.setValue(myChess);
  myBoxSliderObj.setValue(myBox);
  oppChessSliderObj.setValue(oppChess);
  oppBoxSliderObj.setValue(oppBox);

  updateMine();
  updateRulesDisplay();
  draw(canvas, ctx, myChess, myBox, showProbableFighters, strictMatchmaking, currentOppIdx, showEarlyStoppageZone);
}

document.getElementById('lang-switch').addEventListener('change', e => setLang(e.target.value));

document.querySelectorAll('.round-selector__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.round-selector__btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    setActiveConfig(btn.dataset.rounds);
    invalidateGrid();
    updateMine();
    draw(canvas, ctx, myChess, myBox, showProbableFighters, strictMatchmaking, currentOppIdx, showEarlyStoppageZone);
    if (currentOppIdx && document.getElementById('opponent-setup').classList.contains('visible')) {
      showFightCard(currentOppIdx, false);
    }
  });
});

setLang(currentLang);
updateMine();
updateRulesDisplay();
draw(canvas, ctx, myChess, myBox, showProbableFighters, strictMatchmaking, currentOppIdx, showEarlyStoppageZone);
