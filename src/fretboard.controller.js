import { StandardTuningStrings } from '../src/init-fretboard-data.js';
import { FretboardModel } from '../src/FretboardModels.js';
import { getSVGTemplate } from '../src/lib/template-helpers.js'
import { getCoordinates, svgPoint } from '../src/lib/svg-helpers.js'

const fretboardModel = new FretboardModel(StandardTuningStrings);

const svgCanvas = document.querySelector('#canvas');
const stringLayer = svgCanvas.querySelector('#string-layer')
const appHeaderRight = document.querySelector('#app-header-right')

const stringContainers = [...svgCanvas.querySelectorAll('.string-container')];

const audioCtx = new AudioContext()

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
  
  const amp = new GainNode(audioCtx, { value: 0.01 });
  
  const lfo = new OscillatorNode(audioCtx, {
    type: "square",
    frequency: 1,
  });
  
  // lfo.connect(amp.gain);
  amp.gain.exponentialRampToValueAtTime(0.5, time + 1)
  osc.connect(amp).connect(audioCtx.destination);
  
  // lfo.start();
  osc.start();
  
  return (pulseTime = 1) => {
    time = audioCtx.currentTime
    
    osc.frequency.cancelAndHoldAtTime(time + 0.1)
    osc.frequency.exponentialRampToValueAtTime(1, time + 0.3)
    amp.gain.cancelAndHoldAtTime(time + 0.9)
    amp.gain.exponentialRampToValueAtTime(0.01, time + 1)
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
  // playPulse(440)()
  
  const tile = e.target.closest('.tile');
  const coords = getCoordinates(e)
  
  // console.log('coords', coords)
  
  if (!tile) return;
  
  const string = e.target.closest('.string-container');
  tile.dataset.active = false //!isActive;
  
  const targetPitch = tile.dataset.pitch
  const targetPitchClass = tile.dataset.pitchClass
  
  const stringNumber = +string.dataset.stringNumber - 1
  
  const prevActive = [...string.children].find((tile) => tile.dataset.active === 'true')
  
  // if (prevActive && prevActive !== tile) {
  //   prevActive.dataset.active = false;
  // }
  
  const osc = stringOscillators[stringNumber];
  
  
  const isActive = tile.dataset.active === 'true' ? true : false;
  
  
  stringContainers.forEach((el, i) => {
    const osc = stringOscillators[i];
    if (osc) {
      osc();
      // stringOscillators[stringNumber] = null
    }
    
    [...el.children].forEach((child, i) => {
      // child.dataset.active = false;
      
      if (
        child.dataset.pitchClass === targetPitchClass
      ) {
        child.dataset.active = true //!isActive;
      }
      else {
        child.dataset.active = false;
      }
      
    });
    
  });
  
  
  
  // if (tile.dataset.active === 'true') {
  const baseNote = string.dataset.baseNote
  
  const stringModel = fretboardModel.getStringByBase(baseNote)
  const note = stringModel.getNoteByPitch(tile.dataset.pitch)
  
  stringOscillators[stringNumber] = playPulse(note.frequency)
  // }
});