// import { getCoordinates, svgPoint } from '../src/svg-helpers.js';
// import { FretboardModel } from '../src/FretboardModels.js';
import { setCanvasHeight } from '../script.js';
import { svgUnitsToPixels } from '../src/lib/svg-units-to-pixels.js'
import { init } from '../src/fretboard.controller.js';

const canvasEl = document.querySelector('#canvas');
const scene = document.querySelector('#scene')
const surface = document.querySelector('#surface')
const stringLayer = document.querySelector('#string-layer')

const noteMarker = canvasEl.querySelector('.note-marker');
const noteMarkerCircle = noteMarker.querySelector('circle');
const circleBB = noteMarkerCircle.getBoundingClientRect()
const circleRect = noteMarkerCircle.getBBox()
const surfaceRect = surface.getBBox()
const sceneRect = scene.getBBox()
const sceneWidth = getComputedStyle(scene).width

const radius = noteMarkerCircle.r.baseVal.value

setCanvasHeight(canvasEl)

const sceneWidthPixels = svgUnitsToPixels(canvas, scene)

canvasEl.style.width = sceneWidthPixels + 'px'

init()

window.addEventListener('resize', (e) => {
  setCanvasHeight(canvasEl);
});
