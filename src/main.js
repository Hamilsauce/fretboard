import { getCoordinates, svgPoint } from '../src/svg-helpers.js';

const canvasEl = document.querySelector('#canvas');
const surface = document.querySelector('#surface');
const noteMarker = canvasEl.querySelector('.note-marker');
const noteMarkerCircle = noteMarker.querySelector('circle');
const circleBB = noteMarkerCircle.getBoundingClientRect()
const circleRect = noteMarkerCircle.getBBox()
const surfaceRect = surface.getBBox()
const radius = noteMarkerCircle.r.baseVal.value
// noteMarkerCircle.setAttribute('r', 10)
// noteMarkerCircle.style.r = '0.5'
console.warn('radius', radius)
console.warn('circleBB', circleBB)
console.warn('surfaceRect', surfaceRect)
console.log('noteMarkerCircle!', noteMarkerCircle.getAttribute('height'))




canvasEl.addEventListener('click', (e) => {
  // if (isMoving) return;
  const coords = getCoordinates(e)
  
  console.log('coords!', coords)
  const tile = e.target.closest('.tile');
  if (!tile) return;
  
  const isActive = tile.dataset.active === 'true' ? true : false;
  tile.dataset.active = !isActive;
});