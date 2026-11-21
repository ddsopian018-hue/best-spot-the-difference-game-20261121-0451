// Scene 4 — Moon Garden. A quiet night garden: a koi pond under a cherry
// tree, an arched bridge, stone lanterns and fireflies.
import { circle, ellipse, glowingDisc, polygon, roundRect, sky, sparkle } from '../draw-helpers.js';

function drawKoi(ctx, x, y, angle, body) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ellipse(ctx, 0, 0, 16, 7, body);
  polygon(ctx, [[-14, 0], [-26, -8], [-26, 8]], '#f2ead8');
  circle(ctx, 10, -3, 2, '#1b1b1b');
  ctx.restore();
}

export const garden = {
  id: 'garden',
  name: 'Moon Garden',
  tagline: 'Koi, lanterns and fireflies',
  difficulty: 4,
  draw(ctx, W, H, mods) {
    sky(ctx, W, H, '#141b33', '#2c3a5e');
    // Moon: full — gone in the twin.
    if (!mods.moon) glowingDisc(ctx, 520, 70, 24, '#f2ead8', 'rgba(242, 234, 216, 0.22)');
    sparkle(ctx, 90, 60, 6, '#ffe98a');
    sparkle(ctx, 300, 44, 5, '#ffe98a');
    sparkle(ctx, 430, 130, 5, '#ffe98a');
    sparkle(ctx, 180, 110, 4, '#ffe98a');
    // Cherry tree, left. Blossoms pink — white in the twin.
    ctx.fillStyle = '#4a2f1a';
    ctx.fillRect(96, 180, 16, 150);
    ctx.fillRect(104, 220, 60, 10);
    const blossom = mods.blossom ? '#fdf6e3' : '#ff9ec7';
    circle(ctx, 110, 150, 52, blossom);
    circle(ctx, 70, 180, 38, blossom);
    circle(ctx, 150, 185, 36, blossom);
    circle(ctx, 110, 120, 30, blossom);
    // Fireflies. One extra glows in the twin.
    for (const [fx, fy] of [[250, 150], [340, 120], [420, 190], [200, 200]]) {
      circle(ctx, fx, fy, 3, '#d8ff7a');
      circle(ctx, fx, fy, 8, 'rgba(216, 255, 122, 0.25)');
    }
    if (mods.firefly) {
      circle(ctx, 290, 170, 3, '#d8ff7a');
      circle(ctx, 290, 170, 8, 'rgba(216, 255, 122, 0.25)');
    }
    // Pond.
    ellipse(ctx, 300, 380, 260, 66, '#2a6f8f');
    ellipse(ctx, 300, 376, 240, 56, '#35809f');
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(300, 380, 220, 48, 0, 0.2, 1.1);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(300, 380, 170, 36, 0, 2.4, 3.4);
    ctx.stroke();
    // Koi: three — two in the twin.
    drawKoi(ctx, 200, 368, 0.3, '#ff7a3c');
    drawKoi(ctx, 330, 392, -0.4, '#f2ead8');
    if (!mods.koi) drawKoi(ctx, 260, 340, 0.9, '#ffd23e');
    // Lily pad with a frog — the frog hopped away in the twin.
    ellipse(ctx, 390, 350, 26, 12, '#3a7d44');
    if (!mods.frog) {
      circle(ctx, 390, 340, 10, '#57a773');
      circle(ctx, 384, 332, 4, '#57a773');
      circle(ctx, 396, 332, 4, '#57a773');
      circle(ctx, 385, 331, 1.5, '#1b1b1b');
      circle(ctx, 395, 331, 1.5, '#1b1b1b');
    }
    // Arched bridge over the pond. Rails red — green in the twin.
    ctx.fillStyle = '#8a4b2d';
    ctx.beginPath();
    ctx.moveTo(210, 330);
    ctx.quadraticCurveTo(300, 250, 390, 330);
    ctx.lineTo(390, 348);
    ctx.quadraticCurveTo(300, 272, 210, 348);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = mods.bridge ? '#2a9d8f' : '#d94f3d';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(212, 326);
    ctx.quadraticCurveTo(300, 246, 388, 326);
    ctx.stroke();
    // Stepping stones.
    for (let i = 0; i < 3; i += 1) ellipse(ctx, 60 + i * 34, 420 - i * 8, 16, 8, '#8a8a92');
    // Stone lanterns. The right one is lit — dark in the twin.
    function stoneLantern(x, y, lit) {
      ctx.fillStyle = '#8a8a92';
      ctx.fillRect(x - 12, y, 24, 26);
      ctx.fillRect(x - 18, y - 6, 36, 8);
      ctx.fillRect(x - 14, y - 22, 28, 16);
      ctx.fillStyle = lit ? '#ffd23e' : '#3a3a44';
      ctx.fillRect(x - 8, y - 18, 16, 8);
      polygon(ctx, [[x - 20, y - 22], [x + 20, y - 22], [x, y - 34]], '#6b6b72');
      if (lit) circle(ctx, x, y - 14, 20, 'rgba(255, 210, 62, 0.22)');
    }
    stoneLantern(480, 300, !mods.lantern);
    stoneLantern(90, 300, true);
    // Grass and fallen petals.
    ctx.fillStyle = '#1e3a24';
    ctx.fillRect(0, 440, W, 20);
    circle(ctx, 160, 448, 4, blossom);
    circle(ctx, 420, 452, 4, blossom);
    circle(ctx, 250, 446, 3, blossom);
  },
  differences: [
    { id: 'koi', x: 260, y: 340, r: 22, label: 'A koi swam away' },
    { id: 'lantern', x: 480, y: 288, r: 22, label: 'A stone lantern went dark' },
    { id: 'blossom', x: 110, y: 150, r: 36, label: 'The blossoms turned white' },
    { id: 'frog', x: 390, y: 338, r: 20, label: 'The frog hopped away' },
    { id: 'moon', x: 520, y: 70, r: 28, label: 'The moon vanished' },
    { id: 'bridge', x: 300, y: 276, r: 32, label: 'The bridge rails changed colour' },
    { id: 'firefly', x: 290, y: 170, r: 14, label: 'An extra firefly appeared' },
  ],
};
