// Twin Canvas — the game itself. One state machine over five scenes:
// title -> play -> level-clear -> play ... -> game-complete, with pause and
// time-out branches. Scoring: 100 points a find plus a combo bonus, a time
// bonus on clearing a level, -25 for a wrong click, -50 for a hint.
import {
  BEST_KEY,
  COMBO_STEP_POINTS,
  DIFFERENCES_PER_LEVEL,
  FIND_BASE_POINTS,
  FOUND_RING_MS,
  HINTS_PER_LEVEL,
  HINT_COST_POINTS,
  HINT_FLASH_MS,
  LEVEL_TIME_SECONDS,
  LEVELS,
  TIME_BONUS_PER_SECOND,
  WRONG_CLICK_PENALTY,
  WRONG_FLASH_MS,
} from './config.js';
import { SCENES } from './scenes/index.js';
import { canvasSize, drawGame } from './render.js';
import { ACTION_CLICK, ACTION_HINT, ACTION_MUTE, ACTION_NEXT, ACTION_PAUSE, createInput } from './input.js';
import {
  ensureAudio,
  isMuted,
  playFind,
  playGameComplete,
  playHint,
  playLevelClear,
  playWrong,
  toggleMuted,
} from './audio.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL_CLEAR = 'level-clear';
export const SCREEN_GAME_OVER = 'game-over';
export const SCREEN_TIMEOUT = 'timeout';

/** A fresh per-level state. */
function freshLevelState() {
  return {
    found: new Map(),
    combo: 0,
    bestCombo: 0,
    hintsLeft: HINTS_PER_LEVEL,
    hint: null,
    hintUntilMs: 0,
    wrong: null,
    timeLeftMs: LEVEL_TIME_SECONDS * 1000,
    wrongClicks: 0,
  };
}

