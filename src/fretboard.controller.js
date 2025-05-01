import { StandardTuningStrings } from '../src/init-fretboard-data.js';
import { FretboardModel } from '../src/FretboardModels.js';
import { getSVGTemplate } from '../src/lib/template-helpers.js'
import { getCoordinates, svgPoint } from '../src/lib/svg-helpers.js'
import { MusicalScales, NoteData } from '../data/index.js';

const fretboardModel = new FretboardModel(StandardTuningStrings);

const svgCanvas = document.querySelector('#canvas');
const stringLayer = svgCanvas.querySelector('#string-layer')
const appHeaderRight = document.querySelector('#app-header-right')

const stringContainers = [...svgCanvas.querySelectorAll('.string-container')];

const updateHeader = (value) => {
  appHeaderRight.textContent = value
};

export const audioCtx = new AudioContext()

function playPulse(pulseHz = 440) {
  let time = audioCtx.currentTime
  
  const osc = new OscillatorNode(audioCtx, {
    type: "triangle",
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
    
    osc.frequency.exponentialRampToValueAtTime(1, time)
    amp.gain.exponentialRampToValueAtTime(0.1, time + 1)
    
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
  
  if (!tile) return;
  const string = e.target.closest('.string-container');
  
  const targetPitch = tile.dataset.pitch
  const targetPitchClass = tile.dataset.pitchClass
  
  const stringNumber = +string.dataset.stringNumber - 1
  
  const prevActive = [...string.children].find((tile) => tile.dataset.active === 'true')
  
  const osc = stringOscillators[stringNumber];
  
  const isActive = tile.dataset.active === 'true' ? true : false;
  let stringParentNumber
  
  stringContainers.forEach((el, i) => {
    const osc = stringOscillators[i];
    if (osc) {
      osc();
    }
    
    [...el.children].forEach((child, k) => {
      child.dataset.isTarget = false
      child.dataset.active = false;
      stringParentNumber = +child.closest('.string-container').dataset.stringNumber - 1
      
      if (
        child.dataset.pitchClass === targetPitchClass &&
        stringNumber !== stringParentNumber
      ) {
        child.dataset.active = !isActive;
      }
      else {
        child.dataset.active = false;
      }
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

// const initNoteIndexTracker = (b)

const getScale = (root, scaleName) => {
  const scaleFormula = MusicalScales[scaleName]
  const firstRoot = NoteData.find(note => note.pitchClass === root)
  const scaleNotes = []
  let scaleIndex = 0
  let baseIndex = 0
  let currDegreeInterval = scaleFormula[scaleIndex];
  let notePosition = [baseIndex + currDegreeInterval]
  let currNote = NoteData[notePosition]
  let count = 0
  console.warn('firstRoot', firstRoot)
  // console.warn('NoteData.length', NoteData.length)
  // while (!(notePosition >= NoteData.length)) {
  // while (!(count >= NoteData.length)) {
  while (!(count >= 30)) {
    count++
    scaleNotes.push(currNote);
    
    
    // if (!currDegreeInterval) {
    //   scaleIndex = 0
    // }
    scaleIndex = scaleIndex >= scaleFormula.length ? 0 : scaleIndex + 1
    currDegreeInterval = scaleFormula[scaleIndex];
    
    console.log({ currNote })
    if (currNote && currNote.pitch === root && currNote.id !== firstRoot.id) {
      console.warn('currNote.id', currNote.id)
      
      baseIndex = currNote.id ?? currNote.index
      scaleIndex = 0
      console.warn('FOUND PITCH CLASS', baseIndex, scaleIndex)
    }
    
    console.warn('baseIndex', baseIndex)
    notePosition = [baseIndex + currDegreeInterval]
    currNote = NoteData[notePosition]
    
    
    // console.log({
    //   scaleIndex,
    //   baseIndex,
    //   currDegreeInterval,
    //   currNote,
    // })
    
  }
  
  return scaleNotes
};


const showScaleNotes = (root, scaleName) => {};

const scaler = getScale('C', 'major')

console.warn('scaler', scaler)