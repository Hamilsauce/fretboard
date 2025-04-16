import { makeCircular, sleep } from './circular-loop-generator.js';
import { audioCtx } from './src/fretboard.controller.js';
const standardTuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']

let canvasEl;
let sceneEl;
let stringEls;
let lowEString;
let highEString;
let autoClickerId;
let noteTileGenerator;
let stringTileGenerators;
let appHeaderLeft = document.querySelector('#app-header-left');
let startButton = document.querySelector('#start-button');
let audioButton = document.querySelector('#audio-button');

const dispatchClick = target => {
  const ev = new PointerEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  target.dispatchEvent(ev);
};

const randoDigi = (range = 5) => Math.floor(Math.random() * range);

const autoClicker = (tileGenerators, interval = 500, clickTimes = 0, ) => {
  let clickCount = 0;
  let delay = 0;
  let el;
  let stringNumber = 5
  let clickLoopLimit = 13
  
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
    
    if (clickCount >= clickLoopLimit) {
      clickCount = 0;
    }
    
    delay = 0;
    // appHeaderLeft.textContent = `Click: ${clickCount}, \n ${el.dataset.pitch}`
    
    stringNumber = stringNumber === 0 ? 5 : stringNumber - 1
  }, interval);
  
  return autoClickerId;
};

const updateAppContent = (content) => {
  const container = document.querySelector('#app .container');
  container.textContent = content;
};

export const setCanvasHeight = (canvas = canvasEl) => {
  const parentHeight = +getComputedStyle(canvas.parentElement).height.replace(/[^0-9.]/g, '');
  const canvasHeight = parentHeight >= 900 ? 900 : parentHeight
  canvas.style.height = `${(parentHeight)}px`
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
  
  setCanvasHeight()
}, 250);



sceneEl.addEventListener('click', (e) => {
  // audioCtx.resume()
});

audioButton.addEventListener('click', (e) => {
  const buttonText = {
    on: 'Audio: On',
    off: 'Audio: Off',
  }
  
  const textContent = audioButton.value;
  
  if (textContent === buttonText.on) {
    audioCtx.suspend()
    audioButton.value = buttonText.off
  } else {
    audioButton.value = buttonText.on
    audioCtx.resume()
  }
});

startButton.addEventListener('click', async (e) => {
  startButton.value = startButton.value == 'Stop' ? 'Start' : 'Stop'
  const runningState = startButton.value
  
  setCanvasHeight();
  
  if (runningState === 'Stop' && !autoClickerId) {
    autoClickerId = autoClicker(stringTileGenerators);
    audioCtx.resume()
  }
  else {
    clearInterval(autoClickerId);
    autoClickerId = null;
    audioCtx.suspend()
  }
});

sceneEl.addEventListener('dblclick', e => {
  clearInterval(autoClickerId);
  autoClickerId = null;
});