import { playPulse } from '../tab-editor/audio.js';
import { MusicalScales, NoteData } from '../data/index.js';

const getNoteByPitchName = (name) => {
  const firstRootIndex = NoteData.findIndex(note => note.pitch === name)
  const note = NoteData.find(n => n.pitch === name)
  
  return note
}

const getNoteByDistanceFrom = (startNote, steps) => {
  const startIndex = startNote.id
  const note = NoteData.find(n => n.id === (startIndex + steps))
  
  return note
}


const directionModifierMap = new Map([
  ['left', -1],
  ['up', -1],
  ['right', 1],
  ['down', 1]
])

const NUM_STRINGS = 6;
const NUM_BEATS = 16;
const CELL_WIDTH = 24;
const strings = [
{
  number: 1,
  baseNote: 'E4'
},
{
  number: 2,
  baseNote: 'B3'
},
{
  number: 3,
  baseNote: 'G3'
},
{
  number: 4,
  baseNote: 'D3'
},
{
  number: 5,
  baseNote: 'A2'
},
{
  number: 6,
  baseNote: 'E2'
}, ]

const beatDurationMap = new Map([
  ['sixteenth', 1],
  ['eighth', 2],
  ['quarter', 4],
  ['half', 8],
  ['whole', 16],
])

const isQuarterBeat = (beat) => !(beat % 4);
const isEighthBeat = (beat) => !(beat % 2);
const isBeatOfLength = (beat, durationName = 'quarter') => {
  return !(beat % beatDurationMap.get(durationName))
}


const stringY = [20, 42, 64, 86, 108, 130]; // E A D G B E (low to high)
let fretData = [];

let beatCount = 0

// Initialize
for (let beat = 0; beat < NUM_BEATS; beat++) {
  
  if (isBeatOfLength(beat, 'eighth')) {
    beatCount++
    console.warn('beat', beat)
    console.warn('beatCount', beatCount)
  }
  
  for (let string = 0; string < NUM_STRINGS; string++) {
    fretData.push({ string, beat, fret: '', stringData: strings[string] });
  }
}

const selectTextFromTarget = (e) => {
  window.getSelection().selectAllChildren(e.target)
  document.execCommand("Copy");
  alert('Copied!')
};

const copyTextToClipboard = async (text) => {
  await navigator.clipboard.writeText(text)
};

const isOnlyDigits = (str) => {
  return /^\d+$/.test(str);
}

const createBeatMarker = (x, r = 10) => {
  const marker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  marker.setAttribute('transform', `translate(${x}, 150) rotate(0) scale(1)`);
  marker.setAttribute('r', r)
  marker.classList.add('beat-marker')
  // marker.dataset.barNumber = 1;
  return marker
};


const createDataOutput = (data) => {
  const groupedByString = data.reduce((acc, curr, i) => {
    if (!acc[curr.string]) {
      acc[curr.string] = []
    }
    
    acc[curr.string].push(curr)
    
    return acc
  }, []);
  
  const formattedStrings = groupedByString.map((stringArr, i) => {
    return stringArr.map((cell, i) => {
      return `${cell.fret || '-'}`
    }).join('|')
  });
  
  const formattedGrid = formattedStrings.join('\n')
  
  return formattedGrid
};

const renderDataOutput = (data) => {
  const outEl = document.querySelector('#data-output');
  
  const formattedData = createDataOutput(data)
  outEl.innerHTML = formattedData
}

document.querySelector('#app-header-center').addEventListener('click', e => {
  const fretJSON = JSON.stringify(fretData, null, 2)
  const formattedData = createDataOutput(fretData)
  console.warn('createDataOutput', formattedData)
  // console.log(fretJSON)
});

