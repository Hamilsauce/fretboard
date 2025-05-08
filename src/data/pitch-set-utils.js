import noteArray from './notes.js';

const sourceUrl = './note-frequencies.json';

const frequencyMap = new Map(noteArray.notes.map(_ => [Math.trunc(_.frequency), _]))

export const pitchMap = new Map(noteArray.notes.map(_ => [_.pitch, _]));

const pitchIndex = [...pitchMap.keys()];



const getArpeggio = (baseNote = 'C3', steps = 3) => {
  const notes = [];

  let curr = baseNote;

  while (notes.length <= steps) {

    notes.push(noteArray.notes[pitchIndex.indexOf(curr)]);

    curr = noteArray.notes[pitchIndex.indexOf(curr) + 4].pitch
  }
  console.log('notes', notes)
  return notes

};

const getTriad = (baseNote = 'C3') => {
  const notes = [];

  let curr = baseNote;

  while (notes.length <= 2) {
  console.warn('curr', curr)
    const interval =  notes.length == 0 ? 4 : 3;
    notes.push(noteArray.notes[pitchIndex.indexOf(curr)]);

    curr = noteArray.notes[pitchIndex.indexOf(curr) + interval].pitch
  }
  // console.log('notes', notes)
  return notes

};


export const noteDataSets = {
  noteArray,
  frequencyMap,
  pitchMap,
  getArpeggio,
  getTriad,
}