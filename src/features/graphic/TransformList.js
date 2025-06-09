/*
  THIS IS LATEST VERSION OF TRANSFORMLIST
*/

import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils, download } = ham;
export const roundTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100

const TransformListOptions = {
  transforms: Array,
}

const TransformMatrixMap = {
  e: 'tx',
  f: 'ty',
}

const DEFAULT_TRANSFORMS = {
  transforms: [
  {
    type: 'translate',
    values: [0, 0],
    position: 0,
  },
  {
    type: 'rotate',
    values: [0, 0, 0],
    position: 1,
  },
  {
    type: 'scale',
    values: [1, 1],
    position: 2,
  }, ]
};

const transformTypeMap = new Map([
  ['translate', SVGTransform.SVG_TRANSFORM_TRANSLATE],
  ['rotate', SVGTransform.SVG_TRANSFORM_ROTATE],
  ['scale', SVGTransform.SVG_TRANSFORM_SCALE],
])

export class TransformList {
  #self = null;
  #canvas = null;
  #transforms = null;
  #transformMap = new Map([
    [SVGTransform.SVG_TRANSFORM_TRANSLATE, null],
    [SVGTransform.SVG_TRANSFORM_ROTATE, null],
    [SVGTransform.SVG_TRANSFORM_SCALE, null],
  ]);
  
  constructor(svgCanvas, element, { transforms} = DEFAULT_TRANSFORMS) {
// console.warn('svgCanvas, element, { transforms } ', svgCanvas, element, transforms)
    this.#canvas = svgCanvas;
    this.#self = (element.dom ?? element).transform.baseVal;
    
    this.init(transforms);
  };
  
  init(transforms = []) {
    transforms.forEach(({ type, values }, i) => {
      const t = this.createTransform(type, ...(values || []))
      
      if (i === 0) {
        this.#self.initialize(t);
      }
      else {
        this.insert(t);
      }
      
      this.#transformMap.set(t.type, t)
    });
  }
  
  getMatrixAt(index = 0) {
    const { a, b, c, d, e, f } = index < this.#self.numberOfItems ? this.#self.getItem(index).matrix : null;
    
    return [a, b, c, d, e, f].some(_ => isNaN(_)) ? null : { a, b, c, d, e, f, }
  }
  
  createTransform(typeName, ...values) {
    typeName = typeName.toLowerCase();
    
    const t = this.#canvas.createSVGTransform();
    
    switch (typeName) {
      case 'translate': {
        t.setTranslate(...values);
        break;
      }
      case 'rotate': {
        t.setRotate(...values);
        break;
      }
      case 'scale': {
        t.setScale(...values);
        break;
      }
      default: {}
    }
    
    return t;
  }
  
  consolidate() {
    return this.#self.consolidate();
  }
  
  translateTo(x = 0, y = 0) {
    this.#transformMap
      .get(SVGTransform.SVG_TRANSFORM_TRANSLATE)
      .setTranslate(x, y);
    
    return this;
  }
  
  rotateTo(deg = 0, x = 0, y = 0) {
    this.#transformMap
      .get(SVGTransform.SVG_TRANSFORM_ROTATE)
      .setRotate(deg, x, y);
    
    return this;
  }
  
  scaleTo(x = 1, y = 1) {
    this.#transformMap
      .get(SVGTransform.SVG_TRANSFORM_SCALE)
      .setScale(x, y);
    
    return this;
  }
  
  insert(transform, beforeIndex) {
    if (!beforeIndex) {
      this.#self.appendItem(transform)
    } else {
      this.#self.insertItemBefore(transform, beforeIndex)
    }
    
    return this;
  }
  
  getItem(index) {
    return this.#self.getItem(index)
  }
  
  get transforms() {
    return {
      translate: this.getItem(0),
      rotate: this.getItem(1),
      scale: this.getItem(2),
    }
  }
  
  get transformItems() { return [...this.#self] };
  
  
  get translation() {
    return {
      x: roundTwo(this.getMatrixAt(0).e),
      y: roundTwo(this.getMatrixAt(0).f),
    }
  }
  
  get rotation() {
    return {
      x: roundTwo(this.getMatrixAt(1).b),
      y: roundTwo(this.getMatrixAt(1).c),
    }
  }
  
  get scale() {
    return {
      x: roundTwo(this.getMatrixAt(2).a),
      y: roundTwo(this.getMatrixAt(2).d),
    }
  }
}