import { run } from '../ScaleGenerator.js';
import { MusicalScales, NoteData } from '../data/index.js';

const standardTuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']

const stringsNoteGenerators = standardTuning.map((baseNote, i) => run(baseNote, 'chromatic'));

export const StandardTuningStrings = new Array(6)
  .fill([])
  .map((noteArray, i) => new Array(13)
    .fill(null)
    .map(() => stringsNoteGenerators[i].next().value)
  );