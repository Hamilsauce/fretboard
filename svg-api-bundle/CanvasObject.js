import { EventEmitter } from 'https://hamilsauce.github.io/event-emitter.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { utils } = ham;

export const OBJECT_TYPES = new Map(
  ['canvas', 'svg'],
  ['pixel', 'rect'],
  ['shape', { rect: 'rect', circle: 'circle' }],
  ['point', null]
)

const CanvasObjectOptions = {
  tag: String,
  graphicsProperties: Object,
  dataset: Object,
}


export class CanvasObject {// extends EventEmitter {
  #objectType;
  #name;
  #id;

  constructor(type, options) {
    // super();

    if (!type || !OBJECT_TYPES.has(type)) throw new Error('Invalid or no name or type passed to constructor for ', this.constructor.name);

    this.#id = CanvasObject.#uuid(name)

    this.#objectType = type;
  };

  get name() { return this.constructor.name.toLowerCase() };

  get id() { return this.#id };

  get type() { return this.#objectType };

  static #uuid(name) {
    return `${(name || 'o').slice(0,1).toLowerCase()}${utils.uuid()}`;
  }
};

// import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
// import { EventEmitter } from 'https://hamilsauce.github.io/event-emitter.js';
// const { template } = ham;

// export class CanvasObject extends EventEmitter {
//   #self;
//   #name;

//   constructor(name) {
//     super();

//     if (!name) throw new Error('No name passed to constructor for ', this.constructor.name);

//     this.#name = name;

//     this.#self = View.#getTemplate(name);
//   };

//   get self() { return this.#self };

//   get name() { return this.#name };

//   static #getTemplate(name) {
//     return template(name);
//   }
// };
