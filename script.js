import { run } from './ScaleGenerator.js';
import { PitchClassSets, NoteData } from './data/index.js';

const standardTuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']

const stringsNoteGenerators = standardTuning
  .map((baseNote, i) => run(baseNote, 'chromatic'));

console.warn('stringsNoteGenerators', JSON.stringify(stringsNoteGenerators[0].next()))

const autoClicker = (el, interval = 750) => {
  const clearIntervalId = setInterval(() => {
    el.dispatchEvent(new Event('click'))
  }, interval)
  
  return clearIntervalId
};

const updateAppContent = (content) => {
  const container = document.querySelector('#app .container')
  container.textContent = content;
};

let noteGen = stringsNoteGenerators[0]

let val = noteGen.next()
let stopClickId = null;
const app = document.querySelector('#app')

app.addEventListener('click', e => {
  val = noteGen.next()
  console.warn('val', val)
  updateAppContent(val.value)
  
  if (!stopClickId) stopClickId = autoClicker(app)
});

app.addEventListener('dblclick', e => {
  clearInterval(stopClickId)
  stopClickId = null;
});