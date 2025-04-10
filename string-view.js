import { run } from './ScaleGenerator.js';

const standardTuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
let stringEls
const fret1 = document.querySelector('#string');

export const setupStrings = (tuning = standardTuning) => {
  stringEls = [...document.querySelectorAll('.string')];
  
  const stringsNoteGenerators = stringEls.map((el, i) => {
    const baseNote = el.dataset.baseNote;
    const generator = run(baseNote, 'chromatic')
    
    return async () => {
      let result
      const { value, done } = await generator.next()
      
      if (value && value.pitch === baseNote) {
        el.classList.add('base-note')
      } else if (
        value &&
        value.pitch !== baseNote &&
        el.classList.contains('base-note')
      ) {
        el.classList.remove('base-note')
      }
      
      el.textContent = (value.pitch || '').split('/')[0]
    }
  });
  
  return stringsNoteGenerators
}


  
