import { initKeyboard } from '../tab-editor/keyboard-input.js';
import { incrementBeat, decrementBeat } from '../tab-editor/increment-decrement-beat.js';

const app = document.querySelector('#app');
const svg = document.querySelector('svg');
const svgCanvas = document.querySelector('#svg-canvas');
const contextMenu = document.querySelector('#context-menu');
const appBody = document.querySelector('#app-body')
const cellInfo = document.querySelector('#cell-info')
const cellBeat = cellInfo.querySelector('#cell-beat')
const cellFret = cellInfo.querySelector('#cell-fret')
const fretInput = document.querySelector('#fret-input')
const containers = document.querySelectorAll('.container')

const keyboardNav = initKeyboard(fretInput)

class AppState extends EventTarget {
  #activeCell;
  #inputValue;
  
  constructor() {
    super();
    window.appState = this
  }
  
  get inputValue() { return this.#inputValue }
  
  set inputValue(v) {
    const prev = this.#inputValue;
    this.#inputValue = v;
    
    if (prev !== v) {
      this.dispatchEvent(new CustomEvent('inputvalue:change', {
        detail: { value: this.#inputValue }
      }));
    }
  }
  
  get activeCell() { return this.#activeCell }
  
  set activeCell(v) {
    const prev = this.#activeCell;
    this.#activeCell = v;
    this.#inputValue = this.#activeCell.querySelector('text').textContent
    this.dispatchEvent(new CustomEvent('activecell:change', {
      detail: { previous: prev, current: this.#activeCell }
    }));
  }
  
  activateAdjacent(dir) {
    let stringNo = this.activeCell.closest('.tab-line-group').dataset.stringNumber
    let currentBeat = this.activeCell.dataset.fullBeat
    let newStringNo
    let newBeat
    
    let pos = { x: 0, y: 0 }
    
    if (dir === 'left') {
      newBeat = decrementBeat(currentBeat)
      newStringNo = +stringNo
    }
    if (dir === 'right') {
      newBeat = incrementBeat(currentBeat)
      newStringNo = +stringNo
    }
    
    if (dir === 'up') {
      newStringNo = +stringNo - 1 < 1 ? 1 : +stringNo - 1
      newBeat = currentBeat
    }
    
    if (dir === 'down') {
      newStringNo = +stringNo + 1 > 6 ? 6 : +stringNo + 1
      newBeat = currentBeat
    }
    
    const newCell = this.activeCell.closest('.tab-lines')
      .querySelector(`[data-string-number="${newStringNo}"]`)
      .querySelector(`[data-full-beat="${newBeat}"]`)
    
    this.activeCell = newCell ?? this.activeCell
  }
}

const BEATS_BEATS_BAR = 4;

const appState = new AppState();


keyboardNav.addEventListener('keyboardnav', ({ detail }) => {
  const { direction } = detail;
  appState.activateAdjacent(direction)
  // cellBeat.textContent = current.dataset.fullBeat
});

appState.addEventListener('activecell:change', ({ detail }) => {
  const { previous, current } = detail;
  
  if (previous) {
    previous.classList.remove('active')
  }
  
  if (current) {
    current.classList.add('active')
  }
  
  cellBeat.textContent = `Beat: ${current.dataset.fullBeat}`
  cellFret.textContent = `Fret: ${appState.inputValue}`
});

appState.addEventListener('inputvalue:change', ({ detail }) => {
  const { value } = detail;
  if (value) {
    
  }
  appState.activeCell.querySelector('text').textContent = value
});


export const getSVGTemplate = (svgContext, type, options) => {
  const template = svgContext
    .querySelector('#templates')
    .querySelector(`[data-template="${type}"]`)
    .cloneNode(true)
  
  template.dataset.type = type;
  template.removeAttribute('data-template');
  delete template.dataset.template;
  
  return template;
}

const copyTextToClipboard = async (text) => {
  await navigator.clipboard.writeText(text)
};

const selectTextFromTarget = (e) => {
  window.getSelection().selectAllChildren(e.target)
  document.execCommand("Copy");
  alert('Copied!')
};

function svgPoint(element, x, y) {
  var pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  return pt.matrixTransform(element.getScreenCTM().inverse());
}

const createLineCell = (x, content) => {
  const cell = getSVGTemplate(svgCanvas, 'tab-cell')
  const text = cell.querySelector('text')
  
  cell.setAttribute('transform', `translate(${x},0)`)
  // text.textContent = content ?? ''
  console.log(x)
  cell.addEventListener('click', e => {
    fretInput.focus();
    
    // const input = prompt(`Enter fret (blank to clear):`, text.textContent);
    appState.activeCell = cell;
    
    // const isBlank = typeof input === 'string' && input.length === 0
    // text.textContent = +input || isBlank ? input : text.textContent;
  });
  
  return cell;
};

const subBeatMap = new Map([
  [undefined, '1'],
  [NaN, '1'],
  ['25', '2'],
  ['5', '3'],
  ['75', '4'],
])

const createLineGroup = (y, cellCount) => {
  const line = getSVGTemplate(svgCanvas, 'tab-line-group')
  line.setAttribute('transform', `translate(0, ${y})`)
  line.classList.add('string-line')
  
  const cellGroup = line.querySelector('.tab-line-cells')
  cellGroup.setAttribute('transform', `translate(15, 0)`)
  
  const sixteenthNote = (BEATS_BEATS_BAR / cellCount)
  
  for (var i = 0; i < cellCount; i++) {
    const cellBeat = (i * sixteenthNote);
    const pos = ((cellCount * i) * 1.75) + 15;
    const cell = createLineCell(pos, i)
    cell.dataset.beat = cellBeat;
    
    const [curr, subBeat] = `${cellBeat}`.split('.')
    let formattedSub = subBeatMap.get(subBeat)
    let formattedCurr = +curr + 1
    let formattedFull = `${formattedCurr}.${formattedSub}`
    cell.dataset.fullBeat = formattedFull;
    
    cellGroup.appendChild(cell)
  }
  
  return line;
};

const getStringByNumber = (number, svg) => svg.querySelector(`.tab-line-group[data-string-number="${number}"]`);

const getCellByBeat = (beat, stringNumber, svg) => getStringByNumber(stringNumber, svg).querySelector(`.tab-cell[data-full-beat="${beat}"]`);


// TODO @ SCRATCH
const newLine = createLineGroup(20, 16)
svgCanvas.querySelector('.tab-lines').innerHTML = ''
svgCanvas.querySelector('.tab-lines').appendChild(newLine)

let activeText;


const stringY = [20, 40, 60, 80, 100, 120]; // E A D G B E
const fretData = [
  { string: 4, fret: 2, beat: 1.1 },
  { string: 3, fret: 4, beat: 2.3 },
  { string: 3, fret: 4, beat: 3.1 },
  { string: 4, fret: 2, beat: 4.4 },
];


function renderSVGTab(frets, cellCount = 16) {
  // const svg = document.getElementById('tab-svg');
  const svgs = [...document.querySelectorAll('#tab-svg')]
  
  svgs.forEach((svg, i) => {
    const tabLines = svg.querySelector('.tab-lines');
    tabLines.innerHTML = '';
    
    stringY.forEach((y, i) => {
      const line = createLineGroup(y, 16);
      line.dataset.stringNumber = i + 1;
      
      tabLines.appendChild(line);
    });
    
    
    const barLine1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    barLine1.setAttribute("x1", 0) //* 60);
    barLine1.setAttribute("x2", 0) //* 60);
    barLine1.setAttribute("y1", 20);
    barLine1.setAttribute("y2", 120);
    barLine1.setAttribute("stroke", "#444");
    barLine1.classList.add('string-line')
    tabLines.appendChild(barLine1);
    
    const barLine2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    barLine2.setAttribute("x1", 160 * 3) //* 60);
    barLine2.setAttribute("x2", 160 * 3) //* 60);
    barLine2.setAttribute("y1", 20);
    barLine2.setAttribute("y2", 120);
    barLine2.setAttribute("stroke", "#444");
    barLine2.classList.add('string-line')
    tabLines.appendChild(barLine2);
    
    
    frets.forEach(note => {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      console.log(note)
      const cell = getCellByBeat(note.beat, note.string, svg)
      const cellText = cell.querySelector('text')
      cellText.textContent = note.fret;
    });
  });
}


document.addEventListener('contextmenu', e => {
  e.preventDefault()
  e.stopPropagation()
  
  const { x, y } = e;
  
  contextMenu.style.left = `${x}px`
  contextMenu.style.top = `${y}px`
  contextMenu.dataset.show = true;
  
  const blurContextMenu = (e) => {
    if (contextMenu.dataset.show === 'true') {
      e.preventDefault()
      e.stopPropagation()
      
      contextMenu.dataset.show = false;
      contextMenu.style.left = `0px`
      contextMenu.style.top = `0px`
      
      document.removeEventListener('click', blurContextMenu)
    }
    
    console.log('ran blurContextMenu')
  };
  
  document.addEventListener('click', blurContextMenu);
  
});


fretInput.addEventListener('focus', e => {
  // fretInput.value = 
  // appState.activeCell = e.data
  
});

fretInput.addEventListener('input', e => {
  appState.inputValue = e.data
});

fretInput.addEventListener('blur', e => {});


renderSVGTab(fretData);