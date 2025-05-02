import { StandardTuningStrings } from '../src/init-fretboard-data.js';
import { FretboardModel } from '../src/FretboardModels.js';
import { getSVGTemplate } from '../src/lib/template-helpers.js'
import { getCoordinates, svgPoint } from '../src/lib/svg-helpers.js'
import { MusicalScales, NoteData } from '../data/index.js';
import { sleep } from '../circular-loop-generator.js';

const fretboardModel = new FretboardModel(StandardTuningStrings);

const svgCanvas = document.querySelector('#canvas');
const stringLayer = svgCanvas.querySelector('#string-layer')
const appHeaderRight = document.querySelector('#app-header-right')

const stringContainers = [...svgCanvas.querySelectorAll('.string-container')];

const updateHeader = (value) => {
  appHeaderRight.textContent = value
};

export const initThemeTransformer = async (el, interval = 1000) => {
  // const appbody = document.querySelector('#app-body');
  await sleep(500)
  
  let intensityOn = true
  let intervalTime = interval
  let stopTransformerId = null

  
  stopTransformerId = setInterval(() => {
    if (intensityOn) el.style.filter = 'hue-rotate(80deg) contrast(1.8) brightness(1.2)'
    else el.style.filter = 'hue-rotate(330deg) contrast(1.4) brightness(1.8)'
    
    intensityOn = !intensityOn
  }, intervalTime)
  
  return () => {
     el.style.filter = '';

    clearInterval(stopTransformerId)
  }
};

// initThemeTransformer(8000) 


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

export const setEachNoteTo = async (selectFn, updateFn) => {
  const tiles = [...svgCanvas.querySelectorAll('.tile')]
    .filter((tile, i) => {
      return selectFn(tile)
    });
  
  return await tiles.reduce(async (acc, tile, i) => {
    // await sleep(33 * i)
    
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