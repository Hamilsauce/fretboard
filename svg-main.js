import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { Application } from './components/Application.js';

const { utils } = ham;

const getPlaceholder = (el, name) => el.querySelector(`[data-component-placeholder="${name}"]`)

const createObjectTemplate = (context, type) => {
  const container = this.templates.querySelector('.object-container').cloneNode(true);

  const obj = this.templates.querySelector(`[data-object-type="${objectType}"]`).cloneNode(true);

  container.dataset.objectType = objectType;
  container.dataset.type = objectType;

  container.querySelector('.object-slot').append(obj)

  return container;
}

const getSVGTemplate = (context, type, options) => {
  const template = context
    .querySelector('#templates')
  
    .querySelector(`[data-component="${type}"]`)
    .cloneNode(true);

  template.dataset.type = type;

  return template;
}

const insertComponent = (context, name, options) => {
  let template = null;
  let placeholder = null;

  if (context instanceof SVGElement) {
    placeholder = getPlaceholder(context, name);

    template = getSVGTemplate(context, name);
  }

  else if (context instanceof HTMLElement || context === document) {
    placeholder = getPlaceholder(context, name);

    template = ham.template(name);
  }

  if (options) Object.assign(template, options);

  placeholder.replaceWith(template);

  return template;
};



const svg = document.createElementNS(SVG_NS, 'svg')

const application = new Application();


// ZOOM
setTimeout(() => {
  const hud = application.components.canvas.layers.hud
  const scene = application.components.canvas.layers.scene

  // console.log('hud.dom', hud.dom);

  hud.dom.addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()

    const vb = scene.dom.viewBox.baseVal
    const zoomIn = e.target.closest('#hud-zoomIn')
    const zoomOut = e.target.closest('#hud-zoomOut')
    const isZoomIn = e.composedPath().some(el => el === hud.zoomIn)
    const isZoomOut = e.composedPath().some(el => el === hud.zoomOut)

    // if (isZoomIn && Math.abs(zoom.level) < zoom.limit) {
    if (zoomIn) {
      // zoom.direction++

      Object.assign(vb, {
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
  });



}, 1000)