import { makeCircular, sleep } from './circular-loop-generator.js';
import {
  getScalePitchClasses,
  targetNotes,
  getActiveNotes,
  activateNotes,
  deactivateAllNotes,
  initThemeTransformer,
  setEachNoteTo,
  toneChordState,
} from './src/fretboard.controller.js';
import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';
import { AppMenu } from './src/components/app-menu.view.js';
import { StandardTuningStrings } from './src/init-fretboard-data.js';
import { MusicalScales, NoteData } from './data/index.js';
import { scheduleOscillator, AudioNote, audioEngine } from './src/audio/index.js';

const standardTuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
const app = document.querySelector('#app');
const canvasEl = document.querySelector('#canvas');
const sceneEl = document.querySelector('#scene');

let stringEls;
let lowEString;
let highEString;
let autoClickerId;
let noteTileGenerator;
let stringTileGenerators;
let appHeaderLeft = app.querySelector('#app-header-left');
let appHeaderCenter = app.querySelector('#app-header-center');
let startButton = app.querySelector('#start-button');
let soundButton = app.querySelector('#audio-button');
let menuOpenButton = app.querySelector('#menu-open');
let keySelect = app.querySelector('#key-select-container');
let keySelectEl = keySelect.querySelector('select');
let toneChordSelect = app.querySelector('#tone-chord-select');

const svgClientBCR = canvasEl.getBoundingClientRect()
const svgClientBB = canvasEl.getBBox()
const svgClientCR = canvasEl.getClientRects()

// console.warn('svgClientBCR,svgClientBB,svgClientCR', svgClientBCR,svgClientBB,svgClientCR)
let chromaticIndex = 0;
const chromatic = NoteData.slice(0, 12);

chromatic.forEach((note, i) => {
  const option = document.createElement('option');
  option.value = note.pitchClass
  option.textContent = note.pitchClass
  
  keySelect.querySelector('#key-select').options.add(option)
});

export const dispatchClick = target => {
  const ev = new PointerEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  target.dispatchEvent(ev);
};

export const randoDigi = (range = 5) => Math.floor(Math.random() * range);

const loopFunction = (fn = () => {}, interval = 500) => {
  const looperId = setInterval(() => {
    fn()
  }, interval);
  
  return () => clearInterval(looperId)
};

toneChordSelect.addEventListener('change', async (e) => {
  const type = toneChordSelect.value
  // const scalePitchClasses = getScalePitchClasses(key, 'major')
  console.log(type)
  
  if (type === 'note') {
    toneChordState.arpeggiate = false;
    toneChordState.playChords = false;
  }
  if (type === 'chord') {
    toneChordState.arpeggiate = false;
    toneChordState.playChords = true;
  }
  if (type === 'arpeggiate') {
    toneChordState.arpeggiate = true;
    toneChordState.playChords = false;
  }
  // if (getActiveNotes()) await deactivateAllNotes()
  
  // await setEachNoteTo(
  //   (tile) => [
  //     scalePitchClasses[0],
  //     scalePitchClasses[2],
  //     scalePitchClasses[4],
  //   ].includes(tile.dataset.pitchClass),
  //   (tile) => {
  //     const tilePC = tile.dataset.pitchClass
  //     const [root, third, fifth] = [
  //       scalePitchClasses[0],
  //       scalePitchClasses[2],
  //       scalePitchClasses[4],
  //     ];
  
  //     if (tilePC === root) tile.dataset.scaleDegree = 'root'
  //     else if (tilePC === third) tile.dataset.scaleDegree = 'third'
  //     else if (tilePC === fifth) tile.dataset.scaleDegree = 'fifth'
  //   },
  // )
  
  // await sleep(12 * 50)
  // activateNotes((note) => scalePitchClasses.includes(note.dataset.pitchClass))
  // targetNotes((note) => note.dataset.pitchClass === key)
});


