import { getChessNamed, getBoxingNamed } from './i18n.js';
import { eloOf } from './model.js';

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

// Slider labels: category name plus the exact value.
export function chessLabel(c) {
  return { short: chessCategory(c).short, sub: eloOf(c) + ' ELO' };
}
export function boxLabel(b) {
  return { short: boxCategory(b), sub: 'Lv ' + b.toFixed(1) };
}

export function boxCategory(v) {
  const arr = getBoxingNamed();
  const named = arr.find(n => n.value === v);
  return named ? named.short : closestNamed(arr, v).short;
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
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

// toSlider / fromSlider convert between model values and the input's units
// (the chess slider works in ELO, 10 at a time).
export function setupSlider(sliderId, valId, labelFn, initialValue, onSelect, toSlider = v => v, fromSlider = v => v) {
  const slider = document.getElementById(sliderId);
  const valDisplay = document.getElementById(valId);

  function updateDisplay(val) {
    const { short, sub } = labelFn(val);
    valDisplay.innerHTML = `${escapeHtml(short)}<span class="slider-sub">${escapeHtml(sub)}</span>`;
  }

  slider.value = toSlider(initialValue);
  updateDisplay(initialValue);

  slider.addEventListener('input', e => {
    const val = fromSlider(parseFloat(e.target.value));
    updateDisplay(val);
    onSelect(val);
  });

  return {
    setValue: (val) => {
      slider.value = toSlider(val);
      updateDisplay(val);
    }
  };
}

export function pulse(el) {
  el.classList.remove('pulse');
  void el.offsetWidth;
  el.classList.add('pulse');
  setTimeout(() => el.classList.remove('pulse'), 500);
}
