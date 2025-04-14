const NoteDataType = {
  id: 0,
  step: 0,
  pitchClass: '',
  pitch: '',
  isNatural: true,
  frequency: 0,
  wavelength: 0,
  octave: 0
}


/* Base */
export class Model {
  #type = '';
  #value = null;
  
  constructor(type, value) {
    this.#type = type;
    this.#value = value;
  }
  
  get type() { return this.#type }
  
  get value() { return this.#value }
}

/* Fret on board */
export class FretModel extends Model {
  constructor(number) {
    super('fret', number)
  }
  
  get number() { return this.type; }
}

/* Note on string */
export class NoteModel extends Model {
  constructor(noteData = NoteDataType) {
    super('note', noteData);
  }
  
  get id() { return this.value.id; }
  get step() { return this.value.step; }
  get pitchClass() { return this.value.pitchClass; }
  get pitch() { return this.value.pitch; }
  get isNatural() { return this.value.isNatural; }
  get frequency() { return this.value.frequency; }
  get wavelength() { return this.value.wavelength; }
  get octave() { return this.value.octave; }
}

/* List of notes */
export class StringModel extends Model {
  #noteMap = new Map();
  #baseNote;
  #activeNotePitch;
  
  constructor(noteArray = []) {
    super('strings', noteArray.map((note, i) => {
      return new NoteModel(note)
    }));
  
    this.#baseNote = this.notes[0];
  }
  
  get baseNote() {
    return this.notes[0];
  }
  
  get notes() {
    return this.value;
  }
  
  playNoteAt(position = 1) {
    this.#activeNotePitch = this.value[position]
  }
  
  getNoteAt(position = 1) {
    if (!!(+position) && position < this.notes.length) {
      return this.notes[position]
    }
    
    return null;
  }
  
  // get activeNote() {
  //   return this.#noteMap.get(this.#activeNotePitch)
  // }
  
  // get notePitches() {
  //   return [...this.#noteMap.keys()]
  // }
  
}

/* List of frets */
export class FretboardModel extends Model {
  // #strings = [];
  
  constructor(stringArray = []) {
    super('fretboard', stringArray
      // .reverse()
      .map((noteArray, i) => {
        return new StringModel(noteArray)
      }));
  }
  
  get strings() { return this.value; }
  
  getStringAt(position = 0) {
    if (!!(+position) && position < this.strings.length) {
      return this.strings[position]
    }
    
    return null;
  }
  
  getStringByBase(pitchName = 'E2') {
    
    const res = this.strings.find((string) => string.baseNote.pitch === pitchName)

    return res
  }
}


/* 
ALTERNATIVE Matrix of notes 

 noteMatrix: 6 x 13 two dim array

*/

const emptyMatrix = new Array(6 * 13).fill(null).map((_, i) => {})

export class FretboardMatrixModel {
  constructor(noteMatrix) {
    
  }
  
  
}