keySelectEl.addEventListener('change', async (e) => {
  const key = keySelect.querySelector('select').value
  const scalePitchClasses = getScalePitchClasses(key, 'major')
  
  if (getActiveNotes()) await deactivateAllNotes()
  
  await setEachNoteTo(
    (tile) => [
      scalePitchClasses[0],
      scalePitchClasses[2],
      scalePitchClasses[4],
    ].includes(tile.dataset.pitchClass),
    (tile) => {
      const tilePC = tile.dataset.pitchClass
      const [root, third, fifth] = [
        scalePitchClasses[0],
        scalePitchClasses[2],
        scalePitchClasses[4],
      ];
      
      if (tilePC === root) tile.dataset.scaleDegree = 'root'
      else if (tilePC === third) tile.dataset.scaleDegree = 'third'
      else if (tilePC === fifth) tile.dataset.scaleDegree = 'fifth'
    },
  )
  
  await sleep(12 * 50)
  activateNotes((note) => scalePitchClasses.includes(note.dataset.pitchClass))
  targetNotes((note) => note.dataset.pitchClass === key)
});


const appMenu = new AppMenu();
app.appendChild(appMenu.dom);

let stopScaleLooper;

appMenu.on('menu:scale-mode', e => {
  console.warn('e', e)
  const show = keySelect.dataset.show === 'true' ? true : false
  keySelect.dataset.show = !show;
});


let stopThemeTransformer;

appMenu.on('menu:lightshow-mode', async (e) => {
  if (stopThemeTransformer) {
    stopThemeTransformer()
    stopThemeTransformer = null;
  } else stopThemeTransformer = await initThemeTransformer(app)
});

appMenu.on('menu:audio-toggle', async (e) => {
  const audioButton = appMenu.getItemByName('audio-toggle')
  const buttonText = { on: 'Audio: On', off: 'Audio: Off', }
  
  if (audioButton.title.includes('On')) {
    audioEngine.suspend()
    audioButton.title = buttonText.off
  } else {
    audioButton.title = buttonText.on
    audioEngine.resume()
  }
});

appMenu.on('menu:auto-mode', async (e) => {
  const autoButton = appMenu.getItemByName('auto-mode')
  const runningState = autoButton.title.includes('On')
  
  autoButton.title = runningState ? 'Auto: Off' : 'Auto: On'
  
  if (!runningState && !autoClickerId) {
    autoClickerId = autoClicker(stringTileGenerators);
    audioEngine.resume()
  }
  else {
    clearInterval(autoClickerId);
    autoClickerId = null;
    audioEngine.suspend()
  }
});

menuOpenButton.addEventListener('click', e => {
  appMenu.open();
});


appHeaderCenter.addEventListener('click', e => {
  changeKeyOption()
  const show = keySelect.dataset.show === 'true' ? true : false
});

let keyChangeCount = 0

const changeKeyOption = () => {
  chromaticIndex = chromaticIndex >= chromatic.length ? 0 : chromaticIndex + 1;
  keySelect.value = chromatic[chromaticIndex].pitch
  document.querySelector('#app-header-left').textContent = keyChangeCount
  keyChangeCount++
  keySelectEl.dispatchEvent(new Event('change'))
}

const autoClicker = (tileGenerators, interval = 200, clickTimes = 0, ) => {
  let clickCount = 0;
  let delay = 0;
  let el;
  let stringNumber = 5
  let clickLoopLimit = 12
  
  const autoClickerId = setInterval(async () => {
    if (!autoClickerId) return;
    
    const randomStringNumber = stringNumber //randoDigi(5);
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
    }
    delay = 0;
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
  canvas.style.height = `${(canvasHeight)}px`
};

let stopClickId = null;


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
  
  dispatchClick(menuOpenButton)
  
  setTimeout(() => {
    const closer = appMenu.dom.querySelector('#app-menu-close');
    dispatchClick(closer)
  }, 1000)
}, 250);


sceneEl.addEventListener('dblclick', e => {
  clearInterval(autoClickerId);
  autoClickerId = null;
});