import { pWin, CHESS_MIN, CHESS_MAX, CHESS_STEP, BOX_MIN, BOX_MAX, BOX_STEP, eloOf, getActiveConfig, getWinBreakdown } from './model.js';
import { getChessNamed, getBoxingNamed, i18n, currentLang } from './i18n.js';

export function buildLevels(min, max, step) {
  const out = [];
  const n = Math.round((max - min) / step) + 1;
  for (let k = 0; k < n; k++) out.push(+(min + k * step).toFixed(2));
  return out;
}
export const chessLevels = buildLevels(CHESS_MIN, CHESS_MAX, CHESS_STEP);
export const boxLevels   = buildLevels(BOX_MIN,   BOX_MAX,   BOX_STEP);
export const NX = chessLevels.length;
export const NY = boxLevels.length;
export const CELL = 16;
export const MARGIN = { top: 50, right: 34, bottom: 94, left: 150 };

// Lazy grid: recomputed whenever invalidateGrid() is called (i.e. on format change).
let _avgP = null, _minAvg = 0, _maxAvg = 1;

function ensureGrid() {
  if (_avgP) return;
  _avgP = new Float32Array(NX * NY);
  _minAvg = Infinity; _maxAvg = -Infinity;
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      const c1 = chessLevels[i], b1 = boxLevels[j];
      let sum = 0;
      for (let j2 = 0; j2 < NY; j2++)
        for (let i2 = 0; i2 < NX; i2++)
          sum += pWin(c1, b1, chessLevels[i2], boxLevels[j2]);
      _avgP[j * NX + i] = sum / (NX * NY);
    }
  }
  for (let k = 0; k < _avgP.length; k++) {
    if (_avgP[k] < _minAvg) _minAvg = _avgP[k];
    if (_avgP[k] > _maxAvg) _maxAvg = _avgP[k];
  }
}

export function invalidateGrid() { _avgP = null; }

export function rankOf(i, j)  {
  ensureGrid();
  return (_avgP[j * NX + i] - _minAvg) / (_maxAvg - _minAvg);
}
export function starsOf(i, j) { return rankOf(i, j) * 5; }

export function color(p) {
  const cLow  = [26,  10,  46];
  const cMid  = [42,  92, 138];
  const cHigh = [245, 200,  66];
  let a, b, t;
  if (p < 0.5) { a = cLow; b = cMid;  t = p / 0.5; }
  else         { a = cMid; b = cHigh; t = (p - 0.5) / 0.5; }
  return `rgb(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)})`;
}

export function cell2px(i, j) {
  return { x: MARGIN.left + i * CELL, y: MARGIN.top + (NY - 1 - j) * CELL };
}
export function px2cell(px, py) {
  const i = Math.floor((px - MARGIN.left) / CELL);
  const j = NY - 1 - Math.floor((py - MARGIN.top) / CELL);
  if (i < 0 || i >= NX || j < 0 || j >= NY) return null;
  return { i, j };
}

export function getIsoline(threshold, myChess, myBox) {
  const pts = [];
  for (let i = 0; i < NX; i++) {
    for (let j = 0; j < NY - 1; j++) {
      const p1 = pWin(myChess, myBox, chessLevels[i], boxLevels[j]);
      const p2 = pWin(myChess, myBox, chessLevels[i], boxLevels[j + 1]);
      if ((p1 - threshold) * (p2 - threshold) <= 0) {
        const t = Math.abs(p2 - p1) < 1e-9 ? 0.5 : (threshold - p1) / (p2 - p1);
        const yJ  = MARGIN.top + (NY - 1 - j)     * CELL + CELL / 2;
        const yJ1 = MARGIN.top + (NY - 1 - j - 1) * CELL + CELL / 2;
        pts.push({
          x: MARGIN.left + i * CELL + CELL / 2,
          y: yJ + t * (yJ1 - yJ),
        });
        break;
      }
    }
  }
  return pts;
}

export function strokeLine(ctx, pts, col, width, dash) {
  if (pts.length < 2) return;
  ctx.save();
  ctx.strokeStyle = col;
  ctx.lineWidth = width;
  ctx.setLineDash(dash || []);
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k].x, pts[k].y);
  ctx.stroke();
  ctx.restore();
}

