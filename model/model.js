import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils } = ham;
import { EventEmitter } from '../../lib/event-emitter.js';

export class Model extends EventEmitter {
  #name;
  #modelId;

  constructor(name) {
    super();

    if (!name) throw new Error('No name passed to constructor for ', this.constructor.name);

    this.#name = name;
    
    this.#modelId = Model.uuid(name);
  }

  static uuid(type) {
    if (type === 'deck') return 'd' + utils.uuid();
    else if (type === 'card') return 'c' + utils.uuid()
    return 'c' + utils.uuid()
  }

  get name() { return this.#name };
  
  get modelId() { return this.#modelId };
};
