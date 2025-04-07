import { PitchClassSets, NoteData } from './data/index.js';

const toPitchClassNames = (notesArray = []) => notesArray
  .filter((x, i) => i <= 11)
  .map(({ note }, i) => note);

const moduleState = {
  scaleMap: new Map(Object.entries(PitchClassSets)),
  noteMap: new Map(
    NoteData.map(({ name, ...note }) => [name, note])
  ),
  
  pitchClassNames: toPitchClassNames(NoteData),
  
  orderPitchesFromNote(name) {
    const index = this.pitchClassNames.indexOf(name)
    
    const reorder1 = this.pitchClassNames
      .slice(index)
      .concat(this.pitchClassNames.slice(0, index))
    
    return reorder1
  },
  
  getScale(name) {
    return this.scaleMap.get(name)
  },
  
  getNote(name) {
    return this.noteMap.get(name)
  },
};

const setUpScaleWalker = (orderedPitches) => {
  return (degreeInteger = 0) => orderedPitches[degreeInteger]
}

function* generator(scale = [], orderedPitches = [], octave = 0) {
  const getScaleDegree = setUpScaleWalker(orderedPitches)
  
  let index = -1;
  let currentDegree = scale[index]
  let yieldReturn
  let currentOctave = octave;
  
  let note = getScaleDegree(currentDegree);
  let msg = `${note}${octave}`;
  
  while (true) {
    yieldReturn = +(yield msg) && +(yield msg) < scale.length ? +(yield msg) : 1;
    
    if (index >= scale.length) {
      currentOctave++;
      index = 0
    }
    
    currentDegree = scale[index]
    index++;
    note = getScaleDegree(currentDegree);
    msg = `${note}${currentOctave}`;
  }
}

export const run = (rootName = 'C', scaleName = 'major') => {
  const scale = moduleState.getScale(scaleName);
  const orderedPitches = moduleState.orderPitchesFromNote(rootName)
  
  return generator(scale, orderedPitches);
};

export const setScale = (name = 'major') => {
  moduleState.scaleName = name;
};