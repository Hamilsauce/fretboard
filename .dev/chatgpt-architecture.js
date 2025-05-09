// BaseObject: the shared EventTarget subclass
export class BaseObject extends EventTarget {
  constructor() {
    super();
  }
  
  emit(type, detail = {}) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }
  
  on(type, handler) {
    this.addEventListener(type, handler);
  }
  
  off(type, handler) {
    this.removeEventListener(type, handler);
  }
}

// Feature class
export class Feature extends BaseObject {
  #entity;
  constructor(entity) {
    super();
    this.#entity = entity;
  }
  
  get entity() { return this.#entity }
  
  onAttach() {
    throw 'Must define onAttach in subclass of Feature.'
  }
  onRemove() {
    throw 'Must define onRemove in subclass of Feature.'
  }
}

// FeatureManager class
export class FeatureManager extends Map {
  constructor(entity) {
    super();
    this.entity = entity;
  }
  
  add(featureClassOrName, featureClass) {
    const name = typeof featureClassOrName === 'string' ?
      featureClassOrName :
      featureClassOrName.name.replace(/Feature$/, '').toLowerCase();
    
    
    
    const feature = new(featureClass ?? featureClassOrName)(this.entity);
    
    if (this.has(name)) this.remove(name);
    
    this.set(name, feature);
    feature.onAttach();
    return feature;
  }
  
  remove(name) {
    const feature = this.get(name);
    if (feature) {
      feature.onRemove();
      this.delete(name);
    }
  }
  
  getByEvent(eventType) {
    return [...this.values()].filter(f => f.eventTypes?.includes(eventType));
  }
}

// Entity class
export class Entity extends BaseObject {
  constructor() {
    super();
    this.features = new FeatureManager(this);
  }
  
  addFeature(featureClass) {
    const feature = this.features.add(featureClass);
    
    // Route feature events to the entity
    feature.on('*', (e) => {
      this.emit(e.type, { ...e.detail, source: feature });
    });
    
    return feature;
  }
  
  removeFeature(name) {
    this.features.remove(name);
  }
  
  hasFeature(name) {
    return this.features.has(name);
  }
}

// Usage example:
// class HoverFeature extends Feature {
//   onAttach() {
//     this.entity.on('pointerenter', () => this.emit('hover:start'));
//     this.entity.on('pointerleave', () => this.emit('hover:end'));
//   }
// }