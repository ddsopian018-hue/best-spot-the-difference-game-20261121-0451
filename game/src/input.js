// Twin Canvas — input. Mouse clicks on either panel map back to scene
// coordinates; arrow keys move a crosshair cursor and Enter clicks where it
// stands, so the game is fully playable from the keyboard too.
// H spends a hint, P pauses, M mutes, N goes to the next level when offered.
import { PANEL_HEIGHT, PANEL_WIDTH } from './config.js';

const GAP = 16;
export const ACTION_CLICK = 'click';
export const ACTION_HINT = 'hint';
export const ACTION_PAUSE = 'pause';
export const ACTION_MUTE = 'mute';
export const ACTION_NEXT = 'next';
export const ACTION_CONFIRM = 'confirm';

/**
 * Create the input layer over `canvas`.
 * `onEvent(type, detail)` receives every action: a click carries scene
 * coordinates {x, y}; the rest carry no detail.
 */
export function createInput(canvas, onEvent) {
  const cursor = { x: PANEL_WIDTH / 2, y: PANEL_HEIGHT / 2, visible: false };

  function scenePoint(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const cssWidth = PANEL_WIDTH * 2 + GAP;
    const cssHeight = PANEL_HEIGHT;
    const px = ((clientX - rect.left) / rect.width) * cssWidth;
    const py = ((clientY - rect.top) / rect.height) * cssHeight;
    if (py < 0 || py > PANEL_HEIGHT) return null;
    if (px >= 0 && px < PANEL_WIDTH) return { x: px, y: py };
    if (px >= PANEL_WIDTH + GAP && px < PANEL_WIDTH * 2 + GAP) {
      return { x: px - PANEL_WIDTH - GAP, y: py };
    }
    return null;
  }

  function onPointerDown(event) {
    const point = scenePoint(event.clientX, event.clientY);
    if (point === null) return;
    cursor.x = point.x;
    cursor.y = point.y;
    cursor.visible = true;
    onEvent(ACTION_CLICK, point);
  }

  function moveCursor(dx, dy) {
    cursor.visible = true;
    cursor.x = Math.max(0, Math.min(PANEL_WIDTH, cursor.x + dx));
    cursor.y = Math.max(0, Math.min(PANEL_HEIGHT, cursor.y + dy));
  }

  function onKeyDown(event) {
    const step = event.shiftKey ? 48 : 16;
    switch (event.key) {
      case 'ArrowLeft':
        moveCursor(-step, 0);
        event.preventDefault();
        break;
      case 'ArrowRight':
        moveCursor(step, 0);
        event.preventDefault();
        break;
      case 'ArrowUp':
        moveCursor(0, -step);
        event.preventDefault();
        break;
      case 'ArrowDown':
        moveCursor(0, step);
        event.preventDefault();
        break;
      case 'Enter':
      case ' ':
        cursor.visible = true;
        onEvent(ACTION_CLICK, { x: cursor.x, y: cursor.y });
        event.preventDefault();
        break;
      case 'h':
      case 'H':
        onEvent(ACTION_HINT);
        break;
      case 'p':
      case 'P':
        onEvent(ACTION_PAUSE);
        break;
      case 'm':
      case 'M':
        onEvent(ACTION_MUTE);
        break;
      case 'n':
      case 'N':
        onEvent(ACTION_NEXT);
        break;
      case 'Escape':
        onEvent(ACTION_PAUSE);
        break;
      default:
        break;
    }
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('keydown', onKeyDown);

  return {
    cursor,
    /** The cursor follows the mouse even without clicking. */
    trackMouse(event) {
      const point = scenePoint(event.clientX, event.clientY);
      if (point !== null) {
        cursor.x = point.x;
        cursor.y = point.y;
        cursor.visible = true;
      }
    },
    destroy() {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    },
  };
}
