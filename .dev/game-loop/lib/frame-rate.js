const state = {
  count: 0,
  lastTimestamp: 0,
  elapsed: 0,
  deltaMs: 0,
  get fps() { return Math.round((1 / (this.deltaMs / 1000))); },
}

export const frameRate = (delta) => {
  state.deltaMs = delta === 0 ? state.deltaMs : delta;

  return state.fps;
};