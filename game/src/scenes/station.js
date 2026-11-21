// Scene 5 — Starlight Station. A little observatory on the Moon: a rocket on
// its pad, a ringed planet, a satellite, an astronaut and a comet streaking by.
import { circle, ellipse, glowingDisc, polygon, roundRect, sky, sparkle } from '../draw-helpers.js';

export const station = {
  id: 'station',
  name: 'Starlight Station',
  tagline: 'A rocket, a ringed planet and one comet',
  difficulty: 5,
  draw(ctx, W, H, mods) {
    sky(ctx, W, H, '#0b1030', '#1c2a55');
    // Stars, one of them missing in the twin.
    const stars = [[60, 50], [150, 90], [250, 60], [330, 40], [420, 70], [500, 130], [560, 50], [90, 140], [200, 150], [380, 150]];
    for (const [sx, sy] of stars) {
      if (mods.star && sx === 250 && sy === 60) continue;
      sparkle(ctx, sx, sy, 5, '#ffffff');
    }
    // Ringed planet, upper left. Rings gone in the twin.
    glowingDisc(ctx, 120, 130, 34, '#e8a87c', 'rgba(232, 168, 124, 0.2)');
    ctx.fillStyle = 'rgba(232, 168, 124, 0.5)';
    ctx.fillRect(120, 128, 4, 4);
    if (!mods.rings) {
      ctx.strokeStyle = '#f2d8a7';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(120, 130, 58, 14, -0.35, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Comet: streaking across — absent in the twin.
    if (!mods.comet) {
      const grad = ctx.createLinearGradient(380, 90, 470, 60);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(1, 'rgba(255,255,255,0.9)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(380, 92);
      ctx.lineTo(468, 62);
      ctx.stroke();
      circle(ctx, 472, 60, 8, '#ffffff');
      circle(ctx, 472, 60, 14, 'rgba(255,255,255,0.3)');
    }
    // Moon surface.
    ctx.fillStyle = '#b8bcc4';
    ctx.fillRect(0, 330, W, H - 330);
    ctx.fillStyle = '#9aa0aa';
    ellipse(ctx, 90, 400, 40, 12, '#9aa0aa');
    ellipse(ctx, 500, 420, 52, 14, '#9aa0aa');
    ellipse(ctx, 300, 436, 30, 9, '#9aa0aa');
    // Observatory dome.
    ctx.fillStyle = '#e8e8ee';
    ctx.beginPath();
    ctx.arc(480, 330, 52, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#c8ccd4';
    ctx.fillRect(428, 330, 104, 14);
    ctx.fillStyle = '#3a4a6b';
    ctx.fillRect(468, 292, 24, 40);
    // Satellite. Panels blue — gold in the twin.
    ctx.fillStyle = '#d8dce4';
    roundRect(ctx, 452, 196, 34, 22, 4, '#d8dce4');
    ctx.fillStyle = mods.panel ? '#ffd23e' : '#3b82f6';
    ctx.fillRect(396, 200, 50, 14);
    ctx.fillRect(492, 200, 50, 14);
    ctx.strokeStyle = '#8a8a92';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(410, 214);
    ctx.lineTo(410, 226);
    ctx.moveTo(528, 214);
    ctx.lineTo(528, 226);
    ctx.stroke();
    circle(ctx, 469, 207, 5, '#e63946');
    // Rocket on its pad. Flame lit — off in the twin.
    ctx.fillStyle = '#e8e8ee';
    polygon(ctx, [[280, 330], [280, 220], [300, 190], [320, 220], [320, 330]], '#e8e8ee');
    polygon(ctx, [[300, 190], [312, 214], [288, 214]], '#e63946');
    circle(ctx, 300, 250, 10, '#7fb5ff');
    ctx.strokeStyle = '#3a4a6b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(300, 250, 10, 0, Math.PI * 2);
    ctx.stroke();
    polygon(ctx, [[280, 300], [262, 330], [280, 330]], '#e63946');
    polygon(ctx, [[320, 300], [338, 330], [320, 330]], '#e63946');
    if (!mods.flame) {
      polygon(ctx, [[288, 330], [300, 366], [312, 330]], '#ffb03c');
      polygon(ctx, [[293, 330], [300, 352], [307, 330]], '#ff5a3c');
    }
    // Astronaut. Waving (arm up) — arm down in the twin.
    circle(ctx, 380, 300, 12, '#f2ead8');
    roundRect(ctx, 368, 312, 24, 30, 8, '#f2ead8');
    ctx.fillStyle = '#7fb5ff';
    ctx.fillRect(372, 296, 16, 8);
    ctx.strokeStyle = '#f2ead8';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(370, 320);
    ctx.lineTo(356, 336);
    ctx.stroke();
    ctx.beginPath();
    if (mods.astronaut) {
      ctx.moveTo(390, 320);
      ctx.lineTo(402, 336);
    } else {
      ctx.moveTo(390, 320);
      ctx.lineTo(404, 300);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(376, 342);
    ctx.lineTo(372, 360);
    ctx.moveTo(384, 342);
    ctx.lineTo(388, 360);
    ctx.stroke();
    // Moon-base flag. Red — white in the twin.
    ctx.fillStyle = '#8a8a92';
    ctx.fillRect(148, 330, 3, 50);
    polygon(ctx, [[151, 332], [151, 346], [176, 339]], mods.flag ? '#f2ead8' : '#e63946');
    // Rover tracks.
    ctx.strokeStyle = 'rgba(90, 96, 106, 0.6)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(200, 420);
    ctx.quadraticCurveTo(300, 400, 420, 424);
    ctx.stroke();
    ctx.setLineDash([]);
  },
  differences: [
    { id: 'comet', x: 430, y: 76, r: 26, label: 'A comet streaked by' },
    { id: 'rings', x: 120, y: 130, r: 38, label: 'The planet lost its rings' },
    { id: 'astronaut', x: 388, y: 316, r: 24, label: 'The astronaut lowered an arm' },
    { id: 'panel', x: 514, y: 207, r: 28, label: 'A solar panel turned gold' },
    { id: 'star', x: 250, y: 60, r: 16, label: 'A star blinked out' },
    { id: 'flame', x: 300, y: 348, r: 24, label: 'The rocket flame went out' },
    { id: 'flag', x: 162, y: 339, r: 20, label: 'The base flag changed colour' },
  ],
};
