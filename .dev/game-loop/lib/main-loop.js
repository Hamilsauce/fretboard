const updates = new Set();
let rafId = null;
let lastTime = 0;
let fps = 0;
let frameTimes = [];
let smoothingWindowSize = 30

const registerUpdates = (...fns) => {
  fns.forEach(fn => updates.add(fn));
};

const doUpdates = (dt) => {
  updates.forEach(fn => fn(dt));
};

const calculateFPS = (delta = 0) => {
  frameTimes.push(delta);
  if (frameTimes.length > smoothingWindowSize) frameTimes.shift(); // keep last 30 frames
  
  const avgDelta = frameTimes.reduce((a, b) => a + b) / frameTimes.length;
  
  // const framesPS = Math.round(1 / avgDelta);
  fps = Math.round(1 / avgDelta);
  
  return fps
};

const main = (timestamp) => {
  rafId = requestAnimationFrame(main);
  
  const delta = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  
  // frameTimes.push(delta);
  // if (frameTimes.length > 30) frameTimes.shift(); // keep last 30 frames
  
  // const avgDelta = frameTimes.reduce((a, b) => a + b) / frameTimes.length;
  // fps = Math.round(1 / avgDelta);
  calculateFPS(delta)
  // displayFPS(fps);
  
  doUpdates(delta);
};

// const main = (timestamp) => {
//   rafId = requestAnimationFrame(main);
//   const delta = (timestamp - lastTime) / 1000; // seconds
//   lastTime = timestamp;
//   doUpdates(delta);
// };

const start = () => {
  lastTime = performance.now();
  rafId = requestAnimationFrame(main);
};

const stop = () => {
  cancelAnimationFrame(rafId);
};

export const mainLoop = {
  start,
  stop,
  registerUpdates,
  get fps() { return fps },
};