export const renderSVGTab = (selector = '#svg-canvas') => {
  const svg = document.querySelector(selector);
  svg.innerHTML = '';
  
  const tabGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  tabGroup.setAttribute("transform", `translate(0, 0) rotate(0) scale(1)`);
  tabGroup.classList.add('tab-group')
  tabGroup.dataset.barNumber = 1;
  
  // Draw strings
  stringY.forEach((y, stringIndex) => {
    const string = strings[stringIndex]
    
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.classList.add('string-line')
    line.dataset.stringNumber = string.number
    line.dataset.baseNote = string.baseNote
    
    line.setAttribute("x1", 0);
    line.setAttribute("x2", 400);
    line.setAttribute("y1", y);
    line.setAttribute("y2", y);
    tabGroup.appendChild(line);
  });
  
  // Render editable fret numbers
  fretData.forEach((note, index) => {
    const { stringData, beat } = note
    const x = 20 + note.beat * CELL_WIDTH;
    const y = stringY[note.string] - 10;
    const isQuarter = isQuarterBeat(note.beat)
    const isEighth = isEighthBeat(note.beat)
    
    if (isQuarter || isEighth) {
      const r = isQuarter ? 4 : 2;
      tabGroup.appendChild(createBeatMarker(x, r))
    }
    
    
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("transform", `translate(${x - 10}, ${y}) rotate(0) scale(1)`);
    group.setAttribute("y", y);
    group.classList.add('input-group')
    group.dataset.x = x - 10
    group.dataset.y = y
    group.dataset.stringNumber = stringData.number
    group.dataset.beat = note.beat
    group.dataset.hasEdited = false;
    
    const foreign = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    // foreign.setAttribute("x", x - 10);
    // foreign.setAttribute("y", y);
    foreign.setAttribute("width", 20);
    foreign.setAttribute("height", 20);
    foreign.setAttribute("class", "fret-input-container");
    
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("maxlength", "3");
    input.setAttribute("max", "24");
    input.setAttribute("class", "fret-edit");
    input.value = note.fret;
    
    input.addEventListener('click', (e) => {
      e.preventDefault()
      // input.select()
    });
    
    input.addEventListener('focus', (e) => {
      // e.preventDefault()
      // input.select()
      const previousEdited = svg.querySelector('[data-has-edited="true"]')
      
      if (previousEdited) {
        previousEdited.dataset.hasEdited = false;
      }
      
      input.parentElement.focus()
    });
    
    input.addEventListener('blur', (e) => {
      const fretValue = input.value
      
      if (+fretValue) {
        const stringNo = input.closest('.input-group').dataset.stringNumber
        const stringEl = document.querySelector(`.string-line[data-string-number="${stringNo}"`)
        const baseNoteName = stringEl.dataset.baseNote
        
        const baseNote = getNoteByPitchName(baseNoteName)
        
        const fretNote = getNoteByDistanceFrom(baseNote, +fretValue)
        
        const freq = fretNote.frequency
        console.warn('freq', freq)
        // playPulse(1, freq)
      }
      
    });
    
    input.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      let nextInputGroup;
      
      if (key.includes('arrow')) {
        const dir = key.replace('arrow', '')
        const dirModifier = directionModifierMap.get(dir)
        
        const group = input.closest('.input-group')
        const stringNumber = +group.dataset.stringNumber
        const beat = +group.dataset.beat
        
        if (dir === 'left' || dir === 'right') {
          nextInputGroup = svg.querySelector(`.input-group[data-string-number="${stringNumber}"][data-beat="${beat + dirModifier}"]`)
        } else if (dir === 'up' || dir === 'down') {
          nextInputGroup = svg.querySelector(`.input-group[data-string-number="${stringNumber + dirModifier}"][data-beat="${beat}"]`)
        }
        
        if (nextInputGroup) {
          nextInputGroup.querySelector('input').focus()
        }
      }
    })
    
    input.addEventListener('input', (e) => {
      const isValid = isOnlyDigits(e.data)
      const inputType = e.inputType
      const incomingValue = e.data
      const prevValue = input.value.replace(incomingValue, '')
      const inputGroup = input.closest('.input-group')
      const hasEdited = inputGroup.dataset.hasEdited === 'true' ? true : false;
      const containsLeadingZero = prevValue.length == 1 && prevValue == '0';
      
      if (inputType.includes('delete')) {
        fretData[index].fret = e.target.value;
        group.dataset.hasEdited = true;
        
        // return
      }
      
      else if (!isValid) {
        input.value = prevValue
        
        // return
      }
      
      else if (prevValue.length >= 2 || !hasEdited) {
        input.value = incomingValue
        group.dataset.hasEdited = true;
        
        // return
      }
      
      else if (prevValue.length == 1 && prevValue == '0') {
        input.value = incomingValue
        group.dataset.hasEdited = true;
        
        // return
      }
      
      fretData[index].fret = input.value;
      
      renderDataOutput(fretData)
      
    });
    
    foreign.appendChild(input);
    group.appendChild(foreign)
    tabGroup.appendChild(group);
  });
  svg.appendChild(tabGroup)
}