import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
// import { frameRate } from './lib/frame-rate.js';
// import { mainLoop } from './lib/main-loop.js';
// import { store } from './store.js';
// import { View } from './view.js';
// console.warn('store 4,6', store.grid.tile(4, 4))

import { scheduleOscillator, AudioNote, audioEngine } from '../../src/audio/index.js';

const { template, utils, DOM } = ham;


class PolySynth {
  constructor(audioCtx, options = {}) {
    this.audioCtx = audioCtx;
    this.voices = [];
    this.type = options.type || "sine";
    this.output = options.output || audioCtx.destination;
  }
  
  playNote({
    frequency,
    startTime = this.audioCtx.currentTime,
    duration = 1,
    velocity = 1.0
  }) {
    const note = new AudioNote(this.audioCtx, { type: this.type });
    
    note
      .at(startTime)
      .frequencyHz(frequency)
      .duration(duration)
      .velocity(velocity)
      .play();
    
    this.voices.push(note);
    
    // Optional: clean up finished voices
    setTimeout(() => {
      this.voices = this.voices.filter(v => v !== note);
    }, (startTime - this.audioCtx.currentTime + duration) * 1000);
    
    return note;
  }
  
  stopAll() {
    this.voices.forEach(note => {
      try {
        note._osc.stop(); // force stop
      } catch (e) {}
    });
    this.voices = [];
  }
}



const app = document.querySelector('#app');
const grid = document.querySelector('.grid');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')

// const audioCtx = new AudioContext();
const synth = new PolySynth(audioEngine, { type: "sawtooth" });
const keyboard = document.getElementById("keyboard");

const notes = [
  { name: "C", freq: 261.63 },
  { name: "D", freq: 293.66 },
  { name: "E", freq: 329.63 },
  { name: "F", freq: 349.23 },
  { name: "G", freq: 392.00 },
  { name: "A", freq: 440.00 },
  { name: "B", freq: 493.88 },
  { name: "C", freq: 523.25 }
];


// notes.forEach(note => {
//   const key = document.createElement("div");
//   key.className = "key";
//   key.textContent = note.name;
  
//   key.addEventListener("mousedown", () => {
//     synth.playNote({
//       frequency: note.freq,
//       duration: 1,
//       velocity: 0.5
//     });
//   });
  
//   keyboard.appendChild(key);
// });


// const audioCtx = new AudioContext();
// const synth = new PolySynth(audioCtx, { type: "sawtooth" });

// const notes = [
//   { name: "C", freq: 261.63 },
//   { name: "C#", freq: 277.18 },
//   { name: "D", freq: 293.66 },
//   { name: "D#", freq: 311.13 },
//   { name: "E", freq: 329.63 },
//   { name: "F", freq: 349.23 },
//   { name: "F#", freq: 369.99 },
//   { name: "G", freq: 392.00 },
//   { name: "G#", freq: 415.30 },
//   { name: "A", freq: 440.00 },
//   { name: "A#", freq: 466.16 },
//   { name: "B", freq: 493.88 },
//   { name: "C", freq: 523.25 }
// ];

// const keyboard = document.getElementById("keyboard");

// Create keys for the keyboard
notes.forEach((note, idx) => {
  const key = document.createElement("div");
  key.className = "key";
  key.textContent = note.name;

  // Black keys (C#, D#, F#, G#, A#) have special styling
  if (note.name.includes("#")) {
    key.classList.add("black");
  }

  // Add PointerEvent handlers
  key.addEventListener("pointerdown", () => {
    key.classList.add("active");
    synth.playNote({
      frequency: note.freq,
      duration: 1,
      velocity: 0.5
    });
  });

  key.addEventListener("pointerup", () => {
    key.classList.remove("active");
  });

  // Add mouse and touch events
  key.addEventListener("mousedown", () => {
    key.classList.add("active");
    synth.playNote({
      frequency: note.freq,
      duration: 1,
      velocity: 0.5
    });
  });

  key.addEventListener("mouseup", () => {
    key.classList.remove("active");
  });

  key.addEventListener("touchstart", () => {
    key.classList.add("active");
    synth.playNote({
      frequency: note.freq,
      duration: 1,
      velocity: 0.5
    });
  });

  key.addEventListener("touchend", () => {
    key.classList.remove("active");
  });

  keyboard.appendChild(key);
});

// Keyboard events for physical keyboard support
document.addEventListener("keydown", (event) => {
  const note = getNoteFromKey(event.key.toUpperCase());
  if (note) {
    synth.playNote({
      frequency: note.freq,
      duration: 1,
      velocity: 0.5
    });

    // Highlight corresponding key on visual keyboard
    const key = Array.from(keyboard.children).find(
      (k) => k.textContent === note.name || (k.classList.contains("black") && k.textContent === note.name)
    );
    if (key) {
      key.classList.add("active");
    }
  }
});

document.addEventListener("keyup", (event) => {
  const note = getNoteFromKey(event.key.toUpperCase());
  if (note) {
    // Stop the sound (for now, we use a simple strategy to stop immediately)
    synth.stopAll();

    // Remove visual highlight
    const key = Array.from(keyboard.children).find(
      (k) => k.textContent === note.name || (k.classList.contains("black") && k.textContent === note.name)
    );
    if (key) {
      key.classList.remove("active");
    }
  }
});

function getNoteFromKey(key) {
  const noteMap = {
    "A": { name: "A", freq: 440.00 },
    "W": { name: "A#", freq: 466.16 },
    "S": { name: "B", freq: 493.88 },
    "D": { name: "C", freq: 261.63 },
    "R": { name: "C#", freq: 277.18 },
    "F": { name: "D", freq: 293.66 },
    "T": { name: "D#", freq: 311.13 },
    "G": { name: "E", freq: 329.63 },
    "H": { name: "F", freq: 349.23 },
    "U": { name: "F#", freq: 369.99 },
    "J": { name: "G", freq: 392.00 },
    "I": { name: "G#", freq: 415.30 },
    "K": { name: "A", freq: 440.00 },
    "O": { name: "A#", freq: 466.16 },
    "L": { name: "B", freq: 493.88 },
    ";": { name: "C", freq: 523.25 }
  };
  return noteMap[key];
}
