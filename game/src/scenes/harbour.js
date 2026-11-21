// Scene 1 — Harbour Dawn. A fishing harbour at first light: sun, gulls, two
// boats, a lighthouse, a pier with crates and a buoy bobbing in the bay.
// Every difference is one named key in `mods`; the left panel draws with an
// empty map, the right panel with all seven set.
import { circle, cloud, ellipse, glowingDisc, gull, polygon, roundRect, sky } from '../draw-helpers.js';

function drawBoat(ctx, x, y, scale, hull, sail) {
  // Hull.
  polygon(ctx, [[x - 52 * scale, y], [x + 52 * scale, y], [x + 38 * scale, y + 22 * scale], [x - 38 * scale, y + 22 * scale]], hull);
  // Mast and sail.
  ctx.fillStyle = '#5b3a24';
  ctx.fillRect(x - 2 * scale, y - 62 * scale, 4 * scale, 62 * scale);
  polygon(ctx, [[x + 3 * scale, y - 60 * scale], [x + 3 * scale, y - 4 * scale], [x + 44 * scale, y - 4 * scale]], sail);
  polygon(ctx, [[x - 3 * scale, y - 56 * scale], [x - 3 * scale, y - 4 * scale], [x - 30 * scale, y - 4 * scale]], '#fdf3d8');
}

export const harbour = {
  id: 'harbour',
  name: 'Harbour Dawn',
  tagline: 'First light over the fishing boats',
  difficulty: 1,
  draw(ctx, W, H, mods) {
    sky(ctx, W, H, '#ffd9a0', '#ffeecf');
    // Sun: orange at dawn — pale yellow in the twin.
    glowingDisc(ctx, 90, 70, 30, mods.sun ? '#fff3b0' : '#ff9d3c', 'rgba(255, 190, 90, 0.35)');
    cloud(ctx, 220, 62, 1, '#fff6e6');
    cloud(ctx, 420, 44, 0.8, '#fff6e6');
    // One gull missing in the twin.
    gull(ctx, 300, 92, 1, '#4a3428');
    if (!mods.gull) gull(ctx, 352, 74, 0.85, '#4a3428');
    gull(ctx, 180, 120, 0.9, '#4a3428');
    // Distant headland.
    polygon(ctx, [[0, 300], [150, 238], [300, 300]], '#7d9b76');
    polygon(ctx, [[300, 300], [470, 252], [600, 300]], '#6b8a66');
    // Sea.
    ctx.fillStyle = '#3f8fb5';
    ctx.fillRect(0, 300, W, H - 300);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (let i = 0; i < 6; i += 1) ctx.fillRect(30 + i * 96, 322 + (i % 2) * 26, 54, 3);
    for (let i = 0; i < 5; i += 1) ctx.fillRect(70 + i * 110, 392 + (i % 2) * 18, 44, 3);
    // Buoy: red-and-white stripes — solid yellow in the twin.
    ellipse(ctx, 120, 384, 16, 10, mods.buoy ? '#ffd23e' : '#d94f3d');
    if (!mods.buoy) {
      ctx.fillStyle = '#fdf6e3';
      ctx.fillRect(104, 378, 32, 6);
    }
    ctx.fillStyle = '#5b3a24';
    ctx.fillRect(118, 366, 4, 12);
    // Boats. The near boat's sail is red — blue in the twin.
    drawBoat(ctx, 230, 330, 1, '#8a4b2d', mods.sail ? '#3b82f6' : '#e4572e');
    drawBoat(ctx, 420, 352, 0.72, '#5d6e8a', '#f2ead8');
    // Pier with crates — an extra crate appears in the twin.
    ctx.fillStyle = '#7a5230';
    ctx.fillRect(400, 392, 200, 12);
    ctx.fillStyle = '#5b3a24';
    ctx.fillRect(420, 404, 8, 34);
    ctx.fillRect(560, 404, 8, 34);
    roundRect(ctx, 428, 362, 30, 30, 3, '#b07a3f');
    roundRect(ctx, 462, 370, 24, 22, 3, '#8a5a2b');
    if (mods.crate) roundRect(ctx, 492, 374, 20, 18, 3, '#b07a3f');
    // Lighthouse with its lamp lit — dark in the twin.
    ctx.fillStyle = '#f4ead8';
    ctx.fillRect(512, 176, 34, 124);
    ctx.fillStyle = '#d94f3d';
    ctx.fillRect(512, 206, 34, 14);
    ctx.fillRect(512, 252, 34, 14);
    ctx.fillStyle = '#33415c';
    ctx.fillRect(508, 158, 42, 20);
    if (!mods.lamp) {
      glowingDisc(ctx, 529, 168, 9, '#ffe98a', 'rgba(255, 233, 138, 0.5)');
    } else {
      circle(ctx, 529, 168, 8, '#5b6b84');
    }
    polygon(ctx, [[508, 158], [550, 158], [529, 142]], '#33415c');
    // Mast flag: points right — left in the twin.
    ctx.fillStyle = '#5b3a24';
    ctx.fillRect(468, 176, 3, 60);
    polygon(ctx, mods.flag ? [[471, 178], [471, 192], [444, 185]] : [[471, 178], [471, 192], [498, 185]], '#e4572e');
    // Fisherman on the pier.
    circle(ctx, 545, 372, 8, '#f2c29b');
    ctx.fillStyle = '#2f6db3';
    ctx.fillRect(538, 380, 14, 14);
  },
  differences: [
    { id: 'sun', x: 90, y: 70, r: 34, label: 'The sun changed colour' },
    { id: 'gull', x: 352, y: 74, r: 20, label: 'A gull vanished' },
    { id: 'sail', x: 258, y: 296, r: 36, label: 'The sail changed colour' },
    { id: 'lamp', x: 529, y: 168, r: 24, label: 'The lighthouse lamp went dark' },
    { id: 'crate', x: 502, y: 383, r: 22, label: 'An extra crate appeared' },
    { id: 'buoy', x: 120, y: 380, r: 20, label: 'The buoy changed colour' },
    { id: 'flag', x: 484, y: 185, r: 22, label: 'The flag blows the other way' },
  ],
};
