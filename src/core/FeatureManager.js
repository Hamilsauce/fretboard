export class FeatureManager extends Map {
  #entity;
  #boundKeys;
  
  constructor(entity) {
    super();
    this.#entity = entity;
    this.#boundKeys = new Map();
  }
  
  get entity() { return this.#entity }

  get boundKeys() { return this.#boundKeys }
  
  add(name, feature, options = { bindProps: true }) {
    if (this.has(name)) {
      throw new Error(`Feature "${name}" already added.`);
    }
    
    this.set(name, feature);
    
    if (options.bindProps && typeof feature === 'object') {
      const bound = [];
      
      for (const key of Object.keys(feature)) {
        if (typeof this.entity[key] === 'undefined') {
          Object.defineProperty(this.entity, key, {
            get: () => feature[key],
            configurable: true,
            enumerable: false,
          });
          bound.push(key);
        }
      }
      
      this.boundKeys.set(name, bound);
    }
    
    return this;
  }
  
  alias(name, aliasMap = {}) {
    const feature = this.get(name);
    if (!feature) throw new Error(`No feature named "${name}"`);
    
    const bound = [];
    
    for (const [sourceKey, aliasName] of Object.entries(aliasMap)) {
      if (typeof feature[sourceKey] === 'undefined') {
        throw new Error(`Feature "${name}" has no property "${sourceKey}"`);
      }
      
      Object.defineProperty(this.entity, aliasName, {
        get: () => feature[sourceKey],
        configurable: true,
        enumerable: false,
      });
      
      bound.push(aliasName);
    }
    
    const existing = this.boundKeys.get(name) || [];
    this.boundKeys.set(name, [...existing, ...bound]);
  }
  
  remove(name) {
    const feature = this.get(name);
    if (!feature) return;
    
    if (typeof feature.remove === 'function') {
      feature.remove();
    }
    
    const boundKeys = this.boundKeys.get(name);
    if (boundKeys) {
      for (const key of boundKeys) {
        delete this.entity[key];
      }
      this.boundKeys.delete(name);
    }
    
    this.delete(name);
  }
}