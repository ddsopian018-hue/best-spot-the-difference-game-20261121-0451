// Scene 2 — Night Market. Lanterns, string lights and three stalls under a
// full moon: fruit, tea and toys, with a cat asleep on a crate.
import { circle, ellipse, glowingDisc, polygon, roundRect, sky, sparkle } from '../draw-helpers.js';

function drawStall(ctx, x, y, awning, sign) {
  // Counter and posts.
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(x - 62, y, 124, 54);
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(x - 62, y, 124, 10);
  ctx.fillStyle = '#4a2f1a';
  ctx.fillRect(x - 66, y - 74, 6, 128);
  ctx.fillRect(x + 60, y - 74, 6, 128);
  // Striped awning.
  for (let i = 0; i < 5; i += 1) {
    polygon(ctx, [[x - 72 + i * 29, y - 74], [x - 43 + i * 29, y - 74], [x - 48 + i * 29, y - 46], [x - 67 + i * 29, y - 46]], i % 2 === 0 ? awning : '#fdf3d8');
  }
  ctx.fillStyle = '#fdf3d8';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(sign, x, y + 34);
}

function drawLantern(ctx, x, y, scale, lit) {
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(x - 3 * scale, y - 26 * scale, 6 * scale, 4 * scale);
  ellipse(ctx, x, y, 13 * scale, 17 * scale, lit ? '#ff5a3c' : '#7a3b2e');
  ctx.fillStyle = lit ? '#ffd23e' : '#5b2f26';
  ctx.fillRect(x - 8 * scale, y - 4 * scale, 16 * scale, 8 * scale);
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(x - 3 * scale, y + 16 * scale, 6 * scale, 4 * scale);
  if (lit) circle(ctx, x, y, 26 * scale, 'rgba(255, 150, 60, 0.18)');
}

export const market = {
  id: 'market',
  name: 'Night Market',
  tagline: 'Lanterns, fruit and a sleeping cat',
  difficulty: 2,
  draw(ctx, W, H, mods) {
    sky(ctx, W, H, '#1b2340', '#3a2c55');
    // Moon: full — a crescent in the twin.
    if (mods.moon) {
      circle(ctx, 520, 62, 26, '#f2ead8');
      circle(ctx, 530, 56, 22, '#3a2c55');
    } else {
      glowingDisc(ctx, 520, 62, 26, '#f2ead8', 'rgba(242, 234, 216, 0.25)');
    }
    sparkle(ctx, 120, 60, 7, '#ffe98a');
    sparkle(ctx, 250, 40, 5, '#ffe98a');
    sparkle(ctx, 430, 110, 6, '#ffe98a');
    sparkle(ctx, 60, 130, 5, '#ffe98a');
    // String lights across the top; one bulb is missing in the twin.
    ctx.strokeStyle = '#241a12';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 96);
    ctx.quadraticCurveTo(300, 150, 600, 96);
    ctx.stroke();
    for (let i = 0; i < 9; i += 1) {
      const bx = 34 + i * 66;
      const by = 96 + Math.sin((i / 8) * Math.PI) * 26;
      if (mods.bulb && i === 6) continue;
      circle(ctx, bx, by + 8, 6, ['#ffd23e', '#ff5a3c', '#7ee0a3', '#7fb5ff'][i % 4]);
    }
    // Rooftops behind the stalls.
    polygon(ctx, [[0, 240], [120, 190], [240, 240]], '#241a35');
    polygon(ctx, [[360, 240], [490, 186], [600, 240]], '#241a35');
    // The three stalls. The middle awning is teal — orange in the twin.
    drawStall(ctx, 110, 300, '#d94f3d', 'FRUIT');
    drawStall(ctx, 300, 300, mods.awning ? '#f08a1d' : '#2a9d8f', 'TEA');
    drawStall(ctx, 490, 300, '#7b5ea7', 'TOYS');
    // Fruit pile on the first stall: apples — oranges in the twin.
    for (let i = 0; i < 5; i += 1) {
      circle(ctx, 84 + i * 12, 292 - (i % 2) * 8, 8, mods.fruit ? '#f08a1d' : '#d9382b');
    }
    // Tea cups on the middle stall.
    for (let i = 0; i < 3; i += 1) {
      roundRect(ctx, 268 + i * 26, 282, 18, 12, 3, '#f2ead8');
    }
    // Toy stall: a little spinning top and ball.
    circle(ctx, 490, 282, 10, '#7ee0a3');
    polygon(ctx, [[466, 292], [478, 268], [490, 292]], '#ffd23e');
    // Lanterns. The left one is gone in the twin.
    if (!mods.lantern) drawLantern(ctx, 150, 210, 1, true);
    drawLantern(ctx, 300, 196, 1.15, true);
    drawLantern(ctx, 452, 210, 1, false);
    // Sign board: round — square in the twin.
    ctx.fillStyle = '#f2ead8';
    if (mods.sign) {
      roundRect(ctx, 344, 108, 34, 34, 4, '#f2ead8');
    } else {
      circle(ctx, 361, 125, 17, '#f2ead8');
    }
    ctx.fillStyle = '#d94f3d';
    ctx.font = 'bold 13px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('OPEN', 361, 130);
    // Cobbles.
    ctx.fillStyle = '#4a3a5e';
    ctx.fillRect(0, 354, W, H - 354);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let i = 0; i < 8; i += 1) ellipse(ctx, 40 + i * 72, 392 + (i % 2) * 28, 30, 8, 'rgba(255,255,255,0.08)');
    // The cat: asleep on a crate — gone in the twin.
    roundRect(ctx, 440, 388, 58, 26, 4, '#8a5a2b');
    if (!mods.cat) {
      ellipse(ctx, 470, 386, 22, 12, '#3a3a3a');
      circle(ctx, 488, 378, 9, '#3a3a3a');
      polygon(ctx, [[484, 371], [488, 362], [492, 371]], '#3a3a3a');
    }
  },
  differences: [
    { id: 'moon', x: 520, y: 62, r: 30, label: 'The moon turned crescent' },
    { id: 'lantern', x: 150, y: 210, r: 24, label: 'A lantern vanished' },
    { id: 'awning', x: 300, y: 240, r: 34, label: 'The tea awning changed colour' },
    { id: 'cat', x: 470, y: 384, r: 24, label: 'The cat wandered off' },
    { id: 'fruit', x: 110, y: 288, r: 26, label: 'Apples became oranges' },
    { id: 'sign', x: 361, y: 125, r: 22, label: 'The OPEN sign changed shape' },
    { id: 'bulb', x: 430, y: 124, r: 16, label: 'A string-light bulb went out' },
  ],
};
