// Twin Canvas — tiny canvas drawing helpers shared by every scene.
// Each scene draws with these primitives so the two panels stay stylistically
// one game: flat shapes, thick outlines, a warm paper-grain feel.

/** Fill a circle. */
export function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Fill an ellipse. */
export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** Fill a rectangle with rounded corners. */
export function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

/** Fill a polygon from [x, y] points. */
export function polygon(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

/** A vertical sky gradient from `top` to `bottom` over the whole panel. */
export function sky(ctx, width, height, top, bottom) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/** A soft-edged sun or moon glow: a pale halo plus a solid disc. */
export function glowingDisc(ctx, x, y, r, core, halo) {
  circle(ctx, x, y, r * 1.55, halo);
  circle(ctx, x, y, r, core);
}

/** A simple two-hump cloud. */
export function cloud(ctx, x, y, scale, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, 16 * scale, 0, Math.PI * 2);
  ctx.arc(x + 20 * scale, y - 8 * scale, 14 * scale, 0, Math.PI * 2);
  ctx.arc(x + 40 * scale, y, 16 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - 14 * scale, y, 68 * scale, 12 * scale);
}

/** A tiny bird: two short arcs, like a distant gull. */
export function gull(ctx, x, y, scale, stroke) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2.5 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 10 * scale, y);
  ctx.quadraticCurveTo(x - 4 * scale, y - 7 * scale, x, y);
  ctx.quadraticCurveTo(x + 4 * scale, y - 7 * scale, x + 10 * scale, y);
  ctx.stroke();
}

/** A four-point star sparkle. */
export function sparkle(ctx, x, y, r, fill) {
  polygon(ctx, [
    [x, y - r],
    [x + r * 0.28, y - r * 0.28],
    [x + r, y],
    [x + r * 0.28, y + r * 0.28],
    [x, y + r],
    [x - r * 0.28, y + r * 0.28],
    [x - r, y],
    [x - r * 0.28, y - r * 0.28],
  ], fill);
}

/** Dark outline helper: strokes the current path with a soft dark line. */
export function outline(ctx, width) {
  ctx.strokeStyle = 'rgba(43, 24, 16, 0.55)';
  ctx.lineWidth = width;
  ctx.stroke();
}
