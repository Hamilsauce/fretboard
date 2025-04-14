// Dictionary to map notes to their frequencies
const noteFrequency = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'B': 493.88
};

// Function to generate a chord from given root note and chord type
function generateChord(rootNote, chordType) {
  const intervals = {
    'major': [0, 4, 7],
    'minor': [0, 3, 7],
    'diminished': [0, 3, 6],
    'augmented': [0, 4, 8],
    'major7': [0, 4, 7, 11],
    'minor7': [0, 3, 7, 10],
    'dominant7': [0, 4, 7, 10]
  };
  
  const rootFrequency = noteFrequency[rootNote];
  
  // Generate the chord by adding the intervals to the root note's frequency
  const chord = intervals[chordType]
    .map(interval => rootFrequency * Math.pow(2, interval / 12));
  return chord;
}

// Example usage:
const rootNote = 'C';
const chordType = 'major';
const chord = generateChord(rootNote, chordType);
console.log(`Chord: ${chord}`);

// To generate a triangle wave oscillation at 440 Hz in JavaScript, you can use the Web Audio API. Here's a simple example:

// ```javascript
// Create an audio context
const audioContext = new(window.AudioContext || window.webkitAudioContext)();

// Create an OscillatorNode
const oscillator = audioContext.createOscillator();
const gain = audioContext.createGain();
gain.gain.value = 0.1
oscillator.type = 'triangle'; // Set oscillator type to triangle wave
oscillator.frequency.setValueAtTime(200, audioContext.currentTime); // Set frequency to 440 Hz
oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.5); // Set frequency to 440 Hz

// Connect the oscillator to the audio output (speaker)
oscillator.connect(gain);
gain.connect(audioContext.destination);

// Start the oscillator
oscillator.start();

// Stop the oscillator after some time (e.g., 1 second)
setTimeout(() => {
  oscillator.stop();
}, 10000);
// ```

// This code creates an audio context, creates an oscillator node with a triangle waveform, sets its frequency to 440 Hz, connects it to the audio output (speakers), starts the oscillator, and stops it after 1 second. This will generate a triangle wave oscillation at 440 Hz. Adjust the `setTimeout` duration to control how long the sound plays.
const setman = new Set()
setman

// E7
// E7
// G
// G
// A
// A
// D
// D
// E7
// E7
// G
// G
// A7
// A7