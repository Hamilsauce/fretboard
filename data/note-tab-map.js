// Build a pair of dicts that map note
// names to pitch numbers and back, 
// and you can build a simple function 
// to do this, like:

// const noteSteps = { "C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11 };
// const noteStepMap = Object.entries(noteSteps).reduce((arr, [key, value]) => {
//   return [...acc, [value, key]];
// }, [])

const noteSteps = { "C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11 };

// keys = notes, vals = steps  
const noteStepMap = new Map(Object.entries(noteSteps))
console.log('note step map', noteStepMap.get('C#'));
// keys = steps, vals = names  

const stepNoteMap = new Map(
  Object.entries(noteSteps).reduce(
    (acc, [key, value]) => {
      return [...acc, [value, key]];
    }, [])
);

const GetNote = (stringNote, fretNum) => {
  let baseNote = noteStepMap.get(stringNote);
  let fretNoteNum = (baseNote + fretNum) % 12;
  
  return stepNoteMap.get(fretNoteNum) // >>> GetNote("E", 0)
}

console.log('getnote b fret 18', GetNote('B', 18))

// 'E' >>>
// GetNote("E", 1)
// 'F' >>> GetNote("A", 7)
// 'E' >>> GetNote("G", 6)
// 'C#'

/*
NOTES = {"C" : 0, "C#" : 1,  "D": 2, "D#" : 3, "E": 4, "F": 5, 
   "F#" : 6, "G":  7, "G#" : 8, "A": 9, "A#" : 10, "B": 11}


NAMES = dict([(v, k) for (k, v) in NOTES.items()])


def GetNote(stringNote, fretNum):
   baseNote = NOTES[stringNote]
   fretNoteNum = (baseNote + fretNum) % 12
   return NAMES[fretNoteNum]

>>> GetNote("E", 0)
'E'
>>> GetNote("E", 1)
'F'
>>> GetNote("A", 7)
'E'
>>> GetNote("G", 6)
'C#'
*/