export const sleep = async (time = 500, cb) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null); // Yay! Everything went well!
    }, time);
  });
  
};



 const audioCtx = new AudioContext()

export const playPulse = async(timeMod = 0, pulseHz = 440) => {
  let time = audioCtx.currentTime
  
  const osc = new OscillatorNode(audioCtx, {
    type: "sine",
    frequency: 440,
  });
  
  // osc.frequency.setValueAtTime(pulseHz, time)
  
  const amp = new GainNode(audioCtx, { value: 0.2 });
  // amp.gain.setValueAtTime(0.2, time + timeMod)
  
  // const lfo = new OscillatorNode(audioCtx, {
  //   type: "square",
  //   frequency: 1,
  // });
  
  // lfo.connect(amp.gain);
  // amp.gain.exponentialRampToValueAtTime(0.3, time + 1)
  osc.connect(amp).connect(audioCtx.destination);
  
  // lfo.start();
  osc.start(time + timeMod)
  osc.stop(time + timeMod+0.1)
  
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