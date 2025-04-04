import { GeometryObject } from './GeometryObject.js';

const lineVertices = [
  { x: -8, y: -8 },
  { x: 8, y: 8 },
];


export class LineObject extends GeometryObject {

  constructor(svgContext, options) {
    if (!svgContext || !options) throw new Error('Invalid Context or Template passed to LineObject');
    super(svgContext, 'line',lineVertices, options)
  };
}