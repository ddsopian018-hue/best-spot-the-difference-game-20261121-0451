// Scene 3 — Jungle Temple. A mossy stone temple deep in the jungle: torches,
// a ruby-eyed idol, vines, a waterfall and a bird on the roof.
import { circle, cloud, ellipse, gull, polygon, roundRect, sky, sparkle } from '../draw-helpers.js';

function drawTorch(ctx, x, y, lit) {
  ctx.fillStyle = '#5b3a24';
  ctx.fillRect(x - 3, y, 6, 34);
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(x - 6, y - 6, 12, 8);
  if (lit) {
    polygon(ctx, [[x, y - 30], [x + 9, y - 8], [x - 9, y - 8]], '#ffb03c');
    polygon(ctx, [[x, y - 20], [x + 5, y - 8], [x - 5, y - 8]], '#ff5a3c');
    circle(ctx, x, y - 14, 16, 'rgba(255, 176, 60, 0.25)');
  }
}

export const temple = {
  id: 'temple',
  name: 'Jungle Temple',
  tagline: 'Stone, vines and a ruby-eyed idol',
  difficulty: 3,
  draw(ctx, W, H, mods) {
    sky(ctx, W, H, '#bfe3c0', '#e8f3d8');
    circle(ctx, 80, 64, 26, '#fff3b0');
    cloud(ctx, 380, 56, 0.9, '#ffffff');
    cloud(ctx, 180, 40, 0.7, '#ffffff');
    // Jungle wall.
    ctx.fillStyle = '#2f6b3a';
    ctx.fillRect(0, 120, W, 340);
    ellipse(ctx, 60, 170, 90, 60, '#3a7d44');
    ellipse(ctx, 540, 160, 100, 66, '#3a7d44');
    ellipse(ctx, 300, 150, 130, 50, '#2a5c31');
    // Waterfall on the right — dry rock in the twin.
    ctx.fillStyle = '#6b6f7d';
    polygon(ctx, [[500, 150], [560, 150], [580, 340], [480, 340]], '#6b6f7d');
    if (!mods.falls) {
      ctx.fillStyle = '#a8d8e8';
      ctx.fillRect(516, 150, 30, 190);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillRect(522, 150, 6, 190);
      ctx.fillRect(536, 150, 4, 190);
      ellipse(ctx, 531, 348, 34, 10, '#a8d8e8');
    }
    // Temple body.
    ctx.fillStyle = '#b8a888';
    ctx.fillRect(180, 170, 240, 170);
    ctx.fillStyle = '#a08a68';
    ctx.fillRect(180, 170, 240, 12);
    ctx.fillStyle = '#8a7a58';
    for (let i = 0; i < 4; i += 1) ctx.fillRect(196 + i * 58, 182, 10, 158);
    // Roof and the bird on it — flown away in the twin.
    polygon(ctx, [[160, 172], [300, 118], [440, 172]], '#7d6a4a');
    polygon(ctx, [[180, 172], [300, 132], [420, 172]], '#937a55');
    if (!mods.bird) gull(ctx, 300, 108, 1.1, '#2b2b2b');
    // Idol niche with the gem: ruby — emerald in the twin.
    roundRect(ctx, 262, 200, 76, 90, 8, '#4a3a28');
    ctx.fillStyle = '#c9b896';
    ctx.fillRect(286, 214, 28, 62);
    circle(ctx, 300, 208, 12, '#c9b896');
    sparkle(ctx, 300, 236, 9, mods.gem ? '#2ecc71' : '#e63946');
    // Vines. The right vine is gone in the twin.
    ctx.strokeStyle = '#3a7d44';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(196, 170);
    ctx.quadraticCurveTo(176, 240, 196, 330);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(196, 210);
    ctx.quadraticCurveTo(214, 240, 196, 268);
    ctx.stroke();
    if (!mods.vine) {
      ctx.beginPath();
      ctx.moveTo(404, 170);
      ctx.quadraticCurveTo(424, 240, 404, 330);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(404, 230);
      ctx.quadraticCurveTo(386, 260, 404, 288);
      ctx.stroke();
    }
    // Torches. The left one is unlit in the twin.
    drawTorch(ctx, 150, 300, !mods.torch);
    drawTorch(ctx, 450, 300, true);
    // Steps: four — three in the twin (the second step is missing).
    ctx.fillStyle = '#a08a68';
    ctx.fillRect(150, 340, 300, 16);
    if (!mods.step) ctx.fillRect(170, 356, 260, 16);
    ctx.fillRect(190, 372, 220, 16);
    ctx.fillRect(210, 388, 180, 16);
    ctx.fillRect(230, 404, 140, 16);
    // Flowers at the base: pink — blue in the twin.
    for (let i = 0; i < 5; i += 1) {
      const fx = 90 + i * 26;
      circle(ctx, fx, 420, 7, mods.flower ? '#7fb5ff' : '#ff7eb6');
      circle(ctx, fx, 414, 3, '#ffd23e');
    }
    for (let i = 0; i < 4; i += 1) {
      const fx = 470 + i * 24;
      circle(ctx, fx, 424, 6, mods.flower ? '#7fb5ff' : '#ff7eb6');
    }
    // Grass tufts.
    ctx.strokeStyle = '#2f6b3a';
    ctx.lineWidth = 3;
    for (const [gx, gy] of [[40, 440], [560, 440], [330, 448], [120, 448]]) {
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx - 6, gy - 12);
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx, gy - 14);
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + 6, gy - 12);
      ctx.stroke();
    }
  },
  differences: [
    { id: 'torch', x: 150, y: 288, r: 22, label: 'A torch went out' },
    { id: 'gem', x: 300, y: 236, r: 18, label: 'The idol gem changed colour' },
    { id: 'vine', x: 404, y: 250, r: 24, label: 'A vine vanished' },
    { id: 'flower', x: 142, y: 418, r: 20, label: 'The flowers changed colour' },
    { id: 'step', x: 300, y: 364, r: 28, label: 'A temple step is missing' },
    { id: 'bird', x: 300, y: 106, r: 18, label: 'The roof bird flew away' },
    { id: 'falls', x: 531, y: 250, r: 26, label: 'The waterfall dried up' },
  ],
};
