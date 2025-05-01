import { getSVGTemplate } from '../src/lib/template-helpers.js';
import { svgPoint } from '../src/lib/svg-helpers.js';
import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';


const svgCanvas = document.querySelector('#canvas');
const header = document.querySelector('#app-header');

const handlePointerDown = (e) => {
  const targ = e.target.closest('[data-object-type=pedal]')
  
  
};
const handlePointerMove = (e) => {};
const handlePointerUp = (e) => {};

const butt = document
butt.querySelector('#canvas').style.touchAction = 'none';
console.warn('butt', document)
export const createPedal = (type, options = {}) => {
  const pedal = getSVGTemplate(svgCanvas, 'pedal')
  pedal.dataset.pedalType = type;
  const scene = svgCanvas.querySelector('#scene');
  scene.appendChild(pedal)
  
  draggable(scene, pedal)
  
  const point = {
    x: 0,
    y: 0
  }
  
  pedal.addEventListener('click', e => {
    const isSelected = pedal.dataset.selected === 'true' ? true : false
    pedal.dataset.selected = !isSelected
  })
  
  pedal.addEventListener('pointerdown', e => {
    const pevs = e.getPredictedEvents()
    
    console.log('pevs', pevs)
    console.warn({
      height: e.height,
      width: e.width,
      pressure: e.pressure,
    })
  })
  
  svgCanvas.addEventListener('drag', e => {
    const { x, y } = e.detail
    const pt = point
    pt.x = Math.floor(x)
    pt.y = Math.floor(y)
    header.textContent = `(${pt.x}, ${pt.y})`
  })
  
  
  
  // pedal.addEventListener('pointerdown', e => {
  //   // const pt = svgPoint(svgCanvas, pedal, clientX, clientY)
  //   // console.log('pointerdown', pt)
  
  
  //   document.addEventListener('pointerup', e => {
  
  
  //   });
  // });
};