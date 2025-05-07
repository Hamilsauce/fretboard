import { StandardTuningStrings } from '../src/init-fretboard-data.js';
import { FretboardModel } from '../src/FretboardModels.js';
import { getSVGTemplate } from '../src/lib/template-helpers.js'
import { getCoordinates, svgPoint } from '../src/lib/svg-helpers.js'
import { MusicalScales, NoteData } from '../data/index.js';
import { sleep } from '../circular-loop-generator.js';
import { scheduleOscillator, AudioNote, audioEngine } from '../src/audio/index.js';



const newNote = (new AudioNote(audioEngine))
  .at(audioEngine.currentTime + 0.2)
  .frequencyHz(660)
  .duration(2)
// .velocity(0.4)
// .play();

console.warn('newNote', newNote)
console.warn('audioEngine', audioEngine)

const fretboardModel = new FretboardModel(StandardTuningStrings);

const svgCanvas = document.querySelector('#canvas');
const stringLayer = svgCanvas.querySelector('#string-layer')
const appHeaderRight = document.querySelector('#app-header-right')

const stringContainers = [...svgCanvas.querySelectorAll('.string-container')];

export const randoDigi = (range = 5) => Math.floor(Math.random() * range);


const updateHeader = (value) => {
  appHeaderRight.textContent = value
};

export const initThemeTransformer = async (el, interval = 2000) => {
  let intensityOn = true
  let intervalTime = interval
  let stopTransformerId = null
  let originalTransition = el.style.transition
  el.style.transition = '2s'
  
  stopTransformerId = setInterval(() => {
    const rand = randoDigi(360)
    
    if (intensityOn) el.style.filter = `hue-rotate(${rand}deg) contrast(1.8) brightness(1.2)`
    else el.style.filter = `hue-rotate(${rand}deg) contrast(1.4) brightness(1.8)`
    
    // if (el.classList.contains('reverse-gradient')) {
    //   el.classList.remove('reverse-gradient')
    //   el.classList.add('gradient')
    // }
    // else {
    //   el.classList.remove('gradient')
    //   el.classList.add('reverse-gradient')
    // }
    
    intensityOn = !intensityOn
  }, intervalTime)
  
  return () => {
    el.style.filter = '';
    el.style.transition = originalTransition
    intensityOn = false;
    
    clearInterval(stopTransformerId)
  }
};


function playPulse(pulseHz = 440) {
  let time = audioEngine.currentTime
  
  const osc = new OscillatorNode(audioEngine, {
    type: "triangle",
    frequency: 20,
  });
  
  osc.frequency.exponentialRampToValueAtTime(pulseHz, time + 0.15)
  
  const amp = new GainNode(audioEngine, { value: 0.0 });
  
  const lfo = new OscillatorNode(audioEngine, {
    type: "square",
    frequency: 1,
  });
  
  // lfo.connect(amp.gain);
  amp.gain.exponentialRampToValueAtTime(0.3, time + 1)
  osc.connect(amp).connect(audioEngine.destination);
  
  // lfo.start();
  osc.start();
  
  return (pulseTime = 1) => {
    time = audioEngine.currentTime
    
    osc.frequency.exponentialRampToValueAtTime(1, time)
    amp.gain.exponentialRampToValueAtTime(0.1, time + 1)
    
    osc.stop(time + 1)
  }
}

function playChord(pitches = [], arpeggiate = true) {
  let time = audioEngine.currentTime
  
  const osc = new OscillatorNode(audioEngine, {
    type: "triangle",
    frequency: 20,
  });
  
  osc.frequency.exponentialRampToValueAtTime(pulseHz, time + 0.15)
  
  const amp = new GainNode(audioEngine, { value: 0.0 });
  
  // const lfo = new OscillatorNode(audioEngine, {
  //   type: "square",
  //   frequency: 1,
  // });
  
  // lfo.connect(amp.gain);
  amp.gain.exponentialRampToValueAtTime(0.3, time + 1)
  osc.connect(amp).connect(audioEngine.destination);
  
  // lfo.start();
  osc.start();
  
  return (pulseTime = 1) => {
    time = audioEngine.currentTime
    
    osc.frequency.exponentialRampToValueAtTime(1, time)
    amp.gain.exponentialRampToValueAtTime(0.1, time + 1)
    
    osc.stop(time + 1)
  }
}

export const setEachNoteTo = async (selectFn, updateFn) => {
  const tiles = [...svgCanvas.querySelectorAll('.tile')]
    .filter((tile, i) => selectFn(tile));
  
  return await tiles.reduce(async (acc, tile, i) => {
    updateFn(tile)
    return true
  }, Promise.resolve());
}

export const activateNotes = async (selectFn) => {
  const tiles = [...svgCanvas.querySelectorAll('.tile')]
    .filter((tile, i) => {
      return selectFn(tile)
    });
  
  return await tiles.reduce(async (acc, tile, i) => {
    await sleep(50 * i)
    
    tile.dataset.active = true;
    return true
  }, Promise.resolve());
}


