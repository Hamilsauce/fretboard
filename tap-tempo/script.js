// import { TRANSCRIPTION_RAW } from './TRANSCRIPTION_RAW.js';
// console.warn('TRANSCRIPTION_RAW', TRANSCRIPTION_RAW)
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { playPulse, sleep } from '../tap-tempo/audio.js';

const ONE_MINUTE = 60;
const DEFAULT_BPM = 120;
const { template, utils, DOM } = ham;

class UI {
  #self;
  #beatMarkers;
  
  constructor(rootSelector = '#app') {
    this.#self = document.querySelector('#app');
    this.tapIndicator = document.querySelector('#tap-indicator');
    this.messageDisplay = document.querySelector('#app-message');
    this.#beatMarkers = document.querySelectorAll('.beat-marker');
    
    if (!this.#self) throw new Error('no app!')
  }
  
  get self() { return this.#self }
  
  get taps() {}
  
  get beatMarkers() { return [...this.#beatMarkers]; }
  
  get activeBeats() { return this.beatMarkers.filter((el, i) => el.dataset.active === 'true'); }
  get inactiveBeats() { return this.beatMarkers.filter((el, i) => el.dataset.active === 'false'); }
  
  setMessage(msg) {
    if (!msg) return;
    this.messageDisplay.textContent = msg
    return this
  }
  
  handleTap(updateBeats = false) {
    this.tapIndicator.dataset.on = true;
    
    this.#self.classList.toggle('dim');
    
    setTimeout(() => {
      this.tapIndicator.dataset.on = false;
      this.#self.classList.toggle('dim');
    }, 75);
    
    if (updateBeats) {
      this.updateBeatMarkers();
    }
    
    return this;
  }
  
  updateBeatMarkers() {
    const beatCount = this.activeBeats.length;
    console.warn('beatCount', beatCount)
    if (beatCount >= 4) {
      this.beatMarkers.forEach((el, i) => {
        el.dataset.active = i === 0 ? true : false;
      });
    } else {
      const beat = this.inactiveBeats[0];
      beat.dataset.active = true;
    }
    
    return this;
  }
}

class AppState {
  constructor() {}
  
  get appMessage() {}
  
  get taps() {}
}


const ui = new UI('#app')




let tapTimes = [];

const bpmToTimeIntervals = (bpm = 120, beatCount = 4) => {
  const beatInterval = ONE_MINUTE / bpm;
  return new Array(beatCount).fill(beatInterval).map((int, i) => int * i);
};

const intervalsToBPM = (taps = tapTimes) => {
  const totalInterval = tapTimes.slice(1).reduce((sum, time, i) => {
    return sum + (time - tapTimes[i]);
  }, 0);
  
  const averageInterval = totalInterval / (taps.length - 1);
  
  const bpm = Math.round(60000 / averageInterval);
  
  return bpm;
};

const tap = () => {
  tapTimes = tapTimes.length >= 4 ? [] : tapTimes;
  const now = performance.now();
  tapTimes.push(now);
  
  if (tapTimes.length > 1) {
    // const totalInterval = tapTimes.slice(1).reduce((sum, time, i) => {
    //   return sum + (time - tapTimes[i]);
    // }, 0);
    // const averageInterval = totalInterval / (tapTimes.length - 1);
    const bpm = intervalsToBPM(tapTimes) // Math.round(60000 / averageInterval);
    return bpm;
    console.log(`BPM: ${bpm.toFixed(2)}`);
  } else {
    console.log("Tap again to calculate BPM...");
    
    return null
  }
}

const rawText = await (
  await fetch('./raw.txt')
).text();



const runMetch = (timeIntervals = []) => {
  const duration = timeIntervals.reduce((acc, curr, i) => acc + curr, 0) * 1000;
  let index = 0
  let currInterval = timeIntervals[index] * 1000
  let targetBPM = DEFAULT_BPM
  let targetIntervals = bpmToTimeIntervals(targetBPM)
  
  ui
    .setMessage(`Target BPM: ${targetBPM}`)
    .updateBeatMarkers.bind(ui)()
  
  index = index >= targetIntervals.length - 1 ? 0 : index + 1
  
  console.log('targetIntervals', targetIntervals)
  
  const id = setInterval(() => {
    targetIntervals.forEach(async (int, i) => {
      
      playPulse(int * 1000)
    });
    
    ui.updateBeatMarkers.bind(ui)()
    
    index = index >= targetIntervals.length - 1 ? 0 : index + 1
    
    currInterval = targetIntervals[index] * 1000
    
  }, duration / 4)
  
  return id
};


const app = document.querySelector('#app') //.append(contentEl);
const indicatorEl = document.querySelector('#tap-indicator') //.append(contentEl);

// const TIME_OF_LOAD = performance.now()

// let tazpTimes = []
let tempo
window.tapTimes = tapTimes
let autoMetch = true
let autoMetchId = null
const tempo120beats4 = bpmToTimeIntervals()

document.addEventListener('click', (e) => {
  tapTimes.push(performance.now())
  const isOn = indicatorEl.dataset.on === 'true' ? true : false;
  if (autoMetch && !autoMetchId) {
    autoMetchId = runMetch(tempo120beats4)
  }
  
  else {
  tempo = tap(tapTimes)
  const msg = tempo ? `${tempo} BPM` : 'Keep tapping...'
  playPulse()

  ui
    .handleTap()
    .updateBeatMarkers()
  
  if (tapTimes.length >= 4) {
    ui.setMessage(msg)
  }
  }
});