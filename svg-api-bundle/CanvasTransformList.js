import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { pipeline, array, utils } = ham;

export class CanvasTransformList {
  #self;
  #TransformTypes = {
    translate: 'Translate',
    rotate: 'Rotate',
    scale: 'Scale',
    skew: 'Skew',
    get(k) { return this[k.toLowerCase()] ? this[k.toLowerCase()] : null }
  };

  constructor(svg) {
    this.svg = svg;
    this.#self = this.svg.transform.baseVal
    this.transforms = new Map();
    this.translate;
    this.scale;
    this.rotate;
    this.init();
  }

  init(initialValues = {}) {
    this.createTransform('translate');
    this.setTranslate(0, 0);
    this.append(this.transforms.get('translate'));

    this.createTransform('rotate');
    this.setRotate(initialValues.rotate ? initialValues.rotate : 0);
    this.append(this.transforms.get('rotate'));

    this.createTransform('scale');
    this.setScale(initialValues.scale ? initialValues.scale : 1);
    this.append(this.transforms.get('scale'));
  }

  getItem(i) { return this.#self.getItem(i) }

  setTranslate(x = 0, y = 0) {
    this.transforms.get('translate').setTranslate(x, y);
    return this;
  }

  setRotate(degrees = 0) {
    this.transforms.get('rotate').setRotate(degrees, 0, 0);
    return this;
  }

  setScale(s = 1) {
    this.transforms.get('scale').setScale(s, s);
    return this;
  }

  append(transform) {
    this.#self.appendItem(transform)
    return this
  }

  insert(transform) {
    this.#self.appendItem(transform)
    return this
  }

  createTransform(transformType = 'translate') {
    const t = this.svg.createSVGTransform();

    if (!this.transforms.has(transformType.toLowerCase())) {
      this.transforms.set(transformType.toLowerCase(), t)
    }

    return t;
  }

  // get #self() { return this.svg.transform.baseVal };
}
