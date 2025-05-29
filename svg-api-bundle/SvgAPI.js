import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { pipeline, array, utils } = ham;

import { 
  CanvasViewBox,
  CanvasTransformList,
  svgTemplater,
  
} from './index.js';



const DEFAULT_CANVAS_CONFIG = {
  id: 'canvas',
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight,
  background: '#C7C7C7',
  viewBox: {
    x: -(window.innerWidth / 2),
    y: -(window.innerHeight / 2),
    width: window.innerWidth,
    height: window.innerHeight,
  }
}


const PatternTypes = {
  grid: 'grid',
  none: 'none',
}


export class SvgApi extends EventTarget {
  #self;
  #transformList;
  #viewBox;
  #layers = new Map();
  
  constructor(svg) {
    super()
    this.#self = svg
    this.#transformList = new CanvasTransformList(this.#self)
    this.#viewBox = new CanvasViewBox(this.#self)
  }
  
  initializeCanvas(config = DEFAULT_CANVAS_CONFIG) {
    Object.assign(this, config)
  }
  
  
  on(evt, handler) {
    this.#self.addEventListener(evt, handler)
    return () => this.#self.removeEventListener(evt, handler)
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
  
  createTransformList() {}
  
  createGraphicsObject() {}
  
  getGraphicsFeature() {}
  
  
  // get transformList() { return this.#self.transform.baseVal };
  
  set transforms(newValue) { this._transforms = newValue };
  
  set background(newValue) { this.#self.style.background = newValue };
  
  // get viewBox() { return this.#self.viewBox.baseVal }
  set viewBox({ x, y, width, height }) {
    Object.assign(this.#viewBox, { x: x || 0, y: y || 0, width: width || 0, height: height || 0 })
  }
  
  get namespaceURI() { return 'http://www.w3.org/2000/svg' }
  
  get dataset() { return this.#self.dataset }
  
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

// function transformMe(evt) {
//   // svg root element to access the createSVGTransform() function
//   var svgroot = evt.target.parentNode;

//   // SVGTransformList of the element that has been clicked on
//   var tfmList = evt.target.transform.baseVal;

//   // Create a seperate transform object for each transform
//   var translate = svgroot.createSVGTransform();
//   translate.setTranslate(50, 5);

//   var rotate = svgroot.createSVGTransform();
//   rotate.setRotate(10, 0, 0);

//   var scale = svgroot.createSVGTransform();
//   scale.setScale(0.8, 0.8);

//   // apply the transformations by appending the SVGTranform objects to the SVGTransformList associated with the element
//   tfmList.appendItem(translate);
//   tfmList.appendItem(rotate);
//   tfmList.appendItem(scale);
// }