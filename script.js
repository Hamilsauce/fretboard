import { run } from './ScaleGenerator.js';
import { PitchClassSets, NoteData } from './data/index.js';
import { setupStrings } from '/string-view.js'

const standardTuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']

const stringsNoteGenerators = standardTuning
  .map((baseNote, i) => run(baseNote, 'chromatic'));

const autoClicker = (el, interval = 500) => {
  const clearIntervalId = setInterval(() => {
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