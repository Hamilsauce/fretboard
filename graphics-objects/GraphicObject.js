import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';
import { addDragAction } from '../modules/drag-stream.js';

import { TransformList } from './TransformList.js';
import { domPoint } from '../lib/utils.js';

const { template, DOM, utils } = ham;

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;

export const GraphicObjectOptions = {
  type: '',
  dimensions: {
    width: 16,
    height: 16,
  },
  point: { x: 0, y: 0 },
  selected: false,
  focused: false,
}

export class GraphicObject {
  #self;
  #name;
  #type;
  #context;
  #point = { x: 0, y: 0 };
  #dimensions = { width: 16, height: 16 };
  #transforms;
  #vertices;

  constructor(context, type, { point, dimensions, id } = GraphicObjectOptions) {
    if (!type) throw new Error('No type passed to constructor for ', this.constructor.name);

    this.#context = context;

    this.#self = GraphicObject.getTemplate(context, type);

    if (!this.#self) throw new Error('Failed to find/load a view class template. Class/template type: ' + type);

    this.#self.id = GraphicObject.uuid(type);

    this.#type = type;
    this.#point = point;
    this.#dimensions = dimensions;
    this.#dimensions.radius = this.#dimensions.radius || this.#dimensions.width / 2;
    this.dataset.id = id ? id : this.#self.id;

    this.#transforms = new TransformList(this, {
      transforms: [
        {
          type: 'translate',
          values: [this.point.x, this.point.y],
        },
        {
          type: 'rotate',
          values: [0, 0, 0],
        },
        {
          type: 'scale',
          values: [1, 1],
        },
      ],
    });

    if (context.state$) {
      this.focusState$ = context.state$
        .pipe(
          map(({ focusedObjectId }) => focusedObjectId),
          filter(id => this.focused || id === this.id),
          tap(id => {
            if (id === this.id) {
              this.focus(true)
            }
            else {
              this.focus(false)
            }
          }),
        )
        .subscribe()
    }

    this.clickHandler = this.handleClick.bind(this);

    this.self.addEventListener('click', this.clickHandler)
  }

  get self() { return this.#self };

  get type() { return this.#type };

  get context() { return this.#context };

  get object() { return this.slots.object.firstElementChild };

  get overlay() { return this.slots.overlay };

  get transforms() { return this.#transforms }

  get point() { return this.#point }

  get x() { return this.transforms.translation.x }

  get y() { return this.transforms.translation.y }

  get dimensions() { return this.#dimensions }

  get radius() { return this.dimensions.width / 2 }

  get classList() { return this.self.classList }

  set classList(val) { this.self.classList.add(...val) }

  get dataset() { return this.self.dataset };

  get selected() { return this.dataset.selected === 'true' ? true : false };

  get focused() { return this.dataset.focused === 'true' ? true : false };

  set dataset(propMap) { Object.entries(propMap).forEach(([prop, value]) => this.dataset[prop] = value) }

  get textContent() { return this.self.textContent };

  set textContent(v) { this.dom.textContent = v }

  get id() { return this.#self.id };

  get dom() { return this.#self };

  get name() { return this.#name };

  get boundingBoxRect() {
    return this.querySelector('.object-bounding-box')
  }

  get bounds() {
    if (!this.object) return {
      ...this.point,
      ...this.dimensions,
      left: this.point.x + this.point.x,
      right: this.point.x - this.point.x,
      top: this.point.y + this.point.y,
      bottom: this.point.y - this.point.y,
    }

    const { x, y, width, height } = this.object.getBBox()

    return {
      x: this.x,
      y: this.y,
      left: this.x + x,
      right: this.x - x,
      top: this.y + y,
      bottom: this.y - y,
      width,
      height,
      vertices: this.vertices
    }
  }

  get slots() {
    return {
      object: this.querySelector('.object-slot'),
      vertices: this.querySelector('.vertices-slot'),
      overlay: this.querySelector('.overlay-slot'),
    }
  }

  static uuid(name) { return (name.slice(0, 1).toLowerCase() || 'o') + utils.uuid(); }

  static getTemplate(context, type, options) {
    const container = context.templates.querySelector('.object-container').cloneNode(true);
    const sel = context.templates.querySelector(`[data-template="object-selector"]`).cloneNode(true);

    container.querySelector(`.overlay-slot`).append(sel);

    delete container.dataset.template;
    container.dataset.type = type;
    container.dataset.component = type;

    return container;
  }

  create() {
    throw 'Must define create in child class of view. Cannot call create on View Class. '
  }

  init(options) {
    throw 'Must define init in child class of view. Cannot call create on View Class. '
  }

  translate({ x, y }) {
    this.transforms.translateTo(x, y);
  }

  rotate({ x, y }) {
    this.transforms.rotateTo(x, y);
  }

  scale({ x, y }) {
    this.transforms.scaleTo(x, y);;
  }

  slotObject(nameOrDOM) {
    const obj = typeof nameOrDOM === 'string' ?
      this.context.templates.querySelector(`[data-template="${nameOrDOM}"]`).cloneNode(true) :
      nameOrDOM;

    if (!obj) throw new Error('Failed to find/load a component class template. Class/template name: ' + nameOrDOM);

    delete obj.dataset.template;

    this.slots.object.innerHTML = '';
    this.slots.object.append(obj);
  }

  select(state) {
    this.dataset.selected = state ? state : !this.selected;
  }

  stopDrag() {}

  setStyle(styleObject = {}) {
    Object.assign(this.body.style, styleObject)
  }

  createSVGTransform() { return this.context.createSVGTransform() }

  removeDOM(selector) {
    const result = this.querySelector(selector);

    if (result) result.remove();
  }

  getAttribute(key) {
    return this.self.getAttribute(key);
  }

  setAttribute(key, value) {
    return this.self.setAttribute(key, value);
  }

  querySelector(selector) {
    return this.self.querySelector(selector);
  }

  querySelectorAll(selector) {
    return [...this.self.querySelectorAll(selector)];
  }

  emit(label, e) {
    const { x, y } = this.adaptEvent(e);

    this.self.dispatchEvent(new CustomEvent('objectevent', {
      bubbles: true,
      detail: { action: label, objectId: this.id, object: this, x, y, type: e.type }
    }));
  }

  handleClick(e) {
    this.emit('objectclick', e);
  }

  adaptEvent({ context, target, clientX, clientY } = new PointerEvent()) {
    return domPoint((target ? target : context), clientX, clientY);
  };
};