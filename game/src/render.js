// Twin Canvas — the renderer. It paints the two panels side by side on one
// canvas: the left panel pristine, the right panel with every difference
// applied, then the found markers, the hint pulse, the wrong-click flash and
// the keyboard cursor. The HUD (counter, timer, score) lives in the DOM.
import { PANEL_HEIGHT, PANEL_WIDTH } from './config.js';
import { allDifferences } from './scenes/index.js';

const GAP = 16;
const PANEL_BORDER = '#2b1810';

/** Draw one scene panel at (x, 0) with the given modification map. */
function drawPanel(ctx, scene, mods, x) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, 0, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  // The scene draws in its own 0..PANEL_WIDTH coordinates; shift the origin
  // to the panel's left edge (the clip above is already fixed in place).
  ctx.translate(x, 0);
  scene.draw(ctx, PANEL_WIDTH, PANEL_HEIGHT, mods);
  ctx.restore();
  ctx.strokeStyle = PANEL_BORDER;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 1.5, 1.5, PANEL_WIDTH - 3, PANEL_HEIGHT - 3);
}

/** A satisfying found marker: a green ring with a tick, drawn on both panels. */
function drawFoundRing(ctx, x, y, r, ageMs) {
  const pop = ageMs < 200 ? 0.7 + (ageMs / 200) * 0.3 : 1;
  const radius = r * pop;
  ctx.save();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(34, 197, 94, 0.8)';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.45, y);
  ctx.lineTo(x - radius * 0.12, y + radius * 0.4);
  ctx.lineTo(x + radius * 0.5, y - radius * 0.35);
  ctx.stroke();
  ctx.restore();
}

/** A pulsing amber ring around the hinted difference, on both panels. */
function drawHintRing(ctx, x, y, r, nowMs) {
  const pulse = 1 + 0.18 * Math.sin(nowMs / 160);
  ctx.save();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 7]);
  ctx.lineDashOffset = -nowMs / 40;
  ctx.beginPath();
  ctx.arc(x, y, r * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** A red X where a wrong click landed, fading out. */
function drawWrongMark(ctx, x, y, ageMs, durationMs) {
  const alpha = 1 - ageMs / durationMs;
  ctx.save();
  ctx.globalAlpha = Math.max(alpha, 0);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 12);
  ctx.lineTo(x + 12, y + 12);
  ctx.moveTo(x + 12, y - 12);
  ctx.lineTo(x - 12, y + 12);
  ctx.stroke();
  ctx.restore();
}

/** A small crosshair that the arrow keys move and Enter clicks. */
function drawCursor(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.arc(x, y, 11, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 17, y);
  ctx.lineTo(x - 6, y);
  ctx.moveTo(x + 6, y);
  ctx.lineTo(x + 17, y);
  ctx.moveTo(x, y - 17);
  ctx.lineTo(x, y - 6);
  ctx.moveTo(x, y + 6);
  ctx.lineTo(x, y + 17);
  ctx.stroke();
  ctx.restore();
}

/**
 * Paint the whole game canvas.
 * `view` carries: scene, found (Map id -> foundAtMs), hint (diff or null),
 * wrong (panel-space {x,y,atMs} or null), cursor ({x,y,visible}), nowMs,
 * dimmed (true while an overlay covers the play area).
 */
export function drawGame(ctx, view) {
  const { scene, nowMs } = view;
  ctx.clearRect(0, 0, PANEL_WIDTH * 2 + GAP, PANEL_HEIGHT);
  drawPanel(ctx, scene, {}, 0);
  drawPanel(ctx, scene, allDifferences(scene), PANEL_WIDTH + GAP);

  for (const diff of scene.differences) {
    const foundAt = view.found.get(diff.id);
    if (foundAt === undefined) continue;
    const age = nowMs - foundAt;
    drawFoundRing(ctx, diff.x, diff.y, diff.r, age);
    drawFoundRing(ctx, PANEL_WIDTH + GAP + diff.x, diff.y, diff.r, age);
  }

  if (view.hint) {
    const diff = view.hint;
    drawHintRing(ctx, diff.x, diff.y, diff.r, nowMs);
    drawHintRing(ctx, PANEL_WIDTH + GAP + diff.x, diff.y, diff.r, nowMs);
  }

  if (view.wrong) {
    const age = nowMs - view.wrong.atMs;
    if (age < view.wrong.durationMs) {
      drawWrongMark(ctx, view.wrong.x, view.wrong.y, age, view.wrong.durationMs);
    }
  }

  if (view.cursor.visible) drawCursor(ctx, view.cursor.x, view.cursor.y);

  if (view.dimmed) {
    ctx.fillStyle = 'rgba(20, 14, 10, 0.45)';
    ctx.fillRect(0, 0, PANEL_WIDTH * 2 + GAP, PANEL_HEIGHT);
  }
}

/** The canvas is exactly the two panels plus the gap. */
export function canvasSize() {
  return { width: PANEL_WIDTH * 2 + GAP, height: PANEL_HEIGHT };
}
