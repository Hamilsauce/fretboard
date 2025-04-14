// import { getCoordinates, svgPoint } from '../src/svg-helpers.js';
// import { FretboardModel } from '../src/FretboardModels.js';
// import { StandardTuningStrings } from '../src/init-fretboard-data.js';
import { init } from '../src/fretboard.controller.js';

console.log('MAIN')
const canvasEl = document.querySelector('#canvas');
const surface = document.querySelector('#surface')
const stringLayer = document.querySelector('#string-layer')

const noteMarker = canvasEl.querySelector('.note-marker');
const noteMarkerCircle = noteMarker.querySelector('circle');
const circleBB = noteMarkerCircle.getBoundingClientRect()
const circleRect = noteMarkerCircle.getBBox()
const surfaceRect = surface.getBBox()
const radius = noteMarkerCircle.r.baseVal.value
canvasEl.style.height = getComputedStyle(canvasEl.parentElement).height
// noteMarkerCircle.setAttribute('r', 10)
// noteMarkerCircle.style.r = '0.5'
/*
console.warn('radius', radius)
console.warn('circleBB', circleBB)
console.warn('surfaceRect', surfaceRect)
console.log('noteMarkerCircle!', noteMarkerCircle.getAttribute('height'))
*/
// const fretboardModel = new FretboardModel(StandardTuningStrings)
// console.log(
//   'fretboardModel!',
//   fretboardModel.getStringAt(1).notes.map(({ pitch }) => pitch),
//   fretboardModel.getStringAt(1).getNoteAt(3).pitch

// )

init()

window.addEventListener('resize', (e) => {
  canvasEl.style.height = getComputedStyle(canvasEl.parentElement).height
  
});

// document.addEventListener('dblclick', (e) => {
//   e.stopImmediatePropagation()
//   e.stopPropagation()
//   e.preventDefault()
  
// }, { passive: false });

// stringLayer.addEventListener('click', (e) => {
//   const tile = e.target.closest('.tile');
  
//   if (!tile) return;
  
//   const string = e.target.closest('.string-container');
  
//   const prevActive = [...string.children].find((tile) => tile.dataset.active === 'true')

//   if (prevActive && prevActive !== tile) {
//     prevActive.dataset.active = false;
//   }
  
//   const isActive = tile.dataset.active === 'true' ? true : false;
//   tile.dataset.active = !isActive;
// });