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
  #baseNotePitch;
  #activeNotePitch;
  
  constructor(noteArray = []) {
    super('string', noteData);
    
    noteData.forEach(({ pitch, ...note }, i) => {
      if (i === 0) {
        this.#baseNotePitch = pitch;
      }
      
      this.#noteMap.set(pitch, note);
    });
  }
  
  playNoteAt(position = 1) {
    this.#activeNotePitch = this.value[position].pitch
  }
  
  get activeNote() {
    return this.#noteMap.get(this.#activeNotePitch)
  }
  
  get notePitches() {
    return [...this.#noteMap.keys()]
  }
  
}

/* List of frets */
export class FretboardModel {
  constructor(tuning) {
    
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