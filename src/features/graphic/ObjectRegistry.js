import {
  CircleObject,
  LineObject,
  RectObject,
  TriangleObject,
} from '../../../graphics-objects/geometry/index.js';
import { Hud } from '../../../graphics-objects/index.js';

const ObjectMap = new Map([
  ['circle', CircleObject],
  ['line', LineObject],
  ['rect', RectObject],
  ['triangle', TriangleObject],
  ['hud', Hud],
]);

export const ObjectRegistry = {
  get keys() { return [...ObjectMap.keys()] },
  get values() { return [...ObjectMap.values()] },
  get size() { return ObjectMap.size },
  has(key) { return ObjectMap.has(key) },
  get(key) { return ObjectMap.get(key) },
  set(key, value) { return ObjectMap.set(key, value) },
}