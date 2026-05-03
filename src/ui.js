import { i18n, currentLang, getChessNamed, getBoxingNamed } from './i18n.js';
import { eloOf, pWin, getWinBreakdown, getActiveConfig, CHESS_MIN, CHESS_MAX, CHESS_STEP, BOX_MIN, BOX_MAX, BOX_STEP } from './model.js';
import { chessLevels, boxLevels, starsOf, rankOf, draw, color } from './grid.js';

export function closestNamed(arr, v) {
  let best = arr[0], bd = Infinity;
  for (const n of arr) { const d = Math.abs(n.value - v); if (d < bd) { bd = d; best = n; } }
  return best;
}

export function chessCategory(v) {
  const arr = getChessNamed();
  for (let i = arr.length - 1; i >= 0; i--) {
    if (v >= arr[i].value) return arr[i];
  }
  return arr[0];
}

export function getChessDrumLevels() {
  const arr = getChessNamed();
  const levels = [];
  for (let k = 0; k <= Math.round((CHESS_MAX - CHESS_MIN) / CHESS_STEP); k++) {
    const v = +(CHESS_MIN + k * CHESS_STEP).toFixed(1);
    const named = arr.find(n => n.value === v);
    const category = chessCategory(v);
    levels.push({ value: v, short: named ? named.short : category.short, sub: named ? named.sub : (eloOf(v) + ' ELO') });
  }
  return levels;
}

export function getBoxingDrumLevels() {
  const arr = getBoxingNamed();
  const levels = [];
  for (let k = 0; k <= Math.round((BOX_MAX - BOX_MIN) / BOX_STEP); k++) {
    const v = +(BOX_MIN + k * BOX_STEP).toFixed(1);
    const named = arr.find(n => n.value === v);
    levels.push({ value: v, short: named ? named.short : v.toFixed(1), sub: named ? named.sub : '' });
  }
  return levels;
}

export function boxCategory(v) {
  const arr = getBoxingNamed();
  const named = arr.find(n => n.value === v);
  return named ? named.short : closestNamed(arr, v).short;
}

export function boxMeta(v) {
  return 'Lv ' + v.toFixed(1);
}

export function boxLabelHTML(v, levelClass = 'fighter-card__box', metaClass = 'fighter-card__box-sub') {
  return `<b class="${levelClass}">${boxCategory(v)}</b><div class="${metaClass}">${boxMeta(v)}</div>`;
}

export function fightCardChessHTML(label) {
  return escapeHtml(label);
}

export function fightCardBoxHTML(v) {
  return boxLabelHTML(v, 'fc-comp-primary', 'fc-comp-secondary');
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function outcomeLabel(p) {
  const t = i18n[currentLang];
  if (p > 0.70) return t.dominate;
  if (p > 0.55) return t.win;
  if (p >= 0.45) return t.even_short;
  if (p > 0.30) return t.tough;
  return t.long_shot;
}

export function outcomeColor(p) {
  if (p > 0.55) return '#39d353';
  if (p >= 0.45) return '#4a9eff';
  return '#e03c3c';
}

export function miniStarsHTML(rating) {
  const pct = Math.max(0, Math.min(5, rating)) / 5 * 100;
  return `<span style="position:relative;display:inline-block;font-size:13px;line-height:1">
    <span style="color:#3a3020">★★★★★</span>
    <span style="color:#ffd24a;position:absolute;top:0;left:0;width:${pct}%;overflow:hidden;white-space:nowrap">★★★★★</span>
  </span>`;
}

export function tooltipLineHTML(icon, mainHtml, subHtml = '') {
  return `<span class="tt-line"><img src="${icon}" alt=""><span>${mainHtml}${subHtml}</span></span>`;
}

export const STAR_PATH = "M50 6 L62 38 L96 40 L70 60 L80 92 L50 74 L20 92 L30 60 L4 40 L38 38 Z";
export function buildStarSvg(svgEl) {
  const id = 'cp_' + Math.random().toString(36).slice(2, 9);
  let bg = '', fg = '';
  for (let k = 0; k < 5; k++) {
    bg += `<g transform="translate(${k*100},0)"><path d="${STAR_PATH}" fill="#2a2a1a" stroke="#5a4a18" stroke-width="2"/></g>`;
    fg += `<g transform="translate(${k*100},0)"><path d="${STAR_PATH}" fill="#f5b800" stroke="#c98e0a" stroke-width="2"/></g>`;
  }
  svgEl.innerHTML = `<defs><clipPath id="${id}"><rect x="0" y="0" width="0" height="100"/></clipPath></defs>
    <g>${bg}</g><g clip-path="url(#${id})">${fg}</g>`;
  return svgEl.querySelector(`#${id} rect`);
}

export function setStars(r, v) { r.setAttribute('width', Math.max(0, Math.min(5, v)) * 100); }

export function setupSlider(sliderId, valId, getLevelsFn, initialValue, onSelect) {
  const slider = document.getElementById(sliderId);
  const valDisplay = document.getElementById(valId);

  function updateDisplay(val) {
    const levels = getLevelsFn();
    const nearest = levels.reduce((best, item) =>
      Math.abs(item.value - val) < Math.abs(best.value - val) ? item : best, levels[0]);
    valDisplay.innerHTML = `${nearest.short}<span class="slider-sub">${nearest.sub}</span>`;
  }

  slider.value = initialValue;
  updateDisplay(initialValue);

  slider.addEventListener('input', e => {
    const val = parseFloat(e.target.value);
    updateDisplay(val);
    onSelect(val);
  });

  return {
    setValue: (val) => {
      slider.value = val;
      updateDisplay(val);
    }
  };
}

export function pulseCard() {
  const card = document.getElementById('my-fighter-card');
  card.classList.remove('pulse');
  void card.offsetWidth;
  card.classList.add('pulse');
  setTimeout(() => card.classList.remove('pulse'), 500);
}

export function renderRoundChart(dChess, dBox) {
  const container = document.getElementById('fc-round-rows');
  container.innerHTML = '';
  const { probs } = getWinBreakdown(dChess, dBox);
  const params = getActiveConfig().params;
  const totalRounds = params.length;

  for (let r = 1; r <= totalRounds; r++) {
    const { pA, pB } = probs[r - 1];
    const { type }   = params[r - 1];
    const wA = Math.round(pA * 100);
    const wB = Math.round(pB * 100);
    const row = document.createElement('div');
    row.className = 'fc-round-row';
    const isDecision = r === totalRounds;
    const icon    = type === 'chess' ? 'assets/icon-chess.png' : 'assets/icon-boxing.png';
    const label   = isDecision ? i18n[currentLang].decision : `R${r}`;
    const iconMarkup = !isDecision
      ? `<img class="fc-round-icon" src="${icon}" alt="">`
      : `<span class="fc-round-icon-spacer" aria-hidden="true"></span>`;
    row.innerHTML =
      iconMarkup +
      `<span class="fc-round-label">${label}</span>` +
      `<div class="fc-round-bar">` +
        `<div class="fc-round-fill-a" style="width:${wA}%"></div>` +
        `<div class="fc-round-fill-b" style="left:${wA}%;width:${wB}%"></div>` +
      `</div>` +
      `<span class="fc-round-detail">` +
        `<span style="color:var(--gold-mid)">${wA}%</span>` +
        ` · ` +
        `<span style="color:var(--even-blue)">${wB}%</span>` +
      `</span>`;
    container.appendChild(row);
  }
}
