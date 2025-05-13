import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { utils } = ham;

class BaseObject extends EventTarget {
  #id;
  #objectType;
  
  constructor(objectType, options = {}) {
    if (!objectType) throw new Error('Object Type not defined in BaseObject Subclass');
    super();
    
    this.#objectType = objectType;
    
    this.#id = BaseObject.#generateId();
  }
  
  get objectType() { return this.#objectType }
  
  get id() { return this.#id }
  
  static #generateId(objectType) { return (objectType.slice(0, 1).toLowerCase() || 'o') + utils.uuid(); }
  
  on(type, handler) {
    this.addEventListener(type, handler);
  }
  
  off(type, handler) {
    this.removeEventListener(type, handler);
  }
  
  emit(type, detail = {}) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }
}

class Feature extends BaseObject {
  constructor(name) {
    super();
    this.name = name ??
      this.constructor.name.replace('Feature', '').toLowerCase();
  }
  
  attach(entity) {
    this.entity = entity;
    this.init();
  }
  
  init() {}
  remove() {}
}

class Entity extends BaseObject {
  constructor() {
    super();
    this.features = new Map();
  }
  
  addFeature(name, featureInstance) {
    featureInstance.attach(this);
    this.features.set(name, featureInstance);
    this.emit('featureAdded', { name, feature: featureInstance });
  }
}