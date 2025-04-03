import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';

const { template, utils } = ham;

export class View extends EventEmitter {
  #id;
  #name;
  self = new DocumentFragment();

  constructor(name) {
    super();

    if (!name) throw new Error('No name passed to constructor for ', this.constructor.name);

    this.#name = name;

    this.#id = View.uuid(name);
    // this.self = View.getTemplateString(this.template());
    // this.self = View.#getTemplate(name);
  };

  // get self() { return this.#self };

  get dataset() { return this.self.dataset };

  get name() { return this.#name };

  get id() { return this.#id };

  static getTemplateString(str) {
    return new DOMParser().parseFromString(str,'text/html').documentElement
  }

  static #getTemplate(name) {
    return template(name);
  }

  static uuid(name) {
    return `${(name||'o').toLowerCase()}${utils.uuid()}`
  }

  render() {}

  template() {}

  append(...els) {
    this.self.append(...els)
  }
};