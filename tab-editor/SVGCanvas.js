import { TransformList } from '../src/features/graphic/TransformList.js';
import { Eventer } from '../tab-editor/Eventer.js';
import { GraphicObject } from '../tab-editor/graphics.object.js';
export class SvgApi extends Eventer {
  #self;
  #transformList;
  #viewBox;
  #layers = new Map();
  
  constructor(svg) {
    super()
    this.#self = svg
    this.#transformList = new TransformList(this.#self, this.#self)
    this.#viewBox = this.dom.viewBox.baseVal
  }
  
  initializeCanvas(config = DEFAULT_CANVAS_CONFIG) {
    Object.assign(this, config)
  }
  
  getPoint(element, x, y) {
    return new DOMPoint(x, y).matrixTransform(
      element.getScreenCTM().inverse()
    );
  }
  
  setViewBox(x, y, width, height) {
    this.viewBox = { x, y, width, height };
  }
  
  setSize(width, height) {
    this.width = width
    this.height = height
  }
  
  setOrigin(viewPoint = 'center') {
    this.#viewBox.originCenter(this.width, this.height)
  }
  
  orginToCenter() {
    this.#viewBox.originCenter(this.width, this.height)
  }
  
  setScale(x, y) {}
  
  setTranslate(x, y) {
    this.#transformList.setTranslate(x, y)
  }
  
  setPosition(x, y) {}
  
  append(...el) {
    this.append(...el);
  }
  
  drawRect(vector) {
    const rect = document.createElementNS(this.namespaceURI, 'rect')
    rect.setAttribute('x', vector.p1.x)
    rect.setAttribute('y', vector.p1.y)
    rect.setAttribute('width', vector.p2.x - vector.p1.x)
    rect.setAttribute('height', vector.p2.y - vector.p1.y)
  }
  
  drawCircle(x = 0, y = 0, r = 100, fill = '#FF00FF', stroke = '#000000') {
    const c = document.createElementNS(this.namespaceURI, 'circle')
    c.setAttribute('cx', x)
    c.setAttribute('cy', y)
    c.setAttribute('r', r)
    c.setAttribute('fill', 'red')
    c.setAttribute('fill', 'red')
    c.setAttribute('stroke', stroke)
    
    // c.setAttribute('stroke-width', strokeWidth||1)
    
    this.#self.appendChild(c)
  }
  
  makeDraggable(el) {
    const stopDrag = draggable(this.#self, el);
    
    el.dataset.draggable = true;
    
    el.removeDrag = () => {
      stopDrag()
      el.dataset.draggable = false;
    }
  }
  
  querySelector(selector) {
    return this.dom.querySelector(selector)
  }
  
  createSVGTransform() {
    return this.dom.createSVGTransform()
  }
  
  createTransformList(el) {
    return new TransformList(this, el)
  }
  
  createGraphicsObject(type, options) {
    const template = this.getTemplate(type, options)
    return new GraphicObject(this, template, { type })
  }
  
  getGraphicsFeature() {}
  
  getTemplate(type, options = {}) {
    const template = this.querySelector('#templates')
      .querySelector(`[data-template="${type}"]`)
      .cloneNode(true)
    
    Object.assign(template, options || {})
    
    template.dataset.type = type;
    template.removeAttribute('data-template');
    delete template.dataset.template;
    
    return template;
  }
  
  
  // get transformList() { return this.#self.transform.baseVal };
  
  // set transforms(newValue) { this._transforms = newValue };
  
  // set background(newValue) { this.#self.style.background = newValue };
  
  // get viewBox() { return this.#self.viewBox.baseVal }
  set viewBox({ x, y, width, height }) {
    Object.assign(this.#viewBox, { x: x || 0, y: y || 0, width: width || 0, height: height || 0 })
  }
  
  get namespaceURI() { return 'http://www.w3.org/2000/svg' }
  
  get dataset() { return this.#self.dataset }
  
  get dom() { return this.#self }
  
  set dataset(val) { Object.entries(val).forEach(([prop, value]) => this.#self.dataset[prop] = value) }
  
  get classList() { return this.#self.classList }
  
  set classList(val) { this.#self.classList.add(...val) }
  
  get draggables() { return [...this.#self.querySelectorAll('[data-draggable="true"]')] }
  
  get layers() { return [...this.#self.querySelectorAll('[data-layer="true"]')] }
  
  // set background(val) { this.layers[0].querySelector('.face').style.fill = val }
  
  get id() { return this.#self.id }
  
  set id(val) { this.#self.id = val }
  
  get width() { return this.#self.width.baseVal.value };
  
  set width(newValue) { this.#self.width.baseVal.value = newValue };
  
  get height() { return this.#self.height.baseVal.value };
  
  set height(newValue) { this.#self.height.baseVal.value = newValue };
}