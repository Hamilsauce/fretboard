import { makeCircular, sleep } from './circular-loop-generator.js';

const standardTuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']

let canvasEl;
let sceneEl;
let stringEls;
let lowEString;
let highEString;
let autoClickerId;
let noteTileGenerator;
let stringTileGenerators;

const dispatchClick = target => {
  const ev = new PointerEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  target.dispatchEvent(ev);
};

const randoDigi = (range = 5) => Math.floor(Math.random() * range);

const autoClicker = (tileGenerators, interval = 500, clickTimes = 0) => {
  let clickCount = 0;
  let delay = 0;
  let el;
  
  const autoClickerId = setInterval(async () => {
    if (!autoClickerId) return;
    
    const randomStringNumber = randoDigi(5);

    const result = tileGenerators[randomStringNumber].next(clickCount);

    if (delay) {
      await sleep(delay);
      
      delay = null;
    }
    
    el = result.value ?? null;
    
    if (el && !clickTimes || clickCount < clickTimes) {
      dispatchClick(el);
      clickCount++;
    }
    
    else if (clickCount >= clickTimes) {
      dispatchClick(el);
      
      clickCount = 0;
      clearInterval(autoClickerId);
    }
    
    delay = randoDigi(4) * 1000;
  }, interval);
  
  return autoClickerId;
};

const updateAppContent = (content) => {
  const container = document.querySelector('#app .container');
  container.textContent = content;
};

let stopClickId = null;

const app = document.querySelector('#app');
canvasEl = document.querySelector('#canvas');
sceneEl = document.querySelector('#scene');

setTimeout(() => {
  stringEls = sceneEl.querySelectorAll('.string-container');
  lowEString = sceneEl.querySelector('[data-base-note="E2"]');
  highEString = sceneEl.querySelector('[data-base-note="E4"]');
  
  stringTileGenerators = [
    makeCircular([...sceneEl.querySelector('[data-base-note="E2"]').children]),
    makeCircular([...sceneEl.querySelector('[data-base-note="A2"]').children]),
    makeCircular([...sceneEl.querySelector('[data-base-note="D3"]').children]),
    makeCircular([...sceneEl.querySelector('[data-base-note="G3"]').children]),
    makeCircular([...sceneEl.querySelector('[data-base-note="B3"]').children]),
    makeCircular([...sceneEl.querySelector('[data-base-note="E4"]').children]),
  ];
}, 250);



sceneEl.addEventListener('click', async (e) => {
  if (!autoClickerId) autoClickerId = autoClicker(stringTileGenerators);
});

sceneEl.addEventListener('dblclick', e => {
  clearInterval(autoClickerId);
  autoClickerId = null;
});