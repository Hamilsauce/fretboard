
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
