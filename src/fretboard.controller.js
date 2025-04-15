import { StandardTuningStrings } from '../src/init-fretboard-data.js';
import { FretboardModel } from '../src/FretboardModels.js';
import { getSVGTemplate } from '../src/lib/template-helpers.js'

const fretboardModel = new FretboardModel(StandardTuningStrings);

const svgCanvas = document.querySelector('#canvas');
const stringLayer = svgCanvas.querySelector('#string-layer')

const stringContainers = [...svgCanvas.querySelectorAll('.string-container')];

const audioCtx = new AudioContext()


function playPulse(pulseHz = 440) {
 let time = audioCtx.currentTime

  const osc = new OscillatorNode(audioCtx, {
    type: "sine",
    frequency: 50,
  });
  
  osc.frequency.exponentialRampToValueAtTime(pulseHz, time + 0.2)

  const amp = new GainNode(audioCtx, { value: 0.3 });
  
  const lfo = new OscillatorNode(audioCtx, {
    type: "square",
    frequency: 2,
  });
  
  // lfo.connect(amp.gain);
  osc.connect(amp).connect(audioCtx.destination);
  // lfo.start();
  osc.start();

  return (pulseTime = 1) => {
    // time = performance.now();
    time = audioCtx.currentTime
    
    amp.gain.exponentialRampToValueAtTime(0.01, time + 1)
    osc.frequency.exponentialRampToValueAtTime(1, time + 0.9)
    osc.stop(time + 1.1);
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
      
      const textEl = template.querySelector('text')
      const noteText = note.pitch.split('\/')[0]
      textEl.textContent = noteText //note.pitch
      stringEl.appendChild(template)
    });
  });
}

stringLayer.addEventListener('click', (e) => {
  // playPulse(440)()
  
  const tile = e.target.closest('.tile');
  
  if (!tile) return;
  
  const string = e.target.closest('.string-container');
  
  const baseNote = tile.dataset.baseNote
  
  const stringNumber = +string.dataset.stringNumber - 1
  
  const prevActive = [...string.children].find((tile) => tile.dataset.active === 'true')
  
  if (prevActive && prevActive !== tile) {
    prevActive.dataset.active = false;
  }

  const osc = stringOscillators[stringNumber];
  
  if (osc) {
    osc();
    stringOscillators[stringNumber] = null
  }
  
  const isActive = tile.dataset.active === 'true' ? true : false;
  tile.dataset.active = !isActive;
  
  if (tile.dataset.active === 'true') {
    const baseNote = string.dataset.baseNote
    
    const stringModel = fretboardModel.getStringByBase(baseNote)
    const note = stringModel.getNoteByPitch(tile.dataset.pitch)
    
    stringOscillators[stringNumber] = playPulse(note.frequency)
  }
});