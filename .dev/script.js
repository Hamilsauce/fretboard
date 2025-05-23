import { svgTemplater, SvgApi, CanvasElement } from '../svg-api-bundle/index.js';

await svgTemplater.load('../svg-api-bundle/templates.svg')
const canvasEl = document.querySelector('#svg-canvas');
const sceneEl = canvasEl.querySelector('#scene');
const svgApi = new SvgApi(canvasEl)

// console.warn('svgTemplater.templates', svgTemplater.templates)
const connectorTemplate = svgTemplater.get('connector')
const connector1 = new CanvasElement({
  template: connectorTemplate,
  type: 'line'
})

sceneEl.append(connector1.dom)
// console.warn('svgTemplater.has(node)', svgTemplater.has('node'))
// console.warn('.connector1', connector1.dom)