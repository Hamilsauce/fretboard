import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { utils } = ham;

export class BaseObject extends EventTarget {
  #id;
  #objectType;
  #name
  
  constructor(objectType, options = {}) {
    if (!objectType) throw new Error('Object Type not defined in BaseObject Subclass');
    
    super();
    
    const { name } = options;
    
    this.#objectType = objectType.toLowerCase();
    
    this.#id = BaseObject.#generateId(objectType);
    
    this.#name = name ?? this.constructor.name
      .toLowerCase()
      .replace(this.objectType, '').toLowerCase();
  }
  
  get objectType() { return this.#objectType }
  
  get id() { return this.#id }
  
  get name() { return this.#name }
  
  // set name(name) { this.#name = this.#name ? this.#name : name; }
  
  // static Event = class extends Event {
  //   constructor(){
  //     super('feature:event')
  //   }
  // };
  
  static #generateId(objectType) { return (objectType.slice(0, 1).toLowerCase() || 'o') + utils.uuid(); }
  
  on(type, handler) {
    this.addEventListener(type, handler);
  }
  
  off(type, handler) {
    this.removeEventListener(type, handler);
  }
  
  emit(type, detail = {}) {
    
    // this.dispatchEvent(new Feature.Event())
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }
}

export class Feature extends BaseObject {
  constructor(name, options) {
    super('feature', { name });
  }
  
  attach(entity) {
    this.entity = entity;
    this.init();
  }
  
  init() {}
  
  remove() {}
}

class Entity extends BaseObject {
  #features = new Map();
  
  constructor(name, options = {}) {
    super('entity', { name });
  }
  
  get features() { return this.#features }
  
  addFeature(name, featureInstance) {
    featureInstance.attach(this);
    this.features.set(name, featureInstance);
    this.emit('featureAdded', { name, feature: featureInstance });
  }
}