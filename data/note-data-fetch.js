const noteDataURL = 'https://raw.githubusercontent.com/Hamilsauce/guitar-tab/refs/heads/main/data/note-data.json'

export default (await (await fetch(noteDataURL)).json());