// --- Audio Context Singleton ---
const getAudioContext = (() => {
  let audioCtx;
  return () => {
    if (!audioCtx) audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  };
})();

// --- BaseEntity Class ---
class BaseEntity {
  constructor({ id, point = { x: 0, y: 0 }, note = {} }) {
    this.id = id || `entity-${Math.random().toString(36).slice(2)}`;
    this.point = point;
    this.note = note;
    this.features = new Set();
    this.dom = this.createDOM();
  }
  
  createDOM() {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    el.setAttribute('cx', this.point.x);
    el.setAttribute('cy', this.point.y);
    el.setAttribute('r', 10);
    el.setAttribute('fill', 'lightblue');
    el.addEventListener('click', () => this.play?.());
    return el;
  }
  
  addFeature(featureFn) {
    featureFn(this);
    this.features.add(featureFn.name);
  }
}

// --- AudioFeature Mixin ---
function AudioFeature(entity) {
  const audioCtx = getAudioContext();
  
  entity.play = (velocity = 1.0) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = entity.note.frequency || 440;
    gain.gain.value = velocity;
    
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
    
    entity._osc = osc;
  };
}

// --- AgentFeature Mixin ---
function AgentFeature(entity) {
  entity.brain = {
    tick(time) {
      if (time % 10 === 0) entity.play?.(0.6);
    }
  };
}

// --- Scheduler ---
class Scheduler {
  constructor() {
    this.agents = new Set();
    this.time = 0;
    this._interval = null;
  }
  
  add(agent) {
    this.agents.add(agent);
  }
  
  tick() {
    this.agents.forEach(agent => agent.brain?.tick(this.time));
    this.time++;
  }
  
  start(intervalMs = 100) {
    this._interval = setInterval(() => this.tick(), intervalMs);
  }
  
  stop() {
    clearInterval(this._interval);
  }
}

// --- Demo Setup ---
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute('width', 600);
svg.setAttribute('height', 200);
document.body.appendChild(svg);

const scheduler = new Scheduler();
scheduler.start();

const notes = [261.63, 293.66, 329.63]; // C4, D4, E4

notes.forEach((freq, i) => {
  const entity = new BaseEntity({
    point: { x: 100 + i * 100, y: 100 },
    note: { frequency: freq },
  });
  
  entity.addFeature(AudioFeature);
  entity.addFeature(AgentFeature);
  scheduler.add(entity);
  
  svg.appendChild(entity.dom);
});