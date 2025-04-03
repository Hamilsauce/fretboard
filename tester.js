import noteResponse from './data/note-data-fetch.js';
import { run } from './ScaleGeneraror.js';

let noteGen = await run(noteResponse.notes)
let val = noteGen.next()
const app = document.querySelector('#app')
// const app = document.querySelector('#app')

const autoClicker = (
  el = document.querySelector('#app'),
  interval = 750
) => {
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

app.addEventListener('click', e => {
  val = noteGen.next()
  updateAppContent(val.value)
  
  if (!stopClickId) {
    stopClickId = autoClicker(app)
  }
});

app.addEventListener('dblclick', e => {
  clearInterval(stopClickId)
  stopClickId = null;
  
});