export function createGame(canvas, hud) {
  const ctx = canvas.getContext('2d');
  const size = canvasSize();
  canvas.width = size.width;
  canvas.height = size.height;

  let screen = SCREEN_TITLE;
  let levelIndex = 0;
  let level = freshLevelState();
  let score = 0;
  let totalFound = 0;
  let best = readBest();
  let lastFrameMs = performance.now();
  let levelClearBonus = 0;
  let rafId = 0;
  let destroyed = false;

  function scene() {
    return SCENES[levelIndex];
  }

  function remaining() {
    return DIFFERENCES_PER_LEVEL - level.found.size;
  }

  function announce(message) {
    hud.status.textContent = message;
  }

  function formatTime(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  function renderHud() {
    const current = scene();
    hud.levelName.textContent = `Level ${levelIndex + 1} of ${LEVELS} — ${current.name}`;
    hud.levelTag.textContent = current.tagline;
    hud.remaining.textContent = String(remaining());
    hud.foundCount.textContent = String(level.found.size);
    hud.totalCount.textContent = String(DIFFERENCES_PER_LEVEL);
    hud.score.textContent = String(score);
    hud.combo.textContent = level.combo > 1 ? `x${level.combo} combo` : '—';
    hud.timer.textContent = formatTime(level.timeLeftMs);
    hud.timer.classList.toggle('urgent', level.timeLeftMs <= 30000 && screen === SCREEN_PLAY);
    hud.hints.textContent = String(level.hintsLeft);
    hud.best.textContent = String(Math.max(best, score));
    hud.levelDots.textContent = SCENES.map((s, i) => (i < levelIndex ? '●' : i === levelIndex ? '◉' : '○')).join(' ');
    hud.muteButton.textContent = isMuted() ? 'Sound: off (M)' : 'Sound: on (M)';
  }

  function showOverlay(id) {
    for (const overlay of Object.values(hud.overlays)) overlay.classList.remove('visible');
    if (id !== null) hud.overlays[id].classList.add('visible');
  }

  function startLevel(index) {
    levelIndex = index;
    level = freshLevelState();
    screen = SCREEN_PLAY;
    showOverlay(null);
    announce(`Level ${levelIndex + 1}: ${scene().name}. Find ${DIFFERENCES_PER_LEVEL} differences.`);
    renderHud();
  }

  function startGame(fromLevel = 0) {
    ensureAudio();
    score = 0;
    totalFound = 0;
    startLevel(fromLevel);
  }

  function endLevel() {
    levelClearBonus = Math.ceil(level.timeLeftMs / 1000) * TIME_BONUS_PER_SECOND;
    score += levelClearBonus;
    playLevelClear();
    if (levelIndex + 1 >= LEVELS) {
      screen = SCREEN_GAME_OVER;
      if (score > best) {
        best = score;
        saveBest(best);
      }
      playGameComplete();
      hud.finalScore.textContent = String(score);
      hud.finalBest.textContent = String(best);
      hud.finalFound.textContent = String(totalFound);
      showOverlay('complete');
      announce(`Game complete! Final score ${score}. Best ${best}.`);
    } else {
      screen = SCREEN_LEVEL_CLEAR;
      hud.clearBonus.textContent = String(levelClearBonus);
      hud.clearScore.textContent = String(score);
      hud.nextLevelName.textContent = SCENES[levelIndex + 1].name;
      showOverlay('level-clear');
      announce(`Level ${levelIndex + 1} clear! Time bonus ${levelClearBonus}.`);
    }
    renderHud();
  }

  function timeOut() {
    screen = SCREEN_TIMEOUT;
    showOverlay('timeout');
    announce('Out of time. Try the level again.');
    renderHud();
  }

  /** Mark a difference found, or register a wrong click. Returns what happened. */
  function clickAt(point) {
    if (screen !== SCREEN_PLAY) return 'ignored';
    ensureAudio();
    for (const diff of scene().differences) {
      if (level.found.has(diff.id)) continue;
      const dx = point.x - diff.x;
      const dy = point.y - diff.y;
      if (dx * dx + dy * dy <= diff.r * diff.r) {
        level.found.set(diff.id, performance.now());
        level.combo += 1;
        level.bestCombo = Math.max(level.bestCombo, level.combo);
        const gained = FIND_BASE_POINTS + COMBO_STEP_POINTS * (level.combo - 1);
        score += gained;
        totalFound += 1;
        level.hint = null;
        playFind(level.combo);
        announce(`Found: ${diff.label}. ${remaining()} left.`);
        if (remaining() === 0) endLevel();
        renderHud();
        return 'found';
      }
    }
    level.combo = 0;
    level.wrongClicks += 1;
    score = Math.max(0, score - WRONG_CLICK_PENALTY);
    level.wrong = { x: point.x, y: point.y, atMs: performance.now(), durationMs: WRONG_FLASH_MS };
    playWrong();
    announce(`Not a difference. ${remaining()} left.`);
    renderHud();
    return 'wrong';
  }

  function useHint() {
    if (screen !== SCREEN_PLAY) return;
    if (level.hintsLeft <= 0) {
      announce('No hints left on this level.');
      return;
    }
    const unfound = scene().differences.filter((diff) => !level.found.has(diff.id));
    if (unfound.length === 0) return;
    ensureAudio();
    level.hintsLeft -= 1;
    score = Math.max(0, score - HINT_COST_POINTS);
    const picked = unfound[Math.floor(Math.random() * unfound.length)];
    level.hint = picked;
    level.hintUntilMs = performance.now() + HINT_FLASH_MS;
    playHint();
    announce(`Hint: look near the ${picked.label.toLowerCase()}. ${level.hintsLeft} hints left.`);
    renderHud();
  }

  function handleEvent(type, detail) {
    if (type === ACTION_MUTE) {
      toggleMuted();
      renderHud();
      return;
    }
    if (type === ACTION_PAUSE) {
      if (screen === SCREEN_PLAY) {
        screen = SCREEN_PAUSED;
        showOverlay('paused');
        announce('Paused.');
      } else if (screen === SCREEN_PAUSED) {
        screen = SCREEN_PLAY;
        showOverlay(null);
        announce('Playing.');
      }
      renderHud();
      return;
    }
    if (type === ACTION_NEXT) {
      if (screen === SCREEN_LEVEL_CLEAR) startLevel(levelIndex + 1);
      return;
    }
    if (type === ACTION_HINT) {
      useHint();
      return;
    }
    if (type === ACTION_CLICK) {
      clickAt(detail);
    }
  }

  const input = createInput(canvas, handleEvent);
  canvas.addEventListener('pointermove', (event) => input.trackMouse(event));

  hud.startButton.addEventListener('click', () => startGame(0));
  hud.resumeButton.addEventListener('click', () => handleEvent(ACTION_PAUSE));
  hud.nextButton.addEventListener('click', () => handleEvent(ACTION_NEXT));
  hud.retryButton.addEventListener('click', () => startLevel(levelIndex));
  hud.againButton.addEventListener('click', () => startGame(0));
  hud.hintButton.addEventListener('click', () => useHint());
  hud.muteButton.addEventListener('click', () => handleEvent(ACTION_MUTE));
  for (const chip of hud.levelChips) {
    chip.addEventListener('click', () => startGame(Number(chip.dataset.level)));
  }

  function frame(nowMs) {
    if (destroyed) return;
    rafId = requestAnimationFrame(frame);
    const elapsed = Math.min(nowMs - lastFrameMs, 100);
    lastFrameMs = nowMs;
    if (screen === SCREEN_PLAY) {
      level.timeLeftMs -= elapsed;
      if (level.timeLeftMs <= 0) {
        level.timeLeftMs = 0;
        timeOut();
      }
      if (level.hint !== null && nowMs > level.hintUntilMs) level.hint = null;
      if (level.wrong !== null && nowMs - level.wrong.atMs > WRONG_FLASH_MS) level.wrong = null;
    }
    drawGame(ctx, {
      scene: scene(),
      found: level.found,
      hint: screen === SCREEN_PLAY ? level.hint : null,
      wrong: screen === SCREEN_PLAY ? level.wrong : null,
      cursor: input.cursor,
      nowMs,
      dimmed: screen !== SCREEN_PLAY,
    });
    if (screen === SCREEN_PLAY) renderHud();
  }

  function readBest() {
    try {
      return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
    } catch {
      return 0;
    }
  }

  function saveBest(value) {
    try {
      window.localStorage.setItem(BEST_KEY, String(value));
    } catch {
      // Storage can be off: the best score then lasts this visit only.
    }
  }

  renderHud();
  showOverlay('title');
  announce('Twin Canvas. Press Start or click a level to play.');
  rafId = requestAnimationFrame(frame);

  return {
    /** The live state, for the screenshot stager and for tests. */
    get state() {
      return { screen, levelIndex, level, score, totalFound, best, remaining: remaining() };
    },
    startGame,
    startLevel,
    clickAt,
    useHint,
    /** Force a staged state for a screenshot: found ids, time left, score. */
    stage({ levelIndex: index, foundIds, timeLeftMs, score: stagedScore, combo = 0 }) {
      levelIndex = index;
      level = freshLevelState();
      level.timeLeftMs = timeLeftMs;
      level.combo = combo;
      score = stagedScore;
      for (const id of foundIds) level.found.set(id, performance.now() - FOUND_RING_MS - 50);
      screen = SCREEN_PLAY;
      showOverlay(null);
      renderHud();
    },
    /** Jump straight to the game-complete overlay with a staged total. */
    stageComplete(stagedScore, stagedFound) {
      score = stagedScore;
      totalFound = stagedFound;
      best = Math.max(best, stagedScore);
      // Show the last scene fully solved behind the overlay.
      levelIndex = LEVELS - 1;
      level = freshLevelState();
      for (const diff of SCENES[levelIndex].differences) {
        level.found.set(diff.id, performance.now() - FOUND_RING_MS - 50);
      }
      screen = SCREEN_GAME_OVER;
      hud.finalScore.textContent = String(score);
      hud.finalBest.textContent = String(best);
      hud.finalFound.textContent = String(totalFound);
      showOverlay('complete');
      renderHud();
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(rafId);
      input.destroy();
    },
  };
}
