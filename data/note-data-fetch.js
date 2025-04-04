const noteDataURL = 'https://raw.githubusercontent.com/Hamilsauce/guitar-tab/refs/heads/main/data/note-data.json'

export const {
  notes: NoteData
} = (await (await fetch(noteDataURL)).json());