export const targetNotes = (selectFn) => {
  const tiles = [...svgCanvas.querySelectorAll('.tile')]
    .filter((tile, i) => {
      return selectFn(tile)
    }).reverse();
  
  tiles.forEach(async (tile, i) => {
    tile.dataset.isTarget = true;
    await sleep(66 * i)
  });
}

export const getActiveNotes = () => {
  return [...document.querySelectorAll('.tile[data-active=true]')];
};

export const deactivateAllNotes = async (resetData = true) => {
  return await getActiveNotes()
    .reverse()
    .reduce(async (acc, tile, i) => {
      await sleep(33 * i)
      
      tile.dataset.active = false;
      
      if (resetData) {
        delete tile.dataset.scaleDegree
        tile.dataset.isTarget = false
      }
      
      return true
    }, Promise.resolve());
};

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

export const getScalePitchClasses = (root, scaleName) => {
  const scaleFormula = MusicalScales[scaleName]
  const firstRootIndex = NoteData.findIndex(note => note.pitchClass === root)
  
  return scaleFormula.map((interval) => {
    const noteIndex = firstRootIndex + interval
    return NoteData[noteIndex].pitchClass
  });
}

export const getScaleNotes = (rootPitch, scaleName) => {
  const scaleFormula = MusicalScales[scaleName]
  const firstRootIndex = NoteData.findIndex(note => note.pitch === rootPitch)
  
  return scaleFormula.map((interval) => {
    const noteIndex = firstRootIndex + interval
    return NoteData[noteIndex]
  });
}

export const getChordNotes = (root, scaleName) => {
  const scalePitches = getScaleNotes(root, scaleName)
  const majorChordDegreeSteps = [0, 2, 4, 6]
  
  return majorChordDegreeSteps.map((interval) => scalePitches[interval]);
}

export const toneChordState = {
  arpeggiate: false,
  playChords: true,
}

let scheduledOscs

stringLayer.addEventListener('click', (e = new MouseEvent()) => {
  const tile = e.target.closest('.tile');
  
  if (!tile) return;
  const string = e.target.closest('.string-container');
  const targetPitch = tile.dataset.pitch
  const targetPitchClass = tile.dataset.pitchClass
  const stringNumber = +string.dataset.stringNumber - 1
  const prevActive = [...string.children].find((tile) => tile.dataset.active === 'true')
  let osc = stringOscillators[stringNumber];
  const isActive = tile.dataset.active === 'true' ? true : false;
  let stringParentNumber
  
  stringContainers.forEach((el, i) => {
    osc = stringOscillators[i];
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

if (scheduledOscs) {
  scheduledOscs.forEach((scheduledOsc, i) => {
    scheduledOsc.stop(audioEngine.currentTime + (i * 0.2))
  });
  scheduledOscs = null
}  
  
  if (tile !== prevActive) {
    const { arpeggiate, playChords } = toneChordState
    
    if (!arpeggiate && !playChords) {
      const note = stringModel.getNoteByPitch(tile.dataset.pitch)
      stringOscillators[stringNumber] = playPulse(note.frequency)
    } else if (!playChords && arpeggiate) {
      scheduledOscs = getChordNotes(tile.dataset.pitch, 'major').map((note, i) => {
        const timeMod = ((i + 1) / 2)
        const startFreq = note.frequency - 100
        
        return scheduleOscillator({
          audioCtx: audioEngine,
          type: "triangle",
          frequencyAutomation: [
            { type: "setValue", value: startFreq, time: 0 },
            { type: "linearRamp", value: note.frequency, time: 0.3 }
          ],
          gainAutomation: [
            { type: "setValue", value: 0.0, time: timeMod + 0 },
            { type: "linearRamp", value: 0.3, time: timeMod + 1 }, // fade in
            { type: "linearRamp", value: 0.0, time: timeMod + 2 } // fade out
          ],
          startDelay: timeMod + 0.1,
          stopAfter: timeMod + 2
        }).osc;
      });
    } else if (!arpeggiate && playChords) {
      scheduledOscs = getChordNotes(tile.dataset.pitch, 'major').map((note, i) => {
        const timeMod = 0
        const startFreq = note.frequency - 100
        
        return scheduleOscillator({
          audioCtx: audioEngine,
          type: "triangle",
          frequencyAutomation: [
            { type: "setValue", value: startFreq, time: 0 },
            { type: "linearRamp", value: note.frequency, time: 0.3 }
          ],
          gainAutomation: [
            { type: "setValue", value: 0.0, time: timeMod + 0 },
            { type: "linearRamp", value: 0.2, time: timeMod + 0.6 }, // fade in
            { type: "linearRamp", value: 0.0, time: timeMod + 1 } // fade out
          ],
          startDelay: timeMod + 0.1,
          stopAfter: timeMod + 1.5
        }).osc;
      });
    }
    
    tile.dataset.active = true
    tile.dataset.isTarget = true
  } else {
    // if (scheduledOsc) {
    //   scheduledOsc.stop(audioEngine.currentTime + 0.01)
    // }
    tile.dataset.active = false
    tile.dataset.isTarget = false
  }
});