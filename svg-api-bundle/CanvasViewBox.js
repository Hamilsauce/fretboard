export class CanvasViewBox {
  constructor(svg) {
    this.svg = svg;
    this.init();
  }

  originCenter(w = this.width, h = this.height) {
    this.x = -(w / 2);
    this.y = -(h / 2);
  }

  originTopLeft() {
    this.x = 0;
    this.y = 0;
  }

  get #self() { return this.svg.viewBox.baseVal };

  get x() { return this.#self.x };
  set x(x) { Object.assign(this.#self, { x }) };

  get y() { return this.#self.y }
  set y(y) { Object.assign(this.#self, { y }) }

  get width() { return this.#self.width };
  set width(width) { Object.assign(this.#self, { width }) };

  get height() { return this.#self.height };
  set height(height) { Object.assign(this.#self, { height }) };


  init(initialValues = {}) {}
}
