import { run } from './ScaleGenerator.js';
import { PitchClassSets, NoteData } from './data/index.js';


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

let noteGen = await run('E', 'major')
let val = noteGen.next()
let stopClickId = null;
const app = document.querySelector('#app')

app.addEventListener('click', e => {
  val = noteGen.next()
  updateAppContent(val.value)
  
  if (!stopClickId) stopClickId = autoClicker(app)
});

app.addEventListener('dblclick', e => {
  clearInterval(stopClickId)
  stopClickId = null;
});