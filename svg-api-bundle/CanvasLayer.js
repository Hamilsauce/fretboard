import { CanvasElement } from './CanvasElement.js';
console.log('CANNY LAYET');
export class CanvasLayer extends CanvasElement {
  constructor(name, options) {
    console.log('options', options)
    if (!options) return;
    super('canvas-layer')

    this.self.id = name;
    this.x = options.x
    this.y = options.y
    this.width = options.width
    this.height = options.height
  };

  setSize(width, height) {
    this.width = width
    this.height = height
  }


  setPoint(pt = new DOMPoint()) {
    const cpt = this.toCanvasPoint(pt);
    this.x = cpt.x
    this.y = cpt.y;
  }

  setAttribute(name, value) {
    if (!name) return;

    this.backgroundRect.setAttribute(name, value)

    return this.self
  }

  get x() { return this.backgroundRect.x.baseVal.value };
  set x(newValue) { this.backgroundRect.x.baseVal.value = newValue };

  get y() { return this.backgroundRect.y.baseVal.value };
  set y(newValue) { this.backgroundRect.y.baseVal.value = newValue };

  get width() { return this.backgroundRect.width.baseVal.value };
  set width(newValue) { this.backgroundRect.width.baseVal.value = newValue };
  get height() { return this.backgroundRect.height.baseVal.value };
  set height(newValue) { this.backgroundRect.height.baseVal.value = newValue };


  get backgroundRect() { return this.self.querySelector('.canvas-layer--background') };
  get layerObjects() { return this.self.querySelector('.canvas-layer--objects') };
}