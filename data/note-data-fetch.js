const noteDataURL = 'https://raw.githubusercontent.com/Hamilsauce/guitar-tab/refs/heads/main/data/note-data.json'

const {
  notes: responseNotes
} = (await (await fetch(noteDataURL)).json());

export const NoteData = responseNotes
  .map(({ note, name, ...rest }, i) => ({
    ...rest,
    pitchClass: note,
    pitch: name,
    json() {
      return JSON.stringify({ ...rest, pitchClass: note, pitch: name }, null, 2)
    },
    toJSON() { return this; },
  }));

// console.log('responseNotes', responseNotes