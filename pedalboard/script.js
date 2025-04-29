// import { makeCircular, sleep } from './circular-loop-generator.js';
// import { audioCtx } from './src/fretboard.controller.js';
import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';

const app = document.querySelector('#app');
const canvasEl = document.querySelector('#canvas');
const sceneEl = document.querySelector('#scene');
const distortion = document.querySelector('.distortion-pedal');
console.log(draggable)
const dispatchClick = target => {
  const ev = new PointerEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  target.dispatchEvent(ev);
};

const randoDigi = (range = 5) => Math.floor(Math.random() * range);

export const setCanvasHeight = (canvas = canvasEl) => {
  const parentHeight = +getComputedStyle(canvas.parentElement).height.replace(/[^0-9.]/g, '');
  const canvasHeight = parentHeight >= 900 ? 900 : parentHeight
  canvas.style.height = `${(canvasHeight)}px`
};

setCanvasHeight(canvasEl)
draggable(canvasEl, distortion)

let stopClickId = null;

sceneEl.addEventListener('click', (e) => {
});
