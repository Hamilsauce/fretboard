// import { getCoordinates, svgPoint } from '../src/svg-helpers.js';
// import { FretboardModel } from '../src/FretboardModels.js';
import { setCanvasHeight } from '../script.js';
import { svgUnitsToPixels } from '../src/lib/svg-units-to-pixels.js'
import { init, getScalePitchClasses } from '../src/fretboard.controller.js';
// import { scheduleOscillator } from '../src/audio/oscillator-scheduler.js';
import { TransformList } from '../src/features/graphic/TransformList.js';
import { getRouter } from '../src/router/router.js';

const appbody = document.getElementById('app-body');

const router = getRouter('#app-body');

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


const trans = canvasEl.createSVGTransform()
// const tlist = new TransformList(scene)
// console.warn('trans', tlist)

screen.orientation.addEventListener("change", (event) => {
  console.warn('orientation event', event)
  setCanvasHeight(canvasEl);
  scene.style.width = sceneWidthPixels + 'px'
});


window.addEventListener('resize', (e) => {
  setCanvasHeight(canvasEl);
  canvasEl.style.width = sceneWidthPixels + 'px'
  surface.style.width = sceneWidthPixels + 'px'
});