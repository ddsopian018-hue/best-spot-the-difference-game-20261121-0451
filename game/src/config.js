// Twin Canvas — spot the difference. Shared constants for the whole game.
// Every number here is a design decision, not a magic value: the panels are
// 600x460 scene units, the HUD lives in the DOM above them.
export const PANEL_WIDTH = 600;
export const PANEL_HEIGHT = 460;
export const DIFFERENCES_PER_LEVEL = 7;
export const LEVELS = 5;
export const LEVEL_TIME_SECONDS = 150;
export const HINTS_PER_LEVEL = 3;
export const BEST_KEY = 'twin-canvas-best-score';
export const FIND_BASE_POINTS = 100;
export const COMBO_STEP_POINTS = 25;
export const WRONG_CLICK_PENALTY = 25;
export const HINT_COST_POINTS = 50;
export const TIME_BONUS_PER_SECOND = 5;
export const HINT_FLASH_MS = 2200;
export const WRONG_FLASH_MS = 500;
export const FOUND_RING_MS = 900;
