import { GeometryObject } from './GeometryObject.js';


const _triangleVertices = [
  { x: 0, y: -8 },
  { x: 8, y: 8 },
  { x: -8, y: 8 },
];
const triangleVertices = [
  { x: 8, y: 0 },
  { x: 16, y: 16 },
  { x: 0, y: 16 },
];


export class TriangleObject extends GeometryObject {

  constructor(svgContext, options) {
    if (!svgContext || !options) throw new Error('Invalid Context or Template passed to TriangleObject');

    super(svgContext, 'triangle', triangleVertices, options);
    // console.log('triangle', this);

    this.vertices.forEach(({ dom }, i) => {
      dom.setAttribute('cx', 0);
      dom.setAttribute('cy', 0);

    });
    this.slots.object.setAttribute('transform', `translate(${-8},${-8})`)
  };
}