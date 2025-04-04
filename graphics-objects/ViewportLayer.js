import { GraphicObject } from './GraphicObject.js';
// import { Component } from './Component.js';
import { ObjectRegistry } from '../graphics-objects/ObjectRegistry.js';

const ViewportLayerOptions = {
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
}


export class ViewportLayer extends GraphicObject {
  constructor(context, type, options) {
    super(context, type, { ...options, id: type, point: { x: 0, y: 0, }, dimensions: { width: 0, height: 0 } })

    // Object.entries(options.components).forEach(([type, config]) => {
    //     ViewportLayer.insertComponent(this, type, config)
    //   });
  };
}


// export class Viewport extends Component {
//   #viewBox = null;
//   #objects = new Map();
//   #domObjectMap = new Map();
//   #layers = new Map([
//     ['surface', null],
//     ['objects', null],
//   ]);


//   constructor(context, name, options) {
//     const { viewBox, layers, objects, ...opts } = options

//     super(context, name, { ...opts, id: name });

//     this.init({ viewBox, layers });
//   };

//   get objects() { return this.#objects }

//   init({ viewBox, layers }) {
//     Object.assign(this.viewBox, viewBox);

//     Object.entries(layers).forEach(([name, config]) => {
//       Viewport.insertComponent(this, name, config)
//     });
//   }

//   appendObject(object) {
//     return this.layers.objects.append(object.dom);
//   }

//   insertObject(type, options) {
//     if (!ObjectRegistry.has(type)) throw new Error('Invalid Object Type. Type: ' + type);

//     const objectsClass = ObjectRegistry.get(type)

//     const object = new objectsClass(this, options)

//     this.objects.set(object.id, object);

//     this.#domObjectMap.set(object.dom, object);

//     // placeholder.replaceWith(objects.dom);
//     this.appendObject(object)
//     return this.components[type]
//   }

// }