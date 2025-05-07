export const scheduleOscillator = ({
  audioCtx,
  type = "sine",
  detune = 0,
  frequencyAutomation = [],
  gainAutomation = [],
  startDelay = 0.1,
  stopAfter = 4,
  destination = audioCtx.destination
}) => {
  // destination = destination ?? audioCtx.destination
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  const now = audioCtx.currentTime;
  const startTime = now + startDelay;
  
  // Oscillator config
  osc.type = type;
  osc.detune.setValueAtTime(detune, now);
  
  // Connect nodes
  osc.connect(gain);
  gain.connect(destination);
  
  // Frequency automation
  frequencyAutomation.forEach(event => {
    const t = startTime + event.time;
    const param = osc.frequency;
    
    switch (event.type) {
      case "setValue":
        param.setValueAtTime(event.value, t);
        break;
      case "linearRamp":
        param.linearRampToValueAtTime(event.value, t);
        break;
      case "exponentialRamp":
        param.exponentialRampToValueAtTime(event.value, t);
        break;
      case "setTarget":
        param.setTargetAtTime(event.target, t, event.timeConstant);
        break;
      case "valueCurve":
        param.setValueCurveAtTime(event.curve, t, event.duration);
        break;
    }
  });
  
  // Gain automation
  gainAutomation.forEach(event => {
    const t = startTime + event.time;
    const param = gain.gain;
    
    switch (event.type) {
      case "setValue":
        param.setValueAtTime(event.value, t);
        break;
      case "linearRamp":
        param.linearRampToValueAtTime(event.value, t);
        break;
      case "exponentialRamp":
        param.exponentialRampToValueAtTime(event.value, t);
        break;
      case "setTarget":
        param.setTargetAtTime(event.target, t, event.timeConstant);
        break;
      case "valueCurve":
        param.setValueCurveAtTime(event.curve, t, event.duration);
        break;
    }
  });
  
  osc.start(startTime);
  osc.stop(startTime + stopAfter);
  
  return { osc, gain };
}