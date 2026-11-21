// Twin Canvas — screenshot scenes behind ?shot=<name>. Each one stages the
// real game (the same startLevel/click paths a player uses, driven through
// the game's own stage helpers) and paints twice, then sets
// window.__shotReady so the screenshot script knows the frame is settled.
// The cover shows level 1 mid-hunt: 3 differences ringed, 4 still to find.
import { createGame } from './game.js';

/** The staged scene for each shot name. */
const SHOTS = {
  cover: {
    levelIndex: 0,
    foundIds: ['sun', 'sail', 'buoy'],
    timeLeftMs: 137000,
    score: 350,
    combo: 3,
  },
  market: {
    levelIndex: 1,
    foundIds: ['moon', 'lantern'],
    timeLeftMs: 98000,
    score: 620,
    combo: 2,
  },
  temple: {
    levelIndex: 2,
    foundIds: ['torch', 'gem', 'vine', 'flower', 'bird'],
    timeLeftMs: 41000,
    score: 1180,
    combo: 5,
  },
};

/**
 * Stage the named shot on a live game and call `done` once painted twice.
 * `complete` stages the game-complete overlay instead of a level.
 */
export function stageShot(name, game, done) {
  if (name === 'complete') {
    game.stageComplete(2840, 35);
  } else {
    const shot = SHOTS[name] ?? SHOTS.cover;
    game.stage(shot);
  }
  let painted = 0;
  function paint() {
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else done();
  }
  requestAnimationFrame(paint);
}

export { createGame };
