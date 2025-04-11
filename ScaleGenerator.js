import { PitchClassSets, NoteData } from './data/index.js';

console.log('NoteData', JSON.stringify(NoteData[0], null, 2))

const toPitchClassNames = (notesArray = []) => notesArray
  .filter((x, i) => i <= 11)
  .map(({ pitchClass }, i) => pitchClass);

const moduleState = {
  scaleMap: new Map(Object.entries(PitchClassSets)),
  noteMap: new Map(
    NoteData.map((note) => [note.pitch, note])
  ),
  
  pitchClassNames: toPitchClassNames(NoteData),
  
  orderPitchesFromNote(pitch) {
    const index = this.pitchClassNames.indexOf(pitch)
    
    const reorder1 = this.pitchClassNames
      .slice(index)
      .concat(this.pitchClassNames.slice(0, index))
    
    return reorder1
  },
  
  getScale(name) {
    return this.scaleMap.get(name)
  },
  
  getNote(pitch) {
    return this.noteMap.get(pitch)
  },
};


const badChars = '",{,} ';

function* generator(rootName, scaleName = 'major', orderedPitches = [], octave = 0) {
  const baseNote = moduleState.noteMap.get(rootName);
  const scale = moduleState.getScale(scaleName);
  const baseIndex = baseNote.id;
  
  let shouldStringify = false;
  let index = 0;
  let currentDegree = scale[index]
  let note =  NoteData[baseIndex + currentDegree];
  
  let msg = shouldStringify ? [...JSON.stringify(note, null, 2)].reduce((acc, curr, i) => badChars.includes(curr) ? acc : acc.concat(curr), '') : note
  
  while (true) {
    shouldStringify = !!(yield msg)
    index = index >= scale.length ? 0 : index + 1
    
    currentDegree = scale[index] ?? 12
    
    note = NoteData[baseIndex + currentDegree]
    
    msg = shouldStringify ? [...JSON.stringify(note, null, 2)].reduce((acc, curr, i) => badChars.includes(curr) ? acc : acc.concat(curr), '') : note
  }
}

export const run = (rootName = 'E2', scaleName = 'chromatic') => {
  return generator(rootName, scaleName)
};