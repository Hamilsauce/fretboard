import { run } from './ScaleGenerator.js';
import { PitchClassSets, NoteData } from './data/index.js';
import { setupStrings } from '/string-view.js'

const standardTuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']

const stuningMap = new Map(
  standardTuning.map((note, i) => [note, note])
);

const stringsNoteGenerators = standardTuning.map((baseNote, i) => run(baseNote, 'chromatic'));
// console.warn('stringsNoteGenerators', stringsNoteGenerators)

const emptyMatrix = new Array(6)
  .fill([])
  .map((noteArray, i) => new Array(13)
    .fill(null)
    .map(() => stringsNoteGenerators[i].next().value)
  );

// const printedMatrix = emptyMatrix.reduceRight((acc, stringArr, i) => {
//     const stringString = stringArr
//       .reduce((acc, note, k) => acc.concat(`\n${i} ${k}`), '')
//     return [...acc, stringString] //.concat(stringString)
//   }, []);

// console.warn('printedMatrix', printedMatrix)



setTimeout(() => {
  
  console.log(' ', );
}, 1000)



const autoClicker = (el, interval = 500) => {
  const mapIterator = stuningMap.entries()
  let itValue
  
  const clearIntervalId = setInterval(() => {
    const { value, done } = mapIterator.next()
    
    if (!done) {
      const [key, val] = value;
    }
    
    el.dispatchEvent(new Event('click'))
  }, interval)
  
  return clearIntervalId
};

const updateAppContent = (content) => {
  const container = document.querySelector('#app .container')
  container.textContent = content;
};

let stopClickId = null;

const app = document.querySelector('#app')
const stringGens = setupStrings()

app.addEventListener('click', e => {
  stringGens.reduce(async (acc, updateStringNote, i) => {
    
    const res = (await acc)
    
    return updateStringNote()
  }, async () => null);
  
  if (!stopClickId) stopClickId = autoClicker(app)
});

app.addEventListener('dblclick', e => {
  clearInterval(stopClickId)
  stopClickId = null;
});