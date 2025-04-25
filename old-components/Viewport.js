import { Component } from './Component.js';
import { ObjectRegistry } from '../graphics-objects/ObjectRegistry.js';

const ViewportOptions = {
  type: 'viewport',
  name: '',
  viewport: {
    width: 412,
    height: 781,
  },
  viewBox: {
    x: 0,
    y: 0,
    width: 412,
    height: 781,
  },
  dimensions: {
    width: 412,
    height: 781,
  },
  origin: {
    x: 0,
    y: 0,
  },
  layers: {},
  objects: {},
};

export class Viewport extends Component {
  #initialOrigin = { x: -36, y: -64 };
  #viewBox = null;
  #objects = new Map();
  #domObjectMap = new Map();
  #layers = new Map([
    ['surface', null],
    ['objects', null],
  ]);

  constructor(context, name, options) {
    const { viewBox, layers, objects, ...opts } = options;

    super(context, name, { ...opts, id: name });

    this.init({ viewBox, layers });
  };

  get viewBox() { return this.self.viewBox.baseVal; }

  get initialOrigin() { return this.#initialOrigin }

  get origin() {
    return {
      x: this.viewBox.x + 36,
      y: this.viewBox.y + 64,
    }
  }

  get domObjectMap() { return this.#domObjectMap; }

  get templates() { return this.querySelector('#templates') }

  get layers() {
    return {
      surface: this.querySelector('#surface-layer'),
      objects: this.querySelector('#object-layer'),
    }
  }

  get objects() { return this.#objects }

  init({ viewBox, layers }) {
    Object.assign(this.viewBox, viewBox);

    Object.entries(layers).forEach(([name, config]) => {
      Viewport.insertComponent(this, name, config);
    });
  }


  zoom({ width, height, amount }) {
    let ratio = this.#viewBox.width / this.#viewBox.height
    let newVb = { x: 0, y: 0, width: 0, height: 0 }


    if (width && height && !amount) {
      newVb = { ...newVb, width, height }

    }

    else {
      newVb = {
        ...newVb,
        width: this.#viewBox + (width * ratio),
        height: this.#viewBox + (height * ratio)
      }

      this.#viewBox
    }
    if (zoomIn) {

      Object.assign(this.#viewBox, {
        width: vb.width - vb.width / 6,
        height: vb.height - vb.height / 4,
        y: (vb.y - vb.height / -8),
        x: (vb.x - vb.width / -12),
      })
    }

    // else if (isZoomOut && Math.abs(zoom.level) < zoom.limit) {
    else if (zoomOut) {
      // zoom.direction--

      Object.assign(vb, {
        width: vb.width + vb.width / 6,
        height: vb.height + vb.height / 4,
        y: (vb.y - vb.height / 8),
        x: (vb.x - vb.width / 12),
      })
    }

    Object.assign(this.viewBox, viewBox);

    Object.entries(layers).forEach(([name, config]) => {
      Viewport.insertComponent(this, name, config);
    });
  }

  appendObject(object) {
    return this.layers.objects.append(object.dom);
  }

  insertObject(type, options) {
    if (!ObjectRegistry.has(type)) throw new Error('Invalid Object Type. Type: ' + type);

    const objectsClass = ObjectRegistry.get(type);

    options = options ? options : {
      type,
      dimensions: {
        width: 16,
        height: 16,
      },
      point: this.origin,
      // point: {
      //   x: 0,
      //   y: 0,
      // },
    };

    const object = new objectsClass(this, options);

    this.objects.set(object.id, object);

    this.#domObjectMap.set(object.dom, object);

    this.appendObject(object);

    return this.components[type];
  }

  createSVGTransform() { return this.self.createSVGTransform() }
}