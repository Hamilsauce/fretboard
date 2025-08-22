import { getSVGTemplate } from '../src/lib/template-helpers.js';
import { svgPoint } from '../src/lib/svg-helpers.js';
import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';



const app = document.querySelector('#app');
const appBody = app.querySelector('#app-body')
const appButtons = document.querySelectorAll('.app-button')

const svgCanvas = document.querySelector('#canvas');
const scene = svgCanvas.querySelector('#scene');
const surface = svgCanvas.querySelector('#surface');
const header = document.querySelector('#app-header');

const handlePointerDown = (e) => {
  const targ = e.target.closest('[data-object-type=pedal]')
};

const handlePointerMove = (e) => {};
const handlePointerUp = (e) => {};


export const createPedal = (type, options = {}) => {
  const pedal = getSVGTemplate(svgCanvas, 'pedal')
  
  const labelEl = pedal.querySelector('.pedal-float-label');
  const textEl = pedal.querySelector('.pedal-top-text');
  labelEl.textContent = type
  textEl.textContent = '[]'
  pedal.dataset.pedalType = type;
  const scene = svgCanvas.querySelector('#scene');
pedal.setAttribute('transform', 'translate(6,9) rotate(0) scale(1)') 
  scene.appendChild(pedal)
  
  draggable(scene, pedal)
  
  const point = {
    x: 0,
    y: 0
  }
  
  pedal.addEventListener('click', e => {
    // e.stopPropagation()
    // e.stopImmediatePropagation()
    const isSelected = pedal.dataset.selected === 'true' ? true : false
    pedal.dataset.selected = !isSelected
    scene.append(pedal)
  })
  
  pedal.addEventListener('pointerdown', e => {
    const isSelected = pedal.dataset.selected === 'true' ? true : false
    pedal.dataset.selected = true
    scene.append(pedal)
  })
  
  pedal.addEventListener('pointerup', e => {
    const isSelected = pedal.dataset.selected === 'true' ? true : false
    pedal.dataset.selected = false;
  })
  
  
  
  
  // pedal.addEventListener('pointerdown', e => {
  //   // const pt = svgPoint(svgCanvas, pedal, clientX, clientY)
  //   // console.log('pointerdown', pt)
  
  
  //   document.addEventListener('pointerup', e => {
  
  
  //   });
  // });
};

appButtons.forEach((b, i) => {
  b.addEventListener('click', e => {
    const { target } = e
    const type = target.dataset.pedalType
    createPedal(type)
  })
  
  
});


svgCanvas.addEventListener('drag', e => {
  let { x, y, target } = e.detail
  const textEl = target.querySelector('.pedal-top-text');
  
  x = Math.floor(x)
  y = Math.floor(y)
  header.textContent = `[${x}, ${y}]`
  textEl.textContent = `[${x}, ${y}]`
})

svgCanvas.addEventListener('pointerdown', e => {
  const { target } = e;
  
  if (target === surface) {
    scene.querySelectorAll('.pedal').forEach((p) => {
      p.dataset.selected = false
    });
  }
});