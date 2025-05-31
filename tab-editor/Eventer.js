export class Eventer extends Map {
  #listeners = [];
  
  constructor() {
    super();
  }
  
  #registerEvent(eventName) {
    
  }
  
  set(eventName, ...listeners) {
    if (this.has(eventName)) {
      this.get(eventName).add(...listeners);
      
      return this;
    }
    
    super.set(eventName, new Set()).get(eventName).add(...listeners);
    
    return this;
  }
  
  #registerListener(eventName, listener) {
    this.#registerEvent(eventName).add(listener);
    return this;
  }
  
  on(type, listener) {
    this.#registerListener(type, listener);
    return () => this.#unregisterListener(type, listener)
  }
  
  #unregisterListener(eventName, listener) {
    return this.get(eventName).delete(listener)
  }
  
  off(type, listener) {
    this.#unregisterListener(type, listener)
  }
  
  fire(listener, data) {
    listener(data);
    
    return true;
  }
  
  emit(evt, data) {
    if (!this.has(evt)) return;
    this.get(evt).forEach(_ => this.fire.bind(this)(_, data))
  }
}