export function draw(canvas, ctx, myChess, myBox, showProbableFighters, strictMatchmaking, currentOppIdx) {
  const t = i18n[currentLang];
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      const { x, y } = cell2px(i, j);
      ctx.fillStyle = color(pWin(myChess, myBox, chessLevels[i], boxLevels[j]));
      ctx.fillRect(x, y, CELL, CELL);
    }
  }

  if (showProbableFighters || strictMatchmaking) {
    for (let j = 0; j < NY; j++) {
      for (let i = 0; i < NX; i++) {
        const boxDiff = Math.abs(myBox - boxLevels[j]);
        const myBoxAdvantage = myBox - boxLevels[j];
        const { expectedRounds, chessWin, boxWin } = getWinBreakdown(myChess - chessLevels[i], myBox - boxLevels[j]);
        const winProb = chessWin + boxWin;

        const minRnds = getActiveConfig().minExpectedRounds;
        let isInvalid = false;
        if (strictMatchmaking) {
          isInvalid = boxDiff > 1 || winProb > 0.70 || winProb < 0.30 || expectedRounds < minRnds;
        } else if (showProbableFighters) {
          isInvalid = myBoxAdvantage > 2 || winProb > 0.90 || expectedRounds < minRnds;
        }

        if (isInvalid) {
          const { x, y } = cell2px(i, j);
          ctx.fillStyle = 'rgba(12, 12, 20, 0.7)';
          ctx.fillRect(x, y, CELL, CELL);
        }
      }
    }
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= NX; i++) {
    const x = MARGIN.left + i * CELL + 0.5;
    ctx.beginPath(); ctx.moveTo(x, MARGIN.top); ctx.lineTo(x, MARGIN.top + NY * CELL); ctx.stroke();
  }
  for (let j = 0; j <= NY; j++) {
    const y = MARGIN.top + j * CELL + 0.5;
    ctx.beginPath(); ctx.moveTo(MARGIN.left, y); ctx.lineTo(MARGIN.left + NX * CELL, y); ctx.stroke();
  }

  strokeLine(ctx, getIsoline(0.10, myChess, myBox), 'rgba(255,255,255,0.34)', 1.1, [2, 2]);
  strokeLine(ctx, getIsoline(0.25, myChess, myBox), 'rgba(255,255,255,0.48)', 1.6, [4, 2]);
  strokeLine(ctx, getIsoline(0.45, myChess, myBox), 'rgba(255,255,255,0.76)', 2.8, [7, 2]);
  strokeLine(ctx, getIsoline(0.55, myChess, myBox), 'rgba(255,255,255,0.76)', 2.8, [7, 2]);
  strokeLine(ctx, getIsoline(0.75, myChess, myBox), 'rgba(255,255,255,0.48)', 1.6, [4, 2]);
  strokeLine(ctx, getIsoline(0.90, myChess, myBox), 'rgba(255,255,255,0.34)', 1.1, [2, 2]);
  strokeLine(ctx, getIsoline(0.50, myChess, myBox), 'rgba(245,200,66,0.98)', 3.5);

  if (currentOppIdx) {
    const { x: ox, y: oy } = cell2px(currentOppIdx.i, currentOppIdx.j);
    const ocx = ox + CELL / 2, ocy = oy + CELL / 2;
    const ods = CELL / 2 + 3;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(ocx, ocy - ods);
    ctx.lineTo(ocx + ods, ocy);
    ctx.lineTo(ocx, ocy + ods);
    ctx.lineTo(ocx - ods, ocy);
    ctx.closePath();
    ctx.fillStyle = 'rgba(74,158,255,0.9)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.82)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  const myI = Math.round((myChess - CHESS_MIN) / CHESS_STEP);
  const myJ = Math.round((myBox   - BOX_MIN)   / BOX_STEP);
  const sel = cell2px(myI, myJ);
  const cx = sel.x + CELL / 2, cy = sel.y + CELL / 2;
  const ds = CELL / 2 + 3;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - ds);
  ctx.lineTo(cx + ds, cy);
  ctx.lineTo(cx, cy + ds);
  ctx.lineTo(cx - ds, cy);
  ctx.closePath();
  ctx.fillStyle = 'rgba(245,200,66,0.92)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  ctx.lineWidth = 1; ctx.strokeStyle = '#3a3a4a';
  ctx.strokeRect(MARGIN.left + 0.5, MARGIN.top + 0.5, NX * CELL, NY * CELL);

  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  const cArr = getChessNamed();
  for (let v = CHESS_MIN; v <= CHESS_MAX; v++) {
    const i = Math.round((v - CHESS_MIN) / CHESS_STEP);
    const x = MARGIN.left + i * CELL + CELL / 2;
    const yTop = MARGIN.top + NY * CELL;
    ctx.beginPath(); ctx.moveTo(x, yTop); ctx.lineTo(x, yTop + 5);
    ctx.strokeStyle = '#5a5a6a'; ctx.lineWidth = 1; ctx.stroke();
    ctx.font = '14px system-ui'; ctx.fillStyle = '#c8b880';
    const cNamed = cArr.find(n => n.value === v);
    ctx.fillText(cNamed ? cNamed.short.split(' ')[0] : v, x, yTop + 7);
    ctx.font = '12px ui-monospace, Menlo, Consolas, monospace';
    ctx.fillStyle = '#7a6a40';
    ctx.fillText(eloOf(v), x, yTop + 24);
  }
  ctx.font = 'bold 15px system-ui'; ctx.fillStyle = '#8888a0';
  ctx.fillText(t.chess_axis, MARGIN.left + NX * CELL / 2, MARGIN.top + NY * CELL + 54);

  ctx.font = '13px system-ui'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  const bArr = getBoxingNamed();
  for (let v = BOX_MIN; v <= BOX_MAX; v++) {
    const j = Math.round((v - BOX_MIN) / BOX_STEP);
    const { y } = cell2px(0, j);
    ctx.beginPath(); ctx.moveTo(MARGIN.left - 5, y + CELL/2); ctx.lineTo(MARGIN.left, y + CELL/2);
    ctx.strokeStyle = '#5a5a6a'; ctx.lineWidth = 1; ctx.stroke();
    ctx.font = '13px system-ui';
    ctx.fillStyle = '#c8b880';
    const bNamed = bArr.find(n => n.value === v);
    ctx.fillText(bNamed ? bNamed.short : v, MARGIN.left - 10, y + CELL/2 - 8);
    ctx.font = '12px ui-monospace, Menlo, Consolas, monospace';
    ctx.fillStyle = '#7a6a40';
    ctx.fillText('Lv ' + v.toFixed(1), MARGIN.left - 10, y + CELL/2 + 10);
  }
  ctx.save();
  ctx.translate(22, MARGIN.top + NY * CELL / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'bold 15px system-ui'; ctx.fillStyle = '#8888a0';
  ctx.fillText(t.box_axis, 0, 0);
  ctx.restore();

  ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillStyle = '#6a6a80';
  ctx.fillText(t.color_legend, MARGIN.left, 14);
}
