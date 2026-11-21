// Twin Canvas — the scene registry: five original scenes in rising difficulty
// order. A level is one scene; the right panel draws it with every difference
// applied, the left panel draws it pristine.
import { harbour } from './harbour.js';
import { market } from './market.js';
import { temple } from './temple.js';
import { garden } from './garden.js';
import { station } from './station.js';

export const SCENES = [harbour, market, temple, garden, station];

/** The full modification map for a scene: every difference applied at once. */
export function allDifferences(scene) {
  const mods = {};
  for (const diff of scene.differences) mods[diff.id] = true;
  return mods;
}

/** Look a scene up by id; falls back to the first scene. */
export function sceneById(id) {
  return SCENES.find((scene) => scene.id === id) ?? SCENES[0];
}
