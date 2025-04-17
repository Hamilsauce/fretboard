import { StandardTuningStrings } from '../src/init-fretboard-data.js';
import { FretboardModel } from '../src/FretboardModels.js';
import { getSVGTemplate } from '../src/lib/template-helpers.js'
import { getCoordinates, svgPoint } from '../src/lib/svg-helpers.js'

const fretboardModel = new FretboardModel(StandardTuningStrings);

const svgCanvas = document.querySelector('#canvas');
const stringLayer = svgCanvas.querySelector('#string-layer')
const appHeaderRight = document.querySelector('#app-header-right')

const stringContainers = [...svgCanvas.querySelectorAll('.string-container')];

export const audioCtx = new AudioContext()

const updateHeader = (value) => {
  appHeaderRight.textContent = value
};


function playPulse(pulseHz = 440) {
  let time = audioCtx.currentTime
  
  const osc = new OscillatorNode(audioCtx, {
    type: "sine",
    frequency: 20,
  });
  
  osc.frequency.exponentialRampToValueAtTime(pulseHz, time + 0.15)
  
  const amp = new GainNode(audioCtx, { value: 0.0 });
  
  const lfo = new OscillatorNode(audioCtx, {
    type: "square",
    frequency: 1,
  });
  
  // lfo.connect(amp.gain);
  amp.gain.exponentialRampToValueAtTime(0.3, time + 1)
  osc.connect(amp).connect(audioCtx.destination);
  
  // lfo.start();
  osc.start();
  
  return (pulseTime = 1) => {
    time = audioCtx.currentTime
    
    // osc.frequency.cancelAndHoldAtTime(time)
    osc.frequency.exponentialRampToValueAtTime(1, time)
    amp.gain.exponentialRampToValueAtTime(0.1, time + 1)
    // amp.gain.cancelScheduledValues(time+1)
    // osc.frequency.cancelScheduledValues(time)
    
    
    osc.stop(time + 1)
  }
}

const stringOscillators = new Array(6).fill(null)

export const init = () => {
  stringContainers.forEach((stringEl, x) => {
    const baseNote = stringEl.dataset.baseNote
    
    const stringModel = fretboardModel.getStringByBase(baseNote)
    
    stringModel.notes.forEach((note, y) => {
      const template = getSVGTemplate(svgCanvas, 'tile')
      
      template.setAttribute('transform', `translate(0,${y})`);
      template.dataset.active = false
      template.dataset.fret = y
      template.dataset.pitch = note.pitch
      template.dataset.pitchClass = note.pitchClass
      template.dataset.frequency = note.frequency
      
      const textEl = template.querySelector('text')
      const noteText = note.pitch.split('\/')[0]
      textEl.textContent = noteText //note.pitch
      stringEl.appendChild(template)
    });
  });
}

stringLayer.addEventListener('click', (e = new MouseEvent()) => {
  const tile = e.target.closest('.tile');
  const coords = getCoordinates(e)
  
  if (!tile) return;
  // tile.dataset.active = false
  // tile.dataset.isTarget = false
  
  const string = e.target.closest('.string-container');
  
  
  const targetPitch = tile.dataset.pitch
  const targetPitchClass = tile.dataset.pitchClass
  
  const stringNumber = +string.dataset.stringNumber - 1
  
  const prevActive = [...string.children].find((tile) => tile.dataset.active === 'true')
  
  const osc = stringOscillators[stringNumber];
  
  const isActive = tile.dataset.active === 'true' ? true : false;
  
  stringContainers.forEach((el, i) => {
    const osc = stringOscillators[i];
    if (osc) {
      osc();
      // setTimeout(() => {
      //   // stringpOscillators[stringNumber] = null
      //   console.log(' ', );
      // }, 10000)
    }
    
    [...el.children].forEach((child, i) => {
      child.dataset.isTarget = false
      child.dataset.active = false;
      
      if (
        child.dataset.pitchClass === targetPitchClass
        // &&
        // child !== prevActive
      ) {
        child.dataset.active = !isActive;
      }
      else {
        child.dataset.active = false;
      }
      
      // tile.dataset.isTarget = true
    });
  });
  
  const baseNote = string.dataset.baseNote
  
  const stringModel = fretboardModel.getStringByBase(baseNote)
  const note = stringModel.getNoteByPitch(tile.dataset.pitch)
  
  if (tile !== prevActive) {
    stringOscillators[stringNumber] = playPulse(note.frequency)
    tile.dataset.active = true
    tile.dataset.isTarget = true
  } else {
    tile.dataset.active = false
    tile.dataset.isTarget = false
    
  }
});