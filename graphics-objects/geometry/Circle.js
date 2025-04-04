import { GeometryObject } from './GeometryObject.js';



const getCirclePath = ({ point, radius }) => {
  return `
    M ${point.x}, ${point.y}
    M -${radius}, 0
    a ${radius},${radius} 0 1,0 ${radius * 2},0
    a ${radius},${radius} 0 1,0 -${radius * 2},0
  `.trim();
}

const circleVertices = [
  { x: 0, y: 0 },
  { x: 0, y: 8 },
];

export class CircleObject extends GeometryObject {
  constructor(svgContext, options) {
    if (!svgContext || !options) throw new Error('Invalid Context or Template passed to CircleObject');

    super(svgContext, 'circle', circleVertices, {
      ...options,
      dimensions: {
        ...options.dimensions,
        radius: options.dimensions.width / 2
      },
    }, getCirclePath);
  };

  get radius() { return this.vertices[0].y + this.vertices[1].y }
}