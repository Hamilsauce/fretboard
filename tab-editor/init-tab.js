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
const stringY = [20, 42, 64, 86, 108, 130]; // E A D G B E (low to high)
let fretData = [];

// Initialize
for (let beat = 0; beat < NUM_BEATS; beat++) {
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

export const renderSVGTab = (selector = '#svg-canvas') => {
  const svg = document.querySelector(selector);
  svg.innerHTML = '';
  
  const tabGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  tabGroup.setAttribute("transform", `translate(0, 0) rotate(0) scale(1)`);
  // tabGroup.setAttribute("y", y);
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
    if (index === 20) {
      note.fret = 10
    }
    
    const { stringData } = note
    
    const x = 20 + note.beat * CELL_WIDTH;
    const y = stringY[note.string] - 10;
    
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
        
        return
      }
      
      if (!isValid) {
        input.value = prevValue
        
        return
      }
      
      if (prevValue.length >= 2 || !hasEdited) {
        input.value = incomingValue
        group.dataset.hasEdited = true;
        
        return
      }
      
      if (prevValue.length == 1 && prevValue == '0') {
        input.value = incomingValue
        group.dataset.hasEdited = true;
        
        return
      }
      
      fretData[index].fret = e.target.value;
      
      
    });
    
    foreign.appendChild(input);
    group.appendChild(foreign)
    tabGroup.appendChild(group);
  });
  svg.appendChild(tabGroup)
}

// renderSVGTab();