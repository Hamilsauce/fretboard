export class AudioNote {
  #velocity;
  
  constructor(audioCtx, { type = "sine" } = {}) {
    this.audioCtx = audioCtx;
    this.type = type;
    
    this.startTime = audioCtx.currentTime;
    this.durationTime = 1;
    this.#velocity = 1.0;
    this.frequency = 440;
    
    this._osc = null;
    this._gain = null;
  }
  
  at(time) {
    this.startTime = time;
    return this;
  }
  
  frequencyHz(freq) {
    this.frequency = freq;
    return this;
  }
  
  duration(seconds) {
    this.durationTime = seconds;
    return this;
  }
  
  velocity(value) {
    this.#velocity = value;
    return this;
  }
  
  play() {
    const { audioCtx, startTime, durationTime, frequency } = this;
    const velocity = this.#velocity
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = this.type;
    osc.frequency.setValueAtTime(frequency, startTime);
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(velocity, startTime + 0.01); // quick fade-in
    gain.gain.setValueAtTime(velocity, startTime + durationTime - 0.01);
    gain.gain.linearRampToValueAtTime(0.0, startTime + durationTime); // fade-out
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + durationTime);
    
    this._osc = osc;
    this._gain = gain;
    
    return this;
  }
}