import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
const { DOM, utils } = ham;

const getTemplate = (name) => {
  return document.querySelector(`[data-template="${name}"]`)
    .content.firstElementChild
    .cloneNode(true);
}

// export const ComponentOptions = {
//   templateName: 'map',
//   // elementProperties: ElementProperties,
//   children: [],
// }

export class Component extends EventEmitter {
  #self;
  #context;
  #type;
  #name;
  #components = {};
  
  constructor(context, type, options) {
    super();
    
    this.#context = !!context ? context : document
    
    if (!type) throw new Error('No type passed to constructor for ', this.constructor.name);
    
    if (!(!!context)) {
      this.#self = Component.getTemplate(document, type);
      
      const ph = Component.getPlaceholder(document, type)
      
      ph.replaceWith(this.#self)
    }
    
    else if (options) {
      this.#self = Component.getTemplate(this.#context, type);
    }
    
    else this.#self = Component.getTemplate(this.#context, type);
    
    if (!this.#self) throw new Error('Failed to find/load a component class template. Class/template type: ' + type);
    
    this.#type = type;
    
    this.dataset.id = Component.uuid(type);
    this.self.id = options.id ? options.id : this.dataset.id
  }
  
  get self() { return this.#self };
  
  
  get components() { return this.#components };
  
  get dom() { return this.#self };
  
  get dataset() { return this.self.dataset };
  
  get textContent() { return this.self.textContent };
  
  set textContent(v) { this.dom.textContent = v }
  
  get id() { return this.#self.id };
  
  get name() { return this.#name };
  
  static getPlaceholder(context, name) { return context.querySelector(`[data-component-placeholder="${name}"]`); }
  
  static createObjectTemplate(context, type) {
    const container = context.templates.querySelector('.object-container').cloneNode(true);
    
    const obj = context.templates.querySelector(`[data-object-type="${objectType}"]`).cloneNode(true);
    
    container.dataset.objectType = objectType;
    container.dataset.type = objectType;
    
    container.querySelector('.object-slot').append(obj)
    
    return container;
  }
  
  static getTemplate(context, type, options) {
    let template;
    if (context instanceof SVGElement || context.dom instanceof SVGElement) {
      template = context.templates.querySelector(`[data-template="${type}"]`).cloneNode(true);
     
      delete template.dataset.template;
      
      if (options) Object.assign(template, options);
      
      template.dataset.component = type;
    }
    
    else if (context.dom instanceof HTMLElement || context instanceof HTMLDocument || context === document) {
      template = getTemplate(type);
    }
    
    if (!template) throw new Error('Failed to find/load a component class template. Class/template name: ' + type);
    
    template.dataset.type = type;
    
    return template;
  }
  
  static insertComponent(context, name, options) {
    const placeholder = Component.getPlaceholder(context, name);
    
    const component = new options.componentClass(context, options)
    
    context.components[name] = component;
    
    placeholder.replaceWith(component.dom);
    
    return context.components[name];
  }
  
  static uuid(name) {
    return (name.slice(0, 1).toLowerCase() || 'o') + utils.uuid();
  }
  
  create() {
    throw 'Must define create in child class of component. Cannot call create on Component Class. '
  }
  
  init(options) {
    throw 'Must define init in child class of component. Cannot call create on Component Class. '
  }
  
  querySelector(selector) {
    return this.self.querySelector(selector);
  }
  
  querySelectorAll(selector) {
    return [...this.self.querySelectorAll(selector)];
  }
  
  append(...elements) {
    return this.self.append(...elements);
  }
  
  replaceChild(newChild, child) {
    this.self.replaceChild(newChild, child)
  }
  
  selectDOM(selector) {
    const result = [...this.#self.querySelectorAll(selector)];
    
    return result.length === 1 ? result[0] : result;
  }
};