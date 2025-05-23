import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js'
const { date, array, utils, text } = ham;

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')
const svg = document.querySelector('svg');
const surface = document.querySelector('#surface');

export const DEFAULT_CANVAS_CONFIG = {
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

export class Canvas {
  #self;
  #layers = new Map();
  constructor(svg, config = DEFAULT_CANVAS_CONFIG) {
    this.root;
    this.#self = svg || document.createElement('svg');
    this.surface = svg.querySelector('#surface') || this.createLayer('surface');
    this.objects = svg.querySelector('#objects') || this.createLayer('objects');

    const rect = document.createElementNS(this.namespaceURI,'rect')
    
    this.makeDraggable(this.surface);
    this.makeDraggable(this.objects);

    Object.assign(this, config);
    
    this.#self.addEventListener('drag', e => {
      this.handleSurfaceDrag.bind(this)(e)
    });
 
 console.log('tlist', this.transformList);
  }

  setView(x, y, width, height) {
    this.viewBox = { x, y, width, height };
  }



  translate(el, x = 0, y = 0) {
    el.setAttribute('transform', `translate(${x},${y})`)
  }

  toPoint(e) {
    let domPoint = new DOMPoint(clientX, clientY);
    domPoint = domPoint.matrixTransform(svg.getScreenCTM().inverse());
    const { clientX, clientY } = e;
    // console.log({ clientX, clientY });
    // console.log({ domPoint });
    return domPoint;
  }

  createLayer(name, zIndex = -1, options = {}) {
    const l = document.createElement(this.namespaceURI, 'g');

    l.id = name;
    Object.assign(l, options || {});

    if (zIndex === -1 || typeof zIndex != 'number') {
      this.#self.appendChild(surface);
    } else {
      this.#self.insertAdjacentElement(zIndex, l);
    }

    return l;
  }

  handleSurfaceDrag(e) {
    const xlate = this.objects.transform
    const x = +this.objects.getAttribute('x')
    const y = +this.objects.getAttribute('y')
    console.log(e.detail);
    console.warn({ xlate });
    this.objects.setAttribute('transform', `translate(${(x - -e.detail.x)},${(y - -e.detail.y)})`)
  }

  setSize(width, height) {}

  setOrigin(x, y) {}

  setScale(x, y) {}

  setPosition(x, y) {}

  drawNode(vector) {
    const rect = document.createElementNS(this.namespaceURI,'rect')
    rect.setAttribute('x', vector.p1.x)
    rect.setAttribute('y', vector.p1.y)
    rect.setAttribute('width', vector.p2.x-vector.p1.x )
    rect.setAttribute('height', vector.p2.y-vector.p1.y )
  }

  drawEdge(x, y) {}

  zoom() {}

  pan() {}

  makeDraggable(el) {
    const stopDrag = draggable(this.#self, el);
    el.dataset.draggable = true;
    el.removeDrag = () => {
      stopDrag()
      el.dataset.draggable = false;
    }
  }

  on(evt, handler) {
    this.#self.addEventListener(evt, handler)
    return () => this.#self.removeEventListener(evt, handler)
  }

  createTransform() { return this.#self.createSVGTransform() }
  
  get transformList() { return this.#self.transform.baseVal };

  get viewBox() { return this.#self.viewBox.baseVal }

  set viewBox({ x, y, width, height }) {
    Object.assign(this.viewBox, { x: x || 0, y: y || 0, width: width || 0, height: height || 0 })
  }

  get namespaceURI() { return 'http://www.w3.org/2000/svg' }

  get dataset() { return this.#self.dataset }

  set dataset(val) { Object.entries(val).forEach(([prop, value]) => this.#self.dataset[prop] = value) }

  get classList() { return this.#self.classList }

  set classList(val) { this.#self.classList.add(...val) }

  get draggables() { return [...this.#self.querySelectorAll('[data-draggable="true"]')] }

  get layers() { return [...this.#self.querySelectorAll('[data-layer="true"]')] }

  set background(val) { this.layers[0].querySelector('.face').style.fill = val }

  get id() { return this.#self.id }

  set id(val) { this.#self.id = val }

  get width() { return this.#self.width.baseVal.value };

  set width(newValue) { this.#self.width.baseVal.value = newValue };

  get height() { return this.#self.height.baseVal.value };

  set height(newValue) { this.#self.height.baseVal.value = newValue };
}




const canvas = new Canvas(svg)
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

canvas.on('dragstart', e => {
  setTimeout(() => {}, 1000)
});
