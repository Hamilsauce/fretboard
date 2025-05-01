import { makeCircular, sleep } from './circular-loop-generator.js';
import { audioCtx, getScalePitchClasses, targetNotes, activateNotes, deactivateAllNotes } from './src/fretboard.controller.js';
import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';
import { AppMenu } from './src/components/app-menu.view.js';
import { StandardTuningStrings } from '../src/init-fretboard-data.js';
import { MusicalScales, NoteData } from '../data/index.js';

const standardTuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
const app = document.querySelector('#app');
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
let soundButton = document.querySelector('#audio-button');
let menuOpenButton = document.querySelector('#menu-open');
let keySelect = document.querySelector('#key-select-container');

// new HTMLSelectElement().options.add()
const chromatic = NoteData.slice(0, 12)
// console.log('chromatic', chromatic)

chromatic.forEach((note, i) => {
  const option = document.createElement('option');
  option.value = note.pitchClass
  option.textContent = note.pitchClass
  
  keySelect.querySelector('#key-select').options.add(option)
  
});

keySelect.addEventListener('change', e => {
  const key = keySelect.querySelector('select').value
  const scalePitchClasses = getScalePitchClasses(key, 'major')
  
  deactivateAllNotes()
  activateNotes((note) => scalePitchClasses.includes(note.dataset.pitchClass))
  targetNotes((note) => note.dataset.pitchClass === key)
  
});

const appMenu = new AppMenu();

app.appendChild(appMenu.dom)

appMenu.on('menu:scale-mode', e => {
  const show = keySelect.dataset.show === 'true' ? true : false
  keySelect.dataset.show = true //!show
  
  appMenu.open();
  
  console.log('duck')
});

appMenu.on('*',
  e => {
    console.log('HEAR IT ALL')
  });

menuOpenButton.addEventListener('click', e => {
  appMenu.open();
});


const isSequencerOn = () => startButton.value.includes('On')
const isSoundOn = () => soundButton.value.includes('On')

const dispatchClick = target => {
  const ev = new PointerEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  target.dispatchEvent(ev);
};

const randoDigi = (range = 5) => Math.floor(Math.random() * range);

const autoClicker = (tileGenerators, interval = 200, clickTimes = 0, ) => {
  let clickCount = 0;
  let delay = 0;
  let el;
  let stringNumber = 5
  let clickLoopLimit = 12
  
  const autoClickerId = setInterval(async () => {
    if (!autoClickerId) return;
    
    const randomStringNumber = stringNumber //randoDigi(5);
    console.warn('stringNumber', stringNumber)
    const result = tileGenerators[randomStringNumber]
      .next() //clickCount);
    
    if (delay) {
      await sleep(delay);
      delay = null;
    }
    
    el = result.value ?? null;
    const tempCount = clickCount
    if (el && !clickTimes || tempCount < clickTimes) {
      dispatchClick(el);
      clickCount++;
    }
    
    else if (tempCount >= clickTimes) {
      dispatchClick(el);
      
      clickCount = 0;
      clearInterval(autoClickerId);
    }
    
    if (tempCount >= clickLoopLimit) {
      clickCount = 0;
      stringNumber = stringNumber === 0 ? 5 : stringNumber - 1
      
      // stringNumber = stringNumber <= 5 ? 0 : stringNumber - 1
      
    }
    
    delay = 0;
    // appHeaderLeft.textContent = `Click: ${clickCount}, \n ${el.dataset.pitch}`
    
  }, interval);
  
  return autoClickerId;
};

const updateAppContent = (content) => {
  const container = document.querySelector('#app .container');
  container.textContent = content;
};

export const setCanvasHeight = (canvas = canvasEl) => {
  const parentHeight = +getComputedStyle(canvas.parentElement).height.replace(/[^0-9.]/g, '');
  console.warn('parentHeight', parentHeight)
  const canvasHeight = parentHeight >= 900 ? 900 : parentHeight
  canvas.style.height = `${(canvasHeight)}px`
};

let stopClickId = null;

canvasEl = document.querySelector('#canvas');
sceneEl = document.querySelector('#scene');


setTimeout(() => {
  stringEls = sceneEl.querySelectorAll('.string-container');
  lowEString = sceneEl.querySelector('[data-base-note="E2"]');
  highEString = sceneEl.querySelector('[data-base-note="E4"]');
  
  // draggable(canvasEl, [...stringEls][0])
  
  stringTileGenerators = [
    makeCircular([...sceneEl.querySelector('[data-base-note="E2"]').children]),
    makeCircular([...sceneEl.querySelector('[data-base-note="A2"]').children]),
    makeCircular([...sceneEl.querySelector('[data-base-note="D3"]').children]),
    makeCircular([...sceneEl.querySelector('[data-base-note="G3"]').children]),
    makeCircular([...sceneEl.querySelector('[data-base-note="B3"]').children]),
    makeCircular([...sceneEl.querySelector('[data-base-note="E4"]').children]),
  ];
  
  // setCanvasHeight()
}, 250);



sceneEl.addEventListener('click', (e) => {
  if (!isSequencerOn() && isSoundOn()) {
    audioCtx.resume()
  }
});

soundButton.addEventListener('click', (e) => {
  const buttonText = {
    on: 'Sound: On',
    off: 'Sound: Off',
  }
  
  const textContent = soundButton.value;
  
  if (isSoundOn()) {
    audioCtx.suspend()
    soundButton.value = buttonText.off
  } else {
    soundButton.value = buttonText.on
    audioCtx.resume()
  }
});

startButton.addEventListener('click', async (e) => {
  const runningState = isSequencerOn()
  startButton.value = runningState ? 'Auto: Off' : 'Auto: On'
  
  // setCanvasHeight();
  
  if (!runningState && !autoClickerId && isSoundOn()) {
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