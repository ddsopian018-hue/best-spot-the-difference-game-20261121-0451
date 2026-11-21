// Twin Canvas — boot. Wires the DOM HUD to the game, starts the loop, and
// stages a screenshot scene when ?shot=<name> is present.
import { createGame } from './game.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const status = document.getElementById('status');

/** Collect every HUD element the game reads or writes, by id. */
function collectHud() {
  const byId = (id) => document.getElementById(id);
  return {
    status,
    levelName: byId('level-name'),
    levelTag: byId('level-tag'),
    remaining: byId('remaining'),
    foundCount: byId('found-count'),
    totalCount: byId('total-count'),
    score: byId('score'),
    combo: byId('combo'),
    timer: byId('timer'),
    hints: byId('hints-left'),
    best: byId('best'),
    levelDots: byId('level-dots'),
    muteButton: byId('mute-button'),
    startButton: byId('start-button'),
    resumeButton: byId('resume-button'),
    nextButton: byId('next-button'),
    retryButton: byId('retry-button'),
    againButton: byId('again-button'),
    hintButton: byId('hint-button'),
    clearBonus: byId('clear-bonus'),
    clearScore: byId('clear-score'),
    nextLevelName: byId('next-level-name'),
    finalScore: byId('final-score'),
    finalBest: byId('final-best'),
    finalFound: byId('final-found'),
    levelChips: [...document.querySelectorAll('.level-chip')],
    overlays: {
      title: byId('overlay-title'),
      paused: byId('overlay-paused'),
      'level-clear': byId('overlay-level-clear'),
      timeout: byId('overlay-timeout'),
      complete: byId('overlay-complete'),
    },
  };
}

const game = createGame(canvas, collectHud());
// Exposed for the screenshot stager and for play-testing in the console.
window.__twin = game;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot !== null) {
  stageShot(shot, game, () => {
    window.__shotReady = true;
  });
}
