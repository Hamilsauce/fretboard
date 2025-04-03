// import { noteData } from './data/note-data-fetch.js';
// window.location = 'https://github.com/Hamilsauce/guitar-tab/raw/refs/heads/main/data/note-data.json'
const noteDataURL = 'https://raw.githubusercontent.com/Hamilsauce/guitar-tab/refs/heads/main/data/note-data.json'

const getNotes = async() => {
  const { notes } = await (await fetch(noteDataURL)).json();
  return notes
    .filter((x, i) => i <= 11)
    .map(({ note }, i) => note);
}

const toPitchClassNames =  (notesArray = []) => {
  return notesArray
    .filter((x, i) => i <= 11)
    .map(({ note }, i) => note);
}


const getIndexOfNote = (notes, note = 'C') => {
  return notes.indexOf(note)
};

function* generator(notes, initialNote = 'C', octave = 0) {
  let getNoteIndex = (note = 'C') => getIndexOfNote(notes, note)
  let note = initialNote
  let steps = 1
  
  let currentIndex = getNoteIndex(note)
  let currentOctave = octave;
  let msg = `${note}${octave}`
  
  while (currentIndex > -1) {
    steps = +(yield msg) && +(yield msg) < 12 ? +(yield msg) : 1
    currentIndex = getNoteIndex(note) + steps
    
    if (currentIndex >= 12) {
      currentOctave++
      currentIndex = currentIndex - 12
    }
    console.warn('note', note)
    
    note = notes[currentIndex]
    
    msg = `${note}${currentOctave}`
  }
}




const startGenerator = (notes, note = 'C') => {
  return generator(notes, note);
};

export const run = (notes) => {
  return startGenerator(toPitchClassNames(notes));
};

// run()


// const gen = generator();

// console.log(gen.next().value);
// Expected output: 10

// console.log(gen.next().value);
// console.log(gen.next().value);