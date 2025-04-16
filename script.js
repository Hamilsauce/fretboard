import { makeCircular, sleep } from './circular-loop-generator.js';
// import { run } from './ScaleGenerator.js';
// import { PitchClassSets, NoteData } from './data/index.js';
// import { setupStrings } from '/string-view.js'

const standardTuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']

// const stuningMap = new Map(
//   standardTuning.map((note, i) => [note, note])
// );

// const stringsNoteGenerators = standardTuning.map((baseNote, i) => run(baseNote, 'chromatic'));
// console.warn('stringsNoteGenerators', stringsNoteGenerators)

// const stringList = new Array(6)
//   .fill([])
//   .map((noteArray, i) => new Array(13)
//     .fill(null)
//     .map(() => stringsNoteGenerators[i].next().value)
//   );

// const printedMatrix = emptyMatrix.reduceRight((acc, stringArr, i) => {
//     const stringString = stringArr
//       .reduce((acc, note, k) => acc.concat(`\n${i} ${k}`), '')
//     return [...acc, stringString] //.concat(stringString)
//   }, []);

// console.warn('printedMatrix', printedMatrix)

let canvasEl
let sceneEl
let stringEls
let lowEString
let highEString
let autoClickerId
let noteTileGenerator
let stringTileGenerators


const dispatchClick = target => {
  const ev = new PointerEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  target.dispatchEvent(ev);
};

const dispatchDblClick = target => {
  const ev = new PointerEvent('dblclick', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  target.dispatchEvent(ev);
};

const randoDigi = (range = 5) => Math.floor(Math.random() * range);

const autoClicker = (tileGenerators, interval = 500, clickTimes = 0) => {
  
  let clickCount = 0
  let delay = 0
  let el
  
  const clearIntervalId = setInterval(async () => {
    if (!autoClickerId) return
    
    const randomStringNumber = randoDigi(5)
    
    console.warn('randomStringNumber, clickCount', randomStringNumber, clickCount)
    if (delay) {
      await sleep(delay)
      delay = null
    }
    const result = tileGenerators[randomStringNumber]
      .next(clickCount)
    
    el = result.value ?? null
    
    if (el && !clickTimes || clickCount < clickTimes) {
      dispatchClick(el)
      clickCount++
    }
    
    else if (clickCount >= clickTimes) {
      dispatchClick(el)
      
      clickCount = 0
      clearInterval(clearIntervalId)
    }
    delay = randoDigi(4) * 1000
  }, interval)
  
  return clearIntervalId
};

const updateAppContent = (content) => {
  const container = document.querySelector('#app .container')
  container.textContent = content;
};

let stopClickId = null;

const app = document.querySelector('#app')
// const stringGens = setupStrings()

// const lowEStringGen = stringGens[0]

setTimeout(() => {
  canvasEl = document.querySelector('#canvas');
  sceneEl = document.querySelector('#scene');
  stringEls = sceneEl.querySelectorAll('.string-container');
  lowEString = sceneEl.querySelector('[data-base-note="E2"]');
  highEString = sceneEl.querySelector('[data-base-note="E4"]');
  // console.warn('lowEString', lowEString)

  stringTileGenerators = [
    makeCircular([...sceneEl.querySelector('[data-base-note="E2"]').children]),
    makeCircular([...sceneEl.querySelector('[data-base-note="A2"]').children]),
    makeCircular([...sceneEl.querySelector('[data-base-note="D3"]').children]),
    makeCircular([...sceneEl.querySelector('[data-base-note="G3"]').children]),
    makeCircular([...sceneEl.querySelector('[data-base-note="B3"]').children]),
    makeCircular([...sceneEl.querySelector('[data-base-note="E4"]').children]),
  ]
  
  
  autoClickerId = autoClicker(stringTileGenerators, 400)
  // console.warn('canvasEl', canvasEl)
}, 250)



app.addEventListener('click', async (e) => {
  
  // stringGens.reduce(async (acc, updateStringNote, i) => {
  
  // const res = lowEStringGen()
  // const result =  lowEStringGen()
  // console.warn('result', result)
  // const { value, done } = await result
  // console.warn('value', value)
  
  //   return updateStringNote()
  // }, async () => null);
  
  if (!autoClickerId) autoClickerId = autoClicker(noteTileGenerator)
});

app.addEventListener('dblclick', e => {
  clearInterval(autoClickerId)
  autoClickerId = null;
});