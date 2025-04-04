import { GeometryObject } from './GeometryObject.js';

const rectVertices = [
  { x: -8, y: -8 },
  { x: 8, y: -8 },
  { x: 8, y: 8 },
  { x: -8, y: 8 },
];


export class RectObject extends GeometryObject {
  constructor(svgContext, options) {
    if (!svgContext || !options) throw new Error('Invalid Context or Template passed to RectObject');
    super(svgContext, 'rect', rectVertices, options);

  };
}