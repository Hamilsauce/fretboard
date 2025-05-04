export const sleep = async (time = 500, cb) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null); // Yay! Everything went well!
    }, time);
  });
  
};



const audioCtx = new AudioContext()
let lastOsc;
let lastGain;

export const playPulse = async (timeMod = 0, pulseHz = 440) => {
  let time = audioCtx.currentTime
  
  const osc = new OscillatorNode(audioCtx, {
    type: "sine",
    frequency: 220,
  });
  
  // osc.frequency.setValueAtTime(pulseHz, time)
  
  const amp = new GainNode(audioCtx, { value: 0.1 });
  
  // amp.gain.setValueAtTime(0.2, time + timeMod)
  
  // const lfo = new OscillatorNode(audioCtx, {
  //   type: "square",
  //   frequency: 1,
  // });
  // audioCtx.
  // lfo.connect(amp.gain);
  
  if (lastGain) {
    lastGain.gain.cancelScheduledValues(time+0.1)
    // lastOsc.frequency.cancelScheduledValues(time+0.025)
    lastGain.gain.exponentialRampToValueAtTime(0.01, time+0.1)
    lastOsc.stop(time+0.1)
    
    // osc.stop(time)
  }
  
  // lastGain = amp
 
    lastGain = amp
    lastOsc = osc

  osc.frequency.exponentialRampToValueAtTime(440, time + 0.2)
  osc.frequency.exponentialRampToValueAtTime(220, time + 0.3)
  
  amp.gain.exponentialRampToValueAtTime(0.3, time + 0.2)
  amp.gain.exponentialRampToValueAtTime(0.001, time + 0.3)
  amp.gain.cancelAndHoldAtTime(time + 0.3)
  
  
  osc.connect(amp).connect(audioCtx.destination);
  console.log('timeMod', timeMod)
  // lfo.start();&& 
  
  
  osc.start(time + timeMod)
  osc.stop(time + timeMod + 0.3)
  
  // return await sleep(timeMod)
  // return (pulseTime = 1) => {
  //   time = audioCtx.currentTime
  
  //   // osc.frequency.cancelAndHoldAtTime(time)
  //   osc.frequency.exponentialRampToValueAtTime(1, time)
  //   amp.gain.exponentialRampToValueAtTime(0.1, time + 1)
  //   // amp.gain.cancelScheduledValues(time+1)
  //   // osc.frequency.cancelScheduledValues(time)
  
  
  //   osc.stop(time + 1)
  // }
}