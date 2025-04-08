import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { createCustomEvent } from './create-event.js';
const { template, utils, download, TwoWayMap } = ham;

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;


export class SVGCanvas extends EventTarget {
  #self = null;

  constructor(svg) {
    super();

    this.#self = svg;

    this.clickDOM$ = fromEvent(this.#self, 'click')
      .pipe(
        tap(e => {
          e.preventDefault();
          e.stopPropagation();
        }),
      );

    this.eventEmits$ = this.clickDOM$
      .pipe(
        map(({ type, target, clientX, clientY }) => {
          const point = this.domPoint(clientX, clientY)

          return {
            type,
            detail: {
              target,
              x: point.x,
              y: point.y,
            }
          }
        }),
        map(({ type, detail }) => createCustomEvent(type, detail)),
        tap((event) => this.dispatchEvent(event)),
      );

    this.clickDOMSubscription = this.eventEmits$.subscribe();
  }

  get dom() { return this.#self }

  get viewBox() { return this.#self.viewBox.baseVal }

  
  domPoint(x, y) {
    return new DOMPoint(x, y).matrixTransform(
      this.dom.getScreenCTM().inverse()
    );
  }

  createDOM(type, { classList, width, height, x, y, text, dataset }) {
    const g = document.createElementNS(SVG_NS, 'g');
    const el = document.createElementNS(SVG_NS, type);

    Object.assign(g.dataset, dataset);
    
    g.setAttribute('transform', `translate(${dataset.x},${dataset.y})`);
    g.classList.add(...(classList || ['tile']));
    g.id = 'rect' + utils.uuid();

    r.setAttribute('width', width);
    r.setAttribute('height', height);

    g.append(r);

    if (text) {
      g.append(createText({ textContent: text }));
    }

    return g;
  }
  
  createRect({ classList, width, height, x, y, text, dataset }) {
    const g = document.createElementNS(SVG_NS, 'g');
    const r = document.createElementNS(SVG_NS, 'rect');

    Object.assign(g.dataset, dataset);
    g.setAttribute('transform', `translate(${dataset.x},${dataset.y})`);
    g.classList.add(...(classList || ['tile']));
    g.id = 'rect' + utils.uuid();

    r.setAttribute('width', width);
    r.setAttribute('height', height);

    g.append(r);

    if (text) {
      g.append(createText({ textContent: text }));
    }

    return g;
  }

  createText({ textContent }) {
    const textNode = document.createElementNS(SVG_NS, 'text');
    textNode.style.fontSize = '0.0175rem';
    textNode.style.textAlign = 'center';
    textNode.textContent = textContent;
    textNode.setAttribute('transform', 'translate(0.3,0.60)');

    return textNode;
  };

  getPixelAspectRatio() {
    const { width, height } = this.#self.getBoundingClientRect();

    return width / height;
  }

  getAspectRatio() {
    const { width, height } = this.#self.getBBox();

    return width / height;
  }

  
  querySelector(selector) { return this.#self.querySelector(selector) }
  
  querySelectorAll(selector) { return [...this.#self.querySelectorAll(selector)] }
}