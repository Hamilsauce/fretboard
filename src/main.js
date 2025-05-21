// import { getCoordinates, svgPoint } from '../src/svg-helpers.js';
// import { FretboardModel } from '../src/FretboardModels.js';
import { setCanvasHeight } from '../script.js';
import { svgUnitsToPixels } from '../src/lib/svg-units-to-pixels.js'
import { init, getScalePitchClasses } from '../src/fretboard.controller.js';
// import { scheduleOscillator } from '../src/audio/oscillator-scheduler.js';

import { Router } from '../src/router/router.js';
import { routes } from '../src/router/routes.js';

const appbody = document.getElementById('app-body');
const router = new Router(routes, appbody);

document.addEventListener('click', e => {
  const link = e.target.closest('[data-link]');
  if (link) {
    e.preventDefault();
    router.navigate(link.getAttribute('href'));
  }
});

const canvasEl = document.querySelector('#canvas');
const scene = document.querySelector('#scene')
const surface = document.querySelector('#surface')
const sceneWidth = getComputedStyle(scene).width

const sceneWidthPixels = svgUnitsToPixels(canvas, scene)
const widthString = `${(sceneWidthPixels)}px`
canvasEl.style.width = widthString;

init();

window.addEventListener('resize', (e) => {
  setCanvasHeight(canvasEl);
  canvasEl.style.width = sceneWidthPixels + 'px'
});