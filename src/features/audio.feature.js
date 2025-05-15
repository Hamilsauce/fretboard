export class AudioFeature extends EventTarget {
  constructor(audioContext, entity, { pitch, gain = 0.2 } = {}) {
    super();
    this.entity = entity;
    this.context = audioContext;
    
    this.oscillator = this.context.createOscillator();
    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = gain;
    
    this.oscillator.connect(this.gainNode).connect(this.context.destination);
    this.setPitch(pitch || 440);
  }
  
  setPitch(freq) {
    this.oscillator.frequency.setValueAtTime(freq, this.context.currentTime);
  }
  
  start() {
    this.oscillator.start();
    this.dispatchEvent(new CustomEvent('started'));
  }
  
  stop() {
    this.oscillator.stop();
    this.dispatchEvent(new CustomEvent('stopped'));
  }
  
  dispose() {
    try {
      this.stop();
    } catch {}
    this.oscillator.disconnect();
    this.gainNode.disconnect();
  }
}